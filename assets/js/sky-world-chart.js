/* خريطة السماء العالمية: لحظة سماء لأي تاريخ ووقت ومدينة في العالم (ليست خريطة شخصية).
   تقرأ من محرك Astro الموجود نفسه. كل شيء في #sky: العجلة، القمر، وخمسة تبويبات (الكواكب، تأثيرها على برجك، الزوايا، الطالع والبيوت، العناصر والأنماط). */
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
  var RX = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4 4 9l5 5"/><path d="M4 9h9.500a5.500 5.500 0 0 1 0 11H10"/></svg>';
  var NODE_G = 'M4 18h5a6 6 0 1 1 6 0h5';
  var GLY = {};
  var $ = function (id) { return document.getElementById(id); };
  var dateI = $('swc-date'), timeI = $('swc-time'), citySel = $('swc-city'), capEl = $('swc-cap'), moonEl = $('swc-moon'), gridEl = $('swc-pgrid'), errEl = $('swc-err');
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
  function dmb(lon) { return '<bdi dir="ltr">' + dm(lon) + '</bdi>'; }
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

  /* ---------- العجلة بمعيار Astro.com: درجات ودقائق، تدريج 1°/5°/10°، تباعد ذكي وخطوط توصيل، وتركيز على كوكب ---------- */
  function wheel(st) {
    var ch = st.ch, asc = ch.asc, mc = ch.mc, cx = 270, R1 = 238, R2 = 198, R3 = 88, RP = 156, RL = 127, RN = 102;
    function pt(lon, r) { var a = (180 + (lon - asc)) * Math.PI / 180; return [cx + r * Math.cos(a), cx - r * Math.sin(a)]; }
    function f(n) { return n.toFixed(1); }
    function ln(a, b, at) { return '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '" ' + (at || '') + '/>'; }
    var o = '<defs><radialGradient id="swcC" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFFDF9"/><stop offset="1" stop-color="#FFFDF9"/></radialGradient></defs>';
    for (var i = 0; i < 12; i++) {
      var p0 = pt(i * 30, R1), p1 = pt(i * 30 + 30, R1), p2_ = pt(i * 30 + 30, R2), p3 = pt(i * 30, R2);
      o += '<path d="M' + f(p0[0]) + ' ' + f(p0[1]) + 'A' + R1 + ' ' + R1 + ' 0 0 0 ' + f(p1[0]) + ' ' + f(p1[1]) + 'L' + f(p2_[0]) + ' ' + f(p2_[1]) + 'A' + R2 + ' ' + R2 + ' 0 0 1 ' + f(p3[0]) + ' ' + f(p3[1]) + 'Z" fill="' + (i % 2 ? '#F6EEDC' : '#FBF6EA') + '" stroke="#D9BE7E" stroke-width=".7"/>';
      var g = pt(i * 30 + 15, (R1 + R2) / 2), d = GLY['s' + i];
      if (d) o += '<path transform="translate(' + f(g[0] - 13.8) + ' ' + f(g[1] - 13.8) + ') scale(1.15)" d="' + d + '" fill="none" stroke="#6B2234" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    o += '<circle cx="' + cx + '" cy="' + cx + '" r="' + R2 + '" fill="url(#swcC)" stroke="#D9BE7E" stroke-width=".9"/><circle cx="' + cx + '" cy="' + cx + '" r="' + R3 + '" fill="#FFFDF9" stroke="#D9BE7E" stroke-width=".8"/>';
    var t1 = '', t5 = '', t10 = '';
    for (var a = 0; a < 360; a++) { var seg = 'M' + f(pt(a, R2)[0]) + ' ' + f(pt(a, R2)[1]) + 'L' + f(pt(a, R2 - (a % 10 === 0 ? 9 : a % 5 === 0 ? 6 : 3))[0]) + ' ' + f(pt(a, R2 - (a % 10 === 0 ? 9 : a % 5 === 0 ? 6 : 3))[1]); if (a % 10 === 0) t10 += seg; else if (a % 5 === 0) t5 += seg; else t1 += seg; }
    o += '<g fill="none" stroke="#B8965A"><path d="' + t1 + '" stroke-width=".4" stroke-opacity=".5"/><path d="' + t5 + '" stroke-width=".75" stroke-opacity=".9"/><path d="' + t10 + '" stroke-width="1"/></g>';
    var cu = ch.cusps, hl = '', hn = '';
    for (i = 0; i < 12; i++) {
      var ax = i % 3 === 0;
      hl += ln(pt(cu[i], R2), pt(cu[i], R3), 'stroke="' + (ax ? '#7A3347' : '#B8965A') + '" stroke-width="' + (ax ? 1.8 : 1) + '" stroke-opacity="' + (ax ? .85 : .6) + '"');
      var mid = cu[i] + mod(cu[(i + 1) % 12] - cu[i]) / 2, q = pt(mid, RN);
      hn += '<text x="' + f(q[0]) + '" y="' + f(q[1] + 3.5) + '" text-anchor="middle">' + (i + 1) + '</text>';
    }
    o += hl + '<g font-size="10.5" font-weight="600" fill="#8A6A4C" font-family="Cairo,sans-serif">' + hn + '</g>';
    var lab = function (lon, t) { var q = pt(lon, R1 + 17); return '<text x="' + f(q[0]) + '" y="' + f(q[1] + 4) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="#4A1521" font-family="Cairo,sans-serif">' + t + '</text>'; };
    o += lab(asc, 'الطالع') + lab(asc + 180, 'الغارب') + lab(mc, 'وسط السماء') + lab(mc + 180, 'وتد الأرض');
    var as = '';
    st.asp.forEach(function (x) {
      var hard = x.t[0] === 'square' || x.t[0] === 'opp';
      if (x.t[0] === 'conj') return;
      as += ln(pt(x.A.lon, R3), pt(x.B.lon, R3), 'class="swc-al" data-a="' + x.A.k + '" data-b="' + x.B.k + '" stroke="' + (hard ? '#B5233B' : '#1E78A8') + '" stroke-opacity=".7" stroke-width="1.5" stroke-linecap="round"');
    });
    o += as;
    /* تباعد: كل كوكب يبتعد عن جاره 15° على الأقل، وخط رفيع يربط الرمز بدرجته الحقيقية */
    var arr = st.items.concat(st.node ? [st.node] : []).map(function (it) { return { it: it, disp: it.lon }; }).sort(function (a, b) { return a.it.lon - b.it.lon; }), GAP = 17;
    for (var rep = 0; rep < 300; rep++) { var mv = false; for (var k = 0; k < arr.length; k++) { var A = arr[k], B = arr[(k + 1) % arr.length], gap = mod(B.disp - A.disp); if (gap < GAP - .05 && arr.length > 1) { var ps = (GAP - gap) / 2 + .02; A.disp = mod(A.disp - ps); B.disp = mod(B.disp + ps); mv = true; } } if (!mv) break; }
    arr.forEach(function (x) {
      var it = x.it, p = pt(x.disp, RP), pl = pt(x.disp, RL), t1p = pt(it.lon, R2), t2 = pt(it.lon, R2 - 11), g = it.k === 'node' ? NODE_G : (GLY[it.k] || ''), tap = true;
      var off = Math.abs(((x.disp - it.lon + 540) % 360) - 180) > .8, le = pt(x.disp, RP + 20);
      o += '<g class="swc-pl' + (it.k === 'node' ? ' is-node' : '') + '" data-k="' + it.k + '" tabindex="0" role="button"><title>' + it.n + ' · ' + SIGNS_AR[it.sign] + ' ' + dm(it.lon) + (it.retro ? ' · متراجع' : '') + '</title>' + ln(t1p, t2, 'stroke="#6B2234" stroke-width="1.4"') +
        '<circle cx="' + f(t2[0]) + '" cy="' + f(t2[1]) + '" r="1.7" fill="#6B2234"/>' +
        (off ? ln(t2, le, 'stroke="#6B2234" stroke-width="1.6" stroke-opacity=".95"') : ln(t2, le, 'stroke="#6B2234" stroke-width="1.1" stroke-opacity=".6"')) +
        '<circle class="swc-hit" cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="22" fill="#6B2234" fill-opacity="0"/>' +
        '<circle class="swc-ring" cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="19" fill="none" stroke="none"/>' +
        '<path class="swc-halo" transform="translate(' + f(p[0] - 16) + ' ' + f(p[1] - 16) + ') scale(1.333)" d="' + g + '" fill="none" stroke="#FFFDF9" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round" stroke-opacity=".92"/>' +
        '<path class="swc-glyph" transform="translate(' + f(p[0] - 16) + ' ' + f(p[1] - 16) + ') scale(1.333)" d="' + g + '" fill="none" stroke="#5A182A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<text class="swc-dg" x="' + f(pl[0]) + '" y="' + f(pl[1] + 3.9) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#4A1224" font-family="Cairo,sans-serif" paint-order="stroke" stroke="#FFFDF9" stroke-width="3.6" stroke-linejoin="round" style="direction:ltr;unicode-bidi:plaintext">' + dm(it.lon) + '</text>' +
        (it.retro ? '<g class="swc-rx"><title>متراجع</title><circle cx="' + f(p[0] + 15) + '" cy="' + f(p[1] - 15) + '" r="9" fill="#B8473E" stroke="#FFFDF7" stroke-width="1.2"/><svg x="' + f(p[0] + 15 - 5.5) + '" y="' + f(p[1] - 15 - 5.5) + '" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 4 9l5 5"/><path d="M4 9h9.500a5.500 5.500 0 0 1 0 11H10"/></svg></g>' : '') + '</g>';
    });
    return o;
  }

  function moonBlock(st) {
    var sun = st.items[0], moon = st.items[1], el = mod(moon.lon - sun.lon), il = Math.round((1 - Math.cos(el * Math.PI / 180)) / 2 * 100), age = (el / 360 * 29.53).toFixed(1);
    var mk = typeof window.AqeeqMoon === 'function' ? window.AqeeqMoon(el) : '';
    return { el: el, il: il, age: age, svg: '<svg class="swc-moon-svg" viewBox="0 0 120 120" role="img" aria-label="القمر: ' + phaseName(el) + '، إضاءة ' + il + '%">' + mk + '</svg>', ph: phaseName(el), moon: moon, sun: sun };
  }

  function renderCard(st) {
    svg.innerHTML = wheel(st);
    var m = moonBlock(st);
    moonEl.innerHTML = '<div class="swc-moon-fig">' + m.svg + '</div><div class="swc-moon-txt"><small>القمر في التاريخ المختار</small><b>' + m.ph + '</b><span>القمر في ' + SIGNS_AR[m.moon.sign] + ' ' + dmb(m.moon.lon) + '</span><span>إضاءة ' + m.il + '% · عمره ' + m.age + ' يوم</span></div>';
    gridEl.innerHTML = st.items.map(function (it) {
      var fixed = it.k === 'sun' || it.k === 'moon';
      return '<button type="button" class="swc-pc' + (it.retro ? ' is-retro' : '') + '" data-k="' + it.k + '"><span class="swc-pc-m">' + path(it.k, 'swc-pc-g') + '</span><span class="swc-pc-t"><b>' + it.n + '</b><small>' + SIGNS_AR[it.sign] + ' ' + dmb(it.lon) + '</small></span>' +
        (fixed ? '' : '<i class="swc-pc-st ' + (it.retro ? 'is-retro' : 'is-direct') + '">' + (it.retro ? 'متراجع' : 'مباشر') + '</i>') +
        '<span class="swc-pc-go" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></span></button>';
    }).join('');
    if (foc) focusPlanet(foc, true); else idleCap(st);
    renderTabs(st);
  }
  function idleCap(st) { capEl.className = 'swc-cap'; capEl.textContent = wd(st) + ' ' + st.d + '/' + st.m + '/' + st.y + ' · ' + p2(st.hh) + ':' + p2(st.mm) + ' · ' + st.city[0] + (live ? ' · الآن' : ''); }

  /* ---------- تركيز على كوكب: شريط قراءة حي فوق العجلة + إبراز زواياه وتعتيم الباقي ---------- */
  var foc = null;
  function focusPlanet(k, keep) {
    var st = cur, it = null; if (!st) return;
    st.items.concat(st.node ? [st.node] : []).forEach(function (x) { if (x.k === k) it = x; });
    if (!it) { foc = null; idleCap(st); return; }
    foc = k; highlight(k);
    var n = 0;
    [].forEach.call(svg.querySelectorAll('.swc-al'), function (l) { var inv = l.getAttribute('data-a') === k || l.getAttribute('data-b') === k; l.classList.toggle('is-hot', inv); l.classList.toggle('is-dim', !inv); });
    st.asp.forEach(function (x) { if (x.A.k === k || x.B.k === k) n++; });
    svg.classList.add('has-foc');
    capEl.className = 'swc-cap is-focus';
    capEl.innerHTML = '<span class="swc-fp-g">' + path(k, 'swc-fp-gi', 1.8) + '</span><span class="swc-fp-t"><b>' + it.n + (it.retro ? ' <em class="rx-b" title="متراجع">' + RX + '</em>' : '') + '</b><small>' + SIGNS_AR[it.sign] + ' ' + dmb(it.lon) + ' · البيت ' + (it.house || 1) + (k === 'node' ? '' : ' · ' + (n ? n + (n > 2 ? ' زوايا' : n === 2 ? ' زاويتان' : ' زاوية') : 'بلا زوايا قوية')) + '</small></span>' +
      (k === 'node' ? '' : '<button type="button" class="swc-fp-go" data-open="' + k + '">القراءة</button>') + '<button type="button" class="swc-fp-x" data-clear aria-label="إلغاء التركيز"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>';
  }
  function clearFocus() {
    foc = null; svg.classList.remove('has-foc');
    [].forEach.call(svg.querySelectorAll('.swc-al'), function (l) { l.classList.remove('is-hot', 'is-dim'); });
    [].forEach.call(svg.querySelectorAll('.swc-pl.is-sel'), function (g) { g.classList.remove('is-sel'); });
    if (cur) idleCap(cur);
  }

  /* ---------- التبويبات الخمسة ---------- */
  var sigs = {};
  function barRow(label, pct, cls) { return '<div class="swb"><span>' + label + '</span><i><u class="' + cls + '" style="width:' + pct + '%"></u></i><b>' + pct + '%</b></div>'; }
  function sgIc(i) { return path('s' + i, 'swt-sg'); }
  function renderTabs(st) { renderMine(st); renderHouses(st); renderElem(st); }
  function skipSame(name, key) { if (sigs[name] === key) return true; sigs[name] = key; return false; }

  /* قفل تمرير الخلفية بثبات: نحفظ الموضع ونعيده بلا قفزة، والإخفاء بعد انتهاء حركة الخروج */
  (function () { function inScroll(t) { return t.closest && t.closest('.aqm-sheet-body, .aqm-sheet-panel [style*="overflow"]'); }
    function blk(e) { var t = e.target; if (t.closest && t.closest('.aqm-sheet') && !inScroll(t)) e.preventDefault(); }
    document.addEventListener('touchmove', blk, { passive: false }); document.addEventListener('wheel', blk, { passive: false }); })();
  var lockY = 0, locks = 0;
  function lockBg() { if (!locks++) { lockY = window.pageYOffset || 0; } root.classList.add('aqm-sheet-open'); }
  function unlockBg() { if (locks > 0 && !--locks) { root.classList.remove('aqm-sheet-open'); if ((window.pageYOffset || 0) !== lockY) window.scrollTo(0, lockY); } }
  /* كل فتح يبدأ من أول الورقة: نعيد الضبط بعد كل إعادة رسم أو تحميل نص متأخر، ونتوقف إن لمس القارئ الشاشة */
  function topScroll(s) {
    var b = s.querySelector('.aqm-sheet-body'), pn = s.querySelector('.aqm-sheet-panel'), stop = false;
    function z() { if (stop) return; if (b) b.scrollTop = 0; if (pn) pn.scrollTop = 0; }
    function off() { stop = true; s.removeEventListener('touchstart', off, true); s.removeEventListener('wheel', off, true); }
    s.addEventListener('touchstart', off, true); s.addEventListener('wheel', off, true);
    z(); requestAnimationFrame(function () { z(); requestAnimationFrame(z); });
    [120, 350, 800].forEach(function (t) { setTimeout(z, t); });
    setTimeout(off, 900);
  }
  function openSh(s) { var was = !s.hidden; s.classList.remove('is-closing'); s.hidden = false; if (!was) lockBg(); topScroll(s); }
  function closeSh(s) { if (!s || s.hidden || s.classList.contains('is-closing')) return; s.classList.add('is-closing'); setTimeout(function () { s.hidden = true; s.classList.remove('is-closing'); unlockBg(); }, 240); }
  var mineOpen = false, mineSheet = null, mineK = null;
  function numAr(n) { try { return n.toLocaleString('ar-EG'); } catch (e) { return String(n); } }
  function mineData(st, k) {
    var A = window.AqSky, R = window.AqReadings, sg = A.getSign(), bd = null;
    st.items.forEach(function (i) { if (i.k === k) bd = i; });
    var hh = ((bd.sign - sg + 12) % 12) + 1, H = A.HOUSES[hh - 1], hasTr = R.TR[k] && R.TR[k][hh - 1];
    return { bd: bd, hh: hh, H: H, txt: hasTr || (R.PH[k] && R.PH[k][hh - 1]) || '', q1: (hasTr && A.PQH[k] && A.PQH[k][hh - 1]) || A.PQ[k] || '', q2: A.HQ[hh - 1] ? A.HQ[hh - 1][(Math.floor(Date.now() / 864e5) + sg) % 2] : '', rt: bd.retro && R.RT[k] ? R.RT[k] : '' };
  }
  function renderMine(st) {
    var host = $('swc-mine'), A = window.AqSky, R = window.AqReadings; if (!host) return;
    if (!A || !R) { host.innerHTML = '<p class="swt-empty">القراءات قيد التحميل…</p>'; sigs.mine = ''; return; }
    var sg = A.getSign();
    if (!host.querySelector('.swm-pk')) {
      host.innerHTML = '<div class="swm-top"></div><div class="swm-pk"><div class="swm-pk-in"><section class="swm-pick"><b>اختر برجك الشمسي أو طالعك</b><small>مرة واحدة فقط، ونعرض لك كيف تلمس سماء هذه اللحظة بيوتك</small><div class="sky-signs" role="group" aria-label="اختر برجك أو طالعك">' +
        A.SIGNS.map(function (x, i) { return '<button type="button" class="sky-sg" data-i="' + i + '" aria-pressed="false"><span class="sg" aria-hidden="true">' + A.gl(x.g) + '</span><span>' + x.n + '</span></button>'; }).join('') + '</div></section></div></div><div class="swm-body"></div>';
    }
    if (sg === null) mineOpen = true;
    var key = (sg === null ? 'x' : sg) + '|' + st.items.map(function (i) { return i.k + i.sign + (i.retro ? 'r' : ''); }).join('');
    var pk = host.querySelector('.swm-pk'), chg;
    pk.classList.toggle('is-open', mineOpen);
    [].forEach.call(pk.querySelectorAll('.sky-sg'), function (b, i) { b.classList.toggle('is-on', i === sg); b.setAttribute('aria-pressed', i === sg); });
    var top = host.querySelector('.swm-top'), body = host.querySelector('.swm-body');
    if (sg === null) { top.innerHTML = ''; body.innerHTML = '<p class="swt-empty">اختر برجك لنعرض لك تقرير اليوم: أين يقف كل كوكب في حياتك.</p>'; sigs.mine = ''; return; }
    var nx = (sg + 1) % 12;
    top.innerHTML = '<div class="swm-ban"><div class="swm-ban-r"><span class="swm-ban-g"><span class="sg" aria-hidden="true">' + A.gl(A.SIGNS[sg].g) + '</span></span><div><small>تأثير سماء هذه اللحظة على</small><b>برج ' + A.SIGNS[sg].n + '</b></div>' +
      '<button type="button" class="swm-chg" data-chg aria-expanded="' + mineOpen + '">' + (mineOpen ? 'إخفاء' : 'تغيير البرج') + '</button></div>' +
      '<button type="button" class="swm-nx" data-nxs><span>البرج التالي: <b>' + A.SIGNS[nx].n + '</b></span><span class="sg" aria-hidden="true">' + A.gl(A.SIGNS[nx].g) + '</span></button></div>';
    if (sigs.mine === key) return; sigs.mine = key;
    body.innerHTML = '<div class="swg">' + st.items.map(function (bd) {
      var d = mineData(st, bd.k);
      return '<button type="button" class="swg-c' + (bd.retro ? ' is-retro' : '') + '" data-mk="' + bd.k + '"><span class="swg-g">' + path(bd.k, 'swg-gi') + '</span><b>' + bd.n + '</b><i class="swg-h">البيت ' + numAr(d.hh) + '</i>' + (bd.retro ? '<em class="rx-b" title="متراجع">' + RX + '</em>' : '') + '</button>';
    }).join('') + '</div><p class="swg-tip">اضغط أي كوكب لتقرأ أثره في بيتك</p>';
    queueUp();
  }
  /* ورقة سفلية موحدة لقراءة كوكب في بيت البرج المختار */
  function ensureMine() {
    if (mineSheet) return mineSheet;
    mineSheet = document.createElement('div'); mineSheet.className = 'aqm-sheet swp-sheet mns-sheet'; mineSheet.hidden = true;
    mineSheet.innerHTML = '<div class="aqm-sheet-scrim" data-mnc></div><div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-label="أثر الكوكب في بيتك"><span class="aqm-sheet-grip"></span><div class="aqm-sheet-body swp-body mns-body"></div>' +
      '<div class="aqm-sheet-foot"><button type="button" class="aqm-foot-next" data-mnn><span class="aqm-foot-l"><small>الكوكب التالي</small><b></b></span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button><button type="button" class="aqm-foot-close" data-mnc>إغلاق</button></div></div>';
    document.body.appendChild(mineSheet);
    mineSheet.addEventListener('click', function (e) { if (e.target.closest('[data-mnn]')) { var o = st_items(); var i = o.indexOf(mineK); showMine(o[(i + 1) % o.length]); } else if (e.target.closest('[data-mnc]')) closeMine(); });
    mineSheet.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMine(); });
    return mineSheet;
  }
  function st_items() { return cur ? cur.items.map(function (i) { return i.k; }) : []; }
  function showMine(k) {
    var A = window.AqSky; if (!cur || !A || A.getSign() === null) return;
    mineK = k; var d = mineData(cur, k), bd = d.bd, s = ensureMine(), sg = A.getSign(), o = st_items(), nk = o[(o.indexOf(k) + 1) % o.length], nm = '';
    cur.items.forEach(function (i) { if (i.k === nk) nm = i.n; });
    s.querySelector('.mns-body').innerHTML = '<div class="mns-hero"><span class="swm-g">' + path(k, 'swm-gi') + '</span><div><span class="mns-sg"><span class="sg" aria-hidden="true">' + A.gl(A.SIGNS[sg].g) + '</span>برج ' + A.SIGNS[sg].n + '</span><h3>' + bd.n + ' في بيتك ' + d.H.n + '</h3><span class="mns-meta">' + SIGNS_AR[bd.sign] + ' ' + dmb(bd.lon) + ' · ' + d.H.area + (bd.retro ? ' <em class="rx-b" title="متراجع">' + RX + '</em>' : '') + '</span></div></div>' +
      (window.AqReadingBlock ? '<div class="mns-txt">' + window.AqReadingBlock.block(k, d.hh, d.txt) + '</div>' : '<p class="mns-txt">' + d.txt + '</p>') + (d.rt ? '<p class="swm-rt">' + d.rt + '</p>' : '') +
      '<div class="swm-q"><ul><li>' + d.q1 + '</li></ul></div>';
    s.querySelector('[data-mnn] b').textContent = nm;
    openSh(s); queueUp();
  }
  function closeMine() { closeSh(mineSheet); }

  function renderHouses(st) {
    var host = $('swc-houses'); if (!host) return;
    var ch = st.ch, key = ch.asc.toFixed(2) + '|' + st.items.map(function (i) { return i.k + (i.house || ''); }).join(''); if (skipSame('houses', key)) return;
    var angs = [['الطالع', ch.asc], ['الغارب', ch.asc + 180], ['وسط السماء', ch.mc], ['وتد الأرض', ch.mc + 180]];
    var h = '<div class="swt-angles">' + angs.map(function (a) { var s = Math.floor(mod(a[1]) / 30); return '<div class="swt-ang"><span class="swt-ang-i">' + sgIc(s) + '</span><div class="swt-ang-t"><small>' + a[0] + '</small><b>' + SIGNS_AR[s] + '</b><span>' + dmb(a[1]) + '</span></div></div>'; }).join('') + '</div>';
    h += '<div class="swt-hs">' + ch.cusps.map(function (c, i) {
      var s = Math.floor(mod(c) / 30), ps = st.items.filter(function (it) { return it.house === i + 1; }).map(function (it) { return '<span class="swt-hp"><i>' + path(it.k, 'swt-pg') + '</i>' + it.n + '</span>'; }).join('');
      return '<div class="swt-h"><span class="swt-hn">' + (i + 1) + '</span><div class="swt-ht"><b>البيت ' + HOUSE_AR[i] + '</b><small>' + HOUSE_AREA[i] + '</small></div><span class="swt-hc">' + sgIc(s) + SIGNS_AR[s] + ' ' + dmb(c) + '</span>' + (ps ? '<div class="swt-hps">' + ps + '</div>' : '') + '</div>';
    }).join('') + '</div>';
    host.innerHTML = h; queueUp();
  }

  function renderElem(st) {
    var host = $('swc-elem'); if (!host) return;
    var key = st.items.map(function (i) { return i.k + i.sign + (i.retro ? 'r' : ''); }).join(''); if (skipSame('elem', key)) return;
    var elc = [0, 0, 0, 0], mdc = [0, 0, 0];
    st.items.forEach(function (it) { elc[SIGN_EL[it.sign]]++; mdc[SIGN_MOD[it.sign]]++; });
    var n = st.items.length, pc = function (v) { return Math.round(v / n * 100); };
    var retro = st.items.filter(function (it) { return it.retro && it.k !== 'sun' && it.k !== 'moon'; });
    var h = '<section class="swt-card"><h4>توزيع العناصر</h4>' + barRow('نار', pc(elc[0]), 'e0') + barRow('تراب', pc(elc[1]), 'e1') + barRow('هواء', pc(elc[2]), 'e2') + barRow('ماء', pc(elc[3]), 'e3') + '</section>' +
      '<section class="swt-card"><h4>توزيع الأنماط</h4>' + barRow('كاردينال', pc(mdc[0]), 'm0') + barRow('ثابت', pc(mdc[1]), 'm1') + barRow('متحول', pc(mdc[2]), 'm2') + '</section>' +
      '<section class="swt-card"><h4>الكواكب المتراجعة</h4>' + (retro.length ? '<div class="swt-rx">' + retro.map(function (it) { return '<span class="swt-rxi"><em class="rx-b">' + RX + '</em>' + it.n + ' في ' + SIGNS_AR[it.sign] + '</span>'; }).join('') + '</div>' : '<p class="swt-empty is-in">لا يوجد كوكب متراجع في هذه اللحظة، فكل الكواكب تسير مباشرة.</p>') + '</section>';
    host.innerHTML = h;
  }

  function setTab(name) {
    [].forEach.call(document.querySelectorAll('.swt-t'), function (b) { var on = b.getAttribute('data-tab') === name; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); if (on && b.scrollIntoView) { try { var bar = b.parentNode; bar.scrollTo({ left: b.offsetLeft - (bar.clientWidth - b.offsetWidth) / 2, behavior: 'smooth' }); } catch (e) { } } });
    [].forEach.call(document.querySelectorAll('.swt-p'), function (p) { p.hidden = p.id !== 'swp-' + name; });
  }
  window.addEventListener('hashchange', function () { /* #world دُمجت في #sky */ });
  /* وصلت نصوص السماء المؤجلة: أعد رسم تبويب «برجك» الذي كان يعرض «قيد التحميل» */
  document.addEventListener('aq:sky-texts', function () { try { sigs.mine = ''; if (cur) renderMine(cur); } catch (e) { } });
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.swt-t'); if (t) { setTab(t.getAttribute('data-tab')); return; }
    var sgb = e.target.closest && e.target.closest('#swc-mine .sky-sg'); if (sgb && window.AqSky) { window.AqSky.setSign(+sgb.getAttribute('data-i')); mineOpen = false; renderMine(cur); return; }
    if (e.target.closest && e.target.closest('#swc-mine [data-nxs]') && window.AqSky) { window.AqSky.setSign((window.AqSky.getSign() + 1) % 12); renderMine(cur); return; }
    if (e.target.closest && e.target.closest('#swc-mine [data-chg]')) { mineOpen = !mineOpen; renderMine(cur); return; }
    var mc = e.target.closest && e.target.closest('#swc-mine [data-mk]'); if (mc) showMine(mc.getAttribute('data-mk'));
  });

  function render() {
    errEl.hidden = true;
    var st;
    try { st = compute(); } catch (e) {
      errEl.textContent = e.message === 'range' ? 'اختر تاريخاً بين 1900 و2100.' : (e.message === 'empty' ? 'أدخل التاريخ والوقت أولاً.' : 'تعذر حساب الخريطة حالياً.');
      errEl.hidden = false; return false;
    }
    cur = st; renderCard(st); syncSky(); var pc = document.querySelector('#sky-chips .chip[aria-pressed="true"]'); if (pc) sel = pc.getAttribute('data-k'); if (foc) focusPlanet(foc, true); else if (sel) highlight(sel);
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
      '<div class="aqm-sheet-body swp-body"></div><div class="aqm-sheet-foot"><button type="button" class="aqm-foot-next" data-swpn><span class="aqm-foot-l"><small>القسم التالي</small><b></b></span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button><button type="button" class="aqm-foot-close" data-swpc>إغلاق</button></div></div>';
    document.body.appendChild(sheet);
    if ('MutationObserver' in window) new MutationObserver(function () { queueUp(); }).observe(sheet, { childList: true, subtree: true });
    sheet.addEventListener('click', function (e) { if (e.target.closest('[data-swpn]')) nextPlanet(); else if (e.target.closest('[data-swpc]')) closeSheet(); else if (e.target.closest('a[href]')) closeSheet(); });
    sheet.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
    return sheet;
  }
  function showSheet() {
    var s = ensureSheet(), body = s.querySelector('.swp-body'), panel = document.getElementById('sky-panel');
    if (panel && panel.parentNode !== body) body.appendChild(panel);
    openSh(s);
    updNext(); queueUp();
  }
  function closeSheet() { closeSh(sheet); }
  /* زر «القسم التالي»: ينتقل للكوكب التالي بنفس ترتيب الشبكة */
  function planetOrder() { return [].map.call(gridEl.querySelectorAll('.swc-pc'), function (b) { return b.getAttribute('data-k'); }); }
  function nextKey() { var o = planetOrder(), i = o.indexOf(sel); return o.length ? o[(i + 1) % o.length] : null; }
  function planetName(k) { for (var i = 0; i < PL.length; i++) if (PL[i][0] === k) return PL[i][1]; return ''; }
  function updNext() { if (!sheet) return; var b = sheet.querySelector('[data-swpn] b'), k = nextKey(); if (b && k) b.textContent = planetName(k); }
  function nextPlanet() { var k = nextKey(); if (k) openPlanet(k); }
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

  /* بطاقات الزوايا: الضغط على أي بطاقة يفتح قراءتها في ورقة سفلية مع «القسم التالي» */
  var axSheet = null, axI = 0;
  function axList() { return [].slice.call(document.querySelectorAll('#sky-asp .ax')); }
  function ensureAx() {
    if (axSheet) return axSheet;
    axSheet = document.createElement('div'); axSheet.className = 'aqm-sheet swp-sheet axs-sheet'; axSheet.hidden = true;
    axSheet.innerHTML = '<div class="aqm-sheet-scrim" data-axc></div><div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-label="قراءة الزاوية"><span class="aqm-sheet-grip"></span>' +
            '<div class="aqm-sheet-body swp-body axs-body"></div><div class="aqm-sheet-foot"><button type="button" class="aqm-foot-next" data-axn><span class="aqm-foot-l"><small>القسم التالي</small><b></b></span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button><button type="button" class="aqm-foot-close" data-axc>إغلاق</button></div></div>';
    document.body.appendChild(axSheet);
    axSheet.addEventListener('click', function (e) { if (e.target.closest('[data-axn]')) renderAx(axI + 1); else if (e.target.closest('[data-axc]')) closeAx(); });
    axSheet.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAx(); });
    return axSheet;
  }
  function renderAx(i) {
    var L = axList(); if (!L.length) return; axI = ((i % L.length) + L.length) % L.length;
    var el = L[axI], s = ensureAx(), body = s.querySelector('.axs-body'), tone = (el.className.match(/axt-(\w)/) || [])[1] || 'n';
    var bx = el.querySelector('.ax-b'), qs = [].slice.call(bx.querySelectorAll('.ax-q')).slice(0, 2), orb = parseFloat(el.getAttribute('data-orb')), lim = parseFloat(el.getAttribute('data-lim')) || 8, pct = isNaN(orb) ? 0 : Math.max(2, Math.min(100, (1 - orb / lim) * 100)), tight = !isNaN(orb) && orb <= lim / 3;
    var txt = [].filter.call(bx.children, function (c) { return !c.classList.contains('ax-q'); }).map(function (c) { return c.outerHTML; }).join('');
    body.innerHTML = '<div class="axs-hero axt-' + tone + '">' + el.querySelector('.ax-pair').outerHTML + '<div class="axs-t"><b>' + el.querySelector('.ax-t b').innerHTML + '</b><small>' + el.querySelector('.ax-t small').innerHTML + '</small></div></div>' +
      (isNaN(orb) ? '' : '<div class="axs-orb"><div class="axs-orb-h"><b>دقة الزاوية</b><span>' + (tight ? 'زاوية قوية' : orb <= lim * .66 ? 'زاوية متوسطة' : 'زاوية خفيفة') + ' · <bdi dir="ltr">' + orb.toFixed(1).replace(/\.0$/, '') + '°</bdi></span></div><div class="axs-orb-bar"><i style="width:' + pct.toFixed(0) + '%"></i></div><div class="axs-orb-s"><span><bdi dir="ltr">0°</bdi></span><span><bdi dir="ltr">' + lim + '°</bdi></span></div></div>') +
      '<div class="axs-txt">' + txt + '</div>' + (qs.length ? '<div class="swm-q"><ul>' + qs.map(function (z) { return '<li>' + z.innerHTML + '</li>'; }).join('') + '</ul></div>' : '');
    var nx = L[(axI + 1) % L.length], nb = s.querySelector('[data-axn]'); nb.hidden = L.length < 2; nb.querySelector('b').textContent = nx.querySelector('.ax-t b').textContent;
    openSh(s); queueUp();
  }
  function closeAx() { closeSh(axSheet); }
  var axHost = document.getElementById('sky-asp');
  if (axHost) axHost.addEventListener('click', function (e) { var b = e.target.closest('.ax-s'); if (!b) return; var L = axList(), i = L.indexOf(b.parentNode); if (i > -1) renderAx(i); });

  function setQuick(btn) { [].forEach.call(form.querySelectorAll('.swc-quick button'), function (b) { b.classList.toggle('is-on', b === btn); }); }
  form.addEventListener('submit', function (e) { e.preventDefault(); live = false; setQuick(null); render(); });
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
  function wheelEv(e) { var n = e.target.closest('.swc-pl[data-k]'); if (!n) { if (!e.target.closest('.swc-cap')) clearFocus(); return; } var k = n.getAttribute('data-k'); if (foc === k) clearFocus(); else focusPlanet(k); }
  svg.addEventListener('click', wheelEv); gridEl.addEventListener('click', pickEv);
  capEl.addEventListener('click', function (e) { var o = e.target.closest('[data-open]'); if (o) { openPlanet(o.getAttribute('data-open')); return; } if (e.target.closest('[data-clear]')) clearFocus(); });
  svg.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); wheelEv(e); } });
  function toWorld() { if (location.hash === '#world') { try { location.replace(location.pathname + location.search + '#sky'); } catch (e) { location.hash = '#sky'; } setTab('houses'); } }
  window.addEventListener('hashchange', toWorld);


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
    [].forEach.call(document.querySelectorAll('#sky .sg:not([data-sv]),#world .sg:not([data-sv]),.swp-sheet .sg:not([data-sv]),#signs .sg:not([data-sv]),.sgs-sheet .sg:not([data-sv]),.sgs-sheet .lpa-ic:not([data-sv]),.sgs-sheet .zp-glyph:not([data-sv])'), function (el) {
      var key = M[(el.textContent || '').replace(/[\uFE0E\uFE0F\s]/g, '')];
      el.setAttribute('data-sv', '1');
      if (key && G[key]) el.innerHTML = '<svg class="sg-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + G[key] + '"/></svg>';
    });
  }
  var upQ = 0;
  window.AqUpGlyphs = function () { queueUp(); };
  function queueUp() { if (upQ) return; upQ = requestAnimationFrame(function () { upQ = 0; upgradeGlyphs(); }); }
  if ('MutationObserver' in window) { var skyEl = document.getElementById('sky'); if (skyEl) new MutationObserver(queueUp).observe(skyEl, { childList: true, subtree: true }); new MutationObserver(queueUp).observe(document.body, { childList: true }); queueUp(); }

  function init() { try { setInputs(nowLocal(CITIES[0])); render(); toWorld(); upgradeGlyphs(); } catch (e) { errEl.textContent = 'تعذر حساب الخريطة حالياً.'; errEl.hidden = false; } }
  window.addEventListener('load', init);
  if (document.readyState === 'complete') init();
  setInterval(function () { if (live && !document.hidden) { setInputs(nowLocal(CITIES[+citySel.value])); render(); } }, 60000);
  window.__swc = { render: render, state: function () { return cur; } };
})();
