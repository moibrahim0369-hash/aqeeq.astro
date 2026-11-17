/* مسار الحياة وتوافق المسارات: طبقة عرض فقط — تحوّل أقسام النتائج إلى بطاقات أكورديون عاجية.
   لا تغيّر أي حساب ولا أي نص: تنقل العقد الموجودة داخل <details> وتضيف شريط رجوع. */
(function () {
  'use strict';
  var IC = {
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>'
  };
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function tone(title) { return /\(\+\)|النور|القوة|روشتة|الحل|نعمل إيه/.test(title) ? 'light' : /\(-\)|\(−\)|الظل|الصدام|الديون|فخ/.test(title) ? 'shadow' : ''; }
  function card(title, body, opt) {
    opt = opt || {};
    var d = document.createElement('details'); d.className = 'lpa-card' + (opt.tone ? ' is-' + opt.tone : ''); if (opt.open) d.open = true;
    var s = document.createElement('summary'); s.className = 'lpa-sum';
    s.innerHTML = '<span class="lpa-ic">' + (opt.tone === 'light' ? '+' : opt.tone === 'shadow' ? '−' : IC.star) + '</span><span class="lpa-t">' + esc(title) + '</span>' + (opt.sub ? '<small class="lpa-sub">' + esc(opt.sub) + '</small>' : '') + '<span class="lpa-chev">' + IC.chev + '</span>';
    var b = document.createElement('div'); b.className = 'lpa-body';
    [].concat(body).forEach(function (n) { if (n) b.appendChild(n); });
    d.appendChild(s); d.appendChild(b); return d;
  }
  function text(el) { return (el && el.textContent || '').replace(/\s+/g, ' ').trim(); }

  /* جدول الملخص (3 أعمدة ضيقة) ← بطاقات صفوف بعرض كامل */
  function tableToRows(tbl) {
    var heads = [].map.call(tbl.querySelectorAll('thead th'), text);
    var ul = document.createElement('div'); ul.className = 'lpa-rows';
    [].forEach.call(tbl.querySelectorAll('tbody tr'), function (tr) {
      var cells = [].map.call(tr.children, function (c) { return text(c); });
      var row = document.createElement('div'); row.className = 'lpa-row';
      row.innerHTML = '<b>' + esc(cells[0] || '') + '</b>' + cells.slice(1).map(function (c, i) { return '<p>' + (heads[i + 1] ? '<em>' + esc(heads[i + 1]) + '</em> ' : '') + esc(c) + '</p>'; }).join('');
      ul.appendChild(row);
    });
    return ul;
  }

  function navBar(root) {
    var host = root.querySelector('.lpj-top') || root;
    var n = document.createElement('div'); n.className = 'lpa-nav';
    n.innerHTML = '<button type="button" class="btn-edit-lp lpa-navbtn">' + IC.back + '<span>العودة لحاسبة مسار الحياة</span></button><a class="lpa-navbtn" href="#home">' + IC.back + '<span>الرئيسية</span></a>';
    host.insertBefore(n, host.firstChild);
  }

  function enhanceLP(root, force) {
    if (!root || root.querySelector('.lpa-nav') || !root.innerHTML.trim()) return;
    if (!force && !root.querySelector('.lpj-top')) { clearTimeout(enhanceLP._t); enhanceLP._t = setTimeout(function () { enhanceLP(root, true); }, 700); return; }
    navBar(root);
    /* الخريطة الأساسية: أربع ركائز */
    var grid = root.querySelector('.aq-lp-pillars-grid');
    if (grid) {
      var wrap = document.createElement('div'); wrap.className = 'lpa-stack';
      [].slice.call(grid.children).forEach(function (a, i) {
        var h = a.querySelector('h4'), t = text(h), p = h ? h.nextElementSibling : null;
        var body = document.createElement('div'); body.className = 'lpa-text'; body.innerHTML = p ? p.outerHTML : a.innerHTML;
        wrap.appendChild(card(t, body, { tone: tone(t), open: i === 0 }));
      });
      grid.replaceWith(wrap);
    }
    var cheat = root.querySelector('.aqm-cheat-sheet');
    if (cheat) { var tb = cheat.querySelector('table'), hh = cheat.querySelector('h4'); cheat.replaceWith(card(text(hh) || 'ملخص سريع', tb ? tableToRows(tb) : cheat.cloneNode(true))); }
    var proto = root.querySelector('.aqm-protocol-box');
    if (proto) { var ph = proto.querySelector('h4'), ol = proto.querySelector('ol'); proto.replaceWith(card(text(ph) || 'خريطة التحول العملي', ol ? ol : proto.cloneNode(true), { tone: 'light' })); }
    /* القمم والتحديات والديون الكارمية */
    var pc = root.querySelector('.aqeq-pc-wrap');
    if (pc) {
      var kids = [].slice.call(pc.children), cur = null, out = [];
      kids.forEach(function (k) {
        if (k.classList.contains('aqeq-pc-heading')) { cur = { t: text(k.querySelector('h3') || k), nodes: [] }; out.push(cur); }
        else if (cur && !k.classList.contains('aqeq-pc-note')) cur.nodes.push(k);
        else if (!cur) out.push({ keep: k });
        else out.push({ keep: k });
      });
      pc.innerHTML = '';
      pc.classList.add('lpa-stack');
      out.forEach(function (o, i) { pc.appendChild(o.keep ? o.keep : card(o.t, o.nodes, { tone: tone(o.t), open: i === 0 })); });
    }
    /* الفصول السبعة: details موجودة، نوحّد شكلها */
    var secs = [].slice.call(root.querySelectorAll('details.lp-section'));
    secs.forEach(function (d, i) {
      d.classList.add('lpa-card', 'lpa-native');
      /* شارة مجاني / قراءة متعمقة بدل الوسوم النصية في العنوان (عرض فقط) */
      var b = d.querySelector('.lp-sec-title b'), sm = d.querySelector('.lp-sec-title small');
      if (b && !b.querySelector('.lpa-badge')) {
        var t = b.textContent, free = /مجاني|متاح بالكامل/.test(t + ' ' + (sm ? sm.textContent : '')) && !/مدفوع/.test(t);
        b.textContent = t.replace(/\s*[—–-]\s*(مجاني|مدفوع[^\]]*)\s*$/, '').replace(/\s*\[[^\]]*\]\s*$/, '');
        var bd = document.createElement('span'); bd.className = 'lpa-badge ' + (free ? 'is-free' : 'is-deep');
        bd.innerHTML = free ? 'متاح مجاناً' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>قراءة متعمقة';
        b.appendChild(document.createTextNode(' ')); b.appendChild(bd);
      }
      d.open = i === 0;
    });
  }

  function watch(el, fn) {
    if (!el) return; var q = false;
    new MutationObserver(function () { if (q) return; q = true; requestAnimationFrame(function () { q = false; fn(el); }); }).observe(el, { childList: true, attributes: true, attributeFilter: ['hidden'] });
    fn(el);
  }
  function init() {
    watch(document.getElementById('lpresult'), enhanceLP);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
