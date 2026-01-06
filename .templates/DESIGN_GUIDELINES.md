# Design Guidelines - Support Links & Store Compliance

**Projekt-übergreifende Designvorgaben für alle S540d Apps**

## 📋 Hintergrund

Um vollständige Compliance mit App Store Richtlinien zu gewährleisten und eine konsistente User Experience über alle Projekte hinweg zu schaffen, gelten folgende Richtlinien:

## 🎯 Support-Link Platzierung

### ❌ NICHT erlaubt

**Footer-Button mit direktem Support-Link:**
```tsx
// FALSCH - zu prominent, könnte als Werbung interpretiert werden
<TouchableOpacity onPress={() => window.open('https://ko-fi.com/...')}>
  <Text>Support me</Text>
</TouchableOpacity>
```

**Warum nicht?**
- Google/Apple könnten dies als "In-App-Werbung" interpretieren
- Zu prominent platziert (immer sichtbar im Footer)
- Begriff "Support me" wirkt wie Monetarisierung
- Bei Play Store Submission könnte "Contains Ads" fälschlicherweise angekreuzt werden müssen

### ✅ EMPFOHLEN

**Settings/About-Menü Integration:**
```tsx
// RICHTIG - in Settings-Menü integriert
<TouchableOpacity onPress={() => setMenuVisible(true)}>
  <Text>⚙️ Settings</Text>
</TouchableOpacity>

// Im Settings-Menü:
<TouchableOpacity onPress={() => openExternalLink('https://ko-fi.com/...')}>
  <Text>💝 Support the Project</Text>
</TouchableOpacity>
```

**Warum besser?**
- Nicht als Werbung interpretierbar
- Professional und Standard-konform
- Vergleichbar mit GitHub Sponsors, Patreon in Open Source Apps
- Explizit freiwillig, nicht aufdringlich
- In separatem Kontext (About/Settings)

---

## 🎨 Standardisierte Implementierung

### Footer-Design

**Empfohlene Footer-Buttons:**
```tsx
<View style={styles.footer}>
  {/* Theme Toggle */}
  <TouchableOpacity onPress={toggleTheme}>
    <Text>🌓</Text>
  </TouchableOpacity>

  {/* Settings/Menu */}
  <TouchableOpacity onPress={() => setMenuVisible(true)}>
    <Text>⚙️</Text>
  </TouchableOpacity>
</View>
```

**Elemente, die im Footer bleiben können:**
- Theme Toggle (Hell/Dunkel)
- Settings/Menu Button
- Export-Funktionen
- App-spezifische Aktionen (z.B. "Neue Aufgabe", "Filter")

**Elemente, die NICHT in den Footer gehören:**
- ❌ Direkte Support-Links
- ❌ Social Media Links
- ❌ Externe Werbung
- ❌ Store-Ratings-Aufforderungen im Footer

---

### Settings/About-Menü Design

**Standardstruktur:**

```
⚙️ Settings / About

📊 App Settings
  ├─ 🌓 Theme (Light/Dark/Auto)
  ├─ 📱 Language
  └─ 🔔 Notifications (falls relevant)

ℹ️ About
  ├─ 📱 Version X.Y.Z
  ├─ 📜 Privacy Policy
  ├─ 📄 Open Source License (MIT)
  └─ 🔗 GitHub Repository

💝 Support
  ├─ 💝 Support the Project (Buy Me a Coffee)
  ├─ ⭐ Rate on [Play Store/App Store]
  └─ 🐛 Report a Bug (GitHub Issues)
```

**Text-Formulierung:**
- ✅ "Support the Project"
- ✅ "Support Development"
- ✅ "Buy Me a Coffee ☕"
- ❌ NICHT: "Support me" (zu persönlich)
- ❌ NICHT: "Donate" (klingt wie Charity)
- ❌ NICHT: "Premium" (klingt wie IAP)

---

## 🏪 Store Compliance

### Google Play Store

**"Contains Ads" Angabe:**
```
❌ NO - App enthält keine Werbung
```

**Data Safety Section:**
```
Ad SDK Usage: None
Third-party advertising: No
Personal data collected for advertising: No
```

**Begründung:**
- Support-Link im Settings-Menü = KEINE Werbung
- Keine Ad-SDKs (AdMob, Facebook Ads, etc.)
- Keine Tracking-Cookies für Monetarisierung
- Freiwillige Unterstützung ≠ Werbung

