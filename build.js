#!/usr/bin/env node
/**
 * Accelity Partners — build.
 *
 *   content/  (data)  ->  src/components (markup)  ->  dist/ (deployable)
 *
 * No dependencies, no network access, no framework. The output is plain static
 * files that any host or CDN can serve, and the same content/component split
 * ports directly to a server-rendered framework if the team chooses one later.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

const { renderSection } = require('./src/components/sections');
const { document } = require('./src/templates/document');
const { esc } = require('./src/components/primitives');

const PAGES = ['home', 'about', 'approach', 'portfolio', 'purpose', 'connect'];

function readJSON(...p) { return JSON.parse(fs.readFileSync(path.join(ROOT, ...p), 'utf8')); }

function rimraf(dir) { fs.rmSync(dir, { recursive: true, force: true }); }

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else fs.copyFileSync(src, dest);
  }
}

function write(relPath, contents) {
  const full = path.join(DIST, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, contents);
  return Buffer.byteLength(contents);
}

/* -- Minimal, safe CSS/JS squeeze. Comments and indentation only. --------- */
function squeezeCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\n\s*\n/g, '\n')
    .replace(/^\s+/gm, '')
    .trim() + '\n';
}
function squeezeJS(js) {
  return js
    .split('\n')
    .filter(line => !/^\s*(\/\/|\/\*|\*)/.test(line))
    .map(line => line.replace(/\s+$/, ''))
    .filter(line => line.trim() !== '')
    .join('\n');
}

function notFoundPage(site) {
  return `
  <section class="error-page">
    <div class="container">
      <p class="error-page__code">Page not found</p>
      <h1 class="error-page__heading">That page is not here.</h1>
      <p class="error-page__body">The address may have changed, or the page may never have been published. The main sections of the site are in the navigation above.</p>
      <div class="button-row" style="margin-top:var(--space-12)">
        <a class="button button--primary" href="/">Go to the home page</a>
        <a class="button button--secondary" href="/connect/">Connect with us</a>
      </div>
    </div>
  </section>`;
}

