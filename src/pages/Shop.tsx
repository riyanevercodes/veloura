import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productsService';
import { Product } from '../types';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      try {
        const list = await getProducts();
        if (!ignore) setProducts(list);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set).sort() as string[]];
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const min = minPrice === '' ? null : Number(minPrice);
    const max = maxPrice === '' ? null : Number(maxPrice);

    return products.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q)) return false;
      if (category !== 'All' && p.category !== category) return false;
      if (min !== null && Number.isFinite(min) && p.price < min) return false;
      if (max !== null && Number.isFinite(max) && p.price > max) return false;
      return true;
    });
  }, [products, category, search, minPrice, maxPrice]);

  return (
    <section className="px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="space-y-8">
          <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                Shop
              </h1>
              <p className="mt-2 text-gray-600">
                Discover our curated collection of premium essentials.
              </p>
            </div>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 md:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filters
            </button>
          </header>

          <div className="flex flex-col gap-10 md:flex-row">
            {/* Sidebar Filters */}
            <aside className={`${isFilterOpen ? 'block' : 'hidden'} w-full space-y-6 md:block md:w-64`}>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:sticky md:top-24">
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Search</label>
                    <div className="relative mt-2">
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Category</label>
                    <div className="mt-2 flex flex-wrap gap-2 md:flex-col md:items-start">
                      {categories.map((c) => (
                        <button
                          key={c}
                          onClick={() => setCategory(c)}
                          className={`rounded-full px-4 py-1.5 text-sm transition-all ${
                            category === c 
                              ? 'bg-black text-white' 
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Price Range</label>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm focus:border-black focus:bg-white focus:outline-none"
                      />
                      <span className="text-gray-300">/</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm focus:border-black focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCategory('All');
                      setSearch('');
                      setMinPrice('');
                      setMaxPrice('');
                      setIsFilterOpen(false);
                    }}
                    className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-semibold transition-all hover:bg-gray-50 active:scale-95"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-gray-50"></div>
                  ))}
                </div>
              ) : filtered.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 rounded-full bg-gray-50 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
