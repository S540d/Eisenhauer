/**
 * Configuration Module
 * Constants and configuration values
 */

export const SEGMENTS = {
  DO: 1,
  SCHEDULE: 2,
  DELEGATE: 3,
  IGNORE: 4,
  DONE: 5,
};

export const COLORS = {
  1: '#ef4444', // Red
  2: '#10b981', // Green
  3: '#f59e0b', // Amber
  4: '#6b7280', // Gray
  5: '#8b5cf6', // Purple
};

export const STORAGE_KEYS = {
  TASKS: 'eisenhauer-tasks',
  NOTES: 'eisenhauer-notes',
  LANGUAGE: 'language',
  DARK_MODE: 'darkMode',
  DRAG_HINT_SEEN: 'dragHintSeen',
};

export const UPDATE_CHECK_INTERVAL = 10000; // 10 seconds
export const MAX_TASK_LENGTH = 140;
export const MAX_NOTES_LENGTH = 500;

// Smart Rules Configuration
export const SMART_RULES = {
  urgentThresholdDays: 3, // Tasks become urgent if due date is within 3 days
};

export const STORAGE_KEYS_EXTENDED = {
  ...STORAGE_KEYS,
  SMART_FUNCTIONS_ENABLED: 'smartFunctionsEnabled',
  NOTES_COLLECTION_ENABLED: 'notesCollectionEnabled',
};
