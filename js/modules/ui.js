/**
 * UI Module
 * Handles all UI rendering, modals, and user interactions
 */

import localforage from 'localforage';
import { COLORS, SEGMENTS } from './config.js';
import { getTasks, getRecurringDescription } from './tasks.js';
import { DragManager } from './drag-manager.js';
import { announceDragStart, announceDragEnd } from './accessibility.js';
import { translations } from './translations.js';

/**
 * Create a task DOM element
 * @param {object} task - Task object
 * @param {object} translations - Translations object
 * @param {string} currentLanguage - Current language
 * @param {object} callbacks - Callback functions
 * @param {function} callbacks.onToggle - Toggle task handler
 * @param {function} callbacks.onDragEnd - Drag end handler (called after drop)
 * @param {function} callbacks.onSwipeDelete - Swipe delete handler
 * @returns {HTMLElement} Task element
 */
export function createTaskElement(task, translations, currentLanguage, callbacks = {}) {
  const div = document.createElement('div');
  div.className = 'task-item';
  div.dataset.taskId = task.id;
  div.dataset.segmentId = task.segment;

  // Accessibility: Make task items keyboard focusable
  div.setAttribute('tabindex', '0');
  div.setAttribute('role', 'button');
  div.setAttribute('aria-pressed', 'false');
  div.setAttribute('aria-label', `Task: ${task.text}. Press Space to select for moving.`);

  // Set border color based on segment
  div.style.setProperty('--checkbox-color', COLORS[task.segment]);

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = task.checked;

  // Checkbox event listener
  if (callbacks.onToggle) {
    checkbox.addEventListener('change', () => {
      callbacks.onToggle(task.id, task.segment);
    });
  }

  const content = document.createElement('div');
  content.className = 'task-content';

  const textSpan = document.createElement('span');
  textSpan.className = 'task-text';

  // Create a text node for the task text
  const textNode = document.createTextNode(task.text);
  textSpan.appendChild(textNode);

  // Add recurring indicator if task is recurring
  if (task.recurring && task.recurring.enabled) {
    const recurringIndicator = document.createElement('button');
    recurringIndicator.className = 'recurring-indicator';
    recurringIndicator.type = 'button';
    recurringIndicator.setAttribute('aria-label', 'Edit recurring task settings');
    recurringIndicator.title = getRecurringDescription(
      task.recurring,
      translations[currentLanguage]
    );

    // Create SVG icon (circular arrow)
    recurringIndicator.innerHTML = `
 <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
 <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
 </svg>
 `;

    // Click handler to open edit modal
    recurringIndicator.addEventListener('click', (e) => {
      e.stopPropagation();
      if (callbacks.onEditRecurring) {
        callbacks.onEditRecurring(task);
      }
    });

    textSpan.appendChild(recurringIndicator);
  }

  // Add delete button inline after text (only for Done tasks on desktop)
  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isDoneTask = task.segment === SEGMENTS.DONE;

  if (isDoneTask && !isTouchDevice()) {
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-delete-btn';
    deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (callbacks.onSwipeDelete) {
        callbacks.onSwipeDelete(task.id, task.segment);
      }
    });
    // Add delete button inline in textSpan, right after text/recurring icon
    textSpan.appendChild(deleteBtn);
  }

  content.appendChild(textSpan);

  // Add due date if present (for non-completed tasks)
  if (task.dueDate && task.segment !== SEGMENTS.DONE) {
    const dueDateSpan = document.createElement('span');
    dueDateSpan.className = 'task-due-date';

    // Parse and format the date according to the current language
    const dueDate = new Date(task.dueDate);

    // Validate the date is valid
    if (!isNaN(dueDate.getTime())) {
      // Extract date components
      const day = dueDate.getDate().toString().padStart(2, '0');
      const month = (dueDate.getMonth() + 1).toString().padStart(2, '0');
      const year = dueDate.getFullYear();

      // Format based on language
      const formattedDueDate =
        currentLanguage === 'de'
          ? `${day}.${month}.${year}` // DD.MM.YYYY for German
          : `${month}/${day}/${year}`; // MM/DD/YYYY for English

      dueDateSpan.textContent = `📅 ${formattedDueDate}`;
      content.appendChild(dueDateSpan);
    }
  }

  // Add completion timestamp for Done! segment
  if (task.segment === SEGMENTS.DONE && task.completedAt) {
    const timestampSpan = document.createElement('span');
    timestampSpan.className = 'task-timestamp';
    const date = new Date(task.completedAt);
    const formattedDate = date.toLocaleDateString(currentLanguage === 'de' ? 'de-DE' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString(currentLanguage === 'de' ? 'de-DE' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    timestampSpan.textContent = `${formattedDate} ${formattedTime}`;
    content.appendChild(timestampSpan);
  }

  div.appendChild(checkbox);
  div.appendChild(content);

  // Setup Drag & Drop 2.0 with DragManager
  if (callbacks.onDragEnd || callbacks.onSwipeDelete) {
    const dragManager = new DragManager({
      element: div,
      data: task,

      onDragStart: (event) => {
        div.classList.add('dragging');

        // Announce to screen readers
        announceDragStart(task.text);
      },

      onDragMove: (event) => {
        // Optional: Update UI during drag
      },

      onDragEnd: (event) => {
        div.classList.remove('dragging');

        if (event.target && callbacks.onDragEnd) {
          const toSegment = parseInt(event.target.dataset.segment);
          const fromSegment = task.segment;

          if (toSegment && toSegment !== fromSegment) {
            // Announce to screen readers
            announceDragEnd(task.text, fromSegment, toSegment);

            callbacks.onDragEnd(task.id, fromSegment, toSegment);
          }
        }
      },

      onSwipeDelete: (data) => {
        if (callbacks.onSwipeDelete) {
          callbacks.onSwipeDelete(data.id, data.segment);
        }
      },

      onSwipeComplete: (data) => {
        if (callbacks.onToggle) {
          callbacks.onToggle(data.id, data.segment);
        }
      },

      enableSwipeDelete: true,
      enableSwipeComplete: task.segment !== SEGMENTS.DONE, // Don't enable for Done tasks
      longPressDelay: 300,
      swipeThreshold: 100,
    });

    // Store reference for cleanup
    div._dragManager = dragManager;
  }

  // Add reorder buttons (up/down) for non-touch devices or non-Done tasks
  const shouldShowReorderButtons = !isDoneTask && !isTouchDevice();

  if (shouldShowReorderButtons && callbacks.onReorder) {
    const reorderContainer = document.createElement('div');
    reorderContainer.className = 'task-reorder-buttons';

    const taskIndex = callbacks.taskIndex ?? 0;
    const totalTasks = callbacks.totalTasks ?? 1;
    const isFirst = taskIndex === 0;
    const isLast = taskIndex === totalTasks - 1;

    const upBtn = document.createElement('button');
    upBtn.className = 'reorder-btn reorder-up';
    upBtn.setAttribute('aria-label', `Move task "${task.text}" up`);
    upBtn.textContent = '↑';
    upBtn.disabled = isFirst;
    upBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      callbacks.onReorder(task.id, task.segment, 'up');
    });

    const downBtn = document.createElement('button');
    downBtn.className = 'reorder-btn reorder-down';
    downBtn.setAttribute('aria-label', `Move task "${task.text}" down`);
    downBtn.textContent = '↓';
    downBtn.disabled = isLast;
    downBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      callbacks.onReorder(task.id, task.segment, 'down');
    });

    reorderContainer.appendChild(upBtn);
    reorderContainer.appendChild(downBtn);
    div.appendChild(reorderContainer);
  }

  return div;
}

