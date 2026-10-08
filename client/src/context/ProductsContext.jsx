import { createContext, useContext, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts.js';

const ProductsContext = createContext(null);

/** Loads the catalogue once and shares it with every consumer. */
export function ProductsProvider({ children }) {
  const { products, loading, error } = useProducts();
  const value = useMemo(() => ({ products, loading, error }), [products, loading, error]);

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProductsContext() {
  const value = useContext(ProductsContext);
  if (!value) throw new Error('useProductsContext must be used inside a ProductsProvider');
  return value;
}
