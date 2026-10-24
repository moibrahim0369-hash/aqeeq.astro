// node tools/validate-matrix.mjs  — بيفحص core.json و22 ملف أركانا قبل أي نشر.
import fs from 'node:fs';
const dir = new URL('../assets/data/matrix/', import.meta.url);
const CH = ['sahasrara', 'ajna', 'vishuddha', 'anahata', 'manipura', 'svadhisthana', 'muladhara'];
const FIELDS = ['psychology', 'shadowTrap', 'bodySymbol', 'practice'];
const STATUS = ['draft', 'review', 'published'];
const errors = []; const err = (f, m) => errors.push(`${f}: ${m}`);
const read = f => { try { return JSON.parse(fs.readFileSync(new URL(f, dir), 'utf8')); } catch (e) { err(f, 'مش JSON صالح — ' + e.message); return null; } };
const core = read('core.json');
if (core) {
  if (core.arcana?.length !== 22) err('core.json', 'لازم 22 أركانا');
  if (JSON.stringify(core.chakras?.map(c => c.key)) !== JSON.stringify(CH)) err('core.json', 'الشاكرات لازم تكون السبعة بالترتيب');
}
let filled = 0, total = 0;
for (let id = 1; id <= 22; id++) {
  const f = `arcana-${String(id).padStart(2, '0')}.json`, d = read(f); if (!d) continue;
  if (d.id !== id) err(f, `id لازم يكون ${id}`);
  if (core && core.arcana[id - 1]?.slug !== d.slug) err(f, 'slug مختلف عن core.json');
  if (!STATUS.includes(d.meta?.status)) err(f, 'meta.status لازم draft أو review أو published');
  for (const k of ['psychology', 'gift', 'shadowTrap', 'growth']) if (typeof d.core?.[k] !== 'string') err(f, `core.${k} لازم نص`);
  for (const k of CH) for (const fl of FIELDS) {
    const v = d.chakras?.[k]?.[fl];
    if (typeof v !== 'string') { err(f, `chakras.${k}.${fl} لازم نص`); continue; }
    total++; if (v.trim()) filled++;
    if (/[<>]/.test(v)) err(f, `chakras.${k}.${fl}: ممنوع وسوم HTML في النص`);
  }
  for (const k of ['fatherLine', 'motherLine']) if (typeof d.ancestral?.[k] !== 'string') err(f, `ancestral.${k} لازم نص`);
}
if (errors.length) { console.error(errors.join('\n')); console.error(`\n✖ ${errors.length} خطأ`); process.exit(1); }
console.log(`✔ الملفات سليمة. نصوص الشاكرات المكتوبة: ${filled} من ${total}`);
