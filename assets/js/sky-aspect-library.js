/* مكتبة توقعات الأسبكتات في صفحة السماء: نص خاص لكل كوكبين وزاوية، يُضاف إلى النص القديم ولا يمحوه.
   الملفات في assets/data/sky-aspects: index.json (المجموعات المتاحة) وstages.json (سطر حالة الزاوية)
   وملف لكل مجموعة (moon.json ...) مفتاح كل نص: كوكب|كوكب|زاوية بترتيب الكواكب المعتاد.
   إن لم يوجد نص للتركيبة يبقى القالب القديم كما هو. */
(function () {
  'use strict';
  var BASE = 'assets/data/sky-aspects/';
  var LIB = {}, STAGES = null, ready = false, busy = false;

  function getJSON(name) {
    return fetch(BASE + name, { cache: 'default' }).then(function (r) { if (!r.ok) throw new Error(name); return r.json(); });
  }
  function load() {
    if (busy) return; busy = true;
    getJSON('index.json').then(function (idx) {
      var v = idx.version ? '?v=' + idx.version : '';
      var jobs = (idx.groups || []).map(function (g) {
        return fetch(BASE + g + '.json' + v).then(function (r) { return r.ok ? r.json() : {}; }).then(function (d) { for (var k in d) LIB[k] = d[k]; }).catch(function () { });
      });
      jobs.push(fetch(BASE + 'stages.json' + v).then(function (r) { return r.ok ? r.json() : null; }).then(function (s) { STAGES = s; }).catch(function () { }));
      return Promise.all(jobs);
    }).then(function () { ready = true; apply(); }).catch(function () { busy = false; });
  }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function stageLine(pair, ph) {
    if (!STAGES || !ph) return '';
    var k = pair.split('|')[2], type = k === 'conj' ? 'conj' : (k === 'square' || k === 'opp') ? 'hard' : 'soft';
    var arr = STAGES[type] && STAGES[type][ph]; if (!arr || !arr.length) return '';
    return arr[(hash(pair) + Math.floor(Date.now() / 864e5)) % arr.length];
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function apply() {
    if (!ready) return;
    var list = document.querySelectorAll('#sky-asp .ax[data-pair]');
    for (var i = 0; i < list.length; i++) {
      var el = list[i], e = LIB[el.getAttribute('data-pair')];
      if (e && e.alt && (hash(el.getAttribute('data-pair')) + Math.floor(Date.now() / 864e5)) % 2) e = e.alt;
      if (!e || el.getAttribute('data-lib') === '1') continue;
      var bx = el.querySelector('.ax-b'); if (!bx) continue;
      var kids = [].slice.call(bx.children), intro = '', reality = '', oldQ = '', keep = '';
      kids.forEach(function (c) {
        if (c.classList.contains('ax-q')) oldQ += c.outerHTML;
        else if (c.classList.contains('ax-note')) keep += c.outerHTML;
        else if (c.querySelector('b')) reality += c.outerHTML;
        else intro += c.outerHTML;
      });
      var st = stageLine(el.getAttribute('data-pair'), el.getAttribute('data-ph'));
      var pk = el.getAttribute('data-pair').split('|'), era = LIB[pk[0] + '|' + pk[1] + '|era'];
      bx.innerHTML = intro + (era ? (era.t || []).map(function (p) { return '<p class="ax-era">' + esc(p) + '</p>'; }).join('') : '') + (e.t || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + reality +
        (st ? '<p class="ax-note ax-stage">' + esc(st) + '</p>' : '') + keep +
        (e.q ? '<p class="ax-q">' + esc(e.q) + '</p>' : '') + oldQ;
      el.setAttribute('data-lib', '1');
    }
  }
  window.AqAspLib = { get: function (pair) { var e = LIB[pair]; if (!e) return null; if (e.alt && (hash(pair) + Math.floor(Date.now() / 864e5)) % 2) e = e.alt; return { t: e.t || [], q: e.q || '' }; }, ready: function () { return ready; } };
  function boot() {
    load();
    var host = document.getElementById('sky-asp'); if (!host) return;
    new MutationObserver(function () { if (!ready) { load(); } else { apply(); } }).observe(host, { childList: true, subtree: false });
    if (host.children.length) load();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
