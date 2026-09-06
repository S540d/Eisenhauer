/**
 * UI Rendering Module
 * Task rendering (segments, task elements, empty states) and drag/drop UI feedback
 */

import localforage from 'localforage';
import { COLORS, SEGMENTS } from './config.js';
import { getRecurringDescription } from './tasks.js';
import { DragManager } from './drag-manager.js';
import { announceDragStart, announceDragEnd } from './accessibility.js';
import { shouldShowSegmentDemo } from './onboarding.js';

/**
 * Create a task DOM element
 * @param {object} task - Task object
 * @param {object} translations - Translations object
 * @param {string} currentLanguage - Current language
 * @param {object} callbacks - Callback functions
 * @param {function} callbacks.onToggle - Toggle task handler
 * @param {function} callbacks.onDragEnd - Drag end handler (called after drop)
 * @param {function} callbacks.onSwipeDelete - Swipe delete handler
 * @returns {HTMLElement} Task element
 */
export function createTaskElement(task, translations, currentLanguage, callbacks = {}) {
  const div = document.createElement('div');
  div.className = 'task-item';
  div.dataset.taskId = task.id;
  div.dataset.segmentId = task.segment;

  // Add urgent class if task is marked as urgent
  if (task.isUrgent) {
    div.classList.add('urgent-task');
  }

  // Accessibility: Make task items keyboard focusable
  div.setAttribute('tabindex', '0');
  div.setAttribute('role', 'button');
  div.setAttribute('aria-pressed', 'false');
  div.setAttribute('aria-label', `Task: ${task.text}. Press Space to select for moving.`);

  // Set border color based on segment
  div.style.setProperty('--checkbox-color', COLORS[task.segment]);

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = task.checked;

  // Checkbox event listener. When a task is being marked done (not restored),
  // play a brief "completing" animation before handing off to the callback,
  // which re-renders the matrix and moves the task into "Done!" (Issue #352 B3).
  if (callbacks.onToggle) {
    checkbox.addEventListener('change', () => {
      const justCompleted = checkbox.checked && !task.checked;
      if (!justCompleted) {
        callbacks.onToggle(task.id, task.segment);
        return;
      }

      const prefersReducedMotion =
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      div.classList.add('task-completing');
      setTimeout(() => callbacks.onToggle(task.id, task.segment), prefersReducedMotion ? 0 : 220);
    });
  }

  const content = document.createElement('div');
  content.className = 'task-content';

  const textSpan = document.createElement('span');
  textSpan.className = 'task-text';

  // Create a text node for the task text
  const textNode = document.createTextNode(task.text);
  textSpan.appendChild(textNode);

  // Add recurring indicator if task is recurring
  if (task.recurring && task.recurring.enabled) {
    const recurringIndicator = document.createElement('button');
    recurringIndicator.className = 'recurring-indicator';
    recurringIndicator.type = 'button';
    recurringIndicator.setAttribute('aria-label', 'Edit recurring task settings');
    recurringIndicator.title = getRecurringDescription(
      task.recurring,
      translations[currentLanguage]
    );

    // Create SVG icon (circular arrow)
    recurringIndicator.innerHTML = `
 <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
 <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
 </svg>
 `;

    // Click handler to open edit modal
    recurringIndicator.addEventListener('click', (e) => {
      e.stopPropagation();
      if (callbacks.onEditRecurring) {
        callbacks.onEditRecurring(task);
      }
    });

    textSpan.appendChild(recurringIndicator);
  }

  // Add delete button inline after text (only for Done tasks on desktop)
  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isDoneTask = task.segment === SEGMENTS.DONE;

  if (isDoneTask && !isTouchDevice()) {
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-delete-btn';
    deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (callbacks.onSwipeDelete) {
        callbacks.onSwipeDelete(task.id, task.segment);
      }
    });
    // Add delete button inline in textSpan, right after text/recurring icon
    textSpan.appendChild(deleteBtn);
  }

  content.appendChild(textSpan);

  // Add due date display if present
  if (task.dueDate && task.segment !== SEGMENTS.DONE) {
    const dueDateSpan = document.createElement('span');
    dueDateSpan.className = 'task-due-date';

    // Format date based on locale - use numeric format as specified.
    // Guard against corrupt/unparseable dueDate values so toLocaleDateString
    // never throws "Invalid time value" and breaks the whole task list.
    const dueDate = new Date(task.dueDate);
    if (!Number.isNaN(dueDate.getTime())) {
      dueDateSpan.textContent = dueDate.toLocaleDateString(
        currentLanguage === 'de' ? 'de-DE' : 'en-US',
        {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }
      );
      content.appendChild(dueDateSpan);
    }
  }

  // Add completion timestamp for Done! segment
  if (task.segment === SEGMENTS.DONE && task.completedAt) {
    const timestampSpan = document.createElement('span');
    timestampSpan.className = 'task-timestamp';
    const date = new Date(task.completedAt);
    if (!Number.isNaN(date.getTime())) {
      const formattedDate = date.toLocaleDateString(currentLanguage === 'de' ? 'de-DE' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const formattedTime = date.toLocaleTimeString(currentLanguage === 'de' ? 'de-DE' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      timestampSpan.textContent = `${formattedDate} ${formattedTime}`;
      content.appendChild(timestampSpan);
    }
  }

  // Click on the task content re-opens the Quick Add dialog prefilled for
  // editing (text, due date, recurring, category, notes). Inner controls
  // (checkbox, recurring/notes indicator, delete button) already stop
  // propagation, so they don't trigger this.
  if (callbacks.onEditTask) {
    content.classList.add('task-content-editable');
    content.addEventListener('click', () => {
      callbacks.onEditTask(task);
    });
  }

  div.appendChild(checkbox);
  div.appendChild(content);

  // Setup Drag & Drop 2.0 with DragManager
  if (callbacks.onDragEnd || callbacks.onSwipeDelete) {
    const dragManager = new DragManager({
      element: div,
      data: task,

      onDragStart: () => {
        div.classList.add('dragging');

        // Announce to screen readers
        announceDragStart(task.text);
      },

      onDragMove: () => {
        // Optional: Update UI during drag
      },

      onDragEnd: (event) => {
        div.classList.remove('dragging');

        if (event.target && callbacks.onDragEnd) {
          const toSegment = parseInt(event.target.dataset.segment);
          const fromSegment = task.segment;

          if (toSegment && toSegment !== fromSegment) {
            // Announce to screen readers
            announceDragEnd(task.text, fromSegment, toSegment);

            callbacks.onDragEnd(task.id, fromSegment, toSegment);
          }
        }
      },

      onSwipeDelete: (data) => {
        if (callbacks.onSwipeDelete) {
          callbacks.onSwipeDelete(data.id, data.segment);
        }
      },

      onSwipeComplete: (data) => {
        if (callbacks.onToggle) {
          callbacks.onToggle(data.id, data.segment);
        }
      },

      enableSwipeDelete: true,
      enableSwipeComplete: task.segment !== SEGMENTS.DONE, // Don't enable for Done tasks
      longPressDelay: 300,
      swipeThreshold: 100,
    });

    // Store reference for cleanup
    div._dragManager = dragManager;
  }

  // Add reorder buttons (up/down) for non-touch devices or non-Done tasks
  const shouldShowReorderButtons = !isDoneTask && !isTouchDevice();

  if (shouldShowReorderButtons && callbacks.onReorder) {
    const reorderContainer = document.createElement('div');
    reorderContainer.className = 'task-reorder-buttons';

    const taskIndex = callbacks.taskIndex ?? 0;
    const totalTasks = callbacks.totalTasks ?? 1;
    const isFirst = taskIndex === 0;
    const isLast = taskIndex === totalTasks - 1;

    const upBtn = document.createElement('button');
    upBtn.className = 'reorder-btn reorder-up';
    upBtn.setAttribute('aria-label', `Move task "${task.text}" up`);
    upBtn.textContent = '↑';
    upBtn.disabled = isFirst;
    upBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      callbacks.onReorder(task.id, task.segment, 'up');
    });

    const downBtn = document.createElement('button');
    downBtn.className = 'reorder-btn reorder-down';
    downBtn.setAttribute('aria-label', `Move task "${task.text}" down`);
    downBtn.textContent = '↓';
    downBtn.disabled = isLast;
    downBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      callbacks.onReorder(task.id, task.segment, 'down');
    });

    reorderContainer.appendChild(upBtn);
    reorderContainer.appendChild(downBtn);
    div.appendChild(reorderContainer);
  }

  return div;
}

