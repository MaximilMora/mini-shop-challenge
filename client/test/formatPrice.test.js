import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatPrice } from '../src/utils/formatPrice.js';

test('formats zero cents as €0.00', () => {
  assert.equal(formatPrice(0), '€0.00');
});

test('formats integer cents without floating-point drift', () => {
  assert.equal(formatPrice(1450), '€14.50');
  assert.equal(formatPrice(1), '€0.01');
  assert.equal(formatPrice(9999), '€99.99');
});
