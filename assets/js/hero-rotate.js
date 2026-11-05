/* تبديل نصوص (وصور اختيارية) البانر العلوي: كل 3 دقائق، وبداية مختلفة عند كل تحديث للصفحة */
(function () {
  'use strict';
  var EVERY = 180000;
  /* لإضافة صورة جديدة لأي شريحة: ضع الملف في assets/images/home/ وأضف الحقل img (مثال: img: 'assets/images/home/hero-2.jpg', pos: '70% 30%') */
  var SLIDES = [
    { eye: 'أكثر من توقعات .. رحلة إلى ذاتك', h: 'اكتشف خريطتك الداخلية', p: 'في AQEQ ASTRO نؤمن أن علم الفلك ليس مجرد معرفة بالمستقبل، بل هو أداة عميقة لفهم نفسك، واكتشاف إمكانياتك، والعيش بانسجام أكبر.', cta: 'ابدأ رحلتك', href: '#chart' },
    { eye: 'AQEQ ASTRO', h: 'كل إجابة تبدأ بسؤال', p: 'في عقيق نؤمن أن الأسئلة الصادقة تقود إلى حياة أعمق. اكتشف ذاتك من خلال علم الفلك والأرقام والرموز.', cta: 'اكتشف الآن', href: '#sky', img: 'assets/images/home/hero-art-arch.svg', pos: '50% 12%' },
    { eye: 'رحلة أعمق نحو ذاتك', h: 'خريطتك الداخلية تستحق أن تُقرأ', p: 'لكل إنسان كون فريد من الرموز والدلالات. نساعدك على فهم خريطتك الداخلية واكتشاف المعاني الخفية في رحلتك الحياتية.', cta: 'ابدأ القراءة', href: '#chart', img: 'assets/images/home/hero-art-drape.svg', pos: '55% 40%' },
    { eye: 'من الرموز إلى الوضوح', h: 'المعرفة تبدأ من الداخل', p: 'رحلة وعي عميقة تجمع بين علم الفلك والرموز القديمة لمساعدتك على فهم ذاتك وعلاقاتك وإمكاناتك الحقيقية.', cta: 'ابدأ رحلتك الآن', href: '#chart', img: 'assets/images/home/hero-art-orrery.svg', pos: '50% 50%' },
    { eye: 'السماء مرآة لداخلك', h: 'رموز تساعدك على رؤية أوسع', p: 'اكتشف ذاتك من خلال علم الرموز والفلك، وأعد اكتشاف احتمالاتك.', cta: 'اكتشف المنصة', href: '#sky', img: 'assets/images/home/hero-art-moon.svg', pos: '50% 22%' }
  ];
  var copy = document.getElementById('home-intro');
  if (!copy) return;
  var eye = copy.querySelector('.aqh-eyebrow'), h = copy.querySelector('.aqh-title'), p = copy.querySelector('.aqh-lead'),
      cta = copy.querySelector('.aqh-cta'), ctaT = cta && cta.querySelector('span'), img = document.querySelector('.hw-statue');
  if (!eye || !h || !p || !cta) return;
  var baseImg = img ? img.getAttribute('src') : '', basePos = img ? img.style.objectPosition : '';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = 0, timer = null;
  function pick() {
    var q = /[?&]hero=(\d+)/.exec(location.search); if (q && SLIDES[+q[1]]) return +q[1];
    var last = -1; try { last = parseInt(localStorage.getItem('aqh-hero-last'), 10); } catch (e) {}
    var n; do { n = Math.floor(Math.random() * SLIDES.length); } while (SLIDES.length > 1 && n === last);
    try { localStorage.setItem('aqh-hero-last', String(n)); } catch (e) {}
    return n;
  }
  function setT(el, t) { el.textContent = t; if (el.hasAttribute('data-i18n-ar')) { el.setAttribute('data-i18n-ar', t); el.setAttribute('data-i18n-en', t); } }
  function apply(i) {
    var s = SLIDES[i]; cur = i;
    setT(eye, s.eye); setT(h, s.h); setT(p, s.p);
    if (ctaT) { ctaT.textContent = s.cta; } cta.setAttribute('href', s.href);
    if (cta.hasAttribute('data-i18n-ar')) { cta.setAttribute('data-i18n-ar', s.cta); cta.setAttribute('data-i18n-en', s.cta); }
    if (img) { img.setAttribute('src', s.img || baseImg); img.style.objectPosition = s.pos || basePos; }
  }
  function go(i) {
    if (reduce) { apply(i); return; }
    var els = [eye, h, p, cta, img].filter(Boolean);
    els.forEach(function (e) { e.style.transition = 'opacity .45s ease, transform .45s ease'; e.style.opacity = '0'; e.style.transform = 'translateY(8px)'; });
    setTimeout(function () {
      apply(i);
      els.forEach(function (e) { e.style.opacity = '1'; e.style.transform = 'none'; });
      setTimeout(function () { els.forEach(function (e) { e.style.transition = ''; e.style.transform = ''; e.style.opacity = ''; }); }, 500);
    }, 460);
  }
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      var home = document.getElementById('home');
      if (!document.hidden && home && home.getClientRects().length) go((cur + 1) % SLIDES.length);
      schedule();
    }, EVERY);
  }
  var start = pick(); if (start !== 0) apply(start);
  schedule();
})();
