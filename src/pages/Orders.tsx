import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabase'
import { formatPrice } from '../utils/formatPrice'

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    function fetchOrders() {
      try {
        const allOrders = JSON.parse(localStorage.getItem('dummyOrders') || '[]')
        // Filter orders for the current user
        const userOrders = allOrders.filter(o => o.user_id === user.id)
        setOrders(userOrders)
      } catch (err) {
        setError('Failed to load orders from local storage.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user.id])

  if (loading) return <div className="py-10 text-center text-gray-600">Loading orders...</div>

  if (error) return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-xl ring-1 ring-red-200 bg-red-50 p-4 text-red-700">{error}</div>
    </div>
  )

  return (
    <section className="px-4">
      <div className="mx-auto max-w-2xl py-10 space-y-8">
        <header>
          <h1 className="text-4xl font-medium tracking-tight text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">Your order history.</p>
        </header>

        {orders.length === 0 ? (
          <div className="rounded-xl ring-1 ring-black/5 bg-white p-8 text-center">
            <p className="text-gray-600">No orders yet.</p>
            <Link to="/shop" className="mt-4 inline-block rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-black/90">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl ring-1 ring-black/5 bg-white p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded-full bg-[#f5f5f5] px-3 py-1 text-xs font-medium text-gray-700 capitalize">
                      {order.status}
                    </span>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatPrice(order.total_price)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-black/5 pt-4 space-y-3">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-sm text-gray-700">
                      {item.image && (
                        <img src={item.image} alt={item.name}
                          className="h-12 w-12 rounded-md object-cover bg-[#f5f5f5]" />
                      )}
                      <span className="flex-1 truncate">{item.name}</span>
                      <span className="shrink-0 text-gray-500">× {item.quantity}</span>
                      <span className="shrink-0 font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {order.shipping_name && (
                  <p className="text-xs text-gray-500 border-t border-black/5 pt-3">
                    Delivering to: {order.shipping_name}, {order.shipping_address}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}