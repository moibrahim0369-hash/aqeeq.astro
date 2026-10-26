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
  assert.ok(!unique.has(entry.core.psychology), `psychology text should be specific to Arcana ${id}`);
  unique.add(entry.core.psychology);
  assert.equal(entry.meta?.status, 'review', `Arcana ${id} remains unpublished`);
  assert.equal(entry.meta?.contentStatus, 'editorial-core-review');
  assert.equal(entry.meta?.authorship, 'aqeeq-original');
  assert.equal(entry.meta?.referenceRuleStatus, 'unverified');
  if (id === 8 || id === 11) assert.equal(entry.meta?.arcanaMappingStatus, 'source-conflict');
  seen.add(entry.id);
  // The core pass must not make unfinished chakra or ancestry material look complete.
  assert.ok(Object.values(entry.chakras).every(section =>
    Object.values(section).every(value => value === '')
  ), `chakra content remains explicitly incomplete for Arcana ${id}`);
  assert.equal(entry.ancestral.fatherLine, '', `father-line content remains incomplete for Arcana ${id}`);
  assert.equal(entry.ancestral.motherLine, '', `mother-line content remains incomplete for Arcana ${id}`);
}
assert.deepEqual(seen, expected);
console.log('Matrix core content contract passed: 22 unique Arcana drafts; unpublished; source rules unverified; chakra and ancestry content still marked incomplete.');
