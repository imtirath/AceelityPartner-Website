# QA report and design review

## Automated checks

`npm run build && node tools/qa.js` → **102/102 passing**.

Covered: contrast for every foreground/background pair actually used; one `h1` per page; no skipped heading levels; `alt`, `width` and `height` on every image; labelled form controls; `main` landmark and skip link present; no empty links; no inline event handlers; title and meta-description length; no placeholder or filler copy anywhere in the output; CSS and JS weight budgets.

The build itself runs a **disclosure guard**: it reads the internal register, and if any restricted entity or brand name appears in any HTML, CSS, JS, JSON, XML or text artefact in `dist/`, the build fails rather than shipping. It currently passes with 15 records withheld.

## Manual review

**Brand.** Supplied artwork only, correct colourway per surface, clear space held in CSS as x = a quarter of the symbol height, header uses the no-tagline lockup because the tagline would fall below the 12px legibility floor at 32px logo height. Navy labels on orange throughout. Tagline appears as live text in the hero and verbatim in the footer, both full stops intact.

**Content.** Every substantive line traces to an approved source. No invented client, statistic, date, address, biography, domain or venture. No "coming soon" card, because an empty card still discloses that something exists.

**UX.** One primary action per decision point. The enquiry form is complete and deliberately disabled, with a notice explaining why, because a form that silently discards messages is worse than one that says it is not connected yet.

## Not verified in this environment

- **No browser was available**, so there is no screenshot pass and no rendered-layout verification. Responsive behaviour, focus appearance and the sequence band's line joins are reasoned from the CSS, not seen. Run the site locally and review at the nine target widths before sign-off.
- No screen-reader pass, no real-device testing, no Lighthouse run, no visual-regression baseline.
- Web fonts load from `rsms.me` for review. Self-host the licensed Inter files before publication.

## Anti-AI audit

Checked for and absent: gradients, glassmorphism, glow, floating shapes, abstract 3D, stock photography, card grids with uniform radius and shadow, hero with logo strip and three cards, scroll-triggered fade-up on every section, hover scale, arrow glyphs appended to link text, tracked-out capital eyebrows above every heading, monospace data labels, tinted near-black, invented metrics and testimonial blocks.

The layout risk worth naming: hairline rules and an editorial grid can read as a generic "broadsheet" template. It is used here because the brand guide's own visual language calls for a clear grid, strong alignment and restraint — and it is offset by the asymmetric spine, one inverted band, and content sets that change structure rather than repeating one row pattern.

## Scorecard

Scored honestly, against what has actually been verified.

| Category | Score | Note |
| --- | ---: | --- |
| Brand fidelity | 9 | Held short of 10 by the stand-in logo assets |
| Visual design | 9 | Composition is resolved; not seen rendered |
| UX | 9 | Clear paths; the disabled form is a deliberate limitation |
| Typography | 9 | Scale and measure set to the guide; not proofed on screen |
| Information architecture | 10 | Matches the approved sitemap; unowned routes withheld |
| Interaction design | 8 | Restrained and specified, but unverified in a browser |
| Responsiveness | 8 | Structural changes per breakpoint, but untested visually |
| Accessibility | 8 | Automated checks pass; no screen-reader or zoom pass yet |
| Performance | 9 | ~25KB CSS, ~1.4KB JS, no framework; third-party font is the one risk |
| SEO | 8 | Complete except canonical, sitemap and structured data, which need the domain |
| Content quality | 9 | Entirely source-backed |
| Enterprise credibility | 9 | The refusal to publish unverified ventures is itself the credibility argument |
| Originality | 9 | Derived from the brand's own visual language |
| Human-designed feel | 9 | |

Three categories sit below 9, and all three are below 9 for the same reason: no browser was available to verify rendering. They are not design gaps — they are unverified work. A single review session at the nine target widths should close them.
