/**
 * @fileoverview Unified Drag & Drop Manager
 * @module drag-manager
 * @description
 * Unified abstraction for both touch and mouse-based drag & drop.
 * Provides consistent API regardless of input method.
 *
 * Features:
 * - Touch and mouse event handling
 * - Long-press activation (300ms)
 * - Visual feedback (clone element)
 * - Direction detection (vertical drag vs horizontal swipe)
 * - Drop zone highlighting
 * - Haptic feedback (mobile)
 *
 * @version 2.0.0
 * @since 2025-10-16
 */

import { store } from './store.js';
import { ErrorHandler, TaskMoveError } from './error-handler.js';
import { showSuccess, showError } from './notifications.js';

/**
 * @typedef {Object} DragConfig
 * @property {HTMLElement} element - Element to make draggable
 * @property {Object} data - Data associated with drag (e.g., task object)
 * @property {Function} onDragStart - Callback when drag starts
 * @property {Function} onDragMove - Callback during drag
 * @property {Function} onDragEnd - Callback when drag ends
 * @property {Function} onSwipeDelete - Callback for swipe-to-delete
 * @property {boolean} [enableSwipeDelete=true] - Enable horizontal swipe to delete
 * @property {number} [longPressDelay=300] - Long press delay in ms
 * @property {number} [swipeThreshold=100] - Swipe distance threshold
 */

/**
 * @typedef {Object} DragEvent
 * @property {string} type - 'start' | 'move' | 'end' | 'cancel'
 * @property {Object} data - Drag data
 * @property {number} x - Current X position
 * @property {number} y - Current Y position
 * @property {number} deltaX - Change in X since start
 * @property {number} deltaY - Change in Y since start
 * @property {HTMLElement|null} target - Current drop target
 */

/**
 * DragManager Class
 * Handles both touch and mouse drag & drop with unified API
 */
export class DragManager {
  /**
   * @private
   * @type {HTMLElement}
   */
  element;

  /**
   * @private
   * @type {Object}
   */
  data;

  /**
   * @private
   * @type {DragConfig}
   */
  config;

  /**
   * @private
   * @type {Object}
   */
  state = {
    isDragging: false,
    isSwipeDelete: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    longPressTimer: null,
    dragClone: null,
    dropTarget: null,
    originalOpacity: null
  };

  /**
   * Create a DragManager instance
   * @param {DragConfig} config - Configuration
   */
  constructor(config) {
    this.element = config.element;
    this.data = config.data;
    this.config = {
      onDragStart: config.onDragStart || (() => {}),
      onDragMove: config.onDragMove || (() => {}),
      onDragEnd: config.onDragEnd || (() => {}),
      onSwipeDelete: config.onSwipeDelete || null,
      enableSwipeDelete: config.enableSwipeDelete !== false,
      longPressDelay: config.longPressDelay || 300,
      swipeThreshold: config.swipeThreshold || 100
    };

    this.#init();
  }

  /**
   * Initialize event listeners
   * @private
   */
  #init() {
    if (this.#isTouchDevice()) {
      this.#setupTouchEvents();
    } else {
      this.#setupMouseEvents();
    }

