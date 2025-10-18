/**
 * Test Setup
 * Global test configuration and mocks
 */

import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock;

// Mock navigator.onLine
Object.defineProperty(global.navigator, 'onLine', {
  writable: true,
  value: true
});

// Mock navigator.vibrate
global.navigator.vibrate = vi.fn();

// Mock window.alert
global.alert = vi.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
};

// Ensure document.body exists
if (typeof document !== 'undefined' && !document.body) {
  document.body = document.createElement('body');
}

// Reset mocks before each test
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();

  // Clean up DOM
  if (typeof document !== 'undefined' && document.body) {
    document.body.innerHTML = '';
  }
});
