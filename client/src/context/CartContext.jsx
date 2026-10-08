import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'mini-shop-cart';

const CartContext = createContext(null);

function readStoredItems() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * The cart is stored as [{ productId, quantity }], in the order products were first added.
 * Names and prices are not duplicated here: they are read from the catalogue when rendering.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredItems);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, quantity = 1) => {
    setItems((current) => {
      const line = current.find((item) => item.productId === product.id);
      const nextQuantity = (line?.quantity ?? 0) + quantity;
      if (nextQuantity > product.stock) return current;

      if (!line) return [...current, { productId: product.id, quantity: nextQuantity }];
      return current.map((item) =>
        item.productId === product.id ? { ...item, quantity: nextQuantity } : item
      );
    });
  }, []);

  const quantityOf = useCallback(
    (productId) => items.find((item) => item.productId === productId)?.quantity ?? 0,
    [items]
  );

  const totalUnits = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, addItem, quantityOf, totalUnits }),
    [items, addItem, quantityOf, totalUnits]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used inside a CartProvider');
  return value;
}
