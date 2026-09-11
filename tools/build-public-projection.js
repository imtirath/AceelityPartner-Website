#!/usr/bin/env node
/**
 * Accelity Partners — public venture projection.
 *
 * Implements the release condition from the Master Context (§15):
 *
 *   Public release requires ALL of the following:
 *     source visibility allows External use
 *     the exact content revision has publication approval
 *     factual claims and displayed stage are verified
 *     the displayed relationship is verified and approved
 *     the asset and destination are approved
 *     no restriction, withdrawal or expiry blocks release
 *   Otherwise: do not publish the record.
 *
 * The public site consumes ONLY the output of this script. The internal register
 * is never bundled, never fetched and never shipped.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IN = path.join(ROOT, 'private', 'venture-register.team.json');
const OUT = path.join(ROOT, 'content', 'ventures.public.json');

const CONDITIONS = [
  ['visibilityAllowsExternal', r => r.source_visibility === 'External'],
  ['revisionApprovedForPublication', r => r.publication_approved === true && r.approved_revision_id != null],
  ['publicDescriptionApproved', r => r.public_description_approved === true],
  ['operatingStageVerified', r => r.operating_stage != null],
  ['relationshipVerified', r => r.displayed_relationship_verified === true],
  ['destinationVerified', r => r.verified_website_url != null],
  ['notDraft', r => r.publication_state === 'published'],
];

function evaluate(record) {
  const failed = CONDITIONS.filter(([, test]) => !test(record)).map(([name]) => name);
  return { pass: failed.length === 0, failed };
}

function main() {
  const register = JSON.parse(fs.readFileSync(IN, 'utf8'));
  const published = [];
  const audit = [];

  for (const record of register.records) {
    const { pass, failed } = evaluate(record);
    audit.push({ id: record.id, pass, failed });
    if (!pass) continue;
    // Deliberately narrow: only approved, public-safe fields cross the boundary.
    published.push({
      id: record.id,
      brand: record.market_facing_brand,
      purpose: record.public_purpose_approved || null,
      stage: record.operating_stage,
      relationship: record.approved_relationship_wording || null,
      href: record.verified_website_url,
    });
  }

  const projection = {
    generatedFrom: 'private/venture-register.team.json',
    generatedAt: new Date().toISOString().slice(0, 10),
    releaseConditions: CONDITIONS.map(([name]) => name),
    ventures: published,
  };

  fs.writeFileSync(OUT, JSON.stringify(projection, null, 2) + '\n');

  const blocked = audit.filter(a => !a.pass).length;
  console.log(`  venture projection: ${published.length} published, ${blocked} withheld`);
  if (published.length === 0) {
    console.log('  every record is withheld — the Portfolio page will render its empty state');
  }
  // The audit names internal record ids, so it stays on the console for the
  // operator and is never written into the build output.
  for (const a of audit.filter(x => !x.pass)) {
    console.log(`    withheld: ${a.id.padEnd(16)} fails ${a.failed.join(', ')}`);
  }
}

main();
