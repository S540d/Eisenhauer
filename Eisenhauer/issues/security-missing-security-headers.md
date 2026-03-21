---
### Titel
Fehlende Security-Header (CSP, Clickjacking-/Sniffing-Schutz) für die PWA

### Befund
- `index.html` enthält keine **Content-Security-Policy** oder weitere Hardening-Header (Zeilen 1–40, 39–41).  
- Die vorhandene `_headers`-Datei setzt ausschließlich Cache-Header, aber keine Sicherheitsheader wie `Content-Security-Policy`, `X-Frame-Options`/`frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy` oder `Permissions-Policy` (Zeilen 1–38).
- Inline-Handler (`onclick="…"`) im Markup erschweren künftig eine strikte CSP, wodurch ein kompromittiertes CDN/Dependency oder XSS-Vektor ungebremst ausgeführt werden kann.

### Risiko
- Keine Abwehr gegen XSS/Injection im Frontend; bei erfolgreicher Injektion läuft Schadcode im Service-Worker-Kontext und kann offline weiterwirken.
- Ohne Frame-Blocking ist Clickjacking möglich (PWA kann in fremden iframes gerendert werden).
- Fehlende Sniffing-/Referrer- und Permissions-Policies führen zu potenziellen Datenlecks und unsicheren MIME-Interpretationen.

### Empfehlung
- Security-Header für alle Auslieferungen setzen, z. B. via `_headers` oder Hosting-Konfiguration:  
  - `Content-Security-Policy: default-src 'self'; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://www.googleapis.com; img-src 'self' data:; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; base-uri 'self'` (ggf. an Firebase-Endpunkte anpassen).  
  - `X-Frame-Options: DENY` oder `frame-ancestors 'none'` in CSP.  
  - `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: geolocation=(), camera=(), microphone=()`.
- Inline-Handler langfristig in JS-Event-Listener migrieren, um auf eine striktere CSP ohne `'unsafe-inline'` wechseln zu können.
- Nach Rollout in allen Umgebungen verifizieren (Dev/Staging/Prod) und Service-Worker neu ausliefern.

### Priorität / Schweregrad
Hoch – fehlende Grundhärtung erhöht XSS/Clickjacking-Risiko, insbesondere durch PWA/Service-Worker-Persistenz.
