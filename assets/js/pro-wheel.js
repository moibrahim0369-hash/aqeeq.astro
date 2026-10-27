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
})();
