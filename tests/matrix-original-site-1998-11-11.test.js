'use strict';
/* مرجع: نتيجة الموقع الأصلي matrix-destiny.com للتاريخ 11.11.1998 (لقطة شاشة من صاحب المشروع) */
const assert = require('assert');
require('../assets/js/matrix-method-adapter.js');
const m = global.AqeeqMatrixMethodAdapter || globalThis.AqeeqMatrixMethodAdapter || require('../assets/js/matrix-method-adapter.js');
const P = m.calculateDestinyMatrix({ year: 1998, month: 11, day: 11 });
assert.equal(P.generational.ancestralCenter, 7);
assert.equal(P.generational.commonCenter, 15);
const red = m.reduceArcana, c = P.corners, anc = P.generational.ancestralCenter;
const inner = X => red(X + anc), outer = X => red(X + inner(X));
assert.deepStrictEqual([c.F, c.G, c.H, c.I].map(inner), [11, 9, 20, 22]);
assert.deepStrictEqual([c.F, c.G, c.H, c.I].map(outer), [6, 11, 6, 10]);
console.log('ok');
