---
# Technische Vorgaben für Projekte

Technische Standards für alle Projekttypen: Web, PWA, Node.js, TypeScript, Android, React Native/Expo.

---

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

### Testing Pyramid
```
        /\
       /  \   E2E Tests
      /    \  - User Journeys
     /______\
    /        \
   /          \ Integration Tests
  /            \ - Feature Combinations
 /______________\
/                \
\  Unit Tests   /
 \  (70%)      /
  \           /
   \_________/
```

**Ideale Verteilung:**
- Unit Tests: 70% (schnell, viele, spezifisch)
- Integration Tests: 20% (mittel, Feature-Kombinationen)
- E2E Tests: 10% (langsam, User-Journeys)

### Unit Tests (Pflicht für kritische Module)
- **Framework:** Vitest (modern, schnell, TypeScript-ready) oder Jest
  - Vitest ist bevorzugt für neue Projekte
- **Coverage-Ziel:** Mindestens 60% für gesamt Projekt, 85%+ für kritische Module
- **Kritische Module:** Datenvalidation, API-Handler, Business Logic, Utilities
- Kommando: `npm run test`

### Integration Tests (Empfohlen)
- **Scope:** Kombinationen von Funktionen testen (z.B. Service + Database)
- **Framework:** Vitest mit Fixtures oder Jest
- Kommando: `npm run test:integration`

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

## Android App Entwicklung

### Edge-to-Edge Display (Android 15+)

**KRITISCH:** Ab Android 15 (SDK 35+) sind Apps **standardmäßig randlos**. Alle Android-Apps MÜSSEN Edge-to-Edge kompatibel sein.

#### Build Configuration
```kotlin
// app/build.gradle.kts
android {
    compileSdk = 36  // Android 15+

    defaultConfig {
        targetSdk = 36  // WICHTIG: Android 15+
        minSdk = 21
    }
}

dependencies {
    // Material Components - Mindestens v1.13.0
    implementation("com.google.android.material:material:1.13.0")

    // AndroidX Core - für WindowCompat
    implementation("androidx.core:core-ktx:1.17.0")
}
```

#### MainActivity Implementation
```kotlin
// MainActivity.kt
import androidx.core.view.WindowCompat

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Enable Edge-to-Edge for Android 15+ compatibility
        enableEdgeToEdge()

        // ... rest of your code
    }

    private fun enableEdgeToEdge() {
        WindowCompat.setDecorFitsSystemWindows(window, false)
    }
}
```

#### Theme Configuration
**values/themes.xml (Light Mode):**
```xml
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Base.Theme.YourApp" parent="Theme.Material3.DayNight.NoActionBar">
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>
        <item name="android:windowLightStatusBar">true</item>
        <item name="android:windowLightNavigationBar">true</item>
        <item name="android:enforceNavigationBarContrast" tools:targetApi="q">false</item>
        <item name="android:enforceStatusBarContrast" tools:targetApi="q">false</item>
    </style>

    <style name="Theme.YourApp" parent="Base.Theme.YourApp" />
</resources>
```

**values-night/themes.xml (Dark Mode):**
```xml
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Base.Theme.YourApp" parent="Theme.Material3.DayNight.NoActionBar">
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>
        <item name="android:windowLightStatusBar">false</item>
        <item name="android:windowLightNavigationBar">false</item>
        <item name="android:enforceNavigationBarContrast" tools:targetApi="q">false</item>
        <item name="android:enforceStatusBarContrast" tools:targetApi="q">false</item>
    </style>
</resources>
```

#### Checkliste - Edge-to-Edge Implementation
- [ ] `compileSdk = 36`
- [ ] `targetSdk = 36`
- [ ] Material Components >= 1.13.0
- [ ] AndroidX Core >= 1.17.0
- [ ] `WindowCompat.setDecorFitsSystemWindows(window, false)` implementiert
- [ ] Themes konfiguriert (Light & Dark Mode)
- [ ] Build ohne Warnungen
- [ ] Test auf Android 15+ Gerät/Emulator

### Android App Links (Deep Linking)

**WICHTIG:** Apps sollten Android App Links implementieren, damit Website-URLs automatisch die App öffnen.

#### Setup für Expo/React Native Apps

**1. Digital Asset Links erstellen:**
```bash
mkdir -p public/.well-known
```

