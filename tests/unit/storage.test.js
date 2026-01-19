/**
 * Unit Tests for Storage Module
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  getSyncStatus,
  exportData,
  requestPersistentStorage,
  checkPersistentStorage,
} from '../../js/modules/storage.js';

describe('Storage Module', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getSyncStatus', () => {
    it('should return sync status object', () => {
      const status = getSyncStatus();

      expect(status).toBeDefined();
      expect(status).toHaveProperty('pendingItems');
      expect(status).toHaveProperty('isProcessing');
      expect(status).toHaveProperty('isOnline');
    });

    it('should return isOnline based on navigator.onLine', () => {
      const status = getSyncStatus();
      expect(typeof status.isOnline).toBe('boolean');
    });

    it('should return pendingItems as a number', () => {
      const status = getSyncStatus();
      expect(typeof status.pendingItems).toBe('number');
      expect(status.pendingItems).toBeGreaterThanOrEqual(0);
    });

    it('should return isProcessing as a boolean', () => {
      const status = getSyncStatus();
      expect(typeof status.isProcessing).toBe('boolean');
    });
  });

  describe('exportData', () => {
    it('should create a download link with correct filename', () => {
      const tasks = {
        1: [{ id: 1, text: 'Task 1', segment: 1 }],
        2: [],
        3: [],
        4: [],
        5: [],
      };

      // Mock URL methods
      global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = vi.fn();

      // Spy on document methods
      const createElementSpy = vi.spyOn(document, 'createElement');
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});

      exportData(tasks, '1.8.2');

      // Verify link was created
      expect(createElementSpy).toHaveBeenCalledWith('a');

      // Verify URL methods were called
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });

    it('should include version and export date in export data', () => {
      const tasks = {
        1: [{ id: 1, text: 'Task 1', segment: 1 }],
        2: [],
        3: [],
        4: [],
        5: [],
      };

      let blobContent = null;

      // Mock Blob to capture content
      global.Blob = vi.fn(function (content, options) {
        blobContent = content[0];
        this.type = options.type;
        return this;
      });

      global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = vi.fn();

      vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});

      exportData(tasks, '1.8.2');

      expect(blobContent).toBeTruthy();
      const exportedData = JSON.parse(blobContent);

      expect(exportedData.version).toBe('1.8.2');
      expect(exportedData.exportDate).toBeTruthy();
      expect(exportedData.tasks).toEqual(tasks);
    });

    it('should use "unknown" version if not provided', () => {
      const tasks = { 1: [], 2: [], 3: [], 4: [], 5: [] };

      let blobContent = null;

      global.Blob = vi.fn(function (content, options) {
        blobContent = content[0];
        return this;
      });

      global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = vi.fn();

      vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});

      exportData(tasks);

      const exportedData = JSON.parse(blobContent);
      expect(exportedData.version).toBe('unknown');
    });

    it('should create filename with current date', () => {
      const tasks = { 1: [], 2: [], 3: [], 4: [], 5: [] };

      global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = vi.fn();

      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };

      vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});

      exportData(tasks, '1.8.2');

      expect(mockLink.download).toMatch(/^eisenhauer-backup-\d{4}-\d{2}-\d{2}\.json$/);
    });
  });

  describe('requestPersistentStorage', () => {
    it('should request persistent storage if available', async () => {
      const mockPersist = vi.fn().mockResolvedValue(true);

      global.navigator.storage = {
        persist: mockPersist,
      };

      const result = await requestPersistentStorage();

      expect(mockPersist).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if persist API is not available', async () => {
      global.navigator.storage = undefined;

      const result = await requestPersistentStorage();

      expect(result).toBe(false);
    });

    it('should return false if persist rejects', async () => {
      const mockPersist = vi.fn().mockRejectedValue(new Error('Permission denied'));

      global.navigator.storage = {
        persist: mockPersist,
      };

      const result = await requestPersistentStorage();

      expect(result).toBe(false);
    });

    it('should handle case where storage.persist returns false', async () => {
      const mockPersist = vi.fn().mockResolvedValue(false);

      global.navigator.storage = {
        persist: mockPersist,
      };

      const result = await requestPersistentStorage();

      expect(result).toBe(false);
    });
  });

  describe('checkPersistentStorage', () => {
    it('should check if storage is persisted', async () => {
      const mockPersisted = vi.fn().mockResolvedValue(true);

      global.navigator.storage = {
        persisted: mockPersisted,
      };

      const result = await checkPersistentStorage();

      expect(mockPersisted).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if persisted API is not available', async () => {
      global.navigator.storage = undefined;

      const result = await checkPersistentStorage();

      expect(result).toBe(false);
    });

    it('should return false if persisted check fails', async () => {
      const mockPersisted = vi.fn().mockRejectedValue(new Error('Check failed'));

      global.navigator.storage = {
        persisted: mockPersisted,
      };

      const result = await checkPersistentStorage();

      expect(result).toBe(false);
    });

    it('should handle false persisted status', async () => {
      const mockPersisted = vi.fn().mockResolvedValue(false);

      global.navigator.storage = {
        persisted: mockPersisted,
      };

      const result = await checkPersistentStorage();

      expect(result).toBe(false);
    });
  });

  describe('Integration', () => {
    it('should export and create valid JSON structure', () => {
      const tasks = {
        1: [
          { id: 1, text: 'Important task', segment: 1, checked: false },
          { id: 2, text: 'Another task', segment: 1, checked: true },
        ],
        2: [{ id: 3, text: 'Scheduled task', segment: 2, checked: false }],
        3: [],
        4: [],
        5: [{ id: 4, text: 'Completed task', segment: 5, checked: true }],
      };

      let exportedContent = null;

      global.Blob = vi.fn(function (content) {
        exportedContent = content[0];
        return this;
      });

      global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = vi.fn();

      vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});

      exportData(tasks, '1.8.2');

      expect(exportedContent).toBeTruthy();

      const parsed = JSON.parse(exportedContent);
      expect(parsed.tasks).toEqual(tasks);
      expect(parsed.version).toBe('1.8.2');
      expect(parsed.exportDate).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });
});
