/* شاشة الملف الشخصي: بطاقة الهوية تأخذ البريد وزر تعديل البيانات (نسخ من العناصر الموجودة، دون تغيير النصوص). */
(function () {
  'use strict';
  /* الإعدادات صارت جزءًا من شاشة الملف الشخصي: زر الترس يفتح الشاشة نفسها. */
  try { Object.defineProperty(window, '__ypMode', { configurable: true, get: function () { return 'profile'; }, set: function () {} }); } catch (e) {}
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var busy = false;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function run() {
    if (busy) return; busy = true;
    try {
      var yp = $('#fy-body .yp[data-ypm="profile"]'); if (!yp) return;
      var ORD = { 'حسابك': 1, 'التنبيهات': 2, 'الخصوصية': 3, 'بياناتك وخريطتك': 4, 'اكتب رأيك': 5, 'عن عقيق أسترو': 6 };
      [].forEach.call(yp.querySelectorAll('.yp-set-g'), function (g) { var l = $('.yp-lab', g); if (l) g.setAttribute('data-yr', ORD[l.textContent.trim()] || 5); });
      var so = $('.yp-set .yp-out', yp); if (so && !$('.yr-del', yp)) { var d = document.createElement('button'); d.type = 'button'; d.className = 'yr-del'; d.setAttribute('data-ym', 'delete'); d.textContent = 'حذف الحساب'; so.parentNode.appendChild(d); }
      var card = $('.yp-who-card', yp); if (!card || $('.yr-card-x', card)) return;
      var em = $('.yp-set-row b[dir="ltr"]', yp), email = em ? em.textContent.trim() : '';
      var ent = $('.yp-ed-entry b'), pb = $('#profile-edit-btn span'), label = (pb && pb.textContent.trim()) || (ent && ent.textContent.trim()) || 'تعديل البيانات الشخصية';
      var x = document.createElement('div'); x.className = 'yr-card-x';
      x.innerHTML = (email ? '<p class="yr-mail" dir="ltr">' + esc(email) + '</p>' : '') + '<button type="button" class="yr-edit">' + esc(label) + '</button>';
      card.appendChild(x);
    } finally { busy = false; }
  }
  /* قائمة صورة الحساب: الملف الشخصي، الحفظ، الإشعارات، الإعدادات، تسجيل الخروج. حذف الحساب انتقل إلى شاشة الملف. */
  var GO = [['sv', 'الحفظ', '.yp-ib[data-sv]']];
  function menu() {
    var m = $('#yp-menu'); if (!m || m.getAttribute('data-yr')) return; m.setAttribute('data-yr', '1');
    var del = $('[data-ym="delete"]', m); if (del) del.remove();
    var out = $('[data-signout]', m), proto = $('[data-ym="profile"]', m);
    GO.forEach(function (g) {
      var src = $(g[2]); var svg = src && $('svg', src);
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'menuitem'); b.className = 'yp-menu-i'; b.setAttribute('data-yr-go', g[0]);
      b.innerHTML = (svg ? svg.outerHTML : '') + '<span>' + g[1] + '</span>';
      if (out) m.insertBefore(b, out); else m.appendChild(b);
    });
  }
  new MutationObserver(function () { menu(); }).observe(document.body, { childList: true, subtree: true });
  document.addEventListener('click', function (e) {
    var g = e.target && e.target.closest && e.target.closest('[data-yr-go]'); if (!g) return;
    e.preventDefault(); e.stopPropagation();
    var k = g.getAttribute('data-yr-go'), src = null; GO.forEach(function (x) { if (x[0] === k) src = $(x[2]); });
    var m = $('#yp-menu'); if (m) m.remove(); var sc = $('#yp-menu-scrim'); if (sc) sc.remove();
    if (src) src.click();
  }, true);
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest && e.target.closest('.yr-edit'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var pe = $('#profile-edit-btn');
    if (pe && !pe.closest('[hidden]') && pe.offsetParent !== null) { pe.click(); return; }
    var en = $('.yp-ed-entry'); if (en) en.click();
  }, true);
  var host = document.getElementById('fy-body');
  if (host) new MutationObserver(function () { run(); }).observe(host, { childList: true, subtree: true });
  run();
})();
