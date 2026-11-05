/* محتوى مميز — القائمة + صفحة القراءة (مصدر واحد: assets/data/featured-content.json) */
(function () {
  'use strict';
  var SRC = 'assets/data/featured-content.json', CK = 'aq-fc-cache', PAGE = 6;
  var CATS = ['الكل', 'الأبراج', 'الكواكب', 'القمر', 'العبور', 'التراجعات', 'مصفوفة القدر', 'مسار الحياة', 'العلاقات', 'الرموز'];
  var list = document.getElementById('featured-content'), reader = document.getElementById('featured-reader');
  if (!list || !reader) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DATA = null, offline = false, loadState = 'idle', st = { cat: 'الكل', q: '', shown: PAGE }, internal = 0, toastEl, toastT;
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
  var ICO = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4h12v16l-6-4-6 4z"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.2 11l7.6-4M8.2 13l7.6 4"/></svg>'
  };
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) { return String(s || '').toLowerCase().replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[ؤئ]/g, 'ء').replace(/\s+/g, ' ').trim(); }
  function fmtDate(d) { try { return new Date(d + 'T12:00:00').toLocaleDateString('ar-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' }); } catch (e) { return d || ''; } }
  function meta(a) { return '<span>' + esc(fmtDate(a.publishedAt)) + '</span><span>' + esc(a.readingTime) + ' دقائق قراءة</span>'; }
  function toast(m) { if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'fc-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); } toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 2400); }
  function bySlug(s) { return (DATA || []).filter(function (a) { return a.slug === s; })[0]; }
  function url(slug) { return location.origin + location.pathname + '#featured-content/' + slug; }

  /* ---------- البيانات: شبكة ← كاش محلي ---------- */
  function load() {
    loadState = 'loading'; render();
    return fetch(SRC, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) {
      DATA = (j && j.articles) || []; offline = false; loadState = 'ready';
      try { localStorage.setItem(CK, JSON.stringify(DATA)); } catch (e) { }
    }).catch(function () {
      var c = null; try { c = JSON.parse(localStorage.getItem(CK) || 'null'); } catch (e) { }
      if (c && c.length) { DATA = c; offline = true; loadState = 'ready'; } else loadState = 'error';
    }).then(function () { render(); route(); window.dispatchEvent(new CustomEvent('fc:ready')); });
  }
  window.FeaturedContent = { all: function () { return DATA || []; }, get: bySlug, href: function (s) { return '#featured-content/' + s; } };

  /* ---------- التصفية والبحث ---------- */
  function filtered() {
    var q = norm(st.q);
    return (DATA || []).filter(function (a) {
      if (st.cat !== 'الكل' && a.category !== st.cat) return false;
      if (!q) return true;
      return norm([a.title, a.category, a.excerpt, (a.keywords || []).join(' ')].join(' ')).indexOf(q) > -1;
    });
  }
  function card(a, i) {
    return '<article class="fc-card" data-content-id="' + esc(a.id) + '" data-content-type="article" data-slug="' + esc(a.slug) + '" data-category="' + esc(a.category) + '" style="--d:' + Math.min(i, 8) * 70 + 'ms">' +
      '<div class="fc-card-img"><img src="' + esc(a.coverImage) + '" alt="' + esc(a.coverAlt) + '" loading="lazy" decoding="async" width="640" height="360"></div>' +
      '<div class="fc-card-b"><span class="fc-cat">' + esc(a.category) + '</span><h3><a href="#featured-content/' + esc(a.slug) + '">' + esc(a.title) + '</a></h3><p>' + esc(a.excerpt) + '</p>' +
      '<div class="fc-card-f"><div class="fc-meta">' + meta(a) + '</div><span class="fc-go" aria-hidden="true">' + ARROW + '</span></div></div></article>';
  }
  function pick() {
    var a = (DATA || []).filter(function (x) { return x.featured; })[0] || (DATA || [])[0]; if (!a) return '';
    return '<section class="fc-pick" aria-labelledby="fc-pick-t" data-content-id="' + esc(a.id) + '" data-content-type="article" data-slug="' + esc(a.slug) + '" data-category="' + esc(a.category) + '">' +
      '<div class="fc-pick-txt"><span class="fc-flag">اختيار المحررين</span><h2 id="fc-pick-t">' + esc(a.title) + '</h2><p>' + esc(a.excerpt) + '</p>' +
      '<div class="fc-meta"><span>' + esc(a.category) + '</span>' + meta(a) + '</div><a class="fc-btn" href="#featured-content/' + esc(a.slug) + '"><span>اقرأ المحتوى</span>' + ARROW + '</a></div>' +
      '<div class="fc-pick-img"><img src="' + esc(a.coverImage) + '" alt="' + esc(a.coverAlt) + '" decoding="async"></div></section>';
  }

  /* ---------- رسم القائمة ---------- */
  function render() {
    var host = $('#fc-list-body'); if (!host) return;
    var h = '';
    if (loadState === 'loading' || loadState === 'idle') {
      h = '<div class="fc-grid" aria-busy="true">' + '<div class="fc-skel"></div>'.repeat(3) + '</div>';
      host.innerHTML = h; return;
    }
    if (loadState === 'error') {
      host.innerHTML = '<div class="fc-grid"><div class="fc-msg" role="alert"><p>تعذر تحميل المحتوى حاليًا. حاول مرة أخرى.</p><button type="button" class="fc-btn" data-fc-retry><span>إعادة المحاولة</span></button></div></div>'; return;
    }
    var items = filtered(), showPick = st.cat === 'الكل' && !st.q;
    h += offline ? '<p class="fc-offline" role="status">أنت تتصفح نسخة محفوظة من المحتوى بسبب ضعف الاتصال.</p>' : '';
    h += showPick ? pick() : '';
    h += '<div class="fc-tools"><div class="fc-search" role="search"><label class="sr-only" for="fc-q" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">ابحث في المحتوى</label>' + ICO.search +
      '<input id="fc-q" type="search" autocomplete="off" placeholder="ابحث بالعنوان أو التصنيف أو الكلمة" value="' + esc(st.q) + '"><button type="button" data-fc-clear aria-label="مسح البحث"' + (st.q ? '' : ' hidden') + '>' + ICO.x + '</button></div>' +
      '<div class="fc-filters" role="group" aria-label="تصنيفات المحتوى" id="fc-filters">' + CATS.map(function (c) { return '<button type="button" class="fc-chip" data-cat="' + esc(c) + '" aria-pressed="' + (c === st.cat) + '">' + esc(c) + '</button>'; }).join('') + '</div></div>';
    h += '<p class="fc-count" id="fc-count" role="status" aria-live="polite"></p><div class="fc-grid" id="fc-grid"></div><div class="fc-more" id="fc-more"></div>';
    h += '<div class="fc-back-cta"><a class="fc-btn" href="#home"><span>العودة إلى الرئيسية</span>' + ARROW + '</a></div>';
    host.innerHTML = h; paintGrid(); bindTools();
  }
  function paintGrid() {
    var items = filtered(), g = $('#fc-grid'), more = $('#fc-more'), cnt = $('#fc-count'); if (!g) return;
    if (!items.length) {
      g.innerHTML = '<div class="fc-msg"><p>' + (st.q ? 'لا توجد نتائج مطابقة لـ «' + esc(st.q) + '». جرّب كلمة أخرى أو امسح البحث.' : 'لا يوجد محتوى في هذا التصنيف حاليًا. استكشف التصنيفات الأخرى أو عد لاحقًا.') + '</p>' +
        '<button type="button" class="fc-ghost" data-fc-reset><span>عرض كل المحتوى</span></button></div>';
      more.innerHTML = ''; cnt.textContent = 'لا توجد نتائج'; return;
    }
    g.innerHTML = items.slice(0, st.shown).map(card).join('');
    cnt.textContent = items.length + (items.length === 1 ? ' مادة' : items.length === 2 ? ' مادتان' : items.length <= 10 ? ' مواد' : ' مادة');
    more.innerHTML = items.length > st.shown ? '<button type="button" class="fc-ghost" data-fc-more><span>عرض المزيد</span></button>' : '';
  }
  function bindTools() {
    var f = $('#fc-filters'), q = $('#fc-q'), t;
    f.addEventListener('click', function (e) {
      var b = e.target.closest('.fc-chip'); if (!b || f._moved) return;
      st.cat = b.getAttribute('data-cat'); st.shown = PAGE; save();
      [].forEach.call(f.children, function (c) { c.setAttribute('aria-pressed', c === b); });
      var g = $('#fc-grid'); g.classList.add('is-loading'); setTimeout(function () { g.classList.remove('is-loading'); paintGrid(); showPickFor(); }, reduce ? 0 : 140);
    });
    f.addEventListener('keydown', function (e) {
      var k = e.key, c = [].slice.call(f.children), i = c.indexOf(document.activeElement); if (i < 0) return;
      var n = k === 'ArrowLeft' ? i + 1 : k === 'ArrowRight' ? i - 1 : k === 'Home' ? 0 : k === 'End' ? c.length - 1 : -1;
      if (n >= 0 && c[n]) { e.preventDefault(); c[n].focus(); }
    });
    var d = null;
    f.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; d = { x: e.clientX, s: f.scrollLeft }; f._moved = false; });
    window.addEventListener('pointermove', function (e) { if (!d) return; var dx = e.clientX - d.x; if (Math.abs(dx) > 5) { f._moved = true; f.classList.add('is-drag'); } if (f._moved) f.scrollLeft = d.s - dx; });
    window.addEventListener('pointerup', function () { if (!d) return; d = null; f.classList.remove('is-drag'); setTimeout(function () { f._moved = false; }, 0); });
    q.addEventListener('input', function () {
      var v = q.value; $('[data-fc-clear]').hidden = !v; clearTimeout(t);
      t = setTimeout(function () { st.q = v; st.shown = PAGE; save(); paintGrid(); showPickFor(); }, 220);
    });
  }
  function showPickFor() { var p = $('.fc-pick'), want = st.cat === 'الكل' && !st.q; if (p) p.hidden = !want; else if (want) render(); }
  function save() { try { sessionStorage.setItem('aq-fc-state', JSON.stringify({ c: st.cat, q: st.q })); } catch (e) { } }
  (function restore() { try { var s = JSON.parse(sessionStorage.getItem('aq-fc-state') || 'null'); if (s) { st.cat = CATS.indexOf(s.c) > -1 ? s.c : 'الكل'; st.q = s.q || ''; } } catch (e) { } })();

  list.addEventListener('click', function (e) {
    if (e.target.closest('[data-fc-retry]')) { load(); return; }
    if (e.target.closest('[data-fc-more]')) { st.shown += PAGE; paintGrid(); return; }
    if (e.target.closest('[data-fc-reset]') || e.target.closest('[data-fc-clear]')) { st.q = ''; st.cat = e.target.closest('[data-fc-reset]') ? 'الكل' : st.cat; st.shown = PAGE; save(); render(); return; }
    var a = e.target.closest('a[href^="#featured-content/"]'); if (a) internal++;
  });

  /* ---------- صفحة القراءة ---------- */
  function related(a) {
    var out = [], seen = { }; seen[a.slug] = 1;
    function add(x) { if (x && !seen[x.slug] && out.length < 3) { seen[x.slug] = 1; out.push(x); } }
    (DATA || []).filter(function (x) { return x.category === a.category; }).forEach(add);
    (a.related || []).forEach(function (s) { add(bySlug(s)); });
    (DATA || []).forEach(add);
    return out;
  }
  function body(a) {
    var rel = related(a)[0], h2n = 0, did = false;
    return (a.body || []).map(function (b) {
      if (b.t === 'h2') { h2n++; var pre = ''; if (h2n === 2 && rel && !did) { did = true; pre = '<aside class="fc-inline" data-content-type="article"><small>اقرأ أيضًا</small><a href="#featured-content/' + esc(rel.slug) + '">' + esc(rel.title) + '</a></aside>'; } return pre + '<h2>' + esc(b.x) + '</h2>'; }
      if (b.t === 'quote') return '<blockquote>' + esc(b.x) + '</blockquote>';
      if (b.t === 'ul') return '<ul>' + b.x.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>';
      if (b.t === 'cta') return '<p><a class="fc-btn" href="' + esc(b.href) + '"><span>' + esc(b.x) + '</span>' + ARROW + '</a></p>';
      return '<p>' + esc(b.x) + '</p>';
    }).join('');
  }
  function savedKey(uid) { return 'aqh-saved:' + (uid || 'guest'); }
  function getUser() {
    return new Promise(function (res) {
      try { var s = window.aqeeqSupabase; if (!s || !s.auth) return res(null); s.auth.getSession().then(function (r) { res(r && r.data && r.data.session ? r.data.session.user : null); }, function () { res(null); }); } catch (e) { res(null); }
    });
  }
  function getSaved(uid) { try { return JSON.parse(localStorage.getItem(savedKey(uid)) || '[]'); } catch (e) { return []; } }

  function showReader(slug) {
    var a = bySlug(slug), host = $('#fc-reader-body');
    reader.classList.add('fc-open'); reader.scrollTop = 0;
    if (!a) {
      host.innerHTML = '<div class="fc-art"><div class="fc-msg"><p>هذا المحتوى غير متاح حاليًا.</p><a class="fc-btn" href="#featured-content"><span>رجوع إلى المحتوى المميز</span>' + ARROW + '</a></div></div>';
      document.title = 'محتوى غير متاح | AQEQ ASTRO'; return;
    }
    document.title = a.title + ' | AQEQ ASTRO';
    var rel = related(a);
    host.innerHTML =
      '<ol class="fc-crumb" aria-label="مسار التنقل" style="width:min(720px,100% - 40px);margin-inline:auto;margin-bottom:28px"><li><a href="#home">الرئيسية</a></li><li><a href="#featured-content">محتوى مميز</a></li><li aria-current="page">' + esc(a.category) + '</li></ol>' +
      '<article class="fc-art" data-content-id="' + esc(a.id) + '" data-content-type="article" data-slug="' + esc(a.slug) + '" data-category="' + esc(a.category) + '">' +
      '<header class="fc-art-hd"><div class="fc-meta"><span class="fc-cat">' + esc(a.category) + '</span>' + meta(a) + '</div><h1 id="fc-art-title" tabindex="-1">' + esc(a.title) + '</h1><p class="fc-intro">' + esc(a.excerpt) + '</p></header></article>' +
      '<div class="fc-hero-img"><img src="' + esc(a.coverImage) + '" alt="' + esc(a.coverAlt) + '" decoding="async"></div>' +
      '<div class="fc-art"><div class="fc-body">' + body(a) + '</div>' +
      '<div class="fc-note"><b>ملاحظة تحريرية:</b> ' + esc(a.note || '') + '</div>' +
      '<div class="fc-actions"><button type="button" class="fc-ghost" data-fc-back aria-label="رجوع إلى المحتوى المميز">' + ARROW + '<span>رجوع إلى المحتوى المميز</span></button>' +
      '<button type="button" class="fc-ghost" data-fc-save aria-pressed="false" aria-label="حفظ المقال">' + ICO.save + '<span>حفظ المقال</span></button>' +
      '<span class="fc-share"><button type="button" class="fc-ghost" data-fc-share aria-haspopup="menu" aria-expanded="false" aria-label="مشاركة المقال">' + ICO.share + '<span>مشاركة المقال</span></button>' +
      '<div class="fc-menu" role="menu" hidden><button type="button" role="menuitem" data-fc-copy>نسخ الرابط</button>' +
      '<a role="menuitem" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(a.title + ' ' + url(a.slug)) + '">واتساب</a>' +
      '<a role="menuitem" target="_blank" rel="noopener" href="https://t.me/share/url?url=' + encodeURIComponent(url(a.slug)) + '&text=' + encodeURIComponent(a.title) + '">تيليجرام</a>' +
      '<a role="menuitem" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?url=' + encodeURIComponent(url(a.slug)) + '&text=' + encodeURIComponent(a.title) + '">إكس</a></div></span>' +
      '<span class="fc-saved" role="status"></span></div></div>' +
      '<section class="fc-related" aria-labelledby="fc-rel-t"><h2 id="fc-rel-t">محتوى ذو صلة</h2><div class="fc-grid">' + rel.map(card).join('') + '</div></section>' +
      '<div class="fc-back-cta"><a class="fc-btn" href="#featured-content"><span>العودة إلى المحتوى المميز</span>' + ARROW + '</a></div>';
    var sv = $('[data-fc-save]', host), msg = $('.fc-saved', host);
    getUser().then(function (u) { var on = getSaved(u && u.id).indexOf(slug) > -1; sv.setAttribute('aria-pressed', on); $('span', sv).textContent = on ? 'محفوظ' : 'حفظ المقال'; sv._u = u; });
    sv.addEventListener('click', function () {
      getUser().then(function (u) {
        if (!u) { msg.innerHTML = 'سجّل الدخول لحفظ المقال. <a href="#account">تسجيل الدخول</a>'; return; }
        var l = getSaved(u.id), k = l.indexOf(slug), on = k === -1; if (on) l.push(slug); else l.splice(k, 1);
        try { localStorage.setItem(savedKey(u.id), JSON.stringify(l)); } catch (e) { }
        sv.setAttribute('aria-pressed', on); $('span', sv).textContent = on ? 'محفوظ' : 'حفظ المقال'; msg.textContent = on ? 'تم الحفظ' : '';
      });
    });
    var sh = $('[data-fc-share]', host), menu = $('.fc-menu', host);
    sh.addEventListener('click', function () {
      if (navigator.share && matchMedia('(hover: none)').matches) { navigator.share({ title: a.title, url: url(slug) }).catch(function () { }); return; }
      var o = menu.hidden; menu.hidden = !o; sh.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    $('[data-fc-copy]', host).addEventListener('click', function () {
      var done = function () { menu.hidden = true; sh.setAttribute('aria-expanded', 'false'); toast('تم نسخ الرابط'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url(slug)).then(done, done);
      else { var t = document.createElement('textarea'); t.value = url(slug); document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) { } t.remove(); done(); }
    });
    $('[data-fc-back]', host).addEventListener('click', goBack);
    var h1 = $('#fc-art-title', host); if (h1) h1.focus({ preventScroll: true });
  }
  function goBack() { if (internal > 0) { internal--; history.back(); } else location.hash = '#featured-content'; }
  reader.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#featured-content/"]'); if (a) internal++;
    if (!e.target.closest('.fc-share')) { var m = $('.fc-menu', reader); if (m && !m.hidden) { m.hidden = true; var b = $('[data-fc-share]', reader); if (b) b.setAttribute('aria-expanded', 'false'); } }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && reader.classList.contains('fc-open')) { var m = $('.fc-menu', reader); if (m && !m.hidden) { m.hidden = true; return; } goBack(); } });

  /* ---------- التوجيه ---------- */
  function route() {
    var h = decodeURIComponent(location.hash || ''), m;
    if ((m = /^#article-([\w-]+)$/.exec(h))) { location.replace('#featured-content/' + m[1]); return; }
    if ((m = /^#featured-content\/([\w-]+)$/.exec(h))) {
      list.classList.add('fc-open');
      if (loadState === 'ready') showReader(m[1]); else { reader.classList.add('fc-open'); }
      return;
    }
    reader.classList.remove('fc-open');
    var on = h === '#featured-content';
    list.classList.toggle('fc-open', on);
    if (on) { document.title = 'محتوى مميز | AQEQ ASTRO'; }
  }
  window.addEventListener('hashchange', route);
  render(); route(); load();
})();
