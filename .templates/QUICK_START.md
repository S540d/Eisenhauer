# 🚀 Quick Start: Automatische Quality Assurance

## Für ein neues Projekt

### 1. Einmalige Setup (wenn noch nicht geschehen)

```bash
cd /Users/svenstrohkark/Documents/Programmierung/Projects/project-templates
git pull  # Stelle sicher, dass Templates aktuell sind
```

### 2. Automation in neuem Projekt einrichten

```bash
# Gehe zu deinem neuen Projekt
cd /Users/svenstrohkark/Documents/Programmierung/Projects/MeinNeuesProjekt

# Führe Automation Init aus
/Users/svenstrohkark/Documents/Programmierung/Projects/project-templates/scripts/init-automation.sh .

# Folge den Anweisungen im Output
```

### 3. Dependencies installieren

```bash
npm install
```

### 4. Erste Validation

```bash
npm run validate
```

### 5. Ersten Commit mit Pre-Commit Hook

```bash
git add .
git commit -m "feat: setup automation"
# → Pre-commit hook läuft automatisch!
```

### 6. Push zu GitHub

```bash
git push origin main
# → GitHub Actions läuft automatisch!
```

## Für ein bestehendes Projekt

Gleicher Prozess, aber:

1. **Backup** erstellen vor dem Ausführen
2. **Review** der generierten Dateien
3. **Merge** Konflikte manuell auflösen falls nötig

```bash
# Backup
cp -r MyProject MyProject.backup

# Init
cd MyProject
/path/to/project-templates/scripts/init-automation.sh .

# Review changes
git diff

# Anpassen falls nötig
vim .github/workflows/ci-cd.yml
vim scripts/validate-release.sh

# Commit
git add .
git commit -m "feat: add automated quality assurance"
```

## Troubleshooting

### "Husky install command is DEPRECATED"
Das ist normal für Husky v9. Die Hooks funktionieren trotzdem.

### "Validation script failed"
Normal bei erstem Setup. Fix die Fehler Step-by-Step:
```bash
./scripts/validate-release.sh
# → Lies die Fehlermeldungen
# → Fixe einen nach dem anderen
```

### "Pre-commit hook failed"
Gut! Das System funktioniert. Fix die Fehler:
```bash
# Beispiel: console.log gefunden
# → Entferne console.log
# → git add . && git commit erneut
```

## Was passiert automatisch?

### Bei jedem Commit (`git commit`)
- ✅ Pre-commit Hook prüft Code
- ❌ Blockiert bei Fehlern

### Bei jedem Push (`git push`)
- ✅ GitHub Actions läuft
- ✅ 5 Jobs: Code Quality, Builds, Platform Checks, Security
- ❌ PR kann nicht gemerged werden bei Fehlern

### Vor jedem Release (`npm run validate`)
- ✅ Komplette Validierung
- ✅ Detaillierter Report
- ✅ Next Steps Anleitung

## Nächste Schritte

1. **Lies:** `AUTOMATION_SETUP.md` (wird in dein Projekt kopiert)
2. **Lies:** `automation-templates/README.md` (Master-Docs)
3. **Siehe:** 1x1_Trainer Projekt (Referenz-Implementierung)

## One-Liner für Copy/Paste

```bash
# Neues Projekt setup
cd MeinProjekt && /Users/svenstrohkark/Documents/Programmierung/Projects/project-templates/scripts/init-automation.sh . && npm install && npm run validate
```

---

**Fragen?** Siehe `AUTOMATED_QUALITY_CHECKLIST.md` für Details.
