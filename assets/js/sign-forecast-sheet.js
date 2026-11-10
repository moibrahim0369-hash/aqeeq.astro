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
    var qs = [D.PQH[k][hh - 1], q[(d + i) % 2]];
    if (mp) qs.push(mp.p[5][d % 2]);
    var exs = [ex[d % 3], ex[(d + 1) % 3]];
    if (mp) exs.push(mp.p[7][d % 3]);
    var phase = mp ? '<div class="swp-row"><b>طور القمر اليوم · ' + mp.p[0] + ' · إضاءة ' + nd(mp.il) + '%</b><p>' + mp.p[6] + '</p></div>' : '';
    return '<article class="sky-card"><header class="sky-card-h"><span class="sky-card-ic" aria-hidden="true"><span class="sg">' + D.gl(P.g) + '</span></span><div><h4>' + P.n + ' في بيتك ' + H.n + '</h4><small>' + sg.n + ' · مجال ' + H.area + '</small></div></header>' +
      '<div class="swp-hook"><b class="swp-lbl">أسئلة تخصك اليوم</b><p>' + qs.join('</p><p>') + '</p></div>' +
      '<div class="swp-anat"><div class="swp-row"><b>نفسيًا</b><p>' + pf[0] + ' وحين يمرّ على بيتك ' + H.n + ' يتجه هذا كله إلى ' + H.area + '.</p></div>' +
      '<div class="swp-row"><b>طاقيًا</b><p>' + pf[1] + (bd.retro ? ' ومع التراجع تتجه إلى الداخل، فتبدو أبطأ وأعمق وأكثر حساسية.' : '') + '</p></div>' + phase +
      '<div class="swp-row"><b>في الواقع</b><ul><li>' + exs.join('</li><li>') + '</li></ul></div></div>' +
      '<p class="swp-tease">هذا ما يظهر على السطح فقط. أما السبب، وما يمكنك فعله به، فيخص برجك وحده.</p></article>';
  }
  function pick(i) {
    curSign = i; try { localStorage.setItem('aq-sky-sign', i); } catch (e) { }
    [].forEach.call(sheet.querySelectorAll('.sky-sg'), function (b) { var on = +b.getAttribute('data-i') === i; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
    var box = sheet.querySelector('#fc-card'); box.innerHTML = card(i);
    if (window.AqUpGlyphs) window.AqUpGlyphs();
    setTimeout(function () { try { box.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { } }, 60);
  }
  function build(k) {
    var D = window.AqSky, bd = bodyOf(k), P = D.PLANETS[k], S = D.SIGNS[bd.sign], deg = Math.floor(bd.lon % 30);
    var saved = null; try { saved = localStorage.getItem('aq-sky-sign'); } catch (e) { }
    var st = bd.retro ? 'متراجع' : (k === 'sun' || k === 'moon' ? 'في حركته' : 'مباشر');
    var h = '<header class="fc-head"><span class="fc-medal" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="32" cy="32" r="28" stroke-dasharray="2 4.2"/><circle cx="32" cy="32" r="21"/><path d="M32 4v7M32 53v7M4 32h7M53 32h7"/></svg><span class="sg">' + D.gl(P.g) + '</span></span>' +
      '<div><span class="fc-ey">توقعات الأبراج</span><h3>ماذا تقول السماء لبرجك اليوم؟</h3></div></header>' +
      '<p class="fc-lead">تُحسب هذه التوقعات من عبور الكواكب الحقيقي وتوقيته الآن، فتتبدل مع حركة السماء، ولا تأتي من نصوص ثابتة.</p>' +
      '<div class="fc-now"><span class="fc-dot"></span><b>' + P.n + ' في ' + S.n + ' ' + nd(deg) + '°</b><i>' + st + '</i><small>' + dayTxt() + '</small></div>' +
      '<h4 class="swp-h">اختر برجك أو طالعك</h4><p class="swp-sub">اضغط على برجك لتقرأ أين يلمسك ' + P.n + ' اليوم، وما الذي قد تشعر به دون أن تعرف السبب.</p>' +
      '<div class="sky-pick"><div class="sky-signs" role="group" aria-label="اختر برجك أو طالعك">' + D.SIGNS.map(function (sg, i) { return '<button type="button" class="sky-sg" data-i="' + i + '" aria-pressed="false"><span class="sg" aria-hidden="true">' + D.gl(sg.g) + '</span><span>' + sg.n + '</span></button>'; }).join('') + '</div>' +
      '<div class="sky-signcard" id="fc-card" aria-live="polite"><p class="sky-pick-empty">اختر برجك لتظهر قراءته.</p></div></div>' +
      '<a class="swp-go" href="#signs"><span class="swp-go-ic" aria-hidden="true"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="19"/><circle cx="24" cy="24" r="12"/><path d="M24 5v7M24 36v7M5 24h7M36 24h7"/><circle class="swp-core" cx="24" cy="24" r="2.600"/></svg></span><span class="swp-go-t"><b>ما الذي لم نقله لك بعد؟</b><small>افتح توقعات برجك الكاملة، ففيها ما يخصك وحدك</small></span><span class="swp-go-ar" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></span></a>';
    return { html: h, saved: saved };
  }
  function open(k) {
    var D = window.AqSky; if (!D || !window.Astro || k === 'phase' || !D.PLANETS[k]) return false;
    try {
      curK = k; curSign = null; var s = ensure(), b = build(k);
      s.querySelector('.fc-body').innerHTML = b.html; s.querySelector('.fc-body').scrollTop = 0;
      s.classList.remove('is-closing'); s.hidden = false; root.classList.add('aqm-sheet-open');
      if (window.AqUpGlyphs) window.AqUpGlyphs();
      var sv = b.saved !== null && b.saved !== '' ? +b.saved : NaN; if (sv >= 0 && sv < 12) pick(sv);
      return true;
    } catch (e) { return false; }
  }
  window.AqForecast = { open: open, close: close };
})();
