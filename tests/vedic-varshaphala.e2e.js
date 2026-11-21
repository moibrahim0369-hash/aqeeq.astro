'use strict';
let chromium;try{({chromium}=require('playwright'));}catch(_){({chromium}=require('/usr/share/code/resources/app/node_modules/playwright-core'));}
const {spawn}=require('node:child_process'),assert=require('node:assert/strict'),path=require('node:path');
const base=process.env.BASE_URL||'http://127.0.0.1:8777',root=path.join(__dirname,'..');
(async()=>{let server,browser;try{
 if(!process.env.BASE_URL){server=spawn('python3',['-m','http.server','8777','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});for(let i=0;i<40;i++){try{if((await fetch(base)).ok)break;}catch(_){}await new Promise(r=>setTimeout(r,100));}}
 browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:390,height:844},timezoneId:'Africa/Cairo'}),errs=[];page.on('pageerror',e=>errs.push(e.message));
 await page.route('**/*',r=>r.request().url().startsWith(base)||r.request().url().startsWith('data:')?r.continue():r.abort());
 await page.goto(base+'/index.html#astro-maps');await page.locator('.vh-pre [data-g="varshaphala"]').click();
 await page.locator('#eam-b-date + .aq-ds .aq-ds-d').selectOption('1');await page.locator('#eam-b-date + .aq-ds .aq-ds-m').selectOption('1');await page.locator('#eam-b-date + .aq-ds .aq-ds-y').selectOption('2000');
 await page.locator('#eam-b-time + .aq-dsx .aq-dsx-h').selectOption('12');await page.locator('#eam-b-time + .aq-dsx .aq-dsx-mi').selectOption('0');await page.locator('#eam-b-time + .aq-dsx .aq-dsx-ap').selectOption('pm');
 await page.locator('#eam-form .geo-q').fill('القاهرة');await page.locator('#eam-form .geo-res [role=option]').first().click();await page.locator('#eam-form button[type="submit"]').click();
 await page.locator('#eam-result[data-vh="varshaphala"] .vyr .vad-signs article').first().waitFor({state:'visible'});assert.equal(await page.locator('.vyr .vad-signs article').count(),2);
 for(const width of [320,390,1280]){
  await page.setViewportSize({width,height:width>600?900:844});
  await page.locator('.vyr').evaluate(e=>{const sec=e.closest('#astro-maps'),d=e.closest('details');sec.scrollTo({top:sec.scrollTop+d.getBoundingClientRect().top-sec.getBoundingClientRect().top-95,behavior:'instant'});});await page.waitForTimeout(200);await page.screenshot({path:'/downloads/varshaphala-'+width+'.png'});
  await page.locator('.vyr-chart').scrollIntoViewIfNeeded();await page.screenshot({path:'/downloads/varshaphala-chart-'+width+'.png'});
  await page.locator('.vyr-candidates').scrollIntoViewIfNeeded();await page.screenshot({path:'/downloads/varshaphala-audit-'+width+'.png'});
  assert.ok((await page.locator('.vyr-candidates').textContent()).includes('مستبعد:'));
  const m=await page.locator('.vyr').evaluate(e=>({w:e.clientWidth,scroll:e.scrollWidth}));assert.ok(m.scroll<=m.w+1,JSON.stringify(m));console.log('PASS Varshaphala',width,m);
 }
 assert.ok(await page.evaluate(()=>{const L=window.AqVedic.last,old=L.ch.known;L.ch.known=false;const msg=window.AqVarshaphala.createCard().textContent;L.ch.known=old;return msg.includes('وقت الميلاد غير معروف');}));
 const before=await page.locator('.vyr-out').getAttribute('data-return-ms');
 await page.locator('.vyr-place').selectOption('custom');await page.locator('.vyr-lat').fill('51.5');await page.locator('.vyr-lon').fill('-0.12');await page.locator('.vyr-go').click();assert.equal(await page.locator('.vyr-out').getAttribute('data-return-ms'),before);
 await page.locator('.vyr-year').fill('2028');await page.locator('.vyr-go').click();assert.notEqual(await page.locator('.vyr-out').getAttribute('data-return-ms'),before);
 await page.locator('.vyr-lat').fill('90');await page.locator('.vyr-go').click();assert.ok((await page.locator('.vyr-out').innerText()).includes('إحداثيات صحيحة'));assert.equal(await page.locator('.vyr-out').getAttribute('data-return-ms'),null);
 await page.locator('#eam-result .vh-back').click();await page.locator('#eam-result .vh-hub [data-g="varshaphala"]').click();assert.equal(await page.locator('#eam-result').getAttribute('data-vh'),'varshaphala');
 assert.deepEqual(errs,[]);console.log('PASS Varshaphala year, location, unknown-time and input guards, zero JS errors');
 }finally{if(browser)await browser.close();if(server)server.kill();}})().catch(e=>{console.error(e);process.exitCode=1;});
