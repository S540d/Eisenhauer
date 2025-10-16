/**
 * @fileoverview Toast Notification System
 * @module notifications
 * @description
 * User-friendly toast notifications for feedback, errors, and information.
 * Supports different types, actions, and auto-dismiss.
 *
 * Features:
 * - Toast notifications (success, error, warning, info)
 * - Action buttons
 * - Auto-dismiss with configurable duration
 * - Queue management
 * - Accessibility (ARIA attributes)
 *
 * @version 2.0.0
 * @since 2025-10-16
 */

/**
 * @typedef {Object} NotificationAction
 * @property {string} label - Button label
 * @property {Function|null} onClick - Click handler (null for dismiss)
 */

/**
 * @typedef {Object} NotificationOptions
 * @property {'success'|'error'|'warning'|'info'} type - Notification type
 * @property {string} message - Notification message
 * @property {Array<NotificationAction>} [actions] - Action buttons
 * @property {number} [duration=5000] - Auto-dismiss duration (0 = no auto-dismiss)
 * @property {boolean} [closable=true] - Show close button
 */

/**
 * Active notifications queue
 */
const activeNotifications = [];

/**
 * Maximum concurrent notifications
 */
const MAX_NOTIFICATIONS = 3;

/**
 * Notification container element
 */
let notificationContainer = null;

/**
 * Initialize notification system
 */
function initNotifications() {
  if (notificationContainer) return;

  // Create container
  notificationContainer = document.createElement('div');
  notificationContainer.id = 'notification-container';
  notificationContainer.className = 'notification-container';
  notificationContainer.setAttribute('role', 'region');
  notificationContainer.setAttribute('aria-label', 'Benachrichtigungen');
  notificationContainer.setAttribute('aria-live', 'polite');

  document.body.appendChild(notificationContainer);

  // Add styles
  injectStyles();
}

/**
 * Show notification
 * @param {NotificationOptions} options - Notification options
 * @returns {string} Notification ID
 */
export function showNotification(options) {
  // Initialize if not done yet
  initNotifications();

  // Validate options
  if (!options.message) {
    console.error('[Notifications] Message is required');
    return null;
  }

  const {
    type = 'info',
    message,
    actions = [],
    duration = 5000,
    closable = true
  } = options;

  // Generate unique ID
  const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Create notification element
  const notification = createNotificationElement(id, type, message, actions, closable);

  // Add to container
  notificationContainer.appendChild(notification);

  // Track active notification
  activeNotifications.push({ id, element: notification, dismissTimer: null });

  // Remove oldest if exceeding max
  if (activeNotifications.length > MAX_NOTIFICATIONS) {
    const oldest = activeNotifications.shift();
    dismissNotification(oldest.id, true);
  }

  // Trigger enter animation
  // Use setTimeout instead of requestAnimationFrame for test compatibility
  const animationDelay = typeof window !== 'undefined' && window.requestAnimationFrame ? 0 : 0;
  setTimeout(() => {
    notification.classList.add('notification-show');
  }, animationDelay);

  // Auto-dismiss
  if (duration > 0) {
    const dismissTimer = setTimeout(() => {
      dismissNotification(id);
    }, duration);

    // Store timer reference
    const notif = activeNotifications.find(n => n.id === id);
    if (notif) {
      notif.dismissTimer = dismissTimer;
    }
  }

  return id;
}

/**
 * Dismiss notification
 * @param {string} id - Notification ID
 * @param {boolean} [immediate=false] - Skip animation
 */
export function dismissNotification(id, immediate = false) {
  const index = activeNotifications.findIndex(n => n.id === id);
  if (index === -1) return;

  const { element, dismissTimer } = activeNotifications[index];

  // Clear auto-dismiss timer
  if (dismissTimer) {
    clearTimeout(dismissTimer);
  }

  // Remove from tracking
  activeNotifications.splice(index, 1);

  if (immediate) {
    element.remove();
  } else {
    // Trigger exit animation
    element.classList.remove('notification-show');
    element.classList.add('notification-hide');

    setTimeout(() => {
      element.remove();
    }, 300); // Match animation duration
  }
}

/**
 * Dismiss all notifications
 */
export function dismissAll() {
  [...activeNotifications].forEach(({ id }) => {
    dismissNotification(id);
  });
}

/**
 * Show success notification
 * @param {string} message - Success message
 * @param {number} [duration=3000] - Duration
 * @returns {string} Notification ID
 */
export function showSuccess(message, duration = 3000) {
  return showNotification({
    type: 'success',
    message,
    duration
  });
}

/**
 * Show error notification
 * @param {string} message - Error message
 * @param {Object} [options] - Additional options
 * @returns {string} Notification ID
 */
export function showError(message, options = {}) {
  return showNotification({
    type: 'error',
    message,
    duration: 5000,
    ...options
  });
}

/**
 * Show warning notification
 * @param {string} message - Warning message
 * @param {Object} [options] - Additional options
 * @returns {string} Notification ID
 */
