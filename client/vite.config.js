// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   base: 'https://thp.cl/test',  // Asegúrate de colocar aquí el subdirectorio donde se hospedará
//   plugins: [react()],
// });


//Local
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   base: '/', // <-- Esto es para desarrollo local
//   plugins: [react()],
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Esto es para desarrollo local
  plugins: [react()],
  server: {
    port: 5173, // Asegúrate de que el frontend corra en el puerto 5173
    proxy: {
      '/api': {
        target: 'https://thp-backend-16jj.onrender.com', // Reemplaza <tu-backend> con el subdominio de tu backend en Render
        changeOrigin: true,
        secure: true, // Render usa HTTPS, así que esta opción debe ser true
      },
    },
  },
});