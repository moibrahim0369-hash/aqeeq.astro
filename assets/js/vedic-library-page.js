(function(){
 'use strict';
 var SG=['الحمل','الثور','الجوزاء','السرطان','الأسد','العذراء','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'];
 var PN={sun:'الشمس',moon:'القمر',mars:'المريخ',mercury:'عطارد',jupiter:'المشتري',venus:'الزهرة',saturn:'زحل',node:'راهو',ketu:'كيتو'};
 var type=document.getElementById('type'),select=document.getElementById('selector'),search=document.getElementById('search'),results=document.getElementById('results'),count=document.getElementById('result-count'),more=document.getElementById('more'),data=null,limit=16,chosen={chart:'1',planet:'sun'};
 function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 function norm(s){return String(s).normalize('NFKC').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').trim().toLowerCase();}
 function options(){
  document.getElementById('selector-label').firstChild.nodeValue=type.value==='chart'?'الخريطة':'الكوكب';
  var keys=type.value==='chart'?window.AqVedicNarratives.chartKeys:Object.keys(PN);
  select.innerHTML=keys.map(function(k){return '<option value="'+k+'">'+esc(type.value==='chart'?data.charts[k].title:PN[k])+'</option>';}).join('');select.value=chosen[type.value];
 }
 function list(){
  var key=select.value,out=[];
  if(type.value==='chart'){
   var c=data.charts[key];out.push({id:'vedic.'+key+'.intro',title:c.title,label:'مدخل الخريطة',lead:'',paragraphs:[c.intro],precision:c.precisionNote});
   Object.keys(c.houseReadings).sort(function(a,b){return +a-+b;}).forEach(function(h){var e=c.houseReadings[h];out.push({id:'vedic.'+key+'.house.'+h,title:c.title+' · البيت '+h,label:'عدسة البيت عند وجود كواكب فيه',lead:e.lead,paragraphs:e.paragraphs,precision:''});});
  }else{
   var p=data.planets[key];out.push({id:'vedic.planet.'+key+'.role',title:'دور '+PN[key],label:'معنى الكوكب في القراءة',paragraphs:[p.role]});
   for(var s=0;s<12;s++)out.push({id:'vedic.planet.'+key+'.sign.'+s,title:PN[key]+' في '+SG[s],label:'سياق الكوكب في البرج النجمي',paragraphs:[p.signs[s]]});
  }
  var q=norm(search.value);return q?out.filter(function(e){return norm([e.title,e.lead].concat(e.paragraphs).join(' ')).includes(q);}):out;
 }
 function draw(){
  chosen[type.value]=select.value;var entries=list();count.textContent=entries.length+' مقطعًا مطابقًا'+(search.value?' للبحث':' في هذا الاختيار');
  results.innerHTML=entries.length?entries.slice(0,limit).map(function(e){return '<article data-library-entry="'+e.id+'"><small>'+esc(e.label)+'</small><h2>'+esc(e.title)+'</h2>'+(e.lead?'<p class="lead">'+esc(e.lead)+'</p>':'')+e.paragraphs.map(function(p){return '<p>'+esc(p)+'</p>';}).join('')+(e.precision?'<div class="precision">'+esc(e.precision)+'</div>':'')+'</article>';}).join(''):'<p class="empty">لا يوجد نص مطابق في هذا الاختيار. جرّب كلمة أقصر أو خريطة أخرى.</p>';
  more.hidden=entries.length<=limit;
 }
 window.AqVedicNarratives.load().then(function(d){
  data=d;var p=new URLSearchParams(location.search),k=p.get('chart');if(k&&d.charts[k])chosen.chart=k;
  var st=d.statistics;document.getElementById('stats').textContent=st?st.chartViews+' خريطة · '+st.applicableHouseReadings+' قراءة بيت قابلة للتطبيق · '+st.planetSignContexts+' سياقًا للكواكب في الأبراج. الأعداد لا تشمل التركيبات الممكنة.':'';
  options();draw();
  type.addEventListener('change',function(){limit=16;options();draw();});select.addEventListener('change',function(){limit=16;draw();});search.addEventListener('input',function(){limit=16;draw();});more.addEventListener('click',function(){limit+=16;draw();});
 }).catch(function(){document.getElementById('stats').textContent='المكتبة غير متاحة الآن.';results.innerHTML='<p class="error">تعذر تحميل النصوص. أعد فتح الصفحة بعد قليل؛ لم تتغير بياناتك أو حساباتك.</p>';});
})();
