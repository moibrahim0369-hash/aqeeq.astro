/* توافق مسار الحياة: واجهة العرض (بطاقات اختيار نوع العلاقة، بطاقة النتيجة العنابية، نافذة القراءة).
   عرض فقط: لا يغيّر أي حساب ولا نصًا. الحساب في engine.js والنصوص في data.json وapp.js. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function sv(d, w) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.6) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }

  /* ---------- 1) بطاقات نوع العلاقة ---------- */
  var MODES = [
    ['romantic', 'عاطفة وشراكة', '<path d="M12 20s-7.500-4.600-7.500-10.200A4.200 4.200 0 0 1 12 7.300a4.200 4.200 0 0 1 7.500 2.500C19.500 15.400 12 20 12 20z"/>'],
    ['family', 'أسرة وأخوة', '<circle cx="8" cy="8" r="2.800"/><circle cx="16.500" cy="9" r="2.300"/><path d="M2.800 19c.4-3 2.500-4.800 5.200-4.800s4.800 1.800 5.200 4.800M14.500 14.500c2.700 0 4.800 1.500 5.300 4.500"/>'],
    ['business', 'عمل وشغل', '<rect x="3.500" y="8" width="17" height="11.500" rx="2.500"/><path d="M9 8V6.200c0-.7.500-1.200 1.200-1.200h3.600c.7 0 1.200.5 1.200 1.200V8M3.500 13h17"/>']
  ];
  function modeCards() {
    var form = $('#synastry-form'), sel = $('#syn-type');
    if (!form || !sel || $('#cpm-modes')) return;
    var row = document.createElement('div'); row.id = 'cpm-modes'; row.className = 'cpm-modes'; row.setAttribute('role', 'radiogroup'); row.setAttribute('aria-label', 'نوع العلاقة');
    row.innerHTML = MODES.map(function (m) {
      return '<button type="button" class="cpm-mode" role="radio" data-cpm="' + m[0] + '" aria-checked="false"><span class="cpm-ic">' + sv(m[2]) + '</span><span class="cpm-lb">' + m[1] + '</span></button>';
    }).join('');
    form.parentNode.insertBefore(row, form);
    function paint() { $$('.cpm-mode', row).forEach(function (b) { var on = b.getAttribute('data-cpm') === sel.value; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); }); }
    row.addEventListener('click', function (e) {
      var b = e.target.closest('.cpm-mode'); if (!b) return;
      sel.value = b.getAttribute('data-cpm'); sel.dispatchEvent(new Event('change', { bubbles: true })); paint();
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var n = $('#syn-name-a'); if (n) { try { n.focus({ preventScroll: true }); } catch (x) { n.focus(); } }
    });
    sel.addEventListener('change', paint);
    var rel = sel.closest('.syn-rel'); if (rel) { rel.classList.add('cpm-hidden'); rel.style.setProperty('display', 'none', 'important'); }
    paint();
  }

  function init() { modeCards(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
