# Android TWA Status - Eisenhauer Matrix

**Projekt:** Eisenhauer Matrix - Android TWA für Google Play Store
**Letzte Aktualisierung:** 2026-02-04
**Status:** ✅ AAB gebaut und bereit für Play Store Upload (v1.10.0)

---

## ✅ Aktueller Status

### Build Information
- **Version:** 1.10.0 (versionCode: 18)
- **AAB Datei:** `Android/app/build/outputs/bundle/release/app-release.aab`
- **Größe:** ~1.9 MB
- **Signierung:** ✅ Signiert mit Release-Keystore
- **Status:** ✅ **Bereit für Play Store Upload**
- **Fix:** ✅ **Logout Data Leak** (Tasks werden beim Logout aus dem Speicher gelöscht)

### Technische Spezifikationen
- **Package Name:** `com.sven4321.eisenhauer`
- **App Name:** Eisenhauer Matrix
- **compileSdk:** 35 (Android 15)
- **Target SDK:** 35 (Android 15)
- **Minimum SDK:** 21 (Android 5.0 Lollipop)
- **PWA URL:** https://s540d.github.io/Eisenhauer/
- **Gradle:** 8.13
- **Java:** OpenJDK 23 (Forced for Gradle 8.13 compatibility)

---

## ✅ Vollständiges Android TWA-Projekt

Unter `Android/` wurde ein komplettes Android Studio Projekt erstellt:

```
Android/
├── app/
│   ├── src/main/
│   │   ├── java/com/sven4321/eisenhauer/
│   │   │   └── MainActivity.java          ✅ TWA Activity
│   │   ├── res/
│   │   │   ├── values/
│   │   │   │   ├── strings.xml            ✅ App-Strings
│   │   │   │   └── colors.xml             ✅ Theme-Farben (#667eea)
│   │   │   ├── mipmap-*/                  ✅ Icons (von PWA kopiert)
│   │   │   └── xml/
│   │   │       └── file_paths.xml         ✅ FileProvider Config
│   │   └── AndroidManifest.xml            ✅ App Manifest + TWA Config
│   ├── build.gradle                       ✅ App-level Build Config
│   └── proguard-rules.pro                 ✅ ProGuard Rules
├── gradle/
│   └── wrapper/
│       └── gradle-wrapper.properties      ✅ Gradle 8.13
├── build.gradle                           ✅ Project-level Build
├── settings.gradle                        ✅ Project Settings
├── gradle.properties                      ✅ Build Properties (Signing konfiguriert)
├── gradlew / gradlew.bat                  ✅ Gradle Wrapper Scripts
├── keystore/                              ✅ Release Keystore (nicht in Git)
├── .gitignore                             ✅ Ignore Keystores/Builds
├── README.md                              ✅ Umfassende Anleitung
└── PLAYSTORE_CHECKLIST.md                 ✅ 6-Wochen-Roadmap
```

### Digital Asset Links
- ✅ `.well-known/assetlinks.json` deployed auf GitHub Pages
- ✅ SHA-256 Fingerprint eingetragen
- ✅ Live erreichbar: https://s540d.github.io/Eisenhauer/.well-known/assetlinks.json

### Dokumentation
- ✅ **Android/README.md:** Komplette Setup- & Build-Anleitung
- ✅ **Android/PLAYSTORE_CHECKLIST.md:** 6-Wochen-Timeline bis Launch
- ✅ **ANDROID_STATUS.md:** Diese Datei (Status-Übersicht)

---

## 🎯 Play Store Listing

### Kurzbeschreibung (80 Zeichen max.)
```
Aufgaben priorisieren mit der Eisenhauer-Matrix. Produktiv & fokussiert.
```

