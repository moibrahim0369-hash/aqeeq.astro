const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const rootDir = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const platformJs = fs.readFileSync(path.join(rootDir, 'assets/js/aqeeq-platform.js'), 'utf8');
const lifePathDataJs = fs.readFileSync(path.join(rootDir, 'assets/js/life-path-data.js'), 'utf8');
const nameEngineJs = fs.readFileSync(path.join(rootDir, 'name_engine.js'), 'utf8');
const pinnaclesJs = fs.readFileSync(path.join(rootDir, 'pinnacles_challenges.js'), 'utf8');
const nameReadingsJs = fs.readFileSync(path.join(rootDir, 'name_readings.js'), 'utf8');
const nameReadingsJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'name_data.json'), 'utf8'));

// 1. Verify duplicate script removal & script loading order in index.html
const pinnaclesScriptMatches = indexHtml.match(/<script\b[^>]*\bsrc=["']pinnacles_challenges\.js(?:\?[^"']*)?["'][^>]*><\/script>/g) || [];
const nameReadingsScriptMatches = indexHtml.match(/<script\b[^>]*\bsrc=["']name_readings\.js(?:\?[^"']*)?["'][^>]*><\/script>/g) || [];
assert.equal(pinnaclesScriptMatches.length, 1, 'pinnacles_challenges.js must be loaded exactly once in index.html');
assert.equal(nameReadingsScriptMatches.length, 1, 'name_readings.js must be loaded exactly once in index.html');

const astroExposeIdx = indexHtml.indexOf("if (typeof window !== 'undefined') window.Astro = Astro;");
const platformScriptIdx = indexHtml.indexOf('<script src="assets/js/aqeeq-platform.js"></script>');
assert.ok(astroExposeIdx > 0, 'window.Astro must be exposed in index.html');
assert.ok(platformScriptIdx > astroExposeIdx, 'aqeeq-platform.js must load after window.Astro is defined');

// 2. Verify Astro engine + window.Astro + updateObservatoryRibbon
const astroMatch = indexHtml.match(/const Astro = \(\(\) => \{[\s\S]*?\n\}\)\(\);\nif \(typeof module !== 'undefined'\) module\.exports = Astro;\nif \(typeof window !== 'undefined'\) window\.Astro = Astro;/);
assert.ok(astroMatch, 'Astro IIFE + window.Astro assignment must be extractable');

// Minimal DOM shim for testing renderLPBlueprintCard, renderPinnaclesBlock, AqeqNameReadings, and updateObservatoryRibbon
function createMockElement(tagName = 'div') {
  return {
    tagName: tagName.toUpperCase(),
    id: '',
    className: '',
    hidden: false,
    style: {},
    textContent: '',
    _innerHTML: '',
    children: [],
    parentNode: null,
    isConnected: true,
    attributes: {},
    classList: {
      _set: new Set(),
      add(c) { this._set.add(c); },
      remove(c) { this._set.delete(c); },
      contains(c) { return this._set.has(c); }
    },
    setAttribute(k, v) { this.attributes[k] = String(v); },
    getAttribute(k) { return this.attributes[k] || null; },
    appendChild(child) {
      child.parentNode = this;
      child.isConnected = true;
      this.children.push(child);
      return child;
    },
    remove() {
      this.isConnected = false;
      if (this.parentNode) {
        this.parentNode.children = this.parentNode.children.filter(c => c !== this);
      }
    },
    insertAdjacentHTML(_pos, html) {
      this._innerHTML += String(html || '');
    },
    get innerHTML() {
      return this._innerHTML + this.children.map(c => c.outerHTML).join('');
    },
    set innerHTML(val) {
      this._innerHTML = String(val || '');
      this.children = [];
    },
    get outerHTML() {
      return `<${this.tagName.toLowerCase()} class="${this.className}">${this.innerHTML}</${this.tagName.toLowerCase()}>`;
    },
    querySelector(sel) {
      if (sel === '.aqeq-name-readings') {
        return this.children.find(c => c.className.includes('aqeq-name-readings')) || null;
      }
      if (sel === '.aqeq-name-status') {
        return {
          textContent: '',
          className: '',
          parentNode: this
        };
      }
      return null;
    }
  };
}

const domElements = {
  '#aq-observatory-ribbon': createMockElement('div'),
  '#aq-obs-sun': createMockElement('span'),
  '#aq-obs-moon': createMockElement('span'),
  '#aq-obs-daynum': createMockElement('span'),
  '#aq-obs-date': createMockElement('span'),
  '#aq-sky-date-badge': createMockElement('span'),
  '#aq-sky-num-badge': createMockElement('span'),
  '#aq-sky-planets-strip': createMockElement('div')
};

