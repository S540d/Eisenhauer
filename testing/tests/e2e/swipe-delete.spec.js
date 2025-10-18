/**
 * E2E Tests for Swipe-to-Delete Functionality
 * Tests swipe gesture for deleting tasks on mobile and desktop
 */

import { test, expect } from '@playwright/test';

test.describe('Swipe to Delete', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#eisenhauer-matrix', { state: 'visible' });
    await page.waitForTimeout(1000);
  });

  test('should delete task on swipe left (mobile)', async ({ page }) => {
    test.use({ viewport: { width: 375, height: 667 } });

    // Create task
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Swipe Delete Test');
    await page.click('button:has-text("Erstellen")');

    const task = page.locator('.task-item').filter({ hasText: 'Swipe Delete Test' }).first();
    await expect(task).toBeVisible();

    const taskBox = await task.boundingBox();
    if (!taskBox) throw new Error('Task not found');

    // Swipe left
    await page.touchscreen.swipe(
      { x: taskBox.x + taskBox.width - 10, y: taskBox.y + taskBox.height / 2 },
      { x: taskBox.x + 10, y: taskBox.y + taskBox.height / 2 }
    );

    await page.waitForTimeout(500);

    // Task should be deleted
    await expect(task).not.toBeVisible();
  });

  test('should show delete confirmation on swipe (desktop)', async ({ page }) => {
    test.use({ viewport: { width: 1280, height: 720 } });

    // Create task
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Desktop Swipe Test');
    await page.click('button:has-text("Erstellen")');

    const task = page.locator('.task-item').filter({ hasText: 'Desktop Swipe Test' }).first();
    await expect(task).toBeVisible();

    const taskBox = await task.boundingBox();
    if (!taskBox) throw new Error('Task not found');

    // Swipe with mouse
    await page.mouse.move(taskBox.x + taskBox.width - 10, taskBox.y + taskBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(taskBox.x + 10, taskBox.y + taskBox.height / 2);
    await page.mouse.up();

    await page.waitForTimeout(500);

    // Task should be deleted or show delete UI
    const taskExists = await task.isVisible().catch(() => false);

    if (taskExists) {
      // If task still visible, check for delete button or confirmation
      const deleteButton = page.locator('.delete-btn, .task-delete').first();
      await expect(deleteButton).toBeVisible();
    } else {
      // Task was deleted immediately
      await expect(task).not.toBeVisible();
    }
  });

  test('should cancel swipe if not far enough', async ({ page }) => {
    // Create task
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Short Swipe Test');
    await page.click('button:has-text("Erstellen")');

    const task = page.locator('.task-item').filter({ hasText: 'Short Swipe Test' }).first();
    await expect(task).toBeVisible();

    const taskBox = await task.boundingBox();
    if (!taskBox) throw new Error('Task not found');

    // Short swipe (not far enough to delete)
    await page.mouse.move(taskBox.x + taskBox.width - 10, taskBox.y + taskBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(taskBox.x + taskBox.width - 30, taskBox.y + taskBox.height / 2);
    await page.mouse.up();

    await page.waitForTimeout(500);

    // Task should still be visible
    await expect(task).toBeVisible();
  });

  test('should not delete on vertical swipe', async ({ page }) => {
    // Create task
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Vertical Swipe Test');
    await page.click('button:has-text("Erstellen")');

    const task = page.locator('.task-item').filter({ hasText: 'Vertical Swipe Test' }).first();
    await expect(task).toBeVisible();

    const taskBox = await task.boundingBox();
    if (!taskBox) throw new Error('Task not found');

    // Vertical swipe (should be ignored for delete)
    await page.mouse.move(taskBox.x + taskBox.width / 2, taskBox.y + 10);
    await page.mouse.down();
    await page.mouse.move(taskBox.x + taskBox.width / 2, taskBox.y + taskBox.height - 10);
    await page.mouse.up();

    await page.waitForTimeout(500);

    // Task should still be visible
    await expect(task).toBeVisible();
  });

  test('should work on tasks in all quadrants', async ({ page }) => {
    // Create tasks in different quadrants
    const quadrants = [1, 2, 3, 4];

    for (const quadrantId of quadrants) {
      await page.click(`#addBtn${quadrantId}`);
      await page.fill('#taskTitle', `Q${quadrantId} Swipe Test`);
      await page.click('button:has-text("Erstellen")');
      await page.waitForTimeout(300);
    }

    // Delete each task via swipe
    for (const quadrantId of quadrants) {
      const task = page.locator('.task-item').filter({ hasText: `Q${quadrantId} Swipe Test` }).first();
      await expect(task).toBeVisible();

      const taskBox = await task.boundingBox();
      if (!taskBox) continue;

      // Swipe left
      await page.mouse.move(taskBox.x + taskBox.width - 10, taskBox.y + taskBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(taskBox.x + 10, taskBox.y + taskBox.height / 2);
      await page.mouse.up();

      await page.waitForTimeout(500);

      // Task should be deleted
      await expect(task).not.toBeVisible();
    }
  });

  test('should show visual feedback during swipe', async ({ page }) => {
    // Create task
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Swipe Feedback Test');
    await page.click('button:has-text("Erstellen")');

    const task = page.locator('.task-item').filter({ hasText: 'Swipe Feedback Test' }).first();
    await expect(task).toBeVisible();

    const taskBox = await task.boundingBox();
    if (!taskBox) throw new Error('Task not found');

    // Start swipe
    await page.mouse.move(taskBox.x + taskBox.width - 10, taskBox.y + taskBox.height / 2);
    await page.mouse.down();

    // Move partially
    await page.mouse.move(taskBox.x + taskBox.width / 2, taskBox.y + taskBox.height / 2);

    // Check for swipe indicator or visual feedback
    const hasSwipeClass = await task.evaluate(el => {
      return el.classList.contains('swiping') ||
             el.classList.contains('swipe-left') ||
             el.style.transform !== '';
    });

    expect(hasSwipeClass).toBeTruthy();

    // Complete swipe
    await page.mouse.move(taskBox.x + 10, taskBox.y + taskBox.height / 2);
    await page.mouse.up();

    await page.waitForTimeout(500);

    // Task should be deleted
    await expect(task).not.toBeVisible();
  });

  test('should sync deletion to Firestore when online', async ({ page, context }) => {
    // Create task while online
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Sync Delete Test');
    await page.click('button:has-text("Erstellen")');

    const task = page.locator('.task-item').filter({ hasText: 'Sync Delete Test' }).first();
    await expect(task).toBeVisible();

    await page.waitForTimeout(1000);

    const taskBox = await task.boundingBox();
    if (!taskBox) throw new Error('Task not found');

    // Delete via swipe
    await page.mouse.move(taskBox.x + taskBox.width - 10, taskBox.y + taskBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(taskBox.x + 10, taskBox.y + taskBox.height / 2);
    await page.mouse.up();

    await page.waitForTimeout(500);

    // Task should be deleted
    await expect(task).not.toBeVisible();

    // Wait for potential sync
    await page.waitForTimeout(2000);

    // Reload page
    await page.reload();
    await page.waitForSelector('#eisenhauer-matrix', { state: 'visible' });
    await page.waitForTimeout(2000);

    // Task should still be deleted
    const taskAfterReload = page.locator('.task-item').filter({ hasText: 'Sync Delete Test' });
    await expect(taskAfterReload).toHaveCount(0);
  });
});
