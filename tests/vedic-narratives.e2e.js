'use strict';
// Local browser regression over the actual built page and authored JSON library.
let chromium;try{({chromium}=require('playwright'));}catch(_){({chromium}=require('/usr/share/code/resources/app/node_modules/playwright-core'));}
const {spawn}=require('node:child_process'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const base=process.env.BASE_URL||'http://127.0.0.1:8779',root=path.join(__dirname,'..'),library=JSON.parse(fs.readFileSync(path.join(root,'assets/data/vedic/chart-readings.json'),'utf8'));
(async()=>{let server,browser;try{
 if(!process.env.BASE_URL){server=spawn('python3',['-m','http.server','8779','--bind','127.0.0.1'],{cwd:root,stdio:['ignore','pipe','pipe']});for(let i=0;i<50;i++){try{if((await fetch(base)).ok)break;}catch(_){}await new Promise(r=>setTimeout(r,100));}}
 browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:390,height:844},timezoneId:'Africa/Cairo'}),errs=[];
 page.on('pageerror',e=>errs.push(e.message));await page.route('**/*',r=>r.request().url().startsWith(base)||r.request().url().startsWith('data:')?r.continue():r.abort());
 await page.goto(base+'/index.html#astro-maps');await page.locator('.vh-pre [data-g="c:1"]').click();
 await page.locator('#eam-b-date + .aq-ds .aq-ds-d').selectOption('1');await page.locator('#eam-b-date + .aq-ds .aq-ds-m').selectOption('1');await page.locator('#eam-b-date + .aq-ds .aq-ds-y').selectOption('2000');
 await page.locator('#eam-b-time + .aq-dsx .aq-dsx-h').selectOption('12');await page.locator('#eam-b-time + .aq-dsx .aq-dsx-mi').selectOption('0');await page.locator('#eam-b-time + .aq-dsx .aq-dsx-ap').selectOption('pm');
 await page.locator('#eam-form .geo-q').fill('القاهرة');await page.locator('#eam-form .geo-res [role=option]').first().click();await page.locator('#eam-form button[type="submit"]').click();
 for(const key of ['1','moon','sun','2','3','4','5','6','7','8','9','10','11','12','16','20','24','27','30','40','45','60']){
  if(key!=='1'){await page.locator('#eam-result .vh-back').click();await page.locator('#eam-result .vh-hub [data-g="c:'+key+'"]').click();}
  const reading=page.locator('#eam-result .vn-reading:visible').first();await reading.locator('.vn-head').waitFor();
  if(['27','30','40','45','60'].includes(key)){assert.equal(await reading.locator('.vn-house').count(),0);await reading.locator('.vn-precision-accept').click();}
  await reading.locator('.vn-house').first().waitFor();
  const actual=await page.evaluate(key=>{const VC=window.AqVedicChart,L=window.AqVedic.last,n=/^\d+$/.test(key)?+key:key,map=VC.build(L.ch,n);return {groups:window.AqVedicNarratives.facts(map).groups.map(g=>g.house+1),items:map.items.map(x=>({key:x.key,sign:x.sign,house:x.house+1}))};},key);
  const ids=await reading.locator('.vn-house').evaluateAll(es=>es.map(e=>e.dataset.vnEntry));assert.deepEqual(ids,actual.groups.map(h=>'vedic.'+key+'.house.'+h));
  for(const item of actual.items){const card=reading.locator('[data-vn-entry="vedic.'+key+'.planet.'+item.key+'.sign.'+item.sign+'"]');assert.equal(await card.count(),1);assert.ok((await card.textContent()).includes(library.planets[item.key].signs[item.sign]));}
  const first=actual.groups[0];assert.ok((await reading.locator('.vn-house').first().textContent()).includes(library.charts[key].houseReadings[first].lead));
  for(const width of (['1','9','10','60'].includes(key)?[320,390,1280]:[390])){
   await page.setViewportSize({width,height:width>600?900:844});await reading.locator('.vn-house').first().scrollIntoViewIfNeeded();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   if(['1','9','10','60'].includes(key))await page.screenshot({path:'/downloads/vedic-narrative-'+key+'-'+width+'.png'});
  }
  console.log('PASS chart',key,actual.groups.length,'occupied-house readings,',actual.items.length,'planet contexts');
 }
 // Test the real unknown-time input flow, not a fabricated map.
 await page.locator('#eam-result .vh-back').click();await page.locator('#eam-b-unknown').check();await page.locator('#eam-form button[type="submit"]').click();
 await page.locator('#eam-result .vh-hub').waitFor({state:'visible'});await page.locator('#eam-result .vh-hub [data-g="c:9"]').click();
 let r=page.locator('#eam-result .vn-reading:visible').first();await r.locator('.vn-limit').waitFor();assert.equal(await r.locator('.vn-house').count(),0);assert.ok((await r.textContent()).includes('وقت الميلاد غير معروف'));
 await page.screenshot({path:'/downloads/vedic-narrative-unknown-time.png'});
 await page.goto(base+'/vedic-library.html');await page.locator('[data-library-entry]').first().waitFor();assert.equal(await page.locator('#selector option').count(),22);
 await page.locator('#selector').selectOption('9');assert.ok((await page.locator('#results').textContent()).includes(library.charts['9'].intro));
 await page.locator('#type').selectOption('planet');await page.locator('#selector').selectOption('ketu');assert.equal(await page.locator('[data-library-entry]').count(),13);
 await page.locator('#search').fill('zznonexistentzz');assert.equal(await page.locator('[data-library-entry]').count(),0);await page.locator('#search').fill('');
 for(const width of [320,390,1280]){await page.setViewportSize({width,height:width>600?900:844});await page.screenshot({path:'/downloads/vedic-library-'+width+'.png'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
 assert.deepEqual(errs,[]);console.log('PASS library filters/search and zero page errors');
 }finally{if(browser)await browser.close();if(server)server.kill();}})().catch(e=>{console.error(e);process.exitCode=1;});
