import { formatPrice } from '../utils/formatPrice.js';
import { availableStock } from '../utils/cartMath.js';
import { useCart } from '../context/CartContext.jsx';
import { useAsyncAction } from '../hooks/useAsyncAction.js';

export default function ProductCard({ product }) {
  const { addItem, quantityOf } = useCart();
  const { run, pending, error } = useAsyncAction(addItem);
  // Visible stock = catalogue ceiling minus units already reserved in the (global) cart.
  const available = availableStock(product.stock, quantityOf(product.id));
  const atLimit = available <= 0;

  return (
    <article className="card">
      <div className="card-image" aria-hidden="true">{product.emoji}</div>
      <h2>{product.name}</h2>
      <p className="muted">{product.description}</p>
      <div className="card-footer">
        <strong>{formatPrice(product.priceCents)}</strong>
        <span className="muted small">
          {available > 0 ? `${available} in stock` : 'Out of stock'}
        </span>
      </div>
      <button disabled={atLimit || pending} onClick={() => run(product.id)}>
        {product.stock === 0 ? 'Out of stock'
          : pending ? 'Adding…'
          : atLimit ? 'Max in cart'
          : 'Add to cart'}
      </button>
      {error && <p className="error small">{error}</p>}
    </article>
  );
}
