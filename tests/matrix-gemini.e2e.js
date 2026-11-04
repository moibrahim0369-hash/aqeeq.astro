/* اختبار عملي: المواضع والتفسيرات (Gemini) — ربط الموضع+الرقم، اكتمال النص، غياب المحتوى القديم والمكرر.
   الاستخدام: python3 -m http.server PORT &  ثم  node tests/matrix-gemini.e2e.js PORT  (يتطلب Playwright) */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const port = process.argv[2] || '8791';
const sec = n => JSON.parse(fs.readFileSync(path.join(__dirname, '../assets/data/matrix/sections/' + n + '.json'), 'utf8')).entries;
const tok = t => t.replace(/\*/g, '').split(/\s+/).filter(x => /[\p{L}\p{N}_]/u.test(x));
// بصمات النصوص القديمة (أول 40 حرفًا من summary في ملفات الأقسام القديمة) يجب ألا تظهر في الواجهة
const OLD = [];
['center', 'love_line', 'money_line', 'talents', 'father_line', 'mother_line', 'purposes', 'ancestral_programs', 'children_line', 'transformation_rx'].forEach(n => sec(n).forEach(e => { if (e.summary && e.summary.length > 40) OLD.push(e.summary.slice(0, 40)); }));
// بصمة قديمة تُحتسب «قديمة» فقط إن لم تكن موجودة حرفيًا في مصدر Gemini (بعض النصوص القديمة كانت مقتطفات حرفية منه)
const GEM = fs.readdirSync(path.join(__dirname, '../assets/data/matrix/gemini')).filter(f => f.endsWith('.json')).map(f => fs.readFileSync(path.join(__dirname, '../assets/data/matrix/gemini', f), 'utf8')).join('');
const GEMN = GEM.replace(/\s+/g, '');
for (let i = OLD.length - 1; i >= 0; i--) if (GEMN.includes(OLD[i].replace(/\s+/g, ''))) OLD.splice(i, 1);
const DATES = ['1998-11-11', '1999-09-25', '1998-01-07', '2000-05-15', '1990-01-01', '1985-03-17'];
(async () => {
  const b = await chromium.launch(); const fails = []; let checks = 0; const summary = [];
  const ok = (c, m) => { checks++; if (!c) fails.push(m); };
  for (const date of DATES) {
    const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(`http://localhost:${port}/index.html#matrix`); await p.fill('#m-date', date); await p.click('#mform button[type=submit]');
    await p.waitForSelector('.aqm-svg'); await p.waitForFunction(() => !document.querySelector('.aqm-slot-gemini .aqm-xr-loading'), null, { timeout: 8000 });
    await p.evaluate(() => document.querySelectorAll('.aqm-acc-item').forEach(i => i.classList.add('open')));
    await p.waitForTimeout(500);
    const info = await p.evaluate(async () => {
      const out = { acc: {}, txt: document.body.innerText, paras: [] };
      for (const sid of ['center', 'love_line', 'money_line', 'purposes', 'karmic_tail', 'personal', 'talents', 'father_line', 'mother_line', 'ancestral_programs', 'children_line', 'transformation_rx', 'composite_programs']) {
        const it = document.getElementById('aqm-sec-' + sid); if (!it) { out.acc[sid] = null; continue; }
        const g = it.querySelector('[data-slot="gemini"]');
        out.acc[sid] = { hasGemini: !!g, oldSlots: it.querySelectorAll('[data-slot="primary"],[data-slot="detailed"],[data-slot="strengths"],[data-slot="challenges"],[data-slot="practical"]').length,
          lib: it.querySelectorAll('.aqm-master-library').length, missing: g ? g.querySelectorAll('[data-g-missing]').length : 0,
          body: g ? [...g.querySelectorAll('.aqm-g-p,.aqm-g-li,.aqm-g-h1,.aqm-g-h2,.aqm-g-q p,.aqm-g-table td')].map(e => e.innerText).join(' ') : '',
          arcana: it.querySelector('.aqm-badge-arcana') ? it.querySelector('.aqm-badge-arcana').textContent : '' };
      }
      out.paras = [...document.querySelectorAll('.aqm-accordion-container .aqm-g-p,.aqm-accordion-container .aqm-g-c,.aqm-accordion-container .aqm-g-li')].map(e => e.innerText.trim()).filter(t => t.length > 40);
      return out;
    });
    // الأرقام المتوقعة من المحرك لهذا التاريخ
    const [y, m, d] = date.split('-').map(Number);
    const P = await p.evaluate(([y, m, d]) => { const P = window.AqeeqMatrixMethodAdapter.calculateDestinyMatrix({ year: y, month: m, day: d }); return { E: P.anchors.E, D: P.anchors.D, heart: P.channels.heartPoint, money: P.channels.moneyPoint, social: P.purposes.social, triad: [P.intermediate.D2, P.intermediate.D3, P.anchors.D] }; }, [y, m, d]);
    const want = { center: ['core', P.E], love_line: ['love', P.heart], money_line: ['money', P.money], purposes: ['mission', P.social], karmic_tail: ['tail_entry', P.D] };
    for (const [sid, [pos, n]] of Object.entries(want)) {
      const a = info.acc[sid]; ok(a && a.hasGemini, `${date} ${sid}: no gemini slot`);
      const f = n === 17 ? null : JSON.parse(fs.readFileSync(path.join(__dirname, `../assets/data/matrix/gemini/pos-${String(n).padStart(2, '0')}.json`), 'utf8'));
      if (!f) { ok(a.missing >= 1, `${date} ${sid}: arcana 17 must show missing`); continue; }
      const unit = f.positions[pos]; const expected = tok(unit.blocks.map(x => x.t).join(' '));
      let got = tok(a.body);
      if (sid === 'karmic_tail') {  // الجزء الأول = وحدة المدخل ثم الذيل؛ نتحقق أن وحدة المدخل بادئة النص كاملة
        ok(got.slice(0, expected.length).join(' ') === expected.join(' '), `${date} ${sid}: unit text mismatch (arcana ${n})`);
      } else {
        ok(got.join(' ') === expected.join(' '), `${date} ${sid}: text != source (${got.length} vs ${expected.length}, arcana ${n})`);
      }
      ok(a.oldSlots === 0 && a.lib === 0, `${date} ${sid}: old slots/library still present`);
    }
    for (const sid of ['personal', 'talents', 'father_line', 'mother_line', 'ancestral_programs', 'children_line', 'transformation_rx', 'composite_programs']) {
      const a = info.acc[sid]; ok(a && a.missing === 1 && a.oldSlots === 0 && a.lib === 0, `${date} ${sid}: should be a single 'not in source' card`);
    }
    // الذيل: موجود في المصدر أم لا
    const tails = JSON.parse(fs.readFileSync(path.join(__dirname, '../assets/data/matrix/gemini/tails.json'), 'utf8')).tails;
    const code = P.triad.join('-'), rev = [...P.triad].reverse().join('-');
    const t = tails.find(x => x.code === code) || tails.find(x => x.code === rev);
    const kt = info.acc.karmic_tail;
    if (t) { const tt = tok(t.blocks.map(x => x.t).join(' ')); ok(tok(kt.body).join(' ').endsWith(tt.join(' ')), `${date} tail ${t.code} text not complete`); }
    else ok(kt.missing >= 1, `${date} tail ${code} absent from source: must show missing`);
    // لا محتوى قديم
    OLD.forEach(sn => ok(!info.txt.includes(sn), `${date}: old text visible: ${sn}`));
    ['نص هذا الموضع قيد الإعداد', 'التفسير الموسع'].forEach(sn => ok(!info.txt.includes(sn), `${date}: legacy label visible: ${sn}`));
    // لا تكرار
    const seen = new Map(); info.paras.forEach(x => seen.set(x, (seen.get(x) || 0) + 1));
    [...seen].filter(([, c]) => c > 1).forEach(([x]) => ok(false, `${date}: duplicated paragraph: ${x.slice(0, 50)}`));
    // الضغط على كل عقدة
    const nodes = await p.$$eval('.aqm-svg .aqm-node', ns => ns.map(n => ({ pos: n.dataset.position, arc: n.dataset.arcana })));
    const opened = [];
    for (let i = 0; i < nodes.length; i++) {
      await p.evaluate(i => document.querySelectorAll('.aqm-svg .aqm-node')[i].dispatchEvent(new MouseEvent('click', { bubbles: true })), i);
      await p.waitForSelector('.aqm-g[data-g-position]', { timeout: 4000 });
      const r = await p.evaluate(() => { const a = document.querySelector('.aqm-xr-modal .aqm-g'); return [a.dataset.gPosition, a.dataset.gArcana, !!a.querySelector('[data-g-panel="pos"] [data-g-missing]')]; });
      ok(r[0] === nodes[i].pos && r[1] === nodes[i].arc, `${date}: node ${nodes[i].pos}:${nodes[i].arc} opened ${r[0]}:${r[1]}`);
      opened.push(r[0]); await p.keyboard.press('Escape'); await p.waitForTimeout(30);
    }
    ok(new Set(['father_top', 'father_bottom', 'mother_top', 'mother_bottom'].map(k => opened.includes(k))).size === 1 && opened.includes('father_top'), `${date}: F/G/H/I must have separate entries`);
    ok(errs.length === 0, `${date}: page errors ${errs.join('|')}`);
    summary.push(`${date}: E=${P.E} heart=${P.heart} money=${P.money} D=${P.D} tail=${t ? t.code : 'ABSENT(' + code + ')'} nodes=${nodes.length}`);
  }
  console.log(summary.join('\n'));
  console.log(`checks=${checks} failures=${fails.length}`); fails.slice(0, 25).forEach(f => console.log('FAIL', f));
  await b.close(); process.exit(fails.length ? 1 : 0);
})();
