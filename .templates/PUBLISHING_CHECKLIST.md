# 📋 Publishing Checklist für GitHub Pages PWAs

## Optische Vorgaben
- in allen Projekten soll es unter Settings einen Toggle geben, mit dem man zur Unterseite "Metrik" wechseln kann. dort sind dann typische Zahlen zu erfüllten Todos oder Durchschnittspreisen genannt. je nach Projekt
- minimalistisches Design: Hintergrund in weiß oder schwarz (dark Mode), Diagramme und Textblöcke sind nicht abgesetzt. Diagramme in Ampel:Farblogik (grün gut, rot schlechte). Tasten wenn nötig in Kästchen mit abgerundeten Ecken. 
- responsives Design, das auf kleinen Displays z. B. Die Auflösung des Kalenders reduziert 
- über alle Apps einheitliche Schriftgrösse (noch zu definieren)
- Einstellungen oben Rechts mit **drei vertikalen Punkten (⋮)** als SVG-Icon (NICHT Zahnrad-Emoji); möglichst zusammen mit anderen Symbolen im Header - also nicht zwei Header übereinander: Die Einstellungen stehen dann in folgender Reihenfolge: 
       - Abgemeldet als...
    - **Theme-Toggle** zwischen "System" (folgt Betriebssystem) und "Dunkel" (immer dunkel) - NICHT Hell/Dunkel/System! Toggle-Switch verwenden, nicht Dropdown.
    - im gleichen Stil: Toogle für deutsch/englisch
    - im gleichen Stil: Toggle zum umschalten auf "Metrik"
    - Möglichkeit zum Export als JSON, nicht als CSV
    - "SChließen" Taste
    -  "Über" (hut im Projekt Pflanzkalender gelöst): App Name, Version oder Datum, Feedback:devsven@posteo.de
    - Lizenz (gut im Projekt Pflanzkalender gelöst), wenn Daten von Dritten verwendet werden
- bymeacoffee- Link in die Fusszeile der Hauptseite: support me: https://buymeacoffee.com/sven4321 (kaffeetassensymbol + „Support me“ als Link) in gelbem Kasten, Die Fußzeile soll immer sichtbar sein, egal wie gescrollt wird
- **App-Name**: NICHT im Header anzeigen, sondern nur in den Settings-Modal oben als erste Zeile
- **Settings-Modal**: Kompakte Darstellung mit moderaten Abständen zwischen Elementen (nicht zu eng, aber auch nicht zu weit) 
- Es soll - sofern irgendwo ein Icon verwendet wird, jenes sein, das im jeweiligen Projekt unter "icon.png" abgelegt ist
- außer der Teetasse vor dem Footer mit "support me" soll nirgendswo ein Emoji auftauchen. Erst recht nicht in Zusammenhang mit einem Wort
- **Settings-Icon**: Ausschließlich SVG-basierte drei Punkte verwenden (siehe Implementierung in Eisenhauer/index.html)


## 💻 Technische Design-Implementierung

### Cache- Busting
- Implementierung von Cache-Busting-Strategien für statische Assets (z. B. durch Hashing der Dateinamen), Ziel: Vermeidung von Caching-Problemen bei Updates.

### Settings-Icon (drei Punkte)

**Vanilla JavaScript/HTML:**
```html
<button id="settingsBtn" class="settings-btn" title="Einstellungen">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="5" r="2"></circle>
        <circle cx="12" cy="12" r="2"></circle>
        <circle cx="12" cy="19" r="2"></circle>
    </svg>
</button>
```

**React Native (✅ erfolgreich in Pflanzkalender implementiert):**
```tsx
import Svg, { Circle } from 'react-native-svg';

<Svg width="14" height="14" viewBox="0 0 24 24" fill="white">
  <Circle cx="12" cy="5" r="2" />
  <Circle cx="12" cy="12" r="2" />
  <Circle cx="12" cy="19" r="2" />
</Svg>
```
**Dependencies:** `npm install react-native-svg`

### Theme-Toggle System

**Vanilla JavaScript:**
- **HTML**: `<input type="checkbox" id="themeToggle" class="toggle-switch">` 
- **Label**: "🌙 System / Dunkel"
- **JavaScript**: 
  - `checked = false` → System-Theme (folgt OS)
  - `checked = true` → Dunkel-Theme (immer dunkel)
- **Persistierung**: LocalStorage mit Key 'theme', Werte: 'system' oder 'dark'

