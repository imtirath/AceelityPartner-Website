/**
 * Section components. One renderer per `type` in the page content files.
 * Content never chooses markup directly — it chooses a section type, and the
 * type owns the semantics, the responsive behaviour and the states.
 */
const { esc, attr, spine, button, actionLink, footnote, intro } = require('./primitives');
const { flywheelDiagram } = require('./diagrams');

/* -- Hero -----------------------------------------------------------------
   Restrained line icons for the value-proposition row. Each carries one
   small Acceleration Orange accent; everything else is navy. */
const VALUE_ICONS = {
  sprout: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5V12" stroke="var(--accelity-foundation-navy)" fill="none" stroke-width="1.6" stroke-linecap="round"/><path d="M12 12C12 8 9 6 5 6C5 10 8 12 12 12Z" stroke="var(--accelity-foundation-navy)" fill="none" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 12C12 8.6 14.6 6.8 18 6.6" stroke="var(--accent)" fill="none" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  layers: `<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="12,4 21,8.5 12,13 3,8.5" stroke="var(--accelity-foundation-navy)" fill="none" stroke-width="1.6" stroke-linejoin="round"/><polyline points="4.5,11.5 12,15.4 19.5,11.5" stroke="var(--accelity-foundation-navy)" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><polyline points="4.5,14.9 12,18.8 19.5,14.9" stroke="var(--accent)" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  network: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="2.3" fill="var(--accent)"/><path d="M8 17.6c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="var(--accent)" fill="none" stroke-width="1.6" stroke-linecap="round"/><circle cx="4.8" cy="9.6" r="2" fill="none" stroke="var(--accelity-foundation-navy)" stroke-width="1.6"/><path d="M1.6 17.2c0-1.9 1.4-3.3 3.2-3.3s3.2 1.4 3.2 3.3" stroke="var(--accelity-foundation-navy)" fill="none" stroke-width="1.6" stroke-linecap="round"/><circle cx="19.2" cy="9.6" r="2" fill="none" stroke="var(--accelity-foundation-navy)" stroke-width="1.6"/><path d="M16 17.2c0-1.9 1.4-3.3 3.2-3.3s3.2 1.4 3.2 3.3" stroke="var(--accelity-foundation-navy)" fill="none" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  infinity: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 9.5c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5c1.6 0 2.6-1 4-2.5" stroke="var(--accelity-foundation-navy)" fill="none" stroke-width="1.6" stroke-linecap="round"/><path d="M12.5 13.5c1.4 1.5 2.4 2.5 4 2.5 1.9 0 3.5-1.6 3.5-3.5s-1.6-3.5-3.5-3.5c-1.6 0-2.6 1-4 2.5" stroke="var(--accent)" fill="none" stroke-width="1.6" stroke-linecap="round"/></svg>`,
};

function heroCta(action) {
  if (!action) return '';
  const variant = action.variant || 'primary';
  const arrow = variant === 'primary' ? `<span class="hero__cta-arrow" aria-hidden="true">→</span>` : '';
  return `<a class="button button--${esc(variant)} hero__cta" href="${esc(action.href)}">${esc(action.label)}${arrow}</a>`;
}

function hero(s) {
  const lines = s.headline.map((line, i) => `<span>${esc(line)}${i === s.headline.length - 1 ? '<span class="hero__accent-dot" aria-hidden="true"></span>' : ''}</span>`).join('\n            ');

  const wordmarks = s.wordmarks.map(w => `<li>${esc(w)}</li>`).join('');

  const valueProps = s.valueProps.map(v => `
          <div class="hero__value" role="listitem">
            <span class="hero__value-icon">${VALUE_ICONS[v.icon] || ''}</span>
            <span class="hero__value-text">
              <span class="hero__value-title">${esc(v.title)}</span>
              <span class="hero__value-detail">${esc(v.detail)}</span>
            </span>
          </div>`).join('');

  const editorial = s.editorial.map(line => `<span>${esc(line)}</span>`).join('\n              ');

  return `
  <section class="hero">
    <div class="hero__mountain" aria-hidden="true">
      <img src="${esc(s.mountain.src)}" width="${esc(s.mountain.width)}" height="${esc(s.mountain.height)}" alt="" loading="eager" fetchpriority="high" decoding="async">
    </div>
    <div class="container hero__container">
      <div class="hero__grid">
        <div class="hero__content">
          <div class="hero__eyebrow" data-reveal="1">
            <span class="hero__eyebrow-rule" aria-hidden="true"></span>
            <ul class="hero__wordmarks">${wordmarks}</ul>
          </div>
          <h1 class="hero__headline" data-reveal="2">
            ${lines}
          </h1>
          <p class="hero__support" data-reveal="3">${esc(s.support)}</p>
          <div class="hero__actions button-row" data-reveal="3">
            ${s.actions.map(a => heroCta(a)).join('\n            ')}
          </div>
        </div>
        <div class="hero__visual" data-reveal="2">
          ${flywheelDiagram(s.flywheel)}
        </div>
      </div>

      <div class="hero__values" role="list" data-reveal="4">${valueProps}
        <p class="hero__editorial" role="listitem">
          <span class="hero__editorial-rule" aria-hidden="true"></span>
          ${editorial}
        </p>
      </div>
    </div>
  </section>`;
}

