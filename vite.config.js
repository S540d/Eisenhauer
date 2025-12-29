import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/Eisenhauer/',

  build: {
    outDir: 'dist',
    sourcemap: true, // Enable source maps for production debugging

    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
        },
      },
    },
  },

  server: {
    port: 8000,
  },

  plugins: [
    VitePWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      filename: 'service-worker.js',
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,json,ico,woff,woff2}'],
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Eisenhauer Matrix',
        short_name: 'Eisenhauer',
        description: 'Task management with Eisenhauer Matrix',
        theme_color: '#667eea',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
