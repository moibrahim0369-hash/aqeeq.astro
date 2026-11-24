/* «أنت»: زر الحساب (الصورة) يفتح قائمة منسدلة للملف الشخصي، وزر الضبط لإعدادات الموقع. يعمل فوق you-page.js دون تعديله. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var host = function () { return $('#fy-body'); };
  window.__ypMode = window.__ypMode || 'profile';
  var viaMenu = false;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function closeMenu() { var m = $('#yp-menu'); if (m) m.remove(); var s = $('#yp-menu-scrim'); if (s) s.remove(); var b = $('.yp-who-b[data-set]'); if (b) b.setAttribute('aria-expanded', 'false'); }
  function openMenu(btn) {
    closeMenu();
    var name = ($('.yp-who-t b', btn) || {}).textContent || '', un = ($('.yp-who-t small', btn) || {}).textContent || '';
    var scrim = document.createElement('div'); scrim.id = 'yp-menu-scrim'; scrim.className = 'yp-menu-scrim';
    var m = document.createElement('div'); m.id = 'yp-menu'; m.className = 'yp-menu'; m.setAttribute('role', 'menu');
    m.innerHTML = '<div class="yp-menu-h"><b>' + esc(name) + '</b><small dir="ltr">' + esc(un) + '</small></div>' +
      '<button type="button" role="menuitem" class="yp-menu-i" data-ym="profile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M5 20c.8-3.6 3.6-5.4 7-5.4s6.200 1.800 7 5.400"/></svg><span>الملف الشخصي</span></button>' +
      '<button type="button" role="menuitem" class="yp-menu-i" data-signout><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"/></svg><span>تسجيل الخروج</span></button>' +
      '<button type="button" role="menuitem" class="yp-menu-i danger" data-ym="delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg><span>حذف الحساب</span></button>';
    var top = $('.yp-top'); if (!top) return;
    top.appendChild(scrim); top.appendChild(m); btn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(function () { m.classList.add('on'); });
  }

  function confirmDelete() {
    closeMenu();
    var old = $('#yp-del'); if (old) old.remove();
    var d = document.createElement('div'); d.id = 'yp-del'; d.className = 'yp-del'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
    d.innerHTML = '<div class="yp-del-c"><h3>حذف الحساب</h3><p>سيُحذف حسابك وكل بياناتك نهائيًا ولا يمكن التراجع.</p><p class="yp-del-m" role="status"></p><div class="yp-del-b"><button type="button" class="yp-del-x" data-yd="cancel">إلغاء</button><button type="button" class="yp-del-ok" data-yd="ok">احذف حسابي نهائيًا</button></div></div>';
    document.body.appendChild(d);
  }

  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    var who = t.closest('#for-you .yp-who-b[data-set]');
    if (who) { e.preventDefault(); e.stopPropagation(); if ($('#yp-menu')) closeMenu(); else openMenu(who); return; }
    var gear = t.closest('#for-you .yp-ib[data-tab="settings"]');
    if (gear && !viaMenu) { window.__ypMode = 'site'; }
    var ym = t.closest('[data-ym]');
    if (ym) {
      var k = ym.getAttribute('data-ym');
      if (k === 'profile') { var g = $('#for-you .yp-ib[data-tab="settings"]'); closeMenu(); window.__ypMode = 'profile'; if (g) { viaMenu = true; g.click(); viaMenu = false; } }
      else if (k === 'delete') confirmDelete();
      return;
    }
    if (t.closest('#yp-menu-scrim')) { closeMenu(); return; }
    if (t.closest('#yp-menu [data-signout]')) { setTimeout(closeMenu, 0); return; }
    var yd = t.closest('[data-yd]');
    if (yd) {
      var dlg = $('#yp-del'); if (!dlg) return;
      if (yd.getAttribute('data-yd') === 'cancel') { dlg.remove(); return; }
      var msg = $('.yp-del-m', dlg), sb = window.aqeeqSupabase; yd.disabled = true;
      if (!sb || !sb.rpc) { msg.textContent = 'تعذّر الاتصال الآن، حاول لاحقًا.'; yd.disabled = false; return; }
      msg.textContent = 'جارٍ الحذف...';
      sb.rpc('delete_my_account').then(function (r) {
        if (r && !r.error) { try { sb.auth.signOut(); } catch (x) {} try { localStorage.clear(); } catch (x) {} location.href = location.pathname + '#home'; location.reload(); }
        else { msg.textContent = 'تعذّر حذف الحساب الآن، حاول مرة أخرى.'; yd.disabled = false; }
      }, function () { msg.textContent = 'تعذّر حذف الحساب الآن، حاول مرة أخرى.'; yd.disabled = false; });
      return;
    }
    var fb = t.closest('[data-yfb-send]');
    if (fb) {
      var ta = $('#yp-fb'), st = $('#yp-fb-m'), v = ta ? ta.value.trim() : '', sb2 = window.aqeeqSupabase;
      if (v.length < 3) { st.textContent = 'اكتب رأيك أولًا.'; st.className = 'yp-fb-m err'; return; }
      if (!sb2 || !sb2.from) { st.textContent = 'تعذّر الاتصال الآن، حاول لاحقًا.'; st.className = 'yp-fb-m err'; return; }
      fb.disabled = true; st.textContent = 'جارٍ الإرسال...'; st.className = 'yp-fb-m';
      sb2.from('user_feedback').insert({ message: v.slice(0, 2000) }).then(function (r) {
        fb.disabled = false;
        if (r && !r.error) { ta.value = ''; st.textContent = 'وصلنا رأيك، شكرًا لك.'; st.className = 'yp-fb-m ok'; }
        else { st.textContent = 'تعذّر الإرسال الآن، حاول مرة أخرى.'; st.className = 'yp-fb-m err'; }
      }, function () { fb.disabled = false; st.textContent = 'تعذّر الإرسال الآن، حاول مرة أخرى.'; st.className = 'yp-fb-m err'; });
    }
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); var d = $('#yp-del'); if (d) d.remove(); } });
  window.addEventListener('hashchange', closeMenu);

  var busy = false;
  function adapt() {
    if (busy) return; busy = true;
    try {
      var yp = $('#fy-body .yp'); if (!yp) return;
      if (yp.classList.contains('yp-t-home')) { yp.classList.add('yp-lite'); return; }
      if (!yp.classList.contains('yp-t-settings')) return;
      var mode = window.__ypMode || 'profile'; yp.setAttribute('data-ypm', mode);
      var h1 = $('.yp-bar h1', yp); if (h1) h1.textContent = mode === 'site' ? 'الإعدادات' : 'الملف الشخصي';
      var map = { 'حسابك': 'p', 'الخصوصية': 'p', 'التنبيهات': 's', 'بياناتك وخريطتك': 'p', 'عن عقيق أسترو': 'a' };
      [].forEach.call(yp.querySelectorAll('.yp-set-g'), function (g) { var l = $('.yp-lab', g); if (l) g.setAttribute('data-yg', map[l.textContent.trim()] || 'p'); });
      var set = $('.yp-set', yp);
      if (set && !$('#yp-fbg', set)) {
        var g = document.createElement('div'); g.className = 'yp-set-g'; g.id = 'yp-fbg'; g.setAttribute('data-yg', 's');
        g.innerHTML = '<p class="yp-lab">اكتب رأيك</p><div class="yp-fb"><textarea id="yp-fb" rows="4" maxlength="2000" placeholder="اكتب رأيك أو اقتراحك هنا"></textarea><button type="button" class="yp-ab yp-fb-b" data-yfb-send><span>إرسال</span></button><p class="yp-fb-m" id="yp-fb-m" role="status"></p></div>';
        var out = $('.yp-out', set); if (out) set.insertBefore(g, out); else set.appendChild(g);
        if (out) out.setAttribute('data-yg', 'p');
      }
    } finally { busy = false; }
  }
  function start() {
    var h = host(); if (!h) return setTimeout(start, 300);
    new MutationObserver(function () { adapt(); }).observe(h, { childList: true });
    adapt();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
