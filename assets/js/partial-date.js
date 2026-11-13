/* مستويات تاريخ الميلاد الناقص في نموذج الخريطة الفلكية. لا يلمس المحرك ولا لوحة الخريطة الكاملة.
   سنة فقط: الكواكب البطيئة التي لم يتغير برجها طوال السنة. سنة وشهر: يضاف إليها ما لم يتغير برجه طوال الشهر (الشمس غالبًا).
   لا شيء: الجملة الهادئة فقط. التاريخ الكامل بلا ساعة والكامل بساعة يمرّان على المسار المعتاد دون تغيير. */
(function () {
  'use strict';
  var MSG_NONE = 'الخريطة تُبنى على تاريخ ميلادك. اسأل أهلك أو راجع شهادة الميلاد، ثم عُد إلينا.';
  var NOTE = { y: 'عرفنا سنة ميلادك فقط، فظهرت الكواكب البطيئة التي بقيت في برج واحد طوال تلك السنة. لباقي الخريطة نحتاج الشهر واليوم.',
    ym: 'عرفنا سنة وشهر ميلادك، فظهرت الكواكب التي بقيت في برج واحد طوال ذلك الشهر، وهي قراءة تقريبية. لخريطتك الكاملة نحتاج اليوم أيضًا.' };
  var SLOW = { y: ['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'], ym: ['sun', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'] };
  var $ = function (s) { return document.querySelector(s); };

  function init() {
    var form = $('#cform'), dateF = $('#f-date'), unk = $('#f-unknown');
    if (!form || !dateF || $('#f-datelevel')) return;
    var anchor = dateF.closest('.ntx-dt') || dateF.closest('.field');
    var box = document.createElement('div');
    box.className = 'pd-box';
    box.innerHTML = '<label class="pd-l" for="f-datelevel">ما الذي تعرفه من تاريخ ميلادك؟</label>' +
      '<select id="f-datelevel"><option value="full">التاريخ كاملًا</option><option value="ym">السنة والشهر فقط</option><option value="y">السنة فقط</option><option value="none">لا أعرف شيئًا منه</option></select>' +
      '<div class="pd-part" hidden><input id="f-py" type="number" inputmode="numeric" min="1900" max="2100" placeholder="السنة" aria-label="السنة">' +
      '<select id="f-pm" aria-label="الشهر"></select></div>';
    anchor.parentNode.insertBefore(box, anchor.nextSibling);
    var AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    $('#f-pm').innerHTML = AR.map(function (n, i) { return '<option value="' + (i + 1) + '">' + n + '</option>'; }).join('');
    var sel = $('#f-datelevel'), part = box.querySelector('.pd-part'), dateField = dateF.closest('.field');
    function sync() {
      var v = sel.value, partial = v === 'ym' || v === 'y';
      part.hidden = !partial; $('#f-pm').hidden = v !== 'ym';
      dateField.style.display = v === 'full' ? '' : 'none';
      dateF.required = v === 'full';
    }
    sel.addEventListener('change', sync); sync();

    form.addEventListener('submit', function (e) {
      var v = sel.value; if (v === 'full') return;
      e.preventDefault(); e.stopImmediatePropagation();
      var err = $('#ferr'); if (err) err.hidden = true;
      if (v === 'none') { if (err) { err.textContent = MSG_NONE; err.hidden = false; } return; }
      var y = parseInt($('#f-py').value, 10);
      if (!(y >= 1900 && y <= 2100)) { if (err) { err.textContent = 'اكتب سنة الميلاد بين 1900 و 2100.'; err.hidden = false; } return; }
      show(v, y, parseInt($('#f-pm').value, 10));
    }, true);
  }

  function stable(A, key, from, to) {
    var a = signOf(A, key, from), b = signOf(A, key, to);
    return a === b ? a : null;
  }
  function signOf(A, key, ms) {
    var c = A.chart({ utcMs: ms, lat: 30.04, lon: 31.24, known: false }), b = c.bodies.filter(function (x) { return x.key === key; })[0];
    return b ? Math.floor(((b.lon % 360) + 360) % 360 / 30) : null;
  }

  function show(level, y, m) {
    var A = window.Astro, L = window.AqeeqInterpretations; if (!A || !L || !L.partial) return;
    var from = level === 'y' ? Date.UTC(y, 0, 1) : Date.UTC(y, m - 1, 1), to = level === 'y' ? Date.UTC(y, 11, 31, 23) : Date.UTC(y, m, 0, 23);
    var list = [];
    SLOW[level].forEach(function (k) { var sg = stable(A, k, from, to); if (sg != null) list.push({ key: k, sign: sg }); });
    L.partial(list).then(function (html) {
      var r = $('#result'); if (!r) return;
      r.innerHTML = '<div class="nd-root pd-root"><div class="nd-title"><h3>قراءة تقريبية</h3><p>' + NOTE[level] + '</p></div>' +
        '<div class="nd-main nd-list il-wrap" data-nd-panel="planets">' + html + '</div>' +
        '<button type="button" class="btn-edit-chart pd-add">أضف باقي التاريخ</button></div>';
      r.hidden = false; r.style.display = 'block';
      var cf = $('#cform'); if (cf) { cf.hidden = true; cf.style.display = 'none'; }
      var intro = document.querySelector('#chart .center'); if (intro) { intro.hidden = true; intro.style.display = 'none'; }
      r.querySelector('.pd-add').addEventListener('click', function () {
        r.hidden = true; r.style.display = 'none'; if (cf) { cf.hidden = false; cf.style.display = ''; }
        if (intro) { intro.hidden = false; intro.style.display = ''; }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      r.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
