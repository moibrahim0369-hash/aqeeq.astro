/* الرئيسية: كتلة مدخل مكان بطاقة «رسالة برجك اليوم»: بطاقتان (السماء الآن، توقعات الأبراج) ورابط صغير لشخصية وصفات البرج. نصوص موجودة فقط. */
(function () {
  'use strict';
  var done = false;
  var ic = function (d) { return '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  var SKY = '<circle cx="12" cy="12" r="9" stroke-opacity=".55"/><ellipse cx="12" cy="12" rx="9" ry="3.6" stroke-opacity=".55" transform="rotate(-24 12 12)"/><circle cx="12" cy="12" r="2.4"/>';
  var FC = '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z" stroke-opacity=".7"/>';
  function run() {
    if (done) return;
    var old = document.getElementById('b3-zod'); if (!old || document.getElementById('aqhe')) return;
    done = true;
    var w = document.createElement('section'); w.id = 'aqhe'; w.className = 'aqhe';
    w.innerHTML = '<div class="aqhe-g"><a class="aqhe-c aqhe-c1" href="#sky"><span class="aqhe-i">' + ic(SKY) + '</span><b>السماء الآن</b><small>الكواكب والقمر وأحداث الشهر</small></a>' +
      '<a class="aqhe-c aqhe-c2" href="#signs"><span class="aqhe-i">' + ic(FC) + '</span><b>توقعات الأبراج</b><small>برجك اليوم</small></a></div>' +
      '<a class="aqhe-t" href="#sign-traits"><span>شخصية وصفات البرج</span><i aria-hidden="true">‹</i></a>';
    old.parentNode.insertBefore(w, old.nextSibling);
    document.documentElement.setAttribute('data-home-entry', '1');
  }
  new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('load', function () { setTimeout(run, 400); });
})();
