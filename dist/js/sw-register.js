// Only register service worker in production builds (not in Vite dev mode)
// Dev mode check: explicit localhost-style hosts instead of relying on port
const devHosts = ['localhost', '127.0.0.1', '[::1]'];
const isProduction = !devHosts.includes(window.location.hostname);

if ('serviceWorker' in navigator && isProduction) {
  let refreshing = false;

  // Detect current environment from URL path using robust path matching
  const currentPath = window.location.pathname;
  const pathSegments = currentPath.split('/').filter(Boolean);
  let currentEnvironment = 'production';

  // Use lastIndexOf to find the rightmost occurrence of staging/testing
  const stagingIndex = pathSegments.lastIndexOf('staging');
  const testingIndex = pathSegments.lastIndexOf('testing');

  if (stagingIndex !== -1 && stagingIndex > testingIndex) {
    currentEnvironment = 'staging';
  } else if (testingIndex !== -1) {
    currentEnvironment = 'testing';
  }

  // Get build hash from meta tag (added by post-build.js)
  const buildHashElement = document.querySelector('meta[name="build-hash"]');
  const currentBuildHash = buildHashElement ? buildHashElement.content : Date.now().toString();

  // Store current environment in localStorage
  const cachedEnvironment = localStorage.getItem('sw-environment');
  const environmentChanged = cachedEnvironment !== null && cachedEnvironment !== currentEnvironment;
  const isFirstVisit = cachedEnvironment === null;

  // Store current build hash in localStorage (environment-specific key)
  const buildHashKey = `sw-build-hash-${currentEnvironment}`;
  const cachedBuildHash = localStorage.getItem(buildHashKey);
  const buildHashChanged = cachedBuildHash !== null && cachedBuildHash !== currentBuildHash;

  // Clear caches if environment changed, build hash changed, or first visit
  const shouldClearCache = environmentChanged || buildHashChanged || isFirstVisit;

  if (shouldClearCache) {
    const reason = environmentChanged
      ? `Environment changed (${cachedEnvironment} → ${currentEnvironment})`
      : buildHashChanged
        ? `Build hash changed (${cachedBuildHash} → ${currentBuildHash})`
        : 'First visit - establishing fresh cache';
    console.info(`[Service Worker] ${reason}. Clearing caches...`);

    // Clear all caches to force fresh content
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }

    // Always clear old build hashes from other environments (not just on environment change)
    ['production', 'staging', 'testing'].forEach((env) => {
      if (env !== currentEnvironment) {
        localStorage.removeItem(`sw-build-hash-${env}`);
      }
    });
  }

  localStorage.setItem('sw-environment', currentEnvironment);
  localStorage.setItem(buildHashKey, currentBuildHash);

  // Reload page when new service worker takes over
  // ONLY if it's not the first load to avoid reload loops
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;

    // Only reload if we already had a controller (i.e., this is an update, not first install)
    // and if we haven't reloaded in this session yet
    const hasController = !!navigator.serviceWorker.controller;
    const sessionReloaded = sessionStorage.getItem('sw-reloaded');

    if (hasController && !sessionReloaded) {
      refreshing = true;
      sessionStorage.setItem('sw-reloaded', 'true');
      console.info('[Service Worker] Controller changed, reloading page...');
      window.location.reload();
    }
  });

  window.addEventListener('load', () => {
    // Register with cache busting query parameter
    const swUrl = `./service-worker.js?v=${currentBuildHash}`;

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.info('[Service Worker] Registered:', swUrl);

        // Check for updates on page load (less aggressive)
        if (registration.active) {
          registration.update();
        }

        // Check for updates every 60 seconds (less aggressive than 10s)
        setInterval(() => {
          registration.update();
        }, 60000);

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          console.info('[Service Worker] New version found, waiting for activation...');
        });
      })
      .catch((error) => {
        console.error('[Service Worker] Registration failed:', error);
      });
  });
}
