/* planet sheet: the ingress sentence sits at the top, next to the stage line */
(function(){function fix(){var p=document.getElementById('sky-panel');if(!p)return;var i=p.querySelector('.swp-ing'),d=p.querySelector('.swp-deg');if(i&&d&&d.nextElementSibling!==i)d.insertAdjacentElement('afterend',i);var f=p.querySelector('.swp-full');if(f)f.hidden=false}
var p=document.getElementById('sky-panel');if(!p)return;new MutationObserver(fix).observe(p,{childList:true});fix()})();