### Langbeschreibung (4000 Zeichen max.)
```
🎯 Eisenhauer Matrix - Smarte Aufgabenverwaltung

Organisiere deine Aufgaben nach dem bewährten Eisenhauer-Prinzip: Unterscheide zwischen wichtig und dringend, und erreiche deine Ziele fokussiert und stressfrei.

━━━━━━━━━━━━━━━━━━━━━━━━
✨ KERNFUNKTIONEN
━━━━━━━━━━━━━━━━━━━━━━━━

📊 DIE 4 QUADRANTEN
• Do! - Dringend & Wichtig (sofort erledigen)
• Schedule! - Wichtig, aber nicht dringend (planen)
• Delegate! - Dringend, aber nicht wichtig (delegieren)
• Ignore! - Weder dringend noch wichtig (eliminieren)
• Done! - Erledigte Aufgaben

🔄 WIEDERKEHRENDE AUFGABEN
• Täglich, wöchentlich, monatlich oder benutzerdefiniert
• Erscheinen automatisch, wenn sie fällig sind
• Perfekt für Routinen und Gewohnheiten

☁️ CLOUD-SYNCHRONISATION
• Synchronisiere deine Aufgaben über alle Geräte
• Google Sign-In für schnellen Zugriff
• Oder nutze die App ohne Anmeldung (Gastmodus)

📴 OFFLINE-MODUS
• Funktioniert auch ohne Internetverbindung
• Änderungen werden automatisch synchronisiert
• Deine Daten sind immer sicher gespeichert

━━━━━━━━━━━━━━━━━━━━━━━━
🚀 BEDIENKOMFORT
━━━━━━━━━━━━━━━━━━━━━━━━

• Drag & Drop zwischen Quadranten
• Swipe-to-Delete auf dem Smartphone
• Checkbox zum schnellen Abhaken
• Dark Mode für angenehmes Arbeiten
• Kompaktes, übersichtliches Design

♿ BARRIEREFREIHEIT
• Vollständige Tastatursteuerung
• Screen Reader Unterstützung
• WCAG 2.1 Level AA konform

━━━━━━━━━━━━━━━━━━━━━━━━
💾 DATENMANAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━

• Export/Import als JSON-Backup
• Suche durch alle Aufgaben
• Sichere Speicherung in der Cloud oder lokal

━━━━━━━━━━━━━━━━━━━━━━━━
🎓 DIE EISENHOWER-METHODE
━━━━━━━━━━━━━━━━━━━━━━━━

Entwickelt vom 34. US-Präsidenten Dwight D. Eisenhower, hilft dir diese Methode:

✓ Wichtiges von Unwichtigem zu trennen
✓ Prioritäten klar zu setzen
✓ Stress zu reduzieren
✓ Produktiver zu arbeiten
✓ Zeit für das Wesentliche zu haben

━━━━━━━━━━━━━━━━━━━━━━━━
🔒 DATENSCHUTZ & SICHERHEIT
━━━━━━━━━━━━━━━━━━━━━━━━

• Deine Daten gehören dir
• Sichere Firebase-Verschlüsselung
• Keine Werbung, keine Tracker
• Open Source (GitHub: S540d/Eisenhauer)

━━━━━━━━━━━━━━━━━━━━━━━━
✨ PERFEKT FÜR
━━━━━━━━━━━━━━━━━━━━━━━━

• Berufstätige mit vielen Projekten
• Studierende im Prüfungsstress
• Selbstständige und Freelancer
• Alle, die produktiver werden wollen

Starte jetzt mit der Eisenhauer Matrix und bring Struktur in deinen Alltag!

Made with ❤️ | MIT License | Kostenfrei & werbefrei
```

### Assets (Grafiken)

#### ✅ Automatisch generiert
Alle Assets wurden mit Python-Script automatisch erstellt:

```bash
cd Android
python3 generate-playstore-assets.py
```

**Generierte Dateien:**
- ✅ **Feature Graphic** (1024x500px) → `Android/playstore-assets/feature-graphic.png`
- ✅ **App-Icon** (512x512px) → `Android/playstore-assets/app-icon-512.png`
- ✅ **Screenshot-Template** → `Android/playstore-assets/screenshot-frame-template.png`
- ✅ **README mit Anleitung** → `Android/playstore-assets/README.md`

#### ⚠️ Screenshots manuell erstellen
Screenshots müssen manuell von der Live-App erstellt werden:

