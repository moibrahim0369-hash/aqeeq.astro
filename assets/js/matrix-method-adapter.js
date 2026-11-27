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
      sahasrara: chakraRow('التاج', '<i style="color:#7d5a9e;font-style:normal">●</i>', A, B),
      ajna: chakraRow('العين الثالثة', '<i style="color:#4f5d95;font-style:normal">●</i>', aT.x2, bT.x2),
      vishuddha: chakraRow('الحلق', '<i style="color:#4f86a8;font-style:normal">●</i>', aT.x1, bT.x1),
      anahata: chakraRow('القلب', '<i style="color:#5d8a63;font-style:normal">●</i>', aT.x3, bT.x3),
      manipura: chakraRow('الضفيرة الشمسية', '<i style="color:#c4a03a;font-style:normal">●</i>', E, E),
      svadhisthana: chakraRow('العجز', '<i style="color:#c47a3a;font-style:normal">●</i>', C2, D2),
      muladhara: chakraRow('الجذر', '<i style="color:#9e3b32;font-style:normal">●</i>', C, D)
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
