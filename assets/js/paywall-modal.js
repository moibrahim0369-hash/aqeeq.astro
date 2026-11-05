/* عقيق أسترو بلس: نافذة جدار الدفع. واجهة فقط، لا تغيّر الحسابات.
   openPaywallModal(context) يستقبل اسم العبور/التقرير فيتغير العنوان الفرعي.
   الأسعار تُضبط من window.AQEEQ_PLUS_PRICING (قيمة فارغة = «يُعلن قريبًا»). */
(function () {
  'use strict';
  var PRICING = Object.assign({ annual: { price: '', monthlyEq: '' }, monthly: { price: '' }, once: { price: '' }, payHref: '#pay' }, window.AQEEQ_PLUS_PRICING || {});
  var IC = {
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.2 5.6L20 9.5l-4.4 3.9L17 19l-5-3-5 3 1.4-5.6L4 9.5l5.8-.9z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>'
  };
  var FEATS = [
    ['تحليل العبورات الكبرى', 'قراءة كاملة لتأثير زحل والمشتري والسنوات الفاصلة على بيوتك الشخصية.'],
    ['روشتة التحرر السلوكي', 'خطوات عملية خيميائية للتغلب على فخاخ الظل والتعطيل النفسي.'],
    ['تنبؤات الذروة والتوقيت', 'معرفة التواريخ الدقيقة لبداية ونهاية تأثير كل عبور في حياتك.'],
    ['الوصول الشامل', 'فك أقفال كافة الفصول والتقارير في مسار الحياة والتوافق الفلكي.']
  ];
  var modal, lastFocus, plan = 'annual';
  var price = function (v) { return v ? v : 'يُعلن قريبًا'; };

  function build() {
    if (modal) return;
    modal = document.createElement('div');
    modal.className = 'pwm'; modal.hidden = true;
    modal.innerHTML =
      '<div class="pwm-box" role="dialog" aria-modal="true" aria-labelledby="pwm-h" tabindex="-1">' +
      '<button type="button" class="pwm-x" aria-label="إغلاق">&times;</button>' +
      '<header class="pwm-head"><span class="pwm-mark">' + IC.star + '</span><h2 id="pwm-h">ارتقِ بوعيك مع عقيق أسترو بلس</h2>' +
      '<p class="pwm-ctx" id="pwm-ctx"></p>' +
      '<p class="pwm-sub">خريطة متكاملة لعبوراتك الفلكية، كشف الأنماط اللاواعية، وبروتوكولات التحرر العملي المخصصة لك بالكامل.</p></header>' +
      '<ul class="pwm-feats">' + FEATS.map(function (f) { return '<li><span class="pwm-ck">' + IC.check + '</span><div><b>' + f[0] + '</b><span>' + f[1] + '</span></div></li>'; }).join('') + '</ul>' +
      '<div class="pwm-plans" role="radiogroup" aria-label="باقات الاشتراك">' +
      '<label class="pwm-plan is-best"><span class="pwm-flag">خصم 40% - الأكثر طلباً</span><input type="radio" name="pwm-plan" value="annual" checked><span class="pwm-dot" aria-hidden="true"></span><span class="pwm-pt"><b>الاشتراك السنوي</b><strong>' + price(PRICING.annual.price) + '</strong><small>' + (PRICING.annual.monthlyEq ? 'ما يعادل ' + PRICING.annual.monthlyEq + ' شهريًا' : 'أفضل قيمة للمشتركين') + '</small></span></label>' +
      '<label class="pwm-plan"><input type="radio" name="pwm-plan" value="monthly"><span class="pwm-dot" aria-hidden="true"></span><span class="pwm-pt"><b>الاشتراك الشهري</b><strong>' + price(PRICING.monthly.price) + '</strong><small>تجديد تلقائي مرن يمكن إلغاؤه في أي وقت</small></span></label>' +
      '</div>' +
      '<p class="pwm-once">أو افتح تقرير هذا العبور فقط لمرة واحدة مقابل <b>' + (PRICING.once.price || 'سعر رمزي') + '</b></p>' +
      '<a class="pwm-cta" id="pwm-cta" href="' + PRICING.payHref + '">تأكيد الاشتراك وبدء رحلتك الآن</a>' +
      '<p class="pwm-safe">' + IC.lock + 'دفع آمن ومشفر 100% • إمكانية الإلغاء في أي وقت بنقرة واحدة</p>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('mousedown', function (e) { if (e.target === modal) close(); });
    modal.querySelector('.pwm-x').addEventListener('click', close);
    modal.querySelectorAll('input[name=pwm-plan]').forEach(function (r) {
      r.addEventListener('change', function () {
        plan = r.value;
        modal.querySelectorAll('.pwm-plan').forEach(function (l) { l.classList.toggle('is-on', l.contains(r) && r.checked); });
      });
    });
    modal.querySelector('.pwm-plan.is-best').classList.add('is-on');
    modal.querySelector('#pwm-cta').addEventListener('click', function () {
      try { sessionStorage.setItem('aq-plus-plan', plan); sessionStorage.setItem('aq-plus-context', modal.dataset.ctx || ''); } catch (e) { }
      close(true);
    });
    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = [].slice.call(modal.querySelectorAll('button,a[href],input')).filter(function (n) { return n.offsetParent !== null; });
      if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    });
  }
  function onKey(e) { if (e.key === 'Escape' && modal && !modal.hidden) { e.preventDefault(); close(); } }
  function open(context) {
    build();
    lastFocus = document.activeElement;
    var ctx = String(context || '').trim();
    modal.dataset.ctx = ctx;
    var el = modal.querySelector('#pwm-ctx');
    el.textContent = ctx ? 'افتح قراءة: ' + ctx : ''; el.hidden = !ctx;
    plan = 'annual'; modal.querySelector('input[value=annual]').checked = true;
    modal.querySelectorAll('.pwm-plan').forEach(function (l) { l.classList.toggle('is-on', l.classList.contains('is-best')); });
    modal.hidden = false;
    document.documentElement.classList.add('pwm-lock');
    requestAnimationFrame(function () { modal.classList.add('is-open'); var b = modal.querySelector('.pwm-box'); b.scrollTop = 0; b.focus({ preventScroll: true }); });
    document.addEventListener('keydown', onKey);
  }
  function close(keepFocus) {
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-open');
    document.removeEventListener('keydown', onKey);
    document.documentElement.classList.remove('pwm-lock');
    setTimeout(function () { modal.hidden = true; }, 200);
    if (keepFocus !== true && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  window.openPaywallModal = open;
  window.closePaywallModal = close;

  /* المحفزات: أي عنصر data-paywall، زر القفل في «لك»، وأي شارة «قراءة متعمقة» */
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-paywall], .fy-lock-btn, .lpa-badge.is-deep');
    if (!t) return;
    e.preventDefault(); e.stopPropagation();
    var ctx = t.getAttribute('data-paywall');
    if (!ctx && t.classList.contains('is-deep')) { var b = t.closest('b'); ctx = b ? b.textContent.replace(/قراءة متعمقة/, '').trim() : ''; }
    open(ctx);
  }, true);
})();
