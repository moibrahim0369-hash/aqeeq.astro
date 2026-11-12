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
    var inv = $('#invest'), grid = inv && $('.inv-grid', inv); if (!grid || $('#b3-vip')) return;
    var cards = [
      { t: 'ما سيحدث في 2027', q: 'ما الفصول التي ستُغلق في حياتك العام القادم؟', href: '#year2027', cls: 'a', ic: '<path d="M12 3l1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800z"/>' },
      { t: 'الذيل الكارمي', q: 'ما الدرس الذي يعود إليك كلما ظننت أنك تجاوزته؟', href: '#karmic', cls: 'b', ic: '<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3.500 2"/>' }
    ];
    var box = document.createElement('section'); box.id = 'b3-vip'; box.className = 'b3-vip';
    box.innerHTML = '<div class="b3-vip-track" tabindex="0" role="region" aria-label="التقارير المميزة، مرّر أفقيًا">' + cards.map(function (c) {
      return '<a class="b3-vcard" href="' + c.href + '"><span class="b3-vart b3-vart-' + c.cls + '">' + svg(c.ic, 56) + '<em>تقرير مميز</em></span><span class="b3-vtx"><b>' + c.t + '</b><small>' + c.q + '</small></span></a>';
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
      var nm = ($('#kt-name').value || '').trim(), t = r.karm;
      out.innerHTML = '<div class="y27-rhead"><span class="y27-kick">ذيلك الكارمي' + (nm ? ' · ' + esc(nm) : '') + '</span><h3>هذه أرقام ذيلك</h3></div>' +
        '<div class="b3-kt-tri">' + ['الجذر', 'الفرع', 'الظهور'].map(function (l, i) { return '<div class="b3-kt-n"><small>' + l + '</small><b>' + t[i] + '</b><span>' + esc(r.name(t[i])) + '</span></div>'; }).join('') + '</div>' +
        '<div class="y27-about"><p>' + esc(r.name(t[0])) + ' هو أول الخيط عندك. منه يبدأ الدرس الذي تعود إليه، ثم يتفرع في ' + esc(r.name(t[1])) + '، ويظهر في سلوكك اليومي بصورة ' + esc(r.name(t[2])) + '.</p></div>' +
        '<div class="b3-lock"><b>ما لا يظهر هنا</b><p>من أين جاء هذا الدرس، وكيف يلمس علاقاتك ومالك وقراراتك، ثم روشتة عملية للتخفف من ثقله.</p><div class="b3-acts"><a class="b3-b1" href="#pay">افتح التقرير الكامل</a><a class="b3-b2" href="#pay">تحميل PDF</a></div></div>';
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
    document.addEventListener('aqeeq:natal-ready', syncMe);
    setTimeout(openWelcome, 4000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
