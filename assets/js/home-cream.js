/* الهوم الكريمي الزجاجي: شريط الكواكب الحي + ورقة القراءة الكريمية.
   مصادر النصوص: نفس ملفات الموقع الحالية بلا إعادة صياغة —
   page-06.js (PLANETS/SIGNS + قوالب renderSkyPanel)، sky-moon-signs.js (AqMoonSigns)،
   sky-readings.js (AqReadings.PL / AqReadings.RT) عبر AqSkyTexts.load().
   المواضع لحظية من Astro.chart مثل صفحة السماء تمامًا. */
(function () {
  'use strict';

  var KEYS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  var IMG = { sun: 'planet-sun.png', moon: 'planet-moon.png', mercury: 'planet-mercury.png', venus: 'planet-venus.png', mars: 'planet-mars.png', jupiter: 'planet-jupiter.png', saturn: 'planet-saturn.png', uranus: 'planet-uranus.png', neptune: 'planet-neptune.png', pluto: 'planet-pluto.png' };
  /* أسئلة الكروت: نفس أسئلة PSY الموجودة في page-06 renderSkyPanel (العنصر الثالث) */
  var Q = {
    sun: 'لديك طاقة أكبر مما تُظهره، وحاجة هادئة إلى أن يُرى جهدك دون أن تطلب ذلك.',
    moon: 'تبدو متماسكًا للآخرين، لكنك تحتاج أحيانًا إلى من يسألك عن حالك ويصدّق إجابتك.',
    mercury: 'تفكر في أمور أكثر مما تقول، وتعيد صياغة كلام قيل لك قبل أيام.',
    venus: 'تعطي في العلاقات أكثر مما تعترف به، وتنتظر أن يلاحظ أحدهم ذلك دون أن تشير إليه.',
    mars: 'حين تصمت طويلًا ثم تنفجر، فالأمر لا يتعلق بالموقف الأخير بل بما سبقه.',
    jupiter: 'تؤمن بأن الأمور ستتحسن، وفي الوقت نفسه تخاف أن يكون تفاؤلك ساذجًا.',
    saturn: 'تحمل مسؤوليات كثيرة، وتتمنى سرًّا أن يخفف أحدهم عنك دون أن تضطر إلى الطلب.',
    uranus: 'تحتاج إلى مساحة تخصك، حتى في أقرب العلاقات إليك.',
    neptune: 'تشعر بما لا يقوله الناس، وهذا يُرهقك أحيانًا أكثر مما تعترف.',
    pluto: 'مررت بتحولات لم يعرف الناس عنها شيئًا، وما زلت تحمل أثرها في طريقة ثقتك.'
  };

  var openKey = null, chart = null, host = null, sheetRoot = null, tab = 'planets';
  var activeIdx = 0, dotsHost = null, scrollRaf = 0;
  function isMobile() { return !!(window.matchMedia && window.matchMedia('(max-width: 760px)').matches); }
  /* PLANETS/SIGNS in page-06.js are const globals (lexical, not window.*) */
  function gP() { return typeof PLANETS !== 'undefined' ? PLANETS : (window.PLANETS || null); }
  function gS() { return typeof SIGNS !== 'undefined' ? SIGNS : (window.SIGNS || null); }
  var ASP = [['conj', 0, 'اقتران'], ['sext', 60, 'تسديس'], ['square', 90, 'تربيع'], ['trine', 120, 'تثليث'], ['opp', 180, 'مقابلة']];
  /* سطر الزاوية: داعمة/متوترة من المعاينة المعتمدة، والاندماج من page-06 AM.conj حرفيًا */
  var ASP_LINE = { sup: 'انسياب وسهولة يدعمان الطرفين.', ch: 'احتكاك يحرّك الأمور ويطلب قراراً.', neu: 'يلتقي المجالان في نقطة واحدة فيمتزجان، ويصعب الفصل بينهما.' };

  function nd(n) { return n.toLocaleString('ar-EG'); }
  function stageOf(deg) {
    return deg < 10 ? ['بداية الدخول', 'الطاقة جديدة وما زالت تتشكل، وأثرها يبدأ بالظهور تدريجيًا.']
      : deg < 20 ? ['منتصف الرحلة', 'الطاقة مستقرة وواضحة، وهذا أصفى وقت لتقرأ أثرها في يومك.']
      : deg < 29 ? ['أواخر البرج', 'الطاقة ناضجة وتقترب من التبدّل، فخذ ما بدأته إلى خواتيمه.']
      : ['على أعتاب برج جديد', 'آخر درجات البرج، وتغيّر الأجواء قريب جدًا.'];
  }
  function body(k) { return chart.bodies.find(function (x) { return x.key === k; }); }

  function compute() {
    chart = window.Astro.chart({ utcMs: Date.now(), lat: 30, lon: 31, known: false });
  }

  function renderStrip() {
    if (!host || !chart) return;
    host.innerHTML = KEYS.map(function (k) {
      var p = gP()[k], bd = body(k), S = gS()[bd.sign];
      var deg = bd.lon % 30;
      var retro = bd.retro && k !== 'sun' && k !== 'moon';
      return '<button type="button" class="aqhc-planet' + (openKey === k ? ' on' : '') + '" data-k="' + k + '" aria-pressed="' + (openKey === k) + '">'
        + '<span class="aqhc-planet-img"><img src="assets/images/home/planets/' + IMG[k] + '" alt="" loading="lazy" decoding="async"></span>'
        + '<span class="aqhc-planet-name">' + p.n + '</span>'
        + '<span class="aqhc-planet-pos">' + S.n + ' <b>' + nd(Math.floor(deg)) + '°</b></span>'
        + '<span class="aqhc-planet-move st-' + (retro ? 'retro' : 'direct') + '">' + (retro ? 'تراجع' : 'حركة مباشرة') + '</span>'
        + '<span class="aqhc-planet-q">' + Q[k] + '</span>'
        + '</button>';
    }).join('');
    Array.prototype.forEach.call(host.querySelectorAll('.aqhc-planet'), function (el, i) {
      el.addEventListener('click', function () {
        var k = el.getAttribute('data-k');
        if (isMobile()) centerCard(i);
        if (openKey === k) closeSheet(); else openSheet(k);
      });
    });
    renderDots();
  }

  /* الكارت الأقرب لمنتصف الشريط يأخذ التمييز (مثل المعاينة المعتمدة) + نقاط التمرير */
  function syncOn() {
    if (!host) return;
    var m = isMobile();
    Array.prototype.forEach.call(host.querySelectorAll('.aqhc-planet'), function (el, i) {
      el.classList.toggle('on', (m && i === activeIdx) || el.getAttribute('data-k') === openKey);
    });
    if (dotsHost) Array.prototype.forEach.call(dotsHost.children, function (d, i) {
      d.classList.toggle('on', i === activeIdx);
    });
  }

  function renderDots() {
    if (!dotsHost) return;
    if (dotsHost.children.length !== KEYS.length) {
      dotsHost.innerHTML = KEYS.map(function (k, i) {
        return '<button type="button" data-i="' + i + '" tabindex="-1"></button>';
      }).join('');
      Array.prototype.forEach.call(dotsHost.children, function (d) {
        d.addEventListener('click', function () { centerCard(+d.getAttribute('data-i')); });
      });
    }
    syncOn();
  }

  function centerCard(i) {
    var el = host && host.children[i];
    if (el && el.scrollIntoView) {
      try { el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); }
      catch (e) { el.scrollIntoView(); }
    }
    activeIdx = i;
    syncOn();
  }

  function nearestToCenter() {
    if (!host || !host.children.length) return 0;
    var r = host.getBoundingClientRect(), mid = r.left + r.width / 2, best = 0, bd = Infinity;
    Array.prototype.forEach.call(host.children, function (el, i) {
      var cr = el.getBoundingClientRect(), d = Math.abs(cr.left + cr.width / 2 - mid);
      if (d < bd) { bd = d; best = i; }
    });
    return best;
  }

  function onPlanetsScroll() {
    if (scrollRaf || !isMobile()) return;
    scrollRaf = (window.requestAnimationFrame || function (f) { return setTimeout(f, 60); })(function () {
      scrollRaf = 0;
      var i = nearestToCenter();
      if (i !== activeIdx) { activeIdx = i; syncOn(); }
    });
  }

  /* بطاقة «يومك»: قراءة حقول علم الأعداد المملوءة أصلًا (بدون إعادة حساب) */
  function initDay() {
    var sec = document.getElementById('aqhd');
    if (!sec) return;
    function txt(el) { return el ? (el.textContent || '').trim() : ''; }
    function field(name) { return txt(document.querySelector('#aqh-energy [data-f="' + name + '"]')); }
    function setT(id, v) { var n = document.getElementById(id); if (n) n.textContent = v; }
    function fill() {
      var numM = /(\d+)/.exec(txt(document.getElementById('aq-obs-daynum')));
      var theme = txt(document.getElementById('aq-obs-focus')) || field('theme');
      if (!numM || !theme) return false;
      setT('aqhd-num', numM[1]);
      setT('aqhd-theme', theme);
      var note = field('themeNote');
      var noteEl = document.getElementById('aqhd-note');
      if (noteEl) { noteEl.textContent = note; noteEl.hidden = !note; }
      var tip = field('themeDay').replace(/^\S+:\s*/, '');
      if (tip) { setT('aqhd-tip-t', tip); document.getElementById('aqhd-tip').hidden = false; }
      var src = field('themeSrc') || ('مصدر الرسالة: علم الأعداد — رقم اليوم ' + numM[1]);
      var srcEl = document.getElementById('aqhd-src');
      if (srcEl) { srcEl.textContent = src; srcEl.hidden = false; }
      var today = txt(document.getElementById('aqh-today')).replace(/،/g, '');
      var dateEl = document.getElementById('aqhd-date');
      if (dateEl) { dateEl.textContent = today; dateEl.hidden = !today; }
      sec.hidden = false;
      return true;
    }
    var tries = 0;
    (function attempt() {
      if (fill()) return;
      if (++tries < 40) setTimeout(attempt, 500);
    })();
    var energy = document.getElementById('aqh-energy');
    if (energy && window.MutationObserver) {
      new MutationObserver(function () { fill(); }).observe(energy, { childList: true, characterData: true, subtree: true });
    }
  }

  function sheetHtml(k) {
    var p = gP()[k], bd = body(k), S = gS()[bd.sign];
    var deg = bd.lon % 30, dInt = Math.floor(deg);
    var retro = bd.retro && k !== 'sun' && k !== 'moon';
    var st = stageOf(deg);
    var defH = (p.n === 'الشمس' || p.n === 'الزهرة' ? 'ما هي ' : 'ما هو ') + p.n + '؟';
    var def = p.n + ' يمثل ' + p.theme + '، وهو العدسة التي تُقرأ بها ' + p.lens + '. حين يكون متوازنًا يعطيك ' + p.give + '، ويحتاج منك انتباهًا إلى ' + p.watch + '.';
    var lead;
    if (k === 'moon' && window.AqMoonSigns && window.AqMoonSigns[bd.sign]) lead = window.AqMoonSigns[bd.sign].t;
    else lead = 'يمرّ ' + p.n + ' الآن في ' + S.n + '، فيمنح ' + p.theme + ' طابعًا ' + S.way + '.';
    var support = 'الأجواء تساعد على ' + S.strength + '، وتذكّرك بلطف أن تنتبه من ' + S.shadow + '، فهو الوجه الذي يظهر حين تتعب.';
    var pl = (window.AqReadings && window.AqReadings.PL && window.AqReadings.PL[k]) || null;
    var rt = (retro && window.AqReadings && window.AqReadings.RT && window.AqReadings.RT[k]) || '';
    var nextK = KEYS[(KEYS.indexOf(k) + 1) % KEYS.length];
    var chev = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
    return '<div class="aqhc-sheet-scrim" data-close></div>'
      + '<div class="aqhc-sheet" role="dialog" aria-modal="true" aria-label="قراءة ' + p.n + ' السريعة">'
      + '<button type="button" class="aqhc-sheet-close" aria-label="إغلاق" data-close><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>'
      + '<button type="button" class="aqhc-sheet-next" data-next="' + nextK + '">التالي: ' + gP()[nextK].n + chev + '</button>'
      + '<div class="aqhc-sheet-grip"></div>'
      + '<p class="aqhc-sheet-eyebrow">السماء الآن · قراءة سريعة</p>'
      + '<h3 class="aqhc-sheet-title">' + p.n + ' في ' + S.n + '</h3>'
      + '<div class="aqhc-sheet-pills">'
      + '<span class="aqhc-pill st-' + (retro ? 'retro' : 'direct') + '">' + (retro ? 'تراجع' : 'حركة مباشرة') + '</span>'
      + '<span class="aqhc-pill deg">' + S.n + ' ' + nd(dInt) + '°</span>'
      + '</div>'
      + '<div class="aqhc-deg"><div class="aqhc-deg-track"><i style="right:' + Math.min(96, (deg / 30) * 100).toFixed(1) + '%"></i></div>'
      + '<div class="aqhc-deg-labels"><span>٠°</span><b>' + st[0] + '</b><span>٣٠°</span></div>'
      + '<p class="aqhc-deg-stage">' + st[1] + '</p></div>'
      + '<div class="aqhc-def"><p class="aqhc-def-h">' + defH + '</p><p class="aqhc-def-p">' + def + '</p></div>'
      + '<p class="aqhc-lead">' + lead + '</p>'
      + '<p class="aqhc-support">' + support + '</p>'
      + (pl ? '<div class="aqhc-pl"><p class="aqhc-pl-t">' + pl[0] + '</p><p class="aqhc-pl-p">' + pl[1] + '</p><p class="aqhc-pl-p">' + pl[2] + '</p></div>'
        + '<div class="aqhc-ask"><b>ما يطلبه منك</b>' + pl[3] + '</div>' : '')
      + (rt ? '<p class="aqhc-retro">' + rt + '</p>' : '')
      + '<div class="aqhc-links">'
      + '<a class="aqhc-link" href="#signs" data-close><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M7 4.5C8 9 8 15 7 19.5M17 4.5C16 9 16 15 17 19.5M5 9.5c4.5 1.2 9.5 1.2 14 0M5 14.5c4.5-1.2 9.5-1.2 14 0"/></svg></i>شوف توقعات برجك</a>'
      + '<a class="aqhc-link" href="#sky" data-close><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5l2.2 5.6 6 .4-4.6 3.8 1.5 5.9L12 15.9l-5.1 3.3 1.5-5.9-4.6-3.8 6-.4Z"/></svg></i>اكتشف السما</a>'
      + '</div></div>';
  }

  function topAspects() {
    var bs = chart.bodies.filter(function (x) { return KEYS.indexOf(x.key) >= 0; });
    var found = [];
    for (var i = 0; i < bs.length; i++) for (var j = i + 1; j < bs.length; j++) {
      var A = bs[i], B = bs[j], d = Math.abs(A.lon - B.lon) % 360, sep = d > 180 ? 360 - d : d;
      var lim = (A.key === 'sun' || A.key === 'moon' || B.key === 'sun' || B.key === 'moon') ? 8 : 6;
      for (var a = 0; a < ASP.length; a++) {
        var orb = Math.abs(sep - ASP[a][1]);
        if (orb <= lim) { found.push({ A: A.key, B: B.key, name: ASP[a][2], kind: ASP[a][0], orb: orb }); break; }
      }
    }
    found.sort(function (x, y) { return x.orb - y.orb; });
    return found.slice(0, 6);
  }

  function renderRetro() {
    var hostR = document.getElementById('aqhc-retro'); if (!hostR) return;
    hostR.innerHTML = KEYS.filter(function (k) { var b = body(k); return b.retro && k !== 'sun' && k !== 'moon'; }).map(function (k) {
      var p = gP()[k], bd = body(k), S = gS()[bd.sign];
      return '<div class="aqhc-retro-row" data-k="' + k + '" role="button" tabindex="0">'
        + '<img src="assets/images/home/planets/' + IMG[k] + '" alt="" loading="lazy" decoding="async">'
        + '<div class="aqhc-retro-main"><div class="aqhc-retro-head"><b>' + p.n + '</b>'
        + '<span class="aqhc-retro-pos">' + S.n + ' ' + nd(Math.floor(bd.lon % 30)) + '°</span>'
        + '<span class="aqhc-planet-move st-retro">تراجع</span></div>'
        + '<p class="aqhc-retro-q">' + Q[k] + '</p></div></div>';
    }).join('') || '<p class="aqhc-none">لا توجد تراجعات مؤثرة الآن.</p>';
    Array.prototype.forEach.call(hostR.querySelectorAll('.aqhc-retro-row'), function (el) {
      el.addEventListener('click', function () { openSheet(el.getAttribute('data-k')); });
    });
  }

  function renderAspects() {
    var hostA = document.getElementById('aqhc-aspects'); if (!hostA) return;
    hostA.innerHTML = topAspects().map(function (x) {
      var cls = x.kind === 'trine' || x.kind === 'sext' ? 'sup' : (x.kind === 'conj' ? 'neu' : 'ch');
      var lbl = cls === 'sup' ? 'داعمة' : (cls === 'neu' ? 'اندماج' : 'متوترة');
      return '<div class="aqhc-aspect-card">'
        + '<span class="aqhc-chip ' + cls + '">' + lbl + '</span>'
        + '<b>' + gP()[x.A].n + ' ' + x.name + ' ' + gP()[x.B].n + '</b>'
        + '<span class="aqhc-aspect-diff">فارق ' + x.orb.toFixed(1) + '°</span>'
        + '<p>' + ASP_LINE[cls] + '</p></div>';
    }).join('') || '<p class="aqhc-none">لا توجد أسبكتات مؤثرة في هذه اللحظة، فالسماء هادئة نسبيًا.</p>';
  }

  function setTab(t) {
    tab = t; if (openKey) closeSheet();
    var wrap = document.getElementById('aqhc'); if (!wrap) return;
    Array.prototype.forEach.call(wrap.querySelectorAll('.aqhc-tab'), function (b) {
      b.classList.toggle('on', b.getAttribute('data-tab') === t);
    });
    document.getElementById('aqhc-planets').hidden = t !== 'planets';
    document.getElementById('aqhc-retro').hidden = t !== 'retro';
    document.getElementById('aqhc-aspects').hidden = t !== 'aspects';
    if (t === 'retro') renderRetro();
    if (t === 'aspects') renderAspects();
  }

  function openSheet(k) {
    openKey = k;
    var render = function () {
      if (openKey !== k || !sheetRoot) return;
      sheetRoot.innerHTML = sheetHtml(k);
      sheetRoot.hidden = false;
      document.body.classList.add('aqhc-lock');
      renderStrip();
      Array.prototype.forEach.call(sheetRoot.querySelectorAll('[data-close]'), function (el) {
        el.addEventListener('click', closeSheet);
      });
      var nx = sheetRoot.querySelector('[data-next]');
      if (nx) nx.addEventListener('click', function () { openSheet(nx.getAttribute('data-next')); });
      var sh = sheetRoot.querySelector('.aqhc-sheet');
      if (sh) sh.scrollTop = 0;
    };
    if (!window.AqReadings && window.AqSkyTexts) {
      render(); /* يظهر بالنصوص الأساسية فورًا */
      window.AqSkyTexts.load().then(function (ok) { if (ok) render(); });
    } else render();
  }

  function closeSheet() {
    openKey = null;
    if (sheetRoot) { sheetRoot.hidden = true; sheetRoot.innerHTML = ''; }
    document.body.classList.remove('aqhc-lock');
    renderStrip();
  }

  function tick() {
    try { compute(); renderStrip(); } catch (e) { }
  }

  function init() {
    host = document.getElementById('aqhc-planets');
    dotsHost = document.getElementById('aqhc-pdots');
    sheetRoot = document.getElementById('aqhc-sheet-root');
    if (!host || !sheetRoot) return;
    host.addEventListener('scroll', onPlanetsScroll, { passive: true });
    initDay();
    if (sheetRoot.parentElement !== document.body) document.body.appendChild(sheetRoot);
    if (!window.Astro || !gP() || !gS()) { setTimeout(init, 400); return; }
    tick();
    activeIdx = isMobile() ? nearestToCenter() : 0;
    syncOn();
    Array.prototype.forEach.call(document.querySelectorAll('.aqhc-tab'), function (b) {
      b.addEventListener('click', function () { setTab(b.getAttribute('data-tab')); });
    });
    setInterval(function () { if (!document.hidden && !openKey) { tick(); if (tab === 'retro') renderRetro(); if (tab === 'aspects') renderAspects(); } }, 60000);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openKey) closeSheet(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
