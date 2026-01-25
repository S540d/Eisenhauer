# Android Splash Screen Verbesserung

## Problem
Beim Start der App auf langsamen Geräten wurde eine einfache blaue Seite mit einem kleinen App-Symbol angezeigt. Dies sah unprofessionell aus und bot keine gute Nutzererfahrung.

## Lösung
Es wurde ein verbesserter Splash Screen implementiert mit:

### 1. Gradient-Hintergrund
- Anstatt eines einfachen blauen Hintergrunds wird jetzt ein eleganter Farbverlauf verwendet
- Der Gradient geht von `#667eea` (Primary Color) über `#764ba2` (lila) und zurück zu `#667eea`
- 135° Winkel für einen diagonalen, modernen Look

### 2. Größeres, zentriertes Logo
- Das App-Icon wird jetzt in 192dp × 192dp Größe angezeigt (statt klein)
- Perfekt zentriert auf dem Bildschirm
- Deutlich bessere Sichtbarkeit und professionelleres Erscheinungsbild

### 3. Sanftere Übergangsanimation
- Fade-out Dauer von 300ms auf 500ms erhöht
- Flüssigerer Übergang vom Splash Screen zur App

## Technische Details

### Neue Dateien
- `Android/app/src/main/res/drawable/splash_background.xml`
  - Layer-List Drawable mit Gradient-Hintergrund und zentriertem Logo
  - Verwendet `@mipmap/ic_launcher` als Icon-Quelle

### Geänderte Dateien
- `Android/app/src/main/AndroidManifest.xml`
  - `SPLASH_IMAGE_DRAWABLE` von `@mipmap/ic_launcher` zu `@drawable/splash_background` geändert
  - `SPLASH_SCREEN_FADE_OUT_DURATION` von 300ms auf 500ms erhöht

## Vorteile
1. ✅ **Professionelleres Erscheinungsbild** - Gradient-Design statt einfarbiger Fläche
2. ✅ **Bessere Sichtbarkeit** - Größeres Logo (192dp statt kleiner Icon)
3. ✅ **Moderne Optik** - Diagonaler Farbverlauf wirkt modern und ansprechend
4. ✅ **Sanftere Animation** - Längere Fade-out Dauer für flüssigeren Übergang
5. ✅ **Konsistenz** - Verwendet die gleichen Farben wie die App (Primary Color)

## Kompatibilität
- Funktioniert mit allen Android-Versionen ab API Level 21 (Android 5.0 Lollipop)
- Kompatibel mit TWA (Trusted Web Activity) Implementierung
- Keine zusätzlichen Abhängigkeiten erforderlich

## Weitere Verbesserungsmöglichkeiten (optional)
Falls gewünscht, könnte man zusätzlich:
- Animiertes Logo-Icon hinzufügen
- App-Name als Text unter dem Logo einfügen
- Lottie Animation für animiertes Splash Screen verwenden
- Weitere Bildschirmgrößen-spezifische Layouts erstellen
