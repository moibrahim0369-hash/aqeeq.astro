'use strict';
// صفحة مسار الحياة بعد إعادة التصميم: الوظائف، الحقول، البطاقتان، الحساب التلقائي، الاستجابة.
const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8765/index.html';
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log(c ? 'PASS' : 'FAIL', m); };
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h] of [[360, 760], [390, 844], [820, 1180], [1280, 900]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    p.on('pageerror', e => errs.push(e.message));
    await p.goto(BASE + '#lifepath'); await p.waitForTimeout(1500);
    ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${w}: no hscroll`);
    ok(await p.evaluate(() => !!document.querySelector('#lifepath .lpx-statue') && !!document.querySelector('#lifepath .lpx-ring')), `${w}: statue + ring`);
    ok(await p.evaluate(() => ['lp-start-discover', 'lp-start-compare', 'lp-name', 'lp-gender', 'lp-date', 'lperr', 'lpresult'].every(i => document.getElementById(i))), `${w}: ids kept`);
    ok(await p.evaluate(() => document.querySelectorAll('.lpx-feats li').length === 4), `${w}: 4 benefits`);
    ok(await p.evaluate(() => !!document.querySelector('#lpform .aq-autofill-bar .aq-autofill-btn')), `${w}: autofill bar`);
    ok(await p.evaluate(() => { const r = document.querySelector('#lpform').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }), `${w}: form inside viewport`);
    ok(await p.evaluate(() => { const h = document.querySelector('#lifepath h2'); return h.textContent.trim() === 'مسار حياتك' && getComputedStyle(h).fontFamily.includes('Amiri'); }), `${w}: title + Amiri`);
    await p.fill('#lp-name', 'محمد'); await p.fill('#lp-date', '1999-09-25');
    await p.click('#lpform button[type=submit]'); await p.waitForTimeout(2500);
    const r = await p.evaluate(() => { const e = document.getElementById('lpresult'); return { shown: !e.hidden, len: e.innerText.length, sw: document.documentElement.scrollWidth <= innerWidth }; });
    ok(r.shown && r.len > 600, `${w}: result shown (${r.len})`);
    ok(r.sw, `${w}: no hscroll after result`);
    await p.close();
  }
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(BASE + '#lifepath'); await p.waitForTimeout(1200);
  await p.fill('#lp-date', '');
  await p.click('#lpform button[type=submit]'); await p.waitForTimeout(500);
  ok(await p.evaluate(() => !document.getElementById('lperr').hidden), 'empty date shows error');
  await p.click('#lp-start-compare'); await p.waitForTimeout(800);
  ok(await p.evaluate(() => location.hash) === '#life-path-synastry', 'compare card opens compatibility');
  ok(errs.length === 0, 'no JS errors ' + JSON.stringify(errs.slice(0, 3)));
  console.log(`\n${pass} pass ${fail} fail`); await b.close(); process.exitCode = fail ? 1 : 0;
})();
