import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/formatPrice.js';

export default function Cart() {
  const { items, totalCents, loading, error } = useCart();

  return (
    <aside className="cart" aria-label="Cart">
      <h2>Your cart</h2>

      {loading && <p className="muted">Loading cart…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && items.length === 0 && <p className="muted">Your cart is empty.</p>}
      {items.length > 0 && (
        <>
          <ul className="cart-items">
            {items.map((item) => (
              <li key={item.productId} className="cart-item">
                <span>{item.emoji} {item.name}</span>
                <strong>{formatPrice(item.lineTotalCents)}</strong>
                <span className="muted small">
                  {formatPrice(item.priceCents)} × {item.quantity}
                </span>
              </li>
            ))}
          </ul>
          <p className="cart-total">
            <span>Total</span>
            <strong>{formatPrice(totalCents)}</strong>
          </p>
        </>
      )}
    </aside>
  );
}
