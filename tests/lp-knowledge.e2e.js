const {chromium}=require('playwright');let f=0;const ok=(n,c)=>{console.log((c?'PASS ':'FAIL ')+n);if(!c)f++};
(async()=>{const b=await chromium.launch();
for(const [w,h] of [[1280,900],[390,844]]){
const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://127.0.0.1:8765/index.html#lifepath');await p.waitForTimeout(1000);
ok(w+' two knowledge blocks',await p.locator('#lifepath .lpk-in').count()===2);
ok(w+' big title + quote',await p.evaluate(()=>{const h=document.getElementById('lpk-h1');return parseFloat(getComputedStyle(h).fontSize)>=27&&!!document.querySelector('.lpk blockquote')}));
ok(w+' first accordion open per group',await p.evaluate(()=>[...document.querySelectorAll('.lpk-in')].every(g=>{const a=[...g.querySelectorAll('.lpk-acc')];return a[0].open&&a.slice(1).every(x=>!x.open)})));
ok(w+' no hscroll',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
if(w<500)ok('mobile single column',await p.evaluate(()=>[...document.querySelectorAll('.lpk-cards,.lpk-nums,.lpk-vs-row')].every(e=>getComputedStyle(e).flexDirection==='column')));
await p.evaluate(()=>document.querySelector('[data-lp-cta]').click());await p.waitForTimeout(900);
ok(w+' CTA returns to form',await p.evaluate(()=>document.getElementById('lifepath').scrollTop<80));
ok(w+' no errors',errs.length===0);await p.close()}
await b.close();process.exit(f?1:0)})();
