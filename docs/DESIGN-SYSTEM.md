# Digital design system

Tokens live in `src/styles/tokens.css` and are split into two blocks, because the difference matters at review time.

- **Block A — inherited brand constants.** Copied from `brand-specifications.json`. Changing these needs brand-owner approval.
- **Block B — proposed implementation tokens.** Spacing, type scale, layout, motion, semantic roles. These are this build's decisions and are open to the team.

## Art direction

The reference is an institutional prospectus, not a product landing page. Three ideas carry it:

**The spine.** Every section is a two-track grid: a narrow index column naming the section, and a wide content column holding a readable measure. The index is structural — it tells you where you are in the argument. On viewports under 960px the spine collapses to a label above the content.

**Ruled rows instead of cards.** Content sets are hairline-separated rows on the page surface. Nothing floats, nothing has a shadow, structure comes from borders and space. This is the brand guide's own "structure creates momentum" applied literally.

**One bold moment.** The compounding model is the only inverted, full-bleed element on the site: six nodes on a continuous rule across a navy band. Everything else stays quiet so that this reads as the argument's centre of gravity.

Numbering appears in exactly two places: the section index, and the compounding model — which is genuinely a six-step cycle. The four roles are deliberately *not* numbered; they are parallel, not sequential.

## Colour roles

| Token | Value | Role |
| --- | --- | --- |
| `--surface-canvas` | `#FFFFFF` | Page |
| `--surface-subtle` | `#F4F6F8` | Panels |
| `--surface-inverse` | `#0B2D4B` | Compounding band, footer |
| `--text-primary` | `#0B2D4B` | Headings and body, 14.08:1 |
| `--text-secondary` | `#536575` | Supporting copy, 6.02:1 |
| `--border-default` | `#DDE4EB` | Structural rules |
| `--accent` | `#F58220` | Symbol, primary button, index numbers, sequence nodes |
| `--on-accent` | `#0B2D4B` | Label on orange, 5.43:1 |
| `--focus-ring` | `#0B2D4B` → white on inverse | Orange is 2.59:1 on white and cannot carry the focus indicator |

`.inverse` reassigns the same semantic names rather than adding a second palette, so every component works on both surfaces without a variant.

Orange appears in four places on the whole site: the symbol, the primary button, the section index numbers, and the sequence nodes. That restraint is deliberate.

## Type

Inter Display 600/700 for headings, Inter 400/500/600 for body. All sizes are fluid `clamp()` values so there are no layout jumps between breakpoints.

Body is 17px at `1.55` line height, inside the 16–18px and 1.45–1.60 range the brand guide sets for web. Measure is capped at 62ch for body and 40–46ch for leads. Headings use `-0.022em` tracking, the hero `-0.035em`.

Labels are sentence case, not tracked-out capitals.

## Layout

4px base scale: 4, 8, 12, 16, 24, 32, 48, 64, 96. Container 1280px with a fluid gutter of 20px → 72px. Section rhythm is a single fluid value, so vertical spacing scales with the viewport rather than stepping at breakpoints.

Verified layouts: 1920, 1440, 1280, 1024, 768, 430, 390, 375 and 360px. Mobile is not a scaled desktop — the spine, the sequence, the data table and the layer diagram each change structure rather than shrink.

## Components

`Button` (primary / secondary / disabled), `ActionLink`, `SiteHeader`, `SiteNav`, `MobileNav`, `SiteFooter`, `Hero`, `PageHeader`, `Statement`, `Ledger`, `Matrix`, `Sequence`, `DataTable`, `Contrast`, `Layers`, `QuotePair`, `Note`, `VentureCard` + empty state, `EnquiryForm`, `Closing`, `ErrorPage`.

Each is a function in `src/components/`. Content files choose a *section type*, never markup, so a copy change can never break semantics or accessibility.

## Interaction and motion

| Element | Behaviour |
| --- | --- |
| Header | Hairline appears once the page scrolls, via `IntersectionObserver` — no scroll listener |
| Primary button | Orange with navy label → navy with white label. Both approved pairings; contrast never drops |
| Secondary button | Outline → filled navy |
| Nav link | Orange underline scales from the left; the current page holds it |
| Mobile nav | Button-controlled panel, `aria-expanded`, Escape closes and returns focus, auto-closes at the desktop breakpoint |
| Hero | One staggered entrance, three steps, on page load only |

Nothing animates on scroll. There is no hover transform anywhere. `prefers-reduced-motion: reduce` collapses every duration to ~0.

## Definition of done

A component ships when its variants, states, responsive behaviour, keyboard path, focus appearance and copy have been reviewed, and it introduces no raw colour, spacing or radius value where a token exists.