/**
 * Build the placeholder shown in an empty segment: either a dismissible demo
 * task with a short quadrant explanation (new users, Issue #352 B2) or a
 * friendly empty-state message once onboarding has been dismissed.
 * @param {number} segmentId - Segment ID (1-5)
 * @param {object} translations - Translations object
 * @param {string} currentLanguage - Current language
 * @param {object} callbacks - Event callbacks
 * @returns {HTMLElement}
 */
function createEmptyStateElement(segmentId, translations, currentLanguage, callbacks = {}) {
  const t = translations[currentLanguage] || translations.en;
  const wrapper = document.createElement('div');

  if (shouldShowSegmentDemo(segmentId)) {
    wrapper.className = 'segment-empty-state segment-demo-task';

    const badge = document.createElement('span');
    badge.className = 'segment-demo-badge';
    badge.textContent = t.onboarding.demoBadge;
    wrapper.appendChild(badge);

    const demoText = document.createElement('p');
    demoText.className = 'segment-demo-text';
    demoText.textContent = t.onboarding.demoTasks[segmentId];
    wrapper.appendChild(demoText);

    const explanation = document.createElement('p');
    explanation.className = 'segment-empty-explanation';
    explanation.textContent = t.onboarding.explanations[segmentId];
    wrapper.appendChild(explanation);

    const dismissBtn = document.createElement('button');
    dismissBtn.type = 'button';
    dismissBtn.className = 'segment-demo-dismiss';
    dismissBtn.setAttribute('aria-label', t.onboarding.dismissLabel);
    dismissBtn.title = t.onboarding.dismissLabel;
    dismissBtn.textContent = '✕';
    dismissBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (callbacks.onDismissDemo) callbacks.onDismissDemo(segmentId);
    });
    wrapper.appendChild(dismissBtn);
  } else {
    wrapper.className = 'segment-empty-state';
    const message = document.createElement('p');
    message.className = 'segment-empty-message';
    message.textContent = t.emptyState[segmentId];
    wrapper.appendChild(message);
  }

  return wrapper;
}

