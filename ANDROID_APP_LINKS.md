# Android App Links Setup Guide

**Ziel:** Automatisches Öffnen der App bei Website-Links (Deep Linking)
**Plattform:** Android 12+ (API Level 31+)
**Datum:** 2025-11-14

---

## 📋 Was sind Android App Links?

Android App Links ermöglichen es, dass beim Klicken auf einen Website-Link automatisch die App geöffnet wird (falls installiert), statt des Browsers.

**Beispiel:**
- Nutzer klickt auf `https://s540d.github.io/Eisenhauer/`
- → App öffnet sich direkt (ohne Browser-Auswahl)

---

## ✅ Checkliste

### 1. **Digital Asset Links** (Website)
- [ ] `.well-known/assetlinks.json` erstellt
- [ ] SHA-256 Fingerabdruck vom Play Store eingetragen
- [ ] Datei ist öffentlich erreichbar
- [ ] Content-Type: `application/json`

### 2. **Intent-Filter** (App)
- [ ] `intentFilters` in app.json (Expo) oder AndroidManifest.xml (TWA)
- [ ] `autoVerify: true` gesetzt
- [ ] Korrekte Host und Path konfiguriert

### 3. **Play Store**
- [ ] Neue App-Version mit Intent-Filter hochgeladen
- [ ] Validierung im Play Console abwarten (kann 24h dauern)

---

## 🔧 Setup für Expo Apps

### Schritt 1: assetlinks.json erstellen

```bash
mkdir -p public/.well-known
```

**public/.well-known/assetlinks.json:**
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.yourcompany.yourapp",
      "sha256_cert_fingerprints": [
        "C9:B7:5C:A8:F4:23:48:5D:D6:E3:87:EB:9A:13:5B:4F:B8:24:A4:AE:E5:56:9C:58:56:E6:E6:AE:73:C4:BB:78"
      ]
    }
  }
]
```

### Schritt 2: app.json anpassen

```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.yourapp",
      "versionCode": 2,
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "yourdomain.github.io",
              "pathPrefix": "/YourApp"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

### Schritt 3: Build-Skript anpassen

**scripts/post-build.js:**
```javascript
const filesToCopy = [
  { src: 'public/.nojekyll', dest: 'dist/.nojekyll' },
  { src: 'public/.well-known/assetlinks.json', dest: 'dist/.well-known/assetlinks.json' }
];

filesToCopy.forEach(({ src, dest }) => {
  const srcPath = path.join(__dirname, '..', src);
  const destPath = path.join(__dirname, '..', dest);

  if (fs.existsSync(srcPath)) {
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copied ${src} to ${dest}`);
  }
});
```

### Schritt 4: .nojekyll erstellen

```bash
touch public/.nojekyll
```

Ohne diese Datei ignoriert GitHub Pages das `.well-known` Verzeichnis!

### Schritt 5: Deployen

```bash
npm run deploy
```

### Schritt 6: SHA-256 Fingerabdruck holen

1. Gehe zur [Google Play Console](https://play.google.com/console/)
2. Wähle deine App
3. **Setup → App-Integrität → App signing key certificate**
4. Kopiere den **SHA-256 Zertifikatfingerabdruck**
5. **BEHALTE die Doppelpunkte!** Format: `C9:B7:5C:A8:...`
6. Trage ihn in `assetlinks.json` ein
7. Deploye erneut: `npm run deploy`

### Schritt 7: Neue App-Version bauen

```bash
# Version hochzählen in app.json
{
  "version": "1.0.1",
  "android": {
    "versionCode": 2
  }
}

# Build erstellen
npx eas-cli build --platform android

# Im Play Store hochladen
```

---

## 🔧 Setup für TWA Apps (Android Studio)

### Schritt 1: AndroidManifest.xml anpassen

**Android/app/src/main/AndroidManifest.xml:**
```xml
<activity
    android:name="com.google.androidbrowserhelper.trusted.LauncherActivity"
    android:exported="true">

    <!-- Deep Link Intent Filter -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="https"
            android:host="yourdomain.github.io"
            android:pathPrefix="/YourApp" />
    </intent-filter>

    <!-- App Launch Intent -->
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

