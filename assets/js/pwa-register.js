/* Remove the retired offline page cache. Auth and saved reading data are untouched. */
(function () {
  if (!('serviceWorker' in navigator)) return;
  var base = new URL('./', document.baseURI).href;
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    return Promise.all(registrations.filter(function (r) { return r.scope === base; }).map(function (r) { return r.unregister(); }));
  }).then(function () {
    if (!('caches' in window)) return;
    return caches.keys().then(function (keys) { return Promise.all(keys.filter(function (key) { return /^aq-sw-/.test(key); }).map(function (key) { return caches.delete(key); })); });
  }).catch(function () {});
})();
