import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../utils/formatPrice';
import { clientConfig } from '../config/client.config';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0),
    [cartItems]
  );

  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!cartItems.length) {
      setError('Your cart is empty.');
      return;
    }
    if (!form.name.trim() || !form.address.trim() || !form.phone.trim()) {
      setError('All fields are required.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Insert Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          store_id: clientConfig.defaultStoreId, // Reserved for Phase 3
          customer_name: form.name,
          phone: form.phone,
          address: form.address,
          total_amount: totalPrice,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert Order Items
      // Guard: product_id must be a valid UUID or null (old cart items may have slug-style ids)
      const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const toUUID = (id: string): string | null => UUID_RE.test(id) ? id : null;

      const orderItems = cartItems.map((i) => ({
        order_id: order.id,
        product_id: toUUID(i.productId),
        product_title: i.name,
        product_price: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Success -> Clear cart and Navigate to confirmation
      clearCart();
      
      // Construct WhatsApp message
      const itemsList = cartItems.map(i => `${i.name} x${i.quantity}`).join(', ');
      const waMsg = `Hello! I placed an order on ${clientConfig.storeName}. Order ID: #${order.id.slice(0, 8)} | Items: [${itemsList}] | Total: ${formatPrice(totalPrice)} | Address: ${form.address} | Phone: ${form.phone}`;
      const waUrl = `https://wa.me/${clientConfig.whatsappNumber}?text=${encodeURIComponent(waMsg)}`;

      navigate(`/order-confirmation/${order.id}`, { 
        state: { 
          orderId: order.id, 
          waUrl,
          customerName: form.name 
        } 
      });

    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <button onClick={() => navigate('/shop')} className="mt-4 text-black underline">
          Go to shop
        </button>
      </div>
    );
  }

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your order with Cash on Delivery.</p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Shipping Information</h2>
              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:bg-white focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:bg-white focus:outline-none"
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Delivery Address</label>
                  <textarea
                    required
                    rows={3}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:bg-white focus:outline-none"
                    placeholder="House no, street name, area, city, pincode"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-black bg-gray-50 p-4">
                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-black">
                  <div className="h-2.5 w-2.5 rounded-full bg-black"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay when your order reaches your doorstep.</p>
                </div>
              </div>
            </div>

            {error && <p className="text-sm font-medium text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-black py-4 text-sm font-bold text-white transition-all hover:bg-gray-900 active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? 'Placing Order...' : `Place Order • ${formatPrice(totalPrice)}`}
            </button>
          </form>

          {/* Order Summary */}
          <aside>
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              <div className="mt-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-600">{item.name} <span className="text-xs text-gray-400">× {item.quantity}</span></span>
                    <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}