'use strict';
/* أمثلة محسوبة منشورة علنيًا من مصادر مستقلة (ليست من الموقع المرجعي ولا من تواريخنا):
   - matrixdestiny.io/en/methodology : 28-11-1987 (الأركان الأربعة F,G,H,I = 21,18,17,20 + خط الحب/المال)
   - matrix-destiny.org              : 17-04-1993 (A,B,C,D, الأركان المائلة، المركز)
   - destiny-matrix-html.pages.dev   : 17-08-1992 (ذيل: الماضي 21، الحاضر 4، المستقبل 10)
   المحرك يجب أن يطابقها كلها بمعادلات موحدة دون أي قيمة مثبّتة. */
const assert = require('assert');
const adapter = require('../assets/js/matrix-method-adapter.js');
const eng = adapter.calculateDestinyMatrix ? adapter : globalThis.AqeeqMatrixMethodAdapter;
const calc = (y, m, d) => eng.calculateDestinyMatrix({ year: y, month: m, day: d });

let P = calc(1987, 11, 28);
assert.deepStrictEqual([P.anchors.A, P.anchors.B, P.anchors.C, P.anchors.D, P.anchors.E], [10, 11, 7, 10, 11]);
assert.deepStrictEqual([P.corners.F, P.corners.G, P.corners.H, P.corners.I], [21, 18, 17, 20]);
assert.deepStrictEqual([P.intermediate.D2, P.intermediate.C2, P.channels.balancePoint, P.channels.heartPoint, P.channels.moneyPoint], [21, 18, 12, 6, 3]);

P = calc(1993, 4, 17);
assert.deepStrictEqual([P.anchors.A, P.anchors.B, P.anchors.C, P.anchors.D, P.anchors.E], [17, 4, 22, 7, 5]);
assert.deepStrictEqual([P.corners.F, P.corners.G, P.corners.H, P.corners.I], [21, 8, 11, 6]);

P = calc(1992, 8, 17);   // الماضي = D2 (D+E)، الحاضر = D3 (D+D2)، المستقبل = D
assert.deepStrictEqual([P.intermediate.D2, P.intermediate.D3, P.anchors.D], [21, 4, 10]);

console.log('matrix-published-examples: ok');
