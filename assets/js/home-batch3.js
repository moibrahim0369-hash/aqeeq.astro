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
    { t: 'اكتشف ذيلك الكارمي', s: 'الدرس الذي يعود إليك مرة بعد مرة', href: '#invest', k: 'karmic', ic: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>' },
    { t: 'رسالة برجك اليوم', s: 'اختر برجك واقرأ رسالتك', href: '#signs', ic: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>' },
    { t: 'مسار علاقاتك', s: 'لماذا تتكرر نفس القصة في قلبك؟', href: '#invest', k: 'love', ic: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.400A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/>' },
    { t: 'خريطتك الفلكية كاملة', s: 'طالعك وقمرك وبيوتك في مكان واحد', href: '#invest', k: 'chart', ic: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.500"/><path d="M12 3.500v6M12 14.500v6"/>' }
  ];
  function buildRot() {
    var host = $('#b3-rot'); if (!host) return;
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
    a.innerHTML = '<span class="b3-zod-ic">' + svg('<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.600 5.600l12.800 12.800M18.400 5.600 5.600 18.400" stroke-opacity=".55"/>', 28) + '</span><span class="b3-zod-t"><em>رسالة برجك اليوم</em><b>ما الذي تريد السماء أن تقوله لبرجك اليوم؟</b><small>اختر برجك واقرأ رسالتك وتوقعك اليومي</small></span><span class="b3-rot-go">' + svg(ARROW, 18) + '</span>';
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
    var home = $('#home'), grid = home && $('.aqh-hero-grid', home); if (!grid) return;
    var me = $('#b3-me');
    if (!loggedIn()) { if (me) me.hidden = true; return; }
    if (!me) { me = document.createElement('section'); me.id = 'b3-me'; me.className = 'b3-me'; grid.parentNode.insertBefore(me, grid); }
    var n = null; try { n = window.AqeeqChartContext && window.AqeeqChartContext.getOrPrefill(); } catch (e) {}
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
    var inv = $('#invest'), grid = inv && $('.inv-grid', inv); if (!grid || $('#b3-reports')) return;
    var box = document.createElement('section'); box.id = 'b3-reports'; box.className = 'b3-reports';
    box.innerHTML = '<h3 class="b3-rh">تقارير متعمقة</h3><p class="b3-rp">اكتب تاريخ ميلادك مرة واحدة لتظهر لك بداية كل تقرير، ثم افتح التقرير الكامل حين تريد.</p>' +
      '<div class="field b3-rdate"><label for="iv-date"><span>تاريخ الميلاد</span></label><input id="iv-date" type="date" min="1900-01-01" max="2100-12-31"></div><div class="b3-rerr" hidden>اختر اليوم والشهر والسنة كاملة.</div><div class="b3-rl"></div>';
    grid.parentNode.insertBefore(box, grid);
    var list = box.querySelector('.b3-rl');
    list.innerHTML = REPORTS.map(function (r) {
      return '<details class="b3-card" data-k="' + r.k + '"><summary><span class="b3-ic">' + svg(r.ic, 22) + '</span><span class="b3-ct"><b>' + r.t + '</b><small>' + r.hook + '</small></span><span class="b3-ch" aria-hidden="true"></span></summary><div class="b3-cb"></div></details>';
    }).join('');
    function fill(card) {
      var r = REPORTS.filter(function (x) { return x.k === card.dataset.k; })[0], body = card.querySelector('.b3-cb'), ds = $('#iv-date').value, err = box.querySelector('.b3-rerr');
      if (r.direct) { body.innerHTML = '<p>' + r.more + '</p><div class="b3-acts"><a class="b3-b1" href="' + r.go + '">اعرض قراءة 2027</a></div>'; return; }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(ds)) { err.hidden = false; body.innerHTML = '<p class="b3-wait">اكتب تاريخ ميلادك بالأعلى لتظهر بداية هذا التقرير.</p>'; return; }
      err.hidden = true;
      try { body.innerHTML = r.part(calcR(ds)) + '<p class="b3-more">' + r.more + '</p><div class="b3-acts"><a class="b3-b1" href="' + r.go + '">افتح التقرير الكامل</a><a class="b3-b2" href="#pay">تحميل PDF</a></div>'; }
      catch (e) { body.innerHTML = '<p class="b3-wait">تعذر الحساب. راجع التاريخ.</p>'; }
    }
    list.addEventListener('toggle', function (e) { if (e.target.open) fill(e.target); }, true);
    box.addEventListener('change', function (e) { if (e.target.id === 'iv-date') list.querySelectorAll('details[open]').forEach(fill); });
    function openFromRot() { var k; try { k = sessionStorage.getItem('b3-open'); sessionStorage.removeItem('b3-open'); } catch (x) {} if (k) { var c = list.querySelector('[data-k="' + k + '"]'); if (c) { c.open = true; setTimeout(function () { try { c.scrollIntoView({ block: 'center' }); } catch (x) {} }, 150); } } }
    window.addEventListener('hashchange', function () { if (location.hash === '#invest') openFromRot(); });
    if (location.hash === '#invest') openFromRot();
  }

  function init() {
    buildRot(); buildZodiac(); buildReports(); syncMe();
    var u = document.getElementById('acct-user'); if (u) new MutationObserver(syncMe).observe(u, { attributes: true, attributeFilter: ['hidden'] });
    document.addEventListener('aqeeq:natal-ready', syncMe);
    setTimeout(openWelcome, 4000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
