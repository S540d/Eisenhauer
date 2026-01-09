# Eisenhauer Matrix - Architecture Documentation

Dieses Dokument beschreibt die technische Architektur der Eisenhauer Matrix Progressive Web App.

## Überblick

Eisenhauer Matrix ist eine **mobile-first PWA** für Aufgabenverwaltung nach der Eisenhauer-Matrix-Methode, entwickelt mit Vanilla JavaScript und Firebase Backend.

### Kernmerkmale
- ✅ Progressive Web App (PWA) - Installierbar auf iOS/Android
- ✅ Offline-First Architecture mit Service Worker
- ✅ Firebase Cloud Sync mit Realtime Updates
- ✅ Multi-Environment Deployment (Production/Staging/Testing)
- ✅ WCAG 2.1 Level AA konform
- ✅ Zero-Framework (Vanilla ES6+)

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│  (HTML5 + CSS3 Grid/Flexbox + Vanilla JavaScript ES6+)      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   TaskList   │  │ Drag & Drop  │  │ Recurrence   │      │
│  │   Manager    │  │   Manager    │  │   Manager    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Auth      │  │    Search    │  │   Settings   │      │
│  │   Manager    │  │   Manager    │  │   Manager    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Storage Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Firebase    │  │  IndexedDB   │  │   Offline    │      │
│  │  Firestore   │  │ (localForage)│  │    Queue     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                              │                                │
└──────────────────────────────┼────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Worker                            │
│  (Offline Caching + Background Sync + PWA Installation)      │
└─────────────────────────────────────────────────────────────┘
```

## Environment Management

### Multi-Environment Setup

Das Projekt nutzt **3 separate Environments** mit vollständiger Firebase-Isolation:

```
┌──────────────────────────────────────────────────────────────┐
│                    Branch Strategy                            │
└──────────────────────────────────────────────────────────────┘

