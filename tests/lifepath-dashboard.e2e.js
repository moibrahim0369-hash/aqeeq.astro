const {chromium}=require('playwright');let f=0;const ok=(n,c)=>{console.log((c?'PASS ':'FAIL ')+n);if(!c)f++};
(async()=>{const b=await chromium.launch();const vals={};
for(const d of ['1990-05-14','1984-11-27','2001-03-03']){const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html#lifepath');await p.fill('#lp-date',d);await p.click('#lpform button[type=submit]');
await p.waitForSelector('.lpd-chips');await p.waitForTimeout(800);
vals[d]=await p.$$eval('.lpj-row .v',e=>e.map(x=>x.textContent).join(','));
ok(d+' sections',await p.locator('.lpd-tri').count()===0&&await p.locator('.lpd-jr').count()===0&&await p.locator('.lpd-tabs button').count()===4);
await p.click('[data-lpd-tab=tm]');ok(d+' timing tab',await p.isVisible('.lpd-scale'));
ok(d+' no errors',errs.length===0);await p.close();}
ok('percentages differ per birth date',new Set(Object.values(vals)).size===3);
await b.close();process.exit(f?1:0)})();
