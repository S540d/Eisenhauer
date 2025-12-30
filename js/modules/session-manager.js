/**
 * Session Manager Module
 * @fileoverview Manages user session persistence and recovery
 * Implements fallback mechanisms to prevent unexpected logouts
 * @version 1.0.0
 */

import localforage from 'localforage';
import { ErrorHandler } from './error-handler.js';

/**
 * Session state keys
 */
const SESSION_KEYS = {
  LAST_AUTH_STATE: 'session_last_auth_state',
  LAST_USER_DATA: 'session_last_user_data',
  SESSION_HEARTBEAT: 'session_heartbeat',
  AUTH_RETRY_COUNT: 'session_auth_retry_count',
  LOGOUT_REASON: 'session_logout_reason',
};

/**
 * Configuration
 */
const CONFIG = {
  MAX_RETRY_ATTEMPTS: 3,
  HEARTBEAT_INTERVAL: 60000, // 1 minute
  SESSION_TIMEOUT: 3600000, // 1 hour
  RETRY_DELAY: 2000, // 2 seconds
};

/**
 * Logout reasons
 */
export const LOGOUT_REASONS = {
  USER_INITIATED: 'user_initiated',
  SESSION_EXPIRED: 'session_expired',
  AUTH_ERROR: 'auth_error',
  NETWORK_ERROR: 'network_error',
  UNEXPECTED: 'unexpected',
};

/**
 * Session Manager Class
 */
export class SessionManager {
  constructor() {
    this.heartbeatInterval = null;
    this.retryAttempts = 0;
    this.isRecovering = false;
    this.onRecoveryCallback = null;
    this.onLogoutCallback = null;
  }

  /**
   * Initialize session manager
   * @param {Object} options - Configuration options
   * @param {Function} options.onRecovery - Callback when session is recovered
   * @param {Function} options.onLogout - Callback when legitimate logout occurs
   */
  async initialize(options = {}) {
    this.onRecoveryCallback = options.onRecovery;
    this.onLogoutCallback = options.onLogout;

    // Load existing session data
    await this.loadSessionData();

    // Start heartbeat
    this.startHeartbeat();

    // Check for unfinished recovery
    const retryCount = await localforage.getItem(SESSION_KEYS.AUTH_RETRY_COUNT);
    if (retryCount > 0) {
      console.log('[SessionManager] Detected previous recovery attempt, resetting...');
      await this.clearRetryCount();
    }
  }

  /**
   * Save current authentication state
   * @param {Object} user - Firebase user object
   * @param {boolean} isGuest - Whether user is in guest mode
   */
  async saveAuthState(user, isGuest = false) {
    try {
      const authState = {
        isAuthenticated: !!user || isGuest,
        isGuest: isGuest,
        timestamp: Date.now(),
      };

      await localforage.setItem(SESSION_KEYS.LAST_AUTH_STATE, authState);

      // Save user data if authenticated (not in guest mode)
      if (user && !isGuest) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          timestamp: Date.now(),
        };
        await localforage.setItem(SESSION_KEYS.LAST_USER_DATA, userData);
      }

      // Reset retry count on successful auth
      await this.clearRetryCount();

