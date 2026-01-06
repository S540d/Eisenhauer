# Project Templates

Zentrale Vorlagen und Standards für alle Projekte. Diese Templates definieren Best Practices für Code-Qualität, UX/Design, Testing und Accessibility.

---

## 🔄 Struktur Konsolidierung (Stand: 2025-12-26)

> Die beiden Kernstandard-Dateien wurden **konsolidiert und bereinigt** für bessere Trennschärfe:

### Was hat sich geändert?

**VORHER** (Fragmentiert):
- `technische_vorgaben.md` (9 KB) - Zu klein, fehlte Android/PWA Details
- `ux-vorgaben.md` (71 KB!) - Zu groß, Mix aus UX + Technical Content
- `accessibility-guidelines.md` - Duplizierung mit ux-vorgaben
- `testing-standards.md` - Duplizierung mit technische_vorgaben

**NACHHER** (Konsolidiert & Klar):
- `technische_vorgaben.md` (38 KB) - Alles Technical: Code, Tests, Build, CI/CD, **Android**, **PWA/React Native**, Deployment
- `ux-vorgaben.md` (36 KB) - Alles UX/Design: Design Systems, Farben, Typography, Spacing, **Accessibility**, Settings, i18n
- ✅ Keine Duplizierungen mehr
- ✅ Klare Verantwortlichkeit: Tech vs. Design
- ✅ Bidirektionale Verlinkung zwischen den Dateien

### Wer sollte was lesen?

| Rolle | Datei | Fokus |
|-------|-------|-------|
| **Frontend Engineer** | `technische_vorgaben.md` + `ux-vorgaben.md` | Code Quality + Design Implementation |
| **Backend Engineer** | `technische_vorgaben.md` | Code Quality, API Security, Testing |
| **UX/Product Designer** | `ux-vorgaben.md` | Design Systems, Accessibility, Interactions |
| **DevOps/Release Manager** | `technische_vorgaben.md` | CI/CD, Android Publishing, OTA Updates |
| **QA Engineer** | Beide Dateien | Testing Standards + UX Checklist |

---

## Inhalt

### Kernstandards

1. **technische_vorgaben.md** ✅ KONSOLIDIERT
   - **Code-Qualität:** Prettier, ESLint, TypeScript, Comments
   - **Testing Standards:** Unit Tests (Vitest/Jest), Integration Tests, E2E Tests (Playwright)
   - **TypeScript Best Practices:** Type Safety, Null Safety, Type Guards
   - **Package Management:** npm, Dependencies, Audits
   - **Build & Performance:** Bundle Size, Lighthouse Audit, Caching
   - **Sicherheit:** Secrets Management, Input Validation, HTTPS, CORS, CSP
   - **CI/CD & GitHub Actions:** Workflows, Branch Protection
   - **Android Development:** Edge-to-Edge Display (Android 15+), App Links (Deep Linking)
   - **PWA & React Native:** Expo OTA Updates, Platform Detection, EAS Channels & Staging
   - **Spezielle Projekttypen:** Firebase, Node.js/Backend
   - **Dokumentation & Maintenance:** README, CHANGELOG, Semantic Versioning
   - **Pre-Production Checklist**

