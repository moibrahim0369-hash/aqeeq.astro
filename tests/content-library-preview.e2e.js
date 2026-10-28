'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const draft = require('../assets/data/content/matrix/qa-lifecycle-sample.json');
const published = {
  ...draft,
  workflow: { status: 'published', publishedAt: '2026-10-28T00:01:00Z' },
  review: { status: 'approved', reviewedBy: 'qa-reviewer', reviewedAt: '2026-10-28T00:00:00Z' }
};
const withdrawn = { ...published, workflow: { status: 'withdrawn', publishedAt: published.workflow.publishedAt } };

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/assets/data/content/matrix/qa-lifecycle-sample.json?*', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(published) }));
    await page.goto('http://127.0.0.1:8765/tests/fixtures/content-library-preview.html');
    await page.waitForFunction(() => window.contentFixtureReady);
    assert.equal(await page.locator('#content').isVisible(), true);
    assert.equal(await page.locator('#content h2').textContent(), 'نموذج اختبار دورة المحتوى');
    assert.equal(await page.locator('#content p').textContent(), 'نص تجريبي غير منشور لاختبار دورة المراجعة والاعتماد.');
    assert.deepEqual(errors, []);

    await page.route('**/assets/data/content/matrix/qa-lifecycle-sample.json?*', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(withdrawn) }));
    await page.reload();
    await page.waitForFunction(() => window.contentFixtureReady);
    assert.equal(await page.locator('#content').isHidden(), true, 'withdrawn entry must not render');
    assert.equal(await page.locator('#content').locator('article').count(), 0, 'withdrawn content leaves no DOM text');
    assert.deepEqual(errors, []);
    console.log('Content library UI E2E passed: published content renders safely; withdrawn content remains hidden; no page errors.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
