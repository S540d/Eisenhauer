/**
 * Main Application Orchestrator
 * Eisenhauer Matrix - Modular Version
 *
 * This file coordinates all modules and handles the main application flow
 */

// Import all modules
import { SEGMENTS, STORAGE_KEYS, MAX_TASK_LENGTH } from './js/modules/config.js';
import { APP_VERSION, initVersion } from './js/modules/version.js';
import {
    translations,
    currentLanguage,
    setLanguage,
    getTranslation,
    updateLanguageUI
} from './js/modules/translations.js';
import {
    tasks,
    addTaskToSegment,
    deleteTask,
    moveTask,
    toggleTask,
    getTasks,
    setAllTasks
} from './js/modules/tasks.js';
import {
    initStorage,
    saveGuestTasks,
    loadGuestTasks,
    loadUserTasks,
    saveTaskToFirestore,
    updateTaskInFirestore,
    deleteTaskFromFirestore,
    exportData,
    importData,
    requestPersistentStorage,
    getSyncStatus
} from './js/modules/storage.js';
import {
    renderAllTasks,
    openModal,
    closeModal,
    openQuickAddModal,
    openSettingsModal,
    openMetricsModal,
    showDragHint,
    updateOnlineStatus,
    updateSyncStatus,
    setupDropZones
} from './js/modules/ui.js';
// Old drag-drop.js is now deprecated - using DragManager instead
// import {
//     setupDragAndDrop,
//     setupTouchDrag,
//     setupSwipeToDelete,
//     handleDragStart,
//     handleDragEnd
// } from './js/modules/drag-drop.js';

// ============================================
// Global State
// ============================================
let currentUser = null;
let db = null;
let isGuestMode = false;

// ============================================
// Core Functions
// ============================================

/**
 * Save all tasks (Guest or Firebase)
 * Note: For Firebase users, this function is not typically called since
 * individual task operations (add/update/delete) save directly to Firestore.
 * This function is mainly used for bulk operations like import.
 */
async function saveAllTasks() {
    if (currentUser && db && !isGuestMode) {
        // For logged-in users, save each task individually to Firestore
        const { saveTaskToFirestore } = await import('./js/modules/storage.js');
        for (const segmentId in tasks) {
            for (const task of tasks[segmentId]) {
                await saveTaskToFirestore(task, currentUser.uid, db, window.firebase);
            }
        }
    } else {
        await saveGuestTasks(tasks);
    }
}

/**
 * Load all tasks (Guest or Firebase)
 */
async function loadAllTasks() {
    if (currentUser && db && !isGuestMode) {
        const loadedTasks = await loadUserTasks(currentUser.uid, db);
        setAllTasks(loadedTasks);
    } else {
        const loadedTasks = await loadGuestTasks();
        setAllTasks(loadedTasks);
    }
}

/**
 * Add task handler
 */
function handleAddTask(taskText, segment, recurringConfig = null) {
    if (!taskText || taskText.trim() === '') return;

    const task = addTaskToSegment(taskText, segment, recurringConfig);

    // Save to storage based on mode
    if (currentUser && db && !isGuestMode) {
        // Save to Firestore
        saveTaskToFirestore(task, currentUser.uid, db, window.firebase);
    } else {
        // Save to LocalForage (guest mode)
        saveGuestTasks(tasks);
    }

    renderTasksWithCallbacks();
}

/**
 * Delete task handler
 */
function handleDeleteTask(taskId, segment) {
    deleteTask(taskId, segment);

    // Delete from storage based on mode
    if (currentUser && db && !isGuestMode) {
        // Delete from Firestore
        deleteTaskFromFirestore(taskId, currentUser.uid, db);
    } else {
        // Save to LocalForage (guest mode)
        saveGuestTasks(tasks);
    }

    renderTasksWithCallbacks();
}

/**
 * Move task handler
 */
