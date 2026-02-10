/**
 * Translation Module
 * Handles all language-related functionality
 */

export const translations = {
  de: {
    taskInputPlaceholder: 'Neue Aufgabe',
    login: {
      title: 'Eisenhauer Matrix',
      subtitle: 'Organisiere deine Aufgaben effizient',
      signInGoogle: 'Mit Google anmelden',
      signInApple: 'Mit Apple anmelden',
      continueGuest: 'Als Gast fortfahren',
      guestInfo:
        'Melde dich an, um deine Daten in der Cloud zu speichern und auf allen Geräten zu synchronisieren. Im Gast-Modus werden deine Daten lokal auf diesem Gerät gespeichert.',
    },
    focusMode: {
      label: 'Fokus-Modus',
      tooltip: 'Nur wichtige Aufgaben anzeigen (Q1 + Q2)',
      active: 'Fokus-Modus aktiv',
    },
    buttons: {
      add: 'Hinzufügen',
      cancel: 'Abbrechen',
      close: 'Schließen',
    },
    settings: {
      title: 'Einstellungen',
      account: 'KONTO',
      signOut: 'Abmelden',
      dataManagement: 'DATEN',
      exportBtn: 'Export',
      importGuestBtn: 'Import',
      personalizeBtn: 'Personalisieren',
      backupTitle: 'CLOUD BACKUP (BETA)',
      createBackupBtn: 'Backup erstellen',
      lastBackup: 'Letztes Backup',
      never: 'Nie',
      sendFeedback: 'Feedback senden',
      supportMe: 'Unterstütze mich',
      about: 'Über',
      q4Detox: 'Q4-DETOX',
      q4DetoxBtn: 'Q4 aufräumen',
      q4DetoxConfirm: 'Alle Aufgaben aus "Später!" archivieren?',
      q4DetoxSuccess: 'Q4-Aufgaben archiviert!',
      q4DetoxEmpty: 'Keine Q4-Aufgaben vorhanden',
    },
    personalize: {
      title: 'Personalisieren',
      appearance: 'ERSCHEINUNGSBILD',
      language: 'SPRACHE',
      themeDark: 'Dunkel',
      themeSystem: 'System',
      langEn: 'English',
      langDe: 'Deutsch',
      smartFunctions: 'SMARTE FUNKTIONEN',
      smartFunctionsLabel: 'Smarte Funktionen aktivieren',
      smartFunctionsDesc:
        'Automatisch Aufgaben als dringend markieren, wenn sie in 3 Tagen fällig sind',
    },
    about: {
      title: 'Über',
      licenseTitle: 'APP-LIZENZ',
      licenseInfo: 'Open Source • MIT License',
      noCommercial: 'Keine kommerzielle Nutzung ohne Genehmigung',
      repository: 'GitHub Repository',
      supportTitle: 'UNTERSTÜTZUNG',
      supportMe: 'Support me',
      reportBug: 'Fehler melden',
    },
    undo: {
      button: 'Rückgängig',
      taskDeleted: 'Aufgabe gelöscht',
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
      dueDate: 'Fällig am',
    },
    segmentModal: {
      title: 'Wähle ein Segment',
    },
    editRecurring: {
      title: 'Wiederkehrende Aufgabe bearbeiten',
      disableRecurring: 'Wiederholung entfernen (Aufgabe einmalig machen)',
      deleteTask: 'Diese Aufgabe dauerhaft löschen',
      save: 'Speichern',
    },
    metrics: {
      title: '📊 Produktivitäts-Statistiken',
      close: 'Schließen',
    },
    dragHint: {
      tip: 'Ziehe Aufgaben zwischen Kategorien, um sie zu verschieben. Wische nach links, um zu löschen.',
      gotIt: 'Verstanden',
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
    login: {
      title: 'Eisenhauer Matrix',
      subtitle: 'Organize your tasks efficiently',
      signInGoogle: 'Sign in with Google',
      signInApple: 'Sign in with Apple',
      continueGuest: 'Continue as guest',
      guestInfo:
        'Sign in to save your data to the cloud and sync across all devices. In guest mode, your data is stored locally on this device.',
    },
    focusMode: {
      label: 'Focus Mode',
      tooltip: 'Show only important tasks (Q1 + Q2)',
      active: 'Focus mode active',
    },
    buttons: {
      add: 'Add',
      cancel: 'Cancel',
      close: 'Close',
    },
    settings: {
      title: 'Settings',
      account: 'ACCOUNT',
      signOut: 'Sign Out',
      dataManagement: 'DATA',
      exportBtn: 'Export',
      importGuestBtn: 'Import',
      personalizeBtn: 'Personalize',
      backupTitle: 'CLOUD BACKUP (BETA)',
      createBackupBtn: 'Create Backup',
      lastBackup: 'Last backup',
      never: 'Never',
      sendFeedback: 'Send Feedback',
      supportMe: 'Support Me',
      about: 'About',
      q4Detox: 'Q4 DETOX',
      q4DetoxBtn: 'Clear Q4',
      q4DetoxConfirm: 'Archive all tasks from "Ignore!"?',
      q4DetoxSuccess: 'Q4 tasks archived!',
      q4DetoxEmpty: 'No Q4 tasks to archive',
    },
    personalize: {
      title: 'Personalize',
      appearance: 'APPEARANCE',
      language: 'LANGUAGE',
      themeDark: 'Dark',
      themeSystem: 'System',
      langEn: 'English',
      langDe: 'Deutsch',
      smartFunctions: 'SMART FUNCTIONS',
      smartFunctionsLabel: 'Enable Smart Functions',
      smartFunctionsDesc: 'Automatically mark tasks as urgent when due within 3 days',
    },
    about: {
      title: 'About',
      licenseTitle: 'APP LICENSE',
      licenseInfo: 'Open Source • MIT License',
      noCommercial: 'No commercial use without permission',
      repository: 'GitHub Repository',
      supportTitle: 'SUPPORT',
      supportMe: 'Support me',
      reportBug: 'Report a bug',
    },
    undo: {
      button: 'Undo',
      taskDeleted: 'Task deleted',
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
      dueDate: 'Due Date',
    },
    segmentModal: {
      title: 'Choose a segment',
    },
    editRecurring: {
      title: 'Edit Recurring Task',
      disableRecurring: 'Remove recurring (make one-time task)',
      deleteTask: 'Delete this task permanently',
      save: 'Save',
    },
    metrics: {
      title: '📊 Productivity Statistics',
      close: 'Close',
    },
    dragHint: {
      tip: 'Drag tasks between categories to move them. Swipe left to delete.',
      gotIt: 'Got it',
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

/**
 * Detect browser language automatically
 * @returns {string} 'en' or 'de' (fallback to 'en')
 */
export function detectBrowserLanguage() {
  const browserLang = navigator.language.split('-')[0]; // 'de-DE' -> 'de'
  return ['en', 'de'].includes(browserLang) ? browserLang : 'en';
}

export function setLanguage(lang) {
  currentLanguage = lang;
}

export function getCurrentLanguage() {
  return currentLanguage;
}

export function getTranslation() {
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

/**
 * Initialize login screen translations (called once on app load)
 */
export function initLoginTranslations() {
  const lang = translations[currentLanguage];

  // Update login screen title
  const loginTitle = document.querySelector('#loginScreen h1');
  if (loginTitle) {
    loginTitle.textContent = lang.login.title;
  }

  // Update login subtitle
  const loginSubtitle = document.querySelector('.login-subtitle');
  if (loginSubtitle) {
    loginSubtitle.textContent = lang.login.subtitle;
  }

  // Update Google Sign In button
  const googleSignInBtn = document.querySelector('#googleSignInBtn');
  if (googleSignInBtn) {
    const btnText = googleSignInBtn.childNodes[googleSignInBtn.childNodes.length - 1];
    if (btnText && btnText.nodeType === Node.TEXT_NODE) {
      btnText.textContent = lang.login.signInGoogle;
    }
  }

  // Update Apple Sign In button (if visible)
  const appleSignInBtn = document.querySelector('button[onclick="signInWithApple()"]');
  if (appleSignInBtn) {
    const btnText = appleSignInBtn.childNodes[appleSignInBtn.childNodes.length - 1];
    if (btnText && btnText.nodeType === Node.TEXT_NODE) {
      btnText.textContent = lang.login.signInApple;
    }
  }

  // Update Guest Mode button
  const guestModeBtn = document.querySelector('#guestModeBtn');
  if (guestModeBtn) {
    const btnText = guestModeBtn.childNodes[guestModeBtn.childNodes.length - 1];
    if (btnText && btnText.nodeType === Node.TEXT_NODE) {
      btnText.textContent = lang.login.continueGuest;
    }
  }

  // Update login info text
  const loginInfo = document.querySelector('.login-info');
  if (loginInfo) {
    loginInfo.textContent = lang.login.guestInfo;
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

  // Update Quick Add Due Date label
  const quickAddDueDateLabel = document.getElementById('quickAddDueDateLabel');
  if (quickAddDueDateLabel) {
    quickAddDueDateLabel.textContent = lang.quickAddModal.dueDate;
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

  const personalizeSmartFunctionsTitle = document.getElementById('personalizeSmartFunctionsTitle');
  if (personalizeSmartFunctionsTitle) {
    personalizeSmartFunctionsTitle.textContent = lang.personalize.smartFunctions;
  }

  const smartFunctionsLabel = document.getElementById('smartFunctionsLabel');
  if (smartFunctionsLabel) {
    smartFunctionsLabel.textContent = lang.personalize.smartFunctionsLabel;
  }

  const smartFunctionsDesc = document.getElementById('smartFunctionsDesc');
  if (smartFunctionsDesc) {
    smartFunctionsDesc.textContent = lang.personalize.smartFunctionsDesc;
  }

  const personalizeThemeDark = document.getElementById('personalizeThemeDark');
  if (personalizeThemeDark) {
    personalizeThemeDark.textContent = lang.personalize.themeDark;
  }

  const personalizeThemeSystem = document.getElementById('personalizeThemeSystem');
  if (personalizeThemeSystem) {
    personalizeThemeSystem.textContent = lang.personalize.themeSystem;
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

  // Update About Modal texts
  const aboutTitle = document.getElementById('aboutTitle');
  if (aboutTitle) {
    aboutTitle.textContent = lang.about.title;
  }

  const aboutLicenseTitle = document.getElementById('aboutLicenseTitle');
  if (aboutLicenseTitle) {
    aboutLicenseTitle.textContent = lang.about.licenseTitle;
  }

  const aboutLicenseInfo = document.getElementById('aboutLicenseInfo');
  if (aboutLicenseInfo) {
    aboutLicenseInfo.textContent = lang.about.licenseInfo;
  }

  const aboutNoCommercial = document.getElementById('aboutNoCommercial');
  if (aboutNoCommercial) {
    aboutNoCommercial.textContent = lang.about.noCommercial;
  }

  const aboutRepositoryLink = document.getElementById('aboutRepositoryLink');
  if (aboutRepositoryLink) {
    aboutRepositoryLink.textContent = lang.about.repository;
  }

  const aboutSupportTitle = document.getElementById('aboutSupportTitle');
  if (aboutSupportTitle) {
    aboutSupportTitle.textContent = lang.about.supportTitle;
  }

  const aboutSupportMe = document.getElementById('aboutSupportMe');
  if (aboutSupportMe) {
    aboutSupportMe.textContent = lang.about.supportMe;
  }

  const aboutReportBug = document.getElementById('aboutReportBug');
  if (aboutReportBug) {
    aboutReportBug.textContent = lang.about.reportBug;
  }

  // Update Settings Modal header
  const settingsHeader = document.querySelector('#settingsModal .settings-header h3');
  if (settingsHeader) {
    settingsHeader.textContent = lang.settings.title;
  }

  // Update Sign Out button
  const signOutBtn = document.getElementById('signOutBtn');
  if (signOutBtn) {
    signOutBtn.textContent = lang.settings.signOut;
  }

  // Update Segment Modal
  const segmentModalTitle = document.querySelector('#segmentModal h3');
  if (segmentModalTitle) {
    segmentModalTitle.textContent = lang.segmentModal.title;
  }

  // Update Edit Recurring Modal
  const editRecurringTitle = document.getElementById('editRecurringTitle');
  if (editRecurringTitle) {
    editRecurringTitle.textContent = lang.editRecurring.title;
  }

  const editDisableRecurringText = document.getElementById('editDisableRecurringText');
  if (editDisableRecurringText) {
    editDisableRecurringText.textContent = lang.editRecurring.disableRecurring;
  }

  const editDeleteTaskText = document.getElementById('editDeleteTaskText');
  if (editDeleteTaskText) {
    editDeleteTaskText.textContent = lang.editRecurring.deleteTask;
  }

  const editRecurringSaveBtn = document.getElementById('editRecurringSaveBtn');
  if (editRecurringSaveBtn) {
    editRecurringSaveBtn.textContent = lang.editRecurring.save;
  }

  const editRecurringCancelBtn = document.getElementById('editRecurringCancelBtn');
  if (editRecurringCancelBtn) {
    editRecurringCancelBtn.textContent = lang.buttons.cancel;
  }

  // Update Metrics Modal
  const metricsTitle = document.getElementById('metricsTitle');
  if (metricsTitle) {
    metricsTitle.textContent = lang.metrics.title;
  }

  const metricsCancelBtn = document.getElementById('metricsCancelBtn');
  if (metricsCancelBtn) {
    metricsCancelBtn.textContent = lang.metrics.close;
  }

  // Re-render all tasks to update recurring indicators
  if (renderAllTasksCallback) {
    renderAllTasksCallback();
  }
}
