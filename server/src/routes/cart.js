import { Router } from 'express';

// Prices and names always come from products, so the client can never influence them.
const SELECT_ITEMS = `
  SELECT ci.product_id, p.name, p.emoji, p.price_cents, ci.quantity
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
  ORDER BY ci.id
`;

/** Builds the cart response every endpoint answers with. */
function getCart(db) {
  const items = db.prepare(SELECT_ITEMS).all().map((row) => ({
    productId: row.product_id,
    name: row.name,
    emoji: row.emoji,
    priceCents: row.price_cents,
    quantity: row.quantity,
    lineTotalCents: row.price_cents * row.quantity,
  }));

  return { items, totalCents: items.reduce((sum, item) => sum + item.lineTotalCents, 0) };
}

// Checks the type instead of coercing it, so '2' is rejected rather than read as 2.
function isPositiveInt(value) {
  return Number.isInteger(value) && value > 0;
}

export function cartRouter(db) {
  const router = Router();

  router.get('/', (req, res) => {
    res.json(getCart(db));
  });

  router.post('/items', (req, res) => {
    const { productId, quantity = 1 } = req.body ?? {};
    if (!isPositiveInt(productId)) {
      return res.status(400).json({ error: 'productId must be a positive integer' });
    }
    if (!isPositiveInt(quantity)) {
      return res.status(400).json({ error: 'quantity must be a positive integer' });
    }

    const product = db.prepare('SELECT name, stock FROM products WHERE id = ?').get(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Stock limits the total units in the cart, not just the ones in this request.
    const line = db.prepare('SELECT quantity FROM cart_items WHERE product_id = ?').get(productId);
    if ((line?.quantity ?? 0) + quantity > product.stock) {
      return res.status(409).json({
        error: product.stock === 0
          ? `${product.name} is out of stock`
          : `${product.name}: only ${product.stock} in stock`,
      });
    }

    db.prepare(`
      INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)
      ON CONFLICT(product_id) DO UPDATE SET quantity = quantity + excluded.quantity
    `).run(productId, quantity);

    res.status(201).json(getCart(db));
  });

  router.delete('/items/:productId', (req, res) => {
    const productId = Number(req.params.productId);
    if (!isPositiveInt(productId)) return res.status(404).json({ error: 'Product not in cart' });

    const { changes } = db.prepare('DELETE FROM cart_items WHERE product_id = ?').run(productId);
    if (Number(changes) === 0) return res.status(404).json({ error: 'Product not in cart' });

    res.json(getCart(db));
  });

  return router;
}
