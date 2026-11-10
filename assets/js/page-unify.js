/* توحيد شريط التنقل العلوي (رجوع + الرئيسية + أيقونات التبويبات) وكتلة "تابع من هنا" أسفل كل صفحة. عرض فقط. */
(function () {
  'use strict';
  var navCount = 0; window.addEventListener('hashchange', function () { navCount++; });
  function ic(p) { return '<svg class="pill-i" viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>'; }
  var I = {
    chart: '<ellipse cx="12" cy="12" rx="9" ry="4.6" transform="rotate(-28 12 12)"/><circle cx="12" cy="12" r="2.2"/>',
    maps: '<path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.500l-6 2.500-6-2.500-6 2.500z"/><path d="M9 4v13.500M15 6.500V20"/>',
    sky: '<circle cx="12" cy="12" r="4"/><path d="M12 2.500v3M12 18.500v3M2.500 12h3M18.500 12h3M5.300 5.300l2.100 2.100M16.600 16.600l2.100 2.100M5.300 18.700l2.100-2.100M16.600 7.400l2.100-2.100"/>',
    foryou: '<path d="M12 3l2.200 5.600L20 9.500l-4.400 3.900L17 19l-5-3-5 3 1.400-5.600L4 9.500l5.800-.9z"/>',
    compat: '<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>',
    lpcompat: '<path d="M4 19c4 0 3-5 8-5s4-5 8-5"/><circle cx="4" cy="19" r="1.400"/><circle cx="20" cy="9" r="1.400"/><path d="M4 5c4 0 3 5 8 5"/>',
    lifepath: '<path d="M5 20C5 11 11 6 19 5c0 8-4 14-14 15zM5 20l9-9"/>',
    matrix: '<path d="M12 3l9 9-9 9-9-9z"/><path d="M12 8l4 4-4 4-4-4z"/>',
    signs: '<circle cx="12" cy="12" r="9"/><path d="M7 4.500C8 9 8 15 7 19.500M17 4.500C16 9 16 15 17 19.500M5 9.500c4.500 1.200 9.500 1.200 14 0M5 14.500c4.500-1.200 9.500-1.200 14 0"/>',
    world: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    home: '<path d="M4 11l8-7 8 7v8.500a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M10 20.500V14h4v6.500"/>',
    back: '<path d="M9 5l7 7-7 7"/>',
    read: '<path d="M4 5.500C6.500 4.500 9.500 4.500 12 6c2.500-1.500 5.500-1.500 8-.5V19c-2.500-1-5.500-1-8 .5-2.500-1.500-5.500-1.500-8-.5z"/><path d="M12 6v13.500"/>',
    indiv: '<circle cx="12" cy="8" r="4"/><path d="M4.500 20.500a7.500 7.500 0 0 1 15 0"/>'
  };
  var BYHREF = { '#chart': I.chart, '#astro-maps': I.maps, '#sky': I.sky, '#for-you': I.foryou, '#compat': I.compat, '#lifepath-compat': I.lpcompat, '#lifepath': I.lifepath, '#matrix': I.matrix, '#signs': I.signs, '#world': I.world };
  function topbars() {
    [].forEach.call(document.querySelectorAll('.aq-section-topbar'), function (bar) {
      if (bar.getAttribute('data-unified')) return; bar.setAttribute('data-unified', '1');
      [].forEach.call(bar.querySelectorAll('.aq-section-pill'), function (a) {
        if (a.querySelector('svg')) { var s = a.querySelector('svg'); s.classList.add('pill-i'); s.removeAttribute('width'); s.removeAttribute('height'); return; }
        var p = BYHREF[a.getAttribute('href')]; if (p) a.insertAdjacentHTML('afterbegin', ic(p));
      });
      var old = bar.querySelector('.aq-back-home-btn'); if (old) old.remove();
      var box = document.createElement('div'); box.className = 'aq-nav-actions';
      box.innerHTML = '<button type="button" class="aq-nav-btn" data-aq-back>' + ic(I.back) + '<span>رجوع</span></button>' +
        '<a href="#home" class="aq-nav-btn is-home">' + ic(I.home) + '<span>الرئيسية</span></a>';
      bar.insertBefore(box, bar.firstChild);
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-aq-back]'); if (!b) return;
    e.preventDefault(); if (navCount > 0) history.back(); else location.hash = '#home';
  });
  /* روابط ختامية لكل صفحة: أدوات مرتبطة + مقال/قراءة */
  var REL = {
    matrix: [['#featured-content/matrix-22-arcana', I.read, 'اقرأ عن المصفوفة', 'هندسة الـ22 أركانًا'], ['#featured-content', I.read, 'المحتوى المميز', 'مقالات تعمّق فهمك لنفسك']],
    lifepath: [['#matrix', I.matrix, 'مصفوفة القدر', 'خريطتك الرقمية الهندسية'], ['#lifepath-compat', I.lpcompat, 'توافق المسارات', 'قراءة الشراكات بين رقمين'], ['#featured-content/pinnacles-cycles', I.read, 'اقرأ عن القمم والدورات', 'من المحتوى المميز']],
    chart: [['#matrix', I.matrix, 'مصفوفة القدر', 'الأنماط والطاقات في ميلادك'], ['#astro-maps', I.maps, 'خرائط متقدمة', 'العودة الشمسية والعبور'], ['#featured-content/how-to-start-natal-chart', I.read, 'كيف تبدأ قراءة خريطتك', 'دليل مبسّط']],
    compat: [['#lifepath-compat', I.lpcompat, 'توافق المسارات', 'قراءة الشراكات القدرية'], ['#chart', I.chart, 'خريطتك الفلكية', 'ابدأ بخريطتك أنت'], ['#featured-content/venus-in-chart', I.read, 'اقرأ عن لغة العلاقات', 'ماذا تقول الزهرة عنك']],
    sky: [['#signs', I.signs, 'صفات وتوقعات الأبراج', 'قراءة كل برج'], ['#astro-maps', I.maps, 'العبور والتقويم', 'ماذا يمرّ عليك الآن'], ['#featured-content/how-to-read-the-sky', I.read, 'كيف تقرأ السماء', 'دعوة للتأمل']],
    signs: [['#sky', I.sky, 'السماء الآن', 'مواضع الكواكب الحقيقية'], ['#chart', I.chart, 'خريطتك الفلكية', 'برجك الشمسي والقمري والطالع'], ['#featured-content/natal-trinity', I.read, 'الثالوث الأساسي', 'الشمس والقمر والطالع']],
    'astro-maps': [['#sky', I.sky, 'السماء الآن', 'حركة الكواكب الحية'], ['#chart', I.chart, 'خريطة الميلاد', 'الأساس لكل الخرائط'], ['#featured-content/understanding-transits', I.read, 'كيف تفهم العبور', 'بهدوء ودون مبالغة']],
    'for-you': [['#chart', I.chart, 'خريطتك الفلكية', 'ابدأ منها'], ['#sky', I.sky, 'السماء الآن', 'ما يجري فوقك'], ['#featured-content/moon-phases', I.read, 'إيقاع القمر', 'مقال من المحتوى المميز']],
    individual: [['#featured-content', I.read, 'المحتوى المميز', 'مقالات تشرح كل أداة'], ['#relationships', I.compat, 'التوافق', 'خرائط العلاقات'], ['#sky', I.sky, 'السماء الآن', 'مواضع الكواكب الحقيقية']],
    relationships: [['#featured-content', I.read, 'المحتوى المميز', 'مقالات تشرح كل أداة'], ['#individual', I.indiv, 'خرائطك الشخصية', 'خريطتك الفلكية والقدرية'], ['#featured-content/venus-in-chart', I.read, 'لغة العلاقات', 'ماذا تقول الزهرة عنك']]
  };
  function related() {
    Object.keys(REL).forEach(function (id) {
      var sec = document.getElementById(id); if (!sec || sec.querySelector('.aq-related')) return;
      var box = document.createElement('nav'); var T = id === 'matrix' ? 'استثمر في ذاتك' : 'تابع من هنا';
      box.className = 'aq-related'; box.setAttribute('aria-label', T);
      box.innerHTML = '<h3><span></span>' + T + '<span></span></h3><div class="aq-rel-grid">' + REL[id].map(function (r) {
        return '<a class="aq-rel" href="' + r[0] + '"><span class="aq-rel-i">' + ic(r[1]) + '</span><span class="aq-rel-t"><b>' + r[2] + '</b><small>' + r[3] + '</small></span></a>';
      }).join('') + '</div>' + (id === 'matrix' ? '<p class="aq-phil">مصفوفة القدر ليست تنبؤًا بالحظ، بل مرآة هندسية تقرأ بها اثنتين وعشرين طاقة في ميلادك، لتفهم أنماطك وتختار خطواتك بوعي.</p>' : '');
      var ft = sec.querySelector(':scope > footer'); if (ft) sec.insertBefore(box, ft); else sec.appendChild(box);
    });
  }
  function init() { topbars(); related(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
