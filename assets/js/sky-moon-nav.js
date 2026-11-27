/* صفحة السماء: زر صغير "القمر" تحت الدولاب يفتح صفحة القمر الموجودة. لا نصوص جديدة سوى اسم الزر. */
(function () {
  'use strict';
  function add() {
    var w = document.querySelector('#sky .swc-wheel'); if (!w || w.querySelector('.sk-moon-btn')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'sk-moon-btn';
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14.5A8 8 0 1 1 9.5 5 6.5 6.5 0 0 0 19 14.5z"/></svg><span>القمر</span>';
    b.addEventListener('click', function () { var o = document.querySelector('#swc-moon .mn-open, #swc-moon .swc-moon-fig'); if (o) o.click(); });
    w.appendChild(b);
  }
  function init() { add(); var s = document.getElementById('sky'); if (s) new MutationObserver(add).observe(s, { childList: true, subtree: true }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
