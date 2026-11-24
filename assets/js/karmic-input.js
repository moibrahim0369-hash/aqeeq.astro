/* Karmic tail page: fill birth date and name from saved profile automatically (same behavior as the 2027 page). Never overrides what the user typed. */
(function(){'use strict';
var g={edited:false,done:false};
function el(id){return document.getElementById(id);}
function fire(e){e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));}
function pad(n){return ('0'+n).slice(-2);}
function fill(){var d=el('kt-date'),C=window.AqeeqChartContext;if(!d||g.edited||g.done||d.value||!C||!C.getOrPrefill)return;
var n;try{n=C.getOrPrefill();}catch(e){return;}if(!n||!n.y||!n.m||!n.d)return;
g.done=true;d.value=n.y+'-'+pad(n.m)+'-'+pad(n.d);fire(d);var nm=el('kt-name');if(nm&&n.name&&!nm.value){nm.value=n.name;fire(nm);}}
function start(){var f=el('kt-form');if(!f)return;['input','change'].forEach(function(t){f.addEventListener(t,function(e){if(e.isTrusted)g.edited=true;},true);});fill();var tries=0,t=setInterval(function(){fill();if(++tries>=100||g.done||g.edited)clearInterval(t);},150);}
['hashchange','aqeeq:natal-ready','aqeeq:profile-saved'].forEach(function(e){window.addEventListener(e,fill);document.addEventListener(e,fill);});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();

/* After a result shows, hide the "how to read" explanation blocks that sit before it (the result card already explains the numbers). */
function syncExplain(){var r=el('kt-result'),sec=el('karmic');if(!r||!sec)return;var shown=!r.hidden;
Array.prototype.forEach.call(sec.querySelectorAll('.y27-explain > .y27-about, .y27-explain > h3, .y27-explain > .y27-ex'),function(n){if(shown)n.style.setProperty('display','none','important');else n.style.removeProperty('display');});}
function watch(){var r=el('kt-result');if(!r)return;syncExplain();new MutationObserver(syncExplain).observe(r,{attributes:true,attributeFilter:['hidden'],childList:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
})();
