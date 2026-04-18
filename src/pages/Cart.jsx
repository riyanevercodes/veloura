import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartItem from '../components/CartItem'
import { formatPrice } from '../utils/formatPrice'

export default function Cart() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/shop'
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart()

  const [isOpen, setIsOpen] = useState(true)

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (sum, i) => sum + Number(i.price) * Number(i.quantity),
      0
    )
  }, [cartItems])

  function closeAndNavigate(to) {
    setIsOpen(false)
    window.setTimeout(() => navigate(to), 220)
  }

  function handleClose() {
    closeAndNavigate(from)
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') handleClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [from])

  function handleCheckout() {
    // Drawer will unmount on route change; checkout route handles auth redirect.
    navigate('/checkout')
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/10 transition-opacity duration-220 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 h-screen w-full sm:w-[30%] min-w-[320px] max-w-[460px] translate-x-0 bg-white transition-transform duration-220 ease-out shadow-[0_20px_50px_rgba(0,0,0,0.08)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Cart"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-lg font-medium tracking-tight text-gray-900">
              Cart
            </h2>
            <div className="flex items-center gap-3">
              {cartItems.length ? (
                <button
                  type="button"
                  onClick={clearCart}
                  className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm text-gray-900 transition duration-200 hover:bg-[#f5f5f5]"
                >
                  Clear
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm text-gray-900 transition duration-200 hover:bg-[#f5f5f5]"
              >
                Close
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {cartItems.length ? (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-10 text-center">
                <h3 className="text-xl font-medium text-gray-900">
                  Your cart is empty
                </h3>
              </div>
            )}
          </div>

          <div className="border-t border-black/5 bg-white px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={!cartItems.length}
              className="mt-4 w-full rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white transition duration-200 ease-out hover:bg-black/90 hover:scale-[1.01] disabled:opacity-60"
            >
              Checkout
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

