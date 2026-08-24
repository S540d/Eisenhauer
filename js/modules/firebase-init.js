/**
 * Firebase Modular SDK Initialization
 * Replaces old compat SDK with modern modular imports
 *
 * @fileoverview Firebase v9+ modular SDK setup
 * @version 2.1.0
 *
 * Environment Isolation:
 * - Production: eisenhauer-matrix (Firebase project)
 * - Staging: eisenhauer-staging (Firebase project)
 * - Testing: eisenhauer-testing (Firebase project)
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Current environment from Vite build
const CURRENT_ENV = import.meta.env.VITE_ENV || 'production';

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

if (expectedProjects[CURRENT_ENV] && firebaseConfig.projectId !== expectedProjects[CURRENT_ENV]) {
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

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);

// Replace deprecated enableIndexedDbPersistence with initializeFirestore + persistentLocalCache
// Use try-catch to handle case where Firestore was already initialized
// (can happen with multiple imports in ES modules)
let db;
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
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

const appleProvider = new OAuthProvider('apple.com');

// Initialize Firebase Storage
const storage = getStorage(app);

// Note: Firebase Analytics / Google Analytics is intentionally NOT used
// (privacy). Visitor counts are tracked via GitHub Pages Insights instead.

// Export current environment for debugging
/** Current Firebase environment info (env name + project ID), for debugging */
export const firebaseEnvironment = {
  env: CURRENT_ENV,
  projectId: firebaseConfig.projectId,
};

export { app, auth, db, storage, googleProvider, appleProvider };
