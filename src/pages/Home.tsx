import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productsService';
import { clientConfig } from '../config/client.config';
import { Product } from '../types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <section className="space-y-20 pb-20">
      {/* Hero */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000"
          alt="Premium collection hero"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="max-w-xl text-white">
              <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
                {clientConfig.storeName}
              </h1>
              <p className="mt-6 text-lg font-medium opacity-90 md:text-xl">
                {clientConfig.tagline}
              </p>
              <div className="mt-10">
                <Link
                  to="/shop"
                  className="inline-block w-full rounded-2xl bg-white px-8 py-4 text-center text-sm font-bold text-black transition-all hover:scale-105 active:scale-95 sm:w-auto"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="mx-auto w-full max-w-6xl px-4">
        <header className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Featured Pieces</h2>
          <p className="mt-4 text-gray-500">Carefully curated for the modern minimalist.</p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-gray-50"></div>
            ))}
          </div>
        ) : products.length ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-gray-400">No products available.</div>
        )}

        <div className="mt-16 text-center">
          <Link
            to="/shop"
            className="text-sm font-bold text-gray-900 underline underline-offset-8 transition-all hover:text-gray-600"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
