/**
 * Site chrome: header, mobile navigation, footer.
 * Logo usage follows the Quick Use Instructions:
 *   - horizontal, no tagline, in the header (the tagline would fall below the
 *     12px legibility floor at header size);
 *   - reversed colourway on the navy footer;
 *   - clear space of x = a quarter of the symbol height held by CSS padding.
 */
const { esc, attr, button } = require('./primitives');

function header(site, currentPath) {
  const links = site.navigation.map(item => {
    const current = item.href === currentPath;
    return `<li><a class="site-nav__link" href="${esc(item.href)}"${attr('aria-current', current ? 'page' : null)}>${esc(item.label)}</a></li>`;
  }).join('\n              ');

  const mobileLinks = site.navigation.map(item => {
    const current = item.href === currentPath;
    return `<li><a class="mobile-nav__link" href="${esc(item.href)}"${attr('aria-current', current ? 'page' : null)}>${esc(item.label)}</a></li>`;
  }).join('\n              ');

  return `
  <header class="site-header" data-site-header>
    <div class="container site-header__inner">
      <a class="site-header__logo" href="/" aria-label="${esc(site.brandName)} — home">
        <img src="/assets/brand/logo-horizontal-primary.png" srcset="/assets/brand/logo-horizontal-primary.png 1x, /assets/brand/logo-horizontal-primary@2x.png 2x" width="1568" height="336"
             alt="${esc(site.brandName)}" fetchpriority="high" decoding="async">
      </a>

      <nav class="site-nav" aria-label="Primary">
        <ul class="site-nav__list">
              ${links}
        </ul>
        ${button(site.headerAction, 'secondary')}
      </nav>

      <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="mobile-nav" data-nav-toggle>
        <span class="nav-toggle__bars" aria-hidden="true"></span>
        <span>Menu</span>
      </button>
    </div>

    <nav class="mobile-nav" id="mobile-nav" aria-label="Primary, mobile" data-open="false" data-mobile-nav>
      <div class="container">
        <ul class="mobile-nav__list">
              ${mobileLinks}
        </ul>
        ${button(site.headerAction, 'primary')}
      </div>
    </nav>
  </header>`;
}

function footer(site) {
  const columns = site.footer.columns.map(col => `
          <div>
            <h2 class="site-footer__heading">${esc(col.heading)}</h2>
            <ul>
              ${col.links.map(l => `<li><a class="site-footer__link" href="${esc(l.href)}">${esc(l.label)}</a></li>`).join('\n              ')}
            </ul>
          </div>`).join('');

  // Only verified identifiers are printed. Everything unconfirmed in site.json
  // is null and is therefore absent from the markup, not shown as a placeholder.
  const legalBits = [
    `© ${new Date().getFullYear()} ${site.legalName}`,
    site.contact.cin ? `CIN ${site.contact.cin}` : null,
  ].filter(Boolean);

  const legalLinks = Object.entries(site.legalPages)
    .filter(([, v]) => v.publish)
    .map(([k]) => `<a class="site-footer__link" href="/${k}/">${k === 'privacy' ? 'Privacy notice' : 'Terms'}</a>`)
    .join('\n        ');

  return `
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__top">
        <div>
          <a class="site-footer__logo" href="/" aria-label="${esc(site.brandName)} — home">
            <img src="/assets/brand/logo-horizontal-reversed.png" srcset="/assets/brand/logo-horizontal-reversed.png 1x, /assets/brand/logo-horizontal-reversed@2x.png 2x" width="1568" height="336"
                 alt="${esc(site.brandName)}" loading="lazy" decoding="async">
          </a>
          <p class="site-footer__description">${esc(site.footer.description)}</p>
        </div>
        <div class="site-footer__columns">${columns}
        </div>
      </div>
      <div class="site-footer__bottom">
        <p>${esc(legalBits.join('  ·  '))}</p>
        ${legalLinks ? `<p>${legalLinks}</p>` : ''}
        <p>${esc(site.tagline)}</p>
      </div>
    </div>
  </footer>`;
}

module.exports = { header, footer };
