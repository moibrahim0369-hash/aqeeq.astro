/* AQEQ ASTRO — Homepage (Phase 1): تفاعلات الصفحة الرئيسية فقط.
   لا يلمس أي محرك أو حسابات؛ يضيف: ظهور تدريجي عند التمرير، قائمة «اكتشف ذاتك»،
   نوافذ المقالات، تاريخ اليوم، وإشعار «قيد التجهيز» للعناصر غير المربوطة بعد. */
(function () {
  'use strict';
  var root = document.documentElement;
  var home = document.getElementById('home');
  if (!home || !home.classList.contains('aqh')) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- ظهور تدريجي ---- */
  var items = [].slice.call(home.querySelectorAll('.aqh-reveal'));
  items.forEach(function (el) {
    var group = el.closest('.aqh-stagger');
    if (group) {
      var i = [].indexOf.call(group.querySelectorAll('.aqh-reveal'), el);
      el.style.setProperty('--aqh-d', (i * 90) + 'ms');
    }
  });
  if (!reduce && 'IntersectionObserver' in window) {
    root.classList.add('aqh-js');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
    /* شبكة أمان: لا يبقى شيء مخفيًا إن تعطل المراقب */
    setTimeout(function () { items.forEach(function (el) { el.classList.add('is-in'); }); }, 6000);
  }

  /* ---- قائمة «اكتشف ذاتك» ---- */
  var drop = document.querySelector('.aqh-drop');
  if (drop) {
    var btn = drop.querySelector('.aqh-drop-btn');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var on = drop.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    document.addEventListener('click', function () { drop.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { drop.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); } });
  }

  /* ---- تاريخ اليوم ---- */
  var t = document.getElementById('aqh-today');
  if (t) {
    var d = new Date();
    try { t.textContent = d.toLocaleDateString('ar-EG-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }
    catch (e) { t.textContent = d.toDateString(); }
    t.setAttribute('datetime', d.toISOString().slice(0, 10));
  }

  /* ---- نوافذ المقالات ---- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-open-article]');
    if (!b) return;
    var dlg = document.getElementById('aqh-article-' + b.getAttribute('data-open-article'));
    if (!dlg) return;
    e.preventDefault();
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  });
  [].forEach.call(document.querySelectorAll('.aqh-article-dialog'), function (dlg) {
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  });

  /* ---- عناصر لم تُربط بوظيفتها الحقيقية بعد (مكتبة الرموز: القسم مخفي في المشروع الحالي) ---- */
  var toast;
  function say(msg) {
    if (!toast) { toast = document.createElement('div'); toast.className = 'aqh-toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast); }
    toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(say._t); say._t = setTimeout(function () { toast.classList.remove('is-on'); }, 2600);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-soon]');
    if (!a) return;
    var target = document.querySelector(a.getAttribute('href'));
    if (target && !target.hidden && getComputedStyle(target).display !== 'none') return; /* القسم متاح: اتركه يعمل */
    e.preventDefault(); say(a.getAttribute('data-soon'));
  });
})();
