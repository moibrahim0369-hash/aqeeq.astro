/* chart form: collapse advanced settings (zodiac/house systems, country/region pickers) behind one link. UI only. */
(function(){
  function init(){
    var f=document.getElementById('cform'); if(!f||f.querySelector('.ntx-adv-btn'))return;
    var btn=f.querySelector('.btn'); if(!btn)return;
    var b=document.createElement('button'); b.type='button'; b.className='ntx-adv-btn'; b.setAttribute('aria-expanded','false');
    b.innerHTML='<span>إعدادات متقدمة (اختياري)</span><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
    b.addEventListener('click',function(){var o=f.classList.toggle('ntx-adv-open');b.setAttribute('aria-expanded',o?'true':'false');});
    btn.parentNode.insertBefore(b,btn);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  setTimeout(init,1500);
})();
