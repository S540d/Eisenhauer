/**
 * Environment Configuration
 *
 * Unterstützt Staging und Production über Query-Parameter:
 * - Production: https://s540d.github.io/Eisenhauer/
 * - Staging: https://s540d.github.io/Eisenhauer/?env=staging
 *
 * Updated: 2026-01-10
 */

/**
 * @typedef {'production' | 'staging'} Environment
 */

/**
 * Detect current environment from URL query parameter
 * @returns {Environment} Current environment
 */
export function detectEnvironment() {
  if (typeof window === 'undefined') return 'production';

  const params = new URLSearchParams(window.location.search);
  const env = params.get('env');

  return env === 'staging' ? 'staging' : 'production';
}

/**
 * Get configuration object for current environment
 * @returns {Object} Configuration object
 */
export function getConfig() {
  const environment = detectEnvironment();

  const baseConfig = {
    environment,
    isDevelopment: false,
    isStaging: environment === 'staging',
    isProduction: environment === 'production',
  };

  return baseConfig;
}

/**
 * Get environment indicator for UI
 * @returns {string} Environment label ('STAGING', 'PRODUCTION', or empty)
 */
export function getEnvironmentLabel() {
  const config = getConfig();
  if (config.isStaging) return 'STAGING';
  return '';
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
