# Play Store Listing: Eisenhauer Matrix

Zentrale, pflegbare Quelle für alle Texte und Metadaten des Google-Play-Store-Eintrags. Wird beim Aktualisieren des Store-Eintrags 1:1 in die Play Console übernommen.

Der technische Ablauf (Signing, Build, Upload, Rollout) bleibt in [`Android/PLAYSTORE_CHECKLIST.md`](../Android/PLAYSTORE_CHECKLIST.md); dieses Dokument enthält nur den Listing-**Inhalt**.

---

## App Name (50 Zeichen max.)

```
Eisenhauer Matrix
```

## Short Description (80 Zeichen max.)

```
Task-Management nach der Eisenhauer-Matrix-Methode
```

## Full Description (4000 Zeichen max.)

```
Eisenhauer Matrix ist eine moderne Task-Management-App basierend auf der
Eisenhauer-Matrix-Methode zur Priorisierung von Aufgaben.

🎯 FEATURES:
• 5 Segmente: Do, Schedule, Delegate, Ignore, Done
• Wiederkehrende Aufgaben (täglich, wöchentlich, monatlich)
• Drag & Drop zwischen Segmenten (Maus, Touch, Keyboard)
• Cloud-Synchronisation mit Firebase
• Offline-First Architecture mit automatischer Sync
• Benutzer-Accounts (Google/Apple Sign-In) oder Gastmodus
• Export/Import (JSON Backups)
• Dark Mode (automatisch basierend auf System)
• Vollständige Tastatursteuerung (Accessibility)
• Screen Reader Support (VoiceOver, TalkBack)

📱 OFFLINE-FUNKTIONALITÄT:
Die App funktioniert vollständig offline. Alle Änderungen werden lokal
gespeichert und automatisch synchronisiert, sobald eine Verbindung besteht.
Keine Datenverluste!

♿ BARRIEREFREIHEIT:
WCAG 2.1 Level AA konform mit vollständiger Tastatursteuerung und
Screen Reader Support.

🔒 DATENSCHUTZ:
Ihre Daten werden sicher in Firebase Cloud Firestore gespeichert (bei Anmeldung)
oder lokal auf Ihrem Gerät (Gastmodus mit IndexedDB). Keine Tracking,
keine Werbung, keine Weitergabe an Dritte.

🌐 CROSS-PLATFORM:
Als Progressive Web App (PWA) auch im Browser nutzbar unter:
https://s540d.github.io/Eisenhauer/

📖 OPEN SOURCE:
Der komplette Quellcode ist auf GitHub verfügbar:
https://github.com/S540d/Eisenhauer

---

Made with ❤️ by S540d
```

> **Hinweis (Issue #352):** Diese Texte sind aktuell eine reine Feature-Aufzählung. Im Rahmen der Wachstums-/Aufwertungsstrategie sollen Short & Full Description überarbeitet werden, sodass die Positionierung (Priorisieren + Reflektieren statt „noch eine Todo-App") in den ersten Zeilen führt, bevor die Feature-Liste folgt.

## Kategorie & Tags

- **Kategorie:** Productivity
- **Tags:** task management, productivity, eisenhower matrix, todo, gtd

## Content Rating

- **Rating:** Everyone (3+)
- Questionnaire in der Play Console ausfüllen

## Privacy Policy

- **URL:** `https://s540d.github.io/Eisenhauer/privacy-policy.html`
- In Play Console unter Store-Präsenz verlinken

## Data Safety Section

- **Datenerfassung:** Ja (Email für Login, Tasks)
- **Datentypen:** Personal Info (Email), App Activity (Tasks)
- **Weitergabe an Dritte:** Nein
- **Verschlüsselung:** Ja (HTTPS, Firebase)
- **Datenlöschung:** Ja (Account-Löschung in App möglich)
- **Ads / Tracking:** Keine

## Contact & Support

- **Developer Email:** [Deine Email]
- **Support URL (optional):** `https://github.com/S540d/Eisenhauer/issues`

## Release Notes (Vorlage für Versions-Updates)

```
🎉 Erste Veröffentlichung der Eisenhauer Matrix App!

✨ Features:
• Task-Management nach Eisenhauer-Matrix-Methode
• Wiederkehrende Aufgaben (täglich, wöchentlich, monatlich)
• Cloud-Sync und Offline-Support
• Dark Mode
• Export/Import für Backups
• Vollständig barrierefrei (WCAG 2.1 AA)

🙏 Wir freuen uns über Feedback und Bewertungen!

📧 Support: https://github.com/S540d/Eisenhauer/issues
```

## Screenshots & Grafiken

Assets liegen in [`Android/playstore-assets/`](../Android/playstore-assets/) (Feature Graphic 1024×500px, App-Icon 512×512px, Screenshots 1080×1920px Portrait). Erstellungsprozess siehe [`Android/playstore-assets/README.md`](../Android/playstore-assets/README.md).

**Benötigte Screenshots (min. 2, max. 8):**
1. Hauptansicht mit allen Segmenten (Pflicht)
2. Dark Mode (empfohlen)
3. Task erstellen / Wiederkehrende Aufgaben
4. Drag & Drop Demonstration
