# Google Play Store Veröffentlichungs-Checkliste: Eisenhauer Matrix

Speziell für das Eisenhauer Matrix Projekt basierend auf [project-templates/GOOGLE_PLAY_STORE_ROADMAP.md](https://github.com/S540d/project-templates/blob/main/GOOGLE_PLAY_STORE_ROADMAP.md).

---

## 📅 Timeline: 6 Wochen bis Launch

**Aktueller Status:** ✅ TWA-Projekt erstellt, bereit für Phase 1

---

## 🎯 Phase 1: TWA/Android Setup (Wochen 1-2)

### ✅ TWA-Projekt erstellt
- [x] Android Studio Projekt-Struktur
- [x] MainActivity.java (TWA Activity)
- [x] AndroidManifest.xml konfiguriert
- [x] Gradle Build-Dateien erstellt
- [x] Package Name: `com.sven4321.eisenhauer`

### 🔲 PWA Validierung
- [ ] Service Worker funktioniert (`service-worker.js` prüfen)
- [ ] `manifest.json` vorhanden und korrekt
- [ ] HTTPS überall (GitHub Pages)
- [ ] Icons alle Größen verfügbar (72x72 bis 512x512)

**Command:**
```bash
# PWA auf GitHub Pages testen
open https://s540d.github.io/Eisenhauer/

# Lighthouse PWA Audit
npx lighthouse https://s540d.github.io/Eisenhauer/ --view
```

### 🔲 Signing Certificate Setup
- [ ] Keystore generieren (`eisenhauer-release.keystore`)
- [ ] SHA-256 Fingerprint extrahieren
- [ ] Keystore sicher speichern (NICHT in Git!)
- [ ] Signing Config in `gradle.properties` eintragen

**Commands:**
```bash
cd Android

# 1. Keystore erstellen
mkdir -p keystore
keytool -genkey -v -keystore keystore/eisenhauer-release.keystore \
  -alias eisenhauer-release \
  -keyalg RSA -keysize 2048 -validity 10000

# 2. SHA-256 Fingerprint
keytool -list -v -keystore keystore/eisenhauer-release.keystore \
  -alias eisenhauer-release | grep "SHA256:"

# 3. Backup erstellen!
cp keystore/eisenhauer-release.keystore ~/Backups/
```

### 🔲 Digital Asset Links (assetlinks.json) Setup
- [ ] `.well-known/assetlinks.json` mit SHA-256 Fingerprint aktualisieren
- [ ] Auf GitHub Pages deployen
- [ ] URL erreichbar: `https://s540d.github.io/Eisenhauer/.well-known/assetlinks.json`
- [ ] Digital Asset Links verifizieren

**Commands:**
```bash
# 1. assetlinks.json mit Fingerprint aktualisieren
# (siehe Android/README.md Schritt 2.1)

# 2. Deployen
cd ..  # Zurück ins Hauptverzeichnis
git add .well-known/assetlinks.json
git commit -m "Add Digital Asset Links for Android TWA"
git push origin main

# 3. Testen (nach 1-2 Min warten)
curl https://s540d.github.io/Eisenhauer/.well-known/assetlinks.json

# 4. Google Verification Tool
open "https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://s540d.github.io&relation=delegate_permission/common.handle_all_urls"
```

### 🔲 Icons für Android vorbereiten
- [ ] Icons aus PWA konvertieren (48x48 bis 192x192)
- [ ] In `res/mipmap-*` Verzeichnisse kopieren
- [ ] Optional: Adaptive Icons erstellen

**Commands:**
```bash
cd Android

# Icons aus PWA kopieren
cp ../icons/icon-72x72.png app/src/main/res/mipmap-hdpi/ic_launcher.png
cp ../icons/icon-96x96.png app/src/main/res/mipmap-xhdpi/ic_launcher.png
cp ../icons/icon-144x144.png app/src/main/res/mipmap-xxhdpi/ic_launcher.png
cp ../icons/icon-192x192.png app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

# Für mdpi (48x48) Icon skalieren mit ImageMagick oder Online Tool
```

### 🔲 Erste Builds
- [ ] Debug Build erfolgreich: `./gradlew assembleDebug`
- [ ] Release Build erfolgreich: `./gradlew assembleRelease`
- [ ] AAB Build erfolgreich: `./gradlew bundleRelease`

**Commands:**
```bash
cd Android

# 1. Gradle Wrapper vorbereiten
./gradlew --version

# 2. Debug Build
./gradlew clean assembleDebug
# Output: app/build/outputs/apk/debug/app-debug.apk

# 3. Release Build (nach Signing Config)
./gradlew clean assembleRelease
# Output: app/build/outputs/apk/release/app-release.apk

# 4. AAB für Play Store
./gradlew clean bundleRelease
# Output: app/build/outputs/bundle/release/app-release.aab
```

### 🔲 Lokales Testing
- [ ] Debug APK auf Gerät installiert
- [ ] TWA Full-Screen funktioniert (keine URL-Bar!)
- [ ] Alle PWA-Features funktionieren
- [ ] Offline-Modus funktioniert
- [ ] Digital Asset Links verifiziert (kein Browser UI)

**Commands:**
```bash
# App installieren
adb install app/build/outputs/apk/debug/app-debug.apk

# Logs prüfen
adb logcat | grep -i "twa\|customtabs"

# Digital Asset Links Debug
adb shell dumpsys package d | grep -A 10 "s540d.github.io"
```

---

## 🎯 Phase 2: Store Listing (Wochen 3-4)

### 🔲 Google Play Console Setup
- [ ] Google Developer Account aktiv ($25 einmalig)
- [ ] Neue App erstellt: "Eisenhauer Matrix"
- [ ] Default Language: Deutsch (Deutschland)
- [ ] App Type: App, Free

**URL:** https://play.google.com/console/

### 🔲 Screenshots erstellen (min. 2, max. 8)
- [ ] Mindestens 2 Screenshots (1080x1920px Portrait)
- [ ] Screenshot 1: Hauptansicht mit allen 5 Segmenten
- [ ] Screenshot 2: Task erstellen / Wiederkehrende Aufgaben
- [ ] Screenshot 3: Drag & Drop Demonstration
- [ ] Screenshot 4: Dark Mode
- [ ] Optional: Landscape Screenshots (1920x1080px)

**Tools:**
- Android Emulator (Android Studio)
- ADB: `adb exec-out screencap -p > screenshot.png`
- Figma/Canva für Frame-Overlays

### 🔲 Feature Graphic (1024x500px)
- [ ] Banner mit App-Logo und Slogan
- [ ] PNG oder JPEG
- [ ] Professional Design

**Tools:**
- Canva, Figma, Adobe Express

### 🔲 App Icon (512x512px)
- [ ] 512x512px PNG (32-bit)
- [ ] Kein transparenter Saum
- [ ] Aus PWA Icon generieren

**Command:**
```bash
# Icon aus PWA kopieren
cp icons/icon-512x512.png Android/play-store-assets/icon-512x512.png
```

### 🔲 Store Listing Text

Alle Texte (App Name, Short/Full Description) sowie Kategorie & Tags, Content Rating, Privacy Policy, Data Safety und Contact & Support sind zentral gepflegt in:

**→ [docs/PLAYSTORE_LISTING.md](../docs/PLAYSTORE_LISTING.md)**

- [ ] App Name übernommen
- [ ] Short Description übernommen
- [ ] Full Description übernommen
- [ ] Kategorie & Tags übernommen
- [ ] Content Rating Questionnaire ausgefüllt
- [ ] Privacy-Policy-URL in Play Console verlinkt
- [ ] Data Safety Form ausgefüllt
- [ ] Contact & Support hinterlegt

---

## 🎯 Phase 3: Testing & Launch (Wochen 5-6)

### 🔲 Pre-Launch Testing
- [ ] AAB hochgeladen in Play Console
- [ ] Pre-Launch Report von Google geprüft
- [ ] Keine kritischen Fehler oder Crashes
- [ ] Performance OK (App-Größe < 50MB)

### 🔲 Internal Testing (Optional)
- [ ] Internal Testing Track erstellt
- [ ] Test-User eingeladen (Familie, Freunde)
- [ ] Feedback gesammelt
- [ ] Bugs behoben

### 🔲 Release Notes
Vorlage siehe [docs/PLAYSTORE_LISTING.md](../docs/PLAYSTORE_LISTING.md#release-notes-vorlage-für-versions-updates).

### 🔲 Rollout Strategie
- [ ] **Option 1:** 100% Direct Launch (empfohlen für erste Version)
- [ ] **Option 2:** Staged Rollout (10% → 50% → 100%)

### 🔲 Launch!
- [ ] Alle Checklisten abgehakt
- [ ] "Start Rollout to Production" geklickt
- [ ] Google Review abwarten (1-7 Tage, meist 1-2 Tage)

---

## 📊 Post-Launch Monitoring (Erste Woche)

### 🔲 Erste 24 Stunden
- [ ] Crash Reports prüfen (täglich)
- [ ] User Ratings beobachten
- [ ] Install Count anschauen
- [ ] Reviews lesen und antworten

### 🔲 Erste Woche
- [ ] Analytics überprüfen (Firebase oder Play Console)
- [ ] Performance Metriken (ANRs, Crashes)
- [ ] User Feedback sammeln
- [ ] Bug Fixes vorbereiten (falls nötig)

### 🔲 Laufend
- [ ] Monatliche Updates mit Bugfixes
- [ ] Neue Features basierend auf User-Feedback
- [ ] Rating & Review Management
- [ ] Version synchron mit PWA halten

---

## 🚨 Kritische Punkte (Blocker)

**Vor Launch unbedingt prüfen:**

1. ✅ **Digital Asset Links funktioniert**
   - TWA zeigt keine URL-Bar
   - Full-Screen Modus aktiv

2. ✅ **Service Worker Updates funktionieren**
   - PWA-Updates werden in der Android App übernommen

3. ✅ **assetlinks.json korrekt verlinkt**
   - URL erreichbar unter `https://s540d.github.io/Eisenhauer/.well-known/assetlinks.json`

4. ✅ **Offline Mode funktioniert**
   - App startet ohne Internet
   - Tasks werden lokal gespeichert

5. ✅ **Keine Crashes**
   - App stabil auf verschiedenen Android-Versionen (API 21-34)

6. ✅ **Privacy Policy vollständig**
   - Alle Datensammlung dokumentiert

---

## 📋 Finale Pre-Launch Checkliste

**Drucke diese Liste aus und hake ab!**

### Technisch
- [ ] Release Keystore generiert ✅
- [ ] Keystore-Backup erstellt ✅
- [ ] SHA-256 Fingerprint in `assetlinks.json` ✅
- [ ] Digital Asset Links verifiziert ✅
- [ ] Icons in allen Größen ✅
- [ ] AAB erfolgreich gebaut ✅
- [ ] TWA Full-Screen funktioniert ✅
- [ ] Offline-Funktionalität getestet ✅
- [ ] Keine Crashes ✅
- [ ] Testing auf echtem Gerät (min. 2 verschiedene Geräte) ✅

### Play Store
- [ ] Play Console Account aktiv ✅
- [ ] App Name reserviert ✅
- [ ] Short Description ✅
- [ ] Full Description ✅
- [ ] Screenshots (min. 2) ✅
- [ ] Feature Graphic ✅
- [ ] App Icon (512x512) ✅
- [ ] Privacy Policy URL ✅
- [ ] Content Rating ausgefüllt ✅
- [ ] Data Safety Form ausgefüllt ✅
- [ ] Release Notes ✅
- [ ] AAB hochgeladen ✅

### Final Checks
- [ ] Lighthouse Audit >= 80 ✅
- [ ] Accessibility: Keine kritischen Fehler ✅
- [ ] PWA und Android Version synchron ✅
- [ ] README.md aktualisiert ✅
- [ ] Team informiert ✅

---

## 🔗 Hilfreiche Links

- **Project Templates Roadmap:** https://github.com/S540d/project-templates/blob/main/GOOGLE_PLAY_STORE_ROADMAP.md
- **Android TWA Guide:** https://developer.chrome.com/docs/android/trusted-web-activity/
- **Play Console:** https://play.google.com/console/
- **Digital Asset Links Tool:** https://developers.google.com/digital-asset-links/tools/generator
- **Eisenhauer GitHub:** https://github.com/S540d/Eisenhauer

---

## ✅ Status Tracking

| Phase | Status | ETA | Notes |
|-------|--------|-----|-------|
| TWA/Android Setup | ✅ Completed | Week 0 | Project created 2025-11-12 |
| Store Listing | 🔲 Pending | Week 3-4 | Screenshots & Assets needed |
| Testing & Launch | 🔲 Pending | Week 5-6 | After assets ready |
| Post-Launch | 🔲 Pending | Week 7+ | Monitoring & Updates |

**Nächster Schritt:** 🎨 Screenshots & Feature Graphic erstellen (Phase 2)

---

**Last Updated:** 2025-11-12
