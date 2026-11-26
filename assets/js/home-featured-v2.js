/* Home "محتوى مميز": compact swipe rows, more cards, small links. Look and selection only; texts come from the same JSON. */
(function(){'use strict';if(window.__aqFeatV2)return;window.__aqFeatV2=true;
var HREF='#featured-content';
var ARROW='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
function esc(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function card(a){return '<article class="aqh-article" data-content-id="'+esc(a.id)+'" data-content-type="article" data-slug="'+esc(a.slug)+'" data-category="'+esc(a.category)+'"><img src="'+esc(a.image)+'" alt="'+esc(a.imageAlt||'')+'" loading="lazy" decoding="async" draggable="false"><div class="aqh-article-txt"><time>'+esc(a.category)+'</time><h3><a class="aqh-article-link" href="#featured-content/'+esc(a.slug)+'" data-slug="'+esc(a.slug)+'">'+esc(a.title)+'</a></h3>'+(a.hook?'<p class="aqh-hook">'+esc(a.hook)+'</p>':'')+'<p class="aqh-intro">'+esc(a.intro)+'</p></div><span class="aqh-go" aria-hidden="true">'+ARROW+'</span></article>'}

var IC={
 signs:'<path d="M12 3l2.1 5.2 5.4.4-4.1 3.5 1.3 5.3L12 14.5 7.3 17.4l1.3-5.3L4.5 8.6l5.4-.4z"/>',
 sky:'<circle cx="12" cy="12" r="3.6"/><path d="M12 3v2.6M12 18.4V21M3 12h2.6M18.4 12H21M5.6 5.6l1.9 1.9M16.5 16.5l1.9 1.9M18.4 5.6l-1.9 1.9M7.5 16.5l-1.9 1.9"/>',
 compat:'<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>',
 path:'<path d="M4 19c4 0 4-7 8-7s4-7 8-7"/><circle cx="4" cy="19" r="1.6"/><circle cx="20" cy="5" r="1.6"/>',
 chart:'<circle cx="12" cy="12" r="8"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
 matrix:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
 time:'<circle cx="12" cy="12" r="5"/><path d="M3.5 16.5c-1.5-.9-1-2.6 1.4-3.9 4.4-2.4 12.5-4 15.6-3.4 2 .4 2.3 1.9.5 3.2"/>'};
IC.wallet='<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h14M16 14.5h2.5"/>';
IC.child='<circle cx="12" cy="8" r="3.2"/><path d="M5.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/>';
var SC=[['wallet','#saju','ما لون محفظتك المناسب لك؟'],['compat','#astro-maps','ماذا عن زواجك في خريطتك؟'],['signs','#kigaku','اعرف عنصرك واتجاهك'],['time','#ziwei','ما بيوت حياتك الاثنا عشر؟'],['child','#matrix-child','اكتشف شخصية طفلك'],['path','#lifepath-compat','هل مساراكما يتفقان؟']];
function shortcuts(sec){
 if(sec.querySelector('.aqh-sc'))return;var car=sec.querySelector('.aqh-carousel');if(!car)return;
 var d=document.createElement('nav');d.className='aqh-sc';d.setAttribute('aria-label','اختصارات');
 d.innerHTML=SC.map(function(x){return '<a class="aqh-sc-i" href="'+x[1]+'"><i aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+IC[x[0]]+'</svg></i><span>'+x[2]+'</span></a>'}).join('');
 car.parentNode.insertBefore(d,car.nextSibling)}
var PICK=['sade-sati','saturn-over-moon','saturn-hermetic-path','symbol-and-reading'];
function build(list){
 var t=document.getElementById('aqh-track'),two=document.getElementById('aqh-track2'),row2=document.getElementById('aqh-row2'),sec=document.getElementById('aqh-articles');
 if(!t||!two||!sec||!list||!list.length)return false;
 var top=list.slice(0,12);
 var rest=[];PICK.forEach(function(s){var a=list.find(function(x){return x.slug===s});if(a&&top.indexOf(a)<0)rest.push(a)});
 var cats={};top.forEach(function(a){cats[a.category]=(cats[a.category]||0)+1});
 list.forEach(function(a){if(rest.length>=10||top.indexOf(a)>=0||rest.indexOf(a)>=0)return;if(rest.filter(function(x){return x.category===a.category}).length>=1)return;rest.push(a)});
 t.innerHTML=top.map(card).join('');t.setAttribute('data-v2','1');
 two.innerHTML=rest.map(card).join('');two.setAttribute('data-v2','1');if(row2)row2.hidden=!rest.length;
 shortcuts(sec);
 /* top link instead of the heading */
 var h=sec.querySelector('.aqh-row-h');
 if(!h){h=document.createElement('h3');h.className='aqh-row-h';sec.insertBefore(h,sec.querySelector('.aqh-carousel'))}
 h.innerHTML='<a class="aqh-row-link" href="'+HREF+'"><span>عرض المكتبة</span><i class="aqh-lib-ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 6.5L9 12l5.5 5.5"/></svg></i></a>';
 /* "show all featured" text link sits just above the lower row */
 var allw=document.querySelector('.aqh-band-arts .aqh-all-wrap'),allb=document.getElementById('aqh-all-articles'),mv=allw||allb;
 if(mv&&row2&&!sec.querySelector('.aqh-all-up')){var up=document.createElement('div');up.className='aqh-all-up';row2.parentNode.insertBefore(up,row2);up.appendChild(mv)}
 two.onclick=function(e){var c=e.target.closest('.aqh-article');if(!c)return;var l=c.querySelector('.aqh-article-link');if(l&&!e.target.closest('a')){e.preventDefault();location.hash='#featured-content/'+l.getAttribute('data-slug')}};
 return true}
function run(){
 var t=document.getElementById('aqh-track');if(!t||!t.querySelector('.aqh-article'))return;
 if(t.getAttribute('data-v2')==='1')return;
 var all=window.AqhArticles&&window.AqhArticles.all&&window.AqhArticles.all();
 if(all&&all.length){build(all);return}
 fetch('assets/data/featured-content.json',{cache:'no-cache'}).then(function(r){return r.json()}).then(function(j){
  var l=(j.articles||[]).map(function(a,n){return {a:{id:a.id,slug:a.slug,category:a.category,title:a.title,date:a.publishedAt,image:a.coverImage,imageAlt:a.coverAlt,intro:a.excerpt,hook:a.hook},n:n}}).sort(function(x,y){return String(y.a.date).localeCompare(String(x.a.date))||y.n-x.n}).map(function(x){return x.a});
  build(l)}).catch(function(){})}
function start(){
 var t=document.getElementById('aqh-track');if(!t)return;
 new MutationObserver(function(){setTimeout(run,60)}).observe(t,{childList:true});
 document.addEventListener('home:latest-ready',function(){setTimeout(run,120)});
 setTimeout(run,300);setTimeout(run,1500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