const sandbox = {
  console,
  Math,
  Date,
  Intl,
  Number,
  String,
  Boolean,
  Array,
  Object,
  Set,
  Map,
  RegExp,
  Error,
  Promise,
  JSON,
  URL,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  setTimeout,
  clearTimeout,
  fetch: async () => ({
    ok: true,
    json: async () => nameReadingsJson
  }),
  document: {
    head: createMockElement('head'),
    body: createMockElement('body'),
    getElementById(id) {
      return domElements['#' + id] || null;
    },
    querySelector(sel) {
      return domElements[sel] || null;
    },
    querySelectorAll() {
      return [];
    },
    createElement(tag) {
      return createMockElement(tag);
    },
    addEventListener() {}
  },
  location: { href: 'http://localhost:3000/', hash: '#home' },
  localStorage: {
    getItem() { return null; },
    setItem() {}
  },
  addEventListener() {},
  matchMedia: () => ({ matches: false })
};
sandbox.window = sandbox;
sandbox.global = sandbox;
sandbox.globalThis = sandbox;

vm.createContext(sandbox);

// Run Astro engine + Life Path data + Name engine + Pinnacles & Challenges + Name readings
vm.runInContext(astroMatch[0], sandbox);
assert.ok(sandbox.window.Astro && typeof sandbox.window.Astro.chart === 'function', 'window.Astro.chart must be available in window');

vm.runInContext(lifePathDataJs, sandbox);
vm.runInContext(nameEngineJs, sandbox);
vm.runInContext(pinnaclesJs, sandbox);
vm.runInContext(nameReadingsJs, sandbox);

// Extract digSum, lifePath, renderLPBlueprintCard, renderPinnaclesBlock from index.html
const digSumMatch = indexHtml.match(/const digSum = n => String\(n\)\.split\(""\)\.reduce\(\(s, c\) => s \+ \+c, 0\);/);
assert.ok(digSumMatch, 'digSum must be found in index.html');
const lpFnMatch = indexHtml.match(/function lifePath\(d, m, y\) \{[\s\S]*?\n  \}/);
assert.ok(lpFnMatch, 'lifePath calculation function must be found in index.html');

const blueprintFnMatch = indexHtml.match(/function renderLPBlueprintCard\(lp\) \{[\s\S]*?\n  \}\n\n  function renderPinnaclesBlock\(name, d, m, y, lp\) \{[\s\S]*?\n  \}/);
assert.ok(blueprintFnMatch, 'renderLPBlueprintCard and renderPinnaclesBlock must be found in index.html');

vm.runInContext(`
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const LP_BASE = { 11: 2, 22: 4, 33: 6 };
  ${digSumMatch[0]}
  ${lpFnMatch[0]}
  ${blueprintFnMatch[0]}
  window.__testLifePath = lifePath;
  window.__testRenderLPBlueprintCard = renderLPBlueprintCard;
  window.__testRenderPinnaclesBlock = renderPinnaclesBlock;
`, sandbox);

// 3. Test Life Path calculations including Master Numbers 11, 22, 33
const calcLPPlatformMatch = platformJs.match(/function calcLifePathNumber\(dateStr\) \{[\s\S]*?\n  \}/);
assert.ok(calcLPPlatformMatch, 'calcLifePathNumber must be found in aqeeq-platform.js');
vm.runInContext(`${calcLPPlatformMatch[0]}; window.__testCalcLPPlatform = calcLifePathNumber;`, sandbox);

const verifiedDates = [
  ['1990-01-08', 1],   // 8 + 1 + 19 = 28 -> 10 -> 1
  ['1980-01-01', 2],   // 1 + 1 + 18 = 20 -> 2
  ['1990-02-09', 3],   // 9 + 2 + 19 = 30 -> 3
  ['1990-03-09', 4],   // 9 + 3 + 19 = 31 -> 4
  ['1990-04-09', 5],   // 9 + 4 + 19 = 32 -> 5
  ['1980-02-04', 6],   // 4 + 2 + 18 = 24 -> 6
  ['1990-06-09', 7],   // 9 + 6 + 19 = 34 -> 7
  ['1990-07-09', 8],   // 9 + 7 + 19 = 35 -> 8
  ['1990-08-09', 9],   // 9 + 8 + 19 = 36 -> 9
  ['1972-05-05', 11],  // 5 + 5 + 19 = 29 -> 11 (Master 11)
  ['1990-01-02', 22],  // 2 + 1 + 19 = 22 (Master 22)
  ['1995-03-06', 33]   // 6 + 3 + 24 = 33 (Master 33)
];

for (const [iso, expectedLP] of verifiedDates) {
  const [y, m, d] = iso.split('-').map(Number);
  const lpIndex = sandbox.__testLifePath(d, m, y);
  const lpPlatform = sandbox.__testCalcLPPlatform(iso);
  assert.equal(lpIndex, expectedLP, `index.html lifePath(${iso}) must equal ${expectedLP}`);
  assert.equal(lpPlatform, expectedLP, `aqeeq-platform.js calcLifePathNumber(${iso}) must equal ${expectedLP}`);
}

