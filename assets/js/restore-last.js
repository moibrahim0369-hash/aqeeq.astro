/* استعادة آخر نتيجة: يحفظ مدخلات آخر حساب ناجح في الخريطة الفلكية والمصفوفة ومسار الحياة على هذا الجهاز،
   وعند فتح أي منها من جديد يملأ الحقول ويعيد الحساب تلقائيًا بدل أن يبدأ المستخدم من صفحة فارغة.
   لا يغيّر منطق الحساب: يستخدم نفس النموذج ونفس زر الإرسال. يمسح مع بقية البيانات المحلية عند تسجيل الخروج. */
(function () {
  'use strict';
  var KEY = 'aq-last-calc-v1';
  var CFG = {
    chart: { hash: '#chart', form: 'cform', result: 'result', fields: ['f-name', 'f-gender', 'f-date', 'f-time', 'f-unknown', 'f-city', 'f-lat', 'f-lon', 'f-off', 'f-zodiac-sys', 'f-hs'], required: ['f-date', 'f-city'] },
    matrix: { hash: '#matrix', form: 'mform', result: 'mresult', fields: ['m-name', 'm-gender', 'm-date'], required: ['m-date'] },
    lifepath: { hash: '#lifepath', form: 'lpform', result: 'lpresult', fields: ['lp-name', 'lp-gender', 'lp-date'], required: ['lp-date'] }
  };
  var done = {}, pending = {};

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function store(k, v) { try { var s = load(); s[k] = v; localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { } }
  function el(id) { return document.getElementById(id); }
  function snap(c) {
    var o = {};
    c.fields.forEach(function (id) { var e = el(id); if (!e) return; o[id] = e.type === 'checkbox' ? !!e.checked : e.value; });
    return o;
  }
  function shown(c) { var r = el(c.result); return !!r && !r.hidden && r.innerHTML.trim().length > 0; }

  function watch(k) {
    var c = CFG[k], form = el(c.form), res = el(c.result);
    if (!form || !res || form.__aqRestoreWatch) return; form.__aqRestoreWatch = true;
    form.addEventListener('submit', function () {
      var s = snap(c);
      if (!c.required.every(function (id) { return s[id]; })) return;
      pending[k] = s;
      var tries = 0, t = setInterval(function () {
        tries++;
        if (shown(c)) { clearInterval(t); if (pending[k]) { store(k, pending[k]); pending[k] = null; } }
        else if (tries > 40) { clearInterval(t); pending[k] = null; }
      }, 250);
    }, true);
  }

  function fill(c, s) {
    c.fields.forEach(function (id) {
      var e = el(id); if (!e || !(id in s)) return;
      if (e.type === 'checkbox') { e.checked = !!s[id]; }
      else if (e.tagName === 'SELECT') {
        var has = [].some.call(e.options, function (o) { return o.value === s[id]; });
        if (!has) return; e.value = s[id];
      } else e.value = s[id];
      e.dispatchEvent(new Event('input', { bubbles: true }));
      e.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  function tryRestore(k) {
    var c = CFG[k]; if (done[k] || location.hash !== c.hash) return;
    var form = el(c.form); if (!form) return;
    var saved = load()[k]; if (!saved) { done[k] = true; return; }
    if (shown(c)) { done[k] = true; return; }
    var dateEl = el(c.required[0]);
    if (dateEl && dateEl.value) { done[k] = true; return; } /* بدأ يكتب بنفسه: لا نتدخل */
    done[k] = true;
    fill(c, saved);
    setTimeout(function () {
      if (!c.required.every(function (id) { var e = el(id); return e && e.value; })) return;
      try { form.requestSubmit(); } catch (e) { }
    }, 250);
  }

  function boot() {
    Object.keys(CFG).forEach(watch);
    var run = function (d) { setTimeout(function () { Object.keys(CFG).forEach(tryRestore); }, d); };
    run(900);
    window.addEventListener('hashchange', function () { run(250); });
  }
  if (document.readyState === 'complete') boot(); else window.addEventListener('load', boot);
  window.AqRestoreLast = { clear: function () { try { localStorage.removeItem(KEY); } catch (e) { } } };
})();
