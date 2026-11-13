/* الخريطة الفلكية — نتيجة الهاتف: عنوان الجاهزية، صفوف قابلة للضغط، نافذة سفلية للتفسير. عرض فقط. */
(function () {
  'use strict';
  var res = document.getElementById('result'), sec = document.getElementById('chart');
  if (!res || !sec) return;
  var root = document.documentElement, sheet = null, lastKey = '';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var PL = {
    'الشمس': 'جوهر الهوية والإرادة الواعية؛ ما تسعى إلى أن تكونه وتُعرَف به.',
    'القمر': 'عالمك العاطفي وحاجتك إلى الأمان؛ طريقتك في الشعور والاستجابة.',
    'عطارد': 'العقل واللغة؛ كيف تفكر وتتعلم وتنقل أفكارك إلى الآخرين.',
    'الزهرة': 'القيمة والحب والجمال؛ ما تنجذب إليه وكيف تحب وتُقدّر.',
    'المريخ': 'الدافع والطاقة والمبادرة؛ كيف تسعى إلى ما تريد وتدافع عن نفسك.',
    'المشتري': 'التوسع والمعنى والحظ الواعي؛ أين تنمو وتتفاءل وتبحث عن الحكمة.',
    'زحل': 'البنية والمسؤولية والحدود؛ الدروس التي تنضج بالصبر والانضباط.',
    'أورانوس': 'التجديد والاستقلال والتغيير المفاجئ؛ ما يدفعك إلى كسر المألوف.',
    'نبتون': 'الخيال والحدس والروحانية؛ ما يذيب الحدود ويحتاج إلى وضوح.',
    'بلوتو': 'التحول العميق والقوة الخفية؛ ما يُهدم ليُبنى من جديد.'
  };
  var AS = {
    'اتصال': ['دمج الطاقتين', 'تمتزج الطاقتان في نقطة واحدة فتتضاعف قوتهما، وقد تحتاج إلى وعي بحدّتهما معًا.'],
    'تثليث': ['اتصال متناغم', 'تتدفق الطاقتان بانسجام وسهولة، وتعطيان موهبة فطرية تحتاج إلى استخدام واعٍ.'],
    'سداسي': ['اتصال داعم', 'فرصة مفتوحة بين الطاقتين، تثمر حين تبادر إلى استثمارها.'],
    'تسديس': ['اتصال داعم', 'فرصة مفتوحة بين الطاقتين، تثمر حين تبادر إلى استثمارها.'],
    'تربيع': ['اتصال ضاغط', 'توتر محرّك بين الطاقتين يدفعك إلى الفعل والتطور عبر الاحتكاك الداخلي.'],
    'مقابلة': ['اتصال مواجهة', 'قطبان يطلبان التوازن؛ تتعلم عبرهما أن تجمع بين الجانبين بدل الاختيار بينهما.']
  };
  function sv(d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  var ICO = { planet: sv('<circle cx="12" cy="12" r="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-25 12 12)"/>'), asp: sv('<path d="M3 17l5-9 4 6 4-9 5 12"/>'), house: sv('<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>') };

  function ensureSheet() {
    if (sheet) return sheet;
    sheet = document.createElement('div'); sheet.className = 'aqm-sheet ndr-sheet'; sheet.hidden = true;
    sheet.innerHTML = '<div class="aqm-sheet-scrim" data-ndc></div><div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="ndr-t"><span class="aqm-sheet-grip"></span>' +
      '<button type="button" class="aqm-sheet-x" data-ndc aria-label="إغلاق"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="aqm-sheet-head"><span class="aqm-sheet-ic"></span><div><h3 id="ndr-t"></h3><p class="aqm-sheet-sub"></p></div></div><div class="aqm-sheet-body"></div>' +
      '<div class="aqm-sheet-foot"><button type="button" class="aqm-foot-close" data-ndc>إغلاق</button></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) { if (e.target.closest('[data-ndc]')) closeSheet(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet && !sheet.hidden) closeSheet(); });
    return sheet;
  }
  function closeSheet() { if (!sheet || sheet.hidden) return; sheet.classList.add('is-closing'); var s = sheet; setTimeout(function () { s.hidden = true; s.classList.remove('is-closing'); root.classList.remove('aqm-sheet-open'); }, 230); }
  function openSheet(ico, title, sub, html) {
    var s = ensureSheet();
    $('.aqm-sheet-ic', s).innerHTML = ico; $('#ndr-t', s).textContent = title; $('.aqm-sheet-sub', s).textContent = sub || '';
    var b = $('.aqm-sheet-body', s); b.innerHTML = html; b.scrollTop = 0;
    s.classList.remove('is-closing'); s.hidden = false; root.classList.add('aqm-sheet-open');
  }
  function fact(k, v) { return '<div class="ndr-fact"><small>' + esc(k) + '</small><b>' + v + '</b></div>'; }
  function pending(t) { return '<p class="ndr-soon">' + esc(t) + '</p>'; }

  function rowClick(row) {
    var panel = row.closest('[data-nd-panel]'), kind = panel ? panel.getAttribute('data-nd-panel') : '';
    var name = ($('b', row) || {}).textContent || '', mid = row.children[2] ? row.children[2].textContent.trim() : '', last = ($('.nd-rh', row) || {}).textContent || '';
    var g = $('.nd-rg', row);
    var t = row.querySelector('template.il-content'), extra = t ? t.innerHTML : '';
    if (row.classList.contains('il-row')) { openSheet(g ? g.innerHTML : ICO.planet, name, [mid, last].filter(Boolean).join(' · '), extra); return; }
    if (kind === 'aspects') {
      var a = AS[mid] || ['اتصال', 'علاقة زاوية بين الطاقتين.'];
      openSheet(g ? g.innerHTML : ICO.asp, name, mid + ' · ' + last,
        '<div class="ndr-facts">' + fact('نوع الاتصال', esc(mid)) + fact('الفارق', esc(last.replace('فارق', '').trim())) + '</div><h4>' + esc(a[0]) + '</h4><p>' + esc(a[1]) + '</p>' + (extra || pending('التفسير المفصل لاتصالك هذا قيد الإضافة.')));
    } else if (kind === 'houses') {
      openSheet(ICO.house, name, mid, '<div class="ndr-facts">' + fact('البيت', esc(name)) + fact('البرج', esc(mid)) + '</div>' + (extra || pending('تفسير هذا البيت قيد الإضافة.')));
    } else {
      var house = last && last !== '—' ? last : 'يظهر مع وقت الميلاد';
      openSheet(g ? '<span class="ndr-gl">' + g.innerHTML + '</span>' : ICO.planet, name, mid,
        '<div class="ndr-facts">' + fact('البرج والدرجة', esc(mid)) + fact('البيت', esc(house)) + '</div><h4>معنى ' + esc(name) + ' في خريطتك</h4><p>' + esc(PL[name] || 'أحد الأجرام الأساسية في خريطتك.') + '</p>' + pending('التفسير المفصل لموضع ' + name + ' هذا قيد الإضافة.'));
    }
  }
  document.addEventListener('click', function (e) {
    var row = e.target.closest && e.target.closest('#result .nd-list .nd-row'); if (!row) return;
    if (!row.querySelector('template.il-content') && !window.matchMedia('(max-width:820px)').matches) return;
    rowClick(row);
  });

  function prep() {
    var r = $('.nd-root', res);
    var on = !!r && !res.hidden;
    root.classList.toggle('ndr-on', on);
    if (!on) { lastKey = ''; return; }
    var h = $('.nd-title h3', r);
    if (h && !h.getAttribute('data-ndr')) { h.setAttribute('data-ndr', '1'); h.textContent = 'خريطتك الفلكية جاهزة'; }
    var p = $('.nd-title p', r); if (p && !p.getAttribute('data-ndr')) { p.setAttribute('data-ndr', '1'); p.textContent = 'اضغط على أي كوكب أو جانب لتعرف معناه'; }
    $$('.nd-list .nd-row', r).forEach(function (x) { if (!x.getAttribute('role')) { x.setAttribute('role', 'button'); x.setAttribute('tabindex', '0'); } });
    var key = ($('.nd-chips', r) || {}).textContent || '';
    if (key !== lastKey) { lastKey = key; sec.scrollTop = 0; closeSheet(); }
  }
  var q;
  new MutationObserver(function () { clearTimeout(q); q = setTimeout(prep, 60); }).observe(res, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  prep();
})();
