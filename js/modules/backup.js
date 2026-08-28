/**
 * Backup Module
 * Handles cloud backups of the task matrix.
 *
 * Storage backend: **Firestore**, subcollection `users/{userId}/backups/{backupId}`.
 *
 * Historical note (Issue #359 / #396): backups used to be JSON blobs in Firebase
 * Cloud Storage. Since October 2024 Firebase requires the paid Blaze plan for
 * Cloud Storage, and this project runs on the free Spark plan, so every upload
 * failed with a permission error — the feature was structurally broken, not
 * merely buggy. Firestore stays free on Spark and the app already uses it for
 * tasks, so backups now live there too.
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { showSuccess, showError } from './notifications.js';

const MAX_BACKUPS = 4; // Keep last 4 backups
const BACKUP_PREFIX = 'backup-';

/**
 * Firestore rejects any document of 1 MiB or more. We budget well below that:
 * the serialized JSON is only an estimate of the stored size (Firestore adds
 * field-name and index overhead), so a backup that measures close to the limit
 * would still be rejected server-side with an opaque error. Refusing early lets
 * us show the user something actionable instead.
 */
const MAX_BACKUP_BYTES = 800 * 1024;

/**
 * Coerce a timestamp field to epoch milliseconds.
 *
 * Task timestamps are normally plain numbers (`Date.now()`, see createTaskObject
 * in tasks.js, and the numeric comparison in getVisibleTasks). A task written
 * without an explicit createdAt however gets Firestore's serverTimestamp(), and
 * reading that back yields a Timestamp object which JSON.stringify would flatten
 * into `{seconds, nanoseconds}` — restoring that shape would silently break every
 * numeric date comparison. Normalising on the way into the backup keeps restored
 * tasks in the one format the app logic actually expects.
 *
 * @param {*} value - Raw timestamp value
 * @returns {number|null} Epoch milliseconds, or null if not interpretable
 */
function toEpochMillis(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;

  // Firestore Timestamp instance
  if (typeof value.toMillis === 'function') return value.toMillis();

  // Plain object from a serialized Firestore Timestamp
  if (typeof value.seconds === 'number') {
    return value.seconds * 1000 + Math.floor((value.nanoseconds || 0) / 1e6);
  }

  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return isNaN(parsed) ? null : parsed;
  }

  return null;
}

/**
 * Normalise a single task for storage in a backup.
 * @param {object} task - Task object
 * @returns {object} Task with normalised timestamps
 */
function normalizeTask(task) {
  if (!task || typeof task !== 'object') return task;

  const normalized = { ...task };

  const createdAt = toEpochMillis(task.createdAt);
  if (createdAt !== null) normalized.createdAt = createdAt;

  const completedAt = toEpochMillis(task.completedAt);
  if (completedAt !== null) normalized.completedAt = completedAt;

  return normalized;
}

/**
 * Create backup data object
 * @param {object} tasks - Tasks object
 * @returns {object} Backup data
 */
function createBackupData(tasks) {
  const safeTasks = {};

  if (tasks && typeof tasks === 'object') {
    Object.entries(tasks).forEach(([segment, segmentTasks]) => {
      safeTasks[segment] = Array.isArray(segmentTasks) ? segmentTasks.map(normalizeTask) : [];
    });
  }

  return {
    version: '2.0', // 2.0 = Firestore-backed backup (1.0 was the Storage blob format)
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
    tasks: safeTasks,
  };
}

/**
 * Count the tasks contained in a backup payload, for display in the restore UI.
 * @param {object} tasks - Tasks object keyed by segment
 * @returns {number} Total task count
 */
function countTasks(tasks) {
  if (!tasks || typeof tasks !== 'object') return 0;
  return Object.values(tasks).reduce(
    (total, segment) => total + (Array.isArray(segment) ? segment.length : 0),
    0
  );
}

/**
 * Upload a backup to Firestore
 * @param {object} db - Firestore database instance
 * @param {string} userId - User ID
 * @param {object} tasks - Tasks object
 * @param {string} currentLanguage - Current language for notifications
 * @param {boolean} showNotification - Whether to show success/error notifications (default: true)
 * @returns {Promise<string>} Backup document ID
 */
export async function uploadBackup(
  db,
  userId,
  tasks,
  currentLanguage = 'en',
  showNotification = true
) {
  if (!db || !userId) {
    throw new Error('Database and userId are required');
  }

  if (!tasks) {
    throw new Error('Tasks object is required');
  }

  try {
    const backupData = createBackupData(tasks);
    const backupId = `${BACKUP_PREFIX}${backupData.timestamp}`;

    // Serialize the task tree into a single string field. Storing it opaquely
    // (rather than as nested Firestore maps/arrays) keeps the document shape
    // flat and stable, so security rules can validate it without needing to
    // know the task schema, and a future task-model change cannot silently
    // invalidate old backups.
    const payload = JSON.stringify(backupData.tasks);
    const byteSize = new Blob([payload]).size;

    if (byteSize > MAX_BACKUP_BYTES) {
      const message =
        currentLanguage === 'de'
          ? 'Backup zu gross für die Cloud. Bitte nutze den lokalen Export.'
          : 'Backup too large for the cloud. Please use the local export instead.';
      throw new Error(message);
    }

    const backupRef = doc(collection(db, 'users', userId, 'backups'), backupId);
    await setDoc(backupRef, {
      version: backupData.version,
      timestamp: backupData.timestamp,
      createdAt: serverTimestamp(),
      taskCount: countTasks(backupData.tasks),
      byteSize,
      payload,
    });

    // Clean up old backups
    await cleanupOldBackups(db, userId);

    if (showNotification) {
      const message = currentLanguage === 'de' ? 'Backup erstellt' : 'Backup created';
      showSuccess(message);
    }

    return backupId;
  } catch (error) {
    console.error('Backup upload failed:', error);
    if (showNotification) {
      const message = currentLanguage === 'de' ? 'Backup fehlgeschlagen' : 'Backup failed';
      showError(message);
    }
    throw error;
  }
}

