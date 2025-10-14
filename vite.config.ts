/**
 * Vite configuration for the STREAMIA client application.
 *
 * This file exports the Vite configuration used during development and build.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://streamia-server.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
