/**
 * In-memory fan-out for Server-Sent Events.
 * One process is enough for the challenge; swap broadcast for Redis pub/sub later.
 */
export function createSseHub() {
  const clients = new Set();

  function subscribe(res) {
    clients.add(res);
    return () => clients.delete(res);
  }

  function broadcast(event, data) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const res of clients) {
      res.write(payload);
    }
  }

  return { subscribe, broadcast };
}
