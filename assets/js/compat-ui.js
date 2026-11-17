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
    var sec = $('#lifepath-compat'); if (sec) sec.classList.toggle('cp-res', !show);
    [f, m, ex].forEach(function (el) { if (!el) return; if (show) { el.style.removeProperty('display'); el.hidden = false; } else el.style.setProperty('display', 'none', 'important'); });
  }
  function clearResult() { closeSheet(); var o = $('#syn-result'); if (o) { o.hidden = true; o.innerHTML = ''; } }
  function buildHero(out) {
    if (!out || out.hidden || !out.innerHTML.trim()) { return; }
    if (out.querySelector('.cph')) return;
    var D = out.dataset, h = document.createElement('section'); h.className = 'cph';
    var master = out.querySelector('.syn-master-badge');
    h.innerHTML = '<span class="cph-k">توافق مسار الحياة · ' + esc(REL[D.rel] || '') + '</span>' +
      '<div class="cph-pair">' +
      '<div class="cph-p"><span class="cph-n">' + esc(D.p1) + '</span><b>' + esc(D.na) + '</b><small></small></div>' +
      '<div class="cph-sc"><span class="cph-ring"><strong>' + esc(D.score) + '<em>%</em></strong></span><small>' + esc(D.label) + '</small></div>' +
      '<div class="cph-p"><span class="cph-n">' + esc(D.p2) + '</span><b>' + esc(D.nb) + '</b><small></small></div></div>' +
      '<div class="cph-tools">' + pill('edit', 'edit', 'تعديل البيانات') + pill('save', 'save', 'حفظ') + pill('new', 'add', 'توافق جديد') + '</div>';
    /* الوصف (حياته/حياتها) يتبع الجنس المختار، وإلا صيغة محايدة */
    var caps = h.querySelectorAll('.cph-p small');
    caps[0].textContent = D.g1 === 'female' ? 'مسار حياتها' : 'مسار حياته';
    caps[1].textContent = D.g2 === 'female' ? 'مسار حياتها' : 'مسار حياته';
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
    new MutationObserver(function () { if (q) return; q = true; requestAnimationFrame(function () { q = false; buildHero(out); buildTiles(out); }); }).observe(out, { childList: true, attributes: true, attributeFilter: ['hidden'] });
  }

  /* ---------- 3) بطاقات الأقسام + النافذة السفلية ---------- */
  var IC = {
    magnet: '<path d="M6 3v8a6 6 0 0 0 12 0V3h-4v8a2 2 0 0 1-4 0V3z"/><path d="M6 7h4M14 7h4"/>',
    bridge: '<path d="M3 18h18"/><path d="M5 18v-4M19 18v-4"/><path d="M5 14c2-6.500 12-6.500 14 0"/><path d="M9 10.200V18M12 9.200V18M15 10.200V18"/>',
    clock: '<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3.200 2"/>',
    pair: '<circle cx="9" cy="12" r="5.500"/><circle cx="15" cy="12" r="5.500"/>',
    person: '<circle cx="12" cy="7.500" r="3.200"/><path d="M5.500 21v-1.500a6.500 6.500 0 0 1 13 0V21"/>',
    personB: '<circle cx="11" cy="8" r="3.200"/><path d="M4.500 21v-1.500a6.500 6.500 0 0 1 13 0V21"/><path d="M19 3.500v4M17 5.500h4"/>',
    spark: '<path d="M13 3 5 13.500h6L10 21l8-10.500h-6z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.500 8.500l-2 5-5 2 2-5z"/>',
    star: '<path d="M12 3l2.200 6 6 2.200-6 2.200L12 19.500l-2.200-6-6-2.200 6-2.200z"/>',
    hourglass: '<path d="M6 3h12M6 21h12"/><path d="M7 3v3.500c0 2 3 3.500 5 5.500-2 2-5 3.500-5 5.500V21M17 3v3.500c0 2-3 3.500-5 5.500 2 2 5 3.500 5 5.500V21"/>',
    chev: '<path d="M15 6l-6 6 6 6"/>'
  };
  var sheet = null, items = [], closeT, AQL = window.__aqLock = window.__aqLock || { s: {}, on: function (k) { this.s[k] = 1; document.documentElement.classList.add('aqm-sheet-open'); }, off: function (k) { delete this.s[k]; if (!Object.keys(this.s).length) document.documentElement.classList.remove('aqm-sheet-open'); } };
  function badgesHtml(list) { return (list || []).filter(function (b) { return b && b[1] !== '' && b[1] != null; }).map(function (b) { return '<span class="lp-hbadge"><small>' + esc(b[0]) + '</small><b>' + esc(b[1]) + '</b></span>'; }).join(''); }
  function ensureSheet() {
    if (sheet) return sheet;
    sheet = document.createElement('div'); sheet.className = 'aqm-sheet lps-sheet cps-sheet'; sheet.hidden = true;
    sheet.innerHTML = '<div class="aqm-sheet-scrim" data-cps-close></div>' +
      '<div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="cps-title"><span class="aqm-sheet-grip" aria-hidden="true"></span>' +
      '<button type="button" class="aqm-sheet-x" data-cps-close aria-label="إغلاق"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="aqm-sheet-head"><span class="aqm-sheet-ic"></span><div><div class="lp-hbadges" hidden></div><h3 id="cps-title"></h3><p class="aqm-sheet-sub"></p></div></div>' +
      '<div class="aqm-sheet-body lps-body cps-body"></div>' +
      '<div class="aqm-sheet-foot"><button type="button" class="aqm-foot-next" data-cps-next hidden><span class="aqm-foot-l"><small>القسم التالي</small><b></b></span>' + sv(IC.chev, 2) + '</button><button type="button" class="aqm-foot-close" data-cps-close>إغلاق</button></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-cps-close]')) closeSheet();
      else if (e.target.closest('[data-cps-next]')) goNext();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet && !sheet.hidden) closeSheet(); });
    return sheet;
  }
  var cur = -1;
  function openSheet(i) {
    var it = items[i]; if (!it) return; cur = i;
    var s = ensureSheet();
    $('.aqm-sheet-ic', s).innerHTML = sv(IC[it.ic] || IC.star, 1.6);
    $('#cps-title', s).textContent = it.title; $('.aqm-sheet-sub', s).textContent = it.hook || '';
    var bd = $('.lp-hbadges', s), bh = badgesHtml(it.badges); bd.innerHTML = bh; bd.hidden = !bh;
    var b = $('.cps-body', s); b.style.scrollBehavior = 'auto'; b.innerHTML = it.html; b.scrollTop = 0;
    var nx = items[i + 1], nb = $('[data-cps-next]', s); if (nx) { $('b', nb).textContent = nx.title; nb.hidden = false; } else nb.hidden = true;
    clearTimeout(closeT); s.classList.remove('is-closing'); s.hidden = false; AQL.on('cps');
    var top0 = function () { b.scrollTop = 0; var pn = $('.aqm-sheet-panel', s); if (pn) pn.scrollTop = 0; }; top0(); requestAnimationFrame(top0); setTimeout(top0, 80);
  }
  function goNext() { if (!items[cur + 1]) return; sheet.classList.add('is-swap'); setTimeout(function () { openSheet(cur + 1); sheet.classList.remove('is-swap'); }, 160); }
  function closeSheet() { if (!sheet || sheet.hidden) return; sheet.classList.add('is-closing'); var sh = sheet; clearTimeout(closeT); closeT = setTimeout(function () { sh.hidden = true; sh.classList.remove('is-closing'); AQL.off('cps'); }, 230); }

  function buildTiles(out) {
    if (!out || out.querySelector('.cpt-list')) return;
    var srcs = $$('.cpt-src', out); if (!srcs.length) return;
    items = srcs.map(function (el) {
      var badges = []; try { badges = JSON.parse(el.getAttribute('data-badges') || '[]'); } catch (e) {}
      return { grp: el.getAttribute('data-grp'), ic: el.getAttribute('data-ic'), title: el.getAttribute('data-title'), hook: el.getAttribute('data-hook'), badges: badges, html: el.innerHTML };
    });
    var wrap = document.createElement('div'); wrap.className = 'cpt-list'; var lastGrp = '';
    items.forEach(function (it, i) {
      if (it.grp !== lastGrp) { if (it.grp === '2') { var h = document.createElement('h3'); h.className = 'cpt-grp'; h.textContent = 'إزاي بتفهموا بعض من جوه؟'; wrap.appendChild(h); } lastGrp = it.grp; }
      var b = document.createElement('button'); b.type = 'button'; b.className = 'cpt-tile'; b.setAttribute('data-cpt', i);
      b.innerHTML = '<span class="cpt-ic">' + sv(IC[it.ic] || IC.star, 1.6) + '</span><span class="cpt-tx"><b>' + esc(it.title) + '</b><span>' + esc(it.hook) + '</span>' + (badgesHtml(it.badges) ? '<span class="lp-hbadges cpt-bd">' + badgesHtml(it.badges) + '</span>' : '') + '</span><span class="cpt-ch">' + sv(IC.chev, 2) + '</span>';
      wrap.appendChild(b);
    });
    wrap.addEventListener('click', function (e) { var t = e.target.closest('.cpt-tile'); if (t) openSheet(Number(t.getAttribute('data-cpt'))); });
    var hero = out.querySelector('.cph'); if (hero && hero.nextSibling) out.insertBefore(wrap, hero.nextSibling); else out.appendChild(wrap);
  }

  function init() { modeCards(); heroActions(); watchResult(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
