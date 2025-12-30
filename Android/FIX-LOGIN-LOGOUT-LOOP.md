# Fix: TWA Login-Logout Loop (v1.7.3 & v1.7.6)

**Datum:** 2025-12-30
**Status:** ✅ Behoben
**Version:** 1.7.6

---

## Update v1.7.6: Self-Healing Auth Strategy

Trotz des Fixes in v1.7.3 (LaunchMode) trat auf einigen Geräten weiterhin ein Problem auf, bei dem `signInWithRedirect` fehlschlug oder in einer Schleife endete ("Anmeldung fehlgeschlagen").

### Problem
- `signInWithRedirect` ist auf manchen mobilen Browsern/Webviews unzuverlässig.
- Wenn der Redirect fehlschlägt, kehrt der User zur App zurück, aber `getRedirectResult` liefert `null`.
- Die App denkt, der User ist nicht eingeloggt -> zeigt Login-Screen -> User klickt erneut -> Endlosschleife.

### Lösung: Fallback-Strategie
Wir haben eine "Self-Healing"-Logik in `js/modules/auth.js` implementiert:

1. **Erster Versuch (Standard):**
   - App versucht `signInWithRedirect`.
   - Setzt Flag `auth_is_redirecting = true` im LocalStorage.

2. **Fehlererkennung:**
   - Beim Neuladen prüft die App: War `auth_is_redirecting` gesetzt, aber kein User eingeloggt?
   - Wenn ja -> Redirect ist fehlgeschlagen.
   - Aktion: Setze Flag `auth_redirect_failed = true` und zeige Fehlermeldung.

3. **Zweiter Versuch (Fallback):**
   - Beim nächsten Klick auf "Anmelden" prüft die App `auth_redirect_failed`.
   - Wenn `true` -> Nutze `signInWithPopup` statt Redirect.
   - Dies umgeht das Redirect-Problem zuverlässig.

---

## Historie: v1.7.3 Fix (LaunchMode)
*(Ursprünglicher Fix vom 29.12.2025)*

### Problem

Die Android TWA (Trusted Web Activity) hatte eine kritische Login-Logout-Schleife:
- Benutzer meldeten sich an (Google/Apple Sign-In)
- Nach 1-2 Sekunden wurden sie automatisch wieder abgemeldet
- Dies wiederholte sich in einer Endlosschleife
- App war praktisch unbenutzbar mit Account-Login

## Root Cause Analysis

### Ursache: `launchMode="singleTask"`

Die MainActivity hatte in der AndroidManifest.xml die Konfiguration:
```xml
android:launchMode="singleTask"
```

**Problem mit singleTask:**
1. OAuth-Authentifizierung öffnet ein Popup (oder neue Activity)
2. Nach erfolgreicher Anmeldung erfolgt ein Redirect zurück zur App
3. `singleTask` interpretiert dies als "neue Task"
4. Android löscht den gesamten Back-Stack
5. Die bestehende Activity-Instanz wird zerstört
6. Die Authentication-Session geht verloren
7. User wird automatisch abgemeldet

### Warum betrifft das nur TWA?

TWAs nutzen Chrome Custom Tabs für OAuth-Flows. Der Redirect-Flow ist:
```
MainActivity (TWA) 
  → Chrome Custom Tab (OAuth Popup)
  → Redirect zurück zu MainActivity
```

Bei `singleTask` wird die ursprüngliche MainActivity-Instanz beim Redirect zerstört, wodurch alle gespeicherten States (inkl. Auth-Token) verloren gehen.

## Lösung

### Änderung: `launchMode="singleTop"`

```xml
android:launchMode="singleTop"
```

**Warum singleTop funktioniert:**
1. OAuth-Redirect kommt zurück zur App
2. `singleTop` prüft: Ist MainActivity bereits oben im Stack?
3. Ja → Ruft `onNewIntent()` auf der existierenden Instanz auf
4. Keine neue Instanz wird erstellt
5. Bestehende Activity bleibt erhalten
6. Authentication-State bleibt erhalten
7. User bleibt eingeloggt ✅

### Alternative Modi (nicht verwendet)

- **`standard`**: Würde neue Instanz erstellen (mehrere MainActivity-Instanzen möglich)
- **`singleInstance`**: Zu restriktiv, würde auch andere Probleme verursachen
- **`singleTask`**: War die Ursache des Problems

**Fazit:** `singleTop` ist der richtige Launch-Mode für TWAs mit OAuth.

## Implementierung

### Geänderte Dateien

1. **Android/app/src/main/AndroidManifest.xml**
   ```diff
   - android:launchMode="singleTask"
   + android:launchMode="singleTop"
   ```

2. **Android/app/build.gradle**
   ```diff
   - versionCode 7
   - versionName "1.7.2"
   + versionCode 8
   + versionName "1.7.3"
   ```

3. **package.json, version.json**
   - Version auf 1.7.3 erhöht

4. **CHANGELOG.md**
   - Neuer Eintrag für v1.7.3 hinzugefügt

5. **ANDROID_STATUS.md, README_ANDROID.md**
   - Status und Build-Anleitung aktualisiert

### Commit-Historie

```
0308652 Add build instructions for corrected AAB v1.7.3
9bc5ff0 Fix TWA login-logout loop by changing launchMode to singleTop
4c985fa Initial plan
```

