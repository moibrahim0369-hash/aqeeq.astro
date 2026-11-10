/* يقيس ارتفاع الهيدر الظاهر فعلاً ويضبط فراغ أعلى الصفحات الداخلية. عرض فقط. */
(function () {
  var r = document.documentElement;
  function set() {
    var h = document.querySelector('.aqh-header'); var v = 0;
    if (h) { var b = h.getBoundingClientRect(); var cs = getComputedStyle(h); if (cs.display !== 'none' && cs.visibility !== 'hidden') v = Math.max(0, Math.min(120, Math.round(b.bottom))); }
    r.style.setProperty('--aq-hdr', v + 'px');
  }
  ['resize', 'hashchange', 'scroll', 'load', 'orientationchange'].forEach(function (e) { window.addEventListener(e, set, { passive: true }); });
  document.addEventListener('DOMContentLoaded', set); set(); setInterval(set, 800);
})();
