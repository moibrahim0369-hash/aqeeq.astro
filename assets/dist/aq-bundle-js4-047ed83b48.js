/* assets/js/age-map.js */
/**
 * محرك حساب دورات وسنوات العمر في مصفوفة القدر - عقيق أسترو
 * يوزع طاقات العمر على محيط الدائرة من سن 0 إلى 80 سنة
 * ويستخرج طاقة السنة الحالية والامتحان السنوي للمستخدم
 */
(() => {
  'use strict';

  function reduceTo22(num) {
    let val = Math.abs(Math.trunc(num));
    while (val > 22) {
      val = String(val)
        .split('')
        .map(Number)
        .reduce((a, b) => a + b, 0);
    }
    return val || 22;
  }

  /**
   * حساب طاقات محيط الدائرة لكل فترات العمر (العقدية والفرعية من 0 إلى 80 سنة)
   * @param {Object} anchors {A: day, B: month, C: year, D: karma, E: center}
   * @param {Object} corners {F: topLeft, G: topRight, H: bottomRight, I: bottomLeft}
   */
  function calculateAgeMap(anchors, corners) {
    const age0 = anchors.A;      // نقطة اليسار (يوم الميلاد / سن 0 وسن 80)
    const age10 = corners.F || corners.I; // الركن العلوي الأيسر F = A+B (مطابق للمحرك المعتمد matrix-method-adapter)
    const age20 = anchors.B;     // نقطة الأعلى (شهر الميلاد / سن 20)
    const age30 = corners.G;     // الركن العلوي الأيمن / سن 30
    const age40 = anchors.C;     // نقطة اليمين (سنة الميلاد / سن 40)
    const age50 = corners.H;     // الركن السفلي الأيمن / سن 50
    const age60 = anchors.D;     // نقطة الأسفل (الذيل الكارمي / سن 60)
    const age70 = corners.I || corners.F; // الركن السفلي الأيسر I = D+A / سن 70

    // حساب النقاط الوسيطة (كل 5 سنوات و 2.5 سنة)
    const map = {
      0: age0,
      10: age10,
      20: age20,
      30: age30,
      40: age40,
      50: age50,
      60: age60,
      70: age70,
      80: age0,

      // منتصف العقود (كل 5 سنوات)
      5: reduceTo22(age0 + age10),
      15: reduceTo22(age10 + age20),
      25: reduceTo22(age20 + age30),
      35: reduceTo22(age30 + age40),
      45: reduceTo22(age40 + age50),
      55: reduceTo22(age50 + age60),
      65: reduceTo22(age60 + age70),
      75: reduceTo22(age70 + age0)
    };

    return map;
  }

  /**
   * حساب الطاقة الحاكمة للسنة الحالية
   */
  function getCurrentAgeEnergy(birthDateStr, targetDate = new Date()) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(birthDateStr || ''));
    if (!match) return { exactAge: 0, activeEnergy: 1, milestone: 0, quadrant: 'الجوهر' };

    const [, y, m, d] = match.map(Number);
    const birthYear = y, birthMonth = m, birthDay = d;

    let age = targetDate.getFullYear() - birthYear;
    const monthDiff = (targetDate.getMonth() + 1) - birthMonth;
    if (monthDiff < 0 || (monthDiff === 0 && targetDate.getDate() < birthDay)) {
      age--;
    }

    // إذا تجاوز 80 سنة نختزل بالدورة (مصفوفة 80 سنة متجددة)
    const normalizedAge = age % 80;

    const milestones = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
    let closestMilestone = 0;
    for (let i = 0; i < milestones.length - 1; i++) {
      if (normalizedAge >= milestones[i] && normalizedAge < milestones[i + 1]) {
        closestMilestone = milestones[i];
        break;
      }
    }

    let quadrant = '';
    if (normalizedAge < 20) quadrant = 'مرحلة التكوين والوعي بالذات (0 - 20 سنة)';
    else if (normalizedAge < 40) quadrant = 'مرحلة التوسع الاجتماعي والمادي وبناء الإنجاز (20 - 40 سنة)';
    else if (normalizedAge < 60) quadrant = 'مرحلة النضج، سداد الديون، والامتحان الروحي (40 - 60 سنة)';
    else quadrant = 'مرحلة الحكمة، نقل الخبرة، والاندماج الكوني (60 - 80 سنة)';

    return {
      exactAge: age,
      normalizedAge,
      milestone: closestMilestone,
      quadrant
    };
  }

  // تفسير سنوي مكثف للطاقة الحاكمة لعمر المستخدم
  const AGE_ENERGY_THEMES = {
    1: { title: 'سنة المبادرة وإطلاق المشاريع الفردية', theme: 'سنة البدايات الجديدة، لا تنتظر إذناً من أحد؛ الأفكار التي تولد في عقلك الآن تملك قوة التنفيذ إن تحركت بمفردك دون خوف.' },
    2: { title: 'سنة الإنصات، الحدس، والدبلوماسية الهادئة', theme: 'عام مراقبة التيارات الخفية خلف الكواليس؛ لا تدخل في صدامات مباشرة، ثق بحدسك الداخلي وابتعد عن العلاقات المزدوجة والنفاق.' },
    3: { title: 'سنة الوفرة المادية، الجمال، وتجسيد المشاريع', theme: 'عام الخصوبة والرفاهية والنمو العملي والأسري؛ اهتم بمظهرك ومسكنك واستثمر في مشاريع ملموسة، واحذر من الهوس بالمظاهر والتسلط.' },
    4: { title: 'سنة النظام، المسؤولية، وتثبيت الأركان', theme: 'عام بناء الأساسات الحديدية، والترقي الإداري، وتنظيم المال والممتلكات؛ الفوضى ممنوعة، وتجنب القسوة أو محاولة السيطرة التامة على المحيطين.' },
    5: { title: 'سنة التعلم، نقل الخبرة، والالتزام بالقواعد', theme: 'عام الحصول على شهادات أو مهارات جديدة، أو تأسيس زواج مستقر؛ ابتعد عن الوعظ الجاف وافتح ذهنك للأفكار الجديدة دون تزمت.' },
    6: { title: 'سنة الحب، الاختيار القلبي، وتجميل الحياة', theme: 'عام القرارات العاطفية الحاسمة؛ إما شراكة عميقة تنقلك للنور أو فرز حاسم للعلاقات السامة؛ تجنب التردد والركض خلف المثالية المستحيلة.' },
    7: { title: 'سنة الانطلاق، السفر، وتحقيق الانتصارات', theme: 'عام الحركة السريعة والتنقل وقيادة الفريق نحو هدف واضح ومحدد؛ تجنب التهور والعدوانية مع المقربين ورتب خطواتك قبل الانطلاق.' },
    8: { title: 'سنة الميزان، العدالة، وكارما الأفعال السابقة', theme: 'سنة حصاد ما زرعته في الماضي؛ إن كانت نيتك نقية ستنال حقك والترقية والمال، وإن كانت هناك تجاوزات ستصطدم بالقانون والمراجعة الصارمة.' },
    9: { title: 'سنة العمق، البحث، وإعادة ترتيب الذات', theme: 'عام الناسك والحكمة العميقة؛ تصفية الذهن، دراسة مجالات باطنية أو تخصصات معقدة؛ احذر من العزلة الاكتئابية أو الاستعلاء بالمعرفة.' },
    10: { title: 'سنة تدفق الحظ، التزامن، وركوب الموجة', theme: 'سنة دورة الحظ الكبرى؛ ستتفتح أبواب مفاجئة بدون جهد عضلي مفرط، شرطك الوحيد هو المرونة وترك المقاومة والتحكم العبثي في مجريات القدر.' },
    11: { title: 'سنة الطاقة العالية، القوة الجسدية، والإنتاج', theme: 'عام التحمل الخارق والإنجازات الضخمة؛ جسدك يحمل طاقة بركانية تحتاج تفريغاً في الرياضة والمشاريع الإنتاجية، وإلا تحولت لتوتر عصبي وغضب.' },
    12: { title: 'سنة تغيير المنظور، الخدمة الإنسانية، والوعي البديل', theme: 'عام رؤية الأشياء من زاوية غير تقليدية؛ قد تبطؤ بعض الخطوات لتتعلم العطاء الحقيقي؛ الفخ هو لعب دور الضحية أو العجز عن قول "لا".' },
    13: { title: 'سنة التحول الجذري، الهدم، والولادة الجديدة', theme: 'عام انتهاء فصول قديمة بالكامل وبدء حياة مختلفة جذرياً؛ لا تقاوم ما يرحل، فكل ما يسقط الآن يفسح مكاناً لنهضتك الكبرى.' },
    14: { title: 'سنة الاعتدال، الشفاء النفسي، والاتزان الداخلي', theme: 'عام الخيمياء النفسية والتوازن؛ ابتعد عن الإسراف والتطرف في العمل أو المشاعر، وركز على الصحة والتغذية ونقاء الروح.' },
    15: { title: 'سنة المغناطيسية، المال، وكشف الظلال الدفينة', theme: 'عام الجاذبية الطاغية والفرص المالية الكبرى، وفي نفس الوقت عام اختبار النزاهة أمام الإغراءات والشهوات؛ تصرف بوضوح تام في النور.' },
    16: { title: 'سنة الصحوة الروحية، إسقاط الأوهام، وبناء المتين', theme: 'عام صاعقة البرج التي تهدم كل بناء هش كان يخدعك؛ التحرر من التبعيات والتعلق بالمظاهر، وبناء هوية جديدة لا تتزعزع.' },
    17: { title: 'سنة النجم، الإشعاع، والظهور الجماهيري', theme: 'عام إبراز مواهبك أمام الناس وترك بصمة ملهمة؛ ثق في بريقك الشخصي وتكلم بصوت عالٍ، واحذر من الغرور أو الخجل الذي يخفي نورك.' },
    18: { title: 'سنة سحر الخيال، التجسيد الفكري، وتطهير المخاوف', theme: 'عام الاتصال بالعقل الباطن وتجسيد ما تفكر فيه ببراعة؛ احذر من الأوهام والوساوس والشكوك، وحوّل خيالك لإبداع وكتابة وفن.' },
    19: { title: 'سنة الشمس، الوفرة، الشهرة، والبهجة الطفولية', theme: 'سنة النجاح الباهر والمكاسب المالية والأسرية السعيدة؛ شارك فرحتك وكن سخياً وكريماً مع من حولك؛ البخل يطرد بركة هذه الطاقة.' },
    20: { title: 'سنة البعث، نداء الأجداد، والقرارات المصيرية', theme: 'عام حسم النزاعات العائلية وكسر الأنماط الموروثة؛ نداء داخلي يوقظك لتأخذ مكانك الحقيقي وتسامح جذورك ليتحرر تدفق رزقك.' },
    21: { title: 'سنة الاتساع العالمي، السفر، والمشاريع الرقمية', theme: 'عام تجاوز الحدود الضيقة؛ السفر للخارج، تعلم لغات، أو إطلاق بيزنس عالمي عبر الإنترنت؛ لا تحبس نفسك في بيئة محدودة.' },
    22: { title: 'سنة الحرية المطلقة، البدايات العفوية، وكسر القيود', theme: 'عام التحرر من الأعباء القديمة والانطلاق بخفة روح وبراءة كأنك ولدت من جديد؛ تحمّل مسؤولية خياراتك حتى لا تنقلب الحرية إلى فوضى وديون.' }
  };

  function getAgeInterpretation(energyNum) {
    return AGE_ENERGY_THEMES[energyNum] || {
      title: `طاقة السنة · أركانا ${energyNum}`,
      theme: 'عام يحمل اختباراً نوعياً وتطويراً في الوعي والسلوك بما يخدم توازن مصفوفتك.'
    };
  }

  window.AqeeqAgeMap = {
    reduceTo22,
    calculateAgeMap,
    getCurrentAgeEnergy,
    getAgeInterpretation,
    AGE_ENERGY_THEMES
  };
})();

;
/* assets/js/matrix-loader.js */
/* محمّل محتوى مصفوفة القدر عند الطلب.
   core.json صغير (اسم/عنوان كل أركانا + الشاكرات السبع) وكل أركانا لها ملف مستقل بيتحمّل لما المستخدم يحتاجه.
   الكاش: Promise لكل ملف في الذاكرة (طلب واحد حتى لو اتطلب من أكتر من مكان) + كاش المتصفح العادي.
   فشل التحميل مابيتخزنش، فالمحاولة الجاية تعيد الطلب. */
(() => {
  'use strict';
  const BASE = 'assets/data/matrix/';
  const VERSION = '37';                     // زوّده لما تحدّث النصوص عشان المتصفحات تجيب النسخة الجديدة
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
    'ancestral_programs', 'purposes', 'children_line', 'transformation_rx', 'composite_programs', 'age_cycles'];
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
  /* قوالب النصوص المخصصة للشراكة والطفل: gemini/compat-NN.json و gemini/child-NN.json (خانات نصية فارغة تُملأ لاحقًا) */
  function modeSlots(mode, id) {
    if ((mode !== 'compat' && mode !== 'child') || !validId(id)) return Promise.resolve(null);
    return load('gemini/' + mode + '-' + String(id).padStart(2, '0') + '.json', d => d && d.mode === mode && Array.isArray(d.sections)).catch(() => null);
  }
  function geminiTails() {
    return load('gemini/tails.json', d => d && Array.isArray(d.tails));
  }

  /* شاكرتا العجز والجذر: تعريف كل مستوى + الجذر النفسي وطريقة التعامل لكل أركانا (رمزي، ليس تشخيصاً) */
  function chakraLower() { return load('chakra-lower.json', d => d && d.chakras && d.arcana); }

  window.AqeeqMatrix = {
    modeSlots: modeSlots,
    chakraLower,
    gemini, geminiTails,
    core, arcana, chakraText, chakraReading, prefetch, FIELDS,
    karmicTails, karmicTail, resolveKarmicTail,
    section, sectionEntry
  };
})();

;
/* assets/js/matrix-report-map.js */
/* Matrix report section inventory.
   Labels are transcribed from the project owner's checklist or current UI.
   No label below is asserted as an exact source heading until the reference is supplied. */
(function (root, factory) {
  'use strict';
  const inventory = factory();
  root.AqeeqMatrixReportMap = inventory;
  if (typeof module !== 'undefined' && module.exports) module.exports = inventory;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  return {
    schemaVersion: 1,
    hierarchyStatus: 'owner-checklist-provisional',
    reference: {
      sourceName: 'Matrix Destiny reference described by project owner',
      sourceUrl: null,
      edition: null,
      excerptsAvailable: false,
      note: 'This file records topics stated by the owner and current project behavior. Exact source headings, section order, formulas, and program combinations are not verified.'
    },
    termsFromBrief: [
      { term: 'Money Line', context: 'Earlier project brief', exactSourceHeadingVerified: false },
      { term: 'Love Line', context: 'Earlier project brief', exactSourceHeadingVerified: false },
      { term: 'Male Generation Lines', context: 'Earlier project brief', exactSourceHeadingVerified: false },
      { term: 'Female Generation Lines', context: 'Earlier project brief', exactSourceHeadingVerified: false },
      { term: 'Physics', context: 'Chakra table brief', exactSourceHeadingVerified: false },
      { term: 'Energy', context: 'Chakra table brief', exactSourceHeadingVerified: false },
      { term: 'Emotions', context: 'Chakra table brief', exactSourceHeadingVerified: false },
      { term: 'Soul Searching', context: 'Earlier axis brief', exactSourceHeadingVerified: false },
      { term: 'Socialization', context: 'Earlier axis brief', exactSourceHeadingVerified: false },
      { term: 'Spiritual Exam', context: 'Earlier axis brief', exactSourceHeadingVerified: false },
      { term: '22 Major Arcana', context: 'Earlier matrix brief', exactSourceHeadingVerified: false }
    ],
    groups: [
      {
        id: 'personality',
        ownerTopicLabel: 'الشخصية والصفات',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; exact source title unavailable',
        implementationStatus: 'partial',
        projectState: 'يعرض المركز وملخصات أركانا عامة من صياغة الموقع؛ هذه النصوص ليست مطابقة لمرجع موثق.',
        calculationRefs: ['calculateDestinyMatrix', 'nodes.center'],
        missingEvidence: 'عنوان القسم الأصلي، مواضع الشخصية الفرعية، وقاعدة كل نتيجة وتفسيرها.'
      },
      {
        id: 'talents',
        ownerTopicLabel: 'المواهب',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; exact source title unavailable',
        implementationStatus: 'partial',
        projectState: 'يوجد وصف محلي للنقطة المركبة، لكن لا توجد منظومة مواهب موثقة أو خريطة مواهب مركبة.',
        calculationRefs: ['nodes.northEast'],
        missingEvidence: 'مواضع المواهب المعتمدة، قواعد تركيبها، والتمييز بين الموهبة الشخصية والمركبة.'
      },
      {
        id: 'destiny-life-stages',
        ownerTopicLabel: 'القدر ومراحل العمر',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; exact source title unavailable',
        implementationStatus: 'partial',
        projectState: 'توجد محاور غاية حالية؛ لا توجد في وحدة المصفوفة مراحل عمر أو حدود زمنية.',
        calculationRefs: ['calculateDestinyAxes'],
        missingEvidence: 'اسم المحور الأصلي، دورات العمر، قواعد البداية والنهاية، وأي نتائج زمنية مشتقة.'
      },
      {
        id: 'money',
        ownerTopicLabel: 'المال والوفرة',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; Money Line phrase supplied in brief, not verified against source',
        implementationStatus: 'partial',
        projectState: 'يعرض الموقع وصلة تركيبية northeast → center → southwest بوصفها قراءة محلية رمزية.',
        calculationRefs: ['matrix.lines.money'],
        missingEvidence: 'تأكيد مواضع الخط ومكوناته وبرامجه قبل عرضها كقاعدة للمدرسة.'
      },
      {
        id: 'relationships',
        ownerTopicLabel: 'العلاقات والشريك المثالي',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; Love Line phrase supplied in brief, not verified against source',
        implementationStatus: 'partial',
        projectState: 'يعرض الموقع وصلة تركيبية northwest → center → southeast؛ لا يوجد تحليل موثق للشريك المثالي داخل وحدة المصفوفة.',
        calculationRefs: ['matrix.lines.love'],
        missingEvidence: 'مواضع الخط، قاعدة الشريك المثالي، برامج العلاقات، والفصل بين قراءة الفرد والتوافق.'
      },
      {
        id: 'karma-programs',
        ownerTopicLabel: 'الكارما والبرامج المركبة',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; exact source titles and program names unavailable',
        implementationStatus: 'missing',
        projectState: 'لا يوجد سجل برامج بأسماء أو معرفات أو تراكيب رقمية موثقة في وحدة المصفوفة.',
        calculationRefs: [],
        missingEvidence: 'أسماء البرامج، المعرفات، التراكيب، مواضعها، قواعد الكشف، والمصدر لكل برنامج.'
      },
      {
        id: 'ancestral-lines',
        ownerTopicLabel: 'خطوط الأب والأم والأسلاف',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; Male/Female Generation Lines phrases supplied in brief, not verified against source',
        implementationStatus: 'partial',
        projectState: 'تعرض الوحدة خطاً أبويًا وخطاً أمويًا من صيغ محلية؛ لا يثبتان وقائع وراثية أو تاريخية.',
        calculationRefs: ['calculateGenerationalLines'],
        missingEvidence: 'التسمية والتركيب الأصليان، النقاط الطرفية/المركزية، وأي برامج جيلية.'
      },
      {
        id: 'children',
        ownerTopicLabel: 'الأطفال والمواهب المرتبطة بهم',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; exact source title unavailable',
        implementationStatus: 'missing',
        projectState: 'لا يوجد قسم أطفال أو نتيجة مخصصة لهم في وحدة المصفوفة.',
        calculationRefs: [],
        missingEvidence: 'مواضع الأطفال وقواعدها وحدود القراءة الرمزية، مع تجنب الأحكام الحتمية.'
      },
      {
        id: 'chakras',
        ownerTopicLabel: 'الشاكرات',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; Physics/Energy/Emotions phrases supplied in brief, not verified against source',
        implementationStatus: 'partial',
        projectState: 'يوجد جدول 7 شاكرات وثلاثة أعمدة وإجماليات محلية. حقول التفسير التفصيلي في ملفات الأركانا الـ22 فارغة.',
        calculationRefs: ['calculateChakraHealthCard', 'AqeeqMatrix.chakraReading'],
        missingEvidence: 'مطابقة ترتيب/صيغ القيم والإجماليات مع المرجع، ثم محتوى أصلي لكل خانة؛ لا دلالة طبية.'
      },
      {
        id: 'purpose',
        ownerTopicLabel: 'الغاية ومحاورها',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; Soul Searching/Socialization/Spiritual Exam phrases supplied in brief, not verified against source',
        implementationStatus: 'partial',
        projectState: 'توجد صيغ محلية لمحوري السماء/الأرض ومحاور شخصية/اجتماعية/روحية/كوكبية؛ مطابقتها غير مثبتة.',
        calculationRefs: ['calculateDestinyAxes'],
        missingEvidence: 'تأكيد أسماء المحاور وترتيبها وطريقة اشتقاق كل محصلة.'
      },
      {
        id: 'life-guidance',
        ownerTopicLabel: 'الإرشادات الحياتية',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; exact source title unavailable',
        implementationStatus: 'partial',
        projectState: 'توجد نصائح توازن عامة في الشاكرات ونصوص أركانا مختصرة من تحرير الموقع؛ لا يوجد دليل إرشادي كامل مرتبط بقواعد مرجعية.',
        calculationRefs: ['calculateChakraHealthCard'],
        missingEvidence: 'موضع الإرشادات في بنية المرجع، ثم كتابة محتوى عقيق الأصلي بعد اعتماد النتائج.'
      },
      {
        id: 'annual-outlook',
        ownerTopicLabel: 'التوقعات السنوية',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; exact Matrix section title unavailable',
        implementationStatus: 'separate',
        projectState: 'توجد أداة فلكية منفصلة للتوجيهات السنوية؛ لم يثبت أنها قسم من تقرير المصفوفة.',
        calculationRefs: [],
        missingEvidence: 'تأكيد أن هذا المفهوم جزء من المصفوفة المرجعية وقاعدته، قبل ربطه هنا.'
      },
      {
        id: 'personal-brand',
        ownerTopicLabel: 'العلامة الشخصية',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; exact source title unavailable',
        implementationStatus: 'missing',
        projectState: 'لا يوجد قسم بهذا المعنى في وحدة المصفوفة الحالية.',
        calculationRefs: [],
        missingEvidence: 'العنوان والمواضع/النتائج المرتبطة به في المرجع، إن كان قسمًا مستقلًا.'
      },
      {
        id: 'matrix-compatibility',
        ownerTopicLabel: 'التوافق بين المصفوفات',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; exact source title unavailable',
        implementationStatus: 'separate',
        projectState: 'لا يوجد ربط موثق لمصفوفتين داخل هذه الوحدة؛ أدوات التوافق الرقمية الأخرى ليست بديلًا عن قاعدة Matrix-to-Matrix.',
        calculationRefs: [],
        missingEvidence: 'طريقة دمج مصفوفتين، المقاييس/الخطوط المستخدمة، وحدود تفسير النتيجة.'
      }
    ],
    contentModel: {
      levels: [
        'عنوان مرجعي: لا يملأ إلا بنص موثق',
        'شرح عربي مساعد: لا يغيّر معنى العنوان',
        'معرف ثابت: منفصل عن النص المعروض',
        'قاعدة ومصدرها وحالة مراجعتها',
        'نتيجة حسابية مرتبطة بالقاعدة',
        'تفسير أصلي لعقيق أسترو: يكتب بعد التحقق، ولا ينسخ محتوى مدفوعًا'
      ]
    }
  };
});

;
/* assets/js/matrix-method-adapter.js */
/**
 * Matrix Method Adapter | محول ومنهج مصفوفة القدر الرسمي
 * عقيق أسترو | Aqeeq Astro
 *
 * المدرسة المعتمدة: Natalia Ladini — Matrix of Destiny (22 Major Arcana System)
 * النطاق الحسابي: من 1 إلى 22 (الرقم 22 محفوظ دائماً، والرقم 0 يُختزل إلى 22).
 *
 * المصدر الموحد المعتمد لكافة الحسابات الهندسية ومواضع النقاط والخطوط ومراكز الطاقة.
 */

