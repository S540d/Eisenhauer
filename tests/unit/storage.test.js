/**
 * Unit Tests for Storage Module
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Firestore is mocked so updateTaskInFirestore can be asserted on without a
// live connection. deleteField() returns a recognisable sentinel instead of the
// real FieldValue instance.
const DELETE_SENTINEL = Symbol('deleteField');

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({})),
  doc: vi.fn(() => ({})),
  getDocs: vi.fn(async () => ({ forEach: () => {} })),
  setDoc: vi.fn(async () => {}),
  deleteDoc: vi.fn(async () => {}),
  deleteField: vi.fn(() => DELETE_SENTINEL),
  writeBatch: vi.fn(() => ({ set: vi.fn(), commit: vi.fn(async () => {}) })),
  serverTimestamp: vi.fn(() => 'SERVER_TIMESTAMP'),
}));

import {
  getSyncStatus,
  exportData,
  requestPersistentStorage,
  saveGuestTasks,
  loadGuestTasks,
  loadGuestNotes,
  importData,
  updateTaskInFirestore,
} from '../../js/modules/storage.js';
import { setDoc } from 'firebase/firestore';
import localforage from 'localforage';

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

  describe('saveGuestTasks', () => {
    it('should save tasks to localforage', async () => {
      const tasks = {
        1: [{ id: 1, text: 'Task 1', segment: 1 }],
        2: [],
        3: [],
        4: [],
        5: [],
      };

      const setItemSpy = vi.spyOn(localforage, 'setItem').mockResolvedValue(undefined);

      await saveGuestTasks(tasks);

      expect(setItemSpy).toHaveBeenCalledWith('eisenhauerTasks', tasks);
    });

    it('should handle errors gracefully', async () => {
      const tasks = { 1: [], 2: [], 3: [], 4: [], 5: [] };

      vi.spyOn(localforage, 'setItem').mockRejectedValue(new Error('Storage full'));

      await expect(saveGuestTasks(tasks)).resolves.not.toThrow();
    });
  });

  describe('loadGuestTasks', () => {
    beforeEach(() => {
      localStorage.clear();
      vi.clearAllMocks();
    });

    it('should load tasks from localforage', async () => {
      const tasks = {
        1: [{ id: 1, text: 'Task 1', segment: 1 }],
        2: [],
        3: [],
        4: [],
        5: [],
      };

      vi.spyOn(localforage, 'getItem').mockResolvedValue(tasks);

      const result = await loadGuestTasks();

      expect(result).toEqual(tasks);
    });

    it('should migrate from localStorage to localforage', async () => {
      const tasks = {
        1: [{ id: 1, text: 'Old task', segment: 1 }],
        2: [],
        3: [],
        4: [],
        5: [],
      };

      // Setup: no data in localforage, but data in localStorage
      vi.spyOn(localforage, 'getItem').mockResolvedValue(null);
      localStorage.setItem('eisenhauerTasks', JSON.stringify(tasks));

      const setItemSpy = vi.spyOn(localforage, 'setItem').mockResolvedValue(undefined);

      const result = await loadGuestTasks();

      expect(result).toEqual(tasks);
      expect(setItemSpy).toHaveBeenCalledWith('eisenhauerTasks', tasks);
      expect(localStorage.getItem('eisenhauerTasks')).toBeNull();
    });

    it('should return empty structure if no data exists', async () => {
      vi.spyOn(localforage, 'getItem').mockResolvedValue(null);

      const result = await loadGuestTasks();

      expect(result).toEqual({ 1: [], 2: [], 3: [], 4: [], 5: [] });
    });

    it('should handle errors and return empty structure', async () => {
      vi.spyOn(localforage, 'getItem').mockRejectedValue(new Error('DB Error'));

      const result = await loadGuestTasks();

      expect(result).toEqual({ 1: [], 2: [], 3: [], 4: [], 5: [] });
    });

    it('should handle corrupt localStorage data', async () => {
      vi.spyOn(localforage, 'getItem').mockResolvedValue(null);
      localStorage.setItem('eisenhauerTasks', 'invalid json');

      const result = await loadGuestTasks();

      // Should return empty structure on parse error
      expect(result).toEqual({ 1: [], 2: [], 3: [], 4: [], 5: [] });
    });
  });

  describe('loadGuestNotes (leftover read-only helper for notes migration)', () => {
    it('should load notes from localforage', async () => {
      const notes = [{ id: 'n1', text: 'Note 1', createdAt: 1 }];
      vi.spyOn(localforage, 'getItem').mockResolvedValue(notes);

      const result = await loadGuestNotes();

      expect(result).toEqual(notes);
    });

    it('should return an empty array when no data exists', async () => {
      vi.spyOn(localforage, 'getItem').mockResolvedValue(null);

      const result = await loadGuestNotes();

      expect(result).toEqual([]);
    });

    it('should return an empty array on error', async () => {
      vi.spyOn(localforage, 'getItem').mockRejectedValue(new Error('DB Error'));

      const result = await loadGuestNotes();

      expect(result).toEqual([]);
    });

    it('should return an empty array for non-array stored data', async () => {
      vi.spyOn(localforage, 'getItem').mockResolvedValue('not-an-array');

      const result = await loadGuestNotes();

      expect(result).toEqual([]);
    });
  });

  describe('importData', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      global.confirm = vi.fn();
    });

    it('should import and merge tasks when user confirms', async () => {
      const currentTasks = {
        1: [{ id: 1, text: 'Existing task', segment: 1 }],
        2: [],
        3: [],
        4: [],
        5: [],
      };

      const importedData = {
        version: '1.8.0',
        exportDate: '2024-01-01',
        tasks: {
          1: [{ id: 2, text: 'Imported task', segment: 1 }],
          2: [{ id: 3, text: 'Another imported', segment: 2 }],
          3: [],
          4: [],
          5: [],
        },
      };

      const fileContent = JSON.stringify(importedData);
      const file = new File([fileContent], 'backup.json', { type: 'application/json' });

      global.confirm.mockReturnValue(true); // User chooses to merge

      const saveCallback = vi.fn().mockResolvedValue(undefined);

      const result = await importData(file, currentTasks, saveCallback);

      // Should have merged tasks
      expect(result[1].length).toBe(2); // Existing + imported
      expect(result[2].length).toBe(1); // Imported task in segment 2
      expect(saveCallback).toHaveBeenCalled();
    });

    it('should replace tasks when user cancels merge', async () => {
      const currentTasks = {
        1: [{ id: 1, text: 'Existing task', segment: 1 }],
        2: [],
        3: [],
        4: [],
        5: [],
      };

      const importedData = {
        version: '1.8.0',
        tasks: {
          1: [{ id: 2, text: 'Imported task', segment: 1 }],
          2: [],
          3: [],
          4: [],
          5: [],
        },
      };

      const fileContent = JSON.stringify(importedData);
      const file = new File([fileContent], 'backup.json', { type: 'application/json' });

      global.confirm.mockReturnValue(false); // User chooses to replace

      const saveCallback = vi.fn().mockResolvedValue(undefined);

      const result = await importData(file, currentTasks, saveCallback);

      // Should have replaced tasks
      expect(result).toEqual(importedData.tasks);
      expect(result[1].length).toBe(1);
      expect(result[1][0].text).toBe('Imported task');
      expect(saveCallback).toHaveBeenCalledWith(importedData.tasks);
    });

    it('should reject on invalid data format', async () => {
      const invalidData = {
        version: '1.8.0',
        // Missing 'tasks' field
      };

      const fileContent = JSON.stringify(invalidData);
      const file = new File([fileContent], 'invalid.json', { type: 'application/json' });

      await expect(importData(file, {}, null)).rejects.toThrow('Ungültiges Datenformat');
    });

    it('should reject on invalid JSON', async () => {
      const file = new File(['invalid json {'], 'invalid.json', { type: 'application/json' });

      await expect(importData(file, {}, null)).rejects.toThrow();
    });

    it('should generate new IDs for merged tasks to avoid conflicts', async () => {
      const currentTasks = {
        1: [{ id: 100, text: 'Existing task', segment: 1 }],
        2: [],
        3: [],
        4: [],
        5: [],
      };

      const importedData = {
        tasks: {
          1: [{ id: 100, text: 'Imported task with same ID', segment: 1 }],
          2: [],
          3: [],
          4: [],
          5: [],
        },
      };

      const fileContent = JSON.stringify(importedData);
      const file = new File([fileContent], 'backup.json', { type: 'application/json' });

      global.confirm.mockReturnValue(true); // Merge

      const result = await importData(file, currentTasks, null);

      // Should have 2 tasks
      expect(result[1].length).toBe(2);
      // IDs should be different
      expect(result[1][0].id).not.toBe(result[1][1].id);
    });

    it('should work without save callback', async () => {
      const importedData = {
        tasks: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      };

      const fileContent = JSON.stringify(importedData);
      const file = new File([fileContent], 'backup.json', { type: 'application/json' });

      global.confirm.mockReturnValue(false);

      const result = await importData(file, {}, null);

      expect(result).toEqual(importedData.tasks);
    });

    it('should handle file read errors', async () => {
      const file = new File(['test'], 'test.json', { type: 'application/json' });

      // Force a read error by mocking FileReader
      const originalFileReader = global.FileReader;
      global.FileReader = vi.fn(function () {
        this.readAsText = vi.fn(function () {
          setTimeout(() => this.onerror(new Error('Read error')), 0);
        });
      });

      await expect(importData(file, {}, null)).rejects.toThrow('Fehler beim Lesen der Datei');

      global.FileReader = originalFileReader;
    });
  });

  describe('updateTaskInFirestore clearable fields', () => {
    const userId = 'user-1';
    const db = {};

    // setDoc runs via the offline queue, so wait until it has been called
    // instead of assuming it happened synchronously.
    const writtenData = async () => {
      await vi.waitFor(() => expect(setDoc).toHaveBeenCalled());
      return setDoc.mock.calls.at(-1)[1];
    };

    beforeEach(() => {
      setDoc.mockClear();
    });

    it('should write optional fields when they have a value', async () => {
      await updateTaskInFirestore(
        {
          id: 't1',
          text: 'Task',
          segment: 1,
          createdAt: 123,
          completedAt: 456,
          dueDate: '2026-08-20',
          category: 'business',
          notes: 'Some note',
          recurring: { enabled: true, interval: 'daily' },
        },
        userId,
        db
      );

      expect(await writtenData()).toMatchObject({
        completedAt: 456,
        dueDate: '2026-08-20',
        category: 'business',
        notes: 'Some note',
        recurring: { enabled: true, interval: 'daily' },
      });
    });

    it('should delete cleared fields instead of omitting them', async () => {
      // setDoc uses merge:true, so an omitted field would keep its stale value
      // in Firestore and the cleared value would reappear on the next load.
      await updateTaskInFirestore(
        {
          id: 't1',
          text: 'Task',
          segment: 1,
          createdAt: 123,
          completedAt: null,
          dueDate: null,
          category: null,
          notes: null,
          recurring: null,
        },
        userId,
        db
      );

      const data = await writtenData();
      expect(data.completedAt).toBe(DELETE_SENTINEL);
      expect(data.dueDate).toBe(DELETE_SENTINEL);
      expect(data.category).toBe(DELETE_SENTINEL);
      expect(data.notes).toBe(DELETE_SENTINEL);
      expect(data.recurring).toBe(DELETE_SENTINEL);
    });

    it('should delete fields that are absent from the task object', async () => {
      await updateTaskInFirestore(
        { id: 't1', text: 'Task', segment: 1, createdAt: 123 },
        userId,
        db
      );

      const data = await writtenData();
      expect(data.dueDate).toBe(DELETE_SENTINEL);
      expect(data.category).toBe(DELETE_SENTINEL);
      expect(data.notes).toBe(DELETE_SENTINEL);
      expect(data.recurring).toBe(DELETE_SENTINEL);
      expect(data.completedAt).toBe(DELETE_SENTINEL);
    });
  });
});
