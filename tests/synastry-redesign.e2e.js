const {chromium}=require('playwright');let f=0;const ok=(n,c)=>{console.log((c?'PASS ':'FAIL ')+n);if(!c)f++};
(async()=>{const b=await chromium.launch();
for(const [w,h] of [[1440,900],[390,844]]){const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html#compat');await p.waitForTimeout(800);
ok(w+' ids kept',await p.evaluate(()=>['cp1-name','cp1-gender','cp1-date','cp1-time','cp1-unknown','cp1-city','cp2-name','cp2-gender','cp2-date','cp2-time','cp2-unknown','cp2-city','cp-form','cp-out'].every(i=>document.getElementById(i))));
ok(w+' 4 feature cards',await p.locator('.cpx-feats li').count()===4);
ok(w+' no hscroll',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
ok(w+' fields inside cards',await p.evaluate(()=>[...document.querySelectorAll('#cp1 input,#cp2 input,#cp1 select,#cp2 select')].filter(e=>e.offsetParent).every(e=>{const r=e.getBoundingClientRect(),q=e.closest('fieldset').getBoundingClientRect();return r.left>=q.left-1&&r.right<=q.right+1})));
if(w>800){const a=await p.locator('#cp1').boundingBox(),c=await p.locator('#cp2').boundingBox();ok('side by side, first on right',Math.abs(a.y-c.y)<5&&a.x>c.x);}
await p.fill('#cp1-date','1990-05-14');await p.fill('#cp1-time','10:30');await p.fill('#cp2-date','1992-09-02');await p.check('#cp2-unknown');
ok(w+' unknown disables time',await p.isDisabled('#cp2-time'));
await p.click('#cp-form button[type=submit]');await p.waitForSelector('#cp-out:not([hidden]) .cp-res',{timeout:15000}).catch(()=>{});
ok(w+' result shown',await p.locator('#cp-out .cp-res').count()>0);
ok(w+' no errors',errs.length===0);await p.close();}
await b.close();process.exit(f?1:0)})();
