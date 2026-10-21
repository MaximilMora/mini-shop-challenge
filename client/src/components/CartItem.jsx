import { useCart } from '../context/CartContext.jsx';
import { useAsyncAction } from '../hooks/useAsyncAction.js';
import { formatPrice } from '../utils/formatPrice.js';

/**
 * One cart line. It is its own component because each row needs its own pending
 * and error state, and hooks cannot be called from inside a map().
 */
export default function CartItem({ item }) {
  const { removeItem } = useCart();
  const { run, pending, error } = useAsyncAction(removeItem);

  return (
    <li className="cart-item">
      <span>{item.emoji} {item.name}</span>
      <strong>{formatPrice(item.lineTotalCents)}</strong>
      <span className="muted small">
        {formatPrice(item.priceCents)} × {item.quantity}
      </span>
      <button
        className="secondary small"
        aria-label={`Remove ${item.name}`}
        disabled={pending}
        onClick={() => run(item.productId)}
      >
        {pending ? 'Removing…' : 'Remove'}
      </button>
      {error && <p className="error small">{error}</p>}
    </li>
  );
}
