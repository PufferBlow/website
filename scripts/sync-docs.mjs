#!/usr/bin/env node
// Sync pufferblow/docs/ → website/src/content/docs/.
//
// Why this exists: the website bundles markdown at build time via
// import.meta.glob, so docs are a snapshot. This script refreshes the
// snapshot. The destination tree is wiped first so deletions in the source
// propagate; if you want to drop a page from the public site without
// removing it from the server repo, edit src/docs/manifest.ts instead.
//
// Usage:
//   node scripts/sync-docs.mjs           # default: ../pufferblow/docs
//   node scripts/sync-docs.mjs <src>     # custom source path
//   npm run sync:docs

import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { copyFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WEBSITE_ROOT = resolve(__dirname, "..");
const DEFAULT_SOURCE = resolve(WEBSITE_ROOT, "..", "pufferblow", "docs");
const DESTINATION = resolve(WEBSITE_ROOT, "src", "content", "docs");

const sourceArg = process.argv[2];
const SOURCE = sourceArg ? resolve(process.cwd(), sourceArg) : DEFAULT_SOURCE;

function fail(msg) {
  console.error(`✖ ${msg}`);
  process.exit(1);
}

if (!existsSync(SOURCE)) {
  fail(`Source not found: ${SOURCE}\nPass a path explicitly: node scripts/sync-docs.mjs <path>`);
}
if (!statSync(SOURCE).isDirectory()) {
  fail(`Source is not a directory: ${SOURCE}`);
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.isFile() && entry.name.endsWith(".md")) acc.push(full);
  }
  return acc;
}

const markdownFiles = walk(SOURCE);
if (markdownFiles.length === 0) {
  fail(`No .md files found under ${SOURCE}`);
}

console.log(`Syncing ${markdownFiles.length} markdown file(s)`);
console.log(`  from: ${SOURCE}`);
console.log(`  to:   ${DESTINATION}`);

// Wipe the destination so removals in the source propagate. This only
// touches src/content/docs/, which is wholly owned by this script.
if (existsSync(DESTINATION)) {
  rmSync(DESTINATION, { recursive: true, force: true });
}
mkdirSync(DESTINATION, { recursive: true });

for (const sourcePath of markdownFiles) {
  const rel = relative(SOURCE, sourcePath);
  const destPath = join(DESTINATION, rel);
  mkdirSync(dirname(destPath), { recursive: true });
  copyFileSync(sourcePath, destPath);
  console.log(`  ✓ ${rel.replace(/\\/g, "/")}`);
}

console.log(
  `\nDone. If you added or removed pages, update src/docs/manifest.ts to match.`,
);
