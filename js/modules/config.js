/**
 * Configuration Module
 * Constants and configuration values
 */

/** Segment IDs for the four Eisenhauer quadrants plus the Done list */
export const SEGMENTS = {
  DO: 1,
  SCHEDULE: 2,
  DELEGATE: 3,
  IGNORE: 4,
  DONE: 5,
};

/** Display color per segment ID */
export const COLORS = {
  1: '#ef4444', // Red
  2: '#10b981', // Green
  3: '#f59e0b', // Amber
  4: '#6b7280', // Gray
  5: '#8b5cf6', // Purple
};

/** localStorage key names used across the app */
export const STORAGE_KEYS = {
  TASKS: 'eisenhauer-tasks',
  NOTES: 'eisenhauer-notes',
  LANGUAGE: 'language',
  DARK_MODE: 'darkMode',
  DRAG_HINT_SEEN: 'dragHintSeen',
};

/** Polling interval in ms for checking app updates */
export const UPDATE_CHECK_INTERVAL = 10000; // 10 seconds
/** Maximum allowed length for a task's text */
export const MAX_TASK_LENGTH = 140;
/** Maximum allowed length for a note's text */
export const MAX_NOTES_LENGTH = 500;

// Smart Rules Configuration
/** Thresholds used by the Smart Urgency Rules feature */
export const SMART_RULES = {
  urgentThresholdDays: 3, // Tasks become urgent if due date is within 3 days
};

/** STORAGE_KEYS extended with Smart Features/Notes feature toggles */
export const STORAGE_KEYS_EXTENDED = {
  ...STORAGE_KEYS,
  SMART_FUNCTIONS_ENABLED: 'smartFunctionsEnabled',
  NOTES_COLLECTION_ENABLED: 'notesCollectionEnabled',
};
