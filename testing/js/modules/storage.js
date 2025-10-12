/**
 * Storage Module
 * Handles data persistence (Firebase Firestore, LocalForage, Import/Export)
 */

// Note: This module expects auth.js to provide:
// - currentUser, isGuestMode
// - db (Firestore), firebase
// - localforage

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
 * Save a single task to Firestore
 * @param {object} task - Task object
 * @param {string} userId - User ID
 * @param {object} db - Firestore database instance
 * @param {object} firebase - Firebase instance
 */
export async function saveTaskToFirestore(task, userId, db, firebase) {
    if (!userId || !db) return;

    try {
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

        await db.collection('users')
            .doc(userId)
            .collection('tasks')
            .doc(task.id.toString())
            .set(taskData);

        console.log('Task saved to Firestore:', task.id);
    } catch (error) {
        console.error('Error saving task to Firestore:', error);
    }
}

/**
 * Update a task in Firestore
 * @param {object} task - Task object
 * @param {string} userId - User ID
 * @param {object} db - Firestore database instance
 * @param {object} firebase - Firebase instance
 */
export async function updateTaskInFirestore(task, userId, db, firebase) {
    if (!userId || !db) return;

    try {
        const updateData = {
            text: task.text,
            segment: task.segment,
            checked: task.checked || false
        };

        if (task.completedAt) {
            updateData.completedAt = task.completedAt;
        } else {
            updateData.completedAt = firebase.firestore.FieldValue.delete();
        }

        if (task.recurring) {
            updateData.recurring = task.recurring;
        }

        await db.collection('users')
            .doc(userId)
            .collection('tasks')
            .doc(task.id.toString())
            .update(updateData);

        console.log('Task updated in Firestore:', task.id);
    } catch (error) {
        console.error('Error updating task in Firestore:', error);
    }
}

/**
 * Delete a task from Firestore
 * @param {number} taskId - Task ID
 * @param {string} userId - User ID
 * @param {object} db - Firestore database instance
 */
export async function deleteTaskFromFirestore(taskId, userId, db) {
    if (!userId || !db) return;

    try {
        await db.collection('users')
            .doc(userId)
            .collection('tasks')
            .doc(taskId.toString())
            .delete();

        console.log('Task deleted from Firestore:', taskId);
    } catch (error) {
        console.error('Error deleting task from Firestore:', error);
    }
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
