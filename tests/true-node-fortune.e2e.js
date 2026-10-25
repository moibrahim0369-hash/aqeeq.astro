const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'http://127.0.0.1:8765';
let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
async function chart(date, time) {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.route('**/*', async (r) => {
    const u = r.request().url();
    if (u.includes('index.html')) {
      let t = fs.readFileSync('/home/claude/aqeeq.astro/index.html', 'utf8');
      const i = t.indexOf('function renderResult(S)'); const j = t.indexOf('root.innerHTML = h;', i);
      t = t.slice(0, j) + 'window.__ch = S.ch; ' + t.slice(j);
      return r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: t });
    }
    return u.startsWith(BASE) ? r.continue() : r.abort();
  });
  await p.goto(BASE + '/index.html#chart');
  await p.fill('#f-name', 'x'); await p.fill('#f-date', date); await p.fill('#f-time', time);
  await p.evaluate(() => { const s = document.querySelector('#f-city'); const o = [...s.options].find((x) => x.textContent.includes('القاهرة')); s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); });
  await p.click('#cform button[type=submit]');
  await p.waitForFunction(() => window.__ch, null, { timeout: 15000 });
  const r = await p.evaluate(() => {
    const f = __ch.bodies.find((x) => x.key === 'fortune');
    const rows = [...document.querySelectorAll('.tbl .tr')].map((x) => x.textContent);
    return {
      keys: __ch.bodies.map((x) => x.key), fortune: f, rows: rows.join('|'),
      titles: [...document.querySelectorAll('g.pg title')].map((x) => x.textContent),
      el: JSON.stringify(__ch.elements || null) + JSON.stringify(__ch.modalities || null),
    };
  });
  r.errs = errs;
  const tr = await p.evaluate(() => {
    const T = window.AqeqPersonalTransits; const nat = __ch.bodies.filter((x) => ['sun','moon','mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto'].includes(x.key));
    try { const o = T.calculateTransits(nat, new Date(Date.UTC(2026, 9, 24, 12)), { lat: 30.04, lon: 31.23 }); const n = (o.transits || o).find((x) => x.key === 'TrueNode'); return n ? { lon: n.lon, approx: !!n.approximate } : null; } catch (e) { return { err: e.message }; }
  });
  r.tr = tr; await b.close(); return r;
}
(async () => {
  const day = await chart('1999-09-25', '12:00');
  ok(day.keys.includes('truenode') && day.keys.includes('fortune') && day.keys.includes('node'), 'day: node/truenode/fortune bodies exist');
  ok(day.fortune && day.fortune.day === true, 'day chart: fortune.day === true');
  ok(day.rows.includes('سهم السعادة') && day.rows.includes('العقدة الشمالية (حقيقية)') && day.rows.includes('العقدة الشمالية (متوسطة)'), 'planet table lists the 3 new/renamed rows');
  ok(day.titles.some((t) => t.includes('سهم السعادة')) && day.titles.some((t) => t.includes('حقيقية')), 'wheel glyphs carry <title>');
  ok(day.errs.length === 0, 'no JS errors (day) ' + day.errs.join(';'));
  ok(day.tr && !day.tr.err && day.tr.approx === false && Math.abs(((day.tr.lon - 327.8915576456225 + 540) % 360) - 180) * 3600 < 15, 'transit TrueNode from engine, not approximate, within 15" of Swiss ' + JSON.stringify(day.tr));
  const night = await chart('2000-01-01', '00:00');
  ok(night.fortune && night.fortune.day === false, 'night chart: fortune.day === false');
  ok(Math.abs(((night.fortune.lon - 253.17256919793223 + 540) % 360) - 180) * 3600 < 15, 'night fortune within 15" of Swiss: ' + night.fortune.lon);
  ok(night.errs.length === 0, 'no JS errors (night)');
  const unk = await (async () => { const b = await chromium.launch(); const p = await b.newPage(); const e = []; p.on('pageerror', (x) => e.push(x.message)); await p.goto(BASE + '/index.html#chart'); await p.fill('#f-name', 'x'); await p.fill('#f-date', '1999-09-25'); await p.evaluate(() => { const c = document.querySelector('#f-notime, input[type=checkbox]'); if (c) { c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); } const s = document.querySelector('#f-city'); const o = [...s.options].find((x) => x.textContent.includes('القاهرة')); s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); }); await p.click('#cform button[type=submit]'); await p.waitForTimeout(1500); await b.close(); return e; })();
  ok(unk.length === 0, 'unknown-time chart: no JS errors ' + unk.join(';'));
  console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
})();
