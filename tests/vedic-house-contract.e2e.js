'use strict';
const {chromium}=require('/usr/share/code/resources/app/node_modules/playwright-core');
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict'),path=require('node:path');
const base=process.env.BASE_URL||'http://127.0.0.1:8779',root=path.join(__dirname,'..');
(async()=>{let server,browser;try{
 if(!process.env.BASE_URL){server=spawn('python3',['-m','http.server','8779','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});for(let i=0;i<40;i++){try{if((await fetch(base)).ok)break;}catch(_){}await new Promise(r=>setTimeout(r,100));}}
 browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>r.request().url().startsWith(base)||r.request().url().startsWith('data:')?r.continue():r.abort());
 await page.goto(base+'/index.html#astro-maps');await page.waitForFunction(()=>window.AqEam&&window.AqVedicChart&&window.AqeeqChartContext);
 for(const config of [{hs:'placidus',known:true},{hs:'equal',known:true},{hs:'porphyry',known:true},{hs:'whole',known:true},{hs:'placidus',known:true,lat:80,expected:'whole-fallback'},{hs:'whole',known:false}]){
  const {hs,known}=config;
  await page.evaluate(config=>{
   const {hs,known}=config;
   const C=window.AqeeqChartContext;
   const n=C.setFromInput({name:'اختبار البيوت',y:2000,m:1,d:1,hh:12,mm:0,known:true,cityIdx:C.cityIndexByName('القاهرة')});
   n.ch=Astro.chart({utcMs:Date.parse('2000-01-01T10:00:00Z'),lat:config.lat||30,lon:31,known,hs});
   document.querySelector('[data-eam-mode="sidereal"]').click();document.querySelector('#eam-calculate').click();
  },config);
  await page.waitForFunction(config=>window.AqVedic.last?.ch.known===config.known&&(!config.known||window.AqVedic.last.ch.hs===(config.expected||config.hs))&&document.querySelector('#eam-calculate')?.disabled===false,config);
  const report=await page.evaluate(()=>{
   const L=AqVedic.last,ch=L.ch,natal=L.natal,A=Astro;
   const d1=AqVedicChart.build(ch,1),sg=Math.floor(ch.asc/30),norm=x=>((x%360)+360)%360;
   const table=[...document.querySelectorAll('#eam-result table')].find(t=>t.querySelector('thead')?.textContent.includes('الحركة'));
   return {known:ch.known,hs:ch.hs,cusps:ch.cusps,asc:ch.asc,table:table?.innerText,tableVisible:!!(table&&table.getBoundingClientRect().height),
    bodies:ch.bodies.map(b=>({key:b.key,sign:b.sign,house:b.house,cuspHouse:ch.known?A.houseOf(b.lon,ch.cusps):null,wholeHouse:(Math.floor(b.lon/30)-sg+12)%12+1,natalHouse:natal.ch.bodies.find(x=>x.key===b.key).house})),
    d1:d1.items.map(b=>({key:b.key,house:b.house+1,sign:b.sign})),
    rows:table?[...table.querySelectorAll('tbody tr')].map(r=>[...r.children].map(c=>c.textContent.trim())):[]};
  });
  console.log('HOUSE AUDIT',JSON.stringify({known:report.known,hs:report.hs,cusps:report.cusps,rows:report.rows}));
  assert.ok(report.rows.length>8,'actual general chart table populated');
  if(!known){assert.ok(report.bodies.every(b=>b.house==null));assert.ok(report.rows.every(r=>r[2]==='غير محدد'));continue;}
  assert.ok(report.bodies.every(b=>b.house===b.cuspHouse),'body.house matches current cusp geometry');
  assert.ok(report.bodies.every(b=>b.sign>=0&&b.sign<12));
  if(report.hs==='whole'||report.hs==='whole-fallback'){
   assert.ok(report.cusps.every(x=>Math.abs(x/30-Math.round(x/30))<1e-8),'sidereal whole-sign cusps use sign boundaries');
   assert.ok(report.bodies.every(b=>b.house===b.wholeHouse),'whole-sign body.house matches sidereal signs');
   for(const b of report.d1){const body=report.bodies.find(x=>x.key===b.key);if(body)assert.equal(b.house,body.house,'D1 agrees for '+b.key);}
   const rows=report.rows;
   assert.equal(rows.find(r=>r[0].includes('المريخ'))[2],'البيت '+report.bodies.find(b=>b.key==='mars').house);
   await page.evaluate(()=>{window.__houseCopy='';Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async t=>{window.__houseCopy=t;}}});document.querySelector('#eam-result > .aq-copy-map-btn').click();});
   const copied=await page.evaluate(()=>window.__houseCopy);
   assert.ok(copied.includes(rows.find(r=>r[0].includes('المريخ')).join('')),'copy contains corrected general-table Mars row');
   if(report.hs==='whole'){
    await page.locator('#eam-result .vh-hub [data-g="c:1"]').click();
    const chart=page.locator('#eam-result .vc-north:visible').first();await chart.waitFor();
    for(const width of [320,390,1280]){await page.setViewportSize({width,height:width>600?900:844});await chart.scrollIntoViewIfNeeded();await page.screenshot({path:'/downloads/house-contract-'+width+'.png'});}
   }
  }else assert.ok(report.bodies.every(b=>b.house===b.natalHouse),'uniform rotation preserves non-whole houses');
 }
 assert.deepEqual(errors,[]);console.log('PASS sidereal house UI contract');
}finally{if(browser)await browser.close();if(server)server.kill();}})().catch(e=>{console.error(e);process.exit(1);});
