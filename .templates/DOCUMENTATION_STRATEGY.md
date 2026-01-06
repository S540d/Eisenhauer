# Documentation Strategy - Bereinigung & Templates

**Datum:** 2025-11-22
**Status:** 🔴 KRITISCH - Play Store Links beachten!

---

## ⚠️ WICHTIG: Play Store Constraints

### Dokumente die NIEMALS verschoben werden dürfen

Diese Dateien sind im **Google Play Store** verlinkt und müssen im jeweiligen Projekt-Repository bleiben:

```yaml
MUSS im Projekt-Repo bleiben:
  - PRIVACY_POLICY.md
    Grund: Im Play Store als Privacy Policy URL angegeben
    URL-Format: https://github.com/S540d/{PROJECT}/blob/main/PRIVACY_POLICY.md
    Alternativen:
      - GitHub Pages: https://s540d.github.io/{PROJECT}/PRIVACY_POLICY.html
      - BEIDE Versionen müssen identisch bleiben!

  - public/PRIVACY_POLICY.html
    Grund: Deployed via GitHub Pages, im Play Store verlinkt

  - README.md
    Grund: Haupt-Dokumentation, im Play Store Source Code Link verlinkt

Kritische Play Store URLs (Energy Price Germany):
  ✅ Privacy Policy: https://github.com/S540d/Energy_Price_Germany/blob/main/PRIVACY_POLICY.md
  ✅ GitHub Pages: https://s540d.github.io/Energy_Price_Germany/PRIVACY_POLICY.html
  ✅ Source Code: https://github.com/S540d/Energy_Price_Germany
  ✅ Issues: https://github.com/S540d/Energy_Price_Germany/issues
```

### Play Store Update-Prozess

```markdown
Wenn Privacy Policy geändert wird:
1. ✅ PRIVACY_POLICY.md im Projekt aktualisieren
2. ✅ public/PRIVACY_POLICY.html aktualisieren (synchron halten!)
3. ✅ GitHub Pages deployment triggern
4. ✅ Play Store Update NICHT nötig (URL bleibt gleich)
5. ❌ NIE die Datei umbenennen oder verschieben!

Wenn URL sich ändern würde:
⚠️ Play Store App-Update nötig (neue Submission!)
⚠️ Review-Prozess (bis zu 7 Tage)
⚠️ Nutzer sehen alte URL bis Update
```

---

## ✅ Neue Strategie: Hybrid-Ansatz

### Was nach project_templates verschoben wird

Nur **echte Templates** (mit Platzhaltern):

```yaml
Templates (mit {{PLACEHOLDERS}}):
  - PRIVACY_POLICY_TEMPLATE.md
    → Template mit {{APP_NAME}}, {{DEVELOPER_NAME}}, {{GITHUB_URL}}
    → Projekte kopieren und anpassen

  - ANDROID_STORE_CHECKLIST_TEMPLATE.md
    → Checkliste für Play Store Submission
    → Projektübergreifend nutzbar

  - BUILD_TEMPLATE.md
    → Build-Prozess (Expo, EAS, etc.)
    → Anpassbar für verschiedene Build-Systeme

  - PERMISSIONS_TEMPLATE.md
    → Android Permissions Dokumentation
    → Mit Begründungen für Play Store

  - SECURITY_TEMPLATE.md
    → Security Best Practices
    → Keystore Management, Firebase Security
```

### Was im Projekt-Repo bleibt

**Projekt-spezifische Dokumente** (auch wenn ähnlich):

