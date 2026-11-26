/* Highlights the key words of the article title in the hero (the part before the colon, or the first two words). Wraps words in a span only; text is unchanged. */
(function(){'use strict';if(window.__aqArtPolish)return;window.__aqArtPolish=true;
function hl(h){
 if(!h||h.__hl||h.querySelector('.fc-hl'))return;var t=h.textContent;if(!t)return;
 var i=t.indexOf(':'),end;if(i>3&&i<40)end=i;else{var m=t.split(' ');end=m.length>2?m[0].length+1+m[1].length:t.length}
 var a=t.slice(0,end),b=t.slice(end);var sp=document.createElement('span');sp.className='fc-hl';sp.textContent=a;
 h.textContent='';h.appendChild(sp);h.appendChild(document.createTextNode(b));h.__hl=1}
function run(){hl(document.getElementById('fc-pop-t'));hl(document.getElementById('fc-art-title'))}
new MutationObserver(function(){run()}).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',run);
})();