export function showWarning(message, options = {}) {
  return showNotification({
    type: 'warning',
    message,
    duration: 4000,
    ...options
  });
}

/**
 * Show info notification
 * @param {string} message - Info message
 * @param {number} [duration=3000] - Duration
 * @returns {string} Notification ID
 */
export function showInfo(message, duration = 3000) {
  return showNotification({
    type: 'info',
    message,
    duration
  });
}

/**
 * Create notification DOM element
 * @private
 * @param {string} id - Notification ID
 * @param {string} type - Notification type
 * @param {string} message - Message
 * @param {Array<NotificationAction>} actions - Actions
 * @param {boolean} closable - Show close button
 * @returns {HTMLElement}
 */
function createNotificationElement(id, type, message, actions, closable) {
  const notification = document.createElement('div');
  notification.id = id;
  notification.className = `notification notification-${type}`;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'assertive');

  // Icon
  const icon = document.createElement('span');
  icon.className = 'notification-icon';
  icon.innerHTML = getIconForType(type);
  notification.appendChild(icon);

  // Content
  const content = document.createElement('div');
  content.className = 'notification-content';

  const messageEl = document.createElement('p');
  messageEl.className = 'notification-message';
  messageEl.textContent = message;
  content.appendChild(messageEl);

  // Actions
  if (actions.length > 0) {
    const actionsEl = document.createElement('div');
    actionsEl.className = 'notification-actions';

    actions.forEach(action => {
      const button = document.createElement('button');
      button.className = 'notification-action-btn';
      button.textContent = action.label;
      button.type = 'button';

      button.addEventListener('click', () => {
        if (action.onClick) {
          action.onClick();
        }
        dismissNotification(id);
      });

      actionsEl.appendChild(button);
    });

    content.appendChild(actionsEl);
  }

  notification.appendChild(content);

  // Close button
  if (closable) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Schließen');
    closeBtn.innerHTML = '&times;';

    closeBtn.addEventListener('click', () => {
      dismissNotification(id);
    });

    notification.appendChild(closeBtn);
  }

  return notification;
}

/**
 * Get icon HTML for notification type
 * @private
 * @param {string} type - Notification type
 * @returns {string}
 */
function getIconForType(type) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return icons[type] || icons.info;
}

/**
 * Inject notification styles
 * @private
 */
function injectStyles() {
  // Check if styles already injected
  if (document.getElementById('notification-styles')) return;

  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
      pointer-events: none;
    }

    .notification {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-left: 4px solid;
      pointer-events: auto;
      transform: translateX(calc(100% + 20px));
      opacity: 0;
      transition: all 0.3s ease;
    }

    .notification-show {
      transform: translateX(0);
      opacity: 1;
    }

    .notification-hide {
      transform: translateX(calc(100% + 20px));
      opacity: 0;
    }

    .notification-success {
      border-left-color: #10b981;
    }

    .notification-error {
      border-left-color: #ef4444;
    }

    .notification-warning {
      border-left-color: #f59e0b;
    }

    .notification-info {
      border-left-color: #3b82f6;
    }

    .notification-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
      border-radius: 50%;
      color: white;
    }

    .notification-success .notification-icon {
      background: #10b981;
    }

    .notification-error .notification-icon {
      background: #ef4444;
    }

    .notification-warning .notification-icon {
      background: #f59e0b;
    }

    .notification-info .notification-icon {
      background: #3b82f6;
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-message {
      margin: 0 0 8px 0;
      font-size: 14px;
      line-height: 1.5;
      color: #1f2937;
      word-wrap: break-word;
    }

    .notification-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }

    .notification-action-btn {
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #f3f4f6;
      color: #374151;
      transition: background 0.2s;
    }

    .notification-action-btn:hover {
      background: #e5e7eb;
    }

    .notification-action-btn:active {
      background: #d1d5db;
    }

    .notification-close {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      padding: 0;
      border: none;
      background: transparent;
      color: #6b7280;
      font-size: 24px;
      line-height: 1;
      cursor: pointer;
      transition: color 0.2s;
    }

    .notification-close:hover {
      color: #1f2937;
    }

    /* Mobile adjustments */
    @media (max-width: 640px) {
      .notification-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }

      .notification {
        padding: 12px;
      }

      .notification-message {
        font-size: 13px;
      }
    }

    /* Dark theme support */
    @media (prefers-color-scheme: dark) {
      .notification {
        background: #1f2937;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .notification-message {
        color: #f3f4f6;
      }

      .notification-action-btn {
        background: #374151;
        color: #f3f4f6;
      }

      .notification-action-btn:hover {
        background: #4b5563;
      }

      .notification-close {
        color: #9ca3af;
      }

      .notification-close:hover {
        color: #f3f4f6;
      }
    }
  `;

  document.head.appendChild(style);
}

/**
 * Get count of active notifications
 * @returns {number}
 */
export function getActiveCount() {
  return activeNotifications.length;
}

/**
 * Check if notification is active
 * @param {string} id - Notification ID
 * @returns {boolean}
 */
export function isActive(id) {
  return activeNotifications.some(n => n.id === id);
}
