'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const adapter = require('../assets/js/matrix-method-adapter.js');

test('Natalia Ladini Matrix Engine: Reduction Rules (1..22, 22 preserved, 0 -> 22)', () => {
  // Numbers <= 22 remain identical
  for (let i = 1; i <= 22; i++) {
    assert.equal(adapter.reduceArcana(i), i, `Number ${i} must preserve its exact value`);
  }

  // 22 must never become 4 or 0
  assert.equal(adapter.reduceArcana(22), 22);

  // 0 reduces to 22 (The Fool / 22nd Arcana)
  assert.equal(adapter.reduceArcana(0), 22);

  // Numbers > 22 are reduced by sum of digits
  assert.equal(adapter.reduceArcana(23), 5); // 2+3 = 5
  assert.equal(adapter.reduceArcana(25), 7); // 2+5 = 7
  assert.equal(adapter.reduceArcana(28), 10); // 2+8 = 10
  assert.equal(adapter.reduceArcana(38), 11); // 3+8 = 11
  assert.equal(adapter.reduceArcana(47), 11); // 4+7 = 11
  assert.equal(adapter.reduceArcana(1999), 10); // 1+9+9+9 = 28 -> 2+8 = 10
  assert.equal(adapter.reduceArcana(1994), 5);  // 1+9+9+4 = 23 -> 2+3 = 5
  assert.equal(adapter.reduceArcana(2000), 2);  // 2+0+0+0 = 2
  assert.equal(adapter.reduceArcana(2022), 6);  // 2+0+2+2 = 6
});

test('Natalia Ladini Matrix Engine: Reference Case 1999-09-25 (Mohamed Ibrahim)', () => {
  const result = adapter.calculateDestinyMatrix('1999-09-25');
  const { anchors, corners, karmicTail, generational, purposes } = result;

  // Day: 25 -> 2+5 = 7 (A)
  assert.equal(anchors.A, 7, 'Day 25 -> 7');

  // Month: 9 -> 9 (B)
  assert.equal(anchors.B, 9, 'Month 9 -> 9');

  // Year: 1999 -> 1+9+9+9 = 28 -> 2+8 = 10 (C)
  assert.equal(anchors.C, 10, 'Year 1999 -> 10');

  // Karmic Tail Base: D = R(A + B + C) = R(7 + 9 + 10) = R(26) = 2+6 = 8
  assert.equal(anchors.D, 8, 'D = R(7+9+10) = 8');

  // Center: E = R(A + B + C + D) = R(7 + 9 + 10 + 8) = R(34) = 3+4 = 7
  assert.equal(anchors.E, 7, 'Center E = R(7+9+10+8) = 7');

  // Corners:
  // Top-Left (Father Line Top): F = R(A + B) = R(7 + 9) = 16
  assert.equal(corners.F, 16, 'Corner F = 16');

  // Top-Right (Mother Line Top): G = R(B + C) = R(9 + 10) = 19
  assert.equal(corners.G, 19, 'Corner G = 19');

  // Bottom-Right (Father Line Karma): H = R(C + D) = R(10 + 8) = 18
  assert.equal(corners.H, 18, 'Corner H = 18');

  // Bottom-Left (Mother Line Karma): I = R(D + A) = R(8 + 7) = 15
  assert.equal(corners.I, 15, 'Corner I = 15');

  // Generational Lines:
  // Father Line: R(F + H) = R(16 + 18) = R(34) = 7
  assert.equal(generational.father.combined, 7);

  // Mother Line: R(G + I) = R(19 + 15) = R(34) = 7
  assert.equal(generational.mother.combined, 7);

  // Ancestral Center: R(7 + 7) = 14
  assert.equal(generational.ancestralCenter, 14);

  // Purposes:
  // Sky: R(B + D) = R(9 + 8) = 17
  assert.equal(purposes.sky, 17);

  // Earth: R(A + C) = R(7 + 10) = 17
  assert.equal(purposes.earth, 17);

  // 1st Personal Purpose: R(Sky + Earth) = R(17 + 17) = R(34) = 7
  assert.equal(purposes.personal, 7);

  // 2nd Social Purpose: R(FatherCombined + MotherCombined) = R(7 + 7) = 14
  assert.equal(purposes.social, 14);

  // 3rd Spiritual Purpose: R(1st + 2nd) = R(7 + 14) = 21
  assert.equal(purposes.spiritual, 21);

  // 4th Planetary Purpose: R(2nd + 3rd) = R(14 + 21) = R(35) = 8
  assert.equal(purposes.planetary, 8);
});

test('Natalia Ladini Matrix Engine: Edge Case 1922-11-22 (Preserving 22)', () => {
  const result = adapter.calculateDestinyMatrix('1922-11-22');
  const { anchors, corners } = result;

  // Day 22 -> 22 preserved
  assert.equal(anchors.A, 22, 'Day 22 must be 22');

  // Month 11 -> 11
  assert.equal(anchors.B, 11, 'Month 11 must be 11');

  // Year 1922 -> 1+9+2+2 = 14 -> 14
  assert.equal(anchors.C, 14, 'Year 1922 -> 14');

  // D = R(22 + 11 + 14) = R(47) = 4+7 = 11
  assert.equal(anchors.D, 11);

  // E = R(22 + 11 + 14 + 11) = R(58) = 5+8 = 13
  assert.equal(anchors.E, 13);

  // Corners
  assert.equal(corners.F, adapter.reduceArcana(22 + 11)); // R(33) = 6
  assert.equal(corners.G, adapter.reduceArcana(11 + 14)); // R(25) = 7
  assert.equal(corners.H, adapter.reduceArcana(14 + 11)); // R(25) = 7
  assert.equal(corners.I, adapter.reduceArcana(11 + 22)); // R(33) = 6
});

test('Natalia Ladini Matrix Engine: 7 Chakras Calculation Structure', () => {
  const result = adapter.calculateDestinyMatrix('1995-05-15');
  const { chakras } = result;

  assert.ok(chakras.rows.sahasrara);
  assert.ok(chakras.rows.ajna);
  assert.ok(chakras.rows.vishuddha);
  assert.ok(chakras.rows.anahata);
  assert.ok(chakras.rows.manipura);
  assert.ok(chakras.rows.svadhisthana);
  assert.ok(chakras.rows.muladhara);

  // All values must be in range 1..22
  for (const row of Object.values(chakras.rows)) {
    assert.ok(row.physics >= 1 && row.physics <= 22);
    assert.ok(row.energy >= 1 && row.energy <= 22);
    assert.ok(row.emotions >= 1 && row.emotions <= 22);
  }

  assert.ok(chakras.totals.physics >= 1 && chakras.totals.physics <= 22);
  assert.ok(chakras.totals.energy >= 1 && chakras.totals.energy <= 22);
  assert.ok(chakras.totals.emotions >= 1 && chakras.totals.emotions <= 22);
  assert.ok(chakras.totals.common >= 1 && chakras.totals.common <= 22);
});

test('Natalia Ladini Matrix Engine: 22 Arcana Metadata Coverage', () => {
  assert.equal(adapter.ARCANA_DATA.length, 22);
  for (let i = 1; i <= 22; i++) {
    const info = adapter.getArcanaInfo(i);
    assert.equal(info.id, i);
    assert.ok(info.name && info.name.length > 0);
    assert.ok(info.en && info.en.length > 0);
    assert.ok(info.roman && info.roman.length > 0);
    assert.ok(info.light && info.light.length > 0);
    assert.ok(info.shadow && info.shadow.length > 0);
  }
});
