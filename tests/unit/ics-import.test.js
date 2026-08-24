import { describe, it, expect } from 'vitest';
import { parseIcsTodos, mergeIcsTodos } from '../../js/modules/ics-import.js';
import { createTaskObject } from '../../js/modules/tasks.js';

const SAMPLE_ICS = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VTODO
UID:1234-5678@apple.com
SUMMARY:Milch kaufen
DUE:20260901T090000Z
STATUS:NEEDS-ACTION
END:VTODO
BEGIN:VTODO
UID:9999-0000@apple.com
SUMMARY:Steuererklärung fertig machen
STATUS:COMPLETED
END:VTODO
BEGIN:VEVENT
SUMMARY:Not a todo, should be ignored
END:VEVENT
END:VCALENDAR
`;

describe('parseIcsTodos', () => {
  it('parses VTODO entries with summary, due date, uid and status', () => {
    const todos = parseIcsTodos(SAMPLE_ICS);
    expect(todos).toHaveLength(2);

    expect(todos[0]).toMatchObject({
      summary: 'Milch kaufen',
      dueDate: '2026-09-01',
      completed: false,
      uid: '1234-5678@apple.com',
    });

    expect(todos[1]).toMatchObject({
      summary: 'Steuererklärung fertig machen',
      dueDate: null,
      completed: true,
      uid: '9999-0000@apple.com',
    });
  });

  it('ignores VEVENT and other non-VTODO components', () => {
    const todos = parseIcsTodos(SAMPLE_ICS);
    expect(todos.some((t) => t.summary === 'Not a todo, should be ignored')).toBe(false);
  });

  it('returns an empty array for empty or invalid input', () => {
    expect(parseIcsTodos('')).toEqual([]);
    expect(parseIcsTodos(null)).toEqual([]);
    expect(parseIcsTodos(undefined)).toEqual([]);
  });

  it('skips VTODO entries without a SUMMARY', () => {
    const ics = `BEGIN:VTODO\nUID:abc\nDUE:20260101\nEND:VTODO`;
    expect(parseIcsTodos(ics)).toEqual([]);
  });

  it('unescapes commas, semicolons and newlines in SUMMARY', () => {
    const ics = `BEGIN:VTODO\nSUMMARY:Buy milk\\, eggs\\; bread\\nand cheese\nEND:VTODO`;
    const todos = parseIcsTodos(ics);
    expect(todos[0].summary).toBe('Buy milk, eggs; bread\nand cheese');
  });

  it('unfolds multi-line (RFC 5545 folded) SUMMARY values', () => {
    const ics = `BEGIN:VTODO\r\nSUMMARY:This is a very long\r\n  summary line\r\nEND:VTODO\r\n`;
    const todos = parseIcsTodos(ics);
    expect(todos[0].summary).toBe('This is a very long summary line');
  });
});

describe('mergeIcsTodos', () => {
  const emptyTasks = { 1: [], 2: [], 3: [], 4: [], 5: [] };

  it('appends new todos without touching existing tasks', () => {
    const existing = {
      1: [createTaskObject('Existing Q1 task', 1)],
      2: [],
      3: [],
      4: [],
      5: [],
    };
    const existingCopy = JSON.parse(JSON.stringify(existing));

    const todos = [{ summary: 'Neue Aufgabe', dueDate: null, completed: false, uid: 'new-1' }];
    const result = mergeIcsTodos(todos, existing, createTaskObject);

    // Original object must be untouched (no data loss / no mutation of caller state)
    expect(existing).toEqual(existingCopy);
    expect(result.importedCount).toBe(1);
    expect(result.skippedCount).toBe(0);

    const allTexts = Object.values(result.tasks)
      .flat()
      .map((t) => t.text);
    expect(allTexts).toContain('Existing Q1 task');
    expect(allTexts).toContain('Neue Aufgabe');
  });

  it('skips todos already imported before (matched by UID)', () => {
    const existingTask = createTaskObject('Milch kaufen', 4);
    existingTask.icsUid = 'dup-uid';
    const existing = { 1: [], 2: [], 3: [], 4: [existingTask], 5: [] };

    const todos = [{ summary: 'Milch kaufen', dueDate: null, completed: false, uid: 'dup-uid' }];
    const result = mergeIcsTodos(todos, existing, createTaskObject);

    expect(result.importedCount).toBe(0);
    expect(result.skippedCount).toBe(1);
    expect(result.tasks[4]).toHaveLength(1);
  });

  it('falls back to summary+dueDate dedup when no UID is present', () => {
    const existingTask = createTaskObject('Steuererklärung', 2, null, null, '2026-05-01');
    const existing = { 1: [], 2: [existingTask], 3: [], 4: [], 5: [] };

    const todos = [
      { summary: 'Steuererklärung', dueDate: '2026-05-01', completed: false, uid: null },
    ];
    const result = mergeIcsTodos(todos, existing, createTaskObject);

    expect(result.importedCount).toBe(0);
    expect(result.skippedCount).toBe(1);
  });

  it('does not dedupe distinct imports against each other within the same run', () => {
    const todos = [
      { summary: 'Task A', dueDate: null, completed: false, uid: 'a' },
      { summary: 'Task B', dueDate: null, completed: false, uid: 'b' },
    ];
    const result = mergeIcsTodos(todos, emptyTasks, createTaskObject);
    expect(result.importedCount).toBe(2);
  });

  it('marks completed todos as checked and routes them to segment 5', () => {
    const todos = [{ summary: 'Done thing', dueDate: null, completed: true, uid: 'done-1' }];
    const result = mergeIcsTodos(todos, emptyTasks, createTaskObject);

    const importedTask = result.tasks[5].find((t) => t.icsUid === 'done-1');
    expect(importedTask).toBeDefined();
    expect(importedTask.checked).toBe(true);
    expect(typeof importedTask.completedAt).toBe('number');
  });

  it('defaults open todos without a smart-suggest match to Q4', () => {
    const todos = [{ summary: 'xyz', dueDate: null, completed: false, uid: 'q4-1' }];
    const result = mergeIcsTodos(todos, emptyTasks, createTaskObject);

    const importedTask = result.tasks[4].find((t) => t.icsUid === 'q4-1');
    expect(importedTask).toBeDefined();
  });

  it('carries the due date over onto the created task', () => {
    const todos = [{ summary: 'Termin', dueDate: '2026-10-15', completed: false, uid: 'due-1' }];
    const result = mergeIcsTodos(todos, emptyTasks, createTaskObject);
    const importedTask = Object.values(result.tasks)
      .flat()
      .find((t) => t.icsUid === 'due-1');
    expect(importedTask.dueDate).toBe('2026-10-15');
  });
});
