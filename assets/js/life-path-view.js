/* مسار الحياة — طبقة عرض فقط. تقرأ نتيجة المحرك الحالي (AqeqPinnaclesChallenges + ما رسمه renderLP)
   ولا تحسب أي قيمة جديدة: الأعمار والفترات والقراءات كلها من المحرك الحالي. */
(function () {
  'use strict';
  var root = document.getElementById('lpresult'); if (!root) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var navCount = 0; window.addEventListener('hashchange', function () { navCount++; });
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var NA = '<span class="lpj-na">غير متوفر حاليًا</span>';
  var I = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    life: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19l5-6 4 3 7-10"/><path d="M15 6h5v5"/></svg>',
    peak: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 19l6-10 4 6 3-4 5 8z"/></svg>',
    gate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 20V10a7 7 0 0 1 14 0v10"/><path d="M9 20v-6h6v6"/></svg>',
    dot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
    door: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h13M12 6l6 6-6 6"/></svg>',
    full: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M8 12.5l3 3 5-6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    past: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    here: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="5"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" width="18" height="18"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/></svg>',
    matrix: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9 9-9 9-9-9z"/><path d="M12 8l4 4-4 4-4-4z"/></svg>',
    pair: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/></svg>',
    read: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/></svg>'
  };
  var STAGE_ICO = [I.dot, I.door, I.peak, I.full];
  var STATUS = { past: ['مرحلة سابقة', I.past], current: ['المرحلة الحالية', I.here], future: ['مرحلة قادمة', I.next] };
  var TIPS = {
    life: 'الرقم الأساسي الناتج عن تاريخ ميلادك في المحرك الحالي.',
    peak: 'القمة: فترة عمرية لها رقمها وطابعها ضمن القمم الأربع.',
    chal: 'التحدي: درس يرافق فترة عمرية معينة ضمن التحديات الأربعة.'
  };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var building = false, lastKey = '';

  function readInputs() {
    var num = $('.numbadge', root), dEl = document.getElementById('lp-date');
    if (!num || !dEl || !dEl.value) return null;
    var lp = parseInt(num.textContent, 10), p = dEl.value.split('-').map(Number);
    if (!lp || p.length !== 3) return null;
    var h3 = $('.res-head h3', root), tg = $('.res-head .tg2', root), nm = document.getElementById('lp-name');
    return { lp: lp, y: p[0], m: p[1], d: p[2], title: h3 ? h3.textContent.trim() : '', tag: tg ? tg.textContent.trim() : '', name: nm ? nm.value.trim() : '' };
  }
  function ageOf(y, m, d) { var n = new Date(), a = n.getFullYear() - y; if (n.getMonth() + 1 < m || (n.getMonth() + 1 === m && n.getDate() < d)) a--; return Math.max(0, a); }
  function stageIndex(res, age) {
    for (var i = 0; i < res.pinnacles.length; i++) { var p = res.pinnacles[i].period; if (age >= p.startAge && (p.endAge == null || age <= p.endAge)) return i; }
    return res.pinnacles.length - 1;
  }
  function statusOf(i, cur) { return i < cur ? 'past' : i === cur ? 'current' : 'future'; }
  function pad(n) { return String(n).padStart(2, '0'); }

  function orbit() {
    return '<svg viewBox="0 0 560 360" fill="none" stroke="#D9B979" stroke-width="1" aria-hidden="true" style="opacity:.55"><circle cx="280" cy="180" r="170"/><circle cx="280" cy="180" r="124" stroke-opacity=".6"/><circle cx="280" cy="180" r="78" stroke-opacity=".45"/><path d="M40 300 C 150 300, 190 210, 280 180 S 430 80, 540 50" stroke-width="1.4"/><circle cx="540" cy="50" r="4" fill="#D9B979"/><circle cx="280" cy="180" r="3" fill="#D9B979"/></svg>';
  }
  function stairs() { return '<svg class="lpj-stairs" viewBox="0 0 240 46" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" aria-hidden="true"><path d="M2 42h52V30h52V18h52V6h28"/></svg>'; }

  function section(head, sub, body, id, d) { return '<section class="lpj-sec lpj-reveal" style="--d:' + d + 'ms"' + (id ? ' id="' + id + '"' : '') + '><h2>' + head + '</h2>' + (sub ? '<p class="sub">' + sub + '</p>' : '') + body + '</section>'; }

  function build(inp) {
    var PC = window.AqeqPinnaclesChallenges;
    var res = PC.calculatePinnaclesChallenges(inp.d, inp.m, inp.y, inp.lp);
    var age = ageOf(inp.y, inp.m, inp.d), cur = stageIndex(res, age);
    var pr = function (v) { return PC.getPinnacleReading(v); }, cr = function (v) { return PC.getChallengeReading(v); };
    var P = res.pinnacles, C = res.challenges;
    var curP = P[cur], curC = C[cur];
    var state = { sel: cur };

    var crumb = '<nav aria-label="مسار التنقل"><ol class="lpj-crumb"><li><a href="#home">الرئيسية</a></li><li><a href="#aqh-tools">اكتشف ذاتك</a></li><li aria-current="page">مسار الحياة</li></ol></nav>' +
      '<button type="button" class="lpj-back" data-lpj-back aria-label="رجوع">' + I.back + '<span>رجوع</span></button>';
    var intro = '<header class="lpj-intro lpd-intro lpj-reveal"><h1>مسار حياتك</h1><p>اقرأ الإيقاع العام لرحلتك، والمراحل التي تحمل دروسك ونقاط تحوّلك.</p></header>';
    var IC = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
    var chips = '<div class="lpd-chips lpj-reveal" style="--d:60ms">' +
      '<div class="lpd-chip"><span class="lpd-ci">' + IC('<circle cx="12" cy="8" r="4"/><path d="M4.500 20.500a7.500 7.500 0 0 1 15 0"/>') + '</span><span class="lpd-ct"><small>الاسم</small><b>' + esc(inp.name || 'مسارك الشخصي') + '</b></span></div>' +
      '<div class="lpd-chip"><span class="lpd-ci">' + IC('<rect x="3.500" y="5" width="17" height="15" rx="2.500"/><path d="M3.500 10h17M8 3v4M16 3v4"/>') + '</span><span class="lpd-ct"><small>تاريخ الميلاد · العمر ' + age + ' سنة</small><b>' + pad(inp.d) + '/' + pad(inp.m) + '/' + inp.y + '</b></span></div>' +
      '<div class="lpd-acts"><button type="button" class="lpj-btn ghost" data-lpj-interp><span>القراءة الكاملة</span></button><a class="lpj-btn ghost" href="#lifepath-compat"><span>قارن مساري الحياة</span>' + I.arrow + '</a>' +
      '<button type="button" class="lpj-btn ghost" data-lpj-edit><span>تعديل التاريخ</span></button></div></div>';
    function metric(ico, label, tip, val, desc, d) {
      return '<div class="lpj-m lpj-reveal" style="--d:' + d + 'ms"><span class="lpj-ico">' + ico + '</span><div><small>' + label + '<button type="button" class="lpj-tip" data-tip="' + esc(tip) + '" aria-label="' + esc(tip) + '">؟</button></small><b>' + val + '</b><span class="d">' + desc + '</span></div></div>';
    }
    var nextP = cur < P.length - 1 ? P[cur + 1] : null, nextRd = nextP ? pr(nextP.value) : null, curRd = pr(curP && curP.value);
    var metrics = '<aside class="lpd-read"><h3>' + IC('<path d="M6 20V10M12 20V4M18 20v-7"/>') + 'قراءة المسار</h3><p class="lpd-sub">خلاصة سريعة من مسارك الشخصي</p><div class="lpj-metrics">' +
      metric(I.life, 'رقم المسار', TIPS.life, inp.lp, esc(inp.title.replace(/^.*?:\s*/, '')) || '', 160) +
      metric(I.dot, 'المرحلة الحالية', TIPS.peak, curRd ? esc(curRd.title) : (curP ? 'القمة ' + curP.value : NA), curP && curP.period ? esc(curP.period.label) : '', 230) +
      metric(I.door, 'الاتجاه القادم', 'المرحلة التالية في رحلتك حسب القمم الأربع.', nextRd ? esc(nextRd.title) : (nextP ? 'القمة ' + nextP.value : 'اكتمال الدورة'), nextP ? esc(nextP.period.label) : 'أنت في آخر مراحل الدورة', 300) + '</div></aside>';

    /* مؤشر رمزي مشتق من أرقام الميلاد: يتغير مع كل تاريخ (ليس قياسًا علميًا) */
    var AFF = { 1: [.4, .9, .5, .7], 2: [.9, .5, .6, .4], 3: [.8, .6, .5, .6], 4: [.5, .8, .4, .9], 5: [.6, .6, .5, .9], 6: [.9, .6, .6, .5], 7: [.5, .5, .95, .4], 8: [.4, .95, .5, .7], 9: [.8, .5, .9, .5] };
    function root9(n) { n = Number(n) || 1; if (n === 11) return 2; if (n === 22) return 4; if (n === 33) return 6; while (n > 9) n = String(n).split('').reduce(function (a, b) { return a + Number(b); }, 0); return n || 9; }
    var nums = [[inp.lp, 3], [curP && curP.value, 2], [curC && curC.value, 1], [inp.d, 1], [inp.m, 1], [inp.y, 1]];
    var DIM = [0, 0, 0, 0], W = 0;
    nums.forEach(function (x) { var a = AFF[root9(x[0])] || AFF[9]; for (var k = 0; k < 4; k++) DIM[k] += a[k] * x[1]; W += x[1]; });
    var spirit = [11, 22, 33].indexOf(inp.lp) > -1 ? .06 : 0;
    var DPCT = DIM.map(function (v, k) { return Math.max(35, Math.min(97, Math.round((v / W + (k === 2 ? spirit : 0)) * 100))); });
    var DNAMES = ['العاطفي', 'المهني', 'الروحي', 'الجسدي'];
    var BAL = Math.round(DPCT.reduce(function (a, b) { return a + b; }, 0) / 4);
    var KEYW = { 1: ['الريادة', 'الاستقلال', 'المبادرة'], 2: ['التعاون', 'الحساسية', 'الانسجام'], 3: ['التعبير', 'الإبداع', 'الألفة'], 4: ['الاستقرار', 'النظام', 'البناء'], 5: ['الحرية', 'التغيير', 'المغامرة'], 6: ['الرعاية', 'المسؤولية', 'الجمال'], 7: ['التأمل', 'التحليل', 'الحكمة'], 8: ['القوة', 'الإنجاز', 'الوفرة'], 9: ['الإنسانية', 'الاكتمال', 'العطاء'] };
    var KW = KEYW[root9(inp.lp)];
    var growthRd = cr(curC && curC.value), growthT = growthRd && growthRd.title ? growthRd.title : (curC ? 'التحدي ' + curC.value : NA);
    var growthTxt = growthRd && (growthRd.essence || growthRd.lesson) ? String(growthRd.essence || growthRd.lesson) : '';
    if (growthTxt.length > 150) growthTxt = growthTxt.slice(0, 147).replace(/\s+\S*$/, '') + '…';
    var lowK = DPCT.indexOf(Math.min.apply(null, DPCT));
    var quote = (curRd && (curRd.reflection || curRd.essence)) || '';
    if (quote.length > 130) quote = quote.slice(0, 127).replace(/\s+\S*$/, '') + '…';
    var CIRC = 2 * Math.PI * 52;
    var tri = '<div class="lpd-tri">' +
      '<section class="lpd-card lpj-reveal" style="--d:380ms"><h3>' + IC('<path d="M12 3v18M5 7h14M5 7l-3 7a3.500 3.500 0 0 0 6 0zM19 7l-3 7a3.500 3.500 0 0 0 6 0z"/>') + 'مؤشر التوازن</h3><p class="lpd-sub">مؤشر رمزي من أرقام ميلادك لتوازن جوانب حياتك</p>' +
      '<div class="lpd-bal"><div class="lpd-donut" data-pct="' + BAL + '"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="lpd-d-bg"/><circle cx="60" cy="60" r="52" class="lpd-d-fg" stroke-dasharray="' + CIRC.toFixed(1) + '" stroke-dashoffset="' + CIRC.toFixed(1) + '" data-off="' + (CIRC * (1 - BAL / 100)).toFixed(1) + '" transform="rotate(-90 60 60)"/></svg><b data-count="' + BAL + '">0%</b></div>' +
      '<div class="lpd-bars">' + DNAMES.map(function (n, k) { return '<div class="lpd-br"><span>' + n + '</span><span class="lpd-bar"><i data-w="' + DPCT[k] + '"></i></span><b data-count="' + DPCT[k] + '">0%</b></div>'; }).join('') + '</div></div></section>' +
      '<section class="lpd-card lpj-reveal" style="--d:450ms"><h3>' + IC('<path d="M5 19c0-8 5-13 14-14 0 9-5 14-14 14zM5 19 13 11"/>') + 'مجال النمو</h3><p class="lpd-sub">مجال يحتاج إلى تركيزك في مرحلتك الحالية</p>' +
      '<div class="lpd-grow"><div class="lpd-gico">' + IC('<path d="M12 21v-9M12 12c0-4-3-6-7-6 0 4 3 6 7 6zM12 14c0-3 2.500-5 6-5 0 3-2.500 5-6 5z"/>') + '</div><div><h4>' + esc(growthT) + '</h4>' + (growthTxt ? '<p>' + esc(growthTxt) + '</p>' : '') + '<span class="lpd-badge">' + (curC ? 'التحدي ' + curC.value : '') + ' · عناية بالجانب ' + DNAMES[lowK] + '</span></div></div></section>' +
      '<section class="lpd-card lpj-reveal" style="--d:520ms"><h3>' + IC('<path d="M12 3l2.500 6.500L21 12l-6.500 2.500L12 21l-2.500-6.500L3 12l6.500-2.500z"/>') + 'الرسالة الأساسية</h3><p class="lpd-sub">الجوهر الذي تحمله وتقدمه للعالم</p>' +
      (quote ? '<blockquote>“' + esc(quote) + '”</blockquote>' : '') + '<div class="lpd-kws">' + KW.map(function (w, k) { return '<span class="lpd-kw">' + IC(['<path d="M12 3l8 4v5c0 5-3.500 8-8 9-4.500-1-8-4-8-9V7z"/>', '<circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.500"/><path d="M3 20a6 6 0 0 1 12 0M15 20a4 4 0 0 1 6 0"/>', '<path d="M12 3l3 6 6 1-4.500 4 1 6.500L12 17.500 6.500 20.500l1-6.500L3 10l6-1z"/>'][k]) + '<b>' + w + '</b></span>'; }).join('') + '</div></section></div>';
    var DY = [14, -4, 16, 0];
    var steps = P.map(function (p, i) {
      var s = statusOf(i, cur), rd = pr(p.value), st = STATUS[s];
      return '<li style="--dy:' + (DY[i % 4]) + 'px;--k:' + i + '"><button type="button" class="lpj-st" data-i="' + i + '" data-status="' + s + '" aria-pressed="' + (i === cur) + '"' + (s === 'current' ? ' aria-current="step"' : '') + ' aria-label="المرحلة ' + (i + 1) + ': ' + st[0] + '، ' + esc(p.period.label) + '">' +
        (s === 'current' ? '<span class="lpd-here">المرحلة الحالية</span>' : '') +
        '<span class="lpj-node"><b>' + (i + 1) + '</b></span><span class="body"><span class="n">المرحلة ' + (i + 1) + '</span><span class="t">' + esc(rd ? rd.title : 'القمة ' + p.value) + '</span><span class="p">' + esc(p.period.label) + '</span>' +
        '<span class="vals">القمة ' + p.value + ' · التحدي ' + C[i].value + '</span><span class="lpj-tag">' + st[1] + st[0] + '</span></span></button></li>';
    }).join('');
    var mnt = '<svg class="lpd-mnt" viewBox="0 0 800 220" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="lpdg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#8a3d52" stop-opacity=".55"/><stop offset="1" stop-color="#2d0f1b" stop-opacity=".2"/></linearGradient></defs><circle cx="470" cy="70" r="42" fill="#d9a86a" opacity=".28"/><path d="M0 220V150l70-50 70 40 90-70 80 70 70-40 90 60 80-80 90 70 80-40 80 60V220z" fill="url(#lpdg)"/><path d="M0 220V180l90-40 80 30 100-50 90 60 100-30 110 50 100-40 130 40V220z" fill="#2d0f1b" opacity=".35"/></svg>';
    var curve = '<svg class="lpd-curve" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M87.5 ' + (20 + DY[0] / 2) + ' C 75 ' + (20 + DY[0] / 2) + ', 50 ' + (20 + DY[1] / 2) + ', 37.5 ' + (20 + DY[1] / 2) + '" pathLength="1"/><path d="M62.5 ' + (20 + DY[2] / 2) + ' C 50 ' + (20 + DY[2] / 2) + ', 25 ' + (20 + DY[3] / 2) + ', 12.5 ' + (20 + DY[3] / 2) + '" pathLength="1"/><path d="M87.5 ' + (20 + DY[0] / 2) + ' C 78 ' + (20 + DY[0] / 2) + ', 72 ' + (20 + DY[2] / 2) + ', 62.5 ' + (20 + DY[2] / 2) + '" pathLength="1" class="gap"/></svg>';
    var timeline = '<section class="lpd-jr lpj-reveal" style="--d:300ms" id="lpj-journey">' + mnt + '<header><div><h2>رحلة حياتك في أرقام ومعانٍ</h2><p>كل مرحلة تحمل فرصة للنمو واكتشاف ذات أعمق</p></div><span class="lpd-jr-note">كل محطة تقربك من ذاتك الحقيقية</span></header><ol class="lpj-tl lpd-tl" style="--p:' + (cur / (P.length - 1)) + '">' + steps + '</ol></section>';
    var stagePanel = '<div id="lpj-stage" class="lpj-stage" aria-live="polite"></div>';
    /* التوقيت: الفترات الأربع على مقياس العمر */
    var AGEMAX = Math.max(90, age + 5), tseg = P.map(function (p, i) { var a = p.period.startAge, b = p.period.endAge == null ? AGEMAX : p.period.endAge + 1; return '<div class="lpd-seg" data-status="' + statusOf(i, cur) + '" style="flex:' + Math.max(1, b - a) + '"><b>' + (i + 1) + '</b><small>' + esc(p.period.label) + '</small><em>القمة ' + p.value + ' · التحدي ' + C[i].value + '</em></div>'; }).join('');
    var timing = '<div class="lpd-timing"><div class="lpd-scale">' + tseg + '<i class="lpd-mark" data-pos="' + Math.min(100, age / AGEMAX * 100).toFixed(1) + '"><span>عمرك ' + age + '</span></i></div></div>';
    var how = '<div class="lpd-how"><span class="lpd-how-i">' + IC('<path d="M4 5.500C6.500 4.500 9.500 4.500 12 6c2.500-1.500 5.500-1.500 8-.5V19c-2.500-1-5.500-1-8 .5-2.500-1.500-5.500-1.500-8-.5z"/><path d="M12 6v13.500"/>') + '</span><div><h3>كيف نقرأ مسار الحياة؟</h3><p>مسار الحياة هو خريطة زمنية رمزية تُظهر المراحل الرئيسية في رحلتك، وتساعدك على فهم إيقاع حياتك واكتشاف الدروس واستشراف الفرص القادمة. من خلال الأرقام الكامنة في تاريخ ميلادك نقرأ الخط الذي يربط إمكاناتك الحالية بمحطاتك القادمة.</p></div>' +
      '<ol class="lpd-pts"><li><b>1</b><strong>الأرقام تكشف</strong><small>كل رقم يحمل معنى ورسالة</small></li><li><b>2</b><strong>المراحل تتكامل</strong><small>كل مرحلة تبني على السابقة</small></li><li><b>3</b><strong>الدروس توجه</strong><small>التحديات هي فرص للنمو</small></li><li><b>4</b><strong>المستقبل يصنع</strong><small>الوعي اليوم يصنع غدًا أفضل</small></li></ol></div>';

    function rows(arr, kind) {
      return '<ol>' + arr.map(function (x, i) {
        var s = statusOf(i, cur);
        return '<li><button type="button" class="lpj-row" data-i="' + i + '" data-status="' + s + '" aria-pressed="' + (i === cur) + '"><span class="i">' + (i + 1) + '</span><span class="v">' + x.value + '</span><span class="tx"><b>' + (kind === 'p' ? 'القمة ' : 'التحدي ') + (i + 1) + '</b><span>' + esc(x.period.label) + '</span></span><span class="go">' + I.arrow + '</span></button></li>';
      }).join('') + '</ol>';
    }
    var pcs = section('القمم والتحديات', 'القيم والفترات كما يحسبها المحرك الحالي.',
      '<div class="lpj-pc"><div class="lpj-card"><h3>القمم الأربع</h3><p>مراحل العمر وطابع كل قمة</p>' + stairs() + rows(P, 'p') + '</div><div class="lpj-card ch"><h3>التحديات الأربعة</h3><p>الدرس المصاحب لكل مرحلة</p>' + rows(C, 'c') + '</div></div>', 'lpj-pc', 450);

    var interpHead = '<h2 id="lpj-interp-h" class="lpj-reveal" style="font-size:clamp(1.6rem,3.4vw,2.1rem);color:#351B28;margin:0 0 6px">قراءة مسارك</h2>';

    var tabsBar = '<div class="lpd-tabs" role="tablist">' + [['ov', 'النظرة العامة'], ['st', 'المراحل'], ['ls', 'الدروس'], ['tm', 'التوقيت']].map(function (t, k) { return '<button type="button" role="tab" data-lpd-tab="' + t[0] + '" aria-selected="' + (k === 0) + '">' + t[1] + '</button>'; }).join('') + '</div>';
    var panels = '<div class="lpd-panel" data-lpd-panel="ov">' + how + '</div><div class="lpd-panel" data-lpd-panel="st" hidden>' + stagePanel + '</div><div class="lpd-panel" data-lpd-panel="ls" hidden>' + pcs + '</div><div class="lpd-panel" data-lpd-panel="tm" hidden>' + timing + '</div>';
    var top = '<div class="lpj-top lpj-wrap lpd">' + crumb + chips + intro + '<div class="lpd-main">' + timeline + metrics + '</div>' + tri + tabsBar + panels + '<div id="lpj-interp" tabindex="-1">' + interpHead + '</div></div>';

    var rf = pr(curP && curP.value), refl = rf && rf.reflection;
    var tools = [['#matrix', I.matrix, 'مصفوفة القدر', 'خريطتك الرقمية الهندسية'], ['#chart', I.chart, 'الخريطة الفلكية', 'مواضع الكواكب لحظة ميلادك'], ['#life-path-synastry', I.pair, 'توافق مسارات الحياة', 'قراءة الشراكات بين رقمين'], ['#featured-content/pinnacles-cycles', I.read, 'اقرأ عن القمم والدورات', 'من المحتوى المميز']];
    var bottom = '<div class="lpj-bottom lpj"><section class="lpj-sec" aria-labelledby="lpj-ref-h">' +
      (refl ? '<div class="lpj-reflect"><small id="lpj-ref-h">سؤال للتأمل · المرحلة الحالية</small><q>' + esc(refl) + '</q><div class="lpj-btns"><button type="button" class="lpj-btn" data-lpj-open="' + cur + '"><span>اقرأ التحليل الكامل لمرحلتك</span>' + I.arrow + '</button></div></div>' : '') +
      '<h2 style="font-size:clamp(1.5rem,3vw,1.9rem);color:#351B28;margin-bottom:18px">أدوات مرتبطة</h2><div class="lpj-tools">' +
      tools.map(function (t) { return '<a class="lpj-tool" href="' + t[0] + '">' + t[1] + '<b>' + t[2] + '</b><span>' + t[3] + '</span></a>'; }).join('') + '</div></section></div>';

    return { top: top, bottom: bottom, res: res, state: state, cur: cur, P: P, C: C, pr: pr, cr: cr };
  }

  function stageCard(m) {
    var i = m.state.sel, s = statusOf(i, m.cur), p = m.P[i], c = m.C[i], rd = m.pr(p.value), st = STATUS[s];
    var ess = rd && rd.essence;
    return '<div><span class="here">' + st[1] + (s === 'current' ? 'أنت هنا' : st[0]) + '</span><h3>المرحلة ' + (i + 1) + ' — ' + esc(rd ? rd.title : 'القمة ' + p.value) + '</h3>' +
      '<div class="lpj-chips"><span class="lpj-chip">' + esc(p.period.label) + '</span><span class="lpj-chip">القمة ' + p.value + '</span><span class="lpj-chip">التحدي ' + c.value + '</span></div>' +
      '<p>' + (ess ? esc(ess) : NA) + '</p>' +
      (rd ? '<button type="button" class="lpj-btn solid" data-lpj-open="' + i + '"><span>اقرأ التحليل الكامل</span>' + I.arrow + '</button>' : '') + '</div>' +
      '<div class="lpj-stage-side"><div><span>القمة</span><b>' + p.value + '</b></div><div><span>التحدي</span><b>' + c.value + '</b></div><div><span>الحالة</span><strong>' + st[0] + '</strong></div></div>';
  }
  function panelHTML(m, i) {
    var p = m.P[i], c = m.C[i], a = m.pr(p.value), b = m.cr(c.value);
    function parts(list) { return list.filter(function (x) { return x[1]; }).map(function (x) { return '<h4>' + esc(x[0]) + '</h4><p>' + esc(x[1]) + '</p>'; }).join(''); }
    return '<button type="button" class="x" data-lpj-close aria-label="إغلاق">' + I.x + '</button>' +
      '<h3 id="lpj-panel-t">المرحلة ' + (i + 1) + ' — ' + esc(a ? a.title : 'القمة ' + p.value) + '</h3><p>' + esc(p.period.label) + '</p>' +
      (a ? '<span class="part">القمة ' + p.value + '</span>' + (a.essence ? '<p>' + esc(a.essence) + '</p>' : '') + parts([['طاقة القمة والفرص', a.energy], ['النبض النفسي والعاطفي', a.psyche], ['طريقة الاستثمار والعمل', a.invest], ['التحذير والظل الطاقي', a.shadow], ['سؤال للتأمل', a.reflection]]) : '<p>' + NA + '</p>') +
      (b ? '<span class="part">التحدي ' + c.value + (b.title ? ' — ' + esc(b.title) : '') + '</span>' + (b.essence ? '<p>' + esc(b.essence) + '</p>' : '') + parts([['جذر التحدي', b.root], ['الدرس النفسي والروحي', b.lesson], ['المهارات التي تحتاج بناء', b.skills], ['روشتة تجاوز التحدي', b.practice]]) : '');
  }

  function wire(m) {
    var top = $('.lpj-top', root), card = $('#lpj-stage', top);
    function select(i, scroll) {
      m.state.sel = i;
      [].forEach.call(top.querySelectorAll('.lpj-st,.lpj-row'), function (b) { b.setAttribute('aria-pressed', Number(b.getAttribute('data-i')) === i); });
      card.innerHTML = stageCard(m);
      if (scroll) card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
    }
    select(m.cur, false);
    function tab(k) {
      [].forEach.call(top.querySelectorAll('[data-lpd-tab]'), function (b) { b.setAttribute('aria-selected', b.getAttribute('data-lpd-tab') === k); });
      [].forEach.call(top.querySelectorAll('[data-lpd-panel]'), function (pn) { pn.hidden = pn.getAttribute('data-lpd-panel') !== k; });
      if (k === 'tm') place();
    }
    function place() { var mk = $('.lpd-mark', top); if (mk) mk.style.insetInlineStart = mk.getAttribute('data-pos') + '%'; }
    [].forEach.call(top.querySelectorAll('[data-lpd-tab]'), function (b) { b.addEventListener('click', function () { tab(b.getAttribute('data-lpd-tab')); }); });
    /* حركة النسب: تتغير قيمها مع كل تاريخ ميلاد */
    function animate() {
      var fg = $('.lpd-d-fg', top); if (fg) requestAnimationFrame(function () { fg.style.strokeDashoffset = fg.getAttribute('data-off'); });
      [].forEach.call(top.querySelectorAll('.lpd-bar i'), function (i) { requestAnimationFrame(function () { i.style.width = i.getAttribute('data-w') + '%'; }); });
      [].forEach.call(top.querySelectorAll('[data-count]'), function (el) {
        var to = Number(el.getAttribute('data-count')), t0 = null;
        if (reduce) { el.textContent = to + '%'; return; }
        (function step(t) { if (t0 === null) t0 = t; var k = Math.min(1, (t - t0) / 1100); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + '%'; if (k < 1) requestAnimationFrame(step); })(performance.now());
      });
    }
    setTimeout(animate, reduce ? 0 : 350);
    top.addEventListener('click', function (e) { if (e.target.closest('.lpj-st')) tab('st'); });
    var ov = null, opener = null;
    function close() { if (!ov) return; ov.remove(); ov = null; document.removeEventListener('keydown', onKey); if (opener) opener.focus(); }
    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab' && ov) { var f = ov.querySelectorAll('button,a[href]'); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
    }
    function open(i, btn) {
      close(); opener = btn;
      ov = document.createElement('div'); ov.className = 'lpj-ov open lpj';
      ov.innerHTML = '<div class="lpj-panel" role="dialog" aria-modal="true" aria-labelledby="lpj-panel-t">' + panelHTML(m, i) + '</div>';
      document.body.appendChild(ov);
      ov.addEventListener('click', function (e) { if (e.target === ov || e.target.closest('[data-lpj-close]')) close(); });
      document.addEventListener('keydown', onKey);
      var x = $('[data-lpj-close]', ov); if (x) x.focus();
    }
    function interp() { var t = $('#lpj-interp', root); if (t) { t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); var d = root.querySelector('details.lp-section'); if (d) d.open = true; } }
    function onClick(e) {
      var b;
      if ((b = e.target.closest('.lpj-st,.lpj-row'))) { select(Number(b.getAttribute('data-i')), !!b.closest('.lpj-card')); return; }
      if ((b = e.target.closest('[data-lpj-open]'))) { open(Number(b.getAttribute('data-lpj-open')), b); return; }
      if (e.target.closest('[data-lpj-interp]')) { interp(); return; }
      if (e.target.closest('[data-lpj-edit]')) { var ed = $('#btn-edit-lp', root); if (ed) ed.click(); return; }
      if (e.target.closest('[data-lpj-back]')) { if (navCount > 0) history.back(); else location.hash = '#aqh-tools'; }
    }
    top.addEventListener('click', onClick);
    var bt = $('.lpj-bottom', root); if (bt) bt.addEventListener('click', onClick);
    top.addEventListener('keydown', function (e) {
      var b = e.target.closest('.lpj-st'); if (!b) return;
      var all = [].slice.call(top.querySelectorAll('.lpj-st')), i = all.indexOf(b), n = -1;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') n = i + 1; else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') n = i - 1;
      if (n >= 0 && n < all.length) { e.preventDefault(); all[n].focus(); }
    });
  }

  function clean() { [].forEach.call(root.querySelectorAll(':scope > .lpj-top, :scope > .lpj-bottom'), function (n) { n.remove(); }); }
  function error(msg) {
    clean();
    var d = document.createElement('div'); d.className = 'lpj-top lpj';
    d.innerHTML = '<div class="lpj-err" role="alert"><p>تعذر تجهيز قراءة مسار الحياة حاليًا. حاول مرة أخرى.</p><button type="button" class="lpj-btn solid" data-retry><span>إعادة المحاولة</span></button></div>';
    root.prepend(d); d.querySelector('[data-retry]').addEventListener('click', function () { lastKey = ''; run(); });
  }
  function run() {
    if (building || root.hidden || !$('.numbadge', root)) return;
    var inp = readInputs(); if (!inp) return;
    var key = [inp.lp, inp.y, inp.m, inp.d, inp.name].join('|');
    if (root.querySelector(':scope > .lpj-top') && key === lastKey) return;
    building = true; lastKey = key; clean();
    var sk = document.createElement('div'); sk.className = 'lpj-top lpj'; sk.setAttribute('aria-busy', 'true'); sk.innerHTML = '<div class="lpj-skel"><i></i><i></i></div>'; root.prepend(sk);
    setTimeout(function () {
      try {
        if (!window.AqeqPinnaclesChallenges) throw new Error('engine');
        var m = build(inp); sk.remove();
        var topEl = document.createElement('div'); topEl.innerHTML = m.top; var t = topEl.firstChild; t.classList.add('lpj');
        var botEl = document.createElement('div'); botEl.innerHTML = m.bottom;
        root.prepend(t); root.appendChild(botEl.firstChild);
        wire(m);
      } catch (err) { if (window.console) console.warn('life-path-view', err && err.message); error(); }
      building = false;
    }, reduce ? 0 : 220);
  }
  var t0;
  new MutationObserver(function () { clearTimeout(t0); t0 = setTimeout(run, 40); }).observe(root, { childList: true });
  new MutationObserver(function () { clearTimeout(t0); t0 = setTimeout(run, 40); }).observe(root, { attributes: true, attributeFilter: ['hidden'] });
  run();
})();
