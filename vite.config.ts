import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

/**
 * Base path résolution :
 *  - Local dev (pnpm dev)            → '/'  (Vite default)
 *  - GitHub Actions (Pages deploy)    → '/<repo>/'  (auto via GITHUB_REPOSITORY)
 *  - Override manuel (custom domain)  → VITE_BASE='/'
 */
function resolveBase(): string {
  if (process.env.VITE_BASE) return process.env.VITE_BASE;

  // GitHub Actions expose "owner/repo" — on prend la partie repo comme base
  const ghRepo = process.env.GITHUB_REPOSITORY?.split('/')[1];
  if (ghRepo) return `/${ghRepo}/`;

  return '/';
}

export default defineConfig({
  base: resolveBase(),
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
});
