/* شريط "تعبئة تلقائية من حسابي" موحّد لنماذج 2027 والذيل الكارمي والخرائط المتقدمة. شكل فقط، لا يغيّر الحساب. */
(function () {
  'use strict';
  var CFG = [
    { form: 'y27-form', date: 'y27-date', time: 'y27-time', unk: 'y27-unknown', city: 'y27-city', name: 'y27-name' },
    { form: 'kt-form', date: 'kt-date', name: 'kt-name' },
    { form: 'eam-form', click: 'eam-b-fill' },
    { form: 'cp-form', outside: true, date: 'cp1-date', time: 'cp1-time', unk: 'cp1-unknown', city: 'cp1-city', name: 'cp1-name' },
    { form: 'synastry-form', date: 'syn-date-a', name: 'syn-name-a' },
    { form: 'mxm-pair-form', date: 'mxm-d1', name: 'mxm-n1' },
    { form: 'mxc-form', date: 'mxc-d1', name: 'mxc-n1' }
  ];
  function ctx() { return window.AqeeqChartContext; }
  function fire(el) { ['input', 'change'].forEach(function (t) { el.dispatchEvent(new Event(t, { bubbles: true })); }); }
  function fill(c, note) {
    var n = ctx() && ctx().getOrPrefill && ctx().getOrPrefill();
    if (!n) { note.textContent = 'احفظ تاريخ ميلادك أولًا في «حسابي» أو اكتبه هنا.'; return; }
    var p = function (x) { return String(x).padStart(2, '0'); }, g = function (id) { return id && document.getElementById(id); };
    var d = g(c.date); if (d) { d.value = n.y + '-' + p(n.m) + '-' + p(n.d); fire(d); }
    var u = g(c.unk), t = g(c.time);
    if (u) { u.checked = !n.known; fire(u); }
    if (t) { t.value = n.known ? p(n.hh) + ':' + p(n.mm) : ''; fire(t); }
    var ct = g(c.city); if (ct && ctx().cityIndexByName) { var i = ctx().cityIndexByName(n.placeName); if (i >= 0) { ct.value = String(i); fire(ct); } }
    var nm = g(c.name); if (nm && n.name && !nm.value) nm.value = n.name;
    note.textContent = 'تمت التعبئة من بياناتك المحفوظة.';
  }
  function build() {
    CFG.forEach(function (c) {
      var f = document.getElementById(c.form); if (!f || f.querySelector('.aq-autofill-bar') || (f.previousElementSibling && f.previousElementSibling.classList.contains('aq-autofill-bar'))) return;
      var bar = document.createElement('div'); bar.className = 'aq-autofill-bar';
      bar.innerHTML = '<span>استخدام بيانات الميلاد المحفوظة في ملفك الشخصي<small class="aq-af-note" role="status"></small></span><button type="button" class="aq-autofill-btn">تعبئة تلقائية من حسابي</button>';
      var note = bar.querySelector('.aq-af-note');
      bar.querySelector('button').addEventListener('click', function () {
        if (c.click) { var b = document.getElementById(c.click); if (b) b.click(); } else fill(c, note);
      });
      if (c.outside) { bar.classList.add('aq-af-out'); f.parentNode.insertBefore(bar, f); } else f.insertBefore(bar, f.firstChild);
    });
  }
  window.AqAutofillBuild = build;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
