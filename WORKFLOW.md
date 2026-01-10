# Development Workflow

**Projekt:** Eisenhauer Matrix
**Letzte Aktualisierung:** 2025-12-29

---

## 📋 Branch-Strategie & Environments

### 1. Testing (Branch: `testing`)
- **Fokus:** Aktive Entwicklung, Feature-Testing.
- **URL:** `https://s540d.github.io/Eisenhauer/testing/`
- **Datenbank:** `eisenhauer-testing` (Isoliert)
- **Deployment:** Automatisch bei Push auf `testing`.

### 2. Staging (Branch: `staging`)
- **Fokus:** Integrations-Tests, Pre-Release.
- **URL:** `https://s540d.github.io/Eisenhauer/staging/`
- **Datenbank:** `eisenhauer-staging` (Isoliert, Spiegelt Prod-Struktur)
- **Deployment:** Automatisch bei Push auf `staging`.

### 3. Production (Branch: `main`)
- **Fokus:** Live-System für Endnutzer.
- **URL:** `https://s540d.github.io/Eisenhauer/`
- **Datenbank:** `eisenhauer-matrix` (Produktiv-Daten)
- **Deployment:** Automatisch bei Push/Merge auf `main`.

---

## 🚀 Workflow: Feature entwickeln

### 1. Feature Branch erstellen
```bash
git checkout testing
git pull origin testing
git checkout -b feature/mein-feature
```

### 2. Entwickeln & Testen
Lokal wird standardmäßig die `testing` Umgebung genutzt (siehe `.env`).
```bash
npm run dev
# Tests laufen lassen
npm test
```

### 3. Merge nach Testing
```bash
git checkout testing
git merge feature/mein-feature
git push origin testing
# -> GitHub Action deployt nach /testing/
```

### 4. Promotion zu Staging
Wenn Feature auf Testing OK:
```bash
git checkout staging
git merge testing
git push origin staging
# -> GitHub Action deployt nach /staging/
```

### 5. Release (Prod)
Wenn Staging-Tests erfolgreich:
```bash
git checkout main
git merge staging
git push origin main
# -> GitHub Action deployt nach / (Root)
```

### 4. Automatisches Deployment

**GitHub Actions übernimmt automatisch:**
1. ✅ Dependencies installieren
2. ✅ Production Build (`npm run build`)
3. ✅ Auf `gh-pages` deployen
4. ✅ Nach ~1-2 Minuten live auf https://s540d.github.io/Eisenhauer/

---

## 🐛 Hotfix-Workflow

Für dringende Fixes direkt auf `main`:

```bash
git checkout main
git pull origin main

# Fix machen
# ...

git add .
git commit -m "fix: Kritischer Bugfix"
git push origin main

# Zurück zu staging mergen
git checkout staging
git merge main --no-edit
git push origin staging
```

---

## ⚠️ Wichtige Regeln

### DO ✅
- **Immer auf `staging` entwickeln**
- **Lokal testen vor dem Merge**
- **Main nur für getesteten Code**
- **GitHub Actions machen lassen** (kein manuelles Deployment)

### DON'T ❌
- **NIEMALS direkt auf `main` pushen** (außer Hotfix)
- **NIEMALS `gh-pages` manuell bearbeiten**
- **NICHT vergessen zu testen** vor dem Merge
- **NICHT CSS-Änderungen ohne Build deployen**

---

## 🔍 Deployment überprüfen

Nach Push auf `main`:

1. **GitHub Actions Check:**
   - Gehe zu https://github.com/S540d/Eisenhauer/actions
   - Warte bis "Deploy to GitHub Pages" ✅ grün ist

2. **Live-Test:**
   - Nach 1-2 Minuten: https://s540d.github.io/Eisenhauer/
   - Hard Reload: Cmd+Shift+R (Mac) oder Strg+Shift+R (Windows)
   - Prüfe Änderungen

---

## 🛠️ Troubleshooting

### Problem: Änderungen sind nicht live

**Mögliche Ursachen:**
1. GitHub Actions läuft noch → Warte 1-2 Minuten
2. Browser-Cache → Hard Reload (Cmd+Shift+R)
3. Build-Fehler → Prüfe GitHub Actions Logs

**Lösung:**
```bash
# Prüfe GitHub Actions
# https://github.com/S540d/Eisenhauer/actions

# Bei Fehler: Logs anschauen
# Fehler fixen und erneut pushen
```

### Problem: "localforage does not resolve" Fehler

**Ursache:** Deployment enthält nicht den Vite Build

**Lösung:** GitHub Actions müssen laufen und `dist/` deployen (ist jetzt gefixt)

---

## 📚 Nützliche Commands

```bash
# Dev Server (Lokales Testen)
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview

# Tests
npm run test
npm run test:e2e

# Code Quality
npm run format
npm run lint

# Branch Status
git status
git branch -a

# GitHub Actions Status (im Browser)
# https://github.com/S540d/Eisenhauer/actions
```

---

## 🎯 Beispiel: Complete Feature Workflow

```bash
# 1. Auf staging entwickeln
git checkout staging
git pull origin staging

# 2. Feature entwickeln
# ... Code ändern ...

# 3. Lokal testen
npm run dev
# Browser: http://localhost:8000/Eisenhauer/
# ✅ Alles funktioniert

# 4. Committen
git add .
git commit -m "feat: Neue Funktion XYZ"
git push origin staging

# 5. Auf main mergen
git checkout main
git pull origin main
git merge staging --no-edit
git push origin main

# 6. Deployment beobachten
# https://github.com/S540d/Eisenhauer/actions
# Warte auf ✅

# 7. Live testen
# https://s540d.github.io/Eisenhauer/
# Hard Reload: Cmd+Shift+R
# ✅ Feature ist live!

# 8. Zurück zu staging
git checkout staging
```

---

## 🚀 Quick Reference

| Aktion | Command |
|--------|---------|
| Feature entwickeln | `git checkout staging` |
| Lokal testen | `npm run dev` |
| Nach main mergen | `git checkout main && git merge staging` |
| Deployen | `git push origin main` (Auto) |
| Status prüfen | [GitHub Actions](https://github.com/S540d/Eisenhauer/actions) |
| Live-URL | https://s540d.github.io/Eisenhauer/ |

---

**Zusammenfassung:**
- **Entwickle auf `staging`**
- **Teste lokal**
- **Merge auf `main`**
- **GitHub Actions deployen automatisch**
- **Fertig! ✅**
