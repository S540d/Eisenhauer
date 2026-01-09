# Testing Eisenhauer Matrix

Dieses Dokument beschreibt die Testing-Strategie und Umgebungsverwaltung für das Eisenhauer Matrix Projekt.

## Umgebungen

Das Projekt nutzt **3 separate Environments** mit vollständiger Firebase-Isolation:

### 🚀 Production
- **URL:** https://s540d.github.io/Eisenhauer/
- **Branch:** `main`
- **Firebase:** `eisenhauer-matrix`
- **Base URL:** `/Eisenhauer/`
- **Verwendung:** Live-App für produktive Nutzer (TWA/PWA im App Store)

### 🔧 Staging
- **URL:** https://s540d.github.io/Eisenhauer/staging/
- **Branch:** `staging`
- **Firebase:** `eisenhauer-staging`
- **Base URL:** `/Eisenhauer/staging/`
- **Verwendung:** Pre-Production Testing & QA

### 🧪 Testing
- **URL:** https://s540d.github.io/Eisenhauer/testing/
- **Branch:** `testing`
- **Firebase:** `eisenhauer-testing`
- **Base URL:** `/Eisenhauer/testing/`
- **Verwendung:** Feature Development & Experimentelle Features

## Lokale Entwicklung

### Build Commands

```bash
# Development Server (nutzt production config per default)
npm start

# Build für Production
npm run build:production

# Build für Staging
npm run build:staging

# Build für Testing
npm run build:testing
```

### Environment Detection

Die Build-Scripts setzen automatisch:
- **Base href** in `index.html`
- **data-environment** Attribut auf `<body>`
- **Firebase Config** aus entsprechendem `.env.*` File
- **Environment Variables** in `environment.js`

```javascript
// Automatisch generiert beim Build
export const ENVIRONMENT = 'testing'; // oder 'staging', 'production'
export const BASE_URL = '/Eisenhauer/testing/';
```

### Firebase Konfiguration

Jedes Environment nutzt ein **separates Firebase-Projekt**:

```
.env.production  → eisenhauer-matrix (NICHT committed, lokale Entwicklung)
.env.staging     → eisenhauer-staging (committed für GitHub Actions)
.env.testing     → eisenhauer-testing (committed für GitHub Actions)
```

**Wichtig:** Die `.env.*` Files für staging/testing sind committed, da Firebase Web-API-Keys client-seitig sichtbar sind und Sicherheit über Firebase Rules geregelt wird.

Siehe [FIREBASE_SETUP.md](FIREBASE_SETUP.md) für detaillierte Setup-Anleitung.

## Workflow

### 1. Feature Development

```bash
# Feature Branch erstellen
git checkout -b feature/my-feature

# Lokal entwickeln
npm start

# Testing build erstellen
npm run build:testing
```

### 2. Pull Request gegen `testing`

1. PR gegen `testing` Branch öffnen
2. Code Review
3. Nach Merge: Automatischer Deploy auf Testing URL
4. Testing Environment validieren

### 3. Merge in `staging`

```bash
# Wenn Testing erfolgreich
git checkout staging
git merge testing
git push
```

Automatischer Deploy auf Staging URL für Pre-Production QA.

### 4. Production Release

```bash
# Final approval
git checkout main
git merge staging
git push
```

Automatischer Deploy auf Production URL.

## Testing-Strategie

### Unit Tests

```bash
# Vitest Unit Tests
npm test

# Mit Coverage
npm run test:coverage

# Watch Mode
npm run test:watch
```

### E2E Tests

```bash
# Playwright E2E Tests
npm run test:e2e

# UI Mode (interaktiv)
npm run test:e2e:ui
```

### Manuelle Tests

**Testing Environment Checklist:**
- [ ] Firebase Authentication (Google Sign-In)
- [ ] Task CRUD Operations
- [ ] Drag & Drop zwischen Segmenten
- [ ] Wiederkehrende Aufgaben
- [ ] Offline-Funktionalität
- [ ] Service Worker Caching
- [ ] PWA Installation
- [ ] Dark Mode
- [ ] Mobile Responsiveness
- [ ] Keyboard Navigation (Accessibility)

