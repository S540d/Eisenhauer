/**
 * UI Settings Modals Module
 * Settings, About, Personalize, Metrics and Backup/Restore modals
 */

import { translations } from './translations.js';
import { listBackups } from './backup.js';

/**
 * Open settings modal
 * @param {object} currentUser - Current user object (or null)
 * @param {string} version - App version
 * @param {string} buildDate - Build date
 * @param {boolean} isGuestMode - Whether user is in guest mode
 */
export function openSettingsModal(
  currentUser,
  version,
  buildDate,
  isGuestMode = false,
  currentLanguage = 'en',
  db = null
) {
  const settingsModal = document.getElementById('settingsModal');

  if (!settingsModal) {
    return;
  }
  // Update theme toggle button active state based on current theme
  const themeButtons = document.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem('darkMode');
  let activeTheme = 'system'; // Default to system

  if (savedTheme === 'true') {
    activeTheme = 'dark';
  } else if (savedTheme === 'false') {
    activeTheme = 'light';
  } else if (savedTheme === null) {
    activeTheme = 'system';
  }

  themeButtons.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.theme === activeTheme) {
      btn.classList.add('active');
    }
  });

  // Use event delegation for all settings modal buttons to avoid listener loss after DOM changes
  // Remove any existing delegated listener first
  const existingHandler = settingsModal._clickHandler;
  if (existingHandler) {
    settingsModal.removeEventListener('click', existingHandler);
  }

  // Create new delegated click handler
  const clickHandler = (e) => {
    const target = e.target;

    // Handle theme button clicks
    const themeBtn = target.closest('.theme-btn');
    if (themeBtn) {
      const theme = themeBtn.dataset.theme;

      // Update active state
      document.querySelectorAll('.theme-btn').forEach((b) => b.classList.remove('active'));
      themeBtn.classList.add('active');

      // Update theme
      if (theme === 'dark') {
        localStorage.setItem('darkMode', 'true');
        document.body.classList.add('dark-mode');
      } else if (theme === 'system') {
        localStorage.removeItem('darkMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      }
      return;
    }

    // Handle Personalisieren button click
    if (target.closest('#personalizeBtn')) {
      e.preventDefault();
      openPersonalizeModal(currentLanguage);
      return;
    }

    // Handle About button click
    if (target.closest('#aboutBtn')) {
      e.preventDefault();
      openAboutModal(version, currentLanguage);
      return;
    }

    // Handle close button click
    if (target.closest('#settingsCancelBtn')) {
      closeSettingsModal();
      return;
    }

    // Handle sign out button click
    if (target.closest('#signOutBtn')) {
      if (window.signOut) {
        window.signOut();
        closeSettingsModal();
      }
      return;
    }
  };

  // Store handler reference and add listener
  settingsModal._clickHandler = clickHandler;
  settingsModal.addEventListener('click', clickHandler);

  // Update language toggle button active state - use currentLanguage parameter
  const langButtons = document.querySelectorAll('.lang-btn');

  langButtons.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.lang === currentLanguage) {
      btn.classList.add('active');
    }
  });

  // Show/hide account section based on authentication state
  const accountSection = document.getElementById('accountSection');
  const accountSeparator = document.getElementById('accountSeparator');
  const userEmailDisplay = document.getElementById('userEmailDisplay');

  // Show sign out button for both Firebase login and guest mode
  if (currentUser || isGuestMode) {
    // User is authenticated (Firebase) or in guest mode (local) - show sign out button
    if (accountSection) accountSection.style.display = 'block';
    if (accountSeparator) accountSeparator.style.display = 'block';

    // Display user email/status
    if (userEmailDisplay) {
      userEmailDisplay.textContent = '';
      const emailLabel = document.createElement('p');
      emailLabel.className = 'settings-user-email';

      if (currentUser) {
        emailLabel.textContent = currentUser.email || 'User';
      } else if (isGuestMode) {
        emailLabel.textContent = 'Gastmodus (Lokal gespeichert)';
      }

      userEmailDisplay.appendChild(emailLabel);
    }
  } else {
    // Not in app yet - hide sign out button
    if (accountSection) accountSection.style.display = 'none';
    if (accountSeparator) accountSeparator.style.display = 'none';
  }

  // Show/hide backup section - only for authenticated users (not guest mode)
  const backupSection = document.getElementById('backupSection');
  const backupSeparator = document.getElementById('backupSeparator');

  if (backupSection) {
    if (currentUser && !isGuestMode) {
      backupSection.style.display = 'block';
      if (backupSeparator) backupSeparator.style.display = 'block';

      // Update last backup timestamp. localStorage's 'lastAutoBackup' is
      // per-device and can disagree across a user's devices (issue #396),
      // so show it only as an immediate placeholder while the account-wide
      // backup list (the actual source of truth in Firestore) loads.
      const lastBackupInfo = document.getElementById('lastBackupInfo');
      const lastAutoBackup = localStorage.getItem('lastAutoBackup');
      // 'lastAutoBackup' only ever records a successful backup (see #409);
      // a failed attempt is tracked separately, so a nonzero failure count
      // means the most recent attempt did not succeed.
      const hasFailedAttempt = parseInt(localStorage.getItem('autoBackupFailureCount') || '0') > 0;

      if (lastBackupInfo) {
        const lang = currentLanguage === 'de' ? 'de' : 'en';
        const neverText = currentLanguage === 'de' ? 'Nie' : 'Never';
        const lastBackupLabel = currentLanguage === 'de' ? 'Letztes Backup' : 'Last backup';
        const failedSuffix = hasFailedAttempt
          ? currentLanguage === 'de'
            ? ' · letzter Versuch fehlgeschlagen'
            : ' · last attempt failed'
          : '';

        const renderLastBackup = (timestamp) => {
          if (timestamp) {
            const formattedDate = new Date(timestamp).toLocaleString(
              lang === 'de' ? 'de-DE' : 'en-US'
            );
            lastBackupInfo.textContent = `${lastBackupLabel}: ${formattedDate}${failedSuffix}`;
          } else {
            lastBackupInfo.textContent = `${lastBackupLabel}: ${neverText}${failedSuffix}`;
          }
        };

        renderLastBackup(lastAutoBackup ? parseInt(lastAutoBackup) : null);

        if (db && currentUser?.uid) {
          listBackups(db, currentUser.uid)
            .then((backups) => {
              // Guard against the modal having been closed/reopened for a
              // different user while this request was in flight.
              if (document.getElementById('lastBackupInfo') !== lastBackupInfo) return;
              if (backups.length > 0) {
                renderLastBackup(backups[0].timestamp);
              } else if (!lastAutoBackup) {
                renderLastBackup(null);
              }
            })
            .catch(() => {
              // Keep the localStorage-based placeholder on failure.
            });
        }
      }
    } else {
      backupSection.style.display = 'none';
      if (backupSeparator) backupSeparator.style.display = 'none';
    }
  }

  // Note: All button clicks (About, Sign Out, Close) are now handled via event delegation above

  settingsModal.classList.remove('hidden');
  settingsModal.classList.add('active');
  settingsModal.style.display = 'flex';
}

