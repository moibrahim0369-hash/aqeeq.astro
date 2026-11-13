/* فوتر موحد خفيف في نهاية الصفحات الداخلية: روابط قانونية + حقوق. يُبنى مرة واحدة (استنساخ ثابت، بلا نقل ديناميكي). */
(function () {
  'use strict';
  var IDS = ['matrix', 'lifepath', 'lifepath-compat', 'matrix-compat', 'chart', 'astro-maps', 'for-you', 'sky', 'signs', 'compat', 'individual', 'relationships', 'energy-compatibility', 'world', 'invest'];
  function build() {
    var orig = document.querySelector('body > footer.foot'); if (!orig) return;
    var soc = orig.querySelector('.aq-soc'), nav = orig.querySelector('nav.sp-foot'), dis = orig.querySelector('.foot-dis'), cp = orig.querySelector('.copy');
    if (!nav) return setTimeout(build, 400);
    IDS.forEach(function (id) {
      var sec = document.getElementById(id);
      if (!sec || sec.querySelector(':scope > footer.aqf')) return;
      var f = document.createElement('footer'); f.className = 'aqf';
      [soc, nav, dis, cp].forEach(function (n) { if (n) f.appendChild(n.cloneNode(true)); });
      [].forEach.call(f.querySelectorAll('[id]'), function (n) { n.removeAttribute('id'); });
      sec.appendChild(f);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(build, 500); });
  else setTimeout(build, 500);
  /* الفوتر يرتاح فوق الشريط السفلي: في الصفحات القصيرة يلزق بالأسفل بمسافة ثابتة */
  function settle() {
    [].forEach.call(document.querySelectorAll('section.sec > footer.aqf'), function (f) {
      var s = f.parentNode; if (!s.clientHeight) return;
      f.style.marginTop = '40px';
      var need = s.clientHeight - (f.offsetTop + f.offsetHeight + 84);
      if (need > 0) f.style.marginTop = (40 + need) + 'px';
    });
  }
  window.addEventListener('hashchange', function () { setTimeout(settle, 150); setTimeout(settle, 900); });
  window.addEventListener('resize', settle);
  setTimeout(settle, 1200); setTimeout(settle, 3000);
})();
