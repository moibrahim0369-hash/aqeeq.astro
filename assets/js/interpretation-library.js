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
  var VERSION = '20261122-chiron-aspects1';
  var BASE = 'data/interpretations/';

  var SIGN_AR = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var SIGN_EN = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  var HOUSE_AR = ['الذات والمظهر', 'المال والقيم', 'التواصل والتعلم', 'البيت والجذور', 'الإبداع والحب', 'العمل اليومي والعادات',
    'الشراكات والعلاقات', 'التحولات والعمق', 'المعتقد والسفر والمعنى', 'المسار المهني والمكانة', 'الأصدقاء والأحلام', 'العالم الداخلي والعزلة'];
  var ORD = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'];
  var LABEL = { sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ', jupiter: 'المشتري', saturn: 'زحل',
    uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو', north_node: 'العقدة القمرية الشمالية', south_node: 'العقدة القمرية الجنوبية',
    lilith: 'ليليث', fortune: 'نقطة الحظ', chiron: 'كيرون', asc: 'الطالع', dsc: 'الهابط', mc: 'وسط السماء', ic: 'قاع السماء' };
  var PLANETS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  var ASPECT_BODIES = PLANETS.concat(['chiron']);
  var POINTS = ['north_node', 'south_node', 'lilith', 'fortune', 'chiron'];
  var ANGLES = ['asc', 'dsc', 'mc', 'ic'];
  var ORDER = PLANETS.concat(POINTS);
  var ASPECTS = [
    { slug: 'conjunction', n: 'اقتران', ang: 0, orb: 8 }, { slug: 'sextile', n: 'سداسي', ang: 60, orb: 4 },
    { slug: 'square', n: 'تربيع', ang: 90, orb: 6 }, { slug: 'trine', n: 'تثليث', ang: 120, orb: 6 },
    { slug: 'opposition', n: 'مقابلة', ang: 180, orb: 8 }];

  function norm(x) { x = x % 360; return x < 0 ? x + 360 : x; }
  function d180(x) { x = norm(x); return x > 180 ? 360 - x : x; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- المفاتيح ---------- */
  function idCore(body, house) { return 'natal.core.' + body + '.house' + house; }
  /* لون البرج: المفتاح الأساسي حسب الجسم والبرج؛ ويُقبل مفتاح خاص بالبيت يتقدّم عليه إن وُجد */
  function idTint(body, sign, house) { return 'natal.sign_tint.' + body + (house ? '.house' + house : '') + '.' + SIGN_EN[sign]; }
  function idModifier(body, mod, house) { return 'natal.modifier.' + body + (house ? '.house' + house : '') + '.' + mod; }
  function idReference(kind, key) { return 'natal.reference.' + kind + '.' + key; }
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
    var nn = by.true_node || by.truenode || by.node;
    if (nn) {
      item('north_node', nn, nn.lon, nn.house, false);
      item('south_node', nn, nn.lon + 180, nn.house ? ((nn.house + 5) % 12) + 1 : null, false);
    }
    if (by.lilith) item('lilith', by.lilith, by.lilith.lon, by.lilith.house, false);
    if (by.chiron) item('chiron', by.chiron, by.chiron.lon, by.chiron.house, by.chiron.retro);
    if (by.fortune && known) item('fortune', by.fortune, by.fortune.lon, by.fortune.house, false);
    var asp = [];
    for (var i = 0; i < ASPECT_BODIES.length; i++) for (var j = i + 1; j < ASPECT_BODIES.length; j++) {
      var a = items[ASPECT_BODIES[i]], b = items[ASPECT_BODIES[j]]; if (!a || !b) continue;
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
        n: h, lon: norm(ch.cusps[h - 1]), sign: Math.floor(norm(ch.cusps[h - 1]) / 30),
        occupants: PLANETS.filter(function (k) { return items[k] && items[k].house === h; })
      });
    }
    var angles = known ? [['asc', ch.asc], ['dsc', ch.asc + 180], ['mc', ch.mc], ['ic', ch.mc + 180]].map(function (p) {
      return { body: p[0], label: LABEL[p[0]], lon: norm(p[1]), sign: Math.floor(norm(p[1]) / 30) };
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
  function has(ix, ids) { return [].concat(ids).some(function (id) { return ix[id] && ix[id].text; }); }
  function optional(ix, ids, withSummary) { return has(ix, ids) ? entry(ix, ids, withSummary) : ''; }
  function refEntry(ix, kind, key) { return optional(ix, idReference(kind, key), false); }
  function files(m) {
    var f = { reference: 1 };
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
    var out = [], paragraph = [], list = [];
    function flushP() { if (paragraph.length) { out.push('<p>' + paragraph.map(inline).join('<br>') + '</p>'); paragraph = []; } }
    function flushL() { if (list.length) { out.push('<ul class="il-ul">' + list.map(function (l) { return '<li>' + inline(l) + '</li>'; }).join('') + '</ul>'); list = []; } }
    String(t || '').replace(/\r/g, '').split('\n').forEach(function (line) {
      var v = line.trim(), heading = v.match(/^#{1,6}\s+(.+)$/), boldHeading = v.match(/^\*\*([^*]+)\*\*$/);
      if (!v) { flushP(); flushL(); return; }
      if (heading || boldHeading) { flushP(); flushL(); out.push('<h5 class="il-h">' + inline((heading || boldHeading)[1]) + '</h5>'); return; }
      if (/^-\s+/.test(v)) { flushP(); list.push(v.replace(/^-\s+/, '')); return; }
      flushL(); paragraph.push(line);
    });
    flushP(); flushL(); return out.join('');
  }

  function entry(ix, ids, withSummary) {
    ids = [].concat(ids); var id = ids[ids.length - 1], e = null;
    for (var i = 0; i < ids.length && !e; i++) e = ix[ids[i]];
    if (e) return '<div class="il-entry" data-il-id="' + esc(e.id) + '">' + (e.title ? '<h4 class="il-entry-title">' + esc(e.title) + '</h4>' : '') + (withSummary && e.summary ? '<div class="il-sum">' + renderText(e.summary) + '</div>' : '') + '<div class="il-text">' + renderText(e.text) + '</div></div>';
    return SHOW_EMPTY_SLOTS ? '<div class="il-slot" data-il-id="' + esc(id) + '"><span>التفسير المفصّل لهذا الموضع قيد الإعداد.</span></div>' : '';
  }
  function sub(title, body) { return body ? '<div class="il-sub"><h5>' + esc(title) + '</h5>' + body + '</div>' : ''; }
  function det(cls, sum, body, open) { return '<details class="' + cls + '"' + (open ? ' open' : '') + '><summary>' + sum + '</summary><div class="il-body">' + body + '</div></details>'; }
  var CHEV = '<svg class="il-chev" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function bodyBlock(m, ix, key, withHouse, bare) {
    var it = m.items[key], h = '';
    h += sub('عن ' + LABEL[key], refEntry(ix, 'planet', key));
    var where = SIGN_AR[it.sign] + (it.retro ? ' · راجع' : '') + (it.house ? ' · البيت ' + ORD[it.house - 1] : '');
    if (it.house) {
      h += entry(ix, idCore(key, it.house), true);
      h += sub('لون البرج: ' + SIGN_AR[it.sign], entry(ix, [idTint(key, it.sign, it.house), idTint(key, it.sign)], false));
    }
    else h += entry(ix, idSignOnly(key, it.sign), true);
    if (it.house) h += sub(LABEL[key] + ' في برج ' + SIGN_AR[it.sign], optional(ix, idSignOnly(key, it.sign), true));
    h += sub('عن برج ' + SIGN_AR[it.sign], refEntry(ix, 'sign', SIGN_EN[it.sign]));
    if (it.retro) h += sub('الرجعية', entry(ix, it.house ? [idModifier(key, 'retrograde', it.house), idModifier(key, 'retrograde')] : idModifier(key, 'retrograde'), false));
    if (bare) return h;
    return '<article class="il-pl"><h4>' + esc(LABEL[key]) + '<small>' + esc(where) + '</small></h4>' + h + '</article>';
  }

  /* صفوف تفتح النافذة السفلية (chart-sheet.js): الصف يحمل قالبًا فيه نص التفسير بمكانه */
  function svg(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }
  var ASP_ICO = { conjunction: '<circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3"/>', sextile: '<path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/>', square: '<rect x="5" y="5" width="14" height="14"/>', trine: '<path d="M12 4 21 19H3z"/>', opposition: '<circle cx="6.5" cy="12" r="3.5"/><circle cx="17.5" cy="12" r="3.5"/><path d="M10 12h4"/>' };
  var PT_GLYPH = { north_node: '☊', south_node: '☋', lilith: '⚸', fortune: '⊗', chiron: '⚷' };
  var ANG_ABBR = { asc: 'AC', dsc: 'DC', mc: 'MC', ic: 'IC' };
  function tpl(html) { return '<template class="il-content"><div class="il">' + html + '</div></template>'; }
  function row(i, rg, title, mid, rh, content, cls) {
    return '<div class="nd-row il-row" role="button" tabindex="0" style="--i:' + i + '"><span class="nd-rg' + (cls || '') + '">' + rg + '</span><b>' + esc(title) + '</b><span>' + esc(mid) + '</span><span class="nd-rh">' + esc(rh) + '</span>' + tpl(content) + '</div>';
  }
  function rows(list) { return '<div class="nd-rows">' + list.join('') + '</div>'; }

  function sections(m, ix) {
    var S = { aspects: '', points: '', angles: '', note: '', references: '', planetTpl: {}, houseTpl: {} };
    var referenceRows = Object.keys(ix).filter(function (id) {
      return /^natal\.reference\.(asteroids|asteroid_house|element|modality)\./.test(id) || /^natal\.reference\.house_position\.chiron\./.test(id) || id === 'natal.reference.planet.chiron';
    }).sort().map(function (id, i) {
      var e = ix[id];
      return row(i, '◈', e.title || e.summary, 'مرجع عام', '', "<p class=\"il-note\">هذا شرح عام، وليس إثباتًا لوجود هذا الموضع في خريطتك.</p>" + entry(ix, id, true));
    });
    if (referenceRows.length) S.references = det('il-reference-list', 'تصفّح المراجع العامة', rows(referenceRows), false);
    var asps = m.aspects.slice().sort(function (x, y) { return x.orb - y.orb; });
    S.aspects = asps.length ? rows(asps.map(function (a, i) {
      return row(i, svg(ASP_ICO[a.type]), LABEL[a.first] + ' · ' + LABEL[a.second], a.n, 'فارق ' + a.orb.toFixed(1) + '°', sub(a.type === 'conjunction' ? 'معنى الاقتران' : 'معنى الاتصال', refEntry(ix, 'aspect', a.type)) + entry(ix, idAspect(a.first, a.type, a.second), true));
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
    var pts = POINTS.filter(function (k) { return m.items[k] && (m.known || k !== 'fortune'); });
    if (pts.length) S.points = rows(pts.map(function (k, i) {
      var it = m.items[k];
      return row(i, PT_GLYPH[k], LABEL[k], SIGN_AR[it.sign], it.house ? 'البيت ' + it.house : '', bodyBlock(m, ix, k, m.known ? undefined : false, true));
    }));
    if (!m.known) {
      S.note = '<p class="il-note il-addtime">ظهرت لك كواكبك في أبراجها، أما البيوت والطالع فتحتاج ساعة ميلادك. إن عرفتها أضفها، وستظهر لك أقسام جديدة بحياتك الواقعية: العمل والعلاقات والبيت والمال. <button type="button" class="il-addbtn" data-il-addtime>أضف ساعة الميلاد</button></p>';
      return S;
    }
    function sameAngle(H) {
      var key = { 1: 'asc', 4: 'ic', 7: 'dsc', 10: 'mc' }[H.n];
      return m.angles.filter(function (a) { return a.body === key && typeof H.lon === 'number' && typeof a.lon === 'number' && d180(H.lon - a.lon) < 0.0000001; })[0];
    }
    function houseIdentityNote(H) {
      var a = sameAngle(H);
      return a ? '<p class="il-note" data-il-same-position="' + a.body + '">هذه نقطة ' + esc(a.label) + ' نفسها، وليست موضعًا آخر. هنا قراءة رأس البيت، وقراءة المحور متاحة في نظرة عامة.</p>' : '';
    }
    m.houses.forEach(function (H) {
      var st = H.occupants.length >= 3 ? sub('تجمّع في البيت', entry(ix, idStellium('house', H.n), true)) : '';
      var bl = H.occupants.length ? '<div class="il-blend"><h5>إسهامات الكواكب في قراءة هذا البيت</h5>' + H.occupants.map(function (k) { return entry(ix, idBlend(k, H.n), false); }).join('') + '</div>' : '';
      S.houseTpl[H.n] = tpl(houseIdentityNote(H) + sub('عن البيت ' + ORD[H.n - 1], refEntry(ix, 'house', 'house' + H.n)) + sub('رأس البيت في ' + SIGN_AR[H.sign], entry(ix, idCusp(H.n, H.sign), true)) + st + bl);
    });
    S.angles = rows(m.angles.map(function (A, i) {
      var H = m.houses.filter(function (h) { var a = sameAngle(h); return a && a.body === A.body; })[0];
      var note = H ? '<p class="il-note" data-il-same-position="house' + H.n + '">هذا الموضع هو رأس البيت ' + ORD[H.n - 1] + ' نفسه، فلا تعدهما علامتين مستقلتين. قراءة رأس البيت متاحة في تبويب البيوت.</p>' : '';
      return row(i, ANG_ABBR[A.body], A.label, SIGN_AR[A.sign], '', note + entry(ix, idAngle(A.body, A.sign), true), ' nd-hnum');
    }));
    return S;
  }

  /* ---------- نتيجة تقريبية لتاريخ ناقص: كواكب بطيئة في أبراجها فقط (نصوص sign_only) ---------- */
  var GLY = { sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂', jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇' };
  function partial(list) {
    return Promise.all(list.map(function (x) { return load(x.key); }).concat([load('reference')])).then(function (lists) {
      var ix = indexOf(lists);
      return rows(list.map(function (x, i) {
        return row(i, GLY[x.key], LABEL[x.key], SIGN_AR[x.sign], '', sub('عن ' + LABEL[x.key], refEntry(ix, 'planet', x.key)) + entry(ix, idSignOnly(x.key, x.sign), true) + sub('عن برج ' + SIGN_AR[x.sign], refEntry(ix, 'sign', SIGN_EN[x.sign])));
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
    if (po && S.references) po.insertAdjacentHTML('beforeend', "<div class=\"nd-list il-wrap\"><h4 class=\"il-gt\">مراجع إضافية، غير منسوبة لخريطتك</h4>" + S.references + '</div>');
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

  return { partial: partial, boot: boot, build: build, sections: sections, renderText: renderText, indexOf: indexOf, idCore: idCore, idTint: idTint, idModifier: idModifier, idReference: idReference, files: files, idAspect: idAspect, idAngle: idAngle, idCusp: idCusp, idStellium: idStellium, idBlend: idBlend, idSignOnly: idSignOnly,
    SIGN_EN: SIGN_EN, ORDER: ORDER, ANGLES: ANGLES, PLANETS: PLANETS, ASPECT_BODIES: ASPECT_BODIES, POINTS: POINTS, ASPECTS: ASPECTS };
});
