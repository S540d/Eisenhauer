/**
 * E2E Tests for Mobile Drag & Drop
 * Tests touch-based drag and drop functionality on mobile devices
 */

import { test, expect } from '@playwright/test';

test.describe('Mobile Drag & Drop', () => {
  test.use({
    ...test.use(),
    viewport: { width: 375, height: 667 } // iPhone SE size
  });

  test.beforeEach(async ({ page }) => {
    // Navigate to app in guest mode
    await page.goto('/');

    // Wait for app to load
    await page.waitForSelector('#eisenhauer-matrix', { state: 'visible' });

    // Wait for tasks to load
    await page.waitForTimeout(1000);
  });

  test('should drag task from Important+Urgent to Important+Not Urgent using touch', async ({ page }) => {
    // Create a test task in Quadrant 1 (Important + Urgent)
    const addButton1 = page.locator('#addBtn1');
    await addButton1.click();

    // Fill task form
    await page.fill('#taskTitle', 'Mobile Drag Test Task');
    await page.fill('#taskDescription', 'Testing mobile drag functionality');
    await page.click('button:has-text("Erstellen")');

    // Wait for task to appear
    const task = page.locator('.task-item').filter({ hasText: 'Mobile Drag Test Task' }).first();
    await expect(task).toBeVisible();

    // Get task position
    const taskBox = await task.boundingBox();
    if (!taskBox) throw new Error('Task not found');

    // Get target quadrant (Quadrant 2: Important + Not Urgent)
    const quadrant2 = page.locator('#quadrant2');
    const quadrant2Box = await quadrant2.boundingBox();
    if (!quadrant2Box) throw new Error('Quadrant 2 not found');

    // Perform touch drag
    await page.touchscreen.tap(taskBox.x + taskBox.width / 2, taskBox.y + taskBox.height / 2);
    await page.touchscreen.swipe(
      { x: taskBox.x + taskBox.width / 2, y: taskBox.y + taskBox.height / 2 },
      { x: quadrant2Box.x + 50, y: quadrant2Box.y + 50 }
    );

    // Wait for animation
    await page.waitForTimeout(500);

    // Verify task moved to Quadrant 2
    const taskInQuadrant2 = quadrant2.locator('.task-item').filter({ hasText: 'Mobile Drag Test Task' });
    await expect(taskInQuadrant2).toBeVisible();
  });

  test('should show visual feedback during drag', async ({ page }) => {
    // Create test task
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Visual Feedback Test');
    await page.click('button:has-text("Erstellen")');

    const task = page.locator('.task-item').filter({ hasText: 'Visual Feedback Test' }).first();
    await expect(task).toBeVisible();

    const taskBox = await task.boundingBox();
    if (!taskBox) throw new Error('Task not found');

    // Start touch drag
    await page.touchscreen.tap(taskBox.x + taskBox.width / 2, taskBox.y + taskBox.height / 2);

    // Verify dragging state is applied
    await expect(page.locator('body')).toHaveClass(/dragging/);

    // Complete drag
    await page.touchscreen.swipe(
      { x: taskBox.x + taskBox.width / 2, y: taskBox.y + taskBox.height / 2 },
      { x: taskBox.x + 100, y: taskBox.y + 100 }
    );

    // Wait for animation
    await page.waitForTimeout(500);

    // Verify dragging state is removed
    await expect(page.locator('body')).not.toHaveClass(/dragging/);
  });

  test('should cancel drag on scroll', async ({ page }) => {
    // Create test task
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Scroll Cancel Test');
    await page.click('button:has-text("Erstellen")');

    const task = page.locator('.task-item').filter({ hasText: 'Scroll Cancel Test' }).first();
    await expect(task).toBeVisible();

    // Get initial parent quadrant
    const quadrant1 = page.locator('#quadrant1');
    const taskInQuadrant1Before = quadrant1.locator('.task-item').filter({ hasText: 'Scroll Cancel Test' });
    await expect(taskInQuadrant1Before).toBeVisible();

    const taskBox = await task.boundingBox();
    if (!taskBox) throw new Error('Task not found');

    // Start drag then scroll (which should cancel)
    await page.touchscreen.tap(taskBox.x + taskBox.width / 2, taskBox.y + taskBox.height / 2);

    // Simulate scroll by moving vertically more than threshold
    await page.mouse.move(taskBox.x + taskBox.width / 2, taskBox.y + taskBox.height / 2);
    await page.mouse.move(taskBox.x + taskBox.width / 2, taskBox.y + 50); // Vertical movement

    await page.waitForTimeout(300);

    // Task should still be in original quadrant
    const taskInQuadrant1After = quadrant1.locator('.task-item').filter({ hasText: 'Scroll Cancel Test' });
    await expect(taskInQuadrant1After).toBeVisible();
  });

  test('should work across all quadrants', async ({ page }) => {
    // Test dragging to each quadrant
    const quadrants = [
      { id: 1, name: 'Important + Urgent' },
      { id: 2, name: 'Important + Not Urgent' },
      { id: 3, name: 'Not Important + Urgent' },
      { id: 4, name: 'Not Important + Not Urgent' }
    ];

    // Create task in quadrant 1
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Cross-Quadrant Test');
    await page.click('button:has-text("Erstellen")');

    const task = page.locator('.task-item').filter({ hasText: 'Cross-Quadrant Test' }).first();
    await expect(task).toBeVisible();

    // Drag to each quadrant
    for (const quadrant of quadrants.slice(1)) {
      const targetQuadrant = page.locator(`#quadrant${quadrant.id}`);
      const targetBox = await targetQuadrant.boundingBox();
      if (!targetBox) throw new Error(`Quadrant ${quadrant.id} not found`);

      const taskBox = await task.boundingBox();
      if (!taskBox) throw new Error('Task not found');

      // Drag to target
      await page.touchscreen.swipe(
        { x: taskBox.x + taskBox.width / 2, y: taskBox.y + taskBox.height / 2 },
        { x: targetBox.x + 50, y: targetBox.y + 50 }
      );

      await page.waitForTimeout(500);

      // Verify task is in target quadrant
      const taskInTarget = targetQuadrant.locator('.task-item').filter({ hasText: 'Cross-Quadrant Test' });
      await expect(taskInTarget).toBeVisible();
    }
  });
});
