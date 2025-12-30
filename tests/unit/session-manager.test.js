/**
 * Unit tests for Session Manager
 * Tests session recovery and fallback mechanisms
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SessionManager, LOGOUT_REASONS } from '../../js/modules/session-manager.js';
import localforage from 'localforage';

describe('SessionManager', () => {
  let sessionManager;

  beforeEach(async () => {
    sessionManager = new SessionManager();
    // Clear storage before each test
    await localforage.clear();
  });

  afterEach(async () => {
    if (sessionManager) {
      await sessionManager.cleanup();
    }
    await localforage.clear();
  });

  describe('initialization', () => {
    it('should initialize with callbacks', async () => {
      const onRecovery = vi.fn();
      const onLogout = vi.fn();

      await sessionManager.initialize({
        onRecovery,
        onLogout,
      });

      expect(sessionManager.onRecoveryCallback).toBe(onRecovery);
      expect(sessionManager.onLogoutCallback).toBe(onLogout);
    });

    it('should start heartbeat on initialization', async () => {
      await sessionManager.initialize();
      expect(sessionManager.heartbeatInterval).not.toBeNull();
    });
  });

  describe('saveAuthState', () => {
    it('should save authenticated user state', async () => {
      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
      };

      await sessionManager.saveAuthState(mockUser, false);

      const authState = await localforage.getItem('session_last_auth_state');
      expect(authState.isAuthenticated).toBe(true);
      expect(authState.isGuest).toBe(false);

      const userData = await localforage.getItem('session_last_user_data');
      expect(userData.uid).toBe('test-uid');
      expect(userData.email).toBe('test@example.com');
    });

    it('should save guest mode state', async () => {
      await sessionManager.saveAuthState(null, true);

      const authState = await localforage.getItem('session_last_auth_state');
      expect(authState.isAuthenticated).toBe(true);
      expect(authState.isGuest).toBe(true);
    });

    it('should reset retry count on successful auth', async () => {
      await localforage.setItem('session_auth_retry_count', 2);

      await sessionManager.saveAuthState({ uid: 'test' }, false);

      const retryCount = await localforage.getItem('session_auth_retry_count');
      expect(retryCount).toBe(0);
    });
  });

  describe('validateLogout', () => {
    it('should identify user-initiated logout as expected', async () => {
      const validation = await sessionManager.validateLogout(LOGOUT_REASONS.USER_INITIATED);

      expect(validation.isUnexpected).toBe(false);
      expect(validation.shouldRecover).toBe(false);
    });

    it('should identify unexpected logout with valid session', async () => {
      // Setup: User was authenticated
      await sessionManager.saveAuthState({ uid: 'test' }, false);

      // Simulate recent heartbeat
      await localforage.setItem('session_heartbeat', Date.now());

      const validation = await sessionManager.validateLogout(LOGOUT_REASONS.UNEXPECTED);

      expect(validation.isUnexpected).toBe(true);
      expect(validation.shouldRecover).toBe(true);
    });

    it('should identify network error with valid session as unexpected', async () => {
      await sessionManager.saveAuthState({ uid: 'test' }, false);
      await localforage.setItem('session_heartbeat', Date.now());

      const validation = await sessionManager.validateLogout(LOGOUT_REASONS.NETWORK_ERROR);

      expect(validation.isUnexpected).toBe(true);
      expect(validation.shouldRecover).toBe(true);
    });

    it('should not attempt recovery for guest mode', async () => {
      await sessionManager.saveAuthState(null, true);
      await localforage.setItem('session_heartbeat', Date.now());

      const validation = await sessionManager.validateLogout(LOGOUT_REASONS.UNEXPECTED);

      expect(validation.shouldRecover).toBe(false);
    });
  });

  describe('attemptRecovery', () => {
    it('should successfully recover with valid auth function', async () => {
      const mockAuthFunction = vi.fn().mockResolvedValue(true);

      const result = await sessionManager.attemptRecovery(mockAuthFunction);

      expect(result).toBe(true);
      expect(mockAuthFunction).toHaveBeenCalled();
    });

    it('should fail recovery after max attempts', async () => {
      await localforage.setItem('session_auth_retry_count', 3);

      const mockAuthFunction = vi.fn().mockResolvedValue(true);
      const result = await sessionManager.attemptRecovery(mockAuthFunction);

      expect(result).toBe(false);
      expect(mockAuthFunction).not.toHaveBeenCalled();
    });

    it('should increment retry count on failed recovery', async () => {
      const mockAuthFunction = vi.fn().mockResolvedValue(false);

      await sessionManager.attemptRecovery(mockAuthFunction);

      const retryCount = await localforage.getItem('session_auth_retry_count');
      expect(retryCount).toBe(1);
    });

    it('should call recovery callback on successful recovery', async () => {
      const onRecovery = vi.fn();
      await sessionManager.initialize({ onRecovery });

      const mockAuthFunction = vi.fn().mockResolvedValue(true);
      await sessionManager.attemptRecovery(mockAuthFunction);

      expect(onRecovery).toHaveBeenCalled();
    });
  });

  describe('handleUserLogout', () => {
    it('should clear all session data', async () => {
      await sessionManager.saveAuthState({ uid: 'test' }, false);
      await localforage.setItem('session_heartbeat', Date.now());

      await sessionManager.handleUserLogout();

      const authState = await localforage.getItem('session_last_auth_state');
      const userData = await localforage.getItem('session_last_user_data');
      const heartbeat = await localforage.getItem('session_heartbeat');

      expect(authState).toBeNull();
      expect(userData).toBeNull();
      expect(heartbeat).toBeNull();
    });

    it('should stop heartbeat', async () => {
      await sessionManager.initialize();
      await sessionManager.handleUserLogout();

      expect(sessionManager.heartbeatInterval).toBeNull();
    });

    it('should save user-initiated logout reason', async () => {
      await sessionManager.handleUserLogout();

      const logoutReason = await localforage.getItem('session_logout_reason');
      expect(logoutReason.reason).toBe(LOGOUT_REASONS.USER_INITIATED);
    });
  });

  describe('heartbeat', () => {
    it('should update heartbeat timestamp', async () => {
      await sessionManager.updateHeartbeat();

      const heartbeat = await localforage.getItem('session_heartbeat');
      expect(heartbeat).toBeGreaterThan(Date.now() - 1000);
    });

    it('should stop heartbeat when cleanup is called', async () => {
      await sessionManager.initialize();
      const intervalId = sessionManager.heartbeatInterval;

      await sessionManager.cleanup();

      expect(sessionManager.heartbeatInterval).toBeNull();
    });
  });

  describe('getStatus', () => {
    it('should return current session status', async () => {
      await sessionManager.saveAuthState({ uid: 'test' }, false);
      await sessionManager.updateHeartbeat();

      const status = await sessionManager.getStatus();

      expect(status.isAuthenticated).toBe(true);
      expect(status.isGuest).toBe(false);
      expect(status.lastHeartbeat).toBeDefined();
      expect(status.retryCount).toBe(0);
    });
  });
});
