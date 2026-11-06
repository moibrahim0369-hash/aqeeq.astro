/* AQEQ ASTRO — سلوك التنقل الموحد (واجهة فقط، لا يمس التوجيه ولا المحركات) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var DISCOVER = ['#for-you', '#chart', '#matrix', '#lifepath', '#sky', '#astro-maps', '#signs'];
  var ALIAS = { '#life-path-synastry': '#lifepath', '#lifepath-compat': '#lifepath', '': '#home' };

  function lock() { root.classList.toggle('aqn-lock', !!($('#aqn-sheet.is-open') || ($('#aqh-menu') && !$('#aqh-menu').hidden))); }
  function fadeIn(scrim) { scrim.hidden = false; requestAnimationFrame(function () { requestAnimationFrame(function () { scrim.classList.add('is-open'); }); }); }
  function fadeOut(scrim) { scrim.classList.remove('is-open'); setTimeout(function () { if (!scrim.classList.contains('is-open')) scrim.hidden = true; }, 260); }
  function trap(box, e) {
    if (e.key !== 'Tab') return;
    var f = $$('a[href],button:not([disabled])', box).filter(function (n) { return n.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---- القائمة الجانبية (يفتحها زر الهامبرغر الموجود، ونراقب حالتها) ---- */
  var menu = $('#aqh-menu'), burger = $('#aqh-burger'), dScrim = $('#aqn-drawer-scrim');
  if (menu && burger && dScrim) {
    new MutationObserver(function () {
      if (menu.hidden) { fadeOut(dScrim); } else { fadeIn(dScrim); setTimeout(function () { var a = $('.aqn-dr-body a', menu); if (a) a.focus({ preventScrolling: true }); }, 60); }
      lock();
    }).observe(menu, { attributes: true, attributeFilter: ['hidden'] });
    var closeDrawer = function () { if (!menu.hidden) burger.click(); };
    dScrim.addEventListener('click', closeDrawer);
    $('[data-aqn-close]', menu).addEventListener('click', closeDrawer);
    menu.addEventListener('keydown', function (e) { trap(menu, e); });
    var sb = $('[data-aqn-search]', menu), hs = $('[data-aqh-search]');
    if (sb && hs) sb.addEventListener('click', function () { closeDrawer(); setTimeout(function () { hs.click(); }, 280); });
    var lb = $('[data-aqn-lang]', menu), lt = $('#aq-lang-toggle');
    if (lb && lt) lb.addEventListener('click', function () { lt.click(); });
  }

  /* ---- ورقة اكتشف ذاتك ---- */
  var btn = $('#aqn-discover-btn'), sheet = $('#aqn-sheet'), sScrim = $('#aqn-scrim');
  function setSheet(v) {
    if (!btn || !sheet) return;
    btn.setAttribute('aria-expanded', v ? 'true' : 'false');
    if (v) { sheet.hidden = false; sheet.removeAttribute('hidden'); void sheet.offsetWidth; sheet.classList.add('is-open'); fadeIn(sScrim); setTimeout(function () { var a = $('a', sheet); if (a) a.focus({ preventScroll: true }); }, 80); }
    else { sheet.classList.remove('is-open'); fadeOut(sScrim); setTimeout(function () { if (!sheet.classList.contains('is-open')) sheet.hidden = true; }, 320); }
    lock();
  }
  if (btn && sheet && sScrim) {
    btn.addEventListener('click', function () { setSheet(!sheet.classList.contains('is-open')); });
    sScrim.addEventListener('click', function () { setSheet(false); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setSheet(false); });
    sheet.addEventListener('keydown', function (e) { trap(sheet, e); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sheet && sheet.classList.contains('is-open')) { setSheet(false); btn.focus(); }
  });
  window.addEventListener('hashchange', function () { if (sheet && sheet.classList.contains('is-open')) setSheet(false); });
  window.matchMedia('(min-width:1100px)').addEventListener('change', function (m) { if (m.matches) { setSheet(false); if (menu && !menu.hidden) burger.click(); } });

  /* ---- حالة الرابط النشط (الشريط السفلي + القائمة + الهيدر) ---- */
  function norm() { var h = location.hash || '#home'; return ALIAS[h] || h; }
  function sync() {
    var h = norm(), inDiscover = DISCOVER.indexOf(h) > -1;
    $$('.bnav .bnav-item').forEach(function (el) {
      var on = el.id === 'aqn-discover-btn' ? inDiscover : el.getAttribute('href') === h;
      el.classList.toggle('on', on);
      if (on) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
    });
    $$('.aqn-dr-body a, .aqn-grid a, .aqh-drop-menu a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === h); });
    var db = $('.aqh-drop-btn'); if (db) db.classList.toggle('is-current', inDiscover || h === '#compat' || h === '#tarot-chamber');
    $$('.aqh-nav>a').forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === h); });
  }
  window.addEventListener('hashchange', function () { setTimeout(sync, 0); });
  sync(); setTimeout(sync, 400);
})();

/* قسم التاروت مخفي مؤقتاً: أي رابط قديم له يرجّع للرئيسية بدل صفحة فاضية. */
(function () {
  function guard() { if (location.hash === '#tarot-chamber') location.replace('#home'); }
  window.addEventListener('hashchange', guard); guard();
})();