/**
 * Close settings modal
 */
export function closeSettingsModal() {
  const settingsModal = document.getElementById('settingsModal');
  if (settingsModal) {
    settingsModal.classList.remove('active');
    settingsModal.classList.add('hidden');
    settingsModal.style.display = 'none';
  }
}

/**
 * Open About modal
 * @param {string} version - App version
 */
export function openAboutModal(version, currentLanguage = 'en') {
  const aboutModal = document.getElementById('aboutModal');
  if (!aboutModal) return;

  const lang = translations[currentLanguage]?.about;
  if (lang) {
    const set = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
    set('aboutTitle', lang.title);
    set('aboutLicenseTitle', lang.licenseTitle);
    set('aboutLicenseInfo', lang.licenseInfo);
    set('aboutNoCommercial', lang.noCommercial);
    set('aboutRepositoryLink', lang.repository);
    set('aboutSupportTitle', lang.supportTitle);
    set('aboutSupportMe', lang.supportMe);
    set('aboutReportBug', lang.reportBug);
  }

  aboutModal.classList.add('active');
  aboutModal.style.display = 'flex';

  // Setup close button event listener
  const aboutCancelBtn = document.getElementById('aboutCancelBtn');
  if (aboutCancelBtn) {
    const newAboutCancelBtn = aboutCancelBtn.cloneNode(true);
    aboutCancelBtn.parentNode.replaceChild(newAboutCancelBtn, aboutCancelBtn);

    newAboutCancelBtn.addEventListener('click', () => {
      closeAboutModal();
    });
  }
}

