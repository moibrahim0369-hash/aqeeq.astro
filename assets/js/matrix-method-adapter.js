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
  function calculateDestinyMatrix(birthDate) {
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

    // 4. الخطوط الجيلية والأسلاف (Ancestral Lines):
    // خط الأب (Paternal): من F إلى H
    const fatherCombined = reduceArcana(F + H);
    // خط الأم (Maternal): من G إلى I
    const motherCombined = reduceArcana(G + I);
    // المركز الكارمي للأسلاف (Ancestral Center):
    const ancestralCenter = reduceArcana(fatherCombined + motherCombined);
    // المركز المشترك الإجمالي:
    const commonCenter = reduceArcana(ancestralCenter + E);

    // 5. نقاط المحاور المتقاطعة إلى المركز (Intermediate Axis Points):
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

    // 6. خطوط المال والعلاقات وقناة الوفرة (Love & Money Channel):
    // في منهج ناتاليا لاديني: الخط الممتد في الربع السفلي الأيمن:
    // - مدخل العلاقات (نقطة القلب Heart Point):
    const heartPoint = reduceArcana(E + D2);
    // - مدخل المال (نقطة الدولار Money Point):
    const moneyPoint = reduceArcana(E + C2);
    // - نقطة التوازن والالتقاء بين الحب والمال (Balance & Intersection Point):
    const balancePoint = reduceArcana(heartPoint + moneyPoint);

    // 7. غايات ومهام الحياة (The 4 Life Purposes / Tasks):
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

    // 8. خريطة دورات الأعمار (Age Cycles 0 - 80 years):
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

    // 9. طاقة السنة الحالية (Personal Year Energy):
    const currentYear = new Date().getFullYear();
    const yearEnergy = reduceArcana(A + B + reduceArcana(digitSum(currentYear)));

    // 10. جدول الشاكرات السبع (7 Chakras Energy Card):
    const chakras = {
      sahasrara: { name: 'التاج (Sahasrara)', symbol: '🟣', physics: A, energy: B, emotions: reduceArcana(A + B) },
      ajna: { name: 'العين الثالثة (Ajna)', symbol: '🔵', physics: A2, energy: B2, emotions: reduceArcana(A2 + B2) },
      vishuddha: { name: 'الحلق (Vishuddha)', symbol: '🔷', physics: reduceArcana(A + A2), energy: reduceArcana(B + B2), emotions: reduceArcana(reduceArcana(A + A2) + reduceArcana(B + B2)) },
      anahata: { name: 'القلب (Anahata)', symbol: '🟢', physics: reduceArcana(A2 + E), energy: reduceArcana(B2 + E), emotions: reduceArcana(reduceArcana(A2 + E) + reduceArcana(B2 + E)) },
      manipura: { name: 'الضفيرة الشمسية (Manipura)', symbol: '🟡', physics: E, energy: E, emotions: reduceArcana(E + E) },
      svadhisthana: { name: 'العجز (Svadhisthana)', symbol: '🟠', physics: reduceArcana(C2 + E), energy: reduceArcana(D2 + E), emotions: reduceArcana(reduceArcana(C2 + E) + reduceArcana(D2 + E)) },
      muladhara: { name: 'الجذر (Muladhara)', symbol: '🔴', physics: C, energy: D, emotions: reduceArcana(C + D) }
    };

    const chakraRows = Object.values(chakras);
    const totals = {
      physics: reduceArcana(chakraRows.reduce((acc, c) => acc + c.physics, 0)),
      energy: reduceArcana(chakraRows.reduce((acc, c) => acc + c.energy, 0)),
      emotions: reduceArcana(chakraRows.reduce((acc, c) => acc + c.emotions, 0))
    };
    totals.common = reduceArcana(totals.physics + totals.energy + totals.emotions);

    return {
      birthDate: { year, month, day },
      anchors: { A, B, C, D, E },
      corners: { F, G, H, I },
      nodes: {
        north: B, // في الإحداثيات الهندسية: B هي القمة (North)
        east: C,  // C هي اليمين (East)
        south: D, // D هي القاعدة (South)
        west: A,  // A هي اليسار (West)
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
      yearEnergy: { year: currentYear, number: yearEnergy },
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

  // ==================== 4. تصدير النظام ====================

  const adapterApi = {
    digitSum,
    reduceArcana,
    normalizeBirthDate,
    calculateDestinyMatrix,
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
