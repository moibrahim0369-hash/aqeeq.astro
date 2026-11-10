/* خريطة السماء العالمية: لحظة سماء لأي تاريخ ووقت ومدينة في العالم (ليست خريطة شخصية).
   تقرأ من محرك Astro الموجود نفسه. الكارت في صفحة السماء يعرض العجلة والقمر والكواكب، وزر العرض يفتح صفحة #world بالتفاصيل الكاملة. */
(function () {
  'use strict';
  var form = document.getElementById('swc-form'), svg = document.getElementById('swc-svg');
  if (!form || !svg || form.dataset.init === '1') return;
  form.dataset.init = '1';

  var GROUPS = [
    ['الشرق الأوسط', [
      ['القاهرة', 30.0444, 31.2357, 'Africa/Cairo'], ['الإسكندرية', 31.2001, 29.9187, 'Africa/Cairo'],
      ['الرياض', 24.7136, 46.6753, 'Asia/Riyadh'], ['مكة المكرمة', 21.3891, 39.8579, 'Asia/Riyadh'], ['جدة', 21.4858, 39.1925, 'Asia/Riyadh'],
      ['دبي', 25.2048, 55.2708, 'Asia/Dubai'], ['أبوظبي', 24.4539, 54.3773, 'Asia/Dubai'], ['الدوحة', 25.2854, 51.531, 'Asia/Qatar'],
      ['الكويت', 29.3759, 47.9774, 'Asia/Kuwait'], ['المنامة', 26.2285, 50.586, 'Asia/Bahrain'], ['مسقط', 23.588, 58.3829, 'Asia/Muscat'],
      ['بغداد', 33.3152, 44.3661, 'Asia/Baghdad'], ['عمّان', 31.9454, 35.9284, 'Asia/Amman'], ['بيروت', 33.8938, 35.5018, 'Asia/Beirut'],
      ['دمشق', 33.5138, 36.2765, 'Asia/Damascus'], ['القدس', 31.7683, 35.2137, 'Asia/Jerusalem'], ['طهران', 35.6892, 51.389, 'Asia/Tehran'], ['إسطنبول', 41.0082, 28.9784, 'Europe/Istanbul']]],
    ['أفريقيا', [
      ['الخرطوم', 15.5007, 32.5599, 'Africa/Khartoum'], ['طرابلس', 32.8872, 13.1913, 'Africa/Tripoli'], ['تونس', 36.8065, 10.1815, 'Africa/Tunis'],
      ['الجزائر', 36.7538, 3.0588, 'Africa/Algiers'], ['الرباط', 34.0209, -6.8416, 'Africa/Casablanca'], ['لاغوس', 6.5244, 3.3792, 'Africa/Lagos'],
      ['نيروبي', -1.2921, 36.8219, 'Africa/Nairobi'], ['أديس أبابا', 9.03, 38.74, 'Africa/Addis_Ababa'], ['جوهانسبرغ', -26.2041, 28.0473, 'Africa/Johannesburg']]],
    ['أوروبا', [
      ['لندن', 51.5074, -0.1278, 'Europe/London'], ['باريس', 48.8566, 2.3522, 'Europe/Paris'], ['برلين', 52.52, 13.405, 'Europe/Berlin'],
      ['مدريد', 40.4168, -3.7038, 'Europe/Madrid'], ['روما', 41.9028, 12.4964, 'Europe/Rome'], ['أمستردام', 52.3676, 4.9041, 'Europe/Amsterdam'],
      ['موسكو', 55.7558, 37.6173, 'Europe/Moscow'], ['أثينا', 37.9838, 23.7275, 'Europe/Athens']]],
    ['آسيا', [
      ['كراتشي', 24.8607, 67.0011, 'Asia/Karachi'], ['نيودلهي', 28.6139, 77.209, 'Asia/Kolkata'], ['مومباي', 19.076, 72.8777, 'Asia/Kolkata'],
      ['دكا', 23.8103, 90.4125, 'Asia/Dhaka'], ['بانكوك', 13.7563, 100.5018, 'Asia/Bangkok'], ['جاكرتا', -6.2088, 106.8456, 'Asia/Jakarta'],
      ['سنغافورة', 1.3521, 103.8198, 'Asia/Singapore'], ['بكين', 39.9042, 116.4074, 'Asia/Shanghai'], ['هونغ كونغ', 22.3193, 114.1694, 'Asia/Hong_Kong'],
      ['سيول', 37.5665, 126.978, 'Asia/Seoul'], ['طوكيو', 35.6762, 139.6503, 'Asia/Tokyo']]],
    ['الأمريكتان', [
      ['نيويورك', 40.7128, -74.006, 'America/New_York'], ['واشنطن', 38.9072, -77.0369, 'America/New_York'], ['شيكاغو', 41.8781, -87.6298, 'America/Chicago'],
      ['دنفر', 39.7392, -104.9903, 'America/Denver'], ['لوس أنجلوس', 34.0522, -118.2437, 'America/Los_Angeles'], ['تورنتو', 43.6532, -79.3832, 'America/Toronto'],
      ['مكسيكو سيتي', 19.4326, -99.1332, 'America/Mexico_City'], ['بوغوتا', 4.711, -74.0721, 'America/Bogota'], ['ساو باولو', -23.5505, -46.6333, 'America/Sao_Paulo'],
      ['بوينس آيرس', -34.6037, -58.3816, 'America/Argentina/Buenos_Aires']]],
    ['أوقيانوسيا', [['سيدني', -33.8688, 151.2093, 'Australia/Sydney'], ['أوكلاند', -36.8485, 174.7633, 'Pacific/Auckland']]]
  ];
  var CITIES = [];
  GROUPS.forEach(function (g) { g[1].forEach(function (c) { CITIES.push(c); }); });
  var SIGNS_AR = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var EL = [['نار', 0], ['تراب', 1], ['هواء', 2], ['ماء', 3]], MODS = ['كاردينال', 'ثابت', 'متحول'];
  var SIGN_EL = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3], SIGN_MOD = [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2];
  var PL = [['sun', 'الشمس'], ['moon', 'القمر'], ['mercury', 'عطارد'], ['venus', 'الزهرة'], ['mars', 'المريخ'], ['jupiter', 'المشتري'], ['saturn', 'زحل'], ['uranus', 'أورانوس'], ['neptune', 'نبتون'], ['pluto', 'بلوتو']];
  var PHASES = [[348.75, 'محاق'], [11.25, 'هلال متزايد'], [78.75, 'التربيع الأول'], [101.25, 'أحدب متزايد'], [168.75, 'بدر'], [191.25, 'أحدب متناقص'], [258.75, 'التربيع الأخير'], [281.25, 'هلال متناقص']];
  var HOUSE_AR = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'];
  var HOUSE_AREA = ['الشخصية وشكل الظهور', 'المال والإحساس بالقيمة', 'التواصل والتنقلات القريبة', 'البيت والعائلة والجذور', 'الحب والمتعة والإبداع', 'العمل اليومي والصحة', 'الشراكات والعلاقات', 'التحولات والمشاركات العميقة', 'السفر والمعرفة والفلسفة', 'المسار المهني والمكانة', 'الصداقات والأحلام', 'العزلة والباطن والخفايا'];
  var ASP = [['conj', 0, 'اقتران', 8], ['sext', 60, 'تسديس', 5], ['square', 90, 'تربيع', 6], ['trine', 120, 'تثليث', 6], ['opp', 180, 'مقابلة', 7]];
  var NODE_G = 'M4 18h5a6 6 0 1 1 6 0h5';
  var GLY = {};
  var $ = function (id) { return document.getElementById(id); };
  var dateI = $('swc-date'), timeI = $('swc-time'), citySel = $('swc-city'), capEl = $('swc-cap'), moonEl = $('swc-moon'), gridEl = $('swc-pgrid'), hintEl = $('swc-hint'), errEl = $('swc-err');
  var live = true, cur = null, sel = null;

  var ci = 0; GROUPS.forEach(function (g) { var og = document.createElement('optgroup'); og.label = g[0]; g[1].forEach(function (c) { var o = document.createElement('option'); o.value = ci++; o.textContent = c[0]; og.appendChild(o); }); citySel.appendChild(og); });
  function mod(x) { return ((x % 360) + 360) % 360; }
  function p2(n) { return (n < 10 ? '0' : '') + n; }
  function nowLocal(c) {
    var f = new Intl.DateTimeFormat('en-GB', { timeZone: c[3], year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }), o = {};
    f.formatToParts(new Date()).forEach(function (x) { o[x.type] = +x.value; });
    return { y: o.year, m: o.month, d: o.day, hh: o.hour, mm: o.minute };
  }
  function setInputs(t) { dateI.value = t.y + '-' + p2(t.m) + '-' + p2(t.d); timeI.value = p2(t.hh) + ':' + p2(t.mm); }
  function addDays(t, n) { var d = new Date(Date.UTC(t.y, t.m - 1, t.d + n, t.hh, t.mm)); return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), hh: d.getUTCHours(), mm: d.getUTCMinutes() }; }
  function dm(lon) { var d = Math.floor(mod(lon) % 30), m = Math.floor((mod(lon) % 1) * 60); return d + '°' + p2(m) + '′'; }
  function phaseName(el) { var n = PHASES[0][1]; for (var i = 1; i < PHASES.length; i++) if (el >= PHASES[i][0]) n = PHASES[i][1]; if (el >= 348.75) n = PHASES[0][1]; return n; }
  function path(k, cls, sw) { var d = k === 'node' ? NODE_G : GLY[k]; return d ? '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>' : ''; }
  function wd(st) { return ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][new Date(Date.UTC(st.y, st.m - 1, st.d)).getUTCDay()]; }
  function dateTxt(st) { return wd(st) + ' ' + st.d + '/' + st.m + '/' + st.y + ' · ' + p2(st.hh) + ':' + p2(st.mm) + ' بتوقيت ' + st.city[0]; }

  function compute() {
    var A = window.Astro; if (!A || typeof A.chart !== 'function') throw new Error('engine');
    GLY = window.AqeeqGL || GLY;
    var c = CITIES[+citySel.value] || CITIES[0], v = dateI.value, tv = timeI.value;
    if (!v || !tv) throw new Error('empty');
    var dp = v.split('-').map(Number), tp = tv.split(':').map(Number);
    if (dp[0] < 1900 || dp[0] > 2100) throw new Error('range');
    var utc = A.localToUtcMs(dp[0], dp[1], dp[2], tp[0], tp[1], c[3]);
    var ch = A.chart({ utcMs: utc, lat: c[1], lon: c[2], hs: 'placidus', known: true });
    var items = PL.map(function (p) { var b = null; for (var j = 0; j < ch.bodies.length; j++) if (ch.bodies[j].key === p[0]) b = ch.bodies[j]; return b ? { k: p[0], n: p[1], lon: mod(b.lon), retro: !!b.retro, sign: Math.floor(mod(b.lon) / 30), house: b.house } : null; }).filter(Boolean);
    var nb = null; for (var q = 0; q < ch.bodies.length; q++) if (ch.bodies[q].key === 'node') nb = ch.bodies[q];
    var node = nb ? { k: 'node', n: 'العقدة القمرية الشمالية', lon: mod(nb.lon), retro: false, sign: Math.floor(mod(nb.lon) / 30), house: nb.house } : null;
    var asp = [];
    for (var i = 0; i < items.length; i++) for (var j2 = i + 1; j2 < items.length; j2++) {
      var d = Math.abs(items[i].lon - items[j2].lon); if (d > 180) d = 360 - d;
      var lum = items[i].k === 'sun' || items[i].k === 'moon' || items[j2].k === 'sun' || items[j2].k === 'moon';
      for (var a = 0; a < ASP.length; a++) { var o = Math.abs(d - ASP[a][1]), lim = ASP[a][3] + (lum ? 1 : 0) - (ASP[a][0] === 'conj' || lum ? 0 : 0); if (o <= lim) { asp.push({ A: items[i], B: items[j2], t: ASP[a], o: o }); break; } }
    }
    asp.sort(function (x, y) { return x.o - y.o; });
    return { ch: ch, city: c, y: dp[0], m: dp[1], d: dp[2], hh: tp[0], mm: tp[1], items: items, node: node, asp: asp };
  }

  /* ---------- العجلة بشكل خريطة الميلاد: حلقة أبراج عنابية، قلب كريمي، زوايا ملونة ---------- */
  function wheel(st) {
    var ch = st.ch, asc = ch.asc, mc = ch.mc, cx = 270, R1 = 238, R2 = 198, R3 = 96, RP = 160, RN = 116;
    function pt(lon, r) { var a = (180 + (lon - asc)) * Math.PI / 180; return [cx + r * Math.cos(a), cx - r * Math.sin(a)]; }
    function f(n) { return n.toFixed(1); }
    function ln(a, b, at) { return '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '" ' + (at || '') + '/>'; }
    var o = '<defs><radialGradient id="swcC" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFFDF7"/><stop offset="1" stop-color="#F6ECD6"/></radialGradient></defs>';
    for (var i = 0; i < 12; i++) {
      var p0 = pt(i * 30, R1), p1 = pt(i * 30 + 30, R1), p2_ = pt(i * 30 + 30, R2), p3 = pt(i * 30, R2);
      o += '<path d="M' + f(p0[0]) + ' ' + f(p0[1]) + 'A' + R1 + ' ' + R1 + ' 0 0 0 ' + f(p1[0]) + ' ' + f(p1[1]) + 'L' + f(p2_[0]) + ' ' + f(p2_[1]) + 'A' + R2 + ' ' + R2 + ' 0 0 1 ' + f(p3[0]) + ' ' + f(p3[1]) + 'Z" fill="' + (i % 2 ? '#6A2A3C' : '#5E2234') + '" stroke="#C5A059" stroke-width=".9"/>';
      var g = pt(i * 30 + 15, (R1 + R2) / 2), d = GLY['s' + i];
      if (d) o += '<path transform="translate(' + f(g[0] - 16.8) + ' ' + f(g[1] - 16.8) + ') scale(1.4)" d="' + d + '" fill="none" stroke="#F3DFA8" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    o += '<circle cx="' + cx + '" cy="' + cx + '" r="' + R2 + '" fill="url(#swcC)" stroke="#C5A059" stroke-width="1.2"/><circle cx="' + cx + '" cy="' + cx + '" r="' + R3 + '" fill="#FFFDF8" stroke="#C5A059" stroke-width="1"/>';
    var tk = ''; for (var a = 0; a < 360; a += 5) tk += ln(pt(a, R2), pt(a, R2 - (a % 10 ? 4 : 8)));
    o += '<g stroke="#B8965A" stroke-width=".7" stroke-opacity=".8">' + tk + '</g>';
    var cu = ch.cusps, hl = '', hn = '';
    for (i = 0; i < 12; i++) {
      var ax = i % 3 === 0;
      hl += ln(pt(cu[i], R2), pt(cu[i], R3), 'stroke="' + (ax ? '#6B2234' : '#B8965A') + '" stroke-width="' + (ax ? 1.7 : .8) + '" stroke-opacity="' + (ax ? .95 : .7) + '"');
      var mid = cu[i] + mod(cu[(i + 1) % 12] - cu[i]) / 2, q = pt(mid, RN);
      hn += '<text x="' + f(q[0]) + '" y="' + f(q[1] + 3.5) + '" text-anchor="middle">' + (i + 1) + '</text>';
    }
    o += hl + '<g font-size="10.5" font-weight="600" fill="#8A6A4C" font-family="Cairo,sans-serif">' + hn + '</g>';
    var lab = function (lon, t) { var q = pt(lon, R1 + 17); return '<text x="' + f(q[0]) + '" y="' + f(q[1] + 4) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#4A1521" font-family="Cairo,sans-serif" letter-spacing=".04em">' + t + '</text>'; };
    o += lab(asc, 'ASC') + lab(asc + 180, 'DSC') + lab(mc, 'MC') + lab(mc + 180, 'IC');
    var as = '';
    st.asp.forEach(function (x) {
      var hard = x.t[0] === 'square' || x.t[0] === 'opp', soft = x.t[0] === 'sext' || x.t[0] === 'trine';
      if (x.t[0] === 'conj') return;
      as += ln(pt(x.A.lon, R3), pt(x.B.lon, R3), 'stroke="' + (hard ? '#C0554A' : '#4E7FB0') + '" stroke-opacity=".75" stroke-width="1.2"');
    });
    o += as;
    /* كواكب: تباعد بسيط لمنع التداخل */
    var arr = st.items.concat(st.node ? [st.node] : []).map(function (it) { return { it: it, disp: it.lon }; }).sort(function (a, b) { return a.it.lon - b.it.lon; });
    for (var rep = 0; rep < 60; rep++) { var mv = false; for (var k = 0; k < arr.length; k++) { var A = arr[k], B = arr[(k + 1) % arr.length], gap = mod(B.disp - A.disp); if (gap < 12 && arr.length > 1) { var ps = (12 - gap) / 2 + .01; A.disp = mod(A.disp - ps); B.disp = mod(B.disp + ps); mv = true; } } if (!mv) break; }
    arr.forEach(function (x) {
      var it = x.it, p = pt(x.disp, RP), t1 = pt(it.lon, R2), t2 = pt(it.lon, R2 - 11), g = it.k === 'node' ? NODE_G : (GLY[it.k] || ''), tap = it.k !== 'node';
      o += '<g class="swc-pl' + (tap ? '' : ' is-static') + '" data-k="' + it.k + '"' + (tap ? ' tabindex="0" role="button"' : '') + '><title>' + it.n + ' · ' + SIGNS_AR[it.sign] + ' ' + dm(it.lon) + (it.retro ? ' · متراجع' : '') + '</title>' + ln(t1, t2, 'stroke="#6B2234" stroke-width="1.4"') +
        '<circle class="swc-hit" cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="19" fill="#6B2234" fill-opacity="0"/>' +
        '<circle class="swc-ring" cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="16.5" fill="#FFFDF7" fill-opacity=".92" stroke="#C5A059" stroke-width="1.1"/>' +
        '<path class="swc-glyph" transform="translate(' + f(p[0] - 14) + ' ' + f(p[1] - 14) + ') scale(1.167)" d="' + g + '" fill="none" stroke="#4A1521" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
        (it.retro ? '<circle cx="' + f(p[0] + 13) + '" cy="' + f(p[1] - 13) + '" r="7.5" fill="#B8473E" stroke="#FFFDF7" stroke-width="1.2"/><text x="' + f(p[0] + 13) + '" y="' + f(p[1] - 9.8) + '" text-anchor="middle" font-size="9.5" font-weight="800" fill="#fff" font-family="Cairo,sans-serif">R</text>' : '') + '</g>';
    });
    return o;
  }

  function moonBlock(st) {
    var sun = st.items[0], moon = st.items[1], el = mod(moon.lon - sun.lon), il = Math.round((1 - Math.cos(el * Math.PI / 180)) / 2 * 100), age = (el / 360 * 29.53).toFixed(1);
    var mk = typeof window.AqeeqMoon === 'function' ? window.AqeeqMoon(el) : '';
    return { el: el, il: il, age: age, svg: '<svg class="swc-moon-svg" viewBox="0 0 120 120" role="img" aria-label="القمر: ' + phaseName(el) + '، إضاءة ' + il + '%">' + mk + '</svg>', ph: phaseName(el), moon: moon, sun: sun };
  }

  function joinAr(a) { return a.length < 2 ? a.join('') : a.length === 2 ? a[0] + ' و' + a[1] : a.slice(0, -1).join('، ') + ' و' + a[a.length - 1]; }
  /* جملة تحت القمر: تتبدل مع درجات الكواكب وحالات التراجع الفعلية في اللحظة المختارة */
  function hintHTML(st) {
    var retro = st.items.filter(function (r) { return r.retro && r.k !== 'sun' && r.k !== 'moon'; }), edge = null;
    st.items.forEach(function (it) { var d = it.lon % 30; if (!edge && it.k !== 'moon' && (d >= 29 || d < 1)) edge = it; });
    var lead, sub;
    if (edge) { lead = edge.n + (edge.lon % 30 >= 29 ? ' في آخر درجات ' : ' في أولى درجات ') + SIGNS_AR[edge.sign]; sub = 'لحظة انتقال دقيقة. اضغط عليه لتعرف ماذا يتبدّل، وعلى أي كوكب آخر لتعرف حالته.'; }
    else if (retro.length) { lead = joinAr(retro.map(function (r) { return r.n; })) + (retro.length > 1 ? ' متراجعون الآن' : ' متراجع الآن'); sub = 'اضغط على أي كوكب بالأسفل لتعرف ماذا يعني موقعه، وهل هو متراجع أم يسير في حركته المباشرة.'; }
    else { lead = 'كل الكواكب تسير في حركتها المباشرة'; sub = 'اضغط على أي كوكب بالأسفل لتقرأ ماذا يعني موقعه الآن.'; }
    return '<span class="swc-hint-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 4v15M5.500 12.500 12 19l6.500-6.500"/></svg></span><span class="swc-hint-t"><b>' + lead + '</b><small>' + sub + '</small></span>';
  }

  function renderCard(st) {
    svg.innerHTML = wheel(st);
    var m = moonBlock(st);
    moonEl.innerHTML = '<div class="swc-moon-fig">' + m.svg + '</div><div class="swc-moon-txt"><small>القمر في التاريخ المختار</small><b>' + m.ph + '</b><span>القمر في ' + SIGNS_AR[m.moon.sign] + ' ' + dm(m.moon.lon) + '</span><span>إضاءة ' + m.il + '% · عمره ' + m.age + ' يوم</span><span>الشمس في ' + SIGNS_AR[m.sun.sign] + ' ' + dm(m.sun.lon) + '</span></div>';
    gridEl.innerHTML = st.items.map(function (it) {
      var fixed = it.k === 'sun' || it.k === 'moon';
      return '<button type="button" class="swc-pc' + (it.retro ? ' is-retro' : '') + '" data-k="' + it.k + '"><span class="swc-pc-m">' + path(it.k, 'swc-pc-g') + '</span><span class="swc-pc-t"><b>' + it.n + '</b><small>' + SIGNS_AR[it.sign] + ' ' + dm(it.lon) + '</small></span>' +
        (fixed ? '' : '<i class="swc-pc-st ' + (it.retro ? 'is-retro' : 'is-direct') + '">' + (it.retro ? 'متراجع' : 'مباشر') + '</i>') +
        '<span class="swc-pc-go" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></span></button>';
    }).join('');
    hintEl.innerHTML = hintHTML(st);
    capEl.textContent = dateTxt(st) + (live ? ' · مباشر' : '');
  }

  /* ---------- صفحة التفاصيل #world ---------- */
  function bar(label, pct, cls) { return '<div class="wld-bar"><span>' + label + '</span><i><u class="' + cls + '" style="width:' + pct + '%"></u></i><b>' + pct + '%</b></div>'; }
  function renderWorld(st) {
    var host = $('wld'); if (!host) return;
    var ch = st.ch, m = moonBlock(st), FXp = window.AqeeqFX || { FX: {}, SUN_SHORT: [], ASP_FX: {}, moonShort: function () { return ''; } };
    function fx(it) { if (it.k === 'sun') return FXp.SUN_SHORT[it.sign] || ''; if (it.k === 'moon') return FXp.moonShort(it.sign); var a = FXp.FX[it.k]; return a ? a[it.retro ? 1 : 0] : ''; }
    $('wld-sub').textContent = dateTxt(st) + ' · خط العرض ' + st.city[1].toFixed(2) + '° · خط الطول ' + st.city[2].toFixed(2) + '°';
    var ascS = Math.floor(mod(ch.asc) / 30), mcS = Math.floor(mod(ch.mc) / 30);
    var elc = [0, 0, 0, 0], mdc = [0, 0, 0];
    st.items.forEach(function (it) { elc[SIGN_EL[it.sign]]++; mdc[SIGN_MOD[it.sign]]++; });
    var n = st.items.length, pc = function (v) { return Math.round(v / n * 100); };
    var housesOf = function (h) { return st.items.filter(function (it) { return it.house === h; }).map(function (it) { return path(it.k, 'wld-hg') + it.n; }).join('، '); };
    var retro = st.items.filter(function (it) { return it.retro; });
    var h = '';
    h += '<div class="wld-top"><div class="wld-chart"><svg class="swc-cw" id="wld-svg" viewBox="-14 -14 568 568" role="img" aria-label="الخريطة الفلكية العالمية">' + wheel(st) + '</svg><div class="swc-legend" aria-hidden="true"><span class="lg-soft">اتصال منسجم</span><span class="lg-hard">اتصال متوتر</span></div></div>';
    h += '<div class="wld-aside"><div class="swc-moon wld-moon"><div class="swc-moon-fig">' + m.svg + '</div><div class="swc-moon-txt"><small>القمر في التاريخ المختار</small><b>' + m.ph + '</b><span>القمر في ' + SIGNS_AR[m.moon.sign] + ' ' + dm(m.moon.lon) + '</span><span>إضاءة ' + m.il + '% · عمره ' + m.age + ' يوم</span></div></div>';
    h += '<div class="wld-keys"><div><small>الطالع</small><b>' + path('s' + ascS, 'wld-sg') + SIGNS_AR[ascS] + ' ' + dm(ch.asc) + '</b></div><div><small>وسط السماء</small><b>' + path('s' + mcS, 'wld-sg') + SIGNS_AR[mcS] + ' ' + dm(ch.mc) + '</b></div><div><small>الشمس</small><b>' + path('s' + st.items[0].sign, 'wld-sg') + SIGNS_AR[st.items[0].sign] + ' ' + dm(st.items[0].lon) + '</b></div><div><small>الكواكب المتراجعة</small><b>' + (retro.length ? retro.map(function (x) { return x.n; }).join('، ') : 'لا يوجد') + '</b></div></div>';
    h += '<div class="wld-card"><h4>توزيع العناصر</h4>' + bar('نار', pc(elc[0]), 'e0') + bar('تراب', pc(elc[1]), 'e1') + bar('هواء', pc(elc[2]), 'e2') + bar('ماء', pc(elc[3]), 'e3') + '<h4>توزيع الأنماط</h4>' + bar('كاردينال', pc(mdc[0]), 'm0') + bar('ثابت', pc(mdc[1]), 'm1') + bar('متحول', pc(mdc[2]), 'm2') + '</div></div></div>';
    h += '<section class="wld-card"><h3>مواقع الكواكب</h3><div class="wld-tbl">' + st.items.concat(st.node ? [st.node] : []).map(function (it) {
      return '<div class="wld-tr' + (it.retro ? ' is-retro' : '') + '" data-k="' + it.k + '"><span class="wld-ic">' + path(it.k, 'wld-g') + '</span><b>' + it.n + (it.retro ? ' <em>R</em>' : '') + '</b><span class="wld-deg">' + dm(it.lon) + '</span><span class="wld-sgn">' + path('s' + it.sign, 'wld-sg') + SIGNS_AR[it.sign] + '</span><span class="wld-hs">البيت ' + HOUSE_AR[(it.house || 1) - 1] + '</span><span class="wld-st">' + (it.k === 'node' ? 'نقطة' : (it.retro ? 'متراجع' : 'مباشر')) + '</span><p>' + (it.k === 'node' ? 'اتجاه النمو الجماعي والدروس المطلوبة في هذه الفترة.' : fx(it)) + '</p></div>';
    }).join('') + '</div></section>';
    h += '<section class="wld-card"><h3>البيوت الاثنا عشر</h3><div class="wld-houses">' + ch.cusps.map(function (c, i) {
      var s = Math.floor(mod(c) / 30), hs = housesOf(i + 1);
      return '<div class="wld-h"><span class="wld-hn">' + (i + 1) + '</span><div><b>البيت ' + HOUSE_AR[i] + '</b><small>' + HOUSE_AREA[i] + '</small></div><span class="wld-hc">' + path('s' + s, 'wld-sg') + SIGNS_AR[s] + ' ' + dm(c) + '</span>' + (hs ? '<p>' + hs + '</p>' : '') + '</div>';
    }).join('') + '</div></section>';
    h += '<section class="wld-card"><h3>الزوايا والاتصالات بين الكواكب</h3>' + (st.asp.length ? '<div class="wld-asp">' + st.asp.map(function (x) {
      var hard = x.t[0] === 'square' || x.t[0] === 'opp', neu = x.t[0] === 'conj';
      return '<div class="wld-a ' + (neu ? 'is-neu' : (hard ? 'is-hard' : 'is-soft')) + '"><span class="wld-ai">' + path(x.A.k, 'wld-g') + '</span><b>' + x.A.n + ' ' + x.t[2] + ' ' + x.B.n + '</b><span class="wld-ai">' + path(x.B.k, 'wld-g') + '</span><small>' + (neu ? 'محايد' : (hard ? 'متوتر' : 'منسجم')) + ' · فارق ' + x.o.toFixed(1) + '°</small><p>' + (FXp.ASP_FX[x.t[0]] || '') + '</p></div>';
    }).join('') + '</div>' : '<p class="wld-none">لا توجد زوايا قوية بين الكواكب في هذه اللحظة.</p>') + '</section>';
    h += '<p class="wld-note">هذه خريطة للسماء في لحظة ومكان محددين، وليست خريطة شخصية. البيوت محسوبة بنظام بلاسيدوس لموقع المدينة المختارة، وللتأمل والترفيه فقط.</p>';
    host.innerHTML = h;
  }
  function onWorld() { if (location.hash === '#world') { if (!cur) { try { cur = compute(); } catch (e) { return; } } renderWorld(cur); } }

  function render() {
    errEl.hidden = true;
    var st;
    try { st = compute(); } catch (e) {
      errEl.textContent = e.message === 'range' ? 'اختر تاريخاً بين 1900 و2100.' : (e.message === 'empty' ? 'أدخل التاريخ والوقت أولاً.' : 'تعذر حساب الخريطة حالياً.');
      errEl.hidden = false; return false;
    }
    cur = st; renderCard(st); syncSky(); var pc = document.querySelector('#sky-chips .chip[aria-pressed="true"]'); if (pc) sel = pc.getAttribute('data-k'); if (sel) highlight(sel); if (location.hash === '#world') renderWorld(st);
    return true;
  }
  function syncSky() {
    var s = document.getElementById('sky-date'); if (!s) return;
    var v = live ? '' : dateI.value; if (s.value === v) return; s.value = v; s.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function highlight(k) {
    sel = k;
    [].forEach.call(svg.querySelectorAll('.swc-pl'), function (g) { g.classList.toggle('is-sel', g.getAttribute('data-k') === k); });
    [].forEach.call(gridEl.querySelectorAll('.swc-pc'), function (r) { r.classList.toggle('is-sel', r.getAttribute('data-k') === k); });
  }
  /* الضغط على كوكب يفتح قراءته في ورقة سفلية مرتبة بدل النزول لآخر الصفحة */
  var sheet = null, root = document.documentElement;
  function ensureSheet() {
    if (sheet) return sheet;
    sheet = document.createElement('div'); sheet.className = 'aqm-sheet swp-sheet'; sheet.hidden = true;
    sheet.innerHTML = '<div class="aqm-sheet-scrim" data-swpc></div><div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-label="قراءة الكوكب"><span class="aqm-sheet-grip"></span>' +
      '<button type="button" class="aqm-sheet-x" data-swpc aria-label="إغلاق"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="aqm-sheet-body swp-body"></div><div class="aqm-sheet-foot"><button type="button" class="aqm-foot-close" data-swpc>إغلاق</button></div></div>';
    document.body.appendChild(sheet);
    if ('MutationObserver' in window) new MutationObserver(function () { queueUp(); }).observe(sheet, { childList: true, subtree: true });
    sheet.addEventListener('click', function (e) { if (e.target.closest('[data-swpc]')) closeSheet(); else if (e.target.closest('a[href]')) closeSheet(); });
    sheet.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
    return sheet;
  }
  function showSheet() {
    var s = ensureSheet(), body = s.querySelector('.swp-body'), panel = document.getElementById('sky-panel');
    if (panel && panel.parentNode !== body) body.appendChild(panel);
    body.scrollTop = 0; s.classList.remove('is-closing'); s.hidden = false; root.classList.add('aqm-sheet-open');
    queueUp();
  }
  function closeSheet() { if (!sheet || sheet.hidden) return; var s = sheet; s.classList.add('is-closing'); setTimeout(function () { s.hidden = true; s.classList.remove('is-closing'); root.classList.remove('aqm-sheet-open'); }, 230); }
  function openPlanet(k) {
    if (k === 'node') return;
    highlight(k);
    var n = 0;
    (function go() {
      var chip = document.querySelector('#sky-chips .chip[data-k="' + k + '"]');
      if (chip) { if (chip.getAttribute('aria-pressed') !== 'true') chip.click(); showSheet(); }
      else if (n++ < 20) setTimeout(go, 120);
    })();
  }

  function setQuick(btn) { [].forEach.call(form.querySelectorAll('.swc-quick button'), function (b) { b.classList.toggle('is-on', b === btn); }); }
  form.addEventListener('submit', function (e) { e.preventDefault(); live = false; setQuick(null); if (render()) location.hash = '#world'; });
  form.querySelector('.swc-quick').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var off = +b.getAttribute('data-off'), c = CITIES[+citySel.value], t = addDays(nowLocal(c), off);
    setInputs(t); live = off === 0; setQuick(b); render();
  });
  [dateI, timeI, citySel].forEach(function (el) { el.addEventListener('change', function () { if (el === citySel && live) { setInputs(nowLocal(CITIES[+citySel.value])); } else { live = false; setQuick(null); } render(); }); });
  /* أسهم زيادة/نقص يوم بجانب التاريخ: تُحدّث الخريطة والقمر وقسم الكوكب مباشرة */
  [].forEach.call(form.querySelectorAll('.swc-step'), function (b) {
    b.addEventListener('click', function () {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateI.value); if (!m) return;
      var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + (+b.getAttribute('data-step'))));
      if (d.getUTCFullYear() < 1900 || d.getUTCFullYear() > 2100) return;
      dateI.value = d.getUTCFullYear() + '-' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + d.getUTCDate()).slice(-2);
      live = false; setQuick(null); render();
    });
  });
  function pickEv(e) { var n = e.target.closest('[data-k]'); if (n) openPlanet(n.getAttribute('data-k')); }
  svg.addEventListener('click', pickEv); gridEl.addEventListener('click', pickEv);
  svg.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickEv(e); } });
  window.addEventListener('hashchange', onWorld);


  /* توحيد رموز الكواكب والأبراج في قسم الرصد: تحويل الحروف النصية الباهتة إلى نفس الأيقونات المرسومة */
  var CHAR_KEY = null;
  function charMap() {
    if (CHAR_KEY) return CHAR_KEY; CHAR_KEY = {};
    try { if (typeof PLANETS !== 'undefined') Object.keys(PLANETS).forEach(function (k) { if (PLANETS[k].g) CHAR_KEY[PLANETS[k].g.replace(/[\uFE0E\uFE0F]/g, '')] = k; }); } catch (e) {}
    try { if (typeof SIGNS !== 'undefined') SIGNS.forEach(function (s, i) { if (s.g) CHAR_KEY[s.g.replace(/[\uFE0E\uFE0F]/g, '')] = 's' + i; }); } catch (e) {}
    return CHAR_KEY;
  }
  function upgradeGlyphs() {
    var G = window.AqeeqGL, M = charMap(); if (!G) return;
    [].forEach.call(document.querySelectorAll('#sky .sg:not([data-sv]),#world .sg:not([data-sv]),.swp-sheet .sg:not([data-sv])'), function (el) {
      var key = M[(el.textContent || '').replace(/[\uFE0E\uFE0F\s]/g, '')];
      el.setAttribute('data-sv', '1');
      if (key && G[key]) el.innerHTML = '<svg class="sg-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + G[key] + '"/></svg>';
    });
  }
  var upQ = 0;
  function queueUp() { if (upQ) return; upQ = requestAnimationFrame(function () { upQ = 0; upgradeGlyphs(); }); }
  if ('MutationObserver' in window) { var skyEl = document.getElementById('sky'); if (skyEl) new MutationObserver(queueUp).observe(skyEl, { childList: true, subtree: true }); }

  function init() { try { setInputs(nowLocal(CITIES[0])); render(); onWorld(); upgradeGlyphs(); } catch (e) { errEl.textContent = 'تعذر حساب الخريطة حالياً.'; errEl.hidden = false; } }
  window.addEventListener('load', init);
  if (document.readyState === 'complete') init();
  setInterval(function () { if (live && !document.hidden) { setInputs(nowLocal(CITIES[+citySel.value])); render(); } }, 60000);
  window.__swc = { render: render, state: function () { return cur; } };
})();
