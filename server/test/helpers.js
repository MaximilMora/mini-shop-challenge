import { openDb } from '../src/db.js';
import { createApp } from '../src/app.js';

/** Starts the app on a random port with a fresh in-memory DB. */
export async function startTestServer() {
  const db = openDb(':memory:');
  const server = createApp(db).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://localhost:${server.address().port}`;

  async function request(method, path, body) {
    const res = await fetch(baseUrl + path, {
      method,
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    return { status: res.status, body: text ? JSON.parse(text) : null };
  }

  return { db, request, close: () => new Promise((resolve) => server.close(resolve)) };
}
