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
  var TARGET = null;
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a) TARGET = a.getAttribute('data-vh') || null;
  }, true);
  (function cards() {
    var first = document.querySelector('a.rh-card[data-am="sidereal"]'); if (!first) return;
    var grid = first.parentNode, wrap = document.createElement('div');
    wrap.innerHTML = '<h3 class="rh-sub"><span>الفلك الفيدي: كل قسم وحده</span></h3><div class="rh-grid rh-grid-w">' +
      TILES.filter(function (t) { return t[0] !== 'expert'; }).map(function (t) {
        return '<a class="rh-card" href="#astro-maps" data-am="sidereal" data-vh="' + t[0] + '"><span class="rh-ico">' + svg(t[0]) + '</span><h3>' + t[1] + '</h3><p>' + t[2] + '</p><span class="rh-go">افتح ←</span></a>';
      }).join('') + '</div>';
    var ref = grid.nextSibling; while (wrap.firstChild) grid.parentNode.insertBefore(wrap.firstChild, ref);
  })();
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
    var sade = sadeCard(result);
    var grid = document.createElement('nav'); grid.className = 'vh-grid'; grid.dataset.vhG = 'hub'; grid.setAttribute('aria-label', 'أقسام الفلك الفيدي');
    grid.innerHTML = TILES.filter(function (t) { return (t[0] !== 'sade' || sade) && (t[0] !== 'expert' || isAdmin()); }).map(function (t) {
      return '<button type="button" class="vh-tile" data-g="' + t[0] + '"><span class="vh-ic">' + svg(t[0]) + '</span><span class="vh-t">' + t[1] + '</span><span class="vh-s">' + t[2] + '</span></button>';
    }).join('');
    var bar = document.createElement('div'); bar.className = 'vh-bar'; bar.dataset.vhG = 'vargas birth dasha sade lunar year expert';
    bar.innerHTML = '<button type="button" class="vh-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg><span>كل الأقسام</span></button><b class="vh-cur"></b>';
    var head = result.querySelector('.eam-result-head');
    result.insertBefore(grid, head ? head.nextSibling : result.firstChild);
    result.insertBefore(bar, grid);
    if (sade) { sade.dataset.vhG = 'sade'; result.appendChild(sade); }
    result.appendChild(timeCard());
    if (isAdmin()) { var exC = expertCard(); result.appendChild(exC); result.__ex = exC; }
    function show(g, chart) {
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
    if (TARGET && (TARGET !== 'sade' || sade) && (TARGET !== 'expert' || isAdmin())) { var tg = TARGET; TARGET = null; show(tg); } else TARGET = null;
    sec.classList.add('vh-on');
  }
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
