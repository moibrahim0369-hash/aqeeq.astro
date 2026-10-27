'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const dir = path.join(__dirname, '..', 'assets', 'data', 'matrix');
const expected = new Set(Array.from({ length: 22 }, (_, index) => index + 1));
const seen = new Set();
const unique = new Set();

for (let id = 1; id <= 22; id += 1) {
  const file = path.join(dir, `arcana-${String(id).padStart(2, '0')}.json`);
  const entry = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.equal(entry.schemaVersion, 1, `schema version for Arcana ${id}`);
  assert.equal(entry.id, id, `file and Arcana id must agree: ${file}`);
  assert.ok(entry.name?.ar && entry.name?.en, `names for Arcana ${id}`);
  for (const field of ['psychology', 'gift', 'shadowTrap', 'growth']) {
    assert.equal(typeof entry.core?.[field], 'string', `core.${field} for Arcana ${id}`);
    assert.ok(entry.core[field].trim().length >= 80, `core.${field} should contain a developed draft for Arcana ${id}`);
  }
  assert.ok(entry.core.growth.startsWith('خطوة تأملية:'), `growth remains gender-neutral for Arcana ${id}`);
  assert.ok(!entry.core.psychology.includes('تستطيع'), `psychology avoids gendered direct address for Arcana ${id}`);
  assert.ok(!unique.has(entry.core.psychology), `psychology text should be specific to Arcana ${id}`);
  unique.add(entry.core.psychology);
  assert.equal(entry.meta?.status, 'review', `Arcana ${id} remains unpublished`);
  assert.equal(entry.meta?.contentStatus, 'editorial-core-review');
  assert.equal(entry.meta?.authorship, 'aqeeq-original');
  assert.equal(entry.meta?.referenceRuleStatus, 'unverified');
  if (id === 8 || id === 11) assert.equal(entry.meta?.arcanaMappingStatus, 'source-conflict');
  seen.add(entry.id);
  // Legacy chakra fields remain empty; three aspect-draft chakras are review-only, with the remaining four unfilled.
  assert.equal(entry.meta?.chakraContent?.sahasrara?.status, 'partial-review');
  assert.equal(entry.meta?.chakraContent?.ajna?.status, 'partial-review');
  assert.equal(entry.meta?.chakraContent?.vishuddha?.status, 'partial-review');
  assert.equal(entry.meta?.chakraContent?.anahata?.status, 'partial-review');
  for (const section of Object.values(entry.chakras)) {
    for (const field of ['psychology', 'shadowTrap', 'bodySymbol', 'practice']) {
      assert.equal(section[field], '', `unwritten chakra field ${field} remains empty for Arcana ${id}`);
    }
  }
  for (const chakraKey of ['manipura', 'svadhisthana', 'muladhara']) {
    for (const field of ['physicsPsychology', 'energyPsychology', 'emotionsPsychology']) {
      assert.equal(entry.chakras[chakraKey][field] || '', '', `unwritten ${chakraKey} aspect ${field} remains empty for Arcana ${id}`);
    }
  }
  assert.equal(entry.ancestral.fatherLine, '', `father-line content remains incomplete for Arcana ${id}`);
  assert.equal(entry.ancestral.motherLine, '', `mother-line content remains incomplete for Arcana ${id}`);
}
assert.deepEqual(seen, expected);

const interpretationApi = require('../assets/js/matrix-interpretation-engine.js');
const centerMeaning = new Set();
const centerTension = new Set();
const centerScenario = new Set();
for (let id = 1; id <= 22; id += 1) {
  const file = path.join(dir, 'interpretations', `center-${String(id).padStart(2, '0')}.json`);
  const entry = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.equal(entry.arcanaNumber, id, `center interpretation ID for Arcana ${id}`);
  assert.equal(entry.position.key, 'center');
  assert.equal(entry.position.path, 'matrix.nodes.center');
  assert.equal(entry.referenceRule.verificationStatus, 'unverified');
  assert.ok(['draft', 'editorial-prototype'].includes(entry.interpretation.reviewStatus));
  assert.ok(['partial', 'prototype'].includes(entry.interpretation.completionStatus));
  assert.ok(interpretationApi.validateEntry(entry).valid, `interpretation schema for Arcana ${id}: ${interpretationApi.validateEntry(entry).errors.join(', ')}`);
  assert.equal(entry.contextualRules.length, 0);
  assert.equal(entry.combinationRules.length, 0);
  const narrative = entry.interpretation;
  for (const [label, value, registry] of [
    ['meaning', narrative.meaning, centerMeaning],
    ['tension', narrative.innerTensions[0]?.poleA + '|' + narrative.innerTensions[0]?.poleB + '|' + narrative.innerTensions[0]?.integration, centerTension],
    ['scenario', narrative.concreteScenarios[0]?.situation + '|' + narrative.concreteScenarios[0]?.possiblePattern + '|' + narrative.concreteScenarios[0]?.experiment, centerScenario]
  ]) {
    assert.ok(value && !registry.has(value), `${label} should be specific and non-duplicated for Arcana ${id}`);
    registry.add(value);
  }
}

console.log('Matrix core content contract passed: 22 unique Arcana drafts; unpublished; source rules unverified; chakra and ancestry content still marked incomplete.');
