# Project Templates

Zentrale Vorlagen und Standards für alle Projekte. Diese Templates definieren Best Practices für Code-Qualität, UX/Design, Testing und Accessibility.

---

## Inhalt

### Kernstandards

1. **technische_vorgaben.md**
   - Code-Qualität (Prettier, ESLint, TypeScript)
   - Testing Standards (Vitest, Jest, Playwright)
   - TypeScript Best Practices
   - Package Management
   - Build & Performance
   - Sicherheit (Secrets, Input Validation, HTTPS)
   - CI/CD & GitHub Actions
   - Pre-Production Checklist

2. **ux-vorgaben.md**
   - Design Fundamentals (Mobile First, Progressive Enhancement)
   - Farbpalette & Semantische Farben
   - Typography & Font Selection
   - Spacing System (8px Grid)
   - Responsive Design Breakpoints
   - Komponenten Standards
   - Dark Mode / Theme Support
   - Barrierefreiheit (WCAG 2.1 AA)
   - Interaktion & Feedback
   - UX Checklist

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

### Deployment & Publishing

6. **PUBLISHING_CHECKLIST.md**
   - Checkliste für das Veröffentlichen von GitHub Pages PWAs
   - Optische Vorgaben (Design, Theme, Components)
   - Technische Konfiguration (GitHub Actions, PWA, Service Worker)
   - Code-Qualität Checkliste
   - Repository Setup
   - Sicherheit & Rechtliches
   - Dokumentation

---

## Verwendung in Projekten

Diese Templates werden als Git-Submodul in Projekte eingebunden:

```bash
git submodule add <repo-url> .templates
```

Dann sind alle Templates verfügbar unter `.templates/`:

```
.templates/
├── README.md                      # Diese Datei
├── technische_vorgaben.md         # Technische Standards
├── ux-vorgaben.md                 # UX/Design Standards
├── design-system.md               # Komponenten-Katalog
├── accessibility-guidelines.md    # WCAG 2.1 AA Guidelines
├── testing-standards.md           # Testing Best Practices
└── PUBLISHING_CHECKLIST.md        # Publishing Checklist
```

---

## Quick Start für neues Projekt

1. **Technische Setup** - Lese `technische_vorgaben.md` für:
   - ESLint & Prettier Konfiguration
   - Vitest Setup
   - GitHub Actions Workflows

2. **UX/Design Setup** - Nutze `ux-vorgaben.md` für:
   - Color Palette definieren (CSS Variables)
   - Typography konfigurieren
   - Responsive Breakpoints setzen
   - Dark Mode implementieren

3. **Komponenten** - Referenziere `design-system.md` für:
   - Button Komponenten
   - Form Elements
   - Modals und andere häufige Komponenten

4. **Accessibility** - Checke `accessibility-guidelines.md` für:
   - WCAG 2.1 AA Compliance
   - Keyboard Navigation
   - Screen Reader Support
   - Color Contrast

5. **Testing** - Implementiere Tests nach `testing-standards.md`:
   - Unit Tests (Vitest)
   - E2E Tests (Playwright)
   - 60%+ Coverage Ziel

6. **Publishing** - Vor Release `PUBLISHING_CHECKLIST.md`:
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

## Aktualisierungshistorie

### Version 2.0 (Überarbeitet)
- ✅ technische_vorgaben.md komplett überarbeitet (alt: obsolet)
- ✅ ux-vorgaben.md massiv erweitert (alt: zu oberflächlich)
- ✅ design-system.md neu (alt: fehlte)
- ✅ accessibility-guidelines.md neu (alt: fehlte)
- ✅ testing-standards.md neu (alt: fehlte)
- ✅ PUBLISHING_CHECKLIST.md aktuell (neu: basierend auf Eisenhauer)

### Alte Version (1.0)
- Zu minimalistisch und projekt-spezifisch
- Jest statt Vitest
- Unvollständige Accessibility Richtlinien
- Fehlende Design System Dokumentation

