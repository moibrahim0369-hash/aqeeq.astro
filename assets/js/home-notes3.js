/* ملاحظات الهوم: شارة جديد، نقل زر "عرض الكل"، سهم الشريط العلوي، ونافذة ابدأ رحلتك */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var SVG = {
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1l1.6 8.4L22 12l-8.4 2.6L12 23l-1.6-8.4L2 12l8.4-2.6z"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.600 6.500-10 6.500S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><ellipse cx="12" cy="12" rx="10" ry="5.5" transform="rotate(-28 12 12)"/><circle cx="12" cy="12" r="2.4" fill="currentColor"/></svg>',
    matrix: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 21 12 12 21 3 12Z"/><path d="M12 3v18M3 12h18" stroke-opacity=".7"/></svg>',
    path: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M2 19 9 7l4 6 3-4 6 10Z"/></svg>',
    love: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5" stroke-opacity=".75"/></svg>',
    sign: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.500"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><rect x="3.500" y="3.500" width="7" height="7" rx="1.500"/><rect x="13.500" y="3.500" width="7" height="7" rx="1.500"/><rect x="3.500" y="13.500" width="7" height="7" rx="1.500"/><path d="M13.500 17h7M17 13.500v7"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 6C9.500 4.500 5.500 4.500 3 5.500v13c2.500-1 6.500-1 9 .5 2.500-1.500 6.500-1.500 9-.5v-13c-2.500-1-6.500-1-9 .5ZM12 6v13"/></svg>'
  };

  /* --- زر عرض الكل تحت المعرض + شارة جديد مكانه --- */
  function articles() {
    var head = $('#aqh-articles .aqh-articles-head'), all = $('#aqh-all-articles'), sec = $('#aqh-articles');
    if (!head || !all || !sec || sec.getAttribute('data-hn')) return;
    sec.setAttribute('data-hn', '1');
    var wrap = document.createElement('div'); wrap.className = 'aqh-all-wrap'; var ico=document.createElement('span'); ico.className='aqh-all-ico'; ico.innerHTML=SVG.grid; all.appendChild(ico); wrap.appendChild(all); sec.appendChild(wrap);
    var badge = document.createElement('span'); badge.className = 'aqh-new-badge'; badge.hidden = true; badge.setAttribute('role', 'img'); badge.setAttribute('aria-label', 'محتوى مميز جديد');
    badge.innerHTML = SVG.star + '<span>محتوى مميز جديد</span>'; head.appendChild(badge);
    try {
      fetch('assets/data/featured-content.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (d) {
        var list = Array.isArray(d) ? d : (d.items || d.articles || []);
        var newest = 0; list.forEach(function (a) { var t = Date.parse(a.publishedAt || a.date || ''); if (t > newest) newest = t; });
        if (newest && (Date.now() - newest) / 864e5 <= 30) badge.hidden = false;
      }).catch(function () { });
    } catch (e) { }
  }

  /* --- سهم الشريط العلوي عند الضيق --- */
  function navMore() {
    var nav = $('.aqh-header .aqh-nav'); if (!nav || nav.nextElementSibling && nav.nextElementSibling.classList.contains('aqh-nav-more')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'aqh-nav-more'; b.setAttribute('aria-label', 'عرض المزيد من الروابط'); b.innerHTML = SVG.chev;
    nav.parentNode.insertBefore(b, nav.nextSibling);
    function upd() {
      var max = nav.scrollWidth - nav.clientWidth, pos = Math.abs(nav.scrollLeft);
      var visible = getComputedStyle(nav).display !== 'none';
      b.classList.toggle('is-on', visible && max > 6 && pos < max - 6);
    }
    b.addEventListener('click', function () { nav.scrollBy({ left: -140 }); });
    nav.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); setTimeout(upd, 400); setTimeout(upd, 1500); upd();
  }

  /* --- نافذة ابدأ رحلتك --- */
  var modal, lastFocus;
  var ITEMS = [
    ['#chart', 'chart', 'الخريطة الفلكية', 'شخصيتك لحظة ميلادك'],
    ['#matrix', 'matrix', 'مصفوفة القدر', 'طاقاتك ودروسك'],
    ['#lifepath', 'path', 'مسار الحياة', 'محطات رحلتك'],
    ['#relationships', 'love', 'التوافق', 'بينك وبين من تحب'],
    ['#signs', 'sign', 'برجك الآن', 'ماذا تقول السماء'],
    ['#featured-content', 'book', 'المقالات', 'شروحات خطوة بخطوة']
  ];
  function build() {
    modal = document.createElement('div'); modal.className = 'hn-modal'; modal.hidden = true;
    modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-labelledby', 'hn-t');
    modal.innerHTML = '<div class="hn-card"><span class="hn-eye">' + SVG.eye + '</span>' +
      '<h2 id="hn-t">رحلتك تبدأ من الداخل</h2>' +
      '<p>في عقيق أسترو نقرأ الفلك كمرآة للنفس، لا كتوقعات فقط. نمنحك أدوات تساعدك على فهم نفسك واختيار طريقك بوعي.</p>' +
      '<ul class="hn-focus"><li>العمق النفسي</li><li>تشريح الخريطة</li><li>الطاقات</li><li>التوقيتات</li></ul>' +
      '<div class="hn-grid">' + ITEMS.map(function (i) { return '<a class="hn-tile" href="' + i[0] + '"><i>' + SVG[i[1]] + '</i><span><b>' + i[2] + '</b><small>' + i[3] + '</small></span></a>'; }).join('') + '</div>' +
      '<button type="button" class="hn-close">' + SVG.x + '<span>إغلاق النافذة</span></button></div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('.hn-close') || e.target.closest('.hn-tile')) close(); });
  }
  function open() {
    if (!modal) build();
    lastFocus = document.activeElement; modal.hidden = false; document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { modal.classList.add('is-open'); var c = $('.hn-close', modal); if (c) c.focus(); });
  }
  function close() {
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-open'); document.documentElement.style.overflow = '';
    setTimeout(function () { modal.hidden = true; }, 220);
    if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) { }
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('#home .aqh-hero-copy a.aq-btn-burgundy.aqh-cta');
    if (a) { e.preventDefault(); e.stopPropagation(); open(); }
  }, true);

  function init() { articles(); navMore(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
