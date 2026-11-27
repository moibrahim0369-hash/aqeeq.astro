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
    var link = document.querySelector('#aqh-skyb .aqh-sky-link') || document.querySelector('#home .aqh-sky-link');
    if (link) { link.setAttribute('data-sp-moved', '1'); host.appendChild(link); }
    if (!document.getElementById('b3-zod')) {
      var svg = function (d, w) { return '<svg viewBox="0 0 24 24" width="' + w + '" height="' + w + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
      var a = document.createElement('a'); a.id = 'b3-zod'; a.className = 'b3-zod'; a.href = '#signs';
      a.innerHTML = '<span class="b3-zod-ic">' + svg('<circle cx="12" cy="12" r="9" stroke-opacity=".5"/><circle cx="12" cy="3" r="1" fill="currentColor"/><circle cx="21" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="21" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><path d="M12 8l1.100 2.900L16 12l-2.900 1.100L12 16l-1.100-2.900L8 12l2.900-1.100z"/>', 30) + '</span><span class="b3-zod-t"><em>رسالة برجك اليوم</em><b>ما الذي تريد السماء أن تقوله لبرجك اليوم؟</b><small>اختر برجك واقرأ رسالتك وتوقعك اليومي</small></span><span class="b3-rot-go">' + svg('<path d="M19 12H5M11 6l-6 6 6 6"/>', 18) + '</span>';
      host.parentNode.insertBefore(a, host.nextSibling);
    }
    document.documentElement.setAttribute('data-old-sky', '1');
  }
  new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('load', function () { setTimeout(run, 300); });
})();
