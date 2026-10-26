/* محمّل محتوى مصفوفة القدر عند الطلب.
   core.json صغير (اسم/عنوان كل أركانا + الشاكرات السبع) وكل أركانا لها ملف مستقل بيتحمّل لما المستخدم يحتاجه.
   الكاش: Promise لكل ملف في الذاكرة (طلب واحد حتى لو اتطلب من أكتر من مكان) + كاش المتصفح العادي.
   فشل التحميل مابيتخزنش، فالمحاولة الجاية تعيد الطلب. */
(() => {
  'use strict';
  const BASE = 'assets/data/matrix/';
  const VERSION = '2';                       // زوّده لما تحدّث النصوص عشان المتصفحات تجيب النسخة الجديدة
  const FIELDS = ['psychology', 'shadowTrap', 'bodySymbol', 'practice', 'physicsPsychology', 'energyPsychology', 'emotionsPsychology'];
  const cache = new Map();

  function load(file, validate) {
    if (cache.has(file)) return cache.get(file);
    const p = fetch(BASE + file + '?v=' + VERSION, { credentials: 'same-origin' })
      .then(res => { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
      .then(data => { if (!validate(data)) throw new Error('بنية الملف غير صحيحة: ' + file); return data; });
    cache.set(file, p);
    p.catch(() => cache.delete(file));
    return p;
  }
  const validId = n => Number.isInteger(n) && n >= 1 && n <= 22;
  const core = () => load('core.json', d => d && Array.isArray(d.arcana) && d.arcana.length === 22 && Array.isArray(d.chakras));
  function arcana(id) {
    if (!validId(id)) return Promise.reject(new RangeError('رقم الأركانا لازم يكون من 1 إلى 22'));
    return load('arcana-' + String(id).padStart(2, '0') + '.json', d => d && d.id === id && d.chakras && typeof d.chakras === 'object');
  }
  const clean = v => (typeof v === 'string' ? v.trim() : '');

  /* نص أركانا معينة داخل شاكرة معينة. بيرجع الحقول النصية بس (النصوص الفاضية بتتشال). */
  async function chakraText(id, chakraKey) {
    const [c, a] = await Promise.all([core(), arcana(id)]);
    const meta = c.arcana.find(x => x.id === id) || { name: {} };
    const block = (a.chakras && a.chakras[chakraKey]) || {};
    const fields = {};
    if (a.meta?.chakraContent?.status === 'published') {
      FIELDS.forEach(f => { const t = clean(block[f]); if (t) fields[f] = t; });
    }
    return { id, name: (meta.name && meta.name.ar) || '', fields, empty: Object.keys(fields).length === 0 };
  }

  /* قراءة شاكرة كاملة: ثلاث قيم (الجسد/الطاقة/المشاعر) → ثلاث بطاقات. */
  function chakraReading(chakraKey, values) {
    return Promise.all([['physics', values.physics], ['energy', values.energy], ['emotions', values.emotions]]
      .map(([aspect, id]) => chakraText(id, chakraKey).then(r => Object.assign({ aspect }, r))));
  }

  /* تلميح تحميل مسبق (بيتجاهل الأخطاء) */
  function prefetch(ids) { [...new Set(ids)].filter(validId).forEach(id => arcana(id).catch(() => {})); core().catch(() => {}); }

  window.AqeeqMatrix = { core, arcana, chakraText, chakraReading, prefetch, FIELDS };
})();
