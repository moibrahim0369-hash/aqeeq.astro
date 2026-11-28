/* Karmic tail page: the locked list becomes colored rows that open an animated popup with a short free teaser,
   a blurred lock and the buy button (same look as the 2027 report). The edit/save banner is not touched.
   The page itself still only knows the three numbers; the full report is delivered as a PDF after payment. */
(function () {
  'use strict';
  var sec = document.getElementById('karmic'), out = document.getElementById('kt-result');
  if (!sec || !out) return;

  var LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  var BADGE = '<span class="y27-st" aria-hidden="true">' + LOCK + '<em>مجاني</em></span>';
  var IC = {
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    coin: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v10M9 9.5c0-1.2 1.3-2 3-2s3 .8 3 2-1.3 1.8-3 2.5-3 1.1-3 2.5 1.3 2 3 2 3-.8 3-2"/>',
    warn: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17.2v.1"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>'
  };
  function svg(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[k] + '</svg>'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* n = the three archetype names of this reader (root, branch, outer). Questions, never verdicts. */
  var ROWS = [
    { t: 'من أين جاء هذا الدرس', h: 'أين بدأ الخيط؟', tone: 'g', ic: 'clock',
      tease: function (n) { return 'الجذر عندك «' + n[0] + '». هنا يبدأ الخيط الذي تعود إليه كلما ظننت أنك تجاوزته…'; },
      q: 'فمن أين جاء هذا الدرس، ولماذا يعود؟' },
    { t: 'كيف يلمس علاقاتك', h: 'ماذا يحدث حين تقترب من أحد؟', tone: 'n', ic: 'link',
      tease: function (n) { return 'الفرع عندك «' + n[1] + '»، وهو الجزء الذي يظهر حين يصبح أحدهم قريبًا منك…'; },
      q: 'وكيف يتحرك هذا الخيط بينك وبين من تحب؟' },
    { t: 'كيف يلمس مالك', h: 'ما علاقة الدرس بمالك؟', tone: 'n', ic: 'coin',
      tease: function (n) { return 'لكل شخص حكاية مع المال، وحكايتك تمر من «' + n[0] + '» ثم «' + n[1] + '»…'; },
      q: 'وأين يظهر هذا فيما تكسبه وتصرفه؟' },
    { t: 'كيف يلمس قراراتك', h: 'لماذا تتردد حيث تتردد؟', tone: 's', ic: 'warn',
      tease: function (n) { return 'حين تؤجل قرارًا أو تستعجله، قد يكون «' + n[2] + '» هو من يتكلم…'; },
      q: 'وما الذي تسأله لنفسك قبل أن تقرر؟' },
    { t: 'روشتة عملية للتخفف من ثقله', h: 'كيف تخفف هذا الحمل؟', tone: 'g', ic: 'check',
      tease: function () { return 'الدرس لا يُمحى، لكنه يخفّ حين تعرف كيف تقف أمامه…'; },
      q: 'وما الخطوات الصغيرة التي تبدأ بها هذا الأسبوع؟' }
  ];

  function names() {
    return [].slice.call(out.querySelectorAll('.b3-kt-n span')).map(function (x) { return (x.textContent || '').trim(); });
  }
  function lockPanel() {
    return '<div class="y27-lock" data-y27-lock><div class="y27-veil" aria-hidden="true"><i style="--w:97%"></i><i style="--w:91%"></i><i style="--w:95%"></i><i style="--w:64%"></i><i style="--w:93%"></i><i style="--w:72%"></i></div>' +
      '<div class="y27-lock-card"><span class="y27-lock-ic">' + LOCK + '</span><b>باقي هذا القسم داخل تقريرك الكامل</b><p>تقرير PDF كامل يصلك بعد تأكيد الدفع</p>' +
      '<button type="button" class="y27-btn y27-buy y27-lock-btn" data-kt-buy>افتح تقريري الكامل</button><span class="y27-lock-note">دفعة واحدة، بلا تجديد تلقائي</span></div></div>';
  }

  /* ---------- rows ---------- */
  function build() {
    var lock = out.querySelector('.kt-lock');
    if (out.hidden || !lock || out.querySelector('.kt-rows27')) return;
    var box = document.createElement('div');
    box.className = 'kt-rows27';
    box.innerHTML = '<p class="y27-hint"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>اضغط أي قسم لتقرأ معاينته</p>' +
      ROWS.map(function (r, i) {
        return '<details class="y27-acc y27-t-' + r.tone + '" data-lock="locked" data-i="' + i + '"><summary aria-haspopup="dialog"><span class="y27-ic">' + svg(r.ic) + '</span><span class="y27-t">' + esc(r.t) + '<small class="y27-hook">' + esc(r.h) + '</small></span>' + BADGE + '<span class="y27-ch" aria-hidden="true"></span></summary></details>';
      }).join('') +
      '<div class="kt-buybar"><button type="button" class="y27-btn y27-lock-btn" data-kt-buy>افتح التقرير الكامل</button><small>تقرير PDF يصلك بعد تأكيد الدفع</small></div>';
    lock.parentNode.insertBefore(box, lock.nextSibling);
    out.setAttribute('data-kt27', '1');
    [].forEach.call(box.querySelectorAll('details'), function (d) {
      d.querySelector('summary').addEventListener('click', function (e) { e.preventDefault(); open(+d.getAttribute('data-i')); });
    });
    [].forEach.call(box.querySelectorAll('[data-kt-buy]'), function (b) { b.addEventListener('click', buy); });
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
      if (e.target.closest('[data-kt-close]')) { close(); return; }
      if (e.target.closest('[data-kt-next]')) { open((current + 1) % ROWS.length); }
    });
    sheet.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Tab') {
        var f = [].filter.call(sheet.querySelectorAll('button,a,[tabindex]'), function (el) { return el.offsetParent !== null; });
        if (!f.length) return;
        var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    return sheet;
  }
  function open(i) {
    var r = ROWS[i]; if (!r) return;
    ensure();
    var n = names();
    var row = out.querySelector('.kt-rows27 details[data-i="' + i + '"]');
    lastFocus = row ? row.querySelector('summary') : null;
    current = i;
    ['g', 's', 'n'].forEach(function (k) { sheet.classList.toggle('y27-t-' + k, r.tone === k); });
    sheet.dataset.lock = 'locked';
    sheet.querySelector('.y27-modal-icon').innerHTML = svg(r.ic);
    sheet.querySelector('#kt-modal-title').textContent = r.t;
    sheet.querySelector('.y27-modal-content').innerHTML =
      '<div class="y27-hookbox y27-pv y27-teaser"><span class="y27-pv-tag">معاينة مجانية</span><div class="y27-prose"><p>' + esc(r.tease(n)) + '</p></div><p class="y27-cliff">' + esc(r.q) + '</p></div>' + lockPanel();
    sheet.querySelector('[data-kt-next] b').textContent = ROWS[(i + 1) % ROWS.length].t;
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
  /* the original (now hidden) buy link already knows how to start the karmic checkout */
  function buy() {
    var a = out.querySelector('.kt-lock .b3-acts a');
    if (a) a.click();
  }

  function start() {
    build();
    new MutationObserver(function () { if (out.hidden) { close(true); return; } build(); }).observe(out, { childList: true, attributes: true, attributeFilter: ['hidden'] });
    window.addEventListener('hashchange', function () { close(true); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
