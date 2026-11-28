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
    var LG = window.AqReadingBlock && window.AqReadingBlock.natParas ? window.AqReadingBlock.natParas(k, bd.sign) : null, TLd = R && R.TL && R.TL[k] && R.TL[k][bd.sign];
    if (LG && LG.length) { o += '<p class="fc-lead2">' + (TLd || LG[0]) + '</p>' + (TLd ? LG : LG.slice(1)).map(function (x) { return '<p>' + x + '</p>'; }).join(''); } else {
    var lead = (ms && ms.t) ? ms.t : ('يمرّ ' + P.n + ' الآن في ' + S.n + '، فيمنح ' + P.theme + ' طابعًا ' + S.way + '.');
    o += '<p class="fc-lead2">' + lead + '</p>';
    o += '<p>الأجواء تساعد على ' + S.strength + '، وتذكّرك بلطف أن تنتبه من ' + S.shadow + '، فهو الوجه الذي يظهر حين تتعب.</p>'; }
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
    var defH = (/^ال(شمس|زهرة)$/.test(P.n) ? 'ما هي ' : 'ما هو ') + P.n + '؟';
    var h = '<div class="fc-now"><div class="fc-now-top"><span class="fc-now-g" aria-hidden="true"><span class="sg">' + D.gl(S.g) + '</span></span><div class="fc-now-t"><small>توقعات الأبراج · ' + dayTxt() + '</small><b>ماذا تقول السماء لبرجك اليوم؟</b><span>' + P.n + ' في ' + S.n + ' · ' + degTxt(deg, S.n) + st + '</span></div></div>' +
      '<details class="fc-now-about"><summary>' + defH + '</summary><p>' + P.n + ' يمثل ' + P.theme + '، وهو العدسة التي تُقرأ بها ' + P.lens + '. حين يكون متوازنًا يعطيك ' + P.give + '، ويحتاج منك انتباهًا إلى ' + P.watch + '.</p></details></div>' +
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
