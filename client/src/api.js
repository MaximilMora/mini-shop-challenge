/**
 * Small wrapper around fetch for our JSON API.
 * Throws an Error whose message is the API's `error` field when the response is not 2xx.
 */
async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ?? `Request failed with status ${res.status}`);
  return data;
}

export function fetchProducts() {
  return request('/products');
}
