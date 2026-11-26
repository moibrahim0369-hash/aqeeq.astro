/* Article end: adds a "محتوى ذو صلة" section (similar articles + a related tool) under every article, popup and full page. */
(function () {
  'use strict';
  var SRC = 'assets/data/featured-content.json', DATA = null, pending = null;
  var TOOLS = [
    [/كارمي|karmic|العقدة|العقد القمرية|nodes|راهو|كيتو/i, '#karmic', 'اكتشف ذيلك الكارمي'],
    [/2027/, '#year2027', 'اكتشف ما تحمله لك 2027'],
    [/ساجو|saju|الأعمدة الأربعة|bazi/i, '#saju', 'احسب أعمدتك'],
    [/كي ?غاكو|kigaku|النجوم التسع/i, '#kigaku', 'احسب نجمك'],
    [/زي وي|ziwei|تسي ?ويي/i, '#ziwei', 'اعرض خريطتك'],
    [/مصفوفة|matrix/i, '#matrix', 'احسب مصفوفتك'],
    [/مسار الحياة|life.?path|رقم المسار/i, '#lifepath', 'اكتشف شفرة مسارك'],
    [/توافق|synastry|compat/i, '#compat', 'خريطة التوافق الفلكي'],
    [/عبور|transit|تراجع|retrograde|العودة الشمسية/i, '#astro-maps', 'العبور فوق خريطتك'],
    [/برج|كوكب|الطالع|خريطة الميلاد|natal|القمر|الشمس|زحل|المريخ|عطارد|الزهرة|المشتري|أورانوس|نبتون|بلوتو|كيرون/i, '#chart', 'احسب خريطة ميلادك']
  ];
  function load() {
    if (DATA) return Promise.resolve(DATA);
    return pending || (pending = fetch(SRC).then(function (r) { return r.json(); }).then(function (j) { DATA = j.articles || j; return DATA; }));
  }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  var ARR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
  function pickSimilar(a, all) {
    var seen = {}; seen[a.slug] = 1; var out = [];
    function add(x) { if (x && !seen[x.slug] && out.length < 2) { seen[x.slug] = 1; out.push(x); } }
    var by = {}; all.forEach(function (x) { by[x.slug] = x; });
    (a.related || []).forEach(function (s) { add(by[s]); });
    var kw = (a.keywords || []).map(String);
    all.filter(function (x) { return x.category === a.category && x.slug !== a.slug; })
      .map(function (x) { var s = 0; (x.keywords || []).forEach(function (k) { if (kw.indexOf(String(k)) > -1) s++; }); return [s, x]; })
      .sort(function (p, q) { return q[0] - p[0]; }).forEach(function (p) { add(p[1]); });
    return out;
  }
  function pickTool(a) {
    var hay = [a.title, a.slug, a.category, (a.keywords || []).join(' ')].join(' ');
    for (var i = 0; i < TOOLS.length; i++) if (TOOLS[i][0].test(hay)) return TOOLS[i];
    return null;
  }
  function build(a, all) {
    var sec = el('section', 'aq-rel'); sec.setAttribute('aria-label', 'محتوى ذو صلة');
    sec.appendChild(el('h2', 'aq-rel-h', 'محتوى ذو صلة'));
    var tool = pickTool(a);
    if (tool) {
      var t = el('a', 'aq-rel-item aq-rel-tool'); t.href = tool[1];
      var tx = el('span', 'aq-rel-t'); tx.appendChild(el('small', null, 'أداة ذات صلة')); tx.appendChild(el('b', null, tool[2]));
      t.appendChild(tx); var ic = el('span', 'aq-rel-ic'); ic.innerHTML = ARR; t.appendChild(ic); sec.appendChild(t);
    }
    pickSimilar(a, all).forEach(function (x) {
      var r = el('a', 'aq-rel-item'); r.href = '#featured-content/' + x.slug;
      var tx = el('span', 'aq-rel-t'); tx.appendChild(el('small', null, x.category)); tx.appendChild(el('b', null, x.title));
      r.appendChild(tx); var ic = el('span', 'aq-rel-ic'); ic.innerHTML = ARR; r.appendChild(ic); sec.appendChild(r);
    });
    return sec;
  }
  function enhance(root, slug) {
    var nx = root.querySelector('.fc-next'); if (!nx || !slug) return;
    var old = root.querySelector('.aq-rel'); if (old && old.getAttribute('data-slug') === slug) return; if (old) old.remove();
    load().then(function (all) {
      var a = all.filter(function (x) { return x.slug === slug; })[0]; if (!a) return;
      if (root.querySelector('.aq-rel') || !nx.isConnected) return;
      var s = build(a, all); s.setAttribute('data-slug', slug); nx.insertAdjacentElement('afterend', s);
    }).catch(function () { });
  }
  function scan() {
    var art = document.querySelector('#fc-reader-body .fc-art2[data-slug]');
    if (art) enhance(document.getElementById('fc-reader-body'), art.getAttribute('data-slug'));
    var pop = document.getElementById('fc-pop');
    if (pop) { var l = pop.querySelector('.fc-pop-full'); var m = l && /#featured-content\/([^?]+)/.exec(l.getAttribute('href') || ''); if (m) enhance(pop, decodeURIComponent(m[1])); }
  }
  var t = null;
  new MutationObserver(function () { clearTimeout(t); t = setTimeout(scan, 120); }).observe(document.body, { childList: true, subtree: true });
  scan();
})();
