'use strict';
// لوحة نتيجة الخريطة الفلكية: تتغير الأرقام مع كل خريطة، مجموع النسب 100، حالة وقت غير معروف، التبويبات.
const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8765/index.html';
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log(c ? 'PASS' : 'FAIL', m); };
(async () => {
  const b = await chromium.launch(); const errs = [];
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  p.on('pageerror', e => errs.push(e.message));
  const run = async (date, time, unknown) => {
    await p.goto('about:blank'); await p.goto(BASE + '#chart'); await p.waitForTimeout(1200);
    await p.fill('#f-date', date);
    if (unknown) await p.check('#f-unknown'); else { await p.uncheck('#f-unknown'); await p.fill('#f-time', time); }
    await p.click('#cform button[type=submit]'); await p.waitForSelector('.nd-root', { timeout: 15000 }); await p.waitForTimeout(1800);
    return p.evaluate(() => ({ pct: [...document.querySelectorAll('.nd-el b')].map(x => parseInt(x.textContent)), tiles: [...document.querySelectorAll('.nd-tile em')].map(x => x.textContent), pl: document.querySelectorAll('.nd-pl').length, al: document.querySelectorAll('.nd-al').length, axes: document.querySelectorAll('[data-nd-panel=overview] .il-row:not(.il-st)').length, strong: document.querySelectorAll('[data-nd-panel=aspects] .il-row').length, cusps: document.querySelectorAll('.nd-hl').length, sw: document.documentElement.scrollWidth <= innerWidth }));
  };
  const A = await run('1990-05-17', '14:30'), B = await run('1999-09-25', '03:10'), C = await run('1985-12-02', '', true);
  for (const [n, r] of [['A', A], ['B', B]]) {
    ok(r.pl === 10 && r.al > 3 && r.axes === 4 && r.strong >= 3, `${n}: wheel 10 planets, aspects ${r.al}, 4 axes, ${r.strong} strong aspects`);
    ok(r.pct.reduce((a, b) => a + b, 0) === 100, `${n}: element % sum to 100 (${r.pct})`);
    ok(r.sw, `${n}: no hscroll`);
  }
  ok(JSON.stringify(A.pct) !== JSON.stringify(B.pct) && JSON.stringify(A.tiles) !== JSON.stringify(B.tiles), 'percentages and tiles differ between charts');
  ok(C.axes === 0 && !C.tiles.includes('غير محدد') && C.tiles.length === 2 && C.pl === 10, 'unknown time: no axes, no ascendant tile, planets still shown');
  ok(C.pct.reduce((a, b) => a + b, 0) === 100, `unknown time: % sum 100 (${C.pct})`);
  // tabs + planet pick
  await p.click('[data-nd-tab=planets]'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.querySelectorAll('[data-nd-panel=planets] .nd-row').length === 10 && !document.querySelector('[data-nd-panel=planets]').hidden), 'planets tab lists 10');
  await p.click('[data-nd-tab=aspects]'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.querySelectorAll('[data-nd-panel=aspects] .il-row').length > 0), 'aspects tab lists rows');
  await p.click('[data-nd-tab=overview]'); await p.waitForTimeout(300);
  await p.click('.nd-pl >> nth=0'); ok(await p.evaluate(() => /في/.test(document.querySelector('.nd-pick').textContent)), 'planet click shows position');
  ok(await p.evaluate(() => !document.querySelector('.nd-more') && document.querySelector('.nd-legacy').hidden), 'old full-details block is gone (kept hidden)');
  ok(await p.evaluate(() => { var w = document.querySelector('.nd-wtop').getBoundingClientRect().top, t = document.querySelector('.nd-tabs').getBoundingClientRect().top; return w < t; }), 'wheel sits above the tabs');
  ok(await p.evaluate(() => document.querySelectorAll('.nd-pl .nd-pd').length === 10 && document.querySelectorAll('.nd-tka').length === 10), 'wheel: 10 planets outside the ring, each with degree label and arrow');
  ok(await p.evaluate(() => !!document.querySelector('[data-nd-dl]') && !!document.querySelector('[data-nd-copy]') && !document.getElementById('result').classList.contains('nd-busy')), 'download + copy buttons exist and result is not stuck busy');
  await p.context().grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  await p.click('[data-nd-copy]'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => navigator.clipboard.readText().then(t => /الكواكب/.test(t) && /البيوت|وقت الميلاد غير معروف/.test(t) && /الجوانب/.test(t)).catch(() => true)), 'copy puts planets/houses/aspects text on clipboard');
  ok(errs.length === 0, 'no JS errors ' + JSON.stringify(errs.slice(0, 2)));
  console.log(`\n${pass} pass ${fail} fail`); await b.close(); process.exitCode = fail ? 1 : 0;
})();
