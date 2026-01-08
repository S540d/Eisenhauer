#!/usr/bin/env node

/**
 * Set Base URL Script
 *
 * This script injects the correct <base href="..."> tag into index.html
 * based on the target environment.
 *
 * This eliminates the need for sed injections in GitHub Actions!
 *
 * Usage: NODE_ENV=staging node set-base-url.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine environment
function getEnvironment() {
    const env = process.env.NODE_ENV || process.env.APP_ENV || 'production';
    const validEnvs = ['production', 'staging', 'testing'];

    if (!validEnvs.includes(env)) {
        console.warn(`⚠️  Invalid environment "${env}", defaulting to "production"`);
        return 'production';
    }

    return env;
}

// Get base URL for environment
function getBaseUrl(env) {
    const baseUrls = {
        production: '/Eisenhauer/',
        staging: '/Eisenhauer/staging/',
        testing: '/Eisenhauer/testing/'
    };
    return baseUrls[env] || baseUrls.production;
}

// Inject or update base href in index.html
function setBaseHref(environment, baseUrl) {
    const indexPath = path.join(__dirname, 'index.html');

    if (!fs.existsSync(indexPath)) {
        console.error('❌ Error: index.html not found!');
        process.exit(1);
    }

    let html = fs.readFileSync(indexPath, 'utf8');

    // Check if base href already exists
    const baseHrefRegex = /<base\s+href="[^"]*"\s*\/?>/i;

    if (baseHrefRegex.test(html)) {
        // Update existing base href
        html = html.replace(baseHrefRegex, `<base href="${baseUrl}">`);
        console.log('✅ Updated existing <base href>');
    } else {
        // Insert new base href before </head>
        const headCloseRegex = /<\/head>/i;
        if (!headCloseRegex.test(html)) {
            console.error('❌ Error: </head> tag not found in index.html!');
            process.exit(1);
        }
        html = html.replace(headCloseRegex, `    <base href="${baseUrl}">\n</head>`);
        console.log('✅ Inserted new <base href>');
    }

    // Optionally add environment marker to body
    const bodyTagRegex = /<body[^>]*>/i;
    if (bodyTagRegex.test(html) && !html.includes('data-environment=')) {
        html = html.replace(bodyTagRegex, (match) => {
            return match.replace('>', ` data-environment="${environment}">`);
        });
        console.log(`✅ Added data-environment="${environment}" to <body>`);
    }

    fs.writeFileSync(indexPath, html, 'utf8');
    // debug: Build script output
    console.log(`📝 index.html updated for ${environment}`);
    // debug: Build script output
    console.log(`🔗 Base URL: ${baseUrl}`);
}

// Main
try {
    const environment = getEnvironment();
    const baseUrl = getBaseUrl(environment);

    // debug: Build script output
    console.log('🔧 Setting base URL in index.html...');
    // debug: Build script output
    console.log(`🌍 Target environment: ${environment}`);

    setBaseHref(environment, baseUrl);
    // debug: Build script output
    console.log('🎉 Base URL set successfully!');

} catch (error) {
    console.error('❌ Failed to set base URL:', error.message);
    process.exit(1);
}
