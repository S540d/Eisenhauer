/**
 * @fileoverview Central State Management Store
 * @module store
 * @description
 * Single source of truth for application state.
 * Replaces scattered global variables with a unified store pattern.
 *
 * Features:
 * - Centralized state management
 * - Subscription-based updates
 * - Predictable state mutations
 * - Easy debugging and testing
 *
 * @version 2.0.0
 * @since 2025-10-16
 */

/**
 * @typedef {Object} AppState
 * @property {Object|null} currentUser - Firebase authenticated user
 * @property {Object|null} db - Firestore database instance
 * @property {boolean} isGuestMode - Guest mode flag
 * @property {Object<number, Array>} tasks - Tasks grouped by segment ID
 * @property {string} language - Current UI language ('de' | 'en')
 * @property {string} theme - Current theme ('light' | 'dark' | 'system')
 * @property {'online'|'offline'} networkStatus - Network connectivity status
 * @property {Array} syncQueue - Pending offline operations
 * @property {boolean} isDragging - Global drag state
 * @property {Object|null} draggedTask - Currently dragged task
 */

/**
 * @typedef {Function} StateListener
 * @param {AppState} newState - Updated state
 * @param {AppState} prevState - Previous state
 */

/**
 * Store class implementing a simple Redux-like pattern
 */
class Store {
  /**
   * Initialize store with default state
   */
  constructor() {
    /**
     * @private
     * @type {AppState}
     */
    this.state = {
      // Authentication & Database
      currentUser: null,
      db: null,
      isGuestMode: true,

      // Tasks
      tasks: {
        1: [], // Do!
        2: [], // Schedule!
        3: [], // Delegate!
        4: [], // Ignore!
        5: []  // Done!
      },

      // UI Settings
      language: this.#getInitialLanguage(),
      theme: this.#getInitialTheme(),

      // Network & Sync
      networkStatus: navigator.onLine ? 'online' : 'offline',
      syncQueue: [],

      // Drag State
      isDragging: false,
      draggedTask: null,
      dragSource: null,
      dragTarget: null
    };

    /**
     * @private
     * @type {Array<StateListener>}
     */
    this.listeners = [];

    // Setup network status listeners
    this.#setupNetworkListeners();

    // Log initialization in dev mode
    if (this.#isDevelopment()) {
      console.log('[Store] Initialized with state:', this.state);
    }
  }

  /**
   * Get current state (read-only)
   * @returns {Readonly<AppState>}
   */
  getState() {
    // Return deep frozen copy to prevent direct mutations
    return this.#deepFreeze(this.#deepClone(this.state));
  }

  /**
   * Deep freeze object recursively
   * @private
   * @param {Object} obj - Object to freeze
   * @returns {Object} Frozen object
   */
  #deepFreeze(obj) {
    // Get property names
    const propNames = Object.getOwnPropertyNames(obj);

    // Freeze properties before freezing self
    for (const name of propNames) {
      const value = obj[name];

      if (value && typeof value === 'object') {
        this.#deepFreeze(value);
      }
    }