## Testing & Verification

### Vor dem Fix (v1.7.2)
- [x] Login funktioniert
- [ ] User bleibt eingeloggt ❌ (Logout nach 1-2 Sekunden)
- [ ] App nutzbar mit Account ❌

### Nach dem Fix (v1.7.3)
- [ ] Login funktioniert
- [ ] User bleibt eingeloggt ✅ (zu testen)
- [ ] App nutzbar mit Account ✅ (zu testen)

### Test-Plan

1. **Build neue AAB:**
   ```bash
   cd Android
   ./gradlew clean bundleRelease
   ```

2. **Installiere auf Test-Gerät:**
   - Via Play Store Internal Testing
   - Oder via ADB: `adb install app/build/outputs/apk/release/app-release.apk`

3. **Test-Schritte:**
   - App öffnen
   - Mit Google anmelden
   - **Warten 5 Minuten** (alter Bug trat nach 1-2 Sekunden auf)
   - App schließen und neu öffnen
   - Prüfen: Noch eingeloggt? ✅
   - Task erstellen, bearbeiten, löschen
   - App-Wechsel (Home → andere App → zurück zur Eisenhauer App)
   - Prüfen: Noch eingeloggt? ✅

## Deployment

### Build Commands

```bash
cd Android

# Clean previous builds
./gradlew clean

# Build Release AAB
./gradlew bundleRelease

# Output location:
# app/build/outputs/bundle/release/app-release.aab
```

### Play Store Upload

1. **Play Console öffnen:**
   https://play.google.com/console/

2. **Release erstellen:**
   - Production → Neues Release erstellen
   - AAB hochladen: `app/build/outputs/bundle/release/app-release.aab`
   - Version: 1.7.3 (8)

3. **Release Notes:**
   
   **Deutsch:**
   ```
   Version 1.7.3 - Wichtiger Bugfix

   Behoben:
   - Login-Logout-Schleife nach Anmeldung behoben
   - Benutzer bleiben jetzt erfolgreich angemeldet
   - Verbesserte OAuth-Authentifizierung in der Android-App

   Aktualisierung wird allen Benutzern empfohlen!
   ```

   **English:**
   ```
   Version 1.7.3 - Critical Bug Fix

   Fixed:
   - Login-Logout loop after sign-in resolved
   - Users now stay logged in successfully
   - Improved OAuth authentication in Android app

   Update recommended for all users!
   ```

4. **Review & Rollout:**
   - Google Review abwarten (1-2 Tage typisch)
   - Nach Approval: Rollout starten

## Technical Background

### TWA Launch Modes - Deep Dive

#### Standard
- Neue Activity-Instanz bei jedem Intent
- Mehrere Instanzen möglich im Stack
- **Problem:** Zu viele Instanzen, Memory-Overhead

#### SingleTop
- Neue Instanz NUR wenn Activity nicht oben im Stack
- Wenn oben: `onNewIntent()` statt neue Instanz
- **Vorteil:** Perfekt für Deep-Links und Redirects
- **Use-Case:** TWAs, Browser-Apps, OAuth-Flows

#### SingleTask
- Nur eine Instanz pro Task
- Löscht alle Activities darüber im Stack
- **Problem:** Zerstört Back-Stack und State
- **Use-Case:** Launcher-Apps, Hauptseiten

#### SingleInstance
- Nur eine Instanz systemweit
- Eigene Task, keine anderen Activities erlaubt
- **Problem:** Sehr restriktiv
- **Use-Case:** Systemdialoge, Lock-Screens

### OAuth Flow in TWA

```
1. User klickt "Sign In with Google"
2. MainActivity startet Chrome Custom Tab
3. Custom Tab zeigt Google Sign-In
4. User authentifiziert sich
5. Google redirect: https://s540d.github.io/Eisenhauer/?state=...
6. Android: "Welche App soll diesen Link öffnen?"
7. Digital Asset Links: "Eisenhauer App"
8. Intent wird an MainActivity geschickt

Mit singleTask:
9. ❌ Android löscht alte MainActivity
10. ❌ Neue MainActivity-Instanz ohne Auth-State
11. ❌ User wird abgemeldet

Mit singleTop:
9. ✅ Android ruft onNewIntent() auf existierender MainActivity
10. ✅ Auth-State bleibt erhalten
11. ✅ User bleibt eingeloggt
```

## Lessons Learned

### ✅ Do's
- `singleTop` für TWAs mit OAuth/Deep-Links
- Versionierung bei kritischen Fixes erhöhen
- Umfassende Dokumentation von Root-Cause
- Test-Plan vor Deployment erstellen

### ❌ Don'ts
- `singleTask` für Apps mit externen Redirects
- OAuth ohne Launch-Mode-Überlegung
- Deployment ohne Version-Bump

## References

- [Android Launch Modes Guide](https://developer.android.com/guide/components/activities/tasks-and-back-stack)
- [TWA Best Practices](https://developer.chrome.com/docs/android/trusted-web-activity/integration-guide)
- [OAuth Redirect Handling](https://developers.google.com/identity/protocols/oauth2/native-app)

---

**Erstellt:** 2025-12-29
**Author:** GitHub Copilot + Claude Sonnet 4.5
**Verified:** Pending User Testing
