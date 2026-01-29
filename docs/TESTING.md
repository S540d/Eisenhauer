# Testing Guide - Eisenhauer Matrix

Comprehensive guide for testing the Eisenhauer Matrix application across all environments.

## Table of Contents

- [Environments](#environments)
- [Local Development](#local-development)
- [Running Tests](#running-tests)
- [Android TWA Testing](#android-twa-testing)
- [Firebase Testing](#firebase-testing)
- [Pre-Release Checklist](#pre-release-checklist)

---

## Environments

The project supports three isolated environments:

### Production
- **URL:** https://s540d.github.io/Eisenhauer/
- **Firebase Project:** `eisenhauer-matrix`
- **Branch:** `main`
- **Android App ID:** `com.sven4321.eisenhauer`
- **Build Command:** `npm run build`

### Staging
- **URL:** https://s540d.github.io/Eisenhauer/staging/
- **Firebase Project:** `eisenhauer-staging`
- **Branch:** `staging`
- **Android App ID:** `com.sven4321.eisenhauer.staging`
- **Build Command:** `npm run build:staging`

### Testing
- **URL:** https://s540d.github.io/Eisenhauer/testing/
- **Firebase Project:** `eisenhauer-testing`
- **Branch:** `testing`
- **Android App ID:** `com.sven4321.eisenhauer.testing`
- **Build Command:** `npm run build:testing`

---

## Local Development

### Development against Testing Firebase

```bash
# Start dev server with testing environment
VITE_ENV=testing npm run dev

# Or edit .env and set VITE_ENV=testing
npm run dev
```

### Development against Staging

```bash
VITE_ENV=staging npm run dev
```

### Development against Production (Not Recommended)

```bash
VITE_ENV=production npm run dev
```

**⚠️ Warning:** Avoid developing against production Firebase to prevent accidental data corruption.

---

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run with UI
npm run test:ui
```

**Test Files:**
- `tests/unit/auth.test.js` - Authentication tests
- `tests/unit/storage.test.js` - Storage & sync tests
- `tests/unit/notifications.test.js` - Notification system tests
- `tests/unit/translations.test.js` - i18n tests
- `tests/unit/tasks.test.js` - Task management tests

**Current Coverage:** 80%+ (Target: 80%)

### End-to-End Tests

```bash
# Run E2E tests (headless)
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug

# View report
npm run test:e2e:report
```

**Test Files:**
- `tests/e2e/auth-flow.spec.js` - Authentication flows
- `tests/e2e/task-management.spec.js` - Task CRUD operations
- `tests/e2e/offline.spec.js` - Offline functionality

---

## Android TWA Testing

### Build Flavors

The Android app supports three build flavors matching the web environments:

#### Production Build

```bash
cd android
./gradlew assembleProdRelease

# Install on device
adb install app/build/outputs/apk/prod/release/app-prod-release.apk
```

**Opens:** https://s540d.github.io/Eisenhauer/
**App Name:** Eisenhauer Matrix
**Package:** `com.sven4321.eisenhauer`

#### Staging Build

```bash
cd android
./gradlew assembleStagingRelease

# Install on device
adb install app/build/outputs/apk/staging/release/app-staging-release.apk
```

**Opens:** https://s540d.github.io/Eisenhauer/staging/
**App Name:** Eisenhauer (Staging)
**Package:** `com.sven4321.eisenhauer.staging`

#### Testing Build

```bash
cd android
./gradlew assembleTestingRelease

# Install on device
adb install app/build/outputs/apk/testing/release/app-testing-release.apk
```

**Opens:** https://s540d.github.io/Eisenhauer/testing/
**App Name:** Eisenhauer (Testing)
**Package:** `com.sven4321.eisenhauer.testing`

### Side-by-Side Installation

All three apps can be installed simultaneously on one device due to different package names:

```bash
# Install all three
cd android
./gradlew assembleProdRelease assembleStagingRelease assembleTestingRelease

adb install app/build/outputs/apk/prod/release/app-prod-release.apk
adb install app/build/outputs/apk/staging/release/app-staging-release.apk
adb install app/build/outputs/apk/testing/release/app-testing-release.apk
```

**Result:** Three separate app icons in launcher:
- "Eisenhauer Matrix"
- "Eisenhauer (Staging)"
- "Eisenhauer (Testing)"

### Digital Asset Links Verification

After deployment, verify Digital Asset Links:

```bash
# Check production
curl https://s540d.github.io/Eisenhauer/.well-known/assetlinks.json

# Should return JSON with all three package names
```

**Verify on device:**
```bash
adb shell pm get-app-links com.sven4321.eisenhauer
# Should show: verified
```

---

## Firebase Testing

### Environment Isolation

Each environment uses a separate Firebase project:

| Environment | Firebase Project | Purpose |
|-------------|------------------|---------|
| Production  | `eisenhauer-matrix` | Live user data |
| Staging     | `eisenhauer-staging` | Pre-release testing |
| Testing     | `eisenhauer-testing` | Development & CI/CD |

**✅ Safeguard:** The app automatically loads the correct Firebase config based on `VITE_ENV`.

### Testing Firebase Isolation

```bash
# Build testing version
VITE_ENV=testing npm run build

# Verify correct Firebase project in dist/
grep -r "eisenhauer-testing" dist/

# Should find: VITE_FIREBASE_PROJECT_ID=eisenhauer-testing
```

### Firebase Console Access

- **Production:** https://console.firebase.google.com/project/eisenhauer-matrix
- **Staging:** https://console.firebase.google.com/project/eisenhauer-staging
- **Testing:** https://console.firebase.google.com/project/eisenhauer-testing

---

## Pre-Release Checklist

### Before merging to `staging`:

- [ ] All unit tests pass (`npm test`)
- [ ] All E2E tests pass (`npm run test:e2e`)
- [ ] No console errors in browser
- [ ] Tested in Chrome, Firefox, Safari
- [ ] Mobile-responsive (test on real device)
- [ ] PWA installs correctly
- [ ] Service Worker updates work
- [ ] Firebase data syncs correctly
- [ ] Offline mode works
- [ ] Authentication works (Google, Apple, Guest)

### Before merging to `main`:

All of the above, plus:

- [ ] QA testing on staging completed
- [ ] No critical bugs reported
- [ ] Version number updated (`package.json`, `android/app/build.gradle`)
- [ ] CHANGELOG.md updated
- [ ] Android TWA builds successfully for all flavors
- [ ] Digital Asset Links verified
- [ ] Performance metrics acceptable (Lighthouse >90)
- [ ] Accessibility audit passed (WCAG 2.1 AA)

### Production Deployment

```bash
# 1. Ensure on main branch
git checkout main
git pull origin main

# 2. Build production
npm run build

# 3. Push to main (triggers GitHub Actions)
git push origin main

# 4. Verify deployment
# Check: https://s540d.github.io/Eisenhauer/

# 5. Build and deploy Android
cd android
./gradlew assembleProdRelease

# Upload to Google Play Console
```

---

## Troubleshooting

### Service Worker Cache Issues

If you see stale content after deployment:

```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});

// Then hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)
```

### Firebase Auth Not Working

```bash
# Check Firebase config is loaded correctly
VITE_ENV=testing npm run build
grep -A5 "VITE_FIREBASE" dist/assets/*.js

# Verify authorized domains in Firebase Console:
# - https://s540d.github.io
# - localhost (for development)
```

### Android TWA Shows Browser Bar

This means Digital Asset Links verification failed.

**Fix:**
1. Update [public/.well-known/assetlinks.json](../public/.well-known/assetlinks.json)
2. Get SHA-256 fingerprint:
   ```bash
   keytool -list -v -keystore path/to/keystore.jks -alias key_alias
   ```
3. Replace `REPLACE_WITH_YOUR_RELEASE_CERT_FINGERPRINT` in assetlinks.json
4. Redeploy
5. Wait 24-48 hours for Google to re-verify

---

## Testing Checklist Quick Reference

### ✅ Every Commit (CI/CD)

- Unit tests pass
- Linter passes
- Build succeeds

### ✅ Every PR to `testing`

- All unit tests pass
- Key E2E tests pass
- Manual smoke test

### ✅ Every PR to `staging`

- All tests pass (unit + E2E)
- Manual QA on staging environment
- Cross-browser testing
- Mobile testing

### ✅ Every PR to `main`

- All tests pass
- Staging QA complete
- Version bumped
- CHANGELOG updated
- Android builds tested
- Performance check
- Accessibility check

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [CHANGELOG.md](../CHANGELOG.md) - Version history
- [SECURITY.md](../SECURITY.md) - Security policies

---

**Last Updated:** 2026-01-29
**Maintainer:** S540d
**Version:** 1.9.2
