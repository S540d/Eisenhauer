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
    saveTasks,
    saveGuestTasks,
    loadGuestTasks,
    loadUserTasks,
    exportData,
    importData,
    requestPersistentStorage
} from './js/modules/storage.js';
import {
    renderAllTasks,
    openModal,
    closeModal,
    openQuickAddModal,
    openSettingsModal,
    openMetricsModal,
    showDragHint,
    updateOnlineStatus
} from './js/modules/ui.js';
import {
    setupDragAndDrop,
    setupTouchDrag,
    setupSwipeToDelete,
    handleDragStart,
    handleDragEnd
} from './js/modules/drag-drop.js';

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
 */
async function saveAllTasks() {
    if (currentUser && db && !isGuestMode) {
        await saveTasks(tasks, currentUser.uid, db, firebase);
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

    addTaskToSegment(taskText, segment, recurringConfig, async () => {
        await saveAllTasks();
        renderTasksWithCallbacks();
    });

    renderTasksWithCallbacks();
}

/**
 * Delete task handler
 */
function handleDeleteTask(taskId, segment) {
    deleteTask(taskId, segment, async () => {
        await saveAllTasks();
        renderTasksWithCallbacks();
    });
}

/**
 * Move task handler
 */
function handleMoveTask(taskId, fromSegment, toSegment) {
    moveTask(taskId, fromSegment, toSegment, async () => {
        await saveAllTasks();
        renderTasksWithCallbacks();
    });
}

/**
 * Toggle task handler
 */
function handleToggleTask(taskId, segment) {
    toggleTask(taskId, segment, async () => {
        await saveAllTasks();
        renderTasksWithCallbacks();
    });
}

/**
 * Render all tasks with all callbacks
 */
function renderTasksWithCallbacks() {
    const callbacks = {
        onToggle: handleToggleTask,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        onSetupTouchDrag: (element, task) => {
            setupTouchDrag(element, task, handleMoveTask, handleDeleteTask);
        },
        onSetupSwipeDelete: (element, task) => {
            setupSwipeToDelete(element, task, handleDeleteTask);
        }
    };

    renderAllTasks(tasks, translations, currentLanguage, callbacks);
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
            openSettingsModal(currentUser, APP_VERSION, new Date().toISOString().split('T')[0]);
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
 */
function setupDragAndDropHandlers() {
    setupDragAndDrop((taskId, fromSegment, toSegment) => {
        handleMoveTask(taskId, fromSegment, toSegment);
    });
}

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

    // Wait for DOM to be fully visible after showApp()
    setTimeout(() => {
        // Setup event listeners (after showApp() has been called by auth.js)
        setupEventListeners();

        // Setup drag and drop
        setupDragAndDropHandlers();
    }, 100);

    if (user && !isGuestMode) {
        console.log('User logged in:', user.email);
        await loadAllTasks();
    } else {
        console.log('Guest mode - loading from localForage');
        await loadAllTasks();
    }

    renderTasksWithCallbacks();
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

    // Setup persistent storage
    await requestPersistentStorage();

    // Check online status
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

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
