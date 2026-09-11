/**
 * Low-level primitives shared by every component.
 * Nothing here knows about a specific page or section type.
 */

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape text for interpolation into markup. Every dynamic value goes through this. */
function esc(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, ch => ESCAPES[ch]);
}

/** Render an attribute only when the value is present — never `attr="null"`. */
function attr(name, value) {
  if (value === null || value === undefined || value === false || value === '') return '';
  if (value === true) return ` ${name}`;
  return ` ${name}="${esc(value)}"`;
}

/**
 * The spine: a narrow index column and a wide content column.
 * The index is structural, not decorative — it names the section and, where the
 * content is genuinely ordered, numbers it.
 */
function spine(index, kicker, content) {
  const hasIndex = index || kicker;
  return `
      <div class="spine">
        <div class="spine__index">
          ${index ? `<span class="spine__number">${esc(index)}</span>` : ''}
          ${kicker ? `<span class="spine__kicker">${esc(kicker)}</span>` : ''}
        </div>
        <div class="spine__content"${hasIndex ? '' : ''}>
${content}
        </div>
      </div>`;
}

function button(action, fallbackVariant = 'primary') {
  if (!action) return '';
  const variant = action.variant || fallbackVariant;
  return `<a class="button button--${esc(variant)}" href="${esc(action.href)}">${esc(action.label)}</a>`;
}

function actionLink(action) {
  if (!action) return '';
  return `<a class="action-link" href="${esc(action.href)}">${esc(action.label)}</a>`;
}

function footnote(text) {
  if (!text) return '';
  return `<p class="section__footnote">${esc(text)}</p>`;
}

function intro(text) {
  if (!text) return '';
  return `<p class="section__intro">${esc(text)}</p>`;
}

module.exports = { esc, attr, spine, button, actionLink, footnote, intro };
