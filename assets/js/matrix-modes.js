/* مصفوفة القدر — أوضاع إضافية: توافق الشريكين ومصفوفة الطفل.
   الحساب من محرك المصفوفة المعتمد نفسه (AqeeqMatrixMethodAdapter):
   - توافق الشريكين: تُجمع أركان الشخصين (اليوم/الشهر/السنة) ويُختزل المجموع إلى 1–22،
     ثم تُشتق باقي النقاط بنفس معادلات المصفوفة الفردية.
   - مصفوفة الطفل: مصفوفة الطفل الفردية كما هي، مع قراءة موجّهة للأهل.
   النصوص هنا تمهيدية لحين تركيب النصوص النهائية. */
(function () {
  'use strict';
  var AD = function () { return window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter; };
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* نفس معادلات المحرك، انطلاقاً من الأركان الثلاثة */
  function fromCorners(A, B, C) {
    var r = AD().reduceArcana;
    var D = r(A + B + C), E = r(A + B + C + D);
    var F = r(A + B), G = r(B + C), H = r(C + D), I = r(D + A);
    var father = r(F + H), mother = r(G + I);
    var A2 = r(A + E), B2 = r(B + E), C2 = r(C + E), D2 = r(D + E), D3 = r(D + D2);
    var balance = r(D2 + C2), heart = r(balance + D2), money = r(balance + C2);
    var sky = r(B + D), earth = r(A + C), personal = r(sky + earth), social = r(father + mother);
    var spiritual = r(personal + social);
    return { A: A, B: B, C: C, D: D, E: E, F: F, G: G, H: H, I: I, father: father, mother: mother,
      A2: A2, B2: B2, C2: C2, D2: D2, D3: D3, balance: balance, heart: heart, money: money,
      sky: sky, earth: earth, personal: personal, social: social, spiritual: spiritual };
  }
  function ofDate(dateStr, today) {
    var m = AD().calculateDestinyMatrix(dateStr, today), a = m.anchors;
    var P = fromCorners(a.A, a.B, a.C);
    P.yearEnergy = m.yearEnergy; P.ageMap = m.ageMap; P.birth = m.birthDate;
    return P;
  }
  /* مصفوفة الشراكة: كل نقطة = اختزال (نقطة الأول + نقطة الثاني) للموضع نفسه.
     طابقنا الأرقام مع النتيجة المرجعية لتاريخي 25/09/1999 و24/09/1990 (المركز 12، الأسرة 15، المشاعر 9، المال 10). */
  function pairOf(d1, d2) {
    var r = AD().reduceArcana, p1 = ofDate(d1), p2 = ofDate(d2), c = {};
    Object.keys(p1).forEach(function (k) { if (typeof p1[k] === 'number' && typeof p2[k] === 'number') c[k] = r(p1[k] + p2[k]); });
    return { a: p1, b: p2, c: c };
  }
  /* مصفوفة الشراكة الكاملة بنفس بنية محرك المصفوفة الفردية، لتُرسم بنفس رسم الموقع (generateMatrixSVG) */
  function pairFull(d1, d2) {
    var r = AD().reduceArcana, m1 = AD().calculateDestinyMatrix(d1), m2 = AD().calculateDestinyMatrix(d2);
    function sum(a, b, key) {
      if (typeof a === 'number' && typeof b === 'number') return key === 'year' || key === 'month' || key === 'day' ? a : r(a + b);
      if (Array.isArray(a) && Array.isArray(b)) return a.map(function (x, i) { return sum(x, b[i]); });
      if (a && b && typeof a === 'object' && typeof b === 'object') { var o = {}; Object.keys(a).forEach(function (k) { o[k] = k in b ? sum(a[k], b[k], k) : a[k]; }); return o; }
      return a;
    }
    var P = sum(m1, m2);
    var axis = function (m, X) { var mid = r(X + m.anchors.E); return { mid: mid, outer: r(X + mid), inner: r(mid + m.anchors.E) }; };
    var diag = function (m, X) { var inner = r(X + m.anchors.E); return { inner: inner, outer: r(X + inner) }; };
    function pairOfFn(fn, k1, k2, ks) { var o = {}; ks.forEach(function (k) { var x = fn(m1, k1[k]), y = fn(m2, k2[k]); o[k] = {}; Object.keys(x).forEach(function (f) { o[k][f] = r(x[f] + y[f]); }); }); return o; }
    P.pairAxis = pairOfFn(axis, { left: m1.anchors.A, top: m1.anchors.B, right: m1.anchors.C, bottom: m1.anchors.D }, { left: m2.anchors.A, top: m2.anchors.B, right: m2.anchors.C, bottom: m2.anchors.D }, ['left', 'top', 'right', 'bottom']);
    P.pairDiag = pairOfFn(diag, m1.corners, m2.corners, ['F', 'G', 'H', 'I']);
    // حلقة الأعمار: تُشتق من أركان الشراكة نفسها (لا من جمع نقاط الشخصين)، 7 محطات بين كل ركنين
    var ring = [P.anchors.A, P.corners.F, P.anchors.B, P.corners.G, P.anchors.C, P.corners.H, P.anchors.D, P.corners.I];
    var offs = [1.25, 2.5, 3.75, 5, 6.25, 7.5, 8.75], ages = [], ageMap = {};
    ring.forEach(function (p, i) {
      var q = ring[(i + 1) % 8], mid = r(p + q), L = r(p + mid), R = r(mid + q);
      var vals = [r(p + L), L, r(L + mid), mid, r(mid + R), R, r(R + q)];
      ageMap[i * 10] = p; ageMap[i * 10 + 2.5] = L; ageMap[i * 10 + 5] = mid; ageMap[i * 10 + 7.5] = R;
      offs.forEach(function (o, j) { ages.push({ age: i * 10 + o, value: vals[j] }); });
    });
    ageMap[80] = ring[0];
    P.ageMap = ageMap; P.pairAges = ages;
    return P;
  }
  function ageOf(birth, now) {
    now = now || new Date();
    var y = now.getFullYear() - birth.year;
    if (now.getMonth() + 1 < birth.month || (now.getMonth() + 1 === birth.month && now.getDate() < birth.day)) y--;
    return Math.max(0, y);
  }
  function ageEnergy(P, age) {
    var keys = Object.keys(P.ageMap).map(Number).sort(function (x, y) { return x - y; }), k = keys[0];
    var a = age % 80;
    keys.forEach(function (x) { if (x <= a) k = x; });
    return { age: k, number: P.ageMap[k] };
  }

  var IC = {
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
    knot: '<circle cx="12" cy="5" r="2"/><path d="M12 7v13M8 11h8M6 16a6 6 0 0 0 12 0"/>',
    home: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
    scale: '<path d="M12 4v16M6 20h12M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/>',
    alert: '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    gem: '<path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M9 4l-1 5 4 11 4-11-1-5"/>',
    child: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    hands: '<path d="M12 20s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7.6 4.2 4.2 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    tree: '<path d="M12 21v-9M12 12c0-4 3-7 7-7 0 4-3 7-7 7zM12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5z"/>',
    rise: '<path d="M4 19h16M6 15l4-4 3 3 5-6"/><path d="M15 8h3v3"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'
  };
  function ico(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[k] + '</svg>'; }

  /* كل قسم: عنوان + تمهيد + النقاط المحسوبة التي يقرأ منها */
  var PAIR = [
    { t: 'لماذا التقى الشريكان؟', i: 'spark', intro: 'ليس كل لقاء صدفة. هنا الدرس الذي جمع بينكما والمعنى الذي يعود إليه كل منكما كلما اقترب من الآخر.', pts: [['E', 'جوهر العلاقة'], ['personal', 'الغرض المشترك']] },
    { t: 'كيف يظهر الشريكان؟', i: 'tree', intro: 'الصورة التي يراها الناس حين تقفان معًا، والطاقة التي تفوح منكما قبل أن تتكلما.', pts: [['A', 'ما شدّ كلًّا منكما للآخر'], ['social', 'حضوركما أمام الآخرين']] },
    { t: 'الرفاهية المالية والانسجام', i: 'gem', intro: 'ما يفتح باب الرزق حين تنسجمان، وما يغلقه حين يشدّ كل منكما في اتجاه. المال هنا مرآة لحال العلاقة.', pts: [['money', 'باب الوفرة المشتركة'], ['balance', 'ميزان العطاء والأخذ']] },
    { t: 'المشاكل والصعوبات', i: 'knot', intro: 'المواضع التي يتكرر فيها الخلاف بنفس الشكل. لا تُقرأ كعيب في أحدكما، بل كعقدة تحتاج أن تُفهم قبل أن تُحل.', pts: [['C', 'الدرس الذي يعود بلا توقف'], ['I', 'التواصل بينكما']] },
    { t: 'كارما العلاقة', i: 'moon', intro: 'حين يبتعد الشريكان عن الغاية التي التقيا من أجلها، يظهر الدرس بصورة أقسى. هنا ما تحمله العلاقة من قديم يطلب أن يُغلق.', pts: [['D3', 'ما تحمله العلاقة من القديم'], ['C2', 'الدرس الذي يتكرر حتى يُتعلَّم']] },
    { t: 'منطقة راحة الشريكين', i: 'home', intro: 'الحالة التي ترتاح فيها العلاقة حين لا يراقبها أحد، والإيقاع الذي تعودان إليه بعد أي توتر أو أزمة.', pts: [['D', 'البيت والحياة الأسرية'], ['D2', 'الحب والتواصل العاطفي']] },
    { t: 'توصيات للشريكين', i: 'scale', intro: 'خطوات عملية صغيرة تعدّل مسار العلاقة وتحميها من التآكل: ما يُقال وما يُترك وما يُفعل بانتظام.', pts: [['heart', 'الجاذبية والكيمياء'], ['B2', 'ما يغذّي العلاقة']] },
    { t: 'سبب الانفصال', i: 'alert', intro: 'ليست نبوءة بالفراق. هي الموضع الأضعف الذي إن أُهمل تحوّل الصمت فيه إلى مسافة. انتبها له مبكرًا.', pts: [['H', 'نقطة الضعف في الأساس'], ['G', 'ما يُستنزف بصمت']] },
    { t: 'أهداف الشريكين لإصلاح العلاقة', i: 'target', intro: 'ما يستطيع كل منكما فعله ليرمّم ما انكسر ويبني ما ينقص، دون أن ينتظر أن يبدأ الآخر.', pts: [['F', 'ما يُرمَّم أولًا'], ['spiritual', 'الغاية الأبعد للعلاقة']] },
    { t: 'أهداف الشريكين للنجاح أمام الناس', i: 'rise', intro: 'كيف تنجحان معًا كثنائي: في العمل أو الأسرة أو الصداقة، وما الأثر الذي تتركانه فيمن حولكما.', pts: [['personal', 'ما تبنيانه لأنفسكما'], ['earth', 'ما تثبّتانه على الأرض']] },
    { t: 'موارد الشريكين وتوقعاتهما', i: 'compass', intro: 'الطاقة الكامنة التي لا تظهر في البداية وتنضج مع الصبر، وما تميل إليه العلاقة إذا أُعطيت وقتها.', pts: [['B', 'الطاقة الكامنة'], ['A2', 'ما تنضج إليه العلاقة']] }
  ];
  var CHILD = [
    { t: 'عالم الطفل الداخلي وطباعه', i: 'child', intro: 'هكذا يرى الطفل الدنيا من الداخل: ما يفرحه بسرعة، وما يربكه، والطبع الذي وُلد به قبل أن يعلّمه أحد شيئًا.', pts: [['A', 'طبعه الظاهر'], ['E', 'مركزه الداخلي']] },
    { t: 'دليل الاحتواء', i: 'hands', intro: 'توصيات للأهل: الطريقة التي يشعر بها هذا الطفل بالأمان، وما الذي يهدّئه حين يضطرب، وما الأسلوب الذي يغلق عليه قلبه.', pts: [['A2', 'ما يطمئنه'], ['balance', 'ما يعيد إليه توازنه']] },
    { t: 'ديناميكية العلاقة مع الأهل', i: 'tree', intro: 'ما يأخذه الطفل من جهة الأب وما يأخذه من جهة الأم، وأين يلتقي الخطّان في شخصيته.', pts: [['F', 'ما يحمله من جهة الأب'], ['G', 'ما يحمله من جهة الأم'], ['father', 'خط الأب مجتمعًا'], ['mother', 'خط الأم مجتمعًا']] },
    { t: 'صندوق المواهب الفطرية', i: 'gem', intro: 'المواهب التي تظهر في لعبه قبل أن تظهر في دراسته. راقبها ولا تستعجلها، فهي تحتاج مساحة أكثر مما تحتاج توجيهًا.', pts: [['B', 'موهبته الأولى'], ['B2', 'ما يغذّي موهبته']] },
    { t: 'بناء الشخصية وإثبات الذات', i: 'rise', intro: 'كيف يثبت هذا الطفل نفسه بين الآخرين، وأين يحتاج تشجيعًا وأين يحتاج حدًّا واضحًا.', pts: [['C', 'طاقته في الإنجاز'], ['C2', 'علاقته بما يملك وما يحقق']] },
    { t: 'بوصلة القدر والمسار العام', i: 'compass', intro: 'الاتجاه العام الذي تميل إليه حياته: ما يتعلمه لنفسه، وما يقدمه للناس، وما يبقى معه في النهاية.', pts: [['personal', 'غايته لنفسه'], ['social', 'غايته مع الناس'], ['spiritual', 'غايته الأبعد']] },
    { t: 'طبقة اللاوعي والمخاوف الخفية', i: 'moon', intro: 'مخاوف لا يعرف الطفل كيف يسمّيها. تظهر في سلوكه لا في كلامه، وتهدأ حين تُفهم لا حين تُمنع.', pts: [['D', 'الخوف الأقدم'], ['D2', 'ما يوقظ الخوف'], ['D3', 'ما يحمله من القديم']] },
    { t: 'طاقة العام الحالي للطفل', i: 'sun', intro: 'ما يمر به الطفل في سنته هذه: الطاقة التي تحكم عامه من عيد ميلاده إلى الذي يليه، وطاقة المرحلة العمرية التي هو فيها.', pts: [['__year', 'طاقة عامه الحالي'], ['__age', 'طاقة مرحلته العمرية']] }
  ];

  function energyHtml(n, label, extra) {
    var a = AD().getArcanaInfo(n);
    return '<div class="mxm-en"><span class="mxm-num mxm-tn-' + ([12, 13, 15, 16, 18].indexOf(+n) >= 0 ? 's' : [10, 11, 14, 17, 19, 21].indexOf(+n) >= 0 ? 'g' : 'n') + '">' + n + '</span><div><b>' + esc(label) + (extra ? ' <i>' + esc(extra) + '</i>' : '') + '</b>' +
      '<strong>' + esc(a.name) + '</strong><p>' + esc(a.archetype) + '.</p>' +
      '<p><em>في حالتها الصافية:</em> ' + esc(a.light) + '.</p><p><em>حين تختل:</em> ' + esc(a.shadow) + '.</p></div></div>';
  }
  function accHtml(specs, get) {
    return specs.map(function (s) {
      var body = s.pts.map(function (p) { var v = get(p[0]); return energyHtml(v.n, p[1], v.x); }).join('');
      return '<details class="mxm-acc" open><summary><span class="mxm-ic">' + ico(s.i) + '</span><span class="mxm-t">' + esc(s.t) + '</span><span class="mxm-chev" aria-hidden="true"></span></summary>' +
        '<div class="mxm-body"><p class="mxm-intro">' + esc(s.intro) + '</p>' + body + '</div></details>';
    }).join('');
  }
  /* أكورديون الشراكة: نفس بنية بطاقات المصفوفة الفردية (.aqm-acc-item) وتفتح في نافذة القراءة نفسها على الهاتف */
  var PAIR_SUB = ['ما الذي جمعكما في الأصل؟', 'كيف يراكما الناس حين تقفان معًا؟', 'أين ينفتح رزقكما وأين ينغلق؟', 'أين يتكرر الخلاف بينكما بنفس الشكل؟', 'ما الذي تحمله علاقتكما من القديم؟', 'أين ترتاح علاقتكما حين تخلوان؟', 'ما الخطوة الصغيرة التي تحمي العلاقة؟', 'أي موضع إن أُهمل صنع مسافة بينكما؟', 'ما الذي يرمّم ما انكسر بينكما؟', 'ماذا تبنيانه معًا أمام الناس؟', 'ما الطاقة الكامنة التي تنضج بالصبر؟'];
  var SLOT_IC = {
    p: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
    d: '<path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z"/><path d="M12 6v13.5"/>',
    s: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
    c: '<path d="M12 4L21 19H3z"/><path d="M12 10v4M12 16.5v.5"/>'
  };
  function slotIc(k) { return '<svg class="aq-ic" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + SLOT_IC[k] + '</svg>'; }
  function slot(cls, k, title, inner) { return '<section class="aqm-slot ' + cls + '">' + (title ? '<h4 class="aqm-slot-title">' + slotIc(k) + ' ' + title + '</h4>' : '') + '<div class="aqm-slot-p">' + inner + '</div></section>'; }
  function toneOf(n) { n = +n; return [12, 13, 15, 16, 18].indexOf(n) >= 0 ? 's' : [10, 11, 14, 17, 19, 21].indexOf(n) >= 0 ? 'g' : 'n'; }
  function pairAccHtml(specs, get, subs) {
    return '<div class="aqm-accordion-container mxc-acc">' + specs.map(function (sp, i) {
      var badges = '', tc = { s: 0, g: 0, n: 0 }, body = slot('aqm-slot-primary', 'p', 'عن هذا القسم', '<p>' + esc(sp.intro) + '</p>');
      sp.pts.forEach(function (p, j) {
        var v = get(p[0]), a = AD().getArcanaInfo(v.n);
        tc[toneOf(v.n)]++; badges += '<span class="aqm-badge-arcana aqm-tone-' + (j % 4) + ' b3-tn-' + toneOf(v.n) + '"><b class="aqm-bn">' + v.n + '</b><span class="aqm-bl">' + esc(p[1]) + '</span></span> ';
        body += slot('aqm-slot-detailed', 'd', esc(p[1]) + ' · ' + v.n + ' ' + esc(a.name) + (v.x ? ' · ' + esc(v.x) : ''), '<p>' + esc(a.archetype) + '.</p>') +
          slot('aqm-slot-strengths', 's', 'في حالتها الصافية', '<p>' + esc(a.light) + '.</p>') +
          slot('aqm-slot-challenges', 'c', 'حين تختل', '<p>' + esc(a.shadow) + '.</p>');
      });
      var dom = tc.s > tc.g && tc.s >= tc.n ? 's' : tc.g >= tc.n && tc.g > 0 ? 'g' : tc.n ? 'n' : 'g';
      return '<div class="aqm-acc-item b3-ai-' + dom + '" id="mxc-sec-' + i + '" data-section-id="pair-' + i + '"><button class="aqm-acc-header" type="button" aria-expanded="false">' +
        '<div class="aqm-acc-header-left"><span class="aqm-acc-icon" aria-hidden="true">' + ico(sp.i) + '</span><div class="aqm-acc-title-group"><h3 class="aqm-acc-title">' + esc(sp.t) + '</h3><p class="aqm-acc-subtitle">' + esc(PAIR_SUB[i] || '') + '</p></div></div>' +
        '<div class="aqm-acc-badges">' + badges + '</div><span class="aqm-acc-chevron" aria-hidden="true">›</span></button>' +
        '<div class="aqm-acc-body">' + '<div class="aqm-content-grid">' + body + '</div></div></div>';
    }).join('') + '</div>';
  }
  function bindAcc(host) {
    if (host.__mxcAcc) return; host.__mxcAcc = true;
    host.addEventListener('click', function (e) {
      var h = e.target.closest && e.target.closest('.aqm-acc-header'); if (!h || !host.contains(h)) return;
      var it = h.closest('.aqm-acc-item'), open = it.classList.toggle('open'); h.setAttribute('aria-expanded', String(open));
    });
  }
  function cornerRow(title, P) {
    return '<div class="mxm-row"><span>' + esc(title) + '</span>' + ['A', 'B', 'C', 'D', 'E'].map(function (k) { return '<b>' + P[k] + '</b>'; }).join('') + '</div>';
  }
  var HEADROW = '<div class="mxm-row mxm-hr"><span></span><i>اليوم</i><i>الشهر</i><i>السنة</i><i>الدرس</i><i>المركز</i></div>';

  function renderPair(host, d1, d2, n1, n2) {
    var R = pairOf(d1, d2), c = R.c;
    var map = '';
    try { var N = window.AqeeqNumerology; if (N && N.generateMatrixSVG) map = '<div class="aqm-canvas-wrap mxm-map">' + N.generateMatrixSVG(pairFull(d1, d2)).replace(/>undefined</g, '>—<').replace(/data-arcana="undefined"/g, 'data-arcana=""') + '</div>'; } catch (e) { map = ''; }
    var sum = '<div class="mxm-sum mxm-sum-end"><h3>أرقام الشراكة</h3><p>أرقام العلاقة ناتجة من جمع أركان مصفوفتيكما ثم اختزالها إلى طاقات المصفوفة.</p>' +
      '<div class="mxm-tab">' + HEADROW + cornerRow(n1 || 'أنت', R.a) + cornerRow(n2 || 'شريكك', R.b) + '<div class="mxm-sep"></div>' + cornerRow('الشراكة', c) + '</div></div>';
    host.innerHTML = map +
      pairAccHtml(PAIR, function (k) { return { n: c[k] }; }) + sum +
      '<p class="mxm-note">قراءة العلاقة بين شريكين أيًّا كانت صلتهما، والأرقام محسوبة من تاريخي الميلاد.</p>';
    host.hidden = false; bindAcc(host); bindMap(host, pairFull(d1, d2));
  }
  /* الضغط على رقم العمر أو على أي عقدة في خريطة الشريكين يعرض معناه تحت الخريطة مباشرة */
  function bindMap(host, P, W) {
    W = W || { age: 'الطاقة التي تمرّ بها العلاقة عند هذا العمر', dec: 'بداية مرحلة جديدة في عمر العلاقة', node: 'نقطة من خريطة الشراكة' };
    var map = host.querySelector('.mxm-map'); if (!map) return;
    var card = document.createElement('div'); card.className = 'mxc-pick'; card.hidden = true; card.setAttribute('aria-live', 'polite');
    map.parentNode.insertBefore(card, map.nextSibling);
    function fmt(a) { return String(Math.round(a * 100) / 100); }
    function show(head, sub, n) {
      var a = AD().getArcanaInfo(n);
      card.innerHTML = '<button type="button" class="mxc-pick-x" aria-label="إغلاق">×</button><div class="mxc-pick-h"><span class="mxm-num">' + n + '</span><div><b>' + esc(head) + '</b><small>' + esc(sub) + '</small></div></div>' +
        '<p><strong>' + esc(a.name) + '</strong> — ' + esc(a.archetype) + '.</p><p><em>في حالتها الصافية:</em> ' + esc(a.light) + '.</p><p><em>حين تختل:</em> ' + esc(a.shadow) + '.</p>';
      card.hidden = false;
    }
    map.querySelectorAll('[data-age], .aqm-svg-age-label, .aqm-node').forEach(function (el) { el.style.cursor = 'pointer'; });
    map.addEventListener('click', function (e) {
      var t = e.target; if (!t.closest) return;
      var x = t.closest('.mxc-pick-x'); if (x) { card.hidden = true; return; }
      var ageEl = t.closest('[data-age]'), lab = t.closest('.aqm-svg-age-label'), node = t.closest('.aqm-node');
      if (ageEl) {
        var age = parseFloat(ageEl.getAttribute('data-age')), v = parseInt(ageEl.textContent, 10);
        if (v) show('محطة عمر ' + fmt(age), W.age, v);
      } else if (lab) {
        var k = /^0/.test(lab.textContent) ? 0 : parseFloat(lab.textContent), n = P.ageMap[k];
        if (n) show('محطة عمر ' + (k === 0 ? '0 / 80' : fmt(k)), W.dec, n);
      } else if (node) {
        var nv = parseInt(node.getAttribute('data-arcana'), 10);
        if (nv) show(node.getAttribute('data-title') || 'نقطة في الخريطة', W.node, nv);
      }
    });
  }
  var CHILD_SUB = ['كيف يرى الدنيا من الداخل؟', 'ما الذي يطمئنه ويهدّئه؟', 'ماذا ورث من أبيه وأمه؟', 'ما الموهبة التي وُلد بها؟', 'كيف يثبت نفسه بين الناس؟', 'إلى أين يسير في حياته؟', 'ما المخاوف التي لا يحكيها؟', 'ما الذي ينتظره هذا العام؟'];
  function renderChild(host, d, name) {
    var P = ofDate(d), age = ageOf(P.birth), ae = ageEnergy(P, age), full = null, map = '';
    try { full = AD().calculateDestinyMatrix(d); var N = window.AqeeqNumerology; if (N && N.generateMatrixSVG) map = '<div class="aqm-canvas-wrap mxm-map">' + N.generateMatrixSVG(full).replace(/>undefined</g, '>—<').replace(/data-arcana="undefined"/g, 'data-arcana=""') + '</div>'; } catch (e) { map = ''; }
    var sum = '<div class="mxm-sum mxm-sum-end"><h3>أرقام الطفل</h3><p>العمر الآن: ' + age + (age === 1 ? ' سنة' : ' سنوات') + '. الأرقام محسوبة من تاريخ ميلاد الطفل.</p>' +
      '<div class="mxm-tab">' + HEADROW + cornerRow(name || 'الطفل', P) + '</div></div>';
    host.innerHTML = map +
      pairAccHtml(CHILD, function (k) {
        if (k === '__year') return { n: P.yearEnergy.number, x: P.yearEnergy.label };
        if (k === '__age') return { n: ae.number, x: 'من عمر ' + ae.age };
        return { n: P[k] };
      }, CHILD_SUB) + sum +
      '<p class="mxm-note">النصوص داخل الأقسام تمهيدية، والأرقام محسوبة من تاريخ الميلاد.</p>';
    host.hidden = false; bindAcc(host); if (full) bindMap(host, full, { age: 'الطاقة التي يمرّ بها الطفل عند هذا العمر', dec: 'بداية مرحلة جديدة في عمره', node: 'نقطة من خريطة الطفل' });
  }

  function field(id, label, type) {
    return '<div class="field"><label for="' + id + '"><span>' + label + '</span></label><input id="' + id + '" type="' + type + '"' + (type === 'date' ? ' min="1900-01-01" max="2100-12-31"' : ' autocomplete="off"') + '></div>';
  }
  /* صفحة المصفوفة الفردية: صف أيقونات صغير يفتح صفحتي مصفوفة الطفل وتوافق الشريكين المستقلتين (لا تغيير في حساب الفردية) */
  function build() {
    var sec = document.getElementById('matrix'), form = document.getElementById('mform');
    if (!sec || !form || document.getElementById('mxm-links')) return;
    var ic = {
      child: '<circle cx="12" cy="7.5" r="3"/><path d="M6.5 20c.3-3 2.5-5 5.5-5s5.2 2 5.5 5"/><path d="M9.5 3.6c.8-1 4.2-1 5 0"/>',
      pair: '<circle cx="8.5" cy="8.5" r="3"/><circle cx="16" cy="9.5" r="2.6"/><path d="M2.8 19c.5-3.2 2.7-5 5.7-5s5.2 1.8 5.7 5M14.6 14.4c3 0 5.2 1.6 5.8 4.6"/>'
    };
    function lk(href, k, label) { return '<a class="mxm-link" href="' + href + '" aria-label="' + label + '"><span class="mxm-sic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ic[k] + '</svg></span><span class="mxm-slb">' + label + '</span></a>'; }
    var row = document.createElement('div'); row.id = 'mxm-links'; row.className = 'mxm-links';
    row.innerHTML = lk('#matrix-child', 'child', 'مصفوفة الطفل') + lk('#matrix-compat', 'pair', 'توافق الشريكين');
    form.parentNode.insertBefore(row, form);
  }
  function fmtDate(d) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d); return m ? m[3] + '/' + m[2] + '/' + m[1] : d; }
  var HI = {
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    save: '<path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z"/>',
    add: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'
  };
  function hIc(k) { return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + HI[k] + '</svg>'; }
  function personHead(kicker, people) {
    var ppl = people.map(function (q) { return '<div class="mxc-p"><b>' + esc(q.n || q.label) + '</b><small>' + esc(fmtDate(q.d)) + '</small></div>'; }).join('<span class="mxc-join" aria-hidden="true">+</span>');
    return '<header class="mxc-head"><span class="mxc-kicker">' + esc(kicker) + '</span><div class="mxc-ppl">' + ppl + '</div>' +
      '<div class="mxc-tools"><button type="button" data-mxc="edit" aria-label="تعديل البيانات" title="تعديل البيانات">' + hIc('edit') + '<span>تعديل</span></button>' +
      '<button type="button" data-mxc="save" aria-label="حفظ الخريطة" title="حفظ الخريطة">' + hIc('save') + '<span>حفظ</span></button>' +
      '<button type="button" data-mxc="new" aria-label="خريطة جديدة" title="خريطة جديدة">' + hIc('add') + '<span>خريطة جديدة</span></button></div></header>';
  }
  /* صفحة خريطة مستقلة (توافق الشريكين / مصفوفة الطفل): نفس البنية والسلوك، والاختلاف في الحقول والعرض فقط */
  function buildMapPage(cfg) {
    var sec = document.getElementById(cfg.sec), form = document.getElementById(cfg.form), out = document.getElementById(cfg.out);
    if (!sec || !form || !out || form.__mxc || !AD()) return;
    form.__mxc = true;
    var err = document.getElementById(cfg.err), explain = document.getElementById(cfg.explain), head = sec.querySelector('.lpx-head');
    function val(id) { return (document.getElementById(id) || {}).value || ''; }
    function setVal(id, v) { var e = document.getElementById(id); if (!e) return; e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); }
    function show(on) { form.hidden = on; if (explain) explain.hidden = on; if (head) head.hidden = on; out.hidden = !on; }
    var cur = null;
    function editDialog() {
      var dlg = document.createElement('div'); dlg.className = 'mxc-modal'; dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true');
      dlg.innerHTML = '<div class="mxc-modal-card"><h3>' + esc(cfg.editTitle) + '</h3>' + cur.map(function (q, i) {
        return '<div class="mxc-modal-grp"><h4>' + esc(q.label) + '</h4><label>الاسم (اختياري)<input type="text" maxlength="40" id="mxc-e-n' + i + '" autocomplete="off"></label><label>تاريخ الميلاد<input type="date" id="mxc-e-d' + i + '" min="1900-01-01" max="2100-12-31"></label></div>';
      }).join('') + '<p class="ferr" id="mxc-e-err" hidden>اختر تاريخ الميلاد كاملًا.</p>' +
        '<div class="mxc-modal-act"><button type="button" class="btn-lite" data-x>إلغاء</button><button type="button" class="btn" data-ok>تحديث الخريطة</button></div></div>';
      document.body.appendChild(dlg);
      cur.forEach(function (q, i) { dlg.querySelector('#mxc-e-n' + i).value = q.n; dlg.querySelector('#mxc-e-d' + i).value = q.d; });
      var close = function () { dlg.remove(); document.removeEventListener('keydown', onKey, true); };
      var onKey = function (e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
      document.addEventListener('keydown', onKey, true);
      dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
      dlg.querySelector('[data-x]').addEventListener('click', close);
      dlg.querySelector('[data-ok]').addEventListener('click', function () {
        var ok = cur.every(function (q, i) { return /^\d{4}-\d{2}-\d{2}$/.test(dlg.querySelector('#mxc-e-d' + i).value); });
        if (!ok) { dlg.querySelector('#mxc-e-err').hidden = false; return; }
        cfg.fields.forEach(function (f, i) { setVal(f.n, dlg.querySelector('#mxc-e-n' + i).value); setVal(f.d, dlg.querySelector('#mxc-e-d' + i).value); });
        close(); if (form.requestSubmit) form.requestSubmit(); else form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      });
      dlg.querySelector('#mxc-e-n0').focus();
    }
    out.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-mxc]'); if (!b || !cur) return;
      var a = b.getAttribute('data-mxc');
      if (a === 'edit') editDialog();
      else if (a === 'new') { cfg.fields.forEach(function (f) { setVal(f.n, ''); setVal(f.d, ''); }); show(false); window.scrollTo(0, 0); sec.scrollTop = 0; }
      else if (a === 'save') {
        var P = window.AqeeqPlatform;
        if (P && typeof P.saveReading === 'function') {
          var m = cfg.saveMeta(cur); P.saveReading({ type: m.type, typeLabel: m.typeLabel, title: m.title, subtitle: m.subtitle, route: '#' + cfg.sec, inputs: m.inputs });
          b.classList.add('is-saved'); b.querySelector('span').textContent = 'تم الحفظ';
        }
      }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); err.hidden = true;
      var people = cfg.fields.map(function (f) { return { n: val(f.n).trim(), d: val(f.d), label: f.label }; });
      if (people.some(function (q) { return !/^\d{4}-\d{2}-\d{2}$/.test(q.d); })) { err.textContent = cfg.badDate; err.hidden = false; return; }
      try {
        cfg.render(out, people);
        cur = people;
        out.insertAdjacentHTML('afterbegin', personHead(cfg.kicker, people));
        show(true); window.scrollTo(0, 0); sec.scrollTop = 0;
      } catch (x) { err.textContent = 'تعذّر الحساب. راجع التاريخ وحاول مرة أخرى.'; err.hidden = false; }
    });
  }
  function buildCompatPage() {
    buildMapPage({
      sec: 'matrix-compat', form: 'mxc-form', out: 'mxc-result', err: 'mxc-error', explain: 'mxc-explain',
      fields: [{ n: 'mxc-n1', d: 'mxc-d1', label: 'الطرف الأول' }, { n: 'mxc-n2', d: 'mxc-d2', label: 'الطرف الثاني' }],
      kicker: 'توافق مصفوفة القدر', editTitle: 'تعديل بيانات الشريكين',
      badDate: 'اختر تاريخ الميلاد كاملًا لكل طرف: اليوم والشهر والسنة.',
      render: function (out, p) { renderPair(out, p[0].d, p[1].d, p[0].n, p[1].n); },
      saveMeta: function (p) { return { type: 'matrix-compat', typeLabel: 'توافق مصفوفة القدر', title: (p[0].n || p[0].label) + ' + ' + (p[1].n || p[1].label), subtitle: fmtDate(p[0].d) + ' × ' + fmtDate(p[1].d), inputs: { name1: p[0].n, date1: p[0].d, name2: p[1].n, date2: p[1].d } }; }
    });
  }
  function buildChildPage() {
    buildMapPage({
      sec: 'matrix-child', form: 'mxk-form', out: 'mxk-result', err: 'mxk-error', explain: 'mxk-explain',
      fields: [{ n: 'mxk-n', d: 'mxk-d', label: 'الطفل' }],
      kicker: 'مصفوفة الطفل', editTitle: 'تعديل بيانات الطفل',
      badDate: 'اختر تاريخ ميلاد الطفل كاملًا: اليوم والشهر والسنة.',
      render: function (out, p) { renderChild(out, p[0].d, p[0].n); },
      saveMeta: function (p) { return { type: 'matrix-child', typeLabel: 'مصفوفة الطفل', title: p[0].n || 'مصفوفة الطفل', subtitle: fmtDate(p[0].d), inputs: { name: p[0].n, date: p[0].d } }; }
    });
  }
  window.AqMatrixModes = { fromCorners: fromCorners, ofDate: ofDate, pairOf: pairOf, ageEnergy: ageEnergy, renderPair: renderPair, pairFull: pairFull };
  if (typeof module !== 'undefined' && module.exports) module.exports = window.AqMatrixModes;
  if (typeof document !== 'undefined') {
    var boot = function () { build(); buildCompatPage(); buildChildPage(); var n = 0; (function t() { buildCompatPage(); buildChildPage(); if (++n < 12 && !((document.getElementById('mxc-form') || {}).__mxc && (document.getElementById('mxk-form') || {}).__mxc)) setTimeout(t, 400); })(); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  }
})();
