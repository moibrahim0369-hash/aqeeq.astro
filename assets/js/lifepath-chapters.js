/* مسار الحياة: صفوف خفيفة بأيقونات زجاجية تفتح نافذة سفلية بدل الأكورديون الطويل.
   عرض فقط: يقرأ أقسام النتيجة الموجودة ولا يغيّر أي حساب أو نص. */
(function () {
  'use strict';
  var res = document.getElementById('lpresult');
  if (!res) return;
  var root = document.documentElement, sheet = null, list = [], cur = -1, busy = false;

  function sv(d, w) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.6) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var IC = {
    gem: sv('<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9 3l3 6 3-6M12 21 9 9M12 21l3-12"/>'),
    sun: sv('<circle cx="12" cy="12" r="4"/><path d="M12 3v2.500M12 18.500V21M3 12h2.500M18.500 12H21M5.600 5.600l1.800 1.800M16.600 16.600l1.800 1.800M5.600 18.400l1.800-1.800M16.600 7.400l1.800-1.800"/>'),
    moon: sv('<path d="M20 14.500A8 8 0 0 1 9.500 4a8 8 0 1 0 10.500 10.500z"/><path d="M17 3v3M15.500 4.500h3"/>'),
    body: sv('<circle cx="12" cy="5" r="2.500"/><path d="M5 10.500c2.500 1.200 4.500 1.700 7 1.700s4.500-.5 7-1.700M12 12.200V16M9 21l3-5 3 5"/>'),
    scale: sv('<path d="M12 3v18M7 21h10M5 7h14"/><path d="M5 7 2.500 13a3 3 0 0 0 5 0zM19 7l-2.500 6a3 3 0 0 0 5 0z"/>'),
    route: sv('<circle cx="6" cy="19" r="2.200"/><circle cx="18" cy="5" r="2.200"/><path d="M6 16.800V14a4 4 0 0 1 4-4h4a4 4 0 0 0 4-4V7.200"/>'),
    mirror: sv('<path d="M12 4v16"/><path d="M4 6.500c3-1.800 6-1.200 8 .8 2-2 5-2.600 8-.8v10c-3-1.800-6-1.200-8 .8-2-2-5-2.600-8-.8z"/>'),
    blocks: sv('<path d="M3.500 15.500h7v5h-7zM13.500 15.500h7v5h-7zM8.500 9.500h7v5h-7z"/><path d="M12 3v3.500M9.500 4.500 12 6.500l2.500-2"/>'),
    heart: sv('<path d="M12 20s-7.500-4.600-7.500-10.200A4.200 4.200 0 0 1 12 7.300a4.200 4.200 0 0 1 7.500 2.500C19.500 15.400 12 20 12 20z"/><path d="M7.500 12.500h2l1.200-2.200 1.800 4 1.200-1.800h2"/>'),
    coin: sv('<circle cx="12" cy="12" r="8.500"/><path d="M12 7v10M14.600 9.200c-.6-.8-1.500-1.200-2.600-1.200-1.500 0-2.600.8-2.600 2s1 1.700 2.600 2 2.600.8 2.600 2-1.100 2-2.600 2c-1.200 0-2.100-.5-2.700-1.300"/>'),
    sprout: sv('<path d="M12 21v-9.500"/><path d="M12 11.500c0-4 3-6.500 7.500-6.500 0 4-2.500 7-7.500 6.500zM12 14.500c0-3-2-5-6.500-5 0 3 2 5.500 6.500 5z"/>'),
    child: sv('<circle cx="12" cy="8.500" r="3.500"/><path d="M5 21c0-4 3-6.500 7-6.500s7 2.500 7 6.500"/><path d="M18.500 2.500l.7 1.800 1.800.7-1.800.7-.7 1.800-.7-1.800L16 5l1.800-.7z"/>'),
    core: sv('<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="4.500"/><path d="M12 3.500v2M12 18.500v2M3.500 12h2M18.500 12h2"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'),
    chev: sv('<path d="M15 6l-6 6 6 6"/>', 2),
    next: sv('<path d="M19 12H5M11 6l-6 6 6 6"/>', 2)
  };

  /* المفتاح: كلمات من العنوان؛ القيمة: [أيقونة، وصف قصير، لون] */
  var MAP = [
    [/المراية|القناع/, 'mirror', 'صورتك أمام الناس وما تخفيه عنهم', 2],
    [/البلوكات|التعطيل/, 'blocks', 'ما يعطّلك وكيف تتعامل معه', 4],
    [/العاطفي|الجواز|العلاقات/, 'heart', 'احتياجك في القرب والحب والشراكة', 1],
    [/المال|الوفرة|المهنة/, 'coin', 'علاقتك بالرزق والعمل والفرص', 3],
    [/روشتة|التشافي/, 'sprout', 'خطوات صغيرة تبدأ بها هذا الأسبوع', 2],
    [/الطفولة|الطفل|الأطفال/, 'child', 'جذور الطفولة وعلاقتك بأطفالك', 4],
    [/شفرة الروح/, 'core', 'هويتك العميقة وما جئت لتفعله', 1],
    [/الجوهر|الرسالة/, 'gem', 'هويتك العميقة ورسالتك الأساسية', 1],
    [/النور|القوة/, 'sun', 'مواهبك حين تكون متزنًا', 3],
    [/الجسدية|السوماتيك/, 'body', 'كيف يعبّر جسدك عن حالتك', 2],
    [/المقارنة|الاتزان/, 'scale', 'الفرق بين حالة الاتزان وحالة الضغط', 3],
    [/الظل|التحدي المتكرر/, 'moon', 'النمط الذي يتكرر حين تتعب', 4],
    [/التحول|الحلول|التحديات/, 'route', 'من التحدي إلى الخطوة العملية', 1]
  ];
  function meta(title) {
    for (var i = 0; i < MAP.length; i++) if (MAP[i][0].test(title)) return MAP[i];
    return [null, 'gem', 'افتح لتقرأ التفاصيل', 1];
  }

  function titleOf(d) {
    var b = d.querySelector('.lp-sec-title b, .lpa-t');
    if (!b) return '';
    var t = '';
    for (var n = b.firstChild; n; n = n.nextSibling) if (n.nodeType === 3) t += n.nodeValue;
    return t.replace(/\s+/g, ' ').replace(/\s*\((?:[A-Za-z][^)]*)\)\s*/g, ' ').trim();
  }
  function bodyOf(d) { return d.querySelector(':scope > .lp-sec-body, :scope > .lpa-body'); }

  function scan() {
    var cards = [].slice.call(res.querySelectorAll('.aq-lp-blueprint-summary details.lpa-card, .lp-sections details.lp-section'));
    var k = 0;
    cards.forEach(function (d) {
      var sm = d.querySelector(':scope > summary');
      if (!sm) return;
      if (!d.getAttribute('data-lpc')) {
        var t = titleOf(d), m = meta(t);
        d.setAttribute('data-lpc', '1'); d.open = false; d.classList.add('lpc-row');
        d.setAttribute('data-lpc-title', t); d.setAttribute('data-lpc-ic', m[1]); d.setAttribute('data-lpc-sub', m[2]); d.setAttribute('data-lpc-c', m[3]);
        sm.innerHTML = '<span class="lpc-ic c' + m[3] + '">' + IC[m[1]] + '</span><span class="lpc-tx"><b>' + esc(t) + '</b><small>' + esc(m[2]) + '</small></span><span class="lpc-go">' + IC.chev + '</span>';
        d.style.setProperty('--i', k);
      }
      k++;
    });
    list = cards.filter(function (d) { return d.getAttribute('data-lpc'); });
  }

  /* ---------- النافذة ---------- */
  function ensure() {
    if (sheet) return sheet;
    sheet = document.createElement('div'); sheet.className = 'aqm-sheet swp-sheet lpc-sheet'; sheet.hidden = true;
    sheet.innerHTML = '<div class="aqm-sheet-scrim" data-lpc-close></div>' +
      '<div class="aqm-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="lpc-title">' +
      '<span class="aqm-sheet-grip" aria-hidden="true"></span>' +
      '<button type="button" class="aqm-sheet-x" data-lpc-close aria-label="إغلاق"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="lpc-head"><span class="lpc-hic"></span><div><small class="lpc-count"></small><h3 id="lpc-title"></h3><p class="lpc-hsub"></p></div></div>' +
      '<div class="aqm-sheet-body lpc-body"></div>' +
      '<div class="aqm-sheet-foot"><button type="button" class="aqm-foot-close" data-lpc-close>إغلاق</button>' +
      '<button type="button" class="aqm-foot-next" data-lpc-next><span class="aqm-foot-l"><small>التالي</small><b></b></span>' + IC.next + '</button></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-lpc-close]')) { close(); return; }
      if (e.target.closest('[data-lpc-next]')) { show(cur + 1, true); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet && !sheet.hidden) close(); });
    return sheet;
  }

  /* تنسيق النص داخل النافذة: عناوين، أسئلة، بطاقات للنقاط — بدون تغيير الكلام */
  function decorate(body) {
    var ps = [].slice.call(body.querySelectorAll(':scope > p'));
    ps.forEach(function (p, idx) {
      var h = p.innerHTML, t = p.textContent.trim();
      if (!t) { p.remove(); return; }
      if (/^سؤال للتأمل/.test(t)) { p.className = 'lpc-reflect'; p.innerHTML = '<b>سؤال للتأمل</b><span>' + esc(t.replace(/^سؤال للتأمل\s*[:：]?\s*/, '')) + '</span>'; return; }
      if (/^تذكير\s*[:：]/.test(t)) { p.className = 'lpc-remind'; p.textContent = t.replace(/^تذكير\s*[:：]\s*/, ''); return; }
      if (/^\(?لمن مجموع|^\(لمن/.test(t)) { p.className = 'lpc-aside'; return; }
      if (h.indexOf('<br>') > -1 && /(^|<br>)\s*-\s/.test(h)) {
        var lines = h.split('<br>'), out = '', ul = '';
        lines.forEach(function (ln) {
          var d = /^\s*-\s+/.test(ln);
          if (d) ul += '<li>' + ln.replace(/^\s*-\s+/, '') + '</li>';
          else { if (ul) { out += '<ul>' + ul + '</ul>'; ul = ''; } if (ln.trim()) out += (ln.length < 130 && /[:：]\s*$/.test(ln.trim())) ? '<h4 class="lpc-h lpc-h2">' + ln.replace(/\s*[:：]\s*$/, '') + '</h4>' : '<p>' + ln + '</p>'; }
        });
        if (ul) out += '<ul>' + ul + '</ul>';
        p.outerHTML = out; return;
      }
      if (h.indexOf('<br>') > -1) {
        var parts = h.split('<br>'), first = parts.shift();
        var bullet = /^\s*[•\-]\s*/.test(first);
        if (idx === 0 && !bullet) {
          p.outerHTML = '<div class="lpc-lead"><b>' + first + '</b></div><p>' + parts.join(' ') + '</p>';
        } else if (bullet) {
          p.outerHTML = '<div class="lpc-pt"><b>' + first.replace(/^\s*[•\-]\s*/, '').replace(/\s*[:：]\s*$/, '') + '</b><p>' + parts.join('<br>') + '</p></div>';
        } else {
          p.outerHTML = '<h4 class="lpc-h">' + first.replace(/\s*[:：]\s*$/, '') + '</h4><p>' + parts.join('<br>') + '</p>';
        }
        return;
      }
      if (/^[•\-]\s*/.test(t) && t.length < 140 && /[:：]\s*$/.test(t)) { p.outerHTML = '<h4 class="lpc-h lpc-h2">' + p.innerHTML.replace(/^\s*[•\-]\s*/, '').replace(/\s*[:：]\s*$/, '') + '</h4>'; return; }
      if (t.length < 130 && /[:：]\s*$/.test(t)) { p.outerHTML = '<h4 class="lpc-h">' + p.innerHTML.replace(/\s*[:：]\s*$/, '') + '</h4>'; return; }
    });
    [].forEach.call(body.querySelectorAll('li'), function (li) {
      var m = li.innerHTML.match(/^([^:<]{2,38}):\s*([\s\S]*)$/);
      if (m && m[2]) li.innerHTML = '<b class="lpc-k">' + m[1] + '</b> ' + m[2];
    });
  }

  function fill(i) {
    var d = list[i]; if (!d) return false;
    var s = ensure(), b = bodyOf(d);
    var grp = d.closest('.lp-sections') ? list.filter(function (x) { return x.closest('.lp-sections'); }) : list.filter(function (x) { return !x.closest('.lp-sections'); });
    var gi = grp.indexOf(d) + 1;
    s.querySelector('.lpc-hic').className = 'lpc-hic lpc-ic c' + d.getAttribute('data-lpc-c');
    s.querySelector('.lpc-hic').innerHTML = IC[d.getAttribute('data-lpc-ic')];
    s.querySelector('.lpc-count').textContent = (d.closest('.lp-sections') ? 'الفصل ' : 'المحور ') + gi + ' من ' + grp.length;
    s.querySelector('#lpc-title').textContent = d.getAttribute('data-lpc-title');
    s.querySelector('.lpc-hsub').textContent = d.getAttribute('data-lpc-sub');
    var body = s.querySelector('.lpc-body'); body.innerHTML = b ? b.innerHTML : ''; body.scrollTop = 0;
    body.querySelectorAll('details').forEach(function (x) { x.open = true; });
    decorate(body);
    var nx = list[i + 1], btn = s.querySelector('[data-lpc-next]');
    btn.hidden = !nx; if (nx) btn.querySelector('b').textContent = nx.getAttribute('data-lpc-title');
    cur = i; return true;
  }
  function show(i, swap) {
    if (busy) return;
    var s = ensure();
    if (swap && !s.hidden) {
      busy = true; s.classList.add('is-swap');
      setTimeout(function () { fill(i); s.querySelector('.lpc-body').scrollTop = 0; s.classList.remove('is-swap'); busy = false; }, 160);
      return;
    }
    if (!fill(i)) return;
    s.classList.remove('is-closing'); s.hidden = false; root.classList.add('aqm-sheet-open');
    s.querySelector('.lpc-body').scrollTop = 0;
  }
  function close() {
    if (!sheet || sheet.hidden) return;
    var s = sheet; s.classList.add('is-closing');
    setTimeout(function () { s.hidden = true; s.classList.remove('is-closing'); root.classList.remove('aqm-sheet-open'); }, 230);
  }

  res.addEventListener('click', function (e) {
    var sm = e.target.closest('details.lpc-row > summary'); if (!sm) return;
    e.preventDefault();
    var d = sm.parentNode; scan(); var i = list.indexOf(d); if (i < 0) return;
    d.classList.add('is-tap'); setTimeout(function () { d.classList.remove('is-tap'); }, 220);
    show(i);
  }, true);

  var q;
  new MutationObserver(function () { clearTimeout(q); q = setTimeout(scan, 80); }).observe(res, { childList: true, subtree: true });
  scan();
})();
