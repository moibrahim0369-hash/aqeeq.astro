'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const adapter = require('../assets/js/matrix-method-adapter.js');
const eng = adapter.calculateDestinyMatrix ? adapter : globalThis.AqeeqMatrixMethodAdapter;
const sandbox = { console, Date, Math, Number, String, Object, Array, JSON };
sandbox.window = sandbox; sandbox.globalThis = sandbox; sandbox.AqeeqMatrixMethodAdapter = eng;
sandbox.document = { readyState: 'complete', getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], addEventListener() {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/js/numerology-matrix.js'), 'utf8'), sandbox);
const ui = sandbox.AqeeqMatrixUI;
assert.strictEqual(typeof ui.diagonalPoints, 'function');
const dp = date => ui.diagonalPoints(eng.calculateDestinyMatrix(date), eng.reduceArcana);

// القيم المعتمدة من الموقع المرجعي (inner = جهة المركز، outer = جهة الركن)
const ref1999 = dp('1999-09-25');
assert.deepStrictEqual({ ...ref1999.F }, { inner: 3, outer: 19 });
assert.deepStrictEqual({ ...ref1999.G }, { inner: 6, outer: 7 });
assert.deepStrictEqual({ ...ref1999.H }, { inner: 5, outer: 5 });
assert.deepStrictEqual({ ...ref1999.I }, { inner: 11, outer: 8 });
const ref1998 = dp('1998-01-07');
assert.deepStrictEqual({ ...ref1998.F }, { inner: 13, outer: 21 });
// الصيغة: outer = reduce(corner + inner) على أي تاريخ
for (const d of ['1990-01-01', '2003-11-30', '1982-09-14', '2000-06-22']) {
  const P = eng.calculateDestinyMatrix(d), x = dp(d);
  for (const k of ['F', 'G', 'H', 'I']) {
    assert.strictEqual(x[k].inner, eng.reduceArcana(P.corners[k] + P.generational.ancestralCenter));
    assert.strictEqual(x[k].outer, eng.reduceArcana(P.corners[k] + x[k].inner));
    assert.ok(x[k].inner >= 1 && x[k].inner <= 22 && x[k].outer >= 1 && x[k].outer <= 22);
  }
}
console.log('matrix-diagonal-points: OK (1999-09-25, 1998-01-07 + 4 dates)');
