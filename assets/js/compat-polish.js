/* شكل فقط: أيقونات الحقول + تعبئة تلقائية لنماذج التوافقات، بنفس أسلوب مسار الحياة. لا يغيّر الحساب. */
(function () {
  'use strict';
  var S = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
  var IC = {
    person: '<svg ' + S + '><circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c.9-3.6 3.6-5.4 7-5.4s6.1 1.8 7 5.4"/></svg>',
    cal: '<svg ' + S + '><rect x="4" y="5.5" width="16" height="14" rx="2.5"/><path d="M8 3.5v4M16 3.5v4M4 10h16"/></svg>',
    clock: '<svg ' + S + '><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    sliders: '<svg ' + S + '><path d="M5 8h9M18 8h1M5 16h1M10 16h9"/><circle cx="16" cy="8" r="2"/><circle cx="8" cy="16" r="2"/></svg>',
    pin: '<svg ' + S + '><path d="M12 21s6-5.6 6-10.5A6 6 0 0 0 6 10.5C6 15.400 12 21 12 21z"/><circle cx="12" cy="10.500" r="2.200"/></svg>',
    link: '<svg ' + S + '><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg>'
  };
  function pick(inp) {
    if (!inp) return IC.person;
    var id = inp.id || '', t = inp.type || '';
    if (t === 'date') return IC.cal;
    if (t === 'time') return IC.clock;
    if (/city|manual|lat|lon|off/.test(id)) return IC.pin;
    if (/type|rel/.test(id)) return IC.link;
    if (inp.tagName === 'SELECT') return IC.sliders;
    return IC.person;
  }
  function icons(form) {
    [].forEach.call(form.querySelectorAll('.field'), function (f) {
      var l = f.querySelector(':scope > label'); if (!l || l.querySelector('.mxp-fi')) return;
      var inp = f.querySelector('input,select'); var s = document.createElement('span');
      s.className = 'mxp-fi'; s.setAttribute('aria-hidden', 'true'); s.innerHTML = pick(inp);
      l.insertBefore(s, l.firstChild);
      if (!l.querySelector('span:not(.mxp-fi)')) { var t = document.createElement('span'); t.innerHTML = l.childNodes[1] ? '' : ''; }
    });
  }
  function wrapLabelText(form) {
    [].forEach.call(form.querySelectorAll('.field > label'), function (l) {
      [].slice.call(l.childNodes).forEach(function (n) { if (n.nodeType === 3 && n.textContent.trim()) { var s = document.createElement('span'); s.textContent = n.textContent.trim(); l.replaceChild(s, n); } });
    });
  }
  function collapse(fs) {
    if (fs.querySelector('.cp-more')) return;
    var id = (fs.querySelector('input[type=date]') || {}).id || ''; var pre = id.split('-')[0];
    var g = function (x) { return document.getElementById(pre + '-' + x); };
    var up = function (el, sel) { return el && el.closest(sel); };
    var timeF = up(g('time'), '.field'), chk = up(g('unknown'), 'label.chk'), note = fs.querySelector('.cp-note'),
        cityF = up(g('city'), '.field'), man = g('manual');
    if (!timeF || !cityF) return;
    var d = document.createElement('details'); d.className = 'cp-more';
    d.innerHTML = '<summary>وقت ومكان الميلاد <small>(اضغط لإدخال الوقت)</small></summary>';
    [timeF, chk, note, cityF, man].forEach(function (el) { if (el) d.appendChild(el); });
    fs.appendChild(d);
  }
  function run() {
    [].forEach.call(document.querySelectorAll('#cp-form fieldset.cp-person'), collapse);
    ['cp-form', 'synastry-form', 'mxc-form', 'mxk-form'].forEach(function (id) {
      var f = document.getElementById(id); if (!f) return;
      f.classList.add('y27-form'); wrapLabelText(f); icons(f);
    });
    var mp = document.querySelector('#mxm-pair .mxm-form');
    if (mp) { if (!mp.id) mp.id = 'mxm-pair-form'; wrapLabelText(mp); icons(mp); }
    if (window.AqAutofillBuild) window.AqAutofillBuild();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#cp-form button[type=submit]'); if (!b) return;
    [].forEach.call(document.querySelectorAll('#cp-form details.cp-more'), function (d) {
      var t = d.querySelector('input[type=time]'), u = d.querySelector('input[type=checkbox]');
      if (t && !t.value && !(u && u.checked)) d.open = true;
    });
  }, true);
  var n = 0; (function tick() { run(); if (++n < 12) setTimeout(tick, 400); })();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
})();
