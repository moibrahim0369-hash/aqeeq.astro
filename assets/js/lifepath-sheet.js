/* مسار الحياة — نتيجة الجوال: بلاطات دائرية + نافذة سفلية + توحيد الأكورديونات.
   عرض فقط: يقرأ ما رسمه المحرك الحالي ولا يحسب أي قيمة. */
(function () {
  'use strict';
  var sec = document.getElementById('lifepath'), res = document.getElementById('lpresult');
  if (!sec || !res) return;
  var root = document.documentElement, lastKey = '', sheet = null;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function sv(d, w) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.6) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  var IC = {
    stages: sv('<path d="M3 20h4v-5h4v-5h4V5h6"/><path d="M3 20h18"/>'),
    peaks: sv('<path d="M2.5 19.5 9 8l4 6 3-4 5.500 9.500z"/>'),
    chal: sv('<path d="M12 3l8 3.500v5.500c0 4.500-3.300 7.800-8 9-4.700-1.200-8-4.500-8-9V6.500z"/><path d="M9 12l2.200 2.200L15.500 10"/>'),
    name: sv('<path d="M3.500 11.500C4.200 7 7.600 3.500 12 3.500s7.800 3.500 8.500 8"/><path d="M5.500 14c0-4.200 2.800-7.500 6.500-7.500s6.500 3.300 6.500 7.500"/><path d="M8.500 15c0-2.800 1.500-5 3.500-5s3.500 2.200 3.500 5"/><path d="M11 16c0-1.100.4-1.900 1-1.900s1 .8 1 1.900"/><path d="M6.500 19.500c.6-1.500.9-3 .9-4.500M9.500 21c.7-1.600 1.100-3.400 1.100-5.200M13 21.200c.4-1.500.6-3.200.6-5M16.500 20c.4-1.600.6-3.200.6-5M19 17.500c.2-1.100.3-2.200.3-3.200"/>'),
    heart: sv('<path d="M12 20s-7.500-4.600-7.500-10.200A4.200 4.200 0 0 1 12 7.300a4.200 4.200 0 0 1 7.500 2.500C19.500 15.400 12 20 12 20z"/>'),
    mask: sv('<path d="M4 7.500c0-1 .8-2 2-2h12c1.200 0 2 1 2 2V11c0 4.500-3.500 7.500-8 8.500C7.500 18.500 4 15.500 4 11z"/><path d="M8 10.500c.8-.6 1.700-.6 2.500 0M13.500 10.500c.8-.6 1.700-.6 2.500 0M9 14.500c1.700 1.200 4.300 1.200 6 0"/>'),
    route: sv('<circle cx="6" cy="19" r="2.200"/><circle cx="18" cy="5" r="2.200"/><path d="M6 16.800V14a4 4 0 0 1 4-4h4a4 4 0 0 0 4-4V7.200"/>'),
    chev: sv('<path d="M15 6l-6 6 6 6"/>', 2),
    back: sv('<path d="M5 12h14M13 6l6 6-6 6"/>', 2),
    light: sv('<circle cx="12" cy="12" r="4"/><path d="M12 3v2.500M12 18.500V21M3 12h2.500M18.500 12H21M5.600 5.600l1.800 1.800M16.600 16.600l1.800 1.800M5.600 18.400l1.800-1.800M16.600 7.400l1.800-1.800"/>'),
    shadow: sv('<path d="M20 14.500A8 8 0 0 1 9.500 4a8 8 0 1 0 10.500 10.500z"/>'),
    star: sv('<path d="M12 3l2.200 6 6 2.200-6 2.200L12 19.500l-2.200-6-6-2.200 6-2.200z"/>'),
    mirror: sv('<ellipse cx="12" cy="9.500" rx="5.500" ry="6.500"/><path d="M12 16v5M9 21h6"/>'),
    lock: sv('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    magnet: sv('<path d="M6 3v8a6 6 0 0 0 12 0V3h-4v8a2 2 0 0 1-4 0V3z"/><path d="M6 7h4M14 7h4"/>'),
    person: sv('<circle cx="12" cy="7.500" r="3.200"/><path d="M5.500 21v-1.500a6.500 6.500 0 0 1 13 0V21"/>'),
    body: sv('<circle cx="12" cy="5" r="2.200"/><path d="M12 8v6M7.500 10.500 12 12l4.500-1.500M9.500 21 12 14l2.500 7"/>'),
    scale: sv('<path d="M12 4v16M6 20h12M5 7h14"/><path d="M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>'),
    cross: sv('<path d="M9 4h6v5h5v6h-5v5H9v-5H4V9h5z"/>'),
    ask: sv('<circle cx="12" cy="12" r="9"/><path d="M9.500 9.500a2.500 2.500 0 1 1 3.500 2.300c-.7.400-1 1-1 1.700M12 17v.01"/>')
  };
  var TIC = [[/المراية/, 'mirror'], [/البلوكات/, 'lock'], [/الشفرة العاطفية/, 'heart'], [/مغناطيس/, 'magnet'], [/جرح الطفولة/, 'person'], [/البصمة الجسدية/, 'body'], [/جدول المقارنة/, 'scale'], [/روشتة/, 'cross'], [/خريطة التحول/, 'route']];
  function icFor(t, fb) { for (var i = 0; i < TIC.length; i++) if (TIC[i][0].test(t)) return IC[TIC[i][1]]; return fb; }
  var STT = { past: 'مرحلة مضت', current: 'أنت هنا', future: 'مرحلة قادمة' };

  /* ---------- النافذة السفلية ---------- */
  function ensureSheet() {
    if (sheet) return sheet;
    sheet = document.createElement('div'); sheet.className = 'aqm-sheet lps-sheet'; sheet.hidden = true;
    sheet.innerHTML = '<div class="aqm-sheet-scrim" data-lps-close></div>' +
      '<div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="lps-title">' +
      '<span class="aqm-sheet-grip" aria-hidden="true"></span>' +
      '<button type="button" class="aqm-sheet-x" data-lps-close aria-label="إغلاق"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="aqm-sheet-head"><span class="aqm-sheet-ic"></span><div><h3 id="lps-title"></h3><p class="aqm-sheet-sub"></p></div></div>' +
      '<div class="aqm-sheet-body lps-body"></div>' +
      '<div class="aqm-sheet-foot"><button type="button" class="aqm-foot-next" data-lps-next hidden><span class="aqm-foot-l"><small>القسم التالي</small><b></b></span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button><button type="button" class="aqm-foot-close" data-lps-close>إغلاق</button></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-lps-close]')) { closeSheet(); return; }
      if (e.target.closest('[data-lps-next]')) { goNext(); return; }
      var r = e.target.closest('[data-lps-row]');
      if (r) { showStage(Number(r.getAttribute('data-lps-row')), r.getAttribute('data-lps-from')); return; }
      if (e.target.closest('[data-lps-list]')) { openTile(sheet.getAttribute('data-kind')); return; }
      var o = e.target.closest('[data-lps-open]');
      if (o) { var i = o.getAttribute('data-lps-open'); closeSheet(); var b = $('#lpj-stage [data-lpj-open="' + i + '"]', res); if (b) b.click(); return; }
      if (e.target.closest('[data-lps-name]')) { closeSheet(); var ed = $('#btn-edit-lp', res); if (ed) ed.click(); setTimeout(function () { var n = document.getElementById('lp-name'); if (n) n.focus(); }, 250); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet && !sheet.hidden) closeSheet(); });
    return sheet;
  }
  function openSheet(kind, ico, title, sub, html) {
    var s = ensureSheet();
    s.setAttribute('data-kind', kind);
    $('.aqm-sheet-ic', s).innerHTML = ico;
    $('#lps-title', s).textContent = title;
    $('.aqm-sheet-sub', s).textContent = sub || '';
    var b = $('.lps-body', s); b.innerHTML = html; b.scrollTop = 0;
    s.classList.remove('is-closing'); s.hidden = false; root.classList.add('aqm-sheet-open');
    syncNext(kind);
  }
  /* زر «القسم التالي»: يتبع ترتيب الصفوف في القائمة نفسها */
  var gOrder = [], gItems = {}, gTitles = {};
  function keyOf(kind) { return /^(stages|peaks|chal|name)$/.test(kind) ? 't:' + kind : kind; }
  function syncNext(kind) {
    var b = $('[data-lps-next]', sheet), i = gOrder.indexOf(keyOf(kind)), nk = i > -1 ? gOrder[i + 1] : null;
    if (!b) return;
    if (nk) { $('b', b).textContent = gTitles[nk] || ''; b.hidden = false; } else b.hidden = true;
  }
  function goNext() {
    var i = gOrder.indexOf(keyOf(sheet.getAttribute('data-kind'))), nk = i > -1 ? gOrder[i + 1] : null;
    if (!nk || !gItems[nk]) return;
    sheet.classList.add('is-swap'); setTimeout(function () { gItems[nk](); sheet.classList.remove('is-swap'); }, 160);
  }
  function closeSheet() { if (!sheet || sheet.hidden) return; sheet.classList.add('is-closing'); var sh = sheet; setTimeout(function () { sh.hidden = true; sh.classList.remove('is-closing'); root.classList.remove('aqm-sheet-open'); }, 230); }

  /* ---------- بيانات المراحل من DOM المحرك ---------- */
  function rowsOf(card) { return $$('.lpj-row', card).map(function (b) { return { i: Number(b.getAttribute('data-i')), st: b.getAttribute('data-status'), v: ($('.v', b) || {}).textContent, lbl: ($('.tx > b', b) || {}).textContent, per: ($('.tx > span', b) || {}).textContent, el: b }; }); }
  function pcCards() { var pc = $('#lpj-pc', res); return pc ? { p: $('.lpj-card:not(.ch)', pc), c: $('.lpj-card.ch', pc) } : null; }
  function stageTitles(P) {
    /* يقرأ عنوان كل مرحلة من بطاقة المرحلة التي يرسمها العرض الحالي ثم يعيد التحديد */
    var out = [], cur = P.filter(function (r) { return r.st === 'current'; })[0] || P[0];
    P.forEach(function (r) { r.el.click(); var h = $('#lpj-stage h3', res); out[r.i] = h ? h.textContent.replace(/^\s*المرحلة\s*\d+\s*[—–-]\s*/, '').trim() : ''; });
    if (cur) cur.el.click();
    return out;
  }

  function listHTML(kind) {
    var cards = pcCards(); if (!cards || !cards.p) return '<p class="lps-empty">تعذر تجهيز هذه القراءة حاليًا.</p>';
    var P = rowsOf(cards.p), C = cards.c ? rowsOf(cards.c) : [], h = '';
    if (kind === 'stages') {
      var T = stageTitles(P);
      h = '<ol class="lps-list">' + P.map(function (r) {
        return '<li><button type="button" class="lps-row" data-st="' + r.st + '" data-lps-row="' + r.i + '" data-lps-from="stages"><span class="lps-n">' + (r.i + 1) + '</span><span class="lps-tx"><b>' + esc(T[r.i] || r.lbl) + '</b><small>' + esc(r.per) + '</small></span><em class="lps-tag">' + STT[r.st] + '</em><span class="lps-go">' + IC.chev + '</span></button></li>';
      }).join('') + '</ol>';
    } else {
      var arr = kind === 'peaks' ? P : C;
      h = '<ol class="lps-list lps-vals">' + arr.map(function (r) {
        return '<li><button type="button" class="lps-row" data-st="' + r.st + '" data-lps-row="' + r.i + '" data-lps-from="' + kind + '"><span class="lps-v">' + esc(r.v) + '</span><span class="lps-tx"><b>' + esc(r.lbl) + '</b><small>' + esc(r.per) + '</small></span><em class="lps-tag">' + STT[r.st] + '</em><span class="lps-go">' + IC.chev + '</span></button></li>';
      }).join('') + '</ol>';
    }
    return h;
  }
  function showStage(i, from) {
    var cards = pcCards(); if (!cards || !cards.p) return;
    var r = rowsOf(cards.p).filter(function (x) { return x.i === i; })[0]; if (r) r.el.click();
    var st = $('#lpj-stage', res); if (!st) return;
    var c = st.cloneNode(true); c.removeAttribute('id');
    $$('[data-lpj-open]', c).forEach(function (b) { var n = b.getAttribute('data-lpj-open'); b.removeAttribute('data-lpj-open'); b.setAttribute('data-lps-open', n); });
    var body = $('.lps-body', ensureSheet());
    body.innerHTML = '<button type="button" class="lps-back" data-lps-list>' + IC.back + '<span>الرجوع إلى القائمة</span></button><div class="lps-detail">' + c.innerHTML + '</div>';
    body.scrollTop = 0;
  }
  function nameHTML() {
    var n = $('.aqeq-name-readings', res);
    if (!n || n.classList.contains('is-empty')) {
      return '<div class="lps-noname"><p>أضف اسمك ليظهر لك هنا ما تكشفه أرقام اسمك عن رغبة روحك وصورتك أمام الناس ومسارك الداخلي.</p><button type="button" class="lps-cta" data-lps-name>أضف اسمك الآن</button></div>';
    }
    var c = n.cloneNode(true);
    var hd = $('.aqeq-name-heading', c); if (hd) { var k = $('.aqeq-name-kicker', hd), p = $('p', hd); if (k) k.remove(); if (p) p.remove(); }
    $$('.aqeq-name-group', c).forEach(function (g, gi) {
      var h = $('header', g), t = $('h4', h), sb = $('p', h), nn = $('.aqeq-name-number', h);
      if (!h || !t) return;
      var tt = t.textContent, key = /الروح|الرغبة/.test(tt) ? 'heart' : /الشخص|الصورة|المظهر|القناع/.test(tt) ? 'mask' : 'route';
      h.innerHTML = '<span class="lpc-ic lpn-gi c' + (gi % 4 + 1) + '">' + IC[key] + '</span><div class="lpn-gt"><h4>' + esc(tt) + '</h4><p>' + esc(sb ? sb.textContent : '') + '</p></div><span class="lpn-num"><small>الرقم</small><b>' + esc(nn ? nn.textContent : '') + '</b></span>';
      $$('.aqeq-reading-card', g).forEach(function (card, ci) {
        var hh = $('h5', card), body = $('.aqeq-reading-content', card);
        var d = document.createElement('details'); d.className = 'lpn-card'; d.open = true;
        d.innerHTML = '<summary><span class="lpn-idx">' + (ci + 1) + '</span><b>' + esc(hh ? hh.textContent : '') + '</b><span class="lpn-chev">' + IC.chev + '</span></summary><div class="lpn-b"></div>';
        if (body) $('.lpn-b', d).appendChild(body);
        card.replaceWith(d);
      });
    });
    return '<div class="lps-name">' + c.innerHTML + '</div>';
  }
  function stagesHTML() {
    var cards = pcCards(); if (!cards || !cards.p) return '<p class="lps-empty">تعذر تجهيز هذه القراءة حاليًا.</p>';
    var P = rowsOf(cards.p), cur = P.filter(function (r) { return r.st === 'current'; })[0] || P[0], h = '';
    P.forEach(function (r) {
      r.el.click();
      var st = $('#lpj-stage', res), ttl = st && $('h3', st), chips = st ? $$('.lpj-chip', st).map(function (c) { return c.textContent.trim(); }) : [], ana = '';
      var ob = st && $('[data-lpj-open]', st);
      if (ob) { ob.click(); var ov = document.querySelector('.lpj-ov'); if (ov) { var pn = $('.lpj-panel', ov); if (pn) { var cl = pn.cloneNode(true); $$('[data-lpj-close],.lpj-x', cl).forEach(function (n) { n.remove(); }); var h3 = $('h3', cl); if (h3) { var pp = h3.nextElementSibling; if (pp && pp.tagName === 'P') pp.remove(); h3.remove(); } ana = cl.innerHTML; } var xb = $('[data-lpj-close]', ov); if (xb) xb.click(); else ov.remove(); } }
      var name = ttl ? ttl.textContent.replace(/^\s*المرحلة\s*\d+\s*[—–-]\s*/, '').trim() : r.lbl;
      h += '<details class="lps-stage" data-st="' + r.st + '"' + (r === cur ? ' open' : '') + '><summary><span class="lps-n">' + (r.i + 1) + '</span><span class="lps-tx"><b>' + esc(name) + '</b><small>' + esc(chips.join(' · ')) + (r.st === 'current' ? ' · أنت هنا' : '') + '</small></span><span class="lpn-chev">' + IC.chev + '</span></summary><div class="lps-sbody lpj">' + (ana || '<p class="lps-empty">لا يوجد تحليل لهذه المرحلة.</p>') + '</div></details>';
    });
    if (cur) cur.el.click();
    return '<div class="lps-stages">' + h + '</div>';
  }
  function openTile(kind) {
    if (kind === 'name') { openSheet('name', IC.name, 'بصمة الاسم', 'ثلاث زوايا من أرقام اسمك', nameHTML()); return; }
    openSheet('stages', IC.stages, 'مراحل العمر الأربع', 'القمة والتحدي داخل كل مرحلة', stagesHTML());
  }

  /* ---------- البلاطات ---------- */
  function buildTiles() {
    var d = document.createElement('section'); d.className = 'lpt-tiles'; d.setAttribute('aria-label', 'تفاصيل رحلتك');
    var T = [['stages', 'مراحل العمر', 'اكتشف مراحلك', IC.stages], ['peaks', 'القمم', 'اصعد قممك', IC.peaks], ['chal', 'التحديات', 'واجه دروسك', IC.chal], ['name', 'بصمة الاسم', 'اقرأ اسمك', IC.name]];
    d.innerHTML = '<h3 class="lpt-h">رحلتك بين يديك</h3><p class="lpt-sub">اضغط على أي دائرة لتفتح تفاصيلها</p><div class="lpt-row">' +
      T.map(function (t, k) { return '<button type="button" class="lpt-tile" data-lpt="' + t[0] + '"><span class="lpt-c c' + (k + 1) + '">' + t[3] + '</span><span class="lpt-t">' + t[1] + '</span><span class="lpt-s">' + t[2] + '</span></button>'; }).join('') + '</div>';
    d.addEventListener('click', function (e) { var b = e.target.closest('[data-lpt]'); if (b) openTile(b.getAttribute('data-lpt')); });
    return d;
  }

  /* ---------- توحيد الأكورديونات ---------- */
  function fixAccordions() {
    $$('.lpa-ic', res).forEach(function (ic) {
      if (ic.getAttribute('data-lpf')) return;
      var tx = ic.textContent.trim(), card = ic.closest('details');
      if (tx === '+' || (card && card.classList.contains('is-light'))) ic.innerHTML = IC.light;
      else if (tx === '−' || tx === '-' || (card && card.classList.contains('is-shadow'))) ic.innerHTML = IC.shadow;
      else if (!ic.querySelector('svg')) ic.innerHTML = IC.star;
      ic.setAttribute('data-lpf', '1');
    });
    $$('.lp-sec-title b', res).forEach(function (b) {
      if (b.querySelector('.lps-en')) return;
      for (var n = b.firstChild; n; n = n.nextSibling) {
        if (n.nodeType === 3) {
          var m = n.nodeValue.match(/^([\s\S]*?)\s*\(([A-Za-z][^)]*)\)\s*$/);
          if (m) { var en = document.createElement('span'); en.className = 'lps-en'; en.textContent = m[2]; n.nodeValue = m[1]; b.insertBefore(en, n.nextSibling); break; }
        }
      }
    });
  }


  /* ---------- قائمة الصفوف الذهبية الموحّدة ---------- */
  var SKIP_BP = /الجوهر والرسالة|فخ الظل/;
  function gTitle(d) { var t = $('.lpc-tx b', $('summary', d)) || $('b', $('summary', d)); var sm = $('summary', d); var tx = t ? t.textContent : (sm ? sm.textContent : ''); return tx.replace(/\s+/g, ' ').replace(/\s*متاح (مجاناً|مجانًا|بالكامل|للأعضاء).*$/, '').replace(/^[+−-]\s*/, '').trim(); }
  function gSub(d) { var a = $$('.lpc-tx small', d).map(function (x) { return x.textContent.replace(/\s+/g, ' ').trim(); }).filter(function (x) { return x && !/^متاح/.test(x); }); return a[0] || ''; }
  var HOOK = [
    [/مراحل العمر/, 'السنين اللي فاتت مش صدفة.. دي مراحل ليها سبب'],
    [/^القمم/, 'الأوقات اللي بتلمع فيها حياتك بتتحدد من هنا'],
    [/^التحديات/, 'الدروس اللي بتتكرر معاك لحد ما تفهمها'],
    [/بصمة الاسم/, 'اسمك بيقول عنك أكتر مما تتخيل'],
    [/شفرة الروح/, 'اللي جواك قبل ما الدنيا تشكلك'],
    [/المراية المزدوجة/, 'اللي بتحبه وبتكرهه في الناس.. هو أنت'],
    [/البلوكات/, 'ليه بتقف عند نفس النقطة كل مرة'],
    [/الشفرة العاطفية/, 'ليه بتحب بالطريقة دي وبتتوجع بنفس الشكل'],
    [/مغناطيس المال/, 'الباب اللي الرزق بيجيلك منه'],
    [/روشتة/, 'خطوات صغيرة تفرق من أول أسبوع'],
    [/جرح الطفولة/, 'الحاجة اللي لسه شايلها من زمان وفاكر إنك نسيتها'],
    [/طاقة النور/, 'قوتك اللي الناس شايفاها فيك وأنت لسه مش واخد بالك'],
    [/البصمة الجسدية/, 'الطاقة اللي جسمك بيشيلها من غير ما تحس'],
    [/جدول المقارنة/, 'أنت في أحسن حالاتك وأنت في أصعبها.. جنب بعض'],
    [/خريطة التحول/, 'من التحدي للحل.. خطوة خطوة'],
    [/سؤال للتأمل/, 'سؤال هيفضل معاك بعد ما تقفل الصفحة']
  ];
  function hookOf(t, fb) { for (var i = 0; i < HOOK.length; i++) if (HOOK[i][0].test(t)) return HOOK[i][1]; return fb || ''; }
  function gRow(k, ico, title, sub, grp, tone) {
    sub = hookOf(title, sub);
    return '<button type="button" class="lpg-row' + (tone ? ' b3-ai-' + tone : '') + '" data-lpg="' + k + '" style="--i:' + grp + '"><span class="lpg-ic">' + ico + '</span><span class="lpg-tx"><b>' + esc(title) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + (tone ? '<i class="lpg-chip lpg-chip-' + tone + '">' + (tone === 'g' ? 'نقطة قوة' : 'منطقة ظل') + '</i>' : '') + '</span><span class="lpg-go">' + IC.chev + '</span></button>';
  }
  function buildGold() {
    var items = [], html = '', n = 0;
    gOrder = []; gItems = items; gTitles = {};
    function push(k, ico, t, sub, fn, tone) { items[k] = fn; gOrder.push(k); gTitles[k] = t; html += gRow(k, ico, t, sub, n++, tone); }
    var dets = $$('.panel .lp-sections > details', res).concat($$('.aq-lp-blueprint-summary details', res).filter(function (x) { return !SKIP_BP.test(x.textContent.slice(0, 80)); }));
    var made = dets.map(function (x, i) {
      var t = gTitle(x), sub = gSub(x), k = 'd:' + i, ic = icFor(t, x.classList.contains('is-shadow') ? IC.shadow : x.classList.contains('is-light') ? IC.light : IC.star);
      if (t.length > 70) { t = t.slice(0, 70); }
      var tone = x.classList.contains('is-shadow') ? 's' : x.classList.contains('is-light') ? 'g' : '';
      return { t: t, k: k, ic: ic, sub: sub, tone: tone, fn: function () {
        var bd = $('.lp-sec-body, .lpa-body', x); if (!bd) return;
        openSheet(k, ic, t, sub, '<div class="lps-detail lps-read">' + bd.innerHTML + '</div>');
      } };
    });
    function pushMade(m) { push(m.k, m.ic, m.t, m.sub, m.fn, m.tone); }
    var used = {};
    function take(re) { var out = []; made.forEach(function (m, i) { if (!used[i] && re.test(m.t)) { used[i] = 1; out.push(m); } }); return out; }
    var g1 = take(/شفرة الروح/), g1b = take(/طاقة النور/);
    var g2 = take(/المراية|البلوكات|الشفرة العاطفية|مغناطيس|البصمة الجسدية|جدول المقارنة|جرح الطفولة/);
    var g3 = take(/روشتة|خريطة التحول/);
    var rest = made.filter(function (m, i) { return !used[i]; });
    html += '<p class="lpg-hint"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v4h1"/></svg><span>اضغط على أي قسم لعرض تفسيره</span></p>';
    html += '<h4 class="lpg-h">أساس شخصيتك<small>من أنت؟</small></h4>';
    g1.forEach(pushMade);
    push('t:name', IC.name, 'بصمة الاسم', 'اقرأ اسمك', function () { openTile('name'); });
    g1b.forEach(pushMade);
    html += '<h4 class="lpg-h">الظل والعلاقات والمال<small>كيف تعيش؟</small></h4>';
    g2.concat(rest).forEach(pushMade);
    html += '<h4 class="lpg-h">رحلتك عبر السنين<small>التوقيت الزمني</small></h4>';
    push('t:stages', IC.stages, 'مراحل العمر الأربع', 'القمة والتحدي لكل مرحلة جواها', function () { openTile('stages'); });
    g3.forEach(pushMade);
    var q = $('.lpj-bottom .lpj-reflect', res);
    if (q) push('q', IC.ask, 'سؤال للتأمل', 'سؤال يناسب مرحلتك الحالية', function () { openSheet('q', IC.ask, 'سؤال للتأمل', '', '<div class="lps-daily">' + q.innerHTML + '</div>'); });
    var box = document.createElement('section'); box.className = 'lpg'; box.setAttribute('aria-label', 'قراءة مسارك');
    box.innerHTML = html;
    var _n = 0, _l = null; Array.prototype.forEach.call(box.children, function (c) { if (c.classList.contains('lpg-h')) { if (_n % 2 && _l) _l.classList.add('lpg-wide'); _n = 0; _l = null; } else { _n++; _l = c; } }); if (_n % 2 && _l) _l.classList.add('lpg-wide');
    box.addEventListener('click', function (e) { var b = e.target.closest('[data-lpg]'); if (b && items[b.getAttribute('data-lpg')]) items[b.getAttribute('data-lpg')](); });
    return box;
  }

  /* ---------- رأس النتيجة بنفس مظهر خرائط الشريكين والطفل ---------- */
  var HIC = {
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    save: '<path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z"/>',
    add: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'
  };
  function hIc(k) { return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + HIC[k] + '</svg>'; }
  function setField(id, v) { var e = document.getElementById(id); if (!e) return; e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); }
  function headFix() {
    var c = $('.chart-summary-card', res); if (!c || c.classList.contains('lpr-head')) return;
    var ed = $('#btn-edit-lp', c), badge = ($('.chart-summary-badge', c) || {}).textContent || '', title = ($('.chart-summary-title', c) || {}).textContent || '';
    var meta = $$('.chart-summary-meta > span:not(.meta-sep)', c).map(function (m) { return m.textContent.replace(/[☉✧]/g, '').replace(/\s+/g, ' ').trim(); }).filter(Boolean);
    c.innerHTML = '<span class="lph-k">' + esc(badge.replace(/\s+/g, ' ').trim()) + '</span><h3 class="lph-t">' + esc(title.trim()) + '</h3>' +
      '<div class="lph-m">' + meta.map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('') + '</div>' +
      '<div class="lph-tools"><button type="button" data-lph="edit" aria-label="تعديل البيانات">' + hIc('edit') + '<span>تعديل</span></button>' +
      '<button type="button" data-lph="save" aria-label="حفظ الخريطة">' + hIc('save') + '<span>حفظ</span></button>' +
      '<button type="button" data-lph="new" aria-label="مسار جديد">' + hIc('add') + '<span>مسار جديد</span></button></div>';
    if (ed) { ed.hidden = true; ed.style.display = 'none'; c.appendChild(ed); }
    c.classList.add('lpr-head');
    c.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lph]'); if (!b) return;
      var a = b.getAttribute('data-lph'), eb = $('#btn-edit-lp', c);
      if (a === 'edit' && eb) eb.click();
      else if (a === 'new' && eb) { eb.click(); setTimeout(function () { setField('lp-name', ''); setField('lp-date', ''); }, 60); }
      else if (a === 'save') { var sb = $('.aq-save-reading-btn', res); if (sb) { sb.click(); b.classList.add('is-saved'); $('span', b).textContent = 'تم الحفظ'; } }
    });
  }

  /* ---------- التشغيل ---------- */
  function run() {
    var has = !res.hidden && res.querySelector('.numbadge') && res.querySelector('.lp-sections');
    root.classList.toggle('lpr-on', !!has);
    if (!has) { lastKey = ''; return; }
    var num = $('.numbadge', res), key = (num ? num.textContent : '') + '|' + (($('#lp-date') || {}).value || '') + '|' + (($('#lp-name') || {}).value || '');
    if (!res.querySelector('.lpt-tiles')) {
      var sm = $('.chart-summary-card', res);
      var t = buildTiles();
      if (sm && sm.nextSibling) res.insertBefore(t, sm.nextSibling); else res.insertBefore(t, res.firstChild);
    }
    var sig = $$('.panel .lp-sections > details, .aq-lp-blueprint-summary details', res).length + '|' + (res.querySelector('.lpj-reflect') ? 1 : 0) + '|' + (res.querySelector('.daily') ? 1 : 0), cg = res.querySelector('.lpg');
    if (cg && cg.getAttribute('data-sig') !== sig) { cg.remove(); cg = null; }
    if (!cg && res.querySelector('.panel .lp-sections > details')) {
      var sm2 = $('.chart-summary-card', res), g = buildGold(); g.setAttribute('data-k', key); g.setAttribute('data-sig', sig);
      if (sm2 && sm2.nextSibling) res.insertBefore(g, sm2.nextSibling); else res.insertBefore(g, res.firstChild);
    }
    fixAccordions(); headFix();
    if (key !== lastKey) { lastKey = key; sec.scrollTop = 0; closeSheet(); var og = res.querySelector('.lpg'); if (og && og.getAttribute('data-k') !== key) { og.remove(); run(); } }
  }
  var q;
  new MutationObserver(function () { clearTimeout(q); q = setTimeout(run, 60); }).observe(res, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  run();
})();