/* -- Page header --------------------------------------------------------- */
function pageHeader(s) {
  const media = s.image ? `
    <div class="page-header__media" aria-hidden="true">
      <img src="${esc(s.image.src)}" width="${esc(s.image.width)}" height="${esc(s.image.height)}" alt="" loading="eager" fetchpriority="high" decoding="async">
    </div>` : '';
  return `
  <section class="page-header${s.image ? ' page-header--media' : ''}">
    ${media}
    <div class="container">
      <p class="page-header__index">${esc(s.index)}</p>
      <h1 class="page-header__headline">${esc(s.headline)}</h1>
      ${s.support ? `<p class="page-header__support">${esc(s.support)}</p>` : ''}
    </div>
  </section>`;
}

/* -- Statement ----------------------------------------------------------- */
function statement(s) {
  const body = `
          <h2 class="section__heading">${esc(s.heading)}</h2>
          <p class="statement__lead">${esc(s.lead)}</p>
          ${s.aside ? `<p class="statement__aside">${esc(s.aside)}</p>` : ''}`;
  return section(spine(s.index, s.kicker, body));
}

/* -- Ledger -------------------------------------------------------------- */
function ledger(s) {
  // If there are exactly four rows, render an interactive 2x2 role grid
  if (Array.isArray(s.rows) && s.rows.length === 4) {
    const cards = s.rows.map((r, i) => `
            <div class="role-card" role="button" tabindex="0" data-role-index="${i}" aria-pressed="false">
              <div class="role-card__indicator" aria-hidden="true"></div>
              <h3 class="role-card__title">${esc(r.term)}</h3>
              <p class="role-card__desc">${esc(r.definition)}</p>
            </div>`).join('');

    const body = `
          <h2 class="section__heading">${esc(s.heading)}</h2>
          ${intro(s.intro)}
          <div class="role-grid" role="list">${cards}
          </div>
          ${footnote(s.footnote)}
          ${actionLink(s.action)}`;
    return section(spine(s.index, s.kicker, body));
  }

  const rows = s.rows.map(r => `
            <div class="ledger__row">
              <dt class="ledger__term">${esc(r.term)}</dt>
              <dd class="ledger__definition">${esc(r.definition)}</dd>
            </div>`).join('');
  const body = `
          <h2 class="section__heading">${esc(s.heading)}</h2>
          ${intro(s.intro)}
          <dl class="ledger">${rows}
          </dl>
          ${footnote(s.footnote)}
          ${actionLink(s.action)}`;
  return section(spine(s.index, s.kicker, body));
}

/* -- Matrix -------------------------------------------------------------- */
function matrix(s) {
  const items = s.items.map(i => `
            <div class="matrix__item">
              <dt class="matrix__term">${esc(i.term)}</dt>
              <dd class="matrix__definition">${esc(i.definition)}</dd>
            </div>`).join('');
  const body = `
          <h2 class="section__heading">${esc(s.heading)}</h2>
          ${intro(s.intro)}
          <dl class="matrix">${items}
          </dl>
          ${footnote(s.footnote)}`;
  return section(spine(s.index, s.kicker, body));
}

