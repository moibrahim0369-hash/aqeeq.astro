#!/usr/bin/env node
/* يولّد data/interpretations/_manifest.json: كل مفتاح تحتاجه الخريطة، وفي أي ملف يُكتب، وأين يظهر في الصفحة،
   وحالته الحالية (missing | draft | approved). شات النصوص يقرأه ليعرف ما المطلوب بالضبط. */
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'data', 'interpretations');
const SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
const SIGN_AR = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
const L = { sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ', jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو', north_node: 'العقدة الشمالية', south_node: 'العقدة الجنوبية', lilith: 'ليليث', fortune: 'نقطة الحظ', asc: 'الطالع', dsc: 'الهابط', mc: 'وسط السماء', ic: 'قاع السماء' };
const PLANETS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
const BODIES = PLANETS.concat(['north_node', 'south_node', 'lilith', 'fortune']);
const ASP = { conjunction: 'اتصال', sextile: 'سداسي', square: 'تربيع', trine: 'تثليث', opposition: 'مقابلة' };
const out = [];
const add = (id, file, layer, where) => out.push({ id, file: `data/interpretations/${file}.json`, layer, where, status: 'missing' });
BODIES.forEach(b => { for (let h = 1; h <= 12; h++) add(`natal.core.${b}.house${h}`, b, 'core', `${L[b]} في البيت ${h} (ملخص + نص كامل)`); });
BODIES.forEach(b => SIGNS.forEach((s, i) => add(`natal.sign_tint.${b}.${s}`, b, 'sign_tint', `لون برج ${SIGN_AR[i]} على ${L[b]} (قصير، يظهر تحت النص الأساسي؛ يمكن إضافة نسخة خاصة بالبيت: natal.sign_tint.${b}.house{n}.${s})`)));
PLANETS.slice(2).forEach(b => add(`natal.modifier.${b}.retrograde`, b, 'modifier', `${L[b]} الراجع`));
for (let i = 0; i < PLANETS.length; i++) for (let j = i + 1; j < PLANETS.length; j++) Object.keys(ASP).forEach(t =>
  add(`natal.aspect.${PLANETS[i]}.${t}.${PLANETS[j]}`, PLANETS[i], 'aspect', `${L[PLANETS[i]]} ${ASP[t]} ${L[PLANETS[j]]} (يظهر تحت الكوكبين؛ الحقل aspect = "${t}.${PLANETS[j]}")`));
['asc', 'dsc', 'mc', 'ic'].forEach(a => SIGNS.forEach((s, i) => add(`natal.angle.${a}.${s}`, a, 'angle', `${L[a]} في ${SIGN_AR[i]}`)));
for (let h = 1; h <= 12; h++) SIGNS.forEach((s, i) => add(`natal.house_cusp.house${h}.${s}`, 'house_cusp', 'house_cusp', `برج ${SIGN_AR[i]} على رأس البيت ${h} (يظهر داخل أكورديون البيت، ويكفي وحده للبيت الخالي من الكواكب)`));
PLANETS.forEach(b => SIGNS.forEach((s, i) => add(`natal.sign_only.${b}.${s}`, b, 'sign_only', `${L[b]} في ${SIGN_AR[i]} بدون بيت (للميلاد بلا ساعة؛ نص مستقل لا يشير إلى بيت)`)));
const state = {};
fs.readdirSync(dir).filter(f => f.endsWith('.json') && !f.startsWith('_')).forEach(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).forEach(e => { state[e.id] = e.status; }));
out.forEach(o => { if (state[o.id]) o.status = state[o.id]; });
fs.writeFileSync(path.join(dir, '_manifest.json'), JSON.stringify({ total: out.length, entries: out }, null, 1) + '\n');
const c = out.reduce((a, o) => (a[o.status] = (a[o.status] || 0) + 1, a), {});
console.log(out.length, 'مفتاح', JSON.stringify(c));
