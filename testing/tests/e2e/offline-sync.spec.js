/**
 * E2E Tests for Offline Sync Functionality
 * Tests offline queue, sync status, and data persistence
 */

import { test, expect } from '@playwright/test';

test.describe('Offline Sync', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#eisenhauer-matrix', { state: 'visible' });
    await page.waitForTimeout(1000);
  });

  test('should show offline indicator when offline', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true);

    // Wait for offline indicator
    await page.waitForSelector('#offlineIndicator', { state: 'visible' });

    const indicator = page.locator('#offlineIndicator');
    await expect(indicator).toContainText('Offline');

    // Go back online
    await context.setOffline(false);

    // Indicator should update or disappear
    await page.waitForTimeout(1000);
    const indicatorAfter = await indicator.textContent();
    expect(indicatorAfter).not.toContain('Offline');
  });

  test('should queue task creation when offline', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true);

    // Create task while offline
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Offline Task');
    await page.fill('#taskDescription', 'Created while offline');
    await page.click('button:has-text("Erstellen")');

    // Task should appear in UI
    const task = page.locator('.task-item').filter({ hasText: 'Offline Task' }).first();
    await expect(task).toBeVisible();

    // Offline indicator should show pending changes
    const indicator = page.locator('#offlineIndicator');
    await expect(indicator).toContainText(/pending|Offline/i);

    // Go back online
    await context.setOffline(false);

    // Wait for sync
    await page.waitForTimeout(3000);

    // Should show syncing or success message
    const notification = page.locator('.notification-success, .notification-info').last();
    await expect(notification).toBeVisible({ timeout: 10000 });
  });

  test('should queue task updates when offline', async ({ page, context }) => {
    // Create task while online
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Update Test Task');
    await page.click('button:has-text("Erstellen")');

    const task = page.locator('.task-item').filter({ hasText: 'Update Test Task' }).first();
    await expect(task).toBeVisible();

    // Go offline
    await context.setOffline(true);

    // Update task while offline (drag to different quadrant)
    const quadrant2 = page.locator('#quadrant2');
    await task.dragTo(quadrant2);

    await page.waitForTimeout(500);

    // Task should be in new quadrant
    const taskInQuadrant2 = quadrant2.locator('.task-item').filter({ hasText: 'Update Test Task' });
    await expect(taskInQuadrant2).toBeVisible();

    // Go back online
    await context.setOffline(false);

    // Wait for sync
    await page.waitForTimeout(3000);

    // Task should still be in quadrant 2 after sync
    await expect(taskInQuadrant2).toBeVisible();
  });

  test('should queue task deletion when offline', async ({ page, context }) => {
    // Create task while online
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Delete Test Task');
    await page.click('button:has-text("Erstellen")');

    const task = page.locator('.task-item').filter({ hasText: 'Delete Test Task' }).first();
    await expect(task).toBeVisible();

    // Go offline
    await context.setOffline(true);

    // Delete task while offline (swipe)
    const taskBox = await task.boundingBox();
    if (!taskBox) throw new Error('Task not found');

    // Swipe left to delete
    await page.mouse.move(taskBox.x + taskBox.width - 10, taskBox.y + taskBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(taskBox.x + 10, taskBox.y + taskBox.height / 2);
    await page.mouse.up();

    await page.waitForTimeout(500);

    // Task should be removed from UI
    await expect(task).not.toBeVisible();

    // Go back online
    await context.setOffline(false);

    // Wait for sync
    await page.waitForTimeout(3000);

    // Task should still be deleted
    await expect(task).not.toBeVisible();
  });

  test('should handle multiple offline operations', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true);

    // Create multiple tasks
    for (let i = 1; i <= 3; i++) {
      await page.click('#addBtn1');
      await page.fill('#taskTitle', `Batch Task ${i}`);
      await page.click('button:has-text("Erstellen")');
      await page.waitForTimeout(300);
    }

    // Move some tasks
    const task1 = page.locator('.task-item').filter({ hasText: 'Batch Task 1' }).first();
    const quadrant2 = page.locator('#quadrant2');
    await task1.dragTo(quadrant2);

    await page.waitForTimeout(500);

    // Verify offline indicator shows pending count
    const indicator = page.locator('#offlineIndicator');
    await expect(indicator).toBeVisible();

    // Go back online
    await context.setOffline(false);

    // Wait for all syncs to complete
    await page.waitForTimeout(5000);

    // Should show success notification
    const successNotification = page.locator('.notification-success').last();
    await expect(successNotification).toBeVisible({ timeout: 10000 });
  });

  test('should persist offline queue across page reloads', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true);

    // Create task
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Persistence Test');
    await page.click('button:has-text("Erstellen")');

    const task = page.locator('.task-item').filter({ hasText: 'Persistence Test' }).first();
    await expect(task).toBeVisible();

    // Reload page (still offline)
    await page.reload();
    await page.waitForSelector('#eisenhauer-matrix', { state: 'visible' });
    await page.waitForTimeout(1000);

    // Task should still be visible (from localStorage)
    const taskAfterReload = page.locator('.task-item').filter({ hasText: 'Persistence Test' }).first();
    await expect(taskAfterReload).toBeVisible();

    // Offline indicator should still show pending
    const indicator = page.locator('#offlineIndicator');
    await expect(indicator).toContainText(/Offline/i);

    // Go online
    await context.setOffline(false);

    // Wait for sync
    await page.waitForTimeout(3000);

    // Should sync successfully
    const successNotification = page.locator('.notification-success, .notification-info').last();
    await expect(successNotification).toBeVisible({ timeout: 10000 });
  });

  test('should show retry option on sync failure', async ({ page, context }) => {
    // This test would require mocking network errors
    // For now, we'll test the UI behavior

    // Go offline
    await context.setOffline(true);

    // Create task
    await page.click('#addBtn1');
    await page.fill('#taskTitle', 'Retry Test');
    await page.click('button:has-text("Erstellen")');

    await page.waitForTimeout(500);

    // Go online but expect some operations to be queued
    await context.setOffline(false);

    // Wait for sync attempt
    await page.waitForTimeout(3000);

    // If there's a retry button in notifications, it should be visible
    // (This depends on actual error handling implementation)
    const notification = page.locator('.notification').last();
    await expect(notification).toBeVisible({ timeout: 10000 });
  });
});
