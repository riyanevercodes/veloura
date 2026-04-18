import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, authError, loading } = useAuth()

  const from = location.state?.from || '/shop'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(form)
      navigate(from)
    } catch (err) {
      setError(err?.message || 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-md space-y-4 px-4">
      <div className="rounded-xl ring-1 ring-black/5 bg-white p-6">
        <h1 className="text-xl font-bold text-gray-900">Login</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to add items to your cart and checkout.
        </p>

        {error || authError ? (
          <div className="mt-4 rounded-md ring-1 ring-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error || authError}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              type="email"
              autoComplete="email"
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none transition duration-200 ease-out focus:border-black/20 focus:ring-1 focus:ring-black/10 hover:bg-[#f5f5f5]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              type="password"
              autoComplete="current-password"
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none transition duration-200 ease-out focus:border-black/20 focus:ring-1 focus:ring-black/10 hover:bg-[#f5f5f5]"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full rounded-md bg-black px-4 py-2 text-white transition duration-200 ease-out hover:bg-black/90 disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link className="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-700" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  )
}

