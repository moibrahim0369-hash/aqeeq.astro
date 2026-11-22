/* Product details before checkout. No subscription, price or refund claims without a configured offer. */
(function () {
  'use strict';
  var modal, lastFocus;
  function build() {
    if (modal) return;
    modal = document.createElement('div'); modal.className = 'pwm'; modal.hidden = true;
    modal.innerHTML = '<div class="pwm-box" role="dialog" aria-modal="true" aria-labelledby="pwm-h" tabindex="-1">' +
      '<button type="button" class="pwm-x" aria-label="إغلاق">×</button>' +
      '<header class="pwm-head"><h2 id="pwm-h">اعرف التقرير قبل ما تختاره</h2><p class="pwm-ctx" id="pwm-ctx"></p>' +
      '<p class="pwm-sub">القراءة التي فتحتها ليست بالضرورة منتجًا متاحًا للشراء. راجع عرض التقرير نفسه، ولا تفترض أن شراء تقرير يفتح كل قراءات الموقع.</p></header>' +
      '<ul class="pwm-feats"><li><div><b>المحتوى أولًا</b><span>ما الفصول التي يشملها التقرير؟ وما الفرق بينها وبين النتيجة المعروضة؟</span></div></li>' +
      '<li><div><b>السعر والعملة</b><span>يجب أن يظهر السعر الصحيح للمنتج قبل أي دفع. لا يوجد هنا اشتراك سنوي أو شهري معروض للتفعيل.</span></div></li>' +
      '<li><div><b>التسليم والاسترداد</b><span>راجع طريقة ومدة التسليم وشروط الاسترداد قبل الدفع. إذا غابت، اطلب توضيحها أولًا.</span></div></li></ul>' +
      '<a class="pwm-cta" id="pwm-cta" href="#service-guide">افهم خطوات القراءة والطلب</a>' +
      '<p class="pwm-safe">فتح هذه النافذة لا ينشئ طلب شراء ولا يخصم مبلغًا.</p></div>';
    document.body.appendChild(modal);
    modal.addEventListener('mousedown', function (e) { if (e.target === modal) close(); });
    modal.querySelector('.pwm-x').addEventListener('click', close);
    modal.querySelector('#pwm-cta').addEventListener('click', function () { close(true); });
    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = [].slice.call(modal.querySelectorAll('button,a[href]')).filter(function (n) { return n.offsetParent !== null; });
      if (!f.length) return; var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    });
  }
  function onKey(e) { if (e.key === 'Escape' && modal && !modal.hidden) { e.preventDefault(); close(); } }
  function open(context) {
    build(); lastFocus = document.activeElement; var ctx = String(context || '').trim();
    var el = modal.querySelector('#pwm-ctx'); el.textContent = ctx ? 'القراءة: ' + ctx : ''; el.hidden = !ctx;
    modal.hidden = false; document.documentElement.classList.add('pwm-lock');
    requestAnimationFrame(function () { modal.classList.add('is-open'); var b = modal.querySelector('.pwm-box'); b.scrollTop = 0; b.focus({ preventScroll: true }); });
    document.addEventListener('keydown', onKey);
  }
  function close(keepFocus) {
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-open'); document.removeEventListener('keydown', onKey); document.documentElement.classList.remove('pwm-lock');
    setTimeout(function () { modal.hidden = true; }, 200);
    if (keepFocus !== true && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  window.openPaywallModal = open; window.closePaywallModal = close;
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-paywall], .fy-lock-btn, .lpa-badge.is-deep'); if (!t) return;
    if (window.AQ_REVIEW_OPEN && !t.hasAttribute('data-paywall')) return;
    e.preventDefault(); e.stopPropagation(); var ctx = t.getAttribute('data-paywall');
    if (!ctx && t.classList.contains('is-deep')) { var b = t.closest('b'); ctx = b ? b.textContent.replace(/قراءة متعمقة/, '').trim() : ''; }
    open(ctx);
  }, true);
})();
