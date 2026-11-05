const {chromium}=require('playwright');const BASE='http://127.0.0.1:8765';let f=0;const ok=(n,c)=>{console.log((c?'PASS ':'FAIL ')+n);if(!c)f++};
(async()=>{const b=await chromium.launch();
for(const [w,h] of [[1280,800],[390,844]]){
const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>r.request().url().startsWith(BASE)?r.continue():r.abort());
await p.goto(BASE+'/index.html#invest');await p.waitForTimeout(500);
ok(w+' page opens standalone',await p.evaluate(()=>getComputedStyle(document.getElementById('invest')).position==='fixed'));
ok(w+' 3 offers + 4 steps',await p.locator('.inv-card').count()===3&&await p.locator('.inv-steps li').count()===4);
ok(w+' signed-out buy -> account',await p.evaluate(()=>{document.querySelector('[data-invest-buy]').click();return true})&&await p.waitForFunction(()=>location.hash==='#account',{timeout:3000}).then(()=>true,()=>false));
ok(w+' no hscroll',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
ok(w+' no errors',errs.length===0);await p.close();}
await b.close();process.exit(f?1:0)})();
