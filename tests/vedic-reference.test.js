'use strict';
// يقارن الحسابات الفيدية (أيانامشا لاهيري، القمر النجمي، التقسيمات، فيمشوتاري) بمراجع Swiss Ephemeris 2.10.03 على أربعة تواريخ.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const engineSrc = html.match(/const Astro = \(\(\) => \{[\s\S]*?\n\}\)\(\);/);
assert.ok(engineSrc, 'Astro engine extracted');
const sb = { module: { exports: {} }, console, Date, Math, Intl, window: {} };
vm.createContext(sb);
vm.runInContext(fs.readFileSync(path.join(root, 'astronomy.min.js'), 'utf8'), sb);
assert.equal(typeof sb.window.Astronomy, 'object', 'astronomy-engine loaded');
sb.Astronomy = sb.window.Astronomy;
vm.runInContext(engineSrc[0] + '\nmodule.exports = Astro; window.Astro = Astro;', sb);
const Astro = sb.module.exports;
const ext = fs.readFileSync(path.join(root, 'assets/js/extended-astro-charts.js'), 'utf8');
const aySrc = ext.match(/function ayanamsa\(jde\)\{[\s\S]*?\n  \}/);
assert.ok(aySrc, 'ayanamsa() extracted');
const ayanamsa = vm.runInContext('(' + aySrc[0] + ')', sb);
vm.runInContext(fs.readFileSync(path.join(root, 'assets/js/vedic-extras.js'), 'utf8'), sb);
const V = sb.window.AqVedic;
const arcsec = (a, b) => Math.abs((((a - b + 540) % 360) + 360) % 360 - 180) * 3600;

// مراجع Swiss Ephemeris (لاهيري، مركز الأرض): الأيانامشا والقمر النجمي
const REF = [
  { id: 'cairo-1999', utc: '1999-09-25T09:00:00Z', ayan: 23.84955397, moon: 336.99433231, sun: 158.00503453 },
  { id: 'london-1985-near-midnight', utc: '1985-02-28T23:55:00Z', ayan: 23.64634010, moon: 58.18475864, sun: 316.70280475 },
  { id: 'newyork-2012-leap-day', utc: '2012-02-29T05:05:00Z', ayan: 24.03171793, moon: 36.77571615, sun: 315.98493927 },
  { id: 'sydney-1962', utc: '1962-07-04T03:20:00Z', ayan: 23.32986280, moon: 103.68002090, sun: 78.35155447 }
];
for (const r of REF) {
  const ch = Astro.chart({ utcMs: Date.parse(r.utc), lat: 0, lon: 0, known: false });
  const ay = ayanamsa(ch.jde);
  const lon = k => Astro.norm(ch.bodies.find(b => b.key === k).lon - ay);
  const eA = Math.abs(ay - r.ayan) * 3600, eM = arcsec(lon('moon'), r.moon), eS = arcsec(lon('sun'), r.sun);
  console.log(r.id + ': ayanamsa Δ=' + eA.toFixed(2) + '″ moon Δ=' + eM.toFixed(2) + '″ sun Δ=' + eS.toFixed(2) + '″');
  assert.ok(eA <= 3, r.id + ': ayanamsa within 3″ of Swiss Ephemeris');
  assert.ok(eM <= 4, r.id + ': sidereal Moon within 4″');
  assert.ok(eS <= 4, r.id + ': sidereal Sun within 4″');
  // نفس المنزل القمري والقدم كما في المرجع
  const seg = 360 / 27;
  assert.equal(Math.floor(lon('moon') / seg), Math.floor(r.moon / seg), r.id + ': same nakshatra');
  assert.equal(Math.floor((lon('moon') % seg) / (seg / 4)), Math.floor((r.moon % seg) / (seg / 4)), r.id + ': same pada');
}

// التقسيمات: قيم كلاسيكية معروفة (0=الحمل … 11=الحوت)
assert.equal(V.div(0.5, 9), 0);      // 0° الحمل → نافامشا الحمل
assert.equal(V.div(135, 9), 4);      // 15° الأسد → فارغوتاما الأسد
assert.equal(V.div(33.5, 9), 10);    // 3°30′ الثور → الدلو (الثابتة تبدأ من التاسع)
assert.equal(V.div(60.1, 9), 6);     // 0° الجوزاء → الميزان (المزدوجة تبدأ من الخامس)
assert.equal(V.div(359.9, 9), 11);   // آخر الحوت → الحوت
assert.equal(V.div(35, 10), 10);     // 5° الثور → الدلو (الزوجية تبدأ من التاسع)
assert.equal(V.div(10, 10), 3);      // 10° الحمل → السرطان
assert.equal(V.div(10, 7), 2);       // 10° الحمل → الجوزاء
assert.equal(V.div(40, 7), 9);       // 10° الثور → الجدي (الزوجية تبدأ من السابع)

// فيمشوتاري: المجموع 120 سنة، والبداية بحاكم المنزل، ورصيد الفترة الأولى بنسبة المتبقي من المنزل
const DAY = 365.25 * 864e5, seg = 360 / 27, birth = Date.parse('1999-09-25T09:00:00Z');
const ds = V.dashas(336.99433231, birth);
assert.equal(ds.length, 9);
assert.equal(ds[0].lord, 7, 'أوتارا بهادرابادا → زحل');
assert.deepEqual(Array.from(ds, d => d.lord), [7, 8, 0, 1, 2, 3, 4, 5, 6]);
assert.ok(Math.abs((ds[8].e - ds[0].s) / DAY - 120) < 1e-9, 'cycle is 120 years');
const balance = 19 * (1 - (336.99433231 % seg) / seg);
assert.ok(Math.abs((ds[0].e - birth) / DAY - balance) < 1e-9, 'first dasha balance');
assert.ok(ds[0].s <= birth && birth < ds[0].e);
const k = V.dashas(0, birth);
assert.equal(k[0].lord, 0); assert.equal(k[0].s, birth, 'Moon at 0° Aries starts Ketu at birth');
console.log('vedic reference tests passed');

// قرارات 11 نوفمبر: راهو بالعقدة المتوسطة، وطاقة السنة من عيد الميلاد
const vsrc = fs.readFileSync(path.join(root, 'assets/js/vedic-extras.js'), 'utf8');
assert.ok(vsrc.includes("['node', 'راهو']") && !vsrc.includes("'truenode', 'راهو'"), 'Rahu uses the mean node');
const M = require(path.join(root, 'assets/js/matrix-method-adapter.js'));
const before = M.calculateDestinyMatrix('1999-09-25', new Date(2026, 8, 24)).yearEnergy;
const onDay = M.calculateDestinyMatrix('1999-09-25', new Date(2026, 8, 25)).yearEnergy;
assert.equal(before.year, 2025); assert.equal(onDay.year, 2026);
assert.equal(before.number, M.reduceArcana(7 + 9 + 9)); assert.equal(onDay.number, M.reduceArcana(7 + 9 + 10));
assert.equal(M.calculateDestinyMatrix('2000-02-29', new Date(2027, 1, 28)).yearEnergy.year, 2026);
assert.equal(M.calculateDestinyMatrix('2000-02-29', new Date(2027, 2, 1)).yearEnergy.year, 2027);
console.log('decision tests passed');
assert.equal(before.label, '2025–2026'); assert.equal(onDay.label, '2026–2027');
