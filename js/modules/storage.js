/**
 * Storage Module (Phase 4: Offline-Support Enhanced) - Modular SDK V2
 * Handles data persistence (Firebase Firestore, LocalForage, Import/Export)
 * Integrated with OfflineQueue for robust offline operations
 */

import localforage from 'localforage';
import { db } from './firebase-init.js';
import { OfflineQueue } from './offline-queue.js';
import { ErrorHandler, NetworkError } from './error-handler.js';
import { showError, showSuccess, showInfo, showWarning } from './notifications.js';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  deleteField,
} from 'firebase/firestore';

// Initialize offline queue
const offlineQueue = new OfflineQueue('eisenhauer-sync-queue');

// UI update callback
let syncStatusCallback = null;

/**
 * Initialize storage module with notification support
 * @param {Function} onSyncStatusChange - Optional callback for sync status updates
 */
export function initStorage(onSyncStatusChange = null) {
  syncStatusCallback = onSyncStatusChange;

  // Listen for network status changes
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Setup queue event listeners
  offlineQueue.on('itemProcessed', (item) => {
    updateSyncStatusUI();
  });

  offlineQueue.on('itemFailed', (item, error) => {
    showError(`Sync failed: ${item.operation}`, {
      duration: 5000,
      actions: [
        {
          label: 'Retry',
          onClick: () => offlineQueue.processQueue(),
        },
      ],
    });
    updateSyncStatusUI();
  });

  offlineQueue.on('queueEmpty', () => {
    showSuccess('All changes synced', 2000);
    updateSyncStatusUI();
  });

  // Initial status update
  updateSyncStatusUI();
}

/**
 * Update sync status UI via callback
 */
function updateSyncStatusUI() {
  if (syncStatusCallback) {
    syncStatusCallback(getSyncStatus());
  }
}

/**
 * Handle online event - start processing queue
 */
async function handleOnline() {
  showInfo('Back online - syncing changes...', 3000);
  updateSyncStatusUI();
  await offlineQueue.processQueue();
}

/**
 * Handle offline event
 */
function handleOffline() {
  showWarning('You are offline - changes will be synced later', { duration: 5000 });
  updateSyncStatusUI();
}

/**
 * Get current queue status
 * @returns {object} Queue statistics
 */
export function getSyncStatus() {
  return {
    pendingItems: offlineQueue.getPendingCount(),
    isProcessing: offlineQueue.isProcessing,
    isOnline: navigator.onLine,
  };
}

/**
 * Save all tasks to storage (Firebase or LocalForage depending on auth state)
 * @param {object} tasks - Tasks object to save
 */
export async function saveTasks(tasks) {
  // Use guest mode saving if in guest mode (delegates to localForage)
  if (typeof isGuestMode !== 'undefined' && isGuestMode) {
    await saveGuestTasks(tasks);
  }
  // If logged in, tasks are saved to Firestore automatically via individual save functions
}

/**
 * Save guest tasks to LocalForage (IndexedDB)
 * @param {object} tasks - Tasks object
 */
export async function saveGuestTasks(tasks) {
  try {
    await localforage.setItem('eisenhauerTasks', tasks);
  } catch (error) {}
}

/**
 * Load guest tasks from LocalForage
 * @returns {Promise<object>} Tasks object
 */
export async function loadGuestTasks() {
  try {
    // Try IndexedDB first (new method)
    let tasksData = await localforage.getItem('eisenhauerTasks');

    // Fallback to localStorage for migration
    if (!tasksData) {
      const localTasks = localStorage.getItem('eisenhauerTasks');
      if (localTasks) {
        tasksData = JSON.parse(localTasks);
        // Migrate to IndexedDB
        await localforage.setItem('eisenhauerTasks', tasksData);
        localStorage.removeItem('eisenhauerTasks');
      }
    }

    if (tasksData) {
      return tasksData;
    }

    // Return empty tasks structure if no data
    return { 1: [], 2: [], 3: [], 4: [], 5: [] };
  } catch (error) {
    return { 1: [], 2: [], 3: [], 4: [], 5: [] };
  }
}

/**
 * Load user tasks from Firestore
 * @param {string} userId - User ID
 * @param {object} db - Firestore database instance
 * @returns {Promise<object>} Tasks object
 */
