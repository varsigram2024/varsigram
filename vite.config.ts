import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; 


const manifestIcons = [
  {
    src: 'images/White.png',
    sizes: '144x144',
    type: 'image/png',
  },
  {
    src: 'images/White.png',
    sizes: '144x144',
    type: 'image/png',
  },
 
  {
    src: 'images/White.png',
    sizes: '144x144',
    type: 'image/png',
    purpose: 'maskable'
  },
  {
    src: 'images/White.png',
    sizes: '144x144',
    type: 'image/png',
    purpose: 'maskable'
  }
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Varsigram', 
        short_name: 'Varsigram',
        description: 'Your progressive web application for Varsigram.', 
        start_url: '/varsigram/', 
        scope: '/varsigram/', 
        display: 'standalone', 
        background_color: '#ffffff', 
        theme_color: '#000000',
        icons: manifestIcons,
      },
      
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'], 
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
      },
     
      devOptions: {
        enabled: true, 
      }
    })
  ],
  base: process.env.VITE_BASE_PATH || '/varsigram', 
  optimizeDeps: {
    
  },
  server: {
    proxy: {
      '/api/v1': {
        target: 'https://api.varsigram.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/v1/, '/api/v1')
      }
    }
  }
});
