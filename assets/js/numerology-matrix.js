(() => {
  'use strict';

  if (typeof SVGElement !== 'undefined' && typeof SVGElement.prototype.click !== 'function') {
    SVGElement.prototype.click = function() {
      this.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    };
  }
  const SIGNS = ['الحمل','الثور','الجوزاء','السرطان','الأسد','العذراء','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'];
  const MASTER = new Set([11,22,33]);
  const LIFE_PATH_DATA = window.AqeeqLifePathData || {};
  const DESTINY_DATA = window.AqeeqDestinyMatrixData || {};
  const AGE_MAP_API = window.AqeeqAgeMap || {};

  const ARCANA = [
    ['البداية والإرادة','مبادرة وابتكار','اندفاع أو تشتت'],
    ['المعرفة والحدس','إنصات ووعي داخلي','كتمان أو تردد'],
    ['النمو والرعاية','إبداع واحتواء','إفراط في السيطرة'],
    ['النظام والمسؤولية','ثبات وتنظيم','جمود أو تشدد'],
    ['التعلم والقيم','حكمة ومشاركة خبرة','وعظ أو تعلق بالقواعد'],
    ['الاختيار والانسجام','تقارب ووضوح قيم','إرضاء الآخرين'],
    ['الحركة والتقدم','شجاعة وتوجيه للطاقة','استعجال أو صراع'],
    ['العدل والتوازن','إنصاف واتزان','قسوة في الحكم'],
    ['التأمل والخبرة','صبر واستقلال','عزلة أو انغلاق'],
    ['الدورات والفرص','مرونة واستعداد للتغيير','انتظار الحظ'],
    ['القوة والاتزان','شجاعة هادئة وضبط للنفس','كبت أو إنهاك'],
    ['تغيير المنظور','تأنٍ ورؤية مختلفة','تعليق القرار'],
    ['التحول والتجدد','ترك ما انتهى','مقاومة التغيير'],
    ['الاعتدال والمواءمة','توازن وتدرج','تأجيل الاحتياجات'],
    ['الاختيار الواعي','ملاحظة التعلق واستعادة الحرية','تعلق أو إفراط'],
    ['التحرر من البنى القديمة','كشف ما يحتاج إلى إصلاح','هدم بلا خطة'],
    ['المراجعة وإعادة البناء','تعلم من التغيير','خوف من فقد السيطرة'],
    ['الأمل والإلهام','ثقة هادئة ورؤية بعيدة','مثالية أو تشتت'],
    ['الحدس والمشاعر','خيال وتعاطف مع التحقق','ضبابية أو إسقاط'],
    ['الوضوح والحيوية','تعبير ودفء','استنزاف أو مبالغة'],
    ['المراجعة والنداء الداخلي','تعلم من الماضي','لوم الذات'],
    ['الاكتمال والاندماج','إغلاق مرحلة واتساع الأفق','تشتت قبل الإغلاق'],
    ['البدايات المفتوحة','فضول وتجربة','مخاطرة دون تقدير']
  ];

  const normDate = value => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return {year:value.getFullYear(),month:value.getMonth()+1,day:value.getDate()};
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
    if (!match) throw new TypeError('تاريخ الميلاد مطلوب بصيغة YYYY-MM-DD');
    const [,y,m,d] = match.map(Number);
    const check = new Date(Date.UTC(y,m-1,d));
    if (check.getUTCFullYear()!==y || check.getUTCMonth()!==m-1 || check.getUTCDate()!==d) throw new RangeError('تاريخ الميلاد غير صالح');
    return {year:y,month:m,day:d};
  };

  function digitSum(value) { return String(Math.abs(Math.trunc(value))).split('').reduce((sum,digit)=>sum+Number(digit),0); }
  function reduceLifePath(value) { let n=Math.abs(Math.trunc(value)); while(n>9&&!MASTER.has(n)) n=digitSum(n); return n; }
  
  function calculateLifePath(birthDate) {
    const {year,month,day}=normDate(birthDate);
    const components=[reduceLifePath(day),reduceLifePath(month),reduceLifePath(digitSum(year))];
    return {number:reduceLifePath(components.reduce((a,b)=>a+b,0)),components};
  }

  function reduceArcana(value) { let n=Math.abs(Math.trunc(value)); while(n>22) n=digitSum(n); return n || 22; }

  function calculateDestinyMatrix(birthDate) {
    const {year,month,day}=normDate(birthDate);
    // A=day, B=month, C=year; D=A+B+C; E=A+B+C+D. R preserves 1..22.
    const A=reduceArcana(day), B=reduceArcana(month), C=reduceArcana(digitSum(year));
    const D=reduceArcana(A+B+C), E=reduceArcana(A+B+C+D);
    const F=reduceArcana(A+B), G=reduceArcana(B+C), H=reduceArcana(C+D), I=reduceArcana(D+A);
    const ancestralCenter=reduceArcana(F+G+H+I), commonCenter=reduceArcana(E+ancestralCenter);

    // حساب ثلاثية الذيل الكارمي السفلية
    const karmicBase = D;
    const karmicMid = reduceArcana(D + E);
    const karmicInner = reduceArcana(D + karmicMid);
    const karmicTail = {
      base: karmicBase,
      mid: karmicMid,
      inner: karmicInner,
      triplet: [karmicBase, karmicMid, karmicInner],
      code: `${karmicBase}-${karmicMid}-${karmicInner}`
    };

    // حساب قنوات المال والعلاقات
    const moneyEntry = reduceArcana(E + C);
    const loveEntry = reduceArcana(E + karmicInner);
    const balancePoint = reduceArcana(moneyEntry + loveEntry);

    const channels = {
      money: moneyEntry,
      love: loveEntry,
      balance: balancePoint
    };

    const nodes={north:A,east:B,south:C,west:D,northEast:F,southEast:G,southWest:H,northWest:I,center:E};
    return {
      nodes,
      anchors:{A,B,C,D,E},
      generationalCorners:{F,G,H,I},
      ancestralCenter,
      commonCenter,
      karmicTail,
      channels,
      lines:{money:['northEast','center','southWest'],love:['northWest','center','southEast']},
      formula:'A=اليوم، B=الشهر، C=مجموع أرقام السنة؛ D=R(A+B+C)، E=R(A+B+C+D). زوايا مربع الأسلاف F=R(A+B)، G=R(B+C)، H=R(C+D)، I=R(D+A). كل R تختزل بجمع الأرقام عند تجاوز 22.'
    };
  }

  function calculateChakraHealthCard(birthDate) {
    const {A,B,C,D,E}=calculateDestinyMatrix(birthDate).anchors, R=reduceArcana;
    const throatPhysics=R(A+E), throatEnergy=R(B+E);
    const rows=[
      {key:'sahasrara',name:'التاج',sanskrit:'Sahasrara',physics:A,energy:B,focus:'المعنى والرسالة التي يختارها الإنسان لنفسه',area:'الرأس والأعصاب العليا',balance:'الراحة والتأمل الهادئ وربط الفكرة بخطوة واقعية.'},
      {key:'ajna',name:'العين الثالثة',sanskrit:'Ajna',physics:R(A+throatPhysics),energy:R(B+throatEnergy),focus:'الرؤية الفكرية والحدس مع التحقق من الافتراضات',area:'الجبهة والعينان',balance:'كتابة ما تعرفه وما تفترضه ثم التحقق من معلومة.'},
      {key:'vishuddha',name:'الحنجرة',sanskrit:'Vishuddha',physics:throatPhysics,energy:throatEnergy,focus:'التعبير والإبداع والإنصات المتبادل',area:'الحلق والصوت والرقبة',balance:'صياغة الاحتياج بوضوح والاستماع دون استعجال الرد.'},
      {key:'anahata',name:'القلب',sanskrit:'Anahata',physics:R(throatPhysics+E),energy:R(throatEnergy+E),focus:'العلاقات والحدود وصورة العالم',area:'الصدر والتنفس والقلب',balance:'موازنة التعاطف مع حدود واضحة وطلب الدعم عند الحاجة.'},
      {key:'manipura',name:'الضفيرة الشمسية',sanskrit:'Manipura',physics:E,energy:E,focus:'الاختيار والمسؤولية والموارد',area:'أعلى البطن والمعدة',balance:'تقسيم المهمة إلى خطوة يمكن التحكم بها اليوم.'},
      {key:'svadhisthana',name:'العجز',sanskrit:'Svadhisthana',physics:R(C+E),energy:R(D+E),focus:'الشغف والمتعة والإبداع والحميمية',area:'الحوض والأعضاء التناسلية',balance:'إتاحة نشاط ممتع وآمن دون تحويله إلى واجب.'},
      {key:'muladhara',name:'الجذر',sanskrit:'Muladhara',physics:C,energy:D,focus:'الأمان العملي والروتين والدعم والأرض',area:'الساقان والقدمان والعظام',balance:'اختيار ترتيب عملي صغير يمنح اليوم وضوحاً واستقراراً.'}
    ].map(row=>({...row,emotions:R(row.physics+row.energy)}));
    const total={physics:R(rows.reduce((sum,row)=>sum+row.physics,0)),energy:R(rows.reduce((sum,row)=>sum+row.energy,0)),emotions:R(rows.reduce((sum,row)=>sum+row.emotions,0))};
    return {rows,total,totalLabel:'Common Energy-Zone',anchors:{A,B,C,D,E},method:'حُسبت الحنجرة قبل العين الثالثة والقلب. عمود المشاعر ناتج جمع الجسد والطاقة لكل صف؛ القيم رمزية وليست قياساً حيوياً أو تشخيصاً.'};
  }

  function calculateGenerationalLines(birthDate) {
    const matrix=calculateDestinyMatrix(birthDate), {F,G,H,I}=matrix.generationalCorners, E=matrix.anchors.E, R=reduceArcana;
    return {male:{name:'خط الذكور · الأب',points:[F,E,H],summary:[F,H,R(F+H)],combined:R(F+H)},female:{name:'خط الإناث · الأم',points:[G,E,I],summary:[G,I,R(G+I)],combined:R(G+I)},ancestralCenter:matrix.ancestralCenter,commonCenter:matrix.commonCenter};
  }

  function calculateDestinyAxes(birthDate) {
    const matrix=calculateDestinyMatrix(birthDate), lines=calculateGenerationalLines(birthDate), {A,B,C,D}=matrix.anchors, R=reduceArcana;
    const sky=[B,D,R(B+D)], earth=[A,C,R(A+C)];
    const soulSearching=R(sky[2]+earth[2]), socialization=R(lines.male.combined+lines.female.combined);
    const spiritualExam=R(soulSearching+socialization), planetary=R(socialization+spiritualExam);
    return {sky,earth,soulSearching,male:lines.male.combined,female:lines.female.combined,socialization,spiritualExam,governingEnergy:spiritualExam,planetary};
  }

  const lifeTraits = n => {
    const traits={1:['المبادرة','الاستقلال','القيادة'],2:['التعاون','الإنصات','الحساسية'],3:['التعبير','الإبداع','التواصل'],4:['التنظيم','الثبات','البناء'],5:['المرونة','الفضول','التجربة'],6:['الرعاية','الانسجام','المسؤولية'],7:['التأمل','البحث','التحليل'],8:['الإدارة','الإنجاز','الطموح'],9:['التعاطف','الحكمة','خدمة الآخرين'],11:['الإلهام','الحدس','الرؤية'],22:['البناء الكبير','التخطيط','الأثر العملي'],33:['التعليم','الرعاية','الإلهام']};
    return traits[n] || traits[reduceLifePath(n)] || traits[1];
  };

  const escapeHTML = s => String(s == null ? '' : s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  
  const labels={
    north:'الجوهر · يوم الميلاد',
    northEast:'موهبة مركبة · المال',
    east:'الاتصال الروحي · شهر الميلاد',
    southEast:'خط العلاقات',
    south:'الدروس · سنة الميلاد',
    southWest:'مسار الوفرة',
    west:'تكامل المحاور · الكارما',
    northWest:'مساحة العاطفة',
    center:'المحور المركزي · راحة الروح'
  };

  /**
   * رسم النجمة الثمانية ومصفوفة القدر (SVG)
   * مطابقة للألوان السبعة ومسارات الحب والمال وطوق العمر 0-80 سنة
   */
  /**
   * رسم النجمة الثمانية ومصفوفة القدر (SVG)
   * مطابقة تامة 100% للهيكل السلافي القياسي (matrix-destiny.com):
   * 1. شبكة الدوائر الداخلية بالكامل (25 دائرة هندسية مرقمة وملونة).
   * 2. خطوط السلالة مع الأسهم والنصوص (male generation line / female generation line).
   * 3. خط المال والحب المتقاطع مع أيقونات القلب والدولار ودائرة التقاطع المشتركة.
   * 4. حلقة محيط العمر الخارجي (0 - 80 سنة) بنصوص واضحة وتفاصيل السنين المصغرة.
   * 5. viewBox محكم ومحمي من أي بتر (0 0 800 800).
   */
  function renderSVG(matrix, dateValue) {
    const num = matrix.nodes;
    const { A, B, C, D, E } = matrix.anchors;
    const { F, G, H, I } = matrix.generationalCorners;
    const R = reduceArcana;

    const karmicBase = matrix.karmicTail.base;
    const karmicMid = matrix.karmicTail.mid;
    const karmicInner = matrix.karmicTail.inner;

    const channels = matrix.channels || { money: 0, love: 0, balance: 0 };
    const moneyEntry = channels.money;
    const loveEntry = channels.love;
    const balancePoint = channels.balance;

    // حساب خريطة سنوات العمر وموقع السن الحالي
    const ageApi = window.AqeeqAgeMap || {};
    const ageMap = (typeof ageApi.calculateAgeMap === 'function')
      ? ageApi.calculateAgeMap(matrix.anchors, matrix.generationalCorners)
      : {};
    const ageInfo = (typeof ageApi.getCurrentAgeEnergy === 'function')
      ? ageApi.getCurrentAgeEnergy(dateValue)
      : { exactAge: 0, milestone: 0 };
    const currentMilestone = Number(ageInfo.milestone) || 0;

    // مركز الدائرة وأبعاد الـ SVG
    const cx = 400, cy = 400;
    const rMain = 195; // نصف قطر أطراف المربع الشخصي المستقيم
    const rDiag = 190; // نصف قطر أطراف مربع الأسلاف المائل 45°
    const dX = Math.round(rDiag * Math.SQRT1_2); // ~134
    const dY = Math.round(rDiag * Math.SQRT1_2); // ~134

    // أطراف المربع الشخصي (Personal Square)
    const north = [cx, cy - rMain];           // (400, 205) شهر الميلاد B
    const east = [cx + rMain, cy];            // (595, 400) سنة الميلاد C
    const south = [cx, cy + rMain];           // (400, 595) الذيل الكارمي D
    const west = [cx - rMain, cy];            // (205, 400) يوم الميلاد A

    // أطراف مربع الأسلاف المائل 45° (Ancestral Square)
    const northWest = [cx - dX, cy - dY];     // (266, 266) سلالة الأب F
    const northEast = [cx + dX, cy - dY];     // (534, 266) سلالة الأم G
    const southEast = [cx + dX, cy + dY];     // (534, 534) كارما المادة للأم H
    const southWest = [cx - dX, cy + dY];     // (266, 534) كارما المادة للأب I

    // المركز (راحة الروح)
    const center = [cx, cy];                  // (400, 400) E

    // نقاط متوسطة على أقطار الأسلاف المائلة 45°
    const dX_mid = Math.round(dX * 0.52);     // ~70
    const dY_mid = Math.round(dY * 0.52);     // ~70
    const northWest_mid = [cx - dX_mid, cy - dY_mid]; // (330, 330)
    const northEast_mid = [cx + dX_mid, cy - dY_mid]; // (470, 330)
    const southEast_mid = [cx + dX_mid, cy + dY_mid]; // (470, 470)
    const southWest_mid = [cx - dX_mid, cy + dY_mid]; // (330, 470)

    // نقاط وسيطة على الأشعة الأربعة الأساسية
    const north_mid = [cx, Math.round(cy - rMain * 0.65)];   // (400, 273)
    const north_inner = [cx, Math.round(cy - rMain * 0.35)]; // (400, 332)

    const south_mid = [cx, Math.round(cy + rMain * 0.65)];   // (400, 527)
    const south_inner = [cx, Math.round(cy + rMain * 0.35)]; // (400, 468)

    const west_mid = [Math.round(cx - rMain * 0.65), cy];   // (273, 400)
    const west_inner = [Math.round(cx - rMain * 0.35), cy]; // (332, 400)

    const east_mid = [Math.round(cx + rMain * 0.65), cy];   // (527, 400)
    const east_inner = [Math.round(cx + rMain * 0.35), cy]; // (468, 400)

    // خط قناة الحب والمال (المحور المنقط في الربع السفلي الأيمن)
    const loveCoord = [438, 482];    // مدخل الحب ❤️
    const balanceCoord = [460, 460]; // نقطة التوازن المشترك ⚖️
    const moneyCoord = [482, 438];   // مدخل المال 💲
    const soulSynthesis = [cx, cy - 32]; // نقطة التكامل الروحي والشاكرات المشتركة

    // أضلاع المضلعين
    const personalSquare = `${north[0]},${north[1]} ${east[0]},${east[1]} ${south[0]},${south[1]} ${west[0]},${west[1]}`;
    const ancestralSquare = `${northEast[0]},${northEast[1]} ${southEast[0]},${southEast[1]} ${southWest[0]},${southWest[1]} ${northWest[0]},${northWest[1]}`;

    // تكوين شبكة الـ 25 دائرة هندسية متطابقة مع المرجع السلافي
    const nodes25 = [
      // 1. المركز (راحة الروح)
      { id: 'center', coord: center, r: 24, val: E, cls: 'aqm-chakra-manipura is-center', target: '#sec-core', label: 'راحة الروح ونواة المركز (Manipura)' },

      // 2-5. أطراف المربع الشخصي المستقيم (الألوان الشاكرية الرئيسية)
      { id: 'north', coord: north, r: 18, val: B, cls: 'aqm-chakra-sahasrara', target: '#sec-core', label: 'الاتصال الروحي وشهر الميلاد (Sahasrara)' },
      { id: 'east', coord: east, r: 18, val: C, cls: 'aqm-chakra-svadhisthana', target: '#sec-money', label: 'المادة وسنة الميلاد والوفرة (Svadhisthana)' },
      { id: 'south', coord: south, r: 18, val: D, cls: 'aqm-chakra-muladhara', target: '#sec-karmic', label: 'الذيل الكارمي وقاعدة الدروس (Muladhara)' },
      { id: 'west', coord: west, r: 18, val: A, cls: 'aqm-chakra-vishuddha', target: '#sec-core', label: 'الجوهر وشخصية يوم الميلاد (Vishuddha)' },

      // 6-9. أطراف مربع الأسلاف المائل 45° (الدوائر البيضاء الأربع)
      { id: 'northWest', coord: northWest, r: 17, val: F, cls: 'aqm-chakra-ancestral', target: '#sec-programs', label: 'سلالة الأب · الروح والأجداد (F)' },
      { id: 'northEast', coord: northEast, r: 17, val: G, cls: 'aqm-chakra-ancestral', target: '#sec-programs', label: 'سلالة الأم · الروح والأجداد (G)' },
      { id: 'southEast', coord: southEast, r: 17, val: H, cls: 'aqm-chakra-ancestral', target: '#sec-programs', label: 'سلالة الأم · كارما المادة (H)' },
      { id: 'southWest', coord: southWest, r: 17, val: I, cls: 'aqm-chakra-ancestral', target: '#sec-programs', label: 'سلالة الأب · كارما المادة (I)' },

      // 10-13. الدوائر الحلقية الوسيطة لمربع الأسلاف (Midpoints)
      { id: 'northWest_mid', coord: northWest_mid, r: 13, val: R(F + E), cls: 'aqm-chakra-ancestral-mid', target: '#sec-programs', label: 'خط الذكور · المورد الروحي الكامن' },
      { id: 'northEast_mid', coord: northEast_mid, r: 13, val: R(G + E), cls: 'aqm-chakra-ancestral-mid', target: '#sec-programs', label: 'خط الإناث · المورد الروحي الكامن' },
      { id: 'southEast_mid', coord: southEast_mid, r: 13, val: R(H + E), cls: 'aqm-chakra-ancestral-mid', target: '#sec-programs', label: 'خط الإناث · الدرس المادي الموروث' },
      { id: 'southWest_mid', coord: southWest_mid, r: 13, val: R(I + E), cls: 'aqm-chakra-ancestral-mid', target: '#sec-programs', label: 'خط الذكور · الدرس المادي الموروث' },

      // 14-15. المحور العمودي العلوي (المواهب والاتصال الروحي)
      { id: 'north_mid', coord: north_mid, r: 14, val: R(B + E), cls: 'aqm-chakra-ajna', target: '#sec-core', label: 'قناة المواهب الروحية العليا (العين الثالثة)' },
      { id: 'north_inner', coord: north_inner, r: 13, val: R(R(B + E) + E), cls: 'aqm-chakra-anahata', target: '#sec-core', label: 'الشاكرة القلبية للاتصال الروحي' },

      // 16-17. المحور الأفقي الأيسر (الشخصية والتعبير الجسدي)
      { id: 'west_mid', coord: west_mid, r: 14, val: R(A + E), cls: 'aqm-chakra-vishuddha', target: '#sec-health', label: 'شاكرة الحنجرة والتعبير والفيزياء' },
      { id: 'west_inner', coord: west_inner, r: 13, val: R(R(A + E) + E), cls: 'aqm-chakra-anahata', target: '#sec-health', label: 'شاكرة القلب والجسد' },

      // 18-19. المحور العمودي السفلي (الذيل الكارمي والديون)
      { id: 'south_mid', coord: south_mid, r: 14, val: karmicMid, cls: 'aqm-chakra-svadhisthana', target: '#sec-karmic', label: 'وسط الذيل الكارمي والديون' },
      { id: 'south_inner', coord: south_inner, r: 13, val: karmicInner, cls: 'aqm-chakra-muladhara', target: '#sec-karmic', label: 'النواة الباطنية للذيل الكارمي' },

      // 20-21. المحور الأفقي الأيمن (المال والوظيفة)
      { id: 'east_mid', coord: east_mid, r: 14, val: R(C + E), cls: 'aqm-chakra-svadhisthana', target: '#sec-money', label: 'مفتاح خط المال والوفرة' },
      { id: 'east_inner', coord: east_inner, r: 13, val: R(R(C + E) + E), cls: 'aqm-chakra-manipura', target: '#sec-money', label: 'طاقة العمل والتطبيق المادي' },

      // 22. مدخل الحب (Heart ❤️)
      { id: 'love_entry', coord: loveCoord, r: 14, val: loveEntry, cls: 'aqm-node-love', target: '#sec-love', label: 'مدخل الحب والشراكات العاطفية', isLove: true },

      // 23. مدخل المال (Dollar 💲)
      { id: 'money_entry', coord: moneyCoord, r: 14, val: moneyEntry, cls: 'aqm-node-money', target: '#sec-money', label: 'مدخل خط المال والوظيفة', isMoney: true },

      // 24. دائرة التقاطع المشتركة بين الخطين (Balance ⚖️)
      { id: 'balance', coord: balanceCoord, r: 13, val: balancePoint, cls: 'aqm-node-balance', target: '#sec-love', label: 'نقطة التوازن المشترك بين المال والعلاقات' },

      // 25. نقطة التكامل الروحي والشاكرات المشتركة (Common Energy Zone)
      { id: 'soul_synthesis', coord: soulSynthesis, r: 12, val: matrix.commonCenter || R(E + matrix.ancestralCenter), cls: 'aqm-chakra-sahasrara', target: '#sec-health', label: 'نقطة الطاقة الكلية الجامعة (Common Energy Zone)' }
    ];

    // بناء وسوم الـ 25 دائرة في SVG
    const nodesSvg = nodes25.map(n => {
      const [x, y] = n.coord;
      let extraGlyph = '';
      if (n.isLove) {
        extraGlyph = `
          <g class="aqm-channel-glyph" transform="translate(${x - 22}, ${y - 7})">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ff4d6d" transform="scale(0.42)" filter="drop-shadow(0 0 5px rgba(255,77,109,0.85))" />
          </g>
        `;
      } else if (n.isMoney) {
        extraGlyph = `
          <g class="aqm-channel-glyph" transform="translate(${x + 13}, ${y - 6})">
            <circle r="7.5" fill="#0d2e1c" stroke="#2ecc71" stroke-width="1.6" filter="drop-shadow(0 0 5px rgba(46,204,113,0.85))"/>
            <text text-anchor="middle" y="3.5" font-size="10" font-weight="900" fill="#2ecc71">$</text>
          </g>
        `;
      }
      return `
        <g class="aqm-node ${n.cls}" tabindex="0" role="button" data-node="${n.id}" data-target="${n.target}" aria-label="${escapeHTML(n.label)}: ${n.val}" aria-describedby="aqm-tooltip">
          <circle cx="${x}" cy="${y}" r="${n.r}" />
          <text x="${x}" y="${y + 5}">${n.val}</text>
          ${extraGlyph}
          <title>${escapeHTML(n.label)}: ${n.val}</title>
        </g>
      `;
    }).join('');

    // حلقة محيط العمر الخارجي (0 - 80 سنة)
    const rAge = 280;

    // المحطات الرئيسية الثمانية (كل 10 سنوات) مع نصوص واضحة
    const majorStations = [
      { age: 0, angle: 180, label: '0 / 80 years old', textX: 75, textY: 404, anchor: 'end' },
      { age: 10, angle: 225, label: '10 years old', textX: 145, textY: 145, anchor: 'end' },
      { age: 20, angle: 270, label: '20 years old', textX: 400, textY: 82, anchor: 'middle' },
      { age: 30, angle: 315, label: '30 years old', textX: 655, textY: 145, anchor: 'start' },
      { age: 40, angle: 0, label: '40 years old', textX: 725, textY: 404, anchor: 'start' },
      { age: 50, angle: 45, label: '50 years old', textX: 655, textY: 655, anchor: 'start' },
      { age: 60, angle: 90, label: '60 years old', textX: 400, textY: 728, anchor: 'middle' },
      { age: 70, angle: 135, label: '70 years old', textX: 145, textY: 655, anchor: 'end' }
    ];

    // المحطات الوسيطة (كل 5 سنوات)
    const midStations = [
      { age: 5, angle: 202.5, label: '5' },
      { age: 15, angle: 247.5, label: '15' },
      { age: 25, angle: 292.5, label: '25' },
      { age: 35, angle: 337.5, label: '35' },
      { age: 45, angle: 22.5, label: '45' },
      { age: 55, angle: 67.5, label: '55' },
      { age: 65, angle: 112.5, label: '65' },
      { age: 75, angle: 157.5, label: '75' }
    ];

    // النقاط المصغرة لتفاصيل السنين الدقيقة حول الإطار (2.5, 7.5, 12.5, 17.5 ...)
    const microAges = [
      2.5, 7.5, 12.5, 17.5, 22.5, 27.5, 32.5, 37.5,
      42.5, 47.5, 52.5, 57.5, 62.5, 67.5, 72.5, 77.5
    ];

    // رسم عناصر المحطات الرئيسية والثانوية
    const allAgePoints = [...majorStations, ...midStations];
    const ageElements = allAgePoints.map(pt => {
      const rad = (pt.angle * Math.PI) / 180;
      const x = Math.round(cx + rAge * Math.cos(rad));
      const y = Math.round(cy + rAge * Math.sin(rad));
      const energy = ageMap[pt.age] || (pt.age === 0 ? A : pt.age === 20 ? B : pt.age === 40 ? C : pt.age === 60 ? D : 0);
      const isCurrent = Math.abs(currentMilestone - pt.age) < 3.5;
      const isMajor = pt.age % 10 === 0;

      let majorTextSvg = '';
      if (isMajor && pt.label) {
        majorTextSvg = `<text class="aqm-age-major-text" x="${pt.textX}" y="${pt.textY}" text-anchor="${pt.anchor}">${pt.label}</text>`;
      } else {
        const lx = Math.round(cx + (rAge + 18) * Math.cos(rad));
        const ly = Math.round(cy + (rAge + 18) * Math.sin(rad)) + 4;
        majorTextSvg = `<text class="aqm-age-label-text" x="${lx}" y="${ly}">${pt.label}</text>`;
      }

      return `
        <g class="aqm-age-node-dot ${isCurrent ? 'is-current' : ''}" data-age="${pt.age}" data-target="#sec-age" role="button" tabindex="0" aria-label="سن ${pt.age}: طاقة ${energy}">
          <circle cx="${x}" cy="${y}" r="${isMajor ? 12 : 9.5}" />
          <text x="${x}" y="${y + 4}">${energy}</text>
          ${majorTextSvg}
          <title>طاقة سن ${pt.age}: أركانا ${energy} (${escapeHTML(ARCANA[energy - 1]?.[0] || '')})</title>
        </g>
      `;
    }).join('');

    // رسم الشرطات والنصوص المصغرة للسنين الدقيقة
    const microAgeElements = microAges.map(ageVal => {
      const angle = 180 + ageVal * 4.5;
      const rad = (angle * Math.PI) / 180;
      const x1 = Math.round(cx + (rAge - 4) * Math.cos(rad));
      const y1 = Math.round(cy + (rAge - 4) * Math.sin(rad));
      const x2 = Math.round(cx + (rAge + 4) * Math.cos(rad));
      const y2 = Math.round(cy + (rAge + 4) * Math.sin(rad));
      const tx = Math.round(cx + (rAge + 14) * Math.cos(rad));
      const ty = Math.round(cy + (rAge + 14) * Math.sin(rad)) + 3;

      return `
        <g class="aqm-age-micro-group" aria-hidden="true">
          <line class="aqm-age-micro-tick" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />
          <text class="aqm-age-micro-text" x="${tx}" y="${ty}">${ageVal}</text>
        </g>
      `;
    }).join('');

    return `
      <svg class="aqm-svg" viewBox="0 0 800 800" role="group" aria-label="مصفوفة القدر الهندسية وأطواق الشاكرات وسنوات العمر">
        <defs>
          <linearGradient id="aqm-grad-channel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff4d6d" />
            <stop offset="50%" stop-color="#f1c40f" />
            <stop offset="100%" stop-color="#2ecc71" />
          </linearGradient>
          <marker id="aqm-arrow-gen" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#d4af37" opacity="0.8"/>
          </marker>
        </defs>

        <!-- الدائرة المحيطية لسنوات العمر (0 إلى 80 سنة) -->
        <circle class="aqm-age-ring-path" cx="${cx}" cy="${cy}" r="${rAge}" />

        <!-- الشرطات المصغرة للسنين الدقيقة حول الإطار -->
        ${microAgeElements}

        <!-- المربع المستقيم (Personal Square) والمربع المائل (Ancestral Square) -->
        <polygon class="aqm-octagon" points="${personalSquare}" />
        <polygon class="aqm-octagon" points="${ancestralSquare}" stroke-dasharray="3 3" opacity="0.8" />

        <!-- خطوط السلالة مع الأسهم والتسمية النصية الصريحة -->
        <!-- سهم وخط: male generation line -->
        <line class="aqm-gen-line" x1="240" y1="240" x2="560" y2="560" marker-end="url(#aqm-arrow-gen)" />
        <text x="315" y="295" transform="rotate(45, 315, 295)" class="aqm-gen-line-text">male generation line</text>

        <!-- سهم وخط: female generation line -->
        <line class="aqm-gen-line" x1="560" y1="240" x2="240" y2="560" marker-end="url(#aqm-arrow-gen)" />
        <text x="485" y="295" transform="rotate(-45, 485, 295)" class="aqm-gen-line-text">female generation line</text>

        <!-- محاور النجمة الثمانية المركزية -->
        <line class="aqm-line aqm-axis-vertical" x1="${north[0]}" y1="${north[1]}" x2="${south[0]}" y2="${south[1]}" />
        <line class="aqm-line aqm-axis-horizontal" x1="${west[0]}" y1="${west[1]}" x2="${east[0]}" y2="${east[1]}" />
        <line class="aqm-diagonal" x1="${northWest[0]}" y1="${northWest[1]}" x2="${southEast[0]}" y2="${southEast[1]}" />
        <line class="aqm-diagonal" x1="${northEast[0]}" y1="${northEast[1]}" x2="${southWest[0]}" y2="${southWest[1]}" />

        <!-- خط المال والحب المتقاطع (المحور المنقط) -->
        <line class="aqm-channel-dotted-axis" x1="420" y1="500" x2="500" y2="420" />

        <!-- نقاط ومحطات سنوات العمر على المحيط (0 - 80 سنة) -->
        ${ageElements}

        <!-- شبكة الـ 25 دائرة هندسية ومراكز الشاكرات الملونة -->
        ${nodesSvg}
      </svg>
    `;
  }

  function render7DestinySections(matrix, dateValue, chakras, generations, axes) {
    const { A, B, C, D, E } = matrix.anchors;
    const DESTINY_DATA = window.AqeeqDestinyMatrixData || {};
    const AGE_MAP_API = window.AqeeqAgeMap || {};

    const getArc = DESTINY_DATA.getArcana || (n => ({ title: `أركانا ${n}`, archetype: '', light: '', shadow: '', psychosomatics: '', cheatSheet: [], positions: {}, transformationProtocol: [] }));
    const getTail = DESTINY_DATA.getKarmicTail || ((c1, c2, c3) => ({ code: `${c1}-${c2}-${c3}`, title: `الذيل الكارمي (${c1}-${c2}-${c3})`, paradox: '', childhoodRoots: '', tracks: {}, psychosomatics: '', transformationProtocol: [], closingConfrontation: '' }));

    const arcDay = getArc(A);
    const arcMonth = getArc(B);
    const arcYear = getArc(C);
    const arcCenter = getArc(E);
    const arcKarma = getArc(D);
    const tailData = getTail(matrix.karmicTail.base, matrix.karmicTail.mid, matrix.karmicTail.inner);

    // حساب خريطة سنوات العمر
    const ageMap = AGE_MAP_API.calculateAgeMap ? AGE_MAP_API.calculateAgeMap(matrix.anchors, matrix.generationalCorners) : {};
    const ageInfo = AGE_MAP_API.getCurrentAgeEnergy ? AGE_MAP_API.getCurrentAgeEnergy(dateValue) : { exactAge: 0, normalizedAge: 0, milestone: 0, quadrant: '' };
    const currentYearEnergy = ageMap[ageInfo.milestone] || arcDay.number;
    const ageTheme = AGE_MAP_API.getAgeInterpretation ? AGE_MAP_API.getAgeInterpretation(currentYearEnergy) : { title: '', theme: '' };

    // Cheat Sheet للأركانا المركزية
    const centerCheatRows = Array.isArray(arcCenter.cheatSheet) && arcCenter.cheatSheet.length ? (
      '<div class="aqm-cheat-sheet"><h4>المقارنة البصرية السريعة لجوهر مصفوفتك (طاقة ' + E + ')</h4><div class="aqm-table-scroll"><table class="aqm-cheat-table"><thead><tr><th>المجال</th><th>النور (+)</th><th>الظل (-)</th></tr></thead><tbody>' +
      arcCenter.cheatSheet.map(r => '<tr><td><b>' + escapeHTML(r.area) + '</b></td><td>' + escapeHTML(r.balanced) + '</td><td>' + escapeHTML(r.shadow) + '</td></tr>').join('') +
      '</tbody></table></div></div>'
    ) : '';

    // صفوف جدول الشاكرات السبع
    const chakraRows = chakras.rows.map((row, index) =>
      '<tr><th scope="row"><button type="button" class="aqm-chakra-toggle" data-chakra-toggle="' + row.key + '" aria-expanded="false" aria-controls="aqm-chakra-detail-' + row.key + '"><span class="aqm-chakra-order">' + (index + 1) + '</span><span>' + escapeHTML(row.name) + '<small>' + escapeHTML(row.sanskrit) + '</small></span><span aria-hidden="true">＋</span></button></th><td>' + row.physics + '</td><td>' + row.energy + '</td><td>' + row.emotions + '</td></tr><tr id="aqm-chakra-detail-' + row.key + '" class="aqm-chakra-detail" hidden><td colspan="4"><div class="aqm-chakra-copy"><p><b>المعنى الروحي والسلوكي · طاقة ' + row.energy + ' (' + escapeHTML(ARCANA[row.energy - 1]?.[0] || '') + '):</b> ' + escapeHTML(row.focus) + '. ' + escapeHTML(ARCANA[row.energy - 1]?.[1] || '') + '</p><p><b>ارتباط جسدي رمزي:</b> ' + escapeHTML(row.area) + '. صياغة رمزية للتأمل وليست تشخيصاً طبياً.</p><p><b>مفتاح التوازن:</b> ' + escapeHTML(row.balance) + '</p></div></td></tr>'
    ).join('');

    // كروت خطوط الأجداد
    const lineageCard = (line, kind) =>
      '<article class="aqm-card aqm-lineage-card ' + kind + '"><span class="aqm-kicker">' + escapeHTML(line.name) + '</span><div class="aqm-ancestral-numbers">' +
      line.points.map((n, i) => '<span><b>' + n + '</b><small>' + (i === 1 ? 'المركز' : 'زاوية') + '</small></span>').join('<i aria-hidden="true">·</i>') +
      '</div><p>طاقة طرفَي الخط: <b>' + line.combined + '</b>. مفتاح رمزي لتأمل الأنماط الأسرية الموروثة وكسر قيودها بوعي.</p></article>';

    return `
      <!-- شريط التنقل المرجعي للأقسام السبعة القياسية -->
      <nav class="aqm-section-nav" aria-label="أقسام مصفوفة القدر المرجعية">
        <button type="button" class="aqm-nav-pill is-active" data-target="#sec-core">1. الجوهر والمركز</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-karmic">2. الذيل الكارمي</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-age">3. طاقة العمر والسنوات</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-money">4. خط المال والوظيفة</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-love">5. خط العلاقات والشريك</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-programs">6. البرامج والأسلاف</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-health">7. خريطة الشاكرات والصحة</button>
      </nav>

      <div class="aqm-matrix-sections">
        <!-- 1. الجوهر والمركز (Core Personality) -->
        <section id="sec-core" class="aqm-destiny-section" tabindex="-1">
          <div class="aqm-sec-header">
            <span class="aqm-kicker">القسم 01 · Core Personality</span>
            <h3>الجوهر والمركز (القناع الاجتماعي ونواة الروح) <span class="aqm-destiny-badge">الرقم ${A} و ${E}</span></h3>
          </div>
          <p>تميّز مصفوفة القدر بين <b>القناع الخارجي</b> (طاقة يوم الميلاد ${A}) الذي يراك به الناس، وبين <b>نواة الروح وراحة القلب</b> (طاقة المركز ${E}) حيث يسكن سلامك الداخلي الحقيقي.</p>
          ${centerCheatRows}
          <div class="aqm-pos-grid">
            <article class="aqm-pos-item is-highlight">
              <h5><span>القناع الاجتماعي والانطباع الأول · رقم ${A}</span><small>يوم الميلاد</small></h5>
              <p><b>${escapeHTML(arcDay.title)}:</b> ${escapeHTML(arcDay.positions?.personality || arcDay.archetype)}</p>
            </article>
            <article class="aqm-pos-item is-highlight">
              <h5><span>نواة الروح وراحة القلب · رقم ${E}</span><small>مركز المصفوفة</small></h5>
              <p><b>${escapeHTML(arcCenter.title)}:</b> ${escapeHTML(arcCenter.positions?.center || arcCenter.archetype)}</p>
            </article>
            <article class="aqm-pos-item">
              <h5><span>الاتصال الروحي ومصدر الإلهام · رقم ${B}</span><small>شهر الميلاد</small></h5>
              <p><b>${escapeHTML(arcMonth.title)}:</b> ${escapeHTML(arcMonth.positions?.spirit || arcMonth.archetype)}</p>
            </article>
            <article class="aqm-pos-item">
              <h5><span>مدخل المادة والمهام الدنيوية · رقم ${C}</span><small>سنة الميلاد</small></h5>
              <p><b>${escapeHTML(arcYear.title)}:</b> ${escapeHTML(arcYear.positions?.money || arcYear.archetype)}</p>
            </article>
          </div>
          <div class="aqm-life-path-columns" style="margin-top: .85rem;">
            <div class="aqm-life-path-copy is-light"><h4>تجلي النواة في النور (+)</h4><p>${escapeHTML(arcCenter.light)}</p></div>
            <div class="aqm-life-path-copy is-shadow"><h4>فخ الظل في المركز (-)</h4><p>${escapeHTML(arcCenter.shadow)}</p></div>
          </div>
        </section>

        <!-- 2. الذيل الكارمي (Karmic Tail) -->
        <section id="sec-karmic" class="aqm-destiny-section aqm-karmic-card" tabindex="-1">
          <div class="aqm-sec-header">
            <span class="aqm-kicker">القسم 02 · Karmic Tail</span>
            <h3>الذيل الكارمي والدروس الروحية <span class="aqm-karmic-code">${tailData.code}</span></h3>
          </div>
          <p>الذيل الكارمي هو الشفرة التأسيسية لتحدياتك غير المحلولة من الماضي؛ يدخل حياتك بنمط لاواعي مكرر حتى تتفكك العقدة وتتحول إلى أعلى درجات الحكمة.</p>
          <div class="aqm-pos-grid">
            <article class="aqm-pos-item">
              <h5><span>قاعدة الذيل الكارمي (Base)</span><small>رقم ${matrix.karmicTail.base}</small></h5>
              <p>${escapeHTML(arcKarma.archetype)}</p>
            </article>
            <article class="aqm-pos-item">
              <h5><span>جذر الطفولة والبرمجة الأولى</span><small>أصل العقدة</small></h5>
              <p>${escapeHTML(tailData.childhoodRoots || 'شعور مبكر بالحاجة لإثبات الذات أو الخوف من الفقدان والرفض.')}</p>
            </article>
          </div>
          <div class="aqm-karmic-tracks">
            <div class="aqm-track-box">
              <h5>المسار الأول (الهروب / الانجراف)</h5>
              <p>${escapeHTML(tailData.tracks?.trackOne || 'تكرار نفس السلوكيات التعويضية التلقائية التي تجلب الخذلان عند الضغط.')}</p>
            </div>
            <div class="aqm-track-box">
              <h5>المسار الثاني (المواجهة والوعي)</h5>
              <p>${escapeHTML(tailData.tracks?.trackTwo || 'إسقاط الأقنعة وكسر حلقة التخريب الذاتي بالانضباط والنزاهة الصريحة.')}</p>
            </div>
          </div>
          <div class="aqm-confrontation">
            <b>المواجهة الصريحة:</b> ${escapeHTML(tailData.closingConfrontation || 'كل ما كان يوماً نقطة ضعفك الدفينة سيصبح أعظم مصادر قوتك عندما تفك شفرته بوعي شجاع.')}
          </div>
        </section>

        <!-- 3. طاقة العمر والسنوات (Age periods) -->
        <section id="sec-age" class="aqm-destiny-section" tabindex="-1">
          <div class="aqm-sec-header">
            <span class="aqm-kicker">القسم 03 · Age periods & Annual Exam</span>
            <h3>طاقة دورات العمر والامتحان السنوي <span class="aqm-destiny-badge">السن الحالي: ${ageInfo.exactAge} سنة</span></h3>
          </div>
          <div class="aqm-age-badge-group">
            <span class="aqm-age-pill">طاقة سنتك الحالية: أركانا ${currentYearEnergy}</span>
            <span class="aqm-age-pill">المحطة الكبرى: سن ${ageInfo.milestone}</span>
          </div>
          <article class="aqm-card" style="padding:.95rem; margin-top:.75rem;">
            <span class="aqm-kicker">عنوان الامتحان الوجودي لسنتك الحالية</span>
            <h4 style="margin:.3rem 0; color:#f5dfa8;">${escapeHTML(ageTheme.title || ('سنة الأركانا ' + currentYearEnergy))}</h4>
            <p style="margin:0; color:#cfd3dd; font-size:.86rem; line-height:1.8;">${escapeHTML(ageTheme.theme || 'سنة تتطلب التركيز على تنظيم الأولويات ومواجهة الاختبارات بالمرونة وضبط النفس.')}</p>
          </article>
          <div class="aqm-age-grid">
            ${Object.entries(ageMap).filter(([a]) => Number(a) % 10 === 0).map(([age, arc]) => `
              <div class="aqm-age-node ${Number(age) === Number(ageInfo.milestone) ? 'is-current' : ''}">
                <small>سن ${age} سنة</small>
                <b>طاقة ${arc}</b>
                <small>${escapeHTML(ARCANA[arc - 1]?.[0] || '')}</small>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- 4. خط المال والوظيفة (Money Line) -->
        <section id="sec-money" class="aqm-destiny-section" tabindex="-1">
          <div class="aqm-sec-header">
            <span class="aqm-kicker">القسم 04 · Money Line & Career</span>
            <h3>خط المال والوفرة وتوجيه المهنة <span class="aqm-destiny-badge">مدخل الوفرة: ${matrix.channels.money}</span></h3>
          </div>
          <p>يتشكل تدفق المال من التوازن بين مدخل المادة (${C}) والمركز (${E}). المال في مصفوفة القدر هو طاقة نتيجة تتبع النزاهة والإتقان.</p>
          <div class="aqm-pos-grid">
            <article class="aqm-pos-item is-highlight">
              <h5><span>مدخل المال والوظيفة</span><small>طاقة ${matrix.channels.money}</small></h5>
              <p>${escapeHTML(getArc(matrix.channels.money).positions?.money || getArc(matrix.channels.money).archetype)}</p>
            </article>
            <article class="aqm-pos-item">
              <h5><span>أكبر عائق أمام تدفق الرزق (-)</span><small>فخ التسريب</small></h5>
              <p>الخوف من الشُح، التردد في تسعير المهارة بقيمتها الحقيقية، أو محاولة جمع المال من مسارات لا تشبه قيمك الصادقة.</p>
            </article>
          </div>
          <div class="aqm-life-path-columns" style="margin-top:.85rem;">
            <div class="aqm-life-path-copy is-light"><h4>مفتاح فتح الوفرة (+)</h4><p>تقديم نفع حقيقي ملموس، الانضباط في إدارة الموارد، والاستثمار في تطوير المهارات النوعية دون استعجال.</p></div>
            <div class="aqm-life-path-copy is-shadow"><h4>فخ الإهدار والتشتت (-)</h4><p>التوسع المالي غير المحسوب، الدخول في صراعات نفوذ، أو استنزاف الدخل في التزامات استعراضية.</p></div>
          </div>
        </section>

        <!-- 5. خط العلاقات والشريك (Love Line) -->
        <section id="sec-love" class="aqm-destiny-section" tabindex="-1">
          <div class="aqm-sec-header">
            <span class="aqm-kicker">القسم 05 · Love Line & Relationships</span>
            <h3>خط العلاقات وشريك الحياة <span class="aqm-destiny-badge">مدخل الحب: ${matrix.channels.love}</span></h3>
          </div>
          <p>يكشف خط الحب عن الصفات النفسية الحقيقية التي يحتاجها قلبك للشعور بالأمان والاكتمال، والتحدي الرئيسي الذي يختبر نضج الشراكة.</p>
          <div class="aqm-pos-grid">
            <article class="aqm-pos-item is-highlight">
              <h5><span>طبيعة شريك الروح المتوافق</span><small>طاقة ${matrix.channels.love}</small></h5>
              <p>${escapeHTML(getArc(matrix.channels.love).positions?.relationship || getArc(matrix.channels.love).archetype)}</p>
            </article>
            <article class="aqm-pos-item">
              <h5><span>نقطة التوازن والكيمياء الحميمية</span><small>طاقة ${matrix.channels.balance}</small></h5>
              <p>تزدهر العلاقة عندما تكون الشراكة قائمة على الصراحة المتبادلة دون ابتزاز عاطفي أو رغبة في السيطرة.</p>
            </article>
          </div>
          <div class="aqm-life-path-columns" style="margin-top:.85rem;">
            <div class="aqm-life-path-copy is-light"><h4>سر استمرار التناغم (+)</h4><p>الاحترام المتبادل للمساحات الفردية، التواصل الهادئ وقت الخلاف، والدعم الصادق لتحقيق أهداف الطرفين.</p></div>
            <div class="aqm-life-path-copy is-shadow"><h4>النمط المهدد للارتباط (-)</h4><p>إسقاط صدمات الماضي على الشريك، الصمت العقابي، أو توقع الكمال المطلق دون قبول الطبيعة البشرية.</p></div>
          </div>
        </section>

        <!-- 6. البرامج الكارمية والآباء والأبناء (Programs & Family) -->
        <section id="sec-programs" class="aqm-destiny-section" tabindex="-1">
          <div class="aqm-sec-header">
            <span class="aqm-kicker">القسم 06 · Programs, Parents & Kids</span>
            <h3>البرامج الكارمية ومربع الأسلاف والأبناء <span class="aqm-destiny-badge">السلالة 45°</span></h3>
          </div>
          <p>يمثل مربع الأجداد الـ DNA الطاقي الممتد عبر الأجيال. التأمل في هذه الخطوط يكشف الأنماط الأسرية الموروثة وما يستحق تحريره لضمان راحة الأبناء:</p>
          <div class="aqm-lineage-grid" style="margin-top:.85rem;">
            ${lineageCard(generations.male, 'is-male')}
            ${lineageCard(generations.female, 'is-female')}
          </div>
          <div class="aqm-pillars" style="margin-top: 1rem;">
            <article class="aqm-card aqm-pillar"><span class="aqm-pillar-number">${axes.soulSearching}</span><h4>البحث الذاتي</h4><p>حاصل دمج السماء والأرض: بوصلتك الداخلية حتى سن الأربعين.</p></article>
            <article class="aqm-card aqm-pillar"><span class="aqm-pillar-number">${axes.socialization}</span><h4>الاندماج الاجتماعي</h4><p>حاصل دمج خطوط الذكور والإناث: أثرك ومكانتك بعد الأربعين.</p></article>
            <article class="aqm-card aqm-pillar"><span class="aqm-pillar-number">${axes.spiritualExam}</span><h4>الامتحان الروحي</h4><p>محصلة المسار الفردي والمجتمعي معاً: نضج الوعي الوجودي.</p></article>
          </div>
          <article class="aqm-card" style="padding:.95rem; margin-top:.85rem;">
            <p style="margin:0; color:#cfd3dd; font-size:.88rem; line-height:1.8;"><b>الوصية التربوية لمصفوفتك:</b> الأبناء يلتقطون ظلال الوالدين غير المعالجة؛ عندما تحرر ذيلك الكارمي، تمنح أبناءك حرية أن يعيشوا قدرهم الخاص دون أن يرثوا عقدك القديمة.</p>
          </article>
        </section>

        <!-- 7. خريطة الشاكرات والصحة (Health Table) -->
        <section id="sec-health" class="aqm-destiny-section" tabindex="-1">
          <div class="aqm-sec-header">
            <span class="aqm-kicker">القسم 07 · Health Table & 7 Chakras</span>
            <h3>خريطة الشاكرات والصحة (Physics / Energy / Emotions)</h3>
          </div>
          <p>توزيع طاقات الأركانا على مراكز الجسم الحيوية السبعة وفق نظام مصفوفة القدر:</p>
          <div class="aqm-table-scroll">
            <table class="aqm-chakra-table">
              <thead><tr><th scope="col">الشاكرا · Chakra</th><th scope="col">الجسد<br><small>Physics</small></th><th scope="col">الطاقة<br><small>Energy</small></th><th scope="col">المشاعر<br><small>Emotions</small></th></tr></thead>
              <tbody>
                ${chakraRows}
                <tr class="aqm-chakra-total"><th scope="row">الإجمالي · Common Energy-Zone</th><td>${chakras.total.physics}</td><td>${chakras.total.energy}</td><td>${chakras.total.emotions}</td></tr>
              </tbody>
            </table>
          </div>
          <p class="aqm-health-note">${escapeHTML(chakras.method)} الارتباطات الجسدية رمزية للتأمل وليست بديلاً عن الاستشارة الطبية المتخصصة.</p>
        </section>
      </div>
    `;
  }

  function render(host, dateValue) {
    if (typeof host === 'string' && (typeof dateValue === 'object' || !dateValue)) {
      const t = host;
      host = dateValue || document.createElement('div');
      dateValue = t;
    }
    if (!host) host = document.createElement('div');

    const matrix = calculateDestinyMatrix(dateValue);
    const chakras = calculateChakraHealthCard(dateValue);
    const generations = calculateGenerationalLines(dateValue);
    const axes = calculateDestinyAxes(dateValue);
    const num = matrix.nodes;

    host.innerHTML = `
      <section class="aqm-shell" dir="rtl" aria-label="مصفوفة القدر المرجعية">
        <header class="aqm-header">
          <span class="aqm-kicker">مصفوفة القدر · الهندسة الطاقية · ${escapeHTML(dateValue)}</span>
          <h2>مصفوفة القدر (Destiny Matrix)</h2>
          <p>التقرير القياسي وفق هندسة الأركانا الـ 22 والمحاور المصيرية بنظام matrix-destiny.com المرجعي.</p>
        </header>

        <!-- النجمة الثمانية البصرية التفاعلية ومحاور القدر -->
        <div class="aqm-grid">
          <article class="aqm-card aqm-chart-card">
            <div class="aqm-card-head">
              <div>
                <span class="aqm-kicker">الأركانا الكبرى · 1–22</span>
                <h3>النجمة الثمانية والمحاور الطاقية</h3>
              </div>
            </div>
            <div class="aqm-matrix-wrap">
              ${renderSVG(matrix, dateValue)}
              <div class="aqm-tooltip" id="aqm-tooltip" role="status" aria-live="polite">اضغط أو مرر على أي دائرة لاستكشاف معناها والانتقال لقسمها.</div>
            </div>
            <div class="aqm-lines">
              <p><b>خط الوفرة والمال:</b> مدخل ${matrix.channels.money} ← المركز ${num.center} ← المادة ${num.south}</p>
              <p><b>خط الحب والشراكات:</b> مدخل ${matrix.channels.love} ← المركز ${num.center} ← التوازن ${matrix.channels.balance}</p>
            </div>
            <p class="aqm-method">${escapeHTML(matrix.formula)}</p>
          </article>

          <div class="aqm-interpretations">
            <article class="aqm-card">
              <span class="aqm-kicker">جوهر الروح · رقم ${num.center}</span>
              <h3>نواة وراحة الروح</h3>
              <div class="aqm-reading">
                <b>${num.center} · ${escapeHTML(ARCANA[num.center-1]?.[0] || '')}</b>
                <p>${escapeHTML(ARCANA[num.center-1]?.[1] || '')}</p>
              </div>
              <div class="aqm-reading is-shadow">
                <b>مساحة التوازن واليقظة</b>
                <p>${escapeHTML(ARCANA[num.center-1]?.[2] || '')}</p>
              </div>
            </article>

            <article class="aqm-card">
              <span class="aqm-kicker">القناع الاجتماعي · رقم ${num.west}</span>
              <h3>طاقة يوم الميلاد والانطباع الأول</h3>
              <div class="aqm-reading">
                <b>${num.west} · ${escapeHTML(ARCANA[num.west-1]?.[0] || '')}</b>
                <p>${escapeHTML(ARCANA[num.west-1]?.[1] || '')}</p>
              </div>
              <div class="aqm-reading is-shadow">
                <b>جانب للتأمل الواعي</b>
                <p>${escapeHTML(ARCANA[num.west-1]?.[2] || '')}</p>
              </div>
            </article>
          </div>
        </div>

        <!-- الأقسام السبعة القياسية لمصفوفة القدر -->
        ${render7DestinySections(matrix, dateValue, chakras, generations, axes)}

        <footer class="aqm-disclaimer">
          هذه التحليلات مبنية على الهندسة المقدسة ونظام الأركانا الـ 22 لمصفوفة القدر، ومصاغة بأسلوب تحليلي نفسي وسلوكي وسوماتيكي للتأمل العميق، ولا تتضمن ادعاءات غيبية حتمية.
        </footer>
      </section>
    `;

    // تفعيل تفاصيل الشاكرات القابلة للفتح والغلق
    host.querySelectorAll('[data-chakra-toggle]').forEach(button => {
      button.addEventListener('click', () => {
        const detail = host.querySelector('#' + button.getAttribute('aria-controls'));
        const open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        if (detail) detail.hidden = !open;
        button.querySelector('[aria-hidden="true"]').textContent = open ? '−' : '＋';
      });
    });

    // تفعيل أزرار التنقل السريع بين الأقسام السبعة
    const navPills = host.querySelectorAll('.aqm-nav-pill');
    navPills.forEach(pill => {
      pill.addEventListener('click', () => {
        navPills.forEach(p => p.classList.remove('is-active'));
        pill.classList.add('is-active');

        const target = pill.getAttribute('data-target');
        if (target) {
          const targetEl = host.querySelector(target);
          if (targetEl) {
            targetEl.hidden = false;
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            targetEl.focus();
          }
        }
      });
    });

    // تفعيل تفاعل النقر والمرور على دوائر النجمة الثمانية ونقاط العمر مع القفز التلقائي
    const tip = host.querySelector('#aqm-tooltip');
    const allSvgInteractive = host.querySelectorAll('.aqm-node, .aqm-age-node-dot');

    allSvgInteractive.forEach(node => {
      const updateTip = () => {
        const key = node.dataset.node;
        const age = node.dataset.age;
        if (age !== undefined) {
          const energy = node.querySelector('text')?.textContent || '';
          if (tip) tip.textContent = `طاقة سن ${age} سنة · أركانا ${energy}: مرحلة نمو سنوية مهمة في مسار العمر (الامتحان السنوي). اضغط للانتقال للقسم.`;
        } else if (key) {
          const value = num[key] || (key === 'love' ? matrix.channels.love : key === 'money' ? matrix.channels.money : matrix.channels.balance);
          const [positive, shadow] = (ARCANA[value - 1] || []).slice(1);
          const label = labels[key] || (key === 'love' ? 'خط الحب والشراكات' : key === 'money' ? 'خط المال والوفرة' : 'نقطة التوازن');
          if (tip) tip.textContent = `${label} · ${value}: ${positive || ''}. جانب للتأمل: ${shadow || ''}. (اضغط للانتقال للقسم بالتقرير)`;
        }
        allSvgInteractive.forEach(n => n.classList.toggle('is-active', n === node));
      };

      node.addEventListener('mouseenter', updateTip);
      node.addEventListener('focus', updateTip);

      node.addEventListener('click', () => {
        updateTip();
        const targetSel = node.getAttribute('data-target');
        if (!targetSel) return;

        const targetEl = host.querySelector(targetSel);
        if (!targetEl) return;

        targetEl.hidden = false;
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        targetEl.classList.remove('is-highlighted-pulse');
        void targetEl.offsetWidth; // trigger reflow
        targetEl.classList.add('is-highlighted-pulse');
        targetEl.focus();

        const matchPill = host.querySelector(`.aqm-nav-pill[data-target="${targetSel}"]`);
        if (matchPill) {
          host.querySelectorAll('.aqm-nav-pill').forEach(p => p.classList.remove('is-active'));
          matchPill.classList.add('is-active');
        }
      });

      node.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          node.click();
        }
      });
    });

    return host;
  }

  function initResult(root) {
    if (!root || root.dataset.aqmReady === 'true') return;
    const date = document.querySelector('#f-date')?.value;
    if (!date || !root.children.length) return;
    root.dataset.aqmReady = 'true';
    const original = [...root.childNodes];
    root.replaceChildren();

    const tabs = document.createElement('div');
    tabs.className = 'aqm-tabs';
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'أقسام النتيجة');

    const chartBtn = document.createElement('button');
    const matrixBtn = document.createElement('button');
    [
      [chartBtn, 'chart', 'الخريطة والعبور'],
      [matrixBtn, 'numbers', 'مصفوفة القدر']
    ].forEach(([btn, id, label], i) => {
      btn.type = 'button';
      btn.id = `aqm-tab-${id}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(i === 0));
      btn.setAttribute('aria-controls', `aqm-panel-${id}`);
      btn.tabIndex = i === 0 ? 0 : -1;
      btn.textContent = label;
      tabs.append(btn);
    });

    const chartPanel = document.createElement('div');
    const matrixPanel = document.createElement('div');
    chartPanel.id = 'aqm-panel-chart';
    matrixPanel.id = 'aqm-panel-numbers';
    chartPanel.setAttribute('role', 'tabpanel');
    matrixPanel.setAttribute('role', 'tabpanel');
    matrixPanel.setAttribute('aria-labelledby', 'aqm-tab-numbers');
    chartPanel.setAttribute('aria-labelledby', 'aqm-tab-chart');
    chartPanel.className = 'aqm-tab-panel';
    matrixPanel.className = 'aqm-tab-panel';

    original.forEach(node => chartPanel.append(node));
    root.append(tabs, chartPanel, matrixPanel);

    const activate = id => {
      const isChart = id === 'chart';
      chartPanel.hidden = !isChart;
      matrixPanel.hidden = isChart;
      chartBtn.setAttribute('aria-selected', String(isChart));
      matrixBtn.setAttribute('aria-selected', String(!isChart));
      chartBtn.tabIndex = isChart ? 0 : -1;
      matrixBtn.tabIndex = isChart ? -1 : 0;
    };

    chartBtn.addEventListener('click', () => activate('chart'));
    matrixBtn.addEventListener('click', () => activate('numbers'));
    tabs.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        (e.target === chartBtn ? matrixBtn : chartBtn).click();
        (e.target === chartBtn ? matrixBtn : chartBtn).focus();
      }
    });

    render(matrixPanel, date);
  }

  const api = {
    calculateLifePath,
    calculateDestinyMatrix,
    calculateChakraHealthCard,
    calculateGenerationalLines,
    calculateDestinyAxes,
    reduceArcana,
    reduceLifePath,
    render,
    initResult
  };

  window.AqeeqNumerology = api;

  const mount = () => {
    const root = document.querySelector('#result');
    if (root) initResult(root);
  };

  new MutationObserver(() => {
    const root = document.querySelector('#result');
    if (root && root.dataset.aqmReady === 'true' && !root.querySelector('.aqm-shell')) delete root.dataset.aqmReady;
    mount();
  }).observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener('DOMContentLoaded', mount);
  mount();
})();
