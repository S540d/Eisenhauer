/**
 * Environment Configuration
 *
 * Build-time environment detection via Vite:
 * - Production: https://s540d.github.io/Eisenhauer/
 * - Staging: https://s540d.github.io/Eisenhauer/staging/
 * - Testing: https://s540d.github.io/Eisenhauer/testing/
 *
 * Environment is set at build time via VITE_ENV in .env files.
 *
 * Updated: 2026-02-01
 */

/**
 * @typedef {'production' | 'staging' | 'testing'} Environment
 */

/**
 * Get current environment from Vite build-time configuration
 * @returns {Environment} Current environment
 */
export function detectEnvironment() {
  // Use Vite's import.meta.env which is replaced at build time
  const env = import.meta.env.VITE_ENV;

  if (env === 'testing') return 'testing';
  if (env === 'staging') return 'staging';
  return 'production';
}

/**
 * Get configuration object for current environment
 * @returns {Object} Configuration object
 */
export function getConfig() {
  const environment = detectEnvironment();

  const baseConfig = {
    environment,
    isDevelopment: import.meta.env.DEV || false,
    isTesting: environment === 'testing',
    isStaging: environment === 'staging',
    isProduction: environment === 'production',
  };

  return baseConfig;
}

/**
 * Get environment indicator for UI
 * @returns {string} Environment label ('TESTING', 'STAGING', or empty for production)
 */
export function getEnvironmentLabel() {
  const config = getConfig();
  if (config.isTesting) return 'TESTING';
  if (config.isStaging) return 'STAGING';
  return '';
}

/**
 * Check if running in testing environment
 * @returns {boolean} True if testing
 */
export function isTesting() {
  return getConfig().isTesting;
}

/**
 * Check if running in staging environment
 * @returns {boolean} True if staging
 */
export function isStaging() {
  return getConfig().isStaging;
}

/**
 * Check if running in production environment
 * @returns {boolean} True if production
 */
export function isProduction() {
  return getConfig().isProduction;
}

/**
 * Get the base URL for the current environment
 * @returns {string} Base URL path
 */
export function getBaseUrl() {
  const env = detectEnvironment();
  switch (env) {
    case 'testing':
      return '/Eisenhauer/testing/';
    case 'staging':
      return '/Eisenhauer/staging/';
    default:
      return '/Eisenhauer/';
  }
}
