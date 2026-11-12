/* صفحة نتيجة الخرائط المتقدمة: تفتح النتيجة وحدها (من غير النموذج)، وكل قسم أكورديون زجاجي بألوان النور والظل. */
(function () {
  'use strict';
  var sec = document.getElementById('astro-maps'), content = document.getElementById('eam-content'), result = null;
  if (!sec || !content) return;
  var IC = {
    wheel: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/><path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5"/>',
    table: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M4 10h16M10 10v9"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
    star: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
    event: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>'
  };
  function svg(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[k] || IC.star) + '</svg>'; }
  function pick(t) {
    if (/منزل|قمر/.test(t)) return ['moon', 'n'];
    if (/سنتك|قراءة|إرشاد/.test(t)) return ['sun', 'n'];
    if (/الفترات|فترة/.test(t)) return ['clock', 'g'];
    if (/اتصال/.test(t)) return ['link', 'g'];
    if (/محطات|الأحداث|كسوف/.test(t)) return ['event', 'g'];
    if (/جدول|كواكب|بيوت/.test(t)) return ['table', 'g'];
    if (/عجلة/.test(t)) return ['wheel', 'g'];
    return ['star', 'g'];
  }
  function acc(title, node, ic, tone, open) {
    var d = document.createElement('details'); d.className = 'eam-acc eam-t-' + tone; if (open) d.open = true;
    var s = document.createElement('summary');
    s.innerHTML = '<span class="eam-acc-ic">' + svg(ic) + '</span><span class="eam-acc-t">' + title + '</span><span class="eam-acc-ch" aria-hidden="true"></span>';
    var b = document.createElement('div'); b.className = 'eam-acc-body';
    node.parentNode && node.parentNode.insertBefore(d, node);
    b.appendChild(node); d.appendChild(s); d.appendChild(b);
    node.classList.add('eam-in-acc');
  }
  function toneAspects() {
    result.querySelectorAll('.eam-aspects li').forEach(function (li) {
      var t = li.textContent;
      li.classList.remove('eam-as-n', 'eam-as-s', 'eam-as-g');
      li.classList.add(/تثليث|تسديس/.test(t) ? 'eam-as-n' : /تربيع|مقابلة/.test(t) ? 'eam-as-s' : 'eam-as-g');
    });
  }
  function decorate() {
    result = content.querySelector('#eam-result');
    if (!result || result.hidden || !result.children.length) { sec.classList.remove('eam-view-result', 'eam-keep-ctl'); return; }
    if (result.__first === result.firstElementChild) return;
    result.__first = result.firstElementChild;
    var bar = content.querySelector('.eam-backbar');
    if (!bar) {
      bar = document.createElement('div'); bar.className = 'eam-backbar';
      bar.innerHTML = '<button type="button" class="eam-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg><span>تعديل البيانات أو اختيار خريطة أخرى</span></button>';
      content.insertBefore(bar, content.firstChild);
      bar.querySelector('button').addEventListener('click', function () {
        var r = content.querySelector('#eam-result'); if (r) { r.hidden = true; r.innerHTML = ''; r.__first = null; }
        sec.classList.remove('eam-view-result', 'eam-keep-ctl'); bar.remove();
        var st = document.getElementById('eam-status'); if (st) st.textContent = '';
        try { sec.scrollTo({ top: 0 }); } catch (e) { sec.scrollTop = 0; }
      });
    }
    var kids = Array.prototype.slice.call(result.children);
    kids.forEach(function (n) {
      if (n.classList.contains('eam-in-acc')) return;
      if (n.classList.contains('eam-wheel')) { acc('عجلة الخريطة', n, 'wheel', 'g', false); return; }
      if (n.classList.contains('eam-table-wrap')) { acc('جدول الكواكب', n, 'table', 'g', false); return; }
      if (n.classList.contains('eam-event-list')) { acc('الأحداث بالتفصيل', n, 'event', 'g', true); return; }
      if (n.classList.contains('vx-wrap') && !n.classList.contains('vx-top')) {
        Array.prototype.slice.call(n.querySelectorAll(':scope > section.eam-card')).forEach(function (c) {
          var h = c.querySelector('h4'), t = h ? h.textContent : 'تفاصيل'; if (h) h.remove();
          var p = pick(t); acc(t, c, p[0], p[1], false);
        });
        return;
      }
      if (n.matches('section.eam-card') && !n.classList.contains('vc-card') && n.querySelector('h4')) {
        var h = n.querySelector('h4'), t = h.textContent, p = pick(t); h.remove(); acc(t, n, p[0], p[1], false);
      }
    });
    toneAspects();
    sec.classList.toggle('eam-keep-ctl', !!content.querySelector('.eam-control #eam-year, .eam-control #eam-date'));
    sec.classList.add('eam-view-result');
    if (!result.__seen) { result.__seen = 1; try { sec.scrollTo({ top: 0 }); } catch (e) { sec.scrollTop = 0; } }
  }
  var timer = null;
  new MutationObserver(function () {
    clearTimeout(timer);
    timer = setTimeout(function () { try { decorate(); } catch (e) { console.warn(e); } }, 140);
  }).observe(content, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
})();
