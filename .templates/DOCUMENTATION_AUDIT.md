# Documentation Audit - S540d Apps

**Datum:** 2025-11-22
**Ziel:** Redundanzen eliminieren, Templates zentral verwalten

---

## 📊 Aktueller Stand

### Energy Price Germany (11 MD-Dateien)
```
Projekt-spezifisch (bleiben):
✅ ARCHITECTURE.md - App-Architektur
✅ CHANGELOG.md - Versionshistorie
✅ DATA-MERGE-STRATEGY.md - Daten-Pipeline
✅ README.md - Projekt-Übersicht

Generisch (zu project_templates verschieben):
🔄 ANDROID_STORE_CHECKLIST.md - Allgemein für alle Android-Apps
🔄 BARE_WORKFLOW_GUIDE.md - Allgemein für Expo Bare Workflow
🔄 BUILD.md - Template für Build-Prozess
🔄 LOCAL_BUILD_GUIDE.md - Template für lokale Builds
🔄 PERMISSIONS.md - Template für Android Permissions
🔄 PRIVACY_POLICY.md - Template mit Platzhaltern
🔄 STORE_DESCRIPTION.md - Template für Store-Listings
```

### Eisenhauer (15 MD-Dateien)
```
Projekt-spezifisch (bleiben):
✅ CHANGELOG.md - Versionshistorie
✅ README.md - Projekt-Übersicht
✅ README_ANDROID.md - Android-spezifische Infos
✅ DRAG_DROP_REQUIREMENTS.md - Feature-spezifisch
✅ CACHE-BUSTING.md - Projekt-spezifisch
✅ tasks_management_combined_issue.md - Issue-Tracking

Generisch (zu project_templates verschieben):
🔄 FIREBASE-SECURITY-SETUP.md - Template
🔄 FIREBASE-SETUP.md - Template
🔄 ANDROID_APP_LINKS.md - Template
🔄 SECURITY.md - Template mit Best Practices
🔄 INSTALL.md - Template

Veraltet (löschen):
❌ ANDROID_STATUS.md - Wahrscheinlich veraltet
❌ DOCUMENTATION_AUDIT_2025-11-13.md - Alte Audit-Datei
❌ ISSUES.md - Wenn in GitHub Issues dupliziert
❌ SECURITY-NOTE.md - Wenn in SECURITY.md enthalten
```

### 1x1_Trainer (12 MD-Dateien)
```
Projekt-spezifisch (bleiben):
✅ CHANGELOG.md - Versionshistorie
✅ README.md - Projekt-Übersicht
✅ ROADMAP.md - Projekt-Roadmap
✅ RELEASE-NOTES-v1.0.5.md - Release-spezifisch
✅ PROJECT-INDEX.md - Projekt-Navigation

Generisch (zu project_templates verschieben):
🔄 DEPLOYMENT.md - Template
🔄 PRIVACY_POLICY.md - Template
🔄 ANDROID-UX-GUIDELINES.md - Template (oder zu DESIGN_GUIDELINES.md mergen)

Veraltet (löschen oder archivieren):
❌ PWA-COMPLETION-REPORT.md - Abgeschlossenes Projekt
❌ PWA-OPTIMIZATION.md - Falls nicht mehr relevant
❌ PWA-TESTING.md - Falls nicht mehr relevant
❌ TWA-DEVELOPMENT.md - Falls abgeschlossen
❌ MULTI_PROJECT_GUIDE.md - Unklar, prüfen
```

---

## 🎯 Empfohlene Aktionen

### 1. Templates in project_templates erstellen

```yaml
Neue Template-Dateien:
  - ANDROID_STORE_CHECKLIST_TEMPLATE.md
  - BUILD_TEMPLATE.md
  - PERMISSIONS_TEMPLATE.md
  - PRIVACY_POLICY_TEMPLATE.md
  - STORE_DESCRIPTION_TEMPLATE.md
  - FIREBASE_SETUP_TEMPLATE.md
  - DEPLOYMENT_TEMPLATE.md
  - SECURITY_TEMPLATE.md

Struktur:
  - Platzhalter: {{APP_NAME}}, {{PACKAGE_ID}}, {{DEVELOPER_NAME}}
  - Anleitung: "Wie dieses Template nutzen"
  - Beispiele: Konkrete Beispiele aus bestehenden Apps
```

### 2. Projekt-Dokumentation bereinigen

