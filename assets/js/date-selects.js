/* منتقي تاريخ واضح (يوم / شهر / سنة) يعمل فوق حقول date الأصلية دون تغيير منطقها:
   القيمة تُكتب في الحقل الأصلي بصيغة YYYY-MM-DD ويُطلق عليه input/change. */
(function () {
  'use strict';
  var IDS = ['m-date', 'lp-date', 'f-date', 'syn-date-a', 'syn-date-b'];
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
  function run() { IDS.forEach(function (id) { enhance(document.getElementById(id)); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  setTimeout(run, 1200);
})();
