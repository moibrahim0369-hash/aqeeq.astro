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
  function pairOf(d1, d2) {
    var r = AD().reduceArcana, p1 = ofDate(d1), p2 = ofDate(d2);
    return { a: p1, b: p2, c: fromCorners(r(p1.A + p2.A), r(p1.B + p2.B), r(p1.C + p2.C)) };
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
    { t: 'سر اللقاء وطاقة الانسجام', i: 'spark', intro: 'هذا ما يجمعكما من أول لحظة: الطاقة التي تظهر حين تجلسان معًا، والشيء الذي يجعل الحديث بينكما سهلًا حتى قبل أن تعرفا السبب.', pts: [['A', 'طاقة الحضور المشترك'], ['B', 'الرابط الروحي بينكما']] },
    { t: 'نقاط الاحتكاك وكارما العلاقة', i: 'knot', intro: 'كل علاقة تحمل درسًا يتكرر. هنا الموضع الذي يعود إليه الخلاف مرة بعد مرة، لا ليهدم ما بينكما بل ليُفهم.', pts: [['D', 'الدرس المتكرر'], ['D3', 'ما تحمله العلاقة من القديم']] },
    { t: 'منطقة الأمان والتردد النفسي', i: 'home', intro: 'هذه هي الحالة التي ترتاح فيها العلاقة حين لا يراقبها أحد: الإيقاع الهادئ الذي تعودان إليه بعد أي توتر.', pts: [['E', 'مركز العلاقة'], ['A2', 'ما يطمئن كلًّا منكما في الآخر']] },
    { t: 'بوصلة التوازن', i: 'scale', intro: 'توصيات عملية للشريكين: أين تحتاج العلاقة إلى أخذ وعطاء متساويين، وما العادة الصغيرة التي تعيد الميزان حين يميل.', pts: [['balance', 'نقطة الميزان'], ['B2', 'ما يغذّي العلاقة من الداخل']] },
    { t: 'نقطة الخطر والانفصال', i: 'alert', intro: 'ليست نبوءة بالفراق. هي الموضع الأضعف في العلاقة، الذي يحتاج انتباهًا مبكرًا قبل أن يتحول الصمت إلى مسافة.', pts: [['D2', 'مدخل التوتر'], ['heart', 'باب القلب في العلاقة']] },
    { t: 'أهداف الشراكة والنجاح المشترك', i: 'target', intro: 'ما الذي تستطيعان بناءه معًا ولا يبنيه أحدكما وحده: العمل، المال، والأثر الذي تتركه العلاقة في من حولها.', pts: [['social', 'غاية العلاقة أمام الناس'], ['money', 'باب الوفرة المشتركة'], ['C', 'طاقة الإنجاز المادي']] },
    { t: 'الكنوز الكامنة ومستقبل العلاقة', i: 'gem', intro: 'المواهب التي لا تظهر في البداية، وتنضج مع الوقت. هذا ما يمكن أن تصير إليه العلاقة إذا أُعطيت صبرها.', pts: [['F', 'موهبة تكبر مع الوقت'], ['G', 'هدية العلاقة لكما'], ['spiritual', 'الغاية الأبعد']] }
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
  function cornerRow(title, P) {
    return '<div class="mxm-row"><span>' + esc(title) + '</span>' + ['A', 'B', 'C', 'D', 'E'].map(function (k) { return '<b>' + P[k] + '</b>'; }).join('') + '</div>';
  }
  var HEADROW = '<div class="mxm-row mxm-hr"><span></span><i>اليوم</i><i>الشهر</i><i>السنة</i><i>الدرس</i><i>المركز</i></div>';

  function renderPair(host, d1, d2, n1, n2) {
    var R = pairOf(d1, d2), c = R.c;
    host.innerHTML = '<div class="mxm-sum"><h3>مصفوفة الشراكة</h3><p>أرقام العلاقة ناتجة من جمع أركان مصفوفتيكما ثم اختزالها إلى طاقات المصفوفة.</p>' +
      '<div class="mxm-tab">' + HEADROW + cornerRow(n1 || 'أنت', R.a) + cornerRow(n2 || 'شريكك', R.b) + '<div class="mxm-sep"></div>' + cornerRow('الشراكة', c) + '</div></div>' +
      accHtml(PAIR, function (k) { return { n: c[k] }; }) +
      '<p class="mxm-note">النصوص داخل الأقسام تمهيدية، والأرقام محسوبة من تاريخي الميلاد.</p>';
    host.hidden = false;
  }
  function renderChild(host, d, name) {
    var P = ofDate(d), age = ageOf(P.birth), ae = ageEnergy(P, age);
    host.innerHTML = '<div class="mxm-sum"><h3>' + (name ? 'مصفوفة ' + esc(name) : 'مصفوفة الطفل') + '</h3><p>العمر الآن: ' + age + (age === 1 ? ' سنة' : ' سنوات') + '. الأرقام محسوبة من تاريخ ميلاد الطفل.</p>' +
      '<div class="mxm-tab">' + HEADROW + cornerRow(name || 'الطفل', P) + '</div></div>' +
      accHtml(CHILD, function (k) {
        if (k === '__year') return { n: P.yearEnergy.number, x: P.yearEnergy.label };
        if (k === '__age') return { n: ae.number, x: 'من عمر ' + ae.age };
        return { n: P[k] };
      }) +
      '<p class="mxm-note">النصوص داخل الأقسام تمهيدية، والأرقام محسوبة من تاريخ الميلاد.</p>';
    host.hidden = false;
  }

  function field(id, label, type) {
    return '<div class="field"><label for="' + id + '"><span>' + label + '</span></label><input id="' + id + '" type="' + type + '"' + (type === 'date' ? ' min="1900-01-01" max="2100-12-31"' : ' autocomplete="off"') + '></div>';
  }
  function build() {
    var sec = document.getElementById('matrix'), form = document.getElementById('mform'), res = document.getElementById('mresult');
    if (!sec || !form || document.getElementById('mxm-switch') || !AD()) return;
    var sw = document.createElement('div'); sw.id = 'mxm-switch'; sw.className = 'mxm-switch'; sw.setAttribute('role', 'tablist');
    sw.innerHTML = '<button type="button" role="tab" data-mxm="solo" aria-selected="true"><span class="mxm-sic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.6"/><path d="M5 20c.6-3.8 3.4-6 7-6s6.4 2.2 7 6"/></svg></span><span class="mxm-slb">مصفوفتك</span></button><button type="button" role="tab" data-mxm="pair" aria-selected="false"><span class="mxm-sic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8.5" cy="8.5" r="3"/><circle cx="16" cy="9.5" r="2.6"/><path d="M2.8 19c.5-3.2 2.7-5 5.7-5s5.2 1.8 5.7 5M14.6 14.4c3 0 5.2 1.6 5.8 4.6"/></svg></span><span class="mxm-slb">توافق الشريكين</span></button><button type="button" role="tab" data-mxm="child" aria-selected="false"><span class="mxm-sic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="7.5" r="3"/><path d="M6.5 20c.3-3 2.5-5 5.5-5s5.2 2 5.5 5"/><path d="M9.5 3.6c.8-1 4.2-1 5 0"/></svg></span><span class="mxm-slb">مصفوفة الطفل</span></button>';
    form.parentNode.insertBefore(sw, form);

    var pair = document.createElement('div'); pair.id = 'mxm-pair'; pair.className = 'mxm-panel'; pair.hidden = true;
    pair.innerHTML = '<form class="mxm-form" novalidate><p class="mxm-lead">أدخل تاريخي الميلاد لتظهر مصفوفة الشراكة وما تحمله من انسجام ودروس.</p>' +
      '<div class="mxm-grp"><h4>أنت</h4>' + field('mxm-n1', 'الاسم (اختياري)', 'text') + field('mxm-d1', 'تاريخ الميلاد', 'date') + '</div>' +
      '<div class="mxm-grp"><h4>شريكك</h4>' + field('mxm-n2', 'الاسم (اختياري)', 'text') + field('mxm-d2', 'تاريخ الميلاد', 'date') + '</div>' +
      '<p class="ferr" hidden role="alert"></p><button class="btn" type="submit">احسب مصفوفة الشراكة</button></form><div class="mxm-result" hidden aria-live="polite"></div>';
    var child = document.createElement('div'); child.id = 'mxm-child'; child.className = 'mxm-panel'; child.hidden = true;
    child.innerHTML = '<form class="mxm-form" novalidate><p class="mxm-lead">أدخل تاريخ ميلاد الطفل لتقرأ طباعه ومواهبه وما يحتاجه من أهله.</p>' +
      '<div class="mxm-grp">' + field('mxm-n3', 'اسم الطفل (اختياري)', 'text') + field('mxm-d3', 'تاريخ ميلاد الطفل', 'date') + '</div>' +
      '<p class="ferr" hidden role="alert"></p><button class="btn" type="submit">احسب مصفوفة الطفل</button></form><div class="mxm-result" hidden aria-live="polite"></div>';
    form.parentNode.insertBefore(pair, form.nextSibling); pair.parentNode.insertBefore(child, pair.nextSibling);

    function setMode(m) {
      sw.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.mxm === m)); });
      sec.setAttribute('data-mxm', m);
      form.classList.toggle('mxm-off', m !== 'solo'); pair.hidden = m !== 'pair'; child.hidden = m !== 'child';
      sec.querySelectorAll('.mxp-head, .aq-mx-about').forEach(function (el) { el.classList.toggle('mxm-off', m !== 'solo'); });
      if (res) res.classList.toggle('mxm-off', m !== 'solo');
      var on = sw.querySelector('[aria-selected=true]'); if (on && on.scrollIntoView) { try { on.scrollIntoView({ block: 'nearest', inline: 'center' }); } catch (e) {} }
    }
    sw.addEventListener('click', function (e) { var b = e.target.closest('[data-mxm]'); if (b) setMode(b.dataset.mxm); });

    function bind(panel, ids, fn) {
      var f = panel.querySelector('form'), err = panel.querySelector('.ferr'), out = panel.querySelector('.mxm-result');
      f.addEventListener('submit', function (e) {
        e.preventDefault(); err.hidden = true;
        var vals = ids.map(function (id) { return (document.getElementById(id) || {}).value || ''; });
        if (vals.some(function (v) { return !/^\d{4}-\d{2}-\d{2}$/.test(v); })) { err.textContent = 'اختر تاريخ الميلاد كاملًا: اليوم والشهر والسنة.'; err.hidden = false; return; }
        try { fn(out, vals); out.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        catch (x) { err.textContent = 'تعذّر الحساب. راجع التاريخ وحاول مرة أخرى.'; err.hidden = false; }
      });
    }
    bind(pair, ['mxm-d1', 'mxm-d2'], function (out, v) { renderPair(out, v[0], v[1], document.getElementById('mxm-n1').value.trim(), document.getElementById('mxm-n2').value.trim()); });
    bind(child, ['mxm-d3'], function (out, v) { renderChild(out, v[0], document.getElementById('mxm-n3').value.trim()); });

    function fromHash() {
      var m = /[?&]mode=(pair|child)/.exec(location.hash) || /^#matrix-(pair|child)$/.exec(location.hash);
      if (m) setMode(m[1]);
    }
    window.AqMatrixModes.setMode = setMode;
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-mxm-go]'); if (!a) return;
      setTimeout(function () { setMode(a.getAttribute('data-mxm-go')); var s = document.getElementById('matrix'); if (s) s.scrollTop = 0; }, 60);
    });
    fromHash();
  }
  window.AqMatrixModes = { fromCorners: fromCorners, ofDate: ofDate, pairOf: pairOf, ageEnergy: ageEnergy };
  if (typeof module !== 'undefined' && module.exports) module.exports = window.AqMatrixModes;
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
  }
})();
