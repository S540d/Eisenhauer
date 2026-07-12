/**
 * Main Application Orchestrator
 * Eisenhauer Matrix - Modular Version
 * Firebase v9 Modular SDK Integration
 *
 * This file coordinates all modules and handles the main application flow
 */

// Import environment config
import { isStaging, isTesting } from './js/modules/env-config.js';
import { initSentry } from './js/modules/sentry.js';

// Import npm packages for local storage and charting
import localforage from 'localforage';
import Chart from 'chart.js/auto';

// Make libraries globally available for legacy code
window.localforage = localforage;
window.Chart = Chart;

// Import Firebase services (Modular SDK V2)
import { auth, db, storage } from './js/modules/firebase-init.js';
import {
  initAuth,
  signInWithGoogle,
  signInWithApple,
  continueAsGuest,
  signOut,
  showLogin,
  showApp,
} from './js/modules/auth.js';

// Import all modules
import { SEGMENTS, STORAGE_KEYS, MAX_TASK_LENGTH, SMART_RULES } from './js/modules/config.js';
import { APP_VERSION, initVersion } from './js/modules/version.js';
import {
  translations,
  getCurrentLanguage,
  setLanguage,
  getTranslation,
  updateLanguageUI,
  detectBrowserLanguage,
  initLoginTranslations,
} from './js/modules/translations.js';
import {
  tasks,
  addTaskToSegment,
  deleteTask,
  moveTask,
  toggleTask,
  getTasks,
  getAllTasks,
  setAllTasks,
  reorderTask,
  applySmartRules,
  filterByCategory,
  sameTaskId,
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
  importGuestTasksToFirestore,
} from './js/modules/storage.js';
import {
  renderAllTasks,
  closeModal,
  openQuickAddModal,
  openSettingsModal,
  openMetricsModal,
  openEditRecurringModal,
  openTutorialModal,
  shouldShowTutorial,
  showDragHint,
  updateOnlineStatus,
  updateSyncStatus,
  setupDropZones,
} from './js/modules/ui.js';
import { exportCsv, exportMarkdown } from './js/modules/export.js';
import { suggestSegment, SEGMENT_SUGGEST_LABELS } from './js/modules/smart-suggest.js';
import { showWarning, showError, showSuccess } from './js/modules/notifications.js';
import { showUndoDelete, showUndoToggle } from './js/modules/undo.js';
import {
  isSupported as remindersSupported,
  requestPermission as requestReminderPermission,
  getPermission,
  loadReminderSettings,
  saveReminderSettings,
  scheduleReminders,
  cancelReminders,
  syncPermissionState,
} from './js/modules/reminder.js';
import { KeyboardDragManager } from './js/modules/accessibility.js';
import {
  uploadBackup,
  shouldAutoBackup,
  markAutoBackupCompleted,
  trackBackupFailure,
} from './js/modules/backup.js';
import { dismissOnboarding, dismissSegmentDemo } from './js/modules/onboarding.js';
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
// Bind Auth UI & Expose Globals
// ============================================
function getRequiredElement(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Required auth UI element "#${id}" not found. Check the DOM ID.`);
  return el;
}

// Auth buttons wired via addEventListener (CSP-compatible, no inline handlers)
getRequiredElement('googleSignInBtn').addEventListener('click', signInWithGoogle);
getRequiredElement('appleSignInBtn').addEventListener('click', signInWithApple);
getRequiredElement('guestModeBtn').addEventListener('click', continueAsGuest);
// These remain on window because they are called from other modules
window.signOut = signOut;
window.showLogin = showLogin;
window.showApp = showApp;

// Make import function available to UI
window.importGuestTasksToFirestore = importGuestTasksToFirestore;

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

  // Schedule reminders after tasks are loaded (if reminders were active on app open)
  if (window._pendingReminderDays !== undefined && window._pendingReminderDays !== null) {
    scheduleReminders(getAllTasks(), window._pendingReminderDays, getCurrentLanguage());
    window._pendingReminderDays = undefined;
  }
}

/**
 * Add task handler
 */
function handleAddTask(taskText, segment, recurringConfig = null, dueDate = null, category = null) {
  if (!taskText || taskText.trim() === '') return;

  // First real task ends onboarding for good, so demo tasks/explanations
  // don't reappear later just because the matrix becomes empty again.
  dismissOnboarding();

  // The Quick Add modal already encodes the category choice (it preselects the
  // active calendar and lets the user override it, including "Keine"), so the
  // explicitly passed category is used as-is and never silently overridden.
  const task = addTaskToSegment(taskText, segment, recurringConfig, null, dueDate, category);

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
 * Dismiss the onboarding demo task for a single segment (Issue #352 B2)
 */
function handleDismissDemo(segmentId) {
  dismissSegmentDemo(segmentId);
  renderTasksWithCallbacks();
}

/**
 * Delete task handler with confirmation for recurring tasks
 */
function handleDeleteTask(taskId, segment) {
  // Find the task to check if it's recurring
  const task = tasks[segment].find((t) => sameTaskId(t.id, taskId));
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
    const deletedTask = tasks[segment].find((t) => sameTaskId(t.id, taskId));
    deleteTask(taskId, segment);
    syncDelete(taskId, segment);
    renderTasksWithCallbacks();

    // Show undo notification
    if (deletedTask) {
      showUndoDelete(deletedTask, getCurrentLanguage(), () => {
        // Save restored task to storage
        syncSave(deletedTask);
        renderTasksWithCallbacks();
      });
    }
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
function syncDelete(taskId) {
  if (currentUser && db && !isGuestMode) {
    // Delete from Firestore
    deleteTaskFromFirestore(taskId, currentUser.uid, db);
  } else {
    // Save to LocalForage (guest mode)
    saveGuestTasks(tasks);
  }
}

/**
 * Sync save task to storage
 */
function syncSave(task) {
  if (currentUser && db && !isGuestMode) {
    // Save to Firestore
    saveTaskToFirestore(task, currentUser.uid, db, window.firebase);
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
 * Reorder task handler (move up/down within segment)
 */
function handleReorderTask(taskId, segment, direction) {
  // Find current index
  const currentIndex = tasks[segment].findIndex((t) => sameTaskId(t.id, taskId));
  if (currentIndex === -1) return;

  // Calculate new index based on direction
  let newIndex;
  if (direction === 'up') {
    newIndex = Math.max(0, currentIndex - 1);
  } else if (direction === 'down') {
    newIndex = Math.min(tasks[segment].length - 1, currentIndex + 1);
  } else {
    return;
  }

  // Don't do anything if index didn't change
  if (newIndex === currentIndex) return;

  // Reorder using existing reorderTask function with save callback
  const reorderedTask = reorderTask(taskId, segment, newIndex, () => {
    // Save to storage based on mode
    if (currentUser && db && !isGuestMode) {
      // In authenticated mode, save all tasks in the segment
      // (Firestore doesn't have ordering, so we save the entire array)
      saveAllTasks();
    } else {
      // Save to LocalForage (guest mode)
      saveGuestTasks(tasks);
    }
  });

  if (reorderedTask) {
    // Re-render
    renderTasksWithCallbacks();
  }
}

/**
 * Toggle task handler
 */
function handleToggleTask(taskId, segment) {
  // Store previous state for undo
  const task = tasks[segment]?.find((t) => sameTaskId(t.id, taskId));
  const wasChecked = task ? task.checked : false;

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

  // Show undo notification
  if (result && result.task) {
    showUndoToggle(taskId, segment, wasChecked, getCurrentLanguage(), () => {
      if (currentUser && db && !isGuestMode) {
        updateTaskInFirestore(result.task, currentUser.uid, db, window.firebase);
      } else {
        saveGuestTasks(tasks);
      }
      renderTasksWithCallbacks();
    });
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
        const taskIndex = tasks[segment].findIndex((t) => sameTaskId(t.id, taskId));
        if (taskIndex !== -1) {
          if (newRecurringConfig === 'DELETE') {
            // Delete task permanently
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
    getCurrentLanguage()
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
    onReorder: handleReorderTask,
    onDismissDemo: handleDismissDemo,
  };

  try {
    // Apply smart rules if enabled
    const smartFunctionsEnabled = localStorage.getItem('smartFunctionsEnabled') === 'true';
    let tasksToRender = smartFunctionsEnabled
      ? applySmartRules(tasks, true, SMART_RULES.urgentThresholdDays)
      : tasks;

    // Apply category filter based on the active calendar switcher
    // (only when the category filter feature is enabled in Personalize)
    const categoryFilterEnabled = localStorage.getItem('categoryFilterEnabled') === 'true';
    const categoryFilter = localStorage.getItem('categoryFilter');
    if (categoryFilterEnabled && categoryFilter) {
      tasksToRender = filterByCategory(tasksToRender, categoryFilter);
    }

    renderAllTasks(tasksToRender, translations, getCurrentLanguage(), callbacks);

    // Setup drop zones for desktop drag & drop
    setupDropZones(handleMoveTask);

    // Keep reminder schedule in sync with current task list
    rescheduleRemindersIfActive();
  } catch (error) {
    console.error('renderTasksWithCallbacks failed:', error);
  }
}

function rescheduleRemindersIfActive() {
  const { enabled, daysBefore } = loadReminderSettings();
  if (enabled && daysBefore !== null && getPermission() === 'granted') {
    scheduleReminders(getAllTasks(), daysBefore, getCurrentLanguage());
  }
}

function renderMatrixStats(allTasks, lang) {
  const barsEl = document.getElementById('matrixStatsBars');
  if (!barsEl) return;

  const t = translations[lang] || translations.en;
  const segLabels = {
    1: t.segments[1].title,
    2: t.segments[2].title,
    3: t.segments[3].title,
    4: t.segments[4].title,
  };

  // Count only active (non-completed, non-checked) tasks in Q1-Q4
  const counts = {};
  let total = 0;
  for (const segId of [1, 2, 3, 4]) {
    const count = (allTasks[segId] || []).filter((task) => !task.checked).length;
    counts[segId] = count;
    total += count;
  }

  if (total === 0) {
    barsEl.innerHTML = `<p class="matrix-stats-empty">${t.metrics.noTasks}</p>`;
    return;
  }

  const segColors = { 1: '#ef4444', 2: '#667eea', 3: '#f59e0b', 4: '#6b7280' };

  barsEl.innerHTML = [1, 2, 3, 4]
    .map((segId) => {
      const count = counts[segId];
      const pct = Math.round((count / total) * 100);
      return `
        <div class="matrix-stats-row">
          <div class="matrix-stats-label">${segLabels[segId]}</div>
          <div class="matrix-stats-bar-wrap">
            <div class="matrix-stats-bar" style="width: ${pct}%; background: ${segColors[segId]}"></div>
          </div>
          <div class="matrix-stats-count">${count} <span class="matrix-stats-pct">(${pct}%)</span></div>
        </div>`;
    })
    .join('');
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
  // Task input - Enter key opens Quick Add Modal with Q1 pre-selected
  const taskInput = document.getElementById('taskInput');
  if (taskInput) {
    taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const taskText = taskInput.value.trim();

        // Open Quick Add Modal with Q1 (Do!) pre-selected
        openQuickAddModal(
          1, // Segment 1 (Do!)
          (text, selectedSegment, recurring, dueDate, category) => {
            handleAddTask(text, selectedSegment || 1, recurring, dueDate, category);
          },
          translations,
          getCurrentLanguage()
        );

        // Clear main input immediately after opening the modal
        taskInput.value = '';

        // If user had entered text, pre-fill it in the modal (if available)
        if (taskText) {
          const quickAddInput = document.getElementById('quickAddInput');
          if (quickAddInput) {
            quickAddInput.value = taskText;
          }
        }
      }
    });

    // Enforce max length
    taskInput.maxLength = MAX_TASK_LENGTH;
  }

  // Smart Suggest – live quadrant hint in Quick Add Modal
  const quickAddInput = document.getElementById('quickAddInput');
  if (quickAddInput) {
    quickAddInput.addEventListener('input', () => {
      const smartEnabled = localStorage.getItem('smartFunctionsEnabled') === 'true';
      const hint = document.getElementById('smartSuggestHint');
      const hintText = document.getElementById('smartSuggestText');
      if (!hint || !hintText) return;

      if (!smartEnabled || !quickAddInput.value.trim()) {
        hint.style.display = 'none';
        return;
      }

      const suggested = suggestSegment(quickAddInput.value);
      if (suggested) {
        const lang = getCurrentLanguage();
        const labels = SEGMENT_SUGGEST_LABELS[lang] || SEGMENT_SUGGEST_LABELS.en;
        const prefix = translations[lang]?.smartSuggest?.prefix || 'Suggestion:';
        hintText.textContent = `${prefix} ${labels[suggested]}`;
        hint.style.display = '';
      } else {
        hint.style.display = 'none';
      }
    });
  }

  // Segment add buttons (+) - Open Quick Add Modal
  const addButtons = document.querySelectorAll('.segment-add-btn');
  addButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const segment = parseInt(e.target.dataset.segment);
      openQuickAddModal(
        segment,
        (text, selectedSegment, recurring, dueDate, category) => {
          handleAddTask(text, selectedSegment || segment, recurring, dueDate, category);
        },
        translations,
        getCurrentLanguage()
      );
    });
  });

  // Focus Mode Toggle
  const focusModeToggle = document.getElementById('focusModeToggle');
  if (focusModeToggle) {
    // Load focus mode state from localStorage
    const focusModeEnabled = localStorage.getItem('focusMode') === 'true';
    if (focusModeEnabled) {
      document.body.classList.add('focus-mode');
      focusModeToggle.classList.add('active');
    }

    focusModeToggle.addEventListener('click', () => {
      const isActive = document.body.classList.toggle('focus-mode');
      focusModeToggle.classList.toggle('active', isActive);

      // Save state to localStorage
      localStorage.setItem('focusMode', isActive);

      // Update tooltip based on state
      const lang = getTranslation();
      focusModeToggle.title = isActive ? lang.focusMode.active : lang.focusMode.tooltip;
    });

    // Set initial tooltip
    const lang = getTranslation();
    focusModeToggle.title = focusModeEnabled ? lang.focusMode.active : lang.focusMode.tooltip;
  }

  // Calendar Switcher (Umschalter zwischen Privat- und Arbeits-Kalender)
  const categorySwitcher = document.getElementById('categorySwitcher');
  if (categorySwitcher) {
    // Show/hide the header switcher based on the personalize toggle
    const updateCategorySwitcherVisibility = () => {
      const enabled = localStorage.getItem('categoryFilterEnabled') === 'true';
      categorySwitcher.style.display = enabled ? '' : 'none';
    };
    updateCategorySwitcherVisibility();
    window.updateCategorySwitcherVisibility = updateCategorySwitcherVisibility;

    const switchButtons = categorySwitcher.querySelectorAll('.category-switch-btn');

    // Restore the active calendar from the saved state ('' = all)
    const savedCategoryFilter = localStorage.getItem('categoryFilter') || '';
    switchButtons.forEach((btn) => {
      btn.classList.toggle('active', (btn.dataset.category || '') === savedCategoryFilter);
      btn.setAttribute('aria-pressed', (btn.dataset.category || '') === savedCategoryFilter);
    });

    switchButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category || '';

        // Update active state
        switchButtons.forEach((b) => {
          const isTarget = b === btn;
          b.classList.toggle('active', isTarget);
          b.setAttribute('aria-pressed', isTarget);
        });

        // Persist selection ('' clears the filter to show all calendars)
        if (category) {
          localStorage.setItem('categoryFilter', category);
        } else {
          localStorage.removeItem('categoryFilter');
        }

        renderTasksWithCallbacks();
      });
    });
  }

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
        isGuestMode,
        getCurrentLanguage()
      );
    });
  }

  // Modal cancel
  const cancelBtn = document.getElementById('cancelBtn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }

  // NOTE: Settings modal close and theme toggle buttons are now handled in ui.js openSettingsModal()
  // to ensure event listeners are properly registered on each modal open

  // Create a global changeLanguage function for use by all modals
  window.changeLanguage = (lang) => {
    // Update language
    setLanguage(lang);
    updateLanguageUI(() => renderTasksWithCallbacks());

    // Persist language preference in localStorage (manual override)
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);

    // Update active state for all language buttons
    const allLangButtons = document.querySelectorAll('.lang-btn');
    allLangButtons.forEach((b) => {
      b.classList.remove('active');
      if (b.dataset.lang === lang) {
        b.classList.add('active');
      }
    });
  };

  // Expose renderTasksWithCallbacks for UI to trigger re-render
  window.renderTasksCallback = renderTasksWithCallbacks;

  // Reminder callbacks for ui.js
  window.updateRemindersCallback = (enabled, daysBefore) => {
    saveReminderSettings(enabled, daysBefore);
    if (enabled && daysBefore !== null) {
      scheduleReminders(getAllTasks(), daysBefore, getCurrentLanguage());
    } else {
      cancelReminders();
    }
  };

  window.requestRemindersPermission = async (toggleElement) => {
    const lang = getCurrentLanguage();
    const t = translations[lang];

    if (!remindersSupported()) {
      showWarning(t.personalize.remindersNotSupported);
      toggleElement.checked = false;
      return;
    }

    const permission = await requestReminderPermission();
    if (permission === 'granted') {
      localStorage.setItem('remindersEnabled', 'true');
      const container = document.getElementById('remindersDaysContainer');
      if (container) container.style.display = 'flex';
      // Don't schedule yet — user still needs to pick daysBefore from dropdown
    } else {
      showWarning(t.personalize.remindersDenied);
      toggleElement.checked = false;
      localStorage.setItem('remindersEnabled', 'false');
    }
  };

  // On app open: sync permission state + reschedule if active
  const remindersSynced = syncPermissionState();
  if (remindersSynced) {
    const { daysBefore } = loadReminderSettings();
    if (daysBefore !== null) {
      // Reschedule after tasks are loaded (tasks may not be ready yet, handled below)
      window._pendingReminderDays = daysBefore;
    }
  } else if (getPermission() === 'denied' && localStorage.getItem('remindersEnabled') === 'true') {
    // Was enabled but permission revoked — toggle was already reset by syncPermissionState
    const remindersToggle = document.getElementById('remindersToggle');
    if (remindersToggle) remindersToggle.checked = false;
  }

  // Language toggle buttons in settings modal (legacy support)
  const langButtons = document.querySelectorAll('.lang-btn');

  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      window.changeLanguage(lang);
    });
  });

  // Language toggle
  const languageToggle = document.getElementById('languageToggle');
  if (languageToggle) {
    languageToggle.value = getCurrentLanguage();
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

  // Export CSV button
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      exportCsv(tasks, getCurrentLanguage());
    });
  }

  // Export Markdown button
  const exportMarkdownBtn = document.getElementById('exportMarkdownBtn');
  if (exportMarkdownBtn) {
    exportMarkdownBtn.addEventListener('click', () => {
      exportMarkdown(tasks, getCurrentLanguage());
    });
  }

  // Q4 Detox button - Archive all Q4 tasks
  const q4DetoxBtn = document.getElementById('q4DetoxBtn');
  if (q4DetoxBtn) {
    q4DetoxBtn.addEventListener('click', async () => {
      const lang = getTranslation();

      // Get all Q4 tasks (Segment 4)
      const q4Tasks = getTasks(SEGMENTS.IGNORE);

      if (q4Tasks.length === 0) {
        showWarning(lang.settings.q4DetoxEmpty);
        return;
      }

      // Confirm action
      const confirmed = confirm(lang.settings.q4DetoxConfirm);
      if (!confirmed) return;

      // Move all Q4 tasks to Q5 (Done)
      for (const task of q4Tasks) {
        handleMoveTask(task.id, SEGMENTS.IGNORE, SEGMENTS.DONE);
      }

      // Show success message
      showSuccess(lang.settings.q4DetoxSuccess);

      // Re-render tasks
      renderTasksWithCallbacks();
    });
  }

  // Purge Done button - permanently delete all completed tasks
  const purgeBtn = document.getElementById('purgeBtn');
  if (purgeBtn) {
    purgeBtn.addEventListener('click', () => {
      const lang = getTranslation();
      const doneTasks = getTasks(SEGMENTS.DONE);

      if (doneTasks.length === 0) {
        showWarning(
          lang.settings?.purgeEmpty ||
            (getCurrentLanguage() === 'de' ? 'Keine erledigten Aufgaben' : 'No completed tasks')
        );
        return;
      }

      const confirmMsg =
        getCurrentLanguage() === 'de'
          ? `${doneTasks.length} erledigte Aufgabe(n) endgültig löschen?`
          : `Permanently delete ${doneTasks.length} completed task(s)?`;
      if (!confirm(confirmMsg)) return;

      for (const task of [...doneTasks]) {
        deleteTask(task.id, SEGMENTS.DONE);
        syncDelete(task.id);
      }

      renderTasksWithCallbacks();
      showSuccess(
        getCurrentLanguage() === 'de' ? 'Erledigte Aufgaben gelöscht' : 'Completed tasks deleted'
      );
    });
  }

  // Import guest tasks button
  const importGuestTasksBtn = document.getElementById('importGuestTasksBtn');
  if (importGuestTasksBtn) {
    importGuestTasksBtn.addEventListener('click', async () => {
      // Check if user is logged in
      if (!currentUser) {
        showWarning('Du musst angemeldet sein, um Gast-Daten zu importieren');
        return;
      }

      // Count guest tasks first
      const guestTasks = await loadGuestTasks();
      let guestTaskCount = 0;
      Object.keys(guestTasks).forEach((segmentId) => {
        guestTaskCount += guestTasks[segmentId].length;
      });

      if (guestTaskCount === 0) {
        showWarning('Keine Gast-Tasks zum Importieren gefunden');
        return;
      }

      // Show confirmation dialog
      const confirmed = confirm(
        `Du hast ${guestTaskCount} Gast-Tasks.\n\nMöchtest du diese in deinen Account importieren?\n\nDie Gast-Daten werden nach dem Import gelöscht.`
      );

      if (!confirmed) return;

      // Perform import
      const result = await window.importGuestTasksToFirestore(currentUser.uid, db);

      if (result.success) {
        showSuccess(
          `${result.taskCount} Gast-Tasks erfolgreich importiert! Seite wird neu geladen...`
        );
        // Reload tasks and close modal
        setTimeout(() => {
          location.reload();
        }, 1500);
      } else {
        showError(`Import fehlgeschlagen: ${result.error}`);
      }
    });
  }

  // Cloud Backup button
  const createBackupBtn = document.getElementById('createBackupBtn');
  if (createBackupBtn) {
    createBackupBtn.addEventListener('click', async () => {
      // Check if user is logged in
      if (!currentUser) {
        const message =
          getCurrentLanguage() === 'de'
            ? 'Du musst angemeldet sein, um ein Backup zu erstellen'
            : 'You must be logged in to create a backup';
        showWarning(message);
        return;
      }

      try {
        // Create backup
        await uploadBackup(storage, currentUser.uid, tasks, getCurrentLanguage());

        // Mark backup as completed to reset auto-backup timer
        markAutoBackupCompleted();

        // Update last backup info in UI
        const lastBackupInfo = document.getElementById('lastBackupInfo');
        if (lastBackupInfo) {
          const lang = getCurrentLanguage();
          const date = new Date();
          const formattedDate = date.toLocaleString(lang === 'de' ? 'de-DE' : 'en-US');
          const lastBackupLabel = lang === 'de' ? 'Letztes Backup' : 'Last backup';
          lastBackupInfo.textContent = `${lastBackupLabel}: ${formattedDate}`;
        }
      } catch (error) {
        console.error('Backup creation failed:', error);
        // Error notification is shown by uploadBackup function
      }
    });
  }

  // Metrics button
  const metricsBtn = document.getElementById('metricsBtn');
  if (metricsBtn) {
    metricsBtn.addEventListener('click', () => {
      openMetricsModal(() => {
        // Fill overview stats
        const totalCompleted = getTasks(SEGMENTS.DONE).length;
        const totalEl = document.getElementById('metricTotalCompleted');
        if (totalEl) totalEl.textContent = totalCompleted;

        // Matrix stats section (Smart Features only)
        const smartEnabled = localStorage.getItem('smartFunctionsEnabled') === 'true';
        const matrixSection = document.getElementById('matrixStatsSection');
        if (matrixSection) {
          matrixSection.style.display = smartEnabled ? '' : 'none';
          if (smartEnabled) {
            renderMatrixStats(tasks, getCurrentLanguage());
          }
        }
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

  // Quick add recurring toggle (Fix for Issue #76, smooth expand #314)
  const quickRecurringEnabled = document.getElementById('quickRecurringEnabled');
  const quickRecurringOptions = document.getElementById('quickRecurringOptions');
  const quickRecurringToggle = document.getElementById('quickRecurringToggle');
  if (quickRecurringEnabled && quickRecurringOptions) {
    quickRecurringEnabled.addEventListener('change', () => {
      quickRecurringOptions.classList.toggle('expanded', quickRecurringEnabled.checked);
      quickRecurringToggle?.classList.toggle('icon-toggle-checked', quickRecurringEnabled.checked);
      if (!quickRecurringEnabled.checked) {
        document.getElementById('quickWeekdaysContainer')?.classList.remove('expanded');
        document.getElementById('quickMonthDayContainer')?.classList.remove('expanded');
      }
    });
  }

  // Quick add due date toggle: reveal the date input and open the native picker
  const quickDueDateEnabled = document.getElementById('quickDueDateEnabled');
  const quickAddDueDate = document.getElementById('quickAddDueDate');
  const quickDueDateToggle = document.getElementById('quickDueDateToggle');
  if (quickDueDateEnabled && quickAddDueDate) {
    quickDueDateEnabled.addEventListener('change', () => {
      const checked = quickDueDateEnabled.checked;
      quickAddDueDate.style.display = checked ? '' : 'none';
      quickDueDateToggle?.classList.toggle('icon-toggle-checked', checked);
      if (checked) {
        if (typeof quickAddDueDate.showPicker === 'function') {
          try {
            quickAddDueDate.showPicker();
          } catch {
            quickAddDueDate.focus();
          }
        } else {
          quickAddDueDate.focus();
        }
      } else {
        quickAddDueDate.value = '';
      }
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (typeof window.signOut === 'function') {
        await window.signOut();
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
window.onAuthStateChanged = async function (user, guestMode = false) {
  currentUser = user;
  isGuestMode = guestMode;

  // On logout: clear tasks from memory and DOM before showing login screen
  if (!user && !guestMode) {
    setAllTasks({ 1: [], 2: [], 3: [], 4: [], 5: [] });
    renderTasksWithCallbacks();
    return;
  }

  // Only reload tasks if they haven't been loaded yet (prevents double-loading)
  const tasksAlreadyLoaded = getTasks().length > 0;

  if (!tasksAlreadyLoaded) {
    // First load: load tasks and setup UI
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

    // Show tutorial on first use
    if (shouldShowTutorial()) {
      setTimeout(() => {
        openTutorialModal(getCurrentLanguage());
      }, 500); // Small delay to let the app settle
    }

    // Auto-backup (only for authenticated users, not guest mode)
    if (user && !guestMode && shouldAutoBackup()) {
      try {
        await uploadBackup(storage, user.uid, tasks, getCurrentLanguage(), false);
        markAutoBackupCompleted();
      } catch (error) {
        console.error('Auto-backup failed:', error);
        // Track failure and notify only after 3 consecutive failures
        const shouldNotify = trackBackupFailure();
        if (shouldNotify) {
          const message =
            getCurrentLanguage() === 'de'
              ? 'Automatische Backups schlagen wiederholt fehl. Bitte prüfen Sie Ihre Internetverbindung.'
              : 'Automatic backups are repeatedly failing. Please check your internet connection.';
          showError(message);
        }
      }
    }
  } else {
    // Tasks already loaded: just re-sync with Firebase in background
    await loadAllTasks();
    renderTasksWithCallbacks();
  }
};

// ============================================
// Application Initialization
// ============================================

/**
 * Initialize the application
 */
async function initApp() {
  initSentry();

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

  // Initialize environment banner (for staging/testing)
  if (isStaging() || isTesting()) {
    const envBanner = document.getElementById('stagingBanner');
    if (envBanner) {
      envBanner.style.display = 'block';
      // Update badge text based on environment
      const badge = envBanner.querySelector('.staging-badge');
      if (badge) {
        badge.textContent = isTesting() ? '🧪 TESTING' : '⚠️ STAGING';
      }
      // Update banner class for different styling
      if (isTesting()) {
        envBanner.classList.add('testing-banner');
      }
    }
  }

  // Initialize language: 1) localStorage (manual override), 2) Browser language (auto-detect), 3) Fallback to 'en'
  const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
  if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'de')) {
    // User has manually selected a language - use it
    setLanguage(savedLanguage);
  } else {
    // Auto-detect browser language
    const detectedLanguage = detectBrowserLanguage();
    setLanguage(detectedLanguage);
    // Don't persist auto-detected language - only persist when user manually changes it
  }

  // Update login screen with detected/saved language
  initLoginTranslations();

  // Update UI with correct language (including Quick Add Modal)
  updateLanguageUI();

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

  // EARLY LOAD: Check if user is already logged in (from IndexedDB cache)
  // This allows instant app load with cached data while Firebase Auth initializes
  try {
    const wasGuestMode = await localforage.getItem('guestMode');

    if (wasGuestMode === 'true') {
      // Guest mode: show app and load guest tasks immediately
      isGuestMode = true;
      window.showApp();
      await loadAllTasks();
      setupEventListeners();
      if (!keyboardDragManager) {
        keyboardDragManager = new KeyboardDragManager(handleMoveTask);
      }
      renderTasksWithCallbacks();
      updateOnlineStatus();
    } else if (auth.currentUser) {
      // User is logged in: show app and load their tasks immediately
      currentUser = auth.currentUser;
      isGuestMode = false;
      window.showApp();
      await loadAllTasks();
      setupEventListeners();
      if (!keyboardDragManager) {
        keyboardDragManager = new KeyboardDragManager(handleMoveTask);
      }
      renderTasksWithCallbacks();
      updateOnlineStatus();
    }
    // If neither guest nor logged in, auth.js will show login screen
  } catch (error) {
    console.error('initApp early-load failed:', error);
  }

  // Note: Event listeners and tasks are loaded ABOVE for instant start
  // Firebase Auth will re-sync in background via onAuthStateChanged callback
  initAuth();

  // Hide splash screen after app initialization
  const splashScreen = document.getElementById('splashScreen');
  if (splashScreen) {
    const appLoadStart = performance.now();
    const minDisplayTime = 500; // Minimum 500ms to prevent flashing

    // Hide splash screen when app is ready
    const hideSplashScreen = () => {
      const elapsed = performance.now() - appLoadStart;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);

      setTimeout(() => {
        splashScreen.classList.add('hidden');
        // Remove from DOM after transition completes
        setTimeout(() => {
          splashScreen.remove();
        }, 300);
      }, remainingTime);
    };

    // Wait for app to be fully ready (or max 2s)
    const maxWaitTime = 2000;
    const readyCheck = setTimeout(hideSplashScreen, maxWaitTime);

    // Or hide immediately if app is already ready
    if (document.readyState === 'complete') {
      clearTimeout(readyCheck);
      hideSplashScreen();
    }
  }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for global access (if needed by auth.js or other non-module scripts)
window.appInitialized = true;