**Empfohlene Methode (Browser):**
1. Öffne https://s540d.github.io/Eisenhauer/ im Chrome/Edge
2. Developer Tools (F12) → Device Toolbar (Cmd+Shift+M)
3. iPhone 14 Pro Max auswählen (oder Custom: 1080x1920)
4. Beispiel-Aufgaben in alle 4 Quadranten einfügen (siehe `playstore-assets/README.md`)
5. Screenshot erstellen: Cmd+Shift+P → "Capture screenshot"
6. Mindestens 2 Screenshots, maximal 8

**Alternative (Automatisch, experimentell):**
```bash
cd Android
pip3 install selenium pillow webdriver-manager
python3 create-screenshots.py
```

**Benötigte Screenshots:**
1. Hauptansicht mit Aufgaben in allen 4 Quadranten (PFLICHT)
2. Dark Mode Ansicht (EMPFOHLEN)
3. Optional: Aufgabe hinzufügen, Drag & Drop, Wiederkehrende Aufgaben

---

## ⚠️ Nächste Schritte (Du musst das machen!)

### Schritt 1: Gradle Wrapper initialisieren
```bash
cd Android
./gradlew --version
# Falls Fehler: gradle wrapper --gradle-version 8.2
```

### Schritt 2: Keystore generieren (KRITISCH!)
```bash
cd Android
mkdir -p keystore

keytool -genkey -v -keystore keystore/eisenhauer-release.keystore \
  -alias eisenhauer-release \
  -keyalg RSA -keysize 2048 -validity 10000

# WICHTIG: Passwörter merken!
# WICHTIG: Keystore-Backup erstellen!
```

### Schritt 3: SHA-256 Fingerprint extrahieren
```bash
keytool -list -v -keystore keystore/eisenhauer-release.keystore \
  -alias eisenhauer-release | grep "SHA256:"

# Kopiere den Fingerprint (Format: XX:XX:XX:...)
```

### Schritt 4: Digital Asset Links aktualisieren
```bash
# Öffne: .well-known/assetlinks.json
# Ersetze "REPLACE_WITH_YOUR_SHA256_FINGERPRINT_FROM_RELEASE_KEYSTORE"
# mit deinem echten SHA-256 Fingerprint

# Dann deployen:
git add .well-known/assetlinks.json
git commit -m "Add Digital Asset Links with real SHA-256 fingerprint"
git push origin main

# Warte 1-2 Minuten, dann teste:
curl https://s540d.github.io/Eisenhauer/.well-known/assetlinks.json
```

### Schritt 5: Signing Config in gradle.properties
```bash
# Öffne: Android/gradle.properties
# Ersetze Platzhalter mit echten Werten:

SIGNING_KEY_STORE_PATH=../keystore/eisenhauer-release.keystore
SIGNING_KEY_ALIAS=eisenhauer-release
SIGNING_KEY_PASSWORD=dein_key_passwort
SIGNING_STORE_PASSWORD=dein_store_passwort
```

### Schritt 6: Icons vorbereiten
```bash
cd Android

# Icons aus PWA kopieren
cp ../icons/icon-72x72.png app/src/main/res/mipmap-hdpi/ic_launcher.png
cp ../icons/icon-96x96.png app/src/main/res/mipmap-xhdpi/ic_launcher.png
cp ../icons/icon-144x144.png app/src/main/res/mipmap-xxhdpi/ic_launcher.png
cp ../icons/icon-192x192.png app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

# Für mdpi (48x48) musst du das Icon skalieren
# Tool: https://imageresizer.com/ oder ImageMagick
```

### Schritt 7: Signing Config in build.gradle aktivieren
```bash
# Öffne: Android/app/build.gradle
# Füge unter android {} hinzu:

signingConfigs {
    release {
        storeFile file(project.hasProperty('SIGNING_KEY_STORE_PATH')
            ? project.property('SIGNING_KEY_STORE_PATH')
            : System.getenv('SIGNING_KEY_STORE_PATH'))
        storePassword project.hasProperty('SIGNING_STORE_PASSWORD')
            ? project.property('SIGNING_STORE_PASSWORD')
            : System.getenv('SIGNING_STORE_PASSWORD')
        keyAlias project.hasProperty('SIGNING_KEY_ALIAS')
            ? project.property('SIGNING_KEY_ALIAS')
            : System.getenv('SIGNING_KEY_ALIAS')
        keyPassword project.hasProperty('SIGNING_KEY_PASSWORD')
            ? project.property('SIGNING_KEY_PASSWORD')
            : System.getenv('SIGNING_KEY_PASSWORD')
    }
}

buildTypes {
    release {
        // ... existing config ...
        signingConfig signingConfigs.release
    }
}
```

