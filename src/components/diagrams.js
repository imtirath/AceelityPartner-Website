/* The Accelity flywheel — capabilities converge into a venture, the venture
   is reused, reuse compounds, and compounding funds the next venture, whose
   capabilities feed the same loop again. Five nodes on a single circular
   orbit, each carrying its own icon; the two segments either side of
   CAPABILITIES (its "creation" half) are the orbit's orange accent, the rest
   are quiet navy. Hovering or focusing a node emphasises its own label,
   brightens the orbit segment leading into it, and quietens the other four —
   see the `.flywheel` rules in components.css.
*/
const { esc } = require('./primitives');

const CX = 240;
const CY = 240;
const R = 140;
const R_OUTER = R + 16;
const PRIMARY_R = 28;
const SECONDARY_R = 20;
const PRIMARY_KEYS = new Set(['venture', 'next-venture']);
// The two segments either side of CAPABILITIES carry the orbit's one
// restrained orange accent — the "creation" half of the loop.
const ACCENT_SEGMENTS = new Set(['capabilities', 'venture']);

/* One small line icon per node, drawn in a local 24x24 box and recentred at
   the node's own position. Single colour (navy on a white node, white on a
   filled navy node) — restrained, not the two-tone value-prop icons. */
const NODE_ICONS = {
  capabilities: c => `
    <circle cx="12" cy="12" r="4" fill="none" stroke="${c}" stroke-width="1.7"/>
    <g stroke="${c}" stroke-width="1.7" stroke-linecap="round">
      <line x1="12" y1="2.5" x2="12" y2="5.2"/>
      <line x1="12" y1="18.8" x2="12" y2="21.5"/>
      <line x1="2.5" y1="12" x2="5.2" y2="12"/>
      <line x1="18.8" y1="12" x2="21.5" y2="12"/>
      <line x1="5.4" y1="5.4" x2="7.3" y2="7.3"/>
      <line x1="16.7" y1="16.7" x2="18.6" y2="18.6"/>
      <line x1="18.6" y1="5.4" x2="16.7" y2="7.3"/>
      <line x1="7.3" y1="16.7" x2="5.4" y2="18.6"/>
    </g>`,
  venture: c => `
    <g stroke="${c}" stroke-width="1.8" stroke-linecap="round">
      <line x1="6" y1="19" x2="6" y2="13"/>
      <line x1="12" y1="19" x2="12" y2="8"/>
      <line x1="18" y1="19" x2="18" y2="4.5"/>
    </g>`,
  reuse: c => `
    <g fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.6 12a7.4 7.4 0 0112.8-5.1"/>
      <path d="M19.4 12a7.4 7.4 0 01-12.8 5.1"/>
      <polyline points="17.2,4.7 17.5,7.3 15,7.6"/>
      <polyline points="6.8,19.3 6.5,16.7 9,16.4"/>
    </g>`,
  compound: c => `
    <g fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
      <polygon points="12,3.5 20,8 12,12.5 4,8"/>
      <polyline points="4,12 12,16.5 20,12"/>
      <polyline points="4,16 12,20.5 20,16"/>
    </g>`,
  'next-venture': c => `
    <g fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
      <path d="M12 2.6c2.3 2.1 3.6 5.2 3.6 8.4 0 2.1-.6 3.9-1.5 5.4l-2.1 2.6-2.1-2.6c-.9-1.5-1.5-3.3-1.5-5.4 0-3.2 1.3-6.3 3.6-8.4z"/>
      <circle cx="12" cy="9.6" r="1.5"/>
      <path d="M9 15.3l-2.6 2.8" stroke-linecap="round"/>
      <path d="M15 15.3l2.6 2.8" stroke-linecap="round"/>
    </g>`,
};

function nodeIcon(key, color, cx, cy, scale) {
  const draw = NODE_ICONS[key];
  if (!draw) return '';
  return `<g class="flywheel__node-icon" transform="translate(${cx},${cy}) scale(${scale}) translate(-12,-12)" aria-hidden="true">${draw(color)}</g>`;
}

