/**
 * Unit Tests for Backup Module
 *
 * Backups moved from Firebase Storage to Firestore in Issue #396 — Cloud Storage
 * requires the paid Blaze plan while the project runs on Spark, so every upload
 * failed. These tests mock firebase/firestore accordingly.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  uploadBackup,
  listBackups,
  downloadBackup,
  restoreBackup,
  shouldAutoBackup,
  markAutoBackupCompleted,
  trackBackupFailure,
} from '../../js/modules/backup.js';
import * as notifications from '../../js/modules/notifications.js';

const mockBatch = {
  delete: vi.fn(),
  commit: vi.fn(() => Promise.resolve()),
};

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'mock-collection'),
  doc: vi.fn(() => 'mock-doc'),
  setDoc: vi.fn(() => Promise.resolve()),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false })),
  getDocs: vi.fn(() => Promise.resolve({ forEach: () => {} })),
  writeBatch: vi.fn(() => mockBatch),
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
}));

describe('Backup Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadBackup', () => {
    const mockDb = {};
    const mockUserId = 'test-user-123';
    const mockTasks = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    };

    it('should show success notification by default', async () => {
      const showSuccessSpy = vi.spyOn(notifications, 'showSuccess');

      await uploadBackup(mockDb, mockUserId, mockTasks, 'en');

      expect(showSuccessSpy).toHaveBeenCalledWith('Backup created');
    });

    it('should show success notification in German', async () => {
      const showSuccessSpy = vi.spyOn(notifications, 'showSuccess');

      await uploadBackup(mockDb, mockUserId, mockTasks, 'de');

      expect(showSuccessSpy).toHaveBeenCalledWith('Backup erstellt');
    });

    it('should suppress success notification when showNotification is false', async () => {
      const showSuccessSpy = vi.spyOn(notifications, 'showSuccess');

      await uploadBackup(mockDb, mockUserId, mockTasks, 'en', false);

      expect(showSuccessSpy).not.toHaveBeenCalled();
    });

    it('should write the serialized task tree with metadata', async () => {
      const { setDoc } = await import('firebase/firestore');

      await uploadBackup(
        mockDb,
        mockUserId,
        { 1: [{ id: '1', text: 'a', segment: 1, createdAt: 5 }], 2: [] },
        'en',
        false
      );

      expect(setDoc).toHaveBeenCalled();
      const written = setDoc.mock.calls[0][1];
      expect(written.version).toBe('2.0');
      expect(written.taskCount).toBe(1);
      expect(typeof written.payload).toBe('string');
      expect(JSON.parse(written.payload)[1][0].text).toBe('a');
    });

    it('should normalise a Firestore Timestamp createdAt to epoch millis', async () => {
      const { setDoc } = await import('firebase/firestore');

      // A task saved without an explicit createdAt gets serverTimestamp() and
      // reads back as a Timestamp — JSON.stringify would flatten it and break
      // the numeric date comparisons in tasks.js.
      await uploadBackup(
        mockDb,
        mockUserId,
        { 1: [{ id: '1', text: 'a', segment: 1, createdAt: { seconds: 5, nanoseconds: 0 } }] },
        'en',
        false
      );

      const payload = JSON.parse(setDoc.mock.calls[0][1].payload);
      expect(payload[1][0].createdAt).toBe(5000);
    });

    it('should reject a backup that exceeds the Firestore document limit', async () => {
      const hugeTasks = {
        1: [{ id: '1', text: 'x'.repeat(900 * 1024), segment: 1, createdAt: 1 }],
      };

      await expect(uploadBackup(mockDb, mockUserId, hugeTasks, 'en', false)).rejects.toThrow(
        /too large/i
      );
    });

    it('should show error notification on failure by default', async () => {
      const showErrorSpy = vi.spyOn(notifications, 'showError');
      const { setDoc } = await import('firebase/firestore');
      setDoc.mockRejectedValueOnce(new Error('Upload failed'));

      try {
        await uploadBackup(mockDb, mockUserId, mockTasks, 'en');
      } catch {
        // Expected to throw
      }

      expect(showErrorSpy).toHaveBeenCalledWith('Backup failed');
    });

    it('should suppress error notification when showNotification is false', async () => {
      const showErrorSpy = vi.spyOn(notifications, 'showError');
      const { setDoc } = await import('firebase/firestore');
      setDoc.mockRejectedValueOnce(new Error('Upload failed'));

      try {
        await uploadBackup(mockDb, mockUserId, mockTasks, 'en', false);
      } catch {
        // Expected to throw
      }

      expect(showErrorSpy).not.toHaveBeenCalled();
    });

    it('should still throw error when showNotification is false', async () => {
      const { setDoc } = await import('firebase/firestore');
      setDoc.mockRejectedValueOnce(new Error('Upload failed'));

      await expect(uploadBackup(mockDb, mockUserId, mockTasks, 'en', false)).rejects.toThrow(
        'Upload failed'
      );
    });

    it('should validate required parameters', async () => {
      await expect(uploadBackup(null, mockUserId, mockTasks, 'en')).rejects.toThrow(
        'Database and userId are required'
      );

      await expect(uploadBackup({}, null, mockTasks, 'en')).rejects.toThrow(
        'Database and userId are required'
      );

      await expect(uploadBackup({}, mockUserId, null, 'en')).rejects.toThrow(
        'Tasks object is required'
      );
    });
  });

  describe('listBackups', () => {
    it('should return an empty list without db or userId', async () => {
      expect(await listBackups(null, 'u1')).toEqual([]);
      expect(await listBackups({}, null)).toEqual([]);
    });

    it('should return backups sorted newest first', async () => {
      const { getDocs } = await import('firebase/firestore');
      const docs = [
        { id: 'backup-100', data: () => ({ timestamp: 100, taskCount: 1 }) },
        { id: 'backup-300', data: () => ({ timestamp: 300, taskCount: 3 }) },
        { id: 'backup-200', data: () => ({ timestamp: 200, taskCount: 2 }) },
      ];
      getDocs.mockResolvedValueOnce({ forEach: (fn) => docs.forEach(fn) });

      const result = await listBackups({}, 'u1');

      expect(result.map((b) => b.timestamp)).toEqual([300, 200, 100]);
      expect(result[0].date).toBeInstanceOf(Date);
    });

    it('should fall back to the document id when the timestamp field is missing', async () => {
      const { getDocs } = await import('firebase/firestore');
      getDocs.mockResolvedValueOnce({
        forEach: (fn) => [{ id: 'backup-4200', data: () => ({}) }].forEach(fn),
      });

      const result = await listBackups({}, 'u1');

      expect(result[0].timestamp).toBe(4200);
    });

    it('should return an empty list instead of throwing on failure', async () => {
      const { getDocs } = await import('firebase/firestore');
      getDocs.mockRejectedValueOnce(new Error('offline'));

      expect(await listBackups({}, 'u1')).toEqual([]);
    });
  });

  describe('downloadBackup', () => {
    it('should parse the serialized payload', async () => {
      const { getDoc } = await import('firebase/firestore');
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ version: '2.0', timestamp: 7, payload: '{"1":[{"text":"a"}]}' }),
      });

      const result = await downloadBackup({}, 'u1', 'backup-7');

      expect(result.timestamp).toBe(7);
      expect(result.tasks[1][0].text).toBe('a');
    });

    it('should throw when the backup does not exist', async () => {
      const { getDoc } = await import('firebase/firestore');
      getDoc.mockResolvedValueOnce({ exists: () => false });

      await expect(downloadBackup({}, 'u1', 'missing')).rejects.toThrow('Backup not found');
    });

    it('should validate required parameters', async () => {
      await expect(downloadBackup(null, 'u1', 'b1')).rejects.toThrow(
        'Database, userId and backupId are required'
      );
    });
  });

  describe('restoreBackup', () => {
    it('should apply tasks and persist them', async () => {
      const setTasks = vi.fn();
      const save = vi.fn(() => Promise.resolve());

      await restoreBackup({ tasks: { 1: [] } }, setTasks, save, 'en');

      expect(setTasks).toHaveBeenCalledWith({ 1: [] });
      expect(save).toHaveBeenCalled();
    });

    it('should reject invalid backup data', async () => {
      const showErrorSpy = vi.spyOn(notifications, 'showError');

      await expect(restoreBackup(null, vi.fn(), vi.fn(), 'en')).rejects.toThrow(
        'Invalid backup data'
      );
      expect(showErrorSpy).toHaveBeenCalledWith('Restore failed');
    });
  });

  describe('auto-backup failure tracking (#409)', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('does not record a failed attempt as a successful backup', () => {
      trackBackupFailure();

      expect(localStorage.getItem('lastAutoBackup')).toBeNull();
      expect(localStorage.getItem('lastBackupAttempt')).not.toBeNull();
    });

    it('still throttles retries weekly after a failure', () => {
      trackBackupFailure();

      expect(shouldAutoBackup()).toBe(false);
    });

    it('resumes auto-backup after a success clears the failure state', () => {
      trackBackupFailure();
      trackBackupFailure();
      trackBackupFailure();
      expect(shouldAutoBackup()).toBe(false);

      markAutoBackupCompleted();

      expect(localStorage.getItem('autoBackupFailureCount')).toBeNull();
      expect(shouldAutoBackup()).toBe(false); // just backed up, still within the week
    });

    it('allows a backup when neither a success nor an attempt was ever recorded', () => {
      expect(shouldAutoBackup()).toBe(true);
    });
  });
});
