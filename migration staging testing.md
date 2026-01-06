# Migration: staging → testing (Separate Testing-Umgebung)

**Ziel:** Vollständige Trennung von Production und Testing für TWA/PWA mit produktiven Nutzern

**Status:** Aktuell existieren beide Branches (`staging` + `testing`), aber nur staging funktioniert via `?env=staging`

**Ziel-Architektur:**

```
main    → https://s540d.github.io/Eisenhauer/          (Production - TWA/PWA)
testing → https://s540d.github.io/Eisenhauer-testing/  (Testing - separate URL)
```

-----

## Phase 1: Vorbereitung & Analyse

### 1.1 Prüfe aktuelle Workflows

```bash
# Zeige alle GitHub Actions Workflows
ls -la .github/workflows/

# Zeige Inhalt des Testing-Workflows
cat .github/workflows/deploy-testing.yml  # oder ähnlicher Name
```

**Aufgabe für Claude Code:**

- Liste alle Workflow-Dateien auf
- Identifiziere welcher Workflow für `staging` und welcher für `testing` zuständig ist
- Zeige mir die Inhalte beider Workflows

### 1.2 Prüfe Firebase-Konfiguration

```bash
# Prüfe aktuelle Firebase-Configs
cat firebase-config.js
cat .env.example
```

**Fragen zu beantworten:**

- Gibt es bereits separate Firebase-Projekte für Production und Testing?
- Wie wird aktuell zwischen Environments unterschieden? (über `isStaging()` in config.js?)

### 1.3 Prüfe TWA-Konfiguration

```bash
# Zeige Android TWA Config
cat Android/app/src/main/AndroidManifest.xml
cat Android/app/build.gradle
cat Android/app/src/main/res/values/strings.xml
```

**Zu prüfen:**

- Welche URL ist in der TWA konfiguriert?
- Sind Digital Asset Links auf Production oder Staging?

-----

## Phase 2: Separates Testing-Repo erstellen

### 2.1 Erstelle neues GitHub Repository

**Manuelle Aktion (auf GitHub.com):**

1. Gehe zu: https://github.com/new
1. Repository Name: `Eisenhauer-testing`
1. Visibility: Public (oder Private, wenn gewünscht)
1. **NICHT** initialisieren mit README/License (wird später deployed)
1. Create Repository

### 2.2 Aktiviere GitHub Pages für Testing-Repo

**Manuelle Aktion (auf GitHub.com):**

1. Gehe zu: `https://github.com/S540d/Eisenhauer-testing/settings/pages`
1. Source: “Deploy from a branch”
1. Branch: `main` (wird später durch Workflow erstellt)
1. Folder: `/ (root)`
1. Save

-----

## Phase 3: GitHub Actions Workflow anpassen

### 3.1 Erstelle neuen Deployment-Workflow für Testing

**Aufgabe für Claude Code:**

Erstelle `.github/workflows/deploy-testing.yml` mit folgendem Inhalt:

```yaml
name: Deploy to Testing Environment

on:
  push:
    branches:
      - testing
  workflow_dispatch:

permissions:
  contents: write

jobs:
  deploy-testing:
    runs-on: ubuntu-latest
    environment:
      name: testing
      url: https://s540d.github.io/Eisenhauer-testing/
    
    steps:
      - name: Checkout testing branch
        uses: actions/checkout@v4
        with:
          ref: testing
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build for testing
        run: npm run build:staging  # oder build:testing, je nach package.json
        env:
          NODE_ENV: staging  # oder testing
      
      - name: Deploy to Eisenhauer-testing repo
        uses: peaceiris/actions-gh-pages@v3
        with:
          personal_token: ${{ secrets.TESTING_DEPLOY_TOKEN }}
          external_repository: S540d/Eisenhauer-testing
          publish_branch: main
          publish_dir: ./dist
          force_orphan: true
```

**Hinweise:**

- Passe `build:staging` an den korrekten npm Script an (aus package.json)
- Token `TESTING_DEPLOY_TOKEN` muss noch erstellt werden (siehe Phase 4)

### 3.2 Lösche alten Staging-Workflow

**Aufgabe für Claude Code:**

```bash
# Finde und zeige Staging-Workflow
find .github/workflows -name "*staging*"

# Lösche nach Bestätigung
# git rm .github/workflows/deploy-staging.yml  # Beispiel
```

