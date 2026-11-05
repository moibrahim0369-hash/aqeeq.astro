'use strict';
/* مقارنة المحرك بتنفيذ مستقل حرفي للمعادلات الموثّقة في المصادر المنشورة (لا يشارك أي كود مع المحرك)
   عبر مئات التواريخ (مسح 1930–2025 + تواريخ حدّية + تواريخ مرجعية + 11/11/1998).
   الخطوط المائلة الداخلية (diagonalPoints) غير موثّقة علنيًا، لذلك لا تُختبر هنا (انظر docs/matrix-engine-calibration.md). */
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

// ---- تنفيذ مرجعي مستقل ----
const ds = n => String(n).split('').reduce((a, c) => a + +c, 0);
const R = n => { while (n > 22) n = ds(n); return n || 22; };
function spec(y, m, d) {
  const A = R(d), B = m, C = R(ds(y)), D = R(A + B + C), E = R(A + B + C + D);
  const F = R(A + B), G = R(B + C), H = R(C + D), I = R(D + A);
  const ax = X => { const x1 = R(X + E); return { x1, x2: R(X + x1), x3: R(x1 + E) }; };
  const a = ax(A), b = ax(B), c = ax(C), dd = ax(D);
  const father = R(F + H), mother = R(G + I), anc = R(F + G + H + I), common = R(anc + E);
  const bal = R(dd.x1 + c.x1), heart = R(bal + dd.x1), money = R(bal + c.x1);
  const row = (p, e) => [p, e, R(p + e)];
  const ch = [row(A, B), row(a.x2, b.x2), row(a.x1, b.x1), row(a.x3, b.x3), row(E, E), row(c.x1, dd.x1), row(C, D)];
  const tot = [0, 1, 2].map(k => R(ch.reduce((s, r) => s + r[k], 0)));
  const sky = R(B + D), earth = R(A + C), personal = R(sky + earth), social = R(father + mother);
  const spiritual = R(personal + social), planetary = R(social + spiritual);
  const age = { 0: A, 10: F, 20: B, 30: G, 40: C, 50: H, 60: D, 70: I, 5: R(A + F), 15: R(F + B), 25: R(B + G), 35: R(G + C), 45: R(C + H), 55: R(H + D), 65: R(D + I), 75: R(I + A) };
  return { A, B, C, D, E, F, G, H, I, ax: { A: a, B: b, C: c, D: dd }, father, mother, anc, common, bal, heart, money, ch, tot, personal, social, spiritual, planetary, age,
    tail: [D, R(D + E), R(D + R(D + E))] };
}

const dates = [[1998, 11, 11], [1999, 9, 25], [1998, 1, 7], [2000, 5, 15], [1990, 1, 1], [1985, 3, 17], [1987, 11, 28], [1993, 4, 17], [1992, 8, 17], [1992, 6, 23], [1990, 3, 15], [2000, 2, 29], [1991, 12, 31], [1930, 1, 1], [2025, 12, 31], [1999, 12, 22], [2002, 2, 22]];
for (let y = 1930; y <= 2025; y++) for (const [m, d] of [[(y * 7) % 12 + 1, (y * 11) % 28 + 1], [(y * 5) % 12 + 1, 22], [12, (y % 9) + 20]]) dates.push([y, m, d]);

let checked = 0;
for (const [y, m, d] of dates) {
  const S = spec(y, m, d), P = eng.calculateDestinyMatrix({ year: y, month: m, day: d });
  const tag = `${d}/${m}/${y}`;
  const eq = (got, want, what) => { checked++; assert.deepStrictEqual(got, want, `${tag} ${what}`); };
  eq([P.anchors.A, P.anchors.B, P.anchors.C, P.anchors.D, P.anchors.E], [S.A, S.B, S.C, S.D, S.E], 'anchors');
  eq([P.corners.F, P.corners.G, P.corners.H, P.corners.I], [S.F, S.G, S.H, S.I], 'corners');
  eq([P.generational.father.combined, P.generational.mother.combined, P.generational.ancestralCenter, P.generational.commonCenter], [S.father, S.mother, S.anc, S.common], 'ancestral');
  eq([P.channels.balancePoint, P.channels.heartPoint, P.channels.moneyPoint], [S.bal, S.heart, S.money], 'love/money');
  eq(Object.values(P.chakras.rows).map(r => [r.physics, r.energy, r.emotions]), S.ch, 'chakras');
  eq([P.chakras.totals.physics, P.chakras.totals.energy, P.chakras.totals.emotions], S.tot, 'chakra totals');
  eq([P.purposes.personal, P.purposes.social, P.purposes.spiritual, P.purposes.planetary], [S.personal, S.social, S.spiritual, S.planetary], 'purposes');
  eq(Object.keys(S.age).map(k => P.ageMap[k]), Object.values(S.age), 'age map');
  eq([P.anchors.D, P.intermediate.D2, P.intermediate.D3], S.tail, 'karmic tail');
  const ap = ui.axisPoints(P, eng.reduceArcana);
  eq([ap.left, ap.top, ap.right, ap.bottom].map(o => [o.mid, o.outer, o.inner]), ['A', 'B', 'C', 'D'].map(k => [S.ax[k].x1, S.ax[k].x2, S.ax[k].x3]), 'axis points (SVG)');
  eq([P.intermediate.A2, P.intermediate.B2, P.intermediate.C2, P.intermediate.D2], [S.ax.A.x1, S.ax.B.x1, S.ax.C.x1, S.ax.D.x1], 'axis mid (engine)');
  Object.values(P.chakras.rows).forEach(r => [r.physics, r.energy, r.emotions].forEach(v => assert.ok(v >= 1 && v <= 22, `${tag} chakra range`)));
}
console.log(`matrix-spec-crosscheck: ${dates.length} dates, ${checked} comparisons, ok`);
