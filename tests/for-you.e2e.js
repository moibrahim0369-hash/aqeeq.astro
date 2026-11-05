const {chromium}=require('playwright');let f=0;const ok=(n,c)=>{console.log((c?'PASS ':'FAIL ')+n);if(!c)f++};
const U='http://127.0.0.1:8765/index.html';
(async()=>{const b=await chromium.launch();
for(const [w,h] of [[1280,900],[390,844]]){
let p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(U+'#for-you');await p.waitForTimeout(1200);
ok(w+' guest: ivory welcome card',await p.locator('#fy-body .fy-welcome').count()===1&&await p.locator('.fy-daily').count()===0);
await p.close();
p=await b.newPage({viewport:{width:w,height:h}});p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>localStorage.setItem('aqeeq_profile_cache_v1',JSON.stringify({name:'م',date:'1990-05-12',time:'14:30',noTime:false,city:'القاهرة',country:'مصر'})));
await p.goto(U+'#for-you');await p.waitForTimeout(1500);
ok(w+' saved data: daily card prefilled',await p.locator('.fy-daily h3').innerText()==='رسالة يومك النفسية');
ok(w+' pattern card + badge',await p.locator('.fy-pattern h3').innerText()==='تذكير بنمطك النفسي'&&/القمر في/.test(await p.locator('.fy-pattern .fy-badge').innerText()));
ok(w+' transits carousel 6 cards, each paywall',await p.locator('.fy-track .fy-tr').count()===6&&await p.locator('.fy-track .fy-lock-btn').count()===6);
ok(w+' paywall button text + href',await p.evaluate(()=>{const a=document.querySelector('.fy-lock-btn');return a.textContent.includes('افتح قراءة العبور الكاملة وخريطة التحرر')&&a.getAttribute('href')==='#pay'}));
ok(w+' carousel scrollable',await p.evaluate(()=>{const t=document.querySelector('.fy-track');return getComputedStyle(t).overflowX==='auto'&&t.scrollWidth>t.clientWidth}));
ok(w+' no body hscroll',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
ok(w+' footer clone at end',await p.locator('#for-you > footer.sec-foot').count()===1);
if(w<500)ok('mobile bottom padding 90px',await p.evaluate(()=>parseFloat(getComputedStyle(document.querySelector('#for-you > footer.sec-foot')).paddingBottom)>=90));
ok(w+' nav: menu + sheet links',await p.locator('.aqh-drop-menu a[href="#for-you"]').count()===1&&await p.locator('.aqn-grid a[href="#for-you"]').count()===1);
await p.goto(U+'#sky');await p.waitForTimeout(1200);
ok(w+' sky CTA to #for-you',await p.evaluate(()=>{const a=document.querySelector('#sky-panel .sky-cta a');return !!a&&a.getAttribute('href')==='#for-you'&&/طقس السماء/.test(document.querySelector('.sky-cta p').textContent)}));
for(const id of ['matrix','lifepath','compat'])ok(w+' seo block in '+id,await p.evaluate(i=>{const s=document.getElementById(i),b=s.querySelector('.seo-authority-block');return !!b&&b.textContent.length>300},id));
ok(w+' no errors',errs.length===0);await p.close();}
await b.close();process.exit(f?1:0)})();
