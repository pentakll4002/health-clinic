import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', // Đảm bảo Vite phục vụ từ thư mục gốc của frontend
  publicDir: 'public', // Đảm bảo đúng thư mục public cho frontend
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
