/* خريطة السماء العالمية (قسم السماء): لحظة سماء لأي تاريخ ووقت ومدينة في الشرق الأوسط.
   تقرأ من محرك Astro الموجود (نفس الحسابات) ولا تغيّر أي منطق آخر. الحمل ٠° مع الطالع عند اليسار كالخرائط التقليدية. */
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
  var SIGNS = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var PL = [['sun', 'الشمس'], ['moon', 'القمر'], ['mercury', 'عطارد'], ['venus', 'الزهرة'], ['mars', 'المريخ'], ['jupiter', 'المشتري'], ['saturn', 'زحل'], ['uranus', 'أورانوس'], ['neptune', 'نبتون'], ['pluto', 'بلوتو']];
  var PHASES = [[348.75, 'محاق'], [11.25, 'هلال متزايد'], [78.75, 'التربيع الأول'], [101.25, 'أحدب متزايد'], [168.75, 'بدر'], [191.25, 'أحدب متناقص'], [258.75, 'التربيع الأخير'], [281.25, 'هلال متناقص']];
  var GLY = {};
  var $ = function (id) { return document.getElementById(id); };
  var dateI = $('swc-date'), timeI = $('swc-time'), citySel = $('swc-city'), listEl = $('swc-list'), capEl = $('swc-cap'), moonEl = $('swc-moon'), errEl = $('swc-err');
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
  function glyph(k, cls) { var d = GLY[k]; return d ? '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>' : ''; }

  function compute() {
    GLY = window.AqeeqGL || GLY;
    var A = window.Astro; if (!A || typeof A.chart !== 'function') throw new Error('engine');
    var c = CITIES[+citySel.value] || CITIES[0], v = dateI.value, tv = timeI.value;
    if (!v || !tv) throw new Error('empty');
    var dp = v.split('-').map(Number), tp = tv.split(':').map(Number);
    if (dp[0] < 1900 || dp[0] > 2100) throw new Error('range');
    var utc = A.localToUtcMs(dp[0], dp[1], dp[2], tp[0], tp[1], c[3]);
    var ch = A.chart({ utcMs: utc, lat: c[1], lon: c[2], hs: 'placidus', known: true });
    return { ch: ch, city: c, y: dp[0], m: dp[1], d: dp[2], hh: tp[0], mm: tp[1] };
  }

  /* ---------- الرسم ---------- */
  var C = 230;
  function pt(r, lon, asc) { var th = (270 - mod(lon - asc)) * Math.PI / 180; return [C + r * Math.sin(th), C - r * Math.cos(th)]; }
  function f1(n) { return n.toFixed(1); }
  function line(a, b, extra) { return '<path d="M' + f1(a[0]) + ' ' + f1(a[1]) + 'L' + f1(b[0]) + ' ' + f1(b[1]) + '" ' + (extra || '') + '/>'; }
  function draw(st) {
    var ch = st.ch, asc = ch.asc, mc = ch.mc, o = '';
    o += '<defs><radialGradient id="swcG" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFF3D2" stop-opacity=".8"/><stop offset=".6" stop-color="#C0553A" stop-opacity=".12"/><stop offset="1" stop-color="#4A1521" stop-opacity="0"/></radialGradient></defs>';
    o += '<circle cx="' + C + '" cy="' + C + '" r="208" fill="rgba(255,244,214,.2)"/>';
    o += '<g stroke="#4A1521" fill="none"><circle cx="' + C + '" cy="' + C + '" r="208" stroke-width="1.8"/><circle cx="' + C + '" cy="' + C + '" r="176" stroke-width="1"/><circle cx="' + C + '" cy="' + C + '" r="96" stroke-width="1"/></g>';
    var t = ''; for (var a = 0; a < 360; a += 5) { var p1 = pt(208, a, asc), p3 = pt(a % 30 ? 202 : 197, a, asc); t += line(p1, p3); }
    o += '<g stroke="#4A1521" stroke-width=".8" stroke-opacity=".7">' + t + '</g>';
    var sp = ''; for (var i = 0; i < 12; i++) sp += line(pt(176, i * 30, asc), pt(208, i * 30, asc));
    o += '<g stroke="#4A1521" stroke-width=".9" stroke-opacity=".7">' + sp + '</g>';
    var gs = '', sc = 1.0;
    for (i = 0; i < 12; i++) { var q = pt(192, i * 30 + 15, asc), d = GLY['s' + i]; if (d) gs += '<path transform="translate(' + f1(q[0] - 12 * sc) + ' ' + f1(q[1] - 12 * sc) + ') scale(' + sc + ')" d="' + d + '"/>'; }
    o += '<g stroke="#4A1521" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none">' + gs + '</g>';
    /* بيوت: خطوط القمم + أرقام */
    var cu = ch.cusps, hl = '', hn = '';
    for (i = 0; i < 12; i++) {
      var ang = i % 3 === 0;
      hl += line(pt(96, cu[i], asc), pt(176, cu[i], asc), 'stroke-width="' + (ang ? 1.8 : .8) + '" stroke-opacity="' + (ang ? .95 : .55) + '"');
      var mid = cu[i] + mod(cu[(i + 1) % 12] - cu[i]) / 2, q2 = pt(84, mid, asc);
      hn += '<text x="' + f1(q2[0]) + '" y="' + f1(q2[1] + 3.2) + '" text-anchor="middle">' + (i + 1) + '</text>';
    }
    o += '<g stroke="#4A1521">' + hl + '</g><g font-size="9" fill="#6B2234" fill-opacity=".8" font-family="Cairo,sans-serif">' + hn + '</g>';
    o += '<g stroke="#4A1521" stroke-width="2.2">' + line(pt(96, asc, asc), pt(208, asc, asc)) + line(pt(96, asc + 180, asc), pt(208, asc + 180, asc)) + line(pt(96, mc, asc), pt(208, mc, asc)) + line(pt(96, mc + 180, asc), pt(208, mc + 180, asc)) + '</g>';
    var lb = function (lon, tx) { var q = pt(222, lon, asc); return '<text x="' + f1(q[0]) + '" y="' + f1(q[1] + 4) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#4A1521" font-family="Cairo,sans-serif">' + tx + '</text>'; };
    o += lb(asc, 'AS') + lb(asc + 180, 'DS') + lb(mc, 'MC') + lb(mc + 180, 'IC');
    /* كواكب */
    var items = PL.map(function (p) { var b = null; for (var j = 0; j < ch.bodies.length; j++) if (ch.bodies[j].key === p[0]) b = ch.bodies[j]; return b ? { k: p[0], n: p[1], lon: mod(b.lon), retro: !!b.retro, sign: b.sign } : null; }).filter(Boolean);
    var sorted = items.slice().sort(function (a, b) { return a.lon - b.lon; }), last = -99, lvl = 0;
    sorted.forEach(function (it) { lvl = (it.lon - last < 9) ? (lvl + 1) % 3 : 0; it.r = 154 - lvl * 18; last = it.lon; });
    var asp = '', cols = { 60: '#3D6B5A', 90: '#9C2F2F', 120: '#3D6B5A', 180: '#9C2F2F' };
    for (i = 0; i < sorted.length; i++) for (var j2 = i + 1; j2 < sorted.length; j2++) {
      var dd = Math.abs(sorted[i].lon - sorted[j2].lon); if (dd > 180) dd = 360 - dd;
      var hit = [[60, 4], [90, 5], [120, 6], [180, 6]].filter(function (x) { return Math.abs(dd - x[0]) <= x[1]; })[0];
      if (hit) asp += line(pt(96, sorted[i].lon, asc), pt(96, sorted[j2].lon, asc), 'stroke="' + cols[hit[0]] + '" stroke-opacity=".6"');
    }
    o += '<g fill="none" stroke-width="1">' + asp + '</g><circle cx="' + C + '" cy="' + C + '" r="44" fill="url(#swcG)"/>';
    o += sorted.map(function (it) {
      var p = pt(it.r, it.lon, asc), q = pt(96, it.lon, asc), g = GLY[it.k] || '';
      return '<g class="swc-pl" data-k="' + it.k + '" tabindex="0"><title>' + it.n + ' · ' + SIGNS[it.sign] + ' ' + dm(it.lon) + (it.retro ? ' · متراجع' : '') + '</title>' + line(q, p, 'stroke="#4A1521" stroke-width=".8" stroke-opacity=".5"') +
        '<circle class="swc-dot" cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="13" fill="#4A1521" stroke="#C5A059" stroke-width="1"/>' +
        '<path transform="translate(' + f1(p[0] - 8.5) + ' ' + f1(p[1] - 8.5) + ') scale(.708)" d="' + g + '" fill="none" stroke="#F6DDA8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        (it.retro ? '<circle cx="' + f1(p[0] + 10) + '" cy="' + f1(p[1] - 10) + '" r="5.2" fill="#C0553A"/><text x="' + f1(p[0] + 10) + '" y="' + f1(p[1] - 7.6) + '" font-size="7" font-weight="700" text-anchor="middle" fill="#fff" font-family="Cairo,sans-serif">R</text>' : '') + '</g>';
    }).join('');
    svg.innerHTML = o;
    return items;
  }

  function renderList(st, items) {
    var ch = st.ch, rows = items.map(function (it) {
      return '<li class="swc-row' + (it.retro ? ' is-retro' : '') + '" data-k="' + it.k + '" tabindex="0"><span class="swc-ic">' + glyph(it.k) + '</span><b>' + it.n + (it.retro ? ' <em>R</em>' : '') + '</b><span class="swc-deg">' + dm(it.lon) + '</span><span class="swc-sg">' + glyph('s' + it.sign) + SIGNS[it.sign] + '</span></li>';
    });
    function ang(label, lon) { var s = Math.floor(mod(lon) / 30); return '<li class="swc-row swc-axis"><span class="swc-ic swc-ax">' + label + '</span><b>' + (label === 'AS' ? 'الطالع' : 'وسط السماء') + '</b><span class="swc-deg">' + dm(lon) + '</span><span class="swc-sg">' + glyph('s' + s) + SIGNS[s] + '</span></li>'; }
    listEl.innerHTML = ang('AS', ch.asc) + ang('MC', ch.mc) + rows.join('');
    var sun = items.filter(function (i) { return i.k === 'sun'; })[0], moon = items.filter(function (i) { return i.k === 'moon'; })[0];
    if (sun && moon) { var el = mod(moon.lon - sun.lon), il = Math.round((1 - Math.cos(el * Math.PI / 180)) / 2 * 100); moonEl.innerHTML = '<span class="swc-ic">' + glyph('moon') + '</span><div><b>مرحلة القمر</b><small>' + phaseName(el) + ' · إضاءة ' + il + '%</small></div>'; }
  }

  function highlight(k) {
    sel = k;
    [].forEach.call(svg.querySelectorAll('.swc-pl'), function (g) { g.classList.toggle('is-sel', g.getAttribute('data-k') === k); });
    [].forEach.call(listEl.querySelectorAll('.swc-row[data-k]'), function (r) { r.classList.toggle('is-sel', r.getAttribute('data-k') === k); });
  }

  function render() {
    errEl.hidden = true;
    var st;
    try { st = compute(); } catch (e) {
      errEl.textContent = e.message === 'range' ? 'اختر تاريخاً بين 1900 و2100.' : (e.message === 'empty' ? 'أدخل التاريخ والوقت أولاً.' : 'تعذر حساب الخريطة حالياً.');
      errEl.hidden = false; return;
    }
    cur = st; var items = draw(st); renderList(st, items); if (sel) highlight(sel);
    var w = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][new Date(Date.UTC(st.y, st.m - 1, st.d)).getUTCDay()];
    capEl.textContent = w + ' ' + st.d + '/' + st.m + '/' + st.y + ' · ' + p2(st.hh) + ':' + p2(st.mm) + ' بتوقيت ' + st.city[0] + (live ? ' · مباشر' : '');
    syncSky();
  }
  /* يربط قسم الرصد الموجود بنفس اليوم (بدون تغيير منطقه) */
  function syncSky() {
    var s = document.getElementById('sky-date'); if (!s) return;
    var v = live ? '' : dateI.value; if (s.value === v) return; s.value = v; s.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function setQuick(btn) { [].forEach.call(form.querySelectorAll('.swc-quick button'), function (b) { b.classList.toggle('is-on', b === btn); }); }
  form.addEventListener('submit', function (e) { e.preventDefault(); live = false; setQuick(null); render(); });
  form.querySelector('.swc-quick').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var off = +b.getAttribute('data-off'), c = CITIES[+citySel.value], t = addDays(nowLocal(c), off);
    setInputs(t); live = off === 0; setQuick(b); render();
  });
  [dateI, timeI, citySel].forEach(function (el) { el.addEventListener('change', function () { if (el === citySel && live) { setInputs(nowLocal(CITIES[+citySel.value])); } else { live = false; setQuick(null); } render(); }); });
  function pick(e) { var n = e.target.closest('[data-k]'); if (n) highlight(sel === n.getAttribute('data-k') ? null : n.getAttribute('data-k')); }
  svg.addEventListener('click', pick); listEl.addEventListener('click', pick);
  [svg, listEl].forEach(function (n) { n.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(e); } }); });

  function init() { try { setInputs(nowLocal(CITIES[0])); render(); } catch (e) { errEl.textContent = 'تعذر حساب الخريطة حالياً.'; errEl.hidden = false; } }
  window.addEventListener('load', init);
  if (document.readyState === 'complete') init();
  setInterval(function () { if (live && !document.hidden) { setInputs(nowLocal(CITIES[+citySel.value])); render(); } }, 60000);
  window.__swc = { render: render, state: function () { return cur; } };
})();