2. **ux-vorgaben.md** ✅ KONSOLIDIERT
   - **Design Fundamentals:** Mobile First, Progressive Enhancement, Konsistenz
   - **Moderne Design-Systeme:** Option 1 (Soft & Modern), Option 2 (Minimal), Option 3 (Glassmorphism)
   - **Farbpalette:** Semantische Farben, Kontrast-Anforderungen (WCAG 2.1)
   - **Theme-Aware Colors Architecture:** Pattern für bessere Dark Mode Unterstützung
   - **Typography:** Font Selection, Line Height, Letter Spacing
   - **Spacing System:** 8px Base Grid
   - **Responsive Design:** Mobile-First Breakpoints (320px - 1536px+)
   - **Komponenten Standards:** Buttons, Forms, Cards, Modals, Navigation
   - **Dark Mode / Theme Support:** CSS Variables, Klasse-basiert, OS Preference
   - **Barrierefreiheit (WCAG 2.1 AA):** Keyboard Navigation, Screen Reader Support, Color Contrast
   - **Settings Menu:** Standardisierte Struktur, Design Tokens, Feedback/Support/About, Store Compliance
   - **Interaktion & Feedback:** Loading States, Toast Notifications, Animations, Hover/Focus States
   - **Internationalisierung (i18n):** Mehrsprachigkeit, Text Handling, Plural Forms
   - **Performance Indicators:** Lighthouse Targets
   - **Emoji-Richtlinien:** Wo zu verwenden und wo nicht
   - **UX Checklist für neue Projekte**

### Spezialrichtlinien

3. **design-system.md**
   - Komponenten-Katalog mit Code-Beispielen
   - Button (Typen, Größen, States)
   - Form Elements (Input, Textarea, Select, Checkbox, Radio)
   - Cards, Modals, Tabs, Alerts
   - Spinner / Loading States
   - Badges
   - Komponenten-Checkliste

4. **accessibility-guidelines.md**
   - WCAG 2.1 Level AA Compliance
   - Keyboard Navigation (Tab Order, Focus Indicators)
   - Color Contrast (4.5:1 minimum)
   - Semantic HTML
   - ARIA Labels & Descriptions
   - Alt Text Richtlinien
   - Form Labels & Error Handling
   - Color Not Only (nicht nur Farbe)
   - Text Resizing & Zoom
   - Motion & Animation
   - Testing & Audit Tools
   - Quick Checklist

5. **testing-standards.md**
   - Testing Pyramid (Unit, Integration, E2E)
   - Unit Tests (Vitest/Jest)
   - Integration Tests
   - E2E Tests (Playwright)
   - Performance Tests (Lighthouse)
   - Accessibility Tests (axe)
   - Test Naming Conventions
   - Pre-Commit Testing (Husky)
   - CI/CD Integration
   - Coverage Reports

### Automation & CI/CD

