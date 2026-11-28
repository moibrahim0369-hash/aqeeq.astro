/* عقيق أسترو · صفحة القراءة الكاملة
   في صفحة السما: الورقة تفتح بنص خاطف + زر «اقرأ القراءة كاملة».
   الزر (وزر «اقرأ التفاصيل» في توقعات الأبراج) يفتح صفحة كاملة منسقة: بانر وعناوين وفقرات وسؤال تأمل.
   العرض فقط: لا يغيّر أي نص ولا حساب. */
(function () {
  'use strict';
  var BTN_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
  var BACK_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

  function words(el) { return (el.textContent || '').trim().split(/\s+/).filter(Boolean).length; }

  /* عنوان كل فقرة حسب بدايتها */
  function labelOf(p, i) {
    var t = (p.textContent || '').trim();
    if (/^كيف تستثمر/.test(t)) return 'كيف تستثمرها';
    if (/^(والذي يحدث كثيرًا|والوجه الآخر|والخطر الصغير|الخطر الصغير)/.test(t)) return 'الوجه الآخر';
    if (/^وفي الحياة اليومية/.test(t)) return 'في حياتك اليومية';
    if (/^(وفي ختام|وفي آخر|قبل أن تنام)/.test(t)) return 'قبل أن ينتهي اليوم';
    if (/^(و?في )?(العمل|الشغل|المال)/.test(t)) return 'العمل والمال';
    if (/^(و?في )?(العلاقات|الحب|البيت|الأسرة|الإيمان)/.test(t)) return 'العلاقات والبيت';
    if (i === 0) return 'الصورة العامة';
    return '';
  }

  function decoratePage(body) {
    if (!body || body.querySelector('.aqr-h')) return;
    var reads = body.querySelectorAll('.swp-fold > .swp-read, .swp-full > .swp-read');
    var last = '';
    Array.prototype.forEach.call(reads, function (p, i) {
      var lb = labelOf(p, i);
      if (lb && lb !== last) {
        var h = document.createElement('h4'); h.className = 'aqr-h'; h.textContent = lb;
        p.parentNode.insertBefore(h, p); last = lb;
        if (lb === 'كيف تستثمرها') p.innerHTML = p.innerHTML.replace(/^\s*كيف تستثمر[^:]*:\s*/, '');
      }
    });
  }

  function clearDecor(body) {
    if (!body) return;
    Array.prototype.forEach.call(body.querySelectorAll('.aqr-h'), function (h) { h.remove(); });
  }

  var pushed = false;
  function openPage(sheet) {
    var body = sheet.querySelector('.aqm-sheet-body');
    sheet.classList.remove('aqr-hook'); sheet.classList.add('aqr-page');
    decoratePage(body);
    var panel = sheet.querySelector('.aqm-sheet-panel');
    [panel, body].forEach(function (e) { if (e) e.scrollTop = 0; });
    if (!pushed) { try { history.pushState({ aqr: 1 }, ''); pushed = true; } catch (_) {} }
  }

  function backFromPage(sheet) {
    if (sheet.id === 'sgs-sheet' || !sheet.classList.contains('aqr-hasHook')) {
      var x = sheet.querySelector('.aqm-sheet-x, .aqm-foot-close'); if (x) x.click(); return;
    }
    sheet.classList.remove('aqr-page'); sheet.classList.add('aqr-hook');
    clearDecor(sheet.querySelector('.aqm-sheet-body'));
    var panel = sheet.querySelector('.aqm-sheet-panel'); if (panel) panel.scrollTop = 0;
  }

  window.addEventListener('popstate', function () {
    if (!pushed) return; pushed = false;
    var s = document.querySelector('.aqm-sheet.aqr-page:not([hidden])');
    if (s) backFromPage(s);
  });

  function ensureTop(sheet) {
    var panel = sheet.querySelector('.aqm-sheet-panel'); if (!panel || panel.querySelector('.aqr-top')) return;
    var top = document.createElement('div'); top.className = 'aqr-top';
    top.innerHTML = '<button type="button" class="aqr-back">' + BACK_SVG + '<span>رجوع</span></button><span class="aqr-top-t">القراءة الكاملة</span>';
    top.querySelector('.aqr-back').addEventListener('click', function () {
      if (pushed) { history.back(); } else backFromPage(sheet);
    });
    panel.insertBefore(top, panel.firstChild);
  }

  function setupHook(sheet) {
    var body = sheet.querySelector('.aqm-sheet-body'); if (!body) return;
    var fold = body.querySelector('.swp-fold'); if (!fold) return;
    if (words(body) < 140) { sheet.classList.remove('aqr-hook', 'aqr-hasHook'); return; }
    sheet.classList.add('aqr-hasHook');
    if (!sheet.classList.contains('aqr-page')) sheet.classList.add('aqr-hook');
    var firstRead = fold.querySelector('.swp-read') || fold.querySelector('.trm-lead');
    var btn = fold.querySelector('.aqr-more');
    if (!btn) {
      btn = document.createElement('button'); btn.type = 'button'; btn.className = 'aqr-more';
      btn.innerHTML = '<span>اقرأ القراءة كاملة</span>' + BTN_SVG;
      btn.addEventListener('click', function () { openPage(sheet); });
    }
    if (firstRead && firstRead.nextSibling !== btn) firstRead.parentNode.insertBefore(btn, firstRead.nextSibling);
  }

  function apply(sheet) {
    if (!sheet || sheet.hidden) return;
    var onPage = /^#(sky|signs|world)/.test(location.hash || '');
    if (!onPage || !sheet.classList.contains('swp-sheet')) return;
    ensureTop(sheet);
    var body = sheet.querySelector('.aqm-sheet-body');
    if (sheet.id === 'sgs-sheet') {
      sheet.classList.add('aqr-page'); decoratePage(body); return;
    }
    if (sheet.classList.contains('aqr-page')) { decoratePage(body); setupHook(sheet); return; }
    setupHook(sheet);
  }

  var busy = false;
  function scan() {
    if (busy) return; busy = true;
    try { Array.prototype.forEach.call(document.querySelectorAll('.aqm-sheet.swp-sheet'), apply); } finally { busy = false; }
  }
  var t = 0;
  new MutationObserver(function (muts) {
    for (var i = 0; i < muts.length; i++) {
      var tg = muts[i].target;
      if (tg.closest && tg.closest('.aqr-top, .aqr-more')) continue;
      if (muts[i].addedNodes.length && Array.prototype.some.call(muts[i].addedNodes, function (n) { return n.nodeType === 1 && (n.classList.contains('aqr-h') || n.classList.contains('aqr-more') || n.classList.contains('aqr-top')); })) continue;
      clearTimeout(t); t = setTimeout(scan, 30); return;
    }
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] });

  /* لما الورقة تتقفل نرجعها لوضعها الأصلي */
  document.addEventListener('click', function (e) {
    var c = e.target.closest && e.target.closest('.aqm-foot-close, .aqm-sheet-x, .aqm-sheet-scrim');
    if (!c) return;
    var s = c.closest('.aqm-sheet'); if (!s) return;
    setTimeout(function () { s.classList.remove('aqr-page'); clearDecor(s.querySelector('.aqm-sheet-body')); if (pushed) { pushed = false; try { history.back(); } catch (_) {} } }, 350);
  }, true);
  document.addEventListener('click', function (e) {
    var n = e.target.closest && e.target.closest('.swp-sheet .aqm-foot-next');
    if (!n) return;
    var s = n.closest('.aqm-sheet');
    if (s && s.id !== 'sgs-sheet') setTimeout(function () { s.classList.remove('aqr-page'); clearDecor(s.querySelector('.aqm-sheet-body')); scan(); }, 60);
  }, true);
})();
