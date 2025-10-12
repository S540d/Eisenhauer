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
    5: []
};

// Current task being processed (for modal)
export let currentTask = null;

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
 * Create a new task object
 */
function createTaskObject(taskText, segmentId, recurringConfig = null) {
    const task = {
        id: Date.now(),
        text: taskText,
        segment: segmentId,
        checked: false,
        createdAt: Date.now(),
        completedAt: null
    };

    // Add recurring configuration if enabled
    if (recurringConfig && recurringConfig.enabled) {
        task.recurring = {
            enabled: true,
            interval: recurringConfig.interval,
            weekdays: recurringConfig.weekdays || [],
            dayOfMonth: recurringConfig.dayOfMonth || 1,
            customDays: recurringConfig.customDays || 1
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
 * @returns {object} The created task
 */
export function addTaskToSegment(taskText, segmentId, recurringConfig = null, saveCallback = null) {
    const task = createTaskObject(taskText, segmentId, recurringConfig);
    tasks[segmentId].push(task);

    // Call save callback if provided
    if (saveCallback) {
        saveCallback(task);
    }

    return task;
}

/**
 * Delete a task from a segment
 * @param {number} taskId - Task ID to delete
 * @param {number} segmentId - Segment ID containing the task
 * @param {function} deleteCallback - Callback to delete from storage
 * @returns {boolean} True if task was deleted
 */
export function deleteTask(taskId, segmentId, deleteCallback = null) {
    const taskIndex = tasks[segmentId].findIndex(t => t.id === taskId);
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
    const taskIndex = tasks[fromSegment].findIndex(t => t.id === taskId);
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
        createdAt: task.createdAt
    };

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
 * Toggle task completion (move to/from Done segment)
 * @param {number} taskId - Task ID to toggle
 * @param {number} segmentId - Current segment ID
 * @param {function} saveCallback - Callback to save changes
 * @returns {object|null} Result object with task and action info
 */
export function toggleTask(taskId, segmentId, saveCallback = null) {
    const taskIndex = tasks[segmentId].findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;

    const task = tasks[segmentId][taskIndex];

    // Move to Done segment (5)
    if (!task.checked && segmentId !== SEGMENTS.DONE) {
        let newRecurringTask = null;

        // Check if this is a recurring task
        if (task.recurring && task.recurring.enabled) {
            // Create a new instance of the recurring task
            newRecurringTask = createTaskObject(task.text, task.segment, {
                enabled: true,
                ...task.recurring
            });

            // Add the new task to the same segment
            tasks[segmentId].push(newRecurringTask);
        }

        // Move original task to Done segment
        tasks[segmentId].splice(taskIndex, 1);

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
            toSegment: SEGMENTS.DONE
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
            toSegment: SEGMENTS.DO
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
    return tasks[segmentId] || [];
}

/**
 * Get a specific task by ID and segment
 * @param {number} taskId - Task ID
 * @param {number} segmentId - Segment ID
 * @returns {object|null} Task object or null if not found
 */
export function getTask(taskId, segmentId) {
    return tasks[segmentId].find(t => t.id === taskId) || null;
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
        5: []
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
    const task = tasks[segmentId].find(t => t.id === taskId);
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
        filtered[segmentId] = tasks[segmentId].filter(task =>
            task.text.toLowerCase().includes(lowerSearch)
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
    const completedIds = tasks[SEGMENTS.DONE].map(t => t.id);
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
                return `${t.weekly}: ${recurring.weekdays.map(d => t.weekdays[d]).join(', ')}`;
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
