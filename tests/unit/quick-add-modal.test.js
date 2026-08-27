/**
 * Regression tests for Issue #398: opening the Quick Add modal repeatedly
 * caused each subsequent Enter-key submit to fire once per previous open,
 * creating 1x/2x/3x duplicate tasks.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { openQuickAddModal } from '../../js/modules/ui.js';
import { translations } from '../../js/modules/translations.js';

function buildQuickAddModalFixture() {
  document.body.innerHTML = `
    <div id="quickAddModal" class="modal">
      <div class="modal-content quick-add-modal">
        <h3 id="quickAddTitle">New Task</h3>
        <p id="quickAddCategory" class="quick-add-category"></p>
        <div class="quick-add-input-row">
          <div class="quick-add-input-wrapper">
            <input type="text" id="quickAddInput" maxlength="140" autocomplete="off" />
            <span id="quickAddCharCount" class="char-counter">0/140</span>
          </div>
          <button id="quickAddSubmitBtn" class="btn quick-add-ok-btn">OK</button>
        </div>
        <div class="quick-add-toggles">
          <label class="icon-toggle" id="quickRecurringToggle">
            <input type="checkbox" id="quickRecurringEnabled" class="sr-only" />
            <span id="quickRecurringEnableText" class="sr-only">Make recurring</span>
          </label>
          <label class="icon-toggle" id="quickDueDateToggle">
            <input type="checkbox" id="quickDueDateEnabled" class="sr-only" />
            <span id="quickAddDueDateLabel" class="sr-only">Due Date</span>
          </label>
        </div>
        <div class="quick-add-notes-row">
          <textarea id="quickAddNotes" class="quick-add-notes-input" maxlength="500"></textarea>
        </div>
        <div id="quickRecurringOptions" class="recurring-options">
          <div class="recurring-option">
            <label><input type="radio" name="quickRecurringType" value="daily" checked />
              <span id="quickRecurringDaily">Daily</span></label>
          </div>
          <div class="recurring-option">
            <label><input type="radio" name="quickRecurringType" value="weekly" />
              <span id="quickRecurringWeekly">Weekly</span></label>
            <div id="quickWeekdaysContainer" class="weekdays-container"></div>
          </div>
          <div class="recurring-option">
            <label><input type="radio" name="quickRecurringType" value="monthly" />
              <span id="quickRecurringMonthly">Monthly</span></label>
            <div id="quickMonthDayContainer">
              <input type="number" id="quickMonthDay" min="1" max="31" value="1" />
            </div>
          </div>
        </div>
        <input type="date" id="quickAddDueDate" class="due-date-input" style="display: none" />
        <div id="quickAddCategoryConfig" class="category-config" style="display: none">
          <div class="category-toggle-group">
            <button type="button" class="btn btn-toggle category-select-btn active" data-category="">None</button>
            <button type="button" class="btn btn-toggle category-select-btn" data-category="private">Private</button>
            <button type="button" class="btn btn-toggle category-select-btn" data-category="business">Business</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

describe('openQuickAddModal keypress listener (Issue #398)', () => {
  beforeEach(() => {
    buildQuickAddModalFixture();
  });

  it('fires the submit callback exactly once per Enter keypress, even after opening the modal multiple times', () => {
    const onAddTask = () => {};
    let calls = 0;
    const callback = (...args) => {
      calls++;
      onAddTask(...args);
    };

    // Open the modal repeatedly, as a user would when adding several tasks
    // in a row (each "+" click / previous submit re-opens it).
    openQuickAddModal(1, callback, translations, 'en');
    openQuickAddModal(1, callback, translations, 'en');
    openQuickAddModal(1, callback, translations, 'en');

    const input = document.getElementById('quickAddInput');
    input.value = 'Some task';
    input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', bubbles: true }));

    expect(calls).toBe(1);
  });

  it('does not leave a stale keypress listener attached to a detached previous input', () => {
    const calls = [];
    const callback = (text) => calls.push(text);

    openQuickAddModal(1, callback, translations, 'en');
    openQuickAddModal(1, callback, translations, 'en');

    const input = document.getElementById('quickAddInput');
    input.value = 'Task A';
    input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', bubbles: true }));

    // Re-open and submit again — must still be exactly one call per submit
    openQuickAddModal(1, callback, translations, 'en');
    input.value = 'Task B';
    input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', bubbles: true }));

    expect(calls).toEqual(['Task A', 'Task B']);
  });

  it('does not fire on Shift+Enter (line break in a multiline-capable field)', () => {
    let calls = 0;
    openQuickAddModal(1, () => calls++, translations, 'en');

    const input = document.getElementById('quickAddInput');
    input.value = 'Some task';
    input.dispatchEvent(
      new KeyboardEvent('keypress', { key: 'Enter', shiftKey: true, bubbles: true })
    );

    expect(calls).toBe(0);
  });
});

describe('openQuickAddModal character counter (Issue #401)', () => {
  beforeEach(() => {
    buildQuickAddModalFixture();
  });

  it('shows 0/140 when the modal opens for a new task', () => {
    openQuickAddModal(1, () => {}, translations, 'en');

    expect(document.getElementById('quickAddCharCount').textContent).toBe('0/140');
  });

  it('updates live as the user types', () => {
    openQuickAddModal(1, () => {}, translations, 'en');

    const input = document.getElementById('quickAddInput');
    input.value = 'Buy milk';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(document.getElementById('quickAddCharCount').textContent).toBe('8/140');
  });

  it('shows the existing task length when editing', () => {
    openQuickAddModal(1, () => {}, translations, 'en', {
      id: 't1',
      text: '1234567890',
    });

    expect(document.getElementById('quickAddCharCount').textContent).toBe('10/140');
  });

  it('flags the counter as error once the 140 char limit is reached', () => {
    openQuickAddModal(1, () => {}, translations, 'en');

    const input = document.getElementById('quickAddInput');
    input.value = 'a'.repeat(140);
    input.dispatchEvent(new Event('input', { bubbles: true }));

    const counter = document.getElementById('quickAddCharCount');
    expect(counter.textContent).toBe('140/140');
    expect(counter.classList.contains('error')).toBe(true);
  });

  it('does not stack duplicate input listeners across repeated opens', () => {
    openQuickAddModal(1, () => {}, translations, 'en');
    openQuickAddModal(1, () => {}, translations, 'en');
    openQuickAddModal(1, () => {}, translations, 'en');

    const input = document.getElementById('quickAddInput');
    input.value = 'abc';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(document.getElementById('quickAddCharCount').textContent).toBe('3/140');
  });
});
