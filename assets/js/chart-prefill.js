/* تعبئة بيانات الميلاد المحفوظة تلقائيًا في نماذج الخرائط (الشخص الأول فقط)، وإزالة شريط "تعبئة تلقائية من حسابي"
   وأقسام "كيف تقرأ ..." من صفحات الخرائط. لا يغيّر أي حساب. */
(function () {
  'use strict';
  var G = [
    { form: 'mform', d: 'm-date', n: 'm-name', g: 'm-gender' },
    { form: 'lpform', d: 'lp-date', n: 'lp-name', g: 'lp-gender' },
    { form: 'synastry-form', d: 'syn-date-a', n: 'syn-name-a', g: 'syn-gender-a' },
    { form: 'mxc-form', d: 'mxc-d1', n: 'mxc-n1' },
    { form: 'sj-form', d: 'sj-date', n: 'sj-name', t: 'sj-time', u: 'sj-notime' },
    { form: 'kg-form', d: 'kg-date', n: 'kg-name', g: 'kg-gender', t: 'kg-time', u: 'kg-notime' },
    { form: 'zw-form', d: 'zw-date', n: 'zw-name', g: 'zw-gender', t: 'zw-time', u: 'zw-notime' }
  ];
  function el(id) { return id && document.getElementById(id); }
  function fire(e) { ['input', 'change'].forEach(function (t) { e.dispatchEvent(new Event(t, { bubbles: true })); }); }
  function p2(n) { return ('0' + n).slice(-2); }
  function fill(g) {
    var f = el(g.form), d = el(g.d), C = window.AqeeqChartContext;
    if (!f || !d || g.done || g.edited || d.value || !C || !C.getOrPrefill) return;
    var n; try { n = C.getOrPrefill(); } catch (e) { return; }
    if (!n || !n.y || !n.m || !n.d) return;
    g.done = true;
    d.value = n.y + '-' + p2(n.m) + '-' + p2(n.d); fire(d);
    var nm = el(g.n); if (nm && n.name && !nm.value) { nm.value = n.name; fire(nm); }
    var gd = el(g.g); if (gd && n.gender && !gd.value) { gd.value = n.gender; fire(gd); }
    var u = el(g.u), t = el(g.t);
    if (u) { u.checked = !n.known; fire(u); }
    if (t) { t.value = n.known ? p2(n.hh) + ':' + p2(n.mm) : ''; fire(t); }
    var c = el(g.c);
    if (c && n.placeName) {
      for (var i = 0; i < c.options.length; i++) {
        if (c.options[i].text.indexOf(n.placeName) > -1) { c.value = c.options[i].value; fire(c); break; }
      }
    }
  }
  function clean() {
    document.querySelectorAll('.aq-autofill-bar').forEach(function (b) { b.remove(); });
    document.querySelectorAll('.aq-mx-read,.y27-explain,#eam-explain').forEach(function (b) { b.remove(); });
    ['matrix','lifepath','lifepath-compat','matrix-compat','matrix-child','chart','astro-maps','year2027','karmic','compat','saju','kigaku','ziwei'].forEach(function (i) { var s = document.getElementById(i); if (s) s.querySelectorAll('.aq-related').forEach(function (b) { b.remove(); }); });
  }
  function run() { clean(); G.forEach(fill); }
  function start() {
    G.forEach(function (g) {
      var f = el(g.form); if (!f) return;
      f.addEventListener('input', function (e) { if (e.isTrusted) g.edited = true; }, true);
      f.addEventListener('change', function (e) { if (e.isTrusted) g.edited = true; }, true);
    });
    run();
    new MutationObserver(function () { clean(); }).observe(document.body, { childList: true, subtree: true });
    ['hashchange', 'aqeeq:natal-ready', 'aqeeq:profile-saved', 'aqeeq:cities-ready'].forEach(function (e) { window.addEventListener(e, run); document.addEventListener(e, run); });
    [400, 1200, 2500, 5000].forEach(function (ms) { setTimeout(run, ms); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
