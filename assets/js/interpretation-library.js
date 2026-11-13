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
  var VERSION = '20261114b';
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
  function idStellium(kind, v) { return 'natal.stellium.' + (kind === 'house' ? 'house' + v : SIGN_EN[v]); }
  function idBlend(planet, house) { return 'natal.house_blend.' + planet + '.house' + house; }
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
    var stel = { houses: [], signs: [] };
    houses.forEach(function (H) { if (H.occupants.length >= 3) stel.houses.push(H.n); });
    for (var sg = 0; sg < 12; sg++) {
      var inSign = PLANETS.filter(function (k) { return items[k] && items[k].sign === sg; });
      if (inSign.length >= 3) stel.signs.push({ sign: sg, bodies: inSign });
    }
    return { known: known, items: items, aspects: asp, houses: houses, angles: angles, stellium: stel };
  }

  /* ---------- الفهرس والتحميل ---------- */
  var cache = {};
  function files(m) {
    var f = {};
    Object.keys(m.items).forEach(function (k) { f[k] = 1; });
    m.angles.forEach(function (a) { f[a.body] = 1; });
    if (m.known) { f.house_cusp = 1; f.house_blend = 1; }
    if (m.stellium.houses.length || m.stellium.signs.length) f.stellium = 1;
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

  function bodyBlock(m, ix, key, withHouse, bare) {
    var it = m.items[key], h = '';
    var where = SIGN_AR[it.sign] + (it.retro ? ' · راجع' : '') + (it.house ? ' · البيت ' + ORD[it.house - 1] : '');
    if (it.house) {
      h += entry(ix, idCore(key, it.house), true);
      h += sub('لون البرج: ' + SIGN_AR[it.sign], entry(ix, [idTint(key, it.sign, it.house), idTint(key, it.sign)], false));
    }
    else if (withHouse === false) h += entry(ix, idSignOnly(key, it.sign), true);
    if (it.retro) h += sub('الرجعية', entry(ix, idModifier(key, 'retrograde'), false));
    if (bare) return h;
    return '<article class="il-pl"><h4>' + esc(LABEL[key]) + '<small>' + esc(where) + '</small></h4>' + h + '</article>';
  }

  /* صفوف تفتح النافذة السفلية (chart-sheet.js): الصف يحمل قالبًا فيه نص التفسير بمكانه */
  function svg(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }
  var ASP_ICO = { conjunction: '<circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3"/>', sextile: '<path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/>', square: '<rect x="5" y="5" width="14" height="14"/>', trine: '<path d="M12 4 21 19H3z"/>', opposition: '<circle cx="6.5" cy="12" r="3.5"/><circle cx="17.5" cy="12" r="3.5"/><path d="M10 12h4"/>' };
  var PT_GLYPH = { north_node: '☊', south_node: '☋', lilith: '⚸', fortune: '⊗' };
  var ANG_ABBR = { asc: 'AC', dsc: 'DC', mc: 'MC', ic: 'IC' };
  function tpl(html) { return '<template class="il-content"><div class="il">' + html + '</div></template>'; }
  function row(i, rg, title, mid, rh, content, cls) {
    return '<div class="nd-row il-row" role="button" tabindex="0" style="--i:' + i + '"><span class="nd-rg' + (cls || '') + '">' + rg + '</span><b>' + esc(title) + '</b><span>' + esc(mid) + '</span><span class="nd-rh">' + esc(rh) + '</span>' + tpl(content) + '</div>';
  }
  function rows(list) { return '<div class="nd-rows">' + list.join('') + '</div>'; }

  function sections(m, ix) {
    var S = { aspects: '', points: '', angles: '', note: '', planetTpl: {}, houseTpl: {} };
    var asps = m.aspects.slice().sort(function (x, y) { return x.orb - y.orb; });
    S.aspects = asps.length ? rows(asps.map(function (a, i) {
      return row(i, svg(ASP_ICO[a.type]), LABEL[a.first] + ' · ' + LABEL[a.second], a.n, 'فارق ' + a.orb.toFixed(1) + '°', entry(ix, idAspect(a.first, a.type, a.second), true));
    })) : '';
    PLANETS.forEach(function (k) {
      var it = m.items[k]; if (!it) return;
      var extra = '';
      if (!m.known && k === 'moon' && Math.min(it.lon % 30, 30 - (it.lon % 30)) < 7) extra = '<p class="il-note">القمر يقطع نحو ثلاث عشرة درجة في اليوم، وموضعه هنا قريب من حدّ برجين، فبرجه الدقيق يحتاج ساعة ميلادك.</p>';
      S.planetTpl[k] = tpl(extra + bodyBlock(m, ix, k, m.known ? undefined : false, true));
    });
    S.stelSigns = m.stellium.signs.length ? rows(m.stellium.signs.map(function (g, i) {
      return row(i, svg('<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" stroke-dasharray="2 3"/>'), 'تجمّع في ' + SIGN_AR[g.sign], g.bodies.length + ' كواكب', '', entry(ix, idStellium('sign', g.sign), true));
    })).replace(/class="nd-row il-row"/g, 'class="nd-row il-row il-st"') : '';
    if (!m.known) {
      S.note = '<p class="il-note il-addtime">ظهرت لك كواكبك في أبراجها، أما البيوت والطالع فتحتاج ساعة ميلادك. إن عرفتها أضفها، وستظهر لك أقسام جديدة بحياتك الواقعية: العمل والعلاقات والبيت والمال. <button type="button" class="il-addbtn" data-il-addtime>أضف ساعة الميلاد</button></p>';
      return S;
    }
    m.houses.forEach(function (H) {
      var st = H.occupants.length >= 3 ? sub('تجمّع في البيت', entry(ix, idStellium('house', H.n), true)) : '';
      var bl = H.occupants.length ? '<div class="il-blend">' + H.occupants.map(function (k) { return entry(ix, idBlend(k, H.n), false); }).join('') + '</div>' : '';
      S.houseTpl[H.n] = tpl(sub('رأس البيت في ' + SIGN_AR[H.sign], entry(ix, idCusp(H.n, H.sign), true)) + st + bl);
    });
    S.angles = rows(m.angles.map(function (A, i) {
      return row(i, ANG_ABBR[A.body], A.label, SIGN_AR[A.sign], '', entry(ix, idAngle(A.body, A.sign), true), ' nd-hnum');
    }));
    var pts = POINTS.filter(function (k) { return m.items[k]; });
    if (pts.length) S.points = rows(pts.map(function (k, i) {
      var it = m.items[k];
      return row(i, PT_GLYPH[k], LABEL[k], SIGN_AR[it.sign], it.house ? 'البيت ' + it.house : '', bodyBlock(m, ix, k, undefined, true));
    }));
    return S;
  }

  /* ---------- نتيجة تقريبية لتاريخ ناقص: كواكب بطيئة في أبراجها فقط (نصوص sign_only) ---------- */
  var GLY = { sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂', jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇' };
  function partial(list) {
    return Promise.all(list.map(function (x) { return load(x.key); })).then(function (lists) {
      var ix = indexOf(lists);
      return rows(list.map(function (x, i) {
        return row(i, GLY[x.key], LABEL[x.key], SIGN_AR[x.sign], '', entry(ix, idSignOnly(x.key, x.sign), true));
      }));
    });
  }

  /* ---------- الربط بالصفحة ---------- */
  function listWrap(html) { return '<div class="nd-list il-wrap">' + html + '</div>'; }
  function inject(S, tries) {
    var box = document.querySelector('#result .nd-root');
    if (!box) { if (tries < 15) setTimeout(function () { inject(S, tries + 1); }, 150); else ready(); return; }
    box.querySelectorAll('.il-wrap,.il-content,.il-pointhead').forEach(function (n) { n.remove(); });
    var P = function (n) { return box.querySelector('[data-nd-panel="' + n + '"]'); };
    var ph = P('houses'), pp = P('planets'), pa = P('aspects'), po = P('overview');
    if (pp) pp.querySelectorAll('.nd-row').forEach(function (r) {
      var nm = ((r.querySelector('b') || {}).textContent || '').replace(/\s*R\s*$/, '').trim();
      var key = Object.keys(LABEL).filter(function (k) { return LABEL[k] === nm; })[0];
      if (key && S.planetTpl[key]) r.insertAdjacentHTML('beforeend', S.planetTpl[key]);
    });
    if (ph) ph.querySelectorAll('.nd-row').forEach(function (r, i) { if (S.houseTpl[i + 1]) r.insertAdjacentHTML('beforeend', S.houseTpl[i + 1]); });
    if (pa) pa.innerHTML = S.aspects || '<p class="nd-warn">لا جوانب رئيسية ضمن الحدود المعتادة.</p>';
    if (pp && S.points) pp.insertAdjacentHTML('beforeend', '<h4 class="il-gt il-pointhead">العقد القمرية والنقاط الحساسة</h4>' + S.points);
    if (pp && S.note) pp.insertAdjacentHTML('beforeend', '<div class="il-wrap">' + S.note + '</div>');
    if (po && S.angles) {
      var card = [].slice.call(po.querySelectorAll('.nd-card')).filter(function (c) { return /محاور/.test((c.querySelector('h4') || {}).textContent || ''); })[0];
      var html = '<div class="nd-list il-wrap"><h4 class="il-gt">محاور الخريطة</h4>' + S.angles + '</div>';
      if (card) card.outerHTML = html; else po.insertAdjacentHTML('beforeend', html);
    }
    if (po && S.stelSigns) po.insertAdjacentHTML('beforeend', '<div class="nd-list il-wrap"><h4 class="il-gt">تجمّع الكواكب</h4>' + S.stelSigns + '</div>');
    var ab = box.querySelector('[data-il-addtime]');
    if (ab) ab.addEventListener('click', function () { var e = document.querySelector('.nd-edit'); if (e) e.click(); });
    ready();
  }
  function ready() { if (typeof window.AqeeqResultReady === 'function') window.AqeeqResultReady(); }
  function mount(S) {
    if (!document.getElementById('result') || !S) return;
    var m = build(S); if (!m) { ready(); return; }
    Promise.all(files(m).map(load)).then(function (lists) {
      inject(sections(m, indexOf(lists)), 0);
    });
  }
  function boot() {
    window.addEventListener('aqeeq:chart-rendered', function (e) {
      setTimeout(function () { mount(e.detail || (window.AqeeqChartContext && window.AqeeqChartContext.getNatal())); }, 120);
    });
  }

  return { partial: partial, boot: boot, build: build, sections: sections, renderText: renderText, indexOf: indexOf, idCore: idCore, idTint: idTint, idModifier: idModifier, idAspect: idAspect, idAngle: idAngle, idCusp: idCusp, idStellium: idStellium, idBlend: idBlend, idSignOnly: idSignOnly,
    SIGN_EN: SIGN_EN, ORDER: ORDER, ANGLES: ANGLES, PLANETS: PLANETS, POINTS: POINTS, ASPECTS: ASPECTS };
});
