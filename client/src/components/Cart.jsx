import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/formatPrice.js';
import CartItem from './CartItem.jsx';

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
              <CartItem key={item.productId} item={item} />
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
