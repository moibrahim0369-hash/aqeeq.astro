#!/usr/bin/env node
/* يفحص data/interpretations/*.json: الهيكل، صحة المفتاح لكل طبقة، التفرّد، واكتمال المعتمد.
   الطبقات: core, sign_tint, modifier, aspect, angle, house_cusp, sign_only (انظر README). */
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'data', 'interpretations');
const SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
const PLANETS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
const BODIES = PLANETS.concat(['north_node', 'south_node', 'lilith', 'fortune']);
const ANGLES = ['asc', 'dsc', 'mc', 'ic'];
const ASPECTS = ['conjunction', 'sextile', 'square', 'trine', 'opposition'];
const MODS = ['retrograde'];
const STATUS = ['draft', 'approved'];
const errors = [];
let total = 0, approved = 0;

function expectedId(o, at) {
  const bad = m => { errors.push(`${at}: ${m}`); return null; };
  switch (o.layer) {
    case 'core':
      if (!BODIES.includes(o.body)) return bad('body غير معروف');
      if (!Number.isInteger(o.house) || o.house < 1 || o.house > 12) return bad('house');
      return `natal.core.${o.body}.house${o.house}`;
    case 'sign_tint':
      if (!BODIES.includes(o.body)) return bad('body غير معروف');
      if (!SIGNS.includes(o.sign)) return bad('sign');
      if (o.house != null && (!Number.isInteger(o.house) || o.house < 1 || o.house > 12)) return bad('house');
      return `natal.sign_tint.${o.body}${o.house ? '.house' + o.house : ''}.${o.sign}`;
    case 'modifier':
      if (!PLANETS.includes(o.body)) return bad('body غير معروف');
      if (!MODS.includes(o.modifier)) return bad('modifier');
      return `natal.modifier.${o.body}.${o.modifier}`;
    case 'aspect': {
      if (!PLANETS.includes(o.body)) return bad('body غير معروف');
      const [type, second] = String(o.aspect || '').split('.');
      if (!ASPECTS.includes(type) || !PLANETS.includes(second)) return bad('aspect يجب أن يكون type.body');
      if (PLANETS.indexOf(o.body) >= PLANETS.indexOf(second)) return bad('الجسم الأول يجب أن يسبق الثاني في الترتيب (sun, moon, mercury ...)');
      return `natal.aspect.${o.body}.${type}.${second}`;
    }
    case 'house_cusp':
      if (o.body !== 'house_cusp') return bad('body يجب أن يكون house_cusp');
      if (!Number.isInteger(o.house) || o.house < 1 || o.house > 12) return bad('house');
      if (!SIGNS.includes(o.sign)) return bad('sign');
      return `natal.house_cusp.house${o.house}.${o.sign}`;
    case 'sign_only':
      if (!PLANETS.includes(o.body)) return bad('body غير معروف');
      if (!SIGNS.includes(o.sign)) return bad('sign');
      return `natal.sign_only.${o.body}.${o.sign}`;
    case 'angle':
      if (!ANGLES.includes(o.body)) return bad('body غير معروف');
      if (!SIGNS.includes(o.sign)) return bad('sign');
      return `natal.angle.${o.body}.${o.sign}`;
    default: return bad('layer غير معروف');
  }
}

const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json') && !f.startsWith('_')) : [];
for (const f of files) {
  let arr;
  try { arr = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); }
  catch (e) { errors.push(`${f}: JSON غير صالح (${e.message})`); continue; }
  if (!Array.isArray(arr)) { errors.push(`${f}: يجب أن يكون مصفوفة`); continue; }
  const seen = new Set();
  arr.forEach((o, i) => {
    const at = `${f}[${i}]`;
    total++;
    if (o.chart_type !== 'natal') errors.push(`${at}: chart_type`);
    if (o.body !== f.replace(/\.json$/, '')) errors.push(`${at}: body لا يطابق اسم الملف`);
    const id = expectedId(o, at);
    if (id && o.id !== id) errors.push(`${at}: id يجب أن يكون ${id}`);
    if (seen.has(o.id)) errors.push(`${at}: id مكرر ${o.id}`); seen.add(o.id);
    if (!Number.isInteger(o.version) || o.version < 1) errors.push(`${at}: version`);
    if (!STATUS.includes(o.status)) errors.push(`${at}: status`);
    if (!Array.isArray(o.placeholders)) errors.push(`${at}: placeholders`);
    for (const k of ['sign', 'modifier', 'aspect', 'summary_mode', 'house']) if (!(k in o)) errors.push(`${at}: ينقص ${k}`);
    if (o.status === 'approved') {
      approved++;
      if (!o.summary || !o.summary.trim()) errors.push(`${at}: معتمد بلا summary`);
      if (!o.text || !o.text.trim()) errors.push(`${at}: معتمد بلا text`);
    }
  });
}
console.log(`${files.length} ملف، ${total} تفسير، ${approved} معتمد`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('سليم');
