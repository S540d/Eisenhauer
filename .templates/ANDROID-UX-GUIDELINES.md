# Android UX Guidelines - Edge-to-Edge Best Practices

## 📅 Letzte Aktualisierung
7. November 2025 - Version 1.0.4 Implementation

## 🎯 Überblick

Dieses Dokument definiert die UX-Standards und Best Practices für alle Android-Projekte, insbesondere für die Edge-to-Edge Display-Implementierung gemäß Android 15+ Anforderungen.

---

## 🔧 Edge-to-Edge Implementation (Android 15+)

### Anforderungen

Ab Android 15 (SDK 35+) werden Apps **standardmäßig randlos angezeigt**. Alle Apps, die auf SDK 35+ ausgerichtet sind, **müssen** Edge-to-Edge kompatibel sein.

### Kritische Komponenten

#### 1. MainActivity.kt - Edge-to-Edge Aktivierung

**Location:** `app/src/main/java/[package]/MainActivity.kt`

**EMPFOHLENE METHODE (v1.0.4+):**

```kotlin
import androidx.activity.enableEdgeToEdge

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Enable BEFORE super.onCreate() for Android 15+ compatibility
        // This provides automatic backward compatibility (~100 lines of code)
        enableEdgeToEdge()

        super.onCreate(savedInstanceState)

        // ... rest of your code
    }
}
```

**ALTERNATIVE (Manuell - v1.0.3 und früher):**

```kotlin
import androidx.core.view.WindowCompat

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Manual edge-to-edge setup
        WindowCompat.setDecorFitsSystemWindows(window, false)

        // ... rest of your code
    }
}
```

**Wichtig:**
- ✅ **EMPFOHLEN:** `androidx.activity.enableEdgeToEdge()` (automatisch, beste Kompatibilität)
- ✅ **Alternative:** `WindowCompat.setDecorFitsSystemWindows(window, false)` (manuell)
- ❌ **NICHT verwenden:** `FLAG_LAYOUT_NO_LIMITS` (deprecated)
- ❌ **NICHT verwenden:** `window.setStatusBarColor()` (deprecated in Android 15)
- ❌ **NICHT verwenden:** `window.setNavigationBarColor()` (deprecated in Android 15)

**Vorteile von enableEdgeToEdge():**
- ✅ ~100 Zeilen Code gekapselt
- ✅ Automatische Rückwärtskompatibilität
- ✅ Korrekte System Bar Icon-Farben bei Theme-Wechsel
- ✅ Display Cutout Handling
- ✅ 3-Button Navigation Scrim

---

#### 2. themes.xml - Transparente System Bars

**Location:** `app/src/main/res/values/themes.xml`

```xml
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Base.Theme.YourApp" parent="Theme.Material3.DayNight.NoActionBar">

        <!-- Edge-to-Edge configuration for Android 15+ -->
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>
        <item name="android:windowLightStatusBar">true</item>
        <item name="android:windowLightNavigationBar">true</item>
        <item name="android:enforceNavigationBarContrast" tools:targetApi="q">false</item>
        <item name="android:enforceStatusBarContrast" tools:targetApi="q">false</item>
    </style>

    <style name="Theme.YourApp" parent="Base.Theme.YourApp" />
</resources>
```

**Location:** `app/src/main/res/values-night/themes.xml`

```xml
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Base.Theme.YourApp" parent="Theme.Material3.DayNight.NoActionBar">

        <!-- Edge-to-Edge configuration for Android 15+ (Dark Mode) -->
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>
        <item name="android:windowLightStatusBar">false</item>
        <item name="android:windowLightNavigationBar">false</item>
        <item name="android:enforceNavigationBarContrast" tools:targetApi="q">false</item>
        <item name="android:enforceStatusBarContrast" tools:targetApi="q">false</item>
    </style>
</resources>
```

**Wichtige Theme-Eigenschaften:**
- `statusBarColor`: Transparent für Edge-to-Edge
- `navigationBarColor`: Transparent für Edge-to-Edge
- `windowLightStatusBar`: `true` für Light Mode, `false` für Dark Mode
- `windowLightNavigationBar`: `true` für Light Mode, `false` für Dark Mode
- `enforceNavigationBarContrast`: `false` (bessere Kontrolle über Appearance)
- `enforceStatusBarContrast`: `false` (bessere Kontrolle über Appearance)

---

