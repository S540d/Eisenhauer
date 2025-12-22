// Firebase Configuration Template
// WICHTIG:
// 1. Kopiere diese Datei zu "firebase-config.js"
// 2. Ersetze die Platzhalter mit deinen echten Firebase-Werten
// 3. firebase-config.js wird NICHT zu Git committed (in .gitignore)

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);

// Firebase Services
const auth = firebase.auth();
const db = firebase.firestore();

// Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

const appleProvider = new firebase.auth.OAuthProvider('apple.com');

// Optional: Offline-Persistenz aktivieren
db.enablePersistence()
    .catch((err) => {
        // Handle persistence errors silently
    });
