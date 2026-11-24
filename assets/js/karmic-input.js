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
})();
