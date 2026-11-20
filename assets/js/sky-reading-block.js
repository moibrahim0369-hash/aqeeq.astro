/* كتلة قراءة العبور الموحدة: حلقة المدة المتبقية، السطر الافتتاحي، وزر «تعمّق أكثر» داخل النافذة نفسها */
(function () {
  var STEP = { moon: 0.25, sun: 1, mercury: 1, venus: 1, mars: 2, jupiter: 8, saturn: 20, uranus: 40, neptune: 60, pluto: 60 };
  var CAP = { moon: 6, sun: 40, mercury: 60, venus: 90, mars: 120, jupiter: 450, saturn: 1300, uranus: 3200, neptune: 6500, pluto: 9500 };
  var cache = {}, pass = {};
  function signAt(k, ms) {
    var A = window.Astro, jdUt = A.jdFromMs(ms), jde = jdUt + A.deltaT(A.yearOf(jdUt)) / 86400;
    return Math.floor(A.norm(A.lonOf(k, jde)) / 30);
  }
  function edge(k, from, dir, sg) {
    var DAY = 864e5, st = (STEP[k] || 1) * DAY, cap = (CAP[k] || 100) * DAY, a = from, b = from, n = 0;
    while (n * st < cap) { b = from + dir * (++n) * st; if (signAt(k, b) !== sg) break; a = b; }
    if (n * st >= cap) return null;
    for (var i = 0; i < 11; i++) { var m = (a + b) / 2; if (signAt(k, m) === sg) a = m; else b = m; }
    return { ms: (a + b) / 2, sign: signAt(k, b) };
  }
  function stay(k, ms) {
    var pc = pass[k]; if (pc && ms >= pc.start && ms < pc.end) return { start: pc.start, end: pc.end, next: pc.next, pct: (ms - pc.start) / (pc.end - pc.start) };
    var ck = k + '|' + Math.floor(ms / (k === 'moon' ? 36e5 : 864e5)); if (cache[ck] !== undefined) return cache[ck];
    var r = null;
    try {
      if (window.Astro) {
        var sg = signAt(k, ms), s = edge(k, ms, -1, sg), e = edge(k, ms, 1, sg);
        if (s && e && e.ms > s.ms) r = { start: s.ms, end: e.ms, next: e.sign, pct: Math.min(1, Math.max(0, (ms - s.ms) / (e.ms - s.ms))) };
      }
    } catch (x) { r = null; }
    if (r) pass[k] = r;
    return (cache[ck] = r);
  }
  function ar(n) { try { return n.toLocaleString('ar-EG'); } catch (e) { return String(n); } }
  function span(msLeft) {
    var h = msLeft / 36e5, d = h / 24;
    if (d < 2) return 'نحو ' + ar(Math.max(1, Math.round(h))) + ' ساعة';
    if (d < 60) return ar(Math.round(d)) + ' يومًا';
    var mo = d / 30.44; if (mo < 24) return ar(Math.round(mo)) + ' شهرًا';
    var y = Math.round(d / 365.25 * 10) / 10; return ar(y) + ' سنة';
  }
  function paras(t) {
    var s = String(t).replace(/([.؟!])\s+/g, '$1\u0001').split('\u0001'), out = [], cur = '';
    s.forEach(function (x) { cur = cur ? cur + ' ' + x : x; if (cur.split(/\s+/).length >= 55) { out.push(cur); cur = ''; } });
    if (cur) out.push(cur); return out;
  }
  function ring(k, ms) {
    var S = stay(k, ms), D = window.AqSky; if (!S || !D || !D.PLANETS[k]) return '';
    var C = 2 * Math.PI * 24, done = (C * S.pct).toFixed(1), gl = D.gl ? D.gl(D.PLANETS[k].g) : '';
    return '<div class="trm-ring"><span class="trm-dial" aria-hidden="true"><svg viewBox="0 0 60 60"><circle class="trm-rest" cx="30" cy="30" r="24"/><circle class="trm-done" cx="30" cy="30" r="24" stroke-dasharray="' + done + ' ' + C.toFixed(1) + '" transform="rotate(-90 30 30)"/></svg><span class="sg">' + gl + '</span></span>' +
      '<div class="trm-ring-t"><b>متبقٍّ ' + span(S.end - ms) + '</b><small>حتى انتقال ' + D.PLANETS[k].n + ' إلى برج ' + D.SIGNS[S.next].n + ' · مضى ' + ar(Math.round(S.pct * 100)) + '٪</small></div></div>';
  }
  function fill() {
    [].forEach.call(document.querySelectorAll('.trm-slot[data-k]'), function (el) {
      var k = el.getAttribute('data-k'), ms = +el.getAttribute('data-ms'); el.removeAttribute('data-k');
      try { el.outerHTML = ring(k, ms); if (window.AqUpGlyphs) window.AqUpGlyphs(); } catch (e) { el.remove(); }
    });
  }
  function block(k, h, full, ms) {
    var R = window.AqReadings, lead = R && R.TL && R.TL[k] && R.TL[k][h - 1], ps = paras(full);
    if (!lead || ps.length < 2) return '<div class="trm">' + ps.map(function (x) { return '<p>' + x + '</p>'; }).join('') + '</div>';
    var t0 = ms || Date.now();
    setTimeout(function () { fill(); }, 40);
    return '<div class="trm"><div class="trm-slot" data-k="' + k + '" data-ms="' + t0 + '"></div><p class="trm-lead">' + lead + '</p><p class="trm-tz">' + ps[0] + '</p>' +
      '<button type="button" class="trm-bn" data-trm aria-expanded="false"><span class="trm-bn-t">تعمّق في القراءة كاملة</span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>' +
      '<div class="trm-full" hidden>' + ps.slice(1).map(function (x) { return '<p>' + x + '</p>'; }).join('') + '</div></div>';
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-trm]'); if (!b) return;
    var box = b.closest('.trm, .swp-fold'), f = box && box.querySelector('.trm-full, .swp-full'); if (!f) return;
    var open = f.hidden; f.hidden = !open; b.setAttribute('aria-expanded', open); box.classList.toggle('is-open', open);
    var t = b.querySelector('.trm-bn-t'); if (t) t.textContent = open ? 'إخفاء التفاصيل' : 'تعمّق في القراءة كاملة';
    if (open) { try { f.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (x) { } }
  });
  window.AqReadingBlock = { block: block, stay: stay };
})();
