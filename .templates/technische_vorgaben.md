---
# Technische Vorgaben für Projekte

Allgemeine technische Standards für alle Projekttypen (Web, PWA, Node.js, TypeScript, etc.).

## Code-Qualität

### Formatierung (Pflicht)
- **Prettier:** Alle Dateien müssen mit Prettier formatiert werden
  - Automatisch bei jedem Commit (Pre-Commit Hook empfohlen)
  - Konfiguration: `.prettierrc.json` im Projekt Root
  - Kommando: `npm run format` (oder `prettier --write .`)

### Linting (Pflicht)
- **ESLint:** Alle JavaScript/TypeScript Dateien müssen linted werden
  - Nutze moderne ESLint Konfiguration (v8+)
  - Für JavaScript: `eslint-config-standard` oder `eslint-config-airbnb-base`
  - Für TypeScript: `@typescript-eslint/parser` + `@typescript-eslint/eslint-plugin`
  - Kommando: `npm run lint`

### TypeScript (Empfohlen für neue Projekte)
- **Type Safety:** Nutze TypeScript für bessere Developer Experience und Fehlerprävention
- **Strict Mode:** Aktiviere `strict: true` in `tsconfig.json`
- **Type Coverage:** Mindestens 80% Type Coverage für neue Code-Teile
- Kommando: `npm run type-check`

### Code Comments
- **Keine Debug-Logs in Production:** `console.log`, `console.debug` nur während Entwicklung
- **Meaningful Comments:** Kommentare sollten "Warum?" erklären, nicht "Was?"
- **TODO-Kommentare:** Format: `// TODO: [Beschreibung] (#issue-number)`

---

## Testing Standards

### Unit Tests (Pflicht für kritische Module)
- **Framework:** Vitest (modern, schnell, TypeScript-ready) oder Jest
  - Vitest ist bevorzugt für neue Projekte
- **Coverage-Ziel:** Mindestens 60% für gesamt Projekt, 85%+ für kritische Module
- **Kritische Module:** Datenvalidation, API-Handler, Business Logic, Utilities
- Kommando: `npm run test`

### End-to-End Tests (Empfohlen)
- **Framework:** Playwright (cross-browser, headless/headed)
- **Scope:** Kritische User Journeys (Login, primäre Features, Export)
- **Environment:** Separate Test-Umgebung oder Staging Branch
- Kommando: `npm run test:e2e`

### Testing Best Practices
- Teste Verhaltensweise, nicht Implementierung (Black Box Testing)
- Nutze beschreibende Test-Namen: `test('should validate email format and reject invalid addresses')`
- Mocks und Stubs für externe Dependencies (APIs, localStorage, etc.)
- Test-Dateien: `*.test.ts`, `*.spec.ts` oder `__tests__/` Verzeichnis
- Keine flaky Tests: Tests müssen reproduzierbar und unabhängig sein

---

## TypeScript & Modern JavaScript

### JavaScript Standards
- **ES2020+:** Nutze modernes JavaScript (Arrow Functions, Destructuring, Spread Operator, etc.)
- **Modules:** Nutze ES6 Imports/Exports, nicht CommonJS `require()`
- **Async/Await:** Bevorzuge Async/Await über Promise .then() Chains

### TypeScript Best Practices
- **Keine `any` Types:** Definiere explizite Typen oder nutze Type Inference
- **Null Safety:** Nutze `undefined` checks und nullish coalescing (`??`)
- **Type Guards:** Nutze Type Guards für Runtime Type Checks
- **Generics:** Nutze TypeScript Generics für wiederverwendbare, typesichere Code

---

## Package Management

- **npm:** Verwende npm 8+, npm ci für CI/CD (statt npm install)
- **package.json:** Pinne kritische Dependencies auf exakte Versionen
- **Dependency Audit:** Regelmäßig `npm audit` durchführen
- **Scripts:** Nutze aussagekräftige npm Scripts:
  ```json
  {
    "scripts": {
      "dev": "...",
      "build": "...",
      "format": "prettier --write .",
      "lint": "eslint .",
      "type-check": "tsc --noEmit",
      "test": "vitest",
      "test:ui": "vitest --ui",
      "test:coverage": "vitest --coverage"
    }
  }
  ```

---

## Build & Performance

### Bundle Size
- **Target:** Unter 50 KB gzipped für PWAs
- **Monitoring:** Nutze `webpack-bundle-analyzer` oder ähnliche Tools
- **Tree Shaking:** Stelle sicher, dass nur genutzter Code gebündelt wird

