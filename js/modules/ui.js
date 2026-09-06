/**
 * UI Module
 * Handles online/sync status and language updates; re-exports the split-out
 * rendering and modal modules (Issue #442) so existing call sites keep
 * importing everything from a single './ui.js'.
 */

export * from './ui-render.js';
export * from './ui-modals-task.js';
export * from './ui-modals-settings.js';

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

  const matrixStatsTitle = document.getElementById('matrixStatsTitle');
  if (matrixStatsTitle && lang.metrics.matrixStats) {
    matrixStatsTitle.textContent = lang.metrics.matrixStats;
  }
}
