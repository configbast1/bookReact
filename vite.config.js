import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const apiProxy = {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true,
    rewrite: (p) => p.replace(/^\/api/, ''),
  },
};

function aboutMeEndpoint() {
  return {
    name: 'about-me-endpoint',
    configureServer(server) {
      server.middlewares.use('/api/about_me', async (req, res) => {
        const { aboutMe } = await server.ssrLoadModule('/api/about_me.js');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(aboutMe));
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/about_me', async (req, res) => {
        const { aboutMe } = await import('./api/about_me.js');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(aboutMe));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), aboutMeEndpoint()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  server: { port: 5173, open: true, proxy: apiProxy },
  preview: { port: 4173, proxy: apiProxy },
  build: { outDir: 'dist', sourcemap: true },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
    coverage: { provider: 'v8', reporter: ['text', 'html'], include: ['src/**/*.{js,jsx}'] },
  },
});
