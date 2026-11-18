/* مدقق نصوص التوقعات الحية في صفحة الأبراج */
const fs = require('fs'); global.window = {}; eval(fs.readFileSync(__dirname + '/../assets/js/sign-live-texts.js', 'utf8'));
const L = window.AqLive, err = [], all = [];
const BAN = ['مفتاح', 'طعم', 'طُعم'];
const wc = s => (s.match(/\S+/g) || []).length;
const add = (k, t, min, max) => { all.push([k, t]); const n = wc(t); if (n < min || n > max) err.push(k + ': الطول ' + n + ' كلمة'); BAN.forEach(w => t.includes(w) && err.push(k + ': كلمة ممنوعة ' + w)); if (/[A-Za-z]/.test(t)) err.push(k + ': حروف لاتينية'); if (/[—–]/.test(t)) err.push(k + ': شرطة طويلة'); if (/[ء-ي]\/[ء-ي]/.test(t)) err.push(k + ': شرطة بين مذكر ومؤنث'); };
L.HEAD.forEach((t, i) => add('HEAD|' + (i + 1), t, 12, 30));
for (const a of Object.keys(L.AREA)) { if (L.AREA[a].length !== 12) err.push(a + ': العدد ليس 12'); L.AREA[a].forEach((t, i) => add(a + '|' + (i + 1), t, 90, 150)); }
for (const p of Object.keys(L.RTH || {})) { if (L.RTH[p].length !== 12) err.push('RTH ' + p + ': العدد ليس 12'); L.RTH[p].forEach((t, i) => add('RTH-' + p + '|' + (i + 1), t, 90, 150)); }
for (const k of Object.keys(L)) if (!['HEAD', 'AREA', 'RTH'].includes(k) && Array.isArray(L[k])) L[k].forEach((t, i) => add(k + '|' + (i + 1), t, 90, 150));
const seen = {}; all.forEach(([k, t]) => { const o = t.split(/\s+/).slice(0, 2).join(' '); (seen[o] = seen[o] || []).push(k); });
Object.entries(seen).forEach(([o, ks]) => ks.length > 1 && err.push('افتتاح مكرر «' + o + '»: ' + ks.join('، ')));
const g = {}; all.filter(([k]) => !k.startsWith('HEAD')).forEach(([k, t]) => { const w = t.replace(/[،.؟:!]/g, '').split(/\s+/); const s = new Set(); for (let i = 0; i + 6 <= w.length; i++) s.add(w.slice(i, i + 6).join(' ')); s.forEach(x => (g[x] = g[x] || []).push(k)); });
Object.entries(g).forEach(([x, ks]) => ks.length > 1 && err.push('تكرار 6 كلمات بين ' + ks.join(' و') + ': ' + x));
console.log(err.length ? err.join('\n') : 'سليم');
