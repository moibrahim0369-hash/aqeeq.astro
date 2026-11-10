/* مصفوفة القدر — نتيجة الهاتف: تبويبات تحت الخريطة + نافذة منبثقة للتفسير (عرض فقط، لا تغيير في الحسابات) */
(function () {
  'use strict';
  var mq = window.matchMedia('(max-width: 820px)');
  var sheet = null, lastFocus = null;

  function ensureSheet() {
    if (sheet) return sheet;
    sheet = document.createElement('div');
    sheet.className = 'aqm-sheet'; sheet.hidden = true;
    sheet.innerHTML = '<div class="aqm-sheet-scrim" data-close></div>' +
      '<div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="aqm-sheet-title">' +
      '<span class="aqm-sheet-grip" aria-hidden="true"></span>' +
      '<button type="button" class="aqm-sheet-x" data-close aria-label="إغلاق"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="aqm-sheet-head"><span class="aqm-sheet-ic"></span><div><h3 id="aqm-sheet-title"></h3><p class="aqm-sheet-sub"></p></div></div>' +
      '<div class="aqm-sheet-nums"><span class="aqm-sheet-lbl">الأرقام المرتبطة بهذا القسم</span><div class="aqm-sheet-badges"></div></div>' +
      '<div class="aqm-sheet-body"></div>' +
      '<div class="aqm-sheet-foot"><button type="button" class="aqm-foot-next" data-next hidden><span class="aqm-foot-l"><small>القسم التالي</small><b></b></span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button><button type="button" class="aqm-foot-close" data-close>إغلاق</button></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-next]')) { var n = nextItem(); if (n) { var sb = sheet.querySelector('.aqm-sheet-body'); sheet.classList.add('is-swap'); setTimeout(function () { fill(n); sheet.classList.remove('is-swap'); }, 160); } return; }
      if (e.target.closest('[data-close]')) close();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) close(); });
    return sheet;
  }
  var cur = null;
  function nextItem() { if (!cur) return null; var all = [].slice.call(document.querySelectorAll('#mresult .aqm-acc-item')), i = all.indexOf(cur); return i > -1 && i < all.length - 1 ? all[i + 1] : null; }
  function fill(item) {
    var s = ensureSheet(); cur = item;
    var q = function (sel) { return item.querySelector(sel); };
    var ic = q('.aqm-acc-icon'), t = q('.aqm-acc-title'), st = q('.aqm-acc-subtitle'), bd = q('.aqm-acc-badges'), body = q('.aqm-acc-body');
    s.querySelector('.aqm-sheet-ic').innerHTML = ic ? ic.innerHTML : '';
    s.querySelector('#aqm-sheet-title').textContent = t ? t.textContent : '';
    s.querySelector('.aqm-sheet-sub').textContent = st ? st.textContent : '';
    var bb = s.querySelector('.aqm-sheet-badges'); bb.innerHTML = bd ? bd.innerHTML : '';
    s.querySelector('.aqm-sheet-nums').style.display = bb.children.length ? '' : 'none';
    var sb = s.querySelector('.aqm-sheet-body'); sb.innerHTML = body ? body.innerHTML : ''; sb.scrollTop = 0;
    var nx = nextItem(), nb = s.querySelector('[data-next]');
    if (nx) { var nt = nx.querySelector('.aqm-acc-title'); nb.querySelector('b').textContent = nt ? nt.textContent : ''; nb.hidden = false; } else nb.hidden = true;
  }
  function open(item) {
    var s = ensureSheet(); fill(item);
    lastFocus = document.activeElement;
    s.classList.remove('is-closing'); s.hidden = false; document.documentElement.classList.add('aqm-sheet-open');
    var x = s.querySelector('.aqm-sheet-x'); if (x) x.focus();
  }
  function close() {
    if (!sheet || sheet.hidden) return; sheet.classList.add('is-closing');
    var sh = sheet; setTimeout(function () { sh.hidden = true; sh.classList.remove('is-closing'); document.documentElement.classList.remove('aqm-sheet-open'); }, 230);
    if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) {}
  }

  /* قراءة الخريطة كاملة: فهرس جامع بالأقسام وأرقامها */
  var OV_ICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 9-9 9-9-9z"/><path d="M12 8l4 4-4 4-4-4z"/></svg>';
  function openOverview() {
    var s = ensureSheet(), items = [].slice.call(document.querySelectorAll('#mresult .aqm-acc-item'));
    cur = null;
    s.querySelector('.aqm-sheet-ic').innerHTML = OV_ICO;
    s.querySelector('#aqm-sheet-title').textContent = 'خريطتك كاملة';
    s.querySelector('.aqm-sheet-sub').textContent = 'اضغط على أي قسم لتقرأ تفسيره';
    s.querySelector('.aqm-sheet-nums').style.display = 'none';
    s.querySelector('[data-next]').hidden = true;
    var h = '<p class="aqm-ov-soon">الوصف الجامع لخريطتك قيد الإضافة.</p><ol class="aqm-ov-list">' + items.map(function (it, i) {
      var t = it.querySelector('.aqm-acc-title'), q = it.querySelector('.aqm-acc-subtitle'), b = it.querySelector('.aqm-acc-badges'), ic = it.querySelector('.aqm-acc-icon');
      return '<li><button type="button" class="aqm-ov-row" data-ov="' + i + '"><span class="aqm-ov-ic">' + (ic ? ic.innerHTML : '') + '</span><span class="aqm-ov-tx"><b>' + (t ? t.textContent : '') + '</b><small>' + (q ? q.textContent : '') + '</small><span class="aqm-ov-b">' + (b ? b.innerHTML : '') + '</span></span></button></li>';
    }).join('') + '</ol>';
    var sb = s.querySelector('.aqm-sheet-body'); sb.innerHTML = h; sb.scrollTop = 0;
    sb.querySelectorAll('[data-ov]').forEach(function (r) { r.addEventListener('click', function () { var it = items[Number(r.getAttribute('data-ov'))]; if (it) fill(it); }); });
    lastFocus = document.activeElement; s.classList.remove('is-closing'); s.hidden = false; document.documentElement.classList.add('aqm-sheet-open');
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-aqm-overview]')) { e.preventDefault(); openOverview(); }
  });

  /* اعتراض النقر على رأس الأكورديون على الهاتف */
  document.addEventListener('click', function (e) {
    if (!mq.matches) return;
    var h = e.target.closest && e.target.closest('#mresult .aqm-acc-header');
    if (!h) return;
    e.preventDefault(); e.stopPropagation();
    open(h.closest('.aqm-acc-item'));
  }, true);

  /* تبويبات: تفسيرات / شاكرات / خطوط */
  function setup(host) {
    if (!host) return;
    var tabs = host.querySelector('.aqm-tabs'); if (!tabs || tabs.__aqmSheet) return;
    tabs.__aqmSheet = true;
    var chak = host.querySelector('#aqm-chakras'), lines = host.querySelector('.aqm-lines'), read = host.querySelector('#aqm-readings');
    var panel = document.createElement('div'); panel.className = 'aqm-mpanels';
    var hint = document.createElement('p'); hint.className = 'aqm-hint';
    hint.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v4h1"/></svg><span>اضغط على أي قسم لعرض تفسيره</span>';
    tabs.parentNode.insertBefore(panel, tabs.nextSibling);
    if (!host.querySelector('.aqm-ov-btn')) {
      var ov = document.createElement('button'); ov.type = 'button'; ov.className = 'aqm-ov-btn'; ov.setAttribute('data-aqm-overview', '');
      ov.innerHTML = '<span class="aqm-ov-bi">' + OV_ICO + '</span><span class="aqm-ov-bt"><b>قراءة خريطتك كاملة</b><small>نظرة جامعة على كل خطوطك وأرقامك</small></span><span class="aqm-ov-bg" aria-hidden="true">›</span>';
      tabs.parentNode.insertBefore(ov, tabs);
    }
    var pr = document.createElement('div'); pr.className = 'aqm-mp aqm-mp-read'; pr.appendChild(hint); if (read) pr.appendChild(read);
    var pc = document.createElement('div'); pc.className = 'aqm-mp aqm-mp-chak'; if (chak) pc.appendChild(chak);
    var pl = document.createElement('div'); pl.className = 'aqm-mp aqm-mp-lines'; if (lines) pl.appendChild(lines);
    panel.appendChild(pr); panel.appendChild(pc); panel.appendChild(pl);
    var a = tabs.querySelectorAll('.aqm-tab'); var names = ['الخريطة', 'الشاكرات', 'التفسيرات'];
    /* ترتيب التبويبات: التفسيرات أولًا */
    var map = { 'التفسيرات': 'read', 'الشاكرات': 'chak', 'الخطوط': 'lines' };
    a.forEach(function (t) { var n = t.textContent.trim(); if (n === 'الخريطة') { t.textContent = 'الخطوط'; t.setAttribute('href', '#aqm-lines'); } });
    var order = ['التفسيرات', 'الشاكرات', 'الخطوط'];
    var list = Array.prototype.slice.call(tabs.querySelectorAll('.aqm-tab'));
    order.forEach(function (n) { var t = list.filter(function (x) { return x.textContent.trim() === n; })[0]; if (t) tabs.appendChild(t); });
    function set(k) {
      host.setAttribute('data-mtab', k);
      tabs.querySelectorAll('.aqm-tab').forEach(function (t) { var on = map[t.textContent.trim()] === k; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', String(on)); });
    }
    tabs.addEventListener('click', function (e) {
      var t = e.target.closest('.aqm-tab'); if (!t) return;
      if (!mq.matches) return;
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      set(map[t.textContent.trim()] || 'read');
    }, true);
    set('read');
  }
  var wasShown = false;
  function scan() {
    var h = document.getElementById('mresult'); var shown = !!(h && !h.hidden && h.querySelector('.aqm-shell'));
    if (shown && !wasShown && mq.matches) {
      var sec = document.getElementById('matrix');
      [60, 450, 900].forEach(function (d) { setTimeout(function () { if (sec) sec.scrollTop = 0; }, d); });
    }
    wasShown = shown; document.documentElement.classList.toggle('mxr-on', shown);
    if (!mq.matches) return;
    if (shown) setup(h);
  }
  new MutationObserver(function () { scan(); }).observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();
