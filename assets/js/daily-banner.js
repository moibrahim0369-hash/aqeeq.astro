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
  var cur = 0, timer = null, idleTimer = null, hovering = false, userActive = false;

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
    saturn: 'M8 3.500v13M5 7h6M8 11c2-3 7-3 7 1.500 0 3-3.200 4.500-3.200 7.500 0 1.200 1.200 1.500 2.200 1'
  };
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
    var c = Math.cos(elong * Math.PI / 180), r = 50, rx = Math.abs(c) * r, waxing = elong < 180;
    var sweep = c > 0 ? 0 : 1;
    var lit = 'M60 10 A50 50 0 0 1 60 110 A' + rx.toFixed(2) + ' 50 0 0 ' + sweep + ' 60 10Z';
    var tf = waxing ? '' : ' transform="translate(120 0) scale(-1 1)"';
    var uid = 'dm' + (++moonSeq) + '_' + Math.round(elong * 10);
    return '<defs><radialGradient id="' + uid + 'g" cx="42%" cy="40%"><stop offset="0" stop-color="#F8EBD0"/><stop offset="1" stop-color="#CDB48A"/></radialGradient>' +
      '<clipPath id="' + uid + 'c"><circle cx="60" cy="60" r="50"/></clipPath></defs>' +
      '<circle cx="60" cy="60" r="50" fill="#2A1A20" stroke="rgba(217,185,121,.45)" stroke-width="1"/>' +
      '<g clip-path="url(#' + uid + 'c)"><path d="' + lit + '" fill="url(#' + uid + 'g)"' + tf + '/>' +
      '<g' + tf + ' fill="#8a7458" opacity=".22"><circle cx="78" cy="46" r="7"/><circle cx="68" cy="74" r="9"/><circle cx="86" cy="68" r="4"/><circle cx="58" cy="34" r="4"/></g></g>';
  }
  function themeNum() { var m = /(\d+)/.exec(txt('aq-obs-daynum')); return m ? m[1] : ''; }
  function txt(id) { var n = document.getElementById(id); return n ? (n.textContent || '').trim() : ''; }
  var last = { key: '', ingKey: '' }, ing = null, errState = false;

  function renderStatic() {
    var d = new Date();
    function f(o) { try { return d.toLocaleDateString('ar-EG-u-nu-latn', o); } catch (e) { return ''; } }
    setF('wd', f({ weekday: 'long' })); setF('dateShort', f({ day: 'numeric', month: 'long' })); setF('year', f({ year: 'numeric' }));
    setF('dayNum', String(d.getDate())); setF('monthYear', f({ month: 'long', year: 'numeric' })); setF('dateLong', f({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
  }
  function renderNumerology() {
    var n = themeNum(), th = txt('aq-obs-focus');
    setF('numDay', n ? 'الرقم ' + n : '—');
    setF('theme', th || '—'); setF('themeSrc', n ? 'مصدر الرسالة: علم الأعداد — رقم اليوم ' + n : '');
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
    setF('moonShort', moonSign + ' · ' + ph + ' · ' + illum + '%', 1);
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
    /* الكوكب المؤثر (كوكب اليوم من home-v2) */
    if (ruler) {
      var rb = body(c, ruler);
      if (rb) {
        setF('ruler', planetGlyph(ruler) + ' ' + planetName(ruler) + ' في ' + signName(rb.sign) + ' ' + deg(rb.lon) + '° · ' + (rb.retro ? 'متراجع' : 'مباشر'), 1);
        setF('headline', 'يومٌ يحكمه ' + planetName(ruler) + '، والقمر في ' + signName(moon.sign) + ' (' + ph + ')');
        var th = (typeof PLANETS !== 'undefined' && PLANETS[ruler]) ? PLANETS[ruler].theme : '';
        setF('planetTheme', th ? '«' + planetName(ruler) + ': ' + th + '»' : '');
      }
    } else { setF('headline', 'القمر في ' + signName(moon.sign) + ' · ' + ph); }
    /* شريط الكواكب */
    var pl = ['mercury', 'venus', 'mars', 'jupiter', 'saturn'].map(function (k) { var b = body(c, k); if (!b) return ''; return '<span class="dbn-pl"><b>' + planetGlyph(k) + ' ' + planetName(k) + '</b> ' + signName(b.sign) + ' ' + deg(b.lon) + '°' + (b.retro ? ' <em>متراجع</em>' : '') + '</span>'; }).join('');
    setF('planets', pl, true);
  }
  function refresh() { renderStatic(); renderNumerology(); renderSky(); }
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
  function show(i, userDriven) {
    cur = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { var on = k === cur; s.classList.toggle('is-on', on); s.setAttribute('aria-hidden', on ? 'false' : 'true'); if ('inert' in s) s.inert = !on; });
    dots.forEach(function (d, k) { d.classList.toggle('is-on', k === cur); if (k === cur) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
    stage.setAttribute('aria-live', userDriven ? 'polite' : 'off');
    if (userDriven) { /* manual: pause then resume after idle */ pause(); armIdle(); } else schedule();
  }
  function stopTimers() { if (timer) { clearTimeout(timer); timer = null; } if (bar) { bar.classList.remove('is-run'); } }
  function schedule() {
    stopTimers();
    if (reduce || document.hidden || hovering || userActive) return;
    if (bar) { void bar.offsetWidth; bar.classList.add('is-run'); }
    timer = setTimeout(function () { show(cur + 1, false); }, AUTO_MS);
  }
  function pause() { stopTimers(); }
  function armIdle() { if (idleTimer) clearTimeout(idleTimer); userActive = true; idleTimer = setTimeout(function () { userActive = false; schedule(); }, IDLE_MS); }
  function userMove(delta) { show(cur + delta, true); }

  dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k, true); }); });
  root.querySelector('[data-dbn="prev"]').addEventListener('click', function () { userMove(-1); });
  root.querySelector('[data-dbn="next"]').addEventListener('click', function () { userMove(1); });
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

  /* init */
  show(0, false);
  window.__dbn = { show: function (i) { show(i, true); }, current: function () { return cur; }, refresh: refresh };
})();
