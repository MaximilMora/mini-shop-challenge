import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SEED_PRODUCTS = [
  { name: 'Ceramic Mug', description: 'Hand-glazed, 350ml. Keeps your coffee company.', priceCents: 1450, stock: 12, emoji: '☕' },
  { name: 'Linen Tote Bag', description: 'Sturdy everyday bag with an inside pocket.', priceCents: 2200, stock: 5, emoji: '👜' },
  { name: 'Desk Plant', description: 'A low-maintenance succulent in a clay pot.', priceCents: 1800, stock: 2, emoji: '🪴' },
  { name: 'Notebook A5', description: 'Dotted pages, lay-flat binding, 192 pages.', priceCents: 950, stock: 30, emoji: '📓' },
  { name: 'Wireless Headphones', description: 'Over-ear, 30h battery, very comfy.', priceCents: 8999, stock: 0, emoji: '🎧' },
  { name: 'Scented Candle', description: 'Cedar and vanilla. Burns for around 40 hours.', priceCents: 1600, stock: 8, emoji: '🕯️' },
];

/**
 * Opens (or creates) the SQLite database, creates the schema and seeds products.
 * Pass ':memory:' for a throwaway database (used by the tests).
 */
export function openDb(filename) {
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true });

  const db = new DatabaseSync(filename);
  db.exec('PRAGMA foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      description TEXT    NOT NULL,
      price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
      stock       INTEGER NOT NULL CHECK (stock >= 0),
      emoji       TEXT    NOT NULL
    );
  `);

  const { count } = db.prepare('SELECT COUNT(*) AS count FROM products').get();
  if (count === 0) {
    const insert = db.prepare(
      'INSERT INTO products (name, description, price_cents, stock, emoji) VALUES (?, ?, ?, ?, ?)'
    );
    for (const p of SEED_PRODUCTS) insert.run(p.name, p.description, p.priceCents, p.stock, p.emoji);
  }

  return db;
}
