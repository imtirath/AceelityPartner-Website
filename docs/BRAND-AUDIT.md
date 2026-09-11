# Brand and content audit

Audience: **Team**. Scope: inputs used to build the public corporate website.

## Which files are authoritative

| Source | Authority | Used for |
| --- | --- | --- |
| `Accelity_Partners_Brand_Guidelines_v1_1` (pptx text) | **Authoritative** for positioning, tagline, mission, vision, voice, logo rules, palette, typography, architecture, release rules | All brand copy and the visual system |
| `brand-specifications.json`, `brand-tokens.css`, `Colour_and_Type_Specifications.txt` | **Authoritative** for exact colour and type values | `src/styles/tokens.css`, Block A |
| `Accelity_Partners_Tech_Team_Master_Context_v1_0` | Authoritative for audience policy and venture placement; **proposed** for IA, portals, data model | Sitemap, content model, release gate |
| `Quick_Use_Instructions.txt`, `Release_Checklist.txt` | Authoritative for logo application and release checks | Header/footer logo use, QA |
| `venture-register_team.json` | Authoritative for names, placement and visibility tags | `private/`, release gate only |
| `Accelity_Partners__Overview.docx` | **Investor-facing material.** Treated as external-audience input, not as verified public fact | Background reading only — no copy taken from it |
| `Accelity_Partners_Digital_Tech_Identity_Playbook` | Working digital standard | Component standards, token naming, DoD |

Where the Overview and the Brand Guidelines differ in emphasis, the Guidelines win, per the Master Context conflict rule.

## Positioning

A **venture-building and holding company** that creates, incubates, acquires and scales businesses across sectors. Not a consultancy, not a franchise marketplace, not a software vendor. Consultancy ("Enable") is one of four roles.

Core message, used verbatim: *We build, own and scale businesses across sectors by compounding shared capabilities.*

## Personality and voice

Ambitious not absolute; practical not abstract; collaborative not dominant. British/Indian English, sentence-case headings, short paragraphs. Conviction in the vision stays separate from evidence of performance. The About page makes this explicit rather than only implying it.

## Audiences and their next step

Group investors, founders and business owners, strategic partners, talent, media, and customers looking for a venture. Every one of them lands on the same routed enquiry on `/connect/`; the routing choice, not a separate address, is what distinguishes them.

## Content actually available

Approved and used: tagline, mission, vision, core message, short introduction, hero copy, the four roles, five shared capabilities, the six-step compounding model, the five problem/contribution pairs, the four brand-architecture layers, the three endorsement wordings, the voice contrast list, enquiry microcopy.

Not available, therefore not on the site: any venture profile, leadership names, founding year, offices, client names, statistics, case studies, insights, vacancies, verified contact details, domain.

## Visual identity

Logo: original A with internal upward arrow and curved base. Five layouts × five colourways. Primary treatment is an orange symbol with a navy wordmark; reversed is orange with white lettering on navy.

Palette: Acceleration Orange `#F58220`, Foundation Navy `#0B2D4B`, White, Slate `#536575`, Mist `#F4F6F8`, Line Grey `#DDE4EB`. Type: Inter Display 600/700 for headings, Inter 400/500/600 for body.

## Restrictions that shaped the build

1. **Navy on orange for buttons.** White on orange is 2.59:1 and is not a text treatment.
2. **Never redraw or retype the logo.** Artwork is used as supplied; see the asset note below.
3. **Visibility applies to the whole venture**, including names, sector hints, metadata, file names and API payloads — not just visible copy.
4. **A brand statement is not an operating claim.** No counters, no portfolio counts, no results without approved evidence.
5. **Do not force the parent palette onto venture brands.**

## Asset integrity issue — needs resolution before launch

The logo PDFs supplied to this project are not readable as PDFs, and every logo PNG has been flattened onto an opaque white plate. That destroyed the reversed and white colourways and filled the knockout inside the symbol.

`tools/restore-logo-alpha.py` recovers per-pixel coverage from the primary artwork and re-snaps the inks to the exact brand hex values. Geometry, letterforms and proportions are untouched, and nothing is retyped. The reversed lockup is reconstructed as the colourway the kit already defines.

**This is a review-quality stand-in.** Replace `assets/brand/*` with the official `02_Logos/SVG` masters before publication. Tracked in `docs/GAPS.md`.
