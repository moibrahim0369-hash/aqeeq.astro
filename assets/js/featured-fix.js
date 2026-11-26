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
