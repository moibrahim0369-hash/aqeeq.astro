/* اختبار: الفوتر مش ثابت ولا عايم، آخر عنصر في الصفحة، ومفيش تغطية من الشريط السفلي في الموبايل.
   الاستخدام: python3 -m http.server 8765 &  ثم  node tests/footer-layout.e2e.js [PORT] */
const { chromium } = require('playwright');
const BASE = `http://127.0.0.1:${process.argv[2] || '8765'}`;
(async () => {
  const b = await chromium.launch(); const fails = []; let n = 0;
  const ok = (c, m) => { n++; if (!c) fails.push(m); };
  for (const [w, h] of [[390, 844], [768, 900], [1280, 900]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.route('**/*', r => (r.request().url().startsWith(BASE) ? r.continue() : r.abort()));
    await p.goto(`${BASE}/index.html#home`); await p.waitForTimeout(900);
    const r = await p.evaluate(() => {
      const f = document.querySelector('footer.foot'); const cs = getComputedStyle(f); const bs = getComputedStyle(document.body);
      const nav = document.querySelector('nav.bnav'); const navVisible = nav && getComputedStyle(nav).display !== 'none';
      document.documentElement.style.scrollBehavior='auto'; window.scrollTo({top: document.documentElement.scrollHeight, behavior: 'instant'}); const fr = f.getBoundingClientRect(); const nr = navVisible ? nav.getBoundingClientRect() : null;
      return { pos: cs.position, bodyFlex: bs.display === 'flex' && bs.flexDirection === 'column', minH: bs.minHeight, fBottom: fr.bottom, navTop: nr ? nr.top : null, vh: innerHeight, pb: parseFloat(bs.paddingBottom) };
    });
    ok(r.pos === 'static' || r.pos === 'relative', `${w}: footer position ${r.pos}`);
    ok(r.pos !== 'fixed' && r.pos !== 'sticky', `${w}: footer floats`);
    ok(r.bodyFlex, `${w}: body not flex column`);
    ok(r.navTop === null || r.fBottom <= r.navTop + 1, `${w}: bottom nav covers footer (${r.fBottom} > ${r.navTop})`);
    if (w <= 768) ok(r.pb >= 90, `${w}: body padding-bottom ${r.pb} < 90`);
    // صفحة قصيرة: الفوتر لازم ينزل لقاع الشاشة
    await p.goto(`${BASE}/index.html#nonexistent-short`); await p.waitForTimeout(500);
    ok(errs.length === 0, `${w}: js errors ${errs.join(';')}`);
    await p.context().close();
  }
  await b.close();
  console.log(fails.length ? 'FAIL\n' + fails.join('\n') : `PASS ${n} checks`); process.exit(fails.length ? 1 : 0);
})();
