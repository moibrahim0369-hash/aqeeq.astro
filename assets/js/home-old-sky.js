/* الرئيسية: إعادة بطاقة «السماء الآن» القديمة (شرائح الكواكب + اكتشف السماء كلها) مكان شريط الكواكب الحالي.
   نفس العنصر القديم الموجود في الصفحة، فقط يُنقل ويُعرض. بدون تغيير أي نص. */
(function () {
  'use strict';
  var done = false;
  function run() {
    if (done) return;
    var e = document.getElementById('aqh-energy'), strip = document.getElementById('aqhc');
    if (!e || !strip) return;
    done = true;
    var host = document.createElement('div');
    host.id = 'sp-old-sky'; host.className = 'aqh-wrap aqh-skyb';
    strip.parentNode.insertBefore(host, strip);
    host.appendChild(e);
    document.documentElement.setAttribute('data-old-sky', '1');
  }
  new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('load', function () { setTimeout(run, 300); });
})();
