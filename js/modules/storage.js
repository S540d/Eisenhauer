/**
 * Storage Module (Phase 4: Offline-Support Enhanced) - Modular SDK V2
 * Handles data persistence (Firebase Firestore, LocalForage, Import/Export)
 * Integrated with OfflineQueue for robust offline operations
 */

import localforage from 'localforage';
import { isGuestMode } from './auth.js';
import { OfflineQueue } from './offline-queue.js';
import { ErrorHandler } from './error-handler.js';
import { showError, showInfo, showWarning } from './notifications.js';
import { STORAGE_KEYS } from './config.js';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  deleteField,
  writeBatch,
  serverTimestamp,
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
  offlineQueue.on('itemProcessed', () => {
    updateSyncStatusUI();
  });

  offlineQueue.on('itemFailed', (item) => {
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
  } catch (_error) {
    // Guest task save failure is non-fatal; data remains in memory
  }
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
  } catch (_error) {
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
  if (!userId || !db) {
    return { 1: [], 2: [], 3: [], 4: [], 5: [] };
  }

  try {
    // Load tasks from Firestore using Modular SDK
    const tasksRef = collection(db, 'users', userId, 'tasks');

    const snapshot = await getDocs(tasksRef);

    // Initialize empty tasks structure
    const tasks = { 1: [], 2: [], 3: [], 4: [], 5: [] };

    // Guard against the same logical task appearing in more than one quadrant.
    // Historically this could happen when an unstable float ID drifted between
    // Number and String and a failed move left a stray duplicate document
    // behind, so the task rendered in several quadrants at once.
    const seenIds = new Set();

    // Load tasks from Firestore
    snapshot.forEach((docSnap) => {
      const task = docSnap.data();
      task.id = String(docSnap.id); // Firestore document ID is the source of truth

      // Skip duplicates (defensive: a task must live in exactly one quadrant)
      if (seenIds.has(task.id)) {
        return;
      }

      // Normalise the segment so a string/number mismatch still routes correctly
      const segment = Number(task.segment);
      if (tasks[segment]) {
        task.segment = segment;
        seenIds.add(task.id);
        tasks[segment].push(task);
      }
    });

    return tasks;
  } catch (_error) {
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
export async function saveTaskToFirestore(task, userId, db) {
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

  if (task.dueDate) {
    taskData.dueDate = task.dueDate;
  }

  if (task.category) {
    taskData.category = task.category;
  }

  if (task.notes) {
    taskData.notes = task.notes;
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
 * Save all tasks for a user in one or more Firestore batches (chunked at 500 ops/batch,
 * the Firestore writeBatch limit). Used for bulk operations (reorder, import) where saving
 * every task sequentially via saveTaskToFirestore would serialize N round-trips and block
 * the UI. Individual add/update/delete operations keep using saveTaskToFirestore/
 * updateTaskInFirestore/deleteTaskFromFirestore with their offline-queue retry logic.
 * @param {object} tasksBySegment - Tasks keyed by segment id, e.g. { 1: [...], 2: [...] }
 * @param {string} userId - User ID
 * @param {object} db - Firestore database instance
 */
export async function saveAllTasksToFirestore(tasksBySegment, userId, db) {
  if (!userId || !db) return;

  const allTasks = Object.values(tasksBySegment).flat();
  if (allTasks.length === 0) return;

  const BATCH_LIMIT = 500;
  const chunks = [];
  for (let i = 0; i < allTasks.length; i += BATCH_LIMIT) {
    chunks.push(allTasks.slice(i, i + BATCH_LIMIT));
  }

  // Add to offline queue with retry logic and error handling, same as the
  // single-task write path — a bulk write is just as likely to hit a flaky
  // connection, and it must not fail silently (Issue #385).
  try {
    await offlineQueue.add(
      'saveAllTasks',
      async () => {
        for (const chunk of chunks) {
          const batch = writeBatch(db);

          chunk.forEach((task) => {
            if (!task || typeof task.text !== 'string' || !task.segment) {
              return;
            }

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

            if (task.dueDate) {
              taskData.dueDate = task.dueDate;
            }

            if (task.category) {
              taskData.category = task.category;
            }

            if (task.notes) {
              taskData.notes = task.notes;
            }

            batch.set(docRef, taskData);
          });

          await batch.commit();
        }
      },
      {
        userId,
        taskCount: allTasks.length,
      },
      3 // maxRetries
    );
  } catch (error) {
    // Graceful degradation: Continue with local storage only
    console.warn('Firebase bulk save failed, continuing with local storage:', error);
    ErrorHandler.handleStorageError(error, {
      operation: 'saveAllTasksToFirestore',
      data: { taskCount: allTasks.length },
      silent: false,
    });
  }
}

/**
 * Replace the user's entire task collection in Firestore (Issue #396, backup restore).
 *
 * saveAllTasksToFirestore only writes the tasks it is given, so a task that no
 * longer exists in the new set would survive as an orphaned document. Restoring
 * a backup must reproduce that backup exactly, so this deletes every existing
 * task document first and then writes the restored set.
 *
 * Deliberately NOT routed through the offline queue: a half-applied restore
 * (deletes replayed later without their writes) would destroy data. It therefore
 * fails loudly instead, and the caller keeps the pre-restore safety backup.
 *
 * @param {object} tasksBySegment - Tasks keyed by segment id
 * @param {string} userId - User ID
 * @param {object} db - Firestore database instance
 */
export async function replaceAllTasksInFirestore(tasksBySegment, userId, db) {
  if (!userId || !db) return;

  const tasksRef = collection(db, 'users', userId, 'tasks');
  const BATCH_LIMIT = 500;

  // 1. Delete every existing task document
  const existing = await getDocs(tasksRef);
  const staleRefs = [];
  existing.forEach((docSnap) => staleRefs.push(docSnap.ref));

  for (let i = 0; i < staleRefs.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    staleRefs.slice(i, i + BATCH_LIMIT).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }

  // 2. Write the restored tasks
  const allTasks = Object.values(tasksBySegment || {})
    .flat()
    .filter(
      (task) =>
        task &&
        typeof task.text === 'string' &&
        task.segment &&
        task.id !== undefined &&
        task.id !== null
    );

  for (let i = 0; i < allTasks.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);

    allTasks.slice(i, i + BATCH_LIMIT).forEach((task) => {
      const docRef = doc(tasksRef, task.id.toString());
      const taskData = {
        text: task.text,
        segment: task.segment,
        checked: task.checked || false,
        createdAt: task.createdAt || serverTimestamp(),
      };

      if (task.completedAt) taskData.completedAt = task.completedAt;
      if (task.recurring) taskData.recurring = task.recurring;
      if (task.dueDate) taskData.dueDate = task.dueDate;
      if (task.category) taskData.category = task.category;
      if (task.notes) taskData.notes = task.notes;

      batch.set(docRef, taskData);
    });

    await batch.commit();
  }
}

/**
 * Update a task in Firestore (with offline queue support)
 * @param {object} task - Task object
 * @param {string} userId - User ID
 * @param {object} db - Firestore database instance
 * @param {object} firebase - Firebase instance
 */
export async function updateTaskInFirestore(task, userId, db) {
  if (!userId || !db) return;

  const updateData = {
    text: task.text,
    segment: task.segment,
    checked: task.checked || false,
    // Preserve existing createdAt if it exists, otherwise use server timestamp
    createdAt: task.createdAt || serverTimestamp(),
  };

  // setDoc uses merge:true below, so an omitted field would just keep its old
  // value in Firestore. Every optional field here is user-clearable — the edit
  // dialog can drop the due date, the category ("Keine"), the notes and the
  // recurring config, and un-checking a Done task resets completedAt — so an
  // absent/empty value must explicitly delete the field rather than silently
  // leaving a stale one behind. Without this the cleared value reappears on
  // the next load (Issue: clearing fields did not persist for signed-in users).
  updateData.completedAt = task.completedAt ? task.completedAt : deleteField();
  updateData.recurring = task.recurring ? task.recurring : deleteField();
  updateData.dueDate = task.dueDate ? task.dueDate : deleteField();
  updateData.category = task.category ? task.category : deleteField();
  updateData.notes = task.notes ? task.notes : deleteField();

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
 * Load guest notes from LocalForage.
 *
 * Read-only leftover from the removed standalone notes-overview feature —
 * kept solely so notes-migration.js can migrate any notes a guest had
 * already saved into Q4 tasks before this storage key is cleared for good.
 * @returns {Promise<Array>} Notes array
 */
export async function loadGuestNotes() {
  try {
    const notesData = await localforage.getItem(STORAGE_KEYS.NOTES);
    return Array.isArray(notesData) ? notesData : [];
  } catch (_error) {
    return [];
  }
}

/**
 * Load user notes from Firestore.
 *
 * Read-only leftover from the removed standalone notes-overview feature —
 * kept solely so notes-migration.js can migrate any notes a user had
 * already saved into Q4 tasks before the Firestore collection is cleared.
 * @param {string} userId - User ID
 * @param {object} db - Firestore database instance
 * @returns {Promise<Array>} Notes array
 */
export async function loadUserNotes(userId, db) {
  if (!userId || !db) return [];

  try {
    const notesRef = collection(db, 'users', userId, 'notes');
    const snapshot = await getDocs(notesRef);

    const notes = [];
    snapshot.forEach((docSnap) => {
      const note = docSnap.data();
      note.id = String(docSnap.id);
      notes.push(note);
    });

    // Firestore doesn't guarantee order without an explicit orderBy query,
    // so sort client-side to keep the collection chronological.
    notes.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

    return notes;
  } catch (_error) {
    return [];
  }
}

/**
 * Permanently clear the standalone notes collection after it has been
 * migrated into Q4 tasks (see notes-migration.js). Clears both the guest
 * LocalForage entry and, if a signed-in user is given, the Firestore
 * `users/{userId}/notes` subcollection.
 * @param {string|null} userId - User ID, or null/undefined for guest-only
 * @param {object|null} db - Firestore database instance, or null for guest-only
 */
export async function clearMigratedNotes(userId, db) {
  await localforage.removeItem(STORAGE_KEYS.NOTES);

  if (!userId || !db) return;

  try {
    const notesRef = collection(db, 'users', userId, 'notes');
    const snapshot = await getDocs(notesRef);
    if (snapshot.empty) return;

    const batch = writeBatch(db);
    snapshot.forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();
  } catch (_error) {
    // Non-fatal: notes were already migrated into tasks, so a failed cleanup
    // just leaves stale (now-invisible) documents behind for a later retry.
  }
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

        if (task.dueDate) {
          taskData.dueDate = task.dueDate;
        }

        if (task.category) {
          taskData.category = task.category;
        }

        if (task.notes) {
          taskData.notes = task.notes;
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
 * Import data from JSON file.
 *
 * Older backups may still contain a top-level `notes` array from the removed
 * standalone notes-overview feature; those are intentionally ignored since
 * there's no longer a place to put them (existing installations already had
 * their notes migrated into Q4 tasks, see notes-migration.js).
 * @param {File} file - File to import
 * @param {object} currentTasks - Current tasks object
 * @param {function} saveCallback - Callback to save imported tasks, called with (finalTasks)
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
    } catch (_error) {
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
    } catch (_error) {
      return false;
    }
  }
  return false;
}