**React Native (✅ erfolgreich in Pflanzkalender implementiert):**
```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Switch } from 'react-native';

// In useTheme Hook
const [themeMode, setThemeModeState] = useState<'system' | 'dark'>('system');
const systemColorScheme = useColorScheme();
const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');

// Persistierung
const setThemeMode = async (mode: 'system' | 'dark') => {
  await AsyncStorage.setItem('theme', mode);
  setThemeModeState(mode);
};

// UI Component
<Switch
  value={themeMode === 'dark'}
  onValueChange={(value) => setThemeMode(value ? 'dark' : 'system')}
/>
```
**Dependencies:** `npm install @react-native-async-storage/async-storage`

### Settings-Modal Layout (✅ erfolgreich in Pflanzkalender implementiert)
```tsx
// Kompakte Darstellung mit moderaten Abständen
const styles = StyleSheet.create({
  appName: { 
    fontSize: 20, 
    fontWeight: '600', 
    marginBottom: 24,
    textAlign: 'center'
  },
  settingsOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },
  spacer: { height: 20 }
});
```

### Metrik-Ansicht (✅ erfolgreich in Pflanzkalender implementiert)
```tsx
// Toggle für Metrik-Ansicht
const [showMetrics, setShowMetrics] = useState(false);

// Beispiel Metriken für Pflanzkalender
<View style={metricsCard}>
  <Text>📊 Statistiken</Text>
  <Text>Anzahl Pflanzen: {plants.length}</Text>
  <Text>Aktivitäten gesamt: {totalActivities}</Text>
  <Text>Ø Aktivitäten/Pflanze: {averageActivities}</Text>
</View>
```

### JSON-Export Funktionalität (✅ erfolgreich in Pflanzkalender implementiert)
```tsx
import { Share } from 'react-native';

const handleExportData = async () => {
  const exportData = {
    plants,
    exportDate: new Date().toISOString(),
    appVersion: '1.0.0'
  };
  
  await Share.share({
    message: JSON.stringify(exportData, null, 2),
    title: 'App Daten Export'
  });
};
```

### Sticky Footer mit Support-Link (✅ erfolgreich in Pflanzkalender implementiert)
```tsx
// Footer Component
<View style={[styles.footer, { backgroundColor: theme.background }]}>
  <TouchableOpacity 
    style={[styles.supportButton, { backgroundColor: '#FFD700' }]}
    onPress={() => Linking.openURL('https://buymeacoffee.com/sven4321')}
  >
    <Text style={styles.coffeeIcon}>☕</Text>
    <Text style={styles.supportText}>Support me</Text>
  </TouchableOpacity>
</View>

// Styling
const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  }
});
```

## ✅ Essenzielle Dateien

- [ ] **LICENSE** - Open Source Lizenz, Ausschluss von kommerzieller Nutzung
- [ ] **README.md** - Projekt-Dokumentation
- [ ] **.gitignore** - Korrekt konfiguriert (node_modules, dist, etc.) -> keine psswörter, personenbezogene Daten oder nicht-relevanten Notizen
- [ ] **package.json** - Alle Scripts vorhanden (build:web)
- [ ] **app.json** - baseUrl für GitHub Pages konfiguriert


## 🔧 Technische Konfiguration

- [ ] **GitHub Actions Workflow** (.github/workflows/deploy.yml)
- [ ] **PWA Manifest** (public/manifest.json)
- [ ] **Service Worker** (public/service-worker.js)
- [ ] **Icons** (192x192 und 512x512)
- [ ] **Post-Build Script** (scripts/post-build.js)
- [ ] **Dependencies korrekt** (react-dom Version passt)
- [ ] im Zielzustand mit „anmelden mit Google“, „anmelden mit Apple“ und lokal nutzen. Bei letzterem werden die Daten lokal auf dem Gerät gespeichert.
- Einstellungen werden bei Google, Apple oder auf dem Gerät gespeichert. 
- es ist das Freemium Konzept mittelfristig vorgesehen. Dann werden bestimmte Funktionen nur für zahlende Kunden zur Verfügung stehen. Aber in der Anfangsphasen sind alle Funktionen frei zu nutzen
- Einstellungen und Daten können als JSON exportiert werden. Die Einstellung dafür ist im Settings Menu 
- 

## 📝 Code-Qualität

- [ ] **Keine Secrets im Code** (API Keys, Passwörter)
- [ ] **Keine sensiblen Daten** (.env Dateien ignoriert)
- [ ] **Console.logs entfernt** (oder nur für Debug)
- [ ] **TODO-Kommentare bereinigt**
- [ ] **Tote Code-Abschnitte entfernt**
- [ ] **Wenn in einer Datei mehr als 1000 Zeilen code sind, prüfe ob eine Aufteilung sinnvoll ist


