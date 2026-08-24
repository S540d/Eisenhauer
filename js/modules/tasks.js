/**
 * Tasks Module
 * Handles all task-related operations (CRUD, recurring tasks, task state)
 */

import { SEGMENTS } from './config.js';

// Task storage
export let tasks = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
};

// Current task being processed (for modal)
export let currentTask = null;

/**
 * Generate a stable, collision-free task ID.
 *
 * The previous scheme (`Date.now() + Math.random()`) produced a floating point
 * number that (a) only had ~12 bits of fractional resolution at the current
 * timestamp magnitude (collision risk when several tasks are created in the
 * same millisecond) and (b) was stored as a Firestore document ID via
 * `.toString()` and then read back as a *string* on load. That made the task
 * identity drift between Number and String, so strict `===` lookups in
 * move/toggle/delete/reorder could silently miss the task and leave duplicate
 * documents behind (the same task showing up in several quadrants).
 *
 * A UUID string is stable across create → save → reload and never collides.
 * @returns {string} Unique task ID
 */
export function generateTaskId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID (older browsers/tests)
  return `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Compare two task IDs irrespective of their type.
 *
 * IDs created in-memory may be strings while IDs loaded from Firestore are the
 * (string) document IDs; legacy data may even hold numbers. Comparing them as
 * strings guarantees a move/toggle/delete always finds its task instead of
 * silently failing and corrupting state.
 * @param {string|number} a
 * @param {string|number} b
 * @returns {boolean}
 */
export function sameTaskId(a, b) {
  return String(a) === String(b);
}

/**
 * Set current task (used by modal)
 */
export function setCurrentTask(task) {
  currentTask = task;
}

/**
 * Get current task
 */
export function getCurrentTask() {
  return currentTask;
}

/**
 * Clear current task
 */
export function clearCurrentTask() {
  currentTask = null;
}

/**
 * Calculate next occurrence timestamp based on recurring config
 * @param {object} recurringConfig - Recurring configuration
 * @param {number} fromTimestamp - Calculate from this timestamp (default: now)
 * @returns {number} Next occurrence timestamp
 */
function calculateNextOccurrence(recurringConfig, fromTimestamp = Date.now()) {
  const now = new Date(fromTimestamp);
  const nextDate = new Date(now);

  // Set to start of next day (00:00)
  nextDate.setDate(nextDate.getDate() + 1);
  nextDate.setHours(0, 0, 0, 0);

  switch (recurringConfig.interval) {
    case 'daily':
      // Already set to tomorrow 00:00
      break;

    case 'weekly':
      // Find next occurrence of selected weekday(s)
      if (recurringConfig.weekdays && recurringConfig.weekdays.length > 0) {
        const sortedWeekdays = [...recurringConfig.weekdays].sort((a, b) => a - b);
        const currentDay = nextDate.getDay();

        // Find next weekday
        let daysToAdd = null;
        for (const weekday of sortedWeekdays) {
          const diff = weekday - currentDay;
          if (diff > 0) {
            daysToAdd = diff;
            break;
          }
        }

        // If no future weekday this week, wrap to next week
        if (daysToAdd === null) {
          daysToAdd = 7 - currentDay + sortedWeekdays[0];
        }

        nextDate.setDate(nextDate.getDate() + daysToAdd);
      } else {
        // Default: 7 days from now
        nextDate.setDate(nextDate.getDate() + 6); // +6 because we already added +1
      }
      break;

    case 'monthly': {
      // Next month, same day
      const targetDay = recurringConfig.dayOfMonth || 1;
      nextDate.setMonth(nextDate.getMonth() + 1);
      nextDate.setDate(
        Math.min(targetDay, new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate())
      );
      break;
    }

    case 'custom': {
      // Custom days from now
      const customDays = recurringConfig.customDays || 1;
      nextDate.setDate(nextDate.getDate() + customDays - 1); // -1 because we already added +1
      break;
    }

    default:
      // Default to daily
      break;
  }

  return nextDate.getTime();
}

/**
 * Create a new task object
 */
export function createTaskObject(
  taskText,
  segmentId,
  recurringConfig = null,
  createdAt = null,
  dueDate = null,
  category = null,
  notes = null
) {
  const task = {
    id: generateTaskId(), // Stable, collision-free string ID (see generateTaskId)
    text: taskText,
    segment: segmentId,
    checked: false,
    createdAt: createdAt || Date.now(),
    completedAt: null,
  };

  // Add due date if provided
  if (dueDate) {
    task.dueDate = dueDate;
  }

  // Add category if provided
  if (category) {
    task.category = category;
  }

  // Add notes if provided
  if (notes) {
    task.notes = notes;
  }

  // Add recurring configuration if enabled
  if (recurringConfig && recurringConfig.enabled) {
    task.recurring = {
      enabled: true,
      interval: recurringConfig.interval,
      weekdays: recurringConfig.weekdays || [],
      dayOfMonth: recurringConfig.dayOfMonth || 1,
      customDays: recurringConfig.customDays || 1,
    };
  }

  return task;
}

/**
 * Add a task to a segment
 * @param {string} taskText - Text of the task
 * @param {number} segmentId - Target segment ID (1-5)
 * @param {object} recurringConfig - Optional recurring configuration
 * @param {function} saveCallback - Callback to save tasks (Firebase or LocalStorage)
 * @param {string} dueDate - Optional due date (ISO string or timestamp)
 * @param {string} category - Optional category ('private' or 'business')
 * @param {string} notes - Optional free-text notes
 * @returns {object} The created task
 */
export function addTaskToSegment(
  taskText,
  segmentId,
  recurringConfig = null,
  saveCallback = null,
  dueDate = null,
  category = null,
  notes = null
) {
  // Input validation
  if (typeof taskText !== 'string') {
    throw new TypeError('Task text must be a string');
  }
  if (taskText.trim().length === 0) {
    throw new Error('Task text cannot be empty');
  }
  if (taskText.length > 140) {
    throw new Error('Task text must not exceed 140 characters');
  }
  if (!Number.isInteger(segmentId) || segmentId < 1 || segmentId > 5) {
    throw new RangeError('Segment ID must be an integer between 1 and 5');
  }
  if (notes !== null && typeof notes !== 'string') {
    throw new TypeError('Notes must be a string');
  }
  if (notes && notes.length > 500) {
    throw new Error('Notes must not exceed 500 characters');
  }

  const task = createTaskObject(
    taskText,
    segmentId,
    recurringConfig,
    null,
    dueDate,
    category,
    notes
  );
  tasks[segmentId].push(task);

  // Call save callback if provided
  if (saveCallback) {
    saveCallback(task);
  }

  return task;
}

/**
 * Restore a task with all its properties (for undo operations)
 * @param {object} taskObject - Complete task object to restore
 * @param {function} saveCallback - Callback to save changes
 * @returns {object} The restored task
 */
export function restoreTask(taskObject, saveCallback = null) {
  // Input validation
  if (!taskObject || typeof taskObject !== 'object') {
    throw new TypeError('Task object must be provided');
  }
  if (!Number.isInteger(taskObject.segment) || taskObject.segment < 1 || taskObject.segment > 5) {
    throw new RangeError('Task segment must be an integer between 1 and 5');
  }
  if (!taskObject.id) {
    throw new Error('Task ID is required');
  }

  // Add task back to segment with all original properties preserved
  tasks[taskObject.segment].push(taskObject);

  // Call save callback if provided
  if (saveCallback) {
    saveCallback(taskObject);
  }

  return taskObject;
}

/**
 * Delete a task from a segment
 * @param {number} taskId - Task ID to delete
 * @param {number} segmentId - Segment ID containing the task
 * @param {function} deleteCallback - Callback to delete from storage
 * @returns {boolean} True if task was deleted
 */
export function deleteTask(taskId, segmentId, deleteCallback = null) {
  const taskIndex = tasks[segmentId].findIndex((t) => sameTaskId(t.id, taskId));
  if (taskIndex === -1) return false;

  tasks[segmentId].splice(taskIndex, 1);

  // Call delete callback if provided
  if (deleteCallback) {
    deleteCallback(taskId);
  }

  return true;
}

/**
 * Move a task from one segment to another
 * @param {number} taskId - Task ID to move
 * @param {number} fromSegment - Source segment ID
 * @param {number} toSegment - Target segment ID
 * @param {function} saveCallback - Callback to save changes
 * @returns {object|null} The moved task or null if not found
 */
export function moveTask(taskId, fromSegment, toSegment, saveCallback = null) {
  // Input validation
  if (!Number.isInteger(fromSegment) || fromSegment < 1 || fromSegment > 5) {
    throw new RangeError('Source segment ID must be an integer between 1 and 5');
  }
  if (!Number.isInteger(toSegment) || toSegment < 1 || toSegment > 5) {
    throw new RangeError('Target segment ID must be an integer between 1 and 5');
  }
  if (taskId === null || taskId === undefined) {
    throw new Error('Task ID cannot be null or undefined');
  }

  const taskIndex = tasks[fromSegment].findIndex((t) => sameTaskId(t.id, taskId));
  if (taskIndex === -1) return null;

  const task = tasks[fromSegment][taskIndex];

  // Remove from old segment
  tasks[fromSegment].splice(taskIndex, 1);

  // Create updated task for new segment
  const movedTask = {
    id: task.id,
    text: task.text,
    segment: toSegment,
    checked: false,
    createdAt: task.createdAt,
  };

  // Preserve due date if exists
  if (task.dueDate) {
    movedTask.dueDate = task.dueDate;
  }

  // Preserve category if exists
  if (task.category) {
    movedTask.category = task.category;
  }

  // Preserve recurring config if exists
  if (task.recurring) {
    movedTask.recurring = { ...task.recurring };
  }

  // Clear completedAt when moving away from Done segment
  if (fromSegment !== SEGMENTS.DONE && task.completedAt) {
    movedTask.completedAt = task.completedAt;
  }

  // Add to new segment
  tasks[toSegment].push(movedTask);

  // Call save callback if provided
  if (saveCallback) {
    saveCallback(movedTask);
  }

  return movedTask;
}

/**
 * Reorder task within same segment (for drag & drop sorting)
 * @param {number} taskId - Task ID
 * @param {number} segment - Segment ID
 * @param {number} newIndex - New position index in the segment
 * @param {function} saveCallback - Optional callback to save changes
 * @returns {object|null} Reordered task or null if not found
 */
export function reorderTask(taskId, segment, newIndex, saveCallback = null) {
  // Input validation
  if (!Number.isInteger(segment) || segment < 1 || segment > 5) {
    throw new RangeError('Segment ID must be an integer between 1 and 5');
  }
  if (taskId === null || taskId === undefined) {
    throw new Error('Task ID cannot be null or undefined');
  }
  if (!Number.isInteger(newIndex) || newIndex < 0) {
    throw new Error('New index must be a non-negative integer');
  }

  const taskIndex = tasks[segment].findIndex((t) => sameTaskId(t.id, taskId));
  if (taskIndex === -1) return null;

  // If task is already at the target position, no need to reorder
  if (taskIndex === newIndex) return tasks[segment][taskIndex];

  // Remove task from current position
  const [task] = tasks[segment].splice(taskIndex, 1);

  // Insert at new position
  const safeIndex = Math.min(newIndex, tasks[segment].length);
  tasks[segment].splice(safeIndex, 0, task);

  // Call save callback if provided
  if (saveCallback) {
    saveCallback(task);
  }

  return task;
}

/**
 * Toggle task completion (move to/from Done segment)
 * @param {number} taskId - Task ID to toggle
 * @param {number} segmentId - Current segment ID
 * @param {function} saveCallback - Callback to save changes
 * @returns {object|null} Result object with task and action info
 */
export function toggleTask(taskId, segmentId, saveCallback = null) {
  const taskIndex = tasks[segmentId].findIndex((t) => sameTaskId(t.id, taskId));
  if (taskIndex === -1) return null;

  const task = tasks[segmentId][taskIndex];

  // Move to Done segment (5)
  if (!task.checked && segmentId !== SEGMENTS.DONE) {
    let newRecurringTask = null;

    // Check if this is a recurring task
    if (task.recurring && task.recurring.enabled) {
      // Calculate next occurrence timestamp
      const nextOccurrence = calculateNextOccurrence(task.recurring);

      // Create a new instance of the recurring task with nextOccurrence as createdAt
      // This ensures the task only appears when it's due
      newRecurringTask = createTaskObject(
        task.text,
        task.segment,
        {
          enabled: true,
          ...task.recurring,
        },
        nextOccurrence, // Set createdAt to future timestamp
        task.dueDate, // Preserve due date for recurring tasks
        task.category // Preserve category for recurring tasks
      );

      // Add the new task to the same segment
      tasks[segmentId].push(newRecurringTask);
    }

    // Move original task to Done segment
    tasks[segmentId].splice(taskIndex, 1);

    // Remove recurring config from completed instance
    // (completed tasks should appear as normal tasks in Done segment, not as recurring)
    if (task.recurring) {
      delete task.recurring;
    }

    task.segment = SEGMENTS.DONE;
    task.checked = true;
    task.completedAt = Date.now(); // Track completion time for productivity statistics
    tasks[SEGMENTS.DONE].push(task);

    // Call save callback if provided
    if (saveCallback) {
      saveCallback(task, newRecurringTask);
    }

    return {
      action: 'completed',
      task,
      newRecurringTask,
      fromSegment: segmentId,
      toSegment: SEGMENTS.DONE,
    };
  }
  // Restore from Done segment to segment 1
  else if (task.checked && segmentId === SEGMENTS.DONE) {
    tasks[segmentId].splice(taskIndex, 1);

    task.segment = SEGMENTS.DO;
    task.checked = false;
    task.completedAt = null; // Reset completion time
    tasks[SEGMENTS.DO].push(task);

    // Call save callback if provided
    if (saveCallback) {
      saveCallback(task, null);
    }

    return {
      action: 'restored',
      task,
      fromSegment: SEGMENTS.DONE,
      toSegment: SEGMENTS.DO,
    };
  }

  return null;
}

/**
 * Get all tasks from a specific segment
 * @param {number} segmentId - Segment ID (1-5)
 * @returns {Array} Array of tasks
 */
export function getTasks(segmentId) {
  const now = Date.now();
  const segmentTasks = tasks[segmentId] || [];

  // Filter out future recurring tasks (not yet due)
  return segmentTasks.filter((task) => task.createdAt <= now);
}

/**
 * Get a specific task by ID and segment
 * @param {number} taskId - Task ID
 * @param {number} segmentId - Segment ID
 * @returns {object|null} Task object or null if not found
 */
export function getTask(taskId, segmentId) {
  return tasks[segmentId].find((t) => sameTaskId(t.id, taskId)) || null;
}

/**
 * Get all tasks (all segments)
 * @returns {object} All tasks grouped by segment
 */
export function getAllTasks() {
  return tasks;
}

/**
 * Set all tasks (used when loading from storage)
 * @param {object} newTasks - Tasks object
 */
export function setAllTasks(newTasks) {
  tasks = newTasks || {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  };
}

/**
 * Get task count for a segment
 * @param {number} segmentId - Segment ID
 * @returns {number} Number of tasks in segment
 */
export function getTaskCount(segmentId) {
  return tasks[segmentId] ? tasks[segmentId].length : 0;
}

/**
 * Get total task count across all segments
 * @returns {number} Total number of tasks
 */
export function getTotalTaskCount() {
  return Object.values(tasks).reduce((sum, segment) => sum + segment.length, 0);
}

/**
 * Update a task's properties
 * @param {number} taskId - Task ID
 * @param {number} segmentId - Segment ID
 * @param {object} updates - Properties to update
 * @returns {object|null} Updated task or null if not found
 */
export function updateTask(taskId, segmentId, updates) {
  const task = tasks[segmentId].find((t) => sameTaskId(t.id, taskId));
  if (!task) return null;

  Object.assign(task, updates);
  return task;
}

/**
 * Filter tasks by search term
 * @param {string} searchTerm - Search term
 * @returns {object} Filtered tasks by segment
 */
export function filterTasks(searchTerm) {
  if (!searchTerm) return tasks;

  const filtered = {};
  const lowerSearch = searchTerm.toLowerCase();

  for (let segmentId = 1; segmentId <= 5; segmentId++) {
    filtered[segmentId] = tasks[segmentId].filter((task) =>
      task.text.toLowerCase().includes(lowerSearch)
    );
  }

  return filtered;
}

/**
 * Filter tasks by category
 * @param {object} tasksToFilter - Tasks object grouped by segment
 * @param {string|null} categoryFilter - 'private', 'business', or null (all)
 * @returns {object} Filtered tasks
 */
export function filterByCategory(tasksToFilter, categoryFilter) {
  if (!categoryFilter) return tasksToFilter;

  const filtered = {};
  for (let segmentId = 1; segmentId <= 5; segmentId++) {
    filtered[segmentId] = (tasksToFilter[segmentId] || []).filter(
      (task) => (task.category || 'private') === categoryFilter
    );
  }
  return filtered;
}

/**
 * Get completed tasks (segment 5)
 * @returns {Array} Array of completed tasks
 */
export function getCompletedTasks() {
  return tasks[SEGMENTS.DONE] || [];
}

/**
 * Clear all completed tasks
 * @param {function} deleteCallback - Callback to delete from storage
 */
export function clearCompletedTasks(deleteCallback = null) {
  const completedIds = tasks[SEGMENTS.DONE].map((t) => t.id);
  tasks[SEGMENTS.DONE] = [];

  if (deleteCallback) {
    deleteCallback(completedIds);
  }
}

/**
 * Get recurring task description for display
 * @param {object} recurring - Recurring configuration
 * @param {object} translations - Translation object
 * @returns {string} Human-readable description
 */
export function getRecurringDescription(recurring, translations) {
  if (!recurring || !recurring.enabled) return '';

  const t = translations.recurring;

  switch (recurring.interval) {
    case 'daily':
      return t.daily;
    case 'weekly':
      if (recurring.weekdays && recurring.weekdays.length > 0) {
        return `${t.weekly}: ${recurring.weekdays.map((d) => t.weekdays[d]).join(', ')}`;
      }
      return t.weekly;
    case 'monthly':
      return `${t.monthly}: ${t.dayOfMonth} ${recurring.dayOfMonth}`;
    case 'custom':
      return `${t.custom}: ${recurring.customDays} ${t.customDays}`;
    default:
      return '';
  }
}

/**
 * Apply smart rules to tasks (e.g., mark as urgent if due date is near)
 * @param {object} tasksToProcess - Tasks object grouped by segment
 * @param {boolean} smartFunctionsEnabled - Whether smart functions are enabled
 * @param {number} urgentThresholdDays - Number of days before due date to mark as urgent
 * @returns {object} Tasks with smart rules applied
 */
export function applySmartRules(
  tasksToProcess,
  smartFunctionsEnabled = false,
  urgentThresholdDays = 3
) {
  if (!smartFunctionsEnabled) {
    // If smart functions are disabled, clear any isUrgent flags
    const clearedTasks = {};
    for (let segmentId = 1; segmentId <= 5; segmentId++) {
      clearedTasks[segmentId] = (tasksToProcess[segmentId] || []).map((task) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { isUrgent, ...taskWithoutUrgent } = task;
        return taskWithoutUrgent;
      });
    }
    return clearedTasks;
  }

  const now = Date.now();
  const thresholdMs = urgentThresholdDays * 24 * 60 * 60 * 1000;
  const processedTasks = {};

  for (let segmentId = 1; segmentId <= 5; segmentId++) {
    const segmentTasks = tasksToProcess[segmentId] || [];
    processedTasks[segmentId] = segmentTasks.map((task) => {
      // Skip if no due date or task is already completed (segment 5)
      if (!task.dueDate || task.segment === SEGMENTS.DONE) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { isUrgent, ...taskWithoutUrgent } = task;
        return taskWithoutUrgent;
      }

      // Parse due date (support both ISO string and timestamp)
      const dueDate =
        typeof task.dueDate === 'string' ? new Date(task.dueDate).getTime() : task.dueDate;

      // Check if due date is within threshold or overdue
      const timeUntilDue = dueDate - now;
      const shouldBeUrgent = timeUntilDue <= thresholdMs;

      if (shouldBeUrgent) {
        return { ...task, isUrgent: true };
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { isUrgent, ...taskWithoutUrgent } = task;
        return taskWithoutUrgent;
      }
    });
  }

  return processedTasks;
}
