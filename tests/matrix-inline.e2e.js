/* اختبار: التفسيرات داخل الأكورديون (بدون نوافذ/أزرار/أداة تقييم/رسائل نقص) + الأركانا 17 مغطاة + التبويبات ثابتة.
   الاستخدام: python3 -m http.server 8765 &  ثم  node tests/matrix-inline.e2e.js [PORT] */
const { chromium } = require('playwright');
const port = process.argv[2] || '8765';
const BASE = `http://127.0.0.1:${port}`;
const DATES = ['1998-11-11', '1999-09-25', '1980-01-13', '1980-07-13', '1980-10-13'];
(async () => {
  const b = await chromium.launch(); const fails = []; let n = 0;
  const ok = (c, m) => { n++; if (!c) fails.push(m); };
  for (const [vw, vh] of [[1000, 800], [390, 844]]) for (const date of DATES) {
    const p = await (await b.newContext({ viewport: { width: vw, height: vh } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.route('**/*', r => (r.request().url().startsWith(BASE) ? r.continue() : r.abort()));
    await p.goto(`${BASE}/index.html#matrix`); await p.waitForTimeout(800);
    await p.evaluate(() => { document.querySelector('#mform').hidden = false; });
    await p.fill('#m-date', date); await p.click('#mform button[type=submit]');
    await p.waitForSelector('.aqm-svg'); await p.waitForFunction(() => !document.querySelector('.aqm-slot-gemini .aqm-xr-loading'), null, { timeout: 8000 });
    await p.waitForTimeout(600);
    const r = await p.evaluate(() => {
      const t = document.body.innerText;
      return { unavail: /غير متوفر|قيد الإعداد|Pending Content|نص مولَّد/.test(t), assess: /للتقييم والتأمل|ينطبق تماماً|لا يمثلني/.test(t),
        btns: document.querySelectorAll('.aqm-master-open, .aqm-g-goto-btn').length, missingCards: document.querySelectorAll('.aqm-g-missing').length,
        slots: ['center', 'love_line', 'money_line', 'purposes', 'karmic_tail'].map(s => { const g = document.querySelector(`#aqm-sec-${s} [data-slot="gemini"]`); return g ? g.innerText.length : 0; }) };
    });
    const tag = `${date}@${vw}`;
    ok(!r.unavail, `${tag}: missing/pending notice visible`); ok(!r.assess, `${tag}: self-assessment visible`);
    ok(r.btns === 0 && r.missingCards === 0, `${tag}: buttons/missing cards present`);
    ok(r.slots.every(l => l > 300), `${tag}: a section has no inline text ${r.slots}`);
    await p.evaluate(() => document.querySelector('.aqm-svg .aqm-node[data-section="love_line"]').dispatchEvent(new MouseEvent('click', { bubbles: true })));
    await p.waitForTimeout(500);
    ok(await p.evaluate(() => !document.querySelector('.aqm-xr-modal:not([hidden])') && document.querySelector('#aqm-sec-love_line').classList.contains('open')), `${tag}: node click must open accordion, no modal`);
    // التبويبات: ثابتة أسفل الهيدر
    const tops = [];
    for (const dy of [0, 900, 1800]) { await p.evaluate(dy => { const m = document.querySelector('#matrix'); m.scrollTop += dy; }, dy); await p.waitForTimeout(200); tops.push(await p.evaluate(() => { const t = document.querySelector('.aqm-tabs').getBoundingClientRect().top; return Math.round(t); })); }
    const hdr = await p.evaluate(() => Math.round(document.querySelector('header.top').getBoundingClientRect().bottom));
    ok(tops.every(t => t >= hdr - 2 && t <= hdr + 12), `${tag}: tabs bar not pinned under header ${tops} vs ${hdr}`);
    ok(errs.length === 0, `${tag}: js errors ${errs.join(';')}`);
    await p.context().close();
  }
  await b.close();
  console.log(fails.length ? 'FAIL\n' + fails.join('\n') : `PASS ${n} checks`); process.exit(fails.length ? 1 : 0);
})();
