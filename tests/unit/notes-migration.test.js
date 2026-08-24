import { describe, it, expect, beforeEach } from 'vitest';
import {
  isNotesMigrationDone,
  markNotesMigrationDone,
  migrateNotesToTasks,
} from '../../js/modules/notes-migration.js';
import { createTaskObject } from '../../js/modules/tasks.js';

describe('notes migration flag', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('is not done by default', () => {
    expect(isNotesMigrationDone()).toBe(false);
  });

  it('is done after marking it', () => {
    markNotesMigrationDone();
    expect(isNotesMigrationDone()).toBe(true);
  });
});

describe('migrateNotesToTasks', () => {
  const emptyTasks = { 1: [], 2: [], 3: [], 4: [], 5: [] };

  it('returns the tasks unchanged (new object) when there are no notes', () => {
    const result = migrateNotesToTasks([], emptyTasks, createTaskObject);
    expect(result).toEqual(emptyTasks);
    expect(result).not.toBe(emptyTasks);
  });

  it('creates one Q4 task per note, preserving the note text', () => {
    const notes = [
      { text: 'Remember to water the plants', createdAt: 1000 },
      { text: 'Call the dentist', createdAt: 2000 },
    ];
    const result = migrateNotesToTasks(notes, emptyTasks, createTaskObject);

    expect(result[4]).toHaveLength(2);
    expect(result[4].map((t) => t.text)).toEqual([
      'Remember to water the plants',
      'Call the dentist',
    ]);
    expect(result[4].every((t) => t.segment === 4)).toBe(true);
  });

  it('never mutates the passed-in tasks object', () => {
    const existing = { 1: [], 2: [], 3: [], 4: [createTaskObject('Existing Q4 task', 4)], 5: [] };
    const existingCopy = JSON.parse(JSON.stringify(existing));

    migrateNotesToTasks([{ text: 'New note', createdAt: 1000 }], existing, createTaskObject);

    expect(existing).toEqual(existingCopy);
  });

  it('appends migrated notes after existing Q4 tasks without touching other segments', () => {
    const existing = {
      1: [createTaskObject('Q1 task', 1)],
      2: [],
      3: [],
      4: [createTaskObject('Existing Q4 task', 4)],
      5: [],
    };

    const result = migrateNotesToTasks([{ text: 'Migrated note' }], existing, createTaskObject);

    expect(result[1]).toHaveLength(1);
    expect(result[4]).toHaveLength(2);
    expect(result[4][0].text).toBe('Existing Q4 task');
    expect(result[4][1].text).toBe('Migrated note');
  });

  it('skips malformed note entries instead of throwing', () => {
    const notes = [null, { text: '' }, { text: '   ' }, { foo: 'bar' }, { text: 'Valid note' }];
    const result = migrateNotesToTasks(notes, emptyTasks, createTaskObject);

    expect(result[4]).toHaveLength(1);
    expect(result[4][0].text).toBe('Valid note');
  });

  it('handles a non-array notes argument gracefully', () => {
    const result = migrateNotesToTasks(undefined, emptyTasks, createTaskObject);
    expect(result).toEqual(emptyTasks);
  });
});
