---
# Standards Overview - Schnelle Referenz

**Deine Schnell-Referenz für alle Projekt-Vorgaben.** Diese Datei ist so strukturiert, dass du sie in Projekten schnell referenzieren kannst.

---

## 🚀 Für neue Projekte: START HIER

**1. Projekt Setup:**
→ Siehe [PROJECT_SETUP_CHECKLIST.md](PROJECT_SETUP_CHECKLIST.md)

**2. Technische Standards:**
→ Siehe [technische_vorgaben.md](technische_vorgaben.md)

**3. UX/Design Standards:**
→ Siehe [ux-vorgaben.md](ux-vorgaben.md)

---

## 🎯 Quick Reference nach Thema

### Code-Qualität & Formatierung
- **Prettier:** Automatisch auf jedem Commit
- **ESLint:** Modern Config (v8+)
- **TypeScript:** Strict Mode, 80% Type Coverage
- 📄 Vollständig in: [technische_vorgaben.md → Code-Qualität](technische_vorgaben.md#code-qualität)

### Testing
```
Unit Tests (70%) → Integration Tests (20%) → E2E Tests (10%)
Framework: Vitest (bevorzugt) oder Jest
Coverage: 60% minimum, 85% für kritische Module
```
- 📄 Vollständig in: [technische_vorgaben.md → Testing Standards](technische_vorgaben.md#testing-standards)

### Sicherheit
- ❌ Keine Secrets in Code/`.env`
- ✅ Nutze GitHub Secrets für CI/CD
- ✅ Server-side Input Validation
- ✅ Sanitize User Input (XSS Prevention)
- ✅ HTTPS überall in Production
- 📄 Vollständig in: [technische_vorgaben.md → Sicherheit](technische_vorgaben.md#sicherheit-security)

### Android Development (Android 15+)
```
compileSdk = 36
targetSdk = 36
Material Components >= 1.13.0
WindowCompat.setDecorFitsSystemWindows(window, false)
```
**Kritisch:** Edge-to-Edge transparent, App Links für Deep Linking
- 📄 Vollständig in: [technische_vorgaben.md → Android App Entwicklung](technische_vorgaben.md#android-app-entwicklung)

### PWA & React Native (Expo)
```
KRITISCH: OTA Updates Konfiguration VOR erstem Play Store Build!
✅ updates.enabled: true
✅ runtimeVersion.policy: "appVersion"
✅ EAS Channels für Staging + Production
```
**Platform Detection:** `Platform.OS === 'web'` (NICHT `typeof window`)
- 📄 Vollständig in: [technische_vorgaben.md → PWA & React Native](technische_vorgaben.md#pwa--react-native-expo-vorgaben)

### Design & UX
```
Mobile First: 320px → 768px → 1024px+
8px Base Grid für Spacing
Min. 44px × 44px für Touch Targets
Dark Mode Support: CSS Variables
```
**Farbpalette:** Max 5 Farben, Semantische Farben nur (success, warning, danger, info)
**Typography:** Max 2 Schriftarten, min. 14px Body Text
- 📄 Vollständig in: [ux-vorgaben.md → Design Fundamentals](ux-vorgaben.md#design-fundamentals)

### Design Systems (Wähle eins)
1. **"Soft & Modern"** ⭐ (Empfohlen) - Warme, sanfte Ästhetik
2. **"Minimal & Clean"** - Reduktion aufs Wesentliche
3. **"Glassmorphism & Modern"** - Transluzenz & Blur-Effekte
- 📄 Vollständig in: [ux-vorgaben.md → Moderne Design-Systeme](ux-vorgaben.md#-moderne-design-systeme-20242025)

### Farben & Theme
```
Light Mode:
  background: #FAFAFA
  surface: #F5F5F5
  text: #111827

Dark Mode:
  background: #0A0A0A
  surface: #1A1A1A
  text: #F3F4F6
```
**Wichtig:** Nutze Theme-Aware Colors Pattern für Tooltips/Modals
- 📄 Vollständig in: [ux-vorgaben.md → Theme-Aware Colors Architecture](ux-vorgaben.md#theme-aware-colors-architecture-)

### Barrierefreiheit (WCAG 2.1 AA)
```
Kontrast: 4.5:1 für Text, 3:1 für UI
Touch Target: Min. 44px × 44px
Keyboard Navigation: Tab, Enter, Escape funktionieren
Focus Ring: Sichtbar, 2px, Kontrast 3:1+
```
- 📄 Vollständig in: [ux-vorgaben.md → Barrierefreiheit](ux-vorgaben.md#barrierefreiheit-accessibility--wcag-21-aa)

### Settings Menu (Standardisiert)
```
Struktur (in dieser Reihenfolge):
1. Appearance (Light/Dark/System + Language)
2. App-spezifische Settings (optional)
3. User Account (Sign Out, optional)
4. Export/Data Management (optional)
5. Feedback / Support / About (IN EINER ZEILE!)
6. About Modal (Version, License, Data Source)
```
**Store Compliance:** Support Links sind KEINE "In-App Ads"
- 📄 Vollständig in: [ux-vorgaben.md → Settings Menu](ux-vorgaben.md#settings-menu-standardized-struktur)

### Performance Targets
```
Bundle Size: < 50 KB gzipped (PWA)
Lighthouse Score:
  Performance: 80+
  Accessibility: 90+
  Best Practices: 90+
  SEO: 90+
```
- 📄 Vollständig in: [technische_vorgaben.md → Build & Performance](technische_vorgaben.md#build--performance)

### CI/CD & Automation
```
Automatisch auf jeden Push:
  ✅ Prettier Check
  ✅ ESLint
  ✅ Type Check
  ✅ Unit Tests
  ✅ Build Verification

Branch Protection: main mit 1x Review minimum
```
- 📄 Vollständig in: [technische_vorgaben.md → CI/CD & GitHub Actions](technische_vorgaben.md#cicd--github-actions)

---

## 📋 Pre-Production Checklist

### Code & Build
- [ ] Alle Tests grün (`npm run test`)
- [ ] Coverage >= 60%
- [ ] ESLint bestanden (`npm run lint`)
- [ ] TypeScript bestanden (`npm run type-check`)
- [ ] Prettier Formatierung (`npm run format`)
- [ ] Build erfolgreich (`npm run build`)
- [ ] Keine `console.log`, `debugger` in Production Code
- [ ] Keine Secrets in Code

### UX & Accessibility
- [ ] Lighthouse >= 80 (PWA) oder 90 (andere)
- [ ] Dark Mode funktioniert
- [ ] Keyboard Navigation funktioniert
- [ ] Focus Rings sichtbar
- [ ] Touch Targets >= 44px
- [ ] Color Contrast >= 4.5:1

### Android (falls zutreffend)
- [ ] Edge-to-Edge implementiert
- [ ] App Links mit assetlinks.json
- [ ] targetSdk = 36
- [ ] Material Components >= 1.13.0
- [ ] Themes konfiguriert (Light & Dark)

### PWA/React Native (falls zutreffend)
- [ ] OTA Updates konfiguriert
- [ ] Platform.OS für Data Loading
- [ ] EAS Channels Setup
- [ ] Runtime Version Policy

### Documentation
- [ ] README aktualisiert
- [ ] CHANGELOG aktualisiert
- [ ] .env.example vorhanden (ohne Secrets)
- [ ] Git Tag gesetzt: `git tag v1.0.0`

---

## 🔗 Direkter Link zu spezifischen Themen

### Wenn ich dir sagen will "Bitte beachte technische_vorgaben.md":
> "Bitte orientiere dich an [technische_vorgaben.md](technische_vorgaben.md)"

### Wenn ich dir sagen will "Bitte beachte UX Standards":
> "Bitte orientiere dich an [ux-vorgaben.md](ux-vorgaben.md)"

### Wenn ich dir sagen will "Edge-to-Edge Android":
> "Bitte implementiere [Edge-to-Edge Display (Android 15+)](technische_vorgaben.md#edge-to-edge-display-android-15)"

### Wenn ich dir sagen will "Settings Menu":
> "Bitte implementiere das [Settings Menu nach Standard](ux-vorgaben.md#settings-menu-standardized-struktur)"

### Wenn ich dir sagen will "OTA Updates":
> "Bitte implementiere [Expo OTA Updates](technische_vorgaben.md#expo-ota-updates-kritisch)"

### Wenn ich dir sagen will "Theme Colors":
> "Bitte nutze das [Theme-Aware Colors Pattern](ux-vorgaben.md#theme-aware-colors-architecture-)"

### Wenn ich dir sagen will "Accessibility":
> "Bitte beachte [WCAG 2.1 AA Standards](ux-vorgaben.md#barrierefreiheit-accessibility--wcag-21-aa)"

---

## 📊 Projekt-Rollen & ihre Referenzen

### Frontend Engineer (Web/Mobile)
- **Morgen-Checklist:** [technische_vorgaben.md](technische_vorgaben.md) + [ux-vorgaben.md](ux-vorgaben.md)
- **Code Qualität:** [Code-Qualität Section](technische_vorgaben.md#code-qualität)
- **UX Implementation:** [Design Systems](ux-vorgaben.md#-moderne-design-systeme-20242025)
- **Accessibility:** [WCAG 2.1 AA](ux-vorgaben.md#barrierefreiheit-accessibility--wcag-21-aa)

### Backend Engineer
- **Standards:** [technische_vorgaben.md](technische_vorgaben.md)
- **Security:** [Sicherheit](technische_vorgaben.md#sicherheit-security)
- **Testing:** [Testing Standards](technische_vorgaben.md#testing-standards)
- **API:** [Spezielle Projekttypen → Node.js/Backend](technische_vorgaben.md#nodejs-backend-projects)

### Android Developer
- **Standards:** [technische_vorgaben.md → Android App Entwicklung](technische_vorgaben.md#android-app-entwicklung)
- **Edge-to-Edge:** [Edge-to-Edge Display](technische_vorgaben.md#edge-to-edge-display-android-15)
- **App Links:** [Android App Links](technische_vorgaben.md#android-app-links-deep-linking)
- **Play Store:** [Deployment & Publishing](technische_vorgaben.md#deployment-strategie-mit-eas-channels)

### React Native/Expo Developer
- **Standards:** [technische_vorgaben.md → PWA & React Native](technische_vorgaben.md#pwa--react-native-expo-vorgaben)
- **OTA Updates:** [Expo OTA Updates](technische_vorgaben.md#expo-ota-updates-kritisch)
- **Staging/Production:** [EAS Channels](technische_vorgaben.md#deployment-strategie-mit-eas-channels)
- **Platform Detection:** [Platform-spezifische Code](technische_vorgaben.md#platform-detection-für-data-loading)

### UX/Product Designer
- **Standards:** [ux-vorgaben.md](ux-vorgaben.md)
- **Design Systems:** [Moderne Design-Systeme](ux-vorgaben.md#-moderne-design-systeme-20242025)
- **Farben & Colors:** [Farbpalette](ux-vorgaben.md#farbpalette-color-system)
- **Accessibility:** [WCAG 2.1 AA](ux-vorgaben.md#barrierefreiheit-accessibility--wcag-21-aa)
- **Settings:** [Settings Menu Standard](ux-vorgaben.md#settings-menu-standardized-struktur)

### QA/Test Engineer
- **Testing Standards:** [technische_vorgaben.md → Testing Standards](technische_vorgaben.md#testing-standards)
- **Checklists:** [Pre-Production Checklist](technische_vorgaben.md#checkliste-vor-production-deploy)
- **UX Compliance:** [ux-vorgaben.md Checklist](ux-vorgaben.md#checkliste-für-neues-projekt)
- **Accessibility Testing:** [WCAG 2.1 AA](ux-vorgaben.md#barrierefreiheit-accessibility--wcag-21-aa)

### DevOps/Release Manager
- **CI/CD:** [CI/CD & GitHub Actions](technische_vorgaben.md#cicd--github-actions)
- **Android:** [Android App Links](technische_vorgaben.md#android-app-links-deep-linking)
- **Expo Releases:** [OTA Updates](technische_vorgaben.md#expo-ota-updates-kritisch) + [EAS Channels](technische_vorgaben.md#deployment-strategie-mit-eas-channels)
- **Pre-Release:** [Pre-Production Checklist](technische_vorgaben.md#checkliste-vor-production-deploy)

---

## 💡 Tipps für die praktische Nutzung

### In einer Review sagen:
> "Bitte beachte Punkt XYZ in [technische_vorgaben.md](technische_vorgaben.md#xyz)"

### Einem neuen Team-Member helfen:
> "Lies [PROJECT_SETUP_CHECKLIST.md](PROJECT_SETUP_CHECKLIST.md) und [ux-vorgaben.md](ux-vorgaben.md)"

### Als Pinned Issue in GitHub:
```
📌 Projekt-Standards:
- Technisch: https://github.com/.../project-templates/blob/main/technische_vorgaben.md
- UX/Design: https://github.com/.../project-templates/blob/main/ux-vorgaben.md
- Setup: https://github.com/.../project-templates/blob/main/PROJECT_SETUP_CHECKLIST.md
```

### Als Quick-Help für dich selbst:
Kopiere diese Datei und verwende sie als Cheat Sheet für Reviews!

---

## 📅 Versionshistorie

| Datum | Version | Änderung |
|-------|---------|----------|
| 2025-12-26 | 1.0 | Initiale Konsolidierung & Overview erstellt |

---

**Fragen zur Orientierung?** Siehe [Struktur Konsolidierung im README](README.md#-struktur-konsolidierung-stand-2025-12-26)
