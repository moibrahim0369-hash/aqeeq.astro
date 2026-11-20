#!/usr/bin/env node
'use strict';
/* فحص مكتبة أسبكتات السماء: المفاتيح، الكلمات الممنوعة، الحروف اللاتينية، تكرار المقاطع، وتنوع الافتتاحيات */
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, '..', 'assets', 'data', 'sky-aspects');
const KEYS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
const ASP = ['conj', 'sext', 'square', 'trine', 'opp'];
const GROUPS = { moon: () => KEYS.filter(k => k !== 'moon').map(k => [k, 'moon'].sort((a, b) => KEYS.indexOf(a) - KEYS.indexOf(b)).join('|')) };
KEYS.forEach((k, i) => { if (k !== 'moon' && !GROUPS[k]) GROUPS[k] = () => KEYS.slice(i + 1).filter(o => o !== 'moon').map(o => k + '|' + o); });
/* زوايا لا تحدث في السماء لقرب الكوكبين من الشمس أو من بعضهما */
const IMPOSSIBLE = { 'sun|mercury': ['sext', 'square', 'trine', 'opp'], 'sun|venus': ['sext', 'square', 'trine', 'opp'], 'mercury|venus': ['square', 'trine', 'opp'] };
const BAN = ['مفتاح', 'مفاتيح', 'طُعم', 'طعم', 'بصفتي', 'من الجدير', 'في الختام', 'محمد'];
const err = [];
const idx = JSON.parse(fs.readFileSync(path.join(DIR, 'index.json'), 'utf8'));
const all = [];
for (const g of idx.groups) {
  const d = JSON.parse(fs.readFileSync(path.join(DIR, g + '.json'), 'utf8'));
  const expect = []; GROUPS[g]().forEach(p => ASP.forEach(a => { if (!(IMPOSSIBLE[p] || []).includes(a)) expect.push(p + '|' + a); }));
  if (['moon', 'sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'].includes(g)) {
    expect.forEach(k => { if (!d[k]) err.push(g + ': ناقص ' + k); });
    GROUPS[g]().forEach(p => { if (!d[p + '|era'] && ['uranus', 'neptune'].includes(g)) err.push(g + ': ناقص خلفية ' + p); });
    Object.keys(d).forEach(k => { if (!k.endsWith('|era') && !expect.includes(k)) err.push(g + ': مفتاح غير متوقع ' + k); });
  }
  for (const k of Object.keys(d)) {
    const e = d[k], txt = (e.t || []).join(' ') + ' ' + (e.q || '');
    all.push({ k, e, txt });
    if (e.alt) { const at = (e.alt.t || []).join(' ') + ' ' + (e.alt.q || ''); all.push({ k: k + '#alt', e: e.alt, txt: at }); if (!e.alt.q) err.push(k + ': alt بلا سؤال'); BAN.forEach(w => { if (at.includes(w)) err.push(k + '#alt: كلمة ممنوعة ' + w); }); if (/[A-Za-z]/.test(at)) err.push(k + '#alt: حروف لاتينية'); if (/[—–]/.test(at)) err.push(k + '#alt: شرطة طويلة'); const an = at.split(/\s+/).filter(Boolean).length; if (an < 80 || an > 190) err.push(k + '#alt: الطول ' + an + ' كلمة'); }
    if (!Array.isArray(e.t) || !e.t.length) err.push(k + ': t فارغ');
    BAN.forEach(w => { if (txt.includes(w)) err.push(k + ': كلمة ممنوعة ' + w); });
    if (/[A-Za-z]/.test(txt)) err.push(k + ': حروف لاتينية');
    if (/[—–]/.test(txt)) err.push(k + ': شرطة طويلة');
    const n = txt.split(/\s+/).filter(Boolean).length;
    if (n < 90 || n > 260) err.push(k + ': الطول ' + n + ' كلمة');
  }
}
/* تكرار ست كلمات متتالية بين نصين */
const grams = new Map();
for (const { k, txt } of all) {
  const w = txt.replace(/[.،؛:؟!«»"]/g, ' ').split(/\s+/).filter(Boolean);
  for (let i = 0; i + 6 <= w.length; i++) { const g = w.slice(i, i + 6).join(' '); if (grams.has(g) && grams.get(g) !== k) err.push('تكرار 6 كلمات بين ' + k + ' و' + grams.get(g) + ': ' + g); else grams.set(g, k); }
}
/* تنوع الافتتاح: أول كلمتين */
const op = {}; all.forEach(({ k, e }) => { const o = e.t[0].split(/\s+/).slice(0, 2).join(' '); (op[o] = op[o] || []).push(k); });
Object.entries(op).forEach(([o, ks]) => { if (ks.length > 1) err.push('افتتاح مكرر «' + o + '»: ' + ks.join('، ')); });
const q = all.filter(a => a.e.q).length;
console.log('نصوص:', all.length, '| بأسئلة:', q, '(' + Math.round(q / all.length * 100) + '%)');
if (err.length) { console.log(err.join('\n')); process.exit(1); }
console.log('سليم');
