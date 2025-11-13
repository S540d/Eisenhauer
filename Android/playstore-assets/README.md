# Play Store Assets

## 📐 Generierte Dateien

### ✅ Feature Graphic (feature-graphic.png)
- **Größe:** 1024 x 500 px
- **Stil:** App-Design mit Gradient-Hintergrund
- **Enthält:** App-Name, Icon und 4 Quadranten-Visualisierung

### ✅ App-Icon (app-icon-512.png)
- **Größe:** 512 x 512 px
- **Verwendung:** Store Listing Icon

## 📸 Screenshots erstellen

### Methode: Browser Developer Tools (Empfohlen)

1. **App öffnen:**
   - Gehe zu https://s540d.github.io/Eisenhauer/

2. **Developer Tools:**
   - Chrome/Edge: F12 oder Cmd+Opt+I (Mac)
   - Device Toolbar: Cmd+Shift+M
   - Gerät: iPhone 14 Pro Max (oder Custom: 1080 x 1920)

3. **Beispiel-Aufgaben hinzufügen:**
   - **Do!**: "Quartalsbericht fertigstellen", "Kundenpräsentation vorbereiten"
   - **Schedule!**: "Neue Programmiersprache lernen", "Jahresplanung erstellen"
   - **Delegate!**: "E-Mails beantworten", "Meeting-Protokoll schreiben"
   - **Ignore!**: "Social Media durchscrollen"

4. **Screenshot erstellen:**
   - Cmd+Shift+P → "Capture screenshot" eingeben
   - Oder Rechtsklick im Viewport → "Screenshot erstellen"

5. **Für Dark Mode:**
   - System Dark Mode aktivieren
   - Seite neu laden
   - Zweiten Screenshot machen

### Benötigte Screenshots (min. 2, max. 8)

1. **Hauptansicht mit allen Quadranten** (PFLICHT)
2. **Dark Mode** (EMPFOHLEN)
3. Optional: Aufgabe hinzufügen, Wiederkehrende Aufgaben

## 🎨 Assets neu generieren

```bash
cd Android
python3 generate-playstore-assets.py
```

## 📤 Upload zum Play Store

1. Öffne [Google Play Console](https://play.google.com/console/)
2. Wähle deine App
3. Gehe zu "Store-Präsenz" → "Store-Eintrag"
4. Lade hoch:
   - Feature Graphic: `feature-graphic.png`
   - App-Icon: `app-icon-512.png`
   - Screenshots: Deine erstellten Screenshots

---

**Letzte Generierung:** Automatisch erstellt
