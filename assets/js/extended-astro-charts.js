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
    const title=mode==='transit'?'خريطة العبور الحالية':mode==='solar'?'العودة الشمسية':'الخريطة الفيدية · Lahiri';
    const description=mode==='transit'?'قارن مواقع الكواكب في التاريخ والوقت المختارين مع خريطة ميلادك.':'تُحسب الخريطة باستخدام وقت ومكان الميلاد المسجلين في خريطتك.';
    const controls=mode==='transit'?'<label class="field"><span>تاريخ ووقت العبور · بتوقيت جهازك</span><input id="eam-date" type="datetime-local" value="'+nowLocal()+'"></label><button type="button" class="btn ghost sm" id="eam-now">الآن</button>':mode==='solar'?'<label class="field"><span>سنة العودة الشمسية</span><select id="eam-year">'+Array.from({length:8},(_,i)=>new Date().getFullYear()+i).map(y=>'<option value="'+y+'" '+(y===new Date().getFullYear()?'selected':'')+'>'+y+'</option>').join('')+'</select></label>':'<p class="eam-method">النطاق النجمي محسوب بطريقة Lahiri المتوسطة؛ تُطرح قيمة الأيانامشا من المواقع الاستوائية وتُزاح معها رؤوس البيوت.</p>';
    content.innerHTML='<div class="eam-control"><div><span class="eam-kicker">'+esc(title)+'</span><p>'+esc(description)+'</p></div><div class="eam-controls">'+controls+'<button class="btn" type="button" id="eam-calculate">'+(mode==='transit'?'احسب العبور':mode==='solar'?'احسب العودة الشمسية':'اعرض الخريطة الفيدية')+'</button></div></div><p class="eam-status" id="eam-status" role="status" aria-live="polite"></p><div id="eam-result" class="eam-result" hidden></div>';
    $('#eam-now',content)?.addEventListener('click',()=>$('#eam-date',content).value=nowLocal());
    $('#eam-calculate',content)?.addEventListener('click',calculate);
  }
  function mapAspects(aspects){
    const kinds={conjunction:'conj',sextile:'sext',square:'sq',trine:'tri',opposition:'opp'};return aspects.map(a=>({a:mapKey(a.natal.key),b:mapKey(a.transit.key),asp:{k:kinds[a.key]||a.key,name:a.name},name:a.name,orb:a.orb,angle:Math.abs(delta(a.transit.lon,a.natal.lon))}));
  }
  function engineChart(utcMs,natal){
    return Astro.chart({utcMs,lat:natal.ch.lat,lon:natal.ch.lon,hs:['placidus','whole','equal','porphyry'].includes(natal.ch.hs)?natal.ch.hs:'placidus',known:!!natal.ch.known});
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
        result.hidden=false;result.innerHTML='<header class="eam-result-head"><span class="eam-kicker">Transit Chart · '+esc(dateStamp(date))+'</span><h3>العبور فوق خريطة الميلاد</h3><p class="eam-note">الحلقة الخارجية لمواضع العبور، والداخلية لمواضع الميلاد.</p></header><div class="eam-wheel" id="eam-wheel"></div>'+aspectLines(lines,'اتصالات العبور بخريطة الميلاد');
        window.AqeeqAstroWheel?.renderSynastryWheel($('#eam-wheel',result),natal.ch,t.chart,t.aspects);
        window.AqeeqGender?.apply(result,natal.gender);
        mountCopy(result,'خريطة العبور · '+dateStamp(date));
      }else if(mode==='solar'){
        const year=Number($('#eam-year',content).value),utc=solarReturnUtc(natal,year),ch=engineChart(utc,natal),aspects=chartAspects(ch);
        renderChart(result,'Solar Return · '+year,'العودة الشمسية للحظات عودة الشمس إلى موضع الميلاد',ch,'<p class="eam-note">لحظة العودة: '+esc(new Date(utc).toISOString().replace('T',' ').replace('Z',' UTC'))+'. البيوت محسوبة لمكان الميلاد المسجل.</p>',aspects);
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