'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const adapter = require('../assets/js/matrix-method-adapter.js');
const eng = adapter.calculateDestinyMatrix ? adapter : globalThis.AqeeqMatrixMethodAdapter;
const sandbox = { console, Date, Math, Number, String, Object, Array, JSON };
sandbox.window = sandbox; sandbox.globalThis = sandbox;
sandbox.AqeeqMatrixMethodAdapter = eng;
sandbox.document = { readyState: 'complete', getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], addEventListener() {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/js/numerology-matrix.js'), 'utf8'), sandbox);
const ui = sandbox.AqeeqMatrixUI;
assert.strictEqual(typeof ui.axisPoints, 'function', 'axisPoints must be exported');

const r = eng.reduceArcana;
const cases = {
  '1990-01-01': { A: 1, B: 1, C: 19, D: 21, E: 6,
    top: { outer: 8, mid: 7, inner: 13 }, right: { outer: 8, mid: 7, inner: 13 } },
  '1999-09-25': { A: 7, B: 9, C: 10, D: 8, E: 7,
    top: { outer: 7, mid: 16, inner: 5 }, right: { outer: 9, mid: 17, inner: 6 },
    left: { outer: 21, mid: 14, inner: 21 }, bottom: { outer: 5, mid: 15, inner: 22 } }
};

for (const [date, exp] of Object.entries(cases)) {
  const P = eng.calculateDestinyMatrix(date);
  for (const k of ['A', 'B', 'C', 'D', 'E']) assert.strictEqual(P.anchors[k], exp[k], `${date} ${k}`);
  const ax = ui.axisPoints(P, r);
  for (const side of ['top', 'right', 'left', 'bottom']) {
    if (exp[side]) assert.deepStrictEqual({ ...ax[side] }, exp[side], `${date} ${side}`);
  }
  // الاتساق مع المحرك: النقطة الوسطى = X2، والداخلية اليمنى/السفلية = نقطتا المال والقلب، والخارجية السفلية = D3
  assert.strictEqual(ax.left.mid, P.intermediate.A2);
  assert.strictEqual(ax.top.mid, P.intermediate.B2);
  assert.strictEqual(ax.right.mid, P.intermediate.C2);
  assert.strictEqual(ax.bottom.mid, P.intermediate.D2);
  assert.strictEqual(ax.bottom.outer, P.intermediate.D3);
  assert.strictEqual(ax.right.inner, P.channels.moneyPoint);
  assert.strictEqual(ax.bottom.inner, P.channels.heartPoint);
  // كل القيم داخل 1..22
  for (const side of Object.values(ax)) for (const v of Object.values(side)) assert.ok(v >= 1 && v <= 22);
}
console.log('matrix-axis-points: OK (1990-01-01, 1999-09-25)');
