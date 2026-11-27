/* الرئيسية: بانر زجاجي يبدّل الأبراج الـ12 كل 3 ثوانٍ. السطر = أول جملة من توقع اليوم الموجود (AqLive.SIGNDAY). الوسم والأسماء من نصوص الموقع الموجودة. */
(function () {
  'use strict';
  var NAMES = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var i = 0, box, timer;
  function first(t) { return String(t || '').split(/(?<=[.؟!۔])\s/)[0]; }
  function build() {
    var host = document.getElementById('aqh-energy'); if (!host || document.getElementById('hsb')) return !!document.getElementById('hsb');
    var L = window.AqLive; if (!L || !L.SIGNDAY || L.SIGNDAY.length < 12) return false;
    box = document.createElement('section'); box.id = 'hsb';
    box.innerHTML = '<div class="hsb-glass"><div class="hsb-tag"><i class="hsb-dot"></i><span>توقع يومك</span><b class="hsb-sign"></b></div><p class="hsb-line"></p><div class="hsb-dots">' + NAMES.map(function () { return '<i></i>'; }).join('') + '</div></div><a class="hsb-go" href="#signs">اعرف توقعات برجك</a>';
    host.parentNode.insertBefore(box, host); host.classList.add('hsb-hidden');
    show(0); timer = setInterval(function () { if (document.hidden) return; show((i + 1) % 12); }, 3000);
    return true;
  }
  function show(n) {
    i = n; var g = box.querySelector('.hsb-glass'); g.classList.add('is-out');
    setTimeout(function () {
      box.querySelector('.hsb-sign').textContent = NAMES[n];
      box.querySelector('.hsb-line').textContent = first(window.AqLive.SIGNDAY[n]);
      var d = box.querySelectorAll('.hsb-dots i'); for (var k = 0; k < d.length; k++) d[k].classList.toggle('on', k === n);
      g.classList.remove('is-out');
    }, 180);
  }
  function place() { var h = document.getElementById('aqh-energy'); if (h && box) { if (h.previousElementSibling !== box) h.parentNode.insertBefore(box, h); h.classList.add('hsb-hidden'); h.style.setProperty('display','none','important'); } }
  var pt = 0, pi = setInterval(function () { place(); if (++pt > 40) clearInterval(pi); }, 500);
  var tries = 0, w = setInterval(function () { if (build() || ++tries > 60) clearInterval(w); }, 400);
})();