### Apple App Store

**"Contains Ads" Angabe:**
```
❌ NO - App enthält keine Werbung
```

**App Privacy:**
```
Data Not Collected
Third-Party Analytics: None
```

---

## 📱 Plattform-spezifische Implementierung

### Web (React Native Web)

```tsx
const openExternalLink = (url: string) => {
  if (Platform.OS === 'web') {
    window.open(url, '_blank');
  } else {
    Linking.openURL(url);
  }
};
```

### Android / iOS

```tsx
import { Linking, Platform } from 'react-native';

const openExternalLink = async (url: string) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    console.error(`Cannot open URL: ${url}`);
  }
};
```

---

## 🎯 Anwendungsbereiche

Diese Richtlinien gelten für alle folgenden Projekte:

- ✅ **Energy Price Germany**
- ✅ **1x1_matrix**
- ✅ **Eisenhauer** (Eisenhower Matrix)
- ✅ **Pflanzkalender**
- ✅ **CD_to_Spotify**
- ✅ Alle zukünftigen Projekte

---

## 🌍 Internationalisierung (i18n)

### Grundsatz: Kein hartcodierter Text

**REGEL: Alle sichtbaren Texte MÜSSEN über das Übersetzungssystem laufen.**

### ❌ NICHT erlaubt

```tsx
// FALSCH - hartcodierter Text
<Text>Settings</Text>
<Text>Open Source • MIT</Text>
<TouchableOpacity aria-label="Settings">
```

### ✅ EMPFOHLEN

```tsx
// RICHTIG - über translations-Objekt
<Text>{t.settings}</Text>
<Text>{t.appLicense}</Text>
<TouchableOpacity aria-label={t.settings}>
```

### Ausnahmen

Folgende Texte dürfen hartcodiert bleiben:
- ✅ **App-Name** (z.B. "Energy Price Germany") - wenn bewusst mehrsprachig
- ✅ **Technische Bezeichnungen** (z.B. "Energy Charts", "API", "GitHub")
- ✅ **Versionsnummern** (z.B. "1.2.0")
- ✅ **URLs und E-Mail-Adressen**
- ✅ **Emojis** (universell verständlich)

### Translations-Struktur

```tsx
const translations = {
  en: {
    settings: 'Settings',
    appLicense: 'Open Source • MIT',
    // ... weitere englische Texte
  },
  de: {
    settings: 'Einstellungen',
    appLicense: 'Open Source • MIT',
    // ... weitere deutsche Texte
  },
};
```

### Warum wichtig?

- 🌍 Mehrsprachigkeit out-of-the-box
- 🔧 Zentrale Verwaltung aller Texte
- 🐛 Keine vergessenen Übersetzungen
- 📱 Bessere User Experience für internationale Nutzer
- 🔍 Einfaches Auffinden und Ändern von Texten

---

## 🚀 Viralität & Growth Features

### Share-Button im Settings-Menü

**REGEL: Jede App sollte einen Share-Button im Settings-Menü haben.**

### ✅ Standardimplementierung

```tsx
import { Share, Platform } from 'react-native';

const shareApp = async () => {
  try {
    const appName = 'Energy Price Germany'; // App-spezifisch
    const benefit = 'Spare Geld mit Echtzeit-Strompreisen!'; // App-spezifisch
    const storeUrl = Platform.select({
      ios: 'https://apps.apple.com/app/...',
      android: 'https://play.google.com/store/apps/details?id=...',
      web: window.location.origin,
    });

    const result = await Share.share({
      message: `🚀 ${appName} - ${benefit}\n\n⬇️ Kostenloser Download:\n${storeUrl}?utm_source=share&utm_medium=app`,
      title: `Empfehlung: ${appName}`,
    });

    if (result.action === Share.sharedAction) {
      console.log('App shared successfully');
    }
  } catch (error) {
    console.error('Error sharing app:', error);
  }
};
```

### Settings-Menü Integration

```tsx
// Im Settings/About-Menü unter "SUPPORT" platzieren:

💝 Support
  ├─ 💝 Support the Project (Buy Me a Coffee)
  ├─ 📤 Share this App (NEU!)
  ├─ ⭐ Rate on Play Store
  └─ 🐛 Report a Bug
```

**Code-Beispiel:**

