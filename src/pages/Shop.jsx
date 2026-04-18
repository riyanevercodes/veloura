import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../services/productsService'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

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

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [products])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const min = minPrice === '' ? null : Number(minPrice)
    const max = maxPrice === '' ? null : Number(maxPrice)

    return products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false
      if (category !== 'All' && p.category !== category) return false
      if (min !== null && Number.isFinite(min) && p.price < min) return false
      if (max !== null && Number.isFinite(max) && p.price > max) return false
      return true
    })
  }, [products, category, search, minPrice, maxPrice])

  return (
    <section className="px-4">
      <div className="mx-auto max-w-6xl">
        <div className="space-y-8">
          <header>
            <h1 className="text-4xl font-medium tracking-tight text-gray-900">
              Shop
            </h1>
            <p className="mt-3 text-gray-600">
              Discover the latest pieces. Minimal, elevated, and made to last.
            </p>
          </header>

          <div className="flex items-start gap-10">
            {/* Desktop sidebar */}
            <aside className="hidden w-72 lg:block">
              <div className="rounded-xl bg-[#f5f5f5] p-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-800">
                      Search
                    </label>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by name..."
                      className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none transition duration-200 ease-out focus:border-black/20 focus:ring-1 focus:ring-black/10 hover:bg-[#f5f5f5]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none transition duration-200 ease-out hover:bg-[#f5f5f5] focus:border-black/20 focus:ring-1 focus:ring-black/10"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800">
                      Price range
                    </label>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min"
                        className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none transition duration-200 ease-out focus:border-black/20 focus:ring-1 focus:ring-black/10 hover:bg-[#f5f5f5]"
                      />
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max"
                        className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none transition duration-200 ease-out focus:border-black/20 focus:ring-1 focus:ring-black/10 hover:bg-[#f5f5f5]"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCategory('All')
                      setSearch('')
                      setMinPrice('')
                      setMaxPrice('')
                    }}
                    className="w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 ring-1 ring-black/5 transition duration-200 ease-out hover:bg-[#f5f5f5]"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              <div className="mb-8 lg:hidden">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none transition duration-200 ease-out focus:border-black/20 focus:ring-1 focus:ring-black/10 hover:bg-[#f5f5f5]"
                />
              </div>

              {loading ? (
                <div className="py-16 text-center text-gray-600">Loading products...</div>
              ) : filtered.length ? (
                <div className="space-y-8">
                  <div className="text-sm text-gray-600">
                    {filtered.length} item{filtered.length === 1 ? '' : 's'}
                  </div>

                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                    {filtered.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-gray-600">
                  No products match your filters.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

