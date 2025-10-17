/**
 * @fileoverview Offline Queue Management
 * @module offline-queue
 * @description
 * Manages queued actions when offline, with automatic retry and synchronization.
 * Stores actions in IndexedDB and processes them when connection is restored.
 *
 * Features:
 * - Action queuing with retry logic
 * - Automatic sync on network restore
 * - Conflict resolution
 * - Failed action management
 *
 * @version 2.0.0
 * @since 2025-10-16
 */

// LocalForage is loaded globally via index.html
// Using global variable instead of import
const localforage = window.localforage;

/**
 * @typedef {Object} QueueAction
 * @property {string} id - Unique action ID
 * @property {'MOVE_TASK'|'ADD_TASK'|'DELETE_TASK'|'UPDATE_TASK'|'TOGGLE_TASK'} action - Action type
 * @property {Object} payload - Action data
 * @property {'pending'|'syncing'|'failed'} status - Action status
 * @property {number} retryCount - Number of retry attempts
 * @property {string} createdAt - ISO timestamp of creation
 * @property {string|null} lastAttempt - ISO timestamp of last sync attempt
 * @property {string|null} error - Last error message (if failed)
 */

/**
 * Configure separate IndexedDB store for sync queue
 */
const queueStore = localforage.createInstance({
  name: 'eisenhauer',
  storeName: 'sync_queue',
  description: 'Offline action queue for sync'
});

/**
 * Maximum retry attempts before marking as failed
 */
const MAX_RETRY_ATTEMPTS = 3;

/**
 * Delay between retry attempts (exponential backoff)
 * @param {number} attempt - Current attempt number
 * @returns {number} Delay in milliseconds
 */
function getRetryDelay(attempt) {
  return Math.min(1000 * Math.pow(2, attempt), 30000); // Max 30 seconds
}

/**
 * Offline Queue Manager
 */
export class OfflineQueue {
  /**
   * Generate unique ID for queue items
   * @private
   * @returns {string}
   */
  static #generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add action to queue
   * @param {'MOVE_TASK'|'ADD_TASK'|'DELETE_TASK'|'UPDATE_TASK'|'TOGGLE_TASK'} actionType - Action type
   * @param {Object} payload - Action data
   * @returns {Promise<string>} Queue item ID
   */
  static async enqueue(actionType, payload) {
    const id = this.#generateId();

    const queueItem = {
      id,
      action: actionType,
      payload,
      status: 'pending',
      retryCount: 0,
      createdAt: new Date().toISOString(),
      lastAttempt: null,
      error: null
    };

    await queueStore.setItem(id, queueItem);

    console.log('[OfflineQueue] Enqueued action:', queueItem);

    return id;
  }

  /**
   * Remove action from queue
   * @param {string} id - Queue item ID
   * @returns {Promise<void>}
   */
  static async dequeue(id) {
    await queueStore.removeItem(id);
    console.log('[OfflineQueue] Dequeued action:', id);
  }

