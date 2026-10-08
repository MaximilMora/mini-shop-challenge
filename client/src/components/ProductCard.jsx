import { formatPrice } from '../utils/formatPrice.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { addItem, quantityOf } = useCart();
  const atLimit = quantityOf(product.id) >= product.stock;

  return (
    <article className="card">
      <div className="card-image" aria-hidden="true">{product.emoji}</div>
      <h2>{product.name}</h2>
      <p className="muted">{product.description}</p>
      <div className="card-footer">
        <strong>{formatPrice(product.priceCents)}</strong>
        <span className="muted small">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </span>
      </div>
      <button disabled={atLimit} onClick={() => addItem(product)}>
        {product.stock === 0 ? 'Out of stock' : atLimit ? 'Max in cart' : 'Add to cart'}
      </button>
    </article>
  );
}
