const {chromium}=require('playwright');let f=0;const ok=(n,c)=>{console.log((c?'PASS ':'FAIL ')+n);if(!c)f++};
(async()=>{const b=await chromium.launch();
for(const [w,h] of [[1440,900],[390,844]]){const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html#life-path-synastry');await p.waitForTimeout(800);
ok(w+' ids kept',await p.evaluate(()=>['syn-name-a','syn-gender-a','syn-date-a','syn-name-b','syn-gender-b','syn-date-b','syn-type','synastry-form','syn-result'].every(i=>document.getElementById(i))));
ok(w+' relation options kept',await p.locator('#syn-type option').count()===3&&await p.inputValue('#syn-type')==='romantic');
ok(w+' compat lives inside life path tab',await p.evaluate(()=>!!document.querySelector('#lifepath #lpcompat #synastry-form')&&!document.getElementById('life-path-synastry')));
ok(w+' no hscroll',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
if(w>800){const a=await p.locator('.syn-person').nth(0).boundingBox(),c=await p.locator('.syn-person').nth(1).boundingBox();ok('side by side, first on right',Math.abs(a.y-c.y)<5&&a.x>c.x);}
await p.fill('#syn-name-a','أ');await p.fill('#syn-name-b','ب');await p.fill('#syn-date-a','1990-05-14');await p.fill('#syn-date-b','1992-09-02');await p.selectOption('#syn-type','family');
await p.click('#synastry-form button[type=submit]');await p.waitForFunction(()=>{const r=document.getElementById('syn-result');return r&&!r.hidden&&r.textContent.trim().length>50},{timeout:10000}).catch(()=>{});
ok(w+' result shown',await p.evaluate(()=>{const r=document.getElementById('syn-result');return !r.hidden&&r.textContent.trim().length>50}));
ok(w+' no errors',errs.length===0);await p.close();}
await b.close();process.exit(f?1:0)})();
