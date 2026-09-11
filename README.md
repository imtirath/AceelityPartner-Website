# Accelity Partners — corporate website

Static build of the public Accelity Partners site. No runtime dependencies, no framework, no build-time network access.

**Audience of this repository: Team.** `private/` contains Team-classified material and must never be deployed. See `private/README.md`.

---

## Quick start

```bash
npm run assets     # restore logo artwork + compose the social image (needs python3 + Pillow)
npm run build      # projection -> pages -> dist/
npm run serve      # preview on http://localhost:4173
npm start          # build + serve
node tools/qa.js   # 102 automated checks against dist/
```

Node 18+. Python 3 with Pillow is needed only for `npm run assets`; the committed `assets/brand/` output means a normal build does not require it.

---

## How it fits together

```
content/          data — the only place copy lives
  site.json         config; every unverified value is null and is omitted from output
  pages/*.json      one file per page; each section names a TYPE, never markup
  ventures.public.json   GENERATED — the only venture data the browser ever sees

private/          Team-classified. Never deployed. Read only by the projection tool.
  venture-register.team.json

src/
  styles/         tokens.css (Block A brand constants / Block B our decisions), base, components
  components/     primitives.js, sections.js, chrome.js — one function per component
  templates/      document.js — head, metadata, structured data
  scripts/        site.js — progressive enhancement only

tools/
  restore-logo-alpha.py      recovers alpha lost by the supplied PNGs
  make-og-image.py           composes the social image from approved artwork
  build-public-projection.js applies the release condition
  qa.js                      structure, a11y, metadata and contrast checks

build.js          content + components -> dist/
dist/             deployable output
```

Content chooses a section *type*; the type owns semantics, responsive behaviour and states. A copy change therefore cannot break markup or accessibility.

## Information architecture

| Route | Job |
| --- | --- |
| `/` | What the group is, why it spans sectors, how it compounds capability, where to go next |
| `/about/` | Mission, vision, the four defining principles, how progress is described |
| `/approach/` | Build / Own / Partner / Enable in full, shared capabilities, the compounding model, problems and contribution |
| `/portfolio/` | Brand architecture, endorsement wording, published ventures (currently none — see below) |
| `/purpose/` | Long-term ambition and mission-led institutions, held separate from commercial messaging |
| `/connect/` | Enquiry routed by intent |
| `/404.html` | Not-found |

Not built, deliberately: `/insights/`, `/careers/`, `/privacy/`, `/terms/`. Each lacks approved content or an owner. Reasons in `docs/GAPS.md`.

## The release gate

`tools/build-public-projection.js` implements the Master Context §15 condition. A venture reaches the public build only when **all** of these hold: visibility allows External use, the exact revision is publication-approved, the public description is approved, operating stage is verified, the displayed relationship is verified, the destination is verified, and the record is not a draft.

All 15 records currently fail. `content/ventures.public.json` is therefore an empty list and the Portfolio page renders its designed empty state.

`build.js` then runs a **disclosure guard**: it re-reads the internal register and fails the build if any restricted entity or brand name appears in any HTML, CSS, JS, JSON, XML or text file in `dist/`. Removing a card visually is not enough when its data still ships.

To publish a venture, update the record in `private/venture-register.team.json` and rebuild. No template change is needed.

## Deployment

`dist/` is plain static files — any CDN or static host will serve it. Recommended headers:

```
Cache-Control: public, max-age=31536000, immutable   # /assets/brand/*
Cache-Control: public, max-age=0, must-revalidate    # *.html
Content-Security-Policy: default-src 'self'; style-src 'self' https://rsms.me; font-src https://rsms.me; img-src 'self'; script-src 'self'
```

The site has no inline scripts or inline event handlers, so the CSP above needs no `unsafe-inline`. Once fonts are self-hosted, drop the `rsms.me` entries and tighten to `default-src 'self'`.

Configure `404.html` as the not-found document. Do not enable directory listing. Do not copy `private/` into the deploy root.

## Before publication

Work through `docs/GAPS.md` — seven items block launch — then the supplied `Release_Checklist.txt`. In particular: replace the stand-in logo assets with the SVG masters, set `baseUrl`, connect enquiry routing with a privacy notice, and self-host the Inter files.

## Documentation

- `docs/BRAND-AUDIT.md` — sources, authority, positioning, restrictions, the asset-integrity issue
- `docs/DESIGN-SYSTEM.md` — art direction, tokens, components, interaction
- `docs/QA-AND-SCORECARD.md` — checks run, what was not verified, design review
- `docs/GAPS.md` — what is blocked and on whom

## Status

Draft implementation for team review. Nothing here is publication approval, and nothing here verifies incorporation, ownership, operating status or trademark clearance.
