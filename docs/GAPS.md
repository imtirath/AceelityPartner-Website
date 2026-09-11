# Remaining gaps

Everything here is blocked on information or approval that the supplied sources do not contain. None of it was invented to fill a space.

## Blocking publication

| # | Gap | Needed from |
| --- | --- | --- |
| 1 | **Logo masters.** Supplied PDFs are unreadable and PNGs lost their alpha. Current assets are restored stand-ins. | Brand owner — supply `02_Logos/SVG` |
| 2 | **Venture publication approvals.** All 15 register records fail the release condition, so the Portfolio page shows its empty state. | Owner — set `publication_approved`, `approved_revision_id`, `operating_stage`, `displayed_relationship_verified`, `verified_website_url`, plus approved purpose wording |
| 3 | **Public domain.** No verified domain, so canonical URLs, `og:url`, the social image reference, `sitemap.xml` and structured data are all omitted. | Set `baseUrl` in `content/site.json` |
| 4 | **Enquiry routing.** No recipient, retention rule or escalation path, so the form is disabled. | Set `enquiry.endpoint` and `enquiry.privacyNoticeUrl` |
| 5 | **Privacy notice and terms.** Require legal review and verified entity details; not built. | Legal review |
| 6 | **Footer identifiers.** No verified CIN, registered office, email, telephone or social profiles. All omitted rather than guessed. | Company secretary |
| 7 | **Web font licence.** Inter loads from a CDN for review only. | Self-host the OFL files |

## Deliberately not built

- **Insights** — no approved articles and no editorial owner. Launching an empty section to look larger is explicitly ruled out.
- **Careers** — no verified vacancies and no approved talent-interest process.
- **Leadership section** — names, titles, biographies and photographs are unapproved.
- **Case studies** — no evidenced outcome exists to publish.
- **Named foundations on `/purpose/`** — both are External-tagged but neither is publication-approved, and a count would itself disclose structure. The page describes the intent instead.
- **Photography** — the guide asks for commissioned images of real work. Stock or generated imagery presented as the group's own is prohibited, so the site is typographic. Add real photography when it exists.

## Open decisions the site is already shaped around

Portfolio selection at launch; language scope (English only for now, Hindi would need a script-appropriate font review); analytics and consent approach — no tracker is installed and none should be added without a named owner; CMS choice — content is plain JSON so any headless CMS can back it.
