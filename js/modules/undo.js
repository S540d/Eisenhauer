/**
 * Undo Module
 * Handles undo functionality for task operations (delete, move, complete)
 */

import { restoreTask, toggleTask } from './tasks.js';
import { translations } from './translations.js';

/**
 * Undo stack to store recent operations
 * @type {Array<{type: string, data: object, timestamp: number}>}
 */
const undoStack = [];
const MAX_UNDO_STACK_SIZE = 10;
const UNDO_TIMEOUT = 5000; // 5 seconds

let currentToast = null;
let undoTimer = null;

/**
 * Action types
 */
export const UNDO_ACTIONS = {
  DELETE: 'delete',
  TOGGLE: 'toggle',
};

/**
 * Push operation to undo stack
 * @param {string} type - Action type
 * @param {object} data - Action data
 */
function pushUndoStack(type, data) {
  undoStack.push({
    type,
    data: { ...data },
    timestamp: Date.now(),
  });

  // Limit stack size
  if (undoStack.length > MAX_UNDO_STACK_SIZE) {
    undoStack.shift();
  }
}

/**
 * Create toast notification element
 * @param {string} message - Toast message
 * @param {Function} onUndo - Undo callback
 * @param {string} currentLanguage - Current language
 * @returns {HTMLElement} Toast element
 */
function createToast(message, onUndo, currentLanguage = 'en') {
  const toast = document.createElement('div');
  toast.className = 'undo-toast';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');

  const messageSpan = document.createElement('span');
  messageSpan.className = 'undo-toast-message';
  messageSpan.textContent = message;

  const undoBtn = document.createElement('button');
  undoBtn.className = 'undo-toast-btn';
  undoBtn.textContent =
    currentLanguage === 'de' ? translations.de.undo.button : translations.en.undo.button;
  undoBtn.setAttribute('aria-label', 'Undo last action');

  undoBtn.addEventListener('click', () => {
    onUndo();
    hideToast();
  });

  toast.appendChild(messageSpan);
  toast.appendChild(undoBtn);

  return toast;
}

/**
 * Show toast notification
 * @param {HTMLElement} toast - Toast element
 */
function showToast(toast) {
  // Hide previous toast if exists
  if (currentToast) {
    hideToast();
  }

  // Clear previous timer
  if (undoTimer) {
    clearTimeout(undoTimer);
  }

  // Add to DOM
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  currentToast = toast;

  // Auto-hide after timeout
  undoTimer = setTimeout(() => {
    hideToast();
  }, UNDO_TIMEOUT);
}

/**
 * Hide current toast
 */
function hideToast() {
  if (currentToast) {
    currentToast.classList.remove('show');

    setTimeout(() => {
      if (currentToast && currentToast.parentNode) {
        currentToast.parentNode.removeChild(currentToast);
      }
      currentToast = null;
    }, 300); // Wait for fade-out animation
  }

  if (undoTimer) {
    clearTimeout(undoTimer);
    undoTimer = null;
  }
}

/**
 * Show undo notification for delete action
 * @param {object} task - Deleted task
 * @param {string} currentLanguage - Current language
 * @param {Function} onSuccess - Success callback after undo
 */
export function showUndoDelete(task, currentLanguage = 'en', onSuccess) {
  const message =
    currentLanguage === 'de' ? translations.de.undo.taskDeleted : translations.en.undo.taskDeleted;

  pushUndoStack(UNDO_ACTIONS.DELETE, {
    task: { ...task },
  });

  const toast = createToast(
    message,
    () => {
      // Restore task with all original properties
      restoreTask(task);
      if (onSuccess) {
        onSuccess();
      }
    },
    currentLanguage
  );

  showToast(toast);
}

/**
 * Show undo notification for toggle (complete) action
 * @param {string} taskId - Task ID
 * @param {number} segment - Segment ID
 * @param {boolean} wasChecked - Previous checked state
 * @param {string} currentLanguage - Current language
 * @param {Function} onSuccess - Success callback after undo
 */
export function showUndoToggle(taskId, segment, wasChecked, currentLanguage = 'en', onSuccess) {
  const message = wasChecked
    ? currentLanguage === 'de'
      ? translations.de.undo.taskUncompleted
      : translations.en.undo.taskUncompleted
    : currentLanguage === 'de'
      ? translations.de.undo.taskCompleted
      : translations.en.undo.taskCompleted;

  pushUndoStack(UNDO_ACTIONS.TOGGLE, {
    taskId,
    segment,
    wasChecked,
  });

  const toast = createToast(
    message,
    () => {
      // Toggle back
      toggleTask(taskId, segment);
      if (onSuccess) {
        onSuccess();
      }
    },
    currentLanguage
  );

  showToast(toast);
}

/**
 * Clear undo stack
 */
export function clearUndoStack() {
  undoStack.length = 0;
  hideToast();
}
