/* Capability compounding diagram — lightweight SVG used in hero and approach.
   Designed to be semantic, accessible, and respectful of reduced motion.
*/
function capabilityDiagram() {
  return `
  <div class="capability-diagram" role="img" aria-label="Capability compounding diagram showing capabilities converging into ventures and compounding over time">
    <svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="rgba(11,45,75,0.12)"/>
        </filter>
      </defs>
      <!-- capability nodes -->
      <g stroke="var(--accelity-foundation-navy)" stroke-width="2" fill="none">
        <line x1="60" y1="60" x2="300" y2="170" stroke-linecap="round"/>
        <line x1="540" y1="60" x2="300" y2="170" stroke-linecap="round"/>
        <line x1="300" y1="320" x2="300" y2="170" stroke-linecap="round"/>
      </g>
      <!-- capability labels -->
      <g font-family="var(--accelity-font-body)" font-size="12" fill="var(--text-secondary)">
        <text x="28" y="52">Entrepreneurship</text>
        <text x="460" y="52">Technology + AI</text>
        <text x="290" y="338">Execution & Talent</text>
      </g>
      <!-- venture node -->
      <g filter="url(#shadow)">
        <circle cx="300" cy="170" r="36" fill="var(--accelity-foundation-navy)" />
        <circle class="pulse" cx="300" cy="170" r="18" fill="var(--accent)" />
        <text x="300" y="175" font-family="var(--accelity-font-display)" font-size="12" fill="var(--accelity-white)" text-anchor="middle">VENTURE</text>
      </g>
      <!-- progression arrow -->
      <g stroke="var(--accelity-foundation-navy)" stroke-width="2" fill="none">
        <path d="M 340 170 C 420 170, 480 150, 540 150" stroke-linecap="round"/>
        <polygon points="548,148 560,150 548,152" fill="var(--accelity-foundation-navy)" />
      </g>
    </svg>
  </div>`;
}

module.exports = { capabilityDiagram };
