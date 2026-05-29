// defineConfig is for intellisense
// importing vite 8.0.14 causes import-x/no-cycle
// can put back if fixed upstream
// import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default
// defineConfig(
{
  build: {
    outDir: 'dist',
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/u, ''),
        target: process.env.BACKEND_URL || 'http://localhost:3001',
      },
    },
  },
};
// );