## 🌐 GitHub Repository

- [ ] **Repository Public** (für GitHub Pages kostenlos)
- [ ] **Aussagekräftige Description**
- [ ] **Topics/Tags gesetzt**
- [ ] **GitHub Pages aktiviert** (Settings → Pages → GitHub Actions)
- [ ] **Repository-Name = URL-Path** (keine Sonderzeichen)

## 📱 PWA-Spezifisch

- [ ] **Manifest vollständig** (name, icons, start_url, display)
- [ ] **Service Worker registriert** (in index.html)
- [ ] **Icons vorhanden** (mindestens 192x192 und 512x512)
- [ ] **Theme Color definiert**
- [ ] **Offline-Support funktioniert**

## 🎨 Benutzer-Erfahrung

- [ ] **App-Name klar und verständlich**
- [ ] **Beschreibung vorhanden**
- [ ] **Screenshot/Demo im README**
- [ ] **Live-Demo-Link funktioniert**
- [ ] **Mobile-responsive**
- [ ] **Loading-States vorhanden**

## ⚖️ Rechtliches

- [ ] **Lizenz-Datei vorhanden**
- [ ] **Datenquellen-Attribution** (z.B. SMARD.de)
- [ ] **Keine Copyright-Verletzungen**
- [ ] **Datenschutz berücksichtigt** (keine unnötige Datensammlung)
- [ ] **Third-Party-Lizenzen dokumentiert**

## 🔒 Sicherheit

- [ ] **Keine Credentials committed**
- [ ] **Dependencies aktuell** (npm audit)
- [ ] **HTTPS erzwungen** (GitHub Pages macht das automatisch)
- [ ] **XSS-Schutz** (keine innerHTML mit User-Input)
- [ ] **CORS richtig konfiguriert** (falls API-Calls)

## 🚀 Deployment

- [ ] **Build lokal erfolgreich** (npm run build:web)
- [ ] **Keine Build-Errors**
- [ ] **Keine Build-Warnings** (kritische)
- [ ] **Dist-Ordner korrekt** (alle Assets vorhanden)
- [ ] **Relative Pfade** (für Subpath-Deployment)

## 📊 Qualitätssicherung

- [ ] **App läuft lokal** (npm run web)
- [ ] ** App läuft als PWA**
- [ ] **App läuft auf Android** (npm run android) - optional
- [ ] **Grundfunktionen getestet**
- [ ] **Dark Mode funktioniert** (falls implementiert)
- [ ] **Export funktioniert** (falls implementiert)

## 📚 Dokumentation

- [ ] **Installation-Anleitung**
- [ ] **Deployment-Anleitung**
- [ ] **Features dokumentiert**
- [ ] **Known Issues dokumentiert** (falls vorhanden)
- [ ] **Contributing Guide** (optional, aber empfohlen)

## 🎯 Best Practices

- [ ] **Commit-Messages aussagekräftig**
- [ ] **Branch-Strategie** (main = Production)
- [ ] **Semantic Versioning** (in package.json)
- [ ] **Changelog** (optional, aber hilfreich)

## 🔗 Links & Referenzen

- [ ] **GitHub Repository URL** im package.json
- [ ] **Homepage URL** im package.json (GitHub Pages URL)
- [ ] **Bug Tracker URL** (GitHub Issues)
- [ ] **Support-Kontakt** (falls vorhanden)

---

## 📝 Projekt-spezifische Checks

### React Native / Expo Projekte (✅ erfolgreich in Pflanzkalender implementiert)
- [ ] **Expo SDK Version aktuell**
- [ ] **react-native-web installiert**
- [ ] **react-native-svg installiert** (für Settings-Icon)
- [ ] **@react-native-async-storage/async-storage installiert** (für Theme-Persistierung)
- [ ] **Platform-specific Code** (Platform.OS checks)
- [ ] **Settings-Icon als SVG-Komponente** (drei Punkte)
- [ ] **Theme-Hook mit AsyncStorage** (System/Dunkel Toggle)
- [ ] **Footer-Komponente** (sticky mit Support-Link)
- [ ] **JSON-Export mit Share API**
- [ ] **Metrik-Ansicht mit Statistiken**