function point(index) {
  const angle = ((index * 72) - 90) * (Math.PI / 180);
  return [
    Math.round((CX + R * Math.cos(angle)) * 100) / 100,
    Math.round((CY + R * Math.sin(angle)) * 100) / 100,
  ];
}

function labelLines(label) {
  // Multi-word labels ("Next Venture") wrap one word per line so nothing
  // runs past the diagram edge.
  return label.includes(' ') ? label.split(' ') : [label];
}

function node(n, index) {
  const [x, y] = point(index);
  const r = PRIMARY_KEYS.has(n.key) ? PRIMARY_R : SECONDARY_R;
  const isPrimary = PRIMARY_KEYS.has(n.key);
  const title = labelLines(n.label);
  const titleY = y + r + 20 + (title.length > 1 ? 0 : 4);
  const titleSpans = title.map((line, i) => `<tspan x="${x}" y="${titleY + i * 13}">${esc(line.toUpperCase())}</tspan>`).join('');
  const detailY = titleY + title.length * 13 + 12;

  const circles = isPrimary
    ? `<circle class="flywheel__node-fill" cx="${x}" cy="${y}" r="${r}" filter="url(#flywheel-shadow)"/>`
    : `<circle class="flywheel__node-ring" cx="${x}" cy="${y}" r="${r}" filter="url(#flywheel-shadow)"/>`;
  const icon = nodeIcon(n.key, isPrimary ? 'var(--accelity-white)' : 'var(--accelity-foundation-navy)', x, y, isPrimary ? 1.05 : 0.74);

  return `
      <g class="flywheel__node" id="fw-node-${n.key}" tabindex="0" role="group" aria-label="${esc(n.label)}: ${esc(n.detail)}">
        ${circles}
        ${icon}
        <text class="flywheel__label-title" aria-hidden="true" text-anchor="middle">${titleSpans}</text>
        <text class="flywheel__label-detail" aria-hidden="true" x="${x}" y="${detailY}" text-anchor="middle">${esc(n.detail)}</text>
      </g>`;
}

function segment(a, b, key) {
  const [x0, y0] = point(a);
  const [x1, y1] = point(b);
  const cls = ACCENT_SEGMENTS.has(key) ? 'flywheel__segment flywheel__segment--accent' : 'flywheel__segment';
  return `<path class="${cls}" id="fw-seg-${key}" d="M${x0},${y0} A${R},${R} 0 0,1 ${x1},${y1}"/>`;
}

function flywheelDiagram(data) {
  const nodes = data.nodes;
  const nodesMarkup = nodes.map(node).join('');
  const segmentsMarkup = nodes.map((n, i) => segment(i, (i + 1) % nodes.length, nodes[(i + 1) % nodes.length].key)).join('');
  const caption = data.caption.map((line, i) => `<tspan x="${CX}" y="${CY - 8 + i * 16}">${esc(line.toUpperCase())}</tspan>`).join('');

  return `
  <div class="flywheel" aria-label="The Accelity flywheel: capabilities converge into a venture, the venture is reused, reuse compounds, and compounding funds the next venture, which feeds the same loop again.">
    <svg class="flywheel__scene" viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <defs>
        <filter id="flywheel-shadow" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="rgba(11,45,75,0.22)"/>
        </filter>
      </defs>
      <circle class="flywheel__orbit-outer" cx="${CX}" cy="${CY}" r="${R_OUTER}"/>
      <circle class="flywheel__orbit" cx="${CX}" cy="${CY}" r="${R}"/>
      ${segmentsMarkup}
      <text class="flywheel__caption" aria-hidden="true" text-anchor="middle">${caption}</text>
      ${nodesMarkup}
    </svg>
  </div>`;
}

module.exports = { flywheelDiagram };
