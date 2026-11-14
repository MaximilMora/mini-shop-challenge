import { test, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import {
  fetchProducts,
  fetchCart,
  addCartItem,
  removeCartItem,
  decreaseCartItem,
} from '../src/api.js';

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

let fetchMock;

beforeEach(() => {
  fetchMock = mock.fn(async () => jsonResponse(200, { ok: true }));
  globalThis.fetch = fetchMock;
});

afterEach(() => {
  mock.restoreAll();
});

test('fetchProducts GETs /api/products without a body', async () => {
  await fetchProducts();
  assert.equal(fetchMock.mock.callCount(), 1);
  const [url, options] = fetchMock.mock.calls[0].arguments;
  assert.equal(url, '/api/products');
  assert.equal(options.method, 'GET');
  assert.equal(options.body, undefined);
  assert.equal(options.headers, undefined);
});

test('fetchCart GETs /api/cart', async () => {
  await fetchCart();
  const [url, options] = fetchMock.mock.calls[0].arguments;
  assert.equal(url, '/api/cart');
  assert.equal(options.method, 'GET');
});

test('addCartItem POSTs productId and quantity as JSON', async () => {
  await addCartItem(1, 2);
  const [url, options] = fetchMock.mock.calls[0].arguments;
  assert.equal(url, '/api/cart/items');
  assert.equal(options.method, 'POST');
  assert.deepEqual(options.headers, { 'Content-Type': 'application/json' });
  assert.equal(options.body, JSON.stringify({ productId: 1, quantity: 2 }));
});

test('removeCartItem DELETEs the product line', async () => {
  await removeCartItem(3);
  const [url, options] = fetchMock.mock.calls[0].arguments;
  assert.equal(url, '/api/cart/items/3');
  assert.equal(options.method, 'DELETE');
});

test('decreaseCartItem PATCHes one unit off the line', async () => {
  await decreaseCartItem(3);
  const [url, options] = fetchMock.mock.calls[0].arguments;
  assert.equal(url, '/api/cart/items/3');
  assert.equal(options.method, 'PATCH');
});

test('throws the API error message on non-2xx responses', async () => {
  fetchMock.mock.mockImplementation(async () =>
    jsonResponse(409, { error: 'Ceramic Mug: only 12 in stock' })
  );
  await assert.rejects(() => addCartItem(1, 99), { message: 'Ceramic Mug: only 12 in stock' });
});

test('falls back to status text when the error body is not JSON', async () => {
  fetchMock.mock.mockImplementation(async () => ({
    ok: false,
    status: 500,
    json: async () => {
      throw new SyntaxError('Unexpected token');
    },
  }));
  await assert.rejects(() => fetchCart(), { message: 'Request failed with status 500' });
});
