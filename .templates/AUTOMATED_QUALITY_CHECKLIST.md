# 🤖 Automatisierte Quality Checklist für alle Projekte

Diese Checklist vereint alle Vorgaben aus:
- `ux-vorgaben.md`
- `technische_vorgaben.md`
- `PUBLISHING_CHECKLIST.md`
- `ANDROID-UX-GUIDELINES.md`

**Ziel:** Maximale Automatisierung durch CI/CD, Pre-Commit Hooks und Validation Scripts.

---

## 🎯 Automatisierungsgrad

| Kategorie | Automatisch | Manuell | Tools |
|-----------|-------------|---------|-------|
| Code Quality | ✅ 90% | ⚠️ 10% | ESLint, TypeScript, Scripts |
| Platform Safety | ✅ 100% | - | GitHub Actions, Pre-commit |
| Build Tests | ✅ 100% | - | CI/CD Pipeline |
| Version Consistency | ✅ 100% | - | Validation Script |
| UX Guidelines | ✅ 60% | ⚠️ 40% | Automated checks |
| Security | ✅ 80% | ⚠️ 20% | npm audit, Secret scanning |

---

## 📁 Projektstruktur Requirements

### Pflicht-Dateien

```
project-root/
├── .github/
│   ├── workflows/
│   │   └── ci-cd.yml              # ✅ GitHub Actions CI/CD
│   └── PULL_REQUEST_TEMPLATE.md   # ✅ PR Checklist
├── .husky/
│   └── pre-commit                 # ✅ Pre-commit hooks
├── scripts/
│   └── validate-release.sh        # ✅ Release validation
├── utils/
│   └── platform.ts                # ✅ Platform utilities (React Native)
├── .eslintrc.js                   # ✅ ESLint config
├── .prettierrc.json               # ⚠️ Code formatting
├── tsconfig.json                  # ⚠️ TypeScript config
├── RELEASE_CHECKLIST.md           # ✅ Release guide
└── package.json                   # ✅ Scripts + Dependencies
```

### package.json Scripts (Pflicht)

```json
{
  "scripts": {
    "dev": "...",
    "build": "...",
    "build:web": "...",               // Web build
    "build:android": "...",            // Android build (falls RN)
    "lint": "eslint .",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "test": "vitest",                  // oder jest
    "validate": "./scripts/validate-release.sh",
    "prepare": "husky install"         // Auto-install git hooks
  }
}
```

---

## 🔍 Automatische Checks (CI/CD)

### 1. Code Quality (`code-quality` Job)

**Was wird geprüft:**
- ✅ Keine `console.log/debug` in Production Code
- ✅ Keine Web APIs (`window.*`, `localStorage`) ohne `Platform.OS` Check
- ✅ AsyncStorage korrekt importiert (React Native)
- ✅ TypeScript Type Errors (tsc --noEmit)
- ✅ ESLint Warnings/Errors

**Tool:** GitHub Actions Workflow

**Exit Code:** Fails bei Fehlern → PR wird blockiert

### 2. Build Tests (`build-web`, `build-android` Jobs)

**Was wird geprüft:**
- ✅ Web Build erfolgreich (`npm run build:web`)
- ✅ Android Build erfolgreich (`./gradlew assembleRelease`)
- ✅ Bundle Size unter Threshold (optional)
- ✅ APK/AAB existiert nach Build

**Tool:** GitHub Actions mit Matrix Strategy

### 3. Platform Compatibility (`platform-checks` Job)

**Was wird geprüft:**
- ✅ Version Consistency:
  - `package.json` version
  - `app.json` version
  - `App.tsx` APP_VERSION Konstante
  - `Android/app/build.gradle.kts` versionName + versionCode
- ✅ UX Guidelines:
  - Kein Gear Emoji (⚙), nur Three Dots (⋮)
  - Theme Toggle: System/Dark (nicht Light/Dark/System)
- ✅ Android versionCode increment

### 4. Security Audit (`security` Job)

**Was wird geprüft:**
- ✅ `npm audit` (moderate+ vulnerabilities)
- ✅ Keine Secrets in Code (regex scanning)
- ⚠️ Warnung bei Hardcoded Credentials

### 5. Release Readiness Report

**Generiert:**
- ✅ Zusammenfassung aller Checks
- 📝 Liste manueller TODOs
- 📊 GitHub Job Summary

---

## 🎣 Pre-Commit Hooks (Lokal)

Verhindert fehlerhafte Commits **vor** dem Push.

### Setup

```bash
npm install --save-dev husky
npx husky install
```

### Was wird geprüft:

1. **console.log Check**
   - Scannt staged `.ts/.tsx` Dateien
   - Fails bei `console.log/debug`

2. **Web API Safety**
   - Scannt nach `window.*` ohne Platform Check
   - Scannt nach `localStorage.*` ohne Platform Check
   - Erlaubt `// platform-safe` Kommentar

3. **Version Consistency**
   - Prüft bei Änderungen an `package.json`, `app.json`
   - Stellt sicher alle Versionen identisch sind

**Exit Code:** Fails → Commit wird abgebrochen

---

## 🚀 Release Validation Script

**Aufruf:** `./scripts/validate-release.sh`

