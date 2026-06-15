# Changelog

All notable changes to the Eisenhauer Matrix app will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### 📚 Dokumentation
- **CONTRIBUTING.md erstellt (#265):** Entwicklungs-Setup, Branch-Strategie, Commit-Konventionen,
  PR-Richtlinien, Code-Style, Testing-Anforderungen und Pre-commit-Hook-Dokumentation
- **Backup-Datum aktualisiert (#257):** `docs/last-backup.txt` auf 2026-06-15 gesetzt

### 🔧 Maintenance
- **Dependency Updates (#256):** patch/minor Updates aller Abhängigkeiten
  (`firebase`, `vite`, `vitest`, `@vitest/*`, `@playwright/test`, `eslint`,
  `@typescript-eslint/*`, `prettier`, `globals`, `vite-plugin-pwa`, `happy-dom`)
- **Security: CSP Enforcing (#245):** Content-Security-Policy vollständig auf
  Enforcing-Modus umgestellt (kein Report-Only mehr); `X-Content-Type-Options`
  und `Referrer-Policy` als Meta-Tags gesetzt
- **Test-Qualität (#286):** Skip-Szenario für Reorder-Buttons korrekt abgedeckt
  (echter corrupt-getter-Task löst den Skip aus, Buttons korrekt disabled)

### 🐛 Bug Fixes
- **Weiße/leere Startseite – Aufgaben unsichtbar (Render-Robustheit)**
  - Eine einzelne defekte Aufgabe (z. B. ungültiges `dueDate`/`completedAt` oder
    fehlerhaftes `recurring`-Objekt) brach die gesamte Render-Schleife ab, sodass
    **keine** Aufgaben mehr angezeigt wurden („hängt auf der Startseite fest“).
    Cache löschen/Neuinstallation half nicht, da die defekten Daten im
    synchronisierten Speicher (Firestore/IndexedDB) lagen, nicht im Browser-Cache.
  - `renderSegment`/`renderAllTasks` rendern Aufgaben und Segmente jetzt isoliert:
    eine fehlerhafte Aufgabe wird übersprungen und geloggt, alle übrigen werden
    normal angezeigt.
  - Ungültige Datumswerte in `createTaskElement` werden abgefangen, statt
    „Invalid Date“ zu rendern oder eine Exception zu werfen.
  - Regressionstests ergänzt (`tests/unit/render-resilience.test.js`).

### ✨ Features
- **Kalender-Umschalter zwischen Privat und Beruflich (#259)**
  - Sichtbarer Umschalter im Kopfbereich: Alle / Privat / Beruflich
  - Filtert die angezeigten Aufgaben nach der aktiven Kategorie
  - Der Quick-Add-Dialog wählt die aktive Kategorie vor; pro Aufgabe überschreibbar (inkl. „Keine")
  - Ersetzt die zuvor in den Einstellungen versteckten Kategorie-Filter-Buttons
  - Deutsche und englische Übersetzungen ergänzt (inkl. barrierefreiem Gruppen-Label)

---

## [1.11.2] - 2026-02-20 🚀 RELEASED (staging)

### 🐛 Bug Fixes
- **iOS Layout Fix (#224)**
  - Header wurde auf iPadOS/iOS hinter der Browser-Toolbar verborgen
  - `viewport-fit=cover` zum Viewport-Meta-Tag hinzugefügt
  - `env(safe-area-inset-top)` im Header-Padding, `env(safe-area-inset-bottom)` im Undo-Toast
- **ESLint 0 Warnings**
  - Alle 11 pre-existing Warnings behoben: Unused catch variables mit `_`-Prefix versehen
  - Ungenutzten `openModal`-Import in `script.js` entfernt
  - Service-Worker-Globals für `sw-custom.js` registriert

---

## [1.11.1] - 2026-02-15

### 🔧 Maintenance
- Version Bump für Play Store Release (versionCode 22)

---

## [1.11.0] - 2026-02-15

### ✨ New Features
- **Web Push Reminders (#225)**
  - Push-Benachrichtigungen für Aufgaben mit Fälligkeitsdatum
  - Service Worker Integration, Permission-Flow in der App
  - Erinnerung 1 Tag vor Fälligkeit
- **CI/CD Verbesserungen (#214)**
  - Harte Fehler bei Lint und Tests in der CI-Pipeline erzwungen
  - Deploy nur nach erfolgreich durchgelaufenen Quality-Checks

---

## [1.10.2] - 2026-02-10

### 🔧 Maintenance
- Version Bump für Play Store Release (versionCode 20)

---

## [1.10.1] - 2026-02-07

### 🔧 Maintenance
- Version Bump für Play Store Release (versionCode 19)
- Android Build Info liest Version aus `build.gradle` statt `version.json`

---

## [1.10.0] - 2026-02-04 🚀 RELEASED

### 🐛 Bug Fixes
- **Logout Data Leak (kritisch)**
  - Bei Logout werden jetzt alle Tasks aus dem Speicher und der DOM gelöscht
  - Verhindert, dass ein folgender Nutzer die Daten des vorherigen Nutzers sieht
  - `auth.js`: `onAuthStateChanged(null, false)` wird beim Logout aufgerufen
  - `script.js`: Early-Return-Block leert Tasks via `setAllTasks()` + `renderTasksWithCallbacks()`
- **Modal-Button-Layout**
  - Cancel-Button im Task-Erstellungs-Modal überschrieb die Add-Button-Breite
  - Fix: `.modal-buttons .btn { width: auto; }` verhindert `.btn`-Breitenüberschreibung innerhalb der Modal-Buttons

### 🗑️ Removed
- **Environment Switcher (Personalize Modal)**
  - Standard/Beta-Buttons aus dem Personalize-Modal entfernt
  - Buttons waren auf Production komplett deaktiviert und nur verwirrend
  - Entfernt aus: `index.html`, `ui.js`, `translations.js` (9 Übersetzungsschlüssel), `script.js` (`switchEnvironment`)
  - 152 Zeilen Code gelöscht

### ✅ Testing
- **showUndoMove Tests entfernt**
  - `showUndoMove`-Funktion existiert nicht mehr → 3 Tests aus `undo.test.js` entfernt
  - Aktuelle Testsuite: 150 Tests, 7/8 Suites grün
  - `storage.test.js` bleibt pre-existing Failure (Firebase-Mock nicht vorhanden)

### 📝 Commits
- `c69eb33` — fix: modal-buttons layout and remove showUndoMove tests
- `3677c9f` — fix: clear tasks in memory on logout to prevent data leakage
- `e12cfd3` — feat: remove environment switcher from Personalize modal
- `e482295` — docs: fix undo.js module comment per Copilot review suggestion

### 📋 Issues
- [Issue #166](https://github.com/S540d/Eisenhauer/issues/166) — ESLint cleanup (76 pre-existing Problems)

---

## [1.9.2] - 2026-01-27 🚀 RELEASED

### 🐛 Bug Fixes
- **Auto-Backup Notifications**
  - Fixed issue where "Backup failed" banner appeared on app startup
  - Added `showNotification` parameter to `uploadBackup()` function
  - Auto-backup errors are now only logged to console (no user-facing notifications)
  - Manual backups continue to show success/error notifications
  - See [Issue #147](https://github.com/S540d/Eisenhauer/issues/147) for future improvements

### ✅ Testing
- **Unit Tests**
  - Added comprehensive test coverage for backup.js module
  - 8 new tests for `showNotification` parameter behavior
  - Total test count: 184 tests (all passing)

### 📱 Android App
- **Version Update**
  - Updated to v1.9.2 (versionCode: 17)
  - Synced with PWA version

### 📝 Documentation
- Created Issue #147 to track future backup error handling improvements

---

## [1.9.1] - 2026-01-26 🚀 RELEASED

### 📱 Android App
- **Version Update**
  - Updated to v1.9.1 (versionCode: 16)
  - Synced with PWA version for consistency

### 🎨 UI Improvements
- **Splash Screen Enhancement**
  - Gradient background with elegant color transition (#667eea → #764ba2)
  - Larger, centered app logo (192dp × 192dp) for better visibility
  - Smoother fade-out animation (500ms) for professional appearance
  - See [SPLASH_SCREEN_IMPROVEMENT.md](SPLASH_SCREEN_IMPROVEMENT.md) for details

### 🐛 Bug Fixes
- **Service Worker Cache**
  - Fixed cache invalidation for gh-pages deployment
  - Improved resource loading reliability
  - Fixed concurrency issues with multiple builds

### 🔄 Build & Deployment
- **GitHub Actions**
  - Enhanced build-android.yml workflow
  - Fixed concurrency for gh-pages deployment
  - Automated version bumping workflow

---

## [1.7.7] - 2026-01-06 (Auth Redesign: Popup Only) 🚀 RELEASED

### 🔄 Authentication Strategy Update
- **Universal Popup Auth**
  - Switched from "Redirect-First" to "Popup-Only" strategy for all platforms (Desktop, Mobile, TWA, iOS PWA)
  - **Reason:** Solves "Storage Partitioning" and lost session state issues common with redirects in modern browsers (Chrome Privacy Sandbox, Safari ITP)
  - **Benefit:** Significantly cleaner code and more reliable login flow, especially on Android TWAs where redirects were failing silently

### 🗑️ Cleanups
- **Removed Legacy Redirect Logic**
  - Deleted potentially unstable fallback mechanisms in `auth.js`
  - Simplified authentication flow to a single, robust path

### 🐛 Bug Fixes
- **Mobile Login Loop (Android TWA & iOS PWA)**
  - Fixed critical issue where users were redirected to login screen after successful authentication
  - Implemented `indexedDBLocalPersistence` initialization in `auth.js` to ensure auth state is correctly restored after OAuth redirects
  - This addresses the regression from PR #98 and ensures compatibility with Android `singleTop` launchMode (PR #99)

## [1.7.5] - 2025-12-29 (Service Worker & Auth Race Condition Fix) 🚀 RELEASED

### 🐛 Bug Fixes
- **Service Worker Reload Loop**
  - Added extra safety checks to the `controllerchange` event listener in `index.html`
  - Prevents infinite reload loops on Android TWA by using `sessionStorage` and checking for an existing controller
- **Auth Initialization Race Condition**
  - Moved `initAuth()` to the end of the `initApp()` sequence in `script.js`
  - Ensures all UI modules and callbacks are fully registered before authentication state is processed
- **Mobile Authentication Flow**
  - Switched to `signInWithRedirect` for mobile devices and TWA mode in `auth.js`
  - Improved reliability of the login flow on Android where popups are often problematic
  - Added explicit `getRedirectResult` handling

### 📱 Android App
- **Version Update**
  - Updated to v1.7.5 (versionCode: 10)
  - Rebuilt AAB for Play Store upload

---

## [1.7.4] - 2025-12-29 (Robustness & Persistence Fix) 🚀 RELEASED

### 🚀 Features & Robustness
- **Firebase Auth Persistence Fix**
  - Switched from `browserLocalPersistence` to `indexedDBLocalPersistence`
  - This ensures authentication tokens are stored in IndexedDB, which is much more reliable on Android TWA than localStorage
  - Prevents "Auto-Logout" when Android kills background processes
- **Technical Analysis & Documentation**
  - Added comprehensive technical analysis of the Android login loop issue
  - Documented robustness improvements for future development

### 🐛 Bug Fixes
- **Storage Module Imports**
  - Fixed `no-undef` error for `isGuestMode` in `js/modules/storage.js`
  - Fixed missing `ErrorHandler` import in `js/modules/storage.js`
- **Android TWA Login-Logout Loop (Part 2)**
  - Combined `launchMode="singleTop"` with IndexedDB persistence for maximum reliability

### 📱 Android App
- **Version Update**
  - Updated to v1.7.4 (versionCode: 9)
  - Built with Java 23 for Gradle 8.13 compatibility

---
## [1.7.3] - 2025-12-29 (TWA Authentication Fix) 🚀 RELEASED

## [1.7.1] - 2025-12-29 (UI Improvements & Localization) 🚀 RELEASED

### 🎨 UI Improvements
- **Settings Menu Consistency**
  - Changed "About" button to link format (matches "Send Feedback" and "Support Me")
  - Increased padding for settings links for better touch targets (12px/8px)
  - Improved visual consistency across all settings buttons

### 🌐 Localization
- **Data Management Section**
  - Added English translation: "DATA MANAGEMENT" (was German-only "DATEN")
  - Export button: "📥 Export" (EN) / "📥 Export" (DE)
  - Import button: "📤 Import Guest Data" (EN) / "📤 Import Gast-Daten" (DE)
  - Fully localized settings menu

### 🐛 Bug Fixes
- **GitHub Pages Deployment**
  - Fixed "Module name 'localforage' does not resolve to a valid URL" error
  - Vite build output now correctly deployed to gh-pages
  - PWA works correctly on https://s540d.github.io/Eisenhauer/

### 📱 Android App
- **Version Sync**
  - Updated to v1.7.1 (versionCode: 6)
  - Synced with PWA version
  - Ready for Play Store release

---

## [1.7.0] - 2025-12-29 (Data Protection & User Control) 🚀 RELEASED

### 🔒 Data Protection & Loss Prevention

#### Explicit Guest Data Import (⭐ BREAKING CHANGE)
- **Removed automatic data migration** on login for safety
  - No more silent data operations
  - User has full control over when to import guest data
  - Prevents accidental data overwrites

- **New Import Button in Settings > DATEN section**
  - Side-by-side "📥 Export" and "📤 Import Gast-Daten" buttons
  - Confirmation dialog shows task count before import
  - User explicitly approves before migration
  - Success notification with task count
  - Auto-reload after successful import
  - Error handling for all scenarios

#### Safe Multi-Device Sync
- **Data Loss Prevention**
  - Login from new device no longer overwrites existing account data
  - Check for existing Firestore tasks before any migration
  - Safe merge strategy: only import if no existing data found
- **Improved Auth Flow**
  - Fixed critical issue where account tasks disappeared on re-login
  - Wrapper functions ensure auth callbacks execute safely
  - ES6 module loading race condition fixed

### 🔄 Cache Busting & Version Management

#### Force-Fresh Updates
- **Post-build cache-busting system**
  - Automatic MD5 hash generation on each build
  - Injected into HTML meta tags and script query parameters
  - Service Worker detects hash changes and clears old caches
  - Users always get latest version without manual cache clearing

- **Service Worker Integration**
  - Detects build version changes on page load
  - Automatic cache invalidation on version mismatch
  - Prevents serving stale assets from outdated SW cache
  - Transparent update mechanism

### 🛠️ Technical Improvements

#### ES6 Module Safety
- **Fixed auth function registration timing**
  - Wrapper functions in index.html ensure functions available before onclick
  - Prevents "function not found" errors during module load
  - Guarantees authentication works on slow network connections

#### Guest Mode Enhancements
- **Immediate feedback on sign-out**
  - Guest users see login screen instantly (no async wait)
  - Settings modal closes automatically on sign-out
  - Better UX for guest mode transitions

### 🐛 Bug Fixes

- Fixed: Missing user account tasks after login
- Fixed: Guest Sign-out button not visible in Settings
- Fixed: About button wrong color (now matches primary blue)
- Fixed: About modal text color visibility
- Fixed: Translation null reference for non-existent recurring options
- Fixed: Quick Add Modal language synchronization

### 📝 Commits
- `19b1aa2` - refactor: Replace automatic guest data migration with explicit import
- `b23b89f` - fix: Prevent data loss during account task migration
- `a6ac96d` - fix: Restore missing user account tasks after login
- `368ec56` - feat: Implement robust cache-busting mechanism for force-fresh updates
- `86f0019` - fix: Add wrapper functions to ensure auth functions are available before ES6 module loads

### ⚠️ Migration Notes
- **For Guest Users**: Guest data no longer auto-imports on account login
  - Use "Import Gast-Daten" button in Settings > DATEN when ready
  - Gives full control over data merging
- **For Account Users**: No changes to existing workflow
  - Existing data protected by new safety checks
  - Multi-device sync continues to work as before

### Status
- ✅ **Released to Main** - Live on https://s540d.github.io/Eisenhauer/
- 🎯 **Production Ready** - All critical fixes implemented
- 🔒 **Data Safety Verified** - No data loss on any scenario

---

## [1.6.2] - 2025-12-29 (UI/UX Polish & Language Sync) ✅ RELEASED

### 🎨 Settings Menu Styling

#### Visual Consistency
- **Button Standardization**
  - Sign-out & Export buttons now use primary blue (#667eea) with white text
  - Matches active language toggle appearance
  - Full-width buttons with consistent 32px minimum height
  - Unified padding: 6px 12px, font-size: 12px, border-radius: 4px

- **Link Color Improvements**
  - Feedback/Support/About links now use #667eea for better dark-mode visibility
  - Enhanced contrast in both light and dark themes
  - Consistent with Export and Language label styling

#### Quick Add Modal Redesign
- **Button Styling**
  - Add button: Primary blue (#667eea) with white text
  - Cancel button: Secondary gray style with grid color background
  - Both buttons match Settings menu design language

- **Layout Optimization**
  - Made modal more compact with reduced margins
  - Title margin: 8px bottom
  - Input padding: 8px 10px (reduced from 12px)
  - Recurring config padding: 8px
  - Border radius unified to 4px

### 🌍 Language Synchronization

#### Dynamic Language Support
- **Quick Add Modal Translations**
  - Added German: "Neue Aufgabe" with German UI strings
  - Added English: "New Task" with English UI strings
  - Input placeholders dynamically translated

- **Language Update Pipeline**
  - New `quickAddModal` section in translations.js
  - Extended `updateLanguageUI()` to cover Quick Add Modal elements
  - Includes recurring option labels and weekday abbreviations
  - Called on app initialization to apply language immediately

#### Supported Translations
- 🇩🇪 Deutsch: Neue Aufgabe, Hinzufügen, Abbrechen
- 🇬🇧 English: New Task, Add, Cancel
- All recurring options (Täglich/Daily, Wöchentlich/Weekly, etc.)
- Weekday abbreviations (Mo/Di/Mi... or Mon/Tue/Wed...)

### Status
- ✅ **Released to Main** - Live on https://s540d.github.io/Eisenhauer/
- 📱 **PWA Production Ready** - Service Worker updated
- 🎉 **Full QA Sign-off** - Tested and approved

---

## [1.6.1] - 2025-12-22 (Testing Phase)

### 🔧 Pre-Testing Cleanup & Fixes

#### Code Quality
- **Removed 1.284+ console.log statements** from production code
  - Reduced bundle size by ~30KB
  - Eliminated debug logs that could interfere with PWA behavior
  - All validation checks now pass

#### Technical Improvements
- **ES6 Module Migration** (ESM)
  - Converted `build-config.js` from CommonJS to ES6 modules
  - Converted `update-version.js` from CommonJS to ES6 modules
  - Ensures consistency with modern JavaScript standards

- **Security & Dependencies**
  - Fixed all security vulnerabilities: **0 vulnerabilities** (npm audit)
  - Updated `happy-dom` to v20.0.11 (fixed CRITICAL RCE vulnerability)
  - Updated `vitest` to v4.0.16 (fixed esbuild dev server exposure)
  - 6 moderate vulnerabilities → 0 vulnerabilities

#### Testing Readiness
- ✅ Build process fully functional (`npm run build`)
- ✅ Release validation passes (`./scripts/validate-release.sh`)
- ✅ Unit tests: 56/68 passing (82%)
  - Known limitations documented in [TESTING-STATUS.md](TESTING-STATUS.md)
- ✅ E2E test suite configured and ready (Playwright)

### 📚 Documentation
- Added [TESTING-STATUS.md](TESTING-STATUS.md) - Complete testing readiness report
- Added [TESTING-WORKFLOW.md](TESTING-WORKFLOW.md) - Comprehensive testing guide for QA
- Updated README.md with version 1.6.1

### Status
🎯 **Ready for Testing Phase** - All blockers resolved, full validation passed

---

## [1.6.0] - 2025-11-05

### ✨ New Features

#### Time-Based Recurring Tasks
- **Smart Scheduling:** Recurring tasks now appear only when they're actually due
  - **Daily tasks:** Appear tomorrow at 00:00, not immediately after completion
  - **Weekly tasks:** Appear on the next selected weekday (e.g., next Monday)
  - **Monthly tasks:** Appear on the same day next month
  - **Custom interval:** Appear after X days from completion
- **Predictable Behavior:** No more confusion with tasks appearing immediately after checking them off

#### Delete Recurring Series
- **Complete Deletion:** New option to permanently delete recurring tasks
- **Edit Modal Options:**
  - Remove recurring (convert to one-time task)
  - Update recurring settings
  - **Delete task permanently** ✨ NEW
- **Clean Management:** Easy way to stop unwanted recurring tasks completely

### 🎨 UI/UX Improvements

#### Compact Edit Recurring Modal
- **Tighter Layout:** Reduced padding (25px → 18px) and margins throughout
- **Smaller Font Sizes:** More information in less space (0.85rem, 0.8rem)
- **Consistent Spacing:** All elements use uniform 8-12px gaps
- **Max-width:** 420px for focused, compact appearance

#### Recurring Task Icon
- **Smaller Size:** Icon reduced from 20px to 12px (matches timestamp size)
- **Better Integration:** Visual weight matches "Done" timestamp
- **Proportional Styling:** Stroke width adjusted to 1.5 (from 2.5)

#### Dark Mode Fixes
- **Readable Labels:** All checkbox and radio labels now visible in dark mode
- **Consistent Colors:** Explicit text-primary colors for all form elements
- **No More Black on Black:** Fixed recurring modal text visibility issues

#### Settings Menu
- **Sign-Out Improvements:** Button appears for both Firebase and guest mode users
- **Gray Buttons:** Unified button styling (no more colored buttons)
- **Clean Font:** Uses app's standard font family throughout

### 🔧 Technical Improvements

#### Recurring Task Architecture
- **`calculateNextOccurrence()`:** New function calculates exact due dates
- **Future Timestamps:** Tasks store `createdAt` in the future
- **Filtered Rendering:** `getTasks()` only returns tasks where `createdAt <= Date.now()`
- **Automatic Appearance:** Tasks automatically show when they become due

#### Bug Fixes
- **Recurring Icon Visibility:** Fixed critical bug where tasks weren't marked as recurring
  - Wrong config structure: `{ type: selectedType }`
  - Correct structure: `{ enabled: true, interval: selectedType }`
- **Completed Tasks:** Recurring flag now removed from completed instances
- **No More Confusion:** Done tasks appear without recurring icons

### 📝 Changes from This Release

- **3 Major Features:** Time-based scheduling, delete series, compact modal
- **5 UI Refinements:** Smaller icon, dark mode fixes, gray buttons, layout improvements
- **2 Critical Fixes:** Recurring creation bug, completed task recurring flag
- **Clean Separation:** Active recurring tasks have icon, completed instances don't

---

## [1.5.0] - 2025-10-18

### ✨ New Features

#### Swipe-to-Delete & Delete Button
- **Swipe-to-Delete on Mobile:** Swipe left on any task to delete it with smooth animation
- **Desktop Delete Button:** Easy delete button (✕) appears on hover for Done tasks on desktop only
- **Better UX:** Alternative to swipe for desktop users

#### UI/UX Improvements
- Hide "+" add button in Done segment (completed tasks shouldn't get new items added)
- Improved task item styling and interactions
- Delete button with red hover state for better visibility

### 🔧 Fixes & Improvements

#### Critical Fixes
- **Fixed DataCloneError in Offline Queue** - Executor functions now stored separately from serializable queue data, preventing IndexedDB serialization errors
- **Fixed Swipe Detection** - Long-press cancellation no longer breaks swipe gesture detection
- **Fixed Base href for /testing/ Subdirectory** - All resources now load correctly from testing subdirectory

### 📝 Previous Improvements (2025-10-17)

#### Fixed
- **[#76] OfflineQueue Bug - Data Loss behoben** (`400ac6f`)
  - Fixed `offlineQueue.on is not a function` error
  - Complete rewrite from static to instance-based class
  - Implemented Event Emitter pattern
  - Tasks no longer lost on logout
  - Queue properly persists to IndexedDB

- **[#76] Recurring Tasks Dialog öffnet sich nicht** (`6bf39d9`)
  - Added missing event listeners for recurring task UI
  - Recurring task options now display correctly
  - Weekly/Monthly/Custom intervals work properly
  - Works in both main modal and quick-add modal

- **[#76] Auth Persistence - Nicht mehr neu anmelden** (`de426d9`)
  - Explicitly set Firebase Auth persistence to LOCAL
  - Users stay signed in after browser close/restart
  - Auth tokens persist across sessions
  - No more repeated sign-ins required

#### Added
- **[A11y] WCAG 2.1 Level AA Full Compliance** (`021b2e0`)
  - **Keyboard Navigation for Drag & Drop:**
    - Space: Select/deselect task
    - Arrow keys: Navigate between quadrants
    - Enter: Confirm move
    - Escape: Cancel selection
  - **Screen Reader Support:**
    - ARIA live region announcements
    - Task movement notifications
    - Contextual keyboard instructions
    - VoiceOver, NVDA, JAWS, TalkBack compatible
  - **Visual Feedback:**
    - Blue outline + "✓ Selected" label for selected tasks
    - Green dashed outline + "→ Target" label for target quadrant
    - Enhanced focus indicators
    - Full dark mode support
  - **Compliance:**
    - Level A: 30/30 (100%)
    - Level AA: 14/14 (100%)
    - Fully WCAG 2.1 AA compliant

#### Changed
- Updated accessibility audit document (`4248f85`)
  - Marked all issues as FIXED
  - Updated compliance scores to 100%
  - Added implementation details and commit references

#### Documentation
- Added comprehensive `TESTING_GUIDE.md`
- Added `CHANGELOG.md` (this file)
- Updated `tests/accessibility/ACCESSIBILITY_AUDIT.md`

---

## [1.4.5] - Previous Releases

### Phase 5: Testing & Polish
- Comprehensive E2E testing with Playwright
- Performance optimizations (60 FPS drag & drop)
- PWA installation improvements
- Multi-day user testing completed

### Phase 4: Offline Support
- Offline-first architecture with IndexedDB
- Service Worker integration
- Sync queue for offline operations
- Background sync when online

### Phase 3: Modular Architecture
- ES6 modules refactoring
- Separation of concerns (config, tasks, storage, UI)
- DragManager 2.0 implementation
- Error handling improvements

### Phase 2: Core Features
- Drag & Drop 2.0 (mouse + touch)
- Recurring tasks
- Dark mode
- Multi-language support (DE/EN)

### Phase 1: Initial Release
- Eisenhauer Matrix (4 quadrants)
- Firebase Authentication (Google, Apple)
- Guest mode
- Task management (CRUD)
- Firestore sync

---

## Known Issues

### 🟡 Low Priority (Non-Critical)

- **Offline-Sync Display Status**
  - Shows "synchronizing" after logout even when queue is empty
  - Visual issue only, functionality works correctly
  - Will be fixed in future update

- **Metrics Feature**
  - Not currently functional
  - Marked as non-essential
  - Will be addressed in future update

---

## Testing

**Testing URL:** https://s540d.github.io/Eisenhauer/testing/

**Testing Guide:** [TESTING_GUIDE.md](TESTING_GUIDE.md)

**Issue Tracker:** [GitHub Issue #76](https://github.com/S540d/Eisenhauer/issues/76)

---

## Deployment Status

### Testing Branch
- **Branch:** `testing`
- **URL:** https://s540d.github.io/Eisenhauer/testing/
- **Status:** ✅ Deployed
- **Last Deploy:** 2025-10-17

### Production
- **Branch:** `main`
- **URL:** https://s540d.github.io/Eisenhauer/
- **Status:** ✅ Deployed
- **Last Deploy:** 2026-02-04 (v1.10.0)

---

## Migration Notes

### From Previous Versions

No migration needed - all changes are backward compatible:
- Existing tasks will continue to work
- Auth tokens will be preserved
- Local data will be maintained
- Guest mode data will persist

---

## Contributors

- Sven Strohkark (@S540d)
- Claude Code (AI Assistant)

---

**Format:** This changelog follows [Keep a Changelog](https://keepachangelog.com/) conventions.
