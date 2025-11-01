# Eisenhauer - Google Play Store Release Checklist

**Status:** Technisch production ready - PWA ist Basis
**Timeline:** 6 Wochen bis Registrierung
**Type:** PWA → Android (Trusted Web Activity via Bubblewrap)
**Package:** com.sven4321.eisenhauer

---

## 📅 6-Wochen Implementation Plan

### Woche 1: TWA Setup & Signing (Tage 1-7)

#### Tag 1-2: Bubblewrap Installation & Vorbereitung

**Installation:**
```bash
# Install Bubblewrap CLI
npm install -g @bubblewrap/cli

# Verify installation
bubblewrap help
```

**PWA Validation:**
- [ ] Eisenhauer PWA ist produktiv online (HTTPS)
- [ ] manifest.json existiert & ist gültig
- [ ] manifest.json hat alle Required Fields:
  - [ ] name
  - [ ] short_name
  - [ ] start_url
  - [ ] icons (mindestens 192x192 & 512x512)
  - [ ] display: standalone
  - [ ] theme_color
  - [ ] background_color
  - [ ] scope
- [ ] Service Worker installiert & funktioniert
- [ ] App ist Offline-fähig (Service Worker caching)
- [ ] HTTPS überall (kein Mixed Content)
- [ ] Icons sind PNG (nicht JPEG)

**Beispiel manifest.json Check:**
```bash
# Oder manuell überprüfen:
# https://your-eisenhauer-domain/manifest.json
```

#### Tag 3-4: Android Signing Certificate Setup

**Keystore generieren (falls neu):**
```bash
keytool -genkey -v -keystore ~/eisenhauer-key.keystore \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias eisenhauer-release \
  -keypass YOUR_PASSWORD \
  -storepass YOUR_PASSWORD
```

**Falls existierender Keystore:**
- [ ] Überprüfe ob Datei existiert
- [ ] Überprüfe ob Password bekannt
- [ ] Überprüfe ob noch gültig

**SHA-256 Fingerprint berechnen:**
```bash
keytool -list -v -keystore ~/eisenhauer-key.keystore \
  -alias eisenhauer-release \
  -storepass YOUR_PASSWORD
```

**Output Beispiel:**
```
SHA256: A8:A4:28:53:89:4F:40:05:B5:78:89:5E:9E:C8:74:E9...
```

- [ ] Notiere SHA-256 Fingerprint (wird für assetlinks.json benötigt)
- [ ] **WICHTIG:** Keystore sicher speichern (nicht in Git!)
- [ ] **WICHTIG:** Password merken (wird für Build benötigt)

#### Tag 5-7: assetlinks.json Setup

**Was ist assetlinks.json?**
- Verlinkt PWA mit Android App für "seamless" Integration
- Erlaubt Deep Linking zwischen Web & App
- Erforderlich für volle TWA Features

**Datei erstellen:**

Erstelle Datei: `public/.well-known/assetlinks.json`

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.sven4321.eisenhauer",
      "sha256_cert_fingerprints": [
        "A8:A4:28:53:89:4F:40:05:B5:78:89:5E:9E:C8:74:E9:03:E4:C9:31:F5:B3:20:32:CF:08:A2:98:C9:08:0B:88"
      ]
    }
  }
]
```

**Hinweis:** Ersetze SHA256 mit deiner eigenen!

**Verify Setup:**
- [ ] Datei liegt unter `public/.well-known/assetlinks.json`
- [ ] URL ist erreichbar: `https://eisenhauer-domain.com/.well-known/assetlinks.json`
- [ ] Response ist valid JSON
- [ ] Keine Redirects (direkt 200 OK)

**Test mit Google Tool:**
- https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://eisenhauer-domain.com

---

### Woche 2: Bubblewrap APK Generation (Tage 8-14)

#### Tag 8-9: Bubblewrap Projekt initiieren

```bash
# Im Projekt Verzeichnis:
bubblewrap init --manifest https://eisenhauer.de/manifest.json

# Beantworte Fragen:
# - Package name: com.sven4321.eisenhauer
# - App name: Eisenhauer Matrix
# - Display mode: standalone
# - Theme color: [dein color]
# - Background color: [dein color]
# - Start URL: https://eisenhauer.de/
```

**Überprüfe generierte bubblewrap.json:**
- [ ] packageId korrekt
- [ ] appName korrekt
- [ ] startUrl korrekt
- [ ] manifestUrl korrekt
- [ ] Alle Colors korrekt

#### Tag 10-11: APK Build

**Benötigte Info:**
- Keystore Path: ~/eisenhauer-key.keystore
- Keystore Password: [dein password]
- Key Alias: eisenhauer-release
- Key Password: [dein password]

