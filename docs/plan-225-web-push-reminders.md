# Plan: Web Push Reminders für Fälligkeitsdaten (Issue #225)

## Ziel

Nutzer können sich an Tasks mit Fälligkeitsdatum erinnern lassen — nativ über den Browser/OS,
ohne Backend, funktioniert auf Android, iOS (Home Screen) und Desktop.

## UX-Entscheidungen

- **Opt-in über Settings:** Erinnerungen werden nur aktiviert, wenn der Nutzer
  den Toggle in den Einstellungen bewusst umlegt.
- **Permission erst bei Aktivierung:** `Notification.requestPermission()` wird
  nur aufgerufen, wenn der Nutzer den Toggle aktiviert — nie beim App-Start.
- **Kein ungewolltes Behelligen:** Wer den Toggle nie anfasst, bekommt nie
  eine Permission-Anfrage.
- **Permission verweigert?** Toast-Hinweis + Toggle bleibt aus — kein erneutes Nerven.

## Technische Architektur

### Problem mit `generateSW`

Vite PWA generiert den Service Worker automatisch (Workbox). Für eigene
Push/Notification-Logik im SW brauchen wir `injectManifest`-Strategie:
Wir schreiben einen eigenen SW, Workbox injiziert nur das Precache-Manifest hinein.

### Wie Scheduled Notifications funktionieren

Echter Web Push (VAPID) braucht einen Server. Wir nutzen stattdessen
**lokale Scheduled Notifications**:

```
App → postMessage({ tasks }) → Service Worker
Service Worker → speichert Tasks in IndexedDB
Service Worker → prüft alle 15 Minuten via setInterval
Service Worker → feuert Notification wenn dueDate - Vorlauf ≤ jetzt
```

Der SW läuft im Hintergrund (auch wenn App geschlossen) — solange der Browser
den SW nicht bereinigt. Beim nächsten App-Start werden die Notifications neu geplant.

### Timing-Logik im SW

- Erinnerung wird gefeuert wenn: `now >= dueDate - (vorlaufTage * 86400000)`
- Bereits gefeuerte Erinnerungen werden in IndexedDB als "notified" markiert
- Bei Task-Änderung (dueDate geändert/gelöscht): SW bekommt Update via postMessage

## Dateien & Änderungen

### Neu: `public/sw-custom.js`
Custom Service Worker — Workbox injiziert Precache-Manifest, wir fügen hinzu:
- `message`-Handler: empfängt Task-Liste von der App
- `setInterval` (15min): prüft fällige Erinnerungen
- `self.registration.showNotification(...)`: feuert native Notification
- IndexedDB: speichert Tasks + "notified"-Status

### Geändert: `vite.config.js`
- Strategie: `generateSW` → `injectManifest`
- `swSrc: 'public/sw-custom.js'`
- `swDest: 'service-worker.js'`

### Neu: `js/modules/reminder.js`
- `requestPermission()` — fragt Berechtigung an, gibt `granted/denied` zurück
- `scheduleReminders(tasks)` — schickt Tasks per postMessage an SW
- `cancelReminders()` — leert Task-Liste im SW (bei Deaktivierung)
- `isSupported()` — prüft ob Notification API + SW verfügbar

### Geändert: `js/modules/translations.js`
Neue Keys (DE + EN):
```
settings.reminders           "Erinnerungen"         "Reminders"
settings.remindersToggle     "Erinnerungen für fällige Aufgaben"
settings.remindersBefore     "Erinnerung"           "Remind me"
settings.remindersDay1       "1 Tag vorher"         "1 day before"
settings.remindersDay2       "2 Tage vorher"        "2 days before"
settings.remindersDay3       "3 Tage vorher"        "3 days before"
settings.remindersDenied     "Berechtigung verweigert. Bitte in den Browser-Einstellungen erlauben."
notifications.reminderTitle  "Eisenhauer Erinnerung"
notifications.reminderBody   "«{task}» ist fällig {date}"
```

### Geändert: `index.html`
Im Personalize-Modal, neuer Abschnitt unter Smart Functions:
```
[ Erinnerungen                          ◯ ]   ← Toggle
  Erinnerung  [ 1 Tag vorher ▾ ]              ← Dropdown (nur sichtbar wenn aktiv)
```

### Geändert: `script.js`
- Bei App-Start: wenn Reminders aktiv → `scheduleReminders(allTasks)`
- Bei Task hinzufügen/ändern/löschen → `scheduleReminders(allTasks)` neu aufrufen
- Toggle-Handler im Personalize-Modal

### Geändert: `store.js`
Neue Felder in State:
- `remindersEnabled: boolean` (Default: `false`)
- `reminderDaysBefore: number` (Default: `1`)

## Ablauf aus Nutzersicht

```
1. Nutzer öffnet Settings → Personalize
2. Toggle "Erinnerungen" umlegen
3. Browser zeigt Permission-Dialog
   → Erlaubt: Toggle bleibt an, Dropdown erscheint
   → Verweigert: Toast "Berechtigung verweigert", Toggle geht zurück auf aus
4. Dropdown: "1 Tag vorher / 2 Tage / 3 Tage" wählen
5. Fertig — Erinnerungen laufen automatisch
```

## Einschränkungen (bekannt & akzeptiert)

| Einschränkung | Grund |
|---|---|
| iOS nur bei Home Screen App | iOS-Limitierung für Web Push |
| SW kann vom Browser bereinigt werden | Notifications werden beim nächsten App-Start neu geplant |
| Kein exakter Zeitpunkt | 15min-Intervall im SW (Akku-Kompromiss) |
| Kein echter Server-Push | Kein Backend → lokale Lösung |

## Nicht in Scope

- Push-Notifications wenn die App länger als ~1 Woche nicht geöffnet wurde
  (Browser bereinigt inaktive SWs)
- Notification-Klick öffnet App direkt auf dem Task (möglich, aber Folge-Feature)

## Offene Fragen für Review

1. Soll der Default-Vorlauf 1 Tag sein, oder soll der Nutzer keinen Default bekommen
   (muss explizit wählen)?
2. Soll es eine Erinnerung **am Tag selbst** (0 Tage vorher) geben als Option?
3. Soll die Erinnerung zu einem bestimmten Uhrzeit kommen (z.B. 9:00 Uhr),
   oder relativ zur dueDate-Zeit?
