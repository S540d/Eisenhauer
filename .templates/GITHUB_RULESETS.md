# GitHub Branch Protection Rulesets

Einheitliche Branch Protection Rules für alle Projekte.

## Verfügbare Rulesets

### 1. `github-ruleset-protect-main-react-native.json`
Für React Native Projekte (1x1_Trainer, EnergyPriceGermany, Pflanzkalender, DrawFromMemory)

**Required Status Checks:**
- `code-quality` - Code Quality & Linting
- `build-web` - Web Build

### 2. `github-ruleset-protect-main-web.json`
Für Web/PWA Projekte (Eisenhauer)

**Required Status Checks:**
- `code-quality` - Code Quality & Linting
- `build-web` - Web Build

## Was die Rulesets schützen

### ✅ Aktivierte Regeln:

1. **Pull Request Rule** (optional)
   - `required_approving_review_count: 0` - Keine Review erforderlich (für Solo-Development)
   - Kann auf `1` gesetzt werden, wenn du Reviews möchtest

2. **Required Status Checks**
   - CI/CD Workflows müssen erfolgreich sein
   - Code-Quality Checks müssen passieren
   - Build muss erfolgreich sein
   - `strict_required_status_checks_policy: false` - Branch muss nicht aktuell sein

3. **Non-Fast-Forward**
   - ⛔ Verhindert Force Pushes (`git push --force`)
   - Schützt vor versehentlichem Überschreiben der Historie

4. **Bypass Actors**
   - Repository Admins können Rules bypassen
   - Nützlich für Hotfixes und Maintenance

## Installation

### Option 1: Via GitHub CLI (Empfohlen)

```bash
# Für React Native Projekt
cd /path/to/projekt
gh api repos/S540d/PROJEKT_NAME/rulesets \
  --method POST \
  --input /path/to/project-templates/github-ruleset-protect-main-react-native.json

# Für Web Projekt
gh api repos/S540d/Eisenhauer/rulesets \
  --method POST \
  --input /path/to/project-templates/github-ruleset-protect-main-web.json
```

### Option 2: Via GitHub Web UI

1. Gehe zu **Settings** → **Rules** → **Rulesets**
2. Klicke **New ruleset** → **New branch ruleset**
3. Kopiere die Werte aus der JSON-Datei:
   - Name: `protect-main`
   - Target branches: `main`
   - Rules:
     - ☑️ Require a pull request before merging (optional: 0 approvals)
     - ☑️ Require status checks to pass
       - Add checks: `code-quality`, `build-web`
     - ☑️ Block force pushes
   - Bypass list: Repository administrators

## Anpassungen

### Wenn du Reviews verlangen möchtest:

Ändere in der JSON:
```json
"required_approving_review_count": 1
```

### Wenn du Android Builds auch prüfen möchtest:

Füge zu `required_status_checks` hinzu:
```json
{
  "context": "build-android"
}
```

### Wenn du auch den `develop` Branch schützen möchtest:

Kopiere das Ruleset und ändere:
```json
"conditions": {
  "ref_name": {
    "include": [
      "refs/heads/main",
      "refs/heads/develop"
    ]
  }
}
```

## Status Checks Namen

Diese Namen müssen mit den Job-Namen in [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml) übereinstimmen:

| Job Name in Workflow | Status Check Context |
|---------------------|---------------------|
| `code-quality` | `code-quality` |
| `build-web` | `build-web` |
| `build-android` | `build-android` |
| `platform-checks` | `platform-checks` |
| `version-checks` | `version-checks` |
| `security` | `security` |

## Troubleshooting

### "Required status check has not been run"

**Problem**: Du hast einen Status Check in den Rules, aber der Workflow läuft nicht.

**Lösung**:
1. Pushe einen Commit, um den Workflow zu triggern
2. Oder entferne temporär den Status Check aus dem Ruleset
3. Stelle sicher, dass der Job-Name im Workflow mit dem Context übereinstimmt

### "Cannot push to protected branch"

**Problem**: Force Push wird blockiert.

**Lösung**:
```bash
# Nutze reguläres Push statt Force Push
git pull --rebase origin main
git push origin main
```

### Bypass für Admins funktioniert nicht

**Problem**: Du bist Admin, kannst aber trotzdem nicht pushen.

**Lösung**:
1. GitHub UI: Klicke "Merge without waiting for requirements"
2. CLI: Pushe von einem Branch und merge via PR

## Best Practices

1. **Status Checks**: Nur kritische Checks als required markieren
2. **Reviews**: Für Solo-Projects `0`, für Teams `1+`
3. **Bypass**: Nur für Admins aktivieren
4. **Testing**: Teste das Ruleset mit einem Feature Branch
5. **Updates**: Halte die Required Checks synchron mit deinen Workflows

## Automatisierung

Erstelle ein Setup-Script für neue Projekte:

```bash
#!/bin/bash
# scripts/setup-branch-protection.sh

PROJECT_NAME=$1
PROJECT_TYPE=$2  # "react-native" oder "web"

if [ "$PROJECT_TYPE" = "react-native" ]; then
  RULESET_FILE="github-ruleset-protect-main-react-native.json"
else
  RULESET_FILE="github-ruleset-protect-main-web.json"
fi

gh api repos/S540d/$PROJECT_NAME/rulesets \
  --method POST \
  --input $(dirname "$0")/../$RULESET_FILE

echo "✅ Branch protection rules set up for $PROJECT_NAME"
```

Verwendung:
```bash
./scripts/setup-branch-protection.sh 1x1_Trainer react-native
./scripts/setup-branch-protection.sh Eisenhauer web
```

## Weitere Ressourcen

- [GitHub Rulesets Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [Status Checks Documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)
- [Automation Documentation](AUTOMATION_SUMMARY.md)
