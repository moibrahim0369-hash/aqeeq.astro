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

 for(const tile of ['c:1','c:2','c:9','c:60','c:moon','c:sun']){
  await page.locator('#eam-result .vh-back').click();
  await page.locator('#eam-result .vh-hub [data-g="'+tile+'"]').click();
  const chart=page.locator('#eam-result .vc-north:visible').first();await chart.waitFor();
  assert.equal(await chart.locator('.vc-house').count(),12);assert.equal(await chart.locator('.vc-body').count(),10);
  for(const width of [320,390,1280]){
   await page.setViewportSize({width,height:width>600?900:844});await chart.scrollIntoViewIfNeeded();
   await page.screenshot({path:'/downloads/vedic-design-'+tile.replace(':','-')+'-'+width+'.png'});
   const expand=chart.locator('..').locator('.vc-expand');await expand.click();
   const dialog=page.locator('.vc-viewer');await dialog.waitFor({state:'visible'});
   assert.equal(await dialog.locator('.vc-svg').count(),1);await dialog.locator('[data-vc-zoom="1"]').click();assert.equal(await dialog.locator('output').textContent(),'150%');
   await page.screenshot({path:'/downloads/vedic-zoom-'+tile.replace(':','-')+'-'+width+'.png'});
   await dialog.locator('[data-vc-fit]').click();assert.equal(await dialog.locator('output').textContent(),'100%');
   await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});assert.equal(await expand.evaluate(e=>e===document.activeElement),true);
   console.log('SIZE',width,await chart.evaluate(e=>({w:e.getBoundingClientRect().width,p:e.parentElement.getBoundingClientRect().width,card:e.closest('.vc-card').getBoundingClientRect().width})));
   const m=await chart.evaluate(e=>({w:e.getBoundingClientRect().width,sw:e.parentElement.scrollWidth,cw:e.parentElement.clientWidth}));assert.ok(m.sw<=m.cw+1,JSON.stringify(m));
  }
  await page.locator('#eam-result .vc-st[data-s="s"]:visible').first().click();assert.equal(await page.locator('#eam-result .vc-north:visible').count(),0);
  await page.locator('#eam-result .vc-st[data-s="n"]:visible').first().click();assert.equal(await page.locator('#eam-result .vc-north:visible').count(),1);assert.equal(await page.locator('#eam-result .vc-north:visible').evaluate(e=>getComputedStyle(e).animationName),'vc-chart-reveal');
  await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('#eam-result .vc-north:visible').evaluate(e=>getComputedStyle(e).animationName),'none');await page.emulateMedia({reducedMotion:'no-preference'});
  console.log('PASS shared chart route',tile);
 }
 await page.locator('#eam-result .vc-north:visible').first().evaluate(chart=>{
  const VC=window.AqVedicChart;
  const m={n:2,lagna:0,basis:'asc',items:VC.PL.map(p=>({key:p[0],name:p[1],ab:p[2],house:11,sign:11,retro:true}))};
  chart.outerHTML=VC.svg(m,'حالة اختبار ازدحام');
 });
 await page.setViewportSize({width:1280,height:900});await page.locator('#eam-result .vc-north:visible').first().scrollIntoViewIfNeeded();await page.screenshot({path:'/downloads/vedic-design-dense-synthetic.png'});
 assert.deepEqual(errs,[]);console.log('PASS chart design routes and zero JS errors');
 }finally{if(browser)await browser.close();if(server)server.kill();}})().catch(e=>{console.error(e);process.exitCode=1;});
