/**
 * Accessibility Module
 * Provides keyboard navigation and screen reader support for drag & drop
 * Target: WCAG 2.1 Level AA Compliance
 */

/**
 * KeyboardDragManager - Enables keyboard-only drag & drop
 *
 * Keyboard Controls:
 * - Space: Select/deselect task for moving
 * - Arrow Keys: Navigate between quadrants (when task selected)
 * - Enter: Confirm move to highlighted quadrant
 * - Escape: Cancel selection
 */
export class KeyboardDragManager {
    constructor(onMoveCallback) {
        this.selectedTask = null;
        this.selectedTaskElement = null;
        this.targetQuadrant = null;
        this.onMoveCallback = onMoveCallback;

        this.setupKeyboardListeners();
        this.createAriaLiveRegion();

        console.log('[KeyboardDragManager] Initialized');
    }

    /**
     * Create ARIA live region for announcements
     */
    createAriaLiveRegion() {
        if (!document.getElementById('aria-live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'aria-live-region';
            liveRegion.setAttribute('role', 'status');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }
    }

    /**
     * Announce message to screen readers
     */
    announce(message) {
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            console.log('[A11y] Announced:', message);
        }
    }

    /**
     * Setup keyboard event listeners
     */
    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            // Only handle if target is a task item
            const taskItem = e.target.closest('.task-item');

            if (e.key === ' ' && taskItem) {
                e.preventDefault();
                this.toggleSelection(taskItem);
            }

            if (e.key === 'Enter' && this.selectedTask && this.targetQuadrant !== null) {
                e.preventDefault();
                this.confirmMove();
            }

            if (e.key === 'Escape' && this.selectedTask) {
                e.preventDefault();
                this.clearSelection();
            }

            if (e.key.startsWith('Arrow') && this.selectedTask) {
                e.preventDefault();
                this.navigateQuadrants(e.key);
            }
        });
    }

    /**
     * Toggle task selection
     */
    toggleSelection(taskElement) {
        if (this.selectedTaskElement === taskElement) {
            this.clearSelection();
        } else {
            this.clearSelection();
            this.selectTask(taskElement);
        }
    }

    /**
     * Select a task for moving
     */
    selectTask(taskElement) {
        this.selectedTaskElement = taskElement;
        this.selectedTask = {
            id: taskElement.dataset.taskId,
            segment: parseInt(taskElement.closest('.segment').dataset.segment),
            text: taskElement.querySelector('.task-text')?.textContent || 'Task'
        };

        // Visual feedback
        taskElement.classList.add('keyboard-selected');
        taskElement.setAttribute('aria-pressed', 'true');

        // Set initial target to same quadrant
        this.targetQuadrant = this.selectedTask.segment;
        this.highlightTargetQuadrant();

        // Announce to screen reader
        this.announce(
            `Task selected: ${this.selectedTask.text}. ` +
            `Press Arrow keys to choose destination quadrant, Enter to move, or Escape to cancel.`
        );
    }

    /**
     * Clear task selection
     */
    clearSelection() {
        if (this.selectedTaskElement) {
            this.selectedTaskElement.classList.remove('keyboard-selected');
            this.selectedTaskElement.setAttribute('aria-pressed', 'false');
        }

        this.clearQuadrantHighlights();

        this.selectedTask = null;
        this.selectedTaskElement = null;
        this.targetQuadrant = null;

        this.announce('Selection cancelled.');
    }

    /**
     * Navigate between quadrants using arrow keys
     */
    navigateQuadrants(key) {
        const quadrantMap = {
            1: { up: 1, down: 3, left: 1, right: 2 },
            2: { up: 2, down: 4, left: 1, right: 2 },
            3: { up: 1, down: 3, left: 3, right: 4 },
            4: { up: 2, down: 4, left: 3, right: 4 }
        };

        const current = this.targetQuadrant || this.selectedTask.segment;
        let newTarget = current;

        switch (key) {
            case 'ArrowUp':
                newTarget = quadrantMap[current].up;
                break;
            case 'ArrowDown':
                newTarget = quadrantMap[current].down;
                break;
            case 'ArrowLeft':
                newTarget = quadrantMap[current].left;
                break;
            case 'ArrowRight':
                newTarget = quadrantMap[current].right;
                break;
        }

        if (newTarget !== this.targetQuadrant) {
            this.targetQuadrant = newTarget;
            this.highlightTargetQuadrant();

            const quadrantName = this.getQuadrantName(newTarget);
            this.announce(`Target: ${quadrantName}. Press Enter to move here.`);
        }
    }

    /**
     * Highlight the target quadrant
     */
    highlightTargetQuadrant() {
        this.clearQuadrantHighlights();

        const targetSegment = document.querySelector(`.segment[data-segment="${this.targetQuadrant}"]`);
        if (targetSegment) {
            targetSegment.classList.add('keyboard-target');
        }
    }

    /**
     * Clear all quadrant highlights
     */
    clearQuadrantHighlights() {
        document.querySelectorAll('.segment.keyboard-target').forEach(segment => {
            segment.classList.remove('keyboard-target');
        });
    }

    /**
     * Confirm move to target quadrant
     */
    confirmMove() {
        if (!this.selectedTask || this.targetQuadrant === null) return;

        const fromSegment = this.selectedTask.segment;
        const toSegment = this.targetQuadrant;

        if (fromSegment === toSegment) {
            this.announce('Task is already in this quadrant.');
            this.clearSelection();
            return;
        }

        // Execute move callback
        if (this.onMoveCallback) {
            this.onMoveCallback(this.selectedTask.id, fromSegment, toSegment);
        }

        const fromName = this.getQuadrantName(fromSegment);
        const toName = this.getQuadrantName(toSegment);

        this.announce(`Task moved from ${fromName} to ${toName}.`);
        this.clearSelection();
    }

    /**
     * Get human-readable quadrant name
     */
    getQuadrantName(segment) {
        const names = {
            1: 'Important and Urgent',
            2: 'Important but Not Urgent',
            3: 'Not Important but Urgent',
            4: 'Not Important and Not Urgent'
        };
        return names[segment] || `Quadrant ${segment}`;
    }
}

/**
 * Announce drag operation to screen readers
 */
export function announceDragStart(taskTitle) {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
        liveRegion.textContent = `Started dragging task: ${taskTitle}`;
    }
}

/**
 * Announce drag completion to screen readers
 */
export function announceDragEnd(taskTitle, fromQuadrant, toQuadrant) {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
        const fromName = getQuadrantName(fromQuadrant);
        const toName = getQuadrantName(toQuadrant);
        liveRegion.textContent = `Task "${taskTitle}" moved from ${fromName} to ${toName}.`;
    }
}

/**
 * Helper: Get quadrant name
 */
function getQuadrantName(segment) {
    const names = {
        1: 'Important and Urgent',
        2: 'Important but Not Urgent',
        3: 'Not Important but Urgent',
        4: 'Not Important and Not Urgent'
    };
    return names[segment] || `Quadrant ${segment}`;
}
