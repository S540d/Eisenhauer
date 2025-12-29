import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Eisenhauer/',

  build: {
    outDir: 'dist',
    sourcemap: false,

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
});
