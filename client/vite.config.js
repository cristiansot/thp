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

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://back-thp-env.eba-g7htgkzy.us-east-2.elasticbeanstalk.com/',
        changeOrigin: true,
        secure: true,
      },
    },
  },
}));
