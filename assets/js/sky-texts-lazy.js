/* تحميل نصوص السماء والأبراج عند الطلب بدل تحميلها مع كل فتحة للتطبيق (نحو 1.3 ميغابايت خام).
   الملفان معرّفان في index.src.html كوسوم <meta name="aq-lazy"> بإصدارهما (لا تُجلب قبل أن نطلبها)، ويُحقنان هنا بنفس الترتيب القديم.
   متى يُحمَّلان: (1) فور دخول #sky أو #signs أو فتح ورقة التوقعات، (2) وإلا وقت الخمول بعد اكتمال الصفحة.
   عند الوصول يُطلق الحدث aq:sky-texts وتعيد الصفحات المفتوحة رسم النص. */
(function () {
  'use strict';
  var links = [].slice.call(document.querySelectorAll('meta[name="aq-lazy"]'));
  var p = null, stale = false;
  function rerenderSigns() { stale = false; try { if (window.__aqSignsRerender) window.__aqSignsRerender(); } catch (e) { } }
  function ready() { return !!(window.AqReadings && window.AqLive); }
  function inject(href) {
    return new Promise(function (res) {
      var s = document.createElement('script'); s.src = href; s.async = false;
      s.onload = function () { res(true); }; s.onerror = function () { res(false); };
      document.head.appendChild(s);
    });
  }
  function load() {
    if (ready()) return Promise.resolve(true);
    if (p) return p;
    p = Promise.all(links.map(function (l) { return inject(l.getAttribute('content')); })).then(function () {
      p = null;
      if (!ready()) return false;
      try { document.dispatchEvent(new CustomEvent('aq:sky-texts')); } catch (e) { }
      /* رسم #signs يحسب تواريخ الدخول بين الأبراج (ثقيل): لا نرسمه إلا إن كانت الصفحة مفتوحة، وإلا يُرسم عند دخولها */
      if (/^#signs\b/.test(location.hash)) rerenderSigns(); else stale = true;
      return true;
    });
    return p;
  }
  window.AqSkyTexts = { load: load, ready: ready };
  function route() {
    if (/^#(sky|signs|world)\b/.test(location.hash)) load();
    if (stale && ready() && /^#signs\b/.test(location.hash)) setTimeout(rerenderSigns, 0);
  }
  window.addEventListener('hashchange', route);
  function idle() {
    var go = function () { load(); };
    if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 5000 }); else setTimeout(go, 3000);
  }
  route();
  if (document.readyState === 'complete') idle(); else window.addEventListener('load', function () { setTimeout(idle, 800); });
})();
