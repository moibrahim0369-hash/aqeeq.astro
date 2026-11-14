/* شاشة أيقونات الفلك الفيدي: بعد الحساب تظهر شبكة أيقونات، وكل أيقونة تفتح قسمها وحده بدون بقية الخرائط. */
(function () {
  'use strict';
  var sec = document.getElementById('astro-maps'), content = document.getElementById('eam-content');
  if (!sec || !content) return;
  var IC = {
    birth: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/><path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5"/>',
    vargas: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 4l16 16M20 4L4 20M12 4l8 8-8 8-8-8z"/>',
    moonsun: '<path d="M15 5.5A6.5 6.5 0 1 0 15 18.5 5 5 0 0 1 15 5.5z"/><circle cx="18" cy="8" r="2"/>',
    dasha: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
    sade: '<circle cx="12" cy="12" r="3.2"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-20 12 12)"/>',
    lunar: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    year: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>'
  };
  var TILES = [
    ['birth', 'خريطة الميلاد', 'العجلة والكواكب والاتصالات'],
    ['vargas', 'الخرائط المقسمة', 'من D1 إلى D60 بالرسمين'],
    ['moonsun', 'خريطتا القمر والشمس', 'مشاعرك وجوهرك'],
    ['dasha', 'الداشا', 'فتراتك الكبرى والصغرى'],
    ['sade', 'ساتي ساتي', 'أين زحل من قمرك الآن'],
    ['lunar', 'المنزل القمري', 'منزلك وحاكمه'],
    ['year', 'قراءة السنة', 'ما تعيشه الآن']
  ];
  function svg(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[k] + '</svg>'; }
  function groupOf(t) {
    if (/عجلة|جدول|اتصال/.test(t)) return 'birth';
    if (/منزل/.test(t)) return 'lunar';
    if (/سنتك|قراءة/.test(t)) return 'year';
    if (/فترة|الفترات/.test(t)) return 'dasha';
    return null;
  }
  function sadeCard(result) {
    var SS = window.AqVedic && window.AqVedic.T && window.AqVedic.T.SS, cur = '';
    result.querySelectorAll('.eam-acc-body p').forEach(function (p) { if (/ساتي ساتي/.test(p.textContent) && !cur) { cur = p.textContent; p.setAttribute('data-vh-sade', '1'); } });
    if (!cur) return null;
    var d = document.createElement('section'); d.className = 'vh-sade';
    var inside = SS && SS.indexOf(cur) >= 0;
    d.innerHTML = (inside ? '' : '<p class="vh-sade-now">' + cur.replace(/</g, '&lt;') + '</p>') + (SS ? '<h5>' + (inside ? 'المراحل الثلاث، وأنت الآن في المرحلة المظللة' : 'المراحل الثلاث') + '</h5>' : '') + (SS ? '<ol class="vh-steps">' + SS.map(function (t) { return '<li' + (t === cur ? ' class="on"' : '') + '>' + t.replace(/</g, '&lt;') + '</li>'; }).join('') + '</ol>' : '') +
      (inside ? '' : '');
    return d;
  }
  function build() {
    var result = content.querySelector('#eam-result');
    if (!result || result.hidden || !result.querySelector('#vx-vargas') || result.querySelector('.vh-grid')) return;
    /* الأكورديونات داخل .vx-wrap: نرفعها لمستوى النتيجة كي تُصنَّف مع أقسامها */
    Array.prototype.slice.call(result.querySelectorAll(':scope > .vx-wrap:not(.vx-top)')).forEach(function (w) {
      Array.prototype.slice.call(w.children).forEach(function (c) { result.insertBefore(c, w); });
      w.style.display = 'none'; w.dataset.vhG = 'misc';
    });
    var kids = Array.prototype.slice.call(result.children);
    kids.forEach(function (c) {
      if (c.classList.contains('eam-result-head')) c.dataset.vhG = 'hub birth';
      else if (c.classList.contains('vx-top')) c.dataset.vhG = 'vargas';
      else if (c.matches('details.eam-acc')) { var t = (c.querySelector('.eam-acc-t') || {}).textContent || ''; c.dataset.vhG = groupOf(t) || 'birth'; }
      else c.dataset.vhG = 'misc';
    });
    var sade = sadeCard(result);
    var grid = document.createElement('nav'); grid.className = 'vh-grid'; grid.dataset.vhG = 'hub'; grid.setAttribute('aria-label', 'أقسام الفلك الفيدي');
    grid.innerHTML = TILES.filter(function (t) { return t[0] !== 'sade' || sade; }).map(function (t) {
      return '<button type="button" class="vh-tile" data-g="' + t[0] + '"><span class="vh-ic">' + svg(t[0]) + '</span><span class="vh-t">' + t[1] + '</span><span class="vh-s">' + t[2] + '</span></button>';
    }).join('');
    var bar = document.createElement('div'); bar.className = 'vh-bar'; bar.dataset.vhG = 'vargas birth dasha sade lunar year';
    bar.innerHTML = '<button type="button" class="vh-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg><span>كل الأقسام</span></button><b class="vh-cur"></b>';
    var head = result.querySelector('.eam-result-head');
    result.insertBefore(grid, head ? head.nextSibling : result.firstChild);
    result.insertBefore(bar, grid);
    if (sade) { sade.dataset.vhG = 'sade'; result.appendChild(sade); }
    function show(g, chart) {
      result.dataset.vh = g;
      Array.prototype.slice.call(result.children).forEach(function (c) {
        var gs = (c.dataset.vhG || '').split(' ');
        c.style.display = (gs.indexOf(g) >= 0 || (g === 'moonsun' && gs.indexOf('vargas') >= 0)) ? '' : 'none';
      });
      var name = (TILES.filter(function (t) { return t[0] === g; })[0] || [])[1] || '';
      bar.querySelector('.vh-cur').textContent = g === 'hub' ? '' : name;
      if (g !== 'hub') {
        bar.style.display = '';
        var ds = result.querySelectorAll('details.eam-acc');
        var mine = Array.prototype.filter.call(ds, function (d) { return d.dataset.vhG === g; });
        if (mine.length === 1) mine[0].open = true;
      } else bar.style.display = 'none';
      if (g === 'moonsun') { var b = result.querySelector('.vc-chip[data-n="' + (chart || 'moon') + '"]'); if (b) b.click(); }
      if (g === 'vargas') { var o = result.querySelector('.vc-chip[data-n="1"]'); if (o && !result.querySelector('.vc-chip.on')) o.click(); }
      if (!first) try { result.scrollIntoView({ block: 'start' }); } catch (e) { }
      first = false;
    }
    var first = true;
    grid.addEventListener('click', function (e) { var b = e.target.closest('.vh-tile'); if (b) show(b.dataset.g); });
    bar.querySelector('.vh-back').addEventListener('click', function () { show('hub'); });
    show('hub');
    sec.classList.add('vh-on');
  }
  var timer = null;
  new MutationObserver(function () { clearTimeout(timer); timer = setTimeout(function () { try { build(); prefill(); } catch (e) { console.warn(e); } }, 320); })
    .observe(content, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  var filled = false;
  function prefill() {
    if (filled) return;
    var d = document.getElementById('eam-b-date'), f = document.getElementById('eam-b-fill'), C = window.AqeeqChartContext;
    if (!d || !f || d.value || !C || !C.getOrPrefill) return;
    var n = null; try { n = C.getOrPrefill(); } catch (e) { }
    if (!n) return;
    filled = true; f.click();
  }
  window.addEventListener('hashchange', function () { if (location.hash === '#astro-maps') setTimeout(prefill, 400); });
  document.addEventListener('DOMContentLoaded', function () { setTimeout(prefill, 1500); });
  setTimeout(prefill, 2500);
})();
