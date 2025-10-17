/**
 * E2E Tests for Desktop Drag & Drop
 * Tests mouse-based drag and drop functionality on desktop browsers
 */

import { test, expect } from '@playwright/test';

test.describe('Desktop Drag & Drop', () => {
  test.use({
    ...test.use(),
    viewport: { width: 1280, height: 720 }
  });

  test.beforeEach(async ({ page }) => {
    // Navigate to app
    await page.goto('/');

    // Wait for app to load
    await page.waitForSelector('#eisenhauer-matrix', { state: 'visible' });
    await page.waitForTimeout(1000);
  });

  test('should drag task using mouse', async ({ page }) => {
    // Create test task in Quadrant 1
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Desktop Drag Test');
    await page.fill('#taskDescription', 'Testing desktop drag');
    await page.click('button:has-text("Erstellen")');

    // Wait for task
    const task = page.locator('.task-item').filter({ hasText: 'Desktop Drag Test' }).first();
    await expect(task).toBeVisible();

    // Get quadrant 3
    const quadrant3 = page.locator('#quadrant3');
    const quadrant3Box = await quadrant3.boundingBox();
    if (!quadrant3Box) throw new Error('Quadrant 3 not found');

    // Drag task to quadrant 3
    await task.dragTo(quadrant3, {
      targetPosition: { x: 50, y: 50 }
    });

    // Wait for animation
    await page.waitForTimeout(500);

    // Verify task moved
    const taskInQuadrant3 = quadrant3.locator('.task-item').filter({ hasText: 'Desktop Drag Test' });
    await expect(taskInQuadrant3).toBeVisible();
  });

  test('should show drag cursor and visual feedback', async ({ page }) => {
    // Create task
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Cursor Test');
    await page.click('button:has-text("Erstellen")');

    const task = page.locator('.task-item').filter({ hasText: 'Cursor Test' }).first();
    await expect(task).toBeVisible();

    // Hover over task - should show grab cursor
    await task.hover();
    const cursor = await task.evaluate(el => window.getComputedStyle(el).cursor);
    expect(cursor).toContain('grab');

    // Start dragging
    await task.hover();
    await page.mouse.down();

    // Should have dragging class
    await expect(page.locator('body')).toHaveClass(/dragging/);

    // Release
    await page.mouse.up();

    // Dragging class should be removed
    await expect(page.locator('body')).not.toHaveClass(/dragging/);
  });

  test('should highlight drop target on hover', async ({ page }) => {
    // Create task
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Hover Highlight Test');
    await page.click('button:has-text("Erstellen")');

    const task = page.locator('.task-item').filter({ hasText: 'Hover Highlight Test' }).first();
    await expect(task).toBeVisible();

    const taskBox = await task.boundingBox();
    if (!taskBox) throw new Error('Task not found');

    // Start drag
    await page.mouse.move(taskBox.x + taskBox.width / 2, taskBox.y + taskBox.height / 2);
    await page.mouse.down();

    // Move over quadrant 2
    const quadrant2 = page.locator('#quadrant2');
    const quadrant2Box = await quadrant2.boundingBox();
    if (!quadrant2Box) throw new Error('Quadrant 2 not found');

    await page.mouse.move(quadrant2Box.x + 50, quadrant2Box.y + 50);

    // Quadrant should have drop-target class
    await expect(quadrant2).toHaveClass(/drop-target/);

    // Complete drag
    await page.mouse.up();

    // Drop-target class should be removed
    await expect(quadrant2).not.toHaveClass(/drop-target/);
  });

  test('should support keyboard modifiers during drag', async ({ page }) => {
    // Create task
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Modifier Test');
    await page.click('button:has-text("Erstellen")');

    const task = page.locator('.task-item').filter({ hasText: 'Modifier Test' }).first();
    await expect(task).toBeVisible();

    const quadrant4 = page.locator('#quadrant4');

    // Drag with Shift key (if implemented)
    await page.keyboard.down('Shift');
    await task.dragTo(quadrant4);
    await page.keyboard.up('Shift');

    await page.waitForTimeout(500);

    // Verify task moved
    const taskInQuadrant4 = quadrant4.locator('.task-item').filter({ hasText: 'Modifier Test' });
    await expect(taskInQuadrant4).toBeVisible();
  });

  test('should handle rapid consecutive drags', async ({ page }) => {
    // Create multiple tasks
    for (let i = 1; i <= 3; i++) {
      await page.click('#addBtn1');
      await page.fill('#taskTitle', `Rapid Drag ${i}`);
      await page.click('button:has-text("Erstellen")');
      await page.waitForTimeout(300);
    }

    const quadrant2 = page.locator('#quadrant2');

    // Quickly drag all tasks
    for (let i = 1; i <= 3; i++) {
      const task = page.locator('.task-item').filter({ hasText: `Rapid Drag ${i}` }).first();
      await task.dragTo(quadrant2, { targetPosition: { x: 50, y: 50 + i * 60 } });
      await page.waitForTimeout(200);
    }

    // Verify all tasks moved
    for (let i = 1; i <= 3; i++) {
      const taskInQuadrant2 = quadrant2.locator('.task-item').filter({ hasText: `Rapid Drag ${i}` });
      await expect(taskInQuadrant2).toBeVisible();
    }
  });

  test('should cancel drag on Escape key', async ({ page }) => {
    // Create task
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Escape Cancel Test');
    await page.click('button:has-text("Erstellen")');

    const task = page.locator('.task-item').filter({ hasText: 'Escape Cancel Test' }).first();
    await expect(task).toBeVisible();

    // Verify task is in quadrant 1
    const quadrant1 = page.locator('#quadrant1');
    const taskInQuadrant1Before = quadrant1.locator('.task-item').filter({ hasText: 'Escape Cancel Test' });
    await expect(taskInQuadrant1Before).toBeVisible();

    const taskBox = await task.boundingBox();
    if (!taskBox) throw new Error('Task not found');

    // Start drag
    await page.mouse.move(taskBox.x + taskBox.width / 2, taskBox.y + taskBox.height / 2);
    await page.mouse.down();

    // Move to different quadrant
    const quadrant3 = page.locator('#quadrant3');
    const quadrant3Box = await quadrant3.boundingBox();
    if (!quadrant3Box) throw new Error('Quadrant 3 not found');

    await page.mouse.move(quadrant3Box.x + 50, quadrant3Box.y + 50);

    // Press Escape to cancel
    await page.keyboard.press('Escape');

    // Wait a bit
    await page.waitForTimeout(300);

    // Task should still be in original quadrant
    const taskInQuadrant1After = quadrant1.locator('.task-item').filter({ hasText: 'Escape Cancel Test' });
    await expect(taskInQuadrant1After).toBeVisible();

    // Should not be in quadrant 3
    const taskInQuadrant3 = quadrant3.locator('.task-item').filter({ hasText: 'Escape Cancel Test' });
    await expect(taskInQuadrant3).toHaveCount(0);
  });
});
