# Claude Code Instructions - Eisenhauer Matrix PWA

## Project Overview
Eisenhauer Matrix PWA - A task management app using the Eisenhauer/Eisenhower Matrix principle.

**Current Version:** 1.8.3 (versionCode 14)

**Tech Stack:**
- Vanilla JavaScript (ES6 modules)
- Vite (Build System)
- Firebase v9 Modular SDK (Auth + Firestore)
- PWA with Service Worker
- Android TWA (Trusted Web Activity)

## Key Project Documents
- [Design Standards](../docs/DESIGN_STANDARDS.md)
- [Technical Analysis](../docs/TECHNICAL_ANALYSIS.md)
- [Robustness Improvements](../docs/ROBUSTNESS_IMPROVEMENTS.md)
- [Firebase Setup](../FIREBASE_SETUP.md)
- [Merge Strategy](../docs/MERGE-STRATEGY.md) - When to merge testing→staging→main
- [Infrastructure Audit](../docs/INFRASTRUCTURE-AUDIT-2026-01-19.md) - Technical debt inventory

## Development Guidelines

### Code Style
- Use **Vanilla JavaScript** (no frameworks)
- ES6 modules with explicit imports/exports (see PR #123 for clean auth module pattern)
- Avoid global `window.*` variables (Issue #120 ✅ RESOLVED)
- Follow existing modular architecture

### Testing & Environments
- **Production:** `main` branch → https://s540d.github.io/Eisenhauer/ (Firebase: eisenhauer-matrix)
- **Staging:** `staging` branch → https://s540d.github.io/Eisenhauer/staging/ (Firebase: eisenhauer-staging)
- **Testing:** `testing` branch → https://s540d.github.io/Eisenhauer/testing/ (Firebase: eisenhauer-testing)
- **Merge Strategy:** See [MERGE-STRATEGY.md](../docs/MERGE-STRATEGY.md)
- **Node Version:** 20 (defined in `.nvmrc`)

### Critical Areas
1. **Firebase Initialization (firebase-init.js):**
   - **IMPORTANT:** Uses try-catch for `initializeFirestore()` to handle duplicate calls in ES modules
   - Falls back to `getFirestore()` if already initialized (v1.8.2 fix)
   - Uses `persistentLocalCache` with `persistentMultipleTabManager` for offline support
   - Don't remove error handling - prevents production crashes

2. **Authentication (auth.js):**
   - Uses `indexedDBLocalPersistence` for Android TWA compatibility
   - Clean ES6 exports (no global window variables - Issue #120 ✅)
   - Self-healing redirect/popup strategy (Issue #103)
   - Avoid breaking auth flow

3. **Offline-First Architecture:**
   - IndexedDB via localforage
   - Offline queue for Firestore sync
   - Don't break offline functionality

4. **PWA Service Worker:**
   - **Dev Mode:** Service Worker disabled in development (port detection)
   - **Production:** Full PWA caching enabled
   - **Cache Busting:** Automated in build scripts (update-cache-version.js)
   - Cache invalidation is critical - auto-handled by build process
   - Version bumps required for JS changes

### Android TWA Considerations
- Must work in Trusted Web Activity context
- localStorage is unreliable → use IndexedDB
- Test on actual Android devices
- See Issue #121 for environment management

## Common Tasks

### Adding a New Feature
1. Check if it affects offline functionality
2. Update both Firebase and local storage paths
3. Test in guest mode + authenticated mode
4. Update service worker version if needed

### Bug Fixes
- Check [open issues](https://github.com/S540d/Eisenhauer/issues)
- High priority: #121 (Android TWA), #120 (Technical Debt)
- Reference issue number in commits

### Before Committing
- Run `npm run lint`
- Run `npm run format`
- Test in both dark/light mode
- Test offline functionality

## Recent Infrastructure Improvements ✅

### Infrastructure Quick Wins (2026-01-19)
- ✅ **Automated Cache Busting** - update-cache-version.js runs automatically in all build scripts
- ✅ **Node Version Consistency** - All workflows use Node 20 via .nvmrc
- ✅ **Composite Action** - .github/actions/setup-node for DRY workflow code
- ✅ **Merge Strategy Documentation** - Clear guidelines for testing→staging→main flow

### v1.8.3 Release (2026-01-20)
- ✅ **Android version sync** (PR #134)
  - Updated build.gradle: versionCode 14, versionName 1.8.3
  - Synced with PWA version from package.json
  - Play Store AAB build successful (Run #31)

### v1.8.2 Fixes (2026-01-19)
- ✅ **Firebase initializeFirestore duplicate call fix** (Commit 8961271)
  - Prevents `FirebaseError: initializeFirestore() has already been called`
  - Graceful fallback to `getFirestore()` when already initialized
  - Critical fix for production stability
- ✅ **Service Worker dev mode fix** (Commit 621d6df)
  - Service Worker now disabled in Vite dev mode
  - Eliminates `SecurityError: Script load failed` in development
  - Production builds unaffected

### Issue #120 - Technical Debt (RESOLVED - PR #123)
- ✅ Removed global `window._*` variables from auth.js
- ✅ Implemented clean ES6 module exports with proper binding
- ✅ All tests passing, no regressions

### Issue #116 - Notification Tests (RESOLVED - Commit 8c8dad4)
- ✅ Fixed 12 failing notification unit tests
- ✅ All 25 tests now passing
- ✅ DOM persistence issue in Happy DOM resolved

### Issue #136 - Mobile-First & Produktivitäts-Verbesserungen (IN PROGRESS)
- ✅ **PR #137 - Foundation & Quick Wins (MERGED - 2026-01-21)**
  - Personalisieren modal with theme & language settings
  - Undo functionality with toast notifications (12 unit tests)
  - Interactive onboarding tutorial (3 slides)
  - All 12 Copilot suggestions fixed
- 🔄 **PR #138 - Drag & Drop Improvements (PENDING)**
  - Swipe-right-to-complete functionality
  - Task reordering within segments
- 🔄 **PR #139 - Backend Features (PENDING)**
  - Automatic cloud backup (Firebase Storage)
  - Task reordering UI (up/down buttons)

## Known Issues & Gotchas

### Issue #121 - Android TWA Environments (Critical)
- Android app needs build flavors for prod/staging/testing
- Separate package names for side-by-side installation
- Digital Asset Links configuration required

### Issue #108 - About Button Bug (To Fix)
- Event listeners break after theme switching
- Needs event delegation fix
- Part of Phase 4 bug fixes (Issue #119)

## Architecture Notes

### Module Structure
```
js/modules/
├── firebase-init.js     # Firebase v9 initialization (with duplicate call protection)
├── auth.js              # Authentication & user management (clean ES6 exports)
├── storage.js          # Firestore operations
├── offline-queue.js    # Offline sync queue
├── tasks.js            # Task CRUD operations (incl. restoreTask for undo)
├── ui.js               # UI rendering (incl. modals: Personalize, Tutorial)
├── undo.js             # Undo functionality with toast notifications
├── translations.js     # Multi-language support (DE/EN)
├── error-handler.js    # Error handling
├── env-config.js       # Environment detection (prod/staging/testing)
└── version.js          # Version management
```

### Data Flow
1. User action → UI event
2. Update local state (tasks object)
3. Save to localforage (immediate)
4. Queue Firestore sync (if online & authenticated)
5. Update UI

## Do's and Don'ts

### ✅ Do:
- Use existing patterns from other modules
- Add input validation for user data
- Handle offline scenarios gracefully
- Test on Android TWA if changing auth/storage

### ❌ Don't:
- Add new framework dependencies (keep it Vanilla JS)
- Use `browserLocalPersistence` (breaks Android)
- Bypass the offline queue
- Forget to update service worker version
- Add global variables to window object

## Questions?
Refer to the technical documentation in `/docs` or check related GitHub issues.
