'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../assets/js/matrix-method-adapter.js');
const r = M.reduceArcana;

test('buildMatrixFromAnchors reproduces the personal matrix exactly', () => {
  for (const d of ['1999-09-25', '1990-09-24', '2000-02-29', '1985-12-31', '2011-01-01']) {
    const m = M.calculateDestinyMatrix(d);
    const { A, B, C, D } = m.anchors;
    const b = M.buildMatrixFromAnchors(A, B, C, D, m.birthDate);
    assert.deepEqual(b.anchors, m.anchors);
    assert.deepEqual(b.corners, m.corners);
    assert.deepEqual(b.ageMap, m.ageMap);
    assert.deepEqual(b.chakras, m.chakras);
  }
});

test('Compatibility: only A,B,C,D are summed; everything else is rebuilt from them', () => {
  const m1 = M.calculateDestinyMatrix('1999-09-25'), m2 = M.calculateDestinyMatrix('1990-09-24');
  const A = r(m1.anchors.A + m2.anchors.A), B = r(m1.anchors.B + m2.anchors.B);
  const C = r(m1.anchors.C + m2.anchors.C), D = r(m1.anchors.D + m2.anchors.D);
  const P = M.buildMatrixFromAnchors(A, B, C, D);
  assert.equal(P.anchors.E, r(A + B + C + D));
  assert.equal(P.corners.F, r(A + B));
  assert.equal(P.corners.G, r(B + C));
  assert.equal(P.corners.H, r(C + D));
  assert.equal(P.corners.I, r(D + A));
  assert.equal(P.anchors.E, 12); // النتيجة المرجعية 25/09/1999 + 24/09/1990
  assert.equal(P.yearEnergy, null);
});

test('Forecast: year birthday-to-birthday, 12 months, reduction math, ring consistent with ageMap', () => {
  const f = M.calculateForecast('1999-09-25', new Date(2026, 10, 16));
  assert.equal(f.age, 27);
  assert.equal(f.yearRange.from, '2026-09-25');
  assert.equal(f.yearRange.to, '2027-09-24');
  assert.equal(f.yearPersonal, 8);
  assert.equal(f.months.length, 12);
  f.months.forEach(x => assert.equal(x.number, r(f.yearPersonal + x.index)));
  assert.equal(f.currentMonth.from, '2026-10-25');
  assert.equal(f.currentMonth.number, r(8 + 2));
  assert.equal(f.today.number, r(f.currentMonth.number + r(16)));
  assert.equal(f.currentWeek.number, r(f.currentMonth.number + f.currentWeek.weekInMonth));
  const before = M.calculateForecast('1999-09-25', new Date(2026, 8, 24));
  assert.equal(before.age, 26);
  assert.equal(before.yearRange.label, '2025–2026');
  const m = M.calculateDestinyMatrix('1999-09-25'), ring = M.buildAgeRing(m);
  assert.equal(ring.length, 64);
  Object.keys(m.ageMap).forEach(k => { const i = Math.round(k / 1.25); if (i < 64) assert.equal(ring[i], m.ageMap[k]); });
});

test('Day tags: exactly the five approved groups', () => {
  const expect = {
    money_business: [1, 3, 4, 7, 8, 10, 15, 19, 21], love_relationships: [2, 3, 6, 14, 17, 18, 22],
    health_wellness: [2, 5, 9, 11, 12, 14], travel: [7, 10, 17, 21, 22], caution_reflection: [9, 12, 13, 16, 18, 20]
  };
  for (let n = 1; n <= 22; n++) {
    const ids = M.getDayCategories(n).map(t => t.id).sort();
    const want = Object.keys(expect).filter(k => expect[k].includes(n)).sort();
    assert.deepEqual(ids, want, 'arcana ' + n);
    M.getDayCategories(n).forEach(t => assert.ok(t.label && !/undefined/.test(t.label)));
  }
});

test('Forecast sweep: every date 1900-2026 yields numbers 1..22 only', () => {
  const today = new Date(2026, 10, 16);
  for (let y = 1900; y <= 2026; y += 1) for (let mo = 1; mo <= 12; mo++) for (const d of [1, 15, 28, new Date(y, mo, 0).getDate()]) {
    const f = M.calculateForecast({ year: y, month: mo, day: d }, today);
    const nums = [f.yearPersonal, f.yearRing.ring, f.today.number, f.currentWeek.number, ...f.months.map(x => x.number), ...f.weeks.map(x => x.number)];
    nums.forEach(n => assert.ok(n >= 1 && n <= 22, `${y}-${mo}-${d}: ${n}`));
    assert.equal(f.months.length, 12);
  }
});
