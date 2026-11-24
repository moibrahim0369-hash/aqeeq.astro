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

/* Locked rows become accordions: free teaser inside, gold button to the payment page. */
var LKS='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="10.5" width="14" height="9.5" rx="2.4"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>';
var HK=null,HKP=null;
function loadHooks(){if(HKP)return HKP;HKP=fetch('assets/data/karmic-teasers.json?v=1').then(function(x){return x.ok?x.json():{};}).then(function(j){HK=j||{};}).catch(function(){HK={};});return HKP;}
function rows(){var r=el('kt-result');if(!r||r.hidden)return;var lis=r.querySelectorAll('.kt-rows li');if(!lis.length||r.querySelector('.kt-acc'))return;
if(HK===null){loadHooks().then(rows);return;}
var nm=[].map.call(r.querySelectorAll('.b3-kt-n span'),function(x){return x.textContent.trim();});var n0=nm[0]||'',n1=nm[1]||'',n2=nm[2]||'';
var T=['لكل رقم من أرقامك الثلاثة أصل. جذرك عندك '+n0+'، وهو بداية الخيط. في التقرير الكامل ترى من أين جاء هذا الدرس ولماذا يعود إليك.',
'الدرس يمر إلى علاقاتك عبر '+n1+'. قد تلاحظ أن المواقف المتشابهة تعود بوجوه مختلفة. في التقرير الكامل ترى كيف يظهر معك ومع من.',
'الأثر نفسه يظهر في طريقة تعاملك مع المال. في التقرير الكامل ترى أين يظهر وما الذي تنتبه له.',
'القرارات التي تحسمها بسرعة أو تؤجلها قد تخفي نفس الخيط، ويظهر عندك في صورة '+n2+'. التفاصيل في التقرير الكامل.',
'خطوات قصيرة وعملية تخفف ثقل هذا الدرس. أول خطوة منها في التقرير الكامل.'];
var nums=[].map.call(r.querySelectorAll('.b3-kt-n b'),function(x){return x.textContent.trim();}),H=null;
if(nums.length===3){H=HK[nums[2]+'-'+nums[1]+'-'+nums[0]]||HK[nums[0]+'-'+nums[1]+'-'+nums[2]]||null;}
if(H&&H.teaser){var lh=r.querySelector('.kt-lock-h');if(lh&&!r.querySelector('.kt-lead')){var ld=document.createElement('div');ld.className='kt-lead';var h=document.createElement('b');h.textContent=H.title;ld.appendChild(h);H.teaser.split(/\n+/).forEach(function(t){if(!t.trim())return;var q=document.createElement('p');q.textContent=t.trim();ld.appendChild(q);});lh.parentNode.insertBefore(ld,lh.nextSibling);}}
[].forEach.call(lis,function(li,i){var tt=(li.querySelector('b')||{}).textContent||'';var d=document.createElement('details');d.className='kt-acc';
d.innerHTML='<summary><span class="kt-lk">'+LKS+'</span><b></b><i class="kt-ch" aria-hidden="true"></i></summary><div class="kt-prev"><p></p><a class="b3-b1" href="#pay"><span class="kt-lk2">'+LKS+'</span>افتح التقرير الكامل</a></div>';
d.querySelector('b').textContent=tt;d.querySelector('p').textContent=T[i]||'';li.innerHTML='';li.appendChild(d);li.classList.add('kt-acc');});}
function watch3(){var r=el('kt-result');if(!r)return;rows();new MutationObserver(rows).observe(r,{attributes:true,attributeFilter:['hidden'],childList:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch3);else watch3();
})();
