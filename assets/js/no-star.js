/* يخفي نجمة الأربع رؤوس (السباركل) أينما ظهرت، بدون تغيير أي نص. */
(function () {
  'use strict';
  var RX = /^\s*M\s*12\s*[13]\s*l\s*1\.?[68]/i;
  function sweep(root) {
    var ps = (root.querySelectorAll ? root : document).querySelectorAll('svg path[d]:not([data-ns])');
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i]; p.setAttribute('data-ns', '1');
      if (RX.test(p.getAttribute('d'))) { var s = p.closest('svg'); if (s) { s.classList.add('aq-nostar'); } }
    }
    var us = document.querySelectorAll('svg use:not([data-ns])');
  }
  var t; function later() { clearTimeout(t); t = setTimeout(function () { sweep(document); }, 60); }
  new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true });
  sweep(document);
})();
