/* معاينة: كارت "سماء اليوم" الواحد بدل الكواكب والتبويبات.
   البيانات من Astro.chart نفسه (نفس مصدر قسم السماء الآن). لا نشر. */
(function () {
  'use strict';
  var EL = { 0: 'f', 1: 'e', 2: 'a', 3: 'w', 4: 'f', 5: 'e', 6: 'a', 7: 'w', 8: 'f', 9: 'e', 10: 'a', 11: 'w' };
  var MOON = {
    w: 'يفتح الحساسية عند الناس: مشاعر قديمة بترجع، وناس محتاجة حد يسأل عليها من غير سبب.',
    f: 'يسخّن ردود الأفعال: الناس مستعجلة، والكلمة بتطلع أسرع من التفكير.',
    e: 'يثبّت الأرض تحت الناس: يوم للفلوس والشغل والحاجات الملموسة، مش للكلام الكتير.',
    a: 'يزوّد الكلام والرسايل: أفكار كتير، ومكالمة ممكن تغيّر مزاج يوم كامل.'
  };
  var HOOK = { w: 'اللي يصبر شوية قبل ما يرد، يكسب النهارده.', f: 'اللي يهدّي أول ردة فعل، يوفّر على نفسه يوم.', e: 'اللي يخلّص حاجة واحدة مؤجلة، يحس إن الأرض ثابتة.', a: 'اللي يراجع رسالته قبل ما يبعتها، يتجنب سوء فهم.' };
  var ASP = [['conj', 0, 'اقتران'], ['sext', 60, 'تسديس'], ['square', 90, 'تربيع'], ['trine', 120, 'تثليث'], ['opp', 180, 'مقابلة']];
  var KEYS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  var IMG = 'assets/images/home/planets/';
  function gP() { return typeof PLANETS !== 'undefined' ? PLANETS : window.PLANETS; }
  function gS() { return typeof SIGNS !== 'undefined' ? SIGNS : window.SIGNS; }
  function list(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join('، ') + ' و' + a[a.length - 1]; }
  function aspects(c) {
    var bs = c.bodies.filter(function (x) { return KEYS.indexOf(x.key) >= 0; }), f = [];
    for (var i = 0; i < bs.length; i++) for (var j = i + 1; j < bs.length; j++) {
      var A = bs[i], B = bs[j], d = Math.abs(A.lon - B.lon) % 360, sep = d > 180 ? 360 - d : d;
      var lim = (A.key === 'sun' || A.key === 'moon' || B.key === 'sun' || B.key === 'moon') ? 8 : 6;
      for (var a = 0; a < ASP.length; a++) { var o = Math.abs(sep - ASP[a][1]); if (o <= lim) { f.push({ A: A.key, B: B.key, n: ASP[a][2], k: ASP[a][0], o: o }); break; } }
    }
    return f.sort(function (x, y) { return x.o - y.o; });
  }
  function build() {
    var c = window.Astro.chart({ utcMs: Date.now(), lat: 30, lon: 31, known: false }), P = gP(), S = gS();
    var b = function (k) { return c.bodies.find(function (x) { return x.key === k; }); };
    var m = b('moon'), el = EL[m.sign];
    var retro = KEYS.filter(function (k) { return k !== 'sun' && k !== 'moon' && b(k).retro; }).map(function (k) { return P[k].n; });
    var as = aspects(c), top = as[0];
    var t1 = 'القمر في ' + S[m.sign].n + ' ' + MOON[el] + (retro.length ? ' ومع تراجع ' + list(retro) + '، حاجات قديمة بترجع تطلب قرار: رسالة، علاقة، أو وعد مأجّل.' : '') + ' ' + HOOK[el];
    var t2 = '';
    if (top) {
      var cls = top.k === 'trine' || top.k === 'sext' ? 'sup' : (top.k === 'conj' ? 'neu' : 'ch');
      var nm = P[top.A].n + ' و' + P[top.B].n + ' في ' + top.n;
      t2 = cls === 'sup' ? nm + ' داعم: باب بيتفتح بسهولة لو مدّيت إيدك له.' : cls === 'ch' ? nm + ' بيحتك: موقف النهارده هيطلب منك قرار مش تأجيل.' : nm + ': موضوعين بيتلاقوا في نقطة واحدة ويتحسموا سوا.';
      t2 = 'القمر في ' + S[m.sign].n + ' والسما كلها بتقول: ' + t2 + ' ' + HOOK[el];
    }
    var t3 = 'القمر في ' + S[m.sign].n + ' ' + MOON[el].split(':')[0] + '. ' + HOOK[el];
    var v = (location.search.match(/skyv=([ABC])/) || [0, 'A'])[1];
    var txt = v === 'B' && t2 ? t2 : v === 'C' ? t3 : t1;
    var chips = ['<span class="aqsd-chip"><img src="' + IMG + 'planet-moon.png" alt="">القمر في ' + S[m.sign].n + '</span>'];
    if (retro.length) chips.push('<span class="aqsd-chip rx">' + retro.length + ' كواكب متراجعة</span>');
    if (top) chips.push('<span class="aqsd-chip">' + P[top.A].n + ' ' + top.n + ' ' + P[top.B].n + '</span>');
    window.AqSkyToday = { A: t1, B: t2, C: t3 };
    var sec = document.createElement('section');
    sec.className = 'aqsd aqh-wrap'; sec.id = 'aqsd';
    sec.innerHTML = '<div class="aqsd-top"><span class="aqsd-badge"><i></i>عرض مباشر لتأثير السماء</span></div>'
      + '<h2 class="aqsd-title">السماء الآن<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.6 8.4L22 12l-8.4 1.6L12 22l-1.6-8.4L2 12l8.4-1.6z"/></svg></h2>'
      + '<div class="aqsd-chips">' + chips.join('') + '</div>'
      + '<p class="aqsd-text">' + txt + '</p>'
      + '<a class="aqsd-cta" href="#sky"><span>اكتشف السماء كلها: الكواكب والقمر وأحداث الشهر</span></a>';
    return sec;
  }
  function init() {
    var old = document.getElementById('aqhc');
    if (!old) return setTimeout(init, 300);
    if (!window.Astro || !gP() || !gS()) return setTimeout(init, 300);
    if (document.getElementById('aqsd')) return;
    old.parentNode.insertBefore(build(), old);
    old.style.display = 'none';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
