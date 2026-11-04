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

/* جدول الشاكرات: مثالان منشوران مستقلان (مطابقان للمحرك بعد التصحيح):
   mind.university/destiny-matrix/health-map : 23-06-1992 ، numato.pl : 15-03-1990 (فيزياء/طاقة/مشاعر + الإجماليات) */
const rows = P => Object.values(P.chakras.rows).map(r => [r.physics, r.energy, r.emotions]);
let C = calc(1992, 6, 23);
assert.deepStrictEqual(rows(C), [[5, 6, 11], [20, 22, 6], [15, 16, 4], [7, 8, 15], [10, 10, 20], [4, 15, 19], [21, 5, 8]]);
assert.deepStrictEqual([C.chakras.totals.physics, C.chakras.totals.energy, C.chakras.totals.emotions], [10, 10, 11]);
C = calc(1990, 3, 15);
assert.deepStrictEqual(rows(C), [[15, 3, 18], [5, 17, 22], [8, 14, 22], [19, 7, 8], [11, 11, 22], [3, 21, 6], [19, 10, 11]]);
assert.deepStrictEqual([C.chakras.totals.physics, C.chakras.totals.energy, C.chakras.totals.emotions], [8, 11, 10]);
/* مراحل العمر والأغراض (mind.university 23-06-1992): 0→5 10→11 20→6 30→9 40→21 50→8 60→5 70→10 · شخصي 19 اجتماعي 11 روحي 3 كوكبي 14 */
C = calc(1992, 6, 23);
assert.deepStrictEqual([0, 10, 20, 30, 40, 50, 60, 70].map(a => C.ageMap[a]), [5, 11, 6, 9, 21, 8, 5, 10]);
assert.deepStrictEqual([C.purposes.personal, C.purposes.social, C.purposes.spiritual, C.purposes.planetary], [19, 11, 3, 14]);
console.log('matrix-published-chakras-age-purposes: ok');
