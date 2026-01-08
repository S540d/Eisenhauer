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
import { getEnvironment, getBaseUrl } from './lib/environment-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inject or update base href in index.html
function setBaseHref(environment, baseUrl) {
    const indexPath = path.join(__dirname, 'index.html');

    if (!fs.existsSync(indexPath)) {
        console.error('❌ Error: index.html not found!');
        process.exit(1);
    }

    let html = fs.readFileSync(indexPath, 'utf8');

    // Check if base href already exists (allow attributes in any order)
    const baseHrefRegex = /<base\s+[^>]*href="[^"]*"[^>]*>/i;

    if (baseHrefRegex.test(html)) {
        // Update existing base href
        html = html.replace(baseHrefRegex, `<base href="${baseUrl}">`);
        // debug: Build script output
        console.log('✅ Updated existing <base href>');
    } else {
        // Insert new base href before </head>
        const headCloseRegex = /<\/head>/i;
        if (!headCloseRegex.test(html)) {
            console.error('❌ Error: </head> tag not found in index.html!');
            process.exit(1);
        }
        html = html.replace(headCloseRegex, `    <base href="${baseUrl}">\n</head>`);
        // debug: Build script output
        console.log('✅ Inserted new <base href>');
    }

    // Add or update environment marker on <body>
    const bodyTagRegex = /<body\b([^>]*)>/i;
    if (bodyTagRegex.test(html)) {
        html = html.replace(bodyTagRegex, (match, attrs) => {
            // If body already has a data-environment attribute, update it
            if (/data-environment\s*=\s*"/i.test(attrs)) {
                const updatedAttrs = attrs.replace(
                    /data-environment\s*=\s*"[^"]*"/i,
                    `data-environment="${environment}"`
                );
                return `<body${updatedAttrs}>`;
            }
            // Otherwise, add a new data-environment attribute
            return `<body${attrs} data-environment="${environment}">`;
        });
        // debug: Build script output
        console.log(`✅ Ensured data-environment="${environment}" on <body>`);
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
