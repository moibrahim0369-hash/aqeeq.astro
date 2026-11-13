/* لوحة نتيجة الخريطة الفلكية: طبقة عرض فقط. تقرأ ناتج المحرك (AqeeqChartContext) ولا تغيّر أي حساب.
   كل الأرقام (النسب، قوة الجوانب، المواضع) تُشتق من الخريطة الحالية وتتغير مع كل تاريخ ميلاد. */
(function () {
  'use strict';
  var root = document.getElementById('result'); if (!root) return;
  var SG = [
    ['الحمل', '♈', 0, 0, ['جريء', 'مبادر', 'حماسي']], ['الثور', '♉', 1, 1, ['ثابت', 'حسّي', 'صبور']],
    ['الجوزاء', '♊', 2, 2, ['فضولي', 'متنقل', 'اجتماعي']], ['السرطان', '♋', 3, 0, ['حساس', 'حدسي', 'حمائي']],
    ['الأسد', '♌', 0, 1, ['واثق', 'كريم', 'قيادي']], ['العذراء', '♍', 1, 2, ['دقيق', 'تحليلي', 'خدوم']],
    ['الميزان', '♎', 2, 0, ['متوازن', 'لطيف', 'دبلوماسي']], ['العقرب', '♏', 3, 1, ['عميق', 'مكثف', 'غامض']],
    ['القوس', '♐', 0, 2, ['متفائل', 'حر', 'مغامر']], ['الجدي', '♑', 1, 0, ['جاد', 'منضبط', 'طموح']],
    ['الدلو', '♒', 2, 1, ['مستقل', 'مبتكر', 'إنساني']], ['الحوت', '♓', 3, 2, ['حالم', 'متعاطف', 'خيالي']]
  ];
  var PL = [['sun', 'الشمس', '☉', 3], ['moon', 'القمر', '☽', 3], ['mercury', 'عطارد', '☿', 2], ['venus', 'الزهرة', '♀', 2], ['mars', 'المريخ', '♂', 2],
    ['jupiter', 'المشتري', '♃', 1.5], ['saturn', 'زحل', '♄', 1.5], ['uranus', 'أورانوس', '♅', 1], ['neptune', 'نبتون', '♆', 1], ['pluto', 'بلوتو', '♇', 1]];
  var ELN = ['النار', 'التراب', 'الهواء', 'الماء'], ELC = ['#8a2f3f', '#b08d57', '#a9a6a8', '#3b4a96'];
  var ELP = ['الحماس والمبادرة', 'الواقعية والثبات', 'الفكر والتواصل', 'الشعور والحدس'];
  var MDN = ['الأساسي', 'الثابت', 'المتغير'], MDP = ['البدء والتحريك', 'الاستمرار والتثبيت', 'التكيف والمرونة'];
  var HA = ['الذات والمظهر', 'المال والقيم', 'التواصل والتعلم', 'البيت والجذور', 'الإبداع والحب', 'العمل اليومي والصحة', 'الشراكات والعلاقات', 'التحول والمشتركات', 'السفر والمعرفة', 'المهنة والمكانة', 'الصداقات والأحلام', 'الباطن والخلوة'];
  var ASP = [{ k: 'conj', n: 'اتصال', ang: 0, orb: 8, t: 'n', w: 1 }, { k: 'sext', n: 'سداسي', ang: 60, orb: 4, t: 'h', w: .75 }, { k: 'sq', n: 'تربيع', ang: 90, orb: 6, t: 't', w: .9 },
    { k: 'tri', n: 'تثليث', ang: 120, orb: 6, t: 'h', w: .9 }, { k: 'opp', n: 'مقابلة', ang: 180, orb: 8, t: 't', w: .95 }];
  var ASPCOL = { h: '#3f55a5', t: '#d04b4b', n: '#9b9296' };
  var NS = 'http://www.w3.org/2000/svg';
  var state = { tab: 'map' };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function n2(n) { return String(n).padStart(2, '0'); }
  function norm(x) { x = x % 360; return x < 0 ? x + 360 : x; }
  function d180(x) { x = norm(x); return x > 180 ? 360 - x : x; }
  function fmtLon(lon) { var s = Math.floor(norm(lon) / 30), r = norm(lon) - s * 30, d = Math.floor(r), m = Math.floor((r - d) * 60); return { s: s, d: d, m: m, txt: '<bdi dir="ltr">' + d + '°' + n2(m) + '′</bdi>' }; }
  function gl(g) { return g + '︎'; }

  function aspects(items) {
    var out = [];
    for (var i = 0; i < items.length; i++) for (var j = i + 1; j < items.length; j++) {
      var a = items[i], b = items[j], diff = d180(a.lon - b.lon);
      for (var t = 0; t < ASP.length; t++) {
        var A = ASP[t], lim = A.orb; if (a.k === 'sun' || a.k === 'moon' || b.k === 'sun' || b.k === 'moon') lim += 1;
        var o = Math.abs(diff - A.ang);
        if (o <= lim) {
          var pw = function (x) { return x.k === 'sun' || x.k === 'moon' ? 1 : (x.k === 'mercury' || x.k === 'venus' || x.k === 'mars') ? .9 : .75; };
          var sc = Math.max(1, Math.min(10, 10 * A.w * (1 - o / (lim + .001)) * ((pw(a) + pw(b)) / 2) + 1.2));
          out.push({ a: a, b: b, A: A, orb: o, score: Math.round(sc * 10) / 10 }); break;
        }
      }
    }
    return out;
  }

  function el(tag, attrs, html) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (html != null) e.textContent = html; return e; }

  /* عجلة الميلاد: حلقة أبراج فاتحة، الكواكب خارج الحلقة بسهم يشير إلى موضعها الدقيق، ودرجة كل كوكب بجانبه */
  var WELC = ['#9a2f43', '#8a5a3b', '#a0782a', '#3b4a96'];
  var WHEEL_CSS = '.nd-wheel{font-family:"Noto Sans Symbols","Noto Sans Symbols 2","Segoe UI Symbol","DejaVu Sans",sans-serif}' +
    '.nd-bgc{fill:#FFFDF9}.nd-seg{fill:#F7EFE1;stroke:none}.nd-seg-alt{fill:#EFE3CF}' +
    '.nd-c-out{fill:none;stroke:#70263F;stroke-width:1.6}.nd-c{fill:none;stroke:#B78A52;stroke-width:1}.nd-c-dash{stroke-dasharray:2 4;stroke:#CDB28A}' +
    '.nd-sg{font-size:25px;text-anchor:middle}.nd-sd{stroke:#CDB28A;stroke-width:1}.nd-tkm{stroke:#B78A52;stroke-width:.8;fill:none}' +
    '.nd-hl{stroke:#CDB28A;stroke-width:1}.nd-hl-ax{stroke:#70263F;stroke-width:1.8}' +
    '.nd-hn{fill:#7a6a70;font:600 14px "IBM Plex Sans Arabic",Arial,sans-serif;text-anchor:middle}' +
    '.nd-ax{fill:#35252B;font:700 16px "IBM Plex Sans Arabic",Arial,sans-serif}.nd-axa{fill:#70263F}' +
    '.nd-al{stroke-width:1.5;stroke-linecap:round}.nd-asp{opacity:.9}' +
    '.nd-pc{fill:#FFFFFF;stroke:#70263F;stroke-width:2}.nd-pg{fill:#70263F;font-size:27px;text-anchor:middle}' +
    '.nd-pd{fill:#4a3a42;font:700 14px "IBM Plex Sans Arabic",Arial,sans-serif;text-anchor:middle;paint-order:stroke;stroke:#FFFDF9;stroke-width:3px;stroke-linejoin:round}' +
    '.nd-rx{fill:#c23b3b;font:700 11px Arial,sans-serif}.nd-tk{stroke:#70263F;stroke-width:2.2;fill:none}.nd-tka{fill:#70263F}.nd-tkh{stroke:#FFFDF9;stroke-width:5.5;fill:none;stroke-linecap:round}.nd-tkhp{fill:#FFFDF9;stroke-linejoin:round}' +
    '.nd-pl{cursor:pointer;outline:0}.nd-pl:hover .nd-pc,.nd-pl:focus-visible .nd-pc,.nd-pl.on .nd-pc{fill:#F6E8CC;stroke:#70263F;stroke-width:2.2}';

  function wheelSVG(ch, planets, asps, known) {
    var C = 300, RO = 212, RS = 174, RH = 138, RP = 256, RD = 290;
    var asc = known ? ch.asc : 0;
    var ang = function (lon) { return (180 - (norm(lon) - asc)) * Math.PI / 180; };
    var pt = function (lon, r) { var a = ang(lon); return [C + r * Math.cos(a), C + r * Math.sin(a)]; };
    var f1 = function (n) { return n.toFixed(1); };
    var svg = el('svg', { viewBox: '-16 -12 632 624', class: 'nd-wheel', role: 'img', 'aria-label': 'عجلة الخريطة الفلكية', xmlns: NS });
    var st = document.createElementNS(NS, 'style'); st.textContent = WHEEL_CSS; svg.appendChild(st);
    var g0 = el('g', { class: 'nd-w-in' }); svg.appendChild(g0);
    g0.appendChild(el('circle', { cx: C, cy: C, r: RO, class: 'nd-bgc' }));
    // حلقة الأبراج
    var band = '', ticks = '', p = function (a, r) { return f1(C + r * Math.cos(a)) + ' ' + f1(C + r * Math.sin(a)); };
    for (var s = 0; s < 12; s++) {
      var a1 = ang(s * 30), a2 = ang(s * 30 + 30);
      band += '<path class="nd-seg' + (s % 2 ? ' nd-seg-alt' : '') + '" d="M' + p(a1, RO) + 'A' + RO + ' ' + RO + ' 0 0 0 ' + p(a2, RO) + 'L' + p(a2, RS) + 'A' + RS + ' ' + RS + ' 0 0 1 ' + p(a1, RS) + 'Z"/>';
      band += '<line class="nd-sd" x1="' + f1(C + RS * Math.cos(a1)) + '" y1="' + f1(C + RS * Math.sin(a1)) + '" x2="' + f1(C + RO * Math.cos(a1)) + '" y2="' + f1(C + RO * Math.sin(a1)) + '"/>';
    }
    for (var d = 0; d < 360; d += 5) { var ta = ang(d), tl = d % 10 === 0 ? 9 : 5; ticks += 'M' + p(ta, RS) + 'L' + p(ta, RS + tl); }
    var bg = document.createElementNS(NS, 'g'); bg.innerHTML = band + '<path class="nd-tkm" d="' + ticks + '"/>'; g0.appendChild(bg);
    for (var s2 = 0; s2 < 12; s2++) { var m = pt(s2 * 30 + 15, (RO + RS) / 2); g0.appendChild(el('text', { x: f1(m[0]), y: f1(m[1] + 8.5), class: 'nd-sg', fill: WELC[SG[s2][2]] }, gl(SG[s2][1]))); }
    g0.appendChild(el('circle', { cx: C, cy: C, r: RO, class: 'nd-c-out' })); g0.appendChild(el('circle', { cx: C, cy: C, r: RS, class: 'nd-c' }));
    g0.appendChild(el('circle', { cx: C, cy: C, r: RH, class: 'nd-c' })); g0.appendChild(el('circle', { cx: C, cy: C, r: RH - 22, class: 'nd-c nd-c-dash' }));
    // البيوت
    if (known && ch.cusps) {
      ch.cusps.forEach(function (c, i) {
        var a = pt(c, RS), b = pt(c, RH); g0.appendChild(el('line', { x1: f1(a[0]), y1: f1(a[1]), x2: f1(b[0]), y2: f1(b[1]), class: 'nd-hl' + (i % 3 === 0 ? ' nd-hl-ax' : '') }));
        var nx = ch.cusps[(i + 1) % 12], mid = norm(c) + norm(nx - c) / 2, q = pt(mid, (RS + RH) / 2);
        g0.appendChild(el('text', { x: f1(q[0]), y: f1(q[1] + 5), class: 'nd-hn' }, String(i + 1)));
      });
    } else {
      for (var h = 0; h < 12; h++) { var a = pt(h * 30, RS), b = pt(h * 30, RH); g0.appendChild(el('line', { x1: f1(a[0]), y1: f1(a[1]), x2: f1(b[0]), y2: f1(b[1]), class: 'nd-hl' })); }
    }
    // خطوط الجوانب
    var ag = el('g', { class: 'nd-asp' }); svg.appendChild(ag);
    asps.forEach(function (x, i) {
      var p1 = pt(x.a.lon, RH - 22), p2 = pt(x.b.lon, RH - 22);
      ag.appendChild(el('line', { x1: f1(p1[0]), y1: f1(p1[1]), x2: f1(p2[0]), y2: f1(p2[1]), stroke: ASPCOL[x.A.t], class: 'nd-al' }));
    });
    // الكواكب خارج الحلقة مع تباعد، وسهم صغير يشير إلى الموضع الدقيق
    var pos = planets.map(function (b) { return { b: b, lon: norm(b.lon), disp: norm(b.lon) }; }).sort(function (x, y) { return x.lon - y.lon; });
    var MIN = 13, axes = known ? [ch.asc, ch.asc + 180, ch.mc, ch.mc + 180].map(norm) : [];
    /* نفك التزاحم بدفع كل كوكب بعيدًا عن جاره (الفرق الموقّع بين الاثنين) مع ثبات الترتيب، ونبعدها عن المحاور */
    for (var it = 0; it < 200; it++) {
      var moved = false;
      for (var i = 0; i < pos.length; i++) {
        var nx = pos[(i + 1) % pos.length]; if (nx === pos[i]) continue;
        var dd = norm(nx.disp - pos[i].disp); if (dd > 180) dd -= 360;
        if (dd < MIN) { var push = (MIN - dd) / 2 + .01; pos[i].disp = norm(pos[i].disp - push); nx.disp = norm(nx.disp + push); moved = true; }
      }
      axes.forEach(function (A) { pos.forEach(function (o) { var df = ((o.disp - A + 540) % 360) - 180; if (Math.abs(df) < 10) { o.disp = norm(A + (df >= 0 ? 10 : -10)); moved = true; } }); });
      if (!moved) break;
    }
    var pg = el('g', { class: 'nd-pls' }); svg.appendChild(pg);
    var PR = 21;
    pos.forEach(function (o, i) {
      var q = pt(o.disp, RP), dp = pt(o.disp, RD), tip = pt(o.lon, RS - 10);
      var ex = q[0] - tip[0], ey = q[1] - tip[1], el2 = Math.hypot(ex, ey) || 1, ux = ex / el2, uy = ey / el2;   /* من الطرف نحو الكوكب */
      var st = [q[0] - ux * PR, q[1] - uy * PR];
      var hl = 15, hw = 6.5, bx = tip[0] + ux * hl, by = tip[1] + uy * hl;
      var tri = f1(tip[0]) + ',' + f1(tip[1]) + ' ' + f1(bx - uy * hw) + ',' + f1(by + ux * hw) + ' ' + f1(bx + uy * hw) + ',' + f1(by - ux * hw);
      var gp = el('g', { class: 'nd-pl', tabindex: '0', role: 'button', 'data-k': o.b.k, 'aria-label': o.b.n }); gp.style.setProperty('--i', i);
      gp.appendChild(el('line', { x1: f1(st[0]), y1: f1(st[1]), x2: f1(bx), y2: f1(by), class: 'nd-tkh' }));
      gp.appendChild(el('line', { x1: f1(st[0]), y1: f1(st[1]), x2: f1(bx), y2: f1(by), class: 'nd-tk' }));
      gp.appendChild(el('polygon', { points: tri, class: 'nd-tkh nd-tkhp' }));
      gp.appendChild(el('polygon', { points: tri, class: 'nd-tka' }));
      gp.appendChild(el('circle', { cx: f1(q[0]), cy: f1(q[1]), r: PR, class: 'nd-pc' }));
      gp.appendChild(el('text', { x: f1(q[0]), y: f1(q[1] + 9), class: 'nd-pg' }, gl(o.b.g)));
      if (o.b.retro) gp.appendChild(el('text', { x: f1(q[0] + 19), y: f1(q[1] - 12), class: 'nd-rx', 'text-anchor': 'middle' }, 'R'));
      gp.appendChild(el('text', { x: f1(dp[0]), y: f1(dp[1] + 5), class: 'nd-pd' }, Math.floor(norm(o.b.lon) % 30) + '°'));
      pg.appendChild(gp);
    });
    // المحاور: أسهم عند الحلقة وأسماؤها خارجها
    if (known) {
      [['ASC', ch.asc], ['DSC', ch.asc + 180], ['MC', ch.mc], ['IC', ch.mc + 180]].forEach(function (L) {
        var q = pt(L[1], RO), ar = ang(L[1]), ux = Math.cos(ar), uy = Math.sin(ar);
        var tri = f1(q[0] + ux * 13) + ',' + f1(q[1] + uy * 13) + ' ' + f1(q[0] - uy * 5) + ',' + f1(q[1] + ux * 5) + ' ' + f1(q[0] + uy * 5) + ',' + f1(q[1] - ux * 5);
        svg.appendChild(el('polygon', { points: tri, class: 'nd-axa' }));
        var lp = pt(L[1], RO + 36);
        svg.appendChild(el('text', { x: f1(lp[0]), y: f1(lp[1] + 5.5), class: 'nd-ax', 'text-anchor': 'middle' }, L[0]));
      });
    }
    return svg;
  }

  function elementPct(ch, known) {
    var w = [0, 0, 0, 0], md = [0, 0, 0], tot = 0;
    PL.forEach(function (p) { var b = bodyOf(ch, p[0]); if (!b) return; var s = Math.floor(norm(b.lon) / 30); w[SG[s][2]] += p[3]; md[SG[s][3]] += p[3]; tot += p[3]; });
    if (known) { var as = Math.floor(norm(ch.asc) / 30), ms = Math.floor(norm(ch.mc) / 30); w[SG[as][2]] += 3; md[SG[as][3]] += 3; w[SG[ms][2]] += 1; md[SG[ms][3]] += 1; tot += 4; }
    var raw = w.map(function (v) { return v / tot * 100; }), pct = raw.map(Math.floor), left = 100 - pct.reduce(function (a, b) { return a + b; }, 0);
    raw.map(function (v, i) { return [v - Math.floor(v), i]; }).sort(function (a, b) { return b[0] - a[0]; }).forEach(function (x) { if (left > 0) { pct[x[1]]++; left--; } });
    var mt = md.reduce(function (a, b) { return a + b; }, 0);
    return { el: pct, md: md.map(function (v) { return Math.round(v / mt * 100); }) };
  }
  function bodyOf(ch, k) { for (var i = 0; i < ch.bodies.length; i++) if (ch.bodies[i].key === k) return ch.bodies[i]; return null; }
  function arrow() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>'; }
  function ic(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }
  function aspIcon(k) { var m = { conj: '<circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3"/>', sext: '<path d="M12 3v18M4.500 7.500l15 9M19.500 7.500l-15 9"/>', sq: '<rect x="5" y="5" width="14" height="14"/>', tri: '<path d="M12 4 21 19H3z"/>', opp: '<circle cx="6.500" cy="12" r="3.500"/><circle cx="17.500" cy="12" r="3.500"/><path d="M10 12h4"/>' }; return ic(m[k]); }

  function countUp(node, to) {
    var t0 = performance.now(), dur = 900;
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) { node.textContent = to + '%'; return; }
    (function f(t) { var p = Math.min(1, (t - t0) / dur); node.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + '%'; if (p < 1) requestAnimationFrame(f); })(t0);
  }

  function build(S) {
    var ch = S.ch, known = !!ch.known && ch.cusps && ch.cusps.length === 12;
    var planets = PL.map(function (p) { var b = bodyOf(ch, p[0]); return b ? { k: p[0], n: p[1], g: p[2], lon: b.lon, retro: !!b.retro, house: b.house } : null; }).filter(Boolean);
    var items = planets.slice(); if (known) { items.push({ k: 'asc', n: 'الطالع', lon: ch.asc }, { k: 'mc', n: 'وسط السماء', lon: ch.mc }); }
    var asps = aspects(items);
    var sun = planets[0], moon = planets[1], pc = elementPct(ch, known);
    var sSign = Math.floor(norm(sun.lon) / 30), mSign = Math.floor(norm(moon.lon) / 30), aSign = known ? Math.floor(norm(ch.asc) / 30) : null;
    var hs = ch.hs === 'placidus' ? 'بلاسيدوس' : ch.hs === 'whole' || ch.hs === 'whole-fallback' ? 'البيوت الكاملة' : ch.hs === 'equal' ? 'البيوت المتساوية' : ch.hs === 'porphyry' ? 'بورفيري' : ch.hs;
    var domE = pc.el.indexOf(Math.max.apply(null, pc.el)), domM = pc.md.indexOf(Math.max.apply(null, pc.md));
    var lat = Number(S.lat), lon = Number(S.lon);
    var ns = lat >= 0 ? 'N' : 'S', ew = lon >= 0 ? 'E' : 'W';
    var tile = function (ico, label, si, miss) {
      if (miss) return '<div class="nd-tile nd-tile-miss"><span class="nd-ti">' + ico + '</span><b>' + label + '</b><em>غير محدد</em><small>أضف وقت الميلاد لحسابه</small></div>';
      return '<div class="nd-tile"><span class="nd-ti">' + ico + '</span><b>' + label + '</b><em>في ' + SG[si][0] + '</em><small>' + SG[si][4].join(' <i></i> ') + '</small></div>';
    };
    var summary = 'تغلب على خريطتك طاقة ' + ELN[domE] + ' (' + pc.el[domE] + '%) في إيقاع ' + MDN[domM].replace('ال', '') + ' يميل إلى ' + MDP[domM] + '، ' +
      'مع شمس في ' + SG[sSign][0] + ' وقمر في ' + SG[mSign][0] + (known ? ' وطالع في ' + SG[aSign][0] : '') + '. نركّز هنا على ' + ELP[domE] + '. قراءة رمزية للتأمل وليست حكمًا نهائيًا.';
    var chip = function (ico, label, val) { return '<div class="nd-chip"><span class="nd-chip-i">' + ico + '</span><span class="nd-chip-t"><small>' + label + '</small><b>' + esc(val) + '</b></span></div>'; };
    var dateTxt = S.y + '/' + n2(S.m) + '/' + n2(S.d), timeTxt = S.known ? n2(S.hh) + ':' + n2(S.mm) : 'غير معروف';
    var top = asps.slice().sort(function (a, b) { return b.score - a.score; }).slice(0, 5);
    var axes = known ? [['ASC', 'الطالع / ' + 'الأفق الشرقي', ch.asc], ['MC', 'وسط السماء / أعلى السماء', ch.mc], ['DSC', 'محور العلاقات (البيت 7)', ch.asc + 180], ['IC', 'قاع السماء (البيت 4)', ch.mc + 180]] : [];

    var h = '';
    h += '<div class="nd-chips">' +
      chip(ic('<path d="M12 21s7-6 7-11.500A7 7 0 0 0 5 9.500C5 15 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.500"/>'), 'مكان الميلاد', S.placeName || '—') +
      chip(ic('<circle cx="12" cy="12" r="8.500"/><path d="M12 7.500V12l3 2"/>'), 'وقت الميلاد', timeTxt) +
      chip(ic('<rect x="3.500" y="5" width="17" height="15" rx="2.500"/><path d="M3.500 10h17M8 3v4M16 3v4"/>'), 'تاريخ الميلاد', dateTxt) + '</div>';
    h += '<div class="nd-title"><h3>' + (S.name ? 'خريطة ' + esc(S.name) : 'خريطة الولادة') + '</h3><p>صورة السماء لحظة وصولك إلى العالم</p>';
    h += '<button type="button" class="btn-edit-chart nd-edit" aria-label="تعديل البيانات / خريطة جديدة" title="تعديل البيانات / خريطة جديدة">' + ic('<path d="M4 20h4L19 9a2.800 2.800 0 0 0-4-4L4 16z"/><path d="M13.500 6.500l4 4"/>') + '</button></div>';
    h += '<div class="nd-tabs" role="tablist">' + [['map', 'الخريطة'], ['planets', 'الكواكب'], ['houses', 'البيوت'], ['aspects', 'الجوانب']].map(function (t) { return '<button type="button" role="tab" data-nd-tab="' + t[0] + '" aria-selected="' + (t[0] === 'map') + '">' + t[1] + '</button>'; }).join('') + '</div>';
    // لوحة الخريطة
    h += '<div class="nd-main" data-nd-panel="map"><div class="nd-grid">' +
      '<section class="nd-over"><h4>نظرة عامة</h4><p>تقدم خريطة ولادتك صورة فريدة للطاقة الكونية لحظة ميلادك، مما يكشف عن ملامح شخصيتك ودوافعك العميقة ومسارك في الحياة.</p>' +
      '<div class="nd-tiles">' + (known ? tile(ic('<path d="M12 4v16M12 4l-5 5M12 4l5 5"/>'), 'الطالع', aSign, false) : '') + tile(ic('<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'), 'الشمس', sSign) + tile(ic('<path d="M15.500 4.500a8 8 0 1 0 4 14 9 9 0 0 1-4-14z"/>'), 'القمر', mSign) + '</div>' +
      '<div class="nd-sum"><h5>' + ic('<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="3"/>') + 'خلاصة سريعة</h5><p>' + esc(summary) + '</p></div></section>' +
      '<section class="nd-wcard"><header><div><h4>خريطة الميلاد الفلكية</h4><small>نظام البيوت: ' + esc(hs) + '</small></div><div class="nd-coords" dir="ltr"><span>' + Math.abs(lat).toFixed(4) + '° ' + ns + '</span><span>' + Math.abs(lon).toFixed(4) + '° ' + ew + '</span></div></header>' +
      '<div class="nd-wslot"></div><p class="nd-pick" aria-live="polite">اضغط على أي كوكب لعرض موضعه.</p>' +
      '<ul class="nd-legend"><li><i style="background:' + ASPCOL.h + '"></i>اتصال منسجم</li><li><i style="background:' + ASPCOL.t + '"></i>اتصال متوتر</li><li><i style="background:' + ASPCOL.n + '"></i>اتصال محايد</li></ul>' +
      '<div class="nd-tools"><button type="button" class="nd-tool" data-nd-dl>' + ic('<path d="M12 4v11M7.500 11l4.500 4.500 4.500-4.500M5 19.500h14"/>') + '<span>تنزيل الصورة</span></button>' +
      '<button type="button" class="nd-tool" data-nd-copy>' + ic('<rect x="8.500" y="8.500" width="11" height="11" rx="2.200"/><path d="M15.500 8.500v-2a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>') + '<span>نسخ البيانات</span></button></div>' +
      '</section></div></div>';
    // لوحات القوائم
    h += '<div class="nd-main nd-list" data-nd-panel="planets" hidden><div class="nd-rows">' + planets.map(function (p, i) { var f = fmtLon(p.lon); return '<div class="nd-row" style="--i:' + i + '"><span class="nd-rg">' + gl(p.g) + '</span><b>' + p.n + (p.retro ? ' <em>R</em>' : '') + '</b><span>' + gl(SG[f.s][1]) + ' ' + SG[f.s][0] + ' ' + f.txt + '</span><span class="nd-rh">' + (known && p.house ? 'البيت ' + p.house : '—') + '</span></div>'; }).join('') + '</div></div>';
    h += (!known ? '' : '<div class="nd-main nd-list" data-nd-panel="houses" hidden>' + (known ? '<div class="nd-rows">' + ch.cusps.map(function (c, i) { var f = fmtLon(c); return '<div class="nd-row" style="--i:' + i + '"><span class="nd-rg nd-hnum">' + (i + 1) + '</span><b>البيت ' + (i + 1) + '</b><span>' + gl(SG[f.s][1]) + ' ' + SG[f.s][0] + ' ' + f.txt + '</span><span class="nd-rh">' + HA[i] + '</span></div>'; }).join('') + '</div>' : '') + '</div>');
    h += '<div class="nd-main nd-list" data-nd-panel="aspects" hidden><div class="nd-rows">' + (asps.length ? asps.slice().sort(function (a, b) { return a.orb - b.orb; }).map(function (x, i) { return '<div class="nd-row" style="--i:' + i + '"><span class="nd-rg" style="color:' + ASPCOL[x.A.t] + '">' + aspIcon(x.A.k) + '</span><b>' + x.a.n + ' · ' + x.b.n + '</b><span>' + x.A.n + '</span><span class="nd-rh">فارق ' + x.orb.toFixed(1) + '°</span></div>'; }).join('') : '<p class="nd-warn">لا جوانب رئيسية ضمن الحدود المعتادة.</p>') + '</div></div>';
    // البطاقات السفلية
    h += '<div class="nd-bottom">' +
      (!known ? '' : '<section class="nd-card"><h4>محاور الخريطة</h4>' + (known ? axes.map(function (a) { var f = fmtLon(a[2]); return '<div class="nd-axrow"><span class="nd-axb">' + a[0] + '</span><span class="nd-axt"><b>' + SG[f.s][0] + ' ' + gl(SG[f.s][1]) + '</b><small>' + a[1] + '</small></span><span class="nd-axd">' + f.txt + '</span></div>'; }).join('') : '') + '</section>') +
      '<section class="nd-card"><h4>أقوى الجوانب</h4>' + (top.length ? top.map(function (x) { return '<div class="nd-asrow"><span class="nd-sc">' + x.score.toFixed(1) + '</span><span class="nd-as" style="color:' + ASPCOL[x.A.t] + '">' + aspIcon(x.A.k) + '</span><span class="nd-an">' + x.a.n + ' · ' + x.b.n + '</span><em>' + x.A.n + '</em></div>'; }).join('') : '<p class="nd-warn">لا جوانب بارزة في هذه الخريطة.</p>') + '</section>' +
      '<section class="nd-card"><h4>توزيع العناصر</h4>' + [0, 1, 2, 3].map(function (e) { return '<div class="nd-el"><span class="nd-eln">' + ELN[e] + '</span><span class="nd-bar"><i style="--c:' + ELC[e] + '" data-w="' + pc.el[e] + '"></i></span><b data-pct="' + pc.el[e] + '">0%</b></div>'; }).join('') +
      '<div class="nd-md">' + MDN.map(function (m, i) { return '<span><small>' + m + '</small><b>' + pc.md[i] + '%</b></span>'; }).join('') + '</div></section></div>';
    return { html: h, ch: ch, planets: planets, asps: asps, known: known };
  }

  /* ترتيب الصفحة: العجلة فوق، التبويبات تحتها، وكل لوحة في تبويبها (نظرة عامة، الكواكب، البيوت، الجوانب، التوزيع) */
  function arrange(box) {
    var map = box.querySelector('[data-nd-panel="map"]'), wcard = box.querySelector('.nd-wcard'), over = box.querySelector('.nd-over');
    var bottom = box.querySelector('.nd-bottom'), tabs = box.querySelector('.nd-tabs');
    if (!map || !wcard || !over || !bottom || !tabs) return;
    var all = [].slice.call(bottom.querySelectorAll(':scope > .nd-card')), known = !!box.querySelector('[data-nd-panel="houses"]');
    var cards = known ? all : [null].concat(all);
    function stack(name, kids) {
      var d = document.createElement('div'); d.className = 'nd-main nd-stack'; d.setAttribute('data-nd-panel', name); d.hidden = true;
      kids.forEach(function (k) { if (k) d.appendChild(k); }); return d;
    }
    var pOver = stack('overview', [over, cards[0]]), pDist = stack('dist', [cards[2]]);
    var pAsp = box.querySelector('[data-nd-panel="aspects"]'); if (pAsp && cards[1]) pAsp.insertBefore(cards[1], pAsp.firstChild);
    wcard.classList.add('nd-wtop'); tabs.parentNode.insertBefore(wcard, tabs);
    tabs.insertAdjacentElement('afterend', pOver);
    if (pAsp) pAsp.insertAdjacentElement('afterend', pDist); else tabs.parentNode.appendChild(pDist);
    map.remove(); bottom.remove();
    var I = function (p) { return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
    var defs = [
      ['houses', 'البيوت', I('<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>')],
      ['planets', 'الكواكب', I('<circle cx="12" cy="12" r="4"/><ellipse cx="12" cy="12" rx="10" ry="3.500" transform="rotate(-22 12 12)"/>')],
      ['aspects', 'الجوانب', I('<path d="M12 4l8.500 15h-17z"/><circle cx="12" cy="4" r="1.200"/><circle cx="20.500" cy="19" r="1.200"/><circle cx="3.500" cy="19" r="1.200"/>')],
      ['dist', 'التوزيع', I('<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15 3.400A9 9 0 0 1 20.600 9H15z"/>')],
      ['overview', 'نظرة عامة', I('<rect x="4" y="4" width="7" height="7" rx="1.800"/><rect x="13" y="4" width="7" height="7" rx="1.800"/><rect x="4" y="13" width="7" height="7" rx="1.800"/><rect x="13" y="13" width="7" height="7" rx="1.800"/>')]
    ];
    var first = known ? 'houses' : 'planets';
    if (!known) defs = defs.filter(function (t) { return t[0] !== 'houses'; });
    var ph = box.querySelector('[data-nd-panel="' + first + '"]'); if (ph) ph.hidden = false;
    tabs.innerHTML = defs.map(function (t) { return '<button type="button" role="tab" data-nd-tab="' + t[0] + '" aria-selected="' + (t[0] === first) + '">' + t[2] + '<span>' + t[1] + '</span></button>'; }).join('');
  }

  /* ---------- نسخ البيانات وتنزيل الصورة ---------- */
  function plainLon(lon) { var s = Math.floor(norm(lon) / 30), r = norm(lon) - s * 30, d = Math.floor(r), m = Math.floor((r - d) * 60); return SG[s][0] + ' ' + d + '°' + n2(m) + '′'; }
  var XN = { node: 'العقدة الشمالية (متوسطة)', truenode: 'العقدة الشمالية (حقيقية)', lilith: 'ليليث' };
  function chartText(S, data) {
    var ch = data.ch, known = data.known, L = [];
    var hs = ch.hs === 'placidus' ? 'بلاسيدوس' : ch.hs === 'whole' || ch.hs === 'whole-fallback' ? 'البيوت الكاملة' : ch.hs === 'equal' ? 'البيوت المتساوية' : ch.hs === 'porphyry' ? 'بورفيري' : (ch.hs || '');
    L.push('خريطة الميلاد الفلكية' + (S.name ? ' — ' + S.name : ''));
    L.push('تاريخ الميلاد: ' + S.y + '/' + n2(S.m) + '/' + n2(S.d));
    L.push('وقت الميلاد: ' + (S.known ? n2(S.hh) + ':' + n2(S.mm) : 'غير معروف'));
    if (S.placeName) L.push('مكان الميلاد: ' + S.placeName);
    L.push('الإحداثيات: ' + Math.abs(Number(S.lat)).toFixed(4) + '° ' + (Number(S.lat) >= 0 ? 'N' : 'S') + ' · ' + Math.abs(Number(S.lon)).toFixed(4) + '° ' + (Number(S.lon) >= 0 ? 'E' : 'W'));
    if (known) L.push('نظام البيوت: ' + hs);
    L.push('', 'الكواكب');
    data.planets.forEach(function (p) { L.push(p.n + ': ' + plainLon(p.lon) + (p.retro ? ' (متراجع)' : '') + (known && p.house ? ' — البيت ' + p.house : '')); });
    Object.keys(XN).forEach(function (k) { var b = bodyOf(ch, k); if (b) L.push(XN[k] + ': ' + plainLon(b.lon) + (known && b.house ? ' — البيت ' + b.house : '')); });
    if (known) {
      L.push('', 'الزوايا');
      L.push('الطالع (ASC): ' + plainLon(ch.asc)); L.push('وسط السماء (MC): ' + plainLon(ch.mc));
      L.push('الغروب (DSC): ' + plainLon(ch.asc + 180)); L.push('قاع السماء (IC): ' + plainLon(ch.mc + 180));
      L.push('', 'البيوت');
      ch.cusps.forEach(function (c, i) { L.push('البيت ' + (i + 1) + ' (' + HA[i] + '): ' + plainLon(c)); });
    } else L.push('', 'ملاحظة: وقت الميلاد غير معروف، لذلك لا طالع ولا بيوت في هذه الخريطة.');
    L.push('', 'الجوانب');
    if (data.asps.length) data.asps.slice().sort(function (a, b) { return a.orb - b.orb; }).forEach(function (x) { L.push(x.a.n + ' ' + x.A.n + ' ' + x.b.n + ' — فارق ' + x.orb.toFixed(1) + '°'); });
    else L.push('لا جوانب رئيسية ضمن الحدود المعتادة.');
    L.push('', 'عقيق أسترو (Aqeq Astro)');
    return L.join('\n');
  }
  function copyText(t) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t);
    return new Promise(function (res, rej) {
      var a = document.createElement('textarea'); a.value = t; a.setAttribute('readonly', ''); a.style.cssText = 'position:fixed;top:0;inset-inline-start:0;opacity:0';
      document.body.appendChild(a); a.select(); a.setSelectionRange(0, t.length);
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {} a.remove(); ok ? res() : rej(new Error('copy'));
    });
  }
  function flash(btn, txt) {
    var sp = btn.querySelector('span'); if (!sp) return; var old = btn.getAttribute('data-l') || sp.textContent; btn.setAttribute('data-l', old);
    sp.textContent = txt; btn.classList.add('is-done'); clearTimeout(btn._t);
    btn._t = setTimeout(function () { sp.textContent = old; btn.classList.remove('is-done'); }, 1900);
  }
  function savePNG(box, S, data, btn) {
    var src = box.querySelector('.nd-wheel'); if (!src) return Promise.resolve();
    var svg = src.cloneNode(true); svg.setAttribute('width', 1232); svg.setAttribute('height', 1224);
    var url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' }));
    var fonts = document.fonts && document.fonts.load ? Promise.all([document.fonts.load('700 56px Amiri'), document.fonts.load('600 30px "IBM Plex Sans Arabic"')]).catch(function () {}) : Promise.resolve();
    return fonts.then(function () { return new Promise(function (res, rej) { var im = new Image(); im.onload = function () { res(im); }; im.onerror = rej; im.src = url; }); }).then(function (im) {
      var W = 1400, H = 1790, cv = document.createElement('canvas'); cv.width = W; cv.height = H; var x = cv.getContext('2d');
      var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#FBF6EC'); g.addColorStop(1, '#F3E9D8'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.strokeStyle = '#D2AE6C'; x.lineWidth = 3; x.strokeRect(28, 28, W - 56, H - 56);
      x.direction = 'rtl'; x.textAlign = 'center';
      x.fillStyle = '#4A1A2B'; x.font = '700 62px Amiri, "IBM Plex Sans Arabic", serif'; x.fillText(S.name ? 'خريطة ' + S.name : 'خريطة الميلاد الفلكية', W / 2, 130);
      x.fillStyle = '#6a5760'; x.font = '600 30px "IBM Plex Sans Arabic", Amiri, sans-serif';
      x.fillText(S.y + '/' + n2(S.m) + '/' + n2(S.d) + '  ·  ' + (S.known ? n2(S.hh) + ':' + n2(S.mm) : 'وقت غير معروف'), W / 2, 190);
      if (S.placeName) x.fillText(S.placeName, W / 2, 238);
      x.drawImage(im, 84, 280, 1232, 1224);
      var lg = [[ASPCOL.h, 'اتصال منسجم'], [ASPCOL.t, 'اتصال متوتر'], [ASPCOL.n, 'اتصال محايد']], lx = W / 2 + 330;
      x.font = '600 26px "IBM Plex Sans Arabic", sans-serif'; x.textAlign = 'right';
      lg.forEach(function (l, i) { var xr = lx - i * 330; x.strokeStyle = l[0]; x.lineWidth = 5; x.beginPath(); x.moveTo(xr, 1562); x.lineTo(xr - 56, 1562); x.stroke(); x.fillStyle = '#4a3a42'; x.fillText(l[1], xr - 70, 1572); });
      x.textAlign = 'center'; x.fillStyle = '#70263F'; x.font = '700 30px Amiri, serif'; x.fillText('عقيق أسترو  ·  Aqeq Astro', W / 2, 1700);
      URL.revokeObjectURL(url);
      return new Promise(function (res) {
        cv.toBlob(function (b) {
          var a = document.createElement('a'), u = URL.createObjectURL(b); a.href = u; a.download = 'aqeeq-natal-chart-' + S.y + '-' + n2(S.m) + '-' + n2(S.d) + '.png';
          document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000); res();
        }, 'image/png');
      });
    });
  }

  function render(S) {
    if (!S || !S.ch || !S.ch.bodies) return;
    var old = root.querySelector('.nd-root'); if (old) old.remove();
    var data; try { data = build(S); } catch (e) { if (window.console) console.warn('natal-dashboard', e); return; }
    var box = document.createElement('div'); box.className = 'nd-root'; box.innerHTML = data.html;
    // المحتوى القديم (التفاصيل الكاملة والتفسير) لم يعد يُعرض؛ يبقى مخفيًا كي لا تنكسر الطبقات التي تقرأ منه
    var legacy = document.createElement('div'); legacy.className = 'nd-legacy'; legacy.hidden = true;
    while (root.firstChild) legacy.appendChild(root.firstChild);
    root.appendChild(box); root.appendChild(legacy);
    root.classList.add('nd-on');
    arrange(box);
    var slot = box.querySelector('.nd-wslot'); slot.appendChild(wheelSVG(data.ch, data.planets, data.asps, data.known));
    var pick = box.querySelector('.nd-pick');
    var show = function (k) {
      var p = data.planets.filter(function (x) { return x.k === k; })[0]; if (!p) return;
      var f = fmtLon(p.lon); pick.innerHTML = '<b>' + p.n + '</b> في ' + SG[f.s][0] + ' ' + f.txt + (data.known && p.house ? ' · البيت ' + p.house + ' (' + HA[p.house - 1] + ')' : '') + (p.retro ? ' · تراجع' : '');
      box.querySelectorAll('.nd-pl').forEach(function (n) { n.classList.toggle('on', n.getAttribute('data-k') === k); });
    };
    slot.addEventListener('click', function (e) { var g = e.target.closest('.nd-pl'); if (g) show(g.getAttribute('data-k')); });
    slot.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('nd-pl')) { e.preventDefault(); show(e.target.getAttribute('data-k')); } });
    // التبويبات
    var tabs = box.querySelectorAll('[data-nd-tab]');
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
        box.querySelectorAll('[data-nd-panel]').forEach(function (p) { var on = p.getAttribute('data-nd-panel') === t.getAttribute('data-nd-tab'); p.hidden = !on; if (on) { p.classList.remove('nd-anim'); void p.offsetWidth; p.classList.add('nd-anim'); } });
      });
    });
    var dl = box.querySelector('[data-nd-dl]'), cp = box.querySelector('[data-nd-copy]');
    if (dl) dl.addEventListener('click', function () { if (dl.disabled) return; dl.disabled = true; flash(dl, 'جارٍ تجهيز الصورة…'); savePNG(box, S, data, dl).then(function () { flash(dl, 'تم تنزيل الصورة'); }, function () { flash(dl, 'تعذر التنزيل، حاول مرة أخرى'); }).then(function () { dl.disabled = false; }); });
    if (cp) cp.addEventListener('click', function () { copyText(chartText(S, data)).then(function () { flash(cp, 'تم نسخ البيانات'); }, function () { flash(cp, 'تعذر النسخ'); }); });
    // حركة النسب
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      box.classList.add('nd-go');
      box.querySelectorAll('.nd-bar i').forEach(function (i) { i.style.width = i.getAttribute('data-w') + '%'; });
      box.querySelectorAll('[data-pct]').forEach(function (b) { countUp(b, +b.getAttribute('data-pct')); });
    }); });
  }

  /* نخفي النتيجة أثناء تركيبها (اللوحة ثم النصوص) ونظهرها مرة واحدة، فلا تقفز الصفحة ولا تختفي الأقسام */
  function unbusy() { clearTimeout(unbusy.t); root.classList.remove('nd-busy'); }
  window.AqeeqResultReady = unbusy;
  window.addEventListener('aqeeq:chart-rendered', function (e) {
    root.classList.add('nd-busy'); clearTimeout(unbusy.t); unbusy.t = setTimeout(unbusy, 4000);
    setTimeout(function () { render(e.detail || (window.AqeeqChartContext && window.AqeeqChartContext.getNatal())); }, 30);
  });
})();
