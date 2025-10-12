/**
 * Drag and Drop Module
 * Handles drag & drop functionality for desktop and mobile (touch)
 */

import { SEGMENTS } from './config.js';

// Dragged element reference
let draggedElement = null;

/**
 * Handle drag start event (desktop)
 */
export function handleDragStart(e) {
    draggedElement = e.target;
    e.target.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

/**
 * Handle drag end event (desktop)
 */
export function handleDragEnd(e) {
    e.target.style.opacity = '1';

    // Remove all drag-over styles
    document.querySelectorAll('.task-list').forEach(list => {
        list.classList.remove('drag-over');
    });

    // Reset dragged element
    draggedElement = null;
}

/**
 * Handle drag over event (desktop)
 */
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

/**
 * Handle drag enter event (desktop)
 */
function handleDragEnter(e) {
    if (e.target.classList.contains('task-list')) {
        e.target.classList.add('drag-over');
    }
}

/**
 * Handle drag leave event (desktop)
 */
function handleDragLeave(e) {
    if (e.target.classList.contains('task-list')) {
        e.target.classList.remove('drag-over');
    }
}

/**
 * Handle drop event (desktop)
 * @param {Event} e - Drop event
 * @param {function} onTaskMove - Callback when task is moved (taskId, fromSegment, toSegment)
 */
function handleDrop(e, onTaskMove) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (!draggedElement) {
        console.warn('Drop: No dragged element found');
        return false;
    }

    const taskId = parseInt(draggedElement.dataset.taskId);
    const fromSegment = parseInt(draggedElement.dataset.segmentId);
    const toSegment = parseInt(e.currentTarget.dataset.segment);

    console.log('Drop event:', {
        taskId,
        fromSegment,
        toSegment,
        hasCallback: !!onTaskMove,
        willMove: fromSegment !== toSegment
    });

    if (fromSegment !== toSegment && onTaskMove) {
        console.log('Calling onTaskMove callback');
        onTaskMove(taskId, fromSegment, toSegment);
    } else {
        if (fromSegment === toSegment) {
            console.log('Same segment - no move needed');
        }
        if (!onTaskMove) {
            console.error('onTaskMove callback is not defined!');
        }
    }

    e.currentTarget.classList.remove('drag-over');
    return false;
}

// Store the last onTaskMove callback
let currentOnTaskMove = null;

/**
 * Handle drop with stored callback
 */
function handleDropWithCallback(e) {
    if (currentOnTaskMove) {
        handleDrop(e, currentOnTaskMove);
    }
}

/**
 * Setup drag and drop event listeners on task lists
 * @param {function} onTaskMove - Callback when task is moved
 */
export function setupDragAndDrop(onTaskMove) {
    const taskLists = document.querySelectorAll('.task-list');

    // Store the callback
    currentOnTaskMove = onTaskMove;

    taskLists.forEach(list => {
        // Remove old listeners first to avoid duplicates
        list.removeEventListener('dragover', handleDragOver, false);
        list.removeEventListener('dragenter', handleDragEnter, false);
        list.removeEventListener('dragleave', handleDragLeave, false);
        list.removeEventListener('drop', handleDropWithCallback, false);

        // Add new listeners
        list.addEventListener('dragover', handleDragOver, false);
        list.addEventListener('dragenter', handleDragEnter, false);
        list.addEventListener('dragleave', handleDragLeave, false);
        list.addEventListener('drop', handleDropWithCallback, false);
    });
}

/**
 * Setup touch drag and drop for mobile devices
 * @param {HTMLElement} element - Task element
 * @param {object} task - Task object
 * @param {function} onTaskMove - Callback when task is moved (taskId, fromSegment, toSegment)
 * @param {function} onTaskDelete - Callback when task is deleted (taskId, segmentId)
 */
