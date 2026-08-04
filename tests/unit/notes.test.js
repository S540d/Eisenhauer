/**
 * Unit Tests for Notes Module (Issue #371)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  generateNoteId,
  addNote,
  deleteNote,
  getAllNotes,
  setAllNotes,
} from '../../js/modules/notes.js';

describe('Notes', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T10:00:00Z'));
    setAllNotes([]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('generateNoteId', () => {
    it('should generate unique string IDs', () => {
      const id1 = generateNoteId();
      const id2 = generateNoteId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
    });

    it('should fall back to a timestamp-based ID when crypto.randomUUID is unavailable', () => {
      vi.stubGlobal('crypto', undefined);

      const id = generateNoteId();
      expect(id).toMatch(/^note-/);

      vi.unstubAllGlobals();
    });
  });

  describe('addNote', () => {
    it('should create a note with id, text and createdAt', () => {
      const note = addNote('Buy milk');

      expect(note).toMatchObject({ text: 'Buy milk', createdAt: Date.now() });
      expect(note.id).toBeTruthy();
      expect(getAllNotes()).toHaveLength(1);
      expect(getAllNotes()[0]).toBe(note);
    });

    it('should trim note text', () => {
      const note = addNote('  spaced out  ');
      expect(note.text).toBe('spaced out');
    });

    it('should invoke the save callback with the created note', () => {
      const saveCallback = vi.fn();
      const note = addNote('Call dentist', saveCallback);
      expect(saveCallback).toHaveBeenCalledWith(note);
    });

    it('should set sourceTaskId when provided', () => {
      const note = addNote('From a task', null, 'task-123');
      expect(note.sourceTaskId).toBe('task-123');
    });

    it('should not set sourceTaskId when not provided', () => {
      const note = addNote('Standalone');
      expect(note).not.toHaveProperty('sourceTaskId');
    });

    it('should reject non-string text', () => {
      expect(() => addNote(42)).toThrow(TypeError);
    });

    it('should reject empty text', () => {
      expect(() => addNote('   ')).toThrow('Note text cannot be empty');
    });

    it('should reject text over 500 characters', () => {
      expect(() => addNote('x'.repeat(501))).toThrow('Note text must not exceed 500 characters');
    });
  });

  describe('deleteNote', () => {
    it('should remove a note by ID and return it', () => {
      const note = addNote('Delete me');
      const deleteCallback = vi.fn();

      const removed = deleteNote(note.id, deleteCallback);

      expect(removed).toBe(note);
      expect(deleteCallback).toHaveBeenCalledWith(note);
      expect(getAllNotes()).toHaveLength(0);
    });

    it('should return null and leave the array untouched for an unknown ID', () => {
      addNote('Keep me');
      const removed = deleteNote('unknown-id');

      expect(removed).toBeNull();
      expect(getAllNotes()).toHaveLength(1);
    });
  });

  describe('getAllNotes / setAllNotes', () => {
    it('should round-trip a notes array', () => {
      const notes = [{ id: '1', text: 'A', createdAt: 1 }];
      setAllNotes(notes);
      expect(getAllNotes()).toBe(notes);
    });

    it('should default to an empty array for non-array input', () => {
      setAllNotes(null);
      expect(getAllNotes()).toEqual([]);
    });
  });
});