/**
 * Render tasks in a specific segment
 * @param {number} segmentId - Segment ID (1-5)
 * @param {object} tasks - Tasks object
 * @param {object} translations - Translations object
 * @param {string} currentLanguage - Current language
 * @param {object} callbacks - Event callbacks
 */
export function renderSegment(segmentId, tasks, translations, currentLanguage, callbacks = {}) {
  const segmentElement = document.getElementById(`segment${segmentId}`);
  if (!segmentElement) return;

  segmentElement.innerHTML = '';

  const segmentTasks = tasks[segmentId] || [];
  segmentTasks.forEach((task, index) => {
    const taskElement = createTaskElement(task, translations, currentLanguage, {
      ...callbacks,
      taskIndex: index,
      totalTasks: segmentTasks.length,
    });
    segmentElement.appendChild(taskElement);
  });
}

/**
 * Render all tasks in all segments
 * @param {object} tasks - Tasks object
 * @param {object} translations - Translations object
 * @param {string} currentLanguage - Current language
 * @param {object} callbacks - Event callbacks
 */
export function renderAllTasks(tasks, translations, currentLanguage, callbacks = {}) {
  for (let i = 1; i <= 5; i++) {
    renderSegment(i, tasks, translations, currentLanguage, callbacks);
  }
}

/**
 * Open the task segment modal
 * @param {function} onAddTask - Callback when task is added
 * @param {string} currentTask - Current task text
 * @returns {function} Close modal function
 */
export function openModal(onAddTask, currentTask) {
  const modal = document.getElementById('segmentModal');
  const recurringEnabled = document.getElementById('recurringEnabled');
  const recurringOptions = document.getElementById('recurringOptions');
  const recurringInterval = document.getElementById('recurringInterval');
  const weeklyOptions = document.getElementById('weeklyOptions');
  const monthlyOptions = document.getElementById('monthlyOptions');
  const segmentBtns = document.querySelectorAll('.segment-btn');

  if (!modal) {
    return () => {};
  }
  modal.classList.remove('hidden');
  modal.classList.add('active');
  modal.style.display = 'flex';

  // Reset recurring task options
  if (recurringEnabled) recurringEnabled.checked = false;
  if (recurringOptions) recurringOptions.style.display = 'none';
  if (recurringInterval) recurringInterval.value = 'daily';
  if (weeklyOptions) weeklyOptions.style.display = 'none';
  if (monthlyOptions) monthlyOptions.style.display = 'none';

  // Reset weekday checkboxes
  if (weeklyOptions) {
    const weekdayCheckboxes = weeklyOptions.querySelectorAll('input[type="checkbox"]');
    weekdayCheckboxes.forEach((cb) => (cb.checked = false));
  }

  // Setup segment buttons
  segmentBtns.forEach((btn) => {
    const segmentId = parseInt(btn.dataset.segment);
    btn.onclick = () => {
      if (currentTask) {
        const recurringConfig = getRecurringConfig();
        onAddTask(currentTask, segmentId, recurringConfig);
      }
      closeModal();
    };
  });

  return () => closeModal();
}

/**
 * Close the task segment modal
 */
