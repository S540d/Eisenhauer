# Issue: Refactoring der Authentifizierungs-Strategie

**Status:** Offen
**Priorität:** Mittel (Funktionalität ist aktuell gegeben)
**Erstellt:** 30.12.2025
**Referenz:** [Android/FIX-LOGIN-LOGOUT-LOOP.md](../Android/FIX-LOGIN-LOGOUT-LOOP.md)

## Aktuelle Situation (Die "Krücke")
Um den Login-Loop auf mobilen Geräten (insbesondere Android TWA) zu beheben, wurde in Version 1.7.6 eine "Self-Healing"-Strategie implementiert.

**Funktionsweise:**
1. App versucht `signInWithRedirect`.
2. Wenn dies fehlschlägt (User kommt zurück, aber kein Auth-Result), wird ein Flag `auth_redirect_failed` gesetzt.
3. Beim *nächsten* Versuch wird automatisch `signInWithPopup` verwendet.

## Warum das keine dauerhafte Lösung ist
- **Schlechte UX beim ersten Mal:** Der User erlebt einen fehlgeschlagenen Login-Versuch ("Anmeldung fehlgeschlagen"), bevor es funktioniert.
- **Komplexität:** Der Code in `auth.js` muss State-Flags im `localStorage` verwalten (`auth_is_redirecting`, `auth_redirect_failed`).
- **Fragilität:** Wenn der User den Cache löscht, beginnt das Spiel von vorne.

## Zielbild (Die "Saubere Lösung")
Die Authentifizierung sollte robust funktionieren, ohne dass ein Fehler provozieren werden muss.

### Mögliche Lösungsansätze für später:
1. **Environment Detection:** Zuverlässige Erkennung, ob die App in einer Umgebung läuft, die Redirects nicht mag (z.B. spezifische WebViews), und *direkte* Wahl der Popup-Methode.
2. **Universal Links / App Links:** Korrekte Konfiguration der Android App Links, sodass der Redirect vom OAuth-Provider *garantiert* von der App abgefangen wird (und nicht im Browser landet).
3. **Chrome Custom Tabs Optimierung:** Sicherstellen, dass die Session zwischen Custom Tab und TWA korrekt geteilt wird (evtl. Cookies/SameSite Problematik).

## Nächste Schritte
- Analyse, warum genau `getRedirectResult` null zurückgibt (Logs prüfen).
- Prüfen, ob `signInWithPopup` auf Mobilgeräten mittlerweile UX-technisch akzeptabel ist (früher wurde davon abgeraten, heute oft Standard).
- Falls Popup akzeptabel: Evtl. generell auf Mobile auf Popup umstellen?