export async function loadUserTasks(userId, db) {
  if (!userId || !db) return { 1: [], 2: [], 3: [], 4: [], 5: [] };

  try {
    // Load tasks from Firestore using Modular SDK
    const tasksRef = collection(db, 'users', userId, 'tasks');
    const snapshot = await getDocs(tasksRef);

    // Initialize empty tasks structure
    const tasks = { 1: [], 2: [], 3: [], 4: [], 5: [] };

    // Load tasks from Firestore
    snapshot.forEach((docSnap) => {
      const task = docSnap.data();
      task.id = docSnap.id; // Use Firestore document ID

      // Ensure segment exists
      if (tasks[task.segment]) {
        tasks[task.segment].push(task);
      }
    });
    return tasks;
  } catch (error) {
    return { 1: [], 2: [], 3: [], 4: [], 5: [] };
  }
}

/**
 * Save a single task to Firestore (with offline queue support)
 * @param {object} task - Task object
 * @param {string} userId - User ID
 * @param {object} db - Firestore database instance
 * @param {object} firebase - Firebase instance
 */
export async function saveTaskToFirestore(task, userId, db, firebase) {
  if (!userId || !db) return;

  // Validate task data
  if (!task || typeof task.text !== 'string' || !task.segment) {
    console.error('Invalid task data', task);
    return;
  }

  const taskData = {
    text: task.text,
    segment: task.segment,
    checked: task.checked || false,
    // Preserve existing createdAt if it exists (for moved tasks), otherwise use server timestamp
    createdAt: task.createdAt || serverTimestamp(),
  };

  // Add optional fields
  if (task.completedAt) {
    taskData.completedAt = task.completedAt;
  }

  if (task.recurring) {
    taskData.recurring = task.recurring;
  }

  // Add to offline queue with retry logic and error handling
  try {
    await offlineQueue.add(
      'saveTask',
      async () => {
        // Use setDoc with Modular SDK
        const taskRef = doc(collection(db, 'users', userId, 'tasks'), task.id.toString());
        await setDoc(taskRef, taskData);
      },
      {
        taskId: task.id,
        userId,
        taskData,
      },
      3 // maxRetries
    );
  } catch (error) {
    // Graceful degradation: Continue with local storage only
    console.warn('Firebase save failed, continuing with local storage:', error);
    ErrorHandler.handleStorageError(error, {
      operation: 'saveTaskToFirestore',
      data: { taskId: task.id },
      silent: false,
    });
  }
}

/**
 * Update a task in Firestore (with offline queue support)
 * @param {object} task - Task object
 * @param {string} userId - User ID
 * @param {object} db - Firestore database instance
 * @param {object} firebase - Firebase instance
 */
export async function updateTaskInFirestore(task, userId, db, firebase) {
  if (!userId || !db) return;

  const updateData = {
    text: task.text,
    segment: task.segment,
    checked: task.checked || false,
    // Preserve existing createdAt if it exists, otherwise use server timestamp
    createdAt: task.createdAt || serverTimestamp(),
  };

  if (task.completedAt) {
    updateData.completedAt = task.completedAt;
  }

  if (task.recurring) {
    updateData.recurring = task.recurring;
  }

  // Add to offline queue with retry logic
  await offlineQueue.add(
    'updateTask',
    async () => {
      // Use setDoc with merge:true to handle both new and existing tasks (Modular SDK)
      const taskRef = doc(collection(db, 'users', userId, 'tasks'), task.id.toString());
      await setDoc(taskRef, updateData, { merge: true });
    },
    {
      taskId: task.id,
      userId,
      updateData,
    },
    3 // maxRetries
  );
}

/**
 * Delete a task from Firestore (with offline queue support)
 * @param {number} taskId - Task ID
 * @param {string} userId - User ID
 * @param {object} db - Firestore database instance
 */
export async function deleteTaskFromFirestore(taskId, userId, db) {
  if (!userId || !db) return;

  // Add to offline queue with retry logic
  await offlineQueue.add(
    'deleteTask',
    async () => {
      // Use deleteDoc with Modular SDK
      const taskRef = doc(collection(db, 'users', userId, 'tasks'), taskId.toString());
      await deleteDoc(taskRef);
    },
    {
      taskId,
      userId,
    },
    3 // maxRetries
  );
}

/**
 * Import guest tasks to user account (explicit user action)
 * User triggers this manually from Settings Modal
 * @param {string} userId - User ID
 * @param {object} db - Firestore database instance
 * @returns {object} { success, taskCount, error }
 */