export function setupTouchDrag(element, task, onTaskMove, onTaskDelete) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchCurrentX = 0;
    let touchCurrentY = 0;
    let isDragging = false;
    let isSwipeDelete = false;
    let dragClone = null;
    let dropTarget = null;

    element.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isDragging = false;
        isSwipeDelete = false;
    }, { passive: true });

    element.addEventListener('touchmove', (e) => {
        touchCurrentX = e.touches[0].clientX;
        touchCurrentY = e.touches[0].clientY;

        const diffX = touchCurrentX - touchStartX;
        const diffY = touchCurrentY - touchStartY;

        // Determine if this is a drag (vertical) or swipe delete (horizontal)
        if (!isDragging && !isSwipeDelete) {
            if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
                // Vertical movement - start dragging
                isDragging = true;
                e.preventDefault();

                // Create visual clone for dragging
                dragClone = element.cloneNode(true);
                dragClone.style.position = 'fixed';
                dragClone.style.width = element.offsetWidth + 'px';
                dragClone.style.opacity = '0.8';
                dragClone.style.zIndex = '1000';
                dragClone.style.pointerEvents = 'none';
                dragClone.style.transform = 'scale(1.05)';
                document.body.appendChild(dragClone);

                // Dim the original
                element.style.opacity = '0.3';
            } else if (Math.abs(diffX) > Math.abs(diffY) && diffX < 0 && Math.abs(diffX) > 10) {
                // Horizontal left swipe - delete gesture
                isSwipeDelete = true;
            }
        }

        if (isDragging && dragClone) {
            e.preventDefault();

            // Update clone position
            dragClone.style.left = (touchCurrentX - element.offsetWidth / 2) + 'px';
            dragClone.style.top = (touchCurrentY - 30) + 'px';

            // Find drop target
            const elementsBelow = document.elementsFromPoint(touchCurrentX, touchCurrentY);
            const taskListBelow = elementsBelow.find(el => el.classList.contains('task-list'));

            // Remove previous highlights
            document.querySelectorAll('.task-list').forEach(list => {
                list.classList.remove('drag-over');
            });

            if (taskListBelow) {
                dropTarget = taskListBelow;
                taskListBelow.classList.add('drag-over');
            }
        } else if (isSwipeDelete) {
            // Visual feedback for swipe delete
            element.style.transform = `translateX(${diffX}px)`;
            element.style.opacity = 1 + (diffX / 300);
        }
    }, { passive: false });

    element.addEventListener('touchend', (e) => {
        if (isDragging && dragClone) {
            e.preventDefault();

            // Remove clone
            document.body.removeChild(dragClone);
            dragClone = null;

            // Reset original opacity
            element.style.opacity = '1';

            // Handle drop
            if (dropTarget) {
                const toSegment = parseInt(dropTarget.dataset.segment);
                const fromSegment = task.segment;

                if (fromSegment !== toSegment && onTaskMove) {
                    onTaskMove(task.id, fromSegment, toSegment);
                }

                dropTarget.classList.remove('drag-over');
                dropTarget = null;
            }

            // Remove all highlights
            document.querySelectorAll('.task-list').forEach(list => {
                list.classList.remove('drag-over');
            });
        } else if (isSwipeDelete) {
            const diffX = touchCurrentX - touchStartX;

            // Delete if swiped more than 100px to the left
            if (diffX < -100) {
                element.style.transform = 'translateX(-300px)';
                element.style.opacity = '0';
                setTimeout(() => {
                    if (onTaskDelete) {
                        onTaskDelete(task.id, task.segment);
                    }
                }, 300);
            } else {
                // Reset
                element.style.transform = '';
                element.style.opacity = '';
            }
        }

        isDragging = false;
        isSwipeDelete = false;
    });
}

/**
 * Setup swipe to delete functionality
 * Note: This is now integrated with setupTouchDrag to avoid conflicts
 * Keeping this function for backward compatibility
 * @param {HTMLElement} element - Task element
 * @param {object} task - Task object
 */
export function setupSwipeToDelete(element, task) {
    // Functionality now handled in setupTouchDrag
    // This function is kept for backward compatibility but does nothing
}
