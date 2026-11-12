/* فوتر موحد خفيف في نهاية الصفحات الداخلية: روابط قانونية + حقوق. يُبنى مرة واحدة (استنساخ ثابت، بلا نقل ديناميكي). */
(function () {
  'use strict';
  var IDS = ['matrix', 'lifepath', 'lifepath-compat', 'chart', 'astro-maps', 'for-you', 'sky', 'signs', 'compat', 'individual', 'relationships', 'energy-compatibility', 'world', 'invest'];
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
})();
