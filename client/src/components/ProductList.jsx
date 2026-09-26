import { useProducts } from '../hooks/useProducts.js';
import ProductCard from './ProductCard.jsx';

export default function ProductList() {
  const { products, loading, error } = useProducts();

  if (loading) return <p className="muted">Loading products…</p>;
  if (error) return <p className="error">Could not load products: {error}</p>;

  return (
    <section className="product-grid" aria-label="Products">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
