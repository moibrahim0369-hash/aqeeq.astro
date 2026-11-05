const {chromium}=require('playwright');let f=0;const ok=(n,c)=>{console.log((c?'PASS ':'FAIL ')+n);if(!c)f++};
const U='http://127.0.0.1:8765/index.html';
(async()=>{const b=await chromium.launch();
for(const [w,h] of [[1280,900],[390,844]]){
const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>localStorage.setItem('aqeeq_profile_cache_v1',JSON.stringify({name:'م',date:'1990-05-12',time:'14:30',noTime:false,city:'القاهرة',country:'مصر'})));
await p.goto(U+'#for-you');await p.waitForTimeout(1500);
await p.evaluate(()=>document.querySelector('.fy-lock-btn').click());await p.waitForTimeout(400);
ok(w+' opens on lock button, stays on #for-you',await p.evaluate(()=>!document.querySelector('.pwm').hidden&&location.hash==='#for-you'));
ok(w+' title + dynamic context',await p.evaluate(()=>/ارتقِ بوعيك مع عقيق أسترو بلس/.test(document.getElementById('pwm-h').textContent)&&/^افتح قراءة: عبور .* في بيتك/.test(document.getElementById('pwm-ctx').textContent)));
ok(w+' 4 features, 2 plans, annual default',await p.evaluate(()=>document.querySelectorAll('.pwm-feats li').length===4&&document.querySelectorAll('.pwm-plan').length===2&&document.querySelector('input[value=annual]').checked));
ok(w+' annual flag + CTA text',await p.evaluate(()=>/خصم 40% - الأكثر طلباً/.test(document.querySelector('.pwm-flag').textContent)&&document.getElementById('pwm-cta').textContent==='تأكيد الاشتراك وبدء رحلتك الآن'));
ok(w+' container style',await p.evaluate(()=>{const s=getComputedStyle(document.querySelector('.pwm-box'));return s.backgroundColor==='rgb(253, 251, 247)'&&s.borderRadius==='20px'&&parseFloat(s.maxHeight)>0&&s.overflowY==='auto'}));
ok(w+' backdrop blur',await p.evaluate(()=>{const s=getComputedStyle(document.querySelector('.pwm'));return /blur/.test(s.backdropFilter||s.webkitBackdropFilter)&&s.backgroundColor==='rgba(44, 37, 35, 0.6)'}));
ok(w+' box fits viewport',await p.evaluate(()=>{const r=document.querySelector('.pwm-box').getBoundingClientRect();return r.width<=Math.min(540,innerWidth*0.921)&&r.height<=innerHeight*0.901&&document.documentElement.scrollWidth<=innerWidth}));
await p.click('input[value=monthly]',{force:true}).catch(()=>{});await p.evaluate(()=>document.querySelector('input[value=monthly]').click());
ok(w+' plan switch',await p.evaluate(()=>document.querySelector('input[value=monthly]').checked&&document.querySelectorAll('.pwm-plan.is-on').length===1));
await p.keyboard.press('Escape');await p.waitForTimeout(350);
ok(w+' Escape closes',await p.evaluate(()=>document.querySelector('.pwm').hidden));
await p.evaluate(()=>window.openPaywallModal('عبور زحل في بيتك السابع'));await p.waitForTimeout(300);
ok(w+' context api',await p.evaluate(()=>document.getElementById('pwm-ctx').textContent==='افتح قراءة: عبور زحل في بيتك السابع'));
await p.mouse.click(5,5);await p.waitForTimeout(350);
ok(w+' backdrop click closes',await p.evaluate(()=>document.querySelector('.pwm').hidden));
await p.evaluate(()=>window.openPaywallModal('x'));await p.waitForTimeout(300);await p.click('.pwm-x');await p.waitForTimeout(350);
ok(w+' x closes + scroll unlocked',await p.evaluate(()=>document.querySelector('.pwm').hidden&&!document.documentElement.classList.contains('pwm-lock')));
await p.evaluate(()=>window.openPaywallModal('y'));await p.waitForTimeout(300);
await p.evaluate(()=>document.getElementById('pwm-cta').click());await p.waitForTimeout(400);
ok(w+' CTA stores plan and goes to pay',await p.evaluate(()=>sessionStorage.getItem('aq-plus-plan')==='annual'&&location.hash==='#pay'&&document.querySelector('.pwm').hidden));
await p.screenshot({path:`/tmp/claude-0/pw${w}.png`});
/* شارة قراءة متعمقة */
await p.evaluate(()=>{const s=document.createElement('span');s.className='lpa-badge is-deep';s.innerHTML='قراءة متعمقة';const b=document.createElement('b');b.textContent='فصل تجريبي ';b.appendChild(s);document.body.appendChild(b);s.click()});await p.waitForTimeout(300);
ok(w+' deep badge opens',await p.evaluate(()=>!document.querySelector('.pwm').hidden&&/فصل تجريبي/.test(document.getElementById('pwm-ctx').textContent)));
ok(w+' no errors',errs.length===0);await p.close();}
await b.close();process.exit(f?1:0)})();
