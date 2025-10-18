/**
 * @fileoverview Offline Queue Management (Instance-based with Events)
 * @version 3.0.0
 * @since 2025-10-17
 *
 * Complete rewrite: Static class → Instance class with Event Emitter
 * Fixes: offlineQueue.on is not a function error
 */

const localforage = window.localforage;

/**
 * Offline Queue Manager
 */
export class OfflineQueue {
  /**
   * Create new queue instance
   * @param {string} queueName - Queue identifier
   */
  constructor(queueName) {
    this.queueName = queueName;
    this.eventListeners = new Map();
    this.queue = [];
    this.isProcessing = false;

    // Create IndexedDB store
    this.store = localforage.createInstance({
      name: 'eisenhauer',
      storeName: `queue_${queueName}`
    });

    // Load existing queue
    this._loadQueue();

    console.log(`[OfflineQueue] Initialized: ${queueName}`);
  }

  /**
   * Load queue from IndexedDB
   * @private
   */
  async _loadQueue() {
    try {
      const stored = await this.store.getItem('queue');
      if (stored && Array.isArray(stored)) {
        this.queue = stored;
        console.log(`[OfflineQueue] Loaded ${this.queue.length} items`);
      }
    } catch (error) {
      console.error('[OfflineQueue] Load error:', error);
    }
  }

  /**
   * Save queue to IndexedDB
   * @private
   */
  async _saveQueue() {
    try {
      await this.store.setItem('queue', this.queue);
    } catch (error) {
      console.error('[OfflineQueue] Save error:', error);
    }
  }

  /**
   * Generate unique ID
   * @private
   */
  _generateId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${timestamp}-${random}`;
  }

  /**
   * Register event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
    console.log(`[OfflineQueue] Registered listener: ${event}`);
  }

  /**
   * Emit event
   * @private
   */
  _emit(event, ...args) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(cb => {
        try {
          cb(...args);
        } catch (error) {
          console.error(`[OfflineQueue] Listener error (${event}):`, error);
        }
      });
    }
  }

  /**
   * Add item to queue
   * @param {string} operation - Operation description
   * @param {Function} executor - Async function to execute
   * @param {Object} metadata - Additional data
   * @param {number} maxRetries - Max retry attempts
   */
  async add(operation, executor, metadata = {}, maxRetries = 3) {
    const id = this._generateId();

    const item = {
      id,
      operation,
      executor, // Store function reference
      metadata,
      retries: 0,
      maxRetries,
      createdAt: new Date().toISOString(),
      status: 'pending',
      error: null
    };

    this.queue.push(item);
    await this._saveQueue();

    console.log(`[OfflineQueue] Added: ${operation} (${id})`);
    this._emit('itemAdded', item);

    // If online, try to process immediately
    if (navigator.onLine && !this.isProcessing) {
      setTimeout(() => this.processQueue(), 100);
    }

    return id;
  }

  /**
   * Process all pending items in queue
   */
  async processQueue() {
    if (this.isProcessing) {
      console.log('[OfflineQueue] Already processing');
      return { processed: 0, succeeded: 0, failed: 0 };
    }

    const pendingItems = this.queue.filter(i => i.status === 'pending');

    if (pendingItems.length === 0) {
      console.log('[OfflineQueue] Queue empty');
      this._emit('queueEmpty');
      return { processed: 0, succeeded: 0, failed: 0 };
    }

    this.isProcessing = true;
    console.log(`[OfflineQueue] Processing ${pendingItems.length} items...`);

    let processed = 0;
    let succeeded = 0;
    let failed = 0;

    for (const item of pendingItems) {
      try {
        item.status = 'processing';
        await this._saveQueue();

        // Execute the stored function
        if (typeof item.executor === 'function') {
          await item.executor();
        } else {
          throw new Error('Executor is not a function');
        }

        // Success - remove from queue
        this.queue = this.queue.filter(i => i.id !== item.id);
        await this._saveQueue();

        succeeded++;
        this._emit('itemProcessed', item);
        console.log(`[OfflineQueue] ✓ Processed: ${item.operation}`);

      } catch (error) {
        failed++;
        item.retries++;
        item.error = error.message;

        console.error(`[OfflineQueue] ✗ Failed: ${item.operation}`, error);

        if (item.retries >= item.maxRetries) {
          // Max retries reached
          item.status = 'failed';
          console.warn(`[OfflineQueue] Max retries: ${item.operation}`);
          this._emit('itemFailed', item, error);
        } else {
          // Reset to pending for retry
          item.status = 'pending';
          console.log(`[OfflineQueue] Will retry: ${item.operation} (${item.retries}/${item.maxRetries})`);
        }

        await this._saveQueue();
      }

      processed++;
    }

    this.isProcessing = false;

    // Check if queue is now empty (all pending items processed)
    const stillPending = this.queue.filter(i => i.status === 'pending').length;
    if (stillPending === 0) {
      this._emit('queueEmpty');
    }

    const result = { processed, succeeded, failed };
    console.log('[OfflineQueue] Complete:', result);

    return result;
  }

  /**
   * Get count of pending items
   */
  getPendingCount() {
    return this.queue.filter(i => i.status === 'pending').length;
  }

  /**
   * Clear all items
   */
  async clearAll() {
    this.queue = [];
    await this._saveQueue();
    this._emit('queueEmpty');
  }
}
