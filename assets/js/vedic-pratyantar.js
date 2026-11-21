/* براتيانتر داشا: تقسيم كل أنتر بالنسب نفسها، دون قصّ الفترة الأولى عند الميلاد.
   المرجع: BPHS، فصل حساب الداشا 51: 1-2، http://jyotishvidya.com/ch51.htm
   طول السنة المتبع في عقيق 365.25 يومًا. عرض الثواني لا يثبت دقة وقت الميلاد. */
(function () {
  'use strict';
  var V = window.AqVedic; if (!V) return;
  function pratyantars(antar) {
    if (!antar || !Number.isInteger(antar.lord) || antar.lord < 0 || antar.lord > 8 || !Number.isFinite(antar.s) || !Number.isFinite(antar.e) || antar.e <= antar.s) return [];
    var list = V.antars(antar);
    // يمنع فجوة حسابية دون المللي ثانية عند آخر حد بسبب الجمع العشري.
    list[list.length - 1].e = antar.e;
    return list;
  }
  function active(list, ms) {
    for (var i = 0; i < list.length; i++) if (ms >= list[i].s && ms < list[i].e) return i;
    return -1;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function createCard() {
    var L = V.last, box = document.createElement('section'); box.className = 'vpd';
    if (!L) { box.textContent = 'احسب خريطتك أولًا.'; return box; }
    var moon = (L.ch.bodies || []).filter(function (b) { return b.key === 'moon'; })[0];
    var birth = L.natal && Number.isFinite(L.natal.utcMs) ? L.natal.utcMs : (L.ch.jde - 2440587.5) * 864e5;
    if (!moon || !Number.isFinite(birth)) { box.textContent = 'تعذر حساب الفترات من بيانات الميلاد.'; return box; }
    var ds = V.dashas(moon.lon, birth), names = V.T.LORDS, mi = 0, ai = 0;
    var local = 'UTC'; try { local = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { }
    var zone = local;
    box.innerHTML = '<p class="vpd-lead">الفترة الكبرى، وداخلها الصغرى، ثم الفترات الدقيقة التسع. اختر أي فترة لتتصفح توقيتها كاملًا.</p>' +
      '<div class="vpd-controls"><label>الفترة الكبرى · ماها<select class="vpd-maha" aria-label="الفترة الكبرى"></select></label><label>الفترة الصغرى · أنتر<select class="vpd-antar" aria-label="الفترة الصغرى"></select></label></div>' +
      '<div class="vpd-toolbar"><label>التوقيت<select class="vpd-zone" aria-label="توقيت عرض الفترات"><option value="' + esc(local) + '">توقيت جهازك · ' + esc(local) + '</option>' + (local === 'UTC' ? '' : '<option value="UTC">UTC · التوقيت العالمي</option>') + '</select></label><button type="button" class="vpd-now">الفترة الحالية</button></div>' +
      '<div class="vpd-out" aria-live="polite"></div>' +
      '<p class="vpd-method">الحساب: مدة الأنتر × سنوات حاكم البراتيانتر ÷ 120. تبدأ الفترات بحاكم الأنتر ثم تتبع ترتيب فيمشوتاري. السنة هنا 365.25 يومًا.</p>' +
      '<p class="vpd-note">كل فترة تبدأ عند وقت البداية وتنتهي قبل وقت النهاية مباشرة. قد تبدأ الفترة الأولى قبل ميلادك لأن الرصيد المتبقي جزء من دورة بدأت قبله. عرض الساعة والثواني دقة حسابية، وليس ضمانًا لدقة وقت الميلاد أو تنبؤًا بحدث.</p>' +
      (L.ch.known ? '' : '<p class="vpd-warning">وقت الميلاد غير معروف: هذه توقيتات تقديرية مبنية على الوقت المفترض، وقد تتغير بمعرفة ساعة الميلاد.</p>');
    var msel = box.querySelector('.vpd-maha'), asel = box.querySelector('.vpd-antar'), out = box.querySelector('.vpd-out');
    function date(ms, short) {
      var opts = { timeZone: zone, year: 'numeric', month: 'short', day: 'numeric' };
      if (!short) { opts.hour = '2-digit'; opts.minute = '2-digit'; opts.second = '2-digit'; opts.hourCycle = 'h23'; }
      return new Intl.DateTimeFormat('ar-EG', opts).format(new Date(ms));
    }
    function stamp(ms) {
      var clock = new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(new Date(ms));
      return '<time datetime="' + new Date(ms).toISOString() + '"><span>' + date(ms, true) + '</span><small dir="ltr">' + clock + '</small></time>';
    }
    function option(x, i) { return '<option value="' + i + '">' + names[x.lord] + ' · ' + date(x.s, true) + '</option>'; }
    function populate() {
      msel.innerHTML = ds.map(option).join(''); msel.value = mi;
      asel.innerHTML = V.antars(ds[mi]).map(option).join(''); asel.value = ai;
    }
    function draw() {
      var m = ds[mi], a = V.antars(m)[ai], ps = pratyantars(a), now = Date.now();
      out.innerHTML = '<div class="vpd-path"><span>ماها <b>' + names[m.lord] + '</b></span><i aria-hidden="true">‹</i><span>أنتر <b>' + names[a.lord] + '</b></span><em>براتيانتر</em></div>' +
        '<div class="vpd-parent"><span>الكبرى المختارة</span><b>' + date(m.s) + '</b><span>حتى</span><b>' + date(m.e) + '</b></div>' +
        '<div class="vpd-parent"><span>الصغرى المختارة</span><b>' + date(a.s) + '</b><span>حتى</span><b>' + date(a.e) + '</b></div>' +
        '<ol class="vpd-list">' + ps.map(function (p, i) {
          var on = now >= p.s && now < p.e, days = (p.e - p.s) / 864e5;
          return '<li' + (on ? ' class="is-current"' : '') + '><div class="vpd-period-head"><span class="vpd-number">' + (i + 1) + '</span><h6>' + names[p.lord] + '</h6>' + (on ? '<em>الآن</em>' : '') + '<small>نحو ' + days.toLocaleString('ar-EG', { maximumFractionDigits: 1 }) + ' يوم</small></div><dl><div><dt>تبدأ</dt><dd>' + stamp(p.s) + '</dd></div><div><dt>تنتهي</dt><dd>' + stamp(p.e) + '</dd></div></dl></li>';
        }).join('') + '</ol><p class="vpd-zone-note">جميع المواعيد بتوقيت <b dir="ltr">' + esc(zone) + '</b>. نهاية الفترة هي بداية التالية.</p>';
    }
    function current() {
      var now = Date.now(), selected = active(ds, now), ref = selected >= 0 && now >= birth ? now : birth;
      mi = active(ds, ref); if (mi < 0) mi = 0;
      ai = active(V.antars(ds[mi]), ref); if (ai < 0) ai = 0;
      populate(); draw();
      if (selected < 0 || now < birth) out.insertAdjacentHTML('afterbegin', '<p class="vpd-warning">التاريخ الحالي خارج نطاق العمر المحسوب. نعرض الفترة التي تحتوي لحظة الميلاد، ويمكنك تصفح بقية الدورة.</p>');
    }
    msel.addEventListener('change', function () { mi = +msel.value; ai = 0; populate(); draw(); });
    asel.addEventListener('change', function () { ai = +asel.value; draw(); });
    box.querySelector('.vpd-zone').addEventListener('change', function (e) { zone = e.target.value; populate(); draw(); });
    box.querySelector('.vpd-now').addEventListener('click', current);
    current(); return box;
  }
  V.pratyantars = pratyantars;
  window.AqPratyantar = { createCard: createCard };
})();
