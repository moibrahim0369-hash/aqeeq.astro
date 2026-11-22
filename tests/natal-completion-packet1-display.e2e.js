'use strict';
const {chromium}=require(process.env.PLAYWRIGHT_CORE_PATH||'playwright'),{spawn}=require('child_process'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),base='http://127.0.0.1:8793';
const normalize=s=>String(s||'').replace(/\*\*(.*?)\*\*/g,'$1').replace(/^#{1,6}\s+/gm,'').replace(/\s+/g,' ').trim();
(async()=>{const s=spawn('python3',['-m','http.server','8793','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const results=[];try{
for(const width of [390,1440])for(const known of [true,false]){
 const p=await b.newPage({viewport:{width,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>localStorage.setItem('aq-fr-seen-v1','1'));await p.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());await p.goto(base+'/index.html#chart');await p.waitForFunction(()=>window.AqeeqChartContext);await p.fill('#f-date','1999-09-25');if(known)await p.fill('#f-time','12:00');else await p.check('#f-unknown');await p.click('#cform button[type=submit]');await p.waitForSelector('.il-reference-list',{state:'attached',timeout:30000});await p.click('[data-nd-tab=planets]');
 let checked=0;for(const [body,label]of [['mercury','عطارد'],['mars','المريخ'],['jupiter','المشتري']]){
  await p.locator('[data-nd-panel=planets] .nd-row').filter({has:p.locator('b',{hasText:label})}).first().click();await p.waitForSelector('.ndr-sheet:not([hidden])');
  const entries=await p.locator('.ndr-sheet .il-entry').evaluateAll(es=>es.map(e=>({id:e.dataset.ilId,text:e.innerText})));const signEntries=entries.filter(e=>e.id.startsWith('natal.sign_only.'+body+'.'));assert.equal(signEntries.length,1);const source=JSON.parse(fs.readFileSync(root+'/data/interpretations/'+body+'.json'));for(const e of entries.filter(e=>e.id.startsWith('natal.sign_only.'+body+'.')||e.id==='natal.modifier.'+body+'.retrograde')){const row=source.find(r=>r.id===e.id);assert(normalize(e.text).includes(normalize(row.text)),e.id+' lost full body in actual sheet');assert(e.text.includes(row.title));checked++;}
  if(!known)assert(!entries.some(e=>e.id.startsWith('natal.core.')));
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if((width===390&&!known&&body==='mercury')||(width===1440&&known&&body==='jupiter')){await p.locator('.ndr-sheet .aqm-sheet-panel').evaluate(e=>Promise.all(e.getAnimations().map(a=>a.finished.catch(()=>{}))));await p.screenshot({path:(process.env.NATAL_SCREENSHOT_DIR||require('os').tmpdir())+'/natal-packet1-'+body+'-'+(known?'known':'unknown')+'-'+width+'.png'});}
  await p.locator('.ndr-sheet .aqm-foot-close').click();await p.waitForSelector('.ndr-sheet[hidden]',{state:'attached'});
 }
 assert.deepEqual(errors,[]);results.push({width,known,checked,errors});await p.close();console.log('PASS actual bundled packet1 sheets '+width+' '+(known?'known':'unknown')+':'+checked+' complete sign/retrograde bodies; no overflow/errors');
}
fs.writeFileSync((process.env.NATAL_SCREENSHOT_DIR||require('os').tmpdir())+'/natal-completion-packet1-ui-verification.json',JSON.stringify({publication:'LOCAL_ONLY',actual_birth_fixture:'1999-09-25T12:00 Cairo, plus unknown time',results},null,2));
}finally{await b.close();s.kill();}})().catch(e=>{console.error(e);process.exitCode=1});
