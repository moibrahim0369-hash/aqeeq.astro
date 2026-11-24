/* assets/js/astro-wheel.js */
(() => {
  'use strict';
  const NS='http://www.w3.org/2000/svg', SIGNS=['الحمل','الثور','الجوزاء','السرطان','الأسد','العذراء','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'], GLYPHS=['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  const PLANETS={sun:['الشمس','☉'],moon:['القمر','☽'],mercury:['عطارد','☿'],venus:['الزهرة','♀'],mars:['المريخ','♂'],jupiter:['المشتري','♃'],saturn:['زحل','♄'],uranus:['أورانوس','♅'],neptune:['نبتون','♆'],pluto:['بلوتو','♇'],truenode:['العقدة الشمالية','☊'],node:['العقدة الشمالية','☊'],fortune:['سهم السعادة','⊗']}, PERSONAL=['sun','moon','mercury','venus','mars'];
  const el=(tag,attrs={},text='')=>{const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v)));if(text)n.textContent=text;return n;};
  const norm=x=>((x%360)+360)%360, pt=(lon,r,c=260)=>{const a=(180+norm(lon))*Math.PI/180;return[c+r*Math.cos(a),c-r*Math.sin(a)];};
  const position=lon=>{const x=norm(lon),d=Math.floor(x%30),m=Math.round((x%1)*60);return String(m===60?(d+1)%30:d).padStart(2,'0')+'°'+String(m===60?0:m).padStart(2,'0')+'′';};
  function baseSvg(title,description){
    const svg=el('svg',{viewBox:'0 0 520 520',role:'img','aria-label':title,class:'aq-wheel-svg'});
    svg.append(el('title',{},title),el('desc',{},description));return svg;
  }
  function drawFramework(svg,cusps=null){
    const cx=260,outer=244,ringOuter=232,ringInner=205,houseR=201,center=62;
    svg.append(el('circle',{cx,cy:cx,r:outer,class:'aq-wheel-border'}),el('circle',{cx,cy:cx,r:ringOuter,class:'aq-wheel-border'}),el('circle',{cx,cy:cx,r:ringInner,class:'aq-wheel-border'}));
    for(let i=0;i<12;i++){
      const a=i*30,b=(i+1)*30,[ox,oy]=pt(a,ringOuter),[ex,ey]=pt(b,ringOuter),[ix,iy]=pt(b,ringInner),[sx,sy]=pt(a,ringInner),[gx,gy]=pt(a+15,218);
      const wedge=el('path',{d:`M${ox} ${oy} A${ringOuter} ${ringOuter} 0 0 0 ${ex} ${ey} L${ix} ${iy} A${ringInner} ${ringInner} 0 0 1 ${sx} ${sy} Z`,class:'aq-wheel-zodiac zodiac-'+i});
      wedge.append(el('title',{},SIGNS[i]));svg.append(wedge);
      const [x1,y1]=pt(a,ringInner),[x2,y2]=pt(a,houseR);svg.append(el('line',{x1,y1,x2,y2,class:'aq-wheel-sign-line'}),el('text',{x:gx,y:gy,class:'aq-wheel-sign'},GLYPHS[i]));
    }
    if(Array.isArray(cusps)&&cusps.length===12){
      cusps.forEach((lon,i)=>{const [x1,y1]=pt(lon,houseR),[x2,y2]=pt(lon,center+5);svg.append(el('line',{x1,y1,x2,y2,class:i%3===0?'aq-wheel-house aq-wheel-angle':'aq-wheel-house'}));const next=cusps[(i+1)%12],mid=norm(lon+norm(next-lon)/2),[tx,ty]=pt(mid,105);svg.append(el('text',{x:tx,y:ty,class:'aq-wheel-house-number'},String(i+1)));});
    }else for(let i=0;i<12;i++){const [x1,y1]=pt(i*30,houseR),[x2,y2]=pt(i*30,center+5);svg.append(el('line',{x1,y1,x2,y2,class:'aq-wheel-house'}));}
    return{outer,center};
  }
  function houseAt(ch,lon){
    if(!ch?.known||!Array.isArray(ch.cusps))return null;
    const x=norm(lon);
    for(let i=0;i<12;i++){const start=norm(ch.cusps[i]),span=norm(ch.cusps[(i+1)%12]-start),offset=norm(x-start);if(offset<span||Math.abs(offset-span)<1e-8)return i+1;}
    return null;
  }
  function legend(host,items,note){
    const row=document.createElement('div');row.className='aq-wheel-legend';
    items.forEach(([tone,label])=>{const item=document.createElement('span'),dot=document.createElement('i');dot.className=tone;item.append(dot,document.createTextNode(label));row.append(item);});
    host.append(row);const p=document.createElement('p');p.className='aq-wheel-note';p.textContent=note;host.append(p);
  }
  function renderSynastryWheel(host,chartA,chartB,aspects=[],names={}){
    if(!host||!chartA||!chartB)return;
    const svg=baseSvg('عجلة التوافق الثنائية','الأبراج والبيوت في الحلقة الخارجية، الشخص الأول بالذهب والشخص الثاني بالعقيق، والاتصالات الرئيسية في المركز.');
    const {outer,center}=drawFramework(svg,chartA.known?chartA.cusps:null), find=(ch,k)=>ch.bodies?.find(x=>x.key===k), anchors={};
    const selected=aspects.filter(x=>PERSONAL.includes(x.a)&&PERSONAL.includes(x.b)).sort((a,b)=>a.orb-b.orb).slice(0,8);
    selected.forEach((a,i)=>{const x=find(chartA,a.a),y=find(chartB,a.b);if(!x||!y)return;anchors['a:'+a.a]=pt(x.lon,174);anchors['b:'+a.b]=pt(y.lon,128);const [x1,y1]=anchors['a:'+a.a],[x2,y2]=anchors['b:'+a.b],kind=a.asp?.k||'';
      svg.append(el('line',{x1,y1,x2,y2,class:'aq-wheel-aspect '+(['tri','sext'].includes(kind)?'harmonious':['sq','opp'].includes(kind)?'challenging':'neutral'),opacity:Math.max(.24,.66-(a.orb||0)*.035)}));
    });
    const add=(ch,r,cls)=>PERSONAL.forEach(key=>{const b=find(ch,key);if(!b)return;const [x,y]=pt(b.lon,r),[tx,ty]=pt(b.lon,r+15),info=PLANETS[key],h=houseAt(chartA,b.lon),s=SIGNS[Math.floor(norm(b.lon)/30)],group=el('g',{class:'aq-wheel-planet '+cls,tabindex:'0',role:'img','aria-label':info[0]+'، '+s+' '+position(b.lon)+(h?'، بيت الشخص الأول '+h:'')});group.append(el('circle',{cx:x,cy:y,r:12,class:'aq-wheel-planet-dot'}),el('text',{x,y:y+4,class:'aq-wheel-planet-glyph'},info[1]),el('text',{x:tx,y:ty,class:'aq-wheel-degree'},position(b.lon)),el('title',{},info[0]+' · '+s+' '+position(b.lon)+(h?' · بيت الشخص الأول '+h:'')));svg.append(group);});
    add(chartA,174,'person-a');add(chartB,128,'person-b');
    svg.append(el('circle',{cx:260,cy:260,r:center,class:'aq-wheel-center'}),...(()=>{const full=t=>String(t||'').trim(),na=full(names.a)||'الطرف الأول',nb=full(names.b)||'الطرف الثاني',maxW=Math.round(center*1.7),fit=t=>t.length>8?{textLength:Math.min(maxW,t.length*11),lengthAdjust:'spacingAndGlyphs'}:{};return[el('text',Object.assign({x:260,y:243,class:'aq-wheel-hub-name hub-a'},fit(na)),na),el('text',{x:260,y:262,class:'aq-wheel-hub-amp'},'وَ'),el('text',Object.assign({x:260,y:282,class:'aq-wheel-hub-name hub-b'},fit(nb)),nb)];})());
    if(chartA.known&&Number.isFinite(chartA.asc)){const [x,y]=pt(chartA.asc,outer-7);svg.append(el('text',{x,y,class:'aq-wheel-angle-label'},'ASC'));}
    if(chartA.known&&Number.isFinite(chartA.mc)){const [x,y]=pt(chartA.mc,outer-24);svg.append(el('text',{x,y,class:'aq-wheel-angle-label'},'MC'));}
    host.replaceChildren(svg);
    legend(host,[['a','الطرف الأول · بورجوندي'],['b','الطرف الثاني · ذهبي برونزي'],['h','اتصال منسجم · ذهبي'],['c','اتصال ضاغط · قرمزي']],chartA.known?'البيوت الظاهرة تخص خريطة الشخص الأول؛ درجات الكواكب تظهر عند المرور أو التركيز عليها.':'وقت ميلاد الشخص الأول غير معروف، لذلك تقسيم البيوت إرشادي فقط.');
  }
  function renderCompositeWheel(host,composite){
    if(!host||!composite)return;
    const cusps=composite.cusps||null,svg=baseSvg('عجلة الخريطة المركّبة','مواقع الكواكب الشخصية واتصالاتها داخل الخريطة المركّبة، مع الأبراج والبيوت عند توفر وقت الميلاد.');
    const {outer,center}=drawFramework(svg,cusps),positions=new Map((composite.positions||[]).map(x=>[x.key,x])),major=(composite.aspects||[]).filter(x=>PERSONAL.includes(x.a)&&PERSONAL.includes(x.b)).sort((a,b)=>a.orb-b.orb).slice(0,6);
    major.forEach(a=>{const x=positions.get(a.a),y=positions.get(a.b);if(!x||!y)return;const [x1,y1]=pt(x.lon,72),[x2,y2]=pt(y.lon,72),k=a.asp?.k||'';svg.append(el('line',{x1,y1,x2,y2,class:'aq-wheel-aspect '+(['tri','sext'].includes(k)?'harmonious':['sq','opp'].includes(k)?'challenging':'neutral'),opacity:.54}));});
    PERSONAL.forEach(key=>{const b=positions.get(key);if(!b)return;const [x,y]=pt(b.lon,146),[tx,ty]=pt(b.lon,166),info=PLANETS[key],s=SIGNS[Math.floor(norm(b.lon)/30)],group=el('g',{class:'aq-wheel-planet person-composite',tabindex:'0',role:'img','aria-label':info[0]+'، '+s+' '+position(b.lon)});group.append(el('circle',{cx:x,cy:y,r:12,class:'aq-wheel-planet-dot'}),el('text',{x,y:y+4,class:'aq-wheel-planet-glyph'},info[1]),el('text',{x:tx,y:ty,class:'aq-wheel-degree'},position(b.lon)),el('title',{},info[0]+' · '+s+' '+position(b.lon)));svg.append(group);});
    svg.append(el('circle',{cx:260,cy:260,r:center,class:'aq-wheel-center'}),el('text',{x:260,y:255,class:'aq-wheel-center-title'},'الخريطة المركّبة'),el('text',{x:260,y:274,class:'aq-wheel-center-sub'},'نقطة التقاء الطرفين'));
    if(composite.anglesKnown&&Number.isFinite(composite.asc)){const [x,y]=pt(composite.asc,outer-7);svg.append(el('text',{x,y,class:'aq-wheel-angle-label'},'ASC'));}
    if(composite.anglesKnown&&Number.isFinite(composite.mc)){const [x,y]=pt(composite.mc,outer-24);svg.append(el('text',{x,y,class:'aq-wheel-angle-label'},'MC'));}
    host.replaceChildren(svg);legend(host,[['a','مواضع الخريطة المركّبة'],['h','اتصال منسجم'],['c','اتصال ضاغط']],'العجلة تعرض الكواكب الشخصية؛ قائمة المواضع أسفلها تعرض بقية الكواكب أيضاً.');
  }
  function renderChartWheel(host,chart,aspects=[],label='خريطة فلكية',opts={}){
    if(!host||!chart)return;
    const svg=baseSvg(label,'عجلة الأبراج والبيوت مع مواضع الكواكب. مرر أو ركز على رمز الكوكب لعرض البرج والدرجة والبيت.');
    const {outer,center}=drawFramework(svg,chart.known?chart.cusps:null);
    const bodies=(chart.bodies||[]).filter(b=>PLANETS[b.key]);
    aspects.slice().sort((a,b)=>a.orb-b.orb).slice(0,10).forEach(a=>{const x=bodies.find(b=>b.key===a.a),y=bodies.find(b=>b.key===a.b);if(!x||!y)return;const [x1,y1]=pt(x.lon,center+5),[x2,y2]=pt(y.lon,center+5),k=a.asp?.k||'';svg.append(el('line',{x1,y1,x2,y2,class:'aq-wheel-aspect '+(['tri','sext'].includes(k)?'harmonious':['sq','opp'].includes(k)?'challenging':'neutral'),opacity:.45}));});
    bodies.forEach((b,i)=>{const info=PLANETS[b.key],r=160+(i%2)*18,[x,y]=pt(b.lon,r),[tx,ty]=pt(b.lon,r+13),sg=SIGNS[Math.floor(norm(b.lon)/30)],retro=b.retro?' · متراجع':'';const g=el('g',{class:'aq-wheel-planet person-composite',tabindex:'0',role:'img','aria-label':info[0]+' في '+sg+' '+position(b.lon)+(chart.known&&Number.isInteger(b.house)?'، البيت '+b.house:'')+retro});g.append(el('circle',{cx:x,cy:y,r:10,class:'aq-wheel-planet-dot'}),el('text',{x,y:y+4,class:'aq-wheel-planet-glyph'},info[1]),el('text',{x:tx,y:ty,class:'aq-wheel-degree'},position(b.lon)),el('title',{},info[0]+' · '+sg+' '+position(b.lon)+(chart.known&&Number.isInteger(b.house)?' · البيت '+b.house:'')+retro));svg.append(g);});
    if(opts.highlightHouse&&chart.known&&Array.isArray(chart.cusps)&&chart.cusps.length>=12){const h=opts.highlightHouse-1,a=norm(chart.cusps[h]),b=norm(chart.cusps[(h+1)%12]),span=norm(b-a)||30,pts=[];for(let i=0;i<=24;i++)pts.push(pt(a+span*i/24,outer-2).join(','));for(let i=24;i>=0;i--)pts.push(pt(a+span*i/24,center+4).join(','));svg.insertBefore(el('polygon',{points:pts.join(' '),class:'aq-wheel-highlight'}),svg.querySelector('.aq-wheel-planet'));}
    (opts.markers||[]).forEach(m=>{if(!Number.isFinite(m.lon))return;const [x,y]=pt(m.lon,118),[tx,ty]=pt(m.lon,138),g=el('g',{class:'aq-wheel-planet person-b aq-wheel-marker',tabindex:'0',role:'img','aria-label':m.title+' '+position(m.lon)});g.append(el('circle',{cx:x,cy:y,r:11,class:'aq-wheel-planet-dot'}),el('text',{x,y:y+4,class:'aq-wheel-planet-glyph'},m.glyph),el('text',{x:tx,y:ty,class:'aq-wheel-degree'},position(m.lon)),el('title',{},m.title+' · '+position(m.lon)));svg.append(g);});
    svg.append(el('circle',{cx:260,cy:260,r:center,class:'aq-wheel-center'}),el('text',{x:260,y:255,class:'aq-wheel-center-title'},label.toUpperCase()),el('text',{x:260,y:274,class:'aq-wheel-center-sub'},chart.known?'الأبراج والبيوت':'الأبراج · وقت غير معروف'));
    if(chart.known&&Number.isFinite(chart.asc)){const [x,y]=pt(chart.asc,outer-7);svg.append(el('text',{x,y,class:'aq-wheel-angle-label'},'ASC'));}
    if(chart.known&&Number.isFinite(chart.mc)){const [x,y]=pt(chart.mc,outer-24);svg.append(el('text',{x,y,class:'aq-wheel-angle-label'},'MC'));}
    host.replaceChildren(svg);legend(host,[['a','مواضع الكواكب'],...(opts.markers&&opts.markers.length?[['b',opts.markerLegend||'نقاط الحدث']]:[]),['h','اتصال منسجم'],['c','اتصال ضاغط']],chart.known?'مرر أو المس رمز الكوكب لعرض درجته وبرجه وبيته.':'وقت الميلاد غير معروف؛ البيوت غير معروضة.');
  }
  window.AqeeqAstroWheel={renderSynastryWheel,renderCompositeWheel,renderChartWheel,position};
})();
;
/* assets/js/inline/page-14.js */
window.AQ_REVIEW_OPEN=true;document.documentElement.classList.add("aq-review-open");
;
/* assets/js/extended-astro-charts.js */
(() => {
  'use strict';
  const SIGNS=['الحمل','الثور','الجوزاء','السرطان','الأسد','العذراء','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'];
  const NAMES={sun:'الشمس',moon:'القمر',mercury:'عطارد',venus:'الزهرة',mars:'المريخ',jupiter:'المشتري',saturn:'زحل',uranus:'أورانوس',neptune:'نبتون',pluto:'بلوتو',truenode:'العقدة الحقيقية',node:'العقدة المتوسطة · راهو الفيدي',fortune:'سهم السعادة',chiron:'كيرون'};
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
    const b=document.createElement('button');b.type='button';b.className='aq-copy-map-btn';b.textContent='نسخ بيانات الخريطة بالكامل';
    b.addEventListener('click',async()=>{
      const clone=host.cloneNode(true);clone.querySelectorAll('.aq-copy-map-btn,button').forEach(x=>x.remove());if(host.id==='result')clone.querySelector('#aqeek-personal-transits')?.remove();
      const svgTitles=[...clone.querySelectorAll('svg title')].map(x=>x.textContent.trim()).filter(Boolean);
      const text=title+'\n\n'+clone.textContent.replace(/\s+/g,' ').trim()+(svgTitles.length?'\n\nتفاصيل العجلة: '+svgTitles.join(' · '):'');
      try{await navigator.clipboard.writeText(text);b.textContent='تم نسخ بيانات الخريطة';}
      catch(_){const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();try{document.execCommand('copy');b.textContent='تم نسخ بيانات الخريطة';}catch(__){b.textContent='تعذر النسخ؛ حدد النص يدوياً.';}area.remove();}
      setTimeout(()=>b.textContent='نسخ بيانات الخريطة بالكامل',2200);
    });
    host.append(b);
  }
  window.AqeeqCopyMap={attach:mountCopy};

  const attachTransitCopy=()=>{const host=$('#aqeek-personal-transits');if(host){window.AqeeqGender?.apply(host,context()?.gender);if(!host.querySelector('.aq-copy-map-btn')&&host.querySelector('.aqt-shell'))mountCopy(host,'خريطة العبور الشخصي');}};
  attachTransitCopy();new MutationObserver(attachTransitCopy).observe(document.documentElement,{childList:true,subtree:true});
  const section=$('#astro-maps'),content=$('#eam-content');
  if(!section||!content)return;
  let mode='transit';
  const OPEN=new Set(['eclipses','nodes','sidereal']);
  const gchart=ms=>Astro.chart({utcMs:ms,lat:30,lon:31,known:false});
  const nowLocal=()=>{const d=new Date(),local=new Date(d.getTime()-d.getTimezoneOffset()*60000);return local.toISOString().slice(0,16);};
  function context(){return window.AqeeqChartContext?.getNatal?.()||window.AqeeqChartContext?.getOrPrefill?.()||null;}
  function readyMessage(){return '<p class="eam-hint">هذا القسم يعتمد على بياناتك. اكتبها في النموذج بالأعلى ثم اعرض خريطتك.</p>';}
  const EX={
    sidereal:{t:'ما الخريطة الفيدية؟',a:'تقرأ السماء كما هي في مكانها الحقيقي بين النجوم، فتختلف مواضع كواكبك عن الخريطة الغربية بدرجات قليلة، وتكشف لك صورة أخرى من نفسك.',h:'ماذا ستجد فيها؟',s:[['الطالع','البرج الصاعد لحظة ميلادك، ويصف طريقتك في مقابلة الناس والحياة.'],['المنزل القمري','موضع القمر بين سبعة وعشرين منزلًا، ويرسم طبعك الداخلي وما يريحك.'],['الداشا','فترات العمر التي يحكم كل منها كوكب، فتعرف أي طاقة تحيط بك الآن.']]},
    transit:{t:'ما العبور؟',a:'هو حركة الكواكب في السماء الآن فوق خريطة ميلادك. تقارن مكانها بمكان كواكبك لترى أي مجال من حياتك يتحرك.',h:'كيف تقرأ النتيجة؟',s:[['الحلقة الخارجية','مواضع الكواكب في اللحظة التي اخترتها.'],['البيت المُنشَّط','البيت الذي يمر فيه كل كوكب من خريطتك، فتعرف ما الذي يشغلك.'],['الاتصالات','الزوايا بين كواكب العبور وكواكب ميلادك، وهي أوضح ما تحسه في يومك.']]},
    solar:{t:'ما العودة الشمسية؟',a:'في كل عام تعود الشمس إلى الدرجة نفسها التي كانت فيها يوم ميلادك. خريطة تلك اللحظة تصف طابع سنتك حتى ميلادك القادم.',h:'كيف تقرأ النتيجة؟',s:[['لحظة العودة','الوقت الدقيق الذي ترجع فيه الشمس إلى موضعها الأصلي.'],['خريطة السنة','خريطة تُرسم لتلك اللحظة وتبين ما يغلب على سنتك.'],['البيوت','أين تقع كواكب السنة من خريطتك، فتعرف أين يتركز اهتمامك.']]},
    profections:{t:'ما التوجيهات السنوية؟',a:'نظام قديم ينسب كل سنة من عمرك إلى بيت وبرج بالتسلسل، فيظهر لك كوكب واحد يقود سنتك.',h:'كيف تستعمله؟',s:[['البرج السنوي','البيت والبرج اللذان يوافقان عمرك هذا العام.'],['سيد السنة','الكوكب الحاكم لهذا البرج، وبه تُقرأ السنة.'],['خطوتك','راقب أين يمر سيد السنة في خريطتك وتحرك داخل مجاله.']]},
    eclipses:{t:'ما أثر الكسوف والخسوف؟',a:'هي لحظات تتبدل فيها الأمور بسرعة أكبر من المعتاد. المهم أين يقع الحدث في خريطتك لا الحدث وحده.',h:'ماذا ستجد؟',s:[['الحدث','كسوف شمس أو خسوف قمر، بتاريخه ودرجته.'],['البيت','المجال من حياتك الذي يقع فيه الحدث.'],['المدة','أثره يُقرأ على أشهر لا على يوم واحد، فراقب ما يتغير بهدوء.']]},
    nodes:{t:'ما العقد القمرية؟',a:'نقطتان في السماء ترسمان اتجاه نموك وما اعتدت عليه. تُقرأ معًا كمحور واحد في خريطتك.',h:'كيف تقرأ المحور؟',s:[['العقدة الشمالية','الاتجاه الذي تنمو نحوه وإن كان غير مألوف.'],['العقدة الجنوبية','ما اعتدت عليه من قديم وتميل إلى تكراره.'],['العودة العقدية','مرة كل نحو ثماني عشرة سنة ونصف تعود العقد إلى موضعها يوم ميلادك، فتراجع اتجاهك.']]}
  };
  const PAGE={
    sidereal:{e:'عقيق أسترو · الخريطة الفيدية',h:'خريطتك الفيدية',i:'أي طاقة تحكم فصول عمرك، وماذا تخبئ لك سماء ميلادك؟',b:'اعرض خريطتي الفيدية',p:'الخريطة الفيدية'},
    transit:{e:'عقيق أسترو · العبور الفلكي',h:'العبور فوق خريطتك',i:'أي بيت من حياتك تُنشّطه الكواكب في هذه اللحظة؟',b:'احسب العبور',p:'العبور'},
    solar:{e:'عقيق أسترو · العودة الشمسية',h:'عودتك الشمسية',i:'ما طابع سنتك من لحظة رجوع الشمس إلى درجتها؟',b:'احسب عودتي الشمسية',p:'العودة الشمسية'},
    profections:{e:'عقيق أسترو · التوجيهات السنوية',h:'سيد سنتك',i:'أي كوكب يقود سنتك، وإلى أين تتجه طاقتك هذا العام؟',b:'احسب سيد السنة',p:'التوجيهات السنوية'},
    eclipses:{e:'عقيق أسترو · الكسوف والخسوف',h:'الكسوف والخسوف في خريطتك',i:'أين يقع حدث الكسوف والخسوف في بيوت خريطتك؟',b:'اعرض الكسوف والخسوف',p:'الكسوف والخسوف'},
    nodes:{e:'عقيق أسترو · العقد القمرية',h:'محور العقد القمرية',i:'إلى أين ينمو مسارك، وما الذي اعتدت تكراره؟',b:'احسب محور العقد',p:'العقد القمرية'}
  };
  function applyPage(m){
    const c=PAGE[m]||PAGE.sidereal;section.dataset.eamPage=m;
    const e=$('.eam-hero .eyebrow'),h=$('.eam-hero h2'),i=$('.eam-hero .intro'),b=$('.eam-form .btn[type="submit"] span'),pl=$('.aq-section-pill.active');
    if(e){e.removeAttribute('dir');e.textContent=c.e;}if(h)h.textContent=c.h;if(i)i.textContent=c.i;if(b)b.textContent=c.b;if(pl)pl.textContent=c.p;const ex=$('#eam-explain');if(ex&&EX[m])ex.innerHTML='<div class="y27-about"><h3>'+EX[m].t+'</h3><p>'+EX[m].a+'</p></div><h3>'+EX[m].h+'</h3>'+EX[m].s.map((r,i)=>'<div class="y27-ex"><b>'+(i+1)+'</b><div><strong>'+r[0]+'</strong><p>'+r[1]+'</p></div></div>').join('');
  }
  function setMode(next){
    mode=next;applyPage(mode);
    section.querySelectorAll('[data-eam-mode]').forEach(b=>{const active=b.dataset.eamMode===mode;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
    renderControls();
  }
  function renderControls(){
    const ctx=context();
    if(!ctx&&!OPEN.has(mode)){content.innerHTML=readyMessage();return;}
    const titles={transit:'خريطة العبور الحالية',solar:'العودة الشمسية',profections:'التوجيهات السنوية',eclipses:'خريطة الكسوف والخسوف',nodes:'العقد القمرية والعودة العقدية',sidereal:'الخريطة الفيدية · لاهيري'};
    const descriptions={transit:'قارن مواقع الكواكب الآن بخريطة ميلادك، مع تحديد بيت الميلاد الذي ينشطه كل كوكب.',solar:'لحظة عودة الشمس إلى درجتها الأصلية وخريطة السنة الشخصية الجديدة.',profections:'البرج السنوي وسيد السنة وفق نظام التوجيهات السنوية التقليدي والبيوت الكاملة.',eclipses:'أحداث الكسوف والخسوف العالمية خلال السنة، وموقعها داخل بيوت خريطة الميلاد.',nodes:'موضع العقدتين في الميلاد والعبور، ومواعيد عودة العقدة الشمالية التقريبية.',sidereal:'تُحسب الخريطة باستخدام وقت ومكان الميلاد المسجلين في خريطتك.'};
    const title=titles[mode]||titles.sidereal,description=descriptions[mode]||descriptions.sidereal;
    const nowY=new Date().getFullYear();
    const birthY=(()=>{const v=(document.getElementById('eam-b-date')||{}).value||'';const y=Number(v.slice(0,4));return y>1800?y:nowY-80;})();
    const yearOptions=()=>{const from=Math.min(birthY,nowY-80),to=nowY+30;let h='';for(let y=to;y>=from;y--)h+='<option value="'+y+'" '+(y===nowY?'selected':'')+'>'+y+'</option>';return h;};
    const yearPicker=(label)=>'<div class="field eam-yearpick"><span>'+label+'</span><div class="eam-yp"><button type="button" class="eam-yp-b" data-yp="-1" aria-label="السنة السابقة"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button><select id="eam-year" aria-label="'+label+'">'+yearOptions()+'</select><button type="button" class="eam-yp-b" data-yp="1" aria-label="السنة التالية"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button></div><div class="eam-yp-quick"><button type="button" data-yq="-1">السنة الماضية</button><button type="button" data-yq="0">هذه السنة</button><button type="button" data-yq="1">السنة القادمة</button></div></div>';
    let controls='';
    if(mode==='transit')controls='<label class="field"><span>تاريخ ووقت العبور · بتوقيت جهازك</span><input id="eam-date" type="datetime-local" value="'+nowLocal()+'"></label><button type="button" class="btn ghost sm" id="eam-now">الآن</button>';
    else if(mode==='solar')controls=yearPicker('سنة العودة الشمسية');
    else if(mode==='profections')controls='<label class="field"><span>التاريخ السنوي</span><input id="eam-date" type="date" value="'+new Date().toISOString().slice(0,10)+'"></label>';
    else if(mode==='eclipses')controls=yearPicker('السنة');
    else if(mode==='nodes')controls='<label class="field"><span>تاريخ قراءة العقد</span><input id="eam-date" type="date" value="'+new Date().toISOString().slice(0,10)+'"></label>';
    else controls='<p class="eam-method">النطاق النجمي محسوب بطريقة لاهيري؛ تُطرح قيمة الأيانامشا من المواقع الاستوائية. من غير خريطة ميلاد تعرض السماء النجمية الآن، ومعها خريطتك إن كانت محسوبة.</p>';
    const labels={transit:'احسب العبور',solar:'احسب العودة الشمسية',profections:'احسب سيد السنة',eclipses:'اعرض الكسوف والخسوف',nodes:'احسب محور العقد',sidereal:'اعرض الخريطة الفيدية'};
    content.innerHTML='<div class="eam-control"><div><span class="eam-kicker">'+esc(title)+'</span><p>'+esc(description)+'</p></div><div class="eam-controls">'+controls+'<button class="btn" type="button" id="eam-calculate">'+labels[mode]+'</button></div></div><p class="eam-status" id="eam-status" role="status" aria-live="polite"></p><div id="eam-result" class="eam-result" hidden></div>';
    $('#eam-now',content)?.addEventListener('click',()=>$('#eam-date',content).value=nowLocal());
    $('#eam-calculate',content)?.addEventListener('click',calculate);
    const ysel=$('#eam-year',content);
    if(ysel){
      const setY=(y)=>{if(!ysel.querySelector('option[value="'+y+'"]'))return;ysel.value=String(y);calculate();};
      content.querySelectorAll('[data-yp]').forEach(b=>b.addEventListener('click',()=>setY(Number(ysel.value)+Number(b.dataset.yp))));
      content.querySelectorAll('[data-yq]').forEach(b=>b.addEventListener('click',()=>setY(nowY+Number(b.dataset.yq))));
      ysel.addEventListener('change',()=>calculate());
    }
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
    const inner='<section class="eam-pillar-grid"><article class="eam-pillar"><span>العمر السنوي</span><strong>'+age+'</strong><small>السنة '+(age+1)+' من دورة الميلاد</small></article><article class="eam-pillar"><span>البيت المفعّل</span><strong>'+house+'</strong><small>'+esc(HOUSE_AREAS[house-1])+'</small></article><article class="eam-pillar"><span>البرج السنوي</span><strong>'+esc(SIGNS[sign])+'</strong><small>من طالع الميلاد</small></article><article class="eam-pillar"><span>سيد السنة</span><strong>'+esc(lord)+'</strong><small>الحاكم التقليدي للبرج</small></article></section>';
    result.hidden=false;result.innerHTML='<header class="eam-result-head"><span class="eam-kicker">التوجيهات السنوية · '+esc(target.toLocaleDateString('ar-EG'))+'</span><h3>التوجيه السنوي: البيت '+house+' في '+esc(SIGNS[sign])+'</h3><p class="eam-note">طريقة البيوت الكاملة: تنتقل سنة التوجيه عند عيد الميلاد، ويكون حاكم البرج المفعّل سيد السنة.</p></header>'+inner+'<section class="eam-card"><h4>قراءة إرشادية</h4><p class="eam-prose">يضع هذا العام موضوع <b>'+esc(HOUSE_AREAS[house-1])+'</b> في مقدمة الاهتمام، ويشير <b>'+esc(lord)+"</b> إلى الكوكب الذي يُتابع في الخريطة والعبور لفهم توقيتات السنة. </p></section>";
    result.querySelector('.eam-result-head').insertAdjacentHTML('afterend','<div class="eam-wheel" id="eam-wheel"></div>');window.AqeeqAstroWheel?.renderChartWheel($('#eam-wheel',result),natal.ch,[],'التوجيهات السنوية',{highlightHouse:house});window.AqeeqGender?.apply(result,natal.gender);mountCopy(result,'التوجيهات السنوية · سيد السنة '+lord);
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
    result.hidden=false;result.innerHTML='<header class="eam-result-head"><span class="eam-kicker">الكسوف والخسوف · '+year+'</span><h3>الكسوف والخسوف في بيوت الميلاد</h3><p class="eam-note">الأحداث عالمية من محرك فلكي دقيق؛ البيت محسوب من موضع الشمس أو القمر عند الذروة مع رؤوس بيوت ميلادك. هذا لا يحدد الرؤية المحلية.</p></header><div class="eam-event-list">'+rows+'</div>';
    {const markers=items.map(({e,type})=>{const ch=engineChart(e.peak.date.getTime(),natal),b=ch.bodies.find(x=>x.key===(type==='solar'?'sun':'moon'));return b?{lon:b.lon,glyph:type==='solar'?'☉':'☽',title:(type==='solar'?'كسوف شمسي ':'خسوف قمري ')+e.peak.date.toLocaleDateString('ar-EG',{dateStyle:'medium',timeZone:'UTC'})}:null;}).filter(Boolean);result.querySelector('.eam-result-head').insertAdjacentHTML('afterend','<div class="eam-wheel" id="eam-wheel"></div>');window.AqeeqAstroWheel?.renderChartWheel($('#eam-wheel',result),natal.ch,[],'الكسوف والخسوف '+year,{markers,markerLegend:'مواضع الكسوف والخسوف'});}window.AqeeqGender?.apply(result,natal.gender);mountCopy(result,'الكسوف والخسوف · '+year);
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
    result.hidden=false;result.innerHTML='<header class="eam-result-head"><span class="eam-kicker">العقد القمرية · عودة العقدة</span><h3>محور العقدة الشمالية والجنوبية</h3><p class="eam-note">العقدة الجنوبية مقابلة للشمالية تماماً؛ عودة العقدة تحدث تقريباً كل 18.6 سنة.</p></header><section class="eam-pillar-grid"><article class="eam-pillar"><span>العقدة الشمالية ☊ · عبور</span><strong>'+esc(fmt(north.lon))+'</strong><small>'+esc(fmtHouse(nHouse))+'</small></article><article class="eam-pillar"><span>العقدة الجنوبية ☋ · عبور</span><strong>'+esc(fmt(south))+'</strong><small>'+esc(fmtHouse(sHouse))+'</small></article><article class="eam-pillar"><span>العقدة الشمالية · الميلاد</span><strong>'+esc(fmt(birthNode))+'</strong><small>'+esc(fmtHouse(natalHouseFor(birthNode,natal)))+'</small></article></section><section class="eam-card"><h4>محطات عودة العقدة الشمالية التقريبية</h4><div class="eam-event-list">'+returns.map((d,i)=>'<article class="eam-event"><div><span class="eam-event-date">العودة '+(k+i)+'</span><h4>'+esc(d.toLocaleDateString('ar-EG',{dateStyle:'long'}))+'</h4></div><div><b>توافق محور العقد</b><span>توقيت تقريبي يحسب من حركة العقدة في المحرك.</span></div></article>').join('')+"</div><p class=\"eam-note\"></p></section>";
    result.querySelector('.eam-result-head').insertAdjacentHTML('afterend','<div class="eam-wheel" id="eam-wheel"></div>');window.AqeeqAstroWheel?.renderChartWheel($('#eam-wheel',result),natal.ch,[],'العقد القمرية',{markers:[{lon:north.lon,glyph:'☊',title:'العقدة الشمالية (عبور)'},{lon:south,glyph:'☋',title:'العقدة الجنوبية (عبور)'}],markerLegend:'محور العقد الحالي'});window.AqeeqGender?.apply(result,natal.gender);mountCopy(result,'محور العقد القمرية والعودة العقدية');
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
    const mean=(22*3600+27*60+37.65+5025.75*T+1.11*T*T)/3600;
    // المواقع الاستوائية ظاهرية (فيها ترنّح خط الطول)، فيُضاف الترنّح للأيانامشا ليطابق الموضع النجمي مرجع Swiss Ephemeris.
    let dpsi=0;try{const n=Astro._nut((jde-2451545)/36525);if(n&&Number.isFinite(n.dpsi))dpsi=n.dpsi;}catch(_){}
    return mean+dpsi;
  }
  function siderealChart(natal){
    const offset=ayanamsa(natal.ch.jde),ch={...natal.ch,ayanamsa:offset,sidereal:true};
    ch.bodies=natal.ch.bodies.map(b=>({...b,lon:norm(b.lon-offset),sign:Math.floor(norm(b.lon-offset)/30)}));
    if(ch.known){
      ch.asc=norm(ch.asc-offset);ch.mc=norm(ch.mc-offset);
      if(ch.hs==='whole'||ch.hs==='whole-fallback'){
        // Whole-sign boundaries belong to the new zodiac, not rotated tropical cusps.
        const start=Math.floor(ch.asc/30)*30;
        ch.cusps=Array.from({length:12},(_,i)=>norm(start+30*i));
        ch.bodies.forEach(b=>{b.house=Astro.houseOf(b.lon,ch.cusps);});
      }else ch.cusps=ch.cusps.map(x=>norm(x-offset));
    }
    return ch;
  }
  function renderChart(result,title,subtitle,ch,extraHTML='',aspects=[]){
    result.hidden=false;result.innerHTML='<header class="eam-result-head"><span class="eam-kicker">'+esc(title)+'</span><h3>'+esc(subtitle)+'</h3>'+chartSummary(ch)+'</header><div class="eam-wheel" id="eam-wheel"></div>'+chartTable(ch)+extraHTML+aspectLines(aspects);
    window.AqeeqAstroWheel?.renderChartWheel($('#eam-wheel',result),ch,aspects,title);
    window.AqeeqGender?.apply(result,context()?.gender);
    mountCopy(result,title);
  }
  function renderEclipsesGlobal(result,year){
    const engine=typeof Astronomy!=='undefined'?Astronomy:(window.Astronomy||globalThis.Astronomy);
    if(!engine)throw new Error('مكتبة Astronomy Engine غير محملة.');
    const items=[...eclipseEvents(year,engine,'solar').map(e=>({e,type:'solar'})),...eclipseEvents(year,engine,'lunar').map(e=>({e,type:'lunar'}))].sort((a,b)=>a.e.peak.date-b.e.peak.date);
    if(!items.length)throw new Error('لم تُعثر على أحداث كسوف أو خسوف لهذه السنة.');
    const rows=items.map(({e,type})=>{const d=e.peak.date,b=gchart(d.getTime()).bodies.find(x=>x.key===(type==='solar'?'sun':'moon'));return '<article class="eam-event"><div><span class="eam-event-date">'+esc(d.toLocaleDateString('ar-EG',{dateStyle:'medium',timeZone:'UTC'}))+'</span><h4>'+(type==='solar'?'كسوف شمسي':'خسوف قمري')+' · '+eclipseKindText(engine,e.kind,type)+'</h4></div><div><b>'+esc(b?fmt(b.lon):'غير متاح')+'</b><span>موضع الذروة في البروج</span></div></article>';}).join('');
    result.hidden=false;result.innerHTML='<header class="eam-result-head"><span class="eam-kicker">الكسوف والخسوف · '+year+'</span><h3>الكسوف والخسوف في '+year+'</h3><p class="eam-note">أحداث عالمية من محرك فلكي؛ الموضع هو برج ودرجة الذروة. احسب خريطتك لترى في أي بيت من حياتك يقع كل حدث.</p></header><div class="eam-event-list">'+rows+'</div>';
  }
  function renderNodesGlobal(result,value){
    const date=value?new Date(value+'T12:00:00'):new Date(),ch=gchart(date.getTime()),n=ch.bodies.find(b=>b.key==='truenode'||b.key==='node');
    if(!n)throw new Error('بيانات العقد القمرية غير متاحة.');
    const s=norm(n.lon+180);
    result.hidden=false;result.innerHTML='<header class="eam-result-head"><span class="eam-kicker">العقد القمرية · '+esc(date.toLocaleDateString('ar-EG'))+'</span><h3>محور العقدة الشمالية والجنوبية</h3><p class="eam-note">العقدتان متقابلتان دائماً وتتحركان عكس ترتيب البروج، وتقضيان نحو 18 شهراً في كل برج. احسب خريطتك لتعرف أين يقع المحور في بيوتك.</p></header><section class="eam-pillar-grid"><article class="eam-pillar"><span>العقدة الشمالية ☊ · راهو</span><strong>'+esc(fmt(n.lon))+'</strong><small>اتجاه النمو</small></article><article class="eam-pillar"><span>العقدة الجنوبية ☋ · كيتو</span><strong>'+esc(fmt(s))+'</strong><small>ما اعتدت عليه</small></article></section>';
  }
  function renderSiderealNow(result){
    const now=Date.now(),ch=gchart(now),off=ayanamsa(ch.jde);
    const rows=chartBodies(ch).map(b=>{const l=norm(b.lon-off);return '<tr><th>'+esc(GLYPHS[b.key]||'')+' '+esc(NAMES[b.key]||b.key)+'</th><td>'+esc(fmt(l))+'</td><td>'+(b.retro?'راجع ℞':'مباشر')+'</td></tr>';}).join('');
    result.hidden=false;result.innerHTML='<header class="eam-result-head"><span class="eam-kicker">النطاق النجمي · لاهيري</span><h3>السماء الفيدية الآن</h3><p class="eam-note">أيانامشا لاهيري: '+off.toFixed(4)+'°. هذه مواضع الكواكب الآن بالبروج النجمية؛ احسب خريطتك لتظهر خريطتك الفيدية الكاملة.</p></header><div class="eam-table-wrap"><table class="eam-table"><thead><tr><th>الكوكب</th><th>البرج والدرجة</th><th>الحركة</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
  }
  async function calculate(){
    const natal=context(),status=$('#eam-status',content),button=$('#eam-calculate',content),result=$('#eam-result',content);
    if(!natal&&!OPEN.has(mode)){renderControls();return;}
    status.textContent='جارٍ حساب الخريطة…';button.disabled=true;button.setAttribute('aria-busy','true');await new Promise(r=>setTimeout(r,20));
    try{
      if(mode==='transit'){
        const value=$('#eam-date',content).value,date=value?new Date(value):new Date();if(Number.isNaN(date.getTime()))throw new Error('تاريخ ووقت العبور غير صالحين.');
        const t=currentTransit(natal,date),lines=t.aspects;
        result.hidden=false;result.innerHTML='<header class="eam-result-head"><span class="eam-kicker">خريطة العبور · '+esc(dateStamp(date))+'</span><h3>العبور فوق خريطة الميلاد</h3><p class="eam-note">الحلقة الخارجية لمواضع العبور، والداخلية لمواضع الميلاد.</p></header><div class="eam-wheel" id="eam-wheel"></div>'+transitHouseTable(t.chart,natal)+aspectLines(lines,'اتصالات العبور بخريطة الميلاد');
        window.AqeeqAstroWheel?.renderSynastryWheel($('#eam-wheel',result),natal.ch,t.chart,t.aspects);
        result.dataset.ceInstant=String(date.getTime());
        window.dispatchEvent(new CustomEvent('aqeeq:chiron-transits',{detail:{hostId:'eam-result',date:date.getTime(),natal:natal.ch,current:t.chart}}));
        window.AqeeqGender?.apply(result,natal.gender);
        mountCopy(result,'خريطة العبور · '+dateStamp(date));
      }else if(mode==='solar'){
        const year=Number($('#eam-year',content).value),utc=solarReturnUtc(natal,year),ch=engineChart(utc,natal),aspects=chartAspects(ch);
        renderChart(result,'العودة الشمسية · '+year,'العودة الشمسية للحظات عودة الشمس إلى موضع الميلاد',ch,'<p class="eam-note">لحظة العودة: '+esc(new Date(utc).toISOString().replace('T',' ').replace('Z',' UTC'))+'. البيوت محسوبة لمكان الميلاد المسجل.</p>',aspects);
      }else if(mode==='profections'){
        renderProfections(result,natal,$('#eam-date',content).value);
      }else if(mode==='eclipses'){
        if(natal)renderEclipses(result,natal,Number($('#eam-year',content).value));else renderEclipsesGlobal(result,Number($('#eam-year',content).value));
      }else if(mode==='nodes'){
        if(natal)renderNodes(result,natal,$('#eam-date',content).value);else renderNodesGlobal(result,$('#eam-date',content).value);
      }else if(!natal){
        renderSiderealNow(result);
      }else{
        const ch=siderealChart(natal),aspects=chartAspects(ch);
        renderChart(result,'النطاق النجمي · لاهيري','الخريطة الفيدية بالنطاق النجمي',ch,'<p class="eam-note">أيانامشا لاهيري: '+ch.ayanamsa.toFixed(4)+'°. قد تختلف قيم الأيانامشا والتقاليد الفيدية الأخرى.</p>',aspects);
        try{window.AqVedic?.render(result,ch,natal,{saturnSign(){const now=engineChart(Date.now(),natal),s=(now.bodies||[]).find(b=>b.key==='saturn');return s?Math.floor(norm(s.lon-ayanamsa(now.jde))/30):null;}});}catch(e){console.warn(e);}
      }
      status.textContent='اكتمل الحساب. يمكنك نسخ تفاصيل الخريطة من الزر أسفل النتيجة.';
    }catch(error){status.textContent=error?.message||'تعذر حساب الخريطة؛ راجع البيانات وحاول مرة أخرى.';result.hidden=true;}
    finally{button.disabled=false;button.removeAttribute('aria-busy');}
  }
  section.querySelectorAll('[data-eam-mode]').forEach(b=>b.addEventListener('click',()=>{setMode(b.dataset.eamMode);try{b.scrollIntoView({block:'nearest',inline:'center'});}catch(e){}}));
  section.querySelector('.eam-tabs')?.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();const buttons=[...section.querySelectorAll('[data-eam-mode]')],current=buttons.indexOf(event.target.closest('[data-eam-mode]'));const step=event.key==='ArrowLeft'?1:-1;buttons[(current+step+buttons.length)%buttons.length].click();buttons[(current+step+buttons.length)%buttons.length].focus();});
  document.addEventListener('aqeeq:natal-ready',renderControls);
  window.addEventListener('hashchange',()=>{if(location.hash==='#astro-maps'&&content.querySelector('.eam-invite'))renderControls();});

  /* نموذج بيانات الميلاد داخل البانر: يفتح الخريطة المختارة فوراً بنفس الصفحة */
  (function(){
    const form=$('#eam-form'),city=$('#eam-b-city'),err=$('#eam-b-err'),ok=$('#eam-b-ok');
    if(!form||!city)return;
    const CTX=()=>window.AqeeqChartContext;
    const loadCities=()=>{if(!CTX()?.cityOptionsHTML)return;const cur=city.value;city.innerHTML=CTX().cityOptionsHTML();city.querySelector('option[value="manual"]')?.remove();if(cur&&city.querySelector('option[value="'+cur+'"]'))city.value=cur;};
    loadCities();setTimeout(loadCities,1200);city.addEventListener('pointerdown',loadCities);
    const unk=$('#eam-b-unknown'),time=$('#eam-b-time');
    unk.addEventListener('change',()=>{time.disabled=unk.checked;});
    const say=(el,t)=>{[err,ok].forEach(x=>{x.hidden=true;});if(t){el.textContent=t;el.hidden=false;}};
    const setDate=v=>{const d=$('#eam-b-date');d.value=v;d.dispatchEvent(new Event('input',{bubbles:true}));d.dispatchEvent(new Event('change',{bubbles:true}));};
    $('#eam-b-fill').addEventListener('click',()=>{
      loadCities();const n=CTX()?.getOrPrefill?.();
      if(!n){say(err,'لا توجد بيانات ميلاد محفوظة في حسابك على هذا الجهاز. اكتبها هنا مرة واحدة.');return;}
      const p=x=>String(x).padStart(2,'0');
      setDate(n.y+'-'+p(n.m)+'-'+p(n.d));
      unk.checked=!n.known;time.disabled=!n.known;time.value=n.known?p(n.hh)+':'+p(n.mm):'';
      const i=CTX().cityIndexByName?.(n.placeName);if(i>=0){city.value=String(i);city.dispatchEvent(new Event('change',{bubbles:true}));}
      const g=$('#eam-b-gender');if(g&&n.gender)g.value=n.gender;
      say(ok,'تمت التعبئة من بياناتك المحفوظة. اضغط «افتح خرائطي».');
    });
    form.addEventListener('submit',e=>{
      e.preventDefault();say(err,'');
      const v=$('#eam-b-date').value;if(!v){say(err,'اكتب تاريخ الميلاد.');return;}
      const [y,m,d]=v.split('-').map(Number);let hh=12,mm=0;
      if(!unk.checked){if(!time.value){say(err,'اكتب وقت الميلاد أو علّم «لا أعرف وقت ميلادي».');return;}[hh,mm]=time.value.split(':').map(Number);}
      try{
        CTX().setFromInput({y,m,d,hh,mm,known:!unk.checked,cityIdx:city.value,gender:$('#eam-b-gender').value});
        say(ok,'تم حفظ البيانات لهذه الجلسة وفتحت الخرائط بالأسفل.');
        setMode(mode);calculate();
        content.scrollIntoView({behavior:'smooth',block:'start'});
      }catch(x){say(err,x.message||'تعذر حساب الخريطة.');}
    });
  })();
  window.AqEam={engineChart,siderealChart,ayanamsa,norm};
  setMode('sidereal');
})();