```tsx
<TouchableOpacity
  onPress={shareApp}
  style={styles.menuLink}
>
  <Text style={[styles.legendText, { color: colors.primary }]}>
    {t.shareApp}
  </Text>
</TouchableOpacity>
```

### Translations hinzufügen

```tsx
const translations = {
  en: {
    shareApp: 'Share this App',
    // ... weitere Texte
  },
  de: {
    shareApp: 'App teilen',
    // ... weitere Texte
  },
};
```

### App-spezifische Share-Texte

**Energy Price Germany:**
```
"🚀 Energy Price Germany - Spare Geld mit Echtzeit-Strompreisen!

⬇️ Kostenloser Download:
[Store-Link]?utm_source=share&utm_medium=app"
```

**1x1_Trainer:**
```
"🚀 1x1 Trainer - Spielerisch Mathe lernen!

⬇️ Kostenloser Download:
[Store-Link]?utm_source=share&utm_medium=app"
```

**Eisenhauer:**
```
"🚀 Eisenhauer - Die einfachste Eisenhower Matrix App!

⬇️ Kostenloser Download:
[Store-Link]?utm_source=share&utm_medium=app"
```

### UTM-Parameter für Tracking

**WICHTIG:** Nutze UTM-Parameter, um Share-Erfolg zu messen (Privacy-konform):

```
?utm_source=share&utm_medium=app&utm_campaign=organic
```

**Tracking-Optionen:**
- ✅ Plausible Analytics (DSGVO-konform, kein Cookie-Banner nötig)
- ✅ Google Analytics (mit Consent-Banner)
- ❌ Keine personenbezogenen Daten tracken

### Warum wichtig?

- 📈 **Viralität:** Nutzer können App einfach empfehlen
- 💰 **Kostenlos:** Beste Marketingmethode ohne Budget
- 🎯 **Targeted:** Empfehlung kommt von vertrauenswürdiger Quelle
- 📊 **Messbar:** UTM-Parameter zeigen Share-Erfolg

### Best Practices

1. ✅ Share-Button nicht zu prominent (wirkt verzweifelt)
2. ✅ In Settings unter "Support" platzieren
3. ✅ Kurzer, prägnanter Share-Text (max. 2-3 Zeilen + Link)
4. ✅ UTM-Parameter für Tracking nutzen
5. ✅ Emoji nutzen (fallen auf, aber sparsam)
6. ❌ NICHT nach jeder App-Nutzung zum Teilen auffordern
7. ❌ NICHT mit "Belohnungen" incentivieren (Play Store Policy)

---

## 🔄 Migration Checklist

Bei bestehenden Apps:

- [ ] Support-Link aus Footer entfernen
- [ ] Settings/About-Menü erstellen (falls nicht vorhanden)
- [ ] Support-Link unter "Support the Project" in Settings einfügen
- [ ] Text von "Support me" zu "Support the Project" ändern
- [ ] **Share-Button im Settings-Menü implementieren** (unter "Support" Sektion)
- [ ] Share-Text mit app-spezifischem Benefit anpassen
- [ ] UTM-Parameter für Share-Tracking hinzufügen
- [ ] Translations für "Share this App" / "App teilen" hinzufügen
- [ ] **Alle hartcodierten Texte identifizieren und ins translations-Objekt verschieben**
- [ ] Sicherstellen, dass alle sichtbaren Texte über `t.key` referenziert werden
- [ ] Testen auf allen Plattformen (Web, Android, iOS)
- [ ] Store Listings überprüfen ("Contains Ads" = NO)
- [ ] Commit mit Hinweis auf Store Compliance

---

## 📚 Referenzen

- [Google Play Policy: Ads](https://support.google.com/googleplay/android-developer/answer/9857753)
- [Apple App Store: Advertising Guidelines](https://developer.apple.com/app-store/review/guidelines/#advertising)
- [IARC Content Ratings](https://www.globalratings.com/)

---

## 📝 Version History

| Version | Datum | Änderung |
|---------|-------|----------|
| 1.2.0 | 2025-11-22 | Added Viralität & Growth Features - Share-Button Standard |
| 1.1.0 | 2025-11-21 | Added i18n Guidelines - Kein hartcodierter Text |
| 1.0.0 | 2025-11-01 | Initial Guidelines - Support Link Platzierung |

---

**Fragen oder Anpassungen?**
GitHub Issues: https://github.com/S540d/[projekt-name]/issues
