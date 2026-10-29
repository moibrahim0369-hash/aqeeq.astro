/**
 * Matrix Method Adapter | محول منهج مصفوفة القدر
 *
 * نقطة الربط الموحدة لكل حسابات مصفوفة القدر.
 * تطبيق Natalia Ladini (22 Arcana) بدقة رياضية.
 *
 * هذا الملف هو المصدر الوحيد لقاعدة الاختزال والمعادلات.
 * لا يجب تكرار هذه المعادلات في أماكن أخرى.
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
    // حلقة الاختزال: ما دام > 22، اجمع الخانات
    while (n > 22) {
      n = digitSum(n);
    }
    // حالة خاصة: إذا كان 0، أرجع 22
    return n || 22;
  }

  /**
   * التحقق من صحة تاريخ الميلاد
   * يقبل: Date، YYYY-MM-DD، أو كائن {year, month, day}
   */
  function normalizeBirthDate(value) {
    // حالة 1: Date object
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return {
        year: value.getFullYear(),
        month: value.getMonth() + 1,
        day: value.getDate()
      };
    }

    // حالة 2: String بصيغة YYYY-MM-DD
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
    if (!match) {
      throw new TypeError('تاريخ الميلاد مطلوب بصيغة YYYY-MM-DD أو Date object');
    }

    const [, y, m, d] = match.map(Number);

    // التحقق من صحة التاريخ
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
   *
   * المدخلات:
   *   - birthDate: تاريخ الميلاد (YYYY-MM-DD أو Date)
   *
   * المخرجات:
   *   - nodes: المواضع التسعة مع قيمها
   *   - anchors: الأرقام الأساسية (A, B, C, D, E)
   *   - generationalCorners: الزوايا الجيلية (F, G, H, I)
   *   - lines: خطوط المال والعلاقات
   *   - method: وصف المعادلة
   */
  function calculateDestinyMatrix(birthDate) {
    const { year, month, day } = normalizeBirthDate(birthDate);

    // المرحلة الأولى: اختزال المدخلات الأساسية
    const A = reduceArcana(day);           // الجوهر (يوم الميلاد)
    const B = reduceArcana(month);         // الاتصال الروحي (شهر الميلاد)
    const C = reduceArcana(digitSum(year)); // الذيل الكرمي (مجموع السنة)

    // المرحلة الثانية: الحسابات الثانوية
    const D = reduceArcana(A + B + C);        // التكامل
    const E = reduceArcana(A + B + C + D);    // المركز

    // المرحلة الثالثة: الزوايا الجيلية
    const F = reduceArcana(A + B);            // الشمال الشرقي (الموهبة)
    const G = reduceArcana(B + C);            // الجنوب الشرقي (العلاقات)
    const H = reduceArcana(C + D);            // الجنوب الغربي (الوفرة)
    const I = reduceArcana(D + A);            // الشمال الغربي (العاطفة)

    // الترتيب النهائي
    const nodes = {
      north: A,       // 0°
      northEast: F,   // 45°
      east: B,        // 90°
      southEast: G,   // 135°
      south: C,       // 180°
      southWest: H,   // 225°
      west: D,        // 270°
      northWest: I,   // 315°
      center: E       // المركز
    };

    // الخطوط الرمزية
    const lines = {
      money: [F, E, H],    // الشمال الشرقي ← المركز ← الجنوب الغربي
      love: [I, E, G]      // الشمال الغربي ← المركز ← الجنوب الشرقي
    };

    return {
      nodes,
      anchors: { A, B, C, D, E },
      generationalCorners: { F, G, H, I },
      lines,
      method: `A=${A} (يوم)، B=${B} (شهر)، C=${C} (سنة)
D=R(${A}+${B}+${C})=${D} (تكامل)
E=R(${A}+${B}+${C}+${D})=${E} (مركز)
F=R(${A}+${B})=${F}، G=R(${B}+${C})=${G}، H=R(${C}+${D})=${H}، I=R(${D}+${A})=${I}`
    };
  }

  /**
   * حساب الخطوط الجيلية (الأب والأم)
   */
  function calculateGenerationalLines(birthDate) {
    const matrix = calculateDestinyMatrix(birthDate);
    const { F, G, H, I } = matrix.generationalCorners;
    const E = matrix.anchors.E;

    return {
      paternal: {
        name: 'خط الأب (الذكور)',
        points: [F, E, H],
        combined: reduceArcana(F + H)
      },
      maternal: {
        name: 'خط الأم (الإناث)',
        points: [G, E, I],
        combined: reduceArcana(G + I)
      }
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
    const socialization = reduceArcana(lines.paternal.combined + lines.maternal.combined);
    const spiritualExam = reduceArcana(soulSearching + socialization);

    return {
      sky: skyLine,
      earth: earthLine,
      soulSearching,
      paternal: lines.paternal.combined,
      maternal: lines.maternal.combined,
      socialization,
      spiritualExam,
      planetary: reduceArcana(socialization + spiritualExam)
    };
  }

  // ==================== المعلومات المرجعية ====================

  /**
   * معلومات الـ 22 Arcana
   * كل أركانا لها ثلاث طبقات: الإيجابية، والحيادية (الضعيفة)
   */
  const ARCANA_DATA = [
    // 1. السحر (The Magician)
    {
      id: 1,
      name: 'السحر',
      en: 'The Magician',
      positive: 'المبادرة والاستقلال والقيادة',
      shadow: 'الاندفاع أو التشتت'
    },
    // 2. البابية (The High Priestess)
    {
      id: 2,
      name: 'البابية',
      en: 'The High Priestess',
      positive: 'المعرفة والحدس والإنصات',
      shadow: 'الكتمان أو التردد'
    },
    // 3. الإمبراطورة (The Empress)
    {
      id: 3,
      name: 'الإمبراطورة',
      en: 'The Empress',
      positive: 'النمو والرعاية والاحتواء',
      shadow: 'الإفراط في السيطرة'
    },
    // 4. الإمبراطور (The Emperor)
    {
      id: 4,
      name: 'الإمبراطور',
      en: 'The Emperor',
      positive: 'النظام والمسؤولية والتنظيم',
      shadow: 'الجمود أو التشدد'
    },
    // 5. الحبر (The Hierophant)
    {
      id: 5,
      name: 'الحبر',
      en: 'The Hierophant',
      positive: 'التعلم والقيم والحكمة',
      shadow: 'الوعظ أو التعلق بالقواعد'
    },
    // 6. العاشقان (The Lovers)
    {
      id: 6,
      name: 'العاشقان',
      en: 'The Lovers',
      positive: 'الاختيار والانسجام والتقارب',
      shadow: 'إرضاء الآخرين'
    },
    // 7. المركبة (The Chariot)
    {
      id: 7,
      name: 'المركبة',
      en: 'The Chariot',
      positive: 'الحركة والتقدم والشجاعة',
      shadow: 'الاستعجال أو الصراع'
    },
    // 8. القوة (Strength)
    {
      id: 8,
      name: 'القوة',
      en: 'Strength',
      positive: 'العدل والتوازن والإنصاف',
      shadow: 'القسوة في الحكم'
    },
    // 9. الناسك (The Hermit)
    {
      id: 9,
      name: 'الناسك',
      en: 'The Hermit',
      positive: 'التأمل والخبرة والصبر',
      shadow: 'العزلة أو الانغلاق'
    },
    // 10. عجلة الثروة (Wheel of Fortune)
    {
      id: 10,
      name: 'عجلة الثروة',
      en: 'Wheel of Fortune',
      positive: 'الدورات والفرص والمرونة',
      shadow: 'الانتظار السلبي للحظ'
    },
    // 11. العدل (Justice)
    {
      id: 11,
      name: 'العدل',
      en: 'Justice',
      positive: 'القوة والاتزان والضبط',
      shadow: 'الكبت أو الإنهاك'
    },
    // 12. المشنوق (The Hanged Man)
    {
      id: 12,
      name: 'المشنوق',
      en: 'The Hanged Man',
      positive: 'تغيير المنظور والتأني',
      shadow: 'تعليق القرار'
    },
    // 13. الموت (Death)
    {
      id: 13,
      name: 'الموت',
      en: 'Death',
      positive: 'التحول والتجدد وترك القديم',
      shadow: 'مقاومة التغيير'
    },
    // 14. الاعتدال (Temperance)
    {
      id: 14,
      name: 'الاعتدال',
      en: 'Temperance',
      positive: 'التوازن والمواءمة والتدرج',
      shadow: 'تأجيل الاحتياجات'
    },
    // 15. الشيطان (The Devil)
    {
      id: 15,
      name: 'الشيطان',
      en: 'The Devil',
      positive: 'الاختيار الواعي والملاحظة',
      shadow: 'التعلق أو الإفراط'
    },
    // 16. البرج (The Tower)
    {
      id: 16,
      name: 'البرج',
      en: 'The Tower',
      positive: 'التحرر من البنى القديمة والكشف',
      shadow: 'الهدم بلا خطة'
    },
    // 17. النجمة (The Star)
    {
      id: 17,
      name: 'النجمة',
      en: 'The Star',
      positive: 'الأمل والإلهام والثقة',
      shadow: 'المثالية أو التشتت'
    },
    // 18. القمر (The Moon)
    {
      id: 18,
      name: 'القمر',
      en: 'The Moon',
      positive: 'الحدس والخيال والتعاطف',
      shadow: 'الضبابية أو الإسقاط'
    },
    // 19. الشمس (The Sun)
    {
      id: 19,
      name: 'الشمس',
      en: 'The Sun',
      positive: 'الوضوح والحيوية والدفء',
      shadow: 'الاستنزاف أو المبالغة'
    },
    // 20. النداء (Judgement)
    {
      id: 20,
      name: 'النداء',
      en: 'Judgement',
      positive: 'المراجعة والتعلم من الماضي',
      shadow: 'لوم الذات'
    },
    // 21. العالم (The World)
    {
      id: 21,
      name: 'العالم',
      en: 'The World',
      positive: 'الاكتمال والاندماج والاتساع',
      shadow: 'التشتت قبل الإغلاق'
    },
    // 22. المجنون (The Fool)
    {
      id: 22,
      name: 'المجنون',
      en: 'The Fool',
      positive: 'البدايات المفتوحة والفضول',
      shadow: 'المخاطرة بدون تقدير'
    }
  ];

  /**
   * الحصول على معلومات أركانا
   */
  function getArcanaInfo(arcanaNumber) {
    const arcana = ARCANA_DATA.find(a => a.id === arcanaNumber);
    if (!arcana) {
      throw new RangeError(`رقم الأركانا يجب أن يكون من 1 إلى 22، حصلت على: ${arcanaNumber}`);
    }
    return arcana;
  }

  // ==================== التصدير ====================

  window.AqeeqMatrixMethodAdapter = {
    // الدوال الأساسية
    reduceArcana,
    digitSum,
    normalizeBirthDate,

    // حسابات المصفوفة
    calculateDestinyMatrix,
    calculateGenerationalLines,
    calculateDestinyAxes,

    // المعلومات
    getArcanaInfo,
    ARCANA_DATA,

    // الإصدار والمعلومات
    version: '1.0.0',
    method: 'Natalia Ladini (22 Arcana)',
    lastUpdated: '2026-10-29',

    // اختبار سريع
    test() {
      const result = this.calculateDestinyMatrix('1999-09-25');
      console.log('✅ Matrix Method Adapter loaded successfully');
      console.log('📊 Test calculation for 25/9/1999:', result.nodes);
      return result;
    }
  };

  // تهيئة عند التحميل
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (window.AqeeqMatrixMethodAdapter) {
        console.log('🔧 Matrix Method Adapter initialized');
      }
    });
  }
})();
