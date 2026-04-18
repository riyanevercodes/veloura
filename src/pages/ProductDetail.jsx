import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getProductById } from '../services/productsService'
import { formatPrice } from '../utils/formatPrice'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const p = await getProductById(id)
        if (ignore) return
        if (!p) {
          setProduct(null)
          setError('Product not found.')
          return
        }
        setProduct(p)
      } catch (e) {
        if (ignore) return
        setError(e?.message || 'Failed to load product.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [id])

  function handleAdd() {
    if (!product) return
    addToCart(product, quantity)
    navigate('/cart')
  }

  if (loading) return <div className="py-10 text-center text-gray-600">Loading...</div>
  if (error) {
    return (
      <div className="rounded-xl ring-1 ring-red-200 bg-red-50 p-5 text-red-700">
        {error}{' '}
        <div className="mt-3">
          <Link className="underline underline-offset-4 hover:text-gray-900" to="/shop">
            Back to shop
          </Link>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <section className="px-4">
      <div className="mx-auto max-w-6xl py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
          <div className="group overflow-hidden rounded-xl bg-[#f5f5f5]">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            />
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-medium tracking-tight text-gray-900 leading-tight">
                {product.name}
              </h1>
              <p className="mt-4 text-2xl font-semibold text-gray-900">
                {formatPrice(product.price)}
              </p>
              <p className="mt-5 max-w-prose text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="rounded-xl bg-[#f5f5f5] p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-800">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="mt-2 w-28 rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none transition duration-200 ease-out focus:border-black/20 focus:ring-1 focus:ring-black/10 hover:bg-white"
                  />
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatPrice(product.price * quantity)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="mt-6 w-full rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition duration-200 ease-out hover:bg-black/90 hover:scale-[1.01]"
              >
                Add to Cart
              </button>

              <div className="mt-4 text-sm text-gray-600">
                Category:{' '}
                <span className="font-medium text-gray-900">
                  {product.category}
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <Link
                className="underline underline-offset-4 hover:text-gray-900"
                to="/shop"
              >
                Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

