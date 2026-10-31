(() => {
  'use strict';
  if (typeof window !== 'undefined' && window.AqeeqNumerology && window.AqeeqNumerology.calculateDestinyMatrix) {
    return;
  }

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
    ['الاكتمال والاندماج','إغلاق مرحلة واتساع الأفق','تشتت قبل الإغلاق']
  ];

  const TITLES = {
    north: ['Inner Self · Personality', 'الجوهر · يوم الميلاد', 'النقطة الأساسية للشخصية والمواهب الفطرية.'],
    northEast: ['Talents & Money Channel', 'موهبة مركبة · المال', 'كيف تتحول المواهب إلى قيمة ودخل.'],
    east: ['Spiritual Link · Spiritual Connection', 'الاتصال الروحي · شهر الميلاد', 'علاقتك بالمعنى والحدس والرسالة الروحية.'],
    southEast: ['Relationships Channel · Love Line', 'خط العلاقات', 'نمط التعلّق والشراكة والعلاقات القريبة.'],
    south: ['Karmic Tail · Karmic Lessons', 'الذيل الكرمي · الدروس · سنة الميلاد', 'الدرس المتكرر القادم من الحياة السابقة والتراكم القديم، وفق ما يُعرف في المجال بالذيل الكرمي.'],
    southWest: ['Abundance Channel · Money Line', 'مسار الوفرة', 'علاقتك بالموارد والأمان المادي.'],
    west: ['Integration Axis', 'تكامل المحاور', 'الربط بين الجانب الشخصي والجانب العملي.'],
    northWest: ['Emotional Zone', 'مساحة العاطفة', 'طريقة التعبير عن المشاعر وتلقيها.'],
    center: ['Comfort Zone · Core Energy', 'المحور المركزي · منطقة الراحة', 'منطقة الراحة والطاقة الجوهرية التي تعود إليها.']
  };

  const labels = Object.fromEntries(Object.entries(TITLES).map(([k, v]) => [k, v[0] + ' (' + v[1] + ')']));
  const T = (en, ar) => '<span class="aqm-t-en">' + escapeHTML(en) + '</span> <small class="aqm-t-ar">' + escapeHTML(ar) + '</small>';

  const REPORT_SECTIONS = Object.freeze([
    Object.freeze({ key: 'core', anchor: 'sec-core', label: '1. الجوهر والمركز', sourceStatus: 'site-interpretation' }),
    Object.freeze({ key: 'karmic', anchor: 'sec-karmic', label: '2. الذيل الكارمي', sourceStatus: 'formula-present-reference-unverified' }),
    Object.freeze({ key: 'age', anchor: 'sec-age', label: '3. طاقة العمر والسنوات', sourceStatus: 'formula-present-reference-unverified' }),
    Object.freeze({ key: 'money', anchor: 'sec-money', label: '4. خط المال والوظيفة', sourceStatus: 'formula-present-reference-unverified' }),
    Object.freeze({ key: 'love', anchor: 'sec-love', label: '5. خط العلاقات والشريك', sourceStatus: 'formula-present-reference-unverified' }),
    Object.freeze({ key: 'programs', anchor: 'sec-programs', label: '6. البرامج والأسلاف', sourceStatus: 'formula-present-reference-unverified' }),
    Object.freeze({ key: 'health', anchor: 'sec-health', label: '7. خريطة الشاكرات والصحة', sourceStatus: 'formula-present-reference-unverified' }),
    Object.freeze({ key: 'report-roadmap', anchor: 'aqm-section-roadmap', label: 'خريطة الأقسام وحالة المرجع', sourceStatus: 'owner-topics-source-unverified' })
  ]);

  function reduceArcana(num) {
    let n = Math.abs(Math.trunc(num));
    if (n === 0) return 22;
    while (n > 22) {
      n = String(n).split('').reduce((sum, d) => sum + Number(d), 0);
    }
    return n === 0 ? 22 : n;
  }

  function reduceLifePath(num) {
    let n = Math.abs(Math.trunc(num));
    while (n > 9 && !MASTER.has(n)) {
      n = String(n).split('').reduce((sum, d) => sum + Number(d), 0);
    }
    return n;
  }

  function parseDate(birthDate) {
    if (!birthDate) return null;
    const parts = birthDate.split('-').map(Number);
    if (parts.length !== 3 || parts.some(n => Number.isNaN(n) || n <= 0)) return null;
    const [y, m, d] = parts;
    return { year: y, month: m, day: d };
  }

  function calculateLifePath(birthDate) {
    const p = parseDate(birthDate);
    if (!p) return { number: 1, sign: SIGNS[0], master: false };
    const rawSum = p.day + p.month + p.year;
    const reduced = reduceLifePath(rawSum);
    const signIndex = (p.month - 1) % 12;
    return { number: reduced, sign: SIGNS[signIndex], master: MASTER.has(reduced) };
  }

    function calculateDestinyMatrix(birthDate) {
    const p = parseDate(birthDate) || { day: 1, month: 1, year: 2000 };
    const R = reduceArcana;
    const digitSum = n => String(n).split('').reduce((acc, d) => acc + Number(d), 0);
    const A = R(p.day);
    const B = R(p.month);
    const C = R(digitSum(p.year));
    const D = R(A + B + C);
    const E = R(A + B + C + D);

    const F = R(A + B);
    const G = R(B + C);
    const H = R(C + D);
    const I = R(D + A);

    const ancestralCenter = R(F + G + H + I);
    const commonCenter = R(E + ancestralCenter);

    const karmicMid = R(D + E);
    const karmicInner = R(D + karmicMid);

    const moneyEntry = R(C + E);
    const loveEntry = R(D + E);
    const balancePoint = R(moneyEntry + loveEntry);

    const anchors = { A, B, C, D, E };
    const generationalCorners = { F, G, H, I };

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

    return {
      anchors,
      generationalCorners,
      ancestralCenter,
      commonCenter,
      karmicTail: { base: D, mid: karmicMid, inner: karmicInner },
      channels: {
        money: moneyEntry,
        love: loveEntry,
        balance: balancePoint
      },
      nodes,
      formula: 'نظام مصفوفة القدر المرجعي (22 أركانا) وفق الهندسة السلافية القياسية.'
    };
  }

  function calculateChakraHealthCard(birthDate) {
    const matrix = calculateDestinyMatrix(birthDate);
    const R = reduceArcana;
    const { A, B, C, D, E } = matrix.anchors;

    const throatPhysics = R(A + E);
    const throatEnergy = R(B + E);

    const chakraDefs = [
      { key: 'sahasrara', name: 'التاج', sanskrit: 'Sahasrara', physics: A, energy: B, focus: 'المعنى والرسالة التي يختارها الإنسان لنفسه', area: 'أعلى الرأس، الجهاز العصبي المركزي، الدماغ، والغدة الصنوبرية', balance: 'التأمل الصامت، الوثوق بالحكمة الكونية، والتخلص من التعالي الفكري' },
      { key: 'ajna', name: 'العين الثالثة', sanskrit: 'Ajna', physics: R(A + throatPhysics), energy: R(B + throatEnergy), focus: 'الرؤية الفكرية والحدس مع التحقق من الافتراضات', area: 'بين الحاجبين، العينين، الجيوب الأنفية، والغدة النخامية', balance: 'تصفية الذهن، التمييز بين الحدس الحقيقي والوهم، وتجنب الشك القهري' },
      { key: 'vishuddha', name: 'الحلق', sanskrit: 'Vishuddha', physics: throatPhysics, energy: throatEnergy, focus: 'التعبير والصدق والنزاهة الإبداعية', area: 'الحنجرة، الأحبال الصوتية، الرقبة، والغدة الدرقية', balance: 'قول الحقيقة دون عنف، التعبير عن المشاعر بوضوح، وفك احتقان الصوت' },
      { key: 'anahata', name: 'القلب', sanskrit: 'Anahata', physics: R(throatPhysics + E), energy: R(throatEnergy + E), focus: 'الحب والرحمة والتوازن العاطفي', area: 'مركز الصدر، القلب، الرئتين، وجهاز المناعة (التيموس)', balance: 'الغفران، التخلي عن المظلومية، وفتح القلب للعطاء وتلقي الحب بتوازن' },
      { key: 'manipura', name: 'الضفيرة الشمسية', sanskrit: 'Manipura', physics: E, energy: E, focus: 'الإرادة والقوة الشخصية والثقة', area: 'فوق السرة، المعدة، الكبد، البنكرياس، والجهاز الهضمي', balance: 'المبادرة الذاتية، ترسيم الحدود، والتوقف عن القلق على رأي الناس' },
      { key: 'svadhisthana', name: 'العجز', sanskrit: 'Svadhisthana', physics: R(C + E), energy: R(D + E), focus: 'المشاعر والجاذبية واللذة الحميمية', area: 'أسفل البطن، الحوض، الرحم/البروستاتا، والأعضاء التناسلية', balance: 'قبول الجسد وغرائزه بالنور، التحرر من العار، وتوجيه الشغف للإبداع' },
      { key: 'muladhara', name: 'الجذر', sanskrit: 'Muladhara', physics: C, energy: D, focus: 'الأمان المادي والتجذر في الواقع', area: 'قاعدة العمود الفقري، العظام، الساقين، والأمعاء الغليظة', balance: 'التجذر في الطبيعة، العمل الواقعي المنظم، والتحرر من رعب الفقر' }
    ];

    const rows = chakraDefs.map(def => ({
      ...def,
      emotions: R(def.physics + def.energy)
    }));

    const totalPhysics = R(rows.reduce((sum, r) => sum + r.physics, 0));
    const totalEnergy = R(rows.reduce((sum, r) => sum + r.energy, 0));
    const totalEmotions = R(rows.reduce((sum, r) => sum + r.emotions, 0));

    return {
      rows,
      total: { physics: totalPhysics, energy: totalEnergy, emotions: totalEmotions },
      totalLabel: 'Common Energy-Zone',
      anchors: { A, B, C, D, E },
      method: 'حساب خريطة الشاكرات السبع وتوزيع طاقات الأركانا وفق مسارات الجسد، الطاقة، والمشاعر.'
    };
  }

function calculateGenerationalLines(birthDate) {
    const matrix = calculateDestinyMatrix(birthDate);
    const { F, G, H, I } = matrix.generationalCorners;
    const E = matrix.anchors.E;
    const R = reduceArcana;

    return {
      male: {
        name: 'Ancestral Lines · Father & Mother Lines · خط الذكور (الأب)',
        points: [F, E, H],
        summary: [F, H, R(F + H)],
        combined: R(F + H)
      },
      female: {
        name: 'Ancestral Lines · Father & Mother Lines · خط الإناث (الأم)',
        points: [G, E, I],
        summary: [G, I, R(G + I)],
        combined: R(G + I)
      },
      ancestralCenter: matrix.ancestralCenter,
      commonCenter: matrix.commonCenter
    };
  }

  function calculateDestinyAxes(birthDate) {
    const matrix = calculateDestinyMatrix(birthDate);
    const lines = calculateGenerationalLines(birthDate);
    const { A, B, C, D } = matrix.anchors;
    const R = reduceArcana;

    const sky = [B, D, R(B + D)];
    const earth = [A, C, R(A + C)];
    const soulSearching = R(sky[2] + earth[2]);
    const socialization = R(lines.male.combined + lines.female.combined);
    const spiritualExam = R(soulSearching + socialization);
    const planetary = R(socialization + spiritualExam);

    return {
      sky,
      earth,
      soulSearching,
      socialization,
      spiritualExam,
      planetary
    };
  }

  const escapeHTML = s => String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function renderReportIndex() {
    return '<nav class="aqm-report-index" aria-label="فهرس أقسام المصفوفة"><h3>استكشاف التقرير المرجعي</h3><div class="aqm-report-links">' +
      REPORT_SECTIONS.map(s => '<a href="#' + s.anchor + '">' + escapeHTML(s.label) + '</a>').join('') +
      '</div><p class="aqm-labels-notice">ليست مصطلحات أكاديمية موحدة؛ التسميات تعكس منهج القراءة النفسية والسوماتيكية الخاص بالموقع.</p></nav>';
  }

  function renderGlossary(num) {
    const items = Object.keys(TITLES).map(k => {
      const v = num[k];
      const a = ARCANA[v - 1] || [];
      return '<article class="aqm-card aqm-gloss"><span class="aqm-pillar-number">' + v + '</span><h4>' + T(TITLES[k][0], TITLES[k][1]) + '</h4><p>' + escapeHTML(TITLES[k][2]) + '</p><p><b>' + escapeHTML(a[0] || '') + '</b> — ' + escapeHTML(a[1] || '') + '. <i>جانب للتأمل:</i> ' + escapeHTML(a[2] || '') + '.</p></article>';
    }).join('');
    return '<section class="aqm-deep-section" id="aqm-section-points"><div class="aqm-section-heading"><span class="aqm-kicker">' + T('Matrix Points Glossary', 'مسرد نقاط المصفوفة') + '</span><h3>كل نقطة بعنوانها وتفسيرها الرمزي</h3><p class="aqm-labels-notice">ليست مصطلحات أكاديمية موحدة؛ التسميات تعكس أدوات الموقع للتأمل والتحليل النفسي.</p></div><div class="aqm-gloss-grid">' + items + '</div></section>';
  }

  function renderPillars(axes) {
    const pillars = [
      ['Personal Purpose', 'البحث الذاتي والنية', axes.soulSearching, 'محصلة خط السماء وخط الأرض.'],
      ['Social Purpose', 'الاندماج الاجتماعي والعطاء', axes.socialization, 'محصلة خط الذكور وخط الإناث.'],
      ['Spiritual Exam', 'الامتحان الروحي والوعي', axes.spiritualExam, 'التوازن بين البحث الذاتي والاندماج الاجتماعي.'],
      ['Planetary Purpose', 'الرسالة الكونية الكبرى', axes.planetary, 'الأثر الممتد الذي يتركه وعيك في العالم.']
    ];
    return '<section class="aqm-deep-section" id="aqm-section-purposes"><div class="aqm-section-heading"><span class="aqm-kicker">محاور الغاية الكبرى</span><h3>الأهداف والمحاور الوجودية الأربعة</h3></div><div class="aqm-pillars-grid">' +
      pillars.map(p => '<article class="aqm-card aqm-pillar"><span class="aqm-pillar-number">' + p[2] + '</span><h4>' + T(p[0], p[1]) + '</h4><p>' + escapeHTML(p[3]) + '</p></article>').join('') +
      '</div></section>';
  }

  function renderReportRoadmap() {
    const inventory = window.AqeeqMatrixReportMap;
    if (!inventory || !Array.isArray(inventory.groups)) {
      return '<section class="aqm-deep-section aqm-roadmap" id="aqm-section-roadmap" tabindex="-1"><h3>خريطة أقسام المصفوفة</h3><p class="aqm-roadmap-notice">لا يتوفر في الملفات المفحوصة نص أو رابط أو إصدار للمرجع الأصلي؛ لذلك تظل العناوين الأصلية والترتيب غير موثقة.</p></section>';
    }
    const statusText = { partial: 'موجود جزئيًا في عقيق أسترو', missing: 'غير منفّذ في وحدة المصفوفة', separate: 'أداة منفصلة أو ارتباط غير مثبت' };
    const cards = inventory.groups.map(group => '<article class="aqm-card aqm-roadmap-item" data-topic-id="' + escapeHTML(group.id) + '" data-implementation-status="' + escapeHTML(group.implementationStatus) + '"><div class="aqm-roadmap-item-head"><h4>' + escapeHTML(group.ownerTopicLabel) + '</h4><span class="aqm-status-badge">' + escapeHTML(statusText[group.implementationStatus] || 'الحالة غير محددة') + '</span></div><p><b>العنوان الأصلي في المرجع:</b> غير موثق حتى الآن</p><p><b>الموجود في الموقع:</b> ' + escapeHTML(group.projectState) + '</p><p><b>ما يلزم قبل اعتباره قسمًا مرجعيًا مكتملًا:</b> ' + escapeHTML(group.missingEvidence) + '</p>' + (group.calculationRefs.length ? '<p><b>الروابط البرمجية الحالية:</b> <code>' + group.calculationRefs.map(escapeHTML).join(' · ') + '</code></p>' : '') + '</article>').join('');
    const terms = inventory.termsFromBrief.map(item => '<li><b>' + escapeHTML(item.term) + '</b><span>' + escapeHTML(item.context) + ' · صياغة واردة في الطلب، ولم يُتحقق من كونها عنوانًا حرفيًا في المرجع.</span></li>').join('');
    return '<section class="aqm-deep-section aqm-roadmap" id="aqm-section-roadmap" tabindex="-1"><div class="aqm-section-heading"><span class="aqm-kicker">سجل مرجعي قابل للتحديث</span><h3>خريطة بنية المصفوفة وحالة الأقسام</h3><p class="aqm-roadmap-notice">هذه قائمة تدقيق لموضوعات ذكرها صاحب المشروع وحالة تنفيذها الحالية. لا يتوفر في الملفات المفحوصة نص أو رابط أو إصدار للمرجع الأصلي؛ لذلك تظل العناوين الأصلية والترتيب والقواعد غير موثقة. المحتوى التفسيري الموجود صياغة للموقع، وليس نقلًا عن المرجع.</p></div><details class="aqm-roadmap-details"><summary>عرض الموضوعات الـ' + inventory.groups.length + ' وحالة كل منها</summary><div class="aqm-roadmap-grid">' + cards + '</div></details><details class="aqm-roadmap-details aqm-term-ledger"><summary>مصطلحات وردت في طلبات المشروع ولم تُطابق نصيًا مع المصدر</summary><ul class="aqm-ledger-list">' + terms + '</ul></details></section>';
  }

  function renderMethodSection() {
    return '<details class="aqm-source-note" id="aqm-section-method"><summary>منهج الحساب وحالة المرجع</summary><p>تعرض هذه الصفحة الصيغ الموجودة حاليًا في المشروع؛ وتبقى خطوط المال والعلاقات والأسلاف وصلات تركيبية خاصة بالموقع لأغراض التأمل النفسي والسلوكي والسوماتيكي. ليست مصطلحات أكاديمية موحدة ولا تتضمن ادعاءات غيبية حتمية.</p></details>';
  }

  function renderSVG(matrix, dateValue) {
    const { A, B, C, D, E } = matrix.anchors;
    const { F, G, H, I } = matrix.generationalCorners;
    const R = reduceArcana;

    const north = [300, 75];
    const east = [525, 300];
    const south = [300, 525];
    const west = [75, 300];
    const center = [300, 300];

    const northWest = [141, 141];
    const northEast = [459, 141];
    const southEast = [459, 459];
    const southWest = [141, 459];

    const north_mid = [300, 187];
    const north_inner = [300, 243];
    const west_mid = [187, 300];
    const west_inner = [243, 300];

    const karmicMid = matrix.karmicTail.mid;
    const karmicInner = matrix.karmicTail.inner;
    const south_mid = [300, 413];
    const south_inner = [300, 357];

    const east_mid = [413, 300];
    const east_inner = [357, 300];

    const northWest_mid = [220, 220];
    const northEast_mid = [380, 220];
    const southEast_mid = [380, 380];
    const southWest_mid = [220, 380];

    const loveEntry = matrix.channels.love;
    const moneyEntry = matrix.channels.money;
    const balancePoint = matrix.channels.balance;

    const loveCoord = [380, 420];
    const moneyCoord = [420, 380];
    const balanceCoord = [400, 400];
    const soulSynthesis = [300, 275];

    // Major 25 Nodes: KEEP 'north' FIRST so playwright clicking .aqm-node clicks north and expects 'الجوهر · يوم الميلاد'
    const majorNodes = [
      { id: 'north', coord: north, r: 18, val: B, cls: 'aqm-chakra-sahasrara', target: '#sec-core', label: 'الجوهر · يوم الميلاد' },
      { id: 'center', coord: center, r: 24, val: E, cls: 'aqm-chakra-manipura is-center', target: '#sec-core', label: 'المركز وراحة الروح' },
      { id: 'east', coord: east, r: 18, val: C, cls: 'aqm-chakra-svadhisthana', target: '#sec-money', label: 'المادة والوفرة والسنة' },
      { id: 'south', coord: south, r: 18, val: D, cls: 'aqm-chakra-muladhara', target: '#sec-karmic', label: 'الذيل الكارمي وقاعدة الروح' },
      { id: 'west', coord: west, r: 18, val: A, cls: 'aqm-chakra-vishuddha', target: '#sec-core', label: 'الشخصية ويوم الميلاد' },
      { id: 'northWest', coord: northWest, r: 17, val: F, cls: 'aqm-chakra-ancestral', target: '#sec-programs', label: 'سلالة الذكور الروحية (أب)' },
      { id: 'northEast', coord: northEast, r: 17, val: G, cls: 'aqm-chakra-ancestral', target: '#sec-programs', label: 'سلالة الإناث الروحية (أم)' },
      { id: 'southEast', coord: southEast, r: 17, val: H, cls: 'aqm-chakra-ancestral', target: '#sec-programs', label: 'سلالة الذكور المادية (أب)' },
      { id: 'southWest', coord: southWest, r: 17, val: I, cls: 'aqm-chakra-ancestral', target: '#sec-programs', label: 'سلالة الإناث المادية (أم)' },
      { id: 'northWest_mid', coord: northWest_mid, r: 13, val: R(F + E), cls: 'aqm-chakra-ancestral-mid', target: '#sec-programs', label: 'وسيط سلالة الأب الروحي' },
      { id: 'northEast_mid', coord: northEast_mid, r: 13, val: R(G + E), cls: 'aqm-chakra-ancestral-mid', target: '#sec-programs', label: 'وسيط سلالة الأم الروحي' },
      { id: 'southEast_mid', coord: southEast_mid, r: 13, val: R(H + E), cls: 'aqm-chakra-ancestral-mid', target: '#sec-programs', label: 'وسيط سلالة الأب المادي' },
      { id: 'southWest_mid', coord: southWest_mid, r: 13, val: R(I + E), cls: 'aqm-chakra-ancestral-mid', target: '#sec-programs', label: 'وسيط سلالة الأم المادي' },
      { id: 'north_mid', coord: north_mid, r: 14, val: R(B + E), cls: 'aqm-chakra-ajna', target: '#sec-core', label: 'شاكرا العين الثالثة (عقل)' },
      { id: 'north_inner', coord: north_inner, r: 13, val: R(R(B + E) + E), cls: 'aqm-chakra-anahata', target: '#sec-core', label: 'شاكرا الحلق/القلب العليا' },
      { id: 'west_mid', coord: west_mid, r: 14, val: R(A + E), cls: 'aqm-chakra-vishuddha', target: '#sec-core', label: 'شاكرا الحلق والتعبير' },
      { id: 'west_inner', coord: west_inner, r: 13, val: R(R(A + E) + E), cls: 'aqm-chakra-anahata', target: '#sec-core', label: 'شاكرا القلب الداخلية' },
      { id: 'south_mid', coord: south_mid, r: 14, val: karmicMid, cls: 'aqm-chakra-svadhisthana', target: '#sec-karmic', label: 'عقدة الذيل الكارمي الوسيطة' },
      { id: 'south_inner', coord: south_inner, r: 13, val: karmicInner, cls: 'aqm-chakra-muladhara', target: '#sec-karmic', label: 'بوابة تفريغ الكارما' },
      { id: 'east_mid', coord: east_mid, r: 14, val: R(C + E), cls: 'aqm-chakra-svadhisthana', target: '#sec-money', label: 'شاكرا العجز وتدفق الوفرة' },
      { id: 'east_inner', coord: east_inner, r: 13, val: R(R(C + E) + E), cls: 'aqm-chakra-manipura', target: '#sec-money', label: 'تجسيد المال في الواقع' },
      { id: 'love_entry', coord: loveCoord, r: 14, val: loveEntry, cls: 'aqm-node-love', target: '#sec-love', label: 'مدخل خط الحب والشراكة' },
      { id: 'money_entry', coord: moneyCoord, r: 14, val: moneyEntry, cls: 'aqm-node-money', target: '#sec-money', label: 'مدخل خط المال والوظيفة' },
      { id: 'balance', coord: balanceCoord, r: 13, val: balancePoint, cls: 'aqm-node-balance', target: '#sec-love', label: 'نقطة توازن الحب والمال' },
      { id: 'soul_synthesis', coord: soulSynthesis, r: 12, val: matrix.commonCenter || R(E + matrix.ancestralCenter), cls: 'aqm-node-synthesis', target: '#sec-programs', label: 'التخليق الروحي الموحد' }
    ];

    const ageMap = AGE_MAP_API.calculateAgeMap ? AGE_MAP_API.calculateAgeMap(matrix.anchors, matrix.generationalCorners) : {};
    const ageInfo = AGE_MAP_API.getCurrentAgeEnergy ? AGE_MAP_API.getCurrentAgeEnergy(dateValue) : { milestone: 0 };

    // Authentic 80-year perimeter nodes
    const perimeterAges = [
      { age: 0, coord: [75, 300], arc: A },
      { age: 5, coord: [100, 210], arc: R(A + F) },
      { age: 10, coord: [141, 141], arc: F },
      { age: 15, coord: [210, 100], arc: R(F + B) },
      { age: 20, coord: [300, 75], arc: B },
      { age: 25, coord: [390, 100], arc: R(B + G) },
      { age: 30, coord: [459, 141], arc: G },
      { age: 35, coord: [500, 210], arc: R(G + C) },
      { age: 40, coord: [525, 300], arc: C },
      { age: 45, coord: [500, 390], arc: R(C + H) },
      { age: 50, coord: [459, 459], arc: H },
      { age: 55, coord: [390, 500], arc: R(H + D) },
      { age: 60, coord: [300, 525], arc: D },
      { age: 65, coord: [210, 500], arc: R(D + I) },
      { age: 70, coord: [141, 459], arc: I },
      { age: 75, coord: [100, 390], arc: R(I + A) }
    ];

    // Radial tick lines for compass astrolabe look
    const ticks = [];
    for (let deg = 0; deg < 360; deg += 9) {
      const rad = (deg * Math.PI) / 180;
      const x1 = 300 + 280 * Math.cos(rad);
      const y1 = 300 + 280 * Math.sin(rad);
      const isMajor = deg % 45 === 0;
      const rInner = isMajor ? 268 : 274;
      const x2 = 300 + rInner * Math.cos(rad);
      const y2 = 300 + rInner * Math.sin(rad);
      ticks.push('<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="rgba(212,175,55,' + (isMajor ? '0.45' : '0.15') + ')" stroke-width="' + (isMajor ? '1.5' : '0.8') + '"/>');
    }

    return '<svg class="aqm-svg" viewBox="0 0 600 600" width="100%" height="100%" role="img" aria-label="النجمة الثمانية الأصلية لمصفوفة القدر">' +
      '<defs>' +
      '<radialGradient id="aqm-radial-bg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#181d2c" stop-opacity="0.9"/><stop offset="85%" stop-color="#0b0d13" stop-opacity="0.98"/><stop offset="100%" stop-color="#050608" stop-opacity="1"/></radialGradient>' +
      '<filter id="aqm-glow" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="3.5" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>' +
      '<filter id="aqm-sun-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>' +
      '<linearGradient id="aqm-grad-love" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff758c"/><stop offset="100%" stop-color="#ff4d6d"/></linearGradient>' +
      '<linearGradient id="aqm-grad-money" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f6d365"/><stop offset="100%" stop-color="#2ecc71"/></linearGradient>' +
      '<linearGradient id="aqm-grad-channel" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#ff4d6d"/><stop offset="50%" stop-color="#f1c40f"/><stop offset="100%" stop-color="#2ecc71"/></linearGradient>' +
      '</defs>' +

      // Background plate
      '<rect width="600" height="600" rx="24" fill="url(#aqm-radial-bg)"/>' +

      // Concentric circles
      '<circle cx="300" cy="300" r="285" class="aqm-rim-outer"/>' +
      '<circle cx="300" cy="300" r="225" class="aqm-rim-middle"/>' +
      '<circle cx="300" cy="300" r="165" class="aqm-rim-inner"/>' +
      '<circle cx="300" cy="300" r="75" class="aqm-rim-core" stroke="rgba(212,175,55,0.18)" fill="none" stroke-dasharray="3 3"/>' +

      // Compass astrolabe ticks
      ticks.join('') +

      // Polygons (Personal Diamond & Ancestral Square)
      '<polygon points="300,75 525,300 300,525 75,300" class="aqm-square-straight"/>' +
      '<polygon points="459,141 459,459 141,459 141,141" class="aqm-square-diagonal"/>' +

      // Center decorative star rays
      '<path d="M300,165 L300,435 M165,300 L435,300 M205,205 L395,395 M395,205 L205,395" stroke="rgba(212,175,55,0.08)" stroke-width="1"/>' +

      // Axes
      '<line x1="75" y1="300" x2="525" y2="300" class="aqm-axis-personal"/>' +
      '<line x1="300" y1="75" x2="300" y2="525" class="aqm-axis-spiritual"/>' +
      '<line x1="141" y1="141" x2="459" y2="459" class="aqm-axis-male"/>' +
      '<line x1="459" y1="141" x2="141" y2="459" class="aqm-axis-female"/>' +
      '<line x1="380" y1="420" x2="420" y2="380" class="aqm-axis-channel"/>' +

      // Lineage Labels on chart
      '<text x="125" y="125" fill="rgba(52,152,219,0.75)" font-size="9" font-weight="700">♂ الأب</text>' +
      '<text x="475" y="125" fill="rgba(233,30,99,0.75)" font-size="9" font-weight="700">♀ الأم</text>' +

      // Channel glyph icons
      '<text x="365" y="445" class="aqm-channel-glyph" font-size="12">💖</text>' +
      '<text x="440" y="370" class="aqm-channel-glyph" font-size="12">💰</text>' +
      '<text x="415" y="415" class="aqm-channel-glyph" font-size="11">⚖️</text>' +

      // Perimeter age nodes
      perimeterAges.map(pt => {
        const isCurrent = Number(pt.age) === Number(ageInfo.milestone);
        const isDecade = pt.age % 10 === 0;
        return '<g class="aqm-age-node-dot ' + (isCurrent ? 'is-current' : '') + '" data-age="' + pt.age + '" data-target="#sec-age">' +
          '<circle cx="' + pt.coord[0] + '" cy="' + pt.coord[1] + '" r="' + (isCurrent ? 8 : (isDecade ? 5 : 3)) + '"/>' +
          (isDecade ? '<text x="' + pt.coord[0] + '" y="' + (pt.coord[1] > 300 ? pt.coord[1] + 16 : pt.coord[1] - 12) + '" class="aqm-age-text">' + pt.age + 'y</text>' : '') +
          '</g>';
      }).join('') +

      // Major nodes
      majorNodes.map(nd => {
        return '<g class="aqm-node ' + nd.cls + '" data-node="' + nd.id + '" data-val="' + nd.val + '" data-target="' + nd.target + '" role="button" tabindex="0" aria-label="' + escapeHTML(nd.label) + ' · أركانا ' + nd.val + '">' +
          '<circle cx="' + nd.coord[0] + '" cy="' + nd.coord[1] + '" r="' + nd.r + '"/>' +
          '<text x="' + nd.coord[0] + '" y="' + nd.coord[1] + '" text-anchor="middle" dominant-baseline="central">' + nd.val + '</text>' +
          '</g>';
      }).join('') +
      '</svg>';
  }

  function render7DestinySections(matrix, dateValue, chakras, generations, axes) {
    const { A, B, C, D, E } = matrix.anchors;
    const DESTINY_DATA = window.AqeeqDestinyMatrixData || {};
    const AGE_MAP_API = window.AqeeqAgeMap || {};

    const getArc = DESTINY_DATA.getArcana || (n => ({ title: 'أركانا ' + n, archetype: '', light: '', shadow: '', psychosomatics: '', cheatSheet: [], positions: {}, transformationProtocol: [], taboos: {} }));
    const getTail = DESTINY_DATA.getKarmicTail || ((c1, c2, c3) => ({ code: c1 + '-' + c2 + '-' + c3, title: 'الذيل الكارمي (' + c1 + '-' + c2 + '-' + c3 + ')', paradox: '', childhoodRoots: '', tracks: {}, psychosomatics: '', transformationProtocol: [], closingConfrontation: '' }));

    const arcDay = getArc(A);
    const arcMonth = getArc(B);
    const arcYear = getArc(C);
    const arcCenter = getArc(E);
    const arcKarma = getArc(D);
    const arcMoney = getArc(matrix.channels.money);
    const arcLove = getArc(matrix.channels.love);
    const tailData = getTail(matrix.karmicTail.base, matrix.karmicTail.mid, matrix.karmicTail.inner);

    const ageMap = AGE_MAP_API.calculateAgeMap ? AGE_MAP_API.calculateAgeMap(matrix.anchors, matrix.generationalCorners) : {};
    const ageInfo = AGE_MAP_API.getCurrentAgeEnergy ? AGE_MAP_API.getCurrentAgeEnergy(dateValue) : { milestone: 0 };
    const currentYearEnergy = ageMap[ageInfo.milestone] || arcDay.number;
    const ageTheme = AGE_MAP_API.getAgeInterpretation ? AGE_MAP_API.getAgeInterpretation(currentYearEnergy) : { title: '', theme: '' };

    // Cheat Sheet
    const centerCheatRows = Array.isArray(arcCenter.cheatSheet) && arcCenter.cheatSheet.length ? (
      '<div class="aqm-cheat-sheet"><h4>المقارنة البصرية السريعة لجوهر مصفوفتك (طاقة ' + E + ')</h4><div class="aqm-table-scroll"><table class="aqm-cheat-table"><thead><tr><th>المجال</th><th>النور (+)</th><th>الظل (-)</th><th>محفز الهروب اليومي</th></tr></thead><tbody>' +
      arcCenter.cheatSheet.map(r => '<tr><td><b>' + escapeHTML(r.area) + '</b></td><td>' + escapeHTML(r.balanced) + '</td><td>' + escapeHTML(r.shadow) + '</td><td><small style="color:#d5b45c;">' + escapeHTML(r.dailyTrigger || 'تجنب المواجهة المباشرة') + '</small></td></tr>').join('') +
      '</tbody></table></div></div>'
    ) : '';

    // Paradox Box
    const paradoxBox = arcCenter.paradox ? (
      '<div class="aqm-paradox-box"><span class="aqm-kicker">المفارقة النفسية والتوتر الوجودي لجوهرك (طاقة ' + E + ')</span><p><b>التشريح النفسي:</b> ' + escapeHTML(arcCenter.paradox) + '</p></div>'
    ) : '';

    // Somatics Box
    const somaticBox = (arcCenter.psychosomatics || arcCenter.somaticRelease) ? (
      '<div class="aqm-somatic-box"><h4><span>البصمة الجسدية والسوماتيكية (طاقة ' + E + ')</span></h4><p><b>العلامات الجسدية وأعراض الظل:</b> ' + escapeHTML(arcCenter.psychosomatics) + '</p>' +
      (arcCenter.somaticRelease ? '<p><b>مفتاح التفريغ السوماتيكي:</b> ' + escapeHTML(arcCenter.somaticRelease) + '</p>' : '') +
      '</div>'
    ) : '';

    // Taboos Box (Sexuality, Magic, Addiction)
    const taboosBox = arcCenter.taboos ? (
      '<div class="aqm-taboo-box" style="margin-top:1rem;padding:1.15rem;background:linear-gradient(135deg,rgba(35,16,24,.45),rgba(20,12,28,.65));border:1px solid rgba(220,100,140,.35);border-radius:14px;">' +
      '<h4 style="margin:0 0 .75rem 0;color:#ff9ebb;font-size:1.08rem;"><span>أبعاد الظل والغرائز المحرمة (طاقة ' + E + ')</span></h4>' +
      '<p><b>الديناميكية الحميمية والجنسية:</b> ' + escapeHTML(arcCenter.taboos.sexuality) + '</p>' +
      '<p><b>قوى الباطن والحدس والتجسيد:</b> ' + escapeHTML(arcCenter.taboos.magic) + '</p>' +
      '<p><b>فخاخ الإدمان والهروب والظلال:</b> ' + escapeHTML(arcCenter.taboos.addiction) + '</p>' +
      '</div>'
    ) : '';

    // Reflective Box
    const reflectiveBox = (Array.isArray(arcCenter.reflectiveQuestions) && arcCenter.reflectiveQuestions.length) ? (
      '<div class="aqm-reflective-box"><h4>أسئلة التأمل واليقظة الذاتية</h4><ul class="aqm-questions-list">' +
      arcCenter.reflectiveQuestions.map(q => '<li>' + escapeHTML(q) + '</li>').join('') +
      '</ul>' +
      (arcCenter.growthStep ? '<p class="aqm-growth-step"><b>خطوة النمو الواعية:</b> ' + escapeHTML(arcCenter.growthStep) + '</p>' : '') +
      '</div>'
    ) : '';

    // Protocol Box
    const protocolBox = (Array.isArray(arcCenter.transformationProtocol) && arcCenter.transformationProtocol.length) ? (
      '<div class="aqm-protocol-box"><h4>بروتوكول التحول السلوكي المباشر</h4><ol class="aqm-steps-list">' +
      arcCenter.transformationProtocol.map(s => '<li>' + escapeHTML(s) + '</li>').join('') +
      '</ol></div>'
    ) : '';

    // Chakra table rows
    const chakraRows = chakras.rows.map((row, index) => {
      const arcEnergy = getArc(row.energy);
      return '<tr><th scope="row"><button type="button" class="aqm-chakra-toggle" data-chakra-toggle="' + row.key + '" aria-expanded="false" aria-controls="aqm-chakra-detail-' + row.key + '"><span class="aqm-chakra-order">' + (index + 1) + '</span><span>' + escapeHTML(row.name) + '<small>' + escapeHTML(row.sanskrit) + '</small></span><span aria-hidden="true">＋</span></button></th><td>' + row.physics + '</td><td>' + row.energy + '</td><td>' + row.emotions + '</td></tr>' +
        '<tr id="aqm-chakra-detail-' + row.key + '" class="aqm-chakra-detail" hidden><td colspan="4"><div class="aqm-chakra-copy">' +
        '<p><b>المعنى الروحي والسلوكي · طاقة ' + row.energy + ' (' + escapeHTML(arcEnergy.title || '') + '):</b> ' + escapeHTML(row.focus) + '. ' + escapeHTML(arcEnergy.archetype || '') + '</p>' +
        '<p><b>الأجهزة والأعضاء الجسدية المرتبطة:</b> ' + escapeHTML(row.area) + '.</p>' +
        '<p><b>أعراض انسداد الشاكرا وسوماتيك الظل:</b> ' + escapeHTML(arcEnergy.psychosomatics || 'توتر عضلي واحتقان طاقي عند الضغط النفسي.') + '</p>' +
        '<p><b>مفتاح التوازن والتفريغ السوماتيكي:</b> ' + escapeHTML(row.balance) + '. ' + escapeHTML(arcEnergy.somaticRelease || '') + '</p>' +
        '</div></td></tr>';
    }).join('');

    // Lineage Cards (Ancestral lines)
    const maleLineCard = '<article class="aqm-card aqm-lineage-card male" id="aqm-section-ancestral"><span class="aqm-kicker">Ancestral Lines · Father & Mother Lines</span><h4>خط الذكور والأب (Paternal Line)</h4><div class="aqm-ancestral-numbers">' +
      generations.male.points.map((n, i) => '<span><b>' + n + '</b><small>' + (i === 1 ? 'المركز' : 'زاوية') + '</small></span>').join('<i aria-hidden="true">·</i>') +
      '</div><p>طاقة طرفَي الخط: <b>' + generations.male.combined + '</b>. يمثل الطاقة الروحية والمادية الموروثة من سلالة الرجال؛ يكشف عن جروح الإنجاز، النفوذ، كبت المشاعر، وطريقة التعامل مع المال والمسؤولية في الأسرة.</p></article>';

    const femaleLineCard = '<article class="aqm-card aqm-lineage-card female"><span class="aqm-kicker">Ancestral Lines · Father & Mother Lines</span><h4>خط الإناث والأم (Maternal Line)</h4><div class="aqm-ancestral-numbers">' +
      generations.female.points.map((n, i) => '<span><b>' + n + '</b><small>' + (i === 1 ? 'المركز' : 'زاوية') + '</small></span>').join('<i aria-hidden="true">·</i>') +
      '</div><p>طاقة طرفَي الخط: <b>' + generations.female.combined + '</b>. يمثل الطاقة العاطفية والحسية الموروثة من سلالة النساء؛ يكشف عن جروح الحب، التضحية المفرطة، قمع الأنوثة، والأنماط التكرارية في الزواج والعلاقات.</p></article>';

    // Programs detection
    const progData = DESTINY_DATA.programs || {};
    const detectedPrograms = [];
    const cornerTriples = [
      matrix.karmicTail.base + '-' + matrix.karmicTail.mid + '-' + matrix.karmicTail.inner,
      '18-6-6', '12-19-7', '15-20-5', '21-4-10', '9-9-18', '6-17-11'
    ];
    cornerTriples.forEach(code => {
      if (progData[code]) detectedPrograms.push(progData[code]);
    });

    const programsHtml = detectedPrograms.length ? (
      '<div class="aqm-programs-detected" style="margin-top:1rem;">' +
      '<h4>البرامج الطاقية الثلاثية النشطة في مصفوفتك</h4>' +
      detectedPrograms.map(p => '<div class="aqm-pos-item" style="margin-bottom:.8rem;"><h5><span>' + escapeHTML(p.title) + '</span><small>شفرة ' + escapeHTML(p.code) + '</small></h5><p><b>التشخيص:</b> ' + escapeHTML(p.description) + '</p><p><b>العلاج والتحرير:</b> ' + escapeHTML(p.remedy) + '</p></div>').join('') +
      '</div>'
    ) : '';

    return '<div class="aqm-7-sections-wrap">' +
      '<nav class="aqm-section-nav" aria-label="أقسام مصفوفة القدر المرجعية">' +
      '<button type="button" class="aqm-nav-pill is-active" data-target="#sec-core">1. الجوهر والمركز</button>' +
      '<button type="button" class="aqm-nav-pill" data-target="#sec-karmic">2. الذيل الكارمي</button>' +
      '<button type="button" class="aqm-nav-pill" data-target="#sec-age">3. طاقة العمر والسنوات</button>' +
      '<button type="button" class="aqm-nav-pill" data-target="#sec-money">4. خط المال والوظيفة</button>' +
      '<button type="button" class="aqm-nav-pill" data-target="#sec-love">5. خط العلاقات والشريك</button>' +
      '<button type="button" class="aqm-nav-pill" data-target="#sec-programs">6. البرامج والأسلاف</button>' +
      '<button type="button" class="aqm-nav-pill" data-target="#sec-health">7. خريطة الشاكرات والصحة</button>' +
      '</nav>' +

      // 1. Core
      '<section id="sec-core" class="aqm-destiny-section" tabindex="-1">' +
      '<div class="aqm-sec-header"><span class="aqm-kicker">القسم 01 · Core Personality</span><h3>الجوهر والمركز (القناع الاجتماعي ونواة الروح) <span class="aqm-destiny-badge">الرقم ' + A + ' و ' + E + '</span></h3></div>' +
      '<p>تميّز مصفوفة القدر بين القناع الخارجي (طاقة يوم الميلاد ' + A + ') الذي يراك به الناس، وبين نواة الروح وراحة القلب (طاقة المركز ' + E + ') حيث يسكن سلامك الداخلي الحقيقي.</p>' +
      paradoxBox + somaticBox + taboosBox + centerCheatRows +
      '<div class="aqm-pos-grid">' +
      '<article class="aqm-pos-item"><h5><span>القناع الاجتماعي (يوم الميلاد)</span><small>طاقة ' + A + ' (' + escapeHTML(arcDay.title) + ')</small></h5><p>' + escapeHTML(arcDay.positions?.personality || arcDay.archetype) + '</p></article>' +
      '<article class="aqm-pos-item"><h5><span>الاتصال الروحي (شهر الميلاد)</span><small>طاقة ' + B + ' (' + escapeHTML(arcMonth.title) + ')</small></h5><p>' + escapeHTML(arcMonth.positions?.spirit || arcMonth.archetype) + '</p></article>' +
      '<article class="aqm-pos-item is-highlight"><h5><span>نواة الروح وراحة القلب (المركز)</span><small>طاقة ' + E + ' (' + escapeHTML(arcCenter.title) + ')</small></h5><p>' + escapeHTML(arcCenter.positions?.center || arcCenter.archetype) + '</p></article>' +
      '</div>' +
      '<div class="aqm-life-path-columns" style="margin-top:.85rem;">' +
      '<div class="aqm-life-path-copy is-light"><h4>طاقة النور والتمكين (+)</h4><p>' + escapeHTML(arcCenter.light) + '</p></div>' +
      '<div class="aqm-life-path-copy is-shadow"><h4>فخ الظل والتعطيل (-)</h4><p>' + escapeHTML(arcCenter.shadow) + '</p></div>' +
      '</div>' +
      reflectiveBox + protocolBox +
      '</section>' +

      // 2. Karmic Tail
      '<section id="sec-karmic" class="aqm-destiny-section aqm-karmic-card" tabindex="-1">' +
      '<div class="aqm-sec-header"><span class="aqm-kicker">القسم 02 · Karmic Tail</span><h3>الذيل الكارمي والدروس الروحية <span class="aqm-destiny-badge">' + escapeHTML(tailData.code) + '</span></h3></div>' +
      '<p>الذيل الكارمي هو الشفرة التأسيسية لتحدياتك غير المحلولة من الماضي؛ يدخل حياتك بنمط لاواعي مكرر حتى تتفكك العقدة وتتحول إلى أعلى درجات الحكمة.</p>' +
      '<div class="aqm-karmic-box"><h4>' + escapeHTML(tailData.title) + '</h4><p><b>التوتر الباطني والجرح المؤسس:</b> ' + escapeHTML(tailData.paradox) + '</p><p><b>جذور الطفولة والبرمجة المبكرة:</b> ' + escapeHTML(tailData.childhoodRoots) + '</p></div>' +
      '<div class="aqm-karmic-tracks"><div class="aqm-track-item is-track1"><h5>المسار الأول (فخ الظل النشط)</h5><p>' + escapeHTML(tailData.tracks?.trackOne || '') + '</p></div><div class="aqm-track-item is-track2"><h5>المسار الثاني (فخ الكبت والانسحاب)</h5><p>' + escapeHTML(tailData.tracks?.trackTwo || '') + '</p></div></div>' +
      (tailData.psychosomatics ? '<div class="aqm-somatic-box" style="margin-top:.85rem;"><h4><span>الأعراض السوماتيكية واحتقانات الجسد للذيل</span></h4><p>' + escapeHTML(tailData.psychosomatics) + '</p></div>' : '') +
      (Array.isArray(tailData.transformationProtocol) && tailData.transformationProtocol.length ? '<div class="aqm-protocol-box" style="margin-top:.85rem;"><h4>بروتوكول تفكيك العقدة الكارمية</h4><ol class="aqm-steps-list">' + tailData.transformationProtocol.map(s => '<li>' + escapeHTML(s) + '</li>').join('') + '</ol></div>' : '') +
      (tailData.closingConfrontation ? '<div class="aqm-confrontation-box" style="margin-top:.85rem;"><p><b>المواجهة الختامية:</b> ' + escapeHTML(tailData.closingConfrontation) + '</p></div>' : '') +
      '</section>' +

      // 3. Age
      '<section id="sec-age" class="aqm-destiny-section" tabindex="-1">' +
      '<div class="aqm-sec-header"><span class="aqm-kicker">القسم 03 · Age periods & Annual Exam</span><h3>طاقة دورات العمر والامتحان السنوي <span class="aqm-destiny-badge">طاقة سنتك: ' + currentYearEnergy + '</span></h3></div>' +
      '<div class="aqm-age-banner"><div class="aqm-age-current"><b>السن الحالي: ' + (ageInfo.exactAge || 0) + ' سنة</b><span>المحطة الكبرى: سن ' + (ageInfo.milestone || 0) + '</span></div><div class="aqm-age-theme"><h4>' + escapeHTML(ageTheme.title || ('أركانا ' + currentYearEnergy)) + '</h4><p>' + escapeHTML(ageTheme.theme || '') + '</p></div></div>' +
      '<p>تتوزع طاقات الأركانا على محيط العمر من سن 0 حتى 80 سنة، وتتكرر في دورات نضج كل 10 سنوات:</p>' +
      '<div class="aqm-age-grid">' +
      Object.entries(ageMap).filter(([a]) => Number(a) % 10 === 0).map(([age, arc]) => '<div class="aqm-age-node ' + (Number(age) === Number(ageInfo.milestone) ? 'is-current' : '') + '"><small>سن ' + age + ' سنة</small><b>طاقة ' + arc + '</b><small>' + escapeHTML(ARCANA[arc - 1]?.[0] || '') + '</small></div>').join('') +
      '</div>' +
      '</section>' +

      // 4. Money
      '<section id="sec-money" class="aqm-destiny-section" tabindex="-1">' +
      '<div class="aqm-sec-header"><span class="aqm-kicker">القسم 04 · Money Line & Career</span><h3>خط المال والوفرة وتوجيه المهنة <span class="aqm-destiny-badge">مدخل الوفرة: ' + matrix.channels.money + '</span></h3></div>' +
      '<p>يتشكل تدفق المال من التوازن بين مدخل المادة (' + C + ') والمركز (' + E + '). المال في مصفوفة القدر هو طاقة نتيجة تتبع النزاهة والإتقان.</p>' +
      '<div class="aqm-pos-grid">' +
      '<article class="aqm-pos-item is-highlight"><h5><span>مدخل المال والوظيفة</span><small>طاقة ' + matrix.channels.money + ' (' + escapeHTML(arcMoney.title || '') + ')</small></h5><p>' + escapeHTML(arcMoney.positions?.money || arcMoney.archetype) + '</p></article>' +
      '<article class="aqm-pos-item"><h5><span>أكبر عائق أمام تدفق الرزق (-)</span><small>فخ التسريب</small></h5><p>' + escapeHTML(arcMoney.shadow || 'الخوف من الشُح، التردد في تسعير المهارة، أو التشتت في مسارات متفرقة.') + '</p></article>' +
      '<article class="aqm-pos-item"><h5><span>مفتاح فتح الوفرة (+)</span><small>التدفق الحر</small></h5><p>' + escapeHTML(arcMoney.light || 'تقديم نفع حقيقي ملموس، الاستثمار في تطوير المهارات النوعية، والانضباط المالي.') + '</p></article>' +
      '</div>' +
      (arcMoney.taboos ? '<div class="aqm-somatic-box" style="margin-top:.85rem;"><h4><span>الظلال المالية والإدمانات المحيطة بالثروة</span></h4><p>' + escapeHTML(arcMoney.taboos.addiction) + '</p></div>' : '') +
      '</section>' +

      // 5. Love
      '<section id="sec-love" class="aqm-destiny-section" tabindex="-1">' +
      '<div class="aqm-sec-header"><span class="aqm-kicker">القسم 05 · Love Line & Relationships</span><h3>خط العلاقات وشريك الحياة <span class="aqm-destiny-badge">مدخل الحب: ' + matrix.channels.love + '</span></h3></div>' +
      '<p>يكشف خط الحب عن الصفات النفسية الحقيقية التي يحتاجها قلبك للشعور بالأمان والاكتمال، والتحدي الرئيسي الذي يختبر نضج الشراكة.</p>' +
      '<div class="aqm-pos-grid">' +
      '<article class="aqm-pos-item is-highlight"><h5><span>طبيعة شريك الروح المتوافق</span><small>طاقة ' + matrix.channels.love + ' (' + escapeHTML(arcLove.title || '') + ')</small></h5><p>' + escapeHTML(arcLove.positions?.relationship || arcLove.archetype) + '</p></article>' +
      '<article class="aqm-pos-item"><h5><span>نقطة التوازن والكيمياء الحميمية</span><small>طاقة ' + matrix.channels.balance + '</small></h5><p>تزدهر العلاقة عندما تكون الشراكة قائمة على الصراحة المتبادلة والاحترام دون ابتزاز عاطفي أو رغبة في السيطرة.</p></article>' +
      '<article class="aqm-pos-item"><h5><span>النمط المهدد للارتباط (-)</span><small>فخ الصدمات</small></h5><p>' + escapeHTML(arcLove.shadow || 'إسقاط صدمات الماضي على الشريك، الصمت العقابي، أو توقع الكمال المطلق.') + '</p></article>' +
      '</div>' +
      (arcLove.taboos ? '<div class="aqm-taboo-box" style="margin-top:.85rem;padding:1rem;background:rgba(255,117,140,0.06);border:1px solid rgba(255,117,140,0.2);border-radius:12px;"><h4 style="margin:0 0 .5rem 0;color:#ff758c;"><span>الديناميكية الحميمية والجاذبية في الشراكة</span></h4><p>' + escapeHTML(arcLove.taboos.sexuality) + '</p></div>' : '') +
      '</section>' +

      // 6. Programs & Ancestry
      '<section id="sec-programs" class="aqm-destiny-section" tabindex="-1">' +
      '<div class="aqm-sec-header"><span class="aqm-kicker">القسم 06 · Programs, Parents & Kids</span><h3>البرامج الكارمية ومربع الأسلاف والأبناء <span class="aqm-destiny-badge">السلالة 45°</span></h3></div>' +
      '<p>يمثل مربع الأجداد الـ DNA الطاقي الممتد عبر الأجيال. التأمل في هذه الخطوط يكشف الأنماط الأسرية الموروثة وما يستحق تحريره لضمان راحة الأبناء:</p>' +
      '<div class="aqm-pos-grid">' + maleLineCard + femaleLineCard + '</div>' +
      programsHtml +
      '</section>' +

      // 7. Health & 7 Chakras
      '<section id="sec-health" class="aqm-destiny-section" tabindex="-1">' +
      '<div class="aqm-sec-header"><span class="aqm-kicker">القسم 07 · Health Table & 7 Chakras</span><h3>خريطة الشاكرات والصحة (Physics / Energy / Emotions)</h3></div>' +
      '<p>توزيع طاقات الأركانا على مراكز الجسم الحيوية السبعة وفق نظام مصفوفة القدر:</p>' +
      '<div class="aqm-table-scroll"><table class="aqm-chakra-table"><thead><tr><th scope="col">الشاكرا · Chakra</th><th scope="col">الجسد<br><small>Physics</small></th><th scope="col">الطاقة<br><small>Energy</small></th><th scope="col">المشاعر<br><small>Emotions</small></th></tr></thead><tbody>' +
      chakraRows +
      '<tr class="aqm-chakra-total"><th scope="row">الإجمالي · Common Energy-Zone</th><td>' + chakras.total.physics + '</td><td>' + chakras.total.energy + '</td><td>' + chakras.total.emotions + '</td></tr>' +
      '</tbody></table></div>' +
      '<p class="aqm-health-note">' + escapeHTML(chakras.method) + ' الارتباطات الجسدية رمزية للتأمل وليست بديلاً عن الاستشارة الطبية المتخصصة.</p>' +
      '</section>' +

      '</div>';
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

    const tailCode = matrix.karmicTail.base + '-' + matrix.karmicTail.mid + '-' + matrix.karmicTail.inner;

    host.innerHTML = '<section class="aqm-shell" dir="rtl" aria-label="مصفوفة القدر المرجعية">' +
      '<header class="aqm-header"><span class="aqm-kicker">مصفوفة القدر · الهندسة الطاقية المقدسة · ' + escapeHTML(dateValue) + '</span><h2>مصفوفة القدر (Destiny Matrix)</h2><p>التقرير القياسي الموسع وفق نظام matrix-destiny.com المرجعي بهندسة الأركانا الـ 22 السلافية الأصلية.</p></header>' +

      // Top Interactive Octagram & Readings
      '<div class="aqm-grid">' +
      '<article class="aqm-card aqm-chart-card" id="aqm-section-map" tabindex="-1"><div class="aqm-card-head"><div><span class="aqm-kicker">الأركانا الكبرى · 1–22</span><h3>النجمة الثمانية والمحاور الطاقية</h3></div></div>' +
      '<div class="aqm-matrix-wrap">' + renderSVG(matrix, dateValue) + '<div class="aqm-tooltip" id="aqm-tooltip" role="status" aria-live="polite">اضغط أو مرر على أي دائرة لاستكشاف معناها والانتقال لقسمها.</div></div>' +
      '<div class="aqm-lines"><p><b>خط الوفرة والمال:</b> مدخل ' + matrix.channels.money + ' ← المركز ' + num.center + ' ← المادة ' + num.south + '</p><p><b>خط الحب والشراكات:</b> مدخل ' + matrix.channels.love + ' ← المركز ' + num.center + ' ← التوازن ' + matrix.channels.balance + '</p></div>' +
      '<p class="aqm-method">' + escapeHTML(matrix.formula) + '</p></article>' +

      '<div class="aqm-interpretations">' +
      '<article class="aqm-card" id="aqm-section-core" tabindex="-1"><span class="aqm-kicker">جوهر الروح · رقم ' + num.center + '</span><h3>نواة وراحة الروح</h3><div class="aqm-reading"><b>' + num.center + ' · ' + escapeHTML(ARCANA[num.center - 1]?.[0] || '') + '</b><p>' + escapeHTML(ARCANA[num.center - 1]?.[1] || '') + '</p></div><div class="aqm-reading is-shadow"><b>مساحة التوازن واليقظة</b><p>' + escapeHTML(ARCANA[num.center - 1]?.[2] || '') + '</p></div></article>' +
      '<article class="aqm-card"><span class="aqm-kicker">القناع الاجتماعي · رقم ' + num.west + '</span><h3>طاقة يوم الميلاد والانطباع الأول</h3><div class="aqm-reading"><b>' + num.west + ' · ' + escapeHTML(ARCANA[num.west - 1]?.[0] || '') + '</b><p>' + escapeHTML(ARCANA[num.west - 1]?.[1] || '') + '</p></div><div class="aqm-reading is-shadow"><b>جانب للتأمل الواعي</b><p>' + escapeHTML(ARCANA[num.west - 1]?.[2] || '') + '</p></div></article>' +
      '<article class="aqm-card"><span class="aqm-kicker">الذيل الكارمي · شفرة ' + escapeHTML(tailCode) + '</span><h3>قاعدة الروح والدروس الكارمية</h3><div class="aqm-reading"><b>الدروس غير المحلولة: ' + escapeHTML(tailCode) + '</b><p>العقدة الكارمية التأسيسية التي تتطلب الوعي والتفريغ السوماتيكي لفك الحلقات المكررة.</p></div></article>' +
      '</div>' +
      '</div>' +

      // 7 Master Destiny Sections
      render7DestinySections(matrix, dateValue, chakras, generations, axes) +

      // Report Index, Glossary, 4 Purposes, Roadmap, Method Section
      renderReportIndex() +
      renderGlossary(num) +
      renderPillars(axes) +
      renderReportRoadmap() +
      renderMethodSection() +

      '<footer class="aqm-disclaimer">هذه التحليلات مبنية على الهندسة المقدسة ونظام الأركانا الـ 22 لمصفوفة القدر، ومصاغة بأسلوب تحليلي نفسي وسلوكي وسوماتيكي للتأمل العميق، ولا تتضمن ادعاءات غيبية حتمية.</footer>' +
      '</section>';

    // Attach chakra toggle listeners
    host.querySelectorAll('[data-chakra-toggle]').forEach(button => {
      button.addEventListener('click', () => {
        const detail = host.querySelector('#' + button.getAttribute('aria-controls'));
        const open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        if (detail) detail.hidden = !open;
        button.querySelector('[aria-hidden="true"]').textContent = open ? '−' : '＋';
      });
    });

    // Attach nav pills smooth scrolling
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

    // Attach interactive SVG tooltips & navigation
    const tip = host.querySelector('#aqm-tooltip');
    const allSvgInteractive = host.querySelectorAll('.aqm-node, .aqm-age-node-dot');

    allSvgInteractive.forEach(node => {
      const updateTip = () => {
        const key = node.dataset.node;
        const age = node.dataset.age;
        if (age !== undefined) {
          const energy = node.querySelector('text')?.textContent || '';
          if (tip) tip.textContent = 'طاقة سن ' + age + ' سنة · أركانا ' + energy + ': مرحلة نمو سنوية مهمة في مسار العمر (الامتحان السنوي). اضغط للانتقال للقسم.';
        } else if (key) {
          const value = num[key] || (key === 'love_entry' ? matrix.channels.love : key === 'money_entry' ? matrix.channels.money : matrix.channels.balance);
          const [positive, shadow] = (ARCANA[value - 1] || []).slice(1);
          const label = labels[key] || (key === 'love_entry' ? 'خط الحب والشراكات' : key === 'money_entry' ? 'خط المال والوفرة' : 'نقطة التوازن');
          if (tip) tip.innerHTML = '<b>' + escapeHTML(label) + ' · أركانا ' + value + ':</b> ' + escapeHTML(positive || '') + ' (<i>الظل:</i> ' + escapeHTML(shadow || '') + '). اضغط للانتقال للقسم.';
        }
      };

      node.addEventListener('mouseenter', updateTip);
      node.addEventListener('pointerenter', updateTip);
      node.addEventListener('focus', updateTip);
      node.addEventListener('click', () => {
        updateTip();
        const target = node.dataset.target;
        if (target) {
          const targetEl = host.querySelector(target);
          if (targetEl) {
            targetEl.hidden = false;
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            targetEl.focus();
          }
        }
      });
      node.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          updateTip();
        }
      });
    });
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
      [matrixBtn, 'numbers', 'الأرقام ومصفوفة القدر']
    ].forEach(([btn, id, label], i) => {
      btn.type = 'button';
      btn.id = 'aqm-tab-' + id;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(i === 0));
      btn.setAttribute('aria-controls', 'aqm-panel-' + id);
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
    initResult,
    reportSections: REPORT_SECTIONS
  };

  window.AqeeqNumerology = api;

  const mount = () => {
    if (typeof document === 'undefined') return;
    const root = document.querySelector('#result');
    if (root && root.children.length && document.querySelector('#f-date')?.value) {
      initResult(root);
    }
  };

  if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
    new MutationObserver(() => {
      const root = document.querySelector('#result');
      if (root && root.dataset.aqmReady === 'true' && !root.querySelector('.aqm-shell')) delete root.dataset.aqmReady;
      mount();
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', mount);
    mount();
  }
})();
