const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8765';
// كيرون بقى محسوبًا بدقة من محرك الموقع (جدول NASA/JPL Horizons): يظهر في العبور بلا وسم "تقريبي"،
// ولا يظهر اسمه في تنبيه المواضع التقريبية. التنبيه قد يظهر لأجرام أخرى خارج النطاق فقط.
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.route('**/*', (r) => (r.request().url().startsWith(BASE) ? r.continue() : r.abort()));
  await p.goto(BASE + '/index.html#chart');
  await p.fill('#f-name', 'x'); await p.fill('#f-date', '1999-09-25'); await p.fill('#f-time', '12:00');
  await p.evaluate(() => { const s = document.querySelector('#f-city'); const o = [...s.options].find((x) => x.textContent.includes('القاهرة')); s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); });
  await p.click('#cform button[type=submit]');
  await p.waitForSelector('#aqeek-personal-transits .aqt-body.transit[data-key="Chiron"]', { timeout: 15000, state: 'attached' });
  const note = await p.evaluate(() => { const n = document.querySelector('#aqeek-personal-transits [data-approx-bodies]'); return n ? n.textContent : ''; });
  const footer = await p.textContent('#aqeek-personal-transits .aqt-foot');
  const ok = !note.includes('كيرون') && !errs.length;
  console.log(ok ? 'PASS' : 'FAIL', '| note:', note, '| footer:', footer, '|', errs.join(';'));
  await b.close(); process.exit(ok ? 0 : 1);
})();
