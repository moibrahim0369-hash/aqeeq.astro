'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const adapter = require('../assets/js/matrix-method-adapter.js');

test('Matrix Content Architecture: 15 Sections Schema & Slot Integrity', () => {
  const schemaPath = path.join(__dirname, '..', 'assets', 'data', 'matrix', 'matrix-content-architecture.json');
  assert.ok(fs.existsSync(schemaPath), 'Content architecture schema must exist');

  const content = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  assert.equal(content.version, '1.0.0');
  assert.equal(content.sections.length, 15, 'Must have exactly 15 sections');

  const expectedIds = [
    'center', 'karmic_tail', 'purposes', 'personal', 'talents',
    'father_line', 'mother_line', 'ancestral_programs', 'love_line', 'money_line',
    'chakras', 'composite_programs', 'children_line', 'age_cycles', 'transformation_rx'
  ];

  const actualIds = content.sections.map(s => s.sectionId);
  assert.deepEqual(actualIds, expectedIds, 'Section IDs must match the approved 15-section hierarchy');

  // Verify slots in every section
  const requiredSlots = ['primary', 'detailed', 'strengths', 'challenges', 'practical'];
  for (const section of content.sections) {
    assert.ok(section.title && section.title.length > 0, `Section ${section.sectionId} must have title`);
    assert.ok(section.contentKey && section.contentKey.startsWith('matrix.section.'), `Section ${section.sectionId} must have contentKey`);
    for (const slotKey of requiredSlots) {
      assert.ok(section.slots[slotKey] && section.slots[slotKey].length > 0, `Slot ${slotKey} in section ${section.sectionId} must exist`);
    }
  }
});

test('Matrix Content Architecture: Data Binding Contract with Calculation Engine', () => {
  const matrix = adapter.calculateDestinyMatrix('1999-09-25');

  // Verify all anchors and parameters referenced by content architecture
  assert.ok(matrix.anchors.E, 'Center anchor E must exist');
  assert.ok(matrix.anchors.A, 'Personal anchor A must exist');
  assert.ok(matrix.karmicTail.triad.length === 3, 'Karmic tail triad must have 3 numbers');
  assert.ok(matrix.moneyLine.path.length === 3, 'Money line must have 3 numbers');
  assert.ok(matrix.loveLine.path.length === 3, 'Love line must have 3 numbers');
  assert.ok(matrix.generational.father.combined, 'Father line combined must exist');
  assert.ok(matrix.generational.mother.combined, 'Mother line combined must exist');
  assert.ok(matrix.purposes.personal, 'Personal purpose must exist');
  assert.ok(matrix.purposes.social, 'Social purpose must exist');
  assert.ok(matrix.purposes.spiritual, 'Spiritual purpose must exist');
  assert.ok(matrix.purposes.planetary, 'Planetary purpose must exist');
  assert.ok(Object.keys(matrix.chakras.rows).length === 7, 'Must have 7 chakras');
  assert.ok(matrix.purposes.sky, 'Sky axis must exist');
  assert.ok(matrix.purposes.earth, 'Earth axis must exist');
  assert.ok(matrix.ancestralPrograms.combined, 'Ancestral programs combined must exist');
  assert.ok(matrix.compositePrograms.karmicTriad.length === 3, 'Composite programs must exist');
  assert.ok(matrix.childrenLine.childEnergy, 'Children line must exist');
  assert.ok(matrix.transformationKeys.balancePoint, 'Transformation keys must exist');
});
