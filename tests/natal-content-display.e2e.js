const {chromium}=require(process.env.PLAYWRIGHT_CORE_PATH || 'playwright');
const cp=require('child_process'),fs=require('fs');
const server=cp.spawn('python',['-m','http.server','8767','--bind','127.0.0.1'],{cwd:require('path').resolve(__dirname,'..'),stdio:['ignore','pipe','pipe']});
const logs=[];server.stderr.on('data',d=>logs.push(d.toString()));
const refs=[
 ['planet','sun','عن الشمس','الشمس هنا بتفتح سؤال بسيط: لما صوتك يبان، بتحس إنك موجود، ولا بتفضل تراجع نفسك خوفًا من رد الناس؟ ده معنى رمزي عام، وتفاصيل الموضع هي اللي بتفرق.'],
 ['house','house1','عن البيت الأول','البيت الأول بيتكلم رمزيًا عن طريقتك في دخول أي مكان جديد، وعن الفرق بين الصورة اللي بتقدمها وإحساسك من جوا.'],
 ['sign','libra','عن برج الميزان','ممكن تبقى محتاج العدل والقرب مع بعض، لكن تلاقي نفسك بتأجل كلامك عشان تحافظ على هدوء العلاقة.'],
 ['aspect','square','معنى التربيع','التربيع هنا رمز لاحتياجين محتاجين مساحة مع بعض، مش حكم إن العلاقة بينهم لازم تفضل معركة.'],
 ['asteroid_house','ceres.house1','سيريس في البيت الأول، مرجع عام','ده شرح رمزي لموضوع الرعاية والهوية، مش تحديد لموضع سيريس في خريطتك.']
].map(([reference_kind,reference_key,title,text])=>({id:`natal.reference.${reference_kind}.${reference_key}`,reference_kind,reference_key,title,text,summary:title,status:'approved',body:'reference',layer:'reference'}));
(async()=>{let browser;try{
 await new Promise((res,rej)=>{const wait=()=>fetch('http://127.0.0.1:8767/index.src.html').then(r=>r.ok?res():setTimeout(wait,50)).catch(()=>setTimeout(wait,50));wait();setTimeout(()=>rej(Error('server timeout')),10000);});
 browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',async route=>{const url=route.request().url();if(url.includes('/data/interpretations/reference.json'))return route.fulfill({contentType:'application/json',body:JSON.stringify(refs)});if(!url.startsWith('http://127.0.0.1:8767'))return route.abort();return route.continue();});
 await page.goto('http://127.0.0.1:8767/index.src.html#chart');
 await page.fill('#f-name','معاينة الربط');await page.fill('#f-date','1999-09-25');await page.fill('#f-time','12:00');
 await page.click('#cform button[type=submit]');await page.waitForSelector('.nd-root',{timeout:30000});
 await page.waitForFunction(()=>!!document.querySelector('.il-reference-list'),{timeout:20000});
 await page.screenshot({path:(process.env.NATAL_SCREENSHOT_DIR || require('os').tmpdir()) + '/natal-preview-390.png',fullPage:true});
 await page.click('[data-nd-tab=planets]');await page.locator('[data-nd-panel=planets] .nd-row').filter({has:page.locator('b',{hasText:'الشمس'})}).first().click();
 await page.waitForSelector('.ndr-sheet:not([hidden])');
 await page.screenshot({path:(process.env.NATAL_SCREENSHOT_DIR || require('os').tmpdir()) + '/natal-reading-390.png',fullPage:false});
 console.log('errors',JSON.stringify(errors));
 console.log('reading header', (await page.locator('.ndr-sheet').innerText()).slice(0,250));
 if(!(await page.locator('.ndr-sheet').innerText()).includes('الشمس هنا بتفتح'))throw Error('real planet sheet ignored interpretation template');
 await page.locator('.ndr-sheet .aqm-foot-close').click();await page.waitForSelector('.ndr-sheet[hidden]',{state:'attached'});
 await page.click('[data-nd-tab=overview]');await page.locator('.il-reference-list summary').click();
 await page.locator('.il-reference-list .nd-row').first().click();await page.waitForSelector('.ndr-sheet:not([hidden])');
 await page.screenshot({path:(process.env.NATAL_SCREENSHOT_DIR || require('os').tmpdir()) + '/natal-reference-390.png',fullPage:false});
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:(process.env.NATAL_SCREENSHOT_DIR || require('os').tmpdir()) + '/natal-reference-1440.png',fullPage:false});
 console.log('no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 if(errors.length)process.exitCode=1;
 }catch(e){console.error(e);console.error(logs.slice(-5).join(''));process.exitCode=1;}finally{if(browser)await browser.close();server.kill();}})();
