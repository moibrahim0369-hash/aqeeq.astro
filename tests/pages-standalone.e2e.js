// كل قسم ظاهر يُفتح كصفحة مستقلة: ثابت فوق الموقع، يبدأ من الأعلى، قابل للتمرير، بلا تمرير أفقي، بلا أخطاء.
const {chromium}=require('playwright');const BASE='http://127.0.0.1:8765';let f=0;
(async()=>{const b=await chromium.launch();
const p0=await b.newPage();await p0.route('**/*',r=>r.request().url().startsWith(BASE)?r.continue():r.abort());await p0.goto(BASE+'/index.html');
const ids=await p0.evaluate(()=>[...document.querySelectorAll('section.sec[id]')].filter(s=>!s.classList.contains('hidden-feature')&&s.getAttribute('style')!==null?false:true).map(s=>s.id));await p0.close();
let tested=0;
for(const [w,h,mobile] of [[390,844,true],[1280,800,false]]){
for(const id of ids){
const p=await b.newPage({viewport:{width:w,height:h},isMobile:mobile,hasTouch:mobile});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>r.request().url().startsWith(BASE)?r.continue():r.abort());
await p.goto(BASE+'/index.html#'+id);await p.waitForTimeout(500);
const r=await p.evaluate((id)=>{const s=document.getElementById(id),c=getComputedStyle(s);if(c.display==='none')return {skip:true};
 s.scrollTop=250;const moved=s.scrollTop>0||s.scrollHeight<=s.clientHeight+2;
 return {pos:c.position,top:Math.round(s.getBoundingClientRect().top),ox:c.overflowX,moved,bodyLocked:getComputedStyle(document.documentElement).overflow==='hidden'}},id);
if(r.skip){await p.close();continue}tested++;
const ok=r.pos==='fixed'&&r.top===0&&r.ox==='hidden'&&r.moved&&r.bodyLocked&&errs.length===0;
if(!ok){f++;console.log('FAIL',w,id,JSON.stringify(r),errs.slice(0,2))}await p.close();}}
console.log((f?'FAIL':'PASS')+' standalone pages ('+tested+' checks)');await b.close();process.exit(f?1:0)})();
