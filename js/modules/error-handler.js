/**
 * @fileoverview Error Handling & Recovery
 * @module error-handler
 * @description
 * Centralized error handling with user-friendly messages and recovery options.
 * Provides error boundaries for drag & drop operations.
 *
 * Features:
 * - Structured error handling
 * - User-friendly error messages
 * - Recovery mechanisms (rollback, retry)
 * - Error logging and tracking
 *
 * @version 2.0.0
 * @since 2025-10-16
 */

/**
 * @typedef {Object} ErrorContext
 * @property {string} operation - Operation that failed (e.g., 'moveTask', 'addTask')
 * @property {Object} [data] - Relevant data for debugging
 * @property {Function} [rollback] - Rollback function to undo changes
 * @property {Function} [retry] - Retry function to attempt operation again
 * @property {boolean} [silent=false] - Don't show user notification
 */

/**
 * Custom Error Classes
 */

/**
 * Base error for drag & drop operations
 */
export class DragDropError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'DragDropError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Error during task movement
 */
export class TaskMoveError extends DragDropError {
  constructor(message, details = {}) {
    super(message, 'TASK_MOVE_ERROR', details);
    this.name = 'TaskMoveError';
  }
}

/**
 * Error during storage operations
 */
export class StorageError extends DragDropError {
  constructor(message, details = {}) {
    super(message, 'STORAGE_ERROR', details);
    this.name = 'StorageError';
  }
}

/**
 * Error during network operations
 */
export class NetworkError extends DragDropError {
  constructor(message, details = {}) {
    super(message, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
  }
}

/**
 * Error during sync operations
 */
export class SyncError extends DragDropError {
  constructor(message, details = {}) {
    super(message, 'SYNC_ERROR', details);
    this.name = 'SyncError';
  }
}

/**
 * Error Handler Class
 */
export class ErrorHandler {
  /**
   * Error history for debugging
   * @private
   */
  static errorHistory = [];

  /**
   * Maximum error history size
   * @private
   */
  static MAX_HISTORY = 50;

  /**
   * Handle drag & drop errors
   * @param {Error} error - The error that occurred
   * @param {ErrorContext} context - Error context
   */
  static handleDragError(error, context = {}) {
    console.error('[ErrorHandler] Drag error:', error, context);

    // Add to history
    this.#addToHistory(error, context);

    // Execute rollback if available
    if (context.rollback) {
      try {
        context.rollback();
        console.log('[ErrorHandler] Rollback successful');
      } catch (rollbackError) {
        console.error('[ErrorHandler] Rollback failed:', rollbackError);
      }
    }

    // Show user notification (unless silent)
    if (!context.silent) {
      this.#showErrorNotification(error, context);
    }

    // Send to error tracking service (if configured)
    this.#trackError(error, context);
  }

  /**
   * Handle storage errors
   * @param {Error} error - The error that occurred
   * @param {ErrorContext} context - Error context
   */
  static handleStorageError(error, context = {}) {
    console.error('[ErrorHandler] Storage error:', error, context);

    this.#addToHistory(error, context);

    if (!context.silent) {
      const message = this.#getStorageErrorMessage(error);
      this.#showErrorNotification(error, {
        ...context,
        userMessage: message
      });
    }

