import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductById } from '../services/productsService';
import { formatPrice } from '../utils/formatPrice';
import { Product } from '../types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!id) return;
      setLoading(true);
      setError('');
      try {
        const p = await getProductById(id);
        if (ignore) return;
        if (!p) {
          setProduct(null);
          setError('Product not found.');
          return;
        }
        setProduct(p);
      } catch (e: any) {
        if (ignore) return;
        setError(e?.message || 'Failed to load product.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [id]);

  function handleAdd() {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/cart');
  }

  if (loading) return <div className="py-20 text-center text-gray-500">Loading product...</div>;
  
  if (error || !product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">{error || 'Product not found'}</h2>
        <Link className="mt-4 inline-block text-black underline" to="/shop">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <section className="pb-32 pt-6 md:pb-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image Section */}
          <div className="overflow-hidden rounded-3xl bg-gray-50">
            <img
              src={product.image_url || '/placeholder-product.png'}
              alt={product.title}
              className="aspect-square w-full object-cover md:aspect-[4/5]"
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center space-y-8">
            <nav className="text-sm text-gray-500">
              <Link to="/shop" className="hover:text-black">Shop</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.category}</span>
            </nav>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                {product.title}
              </h1>
              <p className="text-2xl font-medium text-gray-900">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="prose prose-sm text-gray-600">
              <p className="leading-relaxed">{product.description}</p>
            </div>

            <div className="hidden space-y-6 md:block">
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl border border-gray-200 p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-12 text-center text-sm font-bold focus:outline-none"
                    aria-label="Quantity"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Total: <span className="font-bold text-gray-900">{formatPrice(product.price * quantity)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={!product.in_stock}
                className={`w-full rounded-2xl py-4 text-sm font-bold transition-all active:scale-[0.98] ${
                  product.in_stock 
                    ? 'bg-black text-white hover:bg-gray-900' 
                    : 'cursor-not-allowed bg-gray-200 text-gray-500'
                }`}
              >
                {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/80 p-4 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-4">
          <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-10 w-10 items-center justify-center"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-bold">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="flex h-10 w-10 items-center justify-center"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAdd}
            disabled={!product.in_stock}
            className={`flex-1 rounded-xl py-3.5 text-sm font-bold shadow-lg transition-all active:scale-95 ${
              product.in_stock 
                ? 'bg-black text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {product.in_stock ? `Add • ${formatPrice(product.price * quantity)}` : 'Out of Stock'}
          </button>
        </div>
      </div>
    </section>
  );
}
