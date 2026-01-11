/**
 * Authentication Module (Modular SDK) - V2.0 FIXED
 *
 * FIX: Functions registered as globals at module initialization time,
 * BEFORE any other code tries to use them.
 *
 * Handles Firebase Auth and Guest Mode
 * @fileoverview Firebase authentication with modular SDK (fixed)
 * @version 2.0.0
 */

import { auth, googleProvider, appleProvider } from './firebase-init.js';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  setPersistence,
  indexedDBLocalPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import localforage from 'localforage';

// State
let currentUser = null;
let isGuestMode = false;

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
    // FIX: Using popup for all devices (including mobile/TWA)
    // This resolves issues with storage partitioning and ITP in modern browsers
    // where redirect flow loses session state.
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    localStorage.removeItem('auth_is_redirecting');
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
    // FIX: Using popup for all devices (including mobile/TWA)
    await signInWithPopup(auth, appleProvider);
  } catch (error) {
    localStorage.removeItem('auth_is_redirecting');
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
 */
export async function initAuth() {
  const initAuthStart = performance.now();

  // Check sessionStorage availability (non-critical)
  if (!isSessionStorageAvailable()) {
    // OK to continue without sessionStorage
  }

  // FIX: Ensure persistence is set to IndexedDB immediately on initialization
  // This is critical for Android TWA and iOS PWA where localStorage is unreliable
  // or cleared by the OS. This ensures we look in the right place for the session.
  const persistenceStart = performance.now();
  try {
    await setPersistence(auth, indexedDBLocalPersistence);
  } catch (error) {
    console.error('Error setting persistence at init:', error); // debug:
    // Fallback to browserLocalPersistence if IndexedDB fails
    try {
      await setPersistence(auth, browserLocalPersistence);
    } catch (e) {
      console.error('Error setting fallback persistence:', e); // debug:
    }
  }

  // FIX: Direct call to onAuthStateChanged WITHOUT DOMContentLoaded wrapper
  // This ensures the listener is registered immediately when the module loads
  let hasLoggedInOnce = false;

  onAuthStateChanged(auth, async (user) => {
    const authCallbackStart = performance.now();
    currentUser = user;

    if (user) {
      // User is signed in
      hasLoggedInOnce = true;
      isGuestMode = false;
      await localforage.removeItem('guestMode');
      showApp();

      // Call the callback from script.js (ES6 module)
      const callbackStart = performance.now();
      if (typeof window.onAuthStateChanged === 'function') {
        await window.onAuthStateChanged(user, false);
      }
    } else {
      // User is signed out
      // Check if guest mode was active
      try {
        const wasGuestMode = await localforage.getItem('guestMode');
        if (wasGuestMode === 'true') {
          isGuestMode = true;
          showApp();

          // Call the callback from script.js (ES6 module)
          const callbackStart = performance.now();
          if (typeof window.onAuthStateChanged === 'function') {
            await window.onAuthStateChanged(null, true);
          }
        } else {
          // User is signed out and not in guest mode
          isGuestMode = false;
          showLogin();
        }
      } catch (error) {
        isGuestMode = false;
        showLogin();
      }
    }
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
