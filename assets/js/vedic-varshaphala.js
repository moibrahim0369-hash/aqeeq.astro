/* Sidereal solar return and annual chart. Uses the site's true-Sun ephemeris and Lahiri. */
(function(){
 'use strict';
 var DAY=864e5,K=['sun','moon','mars','mercury','jupiter','venus','saturn','node'],N=['الشمس','القمر','المريخ','عطارد','المشتري','الزهرة','زحل','راهو'],RULER=[2,5,3,1,0,3,5,2,4,6,6,4],ORB=[15,12,8,7,9,7,9];
 function norm(v){return ((v%360)+360)%360;}
 function signed(v){return norm(v+180)-180;}
 function body(ch,k){return(ch.bodies||[]).filter(function(b){return b.key===k;})[0];}
 function sunAt(ms){var A=window.Astro,jd=A.jdFromMs(ms),jde=jd+A.deltaT(A.yearOf(jd))/86400;return norm(A.lonOf('sun',jde)-window.AqEam.ayanamsa(jde));}
 function root(target,guess){
  var lo=guess-4*DAY,hi=guess+4*DAY,fl=signed(sunAt(lo)-target),fh=signed(sunAt(hi)-target);
  if(!(fl<0&&fh>0))throw new Error('تعذر إحاطة عودة الشمس؛ لا نستخدم تقدير عيد الميلاد بدل الحل.');
  for(var i=0;i<50&&hi-lo>0.002;i++){var mid=(lo+hi)/2,fm=signed(sunAt(mid)-target);if(fm<0)lo=mid;else hi=mid;}
  var ms=(lo+hi)/2,residual=Math.abs(signed(sunAt(ms)-target));if(residual>1e-6)throw new Error('فشل تحقق زاوية العودة.');return {ms:ms,residual:residual};
 }
 function muntha(birthAsc,age,annualAsc){if(!Number.isFinite(birthAsc)||!Number.isFinite(annualAsc)||!Number.isInteger(age)||age<0)throw new Error('بيانات مونثا غير صالحة.');var sign=(Math.floor(norm(birthAsc)/30)+age)%12;return {sign:sign,house:(sign-Math.floor(norm(annualAsc)/30)+12)%12+1,lord:RULER[sign]};}
 function tajika(a,b,pa,pb){
  var h=(Math.floor(norm(b.lon)/30)-Math.floor(norm(a.lon)/30)+12)%12+1;
  if([1,3,4,5,7,9,10,11].indexOf(h)<0)return null;
  var friendly=[3,5,9,11].indexOf(h)>=0,exact=(h-1)*30,gap=signed(norm(b.lon-a.lon)-exact),fast=Math.abs(a.speed)>=Math.abs(b.speed)?pa:pb,orb=ORB[fast];
  var retro=a.speed<0||b.speed<0,change=(b.speed-a.speed)*gap,status=Math.abs(gap)<1e-5?'دقيق الآن':retro?'راجع · لا نصنف التطبيق':change<0?'يتقارب لحظيًا':change>0?'يتباعد لحظيًا':'ثابت لحظيًا';
  return {a:pa,b:pb,house:h,angle:exact,friendly:friendly,orb:Math.abs(gap),limit:orb,within:Math.abs(gap)<=orb,status:status};
 }
 // Tajika five-dignity strength, Nilakanthi/Hayanaratna named convention.
 var HADDA=[[[4,6],[5,12],[3,20],[2,25],[6,30]],[[5,8],[3,14],[4,22],[6,27],[2,30]],[[3,6],[5,12],[4,17],[2,24],[6,30]],[[2,7],[5,13],[3,19],[4,26],[6,30]],[[4,6],[5,11],[6,18],[3,24],[2,30]],[[3,7],[5,17],[4,21],[2,28],[6,30]],[[6,6],[3,14],[4,21],[5,28],[2,30]],[[2,7],[5,11],[3,19],[4,24],[6,30]],[[4,12],[5,17],[3,21],[2,26],[6,30]],[[3,7],[4,14],[5,22],[6,26],[2,30]],[[3,7],[5,13],[4,20],[2,25],[6,30]],[[5,12],[4,16],[3,19],[2,28],[6,30]]];
 var EXALT=[10,33,298,165,95,357,200];
 function hadda(lon){var s=Math.floor(norm(lon)/30),d=norm(lon)%30;return HADDA[s].filter(function(v){return d<v[1];})[0][0];}
 function tajikaRelation(p,q,positions){if(p===q)return 1;var h=(Math.floor(norm(positions[q])/30)-Math.floor(norm(positions[p])/30)+12)%12+1;return [3,5,9,11].indexOf(h)>=0?0.75:[1,4,7,10].indexOf(h)>=0?0.25:0.5;}
 function pancha(positions){
  if(!Array.isArray(positions)||positions.length<7||positions.some(function(v){return !Number.isFinite(v);}))throw new Error('مواضع القوة الخماسية غير مكتملة.');
  return positions.slice(0,7).map(function(l,p){var s=Math.floor(norm(l)/30),d=norm(l)%30,dec=(s+[2,0,5][Math.floor(d/10)])%7,nav=((s%4===0?0:s%4===1?9:s%4===2?6:3)+Math.floor(d/(30/9)))%12;
   var owners=[RULER[s],hadda(l),dec,RULER[nav]],weights=[30,15,10,5],parts=owners.map(function(q,i){return weights[i]*tajikaRelation(p,q,positions);});
   var uc=Math.abs(signed(l-norm(EXALT[p]+180)))/9;parts.splice(1,0,uc);return {key:K[p],owners:owners,parts:parts,total:parts.reduce(function(a,b){return a+b;},0)/4};
  });
 }
 function officeHolders(birthAsc,annual,mun,day){
  if(day===null)return {candidates:[],selected:null,reason:'الشمس قريبة من الأفق؛ لا نحسم النهار والليل قرب الحد.'};
  var ascSign=Math.floor(norm(annual.asc)/30),positions=K.slice(0,7).map(function(k){return body(annual,k).lon;}),strength=pancha(positions),triDay=[0,5,6,5,4,1,3,2,6,2,4,1],triNight=[4,1,3,2,0,5,6,5,6,2,4,1];
  var ids=[RULER[Math.floor(norm(birthAsc)/30)],RULER[ascSign],mun.lord,(day?triDay:triNight)[ascSign],RULER[Math.floor(positions[day?0:1]/30)]],labels=['حاكم طالع الميلاد','حاكم طالع السنة','حاكم مونثا','حاكم التثليث','حاكم برج '+(day?'الشمس · عودة نهارية':'القمر · عودة ليلية')];
  var candidates=ids.map(function(p,i){var h=(ascSign-Math.floor(positions[p]/30)+12)%12+1,asp=({1:60,3:40,4:15,5:45,7:60,9:45,10:15,11:10})[h]||0;return {key:p,role:labels[i],strength:strength[p].total,aspect:asp};});
  var unique=candidates.filter(function(v,i,a){return a.findIndex(function(x){return x.key===v.key;})===i;}),eligible=unique.filter(function(v){return v.aspect>0;});
  if(!eligible.length)return {candidates:candidates,strength:strength,selected:null,reason:'لا أحد من المرشحين يتصل بالطالع. تختلف قاعدة الترجيح بين النصوص؛ لا نختار حاكمًا بلا حسم المدرسة.'};
  eligible.sort(function(a,b){return b.strength-a.strength||b.aspect-a.aspect;});var best=eligible[0],ties=eligible.filter(function(v){return Math.abs(v.strength-best.strength)<1e-8&&v.aspect===best.aspect;});
  if(ties.length>1){var mt=ties.filter(function(v){return v.key===mun.lord;})[0];if(mt)best=mt;else return {candidates:candidates,strength:strength,selected:null,reason:'تعادل غير محسوم بين المرشحين؛ لا نفرض حاكمًا للسنة.'};}
  if(best.key===1)return {candidates:candidates,strength:strength,selected:null,reason:'القمر هو الأعلى بين المرشحين. اختياره يحتاج قاعدة الإيثاسالا والاستبدال الخاصة؛ لا نسمّي حاكمًا نهائيًا قبل تطبيقها.'};
  return {candidates:candidates,strength:strength,selected:best.key,reason:'الأقوى بالقوة الخماسية بين المرشحين المتصلين بالطالع، وفق الصيغة المعلنة. الاختيار لا يتضمن فحص جميع موانع دوروفا.'};
 }
 function punya(sun,moon,asc,day){
  var a=day?sun:moon,b=day?moon:sun;if(Math.floor(norm(asc)/30)===Math.floor(norm(a)/30)||Math.floor(norm(asc)/30)===Math.floor(norm(b)/30))return null;
  var between=norm(asc-a)<norm(b-a);return norm(b-a+asc+(between?0:30));
 }

 function calculate(ch,natal,year,location){
  if(!ch||!ch.known||!Number.isFinite(ch.asc)||!natal||!Number.isFinite(natal.utcMs))throw new Error('وقت الميلاد الدقيق مطلوب لحساب عودة الشمس والطالع ومونثا.');
  var birthYear=Number.isInteger(natal.y)?natal.y:new Date(natal.utcMs).getUTCFullYear();
  if(!Number.isInteger(year)||year<=birthYear||year>Math.min(2200,birthYear+120))throw new Error('اختر سنة بعد سنة الميلاد وفي حدود 120 سنة، وحتى 2200.');
  var lat=location&&location.lat,lon=location&&location.lon;
  if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>89||Math.abs(lon)>180)throw new Error('أدخل إحداثيات صحيحة: العرض من -89 إلى 89 والطول من -180 إلى 180.');
  var s=body(ch,'sun');if(!s||!Number.isFinite(s.lon))throw new Error('شمس الميلاد غير متاحة.');
  var age=year-birthYear,guess=natal.utcMs+age*365.25636*DAY,ret=root(norm(s.lon),guess),next=root(norm(s.lon),guess+365.25636*DAY);
  var A=window.Astro,annual=A.chart({utcMs:ret.ms,lat:lat,lon:lon,known:true,hs:'whole'}),off=window.AqEam.ayanamsa(annual.jde);
  annual.bodies=annual.bodies.map(function(b){var l=norm(b.lon-off);return Object.assign({},b,{lon:l,sign:Math.floor(l/30)});});
  annual.asc=norm(annual.asc-off);annual.mc=norm(annual.mc-off);annual.cusps=Array.from({length:12},function(_,i){return (Math.floor(annual.asc/30)*30+i*30)%360;});annual.sidereal=true;annual.ayanamsa=off;
  annual.bodies.forEach(function(b){b.house=(Math.floor(b.lon/30)-Math.floor(annual.asc/30)+12)%12+1;});
  var points=K.map(function(k){return body(annual,k);}),aspects=[];
  for(var i=0;i<7;i++)for(var j=i+1;j<7;j++){var asp=tajika(points[i],points[j],i,j);if(asp)aspects.push(asp);}
  var AA=window.Astronomy,observer=new AA.Observer(lat,lon,0),eq=AA.Equator('Sun',new Date(ret.ms),observer,true,true),alt=AA.Horizon(new Date(ret.ms),observer,eq.ra,eq.dec,'normal').altitude,day=alt>1?true:alt<-1?false:null,mu=muntha(ch.asc,age,annual.asc);
  var offices=officeHolders(ch.asc,annual,mu,day),saham=day===null?null:punya(body(annual,'sun').lon,body(annual,'moon').lon,annual.asc,day);
  return {year:year,age:age,returnMs:ret.ms,nextMs:next.ms,residual:ret.residual,target:norm(s.lon),chart:annual,muntha:mu,offices:offices,punya:saham,day:day,aspects:aspects,location:{lat:lat,lon:lon},convention:'Lahiri-sidereal-return-whole-sign-Muntha'};
 }
 function createCard(){
  var el=document.createElement('div'),L=window.AqVedic&&window.AqVedic.last;el.className='vyr vad';
  if(!L||!L.ch.known){el.innerHTML='<p class="vad-warning">وقت الميلاد غير معروف. لا نخمن موعد العودة أو الطالع أو مونثا.</p>';return el;}
  var min=(Number.isInteger(L.natal.y)?L.natal.y:new Date(L.natal.utcMs).getUTCFullYear())+1,max=Math.min(2200,min+119),yr=Math.max(min,Math.min(max,new Date().getFullYear()+1));
  var place=String(L.natal.placeName||L.natal.place||'مكان الميلاد'),esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  el.innerHTML='<p class="vad-lead">الخريطة السنوية لحظة عودة الشمس إلى طولها النجمي عند ميلادك، مع طالع السنة ومونثا والاتصالات التاجيكية. العودة ليست تكرار الساعة والتاريخ المدنيين.</p><label>سنة العودة المرجعية<input class="vyr-year" type="number" min="'+min+'" max="'+max+'" step="1" value="'+yr+'"></label><label>مكان العودة<select class="vyr-place"><option value="birth">مكان الميلاد</option><option value="custom">مكان آخر · إحداثيات</option></select></label><p class="vad-note">الافتراضي مكان الميلاد: '+esc(place)+' ('+L.ch.lat.toFixed(4)+', '+L.ch.lon.toFixed(4)+'). غيّره إذا كنت تريد خريطة العودة على مكان آخر، فالمكان يغيّر الطالع والبيوت لا لحظة عودة الشمس.</p><div class="vyr-coords" hidden><label>خط العرض · شمال موجب وجنوب سالب<input class="vyr-lat" type="number" min="-89" max="89" step="any" value="'+L.ch.lat+'"></label><label>خط الطول · شرق موجب وغرب سالب<input class="vyr-lon" type="number" min="-180" max="180" step="any" value="'+L.ch.lon+'"></label></div><button type="button" class="vyr-go">احسب العودة السنوية</button><div class="vyr-out" aria-live="polite"></div><p class="vad-note">المدرسة: العودة النجمية مع لاهيري، وبيوت البرج الكامل. مونثا تتقدم برجًا لكل سنة مكتملة من طالع الميلاد. التوقيت معروض بـUTC وتوقيت جهاز العرض، ولا يغيّر الحساب.</p><p class="vad-note">هذه طبقة الخريطة السنوية وليست تقرير تاجيكا كاملًا. ترشيح حاكم السنة أولي من المرشحين والقوة الخماسية، ولا يشمل جميع موانع دوروفا. لا نختار آليًا في تعادل غير محسوم أو حين يلزم استبدال القمر أو يغيب الاتصال بالطالع. سهم بونيا وحده هنا، لا السهام الخمسون ولا اليوغات الست عشرة كاملة. التطبيق والانفصال هنا وصف عددي لحظي، وليس حكم إيثاسالا كاملًا. الأرقام الفلكية لا تثبت صحة التنبؤات.</p>';
  el.querySelector('.vyr-place').addEventListener('change',function(){el.querySelector('.vyr-coords').hidden=this.value!=='custom';});
  function fmt(ms,tz){return new Intl.DateTimeFormat('ar-EG',{timeZone:tz,dateStyle:'long',timeStyle:'medium'}).format(new Date(ms));}
  function deg(l){return window.AqVedic.T.SG[Math.floor(norm(l)/30)]+' '+(norm(l)%30).toFixed(4)+'°';}
  function run(){var out=el.querySelector('.vyr-out');try{
    var custom=el.querySelector('.vyr-place').value==='custom',lat=custom?Number(el.querySelector('.vyr-lat').value):L.ch.lat,lon=custom?Number(el.querySelector('.vyr-lon').value):L.ch.lon;
    if(custom&&(el.querySelector('.vyr-lat').value.trim()===''||el.querySelector('.vyr-lon').value.trim()===''))throw new Error('أدخل خط العرض والطول معًا.');
    var r=calculate(L.ch,L.natal,Number(el.querySelector('.vyr-year').value),{lat:lat,lon:lon}),SG=window.AqVedic.T.SG,zone=Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC';
    var h='<h5>العودة رقم '+r.age+' · سنة '+r.year+'</h5><div class="vyr-moment"><span>لحظة العودة · UTC</span><b>'+fmt(r.returnMs,'UTC')+'</b><span>توقيت جهاز العرض · '+esc(zone)+'</span><b>'+fmt(r.returnMs,zone)+'</b><small>السنة تنتهي عند العودة التالية: '+fmt(r.nextMs,'UTC')+' UTC</small></div><p class="vad-note">مكان الحساب: '+lat.toFixed(4)+', '+lon.toFixed(4)+(custom?' · إحداثيات مختارة':' · مكان الميلاد')+'. وقت العودة هو حل عددي للزاوية؛ عرضه بالثانية لا يعني أن وقت الميلاد أو النموذج الفلكي دقيقان لثانية.</p><div class="vad-signs"><article><span>طالع السنة</span><b>'+SG[Math.floor(r.chart.asc/30)]+'</b><small>'+(r.chart.asc%30).toFixed(3)+'°</small></article><article><span>مونثا</span><b>'+SG[r.muntha.sign]+'</b><small>البيت '+r.muntha.house+' · حاكمها '+N[r.muntha.lord]+'</small></article></div>';
    if(window.AqVedicChart){var m=window.AqVedicChart.build(r.chart,1);h+='<div class="vyr-chart">'+window.AqVedicChart.svg(m,'خريطة العودة الشمسية النجمية '+r.year)+'</div>';}
    h+='<h5>القوة الخماسية ومرشحو حاكم السنة</h5><p class="vad-note">'+(r.offices.selected===null?'لا ترشيح نهائي آلي':('الترشيح الأولي: '+N[r.offices.selected]))+'. '+r.offices.reason+'</p><div class="vyr-candidates">';
    r.offices.candidates.forEach(function(v){h+='<article><span>'+v.role+'</span><b>'+N[v.key]+'</b><small>القوة الخماسية '+v.strength.toFixed(3)+' / 20 · '+(v.aspect?'اتصال بالطالع '+v.aspect+'/60':'بلا اتصال بالطالع')+'</small></article>';});h+='</div><p class="vad-note">'+(r.punya===null?'سهم بونيا: لا قيمة آلية عند التباس الحد أو النهار والليل.':'سهم بونيا: '+deg(r.punya))+'. الترشيح ليس توقعًا لحدث.</p>';
    if(r.offices.strength){h+='<div class="vad-scroll" tabindex="0" aria-label="تفاصيل القوة الخماسية"><table><thead><tr><th>الكوكب</th><th>البرج /30</th><th>الشرف /20</th><th>حدّا /15</th><th>العشرية /10</th><th>التسع /5</th><th>المجموع /20</th></tr></thead><tbody>';r.offices.strength.forEach(function(v,p){h+='<tr><th>'+N[p]+'</th>'+v.parts.map(function(n){return '<td>'+n.toFixed(3)+'</td>';}).join('')+'<td>'+v.total.toFixed(3)+'</td></tr>';});h+='</tbody></table></div><p class="vad-note">تُجمع القيم الخمس ثم تُقسم على 4. علاقات تاجيكا وديّة/محايدة/عدائية، وليست الصداقة المركبة لباراشارا.</p>';}
    h+='<div class="vad-scroll" tabindex="0" aria-label="مواضع الكواكب في خريطة العودة"><table><thead><tr><th>الكوكب</th><th>موضعه النجمي</th><th>البيت</th><th>الحركة</th></tr></thead><tbody>';
    K.forEach(function(k,p){var b=body(r.chart,k);h+='<tr><th>'+N[p]+'</th><td>'+deg(b.lon)+'</td><td>'+b.house+'</td><td>'+(b.retro?'راجع':'مباشر')+'</td></tr>';});var nd=body(r.chart,'node');h+='<tr><th>كيتو</th><td>'+deg(nd.lon+180)+'</td><td>'+((Math.floor(norm(nd.lon+180)/30)-Math.floor(r.chart.asc/30)+12)%12+1)+'</td><td>راجع</td></tr></tbody></table></div><h5>اتصالات تاجيكا ضمن الأورب</h5><div class="vyr-aspects">';
    var aa=r.aspects.filter(function(a){return a.within;});
    aa.forEach(function(a){h+='<article><b>'+N[a.a]+' · '+N[a.b]+'</b><span>'+(a.friendly?'اتصال ودي':'اتصال متوتر')+' · '+a.angle+'°</span><small>الفارق '+a.orb.toFixed(3)+'° من أورب '+a.limit+'° · '+a.status+'</small></article>';});if(!aa.length)h+='<p>لا توجد اتصالات ضمن أورب الكوكب الأسرع.</p>';h+='</div><p class="vad-note">اتصالات تاجيكا تختلف عن درِشتي باراشارا: الثالث/الحادي عشر والخامس/التاسع ودية؛ الأول/السابع والرابع/العاشر متوترة. وصفها تقليدي وليس ضمانًا لحدث. شمس العودة: '+deg(body(r.chart,'sun').lon)+'، والهدف: '+deg(r.target)+'.</p>';
    out.innerHTML=h;out.dataset.returnMs=String(r.returnMs);out.dataset.muntha=String(r.muntha.sign);
   }catch(e){out.innerHTML='<p class="vad-warning"></p>';out.firstChild.textContent=e.message;delete out.dataset.returnMs;}}
  el.querySelector('.vyr-go').addEventListener('click',run);run();return el;
 }
 window.AqVarshaphala={calculate:calculate,createCard:createCard,math:{sunAt:sunAt,root:root,muntha:muntha,tajika:tajika,pancha:pancha,hadda:hadda,punya:punya,officeHolders:officeHolders}};
})();
