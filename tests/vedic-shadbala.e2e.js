'use strict';
let chromium;try{({chromium}=require('playwright'));}catch(_){({chromium}=require('/usr/share/code/resources/app/node_modules/playwright-core'));}
const {spawn}=require('node:child_process'),assert=require('node:assert/strict'),path=require('node:path');
const base=process.env.BASE_URL||'http://127.0.0.1:8777',root=path.join(__dirname,'..');
(async()=>{let server,browser;try{
 if(!process.env.BASE_URL){server=spawn('python3',['-m','http.server','8777','--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});for(let i=0;i<40;i++){try{if((await fetch(base)).ok)break;}catch(_){}await new Promise(r=>setTimeout(r,100));}}
 browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:390,height:844},timezoneId:'Africa/Cairo'}),errs=[];page.on('pageerror',e=>errs.push(e.message));
 await page.route('**/*',r=>r.request().url().startsWith(base)||r.request().url().startsWith('data:')?r.continue():r.abort());
 await page.goto(base+'/index.html#astro-maps');await page.locator('.vh-pre [data-g="shadbala"]').click();
 await page.locator('#eam-b-date + .aq-ds .aq-ds-d').selectOption('1');await page.locator('#eam-b-date + .aq-ds .aq-ds-m').selectOption('1');await page.locator('#eam-b-date + .aq-ds .aq-ds-y').selectOption('2000');
 await page.locator('#eam-b-time + .aq-dsx .aq-dsx-h').selectOption('12');await page.locator('#eam-b-time + .aq-dsx .aq-dsx-mi').selectOption('0');await page.locator('#eam-b-time + .aq-dsx .aq-dsx-ap').selectOption('pm');
 await page.locator('#eam-form .geo-q').fill('القاهرة');await page.locator('#eam-form .geo-res [role=option]').first().click();await page.locator('#eam-form button[type="submit"]').click();
 await page.locator('#eam-result[data-vh="shadbala"] .vsb .vad-signs article').first().waitFor({state:'visible'});assert.equal(await page.locator('.vsb .vad-signs article').count(),7);
 for(const width of [320,390,1280]){
  await page.setViewportSize({width,height:width>600?900:844});
  await page.locator('.vsb').evaluate(e=>{const sec=e.closest('#astro-maps'),d=e.closest('details');sec.scrollTo({top:sec.scrollTop+d.getBoundingClientRect().top-sec.getBoundingClientRect().top-95,behavior:'instant'});});await page.waitForTimeout(200);await page.screenshot({path:'/downloads/shadbala-'+width+'.png'});
  for(let p=0;p<7;p++){await page.locator('.vsb-select').selectOption(String(p));assert.equal(await page.locator('.vsb-parts p').count(),6);}
  await page.locator('.vsb-out').scrollIntoViewIfNeeded();await page.screenshot({path:'/downloads/shadbala-parts-'+width+'.png'});
  const m=await page.locator('.vsb').evaluate(e=>({w:e.clientWidth,scroll:e.scrollWidth}));assert.ok(m.scroll<=m.w+1,JSON.stringify(m));console.log('PASS Shadbala',width,m);
 }
 assert.ok(await page.evaluate(()=>{const L=window.AqVedic.last,old=L.ch.known;L.ch.known=false;const msg=window.AqShadbala.createCard().textContent;L.ch.known=old;return msg.includes('وقت ميلاد معلوم');}));
 const war=await page.evaluate(()=>{const L=window.AqVedic.last,rows=L.ch.bodies.map(b=>({...b}));L.ch.bodies.find(b=>b.key==='mars').lon=100;L.ch.bodies.find(b=>b.key==='mercury').lon=100.5;const r=window.AqShadbala.calculate(L.ch,L.natal),el=window.AqShadbala.createCard(),msg=el.textContent;L.ch.bodies=rows;return {total:r.rows[0].total,message:msg};});assert.ok(Number.isFinite(war.total));assert.ok(war.message.includes('حرب كوكبية'));assert.ok(war.message.includes('المنتصر'));
 assert.deepEqual(errs,[]);console.log('PASS Shadbala selectors, six parts, unknown-time and war guards, zero JS errors');
 }finally{if(browser)await browser.close();if(server)server.kill();}})().catch(e=>{console.error(e);process.exitCode=1;});