#### 3. build.gradle.kts - Dependencies & SDK

**Location:** `app/build.gradle.kts`

```kotlin
android {
    namespace = "com.yourcompany.yourapp"
    compileSdk = 36  // Android 15+

    defaultConfig {
        applicationId = "com.yourcompany.yourapp"
        minSdk = 21
        targetSdk = 36  // WICHTIG: Android 15+
        versionCode = 1
        versionName = "1.0.0"
    }
}

dependencies {
    // Material Components - Mindestens v1.13.0 für Edge-to-Edge Support
    implementation("com.google.android.material:material:1.13.0")

    // AndroidX Core - für WindowCompat
    implementation("androidx.core:core-ktx:1.17.0")

    // ... andere Dependencies
}
```

**Minimale Version-Anforderungen:**
- `compileSdk`: **36** (Android 15)
- `targetSdk`: **36** (Android 15)
- Material Components: **1.13.0+** (deprecated APIs entfernt)
- AndroidX Core: **1.17.0+**

---

#### 4. gradle/libs.versions.toml - Version Catalog

**Location:** `gradle/libs.versions.toml`

```toml
[versions]
agp = "8.13.0"
kotlin = "2.2.21"  # Neueste stabile Version
coreKtx = "1.17.0"
material = "1.13.0"  # Mindestens 1.13.0!

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
material = { group = "com.google.android.material", name = "material", version.ref = "material" }
```

---

#### 5. gradle.properties - Java Toolchain

**Location:** `gradle.properties`

```properties
# Kotlin 2.2.21 unterstützt Java 25 noch nicht
# Verwende Java 23 oder niedriger
org.gradle.java.home=/path/to/java-23
```

**Java Version Kompatibilität:**
- Kotlin 2.2.21: **Java 24** oder niedriger
- Kotlin 2.3.0+: **Java 25** Support

---

## ✅ Checkliste für neue Android-Projekte

### Build Configuration
- [ ] `compileSdk = 36`
- [ ] `targetSdk = 36`
- [ ] Material Components >= 1.13.0
- [ ] AndroidX Core >= 1.17.0
- [ ] Kotlin >= 2.2.21

### MainActivity
- [ ] `WindowCompat.setDecorFitsSystemWindows(window, false)` implementiert
- [ ] Keine deprecated `FLAG_LAYOUT_NO_LIMITS` Verwendung
- [ ] Import: `androidx.core.view.WindowCompat`

### Themes
- [ ] `android:statusBarColor` = transparent
- [ ] `android:navigationBarColor` = transparent
- [ ] `android:windowLightStatusBar` konfiguriert (Light/Dark Mode)
- [ ] `android:windowLightNavigationBar` konfiguriert (Light/Dark Mode)
- [ ] `enforceNavigationBarContrast` = false
- [ ] `enforceStatusBarContrast` = false
- [ ] Separate themes.xml für `-night` (Dark Mode)

### Testing
- [ ] Build erfolgreich ohne Warnungen
- [ ] Keine "Edge-to-Edge" Warnungen in Play Console
- [ ] Keine "deprecated API" Warnungen
- [ ] Test auf Android 15+ Gerät/Emulator

---

## 🚫 Deprecated APIs (NICHT verwenden)

### ❌ Window Manager Flags
```kotlin
// DEPRECATED - NICHT verwenden!
window.setFlags(
    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
)
```

### ❌ Window Color Setters
```kotlin
// DEPRECATED in Android 15 - NICHT verwenden!
window.statusBarColor = Color.TRANSPARENT
window.navigationBarColor = Color.TRANSPARENT
```

**Grund:** Diese APIs werden von Material Components intern verwendet und verursachen Warnungen in der Play Console.

---

## 🎨 Material Design 3 Best Practices

### Theme Parent
```xml
<!-- EMPFOHLEN -->
<style name="Base.Theme.YourApp" parent="Theme.Material3.DayNight.NoActionBar">

<!-- NICHT EMPFOHLEN (veraltete Material Design 2) -->
<style name="Base.Theme.YourApp" parent="Theme.MaterialComponents.DayNight.NoActionBar">
```

### NoActionBar vs. DarkActionBar
```xml
<!-- Für Edge-to-Edge: IMMER NoActionBar verwenden -->
<style parent="Theme.Material3.DayNight.NoActionBar">

<!-- NICHT mit Edge-to-Edge kompatibel -->
<style parent="Theme.Material3.DayNight.DarkActionBar">
```

