/* استثمر في ذاتك: عرض فقط + توجيه لنفس مسار الشراء الحالي (زر #acct-buy وبوابة الدفع). لا منطق دفع هنا. */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var sec = $('#invest'); if (!sec) return;
  var buy = sec.querySelector('[data-invest-buy]');
  var WA = (typeof WA_URL !== 'undefined' && WA_URL) ? WA_URL : 'https://wa.me/message/BWFSU4ZT25WKA1';
  /* الكورسات من مصفوفة COURSES الموجودة في الموقع (لو فيها كورس نزل) */
  try {
    var list = (typeof COURSES !== 'undefined' && Array.isArray(COURSES)) ? COURSES.filter(function (c) { return c && c.title && !c.soon && c.link; }) : [];
    var body = $('#inv-courses-body'), notify = $('#inv-notify');
    if (list.length && body) {
      body.textContent = '';
      list.forEach(function (c) {
        var a = document.createElement('a'); a.className = 'inv-course'; a.href = c.link; a.target = '_blank'; a.rel = 'noopener noreferrer';
        var t = document.createElement('strong'); t.textContent = c.title; a.appendChild(t);
        if (c.desc) { var d = document.createElement('span'); d.textContent = c.desc; a.appendChild(d); }
        if (c.price) { var pr = document.createElement('em'); pr.textContent = c.price; a.appendChild(pr); }
        body.appendChild(a);
      });
      if (notify) notify.hidden = true;
    }
    if (notify) notify.href = WA + (WA.indexOf('?') > -1 ? '&' : '?') + 'text=' + encodeURIComponent('أريد أن أعرف عند نزول كورسات عقيق أسترو.');
  } catch (e) { /* العرض الافتراضي كافٍ */ }
  /* السعر: يُقرأ من جدول المنتجات إن كان متاحًا، وإلا لا يُعرض رقم */
  function price() {
    var sb = window.aqeeqSupabase, el = $('#inv-price'); if (!sb || !el) return;
    try {
      sb.from('products').select('amount_cents,currency').eq('code', 'full_report').maybeSingle().then(function (r) {
        var d = r && r.data; if (!d || !d.amount_cents) return;
        var cur = d.currency === 'EGP' ? 'ج.م' : d.currency;
        el.textContent = (d.amount_cents / 100) + ' ' + cur; el.hidden = false;
      }, function () {});
    } catch (e) { /* بدون سعر */ }
  }
  window.addEventListener('load', price);
  /* الشراء: يمر على الحساب (تسجيل الدخول + استكمال البيانات) ثم زر الشراء الحالي */
  if (buy) buy.addEventListener('click', function () {
    var sb = window.aqeeqSupabase;
    var go = function (signed) {
      location.hash = '#account';
      if (!signed) return;
      setTimeout(function () { var b = document.getElementById('acct-buy'); if (b && !b.disabled) b.click(); }, 350);
    };
    if (!sb || !sb.auth) return go(false);
    sb.auth.getSession().then(function (r) { go(!!(r && r.data && r.data.session)); }, function () { go(false); });
  });
})();