### Performance Audit
- **Lighthouse:** Mindestens 80+ Score in allen Kategorien
  - Performance: 80+
  - Accessibility: 90+
  - Best Practices: 90+
  - SEO: 90+
- **Kommando:** `npm run audit` oder manuell in DevTools

### Caching & Versioning
- **Cache Busting:** Nutze File Hashing für statische Assets (`.js`, `.css`, `.png`)
- **Service Worker:** Implementiere intelligent Caching für PWAs
  - Cache-First für statische Assets
  - Network-First für APIs

---

## Sicherheit (Security)

### Secrets Management
- **NIE** Secrets in Code oder `.env` Dateien commiten
- Nutze GitHub Secrets für CI/CD
- `.env` und `.env.local` müssen in `.gitignore` sein
- Environment-spezifische Konfiguration: `.env.example` (ohne Secrets!)

### Input Validation
- **Server-side Validation:** Immer auch Backend validieren
- **Client-side Validation:** Für bessere UX (aber nicht als Sicherheit verlassen!)
- **Sanitization:** Sanitiere User-Input um XSS zu verhindern
- **SQL/NoSQL Injection:** Nutze Parameterized Queries, niemals String-Concatenation

### HTTPS & CORS
- **HTTPS immer:** Alle Produktions-Deployments müssen HTTPS sein
- **CORS Headers:** Konfiguriere CORS explizit (nicht `*` in Production)
- **CSP (Content Security Policy):** Implementiere CSP Headers

---

## CI/CD & GitHub Actions

### Grundlagen
- **Automatische Checks:** Linting und Tests auf jeden Push
- **Branch Protection:** `main` Branch mit mindestens 1 Review
- **Auto-Deploy:** Nur über GitHub Actions (manuell, nie direkt)

### Workflow Template
```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Check formatting
        run: npm run format -- --check

      - name: Lint code
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Run unit tests
        run: npm run test -- --coverage

      - name: Run E2E tests (optional)
        run: npm run test:e2e

      - name: Build
        run: npm run build

      - name: Lighthouse audit (PWA)
        if: contains(github.event.head_commit.message, 'release')
        run: npm run audit

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install and build
        run: npm ci && npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Spezielle Projekttypen

### PWA (Progressive Web Apps)
- **Service Worker:** Implementiere Service Worker für Offline-Support
- **Manifest:** `manifest.json` mit Icons, Theme Colors, Start URL
- **Icons:** Provide icons für verschiedene Auflösungen (192x192, 512x512, etc.)
- **HTTPS:** Über PWA-Features ist HTTPS erforderlich

### Firebase/Cloud Projects
- **Firestore Rules:** Strikte Security Rules implementieren
- **Environment Config:** Separate Firebase-Projekte für dev/staging/production
- **Secrets:** Firebase API Keys gehören nicht in Version Control

### Node.js/Backend Projects
- **Environment Variables:** Nutze `.env` für Konfiguration
- **Error Handling:** Implement proper error handling und logging
- **API Documentation:** Nutze OpenAPI/Swagger für API Dokumentation
- **Database Migrations:** Versioniere und dokumentiere DB-Changes

---

## Dokumentation & Maintenance

### README.md
- **Project Description:** Kurze Übersicht, was das Projekt tut
- **Installation:** `npm install` und `npm run dev` sollten funktionieren
- **Usage:** Hauptfeatures und Beispiele
- **Known Issues:** Bekannte Probleme und Workarounds
- **Contributing:** Wie man zum Projekt beitragen kann
- **License:** Lizenz deutlich angeben

### CHANGELOG
- **Semantische Versionierung:** Nutze SemVer (MAJOR.MINOR.PATCH)
- **Git Tags:** Tag jede Release mit Version (`v1.0.0`)
- **Release Notes:** Dokumentiere Breaking Changes deutlich

---

## Checkliste vor Production Deploy

- [ ] Alle Tests grün (`npm run test`)
- [ ] Code Coverage >= 60% (`npm run test:coverage`)
- [ ] ESLint Check bestanden (`npm run lint`)
- [ ] TypeScript Type Check bestanden (`npm run type-check`)
- [ ] Prettier Formatierung (`npm run format`)
- [ ] Build erfolgreich (`npm run build`)
- [ ] Lighthouse Audit >= 80 (PWA)
- [ ] Keine `console.log` oder `debugger` Statements
- [ ] Keine Secrets in Code
- [ ] `.env.example` vorhanden (ohne echte Werte)
- [ ] README aktualisiert
- [ ] CHANGELOG aktualisiert
- [ ] Git Tag gesetzt: `git tag v1.0.0`