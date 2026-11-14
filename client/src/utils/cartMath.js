/** Units still free to add: catalogue stock minus what is already in the cart. */
export function availableStock(stock, qtyInCart) {
  return stock - qtyInCart;
}

/** Quantity of a product in the cart, or 0 if missing. */
export function quantityOf(items, productId) {
  return items.find((item) => item.productId === productId)?.quantity ?? 0;
}

/** Total units across all cart lines (badge count). */
export function totalUnits(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
