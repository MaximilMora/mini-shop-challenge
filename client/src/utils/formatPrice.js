const formatter = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });

/** All prices in this app are integers in cents. formatPrice(1450) -> "€14.50" */
export function formatPrice(cents) {
  return formatter.format(cents / 100);
}
