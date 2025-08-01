import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  base: process.env.VITE_BASE_PATH || '/varsigram', 
  optimizeDeps: {
    
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://staging.varsigram.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Ensure service worker is served at root
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        'firebase-messaging-sw': 'public/firebase-messaging-sw.js'
      }
    }
  },
  // Copy service worker to root during dev
  publicDir: 'public'
});
