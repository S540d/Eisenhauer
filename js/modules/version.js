/**
 * Version Module
 * Handles app version loading and display
 */

export let APP_VERSION = 'v1.9.0'; // Fallback version
export const BUILD_DATE = new Date().toISOString().split('T')[0];

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
  } catch (error) {
    // Silently use fallback version if loading fails
    console.debug('Using fallback version:', APP_VERSION); // debug:
    return APP_VERSION;
  }
}

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

export async function initVersion() {
  await loadVersion();
  displayVersion();
}
