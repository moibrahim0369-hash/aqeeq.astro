/* Input heading labels only, no calculation state changes. */
(function(){'use strict';function run(){[['compat','.cpx-head','خريطة التوافق الفلكي','ما الذي يجمعكما، وأين تحتاجان إلى فهم أعمق؟'],['year2027','.y27-intro','ما سيحدث في 2027','أي أبواب تفتحها لك سنة 2027؟']].forEach(function(c){var s=document.getElementById(c[0]);if(!s)return;var h=s.querySelector(c[1]);if(!h||h.querySelector('.aq-form-question'))return;var e=h.querySelector('.eyebrow');if(e)e.textContent='عقيق أسترو · '+c[2];var q=document.createElement('p');q.className='aq-form-question';q.textContent=c[3];var t=h.querySelector('h2');if(t)t.parentNode.insertBefore(q,t.nextSibling);});}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();})();
/* Automatic saved-data filling replaces the removed manual bar. Never changes the second person. */
(function(){'use strict';
var groups=[{form:'cp-form',prefix:'cp1'},{form:'y27-form',prefix:'y27'}];
function el(id){return document.getElementById(id);}
function fire(e){e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));}
function pad(n){return ('0'+n).slice(-2);}
function fill(g){var f=el(g.form),d=el(g.prefix+'-date'),C=window.AqeeqChartContext;if(!f||!d||g.edited||g.done||d.value||!C||!C.getOrPrefill)return;
var n;try{n=C.getOrPrefill();}catch(e){return;}if(!n||!n.y||!n.m||!n.d)return;
var city=el(g.prefix+'-city'),i=C.cityIndexByName&&C.cityIndexByName(n.placeName);if(city&&(typeof i!=='number'||i<0))return;
g.done=true;d.value=n.y+'-'+pad(n.m)+'-'+pad(n.d);fire(d);
var u=el(g.prefix+'-unknown'),t=el(g.prefix+'-time'),name=el(g.prefix+'-name');if(u){u.checked=!n.known;fire(u);}if(t){t.value=n.known?pad(n.hh)+':'+pad(n.mm):'';fire(t);}if(city){city.value=String(i);fire(city);}if(name&&n.name&&!name.value){name.value=n.name;fire(name);}}
function run(){groups.forEach(fill);}
function start(){groups.forEach(function(g){var f=el(g.form);if(!f)return;['input','change'].forEach(function(type){f.addEventListener(type,function(e){if(e.isTrusted&&e.target.id&&e.target.id.indexOf(g.prefix+'-')===0)g.edited=true;if(e.isTrusted&&e.target.closest&&e.target.closest(g.prefix==='cp1'?'#cp1':'#y27-form'))g.edited=true;},true);});});run();var tries=0,t=setInterval(function(){run();if(++tries>=100||groups.every(function(g){return g.done||g.edited;}))clearInterval(t);},150);}
['hashchange','aqeeq:natal-ready','aqeeq:profile-saved','aqeeq:cities-ready'].forEach(function(e){window.addEventListener(e,run);document.addEventListener(e,run);});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();

/* Browser name suggestions off for the first person, matching the second person. */
(function(){'use strict';function run(){['mxc-n1','syn-name-a'].forEach(function(id){var e=document.getElementById(id);if(e)e.setAttribute('autocomplete','off');});}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();})();
