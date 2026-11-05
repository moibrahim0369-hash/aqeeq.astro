/* ربط الكيانات الفلكية بالمقالات. قراءة فقط: لا حسابات فلكية هنا.
   window.AqeeqContentLinks.find('retrograde-mercury') -> { slug, href, label, kind:'exact'|'general' } | null
   الأولوية: تطابق entityKey -> كوكب + نوع الحدث -> دليل عام (بصياغة صريحة) -> null */
(function () {
  'use strict';
  var DATA = null, waiting = [];
  function parse(k) {
    var p = String(k || '').split('-');
    return { type: p[0], planet: p[1] || '', raw: String(k || '') };
  }
  function articleOk(slug) {
    var fc = window.FeaturedContent; if (!fc || typeof fc.get !== 'function') return true;
    var all = fc.all ? fc.all() : null; if (!all || !all.length) return true; /* لم يُحمَّل بعد: لا نحجب */
    return !!fc.get(slug);
  }
  function make(e, kind) { return { slug: e.slug, href: '#featured-content/' + e.slug, label: e.label, kind: kind }; }
  function find(entityKey) {
    if (!DATA || !entityKey) return null;
    var k = parse(entityKey), i, e;
    for (i = 0; i < DATA.entries.length; i++) { e = DATA.entries[i]; if (e.entityKey === k.raw && articleOk(e.slug)) return make(e, 'exact'); }
    for (i = 0; i < DATA.entries.length; i++) { e = DATA.entries[i]; if (e.entityType === k.type && (!e.planet || e.planet === k.planet) && e.entityType === 'moon-phase' && articleOk(e.slug)) return make(e, 'exact'); }
    var t = k.type === 'moon' ? 'moon-phase' : k.type;
    for (i = 0; i < DATA.general.length; i++) { e = DATA.general[i]; if (e.entityType === t && articleOk(e.slug)) return make(e, 'general'); }
    return null;
  }
  /* يضيف ?from= لمصدر العودة */
  function hrefFrom(link, from) { return link ? link.href + (from ? '?from=' + encodeURIComponent(from) : '') : ''; }
  window.AqeeqContentLinks = { find: find, hrefFrom: hrefFrom, ready: function (cb) { if (DATA) cb(); else waiting.push(cb); } };
  fetch('assets/data/content-links.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
    if (!j) return; DATA = j; waiting.splice(0).forEach(function (f) { try { f(); } catch (e) { } });
    window.dispatchEvent(new Event('aqeeq:content-links-ready'));
  }).catch(function () { });
})();