export function closeModal() {
  const modal = document.getElementById('segmentModal');
  if (modal) {
    modal.classList.remove('active');
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
}

/**
 * Open modal for moving a task
 * @param {object} task - Task to move
 * @param {function} onMove - Callback when task is moved
 */
export function openModalForMove(task, onMove) {
  const modal = document.getElementById('segmentModal');
  const segmentBtns = document.querySelectorAll('.segment-btn');

  if (!modal) return;

  modal.classList.add('active');

  // Update segment buttons for move
  segmentBtns.forEach((btn) => {
    const segmentId = parseInt(btn.dataset.segment);
    btn.onclick = () => {
      if (task.segment !== segmentId) {
        onMove(task.id, task.segment, segmentId);
      }
      closeModal();
    };
  });
}

/**
 * Get recurring configuration from modal form
 * @returns {object|null} Recurring config or null
 */
export function getRecurringConfig() {
  const recurringEnabled = document.getElementById('recurringEnabled');
  const recurringInterval = document.getElementById('recurringInterval');
  const weeklyOptions = document.getElementById('weeklyOptions');

  if (!recurringEnabled || !recurringEnabled.checked) {
    return null;
  }

  const config = {
    enabled: true,
    interval: recurringInterval ? recurringInterval.value : 'daily',
  };

  // Get interval-specific configuration
  switch (config.interval) {
    case 'weekly':
      if (weeklyOptions) {
        const weekdayCheckboxes = weeklyOptions.querySelectorAll('input[type="checkbox"]:checked');
        config.weekdays = Array.from(weekdayCheckboxes).map((cb) => parseInt(cb.value));
      }
      break;
    case 'monthly':
      const dayOfMonth = document.getElementById('dayOfMonth');
      if (dayOfMonth) {
        config.dayOfMonth = parseInt(dayOfMonth.value);
      }
      break;
  }

  return config;
}

/**
 * Open settings modal
 * @param {object} currentUser - Current user object (or null)
 * @param {string} version - App version
 * @param {string} buildDate - Build date
 * @param {boolean} isGuestMode - Whether user is in guest mode
 */
export function openSettingsModal(
  currentUser,
  version,
  buildDate,
  isGuestMode = false,
  currentLanguage = 'en'
) {
  const settingsModal = document.getElementById('settingsModal');

  if (!settingsModal) {
    return;
  }
  // Update theme toggle button active state based on current theme
  const themeButtons = document.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem('darkMode');
  let activeTheme = 'system'; // Default to system

  if (savedTheme === 'true') {
    activeTheme = 'dark';
  } else if (savedTheme === 'false') {
    activeTheme = 'light';
  } else if (savedTheme === null) {
    activeTheme = 'system';
  }

  themeButtons.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.theme === activeTheme) {
      btn.classList.add('active');
    }
  });

  // Use event delegation for all settings modal buttons to avoid listener loss after DOM changes
  // Remove any existing delegated listener first
  const existingHandler = settingsModal._clickHandler;
  if (existingHandler) {
    settingsModal.removeEventListener('click', existingHandler);
  }

  // Create new delegated click handler
  const clickHandler = (e) => {
    const target = e.target;

    // Handle theme button clicks
    const themeBtn = target.closest('.theme-btn');
    if (themeBtn) {
      const theme = themeBtn.dataset.theme;

      // Update active state
      document.querySelectorAll('.theme-btn').forEach((b) => b.classList.remove('active'));
      themeBtn.classList.add('active');

      // Update theme
      if (theme === 'dark') {
        localStorage.setItem('darkMode', 'true');
        document.body.classList.add('dark-mode');
      } else if (theme === 'system') {
        localStorage.removeItem('darkMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      }
      return;
    }

    // Handle Personalisieren button click
    if (target.closest('#personalizeBtn')) {
      e.preventDefault();
      openPersonalizeModal(currentLanguage);
      return;
    }

    // Handle About button click
    if (target.closest('#aboutBtn')) {
      e.preventDefault();
      openAboutModal(version, currentLanguage);
      return;
    }

    // Handle close button click
    if (target.closest('#settingsCancelBtn')) {
      closeSettingsModal();
      return;
    }

    // Handle sign out button click
    if (target.closest('#signOutBtn')) {
      if (window.signOut) {
        window.signOut();
        closeSettingsModal();
      }
      return;
    }
  };

  // Store handler reference and add listener
  settingsModal._clickHandler = clickHandler;
  settingsModal.addEventListener('click', clickHandler);

  // Update language toggle button active state - use currentLanguage parameter
  const langButtons = document.querySelectorAll('.lang-btn');

  langButtons.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.lang === currentLanguage) {
      btn.classList.add('active');
    }
  });

  // Show/hide account section based on authentication state
  const accountSection = document.getElementById('accountSection');
  const accountSeparator = document.getElementById('accountSeparator');
  const userEmailDisplay = document.getElementById('userEmailDisplay');

  // Show sign out button for both Firebase login and guest mode
  if (currentUser || isGuestMode) {
    // User is authenticated (Firebase) or in guest mode (local) - show sign out button
    if (accountSection) accountSection.style.display = 'block';
    if (accountSeparator) accountSeparator.style.display = 'block';

    // Display user email/status
    if (userEmailDisplay) {
      userEmailDisplay.textContent = '';
      const emailLabel = document.createElement('p');
      emailLabel.className = 'settings-user-email';

      if (currentUser) {
        emailLabel.textContent = currentUser.email || 'User';
      } else if (isGuestMode) {
        emailLabel.textContent = 'Gastmodus (Lokal gespeichert)';
      }

      userEmailDisplay.appendChild(emailLabel);
    }
  } else {
    // Not in app yet - hide sign out button
    if (accountSection) accountSection.style.display = 'none';
    if (accountSeparator) accountSeparator.style.display = 'none';
  }

  // Show/hide backup section - only for authenticated users (not guest mode)
  const backupSection = document.getElementById('backupSection');
  const backupSeparator = document.getElementById('backupSeparator');

  if (backupSection) {
    if (currentUser && !isGuestMode) {
      backupSection.style.display = 'block';
      if (backupSeparator) backupSeparator.style.display = 'block';

      // Update last backup timestamp
      const lastBackupInfo = document.getElementById('lastBackupInfo');
      const lastAutoBackup = localStorage.getItem('lastAutoBackup');

      if (lastBackupInfo) {
        const lang = currentLanguage === 'de' ? 'de' : 'en';
        const neverText = currentLanguage === 'de' ? 'Nie' : 'Never';

        if (lastAutoBackup) {
          const date = new Date(parseInt(lastAutoBackup));
          const formattedDate = date.toLocaleString(lang === 'de' ? 'de-DE' : 'en-US');
          const lastBackupLabel = currentLanguage === 'de' ? 'Letztes Backup' : 'Last backup';
          lastBackupInfo.textContent = `${lastBackupLabel}: ${formattedDate}`;
        } else {
          const lastBackupLabel = currentLanguage === 'de' ? 'Letztes Backup' : 'Last backup';
          lastBackupInfo.textContent = `${lastBackupLabel}: ${neverText}`;
        }
      }
    } else {
      backupSection.style.display = 'none';
      if (backupSeparator) backupSeparator.style.display = 'none';
    }
  }

  // Note: All button clicks (About, Sign Out, Close) are now handled via event delegation above

  settingsModal.classList.remove('hidden');
  settingsModal.classList.add('active');
  settingsModal.style.display = 'flex';
}

/**
 * Close settings modal
 */
export function closeSettingsModal() {
  const settingsModal = document.getElementById('settingsModal');
  if (settingsModal) {
    settingsModal.classList.remove('active');
    settingsModal.classList.add('hidden');
    settingsModal.style.display = 'none';
  }
}

