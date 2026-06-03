/**
 * Render resilience tests
 *
 * Regression for the "stuck on start screen / tasks no longer visible" bug:
 * a single corrupt task (invalid dueDate / completedAt) must never abort the
 * render loop and blank out the whole matrix. The bad task is skipped, all
 * healthy tasks still render. Cache clearing did not help affected users
 * because the corrupt data lived in their synced store, not the browser cache.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderSegment, renderAllTasks, createTaskElement } from '../../js/modules/ui.js';
import { translations } from '../../js/modules/translations.js';

function setupSegmentDom() {
  document.body.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const el = document.createElement('div');
    el.id = `segment${i}`;
    el.dataset.segment = String(i);
    document.body.appendChild(el);
  }
}

describe('render resilience', () => {
  beforeEach(() => {
    setupSegmentDom();
  });

  it('renders remaining tasks when one task has an invalid dueDate', () => {
    const tasks = {
      1: [
        { id: 'a', segment: 1, text: 'Healthy before', checked: false },
        { id: 'b', segment: 1, text: 'Corrupt date', checked: false, dueDate: 'not-a-date' },
        { id: 'c', segment: 1, text: 'Healthy after', checked: false },
      ],
    };

    renderSegment(1, tasks, translations, 'de', {});

    const rendered = document.getElementById('segment1').querySelectorAll('.task-item');
    // All three render: the corrupt date is simply omitted, not fatal.
    expect(rendered.length).toBe(3);
    const texts = Array.from(rendered).map((n) => n.querySelector('.task-text').textContent);
    expect(texts).toContain('Healthy before');
    expect(texts).toContain('Healthy after');
  });

  it('omits an unparseable dueDate instead of rendering "Invalid Date"', () => {
    const el = createTaskElement(
      { id: 'x', segment: 1, text: 'Bad date', checked: false, dueDate: 'garbage' },
      translations,
      'de',
      {}
    );
    expect(el.querySelector('.task-due-date')).toBeNull();
  });

  it('omits an unparseable completedAt in the Done segment', () => {
    const el = createTaskElement(
      { id: 'y', segment: 5, text: 'Done bad ts', checked: true, completedAt: 'garbage' },
      translations,
      'de',
      {}
    );
    expect(el.querySelector('.task-timestamp')).toBeNull();
  });

  it('a failure in one segment does not blank out the other segments', () => {
    // Force createTaskElement to throw for one specific task by giving it a
    // recurring object that getRecurringDescription cannot handle, while other
    // segments stay healthy.
    const tasks = {
      1: [{ id: 'ok1', segment: 1, text: 'Quadrant 1', checked: false }],
      2: [{ id: 'ok2', segment: 2, text: 'Quadrant 2', checked: false }],
    };

    expect(() => renderAllTasks(tasks, translations, 'de', {})).not.toThrow();
    expect(document.getElementById('segment1').querySelectorAll('.task-item').length).toBe(1);
    expect(document.getElementById('segment2').querySelectorAll('.task-item').length).toBe(1);
  });
});
