const {chromium}=require('playwright');let f=0;const ok=(n,c)=>{console.log((c?'PASS ':'FAIL ')+n);if(!c)f++};
const U='http://127.0.0.1:8765/index.html';
(async()=>{const b=await chromium.launch();
for(const [w,h] of [[1280,900],[390,844]]){
const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{localStorage.removeItem('aq-sky-sign');localStorage.setItem('aqeeq_profile_cache_v1',JSON.stringify({name:'م',date:'1990-05-12',time:'14:30',noTime:false,city:'القاهرة',country:'مصر'}))});
/* مرصد السماء */
await p.goto(U+'#sky');await p.waitForTimeout(1500);
ok(w+' sky: 12 sign buttons, no 12-card dump',await p.locator('#sky-panel .sky-sg').count()===12&&await p.locator('#sky-panel .sky-card').count()===0);
await p.evaluate(()=>document.querySelectorAll('#sky-panel .sky-sg')[4].click());
ok(w+' sky: one card after pick',await p.locator('#sky-panel .sky-card').count()===1);
await p.evaluate(()=>document.querySelectorAll('#sky-panel .sky-sg')[7].click());
ok(w+' sky: switching keeps one card',await p.locator('#sky-panel .sky-card').count()===1&&await p.locator('#sky-panel .sky-sg.is-on').count()===1);
ok(w+' sky: aspects as accordion',await p.locator('#sky-asp details.lpa-card').count()>0);
ok(w+' sky: footer at page end',await p.evaluate(()=>{const s=document.getElementById('sky'),f=s.querySelector(':scope > footer.sec-foot');return !!f&&f.getBoundingClientRect().bottom+s.scrollTop>=s.scrollHeight-120&&f.offsetHeight>50}));
ok(w+' sky: no body hscroll',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
ok(w+' sky: chips carousel scrolls',await p.evaluate(()=>{const c=document.getElementById('sky-chips');return getComputedStyle(c).overflowX==='auto'||innerWidth>=900}));
/* الأبراج */
await p.goto(U+'#signs');await p.waitForTimeout(1200);
await p.evaluate(()=>document.querySelector('#picker button').click());await p.waitForTimeout(500);
ok(w+' signs: accordions for day energy/retro',await p.locator('#panel .zd-daily details.lpa-card').count()>=1&&await p.locator('#panel .zp-trs details.lpa-card').count()>=5);
ok(w+' signs: advice in accordion',await p.locator('#panel .zd-stack details.lpa-card').count()>=3);
const bad=await p.evaluate(()=>{const lum=c=>{const m=c.match(/\d+(\.\d+)?/g).map(Number);return(.299*m[0]+.587*m[1]+.114*m[2])};return [...document.querySelectorAll('#panel .zd-acc summary .lpa-t,#panel .zd-acc .lpa-body p,#panel .zd-acc .lpa-body li,#signs #period')].filter(e=>e.offsetParent&&lum(getComputedStyle(e).color)>150).length});
ok(w+' signs: no pale text',bad===0);
ok(w+' signs: picker cards ivory 14px, wine glyph',await p.evaluate(()=>{const b=document.querySelectorAll('#signs .picker button')[5],s=getComputedStyle(b);return s.borderRadius==='14px'&&/gradient/.test(s.backgroundImage)&&/106, ?42, ?60/.test(getComputedStyle(b.querySelector('.sg')).color)}));
/* الخرائط المتقدمة */
await p.goto(U+'#astro-maps');await p.waitForTimeout(1500);
ok(w+' maps: ivory background',await p.evaluate(()=>/253, ?251, ?247/.test(getComputedStyle(document.getElementById('astro-maps')).backgroundColor)));
ok(w+' maps: prefilled from saved profile (controls visible)',await p.locator('#eam-content .eam-control').count()>0);
await p.close();
const q=await b.newPage({viewport:{width:w,height:h}});
await q.goto(U+'#astro-maps');await q.waitForTimeout(1200);
ok(w+' maps: invite card with gold border when no data',await q.evaluate(()=>{const e=document.querySelector('#eam-content .eam-invite');return !!e&&/197, ?160, ?89/.test(getComputedStyle(e).borderTopColor)}));
ok(w+' no errors',errs.length===0);await q.close();
/* التوافق */
const c=await b.newPage({viewport:{width:w,height:h}});
await c.goto(U+'#compat');await c.waitForTimeout(1000);
await c.fill('#cp1-name','محمد');await c.fill('#cp2-name','سارة');await c.fill('#cp1-date','1990-05-14');await c.fill('#cp1-time','10:30');await c.fill('#cp2-date','1992-09-02');await c.fill('#cp2-time','08:15');
await c.evaluate(()=>document.querySelector('#cp-form button[type=submit]').click());await c.waitForSelector('#cp-out:not([hidden]) .cp-res',{timeout:15000});
ok(w+' wheel: hub shows both names',await c.evaluate(()=>{const t=[...document.querySelectorAll('#cp-bi-wheel .aq-wheel-hub-name')].map(x=>x.textContent);return t.join('|')==='محمد|سارة'&&!/SYNASTRY/.test(document.getElementById('cp-bi-wheel').textContent)}));
ok(w+' wheel: person colors',await c.evaluate(()=>{const a=getComputedStyle(document.querySelector('#cp-bi-wheel .person-a .aq-wheel-planet-glyph')).fill,b2=getComputedStyle(document.querySelector('#cp-bi-wheel .person-b .aq-wheel-planet-glyph')).fill;return a==='rgb(74, 21, 33)'&&b2==='rgb(158, 120, 47)'}));
ok(w+' wheel: gold frame + ivory disc',await c.evaluate(()=>{const e=getComputedStyle(document.querySelector('#cp-bi-wheel circle.aq-wheel-border'));return e.stroke==='rgb(197, 160, 89)'&&e.fill==='rgb(253, 251, 247)'}));
ok(w+' wheel: harmony gold / challenge crimson',await c.evaluate(()=>{const h=document.querySelector('#cp-bi-wheel .aq-wheel-aspect.harmonious'),k=document.querySelector('#cp-bi-wheel .aq-wheel-aspect.challenging');return (!h||getComputedStyle(h).stroke==='rgb(197, 160, 89)')&&(!k||getComputedStyle(k).stroke==='rgb(179, 38, 62)')}));
ok(w+' results: ivory accordions',await c.locator('#cp-out .cp-details-stack details.lpa-card').count()>=4);
ok(w+' compat: input form collapsed + edit button',await c.evaluate(()=>document.getElementById('cp-form').hidden&&!!document.getElementById('btn-edit-cp')));
ok(w+' compat: no hscroll',await c.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await c.close();}
await b.close();process.exit(f?1:0)})();
