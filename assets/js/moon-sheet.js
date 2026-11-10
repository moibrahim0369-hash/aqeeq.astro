/* القمر — نافذة تفاعلية: قمر حقيقي يُسحب بين الأيام، هالة الاكتمال، الخسوف والكسوف، وبوصلة الأطوار الثمانية.
   كل الحسابات من مكتبة Astronomy Engine الموجودة (astronomy.min.js)، والرسم من AqeeqMoon. عرض فقط، لا حسابات جديدة. */
(function () {
  'use strict';
  var root = document.documentElement, sheet = null, off = 0, tab = 'moon', pick = null, base = Date.now();
  var AU = 149597870.7, SYN = 29.530588;
  var SIGNS = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var PH = [
    ['محاق', 'نيّة', 'طاقتك تميل إلى السكون والانسحاب. ما تبدأه الآن يحتاج إلى صدق أكثر مما يحتاج إلى ضجيج.', 'اكتب نية واحدة بسيطة لهذه الدورة.', 'أن تحكم على نفسك لأن الحماس بطيء.'],
    ['هلال متزايد', 'رعاية', 'بذرة النية تطلب انتباهاً لطيفاً. قد تشعر بتردد مألوف قبل أن يتحرك الأمر.', 'خطوة صغيرة كل يوم تخدم نيتك.', 'أن تقارن بدايتك بنهاية غيرك.'],
    ['التربيع الأول', 'فعل', 'يظهر أول اختبار لما بدأته. التوتر هنا محرّك للفعل، وليس عقاباً.', 'قرار مؤجل تحسمه اليوم.', 'أن تنسحب عند أول عقبة.'],
    ['أحدب متزايد', 'صقل', 'الصورة تقترب من الاكتمال، وتلاحظ ما ينقصها بوضوح.', 'مراجعة التفاصيل وتعديلها بهدوء.', 'أن يعطّلك البحث عن الكمال.'],
    ['بدر', 'إدراك', 'المشاعر في ذروتها، وما كان خفياً يصبح واضحاً. قد تشعر بحساسية أعلى ونوم أخف.', 'لاحظ ما اتضح لك دون أن تقرر فوراً.', 'القرارات الكبرى وقت الانفعال.'],
    ['أحدب متناقص', 'دمج', 'وقت لفهم ما حدث وتحويله إلى خبرة تحملها معك.', 'اكتب ما تعلمته وشاركه مع من يهمك.', 'التمسك بما انتهى دوره.'],
    ['التربيع الأخير', 'مراجعة', 'تتصادم عاداتك القديمة مع ما صرت تريده الآن.', 'قرر ما تتركه وما تبقيه.', 'العودة إلى جدال قديم لا جديد فيه.'],
    ['هلال متناقص', 'تسليم', 'الطاقة تهدأ وتحتاج إلى راحة وتصفية.', 'رتّب مساحتك، وارتح، وودّع ما انتهى.', 'فتح التزامات ثقيلة جديدة.']
  ];
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
  function moonSvg(c, size) {
    var inner = typeof window.AqeeqMoon === 'function' ? window.AqeeqMoon(c.el) : '<circle cx="60" cy="60" r="50" fill="#d9d2c3"/>';
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
      '<div class="mn-facts">' + fact('الإضاءة', Math.round(c.il * 100) + '%') + fact('عمر القمر', c.age.toFixed(1).replace('.', '٫') + ' يوم') + fact('البرج', c.sign + ' ' + c.deg + '°') + fact('المسافة عن الأرض', num(c.dist) + ' كم') + '</div>' +
      '<div class="mn-card"><small>ماذا يعني هذا الطور لك</small><p>' + p[2] + '</p><div class="mn-do"><span><b>تناسبك:</b> ' + p[3] + '</span><span><b>تجنّب:</b> ' + p[4] + '</span></div></div>' +
      '<div class="mn-facts">' + nextEv(c) + '</div>';
  }
  function compassView() {
    var c = calc(base + off * 864e5), cur = c.ph, S = 340, C = S / 2, R = 122, o = '';
    var ring = '<circle cx="' + C + '" cy="' + C + '" r="' + (R + 34) + '" fill="none" stroke="#A07A3A" stroke-opacity=".35"/><circle cx="' + C + '" cy="' + C + '" r="' + (R - 34) + '" fill="none" stroke="#A07A3A" stroke-opacity=".25"/>';
    var nodes = '';
    for (var i = 0; i < 8; i++) {
      var a = (i * 45 - 90) * Math.PI / 180, x = C + R * Math.cos(a), y = C + R * Math.sin(a), el = i * 45, fake = { el: el };
      var inner = window.AqeeqMoon ? window.AqeeqMoon(el) : '';
      var act = (pick == null ? cur : pick) === i;
      nodes += '<g class="mn-node' + (act ? ' is-on' : '') + (i === cur ? ' is-cur' : '') + '" data-mn-ph="' + i + '" role="button" tabindex="0" aria-label="' + PH[i][0] + '" transform="translate(' + (x - 25).toFixed(1) + ' ' + (y - 25).toFixed(1) + ') scale(.4167)">' + (act ? '<circle cx="60" cy="60" r="62" fill="none" stroke="#6A2038" stroke-width="3"/>' : '') + inner + '</g>' +
        '<text x="' + x.toFixed(1) + '" y="' + (y + 40).toFixed(1) + '" text-anchor="middle" class="mn-nl">' + PH[i][1] + '</text>';
    }
    var mid = '<g transform="translate(' + (C - 40) + ' ' + (C - 40) + ') scale(.667)">' + (window.AqeeqMoon ? window.AqeeqMoon(c.el) : '') + '</g>';
    var sel = pick == null ? cur : pick, p = PH[sel];
    return '<svg class="mn-wheel" viewBox="0 0 ' + S + ' ' + S + '" role="group" aria-label="بوصلة أطوار القمر">' + ring + mid + nodes + '</svg>' +
      '<p class="mn-hint">اضغط أي طور لتقرأ معناه</p>' +
      '<div class="mn-card"><small>' + (sel === cur ? 'الطور الحالي' : 'طور القمر') + ' · ' + p[1] + '</small><h4>' + p[0] + '</h4><p>' + p[2] + '</p><div class="mn-do"><span><b>تناسبك:</b> ' + p[3] + '</span><span><b>تجنّب:</b> ' + p[4] + '</span></div>' +
      (sel !== cur ? '<button type="button" class="mn-go" data-mn-go="' + sel + '">اعرض أقرب موعد لهذا الطور</button>' : '') + '</div>';
  }
  function render() {
    var s = ensure(), b = $('.aqm-sheet-body', s), st = b.scrollTop;
    var Z = A(); if (!Z) { b.innerHTML = '<p class="mn-hint">تعذر تحميل بيانات القمر حاليًا.</p>'; return; }
    b.innerHTML = '<div class="mn-tabs" role="tablist"><button type="button" role="tab" data-mn-tab="moon" class="' + (tab === 'moon' ? 'is-on' : '') + '">القمر</button><button type="button" role="tab" data-mn-tab="compass" class="' + (tab === 'compass' ? 'is-on' : '') + '">بوصلة الأطوار</button></div><div class="mn-pane">' + (tab === 'moon' ? moonView() : compassView()) + '</div>';
    b.scrollTop = st;
    var c = calc(base + off * 864e5); $('.aqm-sheet-sub', s).textContent = PH[c.ph][0] + ' · ' + Math.round(c.il * 100) + '%';
    bind();
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
      '<div class="aqm-sheet-foot"><button type="button" class="aqm-foot-close" data-mnc>إغلاق</button></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-mnc]')) return close();
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
