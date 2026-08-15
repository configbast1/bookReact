import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Конфигурация сборщика Vite.
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Алиас @ -> /src, чтобы не писать ../../../ в импортах.
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 5173,
    open: true,
    // Прокси на json-server: фронт ходит на /api, Vite переадресует на :3001
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
    },
  },
  // Тот же прокси для `npm run preview` (просмотр продакшн-сборки локально).
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
    },
  },
  build: { outDir: 'dist', sourcemap: true },
});