-----

## Phase 4: GitHub Token für Cross-Repo Deployment

### 4.1 Erstelle Personal Access Token (PAT)

**Manuelle Aktion (auf GitHub.com):**

1. Gehe zu: https://github.com/settings/tokens/new
1. Note: `Eisenhauer Testing Deployment`
1. Expiration: `No expiration` (oder 1 Jahr)
1. Scopes auswählen:
- ✅ `repo` (Full control of private repositories)
- ✅ `workflow` (Update GitHub Action workflows)
1. Generate token
1. **WICHTIG:** Kopiere den Token sofort (wird nur einmal angezeigt)

### 4.2 Token als Secret hinzufügen

**Manuelle Aktion (auf GitHub.com):**

1. Gehe zu: `https://github.com/S540d/Eisenhauer/settings/secrets/actions`
1. “New repository secret”
1. Name: `TESTING_DEPLOY_TOKEN`
1. Value: [eingefügter PAT von 4.1]
1. Add secret

-----

## Phase 5: Firebase Testing-Projekt einrichten

### 5.1 Erstelle separates Firebase-Projekt (falls noch nicht vorhanden)

**Manuelle Aktion (auf Firebase Console):**

1. Gehe zu: https://console.firebase.google.com/
1. “Add project” oder wähle bestehendes Testing-Projekt
1. Projekt-Name: `Eisenhauer Testing` (oder ähnlich)
1. Aktiviere:
- ✅ Authentication (Google Sign-In)
- ✅ Firestore Database
- ✅ Same Security Rules wie Production

### 5.2 Hole Firebase Testing Config

**Manuelle Aktion (auf Firebase Console):**

1. Project Settings → General
1. Your apps → Web app → Config
1. Kopiere die Config (apiKey, authDomain, etc.)

### 5.3 Erstelle separate Firebase-Config für Testing

**Aufgabe für Claude Code:**

Erstelle `firebase-config.testing.js`:

```javascript
// firebase-config.testing.js
// Testing Environment Firebase Configuration

export const firebaseConfig = {
  apiKey: "TESTING_API_KEY",  // Von Firebase Console
  authDomain: "eisenhauer-testing.firebaseapp.com",
  projectId: "eisenhauer-testing",
  storageBucket: "eisenhauer-testing.appspot.com",
  messagingSenderId: "TESTING_SENDER_ID",
  appId: "TESTING_APP_ID"
};
```

**Hinweis:** Diese Datei sollte NICHT in `.gitignore`, da Testing-Credentials public sein können.

### 5.4 Update Build-System für Environment-spezifische Configs

**Aufgabe für Claude Code:**

Prüfe `vite.config.js` oder `build-config.js`:

- Wie wird aktuell die Firebase-Config geladen?
- Gibt es Environment-Detection?
- Muss das Build-System angepasst werden, um `firebase-config.testing.js` für Testing-Builds zu nutzen?

**Zeige mir die relevanten Config-Dateien:**

```bash
cat vite.config.js
cat build-config.js
cat config.js
```

-----

## Phase 6: Environment-Detection entfernen

### 6.1 Entferne `?env=staging` Query-Parameter-Logik

**Aufgabe für Claude Code:**

Finde und entferne alle Stellen, die `?env=staging` auswerten:

```bash
# Suche nach Environment-Detection
grep -r "env=staging" .
grep -r "isStaging" .
grep -r "getEnvironment" .
```

**Zu entfernen/anpassen:**

- `config.js` → `isStaging()` Funktion
- Alle Stellen, die `window.location.search` für Environment-Check nutzen
- Banner/UI-Elemente, die “STAGING” anzeigen

**Neue Logik:**

- `main` Branch = Production (immer)
- `testing` Branch = Testing (deployed zu separate URL)
- Keine Runtime-Detection mehr nötig!

### 6.2 Update manifest.json

**Aufgabe für Claude Code:**

Prüfe `manifest.json`:

```bash
cat manifest.json
```

**Sicherstellen:**

- `start_url` zeigt IMMER auf Production: `"start_url": "/Eisenhauer/"`
- Keine Environment-spezifische Logik

-----

## Phase 7: TWA/PWA URLs verifizieren

### 7.1 Android TWA (Trusted Web Activity)

**Aufgabe für Claude Code:**

