/**
 * Translation Module
 * Handles all language-related functionality
 */

export const translations = {
  de: {
    taskInputPlaceholder: 'Neue Aufgabe',
    buttons: {
      add: 'Hinzufügen',
      cancel: 'Abbrechen',
    },
    settings: {
      dataManagement: 'DATEN',
      exportBtn: 'Export',
      importGuestBtn: 'Import Gast-Daten',
      personalizeBtn: 'Personalisieren',
      backupTitle: 'CLOUD BACKUP (BETA)',
      createBackupBtn: 'Backup erstellen',
      lastBackup: 'Letztes Backup',
      never: 'Nie',
    },
    personalize: {
      title: 'Personalisieren',
      appearance: 'ERSCHEINUNGSBILD',
      language: 'SPRACHE',
      themeDark: 'Dunkel',
      themeSystem: 'System',
      langEn: 'English',
      langDe: 'Deutsch',
      environment: 'UMGEBUNG',
      envProduction: 'Standard',
      envStaging: 'Beta',
      envDescription: 'Wechsle zur Beta-Umgebung zum Testen neuer Features',
      envWarning: '⚠️ Beta-Daten werden regelmäßig zurückgesetzt',
      envSwitchTitle: 'Umgebung wechseln',
      envSwitchMessage: 'Du wirst abgemeldet und zur {env}-Umgebung weitergeleitet.',
      envSwitchConfirm: 'Wechseln',
      envSwitchCancel: 'Abbrechen',
    },
    undo: {
      button: 'Rückgängig',
      taskDeleted: 'Aufgabe gelöscht',
      taskMoved: 'Aufgabe verschoben',
      taskCompleted: 'Als erledigt markiert',
      taskUncompleted: 'Als unerledigt markiert',
    },
    tutorial: {
      title: 'Willkommen!',
      skip: 'Überspringen',
      back: 'Zurück',
      next: 'Weiter',
      done: 'Fertig',
      dontShow: 'Nicht mehr anzeigen',
      slide1: {
        title: 'Drag & Drop',
        text: 'Ziehe Aufgaben zwischen Segmenten, um sie nach der Eisenhower-Matrix zu organisieren.',
      },
      slide2: {
        title: 'Wischen zum Löschen',
        text: 'Wische nach links über eine Aufgabe, um sie schnell zu löschen. Perfekt für Mobilgeräte!',
      },
      slide3: {
        title: 'Schnellaktionen',
        text: 'Tippe auf den + Button neben jedem Segment, um schnell Aufgaben hinzuzufügen. Markiere Aufgaben als erledigt!',
      },
    },
    quickAddModal: {
      title: 'Neue Aufgabe',
      inputPlaceholder: 'Was möchtest du tun?',
      monthDayLabel: 'Tag (1-31)',
    },
    segments: {
      1: { title: 'Sofort!', subtitle: 'wichtig & dringend' },
      2: { title: 'Planen!', subtitle: 'wichtig' },
      3: { title: 'Abgeben!', subtitle: 'dringend' },
      4: { title: 'Später!', subtitle: 'optional' },
      5: { title: 'Fertig!', subtitle: '' },
    },
    recurring: {
      title: 'Wiederkehrende Aufgabe',
      enableLabel: 'Als wiederkehrende Aufgabe',
      intervalLabel: 'Intervall:',
      daily: 'Täglich',
      weekly: 'Wöchentlich',
      monthly: 'Monatlich',
      custom: 'Benutzerdefiniert',
      customDays: 'Tage:',
      weekdays: {
        monday: 'Montag',
        tuesday: 'Dienstag',
        wednesday: 'Mittwoch',
        thursday: 'Donnerstag',
        friday: 'Freitag',
        saturday: 'Samstag',
        sunday: 'Sonntag',
      },
      dayOfMonth: 'Tag des Monats:',
      indicator: '',
    },
  },
  en: {
    taskInputPlaceholder: 'New task',
    buttons: {
      add: 'Add',
      cancel: 'Cancel',
    },
    settings: {
      dataManagement: 'DATA MANAGEMENT',
      exportBtn: 'Export',
      importGuestBtn: 'Import Guest Data',
      personalizeBtn: 'Personalize',
      backupTitle: 'CLOUD BACKUP (BETA)',
      createBackupBtn: 'Create Backup',
      lastBackup: 'Last backup',
      never: 'Never',
    },
    personalize: {
      title: 'Personalize',
      appearance: 'APPEARANCE',
      language: 'LANGUAGE',
      themeDark: 'Dark',
      themeSystem: 'System',
      langEn: 'English',
      langDe: 'Deutsch',
      environment: 'ENVIRONMENT',
      envProduction: 'Standard',
      envStaging: 'Beta',
      envDescription: 'Switch to beta environment to test new features',
      envWarning: '⚠️ Beta data is reset regularly',
      envSwitchTitle: 'Switch Environment',
      envSwitchMessage: 'You will be signed out and redirected to the {env} environment.',
      envSwitchConfirm: 'Switch',
      envSwitchCancel: 'Cancel',
    },
    undo: {
      button: 'Undo',
      taskDeleted: 'Task deleted',
      taskMoved: 'Task moved',
      taskCompleted: 'Marked as complete',
      taskUncompleted: 'Marked as incomplete',
    },
    tutorial: {
      title: 'Welcome!',
      skip: 'Skip',
      back: 'Back',
      next: 'Next',
      done: 'Done',
      dontShow: "Don't show this again",
      slide1: {
        title: 'Drag & Drop',
        text: 'Drag tasks between segments to organize them according to the Eisenhower Matrix.',
      },
      slide2: {
        title: 'Swipe to Delete',
        text: 'Swipe left on any task to quickly delete it. Perfect for mobile!',
      },
      slide3: {
        title: 'Quick Actions',
        text: 'Tap the + button next to each segment to quickly add tasks. Check tasks to mark them as done!',
      },
    },
    quickAddModal: {
      title: 'New Task',
      inputPlaceholder: 'What do you want to do?',
      monthDayLabel: 'Day (1-31)',
    },
    segments: {
      1: { title: 'Do!', subtitle: '' },
      2: { title: 'Schedule!', subtitle: '' },
      3: { title: 'Delegate!', subtitle: '' },
      4: { title: 'Ignore!', subtitle: '' },
      5: { title: 'Done!', subtitle: '' },
    },
    recurring: {
      title: 'Recurring Task',
      enableLabel: 'Make recurring',
      intervalLabel: 'Interval:',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      custom: 'Custom',
      customDays: 'Days:',
      weekdays: {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday',
      },
      dayOfMonth: 'Day of month:',
      indicator: '',
    },
  },
};

