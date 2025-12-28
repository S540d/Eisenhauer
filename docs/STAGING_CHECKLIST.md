# Staging Testing Checklist - Firebase v9 V2

**Branch:** feature/firebase-v9-v2
**Deploying to:** staging
**Duration:** 24-48 hours minimum before main merge

## Pre-Deployment Requirements

### Code Quality
- [x] Unit tests: 68/68 passing
- [x] E2E tests: auth-flow.spec.js passing
- [x] Smoke tests: 5/5 passing
- [x] Pre-commit checks: Prettier, ESLint passing
- [x] No console.log statements remaining
- [x] No TODO comments in critical code

### Documentation
- [x] README updated with new Firebase setup
- [x] Deployment guide created (FIREBASE_V9_DEPLOYMENT.md)
- [x] Rollback procedures documented (ROLLBACK.md)
- [x] Code comments explain critical changes

---

## Deployment Day Testing

### 1. Initial Load Test (5 min)
**Goal:** Verify app loads, no white screen

```
□ Open staging URL in incognito window
□ Wait for page to fully load (check Network tab)
□ Browser Console: Should be EMPTY or only Firebase warnings
□ Page shows login screen (not blank white)
□ All buttons visible: "Gast", "Google", "Apple"
```

**Expected Result:**
- ✅ Login screen visible
- ✅ No JavaScript errors
- ✅ No 404 errors
- ✅ Service Worker registered

**If Failed:**
- Check network errors in DevTools
- Check service worker errors
- See ROLLBACK.md

---

### 2. Guest Mode Test (10 min)
**Goal:** Verify core functionality works

```
Login Flow:
□ Click "Gast" button
□ Wait for app screen to appear
□ Should NOT show blank page
□ Should see task grid with 5 segments
□ Should see task input field
□ Should see menus/settings buttons
□ No JavaScript errors in console

Create Task:
□ Type task text in input: "Test Task"
□ Click "Erstellen" button
□ Task appears in segment 1
□ Task is visible after hard refresh (F5)

Move Task:
□ Drag task to segment 2
□ Task appears in segment 2
□ No console errors

Delete Task:
□ Swipe or click delete on task
□ Task disappears
□ No console errors

Logout:
□ Click logout/exit button
□ App returns to login screen
□ No JavaScript errors
```

**Expected Result:**
- ✅ All task operations work smoothly
- ✅ UI responsive
- ✅ No console errors
- ✅ Data persists on refresh

**If Failed:**
- Guest Mode not loading: Check Service Worker status
- Task operations failing: Check browser console for Firebase errors
- Data not persisting: Check IndexedDB status (DevTools → Application)
- See ROLLBACK.md

---

### 3. Auth Functions Verification (5 min)
**Goal:** Verify critical fix is working (functions registered globally)

```
Open Browser Console and run:

typeof window.signInWithGoogle === 'function'     // Should be: true
typeof window.signInWithApple === 'function'      // Should be: true
typeof window.continueAsGuest === 'function'      // Should be: true
typeof window.signOut === 'function'              // Should be: true
typeof window.showLogin === 'function'            // Should be: true

// Should see 5 lines of: true
```

**Expected Result:**
- ✅ All functions return `true`
- ✅ No errors
- ✅ Functions available immediately (no delay)

**If Failed:**
- ❌ Any function returns `false` or undefined
- This indicates auth module not loaded properly
- Rollback immediately (see ROLLBACK.md)

---

### 4. Service Worker & Caching Test (10 min)
**Goal:** Verify SW updated and caching works

```
Step 1: Check Service Worker Version
□ DevTools → Application → Service Workers
□ Should show ONE active service worker
□ Check status: "activated and running"
□ Should be serving from cache v2.3.0 (or newer)

Step 2: Hard Refresh Test
□ Press: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows/Linux)
□ Wait for page to reload
□ Should still work (app loads from cache)
□ Verify SW still active in DevTools

Step 3: Offline Mode Test
□ DevTools → Network → Throttling: Offline
□ Navigate to staging URL
□ Should show cached version (offline capable)
□ Click Guest Mode button
□ App should work offline
□ Go back online
□ Verify online status indicator updates
```

**Expected Result:**
- ✅ SW version 2.3.0 active
- ✅ App works after hard refresh
- ✅ App works in offline mode
- ✅ Offline indicator appears when offline