(() => {
  'use strict';

  // ==================== 1. القواعد الرياضية وقاعدة الاختزال ====================

  /**
   * حساب مجموع خانات العدد
   * digitSum(1999) = 1 + 9 + 9 + 9 = 28
   */
  function digitSum(value) {
    return String(Math.abs(Math.trunc(value)))
      .split('')
      .reduce((sum, digit) => sum + Number(digit), 0);
  }

  /**
   * قاعدة الاختزال الوحيدة المعتمدة في منهج ناتاليا لاديني
   * النطاق: 1 إلى 22.
   * - الأعداد من 1 إلى 22 تحتفظ بقيمتها دون تعديل.
   * - العدد 22 يحتفظ بقيمته كطاقة للأحمق/البدايات المفتوحة ولا يتحول إلى 4 أو 0.
   * - الأعداد الأكبر من 22 تُختزل بجمع أرقام خاناتها حتى تصل إلى نطاق 1–22.
   * - الصفر يُختزل إلى 22 (حالة رمزية للأحمق/نقطة الصفر في التاروت).
   */
  function reduceArcana(value) {
    let n = Math.abs(Math.trunc(value));
    while (n > 22) {
      n = digitSum(n);
    }
    return n || 22;
  }

  /**
   * التحقق من تاريخ الميلاد وضبطه
   */
  function normalizeBirthDate(value) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return {
        year: value.getFullYear(),
        month: value.getMonth() + 1,
        day: value.getDate()
      };
    }

    if (typeof value === 'object' && value !== null && value.year && value.month && value.day) {
      return {
        year: Number(value.year),
        month: Number(value.month),
        day: Number(value.day)
      };
    }

    const match = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(String(value || '').trim());
    if (!match) {
      throw new TypeError('تاريخ الميلاد مطلوب بصيغة YYYY-MM-DD أو Date object');
    }

    const [, y, m, d] = match.map(Number);
    const check = new Date(Date.UTC(y, m - 1, d));
    if (
      check.getUTCFullYear() !== y ||
      check.getUTCMonth() !== m - 1 ||
      check.getUTCDate() !== d
    ) {
      throw new RangeError('تاريخ الميلاد غير صالح (مثل 31/2 في سنة غير كبيسة)');
    }

    return { year: y, month: m, day: d };
  }

  // ==================== 2. الأركانا الـ 22 وبياناتها المرجعية ====================

  const ARCANA_DATA = [
    { id: 1, roman: 'I', name: 'الساحر', en: 'The Magician', archetype: 'البداية والإرادة والمبادرة والابتكار', light: 'قدرة فائقة على تحويل الأفكار إلى واقع، مبادرة قيادية، وثقة بالنفس', shadow: 'التشتت، التلاعب، أو التردد في بدء المشاريع' },
    { id: 2, roman: 'II', name: 'الكاهنة العليا', en: 'The High Priestess', archetype: 'الحدس والمعرفة والإنصات الداخلي', light: 'بصيرة عميقة، هدوء نفسي، قدرة على كتم الأسرار وقراءة ما وراء الظاهر', shadow: 'الكتمان المرضي، الشك، أو الانفصال عن العالم الخارجي' },
    { id: 3, roman: 'III', name: 'الإمبراطورة', en: 'The Empress', archetype: 'الخصوبة والرعاية والنمو والجمال', light: 'طاقة أمومة واحتواء، وفرة مادية وجمالية، إبداع متجدد وتناغم أنثوي', shadow: 'الإفراط في التحكم، التملك، أو إهمال الذات' },
    { id: 4, roman: 'IV', name: 'الإمبراطور', en: 'The Emperor', archetype: 'السلطة والنظام والمسؤولية والثبات', light: 'تنظيم استراتيجي، حماية واستقرار، قدرة على بناء الهياكل والأنظمة الكبرى', shadow: 'الجمود، التصلب في الرأي، أو التسلط' },
    { id: 5, roman: 'V', name: 'الكاهن الأعظم', en: 'The Hierophant', archetype: 'التعلم والقيم والحكمة والتعليم', light: 'نقل المعرفة، احترام القيم والتقاليد، دور المرشد والمعلم الروحي', shadow: 'الوعظية، التزمت بالقواعد، أو فرض المعتقدات بالقوة' },
    { id: 6, roman: 'VI', name: 'العاشقان', en: 'The Lovers', archetype: 'الاختيار والانسجام والتقارب والشراكة', light: 'قدرة على بناء علاقات دافئة، صدق في المشاعر، واتخاذ قرارات نابعة من القلب', shadow: 'إرضاء الآخرين على حساب النفس، التردد، أو الخوف من الاختيار' },
    { id: 7, roman: 'VII', name: 'العربة', en: 'The Chariot', archetype: 'الحركة والتقدم والشجاعة وتوجيه الطاقة', light: 'وضوح الأهداف، القيادة الديناميكية، التغلب على العقبات، والانتصار', shadow: 'الاستعجال، الصدام، أو فقدان السيطرة على الانفعالات' },
    { id: 8, roman: 'VIII', name: 'العدالة', en: 'Justice', archetype: 'العدل والإنصاف وتوازن السبب والنتيجة', light: 'فهم القوانين الكونية، إنصاف الذات والآخرين، الوضوح والنزاهة الفكرية', shadow: 'القسوة في الحكم، لوم الذات المفرط، أو الشكوى المستمرة' },
    { id: 9, roman: 'IX', name: 'الناسك', en: 'The Hermit', archetype: 'التأمل والخبرة والحكمة والاستقلال', light: 'عمق فكري وفلسفي، كفاية ذاتية، قدرة على إنارة طريق الآخرين بتجاربه', shadow: 'العزلة السلبية، الانغلاق، أو صعوبة التواصل الاجتماعي' },
    { id: 10, roman: 'X', name: 'عجلة الحظ', en: 'Wheel of Fortune', archetype: 'الدورات والفرص والتدفق والمرونة', light: 'التقاط الفرص، الثقة بتوقيت الحياة، تدفق الأحداث بيسر وسهولة', shadow: 'الانتظار السلبي للحظ، الإحباط من التقلبات، أو مقاومة التغيير' },
    { id: 11, roman: 'XI', name: 'القوة', en: 'Strength', archetype: 'القوة الهادئة والشجاعة وضبط الغرائز', light: 'احتمال عالٍ، قيادة بالحكمة والاحتواء، تحويل الغضب إلى طاقة بناءة', shadow: 'الإنهاك الجسدي، كبت المشاعر، أو العدوانية' },
    { id: 12, roman: 'XII', name: 'المعلّق', en: 'The Hanged Man', archetype: 'تغيير المنظور والتأني والخدمة النبيلة', light: 'رؤية الأمور من زاوية فريدة، تعاطف واسع، صبر حكيم وإيثار متزن', shadow: 'لعب دور الضحية، التضحية المستنزفة، أو تعليق القرارات' },
    { id: 13, roman: 'XIII', name: 'الموت', en: 'Death', archetype: 'التحول الجذري والتجدد وترك ما انتهى', light: 'القدرة على إعادة بناء الذات بعد الأزمات، التحرر من الماضي، والتجدد الدائم', shadow: 'الخوف الشديد من التغيير، التمسك بالأطلال، أو مقاومة النهايات الضرورية' },
    { id: 14, roman: 'XIV', name: 'الاعتدال', en: 'Temperance', archetype: 'التوازن والشفاء والمواءمة والتدرج', light: 'صبر هادئ، توازن بين الروح والمادة، قدرة على الشفاء الداخلي والدبلوماسية', shadow: 'تأجيل القرارات، المماطلة، أو كبت العواطف الحقيقية' },
    { id: 15, roman: 'XV', name: 'الشيطان', en: 'The Devil', archetype: 'الاختيار الواعي وقوة الجاذبية واستعادة الحرية', light: 'كاريزما مغناطيسية، طاقة مالية وجسدية هائلة، والقدرة على كشف الأوهام', shadow: 'التعلق المادي أو العاطفي، الإفراط، أو الانجراف وراء الإغراءات' },
    { id: 16, roman: 'XVI', name: 'البرج', en: 'The Tower', archetype: 'التحرر من البنى القديمة وكشف الحقيقة', light: 'شجاعة مواجهة الحقائق، هدم الأوهام لبناء أساس متين، وتحولات واعية ملهمة', shadow: 'الصدمات المفاجئة، الغضب العارم، أو التمسك بأوضاع متهالكة' },
    { id: 17, roman: 'XVII', name: 'النجمة', en: 'The Star', archetype: 'الأمل والإلهام والرؤية والموهبة البارزة', light: 'تألق فني وإبداعي، رؤية مستقبلية متفائلة، والقدرة على إلهام الجماهير', shadow: 'المثالية المفرطة، التشتت في الأحلام، أو العزلة النرجسية' },
    { id: 18, roman: 'XVIII', name: 'القمر', en: 'The Moon', archetype: 'الحدس والمشاعر والخيال والعمق النفسي', light: 'خيال خصب، قدرة على تجسيد الأفكار في الواقع، وبصيرة نفسية عميقة', shadow: 'المخاوف والأوهام، التشكك، أو الغرق في المشاعر السلبية' },
    { id: 19, roman: 'XIX', name: 'الشمس', en: 'The Sun', archetype: 'الوضوح والحيوية والنجاح والبهجة والقيادة', light: 'دفء يجذب الآخرين، كرم وسخاء، قدرة على قيادة وتنوير مشاريع ضخمة', shadow: 'الاستنزاف، حرق الأعصاب، أو الغرور وحب الظهور' },
    { id: 20, roman: 'XX', name: 'الحكم / البعث', en: 'Judgment', archetype: 'النداء الداخلي والتطهير وإصلاح كارما العائلة', light: 'وعي عميق بالرسالة العائلية، تصحيح الأنماط الموروثة، ونهضة روحية كبرى', shadow: 'اللوم والشكوى من العائلة، التردد أمام نداء الروح، أو إصدار الأحكام' },
    { id: 21, roman: 'XXI', name: 'العالم', en: 'The World', archetype: 'الاكتمال والاتساع والتكامل والوعي الكوني', light: 'رؤية عالمية متسعة، تقبل الآخر بلا قيود، وتحقيق إنجازات تعبر الحدود', shadow: 'الضيق بالحدود، التشتت قبل إغلاق المراحل، أو الخوف من العولمة' },
    { id: 22, roman: 'XXII', name: 'الأحمق', en: 'The Fool', archetype: 'الحرية والبدايات المفتوحة والفضول والمغامرة', light: 'حرية داخلية نقية، قدرة على بدء صفحة بيضاء بدون أحكام مسبقة، وثقة بالحياة', shadow: 'المخاطرة غير المحسوبة، التهرب من المسؤولية، أو السذاجة' }
  ];

  function getArcanaInfo(arcanaNumber) {
    const id = reduceArcana(arcanaNumber);
    return ARCANA_DATA.find(a => a.id === id) || ARCANA_DATA[21];
  }

  // ==================== 3. المحرك الحسابي الكامل لمصفوفة ناتاليا لاديني ====================

  /**
   * حساب مصفوفة القدر المتكاملة وفق مدرسة Natalia Ladini 22 Arcana
   */
  function calculateDestinyMatrix(birthDate, today) {
    const { year, month, day } = normalizeBirthDate(birthDate);

    // 1. الأركان الأربعة الأساسية (المربع الشخصي / Personal Diamond):
    // Left (0 yo / الغرب): طاقة اليوم (الجوهر، الشخصية، المظهر الخارجي، الجسد)
    const A = reduceArcana(day);

    // Top (20 yo / الشمال): طاقة الشهر (الاتصال الروحي، الإلهام، المواهب، حارس الروح)
    const B = reduceArcana(month);

    // Right (40 yo / الشرق): طاقة السنة (المادة، الفلوس، الصحة، المجتمع)
    const C = reduceArcana(digitSum(year));

    // Bottom (60 yo / الجنوب): طاقة الذيل الكارمي الأساسية (الكارما السابقة، الدرس المتكرر)
    const D = reduceArcana(A + B + C);

    return buildMatrixFromAnchors(A, B, C, D, { year, month, day }, today);
  }

  /**
   * يبني المصفوفة كاملة من الأركان الأربعة (A,B,C,D) المختزلة فقط.
   * يُستعمل للمصفوفة الفردية (من تاريخ الميلاد) ولمصفوفة الشراكة
   * (جمع أركان الشريكين الأربعة ثم إعادة بناء الباقي منها).
   * birth اختياري: بدونه لا تُحسب طاقة السنة الشخصية.
   */
  function buildMatrixFromAnchors(a, b, c, d, birth, today) {
    const A = reduceArcana(a), B = reduceArcana(b), C = reduceArcana(c), D = reduceArcana(d);
    // 2. المركز الأساسي (مركز راحة الروح / Center):
    // طاقة الجوهر النفسي ومنطقة الراحة
    const E = reduceArcana(A + B + C + D);

    // 3. زوايا مربع الأسلاف (المربع المائل 45° / Generational Ancestral Square):
    // Top-Left (10 yo): سلالة الأب العليا (مواهب الأب والذكور)
    const F = reduceArcana(A + B);

    // Top-Right (30 yo): سلالة الأم العليا (مواهب الأم والإناث)
    const G = reduceArcana(B + C);

    // Bottom-Right (50 yo): سلالة الأب السفلى (كارما الأب والمال والتجسد)
    const H = reduceArcana(C + D);

    // Bottom-Left (70 yo): سلالة الأم السفلى (كارما الأم والمشاعر والروح)
    const I = reduceArcana(D + A);

    // 4. الخطوط الجيلية والأسلاف:
    // خط الأب: من F إلى H
    const fatherCombined = reduceArcana(F + H);
    // خط الأم: من G إلى I
    const motherCombined = reduceArcana(G + I);
    // المركز الكارمي للأسلاف:
    // يُحسب من مجموع الزوايا الأربع كاملًا ثم يُختزل مرة واحدة (مطابق للموقع الأصلي: 22+20+13+15 = 70 → 7)
    const ancestralCenter = reduceArcana(F + G + H + I);
    // المركز المشترك الإجمالي:
    const commonCenter = reduceArcana(ancestralCenter + E);

    // 5. نقاط المحاور المتقاطعة إلى المركز:
    const A2 = reduceArcana(A + E); // النقطة الداخلية على المحور الأفقي (الجانب الشخصي)
    const B2 = reduceArcana(B + E); // النقطة الداخلية على المحور الرأسي (الجانب الروحي)
    const C2 = reduceArcana(C + E); // النقطة الداخلية على المحور الأفقي (الجانب المالي)
    const D2 = reduceArcana(D + E); // النقطة الداخلية على المحور الرأسي (الجانب الكارمي)
    const D3 = reduceArcana(D + D2); // النقطة الثالثة في ثالوث الذيل الكارمي

    // نقاط أقطار الأسلاف الداخلية:
    const F2 = reduceArcana(F + E); // نقطة وسيطة لخط الأب
    const G2 = reduceArcana(G + E); // نقطة وسيطة لخط الأم
    const H2 = reduceArcana(H + E); // نقطة وسيطة لكارما الأب
    const I2 = reduceArcana(I + E); // نقطة وسيطة لكارما الأم

    // 6. خطوط المال والعلاقات وقناة الوفرة:
    // في منهج ناتاليا لاديني: الخط الممتد في الربع السفلي الأيمن:
    // نقطة الالتقاء بين مدخل القلب (تحت المركز D2) ومدخل المال (C2):
    const balancePoint = reduceArcana(D2 + C2);
    // - مدخل العلاقات (نقطة القلب Heart Point) = reduce(الالتقاء + D2):
    const heartPoint = reduceArcana(balancePoint + D2);
    // - مدخل المال (نقطة الدولار Money Point) = reduce(الالتقاء + C2):
    const moneyPoint = reduceArcana(balancePoint + C2);

    // 7. غايات ومهام الحياة:
    // السماء والأرض:
    const sky = reduceArcana(B + D);   // السماء (الروحي)
    const earth = reduceArcana(A + C); // الأرض (المادي)
    // الغرض الأول (الشخصي - حتى عمر 40):
    const personalPurpose = reduceArcana(sky + earth);
    // الغرض الثاني (الاجتماعي / للناس - بين 40 و60):
    const socialPurpose = reduceArcana(fatherCombined + motherCombined);
    // الغرض الثالث (الروحي العام - بعد عمر 60):
    const spiritualPurpose = reduceArcana(personalPurpose + socialPurpose);
    // الغرض الرابع (الكوني / الكوكبي):
    const planetaryPurpose = reduceArcana(socialPurpose + spiritualPurpose);

    // 8. خريطة دورات الأعمار:
    // تتوزع حول محيط النجمة الثمانية باتجاه عقارب الساعة بدءاً من 0 عند A (يسار):
    const ageMap = {
      0: A,
      2.5: reduceArcana(A + reduceArcana(A + F)),
      5: reduceArcana(A + F),
      7.5: reduceArcana(F + reduceArcana(A + F)),
      10: F,
      12.5: reduceArcana(F + reduceArcana(F + B)),
      15: reduceArcana(F + B),
      17.5: reduceArcana(B + reduceArcana(F + B)),
      20: B,
      22.5: reduceArcana(B + reduceArcana(B + G)),
      25: reduceArcana(B + G),
      27.5: reduceArcana(G + reduceArcana(B + G)),
      30: G,
      32.5: reduceArcana(G + reduceArcana(G + C)),
      35: reduceArcana(G + C),
      37.5: reduceArcana(C + reduceArcana(G + C)),
      40: C,
      42.5: reduceArcana(C + reduceArcana(C + H)),
      45: reduceArcana(C + H),
      47.5: reduceArcana(H + reduceArcana(C + H)),
      50: H,
      52.5: reduceArcana(H + reduceArcana(H + D)),
      55: reduceArcana(H + D),
      57.5: reduceArcana(D + reduceArcana(H + D)),
      60: D,
      62.5: reduceArcana(D + reduceArcana(D + I)),
      65: reduceArcana(D + I),
      67.5: reduceArcana(I + reduceArcana(D + I)),
      70: I,
      72.5: reduceArcana(I + reduceArcana(I + A)),
      75: reduceArcana(I + A),
      77.5: reduceArcana(A + reduceArcana(I + A)),
      80: A
    };

    // 9. طاقة السنة الحالية:
    // طاقة شخصية تبدأ من عيد الميلاد حتى عيد الميلاد التالي (وليست بالسنة التقويمية من 1 يناير).
    // في مصفوفة الشراكة لا يوجد تاريخ ميلاد واحد، فلا تُحسب طاقة سنة شخصية.
    let currentYear = null;
    let yearEnergy = null;
    if (birth) {
      const { year, month, day } = birth;
      const now = today instanceof Date && !Number.isNaN(today.getTime()) ? today : new Date();
      const beforeBirthday = now.getMonth() + 1 < month || (now.getMonth() + 1 === month && now.getDate() < day);
      currentYear = now.getFullYear() - (beforeBirthday ? 1 : 0);
      yearEnergy = reduceArcana(A + B + reduceArcana(digitSum(currentYear)));
    }

    // 10. جدول الشاكرات السبع (7 Chakras Energy Card).
    // الأعمدة: الجسد (محور أفقي: A,C) · الطاقة (محور رأسي: B,D) · المشاعر = اختزال مجموعهما.
    // نقاط المحور (لكل ركن X): x1 = X+E (الوسطى) · x2 = X+x1 (الخارجية) · x3 = x1+E (الداخلية).
    // الصفوف بترتيب النقاط على المحور من الركن للمركز: العين الثالثة = x2، الحلق = x1، القلب = x3،
    // العجز = (C+E, D+E). موثّقة بمثالين محسوبين منشورين (mind.university 23.06.1992 وnumato.pl 15.03.1990).
    const axisTriple = X => { const x1 = reduceArcana(X + E); return { x1, x2: reduceArcana(X + x1), x3: reduceArcana(x1 + E) }; };
    const aT = axisTriple(A), bT = axisTriple(B);
    const chakraRow = (name, symbol, physics, energy) => ({ name, symbol, physics, energy, emotions: reduceArcana(physics + energy) });
    const chakras = {
      sahasrara: chakraRow('التاج', '🟣', A, B),
      ajna: chakraRow('العين الثالثة', '🔵', aT.x2, bT.x2),
      vishuddha: chakraRow('الحلق', '🔷', aT.x1, bT.x1),
      anahata: chakraRow('القلب', '🟢', aT.x3, bT.x3),
      manipura: chakraRow('الضفيرة الشمسية', '🟡', E, E),
      svadhisthana: chakraRow('العجز', '🟠', C2, D2),
      muladhara: chakraRow('الجذر', '🔴', C, D)
    };

    const chakraRows = Object.values(chakras);
    const totals = {
      physics: reduceArcana(chakraRows.reduce((acc, c) => acc + c.physics, 0)),
      energy: reduceArcana(chakraRows.reduce((acc, c) => acc + c.energy, 0)),
      emotions: reduceArcana(chakraRows.reduce((acc, c) => acc + c.emotions, 0))
    };
    totals.common = reduceArcana(totals.physics + totals.energy + totals.emotions);

    return {
      birthDate: birth ? { year: birth.year, month: birth.month, day: birth.day } : null,
      anchors: { A, B, C, D, E },
      corners: { F, G, H, I },
      nodes: {
        north: B, // في الإحداثيات الهندسية: B هي القمة
        east: C,  // C هي اليمين
        south: D, // D هي القاعدة
        west: A,  // A هي اليسار
        northEast: G,
        southEast: H,
        southWest: I,
        northWest: F,
        center: E
      },
      karmicTail: {
        base: D,
        middle: D3,
        top: D2,
        triad: [D, D3, D2]
      },
      loveLine: {
        entry: heartPoint,
        balance: balancePoint,
        root: D2,
        path: [heartPoint, balancePoint, D2]
      },
      moneyLine: {
        entry: moneyPoint,
        balance: balancePoint,
        root: C2,
        path: [moneyPoint, balancePoint, C2]
      },
      channels: {
        heartPoint,
        moneyPoint,
        balancePoint
      },
      generational: {
        father: { top: F, bottom: H, combined: fatherCombined },
        mother: { top: G, bottom: I, combined: motherCombined },
        ancestralCenter,
        commonCenter
      },
      purposes: {
        sky,
        earth,
        personal: personalPurpose,
        social: socialPurpose,
        spiritual: spiritualPurpose,
        planetary: planetaryPurpose
      },
      intermediate: { A2, B2, C2, D2, D3, F2, G2, H2, I2 },
      ageMap,
      yearEnergy: birth ? { year: currentYear, endYear: currentYear + 1, label: currentYear + '–' + (currentYear + 1), number: yearEnergy } : null,
      chakras: { rows: chakras, totals },
      ancestralPrograms: {
        fatherLine: { top: F, bottom: H, combined: fatherCombined },
        motherLine: { top: G, bottom: I, combined: motherCombined },
        combined: ancestralCenter,
        ancestralCenter,
        commonCenter
      },
      compositePrograms: {
        karmicTriad: [D, D3, D2],
        spiritualTriad: [B, B2, E],
        personalTriad: [A, A2, E],
        materialTriad: [C, C2, E]
      },
      childrenLine: {
        maternalRoot: G,
        childEnergy: reduceArcana(G + I),
        generationKey: reduceArcana(G + E)
      },
      transformationKeys: {
        balancePoint,
        skyAxis: sky,
        earthAxis: earth,
        centerKey: E
      },
      methodology: 'Natalia Ladini 22 Major Arcana'
    };
  }

  // ==================== 3ب. حلقة الأعمار والتوقعات (منطق حسابي فقط) ====================

  const RING_STEP = 1.25; // كل محطة على الحلقة تمتد 1.25 سنة (7 محطات وسيطة بين كل ركنين رئيسيين، 8 عقود = 80 سنة)

  /**
   * حلقة الأعمار الكاملة: 64 محطة (0، 1.25، 2.5 ... 78.75) ثم تعود إلى A عند 80.
   * ترتيب الأركان على المحيط: A,F,B,G,C,H,D,I. المحطات الوسيطة تُشتق بنفس معادلة ageMap في المحرك.
   */
  function buildAgeRing(m) {
    const { A, B, C, D } = m.anchors, { F, G, H, I } = m.corners;
    const ring = [A, F, B, G, C, H, D, I];
    const points = [];
    ring.forEach((p, i) => {
      const q = ring[(i + 1) % 8], mid = reduceArcana(p + q), L = reduceArcana(p + mid), R = reduceArcana(mid + q);
      points.push(p, reduceArcana(p + L), L, reduceArcana(L + mid), mid, reduceArcana(mid + R), R, reduceArcana(R + q));
    });
    return points; // 64 قيمة، الفهرس k يقابل العمر k × 1.25
  }

  /** طاقة الحلقة عند موضع عمري (بالسنوات، قد يكون كسريًا). */
  function ringAt(points, pos) {
    const p = ((pos % 80) + 80) % 80;
    const k = Math.floor(p / RING_STEP + 1e-9);
    return { position: Math.round(pos * 1000) / 1000, segment: k, ring: points[k % 64], ringNext: points[(k + 1) % 64] };
  }

  // وسوم دليل اليوم (تقويم الحظ): كل رقم أركانا يظهر تحت كل وسم يحتويه
  const DAY_TAGS = [
    { id: 'money_business', label: 'مناسب للمال والأعمال وتوقيع العقود', arcana: [1, 3, 4, 7, 8, 10, 15, 19, 21] },
    { id: 'love_relationships', label: 'مناسب للحب والعلاقات والتواصل', arcana: [2, 3, 6, 14, 17, 18, 22] },
    { id: 'health_wellness', label: 'مناسب للصحة والرياضة والتعافي', arcana: [2, 5, 9, 11, 12, 14] },
    { id: 'travel', label: 'مناسب للسفر والحركة والتجديد', arcana: [7, 10, 17, 21, 22] },
    { id: 'caution_reflection', label: 'يوم للتأمل والمراجعة وتأجيل القرارات المصيرية', arcana: [9, 12, 13, 16, 18, 20] }
  ];

  /** وسوم اليوم لرقم أركانا (1..22): مصفوفة من { id, label } */
  function getDayCategories(arcana) {
    const n = reduceArcana(arcana);
    return DAY_TAGS.filter(t => t.arcana.includes(n)).map(t => ({ id: t.id, label: t.label }));
  }

  /**
   * التوقعات الزمنية:
   * - السنة من عيد الميلاد إلى عيد الميلاد: طاقة السنة = A + B + مجموع خانات سنة بداية الدورة.
   * - الشهر i (1..12 من عيد الميلاد) = اختزال(طاقة السنة + i).
   * - الأسبوع = اختزال(طاقة الشهر + رقم الأسبوع داخل الشهر).
   * - اليوم = اختزال(طاقة الشهر + اختزال(رقم اليوم في الشهر التقويمي)).
   * وإلى جانبها محطة حلقة الأعمار (ring) لكل فترة. كل عنصر يعطي رقم الأركانا فقط
   * ليُربط بنص الموقع؛ لا نصوص جديدة هنا.
   */
  function calculateForecast(birthDate, today) {
    const m = calculateDestinyMatrix(birthDate, today);
    const { year, month, day } = m.birthDate;
    const now = today instanceof Date && !Number.isNaN(today.getTime()) ? today : new Date();
    const dayMs = 86400000;
    const utc = (y, mo, d) => Date.UTC(y, mo, d);
    const nowUtc = utc(now.getFullYear(), now.getMonth(), now.getDate());
    const before = now.getMonth() + 1 < month || (now.getMonth() + 1 === month && now.getDate() < day);
    const age = now.getFullYear() - year - (before ? 1 : 0);
    const bd = y => utc(y, month - 1, day); // 29/2 في سنة غير كبيسة يتحول تلقائيًا إلى 1/3
    const start = bd(year + age), end = bd(year + age + 1);
    const span = (end - start) / dayMs;
    const points = buildAgeRing(m);
    const ringAtMs = ms => ringAt(points, age + (ms - start) / dayMs / span);
    const fmt = ms => new Date(ms).toISOString().slice(0, 10);
    const personalYear = m.yearEnergy.number;

    const months = [];
    for (let i = 0; i < 12; i++) {
      const ms = utc(year + age, month - 1 + i, day), nx = i === 11 ? end : utc(year + age, month + i, day);
      months.push(Object.assign({ index: i + 1, from: fmt(ms), to: fmt(nx - dayMs), msFrom: ms, msTo: nx - dayMs,
        number: reduceArcana(personalYear + i + 1) }, ringAtMs(ms)));
    }
    const monthOf = ms => { let k = 0; months.forEach((x, i) => { if (x.msFrom <= ms) k = i; }); return months[k]; };

    const weeks = [], perMonth = {};
    for (let ms = start; ms < end; ms += 7 * dayMs) {
      const mo = monthOf(ms); perMonth[mo.index] = (perMonth[mo.index] || 0) + 1;
      weeks.push(Object.assign({ index: weeks.length + 1, monthIndex: mo.index, weekInMonth: perMonth[mo.index],
        from: fmt(ms), to: fmt(Math.min(ms + 6 * dayMs, end - dayMs)), msFrom: ms,
        number: reduceArcana(mo.number + perMonth[mo.index]) }, ringAtMs(ms)));
    }
    const weekOf = ms => { let k = 0; weeks.forEach((x, i) => { if (x.msFrom <= ms) k = i; }); return weeks[k]; };
    const dayOf = ms => {
      const mo = monthOf(ms), dd = new Date(ms).getUTCDate(), number = reduceArcana(mo.number + reduceArcana(dd));
      return Object.assign({ date: fmt(ms), monthIndex: mo.index, number, tags: getDayCategories(number) }, ringAtMs(ms));
    };
    const strip = x => { const o = Object.assign({}, x); delete o.msFrom; delete o.msTo; return o; };
    return {
      age,
      yearRange: { from: fmt(start), to: fmt(end - dayMs), label: m.yearEnergy.label },
      yearPersonal: personalYear,
      yearRing: ringAtMs(start),
      months: months.map(strip), weeks: weeks.map(strip),
      currentMonth: strip(monthOf(nowUtc)),
      currentWeek: strip(weekOf(nowUtc)),
      today: dayOf(nowUtc),
      dayAt: (y, mo, d) => dayOf(utc(y, mo - 1, d)) // يوم داخل السنة الحالية للدورة (للتقويم لاحقًا)
    };
  }

  // ==================== 4. تصدير النظام ====================

  const adapterApi = {
    digitSum,
    reduceArcana,
    normalizeBirthDate,
    calculateDestinyMatrix,
    buildMatrixFromAnchors,
    buildAgeRing,
    calculateForecast,
    getDayCategories,
    DAY_TAGS,
    getArcanaInfo,
    ARCANA_DATA,
    version: '2.0.0',
    method: 'Natalia Ladini (22 Major Arcana)',
    updatedAt: '2026-11-01'
  };

  const root = typeof window !== 'undefined' ? window : globalThis;
  root.AqeeqMatrixMethodAdapter = adapterApi;
  root.MatrixMethodAdapter = adapterApi;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = adapterApi;
  }
})();

