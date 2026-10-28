/* خلفية كونية: مجرات (قريبة وبعيدة) + كل الكواكب المعروفة + كوكبة البرج عند اختياره.
   نيزك عابر كل كام ثانية (مش مطر مستمر). تحترم prefers-reduced-motion (رسمة ثابتة بدون حركة). */
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
      g.save(); g.globalCompositeOperation = 'source-atop'; g.lineCap = 'round';
      for (var am = 0; am < arms; am++) { g.beginPath(); for (var u = 0; u <= 1.001; u += .02) { var an = am * (Math.PI * 2 / arms) + Math.log(1 + u * 5.5) * 2.7 + .2, rr = u * R * .95; var px = cx + Math.cos(an) * rr, py = cy + Math.sin(an) * rr; if (u === 0) g.moveTo(px, py); else g.lineTo(px, py); } g.strokeStyle = 'rgba(6,5,16,.32)'; g.lineWidth = 5; g.stroke(); }
      g.restore();
      for (var q = 0; q < 14; q++) { var qa = r() * 6.283, qd = R * (.15 + r() * .8); g.fillStyle = 'rgba(255,255,255,' + (.4 + r() * .5).toFixed(2) + ')'; g.fillRect(cx + Math.cos(qa) * qd, cy + Math.sin(qa) * qd, 1.6, 1.6); }
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
    { k: 'mercury', n: 'عطارد', c: ['#cfc7bd', '#8f877e', '#4b4540'], r: .55, per: 62 },
    { k: 'venus', n: 'الزهرة', c: ['#f6e2b0', '#d9b270', '#7c5a2f'], r: .8, per: 88 },
    { k: 'earth', n: 'الأرض', c: ['#7fb6ee', '#2d6bb4', '#0e2a52'], r: .85, earth: true, per: 112 },
    { k: 'mars', n: 'المريخ', c: ['#e58a62', '#b2492e', '#4e1d12'], r: .66, per: 140 },
    { k: 'jupiter', n: 'المشتري', c: ['#ecd2aa', '#c49a6c', '#5d4128'], r: 1.7, bands: ['#a77a52', '#e8cfa6', '#b88a5e', '#f0dcb8', '#a47450'], per: 190 },
    { k: 'saturn', n: 'زحل', c: ['#f1dfb0', '#cfae74', '#69502c'], r: 1.45, ring: true, per: 250 },
    { k: 'uranus', n: 'أورانوس', c: ['#bdeef0', '#7cc3c8', '#2a5d63'], r: 1.1, per: 320 },
    { k: 'neptune', n: 'نبتون', c: ['#8aa4ff', '#4666e0', '#16226b'], r: 1.08, per: 400 },
    { k: 'pluto', n: 'بلوتو', c: ['#e0cfbb', '#a88f78', '#4b3b2e'], r: .42, per: 480 }
  ];
  var SUN = { k: 'sun', n: 'الشمس', sun: true, r: 1 }, MOON = { k: 'moon', n: 'القمر', c: ['#f2f0ea', '#b9b6ae', '#55534f'], r: .8, moon: true };
  function planetSprite(p) {
    var S = 220, c = document.createElement('canvas'); c.width = c.height = S; var g = c.getContext('2d'), cx = S / 2, R = p.ring ? S * .24 : S * .36;
    if (p.sun) {
      var h = g.createRadialGradient(cx, cx, 0, cx, cx, S / 2); h.addColorStop(0, 'rgba(255,248,214,1)'); h.addColorStop(.22, 'rgba(255,214,120,.95)'); h.addColorStop(.38, 'rgba(255,170,60,.45)'); h.addColorStop(1, 'rgba(255,140,40,0)');
      g.fillStyle = h; g.fillRect(0, 0, S, S); return c;
    }
    if (p.ring) { g.save(); g.translate(cx, cx); g.rotate(-.38); g.scale(1, .32); g.lineWidth = 7; g.strokeStyle = 'rgba(230,205,150,.45)'; g.beginPath(); g.arc(0, 0, R * 1.85, 0, 6.283); g.stroke(); g.lineWidth = 11; g.strokeStyle = 'rgba(214,186,130,.5)'; g.beginPath(); g.arc(0, 0, R * 1.55, 0, 6.283); g.stroke(); g.restore(); }
    g.save(); g.beginPath(); g.arc(cx, cx, R, 0, 6.283); g.clip();
    var body = g.createRadialGradient(cx - R * .38, cx - R * .4, R * .1, cx, cx, R * 1.05); body.addColorStop(0, p.c[0]); body.addColorStop(.55, p.c[1]); body.addColorStop(1, p.c[2]); g.fillStyle = body; g.fillRect(0, 0, S, S);
    if (p.bands) { p.bands.forEach(function (col, i) { g.fillStyle = col; g.globalAlpha = .4; g.fillRect(cx - R, cx - R + i * (R * 2 / p.bands.length) + R * .08, R * 2, R * .2); }); g.globalAlpha = 1; }
    if (p.earth) { g.fillStyle = 'rgba(80,170,90,.55)'; [[-.3, -.1, .3], [.25, .2, .26], [.0, -.45, .16]].forEach(function (k) { g.beginPath(); g.ellipse(cx + k[0] * R, cx + k[1] * R, k[2] * R, k[2] * R * .7, .5, 0, 6.283); g.fill(); }); g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(cx + R * .1, cx + R * .05, R * .55, R * .09, -.3, 0, 6.283); g.fill(); }
    if (p.moon) { g.fillStyle = 'rgba(70,68,64,.35)'; [[-.35, -.2, .2], [.3, .1, .26], [-.05, .45, .15], [.4, -.4, .12]].forEach(function (k) { g.beginPath(); g.arc(cx + k[0] * R, cx + k[1] * R, k[2] * R, 0, 6.283); g.fill(); }); }
    var shade = g.createRadialGradient(cx - R * .45, cx - R * .45, R * .2, cx + R * .2, cx + R * .2, R * 1.25); shade.addColorStop(0, 'rgba(0,0,0,0)'); shade.addColorStop(1, 'rgba(2,3,12,.78)'); g.fillStyle = shade; g.fillRect(0, 0, S, S);
    g.restore();
    if (p.ring) { g.save(); g.translate(cx, cx); g.rotate(-.38); g.scale(1, .32); g.lineWidth = 9; g.strokeStyle = 'rgba(230,205,150,.42)'; g.beginPath(); g.arc(0, 0, R * 1.7, Math.PI, 6.283); g.stroke(); g.restore(); }
    return c;
  }
  var R0 = function (p) { return p.ring ? 220 * .24 : 220 * .36; };

  /* ---------- الكانفس ---------- */
  var cv = document.createElement('canvas'); cv.id = 'cosmos-bg'; cv.setAttribute('aria-hidden', 'true');
  var anchor = document.getElementById('sky-bg'); (anchor ? anchor.parentNode : document.body).insertBefore(cv, anchor || document.body.firstChild);
  var ctx = cv.getContext('2d'), W = 0, H = 0, DPR = window.devicePixelRatio || 1;
  function size() { W = innerWidth; H = innerHeight; cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
  size(); addEventListener('resize', function () { size(); if (reduce) paint(performance.now()); });

  var rg = rng(20261027), TAU = Math.PI * 2;
  /* مجرات رئيسية: حركة مستقرة بدون تشويه */
  var gal = [
    { s: spiralGalaxy(11, '140,160,255', false), ax: .20, ay: .13, A: .04, B: .02, px: 83, py: 109, ph: .3, tilt: .6, rot: .3, rs: .010, k: 1, speed: .3 },
    { s: spiralGalaxy(23, '190,150,255', true), ax: .82, ay: .31, A: .035, B: .02, px: 97, py: 131, ph: 2.1, tilt: .78, rot: -.6, rs: -.008, k: .92, speed: .25 },
    { s: ellipticalGalaxy(37), ax: .30, ay: .56, A: .04, B: .015, px: 113, py: 89, ph: 4.0, tilt: .72, rot: .9, rs: .005, k: .85, speed: .2 },
    { s: spiralGalaxy(59, '255,170,140', false), ax: .80, ay: .76, A: .035, B: .018, px: 101, py: 143, ph: 1.2, tilt: .66, rot: -1.1, rs: -.009, k: .95, speed: .22 },
    { s: spiralGalaxy(41, '120,190,255', false), ax: .16, ay: .90, A: .03, B: .015, px: 127, py: 97, ph: 5.1, tilt: .45, rot: 1.4, rs: .011, k: .8, speed: .18 }
  ];
  /* مجرات بعيدة صغيرة جداً: عمق إضافي، بتنجرف ببطء */
  /* سُدم ملوّنة ناعمة: عمق ولون للسماء (بنفسجي، تيل، أحمر وردي، أزرق عميق) */
  function nebulaSprite(seed, cols) {
    return sprite(360, function (g, S) {
      var r = rng(seed);
      for (var i = 0; i < 9; i++) {
        var x = S * (.25 + r() * .5), y = S * (.25 + r() * .5), rad = S * (.16 + r() * .22), c = cols[i % cols.length];
        var gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, 'rgba(' + c + ',.55)'); gr.addColorStop(.5, 'rgba(' + c + ',.18)'); gr.addColorStop(1, 'rgba(' + c + ',0)');
        g.fillStyle = gr; g.fillRect(0, 0, S, S);
      }
    });
  }
  var NEBSEED = [5, 9, 13, 17];
  var nebs = [
    { s: nebulaSprite(5, ['120,70,220', '70,60,190']), ax: .30, ay: .26, A: .06, B: .04, px: 170, py: 210, ph: .4, k: 1.25, a: .13 },
    { s: nebulaSprite(9, ['30,170,190', '40,120,200']), ax: .78, ay: .52, A: .05, B: .05, px: 190, py: 150, ph: 2.2, k: 1.1, a: .11 },
    { s: nebulaSprite(13, ['210,70,130', '170,60,160']), ax: .22, ay: .78, A: .05, B: .04, px: 150, py: 230, ph: 3.9, k: 1.15, a: .10 },
    { s: nebulaSprite(17, ['60,90,230', '90,60,200']), ax: .70, ay: .90, A: .06, B: .03, px: 210, py: 170, ph: 5.3, k: 1.0, a: .11 }
  ];
  /* ألوان السُدم حسب القسم: كل قسم له سماء بلون مختلف */
  function hsl(h, sat, l) { h = ((h % 360) + 360) % 360 / 360; var a = sat * Math.min(l, 1 - l); function f(n) { var k = (n + h * 12) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); } return f(0) + ',' + f(8) + ',' + f(4); }
  var THEMES = { matrix: 275, lifepath: 175, chart: 215, 'astro-maps': 200, sky: 230, signs: 300, compat: 335, 'life-path-synastry': 345, services: 38, courses: 150, videos: 8, faq: 220, about: 262, manifest: 160, wishes: 30, chat: 195, ask: 245, account: 190, fortune: 48, 'dream-library': 250, 'tarot-lab': 312, 'symbol-library': 20, 'energy-compatibility': 135 };
  var tintEl = document.createElement('div'); tintEl.id = 'sky-tint'; tintEl.setAttribute('aria-hidden', 'true'); cv.insertAdjacentElement('afterend', tintEl);
  var themeKey = '';
  function applyTheme() {
    var id = (location.hash || '').slice(1), h = THEMES[id], key = h == null ? '' : id;
    if (key === themeKey) return; themeKey = key;
    if (h == null) { tintEl.style.background = ''; nebs.forEach(function (o, i) { o.s = o.s0; }); return; }
    var c1 = hsl(h, .6, .22), c2 = hsl(h + 45, .55, .18);
    tintEl.style.background = 'radial-gradient(900px 620px at 85% 4%,rgba(' + c1 + ',.6),transparent 62%),radial-gradient(800px 600px at 8% 96%,rgba(' + c2 + ',.5),transparent 60%)';
    var offs = [0, 40, -40, 80];
    nebs.forEach(function (o, i) { o.s = nebulaSprite(NEBSEED[i] + 3, [hsl(h + offs[i], .7, .55), hsl(h + offs[i] + 28, .65, .5)]); });
  }
  nebs.forEach(function (o) { o.s0 = o.s; });
  window.addEventListener('hashchange', applyTheme); applyTheme();
  var far = [], farSprites = [spiralGalaxy(71, '170,180,255', false), ellipticalGalaxy(73), spiralGalaxy(79, '255,200,170', true)];
  for (var fi = 0; fi < 8; fi++) far.push({ s: farSprites[fi % 3], x: rg(), y: rg(), vx: (rg() - .5) * .004, vy: (rg() - .5) * .002, sz: .03 + rg() * .035, a: .08 + rg() * .10, tilt: .35 + rg() * .6, rot: rg() * 6, rs: (rg() - .5) * .02 });
  /* الكواكب: مدارات بيضاوية حوالين الشاشة كلها، الكوكب في النص الأسفل أقرب وأكبر شوية */
  var pl = PLANETS.map(function (p, i) { return { p: p, s: planetSprite(p), rx: .30 + i * .037, ry: .27 + i * .034, tilt: -.5 + i * .17, ph: rg() * TAU, per: p.per }; });
  var lastT = performance.now();
  function paint(now) {
    ctx.clearRect(0, 0, W, H);
    var t = now / 1000, m = Math.min(W, H), mob = W < 700;
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    nebs.forEach(function (o) {
      var x = (o.ax + o.A * Math.cos(t / o.px * TAU + o.ph)) * W, y = (o.ay + o.B * Math.sin(t / o.py * TAU + o.ph)) * H, D = Math.max(W, H) * o.k * (mob ? .8 : .62);
      ctx.globalAlpha = o.a * 1.2; ctx.drawImage(o.s, x - D / 2, y - D / 2, D, D);
    });
    ctx.restore();
    far.forEach(function (o) {
      if (!reduce) { o.x += o.vx * (now - lastT) / 1000; o.y += o.vy * (now - lastT) / 1000; if (o.x < -.05) o.x = 1.05; if (o.x > 1.05) o.x = -.05; if (o.y < -.05) o.y = 1.05; if (o.y > 1.05) o.y = -.05; o.rot += o.rs * (now - lastT) / 1000; }
      var D = m * o.sz * (mob ? 1.3 : 1);
      ctx.save(); ctx.globalAlpha = o.a * 1.2; ctx.translate(o.x * W, o.y * H); ctx.rotate(o.rot); ctx.scale(1, o.tilt); ctx.drawImage(o.s, -D / 2, -D / 2, D, D); ctx.restore();
    });
    gal.forEach(function (o) {
      var x = (o.ax + o.A * Math.cos(t / o.px * TAU + o.ph)) * W, y = (o.ay + o.B * Math.sin(t / o.py * TAU + o.ph * 1.3)) * H;
      var d = .5 + .5 * Math.sin(t / (o.px * 1.7) * TAU + o.ph);           /* نبضة عمق خفيفة */
      var D = m * (mob ? .27 : .16) * o.k * (.85 + .25 * d), al = .11 + .13 * d;
      if (!reduce) o.rot += o.rs * (now - lastT) / 1000;
      ctx.save(); ctx.globalAlpha = al; ctx.translate(x, y); ctx.rotate(o.rot); ctx.scale(1, o.tilt); ctx.drawImage(o.s, -D / 2, -D / 2, D, D); ctx.restore();
    });
    var cx = W / 2, cy = H / 2, list = [];
    pl.forEach(function (o) {
      var th = o.ph + t / o.per * TAU, lx = o.rx * W * Math.cos(th), ly = o.ry * H * Math.sin(th), c = Math.cos(o.tilt), sn = Math.sin(o.tilt);
      var x = cx + lx * c - ly * sn, y = cy + lx * sn + ly * c, near = .5 + .5 * Math.sin(th);
      list.push({ o: o, x: x, y: y, near: near });
    });
    ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(217,178,124,.05)';
    pl.forEach(function (o) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(o.tilt); ctx.beginPath(); ctx.ellipse(0, 0, o.rx * W, o.ry * H, 0, 0, TAU); ctx.stroke(); ctx.restore(); });
    list.sort(function (a, b) { return a.near - b.near; }).forEach(function (q) {
      var rad = m * .013 * q.o.p.r * (.7 + .5 * q.near) * (mob ? 1.15 : 1), sc = rad / R0(q.o.p), w = 220 * sc;
      ctx.globalAlpha = .45 + .4 * q.near; ctx.drawImage(q.o.s, q.x - w / 2, q.y - w / 2, w, w);
    });
    drawMeteors(now);
    ctx.globalAlpha = 1; lastT = now;
  }
  /* نيزك كل 5–13 ثانية، كل واحد باتجاه وطول ولون وسرعة مختلفة */
  var meteors = [], nextMeteor = performance.now() + 3500 + Math.random() * 3000, MCOL = ['255,255,255', '255,236,200', '190,220,255', '200,255,236', '255,208,184'];
  function spawnMeteor() {
    var mob = W < 700, ang = (18 + Math.random() * 52) * Math.PI / 180, dir = Math.random() < .5 ? 1 : -1, sp = (.5 + Math.random() * .9) * Math.max(W, H);
    meteors.push({ x: dir > 0 ? Math.random() * W * .7 : W * (.3 + Math.random() * .7), y: Math.random() * H * .5, vx: Math.cos(ang) * dir * sp, vy: Math.sin(ang) * sp, len: (mob ? 70 : 110) + Math.random() * (mob ? 90 : 170), w: .7 + Math.random() * 1.3, col: MCOL[(Math.random() * MCOL.length) | 0], t: 0, max: .6 + Math.random() * .9, glow: Math.random() < .3 });
  }
  function drawMeteors(now) {
    if (reduce) return;
    var dt = Math.min(.1, (now - lastT) / 1000);
    if (now >= nextMeteor) { spawnMeteor(); nextMeteor = now + 5000 + Math.random() * 8000; }
    for (var i = meteors.length - 1; i >= 0; i--) {
      var m = meteors[i]; m.t += dt; m.x += m.vx * dt; m.y += m.vy * dt;
      var k = m.t / m.max; if (k >= 1 || m.x < -300 || m.x > W + 300 || m.y > H + 300) { meteors.splice(i, 1); continue; }
      var a = Math.sin(k * Math.PI), sp = Math.hypot(m.vx, m.vy), tx = m.x - m.vx / sp * m.len, ty = m.y - m.vy / sp * m.len;
      var g = ctx.createLinearGradient(m.x, m.y, tx, ty); g.addColorStop(0, 'rgba(' + m.col + ',' + (.85 * a).toFixed(3) + ')'); g.addColorStop(1, 'rgba(' + m.col + ',0)');
      ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = m.w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tx, ty); ctx.stroke();
      if (m.glow) { var r = 5 + m.w * 3, rg2 = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, r); rg2.addColorStop(0, 'rgba(' + m.col + ',' + (.6 * a).toFixed(3) + ')'); rg2.addColorStop(1, 'rgba(' + m.col + ',0)'); ctx.fillStyle = rg2; ctx.fillRect(m.x - r, m.y - r, r * 2, r * 2); }
    }
  }
  var lastDraw = 0;
  function loop(now) { if (!window.__aqScroll && now - lastDraw >= 33) { lastDraw = now; paint(now); } else if (window.__aqScroll) { lastT = now; } if (!document.hidden) requestAnimationFrame(loop); }
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
  var TINTS = ['229,138,98', '155,191,138', '143,184,232', '138,143,224'];   /* نار / تراب / هواء / ماء */
  function ensureHost() {
    if (host) return host; var sec = document.getElementById('signs'); if (!sec) return null;
    host = document.createElement('div'); host.className = 'const-bg'; host.setAttribute('aria-hidden', 'true'); sec.insertBefore(host, sec.firstChild); return host;
  }
  var RULERS = [['mars', 'المريخ'], ['venus', 'الزهرة'], ['mercury', 'عطارد'], ['moon', 'القمر'], ['sun', 'الشمس'], ['mercury', 'عطارد'], ['venus', 'الزهرة'], ['pluto', 'بلوتو'], ['jupiter', 'المشتري'], ['saturn', 'زحل'], ['uranus', 'أورانوس'], ['neptune', 'نبتون']];
  var STARNAMES = { 0: { 0: 'Hamal' }, 1: { 0: 'Aldebaran', 1: 'Elnath' }, 2: { 0: 'Castor', 1: 'Pollux' }, 3: {}, 4: { 0: 'Regulus', 2: 'Algieba', 7: 'Denebola' }, 5: { 0: 'Spica' }, 6: { 0: 'Zubenelgenubi', 1: 'Zubeneschamali' }, 7: { 4: 'Antares', 13: 'Shaula' }, 8: { 2: 'Kaus Australis', 5: 'Nunki' }, 9: { 5: 'Deneb Algedi' }, 10: { 0: 'Sadalsuud', 1: 'Sadalmelik' }, 11: {} };
  var rulerCache = {};
  function rulerImg(key) {
    if (rulerCache[key]) return rulerCache[key];
    var def = key === 'sun' ? SUN : key === 'moon' ? MOON : PLANETS.filter(function (x) { return x.k === key; })[0]; if (!def) return '';
    var sp = planetSprite(def), url = sp.toDataURL('image/png'); rulerCache[key] = url; return url;
  }
  function showConstellation(i) {
    var h = ensureHost(), c = CON[i]; if (!h || !c || i === current) return; current = i;
    var pts = project(c), NS = 'http://www.w3.org/2000/svg', names = STARNAMES[i] || {};
    var defs = '<defs><radialGradient id="cbGlow"><stop offset="0" stop-color="#fff6dc" stop-opacity=".95"/><stop offset=".25" stop-color="#ffe2a8" stop-opacity=".5"/><stop offset="1" stop-color="#ffd18a" stop-opacity="0"/></radialGradient><filter id="cbBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".6"/></filter></defs>';
    var lines = c.l.map(function (l, n) { var a = pts[l[0]], b = pts[l[1]], co = 'x1="' + a.x.toFixed(2) + '" y1="' + a.y.toFixed(2) + '" x2="' + b.x.toFixed(2) + '" y2="' + b.y.toFixed(2) + '"';
      return '<line class="cb-line" pathLength="100" style="--d:' + (n * .1).toFixed(2) + 's" ' + co + '/><line class="cb-run" pathLength="100" style="--d:' + (n * .55).toFixed(2) + 's" ' + co + '/>'; }).join('');
    var stars = pts.map(function (p, n) {
      var halo = (c.halo || []).indexOf(n) >= 0, x = p.x.toFixed(2), y = p.y.toFixed(2), bright = p.r > 1.25, out = '';
      if (halo) out += '<circle class="cb-halo" cx="' + x + '" cy="' + y + '" r="3.4"/>';
      out += '<circle class="cb-glow" style="--d:' + (n * .17).toFixed(2) + 's" cx="' + x + '" cy="' + y + '" r="' + (p.r * 3.4).toFixed(2) + '"/>';
      if (bright) out += '<path class="cb-spike" d="M' + (p.x - p.r * 3.6).toFixed(2) + ' ' + y + 'H' + (p.x + p.r * 3.6).toFixed(2) + 'M' + x + ' ' + (p.y - p.r * 3.6).toFixed(2) + 'V' + (p.y + p.r * 3.6).toFixed(2) + '"/>';
      out += '<circle class="cb-star" style="--d:' + (n * .09).toFixed(2) + 's" cx="' + x + '" cy="' + y + '" r="' + p.r.toFixed(2) + '"/>';
      if (names[n]) out += '<text class="cb-sname" x="' + (p.x + p.r * 2 + .8).toFixed(2) + '" y="' + (p.y + .8).toFixed(2) + '">' + names[n] + '</text>';
      return out; }).join('');
    var rl = RULERS[i], img = rulerImg(rl[0]);
    var tint = TINTS[i % 4], sr = rng(100 + i), dust = '';
    for (var di = 0; di < 70; di++) dust += '<circle cx="' + (sr() * 100).toFixed(1) + '" cy="' + (sr() * 100).toFixed(1) + '" r="' + (.12 + sr() * .35).toFixed(2) + '" fill="rgba(255,255,255,' + (.25 + sr() * .55).toFixed(2) + ')"/>';
    h.style.setProperty('--tint', tint);
    h.innerHTML = '<svg class="cs-dust" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + dust + '</svg><div class="cb-float"><svg xmlns="' + NS + '" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" role="presentation">' + defs + lines + stars + '<text x="50" y="96" class="cb-name">كوكبة ' + c.n + ' · ' + c.e + '</text></svg></div>' +
      '<div class="cb-orbit"><img class="cb-ruler" alt="" src="' + img + '" data-ruler="' + rl[0] + '"></div>';
    caption();
  }
  function caption() {
    var panel = document.getElementById('panel'), c = CON[current]; if (!panel || !c) return;
    var txt = '✦ كوكبة ' + c.n + ' · ' + c.e + ' — الكوكب الحاكم: ' + RULERS[current][1], old = panel.querySelector('.const-cap');
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
