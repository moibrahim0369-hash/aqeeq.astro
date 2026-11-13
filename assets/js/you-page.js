/* صفحة «أنت» بعد تسجيل الدخول: صفحة مستقلة (عبوراتك + نمطك + المجالات). واجهة فقط، النصوص مؤقتة. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var SVG = function (p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
  var DAY = 864e5, MONTH = 30.44 * DAY;
  var DOMAINS = [
    { id: 'love', t: 'علاقاتك', s: 'الجذب والقرب وما يخصّ شريكك', i: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/>' },
    { id: 'self', t: 'هويتك ومصيرك', s: 'من أنت وإلى أين تمضي', i: '<circle cx="12" cy="8" r="3.500"/><path d="M5 20a7 7 0 0 1 14 0"/>' },
    { id: 'work', t: 'عملك وبيتك', s: 'مسارك المهني وأمانك الداخلي', i: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>' }
  ];
  var ST = { all: false, tab: 'transits', year: new Date().getFullYear(), view: null, memo: null };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var user = function () { return (window.AqSession && window.AqSession.user) || null; };
  var natal = function () { try { var n = window.AqeeqChartContext && window.AqeeqChartContext.getOrPrefill(); return n && n.ch ? n.ch : null; } catch (e) { return null; } };
  var fmtM = function (ms) { return new Date(ms).toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' }); };
  var fmtD = function (ms) { return new Date(ms).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }); };
  var domOf = function (id) { return DOMAINS.filter(function (d) { return d.id === id; })[0]; };
  function selMs() { return ST.year === new Date().getFullYear() ? Date.now() : Date.UTC(ST.year, 6, 1); }
  function allCycles() {
    var ch = natal(); if (!ch || !window.AqeeqYou || typeof Astro === 'undefined') return null;
    var key = Math.floor(selMs() / DAY) + '|' + ch.bodies[0].lon;
    if (!ST.memo || ST.memo.k !== key) ST.memo = { k: key, list: window.AqeeqYou.cycles(ch, Math.floor(selMs() / DAY) * DAY) };
    return ST.memo.list;
  }
  function split(list) {
    var now = selMs(), cur = [], up = [];
    list.forEach(function (c) { if (c.start <= now && c.end >= now) cur.push(c); else if (c.start > now && c.start <= now + 365 * DAY) up.push(c); });
    cur.sort(function (a, b) { return a.end - b.end; }); up.sort(function (a, b) { return a.start - b.start; });
    return { cur: cur, up: up };
  }
  function ring(c, up) {
    var now = selMs(), left = Math.max(0, c.end - now), n, u;
    if (up) { n = Math.max(1, Math.round((c.start - now) / MONTH)); u = 'شهر'; } else { n = left > 2 * MONTH ? Math.round(left / MONTH) : Math.max(1, Math.round(left / DAY)); u = left > 2 * MONTH ? 'شهر' : 'يوم'; }
    var frac = up ? 0.12 : Math.min(1, Math.max(0.05, (now - c.start) / (c.end - c.start))), R = 38, L = 2 * Math.PI * R;
    return '<div class="yp-ring' + (up ? ' up' : '') + '"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="bg" cx="50" cy="50" r="' + R + '"/><circle class="fg" cx="50" cy="50" r="' + R + '" stroke-dasharray="' + (L * frac).toFixed(1) + ' ' + L.toFixed(1) + '" transform="rotate(-90 50 50)"/></svg><span><i>' + (up ? 'بعد' : 'باقي') + '</i><b>' + n + '</b><i>' + u + '</i></span></div>';
  }
  function cardHtml(c, up) {
    var peak = c.peaks[0] ? 'ذروتها: ' + fmtM(c.peaks[0].a) : '';
    return '<button type="button" class="yp-cy' + (up ? ' up' : '') + '" data-cyc="' + esc(c.id + '|' + c.start) + '"><span class="yp-chip">' + c.tn + ' · ' + c.an + ' · ' + c.nn + '</span><span class="yp-cy-t"><b>دورة ' + c.tn + ' مع ' + c.nn + '</b><small>' + fmtM(c.start) + ' – ' + fmtM(c.end) + '</small><small>' + peak + '</small></span>' + ring(c, up) + '</button>';
  }
  function cyclesHtml(list, cap) {
    var s = split(list), h = '';
    var more = '';
    if (cap && !ST.all && (s.cur.length > 6 || s.up.length > 3)) { s.cur = s.cur.slice(0, 6); s.up = s.up.slice(0, 3); more = '<button type="button" class="yp-more" data-all>عرض كل الدورات</button>'; }
    h += '<p class="yp-lab">دورات جارية</p>' + (s.cur.length ? '<div class="yp-list">' + s.cur.map(function (c) { return cardHtml(c, false); }).join('') + '</div>' : '<div class="yp-empty"><p>لا توجد دورة جارية في هذا التاريخ.</p></div>');
    if (s.up.length) h += '<p class="yp-lab">دورات قادمة</p><div class="yp-list">' + s.up.map(function (c) { return cardHtml(c, true); }).join('') + '</div>';
    return h + more;
  }
  function domainCards(label) {
    return '<p class="yp-lab">' + label + '</p><div class="yp-doms">' + DOMAINS.map(function (d) {
      return '<button type="button" class="yp-dom" data-dom="' + d.id + '"><span class="yp-dom-i">' + SVG(d.i) + '</span><span class="yp-dom-t"><b>' + d.t + '</b><small>' + d.s + '</small></span><span class="yp-dom-go">' + SVG('<path d="M15 6l-6 6 6 6"/>') + '</span></button>';
    }).join('') + '</div>';
  }
  function needNatal() { return '<div class="yp-empty">' + SVG('<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3 2"/>') + '<p>أدخل بيانات ميلادك مرة واحدة لتظهر عبورات خريطتك.</p><a class="yp-btn" href="#chart">احسب خريطتك</a></div>'; }
  function timeTravel() {
    var now = new Date().getFullYear(), o = '';
    for (var y = now - 1; y <= now + 2; y++) o += '<option value="' + y + '"' + (y === ST.year ? ' selected' : '') + '>' + y + '</option>';
    return '<div class="yp-tt"><label class="yp-tt-l"><span class="yp-tt-i">' + SVG('<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3 2"/>') + '</span>السفر بالزمن<select id="yp-year" aria-label="اختر السنة">' + o + '</select></label><div class="yp-tt-d"><b>' + (ST.year === now ? 'اليوم' : 'سنة ' + ST.year) + '</b><small>دورات مؤقتة تغيّر فيك شيئًا</small></div></div>';
  }
  function placeCards(dom) {
    var ch = natal(); if (!ch || !window.AqeeqYou) return '';
    var pl = window.AqeeqYou.placements(ch).filter(function (p) { return !dom || p.dom === dom; });
    return pl.map(function (p) { return '<button type="button" class="yp-pl" data-pl="' + p.id + '"><span class="yp-chip blue">' + p.nn + '</span><small>' + p.nn + ' في ' + p.sign + '</small><b>عنوان الصفة قيد الكتابة</b></button>'; }).join('');
  }
  function back(label) { return '<button type="button" class="yp-back" data-back>' + SVG('<path d="M9 6l6 6-6 6"/>') + label + '</button>'; }
  function avatar(u, name) {
    var im = $('#profile-summary-avatar img'), m = u.user_metadata || {}, src = (im && im.getAttribute('src')) || m.avatar_url || m.picture || '';
    return src ? '<img src="' + esc(src) + '" alt="">' : esc(String(name).charAt(0));
  }
  var isOwner = function () { return !!(window.AqSession && window.AqSession.isAdmin); };
  function planChip() {
    return '<span class="yp-plan' + (isOwner() ? ' owner' : '') + '">' + SVG(isOwner() ? '<path d="M12 3l7 3v5c0 4.500-3 8-7 10-4-2-7-5.500-7-10V6z"/><path d="M9 12l2 2 4-4"/>' : '<circle cx="12" cy="12" r="8.500"/><path d="M12 8v8M8 12h8"/>') + (isOwner() ? 'المالك · كل شيء مفتوح' : 'الخطة المجانية') + '</span>';
  }
  function isPrivate() { try { return localStorage.getItem('aqeeq_private_v1') === '1'; } catch (_) { return false; } }
  function settingsHtml() {
    var u = user() || {};
    return back('رجوع') + '<div class="yp-set"><h3>الإعدادات</h3>' +
      '<div class="yp-set-g"><p class="yp-lab">حسابك</p><div class="yp-set-row"><div><b dir="ltr">' + esc(u.email || '') + '</b><small>نوع الاشتراك</small></div>' + planChip() + '</div></div>' +
      '<div class="yp-set-g"><p class="yp-lab">الخصوصية</p><label class="yp-set-row yp-sw"><div><b>حساب خاص</b><small>نص مؤقت: ملفك وقراءاتك لا تظهر لأحد غيرك.</small></div><input type="checkbox" id="yp-private"' + (isPrivate() ? ' checked' : '') + '><span class="yp-sw-t" aria-hidden="true"></span></label></div>' +
      '<div class="yp-set-g"><p class="yp-lab">بياناتك وخريطتك</p><div id="yp-prof-slot"></div></div>' +
      '<button type="button" class="yp-out" data-signout>تسجيل الخروج</button></div>';
  }
  function bodyHtml() {
    var v = ST.view, list;
    if (v && v.set) return settingsHtml();
    if (v && v.cyc) {
      list = allCycles() || []; var c = list.filter(function (x) { return x.id + '|' + x.start === v.cyc; })[0];
      if (c) return back('رجوع') + '<div class="yp-det"><small>' + fmtD(c.start) + ' – ' + fmtD(c.end) + '</small><h3>دورة ' + c.tn + ' مع ' + c.nn + '</h3><span class="yp-chip">' + c.tn + ' · ' + c.an + ' · ' + c.nn + '</span>' +
        '<div class="yp-meta"><div><i>المدة</i><b>' + Math.max(1, Math.round((c.end - c.start) / MONTH)) + ' شهر</b><i>ذروة التأثير</i>' + (c.peaks.length ? c.peaks.map(function (p) { return '<b>' + fmtM(p.a) + (p.b - p.a > 20 * DAY ? ' – ' + fmtM(p.b) : '') + '</b>'; }).join('') : '<b>غير محددة</b>') + '</div>' + ring(c, c.start > selMs()) + '</div>' +
        '<div class="yp-txt"><small>الخلاصة</small><p>نص هذه الدورة قيد الكتابة.</p></div></div>';
    }
    if (v && v.pl) return back('رجوع') + '<div class="yp-det"><small>صفة ثابتة في خريطتك</small><h3>' + esc(v.pl) + '</h3><div class="yp-txt"><small>الخلاصة</small><p>نص هذه الصفة قيد الكتابة.</p></div></div>';
    if (v && v.dom) {
      var d = domOf(v.dom); list = allCycles();
      var mine = list ? list.filter(function (c) { return c.doms.indexOf(v.dom) >= 0; }) : [];
      return back('رجوع') + '<div class="yp-dh"><h3>' + d.t + '</h3><small>' + d.s + '</small></div>' + (list ? cyclesHtml(mine) : needNatal()) + '<p class="yp-lab">صفاتك الثابتة</p><div class="yp-list">' + placeCards(v.dom) + '</div>';
    }
    if (ST.tab === 'transits') { list = allCycles(); return timeTravel() + (list ? cyclesHtml(list, true) : needNatal()) + domainCards('حسب مجال حياتك'); }
    return natal() ? domainCards('صفاتك الثابتة حسب المجال') + '<p class="yp-lab">كل الصفات</p><div class="yp-list">' + placeCards() + '</div>' : needNatal();
  }
  function render() {
    var u = user(), host = $('#fy-body'), sec = $('#for-you'); if (!host) return;
    if (sec) sec.classList.toggle('yp-on', !!u);
    if (!u) return;
    var name = (u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) || (u.email || '').split('@')[0] || 'حسابك';
    var pn = $('#account-profile-completion'), home = $('#acct-user');
    if (pn && home && host.contains(pn)) home.appendChild(pn);
    host.innerHTML = '<div class="yp"><header class="yp-head"><div class="yp-who"><span class="yp-av">' + avatar(u, name) + '</span><div><h2>' + esc(name) + '</h2>' + planChip() + '</div></div>' +
      '<button type="button" class="yp-gear' + (ST.view && ST.view.set ? ' on' : '') + '" data-set aria-label="الإعدادات">' + SVG('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.900 4.900l2.100 2.100M17 17l2.100 2.100M4.900 19.100L7 17M17 7l2.100-2.100"/>') + '</button></header>' +
      '<div class="yp-tabs" role="tablist"><button type="button" role="tab" data-tab="transits" aria-selected="' + (ST.tab === 'transits' && !ST.view) + '">عبوراتك</button><button type="button" role="tab" data-tab="pattern" aria-selected="' + (ST.tab === 'pattern' && !ST.view) + '">نمطك</button></div>' +
      '<div class="yp-body">' + bodyHtml() + '</div></div>';
    if (ST.view && ST.view.set) {
      var slot = $('#yp-prof-slot');
      if (pn && slot) slot.appendChild(pn);
      else if (slot && (ST.tries = (ST.tries || 0) + 1) < 20) setTimeout(function () { if (ST.view && ST.view.set && !$('#yp-prof-slot #account-profile-completion')) render(); }, 400);
    }
  }
  /* بعد الدخول: «حسابي» يفتح صفحتك الكاملة بدل النافذة المنبثقة (إلا شاشة كلمة المرور الجديدة أو الرجوع من الدفع) */
  function route() {
    if (location.hash !== '#account' || !user()) return;
    var rec = $('#acct-recovery'); if (rec && !rec.hidden) return;
    if (/[?&](order|order_id|code)=/.test(location.search)) return;
    var card = $('#acct-user');
    if (card && card.getAttribute('data-profile-complete') === 'false') ST.view = { set: true };
    location.replace('#for-you'); render();
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('#for-you [data-tab],#for-you [data-dom],#for-you [data-cyc],#for-you [data-pl],#for-you [data-back],#for-you [data-all],#for-you [data-set],#for-you [data-signout]'); if (!t) return;
    if (t.hasAttribute('data-signout')) { var so = $('#acct-signout'); if (so) so.click(); return; }
    if (t.hasAttribute('data-set')) { ST.view = ST.view && ST.view.set ? null : { set: true }; ST.tries = 0; render(); window.scrollTo(0, 0); return; }
    if (t.hasAttribute('data-tab')) { ST.tab = t.getAttribute('data-tab'); ST.view = null; }
    else if (t.hasAttribute('data-dom')) ST.view = { dom: t.getAttribute('data-dom'), from: ST.view };
    else if (t.hasAttribute('data-cyc')) ST.view = { cyc: t.getAttribute('data-cyc'), from: ST.view };
    else if (t.hasAttribute('data-pl')) { var id = t.getAttribute('data-pl'), p = window.AqeeqYou.placements(natal()).filter(function (x) { return x.id === id; })[0]; ST.view = { pl: p.nn + ' في ' + p.sign, from: ST.view }; }
    else if (t.hasAttribute('data-all')) ST.all = true;
    else if (t.hasAttribute('data-back')) ST.view = (ST.view && ST.view.from) || null;
    render(); var s = $('#for-you'); if (s) s.scrollTop = 0;
  });
  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'yp-year') { ST.year = +e.target.value; render(); }
    if (e.target && e.target.id === 'yp-private') { try { localStorage.setItem('aqeeq_private_v1', e.target.checked ? '1' : '0'); } catch (_) {} }
  });
  document.addEventListener('aq:session', function () { route(); render(); });
  document.addEventListener('aq:admin', render);
  window.addEventListener('hashchange', function () { route(); if (location.hash === '#for-you') render(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { route(); render(); }); else { route(); render(); }
})();
