/* Purchase flow, one-screen look. Display only: it never touches the purchase logic.
   When the order-number screen opens, the transfer details from the previous screen stay above it. */
(function(){'use strict';
 var box=null,snap=null,busy=false;
 function grab(screen){snap={art:(screen.querySelector('.pac-art')||{}).outerHTML||'',method:(screen.querySelector('.pac-method')||{}).outerHTML||'',transfer:(screen.querySelector('.pac-transfer')||{}).outerHTML||'',amount:(screen.querySelector('.pac-amount')||{}).outerHTML||''};}
 function wa(){var nav=box&&box.querySelector('.pac-nav');if(!nav||nav.querySelector('.pac-wa'))return;var a=document.createElement('a');a.className='pac-wa';a.href='https://wa.me/201143813559?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C+%D9%87%D9%84+%D9%87%D9%86%D8%A7%D9%83+%D8%B7%D8%B1%D9%82+%D8%A3%D8%AE%D8%B1%D9%89+%D9%84%D8%B4%D8%B1%D8%A7%D8%A1+%D9%87%D8%B0%D8%A7+%D8%A7%D9%84%D8%AA%D9%82%D8%B1%D9%8A%D8%B1%D8%9F';a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label','تواصل عبر واتساب');a.innerHTML='<svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.1L2 22l5.05-1.6A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 1 1-4.2 15l-.3-.18-3 .95.97-2.9-.2-.3A8.1 8.1 0 0 1 12.04 3.8zm-3.1 3.9c-.2 0-.5.07-.75.35-.25.28-.97.95-.97 2.3s1 2.7 1.13 2.88c.14.18 1.95 3.05 4.8 4.15 2.37.93 2.85.75 3.37.7.5-.05 1.65-.67 1.88-1.33.23-.65.23-1.2.16-1.33-.07-.12-.25-.2-.53-.33-.28-.14-1.65-.82-1.9-.9-.26-.1-.45-.14-.63.14-.18.27-.72.9-.88 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.38-.83-.74-1.4-1.65-1.56-1.93-.16-.28-.02-.43.12-.57.13-.12.28-.32.42-.48.14-.17.18-.28.28-.47.1-.18.05-.35-.02-.48-.07-.14-.62-1.5-.85-2.05-.22-.54-.45-.47-.63-.48h-.54z"/></svg>';nav.insertBefore(a,nav.lastElementChild);}
 function sync(){if(busy)return;wa();var screen=box&&box.querySelector('.pac-screen');if(!screen)return;
  if(screen.querySelector('[data-pac-next]')){grab(screen);return;}
  if(snap&&screen.querySelector('#y27-checkout-form')&&!screen.querySelector('.pac-keep')){busy=true;
   var old=screen.querySelector('.pac-art');var wrap=document.createElement('div');wrap.className='pac-keep';wrap.innerHTML=snap.art+snap.method+snap.transfer;
   var cp=wrap.querySelector('#y27-copy');if(cp)cp.remove();var nb=wrap.querySelector('.pac-number button');if(nb)nb.remove();
   if(old)old.replaceWith(wrap);else screen.prepend(wrap);
   var again=document.querySelector('#y27-copy');
   busy=false;}
 }
 function boot(){box=document.getElementById('year2027-checkout');if(!box){return setTimeout(boot,500);}
  new MutationObserver(sync).observe(box,{childList:true,subtree:true});sync();}
 boot();
})();
