import { Link } from 'react-router-dom';
import { Product } from '../types';
import { formatPrice } from '../utils/formatPrice';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link 
      to={`/product/${product.id}`} 
      className="group animate-fade-in block"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gray-50 card-shadow transition-all duration-500 group-hover:shadow-2xl">
        <img
          src={product.image_url || '/placeholder-product.png'}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {!product.in_stock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <span className="rounded-full bg-black px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-xl">
              Out of Stock
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full bg-gradient-to-t from-black/20 to-transparent p-6 transition-transform duration-500 group-hover:translate-y-0">
          <button className="w-full rounded-2xl bg-white py-3 text-xs font-bold text-black shadow-xl">
            Quick View
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {product.category || 'Collection'}
        </p>
        <h3 className="text-sm font-bold text-gray-900 group-hover:underline underline-offset-4 decoration-gray-200">
          {product.title}
        </h3>
        <p className="text-sm font-bold text-gray-900">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
