/* صفحة الاشتراك عند الضغط على قراءة مقفلة: تصميم فقط. الأسعار مؤقتة للمعاينة ولا يوجد دفع مربوط. */
(function () {
  'use strict';
  var SV = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  var ICONS = [
    ['<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="2.800"/><path d="M12 3.500v2.500M12 18v2.500M3.500 12H6M18 12h2.500"/>', 'قراءات متعمقة'],
    ['<path d="M7 3.500h8l3.500 3.500v13.500H7z"/><path d="M15 3.500V7h3.500M10 12h5M10 15.500h5"/>', 'تقارير كاملة'],
    ['<path d="M6 4h12v16l-6-4-6 4z"/>', 'قراءاتك محفوظة'],
    ['<circle cx="12" cy="12" r="8.500"/><path d="M12 7.500v5l3 2"/>', 'مواليد وتوقيت'],
    ['<path d="M12 20s-7-4.300-7-9.500A4 4 0 0 1 12 8a4 4 0 0 1 7 2.500C19 15.700 12 20 12 20z"/>', 'التوافق'],
    ['<path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14zM5 19l7-7"/>', 'مقالات']
  ];
  var PLANS = [
    ['y', 'سنويًا', '799', 'ج.م / سنة', 'خصم 33%', 'الأفضل', '15.4 ج.م أسبوعيًا'],
    ['m', 'شهريًا', '99', 'ج.م / شهر', '', '', '23.1 ج.م أسبوعيًا'],
    ['w', 'أسبوعيًا', '29', 'ج.م / أسبوع', '', '', '29 ج.م أسبوعيًا']
  ];
  function dress(m) {
    var box = m.querySelector('.pwm-box'); if (!box || box.getAttribute('data-ps')) return; box.setAttribute('data-ps', '1'); box.classList.add('ps-box');
    var ctxText = (box.querySelector('.pwm-ctx') || {}).textContent || '';
    var x = box.querySelector('.pwm-x');
    var cta0 = box.querySelector('#pwm-cta');
    var keep = x;
    box.innerHTML = '';
    box.appendChild(keep);
    var hero = document.createElement('div'); hero.className = 'ps-hero';
    hero.innerHTML = '<span class="ps-orb o1"></span><span class="ps-orb o2"></span><span class="ps-ring r1"></span><span class="ps-ring r2"></span><img class="ps-logo" src="assets/images/brand/logo-mark-512.png" alt="">';
    box.appendChild(hero);
    var t = document.createElement('div'); t.className = 'ps-head';
    t.innerHTML = '<h2>كل قراءاتك<br><span>في مكان واحد</span></h2><p class="ps-ctx"></p><span class="ps-chip">' + SV('<path d="M4 17l2-9 4 4 2-6 2 6 4-4 2 9z"/>') + 'عضوية عقيق</span>';
    box.appendChild(t);
    if (ctxText) t.querySelector('.ps-ctx').textContent = ctxText; else t.querySelector('.ps-ctx').hidden = true;
    var row = document.createElement('div'); row.className = 'ps-icons';
    row.innerHTML = ICONS.map(function (f) { return '<div><i>' + SV(f[0]) + '</i><span>' + f[1] + '</span></div>'; }).join('');
    box.appendChild(row);
    var plans = document.createElement('div'); plans.className = 'ps-plans'; plans.setAttribute('role', 'radiogroup');
    plans.innerHTML = PLANS.map(function (p, i) {
      return '<button type="button" class="ps-plan' + (i === 0 ? ' on' : '') + '" role="radio" aria-checked="' + (i === 0) + '" data-plan="' + p[0] + '">' +
        (p[5] ? '<em>' + p[5] + '</em>' : '') +
        '<span class="ps-pl"><b>' + p[1] + '</b>' + (p[4] ? '<u>' + p[4] + '</u>' : '') + '<small>' + p[6] + '</small></span>' +
        '<span class="ps-pp"><b>' + p[2] + '</b><small>' + p[3] + '</small></span></button>';
    }).join('');
    box.appendChild(plans);
    var cta = document.createElement('a'); cta.id = 'pwm-cta'; cta.href = '#'; cta.className = 'ps-cta'; cta.textContent = 'متابعة';
    cta.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); });
    box.appendChild(cta);
    var note = document.createElement('p'); note.className = 'ps-note'; note.textContent = 'الأسعار مؤقتة وستتحدد قبل الإطلاق.';
    box.appendChild(note);
    plans.addEventListener('click', function (e) { var b = e.target.closest('.ps-plan'); if (!b) return; [].forEach.call(plans.children, function (n) { var on = n === b; n.classList.toggle('on', on); n.setAttribute('aria-checked', String(on)); }); });
  }
  function watch() { var m = document.querySelector('.pwm'); if (m) dress(m); }
  new MutationObserver(watch).observe(document.documentElement, { childList: true, subtree: true });
  watch();
})();