  /**
   * Get all queued actions
   * @param {string} [status] - Filter by status (optional)
   * @returns {Promise<Array<QueueAction>>}
   */
  static async getAll(status = null) {
    const items = [];

    await queueStore.iterate((value) => {
      if (!status || value.status === status) {
        items.push(value);
      }
    });

    // Sort by creation time (oldest first)
    return items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  /**
   * Get queue item by ID
   * @param {string} id - Queue item ID
   * @returns {Promise<QueueAction|null>}
   */
  static async getById(id) {
    return await queueStore.getItem(id);
  }

  /**
   * Update queue item
   * @param {string} id - Queue item ID
   * @param {Partial<QueueAction>} updates - Updates to apply
   * @returns {Promise<QueueAction>}
   */
  static async update(id, updates) {
    const item = await queueStore.getItem(id);
    if (!item) {
      throw new Error(`Queue item ${id} not found`);
    }

    const updated = { ...item, ...updates };
    await queueStore.setItem(id, updated);

    return updated;
  }

  /**
   * Mark action as syncing
   * @param {string} id - Queue item ID
   * @returns {Promise<void>}
   */
  static async markSyncing(id) {
    await this.update(id, {
      status: 'syncing',
      lastAttempt: new Date().toISOString()
    });
  }

  /**
   * Mark action as failed
   * @param {string} id - Queue item ID
   * @param {string} error - Error message
   * @returns {Promise<void>}
   */
  static async markFailed(id, error) {
    const item = await this.getById(id);

    await this.update(id, {
      status: 'failed',
      error,
      retryCount: item.retryCount + 1
    });
  }

  /**
   * Reset failed action to pending (for manual retry)
   * @param {string} id - Queue item ID
   * @returns {Promise<void>}
   */
  static async resetFailed(id) {
    await this.update(id, {
      status: 'pending',
      error: null
    });
  }

  /**
   * Get count of pending actions
   * @returns {Promise<number>}
   */
  static async getPendingCount() {
    const pending = await this.getAll('pending');
    return pending.length;
  }

  /**
   * Get count of failed actions
   * @returns {Promise<number>}
   */
  static async getFailedCount() {
    const failed = await this.getAll('failed');
    return failed.length;
  }

  /**
   * Clear all completed actions from queue
   * @returns {Promise<number>} Number of items cleared
   */
  static async clearCompleted() {
    const allItems = await this.getAll();
    let cleared = 0;

    for (const item of allItems) {
      if (item.status !== 'pending' && item.status !== 'syncing') {
        await this.dequeue(item.id);
        cleared++;
      }
    }

    console.log(`[OfflineQueue] Cleared ${cleared} completed items`);
    return cleared;
  }

  /**
   * Clear entire queue (use with caution!)
   * @returns {Promise<void>}
   */
  static async clearAll() {
    await queueStore.clear();
    console.log('[OfflineQueue] Cleared entire queue');
  }

  /**
   * Process all pending actions in queue
   * @param {Function} executor - Function to execute each action
   * @param {Object} [options] - Processing options
   * @param {boolean} [options.stopOnError=false] - Stop processing on first error
   * @param {Function} [options.onProgress] - Progress callback
   * @returns {Promise<Object>} Processing results
   */
  static async processQueue(executor, options = {}) {
    const { stopOnError = false, onProgress = null } = options;

    const queue = await this.getAll('pending');

    if (queue.length === 0) {
      console.log('[OfflineQueue] Queue is empty, nothing to process');
      return { processed: 0, succeeded: 0, failed: 0 };
    }

    console.log(`[OfflineQueue] Processing ${queue.length} items...`);

    let processed = 0;
    let succeeded = 0;
    let failed = 0;

    for (const item of queue) {
      // Call progress callback
      if (onProgress) {
        onProgress({
          current: processed + 1,
          total: queue.length,
          item
        });
      }

      try {
        // Mark as syncing
        await this.markSyncing(item.id);

        // Execute action
        await executor(item);

        // Success - remove from queue
        await this.dequeue(item.id);
        succeeded++;

        console.log('[OfflineQueue] Successfully processed:', item.id);
      } catch (error) {
        failed++;

        console.error('[OfflineQueue] Failed to process:', item.id, error);

        // Check if we should retry
        if (item.retryCount + 1 >= MAX_RETRY_ATTEMPTS) {
          // Max retries reached - mark as failed
          await this.markFailed(item.id, error.message);
          console.warn('[OfflineQueue] Max retries reached:', item.id);
        } else {
          // Schedule retry with exponential backoff
          const delay = getRetryDelay(item.retryCount);

          await this.update(item.id, {
            status: 'pending',
            retryCount: item.retryCount + 1,
            error: error.message
          });

          console.log(`[OfflineQueue] Will retry ${item.id} after ${delay}ms`);

          // Optional: Schedule automatic retry
          setTimeout(async () => {
            const current = await this.getById(item.id);
            if (current && current.status === 'pending') {
              console.log('[OfflineQueue] Auto-retrying:', item.id);
              await this.processQueue(executor, options);
            }
          }, delay);
        }

        // Stop on error if requested
        if (stopOnError) {
          break;
        }
      }

      processed++;
    }

    const result = { processed, succeeded, failed };
    console.log('[OfflineQueue] Processing complete:', result);

    return result;
  }

  /**
   * Check if there are pending actions
   * @returns {Promise<boolean>}
   */
  static async hasPending() {
    const count = await this.getPendingCount();
    return count > 0;
  }

  /**
   * Get queue statistics
   * @returns {Promise<Object>}
   */
  static async getStats() {
    const allItems = await this.getAll();

    const stats = {
      total: allItems.length,
      pending: 0,
      syncing: 0,
      failed: 0,
      byAction: {},
      oldestPending: null
    };

    allItems.forEach(item => {
      // Count by status
      stats[item.status] = (stats[item.status] || 0) + 1;

      // Count by action type
      stats.byAction[item.action] = (stats.byAction[item.action] || 0) + 1;

      // Track oldest pending
      if (item.status === 'pending') {
        if (!stats.oldestPending || new Date(item.createdAt) < new Date(stats.oldestPending)) {
          stats.oldestPending = item.createdAt;
        }
      }
    });

    return stats;
  }

  /**
   * Export queue for debugging/backup
   * @returns {Promise<Array<QueueAction>>}
   */
  static async export() {
    return await this.getAll();
  }

  /**
   * Import queue from backup (use with caution!)
   * @param {Array<QueueAction>} items - Queue items to import
   * @param {boolean} [merge=true] - Merge with existing queue or replace
   * @returns {Promise<number>} Number of imported items
   */
  static async import(items, merge = true) {
    if (!merge) {
      await this.clearAll();
    }

    let imported = 0;

    for (const item of items) {
      await queueStore.setItem(item.id, item);
      imported++;
    }

    console.log(`[OfflineQueue] Imported ${imported} items`);
    return imported;
  }
}

/**
 * Setup automatic queue processing on network restore
 * @param {Function} executor - Function to execute queued actions
 */
export function setupAutoSync(executor) {
  window.addEventListener('online', async () => {
    console.log('[OfflineQueue] Network restored, processing queue...');

    try {
      const result = await OfflineQueue.processQueue(executor, {
        stopOnError: false,
        onProgress: ({ current, total }) => {
          console.log(`[OfflineQueue] Progress: ${current}/${total}`);
        }
      });

      console.log('[OfflineQueue] Auto-sync complete:', result);
    } catch (error) {
      console.error('[OfflineQueue] Auto-sync failed:', error);
    }
  });
}
