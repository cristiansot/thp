//Local
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   base: '/', // <-- Esto es para desarrollo local
//   plugins: [react()],
// });

// Production
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '' : '/',
  plugins: [react()],
  server: {
    port: 10000,
    proxy: {
      '/api': {
        target: 'https://api.thp.cl/', 
        changeOrigin: true,
        secure: true,
      },
    },
  },
}));

