/**
 * UI Task Modals Module
 * Segment/move modal (legacy), Quick Add modal, edit-recurring modal and the tutorial modal
 */

import { translations } from './translations.js';

/**
 * Open the task segment modal
 * @param {function} onAddTask - Callback when task is added
 * @param {string} currentTask - Current task text
 * @returns {function} Close modal function
 */
export function openModal(onAddTask, currentTask) {
  const modal = document.getElementById('segmentModal');
  const recurringEnabled = document.getElementById('recurringEnabled');
  const recurringOptions = document.getElementById('recurringOptions');
  const recurringInterval = document.getElementById('recurringInterval');
  const weeklyOptions = document.getElementById('weeklyOptions');
  const monthlyOptions = document.getElementById('monthlyOptions');
  const segmentBtns = document.querySelectorAll('.segment-btn');

  if (!modal) {
    return () => {};
  }
  modal.classList.remove('hidden');
  modal.classList.add('active');
  modal.style.display = 'flex';

  // Reset recurring task options
  if (recurringEnabled) recurringEnabled.checked = false;
  if (recurringOptions) recurringOptions.style.display = 'none';
  if (recurringInterval) recurringInterval.value = 'daily';
  if (weeklyOptions) weeklyOptions.style.display = 'none';
  if (monthlyOptions) monthlyOptions.style.display = 'none';

  // Reset weekday checkboxes
  if (weeklyOptions) {
    const weekdayCheckboxes = weeklyOptions.querySelectorAll('input[type="checkbox"]');
    weekdayCheckboxes.forEach((cb) => (cb.checked = false));
  }

  // Setup segment buttons
  segmentBtns.forEach((btn) => {
    const segmentId = parseInt(btn.dataset.segment);
    btn.onclick = () => {
      if (currentTask) {
        const recurringConfig = getRecurringConfig();
        onAddTask(currentTask, segmentId, recurringConfig);
      }
      closeModal();
    };
  });

  return () => closeModal();
}

/**
 * Close the task segment modal
 */
