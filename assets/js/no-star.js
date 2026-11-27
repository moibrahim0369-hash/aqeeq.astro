/* يخفي نجمة الأربع رؤوس (السباركل) أينما ظهرت، بدون تغيير أي نص. */
(function () {
  'use strict';
  var RX = /^\s*M\s*\d+\s+\d+\s*l\s*[\d.]+\s+[\d.]+\s*L\s*\d+\s+\d+\s*l\s*-?[\d.]+\s+[\d.]+\s*L/;
  function sweep(root) {
    var ps = (root.querySelectorAll ? root : document).querySelectorAll('svg path[d]:not([data-ns])');
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i]; p.setAttribute('data-ns', '1');
      if (RX.test(p.getAttribute('d'))) { var s = p.closest('svg'); if (s) {
          var par = s.parentElement;
          if (par && par.children.length === 1 && !par.textContent.trim()) {
            /* شارة أيقونة فقط: نبدّل النجمة بأيقونة ذهبية بسيطة (دائرة) بدل ترك الشارة فارغة */
            var vb = (s.getAttribute('viewBox') || '0 0 24 24').split(/[ ,]+/), w = parseFloat(vb[2]) || 24, k = w / 24;
            for (var q = s.querySelectorAll('path'), z = 1; z < q.length; z++) q[z].parentNode.removeChild(q[z]);
            p.setAttribute('d', 'M12 4.5a7.5 7.5 0 1 0 0 15a7.5 7.5 0 0 0 0-15zM12 9.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5z');
            p.setAttribute('transform', 'scale(' + k + ')');
            p.setAttribute('fill', 'none'); p.setAttribute('stroke', 'currentColor'); p.setAttribute('stroke-width', '1.8');
            s.setAttribute('data-nsr', '1');
          } else { s.classList.add('aq-nostar'); }
        } }
    }
    var us = document.querySelectorAll('svg use:not([data-ns])');
  }
  var t; function later() { clearTimeout(t); t = setTimeout(function () { sweep(document); }, 60); }
  new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true });
  sweep(document);
})();
