const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8765';
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.route('**/*', (r) => (r.request().url().startsWith(BASE) ? r.continue() : r.abort()));
  await p.goto(BASE + '/index.html#matrix'); await p.waitForTimeout(1000);
  await p.evaluate(() => { const f = document.querySelector('#mform'); f.hidden = false; });
  await p.fill('#m-date', '1999-09-25');
  await p.click('#mform button[type=submit]'); await p.waitForTimeout(1500);
  const r = await p.evaluate(() => ({
    gloss: document.querySelectorAll('.aqm-gloss').length,
    en: [...document.querySelectorAll('.aqm-gloss .aqm-t-en')].map((x) => x.textContent),
    ar: document.querySelectorAll('.aqm-gloss .aqm-t-ar').length,
    purposes: (() => { const sec = document.querySelector('#aqm-sec-purposes'); return sec ? { title: sec.querySelector('.aqm-acc-title').textContent.trim(), badges: sec.querySelectorAll('.aqm-badge-arcana').length } : null; })(),
    err: (document.querySelector('#merr:not([hidden])') || {}).textContent || '',
    tail: !!document.body.textContent.match(/Karmic Tail/), anc: !!document.body.textContent.match(/Ancestral Lines/),
  }));
  ok(r.gloss === 9 && r.ar === 9, 'glossary has 9 points each with small Arabic title: ' + JSON.stringify(r.en));
  // قسم «المهمة والغاية» موجود بعنوانه وشارة أركانا واحدة على الأقل (النص التفصيلي من مكتبة المحتوى)
  ok(!!r.purposes && /الغاية|المهمة/.test(r.purposes.title) && r.purposes.badges >= 1, 'purposes section present with arcana badge: ' + JSON.stringify(r.purposes));
  ok(r.tail && r.anc && !r.err, 'Karmic Tail + Ancestral Lines titles present');
  // الخريطة مرجع ثابت: الضغط على عقدة يفتح لوحة تفسير الموضع بعنوان (أكاديمي + مبسّط)
  await p.evaluate(() => document.querySelector('.aqm-node').dispatchEvent(new MouseEvent('click', { bubbles: true }))); await p.waitForTimeout(600);
  const sheet = await p.textContent('.aqm-xr-sheet .aqm-xr');
  ok(/\(.+\)/.test(sheet) && sheet.includes('الأركانا'), 'node click opens position sheet with academic + plain title: ' + sheet.trim().slice(0, 60));
  ok(errs.length === 0, 'no JS errors ' + errs.join(';'));
  await b.close(); console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
})();
