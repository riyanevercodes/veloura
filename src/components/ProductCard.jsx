import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-xl bg-[#f5f5f5]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full aspect-[3/4] object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs tracking-wide text-gray-900/70 backdrop-blur">
            Quick View
          </span>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="line-clamp-1 text-sm font-medium tracking-tight text-gray-900">
          {product.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-gray-600">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
}

