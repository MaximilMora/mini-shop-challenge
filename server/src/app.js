import express from 'express';
import { productsRouter } from './routes/products.js';
import { cartRouter } from './routes/cart.js';

export function createApp(db) {
  const app = express();
  app.use(express.json());

  app.use('/api/products', productsRouter(db));
  app.use('/api/cart', cartRouter(db));

  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

  // Malformed JSON bodies and unexpected errors end up here.
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
