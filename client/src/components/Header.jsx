export default function Header() {
  // TODO: show the real number of items in the cart
  const itemCount = 0;

  return (
    <header className="header">
      <h1>🛍️ Mini Shop</h1>
      <span className="cart-badge" aria-label={`${itemCount} items in cart`}>
        Cart · {itemCount}
      </span>
    </header>
  );
}
