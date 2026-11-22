/* محرك دورات العبور الشخصية: بداية ونهاية وذروة كل دورة من خريطة الميلاد. حساب فقط. */
(function () {
  'use strict';
  var DAY = 864e5, STEP = 4;
  var T = { jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو', truenode: 'العقدة الشمالية', chiron: 'كيرون' };
  var N = { sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ', jupiter: 'المشتري', saturn: 'زحل', asc: 'الطالع', mc: 'وسط السماء', desc: 'الهابط', ic: 'قاع السماء' };
  var ASP = [{ d: 0, k: 'conj', n: 'اقتران' }, { d: 60, k: 'sext', n: 'تسديس' }, { d: 90, k: 'sq', n: 'تربيع' }, { d: 120, k: 'tri', n: 'تثليث' }, { d: 180, k: 'opp', n: 'مقابلة' }];
  var SIGNS = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  /* مجال كل نقطة في الخريطة */
  var ONLY = { truenode: ['conj', 'opp'] };
  var DOM = { sun: ['self'], moon: ['self', 'work'], mercury: ['self', 'work'], venus: ['love'], mars: ['work', 'love'], jupiter: ['self'], saturn: ['work'], asc: ['self', 'love'], mc: ['work'], desc: ['love'], ic: ['work'] };
  var norm = function (x) { return ((x % 360) + 360) % 360; };
  var cache = {};
  function pos(ms) {
    var k = Math.round(ms / DAY / STEP), c = cache[k]; if (c) return c;
    var ch = Astro.chart({ utcMs: k * STEP * DAY, lat: 30, lon: 31, known: false }), o = {};
    ch.bodies.forEach(function (b) { if (T[b.key]) o[b.key] = norm(b.lon); });
    return (cache[k] = o);
  }
  function natalPoints(ch) {
    var o = {}; ch.bodies.forEach(function (b) { if (N[b.key]) o[b.key] = norm(b.lon); });
    if (ch.asc != null) { o.asc = norm(ch.asc); o.desc = norm(ch.asc + 180); }
    if (ch.mc != null) { o.mc = norm(ch.mc); o.ic = norm(ch.mc + 180); }
    return o;
  }
  function orbOf(a, b, deg) { var d = Math.abs(((a - b + 540) % 360) - 180); return Math.abs(d - deg); }
  /* كل دورات العبور حول تاريخ محدد (من -3 إلى +3 سنوات) */
  function cycles(natal, center) {
    var pts = natalPoints(natal); delete pts.desc; delete pts.ic;
    var CX = window.AqeeqChironExtensions, chironPts = {}, chironAspects = ASP;
    if (CX) { var cp = CX.positions(natal, true); Object.keys(cp).forEach(function(k){chironPts[k]=cp[k].lon;}); chironAspects = CX.MAJOR.concat(CX.MINOR).map(function(a){return {d:a.angle,k:({conjunction:'conj',sextile:'sext',square:'sq',trine:'tri',opposition:'opp'})[a.key]||a.key,n:a.label};}); }
    else chironPts = pts;
    var from = center - 3 * 365 * DAY, to = center + 3 * 365 * DAY, runs = {}, out = [], chironCoverage = { first: Infinity, last: -Infinity };
    from = Math.ceil(from / (STEP * DAY)) * STEP * DAY;
    for (var ms = from; ms <= to; ms += STEP * DAY) {
      var p = pos(ms);
      if (Number.isFinite(p.chiron)) { chironCoverage.first = Math.min(chironCoverage.first, ms); chironCoverage.last = Math.max(chironCoverage.last, ms); }
      for (var tk in p) {
       var targetPts = tk === 'chiron' ? chironPts : pts, aspectList = tk === 'chiron' ? chironAspects : ASP;
       for (var nk in targetPts) {
        if (tk === nk && tk !== 'chiron') continue;
        for (var i = 0; i < aspectList.length; i++) {
          if (ONLY[tk] && ONLY[tk].indexOf(aspectList[i].k) < 0) continue;
          var o = orbOf(p[tk], targetPts[nk], aspectList[i].d); if (o > 2) continue;
          var id = tk + '|' + aspectList[i].k + '|' + nk, r = runs[id] || (runs[id] = []);
          r.push({ ms: ms, o: o });
        }
       }
      }
    }
    for (var id2 in runs) {
      var s = id2.split('|'), r2 = runs[id2], grp = [r2[0]], g = [];
      for (var j = 1; j < r2.length; j++) { if (r2[j].ms - r2[j - 1].ms > 160 * DAY) { g.push(grp); grp = []; } grp.push(r2[j]); }
      g.push(grp);
      g.forEach(function (x) {
        var start = x[0].ms, end = x[x.length - 1].ms;
        if (start <= from + STEP * DAY || end >= to - STEP * DAY) return;          /* دورة مقطوعة الطرف: نتجاهلها */
        // A table edge is missing data, not an observed beginning or ending of a cycle.
        if (s[0] === 'chiron' && (start <= chironCoverage.first + STEP * DAY || end >= chironCoverage.last - STEP * DAY)) return;
        var peaks = [], cur = null;
        x.forEach(function (q) { if (q.o <= 0.6) { if (!cur) peaks.push(cur = { a: q.ms, b: q.ms }); else cur.b = q.ms; } else cur = null; });
        var asp = (s[0] === 'chiron' ? chironAspects : ASP).filter(function (a) { return a.k === s[1]; })[0];
        out.push({ id: id2, t: s[0], asp: s[1], n: s[2], tn: T[s[0]], an: asp.n, nn: (CX && CX.LABELS[s[2]]) || N[s[2]], doms: DOM[s[2]] || ['self'], start: start, end: end, peaks: peaks });
      });
    }
    return out.sort(function (a, b) { return a.start - b.start; });
  }
  function placements(natal) {
    var pts = natalPoints(natal), keys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'asc', 'mc', 'desc', 'ic'];
    return keys.filter(function (k) { return pts[k] != null; }).map(function (k) { return { id: k, nn: N[k], sign: SIGNS[Math.floor(pts[k] / 30)], dom: DOM[k][0] }; });
  }
  window.AqeeqYou = { cycles: cycles, placements: placements, T: T, N: N };
})();
