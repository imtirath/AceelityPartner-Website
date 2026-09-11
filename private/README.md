# private/ — DO NOT DEPLOY

Everything in this directory is **Team-classified** under the Accelity Partners
visibility rules (Brand Guidelines v1.1, p. 35; Master Context §07).

- `venture-register.team.json` is an audience-filtered planning extract. It is
  not a statutory register, and it is not publication approval.
- This directory is excluded from `dist/`. The page build never reads it. Only
  `tools/build-public-projection.js` reads it, and that tool emits a projection
  containing only records that pass every release condition.
- A browser must never receive this file. Do not import it from a component, do
  not copy it into `assets/`, and do not include it in a static export.

Removing a card visually is not enough when its data is still delivered to the
browser. That is why the filter runs at build time, the public artefact is a
separate file, and `build.js` fails if a restricted name reaches `dist/`.
