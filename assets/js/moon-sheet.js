/* القمر — نافذة تفاعلية: قمر حقيقي يُسحب بين الأيام، هالة الاكتمال، الخسوف والكسوف، وبوصلة الأطوار الثمانية.
   كل الحسابات من مكتبة Astronomy Engine الموجودة (astronomy.min.js)، والرسم من AqeeqMoon. عرض فقط، لا حسابات جديدة. */
(function () {
  'use strict';
  var root = document.documentElement, sheet = null, off = 0, tab = 'moon', pick = null, base = Date.now();
  var AU = 149597870.7, SYN = 29.530588;
  var SIGNS = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  /* [الاسم، الوسم، المعنى، تناسبك، تجنّب، أسئلة تخصك، قراءة من الداخل، في الواقع] */
  var PH = [
    ['محاق', 'نيّة', 'السماء بلا ضوء، وهذا يشبه ما يحدث بداخلك: حاجة صامتة إلى الانسحاب وإعادة ترتيب الداخل قبل أن يطلب منك العالم شيئًا جديدًا. ما تبدأه الآن يحتاج إلى صدق أكثر مما يحتاج إلى ضجيج.', 'اكتب نية واحدة بسيطة لهذه الدورة.', 'أن تحكم على نفسك لأن الحماس بطيء.',
      ['هل تشعر برغبة في الاختفاء قليلًا دون أن تعرف كيف تشرحها؟', 'هل بدأت تفكر فيما تريده حقًا، لا فيما يُنتظر منك؟'],
      'عند يونغ، الظلام ليس غيابًا بل رحم: يعمل اللاوعي حين يهدأ الوعي، وما يتشكل الآن لا تراه بعد.',
      ['تلغي خططًا اجتماعية وتشعر بارتياح غريب.', 'تكتب أمنية في ملاحظات هاتفك ثم تمسحها.', 'تستيقظ بفكرة جديدة لا تعرف من أين جاءت.']],
    ['هلال متزايد', 'رعاية', 'بذرة النية تطلب انتباهًا لطيفًا. قد تشعر بتردد مألوف قبل أن يتحرك الأمر، وهذا التردد ليس علامة خطأ، بل علامة أن الأمر يهمك.', 'خطوة صغيرة كل يوم تخدم نيتك.', 'أن تقارن بدايتك بنهاية غيرك.',
      ['هل بدأت شيئًا مؤخرًا ثم شككت فيه بعد أيام؟', 'هل تؤجل خطوة لأنك تنتظر أن تشعر بالاستعداد الكامل؟'],
      'هذه لحظة الاستيقاظ الأول لما نواه الوعي. التردد هنا ليس ضعفًا، بل حارس يختبر جدية النية.',
      ['تبدأ عادة جديدة بحماس ثم يخف بعد ثلاثة أيام.', 'تحكي فكرتك لأحدهم فيقلل منها، فتصمت.', 'تعود إلى الفكرة نفسها ليلًا بصمت.']],
    ['التربيع الأول', 'فعل', 'يظهر أول اختبار لما بدأته. التوتر هنا محرّك للفعل وليس عقابًا، وهو يسألك: هل أنت جاد فيما اخترته؟', 'قرار مؤجل تحسمه اليوم.', 'أن تنسحب عند أول عقبة.',
      ['هل ظهرت عقبة بعد أن بدأت، فسألت نفسك إن كنت على الطريق الصحيح؟', 'هل تعرف القرار الذي تؤجله منذ أسابيع؟'],
      'التوتر الذي تشعر به صراع بين من كنته ومن تتحول إليه، وكل تحول يمر بنقطة احتكاك.',
      ['خلاف في العمل أو البيت يكشف أمرًا كنت تتجاهله.', 'تشعر بعصبية لا سبب ظاهرًا لها.', 'تجد نفسك مضطرًا إلى الاختيار.']],
    ['أحدب متزايد', 'صقل', 'الصورة تقترب من الاكتمال، وتلاحظ ما ينقصها بوضوح. هذا وقت التعديل لا وقت الهدم.', 'مراجعة التفاصيل وتعديلها بهدوء.', 'أن يعطّلك البحث عن الكمال.',
      ['هل تلاحظ تفصيلة صغيرة تزعجك في عملك أو علاقتك وتتجاهلها؟', 'هل تؤجل الإنجاز لأنه لم يصل بعد إلى ما تتخيله؟'],
      'الناقد الداخلي يستيقظ حين يقترب الشيء من الاكتمال، والكمال هنا كثيرًا ما يخفي خوفًا من أن يُرى عملك.',
      ['تعدّل رسالة خمس مرات قبل أن ترسلها.', 'تعيد ترتيب شيء أنجزته أصلًا.', 'تنتظر الوقت المثالي الذي لا يأتي.']],
    ['بدر', 'إدراك', 'المشاعر في ذروتها، وما كان خفيًا يصبح واضحًا. قد تشعر بحساسية أعلى ونوم أخف، وهذا طبيعي في هذه الأيام.', 'لاحظ ما اتضح لك دون أن تقرر فورًا.', 'القرارات الكبرى وقت الانفعال.',
      ['هل تشعر هذه الأيام أن كل شيء مكشوف، المشاعر والنيات وما لا يُقال؟', 'هل لاحظت أن نومك أخف أو أن انفعالك أسرع من المعتاد؟'],
      'حين يكتمل الضوء يظهر الظل أيضًا. وما يزعجك في الآخرين الآن كثيرًا ما يكون مرآة لما لم تعترف به في نفسك.',
      ['تبكي أو تغضب من أمر صغير.', 'يظهر أمامك شيء كنت تتغافل عنه.', 'يتصل بك شخص من الماضي دون مقدمات.']],
    ['أحدب متناقص', 'دمج', 'وقت لفهم ما حدث وتحويله إلى خبرة تحملها معك. ما مررت به في الأسابيع الماضية بدأ يأخذ معناه.', 'اكتب ما تعلمته وشاركه مع من يهمك.', 'التمسك بما انتهى دوره.',
      ['هل تحتاج أن تحكي ما مررت به كي تفهمه؟', 'هل لديك درس تعلمته بصعوبة ولم تشاركه مع أحد؟'],
      'هذه مرحلة الدمج: يتحول الألم إلى معنى حين نرويه لأنفسنا بصدق.',
      ['تشعر برغبة في النصح أو الحكي.', 'تسترجع موقفًا قديمًا وتفهمه بشكل مختلف.', 'تجلس مع صديق وتقول: الآن فهمت.']],
    ['التربيع الأخير', 'مراجعة', 'تتصادم عاداتك القديمة مع ما صرت تريده الآن، وهذا الصدام يدعوك إلى الاختيار.', 'قرر ما تتركه وما تبقيه.', 'العودة إلى جدال قديم لا جديد فيه.',
      ['هل هناك عادة أو علاقة تعرف في داخلك أنها استنفدت دورها وما زلت تتمسك بها؟', 'هل تجادل نفسك في قرار حسمه قلبك منذ مدة؟'],
      'الصراع بين القديم والجديد هنا صراع بين هويتين. والتخلي لا يعني الخسارة، بل التخفف مما لم يعد يشبهك.',
      ['تشعر بالضيق من التزام كنت تتحمس له.', 'تفتح محادثة قديمة ثم تغلقها.', 'تقرر أخيرًا أن تقول لا.']],
    ['هلال متناقص', 'تسليم', 'الطاقة تهدأ وتحتاج إلى راحة وتصفية. ليس هذا وقت البدء بل وقت الإغلاق الهادئ.', 'رتّب مساحتك، وارتح، وودّع ما انتهى.', 'فتح التزامات ثقيلة جديدة.',
      ['هل تشعر بتعب هادئ لا يشبه الإرهاق؟', 'هل تحتاج إلى إغلاق باب دون أن يطلب منك أحد تفسيرًا؟'],
      'الاستسلام هنا ليس انهزامًا بل ثقة: يسمح الوعي للاوعي أن يعيد التكوين استعدادًا لدورة جديدة.',
      ['تميل إلى النوم المبكر وتقل رغبتك في الخروج.', 'ترتب غرفتك أو هاتفك دون سبب.', 'تودع شخصًا أو فكرة بصمت.']]
  ];
  window.AqMoonPhase = function (ms) { try { var c = calc(ms); return { p: PH[c.ph], il: Math.round(c.il * 100) }; } catch (e) { return null; } };
  var MI = {"ed": "<path d=\"M19 14.5A8 8 0 1 1 9.5 5 6.5 6.5 0 0 0 19 14.5z\"/>", "q": "<path d=\"M9.5 9a2.5 2.5 0 1 1 3.5 2.300c-.7.400-1 .900-1 1.700\"/><circle cx=\"12\" cy=\"17\" r=\".6\"/><circle cx=\"12\" cy=\"12\" r=\"9\"/>", "rd": "<path d=\"M2 12s3.500-6.500 10-6.500S22 12 22 12s-3.500 6.500-10 6.500S2 12 2 12z\"/><circle cx=\"12\" cy=\"12\" r=\"2.800\"/>", "real": "<path d=\"M8 6h12M8 12h12M8 18h12\"/><circle cx=\"4\" cy=\"6\" r=\"1\"/><circle cx=\"4\" cy=\"12\" r=\"1\"/><circle cx=\"4\" cy=\"18\" r=\"1\"/>", "yes": "<path d=\"M5 12.500 10 17.500 19 7\"/>", "no": "<circle cx=\"12\" cy=\"12\" r=\"8.500\"/><path d=\"M6 6l12 12\"/>", "il": "<circle cx=\"12\" cy=\"12\" r=\"8.500\"/><path d=\"M12 3.500a8.500 8.500 0 0 1 0 17z\" fill=\"currentColor\"/>", "age": "<circle cx=\"12\" cy=\"12\" r=\"8.500\"/><path d=\"M12 7v5l3 2\"/>", "sign": "<circle cx=\"12\" cy=\"12\" r=\"8.500\"/><path d=\"M7.500 5.500c1 4 1 9 0 13M16.500 5.500c-1 4-1 9 0 13M4 10h16M4 14h16\"/>", "dist": "<circle cx=\"5\" cy=\"12\" r=\"2\"/><circle cx=\"19\" cy=\"12\" r=\"2\"/><path d=\"M8 12h8M10.500 9.500 8 12l2.500 2.500M13.500 9.500 16 12l-2.500 2.500\"/>"};
  function mi(k) { return '<span class="mn-bd" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + MI[k] + '</svg></span>'; }
  /* كل قسم له تخطيط وشارة أيقونة خاصة: مقال تحريري، بطاقة أسئلة عنابية، قراءة من الداخل، قائمة واقع، وبطاقة فعل بلونين */
  function phBody(p, hd) {
    hd = hd || {};
    return '<section class="mn-ed"><header class="mn-sh">' + mi('ed') + '<div><small>' + (hd.label || 'ماذا يعني هذا الطور لك') + '</small>' + (hd.title ? '<h4>' + hd.title + '</h4>' : '') + '</div><i class="mn-tag">' + p[1] + '</i></header><p class="mn-lead">' + p[2] + '</p></section>' +
      '<section class="mn-q"><header class="mn-sh">' + mi('q') + '<b>أسئلة تخصك</b></header><ul><li>' + p[5][0] + '</li><li>' + p[5][1] + '</li></ul></section>' +
      '<section class="mn-rd mn-rd-in"><header class="mn-sh">' + mi('rd') + '<b>قراءة من الداخل</b></header><p>' + p[6] + '</p></section>' +
      '<section class="mn-rd mn-rd-real"><header class="mn-sh">' + mi('real') + '<b>قد تجد نفسك</b></header><ul><li>' + p[7].join('</li><li>') + '</li></ul></section>' +
      '<section class="mn-act"><div class="mn-act-y"><header class="mn-sh">' + mi('yes') + '<b>تناسبك</b></header><p>' + p[3] + '</p></div><div class="mn-act-n"><header class="mn-sh">' + mi('no') + '<b>تجنّب</b></header><p>' + p[4] + '</p></div></section>';
  }
  function tel(k, label, val) { return '<div class="mn-tc">' + mi(k) + '<span><small>' + label + '</small><b>' + val + '</b></span></div>'; }
  var STARTS = [348.75, 11.25, 78.75, 101.25, 168.75, 191.25, 258.75, 281.25];
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function mod(x) { return ((x % 360) + 360) % 360; }
  function A() { return typeof Astronomy !== 'undefined' ? Astronomy : window.Astronomy; }
  function phIdx(el) { return (el >= 348.75 || el < 11.25) ? 0 : el < 78.75 ? 1 : el < 101.25 ? 2 : el < 168.75 ? 3 : el < 191.25 ? 4 : el < 258.75 ? 5 : el < 281.25 ? 6 : 7; }
  function fmtD(d) { try { return d.toLocaleDateString('ar-EG-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long' }); } catch (e) { return d.toDateString(); } }
  function fmtS(d) { try { return d.toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric', month: 'long' }); } catch (e) { return d.toDateString(); } }
  function num(n) { try { return Math.round(n).toLocaleString('ar-EG-u-nu-latn'); } catch (e) { return String(Math.round(n)); } }
  function kindAr(k) { k = String(k).toLowerCase(); return /total/.test(k) ? 'كلي' : /annular/.test(k) ? 'حلقي' : /hybrid/.test(k) ? 'هجين' : /partial/.test(k) ? 'جزئي' : /penumbral/.test(k) ? 'شبه ظلي' : ''; }

  function calc(ms) {
    var Z = A(), d = new Date(ms), el = Z.MoonPhase(d), il = Z.Illumination('Moon', d).phase_fraction;
    var dist = Z.GeoMoon(d).Length() * AU, lon = Z.EclipticGeoMoon(d).lon, o = { ms: ms, d: d, el: el, il: il, age: el / 360 * SYN, dist: dist, sign: SIGNS[Math.floor(mod(lon) / 30)], deg: Math.floor(mod(lon) % 30), ph: phIdx(el) };
    var W = 18 * 36e5;
    try { var le = Z.SearchLunarEclipse(new Date(ms - 2 * 864e5)); o.nextL = le; if (le && Math.abs(le.peak.date - ms) < W) o.lunar = le; else o.nextL = Z.SearchLunarEclipse(d); } catch (e) {}
    try { var se = Z.SearchGlobalSolarEclipse(new Date(ms - 2 * 864e5)); o.nextS = se; if (se && Math.abs(se.peak.date - ms) < W) o.solar = se; else o.nextS = Z.SearchGlobalSolarEclipse(d); } catch (e) {}
    try { o.newM = Z.SearchMoonPhase(0, d, 40).date; o.fullM = Z.SearchMoonPhase(180, d, 40).date; } catch (e) {}
    o.full = il >= 0.985; o.supr = o.full && dist < 361500; o.peri = dist < 362000;
    return o;
  }
  /* قمر واقعي: خامة بحار وفوهات مولَّدة مرة واحدة، ثم إضاءة الطور بحساب لامبرت من زاوية الاستطالة الفعلية. */
  var TEX = null, HGT = null, TN = 360;
  function rng(s) { return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function buildTex() {
    var N = TN, R = N / 2, r = rng(20261110), v = new Float32Array(N * N), hg = new Float32Array(N * N), i, x, y;
    var hv = function (a, b) { var h = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return h - Math.floor(h); };
    var vn = function (px, py) { var ix = Math.floor(px), iy = Math.floor(py), fx = px - ix, fy = py - iy; fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); return (hv(ix, iy) * (1 - fx) + hv(ix + 1, iy) * fx) * (1 - fy) + (hv(ix, iy + 1) * (1 - fx) + hv(ix + 1, iy + 1) * fx) * fy; };
    var MARIA = [[-.27, -.38, .3, .22], [.1, -.36, .17, .14], [.26, -.1, .21, .17], [.66, -.3, .11, .08], [.55, .16, .15, .12], [-.62, -.08, .3, .4], [-.2, .45, .21, .13], [-.5, .52, .11, .1], [-.05, -.76, .36, .06], [0, -.12, .1, .08], [.43, -.45, .1, .07]];
    for (y = 0; y < N; y++) for (x = 0; x < N; x++) {
      var nx = (x - R) / R, ny = (y - R) / R, m = 0;
      MARIA.forEach(function (a) { var dx = (nx - a[0]) / a[2], dy = (ny - a[1]) / a[3], d = Math.sqrt(dx * dx + dy * dy), warp = vn(x / 30, y / 30) * .18; m = Math.max(m, Math.max(0, Math.min(1, (1 - d + warp - .1) * 2.2))); });
      var g = vn(x / 40, y / 40) * .5 + vn(x / 14, y / 14) * .3 + vn(x / 5, y / 5) * .2;
      v[y * N + x] = .8 - m * .36 + (g - .5) * .16;
    }
    function crater(cx, cy, rad, str) {
      var x0 = Math.max(0, Math.floor(cx - rad * 2.6)), x1 = Math.min(N - 1, Math.ceil(cx + rad * 2.6)), y0 = Math.max(0, Math.floor(cy - rad * 2.6)), y1 = Math.min(N - 1, Math.ceil(cy + rad * 2.6)), dep = .5 * rad * str;
      for (var yy = y0; yy <= y1; yy++) for (var xx = x0; xx <= x1; xx++) {
        var dx = xx - cx, dy = yy - cy, d = Math.sqrt(dx * dx + dy * dy) / rad, hh = 0, al = 0;
        if (d < 1) { hh = -dep * (1 - d * d); al = -.04 * str * (1 - d * d); if (rad > 6) hh += dep * .55 * Math.exp(-(d / .13) * (d / .13)); }
        if (d > .8 && d < 1.3) { var q = (d - 1.04) / .1; hh += dep * .4 * Math.exp(-q * q); al += .04 * str * Math.exp(-q * q); }
        if (d >= 1.2 && d < 2.4) { hh += dep * .07 * (1 - (d - 1.2) / 1.2); al += .035 * str * (1 - (d - 1.2) / 1.2); }
        hg[yy * N + xx] += hh; v[yy * N + xx] += al;
      }
    }
    for (i = 0; i < 760; i++) { var a = r() * 6.2832, d2 = Math.sqrt(r()) * .98, rad = 1.1 + Math.pow(r(), 3.4) * 15; crater(R + Math.cos(a) * d2 * R, R + Math.sin(a) * d2 * R, rad, .25 + r() * .45); }
    for (y = 0; y < N; y++) for (x = 0; x < N; x++) hg[y * N + x] += (vn(x / 9, y / 9) - .5) * 1.4 + (vn(x / 3.2, y / 3.2) - .5) * .5;
    HGT = hg;
    /* تيخو وكوبرنيكوس بأشعتهما */
    var tx = R + -.12 * R, ty = R + .72 * R; crater(tx, ty, 7, 1.6);
    for (i = 0; i < 22; i++) { var ang = r() * 6.2832, len = 40 + r() * 90; for (var t = 12; t < len; t += 1) { var px = Math.round(tx + Math.cos(ang) * t), py = Math.round(ty + Math.sin(ang) * t); if (px > 0 && py > 0 && px < N && py < N && (px - R) * (px - R) + (py - R) * (py - R) < R * R) v[py * N + px] += .07 * (1 - t / len); } }
    crater(R + -.38 * R, R + -.05 * R, 7, 1.4);
    return v;
  }
  var MCACHE = {};
  function moonImg(el) {
    var key = Math.round(el * 2); if (MCACHE[key]) return MCACHE[key];
    if (!TEX) TEX = buildTex();
    var N = TN, R = N / 2, cv = document.createElement('canvas'); cv.width = cv.height = N;
    var cx = cv.getContext('2d'), im = cx.createImageData(N, N), D = im.data, e = el * Math.PI / 180, H = HGT;
    var sx = Math.sin(e), sz = -Math.cos(e), x, y;
    for (y = 0; y < N; y++) for (x = 0; x < N; x++) {
      var nx = (x + .5 - R) / R, ny = (y + .5 - R) / R, rr = nx * nx + ny * ny; if (rr >= 1.02) continue;
      var nz = Math.sqrt(Math.max(0, 1 - rr)), dotG = nx * sx + nz * sz, ix = y * N + x;
      var hx = x > 0 && x < N - 1 ? (H[ix + 1] - H[ix - 1]) * .5 : 0, hy = y > 0 && y < N - 1 ? (H[ix + N] - H[ix - N]) * .5 : 0, w = (.3 + .7 * nz) * .42;
      var px = nx - hx * w, py = ny - hy * w, pz = nz, pl = Math.sqrt(px * px + py * py + pz * pz) || 1, dotP = (px * sx + pz * sz) / pl;
      var lit = Math.max(0, Math.min(1, (dotG + .05) / .26)); lit = lit * lit * (3 - 2 * lit);
      var alb = Math.max(.05, Math.min(1, TEX[ix])), rel = Math.max(0, dotP), sh = lit * (.2 + 1.05 * Math.pow(rel, .62));
      var k = alb * sh, i4 = ix * 4, edge = rr > .98 ? Math.max(0, (1.02 - rr) / .04) : 1, es = (1 - lit) * (.07 + .035 * alb);
      D[i4] = Math.min(255, k * 268 + es * 255 * .82); D[i4 + 1] = Math.min(255, k * 254 + es * 255 * .88); D[i4 + 2] = Math.min(255, k * 232 + es * 255 * 1.05); D[i4 + 3] = 255 * edge;
    }
    cx.putImageData(im, 0, 0);
    var u = cv.toDataURL('image/png'); MCACHE[key] = u; return u;
  }
  window.AqeeqMoonImg = moonImg;
  function mInner(el) { try { return '<image href="' + moonImg(el) + '" x="10" y="10" width="100" height="100"/>'; } catch (e) { return window.AqeeqMoon ? window.AqeeqMoon(el) : ''; } }
  function moonSvg(c, size) {
    var inner; try { inner = '<defs><radialGradient id="mnGlw" cx="50%" cy="50%" r="50%"><stop offset=".6" stop-color="#FFE3A6" stop-opacity=".6"/><stop offset=".78" stop-color="#FFD58A" stop-opacity=".18"/><stop offset="1" stop-color="#FFD58A" stop-opacity="0"/></radialGradient><radialGradient id="mnRim" cx="50%" cy="50%" r="50%"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></radialGradient></defs><circle cx="60" cy="60" r="63" fill="url(#mnGlw)" opacity="' + (.22 + .78 * c.il).toFixed(2) + '"/><circle cx="60" cy="60" r="50" fill="#0b0a12"/><image href="' + moonImg(c.el) + '" x="10" y="10" width="100" height="100"/><circle cx="60" cy="60" r="50" fill="url(#mnRim)"/>'; } catch (er) { inner = typeof window.AqeeqMoon === 'function' ? window.AqeeqMoon(c.el) : '<circle cx="60" cy="60" r="50" fill="#d9d2c3"/>'; }
    var over = '';
    if (c.lunar) over = '<defs><radialGradient id="mnCop" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#C2542B" stop-opacity=".78"/><stop offset=".7" stop-color="#8E2D1E" stop-opacity=".82"/><stop offset="1" stop-color="#4A1812" stop-opacity=".9"/></radialGradient></defs><circle cx="60" cy="60" r="50" fill="url(#mnCop)" style="mix-blend-mode:multiply"/>';
    if (c.solar) over = '<circle cx="60" cy="60" r="50" fill="#14090c"/><g stroke="#F6DCA0" stroke-opacity=".55" stroke-width=".8" stroke-linecap="round">' + (function () { var s = ''; for (var i = 0; i < 36; i++) { var a = i * 10 * Math.PI / 180, r1 = 52, r2 = 52 + (i % 3 ? 5 : 9); s += '<line x1="' + (60 + r1 * Math.cos(a)).toFixed(1) + '" y1="' + (60 + r1 * Math.sin(a)).toFixed(1) + '" x2="' + (60 + r2 * Math.cos(a)).toFixed(1) + '" y2="' + (60 + r2 * Math.sin(a)).toFixed(1) + '"/>'; } return s; })() + '</g><circle cx="60" cy="60" r="51" fill="none" stroke="#F6DCA0" stroke-opacity=".7" stroke-width="1.2"/>';
    return '<svg viewBox="-6 -6 132 132" width="' + size + '" height="' + size + '" role="img" aria-label="القمر: ' + PH[c.ph][0] + '، إضاءة ' + Math.round(c.il * 100) + '%">' + inner + over + '</svg>';
  }
  function badges(c) {
    var b = [];
    if (c.lunar) b.push('<span class="mn-b is-ecl">خسوف قمري ' + kindAr(c.lunar.kind) + '</span>');
    if (c.solar) b.push('<span class="mn-b is-ecl">كسوف شمسي ' + kindAr(c.solar.kind) + '</span>');
    if (c.supr) b.push('<span class="mn-b is-super">قمر عملاق</span>');
    else if (c.full) b.push('<span class="mn-b is-full">بدر مكتمل</span>');
    else if (c.ph === 0) b.push('<span class="mn-b">محاق</span>');
    return b.join('');
  }
  function fact(k, v) { return '<div class="mn-fact"><small>' + k + '</small><b>' + v + '</b></div>'; }
  function nextEv(c) {
    var o = [];
    if (c.newM) o.push(fact('المحاق القادم', fmtS(c.newM)));
    if (c.fullM) o.push(fact('البدر القادم', fmtS(c.fullM)));
    if (c.nextL && !c.lunar) o.push(fact('أقرب خسوف', fmtS(c.nextL.peak.date) + ' · ' + kindAr(c.nextL.kind)));
    if (c.nextS && !c.solar) o.push(fact('أقرب كسوف', fmtS(c.nextS.peak.date) + ' · ' + kindAr(c.nextS.kind)));
    return o.join('');
  }
  function moonView() {
    var c = calc(base + off * 864e5), p = PH[c.ph];
    var halo = c.full ? ' is-full' : '', ecl = c.lunar ? ' is-lunar' : c.solar ? ' is-solar' : '';
    var scale = c.supr ? ' is-super' : '';
    return '<div class="mn-stage' + halo + ecl + scale + '"><div class="mn-halo" style="--mnh:' + Math.max(0, (c.il - .6) / .4).toFixed(2) + '"></div><div class="mn-moon" id="mn-moon" tabindex="0" aria-label="اسحب القمر لتغيير اليوم">' + moonSvg(c, 232) + '</div></div>' +
      '<p class="mn-hint">اسحب القمر يمينًا أو يسارًا للتنقل بين الأيام</p>' +
      '<div class="mn-title"><h4>' + p[0] + '</h4><div class="mn-bs">' + badges(c) + '</div></div>' +
      '<div class="mn-date"><button type="button" data-mn-step="-1" aria-label="اليوم التالي"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 5l7 7-7 7"/></svg></button><span>' + fmtD(c.d) + (off === 0 ? ' · الآن' : '') + '</span><button type="button" data-mn-step="1" aria-label="اليوم السابق"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg></button></div>' +
      '<input class="mn-range" id="mn-range" type="range" min="-30" max="30" step="1" value="' + off + '" aria-label="تغيير اليوم"><button type="button" class="mn-now" data-mn-now' + (off === 0 ? ' hidden' : '') + '>العودة إلى الآن</button>' +
      '<div class="mn-tel">' + tel('il', 'الإضاءة', Math.round(c.il * 100) + '%') + tel('age', 'عمر القمر', c.age.toFixed(1).replace('.', '٫') + ' يوم') + tel('sign', 'البرج', c.sign + ' ' + c.deg + '°') + tel('dist', 'المسافة عن الأرض', num(c.dist) + ' كم') + '</div>' +
      phBody(p, { label: 'ماذا يعني هذا الطور لك' }) +
      '<div class="mn-facts">' + nextEv(c) + '</div>';
  }
  var DAYS = [0, 4, 7, 11, 15, 18, 22, 26];
  function compassView() {
    var c = calc(base + off * 864e5), cur = c.ph, S = 340, C = S / 2, R = 122, i;
    var ring = '<circle cx="' + C + '" cy="' + C + '" r="' + (R + 34) + '" fill="none" stroke="#A07A3A" stroke-opacity=".35"/><circle cx="' + C + '" cy="' + C + '" r="' + (R - 34) + '" fill="none" stroke="#A07A3A" stroke-opacity=".25"/>';
    var arrow = '<path d="M' + (C + 24) + ' ' + (C - R - 44) + ' l14 6 -14 6" fill="none" stroke="#A07A3A" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>';
    var nodes = '';
    for (i = 0; i < 8; i++) {
      var a = (i * 45 - 90) * Math.PI / 180, x = C + R * Math.cos(a), y = C + R * Math.sin(a), el = i * 45;
      var act = (pick == null ? cur : pick) === i;
      nodes += '<g class="mn-node' + (act ? ' is-on' : '') + (i === cur ? ' is-cur' : '') + '" data-mn-ph="' + i + '" role="button" tabindex="0" aria-label="' + PH[i][0] + '" transform="translate(' + (x - 25).toFixed(1) + ' ' + (y - 25).toFixed(1) + ') scale(.4167)"><circle cx="60" cy="60" r="62" fill="url(#mnGlw)" opacity="' + (.2 + .8 * (1 - Math.cos(el * Math.PI / 180)) / 2).toFixed(2) + '"/><circle cx="60" cy="60" r="50" fill="#0b0a12"/>' + (act ? '<circle cx="60" cy="60" r="62" fill="none" stroke="#6A2038" stroke-width="3"/>' : '') + mInner(el) + '<circle cx="60" cy="60" r="50" fill="url(#mnRim)"/></g>' +
        '<circle cx="' + (x + 20).toFixed(1) + '" cy="' + (y - 20).toFixed(1) + '" r="8" fill="#6A2038"/><text x="' + (x + 20).toFixed(1) + '" y="' + (y - 16.5).toFixed(1) + '" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">' + (i + 1) + '</text>' +
        '<text x="' + x.toFixed(1) + '" y="' + (y + 40).toFixed(1) + '" text-anchor="middle" class="mn-nl">' + PH[i][1] + '</text>';
    }
    var mid = '<g transform="translate(' + (C - 40) + ' ' + (C - 40) + ') scale(.667)"><circle cx="60" cy="60" r="50" fill="#0b0a12"/>' + mInner(c.el) + '</g>' +
      '<text x="' + C + '" y="' + (C + 58) + '" text-anchor="middle" class="mn-nl" style="font-size:11px">اليوم ' + num(Math.max(1, Math.round(c.age))) + ' من 30</text>';
    var sel = pick == null ? cur : pick, p = PH[sel];
    var list = '<h4 class="mn-lt">الأطوار الثمانية بالترتيب</h4><ol class="mn-leg">';
    for (i = 0; i < 8; i++) list += '<li><button type="button" data-mn-ph="' + i + '" class="' + (i === cur ? 'is-cur' : '') + (i === sel ? ' is-on' : '') + '"><b>' + (i + 1) + '</b><span><strong>' + PH[i][0] + '</strong><small>' + PH[i][1] + ' · حوالي اليوم ' + num(DAYS[i] + 1) + '</small></span>' + (i === cur ? '<em>الآن</em>' : '') + '</button></li>';
    list += '</ol>';
    return '<p class="mn-intro">دورة القمر نحو 29 يومًا، ولكل طور طاقة مختلفة. اضغط أي طور لتقرأ معناه.</p>' +
      '<svg class="mn-wheel" viewBox="0 0 ' + S + ' ' + S + '" role="group" aria-label="بوصلة أطوار القمر"><defs><radialGradient id="mnGlw" cx="50%" cy="50%" r="50%"><stop offset=".6" stop-color="#FFE3A6" stop-opacity=".6"/><stop offset=".78" stop-color="#FFD58A" stop-opacity=".18"/><stop offset="1" stop-color="#FFD58A" stop-opacity="0"/></radialGradient><radialGradient id="mnRim" cx="50%" cy="50%" r="50%"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></radialGradient></defs>' + ring + mid + nodes + '</svg>' +
      '<p class="mn-hint">اضغط أي طور لتقرأ معناه</p>' +
      phBody(p, { label: (sel === cur ? 'الطور الحالي' : 'طور القمر'), title: p[0] }) + (sel !== cur ? '<button type="button" class="mn-go" data-mn-go="' + sel + '">اعرض أقرب موعد لهذا الطور</button>' : '') + list;
  }
  function render() {
    var s = ensure(), b = $('.aqm-sheet-body', s), st = b.scrollTop;
    var Z = A(); if (!Z) { b.innerHTML = '<p class="mn-hint">تعذر تحميل بيانات القمر حاليًا.</p>'; return; }
    b.innerHTML = '<div class="mn-tabs" role="tablist"><button type="button" role="tab" data-mn-tab="moon" class="' + (tab === 'moon' ? 'is-on' : '') + '">القمر</button><button type="button" role="tab" data-mn-tab="compass" class="' + (tab === 'compass' ? 'is-on' : '') + '">بوصلة الأطوار</button></div><div class="mn-pane">' + (tab === 'moon' ? moonView() : compassView()) + '</div>';
    b.scrollTop = st;
    var c = calc(base + off * 864e5); $('.aqm-sheet-sub', s).textContent = PH[c.ph][0] + ' · ' + Math.round(c.il * 100) + '%';
    var nb = $('[data-mn-next] b', s); if (nb) nb.textContent = PH[((tab === 'compass' && pick != null ? pick : c.ph) + 1) % 8][0];
    bind();
  }
  function nextPhase() {
    var c = calc(base + off * 864e5);
    if (tab === 'compass') { pick = ((pick == null ? c.ph : pick) + 1) % 8; return render(); }
    try { var d = A().SearchMoonPhase(STARTS[(c.ph + 1) % 8] % 360 + .4, new Date(base + off * 864e5), 40).date; off = Math.min(45, Math.max(off + 1, Math.ceil((d - base) / 864e5))); } catch (x) { off = Math.min(45, off + 3); }
    render();
  }
  var dragging = false;
  function setOff(v) { v = Math.max(-45, Math.min(45, v)); if (v === off) return; off = v; render(); }
  function bind() {
    var m = $('#mn-moon');
    if (m) {
      var sx = 0, so = 0, moved = false;
      m.addEventListener('pointerdown', function (e) { dragging = true; sx = e.clientX; so = off; moved = false; try { m.setPointerCapture(e.pointerId); } catch (x) {} });
      m.addEventListener('pointermove', function (e) { if (!dragging) return; var n = so + Math.round((sx - e.clientX) / 14); if (n !== off) { moved = true; var nn = Math.max(-45, Math.min(45, n)); off = nn; softUpdate(); } });
      var end = function () { dragging = false; if (moved) render(); };
      m.addEventListener('pointerup', end); m.addEventListener('pointercancel', end);
      m.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') setOff(off + 1); if (e.key === 'ArrowRight') setOff(off - 1); });
    }
    var r = $('#mn-range'); if (r) r.addEventListener('input', function () { off = +r.value; softUpdate(); }), r.addEventListener('change', render);
  }
  /* تحديث خفيف أثناء السحب: القمر والاسم والتاريخ فقط */
  function softUpdate() {
    var c = calc(base + off * 864e5), m = $('#mn-moon'); if (!m) return;
    m.innerHTML = moonSvg(c, 232);
    var st = $('.mn-stage'); if (st) { st.className = 'mn-stage' + (c.full ? ' is-full' : '') + (c.lunar ? ' is-lunar' : c.solar ? ' is-solar' : '') + (c.supr ? ' is-super' : ''); $('.mn-halo', st).style.setProperty('--mnh', Math.max(0, (c.il - .6) / .4).toFixed(2)); }
    var h = $('.mn-title h4'); if (h) h.textContent = PH[c.ph][0]; var bs = $('.mn-bs'); if (bs) bs.innerHTML = badges(c);
    var ds = $('.mn-date span'); if (ds) ds.textContent = fmtD(c.d) + (off === 0 ? ' · الآن' : '');
    var r = $('#mn-range'); if (r) r.value = off;
  }
  function ensure() {
    if (sheet) return sheet;
    sheet = document.createElement('div'); sheet.className = 'aqm-sheet mn-sheet'; sheet.hidden = true;
    sheet.innerHTML = '<div class="aqm-sheet-scrim" data-mnc></div><div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="mn-t"><span class="aqm-sheet-grip"></span>' +
      '<button type="button" class="aqm-sheet-x" data-mnc aria-label="إغلاق"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="aqm-sheet-head"><span class="aqm-sheet-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14.5A8 8 0 1 1 9.5 5 6.5 6.5 0 0 0 19 14.5z"/></svg></span><div><h3 id="mn-t">القمر</h3><p class="aqm-sheet-sub"></p></div></div><div class="aqm-sheet-body"></div>' +
      '<div class="aqm-sheet-foot"><button type="button" class="aqm-foot-next" data-mn-next><span class="aqm-foot-l"><small>الطور التالي</small><b></b></span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button><button type="button" class="aqm-foot-close" data-mnc>إغلاق</button></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-mnc]')) return close();
      if (e.target.closest('[data-mn-next]')) return nextPhase();
      var t = e.target.closest('[data-mn-tab]'); if (t) { tab = t.getAttribute('data-mn-tab'); return render(); }
      var s = e.target.closest('[data-mn-step]'); if (s) return setOff(off + (+s.getAttribute('data-mn-step')));
      if (e.target.closest('[data-mn-now]')) { off = 0; return render(); }
      var p = e.target.closest('[data-mn-ph]'); if (p) { pick = +p.getAttribute('data-mn-ph'); return render(); }
      var g = e.target.closest('[data-mn-go]'); if (g) { var i = +g.getAttribute('data-mn-go'); try { var d = A().SearchMoonPhase(i * 45, new Date(base), 40).date; off = Math.max(-45, Math.min(45, Math.round((d - base) / 864e5))); } catch (x) {} tab = 'moon'; pick = null; return render(); }
    });
    sheet.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); var p = e.target.closest && e.target.closest('[data-mn-ph]'); if (p && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick = +p.getAttribute('data-mn-ph'); render(); } });
    return sheet;
  }
  function open(t) { base = Date.now(); off = 0; pick = null; tab = t || 'moon'; var s = ensure(); render(); s.classList.remove('is-closing'); s.hidden = false; root.classList.add('aqm-sheet-open'); }
  function close() { if (!sheet || sheet.hidden) return; sheet.classList.add('is-closing'); var s = sheet; setTimeout(function () { s.hidden = true; s.classList.remove('is-closing'); root.classList.remove('aqm-sheet-open'); }, 230); }
  window.AqeeqMoonSheet = { open: open, close: close };

  /* زر الفتح: داخل بطاقة القمر في صفحة السماء، وعلى القمر نفسه */
  function inject() {
    $$('#swc-moon, .wld-moon, #sky-moon').forEach(function (box) {
      if (!box.textContent.trim() && !box.querySelector('svg')) return;
      if (box.querySelector('.mn-open')) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'mn-open';
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14.5A8 8 0 1 1 9.5 5 6.5 6.5 0 0 0 19 14.5z"/></svg><span>القمر بالتفصيل</span>';
      box.appendChild(b);
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.mn-open, .swc-moon-fig, .swc-moon-svg'); if (!b) return;
    e.preventDefault(); open('moon');
  });
  var sec = document.getElementById('sky'); if (sec) { var q; new MutationObserver(function () { clearTimeout(q); q = setTimeout(inject, 80); }).observe(sec, { childList: true, subtree: true }); inject(); }
})();
