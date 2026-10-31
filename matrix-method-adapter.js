/**
 * Matrix Method Adapter | محول منهج مصفوفة القدر
 *
 * نقطة الربط الموحدة لكل حسابات مصفوفة القدر.
 * تطبيق Natalia Ladini (22 Arcana) بدقة رياضية.
 *
 * هذا الملف هو المصدر الموحد لقاعدة الاختزال والمعادلات.
 */

(() => {
  'use strict';

  // ==================== المعادلات الأساسية ====================

  /**
   * حساب مجموع خانات العدد
   * 123 → 1+2+3 = 6
   */
  function digitSum(value) {
    return String(Math.abs(Math.trunc(value)))
      .split('')
      .reduce((sum, digit) => sum + Number(digit), 0);
  }

  /**
   * قاعدة الاختزال الوحيدة للمصفوفة
   * النطاق: 1 إلى 22 (محفوظ)
   *
   * الصيغة:
   * R(n) = الاختزال بجمع الخانات حتى الوصول إلى 1–22
   */
  function reduceArcana(value) {
    let n = Math.abs(Math.trunc(value));
    while (n > 22) {
      n = digitSum(n);
    }
    return n || 22;
  }

  /**
   * اختزال مسار الحياة (1 إلى 9 مع استثناء الأرقام الرئيسية 11, 22, 33)
   */
  function reduceLifePath(value) {
    let n = Math.abs(Math.trunc(value));
    while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
      n = digitSum(n);
    }
    return n;
  }

  /**
   * التحقق من صحة تاريخ الميلاد
   * يقبل: Date، YYYY-MM-DD، أو كائن {year, month, day}
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

  // ==================== حسابات المصفوفة ====================

  /**
   * حساب مصفوفة القدر الكاملة (9 مواضع)
   */
  function calculateDestinyMatrix(birthDate) {
    const { year, month, day } = normalizeBirthDate(birthDate);

    // المرحلة الأولى: اختزال المدخلات الأساسية
    const A = reduceArcana(day);            // الجوهر (يوم الميلاد)
    const B = reduceArcana(month);          // الاتصال الروحي (شهر الميلاد)
    const C = reduceArcana(digitSum(year));  // الذيل الكرمي (مجموع السنة)

    // المرحلة الثانية: الحسابات الثانوية
    const D = reduceArcana(A + B + C);         // التكامل
    const E = reduceArcana(A + B + C + D);     // المركز

    // المرحلة الثالثة: الزوايا الجيلية
    const F = reduceArcana(A + B);             // الشمال الشرقي (الموهبة)
    const G = reduceArcana(B + C);             // الجنوب الشرقي (العلاقات)
    const H = reduceArcana(C + D);             // الجنوب الغربي (الوفرة)
    const I = reduceArcana(D + A);             // الشمال الغربي (العاطفة)

    // الترتيب المتوافق مع الفهارس والمحاور
    const nodes = {
      north: A,
      east: B,
      south: C,
      west: D,
      northEast: F,
      southEast: G,
      southWest: H,
      northWest: I,
      center: E
    };

    // الخطوط الرمزية
    const lines = {
      money: [F, E, H],
      love: [I, E, G]
    };

    const ancestralCenter = reduceArcana(reduceArcana(F + H) + reduceArcana(G + I));
    const commonCenter = reduceArcana(ancestralCenter + E);

    return {
      nodes,
      anchors: { A, B, C, D, E },
      generationalCorners: { F, G, H, I },
      lines,
      ancestralCenter,
      commonCenter,
      method: `A=${A} (يوم)، B=${B} (شهر)، C=${C} (سنة)\nD=R(${A}+${B}+${C})=${D} (تكامل)\nE=R(${A}+${B}+${C}+${D})=${E} (مركز)\nF=R(${A}+${B})=${F}، G=R(${B}+${C})=${G}، H=R(${C}+${D})=${H}، I=R(${D}+${A})=${I}`
    };
  }

  /**
   * حساب الخطوط الجيلية (الأب والأم)
   */
  function calculateGenerationalLines(birthDate) {
    const matrix = calculateDestinyMatrix(birthDate);
    const { F, G, H, I } = matrix.generationalCorners;
    const E = matrix.anchors.E;

    const maleComb = reduceArcana(F + H);
    const femaleComb = reduceArcana(G + I);

    const paternal = {
      name: 'Paternal Line · خط الذكور (الأب)',
      points: [F, E, H],
      summary: [F, H, maleComb],
      combined: maleComb
    };

    const maternal = {
      name: 'Maternal Line · خط الإناث (الأم)',
      points: [G, E, I],
      summary: [G, I, femaleComb],
      combined: femaleComb
    };

    return {
      paternal,
      maternal,
      male: paternal,
      female: maternal,
      ancestralCenter: matrix.ancestralCenter,
      commonCenter: matrix.commonCenter
    };
  }

  /**
   * حساب محاور الحياة الأربع
   */
  function calculateDestinyAxes(birthDate) {
    const matrix = calculateDestinyMatrix(birthDate);
    const lines = calculateGenerationalLines(birthDate);
    const { A, B, C, D } = matrix.anchors;

    const skyLine = [B, D, reduceArcana(B + D)];
    const earthLine = [A, C, reduceArcana(A + C)];

    const soulSearching = reduceArcana(skyLine[2] + earthLine[2]);
    const socialization = reduceArcana(lines.male.combined + lines.female.combined);
    const spiritualExam = reduceArcana(soulSearching + socialization);
    const planetary = reduceArcana(socialization + spiritualExam);

    return {
      sky: skyLine,
      earth: earthLine,
      soulSearching,
      socialization,
      spiritualExam,
      governingEnergy: spiritualExam,
      planetary,
      male: lines.male.combined,
      female: lines.female.combined,
      paternal: lines.paternal.combined,
      maternal: lines.maternal.combined
    };
  }

  /**
   * حساب شامل للمصفوفة ومسار الحياة معاً
   */
  function calculate(birthDate) {
    const norm = normalizeBirthDate(birthDate);
    const res = calculateDestinyMatrix(norm);
    const lpNumber = reduceLifePath(norm.day + norm.month + digitSum(norm.year));
    res.lifePath = { number: lpNumber };
    return res;
  }

  // ==================== المعلومات المرجعية ====================

  const ARCANA_DATA = [
    { id: 1, name: 'الساحر', en: 'The Magician', positive: 'البداية والإرادة والمبادرة والابتكار', shadow: 'الاندفاع أو التشتت' },
    { id: 2, name: 'الكاهنة العظمى', en: 'The High Priestess', positive: 'المعرفة والحدس والإنصات والوعي الداخلي', shadow: 'الكتمان أو التردد' },
    { id: 3, name: 'الإمبراطورة', en: 'The Empress', positive: 'النمو والرعاية والإبداع والوفرة', shadow: 'الإفراط في السيطرة' },
    { id: 4, name: 'الإمبراطور', en: 'The Emperor', positive: 'النظام والمسؤولية والثبات والتنظيم', shadow: 'الجمود أو التشدد' },
    { id: 5, name: 'الكاهن الأعظم', en: 'The Hierophant', positive: 'التعلم والقيم والحكمة ومشاركة الخبرة', shadow: 'الوعظ أو التعلق بالقواعد' },
    { id: 6, name: 'العشاق', en: 'The Lovers', positive: 'الاختيار والانسجام والتقارب ووضوح القيم', shadow: 'إرضاء الآخرين على حساب الذات' },
    { id: 7, name: 'العربة', en: 'The Chariot', positive: 'الحركة والتقدم والشجاعة وتوجيه الطاقة', shadow: 'الاستعجال أو الصراع' },
    { id: 8, name: 'القوة', en: 'Strength', positive: 'العدل والإنصاف والاتزان والوضوح', shadow: 'القسوة في الحكم أو التردد' },
    { id: 9, name: 'الناسك', en: 'The Hermit', positive: 'التأمل والخبرة والصبر والاستقلال', shadow: 'العزلة أو الانغلاق' },
    { id: 10, name: 'عجلة الحظ', en: 'Wheel of Fortune', positive: 'الدورات والفرص والمرونة والاستعداد للتغيير', shadow: 'الانتظار السلبي للحظ' },
    { id: 11, name: 'العدالة', en: 'Justice', positive: 'القوة الهادئة والشجاعة وضبط النفس', shadow: 'الكبت أو الإنهاك' },
    { id: 12, name: 'المشنوق', en: 'The Hanged Man', positive: 'تغيير المنظور والتأني والرؤية المختلفة', shadow: 'تعليق القرار أو التضحية غير المتوازنة' },
    { id: 13, name: 'الموت', en: 'Death', positive: 'التحول والتجدد وترك ما انتهى', shadow: 'مقاومة التغيير' },
    { id: 14, name: 'الاعتدال', en: 'Temperance', positive: 'التوازن والمواءمة والتدرج', shadow: 'تأجيل الاحتياجات' },
    { id: 15, name: 'الشيطان', en: 'The Devil', positive: 'الاختيار الواعي واستعادة الحرية الداخلية', shadow: 'التعلق أو الإفراط' },
    { id: 16, name: 'البرج', en: 'The Tower', positive: 'التحرر من البنى القديمة وكشف الحقيقة', shadow: 'الهدم بلا خطة' },
    { id: 17, name: 'النجمة', en: 'The Star', positive: 'الأمل والإلهام والرؤية البعيدة والثقة', shadow: 'المثالية المفرطة أو التشتت' },
    { id: 18, name: 'القمر', en: 'The Moon', positive: 'الحدس والمشاعر والخيال والعمق النفسي', shadow: 'الضبابية أو الإسقاط' },
    { id: 19, name: 'الشمس', en: 'The Sun', positive: 'الوضوح والحيوية والتعبير والدفء والنجاح', shadow: 'الاستنزاف أو المبالغة' },
    { id: 20, name: 'البعث', en: 'Judgement', positive: 'المراجعة والنداء الداخلي والتعلم من الماضي', shadow: 'لوم الذات أو التردد' },
    { id: 21, name: 'العالم', en: 'The World', positive: 'الاكتمال والاندماج وإغلاق المراحل والاتساع', shadow: 'التشتت قبل الإغلاق' },
    { id: 22, name: 'الأحمق', en: 'The Fool', positive: 'البدايات المفتوحة والفضول والحرية والتجربة', shadow: 'المخاطرة غير المدروسة' }
  ];

  function getArcanaInfo(arcanaNumber) {
    const id = Number(arcanaNumber);
    const arcana = ARCANA_DATA.find(a => a.id === id);
    if (!arcana) {
      throw new RangeError(`رقم الأركانا يجب أن يكون من 1 إلى 22، حصلت على: ${arcanaNumber}`);
    }
    return arcana;
  }

  // ==================== التصدير الموحد ====================

  const adapterApi = {
    // المعادلات
    reduceArcana,
    reduceLifePath,
    digitSum,
    normalizeBirthDate,

    // حسابات المصفوفة
    calculateDestinyMatrix,
    calculateGenerationalLines,
    calculateDestinyAxes,
    calculate,

    // المعلومات
    getArcanaInfo,
    getArcana: getArcanaInfo,
    ARCANA_DATA,

    // ميتاداتا
    version: '1.1.0',
    method: 'Natalia Ladini (22 Arcana)',
    lastUpdated: '2026-10-31',
    isLoaded: true,

    test() {
      const result = this.calculateDestinyMatrix('1999-09-25');
      return result;
    }
  };

  const root = typeof window !== 'undefined' ? window : globalThis;
  root.AqeeqMatrixMethodAdapter = adapterApi;
  root.MatrixMethodAdapter = adapterApi;
  root.matrixMethodAdapter = adapterApi;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = adapterApi;
  }

  if (typeof document !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (root.AqeeqMatrixMethodAdapter) {
        console.log('🔧 Matrix Method Adapter initialized');
      }
    });
  }
})();
