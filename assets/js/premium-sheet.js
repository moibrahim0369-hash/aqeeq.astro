/* نافذة الاشتراك عند الضغط على قراءة مقفلة: تصميم فقط. السعر مؤقت للمعاينة ولا يوجد دفع مربوط. */
(function () {
  'use strict';
  var SV = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  var FEATS = [
    ['<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="3"/><path d="M12 3.500v2M12 18.500v2M3.500 12h2M18.500 12h2"/>', 'قراءات متعمقة', 'تفاصيل أوسع لكل قراءة في خريطتك.'],
    ['<path d="M7 3.500h8l3.500 3.500v13.500H7z"/><path d="M15 3.500V7h3.500M10 12h5M10 15.500h5"/>', 'تقارير كاملة', 'اقرأ التقرير بكل فصوله.'],
    ['<path d="M6 4h12v16l-6-4-6 4z"/>', 'احتفظ بقراءاتك', 'ارجع إليها متى شئت.']
  ];
  function dress(m) {
    var box = m.querySelector('.pwm-box'); if (!box || box.getAttribute('data-ps')) return; box.setAttribute('data-ps', '1'); box.classList.add('ps-box');
    var head = box.querySelector('.pwm-head');
    var h2 = head.querySelector('h2'); h2.textContent = 'افتح القراءة الكاملة';
    var mk = document.createElement('span'); mk.className = 'ps-mark'; mk.innerHTML = SV('<circle cx="12" cy="12" r="2.600"/><ellipse cx="12" cy="12" rx="9" ry="4.500" transform="rotate(-25 12 12)"/>'); head.insertBefore(mk, head.firstChild);
    var sub = head.querySelector('.pwm-sub'); sub.className = 'ps-sub'; sub.textContent = 'اشتراك واحد يفتح القراءات المتعمقة والتقارير الكاملة.';
    var ul = box.querySelector('.pwm-feats');
    ul.innerHTML = FEATS.map(function (f) { return '<li><span class="ps-fi">' + SV(f[0]) + '</span><div><b>' + f[1] + '</b><span>' + f[2] + '</span></div></li>'; }).join('');
    var plans = document.createElement('div'); plans.className = 'ps-plans'; plans.setAttribute('role', 'radiogroup');
    plans.innerHTML = '<button type="button" class="ps-plan" role="radio" aria-checked="false" data-plan="m"><span class="ps-pn">شهري</span><span class="ps-pp"><b>99</b> ج.م<small>/ شهر</small></span></button>' +
      '<button type="button" class="ps-plan on" role="radio" aria-checked="true" data-plan="y"><em>الأوفر</em><span class="ps-pn">سنوي</span><span class="ps-pp"><b>799</b> ج.م<small>/ سنة</small></span></button>';
    ul.parentNode.insertBefore(plans, ul.nextSibling);
    var cta = box.querySelector('#pwm-cta'); cta.textContent = 'اشترك الآن'; cta.setAttribute('href', '#'); cta.classList.add('ps-cta');
    var safe = box.querySelector('.pwm-safe'); safe.className = 'ps-note'; safe.textContent = 'السعر مؤقت وسيتحدد قبل الإطلاق.';
    var later = document.createElement('button'); later.type = 'button'; later.className = 'ps-later'; later.textContent = 'ليس الآن'; later.addEventListener('click', function () { box.querySelector('.pwm-x').click(); });
    safe.parentNode.insertBefore(later, safe);
    plans.addEventListener('click', function (e) { var b = e.target.closest('.ps-plan'); if (!b) return; [].forEach.call(plans.children, function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-checked', String(on)); }); });
    cta.addEventListener('click', function (e) { e.preventDefault(); }, true);
  }
  function watch() { var m = document.querySelector('.pwm'); if (m) dress(m); }
  new MutationObserver(watch).observe(document.documentElement, { childList: true, subtree: true });
  watch();
})();
