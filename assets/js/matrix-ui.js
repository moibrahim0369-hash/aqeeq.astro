/* مصفوفة القدر: بطاقات الأوضاع الثلاثة (فردي / شركاء / أطفال). عرض فقط، بلا أي تغيير في الحساب. */
(function () {
  'use strict';
  var MODES = [
    ['matrix', '#matrix', 'فردي', '<path d="M12 3l9 9-9 9-9-9z"/><path d="M12 8l4 4-4 4-4-4z"/>'],
    ['matrix-compat', '#matrix-compat', 'شركاء', '<circle cx="9" cy="12" r="5.500"/><circle cx="15" cy="12" r="5.500"/>'],
    ['matrix-child', '#matrix-child', 'أطفال', '<circle cx="12" cy="7.500" r="3"/><path d="M6.500 20c.3-3 2.500-5 5.500-5s5.200 2 5.500 5"/><path d="M9.500 3.600c.8-1 4.200-1 5 0"/>']
  ];
  function build(id) {
    var sec = document.getElementById(id); if (!sec || sec.querySelector('.mxm-modes')) return;
    var bar = sec.querySelector('.aq-section-topbar'); if (!bar) return;
    var old = sec.querySelector('.mxm-links'); if (old) old.remove();
    var row = document.createElement('nav'); row.className = 'mxm-modes'; row.setAttribute('aria-label', 'نوع المصفوفة');
    row.innerHTML = MODES.map(function (m) {
      var on = m[0] === id;
      return '<a class="mxm-mode' + (on ? ' is-on' : '') + '" href="' + m[1] + '"' + (on ? ' aria-current="page"' : '') + '><span class="mxm-mic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + m[3] + '</svg></span><span class="mxm-mlb">' + m[2] + '</span></a>';
    }).join('');
    bar.insertAdjacentElement('afterend', row);
  }
  function init() { ['matrix', 'matrix-compat', 'matrix-child'].forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  /* matrix-modes.js يضيف صف الروابط القديم متأخرًا: نعيد الفحص مرة بعد التحميل */
  window.addEventListener('load', function () { setTimeout(function () { var o = document.querySelector('#matrix .mxm-links'); if (o) o.remove(); init(); }, 300); });
})();