function handleMoveTask(taskId, fromSegment, toSegment) {
    console.log('🔄 handleMoveTask called:', { taskId, fromSegment, toSegment });

    const movedTask = moveTask(taskId, fromSegment, toSegment);
    console.log('✅ Task moved in data model:', movedTask);

    // Force SYNCHRONOUS re-render with a small delay to ensure DOM is updated
    // This ensures the browser completes the drag operation first
    setTimeout(() => {
        renderTasksWithCallbacks();
        console.log('🎨 Tasks re-rendered');
    }, 0);

    // Save to storage based on mode (async, happens after render)
    if (currentUser && db && !isGuestMode && movedTask) {
        // Update in Firestore
        updateTaskInFirestore(movedTask, currentUser.uid, db, window.firebase);
    } else {
        // Save to LocalForage (guest mode)
        saveGuestTasks(tasks);
    }
}

/**
 * Toggle task handler
 */
function handleToggleTask(taskId, segment) {
    const result = toggleTask(taskId, segment);

    // Save to storage based on mode
    if (currentUser && db && !isGuestMode && result) {
        // Update the completed/restored task in Firestore
        updateTaskInFirestore(result.task, currentUser.uid, db, window.firebase);

        // If a new recurring task was created, save it too
        if (result.newRecurringTask) {
            saveTaskToFirestore(result.newRecurringTask, currentUser.uid, db, window.firebase);
        }
    } else {
        // Save to LocalForage (guest mode)
        saveGuestTasks(tasks);
    }

    renderTasksWithCallbacks();
}

/**
 * Render all tasks with all callbacks (Drag & Drop 2.0)
 */
function renderTasksWithCallbacks() {
    const callbacks = {
        onToggle: handleToggleTask,
        // DragManager handles these internally now
        onDragEnd: handleMoveTask,
        onSwipeDelete: handleDeleteTask
    };

    renderAllTasks(tasks, translations, currentLanguage, callbacks);

    // Setup drop zones for desktop drag & drop
    setupDropZones(handleMoveTask);
}

// ============================================
// Event Handlers
// ============================================

// Track if event listeners are already set up
let eventListenersSetup = false;

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Prevent duplicate event listeners
    if (eventListenersSetup) {
        console.log('Event listeners already setup, skipping...');
        return;
    }

    console.log('Setting up event listeners...');

    // Task input (if exists - v1.4.5 uses modal instead)
    const taskInput = document.getElementById('taskInput');
    if (taskInput) {
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && taskInput.value.trim()) {
                openModal((text, segment, recurring) => {
                    handleAddTask(text, segment, recurring);
                    closeModal();
                    taskInput.value = '';
                });
            }
        });

        // Enforce max length
        taskInput.maxLength = MAX_TASK_LENGTH;
    }

    // Segment add buttons (+) - Open Quick Add Modal
    const addButtons = document.querySelectorAll('.segment-add-btn');
    console.log('Found', addButtons.length, 'add buttons');
    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const segment = parseInt(e.target.dataset.segment);
            console.log('Add button clicked, segment:', segment);
            openQuickAddModal(segment, (text, selectedSegment, recurring) => {
                handleAddTask(text, selectedSegment || segment, recurring);
            }, translations, currentLanguage);
        });
    });

    // Settings button (footer)
    const settingsBtn = document.getElementById('settingsBtnFooter');
    console.log('Settings button (footer) found:', !!settingsBtn);
    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            console.log('Settings button (footer) clicked', e);
            e.preventDefault();
            e.stopPropagation();
            openSettingsModal(currentUser, APP_VERSION, new Date().toISOString().split('T')[0], isGuestMode);
        });
    }

    // Modal cancel
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Settings modal close
    const settingsCancelBtn = document.getElementById('settingsCancelBtn');
    if (settingsCancelBtn) {
        settingsCancelBtn.addEventListener('click', () => {
            document.getElementById('settingsModal').style.display = 'none';
        });
    }

    // Language toggle
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.value = currentLanguage;
        languageToggle.addEventListener('change', (e) => {
            setLanguage(e.target.value);
            updateLanguageUI(() => renderTasksWithCallbacks());
        });
    }

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        const isDark = localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
        darkModeToggle.checked = isDark;
        if (isDark) document.body.classList.add('dark-mode');

        darkModeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem(STORAGE_KEYS.DARK_MODE, 'true');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem(STORAGE_KEYS.DARK_MODE, 'false');
            }
        });
    }

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportData(tasks, APP_VERSION);
        });
    }

    // Import button
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    if (importBtn && importFile) {
        importBtn.addEventListener('click', () => importFile.click());
        importFile.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                importData(e.target.files[0], tasks, async (importedTasks) => {
                    setAllTasks(importedTasks);
                    await saveAllTasks();
                    renderTasksWithCallbacks();
                    alert(getTranslation('importSuccess') || 'Data imported successfully!');
                });
            }
        });
    }

    // Metrics button
    const metricsBtn = document.getElementById('metricsBtn');
    if (metricsBtn) {
        metricsBtn.addEventListener('click', () => {
            openMetricsModal(() => {
                // Calculate metrics
                // This is a placeholder - real implementation in metrics module
                return {
                    totalCompleted: getTasks(SEGMENTS.DONE).length,
                    currentStreak: 0,
                    avgTime: '-',
                    chartData: []
                };
            });
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            console.log('Logout button clicked');
            if (typeof window.signOut === 'function') {
                console.log('Calling window.signOut()');
                await window.signOut();
            } else {
                console.error('window.signOut is not available!');
            }
        });
    }

    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Drag hint close
    const closeDragHint = document.getElementById('closeDragHint');
    if (closeDragHint) {
        closeDragHint.addEventListener('click', () => {
            document.getElementById('dragHint').style.display = 'none';
            localStorage.setItem(STORAGE_KEYS.DRAG_HINT_SEEN, 'true');
        });
    }

    eventListenersSetup = true;
    console.log('✅ Event listeners setup complete');
}

