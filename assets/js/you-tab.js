/* تبويب «أنت» بعد الدخول: صفحة شخصية من خريطة المستخدم نفسه (الغربية + الفيدية).
   النصوص مأخوذة من نفس مكتبات السماء والتوقعات (AqReadings / AqLive / AqSignReads) ومن مكتبة الفيدي. لا نصوص جديدة مولّدة هنا. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var SG = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var PN = { sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ', jupiter: 'المشتري', saturn: 'زحل', uranus: 'أورانوس', neptune: 'نبتون', pluto: 'بلوتو' };
  var PK = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  var HN = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'];
  var HT = ['الهوية والحضور', 'المال والقيمة', 'الكلام والمحيط القريب', 'البيت والجذور', 'الحب والإبداع', 'العمل اليومي والصحة', 'الشريك والعلاقات الوثيقة', 'العمق والمشاركة', 'المعنى والسفر والتعلم', 'المسار المهني والمكانة', 'الأصدقاء والأحلام', 'الخلوة والعالم الداخلي'];
  var AREAS = [
    { id: 'love', t: 'علاقاتك', s: 'الحب والشريك والأصدقاء', h: [5, 7, 11], ic: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/>' },
    { id: 'work', t: 'عملك ومكانتك', s: 'المسار والطموح واليوم بعد اليوم', h: [10, 6], ic: '<path d="M4 8h16v11H4zM9 8V5h6v3"/>' },
    { id: 'money', t: 'مالك وقيمتك', s: 'ما تكسبه وما تعتبره ثمينًا', h: [2, 8], ic: '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.500 10.500c0-1 1-1.500 2.500-1.500s2.500.5 2.500 1.500-1 1.500-2.500 1.500-2.500.5-2.500 1.500 1 1.500 2.500 1.500 2.500-.5 2.500-1.500"/>' },
    { id: 'home', t: 'بيتك وعائلتك', s: 'الأمان والجذور والهدوء', h: [4, 12], ic: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>' },
    { id: 'mind', t: 'عقلك ومعناك', s: 'الكلام والتعلم والسؤال الكبير', h: [3, 9], ic: '<path d="M5 5h14v10H9l-4 4z"/>' },
    { id: 'self', t: 'ذاتك وحضورك', s: 'من أنت أمام الناس وأمام نفسك', h: [1], ic: '<circle cx="12" cy="8" r="3.500"/><path d="M5 20a7 7 0 0 1 14 0"/>' }
  ];
  var ST = { tab: 'today', sys: 'west', sheet: null, vd: null, vdLoading: false };
  var SVG = function (p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
  var CHEV = SVG('<path d="M15 6l-6 6 6 6"/>');
  var norm = function (x) { return ((x % 360) + 360) % 360; };
  var natal = function () { try { var n = window.AqeeqChartContext && window.AqeeqChartContext.getMine(); return n && n.ch ? n : null; } catch (e) { return null; } };
  var texts = function () { return !!(window.AqReadings && window.AqLive); };
  function loadAll() {
    if (!texts() && window.AqSkyTexts && !ST.tl) { ST.tl = 1; window.AqSkyTexts.load().then(function () { ST.tl = 0; mount(true); }); }
    if (!ST.vd && !ST.vdLoading) {
      ST.vdLoading = true;
      fetch('assets/data/vedic/chart-readings.json?v=1').then(function (r) { return r.json(); }).then(function (j) { ST.vd = j; ST.vdLoading = false; mount(true); }).catch(function () { ST.vdLoading = false; });
    }
  }
  /* ---------- حسابات ---------- */
  function houseOf(ch, lon) { return window.AqeeqLive ? window.AqeeqLive.houseOf(ch, lon) : 1; }
  function nowChart(ch) { try { return window.Astro.chart({ utcMs: Date.now(), lat: ch.lat, lon: ch.lon, known: false }); } catch (e) { return null; } }
  function body(c, k) { return c && c.bodies ? c.bodies.filter(function (b) { return String(b.key).toLowerCase() === k; })[0] : null; }
  function ayan(jde) {
    try { if (window.AqEam && window.AqEam.ayanamsa) return window.AqEam.ayanamsa(jde); } catch (e) {}
    var T = (jde - 2415020) / 36525; return (22 * 3600 + 27 * 60 + 37.65 + 5025.75 * T + 1.11 * T * T) / 3600;
  }
  function transits(ch) {
    var c = nowChart(ch), out = {}; if (!c) return out;
    PK.forEach(function (k) { var b = body(c, k); if (!b) return; var lon = norm(b.lon); out[k] = { k: k, sign: SG[Math.floor(lon / 30)], house: houseOf(ch, lon), retro: !!b.retro, deg: Math.floor(lon % 30) }; });
    return out;
  }
  function natalPl(ch) {
    var out = {}; PK.forEach(function (k) { var b = body(ch, k); if (b) { var lon = norm(b.lon); out[k] = { k: k, sign: SG[Math.floor(lon / 30)], si: Math.floor(lon / 30), house: b.house || houseOf(ch, lon), deg: Math.floor(lon % 30) }; } });
    return out;
  }
  function vedicChart(ch) {
    if (!ch.known || typeof ch.asc !== 'number') return null;
    var ay = ayan(ch.jde), ascS = Math.floor(norm(ch.asc - ay) / 30), pl = {};
    var map = { sun: 'sun', moon: 'moon', mars: 'mars', mercury: 'mercury', jupiter: 'jupiter', venus: 'venus', saturn: 'saturn', node: 'truenode' };
    Object.keys(map).forEach(function (k) { var b = body(ch, map[k]) || (k === 'node' ? body(ch, 'node') : null); if (!b) return; var s = Math.floor(norm(b.lon - ay) / 30); pl[k] = { k: k, si: s, house: ((s - ascS + 12) % 12) + 1 }; });
    if (pl.node) { var s2 = (pl.node.si + 6) % 12; pl.ketu = { k: 'ketu', si: s2, house: ((s2 - ascS + 12) % 12) + 1 }; }
    return { asc: ascS, pl: pl };
  }
  var VN = { sun: 'الشمس', moon: 'القمر', mars: 'المريخ', mercury: 'عطارد', jupiter: 'المشتري', venus: 'الزهرة', saturn: 'زحل', node: 'راهو', ketu: 'كيتو' };
  var firstSentence = function (t) { t = String(t || ''); var m = t.search(/[.؟!]\s/); return m > 20 ? t.slice(0, m + 1) : t; };
  var paras = function (t) { return String(t || '').split(/\n+/).filter(Boolean); };
  /* ---------- مكونات ---------- */
  var GL = { sun: '\u2609', moon: '\u263D', mercury: '\u263F', venus: '\u2640', mars: '\u2642', jupiter: '\u2643', saturn: '\u2644', uranus: '\u2645', neptune: '\u2646', pluto: '\u2647' };
  var AI = { love: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/>', work: '<path d="M4 8h16v11H4zM9 8V5h6v3"/>', money: '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.500 10.500c0-1 1-1.500 2.500-1.500s2.500.5 2.500 1.500-1 1.500-2.500 1.500-2.500.5-2.500 1.500 1 1.500 2.500 1.500 2.500-.5 2.500-1.500"/>', day: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.600 5.600L7 7M17 17l1.400 1.400M5.600 18.400L7 17M17 7l1.400-1.400"/>' };
  function badge(k) { return '<span class="yt-bd">' + (GL[k] ? '<i>' + GL[k] + '\uFE0E</i>' : SVG(AI[k] || AI.day)) + '</span>'; }
  function card(kick, title, lead, key, extra, bk) {
    return '<article class="yt-c"><div class="yt-ch">' + badge(bk) + '<div><small class="yt-k">' + esc(kick) + '</small><h3>' + esc(title) + '</h3>' + (extra ? '<span class="yt-x">' + esc(extra) + '</span>' : '') + '</div></div>' + (lead ? '<p>' + esc(lead) + '</p>' : '') +
      (key ? '<button type="button" class="yt-more" data-yt-open="' + esc(key) + '"><span>تعمّق</span>' + CHEV + '</button>' : '') + '</article>';
  }
  function empty(msg) { return '<div class="yt-empty"><p>' + esc(msg) + '</p></div>'; }
  var BI = { sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.600 5.600L7 7M17 17l1.400 1.400M5.600 18.400L7 17M17 7l1.400-1.400"/>', moon: '<path d="M20 14.500A8 8 0 0 1 9.500 4 8 8 0 1 0 20 14.500z"/>', asc: '<path d="M3 17h18M6 17a6 6 0 0 1 12 0M12 5v3M5.600 8.600l1.800 1.800M18.400 8.600l-1.800 1.800"/>', path: '<path d="M4 20c3-8 5-8 8-2s5 4 8-12"/>', rashi: '<path d="M12 3l2.600 6.400L21 10l-5 4.300L17.500 21 12 17.500 6.500 21 8 14.300 3 10l6.400-.6z"/>', nak: '<path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18"/>' };
  function identity(ch, mine) {
    var p = natalPl(ch), v = window.AqeeqLive && window.AqeeqLive.vedic(ch), lp = '';
    try { lp = window.AqeqLifePathCore.lifePath(mine.d, mine.m, mine.y); } catch (e) {}
    var rise = ch.known && typeof ch.asc === 'number' ? SG[Math.floor(norm(ch.asc) / 30)] : 'غير محدد';
    var cell = function (ic, k, t) { return '<div class="yt-bc"><span class="yt-bi">' + SVG(BI[ic]) + '</span><small>' + k + '</small><b>' + esc(t) + '</b></div>'; };
    return '<section class="yt-ban"><span class="yt-ban-k">بطاقة هويتك</span>' +
      '<div class="yt-bg3">' + cell('sun', 'الشمس', p.sun ? p.sun.sign : '—') + cell('moon', 'القمر', p.moon ? p.moon.sign : '—') + cell('asc', 'الطالع', rise) + '</div>' +
      '<div class="yt-bg2">' + (lp ? cell('path', 'مسار الحياة', String(lp)) : '') + (v ? cell('rashi', 'برج القمر الفيدي', v.rashi) : '') + (v ? cell('nak', 'النكشاترا', v.nak) : '') + '</div></section>';
  }
  /* ---------- الأقسام ---------- */
  function todayHtml(ch) {
    if (!texts()) return empty('نجهّز لك قراءة اليوم…');
    var tr = transits(ch), mo = tr.moon, out = '';
    if (!mo) return empty('تعذّر حساب سماء اليوم الآن.');
    var L = window.AqLive, d = new Date();
    var dateS = d.toLocaleDateString('ar-EG-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long' });
    var day = L.DAY && L.DAY[mo.house - 1];
    out += '<article class="yt-hero"><small class="yt-k">طاقة اليوم · ' + dateS + '</small><h2>' + esc(L.HEAD && L.HEAD[mo.house - 1] || '') + '</h2><p>' + esc(firstSentence(day)) + '</p>' +
      '<span class="yt-x">القمر في ' + mo.sign + ' · في بيتك ' + HN[mo.house - 1] + '</span><button type="button" class="yt-more" data-yt-open="day"><span>اقرأ يومك كاملًا</span>' + CHEV + '</button></article>';
    out += '<p class="yt-lab">مجالات يومك</p><div class="yt-rows">';
    ['love', 'work', 'money'].forEach(function (a) {
      var t = L.AREA && L.AREA[a] && L.AREA[a][mo.house - 1]; if (!t) return;
      var nm = { love: 'الحب والعلاقات', work: 'العمل', money: 'المال' }[a];
      out += '<button type="button" class="yt-row" data-yt-open="area:' + a + '">' + badge(a) + '<span class="yt-row-t"><b>' + nm + '</b><small>' + esc(firstSentence(t)) + '</small></span>' + CHEV + '</button>';
    });
    out += '</div><p class="yt-lab">ما يعبر بيوتك الآن</p>' + trTable(tr, ['sun', 'mercury', 'venus', 'mars']);
    return out;
  }
  /* ---------- مدة العبور: من الحساب الفلكي الموجود (Astro.chart) ---------- */
  var DAYMS = 864e5, STAYSTEP = { jupiter: 20, saturn: 30, uranus: 60, neptune: 90, pluto: 120 }, STAYC = {};
  function lonAt(k, ms) { try { var c = window.Astro.chart({ utcMs: ms, lat: 30, lon: 31, known: false }), b = body(c, k); return b ? norm(b.lon) : null; } catch (e) { return null; } }
  function houseAtMs(ch, k, ms) { var l = lonAt(k, ms); return l == null ? null : houseOf(ch, l); }
  function edge(ch, k, h, dir) {
    var step = STAYSTEP[k] * DAYMS, now = Date.now(), t = now, last = now, away = null, limit = 70 * 365 * DAYMS;
    for (var i = 0; i < 1400; i++) {
      t += dir * step; if (Math.abs(t - now) > limit) return null;
      var hh = houseAtMs(ch, k, t); if (hh == null) return null;
      if (hh === h) { last = t; away = null; continue; }
      if (away == null) away = t;
      if (Math.abs(t - away) >= 200 * DAYMS) break;
    }
    if (away == null) return null;
    var lo = last, hi = away; /* lo داخل البيت وhi خارجه */
    while (Math.abs(hi - lo) > DAYMS) { var mid = Math.round((lo + hi) / 2); if (houseAtMs(ch, k, mid) === h) lo = mid; else hi = mid; }
    return hi;
  }
  function stay(ch, k, h) {
    var key = k + ':' + h + ':' + (ch.jde || ''); if (STAYC[key] !== undefined) return STAYC[key];
    var a = null, b = null; try { a = edge(ch, k, h, -1); b = edge(ch, k, h, 1); } catch (e) {}
    return (STAYC[key] = (a && b && b > a) ? { start: a, end: b } : null);
  }
  var fmtM = function (ms) { return new Date(ms).toLocaleDateString('ar-EG-u-nu-latn', { month: 'long', year: 'numeric' }); };
  function durTxt(ms) {
    var d = Math.max(0, Math.round(ms / DAYMS)); if (d < 45) return d + ' يوم';
    var m = Math.round(d / 30.44); if (m < 24) return m + ' شهر';
    var y = Math.round(d / 365.25 * 10) / 10; return (y % 1 ? y.toFixed(1) : String(y)) + ' سنة';
  }
  function ringHtml(st) {
    var now = Date.now(), tot = st.end - st.start, pass = Math.min(Math.max(now - st.start, 0), tot), pc = Math.round(pass / tot * 100), R = 30, C = 2 * Math.PI * R;
    return '<div class="yt-tm"><div class="yt-ring"><svg viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="' + R + '" class="yt-r0"/><circle cx="36" cy="36" r="' + R + '" class="yt-r1" stroke-dasharray="' + (C * pc / 100).toFixed(1) + ' ' + C.toFixed(1) + '" transform="rotate(-90 36 36)"/></svg><b>' + pc + '%</b></div>' +
      '<dl class="yt-tml"><div><dt>بدأ</dt><dd>' + fmtM(st.start) + '</dd></div><div><dt>ينتهي</dt><dd>' + fmtM(st.end) + '</dd></div><div><dt>المدة</dt><dd>' + durTxt(tot) + '</dd></div><div><dt>مضى</dt><dd>' + durTxt(pass) + '</dd></div><div><dt>باقي</dt><dd>' + durTxt(tot - pass) + '</dd></div></dl></div>';
  }
  function transitsHtml(ch) {
    if (!texts()) return empty('نجهّز عبوراتك…');
    var tr = transits(ch), R = window.AqReadings, out = '<p class="yt-lab">الكواكب البطيئة: أثرها يمتد أشهرًا</p>' + trTable(tr, ['jupiter', 'saturn', 'uranus', 'neptune', 'pluto']) + '<div class="yt-stack">';
    ['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].forEach(function (k) {
      var t = tr[k]; if (!t) return;
      var cd = card(PN[k] + ' في ' + t.sign + (t.retro ? ' · راجع' : ''), 'تعبر بيتك ' + HN[t.house - 1] + ': ' + HT[t.house - 1], R.TL && R.TL[k] && R.TL[k][t.house - 1], 'tr:' + k, 'الدرجة ' + t.deg, k), sy = stay(ch, k, t.house); out += sy ? cd.replace('</article>', ringHtml(sy) + '</article>') : cd;
    });
    out += '</div>';
    var cyc = []; try { if (window.AqeeqYou && window.Astro) cyc = window.AqeeqYou.cycles(ch, Math.floor(Date.now() / 864e5) * 864e5) || []; } catch (e) {}
    var now = Date.now(), cur = cyc.filter(function (c) { return c.start <= now && c.end >= now; }).sort(function (a, b) { return a.end - b.end; }).slice(0, 4);
    if (cur.length) {
      out += '<p class="yt-lab">دورات جارية عليك</p><div class="yt-stack">' + cur.map(function (c) {
        return '<article class="yt-c yt-cy"><h3>' + esc('دورة ' + c.tn + ' مع ' + c.nn) + '</h3>' + ringHtml({ start: c.start, end: c.end }) + '</article>';
      }).join('') + '</div>';
    }
    return out;
  }
  function areasHtml(ch) {
    return '<div class="yt-grid">' + AREAS.map(function (a) {
      return '<button type="button" class="yt-tile" data-yt-open="areaS:' + a.id + '"><span class="yt-ic">' + SVG(a.ic) + '</span><b>' + a.t + '</b><small>' + a.s + '</small></button>';
    }).join('') + '</div>' + (ch.known ? '' : '<p class="yt-note">وقت ميلادك غير مسجّل، فالبيوت تقريبية. أضفه في «تعديل البيانات الشخصية» لتصير هذه الأقسام دقيقة.</p>');
  }
  function trTable(tr, keys) {
    var rows = keys.map(function (k) { var x = tr[k]; if (!x) return ''; return '<button type="button" class="yt-tr" data-yt-open="tr:' + k + '"><span class="yt-tc yt-th">' + x.house + '</span><span class="yt-tc yt-tp"><i>' + (GL[k] || '') + '\uFE0E</i>' + PN[k] + (x.retro ? ' · راجع' : '') + '</span><span class="yt-tc yt-ts">' + x.sign + '</span></button>'; }).join('');
    return '<div class="yt-tbl" role="table"><div class="yt-tr yt-thead"><span class="yt-tc">بيتك</span><span class="yt-tc">الكوكب</span><span class="yt-tc">البرج</span></div>' + rows + '</div>';
  }
  function tableHtml(p) {
    var rows = PK.map(function (k) { var x = p[k]; if (!x) return ''; return '<button type="button" class="yt-tr" data-yt-open="pl:' + k + '"><span class="yt-tc yt-th">' + x.house + '</span><span class="yt-tc yt-tp"><i>' + (GL[k] || '') + '\uFE0E</i>' + PN[k] + '</span><span class="yt-tc yt-ts">' + x.sign + '</span></button>'; }).join('');
    return '<div class="yt-tbl" role="table"><div class="yt-tr yt-thead"><span class="yt-tc">البيت</span><span class="yt-tc">الكوكب</span><span class="yt-tc">البرج</span></div>' + rows + '</div>';
  }
  function elementsHtml(p) {
    var E = ['نار', 'أرض', 'هواء', 'ماء'], n = [0, 0, 0, 0], tot = 0;
    PK.forEach(function (k) { if (p[k]) { n[p[k].si % 4]++; tot++; } });
    if (!tot) return '';
    return '<p class="yt-lab">عناصر خريطتك</p><div class="yt-el">' + E.map(function (e, i) { var pc = Math.round(n[i] / tot * 100); return '<div class="yt-er yt-e' + i + '"><span>' + e + '</span><div class="yt-bar"><i style="width:' + pc + '%"></i></div><b>' + pc + '%</b></div>'; }).join('') + '</div>';
  }
  function chartHtml(ch) {
    var sw = '<div class="yt-sw" role="tablist"><button type="button" data-yt-sys="west" aria-selected="' + (ST.sys === 'west') + '">الخريطة الغربية</button><button type="button" data-yt-sys="east" aria-selected="' + (ST.sys === 'east') + '">الخريطة الشرقية</button></div>';
    if (ST.sys === 'east') return sw + eastHtml(ch);
    var p = natalPl(ch);
    return sw + tableHtml(p) + elementsHtml(p) + '<p class="yt-lab">اقرأ كل كوكب</p><div class="yt-rows">' + PK.map(function (k) {
      var x = p[k]; if (!x) return '';
      return '<button type="button" class="yt-row" data-yt-open="pl:' + k + '">' + badge(k) + '<span class="yt-row-t"><b>' + PN[k] + ' في ' + x.sign + '</b><small>البيت ' + HN[x.house - 1] + ' · ' + HT[x.house - 1] + '</small></span>' + CHEV + '</button>';
    }).join('') + '</div>' + (ch.known ? '' : '<p class="yt-note">وقت ميلادك غير مسجّل، فأرقام البيوت تقريبية.</p>');
  }
  function eastHtml(ch) {
    var v = window.AqeeqLive && window.AqeeqLive.vedic(ch), vc = vedicChart(ch), out = '';
    if (v) out += '<article class="yt-hero yt-soft"><small class="yt-k">بصمتك الفيدية · لاهيري</small><h2>برج القمر ' + esc(v.rashi) + '</h2><span class="yt-x">النكشاترا ' + esc(v.nak) + ' · بادا ' + v.pada + (v.asc ? ' · الطالع ' + esc(v.asc) : '') + '</span></article>';
    if (!vc) return out + '<p class="yt-note">البيوت الفيدية تحتاج وقت ميلادك. أضفه لتظهر لك قراءة كل بيت.</p>';
    if (!ST.vd) return out + empty('نجهّز قراءة الخريطة الفيدية…');
    var occ = {}; Object.keys(vc.pl).forEach(function (k) { var h = vc.pl[k].house; (occ[h] = occ[h] || []).push(k); });
    out += '<p class="yt-lab">بيوتك المشغولة في الخريطة الفيدية</p><div class="yt-rows">';
    Object.keys(occ).sort(function (a, b) { return a - b; }).forEach(function (h) {
      out += '<button type="button" class="yt-row" data-yt-open="vh:' + h + '"><span class="yt-bd yt-num">' + h + '</span><span class="yt-row-t"><b>البيت ' + HN[h - 1] + ' · ' + HT[h - 1] + '</b><small>' + occ[h].map(function (k) { return VN[k]; }).join('، ') + '</small></span>' + CHEV + '</button>';
    });
    return out + '</div>';
  }
  /* ---------- الورقة ---------- */
  function sheetBody(key, ch) {
    var parts = key.split(':'), kind = parts[0], id = parts[1], R = window.AqReadings || {}, L = window.AqLive || {}, S = window.AqSignReads || {}, tr = transits(ch), mo = tr.moon || {}, p = natalPl(ch), ttl = '', sub = '', body = [];
    if (kind === 'day') { ttl = 'يومك'; sub = 'القمر في بيتك ' + HN[(mo.house || 1) - 1]; body = paras(L.DAY && L.DAY[(mo.house || 1) - 1]); }
    else if (kind === 'area') { ttl = { love: 'الحب والعلاقات', work: 'العمل', money: 'المال' }[id]; sub = 'يومك في هذا المجال'; body = paras(L.AREA && L.AREA[id] && L.AREA[id][(mo.house || 1) - 1]); }
    else if (kind === 'tr') { var t = tr[id]; ttl = PN[id] + ' في ' + t.sign; sub = 'تعبر بيتك ' + HN[t.house - 1] + ' · ' + HT[t.house - 1]; body = paras(R.TR && R.TR[id] && R.TR[id][t.house - 1]); if (t.retro && R.RT && R.RT[id]) body = body.concat(paras(R.RT[id])); }
    else if (kind === 'pl') { var x = p[id]; ttl = PN[id] + ' في ' + x.sign; sub = 'في خريطتك: البيت ' + HN[x.house - 1] + ' · ' + HT[x.house - 1]; body = paras(S[id] && S[id][x.si]).concat(paras(R.PH && R.PH[id] && R.PH[id][x.house - 1])); }
    else if (kind === 'vh') { var d = ST.vd && ST.vd.charts['1'].houseReadings[id]; ttl = 'البيت ' + HN[id - 1] + ' الفيدي'; sub = HT[id - 1]; if (d) body = [d.lead].concat(d.paragraphs || []); }
    else if (kind === 'areaS') {
      var a = AREAS.filter(function (z) { return z.id === id; })[0]; ttl = a.t; sub = 'ما تقوله خريطتك عن هذا المجال'; var html = '';
      a.h.forEach(function (h) {
        var inH = PK.filter(function (k) { return p[k] && p[k].house === h; }), tIn = PK.filter(function (k) { return tr[k] && tr[k].house === h && ['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].indexOf(k) >= 0; });
        html += '<h4>البيت ' + HN[h - 1] + ' · ' + HT[h - 1] + '</h4>';
        if (!inH.length) html += '<p class="yt-quiet">لا كوكب شخصي في هذا البيت عند ميلادك، فيتحرك مجاله بالعبور أكثر من الطبع.</p>';
        inH.forEach(function (k) { html += '<section class="yt-sec"><small>' + PN[k] + ' في ' + p[k].sign + '</small>' + paras(R.PH && R.PH[k] && R.PH[k][h - 1]).map(function (q) { return '<p>' + esc(q) + '</p>'; }).join('') + '</section>'; });
        tIn.forEach(function (k) { html += '<section class="yt-sec yt-now"><small>الآن: ' + PN[k] + ' يعبر هذا البيت</small>' + paras(R.TR && R.TR[k] && R.TR[k][h - 1]).map(function (q) { return '<p>' + esc(q) + '</p>'; }).join('') + '</section>'; });
      });
      var vc = vedicChart(ch);
      if (vc && ST.vd) {
        var hs = AREAS.filter(function (z) { return z.id === id; })[0].h, vh = hs.filter(function (h) { return Object.keys(vc.pl).some(function (k) { return vc.pl[k].house === h; }); });
        if (vh.length) { html += '<h4 class="yt-east">من خريطتك الفيدية</h4>'; vh.forEach(function (h) { var d = ST.vd.charts['1'].houseReadings[h]; if (d) html += '<section class="yt-sec yt-v"><small>البيت ' + HN[h - 1] + ' الفيدي</small><p class="yt-lead">' + esc(d.lead) + '</p>' + (d.paragraphs || []).map(function (q) { return '<p>' + esc(q) + '</p>'; }).join('') + '</section>'; }); }
      }
      return { ttl: ttl, sub: sub, html: html };
    }
    var kick = kind === 'pl' ? '<small class="yt-k yt-mine">ده نمطك</small>' : '';
    return { ttl: ttl, sub: sub, html: kick + body.map(function (q, i) { return '<p' + (i === 0 ? ' class="yt-lead"' : '') + '>' + esc(q) + '</p>'; }).join('') };
  }
  function openSheet(key) {
    var ch = natal(); if (!ch) return; var b; try { b = sheetBody(key, ch.ch); } catch (e) { return; }
    var old = $('#yt-sheet'); if (old) old.remove();
    var el = document.createElement('div'); el.id = 'yt-sheet'; el.className = 'yt-sheet'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML = '<div class="yt-sh-top"><button type="button" class="yt-sh-x" data-yt-close aria-label="إغلاق">' + SVG('<path d="M6 6l12 12M18 6L6 18"/>') + '</button><div><small>' + esc(b.sub) + '</small><h3>' + esc(b.ttl) + '</h3></div></div><div class="yt-sh-s"><div class="yt-sh-c">' + b.html + '<button type="button" class="yt-sh-end" data-yt-close>إغلاق</button></div></div>';
    document.body.appendChild(el); document.documentElement.classList.add('yt-open'); requestAnimationFrame(function () { el.classList.add('on'); });
  }
  function closeSheet() { var el = $('#yt-sheet'); if (el) el.remove(); document.documentElement.classList.remove('yt-open'); }
  /* ---------- التركيب ---------- */
  var TABS = [['today', 'اليوم'], ['transits', 'عبوراتك'], ['areas', 'مجالاتك'], ['chart', 'خريطتك']];
  function view() {
    var mine = natal();
    if (!mine) return '<div class="yt-root"><div class="yt-empty"><h3>خريطتك تبدأ من ميلادك</h3><p>أضف تاريخ ومكان ميلادك من «تعديل البيانات الشخصية»، لتظهر لك هنا قراءة يومك وعبوراتك ومجالات حياتك من خريطتك أنت.</p><button type="button" class="yt-cta" data-yt-profile>افتح ملفك الشخصي</button></div></div>';
    var ch = mine.ch, u = window.AqSession && window.AqSession.user, nm = u && u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name) || '', first = String(nm).split(/\s+/)[0];
    var sec = ST.tab === 'today' ? todayHtml(ch) : ST.tab === 'transits' ? transitsHtml(ch) : ST.tab === 'areas' ? areasHtml(ch) : chartHtml(ch);
    return '<div class="yt-root">' + (first ? '<h2 class="yt-hi">أهلًا ' + esc(first) + '</h2>' : '') + identity(ch, mine) +
      '<div class="yt-tabs" role="tablist" style="--i:' + TABS.map(function (t) { return t[0]; }).indexOf(ST.tab) + '">' + TABS.map(function (t) { return '<button type="button" role="tab" data-yt-tab="' + t[0] + '" aria-selected="' + (ST.tab === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div>' +
      '<div class="yt-sec-body">' + sec + '</div></div>';
  }
  var busy = false;
  function mount(force) {
    if (busy) return; busy = true;
    try {
      var yp = $('#fy-body .yp.yp-t-home'); if (!yp) return;
      var host = $('.yp-body', yp); if (!host) return;
      yp.classList.add('yt-on');
      if (!force && $('.yt-root', host)) return;
      loadAll();
      var sc = host.scrollTop; host.innerHTML = view(); host.scrollTop = sc;
    } finally { busy = false; }
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-yt-tab],[data-yt-sys],[data-yt-open],[data-yt-close],[data-yt-profile]') : null; if (!t) return;
    if (t.hasAttribute('data-yt-tab')) { ST.tab = t.getAttribute('data-yt-tab'); mount(true); }
    else if (t.hasAttribute('data-yt-sys')) { ST.sys = t.getAttribute('data-yt-sys'); mount(true); }
    else if (t.hasAttribute('data-yt-open')) openSheet(t.getAttribute('data-yt-open'));
    else if (t.hasAttribute('data-yt-close')) closeSheet();
    else if (t.hasAttribute('data-yt-profile')) { var b = $('#fy-body .yp-av-b'); if (b) b.click(); }
  });
  var mo = new MutationObserver(function () { if (!busy) mount(false); });
  function start() { var h = document.getElementById('fy-body'); if (!h) return setTimeout(start, 400); mo.observe(h, { childList: true, subtree: true }); mount(false); }
  document.addEventListener('aq:session', function () { setTimeout(function () { mount(true); }, 300); });
  start();
})();
