/* واجهة نافذة الحساب فقط: نصوص وحالات عرض. لا تمسّ Supabase ولا منطق auth.js. */
(function () {
  var sec = document.getElementById('account'); if (!sec) return;
  var q = function (s) { return sec.querySelector(s); };
  var title = q('#acx-title'), sub = q('#acx-sub'), submit = q('#acct-submit'), forgot = q('#acct-forgot'), back = q('#acx-back'),
    form = q('#acct-form'), pass = q('#acct-pass'), swQ = q('#acx-switch-q'), swBtn = q('#acx-switch-btn');
  if (!title || !form) return;
  var reset = false;
  function mode() { var t = sec.querySelector('.acct-tabs button[aria-selected="true"]'); return t ? t.getAttribute('data-mode') : 'signin'; }
  function set(el, t) { if (el && el.textContent !== t) el.textContent = t; }
  function render() {
    var m = mode(), usr = q('#acct-user');
    sec.classList.toggle('acx-reset', reset);
    if (usr && !usr.hidden) { set(title, 'حسابي'); set(sub, 'بياناتك الشخصية وقراءاتك المحفوظة في مكان واحد.'); }
    else if (reset) { set(title, 'استعادة كلمة المرور'); set(sub, 'اكتب بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.'); set(forgot, 'إرسال رابط الاستعادة'); back.hidden = false; }
    else {
      back.hidden = true; set(forgot, 'نسيت كلمة المرور؟');
      if (m === 'signup') { set(title, 'إنشاء حساب جديد'); set(sub, 'ابدأ مساحتك الشخصية لحفظ قراءاتك وتقاريرك.'); set(swQ, 'لديك حساب بالفعل؟'); set(swBtn, 'تسجيل الدخول'); }
      else { set(title, 'مرحبًا بعودتك'); set(sub, 'مساحتك الشخصية لاكتشاف ذاتك وحفظ قراءاتك وتقاريرك.'); set(swQ, 'ليس لديك حساب؟'); set(swBtn, 'إنشاء حساب جديد'); }
    }
    if (submit && submit.textContent.trim() === 'دخول') set(submit, 'تسجيل الدخول');
  }
  var mo = new MutationObserver(render);
  var uEl = q('#acct-user'); if (uEl) mo.observe(uEl, { attributes: true, attributeFilter: ['hidden'] });
  [].forEach.call(sec.querySelectorAll('.acct-tabs button'), function (b) { mo.observe(b, { attributes: true, attributeFilter: ['aria-selected'] }); });
  if (submit) mo.observe(submit, { childList: true, characterData: true, subtree: true });
  /* نسيت كلمة المرور: أول ضغطة تفتح واجهة الاستعادة، الثانية تمر إلى المنطق الحالي */
  document.addEventListener('click', function (e) {
    var f = e.target.closest && e.target.closest('#acct-forgot'); if (!f || reset) return;
    e.preventDefault(); e.stopPropagation(); reset = true; render();
    var em = q('#acct-email'); if (em) em.focus();
  }, true);
  form.addEventListener('submit', function (e) { if (reset) { e.preventDefault(); e.stopImmediatePropagation(); forgot.click(); } }, true);
  back.addEventListener('click', function () { reset = false; render(); });
  swBtn.addEventListener('click', function () { reset = false; var b = sec.querySelector('.acct-tabs button[data-mode="' + (mode() === 'signup' ? 'signin' : 'signup') + '"]'); if (b) b.click(); render(); });
  /* إظهار/إخفاء كلمة المرور */
  if (pass && pass.parentNode) {
    var eye = document.createElement('button'); eye.type = 'button'; eye.className = 'acx-eye'; eye.setAttribute('aria-label', 'إظهار كلمة المرور'); eye.setAttribute('aria-pressed', 'false');
    eye.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.500-6.500 10-6.500S22 12 22 12s-3.500 6.500-10 6.500S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path class="acx-slash" d="M4 4l16 16"/></svg>';
    pass.parentNode.classList.add('acx-pw'); pass.parentNode.appendChild(eye);
    eye.addEventListener('click', function () { var show = pass.type === 'password'; pass.type = show ? 'text' : 'password'; eye.setAttribute('aria-pressed', String(show)); eye.setAttribute('aria-label', show ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'); });
  }
  /* Esc يغلق النافذة */
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && location.hash === '#account') location.hash = '#home'; });
  window.addEventListener('hashchange', function () { if (location.hash !== '#account' && reset) { reset = false; render(); } });
  render();
})();
