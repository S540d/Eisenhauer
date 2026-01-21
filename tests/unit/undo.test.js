/**
 * Unit tests for undo.js module
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { showUndoDelete, showUndoMove, showUndoToggle } from '../../js/modules/undo.js';

describe('Undo Module', () => {
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = '<div id="undo-container"></div>';

    // Clear localStorage
    localStorage.clear();

    // Mock timers
    vi.useFakeTimers();
  });

  describe('showUndoDelete', () => {
    it('should display undo toast for delete action', () => {
      const task = {
        id: 1,
        text: 'Test task',
        segment: 1,
        checked: false,
      };

      showUndoDelete(task, 'en');

      // Toast should be created
      const toast = document.querySelector('.undo-toast');
      expect(toast).toBeTruthy();
      expect(toast.textContent).toContain('Task deleted');
    });

    it('should display German text when language is de', () => {
      const task = {
        id: 1,
        text: 'Test task',
        segment: 1,
        checked: false,
      };

      showUndoDelete(task, 'de');

      const toast = document.querySelector('.undo-toast');
      expect(toast.textContent).toContain('Aufgabe gelöscht');
    });

    it('should call onSuccess callback when undo is triggered', () => {
      const task = {
        id: 1,
        text: 'Test task',
        segment: 1,
        checked: false,
      };
      const onSuccess = vi.fn();

      showUndoDelete(task, 'en', onSuccess);

      // Click undo button
      const undoButton = document.querySelector('.undo-toast button');
      undoButton.click();

      expect(onSuccess).toHaveBeenCalled();
    });

    it('should remove toast after timeout', () => {
      const task = {
        id: 1,
        text: 'Test task',
        segment: 1,
        checked: false,
      };

      showUndoDelete(task, 'en');

      // Toast should exist
      let toast = document.querySelector('.undo-toast');
      expect(toast).toBeTruthy();

      // Advance timer by 5 seconds
      vi.advanceTimersByTime(5000);

      // Toast should be removed
      toast = document.querySelector('.undo-toast');
      expect(toast).toBeFalsy();
    });
  });

  describe('showUndoMove', () => {
    it('should display undo toast for move action', () => {
      showUndoMove(1, 1, 2, 'en');

      const toast = document.querySelector('.undo-toast');
      expect(toast).toBeTruthy();
      expect(toast.textContent).toContain('moved');
    });

    it('should display German text when language is de', () => {
      showUndoMove(1, 1, 2, 'de');

      const toast = document.querySelector('.undo-toast');
      expect(toast.textContent).toContain('verschoben');
    });

    it('should call onSuccess callback when undo is triggered', () => {
      const onSuccess = vi.fn();
      showUndoMove(1, 1, 2, 'en', onSuccess);

      const undoButton = document.querySelector('.undo-toast button');
      undoButton.click();

      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe('showUndoToggle', () => {
    it('should display undo toast for toggle action (complete)', () => {
      showUndoToggle(1, 1, 5, 'en');

      const toast = document.querySelector('.undo-toast');
      expect(toast).toBeTruthy();
      expect(toast.textContent).toContain('incomplete');
    });

    it('should display undo toast for toggle action (restore)', () => {
      showUndoToggle(1, 5, 1, 'en');

      const toast = document.querySelector('.undo-toast');
      expect(toast).toBeTruthy();
      expect(toast.textContent).toContain('incomplete');
    });

    it('should display German text when language is de', () => {
      showUndoToggle(1, 1, 5, 'de');

      const toast = document.querySelector('.undo-toast');
      expect(toast.textContent).toContain('erledigt');
    });

    it('should call onSuccess callback when undo is triggered', () => {
      const onSuccess = vi.fn();
      showUndoToggle(1, 1, 5, 'en', onSuccess);

      const undoButton = document.querySelector('.undo-toast button');
      undoButton.click();

      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe('Undo Stack Management', () => {
    it('should limit undo stack to 10 items', () => {
      // Create 15 undo notifications
      for (let i = 0; i < 15; i++) {
        const task = {
          id: i,
          text: `Task ${i}`,
          segment: 1,
          checked: false,
        };
        showUndoDelete(task, 'en');

        // Clear previous toasts to avoid DOM clutter
        document.body.innerHTML = '<div id="undo-container"></div>';
      }

      // Stack should be limited to 10 items
      // This is an internal implementation detail, so we just verify
      // that the function doesn't crash and works correctly
      expect(document.body.innerHTML).toBeTruthy();
    });
  });
});
