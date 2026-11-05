/* لوحة المواقع الحية بجانب الخريطة. قراءة فقط من نفس محرك السماء. */
(function () {
  'use strict';
  var rowsEl = document.getElementById('hv-rows'), dotsEl = document.getElementById('hv-dots'), live = document.getElementById('hv-live');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EVERY = 180000;

  /* ---------- لوحة المواقع الحية ---------- */
  if (!rowsEl || !live) return;
  var H = null, sets = [], si = 0, focusKey = '', timer = null, user = false;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function build() {
    H = window.__aqhHero; if (!H) return false;
    var d; try { d = H.sky(); } catch (e) { return false; }
    var items = {};
    H.planets.forEach(function (p) { var b = d[p.key]; if (b) items[p.key] = { p: p, b: b }; });
    var retro = Object.keys(items).filter(function (k) { return items[k].b.retro && k !== 'sun' && k !== 'moon'; });
    var first = ['moon', 'sun'].filter(function (k) { return items[k]; });
    first.push(retro[0] || 'mercury');
    var rest = Object.keys(items).filter(function (k) { return first.indexOf(k) < 0; });
    var order = rest.slice(); sets = [first.filter(function (k) { return items[k]; })];
    for (var i = 0; i < order.length; i += 3) { var c = order.slice(i, i + 3); while (c.length < 3) c.push(first[c.length % first.length]); sets.push(c); }
    sets.items = items; return true;
  }
  function rowHTML(k) {
    var it = sets.items[k]; if (!it) return '';
    var p = it.p, b = it.b;
    return '<li><button type="button" class="hv-row' + (b.retro ? ' is-retro' : '') + (focusKey === k ? ' is-on' : '') + '" data-k="' + k + '" aria-pressed="' + (focusKey === k) + '"><span class="hv-sym" aria-hidden="true">' + p.sym + '</span><span class="hv-txt"><b>' + esc(p.ar) + '</b><small>في ' + esc(H.signs[b.sign]) + ' · ' + b.deg + '°</small></span><span class="hv-state">' + (b.retro ? '<em>R</em> متراجع' : 'مباشر') + '</span></button></li>';
  }
  function paint(animate) {
    var done = function () {
      rowsEl.innerHTML = sets[si].map(rowHTML).join('');
      dotsEl.innerHTML = sets.map(function (_, k) { return '<i class="' + (k === si ? 'on' : '') + '"></i>'; }).join('');
      rowsEl.classList.remove('hv-out'); if (animate && !reduce) { rowsEl.classList.add('hv-in'); setTimeout(function () { rowsEl.classList.remove('hv-in'); }, 480); }
    };
    if (animate && !reduce) { rowsEl.classList.add('hv-out'); setTimeout(done, 300); } else done();
  }
  function go(n, byUser) { si = (n + sets.length) % sets.length; if (byUser) user = true; if (focusKey && sets[si].indexOf(focusKey) < 0) { focusKey = ''; H.focus(''); } paint(true); schedule(); }
  function schedule() { clearTimeout(timer); timer = setTimeout(function () { if (!document.hidden && !user && !focusKey && document.getElementById('home').getClientRects().length) go(si + 1, false); else schedule(); user = false; }, EVERY); }
  rowsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.hv-row'); if (!b) return; var k = b.getAttribute('data-k');
    focusKey = focusKey === k ? '' : k; H.focus(focusKey); paint(false);
  });
  live.addEventListener('click', function (e) { var a = e.target.closest('[data-hv]'); if (!a) return; go(si + (a.getAttribute('data-hv') === 'next' ? 1 : -1), true); });
  var sx = null;
  rowsEl.addEventListener('pointerdown', function (e) { sx = e.clientX; });
  rowsEl.addEventListener('pointerup', function (e) { if (sx === null) return; var dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50) go(si + (dx < 0 ? 1 : -1), true); });
  function init(tries) {
    if (build()) { paint(false); schedule(); setInterval(function () { if (document.hidden) return; var k = sets[si]; if (build()) { si = Math.min(si, sets.length - 1); paint(false); } }, 60000); }
    else if (tries < 20) setTimeout(function () { init(tries + 1); }, 300);
  }
  if (document.readyState === 'complete') init(0); else window.addEventListener('load', function () { init(0); });
})();
