#!/usr/bin/env node

/**
 * Post-Build Cache Busting Script
 * Runs AFTER vite build to inject cache-busting mechanisms
 *
 * This ensures users always get the latest version, not a cached old version.
 *
 * Strategies:
 * 1. Add build timestamp to version.json
 * 2. Add build hash to HTML as meta tag
 * 3. Force Service Worker update
 * 4. Update manifest with new version info
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Paths
const distPath = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distPath, 'index.html');
const versionJsonPath = path.join(distPath, 'version.json');
const packageJsonPath = path.join(__dirname, 'package.json');

console.log('🔨 Running post-build cache-busting...');

try {
  // 1. Read package.json for version
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const VERSION = packageJson.version;

  // 2. Generate build hash from current timestamp
  const now = new Date();
  const buildTime = now.getTime();
  const buildDate = now.toISOString().split('T')[0];
  const buildHash = crypto
    .createHash('md5')
    .update(buildTime.toString())
    .digest('hex')
    .substring(0, 8);

  console.log(`📦 Version: ${VERSION}`);
  console.log(`⏱️  Build Time: ${buildTime}`);
  console.log(`🔑 Build Hash: ${buildHash}`);

  // 3. Update version.json with new build info
  if (fs.existsSync(versionJsonPath)) {
    const versionJson = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));
    versionJson.version = VERSION;
    versionJson.buildDate = buildDate;
    versionJson.buildTime = buildTime;
    versionJson.buildHash = buildHash;
    versionJson.timestamp = now.toISOString();
    fs.writeFileSync(versionJsonPath, JSON.stringify(versionJson, null, 2), 'utf8');
    console.log('✅ Updated version.json with build info');
  }

  // 4. Inject cache-busting meta tags into index.html
  if (fs.existsSync(indexHtmlPath)) {
    let html = fs.readFileSync(indexHtmlPath, 'utf8');

    // Add cache-busting meta tag
    const metaTag = `<meta name="build-hash" content="${buildHash}" /><meta name="build-time" content="${buildTime}" />`;

    // Insert after <title> tag
    html = html.replace('</title>', `</title>\n    ${metaTag}`);

    // Add cache-control headers as comments (for reference)
    const cacheComment = `<!-- Cache-Busting Info: v${VERSION} (${buildHash}) built at ${buildTime} -->`;
    html = html.replace('<!doctype html>', `${cacheComment}\n<!doctype html>`);

    fs.writeFileSync(indexHtmlPath, html, 'utf8');
    console.log('✅ Injected cache-busting meta tags into index.html');
  }

  // 5. Verify Service Worker was generated
  const swPath = path.join(distPath, 'service-worker.js');
  if (fs.existsSync(swPath)) {
    const swContent = fs.readFileSync(swPath, 'utf8');
    const swSize = (swContent.length / 1024).toFixed(2);
    console.log(`✅ Service Worker exists (${swSize} KB)`);

    // Check if it has the precache manifest
    if (swContent.includes('precacheAndRoute')) {
      console.log('✅ Service Worker has precache routing');
    }
  }

  // 6. Add version query params to script tags (optional fallback)
  if (fs.existsSync(indexHtmlPath)) {
    let html = fs.readFileSync(indexHtmlPath, 'utf8');

    // Add version query param to module script
    // This is a backup cache-busting strategy
    html = html.replace(/src="(\/Eisenhauer\/assets\/[^"]+\.js)"/g, `src="$1?v=${buildHash}"`);

    fs.writeFileSync(indexHtmlPath, html, 'utf8');
    console.log(`✅ Added query parameter cache-busting (?v=${buildHash})`);
  }

  console.log('\n🎉 Post-build cache-busting complete!');
  console.log(`\nCache busting info for deployment:`);
  console.log(`  Version: ${VERSION}`);
  console.log(`  Build Hash: ${buildHash}`);
  console.log(`  Build Time: ${new Date(buildTime).toISOString()}`);
  console.log(`\nUsers will see a different build hash in their browser's Network tab.`);
  console.log(`Old cached versions will be ignored due to hash change.`);
} catch (error) {
  console.error('❌ Post-build cache-busting failed:', error);
  process.exit(1);
}
