// الجنس اختياري: بدونه تشتغل كل النماذج بصياغة افتراضية، ومعه تتغير الصياغة حسب الاختيار.
const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8765';
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.route('**/*', (r) => (r.request().url().startsWith(BASE) ? r.continue() : r.abort()));
  await p.goto(BASE + '/index.html#chart'); await p.waitForTimeout(1200);
  ok((await p.$$eval('select[data-gender-select]', (s) => s.filter((x) => x.required).length)) === 0, 'no gender select is required');
  ok((await p.$eval('#f-gender option', (o) => o.textContent)).includes('بدون تحديد'), 'first option is «بدون تحديد»');

  const chart = async (gender) => {
    await p.goto(BASE + '/index.html#chart'); await p.waitForTimeout(500);
    await p.fill('#f-name', 'x'); await p.fill('#f-date', '1999-09-25'); await p.fill('#f-time', '12:00');
    await p.selectOption('#f-gender', gender);
    await p.evaluate(() => { const s = document.querySelector('#f-city'); const o = [...s.options].find((x) => x.textContent.includes('القاهرة')); s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); });
    await p.click('#cform button[type=submit]'); await p.waitForTimeout(2500);
    return p.evaluate(() => ({ cw: !!document.querySelector('.cw'), err: (document.querySelector('#cform .ferr:not([hidden])') || {}).textContent || '', g: (document.querySelector('#result') || {}).dataset && document.querySelector('#result').dataset.reportGender || '', note: !!document.querySelector('#result > .gender-voice-note') }));
  };
  let r = await chart('');
  ok(r.cw && !r.err, 'natal chart computes with no gender: ' + JSON.stringify(r));
  ok(r.g === '' && !r.note, 'no voice marker when gender not chosen');
  r = await chart('female');
  ok(r.cw && r.g === 'female' && r.note, 'female: chart + voice marker: ' + JSON.stringify(r));
  r = await chart('male');
  ok(r.cw && r.g === 'male', 'male: marker set');
  r = await chart('');
  ok(r.cw && r.g === '' && !r.note, 'switching back to none clears the marker');

  // نص مؤنث/مذكر فعلاً
  const t = await p.evaluate(() => ({ f: window.AqeeqGender.transform('أنت محتاج وقت ولديه قوة', 'female'), m: window.AqeeqGender.transform('أنت محتاج', 'male'), n: window.AqeeqGender.transform('أنت محتاج', '') }));
  ok(t.f.includes('محتاجة') && t.f.includes('لديها') && t.m === 'أنت محتاج' && t.n === 'أنت محتاج', 'text adapts to female only: ' + JSON.stringify(t));

  // مسار الحياة بدون جنس
  await p.goto(BASE + '/index.html#lifepath'); await p.waitForTimeout(500);
  await p.evaluate(() => { const f = document.querySelector('#lpform'); f.hidden = false; });
  await p.fill('#lp-date', '1999-09-25');
  await p.click('#lpform button[type=submit]'); await p.waitForTimeout(800);
  ok(await p.evaluate(() => !document.querySelector('#lpresult').hidden && !(document.querySelector('#lpform .ferr:not([hidden])'))), 'life path computes with no gender');
  ok(errs.length === 0, 'no JS errors ' + errs.join(';'));
  await b.close(); console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
})();
