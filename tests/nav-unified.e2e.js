'use strict';
// نظام التنقل الموحد: شريط سفلي (5)، ورقة اكتشف ذاتك، قائمة جانبية، هيدر الديسكتوب، RTL/LTR، بدون تمرير أفقي.
const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8765/index.html';
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('PASS', m); } else { fail++; console.log('FAIL', m); } };
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h] of [[320, 700], [390, 844], [820, 1180]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    p.on('pageerror', e => errs.push(e.message));
    await p.goto(BASE + '#home'); await p.waitForTimeout(900);
    const hs = () => p.evaluate(() => location.hash);
    for (const [sel, hash] of [['.bnav a[href="#account"]', '#account'], ['.bnav a[href="#home"]', '#home']]) {
      await p.click(sel); await p.waitForTimeout(350);
      ok(await hs() === hash, `${w}: bnav ${hash}`);
      ok(await p.evaluate(s => document.querySelector(s).classList.contains('on'), sel), `${w}: active ${hash}`);
      ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${w}: no hscroll ${hash}`);
    }
    for (const t of ['#chart', '#matrix', '#lifepath', '#sky']) {
      await p.click('#aqn-discover-btn'); await p.waitForTimeout(400);
      ok(await p.evaluate(() => document.getElementById('aqn-sheet').classList.contains('is-open')), `${w}: sheet opens for ${t}`);
      await p.click(`.aqn-grid a[href="${t}"]`); await p.waitForTimeout(500);
      ok(await hs() === t, `${w}: sheet -> ${t}`);
      ok(await p.evaluate(() => !document.getElementById('aqn-sheet').classList.contains('is-open')), `${w}: sheet closes after ${t}`);
      ok(await p.evaluate(() => document.getElementById('aqn-discover-btn').classList.contains('on')), `${w}: discover active on ${t}`);
    }
    await p.click('#aqn-discover-btn'); await p.waitForTimeout(350); await p.keyboard.press('Escape'); await p.waitForTimeout(400);
    ok(await p.evaluate(() => !document.getElementById('aqn-sheet').classList.contains('is-open')), `${w}: Esc closes sheet`);
    // drawer
    await p.click('#aqh-burger'); await p.waitForTimeout(450);
    ok(await p.evaluate(() => !document.getElementById('aqh-menu').hidden && document.getElementById('aqh-burger').getAttribute('aria-expanded') === 'true'), `${w}: drawer opens`);
    const links = await p.$$eval('#aqh-menu a', a => a.map(x => x.getAttribute('href')));
    ok(['#home', '#chart', '#matrix', '#lifepath', '#sky', '#compat', '#featured-content', '#dream-library', '#account'].every(x => links.includes(x)), `${w}: drawer has all destinations`);
    await p.keyboard.press('Escape'); await p.waitForTimeout(450);
    ok(await p.evaluate(() => document.getElementById('aqh-menu').hidden), `${w}: Esc closes drawer`);
    await p.click('#aqh-burger'); await p.waitForTimeout(400);
    await p.click('#aqn-drawer-scrim', { position: { x: 8, y: 300 } }); await p.waitForTimeout(450);
    ok(await p.evaluate(() => document.getElementById('aqh-menu').hidden), `${w}: scrim closes drawer`);
    await p.click('#aqh-burger'); await p.waitForTimeout(400);
    await p.click('#aqh-menu a[href="#matrix"]'); await p.waitForTimeout(500);
    ok(await hs() === '#matrix' && await p.evaluate(() => document.getElementById('aqh-menu').hidden), `${w}: drawer link navigates and closes`);
    // search from drawer
    await p.click('#aqh-burger'); await p.waitForTimeout(400);
    await p.click('[data-aqn-search]'); await p.waitForTimeout(700);
    ok(await p.evaluate(() => !!document.querySelector('.aqh-layer.is-open, .aqh-layer--panel.is-open, .aqh-layer.open')), `${w}: search opens from drawer`);
    await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    // content not covered: last element bottom clearance
    await p.goto(BASE + '#compat'); await p.waitForTimeout(600);
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(300);
    const clr = await p.evaluate(() => { const nb = document.querySelector('nav.bnav').getBoundingClientRect().top; const pb = parseFloat(getComputedStyle(document.body).paddingBottom); return pb >= document.querySelector('nav.bnav').offsetHeight; });
    ok(clr, `${w}: body reserves space under bottom nav`);
    // EN / LTR
    await p.click('#aqh-burger'); await p.waitForTimeout(400); await p.click('[data-aqn-lang]'); await p.waitForTimeout(700);
    const dir = await p.evaluate(() => document.documentElement.dir);
    ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${w}: no hscroll in ${dir}`);
    await p.click('#aqh-burger').catch(() => {}); await p.waitForTimeout(300);
    ok(await p.evaluate(() => { const r = document.getElementById('aqh-menu').getBoundingClientRect(); return r.left >= -1 && r.right <= innerWidth + 1; }), `${w}: drawer inside viewport in ${dir}`);
    await p.close();
  }
  for (const w of [1100, 1280, 1440]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    p.on('pageerror', e => errs.push(e.message));
    await p.goto(BASE + '#home'); await p.waitForTimeout(900);
    ok(await p.evaluate(() => getComputedStyle(document.querySelector('nav.bnav')).display === 'none'), `${w}: bnav hidden`);
    ok(await p.evaluate(() => getComputedStyle(document.getElementById('aqh-burger')).display === 'none'), `${w}: burger hidden`);
    ok(await p.evaluate(() => { const n = document.querySelector('.aqh-nav'); return [...n.children].every(c => { const r = c.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }); }), `${w}: nav fully visible`);
    ok(await p.evaluate(() => { const t = document.querySelector('.aqh-tools').getBoundingClientRect(); return t.left >= 0; }), `${w}: tools inside viewport`);
    ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${w}: no hscroll`);
    await p.hover('.aqh-drop-btn'); await p.waitForTimeout(300);
    await p.click('.aqh-drop-menu a[href="#lifepath"]'); await p.waitForTimeout(500);
    ok(await p.evaluate(() => location.hash) === '#lifepath', `${w}: dropdown -> lifepath`);
    ok(await p.evaluate(() => document.querySelector('.aqh-drop-btn').classList.contains('is-current')), `${w}: discover marked current`);
    await p.click('.aqh-nav a[href="#featured-content"]'); await p.waitForTimeout(500);
    ok(await p.evaluate(() => location.hash) === '#featured-content', `${w}: featured link`);
    await p.click('.aqh-icon-account'); await p.waitForTimeout(400);
    ok(await p.evaluate(() => location.hash) === '#account', `${w}: account icon`);
    await p.close();
  }
  ok(errs.length === 0, 'no JS errors ' + JSON.stringify(errs.slice(0, 3)));
  console.log(`\n${pass} pass ${fail} fail`); await b.close(); process.exitCode = fail ? 1 : 0;
})();
