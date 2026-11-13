/* محمّل محتوى مصفوفة القدر عند الطلب.
   core.json صغير (اسم/عنوان كل أركانا + الشاكرات السبع) وكل أركانا لها ملف مستقل بيتحمّل لما المستخدم يحتاجه.
   الكاش: Promise لكل ملف في الذاكرة (طلب واحد حتى لو اتطلب من أكتر من مكان) + كاش المتصفح العادي.
   فشل التحميل مابيتخزنش، فالمحاولة الجاية تعيد الطلب. */
(() => {
  'use strict';
  const BASE = 'assets/data/matrix/';
  const VERSION = '23';                     // زوّده لما تحدّث النصوص عشان المتصفحات تجيب النسخة الجديدة
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

  /* الذيول الكارمية المنظّفة (Schema v2). بتتحمّل بس لما أكورديون الذيل يتفتح. */
  function karmicTails() {
    return load('karmic-tails.json', d => d && d.schemaVersion === 2 && Array.isArray(d.tails));
  }

  /* الترتيب له دلالة في سريان الطاقة:
     1) التطابق التام بالترتيب الأصلي أولاً.
     2) المعكوس فقط لو الشفرة نفسها مش مسجلة كذيل مستقل (والمعكوس مسجل).
     مفيش مطابقة بمجموعة الأرقام؛ أي ترتيب تالت يرجّع null. */
  function resolveKarmicTail(data, c1, c2, c3) {
    const tails = (data && Array.isArray(data.tails)) ? data.tails : [];
    const code = [c1, c2, c3].map(Number).join('-');
    const reverse = [c3, c2, c1].map(Number).join('-');
    const exact = tails.find(t => t.code === code);
    if (exact) return { tail: exact, match: 'exact', requested: code };
    const rev = tails.find(t => t.code === reverse);
    if (rev) return { tail: rev, match: 'reverse', requested: code };
    return null;
  }

  function karmicTail(c1, c2, c3) {
    return karmicTails().then(d => resolveKarmicTail(d, c1, c2, c3));
  }
  /* أقسام المصفوفة (Schema v2): sections/<name>.json — 22 مدخل أو أقل مع missingIds.
     قائمة بيضاء بالأسماء عشان ما يتحمّلش أي مسار تاني. */
  const SECTION_NAMES = ['center', 'talents', 'love_line', 'money_line', 'father_line', 'mother_line',
    'ancestral_programs', 'purposes', 'children_line', 'transformation_rx', 'composite_programs'];
  function section(name) {
    if (SECTION_NAMES.indexOf(name) === -1) return Promise.reject(new RangeError('قسم غير معروف: ' + name));
    return load('sections/' + name + '.json', d => d && d.schemaVersion === 2 && d.section === name && Array.isArray(d.entries));
  }
  /* مدخل أركانا واحد من قسم، أو null لو مش موجود (مثلاً أركانا في missingIds). */
  function sectionEntry(name, id) {
    if (!validId(id)) return Promise.reject(new RangeError('رقم الأركانا لازم يكون من 1 إلى 22'));
    return section(name).then(d => d.entries.find(e => e.id === id) || null);
  }
  const clean = v => (typeof v === 'string' ? v.trim() : '');

  /* نص أركانا معينة داخل شاكرة معينة. بيرجع الحقول النصية بس (النصوص الفاضية بتتشال). */
  async function chakraText(id, chakraKey) {
    const [c, a] = await Promise.all([core(), arcana(id)]);
    const meta = c.arcana.find(x => x.id === id) || { name: {} };
    const block = (a.chakras && a.chakras[chakraKey]) || {};
    const fields = {};
    if (a.meta?.chakraContent?.[chakraKey]?.status === 'published') {
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

  /* محتوى Gemini الكامل (حرفي): gemini/pos-NN.json لكل أركانا (المواضع + المرجع التشريحي) وgemini/tails.json للذيول. */
  function gemini(id) {
    if (!validId(id)) return Promise.reject(new RangeError('رقم الأركانا لازم يكون من 1 إلى 22'));
    return load('gemini/pos-' + String(id).padStart(2, '0') + '.json', d => d && d.number === id && d.positions && typeof d.positions === 'object')
      .catch(() => null);   // رقم بلا ملف مصدر (مثل 22 للمرجع أو 17 للمواضع) = لا يوجد، وليس خطأ
  }
  function geminiTails() {
    return load('gemini/tails.json', d => d && Array.isArray(d.tails));
  }

  /* شاكرتا العجز والجذر: تعريف كل مستوى + الجذر النفسي وطريقة التعامل لكل أركانا (رمزي، ليس تشخيصاً) */
  function chakraLower() { return load('chakra-lower.json', d => d && d.chakras && d.arcana); }

  window.AqeeqMatrix = {
    chakraLower,
    gemini, geminiTails,
    core, arcana, chakraText, chakraReading, prefetch, FIELDS,
    karmicTails, karmicTail, resolveKarmicTail,
    section, sectionEntry
  };
})();
