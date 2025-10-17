import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test environment
    environment: 'happy-dom',

    // Global setup
    globals: true,

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.js',
        'update-*.js',
        'build-*.js',
        'auth.js',
        'firebase-config.js',
        'service-worker.js',
        'script.legacy.js'
      ]
    },

    // Test files pattern
    include: ['tests/**/*.test.js'],

    // Setup files
    setupFiles: ['./tests/setup.js'],

    // Timeout
    testTimeout: 10000
  }
});
