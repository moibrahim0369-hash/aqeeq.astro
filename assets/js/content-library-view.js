/* Small DOM renderer for explicitly mounted public content. Uses textContent only. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.AqeeqContentLibraryView = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  function mount(options) {
    const config = options || {};
    const target = config.target;
    const loader = config.loader;
    const path = config.path;
    if (!target || typeof target.replaceChildren !== 'function') throw new TypeError('target element is required');
    if (!loader || typeof loader.load !== 'function') throw new TypeError('content loader is required');
    target.replaceChildren();
    target.hidden = true;
    return loader.load(path).then(entry => {
      if (!entry) return null;
      const article = target.ownerDocument.createElement('article');
      article.setAttribute('data-content-id', entry.id);
      article.setAttribute('data-content-domain', entry.domain);
      const heading = target.ownerDocument.createElement('h2');
      heading.textContent = entry.payload.title || '';
      article.appendChild(heading);
      if (entry.domain === 'tarot') {
        const upright = entry.payload.upright || {};
        if (Array.isArray(upright.keywords) && upright.keywords.length) {
          const keywords = target.ownerDocument.createElement('p');
          keywords.setAttribute('data-content-field', 'keywords');
          keywords.textContent = upright.keywords.filter(value => typeof value === 'string' && value.trim()).join(' · ');
          if (keywords.textContent) article.appendChild(keywords);
        }
        const interpretation = upright.interpretation;
        if (typeof interpretation === 'string' && interpretation.trim()) {
          const body = target.ownerDocument.createElement('p');
          body.setAttribute('data-content-field', 'interpretation');
          body.textContent = interpretation;
          article.appendChild(body);
        }
      } else if (typeof entry.payload.body === 'string') {
        const body = target.ownerDocument.createElement('p');
        body.textContent = entry.payload.body;
        article.appendChild(body);
      }
      target.replaceChildren(article);
      target.hidden = false;
      return entry;
    }).catch(error => {
      target.replaceChildren();
      target.hidden = true;
      throw error;
    });
  }
  return Object.freeze({ mount });
});
