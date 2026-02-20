/**
 * Reminder Module — Web Push Notifications for due tasks
 *
 * Strategy:
 *  - Chrome/Edge (Desktop + Android): TimestampTrigger for OS-level scheduling
 *  - iOS / Firefox: on-open check fires overdue notifications immediately
 *
 * Permission is only requested when the user explicitly enables reminders in Settings.
 */

const STORAGE_KEY_ENABLED = 'remindersEnabled';
const STORAGE_KEY_DAYS = 'reminderDaysBefore';

/**
 * Check if the Notification API and Service Worker are available
 * @returns {boolean}
 */
export function isSupported() {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Request notification permission from the browser.
 * Only call this when the user explicitly opts in.
 * @returns {Promise<'granted'|'denied'|'default'>}
 */
export async function requestPermission() {
  if (!isSupported()) return 'denied';
  return await Notification.requestPermission();
}

/**
 * Check current permission state without prompting.
 * @returns {'granted'|'denied'|'default'}
 */
export function getPermission() {
  if (!isSupported()) return 'denied';
  return Notification.permission;
}

/**
 * Load reminder settings from localStorage.
 * @returns {{ enabled: boolean, daysBefore: number|null }}
 */
export function loadReminderSettings() {
  const enabled = localStorage.getItem(STORAGE_KEY_ENABLED) === 'true';
  const raw = localStorage.getItem(STORAGE_KEY_DAYS);
  const daysBefore = raw !== null ? Number(raw) : null;
  return { enabled, daysBefore };
}

/**
 * Save reminder settings to localStorage.
 * @param {boolean} enabled
 * @param {number|null} daysBefore
 */
export function saveReminderSettings(enabled, daysBefore) {
  localStorage.setItem(STORAGE_KEY_ENABLED, String(enabled));
  if (daysBefore !== null) {
    localStorage.setItem(STORAGE_KEY_DAYS, String(daysBefore));
  } else {
    localStorage.removeItem(STORAGE_KEY_DAYS);
  }
}

/**
 * Send the task list to the Service Worker for scheduling.
 * Tasks are pre-formatted with a notificationBody string.
 *
 * @param {object} allTasks - Tasks object keyed by segment { 1: [], 2: [], ... }
 * @param {number} daysBefore - Days before due date to remind (0–3)
 * @param {string} lang - Current UI language ('de'|'en')
 */
export async function scheduleReminders(allTasks, daysBefore, lang) {
  if (!isSupported()) return;
  if (Notification.permission !== 'granted') return;

  const sw = await getServiceWorker();
  if (!sw) return;

  // Flatten all tasks from all segments (exclude done segment 5)
  const tasks = Object.entries(allTasks)
    .filter(([seg]) => seg !== '5')
    .flatMap(([, segTasks]) => segTasks)
    .filter((t) => t.dueDate && !t.checked)
    .map((t) => ({
      id: t.id,
      dueDate: t.dueDate,
      notificationBody: formatNotificationBody(t, lang),
    }));

  sw.postMessage({ type: 'SCHEDULE_REMINDERS', tasks, daysBefore });
}

/**
 * Tell the Service Worker to cancel all scheduled reminders.
 */
export async function cancelReminders() {
  if (!isSupported()) return;

  const sw = await getServiceWorker();
  if (!sw) return;

  sw.postMessage({ type: 'CANCEL_REMINDERS' });
}

/**
 * Sync permission state with stored settings.
 * Call on app open to detect if the user revoked permission in browser settings.
 * Returns true if reminders are still active, false if permission was revoked.
 * @returns {boolean}
 */
export function syncPermissionState() {
  const { enabled } = loadReminderSettings();
  if (!enabled) return false;

  if (getPermission() !== 'granted') {
    // Permission was revoked externally — disable reminders silently
    saveReminderSettings(false, null);
    return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getServiceWorker() {
  try {
    const reg = await navigator.serviceWorker.ready;
    return reg.active;
  } catch (_e) {
    return null;
  }
}

function formatNotificationBody(task, lang) {
  const dateStr = formatDueDate(task.dueDate, lang);
  if (lang === 'de') {
    return `${task.text} ist fällig am ${dateStr}`;
  }
  return `${task.text} is due ${dateStr}`;
}

function formatDueDate(dueDate, lang) {
  try {
    let date;
    if (typeof dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      const [y, m, d] = dueDate.split('-').map(Number);
      date = new Date(y, m - 1, d);
    } else {
      const ts = Number(dueDate);
      date = new Date(ts);
    }
    return date.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', {
      day: 'numeric',
      month: 'long',
    });
  } catch (_e) {
    return String(dueDate);
  }
}
