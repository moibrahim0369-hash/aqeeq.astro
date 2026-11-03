'use strict';
const assert = require('assert');
const D = require('../assets/js/destiny-matrix-data.js');
const A = require('../assets/js/matrix-method-adapter.js');
const eng = A.calculateDestinyMatrix ? A : globalThis.AqeeqMatrixMethodAdapter;
const r = eng.reduceArcana;
const registered = new Set(Object.values(D.karmicTails));

// 1) كل تركيبة (A,B,C) ممكنة ترجع ذيلاً من الـ 26 المسجلة (لا نص عام)
let n = 0;
for (let a = 1; a <= 22; a++) for (let b = 1; b <= 12; b++) for (let c = 1; c <= 22; c++) {
  const d = r(a + b + c), e = r(a + b + c + d), d2 = r(d + e), d3 = r(d + d2);
  const t = D.getKarmicTail(d, d3, d2);
  const base = D.karmicTails[t.code];
  assert.ok(base, `no registered tail for ${d}-${d3}-${d2}`);
  assert.ok(Array.isArray(t.transformationProtocol) && t.transformationProtocol.length === 3, `incomplete tail ${t.code}`);
  assert.ok(t.paradox && t.childhoodRoots && t.tracks && t.psychosomatics && t.closingConfrontation, `missing fields ${t.code}`);
  n++;
}

// 2) التواريخ السبعة وربطها
const cases = {
  '2000-06-22': ['3-9-12', '3-12-15'],
  '2000-01-03': ['6-6-18', '6-12-18'],
  '2000-01-07': ['3-10-13', '7-15-22'],
  '2000-01-12': ['6-15-18', '6-15-21'],
  '2000-01-13': ['10-16-21', '8-13-21'],
  '2000-01-14': ['5-6-17', '5-6-18'],
  '2000-05-22': ['8-11-15', '7-8-15']
};
const norm = a => [...a].sort((x, y) => x - y).join('-');
for (const [date, [from, to]] of Object.entries(cases)) {
  const P = eng.calculateDestinyMatrix(date);
  const triple = [P.anchors.D, P.intermediate.D3, P.intermediate.D2];
  assert.strictEqual(norm(triple), from, `${date} triple`);
  const t = D.getKarmicTail(...triple);
  assert.strictEqual(norm(t.code.split('-').map(Number)), norm(to.split('-').map(Number)), `${date} mapped tail`);
  assert.ok(t.mappedFrom, `${date} mappedFrom`);
}
// 3) المسجل مباشرة لا يُعاد توجيهه (تاريخ مرجعي 1999-09-25 → 15-5-8)
const P0 = eng.calculateDestinyMatrix('1999-09-25');
const t0 = D.getKarmicTail(P0.anchors.D, P0.intermediate.D3, P0.intermediate.D2);
assert.strictEqual(t0.code, '15-5-8');
assert.strictEqual(t0.mappedFrom, undefined);
console.log(`matrix-karmic-tail-mapping: OK (${n} combos, 7 dates)`);
