/* لمسة احترافية لعجلة الأبراج في الصفحة الرئيسية: قطاعات الأبراج، أقراص زجاجية بلون العنصر، حلقات ذهبية متدرجة، توهج مركزي. */
(function () {
  'use strict';
  var svg = document.querySelector('svg.wheel'); if (!svg || svg.dataset.pro) return; svg.dataset.pro = '1';
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, kids) { var e = document.createElementNS(NS, n); Object.keys(a || {}).forEach(function (k) { e.setAttribute(k, a[k]); }); (kids || []).forEach(function (c) { e.appendChild(c); }); return e; }
  function stop(o, c, op) { return el('stop', { offset: o, 'stop-color': c, 'stop-opacity': op == null ? 1 : op }); }
  var defs = el('defs', {}, [
    el('linearGradient', { id: 'pwGold', x1: '0', y1: '0', x2: '1', y2: '1' }, [stop('0', '#f6e3b0'), stop('.5', '#c9993f'), stop('1', '#8a6422')]),
    el('radialGradient', { id: 'pwCenter' }, [stop('0', '#e9c987', .30), stop('.55', '#7a52d6', .12), stop('1', '#000', 0)]),
    el('radialGradient', { id: 'pwDisc', cx: '35%', cy: '30%', r: '80%' }, [stop('0', '#3a2d63', .9), stop('1', '#0d0820', .92)])
  ]);
  svg.insertBefore(defs, svg.firstChild);
  var C = 200, R1 = 126, R2 = 170;
  function pt(r, deg) { var a = deg * Math.PI / 180; return [C + Math.cos(a) * r, C + Math.sin(a) * r]; }
  var sectors = el('g', { class: 'pw-sectors', 'aria-hidden': 'true' });
  for (var i = 0; i < 12; i++) {
    var a0 = -90 + i * 30 - 15, a1 = a0 + 30, p1 = pt(R2, a0), p2 = pt(R2, a1), p3 = pt(R1, a1), p4 = pt(R1, a0);
    sectors.appendChild(el('path', { class: 'pw-sector ' + (i % 2 ? 'odd' : 'even'), d: 'M' + p1 + 'A' + R2 + ' ' + R2 + ' 0 0 1 ' + p2 + 'L' + p3 + 'A' + R1 + ' ' + R1 + ' 0 0 0 ' + p4 + 'Z' }));
    var d1 = pt(R1, a0), d2 = pt(R2, a0); sectors.appendChild(el('line', { class: 'pw-div', x1: d1[0].toFixed(2), y1: d1[1].toFixed(2), x2: d2[0].toFixed(2), y2: d2[1].toFixed(2) }));
  }
  var first = svg.querySelector('circle.ln.strong'); svg.insertBefore(sectors, first ? first.nextSibling : svg.firstChild.nextSibling);
  svg.insertBefore(el('circle', { class: 'pw-outer', cx: C, cy: C, r: 197, 'aria-hidden': 'true' }), sectors);
  svg.insertBefore(el('circle', { class: 'pw-glow', cx: C, cy: C, r: 64, 'aria-hidden': 'true' }), svg.querySelector('.moon'));
  svg.querySelectorAll('.wg').forEach(function (g, idx) {
    var hit = g.querySelector('.hit'); if (!hit) return;
    g.classList.add('pw-e' + (idx % 4));
    g.insertBefore(el('circle', { class: 'pw-disc', cx: hit.getAttribute('cx'), cy: hit.getAttribute('cy'), r: 19.5 }), g.firstChild);
  });

  /* ===== السماء الآن: الكواكب على العجلة بمواضعها الحقيقية (طول البروج) ===== */
  var BODIES = [['sun', '☉', 'الشمس', '#ffd98a'], ['moon', '☽', 'القمر', '#e9edf7'], ['mercury', '☿', 'عطارد', '#c9d2dc'], ['venus', '♀', 'الزهرة', '#ffc9d6'], ['mars', '♂', 'المريخ', '#ff9a78'], ['jupiter', '♃', 'المشتري', '#f3d6a4'], ['saturn', '♄', 'زحل', '#e2c98a'], ['uranus', '♅', 'أورانوس', '#9fe3e6'], ['neptune', '♆', 'نبتون', '#9db4ff'], ['pluto', '♇', 'بلوتو', '#d9c4ae']];
  var SIGN_N = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var live = el('g', { class: 'pw-live' }); var mark = svg.querySelector('.moon'); svg.insertBefore(live, mark);
  function draw() {
    if (typeof Astro === 'undefined' || !Astro.lonOf) return;
    try {
      var jd = Astro.jdFromMs(Date.now()), jde = jd + Astro.deltaT(Astro.yearOf(jd)) / 86400, rows = [];
      BODIES.forEach(function (b) { var lon = Astro.lonOf(b[0], jde); if (Number.isFinite(lon)) rows.push({ b: b, lon: ((lon % 360) + 360) % 360 }); });
      rows.sort(function (a, c) { return a.lon - c.lon; });
      live.textContent = '';
      var placed = [];
      rows.forEach(function (r) {
        var ang = -105 + r.lon, lvl = 0;
        placed.forEach(function (q) { if (Math.abs(q.lon - r.lon) < 9 && q.lvl === lvl) lvl++; });
        placed.push({ lon: r.lon, lvl: lvl });
        var rad = 102 - lvl * 17, p = pt(rad, ang), s = Math.floor(r.lon / 30), deg = Math.floor(r.lon % 30);
        var g = el('g', { class: 'pw-pl', tabindex: '0', role: 'img', 'aria-label': r.b[2] + ' في ' + SIGN_N[s] + ' ' + deg + ' درجة' });
        g.appendChild(el('circle', { cx: p[0].toFixed(2), cy: p[1].toFixed(2), r: 9, class: 'pw-pl-dot', style: 'stroke:' + r.b[3] }));
        var t = el('text', { x: p[0].toFixed(2), y: (p[1] + 0.5).toFixed(2), class: 'pw-pl-g', style: 'fill:' + r.b[3] }); t.textContent = r.b[1]; g.appendChild(t);
        var ti = el('title', {}); ti.textContent = r.b[2] + ' · ' + SIGN_N[s] + ' ' + deg + '°'; g.appendChild(ti);
        live.appendChild(g);
      });
    } catch (e) { /* الحساب اختياري: العجلة تفضل شغالة */ }
  }
  draw(); setInterval(draw, 60000);
  var sub = document.createElement('p'); sub.className = 'pw-note'; sub.textContent = 'الكواكب على العجلة في مواضعها الحقيقية في السماء الآن';
  var hint = document.querySelector('.wheel-hint'); if (hint) hint.insertAdjacentElement('afterend', sub);
})();
