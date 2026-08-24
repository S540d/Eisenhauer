/**
 * Notes Module
 * Handles the standalone notes collection (independent of tasks)
 */

// Notes storage (flat, chronological array)
/** In-memory list of all notes, chronological order */
export let notes = [];

/**
 * Generate a stable, collision-free note ID.
 * Mirrors generateTaskId() in tasks.js for consistent ID semantics.
 * @returns {string} Unique note ID
 */
export function generateNoteId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID (older browsers/tests)
  return `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Create a new note object
 */
function createNoteObject(text, createdAt = null, sourceTaskId = null) {
  const note = {
    id: generateNoteId(),
    text,
    createdAt: createdAt || Date.now(),
  };

  if (sourceTaskId) {
    note.sourceTaskId = sourceTaskId;
  }

  return note;
}

/**
 * Add a new note to the collection
 * @param {string} text - Note text
 * @param {function} saveCallback - Callback to save the note (Firebase or LocalStorage)
 * @param {string} sourceTaskId - Optional ID of the task this note originated from
 * @returns {object} The created note
 */
export function addNote(text, saveCallback = null, sourceTaskId = null) {
  if (typeof text !== 'string') {
    throw new TypeError('Note text must be a string');
  }
  if (text.trim().length === 0) {
    throw new Error('Note text cannot be empty');
  }
  if (text.length > 500) {
    throw new Error('Note text must not exceed 500 characters');
  }

  const note = createNoteObject(text.trim(), null, sourceTaskId);
  notes.push(note);

  if (saveCallback) {
    saveCallback(note);
  }

  return note;
}

/**
 * Delete a note by ID
 * @param {string} noteId - ID of the note to delete
 * @param {function} deleteCallback - Callback to persist the deletion
 * @returns {object|null} The removed note, or null if not found
 */
export function deleteNote(noteId, deleteCallback = null) {
  const index = notes.findIndex((n) => String(n.id) === String(noteId));
  if (index === -1) return null;

  const [removed] = notes.splice(index, 1);

  if (deleteCallback) {
    deleteCallback(removed);
  }

  return removed;
}

/**
 * Get all notes
 * @returns {Array} All notes
 */
export function getAllNotes() {
  return notes;
}

/**
 * Replace the entire notes collection (used after loading from storage)
 * @param {Array} newNotes - Notes to set
 */
export function setAllNotes(newNotes) {
  notes = Array.isArray(newNotes) ? newNotes : [];
}