**public/.well-known/assetlinks.json:**
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.yourcompany.yourapp",
      "sha256_cert_fingerprints": [
        "SHA256_FINGERPRINT_FROM_PLAY_CONSOLE"
      ]
    }
  }
]
```

**2. Intent-Filter in app.json:**
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.yourapp",
      "versionCode": 2,
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "yourdomain.github.io",
              "pathPrefix": "/YourApp"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

**3. Build-Skript anpassen:**
```javascript
// scripts/post-build.js
const filesToCopy = [
  { src: 'public/.nojekyll', dest: 'dist/.nojekyll' },  // WICHTIG!
  { src: 'public/.well-known/assetlinks.json', dest: 'dist/.well-known/assetlinks.json' }
];
```

**4. Deployen mit --dotfiles Flag:**
```json
{
  "scripts": {
    "deploy:gh-pages": "gh-pages -d dist -t --dotfiles"
  }
}
```

**5. SHA-256 Fingerabdruck:**
1. Google Play Console → Setup → App-Integrität
2. SHA-256 Zertifikatfingerabdruck kopieren
3. **Doppelpunkte entfernen:** `AA:BB:CC:DD` → `AABBCCDD`
4. In `assetlinks.json` eintragen
5. Deployen: `npm run deploy`

#### Testen
```bash
# assetlinks.json validieren
curl -I https://yourdomain.github.io/.well-known/assetlinks.json
# Erwartetes Ergebnis: HTTP/2 200, content-type: application/json
```

#### Checkliste - Android App Links
- [ ] `.well-known/assetlinks.json` erstellt
- [ ] `public/.nojekyll` erstellt
- [ ] Build-Skript kopiert `.well-known/` nach `dist/`
- [ ] `--dotfiles` Flag in deploy-Skript
- [ ] SHA-256 Fingerabdruck ohne Doppelpunkte
- [ ] Intent-Filter in `app.json`
- [ ] `autoVerify: true` gesetzt
- [ ] Website deployed
- [ ] assetlinks.json erreichbar

---

## PWA & React Native (Expo) Vorgaben

### Expo OTA Updates (KRITISCH)

**KRITISCH:** Alle PWA/React Native Apps mit Expo MÜSSEN die OTA (Over-The-Air) Updates Konfiguration **bereits im ersten Play Store Build** enthalten.

#### Problem
Wenn eine App ohne OTA-Konfiguration im Play Store veröffentlicht wird, können **keine Code-Updates** an Benutzer ausgeliefert werden, ohne einen neuen Play Store Build zu erstellen.

#### Anforderungen

**app.json - MUSS von Anfang an enthalten sein:**
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "version": "1.0.0",

    // OTA Updates Configuration - KRITISCH!
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/YOUR-PROJECT-ID"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    },

    "extra": {
      "eas": {
        "projectId": "YOUR-PROJECT-ID"
      }
    }
  }
}
```

**Wichtige Eigenschaften:**
- **`updates.enabled: true`** - Aktiviert OTA Updates
- **`updates.checkAutomatically: "ON_LOAD"`** - Prüft bei jedem App-Start
- **`updates.fallbackToCacheTimeout: 0`** - Nutzt neue Updates sofort
- **`runtimeVersion.policy: "appVersion"`** - Verknüpft Updates mit App-Version
- **`extra.eas.projectId`** - Expo Project ID

#### RuntimeVersion Matching
- Mit `policy: "appVersion"`: RuntimeVersion = app.json `version` Feld
- Beispiel: App v1.2.1 kann nur Updates für runtimeVersion "1.2.1" empfangen
- Bei Version-Increment (1.2.1 → 1.2.2) ist neuer Play Store Build erforderlich

#### Workflow - OTA Updates nutzen
```bash
# 1. Ersten Play Store Build erstellen:
eas build --platform android --profile production

# 2. Code-Änderungen ausliefern (ohne Store-Build):
eas update --branch production --message "Fix: Improve chart label positioning"

# 3. Benutzer erhalten Update beim nächsten App-Start
```

#### Platform-Detection für Data Loading

**Richtig - Platform.OS verwenden:**
```typescript
import { Platform } from 'react-native';

// ✅ KORREKT
const dataUrl = Platform.OS === 'web'
  ? './data/marketdata.json?v=${Date.now()}'
  : 'https://yourdomain.github.io/YourApp/data/marketdata.json?v=${Date.now()}';

const response = await fetch(dataUrl);
```

**Falsch - Window Detection funktioniert nicht:**
```typescript
// ❌ NICHT VERWENDEN - React Native hat auch window!
const isWeb = typeof window !== 'undefined';
```

#### Checkliste - OTA Updates Setup

**Vor erstem Play Store Build:**
- [ ] Expo Account erstellt
- [ ] EAS CLI installiert
- [ ] Project mit EAS verbunden (`eas init`)
- [ ] Project ID in app.json eingetragen
- [ ] `updates` Konfiguration in app.json vorhanden
- [ ] `runtimeVersion` policy definiert
- [ ] EAS Build erfolgreich

**Nach erstem Play Store Build:**
- [ ] OTA Update Test: `eas update --branch production`
- [ ] Update wird in EAS Console angezeigt
- [ ] App lädt Update beim Start

### Deployment-Strategie mit EAS Channels

**Ziel:** Klare Trennung zwischen Testing (Staging) und Production für sichere Releases

#### Development Workflow
```
1. Feature Branch
   └─ npm run dev (localhost + emulator)

2. Testing Branch
   └─ Local testing on real devices

3. Build & Test on Staging
   └─ npm run build:staging
   └─ Deploy to TestFlight/Internal Testing
   └─ Real device testing
   └─ User acceptance testing

4. Staging Validated ✅
   └─ Merge to main branch

5. Production Release
   └─ npm run build:production
   └─ App Store / Play Store Review
   └─ Live for Users
```

#### Configuration Files

**eas.json:**
```json
{
  "cli": {
    "version": ">= 2.0.0"
  },
  "build": {
    "production": {
      "channel": "production",
      "distribution": "store"
    },
    "staging": {
      "channel": "staging",
      "distribution": "internal"
    }
  },
  "channels": {
    "production": {
      "publish": true
    },
    "staging": {
      "publish": true
    }
  }
}
```

**package.json Scripts:**
```json
{
  "scripts": {
    "build:staging": "eas build --platform all --channel staging",
    "build:production": "eas build --platform all --channel production",
    "publish:staging": "expo publish --channel staging",
    "publish:production": "expo publish --channel production"
  }
}
```

---

## Spezielle Projekttypen

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

---

## Referenzen

- [Expo OTA Updates Guide](https://docs.expo.dev/eas-update/introduction/)
- [Android Edge-to-Edge Guide](https://developer.android.com/develop/ui/views/layout/edge-to-edge)
- [Android App Links Guide](https://developer.android.com/training/app-links)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
