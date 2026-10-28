'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.join(__dirname, '..');
const fixturePath = path.join(root, 'assets/data/content/tarot/tarot-library-pilot.json');
const originalText = fs.readFileSync(fixturePath, 'utf8');
const original = JSON.parse(originalText);
const publishedAt = '2026-10-28T00:01:00Z';
const reviewedAt = '2026-10-28T00:00:00Z';

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    const contentRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (request.url().includes('/assets/data/content/tarot/tarot-library-pilot.json')) contentRequests.push(request.url());
    });

    // Uses the real index.html, real loader/renderer scripts, and the real JSON path.
    await page.goto('http://127.0.0.1:8765/index.html', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => {
      const target = document.querySelector('#tarot-library-content');
      return target && target.hidden === true;
    });
    assert.equal(await page.locator('#tarot-library-content article').count(), 0, 'draft must not render');
    assert.ok(contentRequests.some(url => url.includes('tarot-library-pilot.json?v=2')), 'real tarot content path must be requested');

    // Flip only the temporary local fixture state to exercise the actual page binding.
    const published = {
      ...original,
      workflow: { status: 'published', publishedAt },
      review: { status: 'approved', reviewedBy: 'qa-reviewer', reviewedAt }
    };
    fs.writeFileSync(fixturePath, JSON.stringify(published, null, 2) + '\n');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelector('#tarot-library-content')?.hidden === false);
    assert.equal(await page.locator('#tarot-library-content h2').textContent(), original.payload.title);
    assert.equal(await page.locator('#tarot-library-content [data-content-field="keywords"]').textContent(), original.payload.upright.keywords.join(' · '));
    assert.equal(await page.locator('#tarot-library-content [data-content-field="interpretation"]').textContent(), original.payload.upright.interpretation);

    const withdrawn = { ...published, workflow: { status: 'withdrawn', publishedAt } };
    fs.writeFileSync(fixturePath, JSON.stringify(withdrawn, null, 2) + '\n');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelector('#tarot-library-content')?.hidden === true);
    assert.equal(await page.locator('#tarot-library-content article').count(), 0, 'withdrawn entry must be removed from the real page DOM');
    assert.deepEqual(errors, []);
    console.log('Tarot page integration E2E passed: real JSON path requested; draft hidden; published entry rendered; withdrawn entry hidden; no fetch mocks.');
  } finally {
    fs.writeFileSync(fixturePath, originalText);
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