### Schritt 8: Erste Builds
```bash
cd Android

# Debug Build
./gradlew clean assembleDebug

# Release Build
./gradlew clean assembleRelease

# AAB für Play Store
./gradlew clean bundleRelease
```

### Schritt 9: Testing auf echtem Gerät
```bash
# Debug APK installieren
adb install app/build/outputs/apk/debug/app-debug.apk

# App öffnen und testen:
# - TWA Full-Screen (keine URL-Bar)?
# - Alle Features funktionieren?
# - Offline-Modus funktioniert?
```

### Schritt 10: Play Store Vorbereitung
Siehe **Android/PLAYSTORE_CHECKLIST.md** für:
- Screenshots erstellen (min. 2)
- Feature Graphic (1024x500px)
- Store Listing Text
- Privacy Policy prüfen
- AAB hochladen

---

## 📋 Quick Checklist

Drucke diese Liste aus und hake ab:

### Phase 1: Setup & Build
- [ ] Gradle Wrapper initialisiert
- [ ] Keystore generiert (`eisenhauer-release.keystore`)
- [ ] Keystore-Backup erstellt (USB/Cloud)
- [ ] SHA-256 Fingerprint extrahiert
- [ ] `assetlinks.json` mit Fingerprint aktualisiert
- [ ] `assetlinks.json` deployed auf GitHub Pages
- [ ] Digital Asset Links verifiziert (URL erreichbar)
- [ ] Signing Config in `gradle.properties` eingetragen
- [ ] Signing Config in `app/build.gradle` aktiviert
- [ ] Icons in `res/mipmap-*` kopiert
- [ ] Debug Build erfolgreich
- [ ] Release Build erfolgreich
- [ ] AAB Build erfolgreich
- [ ] Debug APK auf Gerät getestet
- [ ] TWA Full-Screen funktioniert

### Phase 2: Play Store Listing
- [x] Play Console Account aktiviert
- [x] App-Eintrag im Play Store angelegt
- [x] Kurzbeschreibung verfasst (80 Zeichen)
- [x] Langbeschreibung verfasst (4000 Zeichen)
- [x] Feature Graphic erstellt (1024x500px)
- [x] App-Icon erstellt (512x512px)
- [x] Python-Scripts für Assets erstellt
- [ ] Kurzbeschreibung im Play Store eingetragen
- [ ] Langbeschreibung im Play Store eingetragen
- [ ] App-Kategorie ausgewählt (Produktivität)
- [ ] Screenshots erstellt (min. 2)
- [ ] Screenshots hochgeladen
- [ ] Feature Graphic hochgeladen
- [ ] App-Icon hochgeladen
- [ ] Content Rating Fragebogen ausgefüllt
- [ ] Datenschutzerklärung URL hinzugefügt

### Phase 3: Testing & Launch
- [ ] AAB hochgeladen
- [ ] Internal Testing Track konfiguriert
- [ ] Tester eingeladen
- [ ] Testing Phase abgeschlossen
- [ ] Production Release erstellt
- [ ] Google Review abwarten (1-7 Tage)
- [ ] Launch! 🚀

---

## 🎯 Timeline

Basierend auf **project-templates/GOOGLE_PLAY_STORE_ROADMAP.md**:

| Phase | Dauer | Tasks | Status |
|-------|-------|-------|--------|
| **Phase 1: Setup** | Woche 1-2 | Keystore, Digital Asset Links, Icons, Erste Builds | ⚠️ In Progress |
| **Phase 2: Store Listing** | Woche 3-4 | Screenshots, Feature Graphic, Store Text | ⚠️ In Progress (Text fertig) |
| **Phase 3: Testing & Launch** | Woche 5-6 | Testing, AAB Upload, Google Review | 🔲 Pending |
| **Phase 4: Monitoring** | Woche 7+ | Crash Reports, Reviews, Updates | 🔲 Pending |

