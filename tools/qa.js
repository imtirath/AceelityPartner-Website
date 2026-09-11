#!/usr/bin/env node
/**
 * Accelity Partners — build QA.
 *
 * Runs against dist/, so it checks what would actually be deployed rather than
 * what the source intends. It is not a substitute for a screen-reader pass or a
 * real-device test; it catches the regressions that are cheap to catch.
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const results = [];
let failures = 0;

function check(name, ok, detail) {
  results.push({ name, ok, detail });
  if (!ok) failures++;
}

function htmlFiles(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) htmlFiles(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

/* ---------- contrast ----------------------------------------------------- */
function luminance(hex) {
  const [r, g, b] = hex.match(/\w\w/g).map(h => {
    const c = parseInt(h, 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const NAVY = '0B2D4B', ORANGE = 'F58220', WHITE = 'FFFFFF', SLATE = '536575', MIST = 'F4F6F8';
const PAIRS = [
  ['Body text — navy on white', NAVY, WHITE, 4.5],
  ['Secondary text — slate on white', SLATE, WHITE, 4.5],
  ['Secondary text — slate on mist', SLATE, MIST, 4.5],
  ['Primary button rest — navy on orange', NAVY, ORANGE, 4.5],
  ['Primary button hover — white on navy', WHITE, NAVY, 4.5],
  ['Inverse body — white on navy', WHITE, NAVY, 4.5],
  ['Focus ring — navy on white', NAVY, WHITE, 3],
  ['Focus ring (inverse) — white on navy', WHITE, NAVY, 3],
];
for (const [label, fg, bg, min] of PAIRS) {
  const r = ratio(fg, bg);
  check(`contrast: ${label}`, r >= min, `${r.toFixed(2)}:1 (needs ${min}:1)`);
}
check('contrast: white on orange is NOT used for text',
  !fs.readFileSync(path.join(DIST, 'assets', 'accelity.css'), 'utf8')
    .match(/color:\s*var\(--accelity-white\)[^}]*background:\s*var\(--accent\)/),
  `white on orange is ${ratio(WHITE, ORANGE).toFixed(2)}:1 — below the text floor`);

/* ---------- per-page structure ------------------------------------------ */
const BANNED = ['undefined', 'BRAND_INPUT_REQUIRED', 'Lorem ipsum', 'TODO', 'coming soon', 'Company Name'];

for (const file of htmlFiles(DIST)) {
  const rel = '/' + path.relative(DIST, file).replace(/index\.html$/, '');
  const html = fs.readFileSync(file, 'utf8');
  const tag = name => rel.padEnd(12) + name;

  // language + title + description
  check(tag('has lang attribute'), /<html lang="[a-z-]+"/.test(html));
  const title = (html.match(/<title>(.*?)<\/title>/s) || [])[1] || '';
  check(tag('title 15–70 chars'), title.length >= 15 && title.length <= 70, `${title.length} chars`);
  const desc = (html.match(/<meta name="description" content="(.*?)"/s) || [])[1] || '';
  check(tag('meta description 50–170 chars'), desc.length >= 50 && desc.length <= 170, `${desc.length} chars`);

  // heading hierarchy
  const levels = [...html.matchAll(/<h([1-4])[\s>]/g)].map(m => Number(m[1]));
  check(tag('exactly one h1'), levels.filter(l => l === 1).length === 1);
  let skip = null;
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) skip = `h${levels[i - 1]} → h${levels[i]}`;
  }
  check(tag('no heading level skipped'), skip === null, skip);

  // images
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
  check(tag('every image has alt'), imgs.every(i => /\balt="/.test(i)));
  check(tag('every image has width+height'), imgs.every(i => /\bwidth="/.test(i) && /\bheight="/.test(i)));

  // links and buttons have accessible names
  const emptyLinks = [...html.matchAll(/<a\b[^>]*>(\s*)<\/a>/g)].length;
  check(tag('no empty links'), emptyLinks === 0);

  // landmarks
  check(tag('has main landmark'), /<main id="main">/.test(html));
  check(tag('has skip link'), /class="skip-link"/.test(html));

  // form labelling
  const controls = [...html.matchAll(/<(input|textarea|select)\b[^>]*id="([^"]+)"/g)].map(m => m[2]);
  const labelled = controls.every(id => html.includes(`for="${id}"`));
  check(tag('every form control has a label'), labelled);

  // placeholder / filler copy
  const found = BANNED.filter(b => html.toLowerCase().includes(b.toLowerCase()));
  check(tag('no placeholder copy'), found.length === 0, found.join(', '));

  // no inline event handlers (CSP-friendly)
  check(tag('no inline event handlers'), !/\son[a-z]+="/.test(html));
}

/* ---------- weight budget ----------------------------------------------- */
const cssKB = fs.statSync(path.join(DIST, 'assets', 'accelity.css')).size / 1024;
const jsKB = fs.statSync(path.join(DIST, 'assets', 'accelity.js')).size / 1024;
check('CSS under 40 KB budget', cssKB < 40, `${cssKB.toFixed(1)} KB`);
check('JS under 5 KB budget', jsKB < 5, `${jsKB.toFixed(1)} KB`);

/* ---------- report ------------------------------------------------------- */
const grouped = {};
for (const r of results) {
  const key = r.name.startsWith('/') ? r.name.slice(0, 12).trim() || '/' : 'global';
  (grouped[key] = grouped[key] || []).push(r);
}
console.log('\n  QA report\n');
for (const [group, items] of Object.entries(grouped)) {
  const bad = items.filter(i => !i.ok);
  if (bad.length === 0) {
    console.log(`  pass  ${group.padEnd(14)} ${items.length} checks`);
  } else {
    console.log(`  FAIL  ${group.padEnd(14)} ${bad.length}/${items.length} failing`);
    bad.forEach(b => console.log(`        - ${b.name.replace(group, '').trim()}${b.detail ? ` (${b.detail})` : ''}`));
  }
}
console.log(`\n  ${results.length - failures}/${results.length} checks passed\n`);
process.exit(failures ? 1 : 0);