/* -- Sequence (the compounding model) ------------------------------------ */
function sequence(s) {
  const steps = s.steps.map(step => `
            <li class="sequence__item">
              <span class="sequence__number" aria-hidden="true"></span>
              <p class="sequence__label">${esc(step.label)}</p>
              <p class="sequence__detail">${esc(step.detail)}</p>
            </li>`).join('');
  const body = `
          <h2 class="section__heading">${esc(s.heading)}</h2>
          ${intro(s.intro)}
          <ol class="sequence__list">${steps}
          </ol>
          ${footnote(s.footnote)}`;
  return `
  <section class="section sequence inverse">
    <div class="container">
${spine(s.index, s.kicker, body)}
    </div>
  </section>`;
}

/* -- Table --------------------------------------------------------------- */
function table(s) {
  const head = s.columns.map(c => `<th scope="col">${esc(c)}</th>`).join('');
  const rows = s.rows.map(([term, value]) => `
              <tr>
                <th scope="row">${esc(term)}</th>
                <td${attr('data-label', s.columns[1])}>${esc(value)}</td>
              </tr>`).join('');
  const body = `
          <h2 class="section__heading">${esc(s.heading)}</h2>
          ${intro(s.intro)}
          <table class="data-table">
            <caption class="visually-hidden">${esc(s.heading)}</caption>
            <thead><tr>${head}</tr></thead>
            <tbody>${rows}
            </tbody>
          </table>
          ${footnote(s.footnote)}`;
  return section(spine(s.index, s.kicker, body));
}

/* -- Contrast ------------------------------------------------------------ */
function contrast(s) {
  const columns = s.columns.map((col, i) => `
            <div class="contrast__list${i === 1 ? ' contrast__list--muted' : ''}">
              <h3 class="contrast__heading">${esc(col.heading)}</h3>
              <ul>
                ${col.items.map(item => `<li class="contrast__item">${esc(item)}</li>`).join('\n                ')}
              </ul>
            </div>`).join('');
  const body = `
          <h2 class="section__heading">${esc(s.heading)}</h2>
          ${intro(s.intro)}
          <div class="contrast">${columns}
          </div>
          ${footnote(s.footnote)}`;
  return section(spine(s.index, s.kicker, body));
}

/* -- Layers -------------------------------------------------------------- */
function layers(s) {
  const items = s.items.map(i => `
            <div class="layers__item">
              <dt class="layers__term">${esc(i.term)}</dt>
              <dd class="layers__definition">${esc(i.definition)}</dd>
            </div>`).join('');
  const body = `
          <h2 class="section__heading">${esc(s.heading)}</h2>
          ${intro(s.intro)}
          <dl class="layers">${items}
          </dl>
          ${footnote(s.footnote)}`;
  return section(spine(s.index, s.kicker, body));
}

/* -- Quote pair ---------------------------------------------------------- */
function quotePair(s) {
  const items = s.items.map(i => `
            <div>
              <dt class="quote-pair__term">${esc(i.term)}</dt>
              <dd class="quote-pair__definition">${esc(i.definition)}</dd>
            </div>`).join('');
  const body = `
          <dl class="quote-pair">${items}
          </dl>
          ${footnote(s.footnote)}`;
  return section(spine(s.index, s.kicker, body));
}

/* -- Note ---------------------------------------------------------------- */
function note(s) {
  const body = `
          <h2 class="section__heading">${esc(s.heading)}</h2>
          <div class="note__body">
            ${s.body.map(p => `<p>${esc(p)}</p>`).join('\n            ')}
          </div>
          ${footnote(s.footnote)}`;
  return section(spine(s.index, s.kicker, body));
}

/* -- Ventures ------------------------------------------------------------
   Renders ONLY from the build-time public projection. If no record has cleared
   the release conditions the section shows a designed state that explains the
   situation instead of a placeholder card or a "coming soon" grid, either of
   which would leak the shape of the internal register.                      */
