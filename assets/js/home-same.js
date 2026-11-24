/* Home looks the same logged in or out: no greeting card, no hidden hero parts. */
(function(){'use strict';if(window.__aqHomeSame)return;window.__aqHomeSame=true;
function clean(){try{if(document.body.classList.contains('yp-user'))document.body.classList.remove('yp-user');var c=document.getElementById('yp-hc');if(c)c.remove()}catch(e){}}
function start(){clean();new MutationObserver(clean).observe(document.body,{attributes:true,attributeFilter:['class']});
 var h=document.getElementById('home-intro');if(h)new MutationObserver(clean).observe(h,{childList:true})}
if(document.body)start();else document.addEventListener('DOMContentLoaded',start)})();
