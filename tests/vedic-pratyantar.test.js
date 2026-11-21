'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const sb = { window: {}, Date, Math, Intl, Number }; vm.createContext(sb);
for (const f of ['vedic-extras.js', 'vedic-pratyantar.js']) vm.runInContext(fs.readFileSync(path.join(root, 'assets/js', f), 'utf8'), sb);
const V = sb.window.AqVedic, Y = [7, 20, 6, 10, 7, 18, 16, 19, 17], YEAR = 365.25 * 864e5;
const near = (a, b, message) => assert.ok(Math.abs(a - b) < 0.01, message + ': ' + a + ' vs ' + b);
function pick(list, t) { return list.find(p => t >= p.s && t < p.e); }

test('729 third-level periods follow independent product and cumulative-weight formulas', () => {
  const birth = Date.UTC(2000, 0, 1), all = V.dashas(0, birth);
  let count = 0;
  for (const m of all) for (const a of V.antars(m)) {
    const ps = V.pratyantars(a); assert.equal(ps.length, 9); let weight = 0;
    for (let i = 0; i < 9; i++) {
      const p = ps[i], lord = (a.lord + i) % 9;
      assert.equal(p.lord, lord);
      near(p.s, a.s + (a.e - a.s) * weight / 120, 'start from cumulative weights');
      near(p.e - p.s, Y[m.lord] * Y[a.lord] * Y[lord] / 14400 * YEAR, 'triple product');
      assert.ok(p.s >= a.s && p.e <= a.e && p.e > p.s);
      if (i) assert.equal(p.s, ps[i - 1].e, 'no gap at transition');
      assert.equal(pick(ps, p.s), p, 'inclusive start');
      if (i < 8) assert.equal(pick(ps, p.e), ps[i + 1], 'exclusive end');
      weight += Y[lord]; count++;
    }
    assert.equal(ps[0].s, a.s); assert.equal(ps[8].e, a.e);
    assert.equal(pick(ps, a.e), undefined, 'parent end is outside');
  }
  assert.equal(count, 729);
});

test('independent Guru/Shani/Chandra worked duration is 77.108333 days', () => {
  const m = { lord: 6, s: 0, e: 16 * YEAR };
  const a = V.antars(m).find(p => p.lord === 7);
  const p = V.pratyantars(a).find(p => p.lord === 3);
  near((p.e - p.s) / 864e5, 77.10833333333333, '16×19×10/14400 years');
});

test('birth balance keeps original maha origin, including pre-birth antar/pratyantar', () => {
  const birth = Date.UTC(2000, 0, 1), m = V.dashas(10, birth)[0];
  assert.ok(m.s < birth); near(m.e - m.s, 7 * YEAR, 'not a shortened maha');
  const a = pick(V.antars(m), birth), p = pick(V.pratyantars(a), birth);
  assert.ok(p && p.s <= birth && birth < p.e);
  near(p.e - p.s, 7 * Y[a.lord] * Y[p.lord] / 14400 * YEAR, 'full duration despite balance');
});

test('nakshatra boundary starts every nested level with the new ruler', () => {
  for (let n = 0; n < 27; n++) {
    const m = V.dashas(n * 360 / 27 + 1e-10, 0)[0];
    const a = V.antars(m)[0], p = V.pratyantars(a)[0];
    assert.equal(m.lord, n % 9); assert.equal(a.lord, m.lord); assert.equal(p.lord, m.lord);
  }
});

test('invalid parent safely yields no periods', () => {
  for (const p of [null, {}, { lord: 9, s: 0, e: 1 }, { lord: 2, s: 4, e: 4 }, { lord: 2, s: NaN, e: 5 }, { lord: -1, s: 0, e: 10 }]) assert.equal(V.pratyantars(p).length, 0);
});

test('dedicated tile, time machine and build source use the explicit API', () => {
  const h = fs.readFileSync(path.join(root, 'assets/js/vedic-hub.js'), 'utf8');
  assert.ok(h.includes("['pratyantar', 'الفترات الدقيقة'")); assert.ok(h.includes('pr = V.pratyantars(ant)'));
  const html = fs.readFileSync(path.join(root, 'index.src.html'), 'utf8');
  assert.ok(html.indexOf('vedic-pratyantar.js') > html.indexOf('vedic-extras.js'));
  assert.ok(html.indexOf('vedic-pratyantar.js') < html.indexOf('vedic-hub.js'));
});
