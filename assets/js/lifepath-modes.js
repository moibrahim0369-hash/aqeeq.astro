/* مسار الحياة: بطاقات الوضعين (مسارك الفردي / توافق المسارات) بشكل تبويبات المصفوفة. عرض فقط، بلا أي تغيير في الحساب. */
(function () {
  'use strict';
  var MODES = [
    ['lifepath', '#lifepath', 'مسارك الفردي', '<path d="M5 20C5 11 11 6 19 5c0 8-4 14-14 15zM5 20l9-9"/>'],
    ['lifepath-compat', '#lifepath-compat', 'توافق المسارات', '<path d="M4 19c4 0 3-5 8-5s4-5 8-5"/><circle cx="4" cy="19" r="1.400"/><circle cx="20" cy="9" r="1.400"/><path d="M4 5c4 0 3 5 8 5"/>']
  ];
  function build(id) {
    var sec = document.getElementById(id); if (!sec || sec.querySelector('.lpm-modes')) return;
    var bar = sec.querySelector('.aq-section-topbar');
    var head = sec.querySelector('.lpx-head');
    var row = document.createElement('nav'); row.className = 'lpm-modes'; row.setAttribute('aria-label', 'نوع الحساب');
    row.innerHTML = MODES.map(function (m) {
      var on = m[0] === id;
      return '<a class="lpm-mode' + (on ? ' is-on' : '') + '" href="' + m[1] + '"' + (on ? ' aria-current="page"' : '') + '><span class="lpm-mic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + m[3] + '</svg></span><span class="lpm-mlb">' + m[2] + '</span></a>';
    }).join('');
    if (head && head.parentNode) head.insertAdjacentElement('afterend', row);
    else if (bar) bar.insertAdjacentElement('afterend', row);
    else sec.insertBefore(row, sec.firstChild);
  }
  function init() { ['lifepath', 'lifepath-compat'].forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
