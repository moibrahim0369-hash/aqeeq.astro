/* طبقة عرض لصفحة الخريطة الفلكية: لا تحسب شيئًا ولا تغيّر المحرك.
   تقرأ DOM الناتج وحالة AqeeqChartContext فقط، وتضيف التنقل والملخص والروابط. */
(function () {
  'use strict';
  var root = document.getElementById('result'); if (!root) return;
  var PL = { sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ', jupiter: 'المشتري', saturn: 'زحل' };
  var lastOpener = null, lastPlanet = '';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function crumb() {
    var bar = root.querySelector('.result-top-bar'); if (!bar || bar.querySelector('.nv-crumb')) return;
    bar.innerHTML = '<nav aria-label="مسار التنقل"><ol class="nv-crumb"><li><a href="#home">الرئيسية</a></li><li><a href="#aqh-tools">اكتشف ذاتك</a></li><li aria-current="page">الخريطة الفلكية</li></ol></nav>';
  }

  function birth(S) {
    var card = root.querySelector('.chart-summary-card'); if (!card || root.querySelector('.nv-birth')) return;
    var ctx = (window.AqeeqChartContext && window.AqeeqChartContext.getNatal && window.AqeeqChartContext.getNatal()) || S || {};
    var rows = [];
    var pad = function (n) { return String(n).padStart(2, '0'); };
    if (ctx.y && ctx.m && ctx.d) rows.push(['تاريخ الميلاد', pad(ctx.d) + '/' + pad(ctx.m) + '/' + ctx.y]);
    if (ctx.known) rows.push(['وقت الميلاد', pad(ctx.hh) + ':' + pad(ctx.mm)]); else rows.push(['وقت الميلاد', 'غير معروف']);
    if (ctx.placeName) rows.push(['مكان الميلاد', ctx.placeName]);
    var note = ctx.known ? '' : '<p class="nv-warn">وقت الميلاد غير معروف، لذلك لا يمكن تحديد الطالع ولا البيوت بدقة. المواضع بالأبراج تبقى صحيحة تقريبًا.</p>';
    var d = document.createElement('details'); d.className = 'nv-birth';
    d.innerHTML = '<summary><span>بيانات الميلاد المستخدمة</span></summary><dl>' + rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>' + note +
      '<button type="button" class="nv-edit" data-nv-edit>تعديل بيانات الميلاد</button>';
    card.insertAdjacentElement('afterend', d);
    d.querySelector('[data-nv-edit]').addEventListener('click', function () { var b = document.getElementById('btn-edit-chart'); if (b) b.click(); });
  }

  function related(S) {
    var L = window.AqeeqContentLinks; if (!L || root.querySelector('.nv-related')) return;
    var ctx = (window.AqeeqChartContext && window.AqeeqChartContext.getNatal && window.AqeeqChartContext.getNatal()) || S || {};
    var bodies = (ctx.ch && ctx.ch.bodies) || [], seen = {}, items = [];
    function add(key, text) { var l = L.find(key); if (!l || seen[l.slug + l.kind]) return; seen[l.slug + l.kind] = 1; items.push({ l: l, text: text }); }
    ['sun', 'moon', 'venus', 'mars'].forEach(function (k) { add('planet-' + k, PL[k]); });
    bodies.forEach(function (b) { if (b.retro && PL[b.key] && b.key !== 'sun' && b.key !== 'moon') add('retrograde-' + b.key, PL[b.key] + ' متراجع في خريطتك'); });
    var h = '<section class="nv-related" aria-labelledby="nv-rel-h"><h3 id="nv-rel-h">اقرأ أكثر عن مواضعك</h3>';
    if (items.length) {
      h += '<ul>' + items.map(function (x) { return '<li><a href="' + L.hrefFrom(x.l, 'chart') + '"><b>' + esc(x.l.label) + '</b><small>' + (x.l.kind === 'exact' ? 'مقال عن ' + esc(x.text) : 'دليل عام') + '</small></a></li>'; }).join('') + '</ul>';
    }
    h += '<a class="nv-sky" href="#sky"><span>استكشف السماء الآن</span></a></section>';
    root.insertAdjacentHTML('beforeend', h);
  }

  /* لوحة التفاصيل كلوحة جانبية / ورقة سفلية */
  function sheet() {
    var p = document.getElementById('wd-panel'); if (!p || p._nv) return; p._nv = true;
    var ov = document.createElement('div'); ov.className = 'nv-ov'; ov.hidden = true; p.parentNode.insertBefore(ov, p);
    function open() {
      if (p.parentNode !== document.body) { document.body.appendChild(p); document.body.appendChild(ov); }
      p.classList.add('nv-sheet'); ov.hidden = false; document.documentElement.classList.add('nv-lock');
      if (!p.querySelector('.nv-x')) { var x = document.createElement('button'); x.type = 'button'; x.className = 'nv-x'; x.setAttribute('aria-label', 'إغلاق التفاصيل'); x.innerHTML = '&times;'; p.insertBefore(x, p.firstChild); x.addEventListener('click', close); }
      p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'تفاصيل الخريطة');
      addLink(p);
      var x2 = p.querySelector('.nv-x'); if (x2) x2.focus({ preventScroll: true });
    }
    function close() {
      p.hidden = true; p.classList.remove('nv-sheet'); ov.hidden = true; document.documentElement.classList.remove('nv-lock');
      if (lastOpener && document.contains(lastOpener)) lastOpener.focus({ preventScroll: true });
    }
    ov.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && p.classList.contains('nv-sheet') && !p.hidden) close(); });
    new MutationObserver(function () { if (!p.hidden) { if (!p.querySelector('.nv-x') || !p.classList.contains('nv-sheet')) open(); else addLink(p); } else { ov.hidden = true; p.classList.remove('nv-sheet'); document.documentElement.classList.remove('nv-lock'); } }).observe(p, { attributes: true, attributeFilter: ['hidden'], childList: true });
  }
  function addLink(p) {
    var L = window.AqeeqContentLinks; if (!L || !lastPlanet || p.querySelector('.nv-pl-link')) return;
    var ctx = window.AqeeqChartContext && window.AqeeqChartContext.getNatal && window.AqeeqChartContext.getNatal();
    var b = ctx && ctx.ch && ctx.ch.bodies.filter(function (x) { return x.key === lastPlanet; })[0];
    var l = b && b.retro ? L.find('retrograde-' + lastPlanet) : null; if (!l) l = L.find('planet-' + lastPlanet);
    if (!l) return;
    var a = document.createElement('a'); a.className = 'nv-pl-link'; a.href = L.hrefFrom(l, 'chart'); a.textContent = l.kind === 'exact' ? l.label : l.label;
    p.appendChild(a);
  }
  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-kind]'); if (!t) return; lastOpener = t;
    if (t.dataset.kind === 'planet') lastPlanet = t.dataset.k || lastPlanet;
    var p = document.getElementById('wd-panel'); if (p) { var old = p.querySelector('.nv-pl-link'); if (old) old.remove(); setTimeout(function () { if (!p.hidden) addLink(p); }, 0); }
  }, true);

  function apply(S) { try { document.querySelectorAll('body > #wd-panel, body > .nv-ov').forEach(function (n) { n.remove(); }); document.documentElement.classList.remove('nv-lock'); crumb(); birth(S); related(S); sheet(); } catch (e) { if (window.console) console.warn('natal-view', e); } }
  window.addEventListener('aqeeq:chart-rendered', function (e) { setTimeout(function () { apply(e.detail); }, 0); });
  if (root.querySelector('.wheel-wrap')) apply(null);
})();
