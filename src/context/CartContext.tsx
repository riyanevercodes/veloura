import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

const STORAGE_KEY = 'veloura_cart_v1';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage errors to keep the app usable.
    }
  }, [cartItems]);

  function addToCart(product: any, quantity = 1) {
    if (!product?.id) throw new Error('Missing product id.');
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 1) throw new Error('Quantity must be at least 1.');

    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.title || product.name,
          price: product.price,
          quantity: qty,
          image: product.image_url || product.image,
        },
      ];
    });
  }

  function removeFromCart(productId: string) {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function updateQuantity(productId: string, quantity: number) {
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: qty }
          : i
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const cartCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems]
  );

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
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
