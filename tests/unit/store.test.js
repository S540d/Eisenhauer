/**
 * Unit Tests for Store Module
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Store } from '../../js/modules/store.js';

describe('Store', () => {
  let store;

  beforeEach(() => {
    store = new Store();
  });

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      const state = store.getState();

      expect(state.currentUser).toBeNull();
      expect(state.db).toBeNull();
      expect(state.isGuestMode).toBe(true);
      expect(state.tasks).toEqual({
        1: [],
        2: [],
        3: [],
        4: [],
        5: []
      });
      expect(state.isDragging).toBe(false);
      expect(state.draggedTask).toBeNull();
    });

    it('should detect initial network status', () => {
      const state = store.getState();
      expect(state.networkStatus).toBe('online');
    });

    it('should load language from localStorage or default to browser language', () => {
      const state = store.getState();
      expect(['de', 'en']).toContain(state.language);
    });
  });

  describe('setState', () => {
    it('should update state with partial updates', () => {
      store.setState({ isGuestMode: false });

      const state = store.getState();
      expect(state.isGuestMode).toBe(false);
    });

    it('should merge updates with existing state', () => {
      store.setState({ isGuestMode: false });
      store.setState({ language: 'en' });

      const state = store.getState();
      expect(state.isGuestMode).toBe(false);
      expect(state.language).toBe('en');
    });

    it('should notify listeners on state change', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      store.setState({ isGuestMode: false }, 'test');

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ isGuestMode: false }),
        expect.objectContaining({ isGuestMode: true })
      );
    });
  });

  describe('setNestedState', () => {
    it('should update nested state by path', () => {
      store.setNestedState('tasks.1', [{ id: '1', text: 'Task 1' }]);

      const state = store.getState();
      expect(state.tasks[1]).toEqual([{ id: '1', text: 'Task 1' }]);
    });

    it('should not mutate original nested objects', () => {
      const originalTasks = store.getState().tasks;

      store.setNestedState('tasks.1', [{ id: '1', text: 'Task 1' }]);

      expect(store.getState().tasks).not.toBe(originalTasks);
    });
  });

  describe('subscribe', () => {
    it('should allow subscribing to state changes', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      store.setState({ language: 'en' });

      expect(listener).toHaveBeenCalled();
    });

    it('should return unsubscribe function', () => {
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      unsubscribe();
      store.setState({ language: 'en' });

      expect(listener).not.toHaveBeenCalled();
    });

    it('should support multiple listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      store.subscribe(listener1);
      store.subscribe(listener2);

      store.setState({ language: 'en' });

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });
  });

  describe('subscribeToKeys', () => {
    it('should only notify when watched keys change', () => {
      const listener = vi.fn();

      // Set initial state to a known value
      store.setState({ language: 'de' });

      // Now subscribe and change to a different value
      store.subscribeToKeys('language', listener);

      store.setState({ language: 'en' });
      expect(listener).toHaveBeenCalledTimes(1);

      store.setState({ theme: 'dark' });
      expect(listener).toHaveBeenCalledTimes(1); // Not called again
    });

    it('should support watching multiple keys', () => {
      const listener = vi.fn();

      // Set initial state to known values
      store.setState({ language: 'de', theme: 'light' });

      // Now subscribe and make changes
      store.subscribeToKeys(['language', 'theme'], listener);

      store.setState({ language: 'en' });
      expect(listener).toHaveBeenCalledTimes(1);

      store.setState({ theme: 'dark' });
      expect(listener).toHaveBeenCalledTimes(2);

      store.setState({ isGuestMode: false });
      expect(listener).toHaveBeenCalledTimes(2); // Not called
    });
  });

  describe('reset', () => {
    it('should reset state to defaults', () => {
      store.setState({
        isGuestMode: false,
        language: 'en',
        tasks: { 1: [{ id: '1', text: 'Task' }], 2: [], 3: [], 4: [], 5: [] }
      });

      store.reset();

      const state = store.getState();
      expect(state.isGuestMode).toBe(true);
      expect(state.tasks).toEqual({ 1: [], 2: [], 3: [], 4: [], 5: [] });
    });

    it('should keep auth state if keepAuth=true', () => {
      const user = { uid: '123', email: 'test@example.com' };
      const db = { collection: vi.fn() };

      store.setState({ currentUser: user, db, isGuestMode: false });

      store.reset(true);

      const state = store.getState();
      expect(state.currentUser).toEqual(user);
      expect(state.db).toEqual(db);
      expect(state.isGuestMode).toBe(false);
    });
  });

  describe('Convenience Methods', () => {
    it('getCurrentUser should return current user', () => {
      const user = { uid: '123' };
      store.setState({ currentUser: user });

      expect(store.getCurrentUser()).toEqual(user);
    });

    it('getDb should return database instance', () => {
      const db = { collection: vi.fn() };
      store.setState({ db });

      expect(store.getDb()).toEqual(db);
    });

    it('getTasks should return all tasks', () => {
      const tasks = { 1: [{ id: '1' }], 2: [], 3: [], 4: [], 5: [] };
      store.setState({ tasks });

      expect(store.getTasks()).toEqual(tasks);
    });

    it('getTasksBySegment should return tasks for specific segment', () => {
      const tasks = { 1: [{ id: '1' }, { id: '2' }], 2: [], 3: [], 4: [], 5: [] };
      store.setState({ tasks });

      const segment1Tasks = store.getTasksBySegment(1);
      expect(segment1Tasks).toHaveLength(2);
      expect(segment1Tasks[0].id).toBe('1');
    });

    it('isGuest should return guest mode status', () => {
      expect(store.isGuest()).toBe(true);

      store.setState({ isGuestMode: false });
      expect(store.isGuest()).toBe(false);
    });

    it('isOnline should return network status', () => {
      expect(store.isOnline()).toBe(true);

      store.setState({ networkStatus: 'offline' });
      expect(store.isOnline()).toBe(false);
    });

    it('getPendingSync should return sync queue length', () => {
      expect(store.getPendingSync()).toBe(0);

      store.setState({ syncQueue: [{ id: '1' }, { id: '2' }] });
      expect(store.getPendingSync()).toBe(2);
    });
  });

  describe('State Immutability', () => {
    it('should return frozen state from getState', () => {
      const state = store.getState();

      expect(() => {
        state.isGuestMode = false;
      }).toThrow();
    });

    it('should not allow direct mutation of nested objects', () => {
      const state = store.getState();

      expect(() => {
        state.tasks[1].push({ id: '1' });
      }).toThrow();
    });
  });

  describe('Network Listeners', () => {
    it('should update networkStatus when going offline', () => {
      const listener = vi.fn();
      store.subscribeToKeys('networkStatus', listener);

      // Simulate offline event
      window.dispatchEvent(new Event('offline'));

      expect(store.getState().networkStatus).toBe('offline');
      expect(listener).toHaveBeenCalled();
    });

    it('should update networkStatus when going online', () => {
      store.setState({ networkStatus: 'offline' });

      const listener = vi.fn();
      store.subscribeToKeys('networkStatus', listener);

      // Simulate online event
      window.dispatchEvent(new Event('online'));

      expect(store.getState().networkStatus).toBe('online');
      expect(listener).toHaveBeenCalled();
    });
  });
});
