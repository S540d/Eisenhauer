# 🤖 Automation Templates

Diese Templates richten automatische Quality Assurance für neue Projekte ein.

## 📁 Struktur

```
automation-templates/
├── README.md                           # Diese Datei
├── .eslintrc.js                        # ESLint Konfiguration
├── platform.ts                         # React Native Platform Utilities
├── AUTOMATION_SETUP.md                 # Setup-Anleitung für Entwickler
├── RELEASE_CHECKLIST.md                # Release Checklist
├── PULL_REQUEST_TEMPLATE.md            # PR Template mit Checkliste
├── pre-commit-react-native             # Pre-commit Hook (React Native)
├── pre-commit-generic                  # Pre-commit Hook (Generic)
├── validate-release-react-native.sh    # Validation Script (React Native)
├── validate-release-web.sh             # Validation Script (Web)
├── validate-release-generic.sh         # Validation Script (Generic)
├── ci-cd-react-native.yml              # GitHub Actions (React Native)
├── ci-cd-web.yml                       # GitHub Actions (Web)
└── ci-cd-generic.yml                   # GitHub Actions (Generic)
```

## 🚀 Schnellstart

### Für ein neues Projekt:

```bash
cd /path/to/your/new/project

# Automatisches Setup
/path/to/project-templates/scripts/init-automation.sh .
```

### Für ein bestehendes Projekt:

```bash
cd /path/to/your/existing/project

# Automatisches Setup (erkennt Projekttyp automatisch)
/path/to/project-templates/scripts/init-automation.sh .
```

## 🎯 Was wird eingerichtet?

### 1. GitHub Actions CI/CD

**Datei:** `.github/workflows/ci-cd.yml`

**Jobs:**
- Code Quality (console.log, Web APIs, TypeScript)
- Build Tests (Web/Android je nach Projekttyp)
- Platform Checks (Version Consistency, UX Guidelines)
- Security Audit

**Blockiert PRs** bei Fehlern!

### 2. Pre-Commit Hooks

**Datei:** `.husky/pre-commit`

**Prüft automatisch** bei jedem `git commit`:
- Keine console.log
- Web APIs mit Platform Checks (React Native)
- Version Consistency

**Verhindert** fehlerhafte Commits!

### 3. Release Validation

**Datei:** `scripts/validate-release.sh`

**Läuft manuell** vor Release:
```bash
npm run validate
```

**Prüft:**
- Version Consistency
- Code Quality
- Build Success
- UX Guidelines
- Security

### 4. Dokumentation

**Dateien:**
- `AUTOMATION_SETUP.md` - Setup-Guide
- `RELEASE_CHECKLIST.md` - Checklist für Releases

### 5. Platform Utilities (React Native)

**Datei:** `utils/platform.ts`

Sichere Wrappers für Web APIs:
```typescript
import { Storage, getSystemDarkModePreference } from './utils/platform';

// Statt localStorage direkt:
await Storage.setItem('key', 'value'); // ✅ Works on Web + Mobile

// Statt window.matchMedia direkt:
const isDark = getSystemDarkModePreference(); // ✅ Safe
```

## 📋 Projekttypen

Das Init-Script erkennt automatisch:

### React Native / Expo
- Prüft auf `react-native` oder `expo` in package.json
- Richtet Platform-Checks ein
- Kopiert `platform.ts` Utilities
- Konfiguriert Android + Web Builds

### Web / React
- Prüft auf `react` in package.json
- Keine Platform-Checks nötig
- Web-only Build Tests

### Generic Node.js
- Fallback für andere Projekte
- Basis ESLint + Validation

## 🔧 Anpassung

### Eigene Checks hinzufügen

**Pre-Commit Hook** (`.husky/pre-commit`):
```bash
# Eigener Check
echo "Checking custom rule..."
if grep -r "CUSTOM_PATTERN" src/; then
  echo "❌ ERROR: Custom pattern found!"
  exit 1
fi
```

**Validation Script** (`scripts/validate-release.sh`):
```bash
# Eigene Validierung
echo "Running custom validation..."
./my-custom-check.sh
```

**GitHub Actions** (`.github/workflows/ci-cd.yml`):
```yaml
- name: Custom Check
  run: |
    echo "Running custom check..."
    npm run custom-check
```

### Template aktualisieren

Wenn du Verbesserungen machst:

1. **Teste** im 1x1_Trainer Projekt
2. **Kopiere** erfolgreiche Änderungen nach `automation-templates/`
3. **Commite** zu project-templates Repo
4. **Andere Projekte** können mit `init-automation.sh` updaten

## 📊 Automatisierungsgrad

| Kategorie | Auto | Manuell |
|-----------|------|---------|
| Code Quality | 90% | 10% |
| Platform Safety | 100% | - |
| Build Tests | 100% | - |
| Version Consistency | 100% | - |
| UX Guidelines | 60% | 40% |
| Security | 80% | 20% |

## 🎯 Best Practices

### Do's ✅
- **Verwende** `// platform-safe` Kommentar für sichere Web API Calls
- **Teste** Automation Setup in Testprojekt bevor du es überall ausbringst
- **Aktualisiere** Templates regelmäßig
- **Dokumentiere** projekt-spezifische Anpassungen

### Don'ts ❌
- **Keine** Web APIs ohne Platform Check (React Native)
- **Keine** console.log in Production Code
- **Keine** Hardcoded Credentials
- **Nicht** Husky Hooks mit `--no-verify` umgehen

## 🚀 Workflow Beispiel

### Neues Feature entwickeln

```bash
# 1. Feature entwickeln
vim src/feature.ts

# 2. Committen (Pre-commit läuft automatisch)
git add .
git commit -m "feat: new feature"
# ✅ Pre-commit checks passed!

# 3. Push (GitHub Actions läuft automatisch)
git push origin feature-branch
# ✅ CI/CD pipeline running...

# 4. PR erstellen
# → PR Template mit Checklist erscheint automatisch
# → CI/CD muss grün sein bevor merge möglich
```

### Release durchführen

```bash
# 1. Validation laufen lassen
npm run validate
# ✅ All checks passed!

# 2. Manuelle Tests
# ... teste auf Devices ...

# 3. Release
git tag v1.0.0
git push origin v1.0.0
npm run deploy
```

## 📚 Weitere Ressourcen

- [AUTOMATED_QUALITY_CHECKLIST.md](../AUTOMATED_QUALITY_CHECKLIST.md) - Umfassende Checklist
- [ux-vorgaben.md](../ux-vorgaben.md) - UX Guidelines
- [technische_vorgaben.md](../technische_vorgaben.md) - Technische Standards
- [PUBLISHING_CHECKLIST.md](../PUBLISHING_CHECKLIST.md) - Publishing Guide

## 💡 Fragen?

Siehe:
- `AUTOMATION_SETUP.md` (wird in jedes Projekt kopiert)
- `AUTOMATED_QUALITY_CHECKLIST.md` (Master-Dokumentation)
- 1x1_Trainer Projekt (Referenz-Implementierung)

---

**Maintained by:** Development Team
**Last Updated:** 2025-12-13
**Version:** 1.0
