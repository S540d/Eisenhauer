/**
 * DIAGNOSTICS — splash-hang investigation (branch: debug/splash-hang-diagnostics)
 *
 * Purpose: make a fatal startup error VISIBLE on the device instead of leaving
 * the splash screen hanging forever. This is a temporary debug aid; it must be
 * removed (or guarded behind a flag) before any production release.
 *
 * Loaded as a classic script BEFORE script.js so it can also catch:
 *   - uncaught errors thrown from the ES module (script.js)
 *   - unhandled promise rejections during async initApp()
 *   - module import / evaluation failures
 *
 * It does NOT change app logic. It only observes errors and, as a safety net,
 * force-hides the splash after a hard timeout so the user is never stuck.
 */
(function () {
  'use strict';

  const HARD_SPLASH_TIMEOUT_MS = 8000;
  const reported = [];

  function el(id) {
    return document.getElementById(id);
  }

  function showDiag(title, detail, attempt) {
    const box = el('splashDiag');
    const body = el('splashDiagBody');
    if (!box || !body) {
      if ((attempt || 0) < 10) {
        setTimeout(function () {
          showDiag(title, detail, (attempt || 0) + 1);
        }, 200);
      }
      return;
    }
    reported.push(title + '\n' + detail);
    // Keep the splash visible (so the report is readable) but reveal the report.
    const splash = el('splashScreen');
    if (splash) {
      splash.classList.remove('hidden');
      splash.style.display = '';
    }
    box.style.display = 'block';
    body.textContent = reported.join('\n\n──────────\n\n');
  }

  function format(err) {
    if (!err) return '(no error object)';
    if (err instanceof Error) {
      return (
        (err.name || 'Error') + ': ' + (err.message || '') + '\n' + (err.stack || '(no stack)')
      );
    }
    try {
      return typeof err === 'string' ? err : JSON.stringify(err);
    } catch (_e) {
      return String(err);
    }
  }

  function ctx() {
    const nav = navigator || {};
    return (
      'UA: ' +
      (nav.userAgent || '?') +
      '\n' +
      'online: ' +
      (typeof nav.onLine === 'boolean' ? nav.onLine : '?') +
      '\n' +
      'lang: ' +
      (nav.language || '?') +
      '\n' +
      'readyState: ' +
      (document.readyState || '?') +
      '\n' +
      'time: ' +
      new Date().toISOString()
    );
  }

  // --- Global error hooks -------------------------------------------------
  window.addEventListener('error', function (e) {
    // Resource load errors (e.g. failed module import) have no e.error
    let detail = e && e.error ? format(e.error) : (e && e.message) || 'unknown error';
    if (e && e.filename) {
      detail += '\nat ' + e.filename + ':' + e.lineno + ':' + e.colno;
    }
    showDiag('window.error', detail + '\n\n' + ctx());
  });

  window.addEventListener('unhandledrejection', function (e) {
    showDiag('unhandledrejection', format(e && e.reason) + '\n\n' + ctx());
  });

  // Expose a manual reporter so script.js can route caught init errors here.
  window.__diagReport = function (label, err) {
    showDiag(label || 'init error', format(err) + '\n\n' + ctx());
  };

  // --- Copy button --------------------------------------------------------
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'splashDiagCopy') {
      const text = reported.join('\n\n──────────\n\n') + '\n\n' + ctx();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () {
            e.target.textContent = '✓ kopiert';
          },
          function () {
            e.target.textContent = 'Kopieren fehlgeschlagen';
          }
        );
      } else {
        e.target.textContent = 'Clipboard n/a';
      }
    }
  });

  // --- Hard safety net: never let the splash hang forever -----------------
  setTimeout(function () {
    const splash = el('splashScreen');
    // If a diagnostic was shown, KEEP the splash so the report stays readable.
    if (reported.length > 0) return;
    if (splash && !splash.classList.contains('hidden')) {
      // No error captured but still on splash after timeout: surface that fact.
      showDiag(
        'splash-timeout',
        'Splash war nach ' +
          HARD_SPLASH_TIMEOUT_MS +
          'ms noch sichtbar und kein Fehler wurde abgefangen.\n' +
          'initApp() ist vermutlich an einem await hängengeblieben (Firestore/Firebase/Storage).\n\n' +
          ctx()
      );
    }
  }, HARD_SPLASH_TIMEOUT_MS);
})();
