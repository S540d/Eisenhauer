/**
 * sanitizeTasks tests
 *
 * Follow-up to the "stuck on start screen" fix: corrupt tasks are not just
 * skipped at render time, they are repaired on load and persisted back so the
 * corruption does not return on every reload.
 */

import { describe, it, expect } from 'vitest';
import { sanitizeTasks } from '../../js/modules/tasks.js';

describe('sanitizeTasks', () => {
  it('leaves healthy tasks untouched and reports no change', () => {
    const input = {
      1: [{ id: 'a', segment: 1, text: 'Ok', checked: false, dueDate: '2026-06-10' }],
      2: [],
      3: [],
      4: [],
      5: [{ id: 'b', segment: 5, text: 'Done', checked: true, completedAt: 1770000000000 }],
    };
    const { tasks, repairedTaskIds, changed } = sanitizeTasks(input);
    expect(changed).toBe(false);
    expect(repairedTaskIds).toEqual([]);
    expect(tasks[1][0].dueDate).toBe('2026-06-10');
    expect(tasks[5][0].completedAt).toBe(1770000000000);
  });

  it('drops an invalid dueDate but keeps the task', () => {
    const { tasks, repairedTaskIds, changed } = sanitizeTasks({
      1: [{ id: 'a', segment: 1, text: 'Bad date', dueDate: 'garbage' }],
    });
    expect(changed).toBe(true);
    expect(repairedTaskIds).toContain('a');
    expect(tasks[1][0].text).toBe('Bad date');
    expect('dueDate' in tasks[1][0]).toBe(false);
  });

  it('drops an invalid completedAt but keeps the task', () => {
    const { tasks, changed } = sanitizeTasks({
      5: [{ id: 'd', segment: 5, text: 'Done bad', completedAt: 'nope' }],
    });
    expect(changed).toBe(true);
    expect('completedAt' in tasks[5][0]).toBe(false);
  });

  it('drops a malformed recurring object', () => {
    const { tasks, changed } = sanitizeTasks({
      1: [
        { id: 'r1', segment: 1, text: 'Bad recurring', recurring: 'weekly' },
        {
          id: 'r2',
          segment: 1,
          text: 'Bad interval',
          recurring: { enabled: true, interval: 'xx' },
        },
        {
          id: 'r3',
          segment: 1,
          text: 'Good recurring',
          recurring: { enabled: true, interval: 'weekly' },
        },
      ],
    });
    expect(changed).toBe(true);
    expect('recurring' in tasks[1][0]).toBe(false);
    expect('recurring' in tasks[1][1]).toBe(false);
    expect(tasks[1][2].recurring).toEqual({ enabled: true, interval: 'weekly' });
  });

  it('drops structurally unusable tasks (no string text)', () => {
    const { tasks, changed } = sanitizeTasks({
      1: [null, { id: 'x', segment: 1 }, { id: 'y', segment: 1, text: 'Keep me' }],
    });
    expect(changed).toBe(true);
    expect(tasks[1].length).toBe(1);
    expect(tasks[1][0].text).toBe('Keep me');
  });

  it('tolerates a non-array segment and a missing object', () => {
    expect(() => sanitizeTasks(null)).not.toThrow();
    const { tasks, changed } = sanitizeTasks({
      1: 'broken',
      2: [{ id: 'z', segment: 2, text: 'Ok' }],
    });
    expect(changed).toBe(true);
    expect(tasks[1]).toEqual([]);
    expect(tasks[2][0].text).toBe('Ok');
  });

  it('always returns all five segments as arrays', () => {
    const { tasks } = sanitizeTasks({});
    for (let i = 1; i <= 5; i++) {
      expect(Array.isArray(tasks[i])).toBe(true);
    }
  });
});
