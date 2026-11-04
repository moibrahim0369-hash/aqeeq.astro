// node tools/validate-matrix.mjs  — بيفحص core.json و22 ملف أركانا قبل أي نشر.
import fs from 'node:fs';
const dir = new URL('../assets/data/matrix/', import.meta.url);
const CH = ['sahasrara', 'ajna', 'vishuddha', 'anahata', 'manipura', 'svadhisthana', 'muladhara'];
const FIELDS = ['psychology', 'shadowTrap', 'bodySymbol', 'practice'];
const STATUS = ['draft', 'review', 'ready', 'published'];
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
  if (!STATUS.includes(d.meta?.status)) err(f, 'meta.status لازم draft أو review أو ready أو published');
  for (const k of ['psychology', 'gift', 'shadowTrap', 'growth']) if (typeof d.core?.[k] !== 'string') err(f, `core.${k} لازم نص`);
  for (const k of CH) for (const fl of FIELDS) {
    const v = d.chakras?.[k]?.[fl];
    if (typeof v !== 'string') { err(f, `chakras.${k}.${fl} لازم نص`); continue; }
    total++; if (v.trim()) filled++;
    if (/[<>]/.test(v)) err(f, `chakras.${k}.${fl}: ممنوع وسوم HTML في النص`);
  }
  for (const k of ['fatherLine', 'motherLine']) if (typeof d.ancestral?.[k] !== 'string') err(f, `ancestral.${k} لازم نص`);
}
// الذيول الكارمية (Schema v2) — karmic-tails.json
const KT = 'karmic-tails.json';
const CODE_RE = /^([1-9]|1[0-9]|2[0-2])-([1-9]|1[0-9]|2[0-2])-([1-9]|1[0-9]|2[0-2])$/;
const KT_TEXT = ['psychologicalDepth', 'paradox', 'childhoodRoots', 'symbolicBodyNote'];
// مصطلحات طبية صريحة ممنوعة في نصوص الذيول (التنبيه الجسدي رمزي فقط)
const MEDICAL = ['انتحار', 'اغتصاب', 'إجهاض', 'عقم', 'شلل', 'هرمون', 'الدورة الشهرية', 'المرض', 'مرض ', 'أمراض', 'ضغط الدم', 'الكلى', 'الرئت', 'اكتئاب', 'بارانويا', 'فوبيا', 'هلع', 'نرجسي', 'إدمان', 'مخدر', 'كحول', 'سموم', 'وسواس', 'جنسياً', 'الإثارة الجنسية', 'الإباحية', 'هستيري', 'مناعة'];
const ktText = (where, v) => {
  if (typeof v !== 'string' || !v.trim()) { err(KT, `${where} لازم نص مش فاضي`); return; }
  if (/[<>]/.test(v)) err(KT, `${where}: ممنوع وسوم HTML في النص`);
  for (const w of MEDICAL) if (v.includes(w)) err(KT, `${where}: مصطلح طبي ممنوع «${w}»`);
};
let tailCount = 0;
const kt = read(KT);
if (kt) {
  if (kt.schemaVersion !== 2) err(KT, 'schemaVersion لازم يكون 2');
  if (kt.contentType !== 'karmic-tails') err(KT, 'contentType لازم karmic-tails');
  if (!['unverified', 'verified'].includes(kt.engineMapping)) err(KT, 'engineMapping لازم unverified أو verified');
  ktText('safetyNote', kt.safetyNote);
  if (!Array.isArray(kt.tails) || !kt.tails.length) err(KT, 'tails لازم مصفوفة فيها ذيول');
  const codes = new Set();
  (kt.tails || []).forEach((t, i) => {
    const w = `tails[${i}]${t?.code ? ` (${t.code})` : ''}`;
    if (t.id !== i + 1) err(KT, `${w}: id لازم يكون ${i + 1}`);
    if (!CODE_RE.test(t.code ?? '')) { err(KT, `${w}: code غلط`); return; }
    if (codes.has(t.code)) err(KT, `${w}: code متكرر`);
    codes.add(t.code);
    if (!Array.isArray(t.digits) || t.digits.join('-') !== t.code) err(KT, `${w}: digits لازم تطابق code`);
    if (!Array.isArray(t.aliases) || t.aliases.some(a => !CODE_RE.test(a))) err(KT, `${w}: aliases غلط`);
    ktText(`${w}.title.ar`, t.title?.ar);
    ktText(`${w}.title.subtitle`, t.title?.subtitle);
    for (const k of KT_TEXT) ktText(`${w}.${k}`, t[k]);
    if (!Array.isArray(t.protocol) || t.protocol.length < 3) err(KT, `${w}: protocol لازم 3 خطوات على الأقل`);
    else t.protocol.forEach((p, j) => ktText(`${w}.protocol[${j}]`, p));
    for (const g of ['female', 'male']) for (const k of ['childhoodRoots', 'paradox']) ktText(`${w}.genderVariants.${g}.${k}`, t.genderVariants?.[g]?.[k]);
    if (!STATUS.includes(t.meta?.status)) err(KT, `${w}: meta.status لازم draft أو review أو ready أو published`);
    if (!['archive', 'authored'].includes(t.meta?.source)) err(KT, `${w}: meta.source لازم archive أو authored`);
    tailCount++;
  });
  // alias ميتحطش على كود هو نفسه ذيل مستقل
  for (const t of kt.tails || []) for (const a of t.aliases || []) if (codes.has(a)) err(KT, `${t.code}: alias ${a} بيتعارض مع ذيل مستقل`);
}
// أقسام المصفوفة (Schema v2) — sections/*.json
const SECTION_DEEP = {
  center: { text: ['identity', 'behavior', 'balanceKey'], list: ['shadow'] },
  money_line: { text: ['inflow', 'goldenRule'], list: ['blocks', 'sectors'] },
  love_line: { text: ['attraction', 'harmonyKey'], list: ['shadowPatterns'] },
  talents: { text: ['channel', 'gift', 'trap', 'practice'], list: [] },
  father_line: { text: ['theme', 'potential', 'challenge', 'practice'], list: ['questions'] },
  mother_line: { text: ['theme', 'potential', 'challenge', 'practice'], list: ['questions'] },
  purposes: { text: ['mission', 'maturityTest'], list: [] },
  children_line: { text: ['family'], list: [] },
  transformation_rx: { text: [], list: ['protocol'] },
  ancestral_programs: { text: ['roots', 'path'], list: [] }
};
let sectionCount = 0;
for (const [section, spec] of Object.entries(SECTION_DEEP)) {
  const f = `sections/${section}.json`;
  const d = read(f); if (!d) continue;
  const at = (where, v) => {
    if (typeof v !== 'string' || !v.trim()) { err(f, `${where} لازم نص مش فاضي`); return; }
    if (/[<>]/.test(v)) err(f, `${where}: ممنوع وسوم HTML في النص`);
    for (const w of MEDICAL) if (v.includes(w)) err(f, `${where}: مصطلح طبي ممنوع «${w}»`);
  };
  if (d.schemaVersion !== 2) err(f, 'schemaVersion لازم يكون 2');
  if (d.contentType !== 'matrix-section') err(f, 'contentType لازم matrix-section');
  if (d.section !== section) err(f, `section لازم يكون ${section}`);
  if (!['unverified', 'verified'].includes(d.engineMapping)) err(f, 'engineMapping لازم unverified أو verified');
  at('title', d.title); at('safetyNote', d.safetyNote);
  const missingIds = Array.isArray(d.missingIds) ? d.missingIds : [];
  const expectedIds = Array.from({ length: 22 }, (_, k) => k + 1).filter(x => !missingIds.includes(x));
  if (!Array.isArray(d.entries) || d.entries.length !== expectedIds.length) { err(f, `entries لازم ${expectedIds.length} مدخل (الناقص المعلن: ${missingIds.join(',') || 'مفيش'})`); continue; }
  d.entries.forEach((e, i) => {
    const w = `entries[${i}]`;
    if (e.id !== expectedIds[i]) err(f, `${w}: id لازم يكون ${expectedIds[i]}`);
    at(`${w}.arcana.ar`, e.arcana?.ar); at(`${w}.arcana.en`, e.arcana?.en);
    at(`${w}.summary`, e.summary);
    for (const k of spec.text) at(`${w}.deep.${k}`, e.deep?.[k]);
    for (const k of spec.list) {
      const arr = e.deep?.[k];
      if (!Array.isArray(arr) || !arr.length) { err(f, `${w}.deep.${k} لازم مصفوفة مش فاضية`); continue; }
      arr.forEach((v, j) => at(`${w}.deep.${k}[${j}]`, v));
    }
    // genderDynamic اختياري: بيتكتب بس لما المصدر فيه نص مرتبط بالجنس (قاعدة: مفيش تأليف من الصفر).
    if (e.genderDynamic) for (const g of ['female', 'male']) at(`${w}.genderDynamic.${g}`, e.genderDynamic?.[g]);
    if (!STATUS.includes(e.meta?.status)) err(f, `${w}: meta.status لازم draft أو review أو ready أو published`);
  });
  sectionCount++;
}
if (errors.length) { console.error(errors.join('\n')); console.error(`\n✖ ${errors.length} خطأ`); process.exit(1); }
console.log(`✔ الملفات سليمة. نصوص الشاكرات المكتوبة: ${filled} من ${total}. الذيول الكارمية: ${tailCount}. ملفات الأقسام: ${sectionCount}`);
