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
      '<div class="aqm-sheet-body"></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) close(); });
    return sheet;
  }
  function open(item) {
    var s = ensureSheet();
    var q = function (sel) { return item.querySelector(sel); };
    var ic = q('.aqm-acc-icon'), t = q('.aqm-acc-title'), st = q('.aqm-acc-subtitle'), bd = q('.aqm-acc-badges'), body = q('.aqm-acc-body');
    s.querySelector('.aqm-sheet-ic').innerHTML = ic ? ic.innerHTML : '';
    s.querySelector('#aqm-sheet-title').textContent = t ? t.textContent : '';
    s.querySelector('.aqm-sheet-sub').textContent = st ? st.textContent : '';
    var bb = s.querySelector('.aqm-sheet-badges'); bb.innerHTML = bd ? bd.innerHTML : '';
    s.querySelector('.aqm-sheet-nums').style.display = bb.children.length ? '' : 'none';
    var sb = s.querySelector('.aqm-sheet-body'); sb.innerHTML = body ? body.innerHTML : ''; sb.scrollTop = 0;
    lastFocus = document.activeElement;
    s.hidden = false; document.documentElement.classList.add('aqm-sheet-open');
    var x = s.querySelector('.aqm-sheet-x'); if (x) x.focus();
  }
  function close() {
    if (!sheet) return; sheet.hidden = true; document.documentElement.classList.remove('aqm-sheet-open');
    if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) {}
  }

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
    wasShown = shown;
    if (!mq.matches) return;
    if (shown) setup(h);
  }
  new MutationObserver(function () { scan(); }).observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();