export let currentLanguage = 'en';

export function setLanguage(lang) {
  currentLanguage = lang;
}

export function getCurrentLanguage() {
  return currentLanguage;
}

export function getTranslation(key) {
  return translations[currentLanguage];
}

export function getRecurringDescription(recurring) {
  const lang = translations[currentLanguage].recurring;

  switch (recurring.interval) {
    case 'daily':
      return lang.daily;
    case 'weekly':
      if (recurring.weekdays && recurring.weekdays.length > 0) {
        const days = recurring.weekdays.map((day) => {
          const dayNames = [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
          ];
          return lang.weekdays[dayNames[day]];
        });
        return `${lang.weekly}: ${days.join(', ')}`;
      }
      return lang.weekly;
    case 'monthly':
      return `${lang.monthly} (${recurring.dayOfMonth}.)`;
    case 'custom':
      return `${currentLanguage === 'de' ? 'Alle' : 'Every'} ${recurring.customDays} ${currentLanguage === 'de' ? 'Tage' : 'days'}`;
    default:
      return recurring.interval;
  }
}

export function updateLanguageUI(renderAllTasksCallback) {
  const lang = translations[currentLanguage];

  // Update segment headers
  for (let i = 1; i <= 5; i++) {
    const segment = document.querySelector(`.segment[data-segment="${i}"]`);
    if (segment) {
      const header = segment.querySelector('.segment-header h2');
      if (header) {
        const segmentData = lang.segments[i];
        if (segmentData.subtitle) {
          header.innerHTML = `${segmentData.title} <span style="font-size: 0.7em; opacity: 0.7; font-weight: 400;">${segmentData.subtitle}</span>`;
        } else {
          header.textContent = segmentData.title;
        }
      }
    }
  }

  // Update modal segment buttons
  const segmentButtons = document.querySelectorAll('.segment-btn');
  segmentButtons.forEach((btn) => {
    const segmentId = parseInt(btn.dataset.segment);
    const segmentData = lang.segments[segmentId];
    if (segmentData.subtitle) {
      btn.innerHTML = `<strong>${segmentData.title}</strong><br><span style="font-size: 0.8em; opacity: 0.8;">${segmentData.subtitle}</span>`;
    } else {
      btn.innerHTML = `<strong>${segmentData.title}</strong>`;
    }
  });

  // Update recurring task UI translations
  const recurringEnableText = document.getElementById('recurringEnableText');
  if (recurringEnableText) {
    recurringEnableText.textContent = lang.recurring.enableLabel;
  }

  const recurringIntervalLabel = document.getElementById('recurringIntervalLabel');
  if (recurringIntervalLabel) {
    recurringIntervalLabel.textContent = lang.recurring.intervalLabel;
  }

  // Update interval select options
  const recurringInterval = document.getElementById('recurringInterval');
  if (recurringInterval) {
    const dailyOption = recurringInterval.querySelector('option[value="daily"]');
    const weeklyOption = recurringInterval.querySelector('option[value="weekly"]');
    const monthlyOption = recurringInterval.querySelector('option[value="monthly"]');

    if (dailyOption) dailyOption.textContent = lang.recurring.daily;
    if (weeklyOption) weeklyOption.textContent = lang.recurring.weekly;
    if (monthlyOption) monthlyOption.textContent = lang.recurring.monthly;
  }

  // Update weekday labels
  const weekdayMap = {
    'weekday-monday': 'monday',
    'weekday-tuesday': 'tuesday',
    'weekday-wednesday': 'wednesday',
    'weekday-thursday': 'thursday',
    'weekday-friday': 'friday',
    'weekday-saturday': 'saturday',
    'weekday-sunday': 'sunday',
  };

  Object.entries(weekdayMap).forEach(([id, key]) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.textContent =
        currentLanguage === 'de'
          ? lang.recurring.weekdays[key].substring(0, 2)
          : lang.recurring.weekdays[key].substring(0, 3);
    }
  });

  const dayOfMonthLabel = document.getElementById('dayOfMonthLabel');
  if (dayOfMonthLabel) {
    dayOfMonthLabel.textContent = lang.recurring.dayOfMonth;
  }

  const customDaysLabel = document.getElementById('customDaysLabel');
  if (customDaysLabel) {
    customDaysLabel.textContent = lang.recurring.customDays;
  }

  // Update task input placeholder
  const taskInput = document.getElementById('taskInput');
  if (taskInput) {
    taskInput.placeholder = lang.taskInputPlaceholder;
  }

  // Update Quick Add Modal texts
  const quickAddTitle = document.getElementById('quickAddTitle');
  if (quickAddTitle) {
    quickAddTitle.textContent = lang.quickAddModal.title;
  }

  const quickAddInput = document.getElementById('quickAddInput');
  if (quickAddInput) {
    quickAddInput.placeholder = lang.quickAddModal.inputPlaceholder;
  }

  const quickAddSubmitBtn = document.getElementById('quickAddSubmitBtn');
  if (quickAddSubmitBtn) {
    quickAddSubmitBtn.textContent = lang.buttons.add;
  }

  const quickAddCancelBtn = document.getElementById('quickAddCancelBtn');
  if (quickAddCancelBtn) {
    quickAddCancelBtn.textContent = lang.buttons.cancel;
  }

  // Update Quick Add Recurring texts
  const quickRecurringEnableText = document.getElementById('quickRecurringEnableText');
  if (quickRecurringEnableText) {
    quickRecurringEnableText.textContent = lang.recurring.enableLabel;
  }

  const quickRecurringDaily = document.getElementById('quickRecurringDaily');
  if (quickRecurringDaily) {
    quickRecurringDaily.textContent = lang.recurring.daily;
  }

  const quickRecurringWeekly = document.getElementById('quickRecurringWeekly');
  if (quickRecurringWeekly) {
    quickRecurringWeekly.textContent = lang.recurring.weekly;
  }

  const quickRecurringMonthly = document.getElementById('quickRecurringMonthly');
  if (quickRecurringMonthly) {
    quickRecurringMonthly.textContent = lang.recurring.monthly;
  }

  // Update Quick Add weekday labels (abbreviated)
  const quickWeekdayMap = {
    quickMon: 'monday',
    quickTue: 'tuesday',
    quickWed: 'wednesday',
    quickThu: 'thursday',
    quickFri: 'friday',
    quickSat: 'saturday',
    quickSun: 'sunday',
  };

  Object.entries(quickWeekdayMap).forEach(([id, key]) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.textContent =
        currentLanguage === 'de'
          ? lang.recurring.weekdays[key].substring(0, 2)
          : lang.recurring.weekdays[key].substring(0, 3);
    }
  });

  // Update Quick Add drag hint text
  const dragHint = document.getElementById('dragHint');
  if (dragHint) {
    const hintText =
      currentLanguage === 'de'
        ? '💡 <strong>Tipp:</strong> Ziehe Aufgaben zwischen Kategorien, um sie zu verschieben. Wische nach links, um zu löschen.'
        : '💡 <strong>Tip:</strong> Drag tasks between categories to move them. Swipe left to delete.';
    const hintParagraph = dragHint.querySelector('p');
    if (hintParagraph) {
      hintParagraph.innerHTML = hintText;
    }

    const btnText = currentLanguage === 'de' ? 'Verstanden' : 'Got it';
    const hintButton = dragHint.querySelector('button');
    if (hintButton) {
      hintButton.textContent = btnText;
    }
  }

  // Update Settings Data Management section
  const dataManagementTitle = document.getElementById('dataManagementTitle');
  if (dataManagementTitle) {
    dataManagementTitle.textContent = lang.settings.dataManagement;
  }

  const exportJsonBtn = document.getElementById('exportJsonBtn');
  if (exportJsonBtn) {
    exportJsonBtn.textContent = lang.settings.exportBtn;
  }

  const importGuestTasksBtn = document.getElementById('importGuestTasksBtn');
  if (importGuestTasksBtn) {
    importGuestTasksBtn.textContent = lang.settings.importGuestBtn;
  }

  const personalizeBtn = document.getElementById('personalizeBtn');
  if (personalizeBtn) {
    personalizeBtn.textContent = lang.settings.personalizeBtn;
  }

  // Update Personalize Modal texts
  const personalizeTitle = document.getElementById('personalizeTitle');
  if (personalizeTitle) {
    personalizeTitle.textContent = lang.personalize.title;
  }

  const personalizeAppearanceTitle = document.getElementById('personalizeAppearanceTitle');
  if (personalizeAppearanceTitle) {
    personalizeAppearanceTitle.textContent = lang.personalize.appearance;
  }

  const personalizeLanguageTitle = document.getElementById('personalizeLanguageTitle');
  if (personalizeLanguageTitle) {
    personalizeLanguageTitle.textContent = lang.personalize.language;
  }

  const personalizeThemeDark = document.getElementById('personalizeThemeDark');
  if (personalizeThemeDark) {
    personalizeThemeDark.textContent = lang.personalize.themeDark;
  }

  const personalizeThemeSystem = document.getElementById('personalizeThemeSystem');
  if (personalizeThemeSystem) {
    personalizeThemeSystem.textContent = lang.personalize.themeSystem;
  }

  // Update Environment section texts
  const personalizeEnvironmentTitle = document.getElementById('personalizeEnvironmentTitle');
  if (personalizeEnvironmentTitle) {
    personalizeEnvironmentTitle.textContent = lang.personalize.environment;
  }

  const personalizeEnvProduction = document.getElementById('personalizeEnvProduction');
  if (personalizeEnvProduction) {
    personalizeEnvProduction.textContent = lang.personalize.envProduction;
  }

  const personalizeEnvStaging = document.getElementById('personalizeEnvStaging');
  if (personalizeEnvStaging) {
    personalizeEnvStaging.textContent = lang.personalize.envStaging;
  }

  const personalizeEnvDescription = document.getElementById('personalizeEnvDescription');
  if (personalizeEnvDescription) {
    personalizeEnvDescription.textContent = lang.personalize.envDescription;
  }

  const personalizeEnvWarning = document.getElementById('personalizeEnvWarning');
  if (personalizeEnvWarning) {
    personalizeEnvWarning.textContent = lang.personalize.envWarning;
  }

  // Update Cloud Backup section texts
  const backupTitle = document.getElementById('backupTitle');
  if (backupTitle) {
    backupTitle.textContent = lang.settings.backupTitle;
  }

  const createBackupBtn = document.getElementById('createBackupBtn');
  if (createBackupBtn) {
    createBackupBtn.textContent = lang.settings.createBackupBtn;
  }

  // Update last backup info text (label and "never" word) while preserving timestamp
  const lastBackupInfo = document.getElementById('lastBackupInfo');
  if (lastBackupInfo) {
    const existingText = lastBackupInfo.textContent || '';
    let suffix = '';

    const colonIndex = existingText.indexOf(':');
    if (colonIndex !== -1) {
      suffix = existingText.slice(colonIndex + 1).trim();
    }

    const lowerSuffix = suffix.toLowerCase();
    if (!suffix || lowerSuffix === 'never' || lowerSuffix === 'nie') {
      suffix = lang.settings.never;
    }

    lastBackupInfo.textContent = suffix
      ? `${lang.settings.lastBackup}: ${suffix}`
      : lang.settings.lastBackup;
  }

  // Re-render all tasks to update recurring indicators
  if (renderAllTasksCallback) {
    renderAllTasksCallback();
  }
}
