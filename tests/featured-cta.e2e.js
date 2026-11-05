/* اختبار: صفحة المحتوى المميز — لا شريط ثابت، بطاقات دعوة سياقية، مركز العلاقات، وتهذيب النشرة.
   الاستخدام: python3 -m http.server 8765 &  ثم  node tests/featured-cta.e2e.js [PORT] */
const { chromium } = require('playwright');
const BASE = `http://127.0.0.1:${process.argv[2] || '8765'}`;
(async () => {
  const b = await chromium.launch(); const fails = []; let n = 0;
  const ok = (c, m) => { n++; if (!c) fails.push(m); };
  for (const [w, h] of [[390, 844], [1280, 900]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.route('**/*', r => (r.request().url().startsWith(BASE) ? r.continue() : r.abort()));
    await p.goto(`${BASE}/index.html#featured-content`); await p.waitForSelector('.fc-row', { timeout: 8000 }); await p.waitForTimeout(600);
    const r = await p.evaluate(() => {
      const news = document.querySelector('.fc-news'), foot = document.querySelector('.fc-foot');
      const inp = document.querySelector('.fc-news-form input').getBoundingClientRect(), btn = document.querySelector('.fc-news-btn').getBoundingClientRect();
      return { band: document.querySelectorAll('.fc-band').length, txt: /ابدأ من تاريخ ميلادك/.test(document.body.innerText),
        ctas: [...document.querySelectorAll('.fc-row .fc-cta')].map(c => c.dataset.cta + '>' + c.querySelector('a').getAttribute('href')),
        gap: Math.round(foot.getBoundingClientRect().top - news.getBoundingClientRect().bottom), rad: getComputedStyle(news).borderRadius,
        stacked: Math.abs(inp.left - btn.left) < 4 && btn.top > inp.top, hs: document.documentElement.scrollWidth > innerWidth };
    });
    ok(r.band === 0 && !r.txt, `${w}: static banner still present`);
    ok(r.ctas.join() === 'chart>#chart,chart>#chart,life>#lifepath,matrix>#matrix,rel>#relationships', `${w}: row CTAs ${r.ctas}`);
    ok(r.rad === '16px', `${w}: newsletter radius ${r.rad}`);
    ok(r.gap >= 30 && r.gap <= 60, `${w}: newsletter-footer gap ${r.gap}`);
    if (w < 800) ok(r.stacked, `${w}: newsletter form not stacked`);
    ok(!r.hs, `${w}: horizontal scroll`);
    const map = { 'pinnacles-cycles': '#lifepath', 'matrix-22-arcana': '#matrix', 'venus-in-chart': '#relationships', 'mercury-in-chart': '#chart' };
    for (const [slug, href] of Object.entries(map)) {
      await p.goto(`${BASE}/index.html#featured-content/${slug}`); await p.waitForSelector('#featured-reader .fc-art-cta', { timeout: 8000 });
      const hrefs = await p.evaluate(() => [...document.querySelectorAll('#featured-reader .fc-cta a')].map(a => a.getAttribute('href')));
      ok(hrefs.length === 1 && hrefs[0] === href, `${w}: ${slug} CTA ${hrefs} != ${href}`);
    }
    await p.goto(`${BASE}/index.html#relationships`); await p.waitForTimeout(500);
    const hub = await p.evaluate(() => ({ disp: getComputedStyle(document.getElementById('relationships')).display, links: [...document.querySelectorAll('#relationships .rh-card')].map(a => a.getAttribute('href')) }));
    ok(hub.disp === 'block' && hub.links.join() === '#compat,#compat,#lifepath-compat', `${w}: hub ${JSON.stringify(hub)}`);
    await p.goto(`${BASE}/index.html#relationships`);
    await p.click('#relationships .rh-card[data-rh=lifepath]'); await p.waitForTimeout(500);
    ok(await p.evaluate(() => location.hash === '#lifepath' && document.getElementById('lpx-tabbox').dataset.tab === 'compat'), `${w}: hub life-path card must open compat tab`);
    ok(errs.length === 0, `${w}: js errors ${errs.join(';')}`);
    await p.context().close();
  }
  await b.close();
  console.log(fails.length ? 'FAIL\n' + fails.join('\n') : `PASS ${n} checks`); process.exit(fails.length ? 1 : 0);
})();
