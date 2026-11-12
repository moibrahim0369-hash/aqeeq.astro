/* المخطط الهندي الشمالي (Diamond Chart) بـ SVG + مبدّل التقسيمات D1/D2/D7/D9/D10/D12/D60.
   يقرأ الخريطة النجمية (لاهيري) ويستخدم AqVedic.div لحساب البرج في كل تقسيم. */
(function () {
  'use strict';
  var SG = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var GOLD = '#C5A059', WINE = '#5A1828', CREAM = '#F7F3EB';
  /* الكواكب: المفتاح، الاسم، الاختصار المعروض داخل المخطط */
  var PL = [['sun', 'الشمس', 'شم'], ['moon', 'القمر', 'قم'], ['mars', 'المريخ', 'مر'], ['mercury', 'عطارد', 'عط'], ['jupiter', 'المشتري', 'مش'], ['venus', 'الزهرة', 'زه'], ['saturn', 'زحل', 'زح'], ['node', 'راهو', 'را'], ['ketu', 'كيتو', 'كي']];
  var VARGAS = [
    [1, 'D1', 'الميلاد', 'الخريطة الأم: الجسد والشخصية والمسار العام للحياة.', null],
    [2, 'D2', 'المال', 'علاقتك بالمال: ما تجمعه بجهدك وما يأتيك بالدعم.', 'jupiter'],
    [7, 'D7', 'الأبناء', 'علاقتك بالأبناء والإبداع وما تتركه بعدك.', 'jupiter'],
    [9, 'D9', 'الزواج', 'نضج العلاقات وطبيعة الشريك وما تجنيه في النصف الثاني من العمر. تُقرأ دائماً مع D1.', 'venus'],
    [10, 'D10', 'المهنة', 'طريقك المهني وما تُعرف به وكيف تتعامل مع النجاح.', 'saturn'],
    [12, 'D12', 'الوالدان', 'ما ورثته من والديك وأصلك وأثر البيت الأول.', 'sun'],
    [60, 'D60', 'الكارما', 'الرصيد الأعمق الذي تحمله معك. يتغير كل دقيقتين تقريباً في الطالع فلا يُعتمد عليه إلا مع وقت ميلاد دقيق.', 'moon']
  ];
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
    lagna = known ? D(ch.asc, n) : (moonLon == null ? 0 : D(moonLon, n));
    var items = [];
    PL.forEach(function (p) {
      var lon = bodyLon(ch, p[0]); if (lon == null) return;
      var sg = D(lon, n);
      items.push({ key: p[0], name: p[1], ab: p[2], sign: sg, house: (sg - lagna + 12) % 12, retro: p[0] !== 'node' && p[0] !== 'ketu' && retroOf(ch, p[0]) });
    });
    return { n: n, lagna: lagna, basis: basis, items: items };
  }
  function lines(arr) {
    var out = [], cur = [];
    arr.forEach(function (a) { cur.push(a); if (cur.length === 2) { out.push(cur); cur = []; } });
    if (cur.length) out.push(cur);
    return out;
  }
  /* SVG المخطط: الخطوط ذهبية، الكواكب عنابية، الخلفية كريمية. البيت 1 في الأعلى والترتيب عكس عقارب الساعة. */
  function svg(map, title) {
    var h = '<svg class="vc-svg" viewBox="0 0 400 400" role="img" aria-label="' + esc(title) + '" xmlns="http://www.w3.org/2000/svg">';
    h += '<title>' + esc(title) + '</title><rect x="2" y="2" width="396" height="396" rx="6" fill="' + CREAM + '" stroke="' + GOLD + '" stroke-width="2.5"/>';
    h += '<g fill="none" stroke="' + GOLD + '" stroke-width="1.6" stroke-linejoin="round"><path d="M2 2L398 398M398 2L2 398"/><path d="M200 2L398 200L200 398L2 200Z"/></g>';
    for (var i = 0; i < 12; i++) {
      var sg = (map.lagna + i) % 12, c = CENTERS[i], np = NUMPOS[i];
      h += '<text x="' + np[0] + '" y="' + np[1] + '" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="' + GOLD + '" font-weight="700">' + (sg + 1) + '</text>';
      var here = map.items.filter(function (x) { return x.house === i; }).map(function (x) { return x.ab + (x.retro ? '℞' : ''); });
      if (i === 0) here.unshift(map.basis === 'asc' ? 'ل' : 'ل*');
      var ls = lines(here), fs = ls.length > 3 ? 15 : 19, lh = fs + 3, y0 = c[1] - (ls.length - 1) * lh / 2;
      ls.forEach(function (row, r) {
        h += '<text x="' + c[0] + '" y="' + (y0 + r * lh) + '" text-anchor="middle" dominant-baseline="middle" font-size="' + fs + '" font-weight="700" fill="' + WINE + '" direction="rtl">' + esc(row.join('  ')) + '</text>';
      });
    }
    return h + '</svg>';
  }
  function houseRows(map) {
    return map.items.map(function (x) {
      return '<li><b>' + esc(x.name) + (x.retro ? ' ℞' : '') + '</b><span>' + SG[x.sign] + '</span><em>البيت ' + (x.house + 1) + '</em></li>';
    }).join('');
  }
  function mount(host, ch, natal) {
    if (!host || !window.AqVedic) return;
    var cur = 9;
    function draw() {
      var v = VARGAS.filter(function (x) { return x[0] === cur; })[0], map = build(ch, cur), title = 'مخطط ' + v[1] + ' · ' + v[2];
      var sig = v[4] ? map.items.filter(function (x) { return x.key === v[4]; })[0] : null;
      var chips = VARGAS.map(function (x) { return '<button type="button" class="vc-chip' + (x[0] === cur ? ' on' : '') + '" data-n="' + x[0] + '" aria-pressed="' + (x[0] === cur) + '"><b>' + x[1] + '</b><span>' + x[2] + '</span></button>'; }).join('');
      var note = map.basis === 'asc' ? 'الطالع في ' + SG[map.lagna] + '.' : 'وقت الميلاد غير معروف، فالمخطط يبدأ من برج القمر (' + SG[map.lagna] + ') بدل الطالع.';
      host.innerHTML = '<h4>المخططات الفيدية · التقسيمات</h4><div class="vc-chips" role="group" aria-label="اختيار التقسيم">' + chips + '</div>' +
        '<p class="vc-intro"><b>' + esc(v[1] + ' · ' + v[2]) + '</b><br>' + esc(v[3]) + '</p>' +
        '<div class="vc-chartwrap">' + svg(map, title) + '</div>' +
        '<p class="vc-note">' + esc(note) + ' الأرقام الذهبية أرقام البروج (1 الحمل ... 12 الحوت)، والبيت 1 في الأعلى ويمضي الترتيب عكس عقارب الساعة. ℞ يعني راجع.</p>' +
        '<ul class="vc-rows">' + houseRows(map) + '</ul>' +
        (sig ? '<p class="vc-sig">' + esc(sig.name) + ' الدال هنا في ' + SG[sig.sign] + ' (البيت ' + (sig.house + 1) + ').</p>' : '');
      host.querySelectorAll('.vc-chip').forEach(function (b) { b.addEventListener('click', function () { cur = +b.dataset.n; draw(); }); });
    }
    draw();
  }
  window.AqVedicChart = { mount: mount, build: build, svg: svg, VARGAS: VARGAS, PL: PL };
})();