/**
 * Setup drag and drop functionality
 * DEPRECATED: Now handled by DragManager in ui.js
 */
// function setupDragAndDropHandlers() {
//     setupDragAndDrop((taskId, fromSegment, toSegment) => {
//         handleMoveTask(taskId, fromSegment, toSegment);
//     });
// }

// ============================================
// Authentication Integration
// ============================================

/**
 * Handle user authentication state changes
 * This is called from auth.js
 */
window.onAuthStateChanged = async function(user, firebaseDb, guestMode = false) {
    currentUser = user;
    db = firebaseDb;
    isGuestMode = guestMode;

    console.log('onAuthStateChanged called:', user ? user.email : 'guest mode', 'isGuestMode:', isGuestMode);

    if (user && !isGuestMode) {
        console.log('User logged in:', user.email);
        await loadAllTasks();
    } else {
        console.log('Guest mode - loading from localForage');
        await loadAllTasks();
    }

    // Wait for DOM to be fully visible after showApp()
    setTimeout(() => {
        // Setup event listeners (after showApp() has been called by auth.js)
        setupEventListeners();

        // Render tasks with callbacks (after DOM is ready)
        // DragManager and drop zones are now setup in renderTasksWithCallbacks()
        renderTasksWithCallbacks();
    }, 100);

    updateOnlineStatus();

    // Show drag hint if not seen
    const hintSeen = localStorage.getItem(STORAGE_KEYS.DRAG_HINT_SEEN);
    if (!hintSeen) {
        showDragHint();
    }
};

// ============================================
// Application Initialization
// ============================================

/**
 * Initialize the application
 */
async function initApp() {
    console.log('🚀 Initializing Eisenhauer Matrix (Modular)...');

    // Load version
    await initVersion();

    // Initialize storage with offline queue support (Phase 4)
    initStorage(updateSyncStatus);
    console.log('✅ Storage initialized with offline queue');

    // Setup persistent storage
    await requestPersistentStorage();

    // Check online status
    window.addEventListener('online', () => {
        updateOnlineStatus();
        updateSyncStatus(getSyncStatus());
    });
    window.addEventListener('offline', () => {
        updateOnlineStatus();
        updateSyncStatus(getSyncStatus());
    });

    // Note: Event listeners and tasks are loaded in onAuthStateChanged callback
    // which is triggered by auth.js after showApp() is called

    console.log('✅ App initialized successfully');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export for global access (if needed by auth.js or other non-module scripts)
window.appInitialized = true;