export function closeModal() {
  const modal = document.getElementById('segmentModal');
  if (modal) {
    modal.classList.remove('active');
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
}

/**
 * Open modal for moving a task
 * @param {object} task - Task to move
 * @param {function} onMove - Callback when task is moved
 */
export function openModalForMove(task, onMove) {
  const modal = document.getElementById('segmentModal');
  const segmentBtns = document.querySelectorAll('.segment-btn');

  if (!modal) return;

  modal.classList.add('active');

  // Update segment buttons for move
  segmentBtns.forEach((btn) => {
    const segmentId = parseInt(btn.dataset.segment);
    btn.onclick = () => {
      if (task.segment !== segmentId) {
        onMove(task.id, task.segment, segmentId);
      }
      closeModal();
    };
  });
}

/**
 * Get recurring configuration from modal form
 * @returns {object|null} Recurring config or null
 */
export function getRecurringConfig() {
  const recurringEnabled = document.getElementById('recurringEnabled');
  const recurringInterval = document.getElementById('recurringInterval');
  const weeklyOptions = document.getElementById('weeklyOptions');

  if (!recurringEnabled || !recurringEnabled.checked) {
    return null;
  }

  const config = {
    enabled: true,
    interval: recurringInterval ? recurringInterval.value : 'daily',
  };

  // Get interval-specific configuration
  switch (config.interval) {
    case 'weekly':
      if (weeklyOptions) {
        const weekdayCheckboxes = weeklyOptions.querySelectorAll('input[type="checkbox"]:checked');
        config.weekdays = Array.from(weekdayCheckboxes).map((cb) => parseInt(cb.value));
      }
      break;
    case 'monthly': {
      const dayOfMonth = document.getElementById('dayOfMonth');
      if (dayOfMonth) {
        config.dayOfMonth = parseInt(dayOfMonth.value);
      }
      break;
    }
  }

  return config;
}

/**
 * Open Quick Add Modal for a specific segment. Pass `existingTask` to reuse
 * the same dialog for editing: the fields are prefilled from the task and
 * `onAddTask` is called with the task's id as a trailing argument so the
 * caller can tell an edit apart from a fresh add (Issue: edit existing tasks).
 * @param {number} segmentId - Segment ID (1-5)
 * @param {function} onAddTask - Callback when task is added/edited: (text, segmentId, recurring, dueDate, category, notes, taskId)
 * @param {object} translations - Translations object
 * @param {string} currentLanguage - Current language
 * @param {object|null} existingTask - Task to edit, or null to create a new task
 */
export function openQuickAddModal(
  segmentId,
  onAddTask,
  translations,
  currentLanguage,
  existingTask = null
) {
  const quickAddModal = document.getElementById('quickAddModal');
  const quickAddInput = document.getElementById('quickAddInput');
  const quickAddCategory = document.getElementById('quickAddCategory');
  const quickAddTitle = document.getElementById('quickAddTitle');
  const quickAddSubmitBtn = document.getElementById('quickAddSubmitBtn');
  const quickAddCharCount = document.getElementById('quickAddCharCount');
  const quickRecurringEnabled = document.getElementById('quickRecurringEnabled');
  const quickRecurringOptions = document.getElementById('quickRecurringOptions');
  const quickDueDateEnabled = document.getElementById('quickDueDateEnabled');

  if (!quickAddModal || !quickAddInput) {
    return;
  }

  // Reset modal
  quickAddInput.value = existingTask ? existingTask.text : '';

  // Character counter (140 = hard limit enforced by the input's maxlength
  // and by addTaskToSegment()/updateTask() in tasks.js)
  const maxLength = parseInt(quickAddInput.getAttribute('maxlength'), 10) || 140;
  const updateCharCount = () => {
    if (!quickAddCharCount) return;
    const length = quickAddInput.value.length;
    quickAddCharCount.textContent = `${length}/${maxLength}`;
    quickAddCharCount.classList.toggle('error', length >= maxLength);
    quickAddCharCount.classList.toggle('warning', length < maxLength && length >= maxLength - 20);
  };
  updateCharCount();
  if (quickAddInput._eisenhauerCharCountHandler) {
    quickAddInput.removeEventListener('input', quickAddInput._eisenhauerCharCountHandler);
  }
  quickAddInput._eisenhauerCharCountHandler = updateCharCount;
  quickAddInput.addEventListener('input', updateCharCount);

  quickRecurringEnabled.checked = false;
  quickRecurringOptions.classList.remove('expanded');
  document.getElementById('quickRecurringToggle')?.classList.remove('icon-toggle-checked');
  document.getElementById('quickWeekdaysContainer')?.classList.remove('expanded');
  document.getElementById('quickMonthDayContainer')?.classList.remove('expanded');
  document.querySelector('input[name="quickRecurringType"][value="daily"]').checked = true;

  // Reset due date
  const dueDateInput = document.getElementById('quickAddDueDate');
  if (dueDateInput) {
    dueDateInput.value = '';
    dueDateInput.style.display = 'none';
  }
  if (quickDueDateEnabled) {
    quickDueDateEnabled.checked = false;
  }
  document.getElementById('quickDueDateToggle')?.classList.remove('icon-toggle-checked');

  // Prefill recurring settings from the task being edited
  if (existingTask?.recurring?.enabled) {
    quickRecurringEnabled.checked = true;
    quickRecurringOptions.classList.add('expanded');
    document.getElementById('quickRecurringToggle')?.classList.add('icon-toggle-checked');

    const recurringType = existingTask.recurring.interval || 'daily';
    const typeRadio = document.querySelector(
      `input[name="quickRecurringType"][value="${recurringType}"]`
    );
    if (typeRadio) typeRadio.checked = true;

    if (recurringType === 'weekly') {
      document.getElementById('quickWeekdaysContainer')?.classList.add('expanded');
      const weekdays = existingTask.recurring.weekdays || [];
      document.querySelectorAll('#quickWeekdaysContainer .weekday-check').forEach((cb) => {
        cb.checked = weekdays.includes(parseInt(cb.value));
      });
    } else if (recurringType === 'monthly') {
      document.getElementById('quickMonthDayContainer')?.classList.add('expanded');
      const monthDayInput = document.getElementById('quickMonthDay');
      if (monthDayInput) monthDayInput.value = existingTask.recurring.dayOfMonth || 1;
    } else if (recurringType === 'custom') {
      const customDaysInput = document.getElementById('quickCustomDays');
      if (customDaysInput) customDaysInput.value = existingTask.recurring.customDays || 1;
    }
  }

  // Prefill due date from the task being edited
  if (existingTask?.dueDate && dueDateInput) {
    dueDateInput.value = existingTask.dueDate;
    dueDateInput.style.display = '';
    if (quickDueDateEnabled) quickDueDateEnabled.checked = true;
    document.getElementById('quickDueDateToggle')?.classList.add('icon-toggle-checked');
  }

  // Notes field visibility follows the "task notes" personalize toggle
  // (default enabled), prefilled from the task being edited when applicable.
  const quickAddNotesRow = document.querySelector('.quick-add-notes-row');
  const taskNotesEnabled = localStorage.getItem('taskNotesEnabled') !== 'false';
  if (quickAddNotesRow) {
    quickAddNotesRow.style.display = taskNotesEnabled ? '' : 'none';
  }
  const quickAddNotes = document.getElementById('quickAddNotes');
  if (quickAddNotes) {
    quickAddNotes.value = existingTask?.notes || '';
  }

  // Show category selector only when the category filter feature is enabled,
  // and preselect the active calendar (Privat/Beruflich) — or the task's own
  // category when editing.
  const categoryConfig = document.getElementById('quickAddCategoryConfig');
  if (categoryConfig) {
    const categoryFilterEnabled = localStorage.getItem('categoryFilterEnabled') === 'true';
    categoryConfig.style.display = categoryFilterEnabled ? '' : 'none';
    const activeCategory = existingTask
      ? existingTask.category || ''
      : localStorage.getItem('categoryFilter') || '';
    const categoryBtns = categoryConfig.querySelectorAll('.category-select-btn');
    categoryBtns.forEach((btn) => {
      btn.classList.toggle('active', (btn.dataset.category || '') === activeCategory);
    });
    // Setup category button click handlers
    categoryBtns.forEach((btn) => {
      btn.onclick = () => {
        categoryBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      };
    });
  }

  // Segment names
  const segmentNames = {
    1: { de: 'Do! (Wichtig & Dringend)', en: 'Do! (Important & Urgent)' },
    2: { de: 'Schedule! (Wichtig)', en: 'Schedule! (Important)' },
    3: { de: 'Delegate! (Dringend)', en: 'Delegate! (Urgent)' },
    4: { de: 'Ignore! (Weder/Noch)', en: 'Ignore! (Neither)' },
    5: { de: 'Done! (Erledigt)', en: 'Done! (Completed)' },
  };

  // Set category title
  const categoryName =
    segmentNames[segmentId]?.[currentLanguage] || segmentNames[segmentId]?.['en'] || 'Unknown';
  quickAddCategory.textContent = categoryName;

  // Update title and labels based on current language
  const lang = translations[currentLanguage];
  quickAddTitle.textContent = existingTask
    ? lang.quickAddModal.editTitle
    : lang.quickAddModal.title;

  // Update input placeholder
  quickAddInput.placeholder = lang.taskInputPlaceholder;

  // Update notes placeholder
  const quickAddNotesEl = document.getElementById('quickAddNotes');
  if (quickAddNotesEl && lang.quickAddModal?.notesPlaceholder) {
    quickAddNotesEl.placeholder = lang.quickAddModal.notesPlaceholder;
  }

  // Update recurring label
  const quickRecurringEnableText = document.getElementById('quickRecurringEnableText');
  if (quickRecurringEnableText) {
    quickRecurringEnableText.textContent = lang.recurring.enableLabel;
  }
  const quickRecurringToggle = document.getElementById('quickRecurringToggle');
  if (quickRecurringToggle) {
    quickRecurringToggle.title = lang.recurring.enableLabel;
  }

  // Update due date label
  const quickAddDueDateLabel = document.getElementById('quickAddDueDateLabel');
  if (quickAddDueDateLabel) {
    quickAddDueDateLabel.textContent = lang.quickAddModal.dueDate;
  }
  const quickDueDateToggle = document.getElementById('quickDueDateToggle');
  if (quickDueDateToggle) {
    quickDueDateToggle.title = lang.quickAddModal.dueDate;
  }

  // Update recurring interval labels
  const quickRecurringDaily = document.getElementById('quickRecurringDaily');
  const quickRecurringWeekly = document.getElementById('quickRecurringWeekly');
  const quickRecurringMonthly = document.getElementById('quickRecurringMonthly');
  if (quickRecurringDaily) quickRecurringDaily.textContent = lang.recurring.daily;
  if (quickRecurringWeekly) quickRecurringWeekly.textContent = lang.recurring.weekly;
  if (quickRecurringMonthly) quickRecurringMonthly.textContent = lang.recurring.monthly;

  // Wire up sub-option visibility for recurring type (missing since legacy migration)
  document.querySelectorAll('input[name="quickRecurringType"]').forEach((radio) => {
    radio.onchange = () => {
      document
        .getElementById('quickWeekdaysContainer')
        ?.classList.toggle('expanded', radio.value === 'weekly');
      document
        .getElementById('quickMonthDayContainer')
        ?.classList.toggle('expanded', radio.value === 'monthly');
    };
  });

  // Show modal
  quickAddModal.style.display = 'flex';
  setTimeout(() => quickAddInput.focus(), 100);

  // Handle submit
  const handleSubmit = () => {
    const text = quickAddInput.value.trim();
    if (!text) return;

    // Get due date if provided
    const dueDateInput = document.getElementById('quickAddDueDate');
    const dueDate = dueDateInput && dueDateInput.value ? dueDateInput.value : null;

    // Get recurring config if enabled
    let recurringConfig = null;
    if (quickRecurringEnabled.checked) {
      const selectedType = document.querySelector(
        'input[name="quickRecurringType"]:checked'
      )?.value;
      recurringConfig = {
        enabled: true,
        interval: selectedType, // 'daily', 'weekly', 'monthly', 'custom'
      };

      if (selectedType === 'weekly') {
        const weekdays = Array.from(
          document.querySelectorAll('#quickWeekdaysContainer .weekday-check:checked')
        ).map((cb) => parseInt(cb.value));
        if (weekdays.length > 0) {
          recurringConfig.weekdays = weekdays;
        }
      } else if (selectedType === 'monthly') {
        const monthDay = parseInt(document.getElementById('quickMonthDay')?.value || 1);
        recurringConfig.dayOfMonth = monthDay;
      } else if (selectedType === 'custom') {
        const customDays = parseInt(document.getElementById('quickCustomDays')?.value || 1);
        recurringConfig.customDays = customDays;
      }
    }

    // Get selected category if feature enabled
    const categoryConfig = document.getElementById('quickAddCategoryConfig');
    let category = null;
    if (categoryConfig && categoryConfig.style.display !== 'none') {
      const activeBtn = categoryConfig.querySelector('.category-select-btn.active');
      category = activeBtn?.dataset.category || null;
    }

    // Get notes if provided (always available, not gated by any flag)
    const notesInput = document.getElementById('quickAddNotes');
    const notes = notesInput && notesInput.value.trim() ? notesInput.value.trim() : null;

    // Call callback with due date, category, notes and (when editing) the task id
    if (onAddTask) {
      onAddTask(
        text,
        segmentId,
        recurringConfig,
        dueDate,
        category,
        notes,
        existingTask?.id ?? null
      );
    }

    // Close modal
    quickAddModal.style.display = 'none';
  };

  // Remove old listeners and add new ones
  const newSubmitBtn = quickAddSubmitBtn.cloneNode(true);
  quickAddSubmitBtn.parentNode.replaceChild(newSubmitBtn, quickAddSubmitBtn);
  newSubmitBtn.textContent = existingTask ? lang.buttons.save : lang.buttons.ok;
  newSubmitBtn.addEventListener('click', handleSubmit);

  // Handle Enter key. handleKeyPress is a fresh closure every call, so
  // passing it straight to removeEventListener would always be a no-op
  // (different function reference) — the previous call's listener would
  // stay attached forever, stacking one extra submit per modal open and
  // creating 1x/2x/3x duplicate tasks on repeated Enter-key adds. Stashing
  // the listener reference on the element itself lets us remove the exact
  // previous instance before adding the new one. Scoped to this one
  // listener only — script.js's separate 'input' listener on the same
  // element (Smart Suggest) is untouched.
  if (quickAddInput._eisenhauerKeyPressHandler) {
    quickAddInput.removeEventListener('keypress', quickAddInput._eisenhauerKeyPressHandler);
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  quickAddInput._eisenhauerKeyPressHandler = handleKeyPress;
  quickAddInput.addEventListener('keypress', handleKeyPress);
}

/**
 * Open edit recurring task modal
 * @param {object} task - Task to edit
 * @param {function} onSave - Callback when changes are saved
 * @param {object} translations - Translations object
 * @param {string} currentLanguage - Current language
 */
export function openEditRecurringModal(task, onSave, translations, currentLanguage) {
  const modal = document.getElementById('editRecurringModal');
  const taskNameElement = document.getElementById('editRecurringTaskName');
  const titleElement = document.getElementById('editRecurringTitle');
  const saveBtn = document.getElementById('editRecurringSaveBtn');
  const cancelBtn = document.getElementById('editRecurringCancelBtn');
  const disableRecurringCheckbox = document.getElementById('editDisableRecurring');
  const deleteTaskCheckbox = document.getElementById('editDeleteTask');

  if (!modal || !task.recurring) {
    return;
  }

  // Set task name and title
  taskNameElement.textContent = task.text;
  titleElement.textContent =
    currentLanguage === 'de' ? 'Wiederholung bearbeiten' : 'Edit Recurring Task';

  // Set current recurring type
  const recurringType = task.recurring.interval || 'daily';
  const recurringTypeRadio = document.querySelector(
    `input[name="editRecurringType"][value="${recurringType}"]`
  );
  if (recurringTypeRadio) {
    recurringTypeRadio.checked = true;
  }

  // Show/hide options based on type
  const weekdaysContainer = document.getElementById('editWeekdaysContainer');
  const monthDayContainer = document.getElementById('editMonthDayContainer');
  const customDaysContainer = document.getElementById('editCustomDaysContainer');

  weekdaysContainer.style.display = recurringType === 'weekly' ? 'flex' : 'none';
  monthDayContainer.style.display = recurringType === 'monthly' ? 'block' : 'none';
  customDaysContainer.style.display = recurringType === 'custom' ? 'block' : 'none';

  // Set weekdays if weekly
  if (recurringType === 'weekly' && task.recurring.weekdays) {
    document.querySelectorAll('.edit-weekday-check').forEach((cb) => {
      cb.checked = task.recurring.weekdays.includes(parseInt(cb.value));
    });
  }

  // Set month day if monthly
  if (recurringType === 'monthly' && task.recurring.dayOfMonth) {
    document.getElementById('editMonthDay').value = task.recurring.dayOfMonth;
  }

  // Set custom days if custom
  if (recurringType === 'custom' && task.recurring.customDays) {
    document.getElementById('editCustomDays').value = task.recurring.customDays;
  }

  // Reset checkboxes
  disableRecurringCheckbox.checked = false;
  deleteTaskCheckbox.checked = false;

  // Handle recurring type change
  const recurringTypeRadios = document.querySelectorAll('input[name="editRecurringType"]');
  recurringTypeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      weekdaysContainer.style.display = radio.value === 'weekly' ? 'flex' : 'none';
      monthDayContainer.style.display = radio.value === 'monthly' ? 'block' : 'none';
      customDaysContainer.style.display = radio.value === 'custom' ? 'block' : 'none';
    });
  });

  // Show modal
  modal.style.display = 'flex';

  // Handle save
  const handleSave = () => {
    const selectedType = document.querySelector('input[name="editRecurringType"]:checked').value;

    if (deleteTaskCheckbox.checked) {
      // Delete task permanently
      onSave(task.id, 'DELETE');
    } else if (disableRecurringCheckbox.checked) {
      // Remove recurring
      onSave(task.id, null);
    } else {
      // Update recurring config
      const newConfig = {
        enabled: true,
        interval: selectedType,
      };

      if (selectedType === 'weekly') {
        const checkedWeekdays = Array.from(
          document.querySelectorAll('.edit-weekday-check:checked')
        ).map((cb) => parseInt(cb.value));
        newConfig.weekdays = checkedWeekdays;
      } else if (selectedType === 'monthly') {
        newConfig.dayOfMonth = parseInt(document.getElementById('editMonthDay').value);
      } else if (selectedType === 'custom') {
        newConfig.customDays = parseInt(document.getElementById('editCustomDays').value);
      }

      onSave(task.id, newConfig);
    }

    modal.style.display = 'none';
  };

  // Handle cancel
  const handleCancel = () => {
    modal.style.display = 'none';
  };

  // Remove old listeners and add new ones
  const newSaveBtn = saveBtn.cloneNode(true);
  saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
  newSaveBtn.addEventListener('click', handleSave);

  const newCancelBtn = cancelBtn.cloneNode(true);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
  newCancelBtn.addEventListener('click', handleCancel);
}

