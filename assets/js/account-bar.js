/* الشريط السفلي حسب حالة الدخول (لك / أنت) + جرس الإشعارات. واجهة فقط. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var SVG = function (p) { return '<svg fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" viewBox="0 0 24 24">' + p + '</svg>'; };
  var ICON_FORYOU = SVG('<path d="M12 3l2.2 5.600L20 9.500l-4.400 3.900L17 19l-5-3-5 3 1.400-5.600L4 9.500l5.800-.9z"/>');
  var ICON_YOU = SVG('<circle cx="10" cy="8.500" r="3.800"/><path d="M3.500 20.500a6.500 6.500 0 0 1 11-4.700"/><path d="M18 12v6M15 15h6"/>');
  var BELL = SVG('<path d="M6 16.500V11a6 6 0 0 1 12 0v5.500l1.500 2h-15z"/><path d="M10 21a2 2 0 0 0 4 0"/>');
  var user = null;

  /* ---------------- الشريط السفلي ---------------- */
  var bar = $('#aqn-bnav');
  function item(id, href, label, icon, tag) {
    var el = document.createElement(tag || 'a'); el.className = 'bnav-item'; el.id = id; el.setAttribute('data-nav', id);
    if (tag === 'button') el.type = 'button'; else el.href = href;
    el.innerHTML = '<span class="bnav-icon">' + icon + '</span><span class="bnav-label">' + label + '</span>';
    return el;
  }
  var youSheet = null, youScrim = null;
  function buildSheet() {
    if (youSheet) return;
    youScrim = document.createElement('div'); youScrim.className = 'aqn-scrim'; youScrim.hidden = true;
    youSheet = document.createElement('div'); youSheet.className = 'aqn-sheet aq-you-sheet'; youSheet.setAttribute('role', 'dialog'); youSheet.setAttribute('aria-modal', 'true'); youSheet.setAttribute('aria-label', 'انضم إلى مساحتك'); youSheet.hidden = true;
    youSheet.innerHTML = '<span class="aqn-grab" aria-hidden="true"></span><h2>مساحتك أنت</h2>' +
      '<p class="aq-you-p">سجّل دخولك لتحصل على مميزات أكثر: نافذتك اليومية، توقعات برجك، تذكير بنمطك، وعبورات خريطتك في الوقت الحالي.</p>' +
      '<a class="aq-you-cta" href="#account">' + SVG('<path d="M4 6.500h16v11H4z"/><path d="m4 7 8 6 8-6"/>') + '<span>تسجيل الدخول بحساب Gmail</span></a>' +
      '<button type="button" class="aq-you-later" data-you-close>لاحقًا</button>';
    document.body.appendChild(youScrim); document.body.appendChild(youSheet);
    youScrim.addEventListener('click', closeYou);
    youSheet.addEventListener('click', function (e) { if (e.target.closest('a,[data-you-close]')) closeYou(); });
  }
  function openYou() { buildSheet(); youSheet.hidden = false; youScrim.hidden = false; void youSheet.offsetWidth; youSheet.classList.add('is-open'); youScrim.classList.add('is-open'); }
  function closeYou() { if (!youSheet) return; youSheet.classList.remove('is-open'); youScrim.classList.remove('is-open'); setTimeout(function () { youSheet.hidden = true; youScrim.hidden = true; }, 300); }
  window.addEventListener('hashchange', closeYou);
  function renderBar() {
    if (!bar) return;
    var home = bar.querySelector('[data-nav="home"]'), disc = $('#aqn-discover-btn'), acc = bar.querySelector('[data-nav="account"]');
    var compat = bar.querySelector('[data-nav="compat"]'); if (compat) compat.remove();
    var old = $('#aq-you-item', bar); if (old) old.remove();
    var it = user ? item('aq-you-item', '#for-you', 'لك', ICON_FORYOU) : item('aq-you-item', '#', 'أنت', ICON_YOU, 'button');
    it.id = 'aq-you-item'; it.setAttribute('data-nav', 'you');
    if (!user) it.addEventListener('click', openYou);
    if (user) bar.insertBefore(it, home); else bar.insertBefore(it, disc);
    var on = location.hash === '#for-you' && user; it.classList.toggle('on', !!on);
    if (user) closeYou();
  }
  window.addEventListener('hashchange', function () { var it = $('#aq-you-item'); if (it && user) it.classList.toggle('on', location.hash === '#for-you'); });
  var fy = document.querySelector('#aqn-sheet .aqn-grid a[href="#for-you"]'); if (fy) fy.remove();

  /* ---------------- جرس الإشعارات ---------------- */
  var SEEN = 'aq_notif_seen_v1', articles = null, bellBtn = null, panel = null;
  function seen() { try { return localStorage.getItem(SEEN) || ''; } catch (_) { return ''; } }
  function markSeen() { if (articles && articles[0]) { try { localStorage.setItem(SEEN, articles[0].publishedAt || ''); } catch (_) {} } }
  function unread() { var s = seen(); return (articles || []).filter(function (a) { return a.publishedAt && a.publishedAt > s; }).length; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(d) { try { return new Date(d).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' }); } catch (_) { return ''; } }
  function renderPanel() {
    if (!panel) return;
    var s = seen(), list = (articles || []).slice(0, 5).map(function (a) {
      var fresh = a.publishedAt && a.publishedAt > s;
      return '<a class="aq-n-i' + (fresh ? ' is-new' : '') + '" href="#featured-content/' + esc(a.slug) + '"><span class="aq-n-ic">' + SVG('<path d="M4 5.500C6.500 4.500 9.500 4.500 12 6c2.500-1.500 5.500-1.500 8-.5V19c-2.500-1-5.500-1-8 .5-2.500-1.500-5.500-1.500-8-.5z"/><path d="M12 6v13.500"/>') + '</span><span class="aq-n-t"><b>' + esc(a.title) + '</b><small>مقال جديد · ' + fmt(a.publishedAt) + '</small></span></a>';
    }).join('');
    var top = user
      ? '<a class="aq-n-i is-me" href="#for-you"><span class="aq-n-ic">' + ICON_FORYOU + '</span><span class="aq-n-t"><b>نافذتك اليومية جاهزة</b><small>توقعات برجك وعبورات خريطتك اليوم</small></span></a>'
      : '<a class="aq-n-i is-me" href="#account"><span class="aq-n-ic">' + ICON_YOU + '</span><span class="aq-n-t"><b>سجّل دخولك لإشعارات تخصّك</b><small>طاقتك وتوقعاتك وعبوراتك الشخصية</small></span></a>';
    panel.innerHTML = '<div class="aq-n-h"><b>الإشعارات</b><button type="button" data-n-close aria-label="إغلاق">' + SVG('<path d="M6 6l12 12M18 6 6 18"/>') + '</button></div>' + top + (list || '<p class="aq-n-empty">لا توجد إشعارات جديدة الآن.</p>') + '<a class="aq-n-all" href="#featured-content">كل المحتوى المميز</a>';
  }
  function badge() { if (!bellBtn) return; var n = unread(), b = bellBtn.querySelector('.aq-n-badge'); b.textContent = n > 9 ? '9+' : String(n); b.hidden = n === 0; }
  function togglePanel(v) {
    if (!panel) return; var open = v === undefined ? panel.hidden : v;
    panel.hidden = !open; bellBtn.setAttribute('aria-expanded', String(open));
    if (open) { renderPanel(); } else { markSeen(); badge(); }
  }
  function buildBell() {
    var tools = $('.aqh-tools.hd-act'), search = $('[data-aqh-search]'); if (!tools || !search || $('#aq-bell')) return;
    bellBtn = document.createElement('button'); bellBtn.type = 'button'; bellBtn.id = 'aq-bell'; bellBtn.className = 'aqh-icon aq-bell'; bellBtn.setAttribute('aria-label', 'الإشعارات'); bellBtn.setAttribute('aria-haspopup', 'true'); bellBtn.setAttribute('aria-expanded', 'false');
    bellBtn.innerHTML = BELL + '<i class="aq-n-badge" hidden>0</i>';
    tools.insertBefore(bellBtn, search);
    panel = document.createElement('div'); panel.className = 'aq-notif'; panel.hidden = true; panel.setAttribute('role', 'region'); panel.setAttribute('aria-label', 'الإشعارات');
    document.body.appendChild(panel);
    bellBtn.addEventListener('click', function (e) { e.stopPropagation(); togglePanel(); });
    panel.addEventListener('click', function (e) { if (e.target.closest('[data-n-close]') || e.target.closest('a')) togglePanel(false); e.stopPropagation(); });
    document.addEventListener('click', function () { if (!panel.hidden) togglePanel(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) togglePanel(false); });
    window.addEventListener('hashchange', function () { if (!panel.hidden) togglePanel(false); });
    fetch('assets/data/featured-content.json').then(function (r) { return r.json(); }).then(function (d) {
      var a = Array.isArray(d) ? d : (d.articles || []);
      articles = a.filter(function (x) { return x && x.publishedAt && x.slug; }).sort(function (x, y) { return x.publishedAt < y.publishedAt ? 1 : -1; });
      badge(); renderPanel();
    }).catch(function () { articles = []; });
  }
  function adminChip() {
    var host = $('#acct-user .acct-user-details'); if (!host) return;
    var ex = $('#aq-admin-chip'); var on = !!(window.AqSession && window.AqSession.isAdmin);
    if (!on) { if (ex) ex.remove(); return; }
    if (ex) return;
    var a = document.createElement('a'); a.id = 'aq-admin-chip'; a.className = 'aq-admin-chip'; a.href = '#admin-pay';
    a.innerHTML = SVG('<path d="M12 3l8 3v5c0 5-3.500 8-8 10-4.500-2-8-5-8-10V6z"/><path d="m8.500 12 2.500 2.500 4.500-5"/>') + '<span>صلاحيات المالك · كل شيء مفتوح</span>';
    host.appendChild(a);
  }
  document.addEventListener('aq:admin', adminChip);
  function joinBtn() { var j = $('.aqh-join span'); if (j) { j.removeAttribute('data-i18n-ar'); j.removeAttribute('data-i18n-en'); j.textContent = user ? 'حسابي' : 'انضم الآن'; } }
  document.addEventListener('aq:session', function (e) { user = e.detail && e.detail.user; renderBar(); renderPanel(); joinBtn(); });
  function init() { user = (window.AqSession && window.AqSession.user) || null; renderBar(); buildBell(); joinBtn(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
