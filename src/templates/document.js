/**
 * The HTML document shell.
 *
 * Metadata rule: anything that depends on an unverified value (the public
 * domain, contact details, social profiles) is omitted rather than guessed.
 * Structured data is only emitted when a base URL has been confirmed, and it
 * carries no claim that is not already approved brand copy.
 */
const fs = require('fs');
const path = require('path');
const { esc } = require('../components/primitives');
const { header, footer } = require('../components/chrome');

function absolute(site, path) {
  if (!site.baseUrl) return null;
  return site.baseUrl.replace(/\/$/, '') + path;
}

function structuredData(site) {
  if (!site.baseUrl) return '';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.brandName,
    legalName: site.legalName,
    description: site.shortIntroduction,
    slogan: site.tagline,
    url: absolute(site, '/'),
    logo: absolute(site, '/assets/brand/icon-navy-1024.png'),
  };
  if (site.social && site.social.length) data.sameAs = site.social;
  if (site.contact.email) data.email = site.contact.email;
  if (site.contact.telephone) data.telephone = site.contact.telephone;
  return `
  <script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function document({ site, page, body, path }) {
  const canonical = absolute(site, path);
  const ogImage = absolute(site, '/assets/brand/og-image.png');
  const title = page.title;
  const description = page.metaDescription;
  // Detect whether self-hosted font files exist in the expected build source
  const ROOT = path.join(__dirname, '..', '..');
  const fontsDir = path.join(ROOT, 'assets', 'fonts');
  const hasInterVariable = fs.existsSync(path.join(fontsDir, 'Inter-Variable.woff2'));
  const hasInterDisplay = fs.existsSync(path.join(fontsDir, 'Inter-Display.woff2'));

  return `<!DOCTYPE html>
<html lang="${esc(site.language)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : '<!-- canonical omitted: public domain not confirmed -->'}
  ${page.noindex ? '<meta name="robots" content="noindex">' : ''}

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(site.brandName)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:locale" content="${esc(site.locale.replace('-', '_'))}">
  ${canonical ? `<meta property="og:url" content="${esc(canonical)}">` : ''}
  ${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(site.brandName)} — ${esc(site.tagline)}">
  <meta name="twitter:card" content="summary_large_image">` : ''}

  <meta name="theme-color" content="#0B2D4B">
  <link rel="icon" href="/assets/brand/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="icon" href="/assets/brand/favicon-16.png" sizes="16x16" type="image/png">
  <link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png">

  ${site.fonts && site.fonts.selfHosted && hasInterVariable && hasInterDisplay
    ? `
  <link rel="preload" href="/assets/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/Inter-Display.woff2" as="font" type="font/woff2" crossorigin>
  <!-- self-hosted fonts: fonts.css is merged into accelity.css via the build -->
  `
    : `
  <link rel="preconnect" href="https://rsms.me" crossorigin>
  <link rel="stylesheet" href="${esc(site.fonts.cdn)}">
  `}
  <link rel="stylesheet" href="/assets/accelity.css">
${structuredData(site)}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
${header(site, path)}

  <main id="main">
${body}
  </main>

${footer(site)}
  <script src="/assets/accelity.js" defer></script>
</body>
</html>
`;
}

module.exports = { document };
