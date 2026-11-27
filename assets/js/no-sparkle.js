(function(){function f(){[].forEach.call(document.querySelectorAll('#tarot-card .card-glyph'),function(g){if(g.textContent.trim()==='\u2726')g.style.display='none'})}
function go(){var t=document.getElementById('tarot-card');if(!t)return setTimeout(go,500);new MutationObserver(f).observe(t,{childList:true,subtree:true});f()}
go()})();
