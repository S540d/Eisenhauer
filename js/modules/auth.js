/**
 * Authentication Module (Modular SDK) - V2.0 FIXED
 *
 * FIX: Functions registered as globals at module initialization time,
 * BEFORE any other code tries to use them.
 *
 * Handles Firebase Auth and Guest Mode
 * Enhanced with Session Recovery Fallback Mechanism
 * @fileoverview Firebase authentication with modular SDK (fixed)
 * @version 2.1.0
 */

import { auth, googleProvider, appleProvider } from './firebase-init.js';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  setPersistence,
  indexedDBLocalPersistence,
} from 'firebase/auth';
import localforage from 'localforage';
import { sessionManager, LOGOUT_REASONS } from './session-manager.js';
import { showWarning, showInfo } from './notifications.js';

// State
let currentUser = null;
let isGuestMode = false;
let authStateInitialized = false;

// UI Functions (implementations)
function showLogin() {
  const loginScreen = document.getElementById('loginScreen');
  const appScreen = document.getElementById('appScreen');
  if (loginScreen) loginScreen.style.display = 'flex';
  if (appScreen) appScreen.style.display = 'none';
}

function showApp() {
  const loginScreen = document.getElementById('loginScreen');
  const appScreen = document.getElementById('appScreen');
  if (loginScreen) loginScreen.style.display = 'none';
  if (appScreen) appScreen.style.display = 'flex';

  // Clear user info - no avatar or email shown in header
  // All user information is shown in Settings Modal instead
  const userInfo = document.getElementById('userInfo');
  if (userInfo) {
    userInfo.textContent = '';
  }
}

// Check if sessionStorage is available
function isSessionStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    sessionStorage.setItem(testKey, 'test');
    sessionStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

// Sign-in functions
async function signInWithGoogle() {
  try {
    // Ensure persistence is set to IndexedDB before sign-in (fix for mobile)
    await setPersistence(auth, indexedDBLocalPersistence);

    // Use redirect for mobile/TWA, popup for desktop
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.matchMedia('(display-mode: standalone)').matches;

    if (isMobile) {
      await signInWithRedirect(auth, googleProvider);
    } else {
      await signInWithPopup(auth, googleProvider);
    }
  } catch (error) {
    // Handle auth errors with session manager
    handleAuthError(error);

    if (
      error.code === 'auth/cancelled-popup-request' ||
      error.code === 'auth/popup-closed-by-user'
    ) {
      return;
    }

    if (error.message && error.message.includes('missing initial state')) {
      alert(
        'Anmeldefehler: Die Anmeldung konnte nicht abgeschlossen werden.\n\n' +
          'Mögliche Lösungen:\n' +
          '1. Aktivieren Sie Cookies in Ihren Browser-Einstellungen\n' +
          '2. Deaktivieren Sie "Cross-Site-Tracking verhindern" (Safari)\n' +
          '3. Versuchen Sie es im Inkognito-/Privat-Modus\n' +
          '4. Leeren Sie den Browser-Cache und versuchen Sie es erneut\n\n' +
          'Alternativ können Sie die App im Gastmodus ohne Anmeldung testen.'
      );
    } else {
      alert('Fehler beim Anmelden mit Google: ' + error.message);
    }
  }
}

async function signInWithApple() {
  try {
    // Ensure persistence is set to IndexedDB before sign-in (fix for mobile)
    await setPersistence(auth, indexedDBLocalPersistence);

    // Use redirect for mobile/TWA, popup for desktop
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.matchMedia('(display-mode: standalone)').matches;

    if (isMobile) {
      await signInWithRedirect(auth, appleProvider);
    } else {
      await signInWithPopup(auth, appleProvider);
    }
  } catch (error) {
    // Handle auth errors with session manager
    handleAuthError(error);

    if (
      error.code === 'auth/cancelled-popup-request' ||
      error.code === 'auth/popup-closed-by-user'
    ) {
      return;
    }

    if (error.message && error.message.includes('missing initial state')) {
      alert(
        'Anmeldefehler: Die Anmeldung konnte nicht abgeschlossen werden.\n\n' +
          'Mögliche Lösungen:\n' +
          '1. Aktivieren Sie Cookies in Ihren Browser-Einstellungen\n' +
          '2. Deaktivieren Sie "Cross-Site-Tracking verhindern" (Safari)\n' +
          '3. Versuchen Sie es im Inkognito-/Privat-Modus\n' +
          '4. Leeren Sie den Browser-Cache und versuchen Sie es erneut\n\n' +
          'Alternativ können Sie die App im Gastmodus ohne Anmeldung testen.'
      );
    } else {
      alert('Fehler beim Anmelden mit Apple: ' + error.message);
    }
  }
}