/**
 * Open About modal
 * @param {string} version - App version
 */
export function openAboutModal(version, currentLanguage = 'en') {
  const aboutModal = document.getElementById('aboutModal');
  if (!aboutModal) return;

  const lang = translations[currentLanguage]?.about;
  if (lang) {
    const set = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
    set('aboutTitle', lang.title);
    set('aboutLicenseTitle', lang.licenseTitle);
    set('aboutLicenseInfo', lang.licenseInfo);
    set('aboutNoCommercial', lang.noCommercial);
    set('aboutRepositoryLink', lang.repository);
    set('aboutSupportTitle', lang.supportTitle);
    set('aboutSupportMe', lang.supportMe);
    set('aboutReportBug', lang.reportBug);
  }

  aboutModal.classList.add('active');
  aboutModal.style.display = 'flex';

  // Setup close button event listener
  const aboutCancelBtn = document.getElementById('aboutCancelBtn');
  if (aboutCancelBtn) {
    const newAboutCancelBtn = aboutCancelBtn.cloneNode(true);
    aboutCancelBtn.parentNode.replaceChild(newAboutCancelBtn, aboutCancelBtn);

    newAboutCancelBtn.addEventListener('click', () => {
      closeAboutModal();
    });
  }
}

/**
 * Close About modal
 */
export function closeAboutModal() {
  const aboutModal = document.getElementById('aboutModal');
  if (aboutModal) {
    aboutModal.classList.remove('active');
    aboutModal.classList.add('hidden');
    aboutModal.style.display = 'none';
  }
}

/**
 * Open Personalize modal
 * @param {string} currentLanguage - Current language
 */