#### Energy Price Germany
```bash
# Zu löschen aus EnergyPriceGermany:
rm ANDROID_STORE_CHECKLIST.md  # → project_templates
rm BARE_WORKFLOW_GUIDE.md       # → project_templates
rm BUILD.md                     # → project_templates (als Template)
rm LOCAL_BUILD_GUIDE.md         # → project_templates (als Template)
rm PERMISSIONS.md               # → project_templates (als Template)
rm PRIVACY_POLICY.md            # → project_templates (als Template)
rm STORE_DESCRIPTION.md         # → project_templates (als Template)

# Behalten:
- ARCHITECTURE.md (app-spezifisch)
- CHANGELOG.md (app-spezifisch)
- DATA-MERGE-STRATEGY.md (app-spezifisch)
- README.md (app-spezifisch)
```

#### Eisenhauer
```bash
# Zu löschen/verschieben:
rm DOCUMENTATION_AUDIT_2025-11-13.md  # Veraltet
rm ISSUES.md                          # Falls dupliziert in GitHub
rm SECURITY-NOTE.md                   # → SECURITY.md mergen

# Zu verschieben nach project_templates:
mv FIREBASE-SECURITY-SETUP.md → project_templates/FIREBASE_SECURITY_SETUP_TEMPLATE.md
mv FIREBASE-SETUP.md → project_templates/FIREBASE_SETUP_TEMPLATE.md
mv ANDROID_APP_LINKS.md → project_templates/ANDROID_APP_LINKS_TEMPLATE.md
mv SECURITY.md → project_templates/SECURITY_TEMPLATE.md

# Zu prüfen:
- ANDROID_STATUS.md (aktuell?)
- INSTALL.md (noch relevant?)
```

#### 1x1_Trainer
```bash
# Zu archivieren (falls abgeschlossen):
mkdir -p docs/archive
mv PWA-COMPLETION-REPORT.md docs/archive/
mv PWA-OPTIMIZATION.md docs/archive/  # Falls nicht mehr relevant
mv PWA-TESTING.md docs/archive/       # Falls nicht mehr relevant
mv TWA-DEVELOPMENT.md docs/archive/   # Falls abgeschlossen

# Zu verschieben nach project_templates:
mv DEPLOYMENT.md → project_templates/DEPLOYMENT_TEMPLATE.md
mv ANDROID-UX-GUIDELINES.md → Mergen in DESIGN_GUIDELINES.md

# Zu prüfen:
- MULTI_PROJECT_GUIDE.md (Was ist das?)
```

### 3. Referenzen aktualisieren

```markdown
# In jedem README.md:

## 📚 Dokumentation

### Projekt-spezifisch:
- [ARCHITECTURE.md](ARCHITECTURE.md) - App-Architektur
- [CHANGELOG.md](CHANGELOG.md) - Versionshistorie
- [README.md](README.md) - Diese Datei

### Templates & Vorgaben:
Siehe: [project_templates Repository](https://github.com/S540d/project-templates)

- Design Guidelines
- Marketing & Growth Guide
- Build Templates
- Store Checklists
- Privacy Policy Templates
```

---

## 📋 Migrations-Checkliste

### Phase 1: Template-Erstellung (2-3h)
- [ ] DESIGN_GUIDELINES.md nach project_templates verschieben ✅
- [ ] MARKETING_GROWTH_GUIDE.md erstellt ✅
- [ ] ANDROID_STORE_CHECKLIST_TEMPLATE.md erstellen
- [ ] BUILD_TEMPLATE.md erstellen
- [ ] PERMISSIONS_TEMPLATE.md erstellen
- [ ] PRIVACY_POLICY_TEMPLATE.md erstellen
- [ ] STORE_DESCRIPTION_TEMPLATE.md erstellen
- [ ] FIREBASE_SETUP_TEMPLATE.md erstellen
- [ ] DEPLOYMENT_TEMPLATE.md erstellen
- [ ] SECURITY_TEMPLATE.md erstellen

### Phase 2: Energy Price Germany bereinigen (1h)
- [ ] Generische Docs nach project_templates verschieben
- [ ] Veraltete Docs löschen
- [ ] README.md aktualisieren (Links zu Templates)
- [ ] Commit & Push

### Phase 3: Eisenhauer bereinigen (1h)
- [ ] Generische Docs nach project_templates verschieben
- [ ] Veraltete Docs löschen/archivieren
- [ ] README.md aktualisieren
- [ ] Commit & Push

