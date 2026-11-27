/* Home: glass signs banner (6s, swipe), chips moved under it, sky-now banner. Existing texts only:
   line = first sentence of AqLive.SIGNDAY[sign]; sky banner = moon row of the existing live sky card. */
(function () {
  'use strict';
  var NAMES = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var i = 0, box, timer, built = false;
  function first(t) { return String(t || '').split(/(?<=[.؟!۔])\s/)[0]; }
  function $(s, r) { return (r || document).querySelector(s); }
  function hide(e) { if (e) { e.classList.add('hsb-hidden'); e.style.setProperty('display', 'none', 'important'); } }
  function build() {
    var home = document.getElementById('home'), old = document.getElementById('sp-old-sky');
    var L = window.AqLive;
    if (!home || !old || !L || !L.SIGNDAY || L.SIGNDAY.length < 12) return false;
    box = document.createElement('section'); box.id = 'hsb';
    box.innerHTML = '<div class="hsb-glass"><div class="hsb-track"><div class="hsb-slide"><div class="hsb-tag"><i class="hsb-dot"></i><span>توقع يومك</span><b class="hsb-sign"></b></div><p class="hsb-line"></p></div></div><div class="hsb-dots">' + NAMES.map(function () { return '<i></i>'; }).join('') + '</div><a class="hsb-go" href="#signs">اعرف توقعات برجك</a></div>';
    home.insertBefore(box, old);
    var cat = $('.aqhc-catalog', home);
    if (cat) { var t = $('.aqhc-strip-title', cat); hide(t); box.after(cat); }
    var sky = document.createElement('section'); sky.id = 'hsk';
    sky.innerHTML = '<div class="hsk-glass"><div class="hsb-tag"><i class="hsb-dot"></i><span>السماء الآن</span></div><div class="hsk-slide"><div class="hsk-row"><b></b><small></small><em class="hsk-mv"><u></u><i></i></em></div><p class="hsk-line"></p></div><div class="hsk-dots"></div><a class="hsb-go" href="#sky">اعرف تأثير السماء عليك</a></div>';
    (cat || box).after(sky);
    hide(old); hide(document.getElementById('b3-zod'));
    show(0, 0); start(); swipe(); sync(); setInterval(sync, 20000); var gs = document.getElementById('hsk'); if (gs) { var g2 = gs.querySelector('.hsk-glass'), x1 = null; g2.addEventListener('pointerdown', function (e) { x1 = e.clientX; }); g2.addEventListener('pointerup', function (e) { if (x1 === null) return; var dx = e.clientX - x1; x1 = null; if (Math.abs(dx) > 40) { skyShow(k + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); clearInterval(skyTimer); skyTimer = setInterval(function () { if (!document.hidden) skyShow(k + 1, 1); }, 6000); } }); };
    built = true; return true;
  }
  var items = [], k = 0, skyTimer;
  function sync() {
    var rows = document.querySelectorAll('#aqh-energy .dbn-lv[data-planet]'), s = document.getElementById('hsk'); if (!rows.length || !s) return;
    var seen = {}, out = [];
    [].forEach.call(rows, function (r) {
      var key = r.getAttribute('data-planet'); if (seen[key]) return; seen[key] = 1;
      var b = $('b', r), sm = $('small', r), it = $('i:not(.dbn-lv-g)', r);
      var c = r.cloneNode(true); [].forEach.call(c.querySelectorAll('b,small,i,span,svg'), function (x) { x.remove(); });
      out.push({ k: key, n: b ? b.textContent : '', p: sm ? sm.textContent : '', m: it ? it.textContent : '', l: c.textContent.trim() });
    });
    out.sort(function (a, b) { return (a.k === 'moon' ? 0 : 1) - (b.k === 'moon' ? 0 : 1); });
    var first = !items.length; items = out;
    var d = $('.hsk-dots', s); if (d.children.length !== out.length) d.innerHTML = out.map(function () { return '<i></i>'; }).join('');
    if (first) { skyShow(0, 0); clearInterval(skyTimer); skyTimer = setInterval(function () { if (!document.hidden) skyShow(k + 1, 1); }, 6000); }
  }
  function skyShow(n, dir) {
    if (!items.length) return; k = (n + items.length) % items.length; var s = document.getElementById('hsk'), sl = $('.hsk-slide', s);
    function fill() {
      var it = items[k]; $('.hsk-row b', s).textContent = it.n; $('.hsk-row small', s).textContent = it.p; $('.hsk-mv i', s).textContent = it.m; $('.hsk-line', s).textContent = it.l;
      var d = s.querySelectorAll('.hsk-dots i'); for (var j = 0; j < d.length; j++) d[j].classList.toggle('on', j === k);
    }
    if (!dir) { fill(); return; }
    sl.style.transition = 'transform .28s ease, opacity .28s ease'; sl.style.transform = 'translateX(-40px)'; sl.style.opacity = '0';
    setTimeout(function () { fill(); sl.style.transition = 'none'; sl.style.transform = 'translateX(40px)'; void sl.offsetWidth; sl.style.transition = 'transform .32s ease, opacity .32s ease'; sl.style.transform = 'none'; sl.style.opacity = '1'; }, 280);
  }
  function show(n, dir) {
    i = (n + 12) % 12; var sl = $('.hsb-slide', box);
    function fill() {
      $('.hsb-sign', box).textContent = NAMES[i];
      $('.hsb-line', box).textContent = first(window.AqLive.SIGNDAY[i]);
      var d = box.querySelectorAll('.hsb-dots i'); for (var k = 0; k < d.length; k++) d[k].classList.toggle('on', k === i);
    }
    if (!dir) { fill(); return; }
    sl.style.transition = 'transform .28s ease, opacity .28s ease'; sl.style.transform = 'translateX(' + (dir * -40) + 'px)'; sl.style.opacity = '0';
    setTimeout(function () {
      fill(); sl.style.transition = 'none'; sl.style.transform = 'translateX(' + (dir * 40) + 'px)';
      void sl.offsetWidth; sl.style.transition = 'transform .32s ease, opacity .32s ease'; sl.style.transform = 'none'; sl.style.opacity = '1';
    }, 280);
  }
  function start() { clearInterval(timer); timer = setInterval(function () { if (!document.hidden) show(i + 1, 1); }, 6000); }
  function swipe() {
    var g = $('.hsb-glass', box), x0 = null, moved = false;
    g.addEventListener('pointerdown', function (e) { x0 = e.clientX; moved = false; });
    g.addEventListener('pointerup', function (e) { if (x0 === null) return; var dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) { moved = true; show(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); start(); } });
    g.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
  }
  var tries = 0, w = setInterval(function () { if (build() || ++tries > 80) clearInterval(w); }, 400);
})();
