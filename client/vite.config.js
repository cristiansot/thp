// Local
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   base: '/', // <-- Esto es para desarrollo local
//   plugins: [react()],
// });

// Production
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig(({ mode }) => ({
//   base: mode === 'production' ? '' : '/',
//   plugins: [react()],
//   server: {
//     port: 10000,
//     proxy: {
//       '/api': {
//         target: 'https://api.thp.cl/', 
//         changeOrigin: true,
//         secure: true,
//       },
//     },
//   },
// }));

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '' : '/',
  plugins: [react()],
  server: {
    port: 10000,
    proxy: {
      '/api': {
        target: 'https://api.thp.cl',  // SIN barra final
        changeOrigin: true,
        secure: true,
      },
    },
  },
  // Define variables de entorno por defecto
  define: {
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify(
      mode === 'production' 
        ? 'https://api.thp.cl' 
        : 'http://localhost:10000'
    )
  }
}));