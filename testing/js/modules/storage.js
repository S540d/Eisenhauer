/**
 * Storage Module (Phase 4: Offline-Support Enhanced)
 * Handles data persistence (Firebase Firestore, LocalForage, Import/Export)
 * Integrated with OfflineQueue for robust offline operations
 */

import { OfflineQueue } from './offline-queue.js';
import { ErrorHandler, NetworkError } from './error-handler.js';
import { showError, showSuccess, showInfo, showWarning } from './notifications.js';

// Note: This module expects auth.js to provide:
// - currentUser, isGuestMode
// - db (Firestore), firebase
// - localforage

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
        console.log('[Storage] Queue item processed:', item.id);
        updateSyncStatusUI();
    });

    offlineQueue.on('itemFailed', (item, error) => {
        console.error('[Storage] Queue item failed:', item.id, error);
        showError(`Sync failed: ${item.operation}`, {
            duration: 5000,
            actions: [{
                label: 'Retry',
                onClick: () => offlineQueue.processQueue()
            }]
        });
        updateSyncStatusUI();
    });

    offlineQueue.on('queueEmpty', () => {
        console.log('[Storage] Sync queue empty');
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
    console.log('[Storage] Network online - processing queue');
    showInfo('Back online - syncing changes...', 3000);
    updateSyncStatusUI();
    await offlineQueue.processQueue();
}

/**
 * Handle offline event
 */
function handleOffline() {
    console.log('[Storage] Network offline');
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
        isOnline: navigator.onLine
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
        console.log('Guest tasks saved to IndexedDB');
    } catch (error) {
        console.error('Error saving guest tasks:', error);
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
                console.log('Migrated tasks from localStorage to IndexedDB');
            }
        }

        if (tasksData) {
            console.log('Guest tasks loaded from IndexedDB');
            return tasksData;
        }

        // Return empty tasks structure if no data
        return { 1: [], 2: [], 3: [], 4: [], 5: [] };
    } catch (error) {
        console.error('Error loading guest tasks:', error);
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
        const snapshot = await db.collection('users')
            .doc(userId)
            .collection('tasks')
            .get();

        // Initialize empty tasks structure
        const tasks = { 1: [], 2: [], 3: [], 4: [], 5: [] };

        // Load tasks from Firestore
        snapshot.forEach(doc => {
            const task = doc.data();
            task.id = doc.id; // Use Firestore document ID

            // Ensure segment exists
            if (tasks[task.segment]) {
                tasks[task.segment].push(task);
            }
        });

        console.log('User tasks loaded from Firestore');
        return tasks;
    } catch (error) {
        console.error('Error loading user tasks:', error);
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

    const taskData = {
        text: task.text,
        segment: task.segment,
        checked: task.checked || false,
        // Preserve existing createdAt if it exists (for moved tasks), otherwise use server timestamp
        createdAt: task.createdAt || firebase.firestore.FieldValue.serverTimestamp()
    };

    // Add optional fields
    if (task.completedAt) {
        taskData.completedAt = task.completedAt;
    }

    if (task.recurring) {
        taskData.recurring = task.recurring;
    }

    // Add to offline queue with retry logic
    await offlineQueue.add(
        'saveTask',
        async () => {
            await db.collection('users')
                .doc(userId)
                .collection('tasks')
                .doc(task.id.toString())
                .set(taskData);
            console.log('[Storage] Task saved to Firestore:', task.id);
        },
        {
            taskId: task.id,
            userId,
            taskData
        },
        3 // maxRetries
    );
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
        createdAt: task.createdAt || firebase.firestore.FieldValue.serverTimestamp()
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
            // Use set with merge:true to handle both new and existing tasks
            await db.collection('users')
                .doc(userId)
                .collection('tasks')
                .doc(task.id.toString())
                .set(updateData, { merge: true });
            console.log('[Storage] Task updated in Firestore:', task.id);
        },
        {
            taskId: task.id,
            userId,
            updateData
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
            await db.collection('users')
                .doc(userId)
                .collection('tasks')
                .doc(taskId.toString())
                .delete();
            console.log('[Storage] Task deleted from Firestore:', taskId);
        },
        {
            taskId,
            userId
        },
        3 // maxRetries
    );
}

/**
 * Migrate local data to Firestore (one-time on first login)
 * @param {string} userId - User ID
 * @param {object} db - Firestore database instance
 * @param {object} firebase - Firebase instance
 */
export async function migrateLocalData(userId, db, firebase) {
    try {
        // Try to get data from IndexedDB (new method)
        let tasksData = await localforage.getItem('eisenhauerTasks');

        // Fallback to old localStorage for migration
        if (!tasksData) {
            const localTasks = localStorage.getItem('eisenhauerTasks');
            if (localTasks) {
                tasksData = JSON.parse(localTasks);
            }
        }

        if (!tasksData) {
            console.log('No local data to migrate');
            return;
        }

        const batch = db.batch();
        let taskCount = 0;

        Object.keys(tasksData).forEach(segmentId => {
            tasksData[segmentId].forEach(task => {
                const docRef = db.collection('users')
                    .doc(userId)
                    .collection('tasks')
                    .doc(task.id.toString());

                const taskData = {
                    text: task.text,
                    segment: task.segment,
                    checked: task.checked || false,
                    // Preserve existing createdAt if it exists (for moved tasks), otherwise use server timestamp
                    createdAt: task.createdAt || firebase.firestore.FieldValue.serverTimestamp()
                };

                if (task.completedAt) {
                    taskData.completedAt = task.completedAt;
                }

                if (task.recurring) {
                    taskData.recurring = task.recurring;
                }

                batch.set(docRef, taskData);
                taskCount++;
            });
        });

        await batch.commit();
        console.log(`Local data migrated to Firestore (${taskCount} tasks)`);

        // Clear both storage methods after migration
        await localforage.removeItem('eisenhauerTasks');
        localStorage.removeItem('eisenhauerTasks');
    } catch (error) {
        console.error('Error migrating local data:', error);
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
        tasks: tasks
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eisenhauer-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('Data exported successfully');
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

                if (confirm('Möchtest du die importierten Daten mit den aktuellen Daten zusammenführen? (Abbrechen = Aktuelle Daten ersetzen)')) {
                    // Merge: Add imported tasks to existing ones
                    finalTasks = { ...currentTasks };

                    Object.keys(importedData.tasks).forEach(segmentId => {
                        if (!finalTasks[segmentId]) {
                            finalTasks[segmentId] = [];
                        }

                        importedData.tasks[segmentId].forEach(task => {
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

                console.log('Data imported successfully');
                resolve(finalTasks);
            } catch (error) {
                console.error('Import Error:', error);
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
            console.log(`Persistent storage: ${isPersisted ? 'granted' : 'denied'}`);
            return isPersisted;
        } catch (error) {
            console.error('Error requesting persistent storage:', error);
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
            console.error('Error checking persistent storage:', error);
            return false;
        }
    }
    return false;
}