**Wichtig:** `android:autoVerify="true"` aktiviert die automatische Domain-Verifizierung!

### Schritt 2-6: Wie bei Expo Apps

Die Schritte für assetlinks.json, .nojekyll, Deployment und SHA-256 sind identisch.

### Schritt 7: Neue TWA-Version bauen

```bash
cd Android

# Version hochzählen in build.gradle
versionCode 2
versionName "1.0.1"

# Build erstellen
./gradlew clean bundleRelease

# Im Play Store hochladen
```

---

## 🧪 Testen

### Vor dem Upload (lokal):

```bash
# assetlinks.json validieren
curl -I https://yourdomain.github.io/.well-known/assetlinks.json

# Erwartetes Ergebnis:
# HTTP/2 200
# content-type: application/json
```

### Nach dem Upload (Play Store):

1. **Play Console öffnen**
2. **Setup → Deep Links**
3. Prüfe den Status:
   - ✅ **Verifiziert** - Alles okay!
   - ⚠️ **Ausstehend** - Warte 24h
   - ❌ **Fehlgeschlagen** - Prüfe assetlinks.json

### Auf dem Gerät testen:

```bash
# Deep Link über adb testen
adb shell am start -W -a android.intent.action.VIEW \
  -d "https://yourdomain.github.io/YourApp" \
  com.yourcompany.yourapp
```

**Erwartetes Verhalten:**
- App öffnet sich direkt (kein Browser-Auswahl-Dialog)

---

## 🚨 Häufige Fehler

### ❌ "Prüfung auf JSON-Inhaltstyp fehlgeschlagen"

**Problem:** GitHub Pages liefert falschen Content-Type

**Lösung:** `.nojekyll` Datei erstellen:
```bash
touch public/.nojekyll
```

### ❌ "assetlinks.json nicht gefunden"

**Problem:** `.well-known` Verzeichnis wurde nicht deployed

**Checkliste:**
1. `.nojekyll` existiert?
2. Build-Skript kopiert `.well-known`?
3. `--dotfiles` Flag beim gh-pages Deploy?

```json
{
  "scripts": {
    "deploy:gh-pages": "gh-pages -d dist -t --dotfiles"
  }
}
```

### ❌ "SHA-256 Fingerabdruck stimmt nicht überein"

**Problem:** Falscher oder alter Fingerabdruck in assetlinks.json

**Lösung:**
1. Aktuellen Fingerabdruck aus Play Console holen
2. **MIT Doppelpunkten** eintragen (Format: `C9:B7:5C:A8:...`)
3. Neu deployen

### ❌ "Intent-Filter werden ignoriert"

**Problem:** App wurde nicht neu gebaut oder hochgeladen

**Lösung:**
1. `versionCode` erhöhen
2. Neu bauen
3. Im Play Store hochladen
4. Warten bis Review abgeschlossen

---

## 📊 Beispiel-Projekte

### EnergyPriceGermany (Expo)
- **URL:** https://s540d.github.io/Energy_Price_Germany/
- **Package:** com.sven4321.energypricegermany
- **assetlinks.json:** [Link](https://s540d.github.io/Energy_Price_Germany/.well-known/assetlinks.json)

### 1x1_Trainer (Expo)
- **URL:** https://s540d.github.io/1x1_Trainer/
- **Package:** com.sven4321.trainer1x1
- **assetlinks.json:** [Link](https://s540d.github.io/1x1_Trainer/.well-known/assetlinks.json)

### Eisenhauer (TWA)
- **URL:** https://s540d.github.io/Eisenhauer/
- **Package:** com.sven4321.eisenhauer
- **assetlinks.json:** [Link](https://s540d.github.io/Eisenhauer/.well-known/assetlinks.json)

---

## 📚 Ressourcen

- [Android App Links Guide](https://developer.android.com/training/app-links)
- [Digital Asset Links](https://developer.android.com/training/app-links/verify-android-applinks)
- [Expo Intent Filters](https://docs.expo.dev/guides/linking/#android-app-links)
- [TWA Deep Links](https://developer.chrome.com/docs/android/trusted-web-activity/)

---

**Erstellt:** 2025-11-14
**Getestet mit:** Android 12-14, Expo SDK 54, TWA 2.5.0
