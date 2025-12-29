/**
 * Main Application Orchestrator
 * Eisenhauer Matrix - Modular Version
 * Firebase v9 Modular SDK Integration
 *
 * This file coordinates all modules and handles the main application flow
 */

// Import environment config
import { isStaging } from './config.js';

// Import npm packages for local storage and charting
import localforage from 'localforage';
import Chart from 'chart.js/auto';

// Make libraries globally available for legacy code
window.localforage = localforage;
window.Chart = Chart;

// Import Firebase services (Modular SDK V2)
import { auth, db } from './js/modules/firebase-init.js';
import { initAuth } from './js/modules/auth.js';

// Initialize authentication IMMEDIATELY (not in DOMContentLoaded)
// ES6 modules are non-blocking, but we need to establish the auth listener ASAP
// to handle login state before UI rendering
initAuth();

// Import all modules
import { SEGMENTS, STORAGE_KEYS, MAX_TASK_LENGTH } from './js/modules/config.js';
import { APP_VERSION, initVersion } from './js/modules/version.js';
import {
  translations,
  currentLanguage,
  setLanguage,
  getTranslation,
  updateLanguageUI,
} from './js/modules/translations.js';
import {
  tasks,
  addTaskToSegment,
  deleteTask,
  moveTask,
  toggleTask,
  getTasks,
  setAllTasks,
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
  getSyncStatus,
} from './js/modules/storage.js';
import {
  renderAllTasks,
  openModal,
  closeModal,
  openQuickAddModal,
  openSettingsModal,
  openMetricsModal,
  openEditRecurringModal,
  showDragHint,
  updateOnlineStatus,
  updateSyncStatus,
  setupDropZones,
} from './js/modules/ui.js';
import { showWarning } from './js/modules/notifications.js';
import {
  KeyboardDragManager,
  announceDragStart,
  announceDragEnd,
} from './js/modules/accessibility.js';
// Old drag-drop.js is now deprecated - using DragManager instead
// import {
// setupDragAndDrop,
// setupTouchDrag,
// setupSwipeToDelete,
// handleDragStart,
// handleDragEnd
// } from './js/modules/drag-drop.js';

// ============================================
// Global State
// ============================================
let currentUser = null;
// Note: db is imported from firebase-init.js, not declared here
let isGuestMode = false;
let keyboardDragManager = null;

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
 * Delete task handler with confirmation for recurring tasks
 */
function handleDeleteTask(taskId, segment) {
  // Find the task to check if it's recurring
  const task = tasks[segment].find((t) => t.id === taskId);
  if (!task) return;

  // If it's a recurring task, show options for deletion scope
  if (task.recurring && task.recurring.enabled) {
    showWarning('Wiederholende Aufgabe löschen', {
      duration: 0, // Don't auto-dismiss
      actions: [
        {
          label: 'Nur diese',
          onClick: () => {
            // Delete only this instance
            deleteTask(taskId, segment);
            syncDelete(taskId, segment);
            renderTasksWithCallbacks();
          },
        },
        {
          label: 'Alle zukünftigen',
          onClick: () => {
            // Delete this and all future instances of the same recurring task
            deleteAllRecurringInstances(task.text, task.segment, task.recurring);
            syncDelete(taskId, segment);
            renderTasksWithCallbacks();
          },
        },
      ],
    });
  } else {
    // Non-recurring task - delete immediately
    deleteTask(taskId, segment);
    syncDelete(taskId, segment);
    renderTasksWithCallbacks();
  }
}

/**
 * Helper function to delete all recurring task instances
 */
function deleteAllRecurringInstances(taskText, segmentId, recurringConfig) {
  // Find and delete all instances of this recurring task in the segment
  tasks[segmentId] = tasks[segmentId].filter(
    (t) =>
      !(
        t.text === taskText &&
        t.recurring &&
        JSON.stringify(t.recurring) === JSON.stringify(recurringConfig)
      )
  );
}

/**
 * Helper function to sync task deletion to storage
 */
function syncDelete(taskId, segment) {
  if (currentUser && db && !isGuestMode) {
    // Delete from Firestore
    deleteTaskFromFirestore(taskId, currentUser.uid, db);
  } else {
    // Save to LocalForage (guest mode)
    saveGuestTasks(tasks);
  }
}

