(function(){var M={matrix:'matrix',chart:'chart',sky:'sky',lifepath:'lifepath','lifepath-compat':'lifepath','astro-maps':'chart',signs:'sky'},T=698;
function u(n){return 'url('+new URL('assets/art/'+n+'.svg?v=20261122h',document.baseURI).href+')';}
function size(s,f){var k=[].filter.call(s.children,function(c){return !/aqa-(art|flow)/.test(c.className)}),l=k[k.length-1],h=l?(l.offsetTop+l.offsetHeight):s.scrollHeight;h=h-T-8;f.style.height=(h>0?h:0)+'px';}
Object.keys(M).forEach(function(id){var s=document.getElementById(id);if(!s||s.querySelector(':scope>.aqa-art'))return;
var m=id==='lifepath-compat'?' aqa-mirror':'';
var d=document.createElement('div');d.className='aqa-art'+m;d.setAttribute('aria-hidden','true');d.style.setProperty('--aqa-img',u('celestial-'+M[id]));
var f=document.createElement('div');f.className='aqa-flow'+m;f.setAttribute('aria-hidden','true');f.style.setProperty('--aqa-img',u('flow-'+M[id]));
s.insertBefore(f,s.firstChild);s.insertBefore(d,s.firstChild);
var go=function(){size(s,f);};
if(window.ResizeObserver){var ro=new ResizeObserver(go);[].forEach.call(s.children,function(c){if(c!==d&&c!==f)ro.observe(c);});}
window.addEventListener('hashchange',function(){setTimeout(go,200);});setTimeout(go,300);setTimeout(go,1500);});})();