function ventures(s, ctx) {
  const published = (ctx.ventures && ctx.ventures.ventures) || [];
  let content;

  if (published.length === 0) {
    content = `
          <div class="venture-empty">
            <h3 class="venture-empty__heading">${esc(s.emptyState.heading)}</h3>
            <p class="venture-empty__body">${esc(s.emptyState.body)}</p>
            ${actionLink(s.emptyState.action)}
          </div>`;
  } else {
    content = `
          <div class="venture-grid">
            ${published.map(v => {
              const img = v.image ? `<img class="venture-card__image" src="/assets/ventures/${esc(v.image)}"${v.image2x ? ` srcset="/assets/ventures/${esc(v.image)} 1x, /assets/ventures/${esc(v.image2x)} 2x"` : ''} alt="${esc(v.brand)}">` : '';
              return `
            <article class="venture-card">
              ${img}
              <div class="venture-card__content">
                <h3 class="venture-card__brand">${esc(v.brand)}</h3>
                ${v.purpose ? `<p class="venture-card__purpose">${esc(v.purpose)}</p>` : ''}
                ${(v.stage || v.relationship) ? `<p class="venture-card__meta">${esc([v.stage, v.relationship].filter(Boolean).join(' · '))}</p>` : ''}
                ${v.href ? `<a class="action-link" href="${esc(v.href)}">Visit ${esc(v.brand)}</a>` : ''}
              </div>
            </article>`;
            }).join('')}
          </div>`;
  }

  const body = `
          <h2 class="section__heading">${esc(s.heading)}</h2>
${content}`;
  return section(spine(s.index, s.kicker, body));
}

/* -- Enquiry form -------------------------------------------------------- */
function form(s, ctx) {
  const routed = Boolean(ctx.site.enquiry && ctx.site.enquiry.endpoint);

  const intents = s.intents.map((i, idx) => `
              <label class="intent">
                <input type="radio" name="intent" value="${esc(i.value)}"${idx === 0 ? ' checked' : ''}${routed ? '' : ' disabled'}>
                <span class="intent__label">${esc(i.label)}<span class="intent__help">${esc(i.help)}</span></span>
              </label>`).join('');

  const fields = s.fields.map(f => {
    const id = `field-${esc(f.name)}`;
    const helpId = f.help ? `${id}-help` : null;
    const shared = `id="${id}" name="${esc(f.name)}" class="form__control"` +
      attr('autocomplete', f.autocomplete) +
      attr('aria-describedby', helpId) +
      (f.required ? ' required' : '') +
      (routed ? '' : ' disabled');
    const control = f.type === 'textarea'
      ? `<textarea ${shared} rows="5"></textarea>`
      : `<input type="${esc(f.type)}" ${shared}>`;
    return `
            <div class="form__group">
              <label class="form__label" for="${id}">${esc(f.label)}${f.required ? '' : ' <span class="form__optional">(optional)</span>'}</label>
              ${control}
              ${f.help ? `<p class="form__help" id="${helpId}">${esc(f.help)}</p>` : ''}
            </div>`;
  }).join('');

  const notice = routed ? '' : `
          <p class="form__notice">${esc(s.states.unrouted)}</p>`;

  const privacy = (ctx.site.enquiry && ctx.site.enquiry.privacyNoticeUrl)
    ? `<p class="form__help">Read our <a href="${esc(ctx.site.enquiry.privacyNoticeUrl)}">privacy notice</a> before sending.</p>`
    : '';

  const body = `
          <h2 class="section__heading">${esc(s.heading)}</h2>
          ${intro(s.intro)}
          ${notice}
          <form class="form"${attr('action', routed ? ctx.site.enquiry.endpoint : null)} method="post" novalidate>
            <fieldset class="form__group">
              <legend class="form__legend">What is this about?</legend>
              <div class="intent-list">${intents}
              </div>
            </fieldset>
${fields}
            <div class="form__group">
              <button type="submit" class="button button--primary"${routed ? '' : ' disabled aria-disabled="true"'}>${esc(s.submitLabel)}</button>
            </div>
            ${privacy}
            <p class="visually-hidden" role="status" data-form-status></p>
          </form>`;
  return section(spine(s.index, s.kicker, body));
}

/* -- Closing ------------------------------------------------------------- */
function closing(s) {
  const body = `
          <h2 class="closing__heading">${esc(s.heading)}</h2>
          <p class="closing__body">${esc(s.body)}</p>
          <div class="closing__actions button-row">${button(s.action)}</div>`;
  return section(spine(s.index, null, body));
}

/* -- Shared wrapper ------------------------------------------------------ */
function section(inner) {
  return `
  <section class="section">
    <div class="container">
${inner}
    </div>
  </section>`;
}

const RENDERERS = {
  hero, pageHeader, statement, ledger, matrix, sequence,
  table, contrast, layers, quotePair, note, ventures, form, closing,
};

function renderSection(s, ctx) {
  const renderer = RENDERERS[s.type];
  if (!renderer) throw new Error(`Unknown section type: "${s.type}"`);
  return renderer(s, ctx);
}

module.exports = { renderSection, RENDERERS };
