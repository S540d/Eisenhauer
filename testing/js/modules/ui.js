/**
 * UI Module
 * Handles all UI rendering, modals, and user interactions
 */

import { COLORS, SEGMENTS } from './config.js';
import { getTasks, getRecurringDescription } from './tasks.js';
import { DragManager } from './drag-manager.js';
import { announceDragStart, announceDragEnd } from './accessibility.js';

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
        const recurringIndicator = document.createElement('span');
        recurringIndicator.className = 'recurring-indicator';
        recurringIndicator.textContent = ' ' + translations[currentLanguage].recurring.indicator;
        recurringIndicator.title = getRecurringDescription(task.recurring, translations[currentLanguage]);
        textSpan.appendChild(recurringIndicator);
    }

    content.appendChild(textSpan);

    // Add completion timestamp for Done! segment
    if (task.segment === SEGMENTS.DONE && task.completedAt) {
        const timestampSpan = document.createElement('span');
        timestampSpan.className = 'task-timestamp';
        const date = new Date(task.completedAt);
        const formattedDate = date.toLocaleDateString(currentLanguage === 'de' ? 'de-DE' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString(currentLanguage === 'de' ? 'de-DE' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        timestampSpan.textContent = `${formattedDate} ${formattedTime}`;
        content.appendChild(timestampSpan);
    }

    div.appendChild(checkbox);
    div.appendChild(content);

    // Add delete button for easy access (alternative to swipe)
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
    div.appendChild(deleteBtn);

    // Setup Drag & Drop 2.0 with DragManager
    if (callbacks.onDragEnd || callbacks.onSwipeDelete) {
        const dragManager = new DragManager({
            element: div,
            data: task,

            onDragStart: (event) => {
                console.log('[DragManager] Drag started:', task.id);
                div.classList.add('dragging');

                // Announce to screen readers
                announceDragStart(task.text);
            },

            onDragMove: (event) => {
                // Optional: Update UI during drag
            },

            onDragEnd: (event) => {
                console.log('[DragManager] Drag ended:', task.id, event.target);
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
                console.log('[DragManager] Swipe delete:', data);
                if (callbacks.onSwipeDelete) {
                    console.log('[UI] Calling onSwipeDelete callback with:', data.id, data.segment);
                    callbacks.onSwipeDelete(data.id, data.segment);
                } else {
                    console.warn('[UI] No onSwipeDelete callback provided!');
                }
            },

            enableSwipeDelete: true,
            longPressDelay: 300,
            swipeThreshold: 100
        });

        // Store reference for cleanup
        div._dragManager = dragManager;
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
    segmentTasks.forEach(task => {
        const taskElement = createTaskElement(task, translations, currentLanguage, callbacks);
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
    const customOptions = document.getElementById('customOptions');
    const segmentBtns = document.querySelectorAll('.segment-btn');

    if (!modal) {
        console.error('Modal #segmentModal not found!');
        return () => {};
    }

    console.log('Opening modal...');
    modal.classList.remove('hidden');
    modal.classList.add('active');
    modal.style.display = 'flex';

    // Reset recurring task options
    if (recurringEnabled) recurringEnabled.checked = false;
    if (recurringOptions) recurringOptions.style.display = 'none';
    if (recurringInterval) recurringInterval.value = 'daily';
    if (weeklyOptions) weeklyOptions.style.display = 'none';
    if (monthlyOptions) monthlyOptions.style.display = 'none';
    if (customOptions) customOptions.style.display = 'none';

    // Reset weekday checkboxes
    if (weeklyOptions) {
        const weekdayCheckboxes = weeklyOptions.querySelectorAll('input[type="checkbox"]');
        weekdayCheckboxes.forEach(cb => cb.checked = false);
    }

    // Setup segment buttons
    segmentBtns.forEach(btn => {
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
        console.log('Closing modal...');
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
    segmentBtns.forEach(btn => {
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
        interval: recurringInterval ? recurringInterval.value : 'daily'
    };

    // Get interval-specific configuration
    switch(config.interval) {
        case 'weekly':
            if (weeklyOptions) {
                const weekdayCheckboxes = weeklyOptions.querySelectorAll('input[type="checkbox"]:checked');
                config.weekdays = Array.from(weekdayCheckboxes).map(cb => parseInt(cb.value));
            }
            break;
        case 'monthly':
            const dayOfMonth = document.getElementById('dayOfMonth');
            if (dayOfMonth) {
                config.dayOfMonth = parseInt(dayOfMonth.value);
            }
            break;
        case 'custom':
            const customDays = document.getElementById('customDays');
            if (customDays) {
                config.customDays = parseInt(customDays.value);
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
export function openSettingsModal(currentUser, version, buildDate, isGuestMode = false) {
    const settingsModal = document.getElementById('settingsModal');
    const settingsUserInfo = document.getElementById('settingsUserInfo');
    const settingsVersion = document.getElementById('settingsVersion');

    if (!settingsModal) {
        console.error('Settings modal not found!');
        return;
    }

    console.log('Opening settings modal...');

    if (settingsUserInfo) {
        if (currentUser) {
            settingsUserInfo.textContent = `Angemeldet als: ${currentUser.email}`;
        } else {
            settingsUserInfo.textContent = 'Nicht angemeldet (Lokaler Modus)';
        }
    }

    if (settingsVersion) {
        settingsVersion.textContent = `Version ${version} (${buildDate})`;
    }

    // Setup logout button event listener each time modal opens
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        console.log('Setting up logout button listener...');
        // Remove old listener by cloning
        const newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);

        // Add new listener
        newLogoutBtn.addEventListener('click', async () => {
            console.log('Logout button clicked in modal, isGuestMode:', isGuestMode);

            // Close modal first
            closeSettingsModal();

            if (isGuestMode) {
                // Guest mode: Clear data and show login directly
                console.log('Guest mode logout - clearing data and showing login');
                if (typeof window.localforage !== 'undefined') {
                    await window.localforage.removeItem('guestMode');
                    await window.localforage.removeItem('eisenhauerTasks');
                }
                // Show login screen directly
                if (typeof window.showLogin === 'function') {
                    window.showLogin();
                } else {
                    document.getElementById('loginScreen').style.display = 'flex';
                    document.getElementById('appScreen').style.display = 'none';
                }
            } else {
                // Firebase user: Use signOut function
                if (typeof window.signOut === 'function') {
                    console.log('Firebase user logout - calling window.signOut()');
                    await window.signOut();
                } else {
                    console.error('window.signOut is not available!');
                }
            }
        });
    } else {
        console.error('Logout button not found!');
    }

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
        console.log('Closing settings modal...');
        settingsModal.classList.remove('active');
        settingsModal.classList.add('hidden');
        settingsModal.style.display = 'none';
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
        console.log('Setting up metrics cancel button listener...');
        // Remove old listener by cloning
        const newCancelBtn = metricsCancelBtn.cloneNode(true);
        metricsCancelBtn.parentNode.replaceChild(newCancelBtn, metricsCancelBtn);

        // Add new listener
        newCancelBtn.addEventListener('click', () => {
            console.log('Metrics cancel button clicked');
            closeMetricsModal();
        });
    } else {
        console.error('Metrics cancel button not found!');
    }
}

/**
 * Close metrics modal
 */
export function closeMetricsModal() {
    const metricsModal = document.getElementById('metricsModal');
    if (metricsModal) {
        console.log('Closing metrics modal...');
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
        const customOption = recurringInterval.querySelector('option[value="custom"]');

        if (dailyOption) dailyOption.textContent = lang.recurring.daily;
        if (weeklyOption) weeklyOption.textContent = lang.recurring.weekly;
        if (monthlyOption) monthlyOption.textContent = lang.recurring.monthly;
        if (customOption) customOption.textContent = lang.recurring.custom;
    }

    // Update weekday labels
    const weekdayMap = {
        'weekday-monday': 'monday',
        'weekday-tuesday': 'tuesday',
        'weekday-wednesday': 'wednesday',
        'weekday-thursday': 'thursday',
        'weekday-friday': 'friday',
        'weekday-saturday': 'saturday',
        'weekday-sunday': 'sunday'
    };

    Object.entries(weekdayMap).forEach(([id, key]) => {
        const elem = document.getElementById(id);
        if (elem && lang.recurring.weekdays[key]) {
            elem.textContent = currentLanguage === 'de'
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
            const hintText = currentLanguage === 'de'
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

    if (!quickAddModal || !quickAddInput) {
        console.error('Quick Add Modal elements not found!');
        return;
    }

    // Reset modal
    quickAddInput.value = '';
    quickRecurringEnabled.checked = false;
    quickRecurringOptions.style.display = 'none';

    // Segment names
    const segmentNames = {
        1: { de: 'Do! (Wichtig & Dringend)', en: 'Do! (Important & Urgent)' },
        2: { de: 'Schedule! (Wichtig)', en: 'Schedule! (Important)' },
        3: { de: 'Delegate! (Dringend)', en: 'Delegate! (Urgent)' },
        4: { de: 'Ignore! (Weder/Noch)', en: 'Ignore! (Neither)' },
        5: { de: 'Done! (Erledigt)', en: 'Done! (Completed)' }
    };

    // Set category title
    const categoryName = segmentNames[segmentId]?.[currentLanguage] || segmentNames[segmentId]?.['en'] || 'Unknown';
    quickAddCategory.textContent = categoryName;

    // Update title
    quickAddTitle.textContent = currentLanguage === 'de' ? 'Neue Aufgabe' : 'New Task';

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
            const selectedType = document.querySelector('input[name="quickRecurringType"]:checked')?.value;
            recurringConfig = { type: selectedType };

            if (selectedType === 'weekly') {
                const weekdays = Array.from(document.querySelectorAll('#quickWeekdaysContainer .weekday-check:checked'))
                    .map(cb => parseInt(cb.value));
                if (weekdays.length > 0) {
                    recurringConfig.weekdays = weekdays;
                }
            } else if (selectedType === 'monthly') {
                const monthDay = parseInt(document.getElementById('quickMonthDay')?.value || 1);
                recurringConfig.dayOfMonth = monthDay;
            } else if (selectedType === 'custom') {
                const customDays = parseInt(document.getElementById('quickCustomDays')?.value || 1);
                recurringConfig.interval = customDays;
            }
        }

        // Call callback
        if (onAddTask) {
            onAddTask(text, segmentId, recurringConfig);
        }

        // Close modal
        quickAddModal.style.display = 'none';
    };

    // Remove old listeners and add new ones
    const newSubmitBtn = quickAddSubmitBtn.cloneNode(true);
    quickAddSubmitBtn.parentNode.replaceChild(newSubmitBtn, quickAddSubmitBtn);
    newSubmitBtn.addEventListener('click', handleSubmit);

    const newCancelBtn = quickAddCancelBtn.cloneNode(true);
    quickAddCancelBtn.parentNode.replaceChild(newCancelBtn, quickAddCancelBtn);
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

        taskLists.forEach(taskList => {
            const segment = parseInt(taskList.dataset.segment);

            setupDropZone(taskList, (data, dropZone) => {
                const toSegment = parseInt(dropZone.dataset.segment);
                const fromSegment = data.segment;

                if (toSegment && toSegment !== fromSegment) {
                    console.log('[DropZone] Task dropped:', data.id, fromSegment, '→', toSegment);
                    onDrop(data.id, fromSegment, toSegment);
                }
            });
        });

        console.log('[DropZones] Setup complete for', taskLists.length, 'task lists');
    });
}