**Build APK:**
```bash
bubblewrap build

# Follow prompts:
# - Keystore file path
# - Keystore password
# - Key alias
# - Key password

# Output: App-release.aab oder App-release.apk
```

**Überprüfe Build Output:**
- [ ] APK/AAB erstellt erfolgreich
- [ ] Dateisize angemessen (< 50MB ideal)
- [ ] Keine Fehler im Build Log

#### Tag 12-14: Lokales Testing

**Teste auf echtem Android Device:**

```bash
# APK auf Device installieren:
adb install App-release.apk

# Oder über Play Console später
```

**Test-Szenarien:**
- [ ] App startet ohne Crashes
- [ ] Alle Features funktionieren (matrix, modes, etc.)
- [ ] Navigation funktioniert
- [ ] Offline Mode funktioniert
- [ ] Dark Mode funktioniert
- [ ] Deep Linking funktioniert
- [ ] Settings funktioniert
- [ ] Coffee Link funktioniert
- [ ] Responsive Design OK
- [ ] Touch Targets OK

**Test auf mehreren Devices:**
- [ ] Android 8.0+ (mittleres Level)
- [ ] Android 12+ (modernes Level)

---

### Woche 3-4: Store Listing Vorbereitung (Tage 15-28)

#### Store Listing Assets & Text

**Text Elemente:**
- [ ] **App Name:** "Eisenhauer Matrix" (< 50 Zeichen)
- [ ] **Short Description** (< 80 Zeichen)
  - Beispiel: "Prioritätsmatrix für Aufgabenmanagement"
- [ ] **Full Description** (< 4000 Zeichen)
  - Was ist die App
  - Features: Matrix, Kategorien, Offline, etc.
  - Use Cases
  - No technical jargon
  - Include: Offline-Fähigkeit ist KEY Feature

**Content:**
- [ ] **Screenshots** - mindestens 5-8 Stück
  - Format: 1080x1920px
  - Zeige verschiedene Features:
    - Hauptmatrix
    - Category Management
    - Settings
    - Dark Mode
  - Hochwertige Bilder (nicht einfache Screenshots)
- [ ] **Feature Graphic** (1024x500px)
  - Design: "Eisenhauer Matrix - Organize Your Tasks"
  - Attraktives Design
- [ ] **App Icon** (512x512px PNG)
  - Kein transparenter Saum
  - Scharf & klar
- [ ] **Alle Assets:** PNG oder JPEG, richtige Größen

---

### Woche 5: Final Testing & Compliance (Tage 29-35)

#### Compliance Vorbereitung

**Privacy Policy**
- [ ] Existiert & ist online (HTTPS)
- [ ] Deutsch &/oder Englisch
- [ ] Abdeckt:
  - Datensammlung (Minimal - lokal)
  - Nutzung
  - Dritte Parteien
  - User Rights
  - GDPR Compliance
  - Kontakt

**Data Safety Form (wird in Play Console ausgefüllt)**
- [ ] Datentypen: Wahrscheinlich KEINE (lokale App)
- [ ] Sicherheit: Service Worker + HTTPS
- [ ] Ads: NEIN
- [ ] In-App Purchases: NEIN

**Content Rating**
- [ ] Play Console Questionnaire ausfüllen
- [ ] Wahrscheinlich Rating: Everyone (3+)

#### Finales Testing

**Functional Testing:**
- [ ] Matrix funktioniert vollständig
- [ ] Tasks können erstellt/gelöscht werden
- [ ] Categories funktionieren
- [ ] Offline Modus speichert Daten
- [ ] Settings funktionieren
- [ ] Coffee Link funktioniert

**Non-Functional Testing:**
- [ ] Performance: Lighthouse >= 80
- [ ] Accessibility: TalkBack, Touch Targets, Contrast
- [ ] Responsiveness: Portrait, Landscape, Tablet
- [ ] Memory: Keine Leaks
- [ ] Battery: Akzeptabel
- [ ] Data Usage: OK

---

### Woche 6: Play Console Registration & Launch (Tage 36-42)

#### Tag 36-37: Play Console Setup

**Falls nicht vorhanden:**
- [ ] Google Play Developer Account erstellen
- [ ] Developer Agreement akzeptieren
- [ ] $25 USD Zahlungsmethode hinterlegen
- [ ] Neues App-Projekt erstellen

**App Informationen eingeben:**
1. Go to Play Console → Create new app
2. Gib ein:
   - App Name: Eisenhauer Matrix
   - Default Language: Deutsch (oder English)
   - App/Game: App
   - Category: Productivity
3. Aktualisiere alle Store Listing Felder

#### Tag 38-39: Store Listing Finalisieren

