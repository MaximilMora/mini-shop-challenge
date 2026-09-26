import { fileURLToPath } from 'node:url';
import { openDb } from './db.js';
import { createApp } from './app.js';

const PORT = process.env.PORT ?? 3001;
const DB_FILE = fileURLToPath(new URL('../data/shop.db', import.meta.url));

const db = openDb(DB_FILE);
createApp(db).listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