/**
 * Close About modal
 */
export function closeAboutModal() {
  const aboutModal = document.getElementById('aboutModal');
  if (aboutModal) {
    aboutModal.classList.remove('active');
    aboutModal.classList.add('hidden');
    aboutModal.style.display = 'none';
  }
}

/**
 * Open Personalize modal
 * @param {string} currentLanguage - Current language
 */
export function openPersonalizeModal(currentLanguage = 'en') {
  const personalizeModal = document.getElementById('personalizeModal');

  if (!personalizeModal) {
    return;
  }

  // Update theme toggle button active state based on current theme
  const themeButtons = personalizeModal.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem('darkMode');
  let activeTheme = 'system'; // Default to system

  if (savedTheme === 'true') {
    activeTheme = 'dark';
  } else if (savedTheme === 'false') {
    activeTheme = 'light';
  } else if (savedTheme === null) {
    activeTheme = 'system';
  }

  themeButtons.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.theme === activeTheme) {
      btn.classList.add('active');
    }
  });

  // Update language toggle button active state
  const langButtons = personalizeModal.querySelectorAll('.lang-btn');
  langButtons.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.lang === currentLanguage) {
      btn.classList.add('active');
    }
  });

  // Update smart functions toggle state
  const smartFunctionsToggle = document.getElementById('smartFunctionsToggle');
  if (smartFunctionsToggle) {
    smartFunctionsToggle.checked = localStorage.getItem('smartFunctionsEnabled') === 'true';
  }

  // Category filter toggle reflects whether the header switcher is enabled
  const categoryFilterToggle = document.getElementById('categoryFilterToggle');
  if (categoryFilterToggle) {
    categoryFilterToggle.checked = localStorage.getItem('categoryFilterEnabled') === 'true';
  }

  // Task notes toggle reflects whether the notes field in the Quick Add modal
  // is shown; defaults to enabled (unset !== 'false') so existing users see
  // no change after the standalone notes-overview feature was removed.
  const taskNotesToggle = document.getElementById('taskNotesToggle');
  if (taskNotesToggle) {
    taskNotesToggle.checked = localStorage.getItem('taskNotesEnabled') !== 'false';
  }

  // Update reminders toggle + dropdown state
  const remindersToggle = document.getElementById('remindersToggle');
  const remindersDaysContainer = document.getElementById('remindersDaysContainer');
  const remindersDaysSelect = document.getElementById('remindersDaysSelect');
  if (remindersToggle) {
    const remindersEnabled = localStorage.getItem('remindersEnabled') === 'true';
    remindersToggle.checked = remindersEnabled;
    if (remindersDaysContainer) {
      remindersDaysContainer.style.display = remindersEnabled ? 'flex' : 'none';
    }
    if (remindersDaysSelect) {
      const stored = localStorage.getItem('reminderDaysBefore');
      remindersDaysSelect.value = stored !== null ? stored : '';
    }
  }

  // Use event delegation for all personalize modal buttons
  const existingHandler = personalizeModal._clickHandler;
  if (existingHandler) {
    personalizeModal.removeEventListener('click', existingHandler);
  }

  // Create new delegated click handler
  const clickHandler = (e) => {
    const target = e.target;

    // Handle theme button clicks
    const themeBtn = target.closest('.theme-btn');
    if (themeBtn) {
      const theme = themeBtn.dataset.theme;

      // Update active state
      personalizeModal.querySelectorAll('.theme-btn').forEach((b) => b.classList.remove('active'));
      themeBtn.classList.add('active');

      // Update theme
      if (theme === 'dark') {
        localStorage.setItem('darkMode', 'true');
        document.body.classList.add('dark-mode');
      } else if (theme === 'system') {
        localStorage.removeItem('darkMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      }
      return;
    }

    // Handle language button clicks
    const langBtn = target.closest('.lang-btn');
    if (langBtn) {
      const lang = langBtn.dataset.lang;

      // Update active state
      personalizeModal.querySelectorAll('.lang-btn').forEach((b) => b.classList.remove('active'));
      langBtn.classList.add('active');

      // Trigger language change (will be handled by script.js)
      if (window.changeLanguage) {
        window.changeLanguage(lang);
      }
      return;
    }

    // Handle smart functions toggle
    if (target.id === 'smartFunctionsToggle') {
      const isEnabled = target.checked;
      localStorage.setItem('smartFunctionsEnabled', isEnabled.toString());

      // Trigger re-render if callback is provided
      if (window.renderTasksCallback) {
        window.renderTasksCallback();
      }
      return;
    }

    // Handle category filter toggle (show/hide the header switcher)
    if (target.id === 'categoryFilterToggle') {
      const isEnabled = target.checked;
      localStorage.setItem('categoryFilterEnabled', isEnabled.toString());

      if (window.updateCategorySwitcherVisibility) {
        window.updateCategorySwitcherVisibility();
      }
      if (window.renderTasksCallback) {
        window.renderTasksCallback();
      }
      return;
    }

    // Handle task notes toggle (show/hide the notes field in Quick Add)
    if (target.id === 'taskNotesToggle') {
      const isEnabled = target.checked;
      localStorage.setItem('taskNotesEnabled', isEnabled.toString());

      if (window.updateTaskNotesVisibility) {
        window.updateTaskNotesVisibility();
      }
      return;
    }

    // Handle reminders toggle
    if (target.id === 'remindersToggle') {
      const isEnabled = target.checked;
      if (isEnabled) {
        if (window.requestRemindersPermission) {
          window.requestRemindersPermission(target);
        }
      } else {
        localStorage.setItem('remindersEnabled', 'false');
        const container = document.getElementById('remindersDaysContainer');
        if (container) container.style.display = 'none';
        if (window.updateRemindersCallback) {
          window.updateRemindersCallback(false, null);
        }
      }
      return;
    }

    // Handle close button click
    if (target.closest('#personalizeCancelBtn')) {
      closePersonalizeModal();
      return;
    }
  };

  // Change handler for reminders days select
  const existingChangeHandler = personalizeModal._changeHandler;
  if (existingChangeHandler) {
    personalizeModal.removeEventListener('change', existingChangeHandler);
  }
  const changeHandler = (e) => {
    if (e.target.id === 'remindersDaysSelect') {
      const value = e.target.value;
      if (value === '') return;
      const daysBefore = Number(value);
      localStorage.setItem('reminderDaysBefore', String(daysBefore));
      if (window.updateRemindersCallback) {
        window.updateRemindersCallback(true, daysBefore);
      }
    }
  };
  personalizeModal._changeHandler = changeHandler;
  personalizeModal.addEventListener('change', changeHandler);

  // Store handler reference and add listener
  personalizeModal._clickHandler = clickHandler;
  personalizeModal.addEventListener('click', clickHandler);

  personalizeModal.classList.remove('hidden');
  personalizeModal.classList.add('active');
  personalizeModal.style.display = 'flex';
}

/**
 * Close Personalize modal
 */
export function closePersonalizeModal() {
  const personalizeModal = document.getElementById('personalizeModal');
  if (personalizeModal) {
    personalizeModal.classList.remove('active');
    personalizeModal.classList.add('hidden');
    personalizeModal.style.display = 'none';
  }
}

/**
 * Open metrics modal
 * @param {function} calculateMetrics - Callback to calculate and display metrics
 */
export function openMetricsModal(calculateMetrics) {
  const metricsModal = document.getElementById('metricsModal');
  if (!metricsModal) return;

  metricsModal.classList.add('active');
  metricsModal.style.display = 'flex';

  if (calculateMetrics) {
    calculateMetrics();
  }

  // Setup close button event listener
  const metricsCancelBtn = document.getElementById('metricsCancelBtn');
  if (metricsCancelBtn) {
    // Remove old listener by cloning
    const newCancelBtn = metricsCancelBtn.cloneNode(true);
    metricsCancelBtn.parentNode.replaceChild(newCancelBtn, metricsCancelBtn);

    // Add new listener
    newCancelBtn.addEventListener('click', () => {
      closeMetricsModal();
    });
  }
}

/**
 * Close metrics modal
 */
export function closeMetricsModal() {
  const metricsModal = document.getElementById('metricsModal');
  if (metricsModal) {
    metricsModal.classList.remove('active');
    metricsModal.style.display = 'none';
  }
}

/**
 * Open the backup restore modal and render the available backups (Issue #396).
 *
 * Restoring replaces every task, so this deliberately requires two deliberate
 * actions: picking a backup, then confirming. The caller is responsible for
 * taking a safety snapshot before overwriting anything.
 *
 * @param {Array} backups - Backup metadata from listBackups()
 * @param {Function} onRestore - Called with the chosen backup once confirmed
 * @param {string} currentLanguage - Current language ('de' | 'en')
 */
export function openBackupRestoreModal(backups, onRestore, currentLanguage = 'en') {
  const modal = document.getElementById('backupRestoreModal');
  if (!modal) return;

  const lang = translations[currentLanguage] || translations.en;
  const list = document.getElementById('backupRestoreList');
  const empty = document.getElementById('backupRestoreEmpty');

  if (list) {
    list.textContent = '';

    backups.forEach((backup) => {
      const item = document.createElement('li');
      item.className = 'backup-restore-item';

      const info = document.createElement('div');
      info.className = 'backup-restore-info';

      const dateLine = document.createElement('span');
      dateLine.className = 'backup-restore-date';
      dateLine.textContent = backup.date.toLocaleString(
        currentLanguage === 'de' ? 'de-DE' : 'en-US'
      );
      info.appendChild(dateLine);

      if (typeof backup.taskCount === 'number') {
        const countLine = document.createElement('span');
        countLine.className = 'backup-restore-count';
        countLine.textContent = `${backup.taskCount} ${lang.backupRestore.tasks}`;
        info.appendChild(countLine);
      }

      item.appendChild(info);

      const restoreBtn = document.createElement('button');
      restoreBtn.className = 'btn';
      restoreBtn.textContent = lang.backupRestore.restoreAction;
      restoreBtn.addEventListener('click', () => {
        const confirmed = window.confirm(lang.backupRestore.confirm);
        if (!confirmed) return;
        closeBackupRestoreModal();
        onRestore(backup);
      });
      item.appendChild(restoreBtn);

      list.appendChild(item);
    });
  }

  if (empty) {
    empty.style.display = backups.length === 0 ? '' : 'none';
  }

  modal.classList.add('active');
  modal.style.display = 'flex';

  const cancelBtn = document.getElementById('backupRestoreCancelBtn');
  if (cancelBtn) {
    // Remove old listener by cloning, matching the pattern used by the other modals
    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    newCancelBtn.addEventListener('click', () => closeBackupRestoreModal());
  }
}

/**
 * Close the backup restore modal
 */
export function closeBackupRestoreModal() {
  const modal = document.getElementById('backupRestoreModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}