Prüfe und korrigiere TWA-Konfiguration:

```bash
# AndroidManifest.xml
cat Android/app/src/main/AndroidManifest.xml

# build.gradle
cat Android/app/build.gradle

# strings.xml
cat Android/app/src/main/res/values/strings.xml
```

**Sicherstellen:**

- TWA zeigt auf: `https://s540d.github.io/Eisenhauer/` (Production)
- Digital Asset Links sind für Production-URL konfiguriert
- Keine Referenzen zu `?env=staging`

### 7.2 iOS PWA

**Aufgabe für Claude Code:**

Prüfe iOS-Meta-Tags in `index.html`:

```bash
grep -A 5 "apple-mobile-web-app" index.html
```

**Sicherstellen:**

- Meta-Tags zeigen auf Production
- Keine Environment-spezifische Logik

-----

## Phase 8: Dokumentation aktualisieren

### 8.1 Update README.md

**Aufgabe für Claude Code:**

Ersetze im `README.md`:

**Alt (löschen):**

```markdown
| Branch | URL | Zweck |
| --- | --- | --- |
| `main` | https://s540d.github.io/Eisenhauer/ | Production (stabil) |
| `staging` | https://s540d.github.io/Eisenhauer/?env=staging | Testing (vor Release) |
```

**Neu:**

```markdown
| Branch | URL | Zweck |
| --- | --- | --- |
| `main` | https://s540d.github.io/Eisenhauer/ | Production (TWA/PWA) |
| `testing` | https://s540d.github.io/Eisenhauer-testing/ | Testing (separate URL) |
```

Lösche außerdem:

- Sektion “Environment Detection”
- Referenzen zu `?env=staging`
- “Staging URL” Erwähnungen

Behalte:

