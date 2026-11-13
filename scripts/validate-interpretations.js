#!/usr/bin/env node
/* يفحص data/interpretations/*.json: الهيكل، المفتاح الفريد، واكتمال المعتمد. */
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'data', 'interpretations');
const STATUS = ['draft', 'approved'];
const errors = [];
let total = 0, approved = 0;
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json')) : [];
for (const f of files) {
  let arr;
  try { arr = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); }
  catch (e) { errors.push(`${f}: JSON غير صالح (${e.message})`); continue; }
  if (!Array.isArray(arr)) { errors.push(`${f}: يجب أن يكون مصفوفة`); continue; }
  const seen = new Set();
  arr.forEach((o, i) => {
    const at = `${f}[${i}]`;
    total++;
    const key = [o.chart_type, o.layer, o.body, o.house, o.sign, o.modifier, o.aspect].join('|');
    if (seen.has(key)) errors.push(`${at}: مفتاح مكرر ${key}`); seen.add(key);
    if (o.chart_type !== 'natal') errors.push(`${at}: chart_type`);
    if (o.layer !== 'core') errors.push(`${at}: layer`);
    if (o.body !== f.replace(/\.json$/, '')) errors.push(`${at}: body لا يطابق اسم الملف`);
    if (!Number.isInteger(o.house) || o.house < 1 || o.house > 12) errors.push(`${at}: house`);
    if (o.id !== `${o.chart_type}.${o.layer}.${o.body}.house${o.house}`) errors.push(`${at}: id لا يطابق المفتاح`);
    if (!Number.isInteger(o.version) || o.version < 1) errors.push(`${at}: version`);
    if (!STATUS.includes(o.status)) errors.push(`${at}: status`);
    if (!Array.isArray(o.placeholders)) errors.push(`${at}: placeholders`);
    for (const k of ['sign', 'modifier', 'aspect', 'summary_mode']) if (!(k in o)) errors.push(`${at}: ينقص ${k}`);
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
