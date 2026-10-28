/* Aqeeq content-library contract. Static-first: no DB writes, no admin privilege, no publication side effects. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.AqeeqContentLibrary = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const DOMAINS = new Set(['matrix', 'tarot', 'astrology', 'psychology']);
  const STATUSES = new Set(['draft', 'in-review', 'approved', 'published', 'withdrawn']);
  const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const nonBlank = value => typeof value === 'string' && value.trim().length > 0;
  function validateEntry(entry) {
    const errors = [];
    if (!isObject(entry)) return { valid: false, errors: ['entry must be an object'] };
    if (entry.schemaVersion !== 1) errors.push('schemaVersion must be 1');
    if (!DOMAINS.has(entry.domain)) errors.push('domain must be matrix, tarot, astrology, or psychology');
    if (!/^[a-z0-9][a-z0-9._-]{1,119}$/.test(entry.id || '')) errors.push('id must be a stable lowercase identifier');
    if (!Number.isInteger(entry.contentVersion) || entry.contentVersion < 1) errors.push('contentVersion must be a positive integer');
    if (!STATUSES.has(entry.workflow?.status)) errors.push('workflow.status is invalid');
    if (!isObject(entry.review)) errors.push('review metadata is required');
    if (!isObject(entry.provenance)) errors.push('provenance metadata is required');
    if (!nonBlank(entry.provenance?.authorship)) errors.push('provenance.authorship is required');
    if (!nonBlank(entry.provenance?.sourceType)) errors.push('provenance.sourceType is required');
    if (!isObject(entry.payload)) errors.push('payload must be an object');
    if (entry.domain === 'matrix' && (!nonBlank(entry.payload?.title) || !nonBlank(entry.payload?.body))) errors.push('matrix payload requires title and body');
    if (entry.domain === 'tarot' && (!nonBlank(entry.payload?.title) || !isObject(entry.payload?.upright))) errors.push('tarot payload requires title and an upright object');
    if (entry.domain === 'astrology' && (!nonBlank(entry.payload?.title) || !nonBlank(entry.payload?.body))) errors.push('astrology payload requires title and body');
    if (entry.domain === 'psychology' && (!nonBlank(entry.payload?.title) || !nonBlank(entry.payload?.body))) errors.push('psychology payload requires title and body');
    if (entry.workflow?.status === 'approved' || entry.workflow?.status === 'published') {
      if (entry.review?.status !== 'approved') errors.push('approved/published entry requires review.status=approved');
      if (!nonBlank(entry.review?.reviewedBy) || !nonBlank(entry.review?.reviewedAt)) errors.push('approved/published entry requires reviewer and review timestamp');
    }
    if (entry.workflow?.status === 'published' && !nonBlank(entry.workflow?.publishedAt)) errors.push('published entry requires publishedAt');
    return { valid: errors.length === 0, errors };
  }
  function isPublic(entry) {
    return validateEntry(entry).valid && entry.workflow.status === 'published' && entry.review.status === 'approved' &&
      nonBlank(entry.review.reviewedBy) && nonBlank(entry.review.reviewedAt) && nonBlank(entry.workflow.publishedAt);
  }
  function resolve(entry) { return isPublic(entry) ? JSON.parse(JSON.stringify(entry)) : null; }
  function createLoader(options) {
    const config = options || {}, base = config.basePath || 'assets/data/content/', version = String(config.version || 1);
    const fetcher = config.fetch || (typeof fetch === 'function' ? fetch.bind(globalThis) : null), cache = new Map();
    function load(path) {
      if (!fetcher) return Promise.reject(new Error('fetch is unavailable'));
      if (typeof path !== 'string' || path.startsWith('/') || path.includes('..') || !/^[a-z0-9._/-]+\.json$/i.test(path))
        return Promise.reject(new TypeError('content path is invalid'));
      const url = base + path + '?v=' + encodeURIComponent(version);
      if (cache.has(url)) return cache.get(url);
      const request = Promise.resolve(fetcher(url, { credentials: 'same-origin' }))
        .then(response => { if (!response || !response.ok) throw new Error('content request failed'); return response.json(); })
        .then(entry => { const result = validateEntry(entry); if (!result.valid) throw new Error('invalid content entry: ' + result.errors.join('; ')); return resolve(entry); });
      cache.set(url, request); request.catch(() => cache.delete(url)); return request;
    }
    function clear(path) { if (path) cache.delete(base + path + '?v=' + encodeURIComponent(version)); else cache.clear(); }
    return Object.freeze({ load, clear });
  }
  return Object.freeze({ validateEntry, isPublic, resolve, createLoader, domains: Object.freeze([...DOMAINS]), statuses: Object.freeze([...STATUSES]) });
});
