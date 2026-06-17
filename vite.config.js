import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  console.log(command, mode);
  return ({
    build: {
      minify: mode !== 'development',
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
        '/stream': {
          changeOrigin: false,
          target: process.env.BACKEND_URL || 'http://localhost:3001',
        },
      },
    },
  });
});
