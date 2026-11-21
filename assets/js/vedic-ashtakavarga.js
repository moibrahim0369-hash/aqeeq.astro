/* Raw Parashari Ashtakavarga. BPHS 66.43–60, favourable marks only. */
(function () {
  'use strict';
  var KEYS = ['sun','moon','mars','mercury','jupiter','venus','saturn','asc'];
  var NAMES = ['الشمس','القمر','المريخ','عطارد','المشتري','الزهرة','زحل','الطالع'];
  // Each row lists contributors for houses 1..12. Index order is KEYS above.
  // Encoded by destination house, not copied from a software implementation.
  var HOUSE = [
    ['026','026','137','0267','34','13457','0256','026','02346','012367','0123467','357'],
    ['134','24','0123567','345','2356','01267','01345','034','15','0123457','01234567',''],
    ['267','2','0137','26','03','013457','26','256','6','02467','01234567','45'],
    ['23567','12567','35','12567','035','01347','26','124567','02356','12367','01234567','034'],
    ['02347','0123457','046','02347','13567','3567','01247','024','01357','023457','0123457','6'],
    ['157','157','123567','12567','134567','23','','014567','1234567','456','01234567','012'],
    ['07','0','1267','07','246','1234567','0','03','3','0237','01234567','2345']
  ];
  var TOTAL = [48,49,39,54,56,52,39];
  function norm(x) { return ((x % 360) + 360) % 360; }
  function signsOf(ch) {
    if (!ch || !ch.known || !Number.isFinite(ch.asc)) throw new Error('وقت ميلاد معلوم وطالع صالح مطلوبان لإضافة مساهمة الطالع.');
    return KEYS.map(function (k) {
      var b = (ch.bodies || []).filter(function (x) { return String(x.key).toLowerCase() === k; })[0];
      var v = k === 'asc' ? ch.asc : b && b.lon;
      if (!Number.isFinite(v)) throw new Error('موضع كوكب مطلوب غير متاح.');
      return Math.floor(norm(v) / 30);
    });
  }
  function calculate(ch) {
    var signs = signsOf(ch), sav = Array(12).fill(0);
    var bav = HOUSE.map(function (houses, p) {
      var contributors = KEYS.map(function () { return Array(12).fill(0); });
      houses.forEach(function (cs, h) { cs.split('').forEach(function (c) { var k = +c; contributors[k][(signs[k] + h) % 12] = 1; }); });
      var values = Array.from({length:12}, function (_, s) { return contributors.reduce(function (a,r) { return a + r[s]; }, 0); });
      if (values.reduce(function(a,b){return a+b;},0) !== TOTAL[p]) throw new Error('فشل تحقق مجموع الجدول.');
      values.forEach(function(v,s){sav[s]+=v;});
      return { key: KEYS[p], values: values, contributors: contributors, total: TOTAL[p] };
    });
    return { bav: bav, sav: sav, total: sav.reduce(function(a,b){return a+b;},0), lagna: signs[7], convention: 'BPHS-66-raw-favourable-Parashara' };
  }
  function createCard() {
    var el = document.createElement('div'); el.className = 'vav vad';
    var L = window.AqVedic && window.AqVedic.last;
    if (!L) { el.textContent = 'احسب خريطتك أولًا.'; return el; }
    var r; try { r = calculate(L.ch); } catch(e) { el.innerHTML = '<p class="vad-warning"></p>'; el.firstChild.textContent=e.message+' لا نستبدل الطالع بالقمر هنا حتى لا نعطي مجموعًا مضللًا.'; return el; }
    el.innerHTML = '<p class="vad-lead">نقاط البروج من الكواكب السبعة والطالع. اختر المجموع العام أو جدول كوكب لعرض مساهمات المصادر الثمانية.</p><label>الجدول<select class="vav-select"><option value="sav">سارفا · المجموع العام (337)</option>'+r.bav.map(function(b,p){return '<option value="'+p+'">بِهِنّا · '+NAMES[p]+' ('+b.total+')</option>';}).join('')+'</select></label><div class="vav-out" aria-live="polite"></div><p class="vad-note">المدرسة: باراشارا، BPHS 66، النقاط الملائمة قبل أي اختزال. لا يشمل راهو وكيتو أو جدولًا ثامنًا للطالع. بعض النصوص تسمي العلامة الملائمة «ريخا»، ونسميها هنا نقطة ملائمة بوضوح. لا نخلطها بالنقاط غير الملائمة.</p><p class="vad-note">مجموع الجداول السبعة دائمًا 337، لكنه لا يثبت المدرسة وحده. جداول فاراهاميهيرا تختلف في ست خلايا مع بقاء المجموع نفسه. هذه أعداد تقليدية للتأمل وليست احتمالات نجاح أو توقعًا مضمونًا.</p>';
    function render() {
      var val=el.querySelector('select').value, idx=val==='sav'?-1:+val, arr=idx<0?r.sav:r.bav[idx].values;
      var h='<div class="vad-signs">';
      arr.forEach(function(v,s){h+='<article><span>'+window.AqVedic.T.SG[s]+'</span><b>'+v+'</b><small>البيت '+((s-r.lagna+12)%12+1)+'</small></article>';}); h+='</div>';
      h+='<p class="vad-total">المجموع: '+(idx<0?r.total:r.bav[idx].total)+'</p>';
      if(idx>=0) {
        h+='<h5>مصدر كل نقطة</h5><p class="vad-note">اسحب الجدول أفقيًا لعرض البروج الاثني عشر. 1 مساهمة ملائمة، و0 لا مساهمة.</p><div class="vad-scroll" tabindex="0" aria-label="مساهمات المصادر في البروج"><table><thead><tr><th scope="col">المصدر</th>'+window.AqVedic.T.SG.map(function(n){return '<th scope="col">'+n+'</th>';}).join('')+'</tr></thead><tbody>';
        r.bav[idx].contributors.forEach(function(row,k){h+='<tr><th scope="row">'+NAMES[k]+'</th>'+row.map(function(v){return '<td>'+v+'</td>';}).join('')+'</tr>';});
        h+='<tr><th scope="row">المجموع</th>'+arr.map(function(v){return '<td><b>'+v+'</b></td>';}).join('')+'</tr></tbody></table></div>';
      }
      el.querySelector('.vav-out').innerHTML=h;
    }
    el.querySelector('select').addEventListener('change',render);render();return el;
  }
  window.AqAshtakavarga={ calculate:calculate, createCard:createCard };
})();
