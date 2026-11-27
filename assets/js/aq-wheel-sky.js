/* كل عجلات الخرائط الفلكية (الخريطة المتقدمة، التوافق، العبور...) بنفس عجلة صفحة السماء. */
(function () {
  'use strict';
  var W = window.AqeeqAstroWheel; if (!W) return;
  var NS = 'http://www.w3.org/2000/svg';
  var ORIG = { chart: W.renderChartWheel, syn: W.renderSynastryWheel };
  var KM = { conj: 'conj', sext: 'sext', sq: 'square', tri: 'trine', opp: 'opp' };
  var PK = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  var NM = { sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ', jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو' };
  var UG = { sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂', jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇' };
  function kind(a) { return (a.asp && a.asp.k) || a.k || ''; }
  function norm(x) { x = x % 360; return x < 0 ? x + 360 : x; }
  function ok(ch) { return ch && ch.known && Array.isArray(ch.cusps) && ch.cusps.length === 12 && isFinite(ch.asc) && window.__swcWheel; }
  function items(ch) {
    var o = [], node = null;
    (ch.bodies || []).forEach(function (b) {
      if (PK.indexOf(b.key) >= 0) o.push({ k: b.key, n: NM[b.key], lon: norm(b.lon), sign: Math.floor(norm(b.lon) / 30), retro: !!b.retro });
      else if (!node && (b.key === 'truenode' || b.key === 'node')) node = { k: 'node', n: 'العقدة الشمالية', lon: norm(b.lon), sign: Math.floor(norm(b.lon) / 30) };
    });
    return { items: o, node: node };
  }
  function asp(list, keys) {
    return (list || []).filter(function (a) { return keys[a.a] && keys[a.b] && KM[kind(a)]; }).sort(function (x, y) { return x.orb - y.orb; }).slice(0, 12);
  }
  function legend(host, rows) {
    var d = document.createElement('div'); d.className = 'aq-wheel-legend';
    rows.forEach(function (r) { var s = document.createElement('span'), i = document.createElement('i'); i.className = r[0]; s.append(i, document.createTextNode(r[1])); d.append(s); });
    host.append(d);
  }
  function make(ch, st, label) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '-4 -4 548 548'); svg.setAttribute('class', 'nd-wheel nd-wheel-sky'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', label);
    svg.innerHTML = window.__swcWheel(st);
    return svg;
  }
  function pt(ch, lon, r) { var a = (180 + (lon - ch.asc)) * Math.PI / 180; return [270 + r * Math.cos(a), 270 - r * Math.sin(a)]; }
  function dot(ch, lon, r, fill, title, glyph) {
    var p = pt(ch, lon, r);
    return '<g><title>' + title + '</title><circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (glyph ? 10 : 6) + '" fill="' + fill + '" stroke="#FFFDF9" stroke-width="1.4"/>' +
      (glyph ? '<text x="' + p[0].toFixed(1) + '" y="' + (p[1] + 4.2).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFDF9" font-family="\'Noto Sans Symbols\',\'Segoe UI Symbol\',serif">' + glyph + '</text>' : '') + '</g>';
  }
  W.renderChartWheel = function (host, chart, aspects, label, opts) {
    if (!host || !ok(chart)) return ORIG.chart.apply(this, arguments);
    try {
      opts = opts || {};
      var it = items(chart), keys = {}; it.items.forEach(function (x) { keys[x.k] = 1; });
      var st = { ch: { asc: chart.asc, mc: chart.mc, cusps: chart.cusps }, items: it.items, node: it.node,
        asp: asp(aspects, keys).map(function (a) { var x = it.items.filter(function (p) { return p.k === a.a; })[0], y = it.items.filter(function (p) { return p.k === a.b; })[0]; return { A: { lon: x.lon, k: x.k }, B: { lon: y.lon, k: y.k }, t: [KM[kind(a)]] }; }) };
      var svg = make(chart, st, label || 'خريطة فلكية');
      var extra = (opts.markers || []).filter(function (m) { return isFinite(m.lon); }).map(function (m) { return dot(chart, m.lon, 214, '#B8892B', m.title || '', ''); }).join('');
      if (extra) svg.insertAdjacentHTML('beforeend', extra);
      host.replaceChildren(svg);
      legend(host, [['a', 'مواضع الكواكب']].concat(opts.markers && opts.markers.length ? [['b', opts.markerLegend || 'نقاط الحدث']] : []).concat([['h', 'اتصال منسجم'], ['c', 'اتصال ضاغط']]));
    } catch (e) { return ORIG.chart.apply(this, arguments); }
  };
  W.renderSynastryWheel = function (host, A, B, aspects, names) {
    if (!host || !ok(A) || !B) return ORIG.syn.apply(this, arguments);
    try {
      var ia = items(A), ib = items(B), ka = {}, kb = {}; ia.items.forEach(function (x) { ka[x.k] = 1; }); ib.items.forEach(function (x) { kb[x.k] = 1; });
      var st = { ch: { asc: A.asc, mc: A.mc, cusps: A.cusps }, items: ia.items, node: ia.node, asp: [] };
      var svg = make(A, st, 'عجلة التوافق');
      var cross = (aspects || []).filter(function (a) { return ka[a.a] && kb[a.b] && KM[kind(a)] && KM[kind(a)] !== 'conj'; }).sort(function (x, y) { return x.orb - y.orb; }).slice(0, 8), lines = '', marks = '';
      cross.forEach(function (a) {
        var x = ia.items.filter(function (p) { return p.k === a.a; })[0], y = ib.items.filter(function (p) { return p.k === a.b; })[0], p1 = pt(A, x.lon, 88), p2 = pt(A, y.lon, 88), hard = kind(a) === 'sq' || kind(a) === 'opp';
        lines += '<line x1="' + p1[0].toFixed(1) + '" y1="' + p1[1].toFixed(1) + '" x2="' + p2[0].toFixed(1) + '" y2="' + p2[1].toFixed(1) + '" stroke="' + (hard ? '#B5233B' : '#1E78A8') + '" stroke-opacity=".7" stroke-width="1.5" stroke-linecap="round"/>';
      });
      ib.items.forEach(function (p) { marks += dot(A, p.lon, 88, '#B8892B', (names && names.b || 'الطرف الثاني') + ' · ' + p.n, UG[p.k]); });
      svg.insertAdjacentHTML('beforeend', lines + marks);
      host.replaceChildren(svg);
      legend(host, [['a', (names && names.a) || 'الطرف الأول · داخل الحلقة'], ['b', (names && names.b) || 'الطرف الثاني · الدوائر الذهبية'], ['h', 'اتصال منسجم'], ['c', 'اتصال ضاغط']]);
    } catch (e) { return ORIG.syn.apply(this, arguments); }
  };
})();
