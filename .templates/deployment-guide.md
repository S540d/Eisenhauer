# 🚀 Deployment & Project Setup Guide

Umfassender Leitfaden für Projekt-Setup, Code-Qualität, Deployment und Qualitätssicherung.

## 📋 Inhaltsverzeichnis

1. [Essenzielle Dateien](#-essenzielle-dateien)
2. [Technische Konfiguration](#-technische-konfiguration)
3. [Code-Qualität](#-code-qualität)
4. [GitHub Repository Setup](#-github-repository)
5. [PWA-Spezifisch](#-pwa-spezifisch)
6. [Rechtliches](#-rechtliches)
7. [Sicherheit](#-sicherheit)
8. [Deployment](#-deployment)
9. [Qualitätssicherung](#-qualitätssicherung)
10. [Dokumentation](#-dokumentation)
11. [Best Practices](#-best-practices)
12. [Links & Referenzen](#-links--referenzen)
13. [React Native / Expo Spezifisch](#-react-native--expo-projekte)
14. [Quick-Check vor Deployment](#-quick-check-vor-deployment)
15. [Implementierungs-Reihenfolge](#-implementierungs-reihenfolge)

---

## ✅ Essenzielle Dateien

Jedes Projekt muss folgende Dateien enthalten:

- [ ] **LICENSE** - Open Source Lizenz (z.B. MIT mit Ausschluss kommerzieller Nutzung)
- [ ] **README.md** - Projekt-Dokumentation mit:
  - Projekt-Beschreibung
  - Installation-Anleitung
  - Deployment-Anleitung
  - Features
  - Live-Demo-Link
  - Screenshot/Demo
- [ ] **.gitignore** - Korrekt konfiguriert:
  - `node_modules/`
  - `dist/` oder `build/`
  - `.env` und andere Umgebungsvariablen
  - Keine Passwörter, personenbezogene Daten oder nicht-relevante Notizen
- [ ] **package.json** - Vollständig mit:
  - Alle notwendigen Scripts (`build:web`, `deploy`, etc.)
  - Repository URL
  - Homepage URL (GitHub Pages)
  - Bug Tracker URL
- [ ] **app.json** (Expo) - `baseUrl` für GitHub Pages konfiguriert

---

## 🔧 Technische Konfiguration

### GitHub Actions Workflow

**Datei:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build:web
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### PWA Manifest

**Datei:** `public/manifest.json`

```json
{
  "name": "App Name",
  "short_name": "App",
  "description": "App Beschreibung",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#6200EE",
  "background_color": "#FFFFFF",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker

**Datei:** `public/service-worker.js`

```javascript
const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

### Icons

- [ ] **Icon 192x192** - `public/icon-192.png`
- [ ] **Icon 512x512** - `public/icon-512.png`
- [ ] **Favicon** - `public/favicon.ico`

### Post-Build Script (Optional)

**Datei:** `scripts/post-build.js`

```javascript
const fs = require('fs');
const path = require('path');

// Create .nojekyll file for GitHub Pages
const distPath = path.join(__dirname, '..', 'dist');
fs.writeFileSync(path.join(distPath, '.nojekyll'), '');

console.log('✓ Post-build tasks completed');
```

### Cache-Busting

Implementierung von Cache-Busting-Strategien für statische Assets:

- **Dateinamen-Hashing**: `app.js` → `app.abc123.js`
- **Query-Parameter**: `app.js?v=1.0.0`
- **Service Worker Updates**: Bei neuen Versionen Cache invalidieren

**Beispiel:**

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  }
}
```

---

## 📝 Code-Qualität

### Checkliste

- [ ] **Keine Secrets im Code** - API Keys, Passwörter, Tokens
- [ ] **Keine sensiblen Daten** - `.env` Dateien in `.gitignore`
- [ ] **Console.logs entfernt** - Oder nur für Debug mit `if (__DEV__)`
- [ ] **TODO-Kommentare bereinigt** - Alle TODOs abgearbeitet oder dokumentiert
- [ ] **Toter Code entfernt** - Ungenutzte Funktionen, Imports, Komponenten
- [ ] **Dateigröße prüfen** - Wenn mehr als 1000 Zeilen, Aufteilung erwägen

### Code-Review Checklist

```javascript
// ❌ BAD - Secrets im Code
const API_KEY = 'sk-1234567890abcdef';

// ✅ GOOD - Umgebungsvariablen
const API_KEY = process.env.REACT_APP_API_KEY;
```

```javascript
// ❌ BAD - Console.logs in Production
console.log('User data:', userData);

// ✅ GOOD - Conditional Logging
if (__DEV__) {
  console.log('User data:', userData);
}
```

---

## 🌐 GitHub Repository

### Setup-Schritte

1. **Repository erstellen**
   - Repository Public (für kostenlose GitHub Pages)
   - Repository-Name = URL-Path (keine Sonderzeichen, Leerzeichen)

2. **Repository-Einstellungen**
   - Aussagekräftige Description
   - Topics/Tags setzen (z.B. `pwa`, `react`, `typescript`)
   - Website URL (GitHub Pages URL)

3. **GitHub Pages aktivieren**
   - Settings → Pages → Source: GitHub Actions

4. **Branch-Strategie**
   - `main` = Production Branch
   - Feature-Branches optional

### Checkliste

- [ ] **Repository Public**
- [ ] **Description vorhanden**
- [ ] **Topics/Tags gesetzt**
- [ ] **GitHub Pages aktiviert**
- [ ] **Repository-Name korrekt**

---

## 📱 PWA-Spezifisch

### Manifest Checkliste

- [ ] **Name** - Vollständiger App-Name
- [ ] **Short Name** - Kurzform (max 12 Zeichen)
- [ ] **Description** - Aussagekräftige Beschreibung
- [ ] **Icons** - Mindestens 192x192 und 512x512
- [ ] **Start URL** - `/` oder spezifischer Pfad
- [ ] **Display** - `standalone` oder `fullscreen`
- [ ] **Theme Color** - Primärfarbe der App
- [ ] **Background Color** - Splash Screen Farbe

### Service Worker Checkliste

- [ ] **Registrierung** - In `index.html` oder `App.tsx`
- [ ] **Cache-Strategie** - Network-First, Cache-First, etc.
- [ ] **Update-Mechanismus** - Automatische Updates
- [ ] **Offline-Fallback** - Offline-Seite für nicht-gecachte Inhalte

### Service Worker Registration

**Vanilla JavaScript:**

```javascript
// public/index.html
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.error('Service Worker registration failed'));
  });
}
```

**React Native (Expo):**

```typescript
// App.tsx
import * as Updates from 'expo-updates';

useEffect(() => {
  async function checkAndApplyUpdates() {
    if (!__DEV__) {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        // Silently ignore update errors
      }
    }
  }
  checkAndApplyUpdates();
}, []);
```

---

## ⚖️ Rechtliches

### Lizenz

**Datei:** `LICENSE`

**Empfehlung:** MIT License mit Ausschluss kommerzieller Nutzung

```
MIT License

Copyright (c) 2025 [Dein Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and to permit
persons to whom the Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

COMMERCIAL USE RESTRICTION: This software may not be used for commercial
purposes without explicit written permission from the copyright holder.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Attributions

Bei Verwendung von Daten Dritter:

**Beispiel (SMARD.de):**

```markdown
## Datenquellen

Diese App nutzt Daten von:
- SMARD.de - Strommarktdaten der Bundesnetzagentur
- Lizenz: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
```

### Third-Party Lizenzen

**Datei:** `THIRD_PARTY_LICENSES.md`

```markdown
# Third-Party Licenses

## React Native
- License: MIT
- Copyright: Facebook, Inc.

## Expo
- License: MIT
- Copyright: Expo

[... weitere Dependencies ...]
```

### Datenschutz

- [ ] **Keine unnötige Datensammlung**
- [ ] **Daten lokal speichern** (localStorage, AsyncStorage)
- [ ] **Keine Tracking-Scripts** (ohne Zustimmung)
- [ ] **Datenschutzerklärung** (falls nötig)

### Checkliste

- [ ] **Lizenz-Datei vorhanden**
- [ ] **Datenquellen-Attribution** (falls verwendet)
- [ ] **Keine Copyright-Verletzungen**
- [ ] **Datenschutz berücksichtigt**
- [ ] **Third-Party-Lizenzen dokumentiert**

---

## 🔒 Sicherheit

### Credentials & Secrets

- [ ] **Keine Credentials committed** - API Keys, Passwörter, Tokens
- [ ] **`.env` in `.gitignore`** - Umgebungsvariablen ausschließen
- [ ] **Secrets in GitHub Actions** - Als Repository Secrets speichern

### Dependencies

- [ ] **Dependencies aktuell** - Regelmäßig `npm audit` ausführen
- [ ] **Vulnerabilities fixen** - `npm audit fix` oder manuelle Updates
- [ ] **Lock-File committed** - `package-lock.json` oder `yarn.lock`

```bash
# Dependencies prüfen
npm audit

# Automatische Fixes
npm audit fix

# Manuelle Review
npm audit fix --force
```

### Web Security

- [ ] **HTTPS erzwungen** - GitHub Pages macht das automatisch
- [ ] **XSS-Schutz** - Keine `innerHTML` mit User-Input
- [ ] **CORS richtig konfiguriert** - Falls API-Calls

**XSS-Beispiel:**

```javascript
// ❌ BAD - XSS-Gefahr
element.innerHTML = userInput;

// ✅ GOOD - Sicher
element.textContent = userInput;
```

**CORS-Beispiel:**

```javascript
// Server-seitig (falls eigener Backend)
app.use(cors({
  origin: 'https://s540d.github.io',
  credentials: true
}));
```

---

## 🚀 Deployment

### Build Prozess

1. **Lokal testen**
   ```bash
   npm run build:web
   ```

2. **Build-Ordner prüfen**
   ```bash
   ls dist/
   # Erwartete Dateien:
   # - index.html
   # - assets/
   # - manifest.json
   # - service-worker.js
   # - icons/
   ```

3. **Build-Errors beheben**
   - TypeScript Errors
   - Missing Assets
   - Broken Imports

4. **Build-Warnings prüfen**
   - Kritische Warnings beheben
   - Unkritische dokumentieren

### Deployment-Methoden

#### Methode 1: GitHub Actions (Empfohlen)

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:web
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### Methode 2: Manuell mit gh-pages

```bash
# package.json
{
  "scripts": {
    "deploy": "npm run build:web && gh-pages -d dist"
  }
}
```

```bash
# Deployment
npm run deploy
```

### Relative Pfade

Für Subpath-Deployment (z.B. `https://username.github.io/project-name/`):

**Vite:**

```javascript
// vite.config.js
export default {
  base: '/project-name/'
}
```

**Expo:**

```json
// app.json
{
  "expo": {
    "web": {
      "bundler": "metro",
      "output": "static",
      "baseUrl": "/project-name/"
    }
  }
}
```

### Checkliste

- [ ] **Build lokal erfolgreich**
- [ ] **Keine Build-Errors**
- [ ] **Keine kritischen Build-Warnings**
- [ ] **Dist-Ordner korrekt** (alle Assets vorhanden)
- [ ] **Relative Pfade** (für Subpath-Deployment)
- [ ] **`.nojekyll` in dist/** (verhindert Jekyll-Processing)

---

## 📊 Qualitätssicherung

### Vor Deployment

- [ ] **App läuft lokal** - `npm run web` oder `npm start`
- [ ] **App läuft als PWA** - Lighthouse PWA-Check
- [ ] **App läuft auf Android** (optional) - `npm run android`
- [ ] **Grundfunktionen getestet** - Alle Features manuell testen
- [ ] **Dark Mode funktioniert** (falls implementiert)
- [ ] **Export funktioniert** (falls implementiert)
- [ ] **Mobile-responsive** - Verschiedene Bildschirmgrößen testen
- [ ] **Loading-States vorhanden** - Während Daten geladen werden

### Testing-Checklist

```markdown
## Funktions-Tests

- [ ] App startet ohne Fehler
- [ ] Theme-Toggle funktioniert (System/Dunkel)
- [ ] Sprach-Toggle funktioniert (DE/EN)
- [ ] Settings-Modal öffnet/schließt
- [ ] Daten werden korrekt angezeigt
- [ ] Export-Funktionalität (falls vorhanden)
- [ ] Metrik-Ansicht (falls vorhanden)
- [ ] Offline-Modus (PWA)
- [ ] Update-Mechanismus (Expo)

## Browser-Tests

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (Desktop)
- [ ] Safari (iOS)
- [ ] Chrome (Android)

## Device-Tests

- [ ] Desktop (>1024px)
- [ ] Tablet (768px-1024px)
- [ ] Mobile (320px-768px)
```

### Lighthouse-Audit

```bash
# Installation
npm install -g lighthouse

# Audit
lighthouse https://your-app-url.github.io --view

# Ziele:
# - Performance: >90
# - Accessibility: >90
# - Best Practices: >90
# - PWA: 100
```

---

## 📚 Dokumentation

### README.md Struktur

```markdown
# App Name

> Kurze Beschreibung der App (1-2 Sätze)

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://username.github.io/project-name/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

![Screenshot](docs/screenshot.png)

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

\`\`\`bash
git clone https://github.com/username/project-name.git
cd project-name
npm install
\`\`\`

## Development

\`\`\`bash
# Web
npm run web

# Android (optional)
npm run android

# iOS (optional)
npm run ios
\`\`\`

## Deployment

\`\`\`bash
npm run build:web
npm run deploy
\`\`\`

## Tech Stack

- React Native / Expo
- TypeScript
- PWA

## License

MIT License - see [LICENSE](LICENSE)

## Contact

Feedback: devsven@posteo.de
\`\`\`

### Weitere Dokumentation

- [ ] **CHANGELOG.md** - Versionshistorie
- [ ] **CONTRIBUTING.md** (optional) - Beitrags-Richtlinien
- [ ] **KNOWN_ISSUES.md** (falls nötig) - Bekannte Probleme

### CHANGELOG.md Beispiel

```markdown
# Changelog

## [1.0.0] - 2025-01-15

### Added
- Initial release
- Dark Mode support
- Export functionality

### Fixed
- Layout issue on mobile devices

### Changed
- Updated Settings menu layout
```

---

## 🎯 Best Practices

### Commit Messages

**Format:** `<type>: <subject>`

**Types:**
- `feat:` - Neue Features
- `fix:` - Bug Fixes
- `docs:` - Dokumentation
- `style:` - Formatierung
- `refactor:` - Code-Umstrukturierung
- `test:` - Tests
- `chore:` - Wartung

**Beispiele:**

```bash
git commit -m "feat: Add dark mode toggle"
git commit -m "fix: Correct answer box positioning"
git commit -m "docs: Update README with installation steps"
```

### Semantic Versioning

**Format:** `MAJOR.MINOR.PATCH`

- `MAJOR` - Breaking Changes (1.0.0 → 2.0.0)
- `MINOR` - Neue Features (1.0.0 → 1.1.0)
- `PATCH` - Bug Fixes (1.0.0 → 1.0.1)

**package.json:**

```json
{
  "version": "1.2.3"
}
```

### Branch-Strategie

```
main (production)
  ├── feature/new-feature
  ├── fix/bug-fix
  └── docs/update-readme
```

**Workflow:**

```bash
# Feature Branch erstellen
git checkout -b feature/new-feature

# Änderungen committen
git add .
git commit -m "feat: Add new feature"

# Push zu GitHub
git push origin feature/new-feature

# Pull Request erstellen
# Nach Merge: Branch löschen
```

### Checkliste

- [ ] **Commit-Messages aussagekräftig**
- [ ] **Branch-Strategie** (main = Production)
- [ ] **Semantic Versioning** (in package.json)
- [ ] **Changelog** (optional, aber hilfreich)

---

## 🔗 Links & Referenzen

### package.json

```json
{
  "name": "app-name",
  "version": "1.0.0",
  "description": "App Beschreibung",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/project-name.git"
  },
  "homepage": "https://username.github.io/project-name/",
  "bugs": {
    "url": "https://github.com/username/project-name/issues"
  },
  "author": "Dein Name <email@example.com>",
  "license": "MIT"
}
```

### Checkliste

- [ ] **GitHub Repository URL** in package.json
- [ ] **Homepage URL** in package.json (GitHub Pages)
- [ ] **Bug Tracker URL** (GitHub Issues)
- [ ] **Support-Kontakt** (Feedback-Email)

---

## 📱 React Native / Expo Projekte

### Dependencies

**Essenzielle Pakete:**

```bash
# Expo SDK
npx expo install expo

# Web Support
npx expo install react-native-web react-dom

# SVG Support (für Settings-Icon)
npx expo install react-native-svg

# AsyncStorage (für Persistierung)
npx expo install @react-native-async-storage/async-storage

# Updates (für OTA Updates)
npx expo install expo-updates
```

### Deployment Scripts

**Datei:** `scripts/deploy.sh`

```bash
#!/bin/bash
echo "Building app..."
npx expo export --platform web --output-dir dist

echo "Fixing paths for GitHub Pages..."
node scripts/fix-paths.js

cd dist && touch .nojekyll && cd ..

echo "Deploying to GitHub Pages..."
npx gh-pages -d dist
```

**Datei:** `scripts/fix-paths.js`

```javascript
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Replace paths for GitHub Pages subpath
const repoName = 'RepositoryName'; // ANPASSEN!
html = html.replace(/href="\/_expo/g, `href="/${repoName}/_expo`);
html = html.replace(/src="\/_expo/g, `src="/${repoName}/_expo`);
html = html.replace(/href="\/favicon/g, `href="/${repoName}/favicon`);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✓ Fixed paths for GitHub Pages');
```

### Platform-Specific Code

```typescript
import { Platform } from 'react-native';

// Platform Check
if (Platform.OS === 'web') {
  // Web-spezifischer Code
}

if (Platform.OS === 'android') {
  // Android-spezifischer Code
}

if (Platform.OS === 'ios') {
  // iOS-spezifischer Code
}
```

### Checkliste

- [ ] **Expo SDK Version aktuell**
- [ ] **react-native-web installiert**
- [ ] **react-native-svg installiert**
- [ ] **@react-native-async-storage/async-storage installiert**
- [ ] **expo-updates installiert** (für OTA Updates)
- [ ] **Platform-specific Code** (falls nötig)
- [ ] **Deployment Scripts** (deploy.sh, fix-paths.js)
- [ ] **app.json konfiguriert** (baseUrl für Web)

---

## ⚡ Quick-Check vor Deployment

### Für React Native/Expo Projekte

```bash
# 1. Dependencies installieren
npm install

# 2. Build testen
npx expo export --platform web --output-dir dist

# 3. Git Status prüfen
git status
# Erwartung: Keine uncommitted changes (oder nur geplante Änderungen)

# 4. Letzter Commit aussagekräftig
git log -1
# Erwartung: Klare Commit-Message

# 5. Dist-Ordner prüfen
ls dist/
# Erwartung: index.html, _expo/, favicon.ico, manifest.json

# 6. Deploy
npm run deploy
# Oder: GitHub Actions triggered automatisch nach Push
```

### Für Vanilla JavaScript Projekte

```bash
# 1. Dependencies installieren
npm install

# 2. Build testen
npm run build:web

# 3. Git Status prüfen
git status

# 4. Letzter Commit aussagekräftig
git log -1

# 5. Dist-Ordner prüfen
ls dist/
# Erwartung: index.html, assets/, manifest.json, service-worker.js

# 6. Push (GitHub Actions deployed automatisch)
git push origin main
```

### Erfolgreich implementierte Referenz-Projekte

- ✅ **Eisenhauer** (Vanilla JS): Settings-Icon, Theme-Toggle, Footer
  - https://s540d.github.io/Eisenhauer

- ✅ **Pflanzkalender** (React Native/Expo): Vollständige Publishing-Checklist Standards
  - https://s540d.github.io/Pflanzkalender

- ✅ **1x1 Trainer** (React Native/Expo): Dynamic UI, Settings Menu, OTA Updates
  - https://s540d.github.io/1x1_Trainer

---

## 🎯 Implementierungs-Reihenfolge

### Phase 1: Projekt-Setup

1. **Repository erstellen** - GitHub Repository anlegen
2. **Essenzielle Dateien** - LICENSE, README.md, .gitignore
3. **Dependencies installieren** - Alle benötigten Pakete
4. **GitHub Actions** - Deployment Workflow einrichten

### Phase 2: Code-Qualität

5. **Code bereinigen** - TODO-Kommentare, console.logs entfernen
6. **Secrets prüfen** - Keine API Keys im Code
7. **Dependencies aktualisieren** - `npm audit` ausführen
8. **Dateigröße prüfen** - Große Dateien aufteilen

### Phase 3: PWA-Setup (falls PWA)

9. **Manifest erstellen** - `public/manifest.json`
10. **Service Worker** - `public/service-worker.js`
11. **Icons hinzufügen** - 192x192 und 512x512
12. **Service Worker registrieren** - In index.html oder App.tsx

### Phase 4: Deployment

13. **Build lokal testen** - `npm run build:web`
14. **Deployment Scripts** (Expo) - deploy.sh, fix-paths.js
15. **GitHub Pages aktivieren** - Settings → Pages
16. **Ersten Deployment** - Push oder manueller Deploy

### Phase 5: Qualitätssicherung

17. **Funktions-Tests** - Alle Features testen
18. **Browser-Tests** - Chrome, Firefox, Safari
19. **Mobile-Tests** - Verschiedene Geräte
20. **Lighthouse-Audit** - Performance, Accessibility, PWA

### Phase 6: Dokumentation

21. **README vervollständigen** - Installation, Features, Screenshots
22. **CHANGELOG erstellen** - Versionshistorie
23. **Lizenz-Attribution** (falls nötig) - Third-Party Lizenzen
24. **Known Issues dokumentieren** (falls vorhanden)

---

## 📋 Zusammenfassung

Diese Anleitung deckt alle Aspekte eines professionellen Deployments ab:

✅ **Setup** - Repository, Dependencies, Konfiguration
✅ **Qualität** - Code-Review, Security, Best Practices
✅ **Deployment** - Build, GitHub Actions, PWA
✅ **Testing** - Funktions-Tests, Browser-Tests, Lighthouse
✅ **Dokumentation** - README, CHANGELOG, Lizenzen

Verwende die Checklisten, um sicherzustellen, dass nichts vergessen wird. Die Code-Beispiele sind in realen Projekten getestet und können direkt übernommen werden.

**Viel Erfolg beim Deployment! 🚀**
