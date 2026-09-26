import { formatPrice } from '../utils/formatPrice.js';

export default function ProductCard({ product }) {
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
      {/* TODO: "Add to cart" button */}
    </article>
  );
}
