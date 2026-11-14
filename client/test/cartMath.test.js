import { test } from 'node:test';
import assert from 'node:assert/strict';
import { availableStock, quantityOf, totalUnits } from '../src/utils/cartMath.js';

test('availableStock subtracts cart quantity from catalogue stock', () => {
  assert.equal(availableStock(12, 0), 12);
  assert.equal(availableStock(12, 3), 9);
  assert.equal(availableStock(2, 2), 0);
});

test('quantityOf returns the line quantity or 0', () => {
  const items = [
    { productId: 1, quantity: 2 },
    { productId: 4, quantity: 1 },
  ];
  assert.equal(quantityOf(items, 1), 2);
  assert.equal(quantityOf(items, 4), 1);
  assert.equal(quantityOf(items, 99), 0);
  assert.equal(quantityOf([], 1), 0);
});

test('totalUnits sums quantities across lines', () => {
  assert.equal(totalUnits([]), 0);
  assert.equal(totalUnits([{ productId: 1, quantity: 2 }, { productId: 4, quantity: 1 }]), 3);
});
