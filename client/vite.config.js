import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://thp.cl/test',  // Asegúrate de colocar aquí el subdirectorio donde se hospedará
  plugins: [react()],
});
