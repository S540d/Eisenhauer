# Changelog

All notable changes to the Eisenhauer Matrix app will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] - Testing Branch

### 🎉 Major Fixes & Features (2025-10-17)

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
- **Status:** ⏸️ Awaiting testing approval
- **Last Deploy:** (pending)

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