export async function importGuestTasksToFirestore(userId, db) {
  try {
    // Try to get data from IndexedDB (new method)
    let tasksData = await localforage.getItem('eisenhauerTasks');

    // Fallback to old localStorage
    if (!tasksData) {
      const localTasks = localStorage.getItem('eisenhauerTasks');
      if (localTasks) {
        tasksData = JSON.parse(localTasks);
      }
    }

    // If no guest tasks, nothing to import
    if (!tasksData) {
      return {
        success: false,
        taskCount: 0,
        error: 'Keine Gast-Tasks zum Importieren gefunden',
      };
    }

    // Count tasks
    let totalTasks = 0;
    Object.keys(tasksData).forEach((segmentId) => {
      totalTasks += tasksData[segmentId].length;
    });

    if (totalTasks === 0) {
      return {
        success: false,
        taskCount: 0,
        error: 'Keine Gast-Tasks zum Importieren gefunden',
      };
    }

    // Import tasks to Firestore
    const batch = writeBatch(db);
    let importedCount = 0;

    Object.keys(tasksData).forEach((segmentId) => {
      tasksData[segmentId].forEach((task) => {
        const docRef = doc(collection(db, 'users', userId, 'tasks'), task.id.toString());

        const taskData = {
          text: task.text,
          segment: task.segment,
          checked: task.checked || false,
          createdAt: task.createdAt || serverTimestamp(),
        };

        if (task.completedAt) {
          taskData.completedAt = task.completedAt;
        }

        if (task.recurring) {
          taskData.recurring = task.recurring;
        }

        batch.set(docRef, taskData);
        importedCount++;
      });
    });

    await batch.commit();

    // Delete guest tasks after successful import
    await localforage.removeItem('eisenhauerTasks');
    localStorage.removeItem('eisenhauerTasks');

    return {
      success: true,
      taskCount: importedCount,
      error: null,
    };
  } catch (error) {
    console.error(`[Import] Error importing guest tasks for user ${userId}:`, error);
    return {
      success: false,
      taskCount: 0,
      error: error.message || 'Fehler beim Importieren der Gast-Tasks',
    };
  }
}

/**
 * Export data as JSON file
 * @param {object} tasks - Tasks object
 * @param {string} version - App version
 */
export function exportData(tasks, version) {
  const exportData = {
    version: version || 'unknown',
    exportDate: new Date().toISOString(),
    tasks: tasks,
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });

  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  const dateStr = new Date().toISOString().split('T')[0];
  link.download = 'eisenhauer-backup-' + dateStr + '.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import data from JSON file
 * @param {File} file - File to import
 * @param {object} currentTasks - Current tasks object
 * @param {function} saveCallback - Callback to save imported tasks
 * @returns {Promise<object>} Imported tasks object
 */
export function importData(file, currentTasks, saveCallback) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        // Validate data structure
        if (!importedData.tasks) {
          throw new Error('Ungültiges Datenformat: Keine Tasks gefunden');
        }

        let finalTasks;

        if (
          confirm(
            'Möchtest du die importierten Daten mit den aktuellen Daten zusammenführen? (Abbrechen = Aktuelle Daten ersetzen)'
          )
        ) {
          // Merge: Add imported tasks to existing ones
          finalTasks = { ...currentTasks };

          Object.keys(importedData.tasks).forEach((segmentId) => {
            if (!finalTasks[segmentId]) {
              finalTasks[segmentId] = [];
            }

            importedData.tasks[segmentId].forEach((task) => {
              // Generate new ID to avoid conflicts
              task.id = Date.now() + Math.random();
              finalTasks[segmentId].push(task);
            });
          });
        } else {
          // Replace: Overwrite existing tasks
          finalTasks = importedData.tasks;
        }

        // Call save callback if provided
        if (saveCallback) {
          await saveCallback(finalTasks);
        }
        resolve(finalTasks);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Fehler beim Lesen der Datei'));
    };

    reader.readAsText(file);
  });
}

/**
 * Request persistent storage permission (for guest mode)
 * @returns {Promise<boolean>} True if persistent storage is granted
 */
export async function requestPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persist();
      return isPersisted;
    } catch (error) {
      return false;
    }
  }
  return false;
}

/**
 * Check if persistent storage is active
 * @returns {Promise<boolean>} True if storage is persistent
 */
export async function checkPersistentStorage() {
  if (navigator.storage && navigator.storage.persisted) {
    try {
      const isPersisted = await navigator.storage.persisted();
      return isPersisted;
    } catch (error) {
      return false;
    }
  }
  return false;
}