/**
 * Move task handler
 */
function handleMoveTask(taskId, fromSegment, toSegment) {
  const movedTask = moveTask(taskId, fromSegment, toSegment);
  // Force SYNCHRONOUS re-render with a small delay to ensure DOM is updated
  // This ensures the browser completes the drag operation first
  setTimeout(() => {
    renderTasksWithCallbacks();
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
 * Handle edit recurring task settings
 * @param {object} task - Task to edit
 */
function handleEditRecurring(task) {
  openEditRecurringModal(
    task,
    (taskId, newRecurringConfig) => {
      // Find the task
      for (const segment in tasks) {
        const taskIndex = tasks[segment].findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          if (newRecurringConfig === 'DELETE') {
            // Delete task permanently
            const deletedTask = tasks[segment][taskIndex];
            deleteTask(taskId, segment, async (task) => {
              // Delete from Firestore if logged in
              if (currentUser && db && !isGuestMode) {
                await deleteTaskFromFirestore(task, currentUser.uid, db, window.firebase);
              } else {
                await saveGuestTasks(tasks);
              }
            });
          } else if (newRecurringConfig === null) {
            // Remove recurring
            delete tasks[segment][taskIndex].recurring;

            // Save to storage
            const updatedTask = tasks[segment][taskIndex];
            if (currentUser && db && !isGuestMode) {
              updateTaskInFirestore(updatedTask, currentUser.uid, db, window.firebase);
            } else {
              saveGuestTasks(tasks);
            }
          } else {
            // Update recurring
            tasks[segment][taskIndex].recurring = newRecurringConfig;

            // Save to storage
            const updatedTask = tasks[segment][taskIndex];
            if (currentUser && db && !isGuestMode) {
              updateTaskInFirestore(updatedTask, currentUser.uid, db, window.firebase);
            } else {
              saveGuestTasks(tasks);
            }
          }

          // Re-render
          renderTasksWithCallbacks();
          break;
        }
      }
    },
    translations,
    currentLanguage
  );
}

/**
 * Render all tasks with all callbacks (Drag & Drop 2.0)
 */
function renderTasksWithCallbacks() {
  const callbacks = {
    onToggle: handleToggleTask,
    // DragManager handles these internally now
    onDragEnd: handleMoveTask,
    onSwipeDelete: handleDeleteTask,
    onEditRecurring: handleEditRecurring,
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
    return;
  }
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
  addButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const segment = parseInt(e.target.dataset.segment);
      openQuickAddModal(
        segment,
        (text, selectedSegment, recurring) => {
          handleAddTask(text, selectedSegment || segment, recurring);
        },
        translations,
        currentLanguage
      );
    });
  });

  // Settings button (header)
  const settingsBtn = document.getElementById('settingsBtnHeader');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSettingsModal(
        currentUser,
        APP_VERSION,
        new Date().toISOString().split('T')[0],
        isGuestMode
      );
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

  // Theme toggle buttons in settings modal
  const themeButtons = document.querySelectorAll('.theme-btn');
  const currentTheme = localStorage.getItem(STORAGE_KEYS.DARK_MODE);

  // Set initial active button
  themeButtons.forEach((btn) => {
    const theme = btn.dataset.theme;
    if (
      (theme === 'dark' && currentTheme === 'true') ||
      (theme === 'system' && currentTheme === null)
    ) {
      btn.classList.add('active');
    }
  });

  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;

      // Update active state
      themeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Update theme
      if (theme === 'dark') {
        localStorage.setItem(STORAGE_KEYS.DARK_MODE, 'true');
        document.body.classList.add('dark-mode');
      } else if (theme === 'system') {
        localStorage.removeItem(STORAGE_KEYS.DARK_MODE);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      }
    });
  });

  // Language toggle buttons in settings modal
  const langButtons = document.querySelectorAll('.lang-btn');
  const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';

  // Set initial active button
  langButtons.forEach((btn) => {
    if (btn.dataset.lang === savedLanguage) {
      btn.classList.add('active');
    }
  });

  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;

      // Update active state
      langButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Update language
      setLanguage(lang);
      updateLanguageUI(() => renderTasksWithCallbacks());
    });
  });

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

  // Export JSON button in settings modal
  const exportJsonBtn = document.getElementById('exportJsonBtn');
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
      exportData(tasks, APP_VERSION);
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
          chartData: [],
        };
      });
    });
  }

  // Recurring task toggle (Fix for Issue #76)
  const recurringEnabled = document.getElementById('recurringEnabled');
  const recurringOptions = document.getElementById('recurringOptions');
  if (recurringEnabled && recurringOptions) {
    recurringEnabled.addEventListener('change', (e) => {
      recurringOptions.style.display = e.target.checked ? 'block' : 'none';
    });
  }

  // Recurring interval selector (Fix for Issue #76)
  const recurringInterval = document.getElementById('recurringInterval');
  const weeklyOptions = document.getElementById('weeklyOptions');
  const monthlyOptions = document.getElementById('monthlyOptions');
  const customOptions = document.getElementById('customOptions');
  if (recurringInterval) {
    recurringInterval.addEventListener('change', (e) => {
      // Hide all interval-specific options
      if (weeklyOptions) weeklyOptions.style.display = 'none';
      if (monthlyOptions) monthlyOptions.style.display = 'none';
      if (customOptions) customOptions.style.display = 'none';

      // Show relevant option based on selected interval
      switch (e.target.value) {
        case 'weekly':
          if (weeklyOptions) weeklyOptions.style.display = 'block';
          break;
        case 'monthly':
          if (monthlyOptions) monthlyOptions.style.display = 'block';
          break;
        case 'custom':
          if (customOptions) customOptions.style.display = 'block';
          break;
      }
    });
  }

  // Quick add recurring toggle (Fix for Issue #76)
  const quickRecurringEnabled = document.getElementById('quickRecurringEnabled');
  const quickRecurringOptions = document.getElementById('quickRecurringOptions');
  if (quickRecurringEnabled && quickRecurringOptions) {
    quickRecurringEnabled.addEventListener('change', () => {
      quickRecurringOptions.style.display = quickRecurringEnabled.checked ? 'block' : 'none';
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (typeof window.signOut === 'function') {
        await window.signOut();
      } else {
      }
    });
  }

  // Close modals on outside click
  document.querySelectorAll('.modal').forEach((modal) => {
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
}

/**
 * Setup drag and drop functionality
 * DEPRECATED: Now handled by DragManager in ui.js
 */
// function setupDragAndDropHandlers() {
// setupDragAndDrop((taskId, fromSegment, toSegment) => {
// handleMoveTask(taskId, fromSegment, toSegment);
// });
// }

// ============================================
// Authentication Integration
// ============================================

/**
 * Handle user authentication state changes
 * This is called from auth.js with (user, isGuestMode)
 */
window.onAuthStateChanged = async function (user, isGuestMode = false) {
  currentUser = user;
  isGuestMode = isGuestMode;
  if (user && !isGuestMode) {
    await loadAllTasks();
  } else {
    await loadAllTasks();
  }

  // Wait for DOM to be fully visible after showApp()
  setTimeout(() => {
    // Setup event listeners (after showApp() has been called by auth.js)
    setupEventListeners();

    // Initialize keyboard drag manager for accessibility
    if (!keyboardDragManager) {
      keyboardDragManager = new KeyboardDragManager(handleMoveTask);
    }

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
  // Initialize theme from localStorage (before anything visual loads)
  const savedTheme = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
  if (savedTheme === 'true') {
    // User explicitly chose dark mode
    document.body.classList.add('dark-mode');
  } else if (savedTheme === null) {
    // No preference saved - use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.body.classList.add('dark-mode');
    }
  }
  // If savedTheme === 'false', stay in light mode (do nothing)

  // Initialize staging banner
  if (isStaging()) {
    const stagingBanner = document.getElementById('stagingBanner');
    if (stagingBanner) {
      stagingBanner.style.display = 'block';
    }
  }

  // Initialize language from localStorage
  const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
  if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'de')) {
    setLanguage(savedLanguage);
  }

  // Load version
  await initVersion();

  // Initialize storage with offline queue support (Phase 4)
  initStorage(updateSyncStatus);
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
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for global access (if needed by auth.js or other non-module scripts)
window.appInitialized = true;
