(() => {
  'use strict';
  const NS='http://www.w3.org/2000/svg';
  const SIGNS=['الحمل','الثور','الجوزاء','السرطان','الأسد','العذراء','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'];
  const GLYPHS=['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  const PLANETS={sun:['الشمس','☉'],moon:['القمر','☽'],mercury:['عطارد','☿'],venus:['الزهرة','♀'],mars:['المريخ','♂'],jupiter:['المشتري','♃'],saturn:['زحل','♄'],uranus:['أورانوس','♅'],neptune:['نبتون','♆'],pluto:['بلوتو','♇'],truenode:['العقدة الشمالية','☊'],node:['العقدة','☊'],fortune:['سهم السعادة','⊗']};
  const PERSONAL=['sun','moon','mercury','venus','mars'];
  const el=(tag,attrs={},text='')=>{const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v)));if(text)n.textContent=text;return n;};
  const norm=x=>((x%360)+360)%360;
  const point=(lon,r,c=260)=>{const a=(180+norm(lon))*Math.PI/180;return [c+r*Math.cos(a),c-r*Math.sin(a)];};
  const position=lon=>{const x=norm(lon),sign=Math.floor(x/30),deg=x-sign*30,d=Math.floor(deg),m=Math.round((deg-d)*60);return m===60?String((d+1)%30).padStart(2,'0')+'°00′':String(d).padStart(2,'0')+'°'+String(m).padStart(2,'0')+'′';};
  function renderSynastryWheel(host, chartA, chartB, aspects=[]){
    if(!host||!chartA||!chartB)return;
    const svg=el('svg',{viewBox:'0 0 520 520',role:'img','aria-labelledby':'syn-wheel-title syn-wheel-desc',class:'aq-wheel-svg'});
    svg.append(el('title',{id:'syn-wheel-title'},'عجلة توافق ثنائية: خريطة الشخص الأول خارجية والثاني داخلية'));
    svg.append(el('desc',{id:'syn-wheel-desc'},'الأبراج والبيوت في الحلقة الخارجية، والكواكب الشخصية لكل طرف مع خطوط الاتصالات بين الخريطتين.'));
    const cx=260, outer=244, zodiacInner=205, houseR=202, center=62;
    svg.append(el('circle',{cx,cy:cx,r:outer,class:'aq-wheel-border'}),el('circle',{cx,cy:cx,r:zodiacInner,class:'aq-wheel-border'}));
    for(let i=0;i<12;i++){
      const a=i*30, b=(i+1)*30, [x1,y1]=point(a,zodiacInner),[x2,y2]=point(a,houseR),[gx,gy]=point(a+15,224);
      svg.append(el('line',{x1,y1,x2,y2,class:'aq-wheel-sign-line'}));
      svg.append(el('text',{x:gx,y:gy,class:'aq-wheel-sign'},GLYPHS[i]));
      const label=el('title',{},SIGNS[i]);svg.lastChild.append(label);
    }
    if(chartA.known&&Array.isArray(chartA.cusps)){
      chartA.cusps.forEach((lon,i)=>{const [x1,y1]=point(lon,houseR),[x2,y2]=point(lon,center+4);svg.append(el('line',{x1,y1,x2,y2,class:i%3===0?'aq-wheel-house aq-wheel-angle':'aq-wheel-house'}));const next=chartA.cusps[(i+1)%12],mid=norm(lon+norm(next-lon)/2),[tx,ty]=point(mid,108);svg.append(el('text',{x:tx,y:ty,class:'aq-wheel-house-number'},String(i+1)));});
    } else {
      for(let i=0;i<12;i++){const [x1,y1]=point(i*30,houseR),[x2,y2]=point(i*30,center+4);svg.append(el('line',{x1,y1,x2,y2,class:'aq-wheel-house'}));}
    }
    const find=(ch,k)=>ch.bodies.find(x=>x.key===k);
    const positions={};
    PERSONAL.forEach((key,i)=>{
      const a=find(chartA,key),b=find(chartB,key);
      if(a)positions['a:'+key]=point(a.lon,168);
      if(b)positions['b:'+key]=point(b.lon,130);
    });
    aspects.filter(x=>PERSONAL.includes(x.a)&&PERSONAL.includes(x.b)&&positions['a:'+x.a]&&positions['b:'+x.b]).forEach(x=>{
      const [x1,y1]=positions['a:'+x.a],[x2,y2]=positions['b:'+x.b],kind=x.asp?.k||'';
      svg.append(el('line',{x1,y1,x2,y2,class:'aq-wheel-aspect '+(['tri','sext'].includes(kind)?'harmonious':['sq','opp'].includes(kind)?'challenging':'neutral'),opacity:Math.max(.35,1-(x.orb||0)/10)}));
    });
    const addPlanets=(ch,prefix,r,cls)=>{
      PERSONAL.forEach(key=>{
        const body=find(ch,key);if(!body)return;
        const [x,y]=point(body.lon,r),[tx,ty]=point(body.lon,r+15),info=PLANETS[key];
        const group=el('g',{class:'aq-wheel-planet '+cls,tabindex:'0',role:'img','aria-label':info[0]+'، '+SIGNS[Math.floor(norm(body.lon)/30)]+' '+position(body.lon)+(ch.known&&Number.isInteger(body.house)?'، البيت '+body.house:'')});
        group.append(el('circle',{cx:x,cy:y,r:12,class:'aq-wheel-planet-dot'}),el('text',{x,y:y+4,class:'aq-wheel-planet-glyph'},info[1]));
        const label=el('text',{x:tx,y:ty,class:'aq-wheel-degree'},position(body.lon));
        group.append(label,el('title',{},info[0]+' · '+SIGNS[Math.floor(norm(body.lon)/30)]+' '+position(body.lon)+(ch.known&&Number.isInteger(body.house)?' · البيت '+body.house:'')));
        svg.append(group);
      });
    };
    addPlanets(chartA,'a',168,'person-a');addPlanets(chartB,'b',130,'person-b');
    svg.append(el('circle',{cx,cy:cx,r:center,class:'aq-wheel-center'}));
    if(chartA.known&&Number.isFinite(chartA.asc)){const [x,y]=point(chartA.asc,outer-8);svg.append(el('text',{x,y,class:'aq-wheel-angle-label'},'ASC'));}
    if(chartA.known&&Number.isFinite(chartA.mc)){const [x,y]=point(chartA.mc,outer-26);svg.append(el('text',{x,y,class:'aq-wheel-angle-label'},'MC'));}
    host.replaceChildren(svg);
    const legend=document.createElement('div');legend.className='aq-wheel-legend';legend.innerHTML='<span><i class="a"></i> الشخص الأول · خارجي</span><span><i class="b"></i> الشخص الثاني · داخلي</span><span><i class="h"></i> اتصال منسجم</span><span><i class="c"></i> اتصال ضاغط</span>';host.append(legend);
    const note=document.createElement('p');note.className='aq-wheel-note';note.textContent=chartA.known?'البيوت والأوتاد بحسب خريطة الشخص الأول؛ مواضع الشخص الثاني معروضة فوق الأبراج نفسها. مرّر المؤشر أو المس كوكباً لعرض درجته وبرجه وبيته.':'وقت ميلاد الشخص الأول غير معروف؛ تقسيم البيوت هنا مرجعي فقط. درجات الكواكب موضحة عند التفاعل.';host.append(note);
  }
  window.AqeeqAstroWheel={renderSynastryWheel,position};
})();