    return Object.freeze(obj);
  }

  /**
   * Deep clone object recursively
   * @private
   * @param {*} obj - Object to clone
   * @returns {*} Cloned object
   */
  #deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.#deepClone(item));
    }

    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = this.#deepClone(obj[key]);
      }
    }

    return cloned;
  }

  /**
   * Update state with partial updates
   * @param {Partial<AppState>} updates - Partial state updates
   * @param {string} [source] - Optional source identifier for debugging
   */
  setState(updates, source = 'unknown') {
    const prevState = { ...this.state };

    // Merge updates into state
    this.state = {
      ...this.state,
      ...updates
    };

    // Log state changes in dev mode
    if (this.#isDevelopment()) {
      console.log(`[Store] State updated from '${source}':`, {
        updates,
        prevState,
        newState: this.state
      });
    }

    // Notify all listeners
    this.#notifyListeners(this.state, prevState);
  }

  /**
   * Update nested state (e.g., tasks in specific segment)
   * @param {string} path - Dot-notation path (e.g., 'tasks.1')
   * @param {*} value - New value
   * @param {string} [source] - Optional source identifier
   */
  setNestedState(path, value, source = 'unknown') {
    const prevState = { ...this.state };
    const keys = path.split('.');
    const newState = { ...this.state };

    let current = newState;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      current[key] = { ...current[key] };
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;

    this.state = newState;

    if (this.#isDevelopment()) {
      console.log(`[Store] Nested state updated at '${path}' from '${source}':`, {
        value,
        prevState,
        newState: this.state
      });
    }

    this.#notifyListeners(this.state, prevState);
  }

  /**
   * Subscribe to state changes
   * @param {StateListener} listener - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }

    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Subscribe to specific state changes only
   * @param {string|Array<string>} keys - State keys to watch
   * @param {StateListener} listener - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribeToKeys(keys, listener) {
    const watchedKeys = Array.isArray(keys) ? keys : [keys];

    const wrappedListener = (newState, prevState) => {
      // Check if any watched keys changed
      const hasChanged = watchedKeys.some(key => {
        const newValue = newState[key];
        const prevValue = prevState[key];

        // Handle undefined values
        if (newValue === undefined && prevValue === undefined) {
          return false;
        }
        if (newValue === undefined || prevValue === undefined) {
          return true;
        }

        // For primitives, use strict equality
        if (typeof newValue !== 'object' || newValue === null) {
          return newValue !== prevValue;
        }

        // For objects/arrays, use JSON stringify for deep comparison
        try {
          return JSON.stringify(newValue) !== JSON.stringify(prevValue);
        } catch (e) {
          // Fallback to reference comparison if JSON.stringify fails
          console.warn('[Store] JSON.stringify failed for key:', key, e);
          return newValue !== prevValue;
        }
      });

      if (hasChanged) {
        listener(newState, prevState);
      }
    };

    this.listeners.push(wrappedListener);

    return () => {
      this.listeners = this.listeners.filter(l => l !== wrappedListener);
    };
  }

  /**
   * Reset state to default values
   * @param {boolean} [keepAuth=false] - Keep authentication state
   */
  reset(keepAuth = false) {
    const prevState = { ...this.state };

    this.state = {
      currentUser: keepAuth ? this.state.currentUser : null,
      db: keepAuth ? this.state.db : null,
      isGuestMode: keepAuth ? this.state.isGuestMode : true,
      tasks: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      language: this.state.language,
      theme: this.state.theme,
      networkStatus: navigator.onLine ? 'online' : 'offline',
      syncQueue: [],
      isDragging: false,
      draggedTask: null,
      dragSource: null,
      dragTarget: null
    };

    if (this.#isDevelopment()) {
      console.log('[Store] State reset', { keepAuth, prevState, newState: this.state });
    }

    this.#notifyListeners(this.state, prevState);
  }

  /**
   * Get current user
   * @returns {Object|null}
   */
  getCurrentUser() {
    return this.state.currentUser;
  }

  /**
   * Get Firestore database instance
   * @returns {Object|null}
   */
  getDb() {
    return this.state.db;
  }

  /**
   * Get all tasks
   * @returns {Object<number, Array>}
   */
  getTasks() {
    return this.#deepClone(this.state.tasks);
  }

  /**
   * Get tasks for specific segment
   * @param {number} segmentId - Segment ID (1-5)
   * @returns {Array}
   */
  getTasksBySegment(segmentId) {
    return this.#deepClone(this.state.tasks[segmentId] || []);
  }

  /**
   * Check if in guest mode
   * @returns {boolean}
   */
  isGuest() {
    return this.state.isGuestMode;
  }

  /**
   * Check if online
   * @returns {boolean}
   */
  isOnline() {
    return this.state.networkStatus === 'online';
  }

  /**
   * Get pending sync queue length
   * @returns {number}
   */
  getPendingSync() {
    return this.state.syncQueue.length;
  }

  /**
   * Notify all listeners of state change
   * @private
   * @param {AppState} newState
   * @param {AppState} prevState
   */
  #notifyListeners(newState, prevState) {
    this.listeners.forEach(listener => {
      try {
        listener(newState, prevState);
      } catch (error) {
        console.error('[Store] Listener error:', error);
      }
    });
  }

  /**
   * Setup network status listeners
   * @private
   */
  #setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.setState({ networkStatus: 'online' }, 'network-listener');
    });

    window.addEventListener('offline', () => {
      this.setState({ networkStatus: 'offline' }, 'network-listener');
    });
  }

  /**
   * Get initial language from localStorage or browser
   * @private
   * @returns {string}
   */
  #getInitialLanguage() {
    const stored = localStorage.getItem('language');
    if (stored) return stored;

    const browserLang = navigator.language.split('-')[0];
    return ['de', 'en'].includes(browserLang) ? browserLang : 'de';
  }

  /**
   * Get initial theme from localStorage or system preference
   * @private
   * @returns {string}
   */
  #getInitialTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;

    return 'system';
  }

  /**
   * Check if in development mode
   * @private
   * @returns {boolean}
   */
  #isDevelopment() {
    return window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1';
  }
}

// Create singleton instance
export const store = new Store();

// Export class for testing
export { Store };
