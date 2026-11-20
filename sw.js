/* عقيق أسترو: Service Worker. يخزّن ما يُفتح فعلاً ليعمل التطبيق عند ضعف الشبكة.
   غيّر VERSION عند أي تغيير في هذه الاستراتيجية فقط؛ الملفات المبنية لها أسماء بصمة تتجدد وحدها. */
var VERSION = 'aq-sw-v1';
var PAGES = VERSION + '-pages';
var STATIC = VERSION + '-static';
var SHELL = ['./', 'manifest.webmanifest?v=2', 'icons/icon-192.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(PAGES).then(function (c) { return c.addAll(SHELL); }).catch(function () {}).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf(VERSION) !== 0; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function timeout(ms) { return new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, ms); }); }

function networkFirst(req, cacheName, ms) {
  return Promise.race([fetch(req), timeout(ms)]).then(function (res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(cacheName).then(function (c) { c.put(req, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: false }).then(function (hit) { return hit || caches.match(req, { ignoreSearch: true }); }).then(function (hit) {
      if (hit) return hit;
      return fetch(req);
    });
  });
}

function cacheFirst(req) {
  return caches.match(req).then(function (hit) {
    if (hit) return hit;
    return fetch(req).then(function (res) {
      if (res && res.ok) { var copy = res.clone(); caches.open(STATIC).then(function (c) { c.put(req, copy); }); }
      return res;
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; /* Supabase والخدمات الخارجية تمرّ كما هي */
  if (req.headers.has('range')) return;
  var p = url.pathname;
  if (req.mode === 'navigate') {
    e.respondWith(networkFirst(new Request(new URL('./', self.location).href), PAGES, 4000));
    return;
  }
  if (/\/assets\/dist\//.test(p) || /\/assets\/(fonts|images|art)\//.test(p) || /\/icons\//.test(p) || /\.(woff2?|png|jpe?g|webp|svg)$/.test(p)) {
    e.respondWith(cacheFirst(req));
    return;
  }
  e.respondWith(networkFirst(req, PAGES, 4000));
});
