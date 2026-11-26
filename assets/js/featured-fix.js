/* Compact pager for the featured-content page: first, last and the pages around the current one; layout only. */
(function(){'use strict';if(window.__aqFcFix)return;window.__aqFcFix=true;
function fix(nav){
 if(nav.__fixing)return;nav.__fixing=true;
 var nums=[].filter.call(nav.querySelectorAll('.fc-pg[data-pg]'),function(b){return /^\d+$/.test(b.textContent.trim())});
 if(nums.length>3){
  var cur=0;nums.forEach(function(b){if(b.classList.contains('on'))cur=+b.textContent});
  var last=+nums[nums.length-1].textContent,prev=0,st3=Math.max(1,Math.min(cur-1,last-2));
  [].forEach.call(nav.querySelectorAll('.fc-pg-gap'),function(g){g.remove()});
  nums.forEach(function(b){var k=+b.textContent,keep=k>=st3&&k<=st3+2;b.classList.toggle('fc-pg-hide',!keep);
   if(keep){if(prev&&k-prev>1){var g=document.createElement('span');g.className='fc-pg-gap';g.setAttribute('aria-hidden','true');g.textContent='…';nav.insertBefore(g,b)}prev=k}});
 }
 setTimeout(function(){nav.__fixing=false},0)}
function run(){[].forEach.call(document.querySelectorAll('.fc-pager'),fix)}
new MutationObserver(function(m){if(m.some(function(x){return x.target.closest&&x.target.closest('.fc-pager')&&!x.target.__fixing&&x.type==='childList'&&[].some.call(x.addedNodes,function(n){return n.nodeType===1&&n.classList.contains('fc-pg')})}))run()}).observe(document.documentElement,{childList:true,subtree:true});
setInterval(run,1500);
document.addEventListener('DOMContentLoaded',run);
})();
/* Search magnifier: tap to open the field, close when empty and unfocused. */
(function(){'use strict';
document.addEventListener('click',function(e){var s=e.target.closest&&e.target.closest('.fc-page .fc-search');if(!s)return;
 if(e.target.closest('[data-fc-clear]'))return;
 if(!s.classList.contains('is-open')){s.classList.add('is-open');var i=s.querySelector('input');if(i)setTimeout(function(){i.focus()},30)}});
document.addEventListener('focusout',function(e){var s=e.target.closest&&e.target.closest('.fc-page .fc-search');if(!s)return;
 setTimeout(function(){var i=s.querySelector('input');if(i&&!i.value&&document.activeElement!==i)s.classList.remove('is-open')},200)});
setInterval(function(){[].forEach.call(document.querySelectorAll('.fc-page .fc-search'),function(s){var i=s.querySelector('input');if(i&&i.value&&!s.classList.contains('is-open'))s.classList.add('is-open')})},1000);
})();
/* Discover page, all-articles view: a light grouping. Cards that share a category (2 or more on the page) are placed together under a small heading with that category name; at most 2 headings per page. Other cards stay first, in date order. Order and labels only, no text is changed. */
(function(){'use strict';
function sig(g){return [].map.call(g.querySelectorAll('.fc-mini'),function(c){return c.getAttribute('data-slug')}).join('|')}
function group(g){
 var cards=[].slice.call(g.children).filter(function(c){return c.classList&&c.classList.contains('fc-mini')});if(g.getAttribute('data-sec')==='1'&&!cards.length)return;
 if(cards.length<4)return;
 var s=sig(g);if(g.__sig===s)return;
 var by={};cards.forEach(function(c){var k=c.getAttribute('data-category')||'';(by[k]=by[k]||[]).push(c)});
 var keys=Object.keys(by).filter(function(k){return k&&by[k].length>=2}).sort(function(a,b){return by[b].length-by[a].length}).slice(0,2);
 [].forEach.call(g.querySelectorAll('.fc-sec'),function(e){e.remove()});
 var rest=cards.filter(function(c){return keys.indexOf(c.getAttribute('data-category'))<0});
 var blocks=[{h:null,c:rest}].concat(keys.map(function(k){return {h:k,c:by[k]}}));
 var frag=document.createDocumentFragment();
 blocks.forEach(function(b){if(!b.c.length)return;
  if(b.h){var h=document.createElement('h3');h.className='fc-sec';h.textContent=b.h;frag.appendChild(h)}
  var w=document.createElement('div');w.className='fc-sec-grid';b.c.forEach(function(c){w.appendChild(c)});frag.appendChild(w)});
 g.appendChild(frag);g.setAttribute('data-sec','1');g.__sig=sig(g)}
function run(){var g=document.getElementById('fc-latest-grid');if(g)group(g)}
new MutationObserver(function(){setTimeout(run,0)}).observe(document.documentElement,{childList:true,subtree:true});
setInterval(run,1500);document.addEventListener('DOMContentLoaded',run);
})();
