/* توافق مسار الحياة: 432 تركيبة (12 × 12 × 3 أنواع علاقة)، تناظر الدرجة، لا حقول فارغة، منع تكرار نص الـ11. */
const fs = require('fs'), path = require('path'), assert = require('assert');
const E = require(path.join(__dirname, '..', 'engine.js'));
const D = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data.json'), 'utf8'));
const core = require(path.join(__dirname, '..', 'assets/js/aqeeq-lifepath-core.js'));
const PATHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33], TYPES = ['love', 'family', 'business'];

assert(E.auditSynastryData(D).ok, 'data.json audit');
assert(!('audit_scripts' in D), 'audit_scripts must not live in data.json');
assert.strictEqual(core.fromISO('1992-04-14'), 3, 'core master-aware path');
assert.strictEqual(core.fromISO('1980-02-29') > 0, true);

let n = 0;
for (const a of PATHS) for (const b of PATHS) for (const t of TYPES) {
  const r = E.calculateAqeqCompatibility(a, b, 14, 5), rep = E.buildReport(r, D, t), p = rep.premium;
  n++;
  for (const [k, v] of [['p1.identity', p.path1.identity], ['p2.identity', p.path2.identity], ['p1.diagnosis', p.path1.lens.diagnosis], ['p2.diagnosis', p.path2.lens.diagnosis], ['p1.healing', p.path1.lens.healing_line], ['core.title', p.coreBridge.title], ['daily.title', p.dailyBridge.title], ['p1.magicKey', p.path1.magicKey]])
    assert(v && String(v).trim(), `${a}+${b} ${t} empty ${k}`);
  for (const cell of [p.attractionFull, p.attractionFullB]) for (const f of ['attraction_hook', 'primal_secret', 'first_meeting_vibe', 'why_they_stay'])
    assert(cell && cell[f], `${a}+${b} attraction ${f}`);
  /* تناظر: عكس الطرفين يعطي نفس الدرجة ونفس مجموعتي منظور الجذب */
  const r2 = E.calculateAqeqCompatibility(b, a, 5, 14), p2 = E.buildReport(r2, D, t).premium;
  assert.strictEqual(r.score, r2.score, `score symmetry ${a}/${b}`);
  assert.deepStrictEqual(p.attractionFull, p2.attractionFullB, `attraction A-view ${a}/${b}`);
  assert.deepStrictEqual(p.attractionFullB, p2.attractionFull, `attraction B-view ${a}/${b}`);
  /* نص الـ11 لا يتكرر */
  const nums = p.masterOverlays.map(o => o.number);
  assert.strictEqual(new Set(nums).size === nums.length || (a === b && nums.length === 2), true, `dup master text ${a}+${b}`);
}
assert.strictEqual(n, 432);
const o = E.buildReport(E.calculateAqeqCompatibility(11, 9, 14, 5), D, 'love').premium.masterOverlays;
assert.deepStrictEqual(o.map(x => x.source), ['partner1'], '11 + 9: composite 11 hidden because partner already carries 11');
assert.deepStrictEqual(E.buildReport(E.calculateAqeqCompatibility(2, 9, 14, 5), D, 'love').premium.masterOverlays.map(x => x.source), ['composite']);
assert(E.runTests().ok, 'engine built-in tests');
console.log('PASS compat-engine: 432 combos, symmetric score and attraction views, no empty slots, 11 overlay deduped');
