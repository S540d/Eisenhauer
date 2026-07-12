/**
 * Unit Tests for Backup Module
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { uploadBackup } from '../../js/modules/backup.js';
import * as notifications from '../../js/modules/notifications.js';

// Mock Firebase Storage
vi.mock('firebase/storage', () => ({
  ref: vi.fn(() => 'mock-ref'),
  uploadBytes: vi.fn(() => Promise.resolve()),
  listAll: vi.fn(() => Promise.resolve({ items: [] })),
  getDownloadURL: vi.fn(() => Promise.resolve('mock-url')),
  deleteObject: vi.fn(() => Promise.resolve()),
}));

describe('Backup Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadBackup', () => {
    const mockStorage = {};
    const mockUserId = 'test-user-123';
    const mockTasks = {
      urgent_important: [],
      not_urgent_important: [],
      urgent_not_important: [],
      not_urgent_not_important: [],
    };

    it('should show success notification by default', async () => {
      const showSuccessSpy = vi.spyOn(notifications, 'showSuccess');

      await uploadBackup(mockStorage, mockUserId, mockTasks, 'en');

      expect(showSuccessSpy).toHaveBeenCalledWith('Backup created');
    });

    it('should show success notification in German', async () => {
      const showSuccessSpy = vi.spyOn(notifications, 'showSuccess');

      await uploadBackup(mockStorage, mockUserId, mockTasks, 'de');

      expect(showSuccessSpy).toHaveBeenCalledWith('Backup erstellt');
    });

    it('should suppress success notification when showNotification is false', async () => {
      const showSuccessSpy = vi.spyOn(notifications, 'showSuccess');

      await uploadBackup(mockStorage, mockUserId, mockTasks, 'en', false);

      expect(showSuccessSpy).not.toHaveBeenCalled();
    });

    it('should show success notification when showNotification is true', async () => {
      const showSuccessSpy = vi.spyOn(notifications, 'showSuccess');

      await uploadBackup(mockStorage, mockUserId, mockTasks, 'en', true);

      expect(showSuccessSpy).toHaveBeenCalledWith('Backup created');
    });

    it('should show error notification on failure by default', async () => {
      const showErrorSpy = vi.spyOn(notifications, 'showError');
      const { uploadBytes } = await import('firebase/storage');
      uploadBytes.mockRejectedValueOnce(new Error('Upload failed'));

      try {
        await uploadBackup(mockStorage, mockUserId, mockTasks, 'en');
      } catch (error) {
        // Expected to throw
      }

      expect(showErrorSpy).toHaveBeenCalledWith('Backup failed');
    });

    it('should suppress error notification when showNotification is false', async () => {
      const showErrorSpy = vi.spyOn(notifications, 'showError');
      const { uploadBytes } = await import('firebase/storage');
      uploadBytes.mockRejectedValueOnce(new Error('Upload failed'));

      try {
        await uploadBackup(mockStorage, mockUserId, mockTasks, 'en', false);
      } catch (error) {
        // Expected to throw
      }

      expect(showErrorSpy).not.toHaveBeenCalled();
    });

    it('should still throw error when showNotification is false', async () => {
      const { uploadBytes } = await import('firebase/storage');
      const mockError = new Error('Upload failed');
      uploadBytes.mockRejectedValueOnce(mockError);

      await expect(uploadBackup(mockStorage, mockUserId, mockTasks, 'en', false)).rejects.toThrow(
        'Upload failed'
      );
    });

    it('should report failures to window.errorTracker when configured', async () => {
      const { uploadBytes } = await import('firebase/storage');
      const mockError = new Error('storage/unauthorized');
      uploadBytes.mockRejectedValueOnce(mockError);
      window.errorTracker = { captureException: vi.fn() };

      try {
        await uploadBackup(mockStorage, mockUserId, mockTasks, 'en');
      } catch (error) {
        // Expected to throw
      }

      expect(window.errorTracker.captureException).toHaveBeenCalledWith(
        mockError,
        expect.objectContaining({ context: { operation: 'uploadBackup', userId: mockUserId } })
      );

      delete window.errorTracker;
    });

    it('should not throw when window.errorTracker is not configured', async () => {
      const { uploadBytes } = await import('firebase/storage');
      uploadBytes.mockRejectedValueOnce(new Error('Upload failed'));
      delete window.errorTracker;

      await expect(uploadBackup(mockStorage, mockUserId, mockTasks, 'en')).rejects.toThrow(
        'Upload failed'
      );
    });

    it('should validate required parameters', async () => {
      await expect(uploadBackup(null, mockUserId, mockTasks, 'en')).rejects.toThrow(
        'Storage and userId are required'
      );

      await expect(uploadBackup(mockStorage, null, mockTasks, 'en')).rejects.toThrow(
        'Storage and userId are required'
      );

      await expect(uploadBackup(mockStorage, mockUserId, null, 'en')).rejects.toThrow(
        'Tasks object is required'
      );
    });
  });
});
