import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

let api;
before(async () => { api = await startTestServer(); });
after(() => api.close());

test('GET /api/products lists the seeded products', async () => {
  const { status, body } = await api.request('GET', '/api/products');
  assert.equal(status, 200);
  assert.equal(body.length, 6);
  assert.deepEqual(Object.keys(body[0]).sort(), ['description', 'emoji', 'id', 'name', 'priceCents', 'stock']);
});

test('GET /api/products/:id returns 404 for unknown products', async () => {
  const { status, body } = await api.request('GET', '/api/products/999');
  assert.equal(status, 404);
  assert.equal(typeof body.error, 'string');
});
