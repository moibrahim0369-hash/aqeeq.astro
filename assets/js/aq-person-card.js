/* بطاقة بيانات الشخص الموحدة (عنابية) أعلى نتيجة الخرائط: تحل محل شريط رجوع/الرئيسية. */
(function () {
  'use strict';
  var IC = {
    edit: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    pin: '<path d="M12 21s7-6 7-11.5A7 7 0 0 0 5 9.5C5 15 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-5.5 7-5.5s6 1.5 7 5.5"/>'
  };
  function ic(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[k] + '</svg>'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function val(id) { var e = document.getElementById(id); if (!e) return ''; if (e.tagName === 'SELECT') { var o = e.options[e.selectedIndex]; return o ? o.text.trim() : ''; } return (e.value || '').trim(); }
  function build(kicker, title, pills, onEdit) {
    var d = document.createElement('div'); d.className = 'aq-pcard';
    d.innerHTML = '<span class="aq-pc-k">' + esc(kicker) + '</span><h2>' + esc(title) + '</h2><div class="aq-pc-pills">' +
      pills.filter(function (p) { return p[1]; }).map(function (p) { return '<span class="aq-pc-pill">' + ic(p[0]) + '<span>' + esc(p[1]) + '</span></span>'; }).join('') +
      '</div><div class="aq-pc-act"><button type="button" class="aq-pc-btn">' + ic('edit') + '<span>تعديل البيانات</span></button></div>';
    d.querySelector('button').addEventListener('click', onEdit);
    return d;
  }
  function natal() {
    var sec = document.getElementById('chart'); if (!sec) return;
    var root = sec.querySelector('.nd-root:not(.pd-root)'), old = sec.querySelector('.aq-pcard');
    if (!root) { if (old) old.remove(); sec.classList.remove('aq-has-pcard'); return; }
    var chips = {}; root.querySelectorAll('.nd-chip').forEach(function (c) { var s = c.querySelector('small'), b = c.querySelector('b'); if (s && b) chips[s.textContent.trim()] = b.textContent.trim(); });
    var nm = val('f-name'), title = nm ? 'خريطة ' + nm : 'خريطة الولادة';
    var sig = title + '|' + JSON.stringify(chips);
    if (old && old.getAttribute('data-sig') === sig) return;
    if (old) old.remove();
    var card = build('خريطة الميلاد', title, [['cal', chips['تاريخ الميلاد']], ['clock', chips['وقت الميلاد']], ['pin', chips['مكان الميلاد']]], function () { var b = sec.querySelector('.btn-edit-chart'); if (b) b.click(); });
    card.setAttribute('data-sig', sig);
    var anchor = sec.querySelector('.ntx-wrap') || root; anchor.parentNode.insertBefore(card, anchor);
    sec.classList.add('aq-has-pcard');
  }
  function vedic() {
    var sec = document.getElementById('astro-maps'), r = document.getElementById('eam-result'); if (!sec) return;
    var old = sec.querySelector('.aq-pcard'), show = r && !r.hidden && r.children.length;
    if (!show) { if (old) old.remove(); sec.classList.remove('aq-has-pcard'); return; }
    var ge = document.getElementById('eam-b-gender'), g = ge ? ge.value : '', gt = g === 'female' ? 'أنثى' : g === 'male' ? 'ذكر' : '';
    var t = document.getElementById('eam-b-time'), unk = document.getElementById('eam-b-unknown');
    var time = unk && unk.checked ? 'وقت غير معروف' : val('eam-b-time');
    var pills = [['cal', val('eam-b-date').replace(/-/g, '/')], ['clock', time], ['pin', val('eam-b-city')], ['user', gt]];
    var sig = JSON.stringify(pills);
    if (old && old.getAttribute('data-sig') === sig) return;
    if (old) old.remove();
    var card = build('الخريطة الفيدية', 'خريطتك الفيدية', pills, function () { var b = sec.querySelector('.eam-back'); if (b) b.click(); });
    card.setAttribute('data-sig', sig);
    var c = document.getElementById('eam-content'); c.insertBefore(card, c.firstChild);
    sec.classList.add('aq-has-pcard');
  }
  var t;
  function run() { try { natal(); vedic(); } catch (e) {} }
  new MutationObserver(function () { clearTimeout(t); t = setTimeout(run, 120); }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  document.addEventListener('click', function () { setTimeout(run, 400); });
  run();
})();
