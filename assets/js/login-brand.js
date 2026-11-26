/* PREVIEW: brand name on top of the login screen */
(function(){function run(){var h=document.querySelector('#account .acct-brand-header');if(!h||h.querySelector('.aqb-name'))return;
var d=document.createElement('div');d.className='aqb-name';d.setAttribute('aria-hidden','true');
d.innerHTML='<b>عقيق</b><small dir="ltr">AKEEK ASTRO</small>';h.insertBefore(d,h.firstChild)}
if(document.readyState!=='loading')run();else document.addEventListener('DOMContentLoaded',run);setTimeout(run,1500);setTimeout(run,4000)})();
