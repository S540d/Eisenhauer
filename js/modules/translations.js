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
    categoryFilter: {
      switcherLabel: 'Kalender umschalten',
      all: 'Alle',
      private: 'Privat',
      business: 'Beruflich',
      tooltipPrivate: 'Nur private Aufgaben anzeigen',
      tooltipBusiness: 'Nur berufliche Aufgaben anzeigen',
      activePrivate: 'Privat-Filter aktiv',
      activeBusiness: 'Beruf-Filter aktiv',
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
      exportCsvBtn: 'Export CSV',
      exportMarkdownBtn: 'Export Markdown',
      q4Detox: 'Q4-DETOX',
      q4DetoxBtn: 'Q4 aufräumen',
      q4DetoxDesc:
        'Archiviert alle Aufgaben aus „Später!" (Q4) auf einmal – ideal, um nicht dringende und unwichtige Aufgaben aufzuräumen.',
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
        'Automatisch Aufgaben als dringend markieren, wenn sie in 3 Tagen fällig sind. Aktiviert auch Quadranten-Vorschläge und Matrix-Statistiken.',
      categoryFilter: 'KATEGORIE-FILTER',
      categoryFilterLabel: 'Kategorie-Filter aktivieren',
      categoryFilterDesc:
        'Über den Umschalter im Kopf zwischen Alle, Privat und Beruflich wechseln. Neue Aufgaben werden der aktiven Kategorie zugeordnet.',
      reminders: 'ERINNERUNGEN (BETA)',
      remindersLabel: 'Erinnerungen aktivieren',
      remindersDesc: 'Native Benachrichtigungen für Aufgaben mit Fälligkeitsdatum',
      remindersBefore: 'Erinnerung',
      remindersDay0: 'Am Tag selbst (9:00 Uhr)',
      remindersDay1: '1 Tag vorher (9:00 Uhr)',
      remindersDay2: '2 Tage vorher (9:00 Uhr)',
      remindersDay3: '3 Tage vorher (9:00 Uhr)',
      remindersChoose: '— bitte wählen —',
      remindersDenied: 'Berechtigung verweigert. Bitte in den Browser-Einstellungen erlauben.',
      remindersNotSupported: 'Dein Browser unterstützt keine Benachrichtigungen.',
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
      category: 'Kategorie',
      categoryNone: 'Keine',
      categoryPrivate: 'Privat',
      categoryBusiness: 'Beruflich',
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
      overview: 'Übersicht',
      totalCompleted: 'Abgeschlossen',
      streak: 'Tage-Streak',
      avgTime: 'Ø Bearbeitungszeit',
      completedTasks: 'Abgeschlossene Aufgaben',
      distribution: 'Verteilung nach Segmenten',
      day: 'Tag',
      week: 'Woche',
      month: 'Monat',
      matrixStats: 'MATRIX-VERTEILUNG',
      activeTasks: 'Aktive Aufgaben',
      noTasks: 'Keine Aufgaben vorhanden',
    },
    smartSuggest: {
      prefix: 'Vorschlag:',
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
    categoryFilter: {
      switcherLabel: 'Switch calendar',
      all: 'All',
      private: 'Private',
      business: 'Business',
      tooltipPrivate: 'Show only private tasks',
      tooltipBusiness: 'Show only business tasks',
      activePrivate: 'Private filter active',
      activeBusiness: 'Business filter active',
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
      exportCsvBtn: 'Export CSV',
      exportMarkdownBtn: 'Export Markdown',
      q4Detox: 'Q4 DETOX',
      q4DetoxBtn: 'Clear Q4',
      q4DetoxDesc:
        'Archives all tasks from "Ignore!" (Q4) at once – ideal for clearing out tasks that are neither urgent nor important.',
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
      smartFunctionsDesc:
        'Automatically mark tasks as urgent when due within 3 days. Also enables quadrant suggestions and matrix statistics.',
      categoryFilter: 'CATEGORY FILTER',
      categoryFilterLabel: 'Enable Category Filter',
      categoryFilterDesc:
        'Switch between All, Private and Business using the header switcher. New tasks are assigned to the active category.',
      reminders: 'REMINDERS (BETA)',
      remindersLabel: 'Enable Reminders',
      remindersDesc: 'Native notifications for tasks with due dates',
      remindersBefore: 'Remind me',
      remindersDay0: 'Same day (9:00 AM)',
      remindersDay1: '1 day before (9:00 AM)',
      remindersDay2: '2 days before (9:00 AM)',
      remindersDay3: '3 days before (9:00 AM)',
      remindersChoose: '— please select —',
      remindersDenied: 'Permission denied. Please allow notifications in your browser settings.',
      remindersNotSupported: 'Your browser does not support notifications.',
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
      category: 'Category',
      categoryNone: 'None',
      categoryPrivate: 'Private',
      categoryBusiness: 'Business',
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
      overview: 'Overview',
      totalCompleted: 'Completed',
      streak: 'Day streak',
      avgTime: 'Avg. processing time',
      completedTasks: 'Completed Tasks',
      distribution: 'Distribution by segments',
      day: 'Day',
      week: 'Week',
      month: 'Month',
      matrixStats: 'MATRIX DISTRIBUTION',
      activeTasks: 'Active tasks',
      noTasks: 'No tasks yet',
    },
    smartSuggest: {
      prefix: 'Suggestion:',
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
  const appleSignInBtn = document.getElementById('appleSignInBtn');
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

  const exportCsvBtn = document.getElementById('exportCsvBtn');
  if (exportCsvBtn) {
    exportCsvBtn.textContent = lang.settings.exportCsvBtn;
  }

  const exportMarkdownBtn = document.getElementById('exportMarkdownBtn');
  if (exportMarkdownBtn) {
    exportMarkdownBtn.textContent = lang.settings.exportMarkdownBtn;
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

  // Update Q4-Detox section (title, description, button)
  const q4DetoxTitle = document.getElementById('q4DetoxTitle');
  if (q4DetoxTitle) {
    q4DetoxTitle.textContent = lang.settings.q4Detox;
  }

  const q4DetoxDesc = document.getElementById('q4DetoxDesc');
  if (q4DetoxDesc) {
    q4DetoxDesc.textContent = lang.settings.q4DetoxDesc;
  }

  const q4DetoxBtn = document.getElementById('q4DetoxBtn');
  if (q4DetoxBtn) {
    q4DetoxBtn.textContent = lang.settings.q4DetoxBtn;
  }

  // Update Category Filter section in Personalize Modal
  const personalizeCategoryFilterTitle = document.getElementById('personalizeCategoryFilterTitle');
  if (personalizeCategoryFilterTitle) {
    personalizeCategoryFilterTitle.textContent = lang.personalize.categoryFilter;
  }

  const categoryFilterLabel = document.getElementById('categoryFilterLabel');
  if (categoryFilterLabel) {
    categoryFilterLabel.textContent = lang.personalize.categoryFilterLabel;
  }

  const categoryFilterDesc = document.getElementById('categoryFilterDesc');
  if (categoryFilterDesc) {
    categoryFilterDesc.textContent = lang.personalize.categoryFilterDesc;
  }

  // Update Calendar Switcher group label (accessibility) + button labels
  const categorySwitcher = document.getElementById('categorySwitcher');
  if (categorySwitcher) {
    categorySwitcher.setAttribute('aria-label', lang.categoryFilter.switcherLabel);
  }

  const categorySwitchAll = document.getElementById('categorySwitchAll');
  if (categorySwitchAll) {
    categorySwitchAll.textContent = lang.categoryFilter.all;
  }

  const categorySwitchPrivate = document.getElementById('categorySwitchPrivate');
  if (categorySwitchPrivate) {
    categorySwitchPrivate.textContent = lang.categoryFilter.private;
    categorySwitchPrivate.title = lang.categoryFilter.tooltipPrivate;
  }

  const categorySwitchBusiness = document.getElementById('categorySwitchBusiness');
  if (categorySwitchBusiness) {
    categorySwitchBusiness.textContent = lang.categoryFilter.business;
    categorySwitchBusiness.title = lang.categoryFilter.tooltipBusiness;
  }

  // Update Quick Add Category labels
  const quickAddCategoryLabel = document.getElementById('quickAddCategoryLabel');
  if (quickAddCategoryLabel) {
    quickAddCategoryLabel.textContent = lang.quickAddModal.category;
  }

  const quickAddCategoryNone = document.getElementById('quickAddCategoryNone');
  if (quickAddCategoryNone) {
    quickAddCategoryNone.textContent = lang.quickAddModal.categoryNone;
  }

  const quickAddCategoryPrivate = document.getElementById('quickAddCategoryPrivate');
  if (quickAddCategoryPrivate) {
    quickAddCategoryPrivate.textContent = lang.quickAddModal.categoryPrivate;
  }

  const quickAddCategoryBusiness = document.getElementById('quickAddCategoryBusiness');
  if (quickAddCategoryBusiness) {
    quickAddCategoryBusiness.textContent = lang.quickAddModal.categoryBusiness;
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

  // Update Reminders section in Personalize Modal
  const personalizeRemindersTitle = document.getElementById('personalizeRemindersTitle');
  if (personalizeRemindersTitle) {
    personalizeRemindersTitle.textContent = lang.personalize.reminders;
  }

  const remindersLabel = document.getElementById('remindersLabel');
  if (remindersLabel) {
    remindersLabel.textContent = lang.personalize.remindersLabel;
  }

  const remindersDesc = document.getElementById('remindersDesc');
  if (remindersDesc) {
    remindersDesc.textContent = lang.personalize.remindersDesc;
  }

  const remindersBeforeLabel = document.getElementById('remindersBeforeLabel');
  if (remindersBeforeLabel) {
    remindersBeforeLabel.textContent = lang.personalize.remindersBefore;
  }

  const remindersChooseOption = document.getElementById('remindersChooseOption');
  if (remindersChooseOption) {
    remindersChooseOption.textContent = lang.personalize.remindersChoose;
  }

  const remindersDay0Option = document.getElementById('remindersDay0Option');
  if (remindersDay0Option) {
    remindersDay0Option.textContent = lang.personalize.remindersDay0;
  }

  const remindersDay1Option = document.getElementById('remindersDay1Option');
  if (remindersDay1Option) {
    remindersDay1Option.textContent = lang.personalize.remindersDay1;
  }

  const remindersDay2Option = document.getElementById('remindersDay2Option');
  if (remindersDay2Option) {
    remindersDay2Option.textContent = lang.personalize.remindersDay2;
  }

  const remindersDay3Option = document.getElementById('remindersDay3Option');
  if (remindersDay3Option) {
    remindersDay3Option.textContent = lang.personalize.remindersDay3;
  }

  // Re-render all tasks to update recurring indicators
  if (renderAllTasksCallback) {
    renderAllTasksCallback();
  }
}
