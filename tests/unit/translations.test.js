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
      expect(translations.en.settings.dataManagement).toBe('DATA');
      expect(translations.de.settings.exportBtn).toBe('Export');
      expect(translations.en.settings.exportBtn).toBe('Export');
    });

    it('should have quick add modal translations', () => {
      expect(translations.de.quickAddModal.title).toBe('Neue Aufgabe');
      expect(translations.en.quickAddModal.title).toBe('New Task');
    });
  });
});

// Import DOM helpers for testing
import {
  updateLanguageUI,
  detectBrowserLanguage,
  initLoginTranslations,
} from '../../js/modules/translations.js';
import { beforeEach, afterEach, vi } from 'vitest';

describe('updateLanguageUI', () => {
  let mockCallback;

  beforeEach(() => {
    // Reset language
    setLanguage('en');

    // Create mock callback
    mockCallback = vi.fn();

    // Setup minimal DOM structure for testing
    document.body.innerHTML = `
      <!-- Segment headers -->
      <div class="segment" data-segment="1">
        <div class="segment-header"><h2>Old Title 1</h2></div>
      </div>
      <div class="segment" data-segment="2">
        <div class="segment-header"><h2>Old Title 2</h2></div>
      </div>
      <div class="segment" data-segment="3">
        <div class="segment-header"><h2>Old Title 3</h2></div>
      </div>
      <div class="segment" data-segment="4">
        <div class="segment-header"><h2>Old Title 4</h2></div>
      </div>
      <div class="segment" data-segment="5">
        <div class="segment-header"><h2>Old Title 5</h2></div>
      </div>

      <!-- Modal segment buttons -->
      <button class="segment-btn" data-segment="1">Old Button 1</button>
      <button class="segment-btn" data-segment="2">Old Button 2</button>

      <!-- Task input -->
      <input id="taskInput" placeholder="Old placeholder">

      <!-- Recurring task elements -->
      <span id="recurringEnableText">Old Enable Text</span>
      <span id="recurringIntervalLabel">Old Interval Label</span>
      <select id="recurringInterval">
        <option value="daily">Old Daily</option>
        <option value="weekly">Old Weekly</option>
        <option value="monthly">Old Monthly</option>
      </select>

      <!-- Weekday elements -->
      <span id="weekday-monday">Old Mon</span>
      <span id="weekday-tuesday">Old Tue</span>
      <span id="dayOfMonthLabel">Old Day Label</span>
      <span id="customDaysLabel">Old Custom Days</span>

      <!-- Quick Add Modal -->
      <h2 id="quickAddTitle">Old Quick Add Title</h2>
      <input id="quickAddInput" placeholder="Old Quick Add Placeholder">
      <button id="quickAddSubmitBtn">Old Submit</button>
      <button id="quickAddCancelBtn">Old Cancel</button>
      <span id="quickRecurringEnableText">Old Quick Enable</span>
      <span id="quickRecurringDaily">Old Quick Daily</span>
      <span id="quickRecurringWeekly">Old Quick Weekly</span>
      <span id="quickRecurringMonthly">Old Quick Monthly</span>

      <!-- Quick Add weekdays -->
      <span id="quickMon">Old QMon</span>
      <span id="quickTue">Old QTue</span>

      <!-- Drag hint -->
      <div id="dragHint">
        <p>Old hint text</p>
        <button>Old button</button>
      </div>

      <!-- Settings -->
      <span id="dataManagementTitle">Old Data Title</span>
      <button id="exportJsonBtn">Old Export</button>
      <button id="importGuestTasksBtn">Old Import</button>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Segment header updates', () => {
    it('should update segment 1 header with title and subtitle for German', () => {
      setLanguage('de');
      updateLanguageUI(mockCallback);

      const header = document.querySelector('.segment[data-segment="1"] h2');
      expect(header.innerHTML).toContain('Sofort!');
      expect(header.innerHTML).toContain('wichtig &amp; dringend');
    });

    it('should update segment 2 header for English', () => {
      setLanguage('en');
      updateLanguageUI(mockCallback);

      const header = document.querySelector('.segment[data-segment="2"] h2');
      expect(header.textContent).toBe('Schedule!');
    });

    it('should update all 5 segment headers', () => {
      setLanguage('en');
      updateLanguageUI(mockCallback);

      const headers = document.querySelectorAll('.segment-header h2');
      expect(headers.length).toBe(5);
      expect(headers[0].textContent).toContain('Do!');
      expect(headers[4].textContent).toContain('Done!');
    });
  });

  describe('Modal segment button updates', () => {
    it('should update segment buttons with German translations', () => {
      setLanguage('de');
      updateLanguageUI(mockCallback);

      const buttons = document.querySelectorAll('.segment-btn');
      expect(buttons[0].innerHTML).toContain('Sofort!');
      expect(buttons[0].innerHTML).toContain('wichtig &amp; dringend');
    });

    it('should update segment buttons with English translations', () => {
      setLanguage('en');
      updateLanguageUI(mockCallback);

      const buttons = document.querySelectorAll('.segment-btn');
      expect(buttons[0].innerHTML).toContain('Do!');
      expect(buttons[1].innerHTML).toContain('Schedule!');
    });
  });

  describe('Task input placeholder', () => {
    it('should update task input placeholder to German', () => {
      setLanguage('de');
      updateLanguageUI(mockCallback);

      const input = document.getElementById('taskInput');
      expect(input.placeholder).toBe('Neue Aufgabe');
    });

    it('should update task input placeholder to English', () => {
      setLanguage('en');
      updateLanguageUI(mockCallback);

      const input = document.getElementById('taskInput');
      expect(input.placeholder).toBe('New task');
    });
  });

  describe('Recurring task UI updates', () => {
    it('should update recurring enable label to German', () => {
      setLanguage('de');
      updateLanguageUI(mockCallback);

      const enableText = document.getElementById('recurringEnableText');
      expect(enableText.textContent).toBe('Als wiederkehrende Aufgabe');
    });

    it('should update recurring interval label to English', () => {
      setLanguage('en');
      updateLanguageUI(mockCallback);

      const intervalLabel = document.getElementById('recurringIntervalLabel');
      expect(intervalLabel.textContent).toBe('Interval:');
    });

    it('should update interval select options to German', () => {
      setLanguage('de');
      updateLanguageUI(mockCallback);

      const select = document.getElementById('recurringInterval');
      const dailyOption = select.querySelector('option[value="daily"]');
      const weeklyOption = select.querySelector('option[value="weekly"]');
      const monthlyOption = select.querySelector('option[value="monthly"]');

      expect(dailyOption.textContent).toBe('Täglich');
      expect(weeklyOption.textContent).toBe('Wöchentlich');
      expect(monthlyOption.textContent).toBe('Monatlich');
    });
  });

  describe('Weekday label updates', () => {
    it('should update weekday labels to German abbreviated (2 chars)', () => {
      setLanguage('de');
      updateLanguageUI(mockCallback);

      const monday = document.getElementById('weekday-monday');
      const tuesday = document.getElementById('weekday-tuesday');

      expect(monday.textContent).toBe('Mo');
      expect(tuesday.textContent).toBe('Di');
    });

    it('should update weekday labels to English abbreviated (3 chars)', () => {
      setLanguage('en');
      updateLanguageUI(mockCallback);

      const monday = document.getElementById('weekday-monday');
      const tuesday = document.getElementById('weekday-tuesday');

      expect(monday.textContent).toBe('Mon');
      expect(tuesday.textContent).toBe('Tue');
    });

    it('should update day of month label', () => {
      setLanguage('en');
      updateLanguageUI(mockCallback);

      const dayLabel = document.getElementById('dayOfMonthLabel');
      expect(dayLabel.textContent).toBe('Day of month:');
    });

    it('should update custom days label', () => {
      setLanguage('de');
      updateLanguageUI(mockCallback);

      const customLabel = document.getElementById('customDaysLabel');
      expect(customLabel.textContent).toBe('Tage:');
    });
  });

  describe('Quick Add Modal updates', () => {
    it('should update quick add title to German', () => {
      setLanguage('de');
      updateLanguageUI(mockCallback);

      const title = document.getElementById('quickAddTitle');
      expect(title.textContent).toBe('Neue Aufgabe');
    });

    it('should update quick add input placeholder to English', () => {
      setLanguage('en');
      updateLanguageUI(mockCallback);

      const input = document.getElementById('quickAddInput');
      expect(input.placeholder).toBe('What do you want to do?');
    });

    it('should update quick add buttons to German', () => {
      setLanguage('de');
      updateLanguageUI(mockCallback);

      const submitBtn = document.getElementById('quickAddSubmitBtn');
      const cancelBtn = document.getElementById('quickAddCancelBtn');

      expect(submitBtn.textContent).toBe('Hinzufügen');
      expect(cancelBtn.textContent).toBe('Abbrechen');
    });

    it('should update quick recurring labels to English', () => {
      setLanguage('en');
      updateLanguageUI(mockCallback);

      const enableText = document.getElementById('quickRecurringEnableText');
      const daily = document.getElementById('quickRecurringDaily');
      const weekly = document.getElementById('quickRecurringWeekly');
      const monthly = document.getElementById('quickRecurringMonthly');

      expect(enableText.textContent).toBe('Make recurring');
      expect(daily.textContent).toBe('Daily');
      expect(weekly.textContent).toBe('Weekly');
      expect(monthly.textContent).toBe('Monthly');
    });

    it('should update quick weekday labels to German (2 chars)', () => {
      setLanguage('de');
      updateLanguageUI(mockCallback);

      const mon = document.getElementById('quickMon');
      const tue = document.getElementById('quickTue');

      expect(mon.textContent).toBe('Mo');
      expect(tue.textContent).toBe('Di');
    });
  });

  describe('Drag hint updates', () => {
    it('should update drag hint text to German', () => {
      setLanguage('de');
      updateLanguageUI(mockCallback);

      const dragHint = document.getElementById('dragHint');
      const paragraph = dragHint.querySelector('p');
      const button = dragHint.querySelector('button');

      expect(paragraph.innerHTML).toContain('Tipp:');
      expect(paragraph.innerHTML).toContain('Ziehe Aufgaben');
      expect(button.textContent).toBe('Verstanden');
    });

    it('should update drag hint text to English', () => {
      setLanguage('en');
      updateLanguageUI(mockCallback);

      const dragHint = document.getElementById('dragHint');
      const paragraph = dragHint.querySelector('p');
      const button = dragHint.querySelector('button');

      expect(paragraph.innerHTML).toContain('Tip:');
      expect(paragraph.innerHTML).toContain('Drag tasks');
      expect(button.textContent).toBe('Got it');
    });
  });

  describe('Settings section updates', () => {
    it('should update data management title to German', () => {
      setLanguage('de');
      updateLanguageUI(mockCallback);

      const title = document.getElementById('dataManagementTitle');
      expect(title.textContent).toBe('DATEN');
    });

    it('should update export button to English', () => {
      setLanguage('en');
      updateLanguageUI(mockCallback);

      const exportBtn = document.getElementById('exportJsonBtn');
      expect(exportBtn.textContent).toBe('Export');
    });

    it('should update import guest tasks button to German', () => {
      setLanguage('de');
      updateLanguageUI(mockCallback);

      const importBtn = document.getElementById('importGuestTasksBtn');
      expect(importBtn.textContent).toBe('Import');
    });
  });

  describe('Callback execution', () => {
    it('should call renderAllTasksCallback if provided', () => {
      setLanguage('en');
      updateLanguageUI(mockCallback);

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('should not throw error if callback is not provided', () => {
      setLanguage('en');
      expect(() => updateLanguageUI()).not.toThrow();
    });

    it('should not call callback if undefined', () => {
      setLanguage('en');
      updateLanguageUI(undefined);
      // No assertion needed - just checking it doesn't crash
    });
  });

  describe('Missing elements handling', () => {
    it('should not throw error when segment elements are missing', () => {
      document.body.innerHTML = ''; // Clear all elements

      setLanguage('en');
      expect(() => updateLanguageUI(mockCallback)).not.toThrow();
    });

    it('should handle partial DOM gracefully', () => {
      // Only keep task input
      document.body.innerHTML = '<input id="taskInput" placeholder="Old">';

      setLanguage('de');
      updateLanguageUI(mockCallback);

      const input = document.getElementById('taskInput');
      expect(input.placeholder).toBe('Neue Aufgabe');
    });
  });
});

describe('detectBrowserLanguage', () => {
  it('should detect supported browser languages', () => {
    Object.defineProperty(navigator, 'language', {
      configurable: true,
      value: 'de-DE',
    });

    expect(detectBrowserLanguage()).toBe('de');
  });

  it('should fall back to English for unsupported browser languages', () => {
    Object.defineProperty(navigator, 'language', {
      configurable: true,
      value: 'fr-FR',
    });

    expect(detectBrowserLanguage()).toBe('en');
  });
});

describe('initLoginTranslations', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should update login screen texts for the active language', () => {
    document.body.innerHTML = `
      <div id="loginScreen"><h1>Old title</h1></div>
      <p class="login-subtitle">Old subtitle</p>
      <button id="googleSignInBtn"><span>G</span>Old Google</button>
      <button onclick="signInWithApple()"><span>A</span>Old Apple</button>
      <button id="guestModeBtn"><span>G</span>Old Guest</button>
      <p class="login-info">Old info</p>
    `;
    setLanguage('de');

    initLoginTranslations();

    expect(document.querySelector('#loginScreen h1').textContent).toBe('Eisenhauer Matrix');
    expect(document.querySelector('.login-subtitle').textContent).toBe(
      'Organisiere deine Aufgaben effizient'
    );
    expect(document.getElementById('googleSignInBtn').textContent).toContain('Mit Google anmelden');
    expect(document.querySelector('button[onclick="signInWithApple()"]').textContent).toContain(
      'Mit Apple anmelden'
    );
    expect(document.getElementById('guestModeBtn').textContent).toContain('Als Gast fortfahren');
    expect(document.querySelector('.login-info').textContent).toContain('Melde dich an');
  });

  it('should ignore buttons without trailing text nodes and missing elements', () => {
    document.body.innerHTML = `
      <div id="loginScreen"><h1>Old title</h1></div>
      <button id="googleSignInBtn"><span>Only icon</span></button>
    `;
    setLanguage('en');

    expect(() => initLoginTranslations()).not.toThrow();
    expect(document.getElementById('googleSignInBtn').textContent).toBe('Only icon');
  });
});
