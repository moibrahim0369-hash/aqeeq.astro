(function(){function go(){var q=document.querySelector('#swc .swc-quick'),c=document.querySelector('#swc .swc-cap');if(!q||!c)return false;if(q.previousElementSibling!==c)c.insertAdjacentElement('afterend',q);return true}
if(!go()){var t=setInterval(function(){if(go())clearInterval(t)},300);setTimeout(function(){clearInterval(t)},8000)}})();
