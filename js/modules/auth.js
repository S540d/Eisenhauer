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

import { auth, db, googleProvider, appleProvider } from './firebase-init.js';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
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

  // Update user info - show avatar and email only for Firebase authenticated users
  // Logout buttons are shown in Settings Modal instead
  if (currentUser) {
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
      userInfo.textContent = '';

      // Create elements safely (prevents XSS)
      const avatar = document.createElement('img');
      avatar.src = currentUser.photoURL || 'icons/icon-72x72.png';
      avatar.alt = 'User';
      avatar.className = 'user-avatar';

      const email = document.createElement('span');
      email.className = 'user-email';
      email.textContent = currentUser.email || 'User';

      userInfo.appendChild(avatar);
      userInfo.appendChild(email);
    }
  } else if (isGuestMode) {
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
      userInfo.textContent = '';

      const guestLabel = document.createElement('span');
      guestLabel.className = 'user-email';
      guestLabel.textContent = 'Gastmodus (Lokal gespeichert)';

      userInfo.appendChild(guestLabel);
    }
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
    const result = await signInWithPopup(auth, googleProvider);
    // Optional: Migrate local data on first login
    if (typeof window.migrateLocalData === 'function') {
      await window.migrateLocalData(result.user.uid);
    }
  } catch (error) {
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
    const result = await signInWithPopup(auth, appleProvider);
    // Optional: Migrate local data on first login
    if (typeof window.migrateLocalData === 'function') {
      await window.migrateLocalData(result.user.uid);
    }
  } catch (error) {
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
    // Clear guest mode flag BEFORE signing out
    await localforage.removeItem('guestMode');
    isGuestMode = false;

    // Sign out (triggers onAuthStateChanged)
    await firebaseSignOut(auth);
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
export function initAuth() {
  // Check sessionStorage availability (non-critical)
  if (!isSessionStorageAvailable()) {
    // OK to continue without sessionStorage
  }

  // FIX: Direct call to onAuthStateChanged WITHOUT DOMContentLoaded wrapper
  // This ensures the listener is registered immediately when the module loads
  onAuthStateChanged(auth, async (user) => {
    currentUser = user;

    if (user) {
      // User is signed in
      isGuestMode = false;
      await localforage.removeItem('guestMode');
      showApp();

      // Call the callback from script.js (ES6 module)
      if (typeof window.onAuthStateChanged === 'function') {
        await window.onAuthStateChanged(user, false);
      }
    } else {
      // Check if guest mode was active
      const wasGuestMode = await localforage.getItem('guestMode');
      if (wasGuestMode === 'true') {
        isGuestMode = true;
        showApp();

        // Call the callback from script.js (ES6 module)
        if (typeof window.onAuthStateChanged === 'function') {
          await window.onAuthStateChanged(null, true);
        }
      } else {
        // User is signed out and not in guest mode
        isGuestMode = false;
        showLogin();
      }
    }
  });
}

// ============================================
// FIX V2 CRITICAL: REGISTER GLOBAL FUNCTIONS AT MODULE LOAD TIME
// ============================================
// These must be available IMMEDIATELY when the module loads,
// BEFORE any onclick handlers or other code tries to use them.
// Do NOT wrap in DOMContentLoaded, setTimeout, or any async operation.
window.signInWithGoogle = signInWithGoogle;
window.signInWithApple = signInWithApple;
window.continueAsGuest = continueAsGuest;
window.signOut = signOut;
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
