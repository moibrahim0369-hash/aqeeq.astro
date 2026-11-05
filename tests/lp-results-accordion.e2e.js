/* اختبار: نتائج مسار الحياة والتوافق — أكورديون عاجي، عمود واحد في الموبايل، بلا صناديق داكنة، وأزرار الرجوع.
   الاستخدام: python3 -m http.server 8765 &  ثم  node tests/lp-results-accordion.e2e.js [PORT] */
const { chromium } = require('playwright');
const BASE = `http://127.0.0.1:${process.argv[2] || '8765'}`;
(async () => {
  const b = await chromium.launch(); const fails = []; let n = 0;
  const ok = (c, m) => { n++; if (!c) fails.push(m); };
  for (const [w, h] of [[390, 844], [1280, 900]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.route('**/*', r => (r.request().url().startsWith(BASE) ? r.continue() : r.abort()));
    await p.goto(`${BASE}/index.html#lifepath`); await p.waitForTimeout(800);
    await p.fill('#lp-date', '1990-05-14'); await p.click('#lpform button[type=submit]'); await p.waitForSelector('#lpresult .lpa-nav', { timeout: 8000 }); await p.waitForTimeout(500);
    const r = await p.evaluate(() => {
      const cards = [...document.querySelectorAll('#lpresult .lpa-card')];
      const dark = []; document.querySelectorAll('#lpresult *').forEach(e => { if (e.closest('button,a,.lpd-seg,.lpj-node,.lpd-here,.lpj-tag')) return; const c = getComputedStyle(e).backgroundColor.match(/[\d.]+/g); if (!c) return; const a = c[3] === undefined ? 1 : +c[3]; if (a > .2 && (c[0] * .3 + c[1] * .6 + c[2] * .1) < 110 && e.getBoundingClientRect().height > 30) dark.push(e.className); });
      const first = cards[0]; const cs = getComputedStyle(first);
      const titles = cards.map(c => c.querySelector('.lpa-t') ? c.querySelector('.lpa-t').textContent : '');
      const nav = document.querySelector('#lpresult .lpa-nav'); const navR = nav.getBoundingClientRect();
      return { n: cards.length, dark, bg: cs.backgroundColor, rad: cs.borderRadius, bd: cs.borderTopColor, hs: document.documentElement.scrollWidth > innerWidth,
        seven: document.querySelectorAll('#lpresult details.lp-section').length, hasLight: !!document.querySelector('#lpresult .lpa-card.is-light'), hasShadow: !!document.querySelector('#lpresult .lpa-card.is-shadow'),
        titles: titles.join('|'), navTop: navR.top, intro: getComputedStyle(document.querySelector('#lpresult .lp-sections-intro')).backgroundColor,
        pcGrid: [...document.querySelectorAll('#lpresult .aqeq-pc-grid')].map(g => getComputedStyle(g).gridTemplateColumns.split(' ').length) };
    });
    ok(r.n >= 9, `${w}: accordion cards ${r.n}`);
    ok(r.dark.length === 0, `${w}: dark boxes ${r.dark}`);
    ok(r.bg === 'rgb(253, 251, 247)' && r.rad === '14px', `${w}: card style ${r.bg} ${r.rad}`);
    ok(!r.hs, `${w}: horizontal scroll`);
    ok(r.seven === 7 && r.hasLight && r.hasShadow, `${w}: seven=${r.seven} light=${r.hasLight} shadow=${r.hasShadow}`);
    ok(/القمم والتحديات/.test(r.titles) && /التحديات الأربعة/.test(r.titles) && /الديون الكارمية/.test(r.titles), `${w}: pinnacle/challenge/debt cards missing: ${r.titles}`);
    ok(r.intro === 'rgb(250, 244, 234)', `${w}: sections intro bg ${r.intro}`);
    if (w < 800) ok(r.pcGrid.every(c => c === 1), `${w}: pinnacle grid columns ${r.pcGrid}`);
    // فتح/غلق
    const t = await p.evaluate(() => { const d = document.querySelectorAll('#lpresult .lpa-card:not(.lpa-native)')[1]; const was = d.open; d.querySelector('summary').click(); return [was, d.open]; });
    ok(t[0] !== t[1], `${w}: accordion does not toggle`);
    // العودة لحاسبة مسار الحياة
    await p.evaluate(() => { const s = document.getElementById('lifepath'); s.style.scrollBehavior = 'auto'; s.scrollTop = 0; });
    await p.click('#lpresult .lpa-nav .btn-edit-lp'); await p.waitForTimeout(500);
    ok(await p.evaluate(() => getComputedStyle(document.getElementById('lpform')).display !== 'none' && document.getElementById('lpresult').hidden !== false), `${w}: back to calculator failed`);
    // التوافق
    await p.evaluate(() => document.getElementById('lp-start-compare').click());
    await p.fill('#syn-name-a', 'أحمد'); await p.fill('#syn-name-b', 'سارة'); await p.fill('#syn-date-a', '1990-05-14'); await p.fill('#syn-date-b', '1992-09-02'); await p.selectOption('#syn-type', 'family');
    await p.click('#synastry-form button[type=submit]'); await p.waitForSelector('#syn-result .lpa-card', { timeout: 8000 }); await p.waitForTimeout(500);
    const s = await p.evaluate(() => ({ cards: document.querySelectorAll('#syn-result .lpa-card').length, unlocked: document.getElementById('syn-premium').classList.contains('unlocked'), overlay: getComputedStyle(document.querySelector('.syn-lock-overlay')).display, nav: !!document.querySelector('#syn-result .lpa-nav'), hs: document.documentElement.scrollWidth > innerWidth, inForm: !!document.querySelector('#lifepath #syn-result') }));
    ok(s.cards >= 8 && s.unlocked && s.overlay === 'none' && s.nav && s.inForm, `${w}: compat result ${JSON.stringify(s)}`);
    ok(!s.hs, `${w}: compat horizontal scroll`);
    ok(errs.length === 0, `${w}: js errors ${errs.join(';')}`);
    await p.context().close();
  }
  await b.close();
  console.log(fails.length ? 'FAIL\n' + fails.join('\n') : `PASS ${n} checks`); process.exit(fails.length ? 1 : 0);
})();
/* mobile: بصمة الاسم + القمم عمود واحد وبلا خلفية كحلية */
(async()=>{const {chromium}=require('playwright');const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
await p.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1')?r.continue():r.abort());
await p.goto('http://127.0.0.1:8765/index.html#lifepath');await p.waitForTimeout(800);
await p.fill('#lp-name','محمد ابراهيم');await p.fill('#lp-date','1990-05-14');await p.click('#lpform button[type=submit]');
await p.waitForSelector('#lpresult .aqeq-name-readings',{timeout:10000}).catch(()=>{});await p.waitForTimeout(500);
const r=await p.evaluate(()=>{const cols=s=>[...document.querySelectorAll(s)].map(e=>getComputedStyle(e)).every(c=>c.display==='flex'&&c.flexDirection==='column'||c.gridTemplateColumns.split(' ').length===1);return{bg:getComputedStyle(document.querySelector('.aqeq-name-readings')).backgroundColor,g:cols('#lpresult .aqeq-name-groups,#lpresult .aqeq-pc-grid,#lpresult .aqeq-reading-grid'),hs:document.documentElement.scrollWidth>innerWidth}});
console.log(r.bg==='rgb(253, 251, 247)'&&r.g&&!r.hs?'PASS mobile single column + ivory name blueprint':'FAIL mobile name blueprint '+JSON.stringify(r));
await b.close();if(!(r.bg==='rgb(253, 251, 247)'&&r.g&&!r.hs))process.exit(1)})();
/* الفصول السبعة: فصل أول مفتوح، تباين، شارات، أيقونات 36px */
(async()=>{const {chromium}=require('playwright');const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
await p.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1')?r.continue():r.abort());
await p.goto('http://127.0.0.1:8765/index.html#lifepath');await p.waitForTimeout(800);
await p.fill('#lp-date','1990-05-14');await p.click('#lpform button[type=submit]');await p.waitForSelector('#lpresult details.lp-section',{timeout:10000});await p.waitForTimeout(500);
const r=await p.evaluate(()=>{const L=[...document.querySelectorAll('#lpresult details.lp-section')];const p0=L[0].querySelector('.lp-sec-body p');return{n:L.length,open:L.map(d=>d.open).join(),col:getComputedStyle(p0).color,lh:parseFloat(getComputedStyle(p0).lineHeight)/parseFloat(getComputedStyle(p0).fontSize),badges:L.every(d=>d.querySelector('.lpa-badge')),tags:L.some(d=>/\[|—\s*مجاني/.test(d.querySelector('.lp-sec-title b').textContent)),ic:L.every(d=>getComputedStyle(d.querySelector('.lp-sec-icon')).width==='36px'),single:new Set(L.map(d=>Math.round(d.getBoundingClientRect().left))).size===1}});
const good=r.n===7&&r.open==='true,false,false,false,false,false,false'&&r.col==='rgb(44, 37, 35)'&&r.lh>=1.8&&r.badges&&!r.tags&&r.ic&&r.single;
console.log(good?'PASS seven chapters accordion/contrast/badges/icons':'FAIL seven chapters '+JSON.stringify(r));await b.close();if(!good)process.exit(1)})();