- Sektion “Testing Workflow (Issue #74)” (aktualisieren)

### 8.2 Update WORKFLOW.md

**Aufgabe für Claude Code:**

Erstelle/Update `WORKFLOW.md` mit finaler Policy:

```markdown
# Development Workflow

## Branch Strategy

- **main** → Production (https://s540d.github.io/Eisenhauer/)
  - Deployed via GitHub Actions on push
  - Used by TWA (Android) and PWA (iOS)
  - Real user data (Production Firebase)

- **testing** → Testing (https://s540d.github.io/Eisenhauer-testing/)
  - Deployed to separate repo via GitHub Actions
  - Separate Firebase project (Testing data)
  - For development testing before production

## Development Process

1. Create feature branch: `git checkout -b feature/my-feature`
2. Develop locally and test
3. Merge to `testing`: `git checkout testing && git merge feature/my-feature`
4. Push to trigger testing deployment: `git push origin testing`
5. Test on: https://s540d.github.io/Eisenhauer-testing/
6. If tests pass: Merge to `main` for production deployment

## Firebase Projects

- **Production:** eisenhauer-prod (or similar)
- **Testing:** eisenhauer-testing

## Important Rules

- ❌ Never merge untested code directly to `main`
- ❌ Never use `?env=staging` (removed)
- ✅ Always test on `testing` branch first
- ✅ TWA/PWA always point to production URL
```

### 8.3 Update CHANGELOG.md

**Aufgabe für Claude Code:**

Füge Eintrag zu `CHANGELOG.md` hinzu:

```markdown
## [Unreleased]

### Changed
- **BREAKING:** Migrated from `staging` branch to `testing` branch
- Testing environment now uses separate URL: https://s540d.github.io/Eisenhauer-testing/
- Removed `?env=staging` query parameter logic
- Simplified environment detection (no runtime checks needed)

### Removed
- `staging` branch (replaced by `testing`)
- Environment detection code in `config.js`
- `?env=staging` URL parameter support

### Added
- Separate Firebase project for testing
- Cross-repository deployment via GitHub Actions
- Clearer separation between production and testing environments
```

-----

## Phase 9: Testing & Validation

### 9.1 Teste Testing-Deployment

**Aufgabe für Claude Code:**

```bash
# Wechsle zu testing Branch
git checkout testing

# Trigger Workflow (Push)
git commit --allow-empty -m "test: Trigger testing deployment"
git push origin testing
```

**Manuelle Validierung:**

1. Gehe zu: https://github.com/S540d/Eisenhauer/actions
1. Prüfe ob “Deploy to Testing Environment” erfolgreich läuft
1. Öffne: https://s540d.github.io/Eisenhauer-testing/
1. Teste grundlegende Funktionen (Login, Tasks erstellen)

### 9.2 Verifiziere Production unverändert

**Manuelle Validierung:**

1. Öffne: https://s540d.github.io/Eisenhauer/
1. Stelle sicher, dass Production-App normal funktioniert
1. TWA/PWA zeigen weiterhin auf Production

### 9.3 Teste Firebase-Trennung

**Manuelle Validierung:**

1. Erstelle Task auf Testing-URL
1. Login auf Production-URL
1. Verifiziere: Task ist NICHT auf Production sichtbar (separate DBs)

-----

## Phase 10: Cleanup & Finalisierung

### 10.1 Lösche staging Branch

**WICHTIG:** Erst nach erfolgreicher Validierung von Phase 9!

```bash
# Lokal löschen
git branch -D staging

# Remote löschen
git push origin --delete staging
```

### 10.2 Schließe Issue #74

**Manuelle Aktion (auf GitHub.com):**

1. Gehe zu: https://github.com/S540d/Eisenhauer/issues/74
1. Kommentiere: “Implemented: Testing environment now deployed to separate URL (Eisenhauer-testing)”
1. Close issue

### 10.3 Erstelle neues Issue für Dokumentation

**Manuelle Aktion (auf GitHub.com):**

Titel: “Update all documentation to reflect testing → main workflow”

Body:

```markdown
After migration from staging to testing, ensure all docs are updated:

- [x] README.md
- [x] WORKFLOW.md
- [x] CHANGELOG.md
- [ ] INSTALL.md (if contains staging references)
- [ ] FIREBASE-SETUP.md (if contains staging references)
- [ ] Any other docs with environment references

Also verify:
- [ ] No broken links in documentation
- [ ] All screenshots/examples show correct URLs
```

-----

## Rollback-Plan (falls etwas schief geht)

### Wenn Testing-Deployment fehlschlägt:

```bash
# Kehre zu staging zurück
git checkout staging

# Stelle alten Workflow wieder her
git checkout main -- .github/workflows/deploy-staging.yml

# Push
git push origin staging
```

### Wenn Production betroffen ist:

```bash
# Revert letzten Commit auf main
git checkout main
git revert HEAD
git push origin main
```

-----

## Checkliste für Claude Code

**Phase 1: Analyse**

- [ ] Liste alle GitHub Workflows auf
- [ ] Zeige Firebase-Config
- [ ] Zeige TWA-Config

**Phase 3: Workflows**

- [ ] Erstelle `.github/workflows/deploy-testing.yml`
- [ ] Lösche alten Staging-Workflow

**Phase 5: Firebase**

- [ ] Erstelle `firebase-config.testing.js`
- [ ] Prüfe Build-System (vite.config.js, etc.)

**Phase 6: Environment-Detection**

- [ ] Suche und entferne alle `isStaging()` Aufrufe
- [ ] Prüfe manifest.json

**Phase 7: TWA/PWA**

- [ ] Prüfe Android TWA-Konfiguration
- [ ] Prüfe iOS PWA Meta-Tags

**Phase 8: Dokumentation**

- [ ] Update README.md
- [ ] Update/Erstelle WORKFLOW.md
- [ ] Update CHANGELOG.md

**Phase 9: Testing**

- [ ] Push zu testing Branch
- [ ] Validiere Deployment

**Phase 10: Cleanup**

- [ ] Lösche staging Branch (nach Validation!)

-----

## Nächste Schritte

1. **Speichere dieses Dokument** im Projekt-Root als `MIGRATION_STAGING_TO_TESTING.md`
1. **Gib es an Claude Code in VS Code** mit: “Führe MIGRATION_STAGING_TO_TESTING.md aus, Phase für Phase”
1. **Manuell:** GitHub Repo erstellen, PAT erstellen, Firebase Testing-Projekt einrichten
1. **Claude Code:** Alles andere automatisieren

-----

**Geschätzte Dauer:** 2-3 Stunden (mit manuellem Setup)

**Risiko:** Niedrig (Rollback-Plan vorhanden, Production nicht betroffen)

**Benefit:** Saubere Trennung, kein Durcheinander mehr, sichere Testing-Umgebung