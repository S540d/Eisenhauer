/**
 * Firebase Modular SDK Initialization
 * Replaces old compat SDK with modern modular imports
 *
 * @fileoverview Firebase v9+ modular SDK setup
 * @version 2.0.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

// DEBUG: Start timing Firebase initialization
const DEBUG_START = performance.now();
console.log('[DEBUG] 🔧 firebase-init.js: Module loading started');

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

console.log('[DEBUG] 🔧 Firebase Config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

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
console.log('[DEBUG] 🔧 Initializing Firebase App...');
const appInitStart = performance.now();
const app = initializeApp(firebaseConfig);
console.log(
  `[DEBUG] ✅ Firebase App initialized in ${(performance.now() - appInitStart).toFixed(2)}ms`
);

// Initialize Firebase services
console.log('[DEBUG] 🔧 Initializing Auth...');
const authInitStart = performance.now();
const auth = getAuth(app);
console.log(`[DEBUG] ✅ Auth initialized in ${(performance.now() - authInitStart).toFixed(2)}ms`);

// Replace deprecated enableIndexedDbPersistence with initializeFirestore + persistentLocalCache
console.log('[DEBUG] 🔧 Initializing Firestore with persistent cache...');
const dbInitStart = performance.now();
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
console.log(
  `[DEBUG] ✅ Firestore initialized in ${(performance.now() - dbInitStart).toFixed(2)}ms`
);

// Configure authentication providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

const appleProvider = new OAuthProvider('apple.com');

console.log(
  `[DEBUG] 🎉 Total firebase-init.js execution time: ${(performance.now() - DEBUG_START).toFixed(2)}ms`
);

export { app, auth, db, googleProvider, appleProvider };