    this.#trackError(error, context);
  }

  /**
   * Handle network errors
   * @param {Error} error - The error that occurred
   * @param {ErrorContext} context - Error context
   */
  static handleNetworkError(error, context = {}) {
    console.error('[ErrorHandler] Network error:', error, context);

    this.#addToHistory(error, context);

    if (!context.silent) {
      const message = 'Netzwerkfehler. Änderungen werden synchronisiert sobald die Verbindung wiederhergestellt ist.';
      this.#showErrorNotification(error, {
        ...context,
        userMessage: message,
        type: 'warning'
      });
    }

    this.#trackError(error, context);
  }

  /**
   * Handle sync errors
   * @param {Error} error - The error that occurred
   * @param {ErrorContext} context - Error context
   */
  static handleSyncError(error, context = {}) {
    console.error('[ErrorHandler] Sync error:', error, context);

    this.#addToHistory(error, context);

    if (!context.silent) {
      this.#showErrorNotification(error, {
        ...context,
        userMessage: 'Synchronisation fehlgeschlagen. Bitte versuchen Sie es später erneut.'
      });
    }

    this.#trackError(error, context);
  }

  /**
   * Generic error handler
   * @param {Error} error - The error that occurred
   * @param {ErrorContext} context - Error context
   */
  static handleError(error, context = {}) {
    // Route to specific handler based on error type
    if (error instanceof TaskMoveError) {
      this.handleDragError(error, context);
    } else if (error instanceof StorageError) {
      this.handleStorageError(error, context);
    } else if (error instanceof NetworkError) {
      this.handleNetworkError(error, context);
    } else if (error instanceof SyncError) {
      this.handleSyncError(error, context);
    } else {
      // Generic error
      console.error('[ErrorHandler] Unhandled error:', error, context);
      this.#addToHistory(error, context);

      if (!context.silent) {
        this.#showErrorNotification(error, context);
      }

      this.#trackError(error, context);
    }
  }

  /**
   * Get error history
   * @returns {Array}
   */
  static getErrorHistory() {
    return [...this.errorHistory];
  }

  /**
   * Clear error history
   */
  static clearHistory() {
    this.errorHistory = [];
    console.log('[ErrorHandler] Error history cleared');
  }

  /**
   * Get error statistics
   * @returns {Object}
   */
  static getStats() {
    const stats = {
      total: this.errorHistory.length,
      byType: {},
      byOperation: {},
      recent: []
    };

    this.errorHistory.forEach(entry => {
      // Count by error type
      const type = entry.error.name || 'Unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;

      // Count by operation
      const op = entry.context.operation || 'unknown';
      stats.byOperation[op] = (stats.byOperation[op] || 0) + 1;
    });

    // Get last 5 errors
    stats.recent = this.errorHistory.slice(-5);

    return stats;
  }

  /**
   * Add error to history
   * @private
   * @param {Error} error - The error
   * @param {ErrorContext} context - Error context
   */
  static #addToHistory(error, context) {
    this.errorHistory.push({
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
        details: error.details
      },
      context,
      timestamp: new Date().toISOString()
    });

    // Limit history size
    if (this.errorHistory.length > this.MAX_HISTORY) {
      this.errorHistory.shift();
    }
  }

  /**
   * Show error notification to user
   * @private
   * @param {Error} error - The error
   * @param {ErrorContext} context - Error context
   */
  static #showErrorNotification(error, context) {
    // Import notifications module dynamically to avoid circular dependency
    import('./notifications.js').then(({ showNotification }) => {
      const message = context.userMessage || this.#getUserFriendlyMessage(error);
      const type = context.type || 'error';

      const actions = [];

      // Add retry action if available
      if (context.retry) {
        actions.push({
          label: 'Erneut versuchen',
          onClick: () => {
            try {
              context.retry();
            } catch (retryError) {
              this.handleError(retryError, {
                operation: 'retry',
                silent: false
              });
            }
          }
        });
      }

      // Add close action
      actions.push({
        label: 'Schließen',
        onClick: null
      });

      showNotification({
        type,
        message,
        actions,
        duration: 5000
      });
    }).catch(err => {
      // Fallback if notifications module not available
      console.error('[ErrorHandler] Could not load notifications module:', err);
      alert(context.userMessage || error.message);
    });
  }

  /**
   * Get user-friendly error message
   * @private
   * @param {Error} error - The error
   * @returns {string}
   */
  static #getUserFriendlyMessage(error) {
    const messages = {
      'TaskMoveError': 'Aufgabe konnte nicht verschoben werden.',
      'StorageError': 'Fehler beim Speichern der Daten.',
      'NetworkError': 'Netzwerkverbindung unterbrochen.',
      'SyncError': 'Synchronisation fehlgeschlagen.',
      'DragDropError': 'Fehler beim Drag & Drop.'
    };

    return messages[error.name] || 'Ein Fehler ist aufgetreten.';
  }

  /**
   * Get storage-specific error message
   * @private
   * @param {Error} error - The error
   * @returns {string}
   */
  static #getStorageErrorMessage(error) {
    if (error.message.includes('quota')) {
      return 'Speicherplatz voll. Bitte löschen Sie einige erledigte Aufgaben.';
    }

    if (error.message.includes('permission')) {
      return 'Keine Berechtigung zum Speichern. Bitte überprüfen Sie Ihre Browser-Einstellungen.';
    }

    return 'Fehler beim Speichern der Daten.';
  }

  /**
   * Send error to tracking service
   * @private
   * @param {Error} error - The error
   * @param {ErrorContext} context - Error context
   */
  static #trackError(error, context) {
    // Check if error tracking is enabled
    if (window.errorTracker && typeof window.errorTracker.captureException === 'function') {
      try {
        window.errorTracker.captureException(error, {
          context,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        });
      } catch (trackingError) {
        console.error('[ErrorHandler] Error tracking failed:', trackingError);
      }
    }

    // Optional: Send to custom analytics
    if (window.analytics && typeof window.analytics.track === 'function') {
      try {
        window.analytics.track('Error Occurred', {
          errorName: error.name,
          errorMessage: error.message,
          operation: context.operation,
          timestamp: new Date().toISOString()
        });
      } catch (analyticsError) {
        console.error('[ErrorHandler] Analytics tracking failed:', analyticsError);
      }
    }
  }
}

/**
 * Wrap async function with error handling
 * @param {Function} fn - Async function to wrap
 * @param {ErrorContext} context - Error context
 * @returns {Function} Wrapped function
 */
export function withErrorHandling(fn, context = {}) {
  return async function(...args) {
    try {
      return await fn(...args);
    } catch (error) {
      ErrorHandler.handleError(error, context);
      throw error; // Re-throw for caller to handle if needed
    }
  };
}

/**
 * Create error boundary for sync operations
 * @param {Function} operation - Operation to execute
 * @param {ErrorContext} context - Error context
 * @returns {Promise<{success: boolean, error: Error|null, result: *}>}
 */
export async function errorBoundary(operation, context = {}) {
  try {
    const result = await operation();
    return { success: true, error: null, result };
  } catch (error) {
    ErrorHandler.handleError(error, context);
    return { success: false, error, result: null };
  }
}