---

## 📱 Responsive Design Considerations

### Window Insets Handling

Wenn du **eigene UI-Elemente** verwendest (nicht nur WebView/TWA), musst du Window Insets handhaben:

```kotlin
ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
    val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
    v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
    insets
}
```

**Für TWA/WebView Apps:** Nicht notwendig, da das WebView die Insets automatisch handhabt.

---

## 🔍 Google Play Console Warnungen

### Behobene Warnungen (mit dieser Implementation)

✅ "Die randlose Anzeige funktioniert möglicherweise nicht für alle Nutzer"
- **Gelöst durch:** Explizite Edge-to-Edge Aktivierung

✅ "Verwendung von deprecated APIs (setStatusBarColor, setNavigationBarColor)"
- **Gelöst durch:** Material Components 1.13.0 + Theme-basierte Konfiguration

---

## 📦 Release Checklist

### Vor jedem Release
- [ ] Build mit `./gradlew assembleRelease` erfolgreich
- [ ] Keine Compiler-Warnungen
- [ ] APK signiert
- [ ] Version Code erhöht
- [ ] Version Name aktualisiert
- [ ] Release Notes erstellt

### Play Console Upload
- [ ] Keine Pre-Launch Report Warnungen
- [ ] Edge-to-Edge Test erfolgreich
- [ ] Screenshots aktualisiert (falls UI-Änderungen)

---

## 🛠️ Troubleshooting

### Problem: Kotlin Compiler Error mit Java 25
```
IllegalArgumentException: 25
```

**Lösung:** Kotlin 2.2.21 unterstützt Java 25 noch nicht
```properties
# gradle.properties
org.gradle.java.home=/path/to/java-23
```

### Problem: Material Components deprecated API Warnung
```
setStatusBarColor is deprecated
```

**Lösung:** Material Components auf 1.13.0+ aktualisieren
```toml
# gradle/libs.versions.toml
material = "1.13.0"
```

### Problem: Status Bar Icons nicht sichtbar
```
Status bar icons are the same color as background
```

**Lösung:** `windowLightStatusBar` korrekt setzen
```xml
<!-- Light Mode -->
<item name="android:windowLightStatusBar">true</item>

<!-- Dark Mode -->
<item name="android:windowLightStatusBar">false</item>
```

---

## 📚 Referenzen

### Offizielle Dokumentation
- [Android Edge-to-Edge](https://developer.android.com/develop/ui/views/layout/edge-to-edge)
- [WindowCompat API](https://developer.android.com/reference/androidx/core/view/WindowCompat)
- [Material Design 3](https://m3.material.io/)
- [Android 15 Changes](https://developer.android.com/about/versions/15/behavior-changes-15)

### Blog Posts & Guides
- [Handling Edge-to-Edge in Compose](https://medium.com/androiddevelopers/windowinsets-listeners-to-layouts-8f9ccc8fa4d1)
- [Material 3 Migration Guide](https://developer.android.com/develop/ui/views/theming/material3-migration)

---

## 🔄 Version History

| Version | Datum | Änderungen |
|---------|-------|-----------|
| 1.0.0 | 7.11.2025 | Initial Release - Edge-to-Edge Guidelines |
| 1.0.1 | 7.11.2025 | Update: androidx.activity.enableEdgeToEdge() empfohlen |

---

## 📝 Anwendung dieser Guidelines

### Für neue Projekte
1. Diese Datei als Template verwenden
2. Verwende `androidx.activity.enableEdgeToEdge()` (empfohlen)
3. Alle Checklistenpunkte abarbeiten
4. Build testen
5. Play Console Warnungen prüfen

### Für bestehende Projekte
1. Schritt-für-Schritt diese Guidelines implementieren
2. Mit Material Components Update beginnen
3. MainActivity anpassen (`enableEdgeToEdge()` verwenden)
4. Themes aktualisieren
5. Ausgiebig testen

---

**Letzte Validierung:** 1x1 Trainer v1.0.4 (7. November 2025)

✅ Edge-to-Edge Warnung behoben (androidx.activity.enableEdgeToEdge)
✅ Build erfolgreich
✅ Edge-to-Edge funktioniert auf Android 15+
⚠️ Material Components deprecated API Warnung bleibt (Library-Problem - akzeptabel)
