# Ideenskizze: Notizfunktion

Status: Konzept / Ideenskizze — keine Implementierung, dient als Grundlage für ein späteres Issue.

## Kontext

Die App bietet aktuell keine Möglichkeit, längere Freitext-Notizen festzuhalten – Tasks haben nur einen kurzen Titel (max. 140 Zeichen, `MAX_TASK_LENGTH` in `js/modules/config.js`). Ein separates Notiz-Feld pro Task existiert bislang nicht (verifiziert per Code-Suche in `tasks.js`, `ui.js`). Ziel: eine **einfache, abschaltbare Ergänzung**, mit der man (a) zu einzelnen Tasks kurze Notizen ergänzen und (b) freistehende Notizen ganz ohne Task-Bezug sammeln kann – bewusst ohne Formatierung, Tags, Verknüpfungen o. ä. ("kein Schnickschnack").

## Grundidee

Eine neue, optionale **Notizen-Sammlung** – technisch und UI-seitig unabhängig von der Matrix, aber mit optionaler Verknüpfung zu einem Task:

- **Freistehende Notizen**: eigener Menüpunkt/Icon (analog zu Metriken/Export), öffnet ein Modal mit einfacher Liste (Text + Erstellungsdatum), Notiz hinzufügen/löschen. Kein Editieren-Dialog mit Rich-Text – nur ein Textfeld.
- **Task-Notizen**: optionales Freitextfeld im Quick-Add-/Edit-Dialog eines Tasks ("Notiz"-Textarea). Ist die Task-Notiz gesetzt, taucht sie automatisch auch in der Notizen-Sammlung auf (mit Verweis/Badge „zu Task: …"), muss aber nicht doppelt gepflegt werden – sie liegt technisch nur einmal auf dem Task-Objekt.

Damit bleibt es bei **einer** Datenquelle: freistehende Notizen sind eigene Objekte in einer neuen `notes`-Collection, Task-Notizen sind ein Feld auf dem Task-Objekt. Die Notizen-Ansicht liest beide Quellen zusammen und zeigt sie in einer flachen, chronologisch sortierten Liste.

## Feature-Flag (abschaltbar) – nur für die Notizen-Sammlungsansicht

Wichtige Präzisierung: **Nur die separate Notizen-Übersicht** (freistehende Sammlung aller Notizen) hängt am Flag. Die Möglichkeit, eine Notiz direkt an einem Task zu ergänzen (Freitextfeld im Quick-Add-/Edit-Dialog), ist **immer verfügbar** – unabhängig vom Toggle, wie jedes andere reguläre Task-Feld (z. B. Fälligkeitsdatum).

- Neuer Key `STORAGE_KEYS_EXTENDED.NOTES_COLLECTION_ENABLED = 'notesCollectionEnabled'` in `js/modules/config.js` (neben `SMART_FUNCTIONS_ENABLED`)
- Toggle im Personalisieren-Modal (`index.html`, neue `.settings-section` direkt nach dem Smarte-Funktionen-Block), gleicher Checkbox+Label+Beschreibung-Aufbau. Beschreibungstext macht klar, dass er nur die Übersicht betrifft (z. B. „Zeigt eine gesammelte Übersicht aller Notizen an").
- Wiring in `js/modules/ui.js` analog zum bestehenden Smart-Functions-Toggle (Zustand beim Öffnen reflektieren, Klick-Handler → `localStorage.setItem('notesCollectionEnabled', ...)`)
- Konsum-Stelle prüft `localStorage.getItem('notesCollectionEnabled') === 'true'` direkt am Ort der Verwendung (kein zentraler Helper – entspricht bestehendem Stil): steuert **ausschließlich** die Sichtbarkeit des Notizen-Icons/Menüpunkts, der die Sammlungs-Ansicht öffnet.
- Das Notiz-Textfeld im Quick-Add-/Edit-Dialog wird **nicht** vom Flag verborgen – es ist Teil des normalen Task-Formulars.
- **Deaktiviert = Standard** für die Sammlungsansicht. Task-Notizen bleiben davon unberührt: sie werden weiter gespeichert und sind über den Task selbst sichtbar/editierbar, auch wenn die Übersicht ausgeblendet ist. Kein Datenverlust beim Umschalten.

## Datenmodell

- Task-Objekt (`createTaskObject`, `js/modules/tasks.js`) bekommt optionales Feld `notes` (string), analog zu `dueDate`/`category` nur gesetzt wenn nicht leer. Bearbeitung über `updateTask()`.
- Neue eigenständige Notiz: `{ id, text, createdAt }` – bewusst minimal, keine Kategorien/Tags/Prioritäten.
- Persistenz folgt dem bestehenden Speicherpfad: Guest-Mode über LocalForage (`storage.js`, neuer Key z. B. `eisenhauerNotes` analog `eisenhauerTasks`), authentifizierter Modus über Firestore (analog `saveTaskToFirestore`/`loadUserTasks`) in eigener Collection `notes`. Task-gebundene Notizen brauchen keinen neuen Storage-Pfad, da sie im Task-Dokument mitlaufen.

## UI-Bausteine (minimal)

- Neuer Menüpunkt „Notizen" (Icon im Header oder Settings-Modal unter „Daten")
- Ein Modal: Liste aller Notizen (Text, Datum, ggf. „→ Task XY"-Hinweis bei Task-Notizen), Eingabefeld + „Hinzufügen" oben, Löschen-Icon pro Eintrag. Keine Suche, kein Filter, keine Sortier-Optionen in v1.
- Quick-Add-Dialog: optionales Textarea „Notiz" unterhalb des Titel-Inputs, **immer sichtbar**, unabhängig vom Flag.

## i18n

Neue Keys in `js/modules/translations.js` (de/en), analog zum bestehenden `personalize.smartFunctions*`-Block: z. B. `notes.title`, `notes.placeholder`, `notes.empty`, `personalize.notesCollectionEnabled`, `personalize.notesCollectionEnabledDesc`. Anwendung in `updateLanguageUI()`.

## Bewusst nicht in v1

- Kein Rich-Text/Markdown, keine Bilder/Anhänge
- Keine Verschlagwortung, keine Verknüpfung zu mehreren Tasks
- Keine Volltextsuche (bei Bedarf später ergänzbar, kein Blocker)
- Kein separater Export – bestehender CSV/Markdown-Export (`export.js`) könnte Notizen später mit aufnehmen, ist aber nicht Teil dieser Ideenskizze

## Nächste Schritte (falls gewünscht)

Bei Zustimmung: Issue anlegen (Titel z. B. „Notizfunktion (Task-Notizen + freistehende Notizen-Sammlung)"), Umsetzung als Feature-Branch gegen `testing`, Tests für `createTaskObject`/`updateTask`-Erweiterung und für die neue Notizen-Modul-Logik.
