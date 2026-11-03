/**
 * Firebase Modular SDK Initialization
 * Replaces old compat SDK with modern modular imports
 *
 * @fileoverview Firebase v9+ modular SDK setup
 * @version 2.1.0
 *
 * Environment Isolation:
 * - Production: eisenhauer-matrix (Firebase project)
 * - Testing: no Firebase at all (VITE_DISABLE_CLOUD=true) – the app runs
 *   guest-only with local data, so the testing URL can never touch live data (#406)
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

// Current environment from Vite build
const CURRENT_ENV = import.meta.env.VITE_ENV || 'production';

/** False when the build has no cloud backend (testing deploy): guest mode only (#406) */
export const isCloudEnabled = import.meta.env.VITE_DISABLE_CLOUD !== 'true';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Safeguard: Verify Firebase project matches expected environment
const expectedProjects = {
  production: 'eisenhauer-matrix',
  staging: 'eisenhauer-staging',
  testing: 'eisenhauer-testing',
};

if (
  isCloudEnabled &&
  expectedProjects[CURRENT_ENV] &&
  firebaseConfig.projectId !== expectedProjects[CURRENT_ENV]
) {
  console.warn(
    `⚠️ Firebase project mismatch! Expected "${expectedProjects[CURRENT_ENV]}" for ${CURRENT_ENV}, got "${firebaseConfig.projectId}"`
  );
}

/**
 * SECURITY NOTE:
 * Firebase web API keys are designed to be public (client-side keys).
 * Your app's security is enforced through:
 * 1. ✅ Firebase Security Rules (Firestore/Storage/Database)
 * 2. ✅ Authorized domains in Firebase Console
 * 3. ✅ Optional: Firebase App Check for additional protection
 *
 * These client-side keys are NOT secret. They identify your Firebase project
 * and are meant to be included in client applications.
 *
 * Learn more: https://firebase.google.com/docs/projects/api-keys
 */

// Without a cloud backend all exports stay null; callers already treat a
// missing db/user as guest mode.
let app = null;
let auth = null;
let db = null;
let googleProvider = null;
let appleProvider = null;

if (isCloudEnabled) {
  // Initialize Firebase app
  app = initializeApp(firebaseConfig);

  // Initialize Firebase services
  auth = getAuth(app);

  // Replace deprecated enableIndexedDbPersistence with initializeFirestore + persistentLocalCache
  // Use try-catch to handle case where Firestore was already initialized
  // (can happen with multiple imports in ES modules)
  try {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch (error) {
    if (error.code === 'failed-precondition' || error.message?.includes('already been called')) {
      // Firestore already initialized, use getFirestore instead
      db = getFirestore(app);
    } else {
      throw error;
    }
  }

  // Configure authentication providers
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account',
  });

  appleProvider = new OAuthProvider('apple.com');
}

// Note: Firebase Cloud Storage is intentionally NOT initialized. It requires the
// paid Blaze plan (since October 2024) and this project runs on the free Spark
// plan, so every Storage call failed. Backups live in Firestore instead — see
// js/modules/backup.js and docs/DATENSICHERUNG.md (Issues #359 / #396).

// Note: Firebase Analytics / Google Analytics is intentionally NOT used
// (privacy). Visitor counts are tracked via GitHub Pages Insights instead.

// Export current environment for debugging
/** Current Firebase environment info (env name + project ID), for debugging */
export const firebaseEnvironment = {
  env: CURRENT_ENV,
  projectId: isCloudEnabled ? firebaseConfig.projectId : null,
};

export { app, auth, db, googleProvider, appleProvider };
