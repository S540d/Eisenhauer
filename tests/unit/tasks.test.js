/**
 * Unit Tests for Tasks Module
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SEGMENTS } from '../../js/modules/config.js';
import {
  setCurrentTask,
  getCurrentTask,
  clearCurrentTask,
  addTaskToSegment,
  restoreTask,
  deleteTask,
  moveTask,
  reorderTask,
  toggleTask,
  getTasks,
  getTask,
  getAllTasks,
  setAllTasks,
  getTaskCount,
  getTotalTaskCount,
  updateTask,
  filterTasks,
  filterByCategory,
  getCompletedTasks,
  clearCompletedTasks,
  getRecurringDescription,
  applySmartRules,
} from '../../js/modules/tasks.js';

const createEmptyTasks = () => ({
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
});

describe('Tasks', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T10:00:00Z'));
    setAllTasks(createEmptyTasks());
    clearCurrentTask();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('current task helpers', () => {
    it('should set, get and clear the current task', () => {
      const task = { id: 1, text: 'Focus' };

      setCurrentTask(task);
      expect(getCurrentTask()).toBe(task);

      clearCurrentTask();
      expect(getCurrentTask()).toBeNull();
    });
  });

  describe('task creation and restoration', () => {
    it('should add a task with recurring, due date and category metadata', () => {
      const saveCallback = vi.fn();
      const recurring = { enabled: true, interval: 'weekly', weekdays: [1, 3] };

      const task = addTaskToSegment(
        'Plan sprint',
        SEGMENTS.SCHEDULE,
        recurring,
        saveCallback,
        '2026-01-20',
        'business'
      );

      expect(task).toMatchObject({
        text: 'Plan sprint',
        segment: SEGMENTS.SCHEDULE,
        checked: false,
        dueDate: '2026-01-20',
        category: 'business',
        recurring: {
          enabled: true,
          interval: 'weekly',
          weekdays: [1, 3],
          dayOfMonth: 1,
          customDays: 1,
        },
      });
      expect(saveCallback).toHaveBeenCalledWith(task);
      expect(getTaskCount(SEGMENTS.SCHEDULE)).toBe(1);
      expect(getTotalTaskCount()).toBe(1);
    });

    it('should validate task creation and restoration input', () => {
      expect(() => addTaskToSegment(42, SEGMENTS.DO)).toThrow(TypeError);
      expect(() => addTaskToSegment('', SEGMENTS.DO)).toThrow('Task text cannot be empty');
      expect(() => addTaskToSegment('x'.repeat(141), SEGMENTS.DO)).toThrow(
        'Task text must not exceed 140 characters'
      );
      expect(() => addTaskToSegment('Task', 6)).toThrow(RangeError);

      expect(() => restoreTask()).toThrow(TypeError);
      expect(() => restoreTask({ id: 1, segment: 0 })).toThrow(RangeError);
      expect(() => restoreTask({ segment: SEGMENTS.DO })).toThrow('Task ID is required');
    });

    it('should restore and delete tasks with callbacks', () => {
      const task = {
        id: 101,
        text: 'Recovered',
        segment: SEGMENTS.DELEGATE,
        checked: false,
        createdAt: Date.now(),
        completedAt: null,
        category: 'business',
      };
      const saveCallback = vi.fn();
      const deleteCallback = vi.fn();

      expect(restoreTask(task, saveCallback)).toBe(task);
      expect(getTask(task.id, SEGMENTS.DELEGATE)).toBe(task);
      expect(saveCallback).toHaveBeenCalledWith(task);

      expect(deleteTask(task.id, SEGMENTS.DELEGATE, deleteCallback)).toBe(true);
      expect(deleteCallback).toHaveBeenCalledWith(task.id);
      expect(deleteTask(task.id, SEGMENTS.DELEGATE)).toBe(false);
    });
  });

  describe('moving and reordering', () => {
    it('should move tasks between segments while preserving metadata', () => {
      const task = {
        id: 7,
        text: 'Move me',
        segment: SEGMENTS.DO,
        checked: false,
        createdAt: Date.now(),
        completedAt: 123456,
        dueDate: '2026-01-18',
        category: 'private',
        recurring: { enabled: true, interval: 'daily', weekdays: [], dayOfMonth: 1, customDays: 1 },
      };
      const saveCallback = vi.fn();
      setAllTasks({
        ...createEmptyTasks(),
        [SEGMENTS.DO]: [task],
      });

      const movedTask = moveTask(task.id, SEGMENTS.DO, SEGMENTS.SCHEDULE, saveCallback);

      expect(movedTask).toMatchObject({
        id: task.id,
        text: 'Move me',
        segment: SEGMENTS.SCHEDULE,
        dueDate: '2026-01-18',
        category: 'private',
        recurring: task.recurring,
        completedAt: 123456,
      });
      expect(getTask(task.id, SEGMENTS.DO)).toBeNull();
      expect(getTask(task.id, SEGMENTS.SCHEDULE)).toEqual(movedTask);
      expect(saveCallback).toHaveBeenCalledWith(movedTask);
      expect(moveTask(999, SEGMENTS.DO, SEGMENTS.SCHEDULE)).toBeNull();
      expect(() => moveTask(null, SEGMENTS.DO, SEGMENTS.SCHEDULE)).toThrow(
        'Task ID cannot be null or undefined'
      );
      expect(() => moveTask(task.id, 0, SEGMENTS.SCHEDULE)).toThrow(RangeError);
      expect(() => moveTask(task.id, SEGMENTS.DO, 6)).toThrow(RangeError);
    });

    it('should reorder tasks, clamp indexes and validate arguments', () => {
      const tasks = [
        { id: 1, text: 'One', segment: SEGMENTS.SCHEDULE, checked: false, createdAt: Date.now() },
        { id: 2, text: 'Two', segment: SEGMENTS.SCHEDULE, checked: false, createdAt: Date.now() },
        { id: 3, text: 'Three', segment: SEGMENTS.SCHEDULE, checked: false, createdAt: Date.now() },
      ];
      const saveCallback = vi.fn();
      setAllTasks({
        ...createEmptyTasks(),
        [SEGMENTS.SCHEDULE]: [...tasks],
      });

      expect(reorderTask(2, SEGMENTS.SCHEDULE, 0, saveCallback)?.id).toBe(2);
      expect(getAllTasks()[SEGMENTS.SCHEDULE].map((task) => task.id)).toEqual([2, 1, 3]);
      expect(saveCallback).toHaveBeenCalledWith(expect.objectContaining({ id: 2 }));

      saveCallback.mockClear();
      expect(reorderTask(2, SEGMENTS.SCHEDULE, 0)).toEqual(expect.objectContaining({ id: 2 }));
      expect(saveCallback).not.toHaveBeenCalled();

      expect(reorderTask(2, SEGMENTS.SCHEDULE, 99)?.id).toBe(2);
      expect(getAllTasks()[SEGMENTS.SCHEDULE].map((task) => task.id)).toEqual([1, 3, 2]);
      expect(reorderTask(999, SEGMENTS.SCHEDULE, 1)).toBeNull();
      expect(() => reorderTask(null, SEGMENTS.SCHEDULE, 1)).toThrow(
        'Task ID cannot be null or undefined'
      );
      expect(() => reorderTask(1, 0, 1)).toThrow(RangeError);
      expect(() => reorderTask(1, SEGMENTS.SCHEDULE, -1)).toThrow(
        'New index must be a non-negative integer'
      );
    });
  });

  describe('completion handling', () => {
    it('should complete recurring tasks and create the next hidden occurrence', () => {
      const saveCallback = vi.fn();
      const task = {
        id: 200,
        text: 'Weekly review',
        segment: SEGMENTS.DO,
        checked: false,
        createdAt: Date.now(),
        completedAt: null,
        dueDate: '2026-01-16',
        category: 'business',
        recurring: {
          enabled: true,
          interval: 'weekly',
          weekdays: [5],
          dayOfMonth: 1,
          customDays: 1,
        },
      };
      setAllTasks({
        ...createEmptyTasks(),
        [SEGMENTS.DO]: [task],
      });

      const result = toggleTask(task.id, SEGMENTS.DO, saveCallback);
      const rawTasks = getAllTasks();

      expect(result).toMatchObject({
        action: 'completed',
        fromSegment: SEGMENTS.DO,
        toSegment: SEGMENTS.DONE,
      });
      expect(rawTasks[SEGMENTS.DO]).toHaveLength(1);
      expect(rawTasks[SEGMENTS.DONE]).toHaveLength(1);
      expect(getTasks(SEGMENTS.DO)).toHaveLength(0);
      expect(rawTasks[SEGMENTS.DO][0]).toMatchObject({
        text: 'Weekly review',
        segment: SEGMENTS.DO,
        dueDate: '2026-01-16',
        category: 'business',
      });
      expect(rawTasks[SEGMENTS.DO][0].recurring).toEqual({
        enabled: true,
        interval: 'weekly',
        weekdays: [5],
        dayOfMonth: 1,
        customDays: 1,
      });
      // createdAt for the hidden recurring follow-up is set to the next due date timestamp (future), not the creation time
      expect(rawTasks[SEGMENTS.DO][0].createdAt).toBeGreaterThan(Date.now());
      expect(rawTasks[SEGMENTS.DONE][0]).toMatchObject({
        id: 200,
        segment: SEGMENTS.DONE,
        checked: true,
        dueDate: '2026-01-16',
        category: 'business',
      });
      expect(rawTasks[SEGMENTS.DONE][0].recurring).toBeUndefined();
      expect(saveCallback).toHaveBeenCalledWith(
        rawTasks[SEGMENTS.DONE][0],
        rawTasks[SEGMENTS.DO][0]
      );
    });

    it('should handle monthly and custom recurring intervals correctly', () => {
      vi.setSystemTime(new Date('2026-01-15T10:00:00Z'));

      // Monthly recurring
      const monthlyTask = {
        id: 300,
        text: 'Monthly review',
        segment: 1,
        checked: false,
        createdAt: Date.now(),
        completedAt: null,
        recurring: {
          enabled: true,
          interval: 'monthly',
          weekdays: [],
          dayOfMonth: 15,
          customDays: 1,
        },
      };
      setAllTasks({ 1: [monthlyTask], 2: [], 3: [], 4: [], 5: [] });

      const monthlyResult = toggleTask(monthlyTask.id, 1);
      expect(monthlyResult.action).toBe('completed');
      const rawAfterMonthly = getAllTasks();
      const nextMonthly = rawAfterMonthly[1][0];
      // Next occurrence should be in February
      expect(new Date(nextMonthly.createdAt).getMonth()).toBe(1); // February = month index 1

      // Custom recurring (7 days)
      setAllTasks({ 1: [], 2: [], 3: [], 4: [], 5: [] });
      const customTask = {
        id: 301,
        text: 'Custom recurring',
        segment: 1,
        checked: false,
        createdAt: Date.now(),
        completedAt: null,
        recurring: {
          enabled: true,
          interval: 'custom',
          weekdays: [],
          dayOfMonth: 1,
          customDays: 7,
        },
      };
      setAllTasks({ 1: [customTask], 2: [], 3: [], 4: [], 5: [] });

      const customResult = toggleTask(customTask.id, 1);
      expect(customResult.action).toBe('completed');
      const rawAfterCustom = getAllTasks();
      const nextCustom = rawAfterCustom[1][0];
      // Next occurrence should be 7 days in the future
      const expectedNextCustom = new Date('2026-01-22T00:00:00.000Z').getTime();
      expect(nextCustom.createdAt).toBe(expectedNextCustom);
    });

    it('should restore completed tasks back to the Do segment', () => {
      const task = {
        id: 201,
        text: 'Done already',
        segment: SEGMENTS.DONE,
        checked: true,
        createdAt: Date.now(),
        completedAt: Date.now(),
      };
      const saveCallback = vi.fn();
      setAllTasks({
        ...createEmptyTasks(),
        [SEGMENTS.DONE]: [task],
      });

      const result = toggleTask(task.id, SEGMENTS.DONE, saveCallback);

      expect(result).toMatchObject({
        action: 'restored',
        fromSegment: SEGMENTS.DONE,
        toSegment: SEGMENTS.DO,
      });
      expect(getTask(task.id, SEGMENTS.DONE)).toBeNull();
      expect(getTask(task.id, SEGMENTS.DO)).toMatchObject({
        id: 201,
        checked: false,
        completedAt: null,
        segment: SEGMENTS.DO,
      });
      expect(saveCallback).toHaveBeenCalledWith(expect.objectContaining({ id: 201 }), null);
      expect(toggleTask(999, SEGMENTS.DO)).toBeNull();
    });
  });

  describe('query and filter helpers', () => {
    it('should update tasks and expose counts', () => {
      const task = addTaskToSegment('Inbox', SEGMENTS.DO);

      expect(
        updateTask(task.id, SEGMENTS.DO, { category: 'business', checked: true })
      ).toMatchObject({
        category: 'business',
        checked: true,
      });
      expect(updateTask(999, SEGMENTS.DO, { checked: true })).toBeNull();
      expect(getTaskCount(SEGMENTS.DO)).toBe(1);
      expect(getTaskCount(99)).toBe(0);
      expect(getTotalTaskCount()).toBe(1);
    });

    it('should filter by search term and category', () => {
      const allTasks = {
        ...createEmptyTasks(),
        1: [
          { id: 1, text: 'Business Plan', category: 'business' },
          { id: 2, text: 'Private call' },
        ],
        2: [{ id: 3, text: 'Read Book', category: 'private' }],
      };
      setAllTasks(allTasks);

      expect(filterTasks('plan')[1]).toEqual([
        { id: 1, text: 'Business Plan', category: 'business' },
      ]);
      expect(filterTasks('')[1]).toBe(allTasks[1]);

      expect(filterByCategory(allTasks, null)).toBe(allTasks);
      // Tasks without a category field default to 'private' (see filterByCategory: task.category || 'private')
      expect(filterByCategory(allTasks, 'private')).toEqual({
        1: [{ id: 2, text: 'Private call' }],
        2: [{ id: 3, text: 'Read Book', category: 'private' }],
        3: [],
        4: [],
        5: [],
      });
      expect(filterByCategory(allTasks, 'business')[1]).toEqual([
        { id: 1, text: 'Business Plan', category: 'business' },
      ]);
    });

    it('should return and clear completed tasks', () => {
      setAllTasks({
        ...createEmptyTasks(),
        [SEGMENTS.DONE]: [
          { id: 1, text: 'Done 1' },
          { id: 2, text: 'Done 2' },
        ],
      });
      const deleteCallback = vi.fn();

      expect(getCompletedTasks()).toHaveLength(2);

      clearCompletedTasks(deleteCallback);

      expect(getCompletedTasks()).toEqual([]);
      expect(deleteCallback).toHaveBeenCalledWith([1, 2]);
    });
  });

  describe('recurring descriptions and smart rules', () => {
    const translationStub = {
      recurring: {
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
        custom: 'Every',
        customDays: 'days',
        dayOfMonth: 'Day',
        weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      },
    };

    it('should generate recurring descriptions for supported intervals', () => {
      expect(getRecurringDescription(null, translationStub)).toBe('');
      expect(getRecurringDescription({ enabled: false }, translationStub)).toBe('');
      expect(getRecurringDescription({ enabled: true, interval: 'daily' }, translationStub)).toBe(
        'Daily'
      );
      expect(
        getRecurringDescription(
          { enabled: true, interval: 'weekly', weekdays: [1, 3] },
          translationStub
        )
      ).toBe('Weekly: Mon, Wed');
      expect(
        getRecurringDescription(
          { enabled: true, interval: 'monthly', dayOfMonth: 12 },
          translationStub
        )
      ).toBe('Monthly: Day 12');
      expect(
        getRecurringDescription(
          { enabled: true, interval: 'custom', customDays: 5 },
          translationStub
        )
      ).toBe('Every: 5 days');
      expect(
        getRecurringDescription({ enabled: true, interval: 'unexpected' }, translationStub)
      ).toBe('');
    });

    it('should return weekly description when weekdays is empty array (falls back to generic label)', () => {
      const translationStub = {
        recurring: {
          daily: 'Daily',
          weekly: 'Weekly',
          monthly: 'Monthly',
          custom: 'Every',
          customDays: 'days',
          dayOfMonth: 'Day',
          weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        },
      };
      expect(
        getRecurringDescription(
          { enabled: true, interval: 'weekly', weekdays: [] },
          translationStub
        )
      ).toBe('Weekly');
      expect(getRecurringDescription({ enabled: true, interval: 'weekly' }, translationStub)).toBe(
        'Weekly'
      );
    });

    it('should apply and clear urgency rules based on due dates', () => {
      const tasksToProcess = {
        ...createEmptyTasks(),
        1: [
          { id: 1, text: 'Soon', segment: SEGMENTS.DO, dueDate: '2026-01-17T10:00:00Z' },
          {
            id: 2,
            text: 'Later',
            segment: SEGMENTS.DO,
            dueDate: '2026-01-25T10:00:00Z',
            isUrgent: true,
          },
        ],
        2: [{ id: 3, text: 'No due date', segment: SEGMENTS.SCHEDULE, isUrgent: true }],
        5: [
          {
            id: 4,
            text: 'Completed',
            segment: SEGMENTS.DONE,
            dueDate: Date.now() + 1000,
            isUrgent: true,
          },
        ],
      };

      const urgentTasks = applySmartRules(tasksToProcess, true, 3);

      expect(urgentTasks[1][0]).toMatchObject({ id: 1, isUrgent: true });
      expect(urgentTasks[1][1].isUrgent).toBeUndefined();
      expect(urgentTasks[2][0].isUrgent).toBeUndefined();
      expect(urgentTasks[5][0].isUrgent).toBeUndefined();

      const clearedTasks = applySmartRules(tasksToProcess, false);
      expect(clearedTasks[1][0].isUrgent).toBeUndefined();
      expect(clearedTasks[1][1].isUrgent).toBeUndefined();
    });
  });
});
