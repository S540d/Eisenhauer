/**
 * Authentication Module (Modular SDK)
 * Handles Firebase Auth and Guest Mode
 *
 * @fileoverview Firebase authentication with modular SDK
 * @version 2.0.0
 */

import { auth, db, googleProvider, appleProvider } from './firebase-init.js';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  deleteField,
} from 'firebase/firestore';

// State
let currentUser = null;
let isGuestMode = false;

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

/**
 * Initialize authentication module
 * Sets up Firebase Auth state listener and UI
 */
export function initAuth() {
  // Check sessionStorage availability
  if (!isSessionStorageAvailable()) {
    // Handle if needed
  }

  // Auth State Observer (Modular SDK)
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

// Google Sign-In
let isSigningIn = false;

async function signInWithGoogle() {
  if (isSigningIn) {
    return;
  }

  isSigningIn = true;
  const googleBtn = document.getElementById('googleSignInBtn');
  if (googleBtn) googleBtn.disabled = true;

  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Optional: Migrate local data on first login
    await migrateLocalData(result.user.uid);
  } catch (error) {
    // Handle specific error cases
    if (
      error.code === 'auth/cancelled-popup-request' ||
      error.code === 'auth/popup-closed-by-user'
    ) {
      // User closed popup - no error message needed
      return;
    }

    // Handle "missing initial state" error with helpful message
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
  } finally {
    isSigningIn = false;
    if (googleBtn) googleBtn.disabled = false;
  }
}

// Apple Sign-In
async function signInWithApple() {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    // Optional: Migrate local data on first login
    await migrateLocalData(result.user.uid);
  } catch (error) {
    // Handle specific error cases
    if (
      error.code === 'auth/cancelled-popup-request' ||
      error.code === 'auth/popup-closed-by-user'
    ) {
      // User closed popup - no error message needed
      return;
    }

    // Handle "missing initial state" error with helpful message
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

// Sign Out
async function signOut() {
  try {
    // Clear guest mode flag BEFORE signing out
    await localforage.removeItem('guestMode');
    isGuestMode = false;

    // Sign out - this will trigger onAuthStateChanged
    await firebaseSignOut(auth);
  } catch (error) {
    alert('Fehler beim Abmelden: ' + error.message);
  }
}

// Migrate local data to Firestore (one-time on first login)
async function migrateLocalData(userId) {
  try {
    // Try to get data from IndexedDB (new method)
    let tasksData = await localforage.getItem('eisenhauerTasks');

    // Fallback to old localStorage for migration
    if (!tasksData) {
      const localTasks = localStorage.getItem('eisenhauerTasks');
      if (localTasks) {
        tasksData = JSON.parse(localTasks);
      }
    }

    if (!tasksData) return;

    const batch = writeBatch(db);

    Object.keys(tasksData).forEach((segmentId) => {
      tasksData[segmentId].forEach((task) => {
        const docRef = doc(db, 'users', userId, 'tasks', task.id.toString());

        batch.set(docRef, {
          text: task.text,
          segment: task.segment,
          checked: task.checked,
          createdAt: serverTimestamp(),
        });
      });
    });

    await batch.commit();
    // Clear both storage methods after migration
    await localforage.removeItem('eisenhauerTasks');
    localStorage.removeItem('eisenhauerTasks');
  } catch (error) {
    console.error('Migration error:', error);
  }
}

// Guest Mode (IndexedDB via localForage)
async function continueAsGuest() {
  isGuestMode = true;
  await localforage.setItem('guestMode', 'true');

  // Request persistent storage to prevent data loss
  if (navigator.storage && navigator.storage.persist) {
    await navigator.storage.persist();
  }

  showApp();

  // Call the callback from script.js (ES6 module)
  if (typeof window.onAuthStateChanged === 'function') {
    await window.onAuthStateChanged(null, true);
  }
}

async function saveGuestTasks() {
  if (isGuestMode) {
    try {
      await localforage.setItem('eisenhauerTasks', tasks);
    } catch (error) {
      console.error('Error saving guest tasks:', error);
    }
  }
}

// UI Functions
function showLogin() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('appScreen').style.display = 'none';
}

function showApp() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appScreen').style.display = 'flex';

  // Update user info
  if (currentUser) {
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
      userInfo.textContent = ''; // Clear existing content

      // Create elements safely (prevents XSS)
      const avatar = document.createElement('img');
      avatar.src = currentUser.photoURL || 'icons/icon-72x72.png';
      avatar.alt = 'User';
      avatar.className = 'user-avatar';

      const email = document.createElement('span');
      email.className = 'user-email';
      email.textContent = currentUser.email || 'User';

      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'logout-btn';
      logoutBtn.textContent = 'Abmelden';
      logoutBtn.onclick = signOut;

      userInfo.appendChild(avatar);
      userInfo.appendChild(email);
      userInfo.appendChild(logoutBtn);
    }
  } else if (isGuestMode) {
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
      userInfo.textContent = ''; // Clear existing content

      const guestLabel = document.createElement('span');
      guestLabel.className = 'user-email';
      guestLabel.textContent = 'Gastmodus (Lokal gespeichert)';

      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'logout-btn';
      logoutBtn.textContent = 'Beenden';
      logoutBtn.onclick = async () => {
        isGuestMode = false;
        await localforage.removeItem('guestMode');
        showLogin();
      };

      userInfo.appendChild(guestLabel);
      userInfo.appendChild(logoutBtn);
    }
  }
}

// Make functions global for HTML onclick handlers
window.signInWithGoogle = signInWithGoogle;
window.signInWithApple = signInWithApple;
window.continueAsGuest = continueAsGuest;
window.signOut = signOut;
window.showLogin = showLogin;

// Export functions
export {
  initAuth,
  signInWithGoogle,
  signInWithApple,
  signOut,
  continueAsGuest,
  saveGuestTasks,
  showApp,
  currentUser,
  isGuestMode,
};
