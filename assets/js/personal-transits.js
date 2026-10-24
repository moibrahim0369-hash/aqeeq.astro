/* Aqeeq Astro: client-side transit dashboard. Requires the site's Astro.chart() engine. */
(() => {
  'use strict';
  const SIGNS = ['الحمل','الثور','الجوزاء','السرطان','الأسد','العذراء','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'];
  const BODY_AR = {Sun:'الشمس',Moon:'القمر',Mercury:'عطارد',Venus:'الزهرة',Mars:'المريخ',Jupiter:'المشتري',Saturn:'زحل',Uranus:'أورانوس',Neptune:'نبتون',Pluto:'بلوتو',TrueNode:'العقدة الشمالية',Chiron:'كيرون',Asc:'الطالع',MC:'منتصف السماء'};
  const ASPECTS = [{deg:0,key:'conjunction',name:'اقتران',harm:false},{deg:60,key:'sextile',name:'تسديس',harm:true},{deg:90,key:'square',name:'تربيع',harm:false},{deg:120,key:'trine',name:'تثليث',harm:true},{deg:180,key:'opposition',name:'مقابلة',harm:false}];
  const norm = x => ((Number(x)%360)+360)%360;
  const delta = (a,b) => ((a-b+540)%360)-180;
  const signInfo = lon => ({name:SIGNS[Math.floor(norm(lon)/30)],degree:norm(lon)%30});
  const round1 = x => Math.round(x*10)/10;
  const siteAstro = () => (typeof Astro !== 'undefined' ? Astro : window.Astro);
  const fmtDeg = x => `${Math.floor(x)}°${String(Math.round((x%1)*60)%60).padStart(2,'0')}′`;
  const toDate = d => d instanceof Date ? d : new Date(d);
  function getChart(date, lat=30, lon=31) {
    const engine=siteAstro();
    if (!engine || typeof engine.chart !== 'function') throw new Error('تعذر العثور على محرك Astro.chart في الموقع.');
    return engine.chart({utcMs:date.getTime(),lat,lon,known:false});
  }
  function bodiesFromChart(chart) {
    const list = (chart?.bodies || []).map(b => ({key:b.key, name:BODY_AR[b.key] || b.name || b.key, lon:norm(b.lon), speed:Number(b.speed)||0, retro:!!b.retro}));
    return list;
  }
  // Meeus-style periodic true-node correction; useful for a live dashboard, not an ephemeris-grade node.
  function trueNodeApprox(date) {
    const jd=date.getTime()/86400000+2440587.5, T=(jd-2451545)/36525;
    const rad=Math.PI/180;
    const D=norm(297.85036+445267.111480*T-0.0019142*T*T+T*T*T/189474);
    const M=norm(357.52772+35999.050340*T-0.0001603*T*T-T*T*T/300000);
    const Mp=norm(134.96298+477198.867398*T+0.0086972*T*T+T*T*T/56250);
    const F=norm(93.27191+483202.017538*T-0.0036825*T*T+T*T*T/327270);
    const mean=125.04452-1934.136261*T+0.0020708*T*T+T*T*T/450000;
    const corr=-1.4979*Math.sin((2*D-2*F)*rad)-0.1500*Math.sin(M*rad)-0.1226*Math.sin(2*D*rad)+0.1176*Math.sin(2*F*rad)-0.0801*Math.sin((2*Mp-2*F)*rad);
    return norm(mean+corr);
  }
  // Approximate heliocentric two-body propagation from a JPL SBDB osculating-element snapshot.
  // Its age and omitted perturbations make Chiron materially less accurate than the planets.
  function chironApprox(date) {
    const epoch=2461200.5, jd=date.getTime()/86400000+2440587.5, dt=jd-epoch, rad=Math.PI/180;
    const a=13.68426761,e=0.37976563,i=6.93057447*rad,O=209.29612586131*rad,w=339.28783265897*rad;
    let M=(216.71989660181+0.01947026*dt)*rad; M=((M%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
    let E=M; for(let k=0;k<8;k++) E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));
    const x=a*(Math.cos(E)-e), y=a*Math.sqrt(1-e*e)*Math.sin(E);
    const cw=Math.cos(w),sw=Math.sin(w),cO=Math.cos(O),sO=Math.sin(O),ci=Math.cos(i),si=Math.sin(i);
    const X=(cO*cw-sO*sw*ci)*x+(-cO*sw-sO*cw*ci)*y;
    const Y=(sO*cw+cO*sw*ci)*x+(-sO*sw+cO*cw*ci)*y;
    const earth=window.Astronomy?.HelioVector?.(window.Astronomy.Body.Earth, new window.Astronomy.AstroTime(date));
    if(!earth) return null;
    // Convert ecliptic J2000 to equatorial J2000, subtract Earth, then recover ecliptic longitude.
    const eps=23.439291111*rad, ey=Y*Math.cos(eps), ez=Y*Math.sin(eps);
    const dx=X-earth.x, dy=ey-earth.y, dz=ez-earth.z;
    const eclY=dy*Math.cos(eps)+dz*Math.sin(eps);
    return norm(Math.atan2(eclY,dx)/rad);
  }
  function normalizeNatal(input) {
    return (input||[]).map(p=>({key:p.key||p.name,name:p.name||BODY_AR[p.key]||p.key,lon:norm(p.lon ?? p.longitude),speed:Number(p.speed)||0,retro:!!p.retro})).filter(p=>Number.isFinite(p.lon));
  }
  function calculateAspects(transits,natal,date) {
    natal=natal.filter(p=>!['Asc','MC'].includes(p.key));
    const later=new Date(date.getTime()+6*3600000), next=bodiesFromChart(getChart(later));
    next.push({key:'TrueNode',lon:trueNodeApprox(later)});
    const nextChiron=chironApprox(later);if(nextChiron!=null)next.push({key:'Chiron',lon:nextChiron});
    const nextByKey=new Map(next.map(p=>[p.key,p.lon]));
    const slow=new Set(['Jupiter','Saturn','Uranus','Neptune','Pluto','TrueNode','Chiron']);
    const out=[];
    for(const t of transits) for(const n of natal){
      const a=ASPECTS.map(x=>({...x,orb:Math.abs(Math.abs(delta(t.lon,n.lon))-x.deg)})).sort((x,y)=>x.orb-y.orb)[0];
      const limit=(t.key==='Sun'||t.key==='Moon'||n.key==='Sun'||n.key==='Moon')?5:3;
      if(a.orb>limit) continue;
      let state='Applying';
      const nowOrb=a.orb, futureT=nextByKey.get(t.key);
      if(futureT!=null){const fut=Math.abs(Math.abs(delta(futureT,n.lon))-a.deg);state=fut<nowOrb-0.005?'Applying':fut>nowOrb+0.005?'Separating':'Applying';}
      out.push({transit:t,natal:n,...a,state,exact:a.orb<1});
    }
    return out.sort((a,b)=>a.orb-b.orb);
  }
  function calculateTransits(natalPlanets,currentDate=new Date(),opts={}) {
    const date=toDate(currentDate); if(Number.isNaN(date.getTime())) throw new Error('التاريخ غير صالح.');
    const chart=getChart(date,opts.lat??30,opts.lon??31), transits=bodiesFromChart(chart);
    if(!transits.some(p=>p.key==='Moon')) throw new Error('لم يُرجع محرك الموقع مواقع الكواكب المطلوبة.');
    const later=new Date(date.getTime()+6*3600000), nodeLon=trueNodeApprox(date), nodeSpeed=delta(trueNodeApprox(later),nodeLon)/0.25;
    const node={key:'TrueNode',name:BODY_AR.TrueNode,lon:nodeLon,speed:nodeSpeed,retro:nodeSpeed<0,approximate:true};
    const chLon=chironApprox(date), chNext=chironApprox(later), chSpeed=chLon==null||chNext==null?0:delta(chNext,chLon)/0.25;
    if(chLon!=null) transits.push({key:'Chiron',name:BODY_AR.Chiron,lon:chLon,speed:chSpeed,retro:chSpeed<0,approximate:true});
    transits.push(node);
    const natal=normalizeNatal(natalPlanets), aspects=calculateAspects(transits,natal,date);
    let phaseAngle=null,illumination=null;
    if(window.Astronomy){try{phaseAngle=window.Astronomy.MoonPhase(new window.Astronomy.AstroTime(date)); illumination=window.Astronomy.Illumination(window.Astronomy.Body.Moon,new window.Astronomy.AstroTime(date)).phase_fraction;}catch(_){}}
    const moon=transits.find(p=>p.key==='Moon');
    return {date,transits,natal,aspects,moon:{...moon,...signInfo(moon.lon),phaseAngle,illumination:illumination==null?null:Math.round(illumination*100),phaseName:phaseAngle==null?'':phaseAngle<45?'هلال متزايد':phaseAngle<135?'تربيع أول':phaseAngle<225?'أحدب متزايد':phaseAngle<315?'بدر متناقص':'هلال متناقص'},chart};
  }
  const cardText = a => {
    const domain={Sun:'الهوية والاتجاه',Moon:'العاطفة والاحتياجات',Mercury:'التواصل والتفكير',Venus:'العلاقات والقيم',Mars:'الطاقة والمبادرة',Jupiter:'النمو والفرص',Saturn:'المسؤولية والحدود',Uranus:'التغيير والاستقلال',Neptune:'الخيال والحدس',Pluto:'التحول والعمق'}[a.transit.key]||'المجال الشخصي';
    return {domain,psych:a.harm?'قد يسهل هذا الاتصال الانسجام أو رؤية خيار جديد.':'قد يبرز توتراً أو حاجة إلى إعادة ضبط التوقعات.',advice:a.harm?'استثمر التوقيت في حوار واضح وخطوة عملية صغيرة.':'تأنّ قبل رد الفعل، وحدد ما يمكنك تغييره فعلاً.'};
  };
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function render(root,data,onDate){
    const {transits,natal,aspects,moon,date}=data;
    const cx=180,cy=180,R=150, inner=105;
    const angle=lon=>(norm(lon)-90)*Math.PI/180;
    const pt=(lon,r)=>({x:cx+r*Math.cos(angle(lon)),y:cy+r*Math.sin(angle(lon))});
    const natalPlanets=natal.filter(p=>!['Asc','MC'].includes(p.key));
    const selected=root.dataset.selected||'';
    const active=aspects.filter(a=>!selected||a.transit.key===selected);
    const lines=active.map(a=>{const p1=pt(a.transit.lon,R-14),p2=pt(a.natal.lon,inner+12); return `<line class="aqt-line ${a.harm?'harm':'hard'}" x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"/>`;}).join('');
    const transMarks=transits.map(p=>{const q=pt(p.lon,R-3);return `<g class="aqt-body transit ${selected&&selected!==p.key?'dim':''}" data-key="${esc(p.key)}" tabindex="0"><circle cx="${q.x}" cy="${q.y}" r="11"/><text x="${q.x}" y="${q.y+4}">${esc(({Sun:'☉',Moon:'☽',Mercury:'☿',Venus:'♀',Mars:'♂',Jupiter:'♃',Saturn:'♄',Uranus:'♅',Neptune:'♆',Pluto:'♇',TrueNode:'☊',Chiron:'⚷'})[p.key]||'•')}</text></g>`;}).join('');
    const natalMarks=natalPlanets.map(p=>{const q=pt(p.lon,inner);return `<g class="aqt-body natal"><circle cx="${q.x}" cy="${q.y}" r="9"/><text x="${q.x}" y="${q.y+4}">${esc(({Sun:'☉',Moon:'☽',Mercury:'☿',Venus:'♀',Mars:'♂',Jupiter:'♃',Saturn:'♄',Uranus:'♅',Neptune:'♆',Pluto:'♇'})[p.key]||'•')}</text></g>`;}).join('');
    const scores=weatherScores(data), top=aspects.slice(0,5);
    root.innerHTML=`<section class="aqt-shell" dir="rtl"><header class="aqt-head"><div><span class="aqt-kicker">عقيق أسترو · العبور الشخصي</span><h2>طقس السماء وخريطتك</h2><p>${date.toLocaleString('ar-SA',{dateStyle:'medium',timeStyle:'short'})}</p></div><div class="aqt-moon"><b>☾ ${moon.name}</b><span>${moon.name} ${fmtDeg(moon.degree)} · ${esc(moon.phaseName||'طور القمر')}</span><span>الإضاءة ${moon.illumination==null?'—':moon.illumination+'%'}</span></div></header>
      <div class="aqt-layout"><div class="aqt-wheelbox"><svg viewBox="0 0 360 360" role="img" aria-label="العجلة المزدوجة لخريطة الميلاد والعبور"><circle class="aqt-ring outer" cx="180" cy="180" r="150"/><circle class="aqt-ring" cx="180" cy="180" r="125"/><circle class="aqt-ring inner" cx="180" cy="180" r="105"/><circle class="aqt-ring" cx="180" cy="180" r="78"/>${SIGNS.map((s,i)=>`<text class="aqt-sign" x="180" y="37" transform="rotate(${i*30+15} 180 180)">${s.slice(0,1)}</text>`).join('')}${lines}${natalMarks}${transMarks}</svg><div class="aqt-tooltip" hidden></div><div class="aqt-legend"><span>● عابر</span><span>○ ميلاد</span><span>━ منسجم</span><span>━ ضاغط</span></div><div class="aqt-time"><button data-step="-1">− يوم</button><button data-step="0">اليوم</button><button data-step="1">+ يوم</button><button data-step="7">+ أسبوع</button></div></div>
      <aside class="aqt-weather"><h3>مؤشرات الطاقة</h3><p class="aqt-note">قراءة رمزية للتأمل، وليست قياساً علمياً للحالة النفسية.</p>${scores.map(s=>`<div class="aqt-score"><div><span>${s.name}</span><b>${s.value}%</b></div><i><em style="width:${s.value}%"></em></i></div>`).join('')}</aside></div>
      <div class="aqt-cards"><h3>العبورات الأبرز</h3>${top.length?top.map(a=>{const t=cardText(a);return `<article class="aqt-card"><b>عبور ${esc(a.transit.name)} ${a.name} ميلاد ${esc(a.natal.name)} <small>· أورب ${round1(a.orb)}°</small></b><div class="aqt-domain">${esc(t.domain)} · ${a.state==='Applying'?'متصل':'منفصل'}</div><p>${esc(t.psych)}</p><p><strong>خطوة عملية:</strong> ${esc(t.advice)}</p></article>`}).join(''):'<p class="aqt-note">لا توجد اتصالات ضمن الأورب المحدد الآن.</p>'}</div>
      <details class="aqt-matrix"><summary>جدول الاتصالات للمحللين (${aspects.length})</summary><div class="aqt-scroll"><table><thead><tr><th>العابر</th><th>حركته</th><th>الدرجة / البرج</th><th>الاتصال</th><th>كوكب الميلاد</th><th>الأورب</th><th>الحالة</th></tr></thead><tbody>${aspects.map(a=>{const s=signInfo(a.transit.lon);return `<tr><td>${esc(a.transit.name)}</td><td>${a.transit.retro?'R · تراجع':'أمامية'}</td><td>${fmtDeg(s.degree)} ${s.name}</td><td>${a.name}</td><td>${esc(a.natal.name)}</td><td>${fmtDeg(a.orb)}</td><td>${a.orb<1?'Exact':a.state==='Applying'?'App':'Sep'}</td></tr>`}).join('')}</tbody></table></div></details><footer class="aqt-foot">العقدة محسوبة بنموذج دوري تقريبي، وكيرون بتكامل مداري ثنائي الجسم من عناصر مدارية منشورة؛ قد تختلفان عن Swiss Ephemeris. بقية المواضع تعتمد محرك الموقع.</footer></section>`;
    const tip=root.querySelector('.aqt-tooltip');
    const show=g=>{if(!g)return;const k=g.dataset.key,p=transits.find(x=>x.key===k),s=signInfo(p.lon),aa=aspects.filter(a=>a.transit.key===k).slice(0,3);tip.hidden=false;tip.innerHTML=`<b>${esc(p.name)}</b> · ${s.name} ${fmtDeg(s.degree)}<br>${aa.length?aa.map(a=>`${a.name} ${esc(a.natal.name)} (${round1(a.orb)}°)`).join('<br>'):'لا اتصال ضمن الأورب'}`;};
    root.querySelectorAll('.aqt-body.transit').forEach(g=>{g.addEventListener('mouseenter',()=>show(g));g.addEventListener('focus',()=>show(g));g.addEventListener('mouseleave',()=>{tip.hidden=true});g.addEventListener('blur',()=>{tip.hidden=true});g.addEventListener('click',()=>{root.dataset.selected=root.dataset.selected===g.dataset.key?'':g.dataset.key;onDate(date,root.dataset.selected);});});
    root.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{const n=Number(b.dataset.step),d=n===0?new Date():new Date(date.getTime()+n*86400000);onDate(d,selected);}));
  }
  function weatherScores(d){
    const weighted=(keys)=>d.aspects.filter(a=>keys.includes(a.transit.key)).reduce((sum,a)=>sum+(a.harm?8:-9)*Math.max(0,1-a.orb/6),0);
    const phase=d.moon.illumination??50;
    return [{name:'الوضوح الذهني',value:clamp(60+weighted(['Mercury','Sun']))},{name:'التوازن العاطفي',value:clamp(52+weighted(['Moon','Venus'])+(phase>35&&phase<75?5:0))},{name:'الفعل والمبادرة',value:clamp(55+weighted(['Mars','Jupiter']))}];
  }
  const clamp=x=>Math.max(15,Math.min(95,Math.round(x)));
  function currentNatal(){
    const dt=document.querySelector('#f-date')?.value,tm=document.querySelector('#f-time')?.value||'12:00';
    if(!dt)return null;
    const [y,m,d]=dt.split('-').map(Number),[hh,mm]=tm.split(':').map(Number);
    const engine=siteAstro(), citySel=document.querySelector('#f-city'), manual=citySel?.value==='manual';
    let lat=30,lon=31,utc;
    if(manual){lat=Number(document.querySelector('#f-lat')?.value);lon=Number(document.querySelector('#f-lon')?.value);utc=Date.UTC(y,m-1,d,hh,mm)-(Number(document.querySelector('#f-off')?.value)||0)*3600000;}
    else {const cities=typeof CITIES!=='undefined'?CITIES:[],c=cities[Number(citySel?.value)]||cities[0];if(c){lat=c.lat;lon=c.lon;utc=engine.localToUtcMs(y,m,d,hh,mm,c.tz);}else utc=Date.UTC(y,m-1,d,hh,mm);}
    const known=!document.querySelector('#f-unknown')?.checked;
    const chart=engine.chart({utcMs:utc,lat,lon,hs:document.querySelector('#f-hs')?.value||'placidus',known}), bodies=bodiesFromChart(chart);
    if(chart.asc!=null)bodies.push({key:'Asc',name:BODY_AR.Asc,lon:norm(chart.asc),speed:0});
    if(chart.mc!=null)bodies.push({key:'MC',name:BODY_AR.MC,lon:norm(chart.mc),speed:0});
    return {bodies,lat,lon};
  }
  function mount(){
    const result=document.querySelector('#result'); if(!result||!siteAstro())return;
    const natal=currentNatal(); if(!natal)return;
    let host=result.querySelector('#aqeek-personal-transits');
    if(!host){host=document.createElement('div');host.id='aqeek-personal-transits';result.appendChild(host);}
    const renderAt=(date,selected='')=>{host.dataset.selected=selected;try{render(host,calculateTransits(natal.bodies,date,{lat:natal.lat,lon:natal.lon}),renderAt);}catch(e){host.innerHTML=`<p class="aqt-error">${esc(e.message)}</p>`;}};
    renderAt(new Date());
  }
  window.AqeqPersonalTransits={calculateTransits,calculateAspects,mount};
  const start=()=>{mount();const r=document.querySelector('#result');if(r)new MutationObserver(()=>mount()).observe(r,{childList:true,subtree:false});document.addEventListener('click',e=>{if(e.target.closest('#result button[type="submit"],#result .recalc'))setTimeout(mount,0);});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

