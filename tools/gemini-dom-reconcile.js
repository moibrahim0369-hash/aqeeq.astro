/* مطابقة على مستوى الصفحة: لكل (موضع × رقم) وكل ذيل، تُرسم النافذة فعليًا في المتصفح ثم تُقارن كلمات النص المعروض
   بكلمات ملف المصدر الخام (docs/gemini-reconciliation.json). الاستخدام: node tools/gemini-dom-reconcile.js [port]
   يتطلب خادمًا محليًا على المنفذ (python3 -m http.server PORT) وPlaywright. */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const port = process.argv[2] || '8791';
const recon = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/gemini-reconciliation.json'), 'utf8'));
const inv = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/gemini-inventory.json'), 'utf8'));
const tok = t => t.replace(/\*/g, '').split(/\s+/).filter(x => /[\p{L}\p{N}_]/u.test(x));
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(`http://localhost:${port}/index.html#matrix`);
  await p.fill('#m-date', '1998-11-11'); await p.click('#mform button[type=submit]');
  await p.waitForSelector('.aqm-svg'); await p.waitForTimeout(800);
  const rows = [];
  const grab = (kind, ...args) => p.evaluate(async ([kind, a, b2]) => {
    const html = kind === 'tail' ? await AqeeqMatrixUI.geminiTailHtml(a) : await AqeeqMatrixUI.geminiPositionHtml(a, b2, null);
    const d = document.createElement('div'); d.style.cssText = 'position:fixed;left:0;top:0;width:600px;white-space:normal';
    d.innerHTML = html; document.body.appendChild(d);
    d.querySelectorAll('[hidden]').forEach(x => x.hidden = false);
    const out = { pos: (d.querySelector('[data-g-panel="pos"]') || d.querySelector('.aqm-g-panel')).innerText,
                  ref: (d.querySelector('[data-g-panel="ref"]') || { innerText: '' }).innerText,
                  missing: d.querySelectorAll('[data-g-missing]').length, title: d.querySelector('h4').innerText };
    d.remove(); return out;
  }, [kind, args[0], args[1]]);
  for (const r of recon) {
    let got, words_after, ok;
    if (r.kind === 'position') {
      got = await grab('pos', r.key, r.number); words_after = tok(got.pos);
      // لوحة الموضع = ترويسة الملف + الوحدة؛ نقارن بمجموع الترويسة والوحدة
      const hdr = recon.find(x => x.kind === 'position-header' && x.number === r.number && x.file === r.file);
      ok = words_after.length === r.words_source + hdr.words_source; r.words_after = words_after.length - hdr.words_source;
    } else if (r.kind === 'reference') {
      got = await grab('pos', 'core', r.number); words_after = tok(got.ref); ok = words_after.length === r.words_source; r.words_after = words_after.length;
    } else if (r.kind === 'tail') {
      got = await grab('tail', r.key); words_after = tok(got.title + ' ' + got.pos).length; // العنوان بدون «عقيق أسترو |»
      ok = words_after + 2 === r.words_source; r.words_after = words_after + 2;
    } else { continue; }
    r.dom_match = ok; rows.push(r);
  }
  const bad = rows.filter(r => !r.dom_match);
  // اختبار الربط: كل عقدة تفتح (position, arcana) الخاصة بها
  const nodes = await p.$$eval('.aqm-svg .aqm-node', ns => ns.map(n => ({ pos: n.dataset.position, arc: n.dataset.arcana, sec: n.dataset.section })));
  const wiring = [];
  for (let i = 0; i < nodes.length; i++) {
    await p.evaluate(i => document.querySelectorAll('.aqm-svg .aqm-node')[i].dispatchEvent(new MouseEvent('click', { bubbles: true })), i);
    await p.waitForSelector('.aqm-g[data-g-position]', { timeout: 4000 });
    const r = await p.evaluate(() => { const a = document.querySelector('.aqm-xr-modal .aqm-g'); return { pos: a.dataset.gPosition, arc: a.dataset.gArcana, missing: !!a.querySelector('[data-g-panel="pos"] [data-g-missing]') }; });
    wiring.push({ node: nodes[i], opened: r, ok: r.pos === nodes[i].pos && r.arc === nodes[i].arc });
    await p.keyboard.press('Escape'); await p.waitForTimeout(40);
  }
  fs.writeFileSync(path.join(__dirname, '../docs/gemini-dom-reconciliation.json'), JSON.stringify({ rows, wiring, errors: errs }, null, 1));
  console.log('rows', rows.length, 'dom mismatches', bad.length, '| nodes', nodes.length, 'wiring ok', wiring.filter(w => w.ok).length, '| errors', errs.length);
  bad.slice(0, 8).forEach(x => console.log('BAD', x.kind, x.key, x.number, x.words_source, x.words_after));
  wiring.filter(w => !w.ok).forEach(w => console.log('WIRING BAD', JSON.stringify(w)));
  await b.close();
  process.exit(bad.length || wiring.some(w => !w.ok) || errs.length ? 1 : 0);
})();
