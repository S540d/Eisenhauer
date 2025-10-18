/**
 * Unit Tests for Error Handler Module
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  DragDropError,
  TaskMoveError,
  StorageError,
  NetworkError,
  SyncError,
  ErrorHandler,
  withErrorHandling,
  errorBoundary
} from '../../js/modules/error-handler.js';

describe('Error Classes', () => {
  it('should create DragDropError with code and details', () => {
    const error = new DragDropError('Test error', 'TEST_CODE', { foo: 'bar' });

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('DragDropError');
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_CODE');
    expect(error.details).toEqual({ foo: 'bar' });
    expect(error.timestamp).toBeTruthy();
  });

  it('should create TaskMoveError', () => {
    const error = new TaskMoveError('Move failed');

    expect(error).toBeInstanceOf(DragDropError);
    expect(error.name).toBe('TaskMoveError');
    expect(error.code).toBe('TASK_MOVE_ERROR');
  });

  it('should create StorageError', () => {
    const error = new StorageError('Storage failed');

    expect(error).toBeInstanceOf(DragDropError);
    expect(error.name).toBe('StorageError');
    expect(error.code).toBe('STORAGE_ERROR');
  });

  it('should create NetworkError', () => {
    const error = new NetworkError('Network failed');

    expect(error).toBeInstanceOf(DragDropError);
    expect(error.name).toBe('NetworkError');
    expect(error.code).toBe('NETWORK_ERROR');
  });

  it('should create SyncError', () => {
    const error = new SyncError('Sync failed');

    expect(error).toBeInstanceOf(DragDropError);
    expect(error.name).toBe('SyncError');
    expect(error.code).toBe('SYNC_ERROR');
  });
});

describe('ErrorHandler', () => {
  beforeEach(() => {
    ErrorHandler.clearHistory();
    vi.clearAllMocks();
  });

  describe('handleError', () => {
    it('should add error to history', () => {
      const error = new Error('Test error');
      ErrorHandler.handleError(error, { operation: 'test', silent: true });

      const history = ErrorHandler.getErrorHistory();
      expect(history).toHaveLength(1);
      expect(history[0].error.message).toBe('Test error');
      expect(history[0].context.operation).toBe('test');
    });

    it('should call rollback if provided', () => {
      const rollback = vi.fn();
      const error = new TaskMoveError('Test error');

      ErrorHandler.handleDragError(error, { rollback, silent: true });

      expect(rollback).toHaveBeenCalled();
    });

    it('should handle rollback errors gracefully', () => {
      const rollback = vi.fn(() => {
        throw new Error('Rollback failed');
      });
      const error = new Error('Test error');

      expect(() => {
        ErrorHandler.handleError(error, { rollback, silent: true });
      }).not.toThrow();
    });

    it('should route to specific handler based on error type', () => {
      const taskError = new TaskMoveError('Move failed');
      ErrorHandler.handleError(taskError, { silent: true });

      const history = ErrorHandler.getErrorHistory();
      expect(history).toHaveLength(1);
      expect(history[0].error.name).toBe('TaskMoveError');
    });
  });

  describe('Error History', () => {
    it('should track error history', () => {
      ErrorHandler.handleError(new Error('Error 1'), { silent: true });
      ErrorHandler.handleError(new Error('Error 2'), { silent: true });

      expect(ErrorHandler.getErrorHistory()).toHaveLength(2);
    });

    it('should limit history size', () => {
      // Add more than MAX_HISTORY errors
      for (let i = 0; i < 60; i++) {
        ErrorHandler.handleError(new Error(`Error ${i}`), { silent: true });
      }

      const history = ErrorHandler.getErrorHistory();
      expect(history.length).toBeLessThanOrEqual(50);
    });

    it('should clear history', () => {
      ErrorHandler.handleError(new Error('Error'), { silent: true });
      expect(ErrorHandler.getErrorHistory()).toHaveLength(1);

      ErrorHandler.clearHistory();
      expect(ErrorHandler.getErrorHistory()).toHaveLength(0);
    });
  });

  describe('getStats', () => {
    it('should return error statistics', () => {
      ErrorHandler.handleError(new TaskMoveError('Move 1'), {
        operation: 'moveTask',
        silent: true
      });
      ErrorHandler.handleError(new TaskMoveError('Move 2'), {
        operation: 'moveTask',
        silent: true
      });
      ErrorHandler.handleError(new StorageError('Storage error'), {
        operation: 'saveTask',
        silent: true
      });

      const stats = ErrorHandler.getStats();

      expect(stats.total).toBe(3);
      expect(stats.byType.TaskMoveError).toBe(2);
      expect(stats.byType.StorageError).toBe(1);
      expect(stats.byOperation.moveTask).toBe(2);
      expect(stats.byOperation.saveTask).toBe(1);
      expect(stats.recent).toHaveLength(3);
    });
  });
});

describe('withErrorHandling', () => {
  beforeEach(() => {
    ErrorHandler.clearHistory();
  });

  it('should wrap function with error handling', async () => {
    const fn = vi.fn(async () => {
      throw new Error('Test error');
    });

    const wrapped = withErrorHandling(fn, { silent: true });

    await expect(wrapped()).rejects.toThrow('Test error');

    expect(fn).toHaveBeenCalled();
    expect(ErrorHandler.getErrorHistory()).toHaveLength(1);
  });

  it('should pass through successful results', async () => {
    const fn = vi.fn(async () => 'success');

    const wrapped = withErrorHandling(fn);

    const result = await wrapped();

    expect(result).toBe('success');
    expect(ErrorHandler.getErrorHistory()).toHaveLength(0);
  });
});

describe('errorBoundary', () => {
  beforeEach(() => {
    ErrorHandler.clearHistory();
  });

  it('should catch errors and return result object', async () => {
    const operation = async () => {
      throw new Error('Test error');
    };

    const result = await errorBoundary(operation, { silent: true });

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
    expect(result.result).toBeNull();
    expect(ErrorHandler.getErrorHistory()).toHaveLength(1);
  });

  it('should return success result on no error', async () => {
    const operation = async () => 'success value';

    const result = await errorBoundary(operation);

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(result.result).toBe('success value');
    expect(ErrorHandler.getErrorHistory()).toHaveLength(0);
  });
});
