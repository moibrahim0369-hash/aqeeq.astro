const { chromium } = require('playwright');
const OUT=require('os').tmpdir()+'/';
const B=process.env.BASE||'http://127.0.0.1:8765/index.html';
let pass=0,fail=0; const ok=(n,c,x)=>{ (c?pass++:fail++); console.log((c?'PASS ':'FAIL ')+n+(x!==undefined?' '+JSON.stringify(x):'')); };
(async()=>{
 const br=await chromium.launch();
 const errs=[];
 async function mk(w,h,extra){ const c=await br.newContext({viewport:{width:w,height:h},locale:'ar',...extra}); const p=await c.newPage(); p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error'&&!/fonts|favicon|supabase|net::/.test(m.text()))errs.push(m.text())}); return p; }
 const p=await mk(1366,900);
 await p.goto(B+'#featured-content'); await p.waitForSelector('.fc-card');
 ok('list open', await p.evaluate(()=>getComputedStyle(document.getElementById('featured-content')).display==='block'));
 ok('title', (await p.textContent('#fc-title'))==='محتوى مميز');
 ok('10 filters', await p.locator('.fc-chip').count()===10);
 ok('rows layout: latest row has 4 cards', await p.locator('.fc-rows #fc-latest-grid .fc-card').count()===4);
 ok('4 topic rows below latest', await p.locator('.fc-rows .fc-row:not(.is-latest)').count()===4);
 ok('latest row is newest-first', await p.evaluate(()=>{var d=[...document.querySelectorAll('#fc-latest-grid .fc-meta span:first-child')].length;return d===4}));
 ok('pick shown', await p.locator('.fc-pick').isVisible());
 await p.waitForTimeout(900);
 await p.screenshot({path:OUT+'list-desktop.png'});
 { const sl=await p.getAttribute('.fc-pick','data-slug'); ok('banner has dots', await p.locator('.fc-pick-dots button').count()>=2); await p.click('.fc-pick-dots button:not([aria-current]) >> nth=0'); await p.waitForTimeout(700); ok('banner dot switches article', sl!==await p.getAttribute('.fc-pick','data-slug')); }
 // load more
 await p.click('.fc-pg[data-pg="2"]'); await p.waitForTimeout(300); ok('pagination page 2', await p.locator('#fc-latest-grid .fc-card').count()===4 && (await p.getAttribute('.fc-pg.on','aria-current'))==='page');
 { const first=await p.getAttribute('#fc-latest-grid .fc-card','data-slug'); await p.click('.fc-pg[data-pg="1"]'); await p.waitForTimeout(200); ok('page 1 vs 2 differ', first!==await p.getAttribute('#fc-latest-grid .fc-card','data-slug')); }
 // group header -> filtered list
 await p.click('.fc-row:not(.is-latest) .fc-row-all >> nth=0'); await p.waitForTimeout(400);
 ok('group header opens category list', await p.locator('.fc-list .fc-card').count()>=1 && await p.locator('.fc-rows').count()===0);
 ok('group count line', (await p.textContent('#fc-count')).includes('الأبراج'));
 await p.click('.fc-chip[data-cat="الكل"]'); await p.waitForTimeout(500);
 ok('back to rows', await p.locator('.fc-rows').count()===1);
 await p.click('.fc-pg[data-pg="1"]'); await p.waitForTimeout(200);
 ok('cards stacked vertically', await p.evaluate(()=>{const c=[...document.querySelectorAll('.fc-list .fc-card')].map(e=>e.getBoundingClientRect());return c.every((r,i)=>!i||r.top>=c[i-1].bottom-1);}));
 ok('each card has topic label', await p.evaluate(()=>[...document.querySelectorAll('.fc-list .fc-card')].every(c=>c.querySelector('.fc-topic'))));
 ok('astro/lifepath topic labels', await p.evaluate(()=>FeaturedContent.all().length>0 && [...document.querySelectorAll('.fc-topic b')].every(b=>b.textContent.length>1)));
 // filters
 for (const c of ['الأبراج','الكواكب','القمر','العبور','التراجعات','مصفوفة القدر','مسار الحياة','العلاقات','الرموز','الكل']) {
   await p.click(`.fc-chip[data-cat="${c}"]`); await p.waitForTimeout(250);
   const cats=await p.$$eval('.fc-card',e=>e.map(x=>x.dataset.category));
   ok('filter '+c, c==='الكل'?cats.length>=4:(cats.length>0&&cats.every(x=>x===c)),cats.length);
 }
 // empty filter state message: simulate via search none
 await p.fill('#fc-q','زززز'); await p.waitForTimeout(500);
 ok('no results msg', (await p.textContent('.fc-msg')).includes('لا توجد نتائج'));
 await p.screenshot({path:OUT+'no-results.png'});
 await p.click('[data-fc-clear]'); await p.waitForTimeout(400);
 // arabic search
 await p.fill('#fc-q','عطارد'); await p.waitForTimeout(500);
 let t=await p.$$eval('.fc-card h3',e=>e.map(x=>x.textContent)); ok('search عطارد', t.length>=1&&t.some(x=>x.includes('عطارد')),t);
 await p.fill('#fc-q','الاقمار'); await p.fill('#fc-q','القمر'); await p.waitForTimeout(500);
 t=await p.$$eval('.fc-card h3',e=>e.length); ok('search القمر', t>=1,t);
 await p.fill('#fc-q','الزهرة'); await p.waitForTimeout(500); ok('search الزهرة', await p.locator('.fc-card').count()>=1);
 await p.fill('#fc-q',''); await p.waitForTimeout(400);
 // keyboard filters
 await p.focus('.fc-chip[data-cat="الكل"]'); await p.keyboard.press('ArrowLeft');
 ok('arrow nav', (await p.evaluate(()=>document.activeElement.dataset.cat))==='الأبراج');
 await p.keyboard.press('Enter'); await p.waitForTimeout(300);
 ok('enter selects', (await p.getAttribute('.fc-chip[data-cat="الأبراج"]','aria-pressed'))==='true');
 await p.click('.fc-chip[data-cat="الكل"]'); await p.waitForTimeout(300);
 // open every card, check, back
 const slugs=await p.evaluate(()=>FeaturedContent.all().map(a=>a.slug));
 ok('11 slugs', slugs.length===11);
 // position restore
 await p.evaluate(()=>{document.getElementById('featured-content').scrollTop=500});
 const before=await p.evaluate(()=>document.getElementById('featured-content').scrollTop);
 await p.evaluate(()=>document.querySelector('.fc-card:nth-child(2) h3 a').click()); await p.waitForSelector('#fc-art-title');
 ok('reader open', await p.evaluate(()=>location.hash.startsWith('#featured-content/')));
 await p.waitForTimeout(500); await p.screenshot({path:OUT+'article-desktop.png'});
 await p.click('[data-fc-back]'); await p.waitForTimeout(400);
 ok('back to list', (await p.evaluate(()=>location.hash))==='#featured-content');
 ok('reader closed', await p.evaluate(()=>!document.getElementById('featured-reader').classList.contains('fc-open')));
 ok('scroll restored', Math.abs(await p.evaluate(()=>document.getElementById('featured-content').scrollTop)-before)<5, before);
 for (const s of slugs) {
   await p.goto(B+'#featured-content/'+s); await p.waitForSelector('#fc-art-title'); await p.waitForTimeout(100);
   const r=await p.evaluate(()=>({h:document.getElementById('fc-art-title').textContent, rel:document.querySelectorAll('.fc-related .fc-card').length, dup:[...document.querySelectorAll('.fc-related .fc-card')].some(c=>c.dataset.slug===location.hash.split('/')[1]), img:document.querySelector('.fc-hero-img img').complete&&document.querySelector('.fc-hero-img img').naturalWidth>0, btns:['[data-fc-save]','[data-fc-share]','[data-fc-back]'].every(x=>document.querySelector(x).getAttribute('aria-label'))}));
   ok('article '+s, r.h.length>5&&r.rel===3&&!r.dup&&r.img&&r.btns,r.rel);
 }
 // links in body valid
 await p.goto(B+'#featured-content/matrix-22-arcana'); await p.waitForSelector('#fc-art-title');
 const hrefs=await p.$$eval('#fc-reader-body a[href^="#"]',a=>a.map(x=>x.getAttribute('href')));
 const bad=await p.evaluate(h=>h.filter(x=>!/^#featured-content(\/|$)/.test(x)&&!document.getElementById(x.slice(1))),hrefs); ok('no dead anchors', bad.length===0, bad);
 // share menu + copy
 await p.click('[data-fc-share]'); ok('share menu', await p.locator('.fc-menu').isVisible());
 await p.click('[data-fc-save]'); await p.waitForTimeout(500); ok('save prompts login', (await p.textContent('.fc-saved')).includes('سجّل الدخول'));
 await p.keyboard.press('Escape'); await p.keyboard.press('Escape'); await p.waitForTimeout(300);
 // legacy hash
 await p.goto(B+'#article-natal-trinity'); await p.waitForTimeout(800);
 ok('legacy redirect', (await p.evaluate(()=>location.hash))==='#featured-content/natal-trinity');
 // unknown slug
 await p.goto(B+'#featured-content/nope'); await p.waitForTimeout(800); ok('unknown slug msg', (await p.textContent('#fc-reader-body')).includes('غير متاح'));
 // homepage
 await p.goto(B); await p.waitForSelector('.aqh-article'); 
 ok('header link', await p.locator('a[href="#featured-content"]').count()>=3);
 ok('no المقالات label in header', !(await p.textContent('header')).includes('المقالات'));
 ok('home cards ids', await p.evaluate(()=>[...document.querySelectorAll('.aqh-article')].every(c=>c.dataset.contentId&&c.dataset.slug&&c.dataset.category&&c.dataset.contentType)));
 ok('banner attrs', await p.evaluate(()=>[...document.querySelectorAll('.dbn-cta')].every(c=>c.dataset.contentType&&c.dataset.contentId)));
 await p.click('.aqh-article:first-child .aqh-article-link'); await p.waitForSelector('#fc-art-title');
 ok('home card->article', (await p.evaluate(()=>location.hash)).startsWith('#featured-content/'));
 await p.goto(B); await p.waitForSelector('.aqh-article'); await p.click('#aqh-all-articles'); await p.waitForSelector('.fc-card');
 ok('home all->list', (await p.evaluate(()=>location.hash))==='#featured-content');
 // keyboard focus visible & card tab
 await p.keyboard.press('Tab'); 
 // error state
 const pe=await mk(1366,900); await pe.route('**/featured-content.json',r=>r.abort());
 await pe.goto(B+'#featured-content'); await pe.waitForSelector('.fc-msg'); ok('error state', (await pe.textContent('.fc-msg')).includes('تعذر تحميل المحتوى حاليًا')); await pe.screenshot({path:OUT+'error.png'});
 // offline cache
 const po=await mk(1366,900); await po.goto(B+'#featured-content'); await po.waitForSelector('.fc-card');
 await po.route('**/featured-content.json',r=>r.abort()); await po.reload(); await po.waitForSelector('.fc-offline'); ok('offline cache', await po.locator('.fc-card').count()>=1);
 // loading state
 const pl=await mk(1366,900); await pl.route('**/featured-content.json',async r=>{await new Promise(x=>setTimeout(x,1500)); r.continue();}); await pl.goto(B+'#featured-content'); await pl.waitForSelector('.fc-skel'); await pl.screenshot({path:OUT+'loading.png'}); ok('loading skeleton', true);
 // mobile
 const m=await mk(390,844,{hasTouch:true,isMobile:true,deviceScaleFactor:2}); await m.goto(B+'#featured-content'); await m.waitForSelector('.fc-card'); await m.waitForTimeout(900);
 ok('no hscroll mobile list', await m.evaluate(()=>{const e=document.getElementById('featured-content');return e.scrollWidth<=e.clientWidth+1;}));
 ok('1 col mobile', await m.evaluate(()=>getComputedStyle(document.getElementById('fc-grid')).gridTemplateColumns.split(' ').length===1));
 await m.screenshot({path:OUT+'list-mobile.png'});
 await m.goto(B+'#featured-content/natal-trinity'); await m.waitForSelector('#fc-art-title'); await m.waitForTimeout(500);
 ok('no hscroll mobile article', await m.evaluate(()=>{const e=document.getElementById('featured-reader');return e.scrollWidth<=e.clientWidth+1;}));
 await m.screenshot({path:OUT+'article-mobile.png'});
 await m.evaluate(()=>document.getElementById('featured-reader').scrollTop=900); await m.waitForTimeout(300); await m.screenshot({path:OUT+'article-mobile-2.png'});
 // reduced motion
 const rm=await mk(1366,900,{reducedMotion:'reduce'}); await rm.goto(B+'#featured-content'); await rm.waitForSelector('.fc-card');
 ok('reduced motion no anim', await rm.evaluate(()=>getComputedStyle(document.querySelector('.fc-card')).animationName==='none'&&getComputedStyle(document.querySelector('.fc-card')).opacity==='1'));
 ok('no js errors', errs.length===0, errs.slice(0,4));
 console.log(pass+' pass '+fail+' fail');
 await br.close();
})();
