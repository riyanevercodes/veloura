import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';


export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (sum, i) => sum + Number(i.price) * Number(i.quantity),
      0
    );
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-gray-50 p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
        <Link
          to="/shop"
          className="mt-8 inline-block rounded-xl bg-black px-8 py-3 text-sm font-bold text-white transition-all hover:bg-gray-900"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 flex items-end justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Cart</h1>
          <button 
            onClick={clearCart}
            className="text-sm font-medium text-gray-500 hover:text-red-600"
          >
            Clear all
          </button>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:gap-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 md:h-32 md:w-32">
                  <img
                    src={item.image || '/placeholder-product.png'}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between py-1">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 md:text-base">{item.name}</h3>
                      <p className="mt-1 text-sm font-bold text-gray-900">{formatPrice(item.price)}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="text-gray-400 hover:text-red-500"
                      title="Remove from cart"
                      aria-label="Remove from cart"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-gray-100 bg-gray-50 p-1">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-white"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-white"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="mt-8 w-full rounded-2xl bg-black py-4 text-sm font-bold text-white transition-all hover:bg-gray-900 active:scale-[0.98]"
              >
                Proceed to Checkout
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
