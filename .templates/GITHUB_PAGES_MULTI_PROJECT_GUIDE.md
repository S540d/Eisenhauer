# Multi-Projekt GitHub Pages Guide

## 📚 Übersicht

GitHub Pages ermöglicht es, **mehrere Projekte gleichzeitig** zu hosten. Jedes Repository bekommt einen eigenen Subpath unter Ihrer GitHub Pages URL.

## 🌐 Ihre GitHub Pages URLs

Alle Ihre Projekte sind unter folgenden URLs erreichbar:

```
https://s540d.github.io/[repository-name]/
```

### Aktuelle Projekte:

1. **1x1 Trainer** (dieses Projekt)
   - Repository: `https://github.com/S540d/1x1_Trainer`
   - URL: `https://s540d.github.io/1x1_Trainer/`
   - Status: ✅ Konfiguriert & bereit

2. **Eisenhauer**
   - Repository: `https://github.com/S540d/Eisenhauer`
   - URL: `https://s540d.github.io/Eisenhauer/`
   - Status: ✅ Bereits deployed

3. **Energy Price Germany**
   - Repository: `https://github.com/S540d/Energy_Price_Germany`
   - URL: `https://s540d.github.io/Energy_Price_Germany/`
   - Status: ✅ Konfiguriert & bereit

## 🚀 Weiteres Projekt hinzufügen

Um ein weiteres Projekt (z.B. Energy Price Germany) zu deployen:

### 1. GitHub Actions Workflow hinzufügen

Erstelle `.github/workflows/deploy.yml` im Projekt:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build  # oder dein Build-Command

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build  # oder dein Output-Verzeichnis
```

### 2. GitHub Pages aktivieren

1. Gehe zu Repository Settings → Pages
2. Source: **"GitHub Actions"** auswählen
3. Fertig! Der Workflow deployt bei jedem Push automatisch

### 3. Base URL konfigurieren (falls nötig)

Für React/Vite/Create-React-App Projekte:

**package.json:**
```json
{
  "homepage": "https://s540d.github.io/[repository-name]"
}
```

**Oder für Vite (vite.config.js):**
```javascript
export default defineConfig({
  base: '/[repository-name]/',
  // ...
})
```

## 📋 Checkliste für neues Projekt

- [ ] `.github/workflows/deploy.yml` erstellt
- [ ] Base URL/Homepage konfiguriert
- [ ] Build-Command im Workflow korrekt
- [ ] Output-Verzeichnis im Workflow korrekt
- [ ] Code committed und gepusht
- [ ] GitHub Pages in Settings aktiviert (Source: GitHub Actions)
- [ ] Workflow erfolgreich durchgelaufen
- [ ] URL im Browser getestet

## 🎯 Best Practices

1. **Separate Repositories:** Jedes Projekt in eigenem Repository
2. **GitHub Actions:** Automatisches Deployment bei jedem Push
3. **Base URL:** Immer mit Repository-Namen konfigurieren
4. **Testing:** Lokal mit `npm run build` testen vor dem Push
5. **Dokumentation:** README.md mit Deployment-Anleitung

## 🔗 Nützliche Links

- [GitHub Pages Dokumentation](https://docs.github.com/en/pages)
- [GitHub Actions Dokumentation](https://docs.github.com/en/actions)
- [Peaceiris gh-pages Action](https://github.com/peaceiris/actions-gh-pages)

## 💡 Tipps

- **Unbegrenzte Projekte:** Du kannst so viele Projekte hosten wie du möchtest
- **Automatische HTTPS:** Alle Projekte sind automatisch über HTTPS erreichbar
- **Kostenlos:** GitHub Pages ist für Public Repositories kostenlos
- **Custom Domain:** Optional kann eine eigene Domain konfiguriert werden
