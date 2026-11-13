/* مكتبة التفسيرات: طبقة عرض للخريطة الفلكية. لا تحسب شيئًا ولا تغيّر المحرك.
   تقرأ مواضع الخريطة (AqeeqChartContext) وتبحث عن النص بالمفتاح في data/interpretations/<body>.json.
   المعتمد فقط (status = approved) يُعرض نصه. غير الموجود أو المسودة يظهر كخانة فارغة بمفتاحها
   ما دام SHOW_EMPTY_SLOTS = true (اقلبه إلى false عند الإطلاق). المواصفات: data/interpretations/README.md */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.AqeeqInterpretations = api; if (typeof document !== 'undefined') api.boot(); }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var SHOW_EMPTY_SLOTS = true;
  var VERSION = '20261113d';
  var BASE = 'data/interpretations/';

  var SIGN_AR = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var SIGN_EN = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  var HOUSE_AR = ['الذات والمظهر', 'المال والقيم', 'التواصل والتعلم', 'البيت والجذور', 'الإبداع والحب', 'العمل اليومي والعادات',
    'الشراكات والعلاقات', 'التحولات والعمق', 'المعتقد والسفر والمعنى', 'المسار المهني والمكانة', 'الأصدقاء والأحلام', 'العالم الداخلي والعزلة'];
  var ORD = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'];
  var LABEL = { sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ', jupiter: 'المشتري', saturn: 'زحل',
    uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو', north_node: 'العقدة القمرية الشمالية', south_node: 'العقدة القمرية الجنوبية',
    lilith: 'ليليث', fortune: 'نقطة الحظ', asc: 'الطالع', dsc: 'الهابط', mc: 'وسط السماء', ic: 'قاع السماء' };
  var PLANETS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  var POINTS = ['north_node', 'south_node', 'lilith', 'fortune'];
  var ANGLES = ['asc', 'dsc', 'mc', 'ic'];
  var ORDER = PLANETS.concat(POINTS);
  var ASPECTS = [
    { slug: 'conjunction', n: 'اتصال', ang: 0, orb: 8 }, { slug: 'sextile', n: 'سداسي', ang: 60, orb: 4 },
    { slug: 'square', n: 'تربيع', ang: 90, orb: 6 }, { slug: 'trine', n: 'تثليث', ang: 120, orb: 6 },
    { slug: 'opposition', n: 'مقابلة', ang: 180, orb: 8 }];

  function norm(x) { x = x % 360; return x < 0 ? x + 360 : x; }
  function d180(x) { x = norm(x); return x > 180 ? 360 - x : x; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- المفاتيح ---------- */
  function idCore(body, house) { return 'natal.core.' + body + '.house' + house; }
  /* لون البرج: المفتاح الأساسي حسب الجسم والبرج؛ ويُقبل مفتاح خاص بالبيت يتقدّم عليه إن وُجد */
  function idTint(body, sign, house) { return 'natal.sign_tint.' + body + (house ? '.house' + house : '') + '.' + SIGN_EN[sign]; }
  function idModifier(body, mod) { return 'natal.modifier.' + body + '.' + mod; }
  function idAspect(first, type, second) { return 'natal.aspect.' + first + '.' + type + '.' + second; }
  function idCusp(house, sign) { return 'natal.house_cusp.house' + house + '.' + SIGN_EN[sign]; }
  function idSignOnly(body, sign) { return 'natal.sign_only.' + body + '.' + SIGN_EN[sign]; }
  function idAngle(angle, sign) { return 'natal.angle.' + angle + '.' + SIGN_EN[sign]; }

  /* ---------- نموذج الخريطة ---------- */
  function build(S) {
    var ch = S && S.ch; if (!ch) return null;
    var by = {}; ch.bodies.forEach(function (b) { by[b.key] = b; });
    var known = !!ch.known, items = {};
    function item(key, src, lon, house, retro) {
      var sign = Math.floor(norm(lon) / 30);
      items[key] = { body: key, label: LABEL[key], lon: norm(lon), sign: sign, house: known ? house : null, retro: !!retro };
    }
    PLANETS.forEach(function (k) { if (by[k]) item(k, by[k], by[k].lon, by[k].house, by[k].retro); });
    var nn = by.truenode || by.node;
    if (nn) {
      item('north_node', nn, nn.lon, nn.house, false);
      item('south_node', nn, nn.lon + 180, nn.house ? ((nn.house + 5) % 12) + 1 : null, false);
    }
    if (by.lilith) item('lilith', by.lilith, by.lilith.lon, by.lilith.house, false);
    if (by.fortune && known) item('fortune', by.fortune, by.fortune.lon, by.fortune.house, false);
    var asp = [];
    for (var i = 0; i < PLANETS.length; i++) for (var j = i + 1; j < PLANETS.length; j++) {
      var a = items[PLANETS[i]], b = items[PLANETS[j]]; if (!a || !b) continue;
      var diff = d180(a.lon - b.lon);
      for (var t = 0; t < ASPECTS.length; t++) {
        var A = ASPECTS[t], lim = A.orb + ((a.body === 'sun' || a.body === 'moon' || b.body === 'sun' || b.body === 'moon') ? 1 : 0);
        var o = Math.abs(diff - A.ang);
        if (o <= lim) { asp.push({ first: a.body, second: b.body, type: A.slug, n: A.n, orb: o }); break; }
      }
    }
    var houses = [];
    if (known) for (var h = 1; h <= 12; h++) {
      houses.push({
        n: h, sign: Math.floor(norm(ch.cusps[h - 1]) / 30),
        occupants: PLANETS.filter(function (k) { return items[k] && items[k].house === h; })
      });
    }
    var angles = known ? [['asc', ch.asc], ['dsc', ch.asc + 180], ['mc', ch.mc], ['ic', ch.mc + 180]].map(function (p) {
      return { body: p[0], label: LABEL[p[0]], sign: Math.floor(norm(p[1]) / 30) };
    }) : [];
    return { known: known, items: items, aspects: asp, houses: houses, angles: angles };
  }

  /* ---------- الفهرس والتحميل ---------- */
  var cache = {};
  function files(m) {
    var f = {};
    Object.keys(m.items).forEach(function (k) { f[k] = 1; });
    m.angles.forEach(function (a) { f[a.body] = 1; });
    if (m.known) f.house_cusp = 1;
    return Object.keys(f);
  }
  function load(body) {
    if (cache[body]) return cache[body];
    cache[body] = fetch(BASE + body + '.json?v=' + VERSION).then(function (r) { return r.ok ? r.json() : []; })
      .then(function (a) { return Array.isArray(a) ? a : []; }, function () { return []; });
    return cache[body];
  }
  function indexOf(lists) {
    var ix = {};
    lists.forEach(function (arr) {
      arr.forEach(function (e) { if (e && e.id && e.status === 'approved' && e.text) ix[e.id] = e; });
    });
    return ix;
  }

  /* ---------- عرض النص: ** ** عناوين، "- " قوائم، سطر فارغ بين الفقرات ---------- */
  function inline(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); }
  function renderText(t) {
    return String(t || '').replace(/\r/g, '').split(/\n{2,}/).map(function (para) {
      var lines = para.split('\n').filter(function (l) { return l.trim(); });
      if (!lines.length) return '';
      if (lines.length === 1 && /^\*\*[^*]+\*\*$/.test(lines[0].trim())) return '<h5 class="il-h">' + esc(lines[0].trim().slice(2, -2)) + '</h5>';
      if (lines.every(function (l) { return /^\s*-\s+/.test(l); })) return '<ul class="il-ul">' + lines.map(function (l) { return '<li>' + inline(l.replace(/^\s*-\s+/, '')) + '</li>'; }).join('') + '</ul>';
      return '<p>' + lines.map(inline).join('<br>') + '</p>';
    }).join('');
  }

  function entry(ix, ids, withSummary) {
    ids = [].concat(ids); var id = ids[ids.length - 1], e = null;
    for (var i = 0; i < ids.length && !e; i++) e = ix[ids[i]];
    if (e) return '<div class="il-entry" data-il-id="' + esc(id) + '">' + (withSummary && e.summary ? '<p class="il-sum">' + esc(e.summary) + '</p>' : '') + '<div class="il-text">' + renderText(e.text) + '</div></div>';
    return SHOW_EMPTY_SLOTS ? '<div class="il-slot" data-il-id="' + esc(id) + '"><span>النص قيد الكتابة</span><code dir="ltr">' + esc(id) + '</code></div>' : '';
  }
  function sub(title, body) { return body ? '<div class="il-sub"><h5>' + esc(title) + '</h5>' + body + '</div>' : ''; }
  function det(cls, sum, body, open) { return '<details class="' + cls + '"' + (open ? ' open' : '') + '><summary>' + sum + '</summary><div class="il-body">' + body + '</div></details>'; }
  var CHEV = '<svg class="il-chev" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function bodyBlock(m, ix, key, withHouse) {
    var it = m.items[key], h = '';
    var where = SIGN_AR[it.sign] + (it.retro ? ' · راجع' : '') + (it.house ? ' · البيت ' + ORD[it.house - 1] : '');
    if (it.house) {
      h += entry(ix, idCore(key, it.house), true);
      h += sub('لون البرج: ' + SIGN_AR[it.sign], entry(ix, [idTint(key, it.sign, it.house), idTint(key, it.sign)], false));
    }
    else if (withHouse === false) h += entry(ix, idSignOnly(key, it.sign), true);
    if (it.retro) h += sub('الرجعية', entry(ix, idModifier(key, 'retrograde'), false));
    var mine = m.aspects.filter(function (a) { return a.first === key || a.second === key; });
    if (mine.length) {
      h += '<div class="il-asps"><h5>الجوانب</h5>' + mine.map(function (a) {
        var other = a.first === key ? a.second : a.first;
        var title = LABEL[key] + ' ' + a.n + ' ' + LABEL[other];
        return det('il-asp', '<span>' + esc(title) + '</span><em dir="ltr">' + a.orb.toFixed(1) + '°</em>' + CHEV, entry(ix, idAspect(a.first, a.type, a.second), true));
      }).join('') + '</div>';
    }
    return '<article class="il-pl"><h4>' + esc(LABEL[key]) + '<small>' + esc(where) + '</small></h4>' + h + '</article>';
  }

  function render(m, ix) {
    var out = '';
    if (!m.known) {
      var ks = PLANETS.filter(function (k) { return m.items[k]; });
      out += '<section class="il-group"><h4 class="il-gt">الكواكب في أبراجها</h4>' + ks.map(function (k) {
        var it = m.items[k], edge = k === 'moon' && Math.min(it.lon % 30, 30 - (it.lon % 30)) < 7;
        var extra = edge ? '<p class="il-note">القمر يقطع نحو ثلاث عشرة درجة في اليوم، وموضعه هنا قريب من حدّ برجين، فبرجه الدقيق يحتاج ساعة ميلادك.</p>' : '';
        return det('il-house il-simple', '<span class="il-ht"><strong>' + esc(LABEL[k]) + ' في ' + esc(SIGN_AR[it.sign]) + '</strong>' + (it.retro ? '<small>راجع</small>' : '') + '</span>' + CHEV, extra + bodyBlock(m, ix, k, false));
      }).join('') + '</section>';
      out += '<p class="il-note il-addtime">ظهرت لك كواكبك في أبراجها، أما البيوت والطالع فتحتاج ساعة ميلادك. إن عرفتها أضفها، وستظهر لك أقسام جديدة بحياتك الواقعية: العمل والعلاقات والبيت والمال. <button type="button" class="il-addbtn" data-il-addtime>أضف ساعة الميلاد</button></p>';
      return out;
    }
    out += '<section class="il-group"><h4 class="il-gt">البيوت الاثنا عشر</h4>' + m.houses.map(function (H) {
      var chips = H.occupants.length ? H.occupants.map(function (k) { return '<i>' + esc(LABEL[k]) + '</i>'; }).join('') : '<i class="il-empty">بيت خالٍ من الكواكب</i>';
      var sum = '<b class="il-num">' + H.n + '</b><span class="il-ht"><strong>البيت ' + ORD[H.n - 1] + ' · ' + esc(HOUSE_AR[H.n - 1]) + '</strong><small>' + esc(SIGN_AR[H.sign]) + ' على رأس البيت</small><span class="il-chips">' + chips + '</span></span>' + CHEV;
      var body = sub('رأس البيت في ' + SIGN_AR[H.sign], entry(ix, idCusp(H.n, H.sign), true)) + H.occupants.map(function (k) { return bodyBlock(m, ix, k); }).join('');
      return det('il-house', sum, body);
    }).join('') + '</section>';

    out += '<section class="il-group"><h4 class="il-gt">الزوايا</h4>' + m.angles.map(function (A) {
      return det('il-house il-simple', '<span class="il-ht"><strong>' + esc(A.label) + ' في ' + esc(SIGN_AR[A.sign]) + '</strong></span>' + CHEV, entry(ix, idAngle(A.body, A.sign), true));
    }).join('') + '</section>';

    var pts = POINTS.filter(function (k) { return m.items[k]; });
    if (pts.length) out += '<section class="il-group"><h4 class="il-gt">العقد القمرية والنقاط الحساسة</h4>' + pts.map(function (k) {
      var it = m.items[k];
      return det('il-house il-simple', '<span class="il-ht"><strong>' + esc(LABEL[k]) + '</strong><small>' + esc(SIGN_AR[it.sign] + (it.house ? ' · البيت ' + ORD[it.house - 1] : '')) + '</small></span>' + CHEV, bodyBlock(m, ix, k));
    }).join('') + '</section>';
    return out;
  }

  /* ---------- الربط بالصفحة ---------- */
  function mount(S) {
    var res = document.getElementById('result'); if (!res || !S) return;
    var m = build(S); if (!m) return;
    Promise.all(files(m).map(load)).then(function (lists) {
      var ix = indexOf(lists), old = document.getElementById('il-root');
      if (old) old.remove();
      var sec = document.createElement('section'); sec.id = 'il-root'; sec.className = 'il'; sec.setAttribute('dir', 'rtl');
      sec.innerHTML = render(m, ix);
      res.appendChild(sec);
      var ab = sec.querySelector('[data-il-addtime]');
      if (ab) ab.addEventListener('click', function () { var e = document.querySelector('.nd-edit'); if (e) e.click(); });
    });
  }
  function boot() {
    window.addEventListener('aqeeq:chart-rendered', function (e) {
      setTimeout(function () { mount(e.detail || (window.AqeeqChartContext && window.AqeeqChartContext.getNatal())); }, 120);
    });
  }

  return { boot: boot, build: build, render: render, renderText: renderText, indexOf: indexOf, idCore: idCore, idTint: idTint, idModifier: idModifier, idAspect: idAspect, idAngle: idAngle, idCusp: idCusp, idSignOnly: idSignOnly,
    SIGN_EN: SIGN_EN, ORDER: ORDER, ANGLES: ANGLES, PLANETS: PLANETS, POINTS: POINTS, ASPECTS: ASPECTS };
});
