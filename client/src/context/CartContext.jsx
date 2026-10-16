import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { addCartItem, fetchCart } from '../api.js';

const CartContext = createContext(null);

/**
 * The server owns the cart. Every mutation answers with the whole cart,
 * so there is nothing to recompute here beyond the badge count.
 */
export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], totalCents: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchCart()
      .then((data) => { if (!cancelled) setCart(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Errors are left to propagate so the card that fired the request can show them.
  const addItem = useCallback(async (productId, quantity) => {
    setCart(await addCartItem(productId, quantity));
  }, []);

  const quantityOf = useCallback(
    (productId) => cart.items.find((item) => item.productId === productId)?.quantity ?? 0,
    [cart]
  );

  const totalUnits = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const value = useMemo(
    () => ({ ...cart, loading, error, addItem, quantityOf, totalUnits }),
    [cart, loading, error, addItem, quantityOf, totalUnits]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used inside a CartProvider');
  return value;
}
