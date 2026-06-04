#!/usr/bin/env node

/**
 * Version Update Script: Update version strings across all files
 *
 * This script updates version numbers and cache-busting parameters
 * in all relevant files to ensure browsers load the latest version.
 *
 * Usage: node update-version.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read package.json to get current version
const packagePath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const VERSION = packageJson.version;
const BUILD_DATE = new Date().toISOString().split('T')[0];

// Update version.json
const versionJsonPath = path.join(__dirname, 'version.json');
if (fs.existsSync(versionJsonPath)) {
  const versionJson = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));
  versionJson.version = VERSION;
  versionJson.buildDate = BUILD_DATE;
  versionJson.buildTime = Date.now();
  versionJson.timestamp = new Date().toISOString();
  fs.writeFileSync(versionJsonPath, JSON.stringify(versionJson, null, 2) + '\n', 'utf8');
  console.log(`✅ version.json → ${VERSION}`);
}

// Update Android/app/build.gradle versionName
const buildGradlePath = path.join(__dirname, 'Android/app/build.gradle');
if (fs.existsSync(buildGradlePath)) {
  let gradle = fs.readFileSync(buildGradlePath, 'utf8');
  gradle = gradle.replace(/versionName\s+"[0-9.]+"/, `versionName "${VERSION}"`);
  fs.writeFileSync(buildGradlePath, gradle, 'utf8');
  console.log(`✅ Android/app/build.gradle versionName → ${VERSION}`);
}

// Files to update
const updates = [
  {
    file: 'index.html',
    replacements: [
      {
        search: /style\.css\?v=[0-9.]+/g,
        replace: `style.css?v=${VERSION}`,
      },
      {
        search: /script\.js\?v=[0-9.]+/g,
        replace: `script.js?v=${VERSION}`,
      },
      {
        search: /firebase-config\.js\?v=[0-9.]+/g,
        replace: `firebase-config.js?v=${VERSION}`,
      },
      {
        search: /auth\.js\?v=[0-9.]+/g,
        replace: `auth.js?v=${VERSION}`,
      },
    ],
  },
  {
    file: 'service-worker.js',
    replacements: [
      {
        search: /const CACHE_VERSION = '[0-9.]+';/,
        replace: `const CACHE_VERSION = '${VERSION}';`,
      },
      {
        search: /const BUILD_DATE = '[0-9-]+';/,
        replace: `const BUILD_DATE = '${BUILD_DATE}';`,
      },
    ],
  },
  {
    file: 'manifest.json',
    replacements: [
      {
        search: /"version": "[0-9.]+"/,
        replace: `"version": "${VERSION}"`,
      },
    ],
  },
];

// Perform updates
updates.forEach(({ file, replacements }) => {
  const filePath = path.join(__dirname, file);

  if (!fs.existsSync(filePath)) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  replacements.forEach(({ search, replace }) => {
    if (content.match(search)) {
      content = content.replace(search, replace);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
