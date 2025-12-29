# Development Workflow

**Projekt:** Eisenhauer Matrix
**Letzte Aktualisierung:** 2025-12-29

---

## 📋 Branch-Strategie

### Branches

1. **`staging`** - Entwicklung & Tests
   - Für alle neuen Features und Fixes
   - Lokales Testen vor dem Merge

2. **`main`** - Production-ready Code
   - Nur getesteter, stabiler Code
   - Automatisches Deployment auf GitHub Pages

3. **`gh-pages`** - Deployed Build
   - Wird automatisch von GitHub Actions aktualisiert
   - **NIEMALS manuell bearbeiten!**

---

## 🚀 Workflow: Feature/Fix entwickeln

### 1. Auf Staging arbeiten

```bash
# Auf staging Branch wechseln
git checkout staging
git pull origin staging

# Änderungen machen (Code, CSS, etc.)
# ...

# Lokal testen
npm run dev  # http://localhost:8000/Eisenhauer/

# Committen
git add .
git commit -m "feat: Beschreibung der Änderung"
git push origin staging
```

### 2. Lokal testen

```bash
# Dev Server starten
npm run dev

# In Browser testen:
# http://localhost:8000/Eisenhauer/

# Production Build testen (optional)
npm run build
npm run preview
```

### 3. Nach Main mergen

```bash
# Auf main wechseln
git checkout main
git pull origin main

# Staging in main mergen
git merge staging --no-edit

# Auf main pushen
git push origin main
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
