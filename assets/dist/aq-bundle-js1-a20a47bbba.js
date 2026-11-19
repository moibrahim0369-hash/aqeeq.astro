/* assets/js/aqeeq-lifepath-core.js */
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

;
/* assets/js/inline/page-01.js */
/* أداء: ملفات JSON الكبيرة تُجلب مرة واحدة، وملف التاروت (2.8MB) لا يُجلب إلا عند فتح التاروت */
(function(){var f=window.fetch;if(!f)return;var memo={};
function tarotOpen(){if(/tarot|consult/i.test(location.hash))return true;var a=document.getElementById('consultCardsArena');return !!(a&&a.offsetParent)}
function gate(){return new Promise(function(res){if(tarotOpen())return res();var t=setInterval(function(){if(tarotOpen()){clearInterval(t);res()}},500);window.addEventListener('hashchange',function(){if(tarotOpen()){clearInterval(t);res()}})})}
window.fetch=function(u,o){var url=typeof u==='string'?u:(u&&u.url)||'';var m=/featured-content\.json(\?|$)/.test(url)?'fc':/tarot-library\.json(\?|$)/.test(url)?'tl':null;if(!m)return f.apply(this,arguments);var args=arguments,self=this;
if(!memo[m])memo[m]=(m==='tl'?gate():Promise.resolve()).then(function(){return f.apply(self,args)});
return memo[m].then(function(r){return r.clone()})}})();
;
/* assets/js/inline/page-02.js */
/* وسم المسار الحالي لتنسيق شكل التطبيق على الموبايل */
(function(){function r(){var h=(location.hash||'#home').replace('#','').split(/[/?]/)[0]||'home';document.documentElement.setAttribute('data-aqr',h)}r();window.addEventListener('hashchange',r)})();