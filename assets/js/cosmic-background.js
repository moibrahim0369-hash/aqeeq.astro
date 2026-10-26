/* خلفية كونية: مجرات (قريبة وبعيدة) + كل الكواكب المعروفة + كوكبة البرج عند اختياره.
   لا شهب ولا خطوط حركة. تحترم prefers-reduced-motion (رسمة ثابتة بدون حركة). */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- أدوات ---------- */
  function rng(seed) { var s = seed >>> 0; return function () { s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function gauss(r) { return (r() + r() + r() + r() - 2) / 2; }
  function sprite(size, draw) { var c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size); return c; }

  /* ---------- مجرات: تتولد مرة واحدة كصور صغيرة ---------- */
  function spiralGalaxy(seed, hue, barred) {
    return sprite(300, function (g, S) {
      var r = rng(seed), cx = S / 2, cy = S / 2, R = S * .46;
      var halo = g.createRadialGradient(cx, cy, 0, cx, cy, R);
      halo.addColorStop(0, 'rgba(255,236,200,.55)'); halo.addColorStop(.18, 'rgba(255,214,160,.22)'); halo.addColorStop(.55, 'rgba(' + hue + ',.07)'); halo.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = halo; g.fillRect(0, 0, S, S);
      var arms = barred ? 2 : 2 + ((r() * 2) | 0), pts = barred ? 2600 : 3400;
      for (var i = 0; i < pts; i++) {
        var arm = i % arms, t = Math.pow(r(), .75), rad = t * R;
        var ang = arm * (Math.PI * 2 / arms) + Math.log(1 + t * 5.5) * 2.7 + gauss(r) * (.34 - t * .12);
        if (barred) { rad = Math.max(rad, R * .12); }
        var x = cx + Math.cos(ang) * rad + gauss(r) * 3, y = cy + Math.sin(ang) * rad + gauss(r) * 3;
        var warm = Math.max(0, 1 - t * 1.6), a = (.18 + r() * .5) * (1 - t * .55);
        g.fillStyle = 'rgba(' + Math.round(150 + warm * 105) + ',' + Math.round(170 + warm * 62) + ',' + Math.round(255 - warm * 80) + ',' + a.toFixed(3) + ')';
        var sz = r() < .04 ? 1.8 : .8 + r() * .5; g.fillRect(x, y, sz, sz);
      }
      if (barred) { g.save(); g.translate(cx, cy); g.rotate(.5); var bg = g.createLinearGradient(-R * .4, 0, R * .4, 0); bg.addColorStop(0, 'rgba(255,214,160,0)'); bg.addColorStop(.5, 'rgba(255,226,180,.5)'); bg.addColorStop(1, 'rgba(255,214,160,0)'); g.fillStyle = bg; g.fillRect(-R * .4, -R * .06, R * .8, R * .12); g.restore(); }
      var core = g.createRadialGradient(cx, cy, 0, cx, cy, R * .17);
      core.addColorStop(0, 'rgba(255,250,235,.95)'); core.addColorStop(1, 'rgba(255,214,160,0)'); g.fillStyle = core; g.fillRect(0, 0, S, S);
    });
  }
  function ellipticalGalaxy(seed) {
    return sprite(220, function (g, S) {
      var r = rng(seed), cx = S / 2, R = S * .44;
      var gr = g.createRadialGradient(cx, cx, 0, cx, cx, R);
      gr.addColorStop(0, 'rgba(255,238,205,.9)'); gr.addColorStop(.25, 'rgba(255,214,170,.38)'); gr.addColorStop(.6, 'rgba(230,170,130,.1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(0, 0, S, S);
      for (var i = 0; i < 500; i++) { var a = r() * 6.283, d = Math.abs(gauss(r)) * R * .8; g.fillStyle = 'rgba(255,230,200,' + (r() * .4).toFixed(2) + ')'; g.fillRect(cx + Math.cos(a) * d, cx + Math.sin(a) * d, .9, .9); }
    });
  }

  /* ---------- كواكب: كرات مظللة، زحل بحلقاته ---------- */
  var PLANETS = [
    { n: 'عطارد', c: ['#cfc7bd', '#8f877e', '#4b4540'], r: .55 },
    { n: 'الزهرة', c: ['#f6e2b0', '#d9b270', '#7c5a2f'], r: .8 },
    { n: 'الأرض', c: ['#7fb6ee', '#2d6bb4', '#0e2a52'], r: .85, earth: true },
    { n: 'المريخ', c: ['#e58a62', '#b2492e', '#4e1d12'], r: .66 },
    { n: 'المشتري', c: ['#ecd2aa', '#c49a6c', '#5d4128'], r: 1.7, bands: ['#a77a52', '#e8cfa6', '#b88a5e', '#f0dcb8', '#a47450'] },
    { n: 'زحل', c: ['#f1dfb0', '#cfae74', '#69502c'], r: 1.45, ring: true },
    { n: 'أورانوس', c: ['#bdeef0', '#7cc3c8', '#2a5d63'], r: 1.1 },
    { n: 'نبتون', c: ['#8aa4ff', '#4666e0', '#16226b'], r: 1.08 },
    { n: 'بلوتو', c: ['#e0cfbb', '#a88f78', '#4b3b2e'], r: .42 }
  ];
  function planetSprite(p) {
    var S = 220, c = document.createElement('canvas'); c.width = c.height = S; var g = c.getContext('2d'), cx = S / 2, R = p.ring ? S * .24 : S * .36;
    if (p.ring) { g.save(); g.translate(cx, cx); g.rotate(-.38); g.scale(1, .32); g.lineWidth = 7; g.strokeStyle = 'rgba(230,205,150,.45)'; g.beginPath(); g.arc(0, 0, R * 1.85, 0, 6.283); g.stroke(); g.lineWidth = 11; g.strokeStyle = 'rgba(214,186,130,.5)'; g.beginPath(); g.arc(0, 0, R * 1.55, 0, 6.283); g.stroke(); g.restore(); }
    g.save(); g.beginPath(); g.arc(cx, cx, R, 0, 6.283); g.clip();
    var body = g.createRadialGradient(cx - R * .38, cx - R * .4, R * .1, cx, cx, R * 1.05); body.addColorStop(0, p.c[0]); body.addColorStop(.55, p.c[1]); body.addColorStop(1, p.c[2]); g.fillStyle = body; g.fillRect(0, 0, S, S);
    if (p.bands) { p.bands.forEach(function (col, i) { g.fillStyle = col; g.globalAlpha = .4; g.fillRect(cx - R, cx - R + i * (R * 2 / p.bands.length) + R * .08, R * 2, R * .2); }); g.globalAlpha = 1; }
    if (p.earth) { g.fillStyle = 'rgba(80,170,90,.55)'; [[-.3, -.1, .3], [.25, .2, .26], [.0, -.45, .16]].forEach(function (k) { g.beginPath(); g.ellipse(cx + k[0] * R, cx + k[1] * R, k[2] * R, k[2] * R * .7, .5, 0, 6.283); g.fill(); }); g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(cx + R * .1, cx + R * .05, R * .55, R * .09, -.3, 0, 6.283); g.fill(); }
    var shade = g.createRadialGradient(cx - R * .45, cx - R * .45, R * .2, cx + R * .2, cx + R * .2, R * 1.25); shade.addColorStop(0, 'rgba(0,0,0,0)'); shade.addColorStop(1, 'rgba(2,3,12,.78)'); g.fillStyle = shade; g.fillRect(0, 0, S, S);
    g.restore();
    if (p.ring) { g.save(); g.translate(cx, cx); g.rotate(-.38); g.scale(1, .32); g.lineWidth = 9; g.strokeStyle = 'rgba(230,205,150,.42)'; g.beginPath(); g.arc(0, 0, R * 1.7, Math.PI, 6.283); g.stroke(); g.restore(); }
    return c;
  }

  /* ---------- الكانفس ---------- */
  var cv = document.createElement('canvas'); cv.id = 'cosmos-bg'; cv.setAttribute('aria-hidden', 'true');
  var anchor = document.getElementById('sky-bg'); (anchor ? anchor.parentNode : document.body).insertBefore(cv, anchor || document.body.firstChild);
  var ctx = cv.getContext('2d'), W = 0, H = 0, DPR = 1;
  function size() { DPR = Math.min(window.devicePixelRatio || 1, 1.5); W = innerWidth; H = innerHeight; cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
  size(); addEventListener('resize', function () { size(); if (reduce) paint(performance.now()); });

  var rg = rng(20261027);
  var gal = [
    { s: spiralGalaxy(11, '140,160,255', false), x: .82, y: .20, ph: .05, per: 150, tilt: .55, rot: .3, rs: .006, dx: -.0016 },
    { s: spiralGalaxy(23, '190,150,255', true), x: .18, y: .46, ph: .45, per: 190, tilt: .8, rot: -.6, rs: -.005, dx: .0013 },
    { s: ellipticalGalaxy(37), x: .60, y: .74, ph: .70, per: 130, tilt: .7, rot: .9, rs: .003, dx: -.0010 },
    { s: spiralGalaxy(41, '120,190,255', false), x: .38, y: .12, ph: .85, per: 210, tilt: .4, rot: 1.4, rs: .007, dx: .0011 },
    { s: spiralGalaxy(59, '255,170,140', false), x: .90, y: .62, ph: .25, per: 170, tilt: .65, rot: -1.1, rs: -.004, dx: -.0012 }
  ];
  var pl = PLANETS.map(function (p, i) {
    return { p: p, s: planetSprite(p), lane: .08 + (i * .105 % .86), x: rg(), v: (.00045 + rg() * .0006) * (i % 2 ? -1 : 1), ph: rg(), per: 70 + rg() * 90 };
  });
  var lastT = performance.now();
  function paint(now) {
    var dt = Math.min(now - lastT, 60); lastT = now;
    ctx.clearRect(0, 0, W, H);
    var base = Math.min(W, H) < 700 ? .62 : 1;
    gal.forEach(function (o) {
      if (!reduce) { o.x += o.dx * dt / 1000; o.rot += o.rs * dt / 1000; if (o.x < -.25) o.x = 1.25; if (o.x > 1.25) o.x = -.25; }
      var d = .5 + .5 * Math.sin((now / 1000 / o.per + o.ph) * 6.283);   /* 0 = بعيدة جداً، 1 = قريبة */
      var D = Math.min(W, H) * (W < 700 ? .95 : 1.15) * (.22 + d * .95), al = .14 + d * .5;
      ctx.save(); ctx.globalAlpha = al; ctx.translate(o.x * W, o.y * H); ctx.rotate(o.rot); ctx.scale(1, o.tilt);
      ctx.drawImage(o.s, -D / 2, -D / 2, D, D); ctx.restore();
    });
    ctx.textAlign = 'center'; ctx.font = '11px "IBM Plex Sans Arabic", system-ui, sans-serif';
    pl.forEach(function (o) {
      if (!reduce) { o.x += o.v * dt / 1000; if (o.x > 1.12) o.x = -.12; if (o.x < -.12) o.x = 1.12; }
      var d = .5 + .5 * Math.sin((now / 1000 / o.per + o.ph) * 6.283);
      var rad = (14 + d * 22) * o.p.r * base * (o.p.r > 1.3 ? .78 : 1), al = .3 + d * .42, x = o.x * W, y = o.lane * H;
      ctx.globalAlpha = al;
      var R0 = o.p.ring ? 220 * .24 : 220 * .36, scale = rad / R0, w = 220 * scale;
      ctx.drawImage(o.s, x - w / 2, y - w / 2, w, w);
      ctx.globalAlpha = al * .7; ctx.fillStyle = 'rgba(232,208,150,1)'; ctx.fillText(o.p.n, x, y + rad * (o.p.ring ? 2.1 : 1.25) + 12);
    });
    ctx.globalAlpha = 1;
  }
  function loop(now) { paint(now); if (!document.hidden) requestAnimationFrame(loop); }
  if (reduce) paint(performance.now());
  else { requestAnimationFrame(loop); document.addEventListener('visibilitychange', function () { if (!document.hidden) { lastT = performance.now(); requestAnimationFrame(loop); } }); }

  /* ---------- كوكبات الأبراج: نجوم [RA ساعات، Dec درجات، قدر ظاهري] ---------- */
  var CON = [
    { n: 'الحمل', e: 'Aries', s: [[2.119, 23.46, 2.0], [1.911, 20.81, 2.6], [1.892, 19.29, 3.9], [2.833, 27.26, 3.6]], l: [[3, 0], [0, 1], [1, 2]] },
    { n: 'الثور', e: 'Taurus', s: [[4.599, 16.51, .85], [5.438, 28.61, 1.65], [5.627, 21.14, 3.0], [4.330, 15.63, 3.65], [4.382, 17.54, 3.8], [4.477, 19.18, 3.5], [4.478, 15.87, 3.4], [4.011, 12.49, 3.5], [3.791, 24.11, 2.9]], l: [[2, 0], [0, 6], [6, 3], [3, 4], [4, 5], [5, 1], [3, 7]], halo: [8] },
    { n: 'الجوزاء', e: 'Gemini', s: [[7.577, 31.89, 1.6], [7.755, 28.03, 1.1], [6.732, 25.13, 3.0], [6.383, 22.51, 2.9], [6.248, 22.51, 3.3], [7.335, 21.98, 3.5], [7.069, 20.57, 3.7], [6.629, 16.40, 1.9]], l: [[0, 2], [2, 3], [3, 4], [1, 5], [5, 6], [6, 7], [5, 2]] },
    { n: 'السرطان', e: 'Cancer', s: [[8.975, 11.86, 4.3], [8.275, 9.19, 3.5], [8.744, 18.15, 3.9], [8.721, 21.47, 4.7], [8.778, 28.76, 4.0]], l: [[1, 2], [0, 2], [3, 2], [3, 4]] },
    { n: 'الأسد', e: 'Leo', s: [[10.139, 11.97, 1.4], [10.122, 16.76, 3.5], [10.333, 19.84, 2.1], [10.278, 23.42, 3.4], [9.879, 26.01, 3.9], [9.764, 23.77, 3.0], [11.235, 20.52, 2.6], [11.818, 14.57, 2.1], [11.237, 15.43, 3.3]], l: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7], [7, 8], [8, 6], [8, 0]] },
    { n: 'العذراء', e: 'Virgo', s: [[13.420, -11.16, 1.0], [12.694, -1.45, 2.7], [13.036, 10.96, 2.8], [11.845, 1.76, 3.6], [12.927, 3.40, 3.4], [13.578, -0.60, 3.4], [14.267, -6.00, 4.1], [14.717, -5.66, 3.9]], l: [[2, 4], [4, 1], [3, 1], [1, 5], [5, 0], [5, 6], [6, 7]] },
    { n: 'الميزان', e: 'Libra', s: [[14.848, -16.04, 2.7], [15.283, -9.38, 2.6], [15.592, -14.79, 3.9], [15.617, -28.13, 3.6], [15.068, -25.28, 3.3]], l: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] },
    { n: 'العقرب', e: 'Scorpius', s: [[16.090, -19.81, 2.6], [16.005, -22.62, 2.3], [15.981, -26.11, 2.9], [16.353, -25.59, 2.9], [16.490, -26.43, 1.1], [16.598, -28.22, 2.8], [16.836, -34.29, 2.3], [16.865, -38.05, 3.0], [16.909, -42.36, 3.6], [17.203, -43.24, 3.3], [17.622, -42.998, 1.9], [17.793, -40.13, 3.0], [17.708, -39.03, 2.4], [17.560, -37.10, 1.6], [17.512, -37.30, 2.7]], l: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14]] },
    { n: 'القوس', e: 'Sagittarius', s: [[18.097, -30.42, 3.0], [18.350, -29.83, 2.7], [18.403, -34.38, 1.8], [18.466, -25.42, 2.8], [18.761, -26.30, 3.2], [18.921, -26.30, 2.0], [19.116, -27.67, 3.3], [19.043, -29.88, 2.6]], l: [[0, 1], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 2], [2, 1], [7, 4]] },
    { n: 'الجدي', e: 'Capricornus', s: [[20.300, -12.54, 3.6], [20.350, -14.78, 3.1], [20.768, -25.27, 4.1], [20.859, -26.92, 4.1], [21.444, -22.41, 3.7], [21.784, -16.13, 2.9], [21.668, -16.66, 3.7], [21.370, -16.83, 4.3], [21.099, -17.23, 4.1]], l: [[0, 8], [8, 7], [7, 6], [6, 5], [5, 4], [4, 3], [3, 2], [2, 1], [1, 0]] },
    { n: 'الدلو', e: 'Aquarius', s: [[21.526, -5.57, 2.9], [22.096, -0.32, 3.0], [22.361, -1.39, 3.8], [22.480, -0.02, 3.6], [22.589, -0.12, 4.0], [22.42, 1.38, 4.7], [20.795, -9.50, 3.8], [22.877, -7.58, 3.7], [22.911, -15.82, 3.3]], l: [[6, 0], [0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [4, 7], [7, 8]] },
    { n: 'الحوت', e: 'Pisces', s: [[2.034, 2.76, 3.8], [1.756, 9.16, 4.3], [1.524, 15.35, 3.6], [1.688, 5.49, 4.4], [1.230, 6.14, 4.8], [1.049, 7.89, 4.3], [0.811, 7.58, 4.4], [23.988, 6.86, 4.0], [23.665, 5.63, 4.1], [23.466, 6.38, 4.3], [23.286, 3.28, 3.7], [23.449, 1.26, 4.9], [23.442, 1.78, 4.5], [23.066, 3.82, 4.5]], l: [[0, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 12], [12, 11], [11, 10], [10, 13], [0, 1], [1, 2]] }
  ];
  function project(c) {
    var ra = c.s.map(function (p) { return p[0]; }), min = Math.min.apply(null, ra), max = Math.max.apply(null, ra);
    if (max - min > 12) ra = ra.map(function (v) { return v < 12 ? v + 24 : v; });
    var mid = (Math.min.apply(null, ra) + Math.max.apply(null, ra)) / 2, dec = c.s.map(function (p) { return p[1]; }), dm = (Math.min.apply(null, dec) + Math.max.apply(null, dec)) / 2, k = Math.cos(dm * Math.PI / 180);
    var pts = c.s.map(function (p, i) { return { x: -(ra[i] - mid) * 15 * k, y: -(p[1] - dm), m: p[2] }; });
    var xs = pts.map(function (p) { return p.x; }), ys = pts.map(function (p) { return p.y; });
    var w = Math.max.apply(null, xs) - Math.min.apply(null, xs), h = Math.max.apply(null, ys) - Math.min.apply(null, ys), sc = 78 / Math.max(w, h, 1);
    var cx = (Math.max.apply(null, xs) + Math.min.apply(null, xs)) / 2, cy = (Math.max.apply(null, ys) + Math.min.apply(null, ys)) / 2;
    return pts.map(function (p) { return { x: 50 + (p.x - cx) * sc, y: 46 + (p.y - cy) * sc, r: Math.max(.6, 2.3 - .42 * p.m) }; });
  }
  var host = null, current = -1;
  function ensureHost() {
    if (host) return host; var sec = document.getElementById('signs'); if (!sec) return null;
    host = document.createElement('div'); host.className = 'const-bg'; host.setAttribute('aria-hidden', 'true'); sec.insertBefore(host, sec.firstChild); return host;
  }
  function showConstellation(i) {
    var h = ensureHost(), c = CON[i]; if (!h || !c || i === current) return; current = i;
    var pts = project(c), NS = 'http://www.w3.org/2000/svg';
    var lines = c.l.map(function (l, n) { var a = pts[l[0]], b = pts[l[1]]; return '<line class="cb-line" style="--d:' + (n * .12).toFixed(2) + 's" x1="' + a.x.toFixed(2) + '" y1="' + a.y.toFixed(2) + '" x2="' + b.x.toFixed(2) + '" y2="' + b.y.toFixed(2) + '"/>'; }).join('');
    var stars = pts.map(function (p, n) { var halo = (c.halo || []).indexOf(n) >= 0; return (halo ? '<circle class="cb-halo" cx="' + p.x.toFixed(2) + '" cy="' + p.y.toFixed(2) + '" r="3.4"/>' : '') + '<circle class="cb-star" style="--d:' + (n * .09).toFixed(2) + 's" cx="' + p.x.toFixed(2) + '" cy="' + p.y.toFixed(2) + '" r="' + p.r.toFixed(2) + '"/>'; }).join('');
    h.innerHTML = '<svg xmlns="' + NS + '" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" role="presentation">' + lines + stars + '<text x="50" y="95" class="cb-name">كوكبة ' + c.n + ' · ' + c.e + '</text></svg>'; caption();
  }
  function caption() {
    var panel = document.getElementById('panel'), c = CON[current]; if (!panel || !c) return;
    var old = panel.querySelector('.const-cap'), txt = '✦ كوكبة ' + c.n + ' · ' + c.e;
    if (old) { if (old.textContent !== txt) old.textContent = txt; return; }
    var anchorEl = panel.querySelector('.dates') || panel.querySelector('h3'); if (!anchorEl) return;
    var p = document.createElement('p'); p.className = 'const-cap'; p.textContent = txt; anchorEl.insertAdjacentElement('afterend', p);
  }
  window.AqeeqCosmos = { showConstellation: showConstellation, constellations: CON };

  /* ربط اختيار البرج: الزرار في الـpicker (aria-pressed) */
  function syncFromPicker() { var p = document.getElementById('picker'); if (!p) return; var b = [].slice.call(p.children).findIndex(function (x) { return x.getAttribute('aria-pressed') === 'true'; }); if (b >= 0) showConstellation(b); }
  var picker = document.getElementById('picker');
  if (picker) { new MutationObserver(syncFromPicker).observe(picker, { subtree: true, attributes: true, attributeFilter: ['aria-pressed'] }); new MutationObserver(function () { syncFromPicker(); }).observe(picker, { childList: true }); syncFromPicker(); }
  var panelEl = document.getElementById('panel');
  if (panelEl) new MutationObserver(function () { caption(); }).observe(panelEl, { childList: true });
})();
