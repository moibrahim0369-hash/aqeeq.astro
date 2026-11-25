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

  var REASONS = [['not_useful','التطبيق ليس مفيدًا لي'],['too_many_notifications','الإشعارات كثيرة'],['privacy','مخاوف تخص الخصوصية'],['found_alternative','وجدت بديلًا'],['temporary_break','أحتاج استراحة وقد أعود'],['other','سبب آخر']];
  function confirmDelete() {
    closeMenu();
    var old = $('#yp-del'); if (old) old.remove();
    var d = document.createElement('div'); d.id = 'yp-del'; d.className = 'yp-del'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
    var opts = REASONS.map(function (r) { return '<label class="yp-del-o"><input type="radio" name="ypr" value="' + r[0] + '"><span>' + r[1] + '</span></label>'; }).join('');
    d.innerHTML = '<div class="yp-del-c"><h3>قبل أن ترحل</h3><p>ساعدنا على الفهم: ما سبب رغبتك في حذف حسابك؟</p><div class="yp-del-l">' + opts + '</div><textarea class="yp-del-t" id="yp-del-t" rows="2" maxlength="1000" placeholder="هل تود إضافة شيء؟ (اختياري)"></textarea><p class="yp-del-n">بعد الحذف يُسجَّل خروجك، ونحتفظ ببياناتك مدة 30 يومًا. إن عدت وسجّلت الدخول خلالها يُستعاد حسابك كما كان، وبعدها يُحذف نهائيًا.</p><p class="yp-del-m" role="status"></p><div class="yp-del-b"><button type="button" class="yp-del-x" data-yd="cancel">إلغاء</button><button type="button" class="yp-del-ok" data-yd="ok">احذف حسابي</button></div></div>';
    document.body.appendChild(d);
  }
  function tryRestore() {
    var sb = window.aqeeqSupabase; if (!sb || !sb.auth || !sb.rpc || sb.__ymR) return; sb.__ymR = 1;
    sb.auth.onAuthStateChange(function (ev, ses) {
      if (ev !== 'SIGNED_IN' || !ses) return;
      setTimeout(function () { sb.rpc('restore_my_account').then(function (r) { if (r && !r.error && r.data === true) { var t = document.createElement('div'); t.className = 'yp-toast'; t.textContent = 'تمت استعادة حسابك، أهلًا بعودتك.'; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 5000); } }, function () {}); }, 0);
    });
  }
  tryRestore(); window.addEventListener('load', tryRestore); setTimeout(tryRestore, 1500);

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
      var msg = $('.yp-del-m', dlg), sb = window.aqeeqSupabase;
      var pick = $('input[name=ypr]:checked', dlg);
      if (!pick) { msg.textContent = 'اختر سببًا من فضلك.'; return; }
      yd.disabled = true;
      if (!sb || !sb.rpc) { msg.textContent = 'تعذّر الاتصال الآن، حاول لاحقًا.'; yd.disabled = false; return; }
      msg.textContent = 'جارٍ التنفيذ...';
      sb.rpc('request_account_deletion', { p_reason: pick.value, p_details: ($('#yp-del-t').value || '').trim() || null }).then(function (r) {
        if (r && !r.error) { try { sb.auth.signOut(); } catch (x) {} location.href = location.pathname + '#home'; location.reload(); }
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

  var IC = { mail: '<path d="M4 6h16v12H4zM4 7l8 6 8-6"/>', at: '<circle cx="12" cy="12" r="3.5"/><path d="M15.500 12v1.500a2.500 2.500 0 005 0V12a8.500 8.500 0 10-3.300 6.700"/>', lock: '<rect x="5" y="11" width="14" height="9" rx="2.500"/><path d="M8 11V8a4 4 0 018 0v3"/>', sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.600 5.600L7 7M17 17l1.400 1.400M5.600 18.400L7 17M17 7l1.400-1.400"/>', orbit: '<circle cx="12" cy="12" r="2.500"/><ellipse cx="12" cy="12" rx="9" ry="4.500" transform="rotate(-25 12 12)"/>', peak: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', chat: '<path d="M5 5h14v10H10l-5 4z"/>', eye: '<path d="M3 12s3.500-6 9-6 9 6 9 6-3.500 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="2.500"/>' };
  var ICMAP = { 'سماء يومك': 'sun', 'عبور يقترب': 'orbit', 'ذروة العبور': 'peak', 'وقت التنبيه': 'clock', 'اسم المستخدم': 'at', 'حساب خاص': 'lock' };
  function icons(root) {
    [].forEach.call(root.querySelectorAll('.yp-set-row'), function (r) {
      if (r.querySelector('.yp-ic')) return;
      var b = r.querySelector('b'); if (!b) return;
      var k = ICMAP[b.textContent.trim()] || (b.getAttribute('dir') === 'ltr' ? 'mail' : null); if (!k) return;
      var i = document.createElement('i'); i.className = 'yp-ic'; i.setAttribute('aria-hidden', 'true');
      i.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">' + IC[k] + '</svg>';
      r.insertBefore(i, r.firstChild);
    });
  }

  /* صفحة تعديل البيانات: صفحة مستقلة فوق الصفحة بدل التمدد داخلها */
  var EDIT_LBL = 'تعديل البيانات الشخصية';
  function edWrap() { return document.getElementById('profile-form-wrapper'); }
  function edOpen() {
    var w = edWrap(); if (!w) return;
    var b = document.getElementById('profile-edit-btn'), sp = b && b.querySelector('span'); if (sp && sp.textContent.trim()) EDIT_LBL = sp.textContent.trim();
    if (!w.querySelector('.yp-ed-bar')) {
      var bar = document.createElement('div'); bar.className = 'yp-ed-bar';
      bar.innerHTML = '<button type="button" class="yp-ed-back" data-yed-close aria-label="رجوع"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button><h2>' + esc(EDIT_LBL) + '</h2><span></span>';
      w.insertBefore(bar, w.firstChild);
    }
    w.classList.add('yp-ed-open'); document.documentElement.classList.add('yp-ed-lock');
    var sc = w.scrollTop = 0;
  }
  function edClose() {
    var w = edWrap(); if (w) w.classList.remove('yp-ed-open'); document.documentElement.classList.remove('yp-ed-lock');
    var c = document.getElementById('profile-cancel-edit'); if (c && !c.hidden && c.offsetParent !== null) { try { c.click(); } catch (x) {} }
  }
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    if (t.closest('[data-yed-close]')) { e.preventDefault(); edClose(); return; }
    if (t.closest('#profile-edit-btn') || t.closest('[data-yed-open]')) { edOpen(); }
  }, true);
  function edWatch() {
    var w = edWrap(); if (!w || w._yedW) return; w._yedW = 1;
    new MutationObserver(function () { if (w.classList.contains('yp-ed-open') && (w.hidden || w.style.display === 'none')) edClose(); }).observe(w, { attributes: true, attributeFilter: ['hidden', 'style'] });
  }
  function edEntry(set) {
    var slot = $('#yp-prof-slot', set); if (!slot || $('.yp-ed-entry', slot)) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'yp-ed-entry'; b.setAttribute('data-yed-open', '');
    b.innerHTML = '<span class="yp-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l4.500-1 10-10a2.100 2.100 0 00-3-3l-10 10z"/></svg></span><b>' + esc(EDIT_LBL) + '</b><svg class="yp-ed-ch" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>';
    slot.insertBefore(b, slot.firstChild);
  }

  /* صور افتراضية من هويتنا لمن لا صورة له: ثلاث لكل جنس، تُحدَّد ثابتة من معرّف الحساب */
  var AV = { male: ['m1', 'm2', 'm3'], female: ['f1', 'f2', 'f3'] };
  function avGender() {
    var g = '';
    try { var m = window.AqeeqChartContext && window.AqeeqChartContext.getMine && window.AqeeqChartContext.getMine(); g = (m && (m.gender || (m.ch && m.ch.gender))) || ''; } catch (e) {}
    try { var u = window.AqSession && window.AqSession.user; if (!g && u && u.user_metadata) g = u.user_metadata.gender || ''; } catch (e) {}
    g = String(g).toLowerCase(); return g === 'male' || g === 'ذكر' ? 'male' : (g === 'female' || g === 'أنثى' ? 'female' : '');
  }
  function avUrl() {
    var g = avGender(); if (!g) return 'assets/images/brand/logo-mark-160.png';
    var u = (window.AqSession && window.AqSession.user) || {}, k = String(u.id || u.email || 'x'), h = 0, i;
    for (i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) >>> 0;
    return 'assets/images/avatars/' + AV[g][h % 3] + '.svg';
  }
  function avatars(root) {
    var url = 'url(' + new URL(avUrl(), document.baseURI).href + ')';
    [].forEach.call(root.querySelectorAll('.yp-av-i,.yp-who-card .yp-av,#profile-avatar-fallback,#profile-summary-avatar'), function (el) {
      if (el.querySelector('img')) return;
      el.classList.add('yp-dav'); el.style.setProperty('--dav', url);
    });
    [].forEach.call(root.querySelectorAll('#profile-form-wrapper .profile-photo-actions *'), function (el) {
      if (/أول حرف اسمك|أحرف اسمك الأولى/.test(el.textContent) && ![].some.call(el.children, function (c) { return /أول حرف اسمك|أحرف اسمك الأولى/.test(c.textContent); })) el.classList.add('yp-hide');
    });
  }
  var busy = false;
  function adapt() {
    if (busy) return; busy = true;
    try {
      var yp = $('#fy-body .yp'); if (!yp) return;
      avatars(document);
      if (yp.classList.contains('yp-t-home')) { yp.classList.add('yp-lite'); return; }
      if (!yp.classList.contains('yp-t-settings')) return;
      if ($('.yp-inb', yp)) { yp.setAttribute('data-ypm', 'inb'); return; }
      var mode = window.__ypMode || 'profile'; yp.setAttribute('data-ypm', mode);
      var h1 = $('.yp-bar h1', yp); if (h1) h1.textContent = mode === 'site' ? 'الإعدادات' : 'الملف الشخصي';
      var map = { 'حسابك': 'p', 'الخصوصية': 'p', 'التنبيهات': 's', 'بياناتك وخريطتك': 'p', 'عن عقيق أسترو': 'a' };
      [].forEach.call(yp.querySelectorAll('.yp-set-g'), function (g) { var l = $('.yp-lab', g); if (l) g.setAttribute('data-yg', map[l.textContent.trim()] || 'p'); });
      var set = $('.yp-set', yp); if (set) { icons(set); edWatch(); if (mode === 'profile') edEntry(set); }
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
