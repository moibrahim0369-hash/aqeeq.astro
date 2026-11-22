/* عقيق أسترو — تجربة أول دخول (تعريف + بيانات الميلاد مرة واحدة + نجاح).
   ملف مستقل: لا يعدّل auth.js ولا auth-ui.js ولا account-profile.js.
   الحفظ يمر عبر نموذج الملف الشخصي الموجود (#profile-completion-form) نفسه،
   فيبقى منطق الحفظ والمزامنة والتعبئة التلقائية في مكان واحد كما هو.
   التركيبة: خلفية مزخرفة هادئة + ميدالية عقيق كبيرة + ورقة زجاجية للمحتوى.
   بلا حركات متكررة: انتقال تلاشٍ فقط بين الشرائح. */
(function () {
  'use strict';

  var SEEN_KEY = 'aq-fr-seen-v1';          // localStorage: شاف شرائح التعريف
  var JOURNEY_KEY = 'aq-fr-journey-v1';    // sessionStorage: await-auth | await-profile
  var DISMISS_KEY = 'aqeeq_profile_prompt_dismissed_v1'; // نفس مفتاح نموذج الحساب حتى لا يزعجه مرتين
  var LOGO = 'assets/images/brand/logo-mark-512.png';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var pad = function (x) { return String(x).padStart(2, '0'); };
  var sb = function () { return window.aqeeqSupabase || null; };
  var sessionUser = function () { return (window.AqSession && window.AqSession.user) || null; };

  var root = null;      // عنصر #aq-fr
  var slideIdx = 0;
  var saveEventListener = null, saveFailListener = null;   // مستمعا عقد الحفظ أثناء حفظ جارٍ
  var saveGeneration = 0;     // جيل عملية الحفظ: يتقدم عند كل إغلاق فتسكت أي عملية قديمة
  var savePollTimer = null, savePendTimer = null;
  function clearSaveListener() {
    if (saveEventListener) { document.removeEventListener('aqeeq:profile-saved', saveEventListener); saveEventListener = null; }
    if (saveFailListener) { document.removeEventListener('aqeeq:profile-save-failed', saveFailListener); saveFailListener = null; }
  }
  function cancelPendingSave() {
    saveGeneration++;
    clearSaveListener();
    if (savePollTimer) { clearInterval(savePollTimer); savePollTimer = null; }
    if (savePendTimer) { clearTimeout(savePendTimer); savePendTimer = null; }
  }

  /* ---------------- زخرفة الخلفية: غسق خفيف + مدارات + كوكبة ثابتة ---------------- */
  function bgSVG() {
    return '<svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<circle cx="340" cy="50" r="190" fill="#c9a06a" opacity=".12"/>' +
      '<circle cx="20" cy="800" r="210" fill="#8e244b" opacity=".035"/>' +
      '<g fill="#c9a06a" opacity=".4">' +
      '<circle cx="60" cy="150" r="1.6"/><circle cx="345" cy="240" r="1.5"/><circle cx="40" cy="470" r="1.5"/>' +
      '<circle cx="350" cy="540" r="1.7"/><circle cx="200" cy="70" r="1.4"/><circle cx="150" cy="790" r="1.5"/></g></svg>';
  }
  /* ---------- رسوم الشرائح: خط ذهبي ناعم مندمج مع الخلفية ---------- */
  var GL = '#b98a4e', GS = '#c9a06a', BU = '#8e244b', CR = '#fdf6ea';
  function star4(x, y, s, c) {
    x = +x; y = +y; s = +s;
    return '<path d="M' + x + ' ' + (y - s) + ' Q' + x + ' ' + y + ' ' + (x + s) + ' ' + y + ' Q' + x + ' ' + y + ' ' + x + ' ' + (y + s) + ' Q' + x + ' ' + y + ' ' + (x - s) + ' ' + y + ' Q' + x + ' ' + y + ' ' + x + ' ' + (y - s) + 'Z" fill="' + (c || GS) + '"/>';
  }
  function crescent(x, y, r, c) {
    var tx = (x + r * .574).toFixed(1), t1 = (y - r * .819).toFixed(1), t2 = (y + r * .819).toFixed(1);
    return '<path fill="' + c + '" d="M' + tx + ' ' + t1 + ' A' + r + ' ' + r + ' 0 1 0 ' + tx + ' ' + t2 + ' A' + r + ' ' + r + ' 0 0 1 ' + tx + ' ' + t1 + ' Z"/>';
  }
  function cloud(x, y, s, o) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')" opacity="' + (o || 1) + '">' +
      '<path d="M-30 6 Q-30 -8 -16 -8 Q-12 -20 2 -18 Q14 -22 18 -10 Q30 -8 28 4 Q27 12 18 12 L-22 12 Q-30 12 -30 6 Z" fill="#f6ebd7" stroke="#dcc096" stroke-width="1.2"/></g>';
  }
  /* الشريحة الأولى: عين عقيق — رسم غني بخط ذهبي دقيق */
  function eyeArt() {
    var s = '<circle cx="170" cy="195" r="148" fill="none" stroke="#c9a06a" stroke-width=".9" opacity=".32"/>' +
      '<circle cx="170" cy="195" r="161" fill="none" stroke="#c9a06a" stroke-width=".9" stroke-dasharray="2 8" opacity=".26"/>' +
      '<circle cx="170" cy="195" r="118" fill="none" stroke="#c9a06a" stroke-width=".8" opacity=".16"/>';
    /* سماء: هلال صغير وكوكبات ونجوم */
    s += crescent(96, 58, 13, BU) + star4(108, 56, 5, GL) +
      constArt([[222, 38], [240, 52], [256, 36], [272, 56]]) +
      constArt([[40, 118], [56, 130], [46, 148], [66, 156]]) +
      swirl(40, 252, 1) + swirl(302, 256, 1, true) +
      star4(52, 74, 4.5) + star4(292, 40, 4.5) + star4(310, 106, 4) + star4(30, 188, 4) +
      star4(316, 180, 4) + star4(118, 104, 3.5) + star4(226, 106, 3.5) + star4(150, 42, 3.5) + star4(192, 34, 3) +
      star4(66, 224, 3.5) + star4(278, 226, 3.5);
    var dots = [[52, 92], [78, 76], [108, 44], [136, 80], [160, 66], [196, 44], [222, 60], [258, 52], [286, 100], [312, 108], [26, 208], [318, 208], [98, 96], [246, 130], [126, 130], [64, 160], [282, 148]];
    dots.forEach(function (d) { s += '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="1.4" fill="#c9a06a" opacity=".55"/>'; });
    /* حاجب مقوس خفيف */
    s += '<path d="M74 124 Q170 78 266 124" fill="none" stroke="#c9a06a" stroke-width="1.1" opacity=".7"/>';
    /* الجفن العلوي وثنيته */
    s += '<path d="M64 178 Q170 104 276 178" fill="none" stroke="' + BU + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M82 166 Q170 114 258 166" fill="none" stroke="' + GL + '" stroke-width="1.2" opacity=".8"/>' +
      '<path d="M64 178 Q170 250 276 178" fill="none" stroke="' + BU + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M92 194 Q170 242 248 194" fill="none" stroke="' + GS + '" stroke-width="1" opacity=".7"/>' +
      '<path d="M64 178 Q56 184 58 192" fill="none" stroke="' + BU + '" stroke-width="1.6" stroke-linecap="round"/>' +
      '<path d="M276 178 Q284 184 282 192" fill="none" stroke="' + BU + '" stroke-width="1.6" stroke-linecap="round"/>';
    /* رموش متدرجة على الجفن العلوي */
    [92, 112, 133, 154, 170, 186, 207, 228, 248].forEach(function (x, i) {
      var t = (x - 64) / 212, y = (1 - t) * (1 - t) * 178 + 2 * t * (1 - t) * 104 + t * t * 178;
      var len = 15 - Math.abs(i - 4) * 1.4, dx = (i - 4) * 2.4;
      s += '<line x1="' + x + '" y1="' + y.toFixed(1) + '" x2="' + (x + dx).toFixed(1) + '" y2="' + (y - len).toFixed(1) + '" stroke="' + BU + '" stroke-width="2" stroke-linecap="round"/>';
    });
    /* قزحية بأضلاع منقوشة وحلقات */
    s += '<circle cx="170" cy="192" r="36" fill="' + CR + '" stroke="' + GL + '" stroke-width="1.8"/>' +
      '<circle cx="170" cy="192" r="45" fill="none" stroke="' + GS + '" stroke-width="1" stroke-dasharray="1 6" opacity=".7"/>' +
      '<circle cx="170" cy="192" r="27" fill="none" stroke="' + GS + '" stroke-width="1" opacity=".8"/>';
    for (var i = 0; i < 12; i++) {
      var a = i * 30 * Math.PI / 180;
      s += '<line x1="' + (170 + 11 * Math.cos(a)).toFixed(1) + '" y1="' + (192 + 11 * Math.sin(a)).toFixed(1) +
        '" x2="' + (170 + 33 * Math.cos(a)).toFixed(1) + '" y2="' + (192 + 33 * Math.sin(a)).toFixed(1) +
        '" stroke="' + GS + '" stroke-width=".8" opacity=".6"/>';
    }
    s += crescent(170, 192, 15, BU) + star4(178, 192, 5.5, GS) +
      '<circle cx="158" cy="180" r="2.2" fill="' + GS + '" opacity=".8"/>';
    /* سُحب أمامية وظل أرضي */
    s += cloudRich(88, 326, 1.25) + cloudRich(256, 328, 1.3) + cloudRich(170, 350, 1.0, .96) +
      '<path d="M96 372 C140 380 200 380 244 372" fill="none" stroke="#c9a06a" stroke-width=".8" opacity=".5"/>' +
      '<path d="M116 382 C150 388 190 388 224 382" fill="none" stroke="#c9a06a" stroke-width=".8" opacity=".35"/>';
    return '<svg viewBox="0 0 340 400" role="img" aria-label="عين عقيق">' + s + '</svg>';
  }
  /* الشريحة الثانية: عجلة أبراج محفورة بخط رفيع — بنفس غنى الكتاب */
  function wheelArt() {
    var SIGNS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    function pt(a, r) { var q = (180 + a) * Math.PI / 180; return [170 + r * Math.cos(q), 195 - r * Math.sin(q)]; }
    var s = '<circle cx="170" cy="195" r="148" fill="none" stroke="#c9a06a" stroke-width=".9" opacity=".32"/>' +
      '<circle cx="170" cy="195" r="161" fill="none" stroke="#c9a06a" stroke-width=".9" stroke-dasharray="2 8" opacity=".26"/>' +
      '<circle cx="170" cy="195" r="132" fill="none" stroke="#c9a06a" stroke-width=".8" opacity=".18"/>';
    /* سماء */
    s += crescent(66, 56, 12, BU) + star4(78, 54, 4.5, GL) +
      constArt([[236, 40], [252, 54], [268, 38], [284, 58]]) +
      constArt([[36, 128], [52, 140], [42, 158], [62, 166]]) +
      swirl(38, 262, 1) + swirl(304, 266, 1, true) +
      star4(48, 84, 4) + star4(296, 48, 4.5) + star4(314, 118, 4) + star4(28, 198, 4) +
      star4(318, 192, 4) + star4(140, 40, 3.5) + star4(198, 32, 3) + star4(70, 232, 3.5) + star4(274, 234, 3.5);
    var dots = [[52, 108], [88, 62], [120, 42], [164, 54], [214, 44], [262, 76], [306, 92], [30, 158], [312, 158], [60, 178], [286, 172], [100, 110], [244, 118]];
    dots.forEach(function (d) { s += '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="1.4" fill="#c9a06a" opacity=".55"/>'; });
    /* العجلة: حزام الأبراج */
    s += '<circle cx="170" cy="195" r="112" fill="none" stroke="' + GL + '" stroke-width="1.4"/>' +
      '<circle cx="170" cy="195" r="104" fill="none" stroke="' + GL + '" stroke-width="1"/>' +
      '<circle cx="170" cy="195" r="78" fill="none" stroke="' + GL + '" stroke-width="1.1"/>';
    var i, p1, p2, g, d;
    for (i = 0; i < 12; i++) {
      p1 = pt(i * 30, 112); p2 = pt(i * 30, 78); g = pt(i * 30 + 15, 91);
      s += '<line x1="' + p1[0].toFixed(1) + '" y1="' + p1[1].toFixed(1) + '" x2="' + p2[0].toFixed(1) + '" y2="' + p2[1].toFixed(1) + '" stroke="' + GL + '" stroke-width=".9"/>' +
        '<text x="' + g[0].toFixed(1) + '" y="' + (g[1] + 5).toFixed(1) + '" font-size="14" text-anchor="middle" fill="#8a6a45">' + SIGNS[i] + '</text>' +
        '<circle cx="' + p1[0].toFixed(1) + '" cy="' + p1[1].toFixed(1) + '" r="2.2" fill="' + GS + '"/>';
      var m1 = pt(i * 30 + 15, 112), m2 = pt(i * 30 + 15, 107);
      s += '<line x1="' + m1[0].toFixed(1) + '" y1="' + m1[1].toFixed(1) + '" x2="' + m2[0].toFixed(1) + '" y2="' + m2[1].toFixed(1) + '" stroke="' + GS + '" stroke-width=".9" opacity=".8"/>';
    }
    /* حلقات داخلية وأشعة منقوشة */
    s += '<circle cx="170" cy="195" r="58" fill="none" stroke="' + GS + '" stroke-width="1" stroke-dasharray="1 6" opacity=".8"/>' +
      '<circle cx="170" cy="195" r="34" fill="none" stroke="' + GL + '" stroke-width="1" opacity=".85"/>';
    for (i = 0; i < 8; i++) {
      p1 = pt(i * 45 + 22.5, 34); p2 = pt(i * 45 + 22.5, 58);
      s += '<line x1="' + p1[0].toFixed(1) + '" y1="' + p1[1].toFixed(1) + '" x2="' + p2[0].toFixed(1) + '" y2="' + p2[1].toFixed(1) + '" stroke="' + GS + '" stroke-width=".8" opacity=".6"/>';
    }
    /* مركز: شمس صغيرة وهلال */
    s += sunArt(170, 195, 12) + crescent(170, 195, 6, BU) + star4(170, 195, 3, GL);
    /* سُحب أمامية وظل أرضي */
    s += cloudRich(88, 326, 1.25) + cloudRich(256, 328, 1.3) + cloudRich(170, 350, 1.0, .96) +
      '<path d="M96 372 C140 380 200 380 244 372" fill="none" stroke="#c9a06a" stroke-width=".8" opacity=".5"/>' +
      '<path d="M116 382 C150 388 190 388 224 382" fill="none" stroke="#c9a06a" stroke-width=".8" opacity=".35"/>';
    return '<svg viewBox="0 0 340 400" role="img" aria-label="عجلة الأبراج">' + s + '</svg>';
  }
  /* الشريحة الثالثة: نجمة المصفوفة — ٢٢ طاقة على حلقة محفورة */
  function matrixArt() {
    var cy = 195;
    function mp(deg, r) { var a = deg * Math.PI / 180; return [170 + r * Math.cos(a), cy - r * Math.sin(a)]; }
    function square(rot, R) {
      var d = '';
      for (var i = 0; i < 4; i++) { var p = mp(90 + rot + i * 90, R); d += (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
      return '<path d="' + d + 'Z" fill="none" stroke="' + GL + '" stroke-width="1.2"/>';
    }
    var s = '<circle cx="170" cy="195" r="148" fill="none" stroke="#c9a06a" stroke-width=".9" opacity=".32"/>' +
      '<circle cx="170" cy="195" r="161" fill="none" stroke="#c9a06a" stroke-width=".9" stroke-dasharray="2 8" opacity=".26"/>' +
      '<circle cx="170" cy="195" r="132" fill="none" stroke="#c9a06a" stroke-width=".8" opacity=".18"/>';
    /* سماء */
    s += crescent(64, 54, 12, BU) + star4(76, 52, 4.5, GL) +
      constArt([[238, 42], [254, 56], [270, 40], [286, 60]]) +
      constArt([[34, 130], [50, 142], [40, 160], [60, 168]]) +
      swirl(38, 264, 1) + swirl(304, 268, 1, true) +
      star4(46, 86, 4) + star4(298, 50, 4.5) + star4(314, 120, 4) + star4(28, 200, 4) +
      star4(318, 194, 4) + star4(142, 38, 3.5) + star4(200, 30, 3) + star4(68, 234, 3.5) + star4(276, 236, 3.5);
    var dots = [[54, 110], [90, 60], [122, 40], [166, 52], [216, 42], [264, 78], [306, 94], [30, 160], [312, 160], [58, 180], [288, 174], [102, 112], [246, 120]];
    dots.forEach(function (d) { s += '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="1.4" fill="#c9a06a" opacity=".55"/>'; });
    /* حلقة ٢٢ طاقة */
    s += '<circle cx="170" cy="' + cy + '" r="120" fill="none" stroke="' + GL + '" stroke-width="1.2"/>' +
      '<circle cx="170" cy="' + cy + '" r="112" fill="none" stroke="' + GS + '" stroke-width="1" stroke-dasharray="1 6" opacity=".8"/>';
    var i, p, q;
    for (i = 0; i < 22; i++) {
      p = mp(i * (360 / 22), 120); q = mp(i * (360 / 22), 114);
      s += '<line x1="' + p[0].toFixed(1) + '" y1="' + p[1].toFixed(1) + '" x2="' + q[0].toFixed(1) + '" y2="' + q[1].toFixed(1) + '" stroke="' + GL + '" stroke-width=".9" opacity=".8"/>';
    }
    /* النجمة الثمانية */
    s += square(0, 96) + square(45, 96);
    for (i = 0; i < 8; i++) { p = mp(90 + i * 45, 96); s += '<line x1="170" y1="' + cy + '" x2="' + p[0].toFixed(1) + '" y2="' + p[1].toFixed(1) + '" stroke="' + GL + '" stroke-width=".8" opacity=".45"/>'; }
    /* حلقة داخلية بنقاط على الأضلاع */
    s += '<circle cx="170" cy="' + cy + '" r="54" fill="none" stroke="' + GS + '" stroke-width="1" stroke-dasharray="1 6" opacity=".8"/>';
    for (i = 0; i < 8; i++) { p = mp(90 + i * 45, 54); s += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="2" fill="' + GS + '" opacity=".8"/>'; }
    for (i = 0; i < 8; i++) {
      p = mp(90 + i * 45, 96);
      var maj = i % 2 === 0;
      s += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="11" fill="' + CR + '" stroke="' + (maj ? BU : GL) + '" stroke-width="1.6"/>' +
        '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4" fill="' + (maj ? BU : GS) + '"/>';
      var st = mp(90 + i * 45 + 22.5, 106);
      s += star4(st[0].toFixed(1), st[1].toFixed(1), 3.5, GS);
    }
    /* الختم المركزي */
    s += '<circle cx="170" cy="' + cy + '" r="23" fill="none" stroke="' + GS + '" stroke-width=".8" opacity=".8"/>' +
      '<circle cx="170" cy="' + cy + '" r="17" fill="' + CR + '" stroke="' + BU + '" stroke-width="1.8"/>' + star4(170, cy, 7, BU);
    /* سُحب أمامية وظل أرضي */
    s += cloudRich(88, 326, 1.25) + cloudRich(256, 328, 1.3) + cloudRich(170, 350, 1.0, .96) +
      '<path d="M96 372 C140 380 200 380 244 372" fill="none" stroke="#c9a06a" stroke-width=".8" opacity=".5"/>' +
      '<path d="M116 382 C150 388 190 388 224 382" fill="none" stroke="#c9a06a" stroke-width=".8" opacity=".35"/>';
    return '<svg viewBox="0 0 340 400" role="img" aria-label="نجمة المصفوفة">' + s + '</svg>';
  }
  /* الشريحة الرابعة: كتاب مفتوح يعلوه هلال ونجمة */
  function swirl(x, y, s, flip) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + (flip ? -s : s) + ',' + s + ')">' +
      '<path d="M0 0 C-16 -4 -24 -18 -14 -26 C-6 -32 4 -28 2 -19 C1 -13 -7 -12 -8 -17" fill="none" stroke="#c9a06a" stroke-width="1.1" stroke-linecap="round" opacity=".8"/></g>';
  }
  function sunArt(x, y, r) {
    var s = '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#fdf6ea" stroke="#b98a4e" stroke-width="1.6"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="' + (r + 8) + '" fill="none" stroke="#c9a06a" stroke-width=".9" stroke-dasharray="1 5" opacity=".7"/>';
    for (var i = 0; i < 12; i++) {
      var a = i * 30 * Math.PI / 180;
      s += '<line x1="' + (x + (r + 3) * Math.cos(a)).toFixed(1) + '" y1="' + (y + (r + 3) * Math.sin(a)).toFixed(1) +
        '" x2="' + (x + (r + 10) * Math.cos(a)).toFixed(1) + '" y2="' + (y + (r + 10) * Math.sin(a)).toFixed(1) +
        '" stroke="#b98a4e" stroke-width="1.3" stroke-linecap="round"/>';
    }
    return s;
  }
  function constArt(nodes) {
    var s = '', i;
    for (i = 0; i < nodes.length - 1; i++) {
      s += '<line x1="' + nodes[i][0] + '" y1="' + nodes[i][1] + '" x2="' + nodes[i + 1][0] + '" y2="' + nodes[i + 1][1] + '" stroke="#c9a06a" stroke-width=".9" opacity=".75"/>';
    }
    for (i = 0; i < nodes.length; i++) {
      s += '<circle cx="' + nodes[i][0] + '" cy="' + nodes[i][1] + '" r="1.9" fill="#b98a4e"/>';
    }
    return s;
  }
  function cloudRich(x, y, s, o) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')" opacity="' + (o || 1) + '">' +
      '<path d="M-30 6 Q-30 -8 -16 -8 Q-12 -20 2 -18 Q14 -22 18 -10 Q30 -8 28 4 Q27 12 18 12 L-22 12 Q-30 12 -30 6 Z" fill="#f6ebd7" stroke="#dcc096" stroke-width="1.2"/>' +
      '<path d="M-20 8 Q-12 0 -2 2" fill="none" stroke="#dcc096" stroke-width="1" opacity=".9"/>' +
      '<path d="M6 9 Q14 2 22 5" fill="none" stroke="#dcc096" stroke-width="1" opacity=".7"/></g>';
  }
  /* الشريحة الأخيرة: كتاب مفتوح تتصاعد منه كوكبات وهلال وشمس — رسم غني بخط ذهبي دقيق */
  function bookArt() {
    var s = '<circle cx="170" cy="195" r="148" fill="none" stroke="#c9a06a" stroke-width=".9" opacity=".32"/>' +
      '<circle cx="170" cy="195" r="161" fill="none" stroke="#c9a06a" stroke-width=".9" stroke-dasharray="2 8" opacity=".26"/>' +
      '<circle cx="170" cy="195" r="118" fill="none" stroke="#c9a06a" stroke-width=".8" opacity=".16"/>';
    /* سماء: هلال وشمس وكوكبات */
    s += crescent(118, 66, 19, BU) + star4(130, 64, 6, GL) +
      sunArt(240, 84, 11) +
      constArt([[152, 36], [172, 50], [188, 32], [206, 54]]) +
      constArt([[42, 122], [60, 134], [50, 152], [72, 160]]) +
      swirl(44, 236, 1) + swirl(300, 240, 1, true) +
      star4(60, 58, 5) + star4(88, 30, 3.5) + star4(272, 36, 5) + star4(302, 76, 4) +
      star4(34, 178, 4) + star4(308, 168, 5) + star4(290, 126, 3.5) + star4(92, 118, 3) +
      star4(140, 100, 4) + star4(210, 118, 3.5);
    var dots = [[52, 92], [78, 76], [108, 44], [136, 80], [160, 66], [196, 44], [222, 60], [258, 52], [286, 100], [312, 108], [26, 208], [318, 208], [98, 96], [246, 130], [126, 130], [64, 160], [282, 148]];
    dots.forEach(function (d) { s += '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="1.4" fill="#c9a06a" opacity=".55"/>'; });
    /* الكتاب: غلاف عنابي وصفحات كريمية وحواف مُشرشرة */
    s += '<path d="M170 272 C134 250 98 246 58 256 L58 158 C98 148 134 152 170 174 Z" fill="#f9f0e0" stroke="' + BU + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M170 272 C206 250 242 246 282 256 L282 158 C242 148 206 152 170 174 Z" fill="#f9f0e0" stroke="' + BU + '" stroke-width="2.2" stroke-linejoin="round"/>';
    var i2, y2;
    for (i2 = 0; i2 < 6; i2++) {
      y2 = 262 + i2 * 2.4;
      s += '<path d="M170 ' + (y2 + 8) + ' C136 ' + (y2 - 12) + ' 100 ' + (y2 - 16) + ' 62 ' + (y2 - 7) + '" fill="none" stroke="#c9a06a" stroke-width=".8" opacity=".8"/>' +
        '<path d="M170 ' + (y2 + 8) + ' C204 ' + (y2 - 12) + ' 240 ' + (y2 - 16) + ' 278 ' + (y2 - 7) + '" fill="none" stroke="#c9a06a" stroke-width=".8" opacity=".8"/>';
    }
    s += '<path d="M170 264 C136 244 102 240 66 250 L66 162 C102 152 136 156 170 176 Z" fill="#fdf6ea" stroke="#b98a4e" stroke-width="1.2"/>' +
      '<path d="M170 264 C204 244 238 240 274 250 L274 162 C238 152 204 156 170 176 Z" fill="#fdf6ea" stroke="#b98a4e" stroke-width="1.2"/>' +
      '<line x1="170" y1="176" x2="170" y2="264" stroke="#b98a4e" stroke-width="1.1"/>' +
      '<path d="M170 264 L161 290 L170 283 L179 290 Z" fill="' + BU + '" opacity=".85"/>';
    for (i2 = 0; i2 < 5; i2++) {
      y2 = 192 + i2 * 14;
      s += '<path d="M80 ' + y2 + ' C102 ' + (y2 - 8) + ' 130 ' + (y2 - 8) + ' 158 ' + (y2 - 3) + '" fill="none" stroke="#c9a06a" stroke-width="1.1" opacity=".85"/>' +
        '<path d="M182 ' + (y2 - 3) + ' C210 ' + (y2 - 8) + ' 238 ' + (y2 - 8) + ' 260 ' + y2 + '" fill="none" stroke="#c9a06a" stroke-width="1.1" opacity=".85"/>';
    }
    /* سُحب أمامية متراكبة وظل أرضي */
    s += cloudRich(88, 326, 1.25) + cloudRich(256, 328, 1.3) + cloudRich(170, 350, 1.0, .96) +
      '<path d="M96 372 C140 380 200 380 244 372" fill="none" stroke="#c9a06a" stroke-width=".8" opacity=".5"/>' +
      '<path d="M116 382 C150 388 190 388 224 382" fill="none" stroke="#c9a06a" stroke-width=".8" opacity=".35"/>';
    return '<svg viewBox="0 0 340 400" role="img" aria-label="كتاب القراءات">' + s + '</svg>';
  }
  /* شاشة النجاح: علامة تُرسم مرة واحدة فوق ملخّص ما حُفظ فعلًا */
  function checkSVG() {
    return '<svg class="fr-check" viewBox="0 0 120 120" aria-hidden="true">' +
      '<circle class="fr-ring" cx="60" cy="60" r="46" fill="none"/>' +
      '<path class="fr-tick" d="M41 61.5 54 74.5 80 47" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function sumRow(k, v) { return '<div class="fr-sum"><span>' + esc(k) + '</span><b>' + esc(v) + '</b></div>'; }

  /* ---------------- محتوى شرائح التعريف ---------------- */
  var SLIDES = [
    { art: 'eye', kicker: 'أهلاً بك في عقيق', t1: 'سماؤك', t2: 'تحكي عنك',
      body: 'خريطة ميلادك تُحسب من تاريخك ووقته ومكانك، وتدعوك للتأمل فيما يشبهك وما يميّزك.' },
    { art: 'wheel', kicker: 'الغربي والفيدي', t1: 'خريطتان', t2: 'لسماء واحدة',
      body: 'تُحسب مواقع كواكبك بالمدرستين الغربية والفيدية، وتُعرض جنبًا إلى جنب.' },
    { art: 'matrix', kicker: 'مصفوفة القدر ومسار الحياة', t1: 'يوم ميلادك،', t2: 'في ٢٢ طاقة',
      body: 'مصفوفة القدر ومسار الحياة والذيل الكارمي تُحسب كلها من تاريخ ميلادك.' },
    { art: 'book', kicker: 'منهجنا في القراءة', t1: 'كلمات', t2: 'تفتح باب التأمل',
      body: 'نصوص مكتوبة بعناية لكل موضع في خريطتك، تدعوك لتعرف ذاتك أعمق.', last: true }
  ];

  /* ---------------- بناء الواجهة ---------------- */
  function ensureRoot() {
    if (root) return root;
    root = document.createElement('div');
    root.id = 'aq-fr';
    root.setAttribute('dir', 'rtl');
    root.hidden = true;
    document.body.appendChild(root);
    return root;
  }
  function show() { ensureRoot().hidden = false; document.documentElement.classList.add('aq-fr-open'); }
  function close() {
    if (root) root.hidden = true;
    document.documentElement.classList.remove('aq-fr-open');
    cancelPendingSave();
  }

  function artFor(s) {
    if (s.art === 'wheel') return wheelArt();
    if (s.art === 'matrix') return matrixArt();
    if (s.art === 'book') return bookArt();
    return eyeArt();
  }

  function renderIntro() {
    var r = ensureRoot();
    r.innerHTML = '<div class="fr-bg">' + bgSVG() + '</div><div class="fr-stage">' +
      '<div class="fr-topbar"><span class="fr-word">عقيق أسترو</span></div>' +
      '<button type="button" class="fr-skip" id="fr-skip">تخطي</button>' +
      '<div class="fr-slides">' + SLIDES.map(function (s, i) {
        return '<section class="fr-slide' + (i === 0 ? ' on' : '') + '" data-i="' + i + '">' +
          '<div class="fr-art">' + artFor(s) + '</div>' +
          '<div class="fr-shead">' +
          '<div class="fr-kicker">' + esc(s.kicker) + '</div>' +
          '<h2 class="fr-title"><b>' + esc(s.t1) + '</b> <em>' + esc(s.t2) + '</em></h2>' +
          '<p class="fr-body">' + esc(s.body) + '</p></div></section>';
      }).join('') + '</div>' +
      '<button type="button" class="fr-cta" id="fr-next">التالي</button>' +
      '<div class="fr-dots">' + SLIDES.map(function (_, i) { return '<i' + (i === 0 ? ' class="on"' : '') + '></i>'; }).join('') + '</div>' +
      '</div>';
    show();
    slideIdx = 0;
    $('#fr-next', r).addEventListener('click', nextSlide);
    $('#fr-skip', r).addEventListener('click', finishIntro);
  }
  function nextSlide() {
    var slides = root.querySelectorAll('.fr-slide'), dots = root.querySelectorAll('.fr-dots i');
    slides[slideIdx].classList.remove('on'); slides[slideIdx].classList.add('past');
    dots[slideIdx].classList.remove('on');
    slideIdx++;
    if (slideIdx >= SLIDES.length) { finishIntro(); return; }
    slides[slideIdx].classList.add('on'); dots[slideIdx].classList.add('on');
    if (slideIdx === SLIDES.length - 1) $('#fr-next', root).textContent = 'ابدأ';
  }
  function finishIntro() {
    try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) {}
    if (sessionUser()) {
      setJourney('await-profile');
      close();
      maybeProfileStep();
    } else {
      setJourney('await-auth');
      close();
      if (location.hash !== '#account') location.hash = '#account';
      waitForSession();
    }
  }

  /* استطلاع الجلسة: حدث «aq:session» قد يسبق التخطي، فلا نعتمد عليه وحده */
  var sessionPoll = null;
  function waitForSession() {
    if (sessionPoll) return;
    var n = 0;
    sessionPoll = setInterval(function () {
      n++;
      if (sessionUser()) {
        clearInterval(sessionPoll); sessionPoll = null;
        if (getJourney() === 'await-auth') { setJourney('await-profile'); setTimeout(maybeProfileStep, 600); }
      } else if (n > 60) { clearInterval(sessionPoll); sessionPoll = null; }
    }, 300);
  }

  function setJourney(v) { try { if (v) sessionStorage.setItem(JOURNEY_KEY, v); else sessionStorage.removeItem(JOURNEY_KEY); } catch (e) {} }
  function getJourney() { try { return sessionStorage.getItem(JOURNEY_KEY) || ''; } catch (e) { return ''; } }

  /* ---------------- خطوة بيانات الميلاد ---------------- */
  function geoList() { return Array.isArray(window.AQEEQ_GEO) ? window.AQEEQ_GEO : []; }

  function renderDataStep(prefill) {
    prefill = prefill || {};
    var r = ensureRoot();
    var countries = geoList().map(function (c) { return '<option value="' + esc(c.name) + '">' + esc(c.name) + '</option>'; }).join('');
    r.innerHTML = '<div class="fr-bg">' + bgSVG() + '</div><div class="fr-stage">' +
      '<div class="fr-form-head">' +
        '<div class="fr-logo"><img src="' + LOGO + '" alt="شعار عقيق أسترو"></div>' +
        '<h2 class="fr-form-title">بيانات ميلادك</h2>' +
        '<p class="fr-form-sub">سجّل بيانات ميلادك مرة واحدة؛ تُحفظ في حسابك وتُعبَّأ منها حقول خرائطك في الغربي والفيدي والمصفوفة.</p>' +
      '</div>' +
      '<div class="fr-fields">' +
        '<div class="fr-row">' +
          '<div class="fr-col"><label class="fr-lab" for="fr-first">الاسم الأول</label><input class="fr-in" id="fr-first" maxlength="80" autocomplete="given-name" placeholder="مثال: سارة" value="' + esc(prefill.first || '') + '"></div>' +
          '<div class="fr-col"><label class="fr-lab" for="fr-last">اسم العائلة</label><input class="fr-in" id="fr-last" maxlength="80" autocomplete="family-name" placeholder="مثال: المنصور" value="' + esc(prefill.last || '') + '"></div>' +
        '</div>' +
        '<div><label class="fr-lab" for="fr-country">دولة الميلاد</label><select class="fr-in" id="fr-country"><option value="">اختر الدولة</option>' + countries + '</select></div>' +
        '<div><label class="fr-lab" for="fr-city">المحافظة / الولاية / المدينة</label><select class="fr-in" id="fr-city" disabled><option value="">اختر الدولة أولًا</option></select></div>' +
        '<div><label class="fr-lab">تاريخ الميلاد</label><div class="fr-row">' +
          '<div class="fr-col"><input class="fr-in fr-num" id="fr-d" inputmode="numeric" maxlength="2" placeholder="اليوم"></div>' +
          '<div class="fr-col"><input class="fr-in fr-num" id="fr-m" inputmode="numeric" maxlength="2" placeholder="الشهر"></div>' +
          '<div class="fr-col"><input class="fr-in fr-num" id="fr-y" inputmode="numeric" maxlength="4" placeholder="السنة"></div>' +
        '</div></div>' +
        '<div><label class="fr-lab">وقت الميلاد</label><div class="fr-row" id="fr-trow">' +
          '<div class="fr-col"><input class="fr-in fr-num" id="fr-h" inputmode="numeric" maxlength="2" placeholder="الساعة"></div>' +
          '<div class="fr-col"><input class="fr-in fr-num" id="fr-i" inputmode="numeric" maxlength="2" placeholder="الدقيقة"></div>' +
        '</div>' +
        '<label class="fr-unk"><input type="checkbox" id="fr-unk"' + (prefill.timeUnknown ? ' checked' : '') + '><span>لا أعرف وقت ميلادي بالضبط (خريطة شمسية)</span></label></div>' +
        '<p class="fr-err" id="fr-err" role="alert"></p>' +
      '</div>' +
      '<button type="button" class="fr-cta" id="fr-save">حفظ البيانات</button>' +
      '<button type="button" class="fr-ghost" id="fr-later">سأكمل لاحقًا</button>' +
      '<p class="fr-note">تُحفظ بياناتك في حسابك فقط، ويمكنك تعديلها أو حذفها في أي وقت من صفحة «حسابي».</p>' +
      '</div>';
    show();

    if (prefill.date) {
      var dp = String(prefill.date).split('-');
      if (dp.length === 3) { $('#fr-y', r).value = dp[0]; $('#fr-m', r).value = String(+dp[1]); $('#fr-d', r).value = String(+dp[2]); }
    }
    if (prefill.time) { var tp = prefill.time.split(':'); $('#fr-h', r).value = tp[0] || ''; $('#fr-i', r).value = tp[1] || ''; }

    var cSel = $('#fr-country', r), citySel = $('#fr-city', r);
    function fillCities(country, selected) {
      var hit = geoList().filter(function (c) { return c.name === country; })[0];
      citySel.innerHTML = '';
      var first = document.createElement('option');
      first.value = ''; first.textContent = hit ? 'اختر المحافظة / الولاية' : 'اختر الدولة أولًا';
      citySel.appendChild(first);
      if (hit) {
        var list = hit.regions.slice();
        if (selected && list.indexOf(selected) === -1) list.unshift(selected);
        list.forEach(function (g) { var o = document.createElement('option'); o.value = g; o.textContent = g; citySel.appendChild(o); });
      }
      citySel.disabled = !hit;
      citySel.value = selected || '';
    }
    cSel.addEventListener('change', function () { fillCities(this.value, ''); });
    if (prefill.country) { cSel.value = prefill.country; fillCities(prefill.country, prefill.city || ''); }

    [].forEach.call(r.querySelectorAll('.fr-num'), function (inp) {
      inp.addEventListener('input', function () {
        inp.value = inp.value.replace(/\D/g, '');
        if (inp.value.length >= +inp.maxLength) {
          var nxt = inp.closest('.fr-col').nextElementSibling;
          if (nxt) { var ni = nxt.querySelector('input'); if (ni) ni.focus(); }
        }
      });
    });

    var unk = $('#fr-unk', r);
    unk.addEventListener('change', function () { $('#fr-trow', r).style.opacity = unk.checked ? '.45' : ''; });

    $('#fr-save', r).addEventListener('click', onSave);
    $('#fr-later', r).addEventListener('click', function () {
      try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch (e) {}
      setJourney('');
      close();
      if (location.hash === '#account') location.hash = '#home';
    });
    setTimeout(function () { var f = $('#fr-first', r); if (f && !f.value) f.focus(); }, 350);
  }

  function sayErr(t) { var e = $('#fr-err', root); if (e) e.textContent = t || ''; }

  function onSave() {
    var r = root;
    var first = $('#fr-first', r).value.trim(), last = $('#fr-last', r).value.trim();
    var country = $('#fr-country', r).value.trim(), city = $('#fr-city', r).value.trim();
    var d = +$('#fr-d', r).value, m = +$('#fr-m', r).value, y = +$('#fr-y', r).value;
    var hh = $('#fr-h', r).value, ii = $('#fr-i', r).value, noTime = $('#fr-unk', r).checked;

    if (!first || !last) return sayErr('اكتب الاسم الأول واسم العائلة.');
    var dt = new Date(y, m - 1, d);
    if (!d || !m || !y || y < 1900 || y > 2100 || dt.getDate() !== d || dt.getMonth() !== m - 1) return sayErr('تأكد من تاريخ الميلاد: يوم وشهر وسنة صحيحين.');
    if (!noTime && (hh === '' || ii === '' || +hh > 23 || +ii > 59)) return sayErr('اكتب الساعة والدقيقة، أو اختر «لا أعرف وقت ميلادي».');
    if (!country || !city) return sayErr('اختر دولة الميلاد ثم المحافظة أو المدينة.');
    sayErr('');

    var payload = {
      first: first, last: last, country: country, city: city,
      date: y + '-' + pad(m) + '-' + pad(d),
      time: noTime ? null : pad(hh) + ':' + pad(ii),
      timeUnknown: noTime
    };
    var btn = $('#fr-save', r);
    btn.disabled = true; btn.textContent = 'جارٍ حفظ البيانات…';
    saveThroughProfileForm(payload, function (ok, errText) {
      if (ok) { renderSuccess(payload); return; }
      /* فشل مؤكد بحدث aqeeq:profile-save-failed فقط: نعيد الزر لمحاولة يدوية */
      btn.disabled = false; btn.textContent = 'حفظ البيانات';
      sayErr(errText || 'تعذّر الحفظ حاليًا. تحقق من الاتصال وحاول مرة أخرى.');
    }, function () {
      /* بطء فقط، لا فشل: الطلب قد يكون معلقًا ويكتمل لاحقًا */
      sayErr('الحفظ يأخذ وقتًا أطول من المعتاد. اترك الصفحة مفتوحة وسنكمل فور اكتماله.');
    });
  }

  /* التقاط مبكر لنموذج الملف: عند إعادة التحميل بجلسة ناقصة قد يُنشأ ويُزال خلال جزء من الثانية
     (تعارض معروف بين ناقل صفحة «أنت» وعارضها القديم)، فنلتقطه فور ظهوره قبل اختفائه. */
  var capturedForm = null, capturedMsg = null, capturedHost = null;
  function captureProfileForm() {
    var form = document.getElementById('profile-completion-form');
    if (form && form !== capturedForm) {
      capturedForm = form;
      capturedMsg = document.getElementById('profile-msg');
      capturedHost = form.closest('section') || form;
    }
  }
  var formSpotter = null;
  if (typeof MutationObserver !== 'undefined') {
    formSpotter = new MutationObserver(captureProfileForm);
    try { formSpotter.observe(document, { childList: true, subtree: true }); } catch (e) {}
  }
  captureProfileForm();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', captureProfileForm);
  /* الحفظ عبر نموذج الحساب الموجود نفسه: نفس الأعمدة ونفس المزامنة والتعبئة التلقائية.
     تحصين: صفحة «أنت» القديمة قد تمحو قسم النموذج من الشجرة بعد الدخول، فنحتفظ بمرجع مبكر
     للنموذج ونعيد وصله بالمستند عند الحاجة — نفس العقدة تحتفظ بمستمعات الحفظ نفسها. */
  function saveThroughProfileForm(p, cb, onPending) {
    var tries = 0;
    var gen = saveGeneration;
    var stale = function () { return gen !== saveGeneration; };
    var timer = null;
    var started = false;
    var tick = function () {
      if (stale()) { if (timer) { clearInterval(timer); if (savePollTimer === timer) savePollTimer = null; } return; }
      tries++;
      captureProfileForm();
      var form = document.getElementById('profile-completion-form');
      if (!form && capturedForm) {
        /* أُزيل من الشجرة: نعيد وصل القسم الأصلي بأقرب مضيف متاح */
        var host = document.getElementById('acct-user') || document.body;
        host.appendChild(capturedHost);
        form = capturedForm;
      }
      if (!form) {
        if (tries > 25) { if (timer) { clearInterval(timer); if (savePollTimer === timer) savePollTimer = null; } if (!stale()) cb(false, 'شاشة الحفظ لا تزال تجهز. افتح «حسابي» وأكمل بياناتك من هناك.'); }
        return;
      }
      if (timer) { clearInterval(timer); if (savePollTimer === timer) savePollTimer = null; }
      started = true;
      if (stale()) return;
      var g = function (id) { return document.getElementById(id); };
      var setV = function (id, v) { var e = g(id); if (!e) return null; e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); return e; };
      setV('profile-first-name', p.first);
      setV('profile-last-name', p.last);
      setV('profile-birth-date', p.date);
      var unk = g('profile-time-unknown');
      if (unk) { unk.checked = p.timeUnknown; unk.dispatchEvent(new Event('change', { bubbles: true })); }
      if (!p.timeUnknown && p.time) setV('profile-birth-time', p.time);
      var cs = g('profile-birth-country');
      if (cs) {
        if (![].some.call(cs.options, function (o) { return o.value === p.country; })) {
          var o = document.createElement('option'); o.value = p.country; o.textContent = p.country; cs.appendChild(o);
        }
        cs.value = p.country;
        cs.dispatchEvent(new Event('change', { bubbles: true }));
      }
      var city = g('profile-birth-city');
      if (city) {
        if (![].some.call(city.options, function (o) { return o.value === p.city; })) {
          var o2 = document.createElement('option'); o2.value = p.city; o2.textContent = p.city; city.appendChild(o2);
        }
        city.value = p.city;
        city.dispatchEvent(new Event('change', { bubbles: true }));
      }
      var settled = false, pendingNoted = false;
      var pendTimer = null;
      var settle = function (ok, errText) {
        if (settled || stale()) return; settled = true;
        clearSaveListener();
        if (pendTimer) { clearTimeout(pendTimer); pendTimer = null; }
        if (savePendTimer === pendTimer) savePendTimer = null;
        cb(ok, errText);
      };
      /* عقد الحفظ الوحيد: account-profile يطلق aqeeq:profile-saved بـ detail:{userId} بعد
         اكتمال الـupsert والمزامنة، ولا يطلقه عند الفشل. نستمع مرة ونطابق هوية الجلسة.
         النجاح يُقبل مرة واحدة متى وصل — غياب الحدث ليس إثبات فشل، فالطلب قد يكون معلقًا. */
      var me = sessionUser();
      var onSaved = function (e) {
        var uid = e && e.detail && e.detail.userId;
        if (uid && me && uid === me.id) settle(true);
      };
      saveEventListener = onSaved;
      document.addEventListener('aqeeq:profile-saved', onSaved);
      if (stale()) { clearSaveListener(); return; }
      /* الفشل المؤكد: account-profile يطلق aqeeq:profile-save-failed من catch الحفظ فقط */
      var onFailed = function (e) {
        var uid = e && e.detail && e.detail.userId;
        if (uid && me && uid === me.id) settle(false, 'تعذّر الحفظ حاليًا. تحقق من الاتصال وحاول مرة أخرى.');
      };
      saveFailListener = onFailed;
      document.addEventListener('aqeeq:profile-save-failed', onFailed);
      try { form.requestSubmit(); } catch (e) { form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); }
      /* بعد 15 ثانية بلا حدث: تنبيه انتظار غير قاطع ونواصل الاستماع — بلا فشل معلن وبلا إعادة تلقائية */
      pendTimer = setTimeout(function () { if (!settled && !stale() && !pendingNoted) { pendingNoted = true; if (onPending) onPending(); } }, 15000);
      savePendTimer = pendTimer;
    };
    /* المحاولة الأولى فورية عند النقر: الحفظ يبدأ في لحظة القرار نفسها، ويبقى المؤقت
       احتياطًا فقط إن لم يكن النموذج جاهزًا بعد — الإغلاق يلغي الاحتياط والمستمعين
       ولا يلغي طلب خادم بدأ بالفعل */
    tick();
    if (!started) { timer = setInterval(tick, 200); savePollTimer = timer; }
  }

  /* ---------------- شاشة النجاح ---------------- */
  function renderSuccess(p, hold) {
    if (typeof p === 'string') p = { first: p };
    p = p || {};
    var r = ensureRoot();
    var when = p.timeUnknown ? 'غير معروف' : (p.time || '—');
    var dateTxt = p.date ? p.date.split('-').reverse().join(' / ') : '—';
    var rows = sumRow('الاسم', (String(p.first || '') + ' ' + String(p.last || '')).trim() || '—') +
      sumRow('تاريخ الميلاد', dateTxt) +
      sumRow('وقت الميلاد', when) +
      sumRow('مكان الميلاد', (p.city && p.country) ? p.city + '، ' + p.country : '—');
    r.innerHTML = '<div class="fr-bg">' + bgSVG() + '</div><div class="fr-stage">' +
      '<div class="fr-panel fr-panel-done">' + checkSVG() +
        '<h2 class="fr-done-title">تم حفظ بياناتك</h2>' +
        '<p class="fr-done-sub">أهلًا يا ' + esc(p.first || '') + '. حُفظت بيانات ميلادك في حسابك، وستُعبأ حقول خرائطك منها تلقائيًا.</p>' +
        '<div class="fr-sums">' + rows + '</div>' +
        '<p class="fr-done-hint">جارٍ نقلك إلى الصفحة الرئيسية…</p>' +
      '</div></div>';
    show();
    setJourney('');
    if (!hold) setTimeout(function () {
      close();
      try { if (location.hash !== '#home') location.hash = '#home'; } catch (e) {}
    }, 3200);
  }

  /* ---------------- قرار الخطوة بعد الدخول ---------------- */
  function maybeProfileStep() {
    var user = sessionUser();
    if (!user) return;
    var client = sb();
    if (!client) return;
    client.from('profiles')
      .select('id, first_name, last_name, birth_date, birth_time, birth_time_unknown, birth_city, birth_country, profile_completed_at')
      .eq('id', user.id)
      .maybeSingle()
      .then(function (res) {
        var p = res && res.data;
        var complete = p && p.profile_completed_at && p.first_name && p.last_name && p.birth_date && p.birth_city && p.birth_country && (p.birth_time_unknown || p.birth_time);
        if (complete) { setJourney(''); return; }
        var meta = (user && user.user_metadata) || {};
        var nm = String(meta.full_name || meta.name || '').trim().split(/\s+/);
        renderDataStep({
          first: (p && p.first_name) || meta.first_name || nm.shift() || '',
          last: (p && p.last_name) || meta.last_name || nm.join(' ') || '',
          country: (p && p.birth_country) || '',
          city: (p && p.birth_city) || '',
          date: (p && p.birth_date) || '',
          time: p && p.birth_time ? String(p.birth_time).slice(0, 5) : '',
          timeUnknown: Boolean(p && p.birth_time_unknown)
        });
      }, function () { /* فشل القراءة: نترك نموذج «حسابي» يقوم بدوره */ });
  }

  /* ---------------- الإقلاع ---------------- */
  function boot() {
    /* لا نعرض التعريف فوق رابط تأكيد/استعادة الدخول */
    if (/[?&]code=/.test(location.search)) return;
    var j = getJourney();
    if (j === 'await-profile' && sessionUser()) { maybeProfileStep(); return; }
    if (j === 'await-auth') { waitForSession(); return; } /* ننتظر الدخول مع استطلاع احتياطي */
    if (j === 'await-profile') return; /* ننتظر حدث الدخول */
    var seen = false;
    try { seen = localStorage.getItem(SEEN_KEY) === '1'; } catch (e) {}
    if (!seen) renderIntro();
  }

  document.addEventListener('aq:session', function (e) {
    var user = e && e.detail && e.detail.user;
    var j = getJourney();
    if (!user) return;
    if (j === 'await-auth' || j === 'await-profile') {
      setJourney('await-profile');
      /* نترك نموذج الحساب يجهّز نفسه أولًا */
      setTimeout(maybeProfileStep, 600);
    }
  });

  /* واجهة صغيرة للفحص والمعاينة */
  window.AqeeqFirstRun = {
    open: renderIntro,
    openDataStep: function () { renderDataStep({}); },
    openSuccess: function (n, hold) { renderSuccess({ first: n || 'سارة', last: 'المنصور', date: '1996-03-14', time: '09:45', timeUnknown: false, city: 'القاهرة', country: 'مصر' }, hold); },
    close: close,
    reset: function () { try { localStorage.removeItem(SEEN_KEY); sessionStorage.removeItem(JOURNEY_KEY); } catch (e) {} }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 400); });
  else setTimeout(boot, 400);
})();
