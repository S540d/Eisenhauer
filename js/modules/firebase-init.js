/**
 * Firebase Modular SDK Initialization
 * Replaces old compat SDK with modern modular imports
 *
 * @fileoverview Firebase v9+ modular SDK setup
 * @version 2.0.0
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Firebase configuration from environment
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

// Set auth persistence to LOCAL (fix for mobile devices)
// This ensures the auth state persists across browser sessions using IndexedDB/localStorage
// instead of sessionStorage which causes issues on mobile browsers (especially iOS Safari)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Failed to set auth persistence:', error);
});

// Configure authentication providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

const appleProvider = new OAuthProvider('apple.com');

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Firestore persistence failed: multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore persistence not supported in this browser');
  }
});

export { app, auth, db, googleProvider, appleProvider };