### Deployment Scripts für Expo Web (✅ erfolgreich in Pflanzkalender implementiert)
```bash
# scripts/deploy.sh
#!/bin/bash
echo "Building app..."
npx expo export --platform web --output-dir dist

echo "Fixing paths for GitHub Pages..."
node scripts/fix-paths.js

cd dist && touch .nojekyll && cd ..

echo "Deploying to GitHub Pages..."
npx gh-pages -d dist
```

```javascript
// scripts/fix-paths.js
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Replace paths for GitHub Pages subpath
html = html.replace(/href="\/_expo/g, 'href="/RepositoryName/_expo');
html = html.replace(/src="\/_expo/g, 'src="/RepositoryName/_expo');
html = html.replace(/href="\/favicon/g, 'href="/RepositoryName/favicon');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✓ Fixed paths for GitHub Pages');
```

### PWA-spezifisch
- [ ] **Cache-Strategie definiert** (im Service Worker)
- [ ] **Update-Mechanismus** (Service Worker Updates)
- [ ] **Offline-Fallback-Seite**

---

## ⚡ Quick-Check vor Deployment

### Für React Native/Expo Projekte (✅ erfolgreich in Pflanzkalender getestet)
1. `npm install` - Dependencies installieren
2. `npm run build` oder `expo export --platform web` - Build testen
3. `git status` - Keine uncommitted changes
4. `git log -1` - Letzter Commit aussagekräftig
5. `ls dist/` - Alle Dateien vorhanden (index.html, _expo folder, favicon.ico)
6. `npm run deploy` - Führt Build, Path-Fixing und gh-pages Deploy aus

### Für Vanilla JavaScript Projekte
1. `npm install` - Dependencies installieren  
2. `npm run build:web` - Build testen
3. `git status` - Keine uncommitted changes
4. `git log -1` - Letzter Commit aussagekräftig
5. `ls dist/` - Alle Dateien vorhanden
6. GitHub Pages Workflow triggered - Nach Push automatisch

### Erfolgreich implementierte Referenz-Projekte
- ✅ **Eisenhauer** (Vanilla JS): Settings-Icon, Theme-Toggle, Footer - https://s540d.github.io/Eisenhauer
- ✅ **Pflanzkalender** (React Native/Expo): Vollständige Publishing-Checklist Standards - https://s540d.github.io/Pflanzkalender

---

## 🎯 Implementierungs-Reihenfolge (Empfohlen)

### Phase 1: Design-Standards (✅ Erfolgreich in Pflanzkalender implementiert)
1. **Settings-Icon ändern**: Zahnrad-Emoji → Drei-Punkt-SVG
2. **App-Name aus Header entfernen**: Nur noch in Settings-Modal anzeigen
3. **Theme-System implementieren**: System/Dunkel Toggle mit Persistierung
4. **Settings-Modal überarbeiten**: Kompakte Darstellung mit Toggle-Switches

### Phase 2: Erweiterte Features (✅ Erfolgreich in Pflanzkalender implementiert)  
5. **Metrik-Ansicht hinzufügen**: Projekt-spezifische Statistiken
6. **JSON-Export implementieren**: Daten-Export-Funktionalität
7. **Footer mit Support-Link**: Sticky buymeacoffee-Link in gelbem Kasten

### Phase 3: Code-Cleanup & Deployment
8. **Dependencies aktualisieren**: Benötigte Pakete installieren
9. **Code bereinigen**: TODO-Kommentare entfernen, Secrets prüfen
10. **Build & Deploy testen**: Lokal builden und GitHub Pages deployment

## 📋 Copy-Paste Code-Snippets

Alle Code-Beispiele sind im Pflanzkalender-Projekt erfolgreich getestet und können direkt übernommen werden:

- **Settings-Icon SVG**: Siehe Abschnitt "Settings-Icon (drei Punkte)"
- **Theme-Toggle Hook**: Siehe Abschnitt "Theme-Toggle System" 
- **Settings-Modal Layout**: Siehe Abschnitt "Settings-Modal Layout"
- **Metrik-Ansicht**: Siehe Abschnitt "Metrik-Ansicht"
- **JSON-Export**: Siehe Abschnitt "JSON-Export Funktionalität"
- **Sticky Footer**: Siehe Abschnitt "Sticky Footer mit Support-Link"
- **Deployment Scripts**: Siehe Abschnitt "Deployment Scripts für Expo Web"

---

**Hinweis:** Diese Checkliste ist ein bewährter Leitfaden basierend auf erfolgreichen Implementierungen. Die Code-Beispiele wurden in realen Projekten getestet und können direkt übernommen werden.
