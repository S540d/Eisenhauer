# Eisenhauer Matrix - Android TWA (Trusted Web Activity)

Dieses Android-Projekt wraps die [Eisenhauer Matrix PWA](https://s540d.github.io/Eisenhauer/) als native Android App für den **Google Play Store**.

## 📋 Projektübersicht

- **Package Name:** `com.sven4321.eisenhauer`
- **App Name:** Eisenhauer Matrix
- **PWA URL:** https://s540d.github.io/Eisenhauer/
- **Version:** 1.6.0 (Match PWA version)
- **Target SDK:** 34 (Android 14)
- **Minimum SDK:** 21 (Android 5.0 Lollipop)

## 🎯 Was ist eine TWA?

Eine **Trusted Web Activity (TWA)** ist Googles offizieller Weg, eine PWA als native Android App zu verpacken:

✅ **Vorteile:**
- Full-Screen ohne Browser UI
- Im Play Store veröffentlichbar
- Updates über PWA (kein App-Update nötig für Content-Änderungen)
- Natives App-Feeling
- Shared Cookies/Storage mit Browser-Version
- Minimaler Android Code (nur Wrapper)

📦 **Technologie:**
- AndroidX Browser Library
- Google Android Browser Helper
- Chrome Custom Tabs

---

## 🚀 Setup & Build Anleitung

### Voraussetzungen

Stelle sicher, dass folgende Tools installiert sind:

- **Java JDK 17+** (für Android Studio & Gradle)
- **Android SDK** (via Android Studio oder Command Line Tools)
- **Android Studio** (empfohlen) oder Command Line Build
- **Git** (für Version Control)

#### Java Installation prüfen

```bash
java -version
# Expected: openjdk version "17.0.x" or higher
```

Falls nicht installiert:
```bash
# macOS (via Homebrew)
brew install openjdk@17

# Set JAVA_HOME
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

### 1. Projekt Struktur prüfen

Das Projekt sollte folgende Struktur haben:

```
Android/
├── app/
│   ├── src/main/
│   │   ├── java/com/sven4321/eisenhauer/
│   │   │   └── MainActivity.java
│   │   ├── res/
│   │   │   ├── values/
│   │   │   │   ├── strings.xml
│   │   │   │   └── colors.xml
│   │   │   ├── mipmap-*/          (Icons - siehe unten)
│   │   │   └── xml/
│   │   │       └── file_paths.xml
│   │   └── AndroidManifest.xml
│   ├── build.gradle
│   └── proguard-rules.pro
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar      (wird automatisch heruntergeladen)
│       └── gradle-wrapper.properties
├── build.gradle
├── settings.gradle
├── gradle.properties
├── gradlew                         (Linux/macOS)
├── gradlew.bat                     (Windows)
└── README.md                       (diese Datei)
```

---

## 🔑 Schritt 1: Signing Certificate erstellen

Für den Play Store benötigst du ein **Release Keystore**. Das Keystore enthält dein privates Signing-Zertifikat.

### 1.1 Keystore generieren

```bash
cd Android

# Erstelle keystore Verzeichnis (nicht in Git!)
mkdir -p keystore

# Generiere Release Keystore
keytool -genkey -v -keystore keystore/eisenhauer-release.keystore \
  -alias eisenhauer-release \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Du wirst nach folgenden Informationen gefragt:
# - Keystore password (min. 6 Zeichen) - MERKEN!
# - Key password (min. 6 Zeichen) - MERKEN!
# - Name, Organization, etc. (kann beliebig sein)
```

⚠️ **WICHTIG:**
- **NIEMALS** das Keystore in Git committen!
- Backup das Keystore sicher (z.B. verschlüsseltes USB-Drive)
- Ohne Keystore kannst du **keine Updates** zur Play Store App hochladen!

### 1.2 SHA-256 Fingerprint extrahieren

Dieser Fingerprint wird für **Digital Asset Links** benötigt:

```bash
keytool -list -v -keystore keystore/eisenhauer-release.keystore \
  -alias eisenhauer-release

# Suche nach "SHA256:" in der Ausgabe
# Beispiel: SHA256: 14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5

# Kopiere den SHA-256 Fingerprint (ohne "SHA256: " Prefix und ohne Doppelpunkte entfernen!)
```

### 1.3 Signing Config in gradle.properties

Erstelle eine **lokale** `gradle.properties` Datei (falls nicht vorhanden) und füge hinzu:

```properties
# Signing Configuration (DO NOT commit these values to Git!)
SIGNING_KEY_STORE_PATH=../keystore/eisenhauer-release.keystore
SIGNING_KEY_ALIAS=eisenhauer-release
SIGNING_KEY_PASSWORD=YOUR_KEY_PASSWORD_HERE
SIGNING_STORE_PASSWORD=YOUR_STORE_PASSWORD_HERE
```

⚠️ **Alternativ:** Verwende Environment Variables (sicherer für CI/CD):
```bash
export SIGNING_KEY_STORE_PATH=/path/to/keystore
export SIGNING_KEY_ALIAS=eisenhauer-release
export SIGNING_KEY_PASSWORD=your_key_password
export SIGNING_STORE_PASSWORD=your_store_password
```

### 1.4 Signing Config in build.gradle aktivieren

Öffne `app/build.gradle` und füge unter `android {}` hinzu:

```gradle
android {
    // ... existing config ...

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
}
```

---

## 🔗 Schritt 2: Digital Asset Links konfigurieren

Digital Asset Links verifizieren, dass deine Android App und PWA zusammengehören.

### 2.1 assetlinks.json aktualisieren

Öffne `../.well-known/assetlinks.json` und ersetze den Fingerprint:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.sven4321.eisenhauer",
      "sha256_cert_fingerprints": [
        "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"
      ]
    }
  }
]
```

Ersetze den Fingerprint mit deinem eigenen aus Schritt 1.2.

### 2.2 assetlinks.json deployen

Die Datei **MUSS** unter dieser URL erreichbar sein:

```
https://s540d.github.io/Eisenhauer/.well-known/assetlinks.json
```

**Deployment:**
```bash
cd ..  # zurück ins Hauptverzeichnis
git add .well-known/assetlinks.json
git commit -m "Add Digital Asset Links for Android TWA"
git push origin main

# Warte ca. 1-2 Minuten für GitHub Pages Deployment
```

**Testen:**
```bash
curl https://s540d.github.io/Eisenhauer/.well-known/assetlinks.json

# Sollte den JSON-Inhalt zurückgeben
```

### 2.3 Digital Asset Links verifizieren

Google bietet ein Test-Tool:

```
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://s540d.github.io&relation=delegate_permission/common.handle_all_urls
```

Oder nutze das [Statement List Generator Tool](https://developers.google.com/digital-asset-links/tools/generator).

---

## 🎨 Schritt 3: App Icons vorbereiten

Android benötigt Icons in verschiedenen Auflösungen.

### 3.1 Benötigte Icon-Größen

| Density | Size | Verzeichnis |
|---------|------|-------------|
| mdpi | 48x48 | `res/mipmap-mdpi/` |
| hdpi | 72x72 | `res/mipmap-hdpi/` |
| xhdpi | 96x96 | `res/mipmap-xhdpi/` |
| xxhdpi | 144x144 | `res/mipmap-xxhdpi/` |
| xxxhdpi | 192x192 | `res/mipmap-xxxhdpi/` |

### 3.2 Icons aus PWA konvertieren

Die PWA hat bereits Icons unter `../icons/`. Du kannst diese nutzen:

```bash
# Kopiere und benenne Icons um
cp ../icons/icon-72x72.png app/src/main/res/mipmap-hdpi/ic_launcher.png
cp ../icons/icon-96x96.png app/src/main/res/mipmap-xhdpi/ic_launcher.png
cp ../icons/icon-144x144.png app/src/main/res/mipmap-xxhdpi/ic_launcher.png
cp ../icons/icon-192x192.png app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

# Für mdpi (48x48) musst du das Icon skalieren:
# Nutze ein Tool wie ImageMagick oder Online Image Resizer
```

**Empfehlung:** Nutze [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html) für professionelle Icons.

### 3.3 Adaptive Icons (Optional aber empfohlen)

Moderne Android-Versionen (8.0+) nutzen Adaptive Icons. Siehe [Android Adaptive Icons Guide](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive).

---

## 🏗️ Schritt 4: App bauen

### 4.1 Gradle Wrapper herunterladen

Beim ersten Build wird Gradle automatisch heruntergeladen:

```bash
cd Android

# Linux/macOS
./gradlew --version

# Windows
gradlew.bat --version
```

Falls Fehler auftreten, lade Gradle Wrapper JAR manuell:
```bash
gradle wrapper --gradle-version 8.2
```

### 4.2 Debug Build (für lokales Testen)

```bash
./gradlew assembleDebug

# APK Output:
# app/build/outputs/apk/debug/app-debug.apk
```

### 4.3 Release Build (für Play Store)

```bash
./gradlew assembleRelease

# APK Output:
# app/build/outputs/apk/release/app-release.apk
```

### 4.4 Android App Bundle (AAB) - Empfohlen für Play Store

```bash
./gradlew bundleRelease

# AAB Output:
# app/build/outputs/bundle/release/app-release.aab
```

**Warum AAB?**
- Kleinere Download-Größe für Nutzer
- Google optimiert APKs automatisch für verschiedene Geräte
- Ab August 2021 Pflicht für neue Apps im Play Store

---

## 📱 Schritt 5: App testen

### 5.1 Debug APK auf Gerät installieren

```bash
# Via ADB (Android Debug Bridge)
adb install app/build/outputs/apk/debug/app-debug.apk

# Oder: APK manuell auf Gerät kopieren und installieren
```

### 5.2 Testen ob TWA funktioniert

1. Öffne die App
2. Sollte Full-Screen ohne Browser UI angezeigt werden
3. URL-Bar sollte NICHT sichtbar sein (sonst ist Digital Asset Links nicht verifiziert)
4. Teste Navigation und alle Features
5. Teste Offline-Funktionalität (Flight Mode)

### 5.3 Debugging

Falls URL-Bar sichtbar ist:
```bash
# Chrome Flags für TWA Debugging
adb shell am start -a android.intent.action.VIEW \
  -d "chrome://flags/#enable-twa-debug-mode" \
  com.android.chrome

# Enable TWA Debug Mode
```

**Logs anschauen:**
```bash
adb logcat | grep -i "twa\|customtabs"
```

---

## 🏪 Schritt 6: Google Play Store Veröffentlichung

### 6.1 Play Console Setup

1. Gehe zu [Google Play Console](https://play.google.com/console/)
2. Zahle $25 einmalige Developer-Registrierungsgebühr (falls noch nicht geschehen)
3. Erstelle neue App: **"Create App"**
   - App Name: **Eisenhauer Matrix**
   - Default Language: **Deutsch (Deutschland)**
   - App Type: **App**
   - Free/Paid: **Free**

### 6.2 Store Listing ausfüllen

#### App Details
- **App Name:** Eisenhauer Matrix
- **Short Description (80 Zeichen):**
  ```
  Task-Management nach der Eisenhauer-Matrix-Methode
  ```
- **Full Description (4000 Zeichen):**
  ```
  Eisenhauer Matrix ist eine moderne Task-Management-App basierend auf der
  Eisenhauer-Matrix-Methode zur Priorisierung von Aufgaben.

  FEATURES:
  • 5 Segmente: Do, Schedule, Delegate, Ignore, Done
  • Wiederkehrende Aufgaben (täglich, wöchentlich, monatlich)
  • Drag & Drop zwischen Segmenten
  • Cloud-Synchronisation mit Firebase
  • Offline-First Architecture
  • Dark Mode
  • Export/Import (JSON)

  OFFLINE-FUNKTIONALITÄT:
  Die App funktioniert vollständig offline. Alle Änderungen werden lokal
  gespeichert und automatisch synchronisiert, sobald eine Verbindung besteht.

  DATENSCHUTZ:
  Ihre Daten werden sicher in Firebase gespeichert oder lokal auf Ihrem
  Gerät (Gastmodus). Keine Tracking, keine Werbung.

  Open Source: https://github.com/S540d/Eisenhauer
  ```

#### Graphics Assets

**Screenshots (mindestens 2, maximal 8):**
- Größe: Mindestens 1080x1920px (Portrait) oder 1920x1080px (Landscape)
- Format: PNG oder JPEG
- Content: App in Aktion zeigen (Tasks erstellen, Drag & Drop, Dark Mode, etc.)

**Feature Graphic (optional aber empfohlen):**
- Größe: 1024x500px
- Format: PNG oder JPEG
- Content: Banner mit App-Logo und Slogan

**App Icon:**
- Größe: 512x512px
- Format: PNG (32-bit)
- Kein transparenter Saum!

**Erstellen von Screenshots:**
```bash
# Android Emulator starten
# Screenshots machen via Screenshot Tool oder ADB:
adb exec-out screencap -p > screenshot.png
```

### 6.3 Content Rating

Fülle das **Content Rating Questionnaire** aus:
- App-Kategorie: **Productivity**
- Gewalt: Nein
- Sexueller Inhalt: Nein
- Obszönität: Nein
- Drogen/Alkohol: Nein
- etc.

**Ergebnis:** Wahrscheinlich **Everyone (3+)**

### 6.4 Privacy Policy

**Pflicht für alle Apps im Play Store!**

Erstelle eine Privacy Policy und hoste sie unter:
```
https://s540d.github.io/Eisenhauer/privacy-policy.html
```

(Existiert bereits im PWA-Projekt: `privacy-policy.html`)

Link in Play Console: `https://s540d.github.io/Eisenhauer/privacy-policy.html`

### 6.5 Data Safety Section

Fülle das **Data Safety Form** aus:
- **Datenerfassung:** Ja (Firebase Auth, Tasks)
- **Datentypen:**
  - Personal Info: Email (für Login)
  - App Activity: Tasks/Todo-Items
- **Datenweitergabe:** Nein
- **Verschlüsselung:** Ja (Firebase)
- **Datenlöschung:** Ja (Account-Löschung möglich)

### 6.6 App Upload

1. Gehe zu **"Release" → "Production" → "Create New Release"**
2. Lade **app-release.aab** hoch
3. Release Notes hinzufügen:
   ```
   Erste Veröffentlichung der Eisenhauer Matrix App!

   Features:
   - Task-Management nach Eisenhauer-Matrix
   - Wiederkehrende Aufgaben
   - Cloud-Sync und Offline-Support
   - Dark Mode
   - Export/Import

   Wir freuen uns über Feedback!
   ```

### 6.7 Review & Rollout

1. Review Summary prüfen
2. **"Start Rollout to Production"**
3. Google Review-Prozess: **1-7 Tage** (meistens 1-2 Tage)

**Status-Tracking:**
- Play Console → "Release" → "Production"
- Email-Benachrichtigungen von Google

---

## 🔧 Troubleshooting

### Problem: TWA zeigt URL-Bar an

**Ursache:** Digital Asset Links nicht verifiziert

**Lösung:**
1. Prüfe `assetlinks.json` URL erreichbar
2. Prüfe SHA-256 Fingerprint korrekt
3. Prüfe Package Name in `assetlinks.json` = `com.sven4321.eisenhauer`
4. Warte 5-10 Minuten nach Deployment
5. Cache löschen: `adb shell pm clear com.sven4321.eisenhauer`

### Problem: Build Fehler "SDK not found"

**Lösung:**
```bash
# Android SDK Path setzen
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# oder
export ANDROID_HOME=$HOME/Android/Sdk  # Linux

# In gradle.properties hinzufügen:
sdk.dir=/path/to/android/sdk
```

### Problem: "Keystore not found"

**Lösung:**
- Prüfe Pfad in `gradle.properties` oder Environment Variables
- Stelle sicher, Keystore existiert: `ls keystore/eisenhauer-release.keystore`

### Problem: Play Store Rejection

**Häufige Gründe:**
- Privacy Policy fehlt oder nicht erreichbar
- Content Rating nicht ausgefüllt
- Data Safety Form unvollständig
- App stürzt bei Google Tests ab

**Lösung:**
- Lese Google-Feedback genau
- Behebe Probleme
- Reiche neue Version ein

---

## 📚 Zusätzliche Ressourcen

### Documentation
- [Google TWA Guide](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Android App Publishing](https://developer.android.com/studio/publish)
- [Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Digital Asset Links](https://developers.google.com/digital-asset-links/v1/getting-started)

### Tools
- [Android Studio](https://developer.android.com/studio)
- [Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap) (Alternative zu manuellem Setup)
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/)
- [ImageMagick](https://imagemagick.org/) (für Icon-Resize)

### Community
- [Stack Overflow - TWA Tag](https://stackoverflow.com/questions/tagged/trusted-web-activity)
- [Android Developers Reddit](https://www.reddit.com/r/androiddev/)

---

## 📝 Checkliste vor Play Store Upload

Nutze diese Checkliste, um sicherzustellen, dass alles bereit ist:

### Technisch
- [ ] Release Keystore generiert und sicher gespeichert
- [ ] SHA-256 Fingerprint extrahiert
- [ ] Signing Config in `build.gradle` konfiguriert
- [ ] `assetlinks.json` deployed und erreichbar
- [ ] Digital Asset Links verifiziert
- [ ] Icons in allen Größen vorhanden
- [ ] AAB erfolgreich gebaut (`bundleRelease`)
- [ ] App auf echtem Gerät getestet
- [ ] TWA Full-Screen ohne URL-Bar funktioniert
- [ ] Offline-Funktionalität getestet
- [ ] Keine Crashes oder kritische Bugs

### Play Store
- [ ] Google Play Console Account aktiv ($25 bezahlt)
- [ ] App Name reserviert
- [ ] Short Description (80 Zeichen) geschrieben
- [ ] Full Description (4000 Zeichen) geschrieben
- [ ] Screenshots (min. 2) erstellt
- [ ] Feature Graphic (1024x500) erstellt
- [ ] App Icon (512x512) hochgeladen
- [ ] Privacy Policy URL hinterlegt
- [ ] Content Rating ausgefüllt
- [ ] Data Safety Form ausgefüllt
- [ ] Release Notes geschrieben
- [ ] AAB hochgeladen

### Nach Launch
- [ ] Play Store Listing Live
- [ ] App über Play Store installierbar
- [ ] Monitor Crash Reports (erste Woche täglich)
- [ ] Antworten auf Reviews
- [ ] Update-Strategie definiert

---

## 🚦 Versionierung

**Wichtig:** Halte die Android-Version synchron mit der PWA-Version!

**Format:** `major.minor.patch` (SemVer)

**Update Prozess:**
1. PWA updaten und deployen
2. Android `versionName` in `app/build.gradle` erhöhen
3. Android `versionCode` inkrementieren (z.B. 1 → 2 → 3...)
4. Neuen Release bauen
5. Im Play Store als Update hochladen

**Beispiel:**
```gradle
defaultConfig {
    versionCode 2           // Immer inkrementieren!
    versionName "1.7.0"     // Match PWA version
}
```

---

## 📧 Support & Kontakt

Bei Fragen oder Problemen:
- **GitHub Issues:** [https://github.com/S540d/Eisenhauer/issues](https://github.com/S540d/Eisenhauer/issues)
- **Email:** [Deine Email hier]

---

Made with ❤️ by [S540d](https://github.com/S540d)

Last updated: 2025-11-12
