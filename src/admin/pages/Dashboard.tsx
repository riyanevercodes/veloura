import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../utils/formatPrice';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch Orders for stats
        const { data: orders } = await supabase.from('orders').select('status, total_amount');
        const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

        if (orders) {
          const totalOrders = orders.length;
          const totalRevenue = orders
            .filter((o) => o.status !== 'cancelled')
            .reduce((sum, o) => sum + Number(o.total_amount), 0);
          const pendingOrders = orders.filter((o) => o.status === 'pending').length;

          setStats({
            totalOrders,
            totalRevenue,
            pendingOrders,
            totalProducts: productCount || 0,
          });
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading stats...</div>;

  const cards = [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Orders', value: stats.totalOrders, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Orders', value: stats.pendingOrders, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Live Products', value: stats.totalProducts, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Overview of your store performance</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-3xl p-8 shadow-sm border border-gray-50 ${card.bg}`}>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{card.label}</p>
            <p className={`mt-4 text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              to="/admin/products/new"
              className="rounded-2xl bg-black px-6 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800"
            >
              Add New Product
            </Link>
            <Link
              to="/admin/orders"
              className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-bold text-gray-900 transition-all hover:bg-gray-50"
            >
              Manage Orders
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <p className="mt-4 text-sm text-gray-500">Feature coming soon: Live order notifications and inventory alerts.</p>
        </div>
      </div>
    </div>
  );
}
