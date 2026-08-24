/**
 * Version Module
 * Handles app version loading and display
 */

/** Current app version string, updated from version.json once loaded */
export let APP_VERSION = 'v1.9.0'; // Fallback version
/** Build date string, defaults to today until overwritten */
export const BUILD_DATE = new Date().toISOString().split('T')[0];

/**
 * Fetch version.json and update APP_VERSION; falls back silently on error/timeout
 * @returns {Promise<string>} The resolved app version
 */
export async function loadVersion() {
  try {
    // Add timeout to prevent long delays if version.json is missing
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

    const response = await fetch('./version.json', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    APP_VERSION = 'v' + data.version;
    return APP_VERSION;
  } catch (_error) {
    // Silently use fallback version if loading fails
    console.debug('Using fallback version:', APP_VERSION); // debug:
    return APP_VERSION;
  }
}

/** Render APP_VERSION into the version display DOM elements, if present */
export function displayVersion() {
  const versionElement = document.getElementById('versionNumber');
  if (versionElement) {
    versionElement.textContent = APP_VERSION;
  }

  const settingsVersion = document.getElementById('settingsVersion');
  if (settingsVersion) {
    settingsVersion.textContent = `Version: ${APP_VERSION}`;
  }
}

/** Load and display the current app version */
export async function initVersion() {
  await loadVersion();
  displayVersion();
}