;
/* assets/js/numerology-matrix.js */
/**
 * Aqeeq Astro — Destiny Matrix Engine & UI (Ivory & Champagne Gold Edition)
 * Natalia Ladini — 22 Major Arcana System
 *
 * Implements:
 * 1. 8-Pointed Star SVG Geometry (Calculated Responsive Geometry)
 * 2. 15-Section Luxury Accordion (Ivory & Champagne Gold Theme)
 * 3. Unified Content Architecture with Structured Slots
 * 4. Interactive Node Highlighting & Direct Navigation
 * 5. Full Backward Compatibility with Existing Tests & Contracts
 */

(() => {
  'use strict';

  const adapter = window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter;
  if (!adapter) {
    console.warn('MatrixMethodAdapter not loaded yet; will defer initialization.');
  }

  // ==================== 1. التوليد الهندسي لرسم الـ SVG ====================

  /**
   * توليد رسم SVG النجمة الثمانية متناسق الإحداثيات (viewBox 0 0 800 800)
   */
  // ==================== 0. أيقونات خطية موحدة (Monoline 1.7) بدل الإيموجي ====================
  const SVG_OPEN = '<svg class="aqm-ico" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  const ICON_SVG = {
    center: SVG_OPEN + '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8z"/></svg>',
    karmic_tail: SVG_OPEN + '<circle cx="12" cy="5" r="2"/><path d="M12 7v13M8 11h8M6 16a6 6 0 0 0 12 0"/></svg>',
    purposes: SVG_OPEN + '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>',
    personal: SVG_OPEN + '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    talents: SVG_OPEN + '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>',
    father_line: SVG_OPEN + '<path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z"/></svg>',
    mother_line: SVG_OPEN + '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="7" r="2.5"/><circle cx="17" cy="12" r="2.5"/><circle cx="12" cy="17" r="2.5"/><circle cx="7" cy="12" r="2.5"/></svg>',
    ancestral_programs: SVG_OPEN + '<path d="M3 9l9-5 9 5M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/></svg>',
    love_line: SVG_OPEN + '<path d="M12 20s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7.6 4.2 4.2 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/></svg>',
    money_line: SVG_OPEN + '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M14.5 9.5c0-1-1-1.5-2.5-1.5s-2.5.6-2.5 1.6 1 1.4 2.5 1.7 2.5.7 2.5 1.7-1 1.6-2.5 1.6-2.5-.6-2.5-1.6"/></svg>',
    chakras: SVG_OPEN + '<circle cx="12" cy="5" r="2"/><path d="M12 7v4M7 13c1.5 2.5 8.5 2.5 10 0M9 17h6"/></svg>',
    composite_programs: SVG_OPEN + '<circle cx="12" cy="11" r="7"/><path d="M9 20h6M10 22h4"/></svg>',
    children_line: SVG_OPEN + '<path d="M12 21v-9M12 12c0-4 3-7 7-7 0 4-3 7-7 7zM12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5z"/></svg>',
    age_cycles: SVG_OPEN + '<path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9"/></svg>',
    transformation_rx: SVG_OPEN + '<path d="M12 4v16M6 20h12M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/></svg>'
  };

  // مسار الحياة: نفس منهج الجمع الكلي (index.html) مع الإبقاء على 11 و22 و33
  function lifePathOf(dateStr) {
    return window.AqeqLifePathCore.fromISO(dateStr);
  }

  // ألوان الشاكرات المعتمدة (من أعلى لأسفل)
  const CHAKRA_COLORS = { sahasrara: '#8E6E85', ajna: '#4E7988', vishuddha: '#7EA0B7', anahata: '#5A7E64', manipura: '#E6C280', svadhisthana: '#C06C54', muladhara: '#8B263E' };

  // ==================== 0b. تصدير بطاقة القصة (PNG 9:16) ====================
  function exportStoryCard(host, P, name, dateStr) {
    const svgEl = host.querySelector('.aqm-svg');
    if (!svgEl) return;
    const W = 1080, H = 1920;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    // خلفية كريمية دافئة بتدرج رأسي
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#FDFBF7'); bgGrad.addColorStop(1, '#F5EFEB');
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center'; ctx.direction = 'rtl';
    ctx.fillStyle = '#6B263D'; ctx.font = '700 64px serif';
    ctx.fillText('عقيق أسترو', W / 2, 150);
    ctx.fillStyle = '#C5A46D'; ctx.fillRect(W / 2 - 120, 185, 240, 3);
    ctx.fillStyle = '#2D2522'; ctx.font = '700 58px serif';
    ctx.fillText(name || 'مستخدم عقيق أسترو', W / 2, 290);
    ctx.fillStyle = '#74685F'; ctx.font = '400 38px serif';
    ctx.fillText('تاريخ الميلاد: ' + dateStr + '   ·   الطاقة الحاكمة: ' + P.anchors.E, W / 2, 350);

    const clone = svgEl.cloneNode(true);
    clone.setAttribute('width', '900'); clone.setAttribute('height', '900');
    // النسخة المصدّرة فقط: خلفية الرسم شفافة لتظهر العلامة المائية، وتسميات الأعمار أرقام هادئة بدون كلمة "سنة"
    clone.querySelector('.aqm-svg-bg')?.remove();
    // الصورة المرسومة لا تستقبل CSS الصفحة: نثبّت لون الرقم وحجمه ومحاذاته داخل النسخة المصدّرة مباشرة
    clone.querySelectorAll('.aqm-node-text').forEach(t => {
      t.style.fill = t.getAttribute('fill') || '#1A1A1A';
      t.style.fontSize = (t.getAttribute('font-size') || '22') + 'px';
      t.style.fontWeight = '800';
      t.style.textAnchor = 'middle';
      t.style.dominantBaseline = 'central';
    });
    clone.querySelectorAll('.aqm-svg-age-label').forEach(t => {
      t.textContent = t.textContent.replace(/\s*سنة\s*/g, '').replace(/\s+/g, '').trim();
      t.style.fill = '#8A7A70';
      t.style.fontWeight = '600';
    });
    const svgStr = new XMLSerializer().serializeToString(clone);
    const img = new Image();
    img.onload = () => {
      // علامة مائية خافتة جداً خلف الرسم الهندسي (لا تؤثر على قراءة الأرقام)
      ctx.save();
      ctx.translate(W / 2, 870); ctx.rotate(-30 * Math.PI / 180);
      ctx.fillStyle = 'rgba(142, 40, 0, 0.03)'; ctx.font = '900 150px serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('عقيق أسترو', 0, 0);
      ctx.restore();
      ctx.textBaseline = 'alphabetic';
      ctx.drawImage(img, (W - 900) / 2, 420, 900, 900);
      const caps = [
        ['الجوهر', P.anchors.A],
        ['مسار الحياة', lifePathOf(dateStr)],
        ['الذيل الكارمي', P.anchors.D],
        ['خط المال', P.channels.moneyPoint],
        ['خط الحب', P.channels.heartPoint]
      ];
      const capW = 190, capH = 168, gap = 18, startX = (W - (capW * caps.length + gap * (caps.length - 1))) / 2;
      caps.forEach((c, i) => {
        const x = startX + i * (capW + gap), y = 1450;
        // بطاقة زجاجية: تعبئة بيضاء شبه شفافة وحد ناعم وظل خفيف
        ctx.save();
        ctx.shadowColor = 'rgba(92, 44, 34, 0.10)'; ctx.shadowBlur = 22; ctx.shadowOffsetY = 6;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
        ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, capW, capH, 30) : ctx.rect(x, y, capW, capH);
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = 'rgba(215, 196, 182, 0.85)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, capW, capH, 30) : ctx.rect(x, y, capW, capH);
        ctx.stroke();
        ctx.fillStyle = '#7D6B63'; ctx.font = '700 28px serif';
        ctx.fillText(c[0], x + capW / 2, y + 52);
        ctx.fillStyle = '#4A1E17'; ctx.font = '800 78px serif';
        ctx.fillText(String(c[1]), x + capW / 2, y + 134);
      });
      ctx.fillStyle = '#74685F'; ctx.font = '400 28px serif';
      ctx.fillText('مصفوفة القدر · للتأمل والوعي الذاتي', W / 2, 1720);
      URL.revokeObjectURL(img.src);
      canvas.toBlob(blob => {
        if (!blob) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'aqeeq-destiny-story.png';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      }, 'image/png');
    };
    img.src = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' }));
  }

  /* نقاط المحاور الأربعة (ثلاث نقاط لكل محور بين الطرف X والمركز E) بالمعادلة القياسية الموحّدة:
     mid = reduce(X+E) · outer = reduce(X+mid) · inner = reduce(mid+E). دالة نقية قابلة للاختبار. */
  function axisPoints(P, reduce) {
    const { A, B, C, D, E } = P.anchors;
    const axis = X => { const mid = reduce(X + E); return { mid, outer: reduce(X + mid), inner: reduce(mid + E) }; };
    return { left: axis(A), top: axis(B), right: axis(C), bottom: axis(D) };
  }

  /* نقاط الخطوط المائلة (الأجداد): لكل ركن F,G,H,I نقطتان بين الركن والمركز.
     inner (جهة المركز) = reduce(الركن + مركز الأجداد) · outer (جهة الركن) = reduce(الركن + inner).
     تحقّق على تاريخين مرجعيين (1999-09-25 و1998-01-07). */
  function diagonalPoints(P, reduce) {
    const anc = P.generational.ancestralCenter;
    const pt = X => { const inner = reduce(X + anc); return { inner, outer: reduce(X + inner) }; };
    return { F: pt(P.corners.F), G: pt(P.corners.G), H: pt(P.corners.H), I: pt(P.corners.I) };
  }

  function generateMatrixSVG(P) {
    const { anchors, corners, channels, intermediate, ageMap, generational } = P;
    const { A, B, C, D, E } = anchors;
    const { F, G, H, I } = corners;
    // الجمع الاختزالي 22 من المحرك نفسه (لا تغيير في منطق الحساب): تُستخدم فقط لرسم النقاط الأفقية اليسرى
    const reduce22 = n => (window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter).reduceArcana(n);
    // نقاط المحاور بالمعادلة القياسية الموحّدة: X2 = X+E، الخارجية = X+X2، الداخلية = X2+E
    const ax = P.pairAxis || axisPoints(P, reduce22);   // مصفوفة الشراكة تمرّر نقاطها المجموعة لكل موضع
    const dg = P.pairDiag || diagonalPoints(P, reduce22);
    const hP3 = ax.left.outer, hP1 = ax.left.mid, hP2 = ax.left.inner;
    const tB = ax.top.outer, tTop3 = ax.top.inner;
    const mP1 = ax.right.mid, mP2 = ax.right.outer;   // الداخلية اليمنى = نقطة المال (تُرسم في موضعها الخاص)
    const T = { purple: '#8E6E85', petrol: '#4E7988', sky: '#7EA0B7', green: '#5A7E64', solar: '#E6C280', lgreen: '#B7D3AE', orange: '#C06C54', wine: '#8B263E', white: '#FFFFFF' };
    const DARK = [T.purple, T.petrol, T.green, T.orange, T.wine];
    const { heartPoint, moneyPoint, balancePoint } = channels;

    // الإحداثيات الهندسية المعتمدة (المركز 400, 400) — لا تتغير
    const pos = {
      center: [400, 400],
      west: [130, 400],      // A — 0 سنة
      north: [400, 130],     // B — 20 سنة
      east: [670, 400],      // C — 40 سنة
      south: [400, 670],     // D — 60 سنة
      northWest: [210, 210], // F — 10 سنين
      northEast: [590, 210], // G — 30 سنة
      southEast: [590, 590], // H — 50 سنة
      southWest: [210, 590], // I — 70 سنة
      A2: [265, 400],
      B2: [400, 265],
      C2: [535, 400],
      D2: [400, 535],
      D3: [400, 602],
      heart: [426.5, 494],
      money: [494, 434],
      balance: [453, 453]
    };

    const r2 = n => Math.round(n * 100) / 100;
    const polar = (radius, deg) => [400 + radius * Math.cos(deg * Math.PI / 180), 400 + radius * Math.sin(deg * Math.PI / 180)];
    // العمر 0 عند الغرب ويتقدم مع اتجاه عقارب الساعة حتى 80 سنة
    const ageDeg = age => 180 + (age / 80) * 360;
    // تقصير الخط بمقدار d من طرفيه حتى لا يغطي العُقد
    const shorten = (p, q, d) => {
      const dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy);
      const ux = dx / len, uy = dy / len;
      return [[p[0] + ux * d, p[1] + uy * d], [q[0] - ux * d, q[1] - uy * d]];
    };

    // مسطرة القياس الفلكية: 80 تدريجة (سنة لكل تدريجة) وأرقام كل 10 سنين
    let ticks = '';
    for (let y = 0; y < 80; y++) {
      const d = ageDeg(y);
      const major = y % 10 === 0;
      const a = polar(major ? 342 : 356, d), b = polar(368, d);
      ticks += `<line x1="${r2(a[0])}" y1="${r2(a[1])}" x2="${r2(b[0])}" y2="${r2(b[1])}" class="aqm-svg-tick${major ? ' is-major' : ''}" />`;
    }
    let ageLabels = '';
    for (let y = 0; y < 80; y += 5) {
      const p = polar(326, ageDeg(y));
      const pe = polar(326, ageDeg(y) + 5.2), py = polar(326, ageDeg(y) - 5.2);
      const en = ageMap && ageMap[y];
      ageLabels += `<text x="${r2(py[0])}" y="${r2(py[1])}" class="aqm-svg-age-label">${y === 0 ? '0/80' : y}</text>`;
      if (en) ageLabels += `<text x="${r2(pe[0])}" y="${r2(pe[1])}" class="aqm-svg-age-energy" data-age="${y}">${en}</text>`;
    }

    // مصفوفة الشراكة: أرقام الأعمار كل 10 سنين خارج الحلقة + 7 محطات بين كل ركنين داخلها
    if (P.pairAges) {
      ageLabels = '';
      for (let y = 0; y < 80; y += 10) {
        const p = polar(392, ageDeg(y));
        ageLabels += `<text x="${r2(p[0])}" y="${r2(p[1])}" class="aqm-svg-age-label">${y === 0 ? '0/80' : y}</text>`;
      }
      P.pairAges.forEach(a => {
        const p = polar(322, ageDeg(a.age));
        ageLabels += `<text x="${r2(p[0])}" y="${r2(p[1])}" class="aqm-svg-age-energy aqm-svg-age-station" data-age="${a.age}">${a.value}</text>`;
      });
    }

    // أسهم خطوط الأسلاف (خط الأب: F → H، خط الأم: G → I)
    const [fatherA, fatherB] = shorten(pos.northWest, pos.southEast, 26);
    const [motherA, motherB] = shorten(pos.northEast, pos.southWest, 26);

    const nodeG = (cls, section, title, arc, p, r, inner, fill, posKey) => {
      const st = fill ? ` style="fill:${fill}"` : '';
      const dark = !!fill && DARK.includes(fill);
      const tc = dark ? ' is-dark' : '';
      // حجم الرقم يتناسب مع قطر الدائرة (نحو 60% من القطر عرضاً): يُكتب كخاصية على وسم <text> نفسه
      const fs = r >= 26 ? 34 : r >= 23 ? 27 : 22;
      const txtFill = dark ? '#ffffff' : '#1A1A1A';
      return `
        <g class="aqm-node ${cls}${r >= 26 ? ' aqm-node-primary' : ''}" data-section="${section}" data-position="${posKey || section}" data-title="${title}" data-arcana="${arc}" transform="translate(${p[0]}, ${p[1]})">
          <circle cx="0" cy="0" r="${r}" class="aqm-node-bg"${st} />
          ${inner || ''}
          <text x="0" y="0" class="aqm-node-text${tc}" font-size="${fs}" font-weight="bold" fill="${txtFill}" text-anchor="middle" dominant-baseline="central">${arc}</text>
        </g>`;
    };

    return `
      <svg class="aqm-svg" viewBox="-24 -24 848 848" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="رسم مصفوفة القدر الهندسية">
        <style>
          svg.aqm-svg .aqm-svg-bg { fill: #FAF7F0; }
          svg.aqm-svg .aqm-svg-dial-ring { fill: none; stroke: #C5A46D; stroke-width: 1.2; }
          svg.aqm-svg .aqm-svg-dial-ring.is-outer { stroke-width: 1.8; }
          svg.aqm-svg .aqm-svg-tick { stroke: rgba(197, 164, 109, 0.75); stroke-width: 0.8; }
          svg.aqm-svg .aqm-svg-tick.is-major { stroke: #A8865A; stroke-width: 1.2; }
          svg.aqm-svg .aqm-svg-guide { fill: none; stroke: rgba(197, 164, 109, 0.22); stroke-width: 1.2; stroke-dasharray: 4, 6; }
          svg.aqm-svg .aqm-svg-personal-square { fill: none; stroke: #B79B66; stroke-width: 1.5; stroke-opacity: 0.95; stroke-linejoin: round; }
          svg.aqm-svg .aqm-svg-ancestral-square { fill: none; stroke: rgba(197, 164, 109, 0.8); stroke-width: 1.2; stroke-dasharray: 6, 5; }
          svg.aqm-svg .aqm-svg-axis { stroke: rgba(138, 118, 96, 0.55); stroke-width: 1.2; }
          svg.aqm-svg .aqm-svg-father { stroke: #8E6E85; stroke-width: 1.6; stroke-opacity: 0.9; }
          svg.aqm-svg .aqm-svg-mother { stroke: #B5443E; stroke-width: 1.6; stroke-opacity: 0.9; }
          svg.aqm-svg .aqm-svg-love-channel { stroke: #C89B9E; stroke-width: 1.5; stroke-dasharray: 2, 6; stroke-linecap: round; fill: none; }
          svg.aqm-svg .aqm-svg-money-channel { stroke: #C5A46D; stroke-width: 1.5; stroke-dasharray: 2, 6; stroke-linecap: round; fill: none; }
          svg.aqm-svg .aqm-svg-age-label { fill: #5E4A52; font-size: 13px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
          svg.aqm-svg .aqm-svg-age-energy { fill: #8B263E; font-size: 15px; font-weight: 800; text-anchor: middle; dominant-baseline: central; }
          svg.aqm-svg .aqm-svg-age-station { font-size: 11px; font-weight: 700; }
          svg.aqm-svg .aqm-svg-watermark { fill: #B89758; opacity: 0.17; font-size: 22px; font-weight: 700; text-anchor: end; letter-spacing: .5px; pointer-events: none; }
          svg.aqm-svg .aqm-svg-money-sign { fill: #5E7D52; font-size: 18px; font-weight: 700; }
          svg.aqm-svg .aqm-node-bg { fill: #FFFFFF; stroke: #C5A46D; stroke-width: 1.5; }
          svg.aqm-svg .aqm-node-text { font-weight: 700; }
          svg.aqm-svg .aqm-node-text { fill: #6B263D; font-weight: 800; }
          svg.aqm-svg .aqm-node-love .aqm-node-bg { stroke: #C89B9E; }
          svg.aqm-svg .aqm-node-money .aqm-node-bg { stroke: #C5A46D; }
          svg.aqm-svg .aqm-node-balance .aqm-node-bg { fill: #E7D7C2; }
          svg.aqm-svg .aqm-node-balance .aqm-node-text { fill: #2D2522; }
          svg.aqm-svg .aqm-node-center .aqm-node-bg { fill: #FFFFFF; stroke: #6B263D; stroke-width: 2.6; }
          svg.aqm-svg .aqm-node-center .aqm-node-ring { fill: none; stroke: #C5A46D; stroke-width: 1.2; }
          svg.aqm-svg .aqm-node-center .aqm-node-text { fill: #6B263D; font-size: 30px; font-weight: 800; }
        </style>
        <defs>
          <marker id="aqm-arr-father" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 Z" fill="#8E6E85" />
          </marker>
          <marker id="aqm-arr-mother" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 Z" fill="#B5443E" />
          </marker>
        </defs>

        <!-- الخلفية العاجية والإطار الدائري المزدوج -->
        <rect x="-24" y="-24" width="848" height="848" rx="28" class="aqm-svg-bg" fill="#FAF7F0" />
        <circle cx="400" cy="400" r="372" class="aqm-svg-dial-ring is-outer" fill="none" stroke="#C5A46D" />
        <circle cx="400" cy="400" r="356" class="aqm-svg-dial-ring" fill="none" stroke="#C5A46D" />
        <text x="778" y="786" class="aqm-svg-watermark" fill="#B89758" fill-opacity="0.17" text-anchor="end" font-size="22" font-weight="700" direction="ltr">عقيق أسترو · Aqeq Astro</text>
        ${ticks}
        ${ageLabels}
        <circle cx="400" cy="400" r="270" class="aqm-svg-guide" fill="none" stroke="#C5A46D" stroke-opacity="0.25" />

        <!-- المربع الشخصي والأسلاف والمحاور -->
        <polygon points="${pos.west[0]},${pos.west[1]} ${pos.north[0]},${pos.north[1]} ${pos.east[0]},${pos.east[1]} ${pos.south[0]},${pos.south[1]}" class="aqm-svg-personal-square" fill="none" stroke="#B79B66" />
        <polygon points="${pos.northWest[0]},${pos.northWest[1]} ${pos.northEast[0]},${pos.northEast[1]} ${pos.southEast[0]},${pos.southEast[1]} ${pos.southWest[0]},${pos.southWest[1]}" class="aqm-svg-ancestral-square" fill="none" stroke="#C5A46D" />
        <line x1="${pos.west[0]}" y1="${pos.west[1]}" x2="${pos.east[0]}" y2="${pos.east[1]}" class="aqm-svg-axis" />
        <line x1="${pos.north[0]}" y1="${pos.north[1]}" x2="${pos.south[0]}" y2="${pos.south[1]}" class="aqm-svg-axis" />
        <line x1="${fatherA[0]}" y1="${fatherA[1]}" x2="${fatherB[0]}" y2="${fatherB[1]}" class="aqm-svg-father" marker-end="url(#aqm-arr-father)" />
        <line x1="${motherA[0]}" y1="${motherA[1]}" x2="${motherB[0]}" y2="${motherB[1]}" class="aqm-svg-mother" marker-end="url(#aqm-arr-mother)" />
        <text x="303" y="261" transform="rotate(45 303 261)" text-anchor="middle" font-size="10" font-weight="700" fill="#8E6E85" stroke="#FFFFFF" stroke-width="3" paint-order="stroke" class="aqm-svg-gen-label">male generation line</text>
        <text x="539" y="261" transform="rotate(-45 539 261)" text-anchor="middle" font-size="10" font-weight="700" fill="#B5443E" stroke="#FFFFFF" stroke-width="3" paint-order="stroke" class="aqm-svg-gen-label">female generation line</text>

        <!-- مسارات الحب والمال -->
        <polyline points="${pos.C2[0]},${pos.C2[1]} ${pos.money[0]},${pos.money[1]} ${pos.balance[0]},${pos.balance[1]}" class="aqm-svg-money-channel" fill="none" />
        <polyline points="${pos.balance[0]},${pos.balance[1]} ${pos.heart[0]},${pos.heart[1]} ${pos.D2[0]},${pos.D2[1]}" class="aqm-svg-love-channel" fill="none" />
        <g class="aqm-svg-heart-icon" transform="translate(${pos.heart[0] - 46}, ${pos.heart[1] - 8}) scale(0.7)">
          <path d="M12 21 C12 21 3 14.5 3 8.5 C3 5.4 5.4 3 8.2 3 C9.8 3 11.2 3.9 12 5.2 C12.8 3.9 14.2 3 15.8 3 C18.6 3 21 5.4 21 8.5 C21 14.5 12 21 12 21 Z" fill="#B5443E" />
        </g>
        <text x="${pos.money[0] + 22}" y="${pos.money[1] + 22}" class="aqm-svg-money-sign">$</text>

        <!-- المركز الجوهري E بهالة شمسية -->

        <!-- العُقد التفاعلية (المعرّفات مطابقة لأقسام الأكورديون) -->
        ${nodeG('aqm-node-corner', 'personal', 'طاقة الشخصية والجوهر (اليوم)', A, pos.west, 26, null, '#8E6E85', 'personal_A')}
        ${nodeG('aqm-node-corner', 'talents', 'طاقة الروح والمواهب (الشهر)', B, pos.north, 26, null, '#8E6E85', 'talents_B')}
        ${nodeG('aqm-node-corner', 'money_line', 'طاقة المادة والصحة (السنة)', C, pos.east, 26, null, '#8B263E', 'year_C')}
        ${nodeG('aqm-node-corner', 'karmic_tail', 'الذيل الكارمي الأساسي (Past Karma)', D, pos.south, 26, null, '#8B263E', 'tail_entry')}
        ${nodeG('aqm-node-corner', 'karmic_tail', 'الذيل الكارمي (نقطة وسطى D3)', intermediate.D3, pos.D3, 19, null, '#FFFFFF', 'tail_D3')}
        ${nodeG('aqm-node-corner', 'karmic_tail', 'الذيل الكارمي (مدخل القلب D2)', intermediate.D2, pos.D2, 19, null, '#C06C54', 'tail_D2')}
        ${nodeG('aqm-node-ancestral', 'father_line', 'سلالة الأب العليا (مواهب الأب)', F, pos.northWest, 23, null, null, 'father_top')}
        ${nodeG('aqm-node-ancestral', 'mother_line', 'سلالة الأم العليا (مواهب الأم)', G, pos.northEast, 23, null, null, 'mother_top')}
        ${nodeG('aqm-node-ancestral', 'father_line', 'سلالة الأب السفلى (كارما المادة)', H, pos.southEast, 23, null, null, 'father_bottom')}
        ${nodeG('aqm-node-ancestral', 'mother_line', 'سلالة الأم السفلى (كارما المشاعر)', I, pos.southWest, 23, null, null, 'mother_bottom')}
        ${nodeG('aqm-node-love', 'love_line', 'مدخل الحب والعلاقات (Heart Point)', heartPoint, pos.heart, 18, null, null, 'love')}
        ${nodeG('aqm-node-money', 'money_line', 'مدخل المال والوفرة (Money Point)', moneyPoint, pos.money, 18, null, null, 'money')}
        ${[['F', 'father_line', -1, -1], ['G', 'mother_line', 1, -1], ['H', 'father_line', 1, 1], ['I', 'mother_line', -1, 1]].map(([k, sec, sx, sy]) => {
          const at = d => [r2(400 + sx * d / Math.SQRT2), r2(400 + sy * d / Math.SQRT2)];
          return nodeG('aqm-node-ancestral', sec, 'خط الأجداد المائل — النقطة الخارجية: reduce22(' + k + '+الداخلية)', dg[k].outer, at(212), 17, null, null, (sec === 'father_line' ? 'father' : 'mother') + '_diag_' + k + '_outer')
               + nodeG('aqm-node-ancestral', sec, 'خط الأجداد المائل — النقطة الداخلية: reduce22(' + k + '+مركز الأجداد)', dg[k].inner, at(122), 17, null, null, (sec === 'father_line' ? 'father' : 'mother') + '_diag_' + k + '_inner');
        }).join('')}
        ${nodeG('aqm-node-balance', 'love_line', 'نقطة التوازن بين الحب والمال (Balance)', balancePoint, pos.balance, 18, null, null, 'balance')}
        <!-- المحور الأفقي الأيسر من A إلى E: النقاط الثلاث (الخارجية والوسطى والداخلية الخضراء) -->
        ${nodeG('aqm-node-chakra', 'chakras', 'نقطة أفقية — reduce22(p1+A)', hP3, [202, 400], 17, '', T.petrol, 'axis_left_outer')}
        ${nodeG('aqm-node-chakra', 'chakras', 'نقطة أفقية — reduce22(A+E)', hP1, [265, 400], 17, '', T.sky, 'axis_left_mid')}
        ${nodeG('aqm-node-chakra', 'chakras', 'نقطة أفقية داخلية — reduce22(الوسطى+E)', hP2, [328, 400], 17, '', T.lgreen, 'axis_left_inner')}
        <!-- المحور الأيمن من E إلى C: C2 = reduce(C+E) ثم reduce(C+C2) (والنقطة الداخلية هي نقطة المال) -->
        ${nodeG('aqm-node-money', 'money_line', 'مال — C2 = reduce22(C+E)', mP1, [535, 400], 19, '', T.orange, 'axis_right_mid')}
        ${nodeG('aqm-node-money', 'money_line', 'مال — reduce22(C+C2)', mP2, [600, 400], 19, '', T.white, 'axis_right_outer')}
        <!-- مركز الأجداد والمركز المشترك على المحور الأيمن (مطابق للأصل: 7 ثم 15) -->
        ${P.pairAxis
          ? nodeG('aqm-node-money', 'money_line', 'الشراكة — النقطة الداخلية على المحور الأيمن', ax.right.inner, [466, 400], 19, '', T.lgreen, 'axis_right_inner')
            + nodeG('aqm-node-karmic', 'karmic_tail', 'الشراكة — القناة الكارمية الداخلية', ax.bottom.inner, [400, 468], 19, '', T.lgreen, 'axis_bottom_inner')
          : nodeG('aqm-node-ancestral', 'ancestral_programs', 'مركز الأجداد (مجموع الزوايا الأربع)', generational.ancestralCenter, [466, 400], 14, '', null, 'ancestral_center')
            + nodeG('aqm-node-ancestral', 'ancestral_programs', 'المركز المشترك (مركز الأجداد + المركز)', generational.commonCenter, [497, 400], 14, '', null, 'common_center')}
        <!-- المحور الرأسي الأعلى: B(9) ← 7 ← B2(16) -->
        ${nodeG('aqm-node-corner', 'talents', 'طاقة الروح — reduce22(B+B2)', tB, [400, 202], 17, '', T.petrol, 'axis_top_outer')}
        ${nodeG('aqm-node-corner', 'talents', 'طاقة الروح — B2 (B+E)', intermediate.B2, pos.B2, 17, '', T.sky, 'axis_top_mid')}
        ${nodeG('aqm-node-corner', 'talents', 'طاقة الروح الداخلية — reduce22(B2+E)', tTop3, [400, 328], 17, '', T.lgreen, 'axis_top_inner')}
        <g class="aqm-node aqm-node-center" data-section="center" data-position="core" data-title="مركز راحة الروح والجوهر الأساسي" data-arcana="${E}" transform="translate(${pos.center[0]}, ${pos.center[1]})">
          <circle cx="0" cy="0" r="44" class="aqm-node-bg" style="fill:#E6C280" />
          <circle cx="0" cy="0" r="38" class="aqm-node-ring" />
          <text x="0" y="0" class="aqm-node-text" font-size="42" font-weight="bold" fill="#1A1A1A" text-anchor="middle" dominant-baseline="central">${E}</text>
        </g>
      </svg>
      <div id="aqm-tooltip" role="tooltip"></div>
    `;
  }

  // ==================== 2. بنية الأكورديون الـ 15 وحقن النصوص ====================

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ===== الذيل الكارمي من karmic-tails.json (Schema v2) =====
     بيتحمّل لما أكورديون الذيل يتفتح بس. لو الملف مش متاح أو الشفرة مش مسجلة،
     النص الحالي (من destiny-matrix-data.js) بيفضل زي ما هو. */
  function karmicTailV2Html(res, gender) {
    const t = res.tail;
    const v = (gender && t.genderVariants && t.genderVariants[gender]) || {};
    const e = escapeHtml;
    const note = res.match === 'redirect'
      ? `<p class="aqm-slot-p aqm-kt-note">لا توجد قراءة مستقلة للثلاثية ${e(res.requested)}، فاعتُمدت أقرب قراءة معتمدة لها: ${e(t.code)}.</p>`
      : res.match === 'reverse'
      ? `<p class="aqm-slot-p aqm-kt-note">لا توجد قراءة مستقلة للترتيب ${e(res.requested)}، فاعتُمدت قراءة الترتيب المعكوس ${e(t.code)}.</p>`
      : '';
    return `
      <div class="aqm-kt-box" data-kt-source="v2" data-kt-code="${e(t.code)}">
        <p class="aqm-slot-p"><strong>${e(t.title.ar)}</strong> — ${e(t.title.subtitle)} <span class="aqm-kt-code">(شفرة ${e(t.code)})</span></p>
        ${note}
        <p class="aqm-slot-p"><strong>العمق النفسي:</strong> ${e(t.psychologicalDepth)}</p>
        <p class="aqm-slot-p"><strong>التناقض:</strong> ${e(v.paradox || t.paradox)}</p>
        <p class="aqm-slot-p"><strong>جذور الطفولة:</strong> ${e(v.childhoodRoots || t.childhoodRoots)}</p>
        <p class="aqm-slot-p"><strong>التنبيه الجسدي الرمزي:</strong> ${e(t.symbolicBodyNote)}</p>
      </div>`;
  }

  /* زر التفسير الكامل للذيل (نص Gemini الحرفي)؛ يبحث بالشفرة ثم بعكسها، وإلا يعرض «غير متوفر». */
  function addTailFullButton(item, code) {
    return; // لا أزرار تشريح فرعية: النص كامل داخل الأكورديون
    const slot = item.querySelector('[data-slot="detailed"]');
    if (!slot || slot.querySelector('.aqm-kt-full')) return;
    const box = document.createElement('div');
    box.className = 'aqm-kt-full aqm-master-actions';
    box.innerHTML = `<button type="button" class="aqm-master-open" data-aqm-tail="${escapeHtml(code)}">التفسير الكامل للذيل ${escapeHtml(code)}</button>`;
    slot.appendChild(box);
  }

  function hydrateKarmicTail(item, triad, gender) {
    if (!item || item.dataset.ktState === 'loading' || item.dataset.ktState === 'done') return Promise.resolve();
    const loader = window.AqeeqMatrix;
    if (!loader || typeof loader.karmicTail !== 'function') return Promise.resolve();
    if (!triad.every(n => Number.isInteger(Number(n)) && Number(n) >= 1 && Number(n) <= 22)) return Promise.resolve();
    item.dataset.ktState = 'loading';
    // ثلاثية بلا نص مستقل: نجرّب الذيل المعتمد المربوط بها (خريطة الربط) بمطابقة مجموعة الأرقام، وإلا يبقى النص القديم
    const redirect = (item.dataset.ktRedirect || '').split('-').map(Number);
    const viaRedirect = res => {
      if (res || redirect.length !== 3 || redirect.some(n => !(n >= 1 && n <= 22))) return res;
      const sorted = a => a.slice().sort((x, y) => x - y).join('-');
      return loader.karmicTails().then(d => {
        const hit = d.tails.find(tl => sorted(tl.code.split('-').map(Number)) === sorted(redirect));
        return hit ? { tail: hit, match: 'redirect', requested: triad.join('-') } : null;
      });
    };
    return loader.karmicTail(triad[0], triad[1], triad[2]).then(viaRedirect).then(res => {
      item.dataset.ktState = 'done';
      addTailFullButton(item, res && res.tail && res.match !== 'redirect' ? res.tail.code : triad.map(Number).join('-'));
      if (!res || !res.tail) return;
      const g = gender === 'male' || gender === 'female' ? gender : '';
      const detailed = item.querySelector('[data-slot="detailed"] .aqm-slot-p');
      const practical = item.querySelector('[data-slot="practical"] .aqm-slot-p');
      const title = item.querySelector('.aqm-acc-title');
      if (detailed) detailed.innerHTML = karmicTailV2Html(res, g);
      if (practical && Array.isArray(res.tail.protocol)) {
        practical.innerHTML = `<ol class="aqm-kt-protocol">${res.tail.protocol.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ol>`;
      }
      if (title) title.textContent = `الذيل الكارمي — ${res.tail.title.ar}`;
      item.dataset.ktCode = res.tail.code;
      // مزامنة الكبسولات والنص التمهيدي مع شفرة الذيل المحمّل فعلاً (كانت تعرض أرقام ذيل مربوط قديم)
      if (res.match !== 'redirect') {
        const eng = window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter;
        const digits = res.tail.digits || res.tail.code.split('-').map(Number);
        const badgeBox = item.querySelector('.aqm-acc-badges');
        if (badgeBox && eng && typeof eng.getArcanaInfo === 'function') {
          badgeBox.querySelectorAll('.aqm-badge-arcana').forEach(el => el.remove());
          digits.forEach((n, i) => {
            const span = document.createElement('span');
            span.className = `aqm-badge-arcana aqm-tone-${i % 4}`;
            span.textContent = `${n} · ${eng.getArcanaInfo(n).name}`;
            badgeBox.appendChild(span);
          });
        }
        const primary = item.querySelector('[data-slot="primary"] .aqm-slot-p');
        if (primary) primary.innerHTML = `يتشكل ثالوث ذيلك الكارمي من الطاقات <strong>(${digits.join(' - ')})</strong>.`;
      }
    }).catch(() => { delete item.dataset.ktState; });
  }

  /* ===== أقسام المصفوفة من sections/*.json (Schema v2) =====
     كل قسم بيتحمّل لما أكورديونه يتفتح. لو الملف مش متاح أو الأركانا مالهاش نص (missingIds)،
     النص القديم بيفضل زي ما هو. genderDynamic بيظهر بس لما المستخدم يختار ذكر/أنثى
     والمدخل فيه الحقل ده. المصدر: ['t' نص | 'l' قائمة | 'j' قائمة بفواصل, التسمية, المفتاح]. */
  const SECTION_SPECS = {
    center: { file: 'center', ids: P => [P.anchors.E],
      detailed: [['t', 'الهوية', 'identity'], ['t', 'السلوك التلقائي', 'behavior']],
      challenges: ['shadow'], practical: ['balanceKey'] },
    talents: { file: 'talents', ids: P => [P.anchors.B],
      detailed: [['t', 'قناة الاتصال', 'channel']],
      strengths: ['gift'], challenges: ['trap'], practical: ['practice'] },
    love_line: { file: 'love_line', ids: P => [P.channels.heartPoint],
      detailed: [['t', 'الانجذاب', 'attraction']],
      challenges: ['shadowPatterns'], practical: ['harmonyKey'] },
    money_line: { file: 'money_line', ids: P => [P.channels.moneyPoint],
      detailed: [['t', 'بوابة التدفق', 'inflow'], ['j', 'المجالات الأنسب', 'sectors']],
      challenges: ['blocks'], practical: ['goldenRule'] },
    father_line: { file: 'father_line', ids: P => [P.corners.F, P.corners.H],
      detailed: [['t', 'المحور', 'theme'], ['l', 'أسئلة للتأمل', 'questions']],
      strengths: ['potential'], challenges: ['challenge'], practical: ['practice'] },
    mother_line: { file: 'mother_line', ids: P => [P.corners.G, P.corners.I],
      detailed: [['t', 'المحور', 'theme'], ['l', 'أسئلة للتأمل', 'questions']],
      strengths: ['potential'], challenges: ['challenge'], practical: ['practice'] },
    ancestral_programs: { file: 'ancestral_programs', ids: P => [P.ancestralPrograms.ancestralCenter],
      detailed: [['t', 'الجذر والموروث', 'roots'], ['l', 'أنماط السقوط التلقائي', 'fallPatterns']],
      practical: ['path'] },
    purposes: { file: 'purposes', ids: P => [P.purposes.social],
      detailed: [['t', 'الرسالة', 'mission']], practical: ['maturityTest'] },
    children_line: { file: 'children_line', ids: P => [P.childrenLine.childEnergy],
      detailed: [['t', 'الأسرة والتربية', 'family']] },
    transformation_rx: { file: 'transformation_rx', ids: P => [P.transformationKeys.balancePoint],
      detailed: [['l', 'خطوات التحول', 'protocol'], ['l', 'أسئلة للتأمل', 'reflectiveQuestions']],
      practical: ['__summary'] }
  };

  function sectionVal(kind, label, val) {
    if (val == null || val === '' || (Array.isArray(val) && !val.length)) return '';
    const lab = label ? `<strong>${escapeHtml(label)}:</strong> ` : '';
    if (Array.isArray(val) && kind === 'j') return `<p class="aqm-slot-p">${lab}${escapeHtml(val.join('، '))}</p>`;
    if (Array.isArray(val)) {
      return `<div class="aqm-slot-sub">${lab ? `<p class="aqm-slot-p">${lab}</p>` : ''}<ul class="aqm-slot-list">${val.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul></div>`;
    }
    return `<p class="aqm-slot-p">${lab}${escapeHtml(val)}</p>`;
  }

  function sectionEntryVal(entry, key) {
    return key === '__summary' ? entry.summary : (entry.deep ? entry.deep[key] : undefined);
  }

  function buildSectionFill(spec, entries, gender) {
    const multi = entries.length > 1;
    const head = e => (multi ? `<p class="aqm-slot-p aqm-entry-head"><strong>الأركانا ${e.id} · ${escapeHtml(e.arcana && e.arcana.ar)}</strong></p>` : '');
    const slot = def => {
      if (!def) return null;
      const parts = entries.map(en => {
        const v = sectionEntryVal(en, def[0]);
        if (typeof v === 'string' && en.summary && v.trim() === String(en.summary).trim()) return ''; // لا نكرر نص الملخص الظاهر في النص الأساسي
        const html = sectionVal(Array.isArray(v) ? 'l' : 't', '', v);
        return html ? head(en) + html : '';
      }).filter(Boolean);
      return parts.length ? parts.join('') : null;
    };
    const g = gender === 'male' || gender === 'female' ? gender : '';
    const detailed = entries.map(en => {
      const rows = spec.detailed.map(([kind, label, key]) => sectionVal(kind, label, sectionEntryVal(en, key))).join('');
      const gd = g && en.genderDynamic && en.genderDynamic[g]
        ? `<p class="aqm-slot-p aqm-gender-dynamic"><strong>بصيغتك:</strong> ${escapeHtml(en.genderDynamic[g])}</p>` : '';
      const draft = en.meta && en.meta.status === 'draft' ? '<p class="aqm-slot-p aqm-draft-note">نص تأملي قيد المراجعة.</p>' : '';
      return `<div class="aqm-sec-entry">${head(en)}${en.summary ? `<p class="aqm-slot-p aqm-sec-lead">${escapeHtml(en.summary)}</p>` : ''}${rows}${gd}${draft}</div>`;
    }).join('');
    return { detailed, strengths: slot(spec.strengths), challenges: slot(spec.challenges), practical: slot(spec.practical) };
  }

  function setSlots(item, fill) {
    ['detailed', 'strengths', 'challenges', 'practical'].forEach(name => {
      if (!fill[name]) return;
      const el = item.querySelector(`[data-slot="${name}"] .aqm-slot-p`);
      if (el) el.innerHTML = fill[name];
    });
  }

  function hydrateSection(item, spec, P, gender) {
    if (!item || item.dataset.secState === 'loading' || item.dataset.secState === 'done') return Promise.resolve();
    const loader = window.AqeeqMatrix;
    if (!loader || typeof loader.section !== 'function') return Promise.resolve();
    item.dataset.secState = 'loading';
    return loader.section(spec.file).then(data => {
      item.dataset.secState = 'done';
      const ids = [...new Set(spec.ids(P).map(Number).filter(n => Number.isInteger(n) && n >= 1 && n <= 22))];
      const entries = ids.map(id => data.entries.find(e => e.id === id)).filter(Boolean);
      if (!entries.length) {
        const el = item.querySelector('[data-slot="detailed"] .aqm-slot-p');
        if (el) el.insertAdjacentHTML('beforeend', '<p class="aqm-slot-p aqm-pending-note">نص هذا الموضع قيد الإعداد.</p>');
        return;
      }
      setSlots(item, buildSectionFill(spec, entries, gender));
      item.dataset.secSource = 'json';
    }).catch(err => {
      delete item.dataset.secState;
      if (typeof console !== 'undefined') console.warn('matrix section load failed:', spec.file, err && err.message);
    });
  }

  /* البرامج المركبة: بحث بالكود، التطابق التام أولاً ثم المعكوس، ومفيش حاجة لو الثلاثية مش مسجلة. */
  function hydrateComposite(item, P) {
    if (!item || item.dataset.secState === 'loading' || item.dataset.secState === 'done') return Promise.resolve();
    const loader = window.AqeeqMatrix;
    if (!loader || typeof loader.section !== 'function') return Promise.resolve();
    item.dataset.secState = 'loading';
    return loader.section('composite_programs').then(data => {
      item.dataset.secState = 'done';
      const triads = [P.compositePrograms.spiritualTriad, P.compositePrograms.materialTriad].filter(t => Array.isArray(t) && t.length === 3);
      const found = [];
      triads.forEach(t => {
        const code = t.map(Number).join('-');
        const rev = t.map(Number).reverse().join('-');
        const hit = data.entries.find(e => e.code === code) || data.entries.find(e => e.code === rev);
        if (hit && !found.includes(hit)) found.push(hit);
      });
      if (!found.length) return;
      const html = found.map(e => `<div class="aqm-sec-entry"><p class="aqm-slot-p aqm-entry-head"><strong>${escapeHtml(e.title)} (شفرة ${escapeHtml(e.code)})</strong></p><p class="aqm-slot-p">${escapeHtml(e.summary)}</p>${sectionVal('t', 'مفتاح التوازن', e.deep && e.deep.remedy)}</div>`).join('');
      setSlots(item, { detailed: html });
      item.dataset.secSource = 'json';
    }).catch(err => {
      delete item.dataset.secState;
      if (typeof console !== 'undefined') console.warn('matrix composite load failed:', err && err.message);
    });
  }

  /* ===== التفسير الموسع: بيتبني من sections/*.json المراجَعة (مش من Master V1 الخام) =====
     كل قسم بيعرض كل حقول deep + genderDynamic (لو المستخدم اختار ذكر/أنثى). */
  /* بطاقة مختصرة للطاقة المحددة فقط: الجوهر + نقاط القوة + الظل (بدون خطوط الأب والأسلاف والروشتة). */
  function expandedArcanaHtml(id, gender) {
    const loader = window.AqeeqMatrix;
    const get = name => loader.sectionEntry(name, id).catch(() => null);
    return Promise.all([get('center'), get('talents')]).then(([c, t]) => {
      if (!c && !t) return '<p class="aqm-slot-p aqm-pending-note">لا يوجد نص لهذه الأركانا بعد.</p>';
      const a = (c || t).arcana || {};
      const cd = (c && c.deep) || {}, td = (t && t.deep) || {};
      const core = (c && c.summary ? `<p class="aqm-slot-p aqm-sec-lead">${escapeHtml(c.summary)}</p>` : '') + sectionVal('t', '', cd.identity);
      const strengths = sectionVal('t', '', cd.behavior) + sectionVal('t', 'الموهبة', td.gift);
      const shadow = sectionVal('l', '', cd.shadow);
      const block = (title, html) => html ? `<section class="aqm-xr-sec"><h5>${title}</h5>${html}</section>` : '';
      return `<article class="aqm-xr aqm-xr-compact" dir="rtl"><header class="aqm-xr-head"><h4>الأركانا ${id} · ${escapeHtml(a.ar || '')}${a.en ? ` <small>${escapeHtml(a.en)}</small>` : ''}</h4></header>${block('الجوهر', core)}${block('نقاط القوة', strengths)}${block('الظل', shadow)}</article>`;
    });
  }


  /* ===== تفسيرات Gemini الكاملة (حرفية) مربوطة بالموضع + الرقم =====
     المفتاح المستقل = (position, arcana). لا يُلخَّص ولا يُدمج ولا يُعوَّض النقص بنص مولَّد:
     الموضع بلا مصدر يعرض بطاقة «غير متوفر في المصدر». المصدر: assets/data/matrix/gemini/*.json
     (تُبنى من content-sources/gemini بأداة tools/build-gemini-content.py مع مطابقة كلمة بكلمة). */
  const GEMINI_POSITIONS = ['core', 'money', 'love', 'tail_entry', 'mission'];
  const POSITION_LABEL = {
    core: 'الجوهر ومركز الراحة', money: 'خط المال والوفرة', love: 'خط الحب والعلاقات',
    tail_entry: 'مدخل الذيل الكارمي (قاع المصفوفة)', mission: 'خط الرسالة والقدر المجتمعي',
    personal_A: 'طاقة اليوم (A)', talents_B: 'المواهب والروح (B)', year_C: 'المادة والصحة (C)',
    tail_D2: 'الذيل الكارمي — نقطة D2', tail_D3: 'الذيل الكارمي — نقطة D3',
    father_top: 'خط الأب العلوي (F)', father_bottom: 'خط الأب السفلي (H)',
    mother_top: 'خط الأم العلوي (G)', mother_bottom: 'خط الأم السفلي (I)',
    balance: 'نقطة التوازن بين الحب والمال',
    axis_left_outer: 'نقطة على محور اليوم (A)', axis_left_mid: 'نقطة على محور اليوم (A)', axis_left_inner: 'نقطة على محور اليوم (A)',
    axis_right_outer: 'نقطة على محور السنة (C)', axis_right_mid: 'نقطة على محور السنة (C)',
    axis_top_outer: 'نقطة على محور الشهر (B)', axis_top_mid: 'نقطة على محور الشهر (B)', axis_top_inner: 'نقطة على محور الشهر (B)'
  };
  const SECTION_POSITION = { center: 'core', money_line: 'money', love_line: 'love', purposes: 'mission' };
  function positionLabel(key) {
    if (POSITION_LABEL[key]) return POSITION_LABEL[key];
    const m = /^(father|mother)_diag_([FGHI])_(outer|inner)$/.exec(key || '');
    if (m) return `نقطة على خط ${m[1] === 'father' ? 'الأب' : 'الأم'} المائل (${m[2]})`;
    return key || 'موضع';
  }
  function gInline(t) { return escapeHtml(t).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'); }
  /* تحويل كتل المصدر إلى HTML بنفس الترتيب والعناوين؛ hl = مفتاح موضع يُميَّز داخل المرجع. */
  /* حذف قسم «أداة عقيق أسترو للتقييم والتأمل الذاتي» (العنوان + السؤال + جدول الخيارات) من المراجع */
  function stripAssessment(blocks) {
    const out = []; let skip = false;
    (blocks || []).forEach(b => {
      if (/تقييم والتأمل الذاتي/.test(b.t) && b.k !== 'tr') { skip = true; return; }
      if (skip && (b.k === 'q' || b.k === 'tr')) return;
      skip = false; out.push(b);
    });
    return out;
  }
  function geminiBlocksHtml(blocks, hl) {
    blocks = stripAssessment(blocks);
    let out = '', mode = '', liOpen = false, poleCls = '';
    const close = () => {
      if (mode === 'ul') { out += (liOpen ? '</li>' : '') + '</ul>'; liOpen = false; }
      else if (mode === 'q') out += '</blockquote>';
      else if (mode === 'tr') out += '</tbody></table></div>';
      mode = '';
    };
    const cls = (b, base) => ` class="${base}${hl && b.pos === hl ? ' is-hl' : ''}"`;
    blocks.forEach(b => {
      if (b.k === 'li') {
        if (mode !== 'ul') { close(); out += '<ul class="aqm-g-ul">'; mode = 'ul'; liOpen = false; }
        if (liOpen) out += '</li>';
        // تمييز قطب الظل (Minus) وقطب النور (Plus) بالكلمات الدالة في العنوان؛ ويرث الأبناء قطب أبيهم
        if (b.d === 0) poleCls = /الظل|فخ |البلوك|العائق|الوجه المظلم|الوجه الهابط|المسار السلبي/.test(b.t) ? ' is-shadow' : /النور|القوة|الموهبة|الذهبية|المسار الواعي|التناغم|مفتاح|التوازن|التحرر|المسار العلاجي|البوابة|القطاعات|الدور الاجتماعي|الهوية|البصمة|المغناطيس/.test(b.t) ? ' is-light' : '';
        out += `<li${cls(b, 'aqm-g-li d' + b.d + poleCls)}>${gInline(b.t)}`; liOpen = true;
      } else if (b.k === 'c' && mode === 'ul' && liOpen) {
        out += `<p class="aqm-g-c">${gInline(b.t)}</p>`;
      } else if (b.k === 'q') {
        if (mode !== 'q') { close(); out += '<blockquote class="aqm-g-q">'; mode = 'q'; }
        out += `<p>${gInline(b.t)}</p>`;
      } else if (b.k === 'tr') {
        const cells = b.t.split(' | ');
        if (mode !== 'tr') { close(); out += '<div class="aqm-g-tw"><table class="aqm-g-table"><tbody>'; mode = 'tr'; }
        out += '<tr>' + cells.map(c => `<td>${gInline(c)}</td>`).join('') + '</tr>';
      } else {
        close();
        if (b.k === 'h1') out += `<h5${cls(b, 'aqm-g-h1')}>${gInline(b.t)}</h5>`;
        else if (b.k === 'h2') out += `<h6${cls(b, 'aqm-g-h2')}>${gInline(b.t)}</h6>`;
        else out += `<p${cls(b, 'aqm-g-p')}>${gInline(b.t)}</p>`;
      }
    });
    close();
    return out;
  }
  /* لا تُعرض أي رسالة «غير متوفر» للمستخدم: الموضع بلا نص يُترك صامتًا (والمحتوى مكتمل للـ22 أركانا). */
  function geminiMissing() { return ''; }
  function arcanaName(n) {
    const eng = window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter;
    try { return eng.getArcanaInfo(n).name; } catch (e) { return ''; }
  }
  function geminiPositionHtml(posKey, n, section, refOnly) {
    const loader = window.AqeeqMatrix;
    const label = positionLabel(posKey);
    const head = `<header class="aqm-xr-head"><h4>${escapeHtml(label)} · الأركانا ${n}${arcanaName(n) ? ' · ' + escapeHtml(arcanaName(n)) : ''}</h4></header>`;
    const goto = section ? `<p class="aqm-g-goto"><button type="button" class="aqm-g-goto-btn" data-g-goto="${escapeHtml(section)}">فتح بطاقة القسم في الصفحة</button></p>` : '';
    return loader.gemini(n).then(d => {
      const unit = d && d.positions && d.positions[posKey];
      const ref = d && d.reference;
      let posPanel;
      if (GEMINI_POSITIONS.indexOf(posKey) !== -1) {
        posPanel = unit ? geminiBlocksHtml((d.header || []).concat(unit.blocks)) : geminiMissing(label, n, d ? undefined : `لا يوجد ملف مواضع Gemini للرقم ${n}.`);
      } else {
        posPanel = geminiMissing(label, n, `موضع «${label}» لا يملك تفسيرًا مخصصًا في مصدر Gemini (المصدر يغطي: الجوهر، المال، الحب، مدخل الذيل، الرسالة).`);
      }
      const refPanel = ref ? geminiBlocksHtml(ref.blocks, GEMINI_POSITIONS.indexOf(posKey) !== -1 ? posKey : null) : geminiMissing('المرجع التشريحي', n, `لا يوجد ملف «المرجع التشريحي الكامل» للرقم ${n} في مصدر Gemini.`);
      if (refOnly) {
        return `<article class="aqm-xr aqm-g" dir="rtl" data-g-position="${escapeHtml(posKey)}" data-g-arcana="${n}" data-g-refonly="true"><header class="aqm-xr-head"><h4>المرجع التشريحي الكامل · الأركانا ${n}${arcanaName(n) ? ' · ' + escapeHtml(arcanaName(n)) : ''}</h4></header><div class="aqm-g-panel" data-g-panel="ref">${refPanel}</div></article>`;
      }
      return `<article class="aqm-xr aqm-g" dir="rtl" data-g-position="${escapeHtml(posKey)}" data-g-arcana="${n}">${head}
        <div class="aqm-g-tabs" role="tablist"><button type="button" role="tab" class="is-on" aria-selected="true" data-g-tab="pos">تفسير هذا الموضع</button><button type="button" role="tab" aria-selected="false" data-g-tab="ref">المرجع التشريحي الكامل للطاقة ${n}</button></div>
        <div class="aqm-g-panel" role="tabpanel" data-g-panel="pos">${posPanel}</div>
        <div class="aqm-g-panel" role="tabpanel" data-g-panel="ref" hidden>${refPanel}</div>${goto}</article>`;
    });
  }
  function geminiTailHtml(code) {
    const loader = window.AqeeqMatrix;
    return loader.geminiTails().then(d => {
      const rev = code.split('-').reverse().join('-');
      const t = d.tails.find(x => x.code === code) || d.tails.find(x => x.code === rev);
      if (!t) return `<article class="aqm-xr aqm-g" dir="rtl" data-g-tail="${escapeHtml(code)}"><header class="aqm-xr-head"><h4>الذيل الكارمي ${escapeHtml(code)}</h4></header>${geminiMissing('الذيل الكارمي ' + code, '', `هذا الذيل (${code}) غير موجود في ملفات Gemini (المصدر يغطي 26 ذيلًا).`)}</article>`;
      return `<article class="aqm-xr aqm-g" dir="rtl" data-g-tail="${escapeHtml(t.code)}"><header class="aqm-xr-head"><h4>${gInline(t.title.replace(/^عقيق أسترو \|\s*/, ''))}</h4></header><div class="aqm-g-panel">${geminiBlocksHtml(t.blocks)}</div></article>`;
    });
  }

  /* التفسير الموسع يُعرض في نافذة واحدة مستقلة (Bottom Sheet على الهاتف / نافذة وسطية على الشاشة الكبيرة):
     لا حقن بطاقات داخل جسم الصفحة، ولا تراكم أو تكرار عند الضغط المتكرر. */
  let xrModal = null, xrLastTrigger = null, xrToken = 0;
  function ensureXrModal() {
    if (xrModal) return xrModal;
    const m = document.createElement('div');
    m.className = 'aqm-xr-modal';
    m.hidden = true;
    m.innerHTML = '<div class="aqm-xr-backdrop" data-xr-close="true"></div>'
      + '<div class="aqm-xr-sheet" role="dialog" aria-modal="true" aria-label="التفسير الموسع" tabindex="-1" dir="rtl">'
      + '<button type="button" class="aqm-xr-close" data-xr-close="true" aria-label="إغلاق">×</button>'
      + '<div class="aqm-xr-scroll" aria-live="polite"></div></div>';
    m.addEventListener('click', ev => {
      if (ev.target.closest('[data-xr-close]')) return closeXrModal();
      const tab = ev.target.closest('[data-g-tab]');
      if (tab) {
        const art = tab.closest('.aqm-g');
        art.querySelectorAll('[data-g-tab]').forEach(b => { const on = b === tab; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
        art.querySelectorAll('[data-g-panel]').forEach(p => { p.hidden = p.getAttribute('data-g-panel') !== tab.getAttribute('data-g-tab'); });
        const hl = art.querySelector('[data-g-panel="ref"] .is-hl');
        if (tab.getAttribute('data-g-tab') === 'ref' && hl) hl.scrollIntoView({ block: 'center' });
        return;
      }
      const go = ev.target.closest('[data-g-goto]');
      if (go) {
        const host = document.querySelector('.aqm-shell, .aqm-report') || document;
        const item = document.getElementById('aqm-sec-' + go.getAttribute('data-g-goto'));
        closeXrModal();
        if (item) { item.classList.add('open', 'is-active'); item.querySelector('.aqm-acc-header')?.setAttribute('aria-expanded', 'true'); item.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      }
    });
    document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && !m.hidden) closeXrModal(); });
    document.body.appendChild(m);
    xrModal = m;
    return m;
  }
  function closeXrModal() {
    if (!xrModal || xrModal.hidden) return;
    xrToken++;
    const xrBox = xrModal.querySelector('.aqm-xr-scroll'); if (xrBox) xrBox.scrollTop = 0;
    xrModal.hidden = true;
    document.documentElement.classList.remove('aqm-xr-open');
    // إعادة الخريطة لحالتها الطبيعية بعد إغلاق التفسير (إزالة التظليل والتعتيم)
    document.querySelectorAll('.aqm-svg .aqm-node.is-active').forEach(n => n.classList.remove('is-active'));
    document.querySelectorAll('.aqm-svg.has-focus').forEach(n => n.classList.remove('has-focus'));
    if (xrLastTrigger && document.contains(xrLastTrigger)) { try { xrLastTrigger.focus({ preventScroll: true }); } catch (e) {} }
    xrLastTrigger = null;
  }
  /* يفتح النافذة بمحتوى Promise<string> (HTML). trigger = العنصر الذي يعود إليه التركيز عند الإغلاق. */
  function openXrWith(trigger, makeHtml) {
    const loader = window.AqeeqMatrix;
    if (!loader) return;
    const m = ensureXrModal();
    const box = m.querySelector('.aqm-xr-scroll');
    const token = ++xrToken;
    xrLastTrigger = trigger;
    box.innerHTML = '<p class="aqm-slot-p aqm-xr-loading">جارٍ التحميل…</p>';
    box.scrollTop = 0;
    m.hidden = false;
    document.documentElement.classList.add('aqm-xr-open');
    box.scrollTop = 0;
    m.querySelector('.aqm-xr-sheet').focus({ preventScroll: true });
    makeHtml().then(html => {
      if (token === xrToken) { box.innerHTML = html; box.scrollTop = 0; }
    }).catch(() => {
      if (token === xrToken) box.innerHTML = '<p class="aqm-slot-p aqm-pending-note">تعذّر تحميل النص الآن. حاول مرة أخرى.</p>';
    });
  }
  function openXrModal(btn) {
    if (btn.dataset.aqmTail) return openXrWith(btn, () => geminiTailHtml(btn.dataset.aqmTail));
    const n = Number(btn.dataset.aqmMasterArcana);
    const sec = btn.dataset.aqmPosition || '';
    const posKey = SECTION_POSITION[sec] || btn.dataset.aqmPos || sec;
    openXrWith(btn, () => geminiPositionHtml(posKey, n, sec, btn.dataset.aqmRef === '1'));
  }
  function openPositionModal(node) {
    const posKey = node.getAttribute('data-position') || node.getAttribute('data-section');
    const n = Number(node.getAttribute('data-arcana'));
    openXrWith(node, () => geminiPositionHtml(posKey, n, node.getAttribute('data-section')));
  }

  function bindExpandedReadings(host) {
    if (!host || host.dataset.aqmXrBound === 'true') return;
    host.dataset.aqmXrBound = 'true';
    host.addEventListener('click', ev => {
      const btn = ev.target.closest && ev.target.closest('.aqm-master-open');
      if (!btn || !host.contains(btn)) return;
      openXrModal(btn);
    });
  }

  function buildMasterLibrary() { return ''; }
  function _unusedMasterLibrary(item) {
    const uniqueArcana = [...new Map((item.arcanaList || [])
      .filter(a => Number.isInteger(Number(a.num)) && Number(a.num) >= 1 && Number(a.num) <= 22)
      .map(a => [Number(a.num), a])).values()];
    if (!uniqueArcana.length) return '';
    const buttons = uniqueArcana.map(a => `
      <button type="button" class="aqm-master-open" data-aqm-master-arcana="${a.num}" data-aqm-position="${escapeHtml(item.id || '')}" aria-expanded="false">
        <span aria-hidden="true"><svg class="aq-ic" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg></span> التفسير الموسع: ${a.num} · ${escapeHtml(a.name)}
      </button>`).join('');
    return `
      <section class="aqm-master-library" aria-label="التفسير الموسع للأركانا">
        <p class="aqm-master-hint">التفسير الموسع — اضغط على طاقة لقراءتها في نافذة مستقلة:</p>
        <div class="aqm-master-actions">${buttons}</div>
      </section>`;
  }

  /**
   * إنشاء كارت قسم الأكورديون وفق بنية المحتوى المعتمدة
   */

  /* ===== أكورديون التفسيرات = نص Gemini الكامل فقط =====
     يستبدل المحتوى القديم المختصر بالكامل (لا نسختان من التفسير نفسه). الأقسام التي لا يغطيها المصدر
     تعرض «غير متوفر في المصدر». جداول الأرقام الحسابية (الشاكرات، دورات الأعمار) لا تُمَس. */
  const GEMINI_ACC = {
    center: { pos: 'core', n: P => P.anchors.E },
    love_line: { pos: 'love', n: P => P.channels.heartPoint },
    money_line: { pos: 'money', n: P => P.channels.moneyPoint },
    purposes: { pos: 'mission', n: P => P.purposes.social, stages: [
      { t: 'الرسالة الشخصية · من 20 إلى 40', n: P => P.purposes.personal },
      { t: 'الرسالة الاجتماعية · من 40 إلى 60', n: P => P.purposes.social },
      { t: 'الرسالة العامة · بعد الستين', n: P => P.purposes.spiritual }] },
    karmic_tail: { pos: 'tail_entry', n: P => P.anchors.D, tail: true }
  };
  /* مواضع Gemini تُعرض داخل الأكورديون نفسه: نص الموضع ثم القراءة الأعمق (المرجع) بدون أزرار أو نوافذ.
     وأي قسم آخر يُملأ من sections/*.json عند الفتح (SECTION_SPECS). */
  function accGrid(item) { return item.querySelector('.aqm-content-grid'); }
  /* ذيل بلا نص مطابق في الأرشيف: نص متّسق مركّب من بيانات الأركانا الثلاث نفسها (جذر الطفولة، السيناريو، مسار التحرير). */
  function composeTailFallback(triad) {
    const loader = window.AqeeqMatrix;
    const nums = triad.map(Number);
    return Promise.all(nums.map(n => loader.arcana(n).catch(() => null))).then(list => {
      const c = list.map(a => (a && a.core) || {});
      const nm = (i) => arcanaName(nums[i]);
      const para = t => t ? `<p class="aqm-g-p">${escapeHtml(t)}</p>` : '';
      return `<h5 class="aqm-g-h1">جذر الطفولة والبرمجة الأسرية</h5>${para(c[0].psychology)}${para(c[0].shadowTrap)}`
        + `<h5 class="aqm-g-h1">السيناريو الكارمي القديم ونمط التكرار</h5>${para(c[1].shadowTrap)}${para(c[2].shadowTrap)}`
        + `<h5 class="aqm-g-h1">مسار التحرير وفك العقدة</h5>${para(c[1].growth)}${para(c[2].growth)}`
        + `<p class="aqm-g-p"><em>${escapeHtml(nm(0))} · ${escapeHtml(nm(1))} · ${escapeHtml(nm(2))}</em></p>`;
    });
  }
  /* دمج نص الموضع مع قراءته الأعمق في تدفق واحد (عرض فقط، لا تعديل في الملفات ولا في الجمل):
     يُحذف من المرجع ما يكرر ما في نص الموضع: قطبا النور والظل، ومجموعة بروتوكول التحول حين يوجد حل عملي في نص الموضع.
     ما عدا ذلك يُعرض كما هو بعد نص الموضع بلا عنوان «قراءة أعمق». */
  function mergeGeminiFlow(unitBlocks, refBlocks) {
    const unit = unitBlocks || [];
    const ref = refBlocks || [];
    const unitHasPoles = unit.some(b => b.k === 'li' && b.d === 0 && /^قطب (النور|الظل)/.test(b.t));
    const unitHasResolution = unit.some(b => b.k === 'h2' && /اتزان|الميزان|النضج|الحل|التحرر/.test(b.t));
    const out = [];
    let skipGroup = false;
    for (let i = 0; i < ref.length; i++) {
      const b = ref[i];
      if (b.k === 'h1') skipGroup = unitHasResolution && /بروتوكول|التحول الخيميائي/.test(b.t);
      if (skipGroup) continue;
      if (unitHasPoles && b.k === 'li' && b.d === 0 && /^قطب (النور|الظل)/.test(b.t)) {
        while (i + 1 < ref.length && ref[i + 1].k === 'c') i++;
        continue;
      }
      if (unitHasPoles && b.k === 'p' && /:\s*$/.test(b.t) && ref[i + 1] && ref[i + 1].k === 'li' && /^قطب (النور|الظل)/.test(ref[i + 1].t)) continue;
      out.push(b);
    }
    return unit.concat(out);
  }
  /* سؤال التأمل (reflection_question): يظهر في آخر القسم فقط حين يكون مكتوبًا */
  const reflHtml = q => (typeof q === 'string' && q.trim()) ? `<p class="aqm-g-p aqm-reflection"><em>${escapeHtml(q.trim())}</em></p>` : '';
  function applyGeminiAccordions(host, P, tailTriad) {
    const loader = window.AqeeqMatrix;
    host.querySelectorAll('.aqm-acc-item').forEach(item => {
      const sid = item.dataset.sectionId;
      const grid = accGrid(item);
      const lib = item.querySelector('.aqm-master-library');
      if (lib) lib.remove();
      const cfg = GEMINI_ACC[sid];
      if (!cfg || !grid) return;
      item.dataset.secState = 'done'; item.dataset.ktState = 'done'; item.dataset.secSource = 'gemini';
      const n = Number(cfg.n(P));
      const label = positionLabel(cfg.pos);
      grid.innerHTML = '<section class="aqm-slot aqm-slot-gemini" data-slot="gemini"><p class="aqm-slot-p aqm-xr-loading">جارٍ التحميل…</p></section>';
      const parts = [loader.gemini(n)];
      if (cfg.tail) parts.push(loader.geminiTails());
      Promise.all(parts).then(async ([d, td]) => {
        const unit = d && d.positions && d.positions[cfg.pos];
        let html = '';
        if (cfg.stages) {
          const ds = await Promise.all(cfg.stages.map(st => loader.gemini(Number(st.n(P))).catch(() => null)));
          cfg.stages.forEach((st, i) => {
            const sn = Number(st.n(P)), dd = ds[i], u = dd && dd.positions && dd.positions[cfg.pos];
            const rb = dd && dd.reference && Array.isArray(dd.reference.blocks) ? dd.reference.blocks.filter(b => (b.pos || 'core') === cfg.pos) : [];
            html += `<h4 class="aqm-slot-title">${escapeHtml(st.t)} · الأركانا ${sn}${arcanaName(sn) ? ' · ' + escapeHtml(arcanaName(sn)) : ''}</h4>`;
            if (u) html += geminiBlocksHtml(mergeGeminiFlow(u.blocks, rb), cfg.pos) + reflHtml(u.reflection_question);
          });
        } else {
        html = `<h4 class="aqm-slot-title">${escapeHtml(label)} · الأركانا ${n}${arcanaName(n) ? ' · ' + escapeHtml(arcanaName(n)) : ''}</h4>`;
        const refBlocks = d && d.reference && Array.isArray(d.reference.blocks) ? d.reference.blocks.filter(b => (b.pos || 'core') === cfg.pos) : [];
        if (unit) html += geminiBlocksHtml(mergeGeminiFlow(unit.blocks, refBlocks), cfg.pos) + reflHtml(unit.reflection_question);
        }
        if (cfg.tail) {
          const code = tailTriad.map(Number).join('-'), rev = tailTriad.map(Number).reverse().join('-');
          const t = td.tails.find(x => x.code === code) || td.tails.find(x => x.code === rev);
          html += `<h4 class="aqm-slot-title aqm-g-tail-title">${t ? gInline(t.title.replace(/^عقيق أسترو \|\s*/, '')) : 'الذيل الكارمي ' + escapeHtml(code)}</h4>`;
          html += t ? geminiBlocksHtml(t.blocks) : await composeTailFallback(tailTriad).catch(() => '');
        }
        grid.querySelector('[data-slot="gemini"]').innerHTML = html;
      }).catch(() => {
        grid.querySelector('[data-slot="gemini"]').innerHTML = '<p class="aqm-slot-p aqm-pending-note">تعذّر تحميل النص الآن. حاول مرة أخرى.</p>';
      });
    });
  }


  /* ===== مكونات عرض موحّدة (قطب النور + / قطب الظل −) بنفس تنسيق الأكورديون الهادئ ===== */
  const poleLi = (title, text, pole) => text ? `<li class="aqm-g-li d0${pole ? ' is-' + pole : ''}">${escapeHtml(title)}<p class="aqm-g-c">${escapeHtml(text)}</p></li>` : '';
  const poleUl = items => { const h = items.filter(Boolean).join(''); return h ? `<ul class="aqm-g-ul">${h}</ul>` : ''; };
  const aspectLabel = { physics: 'الجسد والفيزياء', energy: 'الطاقة', emotions: 'المشاعر' };
  function arcCore(a) { return (a && a.core) || {}; }

  /* ===== الشاكرات السبع: قراءة كل مستوى (الجسد/الطاقة/المشاعر) داخل الأكورديون =====
     الخمس العليا من نصوص الأركانا لكل شاكرا، والعجز والجذر من chakra-lower.json (الجذر النفسي وطريقة التعامل، بلا أعراض مرضية).
     أي نص ناقص يُعوَّض تلقائيًا بنص الأركانا الأساسي لنفس الرقم دون أي إشعار. */
  function hydrateChakraReadings(host, P) {
    const loader = window.AqeeqMatrix;
    const item = host.querySelector('#aqm-sec-chakras');
    const grid = item && accGrid(item);
    if (!grid || !loader || !loader.chakraLower) return;
    const keys = ['sahasrara', 'ajna', 'vishuddha', 'anahata', 'manipura', 'svadhisthana', 'muladhara'];
    const ids = [...new Set(keys.flatMap(k => ['physics', 'energy', 'emotions'].map(a => Number(P.chakras.rows[k][a]))))].filter(n => n >= 1 && n <= 22);
    Promise.all([loader.chakraLower(), ...ids.map(id => loader.arcana(id).catch(() => null))]).then(([low, ...arr]) => {
      const byId = {}; ids.forEach((id, i) => { byId[id] = arr[i]; });
      const html = keys.map(k => {
        const row = P.chakras.rows[k];
        const lowDef = low.chakras[k];
        const aspects = ['physics', 'energy', 'emotions'].map(a => {
          const n = Number(row[a]); const A = byId[n]; const c = arcCore(A);
          const head = `<div class="aqm-chakra-aspect-head"><span class="aqm-badge-arcana aqm-tone-${['physics', 'energy', 'emotions'].indexOf(a)}">${n} · ${escapeHtml(arcanaName(n))}</span><span class="aqm-chakra-aspect-name">${aspectLabel[a]}</span></div>`;
          let body = '';
          if (lowDef) {
            const x = low.arcana[String(n)] || {};
            const lead = `<p class="aqm-g-p aqm-chakra-lead">${escapeHtml(lowDef.lead[a])}</p>`;
            if (a === 'physics') body = lead + poleUl([poleLi('قطب النور', c.gift, 'light'), poleLi('قطب الظل', c.shadowTrap, 'shadow')]);
            else if (a === 'energy') body = lead + poleUl([poleLi('قطب النور', c.growth, 'light'), poleLi('قطب الظل', x.root, 'shadow')]);
            else body = lead + poleUl([poleLi('الدلالة', c.psychology, ''), poleLi('طريق التوازن', x.care, 'light')]);
          } else {
            const t = A && A.chakras && A.chakras[k] && A.chakras[k][a + 'Psychology'];
            body = t ? `<p class="aqm-g-p">${escapeHtml(t)}</p>` : poleUl([poleLi('الدلالة', c.psychology, ''), poleLi('قطب النور', c.gift, 'light'), poleLi('قطب الظل', c.shadowTrap, 'shadow')]);
          }
          return `<div class="aqm-chakra-aspect">${head}${body}</div>`;
        }).join('');
        const theme = lowDef ? `<p class="aqm-g-p aqm-chakra-theme">${escapeHtml(lowDef.theme)}</p>` : '';
        return `<article class="aqm-chakra-card"><h5 class="aqm-chakra-card-title"><span class="aqm-chakra-dot" style="background:${CHAKRA_COLORS[k] || '#C5A46D'}"></span>${escapeHtml(row.name)}</h5>${theme}${aspects}</article>`;
      }).join('');
      grid.insertAdjacentHTML('beforeend', `<section class="aqm-slot aqm-slot-gemini aqm-chakra-readings" data-slot="chakra-readings"><h4 class="aqm-slot-title">قراءة كل شاكرا</h4>${html}<p class="aqm-g-p aqm-chakra-note">قراءة رمزية للتأمل، وليست تشخيصاً ولا بديلاً عن الطبيب.</p></section>`);
    }).catch(() => {});
  }

  /* ===== أقسام sections/*.json بعرض موحّد داخل الأكورديون: الأب، الأم، المواهب، الأجداد، الأطفال، روشتة التحول =====
     لكل مدخل: ملخص + حقول (محايد / قطب النور + / قطب الظل − / قوائم). أي نقص يُعوَّض بنص الأركانا الأساسي بصمت. */
  const LINE_FIELDS = [['theme', 'المحور', ''], ['potential', 'قطب النور', 'light'], ['challenge', 'قطب الظل', 'shadow'], ['questions', 'أسئلة للتأمل', 'list'], ['practice', 'الممارسة', 'light']];
  function hydrateLineSections(host, P) {
    const loader = window.AqeeqMatrix;
    if (!loader) return;
    const gender = host.dataset.aqmGender || '';
    const g = gender === 'male' || gender === 'female' ? gender : '';
    const specs = {
      father_line: { file: 'father_line', fields: LINE_FIELDS, items: [[P.corners.F, 'مواهب الأب العليا (F) — ما ورثته من الأب روحيًا وفكريًا'], [P.corners.H, 'كارما الأب السفلية (H) — ما ورثته من الأب ماديًا وسلوكيًا'], [P.generational.father.combined, 'محصلة خط الأب']] },
      mother_line: { file: 'mother_line', fields: LINE_FIELDS, items: [[P.corners.G, 'مواهب الأم العليا (G) — ما ورثته من الأم روحيًا وفكريًا'], [P.corners.I, 'كارما الأم السفلية (I) — ما ورثته من الأم عاطفيًا وسلوكيًا'], [P.generational.mother.combined, 'محصلة خط الأم']] },
      talents: { file: 'talents', fields: [['channel', 'قناة الاتصال', ''], ['gift', 'قطب النور', 'light'], ['trap', 'قطب الظل', 'shadow'], ['practice', 'الممارسة', 'light']], items: [[P.anchors.B, 'موهبة من الله (السماء) — B', ''], [axisPoints(P, adapter.reduceArcana).top.mid, 'موهبة التحقق — B1', ''], [axisPoints(P, adapter.reduceArcana).top.outer, 'موهبة الامتداد — B2', ''], [P.corners.G, 'موهبة من الأم — G', 'fromMother'], [P.corners.F, 'موهبة من الأب — F', 'fromFather']] },
      ancestral_programs: { file: 'ancestral_programs', fields: [['roots', 'الجذر والموروث', ''], ['fallPatterns', 'أنماط السقوط التلقائي', 'shadowlist'], ['path', 'مسار التحرر', 'light']], items: [[P.ancestralPrograms.ancestralCenter, 'مركز الأجداد — الجذر الذي تتشكل منه برمجتك العائلية'], [P.ancestralPrograms.commonCenter, 'المركز المشترك — ما يجمع تراثك العائلي بجوهرك']] },
      age_cycles: { file: 'age_cycles', fields: [['stage', 'طابع المرحلة', ''], ['light', 'قطب النور', 'light'], ['shadow', 'قطب الظل', 'shadow'], ['practice', 'الممارسة', 'light']], items: [0, 10, 20, 30, 40, 50, 60, 70].map(a => [(P.ageMap && (P.ageMap[a] || P.ageMap[String(a)])) || P.anchors.A, 'محطة سن ' + a + ' — الفترة من ' + a + ' إلى ' + (a + 10) + ' سنة']) },
      children_line: { file: 'children_line', fields: [['family', 'الأسرة والتربية', '']], items: [[P.childrenLine.childEnergy, 'طاقة الطفل'], [P.childrenLine.generationKey, 'مفتاح التواصل بين الأجيال']] },
      transformation_rx: { file: 'transformation_rx', fields: [['protocol', 'خطوات التحول', 'lightlist'], ['reflectiveQuestions', 'أسئلة للتأمل', 'list']], items: [[P.transformationKeys.balancePoint, 'نقطة التوازن'], [P.transformationKeys.skyAxis, 'المفتاح الروحي'], [P.transformationKeys.earthAxis, 'المفتاح المادي']] }
    };
    const listLi = (label, arr, kind) => Array.isArray(arr) && arr.length
      ? `<li class="aqm-g-li d0${kind === 'shadowlist' ? ' is-shadow' : kind === 'lightlist' ? ' is-light' : ''}">${escapeHtml(label)}<ul class="aqm-g-ul aqm-g-sub">${arr.map(t => `<li class="aqm-g-li d1">${escapeHtml(t)}</li>`).join('')}</ul></li>` : '';
    Object.entries(specs).forEach(([sid, spec]) => {
      const item = host.querySelector('#aqm-sec-' + sid); const grid = item && accGrid(item);
      if (!grid) return;
      item.dataset.secState = 'done'; item.dataset.secSource = 'json';
      grid.innerHTML = '<section class="aqm-slot aqm-slot-gemini" data-slot="gemini"><p class="aqm-slot-p aqm-xr-loading">جارٍ التحميل…</p></section>';
      const ids = spec.items.map(i => Number(i[0]));
      Promise.all([loader.section(spec.file).catch(() => ({ entries: [] })), ...ids.map(id => loader.arcana(id).catch(() => null))]).then(([data, ...arr]) => {
        const html = spec.items.map(([n, label, sub], i) => {
          n = Number(n);
          const e0 = (data.entries || []).find(x => x.id === n); const e = sub ? (e0 && e0[sub]) : e0; const c = arcCore(arr[i]); const d = (e && e.deep) || {};
          const gd = g && e && e.genderDynamic && e.genderDynamic[g] ? poleLi('بصيغتك', e.genderDynamic[g], '') : '';
          const lead = (e && e.summary) || c.psychology || '';
          const rows = e
            ? spec.fields.map(([k, lab, kind]) => (kind === 'list' || kind === 'shadowlist' || kind === 'lightlist') ? listLi(lab, d[k], kind) : poleLi(lab, String(d[k] || '').trim() === String(lead).trim() ? '' : d[k], kind))
            : [poleLi('قطب النور', c.gift, 'light'), poleLi('قطب الظل', c.shadowTrap, 'shadow'), poleLi('الممارسة', c.growth, 'light')];
          return `<article class="aqm-line-entry"><h4 class="aqm-slot-title">${escapeHtml(label)}<span class="aqm-badge-arcana aqm-tone-${i % 4}">${n} · ${escapeHtml(arcanaName(n))}</span></h4>${lead ? `<p class="aqm-g-p aqm-sec-lead">${escapeHtml(lead)}</p>` : ''}${poleUl(rows.concat([gd]))}${reflHtml(d.reflection_question)}</article>`;
        }).join('');
        grid.querySelector('[data-slot="gemini"]').innerHTML = html;
      }).catch(() => { grid.querySelector('[data-slot="gemini"]').innerHTML = ''; });
    });
  }


  /* ===== الشخصية والصورة الخارجية (A) + البرامج المركبة: عرض موحّد داخل الأكورديون ===== */
  function hydratePersonalComposite(host, P) {
    const loader = window.AqeeqMatrix;
    if (!loader) return;
    const gender = host.dataset.aqmGender || '';
    const g = gender === 'male' || gender === 'female' ? gender : '';
    const mount = sid => {
      const item = host.querySelector('#aqm-sec-' + sid); const grid = item && accGrid(item);
      if (!grid) return null;
      item.dataset.secState = 'done'; item.dataset.secSource = 'json';
      grid.innerHTML = '<section class="aqm-slot aqm-slot-gemini" data-slot="gemini"><p class="aqm-slot-p aqm-xr-loading">جارٍ التحميل…</p></section>';
      return grid.querySelector('[data-slot="gemini"]');
    };
    const same = (a, b) => String(a || '').trim() === String(b || '').trim();
    const badge = (n, i) => `<span class="aqm-badge-arcana aqm-tone-${i % 4}">${n} · ${escapeHtml(arcanaName(n))}</span>`;

    /* الشخصية: مدخل المركز (center) للأركانا A + نص الأركانا الأساسي */
    const pMount = mount('personal');
    if (pMount) {
      const A = Number(P.anchors.A);
      Promise.all([loader.section('center').catch(() => ({ entries: [] })), loader.arcana(A).catch(() => null)]).then(([data, arc]) => {
        const e = (data.entries || []).find(x => x.id === A); const c = arcCore(arc); const d = (e && e.deep) || {};
        const lead = (e && e.summary) || c.psychology || '';
        const shadowArr = Array.isArray(d.shadow) ? d.shadow : (d.shadow ? [d.shadow] : []);
        const rows = e ? [
          poleLi('الصورة التي يراها الناس', d.identity, ''),
          poleLi('قطب النور', d.behavior, 'light'),
          shadowArr.length ? `<li class="aqm-g-li d0 is-shadow">قطب الظل<ul class="aqm-g-ul aqm-g-sub">${shadowArr.map(t => `<li class="aqm-g-li d1">${escapeHtml(t)}</li>`).join('')}</ul></li>` : '',
          poleLi('مسار التحرر', d.balanceKey, 'light'),
          g && e.genderDynamic && e.genderDynamic[g] ? poleLi('بصيغتك', e.genderDynamic[g], '') : ''
        ] : [poleLi('قطب النور', c.gift, 'light'), poleLi('قطب الظل', c.shadowTrap, 'shadow'), poleLi('مسار التحرر', c.growth, 'light')];
        pMount.innerHTML = `<article class="aqm-line-entry"><h4 class="aqm-slot-title">طاقة يوم الميلاد (A)${badge(A, 0)}</h4>${lead ? `<p class="aqm-g-p aqm-sec-lead">${escapeHtml(lead)}</p>` : ''}${poleUl(rows)}${reflHtml(d.reflection_question)}</article>`;
      }).catch(() => { pMount.innerHTML = ''; });
    }

    /* البرامج المركبة: مدخل جاهز بالكود (مباشر ثم معكوس)، وإلا تركيب من نصوص الأركانا الثلاث */
    const cMount = mount('composite_programs');
    if (cMount) {
      const triads = [['البرنامج الشخصي', P.compositePrograms.personalTriad, 'personal'], ['البرنامج الروحي', P.compositePrograms.spiritualTriad, 'spiritual'], ['البرنامج المادي', P.compositePrograms.materialTriad, 'material']]
        .filter(t => Array.isArray(t[1]) && t[1].length === 3).map(([l, t, k]) => [l, t.map(Number), k]);
      const ids = [...new Set(triads.flatMap(t => t[1]))].filter(n => n >= 1 && n <= 22);
      Promise.all([loader.section('composite_programs').catch(() => ({ entries: [] })), ...ids.map(id => loader.arcana(id).catch(() => null))]).then(([data, ...arr]) => {
        const byId = {}; ids.forEach((id, i) => { byId[id] = arr[i]; });
        const seen = {}; const uniq = [];
        triads.forEach(([l, t, k]) => { const key = [t.join('-'), [...t].reverse().join('-')].sort()[0]; if (seen[key]) { seen[key][0] += ' · ' + l; } else { seen[key] = [l, t, k]; uniq.push(seen[key]); } });
        const html = uniq.map(([label, t, kind]) => {
          const code = t.join('-'), rev = [...t].reverse().join('-');
          const hit = (data.entries || []).find(e => e.code === code) || (data.entries || []).find(e => e.code === rev);
          const badges = t.map(badge).join(' ');
          const roles = data.roles || {};
          let body;
          if (hit) {
            const d = hit.deep || {};
            body = `<p class="aqm-g-p aqm-sec-lead">${escapeHtml(hit.summary)}</p>` + poleUl([poleLi('نقاط القوة', d.pattern, 'light'), poleLi('التحديات المحتملة', d.daily, 'shadow'), poleLi('التوصيات', d.remedy, 'light')]);
          } else if (t.every(n => roles[n])) {
            const intro = data.intro && data.intro[kind];
            const nm = n => arcanaName(n);
            body = (intro ? `<p class="aqm-g-p aqm-sec-lead">${escapeHtml(intro)}</p>` : '') + poleUl([
              poleLi('الطبقة الظاهرة — ' + t[0] + ' · ' + nm(t[0]), roles[t[0]].outer, ''),
              poleLi('الطبقة الوسيطة — ' + t[1] + ' · ' + nm(t[1]), roles[t[1]].middle, 'shadow'),
              poleLi('القلب — ' + t[2] + ' · ' + nm(t[2]), roles[t[2]].core, 'light')
            ]);
          } else {
            const cs = t.map(n => arcCore(byId[n]));
            const lead = cs[0].psychology || '';
            body = (lead ? `<p class="aqm-g-p aqm-sec-lead">${escapeHtml(lead)}</p>` : '') + poleUl([
              poleLi('قطب النور', cs.map(c => c.gift).filter(Boolean)[0], 'light'),
              poleLi('قطب الظل', cs.map(c => c.shadowTrap).filter(Boolean)[0], 'shadow'),
              poleLi('مسار التحرر', cs.map(c => c.growth).filter(Boolean)[0], 'light')
            ]);
          }
          const title = hit ? `${escapeHtml(hit.title)}` : label;
          return `<article class="aqm-line-entry"><h4 class="aqm-slot-title">${escapeHtml(label)}${hit ? ' — ' + title : ''}<span class="aqm-code-badges">${badges}</span></h4>${body}</article>`;
        }).join('');
        cMount.innerHTML = html;
      }).catch(() => { cMount.innerHTML = ''; });
    }
  }

  /* واجهة الأكورديون: الاسم القياسي للقسم + سؤال افتتاحي + تسميات الأرقام (عرض فقط) */
  const SECTION_UI = {
    center: ['الجوهر والمركز', 'أين تجد سكونك وقوتك حين تعود إلى نفسك؟', ['المركز']],
    karmic_tail: ['الذيل الكارمي', 'ما الذي يتكرر في حياتك ولا تفهم سببه؟', ['الذيل ١', 'الذيل ٢', 'الذيل ٣']],
    purposes: ['المهمة والغاية', 'ما الذي جئت لتحققه في كل مرحلة من حياتك؟', ['غاية شخصية', 'غاية اجتماعية', 'غاية روحية', 'غاية كونية']],
    personal: ['الشخصية', 'كيف يراك الناس في أول لقاء؟', ['جوهر الشخصية']],
    talents: ['المواهب', 'ما الهبة التي وُلدت بها، وما الذي وصلك منها من الله ومن أمك ومن أبيك؟', ['موهبة من الله', 'موهبة من الأم', 'موهبة من الأب']],
    father_line: ['خط الأب', 'ما الذي ورثته من جهة الأب؟', ['مواهب الأب', 'كارما الأب', 'محصلة الأب']],
    mother_line: ['خط الأم', 'ما الذي ورثته من جهة الأم؟', ['مواهب الأم', 'كارما الأم', 'محصلة الأم']],
    ancestral_programs: ['الأجداد', 'ما الذي ورثته من أسرتك ولم تخترْه؟', ['مركز الأجداد', 'المركز المشترك']],
    love_line: ['العلاقات والحب', 'ماذا تبحث عنه حقًّا في الشريك؟', ['نقطة القلب', 'التوازن', 'مدخل القلب']],
    money_line: ['المال والعمل', 'أين يتعثر تدفق الوفرة في حياتك؟', ['نقطة المال', 'التوازن', 'مدخل المادة']],
    chakras: ['الشاكرات', 'أي مركز في جسدك يحمل ما لا تقوله؟', ['الجسد', 'الطاقة', 'المشاعر']],
    composite_programs: ['البرامج المركبة', 'أي نمط يجمع طاقتين في تصرفاتك؟', ['برنامج الروح', 'برنامج المادة']],
    children_line: ['الأبناء', 'ما الرسالة التي يحملها الأبناء إليك؟', ['طاقة الطفل', 'مفتاح التواصل']],
    age_cycles: ['دورات العمر', 'ما الذي تطلبه منك كل محطة من عمرك؟', ['سن 0', 'سن 10', 'سن 20', 'سن 30', 'سن 40', 'سن 50', 'سن 60', 'سن 70']],
    transformation_rx: ['روشتة التحول', 'كيف تنتقل من الظل إلى النور؟', ['التوازن', 'المفتاح الروحي', 'المفتاح المادي']]
  };

  function buildAccordionItem(item) {
    const { id, icon, arcanaList, contentKey, slots } = item;
    const ui = SECTION_UI[id];
    const title = ui ? ui[0] : item.title;
    const subtitle = ui ? ui[1] : item.subtitle;
    const badgesHtml = arcanaList.map((a, i) => `<span class="aqm-badge-arcana aqm-tone-${i % 4}"><b class="aqm-bn">${a.num}</b><span class="aqm-bl">${a.name}</span></span>`).join(' ');
    // Pending Content: any of the five slots empty means the section is not complete textually
    const isPending = !slots || Object.values(slots).some(v => !String(v || '').trim());
    const pendingHtml = '';

    return `
      <div class="aqm-acc-item${isPending ? ' is-pending' : ''}" id="aqm-sec-${id}" data-section-id="${id}" data-content-key="${contentKey}" data-pending="${isPending}"${item.ktRedirect ? ` data-kt-redirect="${item.ktRedirect}"` : ''}>
        <button class="aqm-acc-header" type="button" aria-expanded="false" aria-controls="aqm-body-${id}">
          <div class="aqm-acc-header-left">
            <span class="aqm-acc-icon" aria-hidden="true">${ICON_SVG[id] || ''}</span>
            <div class="aqm-acc-title-group">
              <h3 class="aqm-acc-title">${title}</h3>
              <p class="aqm-acc-subtitle">${subtitle}</p>
            </div>
          </div>
          <div class="aqm-acc-badges">
            ${pendingHtml}
            ${badgesHtml}
          </div>
          <span class="aqm-acc-chevron" aria-hidden="true">›</span>
        </button>

        <div class="aqm-acc-body" id="aqm-body-${id}">
          <div class="aqm-content-grid">
            <!-- النص الأساسي -->
            <section class="aqm-slot aqm-slot-primary" data-slot="primary">
              <h4 class="aqm-slot-title"><svg class="aq-ic" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg> النص الأساسي</h4>
              <div class="aqm-slot-p">${slots.primary}</div>
            </section>

            <!-- التفسير التفصيلي والعميق -->
            <section class="aqm-slot aqm-slot-detailed" data-slot="detailed">
              <h4 class="aqm-slot-title"><svg class="aq-ic" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z"/><path d="M12 6v13.5"/></svg> التفسير التفصيلي والعميق</h4>
              <div class="aqm-slot-p">${slots.detailed}</div>
            </section>

            <!-- نقاط القوة والتجلي الإيجابي -->
            <section class="aqm-slot aqm-slot-strengths" data-slot="strengths">
              <h4 class="aqm-slot-title"><svg class="aq-ic" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></svg> نقاط القوة والتجلي الإيجابي (النور)</h4>
              <div class="aqm-slot-p">${slots.strengths}</div>
            </section>

            <!-- التحديات والجانب الظلي -->
            <section class="aqm-slot aqm-slot-challenges" data-slot="challenges">
              <h4 class="aqm-slot-title"><svg class="aq-ic" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 4L21 19H3z"/><path d="M12 10v4M12 16.5v.5"/></svg> التحديات والجانب الظلي (الظل)</h4>
              <div class="aqm-slot-p">${slots.challenges}</div>
            </section>

            <!-- التطبيق العملي وخطوات التوازن -->
            <section class="aqm-slot aqm-slot-practical" data-slot="practical">
              <h4 class="aqm-slot-title"><svg class="aq-ic" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15z"/><path d="M5 19c3-5 6-8 10-10"/></svg> خطوات التوازن والتطبيق اليومي</h4>
              <div class="aqm-slot-p">${slots.practical}</div>
            </section>
          </div>
          ${buildMasterLibrary(item)}
        </div>
      </div>
    `;
  }

  /**
   * بناء الأقسام الـ 12 المعتمدة وفق مواصفات المستخدم
   */
  function build15Sections(P) {
    const getInfo = n => adapter.getArcanaInfo(n);
    const destinyData = (typeof AqeeqDestinyMatrixData !== 'undefined' ? AqeeqDestinyMatrixData : (typeof window !== 'undefined' && window.AqeeqDestinyMatrixData ? window.AqeeqDestinyMatrixData : null));
    const getProfile = n => (destinyData && destinyData.getArcana ? destinyData.getArcana(n) : null);

    const { anchors, corners, channels, generational, purposes, chakras, intermediate } = P;
    const { A, B, C, D, E } = anchors;
    const { F, G, H, I } = corners;
    const { heartPoint, moneyPoint, balancePoint } = channels;

    // Rich profile helpers
    const arcE = getProfile(E);
    const arcA = getProfile(A);
    const arcB = getProfile(B);
    const ktData = destinyData && destinyData.getKarmicTail ? destinyData.getKarmicTail(intermediate.D2, intermediate.D3, D) : null;
    // أرقام الذيل المعتمدة للعرض: عند ربط ثلاثية بذيل معتمد (mappedFrom) نعرض أرقام شفرته هو في كل مكان بالأكورديون
    const tailMapped = !!(ktData && ktData.mappedFrom && ktData.code);
    const tailNums = tailMapped ? ktData.code.split('-').map(Number) : [intermediate.D2, intermediate.D3, D];
    const ancLines = destinyData && destinyData.ancestralLines ? destinyData.ancestralLines : null;

    const sections = [
      // 1. الجوهر والمركز
      {
        id: 'center',
        icon: '👑',
        title: 'الجوهر والمركز — طاقة الروح ومنطقة الراحة',
        subtitle: 'الجوهر النفسي والمنطقة التي تشحن طاقتك عند العودة إليها',
        arcanaList: [{ num: E, name: getInfo(E).name }],
        contentKey: 'matrix.section.center',
        slots: {
          primary: `تحكم مركز مصفوفتك طاقة <strong>${getInfo(E).name} (${E})</strong>. هذه الطاقة تمثل جوهرك الحقيقي والمكان الآمن الذي تلجأ إليه روحك عندما تستنزفك الحياة.`,
          detailed: arcE ? `
            <div class="aqm-rich-card">
              <p class="aqm-slot-p"><strong>النموذج الأصلي:</strong> ${arcE.archetype || ''}</p>
              <p class="aqm-slot-p"><strong>مفارقة الطاقة:</strong> ${arcE.paradox || ''}</p>
              ${arcE.psychosomatics ? `<p class="aqm-slot-p"><strong>الدلالة السيكوسوماتية:</strong> ${arcE.psychosomatics}</p>` : ''}
              ${arcE.pastLifeRoot ? `<p class="aqm-slot-p"><strong>الجذر الكارمي:</strong> ${arcE.pastLifeRoot}</p>` : ''}
              ${arcE.mirror ? `<p class="aqm-slot-p aqm-mirror"><strong>المرآة:</strong> ${arcE.mirror}</p>` : ''}
            </div>
          ` : `طاقة المركز هي الحاكم الفعلي لاستقرارك الداخلي. عندما تعيش في تناغم مع ${getInfo(E).name}، تشعر بالسكينة والقدرة على توجيه كل الطاقات الأخرى بمصفوفتك.`,
          strengths: arcE && arcE.light ? arcE.light : getInfo(E).light,
          challenges: arcE && arcE.shadow ? arcE.shadow : getInfo(E).shadow,
          practical: arcE && arcE.somaticRelease ? arcE.somaticRelease : `احرص يومياً على ممارسة أنشطة تمنحك إحساساً بالحرية والاستقرار المرتبط بـ ${getInfo(E).name}.`
        }
      },

      // 2. الذيل الكارمي
      {
        id: 'karmic_tail',
        icon: '⚓',
        title: ktData && ktData.title ? `الذيل الكارمي — ${ktData.title}` : 'الذيل الكارمي — دروس التناسخ والتحديات المتوارثة',
        subtitle: 'الأنماط النفسية المتكررة والمواقف التي تختبر وعيك حتى تحررها (Karmic Tail)',
        arcanaList: tailNums.map(n => ({ num: n, name: getInfo(n).name })),
        contentKey: 'matrix.section.karmic_tail',
        ktRedirect: tailMapped ? ktData.code : '',
        slots: {
          primary: `يتشكل ثالوث ذيلك الكارمي من الطاقات <strong>(${tailNums.join(' - ')})</strong>${tailMapped ? '.' : ` بقيادة طاقة الأساس <strong>${getInfo(D).name}</strong>.`}`,
          detailed: ktData ? `
            <div class="aqm-kt-box">
              <p class="aqm-slot-p"><strong>شفرة الذيل:</strong> ${ktData.code || tailNums.join('-')}</p>
              <p class="aqm-slot-p"><strong>المفارقة النفسية:</strong> ${ktData.paradox || ''}</p>
              ${ktData.childhoodRoots ? `<p class="aqm-slot-p"><strong>جذور الطفولة والتكوين:</strong> ${ktData.childhoodRoots}</p>` : ''}
              ${ktData.tracks ? `<p class="aqm-slot-p"><strong>مسار التحرر:</strong> ${ktData.tracks.trackTwo || ''}</p>` : ''}
              ${ktData.psychosomatics ? `<p class="aqm-slot-p"><strong>التنبيه الجسدي:</strong> ${ktData.psychosomatics}</p>` : ''}
            </div>
          ` : `الذيل الكارمي هو أكبر محفز للتطور الروحي؛ تظهر دروسه في صورة أنماط متكررة تختبرك حتى تعيها وتفك ارتباطك بالجانب السلبي لطاقة ${getInfo(D).name}.`,
          strengths: `تحويل خبرات الماضي إلى حكمة عميقة، واكتساب مناعة نفسية عالية ترشدك وتلهم المحيطين بك.`,
          challenges: `الوقوع المتكرر في ردود الأفعال القديمة، الشعور بالإحباط عند مواجهة نفس العقبة، أو الاستسلام لنزعات التدمير الذاتي.`,
          practical: ktData && ktData.transformationProtocol && Array.isArray(ktData.transformationProtocol) ?
            ktData.transformationProtocol.join(' • ') : `راقب تصرفاتك في لحظات الضغط الشديد. عندما تشعر برغبة في تكرار النمط الكارمي لـ ${getInfo(D).name}، توقف وخذ خياراً واعياً مختلفاً.`
        }
      },

      // 3. المهمة والغاية
      {
        id: 'purposes',
        icon: '🎯',
        title: 'المهمة والغاية — الغايات الحياتية الأربع الكبرى',
        subtitle: 'الغاية الشخصية، والاجتماعية، والروحية العامة، والغاية الكونية العليا (Purposes)',
        arcanaList: [
          { num: purposes.personal, name: 'الشخصية 20–40' },
          { num: purposes.social, name: 'الاجتماعية 40–60' },
          { num: purposes.spiritual, name: 'العامة / الكونية' }
        ],
        contentKey: 'matrix.section.purposes',
        slots: {
          primary: `تتكامل غاياتك الأربع عبر مسارات الحياة: الشخصية <strong>(${purposes.personal})</strong>، الاجتماعية <strong>(${purposes.social})</strong>، الروحية <strong>(${purposes.spiritual})</strong>، والكونية <strong>(${purposes.planetary})</strong>.`,
          detailed: `
            <div class="aqm-purposes-grid">
              <div class="aqm-pillar">
                <h4>الغاية الشخصية <span class="aqm-t-en">Personal Purpose (حتى سن 40)</span></h4>
                <div class="aqm-pillar-num">${purposes.personal}</div>
                <p>تثبيت الذات، النضج الداخلي، ومواءمة محوري السماء والأرض.</p>
              </div>
              <div class="aqm-pillar">
                <h4>الغاية الاجتماعية <span class="aqm-t-en">Social Purpose (40 - 60 سنة)</span></h4>
                <div class="aqm-pillar-num">${purposes.social}</div>
                <p>خدمة المجتمع، العطاء للعائلة، وتمرير الخبرات للأجيال القادمة.</p>
              </div>
              <div class="aqm-pillar">
                <h4>الغاية الروحية العامة <span class="aqm-t-en">Spiritual Purpose</span></h4>
                <div class="aqm-pillar-num">${purposes.spiritual}</div>
                <p>المكافأة الروحية، السلام الداخلي، والاتصال بالحكمة العليا.</p>
              </div>
              <div class="aqm-pillar">
                <h4>الغاية الكونية العليا <span class="aqm-t-en">Planetary Purpose</span></h4>
                <div class="aqm-pillar-num">${purposes.planetary}</div>
                <p>الأثر التراكمي الممتد والرسالة الإنسانية الأوسع نطاقاً.</p>
              </div>
            </div>
          `,
          strengths: `وضوح الرؤية الحياتية، التوازن بين الأهداف الدنيوية والروحية، والشعور العميق بجدوى المسار.`,
          challenges: `الاستعجال في حرق المراحل العمرية، أو التمسك بالأهداف المادية على حساب النضج الروحي.`,
          practical: `راجع أهدافك كل عام لترى أي الغايات الأربع تحتاج منك تركيزاً أكبر في مرحلتك العمرية الحالية.`
        }
      },

      // 4. الشخصية والصورة الخارجية
      {
        id: 'personal',
        icon: '👤',
        title: 'الشخصية والصورة الخارجية — طاقة يوم الميلاد',
        subtitle: 'الانطباع الأول، بطاقة التعارف، وكيف يراك العالم عند أول لقاء (Anchor A)',
        arcanaList: [{ num: A, name: getInfo(A).name }],
        contentKey: 'matrix.section.personal',
        slots: {
          primary: `يمثل يوم ميلادك زاوية الشخصية <strong>${getInfo(A).name} (${A})</strong>. هذه هي بطاقة تعارفك مع العالم.`,
          detailed: arcA ? `
            <div class="aqm-rich-card">
              <p class="aqm-slot-p"><strong>الكاريزما والحضور:</strong> ${arcA.archetype || ''}</p>
              <p class="aqm-slot-p"><strong>تحدي الصورة الخارجية:</strong> ${arcA.paradox || ''}</p>
            </div>
          ` : `طاقة يوم الميلاد هي الغلاف الخارجي الذي يتعامل به المجتمع معك. في جانبها الإيجابي تمنحك جاذبية وثقة.`,
          strengths: arcA && arcA.light ? arcA.light : getInfo(A).light,
          challenges: arcA && arcA.shadow ? arcA.shadow : getInfo(A).shadow,
          practical: `استثمر كاريزما ${getInfo(A).name} في تقديم نفسك بصدق وتلقائية، دون افتعال أو تقمص شخصيات أخرى.`
        }
      },

      // 5. المواهب والقدرات
      {
        id: 'talents',
        icon: '✨',
        title: 'المواهب والقدرات — هدايا الروح والإلهام',
        subtitle: 'المواهب الفطرية والاتصال بالإلهام والحدس (Anchor B)',
        arcanaList: [{ num: B, name: 'B' }, { num: axisPoints(P, adapter.reduceArcana).top.mid, name: 'B1' }, { num: axisPoints(P, adapter.reduceArcana).top.outer, name: 'B2' }, { num: P.corners.G, name: 'G الأم' }, { num: P.corners.F, name: 'F الأب' }],
        contentKey: 'matrix.section.talents',
        slots: {
          primary: `تتوج زاوية المواهب طاقة شهر الميلاد <strong>${getInfo(B).name} (${B})</strong>؛ وهي الهدية التي زودتك بها الروح لتلهم مسارك.`,
          detailed: arcB ? `
            <div class="aqm-rich-card">
              <p class="aqm-slot-p"><strong>جوهر الموهبة والإلهام:</strong> ${arcB.archetype || ''}</p>
              <p class="aqm-slot-p"><strong>مفتاح تفجير الإبداع:</strong> ${arcB.light || ''}</p>
            </div>
          ` : `هذه الزاوية تمثل الاتصال المباشر مع طاقات الإبداع والحدس وتكشف عن مهاراتك الفطرية.`,
          strengths: arcB && arcB.light ? arcB.light : getInfo(B).light,
          challenges: arcB && arcB.shadow ? arcB.shadow : getInfo(B).shadow,
          practical: `خصص وقتاً أسبوعياً لممارسة هواياتك الإبداعية المرتبطة بـ ${getInfo(B).name}.`
        }
      },

      // 6. خط الأب
      {
        id: 'father_line',
        icon: '🛡️',
        title: 'خط الأب — التراث الكارمي لسلالة الذكور',
        subtitle: 'المحور الممتد من زاوية الأب الروحية (F) إلى زاوية الأب المادية (H)',
        arcanaList: [
          { num: F, name: getInfo(F).name },
          { num: H, name: getInfo(H).name },
          { num: generational.father.combined, name: 'محصلة الأب' }
        ],
        contentKey: 'matrix.section.father_line',
        slots: {
          primary: `يربط خط الأب بين الروح <strong>${getInfo(F).name} (${F})</strong> والمادة <strong>${getInfo(H).name} (${H})</strong> بمحصلة كلية <strong>(${generational.father.combined})</strong>.`,
          detailed: `يعكس هذا الخط الدروس المتوارثة من سلالة الذكور (الأب والأجداد): كيفية التعامل مع السلطة، المسؤولية، الإنجاز المالي، والحماية النفسية.`,
          strengths: `القوة العزمية، الصمود أمام التحديات، والانضباط في السعي نحو الأهداف الكبرى.`,
          challenges: `الخوف من الفشل في نظر الأب، أو تكرار أنماط القسوة وكبت المشاعر.`,
          practical: `اعمل على مسامحة أخطاء الأب والأسلاف الذكور، وخذ من تراثهم العزم وتجنب الجفاء العاطفي.`
        }
      },

      // 7. خط الأم
      {
        id: 'mother_line',
        icon: '🌸',
        title: 'خط الأم — التراث الكارمي لسلالة الإناث',
        subtitle: 'المحور الممتد من زاوية الأم الروحية (G) إلى زاوية الأم المادية (I)',
        arcanaList: [
          { num: G, name: getInfo(G).name },
          { num: I, name: getInfo(I).name },
          { num: generational.mother.combined, name: 'محصلة الأم' }
        ],
        contentKey: 'matrix.section.mother_line',
        slots: {
          primary: `يربط خط الأم بين الروح <strong>${getInfo(G).name} (${G})</strong> والمادة <strong>${getInfo(I).name} (${I})</strong> بمحصلة كلية <strong>(${generational.mother.combined})</strong>.`,
          detailed: `يكشف هذا الخط عن التراث العاطفي الموروث من سلالة النساء: جروح الأمومة، التضحية، علاقات الزواج، والقدرة على تقبل الذات وتغذية الإبداع.`,
          strengths: `الدفء العاطفي، الخصوبة الفكرية والإبداعية، والقدرة العالية على الاحتواء والرعاية.`,
          challenges: `التضحية الزائدة على حساب الذات، الشعور بالذنب العاطفي، أو صعوبة وضع حدود صحية.`,
          practical: `أعد بناء علاقتك مع طاقة الأمومة والأم بالامتنان والحرية، وتجنب الذوبان التام في احتياجات الآخرين.`
        }
      },

      // 8. الأجداد والبرامج العائلية
      {
        id: 'ancestral_programs',
        icon: '🏛️',
        title: 'الأجداد والبرامج العائلية — طاقة التراث الجمعي ومحاور الأنساب',
        subtitle: 'العقد والعهود المتوارثة من أجيال السلف وكيفية تحرير شجرة العائلة',
        arcanaList: [
          { num: P.ancestralPrograms.ancestralCenter, name: 'مركز الأجداد' },
          { num: P.ancestralPrograms.commonCenter, name: 'المركز المشترك' }
        ],
        contentKey: 'matrix.section.ancestral_programs',
        slots: {
          primary: `تتكامل محاور الأنساب في نقطة مركز الأجداد <strong>(${P.ancestralPrograms.ancestralCenter})</strong> والمركز المشترك <strong>(${P.ancestralPrograms.commonCenter})</strong> كجامع للتراث العائلي لخط الأب (${generational.father.combined}) وخط الأم (${generational.mother.combined}).`,
          detailed: ancLines ? `
            <div class="aqm-anc-grid">
              <div class="aqm-pillar">
                <h4>${ancLines.maleLine.title}</h4>
                <p>${ancLines.maleLine.description}</p>
                <p><strong>مسار الشفاء:</strong> ${ancLines.maleLine.healingPath}</p>
              </div>
              <div class="aqm-pillar">
                <h4>${ancLines.femaleLine.title}</h4>
                <p>${ancLines.femaleLine.description}</p>
                <p><strong>مسار الشفاء:</strong> ${ancLines.femaleLine.healingPath}</p>
              </div>
            </div>
          ` : `يكشف تقاطع خطوط السلف في مركز الأجداد عن العقد الروحية والأنماط السلوكية المتوارثة عبر الأجيال.`,
          strengths: `الاستناد إلى قوة الجذور التراكمية للعائلة، توارث الحكمة والصمود والبركة الروحية.`,
          challenges: `الشعور بالذنب غير المبرر عند تحقيق نجاح لم يحققه السلف، أو الانغماس في أعباء الماضي.`,
          practical: `عبّر عن الامتنان لجهود الأجداد، وتحرر بوعي من أي قيد أو اعتقاد سلبي يمنعك من النمو.`
        }
      },

      // 9. خط العلاقات والحب
      {
        id: 'love_line',
        icon: '💖',
        title: 'خط العلاقات والحب — الشريك ونقطة القلب',
        subtitle: 'صفات شريك الروح، كيفية الحفاظ على الشغف، ونقطة التقاء العاطفة بالواقع',
        arcanaList: [
          { num: heartPoint, name: getInfo(heartPoint).name },
          { num: balancePoint, name: 'التوازن' },
          { num: intermediate.D2, name: 'مدخل القلب' }
        ],
        contentKey: 'matrix.section.love_line',
        slots: {
          primary: `يمر خط علاقاتك بنقطة مدخل القلب <strong>${getInfo(heartPoint).name} (${heartPoint})</strong> وصولاً لنقطة التوازن <strong>(${balancePoint})</strong>.`,
          detailed: `يكشف هذا المسار مواصفات الشريك الأنسب لنموك، والبيئة التي يزدهر فيها الحب، والتحديات العاطفية التي تتطلب صراحة وشفافية.`,
          strengths: `العمق العاطفي، القدرة على بناء شراكة مستدامة، والتفاهم السريع مع الشريك المتوافق.`,
          challenges: `الخوف من الرفض، التعلق العاطفي المرضي، أو فرض التوقعات المثالية غير الواقعية.`,
          practical: `احرص على فتح مساحات حوار دورية وصادقة مع الشريك، وركز على التقدير المستمر للمبادرات الإيجابية.`
        }
      },

      // 10. خط المال والعمل
      {
        id: 'money_line',
        icon: '💰',
        title: 'خط المال والعمل — مصادر الدخل وتدفق الوفرة والمهنة',
        subtitle: 'المسار المالي، المهام المهنية الأنسب، ومفتاح فتح التدفق المالي المستمر',
        arcanaList: [
          { num: moneyPoint, name: getInfo(moneyPoint).name },
          { num: balancePoint, name: 'التوازن' },
          { num: intermediate.C2, name: 'مدخل المادة' }
        ],
        contentKey: 'matrix.section.money_line',
        slots: {
          primary: `يقود خط الوفرة مدخل المال <strong>${getInfo(moneyPoint).name} (${moneyPoint})</strong> بالتقائه مع زاوية المادة والصحة <strong>(${C})</strong> ونقطة التوازن <strong>(${balancePoint})</strong>.`,
          detailed: `يوضح هذا المسار المجالات المهنية الأكثر دراً للمال والمناسبة لطاقتك، وموانع التدفق النفسية كعقدة الخوف من الفقر.`,
          strengths: `القدرة على خلق الفرص، استثمار الموارد بذكاء، وتحويل المعرفة النظرية إلى أصول مادية قيّمة.`,
          challenges: `القلق المستمر بشأن المال، التبذير التعويضي، أو العمل في مجالات تستنزف الروح دون شغف.`,
          practical: `وجّه طاقتك المهنية نحو تقديم قيمة ملموسة للمحيطين، وتعامل مع المال كوسيلة للتمكين والحرية.`
        }
      },

      // 11. الشاكرات
      {
        id: 'chakras',
        icon: '🧘',
        title: 'الشاكرات — جدول مراكز الطاقة ومستويات الوعي',
        subtitle: 'توزيع الطاقات على مراكز الوعي السبعة وتحليل مستويات الجسد والنفس',
        arcanaList: [
          { num: chakras.totals.physics, name: 'الفيزياء' },
          { num: chakras.totals.energy, name: 'الطاقة' },
          { num: chakras.totals.emotions, name: 'المشاعر' }
        ],
        contentKey: 'matrix.section.chakras',
        slots: {
          primary: `يربط جدول الشاكرات طاقاتك بمراكز الوعي السبعة: المحصلة الفيزيائية <strong>(${chakras.totals.physics})</strong>، محصلة الطاقة <strong>(${chakras.totals.energy})</strong>، ومحصلة المشاعر <strong>(${chakras.totals.emotions})</strong>.`,
          detailed: `
            <div class="aqm-chakra-table-wrap">
              <table class="aqm-chakra-table">
                <thead>
                  <tr>
                    <th>الشاكرا وموضعها</th>
                    <th>الجسد الفيزيائي</th>
                    <th>الطاقة الحيوية</th>
                    <th>المشاعر والوعي</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.entries(chakras.rows).map(([k, r]) => `
                    <tr>
                      <td><span class="aqm-chakra-dot" style="display:inline-block;vertical-align:middle;margin-inline-end:8px;background:${CHAKRA_COLORS[k] || '#C5A46D'}"></span>${r.name}</td>
                      <td><span class="aqm-chakra-badge">${r.physics}</span></td>
                      <td><span class="aqm-chakra-badge">${r.energy}</span></td>
                      <td><span class="aqm-chakra-badge">${r.emotions}</span></td>
                    </tr>
                  `).join('')}
                  <tr class="aqm-chakra-total-row">
                    <td><strong>المجموع الكلي</strong></td>
                    <td><strong>${chakras.totals.physics}</strong></td>
                    <td><strong>${chakras.totals.energy}</strong></td>
                    <td><strong>${chakras.totals.emotions}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          `,
          strengths: `التناغم الحيوي، سرعة الاستشفاء الذاتي، والقدرة على استشعار احتياجات الجسد وتلبيتها بحكمة.`,
          challenges: `تراكم التوتر والضغوط النفسية في مراكز محددة مما يسبب تعباً جسدياً مزمناً.`,
          practical: `مارس التنفس الواعي وتمارين التمدد يومياً لتحرير الشاكرات من أي ركود طاقي.`
        }
      },

      // 12. برامج المصفوفة المركبة
      {
        id: 'composite_programs',
        icon: '🔮',
        title: 'برامج المصفوفة المركبة — الشيفرات الثلاثية والأنماط المعقدة',
        subtitle: 'تلاقي طاقات متعددة لتشكيل برامج نفسية وحياتية مركبة داخل الوعي',
        arcanaList: [
          { num: P.compositePrograms.spiritualTriad[1], name: 'برنامج الروح' },
          { num: P.compositePrograms.materialTriad[1], name: 'برنامج المادة' }
        ],
        contentKey: 'matrix.section.composite_programs',
        slots: {
          primary: `تتكامل ثلاثيات مصفوفتك لتشكيل برامج حياتية مركبة: ثلاثية الروح <strong>(${P.compositePrograms.spiritualTriad.join(' - ')})</strong> وثلاثية المادة <strong>(${P.compositePrograms.materialTriad.join(' - ')})</strong>.`,
          detailed: `
            <div class="aqm-prog-box">
              <p class="aqm-slot-p"><strong>برنامج محور الروح (${P.compositePrograms.spiritualTriad.join(' - ')}):</strong> يربط بين تطلعات النور والوعي الروحي، ومواءمة البصيرة مع العمل الفعلي.</p>
              <p class="aqm-slot-p"><strong>برنامج محور المادة (${P.compositePrograms.materialTriad.join(' - ')}):</strong> يدير تدفق الوفرة، التثبيت في أرض الواقع، وتصريف المهارات إلى منجزات ملموسة.</p>
            </div>
          `,
          strengths: `تنوع المهارات، القدرة على التكيف في الأوضاع المعقدة، والجمع بين النظرة الفلسفية والتطبيق العملي.`,
          challenges: `صراع الأولويات بين الرغبات الروحية والواجبات المادية، وتشتت الانتباه.`,
          practical: `حدد هدفاً واحداً واضحاً لكل دورة عمل، وتجنب البدء في مشاريع جديدة قبل إكمال المهام المفتوحة.`
        }
      },

      // 13. الأطفال والمؤشرات المرتبطة بهم
      {
        id: 'children_line',
        icon: '🌱',
        title: 'الأطفال والمؤشرات المرتبطة بهم — طاقة الأبناء واستمرارية الأجيال',
        subtitle: 'العلاقة مع الأبناء، والرسائل التي يحملها الأطفال لوالديهم',
        arcanaList: [
          { num: P.childrenLine.childEnergy, name: 'طاقة الطفل' },
          { num: P.childrenLine.generationKey, name: 'مفتاح التواصل' }
        ],
        contentKey: 'matrix.section.children_line',
        slots: {
          primary: `ترتبط مؤشرات الأبناء بطاقة الامتداد الجيلي <strong>(${P.childrenLine.childEnergy})</strong> ومفتاح التواصل بين الأجيال <strong>(${P.childrenLine.generationKey})</strong>.`,
          detailed: `
            <div class="aqm-child-box">
              <p class="aqm-slot-p"><strong>طاقة الامتداد الجيلي (${P.childrenLine.childEnergy} - ${getInfo(P.childrenLine.childEnergy).name}):</strong> تمثل جوهر التواصل الفطري ونقاط التوافق مع الأبناء والأجيال القادمة.</p>
              <p class="aqm-slot-p"><strong>مفتاح التفاهم التربوي (${P.childrenLine.generationKey}):</strong> بناء جسر من الثقة والاحترام غير المشروط، وتفهم الاختلافات الفردية لكل طفل دون قوالب مسبقة.</p>
            </div>
          `,
          strengths: `الصبر والاحتواء، الفهم العميق لنفسية الأطفال، وبناء علاقة صداقة وثقة تدوم عبر السنين.`,
          challenges: `القلق الزائد على مستقبل الأبناء أو محاولة توجيههم في مسارات لا تناسب شخصياتهم الفطرية.`,
          practical: `امنح الأطفال مساحة حرة للتعبير عن مشاعرهم، واستمع إليهم باهتمام دون أحكام مسبقة.`
        }
      },

      // 14. دورات الحياة ومحطاتها
      {
        id: 'age_cycles',
        icon: '⏳',
        title: 'دورات الحياة ومحطاتها — الخريطة الزمنية (0 - 80 سنة) وطاقة العام',
        subtitle: 'المحطات العمرية على المحيط الخارجي ودورة الطاقات المؤثرة على كل مرحلة',
        arcanaList: [0, 10, 20, 30, 40, 50, 60, 70].map(a => ({ num: (P.ageMap && (P.ageMap[a] || P.ageMap[String(a)])) || A, name: 'سن ' + a })),
        contentKey: 'matrix.section.age_cycles',
        slots: {
          primary: `تتوزع محطات مصفوفتك الزمنية عبر حلقة الأعمار: محطة سن 20 <strong>(${(P.ageMap && P.ageMap['20']) || (P.ageStations && P.ageStations['20']) || A})</strong>، محطة سن 40 <strong>(${(P.ageMap && P.ageMap['40']) || (P.ageStations && P.ageStations['40']) || C})</strong>، ومحطة سن 60 <strong>(${(P.ageMap && P.ageMap['60']) || (P.ageStations && P.ageStations['60']) || D})</strong>.`,
          detailed: `
            <div class="aqm-age-preview">
              <p>تدور طاقات مصفوفتك في دورات زمنية تبدأ من سن الصفر وحتى الثمانين. كل محطة عمرية تحمل طاقة حاكمة توجه أولوياتك النفسية والمادية في تلك الفترة.</p>
              <div class="aqm-age-badges">
                <span class="aqm-badge">0-20 سنة: بناء الشخصية</span>
                <span class="aqm-badge">20-40 سنة: ترسيخ المادة والإنتاج</span>
                <span class="aqm-badge">40-60 سنة: النضج الاجتماعي</span>
                <span class="aqm-badge">60-80 سنة: الحكمة الروحية</span>
              </div>
            </div>
          `,
          strengths: `الاستعداد المبكر للتحولات العمرية، وفهم معنى الدروس التي تفرضها كل مرحلة في توقيتها الدقيق.`,
          challenges: `مقاومة التغيير الطبيعي لمراحل العمر أو الشعور بفوات الأوان.`,
          practical: `راجع طاقتك الحالية وركز على أولويات مرحلتك العمرية الحالية لتحقيق أقصى درجات التناغم.`
        }
      },

      // 15. روشتة التحول
      {
        id: 'transformation_rx',
        icon: '⚖️',
        title: 'روشتة التحول — مفاتيح الموازنة والارتقاء من الظل إلى النور',
        subtitle: 'بروتوكول تفكيك العقد وتفعيل الطاقات الإيجابية في السلوك اليومي',
        arcanaList: [
          { num: P.transformationKeys.balancePoint, name: 'التوازن' },
          { num: P.transformationKeys.skyAxis, name: 'المفتاح الروحي' },
          { num: P.transformationKeys.earthAxis, name: 'المفتاح المادي' }
        ],
        contentKey: 'matrix.section.transformation_rx',
        slots: {
          primary: `تتكامل مفاتيح تحولك عند نقطة التوازن <strong>(${P.transformationKeys.balancePoint})</strong> مع المفتاح الروحي <strong>(${P.transformationKeys.skyAxis})</strong> والمفتاح المادي <strong>(${P.transformationKeys.earthAxis})</strong>.`,
          detailed: `
            <div class="aqm-rx-box">
              <h4>بروتوكول التحول من الظل إلى النور:</h4>
              <ol class="aqm-rx-list">
                <li><strong>الوعي بطاقة المركز (${E}):</strong> لا تسمح لضغوط الحياة بإخراجك من سكينة ${getInfo(E).name}.</li>
                <li><strong>تحرير الذيل الكارمي (${D}):</strong> تذكر دائماً ألا تكرر ردود الأفعال القديمة عندما تواجه عقبات مشابهة.</li>
                <li><strong>تفعيل نقطة التوازن (${P.transformationKeys.balancePoint}):</strong> وازن بين احتياجاتك المادية وتطلعاتك الروحية.</li>
              </ol>
            </div>
          `,
          strengths: `المرونة النفسية العالية، القدرة على تحويل الأزمات إلى فرص للنمو، وتفعيل قوة الإرادة الواعية.`,
          challenges: `الانتكاس نحو العادات القديمة عند الإرهاق أو الاستسلام للشكوك.`,
          practical: `ابدأ كل صباح بنيّة واعية لتفعيل فضائل النور في طاقاتك، واجعل التوازن هدفك اليومي الدائم.`
        }
      }
    ];

    return sections.map(buildAccordionItem).join('\n');
  }

  const build12Sections = build15Sections;

  /* ===== التوقعات الزمنية: السنة، الأشهر الاثنا عشر، الأسبوع واليوم (أرقام فقط + زر التفسير الموجود) ===== */
  const AR_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  function fcDate(iso) { const [y, m, d] = String(iso).split('-').map(Number); return `${d} ${AR_MONTHS[m - 1]}`; }
  function fcRange(a, b) { return `${fcDate(a)} – ${fcDate(b)}`; }
  function buildForecastSection(engine, birthDate) {
    let F;
    try { F = engine.calculateForecast(birthDate); } catch (err) { console.error(err); return ''; }
    if (!F || !F.today) return '';
    const nm = n => { try { return engine.getArcanaInfo(n).name; } catch (e) { return ''; } };
    const hint = n => { try { return engine.getArcanaInfo(n).archetype; } catch (e) { return ''; } };
    const read = n => `<button type="button" class="aqm-fc-open aqm-fc-read" data-fc-arcana="${n}" aria-haspopup="dialog">اقرأ تفسير الطاقة</button>`;
    const num = n => `<span class="aqm-fc-num" aria-hidden="true">${n}</span>`;
    const card = (cls, kicker, range, n, extra) => `
      <article class="aqm-fc-card ${cls}">
        <header class="aqm-fc-head">${num(n)}<div><span class="aqm-fc-kicker">${escapeHtml(kicker)}</span><h4>${escapeHtml(nm(n))}</h4><small>${escapeHtml(range)}</small></div></header>
        <p class="aqm-fc-line">${escapeHtml(hint(n))}</p>
        ${extra || ''}
        ${read(n)}
      </article>`;
    const tags = (F.today.tags || []).map(t => `<span class="aqm-fc-pill" data-tag="${t.id}">${escapeHtml(t.label)}</span>`).join('');
    const monthsHtml = F.months.map(m => `
      <li class="aqm-fc-month${m.index === F.currentMonth.index ? ' is-now' : ''}">
        <button type="button" class="aqm-fc-open" data-fc-arcana="${m.number}" aria-haspopup="dialog" aria-label="${escapeHtml(nm(m.number))} — ${escapeHtml(fcRange(m.from, m.to))}">
          ${num(m.number)}<span class="aqm-fc-mname">${escapeHtml(nm(m.number))}</span><span class="aqm-fc-mdate">${escapeHtml(fcRange(m.from, m.to))}</span>
        </button>
      </li>`).join('');
    return `
      <section class="aqm-forecast" id="aqm-forecast" aria-labelledby="aqm-fc-title">
        <h3 id="aqm-fc-title" class="aqm-fc-title">التوقعات الزمنية</h3>
        <p class="aqm-fc-sub">تبدأ سنتك من يوم ميلادك وتنتهي قبل يوم ميلادك التالي. اضغط على أي طاقة لقراءتها.</p>
        <div class="aqm-fc-grid">
          ${card('aqm-fc-c-year', 'طاقة السنة', `${fcRange(F.yearRange.from, F.yearRange.to)} · ${F.yearRange.label}`, F.yearPersonal,
            `<p class="aqm-fc-aux">محطتك على حلقة الأعمار الآن: <b>${F.yearRing.ring}</b> ${escapeHtml(nm(F.yearRing.ring))}</p>`)}
          ${card('aqm-fc-c-month', 'الشهر الحالي', fcRange(F.currentMonth.from, F.currentMonth.to), F.currentMonth.number)}
          ${card('aqm-fc-c-week', 'الأسبوع الحالي', fcRange(F.currentWeek.from, F.currentWeek.to), F.currentWeek.number)}
          ${card('aqm-fc-c-day', 'اليوم', fcDate(F.today.date), F.today.number, tags ? `<div class="aqm-fc-pills" role="list" aria-label="دليل اليوم">${tags}</div>` : '')}
        </div>
        <h4 class="aqm-fc-sec">الأشهر الاثنا عشر لسنتك</h4>
        <ol class="aqm-fc-months">${monthsHtml}</ol>
      </section>`;
  }


  // ==================== 3. مصفوفة المصطلحات والمرجع (Glossary) ====================

  function buildGlossaryGrid(P) {
    const { anchors, corners } = P;
    const items = [
      { ar: 'الشخصية والمظهر', en: 'Personality Essence (A)', num: anchors.A },
      { ar: 'الاتصال الروحي', en: 'Spiritual Link (B)', num: anchors.B },
      { ar: 'المادة والصحة', en: 'Material Power (C)', num: anchors.C },
      { ar: 'الذيل الكارمي', en: 'Karmic Tail (D)', num: anchors.D },
      { ar: 'مركز راحة الروح', en: 'Soul Comfort (E)', num: anchors.E },
      { ar: 'مواهب الأب', en: 'Paternal Talents (F)', num: corners.F },
      { ar: 'مواهب الأم', en: 'Maternal Talents (G)', num: corners.G },
      { ar: 'كارما الأب', en: 'Ancestral Lines Father (H)', num: corners.H },
      { ar: 'كارما الأم', en: 'Ancestral Lines Mother (I)', num: corners.I }
    ];

    return `
      <div class="aqm-gloss-grid">
        ${items.map(it => `
          <div class="aqm-gloss">
            <span class="aqm-t-en">${it.en}</span>
            <div class="aqm-t-ar">${it.ar}: <strong>${it.num}</strong></div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ==================== 4. العرض المتكامل والربط بالـ DOM ====================

  /**
   * الدالة الرئيسية لبناء وعرض تقرير مصفوفة القدر المتكامل في المتصفح
   */
  function renderMatrixReport(arg1, arg2, arg3, arg4) {
    let host = null;
    let birthDate = null;
    let name = '';
    let gender = '';

    if (arg1 && typeof arg1 === 'object' && arg1.nodeType) {
      host = arg1;
      birthDate = arg2;
      name = arg3 || '';
      gender = arg4 || '';
    } else {
      host = document.querySelector('#mresult');
      birthDate = arg1;
      name = arg2 || '';
      gender = arg3 || '';
    }

    if (!birthDate || !String(birthDate).trim()) return;
    if (!host) host = document.querySelector('#mresult');
    if (!host) return;

    const engine = window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter;
    if (!engine) {
      host.innerHTML = '<p class="ferr">محرك الحسابات لم يُحمّل بعد. يُرجى تحديث الصفحة.</p>';
      host.hidden = false;
      return;
    }

    // لو الاستدعاء جه من index.html (بدون جنس)، ناخد الاختيار من حقل صيغة التقرير.
    if (!gender) {
      const gi = document.querySelector('#m-gender');
      gender = gi ? gi.value : '';
    }

    let P;
    try { P = engine.calculateDestinyMatrix(birthDate); } catch (err) { P = null; console.error(err); }
    if (!P || !P.anchors) {
      host.innerHTML = '<div class="aqm-state aqm-state-error" role="alert"><p>تعذّر إنشاء المصفوفة لهذه البيانات. تحقّق من تاريخ الميلاد وحاول مرة أخرى.</p><button type="button" class="aqm-btn aqm-btn-primary" data-aqm-retry>حاول مرة أخرى</button></div>';
      host.hidden = false;
      host.querySelector('[data-aqm-retry]')?.addEventListener('click', () => { const d = document.getElementById('m-date'); host.hidden = true; host.innerHTML = ''; (d || document.getElementById('mform'))?.focus(); });
      return;
    }
    const getInfo = n => engine.getArcanaInfo(n);
    const forecastHtml = buildForecastSection(engine, P.birthDate);
    const dateStr = `${P.birthDate.year}-${String(P.birthDate.month).padStart(2, '0')}-${String(P.birthDate.day).padStart(2, '0')}`;
    const displayName = name ? name.trim() : 'مستخدم عقيق أسترو';
    // ملخص التصميم: قراءة فقط من نتيجة المحرك؛ أي قيمة ناقصة تظهر «—» بدل رقم مخترع.
    const pick = (fn) => { try { const v = fn(); return (v === undefined || v === null || v === '' || Number.isNaN(v)) ? null : v; } catch (e) { return null; } };
    const arc = (n) => { const v = pick(() => n); if (v === null) return '—'; const i = pick(() => getInfo(v).name); return i ? `${i} (${v})` : String(v); };
    const summaryRows = [
      ['الطاقة الأساسية', arc(pick(() => P.anchors.A))],
      ['الرقم المركزي', arc(pick(() => P.anchors.E))],
      ['أبرز موهبة', arc(pick(() => P.anchors.B))],
      ['خط العلاقات', arc(pick(() => P.channels.heartPoint))],
      ['خط المال', arc(pick(() => P.channels.moneyPoint))]
    ];
    const infoOf = (n) => { const v = pick(() => n); if (v === null) return null; return pick(() => getInfo(v)); };
    const sumCard = (label, n) => { const i = infoOf(n); const num = pick(() => n);
      return `<li class="aqm-sum-card${num === null ? ' is-empty' : ''}"><span class="aqm-sum-num">${num === null ? '—' : num}</span><div class="aqm-sum-body"><span class="aqm-sum-label">${label}</span><strong class="aqm-sum-name">${i && i.name ? i.name : '—'}</strong><span class="aqm-sum-arch">${i && i.archetype ? i.archetype : ''}</span></div><p class="aqm-sum-light">${i && i.light ? i.light : ''}</p></li>`; };
    const sumCardsHtml = [['الطاقة الأساسية', pick(() => P.anchors.A)], ['الرقم المركزي', pick(() => P.anchors.E)], ['أبرز موهبة', pick(() => P.anchors.B)]].map(([l, n]) => sumCard(l, n)).join('');
    const chainHtml = (arr) => (Array.isArray(arr) && arr.length ? arr : [null, null, null]).map(n => `<span class="aqm-chain-n${n == null ? ' is-empty' : ''}">${n == null ? '—' : n}</span>`).join('<i class="aqm-chain-l" aria-hidden="true"></i>');
    // نسب مؤقتة للعرض فقط (لا صيغة حسابية بعد). غيّر القيم هنا لاحقًا أو اربطها بصيغة المحرك.
    const PLACEHOLDER_PCT = { energy: 80, love: 65, money: 70 };
    const pctHtml = (k) => `<div class="aqm-pct" data-placeholder="true"><span class="aqm-pct-v">${PLACEHOLDER_PCT[k]}%</span><div class="aqm-pct-bar" role="img" aria-label="${PLACEHOLDER_PCT[k]}%"><i style="width:${PLACEHOLDER_PCT[k]}%"></i></div></div>`;
    const lineCard = (icon, title, arr, endNum, pk) => { const i = infoOf(endNum); return `<article class="aqm-line-card"><header><span class="aqm-line-ic" aria-hidden="true">${icon}</span><h3>${title}</h3></header><p class="aqm-line-sub">${i && i.name ? i.name : '—'}</p>${pk ? pctHtml(pk) : ''}<div class="aqm-chain" dir="ltr">${chainHtml(arr)}</div><p class="aqm-line-desc">${i && i.archetype ? i.archetype : ''}</p></article>`; };
    const linesHtml = lineCard('<svg class="aq-ic" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></svg>', 'الطاقة الأساسية', pick(() => [P.anchors.A, P.anchors.B, P.anchors.C]), pick(() => P.anchors.A), 'energy')
      + lineCard('<svg class="aq-ic" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.500-7 10-7 10z"/></svg>', 'خط العلاقات', pick(() => P.loveLine.path), pick(() => P.channels.heartPoint), 'love')
      + lineCard('<svg class="aq-ic" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".8"/></svg>', 'خط المال', pick(() => P.moneyLine.path), pick(() => P.channels.moneyPoint), 'money');
    const summaryHtml = summaryRows.map(([k, v]) => `<li class="aqm-sum-row${v === '—' ? ' is-empty' : ''}"><span class="aqm-sum-k">${k}</span><span class="aqm-sum-v">${v}</span></li>`).join('');

    const html = `
      <section class="aqm-shell" aria-labelledby="aqm-report-title">
        <div class="aqm-dash">
          <div class="aqm-dash-side">
            <nav class="aqm-crumbs" aria-label="مسار الصفحة"><a href="#home">الرئيسية</a><span aria-hidden="true">/</span><span>أدوات التحليل</span><span aria-hidden="true">/</span><span aria-current="page">مصفوفة القدر</span></nav>
            <div class="aqm-page-title">
          <h1>مصفوفة القدر</h1>
          <p>خريطة رمزية لفهم أنماطك الداخلية وطاقاتك الأساسية</p>
        </div>
            <header class="aqm-header">
          <span class="aqm-kicker">مصفوفة القدر · نظام الأركانا الاثنين والعشرين</span>
          <h2 id="aqm-report-title">${displayName}</h2>
          <div class="aqm-meta-info">
            <span class="aqm-meta-pill">الميلاد: ${dateStr}</span>
            <span class="aqm-meta-pill">المركز: ${getInfo(P.anchors.E).name} (${P.anchors.E})</span>
            <span class="aqm-meta-pill">الجوهر: ${getInfo(P.anchors.A).name} (${P.anchors.A})</span>
            <span class="aqm-meta-pill">سنة ${P.yearEnergy.label || P.yearEnergy.year}: طاقة ${P.yearEnergy.number}</span>
          </div>
          <div class="aqm-actions">
            <button class="aqm-btn" type="button" id="aqm-btn-edit">تعديل البيانات</button>
            <button class="aqm-btn" type="button" id="aqm-btn-print">حفظ كـ PDF / طباعة</button>
            <button class="aqm-btn aqm-btn-primary" type="button" id="aqm-btn-story">استخراج بطاقة القصة</button>
          </div>
        </header>
            ${summaryRows.some(r => r[1] === '—') ? '<p class="aqm-notice" role="status">بعض القيم غير متاحة حاليًا، وتظهر «—» بدل أي رقم غير محسوب.</p>' : ''}
            <aside class="aqm-summary" aria-labelledby="aqm-sum-title">
              <h3 id="aqm-sum-title">الخلاصة</h3>
              <ul class="aqm-sum-list">${sumCardsHtml}</ul>
            </aside>
          </div>
          <!-- حاوية الرسم الهندسي (SVG Octagram) -->
        <div class="aqm-canvas-wrap" id="aqm-map">
          <div class="aqm-zoom" role="group" aria-label="التحكم في العرض">
            <button type="button" class="aqm-zoom-btn" data-aqm-zoom="in" aria-label="تكبير">+</button>
            <button type="button" class="aqm-zoom-btn" data-aqm-zoom="out" aria-label="تصغير">−</button>
            <button type="button" class="aqm-zoom-btn" data-aqm-zoom="reset" aria-label="إعادة الضبط">⟲</button>
          </div>
          <p style="margin:0 0 16px;color:var(--aqm-text-muted);font-size:0.85rem;">خريطة مصفوفة القدر (توزيع مسارات الطاقة والأركانا)</p>
          ${generateMatrixSVG(P).replace(/>undefined</g, '>—<').replace(/data-arcana="undefined"/g, 'data-arcana=""')}
          <ol class="aqm-chakra-axis" id="aqm-chakras" aria-label="المحور الرأسي للشاكرات">
            ${Object.entries(P.chakras.rows).map(([key, r]) => `
              <li class="aqm-chakra-row"><span class="aqm-chakra-dot" style="background:${CHAKRA_COLORS[key] || '#C5A46D'}"></span><span class="aqm-chakra-name">${r.name}</span><span class="aqm-chakra-vals">الفيزياء ${r.physics} · الطاقة ${r.energy} · المشاعر ${r.emotions}</span></li>`).join('')}
          </ol>
        </div>

          <aside class="aqm-rail" aria-label="التنقل السريع">
            <div class="aqm-rail-quote">
              <svg class="aqm-rail-emblem" viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="#D9B979" stroke-width="1.4" aria-hidden="true"><circle cx="32" cy="32" r="26"/><path d="M32 12 50 44H14Z"/><circle cx="32" cy="34" r="5"/></svg>
              <p>كل رقم يحمل في داخله حكاية أعمق من الظاهر</p>
              <i class="aqm-rail-rule" aria-hidden="true"></i>
              <span class="aqm-rail-peaks" aria-hidden="true"></span>
            </div>
            <nav class="aqm-rail-nav">
              <a class="is-active" href="#matrix" aria-current="page"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M12 7v4M7 17l4-6M17 17l-4-6"/></svg><span>مصفوفة القدر</span></a>
              <a href="#compat"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg><span>التوافق</span></a>
              <a href="#featured-content"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h8l4 4v14H7Z"/><path d="M15 3v4h4M10 12h6M10 16h6"/></svg><span>محتوى مميز</span></a>
              <a href="#lifepath"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19c4-1 3-6 8-6s4-5 8-6"/><circle cx="4" cy="19" r="1.5"/><circle cx="20" cy="7" r="1.5"/></svg><span>مسار الحياة</span></a>
              <a href="#chart"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg><span>الخريطة الفلكية</span></a>
              <a href="#account"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg><span>حسابي</span></a>
            </nav>
            <div class="aqm-rail-foot"><p>معرفة أعمق .. لحياة أكثر انسجامًا</p><span>AQEQ ASTRO</span></div>
          </aside>
        </div>
        <section class="aqm-lines" aria-label="الخطوط الرئيسية">${linesHtml}</section>
        <section class="aqm-learn" aria-labelledby="aqm-learn-title">
          <div class="aqm-learn-main">
            <h3 id="aqm-learn-title">كيف نقرأ المصفوفة؟</h3>
            <p>المصفوفة هي خريطة رمزية تعتمد على 22 طاقة، تعكس أنماطك الداخلية ومسارك في الحياة. من خلال تحليل مواقع الأرقام والعلاقات بينها، تكتشف نقاط القوة، مجالات النمو، والدروس الأساسية التي تحملها رحلتك.</p>
            <a class="aqm-btn" href="#aqm-readings">اكتشف المزيد</a>
          </div>
          <svg class="aqm-learn-art" viewBox="0 0 120 120" width="120" height="120" fill="none" stroke="#D9B979" stroke-width="1" aria-hidden="true"><line x1="60" y1="60" x2="112.0" y2="60.0"/><line x1="60" y1="60" x2="108.0" y2="79.9"/><line x1="60" y1="60" x2="96.8" y2="96.8"/><line x1="60" y1="60" x2="79.9" y2="108.0"/><line x1="60" y1="60" x2="60.0" y2="112.0"/><line x1="60" y1="60" x2="40.1" y2="108.0"/><line x1="60" y1="60" x2="23.2" y2="96.8"/><line x1="60" y1="60" x2="12.0" y2="79.9"/><line x1="60" y1="60" x2="8.0" y2="60.0"/><line x1="60" y1="60" x2="12.0" y2="40.1"/><line x1="60" y1="60" x2="23.2" y2="23.2"/><line x1="60" y1="60" x2="40.1" y2="12.0"/><line x1="60" y1="60" x2="60.0" y2="8.0"/><line x1="60" y1="60" x2="79.9" y2="12.0"/><line x1="60" y1="60" x2="96.8" y2="23.2"/><line x1="60" y1="60" x2="108.0" y2="40.1"/><circle cx="60" cy="60" r="14"/><circle cx="60" cy="60" r="34" stroke-dasharray="2 4"/></svg>
          <ol class="aqm-learn-steps">
            <li>كل رقم يحمل طاقة ومعنى خاص</li>
            <li>مواقع الأرقام تكشف مجالات الحياة المختلفة</li>
            <li>العلاقات بين الأرقام توضح ديناميكيات الداخلية</li>
            <li>المصفوفة تقدم رؤية شاملة لمسارك وتطورك</li>
          </ol>
        </section>
        <div class="aqm-tabs" role="tablist" aria-label="أقسام الصفحة">
          <a class="aqm-tab is-active" role="tab" aria-selected="true" href="#aqm-map">الخريطة</a>
          <a class="aqm-tab" role="tab" aria-selected="false" href="#aqm-chakras">الشاكرات</a>
          <a class="aqm-tab" role="tab" aria-selected="false" href="#aqm-readings">التفسيرات</a>
          ${forecastHtml ? '<a class="aqm-tab" role="tab" aria-selected="false" href="#aqm-forecast">التوقعات</a>' : ''}
        </div>

        <!-- نظام الأكورديون الـ 15 المتكامل -->
        <div class="aqm-accordion-container" id="aqm-readings">
          ${build12Sections(P)}
        </div>
        ${forecastHtml}

        <!-- الفهرس المرجعي للأركان (للتوافق المعياري مع الاختبارات) -->
        <div style="margin-top:32px;padding-top:20px;border-top:1px solid var(--aqm-gold-border);">
          <h4 style="font-size:0.95rem;color:var(--aqm-text-muted);margin:0 0 10px;">المعجم الرمزي للمواضع (Karmic Tail & Ancestral Lines):</h4>
          ${buildGlossaryGrid(P)}
        </div>

        <!-- التذييل وإخلاء المسؤولية الرمزية -->
        <footer style="margin-top:32px;text-align:center;font-size:0.82rem;color:var(--aqm-text-muted);line-height:1.7;">
          <p>مصفوفة القدر نظام رمزي للتأمل واستكشاف الذات مبني على منهج ناتاليا لاديني (22 أركانا). عقيق أسترو يقدم القراءات كأداة للوعي والتمكين الذاتي وليست للتنبؤ القاطع أو المشورة الطبية.</p>
        </footer>
      </section>
    `;

    host.innerHTML = html;
    host.hidden = false;
    host.dataset.aqmGender = gender || '';

    // تحميل المحتوى عند فتح الأكورديون (الذيل الكارمي من karmic-tails.json)
    // ترتيب الأرشيف هو عكس ترتيب المحرك (D, D3, D2)، فنعكس الثلاثية قبل البحث.
    const tailTriad = [P.intermediate && P.intermediate.D2, P.intermediate && P.intermediate.D3, P.anchors.D];
    applyGeminiAccordions(host, P, tailTriad);
    hydrateChakraReadings(host, P);
    hydrateLineSections(host, P);
    hydratePersonalComposite(host, P);
    const onAccOpen = item => {
      const sid = item.dataset.sectionId;
      if (sid === 'karmic_tail') return hydrateKarmicTail(item, tailTriad, gender);
      if (sid === 'composite_programs') return hydrateComposite(item, P);
      if (SECTION_SPECS[sid]) return hydrateSection(item, SECTION_SPECS[sid], P, gender);
      return Promise.resolve();
    };

    // ربط تفاعلات الأكورديون
    host.querySelectorAll('.aqm-fc-open').forEach(b => b.addEventListener('click', () => openXrWith(b, () => geminiPositionHtml('core', Number(b.dataset.fcArcana), ''))));
    const accItems = host.querySelectorAll('.aqm-acc-item');
    accItems.forEach(item => {
      const header = item.querySelector('.aqm-acc-header');
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // السماح بفتح وإغلاق مستقل
        item.classList.toggle('open');
        header.setAttribute('aria-expanded', String(!isOpen));
        if (!isOpen) onAccOpen(item);
      });
    });

    // فتح القسم الأول (المركز) تلقائياً افتراضياً
    const firstAcc = host.querySelector('#aqm-sec-center');
    if (firstAcc) {
      firstAcc.classList.add('open');
      firstAcc.querySelector('.aqm-acc-header')?.setAttribute('aria-expanded', 'true');
    }
    // نحمّل نصوص كل الأقسام فوراً بعد الرسم عشان النص العميق يكون جاهز أول ما الأكورديون يتفتح.
    accItems.forEach(item => { onAccOpen(item); });

    // ربط عُقد النجمة بالأكورديون: النقر على العقدة يفتح الكارت المقابل له (data-section = id القسم) ويميّزه ثم يمرّره للأعلى
    const allAcc = host.querySelectorAll('.aqm-acc-item');
    host.querySelectorAll('.aqm-svg .aqm-node').forEach(node => {
      node.setAttribute('role', 'button');
      node.setAttribute('tabindex', '0');
      const act = () => {
        // لا نوافذ منبثقة: الضغط على العقدة يفتح قسمها داخل الأكورديون ويمرّر إليه
        const sec = node.getAttribute('data-section');
        const item = sec && host.querySelector('#aqm-sec-' + sec);
        host.querySelectorAll('.aqm-acc-item.is-active').forEach(i => i.classList.remove('is-active'));
        if (!item) return;
        if (!item.classList.contains('open')) { item.classList.add('open'); item.querySelector('.aqm-acc-header')?.setAttribute('aria-expanded', 'true'); onAccOpen(item); }
        item.classList.add('is-active');
        item.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      node.addEventListener('click', act);
      node.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); act(); } });
    });

    // الخريطة لوحة مرجعية ثابتة: لا توجد أحداث نقر أو تمرير على عُقد الـ SVG

    // التحكم في التكبير: عرض فقط (تحويل CSS على الرسم) دون أي حساب
    (function () {
      const svg = host.querySelector('.aqm-canvas-wrap .aqm-svg');
      if (!svg) return;
      let z = 1;
      const apply = () => { svg.style.transform = z === 1 ? '' : `scale(${z})`; svg.style.transformOrigin = 'center top'; };
      host.querySelectorAll('[data-aqm-zoom]').forEach(b => b.addEventListener('click', () => {
        const m = b.getAttribute('data-aqm-zoom');
        z = m === 'in' ? Math.min(1.6, z + 0.2) : m === 'out' ? Math.max(0.8, z - 0.2) : 1;
        z = Math.round(z * 10) / 10; apply();
      }));
    })();

    // تبويبات: تمييز التبويب الحالي عند التمرير + تمرير سلس (عرض فقط)
    (function () {
      const tabs = [...host.querySelectorAll('.aqm-tab')];
      if (!tabs.length) return;
      const setActive = id => tabs.forEach(t => { const on = t.getAttribute('href') === '#' + id; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', String(on)); });
      tabs.forEach(t => t.addEventListener('click', ev => {
        const id = t.getAttribute('href').slice(1);
        const target = host.querySelector('#' + id);
        if (!target) return;
        ev.preventDefault();
        target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        setActive(id);
      }));
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }); }, { rootMargin: '-20% 0px -60% 0px' });
        ['aqm-map', 'aqm-chakras', 'aqm-readings'].forEach(id => { const el = host.querySelector('#' + id); if (el) io.observe(el); });
      }
    })();

    // ربط زر الطباعة / PDF
    host.querySelector('#aqm-btn-print')?.addEventListener('click', () => {
      // فتح كل الأكورديونات قبل الطباعة لضمان ظهور كامل المحتوى في الـ PDF
      const loads = [];
      accItems.forEach(item => {
        item.classList.add('open');
        item.querySelector('.aqm-acc-header')?.setAttribute('aria-expanded', 'true');
        loads.push(onAccOpen(item));
      });
      // نستنى تحميل نصوص الأقسام قبل الطباعة عشان الـ PDF يطلع كامل.
      Promise.all(loads).then(() => window.print(), () => window.print());
    });

    // تعديل البيانات: يعيد فتح نموذج الإدخال مع القيم الحالية دون تحديث الصفحة
    host.querySelector('#aqm-btn-edit')?.addEventListener('click', ev => {
      const mf = document.getElementById('mform');
      if (!mf) return;
      const opener = ev.currentTarget;
      const dlg = document.createElement('div');
      dlg.className = 'aqm-modal';
      dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-labelledby', 'aqm-edit-title');
      dlg.innerHTML = `<div class="aqm-modal-card"><h3 id="aqm-edit-title">تعديل بيانات التحليل</h3>
        <label>الاسم (اختياري)<input type="text" maxlength="40" id="aqm-edit-name" autocomplete="off"></label>
        <label>تاريخ الميلاد<input type="date" id="aqm-edit-date" min="1900-01-01" max="2100-12-31"></label>
        <div class="aqm-modal-actions"><button type="button" class="aqm-btn" data-x>إلغاء</button><button type="button" class="aqm-btn aqm-btn-primary" data-ok>تحديث المصفوفة</button></div></div>`;
      document.body.appendChild(dlg);
      const nIn = dlg.querySelector('#aqm-edit-name'), dIn = dlg.querySelector('#aqm-edit-date');
      nIn.value = name || ''; dIn.value = dateStr;
      const close = () => { dlg.remove(); document.removeEventListener('keydown', onKey, true); opener && opener.focus(); };
      const onKey = e => {
        if (e.key === 'Escape') { e.stopPropagation(); close(); }
        if (e.key === 'Tab') { const f = [...dlg.querySelectorAll('input,button')]; const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
      };
      document.addEventListener('keydown', onKey, true);
      dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
      dlg.querySelector('[data-x]').addEventListener('click', close);
      dlg.querySelector('[data-ok]').addEventListener('click', () => {
        if (!dIn.value) { dIn.focus(); return; }
        const nameIn = document.getElementById('m-name'), dateIn = document.getElementById('m-date');
        if (nameIn) nameIn.value = nIn.value; if (dateIn) dateIn.value = dIn.value;
        document.removeEventListener('keydown', onKey, true); dlg.remove();
        if (mf.requestSubmit) mf.requestSubmit(); else mf.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      });
      dIn.focus();
    });

    // بطاقة القصة: PNG 9:16 تُولَّد من الـ SVG الحالي
    host.querySelector('#aqm-btn-story')?.addEventListener('click', () => {
      try { exportStoryCard(host, P, displayName === 'مستخدم عقيق أسترو' ? '' : displayName, dateStr); }
      catch (err) { console.error(err); }
    });

    // التمرير إلى النتيجة
    host.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ==================== 5. ربط النموذج وتأصيل الأحداث ====================

  function initForm() {
    const form = document.querySelector('#mform');
    if (!form || form.dataset.aqmBound === 'true') return;
    form.dataset.aqmBound = 'true';

    form.addEventListener('submit', e => {
      e.preventDefault();
      const err = document.querySelector('#merr');
      if (err) err.hidden = true;

      const dateInput = document.querySelector('#m-date');
      const nameInput = document.querySelector('#m-name');
      const genderInput = document.querySelector('#m-gender');

      const v = dateInput ? dateInput.value : '';
      if (!v) {
        if (err) {
          err.textContent = 'اكتب تاريخ الميلاد.';
          err.hidden = false;
        }
        return;
      }

      const [y, m, d] = v.split('-').map(Number);
      if (y < 1900 || y > 2100) {
        if (err) {
          err.textContent = 'التاريخ لازم يكون بين 1900 و 2100.';
          err.hidden = false;
        }
        return;
      }
      if (new Date(y, m - 1, d) > new Date()) {
        if (err) {
          err.textContent = 'تاريخ الميلاد في المستقبل. راجع التاريخ.';
          err.hidden = false;
        }
        return;
      }

      const name = nameInput ? nameInput.value.trim() : '';
      const gender = genderInput ? genderInput.value : '';

      renderMatrixReport(v, name, gender);

      // تطبيق تخصيص الضمير والنسخ إن وُجد
      const resultHost = document.querySelector('#mresult');
      if (resultHost && window.AqeeqGender) {
        window.AqeeqGender.apply(resultHost, gender);
      }
      if (resultHost && window.AqeeqCopyMap) {
        window.AqeeqCopyMap.attach(resultHost, 'مصفوفة القدر · ' + (name || v));
      }
    });
  }

  // التصدير إلى النطاق العام
  const api = {
    render: renderMatrixReport,
    renderMatrixReport,
    generateMatrixSVG,
    build15Sections,
    build12Sections,
    // الحفاظ على توافق AqeeqNumerology
    calculateDestinyMatrix: date => {
      const eng = window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter;
      return eng ? eng.calculateDestinyMatrix(date) : null;
    },
    /**
     * @deprecated دالة مهجورة غير مستخدمة في واجهة التطبيق (Unused Legacy Export Stub).
     * المصدر الأساسي والوحيد المعتمد لحساب مسار الحياة الفعلي في عقيق أسترو هو دالة lifePath(d, m, y)
     * المعرفة داخل index.html (وفق منهج الجمع الكلي مع حفظ الأرقام الرئيسية 11 و 22 و 33 في الناتج النهائي).
     * تم الإبقاء على هذا التصدير الشكلي فقط لمنع أي كسر في التوافق القديم (Backwards Compatibility).
     */
    calculateLifePath: date => {
      const eng = window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter;
      return eng ? { number: eng.reduceArcana(new Date(date).getDate()) } : { number: 1 };
    },
    calculateChakraHealthCard: date => {
      const eng = window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter;
      return eng ? eng.calculateDestinyMatrix(date).chakras : null;
    }
  };

  const root = typeof window !== 'undefined' ? window : globalThis;
  api.axisPoints = axisPoints;
  api.geminiPositionHtml = geminiPositionHtml;
  api.geminiTailHtml = geminiTailHtml;
  api.diagonalPoints = diagonalPoints;
  root.AqeeqMatrixUI = api;
  root.AqeeqNumerology = Object.assign(root.AqeeqNumerology || {}, api);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm);
  } else {
    initForm();
  }
})();
