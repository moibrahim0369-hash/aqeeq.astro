(() => {
  'use strict';
  const NS='http://www.w3.org/2000/svg', SIGNS=['الحمل','الثور','الجوزاء','السرطان','الأسد','العذراء','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'], GLYPHS=['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  const PLANETS={sun:['الشمس','☉'],moon:['القمر','☽'],mercury:['عطارد','☿'],venus:['الزهرة','♀'],mars:['المريخ','♂'],jupiter:['المشتري','♃'],saturn:['زحل','♄'],uranus:['أورانوس','♅'],neptune:['نبتون','♆'],pluto:['بلوتو','♇'],truenode:['العقدة الشمالية الحقيقية','☊'],node:['العقدة الشمالية المتوسطة','☊'],fortune:['سهم السعادة','⊗']}, PERSONAL=['sun','moon','mercury','venus','mars'];
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
  function renderSynastryWheel(host,chartA,chartB,aspects=[]){
    if(!host||!chartA||!chartB)return;
    const svg=baseSvg('عجلة التوافق الثنائية','الأبراج والبيوت في الحلقة الخارجية، الشخص الأول بالذهب والشخص الثاني بالعقيق، والاتصالات الرئيسية في المركز.');
    const {outer,center}=drawFramework(svg,chartA.known?chartA.cusps:null), find=(ch,k)=>ch.bodies?.find(x=>x.key===k), anchors={};
    const selected=aspects.filter(x=>PERSONAL.includes(x.a)&&PERSONAL.includes(x.b)).sort((a,b)=>a.orb-b.orb).slice(0,8);
    selected.forEach((a,i)=>{const x=find(chartA,a.a),y=find(chartB,a.b);if(!x||!y)return;anchors['a:'+a.a]=pt(x.lon,174);anchors['b:'+a.b]=pt(y.lon,128);const [x1,y1]=anchors['a:'+a.a],[x2,y2]=anchors['b:'+a.b],kind=a.asp?.k||'';
      svg.append(el('line',{x1,y1,x2,y2,class:'aq-wheel-aspect '+(['tri','sext'].includes(kind)?'harmonious':['sq','opp'].includes(kind)?'challenging':'neutral'),opacity:Math.max(.24,.66-(a.orb||0)*.035)}));
    });
    const add=(ch,r,cls)=>PERSONAL.forEach(key=>{const b=find(ch,key);if(!b)return;const [x,y]=pt(b.lon,r),[tx,ty]=pt(b.lon,r+15),info=PLANETS[key],h=houseAt(chartA,b.lon),s=SIGNS[Math.floor(norm(b.lon)/30)],group=el('g',{class:'aq-wheel-planet '+cls,tabindex:'0',role:'img','aria-label':info[0]+'، '+s+' '+position(b.lon)+(h?'، بيت الشخص الأول '+h:'')});group.append(el('circle',{cx:x,cy:y,r:12,class:'aq-wheel-planet-dot'}),el('text',{x,y:y+4,class:'aq-wheel-planet-glyph'},info[1]),el('text',{x:tx,y:ty,class:'aq-wheel-degree'},position(b.lon)),el('title',{},info[0]+' · '+s+' '+position(b.lon)+(h?' · بيت الشخص الأول '+h:'')));svg.append(group);});
    add(chartA,174,'person-a');add(chartB,128,'person-b');
    svg.append(el('circle',{cx:260,cy:260,r:center,class:'aq-wheel-center'}),el('text',{x:260,y:255,class:'aq-wheel-center-title'},'SYNASTRY'),el('text',{x:260,y:274,class:'aq-wheel-center-sub'},'A × B'));
    if(chartA.known&&Number.isFinite(chartA.asc)){const [x,y]=pt(chartA.asc,outer-7);svg.append(el('text',{x,y,class:'aq-wheel-angle-label'},'ASC'));}
    if(chartA.known&&Number.isFinite(chartA.mc)){const [x,y]=pt(chartA.mc,outer-24);svg.append(el('text',{x,y,class:'aq-wheel-angle-label'},'MC'));}
    host.replaceChildren(svg);
    legend(host,[['a','الشخص الأول · ذهبي'],['b','الشخص الثاني · عقيقي'],['h','اتصال منسجم'],['c','اتصال ضاغط']],chartA.known?'البيوت الظاهرة تخص خريطة الشخص الأول؛ درجات الكواكب تظهر عند المرور أو التركيز عليها.':'وقت ميلاد الشخص الأول غير معروف، لذلك تقسيم البيوت إرشادي فقط.');
  }
  function renderCompositeWheel(host,composite){
    if(!host||!composite)return;
    const cusps=composite.cusps||null,svg=baseSvg('عجلة الخريطة المركّبة','مواقع الكواكب الشخصية واتصالاتها داخل الخريطة المركّبة، مع الأبراج والبيوت عند توفر وقت الميلاد.');
    const {outer,center}=drawFramework(svg,cusps),positions=new Map((composite.positions||[]).map(x=>[x.key,x])),major=(composite.aspects||[]).filter(x=>PERSONAL.includes(x.a)&&PERSONAL.includes(x.b)).sort((a,b)=>a.orb-b.orb).slice(0,6);
    major.forEach(a=>{const x=positions.get(a.a),y=positions.get(a.b);if(!x||!y)return;const [x1,y1]=pt(x.lon,72),[x2,y2]=pt(y.lon,72),k=a.asp?.k||'';svg.append(el('line',{x1,y1,x2,y2,class:'aq-wheel-aspect '+(['tri','sext'].includes(k)?'harmonious':['sq','opp'].includes(k)?'challenging':'neutral'),opacity:.54}));});
    PERSONAL.forEach(key=>{const b=positions.get(key);if(!b)return;const [x,y]=pt(b.lon,146),[tx,ty]=pt(b.lon,166),info=PLANETS[key],s=SIGNS[Math.floor(norm(b.lon)/30)],group=el('g',{class:'aq-wheel-planet person-composite',tabindex:'0',role:'img','aria-label':info[0]+'، '+s+' '+position(b.lon)});group.append(el('circle',{cx:x,cy:y,r:12,class:'aq-wheel-planet-dot'}),el('text',{x,y:y+4,class:'aq-wheel-planet-glyph'},info[1]),el('text',{x:tx,y:ty,class:'aq-wheel-degree'},position(b.lon)),el('title',{},info[0]+' · '+s+' '+position(b.lon)));svg.append(group);});
    svg.append(el('circle',{cx:260,cy:260,r:center,class:'aq-wheel-center'}),el('text',{x:260,y:255,class:'aq-wheel-center-title'},'COMPOSITE'),el('text',{x:260,y:274,class:'aq-wheel-center-sub'},'الخريطة المشتركة'));
    if(composite.anglesKnown&&Number.isFinite(composite.asc)){const [x,y]=pt(composite.asc,outer-7);svg.append(el('text',{x,y,class:'aq-wheel-angle-label'},'ASC'));}
    if(composite.anglesKnown&&Number.isFinite(composite.mc)){const [x,y]=pt(composite.mc,outer-24);svg.append(el('text',{x,y,class:'aq-wheel-angle-label'},'MC'));}
    host.replaceChildren(svg);legend(host,[['a','مواضع الخريطة المركّبة'],['h','اتصال منسجم'],['c','اتصال ضاغط']],'العجلة تعرض الكواكب الشخصية؛ قائمة المواضع أسفلها تعرض بقية الكواكب أيضاً.');
  }
  const activeNodeKey=()=>window.AqeeqNodeModel?.defaultModel||'truenode';
  function renderChartWheel(host,chart,aspects=[],label='خريطة فلكية',opts={}){
    if(!host||!chart)return;
    const svg=baseSvg(label,'عجلة الأبراج والبيوت مع مواضع الكواكب. مرر أو ركز على رمز الكوكب لعرض البرج والدرجة والبيت.');
    const {outer,center}=drawFramework(svg,chart.known?chart.cusps:null);
    const nodeKey=activeNodeKey(),bodies=(chart.bodies||[]).filter(b=>PLANETS[b.key]&&(!['node','truenode'].includes(b.key)||b.key===nodeKey));
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