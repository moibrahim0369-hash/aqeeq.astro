/* الرئيسية: الضغط على كوكب في بطاقة «السماء الآن» يفتح نفس ورقة الكوكب الموجودة في صفحة السماء، دون مغادرة الرئيسية. بدون أي نص جديد. */
(function () {
  'use strict';
  function go(e) {
    var r = e.target.closest && e.target.closest('#aqh-energy [data-planet]'); if (!r || r.getAttribute('data-target') === 'asp') return;
    var k = r.getAttribute('data-planet'), b = document.querySelector('#sky .swc-pc[data-k="' + k + '"]');
    if (!b) return;
    e.preventDefault(); e.stopImmediatePropagation(); b.click();
  }
  document.addEventListener('click', go, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') go(e); }, true);
})();
