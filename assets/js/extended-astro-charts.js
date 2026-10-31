(() => {
  'use strict';
  const SIGNS=['الحمل','الثور','الجوزاء','السرطان','الأسد','العذراء','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'];
  const NAMES={sun:'الشمس',moon:'القمر',mercury:'عطارد',venus:'الزهرة',mars:'المريخ',jupiter:'المشتري',saturn:'زحل',uranus:'أورانوس',neptune:'نبتون',pluto:'بلوتو',truenode:'العقدة الشمالية',node:'العقدة الشمالية',fortune:'سهم السعادة',chiron:'كيرون'};
  const GLYPHS={sun:'☉',moon:'☽',mercury:'☿',venus:'♀',mars:'♂',jupiter:'♃',saturn:'♄',uranus:'♅',neptune:'♆',pluto:'♇',truenode:'☊',node:'☊',fortune:'⊗'};
  const ASPECTS=[{deg:0,k:'conj',name:'اقتران'},{deg:60,k:'sext',name:'تسديس'},{deg:90,k:'sq',name:'تربيع'},{deg:120,k:'tri',name:'تثليث'},{deg:180,k:'opp',name:'مقابلة'}];
  const PERSONAL=new Set(['sun','moon','mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto']);
  const CHART_POINTS=new Set([...PERSONAL,'truenode','node','fortune']);
  const $=(q,r=document)=>r.querySelector(q),norm=x=>((x%360)+360)%360,delta=(a,b)=>((a-b+540)%360)-180;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function fmt(lon){const v=norm(lon),si=Math.floor(v/30);let d=Math.floor(v-si*30),m=Math.round((v-si*30-d)*60);if(m===60){d++;m=0;if(d===30)return '00°00′ '+SIGNS[(si+1)%12];}return String(d).padStart(2,'0')+'°'+String(m).padStart(2,'0')+'′ '+SIGNS[si];}
  const dateStamp=d=>new Date(d).toLocaleString('ar-EG',{dateStyle:'medium',timeStyle:'short'});
  const mapKey=k=>String(k||'').toLowerCase()==='truenode'?'truenode':String(k||'').toLowerCase();
  function chartBodies(ch){return(ch.bodies||[]).filter(b=>CHART_POINTS.has(mapKey(b.key))).map(b=>({...b,key:mapKey(b.key),lon:norm(b.lon)}));}
  function chartAspects(ch,orb=7){
    const bodies=chartBodies(ch).filter(b=>b.key!=='fortune'),out=[];
    for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){
      const a=bodies[i],b=bodies[j],diff=Math.abs(delta(a.lon,b.lon));
      let best=null;for(const asp of ASPECTS){const distance=Math.abs(diff-asp.deg);if(!best||distance<best.orb)best={...asp,orb:distance};}
      const limit=(a.key==='sun'||a.key==='moon'||b.key==='sun'||b.key==='moon')?orb:6;
      if(best&&best.orb<=limit)out.push({...best,a:a.key,b:b.key,angle:diff});
    }
    return out.sort((a,b)=>a.orb-b.orb);
  }
  function aspectLines(list,heading='الاتصالات الرئيسية'){
    const lines=list.map(a=>'<li><strong>'+esc(NAMES[a.transit||a.a]||a.transit||a.a)+' '+esc(a.name||a.asp?.name||'')+' '+esc(NAMES[a.natal||a.b]||a.natal||a.b)+'</strong><span>الزاوية '+Number(a.angle||0).toFixed(1)+'° · الأورب '+Number(a.orb||0).toFixed(2)+'°</span></li>').join('');
    return '<section class="eam-card"><h4>'+heading+'</h4><ul class="eam-aspects">'+(lines||'<li>لا توجد اتصالات رئيسية ضمن الأورب المحدد.</li>')+'</ul></section>';
  }
  function planetRows(ch){
    return chartBodies(ch).map(b=>'<tr><th>'+esc(GLYPHS[b.key]||'')+' '+esc(NAMES[b.key]||b.key)+'</th><td>'+esc(fmt(b.lon))+'</td><td>'+(ch.known&&Number.isInteger(b.house)?'البيت '+b.house:'غير محدد')+'</td><td>'+(b.retro?'راجع ℞':'مباشر')+'</td></tr>').join('');
  }
  function chartTable(ch){return '<div class="eam-table-wrap"><table class="eam-table"><thead><tr><th>الكوكب</th><th>البرج والدرجة</th><th>البيت</th><th>الحركة</th></tr></thead><tbody>'+planetRows(ch)+'</tbody></table></div>';}
  function chartSummary(ch){
    const angles=ch.known?'<p class="eam-angles"><span>الطالع <b>'+esc(fmt(ch.asc))+'</b></span><span>وسط السماء <b>'+esc(fmt(ch.mc))+'</b></span></p>':'<p class="eam-note">وقت الميلاد غير متاح؛ لا يمكن إظهار الطالع والبيوت بدقة.</p>';
    return angles;
  }
  function mountCopy(host,title){
    if(!host)return;
    host.querySelector('.aq-copy-map-btn')?.remove();
  }
  window.AqeeqCopyMap={attach:mountCopy};

  const attachTransitCopy=()=>{const host=$('#aqeek-personal-transits');if(host){window.AqeeqGender?.apply(host,context()?.gender);if(!host.querySelector('.aq-copy-map-btn')&&host.querySelector('.aqt-shell'))mountCopy(host,'خريطة العبور الشخصي');}};
  attachTransitCopy();new MutationObserver(attachTransitCopy).observe(document.documentElement,{childList:true,subtree:true});
  const section=$('#astro-maps'),content=$('#eam-content');
  if(!section||!content)return;
  let mode='transit';
  const nowLocal=()=>{const d=new Date(),local=new Date(d.getTime()-d.getTimezoneOffset()*60000);return local.toISOString().slice(0,16);};
  function context(){return window.AqeeqChartContext?.getNatal?.()||null;}
  function readyMessage(){return '<div class="eam-empty"><span>✦</span><h3>ابدأ بخريطة الميلاد</h3><p>احسب خريطتك أولاً، ثم ارجع هنا لإنشاء خريطة العبور أو العودة الشمسية أو العرض الفيدي.</p><a class="btn ghost sm" href="#chart">اذهب إلى خريطة الميلاد</a></div>';}
  function setMode(next){
    mode=next;
    section.querySelectorAll('[data-eam-mode]').forEach(b=>{const active=b.dataset.eamMode===mode;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
    renderControls();
  }
  function renderControls(){
    const ctx=context();
    if(!ctx){content.innerHTML=readyMessage();return;}
    const titles={transit:'خريطة العبور الحالية',solar:'العودة الشمسية',profections:'التوجيهات السنوية · Annual Profections',eclipses:'خريطة الكسوف والخسوف',nodes:'العقد القمرية والعودة العقدية',sidereal:'الخريطة الفيدية · Lahiri'};
    const descriptions={transit:'قارن مواقع الكواكب الآن بخريطة ميلادك، مع تحديد بيت الميلاد الذي ينشطه كل كوكب.',solar:'لحظة عودة الشمس إلى درجتها الأصلية وخريطة السنة الشخصية الجديدة.',profections:'البرج السنوي وسيد السنة وفق نظام التوجيهات السنوية التقليدي والبيوت الكاملة.',eclipses:'أحداث الكسوف والخسوف العالمية خلال السنة، وموقعها داخل بيوت خريطة الميلاد.',nodes:'موضع العقدتين في الميلاد والعبور، ومواعيد عودة العقدة الشمالية التقريبية.',sidereal:'تُحسب الخريطة باستخدام وقت ومكان الميلاد المسجلين في خريطتك.'};
    const title=titles[mode]||titles.sidereal,description=descriptions[mode]||descriptions.sidereal;
    const yearOptions=()=>Array.from({length:8},(_,i)=>new Date().getFullYear()+i).map(y=>'<option value="'+y+'" '+(y===new Date().getFullYear()?'selected':'')+'>'+y+'</option>').join('');
    let controls='';
    if(mode==='transit')controls='<label class="field"><span>تاريخ ووقت العبور · بتوقيت جهازك</span><input id="eam-date" type="datetime-local" value="'+nowLocal()+'"></label><button type="button" class="btn ghost sm" id="eam-now">الآن</button>';
    else if(mode==='solar')controls='<label class="field"><span>سنة العودة الشمسية</span><select id="eam-year">'+yearOptions()+'</select></label>';
    else if(mode==='profections')controls='<label class="field"><span>التاريخ السنوي</span><input id="eam-date" type="date" value="'+new Date().toISOString().slice(0,10)+'"></label>';
    else if(mode==='eclipses')controls='<label class="field"><span>السنة</span><select id="eam-year">'+yearOptions()+'</select></label>';
    else if(mode==='nodes')controls='<label class="field"><span>تاريخ قراءة العقد</span><input id="eam-date" type="date" value="'+new Date().toISOString().slice(0,10)+'"></label>';
    else controls='<p class="eam-method">النطاق النجمي محسوب بطريقة Lahiri المتوسطة؛ تُطرح قيمة الأيانامشا من المواقع الاستوائية وتُزاح معها رؤوس البيوت.</p>';
    const labels={transit:'احسب العبور',solar:'احسب العودة الشمسية',profections:'احسب سيد السنة',eclipses:'اعرض الكسوف والخسوف',nodes:'احسب محور العقد',sidereal:'اعرض الخريطة الفيدية'};
    content.innerHTML='<div class="eam-control"><div><span class="eam-kicker">'+esc(title)+'</span><p>'+esc(description)+'</p></div><div class="eam-controls">'+controls+'<button class="btn" type="button" id="eam-calculate">'+labels[mode]+'</button></div></div><p class="eam-status" id="eam-status" role="status" aria-live="polite"></p><div id="eam-result" class="eam-result" hidden></div>';
    $('#eam-now',content)?.addEventListener('click',()=>$('#eam-date',content).value=nowLocal());
    $('#eam-calculate',content)?.addEventListener('click',calculate);
  }
  function mapAspects(aspects){
    const kinds={conjunction:'conj',sextile:'sext',square:'sq',trine:'tri',opposition:'opp'};return aspects.map(a=>({a:mapKey(a.natal.key),b:mapKey(a.transit.key),asp:{k:kinds[a.key]||a.key,name:a.name},name:a.name,orb:a.orb,angle:Math.abs(delta(a.transit.lon,a.natal.lon))}));
  }
  function engineChart(utcMs,natal){
    return Astro.chart({utcMs,lat:natal.ch.lat,lon:natal.ch.lon,hs:['placidus','whole','equal','porphyry'].includes(natal.ch.hs)?natal.ch.hs:'placidus',known:!!natal.ch.known});
  }
  function natalHouseFor(longitude,natal){
    const cusps=natal?.ch?.cusps;
    if(!Array.isArray(cusps)||cusps.length!==12)return null;
    const lon=norm(longitude);
    for(let i=0;i<12;i++){
      const start=norm(cusps[i]),end=norm(cusps[(i+1)%12]);
      const span=norm(end-start),offset=norm(lon-start);
      if(offset<span||span===0&&offset===0)return i+1;
    }
    return null;
  }
  function transitHouseTable(ch,natal){
    const rows=chartBodies(ch).map(b=>{const house=natalHouseFor(b.lon,natal);return '<tr><th>'+esc(GLYPHS[b.key]||'')+' '+esc(NAMES[b.key]||b.key)+'</th><td>'+esc(fmt(b.lon))+'</td><td>'+(house?'البيت '+house:'غير متاح')+'</td><td>'+(b.retro?'راجع ℞':'مباشر')+'</td></tr>';}).join('');
    return '<section class="eam-card"><h4>مواقع العبور داخل بيوت الميلاد</h4><p class="eam-note">'+(natal.ch.known?'توزيع الكواكب العابرة على رؤوس البيوت الأصلية لخريطة الميلاد.':'وقت الميلاد غير متاح؛ تعرض المواقع دون تعيين البيوت.')+'</p><div class="eam-table-wrap"><table class="eam-table"><thead><tr><th>الكوكب</th><th>موضع العبور</th><th>بيت الميلاد</th><th>الحركة</th></tr></thead><tbody>'+rows+'</tbody></table></div></section>';
  }
  const HOUSE_AREAS=['الهوية والبدايات','الموارد والقيم','التعلم والتواصل','المنزل والجذور','الإبداع والمتعة','العمل اليومي والصحة','الشراكات والعقود','المشاركة والتحول','المعرفة والسفر البعيد','المهنة والسمعة','الأصدقاء والمشروعات','الراحة والخلوة'];
  const SIGN_RULERS=['المريخ','الزهرة','عطارد','القمر','الشمس','عطارد','الزهرة','المريخ','المشتري','زحل','زحل','المشتري'];
  function renderProfections(result,natal,value){
    if(!natal.ch.known||!Number.isFinite(natal.ch.asc)){throw new Error('تحتاج التوجيهات السنوية إلى وقت ميلاد ومكانه لحساب الطالع والبيوت.');}
    const target=value?new Date(value+'T12:00:00'):new Date(),birth=new Date(natal.utcMs);
    let age=target.getFullYear()-natal.y;
    if(target.getMonth()+1<natal.m||(target.getMonth()+1===natal.m&&target.getDate()<natal.d))age--;
    if(age<0)throw new Error('اختر تاريخاً يوافق يوم الميلاد أو يأتي بعده.');
    const house=age%12+1,ascSign=Math.floor(norm(natal.ch.asc)/30),sign=(ascSign+house-1)%12,lord=SIGN_RULERS[sign];
    const inner='<section class="eam-pillar-grid"><article class="eam-pillar"><span>العمر السنوي</span><strong>'+age+'</strong><small>السنة '+(age+1)+' من دورة الميلاد</small></article><article class="eam-pillar"><span>البيت المفعّل</span><strong>'+house+'</strong><small>'+esc(HOUSE_AREAS[house-1])+'</small></article><article class="eam-pillar"><span>البرج السنوي</span><strong>'+esc(SIGNS[sign])+'</strong><small>من طالع الميلاد</small></article><article class="eam-pillar"><span>سيد السنة · Time Lord</span><strong>'+esc(lord)+'</strong><small>الحاكم التقليدي للبرج</small></article></section>';
    result.hidden=false;result.innerHTML='<header class="eam-result-head"><span class="eam-kicker">Annual Profections · '+esc(target.toLocaleDateString('ar-EG'))+'</span><h3>التوجيه السنوي: البيت '+house+' في '+esc(SIGNS[sign])+'</h3><p class="eam-note">طريقة البيوت الكاملة: تنتقل سنة التوجيه عند عيد الميلاد، ويكون حاكم البرج المفعّل سيد السنة.</p></header>'+inner+'<section class="eam-card"><h4>قراءة إرشادية</h4><p class="eam-prose">يضع هذا العام موضوع <b>'+esc(HOUSE_AREAS[house-1])+'</b> في مقدمة الاهتمام، ويشير <b>'+esc(lord)+'</b> إلى الكوكب الذي يُتابع في الخريطة والعبور لفهم توقيتات السنة. هذه دلالة رمزية عامة وليست تنبؤاً حتمياً.</p></section>';
    result.querySelector('.eam-result-head').insertAdjacentHTML('afterend','<div class="eam-wheel" id="eam-wheel"></div>');window.AqeeqAstroWheel?.renderChartWheel($('#eam-wheel',result),natal.ch,[],'Annual Profections',{highlightHouse:house});window.AqeeqGender?.apply(result,natal.gender);mountCopy(result,'التوجيهات السنوية · سيد السنة '+lord);
  }
  function eclipseKindText(engine,kind,type){
    const table=type==='solar'?{1:'جزئي',2:'حلقي',3:'كلي'}:{0:'شبه ظلي',1:'جزئي',3:'كلي'};
    const label=engine?.EclipseKind?.[kind]||String(kind);
    if(/partial/i.test(label))return 'جزئي';if(/annular/i.test(label))return 'حلقي';if(/total/i.test(label))return 'كلي';if(/penumbral/i.test(label))return 'شبه ظلي';
    return table[Number(kind)]||label;
  }
  function eclipseEvents(year,engine,type){
    const start=new Date(Date.UTC(year,0,1)),end=Date.UTC(year+1,0,1);
    const search=type==='solar'?engine.SearchGlobalSolarEclipse:engine.SearchLunarEclipse;
    const next=type==='solar'?engine.NextGlobalSolarEclipse:engine.NextLunarEclipse;
    if(typeof search!=='function'||typeof next!=='function')throw new Error('دوال الكسوف والخسوف غير متاحة في نسخة Astronomy Engine المحملة.');
    let event=search(start),out=[],guard=0;
    while(event&&event.peak?.date&&event.peak.date.getTime()<end&&guard++<10){
      if(event.peak.date.getTime()>=start.getTime())out.push(event);
      const following=next(event.peak);
      if(!following?.peak?.date||following.peak.date<=event.peak.date)break;
      event=following;
    }
    return out;
  }
  function renderEclipses(result,natal,year){
    const engine=typeof Astronomy!=='undefined'?Astronomy:(window.Astronomy||globalThis.Astronomy);
    if(!engine)throw new Error('مكتبة Astronomy Engine غير محملة.');
    const items=[...eclipseEvents(year,engine,'solar').map(e=>({e,type:'solar'})),...eclipseEvents(year,engine,'lunar').map(e=>({e,type:'lunar'}))].sort((a,b)=>a.e.peak.date-b.e.peak.date);
    if(!items.length)throw new Error('لم تُعثر على أحداث كسوف أو خسوف لهذه السنة.');
    const rows=items.map(({e,type})=>{
      const date=e.peak.date,chart=engineChart(date.getTime(),natal),body=chart.bodies.find(b=>b.key===(type==='solar'?'sun':'moon'));
      const house=body?natalHouseFor(body.lon,natal):null,kind=eclipseKindText(engine,e.kind,type),name=type==='solar'?'كسوف شمسي':'خسوف قمري';
      return '<article class="eam-event"><div><span class="eam-event-date">'+esc(date.toLocaleDateString('ar-EG',{dateStyle:'medium',timeZone:'UTC'}))+'</span><h4>'+name+' · '+kind+'</h4></div><div><b>'+esc(body?fmt(body.lon):'الموضع غير متاح')+'</b><span>بيت الميلاد: '+(house?'البيت '+house+' · '+esc(HOUSE_AREAS[house-1]):'غير متاح لغياب وقت ميلاد دقيق')+'</span></div></article>';
    }).join('');
    result.hidden=false;result.innerHTML='<header class="eam-result-head"><span class="eam-kicker">Eclipses · '+year+'</span><h3>الكسوف والخسوف في بيوت الميلاد</h3><p class="eam-note">الأحداث عالمية من Astronomy Engine؛ البيت محسوب من موضع الشمس أو القمر عند الذروة مع رؤوس بيوت ميلادك. هذا لا يحدد الرؤية المحلية.</p></header><div class="eam-event-list">'+rows+'</div>';
    {const markers=items.map(({e,type})=>{const ch=engineChart(e.peak.date.getTime(),natal),b=ch.bodies.find(x=>x.key===(type==='solar'?'sun':'moon'));return b?{lon:b.lon,glyph:type==='solar'?'☉':'☽',title:(type==='solar'?'كسوف شمسي ':'خسوف قمري ')+e.peak.date.toLocaleDateString('ar-EG',{dateStyle:'medium',timeZone:'UTC'})}:null;}).filter(Boolean);result.querySelector('.eam-result-head').insertAdjacentHTML('afterend','<div class="eam-wheel" id="eam-wheel"></div>');window.AqeeqAstroWheel?.renderChartWheel($('#eam-wheel',result),natal.ch,[],'Eclipses '+year,{markers,markerLegend:'مواضع الكسوف والخسوف'});}window.AqeeqGender?.apply(result,natal.gender);mountCopy(result,'الكسوف والخسوف · '+year);
  }
  function nodeLonAt(ms,natal){const jd=Astro.jdFromMs(ms),jde=jd+Astro.deltaT(Astro.yearOf(jd))/86400;return norm(Astro.lonOf('truenode',jde));}
  function findNodalReturn(natal,k,natalNode){
    const target=natal.utcMs+k*6798.383*86400000,step=3*86400000,span=100*86400000;
    let prevMs=target-span,prev=Astro.d180(nodeLonAt(prevMs,natal)-natalNode),bracket=null;
    for(let ms=prevMs+step;ms<=target+span;ms+=step){
      const val=Astro.d180(nodeLonAt(ms,natal)-natalNode);
      if(prev===0||val===0||prev*val<0){bracket=[ms-step,ms];break;}
      prev=val;
    }
    if(!bracket)return new Date(target);
    let [lo,hi]=bracket,fl=Astro.d180(nodeLonAt(lo,natal)-natalNode);
    for(let i=0;i<38;i++){const mid=(lo+hi)/2,fm=Astro.d180(nodeLonAt(mid,natal)-natalNode);if(fl*fm<=0)hi=mid;else{lo=mid;fl=fm;}}
    return new Date((lo+hi)/2);
  }
  function renderNodes(result,natal,value){
    const date=value?new Date(value+'T12:00:00'):new Date(),ch=engineChart(date.getTime(),natal);
    const north=ch.bodies.find(b=>b.key==='truenode'||b.key==='node'),south=north?norm(north.lon+180):null;
    if(!north||!Number.isFinite(natal.utcMs))throw new Error('بيانات العقد القمرية غير مكتملة.');
    const natalNorth=natal.ch.bodies.find(b=>mapKey(b.key)==='truenode'||mapKey(b.key)==='node');
    if(!natalNorth)throw new Error('موضع العقدة الشمالية في خريطة الميلاد غير متاح.');
    const nHouse=natalHouseFor(north.lon,natal),sHouse=natalHouseFor(south,natal),birthNode=norm(natalNorth.lon);
    const elapsed=(date.getTime()-natal.utcMs)/86400000,k=Math.max(1,Math.floor(elapsed/6798.383)+1);
    const returns=[k,k+1].map(i=>findNodalReturn(natal,i,birthNode));
    const fmtHouse=(h)=>h?'البيت '+h+' · '+HOUSE_AREAS[h-1]:'البيوت غير متاحة دون وقت ميلاد دقيق';
    result.hidden=false;result.innerHTML='<header class="eam-result-head"><span class="eam-kicker">Lunar Nodes · Nodal Return</span><h3>محور العقدة الشمالية والجنوبية</h3><p class="eam-note">العقدة الجنوبية مقابلة للشمالية تماماً؛ عودة العقدة تحدث تقريباً كل 18.6 سنة.</p></header><section class="eam-pillar-grid"><article class="eam-pillar"><span>العقدة الشمالية ☊ · عبور</span><strong>'+esc(fmt(north.lon))+'</strong><small>'+esc(fmtHouse(nHouse))+'</small></article><article class="eam-pillar"><span>العقدة الجنوبية ☋ · عبور</span><strong>'+esc(fmt(south))+'</strong><small>'+esc(fmtHouse(sHouse))+'</small></article><article class="eam-pillar"><span>العقدة الشمالية · الميلاد</span><strong>'+esc(fmt(birthNode))+'</strong><small>'+esc(fmtHouse(natalHouseFor(birthNode,natal)))+'</small></article></section><section class="eam-card"><h4>محطات عودة العقدة الشمالية التقريبية</h4><div class="eam-event-list">'+returns.map((d,i)=>'<article class="eam-event"><div><span class="eam-event-date">العودة '+(k+i)+'</span><h4>'+esc(d.toLocaleDateString('ar-EG',{dateStyle:'long'}))+'</h4></div><div><b>توافق محور العقد</b><span>توقيت تقريبي يحسب من حركة العقدة في المحرك.</span></div></article>').join('')+'</div><p class="eam-note">قراءة رمزية لمحور العقد لا تمثل حكماً علمياً على الشخصية أو المصير.</p></section>';
    result.querySelector('.eam-result-head').insertAdjacentHTML('afterend','<div class="eam-wheel" id="eam-wheel"></div>');window.AqeeqAstroWheel?.renderChartWheel($('#eam-wheel',result),natal.ch,[],'Lunar Nodes',{markers:[{lon:north.lon,glyph:'☊',title:'العقدة الشمالية (عبور)'},{lon:south,glyph:'☋',title:'العقدة الجنوبية (عبور)'}],markerLegend:'محور العقد الحالي'});window.AqeeqGender?.apply(result,natal.gender);mountCopy(result,'محور العقد القمرية والعودة العقدية');
  }
  function currentTransit(natal,date){
    const nat=chartBodies(natal.ch).map(b=>({key:b.key[0].toUpperCase()+b.key.slice(1),lon:b.lon,speed:b.speed||0,retro:b.retro}));
    const trans=window.AqeqPersonalTransits?.calculateTransits(nat,date,{lat:natal.ch.lat,lon:natal.ch.lon});
    if(!trans)throw new Error('محرك الترانزيت غير متاح حالياً.');
    return {chart:engineChart(date.getTime(),natal),aspects:mapAspects(trans.aspects),data:trans};
  }
  function solarReturnUtc(natal,year){
    const birthSun=natal.ch.bodies.find(b=>mapKey(b.key)==='sun')?.lon;
    if(!Number.isFinite(birthSun))throw new Error('موضع شمس الميلاد غير متاح.');
    const guess=Date.UTC(year,natal.m-1,natal.d,12),span=8*86400000;
    const lonAt=ms=>{const jd=Astro.jdFromMs(ms),jde=jd+Astro.deltaT(Astro.yearOf(jd))/86400;return Astro.lonOf('sun',jde);};
    const f=ms=>Astro.d180(lonAt(ms)-birthSun);
    let lo=guess-span,hi=guess+span,fl=f(lo),fh=f(hi);
    if(fl===0)return lo;if(fh===0)return hi;
    if(fl*fh>0)throw new Error('تعذر تحديد لحظة العودة الشمسية لهذه السنة.');
    for(let i=0;i<48;i++){const mid=(lo+hi)/2,fm=f(mid);if(Math.abs(fm)<1e-8)return mid;if(fl*fm<=0){hi=mid;fh=fm;}else{lo=mid;fl=fm;}}
    return (lo+hi)/2;
  }
  function ayanamsa(jde){
    const T=(jde-2415020)/36525;
    return (22*3600+27*60+37.65+5025.75*T+1.11*T*T)/3600;
  }
  function siderealChart(natal){
    const offset=ayanamsa(natal.ch.jde),ch={...natal.ch,ayanamsa:offset,sidereal:true};
    ch.bodies=natal.ch.bodies.map(b=>({...b,lon:norm(b.lon-offset),sign:Math.floor(norm(b.lon-offset)/30)}));
    if(ch.known){ch.asc=norm(ch.asc-offset);ch.mc=norm(ch.mc-offset);ch.cusps=ch.cusps.map(x=>norm(x-offset));}
    return ch;
  }
  function renderChart(result,title,subtitle,ch,extraHTML='',aspects=[]){
    result.hidden=false;result.innerHTML='<header class="eam-result-head"><span class="eam-kicker">'+esc(title)+'</span><h3>'+esc(subtitle)+'</h3>'+chartSummary(ch)+'</header><div class="eam-wheel" id="eam-wheel"></div>'+chartTable(ch)+extraHTML+aspectLines(aspects);
    window.AqeeqAstroWheel?.renderChartWheel($('#eam-wheel',result),ch,aspects,title);
    window.AqeeqGender?.apply(result,context()?.gender);
    mountCopy(result,title);
  }
  async function calculate(){
    const natal=context(),status=$('#eam-status',content),button=$('#eam-calculate',content),result=$('#eam-result',content);
    if(!natal){renderControls();return;}
    status.textContent='جارٍ حساب الخريطة…';button.disabled=true;button.setAttribute('aria-busy','true');await new Promise(r=>setTimeout(r,20));
    try{
      if(mode==='transit'){
        const value=$('#eam-date',content).value,date=value?new Date(value):new Date();if(Number.isNaN(date.getTime()))throw new Error('تاريخ ووقت العبور غير صالحين.');
        const t=currentTransit(natal,date),lines=t.aspects;
        result.hidden=false;result.innerHTML='<header class="eam-result-head"><span class="eam-kicker">Transit Chart · '+esc(dateStamp(date))+'</span><h3>العبور فوق خريطة الميلاد</h3><p class="eam-note">الحلقة الخارجية لمواضع العبور، والداخلية لمواضع الميلاد.</p></header><div class="eam-wheel" id="eam-wheel"></div>'+transitHouseTable(t.chart,natal)+aspectLines(lines,'اتصالات العبور بخريطة الميلاد');
        window.AqeeqAstroWheel?.renderSynastryWheel($('#eam-wheel',result),natal.ch,t.chart,t.aspects);
        window.AqeeqGender?.apply(result,natal.gender);
        mountCopy(result,'خريطة العبور · '+dateStamp(date));
      }else if(mode==='solar'){
        const year=Number($('#eam-year',content).value),utc=solarReturnUtc(natal,year),ch=engineChart(utc,natal),aspects=chartAspects(ch);
        renderChart(result,'Solar Return · '+year,'العودة الشمسية للحظات عودة الشمس إلى موضع الميلاد',ch,'<p class="eam-note">لحظة العودة: '+esc(new Date(utc).toISOString().replace('T',' ').replace('Z',' UTC'))+'. البيوت محسوبة لمكان الميلاد المسجل.</p>',aspects);
      }else if(mode==='profections'){
        renderProfections(result,natal,$('#eam-date',content).value);
      }else if(mode==='eclipses'){
        renderEclipses(result,natal,Number($('#eam-year',content).value));
      }else if(mode==='nodes'){
        renderNodes(result,natal,$('#eam-date',content).value);
      }else{
        const ch=siderealChart(natal),aspects=chartAspects(ch);
        renderChart(result,'Sidereal · Lahiri','الخريطة الفيدية بالنطاق النجمي',ch,'<p class="eam-note">أيانامشا Lahiri المتوسط: '+ch.ayanamsa.toFixed(4)+'°. قد تختلف قيم الأيانامشا والتقاليد الفيدية الأخرى، وهذه الأداة لا تحسب الداشا أو النكشاترا.</p>',aspects);
      }
      status.textContent='اكتمل الحساب. يمكنك نسخ تفاصيل الخريطة من الزر أسفل النتيجة.';
    }catch(error){status.textContent=error?.message||'تعذر حساب الخريطة؛ راجع البيانات وحاول مرة أخرى.';result.hidden=true;}
    finally{button.disabled=false;button.removeAttribute('aria-busy');}
  }
  section.querySelectorAll('[data-eam-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.eamMode)));
  section.querySelector('.eam-tabs')?.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();const buttons=[...section.querySelectorAll('[data-eam-mode]')],current=buttons.indexOf(event.target.closest('[data-eam-mode]'));const step=event.key==='ArrowLeft'?1:-1;buttons[(current+step+buttons.length)%buttons.length].click();buttons[(current+step+buttons.length)%buttons.length].focus();});
  document.addEventListener('aqeeq:natal-ready',renderControls);
  renderControls();
})();