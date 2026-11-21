'use strict';
// Follow scripts actually loaded by the built page, including bundles, in order.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '../..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
function productionPage() {
  const shell = read('index.html');
  const scripts = [...shell.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g)]
    .map(m => m[1].split('?')[0]).filter(p => !/^(https?:|\/\/)/.test(p))
    .map(src => ({src, code: read(src)}));
  return {shell, scripts, code: scripts.map(s => s.code).join('\n')};
}
function loadAstro() {
  const page = productionPage();
  const source = read('assets/js/inline/page-06.js');
  const match = source.match(/const Astro = \(\(\) => \{[\s\S]*?\n\}\)\(\);/);
  assert.ok(match, 'Astro extracted from its current source file');
  assert.ok(page.code.includes(match[0]), 'built page loads this exact Astro engine');
  const sb = {module: {exports: {}}, window: {}, console, Date, Math, Intl};
  vm.createContext(sb);
  // Same precise planetary backend as the browser, not the fallback approximation.
  const astronomy = page.scripts.find(s => s.src === 'astronomy.min.js' || s.code.includes('Astronomy ='));
  assert.ok(astronomy, 'production Astronomy backend is loaded');
  vm.runInContext(read('astronomy.min.js'), sb);
  sb.Astronomy = sb.window.Astronomy;
  assert.equal(typeof sb.Astronomy, 'object');
  vm.runInContext(match[0] + '\nmodule.exports = Astro;window.Astro = Astro;', sb);
  return {Astro: sb.module.exports, sandbox: sb, page};
}
module.exports = {productionPage, loadAstro, read};
