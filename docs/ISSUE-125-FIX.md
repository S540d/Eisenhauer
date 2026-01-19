# Issue #125 Fix - Firebase Environment Data Leak

## Problem
Tasks in Staging wurden auch in Main sichtbar, obwohl separate Firebase-Instanzen konfiguriert waren.

## Root Cause Analysis

### Erwartetes Verhalten
```
https://s540d.github.io/Eisenhauer/          → Production (Firebase: eisenhauer-matrix)
https://s540d.github.io/Eisenhauer/staging/  → Staging (Firebase: eisenhauer-staging)
https://s540d.github.io/Eisenhauer/testing/  → Testing (Firebase: eisenhauer-testing)
```

### Tatsächliches Verhalten
- Main-Deployment überschrieb die `staging/` und `testing/` Verzeichnisse
- Alle Environments nutzten dieselben Dateien (und damit dieselbe Firebase-Config)
- Daten wurden zwischen Environments gemischt

### Technische Ursache

**Problem 1: `keep_files: false` im Main-Deployment**
```yaml
# .github/workflows/deploy.yml (VORHER)
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    publish_dir: ./dist
    publish_branch: gh-pages
    keep_files: false  # ❌ Löscht ALLE Dateien, inkl. staging/ und testing/
```

Beim Main-Deployment wurden **alle** Dateien auf dem `gh-pages` Branch gelöscht, einschließlich der `staging/` und `testing/` Verzeichnisse.

**Problem 2: Fehlende Force-Orphan Protection**
- Staging und Testing Deployments hatten kein `force_orphan: false`
- Dies führte zu inkonsistenten Git-Historien

## Lösung

### 1. Main-Deployment: Preserve Subdirectories
```yaml
# .github/workflows/deploy.yml (NACHHER)
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    publish_dir: ./dist
    publish_branch: gh-pages
    keep_files: true  # ✅ Behält staging/ und testing/
    exclude_assets: '.github,staging,testing'  # ✅ Überschreibt diese nicht
```

### 2. Staging/Testing: Prevent Orphan Branches
```yaml
# .github/workflows/deploy-staging.yml
- name: Deploy to Staging Subdirectory
  uses: peaceiris/actions-gh-pages@v3
  with:
    destination_dir: staging
    keep_files: true
    force_orphan: false  # ✅ Verhindert Orphan-Branch-Probleme
```

## Deployment-Strategie

### gh-pages Branch Struktur (Nach Fix)
```
gh-pages/
├── index.html          (Production Build)
├── assets/             (Production Assets)
├── staging/
│   ├── index.html      (Staging Build)
│   └── assets/         (Staging Assets mit eisenhauer-staging Firebase)
└── testing/
    ├── index.html      (Testing Build)
    └── assets/         (Testing Assets mit eisenhauer-testing Firebase)
```

### Environment-Trennung

Jedes Environment hat seine eigene Firebase-Konfiguration zur **Build-Zeit**:

1. **Production** (`npm run build`)
   - Lädt `.env.production`
   - Firebase Project: `eisenhauer-matrix`
   - URL: `https://s540d.github.io/Eisenhauer/`

2. **Staging** (`npm run build:staging`)
   - Lädt `.env.staging`
   - Firebase Project: `eisenhauer-staging`
   - URL: `https://s540d.github.io/Eisenhauer/staging/`

3. **Testing** (`npm run build:testing`)
   - Lädt `.env.testing`
   - Firebase Project: `eisenhauer-testing`
   - URL: `https://s540d.github.io/Eisenhauer/testing/`

## Validation

### Nach dem Fix sollte gelten:

```bash
# 1. Staging-Daten gehen zu eisenhauer-staging
curl https://s540d.github.io/Eisenhauer/staging/ | grep "VITE_FIREBASE_PROJECT_ID"
# → Sollte eisenhauer-staging enthalten

# 2. Production-Daten gehen zu eisenhauer-matrix
curl https://s540d.github.io/Eisenhauer/ | grep "VITE_FIREBASE_PROJECT_ID"
# → Sollte eisenhauer-matrix enthalten

# 3. Testing-Daten gehen zu eisenhauer-testing
curl https://s540d.github.io/Eisenhauer/testing/ | grep "VITE_FIREBASE_PROJECT_ID"
# → Sollte eisenhauer-testing enthalten
```

### Firebase Console Verification
1. Öffne Firebase Console für `eisenhauer-staging`
2. Gehe zu Firestore Database
3. Prüfe dass nur Staging-Tasks vorhanden sind
4. Wiederhole für `eisenhauer-matrix` (Production)

## Migration Path

### Schritt 1: Fix Deployen
```bash
git checkout -b fix/issue-125-environment-isolation
# Commits wurden bereits erstellt
git push origin fix/issue-125-environment-isolation
```

### Schritt 2: Clean Deployment
Nach dem Merge müssen alle Branches neu deployed werden:

```bash
# 1. Main neu deployen
git checkout main
git push origin main --force-with-lease

# 2. Staging neu deployen
git checkout staging
git push origin staging --force-with-lease

# 3. Testing neu deployen
git checkout testing
git push origin testing --force-with-lease
```

### Schritt 3: Verify Separation
- Teste Login in jedem Environment
- Erstelle Test-Task in Staging
- Prüfe dass Task NICHT in Production erscheint

## Lessons Learned

1. **`keep_files: false` ist gefährlich** in Multi-Environment-Setups
2. **Subdirectory-Deployments** benötigen explizite Schutzmaßnahmen
3. **Build-Zeit vs Runtime**: Firebase-Config wird zur Build-Zeit eingebettet
4. **Testing ist kritisch**: Wir hätten das früher durch E2E-Tests erkennen müssen

## Related Issues
- Issue #122: Infrastructure Audit (wird dies aufdecken)
- Issue #121: Android TWA Build Flavors (ähnliches Problem)

## Files Changed
- `.github/workflows/deploy.yml`
- `.github/workflows/deploy-staging.yml`
- `.github/workflows/deploy-testing.yml`

## Author
Claude Code & @S540d

## Date
2026-01-19
