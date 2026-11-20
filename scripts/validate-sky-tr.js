/* مدقق قراءات العبور TR في assets/js/sky-readings.js: 10 كواكب × 12 بيتًا */
const fs = require('fs'), path = require('path');
global.window = {}; eval(fs.readFileSync(path.join(__dirname, '../assets/js/sky-readings.js'), 'utf8'));
const R = window.AqReadings; Object.keys(R.TRB).forEach(p => { R.TR[p] = R.TRB[p].slice(); }); const MVS = R.TRV, KEYS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
const LEGACY = { sun: [1, 5, 7, 9], moon: [3, 5, 6, 7, 12], mercury: [1, 3, 4, 5, 8, 11], venus: [1, 2, 9] };
const EXPANDED = ['sun','moon','mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto']; // كواكب وُسّعت إلى 250 إلى 300 كلمة
const BAN = ['مفتاح', 'مفاتيح', 'طُعم', 'طعم', 'بصفتي', 'من الجدير', 'في الختام', 'محمد'];
const err = []; let filled = 0; const all = [];
KEYS.forEach(p => {
  if (!R.TR[p] || R.TR[p].length !== 12) err.push(p + ': ليس 12 بيتًا');
  R.TR[p].forEach((t, i) => {
    if (!t) return; filled++; const k = p + '|' + (i + 1); all.push({ k, t });
    BAN.forEach(w => { if (t.includes(w)) err.push(k + ': كلمة ممنوعة ' + w); });
    if (/[A-Za-z]/.test(t)) err.push(k + ': حروف لاتينية');
    if (/[—–]/.test(t)) err.push(k + ': شرطة طويلة');
    if (/[ةى]\/|\/ة|\/ي\b/.test(t)) err.push(k + ': صيغة مؤنث/مذكر مقطوعة');
    const n = t.split(/\s+/).filter(Boolean).length, legacy = (LEGACY[p] || []).includes(i + 1);
    if (EXPANDED.includes(p)) { if (n < 240 || n > 330) err.push(k + ': الطول ' + n + ' كلمة (موسّع)'); } else if (!legacy && (n < 90 || n > 150)) err.push(k + ': الطول ' + n + ' كلمة');
  });
});
Object.keys(MVS).forEach(pp => MVS[pp].forEach((vs, i) => vs.forEach((t, j) => { const k = pp + "|" + (i + 1) + "v" + (j + 2); all.push({ k, t }); BAN.forEach(w => { if (t.includes(w)) err.push(k + ": كلمة ممنوعة " + w); }); if (/[A-Za-z]/.test(t)) err.push(k + ": حروف لاتينية"); if (/[—–]/.test(t)) err.push(k + ": شرطة طويلة"); const n = t.split(/\s+/).filter(Boolean).length; if (n < 240 || n > 330) err.push(k + ": الطول " + n); })));
const grams = new Map();
const pool = all.slice(); KEYS.forEach(p => R.PH[p].forEach((t, i) => pool.push({ k: 'PH:' + p + '|' + (i + 1), t })));
for (const { k, t } of pool) {
  const w = t.replace(/[.،؛:؟!«»"]/g, ' ').split(/\s+/).filter(Boolean);
  for (let i = 0; i + 6 <= w.length; i++) { const g = w.slice(i, i + 6).join(' '); if (grams.has(g) && grams.get(g) !== k && !(k.startsWith('PH:') && grams.get(g).startsWith('PH:'))) { const a = k.replace('PH:', ''), b = grams.get(g).replace('PH:', ''); if (a !== b) err.push('تكرار 6 كلمات بين ' + k + ' و' + grams.get(g) + ': ' + g); } else grams.set(g, k); }
}
const op = {}; all.forEach(({ k, t }) => { const o = t.split(/\s+/).slice(0, 2).join(' '); (op[o] = op[o] || []).push(k); });
const isLeg = k => { const [p, h] = k.split('|'); return (LEGACY[p] || []).includes(parseInt(h)) && !/v\d/.test(h); };
Object.entries(op).forEach(([o, ks]) => { if (ks.length > 1 && ks.some(k => !isLeg(k))) err.push('افتتاح مكرر «' + o + '»: ' + ks.join('، ')); });
const seenL = {};
KEYS.forEach(p => { const L = (R.TL || {})[p] || []; if (L.length !== 12) err.push('TL ' + p + ': ليس 12 سطرًا'); L.forEach((t, i) => { const k = 'TL ' + p + '|' + (i + 1), n = t.split(/\s+/).filter(Boolean).length;
  if (n < 10 || n > 32) err.push(k + ': الطول ' + n);
  BAN.forEach(w => { if (t.includes(w)) err.push(k + ': كلمة ممنوعة ' + w); });
  if (/[A-Za-z]/.test(t)) err.push(k + ': حروف لاتينية'); if (/[—–]/.test(t)) err.push(k + ': شرطة طويلة');
  const o = t.split(/\s+/).slice(0, 2).join(' '); (seenL[o] = seenL[o] || []).push(k); }); });
Object.entries(seenL).forEach(([o, ks]) => { if (ks.length > 1) err.push('افتتاح مكرر في الأسطر «' + o + '»: ' + ks.join('، ')); });
console.log('مملوء:', filled, 'من 120');
if (err.length) { console.log(err.slice(0, 60).join('\n')); process.exit(1); }
console.log('سليم');
