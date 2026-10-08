import { useCart } from '../context/CartContext.jsx';

export default function Header() {
  const { totalUnits } = useCart();

  return (
    <header className="header">
      <h1>🛍️ Mini Shop</h1>
      <span className="cart-badge" aria-label={`${totalUnits} items in cart`}>
        Cart · {totalUnits}
      </span>
    </header>
  );
}