// 4. Verify renderLPBlueprintCard for all Life Paths (1..9, 11, 22, 33)
const escHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
for (const lp of [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]) {
  const html = sandbox.__testRenderLPBlueprintCard(lp);
  assert.ok(html.length > 200, `Blueprint HTML for LP ${lp} must be non-empty`);
  assert.ok(!html.includes('[object Object]'), `Blueprint HTML for LP ${lp} must NOT contain [object Object]`);
  assert.ok(!html.includes('undefined'), `Blueprint HTML for LP ${lp} must NOT contain undefined`);
  const dataEntry = sandbox.AqeeqLifePathData[lp];
  for (const row of dataEntry.cheatSheet) {
    assert.ok(html.includes(escHtml(row.area)), `LP ${lp} cheatSheet must include area "${row.area}"`);
    assert.ok(html.includes(escHtml(row.balanced)), `LP ${lp} cheatSheet must include balanced "${row.balanced}"`);
    assert.ok(html.includes(escHtml(row.shadow)), `LP ${lp} cheatSheet must include shadow "${row.shadow}"`);
  }
  for (const step of dataEntry.blueprint) {
    assert.ok(html.includes(escHtml(step.challenge)), `LP ${lp} blueprint must include challenge "${step.challenge}"`);
    assert.ok(html.includes(escHtml(step.solution)), `LP ${lp} blueprint must include solution "${step.solution}"`);
  }
}

// 5. Verify renderPinnaclesBlock & AqeqNameReadings.render (empty name vs non-empty name, zero duplication)
(async () => {
  // Case A: Empty Name
  const rootEmpty = createMockElement('div');
  const pinnaclesEmptyHTML = sandbox.__testRenderPinnaclesBlock('', 8, 2, 1990, 11);
  assert.ok(pinnaclesEmptyHTML.includes('aqeq-pc-wrap'), 'renderPinnaclesBlock must return .aqeq-pc-wrap when name is empty');
  assert.ok(pinnaclesEmptyHTML.includes('القمم والتحديات'), 'renderPinnaclesBlock must include Pinnacles heading when name is empty');
  assert.ok(pinnaclesEmptyHTML.includes('التحديات الأربعة'), 'renderPinnaclesBlock must include 4 Challenges heading when name is empty');
  assert.ok(pinnaclesEmptyHTML.includes('فحص الديون الكارمية'), 'renderPinnaclesBlock must include Karmic Debts check when name is empty');

  rootEmpty.innerHTML = pinnaclesEmptyHTML;
  await sandbox.AqeqNameReadings.render('', rootEmpty, {
    day: 8,
    month: 2,
    year: 2026,
    birthYear: 1990,
    lifePath: 11
  });
  const combinedEmptyHTML = rootEmpty.innerHTML;
  const emptyWrapCount = (combinedEmptyHTML.match(/class="aqeq-pc-wrap"/g) || []).length;
  assert.equal(emptyWrapCount, 1, 'When name is empty, .aqeq-pc-wrap must appear exactly once in #lpresult');

  // Case B: Non-Empty Name
  const rootNamed = createMockElement('div');
  const pinnaclesNamedHTML = sandbox.__testRenderPinnaclesBlock('محمد ابراهيم', 8, 2, 1990, 11);
  assert.equal(pinnaclesNamedHTML, '', 'renderPinnaclesBlock must return empty string when name is provided so AqeqNameReadings renders it once');

  rootNamed.innerHTML = pinnaclesNamedHTML;
  await sandbox.AqeqNameReadings.render('محمد ابراهيم', rootNamed, {
    day: 8,
    month: 2,
    year: 2026,
    birthYear: 1990,
    lifePath: 11
  });
  const combinedNamedHTML = rootNamed.innerHTML;
  const namedWrapCount = (combinedNamedHTML.match(/class="aqeq-pc-wrap"/g) || []).length;
  assert.equal(namedWrapCount, 1, 'When name is provided, .aqeq-pc-wrap must appear exactly once in #lpresult');
  assert.ok(combinedNamedHTML.includes('بصمة اسم محمد ابراهيم'), 'Name readings must render for provided name');

  // 6. Verify updateObservatoryRibbon() with window.Astro
  domElements['#aq-home-sky-planets'] = createMockElement('div');
  vm.runInContext(platformJs, sandbox);
  const sunText = domElements['#aq-obs-sun'].textContent;
  const moonText = domElements['#aq-obs-moon'].textContent;
  const planetsHTML = domElements['#aq-home-sky-planets'].innerHTML;

  assert.ok(sunText.includes('°'), `Sun ribbon text must include degree symbol, got: "${sunText}"`);
  assert.ok(moonText.includes('القمر في') && moonText.includes('°'), `Moon ribbon text must include live sign and degree, got: "${moonText}"`);
  assert.ok(!moonText.includes('اضغط لاستكشاف السماء الآن'), 'Moon ribbon must not show fallback text when window.Astro is available');
  assert.equal((planetsHTML.match(/aq-sky-planet-pill/g) || []).length, 5, 'Sky planets strip must render all 5 planets (Mercury, Venus, Mars, Jupiter, Saturn)');
  assert.ok(!planetsHTML.includes('NaN') && !planetsHTML.includes('undefined'), 'Sky planets strip must not contain NaN or undefined');

  console.log('PASS Targeted Fixes: blueprint table/steps, pinnacles empty/named without duplication, single script load, and live Astro observatory ribbon');
})();
