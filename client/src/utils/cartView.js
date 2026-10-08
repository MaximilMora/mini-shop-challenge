/**
 * Joins the stored cart items with the catalogue and works out the money.
 * Returns the same shape as the cart API: { items, totalCents }.
 */
export function buildCartView(items, products) {
  const byId = new Map(products.map((product) => [product.id, product]));

  const viewItems = items.flatMap(({ productId, quantity }) => {
    const product = byId.get(productId);
    if (!product) return [];

    return [{
      productId,
      name: product.name,
      emoji: product.emoji,
      priceCents: product.priceCents,
      quantity,
      lineTotalCents: product.priceCents * quantity,
    }];
  });

  return {
    items: viewItems,
    totalCents: viewItems.reduce((sum, item) => sum + item.lineTotalCents, 0),
  };
}
