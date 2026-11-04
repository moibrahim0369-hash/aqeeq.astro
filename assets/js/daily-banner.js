/* Daily Energy Banner — slider logic (home only). Reads real data from existing sources:
   - ruler planet / sky: home-v2.js (SkyService) -> #aqh-energy-main
   - sun / moon / numerology day number / day theme: aqeeq-platform.js -> #aq-obs-*  */
(function () {
  'use strict';
  var root = document.getElementById('aqh-energy'), stage = document.getElementById('dbn-stage');
  if (!root || !stage || root.dataset.dbnInit === '1') return;
  root.dataset.dbnInit = '1';

  var AUTO_MS = 30000, IDLE_MS = 20000;
  var slides = [].slice.call(stage.querySelectorAll('.dbn-slide'));
  var dots = [].slice.call(root.querySelectorAll('.dbn-dot'));
  var bar = root.querySelector('.dbn-progress');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = 0, timer = null, idleTimer = null, hovering = false, userActive = false;

  /* ---------- date slide (client date only) ---------- */
  (function fillDate() {
    var d = new Date();
    function f(o) { try { return d.toLocaleDateString('ar-EG-u-nu-latn', o); } catch (e) { return ''; } }
    var wd = document.getElementById('dbn-wd'), dn = document.getElementById('dbn-dn'), my = document.getElementById('dbn-my');
    if (wd) wd.textContent = f({ weekday: 'long' });
    if (dn) dn.textContent = String(d.getDate());
    if (my) my.textContent = f({ month: 'long', year: 'numeric' });
  })();

  /* ---------- data binding (copies of live values, never invented) ---------- */
  function txt(id) { var n = document.getElementById(id); return n ? (n.textContent || '').trim() : ''; }
  function sync() {
    var theme = txt('aq-obs-focus');
    var main = document.getElementById('aqh-energy-main');
    var mainHtml = main ? main.innerHTML : '';
    [].forEach.call(root.querySelectorAll('[data-bind]'), function (el) {
      var k = el.getAttribute('data-bind');
      if (k === 'theme') el.textContent = theme;
      else if (k === 'main') el.innerHTML = mainHtml || '—';
    });
    var pl = document.getElementById('aq-home-sky-planets'); if (pl) pl.hidden = true;
  }
  sync();
  if ('MutationObserver' in window) {
    var mo = new MutationObserver(sync);
    ['aq-obs-focus', 'aqh-energy-main'].forEach(function (id) { var n = document.getElementById(id); if (n) mo.observe(n, { childList: true, characterData: true, subtree: true }); });
  }
  window.addEventListener('load', function () { setTimeout(sync, 600); });

  /* ---------- slider ---------- */
  function show(i, userDriven) {
    cur = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { var on = k === cur; s.classList.toggle('is-on', on); s.setAttribute('aria-hidden', on ? 'false' : 'true'); if ('inert' in s) s.inert = !on; });
    dots.forEach(function (d, k) { d.classList.toggle('is-on', k === cur); if (k === cur) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
    stage.setAttribute('aria-live', userDriven ? 'polite' : 'off');
    if (userDriven) { /* manual: pause then resume after idle */ pause(); armIdle(); } else schedule();
  }
  function stopTimers() { if (timer) { clearTimeout(timer); timer = null; } if (bar) { bar.classList.remove('is-run'); } }
  function schedule() {
    stopTimers();
    if (reduce || document.hidden || hovering || userActive) return;
    if (bar) { void bar.offsetWidth; bar.classList.add('is-run'); }
    timer = setTimeout(function () { show(cur + 1, false); }, AUTO_MS);
  }
  function pause() { stopTimers(); }
  function armIdle() { if (idleTimer) clearTimeout(idleTimer); userActive = true; idleTimer = setTimeout(function () { userActive = false; schedule(); }, IDLE_MS); }
  function userMove(delta) { show(cur + delta, true); }

  dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k, true); }); });
  root.querySelector('[data-dbn="prev"]').addEventListener('click', function () { userMove(-1); });
  root.querySelector('[data-dbn="next"]').addEventListener('click', function () { userMove(1); });
  stage.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); userMove(1); }   /* RTL: يسار = التالي */
    else if (e.key === 'ArrowRight') { e.preventDefault(); userMove(-1); }
    else if (e.key === 'Home') { e.preventDefault(); show(0, true); }
    else if (e.key === 'End') { e.preventDefault(); show(slides.length - 1, true); }
  });

  /* hover / focus pause */
  root.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { hovering = true; pause(); } });
  root.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { hovering = false; if (!userActive) schedule(); } });
  root.addEventListener('focusin', function () { pause(); });
  root.addEventListener('focusout', function () { if (!userActive && !hovering) schedule(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); else if (!userActive && !hovering) schedule(); });

  /* ---------- swipe / drag (horizontal only; vertical scroll untouched via touch-action: pan-y) ---------- */
  var sx = null, sy = null, dragged = false, pid = null;
  stage.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest('a,button')) { sx = null; return; }
    sx = e.clientX; sy = e.clientY; dragged = false; pid = e.pointerId; pause();
  });
  stage.addEventListener('pointermove', function (e) {
    if (sx === null || e.pointerId !== pid) return;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { dragged = true; stage.classList.add('is-drag'); }
  });
  function end(e) {
    if (sx === null || (e && e.pointerId !== pid)) return;
    var dx = (e ? e.clientX : sx) - sx; var was = dragged;
    sx = null; stage.classList.remove('is-drag');
    if (was && Math.abs(dx) > 40) userMove(dx < 0 ? 1 : -1);   /* RTL: سحب لليسار = التالي */
    else if (!userActive && !hovering) schedule();
  }
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', function () { sx = null; stage.classList.remove('is-drag'); if (!userActive && !hovering) schedule(); });
  stage.addEventListener('click', function (e) { if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; } }, true);

  /* init */
  show(0, false);
  window.__dbn = { show: function (i) { show(i, true); }, current: function () { return cur; } };
})();
