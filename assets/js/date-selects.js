/* منتقي تاريخ واضح (يوم / شهر / سنة) يعمل فوق حقول date الأصلية دون تغيير منطقها:
   القيمة تُكتب في الحقل الأصلي بصيغة YYYY-MM-DD ويُطلق عليه input/change. */
(function () {
  'use strict';
  var IDS = ['m-date', 'lp-date', 'f-date', 'syn-date-a', 'syn-date-b', 'eam-b-date', 'mxm-d1', 'mxm-d2', 'mxm-d3'];
  var MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  function opt(v, t) { var o = document.createElement('option'); o.value = v; o.textContent = t; return o; }
  function mk(ph, cls, label) {
    var s = document.createElement('select'); s.className = cls; s.required = true; s.setAttribute('aria-label', label);
    s.appendChild(opt('', ph)); return s;
  }
  function enhance(inp) {
    if (!inp || inp.__aqds) return; inp.__aqds = true;
    var wrap = document.createElement('div'); wrap.className = 'aq-ds'; wrap.dir = 'rtl';
    var d = mk('اليوم', 'aq-ds-d', 'اليوم'), m = mk('الشهر', 'aq-ds-m', 'الشهر'), y = mk('السنة', 'aq-ds-y', 'السنة');
    for (var i = 1; i <= 31; i++) d.appendChild(opt(String(i), String(i)));
    MONTHS.forEach(function (n, i) { m.appendChild(opt(String(i + 1), n)); });
    var now = new Date().getFullYear();
    for (var yy = now; yy >= 1900; yy--) y.appendChild(opt(String(yy), String(yy)));
    wrap.appendChild(d); wrap.appendChild(m); wrap.appendChild(y);
    inp.parentNode.insertBefore(wrap, inp.nextSibling);
    inp.classList.add('aq-ds-src');
    var last = '';
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function fromSelects() {
      var dv = +d.value, mv = +m.value, yv = +y.value;
      if (mv && yv) { var max = new Date(yv, mv, 0).getDate(); if (dv > max) { dv = max; d.value = String(max); } }
      var v = (dv && mv && yv) ? (yv + '-' + pad(mv) + '-' + pad(dv)) : '';
      last = v;
      if (inp.value !== v) { inp.value = v; inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true })); }
    }
    function toSelects() {
      var v = inp.value; if (v === last) return; last = v;
      var p = /^(\d{4})-(\d{2})-(\d{2})/.exec(v || '');
      if (p) { y.value = String(+p[1]); m.value = String(+p[2]); d.value = String(+p[3]); } else { y.value = ''; m.value = ''; d.value = ''; }
    }
    [d, m, y].forEach(function (s) { s.addEventListener('change', fromSelects); });
    inp.addEventListener('change', toSelects);
    toSelects(); setInterval(toSelects, 400);
  }
  /* موسّع: يشمل أي حقل تاريخ/ساعة آخر في الموقع بنفس الأسلوب (يوم / شهر / سنة — ساعة / دقيقة / ص م) */
  function mkx(ph, cls, label, req) {
    var s = document.createElement('select'); s.className = cls; s.required = !!req; s.setAttribute('aria-label', label);
    s.appendChild(opt('', ph)); return s;
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function enhanceDate(inp) {
    if (!inp || inp.__aqds) return; inp.__aqds = true;
    var wrap = document.createElement('div'); wrap.className = 'aq-dsx aq-dsx-date'; wrap.dir = 'rtl';
    var d = mkx('اليوم', 'aq-dsx-d', 'اليوم', inp.required), m = mkx('الشهر', 'aq-dsx-m', 'الشهر', inp.required), y = mkx('السنة', 'aq-dsx-y', 'السنة', inp.required);
    for (var i = 1; i <= 31; i++) d.appendChild(opt(String(i), String(i)));
    MONTHS.forEach(function (n, i) { m.appendChild(opt(String(i + 1), n)); });
    var now = new Date().getFullYear();
    for (var yy = now; yy >= 1900; yy--) y.appendChild(opt(String(yy), String(yy)));
    wrap.appendChild(d); wrap.appendChild(m); wrap.appendChild(y);
    inp.parentNode.insertBefore(wrap, inp.nextSibling);
    inp.classList.add('aq-dsx-src');
    var last = null;
    function fromSel() {
      var dv = +d.value, mv = +m.value, yv = +y.value;
      if (mv && yv) { var max = new Date(yv, mv, 0).getDate(); if (dv > max) { dv = max; d.value = String(max); } }
      var v = (dv && mv && yv) ? (yv + '-' + pad2(mv) + '-' + pad2(dv)) : '';
      last = v;
      if (inp.value !== v) { inp.value = v; inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true })); }
    }
    function toSel() {
      var v = inp.value; if (v === last) return; last = v;
      var p = /^(\d{4})-(\d{2})-(\d{2})/.exec(v || '');
      if (p) { y.value = String(+p[1]); m.value = String(+p[2]); d.value = String(+p[3]); } else { y.value = ''; m.value = ''; d.value = ''; }
    }
    [d, m, y].forEach(function (x) { x.addEventListener('change', fromSel); });
    inp.addEventListener('change', toSel);
    toSel(); setInterval(toSel, 500);
  }
  function enhanceTime(inp) {
    if (!inp || inp.__aqds) return; inp.__aqds = true;
    var wrap = document.createElement('div'); wrap.className = 'aq-dsx aq-dsx-time' + (inp.closest && inp.closest('#chart,#matrix,#lifepath') ? ' aq-ds' : ''); wrap.dir = 'rtl';
    var h = mkx('ساعة', 'aq-dsx-h', 'الساعة', inp.required), mi = mkx('دقيقة', 'aq-dsx-mi', 'الدقيقة', false), ap = mkx('ص / م', 'aq-dsx-ap', 'صباحًا أو مساءً', inp.required);
    for (var i = 1; i <= 12; i++) h.appendChild(opt(String(i), String(i)));
    for (var j = 0; j < 60; j++) mi.appendChild(opt(String(j), pad2(j)));
    ap.appendChild(opt('am', 'صباحًا')); ap.appendChild(opt('pm', 'مساءً'));
    wrap.appendChild(h); wrap.appendChild(mi); wrap.appendChild(ap);
    inp.parentNode.insertBefore(wrap, inp.nextSibling);
    inp.classList.add('aq-dsx-src');
    var last = null;
    function fromSel() {
      var hv = +h.value, mv = +mi.value || 0, av = ap.value, v = '';
      if (hv && av) { var h24 = hv % 12 + (av === 'pm' ? 12 : 0); v = pad2(h24) + ':' + pad2(mv); }
      last = v;
      if (inp.value !== v) { inp.value = v; inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true })); }
    }
    function toSel() {
      var v = inp.value; if (v === last) return; last = v;
      var p = /^(\d{1,2}):(\d{2})/.exec(v || '');
      if (p) { var hh = +p[1]; ap.value = hh >= 12 ? 'pm' : 'am'; h.value = String(hh % 12 === 0 ? 12 : hh % 12); mi.value = String(+p[2]); } else { h.value = ''; mi.value = ''; ap.value = ''; }
    }
    [h, mi, ap].forEach(function (x) { x.addEventListener('change', fromSel); });
    inp.addEventListener('change', toSel);
    toSel(); setInterval(toSel, 500);
  }
  function runAll() {
    IDS.forEach(function (id) { enhance(document.getElementById(id)); });
    var ds = document.querySelectorAll('input[type="date"]');
    for (var i = 0; i < ds.length; i++) { if (!ds[i].__aqds && IDS.indexOf(ds[i].id) < 0 && ds[i].id !== 'sky-date') enhanceDate(ds[i]); }
    var ts = document.querySelectorAll('input[type="time"]');
    for (var k = 0; k < ts.length; k++) { if (!ts[k].__aqds && ts[k].id !== 'sky-time') enhanceTime(ts[k]); }
  }
  function run() {
    runAll();
    var t = null;
    if (window.MutationObserver) new MutationObserver(function () { clearTimeout(t); t = setTimeout(runAll, 250); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  setTimeout(run, 1200);
})();
