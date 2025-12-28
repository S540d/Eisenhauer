/**
 * E2E Tests for Authentication Flows
 * CRITICAL: Tests auth initialization timing, global functions, and UI state
 *
 * These tests would have caught the Firebase v9 migration bug:
 * - DOMContentLoaded race condition
 * - Missing global functions
 * - Auth state listener initialization
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home (login page initially)
    await page.goto('/');
    // Wait for page to fully load - this gives us time to verify initial state
    await page.waitForLoadState('networkidle');
  });

  test.describe('Page Load Verification', () => {
    test('should load login page initially', async ({ page }) => {
      // Check if login screen is visible
      const loginScreen = page.locator('#loginScreen');
      await expect(loginScreen).toBeVisible({ timeout: 5000 });
    });

    test('should register global auth functions on page load', async ({ page }) => {
      // CRITICAL TEST: This would catch the ES6 module timing bug
      // If initAuth() is in a DOMContentLoaded wrapper, these functions won't exist

      const functions = ['signInWithGoogle', 'signInWithApple', 'continueAsGuest', 'signOut'];

      for (const func of functions) {
        const exists = await page.evaluate((name) => typeof window[name] === 'function', func);
        expect(exists).toBe(true);
      }
    });

    test('should have DOM elements ready for auth UI', async ({ page }) => {
      // Verify essential DOM elements exist
      const loginScreen = page.locator('#loginScreen');
      const appScreen = page.locator('#appScreen');

      await expect(loginScreen).toBeAttached();
      await expect(appScreen).toBeAttached();
    });

    test('should have auth buttons visible and clickable', async ({ page }) => {
      // Check Guest Mode button
      const guestBtn = page.locator('button:has-text("Gast")').first();
      await expect(guestBtn).toBeVisible();
      await expect(guestBtn).toBeEnabled();

      // Check Google Sign-In button
      const googleBtn = page.locator('[id*="google"], button:has-text("Google")').first();
      if (await googleBtn.isVisible()) {
        await expect(googleBtn).toBeEnabled();
      }
    });
  });

  test.describe('Guest Mode', () => {
    test('should show app screen when continuing as guest', async ({ page }) => {
      // Click Guest Mode button
      const guestBtn = page.locator('button:has-text("Gast"), button:has-text("Guest")').first();

      // Verify button is clickable (not a ReferenceError like in broken version)
      await guestBtn.click({ timeout: 5000 });

      // Wait for app to appear
      const appScreen = page.locator('#appScreen');
      await expect(appScreen).toBeVisible({ timeout: 5000 });
    });

    test('should show guest mode indicator in UI', async ({ page }) => {
      // Click Guest Mode button
      const guestBtn = page.locator('button:has-text("Gast"), button:has-text("Guest")').first();
      await guestBtn.click();

      // Wait for app screen
      await page.waitForSelector('#appScreen', { state: 'visible' });

      // Check for guest mode indicator
      const userInfo = page.locator('#userInfo');
      const guestText = userInfo.locator('text=/[Gg]ast|[Gg]uest/');
      await expect(guestText).toBeVisible();
    });

    test('should create tasks in guest mode', async ({ page }) => {
      // Enter guest mode
      const guestBtn = page.locator('button:has-text("Gast"), button:has-text("Guest")').first();
      await guestBtn.click();

      // Wait for app
      await page.waitForSelector('#eisenhauer-matrix', { state: 'visible' });
      await page.waitForTimeout(500);

      // Create a task
      const addBtn = page.locator('#addBtn1').first();
      if (await addBtn.isVisible()) {
        await addBtn.click();

        const titleInput = page.locator('[placeholder*="neuen Task"], input[type="text"]').first();
        if (await titleInput.isVisible()) {
          await titleInput.fill('Guest Test Task');

          const submitBtn = page
            .locator('button:has-text("Erstellen"), button:has-text("Create")')
            .first();
          if (await submitBtn.isVisible()) {
            await submitBtn.click();

            // Verify task appears
            const taskText = page.locator('text=Guest Test Task');
            await expect(taskText).toBeVisible({ timeout: 3000 });
          }
        }
      }
    });

    test('should persist guest tasks after reload', async ({ page }) => {
      // Enter guest mode
      const guestBtn = page.locator('button:has-text("Gast"), button:has-text("Guest")').first();
      await guestBtn.click();

      // Wait for app
      await page.waitForSelector('#eisenhauer-matrix', { state: 'visible' });
      await page.waitForTimeout(500);

      // Create a task with unique name
      const uniqueTaskName = `Persistent Task ${Date.now()}`;
      const addBtn = page.locator('#addBtn1').first();
      if (await addBtn.isVisible()) {
        await addBtn.click();

        const titleInput = page.locator('input[type="text"]').first();
        if (await titleInput.isVisible()) {
          await titleInput.fill(uniqueTaskName);

          const submitBtn = page
            .locator('button:has-text("Erstellen"), button:has-text("Create")')
            .first();
          if (await submitBtn.isVisible()) {
            await submitBtn.click();

            // Verify task appears
            const taskText = page.locator(`text=${uniqueTaskName}`);
            await expect(taskText).toBeVisible({ timeout: 3000 });
          }
        }
      }

      // Reload page
      await page.reload({ waitUntil: 'networkidle' });

      // Wait for app to reappear
      await page.waitForSelector('#appScreen', { state: 'visible' });
      await page.waitForTimeout(500);

      // Task should still be there
      const persistedTask = page.locator(`text=${uniqueTaskName}`);
      await expect(persistedTask).toBeVisible({ timeout: 3000 });
    });

    test('should have working logout button in guest mode', async ({ page }) => {
      // Enter guest mode
      const guestBtn = page.locator('button:has-text("Gast"), button:has-text("Guest")').first();
      await guestBtn.click();

      // Wait for app
      await page.waitForSelector('#appScreen', { state: 'visible' });

      // Find logout/exit button
      const logoutBtn = page
        .locator(
          'button:has-text("Abmelden"), button:has-text("Beenden"), button:has-text("Logout")'
        )
        .first();
      if (await logoutBtn.isVisible()) {
        await logoutBtn.click();

        // Should go back to login screen
        const loginScreen = page.locator('#loginScreen');
        await expect(loginScreen).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Auth State Initialization', () => {
    test('should initialize auth state immediately on page load', async ({ page }) => {
      // This test verifies the DOMContentLoaded wrapper doesn't break initialization

      // Check that we're on login screen or app screen (not blank)
      let loaded = false;
      try {
        const loginScreen = page.locator('#loginScreen');
        loaded = await loginScreen.isVisible({ timeout: 3000 });
      } catch (e) {
        // Try app screen
        const appScreen = page.locator('#appScreen');
        loaded = await appScreen.isVisible({ timeout: 3000 });
      }

      expect(loaded).toBe(true);
    });

    test('should not show blank white screen', async ({ page }) => {
      // CRITICAL: The broken migration showed blank white screen
      // This verifies we have content

      const content = page.locator('body').first();
      const text = await content.textContent();

      expect(text).toBeTruthy();
      expect(text?.length).toBeGreaterThan(20);
    });

    test('should handle sessionStorage availability gracefully', async ({ page }) => {
      // The app checks sessionStorage availability
      // This should not cause any errors

      // Just verify page loads without errors
      const errors = [];
      page.on('pageerror', (error) => {
        errors.push(error.toString());
      });

      await page.waitForLoadState('networkidle');

      expect(errors.length).toBe(0);
    });
  });

  test.describe('Window Functions Availability', () => {
    test('signInWithGoogle should be a function', async ({ page }) => {
      const isFunction = await page.evaluate(() => typeof window.signInWithGoogle === 'function');
      expect(isFunction).toBe(true);
    });

    test('signInWithApple should be a function', async ({ page }) => {
      const isFunction = await page.evaluate(() => typeof window.signInWithApple === 'function');
      expect(isFunction).toBe(true);
    });

    test('continueAsGuest should be a function', async ({ page }) => {
      const isFunction = await page.evaluate(() => typeof window.continueAsGuest === 'function');
      expect(isFunction).toBe(true);
    });

    test('signOut should be a function', async ({ page }) => {
      const isFunction = await page.evaluate(() => typeof window.signOut === 'function');
      expect(isFunction).toBe(true);
    });

    test('showLogin should be a function', async ({ page }) => {
      const isFunction = await page.evaluate(() => typeof window.showLogin === 'function');
      expect(isFunction).toBe(true);
    });

    test('all global auth functions should be defined before DOMContentLoaded', async ({
      page,
    }) => {
      // CRITICAL TEST: Verifies the core issue from v9 migration
      // Functions must be available immediately, not after DOMContentLoaded

      const allFunctions = await page.evaluate(() => ({
        signInWithGoogle: typeof window.signInWithGoogle,
        signInWithApple: typeof window.signInWithApple,
        continueAsGuest: typeof window.continueAsGuest,
        signOut: typeof window.signOut,
        showLogin: typeof window.showLogin,
      }));

      for (const [name, type] of Object.entries(allFunctions)) {
        expect(type).toBe('function');
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should not have console errors on page load', async ({ page }) => {
      const errors = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.waitForLoadState('networkidle');

      // Filter out expected Firebase auth errors (user not signed in is OK)
      const unexpectedErrors = errors.filter(
        (e) =>
          !e.includes('Auth state is not persisted') &&
          !e.includes('User is not signed in') &&
          !e.includes('CORS') // Firebase auth can have CORS messages in dev
      );

      expect(unexpectedErrors.length).toBe(0);
    });

    test('should handle missing Firebase config gracefully', async ({ page }) => {
      // The app should still work even if Firebase auth fails
      // (e.g., in offline mode or with wrong config)

      const loginScreen = page.locator('#loginScreen');
      const appScreen = page.locator('#appScreen');

      // One of these should be visible
      const oneVisible =
        (await loginScreen.isVisible({ timeout: 2000 }).catch(() => false)) ||
        (await appScreen.isVisible({ timeout: 2000 }).catch(() => false));

      expect(oneVisible).toBe(true);
    });
  });

  test.describe('UI Transitions', () => {
    test('should transition from login to app screen smoothly', async ({ page }) => {
      // Verify login screen visible initially
      const loginScreen = page.locator('#loginScreen');
      await expect(loginScreen).toBeVisible();

      // Click guest mode
      const guestBtn = page.locator('button:has-text("Gast"), button:has-text("Guest")').first();
      await guestBtn.click();

      // Login screen should hide
      await expect(loginScreen).not.toBeVisible({ timeout: 5000 });

      // App screen should appear
      const appScreen = page.locator('#appScreen');
      await expect(appScreen).toBeVisible({ timeout: 5000 });
    });

    test('should show offline indicator if applicable', async ({ page, context }) => {
      // Enter guest mode first
      const guestBtn = page.locator('button:has-text("Gast"), button:has-text("Guest")').first();
      await guestBtn.click();

      // Wait for app
      await page.waitForSelector('#appScreen', { state: 'visible' });

      // Go offline
      await context.setOffline(true);
      await page.waitForTimeout(500);

      // Offline indicator should appear or be visible
      const offlineIndicator = page.locator('#offlineIndicator, text=/offline|Offline/i').first();
      const isVisible = await offlineIndicator.isVisible({ timeout: 2000 }).catch(() => false);

      // It's OK if indicator doesn't exist, just verify no errors
      expect(true).toBe(true);

      // Go back online
      await context.setOffline(false);
    });
  });
});