**Pre-Production Checklist (Staging):**
- [ ] Alle Testing-Checks erfolgreich
- [ ] Performance Audit (Lighthouse)
- [ ] Accessibility Audit (WCAG 2.1 AA)
- [ ] Cross-Browser Testing
- [ ] Mobile Device Testing
- [ ] Security Audit (Firebase Rules)

## Firebase Isolation

### Warum separate Firebase-Projekte?

Mit **produktiven Nutzern** (TWA/PWA im App Store) ist es kritisch, dass Testing/Staging-Daten niemals Production-Daten beeinflussen können.

**Risiken ohne Trennung:**
- ❌ Test-Tasks erscheinen in Production-App
- ❌ Nutzer-Daten werden durch Tests gelöscht/modifiziert
- ❌ Firebase-Quota wird durch Tests aufgebraucht
- ❌ Staging-Code könnte Production-DB crashen

**Lösung:**
- ✅ 3 separate Firebase-Projekte
- ✅ Eigene Firestore-Datenbanken
- ✅ Eigene Auth-Nutzer pro Environment
- ✅ Separate Firebase Security Rules

### Verifizierung

**Nach jedem Deployment prüfen:**

```bash
# Console Output checken
echo "Environment: testing"

# Browser DevTools → Console
"🌍 App Environment: testing"

# Firebase Console
# → Authentication → Nutzer im korrekten Projekt
# → Firestore → Daten im korrekten Projekt
```

## Troubleshooting

### Build schlägt fehl

```bash
# Fehler: "Missing environment variables"
# Lösung: .env.* File überprüfen
cat .env.testing
```

### Firebase Init Error

```
Error: auth/invalid-api-key
```

**Lösung:** API-Key in `.env.*` ist falsch oder gehört zum falschen Projekt.

### Tasks erscheinen über Environments hinweg

**Problem:** Du nutzt noch das gleiche Firebase-Projekt für alle Environments.

**Lösung:** Erstelle separate Projekte (siehe [FIREBASE_SETUP.md](FIREBASE_SETUP.md)).

### Service Worker Cache-Probleme

**Symptom:** Alte Version wird angezeigt trotz neuem Deploy.

**Lösung:**
1. Hard Refresh im Browser (Cmd+Shift+R / Ctrl+Shift+R)
2. DevTools → Application → Clear storage
3. Prüfe Cache-Version in `service-worker.js`

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main, staging, testing]

jobs:
  deploy:
    - Detect environment from branch
    - Install dependencies
    - Build for environment (npm run build:$ENV)
    - Deploy to GitHub Pages
```

**Branch Detection:**
- `main` → production → `/`
- `staging` → staging → `/staging/`
- `testing` → testing → `/testing/`

**peaceiris/actions-gh-pages:**
- Deployed zu `gh-pages` Branch
- `keep_files: true` für staging/testing (behält production Files)
- `keep_files: false` für production (überschreibt Root)

## Security

### Firebase Security Rules

**Production (strikt):**
```javascript
// User kann nur eigene Tasks lesen/schreiben
allow read, update, delete: if request.auth != null
  && request.auth.uid == resource.data.userId;
```

**Staging/Testing (pro User, analog zu Production):**
```javascript
// User kann nur eigene Tasks lesen/schreiben (wie in Production)
allow read, update, delete: if request.auth != null
  && request.auth.uid == resource.data.userId;
allow create: if request.auth != null
  && request.auth.uid == request.resource.data.userId;
```

### XSS-Schutz

- ✅ Konsequente Verwendung von `textContent` (nicht `innerHTML`)
- ✅ Input-Validierung (max. 140 Zeichen)
- ✅ Firebase Security Rules mit Validierung
- ✅ Content Security Policy (CSP) Headers

## Performance

### Lighthouse Scores

**Target (Production):**
- Performance: 90+
- Accessibility: 100
- Best Practices: 90+
- SEO: 90+

### Bundle Size

```bash
# Analyse Bundle Size
npm run build:production
ls -lh *.js
```

**Target:** < 500KB total (unkomprimiert)

## Links

- **Issues:** https://github.com/S540d/Eisenhauer/issues
- **Pull Requests:** https://github.com/S540d/Eisenhauer/pulls
- **Firebase Console:** https://console.firebase.google.com/
- **GitHub Actions:** https://github.com/S540d/Eisenhauer/actions

---

**Related Issues:** #74, #110, #111

**Last updated:** 2026-01-09
