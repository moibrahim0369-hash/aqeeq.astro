const { chromium } = require('playwright'); const BASE='http://127.0.0.1:8765';
(async()=>{const b=await chromium.launch();
for (const block of [true,false]) { const p=await b.newPage();
 await p.route('**/*',r=>{const u=r.request().url(); if(block&&u.includes('theme-dark-luxury'))return r.abort(); return u.startsWith(BASE)?r.continue():r.abort();});
 await p.goto(BASE+'/index.html'); await p.waitForTimeout(3000);
 const n=await p.evaluate(()=>[...document.getAnimations()].map(a=>a.animationName||a.constructor.name).sort().join(','));
 console.log(block?'without theme':'with theme', n.split(',').length, n===undefined?'':'');
 if(!block) { console.log(await p.evaluate(()=>[...document.getAnimations()].length)); }
 await p.close(); }
await b.close();})();
