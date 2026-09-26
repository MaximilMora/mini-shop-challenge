import { Router } from 'express';

// Maps a DB row (snake_case) to the shape the API returns (camelCase).
export function toProduct(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    priceCents: row.price_cents,
    stock: row.stock,
    emoji: row.emoji,
  };
}

export function productsRouter(db) {
  const router = Router();

  router.get('/', (req, res) => {
    const rows = db.prepare('SELECT * FROM products ORDER BY id').all();
    res.json(rows.map(toProduct));
  });

  router.get('/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(req.params.id));
    if (!row) return res.status(404).json({ error: 'Product not found' });
    res.json(toProduct(row));
  });

  return router;
}
