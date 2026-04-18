import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'veloura_cart_v1'

const CartContext = createContext(null)

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
    } catch {
      // Ignore storage errors to keep the app usable.
    }
  }, [cartItems])

  function addToCart(product, quantity = 1) {
    if (!product?.id) throw new Error('Missing product id.')
    const qty = Number(quantity)
    if (!Number.isFinite(qty) || qty < 1) throw new Error('Quantity must be at least 1.')

    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: qty,
          image: product.image,
        },
      ]
    })
  }

  function removeFromCart(productId) {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  function updateQuantity(productId, quantity) {
    const qty = Number(quantity)
    if (!Number.isFinite(qty) || qty < 1) {
      // TRD: quantity must be >= 1, so treat invalid as remove.
      removeFromCart(productId)
      return
    }

    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: qty }
          : i
      )
    )
  }

  function clearCart() {
    setCartItems([])
  }

  const cartCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems]
  )

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [cartItems, cartCount]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