/**
 * Render tasks in a specific segment
 * @param {number} segmentId - Segment ID (1-5)
 * @param {object} tasks - Tasks object
 * @param {object} translations - Translations object
 * @param {string} currentLanguage - Current language
 * @param {object} callbacks - Event callbacks
 */
export function renderSegment(segmentId, tasks, translations, currentLanguage, callbacks = {}) {
  const segmentElement = document.getElementById(`segment${segmentId}`);
  if (!segmentElement) return;

  segmentElement.innerHTML = '';

  const segmentTasks = tasks[segmentId] || [];

  if (segmentTasks.length === 0) {
    segmentElement.appendChild(
      createEmptyStateElement(segmentId, translations, currentLanguage, callbacks)
    );
    return;
  }

  // Phase 1: build elements, skipping any task that fails to render. A single
  // corrupt task (e.g. an invalid dueDate or a malformed recurring object) must
  // never abort the whole loop and leave the matrix blank ("stuck on start
  // screen"). taskIndex/totalTasks are provisional here and corrected in phase 2.
  const renderedElements = [];
  segmentTasks.forEach((task, index) => {
    try {
      const taskElement = createTaskElement(task, translations, currentLanguage, {
        ...callbacks,
        taskIndex: index,
        totalTasks: segmentTasks.length,
      });
      renderedElements.push(taskElement);
    } catch (error) {
      console.error('Failed to render task, skipping it:', task?.id, error);
    }
  });

  // Phase 2: append and fix the reorder buttons' disabled state based on the
  // actually rendered list, so a skipped task does not leave the first/last
  // visible task with a wrong "move up"/"move down" enabled state.
  const total = renderedElements.length;
  renderedElements.forEach((taskElement, position) => {
    const upBtn = taskElement.querySelector('.reorder-up');
    const downBtn = taskElement.querySelector('.reorder-down');
    if (upBtn) upBtn.disabled = position === 0;
    if (downBtn) downBtn.disabled = position === total - 1;
    segmentElement.appendChild(taskElement);
  });
}

/**
 * Render all tasks in all segments
 * @param {object} tasks - Tasks object
 * @param {object} translations - Translations object
 * @param {string} currentLanguage - Current language
 * @param {object} callbacks - Event callbacks
 */
export function renderAllTasks(tasks, translations, currentLanguage, callbacks = {}) {
  for (let i = 1; i <= 5; i++) {
    // Isolate per-segment so a failure in one quadrant cannot blank out the others.
    try {
      renderSegment(i, tasks, translations, currentLanguage, callbacks);
    } catch (error) {
      console.error(`Failed to render segment ${i}:`, error);
    }
  }
}

/**
 * Show drag hint to user
 */
export function showDragHint() {
  const dragHint = document.getElementById('dragHint');
  if (!dragHint) return;

  dragHint.style.display = 'block';

  const closeBtn = document.getElementById('closeDragHint');
  if (closeBtn) {
    closeBtn.addEventListener('click', async () => {
      dragHint.style.display = 'none';
      if (typeof localforage !== 'undefined') {
        await localforage.setItem('dragHintSeen', true);
      }
    });
  }
}

/**
 * Setup drop zones for all task lists (Drag & Drop 2.0)
 * @param {Function} onDrop - Callback when task is dropped (taskId, fromSegment, toSegment)
 */
export function setupDropZones(onDrop) {
  import('./drag-manager.js').then(({ setupDropZone }) => {
    const taskLists = document.querySelectorAll('.task-list');

    taskLists.forEach((taskList) => {
      setupDropZone(taskList, (data, dropZone) => {
        const toSegment = parseInt(dropZone.dataset.segment);
        const fromSegment = data.segment;

        if (toSegment && toSegment !== fromSegment) {
          onDrop(data.id, fromSegment, toSegment);
        }
      });
    });
  });
}