**Wann:** Vor jedem Release (manuell oder in CI)

### Prüfungen:

1. **✅ Version Consistency**
   - Alle 5 Dateien haben identische Version
   - Android versionCode ist konsistent

2. **✅ Code Quality**
   - Keine console.log
   - Keine unsafe Web APIs
   - UX Guidelines compliance

3. **✅ Build Tests**
   - Web Build funktioniert
   - Android Build funktioniert

4. **⚠️ File Existence**
   - RELEASE_CHECKLIST.md vorhanden
   - Documentation vorhanden
   - AAB File für aktuelle Version vorhanden

5. **⚠️ Git Status**
   - Clean working directory
   - Keine uncommitted changes

6. **⚠️ Security Audit**
   - npm audit ohne high-severity issues

**Output:**
- Farbcodierte Ausgabe (Grün/Gelb/Rot)
- Summary mit Error/Warning Count
- Next Steps Anleitung

**Exit Codes:**
- `0` → All checks passed
- `0` → Passed with warnings (review needed)
- `1` → Failed (must fix before release)

---

## 🎨 UX Guidelines - Automatische Checks

### Implementiert (✅)

- **Settings Icon:** Check für Gear Emoji (❌), muss Three Dots sein (✅)
- **Theme Toggle:** Warning falls "Light" Theme vorhanden

### Manuell (⚠️)

Die folgenden müssen manuell geprüft werden:

1. **Minimalistisches Design**
   - Hintergrund weiß/schwarz
   - Diagramme nicht abgesetzt
   - Buttons mit abgerundeten Ecken

2. **Responsives Design**
   - Test auf kleinen Displays
   - Auflösungsanpassung

3. **Settings-Modal Layout**
   - Kompakte Darstellung
   - Moderate Abstände
   - Reihenfolge: Theme → Language → Export → About

4. **App-Name Positionierung**
   - NICHT im Header
   - NUR in Settings-Modal

**Vorschlag:** Screenshot-basierte Visual Regression Tests (z.B. Percy, Chromatic)

---

## 📋 Release Checklist Integration

### Automatisch geprüft

- [x] Code Quality (console.log, Web APIs)
- [x] Platform Compatibility
- [x] Build erfolgreich (Web + Android)
- [x] Version Consistency
- [x] Security Audit
- [x] Git Status clean

### Manuell erforderlich

- [ ] Test auf physischem Android-Gerät
- [ ] Test im Web-Browser (Chrome, Safari)
- [ ] Dark Mode funktioniert
- [ ] Settings persistieren korrekt
- [ ] Alle Features funktionieren
- [ ] Release Notes geschrieben
- [ ] CHANGELOG.md aktualisiert
- [ ] Screenshots aktuell (Play Store, README)

---

## 🔧 Setup für neue Projekte

### 1. Dateien kopieren

Kopiere von `project-templates/` oder einem Referenz-Projekt:

```bash
# GitHub Actions
cp -r .github/ new-project/

# Scripts
cp -r scripts/ new-project/
chmod +x new-project/scripts/*.sh

# Husky Pre-commit
cp -r .husky/ new-project/

# ESLint Config
cp .eslintrc.js new-project/

# Documentation
cp RELEASE_CHECKLIST.md new-project/
cp .github/PULL_REQUEST_TEMPLATE.md new-project/.github/
```

### 2. Dependencies installieren

```bash
npm install --save-dev husky prettier eslint
npx husky install
```

### 3. package.json anpassen

Füge Scripts hinzu (siehe oben).

### 4. GitHub Actions aktivieren

Push zu GitHub → Actions werden automatisch ausgeführt.

### 5. Erste Validation

```bash
./scripts/validate-release.sh
```

Fix alle Errors, review Warnings.

---

## 📊 Metrics & Reporting

### GitHub Actions Outputs

Jeder CI/CD Run generiert:
- Job Summary (Markdown)
- Artifacts (Web Build, APK)
- Step-by-Step Logs

### Release Report Format

```markdown
# 🚀 Release Readiness Report

## ✅ Automated Checks Passed
- Code Quality
- Web Build
- Android Build
- Platform Compatibility
- Version Consistency

## 📝 Manual Checks Required
- [ ] Test on physical Android device
- [ ] Test all features in browser
- [ ] Dark mode works
- [ ] Settings persist

---
**Version:** 1.0.9
**Commit:** abc123def
```

---

## 🎯 Zukünftige Verbesserungen

### Phase 1 (Aktuell) ✅
- Bash-basierte Checks in CI/CD
- Pre-commit hooks
- Validation script

### Phase 2 (Geplant)
- Custom ESLint Plugin für Platform Checks
- Visual Regression Testing (Percy, Chromatic)
- Automated Screenshot Generation

### Phase 3 (Zukunft)
- TypeScript Compiler Plugin
- AI-basierte Code Review
- Automated Accessibility Testing

---

## 📚 Ressourcen

- GitHub Actions: https://docs.github.com/actions
- Husky: https://typicode.github.io/husky/
- ESLint: https://eslint.org/
- React Native Platform Specific Code: https://reactnative.dev/docs/platform-specific-code

---

**Maintained by:** Development Team
**Last Updated:** 2025-12-13
**Version:** 1.0
