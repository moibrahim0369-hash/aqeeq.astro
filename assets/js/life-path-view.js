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
    var intro = '<header class="lpj-intro lpj-reveal"><h1>مسار حياتك</h1><p>اقرأ الإيقاع العام لرحلتك، والمراحل التي تحمل دروسك ونقاط تحوّلك.</p></header>';
    var hero = '<section class="lpj-hero lpj-reveal" style="--d:80ms" aria-labelledby="lpj-hero-t"><div class="lpj-orb">' + orbit() + '</div>' +
      '<div class="lpj-num" aria-label="رقم مسار الحياة ' + inp.lp + '"><button type="button" data-lpj-interp aria-label="اقرأ معنى رقم ' + inp.lp + '">' + inp.lp + '</button></div>' +
      '<div class="lpj-hero-txt"><span class="lpj-kick">مسار الحياة</span><h2 id="lpj-hero-t">' + esc(inp.title) + '</h2>' + (inp.tag ? '<p>' + esc(inp.tag) + '</p>' : '') +
      '<div class="lpj-hmeta"><span>تاريخ الميلاد: ' + pad(inp.d) + '/' + pad(inp.m) + '/' + inp.y + '</span><span>العمر الحالي: ' + age + ' سنة</span></div>' +
      '<div class="lpj-btns"><button type="button" class="lpj-btn" data-lpj-interp><span>اقرأ معنى مسارك</span>' + I.arrow + '</button>' +
      '<a class="lpj-btn ghost" href="#life-path-synastry"><span>قارن مساري الحياة</span>' + I.arrow + '</a>' +
      '<button type="button" class="lpj-btn ghost" data-lpj-edit><span>تعديل التاريخ</span></button></div></div></section>';
    function metric(ico, label, tip, val, desc, d) {
      return '<div class="lpj-m lpj-reveal" style="--d:' + d + 'ms"><span class="lpj-ico">' + ico + '</span><div><small>' + label + '<button type="button" class="lpj-tip" data-tip="' + esc(tip) + '" aria-label="' + esc(tip) + '">؟</button></small><b>' + val + '</b><span class="d">' + desc + '</span></div></div>';
    }
    var metrics = '<div class="lpj-metrics">' +
      metric(I.life, 'مسار الحياة', TIPS.life, inp.lp, esc(inp.title.replace(/^.*?:\s*/, '')) || '', 160) +
      metric(I.peak, 'القمة الحالية', TIPS.peak, curP ? curP.value : NA, curP && curP.period ? esc(curP.period.label) : '', 230) +
      metric(I.gate, 'التحدي الحالي', TIPS.chal, curC ? curC.value : NA, curC && curC.period ? esc(curC.period.label) : '', 300) + '</div>';

    var steps = P.map(function (p, i) {
      var s = statusOf(i, cur), rd = pr(p.value), st = STATUS[s];
      return '<li><button type="button" class="lpj-st" data-i="' + i + '" data-status="' + s + '" aria-pressed="' + (i === cur) + '"' + (s === 'current' ? ' aria-current="step"' : '') + ' aria-label="المرحلة ' + (i + 1) + ': ' + st[0] + '، ' + esc(p.period.label) + '">' +
        '<span class="lpj-node">' + STAGE_ICO[i] + '</span><span class="body"><span class="n">المرحلة ' + (i + 1) + '</span><span class="t">' + esc(rd ? rd.title : 'القمة ' + p.value) + '</span><span class="p">' + esc(p.period.label) + '</span>' +
        '<span class="vals">القمة ' + p.value + ' · التحدي ' + C[i].value + '</span><span class="lpj-tag">' + st[1] + st[0] + '</span></span></button></li>';
    }).join('');
    var timeline = section('رحلتك عبر المراحل', 'اضغط على أي مرحلة لعرض تفاصيلها.', '<ol class="lpj-tl" style="--p:' + (cur / (P.length - 1)) + '">' + steps + '</ol><div id="lpj-stage" class="lpj-stage" aria-live="polite"></div>', 'lpj-journey', 380);

    function rows(arr, kind) {
      return '<ol>' + arr.map(function (x, i) {
        var s = statusOf(i, cur);
        return '<li><button type="button" class="lpj-row" data-i="' + i + '" data-status="' + s + '" aria-pressed="' + (i === cur) + '"><span class="i">' + (i + 1) + '</span><span class="v">' + x.value + '</span><span class="tx"><b>' + (kind === 'p' ? 'القمة ' : 'التحدي ') + (i + 1) + '</b><span>' + esc(x.period.label) + '</span></span><span class="go">' + I.arrow + '</span></button></li>';
      }).join('') + '</ol>';
    }
    var pcs = section('القمم والتحديات', 'القيم والفترات كما يحسبها المحرك الحالي.',
      '<div class="lpj-pc"><div class="lpj-card"><h3>القمم الأربع</h3><p>مراحل العمر وطابع كل قمة</p>' + stairs() + rows(P, 'p') + '</div><div class="lpj-card ch"><h3>التحديات الأربعة</h3><p>الدرس المصاحب لكل مرحلة</p>' + rows(C, 'c') + '</div></div>', 'lpj-pc', 450);

    var interpHead = '<h2 id="lpj-interp-h" class="lpj-reveal" style="font-size:clamp(1.6rem,3.4vw,2.1rem);color:#351B28;margin:0 0 6px">قراءة مسارك</h2>';

    var top = '<div class="lpj-top lpj-wrap">' + crumb + intro + hero + metrics + timeline + pcs + '<div id="lpj-interp" tabindex="-1">' + interpHead + '</div></div>';

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
