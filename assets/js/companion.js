/* رفيق عقيق: بوت قواعد محلي (بدون خادم). الردود من assets/data/companion.json */
(function () {
  'use strict';
  var SRC = 'assets/data/companion.json', D = null, panel, log, input, fab, lastFocus;
  var I = {
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 4 10 14M20 4l-6 16-4-6-6-4Z"/></svg>'
  };
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); }
  function norm(s) { return String(s).replace(/[ً-ْـ]/g, '').replace(/[إأآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').toLowerCase().trim(); }

  function say(html, who) { var m = el('div', 'cmp-msg ' + (who || 'bot'), html); log.appendChild(m); log.scrollTop = log.scrollHeight; return m; }
  function chips(items) {
    var w = el('div', 'cmp-chips');
    items.forEach(function (c) { var b = el('button', 'cmp-chip', esc(c.label)); b.type = 'button'; b.addEventListener('click', c.run); w.appendChild(b); });
    log.appendChild(w); log.scrollTop = log.scrollHeight;
  }
  function go(hash) { close(); location.hash = hash; }
  function link(hash, label) { return '<a class="cmp-go" href="' + hash + '" data-cmp-go>' + esc(label) + '</a>'; }

  function menu() {
    chips([
      { label: 'ما طاقة اليوم؟', run: function () { say('ما طاقة اليوم؟', 'me'); energy(); } },
      { label: 'وصّلني لأداة', run: function () { say('وصّلني لأداة', 'me'); tools(); } },
      { label: 'اشرح لي مصطلحًا', run: function () { say('اشرح لي مصطلحًا', 'me'); termsMenu(); } },
      { label: 'مقال يناسبني', run: function () { say('مقال يناسبني', 'me'); article(); } }
    ]);
  }
  function energy() {
    var a = document.getElementById('aqh-energy-main'), b = document.getElementById('aqh-energy-state');
    var t = [a && a.textContent.trim(), b && b.textContent.trim()].filter(Boolean).join('. ');
    say(t ? esc(t) : 'تفاصيل طاقة اليوم في صفحة السماء الآن.');
    say(link('#sky', 'افتح السماء الآن')); menu();
  }
  function tools() {
    say('أي أداة تريد؟');
    chips(D.tools.map(function (t) { return { label: t.label, run: function () { say(t.label, 'me'); say(esc(t.note) + '<br>' + link(t.hash, 'افتح ' + t.label)); menu(); } }; }));
  }
  function termsMenu() {
    say('اختر مصطلحًا:');
    chips(D.terms.slice(0, 8).map(function (t) { return { label: t.t, run: function () { say(t.t, 'me'); explain(t); } }; }));
  }
  function explain(t) { say(esc(t.a) + (t.hash ? '<br>' + link(t.hash, 'افتح الأداة') : '')); menu(); }
  function article() {
    var list = (window.AqhArticles && window.AqhArticles.all && window.AqhArticles.all()) || [];
    if (!list.length) { say('المقالات في صفحة المحتوى المميز.'); say(link('#featured-content', 'افتح المحتوى المميز')); return menu(); }
    var a = list[Math.floor(Math.random() * Math.min(list.length, 8))];
    say('أقترح عليك: <b>' + esc(a.title) + '</b>'); say(link('#featured-content/' + a.slug, 'اقرأ المقال')); menu();
  }
  function ask(q) {
    var n = norm(q); if (!n) return;
    say(esc(q), 'me');
    var hit = null;
    var best = 0; D.terms.forEach(function (t) { t.k.forEach(function (k) { var nk = norm(k); if ((nk.length > 3 ? n.indexOf(nk) > -1 : (' ' + n + ' ').indexOf(' ' + nk + ' ') > -1) && nk.length > best) { best = nk.length; hit = t; } }); });
    if (hit) explain(hit); else { say(esc(D.fallback)); menu(); }
  }

  function build() {
    fab = el('button', 'cmp-fab', I.eye); fab.type = 'button'; fab.setAttribute('aria-label', 'رفيق عقيق'); fab.setAttribute('aria-haspopup', 'dialog'); fab.setAttribute('aria-expanded', 'false');
    panel = el('div', 'cmp-panel'); panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'رفيق عقيق');
    panel.innerHTML = '<div class="cmp-head"><span class="cmp-ico">' + I.eye + '</span><div><b>رفيق عقيق</b><small>رفيقك في الرحلة</small></div><button type="button" class="cmp-x" aria-label="إغلاق">' + I.x + '</button></div><div class="cmp-log" aria-live="polite"></div><form class="cmp-form"><input type="text" maxlength="60" placeholder="اكتب كلمة، مثل: التوافق" aria-label="اكتب سؤالك"><button type="submit" aria-label="إرسال">' + I.send + '</button></form>';
    document.body.appendChild(fab); document.body.appendChild(panel);
    log = panel.querySelector('.cmp-log'); input = panel.querySelector('input');
    fab.addEventListener('click', function () { panel.hidden ? open() : close(); });
    /* يختفي عند النزول ويظهر عند الصعود، حتى لا يغطي النص */
    var lastY = {}, tick = false;
    document.addEventListener('scroll', function (e) {
      var t = e.target === document ? window : e.target, k = t === window ? 'w' : (t.id || t.className || 'x');
      var y = t === window ? window.scrollY : t.scrollTop, d = y - (lastY[k] || 0);
      if (Math.abs(d) < 8) return; lastY[k] = y;
      if (!panel.hidden) return;
      fab.classList.toggle('cmp-fab-hide', d > 0 && y > 60);
    }, { passive: true, capture: true });
    window.addEventListener('hashchange', function () { fab.classList.remove('cmp-fab-hide'); });
    panel.querySelector('.cmp-x').addEventListener('click', close);
    panel.querySelector('form').addEventListener('submit', function (e) { e.preventDefault(); var v = input.value; input.value = ''; ask(v); });
    panel.addEventListener('click', function (e) { if (e.target.closest('[data-cmp-go]')) { e.preventDefault(); go(e.target.closest('[data-cmp-go]').getAttribute('href')); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) close(); });
  }
  function open() {
    function show() {
      panel.hidden = false; fab.setAttribute('aria-expanded', 'true'); lastFocus = document.activeElement;
      if (!log.children.length) { say(esc(D.greeting)); menu(); }
      requestAnimationFrame(function () { panel.classList.add('is-open'); });
    }
    if (D) return show();
    fetch(SRC).then(function (r) { return r.json(); }).then(function (d) { D = d; show(); }).catch(function () { });
  }
  function close() { panel.classList.remove('is-open'); fab.setAttribute('aria-expanded', 'false'); setTimeout(function () { panel.hidden = true; }, 200); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
