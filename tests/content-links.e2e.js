const {chromium}=require('playwright');let f=0,n=0;const ok=(c,m)=>{n++;if(!c)f++;console.log((c?'PASS ':'FAIL ')+m)};
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
const U='http://localhost:8765/index.html';
await p.goto(U+'#home',{waitUntil:'load'});await p.waitForTimeout(1800);
const r=await p.evaluate(()=>{const f=k=>{const l=AqeeqContentLinks.find(k);return l&&l.slug+'/'+l.kind};return [f('retrograde-mercury'),f('retrograde-saturn'),f('planet-mars'),f('nope-x')]});
ok(r[0]==='mercury-retrograde/exact','exact match');ok(r[1]==='mercury-retrograde/general','general fallback labelled');ok(r[2]==='mars-in-chart/exact','planet match');ok(r[3]===null,'no match -> null');
const g=await p.evaluate(()=>AqeeqContentLinks.find('retrograde-saturn').label);ok(/الدليل العام/.test(g),'fallback label says general guide');
for(const [k,t] of [['chart','العودة إلى الخريطة الفلكية'],['lifepath','العودة إلى مسار الحياة'],['matrix','العودة إلى مصفوفة القدر'],['sky','العودة إلى السماء'],['home','العودة إلى الرئيسية']]){
 await p.goto(U+'#featured-content/moon-phases?from='+k,{waitUntil:'load'});await p.waitForTimeout(1200);
 ok((await p.locator('[data-fc-back] span').innerText())===t,'back label '+k);
 await p.locator('[data-fc-back]').click();await p.waitForTimeout(300);ok((await p.evaluate(()=>location.hash))==={chart:'#chart',lifepath:'#lifepath',matrix:'#matrix',sky:'#sky',home:'#home'}[k],'back target '+k)}
await p.goto(U+'#featured-content/moon-phases',{waitUntil:'load'});await p.waitForTimeout(1200);
ok((await p.locator('[data-fc-back] span').innerText())==='رجوع إلى المحتوى المميز','default back');
ok(errs.length===0,'no js errors '+errs);console.log(n-f+' pass '+f+' fail');await b.close();process.exit(f?1:0)})()
