/* المخطط الهندي الشمالي (Diamond Chart) بـ SVG + مبدّل التقسيمات D1/D2/D7/D9/D10/D12/D60.
   يقرأ الخريطة النجمية (لاهيري) ويستخدم AqVedic.div لحساب البرج في كل تقسيم. */
(function () {
  'use strict';
  var SG = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var GOLD = '#C5A059', WINE = '#5A1828', CREAM = '#F7F3EB';
  /* الكواكب: المفتاح، الاسم، الاختصار المعروض داخل المخطط */
  var PL = [['sun', 'الشمس', 'شم'], ['moon', 'القمر', 'قم'], ['mars', 'المريخ', 'مر'], ['mercury', 'عطارد', 'عط'], ['jupiter', 'المشتري', 'مش'], ['venus', 'الزهرة', 'زه'], ['saturn', 'زحل', 'زح'], ['node', 'راهو', 'را'], ['ketu', 'كيتو', 'كي']];
  var VARGAS = [
    ['moon', 'خريطة القمر', 'العقل', 'نفس برجك الفيدي لكن البيوت تُعدّ من القمر: تُظهر مشاعرك وردود فعلك وما يهدّئك.', 'moon'],
    ['sun', 'خريطة الشمس', 'الروح', 'البيوت تُعدّ من الشمس: تُظهر جوهرك وحضورك وما تحتاجه لتشعر بقيمتك.', 'sun'],
    [1, 'D1', 'الميلاد', 'الخريطة الأم: الجسد والشخصية والمسار العام للحياة.', null],
    [2, 'D2', 'المال', 'علاقتك بالمال: ما تجمعه بجهدك وما يأتيك بالدعم.', 'jupiter'],
    [3, 'D3', 'الإخوة', 'علاقتك بإخوتك وبشجاعتك ومبادراتك ومهاراتك العملية.', 'mars'],
    [4, 'D4', 'البيت', 'السكن والعقار وما يمنحك الشعور بالأمان والاستقرار.', 'moon'],
    [5, 'D5', 'النفوذ', 'مكانتك وتأثيرك بين الناس وما تحصل عليه من احترام.', 'sun'],
    [6, 'D6', 'الضغوط', 'ما يرهقك ويشدّ أعصابك في الحياة اليومية وكيف تتعامل معه.', 'mars'],
    [7, 'D7', 'الأبناء', 'علاقتك بالأبناء والإبداع وما تتركه بعدك.', 'jupiter'],
    [8, 'D8', 'التحولات', 'المفاجآت وما يتغير في حياتك دفعة واحدة وكيف تمرّ منه.', 'saturn'],
    [9, 'D9', 'الزواج', 'نضج العلاقات وطبيعة الشريك وما تجنيه في النصف الثاني من العمر. تُقرأ دائماً مع D1.', 'venus'],
    [10, 'D10', 'المهنة', 'طريقك المهني وما تُعرف به وكيف تتعامل مع النجاح.', 'saturn'],
    [11, 'D11', 'المكاسب', 'ما يأتيك دون ترتيب مسبق وما يحميك من صراعاتك. هذه الخريطة ليست من الست عشرة الكلاسيكية عند باراشارا، وتختلف قاعدة حسابها بين المدارس، فاقرأها كعدسة إضافية وليست حكمًا.', 'jupiter'],
    [12, 'D12', 'الوالدان', 'ما ورثته من والديك وأصلك وأثر البيت الأول.', 'sun'],
    [16, 'D16', 'الراحة', 'المركبات والرفاهية والمتع المادية في حياتك.', 'venus'],
    [20, 'D20', 'الروح', 'نموك الروحي وعلاقتك بالعبادة والتأمل والصفاء الداخلي.', 'jupiter'],
    [24, 'D24', 'التعليم', 'الدراسة والمعرفة والشهادات وكيف تتعلم وتنجح فيها.', 'mercury'],
    [27, 'D27', 'القوة', 'قوتك وتحملك وما يحتاج منك رعاية في طاقتك الجسدية.', 'mars'],
    [30, 'D30', 'التحديات', 'الضغوط والاختبارات الخفية وما يتعبك دون أن يظهر للناس.', 'saturn'],
    [40, 'D40', 'خط الأم', 'ما انتقل إليك من جهة الأم من إرث نفسي وعائلي.', 'moon'],
    [45, 'D45', 'خط الأب', 'ما انتقل إليك من جهة الأب من إرث وأخلاق وقيم.', 'sun'],
    [60, 'D60', 'الكارما', 'الرصيد الأعمق الذي تحمله معك. يتغير كل دقيقتين تقريباً في الطالع فلا يُعتمد عليه إلا مع وقت ميلاد دقيق.', 'moon']
  ];
  var ORIG = { moon: 'Chandra', sun: 'Surya', 1: 'Rasi', 2: 'Hora', 5: 'Panchamsa', 6: 'Shashthamsa', 8: 'Ashtamsa', 11: 'Rudramsa', 3: 'Drekkana', 4: 'Chaturthamsa', 7: 'Saptamsa', 9: 'Navamsa', 10: 'Dasamsa', 12: 'Dwadasamsa', 16: 'Shodasamsa', 20: 'Vimsamsa', 24: 'Siddhamsa', 27: 'Bhamsa', 30: 'Trimsamsa', 40: 'Khavedamsa', 45: 'Akshavedamsa', 60: 'Shashtiamsa' };
  /* الرسم الجنوبي: البروج ثابتة في أماكنها (الحمل ثاني خلية في الصف الأول) ويمضي الترتيب مع عقارب الساعة */
  var SOUTH = { 11: [0, 0], 0: [1, 0], 1: [2, 0], 2: [3, 0], 3: [3, 1], 4: [3, 2], 5: [3, 3], 6: [2, 3], 7: [1, 3], 8: [0, 3], 9: [0, 2], 10: [0, 1] };
  var SPEC = [5, 6, 8, 11];
  var CENTERS = [[200, 92], [100, 40], [40, 100], [92, 200], [40, 300], [100, 360], [200, 308], [300, 360], [360, 300], [308, 200], [360, 100], [300, 40]];
  var NUMPOS = [[200, 150], [100, 20], [18, 98], [150, 200], [18, 306], [100, 392], [200, 252], [300, 392], [382, 306], [250, 200], [382, 98], [300, 20]];
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(x) { return ((x % 360) + 360) % 360; }
  function bodyLon(ch, key) {
    var list = ch.bodies || [], i, k;
    if (key === 'ketu') { var n = bodyLon(ch, 'node'); return n == null ? null : norm(n + 180); }
    for (i = 0; i < list.length; i++) { k = String(list[i].key).toLowerCase(); if (k === key) return list[i].lon; }
    if (key === 'node') for (i = 0; i < list.length; i++) if (String(list[i].key).toLowerCase() === 'truenode') return list[i].lon;
    return null;
  }
  function retroOf(ch, key) {
    var list = ch.bodies || [];
    for (var i = 0; i < list.length; i++) if (String(list[i].key).toLowerCase() === key) return !!list[i].retro;
    return key === 'node' || key === 'ketu';
  }
  /* يبني خريطة التقسيم n: برج الطالع (أو القمر عند غياب الوقت) وكل كوكب مع برجه وبيته */
  function build(ch, n) {
    var D = window.AqVedic.div, known = !!ch.known, lagna, basis = known ? 'asc' : 'moon';
    var moonLon = bodyLon(ch, 'moon');
    if (n === 'moon' || n === 'sun') { /* خريطة القمر/الشمس: نفس أبراج D1 والطالع هو برج القمر/الشمس */
      var bl = bodyLon(ch, n), sg0 = bl == null ? 0 : D(bl, 1); lagna = sg0; basis = n;
      var its = [];
      PL.forEach(function (p) { var lon = bodyLon(ch, p[0]); if (lon == null) return; var sg = D(lon, 1); its.push({ lon: lon, key: p[0], name: p[1], ab: p[2], sign: sg, house: (sg - lagna + 12) % 12, retro: p[0] !== 'node' && p[0] !== 'ketu' && retroOf(ch, p[0]) }); });
      return { n: n, lagna: lagna, basis: basis, items: its };
    }
    lagna = known ? D(ch.asc, n) : (moonLon == null ? 0 : D(moonLon, n));
    var items = [];
    PL.forEach(function (p) {
      var lon = bodyLon(ch, p[0]); if (lon == null) return;
      var sg = D(lon, n);
      items.push({ lon: lon, key: p[0], name: p[1], ab: p[2], sign: sg, house: (sg - lagna + 12) % 12, retro: p[0] !== 'node' && p[0] !== 'ketu' && retroOf(ch, p[0]) });
    });
    return { n: n, lagna: lagna, basis: basis, items: items };
  }
  function lagLbl(m) { return m.n === 'moon' || m.n === 'sun' ? 'ط' : m.basis === 'asc' ? 'ط' : 'ط*'; }
  function lines(arr) {
    var out = [], cur = [];
    arr.forEach(function (a) { cur.push(a); if (cur.length === 2) { out.push(cur); cur = []; } });
    if (cur.length) out.push(cur);
    return out;
  }
  /* لون كل كوكب: نور أخضر، ظل أحمر، شمس ذهبية، الطالع عنابي */
  var TONE = { sun: 'g', moon: 'n', mercury: 'n', venus: 'n', jupiter: 'n', mars: 's', saturn: 's', node: 's', ketu: 's', lagna: 'l' };
  var TCOL = { g: ['#F8EBCB', '#C5A059', '#6E5319'], n: ['#E4F0E1', '#7FA67D', '#2F5A32'], s: ['#F8E2DE', '#C9786E', '#8E2A22'], l: ['#6A2038', '#C5A059', '#FFF3D6'] };
  function pill(x, y, w, label, tone, retro) {
    var c = TCOL[tone] || TCOL.g;
    return '<g><rect x="' + (x - w / 2) + '" y="' + (y - 10) + '" width="' + w + '" height="20" rx="10" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="1.3"/>' +
      '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" font-size="12.5" font-weight="800" fill="' + c[2] + '">' + esc(label) + (retro ? '<tspan font-size="9" dy="-4">℞</tspan>' : '') + '</text></g>';
  }
  /* SVG المخطط: كل كوكب في كبسولة ملونة، الأرقام الذهبية أرقام البروج. البيت 1 في الأعلى والترتيب عكس عقارب الساعة. */
  function svg(map, title) {
    var h = '<svg class="vc-svg" viewBox="0 0 400 400" role="img" aria-label="' + esc(title) + '" xmlns="http://www.w3.org/2000/svg">';
    h += '<title>' + esc(title) + '</title><rect x="2" y="2" width="396" height="396" rx="6" fill="' + CREAM + '" stroke="' + GOLD + '" stroke-width="2.5"/>';
    h += '<g fill="none" stroke="' + GOLD + '" stroke-width="1.6" stroke-linejoin="round"><path d="M2 2L398 398M398 2L2 398"/><path d="M200 2L398 200L200 398L2 200Z"/></g>';
    for (var i = 0; i < 12; i++) {
      var sg = (map.lagna + i) % 12, c = CENTERS[i], np = NUMPOS[i];
      h += '<text x="' + np[0] + '" y="' + np[1] + '" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="' + GOLD + '" font-weight="700">' + (sg + 1) + '</text>';
      var here = map.items.filter(function (x) { return x.house === i; }).map(function (x) { return { t: x.ab, tone: TONE[x.key] || 'g', r: x.retro }; });
      if (i === 0) here.unshift({ t: lagLbl(map), tone: 'l', r: false });
      var k = here.length, cols = k > 3 ? 2 : 1, rows = Math.ceil(k / cols), w = 36, gx = 40, gy = 23;
      here.forEach(function (it, j) {
        var col = cols === 1 ? 0 : j % 2, row = cols === 1 ? j : Math.floor(j / 2);
        var px = c[0] + (cols === 1 ? 0 : (col === 0 ? -gx / 2 : gx / 2)), py = c[1] + (row - (rows - 1) / 2) * gy;
        h += pill(px, py, w, it.t, it.tone, it.r);
      });
    }
    return h + '</svg>';
  }
  function svgSouth(map, title) {
    var C = 100, h = '<svg class="vc-svg" viewBox="0 0 400 400" role="img" aria-label="' + esc(title) + '" xmlns="http://www.w3.org/2000/svg">';
    h += '<title>' + esc(title) + '</title><rect x="2" y="2" width="396" height="396" rx="6" fill="' + CREAM + '" stroke="' + GOLD + '" stroke-width="2.5"/>';
    h += '<rect x="102" y="102" width="196" height="196" fill="#FBF6EA" stroke="' + GOLD + '" stroke-width="1.2"/>';
    h += '<g fill="none" stroke="' + GOLD + '" stroke-width="1.6"><path d="M102 2V398M202 2V102M202 298V398M298 2V398M2 102H398M2 202H102M298 202H398M2 298H398"/></g>';
    for (var sg = 0; sg < 12; sg++) {
      var pos = SOUTH[sg], x0 = pos[0] * C + 2, y0 = pos[1] * C + 2, cx = x0 + 48, house = (sg - map.lagna + 12) % 12;
      h += '<text x="' + (x0 + 8) + '" y="' + (y0 + 14) + '" font-size="11" fill="' + GOLD + '" font-weight="700">' + (sg + 1) + '</text>';
      var here = map.items.filter(function (x) { return x.sign === sg; }).map(function (x) { return { t: x.ab, tone: TONE[x.key] || 'g', r: x.retro }; });
      if (house === 0) {
        here.unshift({ t: lagLbl(map), tone: 'l', r: false });
        h += '<path d="M' + x0 + ' ' + (y0 + 26) + 'L' + (x0 + 26) + ' ' + y0 + '" stroke="' + WINE + '" stroke-width="2.2" fill="none"/>';
      }
      var k = here.length, cols = k > 2 ? 2 : 1, rows = Math.ceil(k / cols), w = 34, gx = 40, gy = 22, top = y0 + 52 - (rows - 1) * gy / 2 + 6;
      here.forEach(function (it, j) {
        var col = cols === 1 ? 0 : j % 2, row = cols === 1 ? j : Math.floor(j / 2);
        h += pill(cx + (cols === 1 ? 0 : (col === 0 ? -gx / 2 : gx / 2)), top + row * gy, w, it.t, it.tone, it.r);
      });
    }
    h += '<text x="200" y="196" text-anchor="middle" font-size="17" font-weight="800" fill="' + WINE + '">' + esc(map.n === 'moon' ? 'القمر' : map.n === 'sun' ? 'الشمس' : 'D' + map.n) + '</text>';
    h += '<text x="200" y="220" text-anchor="middle" font-size="12" fill="' + GOLD + '" letter-spacing="1">' + esc(ORIG[map.n] || '') + '</text>';
    return h + '</svg>';
  }
  /* رموز وضع الخبير الصامتة: تظهر للأدمن بعد فتح القفل فقط */
  function codesFor(map, x) {
    var c = [], h = x.house + 1, mal = { mars: 1, saturn: 1, node: 1, ketu: 1 }[x.key];
    if ((map.n === 6 && (h === 6 || h === 8 || h === 12)) || (map.n === 1 && h === 6)) c.push('M-06');
    if (map.n === 30 && (h === 6 || h === 8 || h === 12 || (mal && (h === 1 || h === 4 || h === 7 || h === 10)))) c.push('K-30');
    if (h === 8) c.push('T-08');
    if (h === 12 || (map.n === 2 && h === 6)) c.push('D-12');
    return c;
  }
  var EXA = { sun: 0, moon: 1, mars: 9, mercury: 5, jupiter: 3, venus: 11, saturn: 6, node: 1, ketu: 7 };
  var OWN = { sun: [4], moon: [3], mars: [0, 7], mercury: [2, 5], jupiter: [8, 11], venus: [1, 6], saturn: [9, 10] };
  var COMB = { moon: 12, mars: 17, mercury: 14, jupiter: 11, venus: 10, saturn: 15 };
  var SIGNLORD = ['mars', 'venus', 'mercury', 'moon', 'sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'];
  var ASP = { mars: [4, 7, 8], jupiter: [5, 7, 9], saturn: [3, 7, 10], node: [5, 7, 9], ketu: [5, 7, 9] };
  function dignity(x) {
    if (EXA[x.key] === x.sign) return ['ex', 'مرتفع'];
    if (EXA[x.key] != null && (EXA[x.key] + 6) % 12 === x.sign) return ['db', 'هابط'];
    if (OWN[x.key] && OWN[x.key].indexOf(x.sign) >= 0) return ['ow', 'في برجه'];
    return null;
  }
  function degTxt(lon) { var d = ((lon % 30) + 30) % 30, g = Math.floor(d), m = Math.floor((d - g) * 60); return g + '°' + (m < 10 ? '0' : '') + m + '′'; }
  function detail(map, x) {
    var parts = [], dg = dignity(x), T = window.AqVedic && window.AqVedic.T, d1 = map.n === 1 || map.n === 'moon' || map.n === 'sun';
    if (d1 && x.lon != null) {
      parts.push('<i class="vc-dg">' + degTxt(x.lon) + '</i>');
      var u = 360 / 27, ni = Math.floor(x.lon / u) % 27, pd = Math.floor((x.lon % u) / (u / 4)) + 1;
      if (T && T.NK && T.NK[ni]) parts.push('<i class="vc-nk">' + T.NK[ni][0] + ' · ' + pd + '</i>');
    }
    if (d1 && x.lon != null && COMB[x.key]) {
      var su = map.items.filter(function (y) { return y.key === 'sun'; })[0];
      if (su && su.lon != null) { var df = Math.abs(((x.lon - su.lon + 540) % 360) - 180); df = 180 - df; var orb = COMB[x.key] - (x.retro && (x.key === 'mercury' || x.key === 'venus') ? 2 : 0); if (df <= orb) parts.push('<i class="vc-dn vc-dn-db">محترق</i>'); }
    }
    if (dg) parts.push('<i class="vc-dn vc-dn-' + dg[0] + '">' + dg[1] + '</i>');
    return parts.length ? '<span class="vc-dt">' + parts.join('') + '</span>' : '';
  }
  function houseRows(map) {
    return map.items.map(function (x) {
      var tn = TONE[x.key] || 'g';
      return '<li class="vc-r vc-t-' + tn + '"><span class="vc-ab">' + esc(x.ab) + '</span><b>' + esc(x.name) + (x.retro ? ' ℞' : '') + '</b><span class="vc-sg">' + SG[x.sign] + ' · البيت ' + (x.house + 1) + '</span>' + detail(map, x) + (window.AqVedicExpert && window.AqVedicExpert.on ? '<span class="vc-codes">' + codesFor(map, x).map(function (k) { return '<em class="vc-code">[' + k + ']</em>'; }).join('') + '</span>' : '') + '</li>';
    }).join('');
  }
  function extras(map) {
    var by = {}, SGn = window.AqVedic && window.AqVedic.T ? window.AqVedic.T.SG : [];
    map.items.forEach(function (x) { by[x.key] = x; });
    var lords = '';
    for (var h = 0; h < 12; h++) {
      var sg = (map.lagna + h) % 12, lk = SIGNLORD[sg], lp = by[lk];
      lords += '<li><b>البيت ' + (h + 1) + '</b><span>' + SG[sg] + '</span><em>' + (lp ? esc(lp.name) + ' في البيت ' + (lp.house + 1) : '') + '</em></li>';
    }
    var asp = map.items.map(function (x) {
      var hs = (ASP[x.key] || [7]).map(function (n) { return (x.house + n - 1) % 12; });
      var tg = map.items.filter(function (y) { return y.key !== x.key && hs.indexOf(y.house) >= 0; }).map(function (y) { return esc(y.name); });
      return '<li><b>' + esc(x.name) + '</b><span>ينظر إلى البيوت ' + hs.map(function (v) { return v + 1; }).sort(function (a, b) { return a - b; }).join('، ') + '</span><em>' + (tg.length ? tg.join('، ') : 'لا كواكب هناك') + '</em></li>';
    }).join('');
    return '<details class="vc-ext"><summary>حكام البيوت</summary><ul class="vc-xl">' + lords + '</ul></details>' +
      '<details class="vc-ext"><summary>النظرات (غراها دريشتي)</summary><ul class="vc-xl">' + asp + '</ul></details>';
  }
  function mount(host, ch, natal, only) {
    if (!host || !window.AqVedic) return;
    var cur = only === undefined ? 1 : only, style = 'n';
    try { style = localStorage.getItem('aq-vedic-style') === 's' ? 's' : 'n'; } catch (e) {}
    function draw() {
      var v = VARGAS.filter(function (x) { return x[0] === cur; })[0], map = build(ch, cur), title = 'مخطط ' + v[1] + ' · ' + v[2];
      var sig = v[4] ? map.items.filter(function (x) { return x.key === v[4]; })[0] : null;
      var chipOf = function (x) { return '<button type="button" class="vc-chip' + (x[0] === cur ? ' on' : '') + '" data-n="' + x[0] + '" aria-pressed="' + (x[0] === cur) + '"><b>' + String(x[1]).replace('خريطة ', '') + '</b><span>' + x[2] + '</span><small>' + (ORIG[x[0]] || '') + '</small></button>'; };
      var GR = [['الأساس', ['1', 'moon', 'sun']], ['الحياة اليومية', ['2', '3', '4', '5', '6', '7']], ['المسار والعمق', ['8', '9', '10', '11', '12']], ['التخصص الدقيق', ['16', '20', '24', '27', '30', '40', '45', '60']]];
      var chipsAll = GR.map(function (g) {
        return '<h5 class="vc-sub">' + g[0] + '</h5><div class="vc-grp' + (g[1].length === 3 ? ' vc-grp3' : '') + '" role="group" aria-label="' + g[0] + '">' + g[1].map(function (k) { var x = VARGAS.filter(function (y) { return String(y[0]) === k; })[0]; return x ? chipOf(x) : ''; }).join('') + '</div>';
      }).join('');
      var note = (cur === 'moon' || cur === 'sun') ? 'البيت الأول هنا هو برج ' + (cur === 'moon' ? 'القمر' : 'الشمس') + ' (' + SG[map.lagna] + ').' : map.basis === 'asc' ? 'الطالع في ' + SG[map.lagna] + '.' : 'وقت الميلاد غير معروف، فالمخطط يبدأ من برج القمر (' + SG[map.lagna] + ') بدل الطالع.';
      host.innerHTML = (only === undefined ? '<h4>المخططات الفيدية · التقسيمات</h4>' + chipsAll : '') +
        '<p class="vc-intro"><b>' + esc(v[1] + ' · ' + v[2]) + '</b> <small class="vc-orig">' + esc(ORIG[cur] || '') + '</small><br>' + esc(v[3]) + '</p>' +
        '<div class="vc-styles" role="group" aria-label="شكل الرسم"><button type="button" class="vc-st' + (style === 'n' ? ' on' : '') + '" data-s="n">شمالي</button><button type="button" class="vc-st' + (style === 's' ? ' on' : '') + '" data-s="s">جنوبي</button></div>' +
        '<div class="vc-chartwrap">' + (style === 's' ? svgSouth(map, title) : svg(map, title)) + '</div>' +
        '<p class="vc-note">' + esc(note) + (style === 's' ? ' في الرسم الجنوبي كل برج له مكان ثابت (الحمل ثاني خانة في الصف الأعلى) ويمضي الترتيب مع عقارب الساعة، والخط المائل يعلّم خانة الطالع. ℞ يعني راجع.' : ' الأرقام الذهبية أرقام البروج (1 الحمل ... 12 الحوت)، والبيت 1 في الأعلى ويمضي الترتيب عكس عقارب الساعة. ℞ يعني راجع.') + '</p>' +
        '<p class="vc-key"><i class="vc-t-n">نور</i><i class="vc-t-s">ظل</i><i class="vc-t-g">الشمس</i><i class="vc-t-l">الطالع</i></p><ul class="vc-rows">' + houseRows(map) + '</ul>' + extras(map) +
        (sig ? '<p class="vc-sig">' + esc(sig.name) + ' الدال هنا في ' + SG[sig.sign] + ' (البيت ' + (sig.house + 1) + ').</p>' : '');
      host.querySelectorAll('.vc-st').forEach(function (b) { b.addEventListener('click', function () { style = b.dataset.s; try { localStorage.setItem('aq-vedic-style', style); } catch (e) {} draw(); }); });
      host.querySelectorAll('.vc-chip').forEach(function (b) { b.addEventListener('click', function () { cur = isNaN(+b.dataset.n) ? b.dataset.n : +b.dataset.n; draw(); var on = host.querySelector('.vc-chip.on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest', inline: 'center' }); }); });
    }
    host.__draw = draw;
    draw();
  }
  window.AqVedicChart = { mount: mount, build: build, svg: svg, VARGAS: VARGAS, PL: PL, svgSouth: svgSouth, codesFor: codesFor };
})();
