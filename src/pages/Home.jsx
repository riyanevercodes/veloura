import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../services/productsService'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true)
      try {
        const list = await getProducts()
        if (!ignore) setProducts(list)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="space-y-16">
      {/* Hero */}
      <div className="relative w-full">
        <img
          src="https://plus.unsplash.com/premium_vector-1742709402010-22c507a177d2?q=80&w=2414&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="New collection hero"
          className="h-[50vh] min-h-[500px] w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-white/35" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="max-w-xl">
              <h1 className="text-5xl font-medium tracking-tight text-gray-900 leading-tight">
                New Collection
              </h1>
              <p className="mt-4 text-gray-600">
                Quiet essentials for an elevated everyday wardrobe.
              </p>
              <div className="mt-8">
                <Link
                  to="/shop"
                  className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition duration-200 ease-out hover:bg-black/90 hover:scale-[1.01]"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="mx-auto w-full max-w-6xl px-4">
        {loading ? (
          <div className="py-16 text-center text-gray-600">Loading...</div>
        ) : products.length ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-gray-600">No products available.</div>
        )}
      </div>
    </section>
  )
}

