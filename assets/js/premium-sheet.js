/* صفحة الاشتراك عند الضغط على قراءة مقفلة: تصميم فقط. الأسعار والصياغة مؤقتة ولا يوجد دفع مربوط. */
(function () {
  'use strict';
  var SV = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  var FEATS = [
    ['<path d="M6 4h12v16l-6-4-6 4z"/>', 'المكتبة الكاملة', ' من القراءات والتقارير والمقالات'],
    ['<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="2.800"/><path d="M12 3.500v2.500M12 18v2.500M3.500 12H6M18 12h2.500"/>', 'قراءات متعمقة', ' للبيوت والمواليد وتوقيتك'],
    ['<circle cx="9" cy="12" r="5.500"/><circle cx="15" cy="12" r="5.500"/>', 'التوافق', ' بين شخصين لاستكشاف العلاقة'],
    ['<circle cx="12" cy="9" r="3.500"/><path d="M5 20c.8-4 3.500-6 7-6s6.200 2 7 6"/>', 'قراءاتك محفوظة', ' وتعود إليها متى شئت']
  ];
  var PLANS = [
    ['m', 'شهري', '', '99', 'ج.م / شهر', ''],
    ['q', 'ربع سنوي', 'شائع', '83', 'ج.م / شهر', '249 ج.م كل 3 شهور'],
    ['y', 'سنوي', 'الأفضل', '67', 'ج.م / شهر', '799 ج.م في السنة']
  ];
  function dress(m) {
    var box = m.querySelector('.pwm-box'); if (!box || box.getAttribute('data-ps')) return; box.setAttribute('data-ps', '1'); box.classList.add('ps-box');
    var ctxText = (box.querySelector('.pwm-ctx') || {}).textContent || '';
    var x = box.querySelector('.pwm-x');
    box.innerHTML = ''; box.appendChild(x);
    var t = document.createElement('div'); t.className = 'ps-head';
    t.innerHTML = '<h2>تابع قراءة خريطتك<br>وأكثر!</h2><p class="ps-ctx"></p><p class="ps-sub">وصول كامل لكل المميزات</p>';
    var c = t.querySelector('.ps-ctx'); if (ctxText) c.textContent = ctxText; else c.hidden = true;
    box.appendChild(t);
    var ul = document.createElement('ul'); ul.className = 'ps-feats';
    ul.innerHTML = FEATS.map(function (f) { return '<li><span class="ps-fi">' + SV(f[0]) + '</span><p><b>' + f[1] + '</b>' + f[2] + '</p></li>'; }).join('');
    box.appendChild(ul);
    var plans = document.createElement('div'); plans.className = 'ps-plans'; plans.setAttribute('role', 'radiogroup');
    plans.innerHTML = PLANS.map(function (p, i) {
      var on = i === 2;
      return '<button type="button" class="ps-plan' + (on ? ' on' : '') + '" role="radio" aria-checked="' + on + '" data-plan="' + p[0] + '">' +
        (p[2] ? '<em>' + p[2] + '</em>' : '') + '<strong>' + p[1] + '</strong>' +
        '<span class="ps-pp"><b>' + p[3] + '</b><small>' + p[4] + '</small></span>' +
        '<span class="ps-bill">' + p[5] + '</span><i class="ps-chk">' + SV('<path d="M6 12.500l4 4 8-9"/>') + '</i></button>';
    }).join('');
    box.appendChild(plans);
    var cta = document.createElement('a'); cta.id = 'pwm-cta'; cta.href = '#'; cta.className = 'ps-cta'; cta.textContent = 'اشترك اليوم';
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
