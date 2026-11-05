/* يضع نسخة من الفوتر في نهاية صفحات المرصد والأبراج والخرائط المتقدمة، ليظهر بعد آخر عنصر بشكل طبيعي.
   طبقة عرض فقط: النسخة بلا ids، وزر المشاركة يمرّر الضغطة للزر الأصلي. */
(function () {
  'use strict';
  var IDS = ['sky', 'signs', 'astro-maps'];
  function build() {
    var orig = document.querySelector('body > footer.foot');
    if (!orig) return;
    IDS.forEach(function (id) {
      var sec = document.getElementById(id);
      if (!sec || sec.querySelector(':scope > footer.sec-foot')) return;
      var f = orig.cloneNode(true);
      f.classList.add('sec-foot');
      [f].concat([].slice.call(f.querySelectorAll('[id]'))).forEach(function (n) { n.removeAttribute('id'); });
      [].forEach.call(f.querySelectorAll('button'), function (b) {
        b.addEventListener('click', function (e) {
          e.preventDefault();
          var o = orig.querySelector('button[id]'); if (o) o.click();
        });
      });
      sec.appendChild(f);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(build, 300); });
  else setTimeout(build, 300);
})();
