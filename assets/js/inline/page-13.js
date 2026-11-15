
(function () {
  /* لا نسجل Service Worker؛ ملف sw.js غير موجود ضمن أصول المشروع الحالية. */
  /* مشاركة الموقع: Web Share لو متاح، وإلا نسخ الرابط */
  var sb = document.getElementById('share-site');
  if (sb) {
    var label = sb.querySelector('span'), orig = label.textContent;
    sb.addEventListener('click', function () {
      var url = location.href.split('#')[0];
      var d = document.querySelector('meta[name="description"]');
      var data = { title: document.title, text: d ? d.content : '', url: url };
      var done = function (msg) { label.textContent = msg; setTimeout(function () { label.textContent = orig; }, 2200); };
      if (navigator.share) { navigator.share(data).catch(function () {}); return; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { done('تم نسخ الرابط'); }, function () { done('انسخ الرابط من المتصفح'); });
      } else { done('انسخ الرابط من المتصفح'); }
    });
  }
  /* تثبيت التطبيق: الزر يظهر بس لما المتصفح يسمح */
  var ib = document.getElementById('install-app'), deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; if (ib) ib.hidden = false; });
  if (ib) ib.addEventListener('click', function () {
    if (!deferred) return;
    deferred.prompt();
    deferred.userChoice.then(function () { deferred = null; ib.hidden = true; });
  });
  window.addEventListener('appinstalled', function () { if (ib) ib.hidden = true; });
})();
