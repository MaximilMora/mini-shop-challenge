import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Requests to /api/* are forwarded to the Express server, so the client can call fetch('/api/...').
    // Object form keeps SSE streams open (no buffering) for GET /api/events.
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
