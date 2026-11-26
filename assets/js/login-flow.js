/* PREVIEW: welcome screen before sign-in (logged-out only) */
(function(){
  function run(){
    var s=document.getElementById('account'),g=document.getElementById('acct-guest');
    if(!s||!g)return;
    var hdr=s.querySelector('.acct-brand-header');
    if(!hdr||s.querySelector('.aqw-cta'))return;
    var cta=document.createElement('div');cta.className='aqw-cta';
    cta.innerHTML='<button type="button" class="aqw-go">ابدأ رحلتك</button><button type="button" class="aqw-have">لديك حساب؟ <b>سجّل الدخول</b></button>';
    hdr.parentNode.insertBefore(cta,g);
    var back=document.createElement('button');back.type='button';back.className='aqw-back';back.setAttribute('aria-label','رجوع');
    back.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';
    s.appendChild(back);var sh=document.createElement('div');sh.className='aqw-sheet';s.appendChild(sh);
    function toSign(){s.classList.remove('aqw-on');s.dataset.aqwDone='1'}
    function toWelcome(){s.classList.add('aqw-on');s.dataset.aqwDone=''}
    cta.querySelector('.aqw-go').onclick=toSign;cta.querySelector('.aqw-have').onclick=toSign;back.onclick=toWelcome;
    setInterval(function(){
      var guest=!g.hidden&&location.hash==='#account';
      if(guest&&!s.dataset.aqwDone&&!s.classList.contains('aqw-on'))s.classList.add('aqw-on');
      if(!guest){s.classList.remove('aqw-on');s.dataset.aqwDone=''}
    },300);
  }
  if(document.readyState!=='loading')run();else document.addEventListener('DOMContentLoaded',run);
  setTimeout(run,1500);
})();
