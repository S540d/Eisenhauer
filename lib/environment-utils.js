/**
 * Environment Utilities
 * Helper functions for environment detection and configuration
 */

import fs from 'fs';
import path from 'path';

/**
 * Get the current environment from process.env or defaults to 'production'
 * Priority: VITE_ENV > NODE_ENV > 'production'
 */
export function getEnvironment() {
  return process.env.VITE_ENV || process.env.NODE_ENV || 'production';
}

/**
 * Get the base URL for the current environment
 * @param {string} environment - The environment name
 * @returns {string} The base URL
 */
export function getBaseUrl(environment) {
  switch (environment) {
    case 'testing':
      return '/Eisenhauer/testing/';
    case 'staging':
      return '/Eisenhauer/staging/';
    case 'production':
    default:
      return '/Eisenhauer/';
  }
}
