/* فصل صفحة الأبراج إلى صفحتين: «توقعات الأبراج» وحدها، و«شخصية وصفات البرج» وحدها.
   نفس الصفحة والمحتوى، فقط يُعرض قسم واحد في كل مرة. بدون أي تغيير في النصوص الموجودة. */
(function () {
  'use strict';
  var KEY = 'aq-signs-page', TRAITS = '#sign-traits';
  var T_TITLE = 'شخصية وصفات البرج', T_SUB = 'صفات برجك';
  var sec = null, h2Orig = null, introOrig = null;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function page() { try { return sessionStorage.getItem(KEY) === 'traits' ? 'traits' : 'forecast'; } catch (e) { return 'forecast'; } }
  function setPage(p) { try { if (p === 'traits') sessionStorage.setItem(KEY, 'traits'); else sessionStorage.removeItem(KEY); } catch (e) {} }
  function apply() {
    sec = sec || $('#signs'); if (!sec) return;
    var onSigns = location.hash === '#signs';
    if (!onSigns) { setPage('forecast'); return; }
    var p = page();
    sec.setAttribute('data-sp', p);
    var h2 = $('.center h2', sec), intro = $('.center .intro', sec);
    if (h2 && h2Orig === null) h2Orig = h2.textContent;
    if (intro && introOrig === null) introOrig = intro.textContent;
    if (h2) h2.textContent = p === 'traits' ? T_TITLE : (h2Orig || h2.textContent);
    if (intro) { intro.textContent = introOrig || intro.textContent; intro.style.display = p === 'traits' ? 'none' : ''; }
    var tab = $('#sg-cur [data-sgtab="' + (p === 'traits' ? 'traits' : 'forecast') + '"]');
    if (tab && tab.getAttribute('aria-selected') !== 'true') tab.click();
    $$('.aq-section-pill[data-sp-pill]', sec).forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-sp-pill') === p); });
  }
  function pills() {
    sec = sec || $('#signs'); if (!sec) return;
    var q = $('.aq-section-quick-links', sec); if (!q || q.getAttribute('data-sp-done')) return;
    var first = $('a.aq-section-pill', q); if (!first) return;
    q.setAttribute('data-sp-done', '1');
    var f = first, t = first.cloneNode(true);
    var lbl = function (a, txt) { var n = [].slice.call(a.childNodes).filter(function (x) { return x.nodeType === 3; }); n.forEach(function (x) { x.textContent = ''; }); a.appendChild(document.createTextNode(txt)); };
    lbl(f, 'توقعات الأبراج'); f.setAttribute('data-sp-pill', 'forecast');
    lbl(t, T_TITLE); t.setAttribute('href', TRAITS); t.setAttribute('data-sp-pill', 'traits'); t.classList.remove('active');
    f.parentNode.insertBefore(t, f.nextSibling);
  }
  function card() {
    var z = $('#zdc'); if (!z || $('#sp-zdc-traits')) return;
    var c = z.cloneNode(true); c.id = 'zdc'; c.setAttribute('data-sp-card', '1'); c.setAttribute('href', TRAITS); c.setAttribute('aria-label', T_TITLE);
    var b = $('.zdc-t b', c), s = $('.zdc-t small', c); if (b) b.textContent = T_TITLE; if (s) s.textContent = T_SUB;
    var mark = document.createElement('i'); mark.id = 'sp-zdc-traits'; mark.hidden = true;
    z.parentNode.insertBefore(mark, z.nextSibling); z.parentNode.insertBefore(c, mark.nextSibling);
    c.style.marginTop = '0';
  }
  function menu() {
    $$('.hn-modal').forEach(function (m) {
      if (m.getAttribute('data-sp')) return;
      var a = $('a.hn-tile[href="#signs"]', m); if (!a) return;
      m.setAttribute('data-sp', '1');
      var c = a.cloneNode(true); c.setAttribute('href', TRAITS);
      var b = $('b', c), s = $('small', c); if (b) b.textContent = T_TITLE; if (s) s.textContent = T_SUB;
      a.parentNode.insertBefore(c, a.nextSibling);
    });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    var h = a.getAttribute('href');
    if (h === TRAITS) { e.preventDefault(); setPage('traits'); if (location.hash === '#signs') apply(); else location.hash = '#signs'; }
    else if (h === '#signs') { setPage('forecast'); if (location.hash === '#signs') setTimeout(apply, 0); }
  }, true);
  window.addEventListener('hashchange', function () { if (location.hash === TRAITS) { setPage('traits'); location.replace('#signs'); return; } setTimeout(apply, 60); });
  function init() {
    if (location.hash === TRAITS) { setPage('traits'); location.replace('#signs'); }
    pills(); card(); menu(); setTimeout(apply, 400); setTimeout(apply, 1500);
  }
  new MutationObserver(function () { menu(); card(); pills(); }).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.addEventListener('load', function () { setTimeout(function () { pills(); card(); menu(); apply(); }, 600); });
})();