function main() {
  const site = readJSON('content', 'site.json');
  const ventures = fs.existsSync(path.join(ROOT, 'content', 'ventures.public.json'))
    ? readJSON('content', 'ventures.public.json')
    : { ventures: [] };

  const ctx = { site, ventures };
  const warnings = [];
  const built = [];

  rimraf(DIST);
  fs.mkdirSync(DIST, { recursive: true });

  /* --- Pages ------------------------------------------------------------ */
  for (const name of PAGES) {
    const page = readJSON('content', 'pages', `${name}.json`);
    const routePath = page.slug ? `/${page.slug}/` : '/';
    const body = page.sections.map(s => renderSection(s, ctx)).join('\n');
    const html = document({ site, page, body, path: routePath });
    const out = page.slug ? path.join(page.slug, 'index.html') : 'index.html';
    built.push([routePath, write(out, html)]);
  }

  /* --- 404 -------------------------------------------------------------- */
  const notFound = document({
    site,
    page: { title: `Page not found — ${site.brandName}`, metaDescription: 'The page you requested is not available. Use the navigation to reach the main sections of the Accelity Partners site.', noindex: true },
    body: notFoundPage(site),
    path: '/404.html',
  });
  built.push(['/404.html', write('404.html', notFound)]);

  /* --- Legal pages: only when reviewed and approved --------------------- */
  for (const [key, cfg] of Object.entries(site.legalPages)) {
    if (!cfg.publish) warnings.push(`/${key}/ not built — ${cfg.reason}`);
  }

  /* --- Styles and script ------------------------------------------------ */
  const css = ['fonts', 'tokens', 'base', 'components']
    .map(f => fs.readFileSync(path.join(ROOT, 'src', 'styles', `${f}.css`), 'utf8'))
    .join('\n');
  const cssBytes = write('assets/accelity.css', squeezeCSS(css));
  const jsBytes = write('assets/accelity.js', squeezeJS(fs.readFileSync(path.join(ROOT, 'src', 'scripts', 'site.js'), 'utf8')));

  /* --- Brand assets ----------------------------------------------------- */
  copyDir(path.join(ROOT, 'assets', 'brand'), path.join(DIST, 'assets', 'brand'));
  // Provide high-density fallbacks for brand assets by duplicating files
  try {
    const brandDist = path.join(DIST, 'assets', 'brand');
    const dupMap = [
      ['logo-horizontal-primary.png', 'logo-horizontal-primary@2x.png'],
      ['logo-horizontal-reversed.png', 'logo-horizontal-reversed@2x.png'],
      ['logo-stacked-primary.png', 'logo-stacked-primary@2x.png'],
      ['logo-stacked-reversed.png', 'logo-stacked-reversed@2x.png'],
      ['logo-horizontal-tagline-primary.png', 'logo-horizontal-tagline-primary@2x.png'],
      ['og-image.png', 'og-image@2x.png'],
    ];
    for (const [srcName, dstName] of dupMap) {
      const src = path.join(brandDist, srcName);
      const dst = path.join(brandDist, dstName);
      if (fs.existsSync(src) && !fs.existsSync(dst)) fs.copyFileSync(src, dst);
    }
  } catch (e) {
    // non-fatal — duplication is best-effort
  }
  // Copy any self-hosted fonts placed in assets/fonts
  if (fs.existsSync(path.join(ROOT, 'assets', 'fonts'))) {
    copyDir(path.join(ROOT, 'assets', 'fonts'), path.join(DIST, 'assets', 'fonts'));
  }
  // Hero imagery (e.g. the mountain photograph behind the home hero)
  if (fs.existsSync(path.join(ROOT, 'assets', 'hero'))) {
    copyDir(path.join(ROOT, 'assets', 'hero'), path.join(DIST, 'assets', 'hero'));
  }

  /* --- robots.txt and sitemap ------------------------------------------- */
  const routes = built.filter(([p]) => !p.endsWith('.html')).map(([p]) => p);
  let robots = 'User-agent: *\nAllow: /\n';
  if (site.baseUrl) {
    robots += `Sitemap: ${site.baseUrl.replace(/\/$/, '')}/sitemap.xml\n`;
    const urls = routes.map(r => `  <url><loc>${esc(site.baseUrl.replace(/\/$/, '') + r)}</loc></url>`).join('\n');
    write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  } else {
    warnings.push('sitemap.xml and canonical URLs omitted — set "baseUrl" in content/site.json once the public domain is confirmed');
  }
  write('robots.txt', robots);

  /* --- Disclosure guard -------------------------------------------------
     A build-time assertion, not a comment: if any internal identifier ever
     reaches the deployable output, the build fails instead of shipping. */
  const register = readJSON('private', 'venture-register.team.json');
  const restricted = new Set();
  for (const r of register.records) {
    if (r.entity_name_as_discussed) restricted.add(r.entity_name_as_discussed);
    if (r.market_facing_brand) restricted.add(r.market_facing_brand);
  }
  const allowed = new Set((ventures.ventures || []).map(v => v.brand));
  const leaks = [];
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(p); continue; }
      if (!/\.(html|css|js|json|xml|txt|map)$/.test(entry.name)) continue;
      const text = fs.readFileSync(p, 'utf8');
      for (const term of restricted) {
        if (allowed.has(term)) continue;
        if (term === 'Accelity Partners' || term === 'Accelity Partners Pvt Ltd') continue; // the parent is the site
        if (text.includes(term)) leaks.push(`${path.relative(DIST, p)} contains "${term}"`);
      }
    }
  };
  walk(DIST);

  /* --- Report ----------------------------------------------------------- */
  console.log('\n  Accelity Partners — build\n');
  for (const [route, bytes] of built) {
    console.log(`  ${route.padEnd(14)} ${(bytes / 1024).toFixed(1).padStart(6)} KB`);
  }
  console.log(`  ${'accelity.css'.padEnd(14)} ${(cssBytes / 1024).toFixed(1).padStart(6)} KB`);
  console.log(`  ${'accelity.js'.padEnd(14)} ${(jsBytes / 1024).toFixed(1).padStart(6)} KB`);

  console.log(`\n  ventures published: ${(ventures.ventures || []).length}`);
  console.log(`  disclosure guard:   ${leaks.length === 0 ? 'pass — no restricted name in any build artefact' : 'FAIL'}`);

  if (warnings.length) {
    console.log('\n  Unresolved, by design:');
    warnings.forEach(w => console.log(`   - ${w}`));
  }

  if (leaks.length) {
    console.error('\n  DISCLOSURE GUARD FAILED:');
    leaks.forEach(l => console.error(`   - ${l}`));
    process.exit(1);
  }
  console.log('');
}

main();
