/* الرئيسية: شريط الأدوات (تسجيل الدخول/حسابي) + قراءاتك المحفوظة + نشاطك الأخير.
   لا يمسّ auth.js ولا Supabase: يقرأ حالة الدخول من عنصر الحساب الموجود ويقرأ القراءات من AqeeqPlatform. */
(function () {
  'use strict';
  var ACT_KEY = 'aqeeq_activity_v1';
  var LABELS = {
    chart: 'الخريطة الفلكية', lifepath: 'مسار الحياة', matrix: 'مصفوفة القدر', compat: 'خريطة التوافق',
    relationships: 'مركز التوافق', individual: 'خرائطك الشخصية', signs: 'صفات وتوقعات الأبراج',
    sky: 'المشهد الفلكي الآن', world: 'الخريطة الفلكية العالمية', 'astro-maps': 'العبور والتقويم الفلكي',
    'featured-content': 'المحتوى المميز', 'lifepath-compat': 'توافق مسارات الحياة', 'matrix-compat': 'توافق مصفوفة القدر'
  };
  var ICONS = {
    saved: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    chart: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',
    lifepath: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M6 16.5V13a4 4 0 0 1 4-4h4a4 4 0 0 0 4-4V7.5"/>',
    matrix: '<path d="M12 3l9 9-9 9-9-9z"/><path d="M12 8l4 4-4 4-4-4z"/>',
    compat: '<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>',
    sky: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>',
    doc: '<path d="M7 3h8l4 4v14H7z"/><path d="M14 3v5h5M10 13h6M10 17h4"/>'
  };
  function svg(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[k] || ICONS.doc) + '</svg>'; }
  function iconFor(t) { t = String(t || ''); return /natal|chart|خريطة/.test(t) ? 'chart' : /life|مسار/.test(t) ? 'lifepath' : /matrix|مصفوفة/.test(t) ? 'matrix' : /compat|synastry|توافق/.test(t) ? 'compat' : /sky|سماء/.test(t) ? 'sky' : 'doc'; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function fmt(iso) { try { return new Date(iso).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' }); } catch (_) { return ''; } }
  function ago(ts) {
    var m = Math.round((Date.now() - ts) / 60000);
    if (m < 1) return 'الآن'; if (m < 60) return 'منذ ' + m + ' دقيقة';
    var h = Math.round(m / 60); if (h < 24) return 'منذ ' + h + ' ساعة';
    return fmt(new Date(ts).toISOString());
  }
  function loggedIn() { var u = document.getElementById('acct-user'); return !!(u && !u.hidden); }

  /* ---------- زر تسجيل الدخول / حسابي ---------- */
  function syncLogin() {
    var a = document.getElementById('aqh-login-tool'); if (!a) return;
    var on = loggedIn(), b = a.querySelector('b'), s = a.querySelector('small');
    a.classList.toggle('is-in', on);
    if (b) b.textContent = 'حسابي';
    if (s) s.textContent = on ? 'قراءاتك المحفوظة وبياناتك' : 'سجّل الآن لتعرف أكثر عن نفسك، أنت مميز';
  }

  /* ---------- سجل النشاط ---------- */
  function readAct() { try { var r = JSON.parse(localStorage.getItem(ACT_KEY) || '[]'); return Array.isArray(r) ? r : []; } catch (_) { return []; } }
  function track() {
    var k = (location.hash || '').replace(/^#/, ''); if (!LABELS[k]) return;
    var list = readAct(), top = list[0];
    if (top && top.k === k && Date.now() - top.t < 600000) return;
    list.unshift({ k: k, t: Date.now() });
    try { localStorage.setItem(ACT_KEY, JSON.stringify(list.slice(0, 12))); } catch (_) {}
  }

  /* ---------- القوائم ---------- */
  function emptyBox(text, cta) {
    var d = el('div', 'aqh-mempty', '<p></p>'); d.firstChild.textContent = text;
    if (cta) { var a = el('a', 'aqh-mbtn'); a.href = cta.href; a.textContent = cta.t; d.appendChild(a); }
    return d;
  }
  function renderSaved(host) {
    var P = window.AqeeqPlatform, list = (P && P.getSavedReadings && P.getSavedReadings()) || [];
    host.textContent = '';
    if (!list.length) {
      host.appendChild(emptyBox(loggedIn() ? 'لسه ما حفظتش قراءات. احسب خريطتك أو مسار حياتك واحفظ القراءة لتظهر هنا.' : 'سجّل دخولك لتحفظ قراءاتك ومقالاتك وترجع لها في أي وقت.', loggedIn() ? { href: '#individual', t: 'ابدأ قراءة' } : { href: '#account', t: 'تسجيل الدخول' }));
      return;
    }
    list.slice(0, 3).forEach(function (it) {
      var a = el('a', 'aqh-mi'); a.href = it.route || '#chart';
      var ic = el('span', 'aqh-mi-ic', svg(iconFor(it.type))), t = el('span', 'aqh-mi-t'), b = el('b'), sm = el('small');
      b.textContent = it.title || 'قراءة محفوظة'; sm.textContent = (it.typeLabel || 'قراءة') + (it.createdAt ? ' · ' + fmt(it.createdAt) : '');
      t.appendChild(b); t.appendChild(sm); a.appendChild(ic); a.appendChild(t);
      a.addEventListener('click', function (e) { if (P && P.restoreSavedReading) { try { P.restoreSavedReading(it); e.preventDefault(); } catch (_) {} } });
      host.appendChild(a);
    });
  }
  function renderActivity(host) {
    var list = readAct().filter(function (x) { return x.k !== 'home'; }); host.textContent = '';
    if (!list.length) { host.appendChild(emptyBox('أي أداة تفتحها هتظهر هنا عشان ترجع لها بسرعة.', { href: '#individual', t: 'استكشف الأدوات' })); return; }
    list.slice(0, 4).forEach(function (x) {
      var a = el('a', 'aqh-mi'); a.href = '#' + x.k;
      var ic = el('span', 'aqh-mi-ic', svg(iconFor(x.k))), t = el('span', 'aqh-mi-t'), b = el('b'), sm = el('small');
      b.textContent = 'فتحت ' + LABELS[x.k]; sm.textContent = ago(x.t);
      t.appendChild(b); t.appendChild(sm); a.appendChild(ic); a.appendChild(t); host.appendChild(a);
    });
  }
  function renderMine() {
    var s = document.querySelector('#aqh-mine [data-list="saved"]'), a = document.querySelector('#aqh-mine [data-list="activity"]');
    if (s) renderSaved(s); if (a) renderActivity(a);
  }

  function init() {
    syncLogin(); track(); renderMine();
    var u = document.getElementById('acct-user');
    if (u) new MutationObserver(function () { syncLogin(); renderMine(); }).observe(u, { attributes: true, attributeFilter: ['hidden'] });
    window.addEventListener('hashchange', function () { track(); if (!location.hash || location.hash === '#home') renderMine(); });
    window.addEventListener('storage', renderMine);
    setTimeout(function () { syncLogin(); renderMine(); }, 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
