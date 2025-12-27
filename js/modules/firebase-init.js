/**
 * Firebase Modular SDK Initialization
 * Replaces old compat SDK with modern modular imports
 *
 * @fileoverview Firebase v9+ modular SDK setup
 * @version 2.0.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Firebase configuration from environment
// These values are hardcoded for now, but build-config.js can be updated
// to generate a separate config file if needed
const firebaseConfig = {
  apiKey: 'AIzaSyDVZh7wLZeFXpoxIqwKFtC8KsYj9zF6lBM',
  authDomain: 'eisenhauer-matrix.firebaseapp.com',
  projectId: 'eisenhauer-matrix',
  storageBucket: 'eisenhauer-matrix.firebasestorage.app',
  messagingSenderId: '174175941071',
  appId: '1:174175941071:web:80d5a25ed700b99809e2ba',
  measurementId: 'G-VY3618D2RT',
};

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
const db = getFirestore(app);

// Configure authentication providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

const appleProvider = new OAuthProvider('apple.com');

// Enable Firestore offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time
    console.warn('Firestore persistence failed: multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // Browser doesn't support persistence
    console.warn('Firestore persistence not supported in this browser');
  }
});

// Export initialized services and providers
export { app, auth, db, googleProvider, appleProvider };
