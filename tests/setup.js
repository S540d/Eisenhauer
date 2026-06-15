/**
 * Test Setup
 * Global test configuration and mocks
 */

import { vi } from 'vitest';

// Mock firebase-init.js globally to prevent real Firebase initialization in tests
vi.mock('../js/modules/firebase-init.js', () => ({
  app: {},
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
    signOut: vi.fn(),
  },
  db: {},
  storage: {},
  googleProvider: {},
  appleProvider: {},
  firebaseEnvironment: { env: 'testing', projectId: 'eisenhauer-testing' },
}));

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
    },
  };
})();

global.localStorage = localStorageMock;

// Mock navigator.onLine
Object.defineProperty(global.navigator, 'onLine', {
  writable: true,
  value: true,
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
  error: vi.fn(),
};

// Ensure document structure exists for Happy DOM
if (typeof document !== 'undefined') {
  // Ensure documentElement exists
  if (!document.documentElement) {
    const html = document.createElement('html');
    document.appendChild(html);
  }

  // Ensure head exists
  if (!document.head) {
    const head = document.createElement('head');
    document.documentElement.insertBefore(head, document.documentElement.firstChild);
  }

  // Ensure body exists and is accessible
  if (!document.body) {
    const body = document.createElement('body');
    document.documentElement.appendChild(body);
  }
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
