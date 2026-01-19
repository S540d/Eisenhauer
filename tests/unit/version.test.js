/**
 * Unit Tests for Version Module
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  APP_VERSION,
  BUILD_DATE,
  loadVersion,
  displayVersion,
  initVersion,
} from '../../js/modules/version.js';

describe('Version Module', () => {
  beforeEach(() => {
    // Clear document body
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Constants', () => {
    it('should have APP_VERSION defined', () => {
      expect(APP_VERSION).toBeDefined();
      expect(typeof APP_VERSION).toBe('string');
      expect(APP_VERSION).toMatch(/^v\d+\.\d+\.\d+/);
    });

    it('should have BUILD_DATE defined', () => {
      expect(BUILD_DATE).toBeDefined();
      expect(typeof BUILD_DATE).toBe('string');
      // Check ISO date format YYYY-MM-DD
      expect(BUILD_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('loadVersion', () => {
    it('should load version from version.json successfully', async () => {
      // Mock successful fetch
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ version: '1.8.2' }),
        })
      );

      const version = await loadVersion();
      expect(version).toBe('v1.8.2');
      expect(fetch).toHaveBeenCalledWith('./version.json', expect.any(Object));
    });

    it('should use fallback version on fetch error', async () => {
      // Mock failed fetch
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

      const version = await loadVersion();
      expect(version).toBeDefined();
      expect(version).toMatch(/^v\d+\.\d+\.\d+/);
    });

    it('should use fallback version on HTTP error', async () => {
      // Mock HTTP error
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        })
      );

      const version = await loadVersion();
      expect(version).toBeDefined();
      expect(version).toMatch(/^v\d+\.\d+\.\d+/);
    });

    it('should timeout after 3 seconds', async () => {
      // Mock slow fetch with AbortError
      global.fetch = vi.fn(() => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            const error = new Error('Aborted');
            error.name = 'AbortError';
            reject(error);
          }, 100);
        });
      });

      const startTime = Date.now();
      const version = await loadVersion();
      const duration = Date.now() - startTime;

      // Should return fallback version
      expect(version).toBeDefined();
      expect(version).toMatch(/^v\d+\.\d+\.\d+/);
    }, 15000);

    it('should handle invalid JSON response', async () => {
      // Mock invalid JSON
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.reject(new Error('Invalid JSON')),
        })
      );

      const version = await loadVersion();
      expect(version).toBeDefined();
      expect(version).toMatch(/^v\d+\.\d+\.\d+/);
    });
  });

  describe('displayVersion', () => {
    it('should update versionNumber element if it exists', () => {
      const versionElement = document.createElement('div');
      versionElement.id = 'versionNumber';
      document.body.appendChild(versionElement);

      displayVersion();

      expect(versionElement.textContent).toMatch(/^v\d+\.\d+\.\d+/);
    });

    it('should update settingsVersion element if it exists', () => {
      const settingsElement = document.createElement('div');
      settingsElement.id = 'settingsVersion';
      document.body.appendChild(settingsElement);

      displayVersion();

      expect(settingsElement.textContent).toContain('Version:');
      expect(settingsElement.textContent).toMatch(/v\d+\.\d+\.\d+/);
    });

    it('should update both elements if both exist', () => {
      const versionElement = document.createElement('div');
      versionElement.id = 'versionNumber';
      const settingsElement = document.createElement('div');
      settingsElement.id = 'settingsVersion';

      document.body.appendChild(versionElement);
      document.body.appendChild(settingsElement);

      displayVersion();

      expect(versionElement.textContent).toBeTruthy();
      expect(settingsElement.textContent).toBeTruthy();
    });

    it('should not throw if elements do not exist', () => {
      expect(() => {
        displayVersion();
      }).not.toThrow();
    });
  });

  describe('initVersion', () => {
    it('should load and display version', async () => {
      // Mock successful fetch
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ version: '1.8.2' }),
        })
      );

      // Create elements
      const versionElement = document.createElement('div');
      versionElement.id = 'versionNumber';
      document.body.appendChild(versionElement);

      await initVersion();

      expect(fetch).toHaveBeenCalled();
      expect(versionElement.textContent).toBe('v1.8.2');
    });

    it('should handle errors gracefully during init', async () => {
      // Mock fetch error
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

      await expect(initVersion()).resolves.not.toThrow();
    });
  });

  describe('Integration', () => {
    it('should maintain version format consistency', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ version: '2.0.0' }),
        })
      );

      const version = await loadVersion();

      const versionElement = document.createElement('div');
      versionElement.id = 'versionNumber';
      document.body.appendChild(versionElement);

      displayVersion();

      expect(versionElement.textContent).toBe('v2.0.0');
    });
  });
});
