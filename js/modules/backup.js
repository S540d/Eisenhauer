/**
 * Backup Module
 * Handles automatic cloud backups to Firebase Storage
 */

import { ref, uploadBytes, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { showSuccess, showError } from './notifications.js';

const MAX_BACKUPS = 4; // Keep last 4 backups
const BACKUP_PREFIX = 'backup-';

/**
 * Create backup data object
 * @param {object} tasks - Tasks object
 * @returns {object} Backup data
 */
function createBackupData(tasks) {
  // Ensure tasks is a valid object before attempting to deep clone
  const safeTasks =
    tasks && typeof tasks === 'object'
      ? JSON.parse(JSON.stringify(tasks)) // Deep clone
      : {};

  return {
    version: '1.0',
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
    tasks: safeTasks,
  };
}

/**
 * Upload backup to Firebase Storage
 * @param {object} storage - Firebase Storage instance
 * @param {string} userId - User ID
 * @param {object} tasks - Tasks object
 * @param {string} currentLanguage - Current language for notifications
 * @returns {Promise<string>} Backup filename
 */
export async function uploadBackup(storage, userId, tasks, currentLanguage = 'en') {
  if (!storage || !userId) {
    throw new Error('Storage and userId are required');
  }

  if (!tasks) {
    throw new Error('Tasks object is required');
  }

  try {
    // Create backup data
    const backupData = createBackupData(tasks);
    const timestamp = Date.now();
    const filename = `${BACKUP_PREFIX}${timestamp}.json`;
    const filepath = `users/${userId}/backups/${filename}`;

    // Create blob
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });

    // Upload to Firebase Storage
    const storageRef = ref(storage, filepath);
    await uploadBytes(storageRef, blob);

    // Clean up old backups
    await cleanupOldBackups(storage, userId);

    const message = currentLanguage === 'de' ? 'Backup erstellt' : 'Backup created';
    showSuccess(message);

    return filename;
  } catch (error) {
    console.error('Backup upload failed:', error);
    const message = currentLanguage === 'de' ? 'Backup fehlgeschlagen' : 'Backup failed';
    showError(message);
    throw error;
  }
}

/**
 * List all backups for a user
 * @param {object} storage - Firebase Storage instance
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of backup metadata
 */
export async function listBackups(storage, userId) {
  if (!storage || !userId) {
    return [];
  }

  try {
    const backupsRef = ref(storage, `users/${userId}/backups`);
    const result = await listAll(backupsRef);

    const backups = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        const filename = itemRef.name;

        // Extract timestamp from filename
        const timestampMatch = filename.match(/backup-(\d+)\.json/);
        const timestamp = timestampMatch ? parseInt(timestampMatch[1]) : 0;

        return {
          filename,
          path: itemRef.fullPath,
          url,
          timestamp,
          date: new Date(timestamp),
          size: 0, // Size not available without downloading
        };
      })
    );

    // Sort by timestamp descending (newest first)
    return backups.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to list backups:', error);
    return [];
  }
}

/**
 * Download and parse backup
 * @param {string} url - Backup URL
 * @returns {Promise<object>} Backup data
 */
export async function downloadBackup(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to download backup:', error);
    throw error;
  }
}

/**
 * Restore backup
 * @param {object} backupData - Backup data
 * @param {Function} setTasksCallback - Callback to set tasks
 * @param {Function} saveCallback - Callback to save tasks
 * @param {string} currentLanguage - Current language
 */
export async function restoreBackup(
  backupData,
  setTasksCallback,
  saveCallback,
  currentLanguage = 'en'
) {
  try {
    if (!backupData || !backupData.tasks) {
      throw new Error('Invalid backup data');
    }

    // Restore tasks
    setTasksCallback(backupData.tasks);

    // Save to current storage
    if (saveCallback) {
      await saveCallback();
    }

    const message = currentLanguage === 'de' ? 'Backup wiederhergestellt' : 'Backup restored';
    showSuccess(message);
  } catch (error) {
    console.error('Failed to restore backup:', error);
    const message =
      currentLanguage === 'de' ? 'Wiederherstellung fehlgeschlagen' : 'Restore failed';
    showError(message);
    throw error;
  }
}

/**
 * Clean up old backups (keep only MAX_BACKUPS)
 * @param {object} storage - Firebase Storage instance
 * @param {string} userId - User ID
 */
async function cleanupOldBackups(storage, userId) {
  try {
    const backups = await listBackups(storage, userId);

    if (backups.length > MAX_BACKUPS) {
      // Delete oldest backups
      const toDelete = backups.slice(MAX_BACKUPS);

      for (const backup of toDelete) {
        const backupRef = ref(storage, backup.path);
        await deleteObject(backupRef);
      }
    }
  } catch (error) {
    console.error('Failed to cleanup old backups:', error);
    // Don't throw - cleanup failure shouldn't fail the backup
  }
}

/**
 * Check if backup should run automatically
 * @returns {boolean} True if backup should run
 */
export function shouldAutoBackup() {
  const lastBackup = localStorage.getItem('lastAutoBackup');
  if (!lastBackup) return true;

  const lastBackupTime = parseInt(lastBackup);
  if (isNaN(lastBackupTime)) return true;

  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  const weekInMs = 7 * dayInMs;

  // Auto-backup weekly
  return now - lastBackupTime > weekInMs;
}

/**
 * Mark auto-backup as completed
 */
export function markAutoBackupCompleted() {
  localStorage.setItem('lastAutoBackup', Date.now().toString());
}
