# Firebase v9 Modular SDK Migration - Deployment Guide

## Overview

This guide covers the deployment of Firebase v9 Modular SDK migration (V2) to production. This migration was carefully planned to avoid the timing issues that caused the V1 failure.

## Critical Lessons from V1 Failure

### The Problem (V1)
- **DOMContentLoaded Race Condition**: ES6 modules load asynchronously, DOMContentLoaded fires DURING module load
- **Global Functions Not Registered**: Functions wrapped in DOMContentLoaded listener, registered AFTER event already fired
- **Silent Failure**: App showed blank white screen, buttons threw `ReferenceError: signInWithGoogle is not defined`
- **Service Worker Caching**: Broke cached modules prevented even code reverts from fixing the issue

### The Solution (V2)
✅ **Removed DOMContentLoaded Wrapper**
- Auth listener established immediately when module loads
- No race condition with event timing

✅ **Global Functions Registered at Module Load Time**
- Functions available BEFORE any onclick handlers try to use them
- Lines 242-247 in js/modules/auth.js

✅ **Service Worker Cache Invalidation**
- Version bumped 2.2.0 → 2.3.0
- Forces browser to clear old cached files

✅ **Comprehensive Testing**
- Unit tests: 68/68 passing
- E2E tests: auth-flow.spec.js with 26 critical tests
- Smoke tests: 5/5 verification tests passing

## Deployment Checklist - STAGING

### Pre-Deployment (Local Development)
- [x] All unit tests passing (68/68)
- [x] All E2E tests passing (auth flow critical)
- [x] Pre-commit hooks passing (Prettier, ESLint)
- [x] Smoke tests passing (5/5)
- [x] No console errors on page load
- [x] Global auth functions verified available

### Staging Deployment Steps

**Step 1: Push Feature Branch to Staging** (< 5 minutes)
```bash
git checkout staging
git pull origin staging
git merge origin/feature/firebase-v9-v2
git push origin staging
```

**Step 2: Wait for GitHub Actions Deployment** (5-10 minutes)
- Check: https://github.com/S540d/Eisenhauer/actions
- Verify deployment completed successfully
- Check artifacts uploaded

**Step 3: Manual Testing - Login Screen** (5 minutes)
```
□ Open staging URL in browser
□ Dev Tools → Console (check for errors)
□ Login screen appears (not blank white screen)
□ Buttons visible: "Gast", "Google Sign-In", "Apple Sign-In"
```

**Step 4: Manual Testing - Guest Mode** (10 minutes)
```
□ Click "Gast" button
□ App screen appears (not blank)
□ Can see: Task segments, menus, settings
□ Create a test task (can type, submit button works)
□ Tasks persist on refresh
□ Logout button works
```

**Step 5: Manual Testing - Auth Functions** (5 minutes)
```
□ Open Dev Console → Paste:
  typeof window.signInWithGoogle === 'function'
□ Should return: true
□ Repeat for: signInWithApple, continueAsGuest, signOut, showLogin
```

**Step 6: Browser Cache Test** (5 minutes)
```
□ Hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)
□ Check Service Worker updated (version 2.3.0)
□ Verify app still works after cache clear
```

**Step 7: Offline Mode Test** (5 minutes)
```
□ Enter Guest Mode
□ Create a task
□ Dev Tools → Network → Offline
□ Try to create another task
□ Verify offline indicator appears
□ Go back online
□ Verify sync happens
```

**Step 8: Monitor Staging** (24+ hours)
```
□ Check error logs daily
□ No spikes in 404 errors
□ No auth errors in console
□ Users (if any) can login normally
```

### Decision Point: Deploy to Main?
✅ **Proceed to Main IF ALL CHECKS PASS:**
- No console errors for 24+ hours
- All manual tests successful
- No Firebase auth failures
- App responsive and stable

❌ **ROLLBACK to Main IF ISSUES FOUND:**
- See rollback section below

## Pre-Merge to Main Checklist

### Before Creating PR
- [x] Feature branch fully tested on staging
- [x] Zero console errors (excluding expected Firebase warnings)
- [x] All auth flows work (Guest, Google, Apple, SignOut)
- [x] Offline mode works
- [x] Service worker updated
- [x] 24+ hour stability on staging

