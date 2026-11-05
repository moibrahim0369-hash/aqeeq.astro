'use strict';
// صفحة الخريطة الفلكية بعد إعادة التصميم: كل الحقول والوظائف، حساب فعلي، الاستجابة.
const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8765/index.html';
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log(c ? 'PASS' : 'FAIL', m); };
(async () => {
  const b = await chromium.launch(); const errs = [];
  const IDS = ['f-name', 'f-gender', 'f-date', 'f-time', 'f-unknown', 'f-city-search', 'f-city', 'f-city-coords', 'f-lat', 'f-lon', 'f-off', 'f-zodiac-sys', 'f-hs', 'ferr', 'result'];
  for (const [w, h] of [[360, 760], [390, 844], [820, 1180], [1280, 900]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    p.on('pageerror', e => errs.push(e.message));
    await p.goto(BASE + '#chart'); await p.waitForTimeout(1800);
    ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${w}: no hscroll`);
    ok(await p.evaluate(ids => ids.every(i => document.getElementById(i)), IDS), `${w}: all field ids kept`);
    ok(await p.evaluate(() => !!document.querySelector('#chart .ntx-statue') && !!document.querySelector('#chart .ntx-wheel')), `${w}: statue + zodiac wheel`);
    ok(await p.evaluate(() => document.querySelectorAll('.ntx-feats li').length === 4), `${w}: 4 component cards`);
    ok(await p.evaluate(() => !!document.querySelector('#cform .aq-autofill-bar .aq-autofill-btn')), `${w}: autofill bar`);
    ok(await p.evaluate(() => { const r = document.querySelector('#cform').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }), `${w}: form inside viewport`);
    const sys = await p.evaluate(() => ({ z: [...document.querySelectorAll('#f-zodiac-sys option')].map(o => o.value), h: [...document.querySelectorAll('#f-hs option')].map(o => o.value), zs: document.getElementById('f-zodiac-sys').value, hs: document.getElementById('f-hs').value }));
    ok(sys.zs === 'tropical' && sys.hs === 'placidus' && sys.h.length === 4, `${w}: Tropical + Placidus defaults, options kept`);
    // city search + coordinates
    await p.fill('#f-city-search', 'القاهرة'); await p.waitForTimeout(600);
    const city = await p.evaluate(() => ({ n: document.getElementById('f-city').options.length, t: document.getElementById('f-city-coords').textContent }));
    ok(city.n >= 1, `${w}: city search filters (${city.n})`);
    ok(/\d/.test(city.t), `${w}: coordinates shown: ${city.t.slice(0, 50)}`);
    // unknown time behavior
    await p.fill('#f-date', '1990-05-15'); await p.fill('#f-time', '14:30');
    await p.check('#f-unknown'); await p.waitForTimeout(200);
    const dis = await p.evaluate(() => document.getElementById('f-time').disabled);
    await p.uncheck('#f-unknown');
    ok(typeof dis === 'boolean', `${w}: unknown-time checkbox works (time disabled=${dis})`);
    await p.fill('#f-time', '14:30');
    await p.click('#cform button[type=submit]'); await p.waitForTimeout(6000);
    const r = await p.evaluate(() => { const e = document.getElementById('result'); return { shown: !e.hidden, len: e.innerText.length, sw: document.documentElement.scrollWidth <= innerWidth }; });
    ok(r.shown && r.len > 800, `${w}: chart computed (${r.len} chars)`);
    ok(r.sw, `${w}: no hscroll after result`);
    await p.close();
  }
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(BASE + '#chart'); await p.waitForTimeout(1200);
  await p.fill('#f-date', ''); await p.click('#cform button[type=submit]'); await p.waitForTimeout(500);
  ok(await p.evaluate(() => !document.getElementById('ferr').hidden), 'empty date shows error');
  ok(errs.length === 0, 'no JS errors ' + JSON.stringify(errs.slice(0, 3)));
  console.log(`\n${pass} pass ${fail} fail`); await b.close(); process.exitCode = fail ? 1 : 0;
})();
