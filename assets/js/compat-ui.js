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

  /* ---------- 2) بطاقة النتيجة العنابية + إخفاء النموذج ---------- */
  var REL = { romantic: 'عاطفة وشراكة', family: 'أسرة وأخوة', business: 'عمل وشغل' };
  var HI = {
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.500 6.500l4 4"/>',
    save: '<path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z"/>',
    add: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'
  };
  function pill(a, ic, label) { return '<button type="button" data-cph="' + a + '" aria-label="' + label + '">' + sv(HI[ic], 1.7) + '<span>' + label + '</span></button>'; }
  function setForm(show) {
    var f = $('#synastry-form'), m = $('#cpm-modes'), ex = $('#lifepath-compat .cp-explain');
    [f, m, ex].forEach(function (el) { if (!el) return; if (show) { el.style.removeProperty('display'); el.hidden = false; } else el.style.setProperty('display', 'none', 'important'); });
  }
  function clearResult() { var o = $('#syn-result'); if (o) { o.hidden = true; o.innerHTML = ''; } }
  function buildHero(out) {
    if (!out || out.hidden || !out.innerHTML.trim()) { return; }
    if (out.querySelector('.cph')) return;
    var D = out.dataset, h = document.createElement('section'); h.className = 'cph';
    var master = out.querySelector('.syn-master-badge');
    h.innerHTML = '<span class="cph-k">توافق مسار الحياة · ' + esc(REL[D.rel] || '') + '</span>' +
      '<div class="cph-pair">' +
      '<div class="cph-p"><span class="cph-n">' + esc(D.p1) + '</span><b>' + esc(D.na) + '</b><small>مسار حياته</small></div>' +
      '<div class="cph-sc"><span class="cph-ring"><strong>' + esc(D.score) + '<em>%</em></strong></span><small>' + esc(D.label) + '</small></div>' +
      '<div class="cph-p"><span class="cph-n">' + esc(D.p2) + '</span><b>' + esc(D.nb) + '</b><small>مسار حياتها</small></div></div>' +
      '<div class="cph-tools">' + pill('edit', 'edit', 'تعديل البيانات') + pill('save', 'save', 'حفظ') + pill('new', 'add', 'توافق جديد') + '</div>';
    /* الوصف (حياته/حياتها) يتبع الجنس المختار، وإلا صيغة محايدة */
    var caps = h.querySelectorAll('.cph-p small');
    caps[0].textContent = D.g1 === 'female' ? 'مسار حياتها' : D.g1 === 'male' ? 'مسار حياته' : 'مسار الحياة';
    caps[1].textContent = D.g2 === 'female' ? 'مسار حياتها' : D.g2 === 'male' ? 'مسار حياته' : 'مسار الحياة';
    if (master) h.appendChild(master);
    out.insertBefore(h, out.firstChild);
    setForm(false);
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
    var sec = $('#lifepath-compat'); if (sec) sec.scrollTop = 0;
  }
  function heroActions() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-cph]'); if (!b) return;
      var a = b.getAttribute('data-cph'), out = $('#syn-result'), D = (out && out.dataset) || {};
      if (a === 'edit') { clearResult(); setForm(true); var f = $('#synastry-form'); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      else if (a === 'new') { ['syn-name-a', 'syn-name-b', 'syn-date-a', 'syn-date-b'].forEach(function (id) { var el = $('#' + id); if (el) { el.value = ''; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); } }); clearResult(); setForm(true); var n = $('#syn-name-a'); if (n) { n.scrollIntoView({ behavior: 'smooth', block: 'center' }); try { n.focus({ preventScroll: true }); } catch (x) {} } }
      else if (a === 'save') {
        var P = window.AqeeqPlatform;
        if (P && typeof P.saveReading === 'function') {
          P.saveReading({ type: 'lifepath-compat', typeLabel: 'توافق مسار الحياة', title: D.na + ' + ' + D.nb, subtitle: (REL[D.rel] || '') + ' · ' + D.score + '%', route: '#lifepath-compat', inputs: { name1: D.na, date1: D.d1, gender1: D.g1, name2: D.nb, date2: D.d2, gender2: D.g2, type: D.rel } });
          b.classList.add('is-saved'); var sp = b.querySelector('span'); if (sp) sp.textContent = 'تم الحفظ';
        }
      }
    });
  }
  function watchResult() {
    var out = $('#syn-result'); if (!out) return; var q = false;
    new MutationObserver(function () { if (q) return; q = true; requestAnimationFrame(function () { q = false; buildHero(out); }); }).observe(out, { childList: true, attributes: true, attributeFilter: ['hidden'] });
  }

  function init() { modeCards(); heroActions(); watchResult(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