      console.log('[SessionManager] Auth state saved successfully');
    } catch (error) {
      console.error('[SessionManager] Failed to save auth state:', error);
      ErrorHandler.handleError(error, {
        operation: 'saveAuthState',
        silent: true,
      });
    }
  }

  /**
   * Load session data from storage
   */
  async loadSessionData() {
    try {
      const authState = await localforage.getItem(SESSION_KEYS.LAST_AUTH_STATE);
      if (authState) {
        console.log('[SessionManager] Previous auth state loaded:', authState);
      }
    } catch (error) {
      console.error('[SessionManager] Failed to load session data:', error);
    }
  }

  /**
   * Validate logout reason
   * Determines if logout is legitimate or unexpected
   * @param {string} reason - Logout reason
   * @param {Error} error - Optional error object
   * @returns {Object} Validation result
   */
  async validateLogout(reason, error = null) {
    const authState = await localforage.getItem(SESSION_KEYS.LAST_AUTH_STATE);
    const lastHeartbeat = await localforage.getItem(SESSION_KEYS.SESSION_HEARTBEAT);

    // Check if session is still valid
    const isSessionValid = lastHeartbeat && Date.now() - lastHeartbeat < CONFIG.SESSION_TIMEOUT;

    // Determine if logout is unexpected
    const isUnexpected =
      reason === LOGOUT_REASONS.UNEXPECTED ||
      (reason === LOGOUT_REASONS.AUTH_ERROR && isSessionValid) ||
      (reason === LOGOUT_REASONS.NETWORK_ERROR && isSessionValid);

    const validation = {
      isUnexpected,
      shouldRecover: isUnexpected && authState?.isAuthenticated && !authState?.isGuest,
      reason,
      error,
      sessionValid: isSessionValid,
      authState,
    };

    // Save logout reason
    await localforage.setItem(SESSION_KEYS.LOGOUT_REASON, {
      reason,
      timestamp: Date.now(),
      validation,
    });

    console.log('[SessionManager] Logout validated:', validation);

    return validation;
  }

  /**
   * Attempt to recover session
   * @param {Function} authFunction - Function to re-authenticate user
   * @returns {Promise<boolean>} Success status
   */
  async attemptRecovery(authFunction) {
    if (this.isRecovering) {
      console.log('[SessionManager] Recovery already in progress');
      return false;
    }

    this.isRecovering = true;
    this.retryAttempts = (await localforage.getItem(SESSION_KEYS.AUTH_RETRY_COUNT)) || 0;

    console.log(
      `[SessionManager] Attempting recovery (attempt ${this.retryAttempts + 1}/${CONFIG.MAX_RETRY_ATTEMPTS})`
    );

    if (this.retryAttempts >= CONFIG.MAX_RETRY_ATTEMPTS) {
      console.error('[SessionManager] Max retry attempts reached, giving up');
      await this.clearRecoveryState();
      this.isRecovering = false;
      return false;
    }

    try {
      // Increment retry count
      this.retryAttempts++;
      await localforage.setItem(SESSION_KEYS.AUTH_RETRY_COUNT, this.retryAttempts);

      // Wait before retrying
      await this.delay(CONFIG.RETRY_DELAY);

      // Attempt re-authentication
      const success = await authFunction();

      if (success) {
        console.log('[SessionManager] Session recovered successfully');
        await this.clearRecoveryState();
        this.isRecovering = false;

        // Notify callback
        if (this.onRecoveryCallback) {
          this.onRecoveryCallback();
        }

        return true;
      } else {
        console.warn('[SessionManager] Recovery attempt failed');
        this.isRecovering = false;
        return false;
      }
    } catch (error) {
      console.error('[SessionManager] Recovery error:', error);
      ErrorHandler.handleError(error, {
        operation: 'sessionRecovery',
        silent: false,
      });
      this.isRecovering = false;
      return false;
    }
  }

  /**
   * Start session heartbeat
   * Regularly updates timestamp to indicate active session
   */
  startHeartbeat() {
    if (this.heartbeatInterval) {
      return;
    }

    console.log('[SessionManager] Starting heartbeat');

    // Initial heartbeat
    this.updateHeartbeat();

    // Regular heartbeat
    this.heartbeatInterval = setInterval(() => {
      this.updateHeartbeat();
    }, CONFIG.HEARTBEAT_INTERVAL);
  }

  /**
   * Stop session heartbeat
   */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      console.log('[SessionManager] Stopping heartbeat');
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Update heartbeat timestamp
   */
  async updateHeartbeat() {
    try {
      await localforage.setItem(SESSION_KEYS.SESSION_HEARTBEAT, Date.now());
    } catch (error) {
      console.error('[SessionManager] Failed to update heartbeat:', error);
    }
  }

  /**
   * Clear recovery state
   */
  async clearRecoveryState() {
    await this.clearRetryCount();
    await localforage.removeItem(SESSION_KEYS.LOGOUT_REASON);
    console.log('[SessionManager] Recovery state cleared');
  }

  /**
   * Clear retry count
   */
  async clearRetryCount() {
    this.retryAttempts = 0;
    await localforage.setItem(SESSION_KEYS.AUTH_RETRY_COUNT, 0);
  }

  /**
   * Handle user-initiated logout
   * Clears session data and stops heartbeat
   */
  async handleUserLogout() {
    console.log('[SessionManager] Handling user-initiated logout');

    // Stop heartbeat
    this.stopHeartbeat();

    // Clear session data
    await localforage.removeItem(SESSION_KEYS.LAST_AUTH_STATE);
    await localforage.removeItem(SESSION_KEYS.LAST_USER_DATA);
    await localforage.removeItem(SESSION_KEYS.SESSION_HEARTBEAT);
    await this.clearRecoveryState();

    // Save logout reason
    await localforage.setItem(SESSION_KEYS.LOGOUT_REASON, {
      reason: LOGOUT_REASONS.USER_INITIATED,
      timestamp: Date.now(),
    });

    // Notify callback
    if (this.onLogoutCallback) {
      this.onLogoutCallback();
    }
  }

  /**
   * Get session status
   * @returns {Promise<Object>} Session status
   */
  async getStatus() {
    const authState = await localforage.getItem(SESSION_KEYS.LAST_AUTH_STATE);
    const lastHeartbeat = await localforage.getItem(SESSION_KEYS.SESSION_HEARTBEAT);
    const retryCount = await localforage.getItem(SESSION_KEYS.AUTH_RETRY_COUNT);
    const logoutReason = await localforage.getItem(SESSION_KEYS.LOGOUT_REASON);

    return {
      isAuthenticated: authState?.isAuthenticated || false,
      isGuest: authState?.isGuest || false,
      lastHeartbeat,
      retryCount: retryCount || 0,
      isRecovering: this.isRecovering,
      lastLogoutReason: logoutReason?.reason,
    };
  }

  /**
   * Delay helper
   * @param {number} ms - Milliseconds to wait
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Cleanup
   */
  async cleanup() {
    this.stopHeartbeat();
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();
