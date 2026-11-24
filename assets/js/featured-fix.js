/* Compact pager for the featured-content page: first, last and the pages around the current one; layout only. */
(function(){'use strict';if(window.__aqFcFix)return;window.__aqFcFix=true;
function fix(nav){
 if(nav.__fixing)return;nav.__fixing=true;
 var nums=[].filter.call(nav.querySelectorAll('.fc-pg[data-pg]'),function(b){return /^\d+$/.test(b.textContent.trim())});
 if(nums.length>7){
  var cur=0;nums.forEach(function(b){if(b.classList.contains('on'))cur=+b.textContent});
  var last=+nums[nums.length-1].textContent,prev=0;
  [].forEach.call(nav.querySelectorAll('.fc-pg-gap'),function(g){g.remove()});
  nums.forEach(function(b){var k=+b.textContent,keep=k===1||k===last||Math.abs(k-cur)<=1;b.classList.toggle('fc-pg-hide',!keep);
   if(keep){if(prev&&k-prev>1){var g=document.createElement('span');g.className='fc-pg-gap';g.setAttribute('aria-hidden','true');g.textContent='…';nav.insertBefore(g,b)}prev=k}});
 }
 setTimeout(function(){nav.__fixing=false},0)}
function run(){[].forEach.call(document.querySelectorAll('.fc-pager'),fix)}
new MutationObserver(function(m){if(m.some(function(x){return x.target.closest&&x.target.closest('.fc-pager')&&!x.target.__fixing&&x.type==='childList'&&[].some.call(x.addedNodes,function(n){return n.nodeType===1&&n.classList.contains('fc-pg')})}))run()}).observe(document.documentElement,{childList:true,subtree:true});
setInterval(run,1500);
document.addEventListener('DOMContentLoaded',run);
})();
/* Home looks the same logged in or out: no greeting card, no hidden hero parts. */
(function(){'use strict';
function clean(){try{if(document.body.classList.contains('yp-user'))document.body.classList.remove('yp-user');var c=document.getElementById('yp-hc');if(c)c.remove()}catch(e){}}
function start(){clean();new MutationObserver(clean).observe(document.body,{attributes:true,attributeFilter:['class']});
 var h=document.getElementById('home-intro');if(h)new MutationObserver(clean).observe(h,{childList:true})}
if(document.body)start();else document.addEventListener('DOMContentLoaded',start)})();