export function openPersonalizeModal(currentLanguage = 'en') {
  const personalizeModal = document.getElementById('personalizeModal');

  if (!personalizeModal) {
    return;
  }

  // Update theme toggle button active state based on current theme
  const themeButtons = personalizeModal.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem('darkMode');
  let activeTheme = 'system'; // Default to system

  if (savedTheme === 'true') {
    activeTheme = 'dark';
  } else if (savedTheme === 'false') {
    activeTheme = 'light';
  } else if (savedTheme === null) {
    activeTheme = 'system';
  }

  themeButtons.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.theme === activeTheme) {
      btn.classList.add('active');
    }
  });

  // Update language toggle button active state
  const langButtons = personalizeModal.querySelectorAll('.lang-btn');
  langButtons.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.lang === currentLanguage) {
      btn.classList.add('active');
    }
  });

  // Use event delegation for all personalize modal buttons
  const existingHandler = personalizeModal._clickHandler;
  if (existingHandler) {
    personalizeModal.removeEventListener('click', existingHandler);
  }

  // Create new delegated click handler
  const clickHandler = (e) => {
    const target = e.target;

    // Handle theme button clicks
    const themeBtn = target.closest('.theme-btn');
    if (themeBtn) {
      const theme = themeBtn.dataset.theme;

      // Update active state
      personalizeModal.querySelectorAll('.theme-btn').forEach((b) => b.classList.remove('active'));
      themeBtn.classList.add('active');

      // Update theme
      if (theme === 'dark') {
        localStorage.setItem('darkMode', 'true');
        document.body.classList.add('dark-mode');
      } else if (theme === 'system') {
        localStorage.removeItem('darkMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      }
      return;
    }

    // Handle language button clicks
    const langBtn = target.closest('.lang-btn');
    if (langBtn) {
      const lang = langBtn.dataset.lang;

      // Update active state
      personalizeModal.querySelectorAll('.lang-btn').forEach((b) => b.classList.remove('active'));
      langBtn.classList.add('active');

      // Trigger language change (will be handled by script.js)
      if (window.changeLanguage) {
        window.changeLanguage(lang);
      }
      return;
    }

    // Handle close button click
    if (target.closest('#personalizeCancelBtn')) {
      closePersonalizeModal();
      return;
    }
  };

  // Store handler reference and add listener
  personalizeModal._clickHandler = clickHandler;
  personalizeModal.addEventListener('click', clickHandler);

  personalizeModal.classList.remove('hidden');
  personalizeModal.classList.add('active');
  personalizeModal.style.display = 'flex';
}

/**
 * Close Personalize modal
 */
export function closePersonalizeModal() {
  const personalizeModal = document.getElementById('personalizeModal');
  if (personalizeModal) {
    personalizeModal.classList.remove('active');
    personalizeModal.classList.add('hidden');
    personalizeModal.style.display = 'none';
  }
}

/**
 * Open metrics modal
 * @param {function} calculateMetrics - Callback to calculate and display metrics
 */
export function openMetricsModal(calculateMetrics) {
  const metricsModal = document.getElementById('metricsModal');
  if (!metricsModal) return;

  metricsModal.classList.add('active');
  metricsModal.style.display = 'flex';

  if (calculateMetrics) {
    calculateMetrics();
  }

  // Setup close button event listener
  const metricsCancelBtn = document.getElementById('metricsCancelBtn');
  if (metricsCancelBtn) {
    // Remove old listener by cloning
    const newCancelBtn = metricsCancelBtn.cloneNode(true);
    metricsCancelBtn.parentNode.replaceChild(newCancelBtn, metricsCancelBtn);

    // Add new listener
    newCancelBtn.addEventListener('click', () => {
      closeMetricsModal();
    });
  } else {
  }
}

/**
 * Close metrics modal
 */
export function closeMetricsModal() {
  const metricsModal = document.getElementById('metricsModal');
  if (metricsModal) {
    metricsModal.classList.remove('active');
    metricsModal.style.display = 'none';
  }
}

/**
 * Show drag hint to user
 */
export function showDragHint() {
  const dragHint = document.getElementById('dragHint');
  if (!dragHint) return;

  dragHint.style.display = 'block';

  const closeBtn = document.getElementById('closeDragHint');
  if (closeBtn) {
    closeBtn.addEventListener('click', async () => {
      dragHint.style.display = 'none';
      if (typeof localforage !== 'undefined') {
        await localforage.setItem('dragHintSeen', true);
      }
    });
  }
}

/**
 * Update online/offline status indicator
 */
export function updateOnlineStatus() {
  const indicator = document.getElementById('offlineIndicator');
  if (!indicator) return;

  if (!navigator.onLine) {
    indicator.style.display = 'block';
  } else {
    indicator.style.display = 'none';
  }
}

/**
 * Update sync status indicator (Phase 4: Offline-Support)
 * @param {object} syncStatus - Sync status from getSyncStatus()
 */
export function updateSyncStatus(syncStatus) {
  const indicator = document.getElementById('offlineIndicator');
  if (!indicator) return;

  const { pendingItems, isProcessing, isOnline } = syncStatus;

  if (!isOnline) {
    indicator.innerHTML = `
 <div class="offline-indicator-content">
 <span class="offline-dot"></span>
 <span>Offline</span>
 ${pendingItems > 0 ? `<span class="pending-count">(${pendingItems} pending)</span>` : ''}
 </div>
 `;
    indicator.style.display = 'block';
  } else if (isProcessing && pendingItems > 0) {
    indicator.innerHTML = `
 <div class="offline-indicator-content">
 <span class="syncing-spinner"></span>
 <span>Syncing ${pendingItems} change${pendingItems !== 1 ? 's' : ''}...</span>
 </div>
 `;
    indicator.style.display = 'block';
  } else if (pendingItems > 0) {
    indicator.innerHTML = `
 <div class="offline-indicator-content">
 <span class="pending-dot"></span>
 <span>${pendingItems} change${pendingItems !== 1 ? 's' : ''} pending</span>
 </div>
 `;
    indicator.style.display = 'block';
  } else {
    indicator.style.display = 'none';
  }
}

/**
 * Update all UI text based on current language
 * @param {object} translations - Translations object
 * @param {string} currentLanguage - Current language
 */
export function updateLanguage(translations, currentLanguage) {
  const lang = translations[currentLanguage];
  if (!lang) return;

  // Update segment headers
  for (let i = 1; i <= 5; i++) {
    const segment = document.querySelector(`.segment[data-segment="${i}"]`);
    if (segment) {
      const header = segment.querySelector('.segment-header h2');
      if (header) {
        const segmentData = lang.segments[i];
        if (segmentData.subtitle) {
          header.innerHTML = `${segmentData.title} <span style="font-size: 0.7em; opacity: 0.7; font-weight: 400;">${segmentData.subtitle}</span>`;
        } else {
          header.textContent = segmentData.title;
        }
      }
    }
  }

  // Update modal segment buttons
  const segmentButtons = document.querySelectorAll('.segment-btn');
  segmentButtons.forEach((btn) => {
    const segmentId = parseInt(btn.dataset.segment);
    const segmentData = lang.segments[segmentId];
    if (segmentData) {
      if (segmentData.subtitle) {
        btn.innerHTML = `<strong>${segmentData.title}</strong><br><span style="font-size: 0.8em; opacity: 0.8;">${segmentData.subtitle}</span>`;
      } else {
        btn.innerHTML = `<strong>${segmentData.title}</strong>`;
      }
    }
  });

  // Update recurring task UI translations
  const recurringEnableText = document.getElementById('recurringEnableText');
  if (recurringEnableText) {
    recurringEnableText.textContent = lang.recurring.enableLabel;
  }

  const recurringIntervalLabel = document.getElementById('recurringIntervalLabel');
  if (recurringIntervalLabel) {
    recurringIntervalLabel.textContent = lang.recurring.intervalLabel;
  }

  // Update interval select options
  const recurringInterval = document.getElementById('recurringInterval');
  if (recurringInterval) {
    const dailyOption = recurringInterval.querySelector('option[value="daily"]');
    const weeklyOption = recurringInterval.querySelector('option[value="weekly"]');
    const monthlyOption = recurringInterval.querySelector('option[value="monthly"]');

    if (dailyOption) dailyOption.textContent = lang.recurring.daily;
    if (weeklyOption) weeklyOption.textContent = lang.recurring.weekly;
    if (monthlyOption) monthlyOption.textContent = lang.recurring.monthly;
  }

  // Update weekday labels
  const weekdayMap = {
    'weekday-monday': 'monday',
    'weekday-tuesday': 'tuesday',
    'weekday-wednesday': 'wednesday',
    'weekday-thursday': 'thursday',
    'weekday-friday': 'friday',
    'weekday-saturday': 'saturday',
    'weekday-sunday': 'sunday',
  };

  Object.entries(weekdayMap).forEach(([id, key]) => {
    const elem = document.getElementById(id);
    if (elem && lang.recurring.weekdays[key]) {
      elem.textContent =
        currentLanguage === 'de'
          ? lang.recurring.weekdays[key].substring(0, 2)
          : lang.recurring.weekdays[key].substring(0, 3);
    }
  });

  const dayOfMonthLabel = document.getElementById('dayOfMonthLabel');
  if (dayOfMonthLabel) {
    dayOfMonthLabel.textContent = lang.recurring.dayOfMonth;
  }

  const customDaysLabel = document.getElementById('customDaysLabel');
  if (customDaysLabel) {
    customDaysLabel.textContent = lang.recurring.customDays;
  }

  // Update task input placeholder
  const taskInput = document.getElementById('taskInput');
  if (taskInput) {
    taskInput.placeholder = lang.taskInputPlaceholder;
  }

  // Update drag hint text
  const dragHint = document.getElementById('dragHint');
  if (dragHint) {
    const hintTextPara = dragHint.querySelector('p');
    const hintButton = dragHint.querySelector('button');

    if (hintTextPara) {
      const hintText =
        currentLanguage === 'de'
          ? '💡 <strong>Tipp:</strong> Ziehe Aufgaben zwischen Kategorien, um sie zu verschieben. Wische nach links, um zu löschen.'
          : '💡 <strong>Tip:</strong> Drag tasks between categories to move them. Swipe left to delete.';
      hintTextPara.innerHTML = hintText;
    }

    if (hintButton) {
      const btnText = currentLanguage === 'de' ? 'Verstanden' : 'Got it';
      hintButton.textContent = btnText;
    }
  }
}

/**
 * Update metrics modal language
 * @param {object} translations - Translations object
 * @param {string} currentLanguage - Current language
 */
export function updateMetricsLanguage(translations, currentLanguage) {
  const lang = translations[currentLanguage];
  if (!lang || !lang.metrics) return;

  const metricsTitle = document.getElementById('metricsTitle');
  if (metricsTitle) metricsTitle.textContent = lang.metrics.title;

  const metricsOverviewTitle = document.getElementById('metricsOverviewTitle');
  if (metricsOverviewTitle) metricsOverviewTitle.textContent = lang.metrics.overview;

  const metricTotalLabel = document.getElementById('metricTotalLabel');
  if (metricTotalLabel) metricTotalLabel.textContent = lang.metrics.totalCompleted;

  const metricStreakLabel = document.getElementById('metricStreakLabel');
  if (metricStreakLabel) metricStreakLabel.textContent = lang.metrics.streak;

  const metricAvgTimeLabel = document.getElementById('metricAvgTimeLabel');
  if (metricAvgTimeLabel) metricAvgTimeLabel.textContent = lang.metrics.avgTime;

  const metricsCompletedTitle = document.getElementById('metricsCompletedTitle');
  if (metricsCompletedTitle) metricsCompletedTitle.textContent = lang.metrics.completedTasks;

  const metricsDistributionTitle = document.getElementById('metricsDistributionTitle');
  if (metricsDistributionTitle) metricsDistributionTitle.textContent = lang.metrics.distribution;

  const metricsDayBtn = document.getElementById('metricsDayBtn');
  if (metricsDayBtn) metricsDayBtn.textContent = lang.metrics.day;

  const metricsWeekBtn = document.getElementById('metricsWeekBtn');
  if (metricsWeekBtn) metricsWeekBtn.textContent = lang.metrics.week;

  const metricsMonthBtn = document.getElementById('metricsMonthBtn');
  if (metricsMonthBtn) metricsMonthBtn.textContent = lang.metrics.month;

  const metricsCancelBtn = document.getElementById('metricsCancelBtn');
  if (metricsCancelBtn) metricsCancelBtn.textContent = lang.metrics.close;
}

/**
 * Open Quick Add Modal for a specific segment
 * @param {number} segmentId - Segment ID (1-5)
 * @param {function} onAddTask - Callback when task is added
 * @param {object} translations - Translations object
 * @param {string} currentLanguage - Current language
 */
export function openQuickAddModal(segmentId, onAddTask, translations, currentLanguage) {
  const quickAddModal = document.getElementById('quickAddModal');
  const quickAddInput = document.getElementById('quickAddInput');
  const quickAddCategory = document.getElementById('quickAddCategory');
  const quickAddTitle = document.getElementById('quickAddTitle');
  const quickAddSubmitBtn = document.getElementById('quickAddSubmitBtn');
  const quickAddCancelBtn = document.getElementById('quickAddCancelBtn');
  const quickRecurringEnabled = document.getElementById('quickRecurringEnabled');
  const quickRecurringOptions = document.getElementById('quickRecurringOptions');
  const quickAddDueDate = document.getElementById('quickAddDueDate');
  const quickAddDueDateLabel = document.getElementById('quickAddDueDateLabel');

  if (!quickAddModal || !quickAddInput) {
    return;
  }

  // Reset modal
  quickAddInput.value = '';
  quickRecurringEnabled.checked = false;
  quickRecurringOptions.style.display = 'none';
  if (quickAddDueDate) {
    quickAddDueDate.value = '';
  }

  // Segment names
  const segmentNames = {
    1: { de: 'Do! (Wichtig & Dringend)', en: 'Do! (Important & Urgent)' },
    2: { de: 'Schedule! (Wichtig)', en: 'Schedule! (Important)' },
    3: { de: 'Delegate! (Dringend)', en: 'Delegate! (Urgent)' },
    4: { de: 'Ignore! (Weder/Noch)', en: 'Ignore! (Neither)' },
    5: { de: 'Done! (Erledigt)', en: 'Done! (Completed)' },
  };

  // Set category title
  const categoryName =
    segmentNames[segmentId]?.[currentLanguage] || segmentNames[segmentId]?.['en'] || 'Unknown';
  quickAddCategory.textContent = categoryName;

  // Update title and labels based on current language
  const lang = translations[currentLanguage];
  quickAddTitle.textContent = currentLanguage === 'de' ? 'Neue Aufgabe' : 'New Task';

  // Update input placeholder
  quickAddInput.placeholder = lang.taskInputPlaceholder;

  // Update due date label
  if (quickAddDueDateLabel) {
    quickAddDueDateLabel.textContent = lang.quickAddModal.dueDate;
  }

  // Update recurring label
  const quickRecurringEnableText = document.getElementById('quickRecurringEnableText');
  if (quickRecurringEnableText) {
    quickRecurringEnableText.textContent = lang.recurring.enableLabel;
  }

  // Update recurring interval labels
  const quickRecurringDaily = document.getElementById('quickRecurringDaily');
  const quickRecurringWeekly = document.getElementById('quickRecurringWeekly');
  const quickRecurringMonthly = document.getElementById('quickRecurringMonthly');
  if (quickRecurringDaily) quickRecurringDaily.textContent = lang.recurring.daily;
  if (quickRecurringWeekly) quickRecurringWeekly.textContent = lang.recurring.weekly;
  if (quickRecurringMonthly) quickRecurringMonthly.textContent = lang.recurring.monthly;

  // Show modal
  quickAddModal.style.display = 'flex';
  setTimeout(() => quickAddInput.focus(), 100);

  // Handle submit
  const handleSubmit = () => {
    const text = quickAddInput.value.trim();
    if (!text) return;

    // Get recurring config if enabled
    let recurringConfig = null;
    if (quickRecurringEnabled.checked) {
      const selectedType = document.querySelector(
        'input[name="quickRecurringType"]:checked'
      )?.value;
      recurringConfig = {
        enabled: true,
        interval: selectedType, // 'daily', 'weekly', 'monthly', 'custom'
      };

      if (selectedType === 'weekly') {
        const weekdays = Array.from(
          document.querySelectorAll('#quickWeekdaysContainer .weekday-check:checked')
        ).map((cb) => parseInt(cb.value));
        if (weekdays.length > 0) {
          recurringConfig.weekdays = weekdays;
        }
      } else if (selectedType === 'monthly') {
        const monthDay = parseInt(document.getElementById('quickMonthDay')?.value || 1);
        recurringConfig.dayOfMonth = monthDay;
      } else if (selectedType === 'custom') {
        const customDays = parseInt(document.getElementById('quickCustomDays')?.value || 1);
        recurringConfig.customDays = customDays;
      }
    }

    // Get due date if provided
    const dueDate = quickAddDueDate && quickAddDueDate.value ? quickAddDueDate.value : null;

    // Call callback
    if (onAddTask) {
      onAddTask(text, segmentId, recurringConfig, dueDate);
    }

    // Close modal
    quickAddModal.style.display = 'none';
  };

  // Remove old listeners and add new ones
  const newSubmitBtn = quickAddSubmitBtn.cloneNode(true);
  quickAddSubmitBtn.parentNode.replaceChild(newSubmitBtn, quickAddSubmitBtn);
  newSubmitBtn.textContent = lang.buttons.add;
  newSubmitBtn.addEventListener('click', handleSubmit);

  const newCancelBtn = quickAddCancelBtn.cloneNode(true);
  quickAddCancelBtn.parentNode.replaceChild(newCancelBtn, quickAddCancelBtn);
  newCancelBtn.textContent = lang.buttons.cancel;
  newCancelBtn.addEventListener('click', () => {
    quickAddModal.style.display = 'none';
  });

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  quickAddInput.removeEventListener('keypress', handleKeyPress);
  quickAddInput.addEventListener('keypress', handleKeyPress);
}

/**
 * Setup drop zones for all task lists (Drag & Drop 2.0)
 * @param {Function} onDrop - Callback when task is dropped (taskId, fromSegment, toSegment)
 */
export function setupDropZones(onDrop) {
  import('./drag-manager.js').then(({ setupDropZone }) => {
    const taskLists = document.querySelectorAll('.task-list');

    taskLists.forEach((taskList) => {
      const segment = parseInt(taskList.dataset.segment);

      setupDropZone(taskList, (data, dropZone) => {
        const toSegment = parseInt(dropZone.dataset.segment);
        const fromSegment = data.segment;

        if (toSegment && toSegment !== fromSegment) {
          onDrop(data.id, fromSegment, toSegment);
        }
      });
    });
  });
}

/**
 * Open edit recurring task modal
 * @param {object} task - Task to edit
 * @param {function} onSave - Callback when changes are saved
 * @param {object} translations - Translations object
 * @param {string} currentLanguage - Current language
 */
export function openEditRecurringModal(task, onSave, translations, currentLanguage) {
  const modal = document.getElementById('editRecurringModal');
  const taskNameElement = document.getElementById('editRecurringTaskName');
  const titleElement = document.getElementById('editRecurringTitle');
  const saveBtn = document.getElementById('editRecurringSaveBtn');
  const cancelBtn = document.getElementById('editRecurringCancelBtn');
  const disableRecurringCheckbox = document.getElementById('editDisableRecurring');
  const deleteTaskCheckbox = document.getElementById('editDeleteTask');

  if (!modal || !task.recurring) {
    return;
  }

  // Set task name and title
  const lang = translations[currentLanguage];
  taskNameElement.textContent = task.text;
  titleElement.textContent =
    currentLanguage === 'de' ? 'Wiederholung bearbeiten' : 'Edit Recurring Task';

  // Set current recurring type
  const recurringType = task.recurring.interval || 'daily';
  const recurringTypeRadio = document.querySelector(
    `input[name="editRecurringType"][value="${recurringType}"]`
  );
  if (recurringTypeRadio) {
    recurringTypeRadio.checked = true;
  }

  // Show/hide options based on type
  const weekdaysContainer = document.getElementById('editWeekdaysContainer');
  const monthDayContainer = document.getElementById('editMonthDayContainer');
  const customDaysContainer = document.getElementById('editCustomDaysContainer');

  weekdaysContainer.style.display = recurringType === 'weekly' ? 'flex' : 'none';
  monthDayContainer.style.display = recurringType === 'monthly' ? 'block' : 'none';
  customDaysContainer.style.display = recurringType === 'custom' ? 'block' : 'none';

  // Set weekdays if weekly
  if (recurringType === 'weekly' && task.recurring.weekdays) {
    document.querySelectorAll('.edit-weekday-check').forEach((cb) => {
      cb.checked = task.recurring.weekdays.includes(parseInt(cb.value));
    });
  }

  // Set month day if monthly
  if (recurringType === 'monthly' && task.recurring.dayOfMonth) {
    document.getElementById('editMonthDay').value = task.recurring.dayOfMonth;
  }

  // Set custom days if custom
  if (recurringType === 'custom' && task.recurring.customDays) {
    document.getElementById('editCustomDays').value = task.recurring.customDays;
  }

  // Reset checkboxes
  disableRecurringCheckbox.checked = false;
  deleteTaskCheckbox.checked = false;

  // Handle recurring type change
  const recurringTypeRadios = document.querySelectorAll('input[name="editRecurringType"]');
  recurringTypeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      weekdaysContainer.style.display = radio.value === 'weekly' ? 'flex' : 'none';
      monthDayContainer.style.display = radio.value === 'monthly' ? 'block' : 'none';
      customDaysContainer.style.display = radio.value === 'custom' ? 'block' : 'none';
    });
  });

  // Show modal
  modal.style.display = 'flex';

  // Handle save
  const handleSave = () => {
    const selectedType = document.querySelector('input[name="editRecurringType"]:checked').value;

    if (deleteTaskCheckbox.checked) {
      // Delete task permanently
      onSave(task.id, 'DELETE');
    } else if (disableRecurringCheckbox.checked) {
      // Remove recurring
      onSave(task.id, null);
    } else {
      // Update recurring config
      const newConfig = {
        enabled: true,
        interval: selectedType,
      };

      if (selectedType === 'weekly') {
        const checkedWeekdays = Array.from(
          document.querySelectorAll('.edit-weekday-check:checked')
        ).map((cb) => parseInt(cb.value));
        newConfig.weekdays = checkedWeekdays;
      } else if (selectedType === 'monthly') {
        newConfig.dayOfMonth = parseInt(document.getElementById('editMonthDay').value);
      } else if (selectedType === 'custom') {
        newConfig.customDays = parseInt(document.getElementById('editCustomDays').value);
      }

      onSave(task.id, newConfig);
    }

    modal.style.display = 'none';
  };

  // Handle cancel
  const handleCancel = () => {
    modal.style.display = 'none';
  };

  // Remove old listeners and add new ones
  const newSaveBtn = saveBtn.cloneNode(true);
  saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
  newSaveBtn.addEventListener('click', handleSave);

  const newCancelBtn = cancelBtn.cloneNode(true);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
  newCancelBtn.addEventListener('click', handleCancel);
}

