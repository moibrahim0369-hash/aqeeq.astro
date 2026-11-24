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

/* Result banner: numbers + name + edit + save in one banner (same idea as the 2027 banner). */
var IC={edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',save:'<path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z"/>'};
function ic(k){return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[k]+'</svg>';}
function banner(){var r=el('kt-result');if(!r||r.hidden||r.querySelector('.kt-banner'))return;var head=r.querySelector('.y27-rhead'),tri=r.querySelector('.b3-kt-tri');if(!head||!tri)return;
var nm=(el('kt-name')&&el('kt-name').value||'').trim(),ds=(el('kt-date')&&el('kt-date').value||'').trim();
var b=document.createElement('header');b.className='kt-banner';
var k=document.createElement('span');k.className='kt-bk';k.textContent='ذيلك الكارمي';
var n=document.createElement('b');n.className='kt-bn';n.textContent=nm||'هذه أرقام ذيلك';
var t=document.createElement('div');t.className='kt-tools';
t.innerHTML='<button type="button" data-kt-edit aria-label="تعديل البيانات">'+ic('edit')+'<span>تعديل البيانات</span></button><button type="button" data-kt-save aria-label="حفظ القراءة">'+ic('save')+'<span>حفظ</span></button>';
b.appendChild(k);b.appendChild(n);b.appendChild(tri);b.appendChild(t);head.parentNode.replaceChild(b,head);
t.querySelector('[data-kt-edit]').onclick=function(){var x=el('kt-edit');if(x)x.click();};
var sv=t.querySelector('[data-kt-save]');sv.onclick=function(){var P=window.AqeeqPlatform;if(P&&P.saveReading)P.saveReading({type:'karmic',typeLabel:'الذيل الكارمي',title:nm||'ذيلي الكارمي',subtitle:ds,route:'#karmic',inputs:{name:nm,date:ds}});sv.classList.add('is-saved');var sp=sv.querySelector('span');if(sp)sp.textContent='تم الحفظ';};}
function watch2(){var r=el('kt-result');if(!r)return;banner();new MutationObserver(banner).observe(r,{attributes:true,attributeFilter:['hidden'],childList:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch2);else watch2();
})();