```yaml
Energy Price Germany:
  Spezifisch:
    ✅ ARCHITECTURE.md - App-Architektur
    ✅ DATA-MERGE-STRATEGY.md - Daten-Pipeline
    ✅ CHANGELOG.md - Versionshistorie
    ✅ README.md - Projekt-Übersicht

  Play Store Required:
    ✅ PRIVACY_POLICY.md - Im Play Store verlinkt!
    ✅ public/PRIVACY_POLICY.html - GitHub Pages
    ✅ PERMISSIONS.md - Permissions-Dokumentation

  Build-Spezifisch:
    ✅ BUILD.md - Projekt-spezifische Build-Schritte
    ✅ LOCAL_BUILD_GUIDE.md - Lokale Builds
    ✅ BARE_WORKFLOW_GUIDE.md - Expo Bare Workflow

  Store:
    ✅ STORE_DESCRIPTION.md - Store-Texte (app-spezifisch!)
    ✅ ANDROID_STORE_CHECKLIST.md - Projekt-spezifische Checkliste
    ✅ keystore/KEYSTORE_BACKUP_GUIDE.md - Keystore-Management

Eisenhauer:
  Spezifisch:
    ✅ CHANGELOG.md
    ✅ README.md
    ✅ DRAG_DROP_REQUIREMENTS.md - Feature-spezifisch
    ✅ CACHE-BUSTING.md - Projekt-spezifisch

  Firebase:
    ✅ FIREBASE-SETUP.md - Projekt-Konfiguration
    ✅ FIREBASE-SECURITY-SETUP.md - Security Rules

  Zu prüfen/archivieren:
    ⚠️ ANDROID_STATUS.md - Noch aktuell?
    ⚠️ DOCUMENTATION_AUDIT_2025-11-13.md - Veraltet?
    ⚠️ ISSUES.md - GitHub Issues dupliziert?
    ⚠️ SECURITY-NOTE.md - In SECURITY.md mergen?

1x1_Trainer:
  Spezifisch:
    ✅ CHANGELOG.md
    ✅ README.md
    ✅ ROADMAP.md
    ✅ PROJECT-INDEX.md
    ✅ PRIVACY_POLICY.md - Play Store verlinkt!

  Deployment:
    ✅ DEPLOYMENT.md - Projekt-spezifisch

  Zu archivieren (abgeschlossen):
    📦 PWA-COMPLETION-REPORT.md → docs/archive/
    📦 PWA-OPTIMIZATION.md → docs/archive/
    📦 PWA-TESTING.md → docs/archive/
    📦 TWA-DEVELOPMENT.md → docs/archive/

  Zu prüfen:
    ⚠️ MULTI_PROJECT_GUIDE.md - Was ist das?
    ⚠️ ANDROID-UX-GUIDELINES.md - Zu DESIGN_GUIDELINES.md mergen?
```

---

## 🎯 Actionable Steps

### Phase 1: Templates erstellen (project_templates)

```bash
cd ~/Documents/Programmierung/Projects/project-templates

# Template-Dateien erstellen (mit Platzhaltern):
PRIVACY_POLICY_TEMPLATE.md
ANDROID_STORE_CHECKLIST_TEMPLATE.md
BUILD_TEMPLATE.md
PERMISSIONS_TEMPLATE.md
SECURITY_TEMPLATE.md
FIREBASE_SETUP_TEMPLATE.md

# Bereits vorhanden:
✅ DESIGN_GUIDELINES.md
✅ MARKETING_GROWTH_GUIDE.md
✅ ux-vorgaben.md
✅ technische_vorgaben.md
✅ design-system.md
✅ accessibility-guidelines.md
✅ testing-standards.md
```

### Phase 2: Projekt-Docs bereinigen

#### Energy Price Germany
```bash
# Nichts löschen/verschieben! (Play Store Links)
# Nur veralte/doppelte Docs entfernen:

# Zu prüfen:
- Ist BARE_WORKFLOW_GUIDE.md noch relevant?
  → Ja: behalten
  → Nein: archivieren

# Zu aktualisieren:
- README.md: Link zu project_templates Templates
```

#### Eisenhauer
```bash
# Archivieren (veraltet):
mkdir -p docs/archive
mv DOCUMENTATION_AUDIT_2025-11-13.md docs/archive/  # Veraltet
mv ISSUES.md docs/archive/  # Falls GitHub Issues dupliziert
mv SECURITY-NOTE.md docs/archive/  # Falls in SECURITY.md enthalten

# Zu prüfen:
- ANDROID_STATUS.md: Noch aktuell? → Aktualisieren oder löschen
- INSTALL.md: Noch relevant? → In README mergen oder löschen
```

#### 1x1_Trainer
```bash
# PWA-Docs archivieren (abgeschlossen):
mkdir -p docs/archive
mv PWA-COMPLETION-REPORT.md docs/archive/
mv PWA-OPTIMIZATION.md docs/archive/
mv PWA-TESTING.md docs/archive/
mv TWA-DEVELOPMENT.md docs/archive/

# Zu prüfen:
- MULTI_PROJECT_GUIDE.md: Was ist das? → Prüfen, dann entscheiden
- ANDROID-UX-GUIDELINES.md: → Zu DESIGN_GUIDELINES.md (project_templates) mergen?

# Zu aktualisieren:
- README.md: Link zu project_templates
```

