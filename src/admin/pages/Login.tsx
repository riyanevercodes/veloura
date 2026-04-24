import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { clientConfig } from '../../config/client.config';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as any)?.from || '/admin/dashboard';

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl md:p-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{clientConfig.storeName} Admin</h1>
          <p className="mt-2 text-sm text-gray-500">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:bg-white focus:outline-none"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:bg-white focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-black py-4 text-sm font-bold text-white transition-all hover:bg-gray-900 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-400">
            Forgot password? Use the Supabase dashboard to reset it.
          </p>
        </div>
      </div>
    </div>
  );
}