### Phase 4: 1x1_Trainer bereinigen (1h)
- [ ] Generische Docs nach project_templates verschieben
- [ ] PWA-Docs archivieren (falls abgeschlossen)
- [ ] README.md aktualisieren
- [ ] Commit & Push

### Phase 5: project_templates finalisieren (1h)
- [ ] README.md in project_templates erstellen
- [ ] Template-Index erstellen
- [ ] Nutzungsanleitung für Templates
- [ ] Commit & Push

---

## 🎯 Ziel-Struktur

### project_templates/
```
project_templates/
├── README.md                              # Index & Nutzungsanleitung
├── DESIGN_GUIDELINES.md                   # UX/UI Vorgaben ✅
├── MARKETING_GROWTH_GUIDE.md              # Marketing-Strategien ✅
├── ANDROID_STORE_CHECKLIST_TEMPLATE.md    # Play Store Checklist
├── BUILD_TEMPLATE.md                      # Build-Prozess
├── PERMISSIONS_TEMPLATE.md                # Android Permissions
├── PRIVACY_POLICY_TEMPLATE.md             # Datenschutzerklärung
├── STORE_DESCRIPTION_TEMPLATE.md          # Store-Listing
├── FIREBASE_SETUP_TEMPLATE.md             # Firebase-Integration
├── DEPLOYMENT_TEMPLATE.md                 # Deployment-Guide
├── SECURITY_TEMPLATE.md                   # Security Best Practices
├── ux-vorgaben.md                         # Bestehend
├── technische_vorgaben.md                 # Bestehend
├── design-system.md                       # Bestehend
├── accessibility-guidelines.md            # Bestehend
├── testing-standards.md                   # Bestehend
└── .github/                               # GitHub Templates
    ├── ISSUE_TEMPLATE/
    ├── PULL_REQUEST_TEMPLATE/
    └── workflows/
```

### App-Projekte/ (minimiert)
```
EnergyPriceGermany/
├── README.md                    # Projekt-Übersicht + Links zu Templates
├── ARCHITECTURE.md              # App-spezifische Architektur
├── CHANGELOG.md                 # Versionshistorie
└── DATA-MERGE-STRATEGY.md       # App-spezifische Strategie

Eisenhauer/
├── README.md
├── CHANGELOG.md
├── CACHE-BUSTING.md             # App-spezifisch
└── DRAG_DROP_REQUIREMENTS.md    # App-spezifisch

1x1_Trainer/
├── README.md
├── CHANGELOG.md
├── ROADMAP.md
└── docs/
    └── archive/                 # Abgeschlossene Projekte
        ├── PWA-COMPLETION-REPORT.md
        └── ...
```

---

## 💡 Vorteile der neuen Struktur

1. **Keine Redundanz:** Templates zentral in project_templates
2. **Einfache Updates:** Einmal ändern, alle Projekte profitieren
3. **Schneller Start:** Neues Projekt = Templates kopieren
4. **Übersichtlichkeit:** Jedes Projekt hat nur relevante Docs
5. **Wartbarkeit:** Weniger Dateien = weniger Pflege-Aufwand

---

## 🔍 Nächste Schritte

### Sofort:
1. Review dieser Audit-Datei
2. Entscheidung: Welche Docs wirklich verschieben/löschen?
3. Phase 1 starten: Template-Erstellung

### Diese Woche:
4. Phase 2-4: Projekte bereinigen
5. Phase 5: project_templates README

### Langfristig:
6. Bei neuem Projekt: Templates nutzen
7. Learnings zurück in Templates fließen lassen
8. Dokumentation lebendig halten

---

## ❓ Offene Fragen

1. **MULTI_PROJECT_GUIDE.md** (1x1_Trainer): Was ist das? Relevant?
2. **PWA-Docs** (1x1_Trainer): Wirklich archivieren oder noch aktiv?
3. **ANDROID_STATUS.md** (Eisenhauer): Noch aktuell?
4. **ISSUES.md** (Eisenhauer): Duplikat zu GitHub Issues?

---

**Status:** 🟡 Audit abgeschlossen, Migration ausstehend
**Geschätzter Aufwand:** 6-8 Stunden gesamt
**Prioität:** Mittel (keine Dringlichkeit, aber hoher Nutzen)

---

*Erstellt: 2025-11-22*
*Autor: Claude Code*
