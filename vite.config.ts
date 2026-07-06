/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// On build the app is served from the GitHub Pages project sub-path; in dev it
// stays at the root so `npm run dev` is unaffected.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/country-explorer/' : '/',
  plugins: [react()],
  server: { port: 5176 },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
}));
