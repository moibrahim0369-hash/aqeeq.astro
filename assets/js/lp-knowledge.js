/* زر «احسب مسار حياتك الآن» في قسم التعريف: يرجّع المستخدم لأعلى الحاسبة ويركّز على أول حقل. عرض فقط. */
(function () {
  'use strict';
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-lp-cta]'); if (!a) return;
    e.preventDefault();
    var sec = document.getElementById('lifepath'); if (!sec) return;
    var edit = sec.querySelector('#lpresult .btn-edit-lp'), res = sec.querySelector('#lpresult');
    if (edit && res && !res.hidden && res.offsetParent !== null) edit.click();
    sec.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(function () { var f = sec.querySelector('#lp-name'); if (f && f.offsetParent) f.focus({ preventScroll: true }); }, 450);
  });
})();
/* مصفوفة القدر: زر قسم التعريف يرجّع لأعلى الفورم ويركّز على الاسم. عرض فقط. */
(function () {
  'use strict';
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-mx-cta]'); if (!a) return;
    e.preventDefault();
    var sec = document.getElementById('matrix'); if (!sec) return;
    sec.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(function () { var f = sec.querySelector('#m-name'); if (f && f.offsetParent) f.focus({ preventScroll: true }); }, 450);
  });
})();
/* الخريطة الفلكية: زر قسم التعريف يرجّع لأعلى الفورم ويركّز على الاسم. عرض فقط. */
(function () {
  'use strict';
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-ch-cta]'); if (!a) return;
    e.preventDefault();
    var sec = document.getElementById('chart'); if (!sec) return;
    sec.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(function () { var f = sec.querySelector('#f-name'); if (f && f.offsetParent) f.focus({ preventScroll: true }); }, 450);
  });
})();
