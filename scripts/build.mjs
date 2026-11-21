#!/usr/bin/env node
// Compiles the portfolio into a fully static dist/ directory:
//   - content/home.html (the page body) is wrapped with the shared
//     head/header/footer partials
//   - assets/ (CSS, JS, fonts, images) is copied through as-is
//
// This intentionally mirrors scripts/build.mjs in the companion blog repo
// (https://github.com/auroxion/blog) — same directory shape, same
// site.config.json-driven metadata, same head/header/footer contract —
// so the two properties can be maintained side by side instead of as two
// unrelated codebases. The portfolio has exactly one page today; if that
// ever changes, collectPosts()-style content discovery can be lifted
// straight from the blog's build script.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { head, header, footer } from './partials.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const ASSETS_DIR = path.join(ROOT, 'assets');
const DIST_DIR = path.join(ROOT, 'dist');
const HOME_CONTENT_PATH = path.join(CONTENT_DIR, 'home.html');
const CONFIG_PATH = path.join(ROOT, 'site.config.json');

function fail(msg) {
  console.error(`\u2717 ${msg}`);
  process.exitCode = 1;
}

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    fail(`site.config.json not found at ${CONFIG_PATH}`);
    return null;
  }
  let config;
  try {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (err) {
    fail(`site.config.json is not valid JSON: ${err.message}`);
    return null;
  }

  const required = ['title', 'brand', 'description', 'author', 'icon', 'blogUrl'];
  const missing = required.filter((key) => !config[key]);
  if (missing.length) fail(`site.config.json is missing required field(s): ${missing.join(', ')}`);
  if (config.nav !== undefined && !Array.isArray(config.nav)) fail('site.config.json "nav" must be an array');

  return process.exitCode ? null : config;
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const from = path.join(srcDir, entry.name);
    const to = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

function renderHome(bodyHtml, config) {
  return `${head({
    title: config.title,
    description: config.description,
    config,
  })}${header({ config, activePath: 'index.html' })}
  <main id="main">
${bodyHtml}
  </main>

${footer({ config })}  <script src="assets/main.js"></script>
</body>
</html>
`;
}

function build() {
  const config = loadConfig();
  if (!config) {
    console.error('\nBuild aborted due to configuration errors above.');
    process.exit(1);
  }

  if (!fs.existsSync(HOME_CONTENT_PATH)) {
    fail(`content/home.html not found at ${HOME_CONTENT_PATH}`);
    console.error('\nBuild aborted: no page content to render.');
    process.exit(1);
  }

  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });

  copyDir(ASSETS_DIR, path.join(DIST_DIR, 'assets'));

  const bodyHtml = fs.readFileSync(HOME_CONTENT_PATH, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), renderHome(bodyHtml, config));

  console.log('\u2713 Built portfolio to dist/');
}

build();