5.1 **automation-templates/** (NEU - Automatische Quality Checks)
   - **scripts/init-automation.sh** - One-Command Setup für jedes Projekt
   - **CI/CD Workflows** (GitHub Actions):
     - ci-cd-react-native.yml - React Native + Web + Android
     - ci-cd-web.yml - Web/PWA Projekte
     - ci-cd-generic.yml - Generic Node.js Projekte
   - **Pre-Commit Hooks** (Husky):
     - Verhindert console.log in Production Code
     - Validiert Platform.OS bei Web APIs
     - Prüft Version-Konsistenz
   - **Validation Scripts**:
     - validate-release-react-native.sh
     - validate-release-web.sh
     - validate-release-generic.sh
   - **Platform Utilities** (platform.ts)
   - **Dokumentation**: AUTOMATION_SETUP.md, RELEASE_CHECKLIST.md

5.2 **AUTOMATED_QUALITY_CHECKLIST.md**
   - Komplette Checkliste aller automatisierten Quality Checks
   - 90%+ Automatisierung für Code-Qualität
   - Setup-Guide für Automatisierung
   - Best Practices

5.3 **QUICK_START.md**
   - One-Command Setup: `cd Projekt && /path/to/init-automation.sh . && npm install`
   - Schnelleinstieg für neue Projekte

5.4 **GitHub Branch Protection Rulesets** (NEU)
   - **GITHUB_RULESETS.md** - Dokumentation für Branch Protection
   - **github-ruleset-protect-main-react-native.json** - Ruleset für React Native Projekte
   - **github-ruleset-protect-main-web.json** - Ruleset für Web/PWA Projekte
   - **scripts/setup-branch-protection.sh** - Automatische Installation
   - **Features**:
     - Verhindert Force Pushes auf main
     - Required Status Checks (code-quality, build-web)
     - Admin Bypass für Hotfixes
     - Einheitliche Rules über alle Projekte

### Deployment & Publishing

6. **PUBLISHING_CHECKLIST.md**
   - Checkliste für das Veröffentlichen von GitHub Pages PWAs
   - Optische Vorgaben (Design, Theme, Components)
   - Technische Konfiguration (GitHub Actions, PWA, Service Worker)
   - Code-Qualität Checkliste
   - Repository Setup
   - Sicherheit & Rechtliches
   - Dokumentation

7. **PLAYSTORE_STATUS_OVERVIEW.md** (NEW)
   - Zentrale Statusübersicht für alle 5 Projekte
   - Quick Status Dashboard (Tabelle)
   - Detaillierte Status & Timeline für jedes Projekt
   - Week-by-week Implementation Plans
   - Konsolidierter Timeline Overview
   - Links zu projekt-spezifischen Checklisten
   - Weekly Sync Template & Key Metrics

8. **GOOGLE_PLAY_STORE_ROADMAP.md**
   - Komplette Roadmap für Google Play Store Veröffentlichung aller Projekte
   - Phase-by-Phase Implementation Guides mit Checklisten
   - Technische Anforderungen (Android SDK, Build, Signing)
   - Store Listing Requirements (Text, Graphics, Assets)
   - Privacy & Security Requirements
   - Pre-Launch und Post-Launch Checklisten
   - Projekt-spezifische Setup-Anforderungen

### GitHub Integration

9. **.github/ISSUE_TEMPLATE/** (Zentrale Issue Templates)
   - `bug.md` - Bug Reports
   - `feature.md` - Feature Requests
   - `documentation.md` - Documentation Requests
   - `question.md` - Questions / Discussions

10. **.github/PULL_REQUEST_TEMPLATE/** (Zentrale PR Templates)
   - `default.md` - Standard PR Template mit Checklisten

11. **.github/README.md**
   - Dokumentation der GitHub Templates
   - Best Practices für Issues und PRs
   - Verwendung und Anpassung

---

## Verwendung in Projekten

Diese Templates werden als Git-Submodul in Projekte eingebunden:

```bash
git submodule add <repo-url> .templates
```

Dann sind alle Templates verfügbar unter `.templates/`:

```
.templates/
├── README.md                           # Diese Datei
├── technische_vorgaben.md              # Technische Standards
├── ux-vorgaben.md                      # UX/Design Standards
├── design-system.md                    # Komponenten-Katalog
├── accessibility-guidelines.md         # WCAG 2.1 AA Guidelines
├── testing-standards.md                # Testing Best Practices
├── PUBLISHING_CHECKLIST.md             # Publishing Checklist
│
└── .github/
    ├── README.md                       # GitHub Templates Dokumentation
    ├── ISSUE_TEMPLATE/
    │   ├── bug.md                      # Bug Report Template
    │   ├── feature.md                  # Feature Request Template
    │   ├── documentation.md            # Documentation Request Template
    │   └── question.md                 # Question / Discussion Template
    │
    └── PULL_REQUEST_TEMPLATE/
        └── default.md                  # Standard PR Template
```

## Verwendung der GitHub Templates

Die `.github` Templates können auf verschiedene Weisen in dein Projekt übernommen werden:

### Option 1: Kopieren (Einfach)
```bash
# Kopiere die .github Verzeichnisse ins Projekt
cp -r .templates/.github .
```

### Option 2: Symlink (Aktualisierbar, nur macOS/Linux)
```bash
# Erstelle Symlinks zu den Templates
ln -s .templates/.github/ISSUE_TEMPLATE .github/ISSUE_TEMPLATE
ln -s .templates/.github/PULL_REQUEST_TEMPLATE .github/PULL_REQUEST_TEMPLATE
```

### Option 3: Anpassung (Empfohlen)
```bash
# Kopiere Templates als Basis
cp -r .templates/.github .

# Bearbeite für dein Projekt (z.B. projekt-spezifische Checklisten)
vim .github/PULL_REQUEST_TEMPLATE/default.md
```

**Siehe auch:** [.github/README.md](.github/README.md) für Dokumentation und Best Practices

---

## Quick Start für neues Projekt

### ⚡ Automatisches Setup (Empfohlen)

**One-Command Setup** für sofortige Automatisierung:

```bash
# Wechsle ins Projektverzeichnis
cd MeinProjekt

# Führe das Automation-Setup aus
/pfad/zu/project-templates/scripts/init-automation.sh .

# Installiere Dependencies (inklusive Husky)
npm install

# Teste die Automatisierung
npm run validate
```

Das Setup-Script erkennt automatisch deinen Projekttyp (React Native, Web, oder Generic) und richtet ein:
- ✅ GitHub Actions CI/CD Pipeline
- ✅ Pre-Commit Hooks (Husky)
- ✅ Validation Script
- ✅ Platform Utilities (bei React Native)
- ✅ Dokumentation (AUTOMATION_SETUP.md, RELEASE_CHECKLIST.md)

**Siehe auch:** [QUICK_START.md](QUICK_START.md) und [AUTOMATION_SUMMARY.md](AUTOMATION_SUMMARY.md)

---

### 📋 Manuelles Setup (wenn du mehr Kontrolle brauchst)

1. **Technische Setup** - Lese `technische_vorgaben.md` für:
   - ESLint & Prettier Konfiguration
   - Vitest Setup
   - GitHub Actions Workflows

2. **Automation Setup** - Nutze `automation-templates/` für:
   - CI/CD Pipeline (GitHub Actions)
   - Pre-Commit Hooks (Husky)
   - Validation Scripts
   - Platform-Safe Utilities

3. **UX/Design Setup** - Nutze `ux-vorgaben.md` für:
   - Color Palette definieren (CSS Variables)
   - Typography konfigurieren
   - Responsive Breakpoints setzen
   - Dark Mode implementieren

4. **Komponenten** - Referenziere `design-system.md` für:
   - Button Komponenten
   - Form Elements
   - Modals und andere häufige Komponenten

5. **Accessibility** - Checke `accessibility-guidelines.md` für:
   - WCAG 2.1 AA Compliance
   - Keyboard Navigation
   - Screen Reader Support
   - Color Contrast

6. **Testing** - Implementiere Tests nach `testing-standards.md`:
   - Unit Tests (Vitest)
   - E2E Tests (Playwright)
   - 60%+ Coverage Ziel

7. **Publishing** - Vor Release `PUBLISHING_CHECKLIST.md`:
   - Alle Checklisten durchgehen
   - Lighthouse Audit (80+)
   - Production Checks

---

## Allgemeinheit der Templates

Diese Templates sind absichtlich **projektübergreifend generalisiert**:

✅ **Anwendbar auf:**
- Web Apps (React, Vue, Vanilla JS)
- Progressive Web Apps (PWA)
- Node.js Backend Projekte
- TypeScript & JavaScript Projekte
- GitHub Pages Deployments

✅ **Flexible Standards:**
- Keine Framework-spezifischen Vorgaben
- Best Practices für verschiedene Projekttypen
- Modular: Nimm, was du brauchst

✅ **Living Document:**
- Templates sind zu aktualisieren, wenn Best Practices sich ändern
- Feedback willkommen über Issues/PRs

---

## Labels

Siehe [LABELS.md](LABELS.md) für standardisiertes, einfaches Label-System:

**9 Labels in 3 Kategorien:**
- **Type:** `bug`, `feature`, `enhancement`, `docs`
- **Priority:** `priority: high`, `priority: low`
- **Status:** `blocked`, `ready-for-implementation`

**Automatisiertes Setup** mit Script:
```bash
./scripts/setup-labels.sh S540d/Eisenhauer
```

---

## Aktualisierungshistorie

### Version 3.0 (Automation System) - Dezember 2025
- ✅ **Komplettes Automation System** (90%+ automatisierte Quality Checks)
- ✅ **automation-templates/** Verzeichnis mit:
  - 3 CI/CD Workflows (React Native, Web, Generic)
  - 3 Pre-Commit Hook Varianten
  - 3 Validation Script Varianten
  - Platform Utilities (platform.ts)
  - ESLint Konfiguration
- ✅ **scripts/init-automation.sh** - One-Command Setup für alle Projekttypen
- ✅ **Neue Dokumentation:**
  - AUTOMATION_SETUP.md - Setup-Guide
  - RELEASE_CHECKLIST.md - Release-Checkliste
  - AUTOMATED_QUALITY_CHECKLIST.md - Komplette Checkliste
  - QUICK_START.md - Schnelleinstieg
  - AUTOMATION_SUMMARY.md - Komplette Übersicht
- ✅ **Automatische Erkennung** von React Native, Web und Generic Projekten
- ✅ **Angewendet auf alle Projekte:**
  - 1x1_Trainer (React Native)
  - EnergyPriceGermany (React Native)
  - Pflanzkalender (React Native)
  - DrawFromMemory (React Native)
  - Eisenhauer (Web/PWA)

**Impact:**
- Verhindert Platform-spezifische Bugs (window.matchMedia, localStorage)
- Automatische Version-Konsistenz Checks
- Pre-Commit Hooks für sofortiges Feedback
- CI/CD Pipeline für jeden Push/PR
- Security Audits automatisiert

### Version 2.2 (Labels)
- ✅ Standardisiertes Label-System (9 Labels)
- ✅ LABELS.md mit Dokumentation
- ✅ scripts/setup-labels.sh für Automatisierung
- ✅ Labels in allen 3 Projekten eingerichtet

### Version 2.1 (GitHub Integration)
- ✅ `.github/ISSUE_TEMPLATE/` mit 4 Template-Typen
  - bug.md - Bug Reports
  - feature.md - Feature Requests
  - documentation.md - Documentation Requests
  - question.md - Questions / Discussions
- ✅ `.github/PULL_REQUEST_TEMPLATE/` mit Standard PR Template
- ✅ `.github/README.md` - Dokumentation der GitHub Templates
- ✅ Hauptquellen-README aktualisiert

### Version 2.0 (Überarbeitet)
- ✅ technische_vorgaben.md komplett überarbeitet
- ✅ ux-vorgaben.md massiv erweitert
- ✅ design-system.md neu
- ✅ accessibility-guidelines.md neu
- ✅ testing-standards.md neu
- ✅ PUBLISHING_CHECKLIST.md aktuell

### Version 1.0 (Alte Version)
- Zu minimalistisch und projekt-spezifisch
- Jest statt Vitest
- Unvollständige Accessibility Richtlinien
- Fehlende Design System & GitHub Templates Dokumentation

---

## 🧭 Schnell-Navigation für deine Projekte

> **Du möchtest die Vorgaben in deinen Projekten anwenden?** Hier sind die wichtigsten Links:

### 🚀 Neues Projekt starten?
1. **[PROJECT_SETUP_CHECKLIST.md](PROJECT_SETUP_CHECKLIST.md)** - Schritt-für-Schritt Anleitung (2-4 Stunden)
2. Folge den Phasen 1-12
3. Fertig!

### 📚 Nachschlagen während der Entwicklung?
- **[STANDARDS_OVERVIEW.md](STANDARDS_OVERVIEW.md)** - Deine Schnell-Referenz (1 Seite zum Ausdrucken!)
  - Quick References nach Thema
  - Direktlinks zu spezifischen Vorgaben
  - Projekt-Rollen-Guide

### 📖 Vollständige Standards
- **[technische_vorgaben.md](technische_vorgaben.md)** - Alle technischen Standards
  - Code-Qualität, Testing, TypeScript
  - **Android Development** (Edge-to-Edge, App Links)
  - **PWA & React Native** (OTA Updates, EAS Channels)
  - CI/CD, Security, Deployment

- **[ux-vorgaben.md](ux-vorgaben.md)** - Alle UX/Design Standards
  - Design Systems, Farben, Typography, Spacing
  - **Accessibility (WCAG 2.1 AA)**
  - **Settings Menu** (Standardisierte Struktur)
  - Dark Mode, Barrierefreiheit, Internationalisierung

### ⚠️ Deprecated (Nicht mehr verwenden)
Diese Dateien wurden konsolidiert. Nutze stattdessen die neuen Dateien:
- ~~accessibility-guidelines.md~~ → [ux-vorgaben.md → Barrierefreiheit](ux-vorgaben.md#barrierefreiheit-accessibility--wcag-21-aa)
- ~~testing-standards.md~~ → [technische_vorgaben.md → Testing Standards](technische_vorgaben.md#testing-standards)

---

## 💬 Wie du die Vorgaben referenzierst

### In einer Code-Review:
```
"Bitte beachte [Theme-Aware Colors Pattern](ux-vorgaben.md#theme-aware-colors-architecture-)"
```

### Am Anfang eines Projekts:
```
"Folge [PROJECT_SETUP_CHECKLIST.md](../project-templates/PROJECT_SETUP_CHECKLIST.md) für Setup"
```

### Wenn du mir Anweisungen geben möchtest:
```
"Bitte orientiere dich an [STANDARDS_OVERVIEW.md](../project-templates/STANDARDS_OVERVIEW.md)"
```

---

## 🎓 Für verschiedene Rollen

### Frontend Engineer
- Starte mit: [PROJECT_SETUP_CHECKLIST.md](PROJECT_SETUP_CHECKLIST.md)
- Tägliche Referenz: [STANDARDS_OVERVIEW.md](STANDARDS_OVERVIEW.md)
- Details: [technische_vorgaben.md](technische_vorgaben.md) + [ux-vorgaben.md](ux-vorgaben.md)

### Backend Engineer
- Starte mit: [technische_vorgaben.md → Node.js/Backend Projects](technische_vorgaben.md#nodejs-backend-projects)
- Sicherheit: [technische_vorgaben.md → Sicherheit](technische_vorgaben.md#sicherheit-security)
- Testing: [STANDARDS_OVERVIEW.md → Testing](STANDARDS_OVERVIEW.md#testing)

### Android Developer
- Starte mit: [technische_vorgaben.md → Android App Entwicklung](technische_vorgaben.md#android-app-entwicklung)
- Edge-to-Edge: [technische_vorgaben.md → Edge-to-Edge Display](technische_vorgaben.md#edge-to-edge-display-android-15)
- Publishing: [technische_vorgaben.md → Android App Links](technische_vorgaben.md#android-app-links-deep-linking)

### UX/Product Designer
- Design Systems: [ux-vorgaben.md → Moderne Design-Systeme](ux-vorgaben.md#-moderne-design-systeme-20242025)
- Farben: [ux-vorgaben.md → Farbpalette](ux-vorgaben.md#farbpalette-color-system)
- Accessibility: [ux-vorgaben.md → Barrierefreiheit](ux-vorgaben.md#barrierefreiheit-accessibility--wcag-21-aa)

### DevOps/Release Manager
- CI/CD: [technische_vorgaben.md → CI/CD & GitHub Actions](technische_vorgaben.md#cicd--github-actions)
- Android Releases: [technische_vorgaben.md → Android App Links](technische_vorgaben.md#android-app-links-deep-linking)
- Expo Releases: [technische_vorgaben.md → OTA Updates](technische_vorgaben.md#expo-ota-updates-kritisch)

