/* Narrow runtime companion to canonical home-v2.js and featured-content.js changes. */
(function(){'use strict';if(window.__aqHomeFollowup)return;window.__aqHomeFollowup=true;
function esc(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var ARROW='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
  var TICO = {
    'الفلك': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17v4M17 19h4" /></svg>',
    'مسار الحياة': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19l5-6 4 3 7-10"/><path d="M15 6h5v5"/></svg>',
    'مصفوفة القدر': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9 9-9 9-9-9z"/><path d="M12 8l4 4-4 4-4-4z"/></svg>',
    'العلاقات': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/></svg>',
    'الرموز': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17M3.5 12h17"/></svg>'
  };
  TICO['الأبراج'] = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.2"/><path d="M12 3.5v6.3M12 14.2v6.3M4.6 7.8l5.5 3.2M13.9 13l5.5 3.2M4.6 16.2l5.5-3.2M13.9 11l5.5-3.2"/></svg>';
  TICO['الكواكب'] = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.6"/><path d="M3.2 15.5c-1-2.4 3.7-6.2 10.4-8.4 4.3-1.4 7.4-1.4 7.8-.3.5 1.3-2.4 3.9-6.8 5.8"/></svg>';
  TICO['الكل'] = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/></svg>';
  TICO['القمر'] = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13.5A8.5 8.5 0 1 1 10.5 4 6.9 6.9 0 0 0 20 13.5z"/></svg>';
  TICO['العبور'] = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="12" r="3.8"/><path d="M13.5 12h6.5M17 8.8l3.2 3.2-3.2 3.2"/></svg>';
  TICO['التراجعات'] = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12a7 7 0 0 1 12-4.9M19 12a7 7 0 0 1-12 4.9"/><path d="M17 3.4v3.7h-3.7M7 20.6v-3.7h3.7"/></svg>';
  TICO['أحدث'] = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>';
    function card(a) {
      return '<article class="aqh-article" data-content-id="' + esc(a.id) + '" data-content-type="article" data-slug="' + esc(a.slug) + '" data-category="' + esc(a.category) + '"><img src="' + esc(a.image) + '" alt="' + esc(a.imageAlt || '') + '" loading="lazy" decoding="async" draggable="false">' +
        '<div class="aqh-article-txt"><time>' + esc(a.category) + '</time><h3><a class="aqh-article-link" href="#featured-content/' + esc(a.slug) + '" data-slug="' + esc(a.slug) + '">' + esc(a.title) + '</a></h3>' + (a.hook ? '<p class="aqh-hook">' + esc(a.hook) + '</p>' : '') + '<p class="aqh-intro">' + esc(a.intro) + '</p></div>' +
        '<span class="aqh-go" aria-hidden="true">' + ARROW + '</span></article>';
    }

function icons(){document.querySelectorAll('.fc-chip[data-cat]').forEach(function(b){if(b.querySelector('.fc-chip-i'))return;var span=document.createElement('span');span.className='fc-chip-i';span.setAttribute('aria-hidden','true');span.innerHTML=TICO[b.getAttribute('data-cat')]||TICO['الفلك'];b.insertBefore(span,b.firstChild)})}
function start(){
 var t=document.getElementById('aqh-track'),two=document.getElementById('aqh-track2');
 if(t&&two&&document.getElementById('aqh-row2'))fetch('assets/data/featured-content.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw Error(r.status);return r.json()}).then(function(j){
 var all=(j.articles||[]).map(function(a,n){return {a:{id:a.id,slug:a.slug,category:a.category,title:a.title,date:a.publishedAt,readMinutes:a.readingTime,image:a.coverImage,imageAlt:a.coverAlt,intro:a.excerpt,hook:a.hook},n:n}}).sort(function(x,y){return String(y.a.date).localeCompare(String(x.a.date))||y.n-x.n}).map(function(x){return x.a});
 var top=all.slice(0,4),rest=['sade-sati','saturn-over-moon','saturn-hermetic-path','symbol-and-reading'].map(function(s){return all.find(function(a){return a.slug===s})}).filter(function(a){return a&&!top.some(function(x){return x.slug===a.slug})});
 if(top.length!==4||rest.length!==4||top.concat(rest).some(function(a){return !a.slug||!a.title||!a.image}))return;
 function apply(){if(!t.querySelector('.aqh-article'))return;watch.disconnect();t.innerHTML=top.map(card).join('');two.innerHTML=rest.map(card).join('');document.getElementById('aqh-row2').hidden=!rest.length;var sec=t.closest('.aqh-articles');if(sec&&!sec.querySelector('.aqh-row-h')){var title=document.createElement('h3');title.className='aqh-row-h';title.textContent='أحدث ما نُشر';sec.insertBefore(title,sec.querySelector('.aqh-carousel'))}document.dispatchEvent(new CustomEvent('home:latest-ready'))}
 var watch=new MutationObserver(apply);watch.observe(t,{childList:true});apply();
 }).catch(function(e){console.warn('[home-followup]',e.message)});
 icons();new MutationObserver(icons).observe(document.getElementById('featured-content')||document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