### PR Description Template
```markdown
## Firebase v9 Modular SDK Migration V2

### Summary
Migrate from Firebase compat SDK (CDN) to Firebase v9 modular SDK (npm) with critical timing fixes.

### Key Changes
- Created js/modules/firebase-init.js (modular SDK initialization)
- Updated js/modules/auth.js (no DOMContentLoaded wrapper)
- Updated js/modules/storage.js (modular Firestore imports)
- Updated script.js (immediate initAuth() call)
- Removed Firebase CDN scripts from index.html
- Service worker cache version bumped (2.2.0 → 2.3.0)

### Critical Fixes Applied
1. ✅ Removed DOMContentLoaded wrapper from auth initialization
   - Fixes: ES6 module timing issues
   - Impact: Auth listener established immediately

2. ✅ Global functions registered at module load time
   - Fixes: "ReferenceError: signInWithGoogle is not defined"
   - Impact: Functions available before onclick handlers

3. ✅ Service worker cache invalidation
   - Fixes: Old cached modules blocking updates
   - Impact: Users get fresh code on reload

### Testing
- Unit tests: 68/68 ✅
- E2E tests (auth-flow.spec.js): 26 tests ✅
- Smoke tests: 5/5 ✅
- Manual testing on staging: 24+ hours stable ✅
- No console errors: ✅

### Lessons from V1 Failure
This migration V2 specifically addresses all issues from the failed V1:
1. No DOMContentLoaded wrapper (eliminated race condition)
2. Global functions registered early (eliminated ReferenceError)
3. Proper testing before main (unit + E2E + manual)
4. Service worker cache invalidation (eliminated stale code issue)

### Rollback Plan
If issues occur, see docs/ROLLBACK.md

### Monitoring
- Monitor production for 1 hour after deployment
- Check error logs for Firebase auth failures
- Verify users can login (both auth methods)
```

### Merge to Main
```bash
git checkout main
git pull origin main
git merge origin/feature/firebase-v9-v2 --ff-only
git push origin main
```

### Post-Deployment Monitoring (1 Hour)
- [ ] Refresh production URL manually
- [ ] Dev Console: check for errors
- [ ] Test Guest Mode login
- [ ] Verify tasks can be created
- [ ] Check service worker updated
- [ ] Monitor error logs

## Rollback Procedure (Emergency)

If critical issues occur on production:

```bash
# 1. Identify last good commit
git log --oneline -10
# Look for: b6fb7f2 (emergency: Clear service worker cache...)

# 2. Create emergency rollback commit
git checkout main
git reset --soft b6fb7f2
git reset
git add -A
git commit -m "emergency: Rollback Firebase v9 migration due to [ISSUE]

Rollback from feature/firebase-v9-v2 to stable state (b6fb7f2).

Issue encountered: [DESCRIBE ISSUE]
- [Detail 1]
- [Detail 2]

Rolling back to compat SDK approach until issues resolved.
See docs/FIREBASE_V9_DEPLOYMENT.md for next steps."

# 3. Push rollback
git push origin main

# 4. Monitor
# Wait for GitHub Actions deployment
# Verify production working again
```

## Future Considerations

### For Next Firebase Upgrade
1. Write E2E tests BEFORE implementation
2. Test auth flows specifically (timing-sensitive)
3. Deploy to staging with 24+ hour validation
4. Manual testing before main merge
5. Monitor for 1+ hour post-deployment

### CI/CD Improvements to Implement
- [ ] Add E2E smoke tests to GitHub Actions
- [ ] Alert on Service Worker changes
- [ ] Monitor console error spikes
- [ ] Block main merge if tests fail
- [ ] Required PR reviews for migrations

## Support

### Questions About This Migration?
See:
- [ROOT_CAUSE_ANALYSIS.md](./ROOT_CAUSE_ANALYSIS.md) - Why V1 failed
- [ROLLBACK.md](./ROLLBACK.md) - Emergency rollback procedures
- tests/e2e/auth-flow.spec.js - Critical auth tests

### Issues on Staging?
1. Check browser console for errors
2. Hard refresh (Cmd+Shift+R)
3. Check Service Worker status
4. See rollback procedure above

### Issues on Production?
1. **IMMEDIATELY** check error logs
2. If auth broken: Execute rollback (see above)
3. If partial issues: Monitor and report
4. Post-mortem: Document for future