**ETA Launch:** ~6 Wochen ab heute (ca. Dezember 2025)

**Aktueller Stand (2025-11-13):**
- ✅ Play Store Eintrag angelegt
- ✅ Kurz- und Langbeschreibung verfasst
- ⚠️ Nächste Schritte: Keystore generieren, AAB bauen, Screenshots erstellen

---

## 📚 Dokumentation

Alle Details findest du in:

1. **Android/README.md** - Umfassende Setup-Anleitung (10.000+ Wörter)
   - Keystore-Generierung
   - Digital Asset Links Setup
   - Icons vorbereiten
   - Build-Prozess
   - Testing
   - Play Store Upload
   - Troubleshooting

2. **Android/PLAYSTORE_CHECKLIST.md** - 6-Wochen-Roadmap
   - Phase-by-Phase Checklisten
   - Konkrete Commands
   - Store Listing Templates
   - Post-Launch Monitoring

3. **project-templates/GOOGLE_PLAY_STORE_ROADMAP.md** - Allgemeine Roadmap
   - Generelle Play Store Anforderungen
   - Best Practices
   - Alle 5 Projekte Timeline

---

## 🔗 Wichtige Links

- **PWA Live:** https://s540d.github.io/Eisenhauer/
- **GitHub Repo:** https://github.com/S540d/Eisenhauer
- **Play Console:** https://play.google.com/console/
- **Digital Asset Links Tool:** https://developers.google.com/digital-asset-links/tools/generator
- **Android TWA Guide:** https://developer.chrome.com/docs/android/trusted-web-activity/

---

## ❓ Fragen?

Bei Problemen oder Fragen:
1. Schaue in **Android/README.md** → "Troubleshooting" Sektion
2. Öffne ein Issue: https://github.com/S540d/Eisenhauer/issues
3. Checke Stack Overflow: https://stackoverflow.com/questions/tagged/trusted-web-activity

---

## ✅ Zusammenfassung

**Was funktioniert:**
- ✅ Vollständiges Android TWA-Projekt erstellt
- ✅ PWA ist production-ready und live
- ✅ Build-System konfiguriert (Gradle 8.2)
- ✅ Umfassende Dokumentation vorhanden
- ✅ Play Store Eintrag angelegt
- ✅ Store Listing Text verfasst (Kurz- & Langbeschreibung)
- ✅ Feature Graphic automatisch generiert (1024x500px)
- ✅ App-Icon für Play Store generiert (512x512px)
- ✅ Python-Scripts für Asset-Generierung erstellt

**Was noch zu tun ist:**
- ⚠️ Keystore generieren & Backup erstellen (10 Min) ← KRITISCH!
- ⚠️ Digital Asset Links mit echtem SHA-256 aktualisieren
- ⚠️ AAB Build erstellen
- ⚠️ Screenshots erstellen (min. 2)
  - Browser Developer Tools verwenden
  - Oder: Automatisches Script nutzen
  - Beispiel-Aufgaben einfügen (siehe playstore-assets/README.md)
- ⚠️ Store Listing im Play Store vervollständigen
  - Texte eintragen
  - Assets hochladen (Feature Graphic, Icon, Screenshots)
  - Content Rating ausfüllen
  - Datenschutzerklärung verlinken
- ⚠️ AAB zum Play Store hochladen

**Geschätzte Zeit bis Launch-Ready:**
- Technical Setup (Keystore, Build): ~1 Stunde
- Screenshots erstellen: ~30 Minuten
- Store Listing vervollständigen: ~30 Minuten
- Google Review: 1-7 Tage
- **Total: ~1 Woche** (inkl. Google Review, da Graphics bereits fertig)

---

**Nächster Schritt:** Folge den Anweisungen in **Android/README.md** ab "Schritt 1: Signing Certificate erstellen" 🚀

---

**Last Updated:** 2026-02-04
