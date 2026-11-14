/* شاشة أيقونات الفلك الفيدي: بعد الحساب تظهر شبكة أيقونات، وكل أيقونة تفتح قسمها وحده بدون بقية الخرائط. */
(function () {
  'use strict';
  var sec = document.getElementById('astro-maps'), content = document.getElementById('eam-content');
  if (!sec || !content) return;
  var IC = {
    birth: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/><path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5"/>',
    vargas: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 4l16 16M20 4L4 20M12 4l8 8-8 8-8-8z"/>',
    moonsun: '<path d="M15 5.5A6.5 6.5 0 1 0 15 18.5 5 5 0 0 1 15 5.5z"/><circle cx="18" cy="8" r="2"/>',
    dasha: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
    sade: '<circle cx="12" cy="12" r="3.2"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-20 12 12)"/>',
    lunar: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    expert: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    year: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>'
  };
  var TILES = [
    ['birth', 'خريطة الميلاد', 'العجلة والكواكب والاتصالات'],
    ['vargas', 'الخرائط المقسمة', 'من D1 إلى D60 بالرسمين'],
    ['moonsun', 'خريطتا القمر والشمس', 'مشاعرك وجوهرك'],
    ['dasha', 'الداشا', 'فتراتك الكبرى والصغرى'],
    ['sade', 'ساتي ساتي', 'أين زحل من قمرك الآن'],
    ['lunar', 'المنزل القمري', 'منزلك وحاكمه'],
    ['year', 'قراءة السنة', 'ما تعيشه الآن'],
    ['expert', 'وضع الخبير', 'ملاحظات خاصة بك وحدك']
  ];
  var TARGET = null, PUSHED = 0;
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a) TARGET = a.getAttribute('data-vh') || null;
  }, true);
  function svg(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[k] + '</svg>'; }
  function groupOf(t) {
    if (/عجلة|جدول|اتصال/.test(t)) return 'birth';
    if (/منزل/.test(t)) return 'lunar';
    if (/سنتك|قراءة/.test(t)) return 'year';
    if (/فترة|الفترات/.test(t)) return 'dasha';
    return null;
  }
  var LK = ['ketu', 'venus', 'sun', 'moon', 'mars', 'node', 'jupiter', 'saturn', 'mercury'], __notes = null;
  function loadNotes(cb) {
    var sb = window.aqeeqSupabase; if (!sb || !isAdmin()) return;
    if (__notes) { cb(__notes); return; }
    sb.from('expert_notes').select('chart,planet,house,note').then(function (r) {
      if (r.error) return; var n = {};
      (r.data || []).forEach(function (x) { ((n[x.chart] = n[x.chart] || {})[x.planet] = n[x.chart][x.planet] || {})[x.house] = x.note; });
      __notes = n; cb(n);
    }, function () {});
  }
  function fillSlots(root) {
    var slots = root.querySelectorAll('.vh-ex-slot'); if (!slots.length || !isAdmin()) return;
    loadNotes(function (n) {
      Array.prototype.forEach.call(slots, function (el) {
        var h = '';
        if (el.dataset.sade) { var t = n.sade && n.sade.saturn && n.sade.saturn[el.dataset.sade]; if (t) h = '<b>ملاحظة الخبير على المرحلة</b><span>' + esc(t) + '</span>'; }
        if (el.dataset.dl) el.dataset.dl.split(',').forEach(function (q) {
          var a = q.split(':'), t = n.d1 && n.d1[a[1]] && n.d1[a[1]][+a[2] + 1];
          if (t) h += '<b>' + esc(a[0]) + ' في بيتك ' + (+a[2] + 1) + '</b><span>' + esc(t) + '</span>';
        });
        if (h) { el.innerHTML = h; el.hidden = false; }
      });
    });
  }
  function sadeCard(result) {
    var SS = window.AqVedic && window.AqVedic.T && window.AqVedic.T.SS, cur = '';
    result.querySelectorAll('.eam-acc-body p').forEach(function (p) { if (/ساتي ساتي/.test(p.textContent) && !cur) { cur = p.textContent; p.setAttribute('data-vh-sade', '1'); } });
    if (!cur) return null;
    var d = document.createElement('section'); d.className = 'vh-sade';
    var inside = SS && SS.indexOf(cur) >= 0;
    d.innerHTML = (inside ? '' : '<p class="vh-sade-now">' + cur.replace(/</g, '&lt;') + '</p>') + (SS ? '<h5>' + (inside ? 'المراحل الثلاث، وأنت الآن في المرحلة المظللة' : 'المراحل الثلاث') + '</h5>' : '') + (SS ? '<ol class="vh-steps">' + SS.map(function (t) { return '<li' + (t === cur ? ' class="on"' : '') + '>' + t.replace(/</g, '&lt;') + '</li>'; }).join('') + '</ol>' : '') +
      (inside ? '<div class="vh-ex-slot" data-sade="' + (SS.indexOf(cur) + 1) + '" hidden></div>' : '');
    fillSlots(d);
    return d;
  }
  function isAdmin() { return !!(window.AqSession && window.AqSession.isAdmin) || document.documentElement.getAttribute('data-admin') === '1'; }
  var EXPERT_N = { d1: 1, d2: 2, d4: 4, d6: 6, d7: 7, d8: 8, d9: 9, d10: 10, d11: 11, d27: 27, d30: 30 };
  function expertCard() {
    var d = document.createElement('section'); d.className = 'vh-expert'; d.dataset.vhG = 'expert';
    d.innerHTML = '<p class="vh-ex-lead">هذا القسم لك وحدك، ويُفتح بحسابك المسجَّل. الأكواد الصغيرة تظهر الآن جنب الكواكب في صفحة الخرائط المقسمة.</p><div class="vh-ex-out" aria-live="polite"></div>';
    d.__load = function () {
      var out = d.querySelector('.vh-ex-out'); out.textContent = 'جارٍ فتح ملاحظاتك…';
      var sb = window.aqeeqSupabase;
      if (!sb || !isAdmin()) { out.textContent = 'سجّل الدخول بحساب الأدمن لتظهر ملاحظاتك.'; return; }
      sb.from('expert_notes').select('chart,planet,house,note').then(function (r) {
        if (r.error) { out.textContent = 'جدول ملاحظات الخبير غير مُجهَّز بعد.'; return; }
        var notes = {}; (r.data || []).forEach(function (x) { ((notes[x.chart] = notes[x.chart] || {})[x.planet] = notes[x.chart][x.planet] || {})[x.house] = x.note; });
        var L = window.AqVedic && window.AqVedic.last, VC = window.AqVedicChart, html = '', found = 0;
        if (!L || !VC) { out.textContent = 'احسب الخريطة أولًا.'; return; }
        Object.keys(EXPERT_N).forEach(function (k) {
          var tbl = notes[k]; if (!tbl) return;
          var n = EXPERT_N[k], v = VC.VARGAS.filter(function (x) { return x[0] === n; })[0], map = VC.build(L.ch, n), rows = '';
          map.items.forEach(function (it) {
            var t = tbl[it.key] && tbl[it.key][it.house + 1];
            if (t) { found++; var cs = VC.codesFor(map, it).map(function (c) { return '<em class="vc-code">[' + c + ']</em>'; }).join(''); rows += '<li><div class="vh-ex-h"><b>' + esc(it.name) + '</b><i>البيت ' + (it.house + 1) + '</i>' + cs + '</div><span>' + esc(t) + '</span></li>'; }
          });
          if (rows) html += '<details class="vh-ex-acc"' + (html ? '' : ' open') + '><summary><span>' + esc(v ? v[1] + ' · ' + v[2] : k) + '</span><em>' + map.items.filter(function (it) { return tbl[it.key] && tbl[it.key][it.house + 1]; }).length + '</em></summary><ul class="vh-ex-list">' + rows + '</ul></details>';
        });
        out.innerHTML = found ? html : '<p>لا توجد ملاحظات تنطبق على هذه الخريطة بعد.</p>';
      }, function () { out.textContent = 'تعذر فتح الملاحظات الآن.'; });
    };
    return d;
  }
  /* آلة الزمن: الداشا النشطة (كبرى/صغرى/دقيقة) والعبورات الفيدية في أي تاريخ فوق خريطته */
  var MON = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fdt(ms) { return new Date(ms).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }); }
  function timeCard() {
    var d = document.createElement('section'); d.className = 'vh-tm'; d.dataset.vhG = 'dasha year';
    var now = new Date(), yr = now.getFullYear(), o = function (a, b) { return '<option value="' + a + '">' + b + '</option>'; }, i, days = '', mons = '', yrs = '';
    for (i = 1; i <= 31; i++) days += o(i, i);
    MON.forEach(function (m, k) { mons += o(k + 1, m); });
    for (i = yr + 60; i >= 1920; i--) yrs += o(i, i);
    d.innerHTML = '<h5>آلة الزمن</h5><p class="vh-tm-lead">اختر أي تاريخ، ماضيًا كان أو قادمًا، لترى الفترة التي كانت تعمل فيك وقتها ومواضع الكواكب فوق خريطتك.</p>' +
      '<div class="vh-tm-row"><select class="vh-tm-d" aria-label="اليوم">' + days + '</select><select class="vh-tm-m" aria-label="الشهر">' + mons + '</select><select class="vh-tm-y" aria-label="السنة">' + yrs + '</select></div>' +
      '<button type="button" class="vh-tm-go">اعرض هذا التاريخ</button><div class="vh-tm-out" aria-live="polite"></div>';
    d.querySelector('.vh-tm-d').value = now.getDate(); d.querySelector('.vh-tm-m').value = now.getMonth() + 1; d.querySelector('.vh-tm-y').value = yr;
    d.querySelector('.vh-tm-go').addEventListener('click', function () {
      var out = d.querySelector('.vh-tm-out'), dd = +d.querySelector('.vh-tm-d').value, mm = +d.querySelector('.vh-tm-m').value, yy = +d.querySelector('.vh-tm-y').value;
      var ms = Date.UTC(yy, mm - 1, dd, 12), chk = new Date(ms);
      if (chk.getUTCDate() !== dd) { out.innerHTML = '<p class="vh-tm-err">هذا التاريخ غير موجود في الشهر المختار.</p>'; return; }
      try { out.innerHTML = timeHTML(ms); fillSlots(out); } catch (e) { console.warn(e); out.innerHTML = '<p class="vh-tm-err">تعذر حساب هذا التاريخ.</p>'; }
    });
    return d;
  }
  function pick(list, ms) { for (var i = 0; i < list.length; i++) if (ms >= list[i].s && ms < list[i].e) return list[i]; return null; }
  function timeHTML(ms) {
    var V = window.AqVedic, VC = window.AqVedicChart, E = window.AqEam, L = V && V.last;
    if (!V || !VC || !E || !L) return '<p class="vh-tm-err">احسب خريطتك أولًا.</p>';
    var ch = L.ch, natal = L.natal, T = V.T, moonB = (ch.bodies || []).filter(function (b) { return String(b.key).toLowerCase() === 'moon'; })[0];
    var birthMs = natal && isFinite(natal.utcMs) ? natal.utcMs : (ch.jde - 2440587.5) * 864e5;
    if (ms < birthMs) return '<p class="vh-tm-err">هذا التاريخ قبل ميلادك، اختر تاريخًا بعده.</p>';
    var ds = V.dashas(moonB.lon, birthMs), maha = pick(ds, ms);
    if (!maha) return '<p class="vh-tm-err">هذا التاريخ خارج دورة الفترات المحسوبة (120 سنة).</p>';
    var an = V.antars(maha), ant = pick(an, ms), pr = V.antars(ant), pra = pick(pr, ms);
    var tch = E.engineChart(ms, natal), off = E.ayanamsa(tch.jde), norm = E.norm;
    var lagna = ch.known ? Math.floor(ch.asc / 30) : Math.floor(moonB.lon / 30), basis = ch.known ? 'الطالع' : 'القمر';
    var SG = T.SG, h = '';
    h += '<h6>الفترة النشطة في ' + fdt(ms) + '</h6><ul class="vh-tm-dash"><li><span>الكبرى</span><b>' + T.LORDS[maha.lord] + '</b><i>' + fdt(maha.s) + ' إلى ' + fdt(maha.e) + '</i></li>' +
      '<li><span>الصغرى</span><b>' + T.LORDS[ant.lord] + '</b><i>' + fdt(ant.s) + ' إلى ' + fdt(ant.e) + '</i></li>' +
      '<li><span>الدقيقة</span><b>' + T.LORDS[pra.lord] + '</b><i>' + fdt(pra.s) + ' إلى ' + fdt(pra.e) + '</i></li></ul>';
    h += '<p class="vh-tm-txt">' + esc(T.LT[ant.lord]) + '</p>';
    if (isAdmin()) {
      var d1 = VC.build(ch, 1).items, dl = [[maha, 'الكبرى'], [ant, 'الصغرى']].map(function (z) {
        var key = LK[z[0].lord], it = d1.filter(function (x) { return x.key === key; })[0];
        return it ? z[1] + ' ' + T.LORDS[z[0].lord] + ':' + key + ':' + it.house : '';
      }).filter(Boolean).join(',');
      if (dl) h += '<div class="vh-ex-slot" data-dl="' + esc(dl) + '" hidden></div>';
    }
    var keys = [['sun', 'الشمس'], ['moon', 'القمر'], ['mars', 'المريخ'], ['mercury', 'عطارد'], ['jupiter', 'المشتري'], ['venus', 'الزهرة'], ['saturn', 'زحل'], ['node', 'راهو'], ['ketu', 'كيتو']], rows = '', sat = null, moonT = null, moonSign = Math.floor(moonB.lon / 30);
    keys.forEach(function (k) {
      var lon = null, retro = false, list = tch.bodies || [], j, kk;
      if (k[0] === 'ketu') { for (j = 0; j < list.length; j++) { kk = String(list[j].key).toLowerCase(); if (kk === 'node' || kk === 'truenode') { lon = norm(list[j].lon + 180); break; } } retro = true; }
      else { for (j = 0; j < list.length; j++) { kk = String(list[j].key).toLowerCase(); if (kk === k[0] || (k[0] === 'node' && (kk === 'node' || kk === 'truenode'))) { lon = list[j].lon; retro = k[0] === 'node' || !!list[j].retro; break; } } }
      if (lon == null) return;
      var sg = Math.floor(norm(lon - off) / 30), hs = (sg - lagna + 12) % 12, hm = (sg - moonSign + 12) % 12;
      if (k[0] === 'saturn') sat = hm;
      rows += '<tr><th>' + k[1] + (retro && k[0] !== 'node' && k[0] !== 'ketu' ? ' ℞' : '') + '</th><td>' + SG[sg] + '</td><td>' + (hs + 1) + '</td><td>' + (hm + 1) + '</td></tr>';
    });
    h += '<h6>العبورات الفيدية فوق خريطتك</h6><div class="eam-table-wrap"><table class="eam-table"><thead><tr><th>الكوكب</th><th>البرج</th><th>البيت من ' + basis + '</th><th>البيت من القمر</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    var SS = T.SS, idx = sat === 11 ? 0 : sat === 0 ? 1 : sat === 1 ? 2 : -1;
    h += '<p class="vh-tm-txt">' + (idx >= 0 ? esc(SS[idx]) : 'في هذا التاريخ كان زحل خارج دائرة ساتي ساتي بالنسبة لقمرك.') + '</p>';
    h += '<p class="vh-tm-note">هذه قراءة تحليلية محتملة لطاقة الفترة، وليست تنبؤًا بحدث بعينه. الفترة تُظهر المناخ العام، والعبورات تُظهر أين يضغط الوقت على خريطتك، وما يحدث فعلًا يتوقف على ظروفك وقراراتك.</p>';
    return h;
  }

  function accEl(title, ic, html, open, g) {
    var d = document.createElement('details'); d.className = 'eam-acc eam-t-g'; if (open) d.open = true; d.dataset.vhG = g;
    d.innerHTML = '<summary><span class="eam-acc-ic">' + svg(ic) + '</span><span class="eam-acc-t">' + title + '</span><span class="eam-acc-ch" aria-hidden="true"></span></summary><div class="eam-acc-body">' + html + '</div>';
    return d;
  }
  function span(ms) {
    var d = Math.max(0, Math.round(ms / 864e5)), y = Math.floor(d / 365.25), m = Math.round((d - y * 365.25) / 30.44);
    if (m === 12) { y++; m = 0; }
    return (y ? y + ' سنة' : '') + (y && m ? ' و' : '') + (m ? m + ' شهر' : (y ? '' : 'أيام قليلة'));
  }
  var PH = [
    ['الاقتراب', 'زحل في البرج الذي قبل برج قمرك', [
      'تبدأ المرحلة حين يدخل زحل البرج الذي يسبق برج قمرك. هنا يضغط الوقت على ما يخرج منك: المصروفات، والنوم، والراحة، والأماكن البعيدة، والمشاعر التي تكتمها.',
      'تحس أن الحمل يزيد قبل أن تعرف السبب، وأن طاقتك تتسرب في التزامات لم تخترها. كثيرون يظنون في هذه الفترة أن الدنيا تضيق، وهي في الحقيقة تطلب منك ترتيب ما أهملته.',
      'كيف تستفيد منها: رتّب مصاريفك، وقلّل الالتزامات التي لا تعنيك، وثبّت مواعيد نومك، ولا تأخذ قرارًا كبيرًا وأنت متعب.']],
    ['الذروة', 'زحل فوق برج قمرك', [
      'هذه أثقل مراحل ساتي ساتي نفسيًا، لأن زحل يمر فوق برج قمرك نفسه، فيمس المزاج والشعور بالأمان والبيت والعلاقات القريبة.',
      'تنكشف فيها الأشياء التي كنت تعتمد عليها دون أن تفحصها: علاقة تتعب، أو عادة تستنزفك، أو يقين ورثته ولم تختبره. يزيد الميل للوحدة والمراجعة، وقد تبدو الأيام أبطأ من العادة.',
      'كيف تستفيد منها: خفّف الأحمال بقدر ما تستطيع، وثبّت روتينًا بسيطًا لا يتغير، ولا تقطع علاقة في عز الضغط، واطلب سندًا من شخص تثق به.']],
    ['الانفراج', 'زحل في البرج الذي بعد برج قمرك', [
      'حين ينتقل زحل إلى البرج الذي بعد برج قمرك يخف الضغط تدريجيًا، ويتجه الاهتمام إلى المال والكلام والأسرة، أي إلى ما تبنيه بعد الاختبار.',
      'هذه مرحلة الحصاد البطيء: ما عملته بصبر يبدأ يظهر، وما لم يكن صالحًا للبقاء يسقط بهدوء. قد تبقى بعض آثار التعب، لكنها تتراجع مع الوقت.',
      'كيف تستفيد منها: سدّد الالتزامات القديمة، وابنِ مدخراتك بتؤدة، وانتبه لكلامك مع أهلك لأن الحدة تعود بسهولة في هذه المرحلة.']]
  ];
  function sadeCycles(L) {
    var E = window.AqEam, natal = L.natal, ch = L.ch, norm = E.norm;
    var moonB = (ch.bodies || []).filter(function (b) { return String(b.key).toLowerCase() === 'moon'; })[0];
    var ms0 = Math.floor(moonB.lon / 30), targets = [(ms0 + 11) % 12, ms0, (ms0 + 1) % 12];
    function sign(ms) {
      var tch = E.engineChart(ms, natal), off = E.ayanamsa(tch.jde), l = tch.bodies || [], i;
      for (i = 0; i < l.length; i++) if (String(l[i].key).toLowerCase() === 'saturn') return Math.floor(norm(l[i].lon - off) / 30);
      return -1;
    }
    var DAY = 864e5, now = Date.now(), start = now - 34 * 365.25 * DAY, end = now + 34 * 365.25 * DAY, step = 20 * DAY;
    var prev = sign(start), segs = [{ sign: prev, s: start }], t;
    for (t = start + step; t <= end; t += step) {
      var sg = sign(t);
      if (sg !== prev) {
        var lo = t - step, hi = t;
        while (hi - lo > DAY) { var mid = (lo + hi) / 2; if (sign(mid) === prev) lo = mid; else hi = mid; }
        segs[segs.length - 1].e = hi; segs.push({ sign: sg, s: hi }); prev = sg;
      }
    }
    segs[segs.length - 1].e = end;
    var cl = [], cur = null;
    segs.forEach(function (g) {
      var k = targets.indexOf(g.sign); if (k < 0) return;
      if (!cur || g.s - cur.e > 2 * 365.25 * DAY) { cur = { s: g.s, e: g.e, ph: [null, null, null] }; cl.push(cur); }
      cur.e = g.e; cur.s = Math.min(cur.s, g.s);
      var p = cur.ph[k]; cur.ph[k] = p ? { s: Math.min(p.s, g.s), e: Math.max(p.e, g.e) } : { s: g.s, e: g.e };
    });
    cl = cl.filter(function (c) { return c.s > start + 40 * DAY && c.e < end - 40 * DAY && c.ph.every(Boolean); });
    return { cl: cl, targets: targets, now: now };
  }
  function fillSade(result) {
    var V = window.AqVedic, L = V && V.last, SG = V.T.SG, host = result;
    var out = [];
    try {
      var D = sadeCycles(L), now = D.now, c = null, nxt = null, prv = null, i;
      for (i = 0; i < D.cl.length; i++) { if (now >= D.cl[i].s && now < D.cl[i].e) c = D.cl[i]; else if (D.cl[i].s > now && !nxt) nxt = D.cl[i]; else if (D.cl[i].e <= now) prv = D.cl[i]; }
      if (c && nxt === null) { /* keep */ }
      var rng = function (p) { return 'من ' + fdt(p.s) + ' إلى ' + fdt(p.e); };
      var now1 = '', k = -1;
      if (c) {
        for (i = 0; i < 3; i++) if (now >= c.ph[i].s && now < c.ph[i].e) k = i;
        if (k < 0) k = now < c.ph[1].s ? 0 : (now < c.ph[2].s ? 1 : 2);
        var p = c.ph[k];
        now1 = '<p class="vh-sade-now">أنت الآن داخل ساتي ساتي، في المرحلة ' + ['الأولى', 'الثانية', 'الثالثة'][k] + ' (' + PH[k][0] + '): ' + PH[k][1] + ' (' + SG[D.targets[k]] + ').</p>' +
          '<ul class="vh-sade-facts"><li><span>بدأت المرحلة</span><b>' + fdt(p.s) + '</b></li><li><span>تنتهي</span><b>' + fdt(p.e) + '</b></li><li><span>مضى منها</span><b>' + span(now - p.s) + '</b></li><li><span>المتبقي</span><b>' + span(p.e - now) + '</b></li></ul>' +
          '<p class="vh-sade-cyc">الدورة كلها ' + rng(c) + '، أي نحو ' + span(c.e - c.s) + '.</p><div class="vh-ex-slot" data-sade="' + (k + 1) + '" hidden></div>';
      } else {
        now1 = '<p class="vh-sade-now">أنت الآن خارج ساتي ساتي.' + (nxt ? ' تبدأ الدورة القادمة في ' + fdt(nxt.s) + '، بعد ' + span(nxt.s - now) + '.' : '') + (prv ? ' وانتهت آخر دورة في ' + fdt(prv.e) + '.' : '') + '</p>';
      }
      out.push(accEl('أين أنت الآن', 'sade', now1, true, 'sade'));
      var show3 = c || nxt || prv;
      if (show3) {
        out.push(accEl('المراحل الثلاث بتواريخها', 'dasha', '<p class="vh-sade-cyc">' + (c ? 'الدورة الحالية' : nxt ? 'الدورة القادمة' : 'آخر دورة') + '</p><ol class="vh-steps">' + show3.ph.map(function (p, j) { return '<li' + (c && j === k ? ' class="on"' : '') + '><b>' + ['المرحلة الأولى: ', 'المرحلة الثانية: ', 'المرحلة الثالثة: '][j] + PH[j][0] + ' · ' + SG[D.targets[j]] + '</b><br>' + rng(p) + '<br><small>المدة: ' + span(p.e - p.s) + '</small></li>'; }).join('') + '</ol>', false, 'sade'));
      }
      out.push(accEl('ماذا تعني كل مرحلة', 'star', PH.map(function (x, j) { return '<h6>' + ['الأولى', 'الثانية', 'الثالثة'][j] + ': ' + x[0] + '</h6>' + x[2].map(function (t) { return '<p>' + t + '</p>'; }).join(''); }).join(''), false, 'sade'));
      var cyc = D.cl.map(function (z) { return '<li' + (z === c ? ' class="on"' : '') + '>' + rng(z) + (z === c ? ' (الحالية)' : z.s > now ? ' (قادمة)' : ' (سابقة)') + '</li>'; }).join('');
      if (cyc) out.push(accEl('الدورات السابقة والقادمة', 'event', '<ol class="vh-steps">' + cyc + '</ol><p class="vh-tm-note">كل دورة تتكرر كل نحو ثلاثين سنة، وتُحسب من دخول زحل البرج الذي قبل قمرك حتى خروجه من البرج الذي بعده.</p>', false, 'sade'));
    } catch (e) { console.warn(e); out = [accEl('ساتي ساتي', 'sade', '<p class="vh-tm-err">تعذر حساب الدورات الآن.</p>', true, 'sade')]; }
    out.forEach(function (d) { result.appendChild(d); fillSlots(d); });
  }
  function d1Card() {
    var VC = window.AqVedicChart, L = window.AqVedic && window.AqVedic.last; if (!VC || !L) return null;
    var style = 'n'; try { style = localStorage.getItem('aq-vedic-style') === 's' ? 's' : 'n'; } catch (e) { }
    var d = accEl('خريطة الميلاد بالمربع الهندي', 'birth', '', true, 'birth'), body = d.querySelector('.eam-acc-body');
    function draw() {
      var map = VC.build(L.ch, 1), title = 'خريطة الميلاد · راشي D1';
      body.innerHTML = '<div class="vc-styles" role="group" aria-label="شكل الرسم"><button type="button" class="vc-st' + (style === 'n' ? ' on' : '') + '" data-s="n">شمالي</button><button type="button" class="vc-st' + (style === 's' ? ' on' : '') + '" data-s="s">جنوبي</button></div><div class="vc-chartwrap">' + (style === 's' ? VC.svgSouth(map, title) : VC.svg(map, title)) + '</div><p class="vc-key"><i class="vc-t-n">نور</i><i class="vc-t-s">ظل</i><i class="vc-t-g">الشمس</i><i class="vc-t-l">الطالع</i></p>';
      Array.prototype.forEach.call(body.querySelectorAll('.vc-st'), function (b) { b.addEventListener('click', function () { style = b.dataset.s; try { localStorage.setItem('aq-vedic-style', style); } catch (e) { } draw(); }); });
    }
    draw(); return d;
  }
  (function pre() {
    var form = document.getElementById('eam-form'); if (!form) return;
    var nav = document.createElement('nav'); nav.className = 'vh-grid vh-pre'; nav.setAttribute('aria-label', 'أقسام الفلك الفيدي');
    nav.innerHTML = TILES.map(function (t) {
      return '<button type="button" class="vh-tile" data-g="' + t[0] + '"' + (t[0] === 'expert' ? ' hidden' : '') + '><span class="vh-ic">' + svg(t[0]) + '</span><span class="vh-t">' + t[1] + '</span><span class="vh-s">' + t[2] + '</span></button>';
    }).join('');
    var hint = document.createElement('p'); hint.className = 'vh-pre-hint'; hint.hidden = true;
    form.parentNode.insertBefore(nav, form); form.parentNode.insertBefore(hint, form);
    nav.addEventListener('click', function (e) {
      var b = e.target.closest('.vh-tile'); if (!b) return;
      TARGET = b.dataset.g; hint.hidden = false; hint.textContent = 'ادخل بيانات ميلادك ثم اضغط احسب، وسنفتح لك مباشرة: ' + ((TILES.filter(function (t) { return t[0] === TARGET; })[0] || [])[1] || '');
      try { form.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (x) { }
    });
    setInterval(function () {
      var on = !sec.classList.contains('eam-view-result') && !!form.offsetParent;
      nav.hidden = !on; if (!on) hint.hidden = true;
      var ex = nav.querySelector('[data-g="expert"]'); if (ex) ex.hidden = !isAdmin();
    }, 500);
  })();

  function build() {
    var result = content.querySelector('#eam-result');
    if (!result || result.hidden || !result.querySelector('#vx-vargas') || result.querySelector('.vh-grid')) return;
    /* الأكورديونات داخل .vx-wrap: نرفعها لمستوى النتيجة كي تُصنَّف مع أقسامها */
    Array.prototype.slice.call(result.querySelectorAll(':scope > .vx-wrap:not(.vx-top)')).forEach(function (w) {
      Array.prototype.slice.call(w.children).forEach(function (c) { result.insertBefore(c, w); });
      w.style.display = 'none'; w.dataset.vhG = 'misc';
    });
    var kids = Array.prototype.slice.call(result.children);
    kids.forEach(function (c) {
      if (c.classList.contains('eam-result-head')) c.dataset.vhG = 'hub birth';
      else if (c.classList.contains('vx-top')) c.dataset.vhG = 'vargas';
      else if (c.matches('details.eam-acc')) { var t = (c.querySelector('.eam-acc-t') || {}).textContent || ''; c.dataset.vhG = groupOf(t) || 'birth'; }
      else c.dataset.vhG = 'misc';
    });
    var sade = true;
    var grid = document.createElement('nav'); grid.className = 'vh-grid'; grid.dataset.vhG = 'hub'; grid.setAttribute('aria-label', 'أقسام الفلك الفيدي');
    grid.innerHTML = TILES.filter(function (t) { return (t[0] !== 'sade' || sade) && (t[0] !== 'expert' || isAdmin()); }).map(function (t) {
      return '<button type="button" class="vh-tile" data-g="' + t[0] + '"><span class="vh-ic">' + svg(t[0]) + '</span><span class="vh-t">' + t[1] + '</span><span class="vh-s">' + t[2] + '</span></button>';
    }).join('');
    var bar = document.createElement('div'); bar.className = 'vh-bar'; bar.dataset.vhG = 'vargas birth dasha sade lunar year expert';
    bar.innerHTML = '<button type="button" class="vh-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg><span>كل الأقسام</span></button><b class="vh-cur"></b>';
    var head = result.querySelector('.eam-result-head');
    result.insertBefore(grid, head ? head.nextSibling : result.firstChild);
    result.insertBefore(bar, grid);
    var dc = d1Card(); if (dc) { var fb = result.querySelector('details.eam-acc[data-vh-g="birth"]'); result.insertBefore(dc, fb || null); }
    var tmc = timeCard(), tmw = accEl('آلة الزمن', 'dasha', '', true, 'dasha year'); tmw.querySelector('.eam-acc-body').appendChild(tmc); tmc.dataset.vhG = ''; result.appendChild(tmw);
    if (isAdmin()) { var exC = expertCard(), exw = accEl('ملاحظات الخبير', 'expert', '', true, 'expert'); exw.querySelector('.eam-acc-body').appendChild(exC); exC.dataset.vhG = ''; result.appendChild(exw); result.__ex = exC; }
    function show(g, chart) {
      if (g !== 'hub' && result.dataset.vh === 'hub') { try { history.pushState({ vh: 1 }, ''); PUSHED++; } catch (e) { } }
      if (g === 'sade' && !result.__sade) { result.__sade = 1; fillSade(result); }
      result.dataset.vh = g;
      Array.prototype.slice.call(result.children).forEach(function (c) {
        var gs = (c.dataset.vhG || '').split(' ');
        c.style.display = (gs.indexOf(g) >= 0 || (g === 'moonsun' && gs.indexOf('vargas') >= 0)) ? '' : 'none';
      });
      var name = (TILES.filter(function (t) { return t[0] === g; })[0] || [])[1] || '';
      bar.querySelector('.vh-cur').textContent = g === 'hub' ? '' : name;
      if (g !== 'hub') {
        bar.style.display = '';
        var ds = result.querySelectorAll('details.eam-acc');
        var mine = Array.prototype.filter.call(ds, function (d) { return d.dataset.vhG === g; });
        if (mine.length === 1) mine[0].open = true;
      } else bar.style.display = 'none';
      if (g === 'expert' && result.__ex) {
        var was = window.AqVedicExpert && window.AqVedicExpert.on; window.AqVedicExpert = { on: true };
        if (!was) Array.prototype.forEach.call(result.querySelectorAll('#vx-vargas'), function (h) { if (h.__draw) h.__draw(); });
        result.__ex.__load();
      }
      if (g === 'moonsun') { var b = result.querySelector('.vc-chip[data-n="' + (chart || 'moon') + '"]'); if (b) b.click(); }
      if (g === 'vargas') { var o = result.querySelector('.vc-chip[data-n="1"]'); if (o && !result.querySelector('.vc-chip.on')) o.click(); }
      if (!first) try { result.scrollIntoView({ block: 'start' }); } catch (e) { }
      first = false;
    }
    var first = true;
    grid.addEventListener('click', function (e) { var b = e.target.closest('.vh-tile'); if (b) show(b.dataset.g); });
    bar.querySelector('.vh-back').addEventListener('click', function () { show('hub'); });
    result.__show = show;
    show('hub');
    try { history.pushState({ vhr: 1 }, ''); PUSHED++; } catch (e) { }
    if (TARGET && (TARGET !== 'expert' || isAdmin())) { var tg = TARGET; TARGET = null; show(tg); } else TARGET = null;
    sec.classList.add('vh-on');
  }
  function liveResult() { var r = content.querySelector('#eam-result'); return r && !r.hidden && r.__show && sec.classList.contains('eam-view-result') && location.hash === '#astro-maps' ? r : null; }
  window.addEventListener('click', function (e) {
    var r = liveResult(); if (!r) return;
    if (e.target.closest('[data-aq-back]') && PUSHED > 0) { e.preventDefault(); e.stopImmediatePropagation(); history.back(); return; }
    if (e.target.closest('.eam-backbar') && PUSHED > 0) { var n = PUSHED; setTimeout(function () { try { history.go(-n); } catch (x) { } }, 60); }
  }, true);
  window.addEventListener('popstate', function () {
    if (PUSHED > 0) PUSHED--;
    var r = liveResult(); if (!r) return;
    if (r.dataset.vh !== 'hub') r.__show('hub');
    else { var b = content.querySelector('.eam-backbar button'); if (b) b.click(); }
  });
  var timer = null;
  new MutationObserver(function () { clearTimeout(timer); timer = setTimeout(function () { try { build(); prefill(); } catch (e) { console.warn(e); } }, 320); })
    .observe(content, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  var filled = false;
  function prefill() {
    if (filled) return;
    var d = document.getElementById('eam-b-date'), f = document.getElementById('eam-b-fill'), C = window.AqeeqChartContext;
    if (!d || !f || d.value || !C || !C.getOrPrefill) return;
    var n = null; try { n = C.getOrPrefill(); } catch (e) { }
    if (!n) return;
    filled = true; f.click();
  }
  function go() {
    if (!TARGET) return;
    var r = content.querySelector('#eam-result');
    if (r && !r.hidden && r.__show) { var tg = TARGET; TARGET = null; r.__show(tg); return; }
    var d = document.getElementById('eam-b-date'), f = document.getElementById('eam-form');
    if (d && d.value && f) { try { f.requestSubmit(); } catch (e) { } }
  }
  window.addEventListener('hashchange', function () { if (location.hash === '#astro-maps') { setTimeout(prefill, 400); setTimeout(go, 1100); } });
  document.addEventListener('DOMContentLoaded', function () { setTimeout(prefill, 1500); });
  setTimeout(prefill, 2500);
})();
