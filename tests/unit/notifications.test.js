/**
 * Unit Tests for Notifications Module
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  showNotification,
  dismissNotification,
  dismissAll,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  getActiveCount,
  isActive
} from '../../js/modules/notifications.js';

describe('Notifications', () => {
  beforeEach(() => {
    // Clear any existing notifications
    dismissAll();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    dismissAll();
  });

  describe('showNotification', () => {
    it('should create notification container on first use', async () => {
      showNotification({ type: 'info', message: 'Test' });

      // Wait for async initialization
      await new Promise(resolve => setTimeout(resolve, 10));

      const container = document.getElementById('notification-container');
      expect(container).toBeTruthy();
    });

    it('should create notification element', async () => {
      const id = showNotification({ type: 'info', message: 'Test message' });

      // Wait for DOM update
      await new Promise(resolve => setTimeout(resolve, 10));

      const notification = document.getElementById(id);
      expect(notification).toBeTruthy();
      expect(notification.textContent).toContain('Test message');
    });

    it('should apply correct type class', async () => {
      const id = showNotification({ type: 'error', message: 'Error message' });
      await new Promise(resolve => setTimeout(resolve, 10));

      const notification = document.getElementById(id);
      expect(notification.classList.contains('notification-error')).toBe(true);
    });

    it('should include action buttons if provided', async () => {
      const onClick = vi.fn();
      const id = showNotification({
        type: 'info',
        message: 'Test',
        actions: [
          { label: 'Action 1', onClick },
          { label: 'Action 2', onClick: null }
        ]
      });
      await new Promise(resolve => setTimeout(resolve, 10));

      const notification = document.getElementById(id);
      const buttons = notification.querySelectorAll('.notification-action-btn');

      expect(buttons).toHaveLength(2);
      expect(buttons[0].textContent).toBe('Action 1');
      expect(buttons[1].textContent).toBe('Action 2');
    });

    it('should call action onClick and dismiss notification', async () => {
      const onClick = vi.fn();
      const id = showNotification({
        type: 'info',
        message: 'Test',
        actions: [{ label: 'Click me', onClick }],
        duration: 0 // Don't auto-dismiss
      });
      await new Promise(resolve => setTimeout(resolve, 10));

      const notification = document.getElementById(id);
      const button = notification.querySelector('.notification-action-btn');

      button.click();

      expect(onClick).toHaveBeenCalled();
      // Notification should be dismissed (check after animation)
      await new Promise(resolve => setTimeout(resolve, 400));
      expect(isActive(id)).toBe(false);
    });

    it('should show close button if closable=true', async () => {
      const id = showNotification({
        type: 'info',
        message: 'Test',
        closable: true,
        duration: 0
      });
      await new Promise(resolve => setTimeout(resolve, 10));

      const notification = document.getElementById(id);
      const closeBtn = notification.querySelector('.notification-close');

      expect(closeBtn).toBeTruthy();
    });

    it('should not show close button if closable=false', async () => {
      const id = showNotification({
        type: 'info',
        message: 'Test',
        closable: false,
        duration: 0
      });
      await new Promise(resolve => setTimeout(resolve, 10));

      const notification = document.getElementById(id);
      const closeBtn = notification.querySelector('.notification-close');

      expect(closeBtn).toBeFalsy();
    });

    it('should auto-dismiss after duration', async () => {
      const id = showNotification({
        type: 'info',
        message: 'Test',
        duration: 100
      });

      expect(isActive(id)).toBe(true);

      // Wait for auto-dismiss + animation
      await new Promise(resolve => setTimeout(resolve, 500));

      expect(isActive(id)).toBe(false);
    });

    it('should not auto-dismiss if duration=0', async () => {
      const id = showNotification({
        type: 'info',
        message: 'Test',
        duration: 0
      });

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(isActive(id)).toBe(true);
    });

    it('should limit to MAX_NOTIFICATIONS', () => {
      // Show 5 notifications (max is 3)
      for (let i = 0; i < 5; i++) {
        showNotification({ type: 'info', message: `Test ${i}`, duration: 0 });
      }

      expect(getActiveCount()).toBe(3);
    });
  });

  describe('dismissNotification', () => {
    it('should dismiss specific notification', () => {
      const id = showNotification({ type: 'info', message: 'Test', duration: 0 });

      expect(isActive(id)).toBe(true);

      dismissNotification(id);

      // Check after animation
      setTimeout(() => {
        expect(isActive(id)).toBe(false);
      }, 400);
    });

    it('should remove element from DOM', async () => {
      const id = showNotification({ type: 'info', message: 'Test', duration: 0 });

      dismissNotification(id);

      await new Promise(resolve => setTimeout(resolve, 400));

      const element = document.getElementById(id);
      expect(element).toBeFalsy();
    });

    it('should handle dismissing non-existent notification', () => {
      expect(() => {
        dismissNotification('non-existent-id');
      }).not.toThrow();
    });
  });

  describe('dismissAll', () => {
    it('should dismiss all active notifications', () => {
      showNotification({ type: 'info', message: 'Test 1', duration: 0 });
      showNotification({ type: 'info', message: 'Test 2', duration: 0 });
      showNotification({ type: 'info', message: 'Test 3', duration: 0 });

      expect(getActiveCount()).toBe(3);

      dismissAll();

      // Check after animation
      setTimeout(() => {
        expect(getActiveCount()).toBe(0);
      }, 400);
    });
  });

  describe('Convenience Functions', () => {
    it('showSuccess should create success notification', async () => {
      const id = showSuccess('Success!');
      await new Promise(resolve => setTimeout(resolve, 10));

      const notification = document.getElementById(id);
      expect(notification.classList.contains('notification-success')).toBe(true);
    });

    it('showError should create error notification', async () => {
      const id = showError('Error!');
      await new Promise(resolve => setTimeout(resolve, 10));

      const notification = document.getElementById(id);
      expect(notification.classList.contains('notification-error')).toBe(true);
    });

    it('showWarning should create warning notification', async () => {
      const id = showWarning('Warning!');
      await new Promise(resolve => setTimeout(resolve, 10));

      const notification = document.getElementById(id);
      expect(notification.classList.contains('notification-warning')).toBe(true);
    });

    it('showInfo should create info notification', async () => {
      const id = showInfo('Info!');
      await new Promise(resolve => setTimeout(resolve, 10));

      const notification = document.getElementById(id);
      expect(notification.classList.contains('notification-info')).toBe(true);
    });
  });

  describe('getActiveCount', () => {
    it('should return 0 when no notifications', () => {
      expect(getActiveCount()).toBe(0);
    });

    it('should return correct count', async () => {
      showNotification({ type: 'info', message: 'Test 1', duration: 0 });
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(getActiveCount()).toBe(1);

      showNotification({ type: 'info', message: 'Test 2', duration: 0 });
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(getActiveCount()).toBe(2);
    });
  });

  describe('isActive', () => {
    it('should return true for active notification', async () => {
      const id = showNotification({ type: 'info', message: 'Test', duration: 0 });
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(isActive(id)).toBe(true);
    });

    it('should return false for dismissed notification', async () => {
      const id = showNotification({ type: 'info', message: 'Test', duration: 0 });
      await new Promise(resolve => setTimeout(resolve, 10));
      dismissNotification(id);

      await new Promise(resolve => setTimeout(resolve, 400));

      expect(isActive(id)).toBe(false);
    });

    it('should return false for non-existent notification', () => {
      expect(isActive('non-existent-id')).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const id = showNotification({ type: 'info', message: 'Test' });
      await new Promise(resolve => setTimeout(resolve, 10));

      const notification = document.getElementById(id);
      expect(notification.getAttribute('role')).toBe('alert');
      expect(notification.getAttribute('aria-live')).toBe('assertive');
    });

    it('should have accessible close button', async () => {
      const id = showNotification({ type: 'info', message: 'Test', duration: 0 });
      await new Promise(resolve => setTimeout(resolve, 10));

      const notification = document.getElementById(id);
      const closeBtn = notification.querySelector('.notification-close');

      expect(closeBtn.getAttribute('aria-label')).toBe('Schließen');
    });
  });
});
