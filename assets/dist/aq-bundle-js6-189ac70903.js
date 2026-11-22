/* assets/js/section-footer.js */
/* فوتر موحد خفيف في نهاية الصفحات الداخلية: روابط قانونية + حقوق. يُبنى مرة واحدة (استنساخ ثابت، بلا نقل ديناميكي). */
(function () {
  'use strict';
  var IDS = ['matrix', 'lifepath', 'lifepath-compat', 'matrix-compat', 'matrix-child', 'chart', 'astro-maps', 'for-you', 'sky', 'signs', 'compat', 'individual', 'relationships', 'energy-compatibility', 'invest'];
  function build() {
    var orig = document.querySelector('body > footer.foot'); if (!orig) return;
    var soc = orig.querySelector('.aq-soc'), nav = orig.querySelector('nav.sp-foot'), dis = orig.querySelector('.foot-dis'), cp = orig.querySelector('.copy');
    if (!nav) return setTimeout(build, 400);
    IDS.forEach(function (id) {
      var sec = document.getElementById(id);
      if (!sec || sec.querySelector(':scope > footer.aqf')) return;
      var f = document.createElement('footer'); f.className = 'aqf';
      [soc, nav, dis, cp].forEach(function (n) { if (n) f.appendChild(n.cloneNode(true)); });
      [].forEach.call(f.querySelectorAll('[id]'), function (n) { n.removeAttribute('id'); });
      sec.appendChild(f);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(build, 500); });
  else setTimeout(build, 500);
  /* الفوتر يرتاح فوق الشريط السفلي: في الصفحات القصيرة يلزق بالأسفل بمسافة ثابتة */
  function settle() {
    [].forEach.call(document.querySelectorAll('section.sec > footer.aqf'), function (f) {
      var s = f.parentNode; if (!s.clientHeight) return;
      f.style.marginTop = '40px';
      var need = s.clientHeight - (f.offsetTop + f.offsetHeight + 84);
      if (need > 0) f.style.marginTop = (40 + need) + 'px';
    });
  }
  window.addEventListener('hashchange', function () { setTimeout(settle, 150); setTimeout(settle, 900); });
  window.addEventListener('resize', settle);
  setTimeout(settle, 1200); setTimeout(settle, 3000);
})();

;
/* assets/js/paywall-modal.js */
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

;
/* assets/js/lp-knowledge.js */
/* زر «احسب مسار حياتك الآن» في قسم التعريف: يرجّع المستخدم لأعلى الحاسبة ويركّز على أول حقل. عرض فقط. */
(function () {
  'use strict';
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-lp-cta]'); if (!a) return;
    e.preventDefault();
    var sec = document.getElementById('lifepath'); if (!sec) return;
    var edit = sec.querySelector('#lpresult .btn-edit-lp'), res = sec.querySelector('#lpresult');
    if (edit && res && !res.hidden && res.offsetParent !== null) edit.click();
    sec.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(function () { var f = sec.querySelector('#lp-name'); if (f && f.offsetParent) f.focus({ preventScroll: true }); }, 450);
  });
})();
/* مصفوفة القدر: زر قسم التعريف يرجّع لأعلى الفورم ويركّز على الاسم. عرض فقط. */
(function () {
  'use strict';
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-mx-cta]'); if (!a) return;
    e.preventDefault();
    var sec = document.getElementById('matrix'); if (!sec) return;
    sec.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(function () { var f = sec.querySelector('#m-name'); if (f && f.offsetParent) f.focus({ preventScroll: true }); }, 450);
  });
})();
/* الخريطة الفلكية: زر قسم التعريف يرجّع لأعلى الفورم ويركّز على الاسم. عرض فقط. */
(function () {
  'use strict';
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-ch-cta]'); if (!a) return;
    e.preventDefault();
    var sec = document.getElementById('chart'); if (!sec) return;
    sec.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(function () { var f = sec.querySelector('#f-name'); if (f && f.offsetParent) f.focus({ preventScroll: true }); }, 450);
  });
})();
/* التوافق: زر قسم التعريف يرجّع لأعلى الفورم. عرض فقط. */
(function () {
  'use strict';
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-cp-cta]'); if (!a) return;
    e.preventDefault();
    var sec = document.getElementById('compat'); if (!sec) return;
    sec.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
