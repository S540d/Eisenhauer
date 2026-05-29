/**
 * Custom Service Worker — Eisenhauer Matrix
 * Handles precaching (via Workbox injectManifest) + local reminder notifications.
 *
 * Scheduling strategy:
 *  - Chrome/Edge (Desktop + Android): TimestampTrigger API for OS-level scheduling
 *  - iOS / Firefox (fallback): Check on app-open and fire overdue notifications then
 */

// Injected by Vite PWA plugin at build time (injectManifest strategy)
// Workbox APIs (precacheAndRoute, registerRoute, etc.) are bundled by the build —
// do NOT add importScripts() for workbox-sw.js here.
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { createHandlerBoundToURL } from 'workbox-precaching';

// Precache all assets listed in the injected manifest
precacheAndRoute(self.__WB_MANIFEST || []);
cleanupOutdatedCaches();

// SPA fallback: all navigation requests → index.html
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));

// Activate immediately, claim all clients
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clean up old caches from generateSW era
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name.startsWith('eisenhauer-'))
          .map((name) => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

// ---------------------------------------------------------------------------
// Reminder storage — in-memory only; lost on SW restart (browsers terminate SWs
// after a few seconds of inactivity). TimestampTrigger schedules are also lost.
// Recovery path: the app sends SCHEDULE_REMINDERS on every open, so schedules
// are restored within one app-open cycle. This is an accepted tradeoff over
// persisting tasks in IndexedDB inside the SW.
// ---------------------------------------------------------------------------
let reminderTasks = [];
let reminderDaysBefore = null;

// ---------------------------------------------------------------------------
// Message handler — app sends task list + settings on each open / task change
// ---------------------------------------------------------------------------
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SCHEDULE_REMINDERS') {
    reminderTasks = event.data.tasks || [];
    reminderDaysBefore = event.data.daysBefore;
    checkAndFireReminders();
  }

  if (event.data.type === 'CANCEL_REMINDERS') {
    reminderTasks = [];
    reminderDaysBefore = null;
    cancelScheduledNotifications();
  }
});

// ---------------------------------------------------------------------------
// TimestampTrigger scheduling (Chrome/Edge Desktop + Android)
// ---------------------------------------------------------------------------
async function scheduleWithTimestampTrigger(task, triggerAt) {
  if (!('showTrigger' in Notification.prototype)) return false;

  const tag = `reminder-${task.id}`;

  try {
    // Cancel existing notification for this task first
    const existing = await self.registration.getNotifications({ tag });
    existing.forEach((n) => n.close());

    await self.registration.showNotification('Eisenhauer', {
      tag,
      body: task.notificationBody,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      data: { taskId: task.id },
      showTrigger: new TimestampTrigger(triggerAt),
    });
  } catch (_e) {
    // Notification scheduling failed (e.g. permission revoked mid-session)
    return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// On-open fallback (iOS / Firefox): fire immediately if overdue
// ---------------------------------------------------------------------------
async function fireImmediateNotification(task) {
  const tag = `reminder-${task.id}`;

  try {
    // Check if already shown (tag still active = already shown)
    const existing = await self.registration.getNotifications({ tag });
    if (existing.length > 0) return;

    await self.registration.showNotification('Eisenhauer', {
      tag,
      body: task.notificationBody,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      data: { taskId: task.id },
    });
  } catch (_e) {
    // Notification failed — permission may have been revoked
  }
}

// ---------------------------------------------------------------------------
// Main logic: compute trigger time, schedule or fire
// ---------------------------------------------------------------------------
async function checkAndFireReminders() {
  if (reminderDaysBefore === null || !reminderTasks.length) return;

  const now = new Date();

  for (const task of reminderTasks) {
    if (!task.dueDate) continue;

    // Parse dueDate as local calendar date (YYYY-MM-DD or timestamp)
    const due = parseDueDate(task.dueDate);
    if (!due) continue;

    // Reminder fires at 09:00 local time on (dueDate - daysBefore)
    const reminderDay = new Date(due);
    reminderDay.setDate(reminderDay.getDate() - reminderDaysBefore);
    reminderDay.setHours(9, 0, 0, 0);

    const triggerAt = reminderDay.getTime();

    // Already in the past → skip (or fire on-open if overdue today)
    if (triggerAt < now.getTime()) {
      // Only fire on-open if reminder day is today (not days ago)
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      const reminderDayStart = new Date(reminderDay);
      reminderDayStart.setHours(0, 0, 0, 0);

      if (reminderDayStart.getTime() === todayStart.getTime() && now.getHours() >= 9) {
        await fireImmediateNotification(task);
      }
      continue;
    }

    // Future → try TimestampTrigger, otherwise nothing (will fire on-open when the day comes)
    await scheduleWithTimestampTrigger(task, triggerAt);
  }
}

// ---------------------------------------------------------------------------
// Cancel all scheduled reminder notifications
// ---------------------------------------------------------------------------
async function cancelScheduledNotifications() {
  const notifications = await self.registration.getNotifications();
  notifications.filter((n) => n.tag && n.tag.startsWith('reminder-')).forEach((n) => n.close());
}

// ---------------------------------------------------------------------------
// Notification click → focus or open the app
// ---------------------------------------------------------------------------
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return self.clients.openWindow('./');
    })
  );
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parseDueDate(dueDate) {
  if (!dueDate) return null;

  // ISO date string YYYY-MM-DD → parse as local date
  if (typeof dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    const [year, month, day] = dueDate.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // Timestamp (number or numeric string)
  const ts = Number(dueDate);
  if (!isNaN(ts)) {
    const d = new Date(ts);
    // Normalize to local calendar date (strip time)
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  return null;
}
