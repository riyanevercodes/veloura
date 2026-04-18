import { formatPrice } from '../utils/formatPrice'

export default function CartItem({ item, onRemove, onUpdateQuantity }) {
  const { productId, name, price, quantity, image } = item

  return (
    <div className="flex gap-3 rounded-lg p-2 transition duration-200 ease-out hover:bg-[#f5f5f5]">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-[#f5f5f5]">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="line-clamp-2 text-sm font-semibold text-gray-900">
              {name}
            </p>
            <p className="text-sm text-gray-700">{formatPrice(price)}</p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(productId)}
            className="rounded-md border border-black/10 bg-white px-2 py-1 text-sm text-gray-900 transition duration-200 hover:bg-[#f5f5f5]"
            aria-label={`Remove ${name}`}
          >
            Remove
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateQuantity(productId, quantity - 1)}
              className="h-8 w-8 rounded-md border border-black/10 bg-white text-gray-900 transition duration-200 hover:bg-[#f5f5f5]"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) =>
                onUpdateQuantity(productId, Number(e.target.value))
              }
              className="h-8 w-20 rounded-md border border-black/10 bg-white px-2 text-center text-sm outline-none transition duration-200 ease-out focus:border-black/20 focus:ring-1 focus:ring-black/10"
            />
            <button
              type="button"
              onClick={() => onUpdateQuantity(productId, quantity + 1)}
              className="h-8 w-8 rounded-md border border-black/10 bg-white text-gray-900 transition duration-200 hover:bg-[#f5f5f5]"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="text-sm font-semibold text-gray-900">
            {formatPrice(price * quantity)}
          </div>
        </div>
      </div>
    </div>
  )
}

