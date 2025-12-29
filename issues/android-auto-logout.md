# Android App Auto-Logout Bug (Google Play Store)

## 🐛 Bug Report

### Beschreibung
Die Android App (TWA via Google Play Store) meldet Benutzer automatisch ab, nachdem sie sich erfolgreich angemeldet haben.

### Betroffene Versionen
- Version: 1.7.x
- Platform: Android (TWA - Trusted Web Activity)
- Distribution: Google Play Store

### Funktioniert Korrekt auf
- ✅ Desktop Browser (Chrome, Firefox, Safari)
- ✅ iOS Browser (Safari)
- ✅ iOS PWA (installiert)
- ✅ Local Development Server

### Funktioniert NICHT auf
- ❌ Android App via Google Play Store

---

## 🔍 Root Cause

### Primary Issue: Firebase Auth Persistence
**Location:** `js/modules/auth.js` (Zeilen 64, 93)

```javascript
// PROBLEM: Uses localStorage which is unreliable on Android TWA
await setPersistence(auth, browserLocalPersistence);
```

**Why it fails:**
1. `browserLocalPersistence` verwendet `localStorage` als Backend
2. Android TWA (Trusted Web Activity) hat eingeschränkten localStorage-Zugriff
3. Android killt TWA-Prozesse im Hintergrund aggressiv
4. localStorage-Daten gehen dabei verloren
5. Firebase Auth findet keinen gespeicherten User → Auto-Logout

### Technical Details

#### Android TWA Storage Behavior
```
Background Process Flow:
1. User login → Firebase writes to localStorage
2. User presses Home button → TWA backgrounded
3. Android kills TWA process (after ~30 seconds)
4. localStorage cleared by system
5. User reopens app → Firebase finds no auth token
6. onAuthStateChanged(null) fires → Login screen shown
```

#### Why iOS/Desktop Work
- iOS preserves app memory when backgrounded
- Desktop browsers have generous storage policies
- localStorage persists reliably on these platforms

---

## ✅ Solution

### Recommended Fix: Switch to IndexedDB Persistence

**Change:** `js/modules/auth.js`

```diff
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  setPersistence,
-  browserLocalPersistence,
+  indexedDBLocalPersistence,
} from 'firebase/auth';

async function signInWithGoogle() {
  try {
-    await setPersistence(auth, browserLocalPersistence);
+    await setPersistence(auth, indexedDBLocalPersistence);
    const result = await signInWithPopup(auth, googleProvider);
```

**Apply to:**
- ✅ `signInWithGoogle()` (line 64)
- ✅ `signInWithApple()` (line 93)

### Why IndexedDB?
1. ✅ **Persistent:** Überlebt Android Process Kills
2. ✅ **Reliable:** Funktioniert zuverlässig in TWAs
3. ✅ **Consistent:** App nutzt bereits IndexedDB (localforage) für Tasks
4. ✅ **Larger Quota:** 50MB+ vs 5-10MB für localStorage
5. ✅ **Cross-Platform:** Funktioniert auf Desktop, iOS & Android

---

## 🧪 Testing Checklist

### Local Testing
- [ ] Browser: Login funktioniert
- [ ] Browser: Nach Reload noch eingeloggt
- [ ] DevTools → Application → IndexedDB: `firebaseLocalStorageDb` vorhanden

### Android TWA Testing
- [ ] Install Debug APK: `./gradlew assembleDebug`
- [ ] Login mit Google funktioniert
- [ ] App schließen (nicht minimize)
- [ ] 30 Sekunden warten
- [ ] App wieder öffnen → ✅ Noch eingeloggt
- [ ] Process Kill simulieren: `adb shell am kill com.sven4321.eisenhauer`
- [ ] App wieder öffnen → ✅ Noch eingeloggt

### iOS Testing (Regression)
- [ ] Browser: Login funktioniert
- [ ] PWA: Nach App-Neustart noch eingeloggt

---

## 📊 Impact Analysis

### User Impact
- **Severity:** 🔴 CRITICAL
- **Affected Users:** Alle Android-User (Google Play Store)
- **Frequency:** Nach jedem App-Neustart
- **Workaround:** Keine (außer neu einloggen bei jeder Nutzung)

### Business Impact
- ❌ Play Store Reviews: "App meldet mich ständig ab"
- ❌ User Retention: Benutzer frustriert
- ❌ Competitive Disadvantage: Andere Apps funktionieren

---

## 📝 Implementation Plan

### Phase 1: Code Fix (Estimated: 30 min)
1. Update `js/modules/auth.js`:
   - Import `indexedDBLocalPersistence`
   - Replace `browserLocalPersistence` in beiden Sign-In Funktionen
2. Test locally
3. Commit & Push

### Phase 2: Testing (Estimated: 2 hours)
1. Build Android Debug APK
2. Test auf echtem Android-Gerät
3. Background Kill Test
4. Regression Test (iOS/Desktop)

### Phase 3: Deployment (Estimated: 1 day)
1. Deploy PWA Update (GitHub Pages)
2. Build Android Release AAB
3. Upload zu Play Store
4. Monitor Crash Reports

---

## 🔗 Related Files

- `js/modules/auth.js` - Primary fix location
- `js/modules/firebase-init.js` - Already uses IndexedDB for Firestore
- `js/modules/storage.js` - Already uses localforage (IndexedDB)
- `Android/app/src/main/AndroidManifest.xml` - TWA configuration

---

## 📚 References

### Firebase Documentation
- [Auth State Persistence](https://firebase.google.com/docs/auth/web/auth-state-persistence)
- [IndexedDB Persistence](https://firebase.google.com/docs/reference/js/auth.md#indexeddblocalpersistence)

### Android TWA
- [Trusted Web Activities](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Storage Best Practices](https://developer.chrome.com/docs/android/trusted-web-activity/whats-new/#storage)

### Known Issues
- Chrome Bug #989379: localStorage unreliable in TWAs
- Stack Overflow: "Firebase Auth not persisting in Android TWA"

---

## 🎯 Success Criteria

✅ **Definition of Done:**
1. User kann sich in Android App einloggen
2. User bleibt nach App-Neustart eingeloggt
3. User bleibt nach Background Process Kill eingeloggt
4. Keine Regression auf iOS/Desktop
5. Play Store Update deployed
6. Monitoring: Keine Auth-bezogenen Crashes

---

## 💬 Questions?

Falls Fragen zur Implementierung oder Testing:
- Siehe: `issues/android-crash-analysis.md` für detaillierte technische Analyse
- Firebase Auth Docs: https://firebase.google.com/docs/auth/web/auth-state-persistence

---

**Priority:** 🔴 HIGH  
**Estimated Effort:** 4-6 hours (inkl. Testing)  
**Target Release:** v1.7.2  
**Created:** 2025-12-29
