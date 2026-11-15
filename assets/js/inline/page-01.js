/* أداء: ملفات JSON الكبيرة تُجلب مرة واحدة، وملف التاروت (2.8MB) لا يُجلب إلا عند فتح التاروت */
(function(){var f=window.fetch;if(!f)return;var memo={};
function tarotOpen(){if(/tarot|consult/i.test(location.hash))return true;var a=document.getElementById('consultCardsArena');return !!(a&&a.offsetParent)}
function gate(){return new Promise(function(res){if(tarotOpen())return res();var t=setInterval(function(){if(tarotOpen()){clearInterval(t);res()}},500);window.addEventListener('hashchange',function(){if(tarotOpen()){clearInterval(t);res()}})})}
window.fetch=function(u,o){var url=typeof u==='string'?u:(u&&u.url)||'';var m=/featured-content\.json(\?|$)/.test(url)?'fc':/tarot-library\.json(\?|$)/.test(url)?'tl':null;if(!m)return f.apply(this,arguments);var args=arguments,self=this;
if(!memo[m])memo[m]=(m==='tl'?gate():Promise.resolve()).then(function(){return f.apply(self,args)});
return memo[m].then(function(r){return r.clone()})}})();