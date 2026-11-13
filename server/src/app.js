import express from 'express';
import { productsRouter } from './routes/products.js';
import { cartRouter } from './routes/cart.js';
import { createSseHub } from './sse.js';

export function createApp(db, hub = createSseHub()) {
  const app = express();
  app.use(express.json());

  app.get('/api/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Flush headers so the proxy/client knows the stream is open.
    if (typeof res.flushHeaders === 'function') res.flushHeaders();

    res.write(': connected\n\n');

    const unsubscribe = hub.subscribe(res);
    const heartbeat = setInterval(() => {
      res.write(': ping\n\n');
    }, 25_000);

    req.on('close', () => {
      clearInterval(heartbeat);
      unsubscribe();
    });
  });

  app.use('/api/products', productsRouter(db));
  app.use('/api/cart', cartRouter(db, hub));

  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

  // Malformed JSON bodies and unexpected errors end up here.
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
