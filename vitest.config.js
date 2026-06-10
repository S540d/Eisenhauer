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
      include: [
        'js/modules/store.js',
        'js/modules/notifications.js',
        'js/modules/error-handler.js',
        'js/modules/translations.js',
        'js/modules/tasks.js',
        'js/modules/version.js',
      ],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.js',
        'update-*.js',
        'build-*.js',
        'post-build.js',
        'auth.js',
        'firebase-config.js',
        'service-worker.js',
        'script.legacy.js',
        'js/modules/auth.js',
        'js/modules/firebase-init.js',
        'js/modules/offline-queue.js',
        'js/modules/drag-*.js',
        'js/modules/ui.js',
        'js/modules/accessibility.js',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },

    // Test files pattern
    include: ['tests/**/*.test.js'],

    // Setup files
    setupFiles: ['./tests/setup.js'],

    // Timeout
    testTimeout: 10000,
  },
});
