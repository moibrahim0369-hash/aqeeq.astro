const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8765';
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource:')) errs.push(m.text()); });
  await p.route('**/*', (r) => (r.request().url().startsWith(BASE) ? r.continue() : r.abort()));
  await p.goto(BASE + '/index.html#matrix'); await p.waitForTimeout(1000);
  await p.evaluate(() => { const f = document.querySelector('#mform'); f.hidden = false; });
  await p.fill('#m-date', '1999-09-25');
  await p.click('#mform button[type=submit]'); await p.waitForTimeout(1500);
  const r = await p.evaluate(() => ({
    gloss: document.querySelectorAll('.aqm-gloss').length,
    en: [...document.querySelectorAll('.aqm-gloss .aqm-t-en')].map((x) => x.textContent),
    ar: document.querySelectorAll('.aqm-gloss .aqm-t-ar').length,
    purposes: [...document.querySelectorAll('.aqm-pillar h4 .aqm-t-en')].map((x) => x.textContent),
    err: (document.querySelector('#merr:not([hidden])') || {}).textContent || '',
    neutralLine: !!document.body.textContent.match(/Ancestral Lines · Father & Mother Lines/), noGeneticClaim: !document.body.textContent.match(/Genetic & Past-Life Karma/), labelsNotice: !!document.body.textContent.match(/ليست مصطلحات أكاديمية موحدة/),
  }));
  ok(r.gloss === 9 && r.ar === 9, 'glossary has 9 points each with small Arabic title: ' + JSON.stringify(r.en));
  ok(r.purposes.length === 4 && r.purposes.includes('Planetary Purpose'), 'four purposes shown: ' + r.purposes);
  ok(r.neutralLine && r.noGeneticClaim && !r.err, 'parental lines are named neutrally and avoid genetic/past-life claims');
  ok(r.labelsNotice, 'matrix glossary identifies its labels as site-specific interpretive names');
  const nav = await p.evaluate(() => [...document.querySelectorAll('.aqm-report-index a')].map(a => ({href:a.getAttribute('href'),target:!!document.querySelector(a.getAttribute('href'))})));
  ok(nav.length === 7 && nav.every(x => x.target), 'matrix report index has stable links to each existing section: ' + JSON.stringify(nav));
  ok(await p.evaluate(() => !!document.querySelector('#aqm-section-method')), 'method/reference status is disclosed without changing the calculation');
  const baseline = await p.evaluate(() => {
    const a=window.AqeeqNumerology,d='1999-09-25',m=a.calculateDestinyMatrix(d),c=a.calculateChakraHealthCard(d),g=a.calculateGenerationalLines(d),x=a.calculateDestinyAxes(d);
    return {life:a.calculateLifePath(d).number,nodes:Object.values(m.nodes),chakraRows:c.rows.map(r=>[r.physics,r.energy,r.emotions]),totals:[c.total.physics,c.total.energy,c.total.emotions],male:g.male.points,maleCombined:g.male.combined,female:g.female.points,femaleCombined:g.female.combined,centers:[g.ancestralCenter,g.commonCenter],sky:x.sky,earth:x.earth,axes:[x.soulSearching,x.socialization,x.spiritualExam,x.planetary]};
  });
  ok(JSON.stringify(baseline) === JSON.stringify({life:8,nodes:[7,9,10,8,16,19,18,15,7],chakraRows:[[7,9,16],[21,7,10],[14,16,3],[21,5,8],[7,7,14],[17,15,5],[10,8,18]],totals:[16,13,11],male:[16,7,18],maleCombined:7,female:[19,7,15],femaleCombined:7,centers:[14,21],sky:[9,8,17],earth:[7,10,17],axes:[7,14,21,8]}), '1999-09-25 matrix/chakra/line/axis outputs match the recorded pre-change baseline');
  await p.click('.aqm-node'); await p.waitForTimeout(200);
  ok((await p.textContent('#aqm-tooltip')).includes('الجوهر · يوم الميلاد'), 'tooltip shows a site interpretation with the simplified title');
  ok(errs.length === 0, 'no JS errors ' + errs.join(';'));
  await p.emulateMedia({media:'print'});
  const printState = await p.evaluate(() => ({print:matchMedia('print').matches,reportVisible:getComputedStyle(document.querySelector('.aqm-shell')).display!=='none',indexHidden:getComputedStyle(document.querySelector('.aqm-report-index')).display==='none',wheelVisible:!!document.querySelector('.aqm-svg')&&getComputedStyle(document.querySelector('.aqm-svg')).display!=='none'}));
  ok(printState.print && printState.reportVisible && printState.indexHidden && printState.wheelVisible, 'print media keeps the matrix and wheel readable while hiding navigation: '+JSON.stringify(printState));
  await p.emulateMedia({media:'screen'});
  const mobile = await b.newPage({ viewport: { width: 375, height: 812 } });
  const mobileErrs = [];
  mobile.on('pageerror', (e) => mobileErrs.push(e.message));
  mobile.on('console', (m) => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource:')) mobileErrs.push(m.text()); });
  await mobile.route('**/*', (r) => (r.request().url().startsWith(BASE) ? r.continue() : r.abort()));
  await mobile.goto(BASE + '/index.html#matrix'); await mobile.waitForTimeout(800);
  await mobile.evaluate(() => { const f = document.querySelector('#mform'); f.hidden = false; });
  await mobile.fill('#m-date', '1999-09-25');
  await mobile.click('#mform button[type=submit]'); await mobile.waitForTimeout(1200);
  const layout = await mobile.evaluate(() => {
    const svg = document.querySelector('.aqm-svg'), rect = svg?.getBoundingClientRect();
    return { width: innerWidth, scroll: document.documentElement.scrollWidth, svg: rect?.width || 0, points: document.querySelectorAll('.aqm-gloss').length, labels: document.querySelectorAll('.aqm-gloss .aqm-t-ar').length };
  });
  ok(layout.points === 9 && layout.labels === 9, 'mobile 375px: all nine matrix points and simplified labels render');
  ok(await mobile.evaluate(() => document.querySelectorAll('.aqm-report-index a').length === 7), 'mobile 375px: report index remains available');
  ok(layout.scroll <= layout.width + 1 && layout.svg <= layout.width + 1, 'mobile 375px: no horizontal overflow and SVG fits (' + JSON.stringify(layout) + ')');
  ok(mobileErrs.length === 0, 'mobile 375px: no JavaScript console errors ' + mobileErrs.join(';'));
  await mobile.close();
  await b.close(); console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
})();