/**
 * Open Tutorial modal
 * @param {string} currentLanguage - Current language
 */
export function openTutorialModal(currentLanguage = 'en') {
  const tutorialModal = document.getElementById('tutorialModal');
  if (!tutorialModal) return;

  // Update translations
  const lang = translations[currentLanguage].tutorial;
  const tutorialTitle = document.getElementById('tutorialTitle');
  const tutorialSkipBtn = document.getElementById('tutorialSkipBtn');
  const tutorialBackBtn = document.getElementById('tutorialBackBtn');
  const tutorialNextBtn = document.getElementById('tutorialNextBtn');
  const tutorialDontShowText = document.getElementById('tutorialDontShowText');

  if (tutorialTitle) tutorialTitle.textContent = lang.title;
  if (tutorialSkipBtn) tutorialSkipBtn.textContent = lang.skip;
  if (tutorialBackBtn) tutorialBackBtn.textContent = lang.back;
  if (tutorialNextBtn) tutorialNextBtn.textContent = lang.next;
  if (tutorialDontShowText) tutorialDontShowText.textContent = lang.dontShow;

  // Update slide texts
  const slide1Title = document.getElementById('tutorialSlide1Title');
  const slide1Text = document.getElementById('tutorialSlide1Text');
  const slide2Title = document.getElementById('tutorialSlide2Title');
  const slide2Text = document.getElementById('tutorialSlide2Text');
  const slide3Title = document.getElementById('tutorialSlide3Title');
  const slide3Text = document.getElementById('tutorialSlide3Text');

  if (slide1Title) slide1Title.textContent = lang.slide1.title;
  if (slide1Text) slide1Text.textContent = lang.slide1.text;
  if (slide2Title) slide2Title.textContent = lang.slide2.title;
  if (slide2Text) slide2Text.textContent = lang.slide2.text;
  if (slide3Title) slide3Title.textContent = lang.slide3.title;
  if (slide3Text) slide3Text.textContent = lang.slide3.text;

  // Initialize tutorial state
  let currentSlide = 1;
  const totalSlides = 3;

  const updateSlide = (slideNum) => {
    currentSlide = slideNum;

    // Update slides
    tutorialModal.querySelectorAll('.tutorial-slide').forEach((slide) => {
      slide.classList.remove('active');
      if (parseInt(slide.dataset.slide) === slideNum) {
        slide.classList.add('active');
      }
    });

    // Update dots
    tutorialModal.querySelectorAll('.tutorial-dot').forEach((dot) => {
      dot.classList.remove('active');
      const isActive = parseInt(dot.dataset.slide) === slideNum;
      if (isActive) {
        dot.classList.add('active');
      }
      // Update ARIA attribute for accessibility
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update buttons
    if (tutorialBackBtn) {
      tutorialBackBtn.disabled = slideNum === 1;
    }

    if (tutorialNextBtn) {
      if (slideNum === totalSlides) {
        tutorialNextBtn.textContent = lang.done;
      } else {
        tutorialNextBtn.textContent = lang.next;
      }
    }
  };

  // Setup event handlers
  const existingHandler = tutorialModal._clickHandler;
  if (existingHandler) {
    tutorialModal.removeEventListener('click', existingHandler);
  }

  const clickHandler = (e) => {
    const target = e.target;

    // Skip button
    if (target.closest('#tutorialSkipBtn')) {
      // User explicitly skipped the tutorial; mark as seen to avoid showing again
      localStorage.setItem('tutorialSeen', 'true');
      closeTutorialModal();
      return;
    }

    // Back button
    if (target.closest('#tutorialBackBtn')) {
      if (currentSlide > 1) {
        updateSlide(currentSlide - 1);
      }
      return;
    }

    // Next/Done button
    if (target.closest('#tutorialNextBtn')) {
      if (currentSlide < totalSlides) {
        updateSlide(currentSlide + 1);
      } else {
        // Save "don't show again" preference
        const dontShowAgain = document.getElementById('tutorialDontShowAgain');
        if (dontShowAgain && dontShowAgain.checked) {
          localStorage.setItem('tutorialSeen', 'true');
        }
        closeTutorialModal();
      }
      return;
    }

    // Dot navigation
    const dot = target.closest('.tutorial-dot');
    if (dot) {
      const slideNum = parseInt(dot.dataset.slide);
      updateSlide(slideNum);
      return;
    }
  };

  tutorialModal._clickHandler = clickHandler;
  tutorialModal.addEventListener('click', clickHandler);

  // Initialize first slide
  updateSlide(1);

  // Show modal
  tutorialModal.classList.remove('hidden');
  tutorialModal.classList.add('active');
  tutorialModal.style.display = 'flex';
}

/**
 * Close Tutorial modal
 */
export function closeTutorialModal() {
  const tutorialModal = document.getElementById('tutorialModal');
  if (tutorialModal) {
    tutorialModal.classList.remove('active');
    tutorialModal.classList.add('hidden');
    tutorialModal.style.display = 'none';
  }
}

/**
 * Check if tutorial should be shown (first time user)
 * @returns {boolean} True if tutorial should be shown
 */
export function shouldShowTutorial() {
  return !localStorage.getItem('tutorialSeen');
}
