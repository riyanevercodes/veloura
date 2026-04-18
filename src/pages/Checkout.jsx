import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { supabase } from '../services/supabase'
import { formatPrice } from '../utils/formatPrice'

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cartItems, clearCart } = useCart()

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0),
    [cartItems]
  )

  const [form, setForm] = useState({ name: '', address: '', phone: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!cartItems.length) { setError('Your cart is empty.'); return }
    if (!form.name.trim() || !form.address.trim() || !form.phone.trim()) {
      setError('All fields are required.')
      return
    }

    setSubmitting(true)
    try {
      // Create a mock order object
      const newOrder = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        user_id: user.id,
        total_price: totalPrice,
        shipping_name: form.name,
        shipping_address: form.address,
        shipping_phone: form.phone,
        status: 'pending',
        created_at: new Date().toISOString(),
        order_items: cartItems.map((i) => ({
          id: Math.random().toString(36).substr(2, 9),
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        }))
      }

      // Save to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('dummyOrders') || '[]')
      localStorage.setItem('dummyOrders', JSON.stringify([newOrder, ...existingOrders]))

      clearCart()
      setSuccess(`Order placed! Order ID: ${newOrder.id}`)
    } catch (err) {
      setError(err?.message || 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!cartItems.length && !success) {
    return (
      <div className="mx-auto max-w-md rounded-xl ring-1 ring-black/5 bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900">Your cart is empty.</h2>
        <p className="mt-2 text-gray-700">
          Add items in <Link className="underline" to="/shop">Shop</Link>.
        </p>
      </div>
    )
  }

  return (
    <section className="px-4">
      <div className="mx-auto max-w-6xl space-y-8 py-10">
        <header>
          <h1 className="text-4xl font-medium tracking-tight text-gray-900">Checkout</h1>
          <p className="mt-3 text-gray-600">Review your order and enter shipping details.</p>
        </header>

        {error && (
          <div className="rounded-xl ring-1 ring-red-200 bg-red-50 p-4 text-red-700">{error}</div>
        )}

        {success ? (
          <div className="rounded-xl bg-[#f5f5f5] p-6 ring-1 ring-black/5">
            <h2 className="text-xl font-medium text-gray-900">Order placed successfully!</h2>
            <p className="mt-2 text-sm text-gray-600">{success}</p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => navigate('/orders')}
                className="rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition duration-200 ease-out hover:bg-black/90"
              >
                View my orders
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="rounded-md border border-black/10 bg-white px-5 py-3 text-sm font-medium text-gray-900 transition duration-200 ease-out hover:bg-[#f5f5f5]"
              >
                Continue shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-xl bg-white p-6 ring-1 ring-black/5">
                <h2 className="text-sm font-semibold text-gray-900">Shipping details</h2>
                <div className="mt-5 space-y-5">
                  {[
                    { label: 'Full name', key: 'name', placeholder: 'Your name' },
                    { label: 'Address', key: 'address', placeholder: 'Street address, city' },
                    { label: 'Phone number', key: 'phone', placeholder: '10-digit number' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-800">{label}</label>
                      <input
                        value={form[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none transition duration-200 ease-out focus:border-black/20 focus:ring-1 focus:ring-black/10 hover:bg-[#f5f5f5]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition duration-200 ease-out hover:bg-black/90 disabled:opacity-60"
              >
                {submitting ? 'Placing order...' : 'Place Order'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="w-full rounded-md border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition duration-200 ease-out hover:bg-[#f5f5f5]"
              >
                Back to cart
              </button>
            </form>

            <aside className="rounded-xl bg-white p-6 ring-1 ring-black/5">
              <h2 className="text-sm font-semibold text-gray-900">Order summary</h2>
              <div className="mt-5 space-y-3 text-sm text-gray-700">
                {cartItems.map((i) => (
                  <div key={i.productId} className="flex items-center justify-between gap-3">
                    <span className="truncate">{i.name} × {i.quantity}</span>
                    <span className="shrink-0">{formatPrice(Number(i.price) * Number(i.quantity))}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-4">
                <span className="text-gray-700">Total</span>
                <span className="text-lg font-semibold text-gray-900">{formatPrice(totalPrice)}</span>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}