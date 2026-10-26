// كل أداة في الخرائط الممتدة لازم تعرض عجلة (شكل خريطة)
const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8765';
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 375, height: 812 } }); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource:')) errs.push(m.text()); });
  await p.route('**/*', (r) => (r.request().url().startsWith(BASE) ? r.continue() : r.abort()));
  await p.goto(BASE + '/index.html#chart'); await p.waitForTimeout(1200);
  await p.fill('#f-name', 'x'); await p.fill('#f-date', '1999-09-25'); await p.fill('#f-time', '12:00');
  await p.evaluate(() => { const s = document.querySelector('#f-city'); const o = [...s.options].find((x) => x.textContent.includes('القاهرة')); s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); });
  await p.click('#cform button[type=submit]'); await p.waitForTimeout(2500);
  await p.evaluate(() => { location.hash = '#astro-maps'; }); await p.waitForTimeout(350);
  for (const mode of ['transit', 'solar', 'profections', 'eclipses', 'nodes', 'sidereal']) {
    await p.evaluate((m) => document.querySelector(`[data-eam-mode="${m}"]`).click(), mode);
    await p.waitForTimeout(300);
    await p.evaluate(() => document.querySelector('#eam-calculate').click());
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => { const svg=document.querySelector('#eam-result svg.aq-wheel-svg'),box=svg?.getBoundingClientRect();return { svg: !!svg, visible: !!box && box.width > 0 && box.height > 0, planets: document.querySelectorAll('#eam-result .aq-wheel-planet').length, hl: !!document.querySelector('#eam-result .aq-wheel-highlight'), mk: document.querySelectorAll('#eam-result .aq-wheel-marker').length, nodeBodyTitles:[...document.querySelectorAll('#eam-result svg.aq-wheel-svg .aq-wheel-planet:not(.aq-wheel-marker) title')].map(x=>x.textContent).filter(x=>x.includes('العقدة الشمالية')), svgWidth:box?.width||0, viewport:innerWidth }; });
    ok(r.svg && r.visible && r.planets > 3, `${mode}: wheel rendered (${JSON.stringify(r)})`);
    ok(r.svgWidth > 0 && r.svgWidth <= r.viewport + 1, `${mode}: visible wheel fits 375px viewport (${r.svgWidth}/${r.viewport})`);
    if (mode === 'profections') ok(r.hl, 'profections: active house highlighted');
    if (mode === 'eclipses') ok(r.mk >= 2, 'eclipses: event markers on wheel');
    if (mode === 'nodes') {
      ok(r.mk === 2, 'nodes: north+south markers');
      ok(r.nodeBodyTitles.length === 1 && r.nodeBodyTitles[0].includes('الحقيقية'), 'node wheel shows only the configured True Node body');
      const n = await p.evaluate(() => ({ model: document.querySelector('#eam-result').dataset.nodeModel, natal: Number(document.querySelector('#eam-result').dataset.natalNodeLongitude), transit: Number(document.querySelector('#eam-result').dataset.transitNodeLongitude), source: window.AqeeqChartContext?.getNatal?.()?.ch?.bodies?.find(x => x.key === 'truenode')?.lon, api: window.AqeeqNodeModel?.selectNodeBody([{key:'node',lon:11},{key:'truenode',lon:22}])?.lon, explicitMean: window.AqeeqNodeModel?.selectNodeBody([{key:'node',lon:11},{key:'truenode',lon:22}], 'node')?.lon }));
      ok(n.model === 'truenode' && n.api === 22 && n.explicitMean === 11, 'nodal model defaults explicitly to True Node and selector supports explicit Mean Node');
      ok(Number.isFinite(n.transit) && Math.abs(((n.natal - n.source + 540) % 360) - 180) < 1e-8, 'displayed natal node is the True Node used by the return calculation');
    }
  }
  ok(errs.length === 0, 'no JS errors ' + errs.join(';'));
  await b.close(); console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
})();
