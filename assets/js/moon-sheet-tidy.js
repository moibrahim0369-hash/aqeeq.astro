/* نافذة القمر: قسم «ماذا يعني هذا الطور» مفتوح دائمًا وفي أول التفاصيل. ترتيب وفتح فقط، بدون أي نص. */
(function () {
  'use strict';
  function fix() {
    var sh = document.querySelector('.mn-sheet'); if (!sh) return;
    var accs = sh.querySelectorAll('details.mn-acc'); if (!accs.length) return;
    var m = null; for (var i = 0; i < accs.length; i++) { var s = accs[i].querySelector('summary'); if (s && s.textContent.indexOf('ماذا يعني') > -1) m = accs[i]; }
    if (!m) return;
    if (!m.open) m.open = true;
    m.classList.add('mn-open-fixed');
    var first = accs[0];
    if (first !== m && first.parentNode === m.parentNode) first.parentNode.insertBefore(m, first);
  }
  document.addEventListener('click', function (e) { var s = e.target.closest && e.target.closest('.mn-open-fixed>summary'); if (s) e.preventDefault(); }, true);
  var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(fix, 30); }).observe(document.documentElement, { childList: true, subtree: true });
})();
