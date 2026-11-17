/* AQEQ ASTRO · Life Path core — الدالة المرجعية الوحيدة لمسار الحياة.
 * المنهج المقفل: جمع كل خانات اليوم والشهر والسنة، ثم الاختزال مع إبقاء 11 و22 و33 عند المجموع النهائي.
 * كل صفحات الموقع تستدعي هذه الدالة حتى يظهر الرقم نفسه في كل مكان. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.AqeqLifePathCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var MASTERS = [11, 22, 33];
  function digitSum(n) { return String(Math.abs(Math.trunc(Number(n)))).split('').reduce(function (s, c) { return s + (+c || 0); }, 0); }
  function reduceKeepMaster(n) {
    n = Math.abs(Math.trunc(Number(n)));
    while (n > 9 && MASTERS.indexOf(n) < 0) n = digitSum(n);
    return n;
  }
  function lifePath(d, m, y) { return reduceKeepMaster(digitSum(d) + digitSum(m) + digitSum(y)); }
  function fromISO(str) {
    var p = String(str || '').split('-').map(Number);
    if (p.length !== 3 || !p.every(Number.isFinite)) return null;
    return lifePath(p[2], p[1], p[0]);
  }
  return Object.freeze({ MASTERS: MASTERS, digitSum: digitSum, reduceKeepMaster: reduceKeepMaster, lifePath: lifePath, fromISO: fromISO });
});