/**
 * Open Tutorial modal
 * @param {string} currentLanguage - Current language
 */
export function openTutorialModal(currentLanguage = 'en') {
  const tutorialModal = document.getElementById('tutorialModal');
  if (!tutorialModal) return;

  // Update translations
  const lang = translations[currentLanguage].tutorial;
  const tutorialTitle = document.getElementById('tutorialTitle');
  const tutorialSkipBtn = document.getElementById('tutorialSkipBtn');
  const tutorialBackBtn = document.getElementById('tutorialBackBtn');
  const tutorialNextBtn = document.getElementById('tutorialNextBtn');
  const tutorialDontShowText = document.getElementById('tutorialDontShowText');

  if (tutorialTitle) tutorialTitle.textContent = lang.title;
  if (tutorialSkipBtn) tutorialSkipBtn.textContent = lang.skip;
  if (tutorialBackBtn) tutorialBackBtn.textContent = lang.back;
  if (tutorialNextBtn) tutorialNextBtn.textContent = lang.next;
  if (tutorialDontShowText) tutorialDontShowText.textContent = lang.dontShow;

  // Update slide texts
  const slide1Title = document.getElementById('tutorialSlide1Title');
  const slide1Text = document.getElementById('tutorialSlide1Text');
  const slide2Title = document.getElementById('tutorialSlide2Title');
  const slide2Text = document.getElementById('tutorialSlide2Text');
  const slide3Title = document.getElementById('tutorialSlide3Title');
  const slide3Text = document.getElementById('tutorialSlide3Text');

  if (slide1Title) slide1Title.textContent = lang.slide1.title;
  if (slide1Text) slide1Text.textContent = lang.slide1.text;
  if (slide2Title) slide2Title.textContent = lang.slide2.title;
  if (slide2Text) slide2Text.textContent = lang.slide2.text;
  if (slide3Title) slide3Title.textContent = lang.slide3.title;
  if (slide3Text) slide3Text.textContent = lang.slide3.text;

  // Initialize tutorial state
  let currentSlide = 1;
  const totalSlides = 3;

  const updateSlide = (slideNum) => {
    currentSlide = slideNum;

    // Update slides
    tutorialModal.querySelectorAll('.tutorial-slide').forEach((slide) => {
      slide.classList.remove('active');
      if (parseInt(slide.dataset.slide) === slideNum) {
        slide.classList.add('active');
      }
    });

    // Update dots
    tutorialModal.querySelectorAll('.tutorial-dot').forEach((dot) => {
      dot.classList.remove('active');
      const isActive = parseInt(dot.dataset.slide) === slideNum;
      if (isActive) {
        dot.classList.add('active');
      }
      // Update ARIA attribute for accessibility
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update buttons
    if (tutorialBackBtn) {
      tutorialBackBtn.disabled = slideNum === 1;
    }

    if (tutorialNextBtn) {
      if (slideNum === totalSlides) {
        tutorialNextBtn.textContent = lang.done;
      } else {
        tutorialNextBtn.textContent = lang.next;
      }
    }
  };

  // Setup event handlers
  const existingHandler = tutorialModal._clickHandler;
  if (existingHandler) {
    tutorialModal.removeEventListener('click', existingHandler);
  }

  const clickHandler = (e) => {
    const target = e.target;

    // Skip button
    if (target.closest('#tutorialSkipBtn')) {
      // User explicitly skipped the tutorial; mark as seen to avoid showing again
      localStorage.setItem('tutorialSeen', 'true');
      closeTutorialModal();
      return;
    }

    // Back button
    if (target.closest('#tutorialBackBtn')) {
      if (currentSlide > 1) {
        updateSlide(currentSlide - 1);
      }
      return;
    }

    // Next/Done button
    if (target.closest('#tutorialNextBtn')) {
      if (currentSlide < totalSlides) {
        updateSlide(currentSlide + 1);
      } else {
        // Save "don't show again" preference
        const dontShowAgain = document.getElementById('tutorialDontShowAgain');
        if (dontShowAgain && dontShowAgain.checked) {
          localStorage.setItem('tutorialSeen', 'true');
        }
        closeTutorialModal();
      }
      return;
    }

    // Dot navigation
    const dot = target.closest('.tutorial-dot');
    if (dot) {
      const slideNum = parseInt(dot.dataset.slide);
      updateSlide(slideNum);
      return;
    }
  };

  tutorialModal._clickHandler = clickHandler;
  tutorialModal.addEventListener('click', clickHandler);

  // Initialize first slide
  updateSlide(1);

  // Show modal
  tutorialModal.classList.remove('hidden');
  tutorialModal.classList.add('active');
  tutorialModal.style.display = 'flex';
}

/**
 * Close Tutorial modal
 */
export function closeTutorialModal() {
  const tutorialModal = document.getElementById('tutorialModal');
  if (tutorialModal) {
    tutorialModal.classList.remove('active');
    tutorialModal.classList.add('hidden');
    tutorialModal.style.display = 'none';
  }
}

/**
 * Check if tutorial should be shown (first time user)
 * @returns {boolean} True if tutorial should be shown
 */
export function shouldShowTutorial() {
  return !localStorage.getItem('tutorialSeen');
}