    // Store initial opacity for restoration
    this.state.originalOpacity = window.getComputedStyle(this.element).opacity;
  }

  /**
   * Check if device supports touch
   * @private
   * @returns {boolean}
   */
  #isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /**
   * Setup touch event listeners
   * @private
   */
  #setupTouchEvents() {
    this.element.addEventListener('touchstart', this.#handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.#handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.#handleTouchEnd.bind(this));
    this.element.addEventListener('touchcancel', this.#handleTouchCancel.bind(this));

    // Prevent context menu on long press
    this.element.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /**
   * Setup mouse event listeners
   * @private
   */
  #setupMouseEvents() {
    this.element.draggable = true;

    this.element.addEventListener('dragstart', this.#handleDragStart.bind(this));
    this.element.addEventListener('drag', this.#handleDrag.bind(this));
    this.element.addEventListener('dragend', this.#handleDragEnd.bind(this));
  }

  /**
   * Handle touch start
   * @private
   * @param {TouchEvent} e
   */
  #handleTouchStart(e) {
    const touch = e.touches[0];

    // Store initial position
    this.state.startX = touch.clientX;
    this.state.startY = touch.clientY;
    this.state.currentX = touch.clientX;
    this.state.currentY = touch.clientY;

    // Start long press timer
    this.state.longPressTimer = setTimeout(() => {
      this.#activateDragMode();
    }, this.config.longPressDelay);
  }

  /**
   * Handle touch move
   * @private
   * @param {TouchEvent} e
   */
  #handleTouchMove(e) {
    const touch = e.touches[0];

    // Update current position
    this.state.currentX = touch.clientX;
    this.state.currentY = touch.clientY;

    // Calculate deltas
    this.state.deltaX = this.state.currentX - this.state.startX;
    this.state.deltaY = this.state.currentY - this.state.startY;

    // Check if movement cancels long press
    if (!this.state.isDragging && !this.state.isSwipeDelete && this.state.longPressTimer) {
      const distance = Math.sqrt(
        this.state.deltaX * this.state.deltaX +
        this.state.deltaY * this.state.deltaY
      );

      // If moved too much before long press, cancel it (don't return - let swipe detection continue)
      if (distance > 10) {
        this.#cancelLongPress();
      }
    }

    // Determine gesture type
    if (!this.state.isDragging && !this.state.isSwipeDelete) {
      const absDeltaX = Math.abs(this.state.deltaX);
      const absDeltaY = Math.abs(this.state.deltaY);

      // Vertical movement → Drag
      if (absDeltaY > 20 && absDeltaY > absDeltaX) {
        this.#cancelLongPress();
        this.#activateDragMode();
      }
      // Horizontal left swipe → Delete (if enabled)
      else if (this.config.enableSwipeDelete && this.state.deltaX < -50 && absDeltaX > absDeltaY) {
        this.#cancelLongPress();
        this.#activateSwipeDelete();
      }
    }

    // Handle active drag
    if (this.state.isDragging) {
      e.preventDefault(); // Prevent scrolling

      // Update clone position
      this.#updateClonePosition(this.state.currentX, this.state.currentY);

      // Detect drop target
      this.#detectDropTarget(this.state.currentX, this.state.currentY);

      // Notify callback
      this.config.onDragMove(this.#createDragEvent('move'));
    }

    // Handle swipe delete
    if (this.state.isSwipeDelete) {
      e.preventDefault();

      // Apply translation
      const translateX = Math.min(0, this.state.deltaX);
      this.element.style.transform = `translateX(${translateX}px)`;
      this.element.style.opacity = 1 + translateX / 300; // Fade out
    }
  }

  /**
   * Handle touch end
   * @private
   * @param {TouchEvent} e
   */
  #handleTouchEnd(e) {
    // Cancel long press if still waiting
    this.#cancelLongPress();

    // Handle drag end
    if (this.state.isDragging) {
      this.#finalizeDrag();
    }

    // Handle swipe delete
    if (this.state.isSwipeDelete) {
      this.#finalizeSwipe();
    }

    // Reset state
    this.#resetState();
  }

  /**
   * Handle touch cancel
   * @private
   * @param {TouchEvent} e
   */
  #handleTouchCancel(e) {
    this.#cancelLongPress();
    this.#cancelDrag();
    this.#resetState();
  }

  /**
   * Handle HTML5 drag start (mouse)
   * @private
   * @param {DragEvent} e
   */
  #handleDragStart(e) {
    // Store drag data
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(this.data));

    // Visual feedback
    this.element.style.opacity = '0.5';

    // Update store
    store.setState({
      isDragging: true,
      draggedTask: this.data
    }, 'drag-start');

    // Notify callback
    this.state.isDragging = true;
    this.config.onDragStart(this.#createDragEvent('start'));
  }

  /**
   * Handle HTML5 drag (mouse)
   * @private
   * @param {DragEvent} e
   */
  #handleDrag(e) {
    if (e.clientX === 0 && e.clientY === 0) return; // Ignore final event

    this.state.currentX = e.clientX;
    this.state.currentY = e.clientY;

    this.config.onDragMove(this.#createDragEvent('move'));
  }

  /**
   * Handle HTML5 drag end (mouse)
   * @private
   * @param {DragEvent} e
   */
  #handleDragEnd(e) {
    // Reset visual state
    this.element.style.opacity = this.state.originalOpacity;

    // Update store
    store.setState({
      isDragging: false,
      draggedTask: null
    }, 'drag-end');

    // Notify callback
    this.config.onDragEnd(this.#createDragEvent('end'));

    this.state.isDragging = false;
  }

  /**
   * Activate drag mode (after long press or vertical movement)
   * @private
   */
  #activateDragMode() {
    this.state.isDragging = true;

    // Haptic feedback
    this.#triggerHaptic(50);

    // Create visual clone
    this.#createClone();

    // Dim original
    this.element.style.opacity = '0.3';

    // Prevent pull-to-refresh
    document.body.style.overflow = 'hidden';

    // Update store
    store.setState({
      isDragging: true,
      draggedTask: this.data,
      dragSource: this.element
    }, 'drag-start');

    // Notify callback
    this.config.onDragStart(this.#createDragEvent('start'));
  }

  /**
   * Activate swipe delete mode
   * @private
   */
  #activateSwipeDelete() {
    this.state.isSwipeDelete = true;

    // Haptic feedback (lighter)
    this.#triggerHaptic(30);
  }

  /**
   * Create drag clone element
   * @private
   */
  #createClone() {
    const clone = this.element.cloneNode(true);

    clone.style.position = 'fixed';
    clone.style.zIndex = '9999';
    clone.style.pointerEvents = 'none';
    clone.style.transform = 'scale(1.05) rotate(2deg)';
    clone.style.opacity = '0.9';
    clone.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
    clone.style.transition = 'none';

    // Position at touch point
    const rect = this.element.getBoundingClientRect();
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.left = `${this.state.currentX - rect.width / 2}px`;
    clone.style.top = `${this.state.currentY - rect.height / 2}px`;

    document.body.appendChild(clone);
    this.state.dragClone = clone;
  }

  /**
   * Update clone position
   * @private
   * @param {number} x
   * @param {number} y
   */
  #updateClonePosition(x, y) {
    if (!this.state.dragClone) return;

    const rect = this.element.getBoundingClientRect();
    this.state.dragClone.style.left = `${x - rect.width / 2}px`;
    this.state.dragClone.style.top = `${y - rect.height / 2}px`;
  }

  /**
   * Detect drop target under touch/mouse
   * @private
   * @param {number} x
   * @param {number} y
   */
  #detectDropTarget(x, y) {
    // Hide clone temporarily to get element underneath
    if (this.state.dragClone) {
      this.state.dragClone.style.display = 'none';
    }

    const elements = document.elementsFromPoint(x, y);

    if (this.state.dragClone) {
      this.state.dragClone.style.display = 'block';
    }

    // Find task-list drop zone
    const dropZone = elements.find(el =>
      el.classList.contains('task-list') ||
      el.classList.contains('drop-zone')
    );

    // Update drop target highlighting
    if (dropZone !== this.state.dropTarget) {
      // Remove highlight from old target
      if (this.state.dropTarget) {
        this.state.dropTarget.classList.remove('drag-over');
      }

      // Add highlight to new target
      if (dropZone) {
        dropZone.classList.add('drag-over');
      }

      this.state.dropTarget = dropZone;
    }
  }

  /**
   * Finalize drag (on touch end)
   * @private
   */
  #finalizeDrag() {
    // Remove clone with animation
    if (this.state.dragClone) {
      this.state.dragClone.style.transition = 'all 0.3s ease';
      this.state.dragClone.style.opacity = '0';
      this.state.dragClone.style.transform = 'scale(0.5)';

      setTimeout(() => {
        this.state.dragClone?.remove();
        this.state.dragClone = null;
      }, 300);
    }

    // Restore original opacity
    this.element.style.opacity = this.state.originalOpacity;

    // Re-enable scrolling
    document.body.style.overflow = '';

    // Remove drop zone highlighting
    if (this.state.dropTarget) {
      this.state.dropTarget.classList.remove('drag-over');
    }

    // Haptic feedback on drop
    if (this.state.dropTarget) {
      this.#triggerHaptic([30, 10, 30]); // Double pulse
    }

    // Update store
    store.setState({
      isDragging: false,
      draggedTask: null,
      dragSource: null,
      dragTarget: this.state.dropTarget
    }, 'drag-end');

    // Notify callback
    this.config.onDragEnd(this.#createDragEvent('end'));
  }

  /**
   * Finalize swipe delete
   * @private
   */
  #finalizeSwipe() {
    const threshold = this.config.swipeThreshold;

    if (this.state.deltaX < -threshold) {
      // Swipe exceeded threshold → Delete
      this.element.style.transition = 'all 0.3s ease';
      this.element.style.transform = 'translateX(-300px)';
      this.element.style.opacity = '0';

      setTimeout(() => {
        if (this.config.onSwipeDelete) {
          this.config.onSwipeDelete(this.data);
        }
      }, 300);
    } else {
      // Swipe too short → Reset
      this.element.style.transition = 'all 0.3s ease';
      this.element.style.transform = 'translateX(0)';
      this.element.style.opacity = this.state.originalOpacity;

      setTimeout(() => {
        this.element.style.transition = '';
      }, 300);
    }
  }

  /**
   * Cancel drag
   * @private
   */
  #cancelDrag() {
    if (this.state.dragClone) {
      this.state.dragClone.remove();
      this.state.dragClone = null;
    }

    this.element.style.opacity = this.state.originalOpacity;
    document.body.style.overflow = '';

    if (this.state.dropTarget) {
      this.state.dropTarget.classList.remove('drag-over');
    }

    store.setState({
      isDragging: false,
      draggedTask: null
    }, 'drag-cancel');

    this.config.onDragEnd(this.#createDragEvent('cancel'));
  }

  /**
   * Cancel long press timer
   * @private
   */
  #cancelLongPress() {
    if (this.state.longPressTimer) {
      clearTimeout(this.state.longPressTimer);
      this.state.longPressTimer = null;
    }
  }

  /**
   * Reset state
   * @private
   */
  #resetState() {
    this.state.isDragging = false;
    this.state.isSwipeDelete = false;
    this.state.startX = 0;
    this.state.startY = 0;
    this.state.currentX = 0;
    this.state.currentY = 0;
    this.state.deltaX = 0;
    this.state.deltaY = 0;
    this.state.dropTarget = null;
  }

  /**
   * Create drag event object
   * @private
   * @param {string} type
   * @returns {DragEvent}
   */
  #createDragEvent(type) {
    return {
      type,
      data: this.data,
      x: this.state.currentX,
      y: this.state.currentY,
      deltaX: this.state.deltaX,
      deltaY: this.state.deltaY,
      target: this.state.dropTarget
    };
  }

  /**
   * Trigger haptic feedback
   * @private
   * @param {number|Array<number>} pattern
   */
  #triggerHaptic(pattern) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  /**
   * Destroy drag manager (cleanup)
   */
  destroy() {
    this.#cancelLongPress();

    if (this.state.dragClone) {
      this.state.dragClone.remove();
    }

    // Remove event listeners
    if (this.#isTouchDevice()) {
      this.element.removeEventListener('touchstart', this.#handleTouchStart);
      this.element.removeEventListener('touchmove', this.#handleTouchMove);
      this.element.removeEventListener('touchend', this.#handleTouchEnd);
      this.element.removeEventListener('touchcancel', this.#handleTouchCancel);
    } else {
      this.element.removeEventListener('dragstart', this.#handleDragStart);
      this.element.removeEventListener('drag', this.#handleDrag);
      this.element.removeEventListener('dragend', this.#handleDragEnd);
    }
  }
}

/**
 * Setup drop zones for HTML5 drag & drop (mouse)
 * @param {HTMLElement} dropZone - Drop zone element
 * @param {Function} onDrop - Drop callback
 */
export function setupDropZone(dropZone, onDrop) {
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      onDrop(data, dropZone);
    } catch (error) {
      ErrorHandler.handleError(error, {
        operation: 'drop',
        silent: false
      });
    }
  });
}