### Phase 3: project_templates README erstellen

```markdown
# project_templates/README.md

## Template-Kategorien

### 1. Design & UX
- DESIGN_GUIDELINES.md
- ux-vorgaben.md
- design-system.md
- accessibility-guidelines.md

### 2. Development
- technische_vorgaben.md
- BUILD_TEMPLATE.md
- testing-standards.md
- SECURITY_TEMPLATE.md

### 3. Marketing & Growth
- MARKETING_GROWTH_GUIDE.md

### 4. Play Store
- ANDROID_STORE_CHECKLIST_TEMPLATE.md
- PRIVACY_POLICY_TEMPLATE.md
- PERMISSIONS_TEMPLATE.md

### 5. Firebase (optional)
- FIREBASE_SETUP_TEMPLATE.md

## Nutzung

1. Template nach Projekt kopieren
2. Platzhalter ersetzen ({{APP_NAME}}, etc.)
3. Projekt-spezifische Anpassungen
4. Commit & Push

## Play Store Compliance

⚠️ WICHTIG: Privacy Policy MUSS im Projekt-Repo bleiben!

Grund: Im Play Store als URL verlinkt
Format: https://github.com/S540d/{PROJECT}/blob/main/PRIVACY_POLICY.md

Prozess:
1. PRIVACY_POLICY_TEMPLATE.md → Projekt kopieren
2. Platzhalter ersetzen
3. Als PRIVACY_POLICY.md speichern
4. NIE umbenennen oder verschieben!
```

---

## 📊 Zusammenfassung: Was wohin?

```yaml
project_templates/ (Templates mit Platzhaltern):
  ✅ DESIGN_GUIDELINES.md
  ✅ MARKETING_GROWTH_GUIDE.md
  🔄 PRIVACY_POLICY_TEMPLATE.md - NEU
  🔄 ANDROID_STORE_CHECKLIST_TEMPLATE.md - NEU
  🔄 BUILD_TEMPLATE.md - NEU
  🔄 PERMISSIONS_TEMPLATE.md - NEU
  🔄 SECURITY_TEMPLATE.md - NEU
  🔄 FIREBASE_SETUP_TEMPLATE.md - NEU

Projekt-Repos (Spezifisch + Play Store Required):
  ✅ README.md
  ✅ CHANGELOG.md
  ✅ PRIVACY_POLICY.md (PLAY STORE!)
  ✅ public/PRIVACY_POLICY.html (PLAY STORE!)
  ✅ Projekt-spezifische Docs

Zu löschen/archivieren:
  ❌ Veraltete Audit-Dateien
  📦 Abgeschlossene Projekt-Docs (PWA, etc.)
  ❌ Doppelte Dokumentation
```

---

## ⚠️ Lessons Learned

1. **Immer Play Store Links prüfen** bevor Docs verschoben werden
2. **GitHub Pages Deployment** = kritische Abhängigkeit
3. **URL-Stabilität** wichtiger als Dokumentations-Struktur
4. **Templates ≠ aktive Projekt-Docs**
5. **Hybrid-Ansatz** = Templates in project_templates, Instanzen in Projekten

---

## 🔧 Nächste Schritte

### Jetzt (sofort):
1. ✅ Dieses Dokument reviewen
2. ✅ Bestätigung: Strategie OK?
3. ⚠️ NICHT voreilig Dateien verschieben!

### Diese Woche:
4. Templates in project_templates erstellen
5. Veraltete Docs in Projekten archivieren
6. READMEs aktualisieren (Links zu Templates)

### Langfristig:
7. Neue Projekte: Templates nutzen
8. Privacy Policy: Template → kopieren, nie verschieben
9. Play Store: URLs dokumentieren (nie ändern!)

---

**Status:** 🟡 Strategie definiert, Umsetzung ausstehend
**Risiko:** 🔴 HOCH wenn Privacy Policy verschoben wird!
**Priorität:** 🔴 KRITISCH - Play Store Compliance

---

*Erstellt: 2025-11-22*
*Autor: Claude Code*
*Basierend auf: DOCUMENTATION_AUDIT.md + Play Store Link Analysis*
