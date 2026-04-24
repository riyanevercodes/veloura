import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../utils/formatPrice';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  }

  async function updateStatus(orderId: string, newStatus: OrderStatus) {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-orange-50 text-orange-600',
    confirmed: 'bg-blue-50 text-blue-600',
    shipped: 'bg-purple-50 text-purple-600',
    delivered: 'bg-green-50 text-green-600',
    cancelled: 'bg-gray-50 text-gray-500',
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">Manage customer orders and status</p>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {(['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all ${
                filter === s ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center text-gray-500">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-gray-100 bg-white py-20 text-center text-gray-500">
            No orders found matching this filter.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="flex flex-col border-b border-gray-50 bg-gray-50/30 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold font-mono text-gray-400">#{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${statusColors[order.status as OrderStatus]}`}>
                      {order.status}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-gray-900">{order.customer_name}</h3>
                  <p className="text-sm text-gray-500">{order.phone} • {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="mt-6 flex items-center gap-4 md:mt-0">
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900">{formatPrice(order.total_amount)}</p>
                  </div>
                  <select
                    aria-label="Order Status"
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold focus:border-black focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-xs font-bold text-gray-400">
                          {item.quantity}x
                        </div>
                        <span className="font-semibold text-gray-900">{item.product_title}</span>
                      </div>
                      <span className="text-gray-500">{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 border-t border-gray-50 pt-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Shipping Address</p>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{order.address}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