**If Failed:**
- SW not updating: Clear all caches manually, hard refresh
- Old cache v2.2.0 still active: Wait 10 minutes, hard refresh
- Offline mode broken: Check offline-queue.js implementation
- See ROLLBACK.md

---

### 5. Error Monitoring (Throughout 24h)
**Goal:** Catch issues early

```
□ Check browser console every hour for new errors
□ Monitor staging server logs for 500 errors
□ Check Firebase console for auth errors
□ Verify no 404 errors for new modules
□ Monitor network activity in DevTools
```

**Expected Result:**
- ✅ No new JavaScript errors
- ✅ No 500 server errors
- ✅ No Firebase auth failures
- ✅ No 404 errors

**If Issues Found:**
- Single error: Document and continue monitoring
- Multiple errors or pattern: Investigate root cause
- Auth errors: Likely V1 issue returning, check caching
- See ROLLBACK.md if severity is high

---

## Extended Testing (24+ Hours)

### 6. Daily Smoke Tests
**Run each day while on staging:**

**Daily @ 9am:**
```
□ Login screen loads without errors
□ Guest Mode works
□ Create a task
□ Task persists
□ Logout works
□ Check console for errors
```

**Daily @ 5pm:**
```
□ Same tests as 9am
□ + offline mode test
□ + service worker status check
□ + check logs for errors since morning
```

**Expected Result:**
- ✅ 100% consistent behavior
- ✅ No intermittent issues
- ✅ No error spikes in logs

---

### 7. Cross-Browser Testing (if possible)
**Goal:** Verify works in different browsers

```
Firefox:
□ Login screen loads
□ Guest Mode works
□ Dev Console: No errors
□ Service Worker active

Safari:
□ Login screen loads
□ Guest Mode works
□ Dev Console: No errors
□ IndexedDB working (for guest mode)

Chrome:
□ Already tested above
□ Additional: Check with DevTools Protocol
```

**Expected Result:**
- ✅ Works in all browsers
- ✅ No browser-specific errors

---

### 8. Mobile Testing (if possible)
**Goal:** Verify responsive design unchanged

```
iOS Safari:
□ Rotate device: Portrait → Landscape
□ Tasks layout adjusts correctly
□ Buttons clickable without zooming
□ Swipe delete works
□ Offline mode works

Android Chrome:
□ Same tests as iOS
□ + Check Android-specific SW behavior
```

**Expected Result:**
- ✅ Mobile UI responsive
- ✅ All features work on mobile
- ✅ Touch gestures work

---

## Decision Criteria

### ✅ Proceed to Main If:
- All checklist items passed ✅
- Zero JavaScript errors for 24+ hours ✅
- All manual tests consistent ✅
- No Firebase auth failures ✅
- Service Worker properly updated ✅
- Guest Mode fully functional ✅
- Task operations work smoothly ✅

### ❌ Rollback If:
- Blank white screen on load
- Guest Mode not working
- Auth functions returning undefined
- Consistent JavaScript errors
- Firebase auth failures
- Service Worker not updating
- Data not persisting
- Any critical functionality broken

---

## Approval Signature

```
Staging Testing Approved: _________________________ Date: _______

Feature Branch: feature/firebase-v9-v2 (d9f8147)
Testing Duration: 24+ hours
Test Results: All Passed ✅

Ready to merge to main: YES / NO (circle one)

Notes:
_________________________________________________________________
_________________________________________________________________
```

---

## Next Steps After Staging

### If Approved (All Tests Pass):
1. Create PR from feature/firebase-v9-v2 to main
2. Include this checklist results in PR description
3. Request code review from team
4. Merge to main after approval
5. Monitor production for 1 hour post-deploy
6. Complete post-deployment checklist

### If Issues Found:
1. Document issue in GitHub issue
2. Create fix branch from feature/firebase-v9-v2
3. Fix the issue
4. Re-test on staging
5. Once fixed: Proceed with PR and merge

---

## References

- [Firebase v9 Deployment Guide](./FIREBASE_V9_DEPLOYMENT.md)
- [Root Cause Analysis](./ROOT_CAUSE_ANALYSIS.md)
- [Emergency Rollback](./ROLLBACK.md)
- [E2E Tests](../tests/e2e/auth-flow.spec.js)
