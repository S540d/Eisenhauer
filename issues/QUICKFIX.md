# Android App Fix - Quick Reference

## 🎯 Problem
Android App (Play Store) meldet Benutzer automatisch ab nach Login.

## 🔍 Root Cause
`browserLocalPersistence` verwendet localStorage, welches in Android TWAs unreliable ist.

## ✅ Solution
Wechsel zu `indexedDBLocalPersistence` (2 Zeilen ändern)

## 📝 Change Required

**File:** `js/modules/auth.js`

**Lines to Change:**
- Line 64 (in `signInWithGoogle`)
- Line 93 (in `signInWithApple`)

**Change:**
```diff
- import { browserLocalPersistence } from 'firebase/auth';
+ import { indexedDBLocalPersistence } from 'firebase/auth';

- await setPersistence(auth, browserLocalPersistence);
+ await setPersistence(auth, indexedDBLocalPersistence);
```

## 🧪 Testing
```bash
# 1. Local
npm run dev
# Login → Reload → Should stay logged in

# 2. Android
cd Android
./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
# Login → Close → Reopen → Should stay logged in
```

## 📋 Full Documentation
- Technical Analysis: `issues/android-crash-analysis.md`
- GitHub Issue Template: `issues/android-auto-logout.md`

## ⏱️ Estimated Effort
- Code Change: 5 minutes
- Testing: 2 hours
- Deployment: 1 day
- **Total: ~4-6 hours**

## 🚀 Priority
🔴 HIGH - Affects all Android users

---

**Status:** Analysis Complete - Ready for Implementation  
**Created:** 2025-12-29