/**
 * List all backups for a user, newest first.
 * @param {object} db - Firestore database instance
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of backup metadata (without the payload)
 */
export async function listBackups(db, userId) {
  if (!db || !userId) {
    return [];
  }

  try {
    const backupsRef = collection(db, 'users', userId, 'backups');
    const snapshot = await getDocs(backupsRef);

    const backups = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() || {};

      // Fall back to the document ID when the timestamp field is missing, so a
      // partially written document still sorts and renders sensibly.
      const idMatch = String(docSnap.id).match(/(\d+)/);
      const timestamp =
        typeof data.timestamp === 'number' ? data.timestamp : idMatch ? parseInt(idMatch[1]) : 0;

      backups.push({
        id: docSnap.id,
        timestamp,
        date: new Date(timestamp),
        taskCount: typeof data.taskCount === 'number' ? data.taskCount : null,
        byteSize: typeof data.byteSize === 'number' ? data.byteSize : null,
      });
    });

    // Sort by timestamp descending (newest first)
    return backups.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to list backups:', error);
    return [];
  }
}

/**
 * Load a single backup's task data from Firestore.
 * @param {object} db - Firestore database instance
 * @param {string} userId - User ID
 * @param {string} backupId - Backup document ID
 * @returns {Promise<object>} Backup data in the shape { version, timestamp, tasks }
 */
export async function downloadBackup(db, userId, backupId) {
  if (!db || !userId || !backupId) {
    throw new Error('Database, userId and backupId are required');
  }

  try {
    const backupRef = doc(collection(db, 'users', userId, 'backups'), backupId);
    const snapshot = await getDoc(backupRef);

    if (!snapshot.exists()) {
      throw new Error('Backup not found');
    }

    const data = snapshot.data() || {};

    let tasks;
    if (typeof data.payload === 'string') {
      tasks = JSON.parse(data.payload);
    } else if (data.tasks && typeof data.tasks === 'object') {
      // Tolerate a backup written as nested maps rather than a JSON string.
      tasks = data.tasks;
    } else {
      throw new Error('Backup is empty or malformed');
    }

    return {
      version: data.version || '2.0',
      timestamp: data.timestamp || 0,
      tasks,
    };
  } catch (error) {
    console.error('Failed to load backup:', error);
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
 * @param {object} db - Firestore database instance
 * @param {string} userId - User ID
 */
async function cleanupOldBackups(db, userId) {
  try {
    const backups = await listBackups(db, userId);

    if (backups.length > MAX_BACKUPS) {
      // Delete oldest backups
      const toDelete = backups.slice(MAX_BACKUPS);

      const batch = writeBatch(db);
      toDelete.forEach((backup) => {
        batch.delete(doc(collection(db, 'users', userId, 'backups'), backup.id));
      });
      await batch.commit();
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
  // Stop retrying after 3 consecutive failures until user does manual backup
  const failureCount = parseInt(localStorage.getItem('autoBackupFailureCount') || '0');
  if (failureCount >= 3) return false;

  // 'lastAutoBackup' (last success) and 'lastBackupAttempt' (last try,
  // success or failure) are separate keys so the UI can tell them apart
  // (issue #409). The weekly throttle only cares about the more recent
  // of the two, whichever it was.
  const lastBackup = parseInt(localStorage.getItem('lastAutoBackup'));
  const lastAttempt = parseInt(localStorage.getItem('lastBackupAttempt'));
  const lastBackupTime = Math.max(
    isNaN(lastBackup) ? -Infinity : lastBackup,
    isNaN(lastAttempt) ? -Infinity : lastAttempt
  );
  if (!isFinite(lastBackupTime)) return true;

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
  // Reset failure count on success
  localStorage.removeItem('autoBackupFailureCount');
}

/**
 * Track backup failure and check if user should be notified
 * Only notify after 3 consecutive failures
 * @returns {boolean} True if user should be notified
 */
export function trackBackupFailure() {
  const failureCount = parseInt(localStorage.getItem('autoBackupFailureCount') || '0');
  const newCount = failureCount + 1;
  localStorage.setItem('autoBackupFailureCount', newCount.toString());

  // Separate key from 'lastAutoBackup' (success only) so shouldAutoBackup()
  // still respects the weekly interval on failure without making the UI
  // show a failed attempt as if it were a successful backup (issue #409).
  localStorage.setItem('lastBackupAttempt', Date.now().toString());

  // Notify user only after 3 consecutive failures
  return newCount >= 3;
}
