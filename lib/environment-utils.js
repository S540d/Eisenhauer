/**
 * Environment Utilities
 *
 * Shared utility functions for environment detection and configuration.
 * Used by build-config.js and set-base-url.js to avoid code duplication.
 */

/**
 * Determine the current environment from NODE_ENV or APP_ENV
 * @returns {string} The environment name (production, staging, or testing)
 */
export function getEnvironment() {
    const env = process.env.NODE_ENV || process.env.APP_ENV || 'production';
    const validEnvs = ['production', 'staging', 'testing'];

    if (!validEnvs.includes(env)) {
        console.warn(`⚠️  Invalid environment "${env}", defaulting to "production"`);
        return 'production';
    }

    return env;
}

/**
 * Get the base URL for a given environment
 * @param {string} env - The environment name
 * @returns {string} The base URL path
 */
export function getBaseUrl(env) {
    const baseUrls = {
        production: '/Eisenhauer/',
        staging: '/Eisenhauer/staging/',
        testing: '/Eisenhauer/testing/'
    };
    return baseUrls[env] || baseUrls.production;
}