// Sign out
async function signOut() {
  try {
    const wasGuestMode = isGuestMode;

    // Notify session manager about user-initiated logout
    await sessionManager.handleUserLogout();

    // Clear guest mode flag BEFORE signing out
    await localforage.removeItem('guestMode');
    isGuestMode = false;

    // For guest mode: show login screen immediately (no Firebase to sign out from)
    if (wasGuestMode) {
      showLogin();
      // Close settings modal after sign-out
      const settingsModal = document.getElementById('settingsModal');
      if (settingsModal) {
        settingsModal.style.display = 'none';
      }
    } else {
      // For Firebase users: sign out (triggers onAuthStateChanged)
      await firebaseSignOut(auth);
    }
  } catch (error) {
    alert('Fehler beim Abmelden: ' + error.message);
  }
}

// Guest mode
async function continueAsGuest() {
  isGuestMode = true;
  await localforage.setItem('guestMode', 'true');

  // Request persistent storage
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persist();
  }

  showApp();

  // Call the callback from script.js (ES6 module)
  if (typeof window.onAuthStateChanged === 'function') {
    await window.onAuthStateChanged(null, true);
  }
}

/**
 * Initialize authentication module
 * FIX V2: NO DOMContentLoaded wrapper
 * ES6 modules load asynchronously, DOMContentLoaded might fire before the module loads
 * Solution: Initialize immediately without event listener wrapper
 * Enhanced with Session Recovery Mechanism
 */
export async function initAuth() {
  // Check sessionStorage availability (non-critical)
  if (!isSessionStorageAvailable()) {
    // OK to continue without sessionStorage
  }

  // Initialize session manager with recovery callbacks (await to prevent race conditions)
  await sessionManager.initialize({
    onRecovery: () => {
      showInfo('Sitzung wiederhergestellt', 3000);
      console.log('[Auth] Session recovered successfully');
    },
    onLogout: () => {
      console.log('[Auth] User logout processed');
    },
  });

  // Handle redirect result (for mobile/TWA)
  getRedirectResult(auth).catch((error) => {
    console.error('Error getting redirect result:', error);
    handleAuthError(error);
  });

  // FIX: Direct call to onAuthStateChanged WITHOUT DOMContentLoaded wrapper
  // This ensures the listener is registered immediately when the module loads
  // Enhanced with logout validation and session recovery
  onAuthStateChanged(auth, async (user) => {
    const previousUser = currentUser;
    currentUser = user;

    if (user) {
      // User is signed in - save auth state
      isGuestMode = false;
      await localforage.removeItem('guestMode');

      // Save session state for recovery
      await sessionManager.saveAuthState(user, false);

      showApp();

      // Call the callback from script.js (ES6 module)
      if (typeof window.onAuthStateChanged === 'function') {
        await window.onAuthStateChanged(user, false);
      }

      authStateInitialized = true;
    } else {
      // User is null - determine if logout is expected or unexpected

      // Check if guest mode was active
      try {
        const wasGuestMode = await localforage.getItem('guestMode');
        if (wasGuestMode === 'true') {
          isGuestMode = true;

          // Save guest session state
          await sessionManager.saveAuthState(null, true);

          showApp();

          // Call the callback from script.js (ES6 module)
          if (typeof window.onAuthStateChanged === 'function') {
            await window.onAuthStateChanged(null, true);
          }

          authStateInitialized = true;
        } else {
          // Not in guest mode and no user - validate logout
          if (authStateInitialized && previousUser) {
            // This is a logout event after being authenticated
            await handleLogoutEvent(previousUser);
          } else {
            // Initial load - no user logged in
            isGuestMode = false;
            showLogin();
            authStateInitialized = true;
          }
        }
      } catch (error) {
        console.error('Error checking guest mode:', error);
        isGuestMode = false;
        showLogin();
        authStateInitialized = true;
      }
    }
  });
}

