import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { getBaseUrl } from './lib/environment-utils.js';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  // Use VITE_ENV from loaded env or fallback to mode
  // This allows 'npm run build:testing' to set mode=testing, and if .env.testing has VITE_ENV=testing it works,
  // or just relies on mode.
  const environment = env.VITE_ENV || mode;
  const base = getBaseUrl(environment);

  // eslint-disable-next-line no-console
  console.log(`Building for environment: ${environment}, Base URL: ${base}`);

  return {
    base: base,

    build: {
      outDir: 'dist',
      sourcemap: environment !== 'production', // Source maps only for staging/testing (not exposed in production)

      rollupOptions: {
        output: {
          manualChunks: {
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
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
          // Environment-specific cache name to prevent cross-environment cache pollution
          cacheId: `eisenhauer-${environment}`,
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
              purpose: 'any',
            },
          ],
        },
      }),
    ],
  };
});
