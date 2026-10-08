import { useMemo } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useProductsContext } from '../context/ProductsContext.jsx';
import { buildCartView } from '../utils/cartView.js';
import { formatPrice } from '../utils/formatPrice.js';

export default function Cart() {
  const { items } = useCart();
  const { products, loading } = useProductsContext();
  const cart = useMemo(() => buildCartView(items, products), [items, products]);

  // Prices come from the catalogue, so a restored cart has nothing to show until it loads.
  const hydrating = loading && items.length > 0;

  return (
    <aside className="cart" aria-label="Cart">
      <h2>Your cart</h2>

      {hydrating && <p className="muted">Loading cart…</p>}
      {!hydrating && cart.items.length === 0 && <p className="muted">Your cart is empty.</p>}
      {!hydrating && cart.items.length > 0 && (
        <>
          <ul className="cart-items">
            {cart.items.map((item) => (
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
            <strong>{formatPrice(cart.totalCents)}</strong>
          </p>
        </>
      )}
    </aside>
  );
}
