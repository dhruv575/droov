import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { runSearch } from './api/_lib/search-core.js';

/**
 * Serves POST /api/search during `npm start`, so local dev behaves like the
 * deployed serverless function. Reads OPENROUTER_API_KEY from .env — note the
 * name has no VITE_ prefix, so Vite never inlines it into the client bundle.
 */
function searchApiDevServer(env) {
  return {
    name: 'search-api-dev-server',
    configureServer(server) {
      server.middlewares.use('/api/search', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'Use POST.' }));
        }

        let body = null;
        try {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          if (chunks.length) body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        } catch {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'Invalid JSON body.' }));
        }

        const { status, body: payload } = await runSearch(body, {
          ...process.env,
          ...env
        });

        res.statusCode = status;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        res.end(JSON.stringify(payload));
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  // '' prefix so non-VITE_ vars are readable here in the config (server side only).
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), searchApiDevServer(env)],
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist'
    }
  };
});
