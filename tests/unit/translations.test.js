/**
 * Unit Tests for Translations Module
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  translations,
  setLanguage,
  getCurrentLanguage,
  getTranslation,
  getRecurringDescription,
} from '../../js/modules/translations.js';

describe('Translations', () => {
  beforeEach(() => {
    // Reset to default language
    setLanguage('en');
  });

  describe('Translation Data', () => {
    it('should have German translations', () => {
      expect(translations.de).toBeDefined();
      expect(translations.de.taskInputPlaceholder).toBe('Neue Aufgabe');
      expect(translations.de.segments[1].title).toBe('Sofort!');
    });

    it('should have English translations', () => {
      expect(translations.en).toBeDefined();
      expect(translations.en.taskInputPlaceholder).toBe('New task');
      expect(translations.en.segments[1].title).toBe('Do!');
    });

    it('should have all 5 segments defined for both languages', () => {
      [1, 2, 3, 4, 5].forEach((segmentId) => {
        expect(translations.de.segments[segmentId]).toBeDefined();
        expect(translations.de.segments[segmentId].title).toBeTruthy();
        expect(translations.en.segments[segmentId]).toBeDefined();
        expect(translations.en.segments[segmentId].title).toBeTruthy();
      });
    });

    it('should have recurring translations for both languages', () => {
      expect(translations.de.recurring).toBeDefined();
      expect(translations.de.recurring.daily).toBe('Täglich');
      expect(translations.en.recurring).toBeDefined();
      expect(translations.en.recurring.daily).toBe('Daily');
    });

    it('should have button translations', () => {
      expect(translations.de.buttons.add).toBe('Hinzufügen');
      expect(translations.de.buttons.cancel).toBe('Abbrechen');
      expect(translations.en.buttons.add).toBe('Add');
      expect(translations.en.buttons.cancel).toBe('Cancel');
    });
  });

  describe('setLanguage', () => {
    it('should set language to German', () => {
      setLanguage('de');
      expect(getCurrentLanguage()).toBe('de');
    });

    it('should set language to English', () => {
      setLanguage('en');
      expect(getCurrentLanguage()).toBe('en');
    });
  });

  describe('getCurrentLanguage', () => {
    it('should return current language', () => {
      setLanguage('de');
      expect(getCurrentLanguage()).toBe('de');

      setLanguage('en');
      expect(getCurrentLanguage()).toBe('en');
    });
  });

  describe('getTranslation', () => {
    it('should return German translations when language is de', () => {
      setLanguage('de');
      const trans = getTranslation('de');
      expect(trans.taskInputPlaceholder).toBe('Neue Aufgabe');
    });

    it('should return English translations when language is en', () => {
      setLanguage('en');
      const trans = getTranslation('en');
      expect(trans.taskInputPlaceholder).toBe('New task');
    });
  });

  describe('getRecurringDescription', () => {
    beforeEach(() => {
      setLanguage('en');
    });

    it('should return daily description', () => {
      const recurring = { interval: 'daily' };
      const description = getRecurringDescription(recurring);
      expect(description).toBe('Daily');
    });

    it('should return weekly description without specific days', () => {
      const recurring = { interval: 'weekly' };
      const description = getRecurringDescription(recurring);
      expect(description).toBe('Weekly');
    });

    it('should return weekly description with specific weekdays', () => {
      const recurring = {
        interval: 'weekly',
        weekdays: [1, 3, 5], // Monday, Wednesday, Friday
      };
      const description = getRecurringDescription(recurring);
      expect(description).toContain('Weekly');
      expect(description).toContain('Monday');
      expect(description).toContain('Wednesday');
      expect(description).toContain('Friday');
    });

    it('should return monthly description with day of month', () => {
      const recurring = {
        interval: 'monthly',
        dayOfMonth: 15,
      };
      const description = getRecurringDescription(recurring);
      expect(description).toContain('Monthly');
      expect(description).toContain('15');
    });

    it('should return custom interval description in English', () => {
      setLanguage('en');
      const recurring = {
        interval: 'custom',
        customDays: 3,
      };
      const description = getRecurringDescription(recurring);
      expect(description).toContain('Every');
      expect(description).toContain('3');
      expect(description).toContain('days');
    });

    it('should return custom interval description in German', () => {
      setLanguage('de');
      const recurring = {
        interval: 'custom',
        customDays: 7,
      };
      const description = getRecurringDescription(recurring);
      expect(description).toContain('Alle');
      expect(description).toContain('7');
      expect(description).toContain('Tage');
    });

    it('should return interval as-is for unknown types', () => {
      const recurring = {
        interval: 'unknown-interval',
      };
      const description = getRecurringDescription(recurring);
      expect(description).toBe('unknown-interval');
    });

    it('should handle all weekdays correctly', () => {
      const recurring = {
        interval: 'weekly',
        weekdays: [0, 1, 2, 3, 4, 5, 6], // All days
      };
      const description = getRecurringDescription(recurring);
      expect(description).toContain('Sunday');
      expect(description).toContain('Monday');
      expect(description).toContain('Saturday');
    });
  });

  describe('Language-specific translations', () => {
    it('should have correct German weekday names', () => {
      const weekdays = translations.de.recurring.weekdays;
      expect(weekdays.monday).toBe('Montag');
      expect(weekdays.tuesday).toBe('Dienstag');
      expect(weekdays.wednesday).toBe('Mittwoch');
      expect(weekdays.thursday).toBe('Donnerstag');
      expect(weekdays.friday).toBe('Freitag');
      expect(weekdays.saturday).toBe('Samstag');
      expect(weekdays.sunday).toBe('Sonntag');
    });

    it('should have correct English weekday names', () => {
      const weekdays = translations.en.recurring.weekdays;
      expect(weekdays.monday).toBe('Monday');
      expect(weekdays.tuesday).toBe('Tuesday');
      expect(weekdays.wednesday).toBe('Wednesday');
      expect(weekdays.thursday).toBe('Thursday');
      expect(weekdays.friday).toBe('Friday');
      expect(weekdays.saturday).toBe('Saturday');
      expect(weekdays.sunday).toBe('Sunday');
    });

    it('should have settings translations', () => {
      expect(translations.de.settings.dataManagement).toBe('DATEN');
      expect(translations.en.settings.dataManagement).toBe('DATA MANAGEMENT');
      expect(translations.de.settings.exportBtn).toBe('Export');
      expect(translations.en.settings.exportBtn).toBe('Export');
    });

    it('should have quick add modal translations', () => {
      expect(translations.de.quickAddModal.title).toBe('Neue Aufgabe');
      expect(translations.en.quickAddModal.title).toBe('New Task');
    });
  });
});