**All Text Fields:**
- [ ] App Name (50 Zeichen)
- [ ] Short Description (80 Zeichen)
- [ ] Full Description (4000 Zeichen)
- [ ] Release Notes (für erste Version)

**Graphics Upload:**
- [ ] Screenshots (min. 2, max. 8)
- [ ] Feature Graphic
- [ ] Icon
- [ ] Überprüfe Vorschau

**Legal & Privacy:**
- [ ] Privacy Policy URL
- [ ] Support Email
- [ ] Data Safety Form vollständig
- [ ] Content Rating eingereicht

#### Tag 40: APK/AAB Upload

**APK/AAB hochladen zu Play Console:**
1. Go to Release → Production
2. Click Create new release
3. Upload APK/AAB (von Bubblewrap generiert)
4. Überprüfe:
   - [ ] Version Code korrekt
   - [ ] Version Name korrekt
   - [ ] Release Notes eingeben
5. Click Review & Roll Out

**Pre-Launch Report:**
- Warte auf Google Pre-Launch Report (24-48h)
- Überprüfe auf Fehler
- Falls OK: Proceed to Launch

#### Tag 41-42: Launch!

**Rollout-Strategie:**
- [ ] Start mit 50% Rollout
- [ ] Monitor 24-48h für:
  - Crash Reports
  - User Ratings
  - Install Count
- [ ] Falls alles OK: Rollout auf 100%
- [ ] Falls Issues: Schnell beheben & re-upload

---

## 📋 Kritische Punkte für Eisenhauer-specific

### PWA zu APK
- [ ] Service Worker funktioniert im Browser → **muss auch in APK funktionieren**
- [ ] Offline Funktionalität ist KEY Feature → **gründlich testen**
- [ ] Deep Linking → **assetlinks.json ist kritisch**
- [ ] Manifest Icons → **müssen alle Größen vorhanden sein**

### Data Handling
- [ ] Lokale Daten nur im Browser Storage
- [ ] Keine Cloud Sync (falls nicht geplant)
- [ ] Privacy Policy muss klar sein: "Keine Datenübertragung"
- [ ] Data Safety Form: Ehrlich angeben (wahrscheinlich Keine Daten gesammelt)

### Compliance (wichtig für Deutschland)
- [ ] GDPR Compliance (EU Daten)
- [ ] AGB vorhanden?
- [ ] Impressum vorhanden?
- [ ] Deutsche Texte grammatikalisch korrekt

---

## 🔍 Troubleshooting Häufige Probleme

### Problem: assetlinks.json wird nicht gefunden
**Lösung:**
- [ ] Überprüfe Datei-Pfad: `public/.well-known/assetlinks.json`
- [ ] Überprüfe HTTPS auf Domain (kein HTTP)
- [ ] Überprüfe JSON Syntax (online JSON validator)
- [ ] Test mit Google Tool (siehe oben)

### Problem: APK startet aber zeigt weiße Seite
**Lösung:**
- [ ] Überprüfe Start URL in Bubblewrap
- [ ] Überprüfe Manifest Start URL
- [ ] Überprüfe Service Worker ist registriert
- [ ] Test im Chrome Browser zuerst (sollte funktionieren)
- [ ] Check Browser Console für Fehler (DevTools)

### Problem: Offline Mode funktioniert nicht
**Lösung:**
- [ ] Überprüfe Service Worker Cache (caching strategy)
- [ ] Teste lokal mit DevTools (offline mode)
- [ ] Stelle sicher alle Assets werden gecacht
- [ ] Check Service Worker Registrierung (manifest.json)

### Problem: Pre-Launch Report zeigt Crashes
**Lösung:**
- [ ] Download Crash Logs aus Pre-Launch Report
- [ ] Debugge lokal (Chrome DevTools)
- [ ] Überprüfe auf JavaScript Fehler
- [ ] Überprüfe auf fehlende Assets/Resources
- [ ] Fix → Neuer Build → Re-upload

---

## ✅ Final Checklist vor Launch

- [ ] Woche 1: Bubblewrap & Signing Setup OK
- [ ] Woche 2: APK erfolgreich generiert & lokal getestet
- [ ] Woche 3-4: Store Listing vollständig & hochwertig
- [ ] Woche 5: Compliance & Testing OK
- [ ] Woche 6: Play Console Setup & Launch erfolgreich

**Ready for Google Play Store! 🚀**

---

**Referenzen:**
- [GOOGLE_PLAY_STORE_ROADMAP.md](../../project-templates/GOOGLE_PLAY_STORE_ROADMAP.md)
- [Bubblewrap Documentation](https://github.com/GoogleChromeLabs/bubblewrap)
- [Android Publishing Guide](https://developer.android.com/studio/publish)
- [Trusted Web Activity Documentation](https://developer.chrome.com/docs/android/trusted-web-activity/)
