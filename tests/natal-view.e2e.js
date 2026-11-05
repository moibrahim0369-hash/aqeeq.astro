const {chromium}=require('playwright');let f=0,n=0;const ok=(c,m)=>{n++;if(!c)f++;console.log((c?'PASS ':'FAIL ')+m)};
(async()=>{const b=await chromium.launch();
for(const [name,w] of [['desktop',1280],['mobile',390]]){
const p=await b.newPage({viewport:{width:w,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html#chart');await p.waitForTimeout(1200);
await p.fill('#f-date','1992-05-12');await p.fill('#f-time','20:45');await p.selectOption('#f-city','0');
await p.click('#cform button[type=submit]');await p.waitForSelector('#result .wheel-wrap',{state:'attached'});await p.waitForTimeout(1500);await p.evaluate(()=>{var d=document.querySelector('.nd-more');if(d)d.open=true});await p.waitForTimeout(300);
ok(await p.locator('.nv-crumb').count()===1,name+' breadcrumb');
ok(await p.locator('.nv-birth').count()===1,name+' birth details');
ok(await p.locator('.nv-related li').count()>0,name+' related links');
ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+' no h-scroll');
await p.locator('#result .pg[data-kind=planet]').first().dispatchEvent('click');await p.waitForTimeout(500);
ok(await p.locator('#wd-panel.nv-sheet').isVisible(),name+' panel opens as sheet');
ok(await p.locator('.nv-pl-link').count()===1,name+' panel article link');
await p.keyboard.press('Escape');await p.waitForTimeout(300);
ok(await p.evaluate(()=>document.getElementById('wd-panel').hidden),name+' Escape closes');
await p.locator('#result .pg[data-kind=planet]').nth(1).dispatchEvent('click');await p.waitForTimeout(400);
await p.locator('.nv-ov').click({position:{x:5,y:5},force:true});await p.waitForTimeout(300);
ok(await p.evaluate(()=>document.getElementById('wd-panel').hidden),name+' overlay closes');
await p.click('#btn-edit-chart').catch(()=>{});await p.waitForTimeout(300);
await p.fill('#f-date','1990-01-01');await p.evaluate(()=>document.querySelector('#cform').requestSubmit());await p.waitForSelector('#result .wheel-wrap',{state:'attached'});await p.waitForTimeout(1200);await p.evaluate(()=>{var d=document.querySelector('.nd-more');if(d)d.open=true});await p.waitForTimeout(300);
ok(await p.locator('body > #wd-panel').count()===0,name+' no stale panel after re-render');
ok(errs.length===0,name+' no js errors '+errs);await p.close()}
console.log(n-f+' pass '+f+' fail');await b.close();process.exit(f?1:0)})()
