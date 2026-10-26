(() => {
  'use strict';
  const ADJECTIVES=[['محتاجة','محتاج'],['مستعدة','مستعد'],['عارفة','عارف'],['جاهزة','جاهز'],['حاسّة','حاسس'],['حساسة','حساس'],['مترددة','متردد'],['مسؤولة','مسؤول'],['قادرة','قادر'],['ناجحة','ناجح'],['قوية','قوي'],['ذكية','ذكي'],['عملية','عملي'],['اجتماعية','اجتماعي'],['عاطفية','عاطفي'],['متوازنة','متوازن'],['مبدعة','مبدع'],['منظمة','منظم'],['قيادية','قيادي'],['طموحة','طموح'],['مستقلة','مستقل'],['مخلصة','مخلص'],['حكيمة','حكيم'],['شجاعة','شجاع'],['صريحة','صريح'],['عميقة','عميق'],['صبورة','صبور'],['هادئة','هادئ'],['متميزة','متميز'],['مختلفة','مختلف'],['مولودة','مولود']];
  const POSSESSIVES=[['صاحبته','صاحبه'],['لديها','لديه'],['عقلها','عقله'],['داخلها','داخله'],['جسدها','جسده'],['ذاتها','ذاته'],['نفسها','نفسه'],['قلبها','قلبه'],['طاقتها','طاقته'],['قدرتها','قدرته']];
  const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  function replaceWord(text,from,to){
    const re=new RegExp('(^|[^\\u0621-\\u064A])((?:(?:و|ف|ب|ل)?(?:ال)?))('+escape(from)+')(?=$|[^\\u0621-\\u064A])','g');
    return text.replace(re,(_,boundary,prefix)=>boundary+prefix+to);
  }
  function replaceAddressed(text,from,to){
    const subject='(?:و)?(?:أنت|انت|إنت|انتي|صاحبته)\\s+';
    const re=new RegExp('(^|[^\\u0621-\\u064A])('+subject+')('+escape(from)+')(?=$|[^\\u0621-\\u064A])','g');
    return text.replace(re,(_,boundary,subjectText)=>boundary+subjectText+to);
  }
  function transform(text,gender){
    if(!text||gender!=='female')return text;
    text=text.replace(/(^|[^\\u0621-\\u064A])يولد صاحب(?:ه|ة)(?=$|[^\\u0621-\\u064A])/g,'$1تولد صاحبته');
    text=text.replace(/(^|[^\\u0621-\\u064A])صاحبه(?=$|[^\\u0621-\\u064A])/g,'$1صاحبته');
    text=text.replace(/(^|[^\\u0621-\\u064A])يولد(?=$|[^\\u0621-\\u064A])/g,'$1تولد');
    for(const [f,m] of POSSESSIVES)text=replaceWord(text,m,f);
    for(const [f,m] of ADJECTIVES)text=replaceAddressed(text,m,f);
    return text;
  }
  function apply(root,gender){
    if(!root||!gender)return;
    root.dataset.reportGender=gender;
    let voice=root.querySelector('.gender-voice-note');if(!voice){voice=document.createElement('p');voice.className='gender-voice-note';root.insertBefore(voice,root.firstChild);}const voiceText=gender==='female'?'صياغة مؤنثة · هذا التقرير موجّه لكِ.':'صياغة مذكرة · هذا التقرير موجّه لك.';if(voice.textContent!==voiceText)voice.textContent=voiceText;
    const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
    while((node=walk.nextNode())){if(node.parentElement?.closest('script,style,textarea,input,select'))continue;const next=transform(node.nodeValue,gender);if(next!==node.nodeValue)node.nodeValue=next;}
  }
  const labels={male:'ذكر',female:'أنثى'};
  function init(){
    const selects=[...document.querySelectorAll('[data-gender-select]')];let saved='';try{saved=localStorage.getItem('aq-gender')||'';}catch(_){}
    selects.filter(s=>s.dataset.genderGroup==='self').forEach(s=>{if(saved)s.value=saved;});
    document.addEventListener('change',event=>{const select=event.target.closest('[data-gender-select]');if(!select||select.dataset.genderGroup!=='self')return;try{localStorage.setItem('aq-gender',select.value);}catch(_){}selects.filter(s=>s.dataset.genderGroup==='self').forEach(s=>s.value=select.value);});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.AqeeqGender={apply,transform,labels};
})();