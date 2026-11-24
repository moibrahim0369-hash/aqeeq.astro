/* صفحة سؤال الخرائط الفيدية: يضع اسم الخريطة وسؤالها وشرحها القصير في الترويسة بدل العنوان العام. عرض فقط. */
(function () {
  'use strict';
  var sec = document.getElementById('astro-maps'); if (!sec) return;
  var orig = null;
  function hero() { return sec.querySelector('.y27-intro'); }
  function parts(h) { return { eb: h.querySelector('.eyebrow'), h: h.querySelector('h2'), p: h.querySelector('p.intro'), x: h.querySelector('.vh-ask-ex') }; }
  function txt(el, sel) { var n = el.querySelector(sel); return n ? n.textContent.trim() : ''; }
  function apply(tile) {
    var h = hero(); if (!h) return; var o = parts(h);
    if (!orig) orig = { eb: o.eb && o.eb.textContent, h: o.h && o.h.textContent, p: o.p && o.p.textContent };
    var nm = txt(tile, '.vh-t'), q = txt(tile, '.vh-q'), ex = txt(tile, '.vh-i');
    if (!q) { ex = ''; q = txt(tile, '.vh-s') || txt(tile, '.vh-v'); }
    if (!nm) return;
    if (o.eb) o.eb.textContent = 'عقيق أسترو · ' + nm;
    if (o.h) o.h.textContent = nm;
    if (o.p) o.p.textContent = q;
    var x = o.x;
    if (!x) { x = document.createElement('p'); x.className = 'vh-ask-ex'; h.appendChild(x); }
    x.textContent = ex; x.hidden = !ex;
    var b = btn(); if (b) { if (!btnOrig) btnOrig = b.textContent; b.textContent = 'اعرض ' + nm; }
  }
  var btnOrig = null;
  function btn() { var b = document.querySelector('#eam-form button[type=submit] span, #eam-form button.btn span'); return b; }
  function reset() {
    var bb = btn(); if (bb && btnOrig) bb.textContent = btnOrig;
    var h = hero(); if (!h || !orig) return; var o = parts(h);
    if (o.eb) o.eb.textContent = orig.eb; if (o.h) o.h.textContent = orig.h; if (o.p) o.p.textContent = orig.p; if (o.x) o.x.hidden = true;
  }
  sec.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.vh-pre .vh-tile'); if (!t) return;
    setTimeout(function () { if (sec.classList.contains('vh-ask')) apply(t); }, 0);
  }, true);
  var was = false;
  new MutationObserver(function () { var on = sec.classList.contains('vh-ask'); if (was && !on && !sec.classList.contains('eam-view-result')) reset(); was = on; }).observe(sec, { attributes: true, attributeFilter: ['class'] });
})();
