# Eisenhauer Matrix – Claude Memory

## Projekt-Überblick

Progressive Web App (PWA) zur Aufgabenverwaltung nach der Eisenhauer-Matrix. Zusätzlich eine Android-App als Trusted Web Activity (TWA), die die PWA einbettet.

- **PWA:** https://s540d.github.io/Eisenhauer/
- **Android-App:** `Android/` – TWA via `com.google.androidbrowserhelper`

## Branch-Strategie

```
feature-branch → testing → staging → main (production)
```

- PRs für Fixes/Features immer gegen **`testing`** anlegen
- `main` ist protected

## Android-App (TWA)

- Package: `com.sven4321.eisenhauer`
- `MainActivity` extends `LauncherActivity` (androidbrowserhelper)
- Konfiguration hauptsächlich über Metadaten in `AndroidManifest.xml`

### Farben (`colors.xml` auf `testing`/aktuellem Stand)

Alle Farben sind `#000000` um das PWA-`manifest.json`-Theme zu spiegeln:
- `statusBarColor`
- `navigationBarColor`

### Splash-Screen (Issue #241, PR #258, gemerged)

Der alte TWA-Splash-Screen (Gradient-Drawable `splash_background.xml` mit Icon in einer Box) wurde entfernt. Es werden keine TWA-seitigen Splash-Screen-Metadaten mehr gesetzt:
- `SPLASH_IMAGE_DRAWABLE` → entfernt
- `SPLASH_SCREEN_BACKGROUND_COLOR` → entfernt
- `SPLASH_SCREEN_FADE_OUT_DURATION` → entfernt

Beim App-Start wird jetzt ausschließlich der moderne PWA-Splash-Screen angezeigt.

## Bekannte Eigenheiten

- Beim Rebase von `main`-basierten Branches auf `testing` gibt es Konflikte in `AndroidManifest.xml` und `colors.xml`, weil `testing` die Farb-Struktur grundlegend überarbeitet hat (alles `#000000`, keine `colorPrimary` mehr).
