/* صفحة «أنت» بعد تسجيل الدخول: صفحة مستقلة (عبوراتك + نمطك + المجالات). واجهة فقط، النصوص مؤقتة. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var SVG = function (p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
  var DAY = 864e5, MONTH = 30.44 * DAY;
  var DOMAINS = [
    { id: 'love', t: 'علاقاتك', s: 'الجذب والقرب وما يخصّ شريكك', i: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/>' },
    { id: 'self', t: 'هويتك ومصيرك', s: 'من أنت وإلى أين تمضي', i: '<circle cx="12" cy="8" r="3.500"/><path d="M5 20a7 7 0 0 1 14 0"/>' },
    { id: 'growth', t: 'نموك وصلابتك', s: 'ما يختبرك ويقوّيك مع الوقت', i: '<path d="M12 21V9"/><path d="M12 13c0-3 2-5 6-5 0 3-2 5-6 5z"/><path d="M12 16c0-2.500-1.800-4-5-4 0 2.500 1.800 4 5 4z"/>' },
    { id: 'work', t: 'عملك وبيتك', s: 'مسارك المهني وأمانك الداخلي', i: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>' }
  ];
  var ST = { all: false, tab: 'home', year: new Date().getFullYear(), view: null, memo: null };
  var TXT = ['sun', 'moon', 'mercury', 'venus', 'mars', 'saturn'];
  function loadTexts() {
    if (ST.ix || ST.ixLoading) return; ST.ixLoading = true;
    Promise.all(TXT.map(function (b) { return fetch('data/interpretations/' + b + '.json?v=20261114b').then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; }); })).then(function (ls) {
      var ix = {}; ls.forEach(function (a) { (Array.isArray(a) ? a : []).forEach(function (e) { if (e && e.id && e.status === 'approved' && e.text) ix[e.id] = e; }); });
      ST.ix = ix; ST.ixLoading = false; render();
    });
  }
  var coreOf = function (p) {
    var ch = natal(); if (!ch || !ST.ix || !ch.known) return null;
    var b = ch.bodies.filter(function (x) { return x.key === p.id; })[0]; if (!b || !b.house) return null;
    var e = ST.ix['natal.core.' + p.id + '.house' + b.house]; return e ? { e: e, house: b.house } : null;
  };
  var headOf = function (e) { var t = String(e.summary || ''); var i = t.indexOf(':'); t = i > -1 ? t.slice(i + 1).trim() : t; var j = t.indexOf('.'); return (j > 8 ? t.slice(0, j) : t); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var user = function () { return (window.AqSession && window.AqSession.user) || null; };
  var natal = function () { try { var n = window.AqeeqChartContext && window.AqeeqChartContext.getMine(); return n && n.ch ? n.ch : null; } catch (e) { return null; } };
  var fmtM = function (ms) { return new Date(ms).toLocaleDateString('ar-EG-u-nu-latn', { month: 'long', year: 'numeric' }); };
  var fmtD = function (ms) { return new Date(ms).toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }); };
  var domOf = function (id) { return DOMAINS.filter(function (d) { return d.id === id; })[0]; };
  function selMs() { return ST.date || Date.now(); }
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
  function unitAr(n, w) { var t = w === 'شهر' ? ['شهر', 'شهران', 'أشهر', 'شهرًا'] : ['يوم', 'يومان', 'أيام', 'يومًا']; return n === 1 ? t[0] : n === 2 ? t[1] : n <= 10 ? t[2] : t[3]; }
  function ring(c, up) {
    var now = selMs(), left = Math.max(0, c.end - now), n, u;
    if (up) { n = Math.max(1, Math.round((c.start - now) / MONTH)); u = unitAr(n, 'شهر'); } else { n = left > 2 * MONTH ? Math.round(left / MONTH) : Math.max(1, Math.round(left / DAY)); u = unitAr(n, left > 2 * MONTH ? 'شهر' : 'يوم'); }
    var frac = up ? 0.12 : Math.min(1, Math.max(0.05, (now - c.start) / (c.end - c.start))), R = 38, L = 2 * Math.PI * R;
    return '<div class="yp-ring' + (up ? ' up' : '') + '"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="bg" cx="50" cy="50" r="' + R + '"/><circle class="fg" cx="50" cy="50" r="' + R + '" stroke-dasharray="' + (L * frac).toFixed(1) + ' ' + L.toFixed(1) + '" transform="rotate(-90 50 50)"/></svg><span><i>' + (up ? 'بعد' : 'باقي') + '</i><b>' + n + '</b><i>' + u + '</i></span></div>';
  }

  /* عناوين وصفية للدورات: طبيعة الكوكب العابر + مجال النقطة المتأثرة */
  var TH = {
    jupiter: { conj: 'بداية تتّسع', soft: 'باب مفتوح', hard: 'حماس يتجاوز حدّه' },
    saturn: { conj: 'لحظة جدّية', soft: 'ثبات يُبنى', hard: 'اختبار للصبر' },
    uranus: { conj: 'تغيير مفاجئ', soft: 'تحرّر مما اعتدته', hard: 'تمرّد على الثابت' },
    neptune: { conj: 'ضباب يطلب وضوحًا', soft: 'حدس يزداد', hard: 'وهم يُختبر' },
    pluto: { conj: 'إعادة بناء من الجذور', soft: 'قوة هادئة تتشكّل', hard: 'مواجهة ما تخفيه' },
    truenode: { conj: 'اتجاه جديد', hard: 'شدّ بين القديم والجديد' },
    chiron: { conj: 'جرح يطلب الالتفات', soft: 'شفاء بطيء', hard: 'حساسية قديمة تُستثار' }
  };
  var AREA = { sun: 'هويتك', moon: 'مشاعرك', mercury: 'تفكيرك', venus: 'علاقاتك وما تحب', mars: 'دافعك', jupiter: 'ثقتك وتوسّعك', saturn: 'مسؤولياتك', asc: 'حضورك أمام الناس', mc: 'مسارك المهني', desc: 'شريكك', ic: 'بيتك وجذورك' };
  function titleOf(c) {
    var cls = c.asp === 'conj' ? 'conj' : (c.asp === 'sext' || c.asp === 'tri' ? 'soft' : 'hard'), t = TH[c.t] || {};
    return (t[cls] || t.hard || t.conj || 'دورة مؤقتة') + ' في ' + (AREA[c.n] || c.nn);
  }
  function astroLine(c) { return c.tn + ' ' + c.an + ' ' + c.nn + ' في خريطتك'; }
  function slidesOf(text) {
    return String(text || '').split(/\n\n+/).map(function (p) {
      var m = /^\*\*(.+?)\*\*\n?([\s\S]*)$/.exec(p.trim()); return m ? { t: m[1], b: m[2].trim() } : { t: '', b: p.trim() };
    }).filter(function (x) { return x.b || x.t; });
  }
  function readerOpen(title, kicker, text) {
    var sl = slidesOf(text); if (!sl.length) return;
    var old = document.getElementById('yp-reader'); if (old) old.remove();
    var el = document.createElement('div'); el.id = 'yp-reader'; el.className = 'yp-rd'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML = '<div class="yp-rd-top"><button type="button" class="yp-rd-x" data-rd-close aria-label="إغلاق">' + SVG('<path d="M6 6l12 12M18 6L6 18"/>') + '</button><div class="yp-rd-k"><small>' + esc(kicker) + '</small><b>' + esc(title) + '</b></div></div>' +
      '<div class="yp-rd-track" tabindex="0">' + sl.map(function (x, i) { return '<section class="yp-rd-s"><i dir="ltr">' + (i + 1) + ' / ' + sl.length + '</i>' + (x.t ? '<h4>' + esc(x.t) + '</h4>' : '') + '<p>' + esc(x.b).replace(/\n/g, '<br>') + '</p></section>'; }).join('') + '</div>' +
      '<div class="yp-rd-dots">' + sl.map(function (_, i) { return '<span' + (i === 0 ? ' class="on"' : '') + '></span>'; }).join('') + '</div>' +
      '<div class="yp-rd-nav"><button type="button" data-rd="1">السابق</button><button type="button" data-rd="-1" class="go">التالي</button></div>';
    document.body.appendChild(el); document.documentElement.classList.add('yp-rd-open');
    var tr = el.querySelector('.yp-rd-track'), dots = el.querySelectorAll('.yp-rd-dots span');
    function idx() { return Math.round(Math.abs(tr.scrollLeft) / tr.clientWidth); }
    tr.addEventListener('scroll', function () { var k = idx(); dots.forEach(function (d, j) { d.classList.toggle('on', j === k); }); });
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-rd-close]')) { readerClose(); return; }
      var b = e.target.closest('[data-rd]'); if (!b) return;
      var k = Math.min(sl.length - 1, Math.max(0, idx() + (b.getAttribute('data-rd') === '-1' ? 1 : -1)));
      tr.scrollTo({ left: -k * tr.clientWidth, behavior: 'smooth' });
    });
  }
  function readerClose() { var el = document.getElementById('yp-reader'); if (el) el.remove(); document.documentElement.classList.remove('yp-rd-open'); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') readerClose(); });
  window.addEventListener('hashchange', readerClose);
  function phases(c) {
    var pk = c.peaks[0], a = pk ? pk.a : (c.start + c.end) / 2, b = pk ? Math.max(pk.b, a) : a;
    return '<div class="yp-ph">' + [['الاقتراب', c.start, a], ['الذروة', a, b], ['الانحسار', b, c.end]].map(function (x) {
      return '<div><b>' + x[0] + '</b><small>' + fmtM(x[1]) + (x[2] - x[1] > 20 * DAY ? ' – ' + fmtM(x[2]) : '') + '</small></div>';
    }).join('') + '</div>';
  }

  /* حفظ ومشاركة: على هذا الجهاز فقط، ويُمسح عند الخروج */
  var SAVE_KEY = 'aqeeq_yp_saved_v1';
  function saved() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || '[]'); } catch (e) { return []; } }
  function actBar(id, title) {
    var on = saved().indexOf(id) >= 0;
    return '<div class="yp-act"><button type="button" class="yp-ab' + (on ? ' on' : '') + '" data-save="' + esc(id) + '" aria-pressed="' + on + '">' + SVG('<path d="M7 4h10v16l-5-3.500L7 20z"/>') + '<span>' + (on ? 'محفوظة' : 'احفظ') + '</span></button>' +
      '<button type="button" class="yp-ab" data-share="' + esc(title) + '">' + SVG('<circle cx="18" cy="5.500" r="2.500"/><circle cx="6" cy="12" r="2.500"/><circle cx="18" cy="18.500" r="2.500"/><path d="M8.300 10.800l7.400-4M8.300 13.200l7.400 4"/>') + '<span>شارك</span></button></div>';
  }
  function cardHtml(c, up) {
    var peak = c.peaks[0] ? 'ذروتها: ' + fmtM(c.peaks[0].a) : '';
    return '<button type="button" class="yp-cy' + (up ? ' up' : '') + '" data-cyc="' + esc(c.id + '|' + c.start) + '">' + (up ? '<em class="yp-soon">قريبًا</em>' : '') + '<span class="yp-chip">' + c.tn + ' · ' + c.an + ' · ' + c.nn + '</span><span class="yp-cy-t"><b>' + esc(titleOf(c)) + '</b><small>' + fmtM(c.start) + ' – ' + fmtM(c.end) + '</small><small>' + peak + '</small></span>' + ring(c, up) + '</button>';
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
      return '<button type="button" class="yp-dom" data-dom="' + d.id + '"><span class="yp-dom-i" data-d="' + d.id + '">' + SVG(d.i) + '</span><span class="yp-dom-t"><b>' + d.t + '</b><small>' + d.s + '</small></span><span class="yp-dom-go">' + SVG('<path d="M15 6l-6 6 6 6"/>') + '</span></button>';
    }).join('') + '</div>';
  }
  function needNatal(m) { return '<div class="yp-empty">' + SVG('<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3 2"/>') + '<p>' + (m || 'أدخل بيانات ميلادك مرة واحدة لتظهر عبورات خريطتك.') + '</p><a class="yp-btn" href="#chart">احسب خريطتك</a></div>'; }
  var MON = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  function timeTravel() {
    var d = new Date(selMs()), today = !ST.date;
    return '<div class="yp-tt"><button type="button" class="yp-tt-l" data-tt-open aria-haspopup="dialog"><span class="yp-tt-i">' + SVG('<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3 2"/>') + '</span>السفر بالزمن</button><div class="yp-tt-d"><b>' + (today ? 'اليوم' : fmtD(selMs())) + '</b><small>' + (today ? 'دورات مؤقتة تغيّر فيك شيئًا' : 'تعرض دورات هذا التاريخ') + '</small></div></div>' + (today ? '' : '<p class="yp-asof">كما في ' + fmtD(selMs()) + '</p>');
  }
  function ttSheet() {
    var old = $('#yp-ttsheet'); if (old) old.remove();
    var d = new Date(selMs()), y0 = new Date().getFullYear(), o = function (a, b, cur, lab) { var h = ''; for (var k = a; k <= b; k++) h += '<option value="' + k + '"' + (k === cur ? ' selected' : '') + '>' + (lab ? lab(k) : k) + '</option>'; return h; };
    var el = document.createElement('div'); el.id = 'yp-ttsheet'; el.className = 'yp-tts';
    el.innerHTML = '<div class="yp-tts-bd" data-tt-close></div><div class="yp-tts-sh" role="dialog" aria-modal="true" aria-label="السفر بالزمن"><span class="yp-tts-g"></span><h3>السفر بالزمن</h3><p>اختر تاريخًا لترى دورات خريطتك فيه.</p>' +
      '<div class="yp-tts-r"><label>اليوم<select id="yp-td">' + o(1, 31, d.getDate()) + '</select></label><label>الشهر<select id="yp-tm">' + o(0, 11, d.getMonth(), function (k) { return MON[k]; }) + '</select></label><label>السنة<select id="yp-ty">' + o(y0 - 1, y0 + 2, d.getFullYear()) + '</select></label></div>' +
      '<button type="button" class="yp-cta" data-tt-set>تطبيق التاريخ</button><button type="button" class="yp-more" data-tt-today>العودة إلى اليوم</button></div>';
    document.body.appendChild(el); requestAnimationFrame(function () { el.classList.add('on'); });
  }
  function ttClose() { var el = $('#yp-ttsheet'); if (!el) return; el.classList.remove('on'); setTimeout(function () { el.remove(); }, 250); }
  function placeCards(dom, max) {
    var ch = natal(); if (!ch || !window.AqeeqYou) return '';
    var pl = window.AqeeqYou.placements(ch).filter(function (p) { return !dom || p.dom === dom; });
    if (max) pl = pl.slice(0, max);
    return pl.map(function (p) {
      var c = coreOf(p); if (!c) return '';
      return '<button type="button" class="yp-pl" data-pl="' + p.id + '"><span class="yp-pl-h"><span class="yp-chip blue">' + p.nn + '</span><small>' + p.sign + ' · البيت ' + c.house + '</small></span><b>' + esc(headOf(c.e)) + '</b></button>';
    }).join('');
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

  /* تفضيلات التنبيهات: تُحفظ على هذا الجهاز، والمعاينة توضّح شكل الرسالة */
  var NF_KEY = 'aqeeq_yp_notif_v1', NF_ITEMS = [['day', 'سماء يومك', 'بطاقة قصيرة كل صباح عن طاقة يومك.', 'يومك يطلب منك شيئًا واحدًا: ابدأ به قبل أي شيء.'], ['near', 'عبور يقترب', 'تنبيه قبل أن تبدأ دورة جديدة في خريطتك.', 'دورة جديدة تقترب منك. جهّز نفسك قبل أن تصل.'], ['peak', 'ذروة العبور', 'إشارة حين تبلغ دورة جارية أقوى لحظاتها.', 'الدورة التي تمرّ بك بلغت ذروتها هذا الأسبوع.']];
  function nfGet() { var d = { day: true, near: true, peak: false, time: '08:00' }; try { var o = JSON.parse(localStorage.getItem(NF_KEY) || '{}'); for (var k in o) d[k] = o[k]; } catch (e) {} return d; }
  function nfSet(k, v) { var o = nfGet(); o[k] = v; try { localStorage.setItem(NF_KEY, JSON.stringify(o)); } catch (e) {} }
  function nfHtml() {
    var o = nfGet();
    return '<div class="yp-set-g"><p class="yp-lab">التنبيهات</p>' + NF_ITEMS.map(function (x) {
      return '<label class="yp-set-row yp-sw"><div><b>' + x[1] + '</b><small>' + x[2] + '</small></div><input type="checkbox" data-nf="' + x[0] + '"' + (o[x[0]] ? ' checked' : '') + '><span class="yp-sw-t" aria-hidden="true"></span></label>';
    }).join('') +
      '<div class="yp-set-row"><div><b>وقت التنبيه</b><small>الساعة التي تصلك فيها الرسائل.</small></div><select class="yp-nf-t" data-nf-time aria-label="وقت التنبيه">' + ['06:00', '07:00', '08:00', '09:00', '12:00', '18:00', '21:00'].map(function (t) { return '<option value="' + t + '"' + (o.time === t ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></div>' +
      '<button type="button" class="yp-ab yp-nf-pv" data-nf-prev>' + SVG('<path d="M3 12s3.500-6 9-6 9 6 9 6-3.500 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="2.500"/>') + '<span>معاينة التنبيه</span></button></div>';
  }
  function nfPreview() {
    var old = document.getElementById('yp-nfp'); if (old) old.remove();
    var o = nfGet(), on = NF_ITEMS.filter(function (x) { return o[x[0]]; }), it = on[0] || NF_ITEMS[0];
    var el = document.createElement('div'); el.id = 'yp-nfp'; el.className = 'yp-tts'; 
    el.innerHTML = '<div class="yp-tts-bd" data-nfp-x></div><div class="yp-tts-sh" role="dialog" aria-modal="true" aria-label="معاينة التنبيه"><i class="yp-tts-g"></i><h3>هكذا يصلك التنبيه</h3><div class="yp-nfp-c"><span class="yp-nfp-i">' + SVG('<path d="M12 3l2.200 5.600 5.800.500-4.400 3.900 1.400 5.700L12 15.600 7 18.700l1.400-5.700L4 9.100l5.800-.500z"/>') + '</span><div><small>عقيق أسترو · ' + esc(o.time) + '</small><b>' + esc(it[1]) + '</b><p>' + esc(it[3]) + '</p></div></div>' + (on.length ? '' : '<p>كل التنبيهات متوقفة الآن.</p>') + '<button type="button" class="yp-btn" data-nfp-x>تمام</button></div>';
    document.body.appendChild(el); requestAnimationFrame(function () { el.classList.add('on'); });
  }
  function nfClose() { var el = document.getElementById('yp-nfp'); if (!el) return; el.classList.remove('on'); setTimeout(function () { el.remove(); }, 260); }

  /* ---------- هيدر أنت: اليوزر، المحفوظات، صندوق الإشعارات ---------- */
  var UN_KEY = 'aqeeq_username_v1', INB_KEY = 'aqeeq_yp_inbseen_v1';
  function unGet(u) { try { var v = localStorage.getItem(UN_KEY); if (v) return v; } catch (e) {} var b = String((u && u.email) || 'user').split('@')[0].toLowerCase().replace(/[^a-z0-9._]/g, ''); return b.length >= 3 ? b.slice(0, 20) : 'user' + String((u && u.id) || '0').replace(/[^a-z0-9]/gi, '').slice(0, 5).toLowerCase(); }
  var unSynced = '';
  function unSync(u) {
    var sb = window.aqeeqSupabase; if (!u || !sb || !sb.from || unSynced === u.id) return; unSynced = u.id;
    sb.from('usernames').select('username').eq('user_id', u.id).maybeSingle().then(function (r) {
      var n = r && r.data && r.data.username; if (!n) return;
      var old = ''; try { old = localStorage.getItem(UN_KEY) || ''; localStorage.setItem(UN_KEY, n); } catch (e) {}
      if (old !== n) render();
    }, function () {});
  }
  function unOk(v) { return /^[a-z][a-z0-9._]{2,19}$/.test(v); }
  function inbSeen() { try { return JSON.parse(localStorage.getItem(INB_KEY) || '[]'); } catch (e) { return []; } }
  function inbItems() {
    var out = [], now = Date.now(), d = new Date(), key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    if (natal()) out.push({ id: 'sky:' + key, ic: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.600 5.600l1.400 1.400M17 17l1.400 1.400M5.600 18.400 7 17M17 7l1.400-1.400"/>', t: 'سماء يومك جاهزة', x: 'سبع بطاقات قصيرة عن طاقة اليوم تخصّك أنت.', go: 'sky' });
    var cy = allCycles() || [];
    cy.forEach(function (c) {
      var dd = (c.start - now) / DAY;
      if (dd > 0 && dd <= 14) out.push({ id: 'near:' + c.id + c.start, ic: '<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3 2"/>', t: 'عبور يقترب: ' + titleOf(c), x: 'يبدأ ' + fmtD(c.start) + '. اقرأ ما يحمله لك قبل أن يصل.', cyc: c.id + '|' + c.start });
      else if (dd <= 0 && dd > -4 && c.end > now) out.push({ id: 'new:' + c.id + c.start, ic: '<path d="M12 3l2.200 5.600 5.800.500-4.400 3.900 1.400 5.700L12 15.600 7 18.700l1.400-5.700L4 9.100l5.800-.500z"/>', t: 'بدأ عبورك: ' + titleOf(c), x: 'هذه أيام بدايته، وهي الأوضح في الإحساس.', cyc: c.id + '|' + c.start });
    });
    return out;
  }
  function inbUnread() { var sn = inbSeen(); return inbItems().filter(function (i) { return sn.indexOf(i.id) < 0; }).length; }
  function inboxHtml() {
    var sn = inbSeen(), items = inbItems();
    try { localStorage.setItem(INB_KEY, JSON.stringify(items.map(function (i) { return i.id; }))); } catch (e) {}
    if (!items.length) return '<div class="yp-empty">' + SVG('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.500 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>') + '<p>لا جديد الآن. هنا يتجمّع كل ما لم تره: توقّع لك أو رسالة أو عبور يقترب.</p></div>';
    return '<div class="yp-inb">' + items.map(function (i) {
      var a = i.cyc ? 'data-cyc="' + esc(i.cyc) + '"' : 'data-go="' + i.go + '"';
      return '<button type="button" class="yp-inb-i' + (sn.indexOf(i.id) < 0 ? ' new' : '') + '" ' + a + '><span class="yp-inb-ic">' + SVG(i.ic) + '</span><span class="yp-inb-t"><b>' + esc(i.t) + '</b><small>' + esc(i.x) + '</small></span></button>';
    }).join('') + '</div>';
  }
  function savedHtml() {
    var L = saved(), cy = allCycles() || [], h = '', now = Date.now();
    var cards = L.map(function (id) { var c = cy.filter(function (x) { return x.id + '|' + x.start === id; })[0]; return c ? cardHtml(c, c.start > now) : ''; }).join('');
    var uid = (user() || {}).id, arts = [];
    try { arts = JSON.parse(localStorage.getItem('aqh-saved:' + (uid || 'guest')) || '[]'); } catch (e) {}
    var ah = arts.map(function (sl) { var a = window.FeaturedContent && window.FeaturedContent.get(sl); return a ? '<a class="yp-sv-a" href="#featured-content/' + esc(a.slug) + '"><span class="yp-sv-img"><img src="' + esc(a.coverImage) + '" alt="" loading="lazy"></span><span><b>' + esc(a.title) + '</b><small>' + esc(a.category) + '</small></span></a>' : ''; }).join('');
    if (cards) h += '<p class="yp-lab">دورات وقراءات حفظتها</p><div class="yp-list">' + cards + '</div>';
    if (ah) h += '<p class="yp-lab">مقالات مميزة</p><div class="yp-sv-l">' + ah + '</div>';
    return h || '<div class="yp-empty">' + SVG('<path d="M6 4h12v16l-6-4-6 4z"/>') + '<p>لم تحفظ شيئًا بعد. كل ما تحفظه من مقالات وقراءات وما تشتريه سيجتمع هنا.</p></div>';
  }
  function topHtml(u, name) {
    unSync(u); var un = unGet(u), n = inbUnread();
    var ib = function (a, lab, ico, badge) { return '<button type="button" class="yp-ib" ' + a + ' aria-label="' + lab + '">' + SVG(ico) + (badge ? '<i>' + (badge > 9 ? '9+' : badge) + '</i>' : '') + '<em>' + lab + '</em></button>'; };
    return '<header class="yp-top"><button type="button" class="yp-who-b" data-set aria-label="الملف الشخصي"><span class="yp-av yp-av-b"><span class="yp-av-i">' + avatar(u, name) + '</span></span><span class="yp-who-t"><b>' + esc(name) + '</b><small dir="ltr">@' + esc(un) + '</small></span></button>' +
      '<div class="yp-ibs">' + ib('data-sv', 'الحفظ', '<path d="M6 4h12v16l-6-4-6 4z"/>', 0) + ib('data-inb', 'الإشعارات', '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.500 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>', n) + ib('data-tab="settings"', 'الضبط', '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.500M12 18.500V21M3 12h2.500M18.500 12H21M5.600 5.600l1.800 1.800M16.600 16.600l1.800 1.800M5.600 18.400l1.800-1.800M16.600 7.400l1.800-1.800"/>', 0) + '</div></header>';
  }


  /* ---------- نحن: أنت والطرف الآخر (شريك/صديق...) من بياناته فقط، بدون ربط حسابات ---------- */
  var PK = 'aqeeq_yp_partners_v1', RELS = [['partner', 'شريك'], ['friend', 'صديق'], ['family', 'من العائلة'], ['work', 'زميل عمل']];
  function pGet() { try { return JSON.parse(localStorage.getItem(PK) || '[]'); } catch (e) { return []; } }
  function pSet(l) { try { localStorage.setItem(PK, JSON.stringify(l)); } catch (e) {} }
  function relName(k) { var r = RELS.filter(function (x) { return x[0] === k; })[0]; return r ? r[1] : 'شريك'; }
  var PCH = {};
  function pChart(p) {
    if (PCH[p.id]) return PCH[p.id];
    try {
      var C = window.__aqCITIES && window.__aqCITIES(), i = window.AqeeqChartContext.cityIndexByName(p.city), c = C && C[i]; if (!c) return null;
      var d = p.date.split('-').map(Number), known = !!p.time, t = (p.time || '12:00').split(':').map(Number);
      var utc = Astro.localToUtcMs(d[0], d[1], d[2], t[0], t[1], c.tz);
      return (PCH[p.id] = Astro.chart({ utcMs: utc, lat: c.lat, lon: c.lon, hs: 'placidus', known: known }));
    } catch (e) { return null; }
  }
  var SYN_N = { sun: 'الشمس', moon: 'القمر', mercury: 'عطارد', venus: 'الزهرة', mars: 'المريخ', jupiter: 'المشتري', saturn: 'زحل' };
  var SYN_ROLE = { sun: 'جوهرك وإحساسك بنفسك', moon: 'مشاعرك وما يؤمّنك', mercury: 'طريقة كلامك وتفكيرك', venus: 'حبّك وما تحب', mars: 'اندفاعك ورغبتك', jupiter: 'تفاؤلك وما يوسّعك', saturn: 'جدّيتك وحدودك' };
  var SYN_ROLE2 = { sun: 'جوهر', moon: 'مشاعر وأمان', mercury: 'كلام وتفكير', venus: 'حب وذوق', mars: 'اندفاع ورغبة', jupiter: 'تفاؤل وتوسّع', saturn: 'جدّية وحدود' };
  var SYN_ASP = [{ d: 0, k: 'conj', n: 'اقتران', h: 1, f: 'يلتقيان في نقطة واحدة، فيُضخَّم كل ما بينهما' }, { d: 60, k: 'sext', n: 'تسديس', h: 1, f: 'يتفاهمان بأقل جهد متى انتبهتما لذلك' }, { d: 120, k: 'tri', n: 'تثليث', h: 1, f: 'ينسجمان بلا مجهود يُذكر' }, { d: 90, k: 'sq', n: 'تربيع', h: 0, f: 'يحتكّان ويشدّ أحدهما الآخر' }, { d: 180, k: 'opp', n: 'مقابلة', h: 0, f: 'يقفان وجهًا لوجه كمرآتين' }];
  var SYN_W = { 'sun|moon': 10, 'moon|sun': 10, 'venus|mars': 10, 'mars|venus': 10, 'moon|moon': 9, 'sun|sun': 8, 'venus|venus': 8, 'venus|sun': 8, 'sun|venus': 8, 'moon|venus': 8, 'venus|moon': 8, 'mercury|mercury': 7, 'saturn|moon': 8, 'moon|saturn': 8, 'saturn|venus': 7, 'venus|saturn': 7, 'mars|mars': 6, 'sun|mars': 6, 'mars|sun': 6, 'saturn|sun': 6, 'sun|saturn': 6, 'jupiter|sun': 6, 'sun|jupiter': 6, 'jupiter|moon': 6, 'moon|jupiter': 6 };
  function synPairs(a, b, nm) {
    var out = [], lon = function (ch, k) { var x = ch.bodies.filter(function (y) { return y.key === k; })[0]; return x ? x.lon : null; };
    Object.keys(SYN_N).forEach(function (ka) { Object.keys(SYN_N).forEach(function (kb) {
      var w = SYN_W[ka + '|' + kb]; if (!w) return;
      var la = lon(a, ka), lb = lon(b, kb); if (la == null || lb == null) return;
      var df = Math.abs(((la - lb + 540) % 360) - 180);
      SYN_ASP.forEach(function (sp) { var o = Math.abs(df - sp.d); if (o <= 5) out.push({ ka: ka, kb: kb, sp: sp, o: o, sc: w - o * 0.6 }); });
    }); });
    out.sort(function (x, y) { return y.sc - x.sc; });
    var seen = {}; return out.filter(function (x) { var k = x.ka + x.kb; if (seen[k]) return false; seen[k] = 1; return true; }).slice(0, 4).map(function (x) {
      return { t: SYN_N[x.ka] + ' عندك و' + SYN_N[x.kb] + ' عند ' + nm, k: x.sp.n, h: x.sp.h,
        b: SYN_ROLE[x.ka] + ' عندك، و' + SYN_ROLE2[x.kb] + ' ' + nm + ': ' + x.sp.f + '. ' +
          (x.sp.h ? 'من هنا يأتي الإحساس بأن أحدكما يفهم الآخر دون شرح طويل، فاعتمدا عليه.' : 'من هنا يأتي أغلب الشدّ بينكما، ويصير قوة حقيقية لو سمّيتماه بهدوء قبل أن يتحوّل إلى عتاب.') };
    });
  }
  function weCard(x) { return '<article class="yp-wc' + (x.h === 0 ? ' hard' : '') + '"><span class="yp-chip">' + esc(x.k) + '</span><h3>' + esc(x.t) + '</h3><p>' + esc(x.b) + '</p></article>'; }
  function weCyc(c, nm, now) {
    var left = Math.max(1, Math.round((c.end - now) / DAY));
    return '<article class="yp-wc"><span class="yp-chip">' + c.tn + ' · ' + c.an + ' · ' + c.nn + '</span><h3>' + esc(titleOf(c)) + '</h3><small class="yp-al">' + fmtD(c.start) + ' – ' + fmtD(c.end) + '</small><p>' + esc(nm) + ' يمرّ بهذا الآن، ويمسّ ' + (AREA[c.n] || 'حياته') + '. ' + (left > 60 ? 'هي مرحلة طويلة، فلا تحكم على مزاجه بيوم واحد.' : 'بقي منها وقت قصير، وبعدها يخفّ الضغط.') + '</p></article>';
  }
  function weMark(g, nm, rel) {
    var gl = g === 'f' ? '<circle cx="12" cy="9" r="4.500"/><path d="M12 13.500V21M9 18h6"/>' : g === 'm' ? '<circle cx="10" cy="14" r="4.500"/><path d="M13.500 10.500 20 4M15 4h5v5"/>' : '';
    return '<div class="yp-wm"><span class="yp-wm-l ' + (g || 'n') + '"><img src="assets/images/brand/logo-mark-160.png" alt="" width="40" height="40">' + (gl ? '<i>' + SVG(gl) + '</i>' : '') + '</span><b>' + esc(nm) + '</b>' + (rel ? '<small>' + esc(rel) + '</small>' : '') + '</div>';
  }
  function weForm() {
    var d = '', mo = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'], sel = function (id, a, ph) { return '<select id="' + id + '" aria-label="' + ph + '"><option value="">' + ph + '</option>' + a + '</select>'; };
    var ds = '', ms = '', ys = '', hs = '', mn = '', i;
    for (i = 1; i <= 31; i++) ds += '<option value="' + i + '">' + i + '</option>';
    mo.forEach(function (m, k) { ms += '<option value="' + (k + 1) + '">' + m + '</option>'; });
    for (i = new Date().getFullYear(); i >= 1930; i--) ys += '<option value="' + i + '">' + i + '</option>';
    for (i = 0; i < 24; i++) hs += '<option value="' + i + '">' + (i < 10 ? '0' : '') + i + '</option>';
    for (i = 0; i < 60; i += 5) mn += '<option value="' + i + '">' + (i < 10 ? '0' : '') + i + '</option>';
    return '<form class="yp-wf" id="yp-wf" novalidate><h3>بيانات الطرف الآخر</h3><p class="yp-wf-s">نحسب خريطته من بياناته، ولا يحتاج حسابًا عندنا.</p>' +
      '<label>الاسم<input id="yp-w-n" type="text" maxlength="40" autocomplete="off"></label>' +
      '<div class="yp-wf-r"><span>العلاقة</span><div class="yp-seg" id="yp-w-rel">' + RELS.map(function (r, k) { return '<button type="button" data-w-rel="' + r[0] + '"' + (k === 0 ? ' class="on"' : '') + '>' + r[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="yp-wf-r"><span>الجنس (لشكل العلامة فقط)</span><div class="yp-seg" id="yp-w-g"><button type="button" data-w-g="m" class="on">ذكر</button><button type="button" data-w-g="f">أنثى</button></div></div>' +
      '<div class="yp-wf-r"><span>تاريخ الميلاد</span><div class="yp-wf-3">' + sel('yp-w-d', ds, 'اليوم') + sel('yp-w-m', ms, 'الشهر') + sel('yp-w-y', ys, 'السنة') + '</div></div>' +
      '<div class="yp-wf-r"><span>وقت الميلاد</span><div class="yp-wf-3">' + sel('yp-w-h', hs, 'الساعة') + sel('yp-w-mi', mn, 'الدقيقة') + '<label class="yp-wf-k"><input type="checkbox" id="yp-w-nt"> لا أعرفه</label></div></div>' +
      '<div class="yp-wf-r yp-wf-city"><span>مكان الميلاد</span><input id="yp-w-c" type="search" autocomplete="off" placeholder="ابحث باسم المدينة أو المحافظة"><ul id="yp-w-cl" hidden></ul></div>' +
      '<p class="yp-un-m err" id="yp-w-e" role="alert"></p><button type="submit" class="yp-ab yp-wf-go"><span>احسب ما بيننا</span></button></form>';
  }
  function weHtml() {
    var L = pGet(), now = Date.now();
    if (!natal()) return needNatal('أدخل بيانات ميلادك أولًا، ثم أضف من تحب لنقارن خريطتيكما.');
    if (!L.length || ST.weAdd) return (L.length ? '<button type="button" class="yp-wb" data-we-cancel>رجوع</button>' : '<div class="yp-empty">' + SVG('<circle cx="9" cy="12" r="5.500"/><circle cx="15" cy="12" r="5.500"/>') + '<p>أضف شخصًا يهمّك، شريكًا أو صديقًا، لتعرف ما بينكما وما يمرّ به كلٌّ منكما.</p></div>') + weForm();
    var p = L.filter(function (x) { return x.id === ST.weSel; })[0] || L[0], pc = pChart(p), me = natal(), nm = p.name || 'الطرف الآخر', mn = (user() || {}).user_metadata || {}, my = mn.full_name || mn.name || 'أنت';
    var h = '<div class="yp-wchips">' + L.map(function (x) { return '<button type="button" class="yp-wchip' + (x.id === p.id ? ' on' : '') + '" data-we-sel="' + x.id + '">' + esc(x.name || 'بدون اسم') + '</button>'; }).join('') + '<button type="button" class="yp-wchip add" data-we-add aria-label="إضافة شخص">' + SVG('<path d="M12 5v14M5 12h14"/>') + '</button></div>';
    var mg = ''; try { mg = (JSON.parse(localStorage.getItem('aq-last-birth-v1') || '{}').gender || '').charAt(0) === 'f' || /أنث/.test(JSON.parse(localStorage.getItem('aq-last-birth-v1') || '{}').gender || '') ? 'f' : /ذكر|male|^m/i.test(JSON.parse(localStorage.getItem('aq-last-birth-v1') || '{}').gender || '') ? 'm' : ''; } catch (e) {}
    h += '<div class="yp-couple">' + weMark(mg, String(my).split(' ')[0], '') + '<span class="yp-couple-x">' + SVG('<path d="M12 20s-7-4.400-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/>') + '<em>' + esc(relName(p.rel)) + '</em></span>' + weMark(p.g, nm, '') + '</div>';
    if (!pc) return h + '<div class="yp-empty"><p>تعذّر حساب خريطة ' + esc(nm) + '. تأكد من المدينة وأعد إضافته.</p></div><button type="button" class="yp-wb danger" data-we-del="' + p.id + '">حذف</button>';
    h += '<p class="yp-lab">ما بينكما</p><div class="yp-wl">' + (synPairs(me, pc, nm).map(weCard).join('') || '<p class="yp-un-m">لا اتصالات قوية بارزة بين الخريطتين، وهذا يعني علاقة تتشكّل بالاختيار أكثر من الانجذاب.</p>') + '</div>';
    var pcy = []; try { pcy = window.AqeeqYou.cycles(pc, Math.floor(now / DAY) * DAY); } catch (e) {}
    var pcur = split(pcy).cur.slice(0, 3);
    h += '<p class="yp-lab">ما يمرّ به ' + esc(nm) + ' الآن</p><div class="yp-wl">' + (pcur.map(function (c) { return weCyc(c, nm, now); }).join('') || '<p class="yp-un-m">لا دورة كبيرة تمرّ به الآن، مرحلة هادئة نسبيًا.</p>') + '</div>';
    var mycur = split(allCycles() || []).cur, shared = [];
    pcur.forEach(function (c) { mycur.forEach(function (m) { if (m.t === c.t && !shared.some(function (z) { return z.t === c.t; })) shared.push({ t: c.t, tn: c.tn, mine: m, his: c }); }); });
    if (shared.length) h += '<p class="yp-lab">عبور يمسّكما معًا</p><div class="yp-wl">' + shared.slice(0, 2).map(function (z) { return '<article class="yp-wc both"><span class="yp-chip">' + z.tn + ' يمرّ على خريطتيكما</span><h3>' + z.tn + ' يضغط عليكما في الوقت نفسه</h3><p>عندك: ' + esc(titleOf(z.mine)) + '. وعند ' + esc(nm) + ': ' + esc(titleOf(z.his)) + '. حين يمرّ الكوكب نفسه على اثنين معًا، يكثر سوء الفهم دون سبب ظاهر، فاسألا قبل أن تحكما على بعضكما.</p></article>'; }).join('') + '</div>';
    h += '<a class="yp-wb" href="#compat">تعمّق في التوافق الكامل</a><button type="button" class="yp-wb danger" data-we-del="' + p.id + '">حذف ' + esc(nm) + '</button>';
    return h;
  }
  function weCitySearch(q) {
    var ul = $('#yp-w-cl'); if (!ul) return;
    var C = (window.__aqCITIES && window.__aqCITIES()) || [], nz = function (t) { return String(t || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه'); }, v = nz(q), hits = [];
    if (v.length < 2) { ul.hidden = true; return; }
    for (var i = 0; i < C.length && hits.length < 8; i++) { var c = C[i]; if (c.tz && c.n && nz(c.n + ' ' + (c.g || '')).indexOf(v) > -1) hits.push(c); }
    ul.innerHTML = hits.length ? hits.map(function (c) { return '<li data-city="' + esc(c.n) + '"><b>' + esc(c.n) + '</b><small>' + esc(c.g || '') + '</small></li>'; }).join('') : '<li class="none">لا نتيجة، جرّب اسمًا آخر</li>'; ul.hidden = false;
  }
  document.addEventListener('input', function (e) { if (e.target && e.target.id === 'yp-w-c') { e.target.removeAttribute('data-ok'); weCitySearch(e.target.value); } });
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('#for-you [data-we-add],#for-you [data-we-cancel],#for-you [data-we-sel],#for-you [data-we-del],#for-you [data-w-rel],#for-you [data-w-g],#for-you #yp-w-cl li[data-city]'); if (!t) return;
    if (t.hasAttribute('data-w-rel') || t.hasAttribute('data-w-g')) { [].forEach.call(t.parentNode.children, function (b) { b.classList.toggle('on', b === t); }); return; }
    if (t.hasAttribute('data-city')) { var ci = $('#yp-w-c'); ci.value = t.getAttribute('data-city'); ci.setAttribute('data-ok', '1'); $('#yp-w-cl').hidden = true; return; }
    if (t.hasAttribute('data-we-add')) ST.weAdd = true; else if (t.hasAttribute('data-we-cancel')) ST.weAdd = false;
    else if (t.hasAttribute('data-we-sel')) { ST.weSel = t.getAttribute('data-we-sel'); ST.weAdd = false; }
    else if (t.hasAttribute('data-we-del')) { var id = t.getAttribute('data-we-del'); pSet(pGet().filter(function (x) { return x.id !== id; })); delete PCH[id]; ST.weSel = null; }
    render();
  });
  document.addEventListener('submit', function (e) {
    if (!e.target || e.target.id !== 'yp-wf') return; e.preventDefault();
    var g = function (id) { return $('#' + id).value; }, err = $('#yp-w-e'), nm = g('yp-w-n').trim(), city = g('yp-w-c').trim();
    var dd = +g('yp-w-d'), mm = +g('yp-w-m'), yy = +g('yp-w-y'), nt = $('#yp-w-nt').checked, hh = g('yp-w-h'), mi = g('yp-w-mi');
    if (!nm) { err.textContent = 'اكتب اسمه.'; return; }
    if (!dd || !mm || !yy) { err.textContent = 'اختر يوم وشهر وسنة الميلاد.'; return; }
    if (!nt && (hh === '' || mi === '')) { err.textContent = 'اختر الساعة والدقيقة، أو علّم "لا أعرفه".'; return; }
    if (window.AqeeqChartContext.cityIndexByName(city) < 0) { err.textContent = 'اختر المدينة من القائمة التي تظهر أثناء الكتابة.'; return; }
    var pad = function (x) { return String(x).padStart(2, '0'); };
    var P = { id: 'p' + Date.now().toString(36), name: nm, rel: ($('#yp-w-rel .on') || {}).getAttribute('data-w-rel') || 'partner', g: ($('#yp-w-g .on') || {}).getAttribute('data-w-g') || 'm', date: yy + '-' + pad(mm) + '-' + pad(dd), time: nt ? '' : pad(hh) + ':' + pad(mi), city: city };
    if (!pChart(P)) { err.textContent = 'تعذّر الحساب، راجع التاريخ والمدينة.'; return; }
    var L = pGet(); L.push(P); pSet(L); ST.weSel = P.id; ST.weAdd = false; render();
  });
  window.AqeeqYouPage = { go: function (tab) { ST.tab = tab; ST.view = null; ST.weAdd = false; if (location.hash !== '#for-you') location.hash = '#for-you'; render(); var s0 = $('#for-you'); if (s0) s0.scrollTop = 0; window.scrollTo(0, 0); } };

  function settingsHtml() {
    var u = user() || {};
    return '<div class="yp-set">' +
      '<div class="yp-set-g"><p class="yp-lab">حسابك</p><div class="yp-set-row"><div><b dir="ltr">' + esc(u.email || '') + '</b><small>نوع الاشتراك</small></div>' + planChip() + '</div>' +
      '<div class="yp-set-row yp-un"><div><b>اسم المستخدم</b><small>حروف إنجليزية وأرقام ونقطة، من 3 إلى 20.</small></div><span class="yp-un-f" dir="ltr">@<input id="yp-un" type="text" maxlength="20" autocomplete="off" autocapitalize="off" spellcheck="false" value="' + esc(unGet(u)) + '"></span><button type="button" class="yp-ab" data-un-save><span>حفظ</span></button></div><p class="yp-un-m" id="yp-un-m" role="status"></p></div>' +
      '<div class="yp-set-g"><p class="yp-lab">الخصوصية</p><label class="yp-set-row yp-sw"><div><b>حساب خاص</b><small>ملفك وقراءاتك لا تظهر لأحد غيرك.</small></div><input type="checkbox" id="yp-private"' + (isPrivate() ? ' checked' : '') + '><span class="yp-sw-t" aria-hidden="true"></span></label></div>' +
      nfHtml() + '<div class="yp-set-g"><p class="yp-lab">بياناتك وخريطتك</p><div id="yp-prof-slot"></div></div>' +
      '<div class="yp-set-g"><p class="yp-lab">عن عقيق أسترو</p><div class="yp-legal"><p>القراءات للتأمل والترفيه، وليست بديلاً عن الاستشارة النفسية أو الطبية أو القانونية أو المالية.</p><p>© 2026 عقيق أسترو (Aqeq Astro). جميع الحقوق محفوظة. كل النصوص والقراءات والتصاميم والحسابات ملكية خاصة، ويمنع نسخها أو إعادة نشرها أو بيعها بدون إذن كتابي.</p></div></div>' +
      '<button type="button" class="yp-out" data-signout>تسجيل الخروج</button></div>';
  }

  /* ---------- عدستك: بطاقات اليوم من الحسابات والنصوص الموجودة ---------- */
  var WD = [
    ['الأحد', 'يوم الشمس', 'ممكن تلاحظ اليوم رغبة أن تُرى وتُقدَّر. اسأل نفسك أين تحتاج أن تظهر بصدق بدل أن تُثبت شيئًا.'],
    ['الاثنين', 'يوم القمر', 'مشاعرك أقرب إلى السطح اليوم. ممكن تحتاج مكانًا هادئًا وكلامًا أقل، وهذا ليس ضعفًا.'],
    ['الثلاثاء', 'يوم المريخ', 'طاقة الدفع اليوم ممكن تتحول إلى قرار أو إلى انفعال. اختر أين تضعها قبل أن تختارك هي.'],
    ['الأربعاء', 'يوم عطارد', 'عقلك أسرع اليوم. ممكن تنجز رسائل ومهام مؤجلة، وانتبه لجملة تقولها قبل أن تفكر فيها.'],
    ['الخميس', 'يوم المشتري', 'ميل للتوسع والتفاؤل. ممكن يفتح لك باب إن طرقته، وانتبه ألا تعد بأكثر مما تقدر.'],
    ['الجمعة', 'يوم الزهرة', 'القلب يطلب قربًا وجمالًا. ممكن تلاحظ ما يريحك فعلًا وما تفعله فقط لإرضاء غيرك.'],
    ['السبت', 'يوم زحل', 'يطلب منك اليوم جدية وترتيبًا. ممكن تشعر بثقل المسؤوليات، وهو وقت جيد لتحسم ما تؤجله.']
  ];
  var SG = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var MOON = [
    'مشاعرك ممكن تتحرك بسرعة وتطلب فعلًا مباشرًا. أعطها مجالًا للحركة بدل أن تكتمها.',
    'ما يهدئك اليوم هو الملموس: ترتيب، أكل بيتي، شيء تنجزه بيدك.',
    'تحتاج أن تتكلم أو تكتب لتفهم ما تشعر به. ممكن تخف حدة الشعور حين تسمّيه.',
    'الحدس والحساسية أعلى. ممكن تلتقط مزاج من حولك، فاحرص على مسافة تحميك.'
  ];
  function moonToday(ms) {
    try { var c = window.Astro.chart({ utcMs: ms || Date.now(), lat: 30.0444, lon: 31.2357, known: false }), b = c.bodies.filter(function (x) { return String(x.key).toLowerCase() === 'moon'; })[0]; return b ? Math.floor(((b.lon % 360) + 360) % 360 / 30) : -1; } catch (e) { return -1; }
  }
  function lensCard(kick, title, text, act, extra) {
    return '<article class="yp-lc"><span class="yp-lc-k">' + esc(kick) + '</span><h3>' + esc(title) + '</h3>' + (extra ? '<small class="yp-lc-x">' + esc(extra) + '</small>' : '') + '<p>' + esc(text) + '</p>' + (act || '') + '</article>';
  }
  function lensCards() {
    var d = new Date(), w = WD[d.getDay()], ch = natal(), cards = [];
    var dateS = d.toLocaleDateString('ar-EG-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long' });
    cards.push(lensCard('طاقة اليوم · ' + dateS, w[1], w[2]));
    var list = ch ? allCycles() : null, pls = ch && window.AqeeqYou ? window.AqeeqYou.placements(ch) : [];
    if (list) {
      var now = Date.now(), cur = list.filter(function (c) { return c.start <= now && c.end >= now; });
      cur.sort(function (a, b) { var pa = a.peaks[0] ? Math.abs(a.peaks[0].a - now) : 9e15, pb = b.peaks[0] ? Math.abs(b.peaks[0].a - now) : 9e15; return pa - pb; });
      cur.slice(0, 3).forEach(function (c) {
        var pp = pls.filter(function (x) { return x.id === c.n; })[0], cc = pp && coreOf(pp);
        var line = cc ? 'ما تحمله ' + c.nn + ' عندك: ' + headOf(cc.e) : 'دورة مؤقتة تحرّك ما يخصّ ' + c.nn + ' في خريطتك.';
        cards.push(lensCard('يؤثر فيك الآن', 'دورة ' + c.tn + ' مع ' + c.nn, line, '<button type="button" class="yp-lc-b" data-pop="cyc" data-id="' + esc(c.id + '|' + c.start) + '">تعمّق</button>', c.tn + ' ' + c.an + ' ' + c.nn + ' · تنتهي ' + fmtM(c.end)));
      });
    }
    var m = moonToday();
    if (m >= 0) cards.push(lensCard('حدث فلكي', 'القمر اليوم في برج ' + SG[m], MOON[m % 4]));
    if (pls.length) {
      var doy = Math.floor((Date.now() - new Date(d.getFullYear(), 0, 0)) / DAY), k = 0, shown = 0;
      while (shown < 2 && k < pls.length) {
        var p = pls[(doy + k) % pls.length]; k++; var c2 = coreOf(p); if (!c2) continue;
        cards.push(lensCard('تذكير بنمطك', p.nn + ' في ' + p.sign + ' · البيت ' + c2.house, headOf(c2.e), '<button type="button" class="yp-lc-b" data-pop="pl" data-id="' + p.id + '">تعمّق</button>')); shown++;
      }
    }
    return cards.join('');
  }
  var CHEV = SVG('<path d="M15 6l-6 6 6 6"/>'), DWN = SVG('<path d="M6 9l6 6 6-6"/>');
  function briefOf(e) {
    var t = String(e.summary || ''), i = t.indexOf(':'); t = i > -1 ? t.slice(i + 1).trim() : t;
    return t.length && t.length <= 260 ? t : headOf(e);
  }
  function deepHtml(e, brief) {
    var key = String(brief || '').slice(0, 40);
    var sl = slidesOf(e.text).filter(function (x) { return !(key && x.b.indexOf(key) === 0); });
    return sl.map(function (x) { return '<div class="yp-ds">' + (x.t ? '<h4>' + esc(x.t) + '</h4>' : '') + '<p>' + esc(x.b).replace(/\n/g, '<br>') + '</p></div>'; }).join('');
  }
  function textBlock(e, kind, id) {
    var br = briefOf(e), dp = deepHtml(e, br);
    return '<div class="yp-txt"><p class="yp-brief">' + esc(br) + '</p></div>' +
      (dp ? '<button type="button" class="yp-deep-b" data-pop="' + kind + '" data-id="' + esc(id) + '"><span>تعمّق</span>' + SVG('<path d="M9 6l6 6-6 6"/>') + '</button>' : '');
  }
  function rail(title, sub, cards, go) {
    if (!cards) return '';
    var inner = '<span class="yp-sh-t"><b>' + title + '</b>' + CHEV + '</span><small>' + sub + '</small>';
    return '<section class="yp-sec">' + (go ? '<button type="button" class="yp-sh" data-go="' + go + '">' + inner + '</button>' : '<div class="yp-sh">' + inner + '</div>') +
      '<div class="yp-rail" tabindex="0">' + cards + '</div></section>';
  }
  function curList(list, n) { var s = split(list); return s.cur.slice(0, n).map(function (c) { return cardHtml(c, false); }).join('') + s.up.slice(0, 3).map(function (c) { return cardHtml(c, true); }).join(''); }
  function domCycles(list, id) { return list ? list.filter(function (c) { return id === 'growth' ? ['saturn', 'pluto', 'chiron', 'neptune'].indexOf(c.t) >= 0 : c.doms.indexOf(id) >= 0; }) : []; }
  function homeHtml() {
    var list = allCycles(), has = !!natal(), h = '';
    h += '<div class="yp-pills"><a class="yp-pill" data-k="chart" href="#chart">' + SVG('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.500"/><path d="M12 3v5.500M12 15.500V21M4.200 7.500l4.700 2.700M15.100 13.800l4.700 2.700M4.200 16.500l4.700-2.700M15.100 10.200l4.700-2.700"/>') + '<span>الخريطة</span></a>' +
      '<button type="button" class="yp-pill" data-k="time" data-tt-open>' + SVG('<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3 2"/>') + '<span>سافر بالزمن</span></button>' +
      '<button type="button" class="yp-pill" data-k="acct" data-go="we">' + SVG('<circle cx="9" cy="12" r="5.500"/><circle cx="15" cy="12" r="5.500"/>') + '<span>نحن</span></button></div>';
    h += rail('سماء يومك', 'ما تحمله لك سماء اليوم، بكلمات تخصّك', lensCards(), 'sky');
    if (!has) return h + needNatal();
    h += rail('عبوراتك', 'ما يمرّ بك الآن وما يقترب منك', list ? curList(list, 8) : '', 'transits');
    h += rail('نمطك', 'ما يميّزك ويلازمك مهما تغيّر الوقت', placeCards(null, 8), 'pattern');
    DOMAINS.forEach(function (d) {
      var cy = domCycles(list, d.id), sp = split(cy), cards = sp.cur.slice(0, 4).map(function (c) { return cardHtml(c, false); }).join('') + sp.up.slice(0, 2).map(function (c) { return cardHtml(c, true); }).join('') + placeCards(d.id);
      h += rail(d.t, d.s, cards, 'dom:' + d.id);
    });
    return h;
  }

  /* سماء يومك: شاشات كاملة بسكرول عمودي، آخر 3 أيام */
  var SKYART = [
    '<g opacity=".5"><circle cx="300" cy="150" r="70"/><circle cx="300" cy="150" r="110"/><circle cx="300" cy="150" r="155"/></g>',
    '<g opacity=".5" transform="rotate(-18 190 420)"><ellipse cx="190" cy="420" rx="250" ry="105"/><ellipse cx="190" cy="420" rx="190" ry="76"/></g>',
    '<g opacity=".45"><path d="M290 90l50 29v58l-50 29-50-29v-58z"/><path d="M290 90l50 29-50 29-50-29zM290 148v58"/></g>',
    '<g opacity=".5"><path d="M20 640c80-60 150-60 230 0s150 60 230 0"/><path d="M20 690c80-60 150-60 230 0s150 60 230 0"/></g>',
    '<g opacity=".45"><path d="M40 120l60 40 50-30 70 50"/><circle cx="40" cy="120" r="3" fill="#9A4A32"/><circle cx="100" cy="160" r="3" fill="#9A4A32"/><circle cx="150" cy="130" r="3" fill="#9A4A32"/><circle cx="220" cy="180" r="3" fill="#9A4A32"/></g>'
  ];
  var SKYBG = ['#F6E9D2,#EBCFAE', '#F3E1CF,#E3B99A', '#F4EAD6,#E5D0A8', '#EFE0CB,#D9B79A', '#F5E8D5,#E8CDB0', '#F2E3CC,#DDB993', '#F1E4D0,#E2C4A0'];
  function skyDate() { var d = new Date(); d.setHours(12, 0, 0, 0); return new Date(d.getTime() - (ST.skyDay || 0) * DAY); }
  function pickPl(pls, ids, d, off) {
    var f = pls.filter(function (x) { return ids.indexOf(x.id) >= 0 && coreOf(x); }); if (!f.length) f = pls.filter(function (x) { return coreOf(x); });
    if (!f.length) return null; var doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / DAY); return f[(doy + (off || 0)) % f.length];
  }
  function skyStory(n, kick, title, text, btn) {
    return '<section class="yp-st" style="--sk:linear-gradient(180deg,' + SKYBG[n % SKYBG.length].replace(',', ' 0%,') + ' 100%)"><svg class="yp-st-art" viewBox="0 0 375 812" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#9A4A32" stroke-width="1" aria-hidden="true">' + SKYART[n % SKYART.length] + '</svg>' +
      (n === 0 ? '<img class="yp-st-logo" src="assets/images/brand/logo-mark-160.png" alt="عقيق أسترو" width="56" height="56">' : '') +
      '<div class="yp-st-in"><small class="yp-st-k">' + esc(kick) + '</small><h2>' + esc(title) + '</h2><p>' + esc(text) + '</p>' + (btn || '') + '</div></section>';
  }
  function skyHtml() {
    var d = skyDate(), ms = d.getTime(), w = WD[d.getDay()], ch = natal(), out = [], n = 0;
    var days = ['اليوم', 'أمس', 'قبل يومين', 'قبل ٣ أيام'];
    var chips = '<div class="yp-days">' + days.map(function (t, i) { return '<button type="button" data-skyday="' + i + '" aria-pressed="' + ((ST.skyDay || 0) === i) + '">' + t + '</button>'; }).join('') + '</div>';
    var dateS = d.toLocaleDateString('ar-EG-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long' });
    out.push(skyStory(n++, 'أجواء يومك · ' + dateS, w[1], w[2]));
    var list = ch ? allCycles() : null, pls = ch && window.AqeeqYou ? window.AqeeqYou.placements(ch) : [];
    var bt = function (kind, id) { return '<button type="button" class="yp-st-b" data-pop="' + kind + '" data-id="' + esc(id) + '"><span>تعمّق</span></button>'; };
    if (list) {
      var cur = list.filter(function (c) { return c.start <= ms && c.end >= ms; });
      cur.sort(function (a, b) { var pa = a.peaks[0] ? Math.abs(a.peaks[0].a - ms) : 9e15, pb = b.peaks[0] ? Math.abs(b.peaks[0].a - ms) : 9e15; return pa - pb; });
      var mk = function (c, kick) {
        var pp = pls.filter(function (x) { return x.id === c.n; })[0], cc = pp && coreOf(pp);
        return skyStory(n++, kick, 'دورة ' + c.tn + ' مع ' + c.nn, cc ? headOf(cc.e) : 'دورة مؤقتة تحرّك ما يخصّ ' + c.nn + ' في خريطتك.', cc ? bt('cyc', c.id + '|' + c.start) : '');
      };
      if (cur[0]) out.push(mk(cur[0], 'العبور الأبرز · تنتهي ' + fmtM(cur[0].end)));
    }
    var mkp = function (p, kick) { var c2 = coreOf(p); return skyStory(n++, kick, p.nn + ' في ' + p.sign + ' · البيت ' + c2.house, headOf(c2.e), bt('pl', p.id)); };
    var p1 = pickPl(pls, ['sun', 'moon', 'saturn', 'pluto', 'chiron'], d, 0); if (p1) out.push(mkp(p1, 'تذكير بنمطك'));
    if (list) { var cur2 = list.filter(function (c) { return c.start <= ms && c.end >= ms; }); if (cur2[1]) out.push((function (c) { var pp = pls.filter(function (x) { return x.id === c.n; })[0], cc = pp && coreOf(pp); return skyStory(n++, 'عبور آخر يؤثر فيك · تنتهي ' + fmtM(c.end), 'دورة ' + c.tn + ' مع ' + c.nn, cc ? headOf(cc.e) : 'دورة مؤقتة تحرّك ما يخصّ ' + c.nn + ' في خريطتك.', cc ? bt('cyc', c.id + '|' + c.start) : ''); })(cur2[1])); }
    var p2 = pickPl(pls, ['venus', 'moon', 'mars'], d, 1); if (p2 && (!p1 || p2.id !== p1.id)) out.push(mkp(p2, 'نمطك في علاقاتك'));
    var p3 = pickPl(pls, ['saturn', 'jupiter', 'sun', 'mercury'], d, 2); if (p3 && (!p1 || p3.id !== p1.id) && (!p2 || p3.id !== p2.id)) out.push(mkp(p3, 'نمطك في عملك وطموحك'));
    var m = moonToday(ms); if (m >= 0) out.push(skyStory(n++, 'حدث فلكي', 'القمر في برج ' + SG[m], MOON[m % 4]));
    return chips + '<div class="yp-sky" tabindex="0">' + out.join('') + '</div>';
  }
  function subTabs() {
    return '<div class="yp-ut" role="tablist">' + [['transits', 'عبوراتك'], ['pattern', 'نمطك']].map(function (t) { return '<button type="button" role="tab" data-tab="' + t[0] + '" aria-selected="' + (ST.tab === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div>';
  }
  function bodyHtml() {
    var v = ST.view, list;
    if (v && v.set) return settingsHtml();
    if (v && v.sv) return savedHtml();
    if (v && v.inb) return inboxHtml();
    if (v && v.cyc) {
      list = allCycles() || []; var c = list.filter(function (x) { return x.id + '|' + x.start === v.cyc; })[0];
      if (c) {
        var pp0 = window.AqeeqYou.placements(natal()).filter(function (x) { return x.id === c.n; })[0], cc0 = pp0 && coreOf(pp0);
        return '<div class="yp-det"><span class="yp-chip">' + c.tn + ' · ' + c.an + ' · ' + c.nn + '</span><h3>' + esc(titleOf(c)) + '</h3><small class="yp-al">' + fmtD(c.start) + ' – ' + fmtD(c.end) + '</small>' + actBar(c.id + '|' + c.start, titleOf(c)) +
          '<div class="yp-meta"><div><i>المدة</i><b>' + Math.max(1, Math.round((c.end - c.start) / MONTH)) + ' شهر</b><i>ذروة التأثير</i>' + (c.peaks.length ? c.peaks.map(function (p) { return '<b>' + fmtM(p.a) + (p.b - p.a > 20 * DAY ? ' – ' + fmtM(p.b) : '') + '</b>'; }).join('') : '<b>غير محددة</b>') + '</div>' + ring(c, c.start > selMs()) + '</div>' +
          '<p class="yp-lab">مراحل الدورة</p>' + phases(c) +
          (cc0 ? '<p class="yp-lab">ما تحمله ' + c.nn + ' عندك</p>' + textBlock(cc0.e, 'cyc', c.id + '|' + c.start) : '') + '</div>';
      }
    }
    if (v && v.pl) {
      var pp = window.AqeeqYou.placements(natal()).filter(function (x) { return x.id === v.id; })[0], cc = pp && coreOf(pp);
      return '<div class="yp-det"><h3>' + esc(v.pl) + (cc ? ' · البيت ' + cc.house : '') + '</h3><small class="yp-al">صفة ثابتة في خريطتك</small>' + (cc ? textBlock(cc.e, 'pl', v.id) : '') + '</div>';
    }
    if (v && v.dom) {
      var d = domOf(v.dom); list = allCycles();
      return '<div class="yp-dh"><span class="yp-dom-i" data-d="' + d.id + '">' + SVG(d.i) + '</span><small>' + d.s + '</small></div>' + (list ? cyclesHtml(domCycles(list, v.dom)) : needNatal()) + (placeCards(v.dom) ? '<p class="yp-lab">صفاتك الثابتة</p><div class="yp-list">' + placeCards(v.dom) + '</div>' : '');
    }
    if (ST.tab === 'we') return weHtml();
    if (ST.tab === 'sky') return natal() ? skyHtml() : needNatal('أدخل بيانات ميلادك لتظهر لك سماء يومك مقروءة على خريطتك.');
    if (ST.tab === 'transits') { list = allCycles(); return subTabs() + '<p class="yp-lab">كل ما يخصّ عبوراتك</p>' + timeTravel() + (list ? cyclesHtml(list, true) : needNatal()); }
    if (ST.tab === 'pattern') return subTabs() + '<p class="yp-lab">كل صفاتك الثابتة</p>' + (natal() ? '<div class="yp-list">' + placeCards() + '</div>' : needNatal());
    return homeHtml();
  }

  /* ---- الهوية البصرية الجديدة: عنوان كبير، تابات زجاجية، خلفية لكل تبويب ---- */
  var BGART = {
    lens: '<g opacity=".5"><circle cx="340" cy="60" r="60"/><circle cx="340" cy="60" r="95"/><circle cx="340" cy="60" r="135"/></g><g opacity=".45" stroke="#6B1F2E"><path d="M30 700l40-30 30 20 45-40"/><circle cx="30" cy="700" r="2.500" fill="#6B1F2E"/><circle cx="70" cy="670" r="2" fill="#6B1F2E"/><circle cx="100" cy="690" r="2.500" fill="#6B1F2E"/><circle cx="145" cy="650" r="2" fill="#6B1F2E"/></g>',
    transits: '<g opacity=".5" transform="rotate(-20 190 420)"><ellipse cx="190" cy="420" rx="260" ry="110"/><ellipse cx="190" cy="420" rx="200" ry="80"/><ellipse cx="190" cy="420" rx="140" ry="52"/></g><circle cx="330" cy="330" r="5" fill="#B5532F" stroke="none" opacity=".7"/><circle cx="60" cy="520" r="4" fill="#6B1F2E" stroke="none" opacity=".6"/>',
    pattern: '<g opacity=".45"><path d="M300 40l50 29v58l-50 29-50-29V69z"/><path d="M300 40l50 29-50 29-50-29zM300 98v58"/><path d="M60 640l50 29v58l-50 29-50-29v-58z"/><path d="M60 640l50 29-50 29-50-29zM60 698v58"/></g>',
    settings: '<g opacity=".45" stroke="#6B1F2E"><path d="M40 90l60 40 50-30 70 50"/><path d="M290 640l30-50 40 20"/><circle cx="40" cy="90" r="3" fill="#6B1F2E"/><circle cx="100" cy="130" r="2.500" fill="#6B1F2E"/><circle cx="150" cy="100" r="3" fill="#6B1F2E"/><circle cx="220" cy="150" r="2.500" fill="#6B1F2E"/><circle cx="290" cy="640" r="3" fill="#6B1F2E"/><circle cx="320" cy="590" r="2.500" fill="#6B1F2E"/></g>'
  };
  /* رئيسية المسجّل: بطاقة «سماء يومك» بدل الهيرو التسويقي */
  function homeSync(u, name) {
    try {
      document.body.classList.toggle('yp-user', !!u);
      var host = $('#home-intro'), old = $('#yp-hc'); if (old) old.remove();
      if (!u || !host) return;
      var d = new Date(), w = WD[d.getDay()], list = natal() ? allCycles() : null, cur = list ? split(list).cur[0] : null;
      var first = String(name || '').split(/\s+/)[0], dateS = d.toLocaleDateString('ar-EG-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long' });
      var el = document.createElement('div'); el.id = 'yp-hc'; el.className = 'yp-hc';
      el.innerHTML = '<p class="yp-hc-k">أهلًا ' + esc(first) + '</p><p class="yp-hc-d">طاقة اليوم · ' + dateS + '</p><h2>' + w[1] + '</h2><p class="yp-hc-t">' + w[2] + '</p>' +
        (cur ? '<p class="yp-hc-c"><span>عبورك الآن</span><b>' + esc(titleOf(cur)) + '</b></p>' : '') +
        '<a class="yp-hc-go" href="#for-you"><span>افتح صفحتك</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></a>';
      host.insertBefore(el, host.firstChild);
    } catch (e) {}
  }
  /* شكل التطبيق: بعد الدخول وداخل «أنت» فقط يختفي هيدر وفوتر الموقع */
  function appSync() { try { document.body.classList.toggle('yp-app', !!user() && /^#for-you/.test(location.hash)); } catch (e) {} }
  window.addEventListener('hashchange', appSync);
  function render() {
    loadTexts(); window.__aqWeOn = ST.tab === 'we' && !ST.view; try { document.dispatchEvent(new Event('aq:wesync')); } catch (e) {}
    var u = user(), host = $('#fy-body'), sec = $('#for-you'); if (!host) return;
    if (sec) sec.classList.toggle('yp-on', !!u);
    appSync();
    if (!u) { homeSync(null); return; }
    var name = (u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) || (u.email || '').split('@')[0] || 'حسابك';
    homeSync(u, name);
    var pn = $('#account-profile-completion'), home0 = $('#acct-user');
    if (pn && home0 && host.contains(pn)) home0.appendChild(pn);
    var set = !!(ST.view && ST.view.set), inSub = !!(ST.view && !set && !ST.view.sv && !ST.view.inb), sv = !!(ST.view && ST.view.sv), inb = !!(ST.view && ST.view.inb), home = !set && !inSub && !sv && !inb && ST.tab === 'home', cur = (set || sv || inb) ? 'settings' : ST.tab;
    var barT = sv ? 'المحفوظات' : inb ? 'إشعاراتك' : set ? 'الضبط' : inSub ? (ST.view.cyc ? 'تفاصيل الدورة' : ST.view.dom ? (domOf(ST.view.dom) || {}).t || 'المجال' : 'صفة في نمطك') : home ? 'أنت' : (ST.tab === 'we' ? 'نحن' : ST.tab === 'sky' ? 'سماء يومك' : ST.tab === 'transits' ? 'عبوراتك' : 'نمطك');
    var backA = home ? 'data-home' : (inSub || sv || inb) ? 'data-back' : 'data-tab="home"';
    var who = set ? '<div class="yp-who yp-who-card"><span class="yp-av">' + avatar(u, name) + '</span><div><h2>' + esc(name) + '</h2></div></div>' : '';
    var end = home ? '<button type="button" class="yp-av yp-av-b" data-set aria-label="حسابي"><span class="yp-av-i">' + avatar(u, name) + '</span><span class="yp-av-n">' + esc(String(name).split(' ')[0]) + '</span></button>' : '<span></span>';
    host.innerHTML = '<div class="yp yp-t-' + cur + (inSub ? ' yp-sub' : '') + '"><div class="yp-bg" aria-hidden="true"><svg width="100%" height="100%" viewBox="0 0 375 812" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#9A4A32" stroke-width="1">' + (BGART[cur === 'home' ? 'lens' : cur] || '') + '</svg></div>' +
      (home ? topHtml(u, name) : '<header class="yp-bar"><button type="button" class="yp-bar-b" ' + backA + ' aria-label="رجوع">' + SVG('<path d="M9 6l6 6-6 6"/>') + '</button><h1>' + esc(barT) + '</h1>' + end + '</header>') +
      (home ? '<p class="yp-sub1">مكتبة تكبر معك، كلها عن حكايتك أنت</p>' : '') + who +
      '<div class="yp-body">' + bodyHtml() + '</div></div>';
    if (set) {
      var slot = $('#yp-prof-slot');
      if (pn && slot) { pn.hidden = false; slot.appendChild(pn); }
      else if (slot && (ST.tries = (ST.tries || 0) + 1) < 20) setTimeout(function () { if (ST.view && ST.view.set && !$('#yp-prof-slot #account-profile-completion')) render(); }, 400);
    }
  }
  /* نافذة التعمّق المنبثقة: شرح أطول بتنسيق زجاجي، تُغلق بزر أسفلها */
  function popOpen(kind, rid) {
    var pls = natal() ? window.AqeeqYou.placements(natal()) : [], tgt, ttl, kk;
    if (kind === 'cyc') { var lc = (allCycles() || []).filter(function (x) { return x.id + '|' + x.start === rid; })[0]; if (!lc) return; tgt = pls.filter(function (x) { return x.id === lc.n; })[0]; ttl = titleOf(lc); kk = astroLine(lc); }
    else { tgt = pls.filter(function (x) { return x.id === rid; })[0]; ttl = tgt ? tgt.nn + ' في ' + tgt.sign : ''; kk = 'صفة ثابتة في خريطتك'; }
    var cx = tgt && coreOf(tgt); if (!cx) return;
    var br = briefOf(cx.e), old = $('#yp-pop'); if (old) old.remove();
    var key = String(br).slice(0, 40), sl = [{ t: '', b: br, big: 1 }].concat(slidesOf(cx.e.text).filter(function (x) { return !(key && x.b.indexOf(key) === 0); }));
    var el = document.createElement('div'); el.id = 'yp-pop'; el.className = 'yp-pop'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', ttl);
    var X = SVG('<path d="M6 6l12 12M18 6L6 18"/>');
    el.innerHTML = '<div class="yp-pop-top"><button type="button" class="yp-pop-x2" data-pop-x aria-label="إغلاق">' + X + '</button><div class="yp-pop-hd"><small class="yp-pop-k">' + esc(kk) + '</small><h3 class="yp-pop-t">' + esc(ttl) + '</h3></div></div>' +
      '<div class="yp-pop-scroll" tabindex="0"><div class="yp-pop-col">' + sl.map(function (x, i) {
        return '<section class="yp-pop-p">' + (i && x.t ? '<h4>' + esc(x.t) + '</h4>' : '') + '<p class="' + (x.big ? 'big' : '') + '">' + esc(x.b).replace(/\n/g, '<br>') + '</p></section>';
      }).join('') + '<button type="button" class="yp-pop-end" data-pop-x>إغلاق</button></div></div>';
    document.body.appendChild(el); document.documentElement.classList.add('yp-pop-open');
    requestAnimationFrame(function () { el.classList.add('on'); });
  }
  function popClose() { var el = $('#yp-pop'); if (!el) return; el.classList.remove('on'); document.documentElement.classList.remove('yp-pop-open'); setTimeout(function () { el.remove(); }, 260); }
  document.addEventListener('click', function (e) {
    var p = e.target.closest && e.target.closest('[data-pop]'); if (p) { popOpen(p.getAttribute('data-pop'), p.getAttribute('data-id')); return; }
    if (e.target.closest && e.target.closest('[data-pop-x]')) popClose();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') popClose(); });
  window.addEventListener('hashchange', popClose);

  /* زر «الخريطة» في أنت: تُحسب الخريطة وتظهر جاهزة من بياناتك المحفوظة */
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('#for-you a[href="#chart"]'); if (a) { try { sessionStorage.setItem('aq_yp_chart', '1'); } catch (_) {} } }, true);
  function autoChart() {
    if (location.hash !== '#chart') return; var f; try { f = sessionStorage.getItem('aq_yp_chart'); sessionStorage.removeItem('aq_yp_chart'); } catch (_) {}
    if (!f || !natal()) return;
    setTimeout(function () { var b = document.querySelector('#chart .aq-autofill-btn'); if (b) b.click(); setTimeout(function () { var fm = document.getElementById('cform'); if (fm && fm.requestSubmit) fm.requestSubmit(); }, 250); }, 200);
  }
  window.addEventListener('hashchange', autoChart);

  /* بعد الدخول: «حسابي» يفتح صفحتك الكاملة بدل النافذة المنبثقة (إلا شاشة كلمة المرور الجديدة أو الرجوع من الدفع) */
  function route() {
    if (location.hash !== '#account' || !user()) return;
    var rec = $('#acct-recovery'); if (rec && !rec.hidden) return;
    if (/[?&](order|order_id)=/.test(location.search)) return;
    var card = $('#acct-user');
    if (card && card.getAttribute('data-profile-complete') === 'false') ST.view = { set: true };
    location.replace('#for-you'); render();
  }
  /* «حسابي» بعد الدخول يفتح إعدادات صفحة «أنت» مباشرة بدل نافذة الحساب القديمة */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#account"]'); if (!a || !user()) return;
    var rec = $('#acct-recovery'); if (rec && !rec.hidden) return;
    e.preventDefault(); e.stopPropagation(); ST.view = null; ST.tab = 'home'; ST.weAdd = false;
    if (location.hash !== '#for-you') location.hash = '#for-you'; else { render(); var s1 = $('#for-you'); if (s1) s1.scrollTop = 0; window.scrollTo(0, 0); }
  }, true);
  document.addEventListener('click', function (e) {
    var q = e.target.closest && e.target.closest('[data-tt-open],[data-tt-close],[data-tt-set],[data-tt-today]'); if (!q) return;
    if (q.hasAttribute('data-tt-open')) { ttSheet(); return; }
    if (q.hasAttribute('data-tt-close')) { ttClose(); return; }
    if (q.hasAttribute('data-tt-today')) { ST.date = null; ttClose(); render(); return; }
    var dd = +$('#yp-td').value, mm = +$('#yp-tm').value, yy = +$('#yp-ty').value, dt = new Date(yy, mm, Math.min(dd, new Date(yy, mm + 1, 0).getDate()), 12);
    ST.date = dt.getTime(); ttClose(); render();
  });
  document.addEventListener('click', function (e) {
    var sd = e.target.closest && e.target.closest('#for-you [data-skyday]'); if (sd) { ST.skyDay = +sd.getAttribute('data-skyday'); render(); return; }
    var t = e.target.closest && e.target.closest('#for-you [data-tab],#for-you [data-dom],#for-you [data-cyc],#for-you [data-pl],#for-you [data-back],#for-you [data-home],#for-you [data-all],#for-you [data-set],#for-you [data-signout],#for-you [data-read],#for-you [data-save],#for-you [data-share],#for-you [data-go],#for-you [data-deep]'); if (!t) return;
    if (t.hasAttribute('data-home')) { if (history.length > 1) history.back(); else location.hash = ''; return; }
    if (t.hasAttribute('data-deep')) { var dp = t.nextElementSibling, open = dp && dp.hasAttribute('hidden'); if (dp) { if (open) dp.removeAttribute('hidden'); else dp.setAttribute('hidden', ''); } t.setAttribute('aria-expanded', open ? 'true' : 'false'); t.classList.toggle('on', !!open); t.querySelector('span').textContent = open ? 'إخفاء' : 'تعمّق'; return; }
    if (t.hasAttribute('data-go')) { var go = t.getAttribute('data-go'); if (go.indexOf('dom:') === 0) ST.view = { dom: go.slice(4), from: null }; else { ST.tab = go; ST.view = null; } render(); var s0 = $('#for-you'); if (s0) s0.scrollTop = 0; return; }
    if (t.hasAttribute('data-save')) { var sid = t.getAttribute('data-save'), L = saved(), k = L.indexOf(sid); if (k >= 0) L.splice(k, 1); else L.push(sid); try { localStorage.setItem(SAVE_KEY, JSON.stringify(L)); } catch (x) {} render(); return; }
    if (t.hasAttribute('data-share')) { var tt = t.getAttribute('data-share') + ' — عقيق أسترو'; try { if (navigator.share) navigator.share({ title: tt, url: location.origin + location.pathname }); else if (navigator.clipboard) { navigator.clipboard.writeText(tt + ' ' + location.origin + location.pathname); t.querySelector('span').textContent = 'تم النسخ'; } } catch (x) {} return; }
    if (t.hasAttribute('data-read')) {
      var kind = t.getAttribute('data-read'), rid = t.getAttribute('data-id'), pls = natal() ? window.AqeeqYou.placements(natal()) : [], tgt, ttl, kk;
      if (kind === 'cyc') { var lc = (allCycles() || []).filter(function (x) { return x.id + '|' + x.start === rid; })[0]; if (!lc) return; tgt = pls.filter(function (x) { return x.id === lc.n; })[0]; ttl = titleOf(lc); kk = astroLine(lc); }
      else { tgt = pls.filter(function (x) { return x.id === rid; })[0]; ttl = tgt ? tgt.nn + ' في ' + tgt.sign : ''; kk = 'صفة ثابتة في خريطتك'; }
      var cx = tgt && coreOf(tgt); if (cx) readerOpen(ttl, kk, cx.e.text); return;
    }
    if (t.hasAttribute('data-signout')) { var so = $('#acct-signout'); if (so) so.click(); return; }
    if (t.hasAttribute('data-set')) { ST.view = ST.view && ST.view.set ? null : { set: true }; ST.tries = 0; render(); window.scrollTo(0, 0); return; }
    if (t.hasAttribute('data-tab')) { var tn = t.getAttribute('data-tab'); if (tn === 'settings') { ST.view = { set: true }; ST.tries = 0; } else { ST.tab = tn; ST.view = null; } }
    else if (t.hasAttribute('data-dom')) ST.view = { dom: t.getAttribute('data-dom'), from: ST.view };
    else if (t.hasAttribute('data-cyc')) ST.view = { cyc: t.getAttribute('data-cyc'), from: ST.view };
    else if (t.hasAttribute('data-pl')) { var id = t.getAttribute('data-pl'), p = window.AqeeqYou.placements(natal()).filter(function (x) { return x.id === id; })[0]; ST.view = { pl: p.nn + ' في ' + p.sign, id: p.id, from: ST.view }; }
    else if (t.hasAttribute('data-all')) ST.all = true;
    else if (t.hasAttribute('data-back')) ST.view = (ST.view && ST.view.from) || null;
    render(); var s = $('#for-you'); if (s) s.scrollTop = 0;
  });

  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('#for-you [data-sv],#for-you [data-inb],#for-you [data-un-save]'); if (!el) return;
    if (el.hasAttribute('data-un-save')) {
      var inp = $('#yp-un'), m = $('#yp-un-m'), v = inp ? inp.value.trim().toLowerCase() : '';
      if (!unOk(v)) { if (m) { m.textContent = 'اكتب من 3 إلى 20 حرفًا إنجليزيًا أو رقمًا أو نقطة، وتبدأ بحرف.'; m.className = 'yp-un-m err'; } return; }
      var sb = window.aqeeqSupabase, say = function (t, ok) { if (m) { m.textContent = t; m.className = 'yp-un-m ' + (ok ? 'ok' : 'err'); } };
      if (!sb || !sb.rpc) { say('تعذّر الاتصال الآن، حاول لاحقًا.', false); return; }
      say('جارٍ التحقق...', true);
      sb.rpc('claim_username', { p_name: v }).then(function (r) {
        var d = r && !r.error ? r.data : 'err';
        if (d === 'ok') { try { localStorage.setItem(UN_KEY, v); } catch (x) {} say('تم حفظ اسم المستخدم.', true); }
        else if (d === 'taken') say('هذا الاسم مأخوذ، اختر اسمًا آخر.', false);
        else if (d === 'invalid') say('اكتب من 3 إلى 20 حرفًا إنجليزيًا أو رقمًا أو نقطة، وتبدأ بحرف.', false);
        else say('تعذّر الحفظ الآن، حاول مرة أخرى.', false);
      }, function () { say('تعذّر الحفظ الآن، حاول مرة أخرى.', false); });
      return;
    }
    ST.view = el.hasAttribute('data-sv') ? { sv: true } : { inb: true }; render(); var s0 = $('#for-you'); if (s0) s0.scrollTop = 0; window.scrollTo(0, 0);
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-nf-prev]')) nfPreview();
    else if (e.target.closest && e.target.closest('[data-nfp-x]')) nfClose();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') nfClose(); });
  document.addEventListener('change', function (e) {
    var q = e.target && e.target.getAttribute && e.target.getAttribute('data-nf'); if (q) nfSet(q, e.target.checked);
    if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-nf-time')) nfSet('time', e.target.value);
    if (e.target && e.target.id === 'yp-private') { try { localStorage.setItem('aqeeq_private_v1', e.target.checked ? '1' : '0'); } catch (_) {} }
  });
  document.addEventListener('aq:session', function () { route(); render(); });
  document.addEventListener('aq:admin', render);
  /* اهتزاز خفيف عند لمس أزرار التنقل (أندرويد؛ يتجاهله ما لا يدعمه) */
  document.addEventListener('pointerdown', function (e) { try { if (navigator.vibrate && e.target.closest && e.target.closest('.bnav-item,.yp-pill,.yp-ib')) navigator.vibrate(8); } catch (x) {} }, { passive: true });
  window.addEventListener('hashchange', function () { route(); if (location.hash === '#for-you') render(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { route(); render(); }); else { route(); render(); }
})();
