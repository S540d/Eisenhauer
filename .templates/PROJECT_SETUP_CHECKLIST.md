---
# Project Setup Checklist

Verwendung: Kopiere diese Checkliste am Anfang jedes neuen Projekts und arbeite sie ab.

**Geschätzte Dauer:** 2-4 Stunden für Basis-Setup

---

## Phase 1: Projekt-Initialisierung (30 Min)

### Repository Setup
- [ ] Repository auf GitHub erstellt
- [ ] Clone lokal: `git clone ...`
- [ ] Initial Commit: `git commit --allow-empty -m "initial commit"`
- [ ] `.gitignore` konfiguriert (Node.js, OS-spezifisch)

### Projekt-Struktur
- [ ] Projekt-Typ bestimmt: **Web** | **PWA** | **React Native/Expo** | **Node.js** | **Android**
- [ ] Abhängige Technologien installiert (Node.js 20+, npm 8+)
- [ ] `package.json` initialisiert mit Projekt-Name

### Basis-Dependencies installieren
```bash
npm install --save-dev prettier eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install --save-dev vitest @vitest/ui jsdom
```
- [ ] Dependencies installiert

---

## Phase 2: Code Qualität Setup (45 Min)

### Prettier Konfiguration
- [ ] `.prettierrc.json` erstellt:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```
- [ ] `npm run format` funktioniert
- [ ] Test: Format eine Datei und verify

### ESLint Konfiguration
- [ ] `.eslintrc.json` erstellt (für dein Projekt-Typ)
- [ ] `npm run lint` funktioniert
- [ ] Test: `npm run lint` sollte durchlaufen

### TypeScript Setup
- [ ] `tsconfig.json` erstellt mit `"strict": true`
- [ ] `npm run type-check` funktioniert

### npm Scripts konfigurieren
- [ ] In `package.json` folgende Scripts hinzufügen:
```json
{
  "scripts": {
    "dev": "...",
    "build": "...",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint .",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```
- [ ] Alle Scripts tested und funktionieren

---

## Phase 3: Testing Setup (30 Min)

### Vitest/Jest Konfiguration
- [ ] `vitest.config.ts` oder `jest.config.js` erstellt
- [ ] `npm run test` funktioniert
- [ ] Test-File Beispiel geschrieben
- [ ] Coverage-Reporting konfiguriert

### Test Struktur
- [ ] Verzeichnis erstellt: `src/__tests__/` oder `tests/`
- [ ] Test-Naming Convention festgelegt: `*.test.ts` oder `*.spec.ts`

---

## Phase 4: Design & UX Vorgaben (1-2 Stunden)

### Design System Entscheidungen
Siehe [ux-vorgaben.md → Moderne Design-Systeme](ux-vorgaben.md#-moderne-design-systeme-20242025)

- [ ] Design-System gewählt:
  - [ ] Option 1: "Soft & Modern" ⭐ (Empfohlen)
  - [ ] Option 2: "Minimal & Clean"
  - [ ] Option 3: "Glassmorphism & Modern"

### Farbpalette definieren
- [ ] Primäre Farbpalette definiert (max 5 Farben)
- [ ] Semantische Farben definiert:
  ```
  - success: #10b981
  - warning: #f59e0b
  - danger: #ef4444
  - info: #3b82f6
  ```
- [ ] Dark Mode Farben definiert (oder Inversion vorbereitet)
- [ ] CSS Variables oder Tokens-Datei erstellt

### Typography
- [ ] Max 2 Schriftarten ausgewählt
- [ ] Font Size Scale definiert (basierend auf 16px)
- [ ] Line Heights definiert (Body: 1.5-1.6, Headings: 1.2-1.3)

### Spacing System
- [ ] 8px Base Grid dokumentiert
- [ ] CSS Variables für Spacing erstellt:
  ```css
  --space-2: 0.5rem;   /* 8px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  ```

### Responsive Breakpoints
- [ ] Breakpoints definiert:
  ```css
  --bp-sm: 320px;   /* Mobile */
  --bp-md: 768px;   /* Tablet */
  --bp-lg: 1024px;  /* Desktop */
  --bp-xl: 1280px;  /* Large Desktop */
  ```

### Dark Mode Support
- [ ] CSS Variables für Light/Dark Mode vorbereitet
- [ ] `prefers-color-scheme` Media Query implementiert
- [ ] localStorage Theme-Persistierung vorbereitet

---

## Phase 5: Barrierefreiheit Vorbereitung (30 Min)

Siehe [ux-vorgaben.md → Barrierefreiheit](ux-vorgaben.md#barrierefreiheit-accessibility--wcag-21-aa)

### WCAG 2.1 AA Standards
- [ ] Kontrast-Tools bekannt: [Accessible Colors](https://accessible-colors.com/)
- [ ] Farbpalette auf Kontrast 4.5:1 überprüft
- [ ] Semantic HTML Standard dokumentiert
- [ ] Touch Target Minimum (44px) dokumentiert

### Checkliste für Development
- [ ] Semantic HTML: `<button>`, `<nav>`, `<main>` verwenden
- [ ] ARIA Labels für Icons: `aria-label="Menu"`
- [ ] Focus Rings sichtbar machen
- [ ] Keyboard Navigation: Tab, Escape, Enter funktionieren
- [ ] Alt Text für Bilder: jedes `<img>` hat `alt` Attribut

---

## Phase 6: Sicherheit Setup (30 Min)

Siehe [technische_vorgaben.md → Sicherheit](technische_vorgaben.md#sicherheit-security)

### Environment Variables
- [ ] `.env.example` erstellt (ohne Secrets!)
- [ ] `.env` in `.gitignore` eingetragen
- [ ] `.env.local` in `.gitignore` eingetragen
- [ ] Environment-Handling dokumentiert

### Input Validation
- [ ] Input Validation Strategie definiert (Client + Server)
- [ ] Sanitization Library ggfs. installiert (z.B. `dompurify`)

### HTTPS & Security Headers
- [ ] HTTPS-only Policy dokumentiert
- [ ] CORS Configuration geplant

---

## Phase 7: CI/CD Setup (45 Min - 1 Stunde)

Siehe [technische_vorgaben.md → CI/CD & GitHub Actions](technische_vorgaben.md#cicd--github-actions)

### GitHub Actions Workflow
- [ ] `.github/workflows/ci.yml` erstellt
- [ ] Workflow führt aus:
  - [ ] `npm run format --check`
  - [ ] `npm run lint`
  - [ ] `npm run type-check`
  - [ ] `npm run test --coverage`
  - [ ] `npm run build`
- [ ] Workflow getestet auf Feature-Branch
- [ ] Workflow erfolgreich beim Push

### Branch Protection
- [ ] `main` Branch geschützt
- [ ] 1x Review erforderlich
- [ ] CI/CD Must Pass

### Pre-Commit Hooks (Optional aber Empfohlen)
```bash
npm install husky lint-staged --save-dev
npx husky install
```
- [ ] `.husky/pre-commit` erstellt
- [ ] Verhindert `console.log` in Production Code
- [ ] Verhindert `debugger` Statements
- [ ] Test: Versuche `console.log` zu committen → sollte fehlschlagen

---

## Phase 8: Projekt-spezifische Vorgaben

### Falls **Web/PWA Projekt**:
- [ ] `public/manifest.json` erstellt (PWA Manifest)
- [ ] Service Worker geplant
- [ ] Lighthouse Target dokumentiert: 80+ in allen Kategorien
- [ ] Versionierung im `package.json` auf `1.0.0` gesetzt

### Falls **React Native/Expo Projekt**:
Siehe [technische_vorgaben.md → PWA & React Native](technische_vorgaben.md#pwa--react-native-expo-vorgaben)

- [ ] Expo Account erstellt
- [ ] `eas-cli` installiert: `npm install -g eas-cli`
- [ ] EAS Init: `eas init`
- [ ] `app.json` konfiguriert:
  ```json
  {
    "expo": {
      "updates": {
        "enabled": true,
        "checkAutomatically": "ON_LOAD",
        "url": "https://u.expo.dev/YOUR-PROJECT-ID"
      },
      "runtimeVersion": { "policy": "appVersion" }
    }
  }
  ```
- [ ] Project ID in `app.json` eingetragen
- [ ] Platform.OS für Data Loading dokumentiert (NICHT typeof window!)

### Falls **Android Projekt**:
Siehe [technische_vorgaben.md → Android App Entwicklung](technische_vorgaben.md#android-app-entwicklung)

- [ ] `compileSdk = 36` und `targetSdk = 36` gesetzt
- [ ] Material Components >= 1.13.0 installiert
- [ ] Edge-to-Edge implementiert
- [ ] Themes konfiguriert (Light & Dark)
- [ ] App Links / Deep Linking geplant

### Falls **Node.js/Backend Projekt**:
Siehe [technische_vorgaben.md → Node.js/Backend Projects](technische_vorgaben.md#nodejs-backend-projects)

- [ ] API Structure dokumentiert
- [ ] Error Handling Strategy definiert
- [ ] Database Connection Pool konfiguriert
- [ ] Logging Setup (z.B. Winston, Pino)

---

## Phase 9: Settings Menu Setup (30 Min)

Siehe [ux-vorgaben.md → Settings Menu](ux-vorgaben.md#settings-menu-standardized-struktur)

### Standardisierte Settings-Struktur planen
- [ ] Appearance Section:
  - [ ] Theme Toggle: Light, Dark, System
  - [ ] Language Toggle: English, Deutsch (falls zutreffend)
- [ ] App-spezifische Settings (falls nötig)
- [ ] User Account Management (falls Auth vorhanden)
- [ ] Export/Data Management (falls nötig)
- [ ] Feedback/Support/About in einer Zeile:
  - [ ] Feedback Link: `mailto:devsven@posteo.de?subject=...`
  - [ ] Support Link: `https://ko-fi.com/devsven`
  - [ ] About Button: Öffnet Modal mit Version & License

### Design Token verwenden
```css
--settings-bg
--settings-text
--settings-button-active
--settings-button-border-radius
```
- [ ] Design Token für Settings in CSS/Constants definiert

---

## Phase 10: Documentation (30 Min)

### README.md
- [ ] Project Description
- [ ] Installation Instructions
- [ ] Usage Guide
- [ ] Known Issues (falls vorhanden)
- [ ] Contributing Guidelines
- [ ] License

### CHANGELOG.md
- [ ] Struktur vorbereitet:
  ```markdown
  ## [1.0.0] - 2025-12-26
  ### Added
  - Initial release
  ```

### Vorgaben-Links in Projekt-Dokumentation
- [ ] Link zu [technische_vorgaben.md](technische_vorgaben.md)
- [ ] Link zu [ux-vorgaben.md](ux-vorgaben.md)
- [ ] Link zu [STANDARDS_OVERVIEW.md](STANDARDS_OVERVIEW.md)

---

## Phase 11: Initial Commit & Ersten Test

### Alles zusammen testen
- [ ] `npm install` funktioniert
- [ ] `npm run format` funktioniert
- [ ] `npm run lint` (keine Fehler)
- [ ] `npm run type-check` (keine Fehler)
- [ ] `npm run test` (mindestens 1 Test)
- [ ] `npm run build` (erfolgreich)
- [ ] Alle Files committed

### First Commit
```bash
git add .
git commit -m "initial: Project setup with standards"
git tag v1.0.0-initial
```
- [ ] Initial Commit erstellt
- [ ] Tag gesetzt

---

## Phase 12: Finale Pre-Production Vorbereitung

### Code Quality Checklist
Siehe [technische_vorgaben.md → Checkliste vor Production Deploy](technische_vorgaben.md#checkliste-vor-production-deploy)

- [ ] Alle Tests grün
- [ ] Code Coverage >= 60%
- [ ] ESLint Check bestanden
- [ ] TypeScript bestanden
- [ ] Prettier Formatierung
- [ ] Build erfolgreich
- [ ] Lighthouse >= 80 (PWA)
- [ ] Keine `console.log` in Production

### UX Quality Checklist
Siehe [ux-vorgaben.md → Checkliste für neues Projekt](ux-vorgaben.md#checkliste-für-neues-projekt)

- [ ] Color Palette definiert
- [ ] Typography definiert
- [ ] Spacing System definiert
- [ ] Responsive Breakpoints definiert
- [ ] Dark Mode unterstützt
- [ ] Accessibility Checklist durchgegangen
- [ ] Keyboard Navigation getestet
- [ ] Focus Rings sichtbar
- [ ] Touch Targets >= 44px

---

## 🎉 Setup Complete!

Gratuliere! Dein Projekt folgt jetzt den Standards.

**Nächste Schritte:**
1. Feature Development starten
2. [STANDARDS_OVERVIEW.md](STANDARDS_OVERVIEW.md) als Referenz verwenden
3. Regelmäßig gegen [technische_vorgaben.md](technische_vorgaben.md) + [ux-vorgaben.md](ux-vorgaben.md) abgleichen

---

## 📊 Checklisten zum Ausdrucken

### Developer Checklist (täglich)
```
□ npm run format
□ npm run lint
□ npm run type-check
□ npm run test
□ Keine console.log in production code
□ Keine console.log commits
□ Committen mit aussagekräftiger Message
```

### Vor jedem PR
```
□ Alle Tests grün (npm run test)
□ Lint bestanden (npm run lint)
□ Type-Check bestanden (npm run type-check)
□ Build erfolgreich (npm run build)
□ Coverage überprüft
□ README ggfs. aktualisiert
□ CHANGELOG ggfs. aktualisiert
```

### Vor jedem Release
Siehe [technische_vorgaben.md → Pre-Production Checklist](technische_vorgaben.md#checkliste-vor-production-deploy)

---

**Fragen?** Siehe [STANDARDS_OVERVIEW.md](STANDARDS_OVERVIEW.md) für Links zu spezifischen Themen.
