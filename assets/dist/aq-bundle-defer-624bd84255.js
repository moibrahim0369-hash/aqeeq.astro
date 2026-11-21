/* assets/js/restore-last.js */
/* استعادة آخر نتيجة: يحفظ مدخلات آخر حساب ناجح في الخريطة الفلكية والمصفوفة ومسار الحياة على هذا الجهاز،
   وعند فتح أي منها من جديد يملأ الحقول ويعيد الحساب تلقائيًا بدل أن يبدأ المستخدم من صفحة فارغة.
   لا يغيّر منطق الحساب: يستخدم نفس النموذج ونفس زر الإرسال. يمسح مع بقية البيانات المحلية عند تسجيل الخروج. */
(function () {
  'use strict';
  var KEY = 'aq-last-calc-v1';
  var CFG = {
    chart: { hash: '#chart', form: 'cform', result: 'result', fields: ['f-name', 'f-gender', 'f-date', 'f-time', 'f-unknown', 'f-city', 'f-lat', 'f-lon', 'f-off', 'f-zodiac-sys', 'f-hs'], required: ['f-date', 'f-city'] },
    matrix: { hash: '#matrix', form: 'mform', result: 'mresult', fields: ['m-name', 'm-gender', 'm-date'], required: ['m-date'] },
    lifepath: { hash: '#lifepath', form: 'lpform', result: 'lpresult', fields: ['lp-name', 'lp-gender', 'lp-date'], required: ['lp-date'] }
  };
  var done = {}, pending = {};

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function store(k, v) { try { var s = load(); s[k] = v; localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { } }
  function el(id) { return document.getElementById(id); }
  function snap(c) {
    var o = {};
    c.fields.forEach(function (id) { var e = el(id); if (!e) return; o[id] = e.type === 'checkbox' ? !!e.checked : e.value; });
    return o;
  }
  function shown(c) { var r = el(c.result); return !!r && !r.hidden && r.innerHTML.trim().length > 0; }

  function watch(k) {
    var c = CFG[k], form = el(c.form), res = el(c.result);
    if (!form || !res || form.__aqRestoreWatch) return; form.__aqRestoreWatch = true;
    form.addEventListener('submit', function () {
      var s = snap(c);
      if (!c.required.every(function (id) { return s[id]; })) return;
      pending[k] = s;
      var tries = 0, t = setInterval(function () {
        tries++;
        if (shown(c)) { clearInterval(t); if (pending[k]) { store(k, pending[k]); pending[k] = null; } }
        else if (tries > 40) { clearInterval(t); pending[k] = null; }
      }, 250);
    }, true);
  }

  function fill(c, s) {
    c.fields.forEach(function (id) {
      var e = el(id); if (!e || !(id in s)) return;
      if (e.type === 'checkbox') { e.checked = !!s[id]; }
      else if (e.tagName === 'SELECT') {
        var has = [].some.call(e.options, function (o) { return o.value === s[id]; });
        if (!has) return; e.value = s[id];
      } else e.value = s[id];
      e.dispatchEvent(new Event('input', { bubbles: true }));
      e.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  function tryRestore(k) {
    var c = CFG[k]; if (done[k] || location.hash !== c.hash) return;
    var form = el(c.form); if (!form) return;
    var saved = load()[k]; if (!saved) { done[k] = true; return; }
    if (shown(c)) { done[k] = true; return; }
    var dateEl = el(c.required[0]);
    if (dateEl && dateEl.value) { done[k] = true; return; } /* بدأ يكتب بنفسه: لا نتدخل */
    done[k] = true;
    fill(c, saved);
    setTimeout(function () {
      if (!c.required.every(function (id) { var e = el(id); return e && e.value; })) return;
      try { form.requestSubmit(); } catch (e) { }
    }, 250);
  }

  function boot() {
    Object.keys(CFG).forEach(watch);
    var run = function (d) { setTimeout(function () { Object.keys(CFG).forEach(tryRestore); }, d); };
    run(900);
    window.addEventListener('hashchange', function () { run(250); });
  }
  if (document.readyState === 'complete') boot(); else window.addEventListener('load', boot);
  window.AqRestoreLast = { clear: function () { try { localStorage.removeItem(KEY); } catch (e) { } } };
})();

;
/* assets/js/pwa-register.js */
/* تسجيل Service Worker: يعمل على https وlocalhost فقط، ولا يؤثر على أي شاشة. */
(function () {
  if (!('serviceWorker' in navigator)) return;
  var ok = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (!ok) return;
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js', { scope: './' }).catch(function () {});
  });
})();

;
/* assets/js/matrix-modes.js */
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

  /* ملخّص مسطّح لنقاط المصفوفة، يُبنى من المحرك نفسه انطلاقاً من الأركان الأربعة (لا معادلات مكرّرة هنا) */
  function flatOf(m) {
    var a = m.anchors, c = m.corners, i = m.intermediate, g = m.generational, pu = m.purposes, ch = m.channels;
    return { A: a.A, B: a.B, C: a.C, D: a.D, E: a.E, F: c.F, G: c.G, H: c.H, I: c.I,
      father: g.father.combined, mother: g.mother.combined,
      A2: i.A2, B2: i.B2, C2: i.C2, D2: i.D2, D3: i.D3,
      balance: ch.balancePoint, heart: ch.heartPoint, money: ch.moneyPoint,
      sky: pu.sky, earth: pu.earth, personal: pu.personal, social: pu.social, spiritual: pu.spiritual };
  }
  function fromAnchors(A, B, C, D) { return flatOf(AD().buildMatrixFromAnchors(A, B, C, D)); }
  /* من الأركان الثلاثة (الدرس D = اختزال A+B+C) */
  function fromCorners(A, B, C) { return fromAnchors(A, B, C, AD().reduceArcana(A + B + C)); }
  function ofDate(dateStr, today) {
    var m = AD().calculateDestinyMatrix(dateStr, today), a = m.anchors;
    var P = fromCorners(a.A, a.B, a.C);
    P.yearEnergy = m.yearEnergy; P.ageMap = m.ageMap; P.birth = m.birthDate;
    return P;
  }
  /* مصفوفة الشراكة: نجمع الأركان الأربعة للشريكين فقط ثم نعيد حساب كل نقطة أخرى منها (منهج الموقع المرجعي).
     طابقنا الأرقام مع النتيجة المرجعية لتاريخي 25/09/1999 و24/09/1990 (المركز 12، الأسرة 15، المشاعر 9، المال 10). */
  function pairOf(d1, d2) {
    var r = AD().reduceArcana, p1 = ofDate(d1), p2 = ofDate(d2);
    /* نجمع الأركان الأربعة فقط (اليوم، الشهر، السنة، الدرس) ثم نعيد بناء بقية المصفوفة منها */
    var c = fromAnchors(r(p1.A + p2.A), r(p1.B + p2.B), r(p1.C + p2.C), r(p1.D + p2.D));
    return { a: p1, b: p2, c: c };
  }
  /* مصفوفة الشراكة الكاملة بنفس بنية محرك المصفوفة الفردية، لتُرسم بنفس رسم الموقع (generateMatrixSVG) */
  function pairFull(d1, d2) {
    var r = AD().reduceArcana, m1 = AD().calculateDestinyMatrix(d1), m2 = AD().calculateDestinyMatrix(d2);
    var P = AD().buildMatrixFromAnchors(
      r(m1.anchors.A + m2.anchors.A), r(m1.anchors.B + m2.anchors.B),
      r(m1.anchors.C + m2.anchors.C), r(m1.anchors.D + m2.anchors.D));
    var axis = function (m, X) { var mid = r(X + m.anchors.E); return { mid: mid, outer: r(X + mid), inner: r(mid + m.anchors.E) }; };
    var diag = function (m, X) { var inner = r(X + m.anchors.E); return { inner: inner, outer: r(X + inner) }; };
    /* نقاط المحاور والأقطار تُحسب من مصفوفة الشراكة نفسها (مركزها E الخاص بالشراكة) لا من جمع نقاط الشخصين */
    var axisK = { left: 'A', top: 'B', right: 'C', bottom: 'D' };
    P.pairAxis = {}; Object.keys(axisK).forEach(function (k) { P.pairAxis[k] = axis(P, P.anchors[axisK[k]]); });
    P.pairDiag = {}; ['F', 'G', 'H', 'I'].forEach(function (k) { P.pairDiag[k] = diag(P, P.corners[k]); });
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
        body += '<div class="mxm-ptslot" data-sec="' + (specs === CHILD ? 'child-' : 'pair-') + i + '" data-pt="' + esc(p[0]) + '" data-n="' + v.n + '"></div>' + slot('aqm-slot-detailed', 'd', esc(p[1]) + ' · ' + v.n + ' ' + esc(a.name) + (v.x ? ' · ' + esc(v.x) : ''), '<p>' + esc(a.archetype) + '.</p>') +
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
  /* نصوص المؤلف من القوالب: تظهر فقط حين تكون الخانة غير فارغة، وبلا أي undefined */
  function hydrateModeSlots(host, mode) {
    var L = window.AqeeqMatrix; if (!L || !L.modeSlots) return;
    var cache = {};
    host.querySelectorAll('.mxm-ptslot').forEach(function (el) {
      var n = +el.dataset.n; if (!(n >= 1 && n <= 22)) return;
      (cache[n] = cache[n] || L.modeSlots(mode, n)).then(function (d) {
        if (!d) return;
        var sec = d.sections.filter(function (s) { return s.id === el.dataset.sec; })[0];
        var sl = sec && sec.slots.filter(function (x) { return x.key === el.dataset.pt; })[0];
        var t = sl && typeof sl.text === 'string' ? sl.text.trim() : '';
        var q = typeof sl.reflection_question === 'string' ? sl.reflection_question.trim() : '';
        if (!t && !q) return;
        el.innerHTML = (t ? t.split(/\n{2,}/).map(function (para) { return '<p class="aqm-g-p">' + esc(para) + '</p>'; }).join('') : '') + (q ? '<p class="aqm-g-p aqm-reflection"><em>' + esc(q) + '</em></p>' : '');
      });
    });
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
    host.hidden = false; bindAcc(host); hydrateModeSlots(host, 'compat'); bindMap(host, pairFull(d1, d2));
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
    host.hidden = false; bindAcc(host); hydrateModeSlots(host, 'child'); if (full) bindMap(host, full, { age: 'الطاقة التي يمرّ بها الطفل عند هذا العمر', dec: 'بداية مرحلة جديدة في عمره', node: 'نقطة من خريطة الطفل' });
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
  window.AqMatrixModes = { fromCorners: fromCorners, fromAnchors: fromAnchors, ofDate: ofDate, pairOf: pairOf, ageEnergy: ageEnergy, renderPair: renderPair, pairFull: pairFull };
  if (typeof module !== 'undefined' && module.exports) module.exports = window.AqMatrixModes;
  if (typeof document !== 'undefined') {
    var boot = function () { build(); buildCompatPage(); buildChildPage(); var n = 0; (function t() { buildCompatPage(); buildChildPage(); if (++n < 12 && !((document.getElementById('mxc-form') || {}).__mxc && (document.getElementById('mxk-form') || {}).__mxc)) setTimeout(t, 400); })(); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  }
})();

;
/* assets/js/matrix-sheet.js */
/* مصفوفة القدر — نتيجة الهاتف: تبويبات تحت الخريطة + نافذة منبثقة للتفسير (عرض فقط، لا تغيير في الحسابات) */
(function () {
  'use strict';
  var mq = window.matchMedia('(max-width: 820px)');
  var sheet = null, lastFocus = null;

  function ensureSheet() {
    if (sheet) return sheet;
    sheet = document.createElement('div');
    sheet.className = 'aqm-sheet'; sheet.hidden = true;
    sheet.innerHTML = '<div class="aqm-sheet-scrim" data-close></div>' +
      '<div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="aqm-sheet-title">' +
      '<span class="aqm-sheet-grip" aria-hidden="true"></span>' +
      '<button type="button" class="aqm-sheet-x" data-close aria-label="إغلاق"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="aqm-sheet-head"><span class="aqm-sheet-ic"></span><div><h3 id="aqm-sheet-title"></h3><p class="aqm-sheet-sub"></p></div></div>' +
      '<div class="aqm-sheet-nums"><span class="aqm-sheet-lbl">الأرقام المرتبطة بهذا القسم</span><div class="aqm-sheet-badges"></div></div>' +
      '<div class="aqm-sheet-body"></div>' +
      '<div class="aqm-sheet-foot"><button type="button" class="aqm-foot-next" data-next hidden><span class="aqm-foot-l"><small>القسم التالي</small><b></b></span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button><button type="button" class="aqm-foot-close" data-close>إغلاق</button></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-next]')) { var n = nextItem(); if (n) { var sb = sheet.querySelector('.aqm-sheet-body'); sheet.classList.add('is-swap'); setTimeout(function () { fill(n); sheet.classList.remove('is-swap'); }, 160); } return; }
      if (e.target.closest('[data-close]')) close();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) close(); });
    return sheet;
  }
  var cur = null;
  function nextItem() { if (!cur) return null; var all = [].slice.call(cur.parentNode.querySelectorAll('.aqm-acc-item')), i = all.indexOf(cur); return i > -1 && i < all.length - 1 ? all[i + 1] : null; }
  function fill(item) {
    var s = ensureSheet(); cur = item;
    var q = function (sel) { return item.querySelector(sel); };
    var ic = q('.aqm-acc-icon'), t = q('.aqm-acc-title'), st = q('.aqm-acc-subtitle'), bd = q('.aqm-acc-badges'), body = q('.aqm-acc-body');
    s.querySelector('.aqm-sheet-ic').innerHTML = ic ? ic.innerHTML : '';
    s.querySelector('#aqm-sheet-title').textContent = t ? t.textContent : '';
    s.querySelector('.aqm-sheet-sub').textContent = st ? st.textContent : '';
    var bb = s.querySelector('.aqm-sheet-badges'); bb.innerHTML = bd ? bd.innerHTML : '';
    s.querySelector('.aqm-sheet-nums').style.display = bb.children.length ? '' : 'none';
    var sb = s.querySelector('.aqm-sheet-body'); sb.innerHTML = body ? body.innerHTML : ''; sb.scrollTop = 0;
    /* إبراز الكلمات المفتاحية (العبارة قبل النقطتين في بداية الفقرة) */
    [].forEach.call(sb.querySelectorAll('p.aqm-g-p, li.aqm-g-li'), function (n) { var f = n.firstChild; if (!f || f.nodeType !== 3) return; var m = /^\s*([^:：\n]{2,28})([:：])/.exec(f.nodeValue); if (!m) return; var kw = document.createElement('b'); kw.className = 'aqm-kw'; kw.textContent = m[1] + m[2]; f.nodeValue = f.nodeValue.slice(m[0].length); n.insertBefore(kw, f); });
    var nx = nextItem(), nb = s.querySelector('[data-next]');
    if (nx) { var nt = nx.querySelector('.aqm-acc-title'); nb.querySelector('b').textContent = nt ? nt.textContent : ''; nb.hidden = false; } else nb.hidden = true;
  }
  function open(item) {
    var s = ensureSheet(); fill(item);
    lastFocus = document.activeElement;
    s.classList.remove('is-closing'); s.hidden = false; document.documentElement.classList.add('aqm-sheet-open');
    var sbo = s.querySelector('.aqm-sheet-body'); if (sbo) sbo.scrollTop = 0; var pn = s.querySelector('.aqm-sheet-panel'); if (pn) pn.scrollTop = 0;
    var x = s.querySelector('.aqm-sheet-x'); if (x) x.focus({ preventScroll: true });
  }
  function close() {
    if (!sheet || sheet.hidden) return; sheet.classList.add('is-closing');
    var sbc = sheet.querySelector('.aqm-sheet-body'); if (sbc) sbc.scrollTop = 0;
    var sh = sheet; setTimeout(function () { sh.hidden = true; sh.classList.remove('is-closing'); document.documentElement.classList.remove('aqm-sheet-open'); }, 230);
    if (lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
  }

  /* قراءة الخريطة كاملة: فهرس جامع بالأقسام وأرقامها */
  var OV_ICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 9-9 9-9-9z"/><path d="M12 8l4 4-4 4-4-4z"/></svg>';
  function openOverview() {
    var s = ensureSheet(), items = [].slice.call(document.querySelectorAll('#mresult .aqm-acc-item'));
    cur = null;
    s.querySelector('.aqm-sheet-ic').innerHTML = OV_ICO;
    s.querySelector('#aqm-sheet-title').textContent = 'خريطتك كاملة';
    s.querySelector('.aqm-sheet-sub').textContent = 'اضغط على أي قسم لتقرأ تفسيره';
    s.querySelector('.aqm-sheet-nums').style.display = 'none';
    s.querySelector('[data-next]').hidden = true;
    var h = '<p class="aqm-ov-soon">الوصف الجامع لخريطتك قيد الإضافة.</p><ol class="aqm-ov-list">' + items.map(function (it, i) {
      var t = it.querySelector('.aqm-acc-title'), q = it.querySelector('.aqm-acc-subtitle'), b = it.querySelector('.aqm-acc-badges'), ic = it.querySelector('.aqm-acc-icon');
      return '<li><button type="button" class="aqm-ov-row" data-ov="' + i + '"><span class="aqm-ov-ic">' + (ic ? ic.innerHTML : '') + '</span><span class="aqm-ov-tx"><b>' + (t ? t.textContent : '') + '</b><small>' + (q ? q.textContent : '') + '</small><span class="aqm-ov-b">' + (b ? b.innerHTML : '') + '</span></span></button></li>';
    }).join('') + '</ol>';
    var sb = s.querySelector('.aqm-sheet-body'); sb.innerHTML = h; sb.scrollTop = 0;
    sb.querySelectorAll('[data-ov]').forEach(function (r) { r.addEventListener('click', function () { var it = items[Number(r.getAttribute('data-ov'))]; if (it) fill(it); }); });
    lastFocus = document.activeElement; s.classList.remove('is-closing'); s.hidden = false; document.documentElement.classList.add('aqm-sheet-open');
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-aqm-overview]')) { e.preventDefault(); openOverview(); }
  });

  /* اعتراض النقر على رأس الأكورديون على الهاتف */
  document.addEventListener('click', function (e) {
    var h = e.target.closest && e.target.closest('#mresult .aqm-acc-header, .mxc-acc .aqm-acc-header');
    if (!h) return;
    var pair = !!h.closest('.mxc-acc');
    if (!pair && !mq.matches) return;
    e.preventDefault(); e.stopPropagation();
    ensureSheet().classList.toggle('is-pair', pair);
    open(h.closest('.aqm-acc-item'));
  }, true);

  /* تبويبات: تفسيرات / شاكرات / خطوط */
  function setup(host) {
    if (!host) return;
    var tabs = host.querySelector('.aqm-tabs'); if (!tabs || tabs.__aqmSheet) return;
    tabs.__aqmSheet = true;
    var chak = host.querySelector('#aqm-chakras'), lines = host.querySelector('.aqm-lines'), read = host.querySelector('#aqm-readings'), fc = host.querySelector('#aqm-forecast');
    var panel = document.createElement('div'); panel.className = 'aqm-mpanels';
    var hint = document.createElement('p'); hint.className = 'aqm-hint';
    hint.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v4h1"/></svg><span>اضغط على أي قسم لعرض تفسيره</span>';
    tabs.parentNode.insertBefore(panel, tabs.nextSibling);
    if (!host.querySelector('.aqm-cue')) {
      var cue = document.createElement('button'); cue.type = 'button'; cue.className = 'aqm-cue'; cue.setAttribute('aria-label', 'انتقل إلى القراءة');
      cue.innerHTML = '<span>قراءتك بالأسفل</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8l6 6 6-6"/><path d="M6 14l6 6 6-6" opacity=".5"/></svg>';
      cue.addEventListener('click', function () { tabs.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      tabs.parentNode.insertBefore(cue, tabs);
    }
    var pr = document.createElement('div'); pr.className = 'aqm-mp aqm-mp-read'; pr.appendChild(hint); if (read) pr.appendChild(read);
    var pc = document.createElement('div'); pc.className = 'aqm-mp aqm-mp-chak'; if (chak) pc.appendChild(chak);
    var pl = document.createElement('div'); pl.className = 'aqm-mp aqm-mp-lines'; if (lines) pl.appendChild(lines);
    var pf = document.createElement('div'); pf.className = 'aqm-mp aqm-mp-fc'; if (fc) pf.appendChild(fc);
    panel.appendChild(pr); panel.appendChild(pc); panel.appendChild(pl); panel.appendChild(pf);
    var a = tabs.querySelectorAll('.aqm-tab'); var names = ['الخريطة', 'الشاكرات', 'التفسيرات'];
    /* ترتيب التبويبات: التفسيرات أولًا */
    var map = { 'التفسيرات': 'read', 'الشاكرات': 'chak', 'الخطوط': 'lines', 'التوقعات': 'fc' };
    a.forEach(function (t) { var n = t.textContent.trim(); if (n === 'الخريطة') { t.textContent = 'الخطوط'; t.setAttribute('href', '#aqm-lines'); } });
    var order = ['التفسيرات', 'الشاكرات', 'الخطوط', 'التوقعات'];
    var list = Array.prototype.slice.call(tabs.querySelectorAll('.aqm-tab'));
    order.forEach(function (n) { var t = list.filter(function (x) { return x.textContent.trim() === n; })[0]; if (t) tabs.appendChild(t); });
    function set(k) {
      host.setAttribute('data-mtab', k);
      tabs.querySelectorAll('.aqm-tab').forEach(function (t) { var on = map[t.textContent.trim()] === k; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', String(on)); });
    }
    tabs.addEventListener('click', function (e) {
      var t = e.target.closest('.aqm-tab'); if (!t) return;
      if (!mq.matches) return;
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      set(map[t.textContent.trim()] || 'read');
    }, true);
    set('read');
  }
  var wasShown = false;
  function scan() {
    var h = document.getElementById('mresult'); var shown = !!(h && !h.hidden && h.querySelector('.aqm-shell'));
    if (shown && !wasShown && mq.matches) {
      var sec = document.getElementById('matrix');
      [60, 450, 900].forEach(function (d) { setTimeout(function () { if (sec) sec.scrollTop = 0; }, d); });
    }
    wasShown = shown; document.documentElement.classList.toggle('mxr-on', shown);
    if (!mq.matches) return;
    if (shown) setup(h);
  }
  new MutationObserver(function () { scan(); }).observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();

;
/* assets/js/lifepath-sheet.js */
/* مسار الحياة — نتيجة الجوال: بلاطات دائرية + نافذة سفلية + توحيد الأكورديونات.
   عرض فقط: يقرأ ما رسمه المحرك الحالي ولا يحسب أي قيمة. */
(function () {
  'use strict';
  var sec = document.getElementById('lifepath'), res = document.getElementById('lpresult');
  if (!sec || !res) return;
  var root = document.documentElement, lastKey = '', sheet = null, closeT = 0;
  var AQL = window.__aqLock = window.__aqLock || { s: {}, on: function (k) { this.s[k] = 1; document.documentElement.classList.add('aqm-sheet-open'); }, off: function (k) { delete this.s[k]; if (!Object.keys(this.s).length) document.documentElement.classList.remove('aqm-sheet-open'); } };
  function lpNum() { var b = document.querySelector('#lpresult .numbadge'), n = b ? parseInt(b.textContent, 10) : 0; return n > 0 ? String(n) : ''; }
  function paintBadges(s, list) {
    var el = s.querySelector('.lp-hbadges'); if (!el) return;
    list = (list || []).filter(function (b) { return b && b.v !== '' && b.v != null; });
    el.innerHTML = list.map(function (b) { return '<span class="lp-hbadge" aria-label="' + esc(b.l + ' ' + b.v) + '"><small>' + esc(b.l) + '</small><b>' + esc(b.v) + '</b></span>'; }).join('');
    el.hidden = !list.length;
  }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function sv(d, w) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.6) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  var IC = {
    stages: sv('<path d="M3 20h4v-5h4v-5h4V5h6"/><path d="M3 20h18"/>'),
    peaks: sv('<path d="M2.5 19.5 9 8l4 6 3-4 5.500 9.500z"/>'),
    chal: sv('<path d="M12 3l8 3.500v5.500c0 4.500-3.300 7.800-8 9-4.700-1.200-8-4.500-8-9V6.500z"/><path d="M9 12l2.200 2.200L15.500 10"/>'),
    name: sv('<path d="M3.500 11.500C4.200 7 7.600 3.500 12 3.500s7.800 3.500 8.500 8"/><path d="M5.500 14c0-4.200 2.800-7.500 6.500-7.500s6.500 3.300 6.500 7.500"/><path d="M8.500 15c0-2.800 1.500-5 3.500-5s3.500 2.200 3.500 5"/><path d="M11 16c0-1.100.4-1.900 1-1.900s1 .8 1 1.900"/><path d="M6.500 19.500c.6-1.500.9-3 .9-4.500M9.500 21c.7-1.600 1.100-3.400 1.100-5.200M13 21.200c.4-1.500.6-3.200.6-5M16.500 20c.4-1.600.6-3.200.6-5M19 17.500c.2-1.100.3-2.200.3-3.200"/>'),
    heart: sv('<path d="M12 20s-7.500-4.600-7.500-10.200A4.200 4.200 0 0 1 12 7.300a4.200 4.200 0 0 1 7.500 2.500C19.500 15.400 12 20 12 20z"/>'),
    mask: sv('<path d="M4 7.500c0-1 .8-2 2-2h12c1.200 0 2 1 2 2V11c0 4.500-3.500 7.500-8 8.500C7.500 18.500 4 15.500 4 11z"/><path d="M8 10.500c.8-.6 1.700-.6 2.500 0M13.500 10.500c.8-.6 1.700-.6 2.500 0M9 14.500c1.700 1.200 4.300 1.200 6 0"/>'),
    route: sv('<circle cx="6" cy="19" r="2.200"/><circle cx="18" cy="5" r="2.200"/><path d="M6 16.800V14a4 4 0 0 1 4-4h4a4 4 0 0 0 4-4V7.200"/>'),
    chev: sv('<path d="M15 6l-6 6 6 6"/>', 2),
    back: sv('<path d="M5 12h14M13 6l6 6-6 6"/>', 2),
    light: sv('<circle cx="12" cy="12" r="4"/><path d="M12 3v2.500M12 18.500V21M3 12h2.500M18.500 12H21M5.600 5.600l1.800 1.800M16.600 16.600l1.800 1.800M5.600 18.400l1.800-1.800M16.600 7.400l1.800-1.800"/>'),
    shadow: sv('<path d="M20 14.500A8 8 0 0 1 9.500 4a8 8 0 1 0 10.500 10.500z"/>'),
    star: sv('<path d="M12 3l2.200 6 6 2.200-6 2.200L12 19.500l-2.200-6-6-2.200 6-2.200z"/>'),
    mirror: sv('<ellipse cx="12" cy="9.500" rx="5.500" ry="6.500"/><path d="M12 16v5M9 21h6"/>'),
    lock: sv('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    magnet: sv('<path d="M6 3v8a6 6 0 0 0 12 0V3h-4v8a2 2 0 0 1-4 0V3z"/><path d="M6 7h4M14 7h4"/>'),
    person: sv('<circle cx="12" cy="7.500" r="3.200"/><path d="M5.500 21v-1.500a6.500 6.500 0 0 1 13 0V21"/>'),
    body: sv('<circle cx="12" cy="5" r="2.200"/><path d="M12 8v6M7.500 10.500 12 12l4.500-1.500M9.500 21 12 14l2.500 7"/>'),
    scale: sv('<path d="M12 4v16M6 20h12M5 7h14"/><path d="M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>'),
    cross: sv('<path d="M9 4h6v5h5v6h-5v5H9v-5H4V9h5z"/>'),
    about: sv('<rect x="3" y="5" width="18" height="14" rx="2.500"/><circle cx="9" cy="11" r="2"/><path d="M6 16.500c.5-1.600 1.700-2.400 3-2.400s2.500.8 3 2.400M14.500 10h3.500M14.500 13.500h2.500"/>'),
    ask: sv('<circle cx="12" cy="12" r="9"/><path d="M9.500 9.500a2.500 2.500 0 1 1 3.500 2.300c-.7.400-1 1-1 1.700M12 17v.01"/>')
  };
  var TIC = [[/المراية/, 'mirror'], [/البلوكات/, 'lock'], [/الشفرة العاطفية/, 'heart'], [/مغناطيس/, 'magnet'], [/جرح الطفولة/, 'person'], [/البصمة الجسدية/, 'body'], [/جدول المقارنة/, 'scale'], [/روشتة/, 'cross'], [/خريطة التحول/, 'route']];
  function icFor(t, fb) { for (var i = 0; i < TIC.length; i++) if (TIC[i][0].test(t)) return IC[TIC[i][1]]; return fb; }
  var STT = { past: 'مرحلة مضت', current: 'أنت هنا', future: 'مرحلة قادمة' };

  /* ---------- النافذة السفلية ---------- */
  function ensureSheet() {
    if (sheet) return sheet;
    sheet = document.createElement('div'); sheet.className = 'aqm-sheet lps-sheet'; sheet.hidden = true;
    sheet.innerHTML = '<div class="aqm-sheet-scrim" data-lps-close></div>' +
      '<div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="lps-title">' +
      '<span class="aqm-sheet-grip" aria-hidden="true"></span>' +
      '<button type="button" class="aqm-sheet-x" data-lps-close aria-label="إغلاق"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="aqm-sheet-head"><span class="aqm-sheet-ic"></span><div><div class="lp-hbadges" hidden></div><h3 id="lps-title"></h3><p class="aqm-sheet-sub"></p></div></div>' +
      '<div class="aqm-sheet-body lps-body"></div>' +
      '<div class="aqm-sheet-foot"><button type="button" class="aqm-foot-next" data-lps-next hidden><span class="aqm-foot-l"><small>القسم التالي</small><b></b></span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button><button type="button" class="aqm-foot-close" data-lps-close>إغلاق</button></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-lps-close]')) { closeSheet(); return; }
      if (e.target.closest('[data-lps-next]')) { goNext(); return; }
      var r = e.target.closest('[data-lps-row]');
      if (r) { showStage(Number(r.getAttribute('data-lps-row')), r.getAttribute('data-lps-from')); return; }
      if (e.target.closest('[data-lps-list]')) { openTile(sheet.getAttribute('data-kind')); return; }
      var o = e.target.closest('[data-lps-open]');
      if (o) { var i = o.getAttribute('data-lps-open'); closeSheet(); var b = $('#lpj-stage [data-lpj-open="' + i + '"]', res); if (b) b.click(); return; }
      if (e.target.closest('[data-lps-name]')) { closeSheet(); var ed = $('#btn-edit-lp', res); if (ed) ed.click(); setTimeout(function () { var n = document.getElementById('lp-name'); if (n) n.focus({ preventScroll: true }); }, 250); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet && !sheet.hidden) closeSheet(); });
    return sheet;
  }
  function openSheet(kind, ico, title, sub, html) {
    var s = ensureSheet();
    s.setAttribute('data-kind', kind);
    $('.aqm-sheet-ic', s).innerHTML = ico;
    $('#lps-title', s).textContent = title;
    $('.aqm-sheet-sub', s).textContent = sub || '';
    var b = $('.lps-body', s); b.style.scrollBehavior = 'auto'; b.innerHTML = html; b.scrollTop = 0;
    clearTimeout(closeT); s.classList.remove('is-closing'); s.hidden = false; AQL.on('lps'); paintBadges(s, badgesFor(kind));
    var top0 = function () { b.style.scrollBehavior = 'auto'; try { b.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch (e) { b.scrollTop = 0; } b.scrollTop = 0; var pn = $('.aqm-sheet-panel', s); if (pn) pn.scrollTop = 0; };
    top0(); requestAnimationFrame(top0); setTimeout(top0, 60); setTimeout(top0, 260);
    syncNext(kind);
  }
  /* زر «القسم التالي»: يتبع ترتيب الصفوف في القائمة نفسها */
  var gOrder = [], gItems = {}, gTitles = {};
  function keyOf(kind) { return /^(stages|peaks|chal|name|extra)$/.test(kind) ? 't:' + kind : kind; }
  function syncNext(kind) {
    var b = $('[data-lps-next]', sheet), i = gOrder.indexOf(keyOf(kind)), nk = i > -1 ? gOrder[i + 1] : null;
    if (!b) return;
    if (nk) { $('b', b).textContent = gTitles[nk] || ''; b.hidden = false; } else b.hidden = true;
  }
  function goNext() {
    var i = gOrder.indexOf(keyOf(sheet.getAttribute('data-kind'))), nk = i > -1 ? gOrder[i + 1] : null;
    if (!nk || !gItems[nk]) return;
    sheet.classList.add('is-swap'); setTimeout(function () { gItems[nk](); sheet.classList.remove('is-swap'); }, 160);
  }
  function closeSheet() { if (!sheet || sheet.hidden) return; sheet.classList.add('is-closing'); var sh = sheet; clearTimeout(closeT); closeT = setTimeout(function () { sh.hidden = true; sh.classList.remove('is-closing'); AQL.off('lps'); }, 230); }

  /* ---------- بيانات المراحل من DOM المحرك ---------- */
  function rowsOf(card) { return $$('.lpj-row', card).map(function (b) { return { i: Number(b.getAttribute('data-i')), st: b.getAttribute('data-status'), v: ($('.v', b) || {}).textContent, lbl: ($('.tx > b', b) || {}).textContent, per: ($('.tx > span', b) || {}).textContent, el: b }; }); }
  function pcCards() { var pc = $('#lpj-pc', res); return pc ? { p: $('.lpj-card:not(.ch)', pc), c: $('.lpj-card.ch', pc) } : null; }
  /* شارات رأس النافذة: أرقام القسم نفسه من حسابات المحرك (قراءة DOM فقط) */
  function badgesFor(kind) {
    var pc = pcCards(), out = [];
    function vals(card, pfx) { return card ? rowsOf(card).map(function (r) { return { l: pfx + (r.i + 1), v: (r.v || '').trim() }; }) : []; }
    if (kind === 'peaks') return pc ? vals(pc.p, 'P') : [];
    if (kind === 'chal') return pc ? vals(pc.c, 'C') : [];
    if (kind === 'stages') {
      if (!pc || !pc.p) return [];
      var P = rowsOf(pc.p), C = pc.c ? rowsOf(pc.c) : [], cur = P.filter(function (r) { return r.st === 'current'; })[0] || P[0];
      return cur ? [{ l: 'P' + (cur.i + 1), v: (cur.v || '').trim() }].concat(C[cur.i] ? [{ l: 'C' + (cur.i + 1), v: (C[cur.i].v || '').trim() }] : []) : [];
    }
    if (kind === 'name') {
      $$('.aqeq-name-group', res).forEach(function (g) {
        var t = (($('h4', g) || {}).textContent || ''), n = ($('.aqeq-name-number', g) || {}).textContent;
        out.push({ l: /روح/.test(t) ? 'الروح' : /شخصية/.test(t) ? 'الشخصية' : /تعبير/.test(t) ? 'التعبير' : t.trim(), v: ((n || '').match(/\d+/) || [''])[0] });
      });
      return out;
    }
    if (kind === 'extra') {
      [['.aqeq-personal-year:not(.aqeq-personal-month):not(.aqeq-personal-day)', 'السنة'], ['.aqeq-personal-month', 'الشهر'], ['.aqeq-personal-day', 'اليوم'], ['.aqeq-extra-birthday', 'الميلاد'], ['.aqeq-extra-maturity', 'النضج']].forEach(function (a) {
        var el = $(a[0], res), n = el && $('.aqeq-extra-number', el);
        if (n) out.push({ l: a[1], v: (n.textContent.match(/\d+/) || [''])[0] });
      });
      return out;
    }
    if (kind === 'about') return [];
    var lp = lpNum(); return lp ? [{ l: 'مسارك', v: lp }] : [];
  }
  function stageTitles(P) {
    /* يقرأ عنوان كل مرحلة من بطاقة المرحلة التي يرسمها العرض الحالي ثم يعيد التحديد */
    var out = [], cur = P.filter(function (r) { return r.st === 'current'; })[0] || P[0];
    P.forEach(function (r) { r.el.click(); var h = $('#lpj-stage h3', res); out[r.i] = h ? h.textContent.replace(/^\s*المرحلة\s*\d+\s*[—–-]\s*/, '').trim() : ''; });
    if (cur) cur.el.click();
    return out;
  }

  function listHTML(kind) {
    var cards = pcCards(); if (!cards || !cards.p) return '<p class="lps-empty">تعذر تجهيز هذه القراءة حاليًا.</p>';
    var P = rowsOf(cards.p), C = cards.c ? rowsOf(cards.c) : [], h = '';
    if (kind === 'stages') {
      var T = stageTitles(P);
      h = '<ol class="lps-list">' + P.map(function (r) {
        return '<li><button type="button" class="lps-row" data-st="' + r.st + '" data-lps-row="' + r.i + '" data-lps-from="stages"><span class="lps-n">' + (r.i + 1) + '</span><span class="lps-tx"><b>' + esc(T[r.i] || r.lbl) + '</b><small>' + esc(r.per) + '</small></span><em class="lps-tag">' + STT[r.st] + '</em><span class="lps-go">' + IC.chev + '</span></button></li>';
      }).join('') + '</ol>';
    } else {
      var arr = kind === 'peaks' ? P : C;
      h = '<ol class="lps-list lps-vals">' + arr.map(function (r) {
        return '<li><button type="button" class="lps-row" data-st="' + r.st + '" data-lps-row="' + r.i + '" data-lps-from="' + kind + '"><span class="lps-v">' + esc(r.v) + '</span><span class="lps-tx"><b>' + esc(r.lbl) + '</b><small>' + esc(r.per) + '</small></span><em class="lps-tag">' + STT[r.st] + '</em><span class="lps-go">' + IC.chev + '</span></button></li>';
      }).join('') + '</ol>';
    }
    return h;
  }
  function showStage(i, from) {
    var cards = pcCards(); if (!cards || !cards.p) return;
    var r = rowsOf(cards.p).filter(function (x) { return x.i === i; })[0]; if (r) r.el.click();
    var st = $('#lpj-stage', res); if (!st) return;
    var c = st.cloneNode(true); c.removeAttribute('id');
    $$('[data-lpj-open]', c).forEach(function (b) { var n = b.getAttribute('data-lpj-open'); b.removeAttribute('data-lpj-open'); b.setAttribute('data-lps-open', n); });
    var body = $('.lps-body', ensureSheet());
    body.innerHTML = '<button type="button" class="lps-back" data-lps-list>' + IC.back + '<span>الرجوع إلى القائمة</span></button><div class="lps-detail">' + c.innerHTML + '</div>';
    body.scrollTop = 0;
    var cr = cards.c ? rowsOf(cards.c)[i] : null;
    paintBadges(ensureSheet(), [{ l: 'P' + (i + 1), v: ((r && r.v) || '').trim() }].concat(cr ? [{ l: 'C' + (i + 1), v: (cr.v || '').trim() }] : []));
  }
  /* ترتيب نص بصمة الاسم: نفس الكلام بالحرف، بس مقسّم عناوين وسطور وخطوات */
  function tidyName(root) {
    var kids = [].slice.call(root.children), out = document.createDocumentFragment(), steps = null, lst = null, prevH = '', first = true;
    function flush() { steps = null; lst = null; }
    kids.forEach(function (k) {
      var tx = (k.textContent || '').replace(/\s+/g, ' ').trim();
      if (!tx || /^[═─━\-=\s]{4,}$/.test(tx)) return;
      if (k.tagName === 'UL') {
        if (!lst) { lst = document.createElement('ul'); lst.className = 'lpn-lst' + (/تتصادم/.test(prevH) ? ' is-clash' : ''); out.appendChild(lst); }
        [].forEach.call(k.children, function (li) {
          var t = li.textContent.trim(), m = t.match(/^مع\s*(\d+)\s*[:：]\s*([\s\S]*)$/), n = document.createElement('li');
          if (m) n.innerHTML = '<i>' + m[1] + '</i><span>' + esc(m[2]) + '</span>'; else n.textContent = t;
          lst.appendChild(n);
        });
        return;
      }
      lst = null;
      var st = tx.match(/^(\d+)\s*[.\-)]\s*([\s\S]+)$/);
      if (st && k.tagName === 'P') {
        if (!steps) { steps = document.createElement('ol'); steps.className = 'lpn-steps'; out.appendChild(steps); }
        var li = document.createElement('li'); li.innerHTML = '<i>' + st[1] + '</i><span>' + esc(st[2]) + '</span>'; steps.appendChild(li); return;
      }
      steps = null;
      if (/[:：]$/.test(tx) && tx.length < 70) { var h = document.createElement('h5'); h.className = 'lpn-h'; h.textContent = tx.replace(/[:：]$/, ''); out.appendChild(h); prevH = tx; first = false; return; }
      var src = first ? tx.match(/^([\s\S]*?)\s*(الأصل العلمي\s*[:：][\s\S]*)$/) : null;
      if (src && src[1]) { var p0 = document.createElement('p'); p0.className = 'lpn-p'; p0.textContent = src[1]; out.appendChild(p0); var q = document.createElement('p'); q.className = 'lpn-src'; q.textContent = src[2]; out.appendChild(q); first = false; return; }
      var kv = tx.match(/^([^:："“”]{2,40})[:：]\s*([\s\S]+)$/);
      if (kv && k.tagName === 'P') {
        var e = document.createElement('p'); e.className = 'lpn-kv' + (/الخوف|الجرح|الظل|المشكلة|الدفاع|يزعج/.test(kv[1]) ? ' is-sh' : /مفتاحك|الحقيقة|تعرف إنك|الأمان/.test(kv[1]) ? ' is-key' : '');
        e.innerHTML = '<b>' + esc(kv[1]) + '</b><span>' + esc(kv[2]) + '</span>'; out.appendChild(e); prevH = kv[1]; first = false; return;
      }
      var pp = document.createElement('p'); pp.className = 'lpn-p'; pp.textContent = tx; out.appendChild(pp); first = false;
    });
    root.innerHTML = ''; root.appendChild(out);
  }
  function nameHTML() {
    var n = $('.aqeq-name-readings', res);
    if (!n || n.classList.contains('is-empty')) {
      return '<div class="lps-noname"><p>أضف اسمك ليظهر لك هنا ما تكشفه أرقام اسمك عن رغبة روحك وصورتك أمام الناس ومسارك الداخلي.</p><button type="button" class="lps-cta" data-lps-name>أضف اسمك الآن</button></div>';
    }
    var c = n.cloneNode(true);
    $$('.aqeq-extra-numbers,.aqeq-pc-wrap', c).forEach(function (x) { x.remove(); });
    var hd = $('.aqeq-name-heading', c); if (hd) { var k = $('.aqeq-name-kicker', hd), p = $('p', hd); if (k) k.remove(); if (p) p.remove(); }
    $$('.aqeq-name-group', c).forEach(function (g, gi) {
      var h = $('header', g), t = $('h4', h), sb = $('p', h), nn = $('.aqeq-name-number', h);
      if (!h || !t) return;
      var tt = t.textContent, key = /الروح|الرغبة/.test(tt) ? 'heart' : /الشخص|الصورة|المظهر|القناع/.test(tt) ? 'mask' : 'route';
      h.innerHTML = '<span class="lpc-ic lpn-gi c' + (gi % 4 + 1) + '">' + IC[key] + '</span><div class="lpn-gt"><h4>' + esc(tt) + '</h4><p>' + esc(sb ? sb.textContent : '') + '</p></div><span class="lpn-num"><small>الرقم</small><b>' + esc(nn ? nn.textContent : '') + '</b></span>';
      $$('.aqeq-reading-card', g).forEach(function (card, ci) {
        var hh = $('h5', card), body = $('.aqeq-reading-content', card);
        var d = document.createElement('details'); d.className = 'lpn-card';
        d.innerHTML = '<summary><span class="lpn-idx">' + (ci + 1) + '</span><b>' + esc(hh ? hh.textContent : '') + '</b><span class="lpn-chev">' + IC.chev + '</span></summary><div class="lpn-b"></div>';
        if (body) { tidyName(body); $('.lpn-b', d).appendChild(body); }
        card.replaceWith(d);
      });
    });
    return '<div class="lps-name">' + c.innerHTML + '</div>';
  }
  /* الأرقام المكملة: السنة الشخصية + يوم الميلاد + النضج + القمم والتحديات (كلها من تاريخ الميلاد) */
  function acc(idx, title, bodyEl) {
    var d = document.createElement('details'); d.className = 'lpn-card';
    d.innerHTML = '<summary><span class="lpn-idx">' + idx + '</span><b>' + esc(title) + '</b><span class="lpn-chev">' + IC.chev + '</span></summary><div class="lpn-b"></div>';
    tidyName(bodyEl); $('.lpn-b', d).appendChild(bodyEl); return d;
  }
  function extraHTML() {
    var n = $('.aqeq-name-readings', res), ex = n && $('.aqeq-extra-numbers', n);
    if (!ex) return '<div class="lps-noname"><p>الأرقام المكملة بتظهر بعد حساب تاريخ ميلادك.</p></div>';
    var out = document.createElement('div'); out.className = 'lps-name lps-extra';
    function group(ic, title, sub, num, items) {
      var g = document.createElement('section'); g.className = 'aqeq-name-group';
      g.innerHTML = '<header><span class="lpc-ic lpn-gi c' + ((out.children.length) % 4 + 1) + '">' + IC[ic] + '</span><div class="lpn-gt"><h4>' + esc(title) + '</h4><p>' + esc(sub) + '</p></div>' + (num ? '<span class="lpn-num"><small>الرقم</small><b>' + esc(num) + '</b></span>' : '') + '</header>';
      items.forEach(function (it, i) { g.appendChild(acc(i + 1, it[0], it[1])); });
      out.appendChild(g);
    }
    function secs(root, sel, ttlSel, bodySel) {
      return $$(sel, root).map(function (x) {
        var t = $(ttlSel, x), b = document.createElement('div');
        if (bodySel) { var src = $(bodySel, x); if (src) b.innerHTML = src.innerHTML; } else { $$('p', x).forEach(function (p) { b.appendChild(p.cloneNode(true)); }); }
        return [t ? t.textContent.trim() : '', b];
      });
    }
    var py = $('.aqeq-personal-year', ex);
    if (py) group('ask', 'السنة الشخصية', ($('h5', py) || {}).textContent || '', ($('.aqeq-extra-number', py) || {}).textContent, secs(py, '.aqeq-personal-year-section', 'h5', '.aqeq-extra-copy'));
    [['.aqeq-personal-month', 'الشهر الشخصي'], ['.aqeq-personal-day', 'اليوم الشخصي']].forEach(function (a) {
      var el = $(a[0], ex); if (!el) return;
      group('ask', a[1], ($('h5', el) || {}).textContent || ($('.aqeq-extra-eyebrow', el) || {}).textContent || '', ($('.aqeq-extra-number', el) || {}).textContent, secs(el, '.aqeq-personal-year-section', 'h5', '.aqeq-extra-copy'));
    });
    [['.aqeq-extra-birthday', 'person', 'رقم يوم الميلاد'], ['.aqeq-extra-maturity', 'scale', 'رقم النضج']].forEach(function (a) {
      var el = $(a[0], ex); if (!el) return;
      group(a[1], a[2], ($('h5', el) || {}).textContent || '', ($('.aqeq-extra-number', el) || {}).textContent, secs(el, '.aqeq-extra-deep-section', 'h5'));
    });
    var pc = $('.aqeq-pc-wrap', n);
    if (pc) $$('.aqeq-pc-card', pc).forEach(function (card) {
      var t = $('h4', card), sub = $('h5', card), num = $('.aqeq-extra-number,.aqeq-pc-num,.aqeq-pc-card-head span:last-child', card);
      var items = $$('section,.aqeq-pc-sec', card).filter(function (x) { return $('h5,h6', x) && $('p', x); }).map(function (x) { var b = document.createElement('div'); $$('p,ul', x).forEach(function (q) { b.appendChild(q.cloneNode(true)); }); return [($('h5,h6', x) || {}).textContent.trim(), b]; });
      if (!items.length) { var b = document.createElement('div'); $$('p,ul', card).forEach(function (q) { b.appendChild(q.cloneNode(true)); }); if (b.children.length) items = [[sub ? sub.textContent.trim() : (t ? t.textContent.trim() : ''), b]]; }
      if (items.length) group(/تحدي/.test(t ? t.textContent : '') ? 'cross' : 'peaks', t ? t.textContent.trim() : '', sub && items.length > 1 ? sub.textContent.trim() : '', '', items);
    });
    return out.outerHTML;
  }
  function stagesHTML() {
    var cards = pcCards(); if (!cards || !cards.p) return '<p class="lps-empty">تعذر تجهيز هذه القراءة حاليًا.</p>';
    var P = rowsOf(cards.p), cur = P.filter(function (r) { return r.st === 'current'; })[0] || P[0], h = '';
    P.forEach(function (r) {
      r.el.click();
      var st = $('#lpj-stage', res), ttl = st && $('h3', st), chips = st ? $$('.lpj-chip', st).map(function (c) { return c.textContent.trim(); }) : [], ana = '';
      var ob = st && $('[data-lpj-open]', st);
      if (ob) { ob.click(); var ov = document.querySelector('.lpj-ov'); if (ov) { var pn = $('.lpj-panel', ov); if (pn) { var cl = pn.cloneNode(true); $$('[data-lpj-close],.lpj-x', cl).forEach(function (n) { n.remove(); }); var h3 = $('h3', cl); if (h3) { var pp = h3.nextElementSibling; if (pp && pp.tagName === 'P') pp.remove(); h3.remove(); } ana = cl.innerHTML; } var xb = $('[data-lpj-close]', ov); if (xb) xb.click(); else ov.remove(); } }
      var name = ttl ? ttl.textContent.replace(/^\s*المرحلة\s*\d+\s*[—–-]\s*/, '').trim() : r.lbl;
      h += '<details class="lps-stage" data-st="' + r.st + '"' + (r === cur ? ' open' : '') + '><summary><span class="lps-n">' + (r.i + 1) + '</span><span class="lps-tx"><b>' + esc(name) + '</b><small>' + esc(chips.join(' · ')) + (r.st === 'current' ? ' · أنت هنا' : '') + '</small></span><span class="lpn-chev">' + IC.chev + '</span></summary><div class="lps-sbody lpj">' + (ana || '<p class="lps-empty">لا يوجد تحليل لهذه المرحلة.</p>') + '</div></details>';
    });
    if (cur) cur.el.click();
    return '<div class="lps-stages">' + h + '</div>';
  }
  function openTile(kind) {
    if (kind === 'extra') { openSheet('extra', IC.scale, 'الأرقام المكملة', 'من تاريخ ميلادك', extraHTML()); return; }
    if (kind === 'peaks') { openSheet('peaks', IC.peaks, 'القمم الأربع', 'قمة بعد قمة على عمرك', listHTML('peaks')); return; }
    if (kind === 'chal') { openSheet('chal', IC.chal, 'التحديات الأربعة', 'درس بعد درس على عمرك', listHTML('chal')); return; }
    if (kind === 'name') { openSheet('name', IC.name, 'بصمة الاسم', 'ثلاث زوايا من أرقام اسمك', nameHTML()); return; }
    openSheet('stages', IC.stages, 'مراحل العمر الأربع', 'القمة والتحدي داخل كل مرحلة', stagesHTML());
  }

  /* ---------- البلاطات ---------- */
  function buildTiles() {
    var d = document.createElement('section'); d.className = 'lpt-tiles'; d.setAttribute('aria-label', 'تفاصيل رحلتك');
    var T = [['stages', 'مراحل العمر', 'اكتشف مراحلك', IC.stages], ['peaks', 'القمم', 'اصعد قممك', IC.peaks], ['chal', 'التحديات', 'واجه دروسك', IC.chal], ['name', 'بصمة الاسم', 'اقرأ اسمك', IC.name], ['extra', 'الأرقام المكملة', 'دورتك الشخصية', IC.scale]];
    d.innerHTML = '<h3 class="lpt-h">رحلتك بين يديك</h3><p class="lpt-sub">اضغط على أي دائرة لتفتح تفاصيلها</p><div class="lpt-row">' +
      T.map(function (t, k) { return '<button type="button" class="lpt-tile" data-lpt="' + t[0] + '"><span class="lpt-c c' + (k + 1) + '">' + t[3] + '</span><span class="lpt-t">' + t[1] + '</span><span class="lpt-s">' + t[2] + '</span></button>'; }).join('') + '</div>';
    d.addEventListener('click', function (e) { var b = e.target.closest('[data-lpt]'); if (b) openTile(b.getAttribute('data-lpt')); });
    return d;
  }

  /* ---------- توحيد الأكورديونات ---------- */
  function fixAccordions() {
    $$('.lpa-ic', res).forEach(function (ic) {
      if (ic.getAttribute('data-lpf')) return;
      var tx = ic.textContent.trim(), card = ic.closest('details');
      if (tx === '+' || (card && card.classList.contains('is-light'))) ic.innerHTML = IC.light;
      else if (tx === '−' || tx === '-' || (card && card.classList.contains('is-shadow'))) ic.innerHTML = IC.shadow;
      else if (!ic.querySelector('svg')) ic.innerHTML = IC.star;
      ic.setAttribute('data-lpf', '1');
    });
    $$('.lp-sec-title b', res).forEach(function (b) {
      if (b.querySelector('.lps-en')) return;
      for (var n = b.firstChild; n; n = n.nextSibling) {
        if (n.nodeType === 3) {
          var m = n.nodeValue.match(/^([\s\S]*?)\s*\(([A-Za-z][^)]*)\)\s*$/);
          if (m) { var en = document.createElement('span'); en.className = 'lps-en'; en.textContent = m[2]; n.nodeValue = m[1]; b.insertBefore(en, n.nextSibling); break; }
        }
      }
    });
  }


  /* ---------- قائمة الصفوف الذهبية الموحّدة ---------- */
  var SKIP_BP = /الجوهر والرسالة|فخ الظل/;
  function gTitle(d) { var t = $('.lpc-tx b', $('summary', d)) || $('b', $('summary', d)); var sm = $('summary', d); var tx = t ? t.textContent : (sm ? sm.textContent : ''); return tx.replace(/\s+/g, ' ').replace(/\s*متاح (مجاناً|مجانًا|بالكامل|للأعضاء).*$/, '').replace(/^[+−-]\s*/, '').trim(); }
  function gSub(d) { var a = $$('.lpc-tx small', d).map(function (x) { return x.textContent.replace(/\s+/g, ' ').trim(); }).filter(function (x) { return x && !/^متاح/.test(x); }); return a[0] || ''; }
  var HOOK = [
    [/مراحل العمر/, 'السنين اللي فاتت مش صدفة.. دي مراحل ليها سبب'],
    [/^القمم/, 'الأوقات اللي بتلمع فيها حياتك بتتحدد من هنا'],
    [/^التحديات/, 'الدروس اللي بتتكرر معاك لحد ما تفهمها'],
    [/بصمة الاسم/, 'اسمك بيقول عنك أكتر مما تتخيل'],
    [/شفرة الروح/, 'اللي جواك قبل ما الدنيا تشكلك'],
    [/المراية المزدوجة/, 'اللي بتحبه وبتكرهه في الناس.. هو أنت'],
    [/البلوكات/, 'ليه بتقف عند نفس النقطة كل مرة'],
    [/الشفرة العاطفية/, 'ليه بتحب بالطريقة دي وبتتوجع بنفس الشكل'],
    [/مغناطيس المال/, 'الباب اللي الرزق بيجيلك منه'],
    [/روشتة/, 'خطوات صغيرة تفرق من أول أسبوع'],
    [/جرح الطفولة/, 'الحاجة اللي لسه شايلها من زمان وفاكر إنك نسيتها'],
    [/طاقة النور/, 'قوتك اللي الناس شايفاها فيك وأنت لسه مش واخد بالك'],
    [/البصمة الجسدية/, 'الطاقة اللي جسمك بيشيلها من غير ما تحس'],
    [/جدول المقارنة/, 'أنت في أحسن حالاتك وأنت في أصعبها.. جنب بعض'],
    [/خريطة التحول/, 'من التحدي للحل.. خطوة خطوة'],
    [/سؤال للتأمل/, 'سؤال هيفضل معاك بعد ما تقفل الصفحة']
  ];
  function hookOf(t, fb) { for (var i = 0; i < HOOK.length; i++) if (HOOK[i][0].test(t)) return HOOK[i][1]; return fb || ''; }
  function gRow(k, ico, title, sub, grp, tone) {
    sub = hookOf(title, sub);
    return '<button type="button" class="lpg-row' + (tone ? ' b3-ai-' + tone : '') + '" data-lpg="' + k + '" style="--i:' + grp + '"><span class="lpg-ic">' + ico + '</span><span class="lpg-tx"><b>' + esc(title) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + (tone ? '<i class="lpg-chip lpg-chip-' + tone + '">' + (tone === 'g' ? 'نقطة قوة' : 'منطقة ظل') + '</i>' : '') + '</span><span class="lpg-go">' + IC.chev + '</span></button>';
  }
  function buildGold() {
    var items = [], html = '', n = 0;
    gOrder = []; gItems = items; gTitles = {};
    function push(k, ico, t, sub, fn, tone) { items[k] = fn; gOrder.push(k); gTitles[k] = t; html += gRow(k, ico, t, sub, n++, tone); }
    var dets = $$('.panel .lp-sections > details', res).concat($$('.aq-lp-blueprint-summary details', res).filter(function (x) { return !SKIP_BP.test(x.textContent.slice(0, 80)); }));
    var made = dets.map(function (x, i) {
      var t = gTitle(x), sub = gSub(x), k = 'd:' + i, ic = icFor(t, x.classList.contains('is-shadow') ? IC.shadow : x.classList.contains('is-light') ? IC.light : IC.star);
      if (t.length > 70) { t = t.slice(0, 70); }
      var tone = x.classList.contains('is-shadow') ? 's' : x.classList.contains('is-light') ? 'g' : '';
      return { t: t, k: k, ic: ic, sub: sub, tone: tone, fn: function () {
        var bd = $('.lp-sec-body, .lpa-body', x); if (!bd) return;
        openSheet(k, ic, t, sub, '<div class="lps-detail lps-read">' + bd.innerHTML + '</div>');
      } };
    });
    function pushMade(m) { push(m.k, m.ic, m.t, m.sub, m.fn, m.tone); }
    var used = {};
    function take(re) { var out = []; made.forEach(function (m, i) { if (!used[i] && re.test(m.t)) { used[i] = 1; out.push(m); } }); return out; }
    var g1 = take(/شفرة الروح/), g1b = take(/طاقة النور/);
    var g2 = take(/المراية|البلوكات|الشفرة العاطفية|مغناطيس|البصمة الجسدية|جدول المقارنة|جرح الطفولة/);
    var g3 = take(/روشتة|خريطة التحول/);
    var rest = made.filter(function (m, i) { return !used[i]; });
    html += '<p class="lpg-hint"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v4h1"/></svg><span>اضغط على أي قسم لعرض تفسيره</span></p>';
    html += '<h4 class="lpg-h">أساس شخصيتك<small>من أنت؟</small></h4>';
    g1.forEach(pushMade);
    push('t:name', IC.name, 'بصمة الاسم', 'اقرأ اسمك', function () { openTile('name'); });
    push('t:extra', IC.scale, 'الأرقام المكملة', 'السنة والشهر واليوم الشخصي، يوم الميلاد، النضج', function () { openTile('extra'); });
    g1b.forEach(pushMade);
    html += '<h4 class="lpg-h">الظل والعلاقات والمال<small>كيف تعيش؟</small></h4>';
    g2.concat(rest).forEach(pushMade);
    html += '<h4 class="lpg-h">رحلتك عبر السنين<small>التوقيت الزمني</small></h4>';
    push('t:stages', IC.stages, 'مراحل العمر الأربع', 'القمة والتحدي لكل مرحلة جواها', function () { openTile('stages'); });
    push('t:peaks', IC.peaks, 'القمم الأربع', 'P1 إلى P4 على عمرك', function () { openTile('peaks'); });
    push('t:chal', IC.chal, 'التحديات الأربعة', 'C1 إلى C4 على عمرك', function () { openTile('chal'); });
    g3.forEach(pushMade);
    var q = $('.lpj-bottom .lpj-reflect', res);
    if (q) push('q', IC.ask, 'سؤال للتأمل', 'سؤال يناسب مرحلتك الحالية', function () { openSheet('q', IC.ask, 'سؤال للتأمل', '', '<div class="lps-daily">' + q.innerHTML + '</div>'); });
    var box = document.createElement('section'); box.className = 'lpg'; box.setAttribute('aria-label', 'قراءة مسارك');
    box.innerHTML = html;
    var _n = 0, _l = null; Array.prototype.forEach.call(box.children, function (c) { if (c.classList.contains('lpg-h')) { if (_n % 2 && _l) _l.classList.add('lpg-wide'); _n = 0; _l = null; } else { _n++; _l = c; } }); if (_n % 2 && _l) _l.classList.add('lpg-wide');
    box.addEventListener('click', function (e) { var b = e.target.closest('[data-lpg]'); if (b && items[b.getAttribute('data-lpg')]) items[b.getAttribute('data-lpg')](); });
    return box;
  }

  /* ---------- رأس النتيجة بنفس مظهر خرائط الشريكين والطفل ---------- */
  var HIC = {
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    save: '<path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z"/>',
    add: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'
  };
  function hIc(k) { return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + HIC[k] + '</svg>'; }
  function setField(id, v) { var e = document.getElementById(id); if (!e) return; e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); }
  /* نبذة عنك: أرقام فقط (قراءة من المحرك الحالي، بدون نصوص تفسير) */
  function openAbout() {
    var num = (($('.numbadge', res) || {}).textContent || '').trim();
    var date = (($('#lp-date') || {}).value || '').split('-').reverse().join('/');
    var nmv = (($('#lp-name') || {}).value || '').trim();
    var kw = ($('.lph-m span:last-child', res) || {}).textContent || '';
    function tiles(rows, pre) { return '<div class="lpa-grid">' + rows.map(function (r) { return '<div class="lpa-t"><b>' + esc(r.v) + '</b><span>' + esc(r.lbl) + '</span><small>' + esc(r.per) + '</small></div>'; }).join('') + '</div>'; }
    var h = '<div class="lpa-wrap"><div class="lpa-hero"><span class="lpa-big">' + esc(num) + '</span><span class="lpa-cap"><small>رقم مسار حياتك</small>' + (kw && kw !== date ? '<b>' + esc(kw) + '</b>' : '') + '</span></div>' +
      '<div class="lpa-meta">' + (nmv ? '<span>' + esc(nmv) + '</span>' : '') + (date ? '<span>' + esc(date) + '</span>' : '') + '</div>';
    var pc = pcCards();
    if (pc && pc.p) h += '<section class="lpa-sec"><h4>القمم الأربع</h4>' + tiles(rowsOf(pc.p)) + '</section>';
    if (pc && pc.c) h += '<section class="lpa-sec"><h4>التحديات الأربعة</h4>' + tiles(rowsOf(pc.c)) + '</section>';
    var ng = $$('.aqeq-name-group', res).map(function (g) { var t = $('h4', g), n = $('.aqeq-name-number', g); return t && n ? { v: n.textContent.trim(), lbl: t.textContent.trim(), per: '' } : null; }).filter(Boolean);
    if (ng.length) h += '<section class="lpa-sec"><h4>بصمة الاسم</h4>' + tiles(ng) + '</section>';
    var cur = $('#lpj-stage', res), cs = cur ? $$('.lpj-chip', cur).map(function (x) { return x.textContent.trim(); }) : [];
    h += '</div>';
    openSheet('about', IC.about, 'نبذة عنك', 'أرقامك في مكان واحد', h);
  }
  function headFix() {
    var c = $('.chart-summary-card', res); if (!c || c.classList.contains('lpr-head')) return;
    var ed = $('#btn-edit-lp', c), badge = ($('.chart-summary-badge', c) || {}).textContent || '', title = ($('.chart-summary-title', c) || {}).textContent || '';
    var meta = $$('.chart-summary-meta > span:not(.meta-sep)', c).map(function (m) { return m.textContent.replace(/[☉✧]/g, '').replace(/\s+/g, ' ').trim(); }).filter(Boolean);
    var num = (($('.numbadge', res) || {}).textContent || '').trim(), nm = (title.match(/^\s*مسار\s+(.*?)\s*:/) || [])[1] || '';
    if (nm && /^(مسارك|حياتك)$/.test(nm)) nm = '';
    c.innerHTML = '<button type="button" class="lph-about" data-lph="about" aria-label="نبذة عنك">' + IC.about + '<span>نبذة عنك</span></button>' +
      '<span class="lph-k">مسار الحياة</span>' +
      '<div class="lph-id"><span class="lph-n">' + esc(num) + '</span><span class="lph-cap"><small>رقم مسار حياتك</small>' + (nm ? '<b>' + esc(nm) + '</b>' : '') + '</span></div>' +
      '<div class="lph-m">' + meta.map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('') + '</div>' +
      '<div class="lph-tools"><button type="button" data-lph="edit" aria-label="تعديل البيانات">' + hIc('edit') + '<span>تعديل</span></button>' +
      '<button type="button" data-lph="save" aria-label="حفظ الخريطة">' + hIc('save') + '<span>حفظ</span></button>' +
      '<button type="button" data-lph="new" aria-label="مسار جديد">' + hIc('add') + '<span>مسار جديد</span></button></div>';
    if (ed) { ed.hidden = true; ed.style.display = 'none'; c.appendChild(ed); }
    c.classList.add('lpr-head');
    c.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lph]'); if (!b) return;
      var a = b.getAttribute('data-lph'), eb = $('#btn-edit-lp', c);
      if (a === 'about') openAbout();
      else if (a === 'edit' && eb) eb.click();
      else if (a === 'new' && eb) { eb.click(); setTimeout(function () { setField('lp-name', ''); setField('lp-date', ''); }, 60); }
      else if (a === 'save') { var sb = $('.aq-save-reading-btn', res); if (sb) { sb.click(); b.classList.add('is-saved'); $('span', b).textContent = 'تم الحفظ'; } }
    });
  }

  /* ---------- التشغيل ---------- */
  function run() {
    var has = !res.hidden && res.querySelector('.numbadge') && res.querySelector('.lp-sections');
    root.classList.toggle('lpr-on', !!has);
    if (!has) { lastKey = ''; return; }
    var num = $('.numbadge', res), key = (num ? num.textContent : '') + '|' + (($('#lp-date') || {}).value || '') + '|' + (($('#lp-name') || {}).value || '');
    if (!res.querySelector('.lpt-tiles')) {
      var sm = $('.chart-summary-card', res);
      var t = buildTiles();
      if (sm && sm.nextSibling) res.insertBefore(t, sm.nextSibling); else res.insertBefore(t, res.firstChild);
    }
    var sig = $$('.panel .lp-sections > details, .aq-lp-blueprint-summary details', res).length + '|' + (res.querySelector('.lpj-reflect') ? 1 : 0) + '|' + (res.querySelector('.daily') ? 1 : 0), cg = res.querySelector('.lpg');
    if (cg && cg.getAttribute('data-sig') !== sig) { cg.remove(); cg = null; }
    if (!cg && res.querySelector('.panel .lp-sections > details')) {
      var sm2 = $('.chart-summary-card', res), g = buildGold(); g.setAttribute('data-k', key); g.setAttribute('data-sig', sig);
      if (sm2 && sm2.nextSibling) res.insertBefore(g, sm2.nextSibling); else res.insertBefore(g, res.firstChild);
    }
    fixAccordions(); headFix();
    if (key !== lastKey) { lastKey = key; sec.scrollTop = 0; closeSheet(); var og = res.querySelector('.lpg'); if (og && og.getAttribute('data-k') !== key) { og.remove(); run(); } }
  }
  var q;
  new MutationObserver(function () { clearTimeout(q); q = setTimeout(run, 60); }).observe(res, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  run();
})();

;
/* assets/js/chart-sheet.js */
/* الخريطة الفلكية — نتيجة الهاتف: عنوان الجاهزية، صفوف قابلة للضغط، نافذة سفلية للتفسير. عرض فقط. */
(function () {
  'use strict';
  var res = document.getElementById('result'), sec = document.getElementById('chart');
  if (!res || !sec) return;
  var root = document.documentElement, sheet = null, lastKey = '';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var PL = {
    'الشمس': 'جوهر الهوية والإرادة الواعية؛ ما تسعى إلى أن تكونه وتُعرَف به.',
    'القمر': 'عالمك العاطفي وحاجتك إلى الأمان؛ طريقتك في الشعور والاستجابة.',
    'عطارد': 'العقل واللغة؛ كيف تفكر وتتعلم وتنقل أفكارك إلى الآخرين.',
    'الزهرة': 'القيمة والحب والجمال؛ ما تنجذب إليه وكيف تحب وتُقدّر.',
    'المريخ': 'الدافع والطاقة والمبادرة؛ كيف تسعى إلى ما تريد وتدافع عن نفسك.',
    'المشتري': 'التوسع والمعنى والحظ الواعي؛ أين تنمو وتتفاءل وتبحث عن الحكمة.',
    'زحل': 'البنية والمسؤولية والحدود؛ الدروس التي تنضج بالصبر والانضباط.',
    'أورانوس': 'التجديد والاستقلال والتغيير المفاجئ؛ ما يدفعك إلى كسر المألوف.',
    'نبتون': 'الخيال والحدس والروحانية؛ ما يذيب الحدود ويحتاج إلى وضوح.',
    'بلوتو': 'التحول العميق والقوة الخفية؛ ما يُهدم ليُبنى من جديد.'
  };
  var AS = {
    'اتصال': ['دمج الطاقتين', 'تمتزج الطاقتان في نقطة واحدة فتتضاعف قوتهما، وقد تحتاج إلى وعي بحدّتهما معًا.'],
    'تثليث': ['اتصال متناغم', 'تتدفق الطاقتان بانسجام وسهولة، وتعطيان موهبة فطرية تحتاج إلى استخدام واعٍ.'],
    'سداسي': ['اتصال داعم', 'فرصة مفتوحة بين الطاقتين، تثمر حين تبادر إلى استثمارها.'],
    'تسديس': ['اتصال داعم', 'فرصة مفتوحة بين الطاقتين، تثمر حين تبادر إلى استثمارها.'],
    'تربيع': ['اتصال ضاغط', 'توتر محرّك بين الطاقتين يدفعك إلى الفعل والتطور عبر الاحتكاك الداخلي.'],
    'مقابلة': ['اتصال مواجهة', 'قطبان يطلبان التوازن؛ تتعلم عبرهما أن تجمع بين الجانبين بدل الاختيار بينهما.']
  };
  function sv(d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  var ICO = { planet: sv('<circle cx="12" cy="12" r="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-25 12 12)"/>'), asp: sv('<path d="M3 17l5-9 4 6 4-9 5 12"/>'), house: sv('<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>') };

  function ensureSheet() {
    if (sheet) return sheet;
    sheet = document.createElement('div'); sheet.className = 'aqm-sheet ndr-sheet'; sheet.hidden = true;
    sheet.innerHTML = '<div class="aqm-sheet-scrim" data-ndc></div><div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="ndr-t"><span class="aqm-sheet-grip"></span>' +
      '<button type="button" class="aqm-sheet-x" data-ndc aria-label="إغلاق"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="aqm-sheet-head"><span class="aqm-sheet-ic"></span><div><h3 id="ndr-t"></h3><p class="aqm-sheet-sub"></p></div></div><div class="aqm-sheet-body"></div>' +
      '<div class="aqm-sheet-foot"><button type="button" class="aqm-foot-close" data-ndc>إغلاق</button></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) { if (e.target.closest('[data-ndc]')) closeSheet(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet && !sheet.hidden) closeSheet(); });
    return sheet;
  }
  function closeSheet() { if (!sheet || sheet.hidden) return; sheet.classList.add('is-closing'); var s = sheet; setTimeout(function () { s.hidden = true; s.classList.remove('is-closing'); root.classList.remove('aqm-sheet-open'); }, 230); }
  function openSheet(ico, title, sub, html) {
    var s = ensureSheet();
    $('.aqm-sheet-ic', s).innerHTML = ico; $('#ndr-t', s).textContent = title; $('.aqm-sheet-sub', s).textContent = sub || '';
    var b = $('.aqm-sheet-body', s); b.innerHTML = html; b.scrollTop = 0;
    s.classList.remove('is-closing'); s.hidden = false; root.classList.add('aqm-sheet-open');
  }
  function fact(k, v) { return '<div class="ndr-fact"><small>' + esc(k) + '</small><b>' + v + '</b></div>'; }
  function pending(t) { return '<p class="ndr-soon">' + esc(t) + '</p>'; }

  function rowClick(row) {
    var panel = row.closest('[data-nd-panel]'), kind = panel ? panel.getAttribute('data-nd-panel') : '';
    var name = ($('b', row) || {}).textContent || '', mid = row.children[2] ? row.children[2].textContent.trim() : '', last = ($('.nd-rh', row) || {}).textContent || '';
    var g = $('.nd-rg', row);
    var t = row.querySelector('template.il-content'), extra = t ? t.innerHTML : '';
    if (row.classList.contains('il-row')) { openSheet(g ? g.innerHTML : ICO.planet, name, [mid, last].filter(Boolean).join(' · '), extra); return; }
    if (kind === 'aspects') {
      var a = AS[mid] || ['اتصال', 'علاقة زاوية بين الطاقتين.'];
      openSheet(g ? g.innerHTML : ICO.asp, name, mid + ' · ' + last,
        '<div class="ndr-facts">' + fact('نوع الاتصال', esc(mid)) + fact('الفارق', esc(last.replace('فارق', '').trim())) + '</div><h4>' + esc(a[0]) + '</h4><p>' + esc(a[1]) + '</p>' + (extra || pending('التفسير المفصل لاتصالك هذا قيد الإضافة.')));
    } else if (kind === 'houses') {
      openSheet(ICO.house, name, mid, '<div class="ndr-facts">' + fact('البيت', esc(name)) + fact('البرج', esc(mid)) + '</div>' + (extra || pending('تفسير هذا البيت قيد الإضافة.')));
    } else {
      var house = last && last !== '—' ? last : 'يظهر مع وقت الميلاد';
      openSheet(g ? '<span class="ndr-gl">' + g.innerHTML + '</span>' : ICO.planet, name, mid,
        '<div class="ndr-facts">' + fact('البرج والدرجة', esc(mid)) + fact('البيت', esc(house)) + '</div><h4>معنى ' + esc(name) + ' في خريطتك</h4><p>' + esc(PL[name] || 'أحد الأجرام الأساسية في خريطتك.') + '</p>' + pending('التفسير المفصل لموضع ' + name + ' هذا قيد الإضافة.'));
    }
  }
  document.addEventListener('click', function (e) {
    var row = e.target.closest && e.target.closest('#result .nd-list .nd-row'); if (!row) return;
    if (!row.querySelector('template.il-content') && !window.matchMedia('(max-width:820px)').matches) return;
    rowClick(row);
  });

  function prep() {
    var r = $('.nd-root', res);
    var on = !!r && !res.hidden;
    root.classList.toggle('ndr-on', on);
    if (!on) { lastKey = ''; return; }
    var h = $('.nd-title h3', r);
    if (h && !h.getAttribute('data-ndr')) { h.setAttribute('data-ndr', '1'); h.textContent = 'خريطتك الفلكية جاهزة'; }
    var p = $('.nd-title p', r); if (p && !p.getAttribute('data-ndr')) { p.setAttribute('data-ndr', '1'); p.textContent = 'اضغط على أي كوكب أو جانب لتعرف معناه'; }
    $$('.nd-list .nd-row', r).forEach(function (x) { if (!x.getAttribute('role')) { x.setAttribute('role', 'button'); x.setAttribute('tabindex', '0'); } });
    var key = ($('.nd-chips', r) || {}).textContent || '';
    if (key !== lastKey) { lastKey = key; sec.scrollTop = 0; closeSheet(); }
  }
  var q;
  new MutationObserver(function () { clearTimeout(q); q = setTimeout(prep, 60); }).observe(res, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  prep();
})();

;
/* assets/js/moon-sheet.js */
/* القمر — نافذة تفاعلية: قمر حقيقي يُسحب بين الأيام، هالة الاكتمال، الخسوف والكسوف، وبوصلة الأطوار الثمانية.
   كل الحسابات من مكتبة Astronomy Engine الموجودة (astronomy.min.js)، والرسم من AqeeqMoon. عرض فقط، لا حسابات جديدة. */
(function () {
  'use strict';
  var root = document.documentElement, sheet = null, off = 0, tab = 'moon', pick = null, base = Date.now();
  var AU = 149597870.7, SYN = 29.530588;
  var SIGNS = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  /* [الاسم، الوسم، المعنى، تناسبك، تجنّب، أسئلة تخصك، قراءة من الداخل، في الواقع] */
  var PH = [
    ['محاق', 'نيّة', 'السماء بلا ضوء، وهذا يشبه ما يحدث بداخلك: حاجة صامتة إلى الانسحاب وإعادة ترتيب الداخل قبل أن يطلب منك العالم شيئًا جديدًا. ما تبدأه الآن يحتاج إلى صدق أكثر مما يحتاج إلى ضجيج.', 'اكتب نية واحدة بسيطة لهذه الدورة.', 'أن تحكم على نفسك لأن الحماس بطيء.',
      ['هل تشعر برغبة في الاختفاء قليلًا دون أن تعرف كيف تشرحها؟', 'هل بدأت تفكر فيما تريده حقًا، لا فيما يُنتظر منك؟'],
      'عند يونغ، الظلام ليس غيابًا بل رحم: يعمل اللاوعي حين يهدأ الوعي، وما يتشكل الآن لا تراه بعد.',
      ['تلغي خططًا اجتماعية وتشعر بارتياح غريب.', 'تكتب أمنية في ملاحظات هاتفك ثم تمسحها.', 'تستيقظ بفكرة جديدة لا تعرف من أين جاءت.']],
    ['هلال متزايد', 'رعاية', 'بذرة النية تطلب انتباهًا لطيفًا. قد تشعر بتردد مألوف قبل أن يتحرك الأمر، وهذا التردد ليس علامة خطأ، بل علامة أن الأمر يهمك.', 'خطوة صغيرة كل يوم تخدم نيتك.', 'أن تقارن بدايتك بنهاية غيرك.',
      ['هل بدأت شيئًا مؤخرًا ثم شككت فيه بعد أيام؟', 'هل تؤجل خطوة لأنك تنتظر أن تشعر بالاستعداد الكامل؟'],
      'هذه لحظة الاستيقاظ الأول لما نواه الوعي. التردد هنا ليس ضعفًا، بل حارس يختبر جدية النية.',
      ['تبدأ عادة جديدة بحماس ثم يخف بعد ثلاثة أيام.', 'تحكي فكرتك لأحدهم فيقلل منها، فتصمت.', 'تعود إلى الفكرة نفسها ليلًا بصمت.']],
    ['التربيع الأول', 'فعل', 'يظهر أول اختبار لما بدأته. التوتر هنا محرّك للفعل وليس عقابًا، وهو يسألك: هل أنت جاد فيما اخترته؟', 'قرار مؤجل تحسمه اليوم.', 'أن تنسحب عند أول عقبة.',
      ['هل ظهرت عقبة بعد أن بدأت، فسألت نفسك إن كنت على الطريق الصحيح؟', 'هل تعرف القرار الذي تؤجله منذ أسابيع؟'],
      'التوتر الذي تشعر به صراع بين من كنته ومن تتحول إليه، وكل تحول يمر بنقطة احتكاك.',
      ['خلاف في العمل أو البيت يكشف أمرًا كنت تتجاهله.', 'تشعر بعصبية لا سبب ظاهرًا لها.', 'تجد نفسك مضطرًا إلى الاختيار.']],
    ['أحدب متزايد', 'صقل', 'الصورة تقترب من الاكتمال، وتلاحظ ما ينقصها بوضوح. هذا وقت التعديل لا وقت الهدم.', 'مراجعة التفاصيل وتعديلها بهدوء.', 'أن يعطّلك البحث عن الكمال.',
      ['هل تلاحظ تفصيلة صغيرة تزعجك في عملك أو علاقتك وتتجاهلها؟', 'هل تؤجل الإنجاز لأنه لم يصل بعد إلى ما تتخيله؟'],
      'الناقد الداخلي يستيقظ حين يقترب الشيء من الاكتمال، والكمال هنا كثيرًا ما يخفي خوفًا من أن يُرى عملك.',
      ['تعدّل رسالة خمس مرات قبل أن ترسلها.', 'تعيد ترتيب شيء أنجزته أصلًا.', 'تنتظر الوقت المثالي الذي لا يأتي.']],
    ['بدر', 'إدراك', 'المشاعر في ذروتها، وما كان خفيًا يصبح واضحًا. قد تشعر بحساسية أعلى ونوم أخف، وهذا طبيعي في هذه الأيام.', 'لاحظ ما اتضح لك دون أن تقرر فورًا.', 'القرارات الكبرى وقت الانفعال.',
      ['هل تشعر هذه الأيام أن كل شيء مكشوف، المشاعر والنيات وما لا يُقال؟', 'هل لاحظت أن نومك أخف أو أن انفعالك أسرع من المعتاد؟'],
      'حين يكتمل الضوء يظهر الظل أيضًا. وما يزعجك في الآخرين الآن كثيرًا ما يكون مرآة لما لم تعترف به في نفسك.',
      ['تبكي أو تغضب من أمر صغير.', 'يظهر أمامك شيء كنت تتغافل عنه.', 'يتصل بك شخص من الماضي دون مقدمات.']],
    ['أحدب متناقص', 'دمج', 'وقت لفهم ما حدث وتحويله إلى خبرة تحملها معك. ما مررت به في الأسابيع الماضية بدأ يأخذ معناه.', 'اكتب ما تعلمته وشاركه مع من يهمك.', 'التمسك بما انتهى دوره.',
      ['هل تحتاج أن تحكي ما مررت به كي تفهمه؟', 'هل لديك درس تعلمته بصعوبة ولم تشاركه مع أحد؟'],
      'هذه مرحلة الدمج: يتحول الألم إلى معنى حين نرويه لأنفسنا بصدق.',
      ['تشعر برغبة في النصح أو الحكي.', 'تسترجع موقفًا قديمًا وتفهمه بشكل مختلف.', 'تجلس مع صديق وتقول: الآن فهمت.']],
    ['التربيع الأخير', 'مراجعة', 'تتصادم عاداتك القديمة مع ما صرت تريده الآن، وهذا الصدام يدعوك إلى الاختيار.', 'قرر ما تتركه وما تبقيه.', 'العودة إلى جدال قديم لا جديد فيه.',
      ['هل هناك عادة أو علاقة تعرف في داخلك أنها استنفدت دورها وما زلت تتمسك بها؟', 'هل تجادل نفسك في قرار حسمه قلبك منذ مدة؟'],
      'الصراع بين القديم والجديد هنا صراع بين هويتين. والتخلي لا يعني الخسارة، بل التخفف مما لم يعد يشبهك.',
      ['تشعر بالضيق من التزام كنت تتحمس له.', 'تفتح محادثة قديمة ثم تغلقها.', 'تقرر أخيرًا أن تقول لا.']],
    ['هلال متناقص', 'تسليم', 'الطاقة تهدأ وتحتاج إلى راحة وتصفية. ليس هذا وقت البدء بل وقت الإغلاق الهادئ.', 'رتّب مساحتك، وارتح، وودّع ما انتهى.', 'فتح التزامات ثقيلة جديدة.',
      ['هل تشعر بتعب هادئ لا يشبه الإرهاق؟', 'هل تحتاج إلى إغلاق باب دون أن يطلب منك أحد تفسيرًا؟'],
      'الاستسلام هنا ليس انهزامًا بل ثقة: يسمح الوعي للاوعي أن يعيد التكوين استعدادًا لدورة جديدة.',
      ['تميل إلى النوم المبكر وتقل رغبتك في الخروج.', 'ترتب غرفتك أو هاتفك دون سبب.', 'تودع شخصًا أو فكرة بصمت.']]
  ];
  window.AqMoonPhase = function (ms) { try { var c = calc(ms); return { p: PH[c.ph], il: Math.round(c.il * 100) }; } catch (e) { return null; } };
  var MI = {"ed": "<path d=\"M19 14.5A8 8 0 1 1 9.5 5 6.5 6.5 0 0 0 19 14.5z\"/>", "q": "<path d=\"M9.5 9a2.5 2.5 0 1 1 3.5 2.300c-.7.400-1 .900-1 1.700\"/><circle cx=\"12\" cy=\"17\" r=\".6\"/><circle cx=\"12\" cy=\"12\" r=\"9\"/>", "rd": "<path d=\"M2 12s3.500-6.500 10-6.500S22 12 22 12s-3.500 6.500-10 6.500S2 12 2 12z\"/><circle cx=\"12\" cy=\"12\" r=\"2.800\"/>", "real": "<path d=\"M8 6h12M8 12h12M8 18h12\"/><circle cx=\"4\" cy=\"6\" r=\"1\"/><circle cx=\"4\" cy=\"12\" r=\"1\"/><circle cx=\"4\" cy=\"18\" r=\"1\"/>", "yes": "<path d=\"M5 12.500 10 17.500 19 7\"/>", "no": "<circle cx=\"12\" cy=\"12\" r=\"8.500\"/><path d=\"M6 6l12 12\"/>", "il": "<circle cx=\"12\" cy=\"12\" r=\"8.500\"/><path d=\"M12 3.500a8.500 8.500 0 0 1 0 17z\" fill=\"currentColor\"/>", "age": "<circle cx=\"12\" cy=\"12\" r=\"8.500\"/><path d=\"M12 7v5l3 2\"/>", "sign": "<circle cx=\"12\" cy=\"12\" r=\"8.500\"/><path d=\"M7.500 5.500c1 4 1 9 0 13M16.500 5.500c-1 4-1 9 0 13M4 10h16M4 14h16\"/>", "dist": "<circle cx=\"5\" cy=\"12\" r=\"2\"/><circle cx=\"19\" cy=\"12\" r=\"2\"/><path d=\"M8 12h8M10.500 9.500 8 12l2.500 2.500M13.500 9.500 16 12l-2.500 2.500\"/>"};
  function mi(k) { return '<span class="mn-bd" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + MI[k] + '</svg></span>'; }
  /* كل قسم له تخطيط وشارة أيقونة خاصة: مقال تحريري، بطاقة أسئلة عنابية، قراءة من الداخل، قائمة واقع، وبطاقة فعل بلونين */
  function phBody(p, hd) {
    hd = hd || {};
    return '<section class="mn-ed"><header class="mn-sh">' + mi('ed') + '<div><small>' + (hd.label || 'ماذا يعني هذا الطور لك') + '</small>' + (hd.title ? '<h4>' + hd.title + '</h4>' : '') + '</div><i class="mn-tag">' + p[1] + '</i></header><p class="mn-lead">' + p[2] + '</p></section>' +
      '<section class="mn-q"><ul><li>' + p[5][0] + '</li><li>' + p[5][1] + '</li></ul></section>' +
      '<section class="mn-rd mn-rd-in"><header class="mn-sh">' + mi('rd') + '<b>قراءة من الداخل</b></header><p>' + p[6] + '</p></section>' +
      '<section class="mn-rd mn-rd-real"><header class="mn-sh">' + mi('real') + '<b>قد تجد نفسك</b></header><ul><li>' + p[7].join('</li><li>') + '</li></ul></section>' +
      '<section class="mn-act"><div class="mn-act-y"><header class="mn-sh">' + mi('yes') + '<b>تناسبك</b></header><p>' + p[3] + '</p></div><div class="mn-act-n"><header class="mn-sh">' + mi('no') + '<b>تجنّب</b></header><p>' + p[4] + '</p></div></section>';
  }
  function tel(k, label, val) { return '<div class="mn-tc">' + mi(k) + '<span><small>' + label + '</small><b>' + val + '</b></span></div>'; }
  var STARTS = [348.75, 11.25, 78.75, 101.25, 168.75, 191.25, 258.75, 281.25];
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function mod(x) { return ((x % 360) + 360) % 360; }
  function A() { return typeof Astronomy !== 'undefined' ? Astronomy : window.Astronomy; }
  function phIdx(el) { return (el >= 348.75 || el < 11.25) ? 0 : el < 78.75 ? 1 : el < 101.25 ? 2 : el < 168.75 ? 3 : el < 191.25 ? 4 : el < 258.75 ? 5 : el < 281.25 ? 6 : 7; }
  function fmtD(d) { try { return d.toLocaleDateString('ar-EG-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long' }); } catch (e) { return d.toDateString(); } }
  function fmtS(d) { try { return d.toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric', month: 'long' }); } catch (e) { return d.toDateString(); } }
  function num(n) { try { return Math.round(n).toLocaleString('ar-EG-u-nu-latn'); } catch (e) { return String(Math.round(n)); } }
  function kindAr(k) { k = String(k).toLowerCase(); return /total/.test(k) ? 'كلي' : /annular/.test(k) ? 'حلقي' : /hybrid/.test(k) ? 'هجين' : /partial/.test(k) ? 'جزئي' : /penumbral/.test(k) ? 'شبه ظلي' : ''; }

  function calc(ms) {
    var Z = A(), d = new Date(ms), el = Z.MoonPhase(d), il = Z.Illumination('Moon', d).phase_fraction;
    var dist = Z.GeoMoon(d).Length() * AU, lon = Z.EclipticGeoMoon(d).lon, o = { ms: ms, d: d, el: el, il: il, age: el / 360 * SYN, dist: dist, sign: SIGNS[Math.floor(mod(lon) / 30)], deg: Math.floor(mod(lon) % 30), ph: phIdx(el) };
    var W = 18 * 36e5;
    try { var le = Z.SearchLunarEclipse(new Date(ms - 2 * 864e5)); o.nextL = le; if (le && Math.abs(le.peak.date - ms) < W) o.lunar = le; else o.nextL = Z.SearchLunarEclipse(d); } catch (e) {}
    try { var se = Z.SearchGlobalSolarEclipse(new Date(ms - 2 * 864e5)); o.nextS = se; if (se && Math.abs(se.peak.date - ms) < W) o.solar = se; else o.nextS = Z.SearchGlobalSolarEclipse(d); } catch (e) {}
    try { o.newM = Z.SearchMoonPhase(0, d, 40).date; o.fullM = Z.SearchMoonPhase(180, d, 40).date; } catch (e) {}
    o.full = il >= 0.985; o.supr = o.full && dist < 361500; o.peri = dist < 362000;
    return o;
  }
  /* قمر واقعي: خامة بحار وفوهات مولَّدة مرة واحدة، ثم إضاءة الطور بحساب لامبرت من زاوية الاستطالة الفعلية. */
  var TEX = null, HGT = null, TN = 360;
  function rng(s) { return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function buildTex() {
    var N = TN, R = N / 2, r = rng(20261110), v = new Float32Array(N * N), hg = new Float32Array(N * N), i, x, y;
    var hv = function (a, b) { var h = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return h - Math.floor(h); };
    var vn = function (px, py) { var ix = Math.floor(px), iy = Math.floor(py), fx = px - ix, fy = py - iy; fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); return (hv(ix, iy) * (1 - fx) + hv(ix + 1, iy) * fx) * (1 - fy) + (hv(ix, iy + 1) * (1 - fx) + hv(ix + 1, iy + 1) * fx) * fy; };
    var MARIA = [[-.27, -.38, .3, .22], [.1, -.36, .17, .14], [.26, -.1, .21, .17], [.66, -.3, .11, .08], [.55, .16, .15, .12], [-.62, -.08, .3, .4], [-.2, .45, .21, .13], [-.5, .52, .11, .1], [-.05, -.76, .36, .06], [0, -.12, .1, .08], [.43, -.45, .1, .07]];
    for (y = 0; y < N; y++) for (x = 0; x < N; x++) {
      var nx = (x - R) / R, ny = (y - R) / R, m = 0;
      MARIA.forEach(function (a) { var dx = (nx - a[0]) / a[2], dy = (ny - a[1]) / a[3], d = Math.sqrt(dx * dx + dy * dy), warp = vn(x / 30, y / 30) * .18; m = Math.max(m, Math.max(0, Math.min(1, (1 - d + warp - .1) * 2.2))); });
      var g = vn(x / 40, y / 40) * .5 + vn(x / 14, y / 14) * .3 + vn(x / 5, y / 5) * .2;
      v[y * N + x] = .8 - m * .36 + (g - .5) * .16;
    }
    function crater(cx, cy, rad, str) {
      var x0 = Math.max(0, Math.floor(cx - rad * 2.6)), x1 = Math.min(N - 1, Math.ceil(cx + rad * 2.6)), y0 = Math.max(0, Math.floor(cy - rad * 2.6)), y1 = Math.min(N - 1, Math.ceil(cy + rad * 2.6)), dep = .5 * rad * str;
      for (var yy = y0; yy <= y1; yy++) for (var xx = x0; xx <= x1; xx++) {
        var dx = xx - cx, dy = yy - cy, d = Math.sqrt(dx * dx + dy * dy) / rad, hh = 0, al = 0;
        if (d < 1) { hh = -dep * (1 - d * d); al = -.04 * str * (1 - d * d); if (rad > 6) hh += dep * .55 * Math.exp(-(d / .13) * (d / .13)); }
        if (d > .8 && d < 1.3) { var q = (d - 1.04) / .1; hh += dep * .4 * Math.exp(-q * q); al += .04 * str * Math.exp(-q * q); }
        if (d >= 1.2 && d < 2.4) { hh += dep * .07 * (1 - (d - 1.2) / 1.2); al += .035 * str * (1 - (d - 1.2) / 1.2); }
        hg[yy * N + xx] += hh; v[yy * N + xx] += al;
      }
    }
    for (i = 0; i < 760; i++) { var a = r() * 6.2832, d2 = Math.sqrt(r()) * .98, rad = 1.1 + Math.pow(r(), 3.4) * 15; crater(R + Math.cos(a) * d2 * R, R + Math.sin(a) * d2 * R, rad, .25 + r() * .45); }
    for (y = 0; y < N; y++) for (x = 0; x < N; x++) hg[y * N + x] += (vn(x / 9, y / 9) - .5) * 1.4 + (vn(x / 3.2, y / 3.2) - .5) * .5;
    HGT = hg;
    /* تيخو وكوبرنيكوس بأشعتهما */
    var tx = R + -.12 * R, ty = R + .72 * R; crater(tx, ty, 7, 1.6);
    for (i = 0; i < 22; i++) { var ang = r() * 6.2832, len = 40 + r() * 90; for (var t = 12; t < len; t += 1) { var px = Math.round(tx + Math.cos(ang) * t), py = Math.round(ty + Math.sin(ang) * t); if (px > 0 && py > 0 && px < N && py < N && (px - R) * (px - R) + (py - R) * (py - R) < R * R) v[py * N + px] += .07 * (1 - t / len); } }
    crater(R + -.38 * R, R + -.05 * R, 7, 1.4);
    return v;
  }
  var MCACHE = {};
  function moonImg(el) {
    var key = Math.round(el * 2); if (MCACHE[key]) return MCACHE[key];
    if (!TEX) TEX = buildTex();
    var N = TN, R = N / 2, cv = document.createElement('canvas'); cv.width = cv.height = N;
    var cx = cv.getContext('2d'), im = cx.createImageData(N, N), D = im.data, e = el * Math.PI / 180, H = HGT;
    var sx = Math.sin(e), sz = -Math.cos(e), x, y;
    for (y = 0; y < N; y++) for (x = 0; x < N; x++) {
      var nx = (x + .5 - R) / R, ny = (y + .5 - R) / R, rr = nx * nx + ny * ny; if (rr >= 1.02) continue;
      var nz = Math.sqrt(Math.max(0, 1 - rr)), dotG = nx * sx + nz * sz, ix = y * N + x;
      var hx = x > 0 && x < N - 1 ? (H[ix + 1] - H[ix - 1]) * .5 : 0, hy = y > 0 && y < N - 1 ? (H[ix + N] - H[ix - N]) * .5 : 0, w = (.3 + .7 * nz) * .42;
      var px = nx - hx * w, py = ny - hy * w, pz = nz, pl = Math.sqrt(px * px + py * py + pz * pz) || 1, dotP = (px * sx + pz * sz) / pl;
      var lit = Math.max(0, Math.min(1, (dotG + .05) / .26)); lit = lit * lit * (3 - 2 * lit);
      var alb = Math.max(.05, Math.min(1, TEX[ix])), rel = Math.max(0, dotP), sh = lit * (.2 + 1.05 * Math.pow(rel, .62));
      var k = alb * sh, i4 = ix * 4, edge = rr > .98 ? Math.max(0, (1.02 - rr) / .04) : 1, es = (1 - lit) * (.07 + .035 * alb);
      D[i4] = Math.min(255, k * 268 + es * 255 * .82); D[i4 + 1] = Math.min(255, k * 254 + es * 255 * .88); D[i4 + 2] = Math.min(255, k * 232 + es * 255 * 1.05); D[i4 + 3] = 255 * edge;
    }
    cx.putImageData(im, 0, 0);
    var u = cv.toDataURL('image/png'); MCACHE[key] = u; return u;
  }
  window.AqeeqMoonImg = moonImg;
  function mInner(el) { try { return '<image href="' + moonImg(el) + '" x="10" y="10" width="100" height="100"/>'; } catch (e) { return window.AqeeqMoon ? window.AqeeqMoon(el) : ''; } }
  function moonSvg(c, size) {
    var inner; try { inner = '<defs><radialGradient id="mnGlw" cx="50%" cy="50%" r="50%"><stop offset=".6" stop-color="#FFE3A6" stop-opacity=".6"/><stop offset=".78" stop-color="#FFD58A" stop-opacity=".18"/><stop offset="1" stop-color="#FFD58A" stop-opacity="0"/></radialGradient><radialGradient id="mnRim" cx="50%" cy="50%" r="50%"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></radialGradient></defs><circle cx="60" cy="60" r="63" fill="url(#mnGlw)" opacity="' + (.22 + .78 * c.il).toFixed(2) + '"/><circle cx="60" cy="60" r="50" fill="#0b0a12"/><image href="' + moonImg(c.el) + '" x="10" y="10" width="100" height="100"/><circle cx="60" cy="60" r="50" fill="url(#mnRim)"/>'; } catch (er) { inner = typeof window.AqeeqMoon === 'function' ? window.AqeeqMoon(c.el) : '<circle cx="60" cy="60" r="50" fill="#d9d2c3"/>'; }
    var over = '';
    if (c.lunar) over = '<defs><radialGradient id="mnCop" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#C2542B" stop-opacity=".78"/><stop offset=".7" stop-color="#8E2D1E" stop-opacity=".82"/><stop offset="1" stop-color="#4A1812" stop-opacity=".9"/></radialGradient></defs><circle cx="60" cy="60" r="50" fill="url(#mnCop)" style="mix-blend-mode:multiply"/>';
    if (c.solar) over = '<circle cx="60" cy="60" r="50" fill="#14090c"/><g stroke="#F6DCA0" stroke-opacity=".55" stroke-width=".8" stroke-linecap="round">' + (function () { var s = ''; for (var i = 0; i < 36; i++) { var a = i * 10 * Math.PI / 180, r1 = 52, r2 = 52 + (i % 3 ? 5 : 9); s += '<line x1="' + (60 + r1 * Math.cos(a)).toFixed(1) + '" y1="' + (60 + r1 * Math.sin(a)).toFixed(1) + '" x2="' + (60 + r2 * Math.cos(a)).toFixed(1) + '" y2="' + (60 + r2 * Math.sin(a)).toFixed(1) + '"/>'; } return s; })() + '</g><circle cx="60" cy="60" r="51" fill="none" stroke="#F6DCA0" stroke-opacity=".7" stroke-width="1.2"/>';
    return '<svg viewBox="-6 -6 132 132" width="' + size + '" height="' + size + '" role="img" aria-label="القمر: ' + PH[c.ph][0] + '، إضاءة ' + Math.round(c.il * 100) + '%">' + inner + over + '</svg>';
  }
  function badges(c) {
    var b = [];
    if (c.lunar) b.push('<span class="mn-b is-ecl">خسوف قمري ' + kindAr(c.lunar.kind) + '</span>');
    if (c.solar) b.push('<span class="mn-b is-ecl">كسوف شمسي ' + kindAr(c.solar.kind) + '</span>');
    if (c.supr) b.push('<span class="mn-b is-super">قمر عملاق</span>');
    else if (c.full) b.push('<span class="mn-b is-full">بدر مكتمل</span>');
    else if (c.ph === 0) b.push('<span class="mn-b">محاق</span>');
    return b.join('');
  }
  function fact(k, v) { return '<div class="mn-fact"><small>' + k + '</small><b>' + v + '</b></div>'; }
  function nextEv(c) {
    var o = [];
    if (c.newM) o.push(fact('المحاق القادم', fmtS(c.newM)));
    if (c.fullM) o.push(fact('البدر القادم', fmtS(c.fullM)));
    if (c.nextL && !c.lunar) o.push(fact('أقرب خسوف', fmtS(c.nextL.peak.date) + ' · ' + kindAr(c.nextL.kind)));
    if (c.nextS && !c.solar) o.push(fact('أقرب كسوف', fmtS(c.nextS.peak.date) + ' · ' + kindAr(c.nextS.kind)));
    return o.join('');
  }
  function moonView() {
    var c = calc(base + off * 864e5), p = PH[c.ph];
    var halo = c.full ? ' is-full' : '', ecl = c.lunar ? ' is-lunar' : c.solar ? ' is-solar' : '';
    var scale = c.supr ? ' is-super' : '';
    return '<div class="mn-stage' + halo + ecl + scale + '"><div class="mn-halo" style="--mnh:' + Math.max(0, (c.il - .6) / .4).toFixed(2) + '"></div><div class="mn-moon" id="mn-moon" tabindex="0" aria-label="اسحب القمر لتغيير اليوم">' + moonSvg(c, 232) + '</div></div>' +
      '<p class="mn-hint">اسحب القمر يمينًا أو يسارًا للتنقل بين الأيام</p>' +
      '<div class="mn-title"><h4>' + p[0] + '</h4><div class="mn-bs">' + badges(c) + '</div></div>' +
      '<div class="mn-date"><button type="button" data-mn-step="-1" aria-label="اليوم التالي"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 5l7 7-7 7"/></svg></button><span>' + fmtD(c.d) + (off === 0 ? ' · الآن' : '') + '</span><button type="button" data-mn-step="1" aria-label="اليوم السابق"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg></button></div>' +
      '<input class="mn-range" id="mn-range" type="range" min="-30" max="30" step="1" value="' + off + '" aria-label="تغيير اليوم"><button type="button" class="mn-now" data-mn-now' + (off === 0 ? ' hidden' : '') + '>العودة إلى الآن</button>' +
      '<div class="mn-tel">' + tel('il', 'الإضاءة', Math.round(c.il * 100) + '%') + tel('age', 'عمر القمر', c.age.toFixed(1).replace('.', '٫') + ' يوم') + tel('sign', 'البرج', c.sign + ' ' + c.deg + '°') + tel('dist', 'المسافة عن الأرض', num(c.dist) + ' كم') + '</div>' +
      phBody(p, { label: 'ماذا يعني هذا الطور لك' }) +
      '<div class="mn-facts">' + nextEv(c) + '</div>';
  }
  var DAYS = [0, 4, 7, 11, 15, 18, 22, 26];
  function compassView() {
    var c = calc(base + off * 864e5), cur = c.ph, S = 340, C = S / 2, R = 122, i;
    var ring = '<circle cx="' + C + '" cy="' + C + '" r="' + (R + 34) + '" fill="none" stroke="#A07A3A" stroke-opacity=".35"/><circle cx="' + C + '" cy="' + C + '" r="' + (R - 34) + '" fill="none" stroke="#A07A3A" stroke-opacity=".25"/>';
    var arrow = '<path d="M' + (C + 24) + ' ' + (C - R - 44) + ' l14 6 -14 6" fill="none" stroke="#A07A3A" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>';
    var nodes = '';
    for (i = 0; i < 8; i++) {
      var a = (i * 45 - 90) * Math.PI / 180, x = C + R * Math.cos(a), y = C + R * Math.sin(a), el = i * 45;
      var act = (pick == null ? cur : pick) === i;
      nodes += '<g class="mn-node' + (act ? ' is-on' : '') + (i === cur ? ' is-cur' : '') + '" data-mn-ph="' + i + '" role="button" tabindex="0" aria-label="' + PH[i][0] + '" transform="translate(' + (x - 25).toFixed(1) + ' ' + (y - 25).toFixed(1) + ') scale(.4167)"><circle cx="60" cy="60" r="62" fill="url(#mnGlw)" opacity="' + (.2 + .8 * (1 - Math.cos(el * Math.PI / 180)) / 2).toFixed(2) + '"/><circle cx="60" cy="60" r="50" fill="#0b0a12"/>' + (act ? '<circle cx="60" cy="60" r="62" fill="none" stroke="#6A2038" stroke-width="3"/>' : '') + mInner(el) + '<circle cx="60" cy="60" r="50" fill="url(#mnRim)"/></g>' +
        '<circle cx="' + (x + 20).toFixed(1) + '" cy="' + (y - 20).toFixed(1) + '" r="8" fill="#6A2038"/><text x="' + (x + 20).toFixed(1) + '" y="' + (y - 16.5).toFixed(1) + '" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">' + (i + 1) + '</text>' +
        '<text x="' + x.toFixed(1) + '" y="' + (y + 40).toFixed(1) + '" text-anchor="middle" class="mn-nl">' + PH[i][1] + '</text>';
    }
    var mid = '<g transform="translate(' + (C - 40) + ' ' + (C - 40) + ') scale(.667)"><circle cx="60" cy="60" r="50" fill="#0b0a12"/>' + mInner(c.el) + '</g>' +
      '<text x="' + C + '" y="' + (C + 58) + '" text-anchor="middle" class="mn-nl" style="font-size:11px">اليوم ' + num(Math.max(1, Math.round(c.age))) + ' من 30</text>';
    var sel = pick == null ? cur : pick, p = PH[sel];
    var list = '<h4 class="mn-lt">الأطوار الثمانية بالترتيب</h4><ol class="mn-leg">';
    for (i = 0; i < 8; i++) list += '<li><button type="button" data-mn-ph="' + i + '" class="' + (i === cur ? 'is-cur' : '') + (i === sel ? ' is-on' : '') + '"><b>' + (i + 1) + '</b><span><strong>' + PH[i][0] + '</strong><small>' + PH[i][1] + ' · حوالي اليوم ' + num(DAYS[i] + 1) + '</small></span>' + (i === cur ? '<em>الآن</em>' : '') + '</button></li>';
    list += '</ol>';
    return '<p class="mn-intro">دورة القمر نحو 29 يومًا، ولكل طور طاقة مختلفة. اضغط أي طور لتقرأ معناه.</p>' +
      '<svg class="mn-wheel" viewBox="0 0 ' + S + ' ' + S + '" role="group" aria-label="بوصلة أطوار القمر"><defs><radialGradient id="mnGlw" cx="50%" cy="50%" r="50%"><stop offset=".6" stop-color="#FFE3A6" stop-opacity=".6"/><stop offset=".78" stop-color="#FFD58A" stop-opacity=".18"/><stop offset="1" stop-color="#FFD58A" stop-opacity="0"/></radialGradient><radialGradient id="mnRim" cx="50%" cy="50%" r="50%"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></radialGradient></defs>' + ring + mid + nodes + '</svg>' +
      '<p class="mn-hint">اضغط أي طور لتقرأ معناه</p>' +
      phBody(p, { label: (sel === cur ? 'الطور الحالي' : 'طور القمر'), title: p[0] }) + (sel !== cur ? '<button type="button" class="mn-go" data-mn-go="' + sel + '">اعرض أقرب موعد لهذا الطور</button>' : '') + list;
  }
  function render() {
    var s = ensure(), b = $('.aqm-sheet-body', s), st = b.scrollTop;
    var Z = A(); if (!Z) { b.innerHTML = '<p class="mn-hint">تعذر تحميل بيانات القمر حاليًا.</p>'; return; }
    b.innerHTML = '<div class="mn-tabs" role="tablist"><button type="button" role="tab" data-mn-tab="moon" class="' + (tab === 'moon' ? 'is-on' : '') + '">القمر</button><button type="button" role="tab" data-mn-tab="compass" class="' + (tab === 'compass' ? 'is-on' : '') + '">بوصلة الأطوار</button></div><div class="mn-pane">' + (tab === 'moon' ? moonView() : compassView()) + '</div>';
    b.scrollTop = st;
    var c = calc(base + off * 864e5); $('.aqm-sheet-sub', s).textContent = PH[c.ph][0] + ' · ' + Math.round(c.il * 100) + '%';
    var nb = $('[data-mn-next] b', s); if (nb) nb.textContent = PH[((tab === 'compass' && pick != null ? pick : c.ph) + 1) % 8][0];
    bind();
  }
  function nextPhase() {
    var c = calc(base + off * 864e5);
    if (tab === 'compass') { pick = ((pick == null ? c.ph : pick) + 1) % 8; return render(); }
    try { var d = A().SearchMoonPhase(STARTS[(c.ph + 1) % 8] % 360 + .4, new Date(base + off * 864e5), 40).date; off = Math.min(45, Math.max(off + 1, Math.ceil((d - base) / 864e5))); } catch (x) { off = Math.min(45, off + 3); }
    render();
  }
  var dragging = false;
  function setOff(v) { v = Math.max(-45, Math.min(45, v)); if (v === off) return; off = v; render(); }
  function bind() {
    var m = $('#mn-moon');
    if (m) {
      var sx = 0, so = 0, moved = false;
      m.addEventListener('pointerdown', function (e) { dragging = true; sx = e.clientX; so = off; moved = false; try { m.setPointerCapture(e.pointerId); } catch (x) {} });
      m.addEventListener('pointermove', function (e) { if (!dragging) return; var n = so + Math.round((sx - e.clientX) / 14); if (n !== off) { moved = true; var nn = Math.max(-45, Math.min(45, n)); off = nn; softUpdate(); } });
      var end = function () { dragging = false; if (moved) render(); };
      m.addEventListener('pointerup', end); m.addEventListener('pointercancel', end);
      m.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') setOff(off + 1); if (e.key === 'ArrowRight') setOff(off - 1); });
    }
    var r = $('#mn-range'); if (r) r.addEventListener('input', function () { off = +r.value; softUpdate(); }), r.addEventListener('change', render);
  }
  /* تحديث خفيف أثناء السحب: القمر والاسم والتاريخ فقط */
  function softUpdate() {
    var c = calc(base + off * 864e5), m = $('#mn-moon'); if (!m) return;
    m.innerHTML = moonSvg(c, 232);
    var st = $('.mn-stage'); if (st) { st.className = 'mn-stage' + (c.full ? ' is-full' : '') + (c.lunar ? ' is-lunar' : c.solar ? ' is-solar' : '') + (c.supr ? ' is-super' : ''); $('.mn-halo', st).style.setProperty('--mnh', Math.max(0, (c.il - .6) / .4).toFixed(2)); }
    var h = $('.mn-title h4'); if (h) h.textContent = PH[c.ph][0]; var bs = $('.mn-bs'); if (bs) bs.innerHTML = badges(c);
    var ds = $('.mn-date span'); if (ds) ds.textContent = fmtD(c.d) + (off === 0 ? ' · الآن' : '');
    var r = $('#mn-range'); if (r) r.value = off;
  }
  function ensure() {
    if (sheet) return sheet;
    sheet = document.createElement('div'); sheet.className = 'aqm-sheet mn-sheet'; sheet.hidden = true;
    sheet.innerHTML = '<div class="aqm-sheet-scrim" data-mnc></div><div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="mn-t"><span class="aqm-sheet-grip"></span>' +
      '<button type="button" class="aqm-sheet-x" data-mnc aria-label="إغلاق"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="aqm-sheet-head"><span class="aqm-sheet-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14.5A8 8 0 1 1 9.5 5 6.5 6.5 0 0 0 19 14.5z"/></svg></span><div><h3 id="mn-t">القمر</h3><p class="aqm-sheet-sub"></p></div></div><div class="aqm-sheet-body"></div>' +
      '<div class="aqm-sheet-foot"><button type="button" class="aqm-foot-next" data-mn-next><span class="aqm-foot-l"><small>الطور التالي</small><b></b></span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button><button type="button" class="aqm-foot-close" data-mnc>إغلاق</button></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-mnc]')) return close();
      if (e.target.closest('[data-mn-next]')) return nextPhase();
      var t = e.target.closest('[data-mn-tab]'); if (t) { tab = t.getAttribute('data-mn-tab'); return render(); }
      var s = e.target.closest('[data-mn-step]'); if (s) return setOff(off + (+s.getAttribute('data-mn-step')));
      if (e.target.closest('[data-mn-now]')) { off = 0; return render(); }
      var p = e.target.closest('[data-mn-ph]'); if (p) { pick = +p.getAttribute('data-mn-ph'); return render(); }
      var g = e.target.closest('[data-mn-go]'); if (g) { var i = +g.getAttribute('data-mn-go'); try { var d = A().SearchMoonPhase(i * 45, new Date(base), 40).date; off = Math.max(-45, Math.min(45, Math.round((d - base) / 864e5))); } catch (x) {} tab = 'moon'; pick = null; return render(); }
    });
    sheet.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); var p = e.target.closest && e.target.closest('[data-mn-ph]'); if (p && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick = +p.getAttribute('data-mn-ph'); render(); } });
    return sheet;
  }
  function open(t) { base = Date.now(); off = 0; pick = null; tab = t || 'moon'; var s = ensure(); render(); s.classList.remove('is-closing'); s.hidden = false; root.classList.add('aqm-sheet-open'); }
  function close() { if (!sheet || sheet.hidden) return; sheet.classList.add('is-closing'); var s = sheet; setTimeout(function () { s.hidden = true; s.classList.remove('is-closing'); root.classList.remove('aqm-sheet-open'); }, 230); }
  window.AqeeqMoonSheet = { open: open, close: close };

  /* زر الفتح: داخل بطاقة القمر في صفحة السماء، وعلى القمر نفسه */
  function inject() {
    $$('#swc-moon, .wld-moon, #sky-moon').forEach(function (box) {
      if (!box.textContent.trim() && !box.querySelector('svg')) return;
      if (box.querySelector('.mn-open')) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'mn-open';
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14.5A8 8 0 1 1 9.5 5 6.5 6.5 0 0 0 19 14.5z"/></svg><span>القمر بالتفصيل</span>';
      box.appendChild(b);
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.mn-open, .swc-moon-fig, .swc-moon-svg'); if (!b) return;
    e.preventDefault(); open('moon');
  });
  var sec = document.getElementById('sky'); if (sec) { var q; new MutationObserver(function () { clearTimeout(q); q = setTimeout(inject, 80); }).observe(sec, { childList: true, subtree: true }); inject(); }
})();

;
/* assets/js/vedic-extras.js */
/* إضافات الخريطة الفيدية: المنزل القمري، الداشا، التقسيمات D9/D10/D7، قراءة السنة وساتي ساتي. تُحسب محليًا من الخريطة النجمية. */
(function () {
  'use strict';
  var SG = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var LORDS = ['كيتو', 'الزهرة', 'الشمس', 'القمر', 'المريخ', 'راهو', 'المشتري', 'زحل', 'عطارد'];
  var YRS = [7, 20, 6, 10, 7, 18, 16, 19, 17];
  var DAY = 365.25 * 864e5;
  var NK = [
    ['أشويني', 'بداية سريعة وشجاعة. تبدأ الأشياء قبل أن يفكر غيرك، ولك يد في الشفاء والمساعدة.'],
    ['بهراني', 'تحمل الثقل وتعرف الحدود. تمر بالتجارب الكبيرة وتخرج منها أكثر وضوحًا.'],
    ['كريتيكا', 'نظرتك حادة وكلمتك تقطع. تحب الصدق ولو جرح، ولا تقبل الغش.'],
    ['روهيني', 'جاذبية وحس جمالي وحب للأرض والملموس. تثمر حيث تُزرع وتكره الفوضى.'],
    ['ميريغاشيرا', 'تبحث دائمًا عن شيء ما. فضولك لا يهدأ، وتجد طريقك عبر الأسئلة.'],
    ['أردرا', 'عاصفة تنظف. تمر بأزمات تعيد تشكيلك، وتفهم الألم أكثر من غيرك.'],
    ['بونارفاسو', 'تعود وتبدأ من جديد في كل مرة. فيك أمان داخلي يرجع بعد كل خسارة.'],
    ['بوشيا', 'تغذي من حولك. فيك رعاية صافية، وغالبًا تكبر معك المسؤولية مبكرًا.'],
    ['أشليشا', 'تقرأ ما وراء الكلام. عندك حدس ثعباني الذكاء، وتحتاج أن تثق في من يستحق فقط.'],
    ['مَغا', 'هيبة موروثة وإحساس بالأصل والجذور. تميل للقيادة وتحتاج تقديرًا يليق بك.'],
    ['بورفا فالغوني', 'تحب المتعة والدفء والاحتفال. كرمك واضح وقلبك مفتوح للحب.'],
    ['أوتارا فالغوني', 'وفاء وعقد واضح. تعطي بثبات وتنتظر الشيء نفسه.'],
    ['هاستا', 'مهارة اليد وخفة الظل. تصلح الأشياء وتنجزها بصبر وذكاء عملي.'],
    ['تشيترا', 'تصنع صورة لافتة وتحب الإتقان. فيك فنان يريد أن يترك أثرًا جميلًا.'],
    ['سواتي', 'استقلال ومرونة. تميل مع الريح دون أن تنكسر، وتحتاج مساحة حرة.'],
    ['فيشاكا', 'هدف واحد وإصرار. تصل لما تريده بعد الطريق الطويل، وتكره أن تقف في منتصفه.'],
    ['أنورادا', 'صداقة ووفاء رغم المسافات. تبني دوائر قريبة وتبقى فيها طويلًا.'],
    ['جيشتا', 'الأكبر والأقوى بين إخوتك الروحيين. تحمل المسؤولية وتحب أن تُحترم سلطتك.'],
    ['مولا', 'تذهب للجذر وتقتلع. مررت بما يهدم الأساس لتبني أصدق منه.'],
    ['بورفا أشاضا', 'مياه لا تُقهر. تقنع بالكلمة والحماس، ولا تقبل الهزيمة بسهولة.'],
    ['أوتارا أشاضا', 'نصر متأخر لكنه ثابت. تبني ببطء ما يبقى.'],
    ['شرافانا', 'تسمع وتتعلم. لك أذن حساسة وحكمة تُنقل من جيل لجيل.'],
    ['دهانيشتا', 'إيقاع ونجاح مادي. تحب الموسيقى والجماعة والحركة، وتلمع حين يراك الناس.'],
    ['شاتابيشا', 'مئة طبيب. تميل للعزلة والأسرار والشفاء الغريب، ولا يفهمك كل أحد.'],
    ['بورفا بهادرابادا', 'نار روحية مزدوجة. تعيش بحدة وتغيّر ما حولك بإيمانك.'],
    ['أوتارا بهادرابادا', 'عمق هادئ وصبر كبير. تمسك مشاعرك وتتأمل الأشياء من تحت السطح.'],
    ['ريفاتي', 'ختام الرحلة والرعاية. تحمي الضعيف وتنهي الدورات بسلام.']
  ];
  var LT = [
    'كيتو فترة تفريغ. تتفكك فيها أشياء كنت متمسكًا بها، وتقترب من نفسك أكثر بعد أن يخف الزحام. لا تقاوم الفراغ، ففيه الجواب.',
    'الزهرة فترة حب وجمال ومال. تنجذب فيها الأشياء الحلوة، وتتعلم كيف تستقبل بدل أن تلاحق. حذار من الإفراط في الراحة.',
    'الشمس فترة ظهور. تُطلب منك الشجاعة وأن تقف في مكانك وتُعرف. العلاقة مع السلطة والأب تأخذ مساحة واضحة.',
    'القمر فترة مشاعر وبيت وناس. تحس بكل شيء أكثر، وتحتاج مكانًا آمنًا وعلاقات تغذي. اهتم بنومك وغذائك النفسي.',
    'المريخ فترة حركة وصراع وبناء. طاقتك مرتفعة، والغضب قريب. استخدمها في مشروع واحد جاد بدل أن تتشتت.',
    'راهو فترة رغبة وطموح غير عادي. تتحرك بسرعة وتجرب أشياء جديدة وتخرج من العادي، لكن الوهم قريب فتحقق قبل أن تلتزم.',
    'المشتري فترة توسع وحكمة وفرص. تتفتح أبواب التعلم والزواج والمال بقدر ما تلتزم بقيمك. لا تضيّع النعمة بالتكاسل.',
    'زحل فترة بناء وتدقيق وصبر. العمل الحقيقي يظهر الآن، والتأجيل يُحاسَب. ما تبنيه هنا يعيش سنوات طويلة.',
    'عطارد فترة كلام وتعلم وتجارة. عقلك سريع وتتعدد صلاتك واهتماماتك. نظّم أفكارك وكلماتك لأنها ستحمل الأثر.'
  ];
  var HT = [
    'تُحس بها على جسدك وصورتك وطريقتك في الظهور، فتتغير هويتك وتبدأ فصلًا جديدًا.',
    'تنعكس على المال والكلام والأسرة وما تعتبره قيمة لك.',
    'تحرك الشجاعة والتواصل والإخوة والمبادرات الصغيرة التي تفتح أبوابًا كبيرة.',
    'تمس البيت والأم والعقار والأمان الداخلي. غالبًا تسأل أين تنتمي.',
    'تفتح الحب والإبداع والأطفال والمتعة والمخاطرة المحسوبة.',
    'تشتغل على العمل اليومي والصحة والخدمة والديون والأعداء الظاهرين.',
    'تدور حول الشريك والزواج والشراكات والصفقات، وكيف تقف أمام الآخر.',
    'تحرك التحولات العميقة والمال المشترك والإرث والأسرار وما يُخفى.',
    'تفتح السفر والمعلم والإيمان والدراسة العليا والحظ الذي يأتي من الحكمة.',
    'تضع الضوء على المهنة والسمعة والمكانة، وماذا تُعرف به أمام الناس.',
    'تحرك الأصدقاء والمكاسب والأحلام الكبيرة والمجتمعات التي تنتمي لها.',
    'تنزل بك إلى العزلة والنوم والأحلام والخسارة الصامتة والبحث الروحي.'
  ];
  var SS = [
    'زحل في البيت الثاني عشر من قمرك: بداية ساتي ساتي. هي مرحلة تخفيف، تترك فيها ما أثقلك وتدخل عزلة مفيدة. نظّم مصاريفك ونومك.',
    'زحل فوق قمرك مباشرة: قلب ساتي ساتي. تختبر الصبر والمسؤولية على المستوى العاطفي، وكل شيء يطلب منك نضجًا. لا تقرر وأنت متعب.',
    'زحل في البيت الثاني من قمرك: الجزء الأخير من ساتي ساتي. تعيد ترتيب المال والأسرة وطريقة كلامك، ويبدأ الحمل يخف بالتدريج.'
  ];
  var SGT = ['مبادر', 'ثابت', 'متحرك الفكر', 'حنون', 'واثق', 'دقيق', 'متوازن', 'عميق', 'باحث', 'جاد', 'مستقل', 'حالم'];
  /* التقسيمات الأساسية (باراشارا). كل عنصر: المفتاح، العنوان، الموضوع، رقم التقسيم، المقدمة، الكوكب الدال، صيغة الملكية. D1 هي الخريطة النجمية نفسها أعلى الصفحة. */
  var D = [
    ['d2', 'التقسيم الثاني D2', 'المال والسيولة', 2, 'يوضح علاقتك بالمال: ما تجمعه بجهدك وما يأتيك بالرعاية والدعم. تقع كل نقطة هنا في الأسد أو السرطان فقط.', 'jupiter', 'مشتريك'],
    ['d7', 'التقسيم السابع D7', 'الأبناء والإبداع', 7, 'يوضح علاقتك بالأبناء والإبداع وما تتركه بعدك.', 'jupiter', 'مشتريك'],
    ['d9', 'التقسيم التاسع D9', 'عمق العلاقات والقدر الروحي', 9, 'يوضح نضج العلاقات وطبيعة الشريك وما تجنيه في النصف الثاني من العمر.', 'venus', 'زهرتك'],
    ['d10', 'التقسيم العاشر D10', 'المهنة والمكانة', 10, 'يوضح طريقك المهني وما تُعرف به وكيف تتعامل مع النجاح.', 'saturn', 'زحلك'],
    ['d12', 'التقسيم الثاني عشر D12', 'الوالدان والجذور', 12, 'يوضح ما ورثته من والديك وأصلك، وكيف يظهر أثر البيت الأول الذي نشأت فيه.', 'sun', 'شمسك'],
    ['d60', 'التقسيم الستون D60', 'الكارما التراكمية', 60, 'يوضح الرصيد الأعمق الذي تحمله معك. هذا التقسيم يتغير كل دقيقتين تقريبًا في الطالع، فلا يُعتمد عليه إلا مع وقت ميلاد دقيق.', 'moon', 'قمرك']
  ];
  var PL = [['sun', 'الشمس'], ['moon', 'القمر'], ['mars', 'المريخ'], ['mercury', 'عطارد'], ['jupiter', 'المشتري'], ['venus', 'الزهرة'], ['saturn', 'زحل'], ['node', 'راهو']];
  function norm(x) { return ((x % 360) + 360) % 360; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function body(ch, k) { var l = ch.bodies || []; for (var i = 0; i < l.length; i++) if (String(l[i].key).toLowerCase() === k) return l[i];
    /* راهو وكيتو بالعقدة المتوسطة (المعيار الكلاسيكي)؛ الحقيقية احتياط فقط لو المتوسطة غير موجودة */
    if (k === 'node') return body(ch, 'truenode'); return null; }
  function div(lon, n) {
    var sg = Math.floor(norm(lon) / 30), pos = norm(lon) % 30, part = Math.min(n - 1, Math.floor(pos / (30 / n)));
    var start;
    if (n === 1) return sg;                                   // D1 راشي: البرج نفسه
    if (n === 2) return ((sg % 2 === 0) === (part === 0)) ? 4 : 3; // D2 هورا: الفردي يبدأ بالأسد (الشمس) والزوجي بالسرطان (القمر)
    if (n === 12 || n === 60) start = sg;                      // D12 ودي 60: العدّ من البرج نفسه
    if (n === 9) start = (sg % 3 === 0) ? sg : (sg % 3 === 1) ? sg + 8 : sg + 4;
    if (n === 10) start = (sg % 2 === 0) ? sg : sg + 8;
    if (n === 7) start = (sg % 2 === 0) ? sg : sg + 6;
    var mod = sg % 3, odd = sg % 2 === 0, el = sg % 4;
    if (n === 3) return (sg + 4 * part) % 12;
    if (n === 4) return (sg + 3 * part) % 12;
    if (n === 16 || n === 45) start = mod === 0 ? 0 : mod === 1 ? 4 : 8;
    if (n === 20) start = mod === 0 ? 0 : mod === 1 ? 8 : 4;
    if (n === 24) start = odd ? 4 : 3;
    if (n === 27) start = [0, 3, 6, 9][el];
    if (n === 40) start = odd ? 0 : 6;
    if (n === 5) return (odd ? [0, 10, 8, 2, 6] : [1, 5, 11, 9, 7])[part];
    if (n === 6) start = odd ? 0 : 6;
    if (n === 8) start = mod === 0 ? 0 : mod === 1 ? 8 : 4;
    if (n === 11) return (11 - part) % 12;
    if (n === 30) { /* تريمشامسا: أجزاء غير متساوية */
      var T = odd ? [[5, 0], [10, 10], [18, 8], [25, 2], [30, 6]] : [[5, 1], [12, 5], [20, 11], [25, 9], [30, 7]];
      for (var q = 0; q < 5; q++) if (pos < T[q][0]) return T[q][1];
      return T[4][1];
    }
    return (start + part) % 12;
  }
  function dt(ms) { return new Date(ms).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }); }
  function dashas(moonLon, birthMs) {
    var seg = 360 / 27, n = Math.floor(moonLon / seg), frac = 1 - (moonLon % seg) / seg, i = n % 9;
    var list = [], t = birthMs - YRS[i] * (1 - frac) * DAY;
    for (var k = 0; k < 9; k++) { var j = (i + k) % 9, len = YRS[j] * DAY; list.push({ lord: j, s: t, e: t + len }); t += len; }
    return list;
  }
  function antars(m) {
    var out = [], t = m.s, total = m.e - m.s;
    for (var k = 0; k < 9; k++) { var j = (m.lord + k) % 9, len = total * YRS[j] / 120; out.push({ lord: j, s: t, e: t + len }); t += len; }
    return out;
  }
  function cur(list, now) { for (var i = 0; i < list.length; i++) if (now >= list[i].s && now < list[i].e) return list[i]; return list[list.length - 1]; }
  function table(head, rows) { return '<div class="eam-table-wrap"><table class="eam-table"><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.join('') + '</tbody></table></div>'; }
  function render(result, ch, natal, helpers) {
    var moon = body(ch, 'moon'); if (!moon) return;
    window.AqVedic.last = { ch: ch, natal: natal };
    var now = Date.now(), birthMs = (natal && isFinite(natal.utcMs)) ? natal.utcMs : (ch.jde - 2440587.5) * 864e5;
    var n = Math.floor(moon.lon / (360 / 27)), pada = Math.floor((moon.lon % (360 / 27)) / (360 / 108)) + 1, nk = NK[n];
    var h = '';
    h += '<section class="eam-card vx"><h4>منزلك القمري</h4><p><b>' + nk[0] + '</b> · القدم ' + pada + ' · قمرك في برج ' + SG[Math.floor(moon.lon / 30)] + ' · حاكم المنزل ' + LORDS[n % 9] + '</p><p>' + nk[1] + '</p></section>';
    var ds = dashas(moon.lon, birthMs), cm = cur(ds, now), ca = cur(antars(cm), now);
    var asc = ch.known ? Math.floor(ch.asc / 30) : null;
    var hs = function (b) { return asc === null || !b ? null : ((Math.floor(b.lon / 30) - asc + 12) % 12); };
    var lordKey = ['node', 'venus', 'sun', 'moon', 'mars', 'node', 'jupiter', 'saturn', 'mercury'][ca.lord];
    var lb = body(ch, lordKey); if (lb && ca.lord === 0) lb = { lon: norm(lb.lon + 180) };
    var lh = hs(lb);
    var yr = '<p>أنت الآن في فترة ' + LORDS[cm.lord] + ' الكبرى، وفي داخلها فترة ' + LORDS[ca.lord] + ' الصغرى، من ' + dt(ca.s) + ' إلى ' + dt(ca.e) + '.</p><p>' + LT[ca.lord] + '</p>';
    if (lh !== null) {
      yr += '<p>' + (ca.lord === 0 ? 'كيتو' : ca.lord === 5 ? 'راهو' : LORDS[ca.lord]) + ' في بيتك ' + (lh + 1) + ': ' + HT[lh] + '</p>';
    } else yr += '<p class="eam-note">وقت الميلاد غير معروف، لذلك لا نقدر نحدد البيت الذي تعمل فيه هذه الفترة.</p>';
    var sat = helpers && helpers.saturnSign ? helpers.saturnSign() : null;
    if (sat !== null) {
      var d = (sat - Math.floor(moon.lon / 30) + 12) % 12, idx = d === 11 ? 0 : d === 0 ? 1 : d === 1 ? 2 : -1;
      yr += '<p>' + (idx >= 0 ? SS[idx] : 'زحل الآن خارج دائرة ساتي ساتي بالنسبة لقمرك، فالضغط الأثقل ليس عليك اليوم.') + '</p>';
    }
    h += '<section class="eam-card vx"><h4>قراءة سنتك الحالية</h4>' + yr + '</section>';
    h += '<section class="eam-card vx"><h4>رحلة الفترات الكبرى (ماها داشا)</h4>' + table(['الفترة', 'من', 'إلى'], ds.map(function (x) { return '<tr' + (x === cm ? ' class="vx-on"' : '') + '><th>' + LORDS[x.lord] + (x === cm ? ' · الآن' : '') + '</th><td>' + dt(x.s) + '</td><td>' + dt(x.e) + '</td></tr>'; })) + '</section>';
    h += '<section class="eam-card vx"><h4>داخل فترة ' + LORDS[cm.lord] + ' (أنتر داشا)</h4>' + table(['الفترة الصغرى', 'من', 'إلى'], antars(cm).map(function (x) { return '<tr' + (x === ca ? ' class="vx-on"' : '') + '><th>' + LORDS[x.lord] + (x === ca ? ' · الآن' : '') + '</th><td>' + dt(x.s) + '</td><td>' + dt(x.e) + '</td></tr>'; })) + '</section>';
    h += '<p class="eam-note">الحسابات على نظام لاهيري وبيوت البرج الكامل. هذه قراءة للتأمل وتختلف من مدرسة لأخرى، وليست حكمًا نهائيًا.</p>';
    var box = document.createElement('div'); box.className = 'vx-wrap'; box.innerHTML = h;
    var host = result.querySelector('.eam-copy-anchor') || result; host.insertBefore(box, result.querySelector('.aq-copy-map-btn'));
    var top = document.createElement('div'); top.className = 'vx-wrap vx-top'; top.innerHTML = '<section class="eam-card vx vc-card" id="vx-vargas"></section>';
    var head = result.querySelector('.eam-result-head'); if (head && head.parentNode) head.parentNode.insertBefore(top, head.nextSibling); else result.insertBefore(top, result.firstChild);
    if (window.AqVedicChart) window.AqVedicChart.mount(top.querySelector('#vx-vargas'), ch, natal);
    if (window.AqeeqGender) window.AqeeqGender.apply(box, natal && natal.gender);
  }
  window.AqVedic = { T: { NK: NK, LT: LT, HT: HT, SS: SS, LORDS: LORDS, SG: SG }, render: render, div: div, dashas: dashas, antars: antars, current: cur };
})();

;
/* assets/js/vedic-chart.js */
/* المخطط الهندي الشمالي (Diamond Chart) بـ SVG + مبدّل التقسيمات D1/D2/D7/D9/D10/D12/D60.
   يقرأ الخريطة النجمية (لاهيري) ويستخدم AqVedic.div لحساب البرج في كل تقسيم. */
(function () {
  'use strict';
  var SG = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var GOLD = '#C5A059', WINE = '#5A1828', CREAM = '#F7F3EB';
  /* الكواكب: المفتاح، الاسم، الاختصار المعروض داخل المخطط */
  var PL = [['sun', 'الشمس', 'شم'], ['moon', 'القمر', 'قم'], ['mars', 'المريخ', 'مر'], ['mercury', 'عطارد', 'عط'], ['jupiter', 'المشتري', 'مش'], ['venus', 'الزهرة', 'زه'], ['saturn', 'زحل', 'زح'], ['node', 'راهو', 'را'], ['ketu', 'كيتو', 'كي']];
  var VARGAS = [
    ['moon', 'خريطة القمر', 'العقل', 'نفس برجك الفيدي لكن البيوت تُعدّ من القمر: تُظهر مشاعرك وردود فعلك وما يهدّئك.', 'moon'],
    ['sun', 'خريطة الشمس', 'الروح', 'البيوت تُعدّ من الشمس: تُظهر جوهرك وحضورك وما تحتاجه لتشعر بقيمتك.', 'sun'],
    [1, 'D1', 'الميلاد', 'الخريطة الأم: الجسد والشخصية والمسار العام للحياة.', null],
    [2, 'D2', 'المال', 'علاقتك بالمال: ما تجمعه بجهدك وما يأتيك بالدعم.', 'jupiter'],
    [3, 'D3', 'الإخوة', 'علاقتك بإخوتك وبشجاعتك ومبادراتك ومهاراتك العملية.', 'mars'],
    [4, 'D4', 'البيت', 'السكن والعقار وما يمنحك الشعور بالأمان والاستقرار.', 'moon'],
    [5, 'D5', 'النفوذ', 'مكانتك وتأثيرك بين الناس وما تحصل عليه من احترام.', 'sun'],
    [6, 'D6', 'الضغوط', 'ما يرهقك ويشدّ أعصابك في الحياة اليومية وكيف تتعامل معه.', 'mars'],
    [7, 'D7', 'الأبناء', 'علاقتك بالأبناء والإبداع وما تتركه بعدك.', 'jupiter'],
    [8, 'D8', 'التحولات', 'المفاجآت وما يتغير في حياتك دفعة واحدة وكيف تمرّ منه.', 'saturn'],
    [9, 'D9', 'الزواج', 'نضج العلاقات وطبيعة الشريك وما تجنيه في النصف الثاني من العمر. تُقرأ دائماً مع D1.', 'venus'],
    [10, 'D10', 'المهنة', 'طريقك المهني وما تُعرف به وكيف تتعامل مع النجاح.', 'saturn'],
    [11, 'D11', 'المكاسب', 'ما يأتيك دون ترتيب مسبق وما يحميك من صراعاتك. هذه الخريطة ليست من الست عشرة الكلاسيكية عند باراشارا، وتختلف قاعدة حسابها بين المدارس، فاقرأها كعدسة إضافية وليست حكمًا.', 'jupiter'],
    [12, 'D12', 'الوالدان', 'ما ورثته من والديك وأصلك وأثر البيت الأول.', 'sun'],
    [16, 'D16', 'الراحة', 'المركبات والرفاهية والمتع المادية في حياتك.', 'venus'],
    [20, 'D20', 'الروح', 'نموك الروحي وعلاقتك بالعبادة والتأمل والصفاء الداخلي.', 'jupiter'],
    [24, 'D24', 'التعليم', 'الدراسة والمعرفة والشهادات وكيف تتعلم وتنجح فيها.', 'mercury'],
    [27, 'D27', 'القوة', 'قوتك وتحملك وما يحتاج منك رعاية في طاقتك الجسدية.', 'mars'],
    [30, 'D30', 'التحديات', 'الضغوط والاختبارات الخفية وما يتعبك دون أن يظهر للناس.', 'saturn'],
    [40, 'D40', 'خط الأم', 'ما انتقل إليك من جهة الأم من إرث نفسي وعائلي.', 'moon'],
    [45, 'D45', 'خط الأب', 'ما انتقل إليك من جهة الأب من إرث وأخلاق وقيم.', 'sun'],
    [60, 'D60', 'الكارما', 'الرصيد الأعمق الذي تحمله معك. يتغير كل دقيقتين تقريباً في الطالع فلا يُعتمد عليه إلا مع وقت ميلاد دقيق.', 'moon']
  ];
  var ORIG = { moon: 'Chandra', sun: 'Surya', 1: 'Rasi', 2: 'Hora', 5: 'Panchamsa', 6: 'Shashthamsa', 8: 'Ashtamsa', 11: 'Rudramsa', 3: 'Drekkana', 4: 'Chaturthamsa', 7: 'Saptamsa', 9: 'Navamsa', 10: 'Dasamsa', 12: 'Dwadasamsa', 16: 'Shodasamsa', 20: 'Vimsamsa', 24: 'Siddhamsa', 27: 'Bhamsa', 30: 'Trimsamsa', 40: 'Khavedamsa', 45: 'Akshavedamsa', 60: 'Shashtiamsa' };
  /* الرسم الجنوبي: البروج ثابتة في أماكنها (الحمل ثاني خلية في الصف الأول) ويمضي الترتيب مع عقارب الساعة */
  var SOUTH = { 11: [0, 0], 0: [1, 0], 1: [2, 0], 2: [3, 0], 3: [3, 1], 4: [3, 2], 5: [3, 3], 6: [2, 3], 7: [1, 3], 8: [0, 3], 9: [0, 2], 10: [0, 1] };
  var SPEC = [5, 6, 8, 11];
  var CENTERS = [[200, 92], [100, 40], [40, 100], [92, 200], [40, 300], [100, 360], [200, 308], [300, 360], [360, 300], [308, 200], [360, 100], [300, 40]];
  var NUMPOS = [[200, 150], [100, 20], [18, 98], [150, 200], [18, 306], [100, 392], [200, 252], [300, 392], [382, 306], [250, 200], [382, 98], [300, 20]];
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(x) { return ((x % 360) + 360) % 360; }
  function bodyLon(ch, key) {
    var list = ch.bodies || [], i, k;
    if (key === 'ketu') { var n = bodyLon(ch, 'node'); return n == null ? null : norm(n + 180); }
    for (i = 0; i < list.length; i++) { k = String(list[i].key).toLowerCase(); if (k === key) return list[i].lon; }
    if (key === 'node') for (i = 0; i < list.length; i++) if (String(list[i].key).toLowerCase() === 'truenode') return list[i].lon;
    return null;
  }
  function retroOf(ch, key) {
    var list = ch.bodies || [];
    for (var i = 0; i < list.length; i++) if (String(list[i].key).toLowerCase() === key) return !!list[i].retro;
    return key === 'node' || key === 'ketu';
  }
  /* يبني خريطة التقسيم n: برج الطالع (أو القمر عند غياب الوقت) وكل كوكب مع برجه وبيته */
  function build(ch, n) {
    var D = window.AqVedic.div, known = !!ch.known, lagna, basis = known ? 'asc' : 'moon';
    var moonLon = bodyLon(ch, 'moon');
    if (n === 'moon' || n === 'sun') { /* خريطة القمر/الشمس: نفس أبراج D1 والطالع هو برج القمر/الشمس */
      var bl = bodyLon(ch, n), sg0 = bl == null ? 0 : D(bl, 1); lagna = sg0; basis = n;
      var its = [];
      PL.forEach(function (p) { var lon = bodyLon(ch, p[0]); if (lon == null) return; var sg = D(lon, 1); its.push({ lon: lon, key: p[0], name: p[1], ab: p[2], sign: sg, house: (sg - lagna + 12) % 12, retro: p[0] !== 'node' && p[0] !== 'ketu' && retroOf(ch, p[0]) }); });
      return { n: n, lagna: lagna, basis: basis, items: its };
    }
    lagna = known ? D(ch.asc, n) : (moonLon == null ? 0 : D(moonLon, n));
    var items = [];
    PL.forEach(function (p) {
      var lon = bodyLon(ch, p[0]); if (lon == null) return;
      var sg = D(lon, n);
      items.push({ lon: lon, key: p[0], name: p[1], ab: p[2], sign: sg, house: (sg - lagna + 12) % 12, retro: p[0] !== 'node' && p[0] !== 'ketu' && retroOf(ch, p[0]) });
    });
    return { n: n, lagna: lagna, basis: basis, items: items };
  }
  function lagLbl(m) { return m.n === 'moon' || m.n === 'sun' ? 'ط' : m.basis === 'asc' ? 'ط' : 'ط*'; }
  function lines(arr) {
    var out = [], cur = [];
    arr.forEach(function (a) { cur.push(a); if (cur.length === 2) { out.push(cur); cur = []; } });
    if (cur.length) out.push(cur);
    return out;
  }
  /* لون كل كوكب: نور أخضر، ظل أحمر، شمس ذهبية، الطالع عنابي */
  var TONE = { sun: 'g', moon: 'n', mercury: 'n', venus: 'n', jupiter: 'n', mars: 's', saturn: 's', node: 's', ketu: 's', lagna: 'l' };
  var TCOL = { g: ['#F8EBCB', '#C5A059', '#6E5319'], n: ['#E4F0E1', '#7FA67D', '#2F5A32'], s: ['#F8E2DE', '#C9786E', '#8E2A22'], l: ['#6A2038', '#C5A059', '#FFF3D6'] };
  function pill(x, y, w, label, tone, retro) {
    var c = TCOL[tone] || TCOL.g;
    return '<g><rect x="' + (x - w / 2) + '" y="' + (y - 10) + '" width="' + w + '" height="20" rx="10" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="1.3"/>' +
      '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" font-size="12.5" font-weight="800" fill="' + c[2] + '">' + esc(label) + (retro ? '<tspan font-size="9" dy="-4">℞</tspan>' : '') + '</text></g>';
  }
  /* البيوت ثابتة في الرسم الشمالي، والألوان تتبع عنصر البرج لا ترتيب البيت. */
  var GLYPHS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  var FIELDS = [
    [[200,0],[100,100],[200,200],[300,100]], [[0,0],[200,0],[100,100]],
    [[0,0],[100,100],[0,200]], [[0,200],[100,100],[200,200],[100,300]],
    [[0,200],[100,300],[0,400]], [[0,400],[100,300],[200,400]],
    [[200,200],[100,300],[200,400],[300,300]], [[200,400],[300,300],[400,400]],
    [[400,400],[300,300],[400,200]], [[200,200],[300,100],[400,200],[300,300]],
    [[400,0],[400,200],[300,100]], [[200,0],[400,0],[300,100]]
  ];
  var HEADS = [[200,53],[100,19],[34,88],[100,164],[34,288],[100,341],
    [200,269],[300,341],[366,288],[300,164],[366,88],[300,19]];
  var INKS = ['#784638','#796039','#6A435A','#4C6267'];
  var FILLS = ['#E8CFC1','#EBDFC3','#E5D6DE','#D5E0DD'];
  function inside(poly,x,y) {
    var sign=0;
    for(var j=0;j<poly.length;j++) {var a=poly[j],b=poly[(j+1)%poly.length],v=(b[0]-a[0])*(y-a[1])-(b[1]-a[1])*(x-a[0]);if(Math.abs(v)<.01)continue;var z=v>0?1:-1;if(sign&&z!==sign)return false;sign=z;}
    return true;
  }
  /* تتسع حتى لتجمّع الكواكب التسعة، بلا إخفاء أو عبور لحدود البيوت. */
  function labelAt(i,count) {
    var h=HEADS[i].slice(),compact=count>4&&i%3!==0;
    if(compact&&(i===5||i===7))h[1]=389;
    return {x:h[0],y:h[1],compact:compact};
  }
  function placement(i,count) {
    var poly=FIELDS[i],hd=labelAt(i,count),target=CENTERS[i],found=[],w=32,ht=19;
    for(var attempt=0;attempt<8;attempt++) {
      w=32-attempt*2;ht=19-attempt;found=[];var slots=[];
      for(var y=10+ht/2;y<397-ht/2;y+=ht+2) {
        var xs=[];
        for(var x=2+w/2;x<398-w/2;x++) {
          if(![[x-w/2-1,y-ht/2-1],[x+w/2+1,y-ht/2-1],[x+w/2+1,y+ht/2+1],[x-w/2-1,y+ht/2+1]].every(function(p){return inside(poly,p[0],p[1]);}))continue;
          xs.push(x);
        }
        if(!xs.length)continue;
        var n=Math.floor((xs[xs.length-1]-xs[0])/(w+3))+1,mid=(xs[0]+xs[xs.length-1])/2;
        for(var k=0;k<n;k++) {
          var px=mid+(k-(n-1)/2)*(w+3);
          if(Math.abs(px-hd.x)<w/2+35&&y+ht/2>hd.y-12&&y-ht/2<hd.y+(hd.compact?4:25))continue;
          if(Math.hypot(px-200,y-200)<31+w/2)continue;
          slots.push([px,y]);
        }
      }
      slots.sort(function(a,b){return Math.hypot(a[0]-target[0],a[1]-target[1]-15)-Math.hypot(b[0]-target[0],b[1]-target[1]-15);});
      found=slots.slice(0,count).sort(function(a,b){return a[1]-b[1]||a[0]-b[0];});
      if(found.length===count)break;
    }
    return {points:found,w:w,h:ht};
  }
  function medallion(label,radius) {
    var year=/^\d{4}$/.test(String(label)),arabic=/[\u0600-\u06ff]/.test(String(label)),size=year?19:arabic?13:20;
    return '<g class="vc-medallion" transform="translate(200 200) scale('+(radius/30)+')"><circle cy="1.6" r="30" fill="#A88A54" opacity=".12"/><circle r="30" fill="#FCF7EB" stroke="#BA9D69" stroke-width="1"/><circle r="26.5" fill="none" stroke="#E6D8BA" stroke-width=".6"/><text class="vc-medallion-label" x="0" y="-5" text-anchor="middle" dominant-baseline="middle" font-family="'+(year?'Amiri,serif':'inherit')+'" font-size="'+size+'" font-weight="'+(year?'700':'600')+'" fill="'+WINE+'">'+esc(label)+'</text><path d="M-10 6H10" stroke="#D9C39B" stroke-width=".65"/><text class="vc-medallion-brand" x="0" y="18" text-anchor="middle" font-family="Amiri,serif" font-size="11" fill="#977D57" opacity=".85">عقيق</text></g>';
  }
  function svg(map, title, centerLabel) {
    var label=centerLabel || (map.n==='moon'?'القمر':map.n==='sun'?'الشمس':'D'+map.n);
    var h='<svg class="vc-svg vc-north" viewBox="0 0 424 424" role="img" aria-label="'+esc(title)+'" xmlns="http://www.w3.org/2000/svg">';
    h+='<title>'+esc(title)+'</title><desc>البيت الأول أعلى المعين، ثم البيوت عكس عقارب الساعة. كل خانة تحمل رقم البرج ورمزه واسمه، والألوان حسب عنصر البرج.</desc>';
    h+='<rect x="1" y="1" width="422" height="422" rx="17" fill="#F8F2E7" stroke="#D8C39B"/><rect x="7" y="7" width="410" height="410" rx="12" fill="none" stroke="#E2D3B8"/>';
    h+='<g transform="translate(12 12)">';
    for(var i=0;i<12;i++) {
      var sg=(map.lagna+i)%12,hd=HEADS[i],el=sg%4;
      h+='<g class="vc-house" data-house="'+(i+1)+'" data-sign="'+sg+'"><title>البيت '+(i+1)+' · '+SG[sg]+'</title><polygon points="'+FIELDS[i].map(function(p){return p.join(',');}).join(' ')+'" fill="'+FILLS[el]+'" fill-opacity="'+(i%3===0?'.9':'.38')+'"/>';
      var here=map.items.filter(function(x){return x.house===i;}).map(function(x){return {t:x.ab,name:x.name,tone:TONE[x.key]||'g',r:x.retro,key:x.key};});
      if(i===0)here.unshift({t:lagLbl(map),name:'الطالع',tone:'l',r:false,key:'lagna'});
      var hd0=labelAt(i,here.length);
      if(hd0.compact) {
        h+='<g class="vc-sign-label" fill="'+INKS[el]+'" text-anchor="middle"><text x="'+(hd0.x-30)+'" y="'+hd0.y+'" font-size="10">'+(sg+1)+'</text><text x="'+(hd0.x-15)+'" y="'+hd0.y+'" font-family="Georgia, serif" font-size="13">'+GLYPHS[sg]+'&#xfe0e;</text><text x="'+(hd0.x+13)+'" y="'+hd0.y+'" font-size="10" direction="rtl">'+SG[sg]+'</text></g>';
      } else {
      h+='<g class="vc-sign-label" fill="'+INKS[el]+'" text-anchor="middle"><text x="'+(hd[0]-11)+'" y="'+hd[1]+'" font-size="15" font-weight="600">'+(sg+1)+'</text><text x="'+(hd[0]+12)+'" y="'+hd[1]+'" font-family="Georgia, serif" font-size="19">'+GLYPHS[sg]+'&#xfe0e;</text><text x="'+hd[0]+'" y="'+(hd[1]+19)+'" font-size="13" font-weight="600" direction="rtl">'+SG[sg]+'</text></g>';
      }
      var layout=placement(i,here.length);
      here.forEach(function(it,j){var p=layout.points[j];if(!p)return;var col=TCOL[it.tone],fs=Math.min(12,layout.h*.64);
        h+='<g class="vc-body" data-planet="'+esc(it.key)+'"><title>'+esc(it.name)+(it.r?' · متراجع':'')+'</title><rect x="'+(p[0]-layout.w/2)+'" y="'+(p[1]-layout.h/2)+'" width="'+layout.w+'" height="'+layout.h+'" rx="'+layout.h/2+'" fill="'+(it.tone==='l'?WINE:'#FFFCF5')+'" fill-opacity=".95" stroke="'+(it.tone==='l'?GOLD:col[1])+'" stroke-width=".8"/><text x="'+p[0]+'" y="'+p[1]+'" text-anchor="middle" dominant-baseline="central" font-size="'+fs+'" font-weight="700" fill="'+(it.tone==='l'?'#FFF1D6':col[2])+'">'+esc(it.t)+(it.r?'<tspan font-size="8" baseline-shift="super">℞</tspan>':'')+'</text></g>';
      });
      h+='</g>';
    }
    h+='<g fill="none" stroke="#9B805B" stroke-width="1.05" stroke-linejoin="round"><path d="M0 0H400V400H0ZM0 0L400 400M400 0L0 400M200 0L400 200L200 400L0 200Z"/></g>';
    [[200,0],[0,200],[200,400],[400,200]].forEach(function(p){h+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4.5" fill="#F8F2E7" stroke="#9B805B"/><circle cx="'+p[0]+'" cy="'+p[1]+'" r="1.5" fill="'+WINE+'"/>';});
    h+=medallion(label,29);
    return h+'</g></svg>';
  }
  function svgSouth(map, title) {
    var label=map.n==='moon'?'القمر':map.n==='sun'?'الشمس':'D'+map.n;
    var h='<svg class="vc-svg vc-south" viewBox="0 0 424 424" role="img" aria-label="'+esc(title)+'" xmlns="http://www.w3.org/2000/svg"><title>'+esc(title)+'</title><desc>الأبراج ثابتة في الرسم الجنوبي. الحمل ثاني خانة في الصف الأعلى، ثم مع عقارب الساعة. الخط المائل يحدد الطالع.</desc>';
    h+='<rect x="1" y="1" width="422" height="422" rx="17" fill="#F8F2E7" stroke="#D8C39B"/><rect x="7" y="7" width="410" height="410" rx="12" fill="none" stroke="#E2D3B8"/><g transform="translate(12 12)">';
    h+='<rect x="100" y="100" width="200" height="200" fill="#FCF7EB"/>';
    for(var sg=0;sg<12;sg++) {
      var pos=SOUTH[sg],x=pos[0]*100,y=pos[1]*100,cx=x+50,house=(sg-map.lagna+12)%12,el=sg%4;
      h+='<g class="vc-house" data-house="'+(house+1)+'" data-sign="'+sg+'"><title>البيت '+(house+1)+' · '+SG[sg]+'</title><rect x="'+x+'" y="'+y+'" width="100" height="100" fill="'+FILLS[el]+'" fill-opacity=".55"/>';
      h+='<g class="vc-sign-label" text-anchor="middle" fill="'+INKS[el]+'"><text x="'+(cx-12)+'" y="'+(y+19)+'" font-size="14" font-weight="600">'+(sg+1)+'</text><text x="'+(cx+12)+'" y="'+(y+19)+'" font-size="19" font-family="Georgia,serif">'+GLYPHS[sg]+'&#xfe0e;</text><text x="'+cx+'" y="'+(y+38)+'" font-size="13" font-weight="600" direction="rtl">'+SG[sg]+'</text></g>';
      var here=map.items.filter(function(it){return it.sign===sg;}).map(function(it){return {t:it.ab,key:it.key,name:it.name,tone:TONE[it.key]||'g',r:it.retro};});
      if(house===0){here.unshift({t:lagLbl(map),key:'lagna',name:'الطالع',tone:'l'});h+='<path d="M'+x+' '+(y+20)+'L'+(x+20)+' '+y+'" stroke="'+WINE+'" stroke-width="1.6"/>';}
      var cols=here.length>6?3:here.length>2?2:1,rows=Math.ceil(here.length/cols),ht=rows>2?12:19,gy=ht+3,w=cols===3?27:34;
      here.forEach(function(it,j){var row=Math.floor(j/cols),col=j%cols,n=Math.min(cols,here.length-row*cols),px=cx+(col-(n-1)/2)*(w+3),py=y+52+row*gy,c=TCOL[it.tone];
        h+='<g class="vc-body" data-planet="'+esc(it.key)+'"><title>'+esc(it.name)+(it.r?' · متراجع':'')+'</title><rect x="'+(px-w/2)+'" y="'+(py-ht/2)+'" width="'+w+'" height="'+ht+'" rx="'+ht/2+'" fill="'+(it.tone==='l'?WINE:'#FFFCF5')+'" stroke="'+(it.tone==='l'?GOLD:c[1])+'" stroke-width=".8"/><text x="'+px+'" y="'+py+'" text-anchor="middle" dominant-baseline="central" font-size="'+(rows>2?9:12)+'" font-weight="700" fill="'+(it.tone==='l'?'#FFF1D6':c[2])+'">'+esc(it.t)+(it.r?'<tspan font-size="7" baseline-shift="super">℞</tspan>':'')+'</text></g>';
      });h+='</g>';
    }
    h+='<g fill="none" stroke="#9B805B" stroke-width="1.05"><path d="M0 0H400V400H0ZM100 0V400M300 0V400M200 0V100M200 300V400M0 100H400M0 300H400M0 200H100M300 200H400"/></g>';
    [[100,100],[300,100],[300,300],[100,300]].forEach(function(p){h+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3" fill="#F8F2E7" stroke="#9B805B"/>';});
    h+=medallion(label,39);
    return h+'</g></svg>';
  }
  /* رموز وضع الخبير الصامتة: تظهر للأدمن بعد فتح القفل فقط */
  function codesFor(map, x) {
    var c = [], h = x.house + 1, mal = { mars: 1, saturn: 1, node: 1, ketu: 1 }[x.key];
    if ((map.n === 6 && (h === 6 || h === 8 || h === 12)) || (map.n === 1 && h === 6)) c.push('M-06');
    if (map.n === 30 && (h === 6 || h === 8 || h === 12 || (mal && (h === 1 || h === 4 || h === 7 || h === 10)))) c.push('K-30');
    if (h === 8) c.push('T-08');
    if (h === 12 || (map.n === 2 && h === 6)) c.push('D-12');
    return c;
  }
  var EXA = { sun: 0, moon: 1, mars: 9, mercury: 5, jupiter: 3, venus: 11, saturn: 6, node: 1, ketu: 7 };
  var OWN = { sun: [4], moon: [3], mars: [0, 7], mercury: [2, 5], jupiter: [8, 11], venus: [1, 6], saturn: [9, 10] };
  var COMB = { moon: 12, mars: 17, mercury: 14, jupiter: 11, venus: 10, saturn: 15 };
  var SIGNLORD = ['mars', 'venus', 'mercury', 'moon', 'sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'];
  var ASP = { mars: [4, 7, 8], jupiter: [5, 7, 9], saturn: [3, 7, 10], node: [5, 7, 9], ketu: [5, 7, 9] };
  function dignity(x) {
    if (EXA[x.key] === x.sign) return ['ex', 'مرتفع'];
    if (EXA[x.key] != null && (EXA[x.key] + 6) % 12 === x.sign) return ['db', 'هابط'];
    if (OWN[x.key] && OWN[x.key].indexOf(x.sign) >= 0) return ['ow', 'في برجه'];
    return null;
  }
  function degTxt(lon) { var d = ((lon % 30) + 30) % 30, g = Math.floor(d), m = Math.floor((d - g) * 60); return g + '°' + (m < 10 ? '0' : '') + m + '′'; }
  function detail(map, x) {
    var parts = [], dg = dignity(x), T = window.AqVedic && window.AqVedic.T, d1 = map.n === 1 || map.n === 'moon' || map.n === 'sun';
    if (d1 && x.lon != null) {
      parts.push('<i class="vc-dg">' + degTxt(x.lon) + '</i>');
      var u = 360 / 27, ni = Math.floor(x.lon / u) % 27, pd = Math.floor((x.lon % u) / (u / 4)) + 1;
      if (T && T.NK && T.NK[ni]) parts.push('<i class="vc-nk">' + T.NK[ni][0] + ' · ' + pd + '</i>');
    }
    if (d1 && x.lon != null && COMB[x.key]) {
      var su = map.items.filter(function (y) { return y.key === 'sun'; })[0];
      if (su && su.lon != null) { var df = Math.abs(((x.lon - su.lon + 540) % 360) - 180); df = 180 - df; var orb = COMB[x.key] - (x.retro && (x.key === 'mercury' || x.key === 'venus') ? 2 : 0); if (df <= orb) parts.push('<i class="vc-dn vc-dn-db">محترق</i>'); }
    }
    if (dg) parts.push('<i class="vc-dn vc-dn-' + dg[0] + '">' + dg[1] + '</i>');
    return parts.length ? '<span class="vc-dt">' + parts.join('') + '</span>' : '';
  }
  function houseRows(map) {
    return map.items.map(function (x) {
      var tn = TONE[x.key] || 'g';
      return '<li class="vc-r vc-t-' + tn + '"><span class="vc-ab">' + esc(x.ab) + '</span><b>' + esc(x.name) + (x.retro ? ' ℞' : '') + '</b><span class="vc-sg">' + SG[x.sign] + ' · البيت ' + (x.house + 1) + '</span>' + detail(map, x) + (window.AqVedicExpert && window.AqVedicExpert.on ? '<span class="vc-codes">' + codesFor(map, x).map(function (k) { return '<em class="vc-code">[' + k + ']</em>'; }).join('') + '</span>' : '') + '</li>';
    }).join('');
  }
  function extras(map) {
    var by = {}, SGn = window.AqVedic && window.AqVedic.T ? window.AqVedic.T.SG : [];
    map.items.forEach(function (x) { by[x.key] = x; });
    var lords = '';
    for (var h = 0; h < 12; h++) {
      var sg = (map.lagna + h) % 12, lk = SIGNLORD[sg], lp = by[lk];
      lords += '<li><b>البيت ' + (h + 1) + '</b><span>' + SG[sg] + '</span><em>' + (lp ? esc(lp.name) + ' في البيت ' + (lp.house + 1) : '') + '</em></li>';
    }
    var asp = map.items.map(function (x) {
      var hs = (ASP[x.key] || [7]).map(function (n) { return (x.house + n - 1) % 12; });
      var tg = map.items.filter(function (y) { return y.key !== x.key && hs.indexOf(y.house) >= 0; }).map(function (y) { return esc(y.name); });
      return '<li><b>' + esc(x.name) + '</b><span>ينظر إلى البيوت ' + hs.map(function (v) { return v + 1; }).sort(function (a, b) { return a - b; }).join('، ') + '</span><em>' + (tg.length ? tg.join('، ') : 'لا كواكب هناك') + '</em></li>';
    }).join('');
    return '<details class="vc-ext"><summary>حكام البيوت</summary><ul class="vc-xl">' + lords + '</ul></details>' +
      '<details class="vc-ext"><summary>النظرات (غراها دريشتي)</summary><ul class="vc-xl">' + asp + '</ul></details>';
  }
  function mount(host, ch, natal, only) {
    if (!host || !window.AqVedic) return;
    var cur = only === undefined ? 1 : only, style = 'n';
    try { style = localStorage.getItem('aq-vedic-style') === 's' ? 's' : 'n'; } catch (e) {}
    function draw() {
      var v = VARGAS.filter(function (x) { return x[0] === cur; })[0], map = build(ch, cur), title = 'مخطط ' + v[1] + ' · ' + v[2];
      var sig = v[4] ? map.items.filter(function (x) { return x.key === v[4]; })[0] : null;
      var chipOf = function (x) { return '<button type="button" class="vc-chip' + (x[0] === cur ? ' on' : '') + '" data-n="' + x[0] + '" aria-pressed="' + (x[0] === cur) + '"><b>' + String(x[1]).replace('خريطة ', '') + '</b><span>' + x[2] + '</span><small>' + (ORIG[x[0]] || '') + '</small></button>'; };
      var GR = [['الأساس', ['1', 'moon', 'sun']], ['الحياة اليومية', ['2', '3', '4', '5', '6', '7']], ['المسار والعمق', ['8', '9', '10', '11', '12']], ['التخصص الدقيق', ['16', '20', '24', '27', '30', '40', '45', '60']]];
      var chipsAll = GR.map(function (g) {
        return '<h5 class="vc-sub">' + g[0] + '</h5><div class="vc-grp' + (g[1].length === 3 ? ' vc-grp3' : '') + '" role="group" aria-label="' + g[0] + '">' + g[1].map(function (k) { var x = VARGAS.filter(function (y) { return String(y[0]) === k; })[0]; return x ? chipOf(x) : ''; }).join('') + '</div>';
      }).join('');
      var note = (cur === 'moon' || cur === 'sun') ? 'البيت الأول هنا هو برج ' + (cur === 'moon' ? 'القمر' : 'الشمس') + ' (' + SG[map.lagna] + ').' : map.basis === 'asc' ? 'الطالع في ' + SG[map.lagna] + '.' : 'وقت الميلاد غير معروف، فالمخطط يبدأ من برج القمر (' + SG[map.lagna] + ') بدل الطالع.';
      host.innerHTML = (only === undefined ? '<h4>المخططات الفيدية · التقسيمات</h4>' + chipsAll : '') +
        '<div class="vc-caption"><span>' + esc(cur === 'moon' || cur === 'sun' ? ORIG[cur] : v[1]) + '</span>' + (cur === 'moon' || cur === 'sun' ? '' : '<small>' + esc(ORIG[cur] || '') + '</small>') + '</div><p class="vc-intro">' + esc(v[3]) + '</p>' +
        '<div class="vc-styles" role="group" aria-label="شكل الرسم"><button type="button" class="vc-st' + (style === 'n' ? ' on' : '') + '" data-s="n">شمالي</button><button type="button" class="vc-st' + (style === 's' ? ' on' : '') + '" data-s="s">جنوبي</button></div>' +
        '<div class="vc-chartwrap">' + (style === 's' ? svgSouth(map, title) : svg(map, title)) + '</div>' +
        '<p class="vc-key"><i class="vc-t-n">نور</i><i class="vc-t-s">ظل</i><i class="vc-t-g">الشمس</i><i class="vc-t-l">الطالع</i></p>' + '<details class="vc-guide"><summary>دليل قراءة الخريطة</summary>' + '<p class="vc-note">' + esc(note) + (style === 's' ? ' في الرسم الجنوبي كل برج له مكان ثابت (الحمل ثاني خانة في الصف الأعلى) ويمضي الترتيب مع عقارب الساعة، والخط المائل يعلّم خانة الطالع. ℞ يعني راجع.' : ' الأرقام داخل الخانات أرقام البروج (1 الحمل ... 12 الحوت)، والبيت 1 في الأعلى ويمضي الترتيب عكس عقارب الساعة. تدرجات الخانات تميّز عناصر الأبراج وليست حكمًا على قوة الكواكب. ℞ يعني راجع.') + '</p>' + '</details><ul class="vc-rows">' + houseRows(map) + '</ul>' + extras(map) +
        (sig ? '<p class="vc-sig">' + esc(sig.name) + ' الدال هنا في ' + SG[sig.sign] + ' (البيت ' + (sig.house + 1) + ').</p>' : '');
      host.querySelectorAll('.vc-st').forEach(function (b) { b.addEventListener('click', function () { style = b.dataset.s; try { localStorage.setItem('aq-vedic-style', style); } catch (e) {} draw(); }); });
      host.querySelectorAll('.vc-chip').forEach(function (b) { b.addEventListener('click', function () { cur = isNaN(+b.dataset.n) ? b.dataset.n : +b.dataset.n; draw(); var on = host.querySelector('.vc-chip.on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest', inline: 'center' }); }); });
    }
    host.__draw = draw;
    draw();
  }
  /* عرض مكبّر متاح بلوحة المفاتيح واللمس، بلا تغيير في بيانات الرسم. */
  var viewer=null,viewerOrigin=null,viewerScale=1;
  function ensureViewer() {
    if(viewer)return;
    viewer=document.createElement('dialog');viewer.className='vc-viewer';viewer.setAttribute('aria-labelledby','vc-viewer-title');
    viewer.innerHTML='<div class="vc-viewer-head"><h2 id="vc-viewer-title">الخريطة المكبّرة</h2><button type="button" data-vc-close aria-label="إغلاق الخريطة المكبّرة">إغلاق</button></div><div class="vc-viewer-tools"><button type="button" data-vc-zoom="-1" aria-label="تصغير">−</button><output aria-live="polite">100%</output><button type="button" data-vc-zoom="1" aria-label="تكبير">+</button><button type="button" data-vc-fit>ملاءمة الشاشة</button></div><p class="vc-viewer-hint">كبّر الخريطة ثم مرّر داخلها لقراءة التفاصيل.</p><div class="vc-viewer-pan" tabindex="0" aria-label="مساحة الخريطة، مرّر لرؤية التفاصيل"><div class="vc-viewer-art"></div></div>';
    document.body.appendChild(viewer);
    viewer.addEventListener('click',function(e){
      if(e.target.closest('[data-vc-close]')||e.target===viewer){viewer.close();return;}
      var z=e.target.closest('[data-vc-zoom]');
      if(z){viewerScale=Math.max(1,Math.min(3,viewerScale+Number(z.dataset.vcZoom)*.5));resizeViewer();}
      if(e.target.closest('[data-vc-fit]')){viewerScale=1;resizeViewer();}
    });
    viewer.addEventListener('close',function(){document.documentElement.classList.remove('vc-viewer-open');if(viewerOrigin&&viewerOrigin.isConnected)viewerOrigin.focus({preventScroll:true});viewer.querySelector('.vc-viewer-art').replaceChildren();});
  }
  function resizeViewer(){
    var pan=viewer.querySelector('.vc-viewer-pan'),art=viewer.querySelector('.vc-viewer-art');
    art.style.width=Math.round(Math.min(820,pan.clientWidth,pan.clientHeight)*viewerScale)+'px';
    viewer.querySelector('output').textContent=Math.round(viewerScale*100)+'%';
    viewer.querySelector('[data-vc-zoom="-1"]').disabled=viewerScale===1;
    viewer.querySelector('[data-vc-zoom="1"]').disabled=viewerScale===3;
  }
  function enhanceCharts(){
    document.querySelectorAll('#astro-maps .vc-chartwrap,#astro-maps .vyr-chart').forEach(function(w){
      if(w.querySelector('.vc-expand'))return;
      var b=document.createElement('button');b.type='button';b.className='vc-expand';b.textContent='تكبير الخريطة';b.setAttribute('aria-haspopup','dialog');w.appendChild(b);
    });
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('.vc-expand');if(!b)return;
    var chart=b.parentElement.querySelector('.vc-svg');if(!chart)return;
    ensureViewer();viewerOrigin=b;viewerScale=1;viewer.querySelector('.vc-viewer-art').replaceChildren(chart.cloneNode(true));
    viewer.querySelector('h2').textContent=chart.getAttribute('aria-label')||'الخريطة المكبّرة';
    viewer.showModal();document.documentElement.classList.add('vc-viewer-open');resizeViewer();viewer.querySelector('[data-vc-close]').focus();
  });
  new MutationObserver(enhanceCharts).observe(document.getElementById('astro-maps')||document.body,{childList:true,subtree:true});
  window.addEventListener('resize',function(){if(viewer&&viewer.open)resizeViewer();});
  enhanceCharts();
  window.AqVedicChart = { mount: mount, build: build, svg: svg, VARGAS: VARGAS, PL: PL, svgSouth: svgSouth, codesFor: codesFor };
})();

;
/* assets/js/vedic-pratyantar.js */
/* براتيانتر داشا: تقسيم كل أنتر بالنسب نفسها، دون قصّ الفترة الأولى عند الميلاد.
   المرجع: BPHS، فصل حساب الداشا 51: 1-2، http://jyotishvidya.com/ch51.htm
   طول السنة المتبع في عقيق 365.25 يومًا. عرض الثواني لا يثبت دقة وقت الميلاد. */
(function () {
  'use strict';
  var V = window.AqVedic; if (!V) return;
  function pratyantars(antar) {
    if (!antar || !Number.isInteger(antar.lord) || antar.lord < 0 || antar.lord > 8 || !Number.isFinite(antar.s) || !Number.isFinite(antar.e) || antar.e <= antar.s) return [];
    var list = V.antars(antar);
    // يمنع فجوة حسابية دون المللي ثانية عند آخر حد بسبب الجمع العشري.
    list[list.length - 1].e = antar.e;
    return list;
  }
  function active(list, ms) {
    for (var i = 0; i < list.length; i++) if (ms >= list[i].s && ms < list[i].e) return i;
    return -1;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function createCard() {
    var L = V.last, box = document.createElement('section'); box.className = 'vpd';
    if (!L) { box.textContent = 'احسب خريطتك أولًا.'; return box; }
    var moon = (L.ch.bodies || []).filter(function (b) { return b.key === 'moon'; })[0];
    var birth = L.natal && Number.isFinite(L.natal.utcMs) ? L.natal.utcMs : (L.ch.jde - 2440587.5) * 864e5;
    if (!moon || !Number.isFinite(birth)) { box.textContent = 'تعذر حساب الفترات من بيانات الميلاد.'; return box; }
    var ds = V.dashas(moon.lon, birth), names = V.T.LORDS, mi = 0, ai = 0;
    var local = 'UTC'; try { local = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { }
    var zone = local;
    box.innerHTML = '<p class="vpd-lead">الفترة الكبرى، وداخلها الصغرى، ثم الفترات الدقيقة التسع. اختر أي فترة لتتصفح توقيتها كاملًا.</p>' +
      '<div class="vpd-controls"><label>الفترة الكبرى · ماها<select class="vpd-maha" aria-label="الفترة الكبرى"></select></label><label>الفترة الصغرى · أنتر<select class="vpd-antar" aria-label="الفترة الصغرى"></select></label></div>' +
      '<div class="vpd-toolbar"><label>التوقيت<select class="vpd-zone" aria-label="توقيت عرض الفترات"><option value="' + esc(local) + '">توقيت جهازك · ' + esc(local) + '</option>' + (local === 'UTC' ? '' : '<option value="UTC">UTC · التوقيت العالمي</option>') + '</select></label><button type="button" class="vpd-now">الفترة الحالية</button></div>' +
      '<div class="vpd-out" aria-live="polite"></div>' +
      '<p class="vpd-method">الحساب: مدة الأنتر × سنوات حاكم البراتيانتر ÷ 120. تبدأ الفترات بحاكم الأنتر ثم تتبع ترتيب فيمشوتاري. السنة هنا 365.25 يومًا.</p>' +
      '<p class="vpd-note">كل فترة تبدأ عند وقت البداية وتنتهي قبل وقت النهاية مباشرة. قد تبدأ الفترة الأولى قبل ميلادك لأن الرصيد المتبقي جزء من دورة بدأت قبله. عرض الساعة والثواني دقة حسابية، وليس ضمانًا لدقة وقت الميلاد أو تنبؤًا بحدث.</p>' +
      (L.ch.known ? '' : '<p class="vpd-warning">وقت الميلاد غير معروف: هذه توقيتات تقديرية مبنية على الوقت المفترض، وقد تتغير بمعرفة ساعة الميلاد.</p>');
    var msel = box.querySelector('.vpd-maha'), asel = box.querySelector('.vpd-antar'), out = box.querySelector('.vpd-out');
    function date(ms, short) {
      var opts = { timeZone: zone, year: 'numeric', month: 'short', day: 'numeric' };
      if (!short) { opts.hour = '2-digit'; opts.minute = '2-digit'; opts.second = '2-digit'; opts.hourCycle = 'h23'; }
      return new Intl.DateTimeFormat('ar-EG', opts).format(new Date(ms));
    }
    function stamp(ms) {
      var clock = new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(new Date(ms));
      return '<time datetime="' + new Date(ms).toISOString() + '"><span>' + date(ms, true) + '</span><small dir="ltr">' + clock + '</small></time>';
    }
    function option(x, i) { return '<option value="' + i + '">' + names[x.lord] + ' · ' + date(x.s, true) + '</option>'; }
    function populate() {
      msel.innerHTML = ds.map(option).join(''); msel.value = mi;
      asel.innerHTML = V.antars(ds[mi]).map(option).join(''); asel.value = ai;
    }
    function draw() {
      var m = ds[mi], a = V.antars(m)[ai], ps = pratyantars(a), now = Date.now();
      out.innerHTML = '<div class="vpd-path"><span>ماها <b>' + names[m.lord] + '</b></span><i aria-hidden="true">‹</i><span>أنتر <b>' + names[a.lord] + '</b></span><em>براتيانتر</em></div>' +
        '<div class="vpd-parent"><span>الكبرى المختارة</span><b>' + date(m.s) + '</b><span>حتى</span><b>' + date(m.e) + '</b></div>' +
        '<div class="vpd-parent"><span>الصغرى المختارة</span><b>' + date(a.s) + '</b><span>حتى</span><b>' + date(a.e) + '</b></div>' +
        '<ol class="vpd-list">' + ps.map(function (p, i) {
          var on = now >= p.s && now < p.e, days = (p.e - p.s) / 864e5;
          return '<li' + (on ? ' class="is-current"' : '') + '><div class="vpd-period-head"><span class="vpd-number">' + (i + 1) + '</span><h6>' + names[p.lord] + '</h6>' + (on ? '<em>الآن</em>' : '') + '<small>نحو ' + days.toLocaleString('ar-EG', { maximumFractionDigits: 1 }) + ' يوم</small></div><dl><div><dt>تبدأ</dt><dd>' + stamp(p.s) + '</dd></div><div><dt>تنتهي</dt><dd>' + stamp(p.e) + '</dd></div></dl></li>';
        }).join('') + '</ol><p class="vpd-zone-note">جميع المواعيد بتوقيت <b dir="ltr">' + esc(zone) + '</b>. نهاية الفترة هي بداية التالية.</p>';
    }
    function current() {
      var now = Date.now(), selected = active(ds, now), ref = selected >= 0 && now >= birth ? now : birth;
      mi = active(ds, ref); if (mi < 0) mi = 0;
      ai = active(V.antars(ds[mi]), ref); if (ai < 0) ai = 0;
      populate(); draw();
      if (selected < 0 || now < birth) out.insertAdjacentHTML('afterbegin', '<p class="vpd-warning">التاريخ الحالي خارج نطاق العمر المحسوب. نعرض الفترة التي تحتوي لحظة الميلاد، ويمكنك تصفح بقية الدورة.</p>');
    }
    msel.addEventListener('change', function () { mi = +msel.value; ai = 0; populate(); draw(); });
    asel.addEventListener('change', function () { ai = +asel.value; draw(); });
    box.querySelector('.vpd-zone').addEventListener('change', function (e) { zone = e.target.value; populate(); draw(); });
    box.querySelector('.vpd-now').addEventListener('click', current);
    current(); return box;
  }
  V.pratyantars = pratyantars;
  window.AqPratyantar = { createCard: createCard };
})();

;
/* assets/js/vedic-ashtakavarga.js */
/* Raw Parashari Ashtakavarga. BPHS 66.43–60, favourable marks only. */
(function () {
  'use strict';
  var KEYS = ['sun','moon','mars','mercury','jupiter','venus','saturn','asc'];
  var NAMES = ['الشمس','القمر','المريخ','عطارد','المشتري','الزهرة','زحل','الطالع'];
  // Each row lists contributors for houses 1..12. Index order is KEYS above.
  // Encoded by destination house, not copied from a software implementation.
  var HOUSE = [
    ['026','026','137','0267','34','13457','0256','026','02346','012367','0123467','357'],
    ['134','24','0123567','345','2356','01267','01345','034','15','0123457','01234567',''],
    ['267','2','0137','26','03','013457','26','256','6','02467','01234567','45'],
    ['23567','12567','35','12567','035','01347','26','124567','02356','12367','01234567','034'],
    ['02347','0123457','046','02347','13567','3567','01247','024','01357','023457','0123457','6'],
    ['157','157','123567','12567','134567','23','','014567','1234567','456','01234567','012'],
    ['07','0','1267','07','246','1234567','0','03','3','0237','01234567','2345']
  ];
  var TOTAL = [48,49,39,54,56,52,39];
  function norm(x) { return ((x % 360) + 360) % 360; }
  function signsOf(ch) {
    if (!ch || !ch.known || !Number.isFinite(ch.asc)) throw new Error('وقت ميلاد معلوم وطالع صالح مطلوبان لإضافة مساهمة الطالع.');
    return KEYS.map(function (k) {
      var b = (ch.bodies || []).filter(function (x) { return String(x.key).toLowerCase() === k; })[0];
      var v = k === 'asc' ? ch.asc : b && b.lon;
      if (!Number.isFinite(v)) throw new Error('موضع كوكب مطلوب غير متاح.');
      return Math.floor(norm(v) / 30);
    });
  }
  function calculate(ch) {
    var signs = signsOf(ch), sav = Array(12).fill(0);
    var bav = HOUSE.map(function (houses, p) {
      var contributors = KEYS.map(function () { return Array(12).fill(0); });
      houses.forEach(function (cs, h) { cs.split('').forEach(function (c) { var k = +c; contributors[k][(signs[k] + h) % 12] = 1; }); });
      var values = Array.from({length:12}, function (_, s) { return contributors.reduce(function (a,r) { return a + r[s]; }, 0); });
      if (values.reduce(function(a,b){return a+b;},0) !== TOTAL[p]) throw new Error('فشل تحقق مجموع الجدول.');
      values.forEach(function(v,s){sav[s]+=v;});
      return { key: KEYS[p], values: values, contributors: contributors, total: TOTAL[p] };
    });
    return { bav: bav, sav: sav, total: sav.reduce(function(a,b){return a+b;},0), lagna: signs[7], convention: 'BPHS-66-raw-favourable-Parashara' };
  }
  function createCard() {
    var el = document.createElement('div'); el.className = 'vav vad';
    var L = window.AqVedic && window.AqVedic.last;
    if (!L) { el.textContent = 'احسب خريطتك أولًا.'; return el; }
    var r; try { r = calculate(L.ch); } catch(e) { el.innerHTML = '<p class="vad-warning"></p>'; el.firstChild.textContent=e.message+' لا نستبدل الطالع بالقمر هنا حتى لا نعطي مجموعًا مضللًا.'; return el; }
    el.innerHTML = '<p class="vad-lead">نقاط البروج من الكواكب السبعة والطالع. اختر المجموع العام أو جدول كوكب لعرض مساهمات المصادر الثمانية.</p><label>الجدول<select class="vav-select"><option value="sav">سارفا · المجموع العام (337)</option>'+r.bav.map(function(b,p){return '<option value="'+p+'">بِهِنّا · '+NAMES[p]+' ('+b.total+')</option>';}).join('')+'</select></label><div class="vav-out" aria-live="polite"></div><p class="vad-note">المدرسة: باراشارا، BPHS 66، النقاط الملائمة قبل أي اختزال. لا يشمل راهو وكيتو أو جدولًا ثامنًا للطالع. بعض النصوص تسمي العلامة الملائمة «ريخا»، ونسميها هنا نقطة ملائمة بوضوح. لا نخلطها بالنقاط غير الملائمة.</p><p class="vad-note">مجموع الجداول السبعة دائمًا 337، لكنه لا يثبت المدرسة وحده. جداول فاراهاميهيرا تختلف في ست خلايا مع بقاء المجموع نفسه. هذه أعداد تقليدية للتأمل وليست احتمالات نجاح أو توقعًا مضمونًا.</p>';
    function render() {
      var val=el.querySelector('select').value, idx=val==='sav'?-1:+val, arr=idx<0?r.sav:r.bav[idx].values;
      var h='<div class="vad-signs">';
      arr.forEach(function(v,s){h+='<article><span>'+window.AqVedic.T.SG[s]+'</span><b>'+v+'</b><small>البيت '+((s-r.lagna+12)%12+1)+'</small></article>';}); h+='</div>';
      h+='<p class="vad-total">المجموع: '+(idx<0?r.total:r.bav[idx].total)+'</p>';
      if(idx>=0) {
        h+='<h5>مصدر كل نقطة</h5><p class="vad-note">اسحب الجدول أفقيًا لعرض البروج الاثني عشر. 1 مساهمة ملائمة، و0 لا مساهمة.</p><div class="vad-scroll" tabindex="0" aria-label="مساهمات المصادر في البروج"><table><thead><tr><th scope="col">المصدر</th>'+window.AqVedic.T.SG.map(function(n){return '<th scope="col">'+n+'</th>';}).join('')+'</tr></thead><tbody>';
        r.bav[idx].contributors.forEach(function(row,k){h+='<tr><th scope="row">'+NAMES[k]+'</th>'+row.map(function(v){return '<td>'+v+'</td>';}).join('')+'</tr>';});
        h+='<tr><th scope="row">المجموع</th>'+arr.map(function(v){return '<td><b>'+v+'</b></td>';}).join('')+'</tr></tbody></table></div>';
      }
      el.querySelector('.vav-out').innerHTML=h;
    }
    el.querySelector('select').addEventListener('change',render);render();return el;
  }
  window.AqAshtakavarga={ calculate:calculate, createCard:createCard };
})();

;
/* assets/js/vedic-shadbala.js */
/* Shadbala, a declared BPHS/Saravali calculation convention, not a cross-software standard. */
(function () {
  'use strict';
  var K=['sun','moon','mars','mercury','jupiter','venus','saturn'],N=['الشمس','القمر','المريخ','عطارد','المشتري','الزهرة','زحل'];
  var OWN=[2,5,3,1,0,3,5,2,4,6,6,4],EX=[10,33,298,165,95,357,200],MT=[4,1,0,5,8,6,10];
  var FRIEND=[[1,2,4],[0,3],[0,1,4],[0,5],[0,1,2],[3,6],[3,5]],ENEMY=[[5,6],[],[3],[1],[3,5],[0,1],[0,1,2]];
  var MEAN={earth:[100.466457,36000.7698278,0.00030322,0.00000002],mercury:[252.250906,149474.0722491,0.0003035,0.000000018],venus:[181.979801,58519.2130302,0.00031014,0.000000015],mars:[355.433,19141.6964471,0.00031052,0.000000016],jupiter:[34.351519,3036.3027748,0.0002233,0.000000037],saturn:[50.077444,1223.5110686,0.00051908,-0.00000003]};
  var REQ=[390,360,300,420,390,330,300],DAY=864e5;
  function norm(x){return ((x%360)+360)%360;}
  function signed(x){return norm(x+180)-180;}
  function sep(a,b){return Math.abs(signed(a-b));}
  function sum(a){return a.reduce(function(x,y){return x+y;},0);}
  function body(ch,k){return (ch.bodies||[]).filter(function(b){return b.key===k;})[0];}
  function mean(k,jde){var c=MEAN[k],t=(jde-2451545)/36525;return norm(c[0]+t*(c[1]+t*(c[2]+t*c[3])));}
  function chesta(p,jde,trueLon){
    var sun=norm(mean('earth',jde)+180),m=mean(K[p],jde),sighra=sun;
    if(p===3||p===5){sighra=m;m=sun;}
    var average=norm(m+signed(trueLon-m)/2);return sep(sighra,average)/3;
  }
  function aspect(a,p){
    a=norm(a);var v=0,r=a%30;
    if(a>=30&&a<60)v=(a-30)/2;
    else if(a<90&&a>=60)v=a-45;
    else if(a<120&&a>=90)v=(120-a)/2+30;
    else if(a<150&&a>=120)v=150-a;
    else if(a<180&&a>=150)v=(a-150)*2;
    else if(a>=180&&a<300)v=(300-a)/2;
    if(p===6){if(a>=30&&a<60)v=r*2;else if(a>=60&&a<90)v=60-r/2;else if(a>=240&&a<270)v=30+r;else if(a>=270&&a<300)v=(30-r)*2;}
    if(p===2){if((a>=90&&a<120)||(a>=210&&a<240))v=60-r;else if(a>=60&&a<90)v=15+1.5*r;else if(a>=180&&a<210)v=60;}
    if(p===4){if((a>=90&&a<120)||(a>=210&&a<240))v=45+r/2;else if((a>=120&&a<150)||(a>=240&&a<270))v=60-r;}
    return Math.max(0,Math.min(60,v));
  }
  function ayana(p,tropical){
    // BPHS's tabular 45/33/12 method, expressed on a 0..90 arc, then /3.
    var l=norm(tropical),b=Math.min(l%180,180-l%180),f=b<30?b*45/30:b<60?45+(b-30)*33/30:78+(b-60)*12/30;
    var north=l<180,s=(p===1||p===6)?-1:1;if(p===3)s=north?1:-1;
    return (90+(north?1:-1)*s*f)/3;
  }
  function uchcha(p,l){return sep(l,norm(EX[p]+180))/3;}
  function temporal(ms,ch){
    var A=window.Astronomy;if(!A)throw new Error('محرك الشروق غير متاح.');
    var obs=new A.Observer(ch.lat,ch.lon,0),start=new Date(ms-2*DAY),up=A.SearchRiseSet('Sun',obs,1,start,4),rises=[],sets=[];
    // Bounded search over neighbouring solar days, not account/network polling.
    while(up&&up.date.getTime()<=ms+2*DAY&&rises.length<5){rises.push(up.date.getTime());up=A.SearchRiseSet('Sun',obs,1,up.AddDays(0.05),2);}
    var down=A.SearchRiseSet('Sun',obs,-1,start,4);
    while(down&&down.date.getTime()<=ms+2*DAY&&sets.length<5){sets.push(down.date.getTime());down=A.SearchRiseSet('Sun',obs,-1,down.AddDays(0.05),2);}
    var rise=rises.filter(function(t){return t<=ms;}).pop(),next=rises.filter(function(t){return t>ms;})[0];
    if(!Number.isFinite(rise)||!Number.isFinite(next))throw new Error('لا شروق يومي عند هذا المكان والتاريخ؛ لن نخمن قوة الزمن القطبية.');
    var set=sets.filter(function(t){return t>rise&&t<next;})[0];if(!Number.isFinite(set))throw new Error('تعذر تحديد غروب الشمس.');
    var day=ms<set,from=day?rise:set,to=day?set:next,third=Math.min(2,Math.floor((ms-from)/(to-from)*3));
    var solarDate=new Date(rise+ch.lon/360*DAY),year=solarDate.getUTCFullYear(),month=solarDate.getUTCMonth()+1,weekday=solarDate.getUTCDay();
    var horaIndex=(day?0:12)+Math.min(11,Math.floor((ms-from)/(to-from)*12)),order=[6,4,2,0,5,3,1];
    var ha=A.HourAngle('Sun',new Date(ms),obs),noon=60-Math.abs(ha>12?ha-24:ha)*5;
    return {rise:rise,set:set,nextRise:next,day:day,third:third,noon:noon,lords:[((year+3)*3)%7,((12*year+month+6)*2)%7,weekday,order[(order.indexOf(weekday)+horaIndex)%7]],hora:horaIndex+1};
  }
  function positional(p,longs,asc,div){
    var lon=longs[p],sg=Math.floor(lon/30),nav=div(lon,9),vargas=[1,2,3,7,9,12,30],points=[];
    var sv=sum(vargas.map(function(d){
      var signs=longs.map(function(v){return div(v,d);}),s=signs[p],owner=OWN[s];
      if(d===1&&s===MT[p]){points.push(45);return 45;}
      if(owner===p){points.push(30);return 30;}
      // Compound relationship is based on natal Rasi positions, explicitly selected.
      var natural=FRIEND[p].indexOf(owner)>=0?1:ENEMY[p].indexOf(owner)>=0?-1:0;
      var house=(Math.floor(longs[owner]/30)-sg+12)%12+1,temp=[2,3,4,10,11,12].indexOf(house)>=0?1:-1;
      var v=({'2':20,'1':15,'0':10,'-1':4,'-2':2})[natural+temp];points.push(v);return v;
    }));
    var female=p===1||p===5,odd=sg%2===0,oddNav=nav%2===0,oj=(odd!==female?15:0)+(oddNav!==female?15:0);
    var house=(sg-Math.floor(asc/30)+12)%12,ken=[60,30,15][house%3],dec=Math.floor(lon%30/10),want=(p===0||p===2||p===4)?0:female?1:2;
    var parts=[uchcha(p,lon),sv,oj,ken,dec===want?15:0];return {parts:parts,vargaPoints:points,total:sum(parts)};
  }
  function yuddha(longs,base){
    // Raman, Graha and Bhava Balas 76-77. Fixed traditional discs, not apparent diameters.
    var discs=[0,0,9.4,6.6,190.4,16.6,158],pairs=[],degree=Array(7).fill(0),corrections=Array(7).fill(0),unresolved=[];
    for(var i=2;i<7;i++)for(var j=i+1;j<7;j++)if(sep(longs[i],longs[j])<1){pairs.push({a:i,b:j});degree[i]++;degree[j]++;}
    pairs.forEach(function(w){
      if(degree[w.a]>1||degree[w.b]>1||Math.abs(norm(longs[w.a])-norm(longs[w.b]))<1e-10){w.reason=degree[w.a]>1||degree[w.b]>1?'حرب متعددة الأطراف: لا يحدد المرجع ترتيب التصحيحات':'تساوٍ تام في الطول: لا منتصر محدد في الصيغة';unresolved.push(w.a,w.b);return;}
      w.winner=norm(longs[w.a])<norm(longs[w.b])?w.a:w.b;w.loser=w.winner===w.a?w.b:w.a;
      w.amount=Math.abs(base[w.a]-base[w.b])/Math.abs(discs[w.a]-discs[w.b]);corrections[w.winner]+=w.amount;corrections[w.loser]-=w.amount;
    });
    return {pairs:pairs,corrections:corrections,unresolved:unresolved};
  }
  function calculate(ch,natal){
    if(!ch||!ch.known||!Number.isFinite(ch.asc)||!Number.isFinite(ch.mc)||!natal||!Number.isFinite(natal.utcMs))throw new Error('وقت ميلاد معلوم ومكانه مطلوبان لحساب القوى الست.');
    if(!Number.isFinite(ch.lat)||!Number.isFinite(ch.lon))throw new Error('إحداثيات الميلاد غير متاحة.');
    var E=window.AqEam,V=window.AqVedic,longs=K.map(function(k){var b=body(ch,k);if(!b||!Number.isFinite(b.lon))throw new Error('مواضع الكواكب غير مكتملة.');return norm(b.lon);});
    var off=E.ayanamsa(ch.jde),t=temporal(natal.utcMs,ch),elong=norm(longs[1]-longs[0]),wax=elong<=180,phase=Math.min(elong,360-elong)/3;
    var mercurySign=Math.floor(longs[3]/30);
    var mercuryBad=longs.some(function(l,p){return ([0,2,6].indexOf(p)>=0||(p===1&&!wax))&&Math.floor(l/30)===mercurySign;});
    var node=body(ch,'node')||body(ch,'truenode');
    if(node&&Number.isFinite(node.lon)&&(Math.floor(norm(node.lon)/30)===mercurySign||Math.floor(norm(node.lon+180)/30)===mercurySign))mercuryBad=true;
    var benefic=K.map(function(_,p){return p===4||p===5||(p===1&&wax)||(p===3&&!mercuryBad);});
    var rows=K.map(function(k,p){
      var st=positional(p,longs,ch.asc,V.div),weak=(p===0||p===2)?norm(ch.mc+180):(p===3||p===4)?norm(ch.asc+180):(p===1||p===5)?ch.mc:ch.asc;
      var dig=sep(longs[p],weak)/3,ay=ayana(p,norm(longs[p]+off)),pak=benefic[p]?phase:60-phase;
      var kalaParts=[p===3?60:([0,4,5].indexOf(p)>=0?t.noon:60-t.noon),pak,(p===4||p===(t.day?[3,0,6]:[1,5,2])[t.third])?60:0];
      [15,30,45,60].forEach(function(v,j){kalaParts.push(t.lords[j]===p?v:0);});kalaParts.push(ay);
      var mot=p===0?ay:p===1?pak:chesta(p,ch.jde,norm(longs[p]+off));
      var contributions=K.map(function(_,q){if(q===p)return 0;var a=aspect(norm(longs[p]-longs[q]),q),c=benefic[q]?0.25:-0.25;if(q===3||q===4)c+=1;return a*c;});
      var drik=sum(contributions),natural=[60,360/7,120/7,180/7,240/7,300/7,60/7][p];
      return {key:k,name:N[p],sthana:st.total,sthanaParts:st.parts,vargaPoints:st.vargaPoints,dig:dig,kala:sum(kalaParts),kalaParts:kalaParts,chesta:mot,naisargika:natural,drik:drik,contributions:contributions};
    });
    var war=yuddha(longs,rows.map(function(r){return r.sthana+r.dig+sum(r.kalaParts.slice(0,7));}));
    rows.forEach(function(r,p){r.yuddha=war.corrections[p];r.kalaParts.push(r.yuddha);r.kala+=r.yuddha;r.total=war.unresolved.indexOf(p)>=0?null:r.sthana+r.dig+r.kala+r.chesta+r.naisargika+r.drik;r.rupas=r.total===null?null:r.total/60;r.required=REQ[p]/60;r.ratio=r.total===null?null:r.total/REQ[p];});
    return {rows:rows,temporal:t,wars:war.pairs,convention:'BPHS27-Raman76-war-v2',complete:war.unresolved.length===0};
  }
  function createCard(){
    var el=document.createElement('div');el.className='vsb vad';var L=window.AqVedic&&window.AqVedic.last,r;
    try{r=calculate(L&&L.ch,L&&L.natal);}catch(e){el.innerHTML='<p class="vad-warning"></p>';el.firstChild.textContent=e.message;return el;}
    var fmt=function(v){return v===null?'غير مكتمل':v.toFixed(2);};
    var h='<p class="vad-lead">تفصيل القوى الست لكل كوكب، بالفيروبا. كل 60 فيروبا = روبا واحدة. هذه نسخة معلنة القواعد، وليست وعدًا بالتطابق مع كل برامج شادبالا.</p>';
    if(r.wars.length)h+='<p class="vad-note">حرب كوكبية وفق رامان: '+r.wars.map(function(w){return N[w.a]+' / '+N[w.b]+(w.reason?' · '+w.reason:' · المنتصر '+N[w.winner]+' · التصحيح ±'+fmt(w.amount)+' فيروبا');}).join('، ')+'. الأقل في الطول النجمي من 0 إلى 360 هو المنتصر في هذه المدرسة، وليس الأعلى في العرض أو الميل. الحجب إن وجد يخص الأطراف غير المحسومة فقط.</p>';
    h+='<div class="vad-signs">'+r.rows.map(function(v){return '<article><span>'+v.name+'</span><b>'+fmt(v.rupas)+'</b><small>روبا'+(v.ratio===null?'':' · النسبة '+fmt(v.ratio))+'</small></article>';}).join('')+'</div><label>تفاصيل الكوكب<select class="vsb-select">'+N.map(function(n,p){return '<option value="'+p+'">'+n+'</option>';}).join('')+'</select></label><div class="vsb-out"></div>';
    h+='<p class="vad-note">المنهج: BPHS 27، المولاثريكونا في D1 فقط، الصداقة المركبة من D1، نقاط السبعة 45/30/20/15/10/4/2. قوة الاتجاه من الطالع ووسط السماء الفعليين. الشروق والغروب فلكيان، واليوم يبدأ بالشروق، والهورا 12 جزءًا للنهار و12 لليل.</p><p class="vad-note">حاكما السنة والشهر وفق معادلات Saravali المعلنة، وليسا تلقائيًا حاكمي أول يناير وأول الشهر المدني. قوة الحركة من متوسطات مدارية حديثة مع قاعدة منفصلة لعطارد والزهرة؛ أيانا بجدول 45/33/12. درِك حسب زوايا BPHS 26، وقراءة «إضافة تأثير عطارد والمشتري كاملًا» في BPHS 27.19. تصحيح الحرب الثنائية من كتاب رامان، الفقرتين 76 و77: فرق (الموقع + الاتجاه + الزمن حتى الهورا دون أيانا) ÷ فرق أقطار القرص الثابتة. اختيار المنهج لا يعني مطابقة بقية مكونات رامان. اختلاف هذه الاختيارات يغيّر المجموع بين المدارس. لا يُستنتج حدث أو احتمال علمي من الرقم.</p>';
    el.innerHTML=h;
    function render(){var v=r.rows[+el.querySelector('select').value],labels=['الموقع · ستانا','الاتجاه · دِغ','الزمن · كالا','الحركة · تشيشتا','الطبيعة · نايسارغيكا','الاتصالات · درِك'],values=[v.sthana,v.dig,v.kala,v.chesta,v.naisargika,v.drik];
      var s='<div class="vsb-parts">'+labels.map(function(n,k){return '<p><span>'+n+'</span><b>'+fmt(values[k])+'</b></p>';}).join('')+'</div><p class="vad-total">المجموع '+fmt(v.total)+' فيروبا · الحد التقليدي '+v.required+' روبا</p><details><summary>تفصيل الحساب</summary><p class="vad-note">الموقع (الشرف، التقسيمات، الفردي/الزوجي، المركز، الدريكانا): '+v.sthanaParts.map(fmt).join(' / ')+'</p><p class="vad-note">نقاط D1/D2/D3/D7/D9/D12/D30: '+v.vargaPoints.map(fmt).join(' / ')+'</p><p class="vad-note">الزمن (نهار/ليل، طور القمر، ثلث اليوم، السنة، الشهر، اليوم، الهورا، أيانا، تصحيح الحرب): '+v.kalaParts.map(fmt).join(' / ')+'</p></details>';el.querySelector('.vsb-out').innerHTML=s;}
    el.querySelector('select').addEventListener('change',render);render();return el;
  }
  window.AqShadbala={calculate:calculate,createCard:createCard,math:{norm:norm,sep:sep,mean:mean,chesta:chesta,aspect:aspect,ayana:ayana,uchcha:uchcha,positional:positional,temporal:temporal,yuddha:yuddha}};
})();

;
/* assets/js/vedic-varshaphala.js */
/* Sidereal solar return and annual chart. Uses the site's true-Sun ephemeris and Lahiri. */
(function(){
 'use strict';
 var DAY=864e5,K=['sun','moon','mars','mercury','jupiter','venus','saturn','node'],N=['الشمس','القمر','المريخ','عطارد','المشتري','الزهرة','زحل','راهو'],RULER=[2,5,3,1,0,3,5,2,4,6,6,4],ORB=[15,12,8,7,9,7,9];
 function norm(v){return ((v%360)+360)%360;}
 function signed(v){return norm(v+180)-180;}
 function body(ch,k){return(ch.bodies||[]).filter(function(b){return b.key===k;})[0];}
 function sunAt(ms){var A=window.Astro,jd=A.jdFromMs(ms),jde=jd+A.deltaT(A.yearOf(jd))/86400;return norm(A.lonOf('sun',jde)-window.AqEam.ayanamsa(jde));}
 function root(target,guess){
  var lo=guess-4*DAY,hi=guess+4*DAY,fl=signed(sunAt(lo)-target),fh=signed(sunAt(hi)-target);
  if(!(fl<0&&fh>0))throw new Error('تعذر إحاطة عودة الشمس؛ لا نستخدم تقدير عيد الميلاد بدل الحل.');
  for(var i=0;i<50&&hi-lo>0.002;i++){var mid=(lo+hi)/2,fm=signed(sunAt(mid)-target);if(fm<0)lo=mid;else hi=mid;}
  var ms=(lo+hi)/2,residual=Math.abs(signed(sunAt(ms)-target));if(residual>1e-6)throw new Error('فشل تحقق زاوية العودة.');return {ms:ms,residual:residual};
 }
 function muntha(birthAsc,age,annualAsc){if(!Number.isFinite(birthAsc)||!Number.isFinite(annualAsc)||!Number.isInteger(age)||age<0)throw new Error('بيانات مونثا غير صالحة.');var sign=(Math.floor(norm(birthAsc)/30)+age)%12;return {sign:sign,house:(sign-Math.floor(norm(annualAsc)/30)+12)%12+1,lord:RULER[sign]};}
 function tajika(a,b,pa,pb){
  var h=(Math.floor(norm(b.lon)/30)-Math.floor(norm(a.lon)/30)+12)%12+1;
  if([1,3,4,5,7,9,10,11].indexOf(h)<0)return null;
  var friendly=[3,5,9,11].indexOf(h)>=0,exact=(h-1)*30,gap=signed(norm(b.lon-a.lon)-exact),fast=Math.abs(a.speed)>=Math.abs(b.speed)?pa:pb,orb=ORB[fast];
  var retro=a.speed<0||b.speed<0,change=(b.speed-a.speed)*gap,status=Math.abs(gap)<1e-5?'دقيق الآن':retro?'راجع · لا نصنف التطبيق':change<0?'يتقارب لحظيًا':change>0?'يتباعد لحظيًا':'ثابت لحظيًا';
  return {a:pa,b:pb,house:h,angle:exact,friendly:friendly,orb:Math.abs(gap),limit:orb,within:Math.abs(gap)<=orb,status:status};
 }
 // Tajika five-dignity strength, Nilakanthi/Hayanaratna named convention.
 var HADDA=[[[4,6],[5,12],[3,20],[2,25],[6,30]],[[5,8],[3,14],[4,22],[6,27],[2,30]],[[3,6],[5,12],[4,17],[2,24],[6,30]],[[2,7],[5,13],[3,19],[4,26],[6,30]],[[4,6],[5,11],[6,18],[3,24],[2,30]],[[3,7],[5,17],[4,21],[2,28],[6,30]],[[6,6],[3,14],[4,21],[5,28],[2,30]],[[2,7],[5,11],[3,19],[4,24],[6,30]],[[4,12],[5,17],[3,21],[2,26],[6,30]],[[3,7],[4,14],[5,22],[6,26],[2,30]],[[3,7],[5,13],[4,20],[2,25],[6,30]],[[5,12],[4,16],[3,19],[2,28],[6,30]]];
 var EXALT=[10,33,298,165,95,357,200];
 function hadda(lon){var s=Math.floor(norm(lon)/30),d=norm(lon)%30;return HADDA[s].filter(function(v){return d<v[1];})[0][0];}
 function tajikaRelation(p,q,positions){if(p===q)return 1;var h=(Math.floor(norm(positions[q])/30)-Math.floor(norm(positions[p])/30)+12)%12+1;return [3,5,9,11].indexOf(h)>=0?0.75:[1,4,7,10].indexOf(h)>=0?0.25:0.5;}
 function pancha(positions){
  if(!Array.isArray(positions)||positions.length<7||positions.some(function(v){return !Number.isFinite(v);}))throw new Error('مواضع القوة الخماسية غير مكتملة.');
  return positions.slice(0,7).map(function(l,p){var s=Math.floor(norm(l)/30),d=norm(l)%30,dec=(s+[2,0,5][Math.floor(d/10)])%7,nav=((s%4===0?0:s%4===1?9:s%4===2?6:3)+Math.floor(d/(30/9)))%12;
   var owners=[RULER[s],hadda(l),dec,RULER[nav]],weights=[30,15,10,5],parts=owners.map(function(q,i){return weights[i]*tajikaRelation(p,q,positions);});
   var uc=Math.abs(signed(l-norm(EXALT[p]+180)))/9;parts.splice(1,0,uc);return {key:K[p],owners:owners,parts:parts,total:parts.reduce(function(a,b){return a+b;},0)/4};
  });
 }
 function joining(a,b,pa,pb){
  var asp=tajika(a,b,pa,pb);if(!asp)return null;
  var gap=signed(norm(b.lon-a.lon)-asp.angle),fast=Math.abs(a.speed)>=Math.abs(b.speed)?a:b;
  if(!Number.isFinite(a.speed)||!Number.isFinite(b.speed))return {unknown:true};
  if(fast.speed<0)return null;
  var lag=fast===a?gap:-gap,perfected=lag>=-1e-10&&lag<=1/120+1e-10,applying=gap*(b.speed-a.speed)<0;
  return asp.within&&(perfected||applying)?{perfected:perfected,gap:Math.abs(gap)}:null;
 }
 function screenDuru(annual){
  var pts=K.slice(0,7).map(function(k){return body(annual,k);}),pos=pts.map(function(b){return b.lon;}),strength=pancha(pos),ascSign=Math.floor(norm(annual.asc)/30),node=body(annual,'node'),wax=norm(pos[1]-pos[0])<=180;
  var bad=[true,!wax,true,false,false,false,true];bad[3]=[0,1,2,6].some(function(q){return bad[q]&&Math.floor(pos[q]/30)===Math.floor(pos[3]/30);});
  return pts.map(function(b,p){
   var reasons=[],uncertain=[],sg=Math.floor(norm(b.lon)/30),house=(sg-ascSign+12)%12+1;
   if(!Number.isFinite(b.speed))uncertain.push('الحركة غير متاحة');else if(b.speed<0)reasons.push('راجع');
   if([6,8,12].indexOf(house)>=0)reasons.push('في البيت '+house);
   if(RULER[(sg+6)%12]===p)reasons.push('في البرج المقابل لبيته');
   // Source variants disagree on heliacal/combustion cutoffs. Do not invent one.
   if(p!==0&&Math.abs(signed(b.lon-pos[0]))<=17)uncertain.push('قريب من الشمس: حد الاحتراق/الاختفاء مختلف بين المراجع');
   pts.forEach(function(q,j){if(j===p)return;var a=tajika(q,b,j,p);
    if(bad[j]&&a&&a.within)reasons.push('اتصال ضمن الأورب من '+N[j]);
    if(Math.floor(norm(q.lon)/30)===Math.floor(norm(EXALT[j]+180)/30)&&joining(b,q,p,j))reasons.push('إيثاسالا مع '+N[j]+' في هبوطه');
   });
   if(!node)uncertain.push('موضع العقدة غير متاح');
   if(node&&Math.min(Math.abs(signed(b.lon-node.lon)),Math.abs(signed(b.lon-node.lon-180)))<=12)uncertain.push('قرب رأس/ذيل راهو: حد الاقتران غير محسوم في نص دوروفا');
   if(p===1){
    if((sg-Math.floor(pos[0]/30)+12)%12===11)reasons.push('القمر في الثاني عشر من الشمس');
    if((sg===6&&norm(b.lon)%30>=15)||(sg===7&&norm(b.lon)%30<15))reasons.push('القمر في المسار المحترق');
    if(!wax)reasons.push('قمر متناقص');
    var ruler=RULER[sg],aspect=ruler===p?null:tajika(pts[ruler],b,ruler,p);
    if(ruler!==p&&(!aspect||!aspect.within))reasons.push('القمر غير متصل بحاكم برجه');
    if(!pts.some(function(q,j){var a=j===p?null:tajika(q,b,j,p);return a&&a.within;}))reasons.push('القمر بلا اتصال ضمن الأورب');
    if(strength[p].owners.every(function(o){return o!==p;})&&sg!==Math.floor(EXALT[p]/30))reasons.push('القمر بلا كرامة ذاتية');
    if(norm(b.lon)%30>=29)uncertain.push('القمر قرب نهاية البرج: النص لا يحدد حدًا عدديًا');
   }
   return {reasons:reasons,uncertain:uncertain,blocked:reasons.length>0};
  });
 }
 function rankOffices(candidates,mun,tri,light){
  var unique=candidates.filter(function(v,i,a){return a.findIndex(function(x){return x.key===v.key;})===i;});
  unique.forEach(function(v){v.claims=candidates.filter(function(c){return c.key===v.key;}).length;});
  unique.sort(function(a,b){return b.strength-a.strength||b.aspect-a.aspect||b.claims-a.claims;});
  if(!unique.length)return {key:null,reason:'لا مرشح مؤهل بعد فحص الموانع.'};
  var best=unique[0],ties=unique.filter(function(v){return Math.abs(v.strength-best.strength)<1e-8&&v.aspect===best.aspect&&v.claims===best.claims;});
  if(ties.length>1){for(var i=0;i<3;i++){var k=[mun,light,tri][i],hit=ties.filter(function(v){return v.key===k;})[0];if(hit)return {key:k,reason:'حُسم التعادل بعد القوة والاتصال وعدد المناصب، بترتيب مونثا ثم حاكم النير ثم التثليث.'};}return {key:null,reason:'تعادل باقٍ يحتاج إيثاسالا القمر أو حكمًا خاصًا؛ لا كسر اعتباطي.'};}
  return {key:best.key,reason:'الأعلى قوة، ثم قوة الاتصال، ثم عدد المناصب عند تساوي ما قبله.'};
 }
 function moonReplacement(annual,audit){
  var moon=body(annual,'moon'),joins=[];
  K.slice(0,7).forEach(function(k,p){if(p===1)return;var j=joining(moon,body(annual,k),1,p);if(j)joins.push({key:p,state:j});});
  var perfect=joins.filter(function(j){return j.state.perfected&&!audit[j.key].blocked&&audit[j.key].uncertain.length===0;});
  if(perfect.length===1)return {key:perfect[0].key,reason:'استُبدل القمر بصاحب الإيثاسالا المكتمل الآن ضمن 30 ثانية قوسية، وفق موكتافالي 4.6–8.'};
  if(perfect.length>1||joins.length)return {key:null,reason:'استبدال القمر يحتاج حسم إيثاسالا مكتمل، لا مجرد تقارب مستقبلي أو أكثر من بديل؛ لا نختار بديلًا اعتباطيًا.'};
  return {key:RULER[Math.floor(norm(moon.lon)/30)],reason:'لا إيثاسالا للقمر: البديل حاكم برجه، ويبقى القمر إن كان هو حاكم برجه، وفق موكتافالي 4.6–8.'};
 }
 function officeHolders(birthAsc,annual,mun,day){
  if(day===null)return {candidates:[],selected:null,reason:'الشمس قريبة من الأفق؛ لا نحسم النهار والليل قرب الحد.'};
  var ascSign=Math.floor(norm(annual.asc)/30),positions=K.slice(0,7).map(function(k){return body(annual,k).lon;}),strength=pancha(positions),triDay=[0,5,6,5,4,1,3,2,6,2,4,1],triNight=[4,1,3,2,0,5,6,5,6,2,4,1];
  var ids=[RULER[Math.floor(norm(birthAsc)/30)],RULER[ascSign],mun.lord,(day?triDay:triNight)[ascSign],RULER[Math.floor(positions[day?0:1]/30)]],labels=['حاكم طالع الميلاد','حاكم طالع السنة','حاكم مونثا','حاكم التثليث','حاكم برج '+(day?'الشمس · عودة نهارية':'القمر · عودة ليلية')];
  var candidates=ids.map(function(p,i){var h=(ascSign-Math.floor(positions[p]/30)+12)%12+1,asp=({1:60,3:40,4:15,5:45,7:60,9:45,10:15,11:10})[h]||0;return {key:p,role:labels[i],strength:strength[p].total,aspect:asp};});
  var audit=screenDuru(annual);candidates.forEach(function(c){c.audit=audit[c.key];});
  var eligible=candidates.filter(function(v){return v.aspect>0&&!v.audit.blocked;}),chosen,reason;
  if(!eligible.length){
   if(candidates.some(function(v){return v.aspect>0;}))return {candidates:candidates,strength:strength,selected:null,reason:'المرشحون المتصلون بالطالع مستبعدون بموانع دوروفا؛ لا نعيد إدخال مستبعد.'};
   var fallback=RULER[ascSign];chosen=fallback;reason='لا اتصال من الخمسة: نختار حاكم طالع السنة وفق تاجيكا موكتافالي 4.9، خلاف روايات تختار مونثا.';
  }else{var rank=rankOffices(eligible,mun.lord,ids[3],ids[4]);chosen=rank.key;reason=rank.reason;}
  if(chosen===null)return {candidates:candidates,strength:strength,selected:null,reason:reason};
  if(eligible.some(function(v){return v.audit.uncertain.length>0;}))return {candidates:candidates,strength:strength,selected:null,reason:'مرشح غير مستبعد له فحص حدودي غير محسوم قد يغيّر الاختيار؛ راجع أسباب المرشحين.'};
  if(chosen===1){
   var replacement=moonReplacement(annual,audit);chosen=replacement.key;reason+=' '+replacement.reason;
   if(chosen===null)return {candidates:candidates,strength:strength,selected:null,reason:reason};
  }

  if(audit[chosen].blocked||audit[chosen].uncertain.length)return {candidates:candidates,strength:strength,selected:null,reason:'الحاكم البديل/الاحتياطي لم يجتز فحص دوروفا؛ لا نلغي الموانع لإجبار اختيار.'};
  return {candidates:candidates,strength:strength,selected:chosen,reason:reason+' القواعد العددية المعلنة مطبّقة، وليست إجماع كل روايات تاجيكا.'};
 }

 function punya(sun,moon,asc,day){
  var a=day?sun:moon,b=day?moon:sun;if(Math.floor(norm(asc)/30)===Math.floor(norm(a)/30)||Math.floor(norm(asc)/30)===Math.floor(norm(b)/30))return null;
  var between=norm(asc-a)<norm(b-a);return norm(b-a+asc+(between?0:30));
 }

 function calculate(ch,natal,year,location){
  if(!ch||!ch.known||!Number.isFinite(ch.asc)||!natal||!Number.isFinite(natal.utcMs))throw new Error('وقت الميلاد الدقيق مطلوب لحساب عودة الشمس والطالع ومونثا.');
  var birthYear=Number.isInteger(natal.y)?natal.y:new Date(natal.utcMs).getUTCFullYear();
  if(!Number.isInteger(year)||year<=birthYear||year>Math.min(2200,birthYear+120))throw new Error('اختر سنة بعد سنة الميلاد وفي حدود 120 سنة، وحتى 2200.');
  var lat=location&&location.lat,lon=location&&location.lon;
  if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>89||Math.abs(lon)>180)throw new Error('أدخل إحداثيات صحيحة: العرض من -89 إلى 89 والطول من -180 إلى 180.');
  var s=body(ch,'sun');if(!s||!Number.isFinite(s.lon))throw new Error('شمس الميلاد غير متاحة.');
  var age=year-birthYear,guess=natal.utcMs+age*365.25636*DAY,ret=root(norm(s.lon),guess),next=root(norm(s.lon),guess+365.25636*DAY);
  var A=window.Astro,annual=A.chart({utcMs:ret.ms,lat:lat,lon:lon,known:true,hs:'whole'}),off=window.AqEam.ayanamsa(annual.jde);
  annual.bodies=annual.bodies.map(function(b){var l=norm(b.lon-off);return Object.assign({},b,{lon:l,sign:Math.floor(l/30)});});
  annual.asc=norm(annual.asc-off);annual.mc=norm(annual.mc-off);annual.cusps=Array.from({length:12},function(_,i){return (Math.floor(annual.asc/30)*30+i*30)%360;});annual.sidereal=true;annual.ayanamsa=off;
  annual.bodies.forEach(function(b){b.house=(Math.floor(b.lon/30)-Math.floor(annual.asc/30)+12)%12+1;});
  var points=K.map(function(k){return body(annual,k);}),aspects=[];
  for(var i=0;i<7;i++)for(var j=i+1;j<7;j++){var asp=tajika(points[i],points[j],i,j);if(asp)aspects.push(asp);}
  var AA=window.Astronomy,observer=new AA.Observer(lat,lon,0),eq=AA.Equator('Sun',new Date(ret.ms),observer,true,true),alt=AA.Horizon(new Date(ret.ms),observer,eq.ra,eq.dec,'normal').altitude,day=alt>1?true:alt<-1?false:null,mu=muntha(ch.asc,age,annual.asc);
  var offices=officeHolders(ch.asc,annual,mu,day),saham=day===null?null:punya(body(annual,'sun').lon,body(annual,'moon').lon,annual.asc,day);
  return {year:year,age:age,returnMs:ret.ms,nextMs:next.ms,residual:ret.residual,target:norm(s.lon),chart:annual,muntha:mu,offices:offices,punya:saham,day:day,aspects:aspects,location:{lat:lat,lon:lon},convention:'Lahiri-sidereal-return-whole-sign-Muntha'};
 }
 function createCard(){
  var el=document.createElement('div'),L=window.AqVedic&&window.AqVedic.last;el.className='vyr vad';
  if(!L||!L.ch.known){el.innerHTML='<p class="vad-warning">وقت الميلاد غير معروف. لا نخمن موعد العودة أو الطالع أو مونثا.</p>';return el;}
  var min=(Number.isInteger(L.natal.y)?L.natal.y:new Date(L.natal.utcMs).getUTCFullYear())+1,max=Math.min(2200,min+119),yr=Math.max(min,Math.min(max,new Date().getFullYear()+1));
  var place=String(L.natal.placeName||L.natal.place||'مكان الميلاد'),esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  el.innerHTML='<p class="vad-lead">الخريطة السنوية لحظة عودة الشمس إلى طولها النجمي عند ميلادك، مع طالع السنة ومونثا والاتصالات التاجيكية. العودة ليست تكرار الساعة والتاريخ المدنيين.</p><label>سنة العودة المرجعية<input class="vyr-year" type="number" min="'+min+'" max="'+max+'" step="1" value="'+yr+'"></label><label>مكان العودة<select class="vyr-place"><option value="birth">مكان الميلاد</option><option value="custom">مكان آخر · إحداثيات</option></select></label><p class="vad-note">الافتراضي مكان الميلاد: '+esc(place)+' ('+L.ch.lat.toFixed(4)+', '+L.ch.lon.toFixed(4)+'). غيّره إذا كنت تريد خريطة العودة على مكان آخر، فالمكان يغيّر الطالع والبيوت لا لحظة عودة الشمس.</p><div class="vyr-coords" hidden><label>خط العرض · شمال موجب وجنوب سالب<input class="vyr-lat" type="number" min="-89" max="89" step="any" value="'+L.ch.lat+'"></label><label>خط الطول · شرق موجب وغرب سالب<input class="vyr-lon" type="number" min="-180" max="180" step="any" value="'+L.ch.lon+'"></label></div><button type="button" class="vyr-go">احسب العودة السنوية</button><div class="vyr-out" aria-live="polite"></div><p class="vad-note">المدرسة: العودة النجمية مع لاهيري، وبيوت البرج الكامل. مونثا تتقدم برجًا لكل سنة مكتملة من طالع الميلاد. التوقيت معروض بـUTC وتوقيت جهاز العرض، ولا يغيّر الحساب.</p><p class="vad-note">هذه طبقة الخريطة السنوية وليست تقرير تاجيكا كاملًا. حاكم السنة يخضع لفحص دوروفا، والقوة ثم الاتصال ثم عدد المناصب وحسم التعادل، وقاعدة استبدال القمر. عند غياب اتصال الخمسة نتبع موكتافالي ونفحص حاكم طالع السنة. حدود الاحتراق وقرب العقدة وإيثاسالا القمر المستقبلية قد تبقى غير محسومة؛ تظهر أسباب الاستبعاد والفحوص المعلقة دون إجبار حاكم. سهم بونيا وحده هنا، لا السهام الخمسون ولا اليوغات الست عشرة كاملة. التطبيق والانفصال هنا وصف عددي لحظي، وليس حكم إيثاسالا كاملًا. الأرقام الفلكية لا تثبت صحة التنبؤات.</p>';
  el.querySelector('.vyr-place').addEventListener('change',function(){el.querySelector('.vyr-coords').hidden=this.value!=='custom';});
  function fmt(ms,tz){return new Intl.DateTimeFormat('ar-EG',{timeZone:tz,dateStyle:'long',timeStyle:'medium'}).format(new Date(ms));}
  function deg(l){return window.AqVedic.T.SG[Math.floor(norm(l)/30)]+' '+(norm(l)%30).toFixed(4)+'°';}
  function run(){var out=el.querySelector('.vyr-out');try{
    var custom=el.querySelector('.vyr-place').value==='custom',lat=custom?Number(el.querySelector('.vyr-lat').value):L.ch.lat,lon=custom?Number(el.querySelector('.vyr-lon').value):L.ch.lon;
    if(custom&&(el.querySelector('.vyr-lat').value.trim()===''||el.querySelector('.vyr-lon').value.trim()===''))throw new Error('أدخل خط العرض والطول معًا.');
    var r=calculate(L.ch,L.natal,Number(el.querySelector('.vyr-year').value),{lat:lat,lon:lon}),SG=window.AqVedic.T.SG,zone=Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC';
    var h='<h5>العودة رقم '+r.age+' · سنة '+r.year+'</h5><div class="vyr-moment"><span>لحظة العودة · UTC</span><b>'+fmt(r.returnMs,'UTC')+'</b><span>توقيت جهاز العرض · '+esc(zone)+'</span><b>'+fmt(r.returnMs,zone)+'</b><small>السنة تنتهي عند العودة التالية: '+fmt(r.nextMs,'UTC')+' UTC</small></div><p class="vad-note">مكان الحساب: '+lat.toFixed(4)+', '+lon.toFixed(4)+(custom?' · إحداثيات مختارة':' · مكان الميلاد')+'. وقت العودة هو حل عددي للزاوية؛ عرضه بالثانية لا يعني أن وقت الميلاد أو النموذج الفلكي دقيقان لثانية. في سبع حالات اختبار مستقلة كان فرق توقيت العودة عن مرجع Swiss من 13.5 إلى 57.4 ثانية زمنية، وفرق الطالع من 2.7 إلى 12.4 دقيقة قوسية. هذه فروق مقاسة في العينة وليست حدًا مضمونًا لكل التواريخ.</p><div class="vad-signs"><article><span>طالع السنة</span><b>'+SG[Math.floor(r.chart.asc/30)]+'</b><small>'+(r.chart.asc%30).toFixed(3)+'°</small></article><article><span>مونثا</span><b>'+SG[r.muntha.sign]+'</b><small>البيت '+r.muntha.house+' · حاكمها '+N[r.muntha.lord]+'</small></article></div>';
    if(window.AqVedicChart){var m=window.AqVedicChart.build(r.chart,1);h+='<div class="vyr-chart">'+window.AqVedicChart.svg(m,'خريطة العودة الشمسية النجمية '+r.year,String(r.year))+'</div>';}
    h+='<h5>القوة الخماسية ومرشحو حاكم السنة</h5><p class="vad-note">'+(r.offices.selected===null?'لم يُحسم حاكم السنة':('حاكم السنة وفق القواعد المعلنة: '+N[r.offices.selected]))+'. '+r.offices.reason+'</p><div class="vyr-candidates">';
    r.offices.candidates.forEach(function(v){h+='<article><span>'+v.role+'</span><b>'+N[v.key]+'</b><small>القوة الخماسية '+v.strength.toFixed(3)+' / 20 · '+(v.aspect?'اتصال بالطالع '+v.aspect+'/60':'بلا اتصال بالطالع')+'</small>'+((v.audit&&v.audit.reasons.length)?'<small>مستبعد: '+v.audit.reasons.join('، ')+'</small>':'')+((v.audit&&v.audit.uncertain.length)?'<small>فحص غير محسوم: '+v.audit.uncertain.join('، ')+'</small>':'')+'</article>';});h+='</div><p class="vad-note">'+(r.punya===null?'سهم بونيا: لا قيمة آلية عند التباس الحد أو النهار والليل.':'سهم بونيا: '+deg(r.punya))+'. اختيار الحاكم ليس توقعًا لحدث.</p>';
    if(r.offices.strength){h+='<div class="vad-scroll" tabindex="0" aria-label="تفاصيل القوة الخماسية"><table><thead><tr><th>الكوكب</th><th>البرج /30</th><th>الشرف /20</th><th>حدّا /15</th><th>العشرية /10</th><th>التسع /5</th><th>المجموع /20</th></tr></thead><tbody>';r.offices.strength.forEach(function(v,p){h+='<tr><th>'+N[p]+'</th>'+v.parts.map(function(n){return '<td>'+n.toFixed(3)+'</td>';}).join('')+'<td>'+v.total.toFixed(3)+'</td></tr>';});h+='</tbody></table></div><p class="vad-note">تُجمع القيم الخمس ثم تُقسم على 4. علاقات تاجيكا وديّة/محايدة/عدائية، وليست الصداقة المركبة لباراشارا.</p>';}
    h+='<div class="vad-scroll" tabindex="0" aria-label="مواضع الكواكب في خريطة العودة"><table><thead><tr><th>الكوكب</th><th>موضعه النجمي</th><th>البيت</th><th>الحركة</th></tr></thead><tbody>';
    K.forEach(function(k,p){var b=body(r.chart,k);h+='<tr><th>'+N[p]+'</th><td>'+deg(b.lon)+'</td><td>'+b.house+'</td><td>'+(b.retro?'راجع':'مباشر')+'</td></tr>';});var nd=body(r.chart,'node');h+='<tr><th>كيتو</th><td>'+deg(nd.lon+180)+'</td><td>'+((Math.floor(norm(nd.lon+180)/30)-Math.floor(r.chart.asc/30)+12)%12+1)+'</td><td>راجع</td></tr></tbody></table></div><h5>اتصالات تاجيكا ضمن الأورب</h5><div class="vyr-aspects">';
    var aa=r.aspects.filter(function(a){return a.within;});
    aa.forEach(function(a){h+='<article><b>'+N[a.a]+' · '+N[a.b]+'</b><span>'+(a.friendly?'اتصال ودي':'اتصال متوتر')+' · '+a.angle+'°</span><small>الفارق '+a.orb.toFixed(3)+'° من أورب '+a.limit+'° · '+a.status+'</small></article>';});if(!aa.length)h+='<p>لا توجد اتصالات ضمن أورب الكوكب الأسرع.</p>';h+='</div><p class="vad-note">اتصالات تاجيكا تختلف عن درِشتي باراشارا: الثالث/الحادي عشر والخامس/التاسع ودية؛ الأول/السابع والرابع/العاشر متوترة. وصفها تقليدي وليس ضمانًا لحدث. شمس العودة: '+deg(body(r.chart,'sun').lon)+'، والهدف: '+deg(r.target)+'.</p>';
    out.innerHTML=h;out.dataset.returnMs=String(r.returnMs);out.dataset.muntha=String(r.muntha.sign);
   }catch(e){out.innerHTML='<p class="vad-warning"></p>';out.firstChild.textContent=e.message;delete out.dataset.returnMs;}}
  el.querySelector('.vyr-go').addEventListener('click',run);run();return el;
 }
 window.AqVarshaphala={calculate:calculate,createCard:createCard,math:{sunAt:sunAt,root:root,muntha:muntha,tajika:tajika,pancha:pancha,hadda:hadda,punya:punya,officeHolders:officeHolders,joining:joining,screenDuru:screenDuru,rankOffices:rankOffices,moonReplacement:moonReplacement}};
})();

;
/* assets/js/vedic-hub.js */
/* شاشة أيقونات الفلك الفيدي: بعد الحساب تظهر شبكة أيقونات، وكل أيقونة تفتح قسمها وحده بدون بقية الخرائط. */
(function () {
  'use strict';
  var sec = document.getElementById('astro-maps'), content = document.getElementById('eam-content');
  if (!sec || !content) return;
  var IC = {
    varshaphala: '<circle cx="12" cy="12" r="8"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4M9 12l2 2 4-5"/>',
    shadbala: '<path d="M4 20V9M12 20V4M20 20v-7M2 20h20"/>',
    ashtakavarga: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
    pratyantar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 5v7l3 2"/>',
    c1: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/><path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5"/>',
    cmoon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    csun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
    c2: '<circle cx="12" cy="12" r="8.5"/><path d="M14.5 9.2c-.4-1-1.3-1.5-2.5-1.5-1.5 0-2.5.7-2.5 1.8s1 1.5 2.5 1.8 2.5.7 2.5 1.8-1 1.8-2.5 1.8c-1.2 0-2.1-.5-2.5-1.5M12 6v1.7M12 16.3V18"/>',
    c3: '<circle cx="8" cy="8" r="2.6"/><circle cx="16.5" cy="8.5" r="2.2"/><path d="M3.5 19c0-3.4 2-5.5 4.5-5.5s4.5 2.1 4.5 5.5M13.5 14.2c.9-.5 1.9-.7 3-.2 1.9.8 3 2.6 3 5"/>',
    c4: '<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>',
    c5: '<path d="M4 18l-1-9 5 4 4-7 4 7 5-4-1 9z"/><path d="M5 21h14"/>',
    c6: '<path d="M3 19l6-10 4 6 3-4 5 8z"/>',
    c7: '<path d="M12 20v-8"/><path d="M12 12c0-4 3-6 6.5-6 0 4-2.5 6-6.5 6z"/><path d="M12 15c0-3-2-5-5.5-5 0 3 2.2 5 5.5 5z"/>',
    c8: '<path d="M20 11a8 8 0 0 0-14-4M4 4v4h4M4 13a8 8 0 0 0 14 4M20 20v-4h-4"/>',
    c9: '<circle cx="9" cy="14.5" r="4.5"/><circle cx="15.5" cy="14.5" r="4.5"/><path d="M10.5 4.5l1.5-2 1.5 2-1.5 2.2z"/>',
    c10: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V5.5h6V8M3 13.5h18"/>',
    c11: '<path d="M4 17l5-5 4 3 7-8"/><path d="M15 7h5v5"/>',
    c12: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/>',
    c16: '<path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M9 4l-2 5 5 11M15 4l2 5-5 11"/>',
    c20: '<path d="M12 3c3 3.200 5 5.200 5 8a5 5 0 0 1-10 0c0-2.800 2-4.800 5-8z"/><path d="M12 21v-4"/>',
    c24: '<path d="M3 5h6a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H3z"/><path d="M21 5h-6a3 3 0 0 0-3 3v11a2 2 0 0 1 2-2h7z"/>',
    c27: '<path d="M13 3L5 13.500h6L10 21l8-10.500h-6z"/>',
    c30: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
    c40: '<circle cx="12" cy="9" r="4.500"/><path d="M12 13.500V21M8.500 18h7"/>',
    c45: '<circle cx="10" cy="14" r="5"/><path d="M13.700 10.300L20 4M15 4h5v5"/>',
    c60: '<path d="M12 12c-2-3-3-4-5-4a4 4 0 0 0 0 8c2 0 3-1 5-4s3-4 5-4a4 4 0 0 1 0 8c-2 0-3-1-5-4z"/>',
    birth: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/><path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5"/>',
    vargas: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 4l16 16M20 4L4 20M12 4l8 8-8 8-8-8z"/>',
    moonsun: '<path d="M15 5.5A6.5 6.5 0 1 0 15 18.5 5 5 0 0 1 15 5.5z"/><circle cx="18" cy="8" r="2"/>',
    dasha: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
    sade: '<circle cx="12" cy="12" r="3.2"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-20 12 12)"/>',
    lunar: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    expert: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    year: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8z"/>',
    event: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4M9 14.500l2 2 4-4"/>'
  };
  var TILES = [
    ['birth', 'خريطة الميلاد', 'العجلة والكواكب والاتصالات'],
    ['vargas', 'الخرائط المقسمة', 'من D1 إلى D60 بالرسمين'],
    ['moonsun', 'خريطتا القمر والشمس', 'مشاعرك وجوهرك'],
    ['dasha', 'فترات عمرك', 'الفترة الكبرى والصغرى التي تعيشها الآن', 'داشا · فيمشوتاري'],
    ['varshaphala', 'العودة الشمسية الفيدية', 'لحظة العودة والطالع ومونثا والقوة الخماسية', 'فارشافالا'],
    ['shadbala', 'قوة الكواكب', 'القوى الست ومكوناتها الحسابية', 'شادبالا'],
    ['ashtakavarga', 'نقاط البروج', 'الجداول السبعة والمجموع العام ومصدر كل نقطة', 'أشتاكافارغا'],
    ['pratyantar', 'الفترات الدقيقة', 'الكبرى والصغرى والتسع فترات بموعد البداية والنهاية', 'براتيانتر داشا'],
    ['sade', 'اختبار زحل', 'أين زحل من قمرك الآن', 'زحل · ساتي ساتي'],
    ['lunar', 'المنزل القمري', 'منزلك وحاكمه', 'القمر · نكشاترا'],
    ['year', 'قراءة السنة', 'ما تعيشه الآن'],
    ['expert', 'وضع الخبير', 'ملاحظات خاصة بك وحدك']
  ];
  var CH = {
    1: ['الخريطة الميلادية', 'راشي', 'D1', 'الخريطة الأم لجسدك وشخصيتك ومسار حياتك'],
    moon: ['خريطة القمر', 'تشاندرا لاغنا', 'القمر', 'مشاعرك وعقلك وأمانك الداخلي'],
    sun: ['خريطة الشمس', 'سوريا لاغنا', 'الشمس', 'جوهرك وإرادتك وحضورك'],
    2: ['خريطة المال', 'هورا', 'D2', 'ما تجمعه بجهدك وما يأتيك بالدعم'],
    3: ['خريطة الإخوة والشجاعة', 'دريكانا', 'D3', 'إخوتك ومبادراتك ومهاراتك العملية'],
    4: ['خريطة البيت والاستقرار', 'تشاتورثامشا', 'D4', 'السكن والعقار وما يمنحك الأمان'],
    5: ['خريطة النفوذ', 'بانتشامشا', 'D5', 'مكانتك وتأثيرك بين الناس'],
    6: ['خريطة الضغوط', 'شاشثامشا', 'D6', 'ما يرهقك وكيف تتعامل معه'],
    7: ['خريطة الأبناء', 'سابتامشا', 'D7', 'الأبناء والإبداع وما تتركه بعدك'],
    8: ['خريطة التحولات', 'أشتامشا', 'D8', 'المفاجآت وما يتغير في حياتك دفعة واحدة'],
    9: ['خريطة الزواج', 'نافامشا', 'D9', 'الشريك ونضج العلاقات والنصف الثاني من العمر'],
    10: ['خريطة المهنة', 'داشامشا', 'D10', 'طريقك المهني وما تُعرف به'],
    11: ['خريطة المكاسب', 'رودرامشا', 'D11', 'ما يأتيك دون ترتيب مسبق'],
    12: ['خريطة الوالدين', 'دوادشامشا', 'D12', 'ما ورثته من والديك وأصلك'],
    16: ['خريطة الراحة', 'شوداشامشا', 'D16', 'الرفاهية والمركبات والمتع المادية'],
    20: ['خريطة الروح', 'فيمشامشا', 'D20', 'نموك الروحي وصفاؤك الداخلي'],
    24: ['خريطة التعليم', 'سيدهامشا', 'D24', 'الدراسة والمعرفة والنجاح فيها'],
    27: ['خريطة القوة', 'بهامشا', 'D27', 'قوتك وتحملك الفطريان'],
    30: ['خريطة التحديات', 'تريمشامشا', 'D30', 'الاختبارات الخفية وما يتعبك دون أن يظهر'],
    40: ['خريطة خط الأم', 'خافيدامشا', 'D40', 'ما انتقل إليك من جهة الأم'],
    45: ['خريطة خط الأب', 'أكشافيدامشا', 'D45', 'ما انتقل إليك من جهة الأب'],
    60: ['خريطة الكارما', 'شاشتيامشا', 'D60', 'رصيدك الأعمق، ويحتاج وقت ميلاد دقيقًا']
  };
  function chName(k) { var c = CH[k]; return c[0] + ' (' + c[1] + ' · ' + c[2] + ')'; }
  var CHG = [['الأساس', ['1', 'moon', 'sun']], ['الحياة اليومية', ['2', '3', '4', '5', '6', '7']], ['المسار والعمق', ['8', '9', '10', '11', '12']], ['التخصص الدقيق', ['16', '20', '24', '27', '30', '40', '45', '60']]];
  var TIMET = ['dasha', 'pratyantar', 'ashtakavarga', 'shadbala', 'varshaphala', 'sade', 'lunar', 'year', 'expert'];
  var ALIAS = { birth: 'c:1', vargas: 'c:1', moonsun: 'c:moon' };
  function tileOf(id) { return TILES.filter(function (t) { return t[0] === id; })[0]; }
  function tilesHTML(admin) {
    var h = CHG.map(function (g) {
      return '<h5 class="vh-gh">' + g[0] + '</h5><div class="vh-cg' + ('') + '">' + g[1].map(function (k) {
        var c = CH[k]; return '<button type="button" class="vh-tile vh-tile-m" data-g="c:' + k + '"><span class="vh-ic">' + svg('c' + (k === 'moon' ? 'moon' : k === 'sun' ? 'sun' : k)) + '</span><span class="vh-t">' + c[0] + '</span><span class="vh-v">' + c[1] + ' · ' + c[2] + '</span><span class="vh-s">' + c[3] + '</span></button>';
      }).join('') + '</div>';
    }).join('');
    h += '<h5 class="vh-gh">الأزمنة والتنبؤ</h5><div class="vh-grid">' + TIMET.filter(function (id) { return id !== 'expert' || admin; }).map(function (id) {
      var t = tileOf(id); return '<button type="button" class="vh-tile" data-g="' + id + '"' + (id === 'expert' ? ' data-admin="1"' : '') + '><span class="vh-ic">' + svg(id) + '</span><span class="vh-t">' + t[1] + '</span>' + (t[3] ? '<span class="vh-v">' + t[3] + '</span>' : '') + '<span class="vh-s">' + t[2] + '</span></button>';
    }).join('') + '</div>';
    return h;
  }
  var TARGET = null, PUSHED = 0;
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a) TARGET = a.getAttribute('data-vh') || null;
  }, true);
  function svg(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[k] + '</svg>'; }
  function groupOf(t) {
    if (/عجلة|جدول|اتصال/.test(t)) return 'c:1';
    if (/منزل/.test(t)) return 'lunar';
    if (/سنتك|قراءة/.test(t)) return 'year';
    if (/فترة|الفترات/.test(t)) return 'dasha';
    return null;
  }
  var LK = ['ketu', 'venus', 'sun', 'moon', 'mars', 'node', 'jupiter', 'saturn', 'mercury'], __notes = null;
  function loadNotes(cb) {
    var sb = window.aqeeqSupabase; if (!sb || !isAdmin()) return;
    if (__notes) { cb(__notes); return; }
    sb.from('expert_notes').select('chart,planet,house,note').then(function (r) {
      if (r.error) return; var n = {};
      (r.data || []).forEach(function (x) { ((n[x.chart] = n[x.chart] || {})[x.planet] = n[x.chart][x.planet] || {})[x.house] = x.note; });
      __notes = n; cb(n);
    }, function () {});
  }
  function fillSlots(root) {
    var slots = root.querySelectorAll('.vh-ex-slot'); if (!slots.length || !isAdmin()) return;
    loadNotes(function (n) {
      Array.prototype.forEach.call(slots, function (el) {
        var h = '';
        if (el.dataset.sade) { var t = n.sade && n.sade.saturn && n.sade.saturn[el.dataset.sade]; if (t) h = '<b>ملاحظة الخبير على المرحلة</b>' + nt(t) + ''; }
        if (el.dataset.dl) el.dataset.dl.split(',').forEach(function (q) {
          var a = q.split(':'), t = n.d1 && n.d1[a[1]] && n.d1[a[1]][+a[2] + 1];
          if (t) h += '<b>' + esc(a[0]) + ' في بيتك ' + (+a[2] + 1) + '</b>' + nt(t) + '';
        });
        if (h) { el.innerHTML = h; el.hidden = false; }
      });
    });
  }
  function sadeCard(result) {
    var SS = window.AqVedic && window.AqVedic.T && window.AqVedic.T.SS, cur = '';
    result.querySelectorAll('.eam-acc-body p').forEach(function (p) { if (/ساتي ساتي/.test(p.textContent) && !cur) { cur = p.textContent; p.setAttribute('data-vh-sade', '1'); } });
    if (!cur) return null;
    var d = document.createElement('section'); d.className = 'vh-sade';
    var inside = SS && SS.indexOf(cur) >= 0;
    d.innerHTML = (inside ? '' : '<p class="vh-sade-now">' + cur.replace(/</g, '&lt;') + '</p>') + (SS ? '<h5>' + (inside ? 'المراحل الثلاث، وأنت الآن في المرحلة المظللة' : 'المراحل الثلاث') + '</h5>' : '') + (SS ? '<ol class="vh-steps">' + SS.map(function (t) { return '<li' + (t === cur ? ' class="on"' : '') + '>' + t.replace(/</g, '&lt;') + '</li>'; }).join('') + '</ol>' : '') +
      (inside ? '<div class="vh-ex-slot" data-sade="' + (SS.indexOf(cur) + 1) + '" hidden></div>' : '');
    fillSlots(d);
    return d;
  }
  function isAdmin() { return !!(window.AqSession && window.AqSession.isAdmin) || document.documentElement.getAttribute('data-admin') === '1'; }
  var EXPERT_N = { d1: 1, d2: 2, d4: 4, d6: 6, d7: 7, d8: 8, d9: 9, d10: 10, d11: 11, d27: 27, d30: 30 };
  function expertCard() {
    var d = document.createElement('section'); d.className = 'vh-expert'; d.dataset.vhG = 'expert';
    d.innerHTML = '<p class="vh-ex-lead">هذا القسم لك وحدك، ويُفتح بحسابك المسجَّل. الأكواد الصغيرة تظهر الآن جنب الكواكب في صفحة الخرائط المقسمة.</p><div class="vh-ex-out" aria-live="polite"></div>';
    d.__load = function () {
      var out = d.querySelector('.vh-ex-out'); out.textContent = 'جارٍ فتح ملاحظاتك…';
      var sb = window.aqeeqSupabase;
      if (!sb || !isAdmin()) { out.textContent = 'سجّل الدخول بحساب الأدمن لتظهر ملاحظاتك.'; return; }
      sb.from('expert_notes').select('chart,planet,house,note').then(function (r) {
        if (r.error) { out.textContent = 'جدول ملاحظات الخبير غير مُجهَّز بعد.'; return; }
        var notes = {}; (r.data || []).forEach(function (x) { ((notes[x.chart] = notes[x.chart] || {})[x.planet] = notes[x.chart][x.planet] || {})[x.house] = x.note; });
        var L = window.AqVedic && window.AqVedic.last, VC = window.AqVedicChart, html = '', found = 0;
        if (!L || !VC) { out.textContent = 'احسب الخريطة أولًا.'; return; }
        Object.keys(EXPERT_N).forEach(function (k) {
          var tbl = notes[k]; if (!tbl) return;
          var n = EXPERT_N[k], v = VC.VARGAS.filter(function (x) { return x[0] === n; })[0], map = VC.build(L.ch, n), rows = '';
          map.items.forEach(function (it) {
            var t = tbl[it.key] && tbl[it.key][it.house + 1];
            if (t) { found++; var cs = VC.codesFor(map, it).map(function (c) { return '<em class="vc-code">[' + c + ']</em>'; }).join(''); rows += '<li><div class="vh-ex-h"><b>' + esc(it.name) + '</b><i>البيت ' + (it.house + 1) + '</i>' + cs + '</div>' + nt(t) + '</li>'; }
          });
          if (rows) html += '<details class="vh-ex-acc"' + (html ? '' : ' open') + '><summary><span>' + esc(v ? v[1] + ' · ' + v[2] : k) + '</span><em>' + map.items.filter(function (it) { return tbl[it.key] && tbl[it.key][it.house + 1]; }).length + '</em></summary><ul class="vh-ex-list">' + rows + '</ul></details>';
        });
        out.innerHTML = found ? html : '<p>لا توجد ملاحظات تنطبق على هذه الخريطة بعد.</p>';
      }, function () { out.textContent = 'تعذر فتح الملاحظات الآن.'; });
    };
    return d;
  }
  /* آلة الزمن: الداشا النشطة (كبرى/صغرى/دقيقة) والعبورات الفيدية في أي تاريخ فوق خريطته */
  var MON = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  function nt(t) {
    t = String(t == null ? '' : t); var s = t.split(' وفي الجلسة: '), a = s[0].split(' للخبير: '), o = '';
    function row(c, x) { return x ? '<span class="vh-nt vh-nt-' + c + '"><i>' + ({ m: 'الدلالة', e: 'للخبير', q: 'في الجلسة' }[c]) + '</i><em>' + esc(x.trim()) + '</em></span>' : ''; }
    return '<div class="vh-nts">' + row('m', a[0]) + row('e', a[1]) + row('q', s[1]) + '</div>';
  }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fdt(ms) { return new Date(ms).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }); }
  function timeCard() {
    var d = document.createElement('section'); d.className = 'vh-tm'; d.dataset.vhG = 'dasha year';
    var now = new Date(), yr = now.getFullYear(), o = function (a, b) { return '<option value="' + a + '">' + b + '</option>'; }, i, days = '', mons = '', yrs = '';
    for (i = 1; i <= 31; i++) days += o(i, i);
    MON.forEach(function (m, k) { mons += o(k + 1, m); });
    for (i = yr + 60; i >= 1920; i--) yrs += o(i, i);
    d.innerHTML = '<h5>آلة الزمن</h5><p class="vh-tm-lead">اختر أي تاريخ، ماضيًا كان أو قادمًا، لترى الفترة التي كانت تعمل فيك وقتها ومواضع الكواكب فوق خريطتك.</p>' +
      '<div class="vh-tm-row"><select class="vh-tm-d" aria-label="اليوم">' + days + '</select><select class="vh-tm-m" aria-label="الشهر">' + mons + '</select><select class="vh-tm-y" aria-label="السنة">' + yrs + '</select></div>' +
      '<button type="button" class="vh-tm-go">اعرض هذا التاريخ</button><div class="vh-tm-out" aria-live="polite"></div>';
    d.querySelector('.vh-tm-d').value = now.getDate(); d.querySelector('.vh-tm-m').value = now.getMonth() + 1; d.querySelector('.vh-tm-y').value = yr;
    d.querySelector('.vh-tm-go').addEventListener('click', function () {
      var out = d.querySelector('.vh-tm-out'), dd = +d.querySelector('.vh-tm-d').value, mm = +d.querySelector('.vh-tm-m').value, yy = +d.querySelector('.vh-tm-y').value;
      var ms = Date.UTC(yy, mm - 1, dd, 12), chk = new Date(ms);
      if (chk.getUTCDate() !== dd) { out.innerHTML = '<p class="vh-tm-err">هذا التاريخ غير موجود في الشهر المختار.</p>'; return; }
      try { out.innerHTML = timeHTML(ms); fillSlots(out); } catch (e) { console.warn(e); out.innerHTML = '<p class="vh-tm-err">تعذر حساب هذا التاريخ.</p>'; }
    });
    return d;
  }
  function pick(list, ms) { for (var i = 0; i < list.length; i++) if (ms >= list[i].s && ms < list[i].e) return list[i]; return null; }
  function timeHTML(ms) {
    var V = window.AqVedic, VC = window.AqVedicChart, E = window.AqEam, L = V && V.last;
    if (!V || !VC || !E || !L) return '<p class="vh-tm-err">احسب خريطتك أولًا.</p>';
    var ch = L.ch, natal = L.natal, T = V.T, moonB = (ch.bodies || []).filter(function (b) { return String(b.key).toLowerCase() === 'moon'; })[0];
    var birthMs = natal && isFinite(natal.utcMs) ? natal.utcMs : (ch.jde - 2440587.5) * 864e5;
    if (ms < birthMs) return '<p class="vh-tm-err">هذا التاريخ قبل ميلادك، اختر تاريخًا بعده.</p>';
    var ds = V.dashas(moonB.lon, birthMs), maha = pick(ds, ms);
    if (!maha) return '<p class="vh-tm-err">هذا التاريخ خارج دورة الفترات المحسوبة (120 سنة).</p>';
    var an = V.antars(maha), ant = pick(an, ms), pr = V.pratyantars(ant), pra = pick(pr, ms);
    var tch = E.engineChart(ms, natal), off = E.ayanamsa(tch.jde), norm = E.norm;
    var lagna = ch.known ? Math.floor(ch.asc / 30) : Math.floor(moonB.lon / 30), basis = ch.known ? 'الطالع' : 'القمر';
    var SG = T.SG, h = '';
    h += '<h6>الفترة النشطة (داشا) في ' + fdt(ms) + '</h6><ul class="vh-tm-dash"><li><span>الكبرى</span><b>' + T.LORDS[maha.lord] + '</b><i>' + fdt(maha.s) + ' إلى ' + fdt(maha.e) + '</i></li>' +
      '<li><span>الصغرى</span><b>' + T.LORDS[ant.lord] + '</b><i>' + fdt(ant.s) + ' إلى ' + fdt(ant.e) + '</i></li>' +
      '<li><span>الدقيقة</span><b>' + T.LORDS[pra.lord] + '</b><i>' + fdt(pra.s) + ' إلى ' + fdt(pra.e) + '</i></li></ul>';
    h += '<p class="vh-tm-txt">' + esc(T.LT[ant.lord]) + '</p>';
    if (isAdmin()) {
      var d1 = VC.build(ch, 1).items, dl = [[maha, 'الكبرى'], [ant, 'الصغرى']].map(function (z) {
        var key = LK[z[0].lord], it = d1.filter(function (x) { return x.key === key; })[0];
        return it ? z[1] + ' ' + T.LORDS[z[0].lord] + ':' + key + ':' + it.house : '';
      }).filter(Boolean).join(',');
      if (dl) h += '<div class="vh-ex-slot" data-dl="' + esc(dl) + '" hidden></div>';
    }
    var keys = [['sun', 'الشمس'], ['moon', 'القمر'], ['mars', 'المريخ'], ['mercury', 'عطارد'], ['jupiter', 'المشتري'], ['venus', 'الزهرة'], ['saturn', 'زحل'], ['node', 'راهو'], ['ketu', 'كيتو']], rows = '', sat = null, moonT = null, moonSign = Math.floor(moonB.lon / 30);
    keys.forEach(function (k) {
      var lon = null, retro = false, list = tch.bodies || [], j, kk;
      if (k[0] === 'ketu') { for (j = 0; j < list.length; j++) { kk = String(list[j].key).toLowerCase(); if (kk === 'node' || kk === 'truenode') { lon = norm(list[j].lon + 180); break; } } retro = true; }
      else { for (j = 0; j < list.length; j++) { kk = String(list[j].key).toLowerCase(); if (kk === k[0] || (k[0] === 'node' && (kk === 'node' || kk === 'truenode'))) { lon = list[j].lon; retro = k[0] === 'node' || !!list[j].retro; break; } } }
      if (lon == null) return;
      var sg = Math.floor(norm(lon - off) / 30), hs = (sg - lagna + 12) % 12, hm = (sg - moonSign + 12) % 12;
      if (k[0] === 'saturn') sat = hm;
      rows += '<tr><th>' + k[1] + (retro && k[0] !== 'node' && k[0] !== 'ketu' ? ' ℞' : '') + '</th><td>' + SG[sg] + '</td><td>' + (hs + 1) + '</td><td>' + (hm + 1) + '</td></tr>';
    });
    h += '<h6>العبورات الفيدية فوق خريطتك (غوتشارا)</h6><div class="eam-table-wrap"><table class="eam-table"><thead><tr><th>الكوكب</th><th>البرج</th><th>البيت من ' + basis + '</th><th>البيت من القمر</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    var SS = T.SS, idx = sat === 11 ? 0 : sat === 0 ? 1 : sat === 1 ? 2 : -1;
    h += '<p class="vh-tm-txt">' + (idx >= 0 ? esc(SS[idx]) : 'في هذا التاريخ كان زحل خارج دائرة ساتي ساتي بالنسبة لقمرك.') + '</p>';
    h += '<p class="vh-tm-note">هذه قراءة تحليلية محتملة لطاقة الفترة، وليست تنبؤًا بحدث بعينه. الفترة تُظهر المناخ العام، والعبورات تُظهر أين يضغط الوقت على خريطتك، وما يحدث فعلًا يتوقف على ظروفك وقراراتك.</p>';
    return h;
  }

  function accEl(title, ic, html, open, g) {
    var d = document.createElement('details'); d.className = 'eam-acc eam-t-g'; d.dataset.vhG = g; if (open) d.open = true;
    d.innerHTML = '<summary><span class="eam-acc-ic">' + svg(ic) + '</span><span class="eam-acc-t">' + title + '</span><span class="eam-acc-ch" aria-hidden="true"></span></summary><div class="eam-acc-body">' + html + '</div>';
    return d;
  }
  function span(ms) {
    var d = Math.max(0, Math.round(ms / 864e5)), y = Math.floor(d / 365.25), m = Math.round((d - y * 365.25) / 30.44);
    if (m === 12) { y++; m = 0; }
    return (y ? y + ' سنة' : '') + (y && m ? ' و' : '') + (m ? m + ' شهر' : (y ? '' : 'أيام قليلة'));
  }
  var PH = [
    ['الاقتراب', 'زحل في البرج الذي قبل برج قمرك', [
      'تبدأ المرحلة حين يدخل زحل البرج الذي يسبق برج قمرك. هنا يضغط الوقت على ما يخرج منك: المصروفات، والنوم، والراحة، والأماكن البعيدة، والمشاعر التي تكتمها.',
      'تحس أن الحمل يزيد قبل أن تعرف السبب، وأن طاقتك تتسرب في التزامات لم تخترها. كثيرون يظنون في هذه الفترة أن الدنيا تضيق، وهي في الحقيقة تطلب منك ترتيب ما أهملته.',
      'كيف تستفيد منها: رتّب مصاريفك، وقلّل الالتزامات التي لا تعنيك، وثبّت مواعيد نومك، ولا تأخذ قرارًا كبيرًا وأنت متعب.']],
    ['الذروة', 'زحل فوق برج قمرك', [
      'هذه أثقل مراحل ساتي ساتي نفسيًا، لأن زحل يمر فوق برج قمرك نفسه، فيمس المزاج والشعور بالأمان والبيت والعلاقات القريبة.',
      'تنكشف فيها الأشياء التي كنت تعتمد عليها دون أن تفحصها: علاقة تتعب، أو عادة تستنزفك، أو يقين ورثته ولم تختبره. يزيد الميل للوحدة والمراجعة، وقد تبدو الأيام أبطأ من العادة.',
      'كيف تستفيد منها: خفّف الأحمال بقدر ما تستطيع، وثبّت روتينًا بسيطًا لا يتغير، ولا تقطع علاقة في عز الضغط، واطلب سندًا من شخص تثق به.']],
    ['الانفراج', 'زحل في البرج الذي بعد برج قمرك', [
      'حين ينتقل زحل إلى البرج الذي بعد برج قمرك يخف الضغط تدريجيًا، ويتجه الاهتمام إلى المال والكلام والأسرة، أي إلى ما تبنيه بعد الاختبار.',
      'هذه مرحلة الحصاد البطيء: ما عملته بصبر يبدأ يظهر، وما لم يكن صالحًا للبقاء يسقط بهدوء. قد تبقى بعض آثار التعب، لكنها تتراجع مع الوقت.',
      'كيف تستفيد منها: سدّد الالتزامات القديمة، وابنِ مدخراتك بتؤدة، وانتبه لكلامك مع أهلك لأن الحدة تعود بسهولة في هذه المرحلة.']]
  ];
  function sadeCycles(L) {
    var E = window.AqEam, natal = L.natal, ch = L.ch, norm = E.norm;
    var moonB = (ch.bodies || []).filter(function (b) { return String(b.key).toLowerCase() === 'moon'; })[0];
    var ms0 = Math.floor(moonB.lon / 30), targets = [(ms0 + 11) % 12, ms0, (ms0 + 1) % 12];
    function sign(ms) {
      var tch = E.engineChart(ms, natal), off = E.ayanamsa(tch.jde), l = tch.bodies || [], i;
      for (i = 0; i < l.length; i++) if (String(l[i].key).toLowerCase() === 'saturn') return Math.floor(norm(l[i].lon - off) / 30);
      return -1;
    }
    var DAY = 864e5, now = Date.now(), start = now - 34 * 365.25 * DAY, end = now + 34 * 365.25 * DAY, step = 20 * DAY;
    var prev = sign(start), segs = [{ sign: prev, s: start }], t;
    for (t = start + step; t <= end; t += step) {
      var sg = sign(t);
      if (sg !== prev) {
        var lo = t - step, hi = t;
        while (hi - lo > DAY) { var mid = (lo + hi) / 2; if (sign(mid) === prev) lo = mid; else hi = mid; }
        segs[segs.length - 1].e = hi; segs.push({ sign: sg, s: hi }); prev = sg;
      }
    }
    segs[segs.length - 1].e = end;
    var cl = [], cur = null;
    segs.forEach(function (g) {
      var k = targets.indexOf(g.sign); if (k < 0) return;
      if (!cur || g.s - cur.e > 2 * 365.25 * DAY) { cur = { s: g.s, e: g.e, ph: [null, null, null] }; cl.push(cur); }
      cur.e = g.e; cur.s = Math.min(cur.s, g.s);
      var p = cur.ph[k]; cur.ph[k] = p ? { s: Math.min(p.s, g.s), e: Math.max(p.e, g.e) } : { s: g.s, e: g.e };
    });
    cl = cl.filter(function (c) { return c.s > start + 40 * DAY && c.e < end - 40 * DAY && c.ph.every(Boolean); });
    return { cl: cl, targets: targets, now: now };
  }
  function fillSade(result) {
    var V = window.AqVedic, L = V && V.last, SG = V.T.SG, host = result;
    var out = [];
    try {
      var D = sadeCycles(L), now = D.now, c = null, nxt = null, prv = null, i;
      for (i = 0; i < D.cl.length; i++) { if (now >= D.cl[i].s && now < D.cl[i].e) c = D.cl[i]; else if (D.cl[i].s > now && !nxt) nxt = D.cl[i]; else if (D.cl[i].e <= now) prv = D.cl[i]; }
      if (c && nxt === null) { /* keep */ }
      var rng = function (p) { return 'من ' + fdt(p.s) + ' إلى ' + fdt(p.e); };
      var now1 = '', k = -1;
      if (c) {
        for (i = 0; i < 3; i++) if (now >= c.ph[i].s && now < c.ph[i].e) k = i;
        if (k < 0) k = now < c.ph[1].s ? 0 : (now < c.ph[2].s ? 1 : 2);
        var p = c.ph[k];
        now1 = '<p class="vh-sade-now">أنت الآن داخل ساتي ساتي، في المرحلة ' + ['الأولى', 'الثانية', 'الثالثة'][k] + ' (' + PH[k][0] + '): ' + PH[k][1] + ' (' + SG[D.targets[k]] + ').</p>' +
          '<ul class="vh-sade-facts"><li><span>بدأت المرحلة</span><b>' + fdt(p.s) + '</b></li><li><span>تنتهي</span><b>' + fdt(p.e) + '</b></li><li><span>مضى منها</span><b>' + span(now - p.s) + '</b></li><li><span>المتبقي</span><b>' + span(p.e - now) + '</b></li></ul>' +
          '<p class="vh-sade-cyc">الدورة كلها ' + rng(c) + '، أي نحو ' + span(c.e - c.s) + '.</p><div class="vh-ex-slot" data-sade="' + (k + 1) + '" hidden></div>';
      } else {
        now1 = '<p class="vh-sade-now">أنت الآن خارج ساتي ساتي.' + (nxt ? ' تبدأ الدورة القادمة في ' + fdt(nxt.s) + '، بعد ' + span(nxt.s - now) + '.' : '') + (prv ? ' وانتهت آخر دورة في ' + fdt(prv.e) + '.' : '') + '</p>';
      }
      out.push(accEl('أين زحل منك الآن', 'sade', now1, true, 'sade'));
      var show3 = c || nxt || prv;
      if (show3) {
        out.push(accEl('مراحل ساتي ساتي بتواريخها', 'dasha', '<p class="vh-sade-cyc">' + (c ? 'الدورة الحالية' : nxt ? 'الدورة القادمة' : 'آخر دورة') + '</p><ol class="vh-steps">' + show3.ph.map(function (p, j) { return '<li' + (c && j === k ? ' class="on"' : '') + '><b>' + ['المرحلة الأولى: ', 'المرحلة الثانية: ', 'المرحلة الثالثة: '][j] + PH[j][0] + ' · ' + SG[D.targets[j]] + '</b><br>' + rng(p) + '<br><small>المدة: ' + span(p.e - p.s) + '</small></li>'; }).join('') + '</ol>', false, 'sade'));
      }
      out.push(accEl('ماذا تعني فترة زحل عليك', 'star', PH.map(function (x, j) { return '<h6>' + ['الأولى', 'الثانية', 'الثالثة'][j] + ': ' + x[0] + '</h6>' + x[2].map(function (t) { return '<p>' + t + '</p>'; }).join(''); }).join(''), false, 'sade'));
      var cyc = D.cl.map(function (z) { return '<li' + (z === c ? ' class="on"' : '') + '>' + rng(z) + (z === c ? ' (الحالية)' : z.s > now ? ' (قادمة)' : ' (سابقة)') + '</li>'; }).join('');
      if (cyc) out.push(accEl('دورات زحل السابقة والقادمة', 'event', '<ol class="vh-steps">' + cyc + '</ol><p class="vh-tm-note">كل دورة تتكرر كل نحو ثلاثين سنة، وتُحسب من دخول زحل البرج الذي قبل قمرك حتى خروجه من البرج الذي بعده.</p>', false, 'sade'));
    } catch (e) { console.warn(e); out = [accEl('ساتي ساتي', 'sade', '<p class="vh-tm-err">تعذر حساب الدورات الآن.</p>', true, 'sade')]; }
    out.forEach(function (d) { result.appendChild(d); fillSlots(d); });
  }
  function d1Card() {
    var VC = window.AqVedicChart, L = window.AqVedic && window.AqVedic.last; if (!VC || !L) return null;
    var style = 'n'; try { style = localStorage.getItem('aq-vedic-style') === 's' ? 's' : 'n'; } catch (e) { }
    var d = accEl('خريطة الميلاد بالمربع الهندي', 'birth', '', true, 'birth'), body = d.querySelector('.eam-acc-body');
    function draw() {
      var map = VC.build(L.ch, 1), title = 'خريطة الميلاد · راشي D1';
      body.innerHTML = '<div class="vc-styles" role="group" aria-label="شكل الرسم"><button type="button" class="vc-st' + (style === 'n' ? ' on' : '') + '" data-s="n">شمالي</button><button type="button" class="vc-st' + (style === 's' ? ' on' : '') + '" data-s="s">جنوبي</button></div><div class="vc-chartwrap">' + (style === 's' ? VC.svgSouth(map, title) : VC.svg(map, title)) + '</div><p class="vc-key"><i class="vc-t-n">نور</i><i class="vc-t-s">ظل</i><i class="vc-t-g">الشمس</i><i class="vc-t-l">الطالع</i></p>';
      Array.prototype.forEach.call(body.querySelectorAll('.vc-st'), function (b) { b.addEventListener('click', function () { style = b.dataset.s; try { localStorage.setItem('aq-vedic-style', style); } catch (e) { } draw(); }); });
    }
    draw(); return d;
  }
  (function pre() {
    var form = document.getElementById('eam-form'); if (!form) return;
    var nav = document.createElement('nav'); nav.className = 'vh-hub vh-pre'; nav.setAttribute('aria-label', 'أقسام الفلك الفيدي');
    nav.innerHTML = tilesHTML(false);
    var ask = document.createElement('div'); ask.className = 'vh-ask-head'; ask.hidden = true;
    ask.innerHTML = '<button type="button" class="vh-ask-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg><span>كل الأقسام</span></button><h3></h3><p></p>';
    form.parentNode.insertBefore(nav, form); form.parentNode.insertBefore(ask, form);
    function toAsk(g) {
      TARGET = g;
      var nm = g.indexOf('c:') === 0 ? chName(g.slice(2)) : ((tileOf(g) || [])[1] || ''), ds = g.indexOf('c:') === 0 ? CH[g.slice(2)][3] : ((tileOf(g) || [])[2] || '');
      ask.querySelector('h3').textContent = nm; ask.querySelector('p').textContent = ds + '. أدخل بيانات ميلادك ثم اضغط احسب، وسنفتح لك هذه الصفحة مباشرة.';
      ask.hidden = false; sec.classList.add('vh-ask');
      try { history.pushState({ vha: 1 }, ''); PUSHED++; } catch (x) { }
      setTimeout(function () { try { sec.querySelector('.y27-intro').scrollIntoView({ block: 'start' }); } catch (x) { } }, 40);
    }
    function toPick() { TARGET = null; ask.hidden = true; sec.classList.remove('vh-ask'); }
    window.__vhToPick = toPick;
    nav.addEventListener('click', function (e) { var b = e.target.closest('.vh-tile'); if (b) toAsk(b.dataset.g); });
    ask.querySelector('.vh-ask-back').addEventListener('click', function () { if (PUSHED > 0) history.back(); else toPick(); });
    setInterval(function () {
      if (sec.classList.contains('eam-view-result') && sec.classList.contains('vh-ask')) { ask.hidden = true; sec.classList.remove('vh-ask'); }
      var vedic = sec.getAttribute('data-eam-page') === 'sidereal';
      if (!vedic && sec.classList.contains('vh-ask')) { ask.hidden = true; sec.classList.remove('vh-ask'); }
      var on = vedic && !sec.classList.contains('eam-view-result') && !sec.classList.contains('vh-ask');
      nav.hidden = !on;
    }, 400);
  })();

  function enhance(root) {
    Array.prototype.forEach.call(root.querySelectorAll('.eam-table-wrap'), function (w) {
      var t = w.querySelector('table'); if (!t || w.dataset.vhE) return;
      var hs = Array.prototype.map.call(t.querySelectorAll('thead th'), function (x) { return x.textContent.trim(); });
      var rows = Array.prototype.slice.call(t.querySelectorAll('tbody tr')), h = '';
      if (hs.length === 3 && hs[1] === 'من') {
        rows.forEach(function (r) { var c = r.children, on = r.classList.contains('vx-on') || /الآن/.test(c[0].textContent);
          h += '<li' + (on ? ' class="on"' : '') + '><b>' + c[0].textContent.replace(/\s*·\s*الآن/, '') + '</b>' + (on ? '<em>الآن</em>' : '') + '<span>من ' + c[1].textContent + ' &nbsp;·&nbsp; إلى ' + c[2].textContent + '</span></li>'; });
        h = '<ul class="vh-per">' + h + '</ul>';
      } else if (hs.length === 4 && hs[0] === 'الكوكب') {
        rows.forEach(function (r) { var c = r.children;
          h += '<li><b>' + c[0].textContent + '</b><i>' + c[1].textContent + '</i><span>البيت ' + c[2].textContent + ' من ' + hs[2].replace('البيت من ', '') + ' &nbsp;·&nbsp; البيت ' + c[3].textContent + ' من ' + hs[3].replace('البيت من ', '') + '</span></li>'; });
        h = '<ul class="vh-per vh-per4">' + h + '</ul>';
      } else return;
      w.dataset.vhE = '1'; w.insertAdjacentHTML('afterend', h); w.style.display = 'none';
    });
  }
  var SH = null, SHC = null;
  function sheetEnsure() {
    if (SH) return SH;
    SH = document.createElement('div'); SH.className = 'aqm-sheet vh-sheet'; SH.hidden = true;
    SH.innerHTML = '<div class="aqm-sheet-scrim" data-vhc></div><div class="aqm-sheet-panel" role="dialog" aria-modal="true"><span class="aqm-sheet-grip"></span>' +
      '<button type="button" class="aqm-sheet-x" data-vhc aria-label="إغلاق"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="aqm-sheet-head"><span class="aqm-sheet-ic"></span><div><h3></h3></div></div><div class="aqm-sheet-body"></div>' +
      '<div class="aqm-sheet-foot"><button type="button" class="aqm-foot-next" data-vhn>القسم التالي</button><button type="button" class="aqm-foot-close" data-vhc>إغلاق</button></div></div>';
    document.body.appendChild(SH);
    try { new MutationObserver(function () { enhance(SH); }).observe(SH.querySelector('.aqm-sheet-body'), { childList: true, subtree: true }); } catch (x) { }
    SH.addEventListener('click', function (e) { if (e.target.closest('[data-vhn]')) sheetNext(); else if (e.target.closest('[data-vhc]')) sheetClose(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && SH && !SH.hidden) sheetClose(); });
    return SH;
  }
  function sheetOpen(d) {
    var s = sheetEnsure(), body = d.querySelector('.eam-acc-body'); if (!body) return;
    if (SHC) sheetClose(true);
    SHC = { d: d, body: body };
    s.querySelector('.aqm-sheet-ic').innerHTML = (d.querySelector('.eam-acc-ic') || {}).innerHTML || '';
    s.querySelector('h3').textContent = (d.querySelector('.eam-acc-t') || {}).textContent || '';
    var sb = s.querySelector('.aqm-sheet-body'); sb.innerHTML = ''; sb.appendChild(body); sb.scrollTop = 0;
    s.classList.remove('is-closing'); s.hidden = false; document.documentElement.classList.add('aqm-sheet-open');
    s.querySelector('[data-vhn]').hidden = !nextAcc(d);
  }
  function sheetClose(quick) {
    if (!SH || !SHC) return;
    SHC.d.appendChild(SHC.body); var s = SH; SHC = null;
    if (quick) return;
    s.classList.add('is-closing');
    setTimeout(function () { s.hidden = true; s.classList.remove('is-closing'); document.documentElement.classList.remove('aqm-sheet-open'); }, 230);
  }
  function nextAcc(d) {
    var r = d.closest('#eam-result'); if (!r) return null;
    var list = Array.prototype.filter.call(r.querySelectorAll(':scope > details.eam-acc'), function (x) { return x.style.display !== 'none' && !x.classList.contains('vh-inline'); });
    var i = list.indexOf(d); return i >= 0 && i < list.length - 1 ? list[i + 1] : null;
  }
  function sheetNext() { if (!SHC) return; var n = nextAcc(SHC.d); sheetClose(true); if (n) sheetOpen(n); else sheetClose(); }
  document.addEventListener('click', function (e) {
    var sm = e.target.closest && e.target.closest('#eam-result > details.eam-acc > summary'); if (!sm) return;
    var r = sm.closest('#eam-result'); if (!r || !r.__show) return;
    var d = sm.parentNode; if (d.classList.contains('vh-inline')) return;
    e.preventDefault(); e.stopImmediatePropagation(); sheetOpen(d);
  }, true);
  function build() {
    var result = content.querySelector('#eam-result');
    if (!result || result.hidden || !result.querySelector('#vx-vargas') || result.querySelector('.vh-hub')) return;
    /* الأكورديونات داخل .vx-wrap: نرفعها لمستوى النتيجة كي تُصنَّف مع أقسامها */
    Array.prototype.slice.call(result.querySelectorAll(':scope > .vx-wrap:not(.vx-top)')).forEach(function (w) {
      Array.prototype.slice.call(w.children).forEach(function (c) { result.insertBefore(c, w); });
      w.style.display = 'none'; w.dataset.vhG = 'misc';
    });
    var kids = Array.prototype.slice.call(result.children);
    kids.forEach(function (c) {
      if (c.classList.contains('eam-result-head')) c.dataset.vhG = 'hub c:1';
      else if (c.classList.contains('vx-top')) c.dataset.vhG = 'none';
      else if (c.matches('details.eam-acc')) { var t = (c.querySelector('.eam-acc-t') || {}).textContent || ''; c.dataset.vhG = groupOf(t) || 'c:1'; }
      else c.dataset.vhG = 'misc';
    });
    var sade = true;
    var grid = document.createElement('nav'); grid.className = 'vh-hub'; grid.dataset.vhG = 'hub'; grid.setAttribute('aria-label', 'أقسام الفلك الفيدي');
    grid.innerHTML = tilesHTML(isAdmin());
    var bar = document.createElement('div'); bar.className = 'vh-bar'; bar.dataset.vhG = 'bar';
    bar.innerHTML = '<button type="button" class="vh-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg><span>كل الأقسام</span></button><b class="vh-cur"></b>';
    var head = result.querySelector('.eam-result-head');
    result.insertBefore(grid, head ? head.nextSibling : result.firstChild);
    result.insertBefore(bar, grid);
    var tmc = timeCard(), tmw = accEl('آلة الزمن', 'dasha', '', true, 'dasha year'); tmw.querySelector('.eam-acc-body').appendChild(tmc); tmc.dataset.vhG = ''; result.appendChild(tmw);
    if (window.AqVarshaphala) {
      var vyw = accEl('العودة الشمسية الفيدية · فارشافالا', 'varshaphala', '', true, 'varshaphala');
      vyw.classList.add('vh-inline'); vyw.querySelector('.eam-acc-body').appendChild(window.AqVarshaphala.createCard()); result.appendChild(vyw);
    }
    if (window.AqShadbala) {
      var sbw = accEl('قوة الكواكب · شادبالا', 'shadbala', '', true, 'shadbala');
      sbw.classList.add('vh-inline'); sbw.querySelector('.eam-acc-body').appendChild(window.AqShadbala.createCard()); result.appendChild(sbw);
    }
    if (window.AqAshtakavarga) {
      var avw = accEl('نقاط البروج · أشتاكافارغا', 'ashtakavarga', '', true, 'ashtakavarga');
      avw.classList.add('vh-inline'); avw.querySelector('.eam-acc-body').appendChild(window.AqAshtakavarga.createCard()); result.appendChild(avw);
    }
    if (window.AqPratyantar) {
      var pdw = accEl('الفترات الدقيقة · براتيانتر داشا', 'pratyantar', '', true, 'pratyantar');
      pdw.classList.add('vh-inline'); pdw.querySelector('.eam-acc-body').appendChild(window.AqPratyantar.createCard()); result.appendChild(pdw);
    }
    if (isAdmin()) { var exC = expertCard(), exw = accEl('ملاحظات الخبير', 'expert', '', true, 'expert'); exw.querySelector('.eam-acc-body').appendChild(exC); exC.dataset.vhG = ''; result.appendChild(exw); result.__ex = exC; }
    function ensureChart(k) {
      if (result.__ch && result.__ch[k]) return;
      (result.__ch = result.__ch || {})[k] = 1;
      var L = window.AqVedic && window.AqVedic.last, VC = window.AqVedicChart; if (!L || !VC) return;
      var key = isNaN(+k) ? k : +k, c = CH[k], g = 'c:' + k;
      if (isAdmin()) window.AqVedicExpert = { on: true };
      var d = accEl(CH[k][0], 'birth', '', true, g); d.classList.add('vh-inline', 'vc-detail-flat');
      var host = document.createElement('section'); host.className = 'eam-card vx vc-card'; d.querySelector('.eam-acc-body').appendChild(host);
      var fb = k === '1' ? result.querySelector('details.eam-acc[data-vh-g="c:1"]') : null;
      result.insertBefore(d, fb || null); VC.mount(host, L.ch, L.natal, key);
      if (isAdmin() && /^\d+$/.test(k)) {
        var ex = accEl('ملاحظات الخبير · ' + c[0], 'expert', '<p class="vh-tm-note">جارٍ فتح الملاحظات…</p>', false, g);
        result.insertBefore(ex, fb || null);
        loadNotes(function (n) {
          var tbl = n['d' + k], map = VC.build(L.ch, +k), rows = '';
          if (tbl) map.items.forEach(function (it) {
            var t = tbl[it.key] && tbl[it.key][it.house + 1];
            if (t) rows += '<li><div class="vh-ex-h"><b>' + esc(it.name) + '</b><i>البيت ' + (it.house + 1) + '</i></div>' + nt(t) + '</li>';
          });
          ex.querySelector('.eam-acc-body').innerHTML = rows ? '<ul class="vh-ex-list">' + rows + '</ul>' : '<p class="vh-tm-note">لا توجد ملاحظات لهذه الخريطة بعد.</p>';
        });
      }
    }
    function show(g, chart) {
      g = ALIAS[g] || g;
      if (g !== 'hub' && result.dataset.vh === 'hub') { try { history.pushState({ vh: 1 }, ''); PUSHED++; } catch (e) { } }
      if (g.indexOf('c:') === 0 && !CH[g.slice(2)]) g = 'hub';
      if (g === 'sade' && !result.__sade) { result.__sade = 1; fillSade(result); }
      if (g.indexOf('c:') === 0) ensureChart(g.slice(2));
      result.dataset.vh = g;
      Array.prototype.slice.call(result.children).forEach(function (c) {
        if (c === bar) return;
        var gs = (c.dataset.vhG || '').split(' ');
        c.style.display = gs.indexOf(g) >= 0 ? '' : 'none';
      });
      var name = g.indexOf('c:') === 0 ? CH[g.slice(2)][0] : ((tileOf(g) || [])[1] || '');
      bar.querySelector('.vh-cur').textContent = g === 'hub' ? '' : name;
      bar.style.display = g === 'hub' ? 'none' : '';
      Array.prototype.forEach.call(result.querySelectorAll('details.eam-acc'), function (d) { if (!d.classList.contains('vh-inline')) d.open = false; });
      if (g === 'expert' && result.__ex) { result.__ex.__load(); }
      setTimeout(function () { try { result.scrollIntoView({ block: 'start' }); } catch (e) { } }, 30);
      setTimeout(function () { try { result.scrollIntoView({ block: 'start' }); } catch (e) { } }, 380);
    }
    grid.addEventListener('click', function (e) { var b = e.target.closest('.vh-tile'); if (b) show(b.dataset.g); });
    bar.querySelector('.vh-back').addEventListener('click', function () { show('hub'); });
    result.__show = show;
    show('hub');
    try { history.pushState({ vhr: 1 }, ''); PUSHED++; } catch (e) { }
    if (TARGET && (TARGET !== 'expert' || isAdmin())) { var tg = TARGET; TARGET = null; show(tg); } else TARGET = null;
    sec.classList.add('vh-on');
    result.classList.add('vh-ready');
  }
  function liveResult() { var r = content.querySelector('#eam-result'); return r && !r.hidden && r.__show && sec.classList.contains('eam-view-result') && location.hash === '#astro-maps' ? r : null; }
  window.addEventListener('click', function (e) {
    if (sec.classList.contains('vh-ask') && !sec.classList.contains('eam-view-result') && e.target.closest('[data-aq-back]') && PUSHED > 0 && location.hash === '#astro-maps') { e.preventDefault(); e.stopImmediatePropagation(); history.back(); return; }
    var r = liveResult(); if (!r) return;
    if (e.target.closest('[data-aq-back]') && PUSHED > 0) { e.preventDefault(); e.stopImmediatePropagation(); history.back(); return; }
    if (e.target.closest('.eam-backbar') && PUSHED > 0) { var n = PUSHED; setTimeout(function () { try { history.go(-n); } catch (x) { } }, 60); }
  }, true);
  window.addEventListener('popstate', function () {
    if (PUSHED > 0) PUSHED--;
    if (sec.classList.contains('vh-ask') && !sec.classList.contains('eam-view-result')) { if (window.__vhToPick) window.__vhToPick(); return; }
    var r = liveResult(); if (!r) return;
    if (r.dataset.vh !== 'hub') r.__show('hub');
    else { var b = content.querySelector('.eam-backbar button'); if (b) b.click(); }
  });
  var timer = null;
  var awaitT = null;
  function awaitOff() { clearTimeout(awaitT); sec.classList.remove('vh-await'); }
  document.addEventListener('submit', function (e) {
    if (!e.target || e.target.id !== 'eam-form' || sec.getAttribute('data-eam-page') !== 'sidereal') return;
    sec.classList.add('vh-await'); clearTimeout(awaitT); awaitT = setTimeout(awaitOff, 9000);
  }, true);
  function settle() {
    try { build(); prefill(); } catch (e) { console.warn(e); }
    var r = content.querySelector('#eam-result');
    if (r && !r.classList.contains('vh-ready') && r.querySelector('#vx-vargas') && !r.hidden) r.classList.add('vh-ready');
    if (r && r.classList.contains('vh-ready') && sec.classList.contains('vh-await')) awaitOff();
  }
  new MutationObserver(function () {
    clearTimeout(timer);
    var r = content.querySelector('#eam-result'), pending = r && !r.classList.contains('vh-ready') && r.querySelector('#vx-vargas');
    timer = setTimeout(settle, pending ? 30 : 320);
  })
    .observe(content, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  var filled = false;
  function prefill() {
    if (filled) return;
    var d = document.getElementById('eam-b-date'), f = document.getElementById('eam-b-fill'), C = window.AqeeqChartContext;
    if (!d || !f || d.value || !C || !C.getOrPrefill) return;
    var n = null; try { n = C.getOrPrefill(); } catch (e) { }
    if (!n) return;
    filled = true; f.click();
  }
  function go() {
    if (!TARGET) return;
    var r = content.querySelector('#eam-result');
    if (r && !r.hidden && r.__show) { var tg = TARGET; TARGET = null; r.__show(tg); return; }
    var d = document.getElementById('eam-b-date'), f = document.getElementById('eam-form');
    if (d && d.value && f) { try { f.requestSubmit(); } catch (e) { } }
  }
  window.addEventListener('hashchange', function () { if (location.hash === '#astro-maps') { setTimeout(prefill, 400); setTimeout(go, 1100); } });
  document.addEventListener('DOMContentLoaded', function () { setTimeout(prefill, 1500); });
  setTimeout(prefill, 2500);
})();

;
/* assets/js/astro-result-view.js */
/* صفحة نتيجة الخرائط المتقدمة: تفتح النتيجة وحدها (من غير النموذج)، وكل قسم أكورديون زجاجي بألوان النور والظل. */
(function () {
  'use strict';
  var sec = document.getElementById('astro-maps'), content = document.getElementById('eam-content'), result = null;
  if (!sec || !content) return;
  var IC = {
    wheel: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/><path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5"/>',
    table: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M4 10h16M10 10v9"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
    star: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
    event: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>'
  };
  function svg(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[k] || IC.star) + '</svg>'; }
  function pick(t) {
    if (/منزل|قمر/.test(t)) return ['moon', 'n'];
    if (/سنتك|قراءة|إرشاد/.test(t)) return ['sun', 'n'];
    if (/الفترات|فترة/.test(t)) return ['clock', 'g'];
    if (/اتصال/.test(t)) return ['link', 'g'];
    if (/محطات|الأحداث|كسوف/.test(t)) return ['event', 'g'];
    if (/جدول|كواكب|بيوت/.test(t)) return ['table', 'g'];
    if (/عجلة/.test(t)) return ['wheel', 'g'];
    return ['star', 'g'];
  }
  function acc(title, node, ic, tone, open) {
    var d = document.createElement('details'); d.className = 'eam-acc eam-t-' + tone; if (open) d.open = true;
    var s = document.createElement('summary');
    s.innerHTML = '<span class="eam-acc-ic">' + svg(ic) + '</span><span class="eam-acc-t">' + title + '</span><span class="eam-acc-ch" aria-hidden="true"></span>';
    var b = document.createElement('div'); b.className = 'eam-acc-body';
    node.parentNode && node.parentNode.insertBefore(d, node);
    b.appendChild(node); d.appendChild(s); d.appendChild(b);
    node.classList.add('eam-in-acc');
  }
  function toneAspects() {
    result.querySelectorAll('.eam-aspects li').forEach(function (li) {
      var t = li.textContent;
      li.classList.remove('eam-as-n', 'eam-as-s', 'eam-as-g');
      li.classList.add(/تثليث|تسديس/.test(t) ? 'eam-as-n' : /تربيع|مقابلة/.test(t) ? 'eam-as-s' : 'eam-as-g');
    });
  }
  function decorate() {
    result = content.querySelector('#eam-result');
    if (!result || result.hidden || !result.children.length) { sec.classList.remove('eam-view-result', 'eam-keep-ctl'); return; }
    if (result.__first === result.firstElementChild) return;
    result.__first = result.firstElementChild;
    var bar = content.querySelector('.eam-backbar');
    if (!bar) {
      bar = document.createElement('div'); bar.className = 'eam-backbar';
      bar.innerHTML = '<button type="button" class="eam-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg><span>تعديل البيانات أو اختيار خريطة أخرى</span></button>';
      content.insertBefore(bar, content.firstChild);
      bar.querySelector('button').addEventListener('click', function () {
        var r = content.querySelector('#eam-result'); if (r) { r.hidden = true; r.innerHTML = ''; r.__first = null; }
        sec.classList.remove('eam-view-result', 'eam-keep-ctl'); bar.remove();
        var st = document.getElementById('eam-status'); if (st) st.textContent = '';
        try { sec.scrollTo({ top: 0 }); } catch (e) { sec.scrollTop = 0; }
      });
    }
    var kids = Array.prototype.slice.call(result.children);
    kids.forEach(function (n) {
      if (n.classList.contains('eam-in-acc')) return;
      if (n.classList.contains('eam-wheel')) { acc('عجلة الخريطة', n, 'wheel', 'g', false); return; }
      if (n.classList.contains('eam-table-wrap')) { acc('جدول الكواكب', n, 'table', 'g', false); return; }
      if (n.classList.contains('eam-event-list')) { acc('الأحداث بالتفصيل', n, 'event', 'g', true); return; }
      if (n.classList.contains('vx-wrap') && !n.classList.contains('vx-top')) {
        Array.prototype.slice.call(n.querySelectorAll(':scope > section.eam-card')).forEach(function (c) {
          var h = c.querySelector('h4'), t = h ? h.textContent : 'تفاصيل'; if (h) h.remove();
          var p = pick(t); acc(t, c, p[0], p[1], false);
        });
        return;
      }
      if (n.matches('section.eam-card') && !n.classList.contains('vc-card') && n.querySelector('h4')) {
        var h = n.querySelector('h4'), t = h.textContent, p = pick(t); h.remove(); acc(t, n, p[0], p[1], false);
      }
    });
    toneAspects();
    sec.classList.toggle('eam-keep-ctl', !!content.querySelector('.eam-control #eam-year, .eam-control #eam-date'));
    sec.classList.add('eam-view-result');
    if (!result.__seen) { result.__seen = 1; try { sec.scrollTo({ top: 0 }); } catch (e) { sec.scrollTop = 0; } }
  }
  var timer = null;
  new MutationObserver(function () {
    clearTimeout(timer);
    timer = setTimeout(function () { try { decorate(); } catch (e) { console.warn(e); } }, 140);
  }).observe(content, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
})();

;
/* assets/js/year2027-offer.js */
/* Local annual prices. Geography suggests a market; visitors can always change it. */
(function(){'use strict';
 var market='EG',manual=false,country=null;
 var PRICES={EG:{amount:299,minor:29900,currency:'EGP',label:'299 ج.م',product:'year2027_egp_299',title:'مصر'},SA:{amount:39,minor:3900,currency:'SAR',label:'39 ر.س',product:'year2027_sar_39',title:'السعودية'},AE:{amount:39,minor:3900,currency:'AED',label:'39 د.إ',product:'year2027_aed_39',title:'الإمارات'},KW:{amount:3.5,minor:3500,currency:'KWD',label:'3.5 د.ك',product:'year2027_kwd_3_5',title:'الكويت'},QA:{amount:39,minor:3900,currency:'QAR',label:'39 ر.ق',product:'year2027_qar_39',title:'قطر'},BH:{amount:4,minor:4000,currency:'BHD',label:'4 د.ب',product:'year2027_bhd_4',title:'البحرين'},OM:{amount:4,minor:4000,currency:'OMR',label:'4 ر.ع',product:'year2027_omr_4',title:'عمان'},INT:{amount:14.99,minor:1499,currency:'USD',label:'14.99 $',product:'year2027_usd_14_99',title:'أمريكا وأوروبا / دول أخرى'}};
 try{market=localStorage.getItem('aq-year2027-market')||'EG';manual=localStorage.getItem('aq-year2027-market-manual')==='1';}catch(_){}if(!PRICES[market])market='EG';
 var SETTLE={SA:10.40,AE:10.62,KW:11.33,QA:10.71,BH:10.64,OM:10.40};Object.keys(SETTLE).forEach(k=>{PRICES[k].settlement=SETTLE[k];PRICES[k].product='year2027_usd_'+k.toLowerCase();});
 function price(){return PRICES[market];}
 function setMarket(m,auto){market=PRICES[m]?m:'EG';if(!auto)manual=true;try{localStorage.setItem('aq-year2027-market',market);if(!auto)localStorage.setItem('aq-year2027-market-manual','1');}catch(_){}window.dispatchEvent(new CustomEvent('aq-year2027-market'));}
 function applyCountry(c){if(!/^[A-Z]{2}$/.test(c))return;country=c;if(!manual)setMarket(PRICES[c]?c:'INT',true);}
 async function locate(){if(manual)return;try{var r=await fetch('https://api.country.is/',{credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(3500)});if(r.ok){var d=await r.json();applyCountry(d.country);}}catch(_){} }
 function begin(input){try{localStorage.setItem('aq-year2027-last',JSON.stringify(input));sessionStorage.setItem('aq-year2027-checkout',JSON.stringify({input:input,market:market,created:Date.now()}));sessionStorage.setItem('aq-pay-product',price().product);}catch(_){}location.hash='#pay';window.dispatchEvent(new Event('aq-year2027-checkout'));}
 window.AqYear2027Offer={price,setMarket,market:()=>market,begin,product:()=>price().product,applyCountry,country:()=>country,isManual:()=>manual,prices:PRICES};locate();
})();

;
/* assets/js/year2027-core.js */
/* Annual report model. All dates and longitudes are derived from the site's Lahiri engine. */
(function(root){
  'use strict';
  var DAY=86400000,START=Date.UTC(2026,10,30,22),SPLIT=Date.UTC(2027,2,31,22),END=Date.UTC(2027,11,31,22),Y0=Date.UTC(2026,11,31,22);
  var KEYS=['saturn','jupiter','rahu','ketu','mars','venus','sun','moon','mercury'];
  var NAMES={saturn:'زحل',jupiter:'المشتري',rahu:'راهو',ketu:'كيتو',mars:'المريخ',venus:'الزهرة',sun:'الشمس',moon:'القمر',mercury:'عطارد',node:'راهو'};
  var AREAS=['الذات والبدايات','الموارد والقيمة','التواصل والتعلم','البيت والجذور','القلب والإبداع','الروتين والعمل اليومي','الشراكات','الثقة والالتزامات المشتركة','المعرفة والسفر','المهنة والمكانة','الأصدقاء والأهداف','الراحة والمساحة الخاصة'];
  var RULES={saturn:[9,10],jupiter:[8,11],mars:[0,7],venus:[1,6],sun:[4],moon:[3],mercury:[2,5]};
  var norm=x=>((x%360)+360)%360,delta=(a,b)=>((a-b+540)%360)-180;
  var body=(ch,k)=>(ch.bodies||[]).find(b=>String(b.key).toLowerCase()===k);
  function point(ch,k){var b=body(ch,k==='rahu'||k==='ketu'?'node':k);if(!b)throw new Error('موضع '+(NAMES[k]||k)+' غير متاح من المحرك.');return norm(b.lon+(k==='ketu'?180:0));}
  function compute(natal,E,V){
    if(!natal||!natal.ch)throw new Error('بيانات الميلاد غير مكتملة.');
    var ch=E.siderealChart(natal),moon=body(ch,'moon');if(!moon)throw new Error('تعذر حساب قمر الميلاد.');
    var known=!!ch.known,lagna=known?Math.floor(ch.asc/30):null;
    var hOf=sg=>known?(sg-lagna+12)%12+1:null,cache=new Map();
    function sky(t){if(cache.has(t))return cache.get(t);var c=E.engineChart(t,natal),ay=E.ayanamsa(c.jde),r={};KEYS.forEach(k=>r[k]=norm(point(c,k)-ay));cache.set(t,r);return r;}
    var samples=[];for(var t=START;t<=END;t+=DAY)samples.push({t:t,p:sky(t)});
    var segs={},stations=[],hits=[];
    KEYS.forEach(k=>{
      var list=[],a=samples[0],sg=Math.floor(a.p[k]/30),s=START;
      for(var i=1;i<samples.length;i++){
        var b=samples[i],next=Math.floor(b.p[k]/30);
        if(next!==sg){var lo=a.t,hi=b.t;while(hi-lo>3600000){var mid=Math.floor((lo+hi)/2);if(Math.floor(sky(mid)[k]/30)===sg)lo=mid;else hi=mid;}
          list.push({planet:k,sign:sg,house:hOf(sg),s:s,e:hi});s=hi;sg=next;}
        if(i>1&&!['rahu','ketu','sun','moon'].includes(k)){
          var v0=delta(a.p[k],samples[i-2].p[k]),v1=delta(b.p[k],a.p[k]);
          if(v0*v1<0){var st=a.t+DAY*(-v0)/(v1-v0)-DAY/2;stations.push({planet:k,t:st,lon:sky(st)[k],direct:v1>0});}
        }
        // An actual conjunction to a natal longitude. A wrap at opposition is never a crossing.
        (ch.bodies||[]).filter(n=>['sun','moon','mercury','venus','mars','jupiter','saturn','node'].includes(n.key)).forEach(n=>{
          var d0=delta(a.p[k],n.lon),d1=delta(b.p[k],n.lon);
          if(d0*d1<=0&&Math.abs(d1-d0)<90&&d0!==d1){
            var at=a.t+(b.t-a.t)*(-d0)/(d1-d0);
            // Two secant corrections, always checked against real angular separation.
            for(var r=0;r<2;r++){var er=delta(sky(at)[k],n.lon),speed=delta(b.p[k],a.p[k])/DAY;if(Math.abs(speed)>1e-10)at=Math.max(a.t,Math.min(b.t,at-er/speed));}
            var orb=Math.abs(delta(sky(at)[k],n.lon));
            if(orb<0.05&&!hits.some(h=>h.planet===k&&h.natal===n.key&&Math.abs(h.t-at)<DAY))hits.push({planet:k,natal:n.key,t:at,lon:sky(at)[k],orb:orb});
          }
        });a=b;
      }
      list.push({planet:k,sign:sg,house:hOf(sg),s:s,e:END});segs[k]=list;
    });
    var birth=Number.isFinite(natal.utcMs)?natal.utcMs:(ch.jde-2440587.5)*DAY,periods=[];
    V.dashas(moon.lon,birth).forEach(m=>V.antars(m).forEach(a=>{if(a.e>Y0&&a.s<END)periods.push({maha:m.lord,lord:a.lord,s:Math.max(a.s,Y0),e:Math.min(a.e,END),actualStart:a.s,actualEnd:a.e});}));
    if(!periods.length)throw new Error('لا توجد فترات محسوبة لهذه السنة.');
    return {known:known,lagna:lagna,moon:moon.lon,periods:periods,segs:segs,stations:stations.sort((a,b)=>a.t-b.t),hits:hits.sort((a,b)=>a.t-b.t),revision:'lahiri-mean-v1',computedAt:Date.now()};
  }
  function periodsAt(R,now){return R.periods.find(p=>p.s<=now&&p.e>now)||R.periods.find(p=>p.s>now)||R.periods[R.periods.length-1];}
  function timeline(R){var out=[];KEYS.forEach(k=>R.segs[k].forEach(s=>{if(s.e>SPLIT)out.push(Object.assign({},s,{s:Math.max(s.s,SPLIT),family:'annual'}));}));return out.sort((a,b)=>a.s-b.s||KEYS.indexOf(a.planet)-KEYS.indexOf(b.planet));}
  function lordHouses(k,lagna){return (RULES[k]||[]).map(s=>(s-lagna+12)%12+1);}
  var api={compute:compute,timeline:timeline,periodsAt:periodsAt,lordHouses:lordHouses,KEYS:KEYS,NAMES:NAMES,AREAS:AREAS,START:START,SPLIT:SPLIT,END:END,Y0:Y0,norm:norm,delta:delta};
  root.AqYear2027Core=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

;
/* assets/js/year2027-checkout.js */
/* Annual manual checkout. Fail closed until the backend returns a verified quote. */
(function(){'use strict';var section=document.getElementById('pay');if(!section)return;var sb=()=>window.aqeeqSupabase,box=null,draft=null,quote=null,method='wallet',run=0;
 var esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function read(){try{return JSON.parse(sessionStorage.getItem('aq-year2027-checkout')||'null');}catch(_){return null;}}
 function show(html){if(!box){box=document.createElement('div');box.id='year2027-checkout';section.querySelector('.wrap').appendChild(box);}box.innerHTML=html;}
 async function refresh(){var id=++run;draft=read();if(location.hash!=='#pay'||!draft){section.classList.remove('year2027-checkout');if(box)box.hidden=true;if(location.hash!=='#pay'){try{sessionStorage.removeItem('aq-year2027-checkout');sessionStorage.removeItem('aq-pay-product');}catch(_){}}return;}
 section.classList.add('year2027-checkout');if(box)box.hidden=false;quote=null;show('<div class="pay-card"><h3>تقرير سنة 2027</h3><p role="status">نتحقق من حسابك وسعر التقرير قبل عرض بيانات التحويل...</p></div>');
 if(!sb()||!sb().auth){show('<div class="pay-card"><h3>الدفع غير متاح الآن</h3><p>لم نتمكن من التحقق من خدمة الحساب. لا تحوّل أي مبلغ. يمكنك الرجوع للقراءة المجانية والمحاولة لاحقًا.</p><a href="#year2027">الرجوع للقراءة</a></div>');return;}
 try{var s=await sb().auth.getSession();if(id!==run)return;if(!s.data.session){show('<div class="pay-card"><h3>سجّل دخولك لشراء تقرير السنة</h3><p>لن يبدأ التحويل قبل التحقق من السعر. ارجع لقراءتك بعد تسجيل الدخول واضغط شراء التقرير.</p><a class="inv-btn" href="#account">تسجيل الدخول</a></div>');return;}
 var r=await sb().rpc('year2027_quote',{p_market:window.AqYear2027Offer.prices[draft.market]?draft.market:'EG'});if(id!==run)return;if(r.error||!r.data)throw new Error('not_ready');quote=r.data;if(quote.payment_ready!==true){show('<div class="pay-card"><h3>السعر المحلي جاهز، والتحويل قيد التجهيز</h3><p>نجهز وسيلة تحصيل تدعم عملة بلدك. لا تحوّل مبلغًا بالدولار من نفسك، ولن نطلب منك تحويلًا بعملة غير مدعومة.</p><a class="inv-btn" href="#year2027">الرجوع للقراءة</a></div>');return;}
 var valid=(quote.currency==='EGP'&&[24900,29900].includes(quote.amount_cents)&&/^year2027_egp_/.test(quote.product))||(quote.currency==='USD'&&(({year2027_usd_14_99:1499,year2027_usd_sa:1040,year2027_usd_ae:1062,year2027_usd_kw:1133,year2027_usd_qa:1071,year2027_usd_bh:1064,year2027_usd_om:1040})[quote.product]===quote.amount_cents));if(!valid)throw new Error('price_mismatch');method=quote.currency==='USD'?'paypal':'wallet';render();
 }catch(_){show('<div class="pay-card"><h3>تقرير السنة لم يفتح للبيع بعد</h3><p>القراءة المجانية جاهزة. نراجع إعداد التحويل وربطه بفتح تقريرك، لذلك لا نعرض رقم محفظة أو نطلب تحويلًا الآن.</p><a class="inv-btn" href="#year2027">الرجوع للقراءة المجانية</a></div>');}}
 function render(){show('<div class="pay-card"><small>شراء مرة واحدة · بلا تجديد تلقائي</small><h3>تقرير سنة 2027</h3><p>لصاحب بيانات الميلاد المحددة في قراءتك. يفتح بعد تأكيد التحويل، ويظل متاحًا في حسابك.</p><p>السعر المحلي: '+esc(window.AqYear2027Offer.prices[draft.market].label)+'</p><b class="pay-price">'+(quote.amount_cents/100)+' '+(quote.currency==='EGP'?'ج.م':'USD')+'</b><p>عملة التحويل المطلوبة: '+quote.currency+'. لا تحوّل بعملة أخرى أو مبلغ تقريبي.</p><div class="pay-methods">'+(quote.currency==='EGP'?'<button type="button" data-y27-method="wallet" aria-pressed="'+(method==='wallet')+'">محفظة اتصالات · جنيه مصري</button>':'')+(quote.currency==='USD'?'<button type="button" data-y27-method="paypal" aria-pressed="true">PayPal · USD</button>':'')+'</div><div class="pay-detail">'+(method==='wallet'?'<p>حوّل '+(quote.amount_cents/100)+' جنيه مصري على المحفظة التالية:</p><b dir="ltr">01143813559</b>':'<p>اختر '+quote.currency+' داخل PayPal وأرسل المبلغ نفسه. لو العملة غير متاحة لا تحوّل، وارجع لنا قبل الدفع.</p><a class="inv-btn" href="https://www.paypal.me/elbr1mo" target="_blank" rel="noopener noreferrer">فتح PayPal</a>')+'</div><form id="y27-checkout-form"><label>رقم عملية التحويل<input id="y27-payment-ref" maxlength="120" minlength="3" required autocomplete="off" dir="ltr"></label><p id="y27-checkout-status" role="status"></p><button class="inv-btn" type="submit">إرسال للتأكيد اليدوي</button></form><a href="#year2027">الرجوع إلى تقرير السنة</a></div>');box.querySelectorAll('[data-y27-method]').forEach(b=>b.onclick=()=>{method=b.dataset.y27Method;render();});box.querySelector('form').onsubmit=submit;}
 async function submit(e){e.preventDefault();var ref=box.querySelector('input').value.trim(),status=box.querySelector('#y27-checkout-status'),btn=box.querySelector('button[type=submit]');if(ref.length<3){status.textContent='اكتب رقم العملية كاملًا.';return;}btn.disabled=true;status.textContent='جاري إرسال رقم العملية...';try{if(Date.parse(quote.expires_at)<Date.now())throw new Error('quote_expired');var r=await sb().rpc('year2027_submit',{p_quote:quote.id,p_input:draft.input,p_method:method,p_reference:ref});if(r.error)throw r.error;show('<div class="pay-card"><h3>وصل رقم العملية، وطلبك قيد المراجعة</h3><p>هذا ليس تأكيدًا للدفع. بعد موافقة المالك افتح القراءة بنفس البيانات، وسيظهر تقرير السنة كاملًا تلقائيًا.</p><a class="inv-btn" href="#year2027">الرجوع للقراءة</a></div>');}catch(e){status.textContent=/already_/.test(e.message||'')?'عندك طلب سابق لنفس التقرير. تابع حالته في حسابك.':'لم نتمكن من تسجيل الطلب. لا تكرر التحويل. احتفظ برقم العملية وحاول إرسال الرقم لاحقًا.';btn.disabled=false;}}
 window.addEventListener('hashchange',refresh);window.addEventListener('aq-year2027-checkout',refresh);window.addEventListener('load',refresh);
})();

;
/* assets/js/year2027.js */
/* Arabic annual report: a complete free dated reading, then a paid calendar. */
(function(){'use strict';
 var sec=document.getElementById('year2027');if(!sec)return;
 var $=(s,r)=>(r||sec).querySelector(s),form=$('#y27-form'),out=$('#y27-result'),err=$('#y27-err'),city=$('#y27-city'),time=$('#y27-time'),unk=$('#y27-unknown');if(!form)return;
 var C=window.AqYear2027Core,O=window.AqYear2027Offer,state=null;
 var esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 var date=t=>new Date(t).toLocaleDateString('ar-EG',{day:'numeric',month:'long',year:'numeric',timeZone:'Africa/Cairo'});
 var range=s=>'من '+date(s.s)+' إلى '+date(s.e-1);
 var ctx=()=>window.AqeeqChartContext;
 var note=t=>{err.textContent=t||'';err.hidden=!t;};
 function loadCities(){if(!ctx()||!ctx().cityOptionsHTML)return;var cur=city.value;city.innerHTML=ctx().cityOptionsHTML();var m=city.querySelector('option[value="manual"]');if(m)m.remove();if(cur)city.value=cur;}
 loadCities();city.addEventListener('pointerdown',loadCities);setTimeout(loadCities,1200);unk.addEventListener('change',()=>time.disabled=unk.checked);
 function reading(t){return '<div class="y27-prose">'+(t.dialogue?'<blockquote>'+esc(t.dialogue)+'</blockquote>':'')+t.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')+'<div class="y27-step"><b>خطوتك</b><p>'+esc(t.action)+'</p></div><p class="y27-question"><b>اسأل نفسك:</b> '+esc(t.question)+'</p></div>';}
 function banner(s,label){var h=s.house,hs=s.houses&&s.houses.length>1?s.houses:null;return '<header class="y27-state"><small>'+esc(label||'حركة السماء فوق خريطتك')+'</small><b>'+esc(C.NAMES[s.planet])+' · '+(hs?'البيوت '+hs.join('، ')+' · '+hs.map(n=>esc(C.AREAS[n-1])).join(' / '):h?'البيت '+h+' · '+esc(C.AREAS[h-1]):'من دون تعيين بيت')+'</b><span>'+esc(range(s))+'</span></header>';}
 function acc(title,html,open){return '<details class="y27-acc"'+(open?' open':'')+'><summary><span class="y27-t">'+esc(title)+'</span><span class="y27-ch" aria-hidden="true"></span></summary><div class="y27-body">'+html+'</div></details>';}
 function offer(){var p=O.price();return '<section class="y27-offer" aria-labelledby="y27-offer-h"><span class="eyebrow">تقرير سنة 2027</span><h3 id="y27-offer-h">اعرف فترات سنتك، وارجع لخطوتك وقتها</h3><p>الخريطة الزمنية الكاملة، معنى كل فترة، واتصالاتها بخريطتك، في مكان واحد.</p><p class="y27-privacy">'+(O.country()?'البلد مقدّر من اتصالك. تقدر تغيّر الاختيار، خصوصًا مع VPN.':'اختار بلد الشراء، تقدير البلد من الاتصال قد لا يكون متاحًا.')+'</p><label class="y27-market-label">سوق الشراء <select id="y27-market">'+Object.keys(O.prices).map(k=>'<option value="'+k+'"'+(O.market()===k?' selected':'')+'>'+O.prices[k].title+' · '+O.prices[k].label+'</option>').join('')+'</select></label><button class="y27-btn y27-buy" type="button" data-y27-buy'+(!state.model.known||!p.product?' disabled':'')+'>'+(!state.model.known?'أضف وقت الميلاد لفتح خريطة البيوت':p.product?'افتح تقرير سنتك · '+p.label:p.label)+'</button>'+(p.settlement?'<p class="y27-privacy">الدفع الفعلي عبر PayPal: <b>'+p.settlement.toFixed(2)+' USD</b>. السعر المحلي تقريبي، ورسوم التحويل لدى مزود الدفع قد تختلف.</p>':'')+'<p class="y27-terms">شراء مرة واحدة، بلا تجديد تلقائي. التغطية: 1 يناير إلى 31 ديسمبر 2027، مع مقدمة انتقالية من ديسمبر 2026. محفوظ في حسابك بعد تأكيد التحويل اليدوي، ويمكن طباعته PDF.</p><p class="y27-sale-status" role="status" id="y27-sale-status"></p></section>';}
 function render(){var S=state,R=S.model,p=S.period,t=S.free;
  var h='<div class="y27-rintro"><span class="eyebrow">سنة أوضح، خطوة بخطوة</span><h2>فتراتك في 2027</h2></div><header class="y27-banner"><span class="y27b-k">قراءة سنة 2027 · فلك فيدي</span><div class="y27b-id"><span class="y27b-n">27</span><span class="y27b-cap"><small>تقرير شخصي مبني على بيانات ميلادك</small><b>'+esc(S.input.name||'قراءتك')+'</b></span></div><div class="y27b-tools"><button type="button" data-y27-edit>تعديل البيانات</button><button type="button" data-y27-save>حفظ القراءة</button><button type="button" data-y27-new>قراءة جديدة</button></div></header>';
  if(!R.known)h+='<p class="y27-note">وقت الميلاد غير معروف. لا نعرض طالعًا أو بيوتًا مفترضة، والقراءة المجانية هنا من فترات قمر الميلاد. حدّد وقتك للحصول على خريطة البيوت.</p>';
  h+='<section class="y27-free-reading" id="y27-free"><span class="y27-tag">قراءة مكتملة لك، مجانًا</span><header class="y27-state"><small>الفترة الشخصية من قمر ميلادك</small><b>فترة '+esc(window.AqVedic.T.LORDS[p.lord])+'</b><span>'+esc(range(p))+'</span></header>'+reading(t)+'<details class="y27-why"><summary>ليه ظهرت لي القراءة دي؟</summary><p>موقع القمر لحظة ميلادك يحدد تسلسل فتراتك ومدتها. دي فترة شخصية محسوبة من بيانات الميلاد، مش رسالة عشوائية ولا من البرج الشمسي وحده. الوقت المجهول يقلل دقة حدود الفترة.</p></details><div class="y27-actions"><button class="y27-btn" type="button" data-y27-share>مشاركة القراءة</button><button class="y27-btn y27-ghost" type="button" data-y27-story>حفظ ستوري</button><button class="y27-btn y27-ghost" type="button" data-y27-copy>نسخ النص</button></div><p class="y27-privacy">المشاركة لا تتضمن اسمك أو بيانات ميلادك أو مدينتك.</p><p id="y27-share-status" role="status"></p></section>';
  h+='<details class="y27-inside"><summary>عينة من شكل الخريطة الزمنية</summary><div class="y27-sample-timeline"><b>توقيت محسوب من خريطتك</b><span>حالة فلكية في بنر مستقل</span><span>قراءة مفصلة، خطوة عملية وسؤال</span><span>صلة بالفترة السابقة والموعد التالي</span></div><p>القراءة المجانية بالأعلى عينة فعلية من أسلوب المحتوى. لا نعرض هنا مواعيد وهمية باسمك.</p></details>';
  h+='<div id="y27-paid"><div class="y27-calendar-lock"><span aria-hidden="true">◇</span><h3>باقي الخريطة الزمنية في تقرير السنة</h3><p>القراءة المجانية مكتملة. المدفوع يفتح الفترات كلها، مش بقية جملة مقطوعة.</p></div></div>'+offer()+'<p class="y27-note">قراءة رمزية للتأمل، وليست حقيقة علمية مثبتة أو ضمانًا لأحداث. ليست نصيحة طبية أو مالية.</p>';
  out.innerHTML=h;out.hidden=false;sec.classList.add('y27-has');$('#y27-name-print').textContent=S.input.name||'';bind();checkPaid();
 }
 function shareText(){var R=state.model,p=state.period,t=state.free;return 'عقيق · فترتي في 2027\n'+range(p)+'\n\n'+t.paragraphs.slice(0,2).join('\n\n')+'\n\nخطوتي: '+t.action+'\n\n'+t.question+'\n\nقراءة رمزية للتأمل، لا ضمان لأحداث.';}
 async function copy(){try{await navigator.clipboard.writeText(shareText());$('#y27-share-status').textContent='تم نسخ القراءة من غير بيانات الميلاد.';}catch(_){$('#y27-share-status').textContent='تعذر النسخ. استخدم زر المشاركة أو حفظ الستوري.';}}
 async function story(){
  await document.fonts.ready;var cv=document.createElement('canvas');cv.width=1080;cv.height=1920;var g=cv.getContext('2d');
  var bg=g.createLinearGradient(0,0,0,1920);bg.addColorStop(0,'#2e1421');bg.addColorStop(1,'#672f43');g.fillStyle=bg;g.fillRect(0,0,1080,1920);g.strokeStyle='#c8a86a';g.lineWidth=3;g.strokeRect(55,55,970,1810);g.direction='rtl';g.textAlign='right';g.fillStyle='#ecd5a7';g.font='bold 62px Cairo, sans-serif';g.fillText('عقيق | فترتي في 2027',970,170);
  var p=state.period,t=state.free;g.font='32px Cairo, sans-serif';g.fillText(range(p),970,260);g.fillStyle='#fff5e6';g.font='38px Cairo, sans-serif';
  var y=370;function wrap(txt){var line='';txt.split(/\s+/).forEach(w=>{var test=line?line+' '+w:w;if(g.measureText(test).width>860){g.fillText(line,970,y);y+=69;line=w;}else line=test;});if(line){g.fillText(line,970,y);y+=69;}}
  wrap(t.paragraphs[0]);y+=55;g.fillStyle='#ecd5a7';wrap('خطوتي');g.fillStyle='#fff5e6';wrap(t.action);y+=40;wrap(t.question);g.font='28px Cairo, sans-serif';g.fillStyle='#ecd5a7';g.fillText('قراءة رمزية للتأمل، لا ضمان لأحداث',970,1780);
  var blob=await new Promise(r=>cv.toBlob(r,'image/png'));if(!blob)return;var f=new File([blob],'aqeeq-2027-story.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:'عقيق · فترتي في 2027'});return;}catch(e){if(e.name==='AbortError')return;}}
  var a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download=f.name;a.click();setTimeout(()=>URL.revokeObjectURL(u),30000);$('#y27-share-status').textContent='تم تجهيز الستوري للحفظ والمشاركة.';
 }
 function save(){var P=window.AqeeqPlatform;if(P&&P.saveReading){P.saveReading({type:'year2027',typeLabel:'تقرير سنة 2027',title:state.input.name||'سنتي في 2027',subtitle:state.input.date,route:'#year2027',inputs:state.input});}try{localStorage.setItem('aq-year2027-last',JSON.stringify(state.input));}catch(_){}var b=$('[data-y27-save]');if(b)b.textContent='تم الحفظ';}
 function edit(clear){out.hidden=true;out.innerHTML='';sec.classList.remove('y27-has');if(clear){form.reset();time.disabled=false;state=null;}sec.scrollTo({top:0});}
 function bind(){
  $('[data-y27-edit]').onclick=()=>edit(false);$('[data-y27-new]').onclick=()=>edit(true);$('[data-y27-save]').onclick=save;
  $('[data-y27-copy]').onclick=copy;$('[data-y27-story]').onclick=()=>story().catch(()=>$('#y27-share-status').textContent='تعذر تجهيز الصورة، جرب نسخ النص.');
  $('[data-y27-share]').onclick=async()=>{if(navigator.share){try{await navigator.share({title:'عقيق · فترتي في 2027',text:shareText()});}catch(e){if(e.name!=='AbortError')copy();}}else copy();};
  $('[data-y27-buy]').onclick=()=>O.begin(state.input);$('#y27-market').onchange=e=>{O.setMarket(e.target.value);var node=$('.y27-offer');node.outerHTML=offer();bindOffer();};
 }
 function bindOffer(){$('[data-y27-buy]').onclick=()=>O.begin(state.input);$('#y27-market').onchange=e=>{O.setMarket(e.target.value);$('.y27-offer').outerHTML=offer();bindOffer();};}
 async function checkPaid(){var sb=window.aqeeqSupabase;if(!sb||!sb.auth)return;try{var session=await sb.auth.getSession();if(!session.data.session)return;var res=await sb.functions.invoke('year2027-content',{body:{input:state.input}});if(res.error||!res.data||!res.data.report)return;renderPaid(res.data.report);$('.y27-offer').hidden=true;}catch(_){} }
 function renderPaid(report){var R=report.model;
   var events=report.closing.concat(report.groups.flatMap(g=>g.periods)).sort((a,b)=>a.s-b.s),now=Date.now(),next=events.find(s=>s.s>now),active=events.find(s=>s.s<=now&&s.e>now),chosen=active||next||events[0],last=0;try{last=Number(localStorage.getItem('aq-y27-visit')||0);localStorage.setItem('aq-y27-visit',String(now));}catch(_){}
   var changed=last?events.filter(s=>s.s>last&&s.s<=now).length:0;
   var h='<section class="y27-now"><span class="eyebrow">أنت هنا الآن</span><h3>'+(active?'فترتك الحالية':next?'أقرب فترة في تقريرك':'ختام سنتك')+'</h3>'+banner(chosen)+'<p>'+(last?(changed?'بدأت '+changed+' فترات منذ زيارتك السابقة.':'الفترة مستمرة، لا تغيير جديد منذ زيارتك السابقة.'):'ارجع هنا لمتابعة موقعك من التقرير.')+'</p><label>خطوتك وملاحظتك السابقة<textarea id="y27-journal" rows="3" maxlength="3000" placeholder="ملاحظة خاصة محفوظة على جهازك فقط"></textarea></label><button type="button" data-y27-journal>حفظ ملاحظتي على هذا الجهاز</button></section>';
   h+=acc('من ديسمبر 2026 إلى مارس 2027',report.closing.map(s=>banner(s,'افتتاح السنة')+reading(s.text)).join(''),false);
   h+=acc('الفترات الشخصية خلال السنة',report.periods.map(p=>'<header class="y27-state"><b>'+esc(window.AqVedic.T.LORDS[p.lord])+'</b><span>'+range(p)+'</span></header>'+reading(p.text)).join(''),false);
   report.groups.forEach(g=>{h+=acc(C.NAMES[g.planet]+' · فترات السنة',g.periods.map(s=>{
      var t=s.text,extras=s.lord?'<p>'+esc(s.lord)+'</p>':(s.topics||[]).map(x=>'<p>'+esc(x)+'</p>').join('');if(t.axis)extras+='<p>'+esc(t.axis)+'</p>';
      var contacts='<div class="y27-contacts">'+(s.contacts.length?'<b>اتصالات بخريطتك</b>'+s.contacts.map(x=>'<p>'+date(x.t)+' · اقتران '+esc(C.NAMES[g.planet])+' بموضع '+esc(C.NAMES[x.natal])+' في الميلاد · '+(x.lon%30).toFixed(2)+'°</p>').join(''):'<p>لا يوجد اقتران دقيق بكواكب ميلادك في هذه الفترة ضمن هذا الفحص.</p>')+'</div>';
      return '<article class="y27-period">'+banner(s)+contacts+'<h4>'+esc(t.title)+'</h4>'+reading(t)+extras+'</article>';
    }).join(''),false);});$('#y27-paid').innerHTML=h;
   try{$('#y27-journal').value=localStorage.getItem('aq-y27-journal')||'';}catch(_){}$('[data-y27-journal]').onclick=()=>{try{localStorage.setItem('aq-y27-journal',$('#y27-journal').value);$('[data-y27-journal]').textContent='تم حفظ الملاحظة محليًا';}catch(_){$('[data-y27-journal]').textContent='تعذر الحفظ على الجهاز';}};
   $('#y27-paid').insertAdjacentHTML('beforeend','<button class="y27-btn" type="button" id="y27-pdf">حفظ التقرير PDF</button>');$('#y27-pdf').onclick=()=>{out.querySelectorAll('details').forEach(d=>d.open=true);document.body.classList.add('y27-printing');window.addEventListener('afterprint',()=>document.body.classList.remove('y27-printing'),{once:true});window.print();};
 }
 async function freeReading(input){var r=await fetch('https://trcveoewbxqzhhvzawxy.supabase.co/functions/v1/year2027-content',{method:'POST',headers:{'Content-Type':'application/json',apikey:'sb_publishable_48pQKHVWg0AXYDRlcNH-HQ_iRyfDMdC'},body:JSON.stringify({mode:'preview',input:input})});var data=await r.json();if(!r.ok)throw new Error(r.status===429?'طلبات كثيرة، انتظر قليلًا قبل المحاولة.':'تعذر تحميل القراءة الآمنة. حاول بعد لحظة.');return data;}
 form.addEventListener('submit',async function(e){e.preventDefault();note('');var birth=$('#y27-date').value;if(!birth){note('اكتب تاريخ ميلادك كاملًا.');return;}if(!unk.checked&&!time.value){note('اكتب وقت الميلاد أو اختر أنه غير معروف.');return;}var input={name:$('#y27-name').value.trim(),date:birth,time:unk.checked?'':time.value,unknown:unk.checked,city:city.value};var b=form.querySelector('button[type=submit]');b.disabled=true;b.classList.add('is-loading');note('جاري حساب فتراتك وتقاطعات خريطتك، قد يستغرق بضع ثوانٍ.');await new Promise(r=>setTimeout(r,60));try{var d=birth.split('-').map(Number),tm=(input.time||'12:00').split(':').map(Number);var natal=ctx().setFromInput({y:d[0],m:d[1],d:d[2],hh:tm[0],mm:tm[1],known:!unk.checked,cityIdx:city.value,name:input.name,gender:''});input.utcMs=Number.isFinite(natal.utcMs)?natal.utcMs:(natal.ch.jde-2440587.5)*864e5;input.lat=natal.ch.lat;input.lon=natal.ch.lon;var result=await freeReading(input);state={input:input,model:result.model,free:result.free,period:result.period};if(result.country&&O.applyCountry)O.applyCountry(result.country);note('');render();sec.scrollTo({top:0});}catch(x){note(x.message||'تعذر الحساب. راجع بياناتك.');}finally{b.disabled=false;b.classList.remove('is-loading');}});
 window.addEventListener('aq-year2027-market',()=>{if(state&&$('.y27-offer')){$('.y27-offer').outerHTML=offer();bindOffer();}});
 window.addEventListener('hashchange',()=>{if(state&&location.hash==='#year2027')checkPaid();});
 window.addEventListener('aq-year2027-approved',()=>{if(state)checkPaid();});
 try{var kept=JSON.parse(localStorage.getItem('aq-year2027-last')||'null');if(kept&&!$('#y27-date').value){[['y27-name',kept.name],['y27-date',kept.date],['y27-time',kept.time],['y27-city',kept.city]].forEach(a=>{var el=$('#'+a[0]);if(el){el.value=a[1]||'';el.dispatchEvent(new Event('change',{bubbles:true}));}});unk.checked=!!kept.unknown;time.disabled=unk.checked;}}catch(_){}
 window.AqYear2027={compute:n=>C.compute(n,window.AqEam,window.AqVedic)};
})();

;
/* assets/js/home-batch3.js */
/* الدفعة الثالثة: شريط العروض المتحرك، نافذة الترحيب، كارت الأبراج، مساحة المسجّل، تقارير استثمر في ذاتك */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var SIGNS = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function svg(d, w) { return '<svg viewBox="0 0 24 24" width="' + (w || 22) + '" height="' + (w || 22) + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  var ARROW = '<path d="M19 12H5M11 6l-6 6 6 6"/>';
  function loggedIn() { var u = document.getElementById('acct-user'); return !!(u && !u.hidden); }

  /* ---------- 1) شريط العروض: يتبدل كل 3 ثوان ---------- */
  var ROT = [
    { t: 'ما الكارما التي تحملها؟', s: 'اعرف ذيلك الكارمي من مصفوفة القدر، وما يريده منك', href: '#karmic', ic: '<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3.500 2"/>' }
  ];
  function buildRot() {
    var host = $('#b3-rot'); if (!host) return; if (ROT.length < 2) host.classList.add('one');
    var i = 0, dots = ROT.map(function () { return '<i></i>'; }).join('');
    host.innerHTML = '<a class="b3-rot-a" href="#"></a><span class="b3-rot-dots">' + dots + '</span>';
    var a = host.querySelector('a'), dd = host.querySelectorAll('.b3-rot-dots i');
    function show(n) {
      var r = ROT[n]; i = n;
      host.classList.remove('in'); void host.offsetWidth;
      a.href = r.href; a.innerHTML = '<span class="b3-rot-ic">' + svg(r.ic, 22) + '</span><span class="b3-rot-t"><b>' + esc(r.t) + '</b><small>' + esc(r.s) + '</small></span><span class="b3-rot-go">' + svg(ARROW, 18) + '</span>';
      a.onclick = function () { if (r.k) { try { sessionStorage.setItem('b3-open', r.k); } catch (e) {} } };
      dd.forEach(function (d, j) { d.classList.toggle('on', j === n); });
      host.classList.add('in');
    }
    show(0);
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setInterval(function () { if (!document.hidden && /^(#home)?$/.test(location.hash)) show((i + 1) % ROT.length); }, 3000);
  }

  /* ---------- 2) كارت الأبراج تحت السماء الآن ---------- */
  function buildZodiac() {
    var band = $('#aqh-band'); if (!band || $('#b3-zod')) return;
    var a = document.createElement('a'); a.id = 'b3-zod'; a.className = 'b3-zod'; a.href = '#signs';
    a.innerHTML = '<span class="b3-zod-ic">' + svg('<circle cx="12" cy="12" r="9" stroke-opacity=".5"/><circle cx="12" cy="3" r="1" fill="currentColor"/><circle cx="21" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="21" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><path d="M12 8l1.100 2.900L16 12l-2.900 1.100L12 16l-1.100-2.900L8 12l2.900-1.100z"/>', 30) + '</span><span class="b3-zod-t"><em>رسالة برجك اليوم</em><b>ما الذي تريد السماء أن تقوله لبرجك اليوم؟</b><small>اختر برجك واقرأ رسالتك وتوقعك اليومي</small></span><span class="b3-rot-go">' + svg(ARROW, 18) + '</span>';
    band.parentNode.insertBefore(a, band.nextSibling);
  }

  /* ---------- 3) نافذة الترحيب للزائر ---------- */
  function seen() { try { return localStorage.getItem('aq_b3_welcome') === '1'; } catch (e) { return false; } }
  function mark() { try { localStorage.setItem('aq_b3_welcome', '1'); } catch (e) {} }
  function openWelcome() {
    if (seen() || loggedIn() || $('#b3-welcome')) return;
    if (!/^(#home)?$/.test(location.hash)) return;
    var w = document.createElement('div'); w.id = 'b3-welcome'; w.className = 'b3-welcome'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-labelledby', 'b3-w-h');
    w.innerHTML = '<div class="b3-w-bd"></div><div class="b3-w-sheet"><span class="b3-w-grip" aria-hidden="true"></span><h2 id="b3-w-h">خريطتك تنتظرك في مكان واحد</h2><p class="b3-w-lead">حين تسجّل بياناتك مرة واحدة، يتذكرك الموقع في كل زيارة:</p><ul>' +
      '<li><span>' + svg('<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="2.500"/><path d="M12 3.500v6M12 14.500v6"/>') + '</span><div><b>تُحفظ خرائطك تلقائيًا</b><small>لا تعيد كتابة تاريخ ميلادك في كل مرة</small></div></li>' +
      '<li><span>' + svg('<path d="M4 6h16v10H8l-4 4z"/>') + '</span><div><b>رسالة يومك الخاصة</b><small>مكتوبة من خريطتك أنت وليست لبرجك فقط</small></div></li>' +
      '<li><span>' + svg('<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4M10 13h6M10 17h6"/>') + '</span><div><b>تقاريرك بصيغة PDF محفوظة</b><small>ترجع إليها وتحمّلها وقتما تريد</small></div></li></ul>' +
      '<a class="b3-w-go" href="#account">سجّل بياناتك الآن</a><button type="button" class="b3-w-skip">تصفح كزائر</button></div>';
    document.body.appendChild(w);
    requestAnimationFrame(function () { w.classList.add('on'); });
    function close() { mark(); w.classList.remove('on'); setTimeout(function () { w.remove(); }, 260); document.removeEventListener('keydown', key); }
    function key(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', key);
    w.querySelector('.b3-w-bd').addEventListener('click', close);
    w.querySelector('.b3-w-skip').addEventListener('click', close);
    w.querySelector('.b3-w-go').addEventListener('click', function () { mark(); w.remove(); document.removeEventListener('keydown', key); });
    var g = w.querySelector('.b3-w-go'); try { g.focus({ preventScroll: true }); } catch (e) {}
  }

  /* ---------- 4) مساحة المسجّل في أول الرئيسية ---------- */
  function moonNow() {
    try { var c = window.Astro.chart({ utcMs: Date.now(), lat: 30.0444, lon: 31.2357, known: false }), b = c.bodies.filter(function (x) { return String(x.key).toLowerCase() === 'moon'; })[0]; return b ? SIGNS[Math.floor(((b.lon % 360) + 360) % 360 / 30)] : null; } catch (e) { return null; }
  }
  function signOf(n, key) { var b = n && n.ch && (n.ch.bodies || []).filter(function (x) { return String(x.key).toLowerCase() === key; })[0]; return b ? SIGNS[Math.floor(((b.lon % 360) + 360) % 360 / 30)] : null; }
  function syncMe() {
    /* الرئيسية تبقى كما هي بعد الدخول: لا كارت شخصي هنا، المحتوى الشخصي كله في صفحة «أنت» */
    var gone = document.getElementById('b3-me'); if (gone) gone.remove(); return;
    var home = $('#home'), grid = home && $('.aqh-hero-grid', home); if (!grid) return;
    var me = $('#b3-me');
    if (!loggedIn()) { if (me) me.hidden = true; return; }
    if (!me) { me = document.createElement('section'); me.id = 'b3-me'; me.className = 'b3-me'; grid.parentNode.insertBefore(me, grid); }
    var n = null; try { n = window.AqeeqChartContext && window.AqeeqChartContext.getMine(); } catch (e) {}
    var nm = n && n.name ? n.name : '', sun = signOf(n, 'sun'), mo = signOf(n, 'moon'), now = moonNow();
    me.hidden = false;
    me.innerHTML = '<div class="b3-me-h"><span>مساحتك</span><h2>' + (nm ? 'أهلًا ' + esc(nm) : 'أهلًا بعودتك') + '</h2></div>' +
      '<a class="b3-me-r" href="#for-you"><i>' + svg('<path d="M4 6h16v10H8l-4 4z"/>', 20) + '</i><span><b>رسالة يومك من خريطتك</b><small>اقرأ ما كتب لك اليوم</small></span></a>' +
      '<a class="b3-me-r" href="#for-you"><i>' + svg('<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3 2"/>', 20) + '</i><span><b>عبورك الحالي</b><small>' + (now ? 'القمر الآن في برج ' + now + ' وكيف يلمس خريطتك' : 'كيف تلمس حركة السماء خريطتك الآن') + '</small></span></a>' +
      '<a class="b3-me-r" href="#chart"><i>' + svg('<circle cx="12" cy="12" r="4"/><path d="M12 2.500v3M12 18.500v3M2.500 12h3M18.500 12h3"/>', 20) + '</i><span><b>تذكير بنمطك</b><small>' + (sun && mo ? 'شمسك في ' + sun + ' وقمرك في ' + mo : 'أكمل بيانات ميلادك ليظهر نمطك هنا') + '</small></span></a>';
  }

  /* ---------- 5) تقارير استثمر في ذاتك: بداية مشوقة ثم التقرير الكامل ---------- */
  var REPORTS = [
    { k: 'karmic', t: 'الذيل الكارمي', hook: 'ما الدرس الذي يعود إليك كلما ظننت أنك تجاوزته؟', go: '#matrix', ic: '<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3.500 2"/>',
      part: function (r) { var tr = r.karm; return '<div class="b3-badges">' + tr.map(function (n) { return '<span><b>' + n + '</b>' + esc(r.name(n)) + '</span>'; }).join('') + '</div><p>هذه أرقام ذيلك: الجذر الذي تحمله، ثم ما يتفرع عنه، ثم ما يظهر في سلوكك. ' + esc(r.name(tr[0])) + ' هو أول الخيط عندك.</p>'; },
      more: 'التقرير الكامل يشرح من أين جاء هذا الدرس، وكيف يظهر في علاقاتك ومالك وقراراتك، ثم روشتة عملية للتخفف من ثقله.' },
    { k: 'love', t: 'مسار العلاقات', hook: 'لماذا تتكرر نفس القصة في قلبك؟', go: '#relationships', ic: '<path d="M12 20s-7-4.400-7-10a4 4 0 0 1 7-2.400A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/>',
      part: function (r) { return '<div class="b3-badges"><span><b>' + r.love + '</b>' + esc(r.name(r.love)) + '</span></div><p>هذه بوابة قلبك: الطاقة التي تدخل بها الحب وتطلبها من الشريك.</p>'; },
      more: 'التقرير الكامل يكشف ما تبحث عنه في الشريك، ولماذا تنجذب لنفس النمط، وكيف تفتح علاقة أصفى.' },
    { k: 'path', t: 'مسار الحياة', hook: 'إلى أين يقودك رقم ميلادك؟', go: '#lifepath', ic: '<path d="M3 20 10 6l4 8 3-4 4 10z"/>',
      part: function (r) { return '<div class="b3-badges"><span><b>' + r.lp + '</b>رقم مسارك</span></div><p>هذا الرقم هو اتجاه رحلتك الأساسي، وما تتعلمه كلما تقدمت في العمر.</p>'; },
      more: 'التقرير الكامل يفصّل دروس كل مرحلة من عمرك ونقاط قوتك وما يعطلك.' },
    { k: 'chart', t: 'الخريطة الفلكية', hook: 'ماذا كانت تقول السماء يوم ميلادك؟', go: '#chart', ic: '<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="2.500"/><path d="M12 3.500v6M12 14.500v6"/>',
      part: function (r) { return '<div class="b3-badges"><span><b>' + esc(r.sun) + '</b>برجك الشمسي</span></div><p>هذا وجهك الظاهر للناس. أما ما تشعر به من الداخل فيحكيه القمر والطالع.</p>'; },
      more: 'التقرير الكامل يضم طالعك وقمرك وبيوتك وكل كوكب في خريطتك بقراءة شخصية.' },
    { k: 'y27', t: 'ما سيحدث في 2027', hook: 'ما الفصول التي ستُغلق في حياتك العام القادم؟', go: '#year2027', ic: '<path d="M12 3l1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800z"/>', direct: true,
      more: 'اكتب بياناتك لتقرأ فترتك الحاكمة وعلاقاتك الكارمية ونقاط الحذر وأفضل مسار للعمل والمال في 2027.' }
  ];
  function calcR(ds) {
    var AD = window.AqeeqMatrixMethodAdapter, m = AD.calculateDestinyMatrix(ds), nm = function (n) { var i = AD.getArcanaInfo ? AD.getArcanaInfo(n) : null; return i && i.name ? i.name : 'الطاقة ' + n; };
    var p = ds.split('-').map(Number), dsum = function (n) { return String(n).split('').reduce(function (a, c) { return a + Number(c); }, 0); }, lp = dsum(p[2]) + dsum(p[1]) + dsum(p[0]);
    while (lp > 9 && [11, 22, 33].indexOf(lp) < 0) lp = dsum(lp);
    var sun = '';
    try { var c = window.Astro.chart({ utcMs: Date.UTC(p[0], p[1] - 1, p[2], 10), lat: 30.0444, lon: 31.2357, known: false }), b = c.bodies.filter(function (x) { return String(x.key).toLowerCase() === 'sun'; })[0]; sun = SIGNS[Math.floor(((b.lon % 360) + 360) % 360 / 30)]; } catch (e) {}
    return { karm: m.karmicTail.triad, love: m.loveLine.entry, lp: lp, sun: sun, name: nm };
  }
  function buildReports() {
    var inv = $('#invest'), grid = inv && $('.inv-grid', inv); if (!grid || $('#b3-vip')) return;
    var cards = [
      { t: 'ما سيحدث في 2027', q: 'ما الفصول التي ستُغلق في حياتك العام القادم؟', href: '#year2027', cls: 'a', img: 'assets/images/content/photo-transits.jpg', ic: '<path d="M12 3l1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800z"/>' },
      { t: 'الذيل الكارمي', q: 'ما الدرس الذي يعود إليك كلما ظننت أنك تجاوزته؟', href: '#karmic', cls: 'b', img: 'assets/images/content/photo-mirror-dim.jpg', ic: '<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3.500 2"/>' }
    ];
    var box = document.createElement('section'); box.id = 'b3-vip'; box.className = 'b3-vip';
    box.innerHTML = '<div class="b3-vip-track" tabindex="0" role="region" aria-label="التقارير المميزة، مرّر أفقيًا">' + cards.map(function (c) {
      return '<a class="b3-vcard" href="' + c.href + '"><span class="b3-vimg" style="background-image:url(' + c.img + ')"><em>تقرير مدفوع</em><i class="b3-vic">' + svg(c.ic, 26) + '</i></span><span class="b3-vtx"><b>' + c.t + '</b><small>' + c.q + '</small><u>معاينة مجانية ثم التقرير الكامل</u></span></a>';
    }).join('') + '</div><p class="b3-vsoon">تقارير أخرى قيد التجهيز.</p>';
    grid.parentNode.insertBefore(box, grid);
  }

  /* صفحة الذيل الكارمي المستقلة */
  function buildKarmic() {
    var sec = $('#karmic'); if (!sec) return;
    var form = $('#kt-form'), out = $('#kt-result'), err = $('#kt-err');
    function show(m) { err.textContent = m; err.hidden = !m; }
    form.addEventListener('submit', function (e) {
      e.preventDefault(); show('');
      var ds = ($('#kt-date').value || '').trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(ds)) { show('اختر اليوم والشهر والسنة كاملة.'); return; }
      var r; try { r = calcR(ds); } catch (x) { show('تعذر الحساب. راجع التاريخ.'); return; }
      var nm = ($('#kt-name').value || '').trim(), t = r.karm, LK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="9.5" rx="2.4"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>';
      out.innerHTML = '<div class="y27-rhead"><span class="y27-kick">ذيلك الكارمي' + (nm ? ' · ' + esc(nm) : '') + '</span><h3>هذه أرقام ذيلك</h3></div>' +
        '<div class="b3-kt-tri">' + ['الجذر', 'الفرع', 'الظهور'].map(function (l, i) { return '<div class="b3-kt-n"><i class="kt-step">' + (i + 1) + '</i><small>' + l + '</small><b>' + t[i] + '</b><span>' + esc(r.name(t[i])) + '</span></div>'; }).join('') + '</div>' +
        '<div class="y27-about"><p>' + esc(r.name(t[0])) + ' هو أول الخيط عندك. منه يبدأ الدرس الذي تعود إليه، ثم يتفرع في ' + esc(r.name(t[1])) + '، ويظهر في سلوكك اليومي بصورة ' + esc(r.name(t[2])) + '.</p></div>' +
        '<div class="b3-lock kt-lock"><div class="kt-lock-h"><span class="kt-lk kt-lk-big">'+LK+'</span><b>ما لا يظهر هنا</b></div><ul class="kt-rows"><li><span class="kt-lk">'+LK+'</span><b>من أين جاء هذا الدرس</b></li><li><span class="kt-lk">'+LK+'</span><b>كيف يلمس علاقاتك</b></li><li><span class="kt-lk">'+LK+'</span><b>كيف يلمس مالك</b></li><li><span class="kt-lk">'+LK+'</span><b>كيف يلمس قراراتك</b></li><li><span class="kt-lk">'+LK+'</span><b>روشتة عملية للتخفف من ثقله</b></li></ul><p class="kt-pdf">يصلك التقرير الكامل بصيغة PDF بعد الدفع.</p><div class="b3-acts"><a class="b3-b1" href="#pay">افتح التقرير الكامل</a><a class="b3-b2" href="#pay">تحميل PDF</a></div></div>';
      out.hidden = false; sec.classList.add('y27-has'); try { sec.scrollTo({ top: 0, behavior: 'smooth' }); } catch (x) {}
    });
    $('#kt-edit').addEventListener('click', function () { out.hidden = true; out.innerHTML = ''; sec.classList.remove('y27-has'); });
  }

  /* ألوان المصفوفة: أيقونات زجاجية وشارات بنغمة */
  function toneOf(n) { n = +n; return [12, 13, 15, 16, 18].indexOf(n) >= 0 ? 's' : [10, 11, 14, 17, 19, 21].indexOf(n) >= 0 ? 'g' : 'n'; }
  function tintMatrix() {
    document.querySelectorAll('#matrix .aqm-acc-item').forEach(function (it) {
      var c = { s: 0, g: 0, n: 0 };
      it.querySelectorAll('.aqm-badge-arcana').forEach(function (b) {
        var bn = b.querySelector('.aqm-bn'), t = toneOf(bn ? bn.textContent : 0); b.classList.remove('b3-tn-s', 'b3-tn-g', 'b3-tn-n'); b.classList.add('b3-tn-' + t); c[t]++;
      });
      var d = c.s > c.g && c.s >= c.n ? 's' : c.g >= c.n && c.g > 0 ? 'g' : c.n ? 'n' : 'g';
      it.classList.remove('b3-ai-s', 'b3-ai-g', 'b3-ai-n'); it.classList.add('b3-ai-' + d);
    });
  }
  function watchMatrix() {
    var m = $('#matrix'); if (!m) return; var t;
    new MutationObserver(function () { clearTimeout(t); t = setTimeout(tintMatrix, 60); }).observe(m, { childList: true, subtree: true });
  }

  function init() {
    buildRot(); buildZodiac(); buildReports(); buildKarmic(); watchMatrix(); syncMe();
    var u = document.getElementById('acct-user'); if (u) new MutationObserver(syncMe).observe(u, { attributes: true, attributeFilter: ['hidden'] });
    document.addEventListener('aqeeq:natal-ready', syncMe); document.addEventListener('aq:session', function () { setTimeout(syncMe, 400); setTimeout(syncMe, 2500); });
    setTimeout(openWelcome, 14000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

;
/* assets/js/sky-world-chart.js */
/* خريطة السماء العالمية: لحظة سماء لأي تاريخ ووقت ومدينة في العالم (ليست خريطة شخصية).
   تقرأ من محرك Astro الموجود نفسه. كل شيء في #sky: العجلة، القمر، وخمسة تبويبات (الكواكب، تأثيرها على برجك، الزوايا، الطالع والبيوت، العناصر والأنماط). */
(function () {
  'use strict';
  var form = document.getElementById('swc-form'), svg = document.getElementById('swc-svg');
  if (!form || !svg || form.dataset.init === '1') return;
  form.dataset.init = '1';

  var GROUPS = [
    ['الشرق الأوسط', [
      ['القاهرة', 30.0444, 31.2357, 'Africa/Cairo'], ['الإسكندرية', 31.2001, 29.9187, 'Africa/Cairo'],
      ['الرياض', 24.7136, 46.6753, 'Asia/Riyadh'], ['مكة المكرمة', 21.3891, 39.8579, 'Asia/Riyadh'], ['جدة', 21.4858, 39.1925, 'Asia/Riyadh'],
      ['دبي', 25.2048, 55.2708, 'Asia/Dubai'], ['أبوظبي', 24.4539, 54.3773, 'Asia/Dubai'], ['الدوحة', 25.2854, 51.531, 'Asia/Qatar'],
      ['الكويت', 29.3759, 47.9774, 'Asia/Kuwait'], ['المنامة', 26.2285, 50.586, 'Asia/Bahrain'], ['مسقط', 23.588, 58.3829, 'Asia/Muscat'],
      ['بغداد', 33.3152, 44.3661, 'Asia/Baghdad'], ['عمّان', 31.9454, 35.9284, 'Asia/Amman'], ['بيروت', 33.8938, 35.5018, 'Asia/Beirut'],
      ['دمشق', 33.5138, 36.2765, 'Asia/Damascus'], ['القدس', 31.7683, 35.2137, 'Asia/Jerusalem'], ['طهران', 35.6892, 51.389, 'Asia/Tehran'], ['إسطنبول', 41.0082, 28.9784, 'Europe/Istanbul']]],
    ['أفريقيا', [
      ['الخرطوم', 15.5007, 32.5599, 'Africa/Khartoum'], ['طرابلس', 32.8872, 13.1913, 'Africa/Tripoli'], ['تونس', 36.8065, 10.1815, 'Africa/Tunis'],
      ['الجزائر', 36.7538, 3.0588, 'Africa/Algiers'], ['الرباط', 34.0209, -6.8416, 'Africa/Casablanca'], ['لاغوس', 6.5244, 3.3792, 'Africa/Lagos'],
      ['نيروبي', -1.2921, 36.8219, 'Africa/Nairobi'], ['أديس أبابا', 9.03, 38.74, 'Africa/Addis_Ababa'], ['جوهانسبرغ', -26.2041, 28.0473, 'Africa/Johannesburg']]],
    ['أوروبا', [
      ['لندن', 51.5074, -0.1278, 'Europe/London'], ['باريس', 48.8566, 2.3522, 'Europe/Paris'], ['برلين', 52.52, 13.405, 'Europe/Berlin'],
      ['مدريد', 40.4168, -3.7038, 'Europe/Madrid'], ['روما', 41.9028, 12.4964, 'Europe/Rome'], ['أمستردام', 52.3676, 4.9041, 'Europe/Amsterdam'],
      ['موسكو', 55.7558, 37.6173, 'Europe/Moscow'], ['أثينا', 37.9838, 23.7275, 'Europe/Athens']]],
    ['آسيا', [
      ['كراتشي', 24.8607, 67.0011, 'Asia/Karachi'], ['نيودلهي', 28.6139, 77.209, 'Asia/Kolkata'], ['مومباي', 19.076, 72.8777, 'Asia/Kolkata'],
      ['دكا', 23.8103, 90.4125, 'Asia/Dhaka'], ['بانكوك', 13.7563, 100.5018, 'Asia/Bangkok'], ['جاكرتا', -6.2088, 106.8456, 'Asia/Jakarta'],
      ['سنغافورة', 1.3521, 103.8198, 'Asia/Singapore'], ['بكين', 39.9042, 116.4074, 'Asia/Shanghai'], ['هونغ كونغ', 22.3193, 114.1694, 'Asia/Hong_Kong'],
      ['سيول', 37.5665, 126.978, 'Asia/Seoul'], ['طوكيو', 35.6762, 139.6503, 'Asia/Tokyo']]],
    ['الأمريكتان', [
      ['نيويورك', 40.7128, -74.006, 'America/New_York'], ['واشنطن', 38.9072, -77.0369, 'America/New_York'], ['شيكاغو', 41.8781, -87.6298, 'America/Chicago'],
      ['دنفر', 39.7392, -104.9903, 'America/Denver'], ['لوس أنجلوس', 34.0522, -118.2437, 'America/Los_Angeles'], ['تورنتو', 43.6532, -79.3832, 'America/Toronto'],
      ['مكسيكو سيتي', 19.4326, -99.1332, 'America/Mexico_City'], ['بوغوتا', 4.711, -74.0721, 'America/Bogota'], ['ساو باولو', -23.5505, -46.6333, 'America/Sao_Paulo'],
      ['بوينس آيرس', -34.6037, -58.3816, 'America/Argentina/Buenos_Aires']]],
    ['أوقيانوسيا', [['سيدني', -33.8688, 151.2093, 'Australia/Sydney'], ['أوكلاند', -36.8485, 174.7633, 'Pacific/Auckland']]]
  ];
  var CITIES = [];
  GROUPS.forEach(function (g) { g[1].forEach(function (c) { CITIES.push(c); }); });
  var SIGNS_AR = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var EL = [['نار', 0], ['تراب', 1], ['هواء', 2], ['ماء', 3]], MODS = ['كاردينال', 'ثابت', 'متحول'];
  var SIGN_EL = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3], SIGN_MOD = [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2];
  var PL = [['sun', 'الشمس'], ['moon', 'القمر'], ['mercury', 'عطارد'], ['venus', 'الزهرة'], ['mars', 'المريخ'], ['jupiter', 'المشتري'], ['saturn', 'زحل'], ['uranus', 'أورانوس'], ['neptune', 'نبتون'], ['pluto', 'بلوتو']];
  var PHASES = [[348.75, 'محاق'], [11.25, 'هلال متزايد'], [78.75, 'التربيع الأول'], [101.25, 'أحدب متزايد'], [168.75, 'بدر'], [191.25, 'أحدب متناقص'], [258.75, 'التربيع الأخير'], [281.25, 'هلال متناقص']];
  var HOUSE_AR = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'];
  var HOUSE_AREA = ['الشخصية وشكل الظهور', 'المال والإحساس بالقيمة', 'التواصل والتنقلات القريبة', 'البيت والعائلة والجذور', 'الحب والمتعة والإبداع', 'العمل اليومي والصحة', 'الشراكات والعلاقات', 'التحولات والمشاركات العميقة', 'السفر والمعرفة والفلسفة', 'المسار المهني والمكانة', 'الصداقات والأحلام', 'العزلة والباطن والخفايا'];
  var ASP = [['conj', 0, 'اقتران', 8], ['sext', 60, 'تسديس', 5], ['square', 90, 'تربيع', 6], ['trine', 120, 'تثليث', 6], ['opp', 180, 'مقابلة', 7]];
  var RX = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4 4 9l5 5"/><path d="M4 9h9.500a5.500 5.500 0 0 1 0 11H10"/></svg>';
  var NODE_G = 'M4 18h5a6 6 0 1 1 6 0h5';
  var GLY = {};
  var $ = function (id) { return document.getElementById(id); };
  var dateI = $('swc-date'), timeI = $('swc-time'), citySel = $('swc-city'), capEl = $('swc-cap'), moonEl = $('swc-moon'), gridEl = $('swc-pgrid'), errEl = $('swc-err');
  var live = true, cur = null, sel = null;

  var ci = 0; GROUPS.forEach(function (g) { var og = document.createElement('optgroup'); og.label = g[0]; g[1].forEach(function (c) { var o = document.createElement('option'); o.value = ci++; o.textContent = c[0]; og.appendChild(o); }); citySel.appendChild(og); });
  function mod(x) { return ((x % 360) + 360) % 360; }
  function p2(n) { return (n < 10 ? '0' : '') + n; }
  function nowLocal(c) {
    var f = new Intl.DateTimeFormat('en-GB', { timeZone: c[3], year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }), o = {};
    f.formatToParts(new Date()).forEach(function (x) { o[x.type] = +x.value; });
    return { y: o.year, m: o.month, d: o.day, hh: o.hour, mm: o.minute };
  }
  function setInputs(t) { dateI.value = t.y + '-' + p2(t.m) + '-' + p2(t.d); timeI.value = p2(t.hh) + ':' + p2(t.mm); }
  function addDays(t, n) { var d = new Date(Date.UTC(t.y, t.m - 1, t.d + n, t.hh, t.mm)); return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), hh: d.getUTCHours(), mm: d.getUTCMinutes() }; }
  function dm(lon) { var d = Math.floor(mod(lon) % 30), m = Math.floor((mod(lon) % 1) * 60); return d + '°' + p2(m) + '′'; }
  function dmb(lon) { return '<bdi dir="ltr">' + dm(lon) + '</bdi>'; }
  function phaseName(el) { var n = PHASES[0][1]; for (var i = 1; i < PHASES.length; i++) if (el >= PHASES[i][0]) n = PHASES[i][1]; if (el >= 348.75) n = PHASES[0][1]; return n; }
  function path(k, cls, sw) { var d = k === 'node' ? NODE_G : GLY[k]; return d ? '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>' : ''; }
  function wd(st) { return ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][new Date(Date.UTC(st.y, st.m - 1, st.d)).getUTCDay()]; }
  function dateTxt(st) { return wd(st) + ' ' + st.d + '/' + st.m + '/' + st.y + ' · ' + p2(st.hh) + ':' + p2(st.mm) + ' بتوقيت ' + st.city[0]; }

  function compute() {
    var A = window.Astro; if (!A || typeof A.chart !== 'function') throw new Error('engine');
    GLY = window.AqeeqGL || GLY;
    var c = CITIES[+citySel.value] || CITIES[0], v = dateI.value, tv = timeI.value;
    if (!v || !tv) throw new Error('empty');
    var dp = v.split('-').map(Number), tp = tv.split(':').map(Number);
    if (dp[0] < 1900 || dp[0] > 2100) throw new Error('range');
    var utc = A.localToUtcMs(dp[0], dp[1], dp[2], tp[0], tp[1], c[3]);
    var ch = A.chart({ utcMs: utc, lat: c[1], lon: c[2], hs: 'placidus', known: true });
    var items = PL.map(function (p) { var b = null; for (var j = 0; j < ch.bodies.length; j++) if (ch.bodies[j].key === p[0]) b = ch.bodies[j]; return b ? { k: p[0], n: p[1], lon: mod(b.lon), retro: !!b.retro, sign: Math.floor(mod(b.lon) / 30), house: b.house } : null; }).filter(Boolean);
    var nb = null; for (var q = 0; q < ch.bodies.length; q++) if (ch.bodies[q].key === 'node') nb = ch.bodies[q];
    var node = nb ? { k: 'node', n: 'العقدة القمرية الشمالية', lon: mod(nb.lon), retro: false, sign: Math.floor(mod(nb.lon) / 30), house: nb.house } : null;
    var asp = [];
    for (var i = 0; i < items.length; i++) for (var j2 = i + 1; j2 < items.length; j2++) {
      var d = Math.abs(items[i].lon - items[j2].lon); if (d > 180) d = 360 - d;
      var lum = items[i].k === 'sun' || items[i].k === 'moon' || items[j2].k === 'sun' || items[j2].k === 'moon';
      for (var a = 0; a < ASP.length; a++) { var o = Math.abs(d - ASP[a][1]), lim = ASP[a][3] + (lum ? 1 : 0) - (ASP[a][0] === 'conj' || lum ? 0 : 0); if (o <= lim) { asp.push({ A: items[i], B: items[j2], t: ASP[a], o: o }); break; } }
    }
    asp.sort(function (x, y) { return x.o - y.o; });
    return { ch: ch, city: c, y: dp[0], m: dp[1], d: dp[2], hh: tp[0], mm: tp[1], items: items, node: node, asp: asp };
  }

  /* ---------- العجلة بمعيار Astro.com: درجات ودقائق، تدريج 1°/5°/10°، تباعد ذكي وخطوط توصيل، وتركيز على كوكب ---------- */
  function wheel(st) {
    var ch = st.ch, asc = ch.asc, mc = ch.mc, cx = 270, R1 = 238, R2 = 198, R3 = 88, RP = 156, RL = 127, RN = 102;
    function pt(lon, r) { var a = (180 + (lon - asc)) * Math.PI / 180; return [cx + r * Math.cos(a), cx - r * Math.sin(a)]; }
    function f(n) { return n.toFixed(1); }
    function ln(a, b, at) { return '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '" ' + (at || '') + '/>'; }
    var o = '<defs><radialGradient id="swcC" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFFDF9"/><stop offset="1" stop-color="#FFFDF9"/></radialGradient></defs>';
    for (var i = 0; i < 12; i++) {
      var p0 = pt(i * 30, R1), p1 = pt(i * 30 + 30, R1), p2_ = pt(i * 30 + 30, R2), p3 = pt(i * 30, R2);
      o += '<path d="M' + f(p0[0]) + ' ' + f(p0[1]) + 'A' + R1 + ' ' + R1 + ' 0 0 0 ' + f(p1[0]) + ' ' + f(p1[1]) + 'L' + f(p2_[0]) + ' ' + f(p2_[1]) + 'A' + R2 + ' ' + R2 + ' 0 0 1 ' + f(p3[0]) + ' ' + f(p3[1]) + 'Z" fill="' + (i % 2 ? '#6A2A3C' : '#5E2234') + '" stroke="#C5A059" stroke-width=".9"/>';
      var g = pt(i * 30 + 15, (R1 + R2) / 2), d = GLY['s' + i];
      if (d) o += '<path transform="translate(' + f(g[0] - 16.8) + ' ' + f(g[1] - 16.8) + ') scale(1.4)" d="' + d + '" fill="none" stroke="#F3DFA8" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    o += '<circle cx="' + cx + '" cy="' + cx + '" r="' + R2 + '" fill="url(#swcC)" stroke="#C5A059" stroke-width="1.2"/><circle cx="' + cx + '" cy="' + cx + '" r="' + R3 + '" fill="#FFFDF9" stroke="#C5A059" stroke-width="1"/>';
    var t1 = '', t5 = '', t10 = '';
    for (var a = 0; a < 360; a++) { var seg = 'M' + f(pt(a, R2)[0]) + ' ' + f(pt(a, R2)[1]) + 'L' + f(pt(a, R2 - (a % 10 === 0 ? 9 : a % 5 === 0 ? 6 : 3))[0]) + ' ' + f(pt(a, R2 - (a % 10 === 0 ? 9 : a % 5 === 0 ? 6 : 3))[1]); if (a % 10 === 0) t10 += seg; else if (a % 5 === 0) t5 += seg; else t1 += seg; }
    o += '<g fill="none" stroke="#B8965A"><path d="' + t1 + '" stroke-width=".45" stroke-opacity=".7"/><path d="' + t5 + '" stroke-width=".75" stroke-opacity=".9"/><path d="' + t10 + '" stroke-width="1"/></g>';
    var cu = ch.cusps, hl = '', hn = '';
    for (i = 0; i < 12; i++) {
      var ax = i % 3 === 0;
      hl += ln(pt(cu[i], R2), pt(cu[i], R3), 'stroke="' + (ax ? '#3A0D1B' : '#5A3E26') + '" stroke-width="' + (ax ? 3 : 2) + '" stroke-opacity="' + (ax ? 1 : .9) + '"');
      var mid = cu[i] + mod(cu[(i + 1) % 12] - cu[i]) / 2, q = pt(mid, RN);
      hn += '<text x="' + f(q[0]) + '" y="' + f(q[1] + 3.5) + '" text-anchor="middle">' + (i + 1) + '</text>';
    }
    o += hl + '<g font-size="10.5" font-weight="600" fill="#8A6A4C" font-family="Cairo,sans-serif">' + hn + '</g>';
    var lab = function (lon, t) { var q = pt(lon, R1 + 17); return '<text x="' + f(q[0]) + '" y="' + f(q[1] + 4) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="#4A1521" font-family="Cairo,sans-serif">' + t + '</text>'; };
    o += lab(asc, 'الطالع') + lab(asc + 180, 'الغارب') + lab(mc, 'وسط السماء') + lab(mc + 180, 'وتد الأرض');
    var as = '';
    st.asp.forEach(function (x) {
      var hard = x.t[0] === 'square' || x.t[0] === 'opp';
      if (x.t[0] === 'conj') return;
      as += ln(pt(x.A.lon, R3), pt(x.B.lon, R3), 'class="swc-al" data-a="' + x.A.k + '" data-b="' + x.B.k + '" stroke="' + (hard ? '#B5233B' : '#1E78A8') + '" stroke-opacity=".92" stroke-width="2.2" stroke-linecap="round"');
    });
    o += as;
    /* تباعد: كل كوكب يبتعد عن جاره 15° على الأقل، وخط رفيع يربط الرمز بدرجته الحقيقية */
    var arr = st.items.concat(st.node ? [st.node] : []).map(function (it) { return { it: it, disp: it.lon }; }).sort(function (a, b) { return a.it.lon - b.it.lon; }), GAP = 17;
    for (var rep = 0; rep < 300; rep++) { var mv = false; for (var k = 0; k < arr.length; k++) { var A = arr[k], B = arr[(k + 1) % arr.length], gap = mod(B.disp - A.disp); if (gap < GAP - .05 && arr.length > 1) { var ps = (GAP - gap) / 2 + .02; A.disp = mod(A.disp - ps); B.disp = mod(B.disp + ps); mv = true; } } if (!mv) break; }
    arr.forEach(function (x) {
      var it = x.it, p = pt(x.disp, RP), pl = pt(x.disp, RL), t1p = pt(it.lon, R2), t2 = pt(it.lon, R2 - 11), g = it.k === 'node' ? NODE_G : (GLY[it.k] || ''), tap = true;
      var off = Math.abs(((x.disp - it.lon + 540) % 360) - 180) > .8, le = pt(x.disp, RP + 20);
      o += '<g class="swc-pl' + (it.k === 'node' ? ' is-node' : '') + '" data-k="' + it.k + '" tabindex="0" role="button"><title>' + it.n + ' · ' + SIGNS_AR[it.sign] + ' ' + dm(it.lon) + (it.retro ? ' · متراجع' : '') + '</title>' + ln(t1p, t2, 'stroke="#6B2234" stroke-width="1.4"') +
        '<circle cx="' + f(t2[0]) + '" cy="' + f(t2[1]) + '" r="1.7" fill="#6B2234"/>' +
        (off ? ln(t2, le, 'stroke="#6B2234" stroke-width="1.6" stroke-opacity=".95"') : ln(t2, le, 'stroke="#6B2234" stroke-width="1.1" stroke-opacity=".6"')) +
        '<circle class="swc-hit" cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="22" fill="#6B2234" fill-opacity="0"/>' +
        '<circle class="swc-ring" cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="19" fill="none" stroke="none"/>' +
        '<path class="swc-halo" transform="translate(' + f(p[0] - 16) + ' ' + f(p[1] - 16) + ') scale(1.333)" d="' + g + '" fill="none" stroke="#FFFDF9" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round" stroke-opacity=".92"/>' +
        '<path class="swc-glyph" transform="translate(' + f(p[0] - 16) + ' ' + f(p[1] - 16) + ') scale(1.333)" d="' + g + '" fill="none" stroke="#5A182A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<text class="swc-dg" x="' + f(pl[0]) + '" y="' + f(pl[1] + 3.9) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#4A1224" font-family="Cairo,sans-serif" paint-order="stroke" stroke="#FFFDF9" stroke-width="3.6" stroke-linejoin="round" style="direction:ltr;unicode-bidi:plaintext">' + dm(it.lon) + '</text>' +
        (it.retro ? '<g class="swc-rx"><title>متراجع</title><circle cx="' + f(p[0] + 15) + '" cy="' + f(p[1] - 15) + '" r="9" fill="#B8473E" stroke="#FFFDF7" stroke-width="1.2"/><svg x="' + f(p[0] + 15 - 5.5) + '" y="' + f(p[1] - 15 - 5.5) + '" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 4 9l5 5"/><path d="M4 9h9.500a5.500 5.500 0 0 1 0 11H10"/></svg></g>' : '') + '</g>';
    });
    return o;
  }

  function moonBlock(st) {
    var sun = st.items[0], moon = st.items[1], el = mod(moon.lon - sun.lon), il = Math.round((1 - Math.cos(el * Math.PI / 180)) / 2 * 100), age = (el / 360 * 29.53).toFixed(1);
    var mk = typeof window.AqeeqMoon === 'function' ? window.AqeeqMoon(el) : '';
    return { el: el, il: il, age: age, svg: '<svg class="swc-moon-svg" viewBox="0 0 120 120" role="img" aria-label="القمر: ' + phaseName(el) + '، إضاءة ' + il + '%">' + mk + '</svg>', ph: phaseName(el), moon: moon, sun: sun };
  }

  function renderCard(st) {
    svg.innerHTML = wheel(st);
    var m = moonBlock(st);
    moonEl.innerHTML = '<div class="swc-moon-fig">' + m.svg + '</div><div class="swc-moon-txt"><small>القمر في التاريخ المختار</small><b>' + m.ph + '</b><span>القمر في ' + SIGNS_AR[m.moon.sign] + ' ' + dmb(m.moon.lon) + '</span><span>إضاءة ' + m.il + '% · عمره ' + m.age + ' يوم</span></div>';
    gridEl.innerHTML = st.items.map(function (it) {
      var fixed = it.k === 'sun' || it.k === 'moon';
      return '<button type="button" class="swc-pc' + (it.retro ? ' is-retro' : '') + '" data-k="' + it.k + '"><span class="swc-pc-m">' + path(it.k, 'swc-pc-g') + '</span><span class="swc-pc-t"><b>' + it.n + '</b><small>' + SIGNS_AR[it.sign] + ' ' + dmb(it.lon) + '</small></span>' +
        (fixed ? '' : '<i class="swc-pc-st ' + (it.retro ? 'is-retro' : 'is-direct') + '">' + (it.retro ? 'متراجع' : 'مباشر') + '</i>') +
        '<span class="swc-pc-go" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></span></button>';
    }).join('');
    if (foc) focusPlanet(foc, true); else idleCap(st);
    renderTabs(st);
  }
  function idleCap(st) { capEl.className = 'swc-cap'; capEl.textContent = wd(st) + ' ' + st.d + '/' + st.m + '/' + st.y + ' · ' + p2(st.hh) + ':' + p2(st.mm) + ' · ' + st.city[0] + (live ? ' · الآن' : ''); }

  /* ---------- تركيز على كوكب: شريط قراءة حي فوق العجلة + إبراز زواياه وتعتيم الباقي ---------- */
  var foc = null;
  function focusPlanet(k, keep) {
    var st = cur, it = null; if (!st) return;
    st.items.concat(st.node ? [st.node] : []).forEach(function (x) { if (x.k === k) it = x; });
    if (!it) { foc = null; idleCap(st); return; }
    foc = k; highlight(k);
    var n = 0;
    [].forEach.call(svg.querySelectorAll('.swc-al'), function (l) { var inv = l.getAttribute('data-a') === k || l.getAttribute('data-b') === k; l.classList.toggle('is-hot', inv); l.classList.toggle('is-dim', !inv); });
    st.asp.forEach(function (x) { if (x.A.k === k || x.B.k === k) n++; });
    svg.classList.add('has-foc');
    capEl.className = 'swc-cap is-focus';
    capEl.innerHTML = '<span class="swc-fp-g">' + path(k, 'swc-fp-gi', 1.8) + '</span><span class="swc-fp-t"><b>' + it.n + (it.retro ? ' <em class="rx-b" title="متراجع">' + RX + '</em>' : '') + '</b><small>' + SIGNS_AR[it.sign] + ' ' + dmb(it.lon) + ' · البيت ' + (it.house || 1) + (k === 'node' ? '' : ' · ' + (n ? n + (n > 2 ? ' زوايا' : n === 2 ? ' زاويتان' : ' زاوية') : 'بلا زوايا قوية')) + '</small></span>' +
      (k === 'node' ? '' : '<button type="button" class="swc-fp-go" data-open="' + k + '">القراءة</button>') + '<button type="button" class="swc-fp-x" data-clear aria-label="إلغاء التركيز"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>';
  }
  function clearFocus() {
    foc = null; svg.classList.remove('has-foc');
    [].forEach.call(svg.querySelectorAll('.swc-al'), function (l) { l.classList.remove('is-hot', 'is-dim'); });
    [].forEach.call(svg.querySelectorAll('.swc-pl.is-sel'), function (g) { g.classList.remove('is-sel'); });
    if (cur) idleCap(cur);
  }

  /* ---------- التبويبات الخمسة ---------- */
  var sigs = {};
  function barRow(label, pct, cls) { return '<div class="swb"><span>' + label + '</span><i><u class="' + cls + '" style="width:' + pct + '%"></u></i><b>' + pct + '%</b></div>'; }
  function sgIc(i) { return path('s' + i, 'swt-sg'); }
  function renderTabs(st) { renderMine(st); renderHouses(st); renderElem(st); }
  function skipSame(name, key) { if (sigs[name] === key) return true; sigs[name] = key; return false; }

  /* قفل تمرير الخلفية بثبات: نحفظ الموضع ونعيده بلا قفزة، والإخفاء بعد انتهاء حركة الخروج */
  (function () { function inScroll(t) { return t.closest && t.closest('.aqm-sheet-body, .aqm-sheet-panel [style*="overflow"]'); }
    function blk(e) { var t = e.target; if (t.closest && t.closest('.aqm-sheet') && !inScroll(t)) e.preventDefault(); }
    document.addEventListener('touchmove', blk, { passive: false }); document.addEventListener('wheel', blk, { passive: false }); })();
  var lockY = 0, locks = 0;
  function lockBg() { if (!locks++) { lockY = window.pageYOffset || 0; } root.classList.add('aqm-sheet-open'); }
  function unlockBg() { if (locks > 0 && !--locks) { root.classList.remove('aqm-sheet-open'); if ((window.pageYOffset || 0) !== lockY) window.scrollTo(0, lockY); } }
  /* كل فتح يبدأ من أول الورقة: نعيد الضبط بعد كل إعادة رسم أو تحميل نص متأخر، ونتوقف إن لمس القارئ الشاشة */
  function topScroll(s) {
    var b = s.querySelector('.aqm-sheet-body'), pn = s.querySelector('.aqm-sheet-panel'), stop = false;
    function z() { if (stop) return; if (b) b.scrollTop = 0; if (pn) pn.scrollTop = 0; }
    function off() { stop = true; s.removeEventListener('touchstart', off, true); s.removeEventListener('wheel', off, true); }
    s.addEventListener('touchstart', off, true); s.addEventListener('wheel', off, true);
    z(); requestAnimationFrame(function () { z(); requestAnimationFrame(z); });
    [120, 350, 800].forEach(function (t) { setTimeout(z, t); });
    setTimeout(off, 900);
  }
  function openSh(s) { var was = !s.hidden; s.classList.remove('is-closing'); s.hidden = false; if (!was) lockBg(); topScroll(s); }
  function closeSh(s) { if (!s || s.hidden || s.classList.contains('is-closing')) return; s.classList.add('is-closing'); setTimeout(function () { s.hidden = true; s.classList.remove('is-closing'); unlockBg(); }, 240); }
  var mineOpen = false, mineSheet = null, mineK = null;
  function numAr(n) { try { return n.toLocaleString('ar-EG'); } catch (e) { return String(n); } }
  function mineData(st, k) {
    var A = window.AqSky, R = window.AqReadings, sg = A.getSign(), bd = null;
    st.items.forEach(function (i) { if (i.k === k) bd = i; });
    var hh = ((bd.sign - sg + 12) % 12) + 1, H = A.HOUSES[hh - 1], hasTr = R.TR[k] && R.TR[k][hh - 1];
    return { bd: bd, hh: hh, H: H, txt: hasTr || (R.PH[k] && R.PH[k][hh - 1]) || '', q1: (hasTr && A.PQH[k] && A.PQH[k][hh - 1]) || A.PQ[k] || '', q2: A.HQ[hh - 1] ? A.HQ[hh - 1][(Math.floor(Date.now() / 864e5) + sg) % 2] : '', rt: bd.retro && R.RT[k] ? R.RT[k] : '' };
  }
  function renderMine(st) {
    var host = $('swc-mine'), A = window.AqSky, R = window.AqReadings; if (!host) return;
    if (!A || !R) { host.innerHTML = '<p class="swt-empty">القراءات قيد التحميل…</p>'; sigs.mine = ''; return; }
    var sg = A.getSign();
    if (!host.querySelector('.swm-pk')) {
      host.innerHTML = '<div class="swm-top"></div><div class="swm-pk"><div class="swm-pk-in"><section class="swm-pick"><b>اختر برجك الشمسي أو طالعك</b><small>مرة واحدة فقط، ونعرض لك كيف تلمس سماء هذه اللحظة بيوتك</small><div class="sky-signs" role="group" aria-label="اختر برجك أو طالعك">' +
        A.SIGNS.map(function (x, i) { return '<button type="button" class="sky-sg" data-i="' + i + '" aria-pressed="false"><span class="sg" aria-hidden="true">' + A.gl(x.g) + '</span><span>' + x.n + '</span></button>'; }).join('') + '</div></section></div></div><div class="swm-body"></div>';
    }
    if (sg === null) mineOpen = true;
    var key = (sg === null ? 'x' : sg) + '|' + st.items.map(function (i) { return i.k + i.sign + (i.retro ? 'r' : ''); }).join('');
    var pk = host.querySelector('.swm-pk'), chg;
    pk.classList.toggle('is-open', mineOpen);
    [].forEach.call(pk.querySelectorAll('.sky-sg'), function (b, i) { b.classList.toggle('is-on', i === sg); b.setAttribute('aria-pressed', i === sg); });
    var top = host.querySelector('.swm-top'), body = host.querySelector('.swm-body');
    if (sg === null) { top.innerHTML = ''; body.innerHTML = '<p class="swt-empty">اختر برجك لنعرض لك تقرير اليوم: أين يقف كل كوكب في حياتك.</p>'; sigs.mine = ''; return; }
    var nx = (sg + 1) % 12;
    top.innerHTML = '<div class="swm-ban"><div class="swm-ban-r"><span class="swm-ban-g"><span class="sg" aria-hidden="true">' + A.gl(A.SIGNS[sg].g) + '</span></span><div><small>تأثير سماء هذه اللحظة على</small><b>برج ' + A.SIGNS[sg].n + '</b></div>' +
      '<button type="button" class="swm-chg" data-chg aria-expanded="' + mineOpen + '">' + (mineOpen ? 'إخفاء' : 'تغيير البرج') + '</button></div>' +
      '<button type="button" class="swm-nx" data-nxs><span>البرج التالي: <b>' + A.SIGNS[nx].n + '</b></span><span class="sg" aria-hidden="true">' + A.gl(A.SIGNS[nx].g) + '</span></button></div>';
    if (sigs.mine === key) return; sigs.mine = key;
    body.innerHTML = '<div class="swg">' + st.items.map(function (bd) {
      var d = mineData(st, bd.k);
      return '<button type="button" class="swg-c' + (bd.retro ? ' is-retro' : '') + '" data-mk="' + bd.k + '"><span class="swg-g">' + path(bd.k, 'swg-gi') + '</span><b>' + bd.n + '</b><i class="swg-h">البيت ' + numAr(d.hh) + '</i>' + (bd.retro ? '<em class="rx-b" title="متراجع">' + RX + '</em>' : '') + '</button>';
    }).join('') + '</div><p class="swg-tip">اضغط أي كوكب لتقرأ أثره في بيتك</p>';
    queueUp();
  }
  /* ورقة سفلية موحدة لقراءة كوكب في بيت البرج المختار */
  function ensureMine() {
    if (mineSheet) return mineSheet;
    mineSheet = document.createElement('div'); mineSheet.className = 'aqm-sheet swp-sheet mns-sheet'; mineSheet.hidden = true;
    mineSheet.innerHTML = '<div class="aqm-sheet-scrim" data-mnc></div><div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-label="أثر الكوكب في بيتك"><span class="aqm-sheet-grip"></span><div class="aqm-sheet-body swp-body mns-body"></div>' +
      '<div class="aqm-sheet-foot"><button type="button" class="aqm-foot-next" data-mnn><span class="aqm-foot-l"><small>الكوكب التالي</small><b></b></span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button><button type="button" class="aqm-foot-close" data-mnc>إغلاق</button></div></div>';
    document.body.appendChild(mineSheet);
    mineSheet.addEventListener('click', function (e) { if (e.target.closest('[data-mnn]')) { var o = st_items(); var i = o.indexOf(mineK); showMine(o[(i + 1) % o.length]); } else if (e.target.closest('[data-mnc]')) closeMine(); });
    mineSheet.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMine(); });
    return mineSheet;
  }
  function st_items() { return cur ? cur.items.map(function (i) { return i.k; }) : []; }
  function showMine(k) {
    var A = window.AqSky; if (!cur || !A || A.getSign() === null) return;
    mineK = k; var d = mineData(cur, k), bd = d.bd, s = ensureMine(), sg = A.getSign(), o = st_items(), nk = o[(o.indexOf(k) + 1) % o.length], nm = '';
    cur.items.forEach(function (i) { if (i.k === nk) nm = i.n; });
    s.querySelector('.mns-body').innerHTML = '<div class="mns-hero"><span class="swm-g">' + path(k, 'swm-gi') + '</span><div><span class="mns-sg"><span class="sg" aria-hidden="true">' + A.gl(A.SIGNS[sg].g) + '</span>برج ' + A.SIGNS[sg].n + '</span><h3>' + bd.n + ' في بيتك ' + d.H.n + '</h3><span class="mns-meta">' + SIGNS_AR[bd.sign] + ' ' + dmb(bd.lon) + ' · ' + d.H.area + (bd.retro ? ' <em class="rx-b" title="متراجع">' + RX + '</em>' : '') + '</span></div></div>' +
      (window.AqReadingBlock ? '<div class="mns-txt">' + window.AqReadingBlock.block(k, d.hh, d.txt) + '</div>' : '<p class="mns-txt">' + d.txt + '</p>') + (d.rt ? '<p class="swm-rt">' + d.rt + '</p>' : '') +
      '<div class="swm-q"><ul><li>' + d.q1 + '</li></ul></div>';
    s.querySelector('[data-mnn] b').textContent = nm;
    openSh(s); queueUp();
  }
  function closeMine() { closeSh(mineSheet); }

  function renderHouses(st) {
    var host = $('swc-houses'); if (!host) return;
    var ch = st.ch, key = ch.asc.toFixed(2) + '|' + st.items.map(function (i) { return i.k + (i.house || ''); }).join(''); if (skipSame('houses', key)) return;
    var angs = [['الطالع', ch.asc], ['الغارب', ch.asc + 180], ['وسط السماء', ch.mc], ['وتد الأرض', ch.mc + 180]];
    var h = '<div class="swt-angles">' + angs.map(function (a) { var s = Math.floor(mod(a[1]) / 30); return '<div class="swt-ang"><span class="swt-ang-i">' + sgIc(s) + '</span><div class="swt-ang-t"><small>' + a[0] + '</small><b>' + SIGNS_AR[s] + '</b><span>' + dmb(a[1]) + '</span></div></div>'; }).join('') + '</div>';
    h += '<div class="swt-hs">' + ch.cusps.map(function (c, i) {
      var s = Math.floor(mod(c) / 30), ps = st.items.filter(function (it) { return it.house === i + 1; }).map(function (it) { return '<span class="swt-hp"><i>' + path(it.k, 'swt-pg') + '</i>' + it.n + '</span>'; }).join('');
      return '<div class="swt-h"><span class="swt-hn">' + (i + 1) + '</span><div class="swt-ht"><b>البيت ' + HOUSE_AR[i] + '</b><small>' + HOUSE_AREA[i] + '</small></div><span class="swt-hc">' + sgIc(s) + SIGNS_AR[s] + ' ' + dmb(c) + '</span>' + (ps ? '<div class="swt-hps">' + ps + '</div>' : '') + '</div>';
    }).join('') + '</div>';
    host.innerHTML = h; queueUp();
  }

  function renderElem(st) {
    var host = $('swc-elem'); if (!host) return;
    var key = st.items.map(function (i) { return i.k + i.sign + (i.retro ? 'r' : ''); }).join(''); if (skipSame('elem', key)) return;
    var elc = [0, 0, 0, 0], mdc = [0, 0, 0];
    st.items.forEach(function (it) { elc[SIGN_EL[it.sign]]++; mdc[SIGN_MOD[it.sign]]++; });
    var n = st.items.length, pc = function (v) { return Math.round(v / n * 100); };
    var retro = st.items.filter(function (it) { return it.retro && it.k !== 'sun' && it.k !== 'moon'; });
    var h = '<section class="swt-card"><h4>توزيع العناصر</h4>' + barRow('نار', pc(elc[0]), 'e0') + barRow('تراب', pc(elc[1]), 'e1') + barRow('هواء', pc(elc[2]), 'e2') + barRow('ماء', pc(elc[3]), 'e3') + '</section>' +
      '<section class="swt-card"><h4>توزيع الأنماط</h4>' + barRow('كاردينال', pc(mdc[0]), 'm0') + barRow('ثابت', pc(mdc[1]), 'm1') + barRow('متحول', pc(mdc[2]), 'm2') + '</section>' +
      '<section class="swt-card"><h4>الكواكب المتراجعة</h4>' + (retro.length ? '<div class="swt-rx">' + retro.map(function (it) { return '<span class="swt-rxi"><em class="rx-b">' + RX + '</em>' + it.n + ' في ' + SIGNS_AR[it.sign] + '</span>'; }).join('') + '</div>' : '<p class="swt-empty is-in">لا يوجد كوكب متراجع في هذه اللحظة، فكل الكواكب تسير مباشرة.</p>') + '</section>';
    host.innerHTML = h;
  }

  function setTab(name) {
    [].forEach.call(document.querySelectorAll('.swt-t'), function (b) { var on = b.getAttribute('data-tab') === name; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); if (on && b.scrollIntoView) { try { var bar = b.parentNode; bar.scrollTo({ left: b.offsetLeft - (bar.clientWidth - b.offsetWidth) / 2, behavior: 'smooth' }); } catch (e) { } } });
    [].forEach.call(document.querySelectorAll('.swt-p'), function (p) { p.hidden = p.id !== 'swp-' + name; });
  }
  window.addEventListener('hashchange', function () { /* #world دُمجت في #sky */ });
  /* وصلت نصوص السماء المؤجلة: أعد رسم تبويب «برجك» الذي كان يعرض «قيد التحميل» */
  document.addEventListener('aq:sky-texts', function () { try { sigs.mine = ''; if (cur) renderMine(cur); } catch (e) { } });
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.swt-t'); if (t) { setTab(t.getAttribute('data-tab')); return; }
    var sgb = e.target.closest && e.target.closest('#swc-mine .sky-sg'); if (sgb && window.AqSky) { window.AqSky.setSign(+sgb.getAttribute('data-i')); mineOpen = false; renderMine(cur); return; }
    if (e.target.closest && e.target.closest('#swc-mine [data-nxs]') && window.AqSky) { window.AqSky.setSign((window.AqSky.getSign() + 1) % 12); renderMine(cur); return; }
    if (e.target.closest && e.target.closest('#swc-mine [data-chg]')) { mineOpen = !mineOpen; renderMine(cur); return; }
    var mc = e.target.closest && e.target.closest('#swc-mine [data-mk]'); if (mc) showMine(mc.getAttribute('data-mk'));
  });

  function render() {
    errEl.hidden = true;
    var st;
    try { st = compute(); } catch (e) {
      errEl.textContent = e.message === 'range' ? 'اختر تاريخاً بين 1900 و2100.' : (e.message === 'empty' ? 'أدخل التاريخ والوقت أولاً.' : 'تعذر حساب الخريطة حالياً.');
      errEl.hidden = false; return false;
    }
    cur = st; renderCard(st); syncSky(); var pc = document.querySelector('#sky-chips .chip[aria-pressed="true"]'); if (pc) sel = pc.getAttribute('data-k'); if (foc) focusPlanet(foc, true); else if (sel) highlight(sel);
    return true;
  }
  function syncSky() {
    var s = document.getElementById('sky-date'); if (!s) return;
    var v = live ? '' : dateI.value; if (s.value === v) return; s.value = v; s.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function highlight(k) {
    sel = k;
    [].forEach.call(svg.querySelectorAll('.swc-pl'), function (g) { g.classList.toggle('is-sel', g.getAttribute('data-k') === k); });
    [].forEach.call(gridEl.querySelectorAll('.swc-pc'), function (r) { r.classList.toggle('is-sel', r.getAttribute('data-k') === k); });
  }
  /* الضغط على كوكب يفتح قراءته في ورقة سفلية مرتبة بدل النزول لآخر الصفحة */
  var sheet = null, root = document.documentElement;
  function ensureSheet() {
    if (sheet) return sheet;
    sheet = document.createElement('div'); sheet.className = 'aqm-sheet swp-sheet'; sheet.hidden = true;
    sheet.innerHTML = '<div class="aqm-sheet-scrim" data-swpc></div><div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-label="قراءة الكوكب"><span class="aqm-sheet-grip"></span>' +
      '<button type="button" class="aqm-sheet-x" data-swpc aria-label="إغلاق"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="aqm-sheet-body swp-body"></div><div class="aqm-sheet-foot"><button type="button" class="aqm-foot-next" data-swpn><span class="aqm-foot-l"><small>القسم التالي</small><b></b></span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button><button type="button" class="aqm-foot-close" data-swpc>إغلاق</button></div></div>';
    document.body.appendChild(sheet);
    if ('MutationObserver' in window) new MutationObserver(function () { queueUp(); }).observe(sheet, { childList: true, subtree: true });
    sheet.addEventListener('click', function (e) { if (e.target.closest('[data-swpn]')) nextPlanet(); else if (e.target.closest('[data-swpc]')) closeSheet(); else if (e.target.closest('a[href]')) closeSheet(); });
    sheet.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
    return sheet;
  }
  function showSheet() {
    var s = ensureSheet(), body = s.querySelector('.swp-body'), panel = document.getElementById('sky-panel');
    if (panel && panel.parentNode !== body) body.appendChild(panel);
    openSh(s);
    updNext(); queueUp();
  }
  function closeSheet() { closeSh(sheet); }
  /* زر «القسم التالي»: ينتقل للكوكب التالي بنفس ترتيب الشبكة */
  function planetOrder() { return [].map.call(gridEl.querySelectorAll('.swc-pc'), function (b) { return b.getAttribute('data-k'); }); }
  function nextKey() { var o = planetOrder(), i = o.indexOf(sel); return o.length ? o[(i + 1) % o.length] : null; }
  function planetName(k) { for (var i = 0; i < PL.length; i++) if (PL[i][0] === k) return PL[i][1]; return ''; }
  function updNext() { if (!sheet) return; var b = sheet.querySelector('[data-swpn] b'), k = nextKey(); if (b && k) b.textContent = planetName(k); }
  function nextPlanet() { var k = nextKey(); if (k) openPlanet(k); }
  function openPlanet(k) {
    if (k === 'node') return;
    highlight(k);
    var n = 0;
    (function go() {
      var chip = document.querySelector('#sky-chips .chip[data-k="' + k + '"]');
      if (chip) { if (chip.getAttribute('aria-pressed') !== 'true') chip.click(); showSheet(); }
      else if (n++ < 20) setTimeout(go, 120);
    })();
  }

  /* بطاقات الزوايا: الضغط على أي بطاقة يفتح قراءتها في ورقة سفلية مع «القسم التالي» */
  var axSheet = null, axI = 0;
  function axList() { return [].slice.call(document.querySelectorAll('#sky-asp .ax')); }
  function ensureAx() {
    if (axSheet) return axSheet;
    axSheet = document.createElement('div'); axSheet.className = 'aqm-sheet swp-sheet axs-sheet'; axSheet.hidden = true;
    axSheet.innerHTML = '<div class="aqm-sheet-scrim" data-axc></div><div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-label="قراءة الزاوية"><span class="aqm-sheet-grip"></span>' +
            '<div class="aqm-sheet-body swp-body axs-body"></div><div class="aqm-sheet-foot"><button type="button" class="aqm-foot-next" data-axn><span class="aqm-foot-l"><small>القسم التالي</small><b></b></span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button><button type="button" class="aqm-foot-close" data-axc>إغلاق</button></div></div>';
    document.body.appendChild(axSheet);
    axSheet.addEventListener('click', function (e) { if (e.target.closest('[data-axn]')) renderAx(axI + 1); else if (e.target.closest('[data-axc]')) closeAx(); });
    axSheet.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAx(); });
    return axSheet;
  }
  function renderAx(i) {
    var L = axList(); if (!L.length) return; axI = ((i % L.length) + L.length) % L.length;
    var el = L[axI], s = ensureAx(), body = s.querySelector('.axs-body'), tone = (el.className.match(/axt-(\w)/) || [])[1] || 'n';
    var bx = el.querySelector('.ax-b'), qs = [].slice.call(bx.querySelectorAll('.ax-q')).slice(0, 2), orb = parseFloat(el.getAttribute('data-orb')), lim = parseFloat(el.getAttribute('data-lim')) || 8, pct = isNaN(orb) ? 0 : Math.max(2, Math.min(100, (1 - orb / lim) * 100)), tight = !isNaN(orb) && orb <= lim / 3;
    var txt = [].filter.call(bx.children, function (c) { return !c.classList.contains('ax-q'); }).map(function (c) { return c.outerHTML; }).join('');
    body.innerHTML = '<div class="axs-hero axt-' + tone + '">' + el.querySelector('.ax-pair').outerHTML + '<div class="axs-t"><b>' + el.querySelector('.ax-t b').innerHTML + '</b><small>' + el.querySelector('.ax-t small').innerHTML + '</small></div></div>' +
      (isNaN(orb) ? '' : '<div class="axs-orb"><div class="axs-orb-h"><b>دقة الزاوية</b><span>' + (tight ? 'زاوية قوية' : orb <= lim * .66 ? 'زاوية متوسطة' : 'زاوية خفيفة') + ' · <bdi dir="ltr">' + orb.toFixed(1).replace(/\.0$/, '') + '°</bdi></span></div><div class="axs-orb-bar"><i style="width:' + pct.toFixed(0) + '%"></i></div><div class="axs-orb-s"><span><bdi dir="ltr">0°</bdi></span><span><bdi dir="ltr">' + lim + '°</bdi></span></div></div>') +
      '<div class="axs-txt">' + txt + '</div>' + (qs.length ? '<div class="swm-q"><ul>' + qs.map(function (z) { return '<li>' + z.innerHTML + '</li>'; }).join('') + '</ul></div>' : '');
    var nx = L[(axI + 1) % L.length], nb = s.querySelector('[data-axn]'); nb.hidden = L.length < 2; nb.querySelector('b').textContent = nx.querySelector('.ax-t b').textContent;
    openSh(s); queueUp();
  }
  function closeAx() { closeSh(axSheet); }
  var axHost = document.getElementById('sky-asp');
  if (axHost) axHost.addEventListener('click', function (e) { var b = e.target.closest('.ax-s'); if (!b) return; var L = axList(), i = L.indexOf(b.parentNode); if (i > -1) renderAx(i); });

  function setQuick(btn) { [].forEach.call(form.querySelectorAll('.swc-quick button'), function (b) { b.classList.toggle('is-on', b === btn); }); }
  form.addEventListener('submit', function (e) { e.preventDefault(); live = false; setQuick(null); render(); });
  form.querySelector('.swc-quick').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var off = +b.getAttribute('data-off'), c = CITIES[+citySel.value], t = addDays(nowLocal(c), off);
    setInputs(t); live = off === 0; setQuick(b); render();
  });
  [dateI, timeI, citySel].forEach(function (el) { el.addEventListener('change', function () { if (el === citySel && live) { setInputs(nowLocal(CITIES[+citySel.value])); } else { live = false; setQuick(null); } render(); }); });
  /* أسهم زيادة/نقص يوم بجانب التاريخ: تُحدّث الخريطة والقمر وقسم الكوكب مباشرة */
  [].forEach.call(form.querySelectorAll('.swc-step'), function (b) {
    b.addEventListener('click', function () {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateI.value); if (!m) return;
      var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + (+b.getAttribute('data-step'))));
      if (d.getUTCFullYear() < 1900 || d.getUTCFullYear() > 2100) return;
      dateI.value = d.getUTCFullYear() + '-' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + d.getUTCDate()).slice(-2);
      live = false; setQuick(null); render();
    });
  });
  function pickEv(e) { var n = e.target.closest('[data-k]'); if (n) openPlanet(n.getAttribute('data-k')); }
  function wheelEv(e) { var n = e.target.closest('.swc-pl[data-k]'); if (!n) { if (!e.target.closest('.swc-cap')) clearFocus(); return; } var k = n.getAttribute('data-k'); if (foc === k) clearFocus(); else focusPlanet(k); }
  svg.addEventListener('click', wheelEv); gridEl.addEventListener('click', pickEv);
  capEl.addEventListener('click', function (e) { var o = e.target.closest('[data-open]'); if (o) { openPlanet(o.getAttribute('data-open')); return; } if (e.target.closest('[data-clear]')) clearFocus(); });
  svg.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); wheelEv(e); } });
  function toWorld() { if (location.hash === '#world') { try { location.replace(location.pathname + location.search + '#sky'); } catch (e) { location.hash = '#sky'; } setTab('houses'); } }
  window.addEventListener('hashchange', toWorld);


  /* توحيد رموز الكواكب والأبراج في قسم الرصد: تحويل الحروف النصية الباهتة إلى نفس الأيقونات المرسومة */
  var CHAR_KEY = null;
  function charMap() {
    if (CHAR_KEY) return CHAR_KEY; CHAR_KEY = {};
    try { if (typeof PLANETS !== 'undefined') Object.keys(PLANETS).forEach(function (k) { if (PLANETS[k].g) CHAR_KEY[PLANETS[k].g.replace(/[\uFE0E\uFE0F]/g, '')] = k; }); } catch (e) {}
    try { if (typeof SIGNS !== 'undefined') SIGNS.forEach(function (s, i) { if (s.g) CHAR_KEY[s.g.replace(/[\uFE0E\uFE0F]/g, '')] = 's' + i; }); } catch (e) {}
    return CHAR_KEY;
  }
  function upgradeGlyphs() {
    var G = window.AqeeqGL, M = charMap(); if (!G) return;
    [].forEach.call(document.querySelectorAll('#sky .sg:not([data-sv]),#world .sg:not([data-sv]),.swp-sheet .sg:not([data-sv]),#signs .sg:not([data-sv]),.sgs-sheet .sg:not([data-sv]),.sgs-sheet .lpa-ic:not([data-sv]),.sgs-sheet .zp-glyph:not([data-sv])'), function (el) {
      var key = M[(el.textContent || '').replace(/[\uFE0E\uFE0F\s]/g, '')];
      el.setAttribute('data-sv', '1');
      if (key && G[key]) el.innerHTML = '<svg class="sg-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + G[key] + '"/></svg>';
    });
  }
  var upQ = 0;
  window.AqUpGlyphs = function () { queueUp(); };
  function queueUp() { if (upQ) return; upQ = requestAnimationFrame(function () { upQ = 0; upgradeGlyphs(); }); }
  if ('MutationObserver' in window) { var skyEl = document.getElementById('sky'); if (skyEl) new MutationObserver(queueUp).observe(skyEl, { childList: true, subtree: true }); new MutationObserver(queueUp).observe(document.body, { childList: true }); queueUp(); }

  function init() { try { setInputs(nowLocal(CITIES[0])); render(); toWorld(); upgradeGlyphs(); } catch (e) { errEl.textContent = 'تعذر حساب الخريطة حالياً.'; errEl.hidden = false; } }
  window.addEventListener('load', init);
  if (document.readyState === 'complete') init();
  setInterval(function () { if (live && !document.hidden) { setInputs(nowLocal(CITIES[+citySel.value])); render(); } }, 60000);
  window.__swc = { render: render, state: function () { return cur; } };
})();

;
/* assets/js/auth-ui.js */
/* واجهة نافذة الحساب فقط: نصوص وحالات عرض. لا تمسّ Supabase ولا منطق auth.js. */
(function () {
  var sec = document.getElementById('account'); if (!sec) return;
  var q = function (s) { return sec.querySelector(s); };
  var title = q('#acx-title'), sub = q('#acx-sub'), submit = q('#acct-submit'), forgot = q('#acct-forgot'), back = q('#acx-back'),
    form = q('#acct-form'), pass = q('#acct-pass'), swQ = q('#acx-switch-q'), swBtn = q('#acx-switch-btn');
  if (!title || !form) return;
  var reset = false;
  function mode() { var t = sec.querySelector('.acct-tabs button[aria-selected="true"]'); return t ? t.getAttribute('data-mode') : 'signin'; }
  function set(el, t) { if (el && el.textContent !== t) el.textContent = t; }
  function render() {
    var m = mode(), usr = q('#acct-user');
    sec.classList.toggle('acx-reset', reset);
    if (usr && !usr.hidden) { set(title, 'حسابي'); set(sub, 'بياناتك الشخصية وقراءاتك المحفوظة في مكان واحد.'); }
    else if (reset) { set(title, 'استعادة كلمة المرور'); set(sub, 'اكتب بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.'); set(forgot, 'إرسال رابط الاستعادة'); back.hidden = false; }
    else {
      back.hidden = true; set(forgot, 'نسيت كلمة المرور؟');
      if (m === 'signup') { set(title, 'إنشاء حساب جديد'); set(sub, 'ابدأ مساحتك الشخصية لحفظ قراءاتك وتقاريرك.'); set(swQ, 'لديك حساب بالفعل؟'); set(swBtn, 'تسجيل الدخول'); }
      else { set(title, 'مرحبًا بك في عالمك'); set(sub, 'سجّل دخولك لتجد خرائطك وقراءاتك في مكان واحد.'); set(swQ, 'ليس لديك حساب؟'); set(swBtn, 'إنشاء حساب جديد'); }
    }
    if (submit && submit.textContent.trim() === 'دخول') set(submit, 'تسجيل الدخول');
  }
  var mo = new MutationObserver(render);
  var uEl = q('#acct-user'); if (uEl) mo.observe(uEl, { attributes: true, attributeFilter: ['hidden'] });
  [].forEach.call(sec.querySelectorAll('.acct-tabs button'), function (b) { mo.observe(b, { attributes: true, attributeFilter: ['aria-selected'] }); });
  if (submit) mo.observe(submit, { childList: true, characterData: true, subtree: true });
  /* نسيت كلمة المرور: أول ضغطة تفتح واجهة الاستعادة، الثانية تمر إلى المنطق الحالي */
  document.addEventListener('click', function (e) {
    var f = e.target.closest && e.target.closest('#acct-forgot'); if (!f || reset) return;
    e.preventDefault(); e.stopPropagation(); reset = true; render();
    var em = q('#acct-email'); if (em) em.focus();
  }, true);
  form.addEventListener('submit', function (e) { if (reset) { e.preventDefault(); e.stopImmediatePropagation(); forgot.click(); } }, true);
  back.addEventListener('click', function () { reset = false; render(); });
  swBtn.addEventListener('click', function () { reset = false; var b = sec.querySelector('.acct-tabs button[data-mode="' + (mode() === 'signup' ? 'signin' : 'signup') + '"]'); if (b) b.click(); render(); });
  /* إظهار/إخفاء كلمة المرور */
  if (pass && pass.parentNode) {
    var eye = document.createElement('button'); eye.type = 'button'; eye.className = 'acx-eye'; eye.setAttribute('aria-label', 'إظهار كلمة المرور'); eye.setAttribute('aria-pressed', 'false');
    eye.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.500-6.500 10-6.500S22 12 22 12s-3.500 6.500-10 6.500S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path class="acx-slash" d="M4 4l16 16"/></svg>';
    pass.parentNode.classList.add('acx-pw'); pass.parentNode.appendChild(eye);
    eye.addEventListener('click', function () { var show = pass.type === 'password'; pass.type = show ? 'text' : 'password'; eye.setAttribute('aria-pressed', String(show)); eye.setAttribute('aria-label', show ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'); });
  }
  /* Esc يغلق النافذة */
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && location.hash === '#account') location.hash = '#home'; });
  window.addEventListener('hashchange', function () { if (location.hash !== '#account' && reset) { reset = false; render(); } });
  /* شاشة الدخول: زر البريد يفتح الفورم بحركة ناعمة */
  var emailOpen = q('#acct-email-open'), guest = q('#acct-guest');
  if (emailOpen && guest) {
    emailOpen.addEventListener('click', function () { guest.classList.add('acx-email'); var em = q('#acct-email'); if (em) setTimeout(function () { em.focus(); }, 60); });
    window.addEventListener('hashchange', function () { if (location.hash !== '#account') guest.classList.remove('acx-email'); });
  }

  render();
})();

;
/* assets/js/invest-page.js */
/* استثمر في ذاتك: عرض فقط + توجيه لنفس مسار الشراء الحالي (زر #acct-buy وبوابة الدفع). لا منطق دفع هنا. */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var sec = $('#invest'); if (!sec) return;
  var buy = sec.querySelector('[data-invest-buy]');
  var WA = (typeof WA_URL !== 'undefined' && WA_URL) ? WA_URL : 'https://wa.me/message/BWFSU4ZT25WKA1';
  /* الكورسات من مصفوفة COURSES الموجودة في الموقع (لو فيها كورس نزل) */
  try {
    var list = (typeof COURSES !== 'undefined' && Array.isArray(COURSES)) ? COURSES.filter(function (c) { return c && c.title && !c.soon && c.link; }) : [];
    var body = $('#inv-courses-body'), notify = $('#inv-notify');
    if (list.length && body) {
      body.textContent = '';
      list.forEach(function (c) {
        var a = document.createElement('a'); a.className = 'inv-course'; a.href = c.link; a.target = '_blank'; a.rel = 'noopener noreferrer';
        var t = document.createElement('strong'); t.textContent = c.title; a.appendChild(t);
        if (c.desc) { var d = document.createElement('span'); d.textContent = c.desc; a.appendChild(d); }
        if (c.price) { var pr = document.createElement('em'); pr.textContent = c.price; a.appendChild(pr); }
        body.appendChild(a);
      });
      if (notify) notify.hidden = true;
    }
    if (notify) notify.href = WA + (WA.indexOf('?') > -1 ? '&' : '?') + 'text=' + encodeURIComponent('أريد أن أعرف عند نزول كورسات عقيق أسترو.');
  } catch (e) { /* العرض الافتراضي كافٍ */ }
  /* السعر: يُقرأ من جدول المنتجات إن كان متاحًا، وإلا لا يُعرض رقم */
  function price() {
    var sb = window.aqeeqSupabase, el = $('#inv-price'); if (!sb || !el) return;
    try {
      sb.from('products').select('amount_cents,currency').eq('code', 'full_report').maybeSingle().then(function (r) {
        var d = r && r.data; if (!d || !d.amount_cents) return;
        var cur = d.currency === 'EGP' ? 'ج.م' : d.currency;
        el.textContent = (d.amount_cents / 100) + ' ' + cur; el.hidden = false;
      }, function () {});
    } catch (e) { /* بدون سعر */ }
  }
  window.addEventListener('load', price);
  /* الشراء: صفحة الدفع (تتولى طلب تسجيل الدخول لو لزم) */
  if (buy) buy.addEventListener('click', function () { location.hash = '#pay'; });
})();

;
/* assets/js/manual-pay.js */
/* الدفع اليدوي: محفظة / إنستاباي / PayPal. العميل يسجّل رقم العملية، والمالك يراجع ويوافق (يفعّل نفس مسار تسليم التقرير). */
(function () {
  var CFG = { product: 'full_report', phone: '01143813559', paypal: 'https://www.paypal.me/elbr1mo' };
  var METHODS = {
    wallet: { label: 'محفظة إلكترونية', hint: 'حوّل على رقم المحفظة', value: CFG.phone, ref: 'رقم العملية من رسالة التأكيد' },
    instapay: { label: 'إنستاباي', hint: 'حوّل على رقم الموبايل', value: CFG.phone, ref: 'الرقم المرجعي للتحويل' },
    paypal: { label: 'PayPal', hint: 'ادفع بالدولار من حسابك', link: CFG.paypal, ref: 'رقم المعاملة (Transaction ID)' }
  };
  var STATUS = { pending: 'قيد المراجعة', approved: 'تم التأكيد', rejected: 'مرفوض' };
  var $ = function (id) { return document.getElementById(id); };
  var sb = function () { return window.aqeeqSupabase; };
  var chosen = 'wallet', busy = false;

  function say(id, t, ok) { var e = $(id); if (!e) return; e.hidden = !t; e.textContent = t || ''; e.classList.toggle('ok', !!ok); }
  function fmtPrice(c, cur) { return (c / 100) + ' ' + (cur === 'EGP' ? 'ج.م' : cur); }

  function renderMethod() {
    var m = METHODS[chosen];
    document.querySelectorAll('#pay [data-pm]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-pm') === chosen)); });
    $('pay-detail-hint').textContent = m.hint;
    var val = $('pay-detail-val'), copy = $('pay-copy'), go = $('pay-paypal');
    if (m.link) { val.textContent = 'paypal.me/elbr1mo'; copy.hidden = true; go.hidden = false; go.href = m.link; }
    else { val.textContent = m.value; copy.hidden = false; go.hidden = true; }
    $('pay-ref-label').textContent = m.ref;
    $('pay-note-egp').hidden = !!m.link; $('pay-note-usd').hidden = !m.link;
  }

  function loadPrice() {
    if (!sb()) return;
    sb().from('products').select('amount_cents,currency,name_ar').eq('code', CFG.product).maybeSingle().then(function (r) {
      var d = r && r.data; if (!d) return;
      $('pay-price').textContent = fmtPrice(d.amount_cents, d.currency);
      if (d.name_ar) $('pay-prod').textContent = d.name_ar;
    }, function () {});
  }

  function loadMine() {
    if (!sb()) return;
    sb().from('manual_payments').select('id,method,status,created_at').order('created_at', { ascending: false }).limit(8).then(function (r) {
      var rows = (r && r.data) || [], box = $('pay-mine'), list = $('pay-mine-list');
      list.textContent = ''; box.hidden = !rows.length;
      rows.forEach(function (x) {
        var li = document.createElement('li');
        var a = document.createElement('span'); a.textContent = (METHODS[x.method] || { label: x.method }).label + ' · ' + new Date(x.created_at).toLocaleDateString('ar-EG');
        var b = document.createElement('b'); b.className = 'st-' + x.status; b.textContent = STATUS[x.status] || x.status;
        li.appendChild(a); li.appendChild(b); list.appendChild(li);
      });
      var pend = rows.some(function (x) { return x.status === 'pending'; });
      $('pay-form').hidden = pend; $('pay-pending').hidden = !pend;
    }, function () {});
  }

  function refresh() {
    if (location.hash !== '#pay' || !sb() || !sb().auth) return;
    sb().auth.getSession().then(function (r) {
      var signed = !!(r && r.data && r.data.session);
      $('pay-guest').hidden = signed; $('pay-main').hidden = !signed;
      if (signed) { loadPrice(); loadMine(); }
    });
  }

  function errText(e) {
    var m = String((e && e.message) || '');
    if (/already_pending/.test(m)) return 'عندك طلب قيد المراجعة بالفعل.';
    if (/bad_reference/.test(m)) return 'اكتب رقم العملية (3 حروف أو أرقام على الأقل).';
    if (/not_authenticated/.test(m)) return 'سجّل دخولك الأول.';
    return 'تعذّر إرسال الطلب. جرّب تاني بعد شوية.';
  }

  function submit(ev) {
    ev.preventDefault(); if (busy) return;
    var ref = $('pay-ref').value.trim();
    if (ref.length < 3) return say('pay-msg', 'اكتب رقم العملية (3 حروف أو أرقام على الأقل).');
    busy = true; $('pay-send').disabled = true; say('pay-msg', '');
    sb().rpc('submit_manual_payment', { p_product: CFG.product, p_method: chosen, p_reference: ref }).then(function (r) {
      if (r.error) throw r.error;
      $('pay-ref').value = ''; say('pay-msg', 'وصلنا طلبك. هنراجع التحويل ونفعّل تقريرك في أقرب وقت.', true); loadMine();
    }).catch(function (e) { say('pay-msg', errText(e)); }).then(function () { busy = false; $('pay-send').disabled = false; });
  }

  function copyNum() {
    var v = METHODS[chosen].value, b = $('pay-copy'), t = b.querySelector('span');
    var done = function () { t.textContent = 'تم النسخ'; setTimeout(function () { t.textContent = 'نسخ الرقم'; }, 1800); };
    try { navigator.clipboard.writeText(v).then(done, done); } catch (e) { done(); }
  }

  /* ---- صفحة المراجعة (للمالك فقط، والتحقق في القاعدة) ---- */
  function loadAdmin() {
    if (location.hash !== '#admin-pay' || !sb()) return;
    var list = $('adm-list'), msg = $('adm-msg'); list.textContent = ''; say('adm-msg', 'جارٍ التحميل...');
    sb().rpc('admin_list_manual_payments').then(function (r) {
      if (r.error) { say('adm-msg', 'هذه الصفحة للمالك فقط. سجّل دخولك بحساب المالك.'); return; }
      var rows = r.data || []; say('adm-msg', rows.length ? '' : 'لا توجد طلبات بعد.');
      rows.forEach(function (x) {
        var li = document.createElement('li'); li.className = 'adm-row';
        var h = document.createElement('div'); h.className = 'adm-info';
        [['', (x.full_name || '') + ' · ' + x.email], ['', /^year2027_/.test(x.product_code || '') ? 'تقرير سنة 2027' : (x.product_code === 'full_report' ? 'التقرير الشخصي الكامل' : x.product_code)], ['', (METHODS[x.method] || { label: x.method }).label + ' · ' + fmtPrice(x.amount_cents, x.currency)], ['ltr', x.reference], ['', new Date(x.created_at).toLocaleString('ar-EG')]].forEach(function (p, i) {
          var s = document.createElement(i === 0 ? 'strong' : 'span'); if (p[0]) s.dir = p[0]; s.textContent = p[1]; h.appendChild(s);
        });
        li.appendChild(h);
        var act = document.createElement('div'); act.className = 'adm-act';
        if (x.status === 'pending') {
          [['approve', true, 'تأكيد'], ['reject', false, 'رفض']].forEach(function (a) {
            var b = document.createElement('button'); b.type = 'button'; b.className = 'adm-btn ' + a[0]; b.textContent = a[2];
            b.addEventListener('click', function () {
              if (!window.confirm(a[1] ? 'تأكيد الدفعة وتفعيل التقرير؟' : 'رفض هذه الدفعة؟')) return;
              b.disabled = true;
              sb().rpc('admin_review_manual_payment', { p_id: x.id, p_approve: a[1] }).then(function (rr) {
                if (rr.error) say('adm-msg', 'تعذّر تنفيذ الإجراء.'); loadAdmin();
              });
            });
            act.appendChild(b);
          });
        } else { var st = document.createElement('b'); st.className = 'st-' + x.status; st.textContent = STATUS[x.status]; act.appendChild(st); }
        li.appendChild(act); list.appendChild(li);
      });
    });
  }

  function init() {
    if (!$('pay')) return;
    document.querySelectorAll('#pay [data-pm]').forEach(function (b) { b.addEventListener('click', function () { chosen = b.getAttribute('data-pm'); renderMethod(); }); });
    $('pay-form').addEventListener('submit', submit);
    $('pay-copy').addEventListener('click', copyNum);
    renderMethod();
    window.addEventListener('hashchange', function () { refresh(); loadAdmin(); });
    /* عميل Supabase يُعرَّف من وحدة module قد تتأخر عن هذا السكربت */
    var tries = 0, t = setInterval(function () {
      if (sb() && sb().auth) {
        clearInterval(t);
        sb().auth.onAuthStateChange(function () { refresh(); loadAdmin(); });
        refresh(); loadAdmin();
      } else if (++tries > 100) clearInterval(t);
    }, 100);
  }
  /* بوابة Paymob غير مفعّلة حاليًا: زر الشراء القديم يفتح صفحة الدفع. للعودة لـ Paymob عرّف window.AQEEQ_PAYMOB_ENABLED = true قبل هذا السكربت. */
  document.addEventListener('click', function (e) {
    if (!window.AQEEQ_PAYMOB_ENABLED && e.target.closest && e.target.closest('#acct-buy')) { e.preventDefault(); e.stopImmediatePropagation(); location.hash = '#pay'; }
  }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

;
/* assets/js/geo-data.js */
/* قوائم كل الدول وأقسامها الإدارية (محافظات/ولايات/مناطق) لنموذج مكان الميلاد.
   المصدر: countries-states-cities-database (ODbL). القيم تُحفظ نصًا عربيًا. */
(function(){var D=[["مصر",["أسوان","أسيوط","الأقصر","الإسكندرية","الإسماعيلية","البحر الأحمر","البحيرة","الجيزة","الدقهلية","السويس","الشرقية","الغربية","الفيوم","القاهرة","القليوبية","المنوفية","المنيا","الوادي الجديد","بني سويف","بورسعيد","جنوب سيناء","دمياط","سوهاج","شمال سيناء","قنا","كفر الشيخ","مطروح"]],["المملكة العربية السعودية",["الباحة","الجوف","الحدود الشمالية","الرياض","القصيم","المدينة المنورة","المنطقة الشرقية","تبوك","جيزان","عسير","مكة المكرمة","منطقة حائل","نجران"]],["الإمارات العربية المتحدة",["أبو ظبي","أم القيوين","الشارقة","الفجيرة","دبي","رأس الخيمة","عجمان"]],["الكويت",["الأحمدي","الجهراء","العاصمة","الفروانية","حولي","مبارك الكبير"]],["قطر",["أم صلال","الخور","الدوحة","الريان","الشحانية","الضعاين","الوكرة","مدينة الشمال"]],["البحرين",["المحرق","جنوبي","شمالي","عاصمة"]],["عمان",["البريمي","الداخلية","الظاهرة","الوسطى","جنوب الباطنة","جنوب الشرقية","شمال الباطنة","شمال الشرقية","ظفار","محافظة مسقط","مسندم"]],["الأردن",["إربد","البلقاء","الزرقاء","الطفيلة","العقبة","الكرك","المفرق","جرش","عجلون","عمان","مادبا","معان"]],["لبنان",["البقاع","النبطية","بعلبك-الهرمل","بيروت","جبل لبنان","جنوب","شمال","عكار"]],["سوريا",["إدلب","الحسكة","الرقة","السويداء","القنيطرة","اللاذقية","حلب","حماة","حمص","درعا","دمشق","دير الزور","ريف دمشق","طرطوس"]],["العراق",["إقليم كردستان العراق","الأنبار","البصرة","القادسية","المثنى","النجف","بابل","بغداد","ديالى","ذي قار","صلاح الدين","كربلاء","كركوك","ميسان","نينوى","واسط"]],["فلسطين",["أريحا","الخليل","القدس","بيت لحم","جنين","خان يونس","دير البلح","رام الله","رفح","سلفيت","شمال غزة","طوباس","طولكرم","غزة","قلقيلية","نابلس"]],["اليمن",["أبين","أمانة العاصمة","إب","البيضاء","الجوف","الحديدة","الضالع","المحويت","المهرة","تعز","حجة","حضرموت","ذمار","ريمة","سقطرى","شبوة","صعدة","صنعاء","عدن","عمران","لحج","مأرب"]],["السودان",["البحر الأحمر","الجزيرة","الخرطوم","القضارف","النيل الأبيض","النيل الأزرق","جنوب دارفور","جنوب كردفان","سنار","شرق دارفور","شمال دارفور","شمال كردفان","شمالي","غرب دارفور","غرب كردفان","كسلا","نهر النيل","وسط دارفور"]],["ليبيا",["الجبل الأخضر","الجفرة","الكفرة","النقاط الخمس","الواحات","بنغازي","جبل الغربي","جفارة","درنة","زاوية","سبها","سرت","شعبية البطنان","طرابلس","غات","مارج","مرزق","مرقب","مصراتة","نالوت","وادي الحياة","وادي الشاطئ"]],["تونس",["الإقليم الأول","الإقليم الثالث","الإقليم الثاني","الإقليم الخامس","الإقليم الرابع"]],["الجزائر",["أدرار","أم البواقي","أولاد جلال","إليزي","الأغواط","البليدة","البيض","الجزائر","الجلفة","الشلف","الطارف","المغير","المنيا","الواد","باتنة","بجاية","برج باجي مختار","برج بوعريريج","بسكرة","بشار","بني عباس","بومرداس","بويرة","تبسة","تقرت","تلمسان","تمنغست","تندوف","تيارت","تيبازة","تيزي وزو","تيسمسيلت","تيميمون","جانت","جيجل","خنشلة","سطيف","سكيكدة","سوق أهراس","سيدي بلعباس","صيدا","عنابة","عين الدفلى","عين تموشنت","غرداية","غليزان","في قزام","قالمة","قسطنطين","ماسكارا","مستغانم","مسيلة","ميديا","ميلا","نعمة","ورقلة","ولاية عين صالح","وهران"]],["المغرب",["الداخلة-وادي الذهب (EH)","الدار البيضاء-سطات","الرباط-سلا-القنيطرة","العيون - الساقية الحمراء (EH-جزئي)","بني ملال خنيفرة","درعة تافيلالت","سوس ماسة","طنجة-تطوان-الحسيمة","فاس-مكناس","كلميم-واد نون (EH-جزئي)","لورينتال","مراكش-آسفي"]],["موريتانيا",["أدرار","إنشيري","براكنا","تاجانت","ترارزة","تيريس زمور","حوض الشرقي","حوض الغربي","داخلة نواذيبو","عصابة","غورغول","غيديماكا","نواكشوط الجنوبية","نواكشوط الشمالية","نواكشوط الغربية"]],["الصومال",["أودال","باري","باكول","باي","بنادر","توغدير","جوبا السفلى","جوبا الوسطى","جيدو","سناج","سول","شيبيلي السفلى","شيبيلي الوسطى","غالغودود","مودوج","نوجال","هيران","ووقويي غالبيد"]],["جيبوتي",["أرتا","أوبوك","تاجورة","جيبوتي","دخيل","علي صبيح"]],["جزر القمر",["أنجوان","القمر الكبرى","موهيلي"]],["أثيوبيا",["Central Ethiopia","South Ethiopia","أديس أبابا","أمهرة","أوروميا","الصومالية","بني شنقول-قماز","تيغراي","دير داوا","سيداما","شعوب جنوب غرب إثيوبيا","غامبيلا","هراري","ولاية عفر"]],["أذربيجان",["آغدام","آقجبدي","آقستافا","أبشيرون","أستارا","أغداش","أغسو","أوجار","أوغوز","التارتار","باردا","باكو","بالاكان","بيلاسوار","توفوز","جليل آباد","جورانبوي","جويتشاي","جويجول","خاشماز","خانكندي","خوجالي","خيزي","داشكيسان","زرداب","زقاتالا","زنجيلان","ساليان","ساموخ","سومقاييت","سيازان","شاكي","شامكير","شروان","شماخى","صابر آباد","غانجا","غدابيغ","فيزولي","قابالا","قازاخ","قبادلی","قوبوستان","كالبجار","كردامير","لاتشين","لنكران","ليريك","مارتوني","ماساللي","مدينة قوبا","مقاطعة إسماعيلي","مقاطعة إيميشلي","مقاطعة بيلقان","مقاطعة جبرائيل","مقاطعة حاجي قبول","مقاطعة ساتلي","مقاطعة شابران","مقاطعة شوشا","مقاطعة قاخ","مقاطعة قوسار","مقاطعة يارديملي","مينجاشيفير","نخجوان","نفتالان","نفطشالا","يفلاكس"]],["أراضي المحيط الهندي البريطاني",["أخرى"]],["أرمينيا",["أرارات","أراغاتسوتن","أرمافير","تافوش","جيغاركونيك","سيونيك","شيراك","فايوتس دزور","كوتايك","لوري","يريفان"]],["أروبا",["أورانجيستاد","أورانجيستاد الشرقية","أورانجيستاد الغربية","باراديرا","سافانيتا","سان نيكولاس زويد","سان نيكولاس نورد","سانتا كروز","شمال"]],["أستراليا",["إقليم العاصمة الأسترالية","الإقليم الشمالي","تسمانيا","جنوب أستراليا","غرب أستراليا","فيكتوريا","كوينزلاند","نيو ساوث ويلز"]],["أفغانستان",["أوروزغان","بادغيس","باروان","باكتيا","باكتيكا","باميان","بدخشان","بغلان","بلخ","بنجشير","تخار","جوزجان","خوست","دايكوندي","زابل","ساري بول","سامانجان","غزنة","غور","فارياب","فرح","قندهار","كابول","كابيسا","كونار","لغمان","لوغار","ننغرهار","نورستان","نيمروز","هرات","هلمند","وردك","ولاية قندوز"]],["ألبانيا",["إلباسان","بيرات","تيرانا","جيروكاستر","دوريس","ديبر","شكودر","فلوري","فيير","كورتشي","كوكيس","ليجي"]],["ألمانيا",["بادن فورتمبيرغ","بافاريا","براندنبورغ","برلين","بريمن","تورينجيا","راينلاند بالاتينات","سارلاند","ساكسونيا","ساكسونيا أنهالت","ساكسونيا السفلى","شليسفيغ هولشتاين","شمال الراين-وستفاليا","مكلنبورغ فوربومرن","هامبورغ","هيسن"]],["أنتاركتيكا",["أخرى"]],["أنتيغوا وبربودا",["القديس بطرس","القديس بولس","القديس جورج","القديس فيليب","القديس يوحنا","القديسة مريم","باربودا","ريدوندا"]],["أندورا",["أندورا لا فيلا","أوردينو","إسكالديس-إنغورداني","إنكامب","سانت جوليا دي لوريا","كانيلو","لا ماسانا"]],["أندونيسيا",["DKI جاكرتا","Kepulauan Bangka Belitung","آتشيه","بابوا","بابوا بارات","بابوا بارات دايا","بابوا بيغونونجان","بابوا تينغا","بابوا سيلاتان","بالي","بانتن","بنجكولو","جامبي","جاوا بارات","جاوا تينغا","جاوة","جاوة تيمور","جزر الملوك","جزر سوندا الصغرى","جورونتالو","دي يوجياكارتا","رياو","سولاوسي","سولاويزي أوتارا","سولاويزي بارات","سولاويزي تينجارا","سولاويزي تينغا","سولاويزي سيلاتان","سومطرة","سومطرة أوتارا","سومطرة بارات","سومطرة سيلاتان","غرب غينيا الجديدة","كاليمانتان أوتارا","كاليمانتان بارات","كاليمانتان تيمور","كاليمانتان تينغا","كاليمانتان سيلاتان","كليمنتان","كيبولاوان رياو","لامبونج","مالوكو","مالوكو أوتارا","نوسا تينجارا بارات","نوسا تينجارا تيمور"]],["أنغولا",["Cuando","Cubango","أويجي","بنجو","بنغيلا","بييه","زائير","كابيندا","كوانزا","كوانزا نورتي","كونيني","لواندا","لوندا سول","لوندا نورتي","مالانجي","موكسيكو","ناميبي","هوامبو","هويلا"]],["أنغيلا",["أرض رملية","الجانب الشمالي","الحي","الطرف الشرقي","الوادي","جورج هيل","ذا فارينغتون","ساندي هيل","ساوث هيل","ملعب ستوني","ميناء الجزيرة","نقطة النفخ","نورث هيل","ويست إند"]],["أوروغواي",["أرتيغاس","بايساندو","تاكواريمبو","ترينتا وتريس","دورازنو","روشا","ريفيرا","ريو نيغرو","سالتو","سان خوسيه","سوريانو","سيرو لارغو","فلوريدا","فلوريس","كانيلونز","كولونيا","لافاليا","مالدونادو","مونتيفيديو"]],["أوزبكستان",["أنديجان","بخارى","جيزك","زورازم","سمرقند","سوركسونداريو","سيرداريو","طشقند","فرغانة","قشقاداريو","كاراكالباكستان","نافوي","نامانجان"]],["أوغندا",["الغربي","شرقي","شمالي","مركزي"]],["أوكرانيا",["أوديسكا","إيفانو فرانكيفسكا","بولتافسكا","تشيركاسكا","تشيرنيفتسكا","تشيرنيهيفسكا","تيرنوبيلسكا","جمهورية القرم المستقلة","خاركيفسكا","خميلنيتسكا","خيرسونسكا","دنيبروبيتروفسكا","دونيتسكا","ريفنينسكا","زابوريزكا","زاكارباتسكا","زيتوميرسكا","سومسكا","سيفاستوبول","فولينسكا","فينيتسكا","كيروفوهرادسكا","كييف","كييفسكا","لفيفسكا","لوهانسكا","ميكولايفسكا"]],["أيرلندا",["أولستر","كوناخت","لينستر","مونستر"]],["أيسلندا",["Dalvíkurbyggð","Eyja- og Miklaholtshreppur","Eyjafjarðarsveit","Grímsnes- og Grafningshreppur","Húnaþing vestra","Langanesbyggð","Rangárþing eystra","Rangárþing ytra","Skeiða- og Gnúpverjahreppur","Þingeyjarsveit","آساهريبور","أربورغ","أرنيشريبور","أكرانيس","أكوريري","أولفوس","اسافيوردور","الغربي","المضايق الغربية","بلاسكوغابيغد","بورغاربيغد","بولونجارفيك","تالكنافجارهاربور","تيورنيشريبور","جروندارفيوردور","جريتوباكاهريبور","جنوبي","دالابيغ","رايكيانسبير","ريكولاهريبور","ريكيافيك","ستراندابيج","ستيكيشولمور","سفالباردستراندارهيبور","سكاجابيغد","سكاجاستروند","سكاغافيوردور","سكافتارهريبور","سكوررادالشريبور","سنيفيلسبير","سوذافيك","سوورنيسجابير","سيلتجارنارنيس","شبه الجزيرة الجنوبية","شرقي","شمال شرقي","شمال غرب","عاصمة","غارذاباير","غريندافيك","فلوهريبور","فليوتسدالشريبور","فوبنافجارداربور","فوغار","فياردابيغد","فيالابيغد","فيستوربيغد","كالدرانانشريبور","كجوسارهريبور","كوبافوغور","موسفلسبير","مولاثينغ","ميردالشريبور","نوردورسينغ","هافنارفيوردور","هروناماناهريبور","هفالفياردارسفيت","هفيراجيردي","هوردارسفيت","هورنافجوردور","هونابيغد","يستمان"]],["إريتريا",["أنسيبا","جنوب البحر الأحمر","ديبوب","شمال البحر الأحمر","قاش-بركا","مايكل"]],["إسبانيا",["أراغون","أشتورية","إستريمادورا","إقليم الباسك","الأندلس","جزر البليار","جزر الكناري","سبتة","غاليسيا","قشتالة وليون","قنطبرية","كاتالونيا","كاستيا لا مانشا","مجتمع فالنسيا","مجتمع مدريد","مليلية","منطقة لا ريوخا","منطقة مورسيا","نافارا"]],["إستونيا",["إيدا-فيرو","بارنو","بولفا","تارتو","جارفا","جوغيفا","رابلا","ساري","فالجا","فورو","فيلجاندي","لين","لين-فيرو","هارجو","هيو"]],["إسرائيل",["القدس","تل أبيب","جنوبي","حيفا","شمالي","مركزي"]],["إيران",["أذربيجان الشرقية","أردبيل","أصفهان","إيلام","البرز","بوشهر","جنوب خراسان","جهارمحال وبختياري","جولستان","جيلان","خراسان رضوي","خوزستان","زنجان","سمنان","سيستان وبلوشستان","شمال خراسان","طهران","غرب أذربيجان","فارس","قزوين","قم","كردستان","كرمان","كرمانشاه","كهجيلويه وبوير أحمد","لرستان","مازندران","مركزي","هرمزجان","همدان","يزد"]],["إيطاليا",["أبروتسو","أومبريا","إميليا رومانيا","بازيليكاتا","بوليا","بيدمونت","ترينتينو-جنوب تيرول","توسكانا","سردينيا","صقلية","فريولي فينيتسيا جوليا","فينيتو","كالابريا","كامبانيا","لاتسيو","لومباردي","ليغوريا","ماركي","موليزي","وادي أوستا"]],["الأرجنتين",["إنتري ريوس","بوينس آيرس","تشاكو","تشوبوت","توكومان","تييرا ديل فويغو","جوجوي","ريو نيغرو","سالتا","سان خوان","سان لويس","سانتا في","سانتا كروز","سانتياغو ديل استيرو","فورموزا","قرطبة","كاتاماركا","كورينتس","لا بامبا","لا ريوخا","مدينة بوينس آيرس المستقلة","مندوزا","ميسيونيس","نيوكوين"]],["الأقاليم الجنوبية الفرنسية",["Adélie Land","Crozet Islands","Kerguelen Islands","Saint-Paul and Amsterdam Islands","Scattered Islands"]],["الإسواتين",["شيسلويني","لوبومبو","مانزيني","هوهو"]],["الاكوادور",["أزواي","أوريلانا","إزميرالدا","إمبابورا","باستازا","بوليفار","بيتشينشا","تشيمبورازو","تونغوراهوا","جزر غالاباغوس","زامورا تشينشيبي","سانتا إيلينا","سانتو دومينغو دي لوس تساتشيلاس","سوكومبيوس","غواياس","كارشي","كانيار","كوتوباكسي","لوجا","لوس ريوس","مانابي","مقاطعة إل أورو","مورونا-سانتياغو","نابو"]],["البرازيل",["أكري","ألاغواس","أمابا","أمازوناس","إسبيريتو سانتو","بارا","بارانا","بارايبا","باهيا","بياوي","بيرنامبوكو","توكانتينز","رورايما","روندونيا","ريو دي جانيرو","ريو غراندي دو سول","ريو غراندي دو نورتي","سانتا كاتارينا","ساو باولو","سيارا","سيرجيبي","غوياس","ماتو غروسو","ماتو غروسو دو سول","مارانهاو","مقاطعة فيدرالية","ميناس جيرايس"]],["البرتغال",["أفيرو","أكورس","إيفورا","براغا","براغانكا","بورتاليجري","بورتو","بيجا","سانتاريم","سيتوبال","غواردا","فارو","فيانا دو كاستيلو","فيسيو","فيلا ريال","كاستيلو برانكو","كويمبرا","لشبونة","ليريا","ماديرا"]],["البوسنة والهرسك",["اتحاد البوسنة والهرسك","برتشكو","جمهورية صربسكا"]],["الجابون",["أوت أوغوي","أوغووي-إيفيندو","أوغووي-لولو","أوغووي-ماريتايم","محافظة إيستوير","موين-أوغوي","نغونييه","نيانجا","ووليو-نتم"]],["الجبل الأسود",["Zeta","أندرييفيكا","أولسيني","العاصمة الملكية القديمة سيتينيي","بلاف","بلدية بار","بلوزين","بلييفليا","بودغوريتشا","بودفا","بيتنجيكا","بيران","بييلو بوليي","توزي","تيفات","جوسيني","دانيلوفغراد","روزاجي","زابلجاك","سافنيك","كوتور","كولاسين","مويكوفاتش","نيكشيتش","هرسك نوفي"]],["الجمهورية التشيكية",["Jihomoravský kraj","Jihočeský kraj","Královéhradecký kraj","Liberecký kraj","Moravskoslezský kraj","Olomoucký kraj","Pardubický kraj","Plzeňský kraj","Praha, Hlavní město","Středočeský kraj","Zlínský kraj","Ústecký kraj","كارلوفارسك كراج","كراج فيسوتشينا"]],["الدنمارك",["إقليم هوفدستادن","جنوب الدنمارك","زيلندا","شمال الدنمارك","وسط الدنمارك"]],["الرأس الأخضر",["São Lourenço dos Órgãos","Tarrafal de São Nicolau","برافا","برايا","بوا فيستا","بورتو نوفو","بول","تارافال","جزر بارلافينتو","جزر سوتافينتو","ريبيرا برافا","ريبيرا غراندي","ريبيرا غراندي دي سانتياغو","سال","سانتا كاتارينا","سانتا كاتارينا دو فوغو","سانتا كروز","ساو دومينغوس","ساو سلفادور دو موندو","ساو فيسينتي","ساو فيليبي","ساو ميغيل","مايو","موستيروس"]],["السلفادور",["أهواتشابان","أوسولوتان","الاتحاد","سان سلفادور","سان فيسينتي","سان ميغيل","سانتا آنا","سونسونات","شالاتينانغو","كابانياس","كوسكاتلان","لا ليبرتاد","لاباز","مورازان"]],["السنغال",["داكار","زيغينشور","سانت لويس","سيدهيو","فاتيك","كافرين","كاولاك","كولدا","كيدوغو","لوغا","ماتام","منطقة تامباكوندا","منطقة تييس","منطقة ديوربيل"]],["السويد",["أوبسالا","أوريبرو","أوسترجوتلاند","بليكينج","جافلبورغ","جوتلاند","دالارنا","ستوكهولم","سكاني","سودرمانلاند","فارملاند","فاسترا جوتالاند","فاستربوتن","فاسترنورلاند","فاستمانلاند","كالمار","كرونوبيرج","نوربوتن","هالاند","يمتلاند","يونشوبينغ"]],["الصحراء الغربية",["أخرى"]],["الصين",["آنهوي","بكين","تايوان","تشجيانغ","تشونغتشينغ","تشينغهاي","تيانجين","جيانغسو","جيانغشي","جيلين","خبي","سيتشوان","شاندونغ","شانشي","شنشي","شنغهاي","شيزانغ","شينجيانغ","فوجيان","قانسو","قوانغدونغ","قوانغشى تشوانغ","قويتشو","لياونينج","منطقة ماكاو الإدارية الخاصة","منطقة هونغ كونغ الإدارية الخاصة","منغوليا الداخلية","نينغشيا هويزو","هاينان","هنان","هوبي","هونان","هيلونغجيانغ","يونان"]],["القديس بيير وميكلون",["Saint-Pierre and Miquelon"]],["القديس فنسنت وجرينادين",["القديس أندرو","القديس باتريك","القديس جورج","القديس داود","جزر غرينادين","شارلوت"]],["الكاميرون",["أداماوا","أقصى الشمال","الجنوب الغربي","الغرب","جنوب","ساحلي","شرق","شمال","شمال غرب","مركز"]],["الكونغو",["إدارة بول","الهضاب","برازافيل","بوانت نوار","بوينزا","سانغا","كوفيت","كوفيت-ويست","كويلو","ليكوالا","ليكومو","نياري"]],["المكسيك",["أغواسكاليينتس","أواكساكا","باجا كاليفورنيا","باجا كاليفورنيا سور","بويبلا","تاباسكو","تاماوليباس","تشياباس","تلاكسكالا","خاليسكو","دورانجو","زاكاتيكاس","سان لويس بوتوسي","سونورا","سينالوا","سيوداد دي مكسيكو","شيواوا","غواناخواتو","غيريرو","فيراكروز دي إجناسيو دي لا لاف","كامبيتشي","كواهويلا دي سرقسطة","كوليما","كويريتارو","كوينتانا رو","موريلوس","ميتشواكان دي أوكامبو","ناياريت","نويفو ليون","هيدالغو","ولاية المكسيك","يوكاتان"]],["المملكة المتحدة",["أيرلندا الشمالية","إنجلترا","اسكتلندا","ويلز"]],["النرويج",["Møre og Romsdal","أغدر","أكيرشوس","أوستفولد","أوسلو","إنلانديت","بوسكيرود","ترومس","ترونديلاغ","تيليمارك","جان ماين","روغالاند","سفالبارد","فيستفولد","فيستلاند","فينمارك","نوردلاند"]],["النمسا",["النمسا السفلى","النمسا العليا","بورغنلاند","تيرول","سالزبورغ","ستيريا","فورارلبرغ","فيينا","كارينثيا"]],["النيجر",["أغاديز","تاهوا","تيلابيري","دوسو","ديفا","زيندر","مارادي","نيامي"]],["الهند",["آسام","أروناتشال براديش","أوتار براديش","أوتاراخند","أوديشا","البنجاب","بودوتشيري","بيهار","تاميل نادو","تريبورا","تشاتيسجار","تلانجانا","جامو وكشمير","جزر أندامان ونيكوبار","جهارخاند","جوا","دادرا وناجار هافيلي ودامان وديو","دلهي","راجستان","سيكيم","شانديغار","كارناتاكا","كيرالا","لاداخ","لاكشادويب","ماديا براديش","مانيبور","ماهاراشترا","ميزورام","ميغالايا","ناجالاند","هاريانا","هيماشال براديش","ولاية أندرا براديش","ولاية البنغال الغربية","ولاية غوجارات"]],["الولايات المتحدة",["Armed Forces Europe","Armed Forces Pacific","Armed Forces of the Americas","أركنساس","أريزونا","ألاباما","ألاسكا","أوريغون","أوكلاهوما","أوهايو","أيداهو","أيوا","إلينوي","إنديانا","بنسلفانيا","بورتوريكو","تكساس","تينيسي","جزر الولايات المتحدة الصغيرة النائية","جزر فيرجن الأمريكية","جزر ماريانا الشمالية","جورجيا","داكوتا الجنوبية","داكوتا الشمالية","ديلاوير","رود آيلاند","ساموا الأمريكية","غوام","فرجينيا","فلوريدا","فيرمونت","كارولينا الجنوبية","كارولينا الشمالية","كاليفورنيا","كانساس","كنتاكي","كولورادو","كونيتيكت","لويزيانا","ماريلاند","ماساتشوستس","مقاطعة كولومبيا","مونتانا","ميسوري","ميسيسيبي","ميشيغان","مين","مينيسوتا","نبراسكا","نيفادا","نيو مكسيكو","نيو هامبشاير","نيوجيرسي","نيويورك","هاواي","واشنطن","وايومنغ","ولاية فرجينيا الغربية","ويسكونسن","يوتا"]],["الولايات المتحدة الجزر البعيدة الصغرى",["جزر ميدواي","جزيرة بالميرا المرجانية","جزيرة بيكر","جزيرة جارفيس","جزيرة جونستون المرجانية","جزيرة نافاسا","جزيرة هاولاند","جزيرة ويك","شعاب كينجمان المرجانية"]],["اليابان",["آيتشي","أكيتا","أوساكا","أوكاياما","أوكيناوا","أوموري","أويتا","إهيمي","إيباراكي","إيشيكاوا","إيواتي","تشيبا","توتشيغي","توتوري","توكوشيما","توياما","جيفو","ساغا","سايتاما","شيزوكا","شيغا","شيمانه","طوكيو","غونما","فوكوشيما","فوكوكا","فوكوي","كاجوشيما","كاغاوا","كاناغاوا","كوتشي","كوماموتو","كيوتو","مي","مياجي","ميازاكي","نارا","ناغازاكي","ناغانو","نيغاتا","هوكايدو","هيروشيما","هيوغو","واكاياما","ياماغاتا","ياماغوتشي","ياماناشي"]],["اليونان",["Mount Athos","أتيكا","إبيروس","الجزر الأيونية","بيلوبونيز","ثيساليا","جنوب بحر إيجة","شمال بحر إيجة","غرب اليونان","كريت","مقدونيا الشرقية وتراقيا","مقدونيا الغربية","مقدونيا الوسطى","وسط اليونان"]],["بابوا غينيا الجديدة",["أورو","أيرلندا الجديدة","إنجا","الخليج","الغربي","المرتفعات الجنوبية","المرتفعات الشرقية","المرتفعات الغربية","بورت مورسبي","بوغانفيل","جيواكا","خليج ميلن","ساندون","شرق بريطانيا الجديدة","شرق سيبيك","شيمبو","غرب نيو بريتين","مادانغ","مانوس","مركزي","موروبي","هيلا"]],["باراجواي",["أسونسيون","ألتو باراغواي","ألتو بارانا","أمامباي","إيتابوا","الرئيس هايز","باراغواي","بوكيرون","سان بيدرو","غوايرا","كاجوازو","كازابا","كانينديو","كورديليرا","كونسيبسيون","مركزي","ميسيونيس","نييمبوكو"]],["باكستان",["آزاد كشمير","إسلام آباد","البنجاب","السند","بلوشستان","جيلجيت بالتستان","خيبر باختونخوا"]],["بالاو",["أنجور","أيراي","أيميليك","بيليليو","سونسورول","كايانجيل","كورور","ميليكيوك","نجارارد","نجيوال","نغاتبانغ","نغاردماو","نغارشيلونغ","نغتشيسار","نغيرملينغي","هاتوهوبي"]],["بربادوس",["القديس أندرو","القديس بطرس","القديس توماس","القديس جورج","القديس جيمس","القديس فيليب","القديس ميخائيل","القديس يوحنا","القديس يوسف","سانت لوسي","كنيسة المسيح"]],["برمودا",["باجيت","بيمبروك","ديفونشاير","سانت جورج","سانديز","ساوثهامبتون","سميث","هاميلتون","وارويك"]],["بروناي",["بروناي-موارا","بيليت","تمبورونغ","توتونغ"]],["بلجيكا",["بروكسل العاصمة","فلاندرز","والونيا"]],["بلغاريا",["بازارجيك","بلاغويفغراد","بلوفديف","بليفين","بورغاس","بيرنيك","تارغوفيشته","دوبريتش","رازغراد","ستارا زاغورا","سليفن","سموليان","سيليسترا","شومن","صوفيا","غابروفو","فارنا","فراتسا","فيدين","فيليكو تارنوفو","كاردجالي","كيوستينديل","لوفيتش","مدينة صوفيا","مقاطعة روسه","مونتانا","هاسكوفو","يامبول"]],["بليز",["بليز","توليدو","ستان كريك","كايو","كوروزال","مقاطعة أورانج ووك"]],["بنغلاديش",["باريسال","خولنا","دكا","راجشاهي","رانجبور","سيلهيت","شيتاغونغ","ميمينسينغ"]],["بنما",["إمبيرا-وونان كوماركا","بنما","بنما أويستي","بوكاس ديل تورو","دارين","غونا","فيراغواس","كوكلي","كولون","لوس سانتوس","مقاطعة تشيريكي","ناسو تيير دي","نغوبي بوغلي كوماركا","هيريرا"]],["بنين",["أتاكورا","أتلانتيك","أليبوري","أويمي","إدارة مونو","بورغو","دونجا","زو","ساحلي","كوفو","كولينز","هضبة"]],["بوتان",["بارو","بومثانج","بوناخا","بيماجاتشيل","تراشي يانغتسي","تراشيغانغ","ترونغسا","تسيرانغ","تشوكا","تيمفو","داجانا","زيمجانج","ساربانج","سامتسي","سامدروب جونغخار","غازا","لونتسي","مونجار","هاا","وانغدو فودرانج"]],["بوتسوانا",["بلدة سوا","تشوبي","جنوب شرق","جنوبي","جوانينج","سيليبي-فيكوي","شمال شرق","شمال غرب","غابورون","غانزي","فرانسيستاون","كجاتلينج","كغالاغادي","كوينينغ","لوباتس","مركزي"]],["بورتوريكو",["أدجونتاس","أرويو","أريسيبو","أغوادا","أغواديلا","أغواس بويناس","أنياسكو","أوتوادو","أوروكوفيس","أيبونيتو","إيزابيلا","باتيلاس","بارانكيتاس","بايامون","برشلونيتا","بونس","بينويلاس","تروخيو ألتو","توا ألتا","توا باجا","جايويا","جورابو","جونكو","خوانا دياز","دورادو","رينكون","ريو غراندي","سابانا غراندي","ساليناس","سان جيرمان","سان خوان","سان سيباستيان","سان لورينزو","سانتا إيزابيل","سياليس","سيبا","سيدرا","غوانيكا","غواياما","غوايانيلا","غواينابو","فاخاردو","فلوريدا","فيغا ألتا","فيغا باجا","فيلالبا","فييكيس","كابو روجو","كاتانو","كارولينا","كاغواس","كاموي","كانوفاناس","كايي","كوامو","كوروزال","كوليبرا","كوميريو","كيبرادياس","لاجاس","لاريس","لاس بيدراس","لاس مارياس","لوكويلو","لويزا","ماريكاو","ماناتي","ماونابو","ماياجويز","موروفيس","موكا","ناجوابو","نارانجيتو","هاتيلو","هورميغويروس","هوماكاو","يابوكوا","ياوكو"]],["بوركينا فاسو",["EST","الساحل","المركز الشرقي","الهضبة الوسطى","بوكل دو موهون","جنوب غرب","شلالات","مركز","نورد","هوت باسين","وسط الجنوب","وسط الشمال","وسط غرب"]],["بوروندي",["بلدية بوجومبورا","بوبانزا","بوروري","جيتيجا","روتانا","رومونج","رويغي","ريف بوجومبورا","سيبيتوكي","كاروزي","كانكوزو","كايانزا","كيروندو","ماكامبا","موارو","مورامفيا","مويينجا","نغوزي"]],["بولندا",["الصليب المقدس","بودلاسكي","بولندا الصغرى","بولندا الكبرى","بوميرانيا","بوميرانيا الغربية","سوبكارباثيا","سيليزيا","سيليزيا السفلى","سيليزيا العليا","كويافيا-بوميرانيا","لوبلين","لوبوش","لودز","مازوفيا","وارميا-ماسوريا"]],["بوليفيا",["أورورو","باندو","بني","بوتوسي","تاريخا","تشوكيساكا","سانتا كروز","كوتشابامبا","لاباز"]],["بولينيزيا الفرنسية",["الجزر الأسترالية","تواموتو-جامبير","جزر ليوارد","جزر ماركيساس","جزر ويندوارد"]],["بونير، سينت أوستاتيوس وسابا",["بونير","سابا","سانت أوستاتيوس"]],["بيرو",["أبوريماك","أريكيبا","أمازوناس","أنكاشا","أوكايالي","أياكوتشو","إيكا","باسكو","بلدية ميتروبوليتانا دي ليما","بونو","بيورا","تاكنا","تومبيس","جونين","سان مارتن","كاخاماركا","كالاو","كوسكو","لا ليبرتاد","لامبايك","لوريتو","ليما","مادري دي ديوس","موكيجوا","هوانكافيليكا","هوانوكو"]],["بيلاروسيا",["بريست","غرودنو","غوميل","فيتيبسك","موغيليف","مينسك"]],["تايلاند",["أمنات تشاروين","أنج ثونغ","أوبون راتشاثاني","أوتاراديت","أوثاي ثاني","أودون ثاني","باتاني","باتايا","باثوم ثاني","بانكوك","براشواب خيري خان","براشين بوري","بوري رام","بوكيت","بوينج كان","تاك","ترات","ترانج","تشاتشونجساو","تشانثابوري","تشايافوم","تشومفون","تشون بوري","خون كاين","راتشابوري","رانونغ","رايونغ","روي إت","سا كايو","ساتون","سارابوري","ساكون ناخون","ساموت براكان","ساموت ساخون","ساموت سونغخرام","سوخوثاي","سورات ثاني","سورين","سوفان بوري","سونغكلا","سي سا كيت","سينغ بوري","شاي نات","شيانغ راي","شيانغ ماي","فاتالونغ","فانجنجا","فاياو","فرا ناخون سي أيوثايا","فراي","فيتسانولوك","فيتشابوري","فيتشابون","فيتشيت","كالاسين","كامفاينج فيت","كانشانابوري","كرابي","لامبانج","لامفون","لوب بوري","لوي","ماي هونغ سون","مها ساراخام","موكداهان","ناخون باثوم","ناخون راتشاسيما","ناخون ساوان","ناخون سي ثامارات","ناخون فانوم","ناخون نايوك","ناراثيوات","نان","نونثابوري","نونغ بوا لام فو","نونغ خاي","ياسوثون","يالا"]],["تايوان",["بينغتونغ","بينغو","تاويوان","تايبيه","تايبيه الجديدة","تايتشونغ","تايتونغ","تاينان","تشانغهوا","تشيايي","كاوهسيونغ","كيلونج","كينمن","لينشيانغ","مقاطعة شياي","مقاطعة هسينشو","مياولي","نانتو","هسينشو","هوالين","يونلين","ييلان"]],["تركمانستان",["أهل","البلقان","داشوغوز","عشق آباد","ليباب","ماري"]],["ترينيداد وتوباغو",["أريما","تشاغواناس","توباغو","تونابونا-بياركو","دييغو مارتن","ريو كلارو-مايارو","سان خوان-لافينتيل","سان فرناندو","سانجري جراندي","سيباريا","شركة بينال ديب الإقليمية","كوفا-تاباكيت-تالبارو","مدينة الأمراء","ميناء إسبانيا","نقطة فورتين"]],["تشاد",["إنيدي-إست","إنيدي-ويست","باتا","بحر الغزال","بحيرة","بوركو","تاندجيلي","تيبستي","حجر لميس","سلامات","سيلا","شاري باغيرمي","غيرا","كانيم","لوغون الشرقية","لوغون الغربية","مايو-كيبي إست","مايو-كيبي ويست","مندول","موين-شاري","نجامينا","واداى","وادي فيرا"]],["تشيلي",["آيسن ديل جنرال كارلوس إيبانيز ديل كامبو","أتاكاما","أريكا وباريناكوتا","أنتوفاجاستا","بيوبيو","تاراباكا","جنرال ليبرتادور برناردو أوهيغينز","فالبارايسو","كوكيمبو","لا أراوكانيا","لوس ريوس","لوس لاغوس","ماجالانيس ودي لا أنتاركتيكا تشيلينا","منطقة متروبوليتانا دي سانتياغو","مولي","نوبل"]],["تنزانيا",["أروشا","إيرينغا","بواني","تابورا","تانجا","جنوب بيمبا","جنوب زنجبار","جيتا","دار السلام","دودوما","روفوما","روكوا","زنجبار الغربية","سونغوي","سيميو","سينجيدا","شمال بيمبا","شمال زنجبار","شينيانجا","كاتافي","كاجيرا","كليمنجارو","كيغوما","ليندي","مارا","مانيارا","مبيا","متوارا","موانزا","موروغورو","نجومبي"]],["توغو",["البحرية","السافانيون","الهضاب","سنترالي","كارا"]],["توفالو",["فايتوبو","فونافوتي","مجلس جزيرة نيوتاو","نانومانجا","نانوميا","نوكوفيتاو","نوكولايلاي","نوي"]],["توكيلاو",["أخرى"]],["تونغا",["إيوا","تونغاتابو","فافاو","نيواس","هاباي"]],["تيمور قراءة",["أوكوسي","أيلو","أينارو","إرميرا","باوكاو","بوبونارو","ديلي","فيكيكي","كوفا ليما","لاوتيم","ليكويسا","ماناتوتو","مانوفاهي"]],["جامايكا",["القديس أندرو","القديس توماس","القديس جيمس","القديسة آن","القديسة إليزابيث","القديسة مريم","بورتلاند","تريلاوني","سانت كاترين","كلارندون","كينغستون","مانشستر","هانوفر","ويستمورلاند"]],["جبل طارق",["أخرى"]],["جزر آلاند",["إيكيرو","براندو","بلدية سند","جومالا","جيتا","سالتفيك","سوتونجا","فاردو","فوغلو","فينستروم","كوكار","كوملينج","لومبارلاند","ليملاند","ماريهامن","هامرلاند"]],["جزر الأتراك وكايكوس",["بروفيدنسياليس","جراند ترك","جزر كايكوس الجنوبية","جزر كايكوس الشمالية","جزر كايكوس الوسطى","جزيرة سولت كاي"]],["جزر البهاما",["أكلينز","إكسوما","إيناغوا","النقطة السوداء","بيميني","جراند كاي","جزر بيري","جزيرة راجد","جزيرة سان سلفادور","جزيرة كات","جزيرة مانجروف","جزيرة ملتوية","جزيرة مور","جزيرة هاربور","جنوب أباكو","جنوب أندروس","جنوب إليوثيرا","رم كاي","سبانش، ويلز","شرق جراند باهاما","شمال أباكو","شمال أندروس","شمال إليوثيرا","غرب جراند باهاما","فريبورت","لونغ آيلاند","ماياغوانا","نيو بروفيدنس","هوب تاون","وسط أباكو","وسط أندروس","وسط إليوثيرا"]],["جزر المالديف",["آتول با","أدو","أليف أليف","أليف دهال","ثا","جنافياني","دالو","راا","شافياني","غافو أليف","غافو دالو","فافو","كافو","لافياني","لامو","ماليه","ميمو","نونو","ها دالو","هاء ألف"]],["جزر سفالبارد وجان ماين",["أخرى"]],["جزر سليمان",["إيزابيل","الغربي","تشويسيول","تيموتو","رينيل وبيلونا","غوادالكانال","ماكيرا-أولاوا","ماليتا","مركزي","هونيارا"]],["جزر فارو",["إيستوروي","الجزر الشمالية","ساندويه","ستريموي","سودوروي","فاجار"]],["جزر فوكلاند",["أخرى"]],["جزر فيجي",["الغربي","روتوما","شرقي","شمالي","مركزي"]],["جزر فيرجن (البريطانية)",["أخرى"]],["جزر فيرجن (الولايات المتحدة)",["القديس توماس","القديس يوحنا","سانت كروا"]],["جزر كايمان",["جراند كايمان","جزر كايمان براك","كايمان الصغيرة"]],["جزر كوكوس (كيلينغ)",["أخرى"]],["جزر مارشال",["راتاك","راليك"]],["جزر ماريانا الشمالية",["أخرى"]],["جزر واليس وفوتونا",["ألو","أوفيا","سيجافي"]],["جزيرة بوفيت",["أخرى"]],["جزيرة بيتكيرن",["أخرى"]],["جزيرة عيد الميلاد",["أخرى"]],["جزيرة نورفولك",["أخرى"]],["جمع شمل",["سان بينوا","سان بيير","سان دوني","سانت بول"]],["جمهورية أفريقيا الوسطى",["أواكا","أوت مبومو","أومبيلا-مبوكو","أوهام","أوهام بيندي","باس كوتو","بامينغوي-بانغوران","بانغي","سانغا-مبايري","فاكاجا","كيمو","لوباي","مامبيري-كاديه","مبومو","نانا-غريبيزي","نانا-مامبيري","هوت كوتو"]],["جمهورية الدومينيكان",["أوزاما","إل فالي","إنريكييو","سيباو سور","سيباو نورتي","سيباو نوردستي","سيباو نورويست","فالديسيا","هيغوامو","يوما"]],["جمهورية الكونغو الديمقراطية",["أوت أويلي","أوت لومامي","إيتوري","الكونغو الوسطى","باس أويلي","تشوابا","تشوبو","تنجانيقا","جنوب أوبانجي","جنوب كيفو","خط الاستواء","سانكورو","شمال أوبانجي","شمال كيفو","كاساي","كاساي الشرقية","كاساي سنترال","كوانغو","كويلو","كينشاسا","لوالابا","لومامي","مانييما","ماي-ندومبي","مونغالا","هوت كاتانغا"]],["جنوب أفريقيا",["الشمال الغربي","جوتنج","كوازولو ناتال","كيب الشرقية","كيب الشمالي","كيب الغربية","ليمبوبو","مبومالانجا","ولاية حرة"]],["جنوب السودان",["أعالي النيل","البحيرات","الوحدة","شرق الاستوائية","شمال بحر الغزال","غرب الاستوائية","غرب بحر الغزال","واراب","وسط الاستوائية","ولاية جونقلي"]],["جنوب جورجيا",["أخرى"]],["جورجيا",["أبخازيا","أدجارا","إيميريتي","تبليسي","راشا ليخومي وكفيمو سفانيتي","سامتسخه-جافاخيتي","ساميغريلو-زيمو سفانيتي","شيدا كارتلي","غوريا","كاخيتي","كفيمو كارتلي","متسخيتا-متيانيتي"]],["جيرسي",["الثالوث","القديس المخلص","القديس بطرس","القديس كليمنت","القديس يوحنا","جروفيل","سانت أوين","سانت بريليد","سانت لورانس","سانت مارتن","سانت ماري","سانت هيلير"]],["دومينيكا",["القديس أندرو","القديس باتريك","القديس بطرس","القديس بولس","القديس جورج","القديس داود","القديس لوقا","القديس مرقس","القديس يوحنا","القديس يوسف"]],["ديك رومى",["أدرنة","أديامان","أرتفين","أرداهان","أرضروم","أضنة","أغري","أفيون قره حصار","أكساراي","أماسيا","أنطاليا","أنقرة","أوردو","أوشاك","أيدين","إرزينجان","إزمير","إسبرطة","إسكي شهير","إغدير","إلازيغ","اسطنبول","باتمان","بارتين","باليكسير","بايبورت","بتليس","بوردور","بورصة","بولو","بيلجيك","بينجول","تشاناكالي","توكات","تونجلي","تيكيرداغ","جوموشانه","جيرسون","دنيزلي","دوزجي","ديار بكر","ريزي","زونغولداك","ساكاريا","سامسون","سيرت","سينوب","سيواس","شانكيري","شانلي أورفا","شرناق","طرابزون","عثمانية","غازي عنتاب","فان","قونية","قيصري","كارابوك","كارامان","كارس","كاستامونو","كهرمان مرعش","كوتاهيا","كوجالي","كوروم","كيرشهير","كيركلاريلي","كيريكالي","كيليس","ماردين","مانيسا","مرسين","ملاطيا","موس","موغلا","نيغدة","نيفشهير","هاتاي","هكاري","يالوفا","يوزغات"]],["رجل (جزيرة)",["أير","جارف","جلينفابا","راشن","مايكل","وسط"]],["رواندا",["الغربي","جنوبي","شرقي","شمالي","كيغالي"]],["روسيا",["أديغيا","أرخانجيلسك","أستراخان","ألتاي","أمور","أورينبورغ","أوريول","أوسيتيا الشمالية-ألانيا","أوليانوفسك","أومسك","إنغوشيتيا","إيركوتسك","إيفانوفو","الأدمرت","الشيشان","باشكورتوستان","بريانسك","بريمورسكي","بسكوف","بورياتيا","بيرم كراي","بيلغورود","بينزا","تامبوف","تتارستان","تشوفاش","تشوكوتكا","تشيليابينسك","تفير","توفا","تولا","تومسك","تيومين","خاباروفسك","خاكاسيا","خانتي مانسي","داغستان","روستوف","ريازان","زابايكالسكي","ساراتوف","سامارا","سانت بطرسبرغ","ستافروبول","سخا","سخالين","سفيردلوفسك","سمولينسك","فلاديمير","فورونيج","فولوغدا","قراتشاي-شركيس","كاباردينو-بلقار","كاريليا","كالميكيا","كالوغا","كالينينغراد","كامتشاتكا","كراسنودار","كراسنويارسك","كورسك","كورغان","كوستروما","كومي","كيروف","كيميروفو","ليبيتسك","لينينغراد","ماجادان","ماري إل","منطقة فولغوغراد","موردوفيا","مورمانسك","موسكو","نوفغورود","نوفوسيبيرسك","نيجني نوفغورود","نينيتس","ياروسلافل","يامالو نينيتس","يهودي"]],["رومانيا",["أراد","أرجيس","ألبا","أولت","إيلفوف","باكاو","براشوف","براهوفا","برايلا","بوتوشاني","بوخارست","بوزاو","بيستريتا-ناسود","بيهور","تولسيا","تيلورمان","تيميس","جالاتي","جورج","جورجيو","دامبوفيتا","دولج","ساتو ماري","سالاج","سوتشافا","سيبيو","فاسلوي","فالسيا","فرانسيا","كاراس-سيفيرين","كالراسي","كلوج","كوفاسنا","كونستانتا","ماراموريش","مهيدينتي","موريش","نيامت","هارغيتا","هونيدوارا","ياش","يالوميتا"]],["زامبيا",["الغربي","جنوبي","حزام النحاس","شرقي","شمال غرب","شمالي","لوابولا","لوساكا","مركزي","موتشينغا"]],["زيمبابوي",["بولاوايو","ماتابيليلاند الجنوبية","ماتابيليلاند الشمالية","ماسفينغو","ماشونالاند الشرقية","ماشونالاند الغربية","ماشونالاند الوسطى","مانيكالاند","ميدلاندز","هراري"]],["ساموا",["Fa'asaleleaga","آنا","أتوا","أيجا-إي-لي-تاي","بالولي","تواماساغا","ساتوبايتيا","غاغا'يماوجا","غاغايفوماوجا","فاا-أو-فونوتي","فايسيجانو"]],["ساموا الأمريكية",["الغربي","سوينز","شرقي","شعب روز الحلقي","مانوا"]],["سان بارثيليمي",["Saint-Barthélemy"]],["سان مارتن (الجزء الفرنسي)",["Saint-Martin"]],["سان مارينو",["أكوافيفا","بورجو ماجوري","دومانيانو","سان مارينو","سيرافالي","فايتانو","فيورنتينو","كييسانوفا","مونتيجاردينو"]],["سانت كيتس ونيفيس",["سانت كيتس","نيفيس"]],["سانت لوسيا",["أنس لا راي","الحصن القديم","تشويسيول","جزيرة جروس","دينيري","سوفريير","طيور الكناري","كاستريس","لابوري","ميكود"]],["سانت هيلانة",["Ascension","Saint Helena","Tristan da Cunha"]],["ساو تومي وبرينسيبي",["برينسيبي","كانتاغالو","لوباتا","ليمبا","مقاطعة أجوا غراندي","مقاطعة كاوي","مقاطعة مي زوتشي"]],["سري لانكا",["الغربي","جنوبي","ساباراجاموا","شرقي","شمال غرب","شمال وسط","شمالي","مركزي","مقاطعة يوفا"]],["سلوفاكيا",["بانسكا بيستريتسا","براتيسلافا","بريشوف","ترنافا","ترينشين","زيلينا","كوشيتسه","نيترا"]],["سلوفينيا",["Bistrica ob Sotli","Cerklje na Gorenjskem","Dol pri Ljubljani","Kanal ob Soči","Kostanjevica na Krki","Lovrenc na Pohorju","Miklavž na Dravskem Polju","Radlje ob Dravi","Ravne na Koroškem","Rečica ob Savinji","Ribnica na Pohorju","Selnica ob Dravi","Središče ob Dravi","Sveti Jurij ob Ščavnici","Zagorje ob Savi","Črenšovci","Črna na Koroškem","Šempeter–Vrtojba","Šentjernej","Šentrupert","Škofja Loka","Šmarje pri Jelšah","Šmarješke Toplice","Šmartno ob Paki","Šmartno pri Litiji","أباتشي","أجدوفشينا","أنقرةان","أوبلوتنيكا","أودرانسي","أورموش","أوسيلنيكا","إدريجا","إيزولا","إيفانكنا جوريكا","إيليرسكا بيستريكا","السلوفينية غراديك","اي جي","بتوج","براسلوتشي","بردا","بريدفور","بريزوفيكا","بريزيس","بريفالي","بلتينشي","بلدية بريبولد","بلدية بلوك","بلدية روشه","بلدية شتوره","بلدية غراد","بليد","بودتشيترتيك","بودفيلكا","بودليهنيك","بوروفنيكا","بوستوينا","بوفيك","بوكونشي","بولزيلا","بوليكان","بوهينج","بيران","بيسنيكا","بيفكا","بينيديكت","تابور","تربوفلي","ترزيتش","ترزين","ترنوفسكا فاس","تريبني","تورنيشتشي","تولمين","تيسينا","جروسوبلي","جورجي","جورشينسي","جوريسنيكا","جورينيا فاس-بولجان","جيزرسكو","جيسينيس","جيليزنيكي","درافوغراد","دوبجي","دوبرنا","دوبروفا-بولهوف غراديك","دوبروفنيك","دوبريبولجي","دوبلك","دورنافا","دولينجسكي توبليس","دومزالي","ديسترنيك","ديفاتشا","رادوفلييكا","راديتش","رادينشي","رازكريزي","راسي-فرام","روجاتك","روغاسكا سلاتينا","روغاشوفتشي","ريبنيكا","رينشي-فوجرسكو","زافريتش","زاليك","زريتش","زوزيمبيرك","زيتالي","زيروفنيكا","زيري","سالوفتشي","ستارشي","سترازا","سجل-دراغومر","سفيتا آنا","سفيتا تروجيكا ضد سلوفينسكي جوريكا","سفيتي أندراز ضد سلوفينسكي جوريكا","سفيتي توماز","سفيتي يوريج ضد سلوفينسكيه جوريكا","سكوجان","سلوفينسكا بيستريتسا","سلوفينسكي كونجيتسه","سودرازيكا","سولتشافا","سيركفينجاك","سيركنو","سيركنيكا","سيركولاني","سيزانا","سيفنيكا","سيلجي","سيميتش","شرنوميلج","شكوفليكا","شنتجور","شنتيلج","شوشتاني","شينور","غورني بتروفسي","غورني غراد","غورنيا رادغونا","فرانسكو","فرهنيكا","فوديس","فوزينيكا","فوينيك","فيبافا","فيتاني","فيديم","فيرجي","فيليكا بولانا","فيليكي لاشتشي","فيلينيه","كامنيك","كانكوفا","كرانج","كرانجسكا غورا","كرشكو","كريزيفتشي","كوباريد","كوبر","كوبيلي","كوزجي","كوزما","كوستيل","كوشيفجي","كومن","كوميندا","كونغوتا","كيدريتشيفو","لاشكو","لجوتومر","لوتشي","لوسكا دولينا","لوسكي بوتوك","لوغاتيك","لوكوفيتشا","ليتيجا","لينارت","ليندافا","ليوبليانا","ليوبنو","ماجسبيرك","ماركوفشي","ماريبور","ماكول","منجيش","موتا","مورافتشي","مورافسكه توبليس","مورسكا سوبوتا","موزيرجي","موكرونوج-تريبلنو","ميتليكا","ميدفود","ميرنا","ميرنا بيتش","ميرين-كوستانجيفيكا","ميزيكا","ميسلينجا","نازارجي","ناكلو","نوفا جوريكا","نوفو ميستو","هاجدينا","هراستنيك","هربيلي-كوزينا","هوتشي-سليفنيكا","هودوس","هورجول"]],["سمعت جزيرة وجزر ماكدونالد",["أخرى"]],["سنغافورة",["الجنوب الغربي","الشمال الغربي","جنوب شرق","شمال شرق","وسط سنغافورة"]],["سورينام",["بارا","باراماريبو","بروكوبوندو","ساراماكا","سيباليويني","كوروني","كوميويجني","مارويجين","نيكيري","وانيكا"]],["سويسرا",["أبنزل أوسيرهودن","أبنزل إينرهودن","أرجاو","أوبوالدن","أوري","بازل لاند","برن","تيسينو","ثورجاو","جلاروس","جنيف","جورا","زوغ","زيورخ","سانت غالن","سولوتورن","شافهاوزن","شويز","غراوبوندن","فاليه","فريبورغ","فود","لوسيرن","مدينة بازل","نوشاتيل","نيدوالدن"]],["سيراليون",["الغربي","جنوبي","شرقي","شمال غرب","شمالي"]],["سيشيل",["آنس ایتوال","أنس أو بينز","أنس بوالو","أنس رويال","أو كاب","المامال","باي سانت آن","باي لازار","بليزانس","بو فالون","بوانت لا رو","بورت جلود","بيل أومبري","بيل إير","تاكاماكا","جراند آنس براسلين","جزيرة المثابرة 1","جزيرة المثابرة الثانية","جلاسيس","روش كايمان","سانت لويس","غراند آنس ماهي","كاسكاد","لا ديج","لا ريفيير أنجليز","مونت بوكستون","مونت فلوري"]],["سينت مارتن (الجزء الهولندي)",["أخرى"]],["شمال مقدونيا",["Aerodrom","Češinovo-Obleševo","Čučer-Sandevo","أراتشينوفو","أوهريد","إيليندن","برفينيكا","بروبيستيب","بريليب","بلاسنيكا","بلدية شتيب","بوتيل","بوسيلوفو","بوغدانشي","بوغوفينجي","بيتروفيتش","بيتولا","بيروفو","بيهتشيفو","تشاسكا","تيتوفو","تيرس","جورجي بتروف","جيغونوفتشي","جيفجيليا","دوجران","دولنيني","ديبار","ديباركا","ديلتشيفو","ديمير حصار","ديمير كابيجا","رادوفيتش","رانكوفتشي","روسومان","ريسن","زرنوفشي","زيلينو","زيلينيكوفو","ستارو ناغوريكان","ستروغا","ستروميكا","ستودينيكاني","سراج","سفيتي نيكول","سوبيشتي","شوتو أوريزاري","غازي بابا","غرادسكو","غوستيفار","فاسيليفو","فالاندوفو","فرابتشيستي","فيفتشاني","فيليس","فينيكا","كاربوش","كاربينجي","كافادارشي","كراتوفو","كروسيفو","كريفا بالانكا","كريفوغاستاني","كوتشاني","كومانوفو","كونتشي","كيتشيفو","كير","كيسيلا فودا","لوزوفو","ليبكوفو","مافروفو وروستوشا","ماكدونسكي برود","مركز","مركز زوبا","مقدونيا كامينيكا","موغيلا","نوفاسك","نوفو سيلو","نيغوتينو"]],["صربيا",["برانيشيفو","برزرين","بلغراد","بودونافلجي","بور","بومورافلجي","بيتشينيا","بيخا","بيرو","توبليكا","جابلانيكا","راسينا","راشكا","زاييتشار","زلاتيبور","شوماديجا","فويفودينا","كوسوفو","كوسوفو-بومورافلي","كولوبارا","ماتشفا","مقاطعة كوسوفو وميتوهيا ذاتية الحكم","مورافيكا","ميتروفيتسا","نيشافا"]],["طاجيكستان",["Nohiyahoi Tobei Jumhurí","خاتلون","دوشنبة","سُغد","غورنو باداخشان"]],["غامبيا",["الساحل الغربي","الضفة الشمالية","النهر السفلي","النهر العلوي","بانجول","نهر سنترال"]],["غانا",["أشانتي","أكرا الكبرى","أهافو","أوتي","الشرق العلوي","الشمال الغربي","الغرب العلوي","الغربي","بونو","بونو إيست","سافانا","شرقي","شمال شرق","شمالي","فولتا","مركزي"]],["غرينادا",["القديس أندرو","القديس باتريك","القديس جورج","القديس داود","القديس مرقس","القديس يوحنا","كارياكو"]],["غرينلاند",["أفاناتا","سيرمرسوق","قكيرتاليك","قيقاتا","كوجاليك"]],["غواتيمالا",["ألتا فيراباز","إسكوينتلا","إيزابال","التقدم","باجا فيراباز","بيتين","تشيكيمولا","توتونيكابان","جالابا","جوتيابا","ريتالهوليو","زاكابا","ساكاتيبيكيز","سان ماركوس","سانتا روزا","سوتشيتبيكيز","سولولا","شيمالتينانغو","غواتيمالا","كويتزالتينانغو","كيش","هويهويتينانغو"]],["غواديلوب",["باس تير","بوانت-آه-بيتر"]],["غوام",["Inarajan (Inalåhan)","Umatac (Humåtak)","أسان ماينا","أغانا هايتس","باريجادا","بيتي","تالوفوفو (تالوفو'فو)","تامونينج","ديديدو","سانتا ريتا (سانتا ريتا-سوماي)","سيناجانا","شالان باغو-أوردوت","مانجيلاو","مونجمونج توتو مايتي","ميريزو (ماليسو)","هاجات","هاغاتنيا","يونا","ييجو"]],["غويانا الفرنسية",["Guyane"]],["غيانا",["باريما-ويني","بوتارو-سيباروني","بوميرون-سوبينام","تاكوتو العليا - إسيكويبو العليا","جزر إيسيكويبو-غرب ديميرارا","ديميرارا العليا-بيربيس","ديميرارا-ماهايكا","شرق بيربيس-كورينتين","كويوني-مازاروني","ماهايكا-بيربيس"]],["غيرنسي",["ألديرني","القديس أندرو","القديس المخلص","القديس سامبسون","تورتيفال","سارك","سان بيير دو بوا","سانت مارتن","غابة","كاستل","ميناء سانت بيتر","وادي"]],["غينيا",["بوكي","فارانه","كانكان","كوناكري","كينديا","لابي","مامو","نزيريكوري"]],["غينيا الاستوائية",["جزيرة","ريو موني"]],["غينيا بيساو",["بيساو","سول","ليستي","نورتي"]],["فانواتو",["بيناما","تافيا","توربا","سانما","شفا","مالامبا"]],["فرنسا",["أوت دو فرانس","أوفيرني-رون ألب","أوكسيتانيا","إيل دو فرانس","الأراضي الفرنسية الجنوبية والقطبية الجنوبية","باي دو لا لوار","بروفانس ألب كوت دازور","بريتاني","بورغون-فرانش-كونتيه","بولينيزيا الفرنسية","جراند-إيست","سان بارتيليمي","سان بيير وميكلون","سان مارتن","غوادلوب","غيانا الفرنسية","كاليدونيا الجديدة","كليبرتون","كورس","لا ريونيون","مارتينيك","مايوت","مركز فال دو لوار","نورماندي","نوفيل آكيتين","واليس وفوتونا"]],["فنزويلا",["أراغوا","أمازوناس","أنزواتيغي","التبعيات الاتحادية","باريناس","بوليفار","تاتشيرا","تروخيو","دلتا أماكورو","ديستريتو كابيتال","زوليا","سوكري","غواريكو","فالكون","كارابوبو","كوجيديس","لا جويرا","لارا","موناغاس","ميراندا","ميريدا","نويفا إسبارتا","ولاية أبوري","ولاية بورتوغيزا","ياراكوي"]],["فنلندا",["أوستروبوثنيا","أوستروبوثنيا الشمالية","أوستروبوثنيا الوسطى","أوسيما","بايجان تافاستيا","بيركانما","تافاستيا بروبر","جزر آلاند","جنوب أوستروبوثنيا","جنوب سافونيا","ساتاكونتا","شمال سافونيا","فارسينايس سوومي","كاريليا الجنوبية","كاريليا الشمالية","كاينو","كيمينلاكسو","لابلاند","وسط فنلندا"]],["فيتنام",["Quảng Ngãi","Quảng Trị","Thừa Thiên-Huế","Điện Biên","Đắk Lắk","Đồng Tháp","أن جيانج","باك نينه","تاي نينه","توين كوانغ","ثانه هوا","ثاي نجوين","جيا لاي","خانه هوا","دا نانغ","دونغ ناي","سون لا","فو ثو","فينه لونغ","كا ماو","كان ثو","كاو بانغ","كوانغ نينه","لام دونغ","لانغ سون","لاو كاي","لاي تشاو","نغو آن","نينه بينه","ها تينه","ها نوي","هاي فونج","هو تشي منه","هونغ ين"]],["فيلبيني",["Negros Island Region","إدارة كورديليرا","إيلوكوس","المنطقة المتمتعة بالحكم الذاتي في مينداناو المسلمة","بيكول","دافاو","سوكسكسارجين","شبه جزيرة زامبوانجا","شمال مينداناو","فيساياس الشرقية","فيساياس الغربية","فيساياس الوسطى","كاراجا","كالابارزون","منطقة العاصمة الوطنية (مانيلا الكبرى)","ميماروبا","وادي كاجايان","وسط لوزون"]],["قبرص",["بافوس (بافوس)","فاماغوستا (ماغوسا)","كيرينيا (كيرينيا)","لارنكا (لارنكا)","ليماسول (ليماسون)","نيقوسيا (ليفكوشا)"]],["قيرغيزستان",["أوش","إيسيك كول","باتكن","بيشكيك","تالاس","تشوي","جلال آباد","نارين"]],["كازاخستان",["أباي","أتيراو","أستانا","أكتوبي","أكمولا","ألماتي","أوليتاو","بافلودار","تركستان","جامبيل","جيتيسو","شرق كازاخستان","شمال كازاخستان","شيمكنت","غرب كازاخستان","كاراجندا","كوستناي","كيزيلوردا","مانجيستاو"]],["كاليدونيا الجديدة",["مقاطعة الجنوب","مقاطعة الشمال","مقاطعة جزر لويالتي"]],["كرواتيا",["City of Zagreb","أوسييك-بارانيا","إستريا","برود-بوسافينا","بريموريه-غورسكي كوتار","بوزيغا-سلافونيا","بيلوفار-بيلوغورا","دوبروفنيك-نيريتفا","زادار","زغرب","سبليت-دالماسيا","سيساك-موسلافينا","شيبينيك-كنين","فارازدين","فوكوفار-سيرميا","فيروفيتيكا-بودرافينا","كارلوفاتش","كرابينا-زاغوري","كوبريفنيكا-كريزيفتشي","ليكا سينج","ميديمورجي"]],["كمبوديا",["أودار مينشي","باتامبانغ","بانتياي مينشي","بايلين","برياه فيهير","بنوم بنه","بورسات","تاكيو","تبونغ خموم","راتاناكيري","ستونغ ترينغ","سفاي رينغ","سيام ريب","سيهانوكفيل","كامبوت","كامبونج تشام","كامبونج تشنانغ","كامبونج ثوم","كامبونج سبيو","كاندال","كراتي","كوه كونغ","كيب","محافظة بري فنغ","موندولكيري"]],["كندا",["ألبرتا","أونتاريو","الأقاليم الشمالية الغربية","جزيرة الأمير إدوارد","ساسكاتشوان","كولومبيا البريطانية","كيبيك","مانيتوبا","نوفا سكوشا","نونافوت","نيو برونزويك","نيوفاوندلاند ولابرادور","يوكون"]],["كوبا",["أرتيميسا","بينار ديل ريو","جزيرة الشباب","سانتياغو دي كوبا","سانكتي سبيريتوس","سييغو دي أفيلا","سيينفويغوس","غرانما","غوانتانامو","فيلا كلارا","كاماجوي","لاس توناس","ماتانزاس","مايابيك","هافانا","هولغوين"]],["كوت ديفوار (ساحل العاج)",["أبيدجان","البحيرات","السافانيون","باس ساساندرا","جوه جيبوا","دينغيلي","زانزان","ساساندرا-ماراهوي","كوموي","لاجونيس","مونتاني","وادي بانداما","ووروبا","ياموسوكرو"]],["كوراساو",["أخرى"]],["كوريا الجنوبية",["Jeonnam-Gwangju Integrated Special City","أولسان","إنتشون","بوسان","تشونغتشونغ الجنوبية","تشونغتشونغ الشمالية","جيجو","جيونج سانج الجنوبية","جيونجي","دايجو","دايجون","سيول","شمال جولا","شمال جيونج سانج","غانغوون","مدينة سيجونغ"]],["كوريا الشمالية",["بيونغ يانغ","تشاجانج","جنوب بيونغان","جنوب هوانغهاي","راسون","ريانغانغ","شمال بيونغان","شمال هوانغهاي","كانغوون","كايسونغ","نامبو (مدينة خاصة)","هامغيونغ الجنوبية","هامغيونغ الشمالية"]],["كوستاريكا",["ألاخويلا","بونتاريناس","سان خوسيه","غواناكاستي","كارتاغو","ليمون","هيريديا"]],["كوسوفو",["بريزرن","بريشتينا","بيجا","جاكوف","جيلان","فيريزاج","ميتروفيتشا"]],["كوك جزر",["أخرى"]],["كولومبيا",["أتلانتيكو","أراوكا","أمازوناس","أنتيوكيا","بوتومايو","بوغوتا العاصمة","بوليفار","بوياكا","توليما","جوافياري","ريسارالدا","سان أندريس، بروفيدنسيا وسانتا كاتالينا","سانتاندير","سوكري","سيزار","شوكو","غوينيا","فوبيس","فيشادا","قرطبة","كاساناري","كاكيتا","كالداس","كاوكا","كونديناماركا","كوينديو","لا غواخيرا","ماجدالينا","ميتا","نارينيو","نورتي دي سانتاندير","هويلا","وادي كاوكا"]],["كيريباتي",["Line","جيلبرت","فينيكس"]],["كينيا",["أوسين جيشو","إلجيو-ماراكويت","إمبو","إيسولو","بارينجو","بوسيا","بوميت","بونغوما","تايتا-تافيتا","ترانس نزويا","توركانا","ثاراكا نيثي","خليج هوما","سامبورو","سيايا","غاريسا","غرب بوكوت","فيهاجا","كاجيادو","كاكاميجا","كوالي","كيامبو","كيتوي","كيريشو","كيرينياغا","كيسومو","كيسي","كيليفي","لامو","لايكيبيا","مارسابيت","ماشاكوس","ماكويني","مانديرا","مدينة نيروبي","مورانغا","مومباسا","ميرو","ميغوري","ناروك","ناكورو","ناندي","نهر تانا","نياميرا","نيانداروا","نييري","واجير"]],["لاتفيا",["Madona","آدازي","آيزكراوكلي","ألوكسني","أوجسودوجافا","أولين","بالفي","باوسكا","بريلي","بلدية أوغري","تالسي","توكومس","جولبين","دوبيلي","دوجافبيلس","دينفيدكورزيميس","روبازي","ريزكنه","ريغا","سالاسبيلس","سالدوس","سميلتين","سولكراستي","سيسيس","سيغولدا","فالكا","فالميرا","فينتسبيلز","كراسلافا","كولديجا","كيكافا","لودزا","ليفاني","ليمبازي","لييبايا","ماروبي","يكاببيلس","يلغافا","يورمالا"]],["لاوس",["أتابو","أودومكساي","بوكيو","بوليخامساي","خاموان","زيسومبون","سافاناخت","سالافان","ساينيابولي","سيكونج","شامباساك","شيانغخوانغ","فونغسالي","فيينتيان","لوانغ برابانغ","لوانغ نامثا","هوا فانه"]],["لوكسمبورغ",["Grevenmacher","Luxembourg","إخترناخ","إيش سور ألزيت","ديكيرش","ريدانج","ريميش","فياندن","كابيلين","كليرفو","ميرش","ويلتز"]],["ليبيريا",["بومي","بونغ","جبل جراند كيب","جراند باسا","جراند جيديه","جراند كرو","سينوي","غباربولو","لوفا","مارغيبي","ماريلاند","مونتسيرادو","نهر جي","نهر سيس","نيمبا"]],["ليتوانيا",["أليتوس","أوتينا","بانيفيزيس","توراج","تيلشياي","شياولياي","فيلنيوس","كاوناس","كلايبيدا","ماريجامبولي"]],["ليختنشتاين",["إشن","بالزرز","بلانكن","تريسن","تريسنبيرج","جامبرين","روجيل","شان","شيلينبيرج","فادوز","مورين"]],["ليسوتو",["بوثا-بوثي","بيريا","ثابا تسيكا","قَاتشا نَك","كوثينج","ليريبي","ماسيرو","مافيتنج","موخوتلونج","موهاليز هوك"]],["مارتينيك",["الثالوث","سان بيير","فورت دو فرانس","لو مارين"]],["ماكاو س.",["أخرى"]],["مالطا",["Eastern Region","Port Region","Western Region","المنطقة الجنوبية","المنطقة الشمالية","غودش"]],["مالي",["باماكو","تاودينيت","تمبكتو","جاو","سيغو","سيكاسو","كايس","كوليكورو","كيدال","موبتي","ميناكا"]],["ماليزيا",["باهانج","بوتراجايا","بيراك","بيرليس","بينانغ","ترينجانو","جوهور","ساراواك","سيلانغور","صباح","قدح","كلنتن","كوالا لمبور","لابوان","ملقا","نيجري سمبيلان"]],["مايوت",["أكوا","باماندزي","باندرابوا","باندريلي","بويني","تسينغوني","تشيرونغوي","دزاوودزي","ديمبيني","سادا","شيكوني","كاني كيلي","كونغو","مامودزو","متسامبورو","متسانجاموجي","وانغاني"]],["مدغشقر",["أنتاناناريفو","أنتسيرانانا","تواماسينا","توليارا","فيانارانتسوا","ماهاجانجا"]],["ملاوي",["جنوبي","شمالي","مركزي"]],["منغوليا",["أرخانغاي","أورخون","أوفورخانغاي","أولان باتور","أومنوغوفي","بايان-أولجي","بايانخونجور","بولجان","توف","جوفيسومبر","خوفد","خوفسجول","خينتي","دارخان-أول","دورنود","دورنوغوفي","دوندجوفي","زافخان","سوخباتار","سيلينج","غوفي-ألتاي","يو في اس"]],["موريشيوس",["النهر الأسود","بامبليموسيس","بلينز ويلهمز","بورت لويس","جراند بورت","جزر أغاليغا","جزر سانت براندون","جزيرة رودريغيز","سافان","فلاك","موكا","نهر ريمبارت"]],["موزمبيق",["إنهامبان","تيتي","زامبيزيا","سوفالا","غزة","كابو ديلجادو","مابوتو","مانيكا","نامبولا","نياسا"]],["مولدوفا",["Șoldănești","Ștefan Vodă","أنيني نوي","أورهي","أوكنيتا","أونغيني","إدينيت","باسارابسكا","بالتي","بريسيني","بندر","تاراكليا","ترانسنيستريا","تيلينيستي","دروتشيا","دوباساري","دوندوسيني","ريزينا","ريسكاني","ستراشيني","سوروكا","سيميشليا","سينجيري","غاغاوزيا","غلوديني","فالستي","فلورستي","كالراسي","كانتيمير","كاهول","كريوليني","كوسيني","كيشيناو","ليوفا","نيسبوريني","هينسيستي","يالوفيني"]],["موناكو",["الحديقة الغريبة","سان رومان","سانت ديفوت","سبيلوغ","فالون دو لا روس","فونتفيي","لا سورس","لا غار","لا كول","لا كوندامين","لارفوتو","مالبوسكيه","مولان","موناكو فيل","مونت كارلو","مونيجيتي","ميناء هرقل"]],["مونتسيرات",["القديس أنطونيوس","القديس بطرس","القديس جورج"]],["ميانمار",["أيياروادي","باغو","تانينثاري","راخين","ساجاينج","شان","كاشين","كايا","كاين","ماغواي","ماندالاي","نايبيداو","ولاية تشين","ولاية مون","يانغون"]],["ميكرونيسيا",["بوهنباي","تشوك","كوسراي","ياب"]],["ناميبيا",["أوتجوزوندجوبا","أوشانا","أوشيكوتو","أوماهيكي","أوموساتي","أوهانجوينا","إيرونجو","خوماس","زامبيزي","كاراس","كافانغو الشرقية","كافانغو ويست","كونيني","هارداب"]],["ناورو",["أنابار","أنيبار","أنيتان","أوبوي","أيوو","إيجو","إيوا","بو","بوادا","بيتي","دينيجومودو","مينينج","نيبوك","يارين"]],["نيبال",["باجماتي","سودورباشيم","غانداكي","كارنالي","كوشي","لومبيني","ماديش"]],["نيجيريا",["أبيا","أداماوا","أكوا إيبوم","أنامبرا","أوجون","أوسون","أوندو","أويو","إيبوني","إيدو","إيكيتي","إيمو","إينوجو","النيجر","باوتشي","بايلسا","بورنو","بينوي","تارابا","جيجاوا","دلتا","زامفارا","سوكوتو","غومبي","كاتسينا","كادونا","كانو","كوارا","كوجي","كيبي","لاغوس","منطقة العاصمة الفيدرالية أبوجا","ناساراوا","نهر كروس","ولاية بلاتو","ولاية ريفرز","يوبي"]],["نيكاراغوا",["إستيلي","بواكو","تشينانديجا","جينوتيغا","ريفاس","ريو سان خوان","ساحل جنوب البحر الكاريبي","ساحل شمال البحر الكاريبي","شونتاليس","غرناطة","كارازو","ليون","ماتاجالبا","مادريز","ماسايا","ماناغوا","نويفا سيغوفيا"]],["نيو",["أفاتيلي","ألوفي ساوث","ألوفي نورث","تاماكاوتوغا","توابا","توي","فاييا","لاكيبا","ليكو","ماكفو","موتالاو","ناموكولو","هاكوبو","هيكوتافاكي"]],["نيوزيلندا",["أوتاجو","أوكلاند","الساحل الغربي","تاراناكي","تسمان","جزر تشاتام","جيسبورن","خليج بلنتي","خليج هوك","ساوثلاند","كانتربري","مارلبورو","ماناواتو-وانجانوي","نورثلاند","نيلسون","وايكاتو","ويلينغتون"]],["هايتي",["أرتيبونيت","جنوب شرق","سود","شمال شرق","شمال غرب","غراند آنس","غرب","مركز","نورد","نيبس"]],["هندوراس",["Gracias a Dios","أتلانتيدا","أوكوتيبيك","أولانشو","إل بارايسو","إنتيبوكا","تشولوتيكا","جزر الخليج","سانتا باربرا","فالي","فرانسيسكو مورازان","كوبان","كورتيس","كولون","كوماياغوا","لاباز","لمبيرا","يورو"]],["هنغاريا",["إيجر","إيرد","بارانيا","باكس-كيسكون","بودابست","بورسود-أباوج-زيمبلين","بيكس","بيكيس","بيكيسكاسابا","تاتابانيا","جيور","دوناوجفاروس","ديبريسين","زالاجيرزيج","زولنوك","زومباثيلي","سالغوتارجان","سوبرون","سيجد","سيكسزارد","سيكيسفيرفار","فيسبريم","كابوسفار","كوماروم-إزترغوم","كيسكيميت","مقاطعة بيست","مقاطعة تشونغراد","مقاطعة تولنا","مقاطعة جاس-ناغيكون-سولنوك","مقاطعة جيور-موسون-سوبرون","مقاطعة زابولكس-زاتمار-بيرج","مقاطعة زالا","مقاطعة سوموجي","مقاطعة فاس","مقاطعة فيزبرم","مقاطعة فيير","مقاطعة نوغراد","مقاطعة هاجدو-بيهار","مقاطعة هيفز","ميسكولك","ناجيكانيزسا","نيريغيهازا","هودميزوفاسارهيلي"]],["هولندا",["أوتريخت","أوفرآيسل","جنوب هولندا","خرونينجن","خيلدرلاند","درينثي","زيلاند","شمال برابانت","فريزلاند","فليفولاند","ليمبورغ","هولندا الشمالية"]],["هونغ كونغ س.",["الجزر","الوسطى والغربية","تاي بو","تسوين وان","توين مون","جنوبي","ساي كونغ","شا تين","شام شوي بو","شرقي","شمال","كواي تسينغ","كوون تونغ","مدينة كاولون","وان تشاي","وونغ تاي سين","ياو تسيم مونغ","يوين لونغ"]],["ولاية مدينة الفاتيكان (الكرسي الرسولي)",["أخرى"]]];window.AQEEQ_GEO=D.map(function(r){return{name:r[0],regions:r[1]}});})();

;
/* assets/js/geo-picker.js */
/* اختيار مكان الميلاد: دولة ← محافظة/ولاية + بحث عربي/إنجليزي.
   يشتغل فوق القوائم الحالية (#f-city, #cp1-city, #cp2-city) من غير ما يلمس محركات الحساب:
   بيختار/يضيف عنصر في CITIES ويطلق حدث change على القائمة الأصلية. */
(function () {
  "use strict";
  /* الدولة|English|العاصمة|Capital|lat|lon|tz  (إحداثيات العاصمة، وتُستخدم تقريبًا للمحافظات اللي ملهاش إحداثيات) */
  var C = ("مصر|Egypt|القاهرة|Cairo|30.0444|31.2357|Africa/Cairo;المملكة العربية السعودية|Saudi Arabia|الرياض|Riyadh|24.7136|46.6753|Asia/Riyadh;الإمارات العربية المتحدة|United Arab Emirates|أبوظبي|Abu Dhabi|24.4539|54.3773|Asia/Dubai;الكويت|Kuwait|مدينة الكويت|Kuwait City|29.3759|47.9774|Asia/Kuwait;قطر|Qatar|الدوحة|Doha|25.2854|51.531|Asia/Qatar;البحرين|Bahrain|المنامة|Manama|26.2285|50.586|Asia/Bahrain;عمان|Oman|مسقط|Muscat|23.588|58.3829|Asia/Muscat;الأردن|Jordan|عمّان|Amman|31.9454|35.9284|Asia/Amman;لبنان|Lebanon|بيروت|Beirut|33.8938|35.5018|Asia/Beirut;سوريا|Syria|دمشق|Damascus|33.5138|36.2765|Asia/Damascus;العراق|Iraq|بغداد|Baghdad|33.3152|44.3661|Asia/Baghdad;فلسطين|Palestine|القدس|Jerusalem|31.7683|35.2137|Asia/Hebron;اليمن|Yemen|صنعاء|Sanaa|15.3694|44.191|Asia/Aden;السودان|Sudan|الخرطوم|Khartoum|15.5007|32.5599|Africa/Khartoum;ليبيا|Libya|طرابلس|Tripoli|32.8872|13.1913|Africa/Tripoli;تونس|Tunisia|تونس|Tunis|36.8065|10.1815|Africa/Tunis;الجزائر|Algeria|الجزائر|Algiers|36.7538|3.0588|Africa/Algiers;المغرب|Morocco|الرباط|Rabat|34.0209|-6.8416|Africa/Casablanca;موريتانيا|Mauritania|نواكشوط|Nouakchott|18.0735|-15.9582|Africa/Nouakchott;الصومال|Somalia|مقديشو|Mogadishu|2.0469|45.3182|Africa/Mogadishu;جيبوتي|Djibouti|جيبوتي|Djibouti|11.5721|43.1456|Africa/Djibouti;جزر القمر|Comoros|موروني|Moroni|-11.7172|43.2473|Indian/Comoro;تركيا|Turkey|أنقرة|Ankara|39.9334|32.8597|Europe/Istanbul;إيران|Iran|طهران|Tehran|35.6892|51.389|Asia/Tehran;إسرائيل|Israel|القدس|Jerusalem|31.7683|35.2137|Asia/Jerusalem;قبرص|Cyprus|نيقوسيا|Nicosia|35.1856|33.3823|Asia/Nicosia;أثيوبيا|Ethiopia|أديس أبابا|Addis Ababa|9.03|38.74|Africa/Addis_Ababa;كينيا|Kenya|نيروبي|Nairobi|-1.2921|36.8219|Africa/Nairobi;نيجيريا|Nigeria|أبوجا|Abuja|9.0765|7.3986|Africa/Lagos;جنوب أفريقيا|South Africa|بريتوريا|Pretoria|-25.7479|28.2293|Africa/Johannesburg;غانا|Ghana|أكرا|Accra|5.6037|-0.187|Africa/Accra;السنغال|Senegal|داكار|Dakar|14.7167|-17.4677|Africa/Dakar;تنزانيا|Tanzania|دودوما|Dodoma|-6.163|35.7516|Africa/Dar_es_Salaam;أوغندا|Uganda|كمبالا|Kampala|0.3476|32.5825|Africa/Kampala;الجزائر_|x|x|x|0|0|x;المملكة المتحدة|United Kingdom|لندن|London|51.5074|-0.1278|Europe/London;أيرلندا|Ireland|دبلن|Dublin|53.3498|-6.2603|Europe/Dublin;فرنسا|France|باريس|Paris|48.8566|2.3522|Europe/Paris;ألمانيا|Germany|برلين|Berlin|52.52|13.405|Europe/Berlin;إيطاليا|Italy|روما|Rome|41.9028|12.4964|Europe/Rome;إسبانيا|Spain|مدريد|Madrid|40.4168|-3.7038|Europe/Madrid;البرتغال|Portugal|لشبونة|Lisbon|38.7223|-9.1393|Europe/Lisbon;هولندا|Netherlands|أمستردام|Amsterdam|52.3676|4.9041|Europe/Amsterdam;بلجيكا|Belgium|بروكسل|Brussels|50.8503|4.3517|Europe/Brussels;سويسرا|Switzerland|برن|Bern|46.948|7.4474|Europe/Zurich;النمسا|Austria|فيينا|Vienna|48.2082|16.3738|Europe/Vienna;السويد|Sweden|ستوكهولم|Stockholm|59.3293|18.0686|Europe/Stockholm;النرويج|Norway|أوسلو|Oslo|59.9139|10.7522|Europe/Oslo;الدنمارك|Denmark|كوبنهاغن|Copenhagen|55.6761|12.5683|Europe/Copenhagen;فنلندا|Finland|هلسنكي|Helsinki|60.1699|24.9384|Europe/Helsinki;بولندا|Poland|وارسو|Warsaw|52.2297|21.0122|Europe/Warsaw;اليونان|Greece|أثينا|Athens|37.9838|23.7275|Europe/Athens;روسيا|Russia|موسكو|Moscow|55.7558|37.6173|Europe/Moscow;أوكرانيا|Ukraine|كييف|Kyiv|50.4501|30.5234|Europe/Kyiv;رومانيا|Romania|بوخارست|Bucharest|44.4268|26.1025|Europe/Bucharest;بلغاريا|Bulgaria|صوفيا|Sofia|42.6977|23.3219|Europe/Sofia;هنغاريا|Hungary|بودابست|Budapest|47.4979|19.0402|Europe/Budapest;الجمهورية التشيكية|Czechia|براغ|Prague|50.0755|14.4378|Europe/Prague;صربيا|Serbia|بلغراد|Belgrade|44.7866|20.4489|Europe/Belgrade;كرواتيا|Croatia|زغرب|Zagreb|45.815|15.9819|Europe/Zagreb;ألبانيا|Albania|تيرانا|Tirana|41.3275|19.8187|Europe/Tirane;البوسنة والهرسك|Bosnia and Herzegovina|سراييفو|Sarajevo|43.8563|18.4131|Europe/Sarajevo;أيسلندا|Iceland|ريكيافيك|Reykjavik|64.1466|-21.9426|Atlantic/Reykjavik;مالطا|Malta|فاليتا|Valletta|35.8989|14.5146|Europe/Malta;الولايات المتحدة|United States|واشنطن العاصمة|Washington DC|38.9072|-77.0369|America/New_York;كندا|Canada|أوتاوا|Ottawa|45.4215|-75.6972|America/Toronto;المكسيك|Mexico|مكسيكو سيتي|Mexico City|19.4326|-99.1332|America/Mexico_City;البرازيل|Brazil|برازيليا|Brasilia|-15.7939|-47.8828|America/Sao_Paulo;الأرجنتين|Argentina|بوينس آيرس|Buenos Aires|-34.6037|-58.3816|America/Argentina/Buenos_Aires;تشيلي|Chile|سانتياغو|Santiago|-33.4489|-70.6693|America/Santiago;كولومبيا|Colombia|بوغوتا|Bogota|4.711|-74.0721|America/Bogota;بيرو|Peru|ليما|Lima|-12.0464|-77.0428|America/Lima;فنزويلا|Venezuela|كاراكاس|Caracas|10.4806|-66.9036|America/Caracas;كوبا|Cuba|هافانا|Havana|23.1136|-82.3666|America/Havana;الصين|China|بكين|Beijing|39.9042|116.4074|Asia/Shanghai;اليابان|Japan|طوكيو|Tokyo|35.6762|139.6503|Asia/Tokyo;كوريا الجنوبية|South Korea|سيول|Seoul|37.5665|126.978|Asia/Seoul;الهند|India|نيودلهي|New Delhi|28.6139|77.209|Asia/Kolkata;باكستان|Pakistan|إسلام آباد|Islamabad|33.6844|73.0479|Asia/Karachi;بنغلاديش|Bangladesh|دكا|Dhaka|23.8103|90.4125|Asia/Dhaka;أفغانستان|Afghanistan|كابول|Kabul|34.5553|69.2075|Asia/Kabul;أندونيسيا|Indonesia|جاكرتا|Jakarta|-6.2088|106.8456|Asia/Jakarta;ماليزيا|Malaysia|كوالالمبور|Kuala Lumpur|3.139|101.6869|Asia/Kuala_Lumpur;سنغافورة|Singapore|سنغافورة|Singapore|1.3521|103.8198|Asia/Singapore;تايلاند|Thailand|بانكوك|Bangkok|13.7563|100.5018|Asia/Bangkok;فيتنام|Vietnam|هانوي|Hanoi|21.0278|105.8342|Asia/Ho_Chi_Minh;فيلبيني|Philippines|مانيلا|Manila|14.5995|120.9842|Asia/Manila;كازاخستان|Kazakhstan|أستانا|Astana|51.1694|71.4491|Asia/Almaty;أوزبكستان|Uzbekistan|طشقند|Tashkent|41.2995|69.2401|Asia/Tashkent;أذربيجان|Azerbaijan|باكو|Baku|40.4093|49.8671|Asia/Baku;أرمينيا|Armenia|يريفان|Yerevan|40.1792|44.4991|Asia/Yerevan;جورجيا|Georgia|تبليسي|Tbilisi|41.7151|44.8271|Asia/Tbilisi;أستراليا|Australia|كانبرا|Canberra|-35.2809|149.13|Australia/Sydney;نيوزيلندا|New Zealand|ويلينغتون|Wellington|-41.2866|174.7756|Pacific/Auckland").split(";").map(function (s) { var p = s.split("|"); return { ar: p[0], en: p[1], capAr: p[2], capEn: p[3], lat: +p[4], lon: +p[5], tz: p[6] }; }).filter(function (c) { return c.en !== "x"; });
  var BYAR = {}; C.forEach(function (c) { BYAR[c.ar] = c; });
  /* أسماء معيبة في ملف الأقسام الإدارية */
  var FIX = { "ديك رومى": "تركيا", "فيلبيني": "الفلبين", "تيمور قراءة": "تيمور الشرقية", "جمع شمل": "ريونيون", "عمان": "سلطنة عمان" };
  /* محافظات/مناطق بإحداثيات حقيقية (مراكزها الإدارية) */
  function T(s, tz) { var o = {}; s.split(";").forEach(function (r) { var p = r.split("|"); o[p[0]] = { lat: +p[1], lon: +p[2], tz: tz, n: p[3] || p[0] }; }); return o; }
  var R = {
    "مصر": T("أسوان|24.0889|32.8998;أسيوط|27.1809|31.1837;الأقصر|25.6872|32.6396;الإسكندرية|31.2001|29.9187;الإسماعيلية|30.5965|32.2715;البحر الأحمر|27.2579|33.8116|الغردقة;البحيرة|31.0341|30.4682|دمنهور;الجيزة|30.0131|31.2089;الدقهلية|31.0409|31.3785|المنصورة;السويس|29.9668|32.5498;الشرقية|30.5877|31.502|الزقازيق;الغربية|30.7865|31.0004|طنطا;الفيوم|29.3084|30.8428;القاهرة|30.0444|31.2357;القليوبية|30.466|31.1848|بنها;المنوفية|30.5972|30.9876|شبين الكوم;المنيا|28.1099|30.7503;الوادي الجديد|25.439|30.5586|الخارجة;بني سويف|29.0661|31.0994;بورسعيد|31.2653|32.3019;جنوب سيناء|28.241|33.6222|الطور;دمياط|31.4165|31.8133;سوهاج|26.5591|31.6957;شمال سيناء|31.1316|33.7984|العريش;قنا|26.1551|32.716;كفر الشيخ|31.1107|30.9388;مطروح|31.3543|27.2373", "Africa/Cairo"),
    "المملكة العربية السعودية": T("الباحة|20.0129|41.4677;الجوف|29.9697|40.2064|سكاكا;الحدود الشمالية|30.9753|41.0381|عرعر;الرياض|24.7136|46.6753;القصيم|26.326|43.975|بريدة;المدينة المنورة|24.5247|39.5692;المنطقة الشرقية|26.4207|50.0888|الدمام;تبوك|28.3838|36.555;جيزان|16.8892|42.5511;عسير|18.2164|42.5053|أبها;مكة المكرمة|21.3891|39.8579;منطقة حائل|27.5114|41.7208|حائل;نجران|17.4933|44.1277", "Asia/Riyadh"),
    "الإمارات العربية المتحدة": T("أبو ظبي|24.4539|54.3773;أم القيوين|25.5647|55.5534;الشارقة|25.3463|55.4209;الفجيرة|25.1288|56.3265;دبي|25.2048|55.2708;رأس الخيمة|25.7895|55.9432;عجمان|25.4052|55.5136", "Asia/Dubai")
  };
  /* أسماء إنجليزية للبحث (مدن/محافظات شائعة) */
  var EN = { "القاهرة": "cairo", "الجيزة": "giza", "الإسكندرية": "alexandria", "المنصورة": "mansoura", "طنطا": "tanta", "الزقازيق": "zagazig", "أسوان": "aswan", "الأقصر": "luxor", "أسيوط": "asyut assiut", "بورسعيد": "port said", "السويس": "suez", "الإسماعيلية": "ismailia", "دمياط": "damietta", "الفيوم": "fayoum faiyum", "المنيا": "minya", "سوهاج": "sohag", "قنا": "qena", "بني سويف": "beni suef", "كفر الشيخ": "kafr el sheikh", "الغردقة": "hurghada", "البحر الأحمر": "red sea", "مطروح": "matrouh marsa matruh", "جنوب سيناء": "south sinai sharm", "شمال سيناء": "north sinai arish", "الوادي الجديد": "new valley", "الشرقية": "sharqia", "الغربية": "gharbia", "الدقهلية": "dakahlia", "البحيرة": "beheira", "المنوفية": "monufia", "القليوبية": "qalyubia", "الرياض": "riyadh", "جدة": "jeddah", "مكة المكرمة": "mecca makkah", "المدينة المنورة": "medina madinah", "الدمام": "dammam", "دبي": "dubai", "أبو ظبي": "abu dhabi", "أبوظبي": "abu dhabi", "الشارقة": "sharjah", "بغداد": "baghdad", "البصرة": "basra", "أربيل": "erbil", "الموصل": "mosul", "دمشق": "damascus", "حلب": "aleppo", "بيروت": "beirut", "عمّان": "amman", "القدس": "jerusalem", "غزة": "gaza", "صنعاء": "sanaa", "عدن": "aden", "الخرطوم": "khartoum", "طرابلس": "tripoli", "بنغازي": "benghazi", "تونس": "tunis", "الجزائر": "algiers", "الدار البيضاء": "casablanca", "الرباط": "rabat", "مراكش": "marrakech", "الدوحة": "doha", "الكويت": "kuwait", "المنامة": "manama", "مسقط": "muscat", "لندن": "london", "باريس": "paris", "برلين": "berlin", "إسطنبول": "istanbul", "نيويورك": "new york", "لوس أنجلوس": "los angeles", "تورونتو": "toronto" };
  function norm(s) { return String(s || "").toLowerCase().replace(/[ً-ْـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/ؤ/g, "و").replace(/ئ/g, "ي").replace(/^(محافظه|منطقه|ولايه)\s+/, "").replace(/\s+/g, " ").trim(); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var GEO = (window.AQEEQ_GEO || []).map(function (g) { return { name: FIX[g.name] || g.name, raw: g.name, regions: g.regions }; });
  function order(a, b) { var ia = C.findIndex(function (c) { return c.ar === a.name; }), ib = C.findIndex(function (c) { return c.ar === b.name; }); if (ia < 0 && ib < 0) return 0; if (ia < 0) return 1; if (ib < 0) return -1; return ia - ib; }
  GEO = GEO.slice().sort(function (a, b) { var ka = BYAR[a.name] ? 0 : 1, kb = BYAR[b.name] ? 0 : 1; return ka !== kb ? ka - kb : (ka === 0 ? order(a, b) : a.name.localeCompare(b.name, "ar")); });

  function countryOf(name) { return BYAR[name] || BYAR[FIX[name]] || null; }

  /* يرجّع فهرس مدينة جاهز في CITIES (أو يضيفها) للدولة/المنطقة المختارة. approx=true لو الإحداثيات تقريبية. */
  function resolve(country, region) {
    var c = countryOf(country.name), cities = window.__aqCITIES();
    var rt = R[country.name] && R[country.name][region || ""];
    var hit = null, approx = false, label = region || (c && c.capAr) || country.name;
    var nr = norm(region);
    if (rt) { hit = { lat: rt.lat, lon: rt.lon, tz: rt.tz, n: rt.n }; }
    if (!hit && region) { var m = cities.find(function (x) { return norm(x.n) === nr; }); if (m && m.tz) hit = { lat: m.lat, lon: m.lon, tz: m.tz, n: m.n }; }
    if (!hit && c) { hit = { lat: c.lat, lon: c.lon, tz: c.tz, n: region || c.capAr }; approx = !!region; }
    if (!hit) return null;
    var key = hit.n + "|" + country.name;
    var idx = cities.findIndex(function (x) { return x.__gk === key; });
    if (idx < 0) {
      var exist = cities.findIndex(function (x) { return norm(x.n) === norm(hit.n) && Math.abs(x.lat - hit.lat) < 0.5 && Math.abs(x.lon - hit.lon) < 0.5 && x.tz; });
      if (exist >= 0 && !approx) return { idx: exist, approx: false };
      cities.push({ n: hit.n, lat: hit.lat, lon: hit.lon, tz: hit.tz, g: country.name, __gk: key, __gn: country.name + (region ? " — " + region : "") });
      idx = cities.length - 1;
    }
    return { idx: idx, approx: approx };
  }

  function attach(sel, opts) {
    if (!sel || sel.__geo) return; sel.__geo = 1; opts = opts || {};
    var host = document.createElement("div"); host.className = "geo-pk";
    host.innerHTML = '<div class="geo-srch"><input type="search" class="geo-q" autocomplete="off" placeholder="اكتب اسم بلدك أو محافظتك أو مدينتك"><ul class="geo-res" role="listbox" hidden></ul></div>' +
      '<div class="geo-row"><label><span>الدولة</span><select class="geo-c"></select></label><label><span>المحافظة / المنطقة</span><select class="geo-r"></select></label></div>' +
      '<small class="geo-note" aria-live="polite"></small>';
    sel.parentNode.insertBefore(host, sel); sel.style.display = "none";
    var lbl = sel.parentNode.querySelector('label[for="' + sel.id + '"]'); if (lbl) lbl.style.display = "none";
    var q = host.querySelector(".geo-q"), res = host.querySelector(".geo-res"), cs = host.querySelector(".geo-c"), rs = host.querySelector(".geo-r"), note = host.querySelector(".geo-note");
    cs.innerHTML = GEO.map(function (g, i) { return '<option value="' + i + '">' + esc(g.name) + "</option>"; }).join("");
    function fillRegions(ci, pick) {
      var g = GEO[ci]; var c = countryOf(g.name);
      var regs = g.regions.slice(); if (R[g.name]) regs = Object.keys(R[g.name]);
      var html = ""; if (c && !regs.some(function (r) { return norm(r) === norm(c.capAr); })) html += '<option value="">' + esc(c.capAr) + " (العاصمة)</option>";
      regs.forEach(function (r) { html += '<option value="' + esc(r) + '">' + esc(r) + "</option>"; });
      rs.innerHTML = html; if (pick != null) rs.value = pick; else if (c) { var cap = regs.find(function (r) { return norm(r) === norm(c.capAr) || (R[g.name] && R[g.name][r] && norm(R[g.name][r].n) === norm(c.capAr)); }); rs.value = cap != null ? cap : ""; }
    }
    function apply() {
      if (cs.value === "manual") { sel.value = "manual"; sel.dispatchEvent(new Event("change", { bubbles: true })); note.textContent = "اكتب خط العرض والطول وفرق التوقيت يدويًا."; return; }
      var g = GEO[+cs.value], r = resolve(g, rs.value || "");
      if (!r) { note.textContent = "لم نجد هذا المكان، اكتب اسم أقرب مدينة كبيرة."; return; }
      var cities = window.__aqCITIES(), ct = cities[r.idx];
      if (!sel.querySelector('option[value="' + r.idx + '"]')) { var o = document.createElement("option"); o.value = r.idx; o.textContent = ct.n; sel.appendChild(o); }
      sel.value = String(r.idx); sel.dispatchEvent(new Event("change", { bubbles: true }));
      note.textContent = "تم اختيار: " + ct.n + (g.name && norm(g.name) !== norm(ct.n) ? " — " + g.name : "");
    }
    cs.addEventListener("change", function () { if (cs.value === "manual") { rs.innerHTML = ""; apply(); return; } fillRegions(+cs.value); apply(); });
    rs.addEventListener("change", apply);
    function index() {
      var out = [];
      GEO.forEach(function (g, gi) { var c = countryOf(g.name);
        out.push({ t: g.name, sub: "دولة", k: norm(g.name) + " " + norm((c && c.en) || ""), gi: gi, r: "" });
        if (c && !(R[g.name] ? Object.keys(R[g.name]) : g.regions).some(function (r) { return norm(r) === norm(c.capAr); })) out.push({ t: c.capAr, sub: g.name + " — العاصمة", k: norm(c.capAr) + " " + norm(c.capEn) + " عاصمه " + norm(g.name) + " capital " + norm(c.en), gi: gi, r: "" });
        var regs = R[g.name] ? Object.keys(R[g.name]) : g.regions;
        regs.forEach(function (r) { var disp = R[g.name] ? R[g.name][r].n : r; out.push({ t: disp, sub: g.name + (disp !== r ? " — " + r : ""), k: norm(r) + " " + norm(disp) + " " + norm(EN[r] || "") + " " + norm(EN[disp] || ""), gi: gi, r: r }); });
      });
      (window.__aqCITIES() || []).forEach(function (ct, ci) { if (ct.__gk || !ct.n) return; out.push({ t: ct.n, sub: ct.g || "", k: norm(ct.n) + " " + norm(ct.g || ""), ci: ci }); });
      return out;
    }
    var IDX = null;
    function search() {
      var v = norm(q.value); if (v.length < 2) { res.hidden = true; return; }
      IDX = IDX || index(); var seen = {}, hits = [];
      for (var i = 0; i < IDX.length && hits.length < 12; i++) { var it = IDX[i]; if (it.k.indexOf(v) < 0) continue; var key = it.t + it.sub; if (seen[key]) continue; seen[key] = 1; hits.push(it); }
      hits.sort(function (a, b) { return (norm(a.t).indexOf(v) === 0 ? 0 : 1) - (norm(b.t).indexOf(v) === 0 ? 0 : 1); });
      res.innerHTML = hits.length ? hits.map(function (h, i) { return '<li role="option" data-i="' + i + '"><b>' + esc(h.t) + "</b><small>" + esc(h.sub) + "</small></li>"; }).join("") : '<li class="geo-none">مفيش نتيجة — جرّب اسم تاني أو اختار من القوائم</li>';
      res.__hits = hits; res.hidden = false;
    }
    q.addEventListener("input", search);
    q.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); var f = res.querySelector("li[data-i]"); if (f) f.dispatchEvent(new Event("mousedown", { bubbles: true })); } });
    res.addEventListener("mousedown", function (e) { var li = e.target.closest("li[data-i]"); if (!li) return; e.preventDefault(); var h = res.__hits[+li.dataset.i];
      if (h.ci != null) { if (!sel.querySelector('option[value="' + h.ci + '"]')) { var o2 = document.createElement("option"); o2.value = h.ci; o2.textContent = h.t; sel.appendChild(o2); } sel.value = String(h.ci); sel.dispatchEvent(new Event("change", { bubbles: true })); q.value = h.t; note.textContent = "تم اختيار: " + h.t + (h.sub ? " — " + h.sub : ""); res.hidden = true; return; }
      cs.value = String(h.gi); fillRegions(h.gi, h.r); apply(); q.value = h.t; res.hidden = true; });
    document.addEventListener("click", function (e) { if (!host.contains(e.target)) res.hidden = true; });
    sel.addEventListener("change", function () {
      var o = sel.options[sel.selectedIndex]; if (!o || sel.value === "manual") return;
      var ct = window.__aqCITIES()[+sel.value]; if (ct && document.activeElement !== q) { q.value = ct.n; note.textContent = "تم اختيار: " + ct.n + (ct.g ? " — " + ct.g : ""); }
    });
    /* افتراضي: مصر / القاهرة (أو اللي اتحفظ) */
    fillRegions(0, "القاهرة"); apply();
  }
  window.AqeeqGeoPicker = { attach: attach };
  function boot() { ["f-city", "cp1-city", "cp2-city", "y27-city", "eam-b-city"].forEach(function (id) { attach(document.getElementById(id)); }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 0); }); else setTimeout(boot, 0);
  setTimeout(boot, 1500);
})();

;
/* assets/js/page-story.js */
/* كتلة "اشرح + استثمر في ذاتك" أسفل صفحات الأدوات. عرض فقط. */
(function () {
  function ic(p) { return '<svg class="pill-i" viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>'; }
  var CFG = {
    lifepath: {
      t1: 'ما هو مسار الحياة؟', t2: 'كيف تقرأ مسارك',
      def: ['مسار الحياة رقم يُستخرج من يوم ميلادك وشهره وسنته، فيكشف الاتجاه الأكبر لرحلتك والدرس الذي جئت لتتقنه. هو أشبه ببوصلة داخلية تفسّر لماذا تميل إلى أمور وتنفر من أخرى.', 'وليس الرقم قدرًا مغلقًا، بل خريطة طريق تساعدك على قراءة مراحلك واختيار خطواتك بوعي.'],
      read: [['رقمك الحاكم', 'الرقم الذي يصف هويتك العميقة وبصمتك التي وُلدت بها.'], ['دروس وتحديات', 'المواطن التي تتكرر فيها العقبات، وما تريد أن تعلّمك إياه.'], ['دورات العمر الكبرى', 'المراحل التي تمر بها رحلتك ونقاط الانتقال بين كل مرحلة وأخرى.'], ['طريق ازدهارك', 'البيئة والعمل الأنسب لتزدهر فيها طاقتك.']],
      gold: [['افهم دورات عمرك الكبرى', 'اعرف متى تبدأ مرحلتك التالية وكيف تستعد لها', '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', '#featured-content/pinnacles-cycles'], ['اكتشف بيئة ازدهارك وعملك', 'اعرف الطريق الأنسب لطاقتك ومواهبك', '<path d="M12 21V11"/><path d="M12 11c0-4 3-6 7-6 0 4-3 6-7 6zM12 14c0-3-2.500-5-6-5 0 3 2.500 5 6 5z"/>', '#featured-content']]
    },
    chart: {
      anchor: '.seo-authority-block',
      def: ['الخريطة الفلكية صورة للسماء لحظة ولادتك: أين كانت الشمس والقمر والكواكب، وفي أي برج وأي بيت. من هذه الصورة تُقرأ طباعك، وطريقتك في الحب والعمل، وما يحرّكك من الداخل.', 'هي ليست حكمًا على حياتك، بل لغة تساعدك على فهم نفسك بوضوح أكبر، ثم اختيار خطوتك التالية بثقة.'],
      read: [['الكواكب', 'كل كوكب يمثل جانبًا فيك: العقل والعاطفة والرغبة والحدود. موقعه في البرج يحدد أسلوب تعبيره.'], ['البيوت الاثنا عشر', 'مجالات حياتك: الذات والمال والعلاقات والعمل. البيت الذي يسكنه الكوكب يخبرك أين يظهر أثره.'], ['الجوانب', 'الزوايا بين الكواكب تكشف التفاهم أو التوتر بين أجزاء شخصيتك، ومن أين تأتي قوتك ومن أين تأتي حيرتك.'], ['العناصر والطبائع', 'توزيع النار والأرض والهواء والماء يوضح مزاجك العام وما تحتاجه لتتوازن.']],
      gold: [['افهم علاقاتك وحبك من خريطتك', 'اعرف لماذا تنجذب لأشخاص بعينهم وكيف تحب', '<circle cx="12" cy="12" r="9"/><path d="M12 17s-5-3.200-5-6.600A2.800 2.800 0 0 1 12 9a2.800 2.800 0 0 1 5 1.400C17 13.800 12 17 12 17z"/>', '#featured-content/how-to-start-natal-chart'], ['اكتشف موهبتك ومسارك من خريطتك', 'اعرف ما خُلقت لتتقنه وأين تجد رزقك', '<circle cx="12" cy="12" r="9"/><path d="M12 6.500l1.600 3.400 3.700.5-2.700 2.600.7 3.700L12 14.900 8.700 16.700l.7-3.700L6.700 10.400l3.700-.5z"/>', '#featured-content/how-to-start-natal-chart']]
    }
  };
  function build(id, c) {
    var sec = document.getElementById(id); if (!sec || sec.querySelector('.aq-mx-about')) return;
    var ab = document.createElement('div'); ab.className = 'aq-mx-about';
    ab.innerHTML = '<section class="aq-mx-def"><h3><span></span>' + (c.t1||'ما هي الخريطة الفلكية؟') + '<span></span></h3>' + c.def.map(function (t) { return '<p>' + t + '</p>'; }).join('') + '</section>'
      + '<section class="aq-mx-read"><h3><span></span>' + (c.t2||'كيف تقرأ خريطتك') + '<span></span></h3><ol class="aq-mx-num">' + c.read.map(function (r, i) { return '<li><b>' + '١٢٣٤٥٦'.charAt(i) + '</b><div><strong>' + r[0] + '</strong><p>' + r[1] + '</p></div></li>'; }).join('') + '</ol></section>'
      + '<section class="aq-mx-gold"><h3><span></span>استثمر في ذاتك<span></span></h3>' + c.gold.map(function (g) { return '<a class="aq-gold" href="' + g[3] + '"><span class="aq-gold-i">' + ic(g[2]) + '</span><span class="aq-gold-t"><b>' + g[0] + '</b><small>' + g[1] + '</small></span></a>'; }).join('') + '</section>';
    var an = c.anchor && sec.querySelector(c.anchor);
    if (an) an.parentNode.insertBefore(ab, an); else sec.appendChild(ab);
  }
  function init() { Object.keys(CFG).forEach(function (k) { build(k, CFG[k]); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

;
/* assets/js/top-gap.js */
/* يقيس ارتفاع الهيدر الظاهر فعلاً ويضبط فراغ أعلى الصفحات الداخلية. عرض فقط. */
(function () {
  var r = document.documentElement;
  function set() {
    /* أثناء فتح ورقة سفلية يغطي الغطاء الهيدر فيُقرأ كأنه مخفي؛ نُبقي القيمة السابقة كي لا يقفز المحتوى */
    if (r.classList.contains('aqm-sheet-open') || document.querySelector('.aqm-sheet:not([hidden])')) return;
    var h = document.querySelector('.aqh-header'); var v = 0;
    if (h) { var b = h.getBoundingClientRect(); var cs = getComputedStyle(h); if (cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.1 && b.bottom > 4) { var hit = document.elementFromPoint(Math.max(2, window.innerWidth / 2), Math.min(b.bottom - 4, 40)); if (hit && hit.closest && hit.closest('.aqh-header')) v = Math.max(0, Math.min(120, Math.round(b.bottom))); } }
    r.style.setProperty('--aq-hdr', v + 'px');
  }
  ['resize', 'hashchange', 'scroll', 'load', 'orientationchange'].forEach(function (e) { window.addEventListener(e, set, { passive: true }); });
  document.addEventListener('DOMContentLoaded', set); set(); setInterval(set, 800);
})();

;
/* assets/js/date-selects.js */
/* منتقي تاريخ واضح (يوم / شهر / سنة) يعمل فوق حقول date الأصلية دون تغيير منطقها:
   القيمة تُكتب في الحقل الأصلي بصيغة YYYY-MM-DD ويُطلق عليه input/change. */
(function () {
  'use strict';
  var IDS = ['m-date', 'lp-date', 'f-date', 'syn-date-a', 'syn-date-b', 'eam-b-date', 'mxm-d1', 'mxm-d2', 'mxm-d3', 'mxc-d1', 'mxc-d2', 'mxk-d', 'y27-date', 'kt-date', 'iv-date'];
  var MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  function opt(v, t) { var o = document.createElement('option'); o.value = v; o.textContent = t; return o; }
  function mk(ph, cls, label) {
    var s = document.createElement('select'); s.className = cls; s.required = true; s.setAttribute('aria-label', label);
    s.appendChild(opt('', ph)); return s;
  }
  function enhance(inp) {
    if (!inp || inp.__aqds) return; inp.__aqds = true;
    var wrap = document.createElement('div'); wrap.className = 'aq-ds'; wrap.dir = 'rtl';
    var d = mk('اليوم', 'aq-ds-d', 'اليوم'), m = mk('الشهر', 'aq-ds-m', 'الشهر'), y = mk('السنة', 'aq-ds-y', 'السنة');
    for (var i = 1; i <= 31; i++) d.appendChild(opt(String(i), String(i)));
    MONTHS.forEach(function (n, i) { m.appendChild(opt(String(i + 1), n)); });
    var now = new Date().getFullYear();
    for (var yy = now; yy >= 1900; yy--) y.appendChild(opt(String(yy), String(yy)));
    wrap.appendChild(d); wrap.appendChild(m); wrap.appendChild(y);
    inp.parentNode.insertBefore(wrap, inp.nextSibling);
    inp.classList.add('aq-ds-src');
    var last = '';
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function fromSelects() {
      var dv = +d.value, mv = +m.value, yv = +y.value;
      if (mv && yv) { var max = new Date(yv, mv, 0).getDate(); if (dv > max) { dv = max; d.value = String(max); } }
      var v = (dv && mv && yv) ? (yv + '-' + pad(mv) + '-' + pad(dv)) : '';
      last = v;
      if (inp.value !== v) { inp.value = v; inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true })); }
    }
    function toSelects() {
      var v = inp.value; if (v === last) return; last = v;
      var p = /^(\d{4})-(\d{2})-(\d{2})/.exec(v || '');
      if (p) { y.value = String(+p[1]); m.value = String(+p[2]); d.value = String(+p[3]); } else { y.value = ''; m.value = ''; d.value = ''; }
    }
    [d, m, y].forEach(function (s) { s.addEventListener('change', fromSelects); });
    inp.addEventListener('change', toSelects);
    toSelects(); setInterval(toSelects, 400);
  }
  /* موسّع: يشمل أي حقل تاريخ/ساعة آخر في الموقع بنفس الأسلوب (يوم / شهر / سنة — ساعة / دقيقة / ص م) */
  function mkx(ph, cls, label, req) {
    var s = document.createElement('select'); s.className = cls; s.required = !!req; s.setAttribute('aria-label', label);
    s.appendChild(opt('', ph)); return s;
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function enhanceDate(inp) {
    if (!inp || inp.__aqds) return; inp.__aqds = true;
    var wrap = document.createElement('div'); wrap.className = 'aq-dsx aq-dsx-date'; wrap.dir = 'rtl';
    var d = mkx('اليوم', 'aq-dsx-d', 'اليوم', inp.required), m = mkx('الشهر', 'aq-dsx-m', 'الشهر', inp.required), y = mkx('السنة', 'aq-dsx-y', 'السنة', inp.required);
    for (var i = 1; i <= 31; i++) d.appendChild(opt(String(i), String(i)));
    MONTHS.forEach(function (n, i) { m.appendChild(opt(String(i + 1), n)); });
    var now = new Date().getFullYear();
    for (var yy = now; yy >= 1900; yy--) y.appendChild(opt(String(yy), String(yy)));
    wrap.appendChild(d); wrap.appendChild(m); wrap.appendChild(y);
    inp.parentNode.insertBefore(wrap, inp.nextSibling);
    inp.classList.add('aq-dsx-src');
    var last = null;
    function fromSel() {
      var dv = +d.value, mv = +m.value, yv = +y.value;
      if (mv && yv) { var max = new Date(yv, mv, 0).getDate(); if (dv > max) { dv = max; d.value = String(max); } }
      var v = (dv && mv && yv) ? (yv + '-' + pad2(mv) + '-' + pad2(dv)) : '';
      last = v;
      if (inp.value !== v) { inp.value = v; inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true })); }
    }
    function toSel() {
      var v = inp.value; if (v === last) return; last = v;
      var p = /^(\d{4})-(\d{2})-(\d{2})/.exec(v || '');
      if (p) { y.value = String(+p[1]); m.value = String(+p[2]); d.value = String(+p[3]); } else { y.value = ''; m.value = ''; d.value = ''; }
    }
    [d, m, y].forEach(function (x) { x.addEventListener('change', fromSel); });
    inp.addEventListener('change', toSel);
    toSel(); setInterval(toSel, 500);
  }
  function enhanceTime(inp) {
    if (!inp || inp.__aqds) return; inp.__aqds = true;
    var wrap = document.createElement('div'); wrap.className = 'aq-dsx aq-dsx-time' + (inp.closest && inp.closest('#chart,#matrix,#lifepath,#year2027,#karmic') ? ' aq-ds' : ''); wrap.dir = 'rtl';
    var h = mkx('ساعة', 'aq-dsx-h', 'الساعة', inp.required), mi = mkx('دقيقة', 'aq-dsx-mi', 'الدقيقة', false), ap = mkx('ص / م', 'aq-dsx-ap', 'صباحًا أو مساءً', inp.required);
    for (var i = 1; i <= 12; i++) h.appendChild(opt(String(i), String(i)));
    for (var j = 0; j < 60; j++) mi.appendChild(opt(String(j), pad2(j)));
    ap.appendChild(opt('am', 'صباحًا')); ap.appendChild(opt('pm', 'مساءً'));
    wrap.appendChild(h); wrap.appendChild(mi); wrap.appendChild(ap);
    inp.parentNode.insertBefore(wrap, inp.nextSibling);
    inp.classList.add('aq-dsx-src');
    var last = null;
    function fromSel() {
      var hv = +h.value, mv = +mi.value || 0, av = ap.value, v = '';
      if (hv && av) { var h24 = hv % 12 + (av === 'pm' ? 12 : 0); v = pad2(h24) + ':' + pad2(mv); }
      last = v;
      if (inp.value !== v) { inp.value = v; inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true })); }
    }
    function toSel() {
      var v = inp.value; if (v === last) return; last = v;
      var p = /^(\d{1,2}):(\d{2})/.exec(v || '');
      if (p) { var hh = +p[1]; ap.value = hh >= 12 ? 'pm' : 'am'; h.value = String(hh % 12 === 0 ? 12 : hh % 12); mi.value = String(+p[2]); } else { h.value = ''; mi.value = ''; ap.value = ''; }
    }
    [h, mi, ap].forEach(function (x) { x.addEventListener('change', fromSel); });
    inp.addEventListener('change', toSel);
    toSel(); setInterval(toSel, 500);
  }
  function runAll() {
    IDS.forEach(function (id) { enhance(document.getElementById(id)); });
    var ds = document.querySelectorAll('input[type="date"]');
    for (var i = 0; i < ds.length; i++) { if (!ds[i].__aqds && IDS.indexOf(ds[i].id) < 0 && ds[i].id !== 'sky-date') enhanceDate(ds[i]); }
    var ts = document.querySelectorAll('input[type="time"]');
    for (var k = 0; k < ts.length; k++) { if (!ts[k].__aqds && ts[k].id !== 'sky-time') enhanceTime(ts[k]); }
  }
  function run() {
    runAll();
    var t = null;
    if (window.MutationObserver) new MutationObserver(function () { clearTimeout(t); t = setTimeout(runAll, 250); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  setTimeout(run, 1200);
})();

;
/* assets/js/hero-live.js */
/* لوحة المواقع الحية بجانب الخريطة. قراءة فقط من نفس محرك السماء. */
(function () {
  'use strict';
  var rowsEl = document.getElementById('hv-rows'), dotsEl = document.getElementById('hv-dots'), live = document.getElementById('hv-live');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EVERY = 180000;

  /* ---------- لوحة المواقع الحية ---------- */
  if (!rowsEl || !live) return;
  var H = null, sets = [], si = 0, focusKey = '', timer = null, user = false;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function build() {
    H = window.__aqhHero; if (!H) return false;
    var d; try { d = H.sky(); } catch (e) { return false; }
    var items = {};
    H.planets.forEach(function (p) { var b = d[p.key]; if (b) items[p.key] = { p: p, b: b }; });
    var retro = Object.keys(items).filter(function (k) { return items[k].b.retro && k !== 'sun' && k !== 'moon'; });
    var first = ['moon', 'sun'].filter(function (k) { return items[k]; });
    first.push(retro[0] || 'mercury');
    var rest = Object.keys(items).filter(function (k) { return first.indexOf(k) < 0; });
    var order = rest.slice(); sets = [first.filter(function (k) { return items[k]; })];
    for (var i = 0; i < order.length; i += 3) { var c = order.slice(i, i + 3); while (c.length < 3) c.push(first[c.length % first.length]); sets.push(c); }
    sets.items = items; return true;
  }
  function rowHTML(k) {
    var it = sets.items[k]; if (!it) return '';
    var p = it.p, b = it.b;
    return '<li><button type="button" class="hv-row' + (b.retro ? ' is-retro' : '') + (focusKey === k ? ' is-on' : '') + '" data-k="' + k + '" aria-pressed="' + (focusKey === k) + '"><span class="hv-sym" aria-hidden="true">' + p.sym + '</span><span class="hv-txt"><b>' + esc(p.ar) + '</b><small>في ' + esc(H.signs[b.sign]) + ' · ' + b.deg + '°</small></span><span class="hv-state">' + (b.retro ? '<em>R</em> متراجع' : 'مباشر') + '</span></button></li>';
  }
  function paint(animate) {
    var done = function () {
      rowsEl.innerHTML = sets[si].map(rowHTML).join('');
      dotsEl.innerHTML = sets.map(function (_, k) { return '<i class="' + (k === si ? 'on' : '') + '"></i>'; }).join('');
      rowsEl.classList.remove('hv-out'); if (animate && !reduce) { rowsEl.classList.add('hv-in'); setTimeout(function () { rowsEl.classList.remove('hv-in'); }, 480); }
    };
    if (animate && !reduce) { rowsEl.classList.add('hv-out'); setTimeout(done, 300); } else done();
  }
  function go(n, byUser) { si = (n + sets.length) % sets.length; if (byUser) user = true; if (focusKey && sets[si].indexOf(focusKey) < 0) { focusKey = ''; H.focus(''); } paint(true); schedule(); }
  function schedule() { clearTimeout(timer); timer = setTimeout(function () { if (!document.hidden && !user && !focusKey && document.getElementById('home').getClientRects().length) go(si + 1, false); else schedule(); user = false; }, EVERY); }
  rowsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.hv-row'); if (!b) return; var k = b.getAttribute('data-k');
    focusKey = focusKey === k ? '' : k; H.focus(focusKey); paint(false);
  });
  live.addEventListener('click', function (e) { var a = e.target.closest('[data-hv]'); if (!a) return; go(si + (a.getAttribute('data-hv') === 'next' ? 1 : -1), true); });
  var sx = null;
  rowsEl.addEventListener('pointerdown', function (e) { sx = e.clientX; });
  rowsEl.addEventListener('pointerup', function (e) { if (sx === null) return; var dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50) go(si + (dx < 0 ? 1 : -1), true); });
  function init(tries) {
    if (build()) { paint(false); schedule(); setInterval(function () { if (document.hidden) return; var k = sets[si]; if (build()) { si = Math.min(si, sets.length - 1); paint(false); } }, 60000); }
    else if (tries < 20) setTimeout(function () { init(tries + 1); }, 300);
  }
  if (document.readyState === 'complete') init(0); else window.addEventListener('load', function () { init(0); });
})();

;
/* assets/js/hero-rotate.js */
/* تبديل نصوص (وصور اختيارية) البانر العلوي: كل 3 دقائق، وبداية مختلفة عند كل تحديث للصفحة */
(function () {
  'use strict';
  var EVERY = 180000;
  /* لإضافة صورة جديدة لأي شريحة: ضع الملف في assets/images/home/ وأضف الحقل img (مثال: img: 'assets/images/home/hero-2.jpg', pos: '70% 30%') */
  var SLIDES = [
    { eye: 'أكثر من توقعات .. رحلة إلى ذاتك', h: 'اكتشف خريطتك الداخلية', p: 'في AQEQ ASTRO نؤمن أن علم الفلك ليس مجرد معرفة بالمستقبل، بل هو أداة عميقة لفهم نفسك، واكتشاف إمكانياتك، والعيش بانسجام أكبر.', cta: 'ابدأ رحلتك', href: '#chart', img: 'assets/images/home/hero-bust.jpg', pos: '40% 40%', hs: '18vw' },
    { eye: 'AQEQ ASTRO', h: 'كل إجابة تبدأ بسؤال', p: 'في عقيق نؤمن أن الأسئلة الصادقة تقود إلى حياة أعمق. اكتشف ذاتك من خلال علم الفلك والأرقام والرموز.', cta: 'اكتشف الآن', href: '#sky', img: 'assets/images/home/hero-bust.jpg', pos: '40% 40%', hs: '18vw' },
    { eye: 'رحلة أعمق نحو ذاتك', h: 'خريطتك الداخلية تستحق أن تُقرأ', p: 'لكل إنسان كون فريد من الرموز والدلالات. نساعدك على فهم خريطتك الداخلية واكتشاف المعاني الخفية في رحلتك الحياتية.', cta: 'ابدأ القراءة', href: '#chart', img: 'assets/images/home/hero-bust.jpg', pos: '40% 40%', hs: '18vw' },
    { eye: 'من الرموز إلى الوضوح', h: 'المعرفة تبدأ من الداخل', p: 'رحلة وعي عميقة تجمع بين علم الفلك والرموز القديمة لمساعدتك على فهم ذاتك وعلاقاتك وإمكاناتك الحقيقية.', cta: 'ابدأ رحلتك الآن', href: '#chart', img: 'assets/images/home/hero-bust.jpg', pos: '40% 40%', hs: '18vw' },
    { eye: 'السماء مرآة لداخلك', h: 'رموز تساعدك على رؤية أوسع', p: 'اكتشف ذاتك من خلال علم الرموز والفلك، وأعد اكتشاف احتمالاتك.', cta: 'اكتشف المنصة', href: '#sky', img: 'assets/images/home/hero-bust.jpg', pos: '40% 40%', hs: '18vw' }
  ];
  /* تثبيت البانر على شريحة «ابدأ رحلتك» بقرار التصميم: لا تبديل تلقائي ولا بداية عشوائية */
  return;
  var copy = document.getElementById('home-intro');
  if (!copy) return;
  var eye = copy.querySelector('.aqh-eyebrow'), h = copy.querySelector('.aqh-title'), p = copy.querySelector('.aqh-lead'),
      cta = copy.querySelector('.aqh-cta'), ctaT = cta && cta.querySelector('span'), img = document.querySelector('.hw-statue');
  if (!eye || !h || !p || !cta) return;
  var baseImg = img ? img.getAttribute('src') : '', basePos = img ? img.style.objectPosition : '', hero = document.querySelector('.aqh-hero');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = 0, timer = null;
  function pick() {
    var q = /[?&]hero=(\d+)/.exec(location.search); if (q && SLIDES[+q[1]]) return +q[1];
    var last = -1; try { last = parseInt(localStorage.getItem('aqh-hero-last'), 10); } catch (e) {}
    var n; do { n = Math.floor(Math.random() * SLIDES.length); } while (SLIDES.length > 1 && n === last);
    try { localStorage.setItem('aqh-hero-last', String(n)); } catch (e) {}
    return n;
  }
  function setT(el, t) { el.textContent = t; if (el.hasAttribute('data-i18n-ar')) { el.setAttribute('data-i18n-ar', t); el.setAttribute('data-i18n-en', t); } }
  function apply(i) {
    var s = SLIDES[i]; cur = i;
    setT(eye, s.eye); setT(h, s.h); setT(p, s.p);
    if (ctaT) { ctaT.textContent = s.cta; } cta.setAttribute('href', s.href);
    if (cta.hasAttribute('data-i18n-ar')) { cta.setAttribute('data-i18n-ar', s.cta); cta.setAttribute('data-i18n-en', s.cta); }
    if (img) { img.setAttribute('src', s.img || baseImg); img.style.objectPosition = s.pos || basePos; }
    if (hero) hero.style.setProperty('--hs', s.hs || '0px');
  }
  function go(i) {
    if (reduce) { apply(i); return; }
    var els = [eye, h, p, cta, img].filter(Boolean);
    els.forEach(function (e) { e.style.transition = 'opacity .45s ease, transform .45s ease'; e.style.opacity = '0'; e.style.transform = 'translateY(8px)'; });
    setTimeout(function () {
      apply(i);
      els.forEach(function (e) { e.style.opacity = '1'; e.style.transform = 'none'; });
      setTimeout(function () { els.forEach(function (e) { e.style.transition = ''; e.style.transform = ''; e.style.opacity = ''; }); }, 500);
    }, 460);
  }
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      var home = document.getElementById('home');
      if (!document.hidden && home && home.getClientRects().length) go((cur + 1) % SLIDES.length);
      schedule();
    }, EVERY);
  }
  var start = pick(); apply(start);
  schedule();
})();

;
/* assets/js/nav-unified.js */
/* AQEQ ASTRO — سلوك التنقل الموحد (واجهة فقط، لا يمس التوجيه ولا المحركات) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var DISCOVER = ['#chart', '#matrix', '#lifepath', '#sky', '#astro-maps', '#signs'];
  var ALIAS = { '#life-path-synastry': '#lifepath', '#lifepath-compat': '#lifepath', '#matrix-compat': '#matrix', '#matrix-child': '#matrix', '': '#home' };

  function lock() { root.classList.toggle('aqn-lock', !!($('#aqn-sheet.is-open') || ($('#aqh-menu') && !$('#aqh-menu').hidden))); }
  function fadeIn(scrim) { scrim.hidden = false; requestAnimationFrame(function () { requestAnimationFrame(function () { scrim.classList.add('is-open'); }); }); }
  function fadeOut(scrim) { scrim.classList.remove('is-open'); setTimeout(function () { if (!scrim.classList.contains('is-open')) scrim.hidden = true; }, 260); }
  function trap(box, e) {
    if (e.key !== 'Tab') return;
    var f = $$('a[href],button:not([disabled])', box).filter(function (n) { return n.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---- القائمة الجانبية (يفتحها زر الهامبرغر الموجود، ونراقب حالتها) ---- */
  var menu = $('#aqh-menu'), burger = $('#aqh-burger'), dScrim = $('#aqn-drawer-scrim');
  if (menu && burger && dScrim) {
    new MutationObserver(function () {
      if (menu.hidden) { fadeOut(dScrim); } else { fadeIn(dScrim); setTimeout(function () { var a = $('.aqn-dr-body a', menu); if (a) a.focus({ preventScrolling: true }); }, 60); }
      lock();
    }).observe(menu, { attributes: true, attributeFilter: ['hidden'] });
    var closeDrawer = function () { if (!menu.hidden) burger.click(); };
    dScrim.addEventListener('click', closeDrawer);
    $('[data-aqn-close]', menu).addEventListener('click', closeDrawer);
    menu.addEventListener('keydown', function (e) { trap(menu, e); });
    var sb = $('[data-aqn-search]', menu), hs = $('[data-aqh-search]');
    if (sb && hs) sb.addEventListener('click', function () { closeDrawer(); setTimeout(function () { hs.click(); }, 280); });
    /* أقسام منسدلة: قسم واحد مفتوح، ويُفتح تلقائيًا القسم الذي فيه الصفحة الحالية */
    var accs = $$('.aqn-acc', menu);
    var setAcc = function (acc, open) {
      var b = $('.aqn-acc-btn', acc), p = $('.aqn-acc-panel', acc);
      b.setAttribute('aria-expanded', open ? 'true' : 'false'); p.hidden = !open;
    };
    accs.forEach(function (acc) {
      $('.aqn-acc-btn', acc).addEventListener('click', function () {
        var willOpen = $('.aqn-acc-panel', acc).hidden;
        accs.forEach(function (o) { setAcc(o, o === acc && willOpen); });
      });
    });
    var autoOpen = function () {
      var cur = null;
      accs.forEach(function (acc) { var on = !!$('a.on', acc); acc.classList.toggle('has-on', on); if (on) cur = acc; });
      accs.forEach(function (o) { setAcc(o, o === cur); });
    };
    new MutationObserver(function () { if (!menu.hidden) autoOpen(); }).observe(menu, { attributes: true, attributeFilter: ['hidden'] });
    var lb = $('[data-aqn-lang]', menu), lt = $('#aq-lang-toggle');
    if (lb && lt) lb.addEventListener('click', function () { lt.click(); });
  }

  /* ---- ورقة اكتشف ذاتك ---- */
  var btn = $('#aqn-discover-btn'), sheet = $('#aqn-sheet'), sScrim = $('#aqn-scrim');
  function setSheet(v) {
    if (!btn || !sheet) return;
    btn.setAttribute('aria-expanded', v ? 'true' : 'false');
    if (v) { sheet.hidden = false; sheet.removeAttribute('hidden'); void sheet.offsetWidth; sheet.classList.add('is-open'); fadeIn(sScrim); setTimeout(function () { var a = $('a', sheet); if (a) a.focus({ preventScroll: true }); }, 80); }
    else { sheet.classList.remove('is-open'); fadeOut(sScrim); setTimeout(function () { if (!sheet.classList.contains('is-open')) sheet.hidden = true; }, 320); }
    lock();
  }
  if (btn && sheet && sScrim) {
    btn.addEventListener('click', function () { setSheet(!sheet.classList.contains('is-open')); });
    sScrim.addEventListener('click', function () { setSheet(false); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setSheet(false); });
    sheet.addEventListener('keydown', function (e) { trap(sheet, e); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sheet && sheet.classList.contains('is-open')) { setSheet(false); btn.focus(); }
  });
  window.addEventListener('hashchange', function () { if (sheet && sheet.classList.contains('is-open')) setSheet(false); });
  window.matchMedia('(min-width:1100px)').addEventListener('change', function (m) { if (m.matches) { setSheet(false); if (menu && !menu.hidden) burger.click(); } });

  /* ---- حالة الرابط النشط (الشريط السفلي + القائمة + الهيدر) ---- */
  function norm() { var h = location.hash || '#home'; return ALIAS[h] || h; }
  function sync() {
    var h = norm(), inDiscover = DISCOVER.indexOf(h) > -1;
    $$('.bnav .bnav-item').forEach(function (el) {
      var hr = el.getAttribute('href'), on = el.id === 'aqn-discover-btn' ? inDiscover : hr === '#featured-content' ? h.indexOf('#featured-content') === 0 : el.getAttribute('data-we') ? (h === '#for-you' && !!window.__aqWeOn) : hr === h;
      el.classList.toggle('on', on);
      if (on) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
    });
    $$('.aqn-dr-body a, .aqn-grid a, .aqh-drop-menu a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === h); });
    var db = $('.aqh-drop-btn'); if (db) db.classList.toggle('is-current', inDiscover || h === '#compat' || h === '#tarot-chamber');
    $$('.aqh-nav>a').forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === h); });
  }
  window.addEventListener('hashchange', function () { setTimeout(sync, 0); });
  sync(); setTimeout(sync, 400);
})();

/* قسم التاروت مخفي مؤقتاً: أي رابط قديم له يرجّع للرئيسية بدل صفحة فاضية. */
(function () {
  function guard() { if (location.hash === '#tarot-chamber') location.replace('#home'); }
  window.addEventListener('hashchange', guard); guard();
})();

/* موضع تجويف التبويب النشط في الشريط السفلي: يُحسب من مركز الزر النشط */
(function () {
  var nav = document.getElementById('aqn-bnav'); if (!nav) return;
  function place() {
    var on = nav.querySelector('.bnav-item.on'), r = nav.getBoundingClientRect();
    if (!on || !r.width || getComputedStyle(on).display === 'none') { nav.style.setProperty('--aqn-x', '-200px'); return; }
    var b = on.getBoundingClientRect();
    nav.style.setProperty('--aqn-x', (b.left + b.width / 2 - r.left) + 'px');
  }
  var mo = new MutationObserver(function () { requestAnimationFrame(place); });
  mo.observe(nav, { attributes: true, attributeFilter: ['class', 'style', 'hidden'], subtree: true, childList: true });
  window.addEventListener('resize', place); window.addEventListener('hashchange', function () { setTimeout(place, 30); });
  place(); setTimeout(place, 300); setTimeout(place, 1200);
})();

;
/* assets/js/page-unify.js */
/* توحيد شريط التنقل العلوي (رجوع + الرئيسية + أيقونات التبويبات) وكتلة "تابع من هنا" أسفل كل صفحة. عرض فقط. */
(function () {
  'use strict';
  var navCount = 0; window.addEventListener('hashchange', function () { navCount++; });
  function ic(p) { return '<svg class="pill-i" viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>'; }
  var I = {
    chart: '<ellipse cx="12" cy="12" rx="9" ry="4.6" transform="rotate(-28 12 12)"/><circle cx="12" cy="12" r="2.2"/>',
    maps: '<path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.500l-6 2.500-6-2.500-6 2.500z"/><path d="M9 4v13.500M15 6.500V20"/>',
    sky: '<circle cx="12" cy="12" r="4"/><path d="M12 2.500v3M12 18.500v3M2.500 12h3M18.500 12h3M5.300 5.300l2.100 2.100M16.600 16.600l2.100 2.100M5.300 18.700l2.100-2.100M16.600 7.400l2.100-2.100"/>',
    foryou: '<path d="M12 3l2.200 5.600L20 9.500l-4.400 3.900L17 19l-5-3-5 3 1.400-5.600L4 9.500l5.800-.9z"/>',
    compat: '<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>',
    lpcompat: '<path d="M4 19c4 0 3-5 8-5s4-5 8-5"/><circle cx="4" cy="19" r="1.400"/><circle cx="20" cy="9" r="1.400"/><path d="M4 5c4 0 3 5 8 5"/>',
    lifepath: '<path d="M5 20C5 11 11 6 19 5c0 8-4 14-14 15zM5 20l9-9"/>',
    matrix: '<path d="M12 3l9 9-9 9-9-9z"/><path d="M12 8l4 4-4 4-4-4z"/>',
    signs: '<circle cx="12" cy="12" r="9"/><path d="M7 4.500C8 9 8 15 7 19.500M17 4.500C16 9 16 15 17 19.500M5 9.500c4.500 1.200 9.500 1.200 14 0M5 14.500c4.500-1.200 9.500-1.200 14 0"/>',
    world: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    home: '<path d="M4 11l8-7 8 7v8.500a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M10 20.500V14h4v6.500"/>',
    back: '<path d="M9 5l7 7-7 7"/>',
    read: '<path d="M4 5.500C6.500 4.500 9.500 4.500 12 6c2.500-1.500 5.500-1.500 8-.5V19c-2.500-1-5.500-1-8 .5-2.500-1.500-5.500-1.500-8-.5z"/><path d="M12 6v13.500"/>',
    indiv: '<circle cx="12" cy="8" r="4"/><path d="M4.500 20.500a7.500 7.500 0 0 1 15 0"/>'
  };
  var BYHREF = { '#chart': I.chart, '#astro-maps': I.maps, '#sky': I.sky, '#for-you': I.foryou, '#compat': I.compat, '#lifepath-compat': I.lpcompat, '#matrix-compat': I.compat, '#matrix-child': I.matrix, '#lifepath': I.lifepath, '#matrix': I.matrix, '#signs': I.signs, '#world': I.world };
  function topbars() {
    [].forEach.call(document.querySelectorAll('.aq-section-topbar'), function (bar) {
      if (bar.getAttribute('data-unified')) return; bar.setAttribute('data-unified', '1');
      [].forEach.call(bar.querySelectorAll('.aq-section-pill'), function (a) {
        a.setAttribute('title', a.textContent.trim()); a.setAttribute('aria-label', a.textContent.trim());
        if (a.querySelector('svg')) { var s = a.querySelector('svg'); s.classList.add('pill-i'); s.removeAttribute('width'); s.removeAttribute('height'); return; }
        var p = BYHREF[a.getAttribute('href')]; if (p) a.insertAdjacentHTML('afterbegin', ic(p));
      });
      var old = bar.querySelector('.aq-back-home-btn'); if (old) old.remove();
      var ctxSec = bar.closest('#lifepath,#lifepath-compat,#relationships,#matrix,#matrix-compat,#matrix-child,#sky,#signs');
      if (ctxSec) {
        bar.classList.add('aq-ctxbar');
        var arrow = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
        var diag = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>';
        var CX = {
          'lifepath': ['مسار الحياة', '#lifepath-compat', 'احسب توافقك مع شريكك'],
          'lifepath-compat': ['توافق مسار الحياة', '#lifepath', 'اكتشف مسارك الفردي'],
          'relationships': ['التوافق', '', ''],
          'matrix': ['مصفوفة القدر', '#matrix-compat', 'توافق مصفوفة القدر'],
          'matrix-compat': ['توافق مصفوفة القدر', '#matrix', 'مصفوفة القدر الفردية'],
          'matrix-child': ['مصفوفة الطفل', '#matrix', 'مصفوفة القدر الفردية'],
          'sky': ['السماء الآن', '#signs', 'توقعات الأبراج'],
          'signs': ['توقعات الأبراج', '#sky', 'السماء الآن']
        }[ctxSec.id];
        bar.innerHTML = '<button type="button" class="aq-ctx-back" data-aq-back aria-label="رجوع">' + arrow + '<span>رجوع</span></button><span class="aq-ctx-title">' + CX[0] + '</span>' +
          (CX[1] ? '<a class="aq-ctx-x" href="' + CX[1] + '"><span>' + CX[2] + '</span>' + diag + '</a>' : '') +
          (/^(sky|signs)$/.test(ctxSec.id) ? '<a class="aq-ctx-home" href="#home" aria-label="الرئيسية" title="الرئيسية"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11 12 4l8 7"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/></svg><span>الرئيسية</span></a>' : '');
        return;
      }
      var box = document.createElement('div'); box.className = 'aq-nav-actions';
      box.innerHTML = '<button type="button" class="aq-nav-btn" data-aq-back>' + ic(I.back) + '<span>رجوع</span></button>' +
        '<a href="#home" class="aq-nav-btn is-home">' + ic(I.home) + '<span>الرئيسية</span></a>';
      bar.insertBefore(box, bar.firstChild);
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-aq-back]'); if (!b) return;
    e.preventDefault();
    /* نتيجة معروضة: الرجوع يفتح النموذج ببياناته. نموذج: رجوع للصفحة السابقة فعلًا. */
    var sc = b.closest('section'), id = sc && sc.id, ed = null;
    if (id === 'lifepath-compat') { var o = document.getElementById('syn-result'); if (o && !o.hidden && o.querySelector('.cph')) ed = o.querySelector('[data-cph="edit"]'); }
    else if (id === 'lifepath' && document.documentElement.classList.contains('lpr-on')) ed = sc.querySelector('.lpr-head [data-lph="edit"]');
    else if (id === 'matrix') { var mr = document.getElementById('mresult'); if (mr && !mr.hidden) ed = document.getElementById('aqm-btn-edit'); }
    else if (id === 'matrix-compat' || id === 'matrix-child') {
      var out = document.getElementById(id === 'matrix-compat' ? 'mxc-result' : 'mxk-result');
      if (out && !out.hidden) {
        var fm = document.getElementById(id === 'matrix-compat' ? 'mxc-form' : 'mxk-form'), ex = document.getElementById(id === 'matrix-compat' ? 'mxc-explain' : 'mxk-explain'), hd = sc.querySelector('.lpx-head');
        if (fm) fm.hidden = false; if (ex) ex.hidden = false; if (hd) hd.hidden = false; out.hidden = true;
        window.scrollTo(0, 0); sc.scrollTop = 0; return;
      }
    }
    /* السماء: من تفاصيل برج يرجع لكل الأبراج، ومن الخريطة العالمية يرجع للسماء لو مفيش صفحة سابقة */
    if (id === 'signs' && sc.classList.contains('signs-detail')) { var sb = document.getElementById('signs-back'); if (sb) { sb.click(); return; } }
    if (ed) { ed.click(); return; }
    if (navCount > 0) history.back(); else location.hash = '#home';
  });
  /* روابط ختامية لكل صفحة: أدوات مرتبطة + مقال/قراءة */
  var REL = {
    matrix: [['#lifepath', I.lifepath, 'مسار الحياة', 'مراحل رحلتك وقممك الأربع'], ['#chart', I.chart, 'الخريطة الفلكية', 'مواضع الكواكب لحظة ميلادك'], ['#featured-content/matrix-22-arcana', I.read, 'اقرأ عن المصفوفة', 'هندسة الـ22 أركانًا'], ['#featured-content', I.read, 'المحتوى المميز', 'مقالات تعمّق فهمك لنفسك']],
    lifepath: [['#matrix', I.matrix, 'مصفوفة القدر', 'خريطتك الرقمية الهندسية'], ['#lifepath-compat', I.lpcompat, 'توافق المسارات', 'قراءة الشراكات بين رقمين'], ['#featured-content/pinnacles-cycles', I.read, 'اقرأ عن القمم والدورات', 'من المحتوى المميز']],
    chart: [['#matrix', I.matrix, 'مصفوفة القدر', 'الأنماط والطاقات في ميلادك'], ['#astro-maps', I.maps, 'خرائط متقدمة', 'العودة الشمسية والعبور'], ['#featured-content/how-to-start-natal-chart', I.read, 'كيف تبدأ قراءة خريطتك', 'دليل مبسّط']],
    compat: [['#lifepath-compat', I.lpcompat, 'توافق المسارات', 'قراءة الشراكات القدرية'], ['#chart', I.chart, 'خريطتك الفلكية', 'ابدأ بخريطتك أنت'], ['#featured-content/venus-in-chart', I.read, 'اقرأ عن لغة العلاقات', 'ماذا تقول الزهرة عنك']],
    sky: [['#featured-content/how-to-read-the-sky', I.read, 'كيف تقرأ السماء', 'دعوة للتأمل']],
    signs: [['#sky', I.sky, 'السماء الآن', 'مواضع الكواكب الحقيقية'], ['#chart', I.chart, 'خريطتك الفلكية', 'برجك الشمسي والقمري والطالع'], ['#featured-content/natal-trinity', I.read, 'الثالوث الأساسي', 'الشمس والقمر والطالع']],
    'astro-maps': [['#sky', I.sky, 'السماء الآن', 'حركة الكواكب الحية'], ['#chart', I.chart, 'خريطة الميلاد', 'الأساس لكل الخرائط'], ['#featured-content/understanding-transits', I.read, 'كيف تفهم العبور', 'بهدوء ودون مبالغة']],
    'for-you': [['#chart', I.chart, 'خريطتك الفلكية', 'ابدأ منها'], ['#sky', I.sky, 'السماء الآن', 'ما يجري فوقك'], ['#featured-content/moon-phases', I.read, 'إيقاع القمر', 'مقال من المحتوى المميز']],
    individual: [['#featured-content', I.read, 'المحتوى المميز', 'مقالات تشرح كل أداة'], ['#relationships', I.compat, 'التوافق', 'خرائط العلاقات'], ['#sky', I.sky, 'السماء الآن', 'مواضع الكواكب الحقيقية']],
    relationships: [['#featured-content', I.read, 'المحتوى المميز', 'مقالات تشرح كل أداة'], ['#individual', I.indiv, 'خرائطك الشخصية', 'خريطتك الفلكية والقدرية'], ['#featured-content/venus-in-chart', I.read, 'لغة العلاقات', 'ماذا تقول الزهرة عنك']]
  };
  function related() {
    Object.keys(REL).forEach(function (id) {
      var sec = document.getElementById(id); if (!sec) return; if (id === 'matrix' || id === 'chart' || id === 'lifepath') { var old = sec.querySelector('.aq-related'); if (old) old.remove(); } else if (sec.querySelector('.aq-related')) return;
      var box = document.createElement('nav'); var T = id === 'matrix' ? 'تابع رحلتك' : 'تابع من هنا';
      box.className = 'aq-related'; box.setAttribute('aria-label', T);
      box.innerHTML = '<h3><span></span>' + T + '<span></span></h3><div class="aq-rel-grid">' + REL[id].filter(function (r) { return r[0] !== '#astro-maps'; }).map(function (r) {
        return '<a class="aq-rel" href="' + r[0] + '"><span class="aq-rel-i">' + ic(r[1]) + '</span><span class="aq-rel-t"><b>' + r[2] + '</b><small>' + r[3] + '</small></span></a>';
      }).join('') + '</div>' ;
      if (id === 'matrix' && !sec.querySelector('.aq-mx-about')) {
        var ab = document.createElement('div'); ab.className = 'aq-mx-about';
        ab.innerHTML = '<section class="aq-mx-def"><h3><span></span>ما هي مصفوفة القدر؟<span></span></h3><p>مصفوفة القدر خريطة هندسية تُبنى من يوم ميلادك وشهره وسنته، فتتحول الأرقام إلى ثماني نقاط كبرى تحيط بمركز واحد. كل نقطة تحمل طاقة من الاثنتين والعشرين طاقة، وتحكي جانبًا من حياتك: من أنت في الداخل، وكيف تحب، وكيف تكسب، وأين تتعثر.</p><p>هي ليست تنبؤًا بالمستقبل، بل مرآة تريك الأنماط التي تتكرر معك والمواهب التي لم تستخدمها بعد، لتفهم نفسك أولًا ثم تختار خطوتك بوعي.</p></section>'
          + '<section class="aq-mx-read"><h3><span></span>كيف تقرأ مصفوفتك<span></span></h3><ol class="aq-mx-num"><li><b>١</b><div><strong>الجوهر</strong><p>النقطة المركزية في الخريطة، وهي من أنت حين تخلع الأدوار، والطاقة التي تعود إليها كلما ضللت طريقك.</p></div></li><li><b>٢</b><div><strong>المحاور الأربعة</strong><p>الروح والمادة والمواهب والعلاقات. حين تتوازن هذه الاتجاهات تهدأ حياتك، وحين يختل أحدها تظهر الأزمات التي تتكرر معك.</p></div></li><li><b>٣</b><div><strong>الدروس الكارمية</strong><p>أرقام تشير إلى الدرس الذي جئت لتتعلمه، والنمط الذي تعيده حتى تفهمه. معرفته أول خطوة في التحرر منه.</p></div></li><li><b>٤</b><div><strong>قنوات المال والعلاقات</strong><p>قناتان تكشفان كيف تتدفق الوفرة إليك، وما الذي يجذبك إلى أشخاص بعينهم دون غيرهم.</p></div></li></ol></section>'
          + '<section class="aq-mx-gold"><h3><span></span>استثمر في ذاتك<span></span></h3><a class="aq-gold" href="#featured-content/matrix-22-arcana"><span class="aq-gold-i">' + ic('<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5c0-1.2 1.2-1.8 2.500-1.800s2.500.7 2.500 1.800-1.200 1.600-2.500 1.900-2.500.8-2.500 2 1.200 1.800 2.500 1.800 2.500-.6 2.500-1.800"/>') + '</span><span class="aq-gold-t"><b>افتح مسارات المال من مصفوفتك</b><small>اعرف أين تتعثر وفرتك وكيف تُفتح لك أبواب الرزق</small></span></a><a class="aq-gold" href="#featured-content/matrix-22-arcana"><span class="aq-gold-i">' + ic('<circle cx="12" cy="12" r="9"/><path d="M8.500 12a3.500 3.500 0 0 1 6-2.400M15.500 12a3.500 3.500 0 0 1-6 2.400"/>') + '</span><span class="aq-gold-t"><b>فكّ الدين الكارمي من مصفوفتك</b><small>افهم الدرس الذي يتكرر في علاقاتك وقراراتك وتحرّر منه</small></span></a></section>';
        var ft0 = sec.querySelector(':scope > footer'); if (ft0) sec.insertBefore(ab, ft0); else sec.appendChild(ab);
      }
      if (id === 'matrix' || id === 'chart' || id === 'lifepath') return;
      var ft = sec.querySelector(':scope > footer'); if (ft) sec.insertBefore(box, ft); else sec.appendChild(box);
    });
  }
  function init() { topbars(); related(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

;
/* assets/js/chart-adv.js */
/* chart form: collapse advanced settings (zodiac/house systems, country/region pickers) behind one link. UI only. */
(function(){
  function init(){
    var f=document.getElementById('cform'); if(!f||f.querySelector('.ntx-adv-btn'))return;
    var btn=f.querySelector('.btn'); if(!btn)return;
    var b=document.createElement('button'); b.type='button'; b.className='ntx-adv-btn'; b.setAttribute('aria-expanded','false');
    b.innerHTML='<span>إعدادات متقدمة (اختياري)</span><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
    b.addEventListener('click',function(){var o=f.classList.toggle('ntx-adv-open');b.setAttribute('aria-expanded',o?'true':'false');});
    btn.parentNode.insertBefore(b,btn);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  setTimeout(init,1500);
})();

;
/* assets/js/home-notes3.js */
/* ملاحظات الهوم: شارة جديد، نقل زر "عرض الكل"، سهم الشريط العلوي، ونافذة ابدأ رحلتك */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var SVG = {
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1l1.6 8.4L22 12l-8.4 2.6L12 23l-1.6-8.4L2 12l8.4-2.6z"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.600 6.500-10 6.500S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><ellipse cx="12" cy="12" rx="10" ry="5.5" transform="rotate(-28 12 12)"/><circle cx="12" cy="12" r="2.4" fill="currentColor"/></svg>',
    matrix: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 21 12 12 21 3 12Z"/><path d="M12 3v18M3 12h18" stroke-opacity=".7"/></svg>',
    path: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M2 19 9 7l4 6 3-4 6 10Z"/></svg>',
    love: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5" stroke-opacity=".75"/></svg>',
    sign: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.500"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><rect x="3.500" y="3.500" width="7" height="7" rx="1.500"/><rect x="13.500" y="3.500" width="7" height="7" rx="1.500"/><rect x="3.500" y="13.500" width="7" height="7" rx="1.500"/><path d="M13.500 17h7M17 13.500v7"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 6C9.500 4.500 5.500 4.500 3 5.500v13c2.500-1 6.500-1 9 .5 2.500-1.500 6.500-1.500 9-.5v-13c-2.500-1-6.500-1-9 .5ZM12 6v13"/></svg>'
  };

  /* --- زر عرض الكل تحت المعرض + شارة جديد مكانه --- */
  function articles() {
    var head = $('#aqh-articles .aqh-articles-head'), all = $('#aqh-all-articles'), sec = $('#aqh-articles');
    if (!head || !all || !sec || sec.getAttribute('data-hn')) return;
    sec.setAttribute('data-hn', '1');
    var wrap = document.createElement('div'); wrap.className = 'aqh-all-wrap'; var ico=document.createElement('span'); ico.className='aqh-all-ico'; ico.innerHTML=SVG.grid; all.appendChild(ico); wrap.appendChild(all); sec.appendChild(wrap);
    var badge = document.createElement('span'); badge.className = 'aqh-new-badge'; badge.hidden = true; badge.setAttribute('role', 'img'); badge.setAttribute('aria-label', 'جديد في المحتوى المميز');
    badge.innerHTML = SVG.star + '<span>جديد في المحتوى المميز</span>'; head.appendChild(badge);
    try {
      fetch('assets/data/featured-content.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (d) {
        var list = Array.isArray(d) ? d : (d.items || d.articles || []);
        var newest = 0; list.forEach(function (a) { var t = Date.parse(a.publishedAt || a.date || ''); if (t > newest) newest = t; });
        if (newest && (Date.now() - newest) / 864e5 <= 30) badge.hidden = false;
      }).catch(function () { });
    } catch (e) { }
  }

  /* --- سهم الشريط العلوي عند الضيق --- */
  function navMore() {
    var nav = $('.aqh-header .aqh-nav'); if (!nav || nav.nextElementSibling && nav.nextElementSibling.classList.contains('aqh-nav-more')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'aqh-nav-more'; b.setAttribute('aria-label', 'عرض المزيد من الروابط'); b.innerHTML = SVG.chev;
    nav.parentNode.insertBefore(b, nav.nextSibling);
    function upd() {
      var max = nav.scrollWidth - nav.clientWidth, pos = Math.abs(nav.scrollLeft);
      var visible = getComputedStyle(nav).display !== 'none';
      b.classList.toggle('is-on', visible && max > 6 && pos < max - 6);
    }
    b.addEventListener('click', function () { nav.scrollBy({ left: -140 }); });
    nav.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); setTimeout(upd, 400); setTimeout(upd, 1500); upd();
  }

  /* --- نافذة ابدأ رحلتك --- */
  var modal, lastFocus;
  var G = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  SVG.sun = '<svg viewBox="0 0 24 24" ' + G + '><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>';
  SVG.sky = '<svg viewBox="0 0 24 24" ' + G + '><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>';
  SVG.gem = '<svg viewBox="0 0 24 24" ' + G + '><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9 3l3 6 3-6M12 21 9 9M12 21l3-12"/></svg>';
  SVG.lib = '<svg viewBox="0 0 24 24" ' + G + '><path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1z"/><path d="M12 6v13"/></svg>';
  var TABS = [
    ['الخرائط', 'خرائط تقرأ نفسك بعمق', [
      ['#chart', 'chart', 'الخريطة الفلكية', 'شخصيتك لحظة ميلادك'],
      ['#matrix', 'matrix', 'المصفوفة', 'طاقاتك ودروسك'],
      ['#lifepath', 'path', 'مسار الحياة', 'محطات رحلتك'],
      ['#relationships', 'love', 'التوافق', 'بينك وبين من تحب']]],
    ['التوقعات', 'ما تقوله السماء الآن', [
      ['#sky', 'sky', 'السماء الآن', 'الكواكب والقمر لحظة بلحظة'],
      ['#signs', 'sign', 'برجك الآن', 'ماذا يخبئ لك اليوم'],
      ['#astro-maps', 'sun', 'العودة الشمسية', 'طاقة سنتك الجديدة']]],
    ['الإلهام', 'اقرأ، تأمل، ثم ابدأ', [
      ['#featured-content', 'book', 'المقالات', 'شروحات خطوة بخطوة'],
      ['', 'lib', 'مكتبة عقيق', 'قيد التجهيز', 1],
      ['#invest', 'gem', 'استثمر في ذاتك', 'جلسات ومرافقة']]]
  ];
  var tabIdx = 0;
  function tile(i) {
    return i[4] ? '<span class="hn-tile is-soon" aria-disabled="true"><i>' + SVG[i[1]] + '</i><span><b>' + i[2] + '</b><small>' + i[3] + '</small></span><em>قريباً</em></span>'
      : '<a class="hn-tile" href="' + i[0] + '"><i>' + SVG[i[1]] + '</i><span><b>' + i[2] + '</b><small>' + i[3] + '</small></span></a>';
  }
  function build() {
    modal = document.createElement('div'); modal.className = 'hn-modal'; modal.hidden = true;
    modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-labelledby', 'hn-t');
    modal.innerHTML = '<div class="hn-card"><span class="hn-eye">' + SVG.eye + '</span>' +
      '<h2 id="hn-t">أين تريد أن تبدأ؟</h2>' +
      '<p>اختر بابك، واسحب لتكتشف بقية الأقسام.</p>' +
      '<div class="hn-tabs" role="tablist">' + TABS.map(function (t, n) { return '<button type="button" role="tab" data-hn-tab="' + n + '" class="' + (n === 0 ? 'is-on' : '') + '">' + t[0] + '</button>'; }).join('') + '</div>' +
      '<div class="hn-track">' + TABS.map(function (t) { return '<section class="hn-pane"><p class="hn-sub">' + t[1] + '</p><div class="hn-grid">' + t[2].map(tile).join('') + '</div></section>'; }).join('') + '</div>' +
      '<div class="hn-dots">' + TABS.map(function (t, n) { return '<i class="' + (n === 0 ? 'is-on' : '') + '"></i>'; }).join('') + '</div>' +
      '<button type="button" class="hn-close">' + SVG.x + '<span>إغلاق النافذة</span></button></div>';
    document.body.appendChild(modal);
    var track = $('.hn-track', modal);
    function mark(n) { tabIdx = n; $$('.hn-tabs button', modal).forEach(function (b, k) { b.classList.toggle('is-on', k === n); }); $$('.hn-dots i', modal).forEach(function (d, k) { d.classList.toggle('is-on', k === n); }); }
    var tm; track.addEventListener('scroll', function () { clearTimeout(tm); tm = setTimeout(function () { mark(Math.max(0, Math.min(2, Math.round(Math.abs(track.scrollLeft) / track.clientWidth)))); }, 60); }, { passive: true });
    modal.addEventListener('click', function (e) {
      var tb = e.target.closest('[data-hn-tab]');
      if (tb) { var n = +tb.getAttribute('data-hn-tab'); mark(n); $$('.hn-pane', modal)[n].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' }); return; }
      if (e.target.closest('.is-soon')) return;
      if (e.target === modal || e.target.closest('.hn-close') || e.target.closest('a.hn-tile')) close();
    });
  }
  function open() {
    if (!modal) build();
    lastFocus = document.activeElement; modal.hidden = false; document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { modal.classList.add('is-open'); var c = $('.hn-close', modal); if (c) c.focus(); });
  }
  function close() {
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-open'); document.documentElement.style.overflow = '';
    setTimeout(function () { modal.hidden = true; }, 220);
    if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) { }
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('#home .aqh-hero-copy a.aq-btn-burgundy.aqh-cta');
    if (a) { e.preventDefault(); e.stopPropagation(); open(); }
  }, true);

  function init() { articles(); navMore(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

;
/* assets/js/companion.js */
/* رفيق عقيق: بوت قواعد محلي (بدون خادم). الردود من assets/data/companion.json */
(function () {
  'use strict';
  var SRC = 'assets/data/companion.json', D = null, panel, log, input, fab, lastFocus;
  var I = {
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 4 10 14M20 4l-6 16-4-6-6-4Z"/></svg>'
  };
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); }
  function norm(s) { return String(s).replace(/[ً-ْـ]/g, '').replace(/[إأآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').toLowerCase().trim(); }

  function say(html, who) { var m = el('div', 'cmp-msg ' + (who || 'bot'), html); log.appendChild(m); log.scrollTop = log.scrollHeight; return m; }
  function chips(items) {
    var w = el('div', 'cmp-chips');
    items.forEach(function (c) { var b = el('button', 'cmp-chip', esc(c.label)); b.type = 'button'; b.addEventListener('click', c.run); w.appendChild(b); });
    log.appendChild(w); log.scrollTop = log.scrollHeight;
  }
  function go(hash) { close(); location.hash = hash; }
  function link(hash, label) { return '<a class="cmp-go" href="' + hash + '" data-cmp-go>' + esc(label) + '</a>'; }

  function menu() {
    chips([
      { label: 'ما طاقة اليوم؟', run: function () { say('ما طاقة اليوم؟', 'me'); energy(); } },
      { label: 'وصّلني لأداة', run: function () { say('وصّلني لأداة', 'me'); tools(); } },
      { label: 'اشرح لي مصطلحًا', run: function () { say('اشرح لي مصطلحًا', 'me'); termsMenu(); } },
      { label: 'مقال يناسبني', run: function () { say('مقال يناسبني', 'me'); article(); } }
    ]);
  }
  function energy() {
    var a = document.getElementById('aqh-energy-main'), b = document.getElementById('aqh-energy-state');
    var t = [a && a.textContent.trim(), b && b.textContent.trim()].filter(Boolean).join('. ');
    say(t ? esc(t) : 'تفاصيل طاقة اليوم في صفحة السماء الآن.');
    say(link('#sky', 'افتح السماء الآن')); menu();
  }
  function tools() {
    say('أي أداة تريد؟');
    chips(D.tools.map(function (t) { return { label: t.label, run: function () { say(t.label, 'me'); say(esc(t.note) + '<br>' + link(t.hash, 'افتح ' + t.label)); menu(); } }; }));
  }
  function termsMenu() {
    say('اختر مصطلحًا:');
    chips(D.terms.slice(0, 8).map(function (t) { return { label: t.t, run: function () { say(t.t, 'me'); explain(t); } }; }));
  }
  function explain(t) { say(esc(t.a) + (t.hash ? '<br>' + link(t.hash, 'افتح الأداة') : '')); menu(); }
  function article() {
    var list = (window.AqhArticles && window.AqhArticles.all && window.AqhArticles.all()) || [];
    if (!list.length) { say('المقالات في صفحة المحتوى المميز.'); say(link('#featured-content', 'افتح المحتوى المميز')); return menu(); }
    var a = list[Math.floor(Math.random() * Math.min(list.length, 8))];
    say('أقترح عليك: <b>' + esc(a.title) + '</b>'); say(link('#featured-content/' + a.slug, 'اقرأ المقال')); menu();
  }
  function ask(q) {
    var n = norm(q); if (!n) return;
    say(esc(q), 'me');
    var hit = null;
    var best = 0; D.terms.forEach(function (t) { t.k.forEach(function (k) { var nk = norm(k); if ((nk.length > 3 ? n.indexOf(nk) > -1 : (' ' + n + ' ').indexOf(' ' + nk + ' ') > -1) && nk.length > best) { best = nk.length; hit = t; } }); });
    if (hit) explain(hit); else { say(esc(D.fallback)); menu(); }
  }

  function build() {
    fab = el('button', 'cmp-fab', I.eye); fab.type = 'button'; fab.setAttribute('aria-label', 'رفيق عقيق'); fab.setAttribute('aria-haspopup', 'dialog'); fab.setAttribute('aria-expanded', 'false');
    panel = el('div', 'cmp-panel'); panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'رفيق عقيق');
    panel.innerHTML = '<div class="cmp-head"><span class="cmp-ico">' + I.eye + '</span><div><b>رفيق عقيق</b><small>رفيقك في الرحلة</small></div><button type="button" class="cmp-x" aria-label="إغلاق">' + I.x + '</button></div><div class="cmp-log" aria-live="polite"></div><form class="cmp-form"><input type="text" maxlength="60" placeholder="اكتب كلمة، مثل: التوافق" aria-label="اكتب سؤالك"><button type="submit" aria-label="إرسال">' + I.send + '</button></form>';
    document.body.appendChild(fab); document.body.appendChild(panel);
    log = panel.querySelector('.cmp-log'); input = panel.querySelector('input');
    fab.addEventListener('click', function () { panel.hidden ? open() : close(); });
    /* يختفي عند النزول ويظهر عند الصعود، حتى لا يغطي النص */
    var lastY = {}, tick = false;
    document.addEventListener('scroll', function (e) {
      var t = e.target === document ? window : e.target, k = t === window ? 'w' : (t.id || t.className || 'x');
      var y = t === window ? window.scrollY : t.scrollTop, d = y - (lastY[k] || 0);
      if (Math.abs(d) < 8) return; lastY[k] = y;
      if (!panel.hidden) return;
      fab.classList.toggle('cmp-fab-hide', d > 0 && y > 60);
    }, { passive: true, capture: true });
    window.addEventListener('hashchange', function () { fab.classList.remove('cmp-fab-hide'); });
    panel.querySelector('.cmp-x').addEventListener('click', close);
    panel.querySelector('form').addEventListener('submit', function (e) { e.preventDefault(); var v = input.value; input.value = ''; ask(v); });
    panel.addEventListener('click', function (e) { if (e.target.closest('[data-cmp-go]')) { e.preventDefault(); go(e.target.closest('[data-cmp-go]').getAttribute('href')); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) close(); });
  }
  function open() {
    function show() {
      panel.hidden = false; fab.setAttribute('aria-expanded', 'true'); lastFocus = document.activeElement;
      if (!log.children.length) { say(esc(D.greeting)); menu(); }
      requestAnimationFrame(function () { panel.classList.add('is-open'); });
    }
    if (D) return show();
    fetch(SRC).then(function (r) { return r.json(); }).then(function (d) { D = d; show(); }).catch(function () { });
  }
  function close() { panel.classList.remove('is-open'); fab.setAttribute('aria-expanded', 'false'); setTimeout(function () { panel.hidden = true; }, 200); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();

;
/* assets/js/account-bar.js */
/* الشريط السفلي حسب حالة الدخول (لك / أنت) + جرس الإشعارات. واجهة فقط. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var SVG = function (p) { return '<svg fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" viewBox="0 0 24 24">' + p + '</svg>'; };
  var ICON_FORYOU = SVG('<path d="M12 3l2.2 5.600L20 9.500l-4.400 3.900L17 19l-5-3-5 3 1.400-5.600L4 9.500l5.800-.9z"/>');
  var ICON_YOU = SVG('<circle cx="12" cy="12" r="9"/><path d="M12 6.500l1.600 3.900 3.900 1.600-3.900 1.600L12 17.500l-1.600-3.900L6.500 12l3.900-1.600z"/>');
  var BELL = SVG('<path d="M6 16.500V11a6 6 0 0 1 12 0v5.500l1.500 2h-15z"/><path d="M10 21a2 2 0 0 0 4 0"/>');
  var user = null;

  /* ---------------- الشريط السفلي ---------------- */
  var bar = $('#aqn-bnav');
  function item(id, href, label, icon, tag) {
    var el = document.createElement(tag || 'a'); el.className = 'bnav-item'; el.id = id; el.setAttribute('data-nav', id);
    if (tag === 'button') el.type = 'button'; else el.href = href;
    el.innerHTML = '<span class="bnav-icon">' + icon + '</span><span class="bnav-label">' + label + '</span>';
    return el;
  }
  var youSheet = null, youScrim = null;
  function buildSheet() {
    if (youSheet) return;
    youScrim = document.createElement('div'); youScrim.className = 'aqn-scrim'; youScrim.hidden = true;
    youSheet = document.createElement('div'); youSheet.className = 'aqn-sheet aq-you-sheet'; youSheet.setAttribute('role', 'dialog'); youSheet.setAttribute('aria-modal', 'true'); youSheet.setAttribute('aria-label', 'انضم إلى مساحتك'); youSheet.hidden = true;
    youSheet.innerHTML = '<span class="aqn-grab" aria-hidden="true"></span><h2>مساحتك أنت</h2>' +
      '<p class="aq-you-p">سجّل دخولك لتحصل على مميزات أكثر: نافذتك اليومية، توقعات برجك، تذكير بنمطك، وعبورات خريطتك في الوقت الحالي.</p>' +
      '<a class="aq-you-cta" href="#account">' + SVG('<path d="M4 6.500h16v11H4z"/><path d="m4 7 8 6 8-6"/>') + '<span>تسجيل الدخول بحساب Gmail</span></a>' +
      '<button type="button" class="aq-you-later" data-you-close>لاحقًا</button>';
    document.body.appendChild(youScrim); document.body.appendChild(youSheet);
    youScrim.addEventListener('click', closeYou);
    youSheet.addEventListener('click', function (e) { if (e.target.closest('a,[data-you-close]')) closeYou(); });
  }
  function openYou() { buildSheet(); youSheet.hidden = false; youScrim.hidden = false; void youSheet.offsetWidth; youSheet.classList.add('is-open'); youScrim.classList.add('is-open'); }
  function closeYou() { if (!youSheet) return; youSheet.classList.remove('is-open'); youScrim.classList.remove('is-open'); setTimeout(function () { youSheet.hidden = true; youScrim.hidden = true; }, 300); }
  window.addEventListener('hashchange', closeYou);
  document.addEventListener('aq:wesync', function () { var a = document.querySelector('.bnav-item[data-we]'), me = document.querySelector('.bnav-item[data-nav="account"]'), on = !!window.__aqWeOn && location.hash === '#for-you'; if (a) a.classList.toggle('on', on); if (me && user && location.hash === '#for-you') me.classList.toggle('on', !on); });
  function renderBar() {
    if (!bar) return;
    var home = bar.querySelector('[data-nav="home"]'), disc = $('#aqn-mag-btn'), acc = bar.querySelector('[data-nav="account"]');
    var compat = bar.querySelector('[data-nav="compat"]');
    if (compat) {
      if (user) compat.style.removeProperty('display'); else compat.style.setProperty('display', 'none', 'important');
      if (user && !compat.getAttribute('data-we')) {
        compat.setAttribute('data-we', '1'); compat.setAttribute('href', '#for-you');
        var lb = compat.querySelector('.bnav-label'); if (lb) { lb.removeAttribute('data-i18n-ar'); lb.removeAttribute('data-i18n-en'); lb.textContent = 'نحن'; }
        compat.addEventListener('click', function (e) { if (window.AqeeqYouPage) { e.preventDefault(); window.AqeeqYouPage.go('we'); } });
      }
    }
    var old = $('#aq-you-item', bar);
    /* بعد الدخول: «حسابي» هو صفحتك الكاملة (#for-you) بدل نافذة منبثقة، فلا حاجة لزر «لك» منفصل */
    if (acc) { var al = acc.querySelector('.bnav-label'); if (al) { al.removeAttribute('data-i18n-ar'); al.removeAttribute('data-i18n-en'); al.textContent = user ? 'أنت' : 'حسابي'; } acc.setAttribute('href', '#account'); acc.classList.toggle('on', location.hash === (user ? '#for-you' : '#account')); }
    if (user) { if (old) old.remove(); closeYou(); return; }
    /* الزر موجود في الـHTML من أول لحظة (لا يُعاد بناؤه) حتى لا يتبدّل الشريط عند التحميل */
    var it = old;
    if (!it) { it = item('aq-you-item', '#', 'أنت', ICON_YOU, 'button'); it.id = 'aq-you-item'; it.setAttribute('data-nav', 'you'); bar.insertBefore(it, disc); }
    if (!it._aqBound) { it._aqBound = 1; it.addEventListener('click', openYou); }
  }
  var fy = document.querySelector('#aqn-sheet .aqn-grid a[href="#for-you"]'); if (fy) fy.remove();

  /* ---------------- جرس الإشعارات ---------------- */
  var SEEN = 'aq_notif_seen_v1', articles = null, bellBtn = null, panel = null;
  function seen() { try { return localStorage.getItem(SEEN) || ''; } catch (_) { return ''; } }
  function markSeen() { if (articles && articles[0]) { try { localStorage.setItem(SEEN, articles[0].publishedAt || ''); } catch (_) {} } }
  function unread() { var s = seen(); return (articles || []).filter(function (a) { return a.publishedAt && a.publishedAt > s; }).length; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(d) { try { return new Date(d).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' }); } catch (_) { return ''; } }
  function renderPanel() {
    if (!panel) return;
    var s = seen(), list = (articles || []).slice(0, 5).map(function (a) {
      var fresh = a.publishedAt && a.publishedAt > s;
      return '<a class="aq-n-i' + (fresh ? ' is-new' : '') + '" href="#featured-content/' + esc(a.slug) + '"><span class="aq-n-ic">' + SVG('<path d="M4 5.500C6.500 4.500 9.500 4.500 12 6c2.500-1.500 5.500-1.500 8-.5V19c-2.500-1-5.500-1-8 .5-2.500-1.500-5.500-1.500-8-.5z"/><path d="M12 6v13.500"/>') + '</span><span class="aq-n-t"><b>' + esc(a.title) + '</b><small>مقال جديد · ' + fmt(a.publishedAt) + '</small></span></a>';
    }).join('');
    var top = user
      ? '<a class="aq-n-i is-me" href="#for-you"><span class="aq-n-ic">' + ICON_FORYOU + '</span><span class="aq-n-t"><b>نافذتك اليومية جاهزة</b><small>توقعات برجك وعبورات خريطتك اليوم</small></span></a>'
      : '<a class="aq-n-i is-me" href="#account"><span class="aq-n-ic">' + ICON_YOU + '</span><span class="aq-n-t"><b>سجّل دخولك لإشعارات تخصّك</b><small>طاقتك وتوقعاتك وعبوراتك الشخصية</small></span></a>';
    panel.innerHTML = '<div class="aq-n-h"><b>الإشعارات</b><button type="button" data-n-close aria-label="إغلاق">' + SVG('<path d="M6 6l12 12M18 6 6 18"/>') + '</button></div>' + top + (list || '<p class="aq-n-empty">لا توجد إشعارات جديدة الآن.</p>') + '<a class="aq-n-all" href="#featured-content">كل المحتوى المميز</a>';
  }
  function badge() { if (!bellBtn) return; var n = user ? unread() : 0, b = bellBtn.querySelector('.aq-n-badge'); b.textContent = n > 9 ? '9+' : String(n); b.hidden = n === 0; }
  function togglePanel(v) {
    if (!panel) return; var open = v === undefined ? panel.hidden : v;
    panel.hidden = !open; bellBtn.setAttribute('aria-expanded', String(open));
    if (open) { renderPanel(); } else { markSeen(); badge(); }
  }
  function buildBell() {
    var tools = $('.aqh-tools.hd-act'), search = $('[data-aqh-search]'); if (!tools || !search) return; var pre = $('#aq-bell'); if (pre && pre._aqBell) return;
    bellBtn = pre || document.createElement('button');
    if (!pre) { bellBtn.type = 'button'; bellBtn.id = 'aq-bell'; bellBtn.className = 'aqh-icon aq-bell'; bellBtn.setAttribute('aria-label', 'الإشعارات'); bellBtn.setAttribute('aria-haspopup', 'true'); bellBtn.setAttribute('aria-expanded', 'false'); bellBtn.innerHTML = BELL + '<i class="aq-n-badge" hidden>0</i>'; tools.insertBefore(bellBtn, search); }
    bellBtn._aqBell = 1;
    panel = document.createElement('div'); panel.className = 'aq-notif'; panel.hidden = true; panel.setAttribute('role', 'region'); panel.setAttribute('aria-label', 'الإشعارات');
    document.body.appendChild(panel);
    bellBtn.addEventListener('click', function (e) { e.stopPropagation(); togglePanel(); });
    panel.addEventListener('click', function (e) { if (e.target.closest('[data-n-close]') || e.target.closest('a')) togglePanel(false); e.stopPropagation(); });
    document.addEventListener('click', function () { if (!panel.hidden) togglePanel(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) togglePanel(false); });
    window.addEventListener('hashchange', function () { if (!panel.hidden) togglePanel(false); });
    fetch('assets/data/featured-content.json').then(function (r) { return r.json(); }).then(function (d) {
      var a = Array.isArray(d) ? d : (d.articles || []);
      articles = a.filter(function (x) { return x && x.publishedAt && x.slug; }).sort(function (x, y) { return x.publishedAt < y.publishedAt ? 1 : -1; });
      badge(); renderPanel();
    }).catch(function () { articles = []; });
  }
  function adminChip() {
    var host = $('#acct-user .acct-user-details'); if (!host) return;
    var ex = $('#aq-admin-chip'); var on = !!(window.AqSession && window.AqSession.isAdmin);
    if (!on) { if (ex) ex.remove(); return; }
    if (ex) return;
    var a = document.createElement('a'); a.id = 'aq-admin-chip'; a.className = 'aq-admin-chip'; a.href = '#admin-pay';
    a.innerHTML = SVG('<path d="M12 3l8 3v5c0 5-3.500 8-8 10-4.500-2-8-5-8-10V6z"/><path d="m8.500 12 2.500 2.500 4.500-5"/>') + '<span>صلاحيات المالك · كل شيء مفتوح</span>';
    host.appendChild(a);
  }
  document.addEventListener('aq:admin', adminChip);
  function joinBtn() { var j = $('.aqh-join span'); if (j) { j.removeAttribute('data-i18n-ar'); j.removeAttribute('data-i18n-en'); j.textContent = user ? 'حسابي' : 'انضم الآن'; } }
  document.addEventListener('aq:session', function (e) { user = e.detail && e.detail.user; renderBar(); renderPanel(); joinBtn(); badge(); });
  function init() { user = (window.AqSession && window.AqSession.user) || null; renderBar(); buildBell(); joinBtn(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

;
/* assets/js/you-cycles.js */
/* محرك دورات العبور الشخصية: بداية ونهاية وذروة كل دورة من خريطة الميلاد. حساب فقط. */
(function () {
  'use strict';
  var DAY = 864e5, STEP = 4;
  var T = { jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو', truenode: 'العقدة الشمالية', chiron: 'كيرون' };
  var N = { sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ', jupiter: 'المشتري', saturn: 'زحل', asc: 'الطالع', mc: 'وسط السماء', desc: 'الهابط', ic: 'قاع السماء' };
  var ASP = [{ d: 0, k: 'conj', n: 'اقتران' }, { d: 60, k: 'sext', n: 'تسديس' }, { d: 90, k: 'sq', n: 'تربيع' }, { d: 120, k: 'tri', n: 'تثليث' }, { d: 180, k: 'opp', n: 'مقابلة' }];
  var SIGNS = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  /* مجال كل نقطة في الخريطة */
  var ONLY = { truenode: ['conj', 'opp'] };
  var DOM = { sun: ['self'], moon: ['self', 'work'], mercury: ['self', 'work'], venus: ['love'], mars: ['work', 'love'], jupiter: ['self'], saturn: ['work'], asc: ['self', 'love'], mc: ['work'], desc: ['love'], ic: ['work'] };
  var norm = function (x) { return ((x % 360) + 360) % 360; };
  var cache = {};
  function pos(ms) {
    var k = Math.round(ms / DAY / STEP), c = cache[k]; if (c) return c;
    var ch = Astro.chart({ utcMs: k * STEP * DAY, lat: 30, lon: 31, known: false }), o = {};
    ch.bodies.forEach(function (b) { if (T[b.key]) o[b.key] = norm(b.lon); });
    try {
      var P = window.AqeqPersonalTransits;
      if (P) P.calculateTransits([], new Date(k * STEP * DAY)).transits.forEach(function (b) { if (b.key === 'Chiron') o.chiron = norm(b.lon); });
    } catch (e) { /* كيرون تقريبي: لو فشل نتجاهله */ }
    return (cache[k] = o);
  }
  function natalPoints(ch) {
    var o = {}; ch.bodies.forEach(function (b) { if (N[b.key]) o[b.key] = norm(b.lon); });
    if (ch.asc != null) { o.asc = norm(ch.asc); o.desc = norm(ch.asc + 180); }
    if (ch.mc != null) { o.mc = norm(ch.mc); o.ic = norm(ch.mc + 180); }
    return o;
  }
  function orbOf(a, b, deg) { var d = Math.abs(((a - b + 540) % 360) - 180); return Math.abs(d - deg); }
  /* كل دورات العبور حول تاريخ محدد (من -3 إلى +3 سنوات) */
  function cycles(natal, center) {
    var pts = natalPoints(natal); delete pts.desc; delete pts.ic;
    var from = center - 3 * 365 * DAY, to = center + 3 * 365 * DAY, runs = {}, out = [];
    from = Math.ceil(from / (STEP * DAY)) * STEP * DAY;
    for (var ms = from; ms <= to; ms += STEP * DAY) {
      var p = pos(ms);
      for (var tk in p) for (var nk in pts) {
        if (tk === nk) continue;
        for (var i = 0; i < ASP.length; i++) {
          if (ONLY[tk] && ONLY[tk].indexOf(ASP[i].k) < 0) continue;
          var o = orbOf(p[tk], pts[nk], ASP[i].d); if (o > 2) continue;
          var id = tk + '|' + ASP[i].k + '|' + nk, r = runs[id] || (runs[id] = []);
          r.push({ ms: ms, o: o });
        }
      }
    }
    for (var id2 in runs) {
      var s = id2.split('|'), r2 = runs[id2], grp = [r2[0]], g = [];
      for (var j = 1; j < r2.length; j++) { if (r2[j].ms - r2[j - 1].ms > 160 * DAY) { g.push(grp); grp = []; } grp.push(r2[j]); }
      g.push(grp);
      g.forEach(function (x) {
        var start = x[0].ms, end = x[x.length - 1].ms;
        if (start <= from + STEP * DAY || end >= to - STEP * DAY) return;          /* دورة مقطوعة الطرف: نتجاهلها */
        var peaks = [], cur = null;
        x.forEach(function (q) { if (q.o <= 0.6) { if (!cur) peaks.push(cur = { a: q.ms, b: q.ms }); else cur.b = q.ms; } else cur = null; });
        var asp = ASP.filter(function (a) { return a.k === s[1]; })[0];
        out.push({ id: id2, t: s[0], asp: s[1], n: s[2], tn: T[s[0]], an: asp.n, nn: N[s[2]], doms: DOM[s[2]] || ['self'], start: start, end: end, peaks: peaks });
      });
    }
    return out.sort(function (a, b) { return a.start - b.start; });
  }
  function placements(natal) {
    var pts = natalPoints(natal), keys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'asc', 'mc', 'desc', 'ic'];
    return keys.filter(function (k) { return pts[k] != null; }).map(function (k) { return { id: k, nn: N[k], sign: SIGNS[Math.floor(pts[k] / 30)], dom: DOM[k][0] }; });
  }
  window.AqeeqYou = { cycles: cycles, placements: placements, T: T, N: N };
})();

;
/* assets/js/you-live.js */
/* محرك "طاقة اليوم" الحيّ: كل شيء محسوب على خريطة المستخدم نفسه، وبالدرجة الفعلية الآن.
   + البصمة الفيدية (لاهيري): برج القمر والنكشاترا والطالع. */
(function () {
  'use strict';
  var SG = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var NAK = ['أشويني', 'بهراني', 'كريتيكا', 'روهيني', 'مريغاشيرا', 'أردرا', 'بونارفاسو', 'بوشيا', 'أشليشا', 'ماغها', 'بورفا بهالغوني', 'أوتارا بهالغوني', 'هاستا', 'تشيترا', 'سواتي', 'فيشاخا', 'أنورادها', 'جييشتها', 'مولا', 'بورفا آشادها', 'أوتارا آشادها', 'شرافانا', 'دانيشتا', 'شاتابهيشا', 'بورفا بهادرابادا', 'أوتارا بهادرابادا', 'ريفاتي'];
  var PN = { moon: 'القمر', sun: 'الشمس', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ' };
  var norm = function (x) { return ((x % 360) + 360) % 360; };
  function ayan(jde) {
    try { if (window.AqEam && window.AqEam.ayanamsa) return window.AqEam.ayanamsa(jde); } catch (e) {}
    var T = (jde - 2415020) / 36525; return (22 * 3600 + 27 * 60 + 37.65 + 5025.75 * T + 1.11 * T * T) / 3600;
  }
  function houseOf(ch, lon) {
    if (!ch.known || !ch.cusps || typeof ch.asc !== 'number') { var sun = ch.bodies.filter(function (b) { return b.key === 'sun'; })[0]; return Math.floor(norm(lon - (sun ? sun.lon : 0)) / 30) + 1; }
    var c = ch.cusps || [], off = c.length >= 13 ? 1 : 0;
    for (var i = 1; i <= 12; i++) {
      var a = norm(c[i - 1 + off]), b = norm(c[(i % 12) + off]);
      var span = norm(b - a), d = norm(lon - a);
      if (d < span || (span === 0 && i === 1)) return i;
    }
    return Math.floor(norm(lon - ch.asc) / 30) + 1;
  }
  function vedic(ch) {
    if (!ch || !ch.bodies) return null;
    var m = ch.bodies.filter(function (b) { return b.key === 'moon'; })[0]; if (!m) return null;
    var ay = ayan(ch.jde), sl = norm(m.lon - ay), nk = Math.floor(sl / (360 / 27));
    var pada = Math.floor((sl % (360 / 27)) / (360 / 108)) + 1;
    var out = { rashi: SG[Math.floor(sl / 30)], nak: NAK[nk], pada: pada };
    if (ch.known && typeof ch.asc === 'number') out.asc = SG[Math.floor(norm(ch.asc - ay) / 30)];
    return out;
  }

  /* ---- المضمون: الطور حسب الدرجة × مجال البيت × قوالب تتبدّل يوميًا ---- */
  var PH = {
    moon: [
      ['مشاعرك في أول موجتها، حساسية جديدة تبحث عن مجراها', 'المزاج يبدأ للتو، فلا تحكم على يومك مبكرًا'],
      ['مشاعرك في أوضح حالاتها، تعرف ما يريحك وما يزعجك', 'المزاج في أقوى حضوره، ولهذا يظهر ما كنت تكتمه'],
      ['موجة المشاعر تقترب من نهايتها، وقت مناسب للتهدئة والإنهاء', 'ما كان يشغلك يبدأ بالخفوت، فلا تفتح بابًا تريد إغلاقه']
    ],
    sun: [
      ['طاقتك الأساسية تفتح فصلًا جديدًا هنا', 'حضورك يبدأ في التشكل من جديد في هذا الجانب'],
      ['حيويتك في أعلى وضوحها، وما تفعله الآن يظهر أثره', 'هذا الجانب يأخذ أقوى ضوء، فما تهمله فيه يلفت نظرك'],
      ['فصل من حيويتك يوشك أن يكتمل، وما بنيته يطلب منك أن تقيّمه', 'الضوء ينتقل قريبًا إلى مجال آخر، فأنهِ ما بدأته هنا']
    ],
    mercury: [
      ['تفكيرك يبدأ مسارًا جديدًا، والأفكار الأولى تحتاج صبرًا لتنضج', 'ذهنك ينفتح على زاوية جديدة، فاسمع قبل أن تحكم'],
      ['ذهنك في أسرع حالاته وأوضحها، وكلامك يصل بسهولة', 'عقلك يربط الأمور ببعضها بسرعة، وهذا وقت جيد للحسم'],
      ['أفكارك تقترب من خلاصتها، وما تؤجله من رد أو قرار يطلبك', 'ذهنك يختم دورة من التفكير، فراجع ما كتبته قبل أن ترسله']
    ],
    venus: [
      ['ميلك للقرب والجمال يبدأ اتجاهًا جديدًا، وما يريحك فعلًا يتضح شيئًا فشيئًا', 'قلبك يلتفت لشيء مختلف، فتمهّل ولا تتعجل التسمية'],
      ['حاجتك للمحبة والراحة في أعلى صدقها، وتعرف ما يشبهك', 'ما تحبه يظهر بوضوح، وما تتحمله فقط لإرضاء غيرك يصبح واضحًا أيضًا'],
      ['فصل من الألفة يوشك أن ينتهي أو يتحول، فاختر ما تستبقيه بوعي', 'جمالك الداخلي ينضج، وما لا يناسبك يطلب أن تتركه بهدوء']
    ],
    mars: [
      ['دافعك يبدأ اندفاعته الأولى، فاحرص أن تعرف وجهتك قبل أن تتحرك', 'طاقة الفعل تشتعل من جديد، وهي تحتاج هدفًا واحدًا'],
      ['دافعك في أقوى حالاته، وما تتحرك له الآن يحمل ثقلًا حقيقيًا', 'طاقتك مركزة وحادة، فاستخدمها لا لتكسب نقاشًا بل لتنجز شيئًا'],
      ['اندفاعك يقترب من منتهاه، وما بدأته يحتاج أن تكمله لا أن تبدأ غيره', 'الحماس يهدأ قليلًا، وهذا يعطيك رؤية أصدق لما يستحق جهدك']
    ]
  };
  var HS = [
    ['صورتك أمام الناس وطريقتك في البدء', 'ما تظهره عن نفسك وما تخفيه عند أول لقاء', 'حضورك وقرارك أن تبدأ بنفسك'],
    ['مالك وما تعتبره ثمينًا', 'إحساسك بقيمتك وما تملكه فعلًا', 'طريقتك في الصرف والادخار'],
    ['كلامك وما تكتبه وتسمعه', 'محيطك القريب من أخوة وجيران وطرق يومية', 'أفكارك الصغيرة التي تتحول إلى رسائل'],
    ['بيتك وأصلك وما تحمله من أهلك', 'ركن الأمان الذي تعود إليه', 'جذورك والمكان الذي تشعر فيه أنك بخير'],
    ['ما يسعدك دون سبب عملي', 'مرحك وإبداعك وحضورك العاطفي', 'طريقتك في الحب والمخاطرة اللطيفة'],
    ['عملك اليومي وعاداتك', 'ترتيب يومك والتزاماتك الصغيرة', 'ما تؤجله من مهام وروتين'],
    ['علاقتك الأقرب بشريك أو صديق مقرّب', 'من يقف أمامك ويعكس لك نفسك', 'اتفاقاتك مع الآخرين وحدودها'],
    ['ما تتشاركه مع غيرك من مال وثقة', 'ما يتغير بصمت داخلك', 'علاقتك بما تخاف فقده'],
    ['قناعاتك ونظرتك الأوسع للحياة', 'السفر والتعلم والسؤال الكبير عن المعنى', 'ما تؤمن به وتختبره'],
    ['عملك أمام الناس ومكانتك', 'ما تريد أن تُعرف به', 'طموحك وخطوتك التالية في مسارك'],
    ['أصدقاؤك وأحلامك البعيدة', 'الجماعة التي تشعر معها بالانتماء', 'ما تتمناه لنفسك ولمن حولك'],
    ['عالمك الداخلي الهادئ', 'حاجتك للخلوة والراحة بعيدًا عن الأعين', 'ما ترتّبه في صمتك قبل أن يظهر']
  ];
  var ACT = {
    moon: ['اكتب ما تشعر به قبل أن ترد على أحد.', 'اسمح لشعورك أن يمرّ دون أن تبني عليه قرارًا.'],
    sun: ['اختر أمرًا واحدًا واجعله أولويتك اليوم.', 'اسأل نفسك: ما الذي يستحق وقتي فعلًا؟'],
    mercury: ['أجّل الرد المهم ساعة، ثم أعد قراءته.', 'دوّن الفكرة قبل أن تضيع، وقرّر لاحقًا.'],
    venus: ['اختر ما يريحك فعلًا لا ما يرضي غيرك.', 'امنح نفسك شيئًا بسيطًا تحبه دون مبرر.'],
    mars: ['وجّه جهدك في خطوة واحدة واضحة.', 'قبل أن تتحرك، قل لنفسك لماذا، ثم تحرك.']
  };
  function seedOf(d, k) { var s = Math.floor(d.getTime() / 864e5); return (s * 7 + k * 13) | 0; }
  function phaseIx(deg) { return deg < 10 ? 0 : deg < 20 ? 1 : 2; }
  var PHN = ['درجات الاستهلال', 'درجات الذروة', 'درجات الاكتمال'];

  function now(ch) {
    var d = new Date();
    return window.Astro.chart({ utcMs: d.getTime(), lat: ch.lat, lon: ch.lon, known: false });
  }
  function body(c, key) { return c.bodies.filter(function (b) { return String(b.key).toLowerCase() === key; })[0]; }

  function readOne(ch, c, key, k, extraSeed) {
    var b = body(c, key); if (!b) return null;
    var lon = norm(b.lon), sg = Math.floor(lon / 30), deg = Math.floor(lon % 30), h = houseOf(ch, lon), p = phaseIx(deg), d = new Date();
    var s = Math.abs(seedOf(d, k) + (extraSeed || 0));
    var phase = PH[key][p][s % 2], house = HS[h - 1][s % 3];
    var edge = deg === 0 ? ' (في أول درجة من البرج)' : deg === 29 ? ' (في آخر درجة قبل الانتقال)' : '';
    var text = (Math.floor(s / 3) % 2 === 0) ? phase + '، وهذا يمسّ ' + house + '.' : 'يتجه الانتباه اليوم إلى ' + house + '، ' + phase + '.';
    return { key: key, name: PN[key], sign: SG[sg], deg: deg, house: h, phase: PHN[p], text: text + edge, act: ACT[key][(s >> 2) % 2], retro: !!b.retro, approx: !ch.known };
  }
  /* بطاقات اليوم: القمر دائمًا (يتبدّل كل ساعات)، ثم كوكبان من الشخصيين بالتناوب اليومي */
  function today(ch) {
    if (!ch || !window.Astro || !ch.bodies) return [];
    var c; try { c = now(ch); } catch (e) { return []; }
    var d = new Date(), blk = Math.floor(d.getHours() / 6), out = [];
    var mo = readOne(ch, c, 'moon', 1, blk * 5); if (mo) out.push(mo);
    var pool = ['sun', 'mercury', 'venus', 'mars'], st = Math.abs(seedOf(d, 3)) % 4;
    [0, 1].forEach(function (i) { var key = pool[(st + i) % 4], r = readOne(ch, c, key, 5 + i); if (r) out.push(r); });
    return out;
  }
  window.AqeeqLive = { vedic: vedic, today: today, houseOf: houseOf };
})();

;
/* assets/js/you-onboard.js */
/* شاشة البداية لأول دخول (بدون بيانات ميلاد) + حساب وتخزين مسبق للخرائط كي تُفتح فورًا */
(function () {
  'use strict';
  var PK = 'aqeeq_profile_cache_v1', CK = 'aqeeq_precalc_v1', SK = 'aq-ob-skip';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var user = function () { return (window.AqSession && window.AqSession.user) || null; };
  var mine = function () { try { var n = window.AqeeqChartContext && window.AqeeqChartContext.getMine(); return n && n.ch ? n : null; } catch (e) { return null; } };

  /* ---------- حساب وتخزين مسبق ---------- */
  function precalc() {
    var n = mine(); if (!n) return null;
    var key = (localStorage.getItem(PK) || '') + '|' + Math.floor(Date.now() / 864e5);
    try { var c = JSON.parse(localStorage.getItem(CK) || 'null'); if (c && c.k === key) return c; } catch (e) {}
    var out = { k: key, tropical: { asc: n.ch.known ? n.ch.asc : null, bodies: n.ch.bodies.map(function (b) { return { k: b.key, l: +b.lon.toFixed(4), h: b.house || 0 }; }) } };
    try { out.vedic = window.AqeeqLive && window.AqeeqLive.vedic(n.ch); } catch (e) {}
    try {
      var ds = String(n.d).padStart(2, '0') + '.' + String(n.m).padStart(2, '0') + '.' + n.y;
      var AD = window.AqeeqMatrixMethodAdapter; if (AD) { var m = AD.calculateDestinyMatrix(ds); out.matrix = m && m.anchors ? m.anchors : null; }
    } catch (e) {}
    try { localStorage.setItem(CK, JSON.stringify(out)); } catch (e) {}
    return out;
  }
  function warm() {
    var run = function () { try { precalc(); if (window.AqeeqYouWarm) window.AqeeqYouWarm(); } catch (e) {} };
    (window.requestIdleCallback || function (f) { setTimeout(f, 200); })(run, { timeout: 1500 });
  }
  window.AqeeqPrecalc = { run: precalc, warm: warm };

  /* ---------- الشاشة ---------- */
  var cities = null;
  function loadCities() {
    if (cities) return cities;
    var tmp = document.createElement('select'); try { tmp.innerHTML = window.AqeeqChartContext.cityOptionsHTML(); } catch (e) {}
    cities = [].map.call(tmp.querySelectorAll('option'), function (o) { return { n: o.textContent.trim(), s: (o.dataset.search || o.textContent).toLocaleLowerCase('ar') }; }).filter(function (c) { return c.n; });
    return cities;
  }
  function box(id, ph, len, lab) { return '<label class="ob-bx"><span>' + lab + '</span><input id="' + id + '" inputmode="numeric" maxlength="' + len + '" placeholder="' + ph + '" autocomplete="off"></label>'; }
  function open() {
    if ($('#ob-screen')) return;
    var el = document.createElement('div'); el.id = 'ob-screen'; el.setAttribute('dir', 'rtl'); el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML = '<div class="ob-card"><button type="button" class="ob-skip" id="ob-skip">لاحقًا</button>' +
      '<span class="ob-k">خطوة واحدة</span><h2>لنكتب خريطتك أنت</h2><p class="ob-p">أدخل بيانات ميلادك مرة واحدة، وكل ما في صفحتك سيُحسب عليك أنت.</p>' +
      '<p class="ob-l">تاريخ الميلاد</p><div class="ob-row">' + box('ob-d', 'يوم', 2, 'اليوم') + box('ob-m', 'شهر', 2, 'الشهر') + box('ob-y', 'سنة', 4, 'السنة') + '</div>' +
      '<p class="ob-l">وقت الميلاد</p><div class="ob-row ob-t" id="ob-trow">' + box('ob-h', 'ساعة', 2, 'الساعة') + box('ob-i', 'دقيقة', 2, 'الدقيقة') + '</div>' +
      '<label class="ob-tg"><input type="checkbox" id="ob-unk"><i></i><span>لا أعرف وقت ميلادي بالضبط</span></label>' +
      '<p class="ob-l">مدينة الميلاد</p><div class="ob-pl"><input id="ob-c" placeholder="ابحث باسم المدينة أو الدولة" autocomplete="off"><div class="ob-sg" id="ob-sg" hidden></div></div>' +
      '<p class="ob-err" id="ob-err" role="alert"></p><button type="button" class="ob-go" id="ob-go">احسب خريطتي</button>' +
      '<p class="ob-n">بياناتك تُحفظ على جهازك لتحسب قراءتك، ويمكنك تعديلها أو مسحها من الإعدادات.</p></div>';
    document.body.appendChild(el); document.documentElement.classList.add('ob-open');
    var c = $('#ob-c', el), sg = $('#ob-sg', el), unk = $('#ob-unk', el), err = $('#ob-err', el);
    [].forEach.call(el.querySelectorAll('.ob-bx input'), function (i) { i.addEventListener('input', function () { i.value = i.value.replace(/\D/g, ''); var ml = +i.maxLength; if (i.value.length >= ml && i.nextElementSibling === null) { var nx = i.closest('.ob-bx').nextElementSibling; if (nx) nx.querySelector('input').focus(); } else if (i.value.length >= ml) { var nb = i.closest('.ob-bx').nextElementSibling; if (nb) nb.querySelector('input').focus(); } }); });
    unk.addEventListener('change', function () { $('#ob-trow', el).classList.toggle('off', unk.checked); });
    function suggest() {
      var q = c.value.trim().toLocaleLowerCase('ar'); if (q.length < 2) { sg.hidden = true; return; }
      var r = loadCities().filter(function (x) { return x.s.indexOf(q) >= 0; }).slice(0, 6);
      sg.innerHTML = r.map(function (x) { return '<button type="button" data-n="' + esc(x.n) + '">' + esc(x.n) + '</button>'; }).join(''); sg.hidden = !r.length;
    }
    c.addEventListener('input', function () { c.dataset.ok = ''; suggest(); });
    sg.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; c.value = b.dataset.n; c.dataset.ok = '1'; sg.hidden = true; });
    $('#ob-skip', el).addEventListener('click', function () { try { sessionStorage.setItem(SK, '1'); } catch (e) {} close(); });
    $('#ob-go', el).addEventListener('click', function () {
      var d = +$('#ob-d', el).value, m = +$('#ob-m', el).value, y = +$('#ob-y', el).value, h = $('#ob-h', el).value, mi = $('#ob-i', el).value, noT = unk.checked, city = c.value.trim();
      var dt = new Date(y, m - 1, d);
      if (!d || !m || !y || y < 1900 || y > 2100 || dt.getDate() !== d || dt.getMonth() !== m - 1) { err.textContent = 'تأكد من تاريخ الميلاد (يوم وشهر وسنة).'; return; }
      if (!noT && (h === '' || mi === '' || +h > 23 || +mi > 59)) { err.textContent = 'أدخل الساعة والدقيقة، أو اختر أنك لا تعرف الوقت.'; return; }
      var hit = loadCities().filter(function (x) { return x.n.toLocaleLowerCase('ar') === city.toLocaleLowerCase('ar'); })[0] || (c.dataset.ok ? { n: city } : null);
      if (!hit) { err.textContent = 'اختر مدينتك من الاقتراحات التي تظهر أثناء الكتابة.'; return; }
      var pad = function (x) { return String(x).padStart(2, '0'); }, u = user(), nm = (u && u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) || '';
      try { localStorage.setItem(PK, JSON.stringify({ name: nm, date: y + '-' + pad(m) + '-' + pad(d), time: noT ? '12:00' : pad(h) + ':' + pad(mi), noTime: noT, city: hit.n })); } catch (e) {}
      var btn = $('#ob-go', el); btn.disabled = true;
      var n = mine(); if (!n) { btn.disabled = false; err.textContent = 'تعذّر حساب الخريطة لهذه المدينة، جرّب مدينة أقرب.'; return; }
      try { localStorage.removeItem(CK); } catch (e) {} precalc();
      document.dispatchEvent(new Event('aqeeq:natal-ready')); document.dispatchEvent(new Event('aq:session'));
      close(); warm();
    });
    setTimeout(function () { $('#ob-d', el).focus(); }, 120);
  }
  function close() { var e = $('#ob-screen'); if (e) e.remove(); document.documentElement.classList.remove('ob-open'); }
  function check() {
    if (!user()) return;
    if (mine()) { warm(); return; }
    var skipped = false; try { skipped = sessionStorage.getItem(SK) === '1'; } catch (e) {}
    if (!skipped && window.AqeeqChartContext) open();
  }
  document.addEventListener('aq:session', function () { setTimeout(check, 300); });
  window.addEventListener('load', function () { setTimeout(check, 900); });
  window.AqeeqOnboard = { open: open };
})();
document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('[data-ob]'); if (!a || !window.AqeeqOnboard) return; e.preventDefault(); try { sessionStorage.removeItem('aq-ob-skip'); } catch (x) {} window.AqeeqOnboard.open(); });

;
/* assets/js/you-page.js */
/* صفحة «أنت» بعد تسجيل الدخول: صفحة مستقلة (عبوراتك + نمطك + المجالات). واجهة فقط، النصوص مؤقتة. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var SVG = function (p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
  var DAY = 864e5, MONTH = 30.44 * DAY;
  var DOMAINS = [
    { id: 'love', t: 'علاقاتك', s: 'الجذب والقرب وما يخصّ شريكك', i: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/>' },
    { id: 'self', t: 'هويتك ومصيرك', s: 'من أنت وإلى أين تمضي', i: '<circle cx="12" cy="8" r="3.500"/><path d="M5 20a7 7 0 0 1 14 0"/>' },
    { id: 'growth', t: 'نموك وصلابتك', s: 'ما يختبرك ويقوّيك مع الوقت', i: '<path d="M12 21V9"/><path d="M12 13c0-3 2-5 6-5 0 3-2 5-6 5z"/><path d="M12 16c0-2.500-1.800-4-5-4 0 2.500 1.800 4 5 4z"/>' },
    { id: 'work', t: 'عملك وبيتك', s: 'مسارك المهني وأمانك الداخلي', i: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>' }
  ];
  var ST = { all: false, tab: 'home', ht: 'day', year: new Date().getFullYear(), view: null, memo: null };
  var TXT = ['sun', 'moon', 'mercury', 'venus', 'mars', 'saturn'];
  function loadTexts() {
    if (ST.ix || ST.ixLoading) return; ST.ixLoading = true;
    Promise.all(TXT.map(function (b) { return fetch('data/interpretations/' + b + '.json?v=20261114b').then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; }); })).then(function (ls) {
      var ix = {}; ls.forEach(function (a) { (Array.isArray(a) ? a : []).forEach(function (e) { if (e && e.id && e.status === 'approved' && e.text) ix[e.id] = e; }); });
      ST.ix = ix; ST.ixLoading = false; render();
    });
  }
  var coreOf = function (p) {
    var ch = natal(); if (!ch || !ST.ix || !ch.known) return null;
    var b = ch.bodies.filter(function (x) { return x.key === p.id; })[0]; if (!b || !b.house) return null;
    var e = ST.ix['natal.core.' + p.id + '.house' + b.house]; return e ? { e: e, house: b.house } : null;
  };
  var headOf = function (e) { var t = String(e.summary || ''); var i = t.indexOf(':'); t = i > -1 ? t.slice(i + 1).trim() : t; var j = t.indexOf('.'); return (j > 8 ? t.slice(0, j) : t); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var user = function () { return (window.AqSession && window.AqSession.user) || null; };
  var natal = function () { try { var n = window.AqeeqChartContext && window.AqeeqChartContext.getMine(); return n && n.ch ? n.ch : null; } catch (e) { return null; } };
  var fmtM = function (ms) { return new Date(ms).toLocaleDateString('ar-EG-u-nu-latn', { month: 'long', year: 'numeric' }); };
  var fmtD = function (ms) { return new Date(ms).toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }); };
  var domOf = function (id) { return DOMAINS.filter(function (d) { return d.id === id; })[0]; };
  function selMs() { return ST.date || Date.now(); }
  function allCycles() {
    var ch = natal(); if (!ch || !window.AqeeqYou || typeof Astro === 'undefined') return null;
    var key = Math.floor(selMs() / DAY) + '|' + ch.bodies[0].lon;
    if (!ST.memo || ST.memo.k !== key) ST.memo = { k: key, list: window.AqeeqYou.cycles(ch, Math.floor(selMs() / DAY) * DAY) };
    return ST.memo.list;
  }
  function split(list) {
    var now = selMs(), cur = [], up = [];
    list.forEach(function (c) { if (c.start <= now && c.end >= now) cur.push(c); else if (c.start > now && c.start <= now + 365 * DAY) up.push(c); });
    cur.sort(function (a, b) { return a.end - b.end; }); up.sort(function (a, b) { return a.start - b.start; });
    return { cur: cur, up: up };
  }
  function unitAr(n, w) { var t = w === 'شهر' ? ['شهر', 'شهران', 'أشهر', 'شهرًا'] : ['يوم', 'يومان', 'أيام', 'يومًا']; return n === 1 ? t[0] : n === 2 ? t[1] : n <= 10 ? t[2] : t[3]; }
  function ring(c, up) {
    var now = selMs(), left = Math.max(0, c.end - now), n, u;
    if (up) { n = Math.max(1, Math.round((c.start - now) / MONTH)); u = unitAr(n, 'شهر'); } else { n = left > 2 * MONTH ? Math.round(left / MONTH) : Math.max(1, Math.round(left / DAY)); u = unitAr(n, left > 2 * MONTH ? 'شهر' : 'يوم'); }
    var frac = up ? 0.12 : Math.min(1, Math.max(0.05, (now - c.start) / (c.end - c.start))), R = 38, L = 2 * Math.PI * R;
    return '<div class="yp-ring' + (up ? ' up' : '') + '"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="bg" cx="50" cy="50" r="' + R + '"/><circle class="fg" cx="50" cy="50" r="' + R + '" stroke-dasharray="' + (L * frac).toFixed(1) + ' ' + L.toFixed(1) + '" transform="rotate(-90 50 50)"/></svg><span><i>' + (up ? 'بعد' : 'باقي') + '</i><b>' + n + '</b><i>' + u + '</i></span></div>';
  }

  /* عناوين وصفية للدورات: طبيعة الكوكب العابر + مجال النقطة المتأثرة */
  var TH = {
    jupiter: { conj: 'بداية تتّسع', soft: 'باب مفتوح', hard: 'حماس يتجاوز حدّه' },
    saturn: { conj: 'لحظة جدّية', soft: 'ثبات يُبنى', hard: 'اختبار للصبر' },
    uranus: { conj: 'تغيير مفاجئ', soft: 'تحرّر مما اعتدته', hard: 'تمرّد على الثابت' },
    neptune: { conj: 'ضباب يطلب وضوحًا', soft: 'حدس يزداد', hard: 'وهم يُختبر' },
    pluto: { conj: 'إعادة بناء من الجذور', soft: 'قوة هادئة تتشكّل', hard: 'مواجهة ما تخفيه' },
    truenode: { conj: 'اتجاه جديد', hard: 'شدّ بين القديم والجديد' },
    chiron: { conj: 'جرح يطلب الالتفات', soft: 'شفاء بطيء', hard: 'حساسية قديمة تُستثار' }
  };
  var AREA = { sun: 'هويتك', moon: 'مشاعرك', mercury: 'تفكيرك', venus: 'علاقاتك وما تحب', mars: 'دافعك', jupiter: 'ثقتك وتوسّعك', saturn: 'مسؤولياتك', asc: 'حضورك أمام الناس', mc: 'مسارك المهني', desc: 'شريكك', ic: 'بيتك وجذورك' };
  function titleOf(c) {
    var cls = c.asp === 'conj' ? 'conj' : (c.asp === 'sext' || c.asp === 'tri' ? 'soft' : 'hard'), t = TH[c.t] || {};
    return (t[cls] || t.hard || t.conj || 'دورة مؤقتة') + ' في ' + (AREA[c.n] || c.nn);
  }
  function astroLine(c) { return c.tn + ' ' + c.an + ' ' + c.nn + ' في خريطتك'; }
  function slidesOf(text) {
    return String(text || '').split(/\n\n+/).map(function (p) {
      var m = /^\*\*(.+?)\*\*\n?([\s\S]*)$/.exec(p.trim()); return m ? { t: m[1], b: m[2].trim() } : { t: '', b: p.trim() };
    }).filter(function (x) { return x.b || x.t; });
  }
  function readerOpen(title, kicker, text) {
    var sl = slidesOf(text); if (!sl.length) return;
    var old = document.getElementById('yp-reader'); if (old) old.remove();
    var el = document.createElement('div'); el.id = 'yp-reader'; el.className = 'yp-rd'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML = '<div class="yp-rd-top"><button type="button" class="yp-rd-x" data-rd-close aria-label="إغلاق">' + SVG('<path d="M6 6l12 12M18 6L6 18"/>') + '</button><div class="yp-rd-k"><small>' + esc(kicker) + '</small><b>' + esc(title) + '</b></div></div>' +
      '<div class="yp-rd-track" tabindex="0">' + sl.map(function (x, i) { return '<section class="yp-rd-s"><i dir="ltr">' + (i + 1) + ' / ' + sl.length + '</i>' + (x.t ? '<h4>' + esc(x.t) + '</h4>' : '') + '<p>' + esc(x.b).replace(/\n/g, '<br>') + '</p></section>'; }).join('') + '</div>' +
      '<div class="yp-rd-dots">' + sl.map(function (_, i) { return '<span' + (i === 0 ? ' class="on"' : '') + '></span>'; }).join('') + '</div>' +
      '<div class="yp-rd-nav"><button type="button" data-rd="1">السابق</button><button type="button" data-rd="-1" class="go">التالي</button></div>';
    document.body.appendChild(el); document.documentElement.classList.add('yp-rd-open');
    var tr = el.querySelector('.yp-rd-track'), dots = el.querySelectorAll('.yp-rd-dots span');
    function idx() { return Math.round(Math.abs(tr.scrollLeft) / tr.clientWidth); }
    tr.addEventListener('scroll', function () { var k = idx(); dots.forEach(function (d, j) { d.classList.toggle('on', j === k); }); });
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-rd-close]')) { readerClose(); return; }
      var b = e.target.closest('[data-rd]'); if (!b) return;
      var k = Math.min(sl.length - 1, Math.max(0, idx() + (b.getAttribute('data-rd') === '-1' ? 1 : -1)));
      tr.scrollTo({ left: -k * tr.clientWidth, behavior: 'smooth' });
    });
  }
  function readerClose() { var el = document.getElementById('yp-reader'); if (el) el.remove(); document.documentElement.classList.remove('yp-rd-open'); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') readerClose(); });
  window.addEventListener('hashchange', readerClose);
  function durAr(ms) {
    var m = Math.max(1, Math.round(ms / MONTH)), y = Math.floor(m / 12), r = m % 12, out = [];
    if (y) out.push(y === 1 ? 'سنة' : y === 2 ? 'سنتان' : y + (y <= 10 ? ' سنوات' : ' سنة'));
    if (r) out.push(r === 1 ? 'شهر' : r === 2 ? 'شهران' : r + (r <= 10 ? ' أشهر' : ' شهرًا'));
    return out.join(' و');
  }
  function timeline(c) {
    var now = selMs(), pk = c.peaks[0], pm = pk ? Math.round((pk.a + Math.max(pk.a, pk.b)) / 2) : Math.round((c.start + c.end) / 2);
    var span = c.end - c.start, pos = function (t) { return Math.min(100, Math.max(0, (t - c.start) / span * 100)); }, np = pos(now), pp = pos(pm);
    var st = now < c.start ? 'تبدأ قريبًا' : now > c.end ? 'انتهت' : 'أنت هنا الآن';
    var node = function (k, t, at) { var on = (k === 'البداية' && now >= c.start) || (k === 'الذروة' && now >= pm) || (k === 'النهاية' && now >= c.end); return '<div class="yp-tl-n' + (on ? ' on' : '') + (k === 'الذروة' && (pp < 26 || pp > 74) ? ' up' : '') + '" style="inset-inline-start:' + at + '%"><i></i><b>' + k + '</b><small>' + fmtM(t) + '</small></div>'; };
    return '<div class="yp-tl"><span class="yp-tl-dur">' + SVG('<circle cx="12" cy="12" r="8.500"/><path d="M12 7.500V12l3 2"/>') + 'مدة العبور: ' + durAr(span) + '</span>' +
      '<div class="yp-tl-track"><span class="yp-tl-fill" style="width:' + np + '%"></span>' + node('البداية', c.start, 0) + node('الذروة', pm, pp) + node('النهاية', c.end, 100) + (now >= c.start && now <= c.end ? '<span class="yp-tl-now" style="inset-inline-start:' + np + '%"></span>' : '') + '</div><p class="yp-tl-st">' + st + '</p></div>';
  }
  function phases(c) {
    var pk = c.peaks[0], a = pk ? pk.a : (c.start + c.end) / 2, b = pk ? Math.max(pk.b, a) : a;
    return '<div class="yp-ph">' + [['الاقتراب', c.start, a], ['الذروة', a, b], ['الانحسار', b, c.end]].map(function (x) {
      return '<div><b>' + x[0] + '</b><small>' + fmtM(x[1]) + (x[2] - x[1] > 20 * DAY ? ' – ' + fmtM(x[2]) : '') + '</small></div>';
    }).join('') + '</div>';
  }

  /* حفظ ومشاركة: على هذا الجهاز فقط، ويُمسح عند الخروج */
  var SAVE_KEY = 'aqeeq_yp_saved_v1';
  function saved() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || '[]'); } catch (e) { return []; } }
  function actBar(id, title) {
    var on = saved().indexOf(id) >= 0;
    return '<div class="yp-act"><button type="button" class="yp-ab' + (on ? ' on' : '') + '" data-save="' + esc(id) + '" aria-pressed="' + on + '">' + SVG('<path d="M7 4h10v16l-5-3.500L7 20z"/>') + '<span>' + (on ? 'محفوظة' : 'احفظ') + '</span></button>' +
      '<button type="button" class="yp-ab" data-share="' + esc(title) + '">' + SVG('<circle cx="18" cy="5.500" r="2.500"/><circle cx="6" cy="12" r="2.500"/><circle cx="18" cy="18.500" r="2.500"/><path d="M8.300 10.800l7.400-4M8.300 13.200l7.400 4"/>') + '<span>شارك</span></button></div>';
  }
  var GLY = { jupiter: '\u2643', saturn: '\u2644', uranus: '\u2645', neptune: '\u2646', pluto: '\u2647', truenode: '\u260A', chiron: '\u26B7' };
  function gly(t) { return '<span class="yp-gl" aria-hidden="true">' + (GLY[t] || '\u2736') + '\uFE0E</span>'; }
  function progOf(c) { var now = selMs(); return c.start > now ? 0 : Math.min(1, Math.max(0, (now - c.start) / (c.end - c.start))); }
  function cardHtml(c, up) {
    var pr = Math.round(progOf(c) * 100);
    return '<button type="button" class="yp-cx" data-cyc="' + esc(c.id + '|' + c.start) + '"><span class="yp-cx-pill">' + gly(c.t) + '<span>' + c.tn + ' \u00b7 ' + c.an + ' \u00b7 ' + c.nn + '</span></span><b class="yp-cx-t">' + esc(titleOf(c)) + '</b><span class="yp-cx-bar" aria-hidden="true"><i style="width:' + pr + '%"></i></span><small class="yp-cx-d">' + fmtM(c.start) + ' \u2013 ' + fmtM(c.end) + '</small></button>';
  }
  function cyclesHtml(list, cap) {
    var s = split(list), h = '';
    var more = '';
    if (cap && !ST.all && (s.cur.length > 6 || s.up.length > 3)) { s.cur = s.cur.slice(0, 6); s.up = s.up.slice(0, 3); more = '<button type="button" class="yp-more" data-all>عرض كل الدورات</button>'; }
    h += '<p class="yp-lab">دورات جارية</p>' + (s.cur.length ? '<div class="yp-list">' + s.cur.map(function (c) { return cardHtml(c, false); }).join('') + '</div>' : '<div class="yp-empty"><p>لا توجد دورة جارية في هذا التاريخ.</p></div>');
    if (s.up.length) h += '<p class="yp-lab">دورات قادمة</p><div class="yp-list">' + s.up.map(function (c) { return cardHtml(c, true); }).join('') + '</div>';
    return h + more;
  }
  function domainCards(label) {
    return '<p class="yp-lab">' + label + '</p><div class="yp-doms">' + DOMAINS.map(function (d) {
      return '<button type="button" class="yp-dom" data-dom="' + d.id + '"><span class="yp-dom-i" data-d="' + d.id + '">' + SVG(d.i) + '</span><span class="yp-dom-t"><b>' + d.t + '</b><small>' + d.s + '</small></span><span class="yp-dom-go">' + SVG('<path d="M15 6l-6 6 6 6"/>') + '</span></button>';
    }).join('') + '</div>';
  }
  function needNatal(m) { return '<div class="yp-empty">' + SVG('<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3 2"/>') + '<p>' + (m || 'أدخل بيانات ميلادك مرة واحدة لتظهر عبورات خريطتك.') + '</p><a class="yp-btn" href="#chart" data-ob>أدخل بيانات ميلادك</a></div>'; }
  var MON = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  function timeTravel() {
    var d = new Date(selMs()), today = !ST.date;
    return '<div class="yp-tt"><button type="button" class="yp-tt-l" data-tt-open aria-haspopup="dialog"><span class="yp-tt-i">' + SVG('<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3 2"/>') + '</span>السفر بالزمن</button><div class="yp-tt-d"><b>' + (today ? 'اليوم' : fmtD(selMs())) + '</b><small>' + (today ? 'دورات مؤقتة تغيّر فيك شيئًا' : 'تعرض دورات هذا التاريخ') + '</small></div></div>' + (today ? '' : '<p class="yp-asof">كما في ' + fmtD(selMs()) + '</p>');
  }
  function ttSheet() {
    var old = $('#yp-ttsheet'); if (old) old.remove();
    var d = new Date(selMs()), y0 = new Date().getFullYear(), o = function (a, b, cur, lab) { var h = ''; for (var k = a; k <= b; k++) h += '<option value="' + k + '"' + (k === cur ? ' selected' : '') + '>' + (lab ? lab(k) : k) + '</option>'; return h; };
    var el = document.createElement('div'); el.id = 'yp-ttsheet'; el.className = 'yp-tts';
    el.innerHTML = '<div class="yp-tts-bd" data-tt-close></div><div class="yp-tts-sh" role="dialog" aria-modal="true" aria-label="السفر بالزمن"><span class="yp-tts-g"></span><h3>السفر بالزمن</h3><p>اختر تاريخًا لترى دورات خريطتك فيه.</p>' +
      '<div class="yp-tts-r"><label>اليوم<select id="yp-td">' + o(1, 31, d.getDate()) + '</select></label><label>الشهر<select id="yp-tm">' + o(0, 11, d.getMonth(), function (k) { return MON[k]; }) + '</select></label><label>السنة<select id="yp-ty">' + o(y0 - 1, y0 + 2, d.getFullYear()) + '</select></label></div>' +
      '<button type="button" class="yp-cta" data-tt-set>تطبيق التاريخ</button><button type="button" class="yp-more" data-tt-today>العودة إلى اليوم</button></div>';
    document.body.appendChild(el); requestAnimationFrame(function () { el.classList.add('on'); });
  }
  function ttClose() { var el = $('#yp-ttsheet'); if (!el) return; el.classList.remove('on'); setTimeout(function () { el.remove(); }, 250); }
  function placeCards(dom, max) {
    var ch = natal(); if (!ch || !window.AqeeqYou) return '';
    var act = {}; (allCycles() || []).forEach(function (c) { if (c.start <= selMs() && c.end >= selMs()) act[c.n] = 1; });
    var pl = window.AqeeqYou.placements(ch).filter(function (p) { return typeof dom === 'function' ? dom(p) : (!dom || p.dom === dom); });
    if (typeof dom === 'function') pl.sort(function (a, b) { return (act[b.id] ? 1 : 0) - (act[a.id] ? 1 : 0); });
    if (max) pl = pl.slice(0, max);
    return pl.map(function (p) {
      var c = coreOf(p); if (!c) return '';
      return '<button type="button" class="yp-pl" data-pl="' + p.id + '"><span class="yp-pl-h"><span class="yp-chip blue">' + p.nn + '</span>' + (act[p.id] ? '<em class="yp-act-t">نشِط الآن</em>' : '') + '<small>' + p.sign + ' · البيت ' + c.house + '</small></span><b>' + esc(headOf(c.e)) + '</b></button>';
    }).join('');
  }
  function back(label) { return '<button type="button" class="yp-back" data-back>' + SVG('<path d="M9 6l6 6-6 6"/>') + label + '</button>'; }
  function avatar(u, name) {
    var im = $('#profile-summary-avatar img'), m = u.user_metadata || {}, src = (im && im.getAttribute('src')) || m.avatar_url || m.picture || '';
    return src ? '<img src="' + esc(src) + '" alt="">' : esc(String(name).charAt(0));
  }
  var isOwner = function () { return !!(window.AqSession && window.AqSession.isAdmin); };
  function planChip() {
    return '<span class="yp-plan' + (isOwner() ? ' owner' : '') + '">' + SVG(isOwner() ? '<path d="M12 3l7 3v5c0 4.500-3 8-7 10-4-2-7-5.500-7-10V6z"/><path d="M9 12l2 2 4-4"/>' : '<circle cx="12" cy="12" r="8.500"/><path d="M12 8v8M8 12h8"/>') + (isOwner() ? 'المالك · كل شيء مفتوح' : 'الخطة المجانية') + '</span>';
  }
  function isPrivate() { try { return localStorage.getItem('aqeeq_private_v1') === '1'; } catch (_) { return false; } }

  /* تفضيلات التنبيهات: تُحفظ على هذا الجهاز، والمعاينة توضّح شكل الرسالة */
  var NF_KEY = 'aqeeq_yp_notif_v1', NF_ITEMS = [['day', 'سماء يومك', 'بطاقة قصيرة كل صباح عن طاقة يومك.', 'يومك يطلب منك شيئًا واحدًا: ابدأ به قبل أي شيء.'], ['near', 'عبور يقترب', 'تنبيه قبل أن تبدأ دورة جديدة في خريطتك.', 'دورة جديدة تقترب منك. جهّز نفسك قبل أن تصل.'], ['peak', 'ذروة العبور', 'إشارة حين تبلغ دورة جارية أقوى لحظاتها.', 'الدورة التي تمرّ بك بلغت ذروتها هذا الأسبوع.']];
  function nfGet() { var d = { day: true, near: true, peak: false, time: '08:00' }; try { var o = JSON.parse(localStorage.getItem(NF_KEY) || '{}'); for (var k in o) d[k] = o[k]; } catch (e) {} return d; }
  function nfSet(k, v) { var o = nfGet(); o[k] = v; try { localStorage.setItem(NF_KEY, JSON.stringify(o)); } catch (e) {} }
  function nfHtml() {
    var o = nfGet();
    return '<div class="yp-set-g"><p class="yp-lab">التنبيهات</p>' + NF_ITEMS.map(function (x) {
      return '<label class="yp-set-row yp-sw"><div><b>' + x[1] + '</b><small>' + x[2] + '</small></div><input type="checkbox" data-nf="' + x[0] + '"' + (o[x[0]] ? ' checked' : '') + '><span class="yp-sw-t" aria-hidden="true"></span></label>';
    }).join('') +
      '<div class="yp-set-row"><div><b>وقت التنبيه</b><small>الساعة التي تصلك فيها الرسائل.</small></div><select class="yp-nf-t" data-nf-time aria-label="وقت التنبيه">' + ['06:00', '07:00', '08:00', '09:00', '12:00', '18:00', '21:00'].map(function (t) { return '<option value="' + t + '"' + (o.time === t ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></div>' +
      '<button type="button" class="yp-ab yp-nf-pv" data-nf-prev>' + SVG('<path d="M3 12s3.500-6 9-6 9 6 9 6-3.500 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="2.500"/>') + '<span>معاينة التنبيه</span></button></div>';
  }
  function nfPreview() {
    var old = document.getElementById('yp-nfp'); if (old) old.remove();
    var o = nfGet(), on = NF_ITEMS.filter(function (x) { return o[x[0]]; }), it = on[0] || NF_ITEMS[0];
    var el = document.createElement('div'); el.id = 'yp-nfp'; el.className = 'yp-tts'; 
    el.innerHTML = '<div class="yp-tts-bd" data-nfp-x></div><div class="yp-tts-sh" role="dialog" aria-modal="true" aria-label="معاينة التنبيه"><i class="yp-tts-g"></i><h3>هكذا يصلك التنبيه</h3><div class="yp-nfp-c"><span class="yp-nfp-i">' + SVG('<path d="M12 3l2.200 5.600 5.800.500-4.400 3.900 1.400 5.700L12 15.600 7 18.700l1.400-5.700L4 9.100l5.800-.500z"/>') + '</span><div><small>عقيق أسترو · ' + esc(o.time) + '</small><b>' + esc(it[1]) + '</b><p>' + esc(it[3]) + '</p></div></div>' + (on.length ? '' : '<p>كل التنبيهات متوقفة الآن.</p>') + '<button type="button" class="yp-btn" data-nfp-x>تمام</button></div>';
    document.body.appendChild(el); requestAnimationFrame(function () { el.classList.add('on'); });
  }
  function nfClose() { var el = document.getElementById('yp-nfp'); if (!el) return; el.classList.remove('on'); setTimeout(function () { el.remove(); }, 260); }

  /* ---------- هيدر أنت: اليوزر، المحفوظات، صندوق الإشعارات ---------- */
  var UN_KEY = 'aqeeq_username_v1', INB_KEY = 'aqeeq_yp_inbseen_v1';
  function unGet(u) { try { var v = localStorage.getItem(UN_KEY); if (v) return v; } catch (e) {} var b = String((u && u.email) || 'user').split('@')[0].toLowerCase().replace(/[^a-z0-9._]/g, ''); return b.length >= 3 ? b.slice(0, 20) : 'user' + String((u && u.id) || '0').replace(/[^a-z0-9]/gi, '').slice(0, 5).toLowerCase(); }
  var unSynced = '';
  function unSync(u) {
    var sb = window.aqeeqSupabase; if (!u || !sb || !sb.from || unSynced === u.id) return; unSynced = u.id;
    sb.from('usernames').select('username').eq('user_id', u.id).maybeSingle().then(function (r) {
      var n = r && r.data && r.data.username; if (!n) return;
      var old = ''; try { old = localStorage.getItem(UN_KEY) || ''; localStorage.setItem(UN_KEY, n); } catch (e) {}
      if (old !== n) render();
    }, function () {});
  }
  function unOk(v) { return /^[a-z][a-z0-9._]{2,19}$/.test(v); }
  function inbSeen() { try { return JSON.parse(localStorage.getItem(INB_KEY) || '[]'); } catch (e) { return []; } }
  function inbItems() {
    var out = [], now = Date.now(), d = new Date(), key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    if (natal()) out.push({ id: 'sky:' + key, ic: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.600 5.600l1.400 1.400M17 17l1.400 1.400M5.600 18.400 7 17M17 7l1.400-1.400"/>', t: 'سماء يومك جاهزة', x: 'سبع بطاقات قصيرة عن طاقة اليوم تخصّك أنت.', go: 'sky' });
    var cy = allCycles() || [];
    cy.forEach(function (c) {
      var dd = (c.start - now) / DAY;
      if (dd > 0 && dd <= 14) out.push({ id: 'near:' + c.id + c.start, ic: '<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3 2"/>', t: 'عبور يقترب: ' + titleOf(c), x: 'يبدأ ' + fmtD(c.start) + '. اقرأ ما يحمله لك قبل أن يصل.', cyc: c.id + '|' + c.start });
      else if (dd <= 0 && dd > -4 && c.end > now) out.push({ id: 'new:' + c.id + c.start, ic: '<path d="M12 3l2.200 5.600 5.800.500-4.400 3.900 1.400 5.700L12 15.600 7 18.700l1.400-5.700L4 9.100l5.800-.500z"/>', t: 'بدأ عبورك: ' + titleOf(c), x: 'هذه أيام بدايته، وهي الأوضح في الإحساس.', cyc: c.id + '|' + c.start });
    });
    return out;
  }
  function inbUnread() { var sn = inbSeen(); return inbItems().filter(function (i) { return sn.indexOf(i.id) < 0; }).length; }
  function inboxHtml() {
    var sn = inbSeen(), items = inbItems();
    try { localStorage.setItem(INB_KEY, JSON.stringify(items.map(function (i) { return i.id; }))); } catch (e) {}
    if (!items.length) return '<div class="yp-empty">' + SVG('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.500 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>') + '<p>لا جديد الآن. هنا يتجمّع كل ما لم تره: توقّع لك أو رسالة أو عبور يقترب.</p></div>';
    return '<div class="yp-inb">' + items.map(function (i) {
      var a = i.cyc ? 'data-cyc="' + esc(i.cyc) + '"' : 'data-go="' + i.go + '"';
      return '<button type="button" class="yp-inb-i' + (sn.indexOf(i.id) < 0 ? ' new' : '') + '" ' + a + '><span class="yp-inb-ic">' + SVG(i.ic) + '</span><span class="yp-inb-t"><b>' + esc(i.t) + '</b><small>' + esc(i.x) + '</small></span></button>';
    }).join('') + '</div>';
  }
  function savedHtml() {
    var L = saved(), cy = allCycles() || [], h = '', now = Date.now();
    var cards = L.map(function (id) { var c = cy.filter(function (x) { return x.id + '|' + x.start === id; })[0]; return c ? cardHtml(c, c.start > now) : ''; }).join('');
    var uid = (user() || {}).id, arts = [];
    try { arts = JSON.parse(localStorage.getItem('aqh-saved:' + (uid || 'guest')) || '[]'); } catch (e) {}
    var ah = arts.map(function (sl) { var a = window.FeaturedContent && window.FeaturedContent.get(sl); return a ? '<a class="yp-sv-a" href="#featured-content/' + esc(a.slug) + '"><span class="yp-sv-img"><img src="' + esc(a.coverImage) + '" alt="" loading="lazy"></span><span><b>' + esc(a.title) + '</b><small>' + esc(a.category) + '</small></span></a>' : ''; }).join('');
    if (cards) h += '<p class="yp-lab">دورات وقراءات حفظتها</p><div class="yp-list">' + cards + '</div>';
    if (ah) h += '<p class="yp-lab">مقالات مميزة</p><div class="yp-sv-l">' + ah + '</div>';
    return h || '<div class="yp-empty">' + SVG('<path d="M6 4h12v16l-6-4-6 4z"/>') + '<p>لم تحفظ شيئًا بعد. كل ما تحفظه من مقالات وقراءات وما تشتريه سيجتمع هنا.</p></div>';
  }
  function topHtml(u, name) {
    unSync(u); var un = unGet(u), n = inbUnread();
    var ib = function (a, lab, ico, badge) { return '<button type="button" class="yp-ib" ' + a + ' aria-label="' + lab + '">' + SVG(ico) + (badge ? '<i>' + (badge > 9 ? '9+' : badge) + '</i>' : '') + '<em>' + lab + '</em></button>'; };
    return '<header class="yp-top"><button type="button" class="yp-who-b" data-set aria-label="الملف الشخصي"><span class="yp-av yp-av-b"><span class="yp-av-i">' + avatar(u, name) + '</span></span><span class="yp-who-t"><b>' + esc(name) + '</b><small dir="ltr">@' + esc(un) + '</small></span></button>' +
      '<div class="yp-ibs">' + ib('data-sv', 'الحفظ', '<path d="M6 4h12v16l-6-4-6 4z"/>', 0) + ib('data-inb', 'الإشعارات', '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.500 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>', n) + ib('data-tab="settings"', 'الإعدادات', '<circle cx="12" cy="12" r="3.200"/><path d="M19.400 15a1.700 1.700 0 0 0 .340 1.870l.060.060a2 2 0 1 1-2.830 2.830l-.060-.060a1.700 1.700 0 0 0-1.870-.340 1.700 1.700 0 0 0-1.030 1.560V21a2 2 0 1 1-4 0v-.090a1.700 1.700 0 0 0-1.110-1.560 1.700 1.700 0 0 0-1.870.340l-.060.060a2 2 0 1 1-2.830-2.830l.060-.060a1.700 1.700 0 0 0 .340-1.870 1.700 1.700 0 0 0-1.560-1.030H3a2 2 0 1 1 0-4h.090a1.700 1.700 0 0 0 1.560-1.110 1.700 1.700 0 0 0-.340-1.870l-.060-.060a2 2 0 1 1 2.830-2.830l.060.060a1.700 1.700 0 0 0 1.870.340h.010a1.700 1.700 0 0 0 1.030-1.560V3a2 2 0 1 1 4 0v.090a1.700 1.700 0 0 0 1.030 1.560 1.700 1.700 0 0 0 1.870-.340l.060-.060a2 2 0 1 1 2.830 2.830l-.060.060a1.700 1.700 0 0 0-.340 1.870v.010a1.700 1.700 0 0 0 1.560 1.030H21a2 2 0 1 1 0 4h-.090a1.700 1.700 0 0 0-1.560 1.030z"/>', 0) + '</div></header>';
  }


  /* ---------- نحن: أنت والطرف الآخر (شريك/صديق...) من بياناته فقط، بدون ربط حسابات ---------- */
  var PK = 'aqeeq_yp_partners_v1', RELS = [['partner', 'شريك'], ['friend', 'صديق'], ['family', 'من العائلة'], ['work', 'زميل عمل']];
  function pGet() { try { return JSON.parse(localStorage.getItem(PK) || '[]'); } catch (e) { return []; } }
  function pSet(l) { try { localStorage.setItem(PK, JSON.stringify(l)); } catch (e) {} }
  function relName(k) { var r = RELS.filter(function (x) { return x[0] === k; })[0]; return r ? r[1] : 'شريك'; }
  var PCH = {};
  function pChart(p) {
    if (PCH[p.id]) return PCH[p.id];
    try {
      var C = window.__aqCITIES && window.__aqCITIES(), i = window.AqeeqChartContext.cityIndexByName(p.city), c = C && C[i]; if (!c) return null;
      var d = p.date.split('-').map(Number), known = !!p.time, t = (p.time || '12:00').split(':').map(Number);
      var utc = Astro.localToUtcMs(d[0], d[1], d[2], t[0], t[1], c.tz);
      return (PCH[p.id] = Astro.chart({ utcMs: utc, lat: c.lat, lon: c.lon, hs: 'placidus', known: known }));
    } catch (e) { return null; }
  }
  var SYN_N = { sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ', jupiter: 'المشتري', saturn: 'زحل' };
  var SYN_ROLE = { sun: 'جوهرك وإحساسك بنفسك', moon: 'مشاعرك وما يؤمّنك', mercury: 'طريقة كلامك وتفكيرك', venus: 'حبّك وما تحب', mars: 'اندفاعك ورغبتك', jupiter: 'تفاؤلك وما يوسّعك', saturn: 'جدّيتك وحدودك' };
  var SYN_ROLE2 = { sun: 'جوهر', moon: 'مشاعر وأمان', mercury: 'كلام وتفكير', venus: 'حب وذوق', mars: 'اندفاع ورغبة', jupiter: 'تفاؤل وتوسّع', saturn: 'جدّية وحدود' };
  var SYN_ASP = [{ d: 0, k: 'conj', n: 'اقتران', h: 1, f: 'يلتقيان في نقطة واحدة، فيُضخَّم كل ما بينهما' }, { d: 60, k: 'sext', n: 'تسديس', h: 1, f: 'يتفاهمان بأقل جهد متى انتبهتما لذلك' }, { d: 120, k: 'tri', n: 'تثليث', h: 1, f: 'ينسجمان بلا مجهود يُذكر' }, { d: 90, k: 'sq', n: 'تربيع', h: 0, f: 'يحتكّان ويشدّ أحدهما الآخر' }, { d: 180, k: 'opp', n: 'مقابلة', h: 0, f: 'يقفان وجهًا لوجه كمرآتين' }];
  var SYN_W = { 'sun|moon': 10, 'moon|sun': 10, 'venus|mars': 10, 'mars|venus': 10, 'moon|moon': 9, 'sun|sun': 8, 'venus|venus': 8, 'venus|sun': 8, 'sun|venus': 8, 'moon|venus': 8, 'venus|moon': 8, 'mercury|mercury': 7, 'saturn|moon': 8, 'moon|saturn': 8, 'saturn|venus': 7, 'venus|saturn': 7, 'mars|mars': 6, 'sun|mars': 6, 'mars|sun': 6, 'saturn|sun': 6, 'sun|saturn': 6, 'jupiter|sun': 6, 'sun|jupiter': 6, 'jupiter|moon': 6, 'moon|jupiter': 6 };
  function synPairs(a, b, nm) {
    var out = [], lon = function (ch, k) { var x = ch.bodies.filter(function (y) { return y.key === k; })[0]; return x ? x.lon : null; };
    Object.keys(SYN_N).forEach(function (ka) { Object.keys(SYN_N).forEach(function (kb) {
      var w = SYN_W[ka + '|' + kb]; if (!w) return;
      var la = lon(a, ka), lb = lon(b, kb); if (la == null || lb == null) return;
      var df = Math.abs(((la - lb + 540) % 360) - 180);
      SYN_ASP.forEach(function (sp) { var o = Math.abs(df - sp.d); if (o <= 5) out.push({ ka: ka, kb: kb, sp: sp, o: o, sc: w - o * 0.6 }); });
    }); });
    out.sort(function (x, y) { return y.sc - x.sc; });
    var seen = {}; return out.filter(function (x) { var k = x.ka + x.kb; if (seen[k]) return false; seen[k] = 1; return true; }).slice(0, 4).map(function (x) {
      return { t: SYN_N[x.ka] + ' عندك و' + SYN_N[x.kb] + ' عند ' + nm, k: x.sp.n, h: x.sp.h,
        b: SYN_ROLE[x.ka] + ' عندك، و' + SYN_ROLE2[x.kb] + ' ' + nm + ': ' + x.sp.f + '. ' +
          (x.sp.h ? 'من هنا يأتي الإحساس بأن أحدكما يفهم الآخر دون شرح طويل، فاعتمدا عليه.' : 'من هنا يأتي أغلب الشدّ بينكما، ويصير قوة حقيقية لو سمّيتماه بهدوء قبل أن يتحوّل إلى عتاب.') };
    });
  }
  function weCard(x) { return '<article class="yp-wc' + (x.h === 0 ? ' hard' : '') + '"><span class="yp-chip">' + esc(x.k) + '</span><h3>' + esc(x.t) + '</h3><p>' + esc(x.b) + '</p></article>'; }
  function weCyc(c, nm, now) {
    var left = Math.max(1, Math.round((c.end - now) / DAY));
    return '<article class="yp-wc"><span class="yp-chip">' + c.tn + ' · ' + c.an + ' · ' + c.nn + '</span><h3>' + esc(titleOf(c)) + '</h3><small class="yp-al">' + fmtD(c.start) + ' – ' + fmtD(c.end) + '</small><p>' + esc(nm) + ' يمرّ بهذا الآن، ويمسّ ' + (AREA[c.n] || 'حياته') + '. ' + (left > 60 ? 'هي مرحلة طويلة، فلا تحكم على مزاجه بيوم واحد.' : 'بقي منها وقت قصير، وبعدها يخفّ الضغط.') + '</p></article>';
  }
  function weMark(g, nm, rel) {
    var gl = g === 'f' ? '<circle cx="12" cy="9" r="4.500"/><path d="M12 13.500V21M9 18h6"/>' : g === 'm' ? '<circle cx="10" cy="14" r="4.500"/><path d="M13.500 10.500 20 4M15 4h5v5"/>' : '';
    return '<div class="yp-wm"><span class="yp-wm-l ' + (g || 'n') + '"><img src="assets/images/brand/logo-mark-160.png" alt="" width="40" height="40">' + (gl ? '<i>' + SVG(gl) + '</i>' : '') + '</span><b>' + esc(nm) + '</b>' + (rel ? '<small>' + esc(rel) + '</small>' : '') + '</div>';
  }
  function weForm() {
    var d = '', mo = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'], sel = function (id, a, ph) { return '<select id="' + id + '" aria-label="' + ph + '"><option value="">' + ph + '</option>' + a + '</select>'; };
    var ds = '', ms = '', ys = '', hs = '', mn = '', i;
    for (i = 1; i <= 31; i++) ds += '<option value="' + i + '">' + i + '</option>';
    mo.forEach(function (m, k) { ms += '<option value="' + (k + 1) + '">' + m + '</option>'; });
    for (i = new Date().getFullYear(); i >= 1930; i--) ys += '<option value="' + i + '">' + i + '</option>';
    for (i = 0; i < 24; i++) hs += '<option value="' + i + '">' + (i < 10 ? '0' : '') + i + '</option>';
    for (i = 0; i < 60; i += 5) mn += '<option value="' + i + '">' + (i < 10 ? '0' : '') + i + '</option>';
    return '<form class="yp-wf" id="yp-wf" novalidate><h3>بيانات الطرف الآخر</h3><p class="yp-wf-s">نحسب خريطته من بياناته، ولا يحتاج حسابًا عندنا.</p>' +
      '<label>الاسم<input id="yp-w-n" type="text" maxlength="40" autocomplete="off"></label>' +
      '<div class="yp-wf-r"><span>العلاقة</span><div class="yp-seg" id="yp-w-rel">' + RELS.map(function (r, k) { return '<button type="button" data-w-rel="' + r[0] + '"' + (k === 0 ? ' class="on"' : '') + '>' + r[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="yp-wf-r"><span>الجنس (لشكل العلامة فقط)</span><div class="yp-seg" id="yp-w-g"><button type="button" data-w-g="m" class="on">ذكر</button><button type="button" data-w-g="f">أنثى</button></div></div>' +
      '<div class="yp-wf-r"><span>تاريخ الميلاد</span><div class="yp-wf-3">' + sel('yp-w-d', ds, 'اليوم') + sel('yp-w-m', ms, 'الشهر') + sel('yp-w-y', ys, 'السنة') + '</div></div>' +
      '<div class="yp-wf-r"><span>وقت الميلاد</span><div class="yp-wf-3">' + sel('yp-w-h', hs, 'الساعة') + sel('yp-w-mi', mn, 'الدقيقة') + '<label class="yp-wf-k"><input type="checkbox" id="yp-w-nt"> لا أعرفه</label></div></div>' +
      '<div class="yp-wf-r yp-wf-city"><span>مكان الميلاد</span><input id="yp-w-c" type="search" autocomplete="off" placeholder="ابحث باسم المدينة أو المحافظة"><ul id="yp-w-cl" hidden></ul></div>' +
      '<p class="yp-un-m err" id="yp-w-e" role="alert"></p><button type="submit" class="yp-ab yp-wf-go"><span>احسب ما بيننا</span></button></form>';
  }
  function weHtml() {
    var L = pGet(), now = Date.now();
    if (!natal()) return needNatal('أدخل بيانات ميلادك أولًا، ثم أضف من تحب لنقارن خريطتيكما.');
    if (!L.length || ST.weAdd) return (L.length ? '<button type="button" class="yp-wb" data-we-cancel>رجوع</button>' : '<div class="yp-empty">' + SVG('<circle cx="9" cy="12" r="5.500"/><circle cx="15" cy="12" r="5.500"/>') + '<p>أضف شخصًا يهمّك، شريكًا أو صديقًا، لتعرف ما بينكما وما يمرّ به كلٌّ منكما.</p></div>') + weForm();
    var p = L.filter(function (x) { return x.id === ST.weSel; })[0] || L[0], pc = pChart(p), me = natal(), nm = p.name || 'الطرف الآخر', mn = (user() || {}).user_metadata || {}, my = mn.full_name || mn.name || 'أنت';
    var h = '<div class="yp-wchips">' + L.map(function (x) { return '<button type="button" class="yp-wchip' + (x.id === p.id ? ' on' : '') + '" data-we-sel="' + x.id + '">' + esc(x.name || 'بدون اسم') + '</button>'; }).join('') + '<button type="button" class="yp-wchip add" data-we-add aria-label="إضافة شخص">' + SVG('<path d="M12 5v14M5 12h14"/>') + '</button></div>';
    var mg = ''; try { mg = (JSON.parse(localStorage.getItem('aq-last-birth-v1') || '{}').gender || '').charAt(0) === 'f' || /أنث/.test(JSON.parse(localStorage.getItem('aq-last-birth-v1') || '{}').gender || '') ? 'f' : /ذكر|male|^m/i.test(JSON.parse(localStorage.getItem('aq-last-birth-v1') || '{}').gender || '') ? 'm' : ''; } catch (e) {}
    h += '<div class="yp-couple">' + weMark(mg, String(my).split(' ')[0], '') + '<span class="yp-couple-x">' + SVG('<path d="M12 20s-7-4.400-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/>') + '<em>' + esc(relName(p.rel)) + '</em></span>' + weMark(p.g, nm, '') + '</div>';
    if (!pc) return h + '<div class="yp-empty"><p>تعذّر حساب خريطة ' + esc(nm) + '. تأكد من المدينة وأعد إضافته.</p></div><button type="button" class="yp-wb danger" data-we-del="' + p.id + '">حذف</button>';
    h += '<p class="yp-lab">ما بينكما</p><div class="yp-wl">' + (synPairs(me, pc, nm).map(weCard).join('') || '<p class="yp-un-m">لا اتصالات قوية بارزة بين الخريطتين، وهذا يعني علاقة تتشكّل بالاختيار أكثر من الانجذاب.</p>') + '</div>';
    var pcy = []; try { pcy = window.AqeeqYou.cycles(pc, Math.floor(now / DAY) * DAY); } catch (e) {}
    var pcur = split(pcy).cur.slice(0, 3);
    h += '<p class="yp-lab">ما يمرّ به ' + esc(nm) + ' الآن</p><div class="yp-wl">' + (pcur.map(function (c) { return weCyc(c, nm, now); }).join('') || '<p class="yp-un-m">لا دورة كبيرة تمرّ به الآن، مرحلة هادئة نسبيًا.</p>') + '</div>';
    var mycur = split(allCycles() || []).cur, shared = [];
    pcur.forEach(function (c) { mycur.forEach(function (m) { if (m.t === c.t && !shared.some(function (z) { return z.t === c.t; })) shared.push({ t: c.t, tn: c.tn, mine: m, his: c }); }); });
    if (shared.length) h += '<p class="yp-lab">عبور يمسّكما معًا</p><div class="yp-wl">' + shared.slice(0, 2).map(function (z) { return '<article class="yp-wc both"><span class="yp-chip">' + z.tn + ' يمرّ على خريطتيكما</span><h3>' + z.tn + ' يضغط عليكما في الوقت نفسه</h3><p>عندك: ' + esc(titleOf(z.mine)) + '. وعند ' + esc(nm) + ': ' + esc(titleOf(z.his)) + '. حين يمرّ الكوكب نفسه على اثنين معًا، يكثر سوء الفهم دون سبب ظاهر، فاسألا قبل أن تحكما على بعضكما.</p></article>'; }).join('') + '</div>';
    h += '<a class="yp-wb" href="#compat">تعمّق في التوافق الكامل</a><button type="button" class="yp-wb danger" data-we-del="' + p.id + '">حذف ' + esc(nm) + '</button>';
    return h;
  }
  function weCitySearch(q) {
    var ul = $('#yp-w-cl'); if (!ul) return;
    var C = (window.__aqCITIES && window.__aqCITIES()) || [], nz = function (t) { return String(t || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه'); }, v = nz(q), hits = [];
    if (v.length < 2) { ul.hidden = true; return; }
    for (var i = 0; i < C.length && hits.length < 8; i++) { var c = C[i]; if (c.tz && c.n && nz(c.n + ' ' + (c.g || '')).indexOf(v) > -1) hits.push(c); }
    ul.innerHTML = hits.length ? hits.map(function (c) { return '<li data-city="' + esc(c.n) + '"><b>' + esc(c.n) + '</b><small>' + esc(c.g || '') + '</small></li>'; }).join('') : '<li class="none">لا نتيجة، جرّب اسمًا آخر</li>'; ul.hidden = false;
  }
  document.addEventListener('input', function (e) { if (e.target && e.target.id === 'yp-w-c') { e.target.removeAttribute('data-ok'); weCitySearch(e.target.value); } });
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('#for-you [data-we-add],#for-you [data-we-cancel],#for-you [data-we-sel],#for-you [data-we-del],#for-you [data-w-rel],#for-you [data-w-g],#for-you #yp-w-cl li[data-city]'); if (!t) return;
    if (t.hasAttribute('data-w-rel') || t.hasAttribute('data-w-g')) { [].forEach.call(t.parentNode.children, function (b) { b.classList.toggle('on', b === t); }); return; }
    if (t.hasAttribute('data-city')) { var ci = $('#yp-w-c'); ci.value = t.getAttribute('data-city'); ci.setAttribute('data-ok', '1'); $('#yp-w-cl').hidden = true; return; }
    if (t.hasAttribute('data-we-add')) ST.weAdd = true; else if (t.hasAttribute('data-we-cancel')) ST.weAdd = false;
    else if (t.hasAttribute('data-we-sel')) { ST.weSel = t.getAttribute('data-we-sel'); ST.weAdd = false; }
    else if (t.hasAttribute('data-we-del')) { var id = t.getAttribute('data-we-del'); pSet(pGet().filter(function (x) { return x.id !== id; })); delete PCH[id]; ST.weSel = null; }
    render();
  });
  document.addEventListener('submit', function (e) {
    if (!e.target || e.target.id !== 'yp-wf') return; e.preventDefault();
    var g = function (id) { return $('#' + id).value; }, err = $('#yp-w-e'), nm = g('yp-w-n').trim(), city = g('yp-w-c').trim();
    var dd = +g('yp-w-d'), mm = +g('yp-w-m'), yy = +g('yp-w-y'), nt = $('#yp-w-nt').checked, hh = g('yp-w-h'), mi = g('yp-w-mi');
    if (!nm) { err.textContent = 'اكتب اسمه.'; return; }
    if (!dd || !mm || !yy) { err.textContent = 'اختر يوم وشهر وسنة الميلاد.'; return; }
    if (!nt && (hh === '' || mi === '')) { err.textContent = 'اختر الساعة والدقيقة، أو علّم "لا أعرفه".'; return; }
    if (window.AqeeqChartContext.cityIndexByName(city) < 0) { err.textContent = 'اختر المدينة من القائمة التي تظهر أثناء الكتابة.'; return; }
    var pad = function (x) { return String(x).padStart(2, '0'); };
    var P = { id: 'p' + Date.now().toString(36), name: nm, rel: ($('#yp-w-rel .on') || {}).getAttribute('data-w-rel') || 'partner', g: ($('#yp-w-g .on') || {}).getAttribute('data-w-g') || 'm', date: yy + '-' + pad(mm) + '-' + pad(dd), time: nt ? '' : pad(hh) + ':' + pad(mi), city: city };
    if (!pChart(P)) { err.textContent = 'تعذّر الحساب، راجع التاريخ والمدينة.'; return; }
    var L = pGet(); L.push(P); pSet(L); ST.weSel = P.id; ST.weAdd = false; render();
  });
  window.AqeeqYouPage = { go: function (tab) { ST.tab = tab; ST.view = null; ST.weAdd = false; if (location.hash !== '#for-you') location.hash = '#for-you'; render(); var s0 = $('#for-you'); if (s0) s0.scrollTop = 0; window.scrollTo(0, 0); } };

  function settingsHtml() {
    var u = user() || {};
    return '<div class="yp-set">' +
      '<div class="yp-set-g"><p class="yp-lab">حسابك</p><div class="yp-set-row"><div><b dir="ltr">' + esc(u.email || '') + '</b><small>نوع الاشتراك</small></div>' + planChip() + '</div>' +
      '<div class="yp-set-row yp-un"><div><b>اسم المستخدم</b><small>حروف إنجليزية وأرقام ونقطة، من 3 إلى 20.</small></div><span class="yp-un-f" dir="ltr">@<input id="yp-un" type="text" maxlength="20" autocomplete="off" autocapitalize="off" spellcheck="false" value="' + esc(unGet(u)) + '"></span><button type="button" class="yp-ab" data-un-save><span>حفظ</span></button></div><p class="yp-un-m" id="yp-un-m" role="status"></p></div>' +
      '<div class="yp-set-g"><p class="yp-lab">الخصوصية</p><label class="yp-set-row yp-sw"><div><b>حساب خاص</b><small>ملفك وقراءاتك لا تظهر لأحد غيرك.</small></div><input type="checkbox" id="yp-private"' + (isPrivate() ? ' checked' : '') + '><span class="yp-sw-t" aria-hidden="true"></span></label></div>' +
      nfHtml() + '<div class="yp-set-g"><p class="yp-lab">بياناتك وخريطتك</p><div id="yp-prof-slot"></div></div>' +
      '<div class="yp-set-g"><p class="yp-lab">عن عقيق أسترو</p><div class="yp-legal"><p>© 2026 عقيق أسترو (Aqeq Astro). جميع الحقوق محفوظة. كل النصوص والقراءات والتصاميم والحسابات ملكية خاصة، ويمنع نسخها أو إعادة نشرها أو بيعها بدون إذن كتابي.</p></div></div>' +
      '<button type="button" class="yp-out" data-signout>تسجيل الخروج</button></div>';
  }

  /* ---------- عدستك: بطاقات اليوم من الحسابات والنصوص الموجودة ---------- */
  var WD = [
    ['الأحد', 'يوم الشمس', 'ممكن تلاحظ اليوم رغبة أن تُرى وتُقدَّر. اسأل نفسك أين تحتاج أن تظهر بصدق بدل أن تُثبت شيئًا.'],
    ['الاثنين', 'يوم القمر', 'مشاعرك أقرب إلى السطح اليوم. ممكن تحتاج مكانًا هادئًا وكلامًا أقل، وهذا ليس ضعفًا.'],
    ['الثلاثاء', 'يوم المريخ', 'طاقة الدفع اليوم ممكن تتحول إلى قرار أو إلى انفعال. اختر أين تضعها قبل أن تختارك هي.'],
    ['الأربعاء', 'يوم عطارد', 'عقلك أسرع اليوم. ممكن تنجز رسائل ومهام مؤجلة، وانتبه لجملة تقولها قبل أن تفكر فيها.'],
    ['الخميس', 'يوم المشتري', 'ميل للتوسع والتفاؤل. ممكن يفتح لك باب إن طرقته، وانتبه ألا تعد بأكثر مما تقدر.'],
    ['الجمعة', 'يوم الزهرة', 'القلب يطلب قربًا وجمالًا. ممكن تلاحظ ما يريحك فعلًا وما تفعله فقط لإرضاء غيرك.'],
    ['السبت', 'يوم زحل', 'يطلب منك اليوم جدية وترتيبًا. ممكن تشعر بثقل المسؤوليات، وهو وقت جيد لتحسم ما تؤجله.']
  ];
  var SG = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var MOON = [
    'مشاعرك ممكن تتحرك بسرعة وتطلب فعلًا مباشرًا. أعطها مجالًا للحركة بدل أن تكتمها.',
    'ما يهدئك اليوم هو الملموس: ترتيب، أكل بيتي، شيء تنجزه بيدك.',
    'تحتاج أن تتكلم أو تكتب لتفهم ما تشعر به. ممكن تخف حدة الشعور حين تسمّيه.',
    'الحدس والحساسية أعلى. ممكن تلتقط مزاج من حولك، فاحرص على مسافة تحميك.'
  ];
  function moonToday(ms) {
    try { var c = window.Astro.chart({ utcMs: ms || Date.now(), lat: 30.0444, lon: 31.2357, known: false }), b = c.bodies.filter(function (x) { return String(x.key).toLowerCase() === 'moon'; })[0]; return b ? Math.floor(((b.lon % 360) + 360) % 360 / 30) : -1; } catch (e) { return -1; }
  }
  function lensCard(kick, title, text, act, extra) {
    return '<article class="yp-lc"><span class="yp-lc-k">' + esc(kick) + '</span><h3>' + esc(title) + '</h3>' + (extra ? '<small class="yp-lc-x">' + esc(extra) + '</small>' : '') + '<p>' + esc(text) + '</p>' + (act || '') + '</article>';
  }
  function lensCards() {
    var d = new Date(), w = WD[d.getDay()], ch = natal(), cards = [];
    var dateS = d.toLocaleDateString('ar-EG-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long' });
    var live = ch && window.AqeeqLive ? window.AqeeqLive.today(ch) : [];
    live.forEach(function (r, i) {
      cards.push(lensCard(i === 0 ? 'طاقة اليوم · ' + dateS : 'عبور اليوم', r.name + ' في ' + r.sign + ' · بيتك ' + r.house, r.text + ' ' + r.act, '', 'الدرجة ' + r.deg + ' · ' + r.phase + (r.retro ? ' · راجع' : '') + (r.approx ? ' · بيوت تقريبية لعدم معرفة وقت الميلاد' : '')));
    });
    if (!live.length) cards.push(lensCard('طاقة اليوم · ' + dateS, 'أدخل بيانات ميلادك', 'لتظهر لك طاقة اليوم محسوبة على خريطتك أنت: القمر والكواكب السريعة في بيوتك بالدرجة الفعلية الآن.'));
    var list = ch ? allCycles() : null, pls = ch && window.AqeeqYou ? window.AqeeqYou.placements(ch) : [];
    return cards.join('');
  }
  var CHEV = SVG('<path d="M15 6l-6 6 6 6"/>'), DWN = SVG('<path d="M6 9l6 6 6-6"/>');
  function briefOf(e) {
    var t = String(e.summary || ''), i = t.indexOf(':'); t = i > -1 ? t.slice(i + 1).trim() : t;
    return t.length && t.length <= 260 ? t : headOf(e);
  }
  function deepHtml(e, brief) {
    var key = String(brief || '').slice(0, 40);
    var sl = slidesOf(e.text).filter(function (x) { return !(key && x.b.indexOf(key) === 0); });
    return sl.map(function (x) { return '<div class="yp-ds">' + (x.t ? '<h4>' + esc(x.t) + '</h4>' : '') + '<p>' + esc(x.b).replace(/\n/g, '<br>') + '</p></div>'; }).join('');
  }
  function textBlock(e, kind, id) {
    var br = briefOf(e), dp = deepHtml(e, br);
    return '<div class="yp-txt"><p class="yp-brief">' + esc(br) + '</p></div>' +
      (dp ? '<button type="button" class="yp-deep-b" data-pop="' + kind + '" data-id="' + esc(id) + '"><span>تعمّق</span>' + SVG('<path d="M9 6l6 6-6 6"/>') + '</button>' : '');
  }
  function rail(title, sub, cards, go) {
    if (!cards) return '';
    var inner = '<span class="yp-sh-t"><b>' + title + '</b>' + CHEV + '</span><small>' + sub + '</small>';
    return '<section class="yp-sec">' + (go ? '<button type="button" class="yp-sh" data-go="' + go + '">' + inner + '</button>' : '<div class="yp-sh">' + inner + '</div>') +
      '<div class="yp-rail" tabindex="0">' + cards + '</div></section>';
  }
  function curList(list, n) { var s = split(list); return s.cur.slice(0, n).map(function (c) { return cardHtml(c, false); }).join('') + s.up.slice(0, 3).map(function (c) { return cardHtml(c, true); }).join(''); }
  var LOVEP = ['venus', 'moon', 'mars', 'juno'], LOVEH = [5, 7, 8];
  function natHouse(id) { var ch = natal(), b = ch && ch.bodies ? ch.bodies.filter(function (x) { return x.key === id; })[0] : null; return b ? b.house : 0; }
  function isLovePl(p) { return LOVEP.indexOf(p.id) >= 0 || LOVEH.indexOf(natHouse(p.id)) >= 0; }
  function isLoveCy(c) { return LOVEP.indexOf(c.n) >= 0 || LOVEH.indexOf(natHouse(c.n)) >= 0; }
  function domCycles(list, id) { return list ? list.filter(function (c) { return id === 'growth' ? ['saturn', 'pluto', 'chiron', 'neptune'].indexOf(c.t) >= 0 : c.doms.indexOf(id) >= 0; }) : []; }
  /* ---- رئيسية «أنت» الجديدة: بطاقة هويتك + تبويبات قطعية بدل الشرائح المتكررة ---- */
  var SIGNS12 = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  function lifePathOf(y, m, d) { return window.AqeqLifePathCore.lifePath(d, m, y); }
  function heroHtml() {
    var mine = null; try { mine = window.AqeeqChartContext && window.AqeeqChartContext.getMine(); } catch (e) {}
    var cta = '<div class="yp-bp-go"><a class="yp-bp-b main" href="#chart"><span>اكتشف خريطتك كاملة</span>' + SVG('<path d="M19 12H5M11 6l-6 6 6 6"/>') + '</a><a class="yp-bp-b" href="#matrix"><span>مصفوفة قدرك</span></a></div>';
    if (!mine || !mine.ch) {
      return '<section class="yp-bp yp-bp-empty"><span class="yp-bp-k">بصمتك</span><h2>خريطتك تبدأ من ميلادك</h2><p>أدخل بيانات ميلادك مرة واحدة، لتظهر لك بصمتك وسماءك وعبوراتك مكتوبة عليك أنت.</p><a class="yp-bp-b main" href="#chart" data-ob><span>أدخل بيانات ميلادك</span>' + SVG('<path d="M19 12H5M11 6l-6 6 6 6"/>') + '</a></section>';
    }
    var pls = window.AqeeqYou ? window.AqeeqYou.placements(mine.ch) : [], pick = function (id) { var x = pls.filter(function (q) { return q.id === id; })[0]; return x ? x.sign : '—'; };
    var rise = mine.ch.known && typeof mine.ch.asc === 'number' ? SIGNS12[Math.floor(((mine.ch.asc % 360) + 360) % 360 / 30)] : 'غير محدد';
    var lp = lifePathOf(mine.y, mine.m, mine.d);
    var cell = function (k, v, ic) { return '<div class="yp-bp-c"><span class="yp-bp-i">' + SVG(ic) + '</span><small>' + k + '</small><b>' + esc(v) + '</b></div>'; };
    return '<section class="yp-bp"><span class="yp-bp-k">بصمتك</span><h2>هويتك في أربع علامات</h2><div class="yp-bp-g">' +
      cell('الشمس', pick('sun'), '<circle cx="12" cy="12" r="4"/><path d="M12 2.500v3M12 18.500v3M2.500 12h3M18.500 12h3M5.300 5.300l2.100 2.100M16.600 16.600l2.100 2.100M5.300 18.700l2.100-2.100M16.600 7.400l2.100-2.100"/>') +
      cell('القمر', pick('moon'), '<path d="M20 14.500A8 8 0 0 1 9.500 4 8 8 0 1 0 20 14.500z"/>') +
      cell('الطالع', rise, '<path d="M3 17h18M6 17a6 6 0 0 1 12 0M12 5v3M5.600 8.600l1.800 1.800M18.400 8.600l-1.800 1.800"/>') +
      cell('مسار الحياة', String(lp), '<path d="M4 20c3-8 5-8 8-2s5 4 8-12"/>') + '</div>' + vedicRow(mine.ch) + cta + '</section>';
  }
  function vedicRow(ch) {
    var v = window.AqeeqLive && window.AqeeqLive.vedic(ch); if (!v) return '';
    var it = function (k, t) { return '<div class="yp-vd-i"><small>' + k + '</small><b>' + esc(t) + '</b></div>'; };
    return '<div class="yp-vd"><span class="yp-vd-k">فلكك الفيدي · لاهيري</span><div class="yp-vd-g">' + it('برج القمر', v.rashi) + it('النكشاترا · بادا ' + v.pada, v.nak) + (v.asc ? it('الطالع', v.asc) : '') + '</div></div>';
  }
  var HT = [['day', 'طاقة اليوم'], ['transits', 'عبوراتك'], ['patterns', 'أنماطك'], ['rel', 'علاقاتك']];
  function htBar() {
    var cur = ST.ht || 'day';
    return '<div class="yp-seg" role="tablist" aria-label="أقسام صفحتك" style="--i:' + HT.map(function (t) { return t[0]; }).indexOf(cur) + '">' + HT.map(function (t) { return '<button type="button" role="tab" class="yp-seg-b" data-ht="' + t[0] + '" aria-selected="' + (cur === t[0]) + '">' + t[1] + '</button>'; }).join('') + '<span class="yp-seg-i" aria-hidden="true"></span></div>';
  }
  function moreLink(label, go) { return '<button type="button" class="yp-more" data-go="' + go + '"><span>' + label + '</span>' + CHEV + '</button>'; }
  function panelHtml(k) {
    var list = allCycles(), has = !!natal();
    if (k === 'day') return '<div class="yp-stack">' + lensCards() + '</div>' + moreLink('سماء يومك كاملة', 'sky');
    if (!has) return needNatal();
    if (k === 'transits') return '<div class="yp-stack">' + (list ? curList(list.filter(function (c) { return !isLoveCy(c); }), 5) : '') + '</div>' + '<button type="button" class="yp-more yp-tt" data-tt-open>' + SVG('<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3 2"/>') + '<span>سافر بالزمن</span></button>' + moreLink('كل عبوراتك', 'transits');
    if (k === 'patterns') {
      if (!natal().known) return needNatal('أنماطك تُبنى على بيوت خريطتك، وهذا يحتاج وقت ميلادك. أضفه لتظهر لك كاملة.');
      var rows = DOMAINS.filter(function (d) { return d.id !== 'love'; }).map(function (d) { return '<button type="button" class="yp-row" data-go="dom:' + d.id + '"><span class="yp-dom-i" data-d="' + d.id + '">' + SVG(d.i) + '</span><span class="yp-row-t"><b>' + d.t + '</b><small>' + d.s + '</small></span>' + CHEV + '</button>'; }).join('');
      return '<div class="yp-stack">' + placeCards(function (p) { return !isLovePl(p); }, 0) + '</div>' + '<p class="yp-lab">مجالات حياتك</p><div class="yp-rows">' + rows + '</div>';
    }
    var lv = (list || []).filter(isLoveCy), sp = split(lv);
    return '<button type="button" class="yp-we-cta" data-go="we"><span class="yp-we-i">' + SVG('<circle cx="9" cy="12" r="5.500"/><circle cx="15" cy="12" r="5.500"/>') + '</span><span class="yp-row-t"><b>نحن: أنت والطرف الآخر</b><small>أدخل بيانات شريك أو صديق وشوف توافقكم</small></span>' + CHEV + '</button>' +
      '<div class="yp-stack">' + sp.cur.slice(0, 3).map(function (c) { return cardHtml(c, false); }).join('') + sp.up.slice(0, 2).map(function (c) { return cardHtml(c, true); }).join('') + placeCards(isLovePl, 4) + '</div>' + moreLink('كل ما يخص علاقاتك', 'dom:love');
  }
  function homeHtml() {
    return heroHtml() + htBar() + '<div class="yp-hp" id="yp-hp">' + panelHtml(ST.ht || 'day') + '</div>';
  }

  /* سماء يومك: شاشات كاملة بسكرول عمودي، آخر 3 أيام */
  var SKYART = [
    '<g opacity=".5"><circle cx="300" cy="150" r="70"/><circle cx="300" cy="150" r="110"/><circle cx="300" cy="150" r="155"/></g>',
    '<g opacity=".5" transform="rotate(-18 190 420)"><ellipse cx="190" cy="420" rx="250" ry="105"/><ellipse cx="190" cy="420" rx="190" ry="76"/></g>',
    '<g opacity=".45"><path d="M290 90l50 29v58l-50 29-50-29v-58z"/><path d="M290 90l50 29-50 29-50-29zM290 148v58"/></g>',
    '<g opacity=".5"><path d="M20 640c80-60 150-60 230 0s150 60 230 0"/><path d="M20 690c80-60 150-60 230 0s150 60 230 0"/></g>',
    '<g opacity=".45"><path d="M40 120l60 40 50-30 70 50"/><circle cx="40" cy="120" r="3" fill="#9A4A32"/><circle cx="100" cy="160" r="3" fill="#9A4A32"/><circle cx="150" cy="130" r="3" fill="#9A4A32"/><circle cx="220" cy="180" r="3" fill="#9A4A32"/></g>'
  ];
  var SKYBG = ['#F6E9D2,#EBCFAE', '#F3E1CF,#E3B99A', '#F4EAD6,#E5D0A8', '#EFE0CB,#D9B79A', '#F5E8D5,#E8CDB0', '#F2E3CC,#DDB993', '#F1E4D0,#E2C4A0'];
  function skyDate() { var d = new Date(); d.setHours(12, 0, 0, 0); return new Date(d.getTime() - (ST.skyDay || 0) * DAY); }
  function pickPl(pls, ids, d, off) {
    var f = pls.filter(function (x) { return ids.indexOf(x.id) >= 0 && coreOf(x); }); if (!f.length) f = pls.filter(function (x) { return coreOf(x); });
    if (!f.length) return null; var doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / DAY); return f[(doy + (off || 0)) % f.length];
  }
  function skyStory(n, kick, title, text, btn) {
    return '<section class="yp-st" style="--sk:linear-gradient(180deg,' + SKYBG[n % SKYBG.length].replace(',', ' 0%,') + ' 100%)"><svg class="yp-st-art" viewBox="0 0 375 812" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#9A4A32" stroke-width="1" aria-hidden="true">' + SKYART[n % SKYART.length] + '</svg>' +
      (n === 0 ? '<img class="yp-st-logo" src="assets/images/brand/logo-mark-160.png" alt="عقيق أسترو" width="56" height="56">' : '') +
      '<div class="yp-st-in"><small class="yp-st-k">' + esc(kick) + '</small><h2>' + esc(title) + '</h2><p>' + esc(text) + '</p>' + (btn || '') + '</div></section>';
  }
  function skyHtml() {
    var d = skyDate(), ms = d.getTime(), w = WD[d.getDay()], ch = natal(), out = [], n = 0;
    var days = ['اليوم', 'أمس', 'قبل يومين', 'قبل ٣ أيام'];
    var chips = '<div class="yp-days">' + days.map(function (t, i) { return '<button type="button" data-skyday="' + i + '" aria-pressed="' + ((ST.skyDay || 0) === i) + '">' + t + '</button>'; }).join('') + '</div>';
    var dateS = d.toLocaleDateString('ar-EG-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long' });
    out.push(skyStory(n++, 'أجواء يومك · ' + dateS, w[1], w[2]));
    var list = ch ? allCycles() : null, pls = ch && window.AqeeqYou ? window.AqeeqYou.placements(ch) : [];
    var bt = function (kind, id) { return '<button type="button" class="yp-st-b" data-pop="' + kind + '" data-id="' + esc(id) + '"><span>تعمّق</span></button>'; };
    if (list) {
      var cur = list.filter(function (c) { return c.start <= ms && c.end >= ms; });
      cur.sort(function (a, b) { var pa = a.peaks[0] ? Math.abs(a.peaks[0].a - ms) : 9e15, pb = b.peaks[0] ? Math.abs(b.peaks[0].a - ms) : 9e15; return pa - pb; });
      var mk = function (c, kick) {
        var pp = pls.filter(function (x) { return x.id === c.n; })[0], cc = pp && coreOf(pp);
        return skyStory(n++, kick, 'دورة ' + c.tn + ' مع ' + c.nn, cc ? headOf(cc.e) : 'دورة مؤقتة تحرّك ما يخصّ ' + c.nn + ' في خريطتك.', cc ? bt('cyc', c.id + '|' + c.start) : '');
      };
      if (cur[0]) out.push(mk(cur[0], 'العبور الأبرز · تنتهي ' + fmtM(cur[0].end)));
    }
    var mkp = function (p, kick) { var c2 = coreOf(p); return skyStory(n++, kick, p.nn + ' في ' + p.sign + ' · البيت ' + c2.house, headOf(c2.e), bt('pl', p.id)); };
    var p1 = pickPl(pls, ['sun', 'moon', 'saturn', 'pluto', 'chiron'], d, 0); if (p1) out.push(mkp(p1, 'تذكير بنمطك'));
    if (list) { var cur2 = list.filter(function (c) { return c.start <= ms && c.end >= ms; }); if (cur2[1]) out.push((function (c) { var pp = pls.filter(function (x) { return x.id === c.n; })[0], cc = pp && coreOf(pp); return skyStory(n++, 'عبور آخر يؤثر فيك · تنتهي ' + fmtM(c.end), 'دورة ' + c.tn + ' مع ' + c.nn, cc ? headOf(cc.e) : 'دورة مؤقتة تحرّك ما يخصّ ' + c.nn + ' في خريطتك.', cc ? bt('cyc', c.id + '|' + c.start) : ''); })(cur2[1])); }
    var p2 = pickPl(pls, ['venus', 'moon', 'mars'], d, 1); if (p2 && (!p1 || p2.id !== p1.id)) out.push(mkp(p2, 'نمطك في علاقاتك'));
    var p3 = pickPl(pls, ['saturn', 'jupiter', 'sun', 'mercury'], d, 2); if (p3 && (!p1 || p3.id !== p1.id) && (!p2 || p3.id !== p2.id)) out.push(mkp(p3, 'نمطك في عملك وطموحك'));
    var m = moonToday(ms); if (m >= 0) out.push(skyStory(n++, 'حدث فلكي', 'القمر في برج ' + SG[m], MOON[m % 4]));
    return chips + '<div class="yp-sky" tabindex="0">' + out.join('') + '</div>';
  }
  function subTabs() {
    return '<div class="yp-ut" role="tablist">' + [['transits', 'عبوراتك'], ['pattern', 'نمطك']].map(function (t) { return '<button type="button" role="tab" data-tab="' + t[0] + '" aria-selected="' + (ST.tab === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div>';
  }
  function bodyHtml() {
    var v = ST.view, list;
    if (v && v.set) return settingsHtml();
    if (v && v.sv) return savedHtml();
    if (v && v.inb) return inboxHtml();
    if (v && v.cyc) {
      list = allCycles() || []; var c = list.filter(function (x) { return x.id + '|' + x.start === v.cyc; })[0];
      if (c) {
        var pp0 = window.AqeeqYou.placements(natal()).filter(function (x) { return x.id === c.n; })[0], cc0 = pp0 && coreOf(pp0);
        return '<div class="yp-det"><span class="yp-chip">' + c.tn + ' · ' + c.an + ' · ' + c.nn + '</span><h3>' + esc(titleOf(c)) + '</h3><small class="yp-al">' + fmtD(c.start) + ' – ' + fmtD(c.end) + '</small>' + actBar(c.id + '|' + c.start, titleOf(c)) +
          timeline(c) +
          (cc0 ? '<p class="yp-lab">ما تحمله ' + c.nn + ' عندك</p>' + textBlock(cc0.e, 'cyc', c.id + '|' + c.start) : '') + '</div>';
      }
    }
    if (v && v.pl) {
      var pp = window.AqeeqYou.placements(natal()).filter(function (x) { return x.id === v.id; })[0], cc = pp && coreOf(pp);
      return '<div class="yp-det"><h3>' + esc(v.pl) + (cc ? ' · البيت ' + cc.house : '') + '</h3><small class="yp-al">صفة ثابتة في خريطتك</small>' + (cc ? textBlock(cc.e, 'pl', v.id) : '') + '</div>';
    }
    if (v && v.dom) {
      var d = domOf(v.dom); list = allCycles();
      return '<div class="yp-dh"><span class="yp-dom-i" data-d="' + d.id + '">' + SVG(d.i) + '</span><small>' + d.s + '</small></div>' + (list ? cyclesHtml(domCycles(list, v.dom)) : needNatal()) + (placeCards(v.dom) ? '<p class="yp-lab">صفاتك الثابتة</p><div class="yp-list">' + placeCards(v.dom) + '</div>' : '');
    }
    if (ST.tab === 'we') return weHtml();
    if (ST.tab === 'sky') return natal() ? skyHtml() : needNatal('أدخل بيانات ميلادك لتظهر لك سماء يومك مقروءة على خريطتك.');
    if (ST.tab === 'transits') { list = allCycles(); return subTabs() + '<p class="yp-lab">كل ما يخصّ عبوراتك</p>' + timeTravel() + (list ? cyclesHtml(list, true) : needNatal()); }
    if (ST.tab === 'pattern') return subTabs() + '<p class="yp-lab">كل صفاتك الثابتة</p>' + (natal() ? '<div class="yp-list">' + placeCards() + '</div>' : needNatal());
    return homeHtml();
  }

  /* ---- الهوية البصرية الجديدة: عنوان كبير، تابات زجاجية، خلفية لكل تبويب ---- */
  var BGART = {
    lens: '<g opacity=".5"><circle cx="340" cy="60" r="60"/><circle cx="340" cy="60" r="95"/><circle cx="340" cy="60" r="135"/></g><g opacity=".45" stroke="#6B1F2E"><path d="M30 700l40-30 30 20 45-40"/><circle cx="30" cy="700" r="2.500" fill="#6B1F2E"/><circle cx="70" cy="670" r="2" fill="#6B1F2E"/><circle cx="100" cy="690" r="2.500" fill="#6B1F2E"/><circle cx="145" cy="650" r="2" fill="#6B1F2E"/></g>',
    transits: '<g opacity=".5" transform="rotate(-20 190 420)"><ellipse cx="190" cy="420" rx="260" ry="110"/><ellipse cx="190" cy="420" rx="200" ry="80"/><ellipse cx="190" cy="420" rx="140" ry="52"/></g><circle cx="330" cy="330" r="5" fill="#B5532F" stroke="none" opacity=".7"/><circle cx="60" cy="520" r="4" fill="#6B1F2E" stroke="none" opacity=".6"/>',
    pattern: '<g opacity=".45"><path d="M300 40l50 29v58l-50 29-50-29V69z"/><path d="M300 40l50 29-50 29-50-29zM300 98v58"/><path d="M60 640l50 29v58l-50 29-50-29v-58z"/><path d="M60 640l50 29-50 29-50-29zM60 698v58"/></g>',
    settings: '<g opacity=".45" stroke="#6B1F2E"><path d="M40 90l60 40 50-30 70 50"/><path d="M290 640l30-50 40 20"/><circle cx="40" cy="90" r="3" fill="#6B1F2E"/><circle cx="100" cy="130" r="2.500" fill="#6B1F2E"/><circle cx="150" cy="100" r="3" fill="#6B1F2E"/><circle cx="220" cy="150" r="2.500" fill="#6B1F2E"/><circle cx="290" cy="640" r="3" fill="#6B1F2E"/><circle cx="320" cy="590" r="2.500" fill="#6B1F2E"/></g>'
  };
  /* رئيسية المسجّل: بطاقة «سماء يومك» بدل الهيرو التسويقي */
  function homeSync(u, name) {
    try {
      document.body.classList.toggle('yp-user', !!u);
      var host = $('#home-intro'), old = $('#yp-hc'); if (old) old.remove();
      if (!u || !host) return;
      var d = new Date(), w = WD[d.getDay()], list = natal() ? allCycles() : null, cur = list ? split(list).cur[0] : null;
      var first = String(name || '').split(/\s+/)[0], dateS = d.toLocaleDateString('ar-EG-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long' });
      var el = document.createElement('div'); el.id = 'yp-hc'; el.className = 'yp-hc';
      el.innerHTML = '<p class="yp-hc-k">أهلًا ' + esc(first) + '</p><p class="yp-hc-d">طاقة اليوم · ' + dateS + '</p><h2>' + w[1] + '</h2><p class="yp-hc-t">' + w[2] + '</p>' +
        (cur ? '<p class="yp-hc-c"><span>عبورك الآن</span><b>' + esc(titleOf(cur)) + '</b></p>' : '') +
        '<a class="yp-hc-go" href="#for-you"><span>افتح صفحتك</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></a>';
      host.insertBefore(el, host.firstChild);
    } catch (e) {}
  }
  /* شكل التطبيق: بعد الدخول وداخل «أنت» فقط يختفي هيدر وفوتر الموقع */
  function appSync() { try { document.body.classList.toggle('yp-app', !!user() && /^#for-you/.test(location.hash)); } catch (e) {} }
  window.addEventListener('hashchange', appSync);
  function render() {
    loadTexts(); window.__aqWeOn = ST.tab === 'we' && !ST.view; try { document.dispatchEvent(new Event('aq:wesync')); } catch (e) {}
    var u = user(), host = $('#fy-body'), sec = $('#for-you'); if (!host) return;
    if (sec) sec.classList.toggle('yp-on', !!u);
    appSync();
    if (!u) { homeSync(null); return; }
    var name = (u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) || (u.email || '').split('@')[0] || 'حسابك';
    homeSync(u, name);
    var pn = $('#account-profile-completion'), home0 = $('#acct-user');
    if (pn && home0 && host.contains(pn)) home0.appendChild(pn);
    var set = !!(ST.view && ST.view.set), inSub = !!(ST.view && !set && !ST.view.sv && !ST.view.inb), sv = !!(ST.view && ST.view.sv), inb = !!(ST.view && ST.view.inb), home = !set && !inSub && !sv && !inb && ST.tab === 'home', cur = (set || sv || inb) ? 'settings' : ST.tab;
    var barT = sv ? 'المحفوظات' : inb ? 'إشعاراتك' : set ? 'الضبط' : inSub ? (ST.view.cyc ? 'تفاصيل الدورة' : ST.view.dom ? (domOf(ST.view.dom) || {}).t || 'المجال' : 'صفة في نمطك') : home ? 'أنت' : (ST.tab === 'we' ? 'نحن' : ST.tab === 'sky' ? 'سماء يومك' : ST.tab === 'transits' ? 'عبوراتك' : 'نمطك');
    var backA = home ? 'data-home' : (inSub || sv || inb) ? 'data-back' : 'data-tab="home"';
    var who = set ? '<div class="yp-who yp-who-card"><span class="yp-av">' + avatar(u, name) + '</span><div><h2>' + esc(name) + '</h2></div></div>' : '';
    var end = home ? '<button type="button" class="yp-av yp-av-b" data-set aria-label="حسابي"><span class="yp-av-i">' + avatar(u, name) + '</span><span class="yp-av-n">' + esc(String(name).split(' ')[0]) + '</span></button>' : '<span></span>';
    host.innerHTML = '<div class="yp yp-t-' + cur + (inSub ? ' yp-sub' : '') + '"><div class="yp-bg" aria-hidden="true"><svg width="100%" height="100%" viewBox="0 0 375 812" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#9A4A32" stroke-width="1">' + (BGART[cur === 'home' ? 'lens' : cur] || '') + '</svg></div>' +
      (home ? topHtml(u, name) : '<header class="yp-bar"><button type="button" class="yp-bar-b" ' + backA + ' aria-label="رجوع">' + SVG('<path d="M9 6l6 6-6 6"/>') + '</button><h1>' + esc(barT) + '</h1>' + end + '</header>') +
      (home ? '<p class="yp-sub1">مكتبة تكبر معك، كلها عن حكايتك أنت</p>' : '') + who +
      '<div class="yp-body">' + bodyHtml() + '</div></div>';
    if (set) {
      var slot = $('#yp-prof-slot');
      if (pn && slot) { pn.hidden = false; slot.appendChild(pn); }
      else if (slot && (ST.tries = (ST.tries || 0) + 1) < 20) setTimeout(function () { if (ST.view && ST.view.set && !$('#yp-prof-slot #account-profile-completion')) render(); }, 400);
    }
  }
  /* نافذة التعمّق المنبثقة: شرح أطول بتنسيق زجاجي، تُغلق بزر أسفلها */
  function popOpen(kind, rid) {
    var pls = natal() ? window.AqeeqYou.placements(natal()) : [], tgt, ttl, kk;
    if (kind === 'cyc') { var lc = (allCycles() || []).filter(function (x) { return x.id + '|' + x.start === rid; })[0]; if (!lc) return; tgt = pls.filter(function (x) { return x.id === lc.n; })[0]; ttl = titleOf(lc); kk = astroLine(lc); }
    else { tgt = pls.filter(function (x) { return x.id === rid; })[0]; ttl = tgt ? tgt.nn + ' في ' + tgt.sign : ''; kk = 'صفة ثابتة في خريطتك'; }
    var cx = tgt && coreOf(tgt); if (!cx) return;
    var br = briefOf(cx.e), old = $('#yp-pop'); if (old) old.remove();
    var key = String(br).slice(0, 40), sl = [{ t: '', b: br, big: 1 }].concat(slidesOf(cx.e.text).filter(function (x) { return !(key && x.b.indexOf(key) === 0); }));
    var el = document.createElement('div'); el.id = 'yp-pop'; el.className = 'yp-pop'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', ttl);
    var X = SVG('<path d="M6 6l12 12M18 6L6 18"/>');
    el.innerHTML = '<div class="yp-pop-top"><button type="button" class="yp-pop-x2" data-pop-x aria-label="إغلاق">' + X + '</button><div class="yp-pop-hd"><small class="yp-pop-k">' + esc(kk) + '</small><h3 class="yp-pop-t">' + esc(ttl) + '</h3></div></div>' +
      '<div class="yp-pop-scroll" tabindex="0"><div class="yp-pop-col">' + sl.map(function (x, i) {
        return '<section class="yp-pop-p">' + (i && x.t ? '<h4>' + esc(x.t) + '</h4>' : '') + '<p class="' + (x.big ? 'big' : '') + '">' + esc(x.b).replace(/\n/g, '<br>') + '</p></section>';
      }).join('') + '<button type="button" class="yp-pop-end" data-pop-x>إغلاق</button></div></div>';
    document.body.appendChild(el); document.documentElement.classList.add('yp-pop-open');
    requestAnimationFrame(function () { el.classList.add('on'); });
  }
  function popClose() { var el = $('#yp-pop'); if (!el) return; el.classList.remove('on'); document.documentElement.classList.remove('yp-pop-open'); setTimeout(function () { el.remove(); }, 260); }
  document.addEventListener('click', function (e) {
    var p = e.target.closest && e.target.closest('[data-pop]'); if (p) { popOpen(p.getAttribute('data-pop'), p.getAttribute('data-id')); return; }
    if (e.target.closest && e.target.closest('[data-pop-x]')) popClose();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') popClose(); });
  window.addEventListener('hashchange', popClose);

  /* زر «الخريطة» في أنت: تُحسب الخريطة وتظهر جاهزة من بياناتك المحفوظة */
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('#for-you a[href="#chart"]'); if (a) { try { sessionStorage.setItem('aq_yp_chart', '1'); } catch (_) {} } }, true);
  function autoChart() {
    if (location.hash !== '#chart') return; var f; try { f = sessionStorage.getItem('aq_yp_chart'); sessionStorage.removeItem('aq_yp_chart'); } catch (_) {}
    if (!f || !natal()) return;
    setTimeout(function () { var b = document.querySelector('#chart .aq-autofill-btn'); if (b) b.click(); setTimeout(function () { var fm = document.getElementById('cform'); if (fm && fm.requestSubmit) fm.requestSubmit(); }, 250); }, 200);
  }
  window.addEventListener('hashchange', autoChart);

  /* بعد الدخول: «حسابي» يفتح صفحتك الكاملة بدل النافذة المنبثقة (إلا شاشة كلمة المرور الجديدة أو الرجوع من الدفع) */
  function route() {
    if (location.hash !== '#account' || !user()) return;
    var rec = $('#acct-recovery'); if (rec && !rec.hidden) return;
    if (/[?&](order|order_id)=/.test(location.search)) return;
    var card = $('#acct-user');
    if (card && card.getAttribute('data-profile-complete') === 'false') ST.view = { set: true };
    location.replace('#for-you'); render();
  }
  /* «حسابي» بعد الدخول يفتح إعدادات صفحة «أنت» مباشرة بدل نافذة الحساب القديمة */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#account"]'); if (!a || !user()) return;
    var rec = $('#acct-recovery'); if (rec && !rec.hidden) return;
    e.preventDefault(); e.stopPropagation(); ST.view = null; ST.tab = 'home'; ST.weAdd = false;
    if (location.hash !== '#for-you') location.hash = '#for-you'; else { render(); var s1 = $('#for-you'); if (s1) s1.scrollTop = 0; window.scrollTo(0, 0); }
  }, true);
  document.addEventListener('click', function (e) {
    var q = e.target.closest && e.target.closest('[data-tt-open],[data-tt-close],[data-tt-set],[data-tt-today]'); if (!q) return;
    if (q.hasAttribute('data-tt-open')) { ttSheet(); return; }
    if (q.hasAttribute('data-tt-close')) { ttClose(); return; }
    if (q.hasAttribute('data-tt-today')) { ST.date = null; ttClose(); render(); return; }
    var dd = +$('#yp-td').value, mm = +$('#yp-tm').value, yy = +$('#yp-ty').value, dt = new Date(yy, mm, Math.min(dd, new Date(yy, mm + 1, 0).getDate()), 12);
    ST.date = dt.getTime(); ttClose(); render();
  });
  document.addEventListener('click', function (e) {
    var sd = e.target.closest && e.target.closest('#for-you [data-skyday]'); if (sd) { ST.skyDay = +sd.getAttribute('data-skyday'); render(); return; }
    var t = e.target.closest && e.target.closest('#for-you [data-tab],#for-you [data-dom],#for-you [data-cyc],#for-you [data-pl],#for-you [data-back],#for-you [data-home],#for-you [data-all],#for-you [data-set],#for-you [data-signout],#for-you [data-read],#for-you [data-save],#for-you [data-share],#for-you [data-go],#for-you [data-deep]'); if (!t) return;
    if (t.hasAttribute('data-home')) { if (history.length > 1) history.back(); else location.hash = ''; return; }
    if (t.hasAttribute('data-deep')) { var dp = t.nextElementSibling, open = dp && dp.hasAttribute('hidden'); if (dp) { if (open) dp.removeAttribute('hidden'); else dp.setAttribute('hidden', ''); } t.setAttribute('aria-expanded', open ? 'true' : 'false'); t.classList.toggle('on', !!open); t.querySelector('span').textContent = open ? 'إخفاء' : 'تعمّق'; return; }
    if (t.hasAttribute('data-go')) { var go = t.getAttribute('data-go'); if (go.indexOf('dom:') === 0) ST.view = { dom: go.slice(4), from: null }; else { ST.tab = go; ST.view = null; } render(); var s0 = $('#for-you'); if (s0) s0.scrollTop = 0; return; }
    if (t.hasAttribute('data-save')) { var sid = t.getAttribute('data-save'), L = saved(), k = L.indexOf(sid); if (k >= 0) L.splice(k, 1); else L.push(sid); try { localStorage.setItem(SAVE_KEY, JSON.stringify(L)); } catch (x) {} render(); return; }
    if (t.hasAttribute('data-share')) { var tt = t.getAttribute('data-share') + ' — عقيق أسترو'; try { if (navigator.share) navigator.share({ title: tt, url: location.origin + location.pathname }); else if (navigator.clipboard) { navigator.clipboard.writeText(tt + ' ' + location.origin + location.pathname); t.querySelector('span').textContent = 'تم النسخ'; } } catch (x) {} return; }
    if (t.hasAttribute('data-read')) {
      var kind = t.getAttribute('data-read'), rid = t.getAttribute('data-id'), pls = natal() ? window.AqeeqYou.placements(natal()) : [], tgt, ttl, kk;
      if (kind === 'cyc') { var lc = (allCycles() || []).filter(function (x) { return x.id + '|' + x.start === rid; })[0]; if (!lc) return; tgt = pls.filter(function (x) { return x.id === lc.n; })[0]; ttl = titleOf(lc); kk = astroLine(lc); }
      else { tgt = pls.filter(function (x) { return x.id === rid; })[0]; ttl = tgt ? tgt.nn + ' في ' + tgt.sign : ''; kk = 'صفة ثابتة في خريطتك'; }
      var cx = tgt && coreOf(tgt); if (cx) readerOpen(ttl, kk, cx.e.text); return;
    }
    if (t.hasAttribute('data-signout')) { var so = $('#acct-signout'); if (so) so.click(); return; }
    if (t.hasAttribute('data-set')) { ST.view = ST.view && ST.view.set ? null : { set: true }; ST.tries = 0; render(); window.scrollTo(0, 0); return; }
    if (t.hasAttribute('data-tab')) { var tn = t.getAttribute('data-tab'); if (tn === 'settings') { ST.view = { set: true }; ST.tries = 0; } else { ST.tab = tn; ST.view = null; } }
    else if (t.hasAttribute('data-dom')) ST.view = { dom: t.getAttribute('data-dom'), from: ST.view };
    else if (t.hasAttribute('data-cyc')) ST.view = { cyc: t.getAttribute('data-cyc'), from: ST.view };
    else if (t.hasAttribute('data-pl')) { var id = t.getAttribute('data-pl'), p = window.AqeeqYou.placements(natal()).filter(function (x) { return x.id === id; })[0]; ST.view = { pl: p.nn + ' في ' + p.sign, id: p.id, from: ST.view }; }
    else if (t.hasAttribute('data-all')) ST.all = true;
    else if (t.hasAttribute('data-back')) ST.view = (ST.view && ST.view.from) || null;
    render(); var s = $('#for-you'); if (s) s.scrollTop = 0;
  });

  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('#for-you [data-sv],#for-you [data-inb],#for-you [data-un-save]'); if (!el) return;
    if (el.hasAttribute('data-un-save')) {
      var inp = $('#yp-un'), m = $('#yp-un-m'), v = inp ? inp.value.trim().toLowerCase() : '';
      if (!unOk(v)) { if (m) { m.textContent = 'اكتب من 3 إلى 20 حرفًا إنجليزيًا أو رقمًا أو نقطة، وتبدأ بحرف.'; m.className = 'yp-un-m err'; } return; }
      var sb = window.aqeeqSupabase, say = function (t, ok) { if (m) { m.textContent = t; m.className = 'yp-un-m ' + (ok ? 'ok' : 'err'); } };
      if (!sb || !sb.rpc) { say('تعذّر الاتصال الآن، حاول لاحقًا.', false); return; }
      say('جارٍ التحقق...', true);
      sb.rpc('claim_username', { p_name: v }).then(function (r) {
        var d = r && !r.error ? r.data : 'err';
        if (d === 'ok') { try { localStorage.setItem(UN_KEY, v); } catch (x) {} say('تم حفظ اسم المستخدم.', true); }
        else if (d === 'taken') say('هذا الاسم مأخوذ، اختر اسمًا آخر.', false);
        else if (d === 'invalid') say('اكتب من 3 إلى 20 حرفًا إنجليزيًا أو رقمًا أو نقطة، وتبدأ بحرف.', false);
        else say('تعذّر الحفظ الآن، حاول مرة أخرى.', false);
      }, function () { say('تعذّر الحفظ الآن، حاول مرة أخرى.', false); });
      return;
    }
    ST.view = el.hasAttribute('data-sv') ? { sv: true } : { inb: true }; render(); var s0 = $('#for-you'); if (s0) s0.scrollTop = 0; window.scrollTo(0, 0);
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-nf-prev]')) nfPreview();
    else if (e.target.closest && e.target.closest('[data-nfp-x]')) nfClose();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') nfClose(); });
  document.addEventListener('change', function (e) {
    var q = e.target && e.target.getAttribute && e.target.getAttribute('data-nf'); if (q) nfSet(q, e.target.checked);
    if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-nf-time')) nfSet('time', e.target.value);
    if (e.target && e.target.id === 'yp-private') { try { localStorage.setItem('aqeeq_private_v1', e.target.checked ? '1' : '0'); } catch (_) {} }
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#for-you [data-ht]'); if (!b) return;
    var k = b.getAttribute('data-ht'); if (k === ST.ht) return; ST.ht = k;
    var bar = b.parentNode, hp = $('#yp-hp'); if (!hp) { render(); return; }
    bar.style.setProperty('--i', String([].indexOf.call(bar.querySelectorAll('.yp-seg-b'), b)));
    [].forEach.call(bar.querySelectorAll('.yp-seg-b'), function (x) { x.setAttribute('aria-selected', String(x === b)); });
    hp.classList.remove('yp-hp-in'); hp.innerHTML = panelHtml(k); void hp.offsetWidth; hp.classList.add('yp-hp-in');
  });
  setInterval(function () {
    var hp = document.getElementById('yp-hp'); if (!hp || document.hidden || (ST.ht || 'day') !== 'day' || ST.view) return;
    var html = panelHtml('day'); if (hp.innerHTML !== html) hp.innerHTML = html;
  }, 600000);
  window.AqeeqYouWarm = function () { try { loadTexts(); allCycles(); } catch (e) {} };
  document.addEventListener('aq:session', function () { route(); render(); });
  document.addEventListener('aq:admin', render);
  /* اهتزاز خفيف عند لمس أزرار التنقل (أندرويد؛ يتجاهله ما لا يدعمه) */
  document.addEventListener('pointerdown', function (e) { try { if (navigator.vibrate && e.target.closest && e.target.closest('.bnav-item,.yp-pill,.yp-ib')) navigator.vibrate(8); } catch (x) {} }, { passive: true });
  window.addEventListener('hashchange', function () { route(); if (location.hash === '#for-you') render(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { route(); render(); }); else { route(); render(); }
})();

;
/* assets/js/home-v2.js */
/* AQEQ ASTRO — Homepage (Phase 1): تفاعلات الصفحة الرئيسية فقط.
   لا يغيّر أي محرك حسابات: يقرأ فقط من window.Astro.chart (نفس الدالة التي يستخدمها شريط الرصد)
   ويقرأ SIGNS الموجودة في الصفحة. الوحدات: Layers · Header · HeroChart · SkyService · DailyEnergy · Articles · Reveal.
   كل الأزمنة/المنحنيات من Tokens في home-v2.css (--motion-*, --ease-*). */
(function () {
  'use strict';
  var root = document.documentElement;
  var home = document.getElementById('home');
  if (!home || !home.classList.contains('aqh')) return;

  var NS = 'http://www.w3.org/2000/svg';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function mk(tag, attrs, html) { var e = document.createElement(tag); if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]); if (html != null) e.innerHTML = html; return e; }
  function sv(tag, attrs) { var e = document.createElementNS(NS, tag); if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function norm(t) { return String(t || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه'); }
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';

  /* =============== إشعار قصير =============== */
  var toastEl, toastT;
  function toast(msg, ms) {
    if (!toastEl) { toastEl = mk('div', { 'class': 'aqh-toast', role: 'status' }); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, ms || 2200);
  }

  /* =============== Layers: نافذة واحدة فقط، حبس تركيز، Escape، قفل تمرير =============== */
  var layersHost = document.body; /* الطبقات تُضاف لنهاية body كي تعلو الترويسة الثابتة */
  var current = null;
  var FOCUSABLE = 'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])';
  function openLayer(opts) {
    if (current) closeLayer(true);
    var wrap = mk('div', { 'class': 'aqh-layer aqh-layer--' + opts.kind });
    var scrim = mk('div', { 'class': 'aqh-scrim' });
    var box = mk('div', { 'class': 'aqh-box', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': opts.titleId });
    box.innerHTML = opts.html;
    wrap.appendChild(scrim); wrap.appendChild(box); layersHost.appendChild(wrap);
    root.classList.add('aqh-lock');
    current = { wrap: wrap, box: box, opener: opts.opener || document.activeElement, onClose: opts.onClose, dismissOutside: opts.dismissOutside !== false };
    requestAnimationFrame(function () { wrap.classList.add('is-open'); });
    var title = $('#' + opts.titleId, box); if (title) { title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true }); }
    scrim.addEventListener('click', function () { if (current && current.dismissOutside) closeLayer(); });
    $$('[data-layer-close]', box).forEach(function (b) { b.addEventListener('click', function () { closeLayer(); }); });
    return box;
  }
  function closeLayer(instant) {
    if (!current) return;
    var c = current; current = null;
    c.wrap.classList.remove('is-open'); c.wrap.classList.add('is-closing');
    var done = function () { if (c.wrap.parentNode) c.wrap.parentNode.removeChild(c.wrap); root.classList.remove('aqh-lock'); if (c.onClose) c.onClose(); if (c.opener && c.opener.focus && document.contains(c.opener)) c.opener.focus({ preventScroll: true }); };
    if (instant || reduce) done(); else setTimeout(done, 190);
  }
  document.addEventListener('keydown', function (e) {
    if (!current) return;
    if (e.key === 'Escape') { e.preventDefault(); closeLayer(); return; }
    if (e.key === 'Tab') {
      var f = $$(FOCUSABLE, current.box).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === current.box || document.activeElement.id && document.activeElement.hasAttribute('tabindex') && !f.includes(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  var closeBtn = '<button type="button" class="aqh-x" data-layer-close aria-label="إغلاق"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>';

  /* =============== حالة الدخول (قراءة فقط من عميل Supabase الموجود) =============== */
  var session = { known: false, user: null };
  function refreshSession() {
    try {
      if (window.aqeeqSupabase && window.aqeeqSupabase.auth) {
        window.aqeeqSupabase.auth.getSession().then(function (r) { session = { known: true, user: r && r.data && r.data.session ? r.data.session.user : null }; document.dispatchEvent(new CustomEvent('aqh:session')); }).catch(function () { });
        window.aqeeqSupabase.auth.onAuthStateChange(function (_e, s) { session = { known: true, user: s && s.user ? s.user : null }; document.dispatchEvent(new CustomEvent('aqh:session')); });
      }
    } catch (e) { }
  }
  window.addEventListener('load', refreshSession);

  /* =============== Header =============== */
  (function header() {
    var h = $('.aqh-header'); if (!h) return;
    var onScroll = function () { h.classList.toggle('is-scrolled', (window.scrollY || root.scrollTop) > 40); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    var drop = $('.aqh-drop');
    if (drop) {
      var btn = $('.aqh-drop-btn', drop);
      var setOpen = function (v) { drop.classList.toggle('is-open', v); btn.setAttribute('aria-expanded', v ? 'true' : 'false'); };
      btn.addEventListener('click', function (e) { e.stopPropagation(); setOpen(!drop.classList.contains('is-open')); });
      document.addEventListener('click', function () { setOpen(false); });
      drop.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setOpen(false); btn.focus(); } });
    }
    var burger = $('#aqh-burger'), menu = $('#aqh-menu');
    if (burger && menu) {
      var toggle = function (v) { menu.hidden = !v; burger.setAttribute('aria-expanded', v ? 'true' : 'false'); burger.setAttribute('aria-label', v ? 'إغلاق القائمة' : 'فتح القائمة'); h.classList.toggle('menu-open', v); };
      burger.addEventListener('click', function () { toggle(menu.hidden); });
      menu.addEventListener('click', function (e) { if (e.target.closest('a')) toggle(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { toggle(false); burger.focus(); } });
      window.matchMedia('(min-width:1025px)').addEventListener('change', function (m) { if (m.matches) toggle(false); });
    }
    /* مؤشر الرابط النشط للرئيسية فقط (لا تغيير في التنقل الداخلي للموقع) */
  })();

  /* =============== عناصر لم تُربط بوظيفتها بعد (مكتبة الرموز) =============== */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-soon]');
    if (!a) return;
    var target = document.querySelector(a.getAttribute('href'));
    if (target && !target.hidden && getComputedStyle(target).display !== 'none') return;
    e.preventDefault(); toast(a.getAttribute('data-soon'), 2600);
  });

  /* =============== SkyService: طبقة قراءة فقط فوق المحرك الحالي =============== */
  var PLANETS = [
    { key: 'sun', ar: 'الشمس', sym: '☉', meaning: 'جوهر الهوية والإرادة والحيوية.' },
    { key: 'moon', ar: 'القمر', sym: '☽', meaning: 'الشعور والاحتياج الداخلي وإيقاع المزاج.' },
    { key: 'mercury', ar: 'عطارد', sym: '☿', meaning: 'التفكير والتواصل وطريقة معالجة المعلومات.' },
    { key: 'venus', ar: 'الزهرة', sym: '♀', meaning: 'العلاقات والقيم وما نراه جميلًا.' },
    { key: 'mars', ar: 'المريخ', sym: '♂', meaning: 'الفعل والدافع وطريقة بذل الجهد.' },
    { key: 'jupiter', ar: 'المشتري', sym: '♃', meaning: 'النمو والثقة وفرص التوسع.' },
    { key: 'saturn', ar: 'زحل', sym: '♄', meaning: 'الالتزام والحدود ودروس الصبر.' },
    { key: 'uranus', ar: 'أورانوس', sym: '♅', meaning: 'التجديد والتحرر والتغيير المفاجئ.' },
    { key: 'neptune', ar: 'نبتون', sym: '♆', meaning: 'الخيال والحدس وما وراء الظاهر.' },
    { key: 'pluto', ar: 'بلوتو', sym: '♇', meaning: 'التحول العميق والبدايات الجديدة بعد النهايات.' }
  ];
  var SIGN_AR = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var SIGN_GLYPH = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  var ELEMENT = ['نار', 'تراب', 'هواء', 'ماء'];
  var MODE = ['أساسي', 'ثابت', 'متغيّر'];
  function skyNow() {
    if (!window.Astro || typeof window.Astro.chart !== 'function') throw new Error('engine-missing');
    var c = window.Astro.chart({ utcMs: Date.now(), lat: 30.0444, lon: 31.2357, known: false });
    if (!c || !Array.isArray(c.bodies)) throw new Error('no-bodies');
    var out = {};
    c.bodies.forEach(function (b) { out[b.key] = { lon: ((b.lon % 360) + 360) % 360, sign: b.sign, deg: Math.floor(((b.lon % 30) + 30) % 30), retro: !!b.retro }; });
    return out;
  }
  /* بيوت سماء الشرق الأوسط (القاهرة) الآن: قراءة فقط من المحرك الحالي */
  function skyHouses() {
    try { var c = window.Astro.chart({ utcMs: Date.now(), lat: 30.0444, lon: 31.2357, known: true }); return c && c.known && Array.isArray(c.cusps) && c.cusps.length === 12 ? c.cusps.map(function (x) { return ((x % 360) + 360) % 360; }) : null; } catch (e) { return null; }
  }

  /* =============== HeroChart: قطاعات البروج + الكواكب + اللوحة الجانبية =============== */
  (function heroChart() {
    var svg = $('.aqh-wheel-wrap svg.wheel'); if (!svg) return;
    var glyphsG = $('#glyphs', svg);
    var signs = (typeof SIGNS !== 'undefined' && Array.isArray(SIGNS)) ? SIGNS : null;
    var state = { active: -1, passthrough: false };
    var tip = mk('div', { 'class': 'aqh-tip', role: 'tooltip', hidden: '' }); document.body.appendChild(tip);

    /* قطاعات: بين الدائرتين 126 و170، حول زاوية كل رمز (لا تدور مع المدارات) */
    var sectors = sv('g', { 'class': 'aqh-sectors', 'aria-hidden': 'true' });
    function arc(i) {
      var a0 = (-90 + i * 30 - 15) * Math.PI / 180, a1 = (-90 + i * 30 + 15) * Math.PI / 180, R = 170, r = 126;
      var p = function (a, rad) { return (200 + Math.cos(a) * rad).toFixed(2) + ' ' + (200 + Math.sin(a) * rad).toFixed(2); };
      return 'M' + p(a0, R) + 'A' + R + ' ' + R + ' 0 0 1 ' + p(a1, R) + 'L' + p(a1, r) + 'A' + r + ' ' + r + ' 0 0 0 ' + p(a0, r) + 'Z';
    }
    for (var i = 0; i < 12; i++) sectors.appendChild(sv('path', { 'class': 'aqh-sector', d: arc(i), 'data-i': i }));
    svg.insertBefore(sectors, glyphsG);

    /* نقاط ذهبية على المدار (حركة بطيئة جدًا — الرموز والنصوص لا تدور) */
    var dots = sv('g', { 'class': 'aqh-orbit-dots aqh-orbit-detail', 'aria-hidden': 'true' });
    [20, 140, 255].forEach(function (deg, k) { var a = deg * Math.PI / 180, r = k === 1 ? 126 : 112; dots.appendChild(sv('circle', { cx: (200 + Math.cos(a) * r).toFixed(2), cy: (200 + Math.sin(a) * r).toFixed(2), r: k === 1 ? 2 : 2.6, 'class': 'aqh-dot' })); });
    svg.insertBefore(dots, glyphsG);

    function signIndexFromG(g) { return [].indexOf.call(glyphsG.children, g); }
    function setActive(i) {
      state.active = i;
      $$('.aqh-sector', sectors).forEach(function (s) { s.classList.toggle('is-active', +s.getAttribute('data-i') === i); });
      $$('.wg', glyphsG).forEach(function (g, k) { g.classList.toggle('is-active', k === i); });
      svg.classList.toggle('has-active', i >= 0);
    }
    function signInfo(i) {
      var s = signs && signs[i];
      var nm = (s && s.n) || SIGN_AR[i];
      return { name: nm, glyph: (s && s.g) || SIGN_GLYPH[i], el: s ? ELEMENT[s.el] : '', mode: s ? MODE[s.mod] : '', dates: s ? s.d : '', sum: s ? (s.way + ' — ' + s.strength) : '' };
    }

    /* --- Tooltip (Desktop hover فقط، بعد 180ms) --- */
    var tipT;
    function showTip(i, x, y) {
      var info = signInfo(i);
      tip.innerHTML = '<b>' + esc(info.glyph) + ' ' + esc(info.name) + '</b>' + (info.sum ? '<span>' + esc(info.sum) + '</span>' : '');
      tip.hidden = false; tip.style.left = Math.round(x) + 'px'; tip.style.top = Math.round(y) + 'px';
    }
    function hideTip() { clearTimeout(tipT); tip.hidden = true; }
    if (canHover) {
      svg.addEventListener('pointerover', function (e) {
        var t = e.target.closest('.wg, .aqh-sector'); if (!t) return;
        var i = t.classList.contains('wg') ? signIndexFromG(t) : +t.getAttribute('data-i');
        if (i < 0) return;
        $$('.aqh-sector', sectors)[i].classList.add('is-hover'); var gg = glyphsG.children[i]; if (gg) gg.classList.add('is-hover');
        clearTimeout(tipT); var bx = e.clientX, by = e.clientY;
        tipT = setTimeout(function () { showTip(i, bx, by); }, 180);
      });
      svg.addEventListener('pointerout', function (e) {
        var t = e.target.closest('.wg, .aqh-sector'); if (!t) return;
        $$('.is-hover', svg).forEach(function (x) { x.classList.remove('is-hover'); }); hideTip();
      });
    }

    /* --- لوحة البرج / الكوكب: Side Panel (Desktop) · Bottom Sheet (Mobile) --- */
    function openSign(i, opener) {
      hideTip(); setActive(i);
      var info = signInfo(i);
      var box = openLayer({
        kind: 'panel', titleId: 'aqh-panel-title', opener: opener,
        onClose: function () { /* لا تُعاد الخريطة لحالتها الأولية: يبقى البرج مثبتًا */ },
        html: closeBtn + '<div class="aqh-panel-body"><p class="aqh-kicker" dir="ltr">ZODIAC</p><h3 id="aqh-panel-title"><span class="aqh-panel-glyph" aria-hidden="true">' + esc(info.glyph) + '</span> ' + esc(info.name) + '</h3>' +
          '<ul class="aqh-facts">' + (info.el ? '<li><small>العنصر</small><b>' + esc(info.el) + '</b></li><li><small>الصفة</small><b>' + esc(info.mode) + '</b></li>' : '') + (info.dates ? '<li><small>الفترة</small><b>' + esc(info.dates) + '</b></li>' : '') + '</ul>' +
          (info.sum ? '<p class="aqh-panel-sum">' + esc(info.sum) + '</p>' : '') +
          '<div class="aqh-panel-actions"><button type="button" class="aqh-solid" data-go-sign><span>اقرأ توقعات البرج</span>' + ARROW + '</button><a class="aqh-link" href="#chart" data-natal hidden>استكشف في خريطة الولادة</a></div></div>'
      });
      $('[data-go-sign]', box).addEventListener('click', function () {
        closeLayer(true);
        var g = glyphsG.children[i]; if (!g) return;
        state.passthrough = true; g.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); state.passthrough = false;
      });
      var natal = $('[data-natal]', box);
      var syncNatal = function () { natal.hidden = !(session.known && session.user); };
      syncNatal(); document.addEventListener('aqh:session', syncNatal, { once: true });
      natal.addEventListener('click', function () { closeLayer(true); });
    }
    function relLink(p, body) {
      var L = window.AqeeqContentLinks; if (!L) return '';
      var key = body.retro ? 'retrograde-' + p.key : 'planet-' + p.key, l = L.find(key);
      if (!l && body.retro) l = null;
      if (!l) return '';
      return '<a class="aqh-outline-btn aqh-rel" href="' + L.hrefFrom(l, 'home') + '" data-layer-close data-content-slug="' + l.slug + '"><span>' + esc(l.label) + '</span>' + ARROW + '</a>';
    }
    function openPlanet(p, body, opener) {
      hideTip();
      var retro = body.retro ? 'متراجع' : 'مباشر';
      var box = openLayer({
        kind: 'panel', titleId: 'aqh-panel-title', opener: opener,
        html: closeBtn + '<div class="aqh-panel-body"><p class="aqh-kicker" dir="ltr">PLANET</p><h3 id="aqh-panel-title"><span class="aqh-panel-glyph" aria-hidden="true">' + p.sym + '</span> ' + p.ar + '</h3>' +
          '<ul class="aqh-facts"><li><small>البرج الحالي</small><b>' + SIGN_GLYPH[body.sign] + ' ' + SIGN_AR[body.sign] + '</b></li><li><small>الدرجة</small><b>' + body.deg + '°</b></li><li><small>الحالة</small><b>' + retro + '</b></li></ul>' +
          '<p class="aqh-panel-sum">' + esc(p.meaning) + '</p>' +
          '<p class="aqh-note">أضف وقت ومكان الميلاد لعرض البيت الفلكي بدقة.</p>' +
          '<div class="aqh-panel-actions">' + relLink(p, body) + '<a class="aqh-solid" href="#sky" data-layer-close><span>اعرف المزيد</span>' + ARROW + '</a></div></div>'
      });
      $('a.aqh-solid', box).addEventListener('click', function () { closeLayer(true); });
      var rl = $('a.aqh-rel', box); if (rl) rl.addEventListener('click', function () { closeLayer(true); });
    }

    /* اعتراض نقر/لوحة مفاتيح البرج (الكود الأصلي يفتح #signs مباشرة؛ نعرض اللوحة أولًا ثم نمرّر للأصل عبر الزر) */
    function intercept(e) {
      if (state.passthrough) return;
      var t = e.target.closest && e.target.closest('.wg, .aqh-sector'); if (!t) return;
      var i = t.classList.contains('wg') ? signIndexFromG(t) : +t.getAttribute('data-i');
      if (i < 0) return;
      e.preventDefault(); e.stopImmediatePropagation(); e.stopPropagation();
      openSign(i, t.classList.contains('wg') ? t : glyphsG.children[i]);
    }
    svg.addEventListener('click', intercept, true);
    svg.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') intercept(e); }, true);

    /* كواكب حقيقية من المحرك الحالي + بيوت سماء الشرق الأوسط + علامة R للتراجع */
    function pt(lon, r) { var a = (-90 + lon) * Math.PI / 180; return [+(200 + Math.cos(a) * r).toFixed(2), +(200 + Math.sin(a) * r).toFixed(2)]; }
    function drawHouses() {
      var old = svg.querySelector('.aqh-houses'); if (old) old.remove();
      var cusps = skyHouses(); if (!cusps) return;
      var g = sv('g', { 'class': 'aqh-houses', 'aria-hidden': 'true' });
      cusps.forEach(function (c, i) {
        var p1 = pt(c, 64), p2 = pt(c, 126);
        g.appendChild(sv('line', { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], 'class': 'aqh-hl' + (i % 3 === 0 ? ' ax' : '') }));
        var mid = c + (((cusps[(i + 1) % 12] - c) % 360 + 360) % 360) / 2, n = pt(mid, 76);
        var t = sv('text', { x: n[0], y: n[1], 'text-anchor': 'middle', 'dominant-baseline': 'central', 'class': 'aqh-hn' }); t.textContent = String(i + 1); g.appendChild(t);
      });
      svg.insertBefore(g, glyphsG);
    }
    function drawPlanets() {
      var data; try { data = skyNow(); } catch (e) { return; }
      var old = svg.querySelector('.aqh-planets'); if (old) old.remove();
      drawHouses();
      var g = sv('g', { 'class': 'aqh-planets aqh-orbit-detail' });
      var order = PLANETS.map(function (p) { return { p: p, b: data[p.key] }; }).filter(function (x) { return x.b; }).sort(function (a, b) { return a.b.lon - b.b.lon; });
      var tiers = [96, 108, 120], last = [-99, -99, -99];
      order.forEach(function (x) {
        var best = 0, bs = -1;
        for (var t = 0; t < 3; t++) { var d = Math.abs(x.b.lon - last[t]); d = Math.min(d, 360 - d); if (d >= 11) { best = t; bs = 99; break; } if (d > bs) { bs = d; best = t; } }
        last[best] = x.b.lon; x.r = tiers[best];
      });
      order.forEach(function (x) {
        var p = x.p, b = x.b, xy = pt(b.lon, x.r), cx = xy[0], cy = xy[1];
        var n = sv('g', { 'class': 'aqh-planet' + (b.retro ? ' is-retro' : ''), role: 'button', tabindex: '0', 'data-key': p.key, 'aria-label': p.ar + ' في ' + SIGN_AR[b.sign] + ' ' + b.deg + ' درجة' + (b.retro ? '، متراجع' : '') });
        n.appendChild(sv('circle', { cx: cx, cy: cy, r: 8 }));
        var t = sv('text', { x: cx, y: cy, 'text-anchor': 'middle', 'dominant-baseline': 'central' }); t.textContent = p.sym; n.appendChild(t);
        if (b.retro) {
          n.appendChild(sv('circle', { cx: cx + 8, cy: cy - 8, r: 4.6, 'class': 'aqh-rbg' }));
          var r = sv('text', { x: cx + 8, y: cy - 7.8, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'class': 'aqh-r' }); r.textContent = 'R'; n.appendChild(r);
        }
        var act = function () { openPlanet(p, b, n); };
        n.addEventListener('click', function (e) { e.stopPropagation(); act(); });
        n.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
        g.appendChild(n);
      });
      svg.appendChild(g);
    }
    drawPlanets();
    setInterval(function () { if (!document.hidden) drawPlanets(); }, 60000);
    window.__aqhHero = {
      planets: PLANETS, signs: SIGN_AR, sky: skyNow,
      focus: function (key) {
        var wrap = svg.closest('.aqh-wheel-wrap');
        $$('.aqh-planet', svg).forEach(function (n) { n.classList.toggle('is-focus', !!key && n.getAttribute('data-key') === key); });
        svg.classList.toggle('has-focus', !!key);
        if (!wrap) return;
        var n = key && svg.querySelector('.aqh-planet[data-key="' + key + '"] circle');
        if (n) { wrap.style.transformOrigin = (n.getAttribute('cx') / 4) + '% ' + (n.getAttribute('cy') / 4) + '%'; wrap.classList.add('is-zoom'); }
        else wrap.classList.remove('is-zoom');
      }
    };
  })();

  /* =============== DailyEnergy: Skeleton ← بيانات / خطأ + إعادة المحاولة =============== */
  (function dailyEnergy() {
    var card = $('#aqh-energy'); if (!card) return;
    var DAY_RULER = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn']; /* كوكب اليوم التقليدي حسب يوم الأسبوع */
    var t = $('#aqh-today'), d = new Date();
    try { t.textContent = d.toLocaleDateString('ar-EG-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { t.textContent = d.toDateString(); }
    t.setAttribute('datetime', d.toISOString().slice(0, 10));
    function set(st) { card.setAttribute('data-state', st); $('.aqh-energy-skel', card).hidden = st !== 'loading'; $('.aqh-energy-err', card).hidden = st !== 'error'; $('.aqh-energy-data', card).hidden = st !== 'ready'; }
    function load() {
      set('loading');
      setTimeout(function () {
        try {
          var sky = skyNow(), key = DAY_RULER[new Date().getDay()], p = PLANETS.filter(function (x) { return x.key === key; })[0], b = sky[key];
          if (!b) throw new Error('no-ruler');
          card.setAttribute('data-ruler', key); /* مصدر وحيد لكوكب اليوم يقرأه بانر طاقة اليوم */
          $('#aqh-energy-main').innerHTML = '<span class="aqh-pl">' + p.sym + '</span> كوكب اليوم: <b>' + p.ar + '</b> في <b>' + SIGN_AR[b.sign] + '</b> — ' + b.deg + '°';
          $('#aqh-energy-state').innerHTML = 'الحالة: <b>' + (b.retro ? 'متراجع ℞' : 'مباشر') + '</b>';
          set('ready');
        } catch (err) { if (window.console) console.warn('[home] daily energy', err && err.message); set('error'); }
      }, reduce ? 0 : 350);
    }
    $('[data-energy-retry]', card).addEventListener('click', load);
    window.addEventListener('load', load);
    if (document.readyState === 'complete') load();
  })();

  /* =============== Articles: بيانات من JSON + Carousel + معاينة =============== */
  var ARTICLES = [];
  (function articles() {
    var carousel = $('.aqh-carousel'), track = $('#aqh-track'); if (!carousel || !track) return;
    var prev = $('.aqh-car-prev'), next = $('.aqh-car-next'), msg = $('.aqh-car-msg');
    var SRC = 'assets/data/featured-content.json';
    function state(s, text) { carousel.setAttribute('data-state', s); msg.hidden = !text; if (text) msg.innerHTML = text; }
    function fmt(a) { var parts = []; if (a.category) parts.push(esc(a.category)); if (a.date) parts.push(esc(a.date)); if (a.readMinutes) parts.push(a.readMinutes + ' دقائق قراءة'); return parts.join(' · '); }
    function card(a) {
      return '<article class="aqh-article" data-content-id="' + esc(a.id) + '" data-content-type="article" data-slug="' + esc(a.slug) + '" data-category="' + esc(a.category) + '"><img src="' + esc(a.image) + '" alt="' + esc(a.imageAlt || '') + '" loading="lazy" decoding="async" draggable="false">' +
        '<div class="aqh-article-txt"><time>' + fmt(a) + '</time><h3><a class="aqh-article-link" href="#featured-content/' + esc(a.slug) + '" data-slug="' + esc(a.slug) + '">' + esc(a.title) + '</a></h3>' + (a.hook ? '<p class="aqh-hook">' + esc(a.hook) + '</p>' : '') + '<p class="aqh-intro">' + esc(a.intro) + '</p></div>' +
        '<span class="aqh-go" aria-hidden="true">' + ARROW + '</span></article>';
    }
    function load() {
      state('loading'); track.innerHTML = '<div class="aqh-article-skel" aria-hidden="true"><i></i><i></i><i class="s"></i></div><div class="aqh-article-skel" aria-hidden="true"><i></i><i></i><i class="s"></i></div><div class="aqh-article-skel" aria-hidden="true"><i></i><i></i><i class="s"></i></div>';
      fetch(SRC, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) {
        ARTICLES = ((j && j.articles) || []).map(function (a) { return { id: a.id, slug: a.slug, category: a.category, title: a.title, date: a.publishedAt, readMinutes: a.readingTime, image: a.coverImage, imageAlt: a.coverAlt, intro: a.excerpt, hook: a.hook, featured: a.featured }; });
        if (!ARTICLES.length) { track.innerHTML = ''; state('empty', '<p>لا يوجد محتوى حاليًا.</p>'); return; }
        /* الصف الأول: أحدث المقالات. الصف الثاني: اختيار عشوائي مرتب من بقية المقالات (بدون تكرار الصف الأول) */
        ARTICLES = ARTICLES.map(function (a, n) { return { a: a, n: n }; }).sort(function (x, y) { return String(y.a.date).localeCompare(String(x.a.date)) || y.n - x.n; }).map(function (x) { return x.a; });
        var TOP = ARTICLES.slice(0, 6), REST = ARTICLES.slice(6).map(function (a) { return { a: a, r: Math.random() }; }).sort(function (x, y) { return x.r - y.r; }).slice(0, 6).map(function (x) { return x.a; });
        var track2 = $('#aqh-track2'), wrap2 = $('#aqh-row2');
        if (track2 && REST.length) { track2.innerHTML = REST.map(card).join(''); if (wrap2) wrap2.hidden = false; $$('.aqh-article', track2).forEach(function (el, k) { el.classList.add('aqh-reveal'); el.style.setProperty('--aqh-d', (k * 70) + 'ms'); if (window.__aqhObserve) window.__aqhObserve(el); }); track2.addEventListener('click', function (e) { var l = e.target.closest('.aqh-article-link'); if (l) { e.preventDefault(); openArticle(l.getAttribute('data-slug')); } }); }
        track.innerHTML = TOP.map(card).join(''); state('ready');
        $$('.aqh-article', track).forEach(function (el, k) { el.classList.add('aqh-reveal'); el.style.setProperty('--aqh-d', (k * 70) + 'ms'); if (window.__aqhObserve) window.__aqhObserve(el); });
        update(); autoTimer();
      }).catch(function () { track.innerHTML = ''; state('error', '<p>تعذر تحميل المحتوى حاليًا. حاول مرة أخرى.</p><button type="button" class="aqh-outline-btn" data-car-retry><span>إعادة المحاولة</span></button>'); var r = $('[data-car-retry]', msg); if (r) r.addEventListener('click', load); });
    }
    /* --- سحب بالماوس + أسهم + تلميح الحافة --- */
    function update() {
      var more = track.scrollWidth - track.clientWidth > 4;
      var pos = Math.abs(track.scrollLeft), max = track.scrollWidth - track.clientWidth;
      prev.hidden = !(more && canHover && pos > 4); next.hidden = !(more && canHover && pos < max - 4);
      /* RTL: البداية يمينًا؛ السابق (يمين) يرجع للبداية، التالي (يسار) يتقدم نحو النهاية */
    }
    function step(dir) { track.scrollBy({ left: dir * track.clientWidth * 0.85, behavior: reduce ? 'auto' : 'smooth' }); }
    prev.addEventListener('click', function () { step(1); }); next.addEventListener('click', function () { step(-1); }); /* RTL: scrollLeft سالب نحو النهاية */
    track.addEventListener('scroll', function () { update(); try { sessionStorage.setItem('aqh-car', String(track.scrollLeft)); } catch (e) { } }, { passive: true });
    window.addEventListener('resize', update);
    function restorePos() { try { sessionStorage.removeItem('aqh-car'); } catch (e) { } }
    var drag = null, moved = false;
    track.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.button !== 0) return; drag = { x: e.clientX, s: track.scrollLeft }; moved = false; track.classList.add('is-drag'); });
    window.addEventListener('pointermove', function (e) { if (!drag) return; var dx = e.clientX - drag.x; if (Math.abs(dx) > 6) moved = true; if (moved) track.scrollLeft = drag.s - dx; });
    window.addEventListener('pointerup', function () { if (!drag) return; drag = null; track.classList.remove('is-drag'); });
    track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; return; } var l = e.target.closest('.aqh-article-link'); if (l) { e.preventDefault(); openArticle(l.getAttribute('data-slug'), l); } else { var c = e.target.closest('.aqh-article'); if (c) { var a = $('.aqh-article-link', c); e.preventDefault(); openArticle(a.getAttribute('data-slug'), a); } } }, true);
    document.addEventListener('keydown', function (e) { if (e.target === track && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); step(e.key === 'ArrowLeft' ? -1 : 1); } });

    /* --- تجديد تلقائي كل 30 ثانية: يتقدم المعرض خطوة، ويعود للبداية عند النهاية --- */
    var autoT = null;
    function autoTimer() {
      clearInterval(autoT); if (reduce) return;
      autoT = setInterval(function () {
        if (document.hidden || carousel.matches(':hover') || carousel.contains(document.activeElement)) return;
        var r = carousel.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
        var max = track.scrollWidth - track.clientWidth; if (max <= 4) return;
        if (Math.abs(track.scrollLeft) >= max - 4) track.scrollTo({ left: 0, behavior: 'smooth' }); else step(-1);
      }, 30000);
    }
    /* --- فتح المحتوى: صفحة القراءة الداخلية (featured-content.js) --- */
    function openArticle(slug) { location.hash = '#featured-content/' + slug; }
    window.AqhArticles = { all: function () { return ARTICLES; }, open: openArticle };
    load();
  })();

  /* =============== Search overlay (بحث في وجهات الموقع والمقالات المعروضة) =============== */
  (function search() {
    var btn = $('[data-aqh-search]'); if (!btn) return;
    var DEST = [
      { t: 'الخريطة الفلكية', k: 'خريطة الميلاد الطالع الكواكب البيوت', h: '#chart' },
      { t: 'مصفوفة القدر', k: 'ماتريكس اركانا الشاكرات الذيل الكارمي', h: '#matrix' },
      { t: 'مسار الحياة', k: 'علم الارقام رقم المسار القمم', h: '#lifepath' },
      { t: 'التوافق', k: 'سينسترى علاقة شريك', h: '#compat' },
      { t: 'السماء', k: 'ترانزيت عبور مرصد كواكب', h: '#sky' },
      { t: 'حسابي', k: 'تسجيل دخول ملف شخصي ارشيف', h: '#account' }
    ];
    btn.addEventListener('click', function () {
      var box = openLayer({
        kind: 'search', titleId: 'aqh-search-title', opener: btn,
        html: closeBtn + '<div class="aqh-search-body"><h3 id="aqh-search-title">بحث في الموقع</h3><label class="aqh-sr" for="aqh-q">ابحث عن قسم أو محتوى</label><input id="aqh-q" type="search" placeholder="مثال: مصفوفة، ترانزيت، توافق…" autocomplete="off"><ul class="aqh-results" role="listbox" aria-label="النتائج"></ul></div>'
      });
      var inp = $('#aqh-q', box), ul = $('.aqh-results', box);
      function items(q) {
        var n = norm(q), all = DEST.map(function (d) { return { t: d.t, sub: 'قسم', h: d.h, hay: norm(d.t + ' ' + d.k) }; })
          .concat(ARTICLES.map(function (a) { return { t: a.title, sub: 'محتوى مميز', slug: a.slug, hay: norm(a.title + ' ' + a.category + ' ' + a.intro) }; }));
        return n ? all.filter(function (x) { return x.hay.indexOf(n) > -1; }) : all.slice(0, 7);
      }
      function render() {
        var r = items(inp.value);
        ul.innerHTML = r.length ? r.map(function (x, k) { return '<li role="option"><a href="' + (x.h || '#featured-content/' + x.slug) + '" data-k="' + k + '"><b>' + esc(x.t) + '</b><small>' + x.sub + '</small></a></li>'; }).join('') : '<li class="aqh-empty">لا نتائج مطابقة.</li>';
        $$('a', ul).forEach(function (a, k) { a.addEventListener('click', function (e) { var x = r[k]; if (x.slug) { e.preventDefault(); closeLayer(true); window.AqhArticles.open(x.slug, btn); } else closeLayer(true); }); });
      }
      inp.addEventListener('input', render);
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var a = $('a', ul); if (a) { e.preventDefault(); a.click(); if (a.getAttribute('href').charAt(1) !== 'a') location.hash = a.getAttribute('href'); } } });
      render(); inp.focus();
    });
  })();

  /* =============== Reveal عند التمرير: مرة واحدة، 15%، 16px، 500ms =============== */
  (function reveal() {
    root.classList.add('aqh-js');
    var ready = function () { requestAnimationFrame(function () { root.classList.add('aqh-ready'); }); };
    if (document.readyState === 'complete') ready(); else window.addEventListener('load', ready);
    setTimeout(function () { root.classList.add('aqh-ready'); }, 1200);
    if (reduce || !('IntersectionObserver' in window)) { $$('.aqh-reveal').forEach(function (e) { e.classList.add('is-in'); }); window.__aqhObserve = function (e) { e.classList.add('is-in'); }; return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { threshold: 0.15 });
    window.__aqhObserve = function (e) { io.observe(e); };
    $$('.aqh-reveal').forEach(function (el) {
      var g = el.closest('.aqh-stagger'); if (g) el.style.setProperty('--aqh-d', ([].indexOf.call(g.querySelectorAll('.aqh-reveal'), el) * 70) + 'ms');
      io.observe(el);
    });
    setTimeout(function () { $$('.aqh-reveal').forEach(function (e) { e.classList.add('is-in'); }); }, 9000);
  })();
})();

;
/* assets/js/home-hub.js */
/* الرئيسية: شريط الأدوات (تسجيل الدخول/حسابي) + قراءاتك المحفوظة + نشاطك الأخير.
   لا يمسّ auth.js ولا Supabase: يقرأ حالة الدخول من عنصر الحساب الموجود ويقرأ القراءات من AqeeqPlatform. */
(function () {
  'use strict';
  var ACT_KEY = 'aqeeq_activity_v1';
  var LABELS = {
    chart: 'الخريطة الفلكية', lifepath: 'مسار الحياة', matrix: 'مصفوفة القدر', compat: 'خريطة التوافق',
    relationships: 'مركز التوافق', individual: 'خرائطك الشخصية', signs: 'صفات وتوقعات الأبراج',
    sky: 'المشهد الفلكي الآن', world: 'الخريطة الفلكية العالمية', 'astro-maps': 'العبور والتقويم الفلكي',
    'featured-content': 'المحتوى المميز', 'lifepath-compat': 'توافق مسارات الحياة', 'matrix-compat': 'توافق مصفوفة القدر', 'matrix-child': 'مصفوفة الطفل'
  };
  var ICONS = {
    saved: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    chart: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',
    lifepath: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M6 16.5V13a4 4 0 0 1 4-4h4a4 4 0 0 0 4-4V7.5"/>',
    matrix: '<path d="M12 3l9 9-9 9-9-9z"/><path d="M12 8l4 4-4 4-4-4z"/>',
    compat: '<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>',
    sky: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>',
    doc: '<path d="M7 3h8l4 4v14H7z"/><path d="M14 3v5h5M10 13h6M10 17h4"/>'
  };
  function svg(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[k] || ICONS.doc) + '</svg>'; }
  function iconFor(t) { t = String(t || ''); return /natal|chart|خريطة/.test(t) ? 'chart' : /life|مسار/.test(t) ? 'lifepath' : /matrix|مصفوفة/.test(t) ? 'matrix' : /compat|synastry|توافق/.test(t) ? 'compat' : /sky|سماء/.test(t) ? 'sky' : 'doc'; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function fmt(iso) { try { return new Date(iso).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' }); } catch (_) { return ''; } }
  function ago(ts) {
    var m = Math.round((Date.now() - ts) / 60000);
    if (m < 1) return 'الآن'; if (m < 60) return 'منذ ' + m + ' دقيقة';
    var h = Math.round(m / 60); if (h < 24) return 'منذ ' + h + ' ساعة';
    return fmt(new Date(ts).toISOString());
  }
  function loggedIn() { var u = document.getElementById('acct-user'); return !!(u && !u.hidden); }

  /* ---------- زر تسجيل الدخول / حسابي ---------- */
  function syncLogin() {
    var a = document.getElementById('aqh-login-tool'); if (!a) return;
    var on = loggedIn(), b = a.querySelector('b'), s = a.querySelector('small');
    a.classList.toggle('is-in', on);
    if (b) b.textContent = 'حسابي';
    if (s) s.textContent = on ? 'قراءاتك المحفوظة وبياناتك' : 'سجّل الآن لتعرف أكثر عن نفسك، أنت مميز';
  }

  /* ---------- سجل النشاط ---------- */
  function readAct() { try { var r = JSON.parse(localStorage.getItem(ACT_KEY) || '[]'); return Array.isArray(r) ? r : []; } catch (_) { return []; } }
  function track() {
    var k = (location.hash || '').replace(/^#/, ''); if (!LABELS[k]) return;
    var list = readAct(), top = list[0];
    if (top && top.k === k && Date.now() - top.t < 600000) return;
    list.unshift({ k: k, t: Date.now() });
    try { localStorage.setItem(ACT_KEY, JSON.stringify(list.slice(0, 12))); } catch (_) {}
  }

  /* ---------- القوائم ---------- */
  function emptyBox(text, cta) {
    var d = el('div', 'aqh-mempty', '<p></p>'); d.firstChild.textContent = text;
    if (cta) { var a = el('a', 'aqh-mbtn'); a.href = cta.href; a.textContent = cta.t; d.appendChild(a); }
    return d;
  }
  function renderSaved(host) {
    var P = window.AqeeqPlatform, list = (P && P.getSavedReadings && P.getSavedReadings()) || [];
    host.textContent = '';
    if (!list.length) {
      host.appendChild(emptyBox(loggedIn() ? 'لسه ما حفظتش قراءات. احسب خريطتك أو مسار حياتك واحفظ القراءة لتظهر هنا.' : 'سجّل دخولك لتحفظ قراءاتك ومقالاتك وترجع لها في أي وقت.', loggedIn() ? { href: '#individual', t: 'ابدأ قراءة' } : { href: '#account', t: 'تسجيل الدخول' }));
      return;
    }
    list.slice(0, 3).forEach(function (it) {
      var a = el('a', 'aqh-mi'); a.href = it.route || '#chart';
      var ic = el('span', 'aqh-mi-ic', svg(iconFor(it.type))), t = el('span', 'aqh-mi-t'), b = el('b'), sm = el('small');
      b.textContent = it.title || 'قراءة محفوظة'; sm.textContent = (it.typeLabel || 'قراءة') + (it.createdAt ? ' · ' + fmt(it.createdAt) : '');
      t.appendChild(b); t.appendChild(sm); a.appendChild(ic); a.appendChild(t);
      a.addEventListener('click', function (e) { if (P && P.restoreSavedReading) { try { P.restoreSavedReading(it); e.preventDefault(); } catch (_) {} } });
      host.appendChild(a);
    });
  }
  function renderActivity(host) {
    var list = readAct().filter(function (x) { return x.k !== 'home'; }); host.textContent = '';
    if (!list.length) { host.appendChild(emptyBox('أي أداة تفتحها هتظهر هنا عشان ترجع لها بسرعة.', { href: '#individual', t: 'استكشف الأدوات' })); return; }
    list.slice(0, 4).forEach(function (x) {
      var a = el('a', 'aqh-mi'); a.href = '#' + x.k;
      var ic = el('span', 'aqh-mi-ic', svg(iconFor(x.k))), t = el('span', 'aqh-mi-t'), b = el('b'), sm = el('small');
      b.textContent = 'فتحت ' + LABELS[x.k]; sm.textContent = ago(x.t);
      t.appendChild(b); t.appendChild(sm); a.appendChild(ic); a.appendChild(t); host.appendChild(a);
    });
  }
  function renderMine() {
    var s = document.querySelector('#aqh-mine [data-list="saved"]'), a = document.querySelector('#aqh-mine [data-list="activity"]');
    if (s) renderSaved(s); if (a) renderActivity(a);
  }

  function init() {
    syncLogin(); track(); renderMine();
    var u = document.getElementById('acct-user');
    if (u) new MutationObserver(function () { syncLogin(); renderMine(); }).observe(u, { attributes: true, attributeFilter: ['hidden'] });
    window.addEventListener('hashchange', function () { track(); if (!location.hash || location.hash === '#home') renderMine(); });
    window.addEventListener('storage', renderMine);
    setTimeout(function () { syncLogin(); renderMine(); }, 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

;
/* assets/js/featured-content.js */
/* المحتوى المميز — القائمة + صفحة القراءة (مصدر واحد: assets/data/featured-content.json) */
(function () {
  'use strict';
  var SRC = 'assets/data/featured-content.json', CK = 'aq-fc-cache', PAGE = 4;
  var CATS = ['الكل', 'الأبراج', 'الكواكب', 'القمر', 'العبور', 'التراجعات', 'مصفوفة القدر', 'مسار الحياة', 'العلاقات', 'الرموز'];
  var list = document.getElementById('featured-content'), reader = document.getElementById('featured-reader');
  if (!list || !reader) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DATA = null, offline = false, loadState = 'idle', st = { cat: 'الكل', q: '', page: 1 }, internal = 0, fromKey = '', toastEl, toastT;
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
  var ICO = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4h12v16l-6-4-6 4z"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.2 11l7.6-4M8.2 13l7.6 4"/></svg>'
  };
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) { return String(s || '').toLowerCase().replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[ؤئ]/g, 'ء').replace(/\s+/g, ' ').trim(); }
  function fmtDate(d) { try { return new Date(d + 'T12:00:00').toLocaleDateString('ar-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' }); } catch (e) { return d || ''; } }
  function meta(a) { return '<span>' + esc(fmtDate(a.publishedAt)) + '</span><span>' + esc(a.readingTime) + ' دقائق قراءة</span>'; }
  function toast(m) { if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'fc-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); } toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 2400); }
  function mini(a, i) {
    return '<article class="fc-card fc-mini" data-content-id="' + esc(a.id) + '" data-content-type="article" data-slug="' + esc(a.slug) + '" data-category="' + esc(a.category) + '" style="--d:' + Math.min(i, 8) * 60 + 'ms">' +
      '<div class="fc-mini-img"><img src="' + esc(a.coverImage) + '" alt="' + esc(a.coverAlt) + '" loading="lazy" decoding="async" width="320" height="180" draggable="false"></div>' +
      '<div class="fc-mini-b">' + topic(a) + '<h3><a href="#featured-content/' + esc(a.slug) + '" draggable="false">' + esc(a.title) + '</a></h3>' +
      '<div class="fc-meta"><span>' + esc(fmtDate(a.publishedAt)) + '</span><span>' + esc(a.readingTime) + ' د</span></div></div></article>';
  }
  var ASTRO = ['الأبراج', 'الكواكب', 'القمر', 'العبور', 'التراجعات'];
  var TICO = {
    'الفلك': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17v4M17 19h4" /></svg>',
    'مسار الحياة': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19l5-6 4 3 7-10"/><path d="M15 6h5v5"/></svg>',
    'مصفوفة القدر': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9 9-9 9-9-9z"/><path d="M12 8l4 4-4 4-4-4z"/></svg>',
    'العلاقات': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/></svg>',
    'الرموز': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17M3.5 12h17"/></svg>'
  };
  TICO['الأبراج'] = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.2"/><path d="M12 3.5v6.3M12 14.2v6.3M4.6 7.8l5.5 3.2M13.9 13l5.5 3.2M4.6 16.2l5.5-3.2M13.9 11l5.5-3.2"/></svg>';
  TICO['الكواكب'] = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.6"/><path d="M3.2 15.5c-1-2.4 3.7-6.2 10.4-8.4 4.3-1.4 7.4-1.4 7.8-.3.5 1.3-2.4 3.9-6.8 5.8"/></svg>';
  TICO['أحدث'] = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>';
  var GROUPS = [
    { k: 'الأبراج', cats: ['الأبراج'], ico: 'الأبراج' },
    { k: 'الكواكب والقمر والعبور', cats: ['الكواكب', 'القمر', 'العبور', 'التراجعات'], ico: 'الكواكب' },
    { k: 'مسار الحياة ومصفوفة القدر', cats: ['مسار الحياة', 'مصفوفة القدر'], ico: 'مسار الحياة' },
    { k: 'العلاقات والرموز', cats: ['العلاقات', 'الرموز'], ico: 'العلاقات' }
  ];
  function groupOf(k) { return GROUPS.filter(function (g) { return g.k === k; })[0]; }
  function newest() { return (DATA || []).slice().sort(function (a, b) { return a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0; }); }
  function rowDefs() {
    var all = newest(), used = {}, out = [];
    GROUPS.forEach(function (g) { var it = all.filter(function (a) { return g.cats.indexOf(a.category) > -1; }); g.cats.forEach(function (c) { used[c] = 1; }); if (it.length) out.push({ k: g.k, ico: g.ico, items: it }); });
    var extra = {}; all.forEach(function (a) { if (!used[a.category]) (extra[a.category] = extra[a.category] || []).push(a); });
    Object.keys(extra).forEach(function (c) { out.push({ k: c, ico: 'الفلك', items: extra[c] }); });
    return out;
  }
  function topic(a) {
    var main = ASTRO.indexOf(a.category) > -1 ? 'الفلك' : a.category, sub = main !== a.category ? a.category : '';
    return '<span class="fc-topic" data-topic="' + esc(main) + '"><span class="fc-topic-i">' + (TICO[main] || TICO['الفلك']) + '</span><b>' + esc(main) + '</b>' + (sub ? '<i aria-hidden="true"></i><span>' + esc(sub) + '</span>' : '') + '</span>';
  }
  function bySlug(s) { return (DATA || []).filter(function (a) { return a.slug === s; })[0]; }
  function url(slug) { return location.origin + location.pathname + '#featured-content/' + slug; }

  /* ---------- البيانات: شبكة ← كاش محلي ---------- */
  function load() {
    loadState = 'loading'; render();
    return fetch(SRC, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) {
      DATA = (j && j.articles) || []; offline = false; loadState = 'ready';
      try { localStorage.setItem(CK, JSON.stringify(DATA)); } catch (e) { }
    }).catch(function () {
      var c = null; try { c = JSON.parse(localStorage.getItem(CK) || 'null'); } catch (e) { }
      if (c && c.length) { DATA = c; offline = true; loadState = 'ready'; } else loadState = 'error';
    }).then(function () { render(); route(); window.dispatchEvent(new CustomEvent('fc:ready')); });
  }
  window.FeaturedContent = { all: function () { return DATA || []; }, get: bySlug, href: function (s) { return '#featured-content/' + s; } };

  /* ---------- التصفية والبحث ---------- */
  function filtered() {
    var q = norm(st.q);
    return (DATA || []).filter(function (a) {
      var g = groupOf(st.cat);
      if (st.cat !== 'الكل' && (g ? g.cats.indexOf(a.category) < 0 : a.category !== st.cat)) return false;
      if (!q) return true;
      return norm([a.title, a.category, a.excerpt, (a.keywords || []).join(' ')].join(' ')).indexOf(q) > -1;
    });
  }
  function card(a, i, tile) {
    return '<article class="fc-card' + (tile ? ' fc-tile' : '') + '" data-content-id="' + esc(a.id) + '" data-content-type="article" data-slug="' + esc(a.slug) + '" data-category="' + esc(a.category) + '" style="--d:' + Math.min(i, 8) * 70 + 'ms">' +
      '<div class="fc-card-img"><img src="' + esc(a.coverImage) + '" alt="' + esc(a.coverAlt) + '" loading="lazy" decoding="async" width="470" height="180"></div>' +
      '<div class="fc-card-b">' + topic(a) + '<h3><a href="#featured-content/' + esc(a.slug) + '">' + esc(a.title) + '</a></h3><p>' + esc(a.excerpt) + '</p>' +
      '<div class="fc-card-f"><div class="fc-meta">' + meta(a) + '</div><span class="fc-go" aria-hidden="true">' + ARROW + '</span></div></div></article>';
  }
  /* ---------- البانر: ثابت، والجملة تحته هي اللي تتبدل ---------- */
  var QUOTES = ['السماء لا تحكم عليك، هي تُريك الإيقاع فقط.', 'كل رقم في ميلادك يحمل سؤالًا قبل أن يحمل جوابًا.', 'اقرأ خريطتك كما تقرأ رسالة من نفسك القديمة.', 'العبور لحظة، والدرس يبقى.', 'الرموز مرآة، لا وصفة جاهزة.', 'افهم دورتك، فالفهم أول الهدوء.'];
  var quoteI = Math.floor(Math.random() * QUOTES.length), quoteT = null, STAR = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>';
  function pickA() { return (DATA || []).filter(function (x) { return x.featured; })[0] || newest()[0]; }
  function pick() {
    var a = pickA(); if (!a) return '';
    return '<section class="fc-pick" aria-labelledby="fc-pick-t" data-content-id="' + esc(a.id) + '" data-content-type="article" data-slug="' + esc(a.slug) + '" data-category="' + esc(a.category) + '">' +
      '<div class="fc-pick-main"><div class="fc-pick-txt"><span class="fc-flag">الأبرز الآن</span><h2 id="fc-pick-t">' + esc(a.title) + '</h2><p>' + esc(a.excerpt) + '</p>' +
      '<div class="fc-pick-row"><a class="fc-btn" href="#featured-content/' + esc(a.slug) + '"><span>اقرأ المحتوى</span>' + ARROW + '</a><div class="fc-meta">' + meta(a) + '</div></div></div>' +
      '<div class="fc-pick-img"><img src="' + esc(a.coverImage) + '" alt="' + esc(a.coverAlt) + '" decoding="async"></div></div>' +
      '<div class="fc-pick-q" aria-hidden="true">' + STAR + '<span id="fc-quote">' + esc(QUOTES[quoteI]) + '</span>' + STAR + '</div></section>';
  }
  function startQuote() {
    clearInterval(quoteT); if (reduce) return;
    quoteT = setInterval(function () {
      var el = $('#fc-quote'); if (!el || document.hidden || !list.getClientRects().length || !list.matches('.fc-open,:target')) return;
      el.classList.add('is-out');
      setTimeout(function () { quoteI = (quoteI + 1) % QUOTES.length; el.textContent = QUOTES[quoteI]; el.classList.remove('is-out'); }, 420);
    }, 8000);
  }

  /* ---------- رسم القائمة ---------- */
  function render() {
    var host = $('#fc-list-body'); if (!host) return;
    var h = '';
    if (loadState === 'loading' || loadState === 'idle') {
      h = '<div class="fc-grid" aria-busy="true">' + '<div class="fc-skel"></div>'.repeat(3) + '</div>';
      host.innerHTML = h; return;
    }
    if (loadState === 'error') {
      host.innerHTML = '<div class="fc-grid"><div class="fc-msg" role="alert"><p>تعذر تحميل المحتوى حاليًا. حاول مرة أخرى.</p><button type="button" class="fc-btn" data-fc-retry><span>إعادة المحاولة</span></button></div></div>'; return;
    }
    var items = filtered(), showPick = st.cat === 'الكل' && !st.q;
    h += offline ? '<p class="fc-offline" role="status">أنت تتصفح نسخة محفوظة من المحتوى بسبب ضعف الاتصال.</p>' : '';
    h += showPick ? pick() : '';
    if (st.cat !== 'الكل' && !st.q) h += '<div class="fc-gpage"><button type="button" class="fc-gback" data-fc-reset aria-label="رجوع إلى المحتوى المميز">' + PGP + '</button><div><h2>' + esc(st.cat) + '</h2><small>' + (SUB[st.cat] || '') + '</small></div></div>';
    h += '<div class="fc-tools"><div class="fc-filters" role="group" aria-label="تصنيفات المحتوى" id="fc-filters">' + CATS.map(function (c) { return '<button type="button" class="fc-chip" data-cat="' + esc(c) + '" aria-pressed="' + (c === st.cat) + '">' + esc(c) + '</button>'; }).join('') + '</div></div>';
    h += '<div class="fc-sub"><p class="fc-count" id="fc-count" role="status" aria-live="polite"></p>' +
      '<div class="fc-search" role="search"><label for="fc-q" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">ابحث في المحتوى</label>' + ICO.search +
      '<input id="fc-q" type="search" autocomplete="off" placeholder="ابحث بالعنوان أو التصنيف أو الكلمة" value="' + esc(st.q) + '"><button type="button" data-fc-clear aria-label="مسح البحث"' + (st.q ? '' : ' hidden') + '>' + ICO.x + '</button></div></div>';
    h += '<div class="fc-list" id="fc-grid"></div><nav class="fc-pager" id="fc-more" aria-label="ترقيم الصفحات"></nav><div id="fc-cta-slot"></div>';
    h += '<div class="fc-back-cta"><a class="fc-btn" href="#home"><span>العودة إلى الرئيسية</span>' + ARROW + '</a></div>';
    h += newsletterHTML();
    host.innerHTML = h; paintGrid(); bindTools(); bindNewsletter(); if (showPick) startQuote(); else clearInterval(quoteT);
  }
  var MAIL = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6.5L20.5 7"/></svg>';
  function newsArt() {
    var t = '', k, a, c, sn;
    for (k = 0; k < 72; k++) { a = k * 5 * Math.PI / 180; c = Math.cos(a); sn = Math.sin(a); var r2 = k % 6 === 0 ? 80 : 86; t += '<path d="M' + (100 + 92 * c).toFixed(1) + ' ' + (100 + 92 * sn).toFixed(1) + 'L' + (100 + r2 * c).toFixed(1) + ' ' + (100 + r2 * sn).toFixed(1) + '"/>'; }
    var star = function (x, y, z) { return '<path d="M' + x + ' ' + (y - z) + 'Q' + x + ' ' + y + ' ' + (x + z) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y + z) + 'Q' + x + ' ' + y + ' ' + (x - z) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y - z) + 'Z" fill="currentColor"/>'; };
    return '<svg class="fc-news-art a1" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width=".8" aria-hidden="true" focusable="false"><circle cx="100" cy="100" r="96"/><circle cx="100" cy="100" r="74"/><circle cx="100" cy="100" r="52"/><circle cx="100" cy="100" r="3" fill="currentColor"/>' + t + '<path d="M100 4v192M4 100h192M32 32l136 136M168 32L32 168" stroke-width=".5"/></svg>' +
      '<svg class="fc-news-art a2" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width=".9" aria-hidden="true" focusable="false"><path d="M118 28a72 72 0 1 0 0 144 58 58 0 1 1 0-144z"/><path d="M118 40a60 60 0 1 0 0 120 48 48 0 1 1 0-120z" stroke-width=".4"/>' + star(158, 52, 7) + star(176, 108, 4) + star(150, 150, 5) + star(40, 36, 3) + '</svg>';
  }
  function newsletterHTML() {
    return '<section class="fc-news" aria-labelledby="fc-news-t">' + newsArt() + '<div class="fc-news-ico">' + MAIL + '</div>' +
      '<div class="fc-news-txt"><h2 id="fc-news-t">انضم إلى نشرة عقيق</h2><p>مقالات مختارة وقراءات فلكية تصلك على بريدك، بلا إزعاج.</p></div>' +
      '<form class="fc-news-form" id="fc-news-form" novalidate><label for="fc-news-email" class="fc-sr">البريد الإلكتروني</label>' +
      '<input id="fc-news-email" type="email" inputmode="email" autocomplete="email" dir="ltr" placeholder="بريدك الإلكتروني" maxlength="254" required>' +
      '<button type="submit" class="fc-news-btn">اشترك</button></form>' +
      '<p class="fc-news-msg" id="fc-news-msg" role="status" aria-live="polite"></p></section>';
  }
  function bindNewsletter() {
    var f = $('#fc-news-form'); if (!f) return;
    var msg = $('#fc-news-msg'), inp = $('#fc-news-email'), btn = f.querySelector('button'), busy = false;
    function say(t, ok) { msg.textContent = t; msg.className = 'fc-news-msg ' + (ok ? 'is-ok' : 'is-err'); }
    f.addEventListener('submit', function (e) {
      e.preventDefault(); if (busy) return;
      var v = inp.value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) || v.length > 254) { say('اكتب بريدًا إلكترونيًا صحيحًا.', false); inp.focus(); return; }
      var sb = window.aqeeqSupabase;
      if (!sb || !sb.rpc) { say('تعذّر الاتصال الآن، حاول لاحقًا.', false); return; }
      busy = true; btn.disabled = true; btn.textContent = 'جارٍ الإرسال';
      sb.rpc('subscribe_newsletter', { p_email: v, p_source: 'featured-content' }).then(function (r) {
        if (r && !r.error && r.data === 'ok') { say('تم اشتراكك. شكرًا لانضمامك إلى نشرة عقيق.', true); inp.value = ''; }
        else if (r && !r.error && r.data === 'invalid') say('اكتب بريدًا إلكترونيًا صحيحًا.', false);
        else say('تعذّر إتمام الاشتراك، حاول مرة أخرى.', false);
      }, function () { say('تعذّر إتمام الاشتراك، حاول مرة أخرى.', false); })
      .then(function () { busy = false; btn.disabled = false; btn.textContent = 'اشترك'; });
    });
  }
  (function legal() {
    var T = {
      privacy: ['سياسة الخصوصية', 'نجمع بريدك الإلكتروني فقط عند اشتراكك في النشرة، ونستخدمه لإرسال المحتوى المختار إليك. لا نبيع بريدك ولا نشاركه مع أي جهة، ويمكنك طلب حذفه في أي وقت عبر التواصل معنا.'],
      terms: ['شروط الاستخدام', 'المحتوى المنشور للتأمل والاطلاع والتسلية، ولا يُعدّ استشارة طبية أو مالية أو قانونية. استخدامك للموقع يعني موافقتك على ذلك، ويحق لنا تحديث المحتوى والشروط عند الحاجة.']
    };
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-fc-legal]'); if (!b) { if (e.target.closest('[data-fc-legal-close]')) { var o = document.getElementById('fc-legal'); if (o) o.remove(); } return; }
      e.preventDefault(); var k = b.getAttribute('data-fc-legal'), d = T[k]; if (!d) return;
      var old = document.getElementById('fc-legal'); if (old) old.remove();
      var el = document.createElement('div'); el.id = 'fc-legal'; el.className = 'fc-legal'; el.setAttribute('data-fc-legal-close', '');
      el.innerHTML = '<div class="fc-legal-box" role="dialog" aria-modal="true" aria-labelledby="fc-legal-t" dir="rtl"><h2 id="fc-legal-t">' + d[0] + '</h2><p>' + d[1] + '</p><button type="button" class="fc-news-btn" data-fc-legal-close>حسنًا</button></div>';
      el.firstChild.addEventListener('click', function (ev) { if (!ev.target.closest('[data-fc-legal-close]')) ev.stopPropagation(); });
      document.body.appendChild(el); el.querySelector('button').focus();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { var o = document.getElementById('fc-legal'); if (o) o.remove(); } });
  })();
  var PGP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  var PGN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
  function pagerHTML(pages) {
    if (pages < 2) return '';
    var h = '<button type="button" class="fc-pg" data-pg="' + (st.page - 1) + '" aria-label="الصفحة السابقة"' + (st.page === 1 ? ' disabled' : '') + '>' + PGP + '</button>';
    for (var k = 1; k <= pages; k++) h += '<button type="button" class="fc-pg' + (k === st.page ? ' on' : '') + '" data-pg="' + k + '"' + (k === st.page ? ' aria-current="page"' : '') + ' aria-label="الصفحة ' + k + '">' + k + '</button>';
    return h + '<button type="button" class="fc-pg" data-pg="' + (st.page + 1) + '" aria-label="الصفحة التالية"' + (st.page === pages ? ' disabled' : '') + '>' + PGN + '</button>';
  }
  function countText(n) { return n + (n === 1 ? ' مادة' : n === 2 ? ' مادتان' : n <= 10 ? ' مواد' : ' مادة'); }
  var SUB = { 'الأبراج': 'شخصيات الأبراج وتفاصيلها', 'الكواكب والقمر والعبور': 'حركة السماء وأثرها عليك', 'مسار الحياة ومصفوفة القدر': 'أرقامك ودوراتك الكبرى', 'العلاقات والرموز': 'ما بينك وبين الآخرين ومعاني الرموز', 'أحدث ما نُشر': 'الأحدث في المحتوى المميز' };
  function rowHead(k, ico, n, all) {
    return '<header class="fc-row-h"><' + (all ? 'button type="button" data-fc-group="' + esc(k) + '"' : 'div') + ' class="fc-row-t"><span class="fc-row-ic">' + (TICO[ico] || TICO['الفلك']) + '</span><span><h2>' + esc(k) + (all ? '<i class="fc-row-chev">' + PGN + '</i>' : '') + '</h2><small>' + (SUB[k] || countText(n)) + '</small></span></' + (all ? 'button' : 'div') + '>' +
      (all ? '<button type="button" class="fc-row-all" data-fc-group="' + esc(k) + '"><span>عرض كل المقالات</span>' + ARROW + '</button>' : '') + '</header>';
  }
  /* ---------- بطاقات الدعوة السياقية: كل تصنيف يقود للأداة المناسبة ---------- */
  var CTA = {
    chart: { ico: 'الفلك', t: 'استخرج خريطتك الفلكية', x: 'اكتشف تموضع كواكبك وبيوتك الفلكية بالتفصيل', href: '#chart', b: 'احسب خريطتي الفلكية' },
    life: { ico: 'مسار الحياة', t: 'احسب مسار حياتك', x: 'اكتشف أرقام القمم والتحديات ودورات العمر', href: '#lifepath', b: 'احسب مسار حياتي' },
    matrix: { ico: 'مصفوفة القدر', t: 'احسب مصفوفة قدرك', x: 'اكتشف طاقتك المركزية وذيولك الكارمية', href: '#matrix', b: 'احسب مصفوفتي' },
    rel: { ico: 'العلاقات', t: 'استكشف ديناميكية العلاقة', x: 'عبر حواسب التوافق الفلكي والعددي في مركز العلاقات والشراكات', href: '#relationships', b: 'افتح مركز العلاقات' }
  };
  var CAT_CTA = { 'الأبراج': 'chart', 'الكواكب': 'chart', 'القمر': 'chart', 'العبور': 'chart', 'التراجعات': 'chart', 'الرموز': 'chart', 'مسار الحياة': 'life', 'مصفوفة القدر': 'matrix', 'العلاقات': 'rel' };
  function ctaCard(k, where) {
    var c = CTA[k]; if (!c) return '';
    return '<aside class="fc-cta" data-cta="' + k + '" data-where="' + where + '"><span class="fc-cta-ico">' + (TICO[c.ico] || TICO['الفلك']) + '</span>' +
      '<div class="fc-cta-t"><b>' + esc(c.t) + '</b><span>' + esc(c.x) + '</span></div>' +
      '<a class="fc-cta-btn" href="' + esc(c.href) + '"><span>' + esc(c.b) + '</span>' + ARROW + '</a></aside>';
  }
  var ROW_CTA = { 'الأبراج': ['chart'], 'الكواكب والقمر والعبور': ['chart'], 'مسار الحياة ومصفوفة القدر': ['life', 'matrix'], 'العلاقات والرموز': ['rel'] };
  function rowCtas(r) {
    var ks = ROW_CTA[r.k] || [CAT_CTA[(r.items[0] || {}).category]];
    var out = ks.filter(Boolean).map(function (k) { return ctaCard(k, 'row'); }).join('');
    return out ? '<div class="fc-cta-row">' + out + '</div>' : '';
  }
  function paintRows(g, pg, cnt) {
    var all = newest(), pages = Math.max(1, Math.ceil(all.length / PAGE)); if (st.page > pages) st.page = pages;
    var latest = all.slice((st.page - 1) * PAGE, st.page * PAGE);
    cnt.textContent = countText(all.length);
    pg.innerHTML = '';
    if (g.getAttribute('data-mode') === 'rows' && $('#fc-latest-grid')) {
      $('#fc-latest-grid').innerHTML = latest.map(function (a, i) { return mini(a, i); }).join('');
      $('#fc-more-l').innerHTML = pagerHTML(pages); return;
    }
    g.setAttribute('data-mode', 'rows'); g.className = 'fc-rows';
    var h = '<section class="fc-row is-latest" id="fc-latest" aria-label="أحدث ما نُشر">' + rowHead('أحدث ما نُشر', 'أحدث', all.length, false) +
      '<div class="fc-row-grid" id="fc-latest-grid" data-n="4">' + latest.map(function (a, i) { return mini(a, i); }).join('') + '</div>' +
      '<nav class="fc-pager" id="fc-more-l" aria-label="ترقيم الصفحات">' + pagerHTML(pages) + '</nav></section>';
    rowDefs().forEach(function (r, ri) {
      h += '<section class="fc-row" aria-label="' + esc(r.k) + '">' + rowHead(r.k, r.ico, r.items.length, true) +
        '<div class="fc-track-wrap"><button type="button" class="fc-nav fc-nav-p" data-nav="1" aria-label="السابق" hidden>' + PGP + '</button>' +
        '<div class="fc-track" tabindex="0" role="region" aria-label="' + esc(r.k) + ' — مرّر أفقيًا">' + r.items.map(function (a, i) { return mini(a, i); }).join('') + '</div>' +
        '<button type="button" class="fc-nav fc-nav-n" data-nav="-1" aria-label="التالي" hidden>' + PGN + '</button></div></section>';
    });
    g.innerHTML = h; wireTracks(g);
  }
  function wireTracks(root) {
    [].forEach.call(root.querySelectorAll('.fc-track'), function (t) {
      var wrap = t.parentNode, bp = $('.fc-nav-p', wrap), bn = $('.fc-nav-n', wrap);
      function upd() { var max = t.scrollWidth - t.clientWidth, pos = Math.abs(t.scrollLeft); bp.hidden = !(max > 4 && pos > 4); bn.hidden = !(max > 4 && pos < max - 4); }
      t.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd(); setTimeout(upd, 400);
      wrap.addEventListener('click', function (e) { var b = e.target.closest('[data-nav]'); if (b) t.scrollBy({ left: Number(b.getAttribute('data-nav')) * t.clientWidth * 0.85, behavior: reduce ? 'auto' : 'smooth' }); });
      var d = null, moved = false;
      t.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.button !== 0) return; d = { x: e.clientX, s: t.scrollLeft }; moved = false; });
      window.addEventListener('pointermove', function (e) { if (!d) return; var dx = e.clientX - d.x; if (Math.abs(dx) > 6) { moved = true; t.classList.add('is-drag'); } if (moved) t.scrollLeft = d.s - dx; });
      window.addEventListener('pointerup', function () { if (!d) return; d = null; t.classList.remove('is-drag'); });
      t.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    });
  }
  function paintGrid() {
    var all = filtered(), g = $('#fc-grid'), pg = $('#fc-more'), cnt = $('#fc-count'), slot = $('#fc-cta-slot'); if (!g) return;
    if (slot) slot.innerHTML = '';
    if (st.cat === 'الكل' && !st.q) { paintRows(g, pg, cnt); return; }
    g.removeAttribute('data-mode'); g.className = 'fc-list';
    var items = all;
    if (!all.length) {
      g.innerHTML = '<div class="fc-msg"><p>' + (st.q ? 'لا توجد نتائج مطابقة لـ «' + esc(st.q) + '». جرّب كلمة أخرى أو امسح البحث.' : 'لا يوجد محتوى في هذا التصنيف حاليًا. استكشف التصنيفات الأخرى أو عد لاحقًا.') + '</p>' +
        '<button type="button" class="fc-ghost" data-fc-reset><span>عرض كل المحتوى</span></button></div>';
      pg.innerHTML = ''; cnt.textContent = 'لا توجد نتائج'; return;
    }
    var pages = Math.max(1, Math.ceil(items.length / PAGE)); if (st.page > pages) st.page = pages;
    g.innerHTML = items.slice((st.page - 1) * PAGE, st.page * PAGE).map(function (a, i) { return card(a, i); }).join('');
    cnt.textContent = (groupOf(st.cat) ? st.cat + ' · ' : '') + countText(all.length);
    pg.innerHTML = pagerHTML(pages);
    if (slot && !st.q) {
      var ks = ROW_CTA[st.cat] || [CAT_CTA[st.cat]];
      var out = ks.filter(Boolean).map(function (k) { return ctaCard(k, 'row'); }).join('');
      if (out) slot.innerHTML = '<div class="fc-cta-row">' + out + '</div>';
    }
  }
  function bindTools() {
    var f = $('#fc-filters'), q = $('#fc-q'), t;
    f.addEventListener('click', function (e) {
      var b = e.target.closest('.fc-chip'); if (!b || f._moved) return;
      st.cat = b.getAttribute('data-cat'); st.page = 1; save();
      [].forEach.call(f.children, function (c) { c.setAttribute('aria-pressed', c === b); });
      var g = $('#fc-grid'); g.classList.add('is-loading'); setTimeout(function () { g.classList.remove('is-loading'); paintGrid(); showPickFor(); }, reduce ? 0 : 140);
    });
    f.addEventListener('keydown', function (e) {
      var k = e.key, c = [].slice.call(f.children), i = c.indexOf(document.activeElement); if (i < 0) return;
      var n = k === 'ArrowLeft' ? i + 1 : k === 'ArrowRight' ? i - 1 : k === 'Home' ? 0 : k === 'End' ? c.length - 1 : -1;
      if (n >= 0 && c[n]) { e.preventDefault(); c[n].focus(); }
    });
    var d = null;
    f.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; d = { x: e.clientX, s: f.scrollLeft }; f._moved = false; });
    window.addEventListener('pointermove', function (e) { if (!d) return; var dx = e.clientX - d.x; if (Math.abs(dx) > 5) { f._moved = true; f.classList.add('is-drag'); } if (f._moved) f.scrollLeft = d.s - dx; });
    window.addEventListener('pointerup', function () { if (!d) return; d = null; f.classList.remove('is-drag'); setTimeout(function () { f._moved = false; }, 0); });
    q.addEventListener('input', function () {
      var v = q.value; $('[data-fc-clear]').hidden = !v; clearTimeout(t);
      t = setTimeout(function () { st.q = v; st.page = 1; save(); paintGrid(); showPickFor(); }, 220);
    });
  }
  function showPickFor() { var p = $('.fc-pick'), want = st.cat === 'الكل' && !st.q; if (p) p.hidden = !want; else if (want) render(); paintGrid(); }
  function save() { try { sessionStorage.setItem('aq-fc-state', JSON.stringify({ c: st.cat, q: st.q })); } catch (e) { } }
  (function restore() { try { var s = JSON.parse(sessionStorage.getItem('aq-fc-state') || 'null'); if (s) { st.cat = (CATS.indexOf(s.c) > -1 || groupOf(s.c)) ? s.c : 'الكل'; st.q = s.q || ''; } } catch (e) { } })();


  /* ---------- نافذة القراءة المنبثقة (نص فقط، تمرير عمودي، زر إغلاق) ---------- */
  function popClose() {
    var el = document.getElementById('fc-pop'); if (!el) return;
    document.documentElement.style.overflow = ''; el.classList.remove('is-open');
    setTimeout(function () { if (el.parentNode) el.remove(); }, reduce ? 0 : 240);
  }
  function popOpen(slug) {
    var a = bySlug(slug); if (!a) { location.hash = '#featured-content/' + slug; return; }
    var old = document.getElementById('fc-pop'); if (old) old.remove();
    var el = document.createElement('div'); el.id = 'fc-pop'; el.className = 'fc-pop'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'fc-pop-t'); el.setAttribute('dir', 'rtl');
    el.innerHTML = '<div class="fc-pop-top"><button type="button" class="fc-pop-x" data-fc-pop-x aria-label="إغلاق">' + ICO.x + '</button><div class="fc-pop-hd"><small>' + esc(a.category) + ' · ' + esc(a.readingTime) + ' دقائق قراءة</small><h3 id="fc-pop-t">' + esc(a.title) + '</h3></div></div>' +
      '<div class="fc-pop-scroll" tabindex="0"><div class="fc-pop-col"><p class="fc-pop-lead">' + esc(a.excerpt) + '</p><div class="fc-body">' + body(a) + '</div>' +
      '<div class="fc-pop-end"><a class="fc-pop-full" href="#featured-content/' + esc(a.slug) + '">فتح في صفحة كاملة</a><button type="button" class="fc-pop-close" data-fc-pop-x>إغلاق</button></div></div></div>';
    document.body.appendChild(el); document.documentElement.style.overflow = 'hidden';
    void el.offsetWidth; el.classList.add('is-open');
    var x = el.querySelector('.fc-pop-x'); if (x) x.focus({ preventScroll: true });
    el.addEventListener('click', function (e) { if (e.target.closest('[data-fc-pop-x]') || e.target.closest('a[href^="#"]')) popClose(); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.getElementById('fc-pop')) { e.stopPropagation(); popClose(); } }, true);
  window.addEventListener('hashchange', popClose);

  list.addEventListener('click', function (e) {
    var cd = e.target.closest('.fc-mini,.fc-card,.fc-pick');
    if (cd && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.target.closest('button,[data-pg],.fc-cta')) { var sl = cd.getAttribute('data-slug'); if (sl) { e.preventDefault(); popOpen(sl); return; } }
    if (e.target.closest('[data-fc-retry]')) { load(); return; }
    var pgb = e.target.closest('[data-pg]'); if (pgb && !pgb.disabled) { st.page = Number(pgb.getAttribute('data-pg')); paintGrid(); var gg = $('#fc-latest') || $('#fc-grid'); if (gg) gg.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); return; }
    if (e.target.closest('[data-fc-reset]') || e.target.closest('[data-fc-clear]')) { st.q = ''; st.cat = e.target.closest('[data-fc-reset]') ? 'الكل' : st.cat; st.page = 1; save(); render(); window.scrollTo(0, 0); list.scrollTop = 0; return; }
    var gb = e.target.closest('[data-fc-group]'); if (gb) { st.cat = gb.getAttribute('data-fc-group'); st.page = 1; st.q = ''; save(); render(); window.scrollTo(0, 0); list.scrollTop = 0; return; }
    var a = e.target.closest('a[href^="#featured-content/"]'); if (a) internal++;
  });

  /* ---------- صفحة القراءة ---------- */
  function related(a) {
    var out = [], seen = { }; seen[a.slug] = 1;
    function add(x) { if (x && !seen[x.slug] && out.length < 3) { seen[x.slug] = 1; out.push(x); } }
    (DATA || []).filter(function (x) { return x.category === a.category; }).forEach(add);
    (a.related || []).forEach(function (s) { add(bySlug(s)); });
    (DATA || []).forEach(add);
    return out;
  }
  function body(a) {
    var rel = related(a)[0], h2n = 0, did = false;
    return (a.body || []).map(function (b) {
      if (b.t === 'h2') { h2n++; var pre = ''; if (h2n === 2 && rel && !did) { did = true; pre = '<aside class="fc-inline" data-content-type="article"><small>اقرأ أيضًا</small><a href="#featured-content/' + esc(rel.slug) + '">' + esc(rel.title) + '</a></aside>'; } return pre + '<h2>' + esc(b.x) + '</h2>'; }
      if (b.t === 'quote') return '<blockquote>' + esc(b.x) + '</blockquote>';
      if (b.t === 'ul') return '<ul>' + b.x.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>';
      if (b.t === 'cta') return '';
      return '<p>' + esc(b.x) + '</p>';
    }).join('');
  }
  function savedKey(uid) { return 'aqh-saved:' + (uid || 'guest'); }
  function getUser() {
    return new Promise(function (res) {
      try { var s = window.aqeeqSupabase; if (!s || !s.auth) return res(null); s.auth.getSession().then(function (r) { res(r && r.data && r.data.session ? r.data.session.user : null); }, function () { res(null); }); } catch (e) { res(null); }
    });
  }
  function getSaved(uid) { try { return JSON.parse(localStorage.getItem(savedKey(uid)) || '[]'); } catch (e) { return []; } }

  function showReader(slug) {
    var a = bySlug(slug), host = $('#fc-reader-body');
    reader.classList.add('fc-open'); reader.scrollTop = 0;
    if (!a) {
      host.innerHTML = '<div class="fc-art"><div class="fc-msg"><p>هذا المحتوى غير متاح حاليًا.</p><a class="fc-btn" href="#featured-content"><span>رجوع إلى المحتوى المميز</span>' + ARROW + '</a></div></div>';
      document.title = 'محتوى غير متاح | AQEQ ASTRO'; return;
    }
    document.title = a.title + ' | AQEQ ASTRO';
    var rel = related(a);
    host.innerHTML =
      '<ol class="fc-crumb" aria-label="مسار التنقل" style="width:min(720px,100% - 40px);margin-inline:auto;margin-bottom:28px"><li><a href="#home">الرئيسية</a></li><li><a href="#featured-content">محتوى مميز</a></li><li aria-current="page">' + esc(a.category) + '</li></ol>' +
      '<article class="fc-art" data-content-id="' + esc(a.id) + '" data-content-type="article" data-slug="' + esc(a.slug) + '" data-category="' + esc(a.category) + '">' +
      '<header class="fc-art-hd">'+ topic(a) +'<div class="fc-meta">' + meta(a) + '</div><h1 id="fc-art-title" tabindex="-1">' + esc(a.title) + '</h1><p class="fc-intro">' + esc(a.excerpt) + '</p></header></article>' +
      '<div class="fc-hero-img"><img src="' + esc(a.coverImage) + '" alt="' + esc(a.coverAlt) + '" decoding="async"></div>' +
      '<div class="fc-art"><div class="fc-body">' + body(a) + '</div>' +
      '<div class="fc-actions"><button type="button" class="fc-ghost" data-fc-back aria-label="' + (backTarget() ? backTarget()[1] : 'رجوع إلى المحتوى المميز') + '">' + ARROW + '<span>' + (backTarget() ? backTarget()[1] : 'رجوع إلى المحتوى المميز') + '</span></button>' +
      '<button type="button" class="fc-ghost" data-fc-save aria-pressed="false" aria-label="حفظ المقال">' + ICO.save + '<span>حفظ المقال</span></button>' +
      '<span class="fc-share"><button type="button" class="fc-ghost" data-fc-share aria-haspopup="menu" aria-expanded="false" aria-label="مشاركة المقال">' + ICO.share + '<span>مشاركة المقال</span></button>' +
      '<div class="fc-menu" role="menu" hidden><button type="button" role="menuitem" data-fc-copy>نسخ الرابط</button>' +
      '<a role="menuitem" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(a.title + ' ' + url(a.slug)) + '">واتساب</a>' +
      '<a role="menuitem" target="_blank" rel="noopener" href="https://t.me/share/url?url=' + encodeURIComponent(url(a.slug)) + '&text=' + encodeURIComponent(a.title) + '">تيليجرام</a>' +
      '<a role="menuitem" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?url=' + encodeURIComponent(url(a.slug)) + '&text=' + encodeURIComponent(a.title) + '">إكس</a></div></span>' +
      '<span class="fc-saved" role="status"></span></div></div>' +
      '<div class="fc-art fc-art-cta">' + ctaCard(CAT_CTA[a.category] || 'chart', 'article') + '</div>' +
      '<section class="fc-related" aria-labelledby="fc-rel-t"><h2 id="fc-rel-t">محتوى ذو صلة</h2><div class="fc-grid">' + rel.map(function (x, i) { return card(x, i, true); }).join('') + '</div></section>' +
      '<div class="fc-back-cta"><a class="fc-btn" href="' + (backTarget() ? backTarget()[0] : '#featured-content') + '"><span>' + (backTarget() ? backTarget()[1] : 'العودة إلى المحتوى المميز') + '</span>' + ARROW + '</a>' + (fromKey ? '' : '') + '</div>';
    var sv = $('[data-fc-save]', host), msg = $('.fc-saved', host);
    getUser().then(function (u) { var on = getSaved(u && u.id).indexOf(slug) > -1; sv.setAttribute('aria-pressed', on); $('span', sv).textContent = on ? 'محفوظ' : 'حفظ المقال'; sv._u = u; });
    sv.addEventListener('click', function () {
      getUser().then(function (u) {
        if (!u) { msg.innerHTML = 'سجّل الدخول لحفظ المقال. <a href="#account">تسجيل الدخول</a>'; return; }
        var l = getSaved(u.id), k = l.indexOf(slug), on = k === -1; if (on) l.push(slug); else l.splice(k, 1);
        try { localStorage.setItem(savedKey(u.id), JSON.stringify(l)); } catch (e) { }
        sv.setAttribute('aria-pressed', on); $('span', sv).textContent = on ? 'محفوظ' : 'حفظ المقال'; msg.textContent = on ? 'تم الحفظ' : '';
      });
    });
    var sh = $('[data-fc-share]', host), menu = $('.fc-menu', host);
    sh.addEventListener('click', function () {
      if (navigator.share && matchMedia('(hover: none)').matches) { navigator.share({ title: a.title, url: url(slug) }).catch(function () { }); return; }
      var o = menu.hidden; menu.hidden = !o; sh.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    $('[data-fc-copy]', host).addEventListener('click', function () {
      var done = function () { menu.hidden = true; sh.setAttribute('aria-expanded', 'false'); toast('تم نسخ الرابط'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url(slug)).then(done, done);
      else { var t = document.createElement('textarea'); t.value = url(slug); document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) { } t.remove(); done(); }
    });
    $('[data-fc-back]', host).addEventListener('click', goBack);
    var h1 = $('#fc-art-title', host); if (h1) h1.focus({ preventScroll: true });
  }
  var FROM = {
    chart: ['#chart', 'العودة إلى الخريطة الفلكية'], lifepath: ['#lifepath', 'العودة إلى مسار الحياة'],
    matrix: ['#matrix', 'العودة إلى مصفوفة القدر'], sky: ['#sky', 'العودة إلى السماء'],
    featured: ['#featured-content', 'العودة إلى المحتوى المميز'], home: ['#home', 'العودة إلى الرئيسية']
  };
  function backTarget() { return FROM[fromKey] || null; }
  function goBack() { var t = backTarget(); if (t) { fromKey = ''; location.hash = t[0]; return; } if (internal > 0) { internal--; history.back(); } else location.hash = '#featured-content'; }
  reader.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#featured-content/"]'); if (a) internal++;
    if (!e.target.closest('.fc-share')) { var m = $('.fc-menu', reader); if (m && !m.hidden) { m.hidden = true; var b = $('[data-fc-share]', reader); if (b) b.setAttribute('aria-expanded', 'false'); } }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && reader.classList.contains('fc-open')) { var m = $('.fc-menu', reader); if (m && !m.hidden) { m.hidden = true; return; } goBack(); } });

  /* ---------- التوجيه ---------- */
  function route() {
    var h = decodeURIComponent(location.hash || ''), m;
    if ((m = /^#article-([\w-]+)$/.exec(h))) { location.replace('#featured-content/' + m[1]); return; }
    if ((m = /^#featured-content\/([\w-]+)(?:\?from=([\w-]+))?$/.exec(h))) {
      list.classList.add('fc-open'); fromKey = m[2] || '';
      if (loadState === 'ready') showReader(m[1]); else { reader.classList.add('fc-open'); }
      return;
    }
    reader.classList.remove('fc-open');
    var on = h === '#featured-content';
    list.classList.toggle('fc-open', on);
    if (on) { document.title = 'محتوى مميز | AQEQ ASTRO'; }
  }
  window.addEventListener('hashchange', route);
  render(); route(); load();
})();

;
/* assets/js/content-links.js */
/* ربط الكيانات الفلكية بالمقالات. قراءة فقط: لا حسابات فلكية هنا.
   window.AqeeqContentLinks.find('retrograde-mercury') -> { slug, href, label, kind:'exact'|'general' } | null
   الأولوية: تطابق entityKey -> كوكب + نوع الحدث -> دليل عام (بصياغة صريحة) -> null */
(function () {
  'use strict';
  var DATA = null, waiting = [];
  function parse(k) {
    var p = String(k || '').split('-');
    return { type: p[0], planet: p[1] || '', raw: String(k || '') };
  }
  function articleOk(slug) {
    var fc = window.FeaturedContent; if (!fc || typeof fc.get !== 'function') return true;
    var all = fc.all ? fc.all() : null; if (!all || !all.length) return true; /* لم يُحمَّل بعد: لا نحجب */
    return !!fc.get(slug);
  }
  function make(e, kind) { return { slug: e.slug, href: '#featured-content/' + e.slug, label: e.label, kind: kind }; }
  function find(entityKey) {
    if (!DATA || !entityKey) return null;
    var k = parse(entityKey), i, e;
    for (i = 0; i < DATA.entries.length; i++) { e = DATA.entries[i]; if (e.entityKey === k.raw && articleOk(e.slug)) return make(e, 'exact'); }
    for (i = 0; i < DATA.entries.length; i++) { e = DATA.entries[i]; if (e.entityType === k.type && (!e.planet || e.planet === k.planet) && e.entityType === 'moon-phase' && articleOk(e.slug)) return make(e, 'exact'); }
    var t = k.type === 'moon' ? 'moon-phase' : k.type;
    for (i = 0; i < DATA.general.length; i++) { e = DATA.general[i]; if (e.entityType === t && articleOk(e.slug)) return make(e, 'general'); }
    return null;
  }
  /* يضيف ?from= لمصدر العودة */
  function hrefFrom(link, from) { return link ? link.href + (from ? '?from=' + encodeURIComponent(from) : '') : ''; }
  window.AqeeqContentLinks = { find: find, hrefFrom: hrefFrom, ready: function (cb) { if (DATA) cb(); else waiting.push(cb); } };
  fetch('assets/data/content-links.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
    if (!j) return; DATA = j; waiting.splice(0).forEach(function (f) { try { f(); } catch (e) { } });
    window.dispatchEvent(new Event('aqeeq:content-links-ready'));
  }).catch(function () { });
})();

;
/* assets/js/natal-view.js */
/* طبقة عرض لصفحة الخريطة الفلكية: لا تحسب شيئًا ولا تغيّر المحرك.
   تقرأ DOM الناتج وحالة AqeeqChartContext فقط، وتضيف التنقل والملخص والروابط. */
(function () {
  'use strict';
  var root = document.getElementById('result'); if (!root) return;
  var PL = { sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ', jupiter: 'المشتري', saturn: 'زحل' };
  var lastOpener = null, lastPlanet = '';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function crumb() {
    var bar = root.querySelector('.result-top-bar'); if (!bar || bar.querySelector('.nv-crumb')) return;
    bar.innerHTML = '<nav aria-label="مسار التنقل"><ol class="nv-crumb"><li><a href="#home">الرئيسية</a></li><li><a href="#aqh-tools">اكتشف ذاتك</a></li><li aria-current="page">الخريطة الفلكية</li></ol></nav>';
  }

  function birth(S) {
    var card = root.querySelector('.chart-summary-card'); if (!card || root.querySelector('.nv-birth')) return;
    var ctx = (window.AqeeqChartContext && window.AqeeqChartContext.getNatal && window.AqeeqChartContext.getNatal()) || S || {};
    var rows = [];
    var pad = function (n) { return String(n).padStart(2, '0'); };
    if (ctx.y && ctx.m && ctx.d) rows.push(['تاريخ الميلاد', pad(ctx.d) + '/' + pad(ctx.m) + '/' + ctx.y]);
    if (ctx.known) rows.push(['وقت الميلاد', pad(ctx.hh) + ':' + pad(ctx.mm)]); else rows.push(['وقت الميلاد', 'غير معروف']);
    if (ctx.placeName) rows.push(['مكان الميلاد', ctx.placeName]);
    var note = ctx.known ? '' : '<p class="nv-warn">وقت الميلاد غير معروف، لذلك لا يمكن تحديد الطالع ولا البيوت بدقة. المواضع بالأبراج تبقى صحيحة تقريبًا.</p>';
    var d = document.createElement('details'); d.className = 'nv-birth';
    d.innerHTML = '<summary><span>بيانات الميلاد المستخدمة</span></summary><dl>' + rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>' + note +
      '<button type="button" class="nv-edit" data-nv-edit>تعديل بيانات الميلاد</button>';
    card.insertAdjacentElement('afterend', d);
    d.querySelector('[data-nv-edit]').addEventListener('click', function () { var b = document.getElementById('btn-edit-chart'); if (b) b.click(); });
  }


  /* الشاكرات: تقابل تقليدي رمزي (مدرسة واحدة من عدة مدارس). لا نسب ولا درجات؛ نعرض ما تحمله الخريطة فقط. */
  var SN = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var CH = [
    { n: 'الجذر', s: 'Muladhara', pet: 4, signs: [9, 10], pl: ['saturn'] },
    { n: 'العجز', s: 'Svadhisthana', pet: 6, signs: [8, 11], pl: ['jupiter'] },
    { n: 'الضفيرة الشمسية', s: 'Manipura', pet: 10, signs: [0, 7], pl: ['mars'] },
    { n: 'القلب', s: 'Anahata', pet: 12, signs: [1, 6], pl: ['venus'] },
    { n: 'الحلق', s: 'Vishuddha', pet: 16, signs: [2, 5], pl: ['mercury'] },
    { n: 'العين الثالثة', s: 'Ajna', pet: 2, signs: [3, 4], pl: ['sun', 'moon'] },
    { n: 'التاج', s: 'Sahasrara', pet: 12, signs: [], pl: [] }
  ];
  function petals(n) {
    var o = '<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="9" fill="none" stroke="currentColor" stroke-width="1.4"/>';
    for (var i = 0; i < n; i++) { var a = 360 / n * i; o += '<ellipse cx="30" cy="12" rx="3" ry="7" transform="rotate(' + a + ' 30 30)" fill="none" stroke="currentColor" stroke-width=".9" opacity=".7"/>'; }
    return o + '</svg>';
  }
  function chakras(S) {
    if (root.querySelector('.nv-chakra')) return;
    var ctx = (window.AqeeqChartContext && window.AqeeqChartContext.getNatal && window.AqeeqChartContext.getNatal()) || S || {};
    var bodies = (ctx.ch && ctx.ch.bodies) || []; if (!bodies.length) return;
    var by = {}; bodies.forEach(function (b) { by[b.key] = b; });
    var personal = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
    var cards = CH.map(function (c) {
      var rows = '';
      c.pl.forEach(function (k) { var b = by[k]; if (b) rows += '<li><small>كوكب المركز</small><b>' + PL[k] + ' في ' + SN[b.sign] + (b.retro ? ' (متراجع)' : '') + '</b></li>'; });
      var inSigns = personal.filter(function (k) { return by[k] && c.signs.indexOf(by[k].sign) > -1 && c.pl.indexOf(k) < 0; }).map(function (k) { return PL[k]; });
      if (c.signs.length) rows += '<li><small>أبراج المركز: ' + c.signs.map(function (i) { return SN[i]; }).join(' و') + '</small><b>' + (inSigns.length ? 'فيها: ' + inSigns.join('، ') : 'لا كواكب شخصية أخرى فيها') + '</b></li>';
      else rows += '<li><small>لا يرتبط عادة ببرج أو كوكب محدد</small><b>مركز تأملي</b></li>';
      return '<li class="nv-ch"><span class="nv-ch-ic">' + petals(c.pet) + '</span><div><h4>' + c.n + '</h4><ul>' + rows + '</ul></div></li>';
    }).join('');
    var L = window.AqeeqContentLinks, l = L && L.find('chakra-planets');
    var h = '<section class="nv-chakra" aria-labelledby="nv-ch-h"><h3 id="nv-ch-h">الشاكرات والكواكب في خريطتك</h3>' +
      '<p class="nv-ch-note">تقابل رمزي من إحدى مدارس الفلك الباطني، وتختلف فيه المدارس. لا نعرض نسبًا أو تقييمًا، فقط ما تحمله خريطتك في كل مركز.</p>' +
      '<ul class="nv-ch-grid">' + cards + '</ul>' + (l ? '<a class="nv-ch-more" href="' + L.hrefFrom(l, 'chart') + '">' + esc(l.label) + '</a>' : '') + '</section>';
    root.insertAdjacentHTML('beforeend', h);
  }

  function related(S) {
    var L = window.AqeeqContentLinks; if (!L || root.querySelector('.nv-related')) return;
    var ctx = (window.AqeeqChartContext && window.AqeeqChartContext.getNatal && window.AqeeqChartContext.getNatal()) || S || {};
    var bodies = (ctx.ch && ctx.ch.bodies) || [], seen = {}, items = [];
    function add(key, text) { var l = L.find(key); if (!l || seen[l.slug + l.kind]) return; seen[l.slug + l.kind] = 1; items.push({ l: l, text: text }); }
    ['sun', 'moon', 'venus', 'mars'].forEach(function (k) { add('planet-' + k, PL[k]); });
    bodies.forEach(function (b) { if (b.retro && PL[b.key] && b.key !== 'sun' && b.key !== 'moon') add('retrograde-' + b.key, PL[b.key] + ' متراجع في خريطتك'); });
    var h = '<section class="nv-related" aria-labelledby="nv-rel-h"><h3 id="nv-rel-h">اقرأ أكثر عن مواضعك</h3>';
    if (items.length) {
      h += '<ul>' + items.map(function (x) { return '<li><a href="' + L.hrefFrom(x.l, 'chart') + '"><b>' + esc(x.l.label) + '</b><small>' + (x.l.kind === 'exact' ? 'مقال عن ' + esc(x.text) : 'دليل عام') + '</small></a></li>'; }).join('') + '</ul>';
    }
    h += '<a class="nv-sky" href="#sky"><span>استكشف السماء الآن</span></a></section>';
    root.insertAdjacentHTML('beforeend', h);
  }

  /* لوحة التفاصيل كلوحة جانبية / ورقة سفلية */
  function sheet() {
    var p = document.getElementById('wd-panel'); if (!p || p._nv) return; p._nv = true;
    var ov = document.createElement('div'); ov.className = 'nv-ov'; ov.hidden = true; p.parentNode.insertBefore(ov, p);
    function open() {
      if (p.parentNode !== document.body) { document.body.appendChild(p); document.body.appendChild(ov); }
      p.classList.add('nv-sheet'); ov.hidden = false; document.documentElement.classList.add('nv-lock');
      if (!p.querySelector('.nv-x')) { var x = document.createElement('button'); x.type = 'button'; x.className = 'nv-x'; x.setAttribute('aria-label', 'إغلاق التفاصيل'); x.innerHTML = '&times;'; p.insertBefore(x, p.firstChild); x.addEventListener('click', close); }
      p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'تفاصيل الخريطة');
      addLink(p);
      var x2 = p.querySelector('.nv-x'); if (x2) x2.focus({ preventScroll: true });
    }
    function close() {
      p.hidden = true; p.classList.remove('nv-sheet'); ov.hidden = true; document.documentElement.classList.remove('nv-lock');
      if (lastOpener && document.contains(lastOpener)) lastOpener.focus({ preventScroll: true });
    }
    ov.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && p.classList.contains('nv-sheet') && !p.hidden) close(); });
    new MutationObserver(function () { if (!p.hidden) { if (!p.querySelector('.nv-x') || !p.classList.contains('nv-sheet')) open(); else addLink(p); } else { ov.hidden = true; p.classList.remove('nv-sheet'); document.documentElement.classList.remove('nv-lock'); } }).observe(p, { attributes: true, attributeFilter: ['hidden'], childList: true });
  }
  function addLink(p) {
    var L = window.AqeeqContentLinks; if (!L || !lastPlanet || p.querySelector('.nv-pl-link')) return;
    var ctx = window.AqeeqChartContext && window.AqeeqChartContext.getNatal && window.AqeeqChartContext.getNatal();
    var b = ctx && ctx.ch && ctx.ch.bodies.filter(function (x) { return x.key === lastPlanet; })[0];
    var l = b && b.retro ? L.find('retrograde-' + lastPlanet) : null; if (!l) l = L.find('planet-' + lastPlanet);
    if (!l) return;
    var a = document.createElement('a'); a.className = 'nv-pl-link'; a.href = L.hrefFrom(l, 'chart'); a.textContent = l.kind === 'exact' ? l.label : l.label;
    p.appendChild(a);
  }
  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-kind]'); if (!t) return; lastOpener = t;
    if (t.dataset.kind === 'planet') lastPlanet = t.dataset.k || lastPlanet;
    var p = document.getElementById('wd-panel'); if (p) { var old = p.querySelector('.nv-pl-link'); if (old) old.remove(); setTimeout(function () { if (!p.hidden) addLink(p); }, 0); }
  }, true);

  function apply(S) { try { document.querySelectorAll('body > #wd-panel, body > .nv-ov').forEach(function (n) { n.remove(); }); document.documentElement.classList.remove('nv-lock'); crumb(); birth(S); chakras(S); related(S); sheet(); } catch (e) { if (window.console) console.warn('natal-view', e); } }
  window.addEventListener('aqeeq:chart-rendered', function (e) { setTimeout(function () { apply(e.detail); }, 0); });
  if (root.querySelector('.wheel-wrap')) apply(null);
})();

;
/* assets/js/natal-dashboard.js */
/* لوحة نتيجة الخريطة الفلكية: طبقة عرض فقط. تقرأ ناتج المحرك (AqeeqChartContext) ولا تغيّر أي حساب.
   كل الأرقام (النسب، قوة الجوانب، المواضع) تُشتق من الخريطة الحالية وتتغير مع كل تاريخ ميلاد. */
(function () {
  'use strict';
  var root = document.getElementById('result'); if (!root) return;
  var SG = [
    ['الحمل', '♈', 0, 0, ['جريء', 'مبادر', 'حماسي']], ['الثور', '♉', 1, 1, ['ثابت', 'حسّي', 'صبور']],
    ['الجوزاء', '♊', 2, 2, ['فضولي', 'متنقل', 'اجتماعي']], ['السرطان', '♋', 3, 0, ['حساس', 'حدسي', 'حمائي']],
    ['الأسد', '♌', 0, 1, ['واثق', 'كريم', 'قيادي']], ['العذراء', '♍', 1, 2, ['دقيق', 'تحليلي', 'خدوم']],
    ['الميزان', '♎', 2, 0, ['متوازن', 'لطيف', 'دبلوماسي']], ['العقرب', '♏', 3, 1, ['عميق', 'مكثف', 'غامض']],
    ['القوس', '♐', 0, 2, ['متفائل', 'حر', 'مغامر']], ['الجدي', '♑', 1, 0, ['جاد', 'منضبط', 'طموح']],
    ['الدلو', '♒', 2, 1, ['مستقل', 'مبتكر', 'إنساني']], ['الحوت', '♓', 3, 2, ['حالم', 'متعاطف', 'خيالي']]
  ];
  var PL = [['sun', 'الشمس', '☉', 3], ['moon', 'القمر', '☽', 3], ['mercury', 'عطارد', '☿', 2], ['venus', 'الزهرة', '♀', 2], ['mars', 'المريخ', '♂', 2],
    ['jupiter', 'المشتري', '♃', 1.5], ['saturn', 'زحل', '♄', 1.5], ['uranus', 'أورانوس', '♅', 1], ['neptune', 'نبتون', '♆', 1], ['pluto', 'بلوتو', '♇', 1]];
  var ELN = ['النار', 'التراب', 'الهواء', 'الماء'], ELC = ['#8a2f3f', '#b08d57', '#a9a6a8', '#3b4a96'];
  var ELP = ['الحماس والمبادرة', 'الواقعية والثبات', 'الفكر والتواصل', 'الشعور والحدس'];
  var MDN = ['الأساسي', 'الثابت', 'المتغير'], MDP = ['البدء والتحريك', 'الاستمرار والتثبيت', 'التكيف والمرونة'];
  var HA = ['الذات والمظهر', 'المال والقيم', 'التواصل والتعلم', 'البيت والجذور', 'الإبداع والحب', 'العمل اليومي والصحة', 'الشراكات والعلاقات', 'التحول والمشتركات', 'السفر والمعرفة', 'المهنة والمكانة', 'الصداقات والأحلام', 'الباطن والخلوة'];
  var ASP = [{ k: 'conj', n: 'اتصال', ang: 0, orb: 8, t: 'n', w: 1 }, { k: 'sext', n: 'سداسي', ang: 60, orb: 4, t: 'h', w: .75 }, { k: 'sq', n: 'تربيع', ang: 90, orb: 6, t: 't', w: .9 },
    { k: 'tri', n: 'تثليث', ang: 120, orb: 6, t: 'h', w: .9 }, { k: 'opp', n: 'مقابلة', ang: 180, orb: 8, t: 't', w: .95 }];
  var ASPCOL = { h: '#3f55a5', t: '#d04b4b', n: '#9b9296' };
  var NS = 'http://www.w3.org/2000/svg';
  var state = { tab: 'map' };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function n2(n) { return String(n).padStart(2, '0'); }
  function norm(x) { x = x % 360; return x < 0 ? x + 360 : x; }
  function d180(x) { x = norm(x); return x > 180 ? 360 - x : x; }
  function fmtLon(lon) { var s = Math.floor(norm(lon) / 30), r = norm(lon) - s * 30, d = Math.floor(r), m = Math.floor((r - d) * 60); return { s: s, d: d, m: m, txt: '<bdi dir="ltr">' + d + '°' + n2(m) + '′</bdi>' }; }
  function gl(g) { return g + '︎'; }

  function aspects(items) {
    var out = [];
    for (var i = 0; i < items.length; i++) for (var j = i + 1; j < items.length; j++) {
      var a = items[i], b = items[j], diff = d180(a.lon - b.lon);
      for (var t = 0; t < ASP.length; t++) {
        var A = ASP[t], lim = A.orb; if (a.k === 'sun' || a.k === 'moon' || b.k === 'sun' || b.k === 'moon') lim += 1;
        var o = Math.abs(diff - A.ang);
        if (o <= lim) {
          var pw = function (x) { return x.k === 'sun' || x.k === 'moon' ? 1 : (x.k === 'mercury' || x.k === 'venus' || x.k === 'mars') ? .9 : .75; };
          var sc = Math.max(1, Math.min(10, 10 * A.w * (1 - o / (lim + .001)) * ((pw(a) + pw(b)) / 2) + 1.2));
          out.push({ a: a, b: b, A: A, orb: o, score: Math.round(sc * 10) / 10 }); break;
        }
      }
    }
    return out;
  }

  function el(tag, attrs, html) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (html != null) e.textContent = html; return e; }

  /* عجلة الميلاد: حلقة أبراج فاتحة، الكواكب خارج الحلقة بسهم يشير إلى موضعها الدقيق، ودرجة كل كوكب بجانبه */
  var WELC = ['#9a2f43', '#8a5a3b', '#a0782a', '#3b4a96'];
  var WHEEL_CSS = '.nd-wheel{font-family:"Noto Sans Symbols","Noto Sans Symbols 2","Segoe UI Symbol","DejaVu Sans",sans-serif}' +
    '.nd-bgc{fill:#FFFDF9}.nd-seg{fill:#F7EFE1;stroke:none}.nd-seg-alt{fill:#EFE3CF}' +
    '.nd-c-out{fill:none;stroke:#70263F;stroke-width:1.6}.nd-c{fill:none;stroke:#B78A52;stroke-width:1}.nd-c-dash{stroke-dasharray:2 4;stroke:#CDB28A}' +
    '.nd-sg{font-size:25px;text-anchor:middle}.nd-sd{stroke:#CDB28A;stroke-width:1}.nd-tkm{stroke:#B78A52;stroke-width:.8;fill:none}' +
    '.nd-hl{stroke:#CDB28A;stroke-width:1}.nd-hl-ax{stroke:#70263F;stroke-width:1.8}' +
    '.nd-hn{fill:#7a6a70;font:600 14px "IBM Plex Sans Arabic",Arial,sans-serif;text-anchor:middle}' +
    '.nd-ax{fill:#35252B;font:700 16px "IBM Plex Sans Arabic",Arial,sans-serif}.nd-axa{fill:#70263F}' +
    '.nd-al{stroke-width:1.5;stroke-linecap:round}.nd-asp{opacity:.9}' +
    '.nd-pc{fill:#FFFFFF;stroke:#70263F;stroke-width:2}.nd-pg{fill:#70263F;font-size:27px;text-anchor:middle}' +
    '.nd-pd{fill:#4a3a42;font:700 14px "IBM Plex Sans Arabic",Arial,sans-serif;text-anchor:middle;paint-order:stroke;stroke:#FFFDF9;stroke-width:3px;stroke-linejoin:round}' +
    '.nd-rx{fill:#c23b3b;font:700 11px Arial,sans-serif}.nd-tk{stroke:#70263F;stroke-width:2.2;fill:none}.nd-tka{fill:#70263F}.nd-tkh{stroke:#FFFDF9;stroke-width:5.5;fill:none;stroke-linecap:round}.nd-tkhp{fill:#FFFDF9;stroke-linejoin:round}' +
    '.nd-pl{cursor:pointer;outline:0}.nd-pl:hover .nd-pc,.nd-pl:focus-visible .nd-pc,.nd-pl.on .nd-pc{fill:#F6E8CC;stroke:#70263F;stroke-width:2.2}';

  function wheelSVG(ch, planets, asps, known) {
    var C = 300, RO = 212, RS = 174, RH = 138, RP = 256, RD = 290;
    var asc = known ? ch.asc : 0;
    var ang = function (lon) { return (180 - (norm(lon) - asc)) * Math.PI / 180; };
    var pt = function (lon, r) { var a = ang(lon); return [C + r * Math.cos(a), C + r * Math.sin(a)]; };
    var f1 = function (n) { return n.toFixed(1); };
    var svg = el('svg', { viewBox: '-16 -12 632 624', class: 'nd-wheel', role: 'img', 'aria-label': 'عجلة الخريطة الفلكية', xmlns: NS });
    var st = document.createElementNS(NS, 'style'); st.textContent = WHEEL_CSS; svg.appendChild(st);
    var g0 = el('g', { class: 'nd-w-in' }); svg.appendChild(g0);
    g0.appendChild(el('circle', { cx: C, cy: C, r: RO, class: 'nd-bgc' }));
    // حلقة الأبراج
    var band = '', ticks = '', p = function (a, r) { return f1(C + r * Math.cos(a)) + ' ' + f1(C + r * Math.sin(a)); };
    for (var s = 0; s < 12; s++) {
      var a1 = ang(s * 30), a2 = ang(s * 30 + 30);
      band += '<path class="nd-seg' + (s % 2 ? ' nd-seg-alt' : '') + '" d="M' + p(a1, RO) + 'A' + RO + ' ' + RO + ' 0 0 0 ' + p(a2, RO) + 'L' + p(a2, RS) + 'A' + RS + ' ' + RS + ' 0 0 1 ' + p(a1, RS) + 'Z"/>';
      band += '<line class="nd-sd" x1="' + f1(C + RS * Math.cos(a1)) + '" y1="' + f1(C + RS * Math.sin(a1)) + '" x2="' + f1(C + RO * Math.cos(a1)) + '" y2="' + f1(C + RO * Math.sin(a1)) + '"/>';
    }
    for (var d = 0; d < 360; d += 5) { var ta = ang(d), tl = d % 10 === 0 ? 9 : 5; ticks += 'M' + p(ta, RS) + 'L' + p(ta, RS + tl); }
    var bg = document.createElementNS(NS, 'g'); bg.innerHTML = band + '<path class="nd-tkm" d="' + ticks + '"/>'; g0.appendChild(bg);
    for (var s2 = 0; s2 < 12; s2++) { var m = pt(s2 * 30 + 15, (RO + RS) / 2); g0.appendChild(el('text', { x: f1(m[0]), y: f1(m[1] + 8.5), class: 'nd-sg', fill: WELC[SG[s2][2]] }, gl(SG[s2][1]))); }
    g0.appendChild(el('circle', { cx: C, cy: C, r: RO, class: 'nd-c-out' })); g0.appendChild(el('circle', { cx: C, cy: C, r: RS, class: 'nd-c' }));
    g0.appendChild(el('circle', { cx: C, cy: C, r: RH, class: 'nd-c' })); g0.appendChild(el('circle', { cx: C, cy: C, r: RH - 22, class: 'nd-c nd-c-dash' }));
    // البيوت
    if (known && ch.cusps) {
      ch.cusps.forEach(function (c, i) {
        var a = pt(c, RS), b = pt(c, RH); g0.appendChild(el('line', { x1: f1(a[0]), y1: f1(a[1]), x2: f1(b[0]), y2: f1(b[1]), class: 'nd-hl' + (i % 3 === 0 ? ' nd-hl-ax' : '') }));
        var nx = ch.cusps[(i + 1) % 12], mid = norm(c) + norm(nx - c) / 2, q = pt(mid, (RS + RH) / 2);
        g0.appendChild(el('text', { x: f1(q[0]), y: f1(q[1] + 5), class: 'nd-hn' }, String(i + 1)));
      });
    } else {
      for (var h = 0; h < 12; h++) { var a = pt(h * 30, RS), b = pt(h * 30, RH); g0.appendChild(el('line', { x1: f1(a[0]), y1: f1(a[1]), x2: f1(b[0]), y2: f1(b[1]), class: 'nd-hl' })); }
    }
    // خطوط الجوانب
    var ag = el('g', { class: 'nd-asp' }); svg.appendChild(ag);
    asps.forEach(function (x, i) {
      var p1 = pt(x.a.lon, RH - 22), p2 = pt(x.b.lon, RH - 22);
      ag.appendChild(el('line', { x1: f1(p1[0]), y1: f1(p1[1]), x2: f1(p2[0]), y2: f1(p2[1]), stroke: ASPCOL[x.A.t], class: 'nd-al' }));
    });
    // الكواكب خارج الحلقة مع تباعد، وسهم صغير يشير إلى الموضع الدقيق
    var pos = planets.map(function (b) { return { b: b, lon: norm(b.lon), disp: norm(b.lon) }; }).sort(function (x, y) { return x.lon - y.lon; });
    var MIN = 13, axes = known ? [ch.asc, ch.asc + 180, ch.mc, ch.mc + 180].map(norm) : [];
    /* نفك التزاحم بدفع كل كوكب بعيدًا عن جاره (الفرق الموقّع بين الاثنين) مع ثبات الترتيب، ونبعدها عن المحاور */
    for (var it = 0; it < 200; it++) {
      var moved = false;
      for (var i = 0; i < pos.length; i++) {
        var nx = pos[(i + 1) % pos.length]; if (nx === pos[i]) continue;
        var dd = norm(nx.disp - pos[i].disp); if (dd > 180) dd -= 360;
        if (dd < MIN) { var push = (MIN - dd) / 2 + .01; pos[i].disp = norm(pos[i].disp - push); nx.disp = norm(nx.disp + push); moved = true; }
      }
      axes.forEach(function (A) { pos.forEach(function (o) { var df = ((o.disp - A + 540) % 360) - 180; if (Math.abs(df) < 10) { o.disp = norm(A + (df >= 0 ? 10 : -10)); moved = true; } }); });
      if (!moved) break;
    }
    var pg = el('g', { class: 'nd-pls' }); svg.appendChild(pg);
    var PR = 21;
    pos.forEach(function (o, i) {
      var q = pt(o.disp, RP), dp = pt(o.disp, RD), tip = pt(o.lon, RS - 10);
      var ex = q[0] - tip[0], ey = q[1] - tip[1], el2 = Math.hypot(ex, ey) || 1, ux = ex / el2, uy = ey / el2;   /* من الطرف نحو الكوكب */
      var st = [q[0] - ux * PR, q[1] - uy * PR];
      var hl = 15, hw = 6.5, bx = tip[0] + ux * hl, by = tip[1] + uy * hl;
      var tri = f1(tip[0]) + ',' + f1(tip[1]) + ' ' + f1(bx - uy * hw) + ',' + f1(by + ux * hw) + ' ' + f1(bx + uy * hw) + ',' + f1(by - ux * hw);
      var gp = el('g', { class: 'nd-pl', tabindex: '0', role: 'button', 'data-k': o.b.k, 'aria-label': o.b.n }); gp.style.setProperty('--i', i);
      gp.appendChild(el('line', { x1: f1(st[0]), y1: f1(st[1]), x2: f1(bx), y2: f1(by), class: 'nd-tkh' }));
      gp.appendChild(el('line', { x1: f1(st[0]), y1: f1(st[1]), x2: f1(bx), y2: f1(by), class: 'nd-tk' }));
      gp.appendChild(el('polygon', { points: tri, class: 'nd-tkh nd-tkhp' }));
      gp.appendChild(el('polygon', { points: tri, class: 'nd-tka' }));
      gp.appendChild(el('circle', { cx: f1(q[0]), cy: f1(q[1]), r: PR, class: 'nd-pc' }));
      gp.appendChild(el('text', { x: f1(q[0]), y: f1(q[1] + 9), class: 'nd-pg' }, gl(o.b.g)));
      if (o.b.retro) gp.appendChild(el('text', { x: f1(q[0] + 19), y: f1(q[1] - 12), class: 'nd-rx', 'text-anchor': 'middle' }, 'R'));
      gp.appendChild(el('text', { x: f1(dp[0]), y: f1(dp[1] + 5), class: 'nd-pd' }, Math.floor(norm(o.b.lon) % 30) + '°'));
      pg.appendChild(gp);
    });
    // المحاور: أسهم عند الحلقة وأسماؤها خارجها
    if (known) {
      [['ASC', ch.asc], ['DSC', ch.asc + 180], ['MC', ch.mc], ['IC', ch.mc + 180]].forEach(function (L) {
        var q = pt(L[1], RO), ar = ang(L[1]), ux = Math.cos(ar), uy = Math.sin(ar);
        var tri = f1(q[0] + ux * 13) + ',' + f1(q[1] + uy * 13) + ' ' + f1(q[0] - uy * 5) + ',' + f1(q[1] + ux * 5) + ' ' + f1(q[0] + uy * 5) + ',' + f1(q[1] - ux * 5);
        svg.appendChild(el('polygon', { points: tri, class: 'nd-axa' }));
        var lp = pt(L[1], RO + 36);
        svg.appendChild(el('text', { x: f1(lp[0]), y: f1(lp[1] + 5.5), class: 'nd-ax', 'text-anchor': 'middle' }, L[0]));
      });
    }
    return svg;
  }

  function elementPct(ch, known) {
    var w = [0, 0, 0, 0], md = [0, 0, 0], tot = 0;
    PL.forEach(function (p) { var b = bodyOf(ch, p[0]); if (!b) return; var s = Math.floor(norm(b.lon) / 30); w[SG[s][2]] += p[3]; md[SG[s][3]] += p[3]; tot += p[3]; });
    if (known) { var as = Math.floor(norm(ch.asc) / 30), ms = Math.floor(norm(ch.mc) / 30); w[SG[as][2]] += 3; md[SG[as][3]] += 3; w[SG[ms][2]] += 1; md[SG[ms][3]] += 1; tot += 4; }
    var raw = w.map(function (v) { return v / tot * 100; }), pct = raw.map(Math.floor), left = 100 - pct.reduce(function (a, b) { return a + b; }, 0);
    raw.map(function (v, i) { return [v - Math.floor(v), i]; }).sort(function (a, b) { return b[0] - a[0]; }).forEach(function (x) { if (left > 0) { pct[x[1]]++; left--; } });
    var mt = md.reduce(function (a, b) { return a + b; }, 0);
    return { el: pct, md: md.map(function (v) { return Math.round(v / mt * 100); }) };
  }
  function bodyOf(ch, k) { for (var i = 0; i < ch.bodies.length; i++) if (ch.bodies[i].key === k) return ch.bodies[i]; return null; }
  function arrow() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>'; }
  function ic(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }
  function aspIcon(k) { var m = { conj: '<circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3"/>', sext: '<path d="M12 3v18M4.500 7.500l15 9M19.500 7.500l-15 9"/>', sq: '<rect x="5" y="5" width="14" height="14"/>', tri: '<path d="M12 4 21 19H3z"/>', opp: '<circle cx="6.500" cy="12" r="3.500"/><circle cx="17.500" cy="12" r="3.500"/><path d="M10 12h4"/>' }; return ic(m[k]); }

  function countUp(node, to) {
    var t0 = performance.now(), dur = 900;
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) { node.textContent = to + '%'; return; }
    (function f(t) { var p = Math.min(1, (t - t0) / dur); node.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + '%'; if (p < 1) requestAnimationFrame(f); })(t0);
  }

  function build(S) {
    var ch = S.ch, known = !!ch.known && ch.cusps && ch.cusps.length === 12;
    var planets = PL.map(function (p) { var b = bodyOf(ch, p[0]); return b ? { k: p[0], n: p[1], g: p[2], lon: b.lon, retro: !!b.retro, house: b.house } : null; }).filter(Boolean);
    var items = planets.slice(); if (known) { items.push({ k: 'asc', n: 'الطالع', lon: ch.asc }, { k: 'mc', n: 'وسط السماء', lon: ch.mc }); }
    var asps = aspects(items);
    var sun = planets[0], moon = planets[1], pc = elementPct(ch, known);
    var sSign = Math.floor(norm(sun.lon) / 30), mSign = Math.floor(norm(moon.lon) / 30), aSign = known ? Math.floor(norm(ch.asc) / 30) : null;
    var hs = ch.hs === 'placidus' ? 'بلاسيدوس' : ch.hs === 'whole' || ch.hs === 'whole-fallback' ? 'البيوت الكاملة' : ch.hs === 'equal' ? 'البيوت المتساوية' : ch.hs === 'porphyry' ? 'بورفيري' : ch.hs;
    var domE = pc.el.indexOf(Math.max.apply(null, pc.el)), domM = pc.md.indexOf(Math.max.apply(null, pc.md));
    var lat = Number(S.lat), lon = Number(S.lon);
    var ns = lat >= 0 ? 'N' : 'S', ew = lon >= 0 ? 'E' : 'W';
    var tile = function (ico, label, si, miss) {
      if (miss) return '<div class="nd-tile nd-tile-miss"><span class="nd-ti">' + ico + '</span><b>' + label + '</b><em>غير محدد</em><small>أضف وقت الميلاد لحسابه</small></div>';
      return '<div class="nd-tile"><span class="nd-ti">' + ico + '</span><b>' + label + '</b><em>في ' + SG[si][0] + '</em><small>' + SG[si][4].join(' <i></i> ') + '</small></div>';
    };
    var summary = 'تغلب على خريطتك طاقة ' + ELN[domE] + ' (' + pc.el[domE] + '%) في إيقاع ' + MDN[domM].replace('ال', '') + ' يميل إلى ' + MDP[domM] + '، ' +
      'مع شمس في ' + SG[sSign][0] + ' وقمر في ' + SG[mSign][0] + (known ? ' وطالع في ' + SG[aSign][0] : '') + '. نركّز هنا على ' + ELP[domE] + '. قراءة رمزية للتأمل وليست حكمًا نهائيًا.';
    var chip = function (ico, label, val) { return '<div class="nd-chip"><span class="nd-chip-i">' + ico + '</span><span class="nd-chip-t"><small>' + label + '</small><b>' + esc(val) + '</b></span></div>'; };
    var dateTxt = S.y + '/' + n2(S.m) + '/' + n2(S.d), timeTxt = S.known ? n2(S.hh) + ':' + n2(S.mm) : 'غير معروف';
    var top = asps.slice().sort(function (a, b) { return b.score - a.score; }).slice(0, 5);
    var axes = known ? [['ASC', 'الطالع / ' + 'الأفق الشرقي', ch.asc], ['MC', 'وسط السماء / أعلى السماء', ch.mc], ['DSC', 'محور العلاقات (البيت 7)', ch.asc + 180], ['IC', 'قاع السماء (البيت 4)', ch.mc + 180]] : [];

    var h = '';
    h += '<div class="nd-chips">' +
      chip(ic('<path d="M12 21s7-6 7-11.500A7 7 0 0 0 5 9.500C5 15 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.500"/>'), 'مكان الميلاد', S.placeName || '—') +
      chip(ic('<circle cx="12" cy="12" r="8.500"/><path d="M12 7.500V12l3 2"/>'), 'وقت الميلاد', timeTxt) +
      chip(ic('<rect x="3.500" y="5" width="17" height="15" rx="2.500"/><path d="M3.500 10h17M8 3v4M16 3v4"/>'), 'تاريخ الميلاد', dateTxt) + '</div>';
    h += '<div class="nd-title"><h3>' + (S.name ? 'خريطة ' + esc(S.name) : 'خريطة الولادة') + '</h3><p>صورة السماء لحظة وصولك إلى العالم</p>';
    h += '<button type="button" class="btn-edit-chart nd-edit" aria-label="تعديل البيانات / خريطة جديدة" title="تعديل البيانات / خريطة جديدة">' + ic('<path d="M4 20h4L19 9a2.800 2.800 0 0 0-4-4L4 16z"/><path d="M13.500 6.500l4 4"/>') + '</button></div>';
    h += '<div class="nd-tabs" role="tablist">' + [['map', 'الخريطة'], ['planets', 'الكواكب'], ['houses', 'البيوت'], ['aspects', 'الجوانب']].map(function (t) { return '<button type="button" role="tab" data-nd-tab="' + t[0] + '" aria-selected="' + (t[0] === 'map') + '">' + t[1] + '</button>'; }).join('') + '</div>';
    // لوحة الخريطة
    h += '<div class="nd-main" data-nd-panel="map"><div class="nd-grid">' +
      '<section class="nd-over"><h4>نظرة عامة</h4><p>تقدم خريطة ولادتك صورة فريدة للطاقة الكونية لحظة ميلادك، مما يكشف عن ملامح شخصيتك ودوافعك العميقة ومسارك في الحياة.</p>' +
      '<div class="nd-tiles">' + (known ? tile(ic('<path d="M12 4v16M12 4l-5 5M12 4l5 5"/>'), 'الطالع', aSign, false) : '') + tile(ic('<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'), 'الشمس', sSign) + tile(ic('<path d="M15.500 4.500a8 8 0 1 0 4 14 9 9 0 0 1-4-14z"/>'), 'القمر', mSign) + '</div>' +
      '<div class="nd-sum"><h5>' + ic('<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="3"/>') + 'خلاصة سريعة</h5><p>' + esc(summary) + '</p></div></section>' +
      '<section class="nd-wcard"><header><div><h4>خريطة الميلاد الفلكية</h4><small>نظام البيوت: ' + esc(hs) + '</small></div><div class="nd-coords" dir="ltr"><span>' + Math.abs(lat).toFixed(4) + '° ' + ns + '</span><span>' + Math.abs(lon).toFixed(4) + '° ' + ew + '</span></div></header>' +
      '<div class="nd-wslot"></div><p class="nd-pick" aria-live="polite">اضغط على أي كوكب لعرض موضعه.</p>' +
      '<ul class="nd-legend"><li><i style="background:' + ASPCOL.h + '"></i>اتصال منسجم</li><li><i style="background:' + ASPCOL.t + '"></i>اتصال متوتر</li><li><i style="background:' + ASPCOL.n + '"></i>اتصال محايد</li></ul>' +
      '<div class="nd-tools"><button type="button" class="nd-tool" data-nd-dl>' + ic('<path d="M12 4v11M7.500 11l4.500 4.500 4.500-4.500M5 19.500h14"/>') + '<span>تنزيل الصورة</span></button>' +
      '<button type="button" class="nd-tool" data-nd-copy>' + ic('<rect x="8.500" y="8.500" width="11" height="11" rx="2.200"/><path d="M15.500 8.500v-2a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>') + '<span>نسخ البيانات</span></button></div>' +
      '</section></div></div>';
    // لوحات القوائم
    h += '<div class="nd-main nd-list" data-nd-panel="planets" hidden><div class="nd-rows">' + planets.map(function (p, i) { var f = fmtLon(p.lon); return '<div class="nd-row" style="--i:' + i + '"><span class="nd-rg">' + gl(p.g) + '</span><b>' + p.n + (p.retro ? ' <em>R</em>' : '') + '</b><span>' + gl(SG[f.s][1]) + ' ' + SG[f.s][0] + ' ' + f.txt + '</span><span class="nd-rh">' + (known && p.house ? 'البيت ' + p.house : '—') + '</span></div>'; }).join('') + '</div></div>';
    h += (!known ? '' : '<div class="nd-main nd-list" data-nd-panel="houses" hidden>' + (known ? '<div class="nd-rows">' + ch.cusps.map(function (c, i) { var f = fmtLon(c); return '<div class="nd-row" style="--i:' + i + '"><span class="nd-rg nd-hnum">' + (i + 1) + '</span><b>البيت ' + (i + 1) + '</b><span>' + gl(SG[f.s][1]) + ' ' + SG[f.s][0] + ' ' + f.txt + '</span><span class="nd-rh">' + HA[i] + '</span></div>'; }).join('') + '</div>' : '') + '</div>');
    h += '<div class="nd-main nd-list" data-nd-panel="aspects" hidden><div class="nd-rows">' + (asps.length ? asps.slice().sort(function (a, b) { return a.orb - b.orb; }).map(function (x, i) { return '<div class="nd-row" style="--i:' + i + '"><span class="nd-rg" style="color:' + ASPCOL[x.A.t] + '">' + aspIcon(x.A.k) + '</span><b>' + x.a.n + ' · ' + x.b.n + '</b><span>' + x.A.n + '</span><span class="nd-rh">فارق ' + x.orb.toFixed(1) + '°</span></div>'; }).join('') : '<p class="nd-warn">لا جوانب رئيسية ضمن الحدود المعتادة.</p>') + '</div></div>';
    // البطاقات السفلية
    h += '<div class="nd-bottom">' +
      (!known ? '' : '<section class="nd-card"><h4>محاور الخريطة</h4>' + (known ? axes.map(function (a) { var f = fmtLon(a[2]); return '<div class="nd-axrow"><span class="nd-axb">' + a[0] + '</span><span class="nd-axt"><b>' + SG[f.s][0] + ' ' + gl(SG[f.s][1]) + '</b><small>' + a[1] + '</small></span><span class="nd-axd">' + f.txt + '</span></div>'; }).join('') : '') + '</section>') +
      '<section class="nd-card"><h4>أقوى الجوانب</h4>' + (top.length ? top.map(function (x) { return '<div class="nd-asrow"><span class="nd-sc">' + x.score.toFixed(1) + '</span><span class="nd-as" style="color:' + ASPCOL[x.A.t] + '">' + aspIcon(x.A.k) + '</span><span class="nd-an">' + x.a.n + ' · ' + x.b.n + '</span><em>' + x.A.n + '</em></div>'; }).join('') : '<p class="nd-warn">لا جوانب بارزة في هذه الخريطة.</p>') + '</section>' +
      '<section class="nd-card"><h4>توزيع العناصر</h4>' + [0, 1, 2, 3].map(function (e) { return '<div class="nd-el"><span class="nd-eln">' + ELN[e] + '</span><span class="nd-bar"><i style="--c:' + ELC[e] + '" data-w="' + pc.el[e] + '"></i></span><b data-pct="' + pc.el[e] + '">0%</b></div>'; }).join('') +
      '<div class="nd-md">' + MDN.map(function (m, i) { return '<span><small>' + m + '</small><b>' + pc.md[i] + '%</b></span>'; }).join('') + '</div></section></div>';
    return { html: h, ch: ch, planets: planets, asps: asps, known: known };
  }

  /* ترتيب الصفحة: العجلة فوق، التبويبات تحتها، وكل لوحة في تبويبها (نظرة عامة، الكواكب، البيوت، الجوانب، التوزيع) */
  function arrange(box) {
    var map = box.querySelector('[data-nd-panel="map"]'), wcard = box.querySelector('.nd-wcard'), over = box.querySelector('.nd-over');
    var bottom = box.querySelector('.nd-bottom'), tabs = box.querySelector('.nd-tabs');
    if (!map || !wcard || !over || !bottom || !tabs) return;
    var all = [].slice.call(bottom.querySelectorAll(':scope > .nd-card')), known = !!box.querySelector('[data-nd-panel="houses"]');
    var cards = known ? all : [null].concat(all);
    function stack(name, kids) {
      var d = document.createElement('div'); d.className = 'nd-main nd-stack'; d.setAttribute('data-nd-panel', name); d.hidden = true;
      kids.forEach(function (k) { if (k) d.appendChild(k); }); return d;
    }
    var pOver = stack('overview', [over, cards[0]]), pDist = stack('dist', [cards[2]]);
    var pAsp = box.querySelector('[data-nd-panel="aspects"]'); if (pAsp && cards[1]) pAsp.insertBefore(cards[1], pAsp.firstChild);
    wcard.classList.add('nd-wtop'); tabs.parentNode.insertBefore(wcard, tabs);
    tabs.insertAdjacentElement('afterend', pOver);
    if (pAsp) pAsp.insertAdjacentElement('afterend', pDist); else tabs.parentNode.appendChild(pDist);
    map.remove(); bottom.remove();
    var I = function (p) { return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
    var defs = [
      ['houses', 'البيوت', I('<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>')],
      ['planets', 'الكواكب', I('<circle cx="12" cy="12" r="4"/><ellipse cx="12" cy="12" rx="10" ry="3.500" transform="rotate(-22 12 12)"/>')],
      ['aspects', 'الجوانب', I('<path d="M12 4l8.500 15h-17z"/><circle cx="12" cy="4" r="1.200"/><circle cx="20.500" cy="19" r="1.200"/><circle cx="3.500" cy="19" r="1.200"/>')],
      ['dist', 'التوزيع', I('<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15 3.400A9 9 0 0 1 20.600 9H15z"/>')],
      ['overview', 'نظرة عامة', I('<rect x="4" y="4" width="7" height="7" rx="1.800"/><rect x="13" y="4" width="7" height="7" rx="1.800"/><rect x="4" y="13" width="7" height="7" rx="1.800"/><rect x="13" y="13" width="7" height="7" rx="1.800"/>')]
    ];
    var first = known ? 'houses' : 'planets';
    if (!known) defs = defs.filter(function (t) { return t[0] !== 'houses'; });
    var ph = box.querySelector('[data-nd-panel="' + first + '"]'); if (ph) ph.hidden = false;
    tabs.innerHTML = defs.map(function (t) { return '<button type="button" role="tab" data-nd-tab="' + t[0] + '" aria-selected="' + (t[0] === first) + '">' + t[2] + '<span>' + t[1] + '</span></button>'; }).join('');
  }

  /* ---------- نسخ البيانات وتنزيل الصورة ---------- */
  function plainLon(lon) { var s = Math.floor(norm(lon) / 30), r = norm(lon) - s * 30, d = Math.floor(r), m = Math.floor((r - d) * 60); return SG[s][0] + ' ' + d + '°' + n2(m) + '′'; }
  var XN = { node: 'العقدة الشمالية (متوسطة)', truenode: 'العقدة الشمالية (حقيقية)', lilith: 'ليليث' };
  function chartText(S, data) {
    var ch = data.ch, known = data.known, L = [];
    var hs = ch.hs === 'placidus' ? 'بلاسيدوس' : ch.hs === 'whole' || ch.hs === 'whole-fallback' ? 'البيوت الكاملة' : ch.hs === 'equal' ? 'البيوت المتساوية' : ch.hs === 'porphyry' ? 'بورفيري' : (ch.hs || '');
    L.push('خريطة الميلاد الفلكية' + (S.name ? ' — ' + S.name : ''));
    L.push('تاريخ الميلاد: ' + S.y + '/' + n2(S.m) + '/' + n2(S.d));
    L.push('وقت الميلاد: ' + (S.known ? n2(S.hh) + ':' + n2(S.mm) : 'غير معروف'));
    if (S.placeName) L.push('مكان الميلاد: ' + S.placeName);
    L.push('الإحداثيات: ' + Math.abs(Number(S.lat)).toFixed(4) + '° ' + (Number(S.lat) >= 0 ? 'N' : 'S') + ' · ' + Math.abs(Number(S.lon)).toFixed(4) + '° ' + (Number(S.lon) >= 0 ? 'E' : 'W'));
    if (known) L.push('نظام البيوت: ' + hs);
    L.push('', 'الكواكب');
    data.planets.forEach(function (p) { L.push(p.n + ': ' + plainLon(p.lon) + (p.retro ? ' (متراجع)' : '') + (known && p.house ? ' — البيت ' + p.house : '')); });
    Object.keys(XN).forEach(function (k) { var b = bodyOf(ch, k); if (b) L.push(XN[k] + ': ' + plainLon(b.lon) + (known && b.house ? ' — البيت ' + b.house : '')); });
    if (known) {
      L.push('', 'الزوايا');
      L.push('الطالع (ASC): ' + plainLon(ch.asc)); L.push('وسط السماء (MC): ' + plainLon(ch.mc));
      L.push('الغروب (DSC): ' + plainLon(ch.asc + 180)); L.push('قاع السماء (IC): ' + plainLon(ch.mc + 180));
      L.push('', 'البيوت');
      ch.cusps.forEach(function (c, i) { L.push('البيت ' + (i + 1) + ' (' + HA[i] + '): ' + plainLon(c)); });
    } else L.push('', 'ملاحظة: وقت الميلاد غير معروف، لذلك لا طالع ولا بيوت في هذه الخريطة.');
    L.push('', 'الجوانب');
    if (data.asps.length) data.asps.slice().sort(function (a, b) { return a.orb - b.orb; }).forEach(function (x) { L.push(x.a.n + ' ' + x.A.n + ' ' + x.b.n + ' — فارق ' + x.orb.toFixed(1) + '°'); });
    else L.push('لا جوانب رئيسية ضمن الحدود المعتادة.');
    L.push('', 'عقيق أسترو (Aqeq Astro)');
    return L.join('\n');
  }
  function copyText(t) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t);
    return new Promise(function (res, rej) {
      var a = document.createElement('textarea'); a.value = t; a.setAttribute('readonly', ''); a.style.cssText = 'position:fixed;top:0;inset-inline-start:0;opacity:0';
      document.body.appendChild(a); a.select(); a.setSelectionRange(0, t.length);
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {} a.remove(); ok ? res() : rej(new Error('copy'));
    });
  }
  function flash(btn, txt) {
    var sp = btn.querySelector('span'); if (!sp) return; var old = btn.getAttribute('data-l') || sp.textContent; btn.setAttribute('data-l', old);
    sp.textContent = txt; btn.classList.add('is-done'); clearTimeout(btn._t);
    btn._t = setTimeout(function () { sp.textContent = old; btn.classList.remove('is-done'); }, 1900);
  }
  function savePNG(box, S, data, btn) {
    var src = box.querySelector('.nd-wheel'); if (!src) return Promise.resolve();
    var svg = src.cloneNode(true); svg.setAttribute('width', 1232); svg.setAttribute('height', 1224);
    var url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' }));
    var fonts = document.fonts && document.fonts.load ? Promise.all([document.fonts.load('700 56px Amiri'), document.fonts.load('600 30px "IBM Plex Sans Arabic"')]).catch(function () {}) : Promise.resolve();
    return fonts.then(function () { return new Promise(function (res, rej) { var im = new Image(); im.onload = function () { res(im); }; im.onerror = rej; im.src = url; }); }).then(function (im) {
      var W = 1400, H = 1790, cv = document.createElement('canvas'); cv.width = W; cv.height = H; var x = cv.getContext('2d');
      var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#FBF6EC'); g.addColorStop(1, '#F3E9D8'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.strokeStyle = '#D2AE6C'; x.lineWidth = 3; x.strokeRect(28, 28, W - 56, H - 56);
      x.direction = 'rtl'; x.textAlign = 'center';
      x.fillStyle = '#4A1A2B'; x.font = '700 62px Amiri, "IBM Plex Sans Arabic", serif'; x.fillText(S.name ? 'خريطة ' + S.name : 'خريطة الميلاد الفلكية', W / 2, 130);
      x.fillStyle = '#6a5760'; x.font = '600 30px "IBM Plex Sans Arabic", Amiri, sans-serif';
      x.fillText(S.y + '/' + n2(S.m) + '/' + n2(S.d) + '  ·  ' + (S.known ? n2(S.hh) + ':' + n2(S.mm) : 'وقت غير معروف'), W / 2, 190);
      if (S.placeName) x.fillText(S.placeName, W / 2, 238);
      x.drawImage(im, 84, 280, 1232, 1224);
      var lg = [[ASPCOL.h, 'اتصال منسجم'], [ASPCOL.t, 'اتصال متوتر'], [ASPCOL.n, 'اتصال محايد']], lx = W / 2 + 330;
      x.font = '600 26px "IBM Plex Sans Arabic", sans-serif'; x.textAlign = 'right';
      lg.forEach(function (l, i) { var xr = lx - i * 330; x.strokeStyle = l[0]; x.lineWidth = 5; x.beginPath(); x.moveTo(xr, 1562); x.lineTo(xr - 56, 1562); x.stroke(); x.fillStyle = '#4a3a42'; x.fillText(l[1], xr - 70, 1572); });
      x.textAlign = 'center'; x.fillStyle = '#70263F'; x.font = '700 30px Amiri, serif'; x.fillText('عقيق أسترو  ·  Aqeq Astro', W / 2, 1700);
      URL.revokeObjectURL(url);
      return new Promise(function (res) {
        cv.toBlob(function (b) {
          var a = document.createElement('a'), u = URL.createObjectURL(b); a.href = u; a.download = 'aqeeq-natal-chart-' + S.y + '-' + n2(S.m) + '-' + n2(S.d) + '.png';
          document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000); res();
        }, 'image/png');
      });
    });
  }

  function render(S) {
    if (!S || !S.ch || !S.ch.bodies) return;
    var old = root.querySelector('.nd-root'); if (old) old.remove();
    var data; try { data = build(S); } catch (e) { if (window.console) console.warn('natal-dashboard', e); return; }
    var box = document.createElement('div'); box.className = 'nd-root'; box.innerHTML = data.html;
    // المحتوى القديم (التفاصيل الكاملة والتفسير) لم يعد يُعرض؛ يبقى مخفيًا كي لا تنكسر الطبقات التي تقرأ منه
    var legacy = document.createElement('div'); legacy.className = 'nd-legacy'; legacy.hidden = true;
    while (root.firstChild) legacy.appendChild(root.firstChild);
    root.appendChild(box); root.appendChild(legacy);
    root.classList.add('nd-on');
    arrange(box);
    var slot = box.querySelector('.nd-wslot'); slot.appendChild(wheelSVG(data.ch, data.planets, data.asps, data.known));
    var pick = box.querySelector('.nd-pick');
    var show = function (k) {
      var p = data.planets.filter(function (x) { return x.k === k; })[0]; if (!p) return;
      var f = fmtLon(p.lon); pick.innerHTML = '<b>' + p.n + '</b> في ' + SG[f.s][0] + ' ' + f.txt + (data.known && p.house ? ' · البيت ' + p.house + ' (' + HA[p.house - 1] + ')' : '') + (p.retro ? ' · تراجع' : '');
      box.querySelectorAll('.nd-pl').forEach(function (n) { n.classList.toggle('on', n.getAttribute('data-k') === k); });
      /* الضغط على كوكب في العجلة يفتح قراءته مباشرة، كأنك ضغطت صفه في قائمة الكواكب */
      var rows = box.querySelectorAll('[data-nd-panel="planets"] .nd-row');
      for (var r = 0; r < rows.length; r++) { var nm = ((rows[r].querySelector('b') || {}).textContent || '').replace(/\s*R\s*$/, '').trim(); if (nm === p.n) { rows[r].click(); break; } }
    };
    slot.addEventListener('click', function (e) { var g = e.target.closest('.nd-pl'); if (g) show(g.getAttribute('data-k')); });
    slot.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('nd-pl')) { e.preventDefault(); show(e.target.getAttribute('data-k')); } });
    // التبويبات
    var tabs = box.querySelectorAll('[data-nd-tab]');
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
        box.querySelectorAll('[data-nd-panel]').forEach(function (p) { var on = p.getAttribute('data-nd-panel') === t.getAttribute('data-nd-tab'); p.hidden = !on; if (on) { p.classList.remove('nd-anim'); void p.offsetWidth; p.classList.add('nd-anim'); } });
      });
    });
    var dl = box.querySelector('[data-nd-dl]'), cp = box.querySelector('[data-nd-copy]');
    if (dl) dl.addEventListener('click', function () { if (dl.disabled) return; dl.disabled = true; flash(dl, 'جارٍ تجهيز الصورة…'); savePNG(box, S, data, dl).then(function () { flash(dl, 'تم تنزيل الصورة'); }, function () { flash(dl, 'تعذر التنزيل، حاول مرة أخرى'); }).then(function () { dl.disabled = false; }); });
    if (cp) cp.addEventListener('click', function () { copyText(chartText(S, data)).then(function () { flash(cp, 'تم نسخ البيانات'); }, function () { flash(cp, 'تعذر النسخ'); }); });
    // حركة النسب
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      box.classList.add('nd-go');
      box.querySelectorAll('.nd-bar i').forEach(function (i) { i.style.width = i.getAttribute('data-w') + '%'; });
      box.querySelectorAll('[data-pct]').forEach(function (b) { countUp(b, +b.getAttribute('data-pct')); });
    }); });
  }

  /* نخفي النتيجة أثناء تركيبها (اللوحة ثم النصوص) ونظهرها مرة واحدة، فلا تقفز الصفحة ولا تختفي الأقسام */
  function unbusy() { clearTimeout(unbusy.t); root.classList.remove('nd-busy'); }
  window.AqeeqResultReady = unbusy;
  window.addEventListener('aqeeq:chart-rendered', function (e) {
    root.classList.add('nd-busy'); clearTimeout(unbusy.t); unbusy.t = setTimeout(unbusy, 4000);
    setTimeout(function () { render(e.detail || (window.AqeeqChartContext && window.AqeeqChartContext.getNatal())); }, 30);
  });
})();

;
/* assets/js/interpretation-library.js */
/* مكتبة التفسيرات: طبقة عرض للخريطة الفلكية. لا تحسب شيئًا ولا تغيّر المحرك.
   تقرأ مواضع الخريطة (AqeeqChartContext) وتبحث عن النص بالمفتاح في data/interpretations/<body>.json.
   المعتمد فقط (status = approved) يُعرض نصه. غير الموجود أو المسودة يظهر كخانة فارغة بمفتاحها
   ما دام SHOW_EMPTY_SLOTS = true (اقلبه إلى false عند الإطلاق). المواصفات: data/interpretations/README.md */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.AqeeqInterpretations = api; if (typeof document !== 'undefined') api.boot(); }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var SHOW_EMPTY_SLOTS = true;
  var VERSION = '20261114b';
  var BASE = 'data/interpretations/';

  var SIGN_AR = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var SIGN_EN = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  var HOUSE_AR = ['الذات والمظهر', 'المال والقيم', 'التواصل والتعلم', 'البيت والجذور', 'الإبداع والحب', 'العمل اليومي والعادات',
    'الشراكات والعلاقات', 'التحولات والعمق', 'المعتقد والسفر والمعنى', 'المسار المهني والمكانة', 'الأصدقاء والأحلام', 'العالم الداخلي والعزلة'];
  var ORD = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'];
  var LABEL = { sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ', jupiter: 'المشتري', saturn: 'زحل',
    uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو', north_node: 'العقدة القمرية الشمالية', south_node: 'العقدة القمرية الجنوبية',
    lilith: 'ليليث', fortune: 'نقطة الحظ', asc: 'الطالع', dsc: 'الهابط', mc: 'وسط السماء', ic: 'قاع السماء' };
  var PLANETS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  var POINTS = ['north_node', 'south_node', 'lilith', 'fortune'];
  var ANGLES = ['asc', 'dsc', 'mc', 'ic'];
  var ORDER = PLANETS.concat(POINTS);
  var ASPECTS = [
    { slug: 'conjunction', n: 'اتصال', ang: 0, orb: 8 }, { slug: 'sextile', n: 'سداسي', ang: 60, orb: 4 },
    { slug: 'square', n: 'تربيع', ang: 90, orb: 6 }, { slug: 'trine', n: 'تثليث', ang: 120, orb: 6 },
    { slug: 'opposition', n: 'مقابلة', ang: 180, orb: 8 }];

  function norm(x) { x = x % 360; return x < 0 ? x + 360 : x; }
  function d180(x) { x = norm(x); return x > 180 ? 360 - x : x; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- المفاتيح ---------- */
  function idCore(body, house) { return 'natal.core.' + body + '.house' + house; }
  /* لون البرج: المفتاح الأساسي حسب الجسم والبرج؛ ويُقبل مفتاح خاص بالبيت يتقدّم عليه إن وُجد */
  function idTint(body, sign, house) { return 'natal.sign_tint.' + body + (house ? '.house' + house : '') + '.' + SIGN_EN[sign]; }
  function idModifier(body, mod) { return 'natal.modifier.' + body + '.' + mod; }
  function idAspect(first, type, second) { return 'natal.aspect.' + first + '.' + type + '.' + second; }
  function idCusp(house, sign) { return 'natal.house_cusp.house' + house + '.' + SIGN_EN[sign]; }
  function idSignOnly(body, sign) { return 'natal.sign_only.' + body + '.' + SIGN_EN[sign]; }
  function idStellium(kind, v) { return 'natal.stellium.' + (kind === 'house' ? 'house' + v : SIGN_EN[v]); }
  function idBlend(planet, house) { return 'natal.house_blend.' + planet + '.house' + house; }
  function idAngle(angle, sign) { return 'natal.angle.' + angle + '.' + SIGN_EN[sign]; }

  /* ---------- نموذج الخريطة ---------- */
  function build(S) {
    var ch = S && S.ch; if (!ch) return null;
    var by = {}; ch.bodies.forEach(function (b) { by[b.key] = b; });
    var known = !!ch.known, items = {};
    function item(key, src, lon, house, retro) {
      var sign = Math.floor(norm(lon) / 30);
      items[key] = { body: key, label: LABEL[key], lon: norm(lon), sign: sign, house: known ? house : null, retro: !!retro };
    }
    PLANETS.forEach(function (k) { if (by[k]) item(k, by[k], by[k].lon, by[k].house, by[k].retro); });
    var nn = by.truenode || by.node;
    if (nn) {
      item('north_node', nn, nn.lon, nn.house, false);
      item('south_node', nn, nn.lon + 180, nn.house ? ((nn.house + 5) % 12) + 1 : null, false);
    }
    if (by.lilith) item('lilith', by.lilith, by.lilith.lon, by.lilith.house, false);
    if (by.fortune && known) item('fortune', by.fortune, by.fortune.lon, by.fortune.house, false);
    var asp = [];
    for (var i = 0; i < PLANETS.length; i++) for (var j = i + 1; j < PLANETS.length; j++) {
      var a = items[PLANETS[i]], b = items[PLANETS[j]]; if (!a || !b) continue;
      var diff = d180(a.lon - b.lon);
      for (var t = 0; t < ASPECTS.length; t++) {
        var A = ASPECTS[t], lim = A.orb + ((a.body === 'sun' || a.body === 'moon' || b.body === 'sun' || b.body === 'moon') ? 1 : 0);
        var o = Math.abs(diff - A.ang);
        if (o <= lim) { asp.push({ first: a.body, second: b.body, type: A.slug, n: A.n, orb: o }); break; }
      }
    }
    var houses = [];
    if (known) for (var h = 1; h <= 12; h++) {
      houses.push({
        n: h, sign: Math.floor(norm(ch.cusps[h - 1]) / 30),
        occupants: PLANETS.filter(function (k) { return items[k] && items[k].house === h; })
      });
    }
    var angles = known ? [['asc', ch.asc], ['dsc', ch.asc + 180], ['mc', ch.mc], ['ic', ch.mc + 180]].map(function (p) {
      return { body: p[0], label: LABEL[p[0]], sign: Math.floor(norm(p[1]) / 30) };
    }) : [];
    var stel = { houses: [], signs: [] };
    houses.forEach(function (H) { if (H.occupants.length >= 3) stel.houses.push(H.n); });
    for (var sg = 0; sg < 12; sg++) {
      var inSign = PLANETS.filter(function (k) { return items[k] && items[k].sign === sg; });
      if (inSign.length >= 3) stel.signs.push({ sign: sg, bodies: inSign });
    }
    return { known: known, items: items, aspects: asp, houses: houses, angles: angles, stellium: stel };
  }

  /* ---------- الفهرس والتحميل ---------- */
  var cache = {};
  function files(m) {
    var f = {};
    Object.keys(m.items).forEach(function (k) { f[k] = 1; });
    m.angles.forEach(function (a) { f[a.body] = 1; });
    if (m.known) { f.house_cusp = 1; f.house_blend = 1; }
    if (m.stellium.houses.length || m.stellium.signs.length) f.stellium = 1;
    return Object.keys(f);
  }
  function load(body) {
    if (cache[body]) return cache[body];
    cache[body] = fetch(BASE + body + '.json?v=' + VERSION).then(function (r) { return r.ok ? r.json() : []; })
      .then(function (a) { return Array.isArray(a) ? a : []; }, function () { return []; });
    return cache[body];
  }
  function indexOf(lists) {
    var ix = {};
    lists.forEach(function (arr) {
      arr.forEach(function (e) { if (e && e.id && e.status === 'approved' && e.text) ix[e.id] = e; });
    });
    return ix;
  }

  /* ---------- عرض النص: ** ** عناوين، "- " قوائم، سطر فارغ بين الفقرات ---------- */
  function inline(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); }
  function renderText(t) {
    return String(t || '').replace(/\r/g, '').split(/\n{2,}/).map(function (para) {
      var lines = para.split('\n').filter(function (l) { return l.trim(); });
      if (!lines.length) return '';
      if (lines.length === 1 && /^\*\*[^*]+\*\*$/.test(lines[0].trim())) return '<h5 class="il-h">' + esc(lines[0].trim().slice(2, -2)) + '</h5>';
      if (lines.every(function (l) { return /^\s*-\s+/.test(l); })) return '<ul class="il-ul">' + lines.map(function (l) { return '<li>' + inline(l.replace(/^\s*-\s+/, '')) + '</li>'; }).join('') + '</ul>';
      return '<p>' + lines.map(inline).join('<br>') + '</p>';
    }).join('');
  }

  function entry(ix, ids, withSummary) {
    ids = [].concat(ids); var id = ids[ids.length - 1], e = null;
    for (var i = 0; i < ids.length && !e; i++) e = ix[ids[i]];
    if (e) return '<div class="il-entry" data-il-id="' + esc(id) + '">' + (withSummary && e.summary ? '<p class="il-sum">' + esc(e.summary) + '</p>' : '') + '<div class="il-text">' + renderText(e.text) + '</div></div>';
    return SHOW_EMPTY_SLOTS ? '<div class="il-slot" data-il-id="' + esc(id) + '"><span>النص قيد الكتابة</span><code dir="ltr">' + esc(id) + '</code></div>' : '';
  }
  function sub(title, body) { return body ? '<div class="il-sub"><h5>' + esc(title) + '</h5>' + body + '</div>' : ''; }
  function det(cls, sum, body, open) { return '<details class="' + cls + '"' + (open ? ' open' : '') + '><summary>' + sum + '</summary><div class="il-body">' + body + '</div></details>'; }
  var CHEV = '<svg class="il-chev" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function bodyBlock(m, ix, key, withHouse, bare) {
    var it = m.items[key], h = '';
    var where = SIGN_AR[it.sign] + (it.retro ? ' · راجع' : '') + (it.house ? ' · البيت ' + ORD[it.house - 1] : '');
    if (it.house) {
      h += entry(ix, idCore(key, it.house), true);
      h += sub('لون البرج: ' + SIGN_AR[it.sign], entry(ix, [idTint(key, it.sign, it.house), idTint(key, it.sign)], false));
    }
    else if (withHouse === false) h += entry(ix, idSignOnly(key, it.sign), true);
    if (it.retro) h += sub('الرجعية', entry(ix, idModifier(key, 'retrograde'), false));
    if (bare) return h;
    return '<article class="il-pl"><h4>' + esc(LABEL[key]) + '<small>' + esc(where) + '</small></h4>' + h + '</article>';
  }

  /* صفوف تفتح النافذة السفلية (chart-sheet.js): الصف يحمل قالبًا فيه نص التفسير بمكانه */
  function svg(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }
  var ASP_ICO = { conjunction: '<circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3"/>', sextile: '<path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/>', square: '<rect x="5" y="5" width="14" height="14"/>', trine: '<path d="M12 4 21 19H3z"/>', opposition: '<circle cx="6.5" cy="12" r="3.5"/><circle cx="17.5" cy="12" r="3.5"/><path d="M10 12h4"/>' };
  var PT_GLYPH = { north_node: '☊', south_node: '☋', lilith: '⚸', fortune: '⊗' };
  var ANG_ABBR = { asc: 'AC', dsc: 'DC', mc: 'MC', ic: 'IC' };
  function tpl(html) { return '<template class="il-content"><div class="il">' + html + '</div></template>'; }
  function row(i, rg, title, mid, rh, content, cls) {
    return '<div class="nd-row il-row" role="button" tabindex="0" style="--i:' + i + '"><span class="nd-rg' + (cls || '') + '">' + rg + '</span><b>' + esc(title) + '</b><span>' + esc(mid) + '</span><span class="nd-rh">' + esc(rh) + '</span>' + tpl(content) + '</div>';
  }
  function rows(list) { return '<div class="nd-rows">' + list.join('') + '</div>'; }

  function sections(m, ix) {
    var S = { aspects: '', points: '', angles: '', note: '', planetTpl: {}, houseTpl: {} };
    var asps = m.aspects.slice().sort(function (x, y) { return x.orb - y.orb; });
    S.aspects = asps.length ? rows(asps.map(function (a, i) {
      return row(i, svg(ASP_ICO[a.type]), LABEL[a.first] + ' · ' + LABEL[a.second], a.n, 'فارق ' + a.orb.toFixed(1) + '°', entry(ix, idAspect(a.first, a.type, a.second), true));
    })) : '';
    PLANETS.forEach(function (k) {
      var it = m.items[k]; if (!it) return;
      var extra = '';
      if (!m.known && k === 'moon' && Math.min(it.lon % 30, 30 - (it.lon % 30)) < 7) extra = '<p class="il-note">القمر يقطع نحو ثلاث عشرة درجة في اليوم، وموضعه هنا قريب من حدّ برجين، فبرجه الدقيق يحتاج ساعة ميلادك.</p>';
      S.planetTpl[k] = tpl(extra + bodyBlock(m, ix, k, m.known ? undefined : false, true));
    });
    S.stelSigns = m.stellium.signs.length ? rows(m.stellium.signs.map(function (g, i) {
      return row(i, svg('<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" stroke-dasharray="2 3"/>'), 'تجمّع في ' + SIGN_AR[g.sign], g.bodies.length + ' كواكب', '', entry(ix, idStellium('sign', g.sign), true));
    })).replace(/class="nd-row il-row"/g, 'class="nd-row il-row il-st"') : '';
    if (!m.known) {
      S.note = '<p class="il-note il-addtime">ظهرت لك كواكبك في أبراجها، أما البيوت والطالع فتحتاج ساعة ميلادك. إن عرفتها أضفها، وستظهر لك أقسام جديدة بحياتك الواقعية: العمل والعلاقات والبيت والمال. <button type="button" class="il-addbtn" data-il-addtime>أضف ساعة الميلاد</button></p>';
      return S;
    }
    m.houses.forEach(function (H) {
      var st = H.occupants.length >= 3 ? sub('تجمّع في البيت', entry(ix, idStellium('house', H.n), true)) : '';
      var bl = H.occupants.length ? '<div class="il-blend">' + H.occupants.map(function (k) { return entry(ix, idBlend(k, H.n), false); }).join('') + '</div>' : '';
      S.houseTpl[H.n] = tpl(sub('رأس البيت في ' + SIGN_AR[H.sign], entry(ix, idCusp(H.n, H.sign), true)) + st + bl);
    });
    S.angles = rows(m.angles.map(function (A, i) {
      return row(i, ANG_ABBR[A.body], A.label, SIGN_AR[A.sign], '', entry(ix, idAngle(A.body, A.sign), true), ' nd-hnum');
    }));
    var pts = POINTS.filter(function (k) { return m.items[k]; });
    if (pts.length) S.points = rows(pts.map(function (k, i) {
      var it = m.items[k];
      return row(i, PT_GLYPH[k], LABEL[k], SIGN_AR[it.sign], it.house ? 'البيت ' + it.house : '', bodyBlock(m, ix, k, undefined, true));
    }));
    return S;
  }

  /* ---------- نتيجة تقريبية لتاريخ ناقص: كواكب بطيئة في أبراجها فقط (نصوص sign_only) ---------- */
  var GLY = { sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂', jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇' };
  function partial(list) {
    return Promise.all(list.map(function (x) { return load(x.key); })).then(function (lists) {
      var ix = indexOf(lists);
      return rows(list.map(function (x, i) {
        return row(i, GLY[x.key], LABEL[x.key], SIGN_AR[x.sign], '', entry(ix, idSignOnly(x.key, x.sign), true));
      }));
    });
  }

  /* ---------- الربط بالصفحة ---------- */
  function listWrap(html) { return '<div class="nd-list il-wrap">' + html + '</div>'; }
  function inject(S, tries) {
    var box = document.querySelector('#result .nd-root');
    if (!box) { if (tries < 15) setTimeout(function () { inject(S, tries + 1); }, 150); else ready(); return; }
    box.querySelectorAll('.il-wrap,.il-content,.il-pointhead').forEach(function (n) { n.remove(); });
    var P = function (n) { return box.querySelector('[data-nd-panel="' + n + '"]'); };
    var ph = P('houses'), pp = P('planets'), pa = P('aspects'), po = P('overview');
    if (pp) pp.querySelectorAll('.nd-row').forEach(function (r) {
      var nm = ((r.querySelector('b') || {}).textContent || '').replace(/\s*R\s*$/, '').trim();
      var key = Object.keys(LABEL).filter(function (k) { return LABEL[k] === nm; })[0];
      if (key && S.planetTpl[key]) r.insertAdjacentHTML('beforeend', S.planetTpl[key]);
    });
    if (ph) ph.querySelectorAll('.nd-row').forEach(function (r, i) { if (S.houseTpl[i + 1]) r.insertAdjacentHTML('beforeend', S.houseTpl[i + 1]); });
    if (pa) pa.innerHTML = S.aspects || '<p class="nd-warn">لا جوانب رئيسية ضمن الحدود المعتادة.</p>';
    if (pp && S.points) pp.insertAdjacentHTML('beforeend', '<h4 class="il-gt il-pointhead">العقد القمرية والنقاط الحساسة</h4>' + S.points);
    if (pp && S.note) pp.insertAdjacentHTML('beforeend', '<div class="il-wrap">' + S.note + '</div>');
    if (po && S.angles) {
      var card = [].slice.call(po.querySelectorAll('.nd-card')).filter(function (c) { return /محاور/.test((c.querySelector('h4') || {}).textContent || ''); })[0];
      var html = '<div class="nd-list il-wrap"><h4 class="il-gt">محاور الخريطة</h4>' + S.angles + '</div>';
      if (card) card.outerHTML = html; else po.insertAdjacentHTML('beforeend', html);
    }
    if (po && S.stelSigns) po.insertAdjacentHTML('beforeend', '<div class="nd-list il-wrap"><h4 class="il-gt">تجمّع الكواكب</h4>' + S.stelSigns + '</div>');
    var ab = box.querySelector('[data-il-addtime]');
    if (ab) ab.addEventListener('click', function () { var e = document.querySelector('.nd-edit'); if (e) e.click(); });
    ready();
  }
  function ready() { if (typeof window.AqeeqResultReady === 'function') window.AqeeqResultReady(); }
  function mount(S) {
    if (!document.getElementById('result') || !S) return;
    var m = build(S); if (!m) { ready(); return; }
    Promise.all(files(m).map(load)).then(function (lists) {
      inject(sections(m, indexOf(lists)), 0);
    });
  }
  function boot() {
    window.addEventListener('aqeeq:chart-rendered', function (e) {
      setTimeout(function () { mount(e.detail || (window.AqeeqChartContext && window.AqeeqChartContext.getNatal())); }, 120);
    });
  }

  return { partial: partial, boot: boot, build: build, sections: sections, renderText: renderText, indexOf: indexOf, idCore: idCore, idTint: idTint, idModifier: idModifier, idAspect: idAspect, idAngle: idAngle, idCusp: idCusp, idStellium: idStellium, idBlend: idBlend, idSignOnly: idSignOnly,
    SIGN_EN: SIGN_EN, ORDER: ORDER, ANGLES: ANGLES, PLANETS: PLANETS, POINTS: POINTS, ASPECTS: ASPECTS };
});

;
/* assets/js/partial-date.js */
/* مستويات تاريخ الميلاد الناقص في نموذج الخريطة الفلكية. لا يلمس المحرك ولا لوحة الخريطة الكاملة.
   سنة فقط: الكواكب البطيئة التي لم يتغير برجها طوال السنة. سنة وشهر: يضاف إليها ما لم يتغير برجه طوال الشهر (الشمس غالبًا).
   لا شيء: الجملة الهادئة فقط. التاريخ الكامل بلا ساعة والكامل بساعة يمرّان على المسار المعتاد دون تغيير. */
(function () {
  'use strict';
  var MSG_NONE = 'الخريطة تُبنى على تاريخ ميلادك. اسأل أهلك أو راجع شهادة الميلاد، ثم عُد إلينا.';
  var NOTE = { y: 'عرفنا سنة ميلادك فقط، فظهرت الكواكب البطيئة التي بقيت في برج واحد طوال تلك السنة. لباقي الخريطة نحتاج الشهر واليوم.',
    ym: 'عرفنا سنة وشهر ميلادك، فظهرت الكواكب التي بقيت في برج واحد طوال ذلك الشهر، وهي قراءة تقريبية. لخريطتك الكاملة نحتاج اليوم أيضًا.' };
  var SLOW = { y: ['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'], ym: ['sun', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'] };
  var $ = function (s) { return document.querySelector(s); };

  function init() {
    var form = $('#cform'), dateF = $('#f-date'), unk = $('#f-unknown');
    if (!form || !dateF || $('#f-datelevel')) return;
    var anchor = dateF.closest('.ntx-dt') || dateF.closest('.field');
    var box = document.createElement('div');
    box.className = 'pd-box';
    box.innerHTML = '<label class="pd-l" for="f-datelevel">ما الذي تعرفه من تاريخ ميلادك؟</label>' +
      '<select id="f-datelevel"><option value="full">التاريخ كاملًا</option><option value="ym">السنة والشهر فقط</option><option value="y">السنة فقط</option><option value="none">لا أعرف شيئًا منه</option></select>' +
      '<div class="pd-part" hidden><input id="f-py" type="number" inputmode="numeric" min="1900" max="2100" placeholder="السنة" aria-label="السنة">' +
      '<select id="f-pm" aria-label="الشهر"></select></div>';
    anchor.parentNode.insertBefore(box, anchor.nextSibling);
    var AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    $('#f-pm').innerHTML = AR.map(function (n, i) { return '<option value="' + (i + 1) + '">' + n + '</option>'; }).join('');
    var sel = $('#f-datelevel'), part = box.querySelector('.pd-part'), dateField = dateF.closest('.field');
    function sync() {
      var v = sel.value, partial = v === 'ym' || v === 'y';
      part.hidden = !partial; $('#f-pm').hidden = v !== 'ym';
      dateField.style.display = v === 'full' ? '' : 'none';
      dateF.required = v === 'full';
    }
    sel.addEventListener('change', sync); sync();

    form.addEventListener('submit', function (e) {
      var v = sel.value; if (v === 'full') return;
      e.preventDefault(); e.stopImmediatePropagation();
      var err = $('#ferr'); if (err) err.hidden = true;
      if (v === 'none') { if (err) { err.textContent = MSG_NONE; err.hidden = false; } return; }
      var y = parseInt($('#f-py').value, 10);
      if (!(y >= 1900 && y <= 2100)) { if (err) { err.textContent = 'اكتب سنة الميلاد بين 1900 و 2100.'; err.hidden = false; } return; }
      show(v, y, parseInt($('#f-pm').value, 10));
    }, true);
  }

  function stable(A, key, from, to) {
    var a = signOf(A, key, from), b = signOf(A, key, to);
    return a === b ? a : null;
  }
  function signOf(A, key, ms) {
    var c = A.chart({ utcMs: ms, lat: 30.04, lon: 31.24, known: false }), b = c.bodies.filter(function (x) { return x.key === key; })[0];
    return b ? Math.floor(((b.lon % 360) + 360) % 360 / 30) : null;
  }

  function show(level, y, m) {
    var A = window.Astro, L = window.AqeeqInterpretations; if (!A || !L || !L.partial) return;
    var from = level === 'y' ? Date.UTC(y, 0, 1) : Date.UTC(y, m - 1, 1), to = level === 'y' ? Date.UTC(y, 11, 31, 23) : Date.UTC(y, m, 0, 23);
    var list = [];
    SLOW[level].forEach(function (k) { var sg = stable(A, k, from, to); if (sg != null) list.push({ key: k, sign: sg }); });
    L.partial(list).then(function (html) {
      var r = $('#result'); if (!r) return;
      r.innerHTML = '<div class="nd-root pd-root"><div class="nd-title"><h3>قراءة تقريبية</h3><p>' + NOTE[level] + '</p></div>' +
        '<div class="nd-main nd-list il-wrap" data-nd-panel="planets">' + html + '</div>' +
        '<button type="button" class="btn-edit-chart pd-add">أضف باقي التاريخ</button></div>';
      r.hidden = false; r.style.display = 'block';
      var cf = $('#cform'); if (cf) { cf.hidden = true; cf.style.display = 'none'; }
      var intro = document.querySelector('#chart .center'); if (intro) { intro.hidden = true; intro.style.display = 'none'; }
      r.querySelector('.pd-add').addEventListener('click', function () {
        r.hidden = true; r.style.display = 'none'; if (cf) { cf.hidden = false; cf.style.display = ''; }
        if (intro) { intro.hidden = false; intro.style.display = ''; }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      r.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

;
/* assets/js/life-path-view.js */
/* مسار الحياة — طبقة عرض فقط. تقرأ نتيجة المحرك الحالي (AqeqPinnaclesChallenges + ما رسمه renderLP)
   ولا تحسب أي قيمة جديدة: الأعمار والفترات والقراءات كلها من المحرك الحالي. */
(function () {
  'use strict';
  var root = document.getElementById('lpresult'); if (!root) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var navCount = 0; window.addEventListener('hashchange', function () { navCount++; });
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var NA = '<span class="lpj-na">غير متوفر حاليًا</span>';
  var I = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    life: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19l5-6 4 3 7-10"/><path d="M15 6h5v5"/></svg>',
    peak: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 19l6-10 4 6 3-4 5 8z"/></svg>',
    gate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 20V10a7 7 0 0 1 14 0v10"/><path d="M9 20v-6h6v6"/></svg>',
    dot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
    door: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h13M12 6l6 6-6 6"/></svg>',
    full: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M8 12.5l3 3 5-6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    past: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    here: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="5"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" width="18" height="18"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/></svg>',
    matrix: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9 9-9 9-9-9z"/><path d="M12 8l4 4-4 4-4-4z"/></svg>',
    pair: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/></svg>',
    read: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/></svg>'
  };
  var STAGE_ICO = [I.dot, I.door, I.peak, I.full];
  var STATUS = { past: ['مرحلة سابقة', I.past], current: ['المرحلة الحالية', I.here], future: ['مرحلة قادمة', I.next] };
  var TIPS = {
    life: 'الرقم الأساسي الناتج عن تاريخ ميلادك في المحرك الحالي.',
    peak: 'القمة: فترة عمرية لها رقمها وطابعها ضمن القمم الأربع.',
    chal: 'التحدي: درس يرافق فترة عمرية معينة ضمن التحديات الأربعة.'
  };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var building = false, lastKey = '';

  function readInputs() {
    var num = $('.numbadge', root), dEl = document.getElementById('lp-date');
    if (!num || !dEl || !dEl.value) return null;
    var lp = parseInt(num.textContent, 10), p = dEl.value.split('-').map(Number);
    if (!lp || p.length !== 3) return null;
    var h3 = $('.res-head h3', root), tg = $('.res-head .tg2', root), nm = document.getElementById('lp-name');
    return { lp: lp, y: p[0], m: p[1], d: p[2], title: h3 ? h3.textContent.trim() : '', tag: tg ? tg.textContent.trim() : '', name: nm ? nm.value.trim() : '' };
  }
  function ageOf(y, m, d) { var n = new Date(), a = n.getFullYear() - y; if (n.getMonth() + 1 < m || (n.getMonth() + 1 === m && n.getDate() < d)) a--; return Math.max(0, a); }
  function stageIndex(res, age) {
    for (var i = 0; i < res.pinnacles.length; i++) { var p = res.pinnacles[i].period; if (age >= p.startAge && (p.endAge == null || age <= p.endAge)) return i; }
    return res.pinnacles.length - 1;
  }
  function statusOf(i, cur) { return i < cur ? 'past' : i === cur ? 'current' : 'future'; }
  function pad(n) { return String(n).padStart(2, '0'); }

  function orbit() {
    return '<svg viewBox="0 0 560 360" fill="none" stroke="#D9B979" stroke-width="1" aria-hidden="true" style="opacity:.55"><circle cx="280" cy="180" r="170"/><circle cx="280" cy="180" r="124" stroke-opacity=".6"/><circle cx="280" cy="180" r="78" stroke-opacity=".45"/><path d="M40 300 C 150 300, 190 210, 280 180 S 430 80, 540 50" stroke-width="1.4"/><circle cx="540" cy="50" r="4" fill="#D9B979"/><circle cx="280" cy="180" r="3" fill="#D9B979"/></svg>';
  }
  function stairs() { return '<svg class="lpj-stairs" viewBox="0 0 240 46" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" aria-hidden="true"><path d="M2 42h52V30h52V18h52V6h28"/></svg>'; }

  function section(head, sub, body, id, d) { return '<section class="lpj-sec lpj-reveal" style="--d:' + d + 'ms"' + (id ? ' id="' + id + '"' : '') + '><h2>' + head + '</h2>' + (sub ? '<p class="sub">' + sub + '</p>' : '') + body + '</section>'; }

  function build(inp) {
    var PC = window.AqeqPinnaclesChallenges;
    var res = PC.calculatePinnaclesChallenges(inp.d, inp.m, inp.y, inp.lp);
    var age = ageOf(inp.y, inp.m, inp.d), cur = stageIndex(res, age);
    var pr = function (v) { return PC.getPinnacleReading(v); }, cr = function (v) { return PC.getChallengeReading(v); };
    var P = res.pinnacles, C = res.challenges;
    var curP = P[cur], curC = C[cur];
    var state = { sel: cur };

    var crumb = '<nav aria-label="مسار التنقل"><ol class="lpj-crumb"><li><a href="#home">الرئيسية</a></li><li><a href="#aqh-tools">اكتشف ذاتك</a></li><li aria-current="page">مسار الحياة</li></ol></nav>' +
      '<button type="button" class="lpj-back" data-lpj-back aria-label="رجوع">' + I.back + '<span>رجوع</span></button>';
    var intro = '<header class="lpj-intro lpd-intro lpj-reveal"><h1>مسار حياتك</h1><p>اقرأ الإيقاع العام لرحلتك، والمراحل التي تحمل دروسك ونقاط تحوّلك.</p></header>';
    var IC = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
    var chips = '<div class="lpd-chips lpj-reveal" style="--d:60ms">' +
      '<div class="lpd-chip"><span class="lpd-ci">' + IC('<circle cx="12" cy="8" r="4"/><path d="M4.500 20.500a7.500 7.500 0 0 1 15 0"/>') + '</span><span class="lpd-ct"><small>الاسم</small><b>' + esc(inp.name || 'مسارك الشخصي') + '</b></span></div>' +
      '<div class="lpd-chip"><span class="lpd-ci">' + IC('<rect x="3.500" y="5" width="17" height="15" rx="2.500"/><path d="M3.500 10h17M8 3v4M16 3v4"/>') + '</span><span class="lpd-ct"><small>تاريخ الميلاد · العمر ' + age + ' سنة</small><b>' + pad(inp.d) + '/' + pad(inp.m) + '/' + inp.y + '</b></span></div>' +
      '<div class="lpd-acts"><button type="button" class="lpj-btn ghost" data-lpj-interp><span>القراءة الكاملة</span></button><a class="lpj-btn ghost" href="#lifepath-compat"><span>قارن مساري الحياة</span>' + I.arrow + '</a>' +
      '<button type="button" class="lpj-btn ghost" data-lpj-edit><span>تعديل التاريخ</span></button></div></div>';
    function metric(ico, label, tip, val, desc, d) {
      return '<div class="lpj-m lpj-reveal" style="--d:' + d + 'ms"><span class="lpj-ico">' + ico + '</span><div><small>' + label + '<button type="button" class="lpj-tip" data-tip="' + esc(tip) + '" aria-label="' + esc(tip) + '">؟</button></small><b>' + val + '</b><span class="d">' + desc + '</span></div></div>';
    }
    var nextP = cur < P.length - 1 ? P[cur + 1] : null, nextRd = nextP ? pr(nextP.value) : null, curRd = pr(curP && curP.value);
    var metrics = '<aside class="lpd-read"><h3>' + IC('<path d="M6 20V10M12 20V4M18 20v-7"/>') + 'قراءة المسار</h3><p class="lpd-sub">خلاصة سريعة من مسارك الشخصي</p><div class="lpj-metrics">' +
      metric(I.life, 'رقم المسار', TIPS.life, inp.lp, esc(inp.title.replace(/^.*?:\s*/, '')) || '', 160) +
      metric(I.dot, 'المرحلة الحالية', TIPS.peak, curRd ? esc(curRd.title) : (curP ? 'القمة ' + curP.value : NA), curP && curP.period ? esc(curP.period.label) : '', 230) +
      metric(I.door, 'الاتجاه القادم', 'المرحلة التالية في رحلتك حسب القمم الأربع.', nextRd ? esc(nextRd.title) : (nextP ? 'القمة ' + nextP.value : 'اكتمال الدورة'), nextP ? esc(nextP.period.label) : 'أنت في آخر مراحل الدورة', 300) + '</div></aside>';

    /* مؤشر رمزي مشتق من أرقام الميلاد: يتغير مع كل تاريخ (ليس قياسًا علميًا) */
    var AFF = { 1: [.4, .9, .5, .7], 2: [.9, .5, .6, .4], 3: [.8, .6, .5, .6], 4: [.5, .8, .4, .9], 5: [.6, .6, .5, .9], 6: [.9, .6, .6, .5], 7: [.5, .5, .95, .4], 8: [.4, .95, .5, .7], 9: [.8, .5, .9, .5] };
    function root9(n) { n = Number(n) || 1; if (n === 11) return 2; if (n === 22) return 4; if (n === 33) return 6; while (n > 9) n = String(n).split('').reduce(function (a, b) { return a + Number(b); }, 0); return n || 9; }
    var nums = [[inp.lp, 3], [curP && curP.value, 2], [curC && curC.value, 1], [inp.d, 1], [inp.m, 1], [inp.y, 1]];
    var DIM = [0, 0, 0, 0], W = 0;
    nums.forEach(function (x) { var a = AFF[root9(x[0])] || AFF[9]; for (var k = 0; k < 4; k++) DIM[k] += a[k] * x[1]; W += x[1]; });
    var spirit = [11, 22, 33].indexOf(inp.lp) > -1 ? .06 : 0;
    var DPCT = DIM.map(function (v, k) { return Math.max(35, Math.min(97, Math.round((v / W + (k === 2 ? spirit : 0)) * 100))); });
    var DNAMES = ['العاطفي', 'المهني', 'الروحي', 'الجسدي'];
    var BAL = Math.round(DPCT.reduce(function (a, b) { return a + b; }, 0) / 4);
    var KEYW = { 1: ['الريادة', 'الاستقلال', 'المبادرة'], 2: ['التعاون', 'الحساسية', 'الانسجام'], 3: ['التعبير', 'الإبداع', 'الألفة'], 4: ['الاستقرار', 'النظام', 'البناء'], 5: ['الحرية', 'التغيير', 'المغامرة'], 6: ['الرعاية', 'المسؤولية', 'الجمال'], 7: ['التأمل', 'التحليل', 'الحكمة'], 8: ['القوة', 'الإنجاز', 'الوفرة'], 9: ['الإنسانية', 'الاكتمال', 'العطاء'] };
    var KW = KEYW[root9(inp.lp)];
    var growthRd = cr(curC && curC.value), growthT = growthRd && growthRd.title ? growthRd.title : (curC ? 'التحدي ' + curC.value : NA);
    var growthTxt = growthRd && (growthRd.essence || growthRd.lesson) ? String(growthRd.essence || growthRd.lesson) : '';
    if (growthTxt.length > 150) growthTxt = growthTxt.slice(0, 147).replace(/\s+\S*$/, '') + '…';
    var lowK = DPCT.indexOf(Math.min.apply(null, DPCT));
    var quote = (curRd && (curRd.reflection || curRd.essence)) || '';
    if (quote.length > 130) quote = quote.slice(0, 127).replace(/\s+\S*$/, '') + '…';
    var CIRC = 2 * Math.PI * 52;
    var tri = '<div class="lpd-tri">' +
      '<section class="lpd-card lpj-reveal" style="--d:380ms"><h3>' + IC('<path d="M12 3v18M5 7h14M5 7l-3 7a3.500 3.500 0 0 0 6 0zM19 7l-3 7a3.500 3.500 0 0 0 6 0z"/>') + 'مؤشر التوازن</h3><p class="lpd-sub">مؤشر رمزي من أرقام ميلادك لتوازن جوانب حياتك</p>' +
      '<div class="lpd-bal"><div class="lpd-donut" data-pct="' + BAL + '"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="lpd-d-bg"/><circle cx="60" cy="60" r="52" class="lpd-d-fg" stroke-dasharray="' + CIRC.toFixed(1) + '" stroke-dashoffset="' + CIRC.toFixed(1) + '" data-off="' + (CIRC * (1 - BAL / 100)).toFixed(1) + '" transform="rotate(-90 60 60)"/></svg><b data-count="' + BAL + '">0%</b></div>' +
      '<div class="lpd-bars">' + DNAMES.map(function (n, k) { return '<div class="lpd-br"><span>' + n + '</span><span class="lpd-bar"><i data-w="' + DPCT[k] + '"></i></span><b data-count="' + DPCT[k] + '">0%</b></div>'; }).join('') + '</div></div></section>' +
      '<section class="lpd-card lpj-reveal" style="--d:450ms"><h3>' + IC('<path d="M5 19c0-8 5-13 14-14 0 9-5 14-14 14zM5 19 13 11"/>') + 'مجال النمو</h3><p class="lpd-sub">مجال يحتاج إلى تركيزك في مرحلتك الحالية</p>' +
      '<div class="lpd-grow"><div class="lpd-gico">' + IC('<path d="M12 21v-9M12 12c0-4-3-6-7-6 0 4 3 6 7 6zM12 14c0-3 2.500-5 6-5 0 3-2.500 5-6 5z"/>') + '</div><div><h4>' + esc(growthT) + '</h4>' + (growthTxt ? '<p>' + esc(growthTxt) + '</p>' : '') + '<span class="lpd-badge">' + (curC ? 'التحدي ' + curC.value : '') + ' · عناية بالجانب ' + DNAMES[lowK] + '</span></div></div></section>' +
      '<section class="lpd-card lpj-reveal" style="--d:520ms"><h3>' + IC('<path d="M12 3l2.500 6.500L21 12l-6.500 2.500L12 21l-2.500-6.500L3 12l6.500-2.500z"/>') + 'الرسالة الأساسية</h3><p class="lpd-sub">الجوهر الذي تحمله وتقدمه للعالم</p>' +
      (quote ? '<blockquote>“' + esc(quote) + '”</blockquote>' : '') + '<div class="lpd-kws">' + KW.map(function (w, k) { return '<span class="lpd-kw">' + IC(['<path d="M12 3l8 4v5c0 5-3.500 8-8 9-4.500-1-8-4-8-9V7z"/>', '<circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.500"/><path d="M3 20a6 6 0 0 1 12 0M15 20a4 4 0 0 1 6 0"/>', '<path d="M12 3l3 6 6 1-4.500 4 1 6.500L12 17.500 6.500 20.500l1-6.500L3 10l6-1z"/>'][k]) + '<b>' + w + '</b></span>'; }).join('') + '</div></section></div>';
    var DY = [14, -4, 16, 0];
    var steps = P.map(function (p, i) {
      var s = statusOf(i, cur), rd = pr(p.value), st = STATUS[s];
      return '<li style="--dy:' + (DY[i % 4]) + 'px;--k:' + i + '"><button type="button" class="lpj-st" data-i="' + i + '" data-status="' + s + '" aria-pressed="' + (i === cur) + '"' + (s === 'current' ? ' aria-current="step"' : '') + ' aria-label="المرحلة ' + (i + 1) + ': ' + st[0] + '، ' + esc(p.period.label) + '">' +
        (s === 'current' ? '<span class="lpd-here">المرحلة الحالية</span>' : '') +
        '<span class="lpj-node"><b>' + (i + 1) + '</b></span><span class="body"><span class="n">المرحلة ' + (i + 1) + '</span><span class="t">' + esc(rd ? rd.title : 'القمة ' + p.value) + '</span><span class="p">' + esc(p.period.label) + '</span>' +
        '<span class="vals">القمة ' + p.value + ' · التحدي ' + C[i].value + '</span><span class="lpj-tag">' + st[1] + st[0] + '</span></span></button></li>';
    }).join('');
    var mnt = '<svg class="lpd-mnt" viewBox="0 0 800 220" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="lpdg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#8a3d52" stop-opacity=".55"/><stop offset="1" stop-color="#2d0f1b" stop-opacity=".2"/></linearGradient></defs><circle cx="470" cy="70" r="42" fill="#d9a86a" opacity=".28"/><path d="M0 220V150l70-50 70 40 90-70 80 70 70-40 90 60 80-80 90 70 80-40 80 60V220z" fill="url(#lpdg)"/><path d="M0 220V180l90-40 80 30 100-50 90 60 100-30 110 50 100-40 130 40V220z" fill="#2d0f1b" opacity=".35"/></svg>';
    var curve = '<svg class="lpd-curve" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M87.5 ' + (20 + DY[0] / 2) + ' C 75 ' + (20 + DY[0] / 2) + ', 50 ' + (20 + DY[1] / 2) + ', 37.5 ' + (20 + DY[1] / 2) + '" pathLength="1"/><path d="M62.5 ' + (20 + DY[2] / 2) + ' C 50 ' + (20 + DY[2] / 2) + ', 25 ' + (20 + DY[3] / 2) + ', 12.5 ' + (20 + DY[3] / 2) + '" pathLength="1"/><path d="M87.5 ' + (20 + DY[0] / 2) + ' C 78 ' + (20 + DY[0] / 2) + ', 72 ' + (20 + DY[2] / 2) + ', 62.5 ' + (20 + DY[2] / 2) + '" pathLength="1" class="gap"/></svg>';
    var timeline = '<section class="lpd-jr lpj-reveal" style="--d:300ms" id="lpj-journey">' + mnt + '<header><div><h2>رحلة حياتك في أرقام ومعانٍ</h2><p>كل مرحلة تحمل فرصة للنمو واكتشاف ذات أعمق</p></div><span class="lpd-jr-note">كل محطة تقربك من ذاتك الحقيقية</span></header><ol class="lpj-tl lpd-tl" style="--p:' + (cur / (P.length - 1)) + '">' + steps + '</ol></section>';
    var stagePanel = '<div id="lpj-stage" class="lpj-stage" aria-live="polite"></div>';
    /* التوقيت: الفترات الأربع على مقياس العمر */
    var AGEMAX = Math.max(90, age + 5), tseg = P.map(function (p, i) { var a = p.period.startAge, b = p.period.endAge == null ? AGEMAX : p.period.endAge + 1; return '<div class="lpd-seg" data-status="' + statusOf(i, cur) + '" style="flex:' + Math.max(1, b - a) + '"><b>' + (i + 1) + '</b><small>' + esc(p.period.label) + '</small><em>القمة ' + p.value + ' · التحدي ' + C[i].value + '</em></div>'; }).join('');
    var timing = '<div class="lpd-timing"><div class="lpd-scale">' + tseg + '<i class="lpd-mark" data-pos="' + Math.min(100, age / AGEMAX * 100).toFixed(1) + '"><span>عمرك ' + age + '</span></i></div></div>';
    var how = '<div class="lpd-how"><span class="lpd-how-i">' + IC('<path d="M4 5.500C6.500 4.500 9.500 4.500 12 6c2.500-1.500 5.500-1.500 8-.5V19c-2.500-1-5.500-1-8 .5-2.500-1.500-5.500-1.500-8-.5z"/><path d="M12 6v13.500"/>') + '</span><div><h3>كيف نقرأ مسار الحياة؟</h3><p>مسار الحياة هو خريطة زمنية رمزية تُظهر المراحل الرئيسية في رحلتك، وتساعدك على فهم إيقاع حياتك واكتشاف الدروس واستشراف الفرص القادمة. من خلال الأرقام الكامنة في تاريخ ميلادك نقرأ الخط الذي يربط إمكاناتك الحالية بمحطاتك القادمة.</p></div>' +
      '<ol class="lpd-pts"><li><b>1</b><strong>الأرقام تكشف</strong><small>كل رقم يحمل معنى ورسالة</small></li><li><b>2</b><strong>المراحل تتكامل</strong><small>كل مرحلة تبني على السابقة</small></li><li><b>3</b><strong>الدروس توجه</strong><small>التحديات هي فرص للنمو</small></li><li><b>4</b><strong>المستقبل يصنع</strong><small>الوعي اليوم يصنع غدًا أفضل</small></li></ol></div>';

    function rows(arr, kind) {
      return '<ol>' + arr.map(function (x, i) {
        var s = statusOf(i, cur);
        return '<li><button type="button" class="lpj-row" data-i="' + i + '" data-status="' + s + '" aria-pressed="' + (i === cur) + '"><span class="i">' + (i + 1) + '</span><span class="v">' + x.value + '</span><span class="tx"><b>' + (kind === 'p' ? 'القمة ' : 'التحدي ') + (i + 1) + '</b><span>' + esc(x.period.label) + '</span></span><span class="go">' + I.arrow + '</span></button></li>';
      }).join('') + '</ol>';
    }
    var pcs = section('القمم والتحديات', 'القيم والفترات كما يحسبها المحرك الحالي.',
      '<div class="lpj-pc"><div class="lpj-card"><h3>القمم الأربع</h3><p>مراحل العمر وطابع كل قمة</p>' + stairs() + rows(P, 'p') + '</div><div class="lpj-card ch"><h3>التحديات الأربعة</h3><p>الدرس المصاحب لكل مرحلة</p>' + rows(C, 'c') + '</div></div>', 'lpj-pc', 450);

    var interpHead = '<h2 id="lpj-interp-h" class="lpj-reveal" style="font-size:clamp(1.6rem,3.4vw,2.1rem);color:#351B28;margin:0 0 6px">قراءة مسارك</h2>';

    var tabsBar = '<div class="lpd-tabs" role="tablist">' + [['ov', 'النظرة العامة'], ['st', 'المراحل'], ['ls', 'الدروس'], ['tm', 'التوقيت']].map(function (t, k) { return '<button type="button" role="tab" data-lpd-tab="' + t[0] + '" aria-selected="' + (k === 0) + '">' + t[1] + '</button>'; }).join('') + '</div>';
    var panels = '<div class="lpd-panel" data-lpd-panel="ov">' + how + '</div><div class="lpd-panel" data-lpd-panel="st" hidden>' + stagePanel + '</div><div class="lpd-panel" data-lpd-panel="ls" hidden>' + pcs + '</div><div class="lpd-panel" data-lpd-panel="tm" hidden>' + timing + '</div>';
    var top = '<div class="lpj-top lpj-wrap lpd">' + crumb + chips + tabsBar + panels + '<div id="lpj-interp" tabindex="-1">' + interpHead + '</div></div>';

    var rf = pr(curP && curP.value), refl = rf && rf.reflection;
    var tools = [['#matrix', I.matrix, 'مصفوفة القدر', 'خريطتك الرقمية الهندسية'], ['#chart', I.chart, 'الخريطة الفلكية', 'مواضع الكواكب لحظة ميلادك'], ['#life-path-synastry', I.pair, 'توافق مسارات الحياة', 'قراءة الشراكات بين رقمين'], ['#featured-content/pinnacles-cycles', I.read, 'اقرأ عن القمم والدورات', 'من المحتوى المميز']];
    var bottom = '<div class="lpj-bottom lpj"><section class="lpj-sec" aria-labelledby="lpj-ref-h">' +
      (refl ? '<div class="lpj-reflect"><small id="lpj-ref-h">سؤال للتأمل · المرحلة الحالية</small><q>' + esc(refl) + '</q><div class="lpj-btns"><button type="button" class="lpj-btn" data-lpj-open="' + cur + '"><span>اقرأ التحليل الكامل لمرحلتك</span>' + I.arrow + '</button></div></div>' : '') +
      '<h2 style="font-size:clamp(1.5rem,3vw,1.9rem);color:#351B28;margin-bottom:18px">أدوات مرتبطة</h2><div class="lpj-tools">' +
      tools.map(function (t) { return '<a class="lpj-tool" href="' + t[0] + '">' + t[1] + '<b>' + t[2] + '</b><span>' + t[3] + '</span></a>'; }).join('') + '</div></section></div>';

    return { top: top, bottom: bottom, res: res, state: state, cur: cur, P: P, C: C, pr: pr, cr: cr };
  }

  function stageCard(m) {
    var i = m.state.sel, s = statusOf(i, m.cur), p = m.P[i], c = m.C[i], rd = m.pr(p.value), st = STATUS[s];
    var ess = rd && rd.essence;
    return '<div><span class="here">' + st[1] + (s === 'current' ? 'أنت هنا' : st[0]) + '</span><h3>المرحلة ' + (i + 1) + ' — ' + esc(rd ? rd.title : 'القمة ' + p.value) + '</h3>' +
      '<div class="lpj-chips"><span class="lpj-chip">' + esc(p.period.label) + '</span><span class="lpj-chip">القمة ' + p.value + '</span><span class="lpj-chip">التحدي ' + c.value + '</span></div>' +
      '<p>' + (ess ? esc(ess) : NA) + '</p>' +
      (rd ? '<button type="button" class="lpj-btn solid" data-lpj-open="' + i + '"><span>اقرأ التحليل الكامل</span>' + I.arrow + '</button>' : '') + '</div>' +
      '<div class="lpj-stage-side"><div><span>القمة</span><b>' + p.value + '</b></div><div><span>التحدي</span><b>' + c.value + '</b></div><div><span>الحالة</span><strong>' + st[0] + '</strong></div></div>';
  }
  function panelHTML(m, i) {
    var p = m.P[i], c = m.C[i], a = m.pr(p.value), b = m.cr(c.value);
    function parts(list) { return list.filter(function (x) { return x[1]; }).map(function (x) { return '<h4>' + esc(x[0]) + '</h4><p>' + esc(x[1]) + '</p>'; }).join(''); }
    return '<button type="button" class="x" data-lpj-close aria-label="إغلاق">' + I.x + '</button>' +
      '<h3 id="lpj-panel-t">المرحلة ' + (i + 1) + ' — ' + esc(a ? a.title : 'القمة ' + p.value) + '</h3><p>' + esc(p.period.label) + '</p>' +
      (a ? '<span class="part">القمة ' + p.value + '</span>' + (a.essence ? '<p>' + esc(a.essence) + '</p>' : '') + parts([['طاقة القمة والفرص', a.energy], ['النبض النفسي والعاطفي', a.psyche], ['طريقة الاستثمار والعمل', a.invest], ['التحذير والظل الطاقي', a.shadow], ['قطب النور', a.light], ['في حياتك اليومية', a.reallife], ['سؤال للتأمل', a.reflection]]) : '<p>' + NA + '</p>') +
      (b ? '<span class="part">التحدي ' + c.value + (b.title ? ' — ' + esc(b.title) : '') + '</span>' + (b.essence ? '<p>' + esc(b.essence) + '</p>' : '') + parts([['جذر التحدي', b.root], ['الدرس النفسي والروحي', b.lesson], ['المهارات التي تحتاج بناء', b.skills], ['روشتة تجاوز التحدي', b.practice], ['قطب النور', b.light], ['في حياتك اليومية', b.reallife], ['سؤال للتأمل', b.reflection]]) : '');
  }

  function wire(m) {
    var top = $('.lpj-top', root), card = $('#lpj-stage', top);
    function select(i, scroll) {
      m.state.sel = i;
      [].forEach.call(top.querySelectorAll('.lpj-st,.lpj-row'), function (b) { b.setAttribute('aria-pressed', Number(b.getAttribute('data-i')) === i); });
      card.innerHTML = stageCard(m);
      if (scroll) card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
    }
    select(m.cur, false);
    function tab(k) {
      [].forEach.call(top.querySelectorAll('[data-lpd-tab]'), function (b) { b.setAttribute('aria-selected', b.getAttribute('data-lpd-tab') === k); });
      [].forEach.call(top.querySelectorAll('[data-lpd-panel]'), function (pn) { pn.hidden = pn.getAttribute('data-lpd-panel') !== k; });
      if (k === 'tm') place();
    }
    function place() { var mk = $('.lpd-mark', top); if (mk) mk.style.insetInlineStart = mk.getAttribute('data-pos') + '%'; }
    [].forEach.call(top.querySelectorAll('[data-lpd-tab]'), function (b) { b.addEventListener('click', function () { tab(b.getAttribute('data-lpd-tab')); }); });
    /* حركة النسب: تتغير قيمها مع كل تاريخ ميلاد */
    function animate() {
      var fg = $('.lpd-d-fg', top); if (fg) requestAnimationFrame(function () { fg.style.strokeDashoffset = fg.getAttribute('data-off'); });
      [].forEach.call(top.querySelectorAll('.lpd-bar i'), function (i) { requestAnimationFrame(function () { i.style.width = i.getAttribute('data-w') + '%'; }); });
      [].forEach.call(top.querySelectorAll('[data-count]'), function (el) {
        var to = Number(el.getAttribute('data-count')), t0 = null;
        if (reduce) { el.textContent = to + '%'; return; }
        (function step(t) { if (t0 === null) t0 = t; var k = Math.min(1, (t - t0) / 1100); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + '%'; if (k < 1) requestAnimationFrame(step); })(performance.now());
      });
    }
    setTimeout(animate, reduce ? 0 : 350);
    top.addEventListener('click', function (e) { if (e.target.closest('.lpj-st')) tab('st'); });
    var ov = null, opener = null;
    var AQL = window.__aqLock = window.__aqLock || { s: {}, on: function (k) { this.s[k] = 1; document.documentElement.classList.add('aqm-sheet-open'); }, off: function (k) { delete this.s[k]; if (!Object.keys(this.s).length) document.documentElement.classList.remove('aqm-sheet-open'); } };
    function close() { if (!ov) return; ov.remove(); ov = null; AQL.off('lpj'); document.removeEventListener('keydown', onKey); if (opener) opener.focus({ preventScroll: true }); }
    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab' && ov) { var f = ov.querySelectorAll('button,a[href]'); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus({ preventScroll: true }); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus({ preventScroll: true }); } }
    }
    function open(i, btn) {
      close(); opener = btn;
      ov = document.createElement('div'); ov.className = 'lpj-ov open lpj';
      ov.innerHTML = '<div class="lpj-panel" role="dialog" aria-modal="true" aria-labelledby="lpj-panel-t">' + panelHTML(m, i) + '</div>';
      document.body.appendChild(ov); AQL.on('lpj');
      ov.addEventListener('click', function (e) { if (e.target === ov || e.target.closest('[data-lpj-close]')) close(); });
      document.addEventListener('keydown', onKey);
      var x = $('[data-lpj-close]', ov); if (x) x.focus({ preventScroll: true });
    }
    function interp() { var t = $('#lpj-interp', root); if (t) { t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); var d = root.querySelector('details.lp-section'); if (d) d.open = true; } }
    function onClick(e) {
      var b;
      if ((b = e.target.closest('.lpj-st,.lpj-row'))) { select(Number(b.getAttribute('data-i')), !!b.closest('.lpj-card')); return; }
      if ((b = e.target.closest('[data-lpj-open]'))) { open(Number(b.getAttribute('data-lpj-open')), b); return; }
      if (e.target.closest('[data-lpj-interp]')) { interp(); return; }
      if (e.target.closest('[data-lpj-edit]')) { var ed = $('#btn-edit-lp', root); if (ed) ed.click(); return; }
      if (e.target.closest('[data-lpj-back]')) { if (navCount > 0) history.back(); else location.hash = '#aqh-tools'; }
    }
    top.addEventListener('click', onClick);
    var bt = $('.lpj-bottom', root); if (bt) bt.addEventListener('click', onClick);
    top.addEventListener('keydown', function (e) {
      var b = e.target.closest('.lpj-st'); if (!b) return;
      var all = [].slice.call(top.querySelectorAll('.lpj-st')), i = all.indexOf(b), n = -1;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') n = i + 1; else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') n = i - 1;
      if (n >= 0 && n < all.length) { e.preventDefault(); all[n].focus({ preventScroll: true }); }
    });
  }

  function clean() { [].forEach.call(root.querySelectorAll(':scope > .lpj-top, :scope > .lpj-bottom'), function (n) { n.remove(); }); }
  function error(msg) {
    clean();
    var d = document.createElement('div'); d.className = 'lpj-top lpj';
    d.innerHTML = '<div class="lpj-err" role="alert"><p>تعذر تجهيز قراءة مسار الحياة حاليًا. حاول مرة أخرى.</p><button type="button" class="lpj-btn solid" data-retry><span>إعادة المحاولة</span></button></div>';
    root.prepend(d); d.querySelector('[data-retry]').addEventListener('click', function () { lastKey = ''; run(); });
  }
  function run() {
    if (building || root.hidden || !$('.numbadge', root)) return;
    var inp = readInputs(); if (!inp) return;
    var key = [inp.lp, inp.y, inp.m, inp.d, inp.name].join('|');
    if (root.querySelector(':scope > .lpj-top') && key === lastKey) return;
    building = true; lastKey = key; clean();
    var sk = document.createElement('div'); sk.className = 'lpj-top lpj'; sk.setAttribute('aria-busy', 'true'); sk.innerHTML = '<div class="lpj-skel"><i></i><i></i></div>'; root.prepend(sk);
    setTimeout(function () {
      try {
        if (!window.AqeqPinnaclesChallenges) throw new Error('engine');
        var m = build(inp); sk.remove();
        var topEl = document.createElement('div'); topEl.innerHTML = m.top; var t = topEl.firstChild; t.classList.add('lpj');
        var botEl = document.createElement('div'); botEl.innerHTML = m.bottom;
        root.prepend(t); root.appendChild(botEl.firstChild);
        wire(m);
      } catch (err) { if (window.console) console.warn('life-path-view', err && err.message); error(); }
      building = false;
    }, reduce ? 0 : 220);
  }
  var t0;
  new MutationObserver(function () { clearTimeout(t0); t0 = setTimeout(run, 40); }).observe(root, { childList: true });
  new MutationObserver(function () { clearTimeout(t0); t0 = setTimeout(run, 40); }).observe(root, { attributes: true, attributeFilter: ['hidden'] });
  run();
})();

;
/* assets/js/lp-accordion.js */
/* مسار الحياة وتوافق المسارات: طبقة عرض فقط — تحوّل أقسام النتائج إلى بطاقات أكورديون عاجية.
   لا تغيّر أي حساب ولا أي نص: تنقل العقد الموجودة داخل <details> وتضيف شريط رجوع. */
(function () {
  'use strict';
  var IC = {
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>'
  };
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function tone(title) { return /\(\+\)|النور|القوة|روشتة|الحل|نعمل إيه/.test(title) ? 'light' : /\(-\)|\(−\)|الظل|الصدام|الديون|فخ/.test(title) ? 'shadow' : ''; }
  function card(title, body, opt) {
    opt = opt || {};
    var d = document.createElement('details'); d.className = 'lpa-card' + (opt.tone ? ' is-' + opt.tone : ''); if (opt.open) d.open = true;
    var s = document.createElement('summary'); s.className = 'lpa-sum';
    s.innerHTML = '<span class="lpa-ic">' + (opt.tone === 'light' ? '+' : opt.tone === 'shadow' ? '−' : IC.star) + '</span><span class="lpa-t">' + esc(title) + '</span>' + (opt.sub ? '<small class="lpa-sub">' + esc(opt.sub) + '</small>' : '') + '<span class="lpa-chev">' + IC.chev + '</span>';
    var b = document.createElement('div'); b.className = 'lpa-body';
    [].concat(body).forEach(function (n) { if (n) b.appendChild(n); });
    d.appendChild(s); d.appendChild(b); return d;
  }
  function text(el) { return (el && el.textContent || '').replace(/\s+/g, ' ').trim(); }

  /* جدول الملخص (3 أعمدة ضيقة) ← بطاقات صفوف بعرض كامل */
  function tableToRows(tbl) {
    var heads = [].map.call(tbl.querySelectorAll('thead th'), text);
    var ul = document.createElement('div'); ul.className = 'lpa-rows';
    [].forEach.call(tbl.querySelectorAll('tbody tr'), function (tr) {
      var cells = [].map.call(tr.children, function (c) { return text(c); });
      var row = document.createElement('div'); row.className = 'lpa-row';
      row.innerHTML = '<b>' + esc(cells[0] || '') + '</b>' + cells.slice(1).map(function (c, i) { return '<p>' + (heads[i + 1] ? '<em>' + esc(heads[i + 1]) + '</em> ' : '') + esc(c) + '</p>'; }).join('');
      ul.appendChild(row);
    });
    return ul;
  }

  function navBar(root) {
    var host = root.querySelector('.lpj-top') || root;
    var n = document.createElement('div'); n.className = 'lpa-nav';
    n.innerHTML = '<button type="button" class="btn-edit-lp lpa-navbtn">' + IC.back + '<span>العودة لحاسبة مسار الحياة</span></button><a class="lpa-navbtn" href="#home">' + IC.back + '<span>الرئيسية</span></a>';
    host.insertBefore(n, host.firstChild);
  }

  function enhanceLP(root, force) {
    if (!root || root.querySelector('.lpa-nav') || !root.innerHTML.trim()) return;
    if (!force && !root.querySelector('.lpj-top')) { clearTimeout(enhanceLP._t); enhanceLP._t = setTimeout(function () { enhanceLP(root, true); }, 700); return; }
    navBar(root);
    /* الخريطة الأساسية: أربع ركائز */
    var grid = root.querySelector('.aq-lp-pillars-grid');
    if (grid) {
      var wrap = document.createElement('div'); wrap.className = 'lpa-stack';
      [].slice.call(grid.children).forEach(function (a, i) {
        var h = a.querySelector('h4'), t = text(h), p = h ? h.nextElementSibling : null;
        var body = document.createElement('div'); body.className = 'lpa-text'; body.innerHTML = p ? p.outerHTML : a.innerHTML;
        wrap.appendChild(card(t, body, { tone: tone(t), open: i === 0 }));
      });
      grid.replaceWith(wrap);
    }
    var cheat = root.querySelector('.aqm-cheat-sheet');
    if (cheat) { var tb = cheat.querySelector('table'), hh = cheat.querySelector('h4'); cheat.replaceWith(card(text(hh) || 'ملخص سريع', tb ? tableToRows(tb) : cheat.cloneNode(true))); }
    var proto = root.querySelector('.aqm-protocol-box');
    if (proto) { var ph = proto.querySelector('h4'), ol = proto.querySelector('ol'); proto.replaceWith(card(text(ph) || 'خريطة التحول العملي', ol ? ol : proto.cloneNode(true), { tone: 'light' })); }
    /* القمم والتحديات والديون الكارمية */
    var pc = root.querySelector('.aqeq-pc-wrap');
    if (pc) {
      var kids = [].slice.call(pc.children), cur = null, out = [];
      kids.forEach(function (k) {
        if (k.classList.contains('aqeq-pc-heading')) { cur = { t: text(k.querySelector('h3') || k), nodes: [] }; out.push(cur); }
        else if (cur && !k.classList.contains('aqeq-pc-note')) cur.nodes.push(k);
        else if (!cur) out.push({ keep: k });
        else out.push({ keep: k });
      });
      pc.innerHTML = '';
      pc.classList.add('lpa-stack');
      out.forEach(function (o, i) { pc.appendChild(o.keep ? o.keep : card(o.t, o.nodes, { tone: tone(o.t), open: i === 0 })); });
    }
    /* الفصول السبعة: details موجودة، نوحّد شكلها */
    var secs = [].slice.call(root.querySelectorAll('details.lp-section'));
    secs.forEach(function (d, i) {
      d.classList.add('lpa-card', 'lpa-native');
      /* شارة مجاني / قراءة متعمقة بدل الوسوم النصية في العنوان (عرض فقط) */
      var b = d.querySelector('.lp-sec-title b'), sm = d.querySelector('.lp-sec-title small');
      if (b && !b.querySelector('.lpa-badge')) {
        var t = b.textContent, free = /مجاني|متاح بالكامل/.test(t + ' ' + (sm ? sm.textContent : '')) && !/مدفوع/.test(t);
        b.textContent = t.replace(/\s*[—–-]\s*(مجاني|مدفوع[^\]]*)\s*$/, '').replace(/\s*\[[^\]]*\]\s*$/, '');
        var bd = document.createElement('span'); bd.className = 'lpa-badge ' + (free ? 'is-free' : 'is-deep');
        bd.innerHTML = free ? 'متاح مجاناً' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>قراءة متعمقة';
        b.appendChild(document.createTextNode(' ')); b.appendChild(bd);
      }
      d.open = i === 0;
    });
  }

  function watch(el, fn) {
    if (!el) return; var q = false;
    new MutationObserver(function () { if (q) return; q = true; requestAnimationFrame(function () { q = false; fn(el); }); }).observe(el, { childList: true, attributes: true, attributeFilter: ['hidden'] });
    fn(el);
  }
  function init() {
    watch(document.getElementById('lpresult'), enhanceLP);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

;
/* assets/js/lifepath-chapters.js */
/* مسار الحياة: صفوف خفيفة بأيقونات زجاجية تفتح نافذة سفلية بدل الأكورديون الطويل.
   عرض فقط: يقرأ أقسام النتيجة الموجودة ولا يغيّر أي حساب أو نص. */
(function () {
  'use strict';
  var res = document.getElementById('lpresult');
  if (!res) return;
  var root = document.documentElement, sheet = null, list = [], cur = -1, busy = false, closeT = 0;
  var AQL = window.__aqLock = window.__aqLock || { s: {}, on: function (k) { this.s[k] = 1; document.documentElement.classList.add('aqm-sheet-open'); }, off: function (k) { delete this.s[k]; if (!Object.keys(this.s).length) document.documentElement.classList.remove('aqm-sheet-open'); } };
  function lpNum() { var b = document.querySelector('#lpresult .numbadge'), n = b ? parseInt(b.textContent, 10) : 0; return n > 0 ? String(n) : ''; }
  function paintBadge(s) { var el = s.querySelector('.lp-hbadge'); if (!el) return; var n = lpNum(); el.textContent = n; el.hidden = !n; if (n) el.setAttribute('aria-label', 'رقم مسار حياتك ' + n); }

  function sv(d, w) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.6) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var IC = {
    gem: sv('<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9 3l3 6 3-6M12 21 9 9M12 21l3-12"/>'),
    sun: sv('<circle cx="12" cy="12" r="4"/><path d="M12 3v2.500M12 18.500V21M3 12h2.500M18.500 12H21M5.600 5.600l1.800 1.800M16.600 16.600l1.800 1.800M5.600 18.400l1.800-1.800M16.600 7.400l1.800-1.800"/>'),
    moon: sv('<path d="M20 14.500A8 8 0 0 1 9.500 4a8 8 0 1 0 10.500 10.500z"/><path d="M17 3v3M15.500 4.500h3"/>'),
    body: sv('<circle cx="12" cy="5" r="2.500"/><path d="M5 10.500c2.500 1.200 4.500 1.700 7 1.700s4.500-.5 7-1.700M12 12.200V16M9 21l3-5 3 5"/>'),
    scale: sv('<path d="M12 3v18M7 21h10M5 7h14"/><path d="M5 7 2.500 13a3 3 0 0 0 5 0zM19 7l-2.500 6a3 3 0 0 0 5 0z"/>'),
    route: sv('<circle cx="6" cy="19" r="2.200"/><circle cx="18" cy="5" r="2.200"/><path d="M6 16.800V14a4 4 0 0 1 4-4h4a4 4 0 0 0 4-4V7.200"/>'),
    mirror: sv('<path d="M12 4v16"/><path d="M4 6.500c3-1.800 6-1.200 8 .8 2-2 5-2.600 8-.8v10c-3-1.800-6-1.200-8 .8-2-2-5-2.600-8-.8z"/>'),
    blocks: sv('<path d="M3.500 15.500h7v5h-7zM13.500 15.500h7v5h-7zM8.500 9.500h7v5h-7z"/><path d="M12 3v3.500M9.500 4.500 12 6.500l2.500-2"/>'),
    heart: sv('<path d="M12 20s-7.500-4.600-7.500-10.200A4.200 4.200 0 0 1 12 7.300a4.200 4.200 0 0 1 7.500 2.500C19.500 15.400 12 20 12 20z"/><path d="M7.500 12.500h2l1.200-2.200 1.800 4 1.200-1.800h2"/>'),
    coin: sv('<circle cx="12" cy="12" r="8.500"/><path d="M12 7v10M14.600 9.200c-.6-.8-1.500-1.200-2.600-1.200-1.500 0-2.600.8-2.600 2s1 1.700 2.600 2 2.600.8 2.600 2-1.100 2-2.600 2c-1.200 0-2.100-.5-2.700-1.300"/>'),
    sprout: sv('<path d="M12 21v-9.500"/><path d="M12 11.500c0-4 3-6.500 7.500-6.500 0 4-2.500 7-7.500 6.500zM12 14.500c0-3-2-5-6.500-5 0 3 2 5.500 6.500 5z"/>'),
    child: sv('<circle cx="12" cy="8.500" r="3.500"/><path d="M5 21c0-4 3-6.500 7-6.500s7 2.500 7 6.500"/><path d="M18.500 2.500l.7 1.800 1.800.7-1.800.7-.7 1.800-.7-1.800L16 5l1.800-.7z"/>'),
    core: sv('<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="4.500"/><path d="M12 3.500v2M12 18.500v2M3.500 12h2M18.500 12h2"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'),
    chev: sv('<path d="M15 6l-6 6 6 6"/>', 2),
    next: sv('<path d="M19 12H5M11 6l-6 6 6 6"/>', 2)
  };

  /* المفتاح: كلمات من العنوان؛ القيمة: [أيقونة، وصف قصير، لون] */
  var MAP = [
    [/المراية|القناع/, 'mirror', 'صورتك أمام الناس وما تخفيه عنهم', 2],
    [/البلوكات|التعطيل/, 'blocks', 'ما يعطّلك وكيف تتعامل معه', 4],
    [/العاطفي|الجواز|العلاقات/, 'heart', 'احتياجك في القرب والحب والشراكة', 1],
    [/المال|الوفرة|المهنة/, 'coin', 'علاقتك بالرزق والعمل والفرص', 3],
    [/روشتة|التشافي/, 'sprout', 'خطوات صغيرة تبدأ بها هذا الأسبوع', 2],
    [/الطفولة|الطفل|الأطفال/, 'child', 'جذور الطفولة وعلاقتك بأطفالك', 4],
    [/شفرة الروح/, 'core', 'هويتك العميقة وما جئت لتفعله', 1],
    [/الجوهر|الرسالة/, 'gem', 'هويتك العميقة ورسالتك الأساسية', 1],
    [/النور|القوة/, 'sun', 'مواهبك حين تكون متزنًا', 3],
    [/الجسدية|السوماتيك/, 'body', 'كيف يعبّر جسدك عن حالتك', 2],
    [/المقارنة|الاتزان/, 'scale', 'الفرق بين حالة الاتزان وحالة الضغط', 3],
    [/الظل|التحدي المتكرر/, 'moon', 'النمط الذي يتكرر حين تتعب', 4],
    [/التحول|الحلول|التحديات/, 'route', 'من التحدي إلى الخطوة العملية', 1]
  ];
  function meta(title) {
    for (var i = 0; i < MAP.length; i++) if (MAP[i][0].test(title)) return MAP[i];
    return [null, 'gem', 'افتح لتقرأ التفاصيل', 1];
  }

  function titleOf(d) {
    var b = d.querySelector('.lp-sec-title b, .lpa-t');
    if (!b) return '';
    var t = '';
    for (var n = b.firstChild; n; n = n.nextSibling) if (n.nodeType === 3) t += n.nodeValue;
    return t.replace(/\s+/g, ' ').replace(/\s*\((?:[A-Za-z][^)]*)\)\s*/g, ' ').trim();
  }
  function bodyOf(d) { return d.querySelector(':scope > .lp-sec-body, :scope > .lpa-body'); }

  function scan() {
    var cards = [].slice.call(res.querySelectorAll('.aq-lp-blueprint-summary details.lpa-card, .lp-sections details.lp-section'));
    var k = 0;
    cards.forEach(function (d) {
      var sm = d.querySelector(':scope > summary');
      if (!sm) return;
      if (!d.getAttribute('data-lpc')) {
        var t = titleOf(d), m = meta(t);
        d.setAttribute('data-lpc', '1'); d.open = false; d.classList.add('lpc-row');
        d.setAttribute('data-lpc-title', t); d.setAttribute('data-lpc-ic', m[1]); d.setAttribute('data-lpc-sub', m[2]); d.setAttribute('data-lpc-c', m[3]);
        sm.innerHTML = '<span class="lpc-ic c' + m[3] + '">' + IC[m[1]] + '</span><span class="lpc-tx"><b>' + esc(t) + '</b><small>' + esc(m[2]) + '</small></span><span class="lpc-go">' + IC.chev + '</span>';
        d.style.setProperty('--i', k);
      }
      k++;
    });
    list = cards.filter(function (d) { return d.getAttribute('data-lpc'); });
  }

  /* ---------- النافذة ---------- */
  function ensure() {
    if (sheet) return sheet;
    sheet = document.createElement('div'); sheet.className = 'aqm-sheet swp-sheet lpc-sheet'; sheet.hidden = true;
    sheet.innerHTML = '<div class="aqm-sheet-scrim" data-lpc-close></div>' +
      '<div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="lpc-title">' +
      '<span class="aqm-sheet-grip" aria-hidden="true"></span>' +
      '<button type="button" class="aqm-sheet-x" data-lpc-close aria-label="إغلاق"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="lpc-head"><span class="lpc-hic"></span><div><small class="lpc-count"></small><span class="lp-hbadge" hidden></span><h3 id="lpc-title"></h3><p class="lpc-hsub"></p></div></div>' +
      '<div class="aqm-sheet-body lpc-body"></div>' +
      '<div class="aqm-sheet-foot"><button type="button" class="aqm-foot-close" data-lpc-close>إغلاق</button>' +
      '<button type="button" class="aqm-foot-next" data-lpc-next><span class="aqm-foot-l"><small>التالي</small><b></b></span>' + IC.next + '</button></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-lpc-close]')) { close(); return; }
      if (e.target.closest('[data-lpc-next]')) { show(cur + 1, true); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet && !sheet.hidden) close(); });
    return sheet;
  }

  /* تنسيق النص داخل النافذة: عناوين، أسئلة، بطاقات للنقاط — بدون تغيير الكلام */
  function decorate(body) {
    var ps = [].slice.call(body.querySelectorAll(':scope > p'));
    ps.forEach(function (p, idx) {
      var h = p.innerHTML, t = p.textContent.trim();
      if (!t) { p.remove(); return; }
      if (/^سؤال للتأمل/.test(t)) { p.className = 'lpc-reflect'; p.innerHTML = '<b>سؤال للتأمل</b><span>' + esc(t.replace(/^سؤال للتأمل\s*[:：]?\s*/, '')) + '</span>'; return; }
      if (/^تذكير\s*[:：]/.test(t)) { p.className = 'lpc-remind'; p.textContent = t.replace(/^تذكير\s*[:：]\s*/, ''); return; }
      if (/^\(?لمن مجموع|^\(لمن/.test(t)) { p.className = 'lpc-aside'; return; }
      if (h.indexOf('<br>') > -1 && /(^|<br>)\s*-\s/.test(h)) {
        var lines = h.split('<br>'), out = '', ul = '';
        lines.forEach(function (ln) {
          var d = /^\s*-\s+/.test(ln);
          if (d) ul += '<li>' + ln.replace(/^\s*-\s+/, '') + '</li>';
          else { if (ul) { out += '<ul>' + ul + '</ul>'; ul = ''; } if (ln.trim()) out += (ln.length < 130 && /[:：]\s*$/.test(ln.trim())) ? '<h4 class="lpc-h lpc-h2">' + ln.replace(/\s*[:：]\s*$/, '') + '</h4>' : '<p>' + ln + '</p>'; }
        });
        if (ul) out += '<ul>' + ul + '</ul>';
        p.outerHTML = out; return;
      }
      if (h.indexOf('<br>') > -1) {
        var parts = h.split('<br>'), first = parts.shift();
        var bullet = /^\s*[•\-]\s*/.test(first);
        if (idx === 0 && !bullet) {
          p.outerHTML = '<div class="lpc-lead"><b>' + first + '</b></div><p>' + parts.join(' ') + '</p>';
        } else if (bullet) {
          p.outerHTML = '<div class="lpc-pt"><b>' + first.replace(/^\s*[•\-]\s*/, '').replace(/\s*[:：]\s*$/, '') + '</b><p>' + parts.join('<br>') + '</p></div>';
        } else {
          p.outerHTML = '<h4 class="lpc-h">' + first.replace(/\s*[:：]\s*$/, '') + '</h4><p>' + parts.join('<br>') + '</p>';
        }
        return;
      }
      if (/^[•\-]\s*/.test(t) && t.length < 140 && /[:：]\s*$/.test(t)) { p.outerHTML = '<h4 class="lpc-h lpc-h2">' + p.innerHTML.replace(/^\s*[•\-]\s*/, '').replace(/\s*[:：]\s*$/, '') + '</h4>'; return; }
      if (t.length < 130 && /[:：]\s*$/.test(t)) { p.outerHTML = '<h4 class="lpc-h">' + p.innerHTML.replace(/\s*[:：]\s*$/, '') + '</h4>'; return; }
    });
    [].forEach.call(body.querySelectorAll('li'), function (li) {
      var m = li.innerHTML.match(/^([^:<]{2,38}):\s*([\s\S]*)$/);
      if (m && m[2]) li.innerHTML = '<b class="lpc-k">' + m[1] + '</b> ' + m[2];
    });
  }

  function fill(i) {
    var d = list[i]; if (!d) return false;
    var s = ensure(), b = bodyOf(d);
    var grp = d.closest('.lp-sections') ? list.filter(function (x) { return x.closest('.lp-sections'); }) : list.filter(function (x) { return !x.closest('.lp-sections'); });
    var gi = grp.indexOf(d) + 1;
    s.querySelector('.lpc-hic').className = 'lpc-hic lpc-ic c' + d.getAttribute('data-lpc-c');
    s.querySelector('.lpc-hic').innerHTML = IC[d.getAttribute('data-lpc-ic')];
    s.querySelector('.lpc-count').textContent = (d.closest('.lp-sections') ? 'الفصل ' : 'المحور ') + gi + ' من ' + grp.length;
    s.querySelector('#lpc-title').textContent = d.getAttribute('data-lpc-title');
    s.querySelector('.lpc-hsub').textContent = d.getAttribute('data-lpc-sub');
    var body = s.querySelector('.lpc-body'); body.innerHTML = b ? b.innerHTML : ''; body.scrollTop = 0;
    body.querySelectorAll('details').forEach(function (x) { x.open = true; });
    decorate(body);
    var nx = list[i + 1], btn = s.querySelector('[data-lpc-next]');
    btn.hidden = !nx; if (nx) btn.querySelector('b').textContent = nx.getAttribute('data-lpc-title');
    cur = i; return true;
  }
  function show(i, swap) {
    if (busy) return;
    var s = ensure();
    if (swap && !s.hidden) {
      busy = true; s.classList.add('is-swap');
      setTimeout(function () { fill(i); s.querySelector('.lpc-body').scrollTop = 0; s.classList.remove('is-swap'); busy = false; }, 160);
      return;
    }
    if (!fill(i)) return;
    clearTimeout(closeT); s.classList.remove('is-closing'); s.hidden = false; AQL.on('lpc'); paintBadge(s);
    s.querySelector('.lpc-body').scrollTop = 0;
  }
  function close() {
    if (!sheet || sheet.hidden) return;
    var s = sheet; s.classList.add('is-closing');
    clearTimeout(closeT); closeT = setTimeout(function () { s.hidden = true; s.classList.remove('is-closing'); AQL.off('lpc'); }, 230);
  }

  res.addEventListener('click', function (e) {
    var sm = e.target.closest('details.lpc-row > summary'); if (!sm) return;
    e.preventDefault();
    var d = sm.parentNode; scan(); var i = list.indexOf(d); if (i < 0) return;
    d.classList.add('is-tap'); setTimeout(function () { d.classList.remove('is-tap'); }, 220);
    show(i);
  }, true);

  var q;
  new MutationObserver(function () { clearTimeout(q); q = setTimeout(scan, 80); }).observe(res, { childList: true, subtree: true });
  scan();
})();

;
/* assets/js/site-pages.js */
/* صفحات الموقع: عن عقيق، الشروط، الخصوصية، إخلاء المسؤولية، تواصل. تُضاف كأقسام عادية بالـ hash وتُربط بالقائمة الجانبية والفوتر. */
(function () {
  'use strict';
  var WA = 'https://wa.me/message/BWFSU4ZT25WKA1';
  function P(a) { return a.map(function (t) { return '<p>' + t + '</p>'; }).join(''); }
  function S(h, a) { return '<h2>' + h + '</h2>' + P(a); }
  var PAGES = {
    about: { t: 'عن عقيق', sub: 'من نحن، ولماذا بنينا هذا المكان', ic: '<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M12 11v5"/>',
      b: S('البداية', ['عقيق أسترو مساحة عربية صغيرة بنيناها لتقرأ نفسك بهدوء. فيها خريطة ميلادك، ومصفوفة القدر، ومسار الحياة، وتوافق العلاقات، والسماء كما هي الآن.', 'مش وعد بالمستقبل، ولا حكم عليك. هي مرآة تساعدك تلاحظ ما تعرفه عن نفسك أصلًا، لكن بلغة أقرب.'])
        + S('كيف نكتب', ['نكتب بصوت واحد هادئ، يخاطبك مباشرة، ويقول الصورة كاملة بدون تجميل وبدون تخويف. بعض الصفحات دافئة وتدعوك للدخول، وبعضها أعمق وأصرح لأن الموضوع نفسه يستحق ذلك.', 'كل النصوص كُتبت وراجعتها يد بشرية، وتُحدَّث باستمرار.'])
        + S('ما نعتمد عليه', ['حسابات الكواكب تُجرى على بيانات فلكية دقيقة في جهازك مباشرة. المصفوفة والأرقام تتبع طرقًا معروفة ومكتوبة بوضوح. وما نقدمه من معانٍ هو تفسير، والتفسير يختلف من مدرسة لأخرى.', 'نستخدم النظام الغربي المداري في الخريطة الأساسية، ونعرض النظام الفيدي النجمي كطريقة ثانية لمن يريد المقارنة.']) },
    terms: { t: 'شروط الاستخدام', sub: 'باختصار وبوضوح', ic: '<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4M10 12h6M10 16h6"/>',
      b: S('الموافقة', ['باستخدامك للموقع فأنت توافق على هذه الشروط. إن لم توافق عليها فنرجو ألا تستخدم الموقع.'])
        + S('طبيعة الخدمة', ['كل ما في الموقع من قراءات وتفسيرات وتوقعات هو محتوى للتأمل ومعرفة النفس والترفيه. لا يُقصد به أن يكون نصيحة طبية أو نفسية أو قانونية أو مالية، ولا يضمن حدوث شيء.', 'قراءة رمزية للتأمل والوعي بالنفس، مش تنبؤ قاطع ومش بديل عن استشارة مختصة.', 'قراراتك الكبيرة مسؤوليتك أنت، ويُستحسن أن تستشير مختصًا مرخصًا فيها.'])
        + S('دقة البيانات', ['النتائج تعتمد على ما تدخله من تاريخ ووقت ومكان. أي خطأ فيها يغيّر القراءة. ووقت الميلاد غير المعروف يحدّ من دقة الطالع والبيوت، وسنشير لذلك حين يحدث.'])
        + S('حقوق المحتوى', ['النصوص والقراءات والتصاميم والحسابات ملك لعقيق أسترو. يمكنك استخدام ما تحصل عليه لنفسك. ويمنع نسخ المحتوى أو إعادة نشره أو بيعه أو استخدامه في تطبيق أو موقع آخر بدون إذن كتابي.'])
        + S('الاستخدام المقبول', ['لا تستخدم الموقع لإيذاء أحد أو انتحال شخصية أو محاولة اختراق أو سحب محتواه آليًا. ولا تُدخل بيانات شخص آخر دون علمه إذا كان ذلك قد يضره.'])
        + S('الخدمات المدفوعة', ['بعض الخدمات والمحتويات مدفوعة، وتُسدَّد بالطريقة الموضحة في صفحة الدفع. الخدمات الرقمية لا تُستردّ بعد تسليمها، إلا إذا حدث خطأ تقني منّا فنصلحه أو نرد المبلغ حسب الحالة.'])
        + S('حدود المسؤولية', ['نقدّم الموقع كما هو، ونبذل جهدنا في دقته واستمراره، لكننا لا نضمن خلوّه من الأخطاء أو انقطاعه. ولا نتحمل مسؤولية أي قرار أو خسارة تنتج عن الاعتماد على محتواه، بالقدر الذي يسمح به القانون.'])
        + S('التعديل', ['قد نحدّث هذه الشروط من وقت لآخر. استمرارك في الاستخدام بعد التحديث يعني موافقتك عليه. آخر تحديث: نوفمبر 2026.']) },
    privacy: { t: 'سياسة الخصوصية', sub: 'ماذا نحفظ، وأين', ic: '<path d="M12 3l7 3v5c0 5-3 8.500-7 10-4-1.500-7-5-7-10V6z"/><path d="M9.500 12l2 2 3.500-4"/>',
      b: S('بدون حساب', ['تاريخ الميلاد ووقته ومكانه واسمك وجنسك تُستخدم لحساب قراءتك داخل جهازك. نحفظها في متصفحك لتسهّل عليك المرة القادمة، ولا تُرسل لنا.', 'تقدر تمسحها في أي وقت من إعدادات المتصفح.'])
        + S('مع الحساب', ['إذا أنشأت حسابًا نحفظ بريدك وبيانات ملفك التي تختار أن تحفظها، وصورتك إن رفعتها، وما تشتريه أو ترسله كإثبات دفع وما يخص طلباتك. تُخزَّن عند مزوّد خدمات سحابي موثوق، ولا يطّلع عليها إلا القائمون على الموقع بقدر حاجة الخدمة.', 'تقدر تطلب حذف حسابك وبياناتك في أي وقت عبر صفحة التواصل.'])
        + S('النشرة', ['إذا اشتركت في النشرة نستخدم بريدك لإرسال جديد الموقع فقط، وتقدر تلغي الاشتراك متى شئت.'])
        + S('ما لا نفعله', ['لا نبيع بياناتك ولا نشاركها لأغراض إعلانية، ولا نطلب منك رقم بطاقة داخل الموقع، والدفع يتم بالطريقة الموضحة في صفحة الدفع.'])
        + S('خدمات خارجية', ['يحمّل الموقع خطوطه من خدمة Google Fonts، وقد تصل لها عنوان الـIP الخاص بك كأي موقع يستخدم خطوطًا خارجية. وعند ضغطك على رابط واتساب تنتقل إلى خدماتهم وتخضع لسياساتهم.'])
        + S('طفل أو قاصر', ['الموقع موجّه للبالغين. إن كنت أقل من 18 سنة فاستخدمه بعلم ولي أمرك.'])
        + S('حقوقك', ['تقدر تطلب منا أي توضيح عن بياناتك، أو تعديلها، أو حذفها عبر صفحة التواصل.'])
        + S('تحديثات', ['إذا تغيّرت طريقة التعامل مع البيانات سنكتب ذلك هنا. آخر تحديث: نوفمبر 2026.']) },
    disclaimer: { t: 'إخلاء المسؤولية', sub: 'أهم ما يجب أن تعرفه', ic: '<path d="M12 3l9.500 17h-19z"/><path d="M12 10v4M12 17v.01"/>',
      b: S('للتأمل لا للحكم', ['عقيق أسترو يقدّم الفلك والأرقام والرموز كلغة لقراءة الذات. هذه ليست علومًا تجريبية مثبتة، وما فيها تفسير واجتهاد وليس يقينًا.'])
        + S('ليس بديلًا عن المختصين', ['لا يغني الموقع عن الطبيب أو المعالج النفسي أو المحامي أو المستشار المالي. إن كنت تمر بأزمة نفسية أو صحية أو قانونية أو مالية فتواصل مع مختص أو مع الجهات الرسمية في بلدك.'])
        + S('لا تقرارات مصيرية بناءً عليه', ['لا تترك وظيفة، ولا تنهِ علاقة، ولا تستثمر مالًا، ولا توقف علاجًا بسبب قراءة هنا. اجعلها فكرة تفكر فيها، لا أمرًا تنفّذه.'])
        + S('التوقعات', ['التوقعات الزمنية، مثل العبور والعودة الشمسية والداشا، تصف مناخًا عامًا لا أحداثًا محددة. تتأثر حياتك بقراراتك وظروفك قبل أي كوكب.'])
        + S('المسؤولية', ['باستخدامك للموقع فأنت تقرّ بأنك مسؤول عن تفسيرك للمحتوى وعن أي قرار تتخذه، وأن عقيق وصاحبها غير مسؤولين عن أي ضرر مباشر أو غير مباشر ناتج عن ذلك، بالقدر الذي يسمح به القانون.']) },
    contact: { t: 'تواصل معنا', sub: 'نرد عليك بنفسنا', ic: '<path d="M4 5h16v11H9l-5 4z"/>',
      b: S('اكتب لنا', ['لو عندك سؤال عن قراءة، أو ملاحظة على نص، أو مشكلة تقنية، أو طلب خاص، راسلنا على واتساب وسنرد عليك في أقرب وقت. والبريد الرسمي للمنصة قريبًا هنا.', '<a class="sp-btn" href="' + WA + '" target="_blank" rel="noopener">راسلنا على واتساب</a>']) }
  };
  var LINKS = [['about', 'عن عقيق'], ['contact', 'تواصل معنا'], ['terms', 'شروط الاستخدام'], ['privacy', 'سياسة الخصوصية'], ['disclaimer', 'إخلاء المسؤولية']];
  function svg(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }
  function nav(cur) {
    return '<nav class="sp-nav" aria-label="صفحات الموقع">' + LINKS.map(function (l) { return '<a href="#' + l[0] + '"' + (l[0] === cur ? ' class="on"' : '') + '>' + l[1] + '</a>'; }).join('') + '</nav>';
  }
  function build() {
    var main = document.querySelector('main'); if (!main) return;
    Object.keys(PAGES).forEach(function (k) {
      if (document.getElementById(k)) return;
      var d = PAGES[k], s = document.createElement('section');
      s.className = 'sec sp-page'; s.id = k; s.setAttribute('dir', 'rtl');
      s.innerHTML = '<div class="wrap sp-wrap"><a class="sp-back" href="#home">' + svg('<path d="M9 6l6 6-6 6"/>') + '<span>الرئيسية</span></a>'
        + '<header class="sp-head"><span class="sp-ic">' + svg(d.ic) + '</span><h1>' + d.t + '</h1><p>' + d.sub + '</p></header>'
        + '<article class="sp-body">' + d.b + '</article>' + nav(k) + '</div>';
      var x = document.createElement('button'); x.type = 'button'; x.className = 'sp-x'; x.setAttribute('aria-label', 'إغلاق');
      x.innerHTML = svg('<path d="M6 6l12 12M18 6L6 18"/>');
      x.addEventListener('click', function () { if (window.__spNav) history.back(); else location.hash = '#home'; });
      s.insertBefore(x, s.firstChild);
      (/^(terms|privacy|disclaimer)$/.test(k) ? document.body : main).appendChild(s);
    });
    window.addEventListener('hashchange', function () { window.__spNav = true; });
    var fn = document.querySelector('.fc-foot nav');
    [].forEach.call(document.querySelectorAll('[data-fc-legal]'), function (a) {
      var k = a.getAttribute('data-fc-legal'); a.removeAttribute('data-fc-legal'); a.setAttribute('href', '#' + k);
    });
    var f = document.querySelector('body > footer.foot .wrap');
    if (f && !f.querySelector('.sp-foot')) {
      var n = document.createElement('nav'); n.className = 'sp-foot'; n.setAttribute('aria-label', 'صفحات الموقع');
      n.innerHTML = LINKS.map(function (l) { return '<a href="#' + l[0] + '">' + l[1] + '</a>'; }).join('');
      var host = f.querySelector('.foot-card') || f, dis = f.querySelector('.foot-dis'); host.insertBefore(n, host === f ? (dis || null) : null);
    }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-am]'); if (!a) return;
    var m = a.getAttribute('data-am'), n = 0;
    var t = setInterval(function () { var b = document.querySelector('[data-eam-mode="' + m + '"]'); if (b) { b.click(); clearInterval(t); } else if (++n > 20) clearInterval(t); }, 150);
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();

;
/* assets/js/autofill-bars.js */
/* شريط "تعبئة تلقائية من حسابي" موحّد لنماذج 2027 والذيل الكارمي والخرائط المتقدمة. شكل فقط، لا يغيّر الحساب. */
(function () {
  'use strict';
  var CFG = [
    { form: 'y27-form', date: 'y27-date', time: 'y27-time', unk: 'y27-unknown', city: 'y27-city', name: 'y27-name' },
    { form: 'kt-form', date: 'kt-date', name: 'kt-name' },
    { form: 'eam-form', click: 'eam-b-fill' },
    { form: 'cp-form', outside: true, date: 'cp1-date', time: 'cp1-time', unk: 'cp1-unknown', city: 'cp1-city', name: 'cp1-name' },
    { form: 'synastry-form', date: 'syn-date-a', name: 'syn-name-a' },
    { form: 'mxm-pair-form', date: 'mxm-d1', name: 'mxm-n1' },
    { form: 'mxc-form', date: 'mxc-d1', name: 'mxc-n1' }
  ];
  function ctx() { return window.AqeeqChartContext; }
  function fire(el) { ['input', 'change'].forEach(function (t) { el.dispatchEvent(new Event(t, { bubbles: true })); }); }
  function fill(c, note) {
    var n = ctx() && ctx().getOrPrefill && ctx().getOrPrefill();
    if (!n) { note.textContent = 'احفظ تاريخ ميلادك أولًا في «حسابي» أو اكتبه هنا.'; return; }
    var p = function (x) { return String(x).padStart(2, '0'); }, g = function (id) { return id && document.getElementById(id); };
    var d = g(c.date); if (d) { d.value = n.y + '-' + p(n.m) + '-' + p(n.d); fire(d); }
    var u = g(c.unk), t = g(c.time);
    if (u) { u.checked = !n.known; fire(u); }
    if (t) { t.value = n.known ? p(n.hh) + ':' + p(n.mm) : ''; fire(t); }
    var ct = g(c.city); if (ct && ctx().cityIndexByName) { var i = ctx().cityIndexByName(n.placeName); if (i >= 0) { ct.value = String(i); fire(ct); } }
    var nm = g(c.name); if (nm && n.name && !nm.value) nm.value = n.name;
    note.textContent = 'تمت التعبئة من بياناتك المحفوظة.';
  }
  function build() {
    CFG.forEach(function (c) {
      var f = document.getElementById(c.form); if (!f || f.querySelector('.aq-autofill-bar') || (f.previousElementSibling && f.previousElementSibling.classList.contains('aq-autofill-bar'))) return;
      var bar = document.createElement('div'); bar.className = 'aq-autofill-bar';
      bar.innerHTML = '<span>استخدام بيانات الميلاد المحفوظة في ملفك الشخصي<small class="aq-af-note" role="status"></small></span><button type="button" class="aq-autofill-btn">تعبئة تلقائية من حسابي</button>';
      var note = bar.querySelector('.aq-af-note');
      bar.querySelector('button').addEventListener('click', function () {
        if (c.click) { var b = document.getElementById(c.click); if (b) b.click(); } else fill(c, note);
      });
      if (c.outside) { bar.classList.add('aq-af-out'); f.parentNode.insertBefore(bar, f); } else f.insertBefore(bar, f.firstChild);
    });
  }
  window.AqAutofillBuild = build;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();

;
/* assets/js/compat-polish.js */
/* شكل فقط: أيقونات الحقول + تعبئة تلقائية لنماذج التوافقات، بنفس أسلوب مسار الحياة. لا يغيّر الحساب. */
(function () {
  'use strict';
  var S = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
  var IC = {
    person: '<svg ' + S + '><circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c.9-3.6 3.6-5.4 7-5.4s6.1 1.8 7 5.4"/></svg>',
    cal: '<svg ' + S + '><rect x="4" y="5.5" width="16" height="14" rx="2.5"/><path d="M8 3.5v4M16 3.5v4M4 10h16"/></svg>',
    clock: '<svg ' + S + '><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    sliders: '<svg ' + S + '><path d="M5 8h9M18 8h1M5 16h1M10 16h9"/><circle cx="16" cy="8" r="2"/><circle cx="8" cy="16" r="2"/></svg>',
    pin: '<svg ' + S + '><path d="M12 21s6-5.6 6-10.5A6 6 0 0 0 6 10.5C6 15.400 12 21 12 21z"/><circle cx="12" cy="10.500" r="2.200"/></svg>',
    link: '<svg ' + S + '><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg>'
  };
  function pick(inp) {
    if (!inp) return IC.person;
    var id = inp.id || '', t = inp.type || '';
    if (t === 'date') return IC.cal;
    if (t === 'time') return IC.clock;
    if (/city|manual|lat|lon|off/.test(id)) return IC.pin;
    if (/type|rel/.test(id)) return IC.link;
    if (inp.tagName === 'SELECT') return IC.sliders;
    return IC.person;
  }
  function icons(form) {
    [].forEach.call(form.querySelectorAll('.field'), function (f) {
      var l = f.querySelector(':scope > label'); if (!l || l.querySelector('.mxp-fi')) return;
      var inp = f.querySelector('input,select'); var s = document.createElement('span');
      s.className = 'mxp-fi'; s.setAttribute('aria-hidden', 'true'); s.innerHTML = pick(inp);
      l.insertBefore(s, l.firstChild);
      if (!l.querySelector('span:not(.mxp-fi)')) { var t = document.createElement('span'); t.innerHTML = l.childNodes[1] ? '' : ''; }
    });
  }
  function wrapLabelText(form) {
    [].forEach.call(form.querySelectorAll('.field > label'), function (l) {
      [].slice.call(l.childNodes).forEach(function (n) { if (n.nodeType === 3 && n.textContent.trim()) { var s = document.createElement('span'); s.textContent = n.textContent.trim(); l.replaceChild(s, n); } });
    });
  }
  function collapse(fs) {
    if (fs.querySelector('.cp-more')) return;
    var id = (fs.querySelector('input[type=date]') || {}).id || ''; var pre = id.split('-')[0];
    var g = function (x) { return document.getElementById(pre + '-' + x); };
    var up = function (el, sel) { return el && el.closest(sel); };
    var timeF = up(g('time'), '.field'), chk = up(g('unknown'), 'label.chk'), note = fs.querySelector('.cp-note'),
        cityF = up(g('city'), '.field'), man = g('manual');
    if (!timeF || !cityF) return;
    var d = document.createElement('details'); d.className = 'cp-more';
    d.innerHTML = '<summary>وقت ومكان الميلاد <small>(اضغط لإدخال الوقت)</small></summary>';
    [timeF, chk, note, cityF, man].forEach(function (el) { if (el) d.appendChild(el); });
    fs.appendChild(d);
  }
  function run() {
    [].forEach.call(document.querySelectorAll('#cp-form fieldset.cp-person'), collapse);
    ['cp-form', 'synastry-form', 'mxc-form', 'mxk-form'].forEach(function (id) {
      var f = document.getElementById(id); if (!f) return;
      f.classList.add('y27-form'); wrapLabelText(f); icons(f);
    });
    var mp = document.querySelector('#mxm-pair .mxm-form');
    if (mp) { if (!mp.id) mp.id = 'mxm-pair-form'; wrapLabelText(mp); icons(mp); }
    if (window.AqAutofillBuild) window.AqAutofillBuild();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#cp-form button[type=submit]'); if (!b) return;
    [].forEach.call(document.querySelectorAll('#cp-form details.cp-more'), function (d) {
      var t = d.querySelector('input[type=time]'), u = d.querySelector('input[type=checkbox]');
      if (t && !t.value && !(u && u.checked)) d.open = true;
    });
  }, true);
  /* بدل التكرار الزمني: تشغيل عند التحميل وعند ظهور نموذج جديد فقط */
  var FORMS = '#cp-form,#synastry-form,#mxc-form,#mxk-form,#mxm-pair,.mxm-form', q = false;
  function schedule() { if (q) return; q = true; requestAnimationFrame(function () { q = false; run(); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('load', run);
  new MutationObserver(function (ms) {
    for (var i = 0; i < ms.length; i++) for (var j = 0; j < ms[i].addedNodes.length; j++) {
      var n = ms[i].addedNodes[j];
      if (n.nodeType === 1 && (n.matches(FORMS) || n.querySelector(FORMS))) return schedule();
    }
  }).observe(document.body || document.documentElement, { childList: true, subtree: true });
})();

;
/* assets/js/compat-ui.js */
/* توافق مسار الحياة: واجهة العرض (بطاقات اختيار نوع العلاقة، بطاقة النتيجة العنابية، نافذة القراءة).
   عرض فقط: لا يغيّر أي حساب ولا نصًا. الحساب في engine.js والنصوص في data.json وapp.js. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function sv(d, w) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.6) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }

  /* ---------- 1) بطاقات نوع العلاقة ---------- */
  var MODES = [
    ['romantic', 'عاطفة وشراكة', '<path d="M12 20s-7.500-4.600-7.500-10.200A4.200 4.200 0 0 1 12 7.300a4.200 4.200 0 0 1 7.500 2.500C19.500 15.400 12 20 12 20z"/>'],
    ['family', 'أسرة وأخوة', '<circle cx="8" cy="8" r="2.800"/><circle cx="16.500" cy="9" r="2.300"/><path d="M2.800 19c.4-3 2.500-4.800 5.200-4.800s4.800 1.800 5.200 4.800M14.500 14.500c2.700 0 4.800 1.500 5.300 4.500"/>'],
    ['business', 'عمل وشغل', '<rect x="3.500" y="8" width="17" height="11.500" rx="2.500"/><path d="M9 8V6.200c0-.7.500-1.200 1.200-1.200h3.600c.7 0 1.200.5 1.200 1.200V8M3.500 13h17"/>']
  ];
  function modeCards() {
    var form = $('#synastry-form'), sel = $('#syn-type');
    if (!form || !sel || $('#cpm-modes')) return;
    var row = document.createElement('div'); row.id = 'cpm-modes'; row.className = 'cpm-modes'; row.setAttribute('role', 'radiogroup'); row.setAttribute('aria-label', 'نوع العلاقة');
    row.innerHTML = MODES.map(function (m) {
      return '<button type="button" class="cpm-mode" role="radio" data-cpm="' + m[0] + '" aria-checked="false"><span class="cpm-ic">' + sv(m[2]) + '</span><span class="cpm-lb">' + m[1] + '</span></button>';
    }).join('');
    form.parentNode.insertBefore(row, form);
    function paint() { $$('.cpm-mode', row).forEach(function (b) { var on = b.getAttribute('data-cpm') === sel.value; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); }); }
    row.addEventListener('click', function (e) {
      var b = e.target.closest('.cpm-mode'); if (!b) return;
      sel.value = b.getAttribute('data-cpm'); sel.dispatchEvent(new Event('change', { bubbles: true })); paint();
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var n = $('#syn-name-a'); if (n) { try { n.focus({ preventScroll: true }); } catch (x) { n.focus(); } }
    });
    sel.addEventListener('change', paint);
    var rel = sel.closest('.syn-rel'); if (rel) { rel.classList.add('cpm-hidden'); rel.style.setProperty('display', 'none', 'important'); }
    paint();
  }

  /* ---------- 2) بطاقة النتيجة العنابية + إخفاء النموذج ---------- */
  var REL = { romantic: 'عاطفة وشراكة', family: 'أسرة وأخوة', business: 'عمل وشغل' };
  var HI = {
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.500 6.500l4 4"/>',
    save: '<path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z"/>',
    add: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'
  };
  function pill(a, ic, label) { return '<button type="button" data-cph="' + a + '" aria-label="' + label + '">' + sv(HI[ic], 1.7) + '<span>' + label + '</span></button>'; }
  function setForm(show) {
    var f = $('#synastry-form'), m = $('#cpm-modes'), ex = $('#lifepath-compat .cp-explain');
    var sec = $('#lifepath-compat'); if (sec) sec.classList.toggle('cp-res', !show);
    [f, m, ex].forEach(function (el) { if (!el) return; if (show) { el.style.removeProperty('display'); el.hidden = false; } else el.style.setProperty('display', 'none', 'important'); });
  }
  function clearResult() { closeSheet(); var o = $('#syn-result'); if (o) { o.hidden = true; o.innerHTML = ''; } }
  function buildHero(out) {
    if (!out || out.hidden || !out.innerHTML.trim()) { return; }
    if (out.querySelector('.cph')) return;
    var D = out.dataset, h = document.createElement('section'); h.className = 'cph';
    var master = out.querySelector('.syn-master-badge');
    h.innerHTML = '<span class="cph-k">توافق مسار الحياة · ' + esc(REL[D.rel] || '') + '</span>' +
      '<div class="cph-pair">' +
      '<div class="cph-p"><span class="cph-n">' + esc(D.p1) + '</span><b>' + esc(D.na) + '</b><small></small></div>' +
      '<div class="cph-sc"><span class="cph-ring"><strong>' + esc(D.score) + '<em>%</em></strong></span><small>' + esc(D.label) + '</small></div>' +
      '<div class="cph-p"><span class="cph-n">' + esc(D.p2) + '</span><b>' + esc(D.nb) + '</b><small></small></div></div>' +
      '<div class="cph-tools">' + pill('edit', 'edit', 'تعديل البيانات') + pill('save', 'save', 'حفظ') + pill('new', 'add', 'توافق جديد') + '</div>';
    /* الوصف (حياته/حياتها) يتبع الجنس المختار، وإلا صيغة محايدة */
    var caps = h.querySelectorAll('.cph-p small');
    caps[0].textContent = D.g1 === 'female' ? 'مسار حياتها' : 'مسار حياته';
    caps[1].textContent = D.g2 === 'female' ? 'مسار حياتها' : 'مسار حياته';
    if (master) h.appendChild(master);
    out.insertBefore(h, out.firstChild);
    setForm(false);
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
    var sec = $('#lifepath-compat'); if (sec) sec.scrollTop = 0;
  }
  function heroActions() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-cph]'); if (!b) return;
      var a = b.getAttribute('data-cph'), out = $('#syn-result'), D = (out && out.dataset) || {};
      if (a === 'edit') { clearResult(); setForm(true); var f = $('#synastry-form'); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      else if (a === 'new') { ['syn-name-a', 'syn-name-b', 'syn-date-a', 'syn-date-b'].forEach(function (id) { var el = $('#' + id); if (el) { el.value = ''; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); } }); clearResult(); setForm(true); var n = $('#syn-name-a'); if (n) { n.scrollIntoView({ behavior: 'smooth', block: 'center' }); try { n.focus({ preventScroll: true }); } catch (x) {} } }
      else if (a === 'save') {
        var P = window.AqeeqPlatform;
        if (P && typeof P.saveReading === 'function') {
          P.saveReading({ type: 'lifepath-compat', typeLabel: 'توافق مسار الحياة', title: D.na + ' + ' + D.nb, subtitle: (REL[D.rel] || '') + ' · ' + D.score + '%', route: '#lifepath-compat', inputs: { name1: D.na, date1: D.d1, gender1: D.g1, name2: D.nb, date2: D.d2, gender2: D.g2, type: D.rel } });
          b.classList.add('is-saved'); var sp = b.querySelector('span'); if (sp) sp.textContent = 'تم الحفظ';
        }
      }
    });
  }
  function watchResult() {
    var out = $('#syn-result'); if (!out) return; var q = false;
    new MutationObserver(function () { if (q) return; q = true; requestAnimationFrame(function () { q = false; buildHero(out); buildTiles(out); }); }).observe(out, { childList: true, attributes: true, attributeFilter: ['hidden'] });
  }

  /* ---------- 3) بطاقات الأقسام + النافذة السفلية ---------- */
  var IC = {
    magnet: '<path d="M6 3v8a6 6 0 0 0 12 0V3h-4v8a2 2 0 0 1-4 0V3z"/><path d="M6 7h4M14 7h4"/>',
    bridge: '<path d="M3 18h18"/><path d="M5 18v-4M19 18v-4"/><path d="M5 14c2-6.500 12-6.500 14 0"/><path d="M9 10.200V18M12 9.200V18M15 10.200V18"/>',
    clock: '<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3.200 2"/>',
    pair: '<circle cx="9" cy="12" r="5.500"/><circle cx="15" cy="12" r="5.500"/>',
    person: '<circle cx="12" cy="7.500" r="3.200"/><path d="M5.500 21v-1.500a6.500 6.500 0 0 1 13 0V21"/>',
    personB: '<circle cx="11" cy="8" r="3.200"/><path d="M4.500 21v-1.500a6.500 6.500 0 0 1 13 0V21"/><path d="M19 3.500v4M17 5.500h4"/>',
    spark: '<path d="M13 3 5 13.500h6L10 21l8-10.500h-6z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.500 8.500l-2 5-5 2 2-5z"/>',
    star: '<path d="M12 3l2.200 6 6 2.200-6 2.200L12 19.500l-2.200-6-6-2.200 6-2.200z"/>',
    hourglass: '<path d="M6 3h12M6 21h12"/><path d="M7 3v3.500c0 2 3 3.500 5 5.500-2 2-5 3.500-5 5.500V21M17 3v3.500c0 2-3 3.500-5 5.500 2 2 5 3.500 5 5.500V21"/>',
    chev: '<path d="M15 6l-6 6 6 6"/>'
  };
  var sheet = null, items = [], closeT, AQL = window.__aqLock = window.__aqLock || { s: {}, on: function (k) { this.s[k] = 1; document.documentElement.classList.add('aqm-sheet-open'); }, off: function (k) { delete this.s[k]; if (!Object.keys(this.s).length) document.documentElement.classList.remove('aqm-sheet-open'); } };
  function badgesHtml(list) { return (list || []).filter(function (b) { return b && b[1] !== '' && b[1] != null; }).map(function (b) { return '<span class="lp-hbadge"><small>' + esc(b[0]) + '</small><b>' + esc(b[1]) + '</b></span>'; }).join(''); }
  function ensureSheet() {
    if (sheet) return sheet;
    sheet = document.createElement('div'); sheet.className = 'aqm-sheet lps-sheet cps-sheet'; sheet.hidden = true;
    sheet.innerHTML = '<div class="aqm-sheet-scrim" data-cps-close></div>' +
      '<div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="cps-title"><span class="aqm-sheet-grip" aria-hidden="true"></span>' +
      '<button type="button" class="aqm-sheet-x" data-cps-close aria-label="إغلاق"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="aqm-sheet-head"><span class="aqm-sheet-ic"></span><div><div class="lp-hbadges" hidden></div><h3 id="cps-title"></h3><p class="aqm-sheet-sub"></p></div></div>' +
      '<div class="aqm-sheet-body lps-body cps-body"></div>' +
      '<div class="aqm-sheet-foot"><button type="button" class="aqm-foot-next" data-cps-next hidden><span class="aqm-foot-l"><small>القسم التالي</small><b></b></span>' + sv(IC.chev, 2) + '</button><button type="button" class="aqm-foot-close" data-cps-close>إغلاق</button></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-cps-close]')) closeSheet();
      else if (e.target.closest('[data-cps-next]')) goNext();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet && !sheet.hidden) closeSheet(); });
    return sheet;
  }
  var cur = -1;
  function openSheet(i) {
    var it = items[i]; if (!it) return; cur = i;
    var s = ensureSheet();
    $('.aqm-sheet-ic', s).innerHTML = sv(IC[it.ic] || IC.star, 1.6);
    $('#cps-title', s).textContent = it.title; $('.aqm-sheet-sub', s).textContent = it.hook || '';
    var bd = $('.lp-hbadges', s), bh = badgesHtml(it.badges); bd.innerHTML = bh; bd.hidden = !bh;
    var b = $('.cps-body', s); b.style.scrollBehavior = 'auto'; b.innerHTML = it.html; b.scrollTop = 0;
    var nx = items[i + 1], nb = $('[data-cps-next]', s); if (nx) { $('b', nb).textContent = nx.title; nb.hidden = false; } else nb.hidden = true;
    clearTimeout(closeT); s.classList.remove('is-closing'); s.hidden = false; AQL.on('cps');
    var top0 = function () { b.scrollTop = 0; var pn = $('.aqm-sheet-panel', s); if (pn) pn.scrollTop = 0; }; top0(); requestAnimationFrame(top0); setTimeout(top0, 80);
  }
  function goNext() { if (!items[cur + 1]) return; sheet.classList.add('is-swap'); setTimeout(function () { openSheet(cur + 1); sheet.classList.remove('is-swap'); }, 160); }
  function closeSheet() { if (!sheet || sheet.hidden) return; sheet.classList.add('is-closing'); var sh = sheet; clearTimeout(closeT); closeT = setTimeout(function () { sh.hidden = true; sh.classList.remove('is-closing'); AQL.off('cps'); }, 230); }

  function buildTiles(out) {
    if (!out || out.querySelector('.cpt-list')) return;
    var srcs = $$('.cpt-src', out); if (!srcs.length) return;
    items = srcs.map(function (el) {
      var badges = []; try { badges = JSON.parse(el.getAttribute('data-badges') || '[]'); } catch (e) {}
      return { grp: el.getAttribute('data-grp'), ic: el.getAttribute('data-ic'), title: el.getAttribute('data-title'), hook: el.getAttribute('data-hook'), badges: badges, html: el.innerHTML };
    });
    var wrap = document.createElement('div'); wrap.className = 'cpt-list'; var lastGrp = '';
    items.forEach(function (it, i) {
      if (it.grp !== lastGrp) { if (it.grp === '2') { var h = document.createElement('h3'); h.className = 'cpt-grp'; h.textContent = 'إزاي بتفهموا بعض من جوه؟'; wrap.appendChild(h); } lastGrp = it.grp; }
      var b = document.createElement('button'); b.type = 'button'; b.className = 'cpt-tile'; b.setAttribute('data-cpt', i);
      b.innerHTML = '<span class="cpt-ic">' + sv(IC[it.ic] || IC.star, 1.6) + '</span><span class="cpt-tx"><b>' + esc(it.title) + '</b><span>' + esc(it.hook) + '</span>' + (badgesHtml(it.badges) ? '<span class="lp-hbadges cpt-bd">' + badgesHtml(it.badges) + '</span>' : '') + '</span><span class="cpt-ch">' + sv(IC.chev, 2) + '</span>';
      wrap.appendChild(b);
    });
    wrap.addEventListener('click', function (e) { var t = e.target.closest('.cpt-tile'); if (t) openSheet(Number(t.getAttribute('data-cpt'))); });
    var hero = out.querySelector('.cph'); if (hero && hero.nextSibling) out.insertBefore(wrap, hero.nextSibling); else out.appendChild(wrap);
  }

  function init() { modeCards(); heroActions(); watchResult(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

;
/* assets/js/matrix-ui.js */
/* مصفوفة القدر: بطاقات الأوضاع الثلاثة (فردي / شركاء / أطفال). عرض فقط، بلا أي تغيير في الحساب. */
(function () {
  'use strict';
  var MODES = [
    ['matrix', '#matrix', 'فردي', '<path d="M12 3l9 9-9 9-9-9z"/><path d="M12 8l4 4-4 4-4-4z"/>'],
    ['matrix-compat', '#matrix-compat', 'شركاء', '<circle cx="9" cy="12" r="5.500"/><circle cx="15" cy="12" r="5.500"/>'],
    ['matrix-child', '#matrix-child', 'أطفال', '<circle cx="12" cy="7.500" r="3"/><path d="M6.500 20c.3-3 2.500-5 5.500-5s5.200 2 5.500 5"/><path d="M9.500 3.600c.8-1 4.200-1 5 0"/>']
  ];
  function build(id) {
    var sec = document.getElementById(id); if (!sec || sec.querySelector('.mxm-modes')) return;
    var bar = sec.querySelector('.aq-section-topbar'); if (!bar) return;
    var old = sec.querySelector('.mxm-links'); if (old) old.remove();
    var row = document.createElement('nav'); row.className = 'mxm-modes'; row.setAttribute('aria-label', 'نوع المصفوفة');
    row.innerHTML = MODES.map(function (m) {
      var on = m[0] === id;
      return '<a class="mxm-mode' + (on ? ' is-on' : '') + '" href="' + m[1] + '"' + (on ? ' aria-current="page"' : '') + '><span class="mxm-mic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + m[3] + '</svg></span><span class="mxm-mlb">' + m[2] + '</span></a>';
    }).join('');
    bar.insertAdjacentElement('afterend', row);
  }
  function init() { ['matrix', 'matrix-compat', 'matrix-child'].forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  /* matrix-modes.js يضيف صف الروابط القديم متأخرًا: نعيد الفحص مرة بعد التحميل */
  window.addEventListener('load', function () { setTimeout(function () { var o = document.querySelector('#matrix .mxm-links'); if (o) o.remove(); init(); }, 300); });
})();

;
/* assets/js/sky-texts-lazy.js */
/* تحميل نصوص السماء والأبراج عند الطلب بدل تحميلها مع كل فتحة للتطبيق (نحو 1.3 ميغابايت خام).
   الملفان معرّفان في index.src.html كوسوم <meta name="aq-lazy"> بإصدارهما (لا تُجلب قبل أن نطلبها)، ويُحقنان هنا بنفس الترتيب القديم.
   متى يُحمَّلان: (1) فور دخول #sky أو #signs أو فتح ورقة التوقعات، (2) وإلا وقت الخمول بعد اكتمال الصفحة.
   عند الوصول يُطلق الحدث aq:sky-texts وتعيد الصفحات المفتوحة رسم النص. */
(function () {
  'use strict';
  var links = [].slice.call(document.querySelectorAll('meta[name="aq-lazy"]'));
  var p = null, stale = false;
  function rerenderSigns() { stale = false; try { if (window.__aqSignsRerender) window.__aqSignsRerender(); } catch (e) { } }
  function ready() { return !!(window.AqReadings && window.AqLive); }
  function inject(href) {
    return new Promise(function (res) {
      var s = document.createElement('script'); s.src = href; s.async = false;
      s.onload = function () { res(true); }; s.onerror = function () { res(false); };
      document.head.appendChild(s);
    });
  }
  function load() {
    if (ready()) return Promise.resolve(true);
    if (p) return p;
    p = Promise.all(links.map(function (l) { return inject(l.getAttribute('content')); })).then(function () {
      p = null;
      if (!ready()) return false;
      try { document.dispatchEvent(new CustomEvent('aq:sky-texts')); } catch (e) { }
      /* رسم #signs يحسب تواريخ الدخول بين الأبراج (ثقيل): لا نرسمه إلا إن كانت الصفحة مفتوحة، وإلا يُرسم عند دخولها */
      if (/^#signs\b/.test(location.hash)) rerenderSigns(); else stale = true;
      return true;
    });
    return p;
  }
  window.AqSkyTexts = { load: load, ready: ready };
  function route() {
    if (/^#(sky|signs|world)\b/.test(location.hash)) load();
    if (stale && ready() && /^#signs\b/.test(location.hash)) setTimeout(rerenderSigns, 0);
  }
  window.addEventListener('hashchange', route);
  function idle() {
    var go = function () { load(); };
    if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 5000 }); else setTimeout(go, 3000);
  }
  route();
  if (document.readyState === 'complete') idle(); else window.addEventListener('load', function () { setTimeout(idle, 800); });
})();

;
/* assets/js/sky-sign-leads.js */
/* أسطر افتتاحية لقراءة كل كوكب في كل برج (ترتيب الأبراج من الحمل إلى الحوت) */
window.AqSignLeads = {
sun: [
"تريد أن تبدأ قبل أن تضمن النتيجة، وهنا بالذات تتعلم أن شجاعتك أصدق من خططك.",
"تحتاج أن تلمس ما تبنيه بيدك، فالثبات عندك ليس عنادًا بل طريقتك في أن تثق.",
"فضولك يفتح عشرة أبواب في وقت واحد، فاسأل أي باب منها يشبهك حقًا.",
"تحمي من تحب بصمت، وتُطلب منك الآن حماية نفسك بالقدر ذاته.",
"تريد أن تُرى لا لتتباهى، بل لتتأكد أن جهدك لم يذهب سدى.",
"ترى ما يمكن إصلاحه في كل شيء، فانظر أيضًا إلى ما نجح فعلًا.",
"توازن بين الجميع حتى تنسى أين تقف أنت، والسماء تسألك الآن عن موقفك.",
"لا ترضى بالسطح، وهذه الفترة تدفعك إلى ما تحته ولو كان صعبًا.",
"تبحث عن معنى أبعد من يومك العادي، وتشعر أن المكان الحالي ضاق على سؤالك.",
"تبني ببطء وصبر، وتنتظر من يعترف بأن هذا البناء كلّفك كثيرًا.",
"ترى الأمور من مسافة تتيح التغيير، لكن المسافة نفسها قد تُبعدك عمن تحب.",
"تلتقط ما لا يُقال، فضع لحساسيتك حدودًا صغيرة حتى لا تذوب في غيرك."],
moon: [
"يسبق شعورك كلامك، فتتحرك قبل أن تعرف السبب وتفسّر بعد ذلك.",
"تهدأ حين يكون المكان مألوفًا والطعام دافئًا، ولا تخجل من هذه الحاجة.",
"تحتاج أن تتحدث عمّا تشعر به كي تفهمه، فالصمت عندك يزيد الزحام الداخلي.",
"مشاعرك عميقة وقديمة، وتحتاج إلى بيت آمن أكثر مما تحتاج إلى نصيحة.",
"تتألم حين لا يُلاحَظ ما تفعله، وتتسع حين يُقال لك شكرًا بصدق.",
"تعتني بمن حولك بالتفاصيل، فتذكّر أن تفرّغ ما يتراكم عليك من توتر صغير.",
"تهدأ حين تكون العلاقات متزنة، ويختل مزاجك مع أول توتر بينك وبين قريب.",
"تشعر بكل شيء بقوة وتُخفي أغلبه، وهذا الكتمان يثقل عليك أكثر مما تظن.",
"يرتاح قلبك حين يكون هناك أفق جديد، ويضيق حين يتكرر المكان نفسه.",
"تخفي حاجتك إلى الحنان خلف الجدية، وتخشى أن يُقرأ ذلك ضعفًا.",
"تحب القرب وتحتاج مسافة في اللحظة نفسها، ولا تناقض في ذلك.",
"تمتص أجواء المكان كما يمتص الإسفنج الماء، فاحرص على ما تدخل إليه."],
mercury: [
"تتحدث بسرعة وتقرر بسرعة، ثم تراجع نفسك بعد دقيقة لتتأكد أنك لم تتسرع.",
"تفكر ببطء وتصل إلى نتائج راسخة، ولا تحب أن يستعجلك أحد في رأيك.",
"عقلك يقفز بين الأفكار كأنها نوافذ مفتوحة، فاكتب ما يهمك قبل أن يضيع.",
"تتذكر ما قيل لك بدقة مؤلمة، وتفكر بقلبك قبل منطقك.",
"تتكلم بثقة وتحب أن يُنصَت إليك، وتتعلم أن الإنصات يكسب أكثر من الإقناع.",
"تدقق في كل جملة وتفحص كل تفصيلة، فاحمِ نفسك من النقد الداخلي المبالغ فيه.",
"تزن الكلمة قبل أن تقولها حتى لا تجرح أحدًا، وقد تؤجل ما يجب أن يُقال.",
"تسمع ما وراء الكلام وتشك في الإجابات السهلة، وتبحث عن الحقيقة الكاملة.",
"تقول ما تفكر فيه بصراحة تُضحك أو تُحرج، وتعيش للفكرة الكبيرة لا للتفصيل.",
"تفكر بجدية وتخطط بعيدًا، ولا تقول إلا ما تستطيع الدفاع عنه.",
"أفكارك تسبق عصرها قليلًا، فلا تتعجب إن لم يفهمها الجميع من أول مرة.",
"تفكر بالصور والإحساس قبل الكلمات، فتحتاج إلى وقت لتترجم ما تعرفه."],
venus: [
"تحب بوضوح وبحماس، ولا تحتمل الانتظار الطويل في الحب.",
"قلبك لا يُفتح بالكلام وحده: يحتاج إلى صبر ولمسة ووفاء قبل أن يطمئن.",
"تنجذب إلى من يحاورك ويضحكك، وتخاف أن يتحول الحب إلى روتين ثقيل.",
"حنانك عميق وخوفك من الترك أعمق، ولذلك تتعلق قبل أن تطمئن.",
"كرمك في الحب كبير ويحتاج إلى تقدير يُقال بصوت عالٍ، فالإهمال يؤلمك أكثر مما تعترف.",
"تعبّر عن حبك بالخدمة والتفاصيل، ولا تنتظر أن يلاحظ أحد ذلك دائمًا.",
"تبحث عن علاقة عادلة وجميلة، وتتجنب المواجهة حتى لا تفسد الجو.",
"إما أن تحب بكل ما فيك أو لا تحب، وصدق مطلق هو شرطك للثقة.",
"هل يتسع الحب عندك للحرية؟ تختنق مع من يسأل أين كنت وماذا فعلت.",
"تتأخر في فتح قلبك لكنك تبقى حين تفعل، وتقدّر من يحترم وتيرتك.",
"من يشاركك فكرة ولا يملكك أقرب إليك ممن يغمرك بعاطفة ثقيلة.",
"قد يبلغ حبك حد الذوبان بلا شروط، فاسأل نفسك أين تنتهي حدودك."],
mars: [
"تندفع وتبدأ ثم تتساءل عن العواقب، وسرعتك قوة ما دام معك اتجاه.",
"تتحرك ببطء ثابت لا يوقفه أحد، وغضبك نادر لكنه إذا جاء يكون عميقًا.",
"تفعل عشرة أشياء في آن واحد وتتعب من التشتت، فاختر واحدًا تنهيه.",
"تدافع عن من تحب بشراسة وتنسحب عندما تُجرح، وتحتاج إلى مواجهة هادئة.",
"حماسك يقودك إلى الصدارة، وكبرياؤك يسبق تفكيرك أحيانًا.",
"تعمل بدقة وتصبر على التفاصيل، وتغضب بصمت ممن لا يهتم مثلك.",
"تتجنب الصدام وتؤجله حتى يتراكم، فقل ما يزعجك قبل أن يكبر.",
"تتحرك بقوة خفية وتصبر حتى تتأكد، وإذا قررت لم يوقفك أحد.",
"صراحتك وحماسك يحتاجان إلى هدف كبير كي لا تتبعثر الطاقة.",
"تعمل بانضباط وتبني ببطء، وتغضب حين يستهين أحد بجهدك.",
"لا تحب الأوامر، ويظهر غضبك الحقيقي حين تُقيَّد بطريقة لم تخترها.",
"حدسك يسبق خطتك، وطاقتك تتبدد إن لم يكن لها مجرى واضح."],
jupiter: [
"يوسّع المشتري شجاعتك، ويدعوك إلى مغامرة تبدأ منك أنت لا من الظروف.",
"يمنحك المشتري وفرة هادئة، فاستمتع بما تملك دون أن تقارن نفسك بغيرك.",
"يفتح المشتري عقلك على تعلم جديد، وتجد حظك في الحوار والتنقل.",
"يغذي المشتري بيتك الداخلي، وتأتيك البركة من العائلة والمكان الدافئ.",
"يضاعف المشتري ثقتك وكرمك، فاحرص أن تبقى المبالغة في حدود المعقول.",
"يكافئ المشتري إتقانك، لكنه يطلب منك أن ترى الصورة الأكبر لا التفاصيل وحدها.",
"يزيدك المشتري توازنًا في العلاقات، وتأتيك الفرص عن طريق الشراكات.",
"يعمّق المشتري ما تؤمن به، وتجد النمو حيث تجرؤ على مواجهة الخوف.",
"يرحب المشتري بك في بيته، فتتسع الآفاق من السفر والتعلم والإيمان بالحياة.",
"يعلّمك المشتري أن النمو الحقيقي يأتي بالصبر، فلا تستعجل ثمرة لم تنضج.",
"يمنحك المشتري رؤية جماعية، وتزدهر حين تشارك فكرتك مع من يشبهك.",
"يرفع المشتري حدسك وتعاطفك، فاجعل كرمك موجّهًا لا يستنزفك."],
saturn: [
"يعلّمك زحل أن تتحمل مسؤولية نفسك، فتصير القيادة عبئًا إن لم تكن اختيارًا.",
"يختبر زحل ما تملك وما تعتمد عليه، ويبني لك أمانًا لا يعتمد على المظاهر.",
"يطلب منك زحل أن تفكر بعمق قبل أن تقول، فتكسب كلمتك وزنًا أكبر.",
"يعلّمك زحل حدود العطاء العاطفي، وكيف تحمي حاجتك إلى الأمان.",
"يضع زحل ثقتك بنفسك أمام اختبار هادئ، فتنضج حين تتخلى عن الحاجة إلى التصفيق.",
"الكمال وهم يثقل كاهلك عند زحل، والجيد الذي يُنجَز أنفع من المثالي المؤجل.",
"هل تكفي المجاملة لعلاقة صحية؟ زحل يقول إنها تحتاج التزامًا وحدودًا.",
"يضغط زحل على خوفك من الفقد حتى تتعلم أن القوة في ألا تتشبث.",
"عند زحل تصير الحرية مسؤولية، ويُبنى الإيمان الحقيقي بالتجربة لا بالوراثة.",
"يشعر زحل في بيته بالراحة، فيطلب منك صبرًا طويلًا ويكافئك ببنيان يدوم.",
"يطلب منك زحل أن توازن بين استقلالك وانتمائك، فلا تضحي بأحدهما.",
"حدودك تحمي حساسيتك، وزحل يذكّرك بأن المثالية لا تغني عن العمل اليومي."],
uranus: [
"يهز أورانوس هويتك بلطف مفاجئ، فتجرؤ على أن تكون على غير ما اعتدت.",
"أمانك المادي يهتز مع أورانوس، وهو يدعوك إلى استقرار أكثر مرونة.",
"يفتح أورانوس عقلك على أفكار غير مألوفة، ويدعوك إلى كلام صادق لم يُقل من قبل.",
"يحرك أورانوس جذورك وبيتك، فتعيد تعريف معنى الانتماء بطريقتك.",
"يوقظ أورانوس فيك رغبة في التعبير الأصيل، ويرفض أن تكون نسخة من أحد.",
"يغيّر أورانوس نظام يومك، فاسمح لروتينك أن يتجدد دون أن تفقد توازنك.",
"يجعل أورانوس علاقاتك غير متوقعة، فتتعلم أن الحرية والقرب لا يتعارضان.",
"ما كنت تتمسك به في أعماقك ينكسر مع أورانوس، ويخرج منه ما هو أصدق.",
"يوسّع أورانوس معتقداتك ويدفعك إلى تجارب لم تكن في حسابك.",
"يعيد أورانوس تشكيل مسارك وبنيانك، ويطلب منك مرونة لا تهدم ما بنيته.",
"يشعر أورانوس بالألفة في هذا البرج، فتتحرك أفكارك بحرية وتجد من يفهمها.",
"يوقظ أورانوس حدسك فجأة، فتعرف ما لم تتعلمه من أحد."],
neptune: [
"يذيب نبتون الحدود في هويتك، فتحتاج أن تسأل نفسك من أنا حين لا أحد ينظر.",
"يخلط نبتون القيمة بالحلم، فتأكد من الأرقام قبل أن تثق بالوعود الجميلة.",
"يضفي نبتون على أفكارك طابعًا شاعريًا، وقد يلتبس عليك فهم ما يقال لك.",
"يلوّن نبتون ذكرياتك بحنين غامض، فاسأل عمّا وراء هذا الشعور قبل أن تتبعه.",
"يمنح نبتون خيالك جناحين، ويجعل الحب الأول صورة أجمل من الواقع.",
"يضعف نبتون الانضباط ويقوّي الرحمة، فاحمِ جدولك كي لا تذوب في خدمة غيرك.",
"يضفي نبتون على العلاقات سحرًا، فتأكد من الصورة الحقيقية لمن تحب.",
"يغمر نبتون أعماقك بضباب لطيف، فاطلب الوضوح في كل ما يشترك فيه الآخرون.",
"يوسّع نبتون خيالك الروحي، فاجعل التجربة معيارك لا الكلام الجميل.",
"يجعل نبتون صورتك المهنية غامضة، فحدد قيمك قبل أن تحدد مسمّاك.",
"يعلّق نبتون آمالًا كبيرة على الأصدقاء، فأحبهم كما هم لا كما تحلم.",
"يشعر نبتون في هذا البرج بالانتماء، فيرفع حدسك وحاجتك إلى الصمت."],
pluto: [
"يدفعك بلوتو إلى إعادة بناء حضورك من الجذور، فتترك دورًا لم يعد يخصك.",
"يختبر بلوتو علاقتك بالمال والقيمة، ويبني فيك أمانًا لا يُسلب.",
"يجعل بلوتو كلماتك ثقيلة الوزن، فاستعملها لتقترب من الناس لا لتتحكم بهم.",
"ينبش بلوتو في أصولك العائلية، ويطلب منك أن تنظف ما ورثته دون أن تدري.",
"يعمق بلوتو رغبتك في الحب والإبداع، ويطلب الصدق فيهما كاملًا.",
"عاداتك اليومية تُعاد صياغتها مع بلوتو، فتتخلص مما أرهقك دون أن تشعر.",
"يحول بلوتو شراكاتك إلى مرآة صارمة، فتتعلم الفرق بين الحب والسيطرة.",
"يعمل بلوتو في بيته الطبيعي، فتواجه خوفك من الفقد وتخرج أقوى.",
"يهدم بلوتو اليقين السهل في معتقداتك، ليبني إيمانًا اختبرته بنفسك.",
"أتريد المنصب أم التأثير؟ هذا ما يضعه بلوتو أمام طموحك.",
"يعيد بلوتو ترتيب دائرتك الاجتماعية، فيبقى من يستحق ويرحل من انتهى دوره.",
"ينقل بلوتو ما كان في الظلام إلى النور ببطء، فلا تستعجل ما يظهر."]
};
window.addEventListener('load', function () { try { var d = document.getElementById('sky-date'); if (d) d.dispatchEvent(new Event('change')); } catch (e) { } });

;
/* assets/js/sky-ingress.js */
/* جمل دخول الكوكب برجًا جديدًا: لكل كوكب اثنا عشر جملة بحسب البرج المقبل، والرمز {d} مكان التاريخ */
window.AqIngress = {"sun":["تدخل الشمس برج الحمل تقريبًا يوم {d}، فيشتد الميل إلى البداية المباشرة وتضيق الصبر على التأجيل.","تنزل الشمس في برج الثور تقريبًا يوم {d}، فتهدأ الأيام وتصير القيمة لما يثبت ويُلمس.","تصل الشمس إلى برج الجوزاء تقريبًا يوم {d}، فتكثر الأسئلة والمحادثات وتتسع دائرة ما تريد معرفته.","تمر الشمس إلى برج السرطان تقريبًا يوم {d}، فيرتفع الحنين وتتجه العناية إلى البيت ومن فيه.","تشرق الشمس في برج الأسد تقريبًا يوم {d}، فتزداد الرغبة في أن تُرى وأن تفرح بما تصنعه.","تعبر الشمس إلى برج العذراء تقريبًا يوم {d}، فيعلو الانتباه للتفاصيل ويطيب ترتيب ما تراكم.","تدخل الشمس برج الميزان تقريبًا يوم {d}، فيصير السؤال الأهم كيف تتوازن علاقاتك وقراراتك.","تنتقل الشمس إلى برج العقرب تقريبًا يوم {d}، فتصير الأيام أعمق وأقل قبولًا بالسطحي من الكلام.","تبلغ الشمس برج القوس تقريبًا يوم {d}، فيتسع الأفق ويشتد الشوق إلى فكرة أكبر أو طريق أبعد.","تدخل الشمس برج الجدي تقريبًا يوم {d}، فيعود الجد إلى الأيام وتُحسب الخطوات بميزان الصبر.","تحلّ الشمس في برج الدلو تقريبًا يوم {d}، فيعلو الميل إلى الاستقلال وإلى أفكار تخرج عن المألوف.","تغادر الشمس إلى برج الحوت تقريبًا يوم {d}، فتلين الحدود ويقوى الإحساس بما لا يُقال."],"moon":["يدخل القمر برج الحمل تقريبًا يوم {d}، فيتسرع الشعور قليلًا ويحب أن يتحرك قبل أن يفكر.","ينزل القمر في برج الثور تقريبًا يوم {d}، فيطلب القلب راحة وطعامًا مألوفًا ومكانًا لا يتغير.","يعبر القمر إلى برج الجوزاء تقريبًا يوم {d}، فيتحول المزاج إلى كلام وفضول وتنقل بين الأفكار.","ينتقل القمر إلى برج السرطان تقريبًا يوم {d}، فيعود إلى بيته ويشتد الحنين والحساسية للجو حولك.","يشرق القمر في برج الأسد تقريبًا يوم {d}، فيحتاج الشعور إلى تقدير ظاهر وإلى لحظة فرح.","يصل القمر إلى برج العذراء تقريبًا يوم {d}، فيهدأ القلب بترتيب الأشياء وبعمل صغير ينتهي.","يمر القمر إلى برج الميزان تقريبًا يوم {d}، فيلين المزاج ويرتاح إلى الجمال والاتزان والرفقة.","يدخل القمر برج العقرب تقريبًا يوم {d}، فتتعمق المشاعر وتميل إلى الصمت أكثر من الشرح.","يبلغ القمر برج القوس تقريبًا يوم {d}، فيرتفع المزاج ويشتاق إلى فسحة وإلى ضحكة واسعة.","يحلّ القمر في برج الجدي تقريبًا يوم {d}، فتتماسك المشاعر وتتجه إلى الواجب والمسؤولية.","ينتقل القمر إلى برج الدلو تقريبًا يوم {d}، فيحب المزاج أن يتنفس بعيدًا عن الزحام العاطفي.","يغادر القمر إلى برج الحوت تقريبًا يوم {d}، فيرق الشعور ويلتقط ما حوله من أجواء وأحلام."],"mercury":["يدخل عطارد برج الحمل تقريبًا يوم {d}، فتخرج الجمل أسرع وأقصر، ويحلو الرد قبل التفكير الطويل.","ينزل عطارد في برج الثور تقريبًا يوم {d}، فيتباطأ التفكير ويثبت، ولا تقتنع إلا بما تراه أمامك.","يعود عطارد إلى بيته في برج الجوزاء تقريبًا يوم {d}، فيتسارع الكلام وتكثر الرسائل والأسئلة.","يعبر عطارد إلى برج السرطان تقريبًا يوم {d}، فتمتزج الأفكار بالشعور ويصير للكلام نبرة أدفأ.","يصل عطارد إلى برج الأسد تقريبًا يوم {d}، فتميل الحجة إلى الثقة والعرض الواضح والإقناع المباشر.","يبلغ عطارد برج العذراء تقريبًا يوم {d}، فيشتد انتباه العقل للدقة والمراجعة وتصحيح الأخطاء.","ينتقل عطارد إلى برج الميزان تقريبًا يوم {d}، فيوازن الكلام بين الرأيين ويحب الحوار الهادئ.","يدخل عطارد برج العقرب تقريبًا يوم {d}، فينفذ التفكير إلى ما وراء الظاهر ويشك في الجمل السهلة.","يحلّ عطارد في برج القوس تقريبًا يوم {d}، فيتسع الحديث إلى الأفكار الكبيرة ويقل الصبر على التفاصيل.","يمر عطارد إلى برج الجدي تقريبًا يوم {d}، فيصير الكلام عمليًا مختصرًا ويُقاس بما ينفذ.","يشرق عطارد في برج الدلو تقريبًا يوم {d}، فتغلب الأفكار الجديدة وتخف الحاجة إلى موافقة الجميع.","يغادر عطارد إلى برج الحوت تقريبًا يوم {d}، فيلين المنطق ويتقدم الحدس وتصعب الصياغة الدقيقة."],"venus":["تدخل الزهرة برج الحمل تقريبًا يوم {d}، فتصير المودة أسرع وأصرح، ولا يحتمل القلب غموضًا طويلًا.","تنزل الزهرة في برج الثور تقريبًا يوم {d}، فتستقر في بيتها وتحلو الأشياء الهادئة واللمسات البسيطة.","تصل الزهرة إلى برج الجوزاء تقريبًا يوم {d}، فيخف الحب بالكلام ويصير المزاح بابًا إلى القرب.","تعبر الزهرة إلى برج السرطان تقريبًا يوم {d}، فتشتد الحاجة إلى الأمان وإلى من يهتم بك فعلًا.","تشرق الزهرة في برج الأسد تقريبًا يوم {d}، فيحب القلب الكرم والاحتفاء ويطلب أن يُرى بوضوح.","تبلغ الزهرة برج العذراء تقريبًا يوم {d}، فتظهر المحبة في خدمة صغيرة وتفصيلة اهتم بها أحد.","تحلّ الزهرة في برج الميزان تقريبًا يوم {d}، فتعود إلى بيتها ويصير الانسجام معيار ما تحب.","تدخل الزهرة برج العقرب تقريبًا يوم {d}، فيشتد الشغف وتغيب الرغبة في علاقات خفيفة بلا عمق.","تنتقل الزهرة إلى برج القوس تقريبًا يوم {d}، فيحب القلب الحرية والفرح والسفر وكل ما يوسّعه.","تمر الزهرة إلى برج الجدي تقريبًا يوم {d}، فيصير الحب أكثر جدية ويُقاس بالالتزام وبما يبقى.","تدخل الزهرة برج الدلو تقريبًا يوم {d}، فتميل المودة إلى الصداقة والاستقلال وإلى من يشبهك فكرًا.","تغادر الزهرة إلى برج الحوت تقريبًا يوم {d}، فيرق الحب وتتسع الرحمة ويصعب رسم الحدود."],"mars":["يدخل المريخ برج الحمل تقريبًا يوم {d}، فيعود إلى بيته وتشتعل الرغبة في المبادرة والمنافسة.","ينزل المريخ في برج الثور تقريبًا يوم {d}، فتبطؤ الطاقة وتتحول إلى عناد جميل أو إصرار هادئ.","يعبر المريخ إلى برج الجوزاء تقريبًا يوم {d}، فتتوزع القوة بين مهام كثيرة وتشتد حدة اللسان.","يصل المريخ إلى برج السرطان تقريبًا يوم {d}، فيتحول الغضب إلى حماية وتتحرك الطاقة داخل البيت.","يشرق المريخ في برج الأسد تقريبًا يوم {d}، فتزداد الجرأة وتحتاج الطاقة إلى ميدان تُظهر فيه ما تصنع.","يبلغ المريخ برج العذراء تقريبًا يوم {d}، فتصير القوة دقة وعملًا متقنًا وانزعاجًا من الإهمال.","ينتقل المريخ إلى برج الميزان تقريبًا يوم {d}، فيصعب الحسم ويتجه الجهد إلى العلاقات والاتفاقات.","يحلّ المريخ في برج العقرب تقريبًا يوم {d}، فتشتد الإرادة وتعمل القوة في العمق وبلا ضجيج.","يدخل المريخ برج القوس تقريبًا يوم {d}، فتتجه الطاقة إلى مغامرة وقضية وحماس لا يقبل الانتظار.","يمر المريخ إلى برج الجدي تقريبًا يوم {d}، فتتركز القوة في هدف طويل وصبر منظم على الصعود.","يغادر المريخ إلى برج الدلو تقريبًا يوم {d}، فيشتد الميل إلى التمرد على المعتاد والعمل مع الجماعة.","ينزل المريخ في برج الحوت تقريبًا يوم {d}، فتلين الحدة وتحتاج الطاقة إلى مجرى فني أو روحي."],"jupiter":["يدخل المشتري برج الحمل تقريبًا يوم {d}، فتبدأ مرحلة طويلة تكافئ الجرأة والمبادرة الصادقة.","ينزل المشتري في برج الثور تقريبًا يوم {d}، فيتجه النمو إلى المال والمقتنيات وما يُبنى ببطء.","يصل المشتري إلى برج الجوزاء تقريبًا يوم {d}، فيتسع التعلم وتكثر الصلات وتتعدد الطرق أمامك.","يعبر المشتري إلى برج السرطان تقريبًا يوم {d}، فيكبر البيت والأسرة ويكثر العطاء العاطفي.","يشرق المشتري في برج الأسد تقريبًا يوم {d}، فيمنح الإبداع والحب والظهور مساحة أرحب لتنمو.","يبلغ المشتري برج العذراء تقريبًا يوم {d}، فيكبر المعنى في العمل المتقن وفي خدمة تراها الناس.","يحلّ المشتري في برج الميزان تقريبًا يوم {d}، فيتجه النمو إلى الشراكات والعدل والاتفاقات الجيدة.","يدخل المشتري برج العقرب تقريبًا يوم {d}، فيتوسع العمق وتفتح أبواب التحول والثقة المشتركة.","ينتقل المشتري إلى برج القوس تقريبًا يوم {d}، فيعود إلى بيته وتتسع المعرفة والسفر والإيمان.","يمر المشتري إلى برج الجدي تقريبًا يوم {d}، فيتعلم النمو الصبر وتكبر المكانة بخطوات ثابتة.","يغادر المشتري إلى برج الدلو تقريبًا يوم {d}، فيكبر الأمل بالجماعة وبأفكار تفتح طرقًا جديدة.","ينزل المشتري في برج الحوت تقريبًا يوم {d}، فيتعمق الإيمان وتنمو الرحمة والخيال والأعمال الصامتة."],"saturn":["يدخل زحل برج الحمل تقريبًا يوم {d}، فتبدأ سنوات تعلّمك كيف تبادر بمسؤولية وبلا تهور.","ينزل زحل في برج الثور تقريبًا يوم {d}، فتُختبر علاقتك بالمال والاستقرار وما تظن أنه أمانك.","يصل زحل إلى برج الجوزاء تقريبًا يوم {d}، فيُطلب منك أن تفكر وتتكلم بانضباط وصدق أكبر.","يعبر زحل إلى برج السرطان تقريبًا يوم {d}، فتُراجع الأسرة والبيت وما حملته من مشاعر قديمة.","يشرق زحل في برج الأسد تقريبًا يوم {d}، فيُختبر معنى الثقة والحب والظهور بلا تصنع.","يبلغ زحل برج العذراء تقريبًا يوم {d}، فيُحاسب العمل والعادات والنظام بجدية وهدوء.","يحلّ زحل في برج الميزان تقريبًا يوم {d}، فتُوزن العلاقات والالتزامات بميزان أصدق وأثقل.","يدخل زحل برج العقرب تقريبًا يوم {d}، فتتجه المراجعة إلى الخوف والثقة والعمق الذي تتجنبه.","ينتقل زحل إلى برج القوس تقريبًا يوم {d}، فتُفحص قناعاتك ومعتقداتك ورؤيتك لما هو أبعد.","يعود زحل إلى بيته في برج الجدي تقريبًا يوم {d}، فيشتد الجد وتُبنى الأهداف على أساس متين.","يمر زحل إلى برج الدلو تقريبًا يوم {d}، فتُختبر علاقتك بالجماعة وبحريتك وبأفكار المستقبل.","يغادر زحل إلى برج الحوت تقريبًا يوم {d}، فتُراجع الأحلام والغموض والملاذات التي تهرب إليها."],"uranus":["يدخل أورانوس برج الحمل تقريبًا يوم {d}، فتتحرر الهوية من قوالبها وتميل إلى البدء من جديد.","ينزل أورانوس في برج الثور تقريبًا يوم {d}، فتهتز قيمة الأشياء وتُراجع علاقتك بالمال والثبات.","يصل أورانوس إلى برج الجوزاء تقريبًا يوم {d}، فتتبدل طرق الكلام والتعلم وتتسارع الأفكار.","يعبر أورانوس إلى برج السرطان تقريبًا يوم {d}، فيتغير معنى البيت والأسرة والانتماء.","يشرق أورانوس في برج الأسد تقريبًا يوم {d}، فتخرج الأصالة من الظل وتتجدد طريقتك في الظهور.","يبلغ أورانوس برج العذراء تقريبًا يوم {d}، فتتجدد طرق العمل وتُراجع العادات القديمة.","يحلّ أورانوس في برج الميزان تقريبًا يوم {d}، فتتغير صيغ العلاقات والاتفاقات المألوفة.","يدخل أورانوس برج العقرب تقريبًا يوم {d}، فتنكشف أعماق كانت مخبأة وتتبدل قواعد الثقة.","ينتقل أورانوس إلى برج القوس تقريبًا يوم {d}، فتتبدل نظرتك إلى الإيمان والسفر والمعرفة.","يمر أورانوس إلى برج الجدي تقريبًا يوم {d}، فتتزعزع أبنية قديمة وتنشأ طرق مختلفة للنجاح.","يعود أورانوس إلى بيته في برج الدلو تقريبًا يوم {d}، فتتسارع الأفكار الجديدة والتحرر من المألوف.","يغادر أورانوس إلى برج الحوت تقريبًا يوم {d}، فتتبدل نظرتك إلى الحدس والحلم والروح."],"neptune":["يدخل نبتون برج الحمل تقريبًا يوم {d}، فتبدأ مرحلة تمتزج فيها الهوية بحلم جديد وبحث عن معنى.","ينزل نبتون في برج الثور تقريبًا يوم {d}، فتضبب الصورة حول المال والأمان وتسمو الحواس.","يصل نبتون إلى برج الجوزاء تقريبًا يوم {d}، فيختلط الواقع بالكلمات ويحتاج الصدق إلى تدقيق.","يعبر نبتون إلى برج السرطان تقريبًا يوم {d}، فتتأثر الأسرة بالمثالية والحنين وتتسع الرحمة.","يشرق نبتون في برج الأسد تقريبًا يوم {d}، فتتجه الأحلام إلى الإبداع والحب والشهرة الهادئة.","يبلغ نبتون برج العذراء تقريبًا يوم {d}، فيذوب الحد بين الخدمة والتضحية ويحتاج العمل إلى معنى.","يحلّ نبتون في برج الميزان تقريبًا يوم {d}، فتغلب المثالية على العلاقات ويصعب رؤيتها كما هي.","يدخل نبتون برج العقرب تقريبًا يوم {d}، فتتعمق الأسرار ويلتبس الحد بين الحب والتعلق.","ينتقل نبتون إلى برج القوس تقريبًا يوم {d}، فيتسع الإيمان ويشتد الشوق إلى حقيقة أكبر.","يمر نبتون إلى برج الجدي تقريبًا يوم {d}، فتتبدل أحلام المكانة وتضعف الثقة بالبنى القديمة.","يغادر نبتون إلى برج الدلو تقريبًا يوم {d}، فتنتشر أحلام الجماعة وتغشاها صور مثالية للغد.","يعود نبتون إلى بيته في برج الحوت تقريبًا يوم {d}، فيشتد الخيال والتعاطف وتذوب الفواصل."],"pluto":["يدخل بلوتو برج الحمل تقريبًا يوم {d}، فتبدأ حقبة تُعاد فيها ولادة الهوية والإرادة من الأساس.","ينزل بلوتو في برج الثور تقريبًا يوم {d}، فيعاد تشكيل المال والقيم وما تظنه ملكًا لك.","يصل بلوتو إلى برج الجوزاء تقريبًا يوم {d}، فتتحول لغة الناس وأفكارهم وطرق تواصلهم.","يعبر بلوتو إلى برج السرطان تقريبًا يوم {d}، فتتغير بنية الأسرة والبيت من الجذور.","يشرق بلوتو في برج الأسد تقريبًا يوم {d}، فتتحول علاقتك بالقوة الشخصية والإبداع والحب.","يبلغ بلوتو برج العذراء تقريبًا يوم {d}، فتتجدد أنظمة العمل والعادات بعمق لا رجعة فيه.","يحلّ بلوتو في برج الميزان تقريبًا يوم {d}، فتخضع العلاقات والعدالة لتحول يكشف حقيقتها.","يعود بلوتو إلى بيته في برج العقرب تقريبًا يوم {d}، فتشتد قوة التحول والكشف والتطهير.","يدخل بلوتو برج القوس تقريبًا يوم {d}، فتتحول المعتقدات الكبرى وتتغير نظرة الناس إلى الحقيقة.","ينتقل بلوتو إلى برج الجدي تقريبًا يوم {d}، فتُفكك أبنية السلطة والمكانة وتُبنى من جديد.","يمر بلوتو إلى برج الدلو تقريبًا يوم {d}، فتتحول الجماعات والتقنية وصور المستقبل.","يغادر بلوتو إلى برج الحوت تقريبًا يوم {d}، فتتحول الروح والخيال والملاذات في العمق."]};

;
/* assets/js/sky-reading-block.js */
/* كتلة قراءة العبور الموحدة: حلقة المدة المتبقية، السطر الافتتاحي، وزر «تعمّق أكثر» داخل النافذة نفسها */
(function () {
  var STEP = { moon: 0.25, sun: 1, mercury: 1, venus: 1, mars: 2, jupiter: 8, saturn: 20, uranus: 40, neptune: 60, pluto: 60 };
  var CAP = { moon: 6, sun: 40, mercury: 60, venus: 90, mars: 120, jupiter: 450, saturn: 1300, uranus: 3200, neptune: 6500, pluto: 9500 };
  var cache = {}, pass = {};
  function signAt(k, ms) {
    var A = window.Astro, jdUt = A.jdFromMs(ms), jde = jdUt + A.deltaT(A.yearOf(jdUt)) / 86400;
    return Math.floor(A.norm(A.lonOf(k, jde)) / 30);
  }
  function edge(k, from, dir, sg) {
    var DAY = 864e5, st = (STEP[k] || 1) * DAY, cap = (CAP[k] || 100) * DAY, a = from, b = from, n = 0;
    while (n * st < cap) { b = from + dir * (++n) * st; if (signAt(k, b) !== sg) break; a = b; }
    if (n * st >= cap) return null;
    for (var i = 0; i < 11; i++) { var m = (a + b) / 2; if (signAt(k, m) === sg) a = m; else b = m; }
    return { ms: (a + b) / 2, sign: signAt(k, b) };
  }
  function stay(k, ms) {
    var pc = pass[k]; if (pc && ms >= pc.start && ms < pc.end) return { start: pc.start, end: pc.end, next: pc.next, pct: (ms - pc.start) / (pc.end - pc.start) };
    var ck = k + '|' + Math.floor(ms / (k === 'moon' ? 36e5 : 864e5)); if (cache[ck] !== undefined) return cache[ck];
    var r = null;
    try {
      if (window.Astro) {
        var sg = signAt(k, ms), s = edge(k, ms, -1, sg), e = edge(k, ms, 1, sg);
        if (s && e && e.ms > s.ms) r = { start: s.ms, end: e.ms, next: e.sign, pct: Math.min(1, Math.max(0, (ms - s.ms) / (e.ms - s.ms))) };
      }
    } catch (x) { r = null; }
    if (r) pass[k] = r;
    return (cache[ck] = r);
  }
  function ar(n) { try { return n.toLocaleString('ar-EG'); } catch (e) { return String(n); } }
  function span(msLeft) {
    var h = msLeft / 36e5, d = h / 24;
    if (d < 2) return 'نحو ' + ar(Math.max(1, Math.round(h))) + ' ساعة';
    if (d < 60) return ar(Math.round(d)) + ' يومًا';
    var mo = d / 30.44; if (mo < 24) return ar(Math.round(mo)) + ' شهرًا';
    var y = Math.round(d / 365.25 * 10) / 10; return ar(y) + ' سنة';
  }
  function paras(t) {
    var s = String(t).replace(/([.؟!])\s+/g, '$1\u0001').split('\u0001'), out = [], cur = '';
    s.forEach(function (x) { cur = cur ? cur + ' ' + x : x; if (cur.split(/\s+/).length >= 55) { out.push(cur); cur = ''; } });
    if (cur) out.push(cur); return out;
  }
  function ring(k, ms) {
    var S = stay(k, ms), D = window.AqSky; if (!S || !D || !D.PLANETS[k]) return '';
    var C = 2 * Math.PI * 24, done = (C * S.pct).toFixed(1), gl = D.gl ? D.gl(D.PLANETS[k].g) : '';
    return '<div class="trm-ring"><span class="trm-dial" aria-hidden="true"><svg viewBox="0 0 60 60"><circle class="trm-rest" cx="30" cy="30" r="24"/><circle class="trm-done" cx="30" cy="30" r="24" stroke-dasharray="' + done + ' ' + C.toFixed(1) + '" transform="rotate(-90 30 30)"/></svg><span class="sg">' + gl + '</span></span>' +
      '<div class="trm-ring-t"><b>متبقٍّ ' + span(S.end - ms) + '</b><small>حتى انتقال ' + D.PLANETS[k].n + ' إلى برج ' + D.SIGNS[S.next].n + ' · مضى ' + ar(Math.round(S.pct * 100)) + '٪</small></div></div>';
  }
  function fill() {
    [].forEach.call(document.querySelectorAll('.trm-slot[data-k]'), function (el) {
      var k = el.getAttribute('data-k'), ms = +el.getAttribute('data-ms'); el.removeAttribute('data-k');
      try { el.outerHTML = ring(k, ms); if (window.AqUpGlyphs) window.AqUpGlyphs(); } catch (e) { el.remove(); }
    });
  }
  function block(k, h, full, ms) {
    var R = window.AqReadings, lead = R && R.TL && R.TL[k] && R.TL[k][h - 1], ps = paras(full);
    if (!lead || ps.length < 2) return '<div class="trm">' + ps.map(function (x) { return '<p>' + x + '</p>'; }).join('') + '</div>';
    var t0 = ms || Date.now();
    setTimeout(function () { fill(); }, 40);
    return '<div class="trm"><div class="trm-slot" data-k="' + k + '" data-ms="' + t0 + '"></div><p class="trm-lead">' + lead + '</p><p class="trm-tz">' + ps[0] + '</p>' +
      '<button type="button" class="trm-bn" data-trm aria-expanded="false"><span class="trm-bn-t">تعمّق في القراءة كاملة</span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>' +
      '<div class="trm-full" hidden>' + ps.slice(1).map(function (x) { return '<p>' + x + '</p>'; }).join('') + '</div></div>';
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-trm]'); if (!b) return;
    var box = b._trmBox || b.closest('.trm, .swp-fold'), f = b._trmF || (box && box.querySelector('.trm-full, .swp-full')); if (!f) return;
    var open = f.hidden; f.hidden = !open; b.setAttribute('aria-expanded', open); box.classList.toggle('is-open', open);
    var t = b.querySelector('.trm-bn-t'); if (t) t.textContent = open ? 'إخفاء التفاصيل' : 'تعمّق في القراءة كاملة';
    /* عند الفتح: التفاصيل ثم الزر في آخر الورقة تماماً؛ وعند الإغلاق يرجعان مكانهما */
    var host = box.closest('.aqm-sheet-body, .swp-body, #sky-panel') || box.parentNode;
    if (open) {
      b._trmBox = box; b._trmF = f; b._trmMk = document.createComment('trm');
      b.parentNode.insertBefore(b._trmMk, b);
      var q = null; for (var c = host.firstElementChild; c; c = c.nextElementSibling) if (c.classList && c.classList.contains('swm-q')) { q = c; break; }
      if (q) { host.insertBefore(f, q); host.insertBefore(b, q); } else { host.appendChild(f); host.appendChild(b); }
    } else if (b._trmMk && b._trmMk.parentNode) {
      b._trmMk.parentNode.insertBefore(b, b._trmMk); b._trmMk.remove(); b._trmMk = null; b._trmF = null;
      box.appendChild(f);
    }
  });
  window.AqReadingBlock = { block: block, stay: stay };
})();

;
/* assets/js/sky-moon-signs.js */
/* القمر في الأبراج: نص يومي لكل برج، بالترتيب من الحمل إلى الحوت */
window.AqMoonSigns = [{"t": "شرارة صغيرة تكفي اليوم لتشعل ردة فعلك: شخص يتأخر في الرد على رسالتك، أو طابور لا يتحرك، أو فكرة تخطر لك في الصباح وتريد تنفيذها قبل الظهر. القمر في الحمل يحرك مشاعرك قبل أن تفكر فيها، وفي هذا الاندفاع صدق وطاقة بدء نادرة، لكنه يسبق صبرك. ابدأ ما تريده في أمر صغير يمكن إنهاؤه اليوم، وأجّل الرد على من أزعجك ساعة واحدة. وما تحس به أول مرة هو شعورك الحقيقي، أما ما تقوله بعده بدقائق فغالبًا دفاع عنه. ويمكث القمر هنا نحو يومين ونصف.", "q": "ما الذي تريد أن تبدأه اليوم ولا تنتظر موافقة أحد عليه؟"}, {"t": "تريد اليوم شيئًا تلمسه بيدك ويطمئنك: وجبة تحبها، أو مقعدًا مريحًا، أو صوتًا مألوفًا في البيت. القمر في الثور يبطئ مشاعرك لكنه يثبتها، فمن يستعجلك في قرار يلقى منك عنادًا هادئًا لا يتزحزح. اليوم مناسب لترتيب المال الصغير وللراحة والماء والنوم المنتظم. ولا تحكم على علاقة من أول إحساس بالضيق، فمزاجك الآن يميل إلى التمسك بما اعتاد عليه حتى حين يحتاج إلى تغيير. وإن اشتهيت شيئًا جميلًا فاشترِه بقدر ما يفرحك لا بقدر ما يثبت لك شيئًا، ثم اترك الباقي ليومه.", "q": "ما الشيء المألوف الذي يعيد إليك أمانك اليوم، وهل تمنحه لنفسك؟"}, {"t": "مزاجك اليوم يركب موجة الكلام: رسالة تضحكك، ثم خبر يشغلك، ثم فكرة تنسيك ما سبقها. القمر في الجوزاء يجعلك تحتاج إلى من تتحدث معه حتى تفهم ما تشعر به، وقد تقول جملة لا تقصدها كلها لأن الحماس سبق التفكير. اليوم مناسب للمكالمات والكتابة والتعلم والتنقل القصير. وإن شعرت بتشتت فاكتب ثلاث نقاط تريد إنجازها، فالوعي بما يدور في رأسك يهدئه. وما لا تستطيع الإجابة عنه الآن يمكن أن يتضح غدًا بعد حديث بسيط، فلا تُثقل نفسك بحسم كل شيء قبل المساء.", "q": "مع من تحتاج أن تتحدث اليوم لتفهم ما في داخلك فعلًا؟"}, {"t": "قبل أن يتكلم من حولك تكون قد التقطت مزاجهم. القمر في السرطان، وهو في بيته الطبيعي، يرفع حساسيتك وتتذكر نكهة أكلة قديمة، أو صوت أحد من الأهل، أو مكانًا في طفولتك، فيرق قلبك فجأة. الأمان اليوم لا يأتي من الإنجاز بل من القرب: مكالمة مع من تحب، أو مائدة يجتمع عليها أهل البيت. واحذر من أن تأخذ نبرة عابرة على أنها رفض لك. واسمح لنفسك أن تنسحب إلى مكان هادئ حين يزدحم الجو، فهذا ليس هروبًا بل شحن لما نفد منك.", "q": "من الذي تحتاج أن تطمئن عليه اليوم، ومن الذي يستحق أن يطمئن عليك؟"}, {"t": "كلمة شكر واحدة قد تغيّر مزاجك كله اليوم، وغيابها يؤلمك أكثر مما تعترف. القمر في الأسد يجعل مشاعرك دافئة وكريمة، تحب أن تفرح الناس وتنظم لقاء أو تقدم هدية دون سبب. غير أن الكبرياء حاضر أيضًا، وقد تنتظر من أحد أن يبادر قبلك فتصمت وهو لا يعرف. قل ما تحتاجه من تقدير بجملة مباشرة، وامنح غيرك ما تريده لنفسك. وإن ظهرت فرصة للتعبير عن موهبتك أمام جمع صغير فاغتنمها، فالضوء الذي تعطيه اليوم يعود إليك أكبر في اليوم التالي.", "q": "من الذي يحتاج منك اليوم كلمة تقدير صادقة، وهل قلتها له؟"}, {"t": "حين يتبعثر شيء حولك يتبعثر شيء فيك: درج مفتوح، أو قائمة مهام طويلة، أو ملف قديم. القمر في العذراء يجعل القلق اليوم يتخذ شكل التفاصيل، فتنتبه إلى خطأ صغير في رسالة أو إلى ما ينقص الجدول. هذا الانتباه يفيدك في العمل، لكنه قد يتحول إلى نقد قاسٍ لنفسك أو لمن حولك. افعل ما تستطيع إنجازه ثم أغلق الباب على القلق. وخصص وقتًا لما يخدمك فعلًا: وجبة مرتبة، ومشيًا قصيرًا، وسريرًا نظيفًا قبل النوم، فالاعتناء البسيط بالنفس يخفف حدة المراجعة الداخلية.", "q": "ما الشيء الصغير الذي إن رتبته اليوم شعرت بأن رأسك خفّ؟"}, {"t": "أي توتر في الجو يصل إليك قبل غيرك، فتحاول أن تلطّف الحديث وتصلح ما بين الناس. القمر في الميزان يجعلك تحتاج إلى شريك أو صديق يشاركك القرار، فالتفرد بالرأي يتعبك اليوم. وقد تجد صعوبة في اختيار شيء بسيط لأنك ترى كل الجوانب. اكتب وجهتي النظر في ورقة ثم اختر واحدة قبل المساء. واحذر أن تقول نعم لتتجنب جدالًا ثم تحمل الغضب في صدرك. الجمال من حولك يريحك: ترتيب مكانك، وموسيقى هادئة، ولقاء لطيف بلا أجندة، وكلها تعيد إليك توازنك.", "q": "هل تقول نعم اليوم لأنك توافق أم لأنك تخاف من الخلاف؟"}, {"t": "ما لا يُقال في الغرفة تسمعه أنت اليوم. القمر في العقرب يغوص بمشاعرك أعمق مما تُظهر، فتلاحظ تفصيلة في سلوك أحد وتقرأ منها ما لم يقله، وقد يعود إلى بالك أمر قديم لم تغلقه. هذا اليوم يكشف الصدق من التمثيل، فلا ترضى بمجاملة تعرف أنها فارغة. غير أن الشك قد يكبر في الصمت، فاسأل مباشرة قبل أن تحكم. وإن اشتدت غيرتك أو رغبتك في السيطرة فاكتبها ولا ترسلها. من يحسن التعامل مع هذه الطاقة يخرج منها بتجديد نادر وبعلاقة أصدق.", "q": "ما الشعور الذي تتجنب أن تنظر إليه اليوم، وماذا سيقول لو تركته يتكلم؟"}, {"t": "يضيق عليك المكان المألوف اليوم، وتشتهي خروجًا أو فكرة كبيرة أو ضحكة بلا حساب. القمر في القوس يجعل مزاجك متفائلًا وصريحًا، وقد يصل بك الأمر إلى قول الحقيقة بقوة فتجرح من لا يتوقع. اغتنم هذه الطاقة في تعلم شيء جديد أو تخطيط رحلة أو لقاء يوسع أفقك. وإن أحسست بالملل من علاقة فلا تقرر الرحيل في يوم واحد، فالحماس يتبدل بعد يومين. والأفق الواسع يحتاج إلى أرض ثابتة تعود إليها، فاحفظ ما لا تريد أن تخسره وأنت تحلق.", "q": "أي مكان أو فكرة تشتهي اليوم أن تهرب إليها، وما الذي يدفعك إليها؟"}, {"t": "تتعامل مع مشاعرك اليوم كأنها قائمة مهام: عمل مؤجل، أو مسؤولية على كتفيك، أو أمر لا تريد أن يراك أحد ضعيفًا فيه. القمر في الجدي يميل بك إلى الجدية والإنجاز الهادئ والتخطيط الطويل، لكنه قد يجعلك قاسيًا مع نفسك. لا تعدّ الراحة مكافأة تنالها بعد الانتهاء، فهي جزء من العمل. واسمح لشخص قريب أن يرى تعبك دون أن تشرح كثيرًا. من يتحمل وحده يظن أن الآخرين لا يريدون أن يساعدوا، بينما هو لم يطلب، ومن يطلب بهدوء يوفر على الجميع التخمين.", "q": "ما العبء الذي تحمله وحدك ويمكنك اليوم أن تشارك أحدًا فيه؟"}, {"t": "حاجتك إلى مسافة اليوم ليست جفاء. القمر في الدلو يجعلك تبتعد عن الضجيج وعن توقعات الآخرين وعن مشاعر تُطلب منك بلا مقدمات، وتصير أفكارك أغرب وأحرّ، وقد تتحمس لمجموعة أو لقضية أو لتجربة مختلفة. لا تأخذ بُعدك العاطفي على أنه برود، فأنت تفهم الأشياء بعقلك أولًا ثم تشعر بها. ومع ذلك قل لمن يحبك إنك بخير ولكنك تحتاج وقتًا، فهذه الجملة تحمي القرب. وإن أعجبتك فكرة جديدة فسجلها في ملاحظة قصيرة، فقد تتحول بعد أسابيع إلى مشروع.", "q": "ما الفكرة التي تتجنب قولها لأنها قد تبدو غريبة، وهل هي فعلًا كذلك؟"}, {"t": "تدمع عينك أمام مقطع موسيقي أو ذكرى أو قصة عابرة، دون أن تعرف اسم ما يحركك. القمر في الحوت يجعل الحدود بينك وبين من حولك رقيقة، فتتأثر بحزن أحدهم وتحمل وزنه وهو لم يطلب. هذا اليوم مناسب للصمت والتأمل والإبداع والدعاء. وانتبه إلى أن تقول لا حين يطلب أحد منك أكثر مما تحتمل، ولا تتخذ قرارًا كبيرًا وأنت في ضباب الشعور. اكتب ما تحسه بحرية، فالورقة تحتمل ما لا يحتمله الكلام، وبعد ساعة من الكتابة يصير ما تحمله أخف وأوضح.", "q": "ما الذي تحمله اليوم عن غيرك ولا يخصك، وهل يمكنك أن تضعه جانبًا؟"}];

;
/* assets/js/sky-aspect-library.js */
/* مكتبة توقعات الأسبكتات في صفحة السماء: نص خاص لكل كوكبين وزاوية، يُضاف إلى النص القديم ولا يمحوه.
   الملفات في assets/data/sky-aspects: index.json (المجموعات المتاحة) وstages.json (سطر حالة الزاوية)
   وملف لكل مجموعة (moon.json ...) مفتاح كل نص: كوكب|كوكب|زاوية بترتيب الكواكب المعتاد.
   إن لم يوجد نص للتركيبة يبقى القالب القديم كما هو. */
(function () {
  'use strict';
  var BASE = 'assets/data/sky-aspects/';
  var LIB = {}, STAGES = null, ready = false, busy = false;

  function getJSON(name) {
    return fetch(BASE + name, { cache: 'default' }).then(function (r) { if (!r.ok) throw new Error(name); return r.json(); });
  }
  function load() {
    if (busy) return; busy = true;
    getJSON('index.json').then(function (idx) {
      var v = idx.version ? '?v=' + idx.version : '';
      var jobs = (idx.groups || []).map(function (g) {
        return fetch(BASE + g + '.json' + v).then(function (r) { return r.ok ? r.json() : {}; }).then(function (d) { for (var k in d) LIB[k] = d[k]; }).catch(function () { });
      });
      jobs.push(fetch(BASE + 'stages.json' + v).then(function (r) { return r.ok ? r.json() : null; }).then(function (s) { STAGES = s; }).catch(function () { }));
      return Promise.all(jobs);
    }).then(function () { ready = true; apply(); }).catch(function () { busy = false; });
  }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function stageLine(pair, ph) {
    if (!STAGES || !ph) return '';
    var k = pair.split('|')[2], type = k === 'conj' ? 'conj' : (k === 'square' || k === 'opp') ? 'hard' : 'soft';
    var arr = STAGES[type] && STAGES[type][ph]; if (!arr || !arr.length) return '';
    return arr[(hash(pair) + Math.floor(Date.now() / 864e5)) % arr.length];
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function apply() {
    if (!ready) return;
    var list = document.querySelectorAll('#sky-asp .ax[data-pair]');
    for (var i = 0; i < list.length; i++) {
      var el = list[i], e = LIB[el.getAttribute('data-pair')];
      if (e && e.alt && (hash(el.getAttribute('data-pair')) + Math.floor(Date.now() / 864e5)) % 2) e = e.alt;
      if (!e || el.getAttribute('data-lib') === '1') continue;
      var bx = el.querySelector('.ax-b'); if (!bx) continue;
      var kids = [].slice.call(bx.children), intro = '', reality = '', oldQ = '', keep = '';
      kids.forEach(function (c) {
        if (c.classList.contains('ax-q')) oldQ += c.outerHTML;
        else if (c.classList.contains('ax-note')) keep += c.outerHTML;
        else if (c.querySelector('b')) reality += c.outerHTML;
        else intro += c.outerHTML;
      });
      var st = stageLine(el.getAttribute('data-pair'), el.getAttribute('data-ph'));
      var pk = el.getAttribute('data-pair').split('|'), era = LIB[pk[0] + '|' + pk[1] + '|era'];
      bx.innerHTML = intro + (era ? (era.t || []).map(function (p) { return '<p class="ax-era">' + esc(p) + '</p>'; }).join('') : '') + (e.t || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + reality +
        (st ? '<p class="ax-note ax-stage">' + esc(st) + '</p>' : '') + keep +
        (e.q ? '<p class="ax-q">' + esc(e.q) + '</p>' : '') + oldQ;
      el.setAttribute('data-lib', '1');
    }
  }
  window.AqAspLib = { get: function (pair) { var e = LIB[pair]; if (!e) return null; if (e.alt && (hash(pair) + Math.floor(Date.now() / 864e5)) % 2) e = e.alt; return { t: e.t || [], q: e.q || '' }; }, ready: function () { return ready; } };
  function boot() {
    /* لا تحميل عند البدء: وقت الخمول بعد اكتمال الصفحة، أو فور ظهور بطاقات الأسبكتات في #sky (المراقب أدناه) */
    var idle = function () { (window.requestIdleCallback || function (f) { setTimeout(f, 3500); })(load, { timeout: 6000 }); };
    if (document.readyState === 'complete') idle(); else window.addEventListener('load', function () { setTimeout(idle, 1200); });
    var host = document.getElementById('sky-asp'); if (!host) return;
    new MutationObserver(function () { if (!ready) { load(); } else { apply(); } }).observe(host, { childList: true, subtree: false });
    if (host.children.length) load();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

;
/* assets/js/sign-forecast-sheet.js */
/* نافذة «توقعات الأبراج»: تُفتح من الصفحة الرئيسية عند الضغط على أي كوكب أو القمر.
   تعرض عبور الكوكب الحقيقي الآن، ثم الأبراج الاثني عشر، وعند اختيار برج تظهر القراءة الخاصة به. */
(function () {
  'use strict';
  var root = document.documentElement, sheet = null, curK = null, curSign = null;
  function $(s, r) { return (r || document).querySelector(s); }
  function nd(n) { try { return n.toLocaleString('ar-EG'); } catch (e) { return String(n); } }
  function dayIdx() { return Math.floor((Date.now() + 2 * 36e5) / 864e5); }
  function dayTxt() { try { return new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' }); } catch (e) { return ''; } }
  function ensure() {
    if (sheet) return sheet;
    sheet = document.createElement('div'); sheet.className = 'aqm-sheet swp-sheet fc-sheet'; sheet.hidden = true;
    sheet.innerHTML = '<div class="aqm-sheet-scrim" data-fcc></div><div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-label="توقعات الأبراج"><span class="aqm-sheet-grip"></span>' +
      '<button type="button" class="aqm-sheet-x" data-fcc aria-label="إغلاق"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="aqm-sheet-body fc-body"></div><div class="aqm-sheet-foot"><button type="button" class="aqm-foot-close" data-fcc>إغلاق</button></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-fcc]')) { close(); return; }
      var sg = e.target.closest('.sky-sg'); if (sg) { pick(+sg.getAttribute('data-i')); return; }
      if (e.target.closest('a[href]')) close();
    });
    sheet.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    return sheet;
  }
  function close() { if (!sheet || sheet.hidden) return; var s = sheet; s.classList.add('is-closing'); setTimeout(function () { s.hidden = true; s.classList.remove('is-closing'); root.classList.remove('aqm-sheet-open'); }, 230); }
  function bodyOf(k) { var A = window.Astro; if (!A) return null; var c = A.chart({ utcMs: Date.now(), lat: 30, lon: 31, known: false }); for (var i = 0; i < c.bodies.length; i++) if (c.bodies[i].key === k) return c.bodies[i]; return null; }
  function moonPh() { return (curK === 'moon' && window.AqMoonPhase) ? window.AqMoonPhase(Date.now()) : null; }

  function card(i) {
    var D = window.AqSky, k = curK, bd = bodyOf(k), d = dayIdx();
    var P = D.PLANETS[k], sg = D.SIGNS[i], hh = ((bd.sign - i + 12) % 12) + 1, H = D.HOUSES[hh - 1], pf = D.PF[k], q = D.HQ[hh - 1], ex = D.HEX[hh - 1], mp = moonPh();
    var Rr = window.AqReadings, tr = Rr && Rr.TR[k][hh - 1];
    var qs = [tr ? D.PQH[k][hh - 1] : D.PQ[k], q[(d + i) % 2]];
    if (mp) qs.push(mp.p[5][d % 2]);
    var R = window.AqReadings, txt = R && R.PH[k] ? (R.TR[k][hh - 1] || R.PH[k][hh - 1]) : '', rt = bd.retro && R && R.RT[k] ? '<p class="swp-rt">' + R.RT[k] + '</p>' : '';
    var phase = mp ? '<div class="swp-row"><b>طور القمر اليوم · ' + mp.p[0] + ' · إضاءة ' + nd(mp.il) + '%</b><p>' + mp.p[6] + '</p></div>' : '';
    return '<article class="sky-card"><header class="sky-card-h"><span class="sky-card-ic" aria-hidden="true"><span class="sg">' + D.gl(P.g) + '</span></span><div><h4>' + P.n + ' في بيتك ' + H.n + '</h4><small>' + sg.n + ' · مجال ' + H.area + '</small></div></header>' +
      '<div class="swp-hook"><p>' + qs[0] + '</p></div>' +
      '<div class="swp-anat"><div class="swp-row swp-main"><b>قراءة اليوم</b>' + (window.AqReadingBlock ? window.AqReadingBlock.block(k, hh, txt) : '<p>' + txt + '</p>') + rt + '</div>' + phase + '</div>' +
      '<p class="swp-tease">هذا ما يظهر على السطح فقط. أما السبب، وما يمكنك فعله به، فيخص برجك وحده.</p></article>';
  }
  function pick(i) {
    if (curSign === i) {
      curSign = null;
      [].forEach.call(sheet.querySelectorAll('.sky-sg'), function (b) { b.classList.remove('is-on'); b.setAttribute('aria-pressed', 'false'); });
      sheet.querySelector('#fc-card').innerHTML = '<p class="sky-pick-empty">اختر برجك لتظهر قراءته.</p>';
      return;
    }
    curSign = i; try { localStorage.setItem('aq-sky-sign', i); } catch (e) { }
    [].forEach.call(sheet.querySelectorAll('.sky-sg'), function (b) { var on = +b.getAttribute('data-i') === i; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
    var box = sheet.querySelector('#fc-card'); box.innerHTML = card(i);
    if (window.AqUpGlyphs) window.AqUpGlyphs();
    setTimeout(function () { try { box.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { } }, 60);
  }
  /* الطاقة العامة للكوكب الآن وتأثيرها على الجميع، دون اختيار برج */
  function gen(k, bd, S) {
    var D = window.AqSky, P = D.PLANETS[k], R = window.AqReadings, o = '';
    var ms = k === 'moon' && window.AqMoonSigns && window.AqMoonSigns[bd.sign];
    var lead = (ms && ms.t) ? ms.t : ('يمرّ ' + P.n + ' الآن في ' + S.n + '، فيمنح ' + P.theme + ' طابعًا ' + S.way + '.');
    o += '<p class="fc-lead2">' + lead + '</p>';
    o += '<p>الأجواء تساعد على ' + S.strength + '، وتذكّرك بلطف أن تنتبه من ' + S.shadow + '، فهو الوجه الذي يظهر حين تتعب.</p>';
    var pl = R && R.PL && R.PL[k];
    if (pl) { o += '<h5>' + pl[0] + '</h5><p>' + pl[1] + '</p><p>' + pl[2] + '</p><div class="fc-ask"><b>ما يطلبه منك</b><p>' + pl[3] + '</p></div>'; }
    if (bd.retro && R && R.RT && R.RT[k]) o += '<p class="swp-rt">' + R.RT[k] + '</p>';
    return o;
  }
  function degTxt(d, sn) {
    if (d < 1) return 'في أول درجة من ' + sn;
    var w = d === 1 ? 'درجة واحدة' : d === 2 ? 'درجتين' : d <= 10 ? nd(d) + ' درجات' : nd(d) + ' درجة';
    return 'قطع ' + w + ' من ' + sn;
  }
  function build(k) {
    var D = window.AqSky, bd = bodyOf(k), P = D.PLANETS[k], S = D.SIGNS[bd.sign], deg = Math.floor(bd.lon % 30);
    var saved = null; try { saved = localStorage.getItem('aq-sky-sign'); } catch (e) { }
    var st = bd.retro ? ' · متراجع' : (k === 'sun' || k === 'moon' ? '' : ' · حركة مباشرة');
    var h = '<header class="fc-head"><span class="fc-medal" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="32" cy="32" r="28" stroke-dasharray="2 4.2"/><circle cx="32" cy="32" r="21"/><path d="M32 4v7M32 53v7M4 32h7M53 32h7"/></svg><span class="sg">' + D.gl(P.g) + '</span></span>' +
      '<div><span class="fc-ey">توقعات الأبراج</span><h3>ماذا تقول السماء لبرجك اليوم؟</h3></div></header>' +
      '<div class="fc-now"><div class="fc-now-top"><span class="fc-now-g" aria-hidden="true"><span class="sg">' + D.gl(S.g) + '</span></span><div class="fc-now-t"><small>' + dayTxt() + '</small><b>' + P.n + ' في ' + S.n + '</b><span>' + degTxt(deg, S.n) + st + '</span></div></div>' +
      '<div class="fc-now-about"><h4>' + (/^ال(شمس|زهرة)$/.test(P.n) ? 'ما هي ' : 'ما هو ') + P.n + '؟</h4><p>' + P.n + ' يمثل ' + P.theme + '، وهو العدسة التي تُقرأ بها ' + P.lens + '. حين يكون متوازنًا يعطيك ' + P.give + '، ويحتاج منك انتباهًا إلى ' + P.watch + '.</p></div></div>' +
      '<section class="fc-gen">' + gen(k, bd, S) + '</section>' +
      '<a class="swp-go" href="#signs"><span class="swp-go-ic" aria-hidden="true"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="19"/><circle cx="24" cy="24" r="12"/><path d="M24 5v7M24 36v7M5 24h7M36 24h7"/><circle class="swp-core" cx="24" cy="24" r="2.600"/></svg></span><span class="swp-go-t"><b>ما الذي لم نقله لك بعد؟</b><small>افتح توقعات برجك الكاملة، ففيها ما يخصك وحدك</small></span><span class="swp-go-ar" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></span></a>';
    return { html: h, saved: saved };
  }
  function open(k) {
    var D = window.AqSky; if (!D || !window.Astro || k === 'phase' || !D.PLANETS[k]) return false;
    if (!window.AqReadings && window.AqSkyTexts) { window.AqSkyTexts.load().then(function (ok) { if (ok) open(k); }); return true; }
    try {
      curK = k; curSign = null; var s = ensure(), b = build(k);
      s.querySelector('.fc-body').innerHTML = b.html; s.querySelector('.fc-body').scrollTop = 0;
      s.classList.remove('is-closing'); s.hidden = false; root.classList.add('aqm-sheet-open');
      if (window.AqUpGlyphs) window.AqUpGlyphs();
      
      return true;
    } catch (e) { return false; }
  }
  window.AqForecast = { open: open, close: close };
})();

;
/* assets/js/daily-banner.js */
/* Daily Energy Banner — slider logic (home only). Reads real data from existing sources:
   - ruler planet / sky: home-v2.js (SkyService) -> #aqh-energy-main
   - sun / moon / numerology day number / day theme: aqeeq-platform.js -> #aq-obs-*  */
(function () {
  'use strict';
  var root = document.getElementById('aqh-energy'), stage = document.getElementById('dbn-stage');
  if (!root || !stage || root.dataset.dbnInit === '1') return;
  root.dataset.dbnInit = '1';

  var AUTO_MS = 30000, IDLE_MS = 20000;
  var slides = [].slice.call(stage.querySelectorAll('.dbn-slide'));
  var dots = [].slice.call(root.querySelectorAll('.dbn-dot'));
  var bar = root.querySelector('.dbn-progress');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = 0, timer = null, idleTimer = null, hovering = false, userActive = false, userPaused = false, selecting = false;

  /* ---------- Live sky data: مصدر واحد = محرك Astro الموجود (نفس معاملات الموقع/المنصة) ---------- */
  var LAT = 30.0444, LON = 31.2357;               /* نفس إحداثيات aqeeq-platform.js / home-v2.js */
  var EL = ['نار', 'تراب', 'هواء', 'ماء'];        /* نفس ترتيب SIGNS[i].el */
  var PHASES = [[348.75, 'محاق'], [11.25, 'هلال متزايد'], [78.75, 'التربيع الأول'], [101.25, 'أحدب متزايد'], [168.75, 'بدر'], [191.25, 'أحدب متناقص'], [258.75, 'التربيع الأخير'], [281.25, 'هلال متناقص']];
  var $f = function (k) { return [].slice.call(root.querySelectorAll('[data-f="' + k + '"]')); };
  function setF(k, v, html) { $f(k).forEach(function (n) { if (html) n.innerHTML = v; else n.textContent = v; }); }
  function mod(x) { return ((x % 360) + 360) % 360; }
  function sd(a, b) { var d = mod(a - b); return d > 180 ? d - 360 : d; }  /* فرق موقّع في (-180,180] */
  function engine() { return (window.Astro && typeof window.Astro.chart === 'function') ? window.Astro : null; }
  function chartAt(ms) { return engine().chart({ utcMs: ms, lat: LAT, lon: LON, known: false }); }
  function body(c, k) { for (var i = 0; i < c.bodies.length; i++) if (c.bodies[i].key === k) return c.bodies[i]; return null; }
  function signName(i) { return (typeof SIGNS !== 'undefined' && SIGNS[i]) ? SIGNS[i].n : ''; }

  /* أيقونات SVG خطّية بدل رموز النص (لا تتحول لإيموجي على أي نظام) */
  var GL = {
    s0: 'M12 21V9M12 9C12 5.5 9.5 3.5 7 3.5S3.5 6 3.5 8M12 9C12 5.5 14.5 3.5 17 3.5S20.5 6 20.5 8',
    s1: 'M5 3.5C5 7.5 8 9 12 9S19 7.5 19 3.5M12 9.5a5.2 5.2 0 1 0 .01 0',
    s2: 'M6 4.5C9 6.2 15 6.2 18 4.5M6 19.5C9 17.8 15 17.8 18 19.5M9.5 5.5v13M14.5 5.5v13',
    s3: 'M4 11.5C4.5 7 9 5 13 5.5c3 .4 5.5 2 7 4M20 12.5C19.5 17 15 19 11 18.5c-3-.4-5.5-2-7-4M6.5 9.5a2.2 2.2 0 1 0 .01 0M17.5 14.5a2.2 2.2 0 1 0 .01 0',
    s4: 'M7.5 14.5a3 3 0 1 0 .01 0M10.5 14.5C10.5 9 10.5 5 14 5s4 4 2 7.500c-1.500 2.800-2 5.500.8 6.500 1.500.5 2.700-.3 3.200-1.500',
    s5: 'M3.500 5v12M3.500 8.500c0-4 5-4 5 0V17M8.500 8.500c0-4 5-4 5 0V17M13.500 8.500c0-4 5-4 5 2v5.500c0 3.500-2.500 5-5.500 4.500M13 18c1 2.500 5 3 7 .5',
    s6: 'M3.500 19.500h17M3.500 15h6C7.800 13.800 6.500 12 6.500 9.800 6.500 6.500 9 4.500 12 4.500s5.500 2 5.500 5.300c0 2.200-1.300 4-3 5.200h6',
    s7: 'M3.500 5v11M3.500 8.500c0-4 5-4 5 0V16M8.500 8.500c0-4 5-4 5 0V16c0 2.800 1.500 3.500 3.500 3.500h3M18 16.800l2.800 2.700L18 22.200',
    s8: 'M5 19L19 5M10 5h9v9M7 12.500l4.500 4.500',
    s9: 'M3.500 5.500c2.200 0 3.500 1.800 3.500 5V17M7 9C7 5 12.500 4.500 12.500 9v8c0 3 4 3.500 5.200.8.800-2-1-3.200-2.700-2.200-1.200.8-1 3 .8 4.200 1.500 1 3.500.8 4.700-.8',
    s10: 'M3.500 9l3.500-3 3.500 3 3.500-3 3.500 3 2-1.500M3.500 17l3.500-3 3.500 3 3.500-3 3.500 3 2-1.500',
    s11: 'M5 3.500C9.500 7 9.500 17 5 20.500M19 3.500C14.500 7 14.500 17 19 20.500M4 12h16',
    sun: 'M12 4a8 8 0 1 0 .01 0M12 11.200a.8.8 0 1 0 .01 0',
    moon: 'M19 14.500A8 8 0 1 1 9.500 5 6.500 6.500 0 0 0 19 14.500z',
    mercury: 'M12 9a4 4 0 1 0 .01 0M8 3c.6 2.800 7.400 2.800 8 0M12 13v8M9 18h6',
    venus: 'M12 3.500a4.700 4.700 0 1 0 .01 0M12 13v8M8.500 17h7',
    mars: 'M10 9.500a5 5 0 1 0 .01 0M13.800 10.200L20 4M14.500 4H20v5.500',
    jupiter: 'M5 7.500C8 3.500 14 5.500 12 10.500L5 16.500h15M16 8v12.500',
    uranus: 'M12 3v10M6.500 3v8M17.500 3v8M6.500 7h11M12 15.500a2.300 2.300 0 1 0 .01 0M12 13v.5',
    neptune: 'M12 21V8M8.500 21h7M5 3.500v4.500a7 7 0 0 0 14 0V3.500M12 3.500V8',
    pluto: 'M12 21v-9M8.500 18h7M7 5a5 5 0 0 0 10 0M12 7.500a2.200 2.200 0 1 0 .01 0',
    saturn: 'M8 3.500v13M5 7h6M8 11c2-3 7-3 7 1.500 0 3-3.200 4.500-3.200 7.500 0 1.200 1.200 1.500 2.200 1'
  };
  window.AqeeqGL = GL;
  function icon(k, cls) { var d = GL[k]; return d ? '<svg class="dbn-gl ' + (cls || '') + '" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.700" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="' + d + '"/></svg>' : ''; }
  function signGlyph(i) { return icon('s' + i); }
  function planetName(k) { return (typeof PLANETS !== 'undefined' && PLANETS[k]) ? PLANETS[k].n : k; }
  function planetGlyph(k) { return icon(k); }
  function deg(lon) { return Math.floor(mod(lon) % 30); }
  function fmtDT(ms) { try { return new Date(ms).toLocaleString('ar-EG-u-nu-latn', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return new Date(ms).toISOString(); } }
  function fmtT(ms) { try { return new Date(ms).toLocaleTimeString('ar-EG-u-nu-latn', { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
  function phaseOf(elong) { var name = PHASES[0][1]; for (var i = 1; i < PHASES.length; i++) if (elong >= PHASES[i][0]) name = PHASES[i][1]; if (elong >= 348.75) name = PHASES[0][1]; return name; }
  /* إيجاد لحظة عبور القمر حدّ البرج بالتنصيف على نتائج المحرك نفسه (لا خوارزمية بديلة) */
  function crossing(fromMs, dir, target) {
    var lo = dir > 0 ? fromMs : fromMs - 4 * 864e5, hi = dir > 0 ? fromMs + 4 * 864e5 : fromMs;
    var g = function (ms) { return sd(body(chartAt(ms), 'moon').lon, target); };
    if (!(g(lo) < 0 && g(hi) >= 0)) return null;
    for (var n = 0; n < 22; n++) { var mid = (lo + hi) / 2; if (g(mid) >= 0) hi = mid; else lo = mid; }
    return Math.round(hi);
  }
  /* رسم القمر من الاستطالة (الفرق بين خطي طول القمر والشمس) */
  var moonSeq = 0;
  function moonSvg(elong) {
    if (typeof window.AqeeqMoonImg === 'function') { try { return '<circle cx="60" cy="60" r="50" fill="#0b0a12"/><image href="' + window.AqeeqMoonImg(elong) + '" x="10" y="10" width="100" height="100"/><circle cx="60" cy="60" r="50" fill="none" stroke="#8E877C" stroke-opacity=".35" stroke-width=".8"/>'; } catch (er) {} }
    return moonSvgOld(elong);
  }
  function moonSvgOld(elong) {
    var c = Math.cos(elong * Math.PI / 180), rx = Math.abs(c) * 50, waxing = elong < 180;
    var sweep = c > 0 ? 0 : 1;
    var lit = 'M60 10 A50 50 0 0 1 60 110 A' + rx.toFixed(2) + ' 50 0 0 ' + sweep + ' 60 10Z';
    var tf = waxing ? '' : ' transform="translate(120 0) scale(-1 1)"';
    var u = 'dm' + (++moonSeq) + '_';
    /* قمر واقعي: كرة مظلّلة + بحار قمرية + فوهات بأشعة + حبيبات؛ الجانب المظلم يظهر بضوء الأرض الخافت، والجانب المضيء بحافة ناعمة */
    var rays = '<g stroke="#F8F3E8" stroke-opacity=".28" stroke-width=".5" fill="none"><path d="M78 84l10 12M78 84l-8 14M78 84l14-2M78 84l6-14"/><path d="M84 50l9-7M84 50l10 3M84 50l3 10"/></g>';
    return '<defs>' +
      '<radialGradient id="' + u + 'b" cx="38%" cy="34%" r="80%"><stop offset="0" stop-color="#F7F2E7"/><stop offset=".5" stop-color="#CFC7B8"/><stop offset=".85" stop-color="#8B8377"/><stop offset="1" stop-color="#5E574E"/></radialGradient>' +
      '<radialGradient id="' + u + 'l" cx="50%" cy="50%" r="50%"><stop offset=".78" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient>' +
      '<radialGradient id="' + u + 'h" cx="50%" cy="50%" r="50%"><stop offset=".78" stop-color="#E6C98F" stop-opacity="0"/><stop offset=".9" stop-color="#E6C98F" stop-opacity=".2"/><stop offset="1" stop-color="#E6C98F" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + u + 'e" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#6A6E78"/><stop offset="1" stop-color="#34363D"/></radialGradient>' +
      '<clipPath id="' + u + 'c"><circle cx="60" cy="60" r="50"/></clipPath>' +
      '<filter id="' + u + 'n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="11" result="t"/><feColorMatrix in="t" type="matrix" values="0 0 0 0 .32  0 0 0 0 .30  0 0 0 0 .28  0 0 0 .6 -.14"/></filter>' +
      '<filter id="' + u + 'm" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.4"/></filter>' +
      '<filter id="' + u + 's" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.6"/></filter>' +
      '<mask id="' + u + 'k"><rect width="120" height="120" fill="#fff"/><path d="' + lit + '" fill="#000" filter="url(#' + u + 's)"' + tf + '/></mask>' +
      '</defs>' +
      '<circle cx="60" cy="60" r="56" fill="url(#' + u + 'h)"/>' +
      '<g clip-path="url(#' + u + 'c)">' +
      '<circle cx="60" cy="60" r="50" fill="url(#' + u + 'b)"/>' +
      '<g filter="url(#' + u + 'm)" fill="#5F5951" opacity=".62"><ellipse cx="44" cy="38" rx="12" ry="9"/><ellipse cx="63" cy="36" rx="8" ry="7"/><ellipse cx="68" cy="54" rx="11" ry="8"/><ellipse cx="35" cy="58" rx="9" ry="15"/><ellipse cx="50" cy="68" rx="8" ry="6"/><ellipse cx="73" cy="73" rx="6" ry="5"/><ellipse cx="56" cy="50" rx="6" ry="4"/></g>' +
      '<g fill="none" stroke="#4F4943" stroke-opacity=".38" stroke-width="1"><circle cx="78" cy="84" r="5.5"/><circle cx="44" cy="82" r="4"/><circle cx="84" cy="50" r="3.5"/><circle cx="56" cy="92" r="3"/><circle cx="30" cy="42" r="3"/><circle cx="66" cy="22" r="2.6"/></g>' +
      '<g fill="#FBF7EE" opacity=".7"><circle cx="78" cy="84" r="1.7"/><circle cx="35" cy="64" r="1.3"/><circle cx="52" cy="52" r="1.2"/><circle cx="84" cy="50" r="1.1"/></g>' + rays +
      '<rect width="120" height="120" filter="url(#' + u + 'n)" opacity=".75"/>' +
      '<circle cx="60" cy="60" r="50" fill="url(#' + u + 'l)"/>' +
      '<g mask="url(#' + u + 'k)"><circle cx="60" cy="60" r="50" fill="url(#' + u + 'e)" opacity=".8"/></g>' +
      '</g>' +
      '<circle cx="60" cy="60" r="50" fill="none" stroke="#8E877C" stroke-opacity=".55" stroke-width="1"/>';
  }
  window.AqeeqMoon = moonSvg;
  function themeNum() { var m = /(\d+)/.exec(txt('aq-obs-daynum')); return m ? m[1] : ''; }
  function txt(id) { var n = document.getElementById(id); return n ? (n.textContent || '').trim() : ''; }
  var last = { key: '', ingKey: '' }, ing = null, errState = false;

  function renderStatic() {
    var d = new Date();
    function f(o) { try { return d.toLocaleDateString('ar-EG-u-nu-latn', o); } catch (e) { return ''; } }
    setF('wd', f({ weekday: 'long' })); setF('dateShort', f({ day: 'numeric', month: 'long' })); setF('year', f({ year: 'numeric' }));
    setF('dayNum', String(d.getDate())); setF('monthYear', f({ month: 'long', year: 'numeric' })); setF('dateLong', f({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
  }
  var MOON_TXT = ['طاقة اندفاع وبداية، تناسب المبادرة واتخاذ الخطوة الأولى', 'ميل للثبات والراحة، تناسب الاستقرار والاهتمام بالتفاصيل الحسية', 'فضول وكثرة حديث، تناسب التواصل والتعلم وتبادل الأفكار', 'حساسية أعلى ورغبة في الأمان، تناسب البيت والعائلة والاهتمام بالنفس', 'حضور وثقة وطاقة دافئة، تناسب الظهور والإبداع والتعبير الصادق', 'تركيز وترتيب، تناسب إنجاز المهام الصغيرة وتنظيم الأولويات', 'ميل للتوازن والعلاقات، تناسب الحوار الهادئ واتخاذ القرارات بروية', 'عمق ومشاعر مكثفة، تناسب مراجعة الداخل وإنهاء ما أرهقك', 'تفاؤل وتطلع للأمام، تناسب التخطيط والسفر وتوسيع الأفق', 'جدية والتزام، تناسب العمل المنظم وبناء الأهداف طويلة المدى', 'تفكير مختلف وروح مستقلة، تناسب الأفكار الجديدة والعمل الجماعي', 'خيال وحدس عاليان، تناسب الهدوء والتأمل والإصغاء لما بداخلك'];
  function phaseTxt(el) { if (el < 11.25 || el >= 348.75) return 'القمر في المحاق: وقت للسكون ونية بداية جديدة.'; if (el < 168.75) return 'القمر في طور النمو: وقت مناسب للبناء والتقدم بما بدأته.'; if (el < 191.25) return 'القمر بدر: ذروة الوضوح والمشاعر، وفرصة لحصاد ما زرعته.'; return 'القمر في طور التناقص: وقت للتهدئة والتخفف من الأعباء وإنهاء المعلّق.'; }
  var NUM_NOTE = { 1: 'ابدأ بخطوة واحدة واضحة ولا تؤجلها.', 2: 'اختر التعاون والإنصات، فالتوازن يسبق القرار.', 3: 'عبّر عن نفسك بصدق، فالكلمة اليوم تفتح الأبواب.', 4: 'رتّب أولوياتك وابنِ بثبات خطوة بعد خطوة.', 5: 'كن مرناً مع التغيير، وجرّب طريقاً جديداً بحذر.', 6: 'اعتنِ بمن حولك وبنفسك، فالانسجام يبدأ من البيت.', 7: 'خصّص وقتاً للهدوء والتأمل، فالإجابة تأتي من الداخل.', 8: 'وازن بين الطموح والمسؤولية، وركّز على الإنجاز الواقعي.', 9: 'أنهِ ما استنفد وقته وسامح، لتفسح مكاناً لبداية جديدة.', 11: 'أصغِ لحدسك اليوم، فهو أصدق من الضجيج حولك.', 22: 'فكّر بعيد المدى، فاليوم يناسب وضع أساس لشيء كبير.', 33: 'العطاء الصادق هو بوصلتك اليوم، فلا تنسَ نفسك فيه.' };
  var WEEK_LINE = ['الأحد: ابدأ أسبوعك بنية واضحة وخطوة صغيرة ثابتة.', 'الاثنين: اهتم بمشاعرك وبيتك قبل أي التزام جديد.', 'الثلاثاء: وجّه طاقتك لإنهاء مهمة مؤجلة بحسم.', 'الأربعاء: يوم مناسب للحديث والتواصل وتصحيح سوء الفهم.', 'الخميس: انظر للأمام وخطط لما تريد توسيعه.', 'الجمعة: يوم للامتنان والصحبة وتجديد الصلة بمن تحب.', 'السبت: رتّب ما تراكم وخفف الأعباء استعداداً لأسبوع جديد.'];
  function renderNumerology() {
    var n = themeNum(), th = txt('aq-obs-focus');
    setF('numDay', n ? 'الرقم ' + n : '—');
    setF('theme', th || '—'); setF('themeNote', NUM_NOTE[+n] || ''); setF('themeDay', WEEK_LINE[new Date().getDay()]); setF('themeSrc', n ? 'مصدر الرسالة: علم الأعداد — رقم اليوم ' + n : '');
  }
  function renderSky() {
    if (!engine()) { errState = true; setF('headline', 'تعذر حساب بيانات السماء حاليًا'); return; }
    var now = Date.now(), c = chartAt(now), sun = body(c, 'sun'), moon = body(c, 'moon');
    if (!sun || !moon) { errState = true; return; }
    errState = false;
    var elong = mod(moon.lon - sun.lon), illum = Math.round((1 - Math.cos(elong * Math.PI / 180)) / 2 * 100), ph = phaseOf(elong);
    var ruler = root.getAttribute('data-ruler') || '';
    var key = [sun.sign, deg(sun.lon), moon.sign, deg(moon.lon), ph, illum, ruler, new Date().toDateString()].join('|');
    if (key === last.key) { setF('updated', 'آخر تحديث ' + fmtT(now)); return; }
    last.key = key;
    var sunLine = signGlyph(sun.sign) + ' ' + signName(sun.sign) + ' ' + deg(sun.lon) + '°';
    var moonSign = signGlyph(moon.sign) + ' ' + signName(moon.sign);
    setF('sunLine', sunLine, 1); setF('moonSign', moonSign, 1); setF('phaseName', ph);
    setF('moonSignDeg', moonSign + ' · ' + deg(moon.lon) + '°', 1); setF('illum', illum + '%');
    setF('moonShort', moonSign, 1); setF('phaseIllum', ph + ' · ' + illum + '%');
    setF('updated', 'آخر تحديث ' + fmtT(now));
    [].forEach.call(root.querySelectorAll('[data-moon]'), function (sv) { sv.innerHTML = moonSvg(elong); sv.setAttribute('aria-label', 'القمر الآن: ' + ph + '، إضاءة ' + illum + '%'); });
    /* دخول/خروج القمر: يُعاد حسابه فقط عند تغير البرج */
    var ingKey = String(moon.sign) + '|' + new Date(now).toDateString();
    if (ingKey !== last.ingKey) {
      last.ingKey = ingKey;
      try {
        var base = Math.floor(mod(moon.lon) / 30) * 30;
        var enter = crossing(now, -1, base), exit = crossing(now, 1, mod(base + 30));
        setF('entered', enter ? fmtDT(enter) : 'غير متاح'); setF('exits', exit ? fmtDT(exit) + ' ← ' + signName((moon.sign + 1) % 12) : 'غير متاح');
      } catch (e) { setF('entered', 'غير متاح'); setF('exits', 'غير متاح'); }
    }
    setF('headline', 'القمر في ' + signName(moon.sign) + ' · ' + ph + ' بإضاءة ' + illum + '%');
    setF('moonDesc', MOON_TXT[moon.sign] + '. ' + phaseTxt(elong));
    setF('planetTheme', 'القمر في ' + signName(moon.sign) + ': ' + MOON_TXT[moon.sign] + '.');
    /* شريط الكواكب */
    var pl = ['mercury', 'venus', 'mars', 'jupiter', 'saturn'].map(function (k) { var b = body(c, k); if (!b) return ''; return '<span class="dbn-pl"><b>' + planetGlyph(k) + ' ' + planetName(k) + '</b> ' + signName(b.sign) + ' ' + deg(b.lon) + '°' + (b.retro ? ' <em>متراجع</em>' : '') + '</span>'; }).join('');
    setF('planets', pl, true);
  }
  /* السماء الآن: مواقع الكواكب الحية (نفس محرك Astro) + سطر تأثير مختصر تحت كل صف + ضغط الصف يفتح تفاصيل الكوكب في صفحة السماء */
  var LIVE_SETS = [['sun', 'moon', 'mercury'], ['venus', 'mars', 'jupiter'], ['saturn', 'uranus', 'neptune'], ['pluto', 'phase']];
  var ORDER = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  var FX = {
    mercury: ['عقلك أسرع اليوم، فقل ما في بالك بوضوح.', 'قبل أن ترسل أو توقّع: هل راجعت كلامك مرة أخرى؟'],
    venus: ['ما الذي يجعلك تشعر بأنك محبوب؟ اليوم يجيب بسهولة.', 'قد تعيد النظر فيمن وما تُقدّره. لا تتسرع.'],
    mars: ['عندك دافع واضح، فما أول خطوة تؤجلها؟', 'الطاقة موجودة لكنها تتعثر، فهدّئ السرعة وأعد الترتيب.'],
    jupiter: ['أين تشعر أن الأبواب بدأت تنفتح؟', 'النمو الآن يحدث في الداخل، فراجع ما تتمناه حقاً.'],
    saturn: ['ما الذي تبنيه ببطء وسيثبت معك؟', 'وقت تفقّد الأساسات: ما الذي يحتاج إلى إصلاح؟'],
    uranus: ['ما العادة القديمة التي تتمنى كسرها؟', 'تحرر هادئ من قيد قديم، دون استعجال.'],
    neptune: ['حدسك أنعم اليوم، فأنصت له.', 'الضباب حاضر؛ أجّل القرار حتى يتضح.'],
    pluto: ['ما الذي يتغير فيك ببطء ويستحق صبرك؟', 'مواجهة هادئة لما ينبغي أن تتركه خلفك.']
  };
  var SUN_SHORT = ['ما البداية التي تخشى أن تبدأها؟ الجرأة معك الآن.', 'ما الذي يمنحك راحة حقيقية؟ خذ وقتك فيه.', 'ما الذي يثير فضولك اليوم؟ اسأل وتعلّم.', 'من يحتاج إلى دفئك؟ ابدأ بنفسك.', 'ما الذي تتمنى أن يراه الناس فيك؟ اظهر.', 'ما التفصيلة الصغيرة التي ستريحك إن رتّبتها؟', 'أين فقدت توازنك؟ اليوم فرصة لاستعادته.', 'ما الذي تخفيه عن نفسك؟ اليوم يسمح لك بمواجهته.', 'إلى أين تريد أن تذهب؟ ارسم الطريق.', 'ما الهدف الذي يستحق صبرك؟ ابنِ خطوة.', 'ما الفكرة المختلفة التي تخجل منها؟ قلها.', 'ما الذي يهمس به حدسك؟ اترك مساحة للهدوء.'];
  var ASP_FX = { conj: 'طاقتان تمتزجان فتتضاعف قوتهما.', sext: 'فرصة هادئة تحتاج مبادرة بسيطة.', square: 'احتكاك يحرّك الأمور ويطلب قراراً.', trine: 'انسياب وسهولة يدعمان الطرفين.', opp: 'شدّ بين طرفين يطلب توازناً.' };
  var ASP_DEF = [['conj', 0, 'اقتران'], ['sext', 60, 'تسديس'], ['square', 90, 'تربيع'], ['trine', 120, 'تثليث'], ['opp', 180, 'مقابلة']];
  var MOON_Q = ["ما الذي تريد أن تبدأه بقلب شجاع؟", "ما الذي يمنحك أماناً بسيطاً اليوم؟", "مع من تحتاج أن تتكلم بصراحة؟", "ما الذي يلمس قلبك ويستحق أن تنتبه له؟", "ما الشعور الذي تريد أن تعبّر عنه بلا خجل؟", "ما الذي يستحق أن ترتّبه في يومك؟", "ما العلاقة التي تحتاج إلى هدوء وميزان؟", "ما الذي تشعر به عميقاً ولا تقوله؟", "أين تريد أن يأخذك فضولك؟", "ما الذي تتحمله وحدك ويمكنك أن تشاركه؟", "ما الفكرة التي تتمنى أن تحررها؟", "ما الذي يحتاج إلى سكون وحدس اليوم؟"];
  function moonShort(si) { return MOON_Q[si]; }
  function phaseShort(el) { if (el < 11.25 || el >= 348.75) return 'وقت السكون: ما نيتك الجديدة؟'; if (el < 78.75) return 'بداية تتشكل: ما الذي تريد أن ينمو؟'; if (el < 101.25) return 'لحظة قرار: ما الذي تلتزم به؟'; if (el < 168.75) return 'الطاقة تعلو: أكمل ما بدأته.'; if (el < 191.25) return 'ذروة وضوح: ما الذي ظهر لك أخيراً؟'; if (el < 258.75) return 'وقت الامتنان: ما الذي تعلّمته؟'; if (el < 281.25) return 'وقت التخلي: ما الذي تتركه؟'; return 'الطاقة تهدأ، فاسمح لنفسك بالراحة.'; }
  function lvRow(k, b, fx) {
    return '<div class="dbn-lv k-' + k + (b.retro ? ' is-retro' : '') + '" data-planet="' + k + '" role="link" tabindex="0" title="تفاصيل ' + planetName(k) + ' في صفحة السماء"><span class="dbn-lv-g">' + planetGlyph(k) + '</span><b>' + planetName(k) + (b.retro ? ' <em>R</em>' : '') + '</b><small>' + signName(b.sign) + ' ' + deg(b.lon) + '°</small><i>' + (b.retro ? 'متراجع' : 'حركة مباشرة') + '</i><p class="dbn-fx">' + fx + '</p></div>';
  }
  function fxOf(k, b) {
    if (k === 'sun') return SUN_SHORT[b.sign];
    if (k === 'moon') return moonShort(b.sign);
    return FX[k][b.retro ? 1 : 0];
  }
  function renderLive() {
    if (!engine()) return;
    var c; try { c = chartAt(Date.now()); } catch (e) { return; }
    LIVE_SETS.forEach(function (set, i) {
      var h = set.map(function (k) {
        if (k === 'phase') {
          var sn = body(c, 'sun'), mn = body(c, 'moon'); if (!sn || !mn) return '';
          var el = mod(mn.lon - sn.lon), il = Math.round((1 - Math.cos(el * Math.PI / 180)) / 2 * 100);
          return '<div class="dbn-lv k-moon" data-planet="moon" role="link" tabindex="0" title="تفاصيل القمر في صفحة السماء"><span class="dbn-lv-g">' + icon('moon') + '</span><b>مرحلة القمر</b><small>' + phaseOf(el) + ' · ' + il + '%</small><i>إضاءة</i><p class="dbn-fx">' + phaseShort(el) + '</p></div>';
        }
        var b = body(c, k); if (!b) return '';
        return lvRow(k, b, fxOf(k, b));
      }).join('');
      setF('live' + (i + 1), h, true);
    });
    /* المتراجعة / المباشرة */
    var all = ORDER.map(function (k) { return { k: k, b: body(c, k) }; }).filter(function (x) { return x.b; });
    function listSlide(f, arr, emptyTxt, moreTxt) {
      var h = arr.slice(0, 3).map(function (x) { return lvRow(x.k, x.b, fxOf(x.k, x.b)); }).join('');
      if (!arr.length) h = '<p class="dbn-desc">' + emptyTxt + '</p>';
      else if (arr.length > 3) { var r = arr.length - 3, nt = r === 1 ? 'كوكب آخر' : (r === 2 ? 'كوكبان آخران' : r + ' كواكب أخرى'); h += '<p class="dbn-more">' + moreTxt.replace('{n}', nt) + '</p>'; }
      setF(f, h, true);
    }
    listSlide('liveRetro', all.filter(function (x) { return x.b.retro; }), 'لا توجد كواكب متراجعة الآن، فالحركة كلها مباشرة.', 'و{n} متراجع، وتجد التفاصيل كلها في صفحة السماء.');
    listSlide('liveDirect', all.filter(function (x) { return !x.b.retro; }), 'كل الكواكب متراجعة الآن.', 'و{n} مباشر، وتجد التفاصيل كلها في صفحة السماء.');
    /* أبرز الزوايا */
    var pk = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'], bs = pk.map(function (k) { var b = body(c, k); return b ? { k: k, b: b } : null; }).filter(Boolean), found = [];
    for (var i = 0; i < bs.length; i++) for (var j = i + 1; j < bs.length; j++) {
      var A = bs[i], B = bs[j], d = Math.abs(mod(A.b.lon - B.b.lon)); d = d > 180 ? 360 - d : d;
      var lim = (A.k === 'sun' || A.k === 'moon' || B.k === 'sun' || B.k === 'moon') ? 8 : 6;
      for (var q = 0; q < ASP_DEF.length; q++) { var o = Math.abs(d - ASP_DEF[q][1]); if (o <= lim) { found.push({ A: A, B: B, t: ASP_DEF[q], o: o }); break; } }
    }
    found.sort(function (x, y) { return x.o - y.o; });
    setF('liveAsp', found.length ? found.slice(0, 3).map(function (x) {
      var hard = x.t[0] === 'square' || x.t[0] === 'opp';
      return '<div class="dbn-lv k-' + x.A.k + '" data-planet="' + x.A.k + '" data-target="asp" role="link" tabindex="0" title="الزوايا بين الكواكب في صفحة السماء"><span class="dbn-lv-g">' + planetGlyph(x.A.k) + '</span><b>' + planetName(x.A.k) + ' ' + x.t[2] + ' ' + planetName(x.B.k) + '</b><small>' + (hard ? 'زاوية متوترة' : 'زاوية داعمة') + ' · فارق ' + x.o.toFixed(1) + '°</small><i>' + (hard ? 'تحدٍّ' : 'دعم') + '</i><p class="dbn-fx">' + ASP_FX[x.t[0]] + '</p></div>';
    }).join('') : '<p class="dbn-desc">لا توجد زوايا قوية بين الكواكب في هذه اللحظة.</p>', true);
    /* موسم الشمس */
    var su = body(c, 'sun');
    if (su) {
      var left = Math.max(1, Math.round((30 - (mod(su.lon) % 30)) / 0.9856));
      setF('liveSeason', lvRow('sun', su, SUN_SHORT[su.sign]) + '<p class="dbn-desc">موسم ' + signName(su.sign) + ' مستمر، وتنتقل الشمس إلى ' + signName((su.sign + 1) % 12) + ' بعد نحو ' + left + ' ' + (left > 10 ? 'يوماً' : 'أيام') + '.</p>', true);
    }
  }
  window.AqeeqFX = { FX: FX, SUN_SHORT: SUN_SHORT, ASP_FX: ASP_FX, moonShort: moonShort, phaseShort: phaseShort };
  /* ضغط الكوكب في البانر: افتح صفحة السماء على تفاصيله (التراجع والتأثير) */
  function openPlanet(k, target) {
    if (target !== 'asp' && window.AqForecast && window.AqForecast.open(k)) return;
    var sd = document.getElementById('sky-date');
    if (sd && sd.value) { sd.value = ''; sd.dispatchEvent(new Event('change', { bubbles: true })); }
    if (location.hash !== '#sky') location.hash = '#sky';
    var n = 0;
    (function go() {
      var chip = document.querySelector('#sky-chips .chip[data-k="' + k + '"]'), t = document.getElementById(target === 'asp' ? 'sky-asp' : 'sky-chips');
      if (chip && t && t.offsetParent !== null) {
        if (target !== 'asp' && chip.getAttribute('aria-pressed') !== 'true') chip.click();
        setTimeout(function () { try { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { t.scrollIntoView(); } }, 120);
      } else if (n++ < 25) setTimeout(go, 120);
    })();
  }
  root.addEventListener('click', function (e) {
    var r = e.target.closest('[data-planet]'); if (!r || !root.contains(r)) return;
    openPlanet(r.getAttribute('data-planet'), r.getAttribute('data-target'));
  });
  root.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var r = e.target.closest && e.target.closest('[data-planet]'); if (!r) return;
    e.preventDefault(); openPlanet(r.getAttribute('data-planet'), r.getAttribute('data-target'));
  });
  function refresh() { renderStatic(); renderNumerology(); renderSky(); renderLive(); }
  refresh();
  /* تحديث البيانات: مؤقت مستقل عن مؤقت الشرائح، كل دقيقة، ويُعيد الرسم فقط عند تغير القيم */
  var dataTimer = setInterval(function () { if (!document.hidden) refresh(); }, 60000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) refresh(); });
  if ('MutationObserver' in window) {
    var mo = new MutationObserver(function () { renderNumerology(); });
    ['aq-obs-focus', 'aq-obs-daynum'].forEach(function (id) { var n = document.getElementById(id); if (n) mo.observe(n, { childList: true, characterData: true, subtree: true }); });
    mo.observe(root, { attributes: true, attributeFilter: ['data-ruler'] });
    var mr = new MutationObserver(function () { last.key = ''; renderSky(); }); mr.observe(root, { attributes: true, attributeFilter: ['data-ruler'] });
  }
  window.addEventListener('load', function () { setTimeout(refresh, 700); });

  /* ---------- slider ---------- */
  /* ارتفاع البانر ثابت = أطول شريحة، فلا يتحرك ما تحته عند التبديل */
  var fitRaf = 0;
  function fit() {
    if (fitRaf) return;
    fitRaf = requestAnimationFrame(function () {
      fitRaf = 0;
      var h = 0; slides.forEach(function (sl) { h = Math.max(h, sl.offsetHeight); });
      if (h > 0 && Math.abs(h - (stage._fitH || 0)) > 1) { stage._fitH = h; stage.style.setProperty('height', h + 'px', 'important'); }
    });
  }
  if (window.ResizeObserver) { var fro = new ResizeObserver(fit); slides.forEach(function (sl) { fro.observe(sl); }); }
  window.addEventListener('resize', fit);
  function show(i, userDriven) {
    cur = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { var on = k === cur; s.classList.toggle('is-on', on); s.setAttribute('aria-hidden', on ? 'false' : 'true'); if ('inert' in s) s.inert = !on; });
    dots.forEach(function (d, k) { d.classList.toggle('is-on', k === cur); if (k === cur) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
    fit();
    stage.setAttribute('aria-live', userDriven ? 'polite' : 'off');
    if (userDriven) { /* manual: pause then resume after idle */ pause(); armIdle(); } else schedule();
  }
  function stopTimers() { if (timer) { clearTimeout(timer); timer = null; } if (bar) { bar.classList.remove('is-run'); } }
  function schedule() {
    stopTimers();
    if (reduce || document.hidden || hovering || userActive || userPaused || selecting) return;
    if (bar) { void bar.offsetWidth; bar.classList.add('is-run'); }
    timer = setTimeout(function () { show(cur + 1, false); }, AUTO_MS);
  }
  function pause() { stopTimers(); }
  function armIdle() { if (idleTimer) clearTimeout(idleTimer); userActive = true; idleTimer = setTimeout(function () { userActive = false; schedule(); }, IDLE_MS); }
  function userMove(delta) { show(cur + delta, true); }

  dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k, true); }); });
  var ar_prev = root.querySelector('[data-dbn="prev"]'); if (ar_prev) ar_prev.addEventListener('click', function () { userMove(-1); });
  var ar_next = root.querySelector('[data-dbn="next"]'); if (ar_next) ar_next.addEventListener('click', function () { userMove(1); });
  stage.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); userMove(1); }   /* RTL: يسار = التالي */
    else if (e.key === 'ArrowRight') { e.preventDefault(); userMove(-1); }
    else if (e.key === 'Home') { e.preventDefault(); show(0, true); }
    else if (e.key === 'End') { e.preventDefault(); show(slides.length - 1, true); }
  });

  /* hover / focus pause */
  root.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { hovering = true; pause(); } });
  root.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { hovering = false; if (!userActive) schedule(); } });
  root.addEventListener('focusin', function () { pause(); });
  root.addEventListener('focusout', function () { if (!userActive && !hovering) schedule(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); else if (!userActive && !hovering) schedule(); });

  /* ---------- swipe / drag (horizontal only; vertical scroll untouched via touch-action: pan-y) ---------- */
  var sx = null, sy = null, dragged = false, pid = null;
  stage.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest('a,button')) { sx = null; return; }
    sx = e.clientX; sy = e.clientY; dragged = false; pid = e.pointerId; pause();
  });
  stage.addEventListener('pointermove', function (e) {
    if (sx === null || e.pointerId !== pid) return;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { dragged = true; stage.classList.add('is-drag'); }
  });
  function end(e) {
    if (sx === null || (e && e.pointerId !== pid)) return;
    var dx = (e ? e.clientX : sx) - sx; var was = dragged;
    sx = null; stage.classList.remove('is-drag');
    if (was && Math.abs(dx) > 40) userMove(dx < 0 ? 1 : -1);   /* RTL: سحب لليسار = التالي */
    else if (!userActive && !hovering) schedule();
  }
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', function () { sx = null; stage.classList.remove('is-drag'); if (!userActive && !hovering) schedule(); });
  stage.addEventListener('click', function (e) { if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; } }, true);


  /* play / pause toggle */
  var tg = root.querySelector('[data-dbn="toggle"]');
  if (tg) tg.addEventListener('click', function () {
    userPaused = !userPaused;
    tg.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
    tg.setAttribute('aria-label', userPaused ? 'تشغيل التبديل التلقائي' : 'إيقاف التبديل التلقائي');
    tg.classList.toggle('is-paused', userPaused);
    if (userPaused) { if (idleTimer) clearTimeout(idleTimer); userActive = false; pause(); } else schedule();
  });
  /* pause while text inside the banner is selected, and while an inner area scrolls */
  document.addEventListener('selectionchange', function () {
    var sel = window.getSelection && window.getSelection();
    var inside = !!(sel && !sel.isCollapsed && sel.anchorNode && root.contains(sel.anchorNode));
    if (inside === selecting) return;
    selecting = inside;
    if (selecting) pause(); else if (!userActive && !hovering) schedule();
  });
  stage.addEventListener('scroll', function () { pause(); if (!userActive && !hovering) { clearTimeout(stage._st); stage._st = setTimeout(schedule, 1500); } }, true);

  /* init */
  show(0, false);
  window.__dbn = { show: function (i) { show(i, true); }, current: function () { return cur; }, refresh: refresh };
})();

;
/* assets/js/cosmic-background.js */
/* ============================================================================
   عقيق أسترو — البيئة الكونية العاجية الحية (Living Ivory Celestial Environment)
   خلفية فلكية دافئة ومريحة بصرياً على لون العاج الدافئ (#F5F0E6):
     1) دوائر ومدارات فلكية ذهبية رفيعة (#C5A46D) تدور ببطء شديد
     2) تقسيمات الأبراج الـ 12 ودرجات القوس الفلكي ومخططات هندسية خافتة
     3) رموز كوكبية وبروجية رقيقة تسبح بهدوء على المسارات المدارية
     4) كوكبات نجمية ناعمة وذرات ضوئية ذهبية دافئة
     5) لوحة كوكبة البرج التفاعلية في قسم الأبراج (#signs) بالهوية العاجية
   ============================================================================ */
(function () {
  'use strict';

  var SIGN_META = [
    { id: 'aries',       ar: 'الحمل',   en: 'Aries',       glyph: '♈', el: 'fire',  stars: [[0.18,0.62,1.6],[0.38,0.44,2.4],[0.62,0.38,2.9],[0.78,0.48,1.9],[0.84,0.60,1.4]], lines: [[0,1],[1,2],[2,3],[3,4]] },
    { id: 'taurus',      ar: 'الثور',   en: 'Taurus',      glyph: '♉', el: 'earth', stars: [[0.18,0.28,1.9],[0.36,0.44,1.8],[0.50,0.52,3.1],[0.42,0.64,1.9],[0.24,0.78,1.8],[0.66,0.46,2.0],[0.82,0.34,2.2],[0.78,0.66,1.7]], lines: [[0,1],[1,2],[2,3],[3,4],[2,5],[5,6],[5,7]] },
    { id: 'gemini',      ar: 'الجوزاء', en: 'Gemini',      glyph: '♊', el: 'air',   stars: [[0.34,0.22,2.8],[0.64,0.20,3.0],[0.36,0.42,1.9],[0.62,0.40,2.0],[0.32,0.64,1.8],[0.60,0.62,1.9],[0.26,0.82,1.7],[0.44,0.80,1.6],[0.58,0.82,1.7],[0.74,0.78,1.6]], lines: [[0,2],[2,4],[4,6],[4,7],[1,3],[3,5],[5,8],[5,9],[2,3]] },
    { id: 'cancer',      ar: 'السرطان', en: 'Cancer',      glyph: '♋', el: 'water', stars: [[0.50,0.24,1.9],[0.48,0.48,2.4],[0.30,0.72,2.0],[0.68,0.70,2.1],[0.50,0.56,1.6]], lines: [[0,1],[1,2],[1,3],[1,4]] },
    { id: 'leo',         ar: 'الأسد',   en: 'Leo',         glyph: '♌', el: 'fire',  stars: [[0.24,0.72,3.1],[0.30,0.52,2.1],[0.22,0.36,1.9],[0.32,0.24,2.2],[0.44,0.30,1.8],[0.48,0.48,2.2],[0.68,0.54,2.1],[0.82,0.66,2.6],[0.72,0.72,1.8]], lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,1],[5,6],[6,7],[7,8],[8,0]] },
    { id: 'virgo',       ar: 'العذراء', en: 'Virgo',       glyph: '♍', el: 'earth', stars: [[0.20,0.40,1.8],[0.36,0.34,2.0],[0.50,0.46,2.2],[0.66,0.32,2.0],[0.62,0.64,3.1],[0.42,0.70,1.9],[0.26,0.78,1.7],[0.78,0.52,1.8],[0.84,0.72,1.7]], lines: [[0,1],[1,2],[2,3],[2,4],[4,5],[5,6],[2,7],[4,8]] },
    { id: 'libra',       ar: 'الميزان', en: 'Libra',       glyph: '♎', el: 'air',   stars: [[0.50,0.24,2.6],[0.28,0.48,2.5],[0.72,0.46,2.2],[0.36,0.76,1.9],[0.66,0.74,1.8]], lines: [[0,1],[0,2],[1,2],[1,3],[2,4]] },
    { id: 'scorpio',     ar: 'العقرب',  en: 'Scorpio',     glyph: '♏', el: 'water', stars: [[0.22,0.26,2.0],[0.20,0.38,2.1],[0.24,0.50,1.9],[0.36,0.42,3.2],[0.48,0.52,2.1],[0.56,0.66,2.0],[0.64,0.78,2.0],[0.76,0.80,1.9],[0.84,0.70,2.4],[0.80,0.60,2.0]], lines: [[0,3],[1,3],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9]] },
    { id: 'sagittarius', ar: 'القوس',   en: 'Sagittarius', glyph: '♐', el: 'fire',  stars: [[0.26,0.64,2.2],[0.36,0.46,2.1],[0.50,0.32,2.3],[0.54,0.52,2.2],[0.42,0.68,2.4],[0.66,0.42,2.0],[0.76,0.56,2.1],[0.68,0.70,2.2]], lines: [[0,1],[1,2],[2,3],[3,4],[4,0],[1,3],[2,5],[5,6],[6,7],[7,3]] },
    { id: 'capricorn',   ar: 'الجدي',   en: 'Capricorn',   glyph: '♑', el: 'earth', stars: [[0.20,0.34,2.3],[0.34,0.46,1.9],[0.52,0.56,1.8],[0.72,0.48,2.1],[0.82,0.34,2.4],[0.68,0.68,2.0],[0.46,0.74,2.1],[0.28,0.62,1.8]], lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0]] },
    { id: 'aquarius',    ar: 'الدلو',   en: 'Aquarius',    glyph: '♒', el: 'air',   stars: [[0.24,0.30,2.2],[0.40,0.26,2.5],[0.56,0.34,2.4],[0.48,0.46,1.9],[0.34,0.58,2.0],[0.66,0.52,2.0],[0.58,0.68,1.9],[0.74,0.74,2.1],[0.44,0.78,1.8]], lines: [[0,1],[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[4,8]] },
    { id: 'pisces',      ar: 'الحوت',   en: 'Pisces',      glyph: '♓', el: 'water', stars: [[0.22,0.30,2.1],[0.30,0.44,1.8],[0.40,0.60,1.8],[0.50,0.76,2.4],[0.62,0.64,1.9],[0.72,0.50,1.9],[0.80,0.36,2.1],[0.74,0.26,1.9],[0.84,0.28,1.8]], lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,6]] }
  ];

  var PLANET_GLYPHS = ['☉', '☽', '☿', '♀', '♂', '♃', '♄', '♅', '♆'];
  var ZODIAC_GLYPHS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

  var canvas = document.getElementById('cosmos-bg');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'cosmos-bg';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
  }
  var ctx = canvas.getContext('2d', { alpha: true });

  var tint = document.getElementById('sky-tint');
  if (!tint) {
    tint = document.createElement('div');
    tint.id = 'sky-tint';
    tint.setAttribute('aria-hidden', 'true');
    document.body.prepend(tint);
  }

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  var particles = [];
  var orbitalBodies = [];
  var constellations = [];
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function seedScene() {
    var isMobile = W < 768;
    var particleCount = isMobile ? 32 : 58;
    particles = [];
    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.7 + Math.random() * 1.6,
        alpha: 0.14 + Math.random() * 0.28,
        phase: Math.random() * Math.PI * 2,
        speed: 0.25 + Math.random() * 0.55,
        driftX: (Math.random() - 0.5) * 0.06,
        driftY: (Math.random() - 0.5) * 0.06,
        isBurgundy: Math.random() < 0.18
      });
    }

    orbitalBodies = [];
    var orbitCount = isMobile ? 5 : 8;
    for (var j = 0; j < orbitCount; j++) {
      orbitalBodies.push({
        radiusRatio: 0.18 + j * 0.055,
        angle: (j * Math.PI * 2) / orbitCount + 0.4,
        speed: (j % 2 === 0 ? 1 : -1) * (0.000045 + j * 0.000008),
        glyph: PLANET_GLYPHS[j % PLANET_GLYPHS.length],
        size: isMobile ? 11 : 13
      });
    }

    // 3 faint background constellations placed in corners
    constellations = [
      { cx: 0.14, cy: 0.22, scale: isMobile ? 90 : 140, pts: [[0,0],[0.4,-0.25],[0.85,-0.1],[1.1,0.3],[0.6,0.45]], links: [[0,1],[1,2],[2,3],[2,4]] },
      { cx: 0.84, cy: 0.26, scale: isMobile ? 95 : 150, pts: [[0,0],[-0.45,0.2],[-0.8,-0.15],[-0.3,-0.5],[0.25,-0.35]], links: [[0,1],[1,2],[1,3],[3,4],[4,0]] },
      { cx: 0.18, cy: 0.78, scale: isMobile ? 85 : 130, pts: [[0,0],[0.5,0.15],[0.9,-0.2],[1.25,0.1]], links: [[0,1],[1,2],[2,3]] }
    ];
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seedScene();
  }

  function drawCelestialWheelBackground(t) {
    var cx = W * 0.5;
    var cy = H * 0.46;
    var baseR = Math.min(W, H) * (W < 768 ? 0.44 : 0.41);

    ctx.save();
    ctx.translate(cx, cy);

    // 1. Gentle warm radial halo
    var halo = ctx.createRadialGradient(0, 0, baseR * 0.08, 0, 0, baseR * 1.25);
    halo.addColorStop(0, 'rgba(197, 164, 109, 0.08)');
    halo.addColorStop(0.55, 'rgba(197, 164, 109, 0.035)');
    halo.addColorStop(1, 'rgba(245, 240, 230, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, baseR * 1.25, 0, Math.PI * 2);
    ctx.fill();

    // 2. Outer astrological wheel ring & 12 zodiac divisions (slow clockwise rotation)
    var rotOuter = reducedMotion ? 0 : t * 0.000018;
    ctx.save();
    ctx.rotate(rotOuter);

    ctx.strokeStyle = 'rgba(197, 164, 109, 0.20)';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.arc(0, 0, baseR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(197, 164, 109, 0.15)';
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.arc(0, 0, baseR * 0.86, 0, Math.PI * 2);
    ctx.stroke();

    // 72 fine degree ticks around the outer ring
    ctx.strokeStyle = 'rgba(197, 164, 109, 0.18)';
    ctx.lineWidth = 0.65;
    for (var deg = 0; deg < 360; deg += 5) {
      var rad = (deg * Math.PI) / 180;
      var isMajor = deg % 30 === 0;
      var rInner = isMajor ? baseR * 0.86 : baseR * 0.965;
      ctx.beginPath();
      ctx.moveTo(Math.cos(rad) * rInner, Math.sin(rad) * rInner);
      ctx.lineTo(Math.cos(rad) * baseR, Math.sin(rad) * baseR);
      ctx.stroke();
    }

    // Faint zodiac glyphs in the 12 sectors
    ctx.fillStyle = 'rgba(107, 38, 61, 0.13)';
    ctx.font = (W < 768 ? '11px' : '13px') + ' "Amiri", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var z = 0; z < 12; z++) {
      var midAngle = ((z * 30 + 15) * Math.PI) / 180;
      var gx = Math.cos(midAngle) * (baseR * 0.91);
      var gy = Math.sin(midAngle) * (baseR * 0.91);
      ctx.fillText(ZODIAC_GLYPHS[z], gx, gy);
    }
    ctx.restore();

    // 3. Counter-rotating geometric astronomical diagram (octagram / cardinal axes)
    var rotInner = reducedMotion ? 0 : -t * 0.000014;
    ctx.save();
    ctx.rotate(rotInner);
    ctx.strokeStyle = 'rgba(197, 164, 109, 0.12)';
    ctx.lineWidth = 0.7;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, baseR * 0.68, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Subtle sacred square & diamond inside the wheel
    var sqR = baseR * 0.68;
    ctx.strokeStyle = 'rgba(197, 164, 109, 0.09)';
    ctx.lineWidth = 0.65;
    for (var s = 0; s < 2; s++) {
      ctx.save();
      ctx.rotate((s * Math.PI) / 4);
      ctx.beginPath();
      ctx.moveTo(sqR, 0);
      ctx.lineTo(0, sqR);
      ctx.lineTo(-sqR, 0);
      ctx.lineTo(0, -sqR);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    // 4. Delicate planetary symbols drifting along orbital paths
    for (var b = 0; b < orbitalBodies.length; b++) {
      var body = orbitalBodies[b];
      var orbitR = Math.min(W, H) * body.radiusRatio;
      var ang = body.angle + (reducedMotion ? 0 : t * body.speed);
      var bx = Math.cos(ang) * orbitR;
      var by = Math.sin(ang) * orbitR;

      // Subtle dashed orbital track
      if (b % 2 === 0) {
        ctx.strokeStyle = 'rgba(197, 164, 109, 0.08)';
        ctx.lineWidth = 0.55;
        ctx.beginPath();
        ctx.arc(0, 0, orbitR, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Small golden orbital node & planetary symbol
      ctx.fillStyle = 'rgba(197, 164, 109, 0.22)';
      ctx.beginPath();
      ctx.arc(bx, by, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(107, 38, 61, 0.26)';
      ctx.font = body.size + 'px "IBM Plex Sans Arabic", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(body.glyph, bx, by);
    }

    ctx.restore();
  }

  function drawConstellationsAndParticles(t) {
    // Faint corner constellations
    ctx.save();
    for (var c = 0; c < constellations.length; c++) {
      var con = constellations[c];
      var ox = con.cx * W;
      var oy = con.cy * H;

      ctx.strokeStyle = 'rgba(197, 164, 109, 0.16)';
      ctx.lineWidth = 0.75;
      for (var l = 0; l < con.links.length; l++) {
        var p1 = con.pts[con.links[l][0]];
        var p2 = con.pts[con.links[l][1]];
        ctx.beginPath();
        ctx.moveTo(ox + p1[0] * con.scale, oy + p1[1] * con.scale);
        ctx.lineTo(ox + p2[0] * con.scale, oy + p2[1] * con.scale);
        ctx.stroke();
      }

      for (var p = 0; p < con.pts.length; p++) {
        var pt = con.pts[p];
        var px = ox + pt[0] * con.scale;
        var py = oy + pt[1] * con.scale;
        ctx.fillStyle = 'rgba(197, 164, 109, 0.34)';
        ctx.beginPath();
        ctx.arc(px, py, 2.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // Soft golden & burgundy celestial dust particles
    for (var i = 0; i < particles.length; i++) {
      var st = particles[i];
      if (!reducedMotion) {
        st.x += st.driftX;
        st.y += st.driftY;
        if (st.x < 0) st.x = W;
        if (st.x > W) st.x = 0;
        if (st.y < 0) st.y = H;
        if (st.y > H) st.y = 0;
      }
      var pulse = reducedMotion ? 1 : 0.65 + 0.35 * Math.sin(t * 0.0012 * st.speed + st.phase);
      var a = st.alpha * pulse;
      ctx.fillStyle = st.isBurgundy
        ? 'rgba(107, 38, 61, ' + (a * 0.7).toFixed(3) + ')'
        : 'rgba(197, 164, 109, ' + a.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function frame(now) {
    var t = now || 0;
    ctx.clearRect(0, 0, W, H);
    drawCelestialWheelBackground(t);
    drawConstellationsAndParticles(t);
    if (!reducedMotion) {
      requestAnimationFrame(frame);
    }
  }

  /* الخلفية الفلكية المتحركة ملغاة بقرار التصميم: نزيل الكانفس والتظليل ولا نشغّل حلقة الرسم.
     دوال رسم الكوكبات تبقى لأن صفحة الأبراج تستخدمها كشكل ثابت. */
  if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
  if (tint && tint.parentNode) tint.parentNode.removeChild(tint);

  /* ============================================================================
     لوحة كوكبة البرج التفاعلية في قسم الأبراج (#signs) بالهوية العاجية والذهبية
     ============================================================================ */
  function buildConstellationSVG(meta) {
    var Wv = 260, Hv = 175;
    var lines = meta.lines.map(function (pair) {
      var a = meta.stars[pair[0]], b = meta.stars[pair[1]];
      return '<line class="const-line" x1="' + (a[0] * Wv).toFixed(1) + '" y1="' + (a[1] * Hv).toFixed(1) +
             '" x2="' + (b[0] * Wv).toFixed(1) + '" y2="' + (b[1] * Hv).toFixed(1) + '"/>';
    }).join('');
    var stars = meta.stars.map(function (s, idx) {
      var cx = (s[0] * Wv).toFixed(1), cy = (s[1] * Hv).toFixed(1), r = s[2];
      var delay = (idx * 0.22).toFixed(2);
      return '<g>' +
        '<circle class="const-halo" cx="' + cx + '" cy="' + cy + '" r="' + (r * 3.2).toFixed(1) + '"/>' +
        '<circle class="const-star" style="animation-delay:' + delay + 's" cx="' + cx + '" cy="' + cy + '" r="' + r.toFixed(1) + '"/>' +
      '</g>';
    }).join('');
    return '<svg viewBox="0 0 ' + Wv + ' ' + Hv + '" role="img" aria-label="كوكبة برج ' + meta.ar + '">' +
      '<defs>' +
        '<radialGradient id="cbg-' + meta.id + '" cx="50%" cy="50%" r="55%">' +
          '<stop offset="0%" stop-color="#C5A46D" stop-opacity="0.22"/>' +
          '<stop offset="100%" stop-color="#F5F0E6" stop-opacity="0"/>' +
        '</radialGradient>' +
      '</defs>' +
      '<circle cx="' + (Wv / 2) + '" cy="' + (Hv / 2) + '" r="78" fill="url(#cbg-' + meta.id + ')"/>' +
      '<circle cx="' + (Wv / 2) + '" cy="' + (Hv / 2) + '" r="74" fill="none" stroke="rgba(197,164,109,0.42)" stroke-dasharray="2 5"/>' +
      lines + stars +
    '</svg>';
  }

  function injectSignConstellation() {
    var panel = document.getElementById('panel');
    if (!panel || !panel.children.length) return;
    var titleEl = panel.querySelector('h3');
    if (!titleEl) return;
    var txt = titleEl.textContent || '';
    var meta = null;
    for (var i = 0; i < SIGN_META.length; i++) {
      if (txt.indexOf(SIGN_META[i].ar) !== -1) { meta = SIGN_META[i]; break; }
    }
    if (!meta) return;

    var slot = panel.querySelector('.zp-const');
    if (slot) {
      if (slot.getAttribute('data-sign') === meta.id && slot.querySelector('svg')) return;
      slot.setAttribute('data-sign', meta.id);
      slot.innerHTML = buildConstellationSVG(meta) + '<figcaption>' + meta.ar + '</figcaption>';
      return;
    }
    var existing = panel.querySelector('.sign-constellation-stage');
    if (existing && existing.getAttribute('data-sign') === meta.id) return;
    if (existing) existing.remove();

    var stage = document.createElement('div');
    stage.className = 'sign-constellation-stage';
    stage.setAttribute('data-sign', meta.id);
    stage.innerHTML = buildConstellationSVG(meta) +
      '<div class="sign-constellation-caption">' + meta.glyph + ' الكوكبة الفلكية لبرج ' + meta.ar + ' · ' + meta.en + ' Constellation</div>';

    var head = panel.querySelector('.arch-head');
    if (head && head.nextSibling) {
      panel.insertBefore(stage, head.nextSibling);
    } else {
      panel.prepend(stage);
    }
  }

  function watchSignsPanel() {
    var panel = document.getElementById('panel');
    if (!panel) return;
    injectSignConstellation();
    var obs = new MutationObserver(function () { injectSignConstellation(); });
    obs.observe(panel, { childList: true, subtree: true });
    var tk = 0;
    document.addEventListener('scroll', function () {
      if (tk) return;
      tk = requestAnimationFrame(function () { tk = 0; var z = document.querySelector('#panel .zp-const'); if (z && !z.querySelector('svg')) injectSignConstellation(); });
    }, { capture: true, passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchSignsPanel);
  } else {
    watchSignsPanel();
  }
})();

;
/* assets/js/pro-wheel.js */
/* ============================================================================
   عقيق أسترو — العجلة الفلكية الاحترافية متعددة الطبقات (Ivory Celestial Wheel)
   ترتقي بـ svg.wheel في قسم الهيرو إلى عجلة فلكية كلاسيكية بهوية العاج والذهبي والبرغندي:
     • الطبقة الخارجية (.spin-a): حلقة الدرجات الـ 360 (كل 5° و10° و30°) تدور ببطء
     • طبقة الأبراج الـ 12: قطاعات عاجية متناوبة ورموز الأبراج باللون البرغندي والذهبي
     • الطبقة المدارية (.pw-orbit-layer): مسارات الكواكب الفلكية الحية
     • الطبقة الهندسية (.spin-b): خطوط البيوت والهندسة المقدسة تدور بالاتجاه المعاكس
     • القلب الشمسي المركزي (.pw-sun-focal): شمس فلكية ذهبية/برغندية متوهجة في المركز
     • مواقع الكواكب الحية الآن في السماء محسوبة فعلياً عبر window.Astro
   ============================================================================ */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var CX = 200, CY = 200;

  var SIGNS_GLYPHS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  var SIGNS_AR = ['الحمل','الثور','الجوزاء','السرطان','الأسد','العذراء','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'];
  var EL_TINT = [
    'rgba(107, 38, 61, 0.06)',  // نار — برغندي دافئ خفيف
    'rgba(197, 164, 109, 0.11)', // تراب — ذهبي شامبانيا خفيف
    'rgba(82, 115, 138, 0.07)',  // هواء — أزرق سماوي هادئ
    'rgba(200, 155, 158, 0.09)'  // ماء — وردي مغبر ناعم
  ];

  var PLANETS_LIVE = [
    { key: 'sun',     g: '☉', ar: 'الشمس',   col: '#6B263D', bg: '#FAF3E6', r: 108 },
    { key: 'moon',    g: '☽', ar: 'القمر',   col: '#52738A', bg: '#F4F8FA', r: 108 },
    { key: 'mercury', g: '☿', ar: 'عطارد',   col: '#7A5C38', bg: '#FAF6EE', r: 94  },
    { key: 'venus',   g: '♀', ar: 'الزهرة',  col: '#8C3B54', bg: '#FCF5F6', r: 94  },
    { key: 'mars',    g: '♂', ar: 'المريخ',  col: '#9B333E', bg: '#FDF4F4', r: 94  },
    { key: 'jupiter', g: '♃', ar: 'المشتري', col: '#6B263D', bg: '#FAF3E6', r: 80  },
    { key: 'saturn',  g: '♄', ar: 'زحل',     col: '#5C4B3B', bg: '#F7F3EB', r: 80  }
  ];

  function el(tag, attrs) {
    var node = document.createElementNS(NS, tag);
    if (attrs) {
      for (var k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k)) {
          node.setAttribute(k, attrs[k]);
        }
      }
    }
    return node;
  }

  function polar(r, deg) {
    var a = (deg - 90) * Math.PI / 180;
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
  }

  function sectorPath(rOuter, rInner, deg0, deg1) {
    var p1 = polar(rOuter, deg0);
    var p2 = polar(rOuter, deg1);
    var p3 = polar(rInner, deg1);
    var p4 = polar(rInner, deg0);
    var large = (deg1 - deg0) > 180 ? 1 : 0;
    return 'M ' + p1[0].toFixed(2) + ' ' + p1[1].toFixed(2) +
           ' A ' + rOuter + ' ' + rOuter + ' 0 ' + large + ' 1 ' + p2[0].toFixed(2) + ' ' + p2[1].toFixed(2) +
           ' L ' + p3[0].toFixed(2) + ' ' + p3[1].toFixed(2) +
           ' A ' + rInner + ' ' + rInner + ' 0 ' + large + ' 0 ' + p4[0].toFixed(2) + ' ' + p4[1].toFixed(2) +
           ' Z';
  }

  function enhanceHeroWheel() {
    var svg = document.querySelector('#home svg.wheel');
    if (!svg || svg.getAttribute('data-pro-wheel') === '1') return;
    svg.setAttribute('data-pro-wheel', '1');

    // 1. تعريفات التدرجات العاجية والذهبية والبرغندية
    var defs = svg.querySelector('defs') || svg.insertBefore(el('defs'), svg.firstChild);
    var bgGrad = el('radialGradient', { id: 'pw-bg', cx: '50%', cy: '50%', r: '55%' });
    bgGrad.appendChild(el('stop', { offset: '0%',   'stop-color': '#FFFFFF', 'stop-opacity': '0.98' }));
    bgGrad.appendChild(el('stop', { offset: '62%',  'stop-color': '#FAF6EE', 'stop-opacity': '0.95' }));
    bgGrad.appendChild(el('stop', { offset: '100%', 'stop-color': '#EFE8DA', 'stop-opacity': '0.92' }));
    defs.appendChild(bgGrad);

    var sunGrad = el('radialGradient', { id: 'pw-sun-grad', cx: '50%', cy: '50%', r: '50%' });
    sunGrad.appendChild(el('stop', { offset: '0%',   'stop-color': '#FFFDF9', 'stop-opacity': '1' }));
    sunGrad.appendChild(el('stop', { offset: '55%',  'stop-color': '#F5E6C8', 'stop-opacity': '0.95' }));
    sunGrad.appendChild(el('stop', { offset: '100%', 'stop-color': '#C5A46D', 'stop-opacity': '0.25' }));
    defs.appendChild(sunGrad);

    // 2. القرص الخلفي العاجي الدافئ
    var disc = el('circle', {
      cx: CX, cy: CY, r: 192,
      fill: 'url(#pw-bg)',
      stroke: '#C5A46D',
      'stroke-width': '1.2',
      'class': 'pw-disc'
    });
    svg.insertBefore(disc, svg.firstChild.nextSibling);

    // 3. قطاعات الأبراج الـ 12 (بين نصف القطر 132 و166)
    var sectorsG = el('g', { 'class': 'pw-sectors', 'aria-hidden': 'true' });
    for (var s = 0; s < 12; s++) {
      var d0 = s * 30 - 15;
      var d1 = d0 + 30;
      var path = el('path', {
        d: sectorPath(166, 132, d0, d1),
        fill: EL_TINT[s % 4],
        stroke: 'rgba(197, 164, 109, 0.45)',
        'stroke-width': '0.8',
        'class': 'pw-sign-sector'
      });
      var title = el('title');
      title.textContent = SIGNS_AR[s] + ' ' + SIGNS_GLYPHS[s];
      path.appendChild(title);
      sectorsG.appendChild(path);
    }
    svg.insertBefore(sectorsG, disc.nextSibling);

    // 4. الطبقة الأولى المتحركة (.spin-a): حلقة الدرجات الـ 360 الدقيقة
    var spinA = svg.querySelector('.spin-a');
    var ticksG = el('g', {
      'class': 'pw-ticks',
      stroke: '#C5A46D',
      'stroke-linecap': 'round',
      'aria-hidden': 'true'
    });
    for (var deg = 0; deg < 360; deg += 5) {
      var isSign = (deg % 30 === 0);
      var isTen  = (deg % 10 === 0);
      var rOut = 188;
      var rIn  = isSign ? 168 : (isTen ? 178 : 183);
      var pA = polar(rOut, deg - 15);
      var pB = polar(rIn,  deg - 15);
      ticksG.appendChild(el('line', {
        x1: pA[0].toFixed(2), y1: pA[1].toFixed(2),
        x2: pB[0].toFixed(2), y2: pB[1].toFixed(2),
        'stroke-width': isSign ? '1.3' : (isTen ? '0.85' : '0.55'),
        opacity: isSign ? '0.85' : (isTen ? '0.55' : '0.35')
      }));
    }
    if (spinA) {
      spinA.appendChild(ticksG);
    } else {
      svg.insertBefore(ticksG, sectorsG.nextSibling);
    }

    // 5. الطبقة المدارية للكواكب (.pw-orbit-layer)
    var orbitLayer = el('g', { 'class': 'pw-orbit-layer', 'aria-hidden': 'true' });
    [108, 94, 80].forEach(function (radius, idx) {
      orbitLayer.appendChild(el('circle', {
        cx: CX, cy: CY, r: radius,
        fill: 'none',
        stroke: '#C5A46D',
        'stroke-width': idx === 0 ? '0.85' : '0.65',
        'stroke-dasharray': idx % 2 === 0 ? '2 5' : '4 4',
        opacity: '0.55'
      }));
    });
    // نقاط مدارية ذهبية صغيرة على المدارات
    [45, 135, 225, 315].forEach(function (angle, idx) {
      var pt = polar(108 - (idx % 2) * 14, angle);
      orbitLayer.appendChild(el('circle', {
        cx: pt[0].toFixed(2), cy: pt[1].toFixed(2), r: '2.2',
        fill: '#C5A46D', opacity: '0.7'
      }));
    });
    svg.appendChild(orbitLayer);

    // 6. القلب الشمسي الفلكي في المركز (.pw-sun-focal)
    var sunFocal = el('g', { 'class': 'pw-sun-focal', 'aria-hidden': 'true' });
    sunFocal.appendChild(el('circle', {
      cx: CX, cy: CY, r: 28,
      fill: 'url(#pw-sun-grad)',
      stroke: 'rgba(197, 164, 109, 0.55)',
      'stroke-width': '0.9'
    }));
    // 12 شعاعاً شمسياً كلاسيكياً دقيقاً في المركز
    for (var ray = 0; ray < 12; ray++) {
      var rAng = ray * 30;
      var rStart = polar(11, rAng);
      var rEnd = polar(ray % 2 === 0 ? 24 : 18, rAng);
      sunFocal.appendChild(el('line', {
        x1: rStart[0].toFixed(2), y1: rStart[1].toFixed(2),
        x2: rEnd[0].toFixed(2),   y2: rEnd[1].toFixed(2),
        stroke: ray % 2 === 0 ? '#6B263D' : '#C5A46D',
        'stroke-width': ray % 2 === 0 ? '1.15' : '0.85',
        opacity: '0.75'
      }));
    }
    sunFocal.appendChild(el('circle', {
      cx: CX, cy: CY, r: 9.5,
      fill: '#FAF6EE',
      stroke: '#6B263D',
      'stroke-width': '1.3'
    }));
    sunFocal.appendChild(el('circle', {
      cx: CX, cy: CY, r: 2.8,
      fill: '#6B263D'
    }));
    svg.appendChild(sunFocal);

    // 7. طبقة الكواكب الحية الآن في السماء (باستخدام محرك Astro الحقيقي)
    var liveG = el('g', { 'class': 'pw-live', 'aria-label': 'مواقع الكواكب الآن في السماء' });
    svg.appendChild(liveG);

    function plotLivePlanets() {
      var A = window.Astro;
      if (!A || typeof A.lonOf !== 'function' || typeof A.jdeNow !== 'function') {
        return false;
      }
      while (liveG.firstChild) liveG.removeChild(liveG.firstChild);
      var jde = A.jdeNow();

      PLANETS_LIVE.forEach(function (P) {
        var lon = A.lonOf(P.key, jde);
        if (typeof lon !== 'number' || isNaN(lon)) return;
        var deg = (lon - 15 + 360) % 360;
        var pos = polar(P.r, deg);
        var edge = polar(132, deg);
        var signIdx = Math.floor(((lon % 360) + 360) % 360 / 30);
        var degInSign = Math.floor(((lon % 360) + 360) % 30);

        var g = el('g', { 'class': 'pw-planet', 'data-planet': P.key });
        var tip = el('title');
        tip.textContent = P.ar + ' الآن في برج ' + SIGNS_AR[signIdx] + ' (' + degInSign + '°)';
        g.appendChild(tip);

        // خط رقيق يصل الكوكب بقطاع البرج المقابل له
        g.appendChild(el('line', {
          x1: pos[0].toFixed(2), y1: pos[1].toFixed(2),
          x2: edge[0].toFixed(2), y2: edge[1].toFixed(2),
          stroke: P.col, 'stroke-width': '0.85', 'stroke-dasharray': '1.5 2.5', opacity: '0.55'
        }));
        // هالة عاجية/ذهبية ناعمة
        g.appendChild(el('circle', {
          cx: pos[0].toFixed(2), cy: pos[1].toFixed(2), r: '10',
          fill: P.bg, stroke: '#C5A46D', 'stroke-width': '1.1', opacity: '0.96', 'class': 'pw-p-halo'
        }));
        // رمز الكوكب بتباين واضح
        var t = el('text', {
          x: pos[0].toFixed(2), y: (pos[1] + 0.5).toFixed(2),
          'text-anchor': 'middle', 'dominant-baseline': 'central',
          fill: P.col, 'font-size': '11.5', 'font-weight': '700'
        });
        t.textContent = P.g;
        g.appendChild(t);

        liveG.appendChild(g);
      });
      return true;
    }

    if (!plotLivePlanets()) {
      var tries = 0;
      var iv = setInterval(function () {
        tries++;
        if (plotLivePlanets() || tries > 20) clearInterval(iv);
      }, 250);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceHeroWheel);
  } else {
    enhanceHeroWheel();
  }
})();

;
/* assets/js/page-celestial.js */
(function(){var M={matrix:'matrix',chart:'chart',sky:'sky',lifepath:'lifepath','lifepath-compat':'lifepath','matrix-compat':'matrix','matrix-child':'matrix','astro-maps':'chart',signs:'sky'},T=698;
function u(n){return 'url('+new URL('assets/art/'+n+'.svg?v=20261122h',document.baseURI).href+')';}
function size(s,f){var k=[].filter.call(s.children,function(c){return !/aqa-(art|flow)/.test(c.className)}),l=k[k.length-1],h=l?(l.offsetTop+l.offsetHeight):s.scrollHeight;h=h-T-8;f.style.height=(h>0?h:0)+'px';}
Object.keys(M).forEach(function(id){var s=document.getElementById(id);if(!s||s.querySelector(':scope>.aqa-art'))return;
var m=(id==='lifepath-compat'||id==='matrix-compat'||id==='matrix-child')?' aqa-mirror':'';
var d=document.createElement('div');d.className='aqa-art'+m;d.setAttribute('aria-hidden','true');d.style.setProperty('--aqa-img',u('celestial-'+M[id]));
var f=document.createElement('div');f.className='aqa-flow'+m;f.setAttribute('aria-hidden','true');f.style.setProperty('--aqa-img',u('flow-'+M[id]));
s.insertBefore(f,s.firstChild);s.insertBefore(d,s.firstChild);
var go=function(){size(s,f);};
if(window.ResizeObserver){var ro=new ResizeObserver(go);[].forEach.call(s.children,function(c){if(c!==d&&c!==f)ro.observe(c);});}
window.addEventListener('hashchange',function(){setTimeout(go,200);});setTimeout(go,300);setTimeout(go,1500);});})();
