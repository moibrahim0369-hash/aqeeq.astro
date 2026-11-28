/* Karmic tail page: the report as colored rows that open an animated popup (same look as the 2027 report).
   - Free teaser = the opening words of each section of the real report (assets/data/karmic-previews.json, public excerpts only).
   - Locked: blurred rest + buy button. Pending: "under review" with a status check. After approval the full text opens
     (read from the karmic-api function, which checks the purchase for this exact birth date on the server).
   The edit/save banner and the three numbers are not touched. */
(function () {
  'use strict';
  var sec = document.getElementById('karmic'), out = document.getElementById('kt-result');
  if (!sec || !out) return;

  var API = 'https://trcveoewbxqzhhvzawxy.supabase.co/functions/v1/karmic-api';
  var KEY = 'sb_publishable_48pQKHVWg0AXYDRlcNH-HQ_iRyfDMdC';
  var VISIBLE = 8; /* rows shown before "show all sections" */

  var LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  var HOURGLASS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4h10M7 20h10M8 4c0 5 4 5 4 8s-4 3-4 8M16 4c0 5-4 5-4 8s4 3 4 8"/></svg>';
  var BADGE = '<span class="y27-st" aria-hidden="true">' + LOCK + '<em>مجاني</em></span>';
  var IC = {
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    coin: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v10M9 9.5c0-1.2 1.3-2 3-2s3 .8 3 2-1.3 1.8-3 2.5-3 1.1-3 2.5 1.3 2 3 2 3-.8 3-2"/>',
    warn: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17.2v.1"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    moon: '<path d="M19.5 13.5A7.5 7.5 0 1 1 10.5 4.5a6 6 0 0 0 9 9z"/>',
    ask: '<circle cx="12" cy="12" r="8.5"/><path d="M9.7 9.6a2.4 2.4 0 1 1 3.4 2.2c-.7.4-1.1.8-1.1 1.7M12 16.6v.1"/>'
  };
  function svg(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[k] || IC.clock) + '</svg>'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rich(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
  function el(id) { return document.getElementById(id); }

  /* look of a row from the section title */
  function look(title, i) {
    if (/العلاقات|الأهل|الأصدقاء/.test(title)) return { ic: 'link', tone: 'n' };
    if (/المال|العمل/.test(title)) return { ic: 'coin', tone: 'n' };
    if (/القرارات|تتجنب/.test(title)) return { ic: 'warn', tone: 's' };
    if (/أسئلة/.test(title)) return { ic: 'ask', tone: 'n' };
    if (/الميثاق|استثمر|خطة|مقياس/.test(title)) return { ic: 'check', tone: 'g' };
    if (/أصداء|البيت|الذاكرة/.test(title)) return { ic: 'moon', tone: 'n' };
    return { ic: 'clock', tone: ['g', 'n', 's'][i % 3] };
  }

  /* ---------- data ---------- */
  var DATA = null, dataP = null;
  function loadData() {
    if (dataP) return dataP;
    dataP = fetch('assets/data/karmic-previews.json?v=1', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { DATA = j; return j; }).catch(function () { return null; });
    return dataP;
  }
  function ctx() {
    var nums = [].map.call(out.querySelectorAll('.b3-kt-n b'), function (b) { return (b.textContent || '').trim(); });
    var d = el('kt-date');
    return { triad: nums.join('-'), date: d ? (d.value || '').trim() : '' };
  }

  /* ---------- state ---------- */
  var S = { mode: 'locked', code: null, rows: [], report: null, date: '', pollT: null, building: false };
  function stopPoll() { if (S.pollT) { clearInterval(S.pollT); S.pollT = null; } }

  function lockPanel() {
    if (S.mode === 'pending') {
      return '<div class="y27-lock y27-lock-pending" data-y27-lock><div class="y27-lock-card"><span class="y27-lock-ic">' + HOURGLASS + '</span><b>طلبك قيد المراجعة</b><p>وصلنا رقم العملية ونراجع التحويل. أول ما يتأكد يتفتح تقريرك هنا، من غير ما تعمل شيئًا.</p>' +
        '<button type="button" class="y27-btn y27-lock-btn" data-kt-check>تحقق من الحالة</button><span class="y27-lock-note" data-kt-check-note>نتحقق تلقائيًا كل دقيقة تقريبًا</span></div></div>';
    }
    var warn = S.mode === 'rejected' ? '<p class="y27-lock-warn">لم نتمكن من تأكيد التحويل السابق. يمكنك المحاولة مرة أخرى، أو <a href="https://wa.me/message/BWFSU4ZT25WKA1" target="_blank" rel="noopener noreferrer">تواصل معنا على واتساب</a>.</p>' : '';
    return '<div class="y27-lock" data-y27-lock><div class="y27-veil" aria-hidden="true"><i style="--w:97%"></i><i style="--w:91%"></i><i style="--w:95%"></i><i style="--w:64%"></i><i style="--w:93%"></i><i style="--w:72%"></i></div>' +
      '<div class="y27-lock-card">' + warn + '<span class="y27-lock-ic">' + LOCK + '</span><b>باقي هذا القسم داخل تقريرك الكامل</b><p>يُفتح هنا، ويمكنك حفظه PDF</p>' +
      '<button type="button" class="y27-btn y27-buy y27-lock-btn" data-kt-buy>افتح تقريري الكامل</button><span class="y27-lock-note">دفعة واحدة، بلا تجديد تلقائي</span></div></div>';
  }
  function blocksHtml(blocks) {
    return (blocks || []).map(function (b) {
      if (b.t === 'ul') return '<ul>' + b.items.map(function (x) { return '<li>' + rich(x) + '</li>'; }).join('') + '</ul>';
      if (b.t === 'h') return '<h5>' + esc(b.text) + '</h5>';
      return '<p>' + rich(b.text) + '</p>';
    }).join('');
  }

  /* ---------- rows ---------- */
  function rowsFor(code) {
    var r = DATA.reports[code], rows = [];
    rows.push({ title: 'افتتاحية تقريرك', hook: hookOf(r.opening), free: true, ic: 'moon', tone: 'n', text: r.opening });
    r.sections.forEach(function (s, i) { var l = look(s.title, i); rows.push({ title: s.title, hook: s.hook, excerpt: s.excerpt, ic: l.ic, tone: l.tone, idx: i }); });
    return rows;
  }
  function hookOf(t) { var w = String(t || '').replace(/\s+/g, ' ').split(' '); return w.slice(0, 7).join(' ') + (w.length > 7 ? '…' : ''); }

  function render() {
    var old = out.querySelector('.kt-rows27'); if (old) old.remove();
    var lock = out.querySelector('.kt-lock'); if (!lock) return;
    var box = document.createElement('div'); box.className = 'kt-rows27';
    var open = S.mode === 'open';
    var html = '<p class="y27-hint"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>' + (open ? 'اضغط أي قسم لتقرأه' : 'اضغط أي قسم لتقرأ معاينته') + '</p>';
    S.rows.forEach(function (r, i) {
      var st = r.free ? 'free' : (open ? 'open' : 'locked'), extra = i >= VISIBLE;
      html += '<details class="y27-acc y27-t-' + r.tone + (extra ? ' kt-extra' : '') + '" data-lock="' + st + '" data-i="' + i + '"' + (extra ? ' hidden' : '') + '><summary aria-haspopup="dialog"><span class="y27-ic">' + svg(r.ic) + '</span><span class="y27-t">' + esc(r.title) + '<small class="y27-hook">' + esc(r.hook) + '</small></span>' + BADGE + '<span class="y27-ch" aria-hidden="true"></span></summary></details>';
    });
    if (S.rows.length > VISIBLE) html += '<button type="button" class="kt-more" data-kt-more aria-expanded="false">عرض كل الأقسام (' + S.rows.length + ')</button>';
    if (open) html += '<div class="kt-buybar"><button type="button" class="y27-btn y27-lock-btn" data-kt-pdf>حفظ تقريري PDF</button><small>اختر «حفظ كملف PDF» من نافذة الطباعة</small></div>';
    else html += '<div class="kt-buybar">' + (S.mode === 'pending' ? '<button type="button" class="y27-btn y27-lock-btn" data-kt-check>تحقق من حالة طلبك</button><small>طلبك قيد المراجعة</small>' : '<button type="button" class="y27-btn y27-lock-btn" data-kt-buy>افتح التقرير الكامل</button><small>يُفتح هنا ويمكنك حفظه PDF</small>') + '</div>';
    box.innerHTML = html;
    lock.parentNode.insertBefore(box, lock.nextSibling);
    out.setAttribute('data-kt27', '1');
    wire(box);
  }
  function wire(box) {
    [].forEach.call(box.querySelectorAll('details'), function (d) {
      d.querySelector('summary').addEventListener('click', function (e) { e.preventDefault(); openSheet(+d.getAttribute('data-i')); });
    });
    var more = box.querySelector('[data-kt-more]');
    if (more) more.addEventListener('click', function () {
      var shown = more.getAttribute('aria-expanded') === 'true';
      [].forEach.call(box.querySelectorAll('.kt-extra'), function (x) { x.hidden = shown; });
      more.setAttribute('aria-expanded', String(!shown));
      more.textContent = shown ? 'عرض كل الأقسام (' + S.rows.length + ')' : 'إخفاء الأقسام الإضافية';
    });
    [].forEach.call(box.querySelectorAll('[data-kt-buy]'), function (b) { b.addEventListener('click', buy); });
    [].forEach.call(box.querySelectorAll('[data-kt-check]'), function (b) { b.addEventListener('click', function () { manualCheck(b); }); });
    var pdf = box.querySelector('[data-kt-pdf]'); if (pdf) pdf.addEventListener('click', printReport);
  }
  function renderUnavailable(c) {
    var old = out.querySelector('.kt-rows27'); if (old) old.remove();
    var lock = out.querySelector('.kt-lock'); if (!lock) return;
    var box = document.createElement('div'); box.className = 'kt-rows27';
    box.innerHTML = '<div class="kt-note27"><span class="y27-lock-ic">' + HOURGLASS + '</span><b>تقرير شفرتك قيد الإعداد</b><p>شفرتك ' + esc(c.triad) + ' لم يُنشر تقريرها الكامل بعد، ولذلك لا نعرض زر الشراء الآن. نكتبه بنفس عناية بقية التقارير.</p></div>';
    lock.parentNode.insertBefore(box, lock.nextSibling);
    out.setAttribute('data-kt27', '1');
  }

  /* ---------- popup ---------- */
  var sheet = null, current = -1, lastFocus = null;
  function ensure() {
    if (sheet) return sheet;
    sheet = document.createElement('div');
    sheet.className = 'aqm-sheet swp-sheet y27-modal kt-modal';
    sheet.hidden = true;
    sheet.innerHTML = '<div class="aqm-sheet-scrim" data-kt-close></div><div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="kt-modal-title" tabindex="-1"><span class="aqm-sheet-grip"></span>' +
      '<button type="button" class="aqm-sheet-x" data-kt-close aria-label="إغلاق"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="aqm-sheet-body y27-modal-body"><header class="y27-modal-head"><span class="y27-modal-icon" aria-hidden="true"></span><div><small>الذيل الكارمي</small><h3 id="kt-modal-title"></h3><p></p></div></header><div class="y27-section-data" hidden></div><div class="y27-modal-content"></div></div>' +
      '<div class="aqm-sheet-foot"><button type="button" class="aqm-foot-next" data-kt-next><span class="aqm-foot-l"><small>القسم التالي</small><b></b></span><span aria-hidden="true">←</span></button><button type="button" class="aqm-foot-close" data-kt-close>إغلاق</button></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-kt-buy]')) { close(true); buy(); return; }
      var chk = e.target.closest('[data-kt-check]'); if (chk) { manualCheck(chk); return; }
      if (e.target.closest('[data-kt-close]')) { close(); return; }
      if (e.target.closest('[data-kt-next]')) { openSheet((current + 1) % S.rows.length); }
    });
    sheet.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Tab') {
        var f = [].filter.call(sheet.querySelectorAll('button,a,[tabindex]'), function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    return sheet;
  }
  function sheetBody(r) {
    if (r.free) return '<div class="y27-hookbox y27-pv"><span class="y27-pv-tag">مجاني</span><div class="y27-prose"><p>' + esc(r.text) + '</p></div></div>';
    if (S.mode === 'open' && S.report) {
      var s = S.report.sections.filter(function (x) { return x.title === r.title; })[0] || S.report.sections[r.idx];
      return '<div class="y27-pv"><div class="y27-prose kt-full">' + blocksHtml(s && s.blocks) + '</div></div>';
    }
    return '<div class="y27-hookbox y27-pv y27-teaser"><span class="y27-pv-tag">معاينة مجانية</span><div class="y27-prose"><p>' + esc(r.excerpt) + '</p></div></div>' + lockPanel();
  }
  function openSheet(i) {
    var r = S.rows[i]; if (!r) return;
    ensure();
    var row = out.querySelector('.kt-rows27 details[data-i="' + i + '"]');
    lastFocus = row ? row.querySelector('summary') : null;
    current = i;
    ['g', 's', 'n'].forEach(function (k) { sheet.classList.toggle('y27-t-' + k, r.tone === k); });
    sheet.dataset.lock = r.free ? 'free' : (S.mode === 'open' ? 'open' : 'locked');
    sheet.querySelector('.y27-modal-icon').innerHTML = svg(r.ic);
    sheet.querySelector('#kt-modal-title').textContent = r.title;
    sheet.querySelector('.y27-modal-content').innerHTML = sheetBody(r);
    sheet.querySelector('[data-kt-next] b').textContent = S.rows[(i + 1) % S.rows.length].title;
    sheet.classList.remove('is-closing');
    sheet.hidden = false;
    document.documentElement.classList.add('aqm-sheet-open');
    sheet.querySelector('.aqm-sheet-body').scrollTop = 0;
    sheet.querySelector('.aqm-sheet-panel').focus();
  }
  function close(now) {
    if (!sheet || sheet.hidden) return;
    if (sheet.classList.contains('is-closing') && now !== true) return;
    function fin() {
      sheet.classList.remove('is-closing'); sheet.hidden = true;
      document.documentElement.classList.remove('aqm-sheet-open');
      if (lastFocus && lastFocus.isConnected) { try { lastFocus.focus(); } catch (e) {} }
      current = -1;
    }
    if (now === true || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) { fin(); return; }
    sheet.classList.add('is-closing');
    setTimeout(function () { if (sheet.classList.contains('is-closing')) fin(); }, 230);
  }
  /* the original (hidden) buy link already knows how to start the karmic checkout, with the name and date */
  function buy() { var a = out.querySelector('.kt-lock .b3-acts a'); if (a) a.click(); }

  /* ---------- access: signed-in buyer -> status -> full text ---------- */
  async function fetchReport(token, date) {
    var r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: 'Bearer ' + token }, body: JSON.stringify({ mode: 'report', date: date }) });
    if (!r.ok) return null;
    var j = await r.json();
    return j && j.report ? j.report : null;
  }
  async function refreshAccess() {
    var date = S.date; if (!date || !S.code) return;
    var sb = window.aqeeqSupabase, ses = null;
    try { ses = sb && sb.auth ? (await sb.auth.getSession()).data.session : null; } catch (e) { ses = null; }
    var mode = 'locked', report = null;
    if (ses && ses.access_token) {
      var st = 'none';
      try { var q = await sb.rpc('karmic_status', { p_date: date }); if (!q.error && typeof q.data === 'string') st = q.data; } catch (e) {}
      if (st === 'pending') mode = 'pending';
      else {
        try { report = await fetchReport(ses.access_token, date); } catch (e) { report = null; }
        if (report) mode = 'open'; else if (st === 'rejected') mode = 'rejected';
      }
    }
    if (date !== S.date) return; /* another reading was calculated meanwhile */
    var changed = mode !== S.mode || (report && !S.report);
    S.report = report;
    if (changed) { S.mode = mode; render(); if (sheet && !sheet.hidden && current >= 0) openSheet(current); }
    if (mode === 'pending') startPoll(); else stopPoll();
  }
  function startPoll() {
    if (S.pollT) return; var n = 0;
    S.pollT = setInterval(function () { n++; if (S.mode !== 'pending' || n > 30) { stopPoll(); return; } if (!document.hidden && location.hash === '#karmic') refreshAccess(); }, 60000);
  }
  function manualCheck(btn) {
    btn.disabled = true; var t = btn.textContent; btn.textContent = 'جاري التحقق…';
    refreshAccess().then(function () {
      var live = document.querySelectorAll('[data-kt-check]');
      [].forEach.call(live, function (b) { b.disabled = false; b.textContent = 'تحقق من الحالة'; });
      var n = document.querySelector('.kt-modal [data-kt-check-note]'); if (n && S.mode === 'pending') n.textContent = 'لم يتأكد التحويل بعد. جرّب بعد قليل.';
    });
  }

  /* ---------- PDF: a printable page made from the report the server returned ---------- */
  function printReport() {
    if (!S.report) return;
    var r = S.report;
    var body = '<h1>' + esc(r.title) + '</h1>' + (r.tagline ? '<p class="tag">' + esc(r.tagline) + '</p>' : '') + blocksHtml(r.intro) +
      r.sections.map(function (s) { return '<section><h2>' + esc(s.title) + '</h2>' + blocksHtml(s.blocks) + '</section>'; }).join('');
    var html = '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(r.title) + '</title><style>' +
      'body{margin:0;background:#fffdf9;color:#33241d;font:13pt/2 "IBM Plex Sans Arabic",Cairo,sans-serif;padding:24px}main{max-width:720px;margin:auto}' +
      'h1{font:700 26pt/1.5 Amiri,serif;color:#650d35;margin:0 0 6px}.tag{color:#7d6a52;margin:0 0 18px}h2{font:700 19pt/1.6 Amiri,serif;color:#650d35;margin:26px 0 6px;break-after:avoid}h5{margin:14px 0 4px;color:#650d35}' +
      'p{margin:0 0 12px;orphans:3;widows:3}ul{padding-inline-start:20px;margin:0 0 12px}li{margin-bottom:6px}.bar{background:#fff;border-bottom:1px solid #e3d3b3;padding:10px 0 14px;margin-bottom:10px}' +
      '.bar button{background:#650d35;color:#fff;border:0;border-radius:10px;padding:10px 18px;font:inherit;cursor:pointer}@media print{.bar{display:none}body{padding:0}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}' +
      '</style></head><body><main><div class="bar"><button type="button" onclick="window.print()">طباعة أو حفظ PDF</button></div>' + body + '</main></body></html>';
    var u = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' })), w = window.open(u, '_blank');
    if (!w) { URL.revokeObjectURL(u); alert('اسمح بفتح نافذة التقرير لتحفظه PDF.'); return; }
    setTimeout(function () { URL.revokeObjectURL(u); }, 60000);
  }

  /* ---------- start ---------- */
  async function build() {
    if (out.hidden || !out.querySelector('.kt-lock') || out.querySelector('.kt-rows27') || S.building) return;
    S.building = true;
    try {
      var c = ctx(), data = await loadData();
      if (!data || !c.triad) return; /* keep the original locked list when the previews cannot load */
      if (out.hidden || out.querySelector('.kt-rows27')) return;
      var code = data.triads[c.triad];
      if (!code || !data.reports[code]) { stopPoll(); S.code = null; renderUnavailable(c); return; }
      stopPoll();
      S.code = code; S.date = c.date; S.mode = 'locked'; S.report = null; S.rows = rowsFor(code);
      render();
      refreshAccess();
    } finally { S.building = false; }
  }
  function start() {
    build();
    new MutationObserver(function () { if (out.hidden) { close(true); stopPoll(); return; } build(); }).observe(out, { childList: true, attributes: true, attributeFilter: ['hidden'] });
    window.addEventListener('hashchange', function () { close(true); if (location.hash === '#karmic' && S.code) refreshAccess(); });
    document.addEventListener('aq:session', function () { if (S.code) refreshAccess(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
