/* شاشة البداية لأول دخول (بدون بيانات ميلاد) + حساب وتخزين مسبق للخرائط كي تُفتح فورًا */
(function () {
  'use strict';
  var PK = 'aqeeq_profile_cache_v1', CK = 'aqeeq_precalc_v1', SK = 'aq-ob-skip';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var user = function () { return (window.AqSession && window.AqSession.user) || null; };
  var mine = function () { try { var n = window.AqeeqChartContext && window.AqeeqChartContext.getMine(); return n && n.ch ? n : null; } catch (e) { return null; } };

  /* ---------- حساب وتخزين مسبق ---------- */
  function precalc() {
    var n = mine(); if (!n) return null;
    var key = (localStorage.getItem(PK) || '') + '|' + Math.floor(Date.now() / 864e5);
    try { var c = JSON.parse(localStorage.getItem(CK) || 'null'); if (c && c.k === key) return c; } catch (e) {}
    var out = { k: key, tropical: { asc: n.ch.known ? n.ch.asc : null, bodies: n.ch.bodies.map(function (b) { return { k: b.key, l: +b.lon.toFixed(4), h: b.house || 0 }; }) } };
    try { out.vedic = window.AqeeqLive && window.AqeeqLive.vedic(n.ch); } catch (e) {}
    try {
      var ds = String(n.d).padStart(2, '0') + '.' + String(n.m).padStart(2, '0') + '.' + n.y;
      var AD = window.AqeeqMatrixMethodAdapter; if (AD) { var m = AD.calculateDestinyMatrix(ds); out.matrix = m && m.anchors ? m.anchors : null; }
    } catch (e) {}
    try { localStorage.setItem(CK, JSON.stringify(out)); } catch (e) {}
    return out;
  }
  function warm() {
    var run = function () { try { precalc(); if (window.AqeeqYouWarm) window.AqeeqYouWarm(); } catch (e) {} };
    (window.requestIdleCallback || function (f) { setTimeout(f, 200); })(run, { timeout: 1500 });
  }
  window.AqeeqPrecalc = { run: precalc, warm: warm };

  /* ---------- الشاشة ---------- */
  var cities = null;
  function loadCities() {
    if (cities) return cities;
    var tmp = document.createElement('select'); try { tmp.innerHTML = window.AqeeqChartContext.cityOptionsHTML(); } catch (e) {}
    cities = [].map.call(tmp.querySelectorAll('option'), function (o) { return { n: o.textContent.trim(), s: (o.dataset.search || o.textContent).toLocaleLowerCase('ar') }; }).filter(function (c) { return c.n; });
    return cities;
  }
  function box(id, ph, len, lab) { return '<label class="ob-bx"><span>' + lab + '</span><input id="' + id + '" inputmode="numeric" maxlength="' + len + '" placeholder="' + ph + '" autocomplete="off"></label>'; }
  function open() {
    if ($('#ob-screen')) return;
    var el = document.createElement('div'); el.id = 'ob-screen'; el.setAttribute('dir', 'rtl'); el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML = '<div class="ob-card"><button type="button" class="ob-skip" id="ob-skip">لاحقًا</button>' +
      '<span class="ob-k">خطوة واحدة</span><h2>لنكتب خريطتك أنت</h2><p class="ob-p">أدخل بيانات ميلادك مرة واحدة، وكل ما في صفحتك سيُحسب عليك أنت.</p>' +
      '<p class="ob-l">تاريخ الميلاد</p><div class="ob-row">' + box('ob-d', 'يوم', 2, 'اليوم') + box('ob-m', 'شهر', 2, 'الشهر') + box('ob-y', 'سنة', 4, 'السنة') + '</div>' +
      '<p class="ob-l">وقت الميلاد</p><div class="ob-row ob-t" id="ob-trow">' + box('ob-h', 'ساعة', 2, 'الساعة') + box('ob-i', 'دقيقة', 2, 'الدقيقة') + '</div>' +
      '<label class="ob-tg"><input type="checkbox" id="ob-unk"><i></i><span>لا أعرف وقت ميلادي بالضبط</span></label>' +
      '<p class="ob-l">مدينة الميلاد</p><div class="ob-pl"><input id="ob-c" placeholder="ابحث باسم المدينة أو الدولة" autocomplete="off"><div class="ob-sg" id="ob-sg" hidden></div></div>' +
      '<p class="ob-err" id="ob-err" role="alert"></p><button type="button" class="ob-go" id="ob-go">احسب خريطتي</button>' +
      '<p class="ob-n">بياناتك تُحفظ على جهازك لتحسب قراءتك، ويمكنك تعديلها أو مسحها من الإعدادات.</p></div>';
    document.body.appendChild(el); document.documentElement.classList.add('ob-open');
    var c = $('#ob-c', el), sg = $('#ob-sg', el), unk = $('#ob-unk', el), err = $('#ob-err', el);
    [].forEach.call(el.querySelectorAll('.ob-bx input'), function (i) { i.addEventListener('input', function () { i.value = i.value.replace(/\D/g, ''); var ml = +i.maxLength; if (i.value.length >= ml && i.nextElementSibling === null) { var nx = i.closest('.ob-bx').nextElementSibling; if (nx) nx.querySelector('input').focus(); } else if (i.value.length >= ml) { var nb = i.closest('.ob-bx').nextElementSibling; if (nb) nb.querySelector('input').focus(); } }); });
    unk.addEventListener('change', function () { $('#ob-trow', el).classList.toggle('off', unk.checked); });
    function suggest() {
      var q = c.value.trim().toLocaleLowerCase('ar'); if (q.length < 2) { sg.hidden = true; return; }
      var r = loadCities().filter(function (x) { return x.s.indexOf(q) >= 0; }).slice(0, 6);
      sg.innerHTML = r.map(function (x) { return '<button type="button" data-n="' + esc(x.n) + '">' + esc(x.n) + '</button>'; }).join(''); sg.hidden = !r.length;
    }
    c.addEventListener('input', function () { c.dataset.ok = ''; suggest(); });
    sg.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; c.value = b.dataset.n; c.dataset.ok = '1'; sg.hidden = true; });
    $('#ob-skip', el).addEventListener('click', function () { try { sessionStorage.setItem(SK, '1'); } catch (e) {} close(); });
    $('#ob-go', el).addEventListener('click', function () {
      var d = +$('#ob-d', el).value, m = +$('#ob-m', el).value, y = +$('#ob-y', el).value, h = $('#ob-h', el).value, mi = $('#ob-i', el).value, noT = unk.checked, city = c.value.trim();
      var dt = new Date(y, m - 1, d);
      if (!d || !m || !y || y < 1900 || y > 2100 || dt.getDate() !== d || dt.getMonth() !== m - 1) { err.textContent = 'تأكد من تاريخ الميلاد (يوم وشهر وسنة).'; return; }
      if (!noT && (h === '' || mi === '' || +h > 23 || +mi > 59)) { err.textContent = 'أدخل الساعة والدقيقة، أو اختر أنك لا تعرف الوقت.'; return; }
      var hit = loadCities().filter(function (x) { return x.n.toLocaleLowerCase('ar') === city.toLocaleLowerCase('ar'); })[0] || (c.dataset.ok ? { n: city } : null);
      if (!hit) { err.textContent = 'اختر مدينتك من الاقتراحات التي تظهر أثناء الكتابة.'; return; }
      var pad = function (x) { return String(x).padStart(2, '0'); }, u = user(), nm = (u && u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) || '';
      try { localStorage.setItem(PK, JSON.stringify({ name: nm, date: y + '-' + pad(m) + '-' + pad(d), time: noT ? '12:00' : pad(h) + ':' + pad(mi), noTime: noT, city: hit.n })); } catch (e) {}
      var btn = $('#ob-go', el); btn.disabled = true;
      var n = mine(); if (!n) { btn.disabled = false; err.textContent = 'تعذّر حساب الخريطة لهذه المدينة، جرّب مدينة أقرب.'; return; }
      try { localStorage.removeItem(CK); } catch (e) {} precalc();
      document.dispatchEvent(new Event('aqeeq:natal-ready')); document.dispatchEvent(new Event('aq:session'));
      close(); warm();
    });
    setTimeout(function () { $('#ob-d', el).focus(); }, 120);
  }
  function close() { var e = $('#ob-screen'); if (e) e.remove(); document.documentElement.classList.remove('ob-open'); }
  function check() {
    if (!user()) return;
    // The birth-data screen is manual-only. Signing in must never open it.
    // Keep cached-chart warming without changing stored birth data.
    if (mine()) warm();
  }
  document.addEventListener('aq:session', function () { setTimeout(check, 300); });
  window.addEventListener('load', function () { setTimeout(check, 900); });
  window.AqeeqOnboard = { open: open };
})();
document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('[data-ob]'); if (!a || !window.AqeeqOnboard) return; e.preventDefault(); try { sessionStorage.removeItem('aq-ob-skip'); } catch (x) {} window.AqeeqOnboard.open(); });
