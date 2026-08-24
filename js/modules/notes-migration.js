/**
 * Notes Collection Migration
 *
 * The standalone "notes overview" feature (a free-floating notes list,
 * independent of tasks, gated by the `notesCollectionEnabled` toggle) was
 * removed because it was confusing and largely unused. Any notes a user had
 * already saved there are migrated once into Q4 ("Später!"/"Ignore!") tasks
 * so nothing is silently lost, then the old storage is cleared.
 *
 * This runs at most once per user/device, tracked via a localStorage flag,
 * since the source notes collection is deleted as part of the migration.
 */

const MIGRATION_FLAG_KEY = 'notesCollectionMigrationDone';

/**
 * Check whether the standalone-notes migration has already run on this device.
 * @returns {boolean}
 */
export function isNotesMigrationDone() {
  return localStorage.getItem(MIGRATION_FLAG_KEY) === 'true';
}

/**
 * Mark the migration as completed so it never runs again on this device.
 */
export function markNotesMigrationDone() {
  localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
}

/**
 * Convert standalone notes into Q4 tasks.
 *
 * Pure function: takes the notes array and the current tasks object, returns
 * a new tasks object with one additional Q4 task per note (never mutates the
 * inputs), so it can't destroy existing tasks if something downstream fails.
 *
 * @param {Array<{text: string, createdAt?: number}>} notesToMigrate - Standalone notes
 * @param {object} currentTasks - Current tasks object, keyed by segment id
 * @param {function} createTaskObjectFn - Factory that builds a task object,
 *   e.g. `(text, segmentId, recurringConfig, createdAt) => task`
 * @returns {object} New tasks object with migrated notes appended to Q4
 */
export function migrateNotesToTasks(notesToMigrate, currentTasks, createTaskObjectFn) {
  const merged = {};
  for (const [segmentId, segTasks] of Object.entries(currentTasks)) {
    merged[segmentId] = [...segTasks];
  }

  if (!Array.isArray(notesToMigrate) || notesToMigrate.length === 0) {
    return merged;
  }

  if (!merged[4]) {
    merged[4] = [];
  }

  for (const note of notesToMigrate) {
    if (!note || typeof note.text !== 'string' || note.text.trim().length === 0) continue;
    const task = createTaskObjectFn(note.text, 4, null, note.createdAt || null);
    merged[4].push(task);
  }

  return merged;
}
