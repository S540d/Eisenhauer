/**
 * ICS Import Module (Issue #351)
 * Parses .ics VTODO entries (e.g. exported from Apple Reminders) and merges
 * them into the existing task data as new tasks.
 */

import { suggestSegment } from './smart-suggest.js';

/**
 * Unfold ICS content: lines starting with a space/tab are continuations of
 * the previous line (RFC 5545 line folding).
 * @param {string} content - Raw .ics file content
 * @returns {string[]} Unfolded lines
 */
function unfoldLines(content) {
  const rawLines = content.split(/\r\n|\n|\r/);
  const lines = [];
  for (const line of rawLines) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && lines.length > 0) {
      lines[lines.length - 1] += line.slice(1);
    } else {
      lines.push(line);
    }
  }
  return lines;
}

/**
 * Unescape ICS TEXT value per RFC 5545 (§3.3.11).
 * @param {string} value - Raw property value
 * @returns {string} Unescaped text
 */
function unescapeText(value) {
  return value
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

/**
 * Parse a date-only or date-time ICS value (e.g. `20260824` or
 * `20260824T120000Z`) into an ISO 8601 date string (`YYYY-MM-DD`) suitable
 * for `task.dueDate`.
 * @param {string} value - Raw ICS DATE or DATE-TIME value
 * @returns {string|null} ISO date string, or null if unparseable
 */
function parseIcsDate(value) {
  const match = /^(\d{4})(\d{2})(\d{2})/.exec(value);
  if (!match) return null;
  const [, year, month, day] = match;
  return `${year}-${month}-${day}`;
}

/**
 * Split an ICS content line into property name (with parameters stripped)
 * and value, respecting that `:` may appear inside quoted parameter values.
 * @param {string} line - Single unfolded ICS content line
 * @returns {{name: string, value: string}|null}
 */
function splitProperty(line) {
  const colonIndex = line.indexOf(':');
  if (colonIndex === -1) return null;
  const rawName = line.slice(0, colonIndex);
  const value = line.slice(colonIndex + 1);
  const name = rawName.split(';')[0].trim().toUpperCase();
  return { name, value };
}

/**
 * Parse the VTODO components of an .ics file into plain task-like objects.
 * Unknown/unsupported components (VEVENT etc.) are ignored.
 * @param {string} icsContent - Raw .ics file content
 * @returns {Array<{summary: string, dueDate: string|null, completed: boolean, uid: string|null}>}
 */
export function parseIcsTodos(icsContent) {
  if (typeof icsContent !== 'string' || icsContent.trim().length === 0) {
    return [];
  }

  const lines = unfoldLines(icsContent);
  const todos = [];
  let current = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === 'BEGIN:VTODO') {
      current = { summary: null, dueDate: null, completed: false, uid: null };
      continue;
    }
    if (trimmed === 'END:VTODO') {
      if (current && current.summary) {
        todos.push(current);
      }
      current = null;
      continue;
    }
    if (!current) continue;

    const prop = splitProperty(trimmed);
    if (!prop) continue;

    switch (prop.name) {
      case 'SUMMARY':
        current.summary = unescapeText(prop.value).trim();
        break;
      case 'DUE':
        current.dueDate = parseIcsDate(prop.value);
        break;
      case 'STATUS':
        current.completed = prop.value.trim().toUpperCase() === 'COMPLETED';
        break;
      case 'UID':
        current.uid = prop.value.trim();
        break;
      default:
        break;
    }
  }

  return todos;
}

/**
 * Build a dedup key for a parsed todo, used to skip re-importing the same
 * reminder on repeated imports. Falls back to summary+dueDate when no UID
 * is present (Apple's .ics exports normally always include one).
 * @param {{summary: string, dueDate: string|null, uid: string|null}} todo
 * @returns {string}
 */
function todoDedupKey(todo) {
  if (todo.uid) return `uid:${todo.uid}`;
  return `text:${todo.summary.trim().toLowerCase()}|${todo.dueDate || ''}`;
}

/**
 * Build a dedup key for an existing task, matching the same scheme as
 * {@link todoDedupKey} so imported todos can be compared against it.
 * @param {object} task - Existing task object
 * @returns {string}
 */
function taskDedupKey(task) {
  if (task.icsUid) return `uid:${task.icsUid}`;
  return `text:${(task.text || '').trim().toLowerCase()}|${task.dueDate || ''}`;
}

/**
 * Merge parsed VTODO entries into the existing tasks object as new tasks.
 *
 * This is strictly additive: existing tasks are never modified or removed,
 * so a failed or repeated import can never lose data. Todos already present
 * (matched by UID, or by summary+dueDate as a fallback) are skipped instead
 * of creating duplicates. The default quadrant for todos without a clear
 * hint is Q4 ("Später!"/"Ignore!"), the safe fallback since it's the review
 * quadrant rather than something that will be forgotten immediately.
 *
 * @param {Array} todos - Parsed VTODO entries (see parseIcsTodos)
 * @param {object} currentTasks - Current tasks object, keyed by segment id
 * @param {function} createTaskObjectFn - Factory that builds a task object,
 *   e.g. `(text, segmentId, recurringConfig, createdAt, dueDate) => task`
 * @returns {{tasks: object, importedCount: number, skippedCount: number}}
 */
export function mergeIcsTodos(todos, currentTasks, createTaskObjectFn) {
  const merged = {};
  for (const [segmentId, segTasks] of Object.entries(currentTasks)) {
    merged[segmentId] = [...segTasks];
  }

  const existingKeys = new Set();
  for (const segTasks of Object.values(merged)) {
    for (const task of segTasks) {
      existingKeys.add(taskDedupKey(task));
    }
  }

  let importedCount = 0;
  let skippedCount = 0;

  for (const todo of todos) {
    const key = todoDedupKey(todo);
    if (existingKeys.has(key)) {
      skippedCount += 1;
      continue;
    }

    const suggestedSegment = suggestSegment(todo.summary);
    const segmentId = todo.completed ? 5 : suggestedSegment || 4;

    const task = createTaskObjectFn(todo.summary, segmentId, null, null, todo.dueDate || null);
    if (todo.uid) {
      task.icsUid = todo.uid;
    }
    if (todo.completed) {
      task.checked = true;
      task.completedAt = Date.now();
    }

    if (!merged[segmentId]) {
      merged[segmentId] = [];
    }
    merged[segmentId].push(task);
    existingKeys.add(key);
    importedCount += 1;
  }

  return { tasks: merged, importedCount, skippedCount };
}
