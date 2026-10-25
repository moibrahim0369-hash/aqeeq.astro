const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8765';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.route('**/*', (r) => (r.request().url().startsWith(BASE) ? r.continue() : r.abort()));
  await p.goto(BASE + '/index.html#chart');
  await p.fill('#f-name', 'x'); await p.fill('#f-date', '1999-09-25'); await p.fill('#f-time', '12:00');
  await p.evaluate(() => { const s = document.querySelector('#f-city'); const o = [...s.options].find((x) => x.textContent.includes('القاهرة')); s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); });
  await p.click('#cform button[type=submit]');
  await p.waitForSelector('#aqeek-personal-transits [data-approx-bodies]', { timeout: 15000 });
  const t = await p.textContent('#aqeek-personal-transits [data-approx-bodies]');
  const r = await p.evaluate(() => { const T = window.AqeqPersonalTransits; return null; });
  const ok = t.includes('كيرون') && !t.includes('العقدة') && !errs.length;
  console.log(ok ? 'PASS' : 'FAIL', t, errs.join(';'));
  await b.close(); process.exit(ok ? 0 : 1);
})();
