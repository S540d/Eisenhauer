# Architecture Documentation - Eisenhauer Matrix

## Overview

Eisenhauer Matrix is a mobile-first Progressive Web App (PWA) for task management based on the Eisenhower Matrix method. The application is built with modern web technologies and supports offline-first functionality with Firebase sync.

**Architecture Pattern:** JAMstack + PWA + Firebase Backend

---

## Table of Contents

- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Environment Strategy](#environment-strategy)
- [Firebase Architecture](#firebase-architecture)
- [Module Structure](#module-structure)
- [Data Flow](#data-flow)
- [Build & Deployment](#build--deployment)
- [Security Model](#security-model)

---

## Technology Stack

### Frontend

- **Framework:** Vanilla JavaScript (ES6+)
- **Build Tool:** Vite 5.4
- **PWA:** vite-plugin-pwa (Workbox)
- **Styling:** CSS3 (Custom Properties, Flexbox, Grid)
- **Storage:** LocalForage (IndexedDB abstraction)

### Backend

- **BaaS:** Firebase v10
  - Authentication (Google, Apple, Guest mode)
  - Firestore (NoSQL database)
  - Cloud Storage
- **Hosting:** GitHub Pages

### Testing

- **Unit Tests:** Vitest 4.0
- **E2E Tests:** Playwright 1.56
- **DOM Simulation:** happy-dom
- **Test Coverage Target:** 80%+

### Mobile

- **Android:** Trusted Web Activity (TWA)
- **Build Tool:** Gradle 8.x
- **Min SDK:** 21 (Android 5.0)
- **Target SDK:** 35 (Android 15)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Devices                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │   Browser  │  │   PWA      │  │  Android   │             │
│  │   (Web)    │  │ (Installed)│  │   TWA      │             │
│  └─────┬──────┘  └──────┬─────┘  └──────┬─────┘             │
└────────┼─────────────────┼───────────────┼───────────────────┘
         │                 │               │
         └─────────────────┴───────────────┘
                           │
         ┌─────────────────▼──────────────────┐
         │      Service Worker (Workbox)       │
         │  - Cache Strategy                   │
         │  - Offline Support                  │
         │  - Background Sync                  │
         └─────────────────┬──────────────────┘
                           │
         ┌─────────────────▼──────────────────┐
         │        Application Layer            │
         │  ┌──────────┐  ┌──────────┐        │
         │  │   UI     │  │  State   │        │
         │  │ Modules  │  │ Manager  │        │
         │  └────┬─────┘  └────┬─────┘        │
         │       │             │               │
         │  ┌────▼─────────────▼────┐          │
         │  │   Offline Queue        │          │
         │  └────┬──────────────┬────┘          │
         └───────┼──────────────┼───────────────┘
                 │              │
      ┌──────────▼──────┐  ┌────▼──────────┐
      │  LocalForage    │  │   Firebase     │
      │  (IndexedDB)    │  │   (Cloud)      │
      │  - Tasks        │  │  - Firestore   │
      │  - Preferences  │  │  - Auth        │
      │  - Offline Data │  │  - Storage     │
      └─────────────────┘  └────────────────┘
```

---

## Environment Strategy

### Three-Environment Model

The application uses a **three-tier environment strategy** for isolated development, testing, and production:

```
┌──────────────────────────────────────────────────────────┐
│                      Git Workflow                         │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  testing ──PR──> staging ──PR──> main                    │
│     │               │               │                     │
│     │               │               │                     │
│     ▼               ▼               ▼                     │
│                                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ Testing  │  │ Staging  │  │Production│               │
│  │          │  │          │  │          │               │
│  │ /testing/│  │ /staging/│  │    /     │               │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘               │
│       │             │              │                     │
└───────┼─────────────┼──────────────┼─────────────────────┘
        │             │              │
   ┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐
   │ Firebase │  │ Firebase │  │ Firebase │
   │ Testing  │  │ Staging  │  │Production│
   └──────────┘  └──────────┘  └──────────┘
```

### Environment Configuration

**Build-time configuration via .env files:**

```
.env.production    → VITE_ENV=production  → /Eisenhauer/
.env.staging       → VITE_ENV=staging     → /Eisenhauer/staging/
.env.testing       → VITE_ENV=testing     → /Eisenhauer/testing/
```

**Build commands:**
```bash
npm run build           # Production (main branch)
npm run build:staging   # Staging
npm run build:testing   # Testing
```

**Runtime detection:**
- `lib/environment-utils.js` - Build-time environment detection
- `js/modules/env-config.js` - Runtime environment detection
- `vite.config.js` - Base URL routing

---

## Firebase Architecture

### Multi-Project Strategy

Each environment uses a **separate Firebase project** for complete data isolation:

| Environment | Firebase Project      | Purpose                    |
|-------------|-----------------------|----------------------------|
| Production  | `eisenhauer-matrix`   | Live user data             |
| Staging     | `eisenhauer-staging`  | Pre-release QA testing     |
| Testing     | `eisenhauer-testing`  | Development & CI/CD        |

**Benefits:**
- ✅ No data contamination between environments
- ✅ Safe testing without production impact
- ✅ Independent Security Rules per environment
- ✅ Separate analytics and monitoring

### Firebase Services Used

```
┌────────────────────────────────────────┐
│           Firebase Services             │
├────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │    Authentication                 │  │
│  │  - Google Sign-In                │  │
│  │  - Apple Sign-In                 │  │
│  │  - Anonymous (Guest mode)        │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │    Firestore Database            │  │
│  │                                  │  │
│  │  /users/{userId}                 │  │
│  │    └─ /tasks/{taskId}            │  │
│  │         - text                   │  │
│  │         - segment                │  │
│  │         - checked                │  │
│  │         - createdAt              │  │
│  │         - recurring (optional)   │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │    Cloud Storage                 │  │
│  │  - Backup files (.json)          │  │
│  │  - Future: attachments           │  │
│  └──────────────────────────────────┘  │
│                                         │
└────────────────────────────────────────┘
```

### Firebase Configuration Loading

**Build-time injection via Vite:**

```javascript
// js/modules/firebase-init.js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... loaded from .env.{environment}
};
```

**Safeguards:**
- Different `projectId` prevents cross-environment writes
- Different `authDomain` isolates authentication
- Security Rules enforce user-specific access

---

## Module Structure

The application follows a **modular architecture** with clear separation of concerns:

```
js/modules/
├── auth.js              # Authentication (Google, Apple, Guest)
├── backup.js            # Backup/restore functionality
├── config.js            # App configuration
├── drag-drop.js         # Drag & drop interactions (deprecated)
├── drag-manager.js      # Modern drag & drop manager
├── env-config.js        # Runtime environment detection
├── error-handler.js     # Global error handling
├── firebase-init.js     # Firebase SDK initialization
├── notifications.js     # Toast notifications
├── offline-queue.js     # Offline sync queue
├── storage.js           # Data persistence layer
├── store.js             # LocalForage wrapper
├── tasks.js             # Task CRUD operations
├── translations.js      # i18n (DE/EN)
├── ui.js                # UI rendering & updates
├── undo.js              # Undo/redo functionality
└── version.js           # Version management
```

### Key Modules

#### `storage.js` - Data Persistence Layer

**Responsibilities:**
- Dual storage strategy (Local + Cloud)
- Sync conflict resolution
- Import/Export functionality
- Offline queue management

**Flow:**
```
User Action → storage.saveTasks()
              ├─> LocalForage (immediate)
              └─> Offline Queue (if online)
                      └─> Firebase (async sync)
```

#### `offline-queue.js` - Sync Queue

**Responsibilities:**
- Queue pending operations when offline
- Retry failed syncs with exponential backoff
- FIFO processing
- Conflict detection

**Queue Item Structure:**
```javascript
{
  id: 'queue_item_123',
  type: 'UPDATE_TASKS',
  data: { tasks: [...] },
  timestamp: 1706545200000,
  retries: 0
}
```

#### `ui.js` - UI Rendering

**Responsibilities:**
- DOM manipulation
- Event handling
- Modal management
- Theme switching (Dark/Light/System)
- Accessibility (ARIA attributes)

**Pattern:** Event delegation for performance

```javascript
document.addEventListener('click', (e) => {
  if (e.target.matches('.task-checkbox')) {
    toggleTask(e.target.dataset.taskId);
  }
});
```

---

## Data Flow

### Task Creation Flow

```
┌─────────┐
│  User   │
│  Input  │
└────┬────┘
     │
     ▼
┌─────────────────┐
│ createTask()    │ (tasks.js)
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ saveTasks()     │ (storage.js)
└────┬───┬────────┘
     │   │
     │   └──────────────┐
     │                  │
     ▼                  ▼
┌─────────────┐   ┌─────────────┐
│ LocalForage │   │ Offline     │
│  (Instant)  │   │   Queue     │
└─────────────┘   └──────┬──────┘
                         │
                         ▼ (when online)
                  ┌─────────────┐
                  │  Firebase   │
                  │  Firestore  │
                  └─────────────┘
```

### Authentication Flow

```
┌──────────────┐
│ User clicks  │
│ "Sign In"    │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ signInWithGoogle │ (auth.js)
│ or signInWithApple│
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Firebase Auth    │
│ (Popup/Redirect) │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ onAuthStateChange│
└──────┬───────────┘
       │
       ├─> Load user tasks from Firebase
       ├─> Sync local → cloud if guest → signed
       └─> Update UI (show sign-out, etc.)
```

### Offline → Online Sync Flow

```
┌──────────────┐
│ User Offline │
│ Creates Task │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Saved to         │
│ LocalForage +    │
│ Offline Queue    │
└──────────────────┘
       │
       │ ... Later ...
       │
       ▼
┌──────────────────┐
│ Network Online   │
│ Event            │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Offline Queue    │
│ Processes Items  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Upload to        │
│ Firebase         │
└──────┬───────────┘
       │
       ▼ (on success)
┌──────────────────┐
│ Remove from Queue│
└──────────────────┘
```

---

## Build & Deployment

### Build Process

```
┌──────────────────────┐
│  npm run build       │
│  (or build:staging)  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Vite reads .env file │
│ based on --mode      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Environment injected │
│ via import.meta.env  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Vite bundles:        │
│ - ES6 modules        │
│ - Code splitting     │
│ - Firebase chunk     │
│ - Service Worker     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Output to /dist      │
│ - index.html         │
│ - assets/*.js        │
│ - service-worker.js  │
│ - manifest.webmanifest│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ post-build.js        │
│ - Update cache hash  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ GitHub Actions       │
│ Deploy to gh-pages   │
└──────────────────────┘
```

### Deployment Strategy

**Unified GitHub Actions Workflow:**

A single `deploy-unified.yml` handles all three environments with branch-based detection:

```yaml
# .github/workflows/deploy-unified.yml
on:
  push:
    branches: [main, staging, testing]
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [auto, production, staging, testing]

jobs:
  deploy:
    steps:
      - name: Determine environment
        # main → production (/)
        # staging → staging (/staging/)
        # testing → testing (/testing/)

      - name: Build ${{ env }}
        run: npm run ${{ build_script }}

      - name: Deploy to GitHub Pages
        # Uses peaceiris/actions-gh-pages@v3
```

**Concurrency Control:**

All deployments use the same concurrency group to prevent race conditions:

```yaml
concurrency:
  group: gh-pages-deployment
  cancel-in-progress: false  # Queue instead of cancel
```

---

## Security Model

### Firebase Security Rules

**User Data Isolation:**

```javascript
// Firestore Security Rules (conceptual - stored in Firebase Console)
match /users/{userId}/tasks/{taskId} {
  allow read, write: if request.auth != null
                      && request.auth.uid == userId;
}
```

**Rules enforce:**
- ✅ Users can only access their own data
- ✅ Anonymous users have isolated data
- ✅ No cross-user data access

### Client-Side Security

**XSS Prevention:**
- ✅ `textContent` instead of `innerHTML` for user data
- ✅ DOMPurify (planned) for rich text sanitization
- ✅ CSP headers (Content Security Policy)

**Data Validation:**
- ✅ Input sanitization in `storage.js`
- ✅ Schema validation for imported data
- ✅ File size limits (5MB for imports)

**Authentication:**
- ✅ Firebase Auth tokens (short-lived)
- ✅ HTTPS enforced
- ✅ Secure cookie handling

---

## Android TWA Architecture

### Build Flavors Strategy

The Android app uses **Gradle Product Flavors** for multi-environment support:

```gradle
// android/app/build.gradle
flavorDimensions = ["environment"]

productFlavors {
    prod {
        applicationId "com.sven4321.eisenhauer"
        manifestPlaceholders = [defaultUrl: "https://...Eisenhauer/"]
    }
    staging {
        applicationId "com.sven4321.eisenhauer.staging"
        manifestPlaceholders = [defaultUrl: "https://...Eisenhauer/staging/"]
    }
    beta {  // Named 'beta' due to Android 'testing' keyword constraint
        applicationId "com.sven4321.eisenhauer.beta"
        manifestPlaceholders = [defaultUrl: "https://...Eisenhauer/testing/"]
    }
}
```

**Benefits:**
- ✅ Side-by-side installation of all three apps
- ✅ Separate app icons and names
- ✅ Independent Digital Asset Links

### Digital Asset Links

**Purpose:** Remove browser address bar in TWA

**Configuration:**

```json
// public/.well-known/assetlinks.json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.sven4321.eisenhauer",
    "sha256_cert_fingerprints": ["..."]
  }
}]
```

**Hosted at:** `https://s540d.github.io/Eisenhauer/.well-known/assetlinks.json`

---

## Performance Optimization

### Code Splitting

```javascript
// vite.config.js
rollupOptions: {
  output: {
    manualChunks: {
      firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore']
    }
  }
}
```

**Result:**
- Main bundle: ~300KB
- Firebase chunk: ~500KB (lazy-loaded)
- Total (gzipped): ~250KB

### Service Worker Caching

**Strategy:** Network-first for API, Cache-first for assets

```javascript
// Workbox configuration in vite.config.js
workbox: {
  globPatterns: ['**/*.{js,css,html,png,svg,json}'],
  cleanupOutdatedCaches: true,
  cacheId: `eisenhauer-${environment}`  // Environment-specific cache
}
```

**Cache Isolation:** Each environment has its own cache namespace:
- `eisenhauer-production`
- `eisenhauer-staging`
- `eisenhauer-testing`

This prevents cache pollution when switching between environments.

---

## Accessibility

The app is **WCAG 2.1 Level AA compliant**.

**Features:**
- ✅ Semantic HTML (`<main>`, `<nav>`, `<button>`)
- ✅ ARIA attributes (`aria-label`, `aria-live`, `role`)
- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ Focus indicators
- ✅ Screen reader announcements for notifications
- ✅ High contrast mode support
- ✅ Reduced motion support (`prefers-reduced-motion`)

---

## Future Architecture Considerations

### Potential Improvements

1. **State Management Library**
   - Consider Zustand or Redux for complex state
   - Current: Manual state in modules

2. **TypeScript Migration**
   - Type safety for Firebase data
   - Better IDE support
   - Effort: ~40-60 hours

3. **API Abstraction Layer**
   - Decouple from Firebase for easier migration
   - Support self-hosting option

4. **GraphQL Layer (Optional)**
   - If scaling beyond current use case
   - Better query flexibility

---

## Related Documentation

- [TESTING.md](./TESTING.md) - Testing guide
- [CHANGELOG.md](../CHANGELOG.md) - Version history
- [SECURITY.md](../SECURITY.md) - Security policies

---

**Version:** 1.10.0
**Last Updated:** 2026-02-01
**Maintainer:** S540d
