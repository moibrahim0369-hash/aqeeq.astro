/* اختبار: التفسيرات داخل الأكورديون (بدون نوافذ/أزرار/أداة تقييم/رسائل نقص) + الأركانا 17 مغطاة + التبويبات ثابتة.
   الاستخدام: python3 -m http.server 8765 &  ثم  node tests/matrix-inline.e2e.js [PORT] */
const { chromium } = require('playwright');
const port = process.argv[2] || '8765';
const BASE = `http://127.0.0.1:${port}`;
const DATES = ['1998-11-11', '1999-09-25', '1980-01-13', '1980-07-13', '1980-10-13', '1970-02-13', '1970-03-13', '1976-03-03'];
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
        cards: document.querySelectorAll('#aqm-sec-chakras .aqm-chakra-card').length, cardsEmpty: [...document.querySelectorAll('#aqm-sec-chakras .aqm-chakra-card')].filter(c => c.innerText.length < 120).length,
        lines: ['father_line', 'mother_line'].map(s => document.querySelectorAll(`#aqm-sec-${s} .aqm-line-entry`).length),
        unified: ['talents', 'ancestral_programs', 'children_line', 'transformation_rx'].map(s => document.querySelectorAll(`#aqm-sec-${s} .aqm-line-entry`).length),
        personal: (() => { const e = document.querySelectorAll('#aqm-sec-personal .aqm-line-entry'); const t = e[0] ? e[0].innerText : ''; return { n: e.length, len: t.length, light: !!document.querySelector('#aqm-sec-personal .is-light'), shadow: !!document.querySelector('#aqm-sec-personal .is-shadow') }; })(),
        composite: [...document.querySelectorAll('#aqm-sec-composite_programs .aqm-line-entry')].map(e => ({ len: e.innerText.length, badges: e.querySelectorAll('.aqm-badge-arcana').length, light: !!e.querySelector('.is-light') })),
        deeper22: window.__d22 || 0,
        slots: ['center', 'love_line', 'money_line', 'purposes', 'karmic_tail'].map(s => { const g = document.querySelector(`#aqm-sec-${s} [data-slot="gemini"]`); return g ? g.innerText.length : 0; }) };
    });
    const tag = `${date}@${vw}`;
    // مفتاح النص = الرقم الأصلي 1..22 بدون أي تقليص (10 عجلة الحظ لا الساحر، 12 المعلّق لا الإمبراطورة، 22 الأحمق)
    const [yy, mm, dd] = date.split('-').map(Number);
    const E = await p.evaluate(([y, m, d]) => window.AqeeqMatrixMethodAdapter.calculateDestinyMatrix({ year: y, month: m, day: d }).anchors.E, [yy, mm, dd]);
    const keyOk = await p.evaluate(E => { const it = document.querySelector('#aqm-sec-center'); return it.querySelector('.aqm-badge-arcana').textContent.startsWith(String(E)) && new RegExp('(?:\\(|الأركانا )' + E + '[ )/·]').test(it.querySelector('[data-slot="gemini"]').innerText); }, E);
    ok(keyOk, `${tag}: center text key != engine arcana ${E}`);
    ok(!r.unavail, `${tag}: missing/pending notice visible`); ok(!r.assess, `${tag}: self-assessment visible`);
    ok(r.btns === 0 && r.missingCards === 0, `${tag}: buttons/missing cards present`);
    ok(r.cards === 7 && r.cardsEmpty === 0, `${date}@${vw}: chakra readings ${r.cards}/${r.cardsEmpty}`);
    ok(r.unified.join() === '3,2,2,3', `${date}@${vw}: unified sections ${r.unified}`);
    ok(r.personal.n === 1 && r.personal.len > 200 && r.personal.light && r.personal.shadow, `${tag}: personal section ${JSON.stringify(r.personal)}`);
    ok(r.composite.length === 3 && r.composite.every(c => c.len > 150 && c.badges === 3 && c.light), `${tag}: composite section ${JSON.stringify(r.composite)}`);
    ok(r.lines.every(l => l === 2), `${date}@${vw}: father/mother line entries ${r.lines}`);
    ok(r.slots.every(l => l > 300), `${tag}: a section has no inline text ${r.slots}`);
    await p.evaluate(() => document.querySelector('.aqm-svg .aqm-node[data-section="love_line"]').dispatchEvent(new MouseEvent('click', { bubbles: true })));
    await p.waitForTimeout(500);
    ok(await p.evaluate(() => !document.querySelector('.aqm-xr-modal:not([hidden])') && document.querySelector('#aqm-sec-love_line').classList.contains('open')), `${tag}: node click must open accordion, no modal`);
    // التبويبات: ثابتة أسفل الهيدر (ننتظر انتهاء التمرير السلس أولاً)
    await p.waitForTimeout(1200);
    ok(errs.length === 0, `${tag}: js errors ${errs.join(';')}`);
    await p.context().close();
  }
  await b.close();
  console.log(fails.length ? 'FAIL\n' + fails.join('\n') : `PASS ${n} checks`); process.exit(fails.length ? 1 : 0);
})();