/**
 * Handle logout event - validate and potentially recover session
 * @param {Object} previousUser - User who was logged out
 */
async function handleLogoutEvent(previousUser) {
  console.log('[Auth] Logout event detected for user:', previousUser.uid);

  // Determine logout reason
  const logoutReason = await determineLogoutReason();

  // Validate the logout
  const validation = await sessionManager.validateLogout(logoutReason.reason, logoutReason.error);

  if (validation.shouldRecover) {
    console.log('[Auth] Unexpected logout detected, attempting recovery...');

    showWarning('Verbindung verloren. Versuche Sitzung wiederherzustellen...', {
      duration: 5000,
    });

    // Attempt to recover the session
    const recovered = await sessionManager.attemptRecovery(async () => {
      try {
        // Try to restore the session with Firebase
        // Check if auth token is still valid
        const currentUser = auth.currentUser;
        if (currentUser) {
          console.log('[Auth] User still authenticated, no recovery needed');
          return true;
        }

        // If network error, wait for connection to be restored
        if (logoutReason.reason === LOGOUT_REASONS.NETWORK_ERROR) {
          console.log('[Auth] Network error, waiting for connection...');
          return false; // Will retry on next attempt
        }

        console.log('[Auth] Unable to recover session automatically');
        return false;
      } catch (error) {
        console.error('[Auth] Recovery attempt failed:', error);
        return false;
      }
    });

    if (!recovered) {
      console.log('[Auth] Session recovery failed, showing login screen');
      showWarning(
        'Sitzung konnte nicht wiederhergestellt werden. Bitte melden Sie sich erneut an.',
        { duration: 5000 }
      );
      isGuestMode = false;
      showLogin();
      authStateInitialized = true;
    }
  } else {
    // Legitimate logout - proceed normally
    console.log('[Auth] Legitimate logout, showing login screen');
    isGuestMode = false;
    showLogin();
    authStateInitialized = true;
  }
}

/**
 * Determine the reason for logout
 * @returns {Promise<Object>} Logout reason and error
 */
async function determineLogoutReason() {
  // Check stored logout reason from session manager
  const storedReason = await localforage.getItem('session_logout_reason');

  if (storedReason && Date.now() - storedReason.timestamp < 5000) {
    // Recent logout reason found (within 5 seconds)
    return {
      reason: storedReason.reason,
      error: storedReason.error || null,
    };
  }

  // Check network connectivity
  if (!navigator.onLine) {
    return {
      reason: LOGOUT_REASONS.NETWORK_ERROR,
      error: new Error('Network offline'),
    };
  }

  // Check for auth errors
  try {
    const user = auth.currentUser;
    if (user) {
      // User is still authenticated in Firebase
      return {
        reason: LOGOUT_REASONS.UNEXPECTED,
        error: new Error('User authenticated but logout event fired'),
      };
    }
  } catch (error) {
    return {
      reason: LOGOUT_REASONS.AUTH_ERROR,
      error,
    };
  }

  // Default to unexpected logout
  return {
    reason: LOGOUT_REASONS.UNEXPECTED,
    error: null,
  };
}

/**
 * Handle authentication errors
 * @param {Error} error - Authentication error
 */
function handleAuthError(error) {
  console.error('[Auth] Authentication error:', error);

  // Store error for logout validation
  localforage.setItem('session_logout_reason', {
    reason: LOGOUT_REASONS.AUTH_ERROR,
    error: error.message,
    timestamp: Date.now(),
  });
}

// ============================================
// REGISTER GLOBAL FUNCTIONS AT MODULE LOAD TIME
// ============================================
// Register actual implementations with _ prefix (for wrapper functions)
// Wrapper functions in index.html ensure onclick handlers work even if module loads slowly
window._signInWithGoogle = signInWithGoogle;
window._signInWithApple = signInWithApple;
window._continueAsGuest = continueAsGuest;
window._signOut = signOut;
window.showLogin = showLogin;
window.showApp = showApp;

// Export for module usage
export {
  currentUser,
  isGuestMode,
  signInWithGoogle,
  signInWithApple,
  continueAsGuest,
  signOut,
  showLogin,
  showApp,
};
