import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

const MUG = 1; // stock 12

let api;
beforeEach(async () => { api = await startTestServer(); });
afterEach(() => api.close());

test('PATCH /api/cart/items/:productId decrements quantity by one', async () => {
  await api.request('POST', '/api/cart/items', { productId: MUG, quantity: 2 });

  const { status, body } = await api.request('PATCH', `/api/cart/items/${MUG}`);
  assert.equal(status, 200);
  assert.equal(body.items.length, 1);
  assert.equal(body.items[0].quantity, 1);
  assert.equal(body.totalCents, 1450);
});

test('PATCH removes the line when quantity reaches zero', async () => {
  await api.request('POST', '/api/cart/items', { productId: MUG, quantity: 1 });

  const { status, body } = await api.request('PATCH', `/api/cart/items/${MUG}`);
  assert.equal(status, 200);
  assert.deepEqual(body, { items: [], totalCents: 0 });
});

test('PATCH returns 404 when the product is not in the cart', async () => {
  const { status, body } = await api.request('PATCH', `/api/cart/items/${MUG}`);
  assert.equal(status, 404);
  assert.equal(body.error, 'Product not in cart');
});
