import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const githubRepository = process.env.GITHUB_REPOSITORY;
const [githubOwner, githubRepo] = githubRepository?.split('/') ?? [];
const isGitHubUserOrOrgSite = githubRepo?.toLowerCase() === `${githubOwner}.github.io`.toLowerCase();
const base = process.env.GITHUB_ACTIONS === 'true' && githubRepo && !isGitHubUserOrOrgSite
  ? `/${githubRepo}/`
  : '/';

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
