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
    { key: 'saturn', ar: 'زحل', sym: '♄', meaning: 'الالتزام والحدود ودروس الصبر.' }
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
    function openPlanet(p, body, opener) {
      hideTip();
      var retro = body.retro ? 'متراجع' : 'مباشر';
      var box = openLayer({
        kind: 'panel', titleId: 'aqh-panel-title', opener: opener,
        html: closeBtn + '<div class="aqh-panel-body"><p class="aqh-kicker" dir="ltr">PLANET</p><h3 id="aqh-panel-title"><span class="aqh-panel-glyph" aria-hidden="true">' + p.sym + '</span> ' + p.ar + '</h3>' +
          '<ul class="aqh-facts"><li><small>البرج الحالي</small><b>' + SIGN_GLYPH[body.sign] + ' ' + SIGN_AR[body.sign] + '</b></li><li><small>الدرجة</small><b>' + body.deg + '°</b></li><li><small>الحالة</small><b>' + retro + '</b></li></ul>' +
          '<p class="aqh-panel-sum">' + esc(p.meaning) + '</p>' +
          '<p class="aqh-note">أضف وقت ومكان الميلاد لعرض البيت الفلكي بدقة.</p>' +
          '<div class="aqh-panel-actions"><a class="aqh-solid" href="#sky" data-layer-close><span>اعرف المزيد</span>' + ARROW + '</a></div></div>'
      });
      $('a.aqh-solid', box).addEventListener('click', function () { closeLayer(true); });
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

    /* كواكب حقيقية من المحرك الحالي (إن لم يتوفر المحرك لا تُرسم) */
    function drawPlanets() {
      var data; try { data = skyNow(); } catch (e) { return; }
      var g = sv('g', { 'class': 'aqh-planets aqh-orbit-detail' });
      PLANETS.forEach(function (p, k) {
        var b = data[p.key]; if (!b) return;
        var a = (-90 + b.lon) * Math.PI / 180, r = 112 + ((k % 3) - 1) * 10;
        var x = (200 + Math.cos(a) * r).toFixed(2), y = (200 + Math.sin(a) * r).toFixed(2);
        var n = sv('g', { 'class': 'aqh-planet', role: 'button', tabindex: '0', 'aria-label': p.ar + ' في ' + SIGN_AR[b.sign] + ' ' + b.deg + ' درجة' + (b.retro ? '، متراجع' : '') });
        n.appendChild(sv('circle', { cx: x, cy: y, r: 9 }));
        var t = sv('text', { x: x, y: y, 'text-anchor': 'middle', 'dominant-baseline': 'central' }); t.textContent = p.sym; n.appendChild(t);
        var act = function () { openPlanet(p, b, n); };
        n.addEventListener('click', function (e) { e.stopPropagation(); act(); });
        n.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
        g.appendChild(n);
      });
      svg.appendChild(g);
    }
    drawPlanets();
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
    var SRC = 'assets/data/home/articles.json';
    function state(s, text) { carousel.setAttribute('data-state', s); msg.hidden = !text; if (text) msg.innerHTML = text; }
    function fmt(a) { var parts = []; if (a.category) parts.push(esc(a.category)); if (a.date) parts.push(esc(a.date)); if (a.readMinutes) parts.push(a.readMinutes + ' دقائق قراءة'); return parts.join(' · '); }
    function card(a) {
      return '<article class="aqh-article"><img src="' + esc(a.image) + '" alt="' + esc(a.imageAlt || '') + '" loading="lazy" decoding="async" draggable="false">' +
        '<div class="aqh-article-txt"><time>' + fmt(a) + '</time><h3><a class="aqh-article-link" href="#article-' + esc(a.slug) + '" data-slug="' + esc(a.slug) + '">' + esc(a.title) + '</a></h3><p>' + esc(a.intro) + '</p></div>' +
        '<span class="aqh-go" aria-hidden="true">' + ARROW + '</span></article>';
    }
    function load() {
      state('loading'); track.innerHTML = '<div class="aqh-article-skel" aria-hidden="true"><i></i><i></i><i class="s"></i></div><div class="aqh-article-skel" aria-hidden="true"><i></i><i></i><i class="s"></i></div><div class="aqh-article-skel" aria-hidden="true"><i></i><i></i><i class="s"></i></div>';
      fetch(SRC, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) {
        ARTICLES = (j && j.articles) || [];
        if (!ARTICLES.length) { track.innerHTML = ''; state('empty', '<p>لا توجد مقالات حاليًا.</p>'); return; }
        track.innerHTML = ARTICLES.map(card).join(''); state('ready');
        $$('.aqh-article', track).forEach(function (el, k) { el.classList.add('aqh-reveal'); el.style.setProperty('--aqh-d', (k * 70) + 'ms'); if (window.__aqhObserve) window.__aqhObserve(el); });
        restorePos(); update(); openFromHash();
      }).catch(function () { track.innerHTML = ''; state('error', '<p>تعذر تحميل المقالات. حاول مرة أخرى.</p><button type="button" class="aqh-outline-btn" data-car-retry><span>إعادة المحاولة</span></button>'); var r = $('[data-car-retry]', msg); if (r) r.addEventListener('click', load); });
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
    function restorePos() { try { var v = sessionStorage.getItem('aqh-car'); if (v) track.scrollLeft = parseFloat(v); } catch (e) { } }
    var drag = null, moved = false;
    track.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.button !== 0) return; drag = { x: e.clientX, s: track.scrollLeft }; moved = false; track.classList.add('is-drag'); });
    window.addEventListener('pointermove', function (e) { if (!drag) return; var dx = e.clientX - drag.x; if (Math.abs(dx) > 6) moved = true; if (moved) track.scrollLeft = drag.s - dx; });
    window.addEventListener('pointerup', function () { if (!drag) return; drag = null; track.classList.remove('is-drag'); });
    track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; return; } var l = e.target.closest('.aqh-article-link'); if (l) { e.preventDefault(); openArticle(l.getAttribute('data-slug'), l); } else { var c = e.target.closest('.aqh-article'); if (c) { var a = $('.aqh-article-link', c); e.preventDefault(); openArticle(a.getAttribute('data-slug'), a); } } }, true);
    $('#aqh-all-articles').addEventListener('click', function (e) { e.preventDefault(); track.scrollTo({ left: 0, behavior: reduce ? 'auto' : 'smooth' }); var s = $('#aqh-articles'); if (s) s.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); });
    document.addEventListener('keydown', function (e) { if (e.target === track && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); step(e.key === 'ArrowLeft' ? -1 : 1); } });

    /* --- معاينة المقال --- */
    function savedKey() { return 'aqh-saved:' + (session.user ? session.user.id : 'guest'); }
    function getSaved() { try { return JSON.parse(localStorage.getItem(savedKey()) || '[]'); } catch (e) { return []; } }
    function setSaved(list) { try { localStorage.setItem(savedKey(), JSON.stringify(list)); } catch (e) { } }
    function articleUrl(slug) { return location.origin + location.pathname + '#article-' + slug; }
    function openArticle(slug, opener) {
      var a = ARTICLES.filter(function (x) { return x.slug === slug; })[0];
      if (!a) { toast('المقال غير متاح حاليًا'); return; }
      var saved = getSaved().indexOf(slug) > -1;
      var box = openLayer({
        kind: 'modal', titleId: 'aqh-art-title', opener: opener, onClose: function () { if (location.hash === '#article-' + slug) history.replaceState(null, '', location.pathname + location.search + '#aqh-articles'); },
        html: closeBtn + '<img class="aqh-art-img" src="' + esc(a.image) + '" alt="' + esc(a.imageAlt || '') + '"><div class="aqh-art-body"><p class="aqh-kicker">' + esc(a.category) + '</p><h3 id="aqh-art-title">' + esc(a.title) + '</h3><p class="aqh-art-meta">' + fmt({ date: a.date, readMinutes: a.readMinutes }) + '</p><p class="aqh-art-intro">' + esc(a.intro) + '</p><div class="aqh-art-full" id="aqh-art-full" hidden>' + a.body + '</div>' +
          '<div class="aqh-art-actions"><button type="button" class="aqh-solid" data-art-full aria-expanded="false" aria-controls="aqh-art-full"><span>اقرأ المقال كاملًا</span>' + ARROW + '</button>' +
          '<button type="button" class="aqh-ghost" data-art-save aria-pressed="' + saved + '"><svg viewBox="0 0 24 24" fill="' + (saved ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M6 4h12v17l-6-4-6 4Z"/></svg><span>' + (saved ? 'محفوظ' : 'حفظ المقال') + '</span></button>' +
          '<span class="aqh-share-wrap"><button type="button" class="aqh-ghost" data-art-share aria-haspopup="menu" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="12" r="2.4"/><circle cx="17" cy="6" r="2.4"/><circle cx="17" cy="18" r="2.4"/><path d="m8.2 11 6.6-3.8M8.2 13l6.6 3.8"/></svg><span>مشاركة</span></button><span class="aqh-share-menu" role="menu" hidden><button type="button" role="menuitem" data-copy>نسخ الرابط</button></span></span>' +
          '<span class="aqh-saved-label" role="status" hidden>تم الحفظ</span></div></div>'
      });
      history.replaceState(null, '', '#article-' + slug);
      var full = $('#aqh-art-full', box), fb = $('[data-art-full]', box);
      fb.addEventListener('click', function () { var open = full.hidden; full.hidden = !open; fb.setAttribute('aria-expanded', open ? 'true' : 'false'); $('span', fb).textContent = open ? 'إخفاء النص الكامل' : 'اقرأ المقال كاملًا'; if (open) { full.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' }); } });
      var sb = $('[data-art-save]', box), lab = $('.aqh-saved-label', box);
      sb.addEventListener('click', function () {
        if (!(session.known && session.user)) { askLogin(opener); return; }
        var list = getSaved(), k = list.indexOf(slug), on = k === -1;
        if (on) list.push(slug); else list.splice(k, 1); setSaved(list);
        sb.setAttribute('aria-pressed', on); $('svg', sb).setAttribute('fill', on ? 'currentColor' : 'none'); $('span', sb).textContent = on ? 'محفوظ' : 'حفظ المقال';
        if (on) { lab.hidden = false; setTimeout(function () { lab.hidden = true; }, 1800); }
      });
      var sh = $('[data-art-share]', box), menu = $('.aqh-share-menu', box);
      sh.addEventListener('click', function () {
        if (navigator.share && !canHover) { navigator.share({ title: a.title, url: articleUrl(slug) }).catch(function () { }); return; }
        var o = menu.hidden; menu.hidden = !o; sh.setAttribute('aria-expanded', o ? 'true' : 'false');
      });
      $('[data-copy]', box).addEventListener('click', function () {
        var u = articleUrl(slug), done = function () { menu.hidden = true; sh.setAttribute('aria-expanded', 'false'); toast('تم نسخ الرابط', 2200); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(u).then(done, done); else { var ta = mk('textarea'); ta.value = u; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) { } ta.remove(); done(); }
      });
    }
    function askLogin(opener) {
      var back = ARTICLES.length && current ? current.opener : opener;
      openLayer({
        kind: 'small', titleId: 'aqh-login-title', opener: back,
        html: closeBtn + '<div class="aqh-small-body"><h3 id="aqh-login-title">سجّل الدخول لحفظ المقال</h3><p>حفظ المقالات متاح لأصحاب الحساب حتى لا تفقد ما حفظته. يمكنك متابعة القراءة دون تسجيل.</p><div class="aqh-panel-actions"><a class="aqh-solid" href="#account" data-layer-close><span>تسجيل الدخول</span>' + ARROW + '</a><button type="button" class="aqh-ghost" data-layer-close><span>لاحقًا</span></button></div></div>'
      });
    }
    function openFromHash() { var m = /^#article-([\w-]+)$/.exec(location.hash); if (m) openArticle(m[1], $('#aqh-articles')); }
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
      { t: 'التاروت', k: 'محراب بطاقات فرشة', h: '#tarot-chamber' },
      { t: 'السماء', k: 'ترانزيت عبور مرصد كواكب', h: '#sky' },
      { t: 'حسابي', k: 'تسجيل دخول ملف شخصي ارشيف', h: '#account' }
    ];
    btn.addEventListener('click', function () {
      var box = openLayer({
        kind: 'search', titleId: 'aqh-search-title', opener: btn,
        html: closeBtn + '<div class="aqh-search-body"><h3 id="aqh-search-title">بحث في الموقع</h3><label class="aqh-sr" for="aqh-q">ابحث عن قسم أو مقال</label><input id="aqh-q" type="search" placeholder="مثال: مصفوفة، تاروت، ترانزيت…" autocomplete="off"><ul class="aqh-results" role="listbox" aria-label="النتائج"></ul></div>'
      });
      var inp = $('#aqh-q', box), ul = $('.aqh-results', box);
      function items(q) {
        var n = norm(q), all = DEST.map(function (d) { return { t: d.t, sub: 'قسم', h: d.h, hay: norm(d.t + ' ' + d.k) }; })
          .concat(ARTICLES.map(function (a) { return { t: a.title, sub: 'مقال', slug: a.slug, hay: norm(a.title + ' ' + a.category + ' ' + a.intro) }; }));
        return n ? all.filter(function (x) { return x.hay.indexOf(n) > -1; }) : all.slice(0, 7);
      }
      function render() {
        var r = items(inp.value);
        ul.innerHTML = r.length ? r.map(function (x, k) { return '<li role="option"><a href="' + (x.h || '#article-' + x.slug) + '" data-k="' + k + '"><b>' + esc(x.t) + '</b><small>' + x.sub + '</small></a></li>'; }).join('') : '<li class="aqh-empty">لا نتائج مطابقة.</li>';
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