feature/* ──┐
            ├──> testing ──> staging ──> main
bugfix/*  ──┘

            🧪 Testing      🔧 Staging     🚀 Production
            │               │               │
            ▼               ▼               ▼
         /testing/       /staging/          /
            │               │               │
            ▼               ▼               ▼
    eisenhauer-testing  eisenhauer-staging  eisenhauer-matrix
     (Firebase)          (Firebase)          (Firebase)
```

### Build System

```bash
# Environment-spezifische Builds
npm run build:production  # NODE_ENV=production
npm run build:staging     # NODE_ENV=staging
npm run build:testing     # NODE_ENV=testing
```

**Build Pipeline:**
```
1. update-cache-version.js  → Cache-Busting Version generieren
2. set-base-url.js          → Base href in index.html setzen
3. build-config.js          → firebase-config.js generieren aus .env.*
```

**Auto-generierte Files:**
- `firebase-config.js` - Firebase SDK Initialisierung
- `environment.js` - Environment Detection für Client
- `cache-versions.json` - Service Worker Cache-Versionen
- `index.html` (modifiziert) - Base href + data-environment

### Firebase Isolation

**Problem:** Mit produktiven Nutzern (TWA/PWA im App Store) können Test-Daten nicht in Production-DB landen.

**Lösung:** Separate Firebase-Projekte pro Environment.

```javascript
// .env.production
FIREBASE_PROJECT_ID=eisenhauer-matrix

// .env.staging
FIREBASE_PROJECT_ID=eisenhauer-staging

// .env.testing
FIREBASE_PROJECT_ID=eisenhauer-testing
```

**Siehe:** [FIREBASE_SETUP.md](FIREBASE_SETUP.md) für Details.

## Frontend Architecture

### File Structure

```
Eisenhauer/
├── index.html              # Entry Point + PWA Manifest
├── styles.css              # Global Styles (CSS Variables, Grid)
├── firebase-config.js      # Auto-generated Firebase Init
├── environment.js          # Auto-generated Environment Detection
├── service-worker.js       # PWA Offline Caching
│
├── js/
│   ├── auth.js             # Firebase Authentication
│   ├── task-list.js        # TaskList Rendering & CRUD
│   ├── drag-drop.js        # Drag & Drop (Mouse/Touch/Keyboard)
│   ├── recurrence-manager.js  # Wiederkehrende Aufgaben
│   ├── settings-menu.js    # Export/Import/Suche
│   ├── offline-queue.js    # Offline Operation Queue
│   └── utils.js            # Shared Utilities
│
├── lib/
│   └── environment-utils.js  # Build-time Environment Detection
│
├── tests/
│   ├── unit/               # Vitest Unit Tests
│   ├── e2e/                # Playwright E2E Tests
│   └── accessibility/      # WCAG 2.1 Audit
│
├── .env.production         # Firebase Config Production (NICHT committed)
├── .env.staging            # Firebase Config Staging (committed)
├── .env.testing            # Firebase Config Testing (committed)
│
└── .github/
    └── workflows/
        └── deploy.yml      # CI/CD Pipeline (GitHub Actions)
```

### Module Dependencies

```
index.html
  │
  ├─> firebase-config.js (auto-generated)
  ├─> environment.js (auto-generated)
  │
  ├─> js/auth.js
  │     └─> firebase-config.js
  │
  ├─> js/task-list.js
  │     ├─> js/auth.js
  │     ├─> js/recurrence-manager.js
  │     └─> js/offline-queue.js
  │
  ├─> js/drag-drop.js
  │     └─> js/task-list.js
  │
  ├─> js/settings-menu.js
  │     └─> js/task-list.js
  │
  └─> service-worker.js (registered, independent)
```

## Storage Architecture

### Dual Storage Strategy

```
┌────────────────────────────────────────────────────────────┐
│                      User State                             │
└────────────────────────────────────────────────────────────┘
              │
              ├──── Guest User
              │         │
              │         ▼
              │    ┌─────────────────┐
              │    │   IndexedDB     │ (via localForage)
              │    │  ~50MB+ Storage │
              │    └─────────────────┘
              │         │
              │         └─> Persistent Storage API
              │              (verhindert Auto-Delete)
              │
              └──── Authenticated User
                        │
                        ▼
                   ┌─────────────────┐
                   │ Cloud Firestore │
                   │  (Firebase)     │
                   └─────────────────┘
                        │
                        ├─> Realtime Sync
                        ├─> Offline Persistence
                        └─> Security Rules
```

### Offline Queue

```javascript
// Offline Operation Queue
class OfflineQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  async add(operation) {
    this.queue.push(operation);
    await this.saveQueue();
    if (navigator.onLine) {
      await this.processQueue();
    }
  }

  async processQueue() {
    while (this.queue.length > 0 && navigator.onLine) {
      const operation = this.queue[0];
      try {
        await this.executeOperation(operation);
        this.queue.shift();
        await this.saveQueue();
      } catch (error) {
        console.error('Queue operation failed:', error);
        break;
      }
    }
  }
}
```

**Features:**
- ✅ Automatische Retry bei Netzwerk-Rückkehr
- ✅ Persistente Queue (überlebt Page Reload)
- ✅ FIFO Execution Order
- ✅ Error Handling mit Fallback zu lokalem Speicher

## PWA Architecture

### Service Worker Strategy

```javascript
// service-worker.js
const CACHE_VERSION = 'v1.6.1';
const CACHE_NAME = `eisenhauer-${CACHE_VERSION}`;

// Cache-First Strategy für statische Assets
self.addEventListener('fetch', (event) => {
  if (isStaticAsset(event.request.url)) {
    event.respondWith(
      caches.match(event.request)
        .then(cached => cached || fetch(event.request))
    );
  }
});

// Network-First Strategy für Firebase API
if (isFirebaseAPI(event.request.url)) {
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
}
```

**Caching Strategies:**
- **Static Assets** (HTML, CSS, JS, Images): Cache-First
- **Firebase API** (Firestore, Auth): Network-First
- **Environment-Specific Caches**: Separate Cache Names pro Environment

### Manifest Configuration

```json
{
  "name": "Eisenhauer Matrix",
  "short_name": "Eisenhauer",
  "start_url": "/Eisenhauer/",
  "display": "standalone",
  "theme_color": "#2c3e50",
  "background_color": "#ecf0f1",
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Authentication Flow                        │
└──────────────────────────────────────────────────────────────┘

User Visits App
    │
    ▼
Check Auth State (Firebase)
    │
    ├─── Authenticated ──────┐
    │                         │
    │                         ▼
    │                   Load User Tasks
    │                   from Firestore
    │                         │
    │                         ▼
    │                   Subscribe to
    │                   Realtime Updates
    │                         │
    └─── Not Authenticated ──┤
                             │
                             ▼
                       Guest Mode
                       (IndexedDB)
                             │
                             ▼
                    Show Login Prompt
                    (Google/Apple)
                             │
                             ▼
                    User Clicks Login
                             │
                             ▼
                Firebase Auth Popup
                             │
                             ├─ Success ──> Migrate Data
                             │              from IndexedDB
                             │              to Firestore
                             │
                             └─ Cancel ──> Stay in Guest Mode
```

### Auth Persistence

```javascript
// firebase-config.js (auto-generated)
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

const auth = getAuth(app);

// WICHTIG: Auth-State überlebt Browser-Restart
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log('✅ Auth persistence enabled'))
  .catch((error) => console.error('Auth persistence error:', error));
```

## Drag & Drop Architecture

### Multi-Input Support

```
┌──────────────────────────────────────────────────────────────┐
│                  Drag & Drop Manager                          │
└──────────────────────────────────────────────────────────────┘
           │
           ├─── Mouse Input ────┐
           │   (click + drag)    │
           │                     │
           ├─── Touch Input ────┼──> Unified Event Handler
           │   (tap + hold)      │
           │                     │
           └─── Keyboard Input ──┘
               (space + arrows + enter)
                     │
                     ▼
            ┌────────────────────┐
            │  Visual Feedback   │
            │  - Ghost Element   │
            │  - Drop Zones      │
            │  - Focus Indicator │
            └────────────────────┘
                     │
                     ▼
            Task moved to target segment
                     │
                     ▼
            ARIA Announcement (Screen Reader)
```

### Accessibility

**Keyboard Navigation:**
- `Space` - Task auswählen
- `Arrow Keys` - Zwischen Quadranten navigieren
- `Enter` - Verschieben bestätigen
- `Escape` - Abbrechen

**ARIA Live Regions:**
```html
<div role="status" aria-live="polite" aria-atomic="true">
  Aufgabe "Meeting vorbereiten" wurde nach Schedule verschoben
</div>
```

**Screen Reader Support:**
- ✅ VoiceOver (iOS/macOS)
- ✅ NVDA (Windows)
- ✅ JAWS (Windows)
- ✅ TalkBack (Android)

## Recurrence System

```
┌──────────────────────────────────────────────────────────────┐
│              Recurrence Manager Architecture                  │
└──────────────────────────────────────────────────────────────┘

User creates recurring task
    │
    ▼
Save task with recurrence config:
{
  text: "Daily standup",
  recurrence: {
    enabled: true,
    type: "daily",      // daily/weekly/monthly/custom
    interval: 1,        // für custom: Anzahl Tage
    weekdays: [1,2,3,4,5],  // für weekly: Mo-Fr
    dayOfMonth: 15,     // für monthly: Tag im Monat
    nextDue: "2026-01-10T00:00:00Z"
  }
}
    │
    ▼
Background Check (every 60 seconds):
RecurrenceManager.checkDueTasks()
    │
    ▼
Is task due? (nextDue <= now)
    │
    ├─ Yes ──> Create new instance
    │          Update nextDue
    │          Save to Firestore/IndexedDB
    │
    └─ No ──> Skip
```

**Recurrence Types:**
- **Daily**: Jeden Tag um 00:00
- **Weekly**: Bestimmte Wochentage
- **Monthly**: Bestimmter Tag im Monat (1-31)
- **Custom**: Alle N Tage

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main, staging, testing]

jobs:
  deploy:
    steps:
      1. Checkout repository
      2. Setup Node.js 20
      3. Detect environment from branch
      4. Install dependencies (npm ci)
      5. Build for environment (npm run build:$ENV)
      6. Deploy to GitHub Pages (peaceiris/actions-gh-pages)
```

**Branch → Environment Mapping:**
```
main    → production → /
staging → staging    → /staging/
testing → testing    → /testing/
```

**peaceiris/actions-gh-pages Configuration:**
- `keep_files: true` für staging/testing (behält production)
- `keep_files: false` für production (überschreibt root)
- `destination_dir` bestimmt Subdirectory

## Security Architecture

### Firebase Security Rules

```javascript
// Production Rules (strikt)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      // User kann nur eigene Tasks lesen/schreiben
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;

      allow read, update, delete: if request.auth != null
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

### XSS Protection

```javascript
// ✅ CORRECT: Verwende textContent
taskElement.textContent = userInput;

// ❌ WRONG: Niemals innerHTML mit User-Input
taskElement.innerHTML = userInput;  // XSS-Gefahr!
```

**Weitere Maßnahmen:**
- ✅ Input Validierung (max. 140 Zeichen)
- ✅ Firebase Security Rules mit Schema-Validierung
- ✅ Content Security Policy (CSP) Headers
- ✅ HTTPS-only (GitHub Pages)

## Performance Considerations

### Bundle Size

```
index.html:          ~15 KB
styles.css:          ~25 KB
firebase-config.js:   ~5 KB (auto-generated)
js/*.js:            ~80 KB (all modules)
Firebase SDK:       ~150 KB (CDN)
localForage:         ~25 KB (CDN)
────────────────────────────
Total (unkomprimiert): ~300 KB
Total (gzip):         ~100 KB
```

### Lazy Loading

```javascript
// Service Worker pre-cache nur kritische Assets
const CRITICAL_ASSETS = [
  '/Eisenhauer/',
  '/Eisenhauer/index.html',
  '/Eisenhauer/styles.css',
  '/Eisenhauer/firebase-config.js'
];

// Weitere Assets on-demand laden
```

### Lighthouse Scores (Target)

- **Performance:** 90+
- **Accessibility:** 100 (WCAG 2.1 Level AA)
- **Best Practices:** 90+
- **SEO:** 90+

## Monitoring & Debugging

### Environment Detection

```javascript
// Browser Console
console.log('🌍 App Environment:', ENVIRONMENT);
// Output: "testing" / "staging" / "production"

// HTML Inspection
document.body.getAttribute('data-environment');
// Output: "testing"
```

### Firebase Debugging

```javascript
// Enable Firestore Debug Logs
import { enableIndexedDbPersistence } from 'firebase/firestore';

enableIndexedDbPersistence(db, { synchronizeTabs: true })
  .then(() => console.log('✅ Firestore offline persistence enabled'))
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('⚠️ Multiple tabs open, persistence enabled in first tab only');
    } else if (err.code === 'unimplemented') {
      console.warn('⚠️ Browser does not support offline persistence');
    }
  });
```

## Testing Strategy

### Unit Tests (Vitest)

```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

**Coverage Target:** 80%+

### E2E Tests (Playwright)

```bash
npm run test:e2e        # Headless
npm run test:e2e:ui     # UI Mode (interaktiv)
```

**Test Scenarios:**
- ✅ Task CRUD Operations
- ✅ Drag & Drop (Mouse/Touch/Keyboard)
- ✅ Authentication Flow
- ✅ Offline Mode
- ✅ Recurring Tasks

### Accessibility Tests

```bash
npm run test:a11y       # Automated WCAG 2.1 checks
```

**Manual Testing:**
- ✅ Screen Reader Navigation
- ✅ Keyboard-only Navigation
- ✅ Color Contrast (WCAG AA)

Siehe: [tests/accessibility/ACCESSIBILITY_AUDIT.md](tests/accessibility/ACCESSIBILITY_AUDIT.md)

## Deployment

### Manual Deployment

```bash
# 1. Feature entwickeln auf feature/* Branch
git checkout -b feature/my-feature

# 2. PR gegen testing öffnen
gh pr create --base testing

# 3. Nach Merge → Automatischer Deploy auf Testing
# Testing validieren: https://s540d.github.io/Eisenhauer/testing/

# 4. Staging merge
git checkout staging
git merge testing
git push

# 5. Production release
git checkout main
git merge staging
git push
```

### Rollback Strategy

```bash
# Bei Problemen in Production
git revert <commit-hash>
git push origin main

# Oder: Zurück zu vorheriger Version
git reset --hard <previous-commit>
git push origin main --force  # ⚠️ Vorsicht!
```

## Future Improvements

### Geplante Features
- [ ] Archiv für gelöschte Tasks
- [ ] CSV/PDF Export
- [ ] Kategorien/Tags
- [ ] Fälligkeitsdaten mit Notifications
- [ ] Team-Collaboration (shared Firebase projects)

### Technische Optimierungen
- [ ] Code Splitting für größere Module
- [ ] Image Optimization (WebP/AVIF)
- [ ] HTTP/2 Server Push
- [ ] Progressive Enhancement für ältere Browser

## Related Documentation

- [README.md](README.md) - Project Overview & Features
- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Firebase Configuration
- [TESTING.md](TESTING.md) - Testing Guidelines
- [CHANGELOG.md](CHANGELOG.md) - Version History
- [INSTALL.md](INSTALL.md) - Installation Instructions

---

**Last updated:** 2026-01-09

**Issues:** #74, #110, #111
