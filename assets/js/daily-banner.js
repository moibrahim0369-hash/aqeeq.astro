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
    var c = Math.cos(elong * Math.PI / 180), rx = Math.abs(c) * 50, waxing = elong < 180;
    var sweep = c > 0 ? 0 : 1;
    var lit = 'M60 10 A50 50 0 0 1 60 110 A' + rx.toFixed(2) + ' 50 0 0 ' + sweep + ' 60 10Z';
    var tf = waxing ? '' : ' transform="translate(120 0) scale(-1 1)"';
    var u = 'dm' + (++moonSeq) + '_';
    /* قمر واقعي: كرة مظلّلة + بحار قمرية + فوهات بأشعة + حبيبات؛ الجانب المظلم يظهر بضوء الأرض الخافت، والجانب المضيء بحافة ناعمة */
    var rays = '<g stroke="#F8F3E8" stroke-opacity=".28" stroke-width=".5" fill="none"><path d="M78 84l10 12M78 84l-8 14M78 84l14-2M78 84l6-14"/><path d="M84 50l9-7M84 50l10 3M84 50l3 10"/></g>';
    return '<defs>' +
      '<radialGradient id="' + u + 'b" cx="38%" cy="34%" r="80%"><stop offset="0" stop-color="#F7F2E7"/><stop offset=".5" stop-color="#CFC7B8"/><stop offset=".85" stop-color="#8B8377"/><stop offset="1" stop-color="#5E574E"/></radialGradient>' +
      '<radialGradient id="' + u + 'l" cx="50%" cy="50%" r="50%"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>' +
      '<radialGradient id="' + u + 'h" cx="50%" cy="50%" r="50%"><stop offset=".78" stop-color="#E6C98F" stop-opacity="0"/><stop offset=".9" stop-color="#E6C98F" stop-opacity=".2"/><stop offset="1" stop-color="#E6C98F" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + u + 'e" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#C0868A"/><stop offset="1" stop-color="#7C4150"/></radialGradient>' +
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
      '<g mask="url(#' + u + 'k)"><circle cx="60" cy="60" r="50" fill="url(#' + u + 'e)" opacity=".92"/><rect width="120" height="120" fill="#2A0F1A" opacity=".05"/></g>' +
      '</g>' +
      '<circle cx="60" cy="60" r="50" fill="none" stroke="#F6DDA8" stroke-opacity=".7" stroke-width="1.4"/>';
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
  var MOON_TXT = ['طاقة اندفاع وبداية، تناسب المبادرة واتخاذ الخطوة الأولى', 'ميل للثبات والراحة، تناسب الاستقرار والاهتمام بالتفاصيل الحسية', 'فضول وكثرة حديث، تناسب التواصل والتعلم وتبادل الأفكار', 'حساسية أعلى ورغبة في الأمان، تناسب البيت والعائلة والاهتمام بالنفس', 'حضور وثقة وطاقة دافئة، تناسب الظهور والإبداع والتعبير الصادق', 'تركيز وترتيب، تناسب إنجاز المهام الصغيرة وتنظيم الأولويات', 'ميل للتوازن والعلاقات، تناسب الحوار الهادئ واتخاذ القرارات بروية', 'عمق ومشاعر مكثفة، تناسب مراجعة الداخل وإنهاء ما أرهقك', 'تفاؤل وتطلع للأمام، تناسب التخطيط والسفر وتوسيع الأفق', 'جدية والتزام، تناسب العمل المنظم وبناء الأهداف طويلة المدى', 'تفكير مختلف وروح مستقلة، تناسب الأفكار الجديدة والعمل الجماعي', 'خيال وحدس عاليان، تناسب الهدوء والتأمل والإصغاء لما بداخلك'];
  function phaseTxt(el) { if (el < 11.25 || el >= 348.75) return 'القمر في المحاق: وقت للسكون ونية بداية جديدة.'; if (el < 168.75) return 'القمر في طور النمو: وقت مناسب للبناء والتقدم بما بدأته.'; if (el < 191.25) return 'القمر بدر: ذروة الوضوح والمشاعر، وفرصة لحصاد ما زرعته.'; return 'القمر في طور التناقص: وقت للتهدئة والتخفف من الأعباء وإنهاء المعلّق.'; }
  var NUM_NOTE = { 1: 'ابدأ بخطوة واحدة واضحة ولا تؤجلها.', 2: 'اختر التعاون والإنصات، فالتوازن يسبق القرار.', 3: 'عبّر عن نفسك بصدق، فالكلمة اليوم تفتح الأبواب.', 4: 'رتّب أولوياتك وابنِ بثبات خطوة بعد خطوة.', 5: 'كن مرناً مع التغيير، وجرّب طريقاً جديداً بحذر.', 6: 'اعتنِ بمن حولك وبنفسك، فالانسجام يبدأ من البيت.', 7: 'خصّص وقتاً للهدوء والتأمل، فالإجابة تأتي من الداخل.', 8: 'وازن بين الطموح والمسؤولية، وركّز على الإنجاز الواقعي.', 9: 'أنهِ ما استنفد وقته وسامح، لتفسح مكاناً لبداية جديدة.', 11: 'أصغِ لحدسك اليوم، فهو أصدق من الضجيج حولك.', 22: 'فكّر بعيد المدى، فاليوم يناسب وضع أساس لشيء كبير.', 33: 'العطاء الصادق هو بوصلتك اليوم، فلا تنسَ نفسك فيه.' };
  function renderNumerology() {
    var n = themeNum(), th = txt('aq-obs-focus');
    setF('numDay', n ? 'الرقم ' + n : '—');
    setF('theme', th || '—'); setF('themeNote', NUM_NOTE[+n] || ''); setF('themeSrc', n ? 'مصدر الرسالة: علم الأعداد — رقم اليوم ' + n : '');
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
    setF('headline', 'القمر في ' + signName(moon.sign) + ' · ' + ph + ' بإضاءة ' + illum + '%');
    setF('moonDesc', MOON_TXT[moon.sign] + '. ' + phaseTxt(elong));
    setF('planetTheme', 'القمر في ' + signName(moon.sign) + ': ' + MOON_TXT[moon.sign] + '.');
    /* شريط الكواكب */
    var pl = ['mercury', 'venus', 'mars', 'jupiter', 'saturn'].map(function (k) { var b = body(c, k); if (!b) return ''; return '<span class="dbn-pl"><b>' + planetGlyph(k) + ' ' + planetName(k) + '</b> ' + signName(b.sign) + ' ' + deg(b.lon) + '°' + (b.retro ? ' <em>متراجع</em>' : '') + '</span>'; }).join('');
    setF('planets', pl, true);
  }
  /* السماء الآن: مواقع الكواكب الحية (نفس محرك Astro) */
  var LIVE_SETS = [['sun', 'moon', 'mercury'], ['venus', 'mars', 'jupiter'], ['saturn', 'uranus', 'neptune'], ['pluto', 'phase']];
  function renderLive() {
    if (!engine()) return;
    var c; try { c = chartAt(Date.now()); } catch (e) { return; }
    LIVE_SETS.forEach(function (set, i) {
      var h = set.map(function (k) {
        if (k === 'phase') {
          var sn = body(c, 'sun'), mn = body(c, 'moon'); if (!sn || !mn) return '';
          var el = mod(mn.lon - sn.lon), il = Math.round((1 - Math.cos(el * Math.PI / 180)) / 2 * 100);
          return '<div class="dbn-lv k-moon"><span class="dbn-lv-g">' + icon('moon') + '</span><b>مرحلة القمر</b><small>' + phaseOf(el) + ' · ' + il + '%</small><i>إضاءة</i></div>';
        }
        var b = body(c, k); if (!b) return '';
        return '<div class="dbn-lv k-' + k + (b.retro ? ' is-retro' : '') + '"><span class="dbn-lv-g">' + planetGlyph(k) + '</span><b>' + planetName(k) + (b.retro ? ' <em>R</em>' : '') + '</b><small>' + signName(b.sign) + ' ' + deg(b.lon) + '°</small><i>' + (b.retro ? 'متراجع' : 'مباشر') + '</i></div>';
      }).join('');
      setF('live' + (i + 1), h, true);
    });
  }
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
    if (reduce || document.hidden || hovering || userActive || userPaused || selecting) return;
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
