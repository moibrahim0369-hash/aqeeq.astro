(() => {
  'use strict';
  const PAIRS=[
    ['محتاجة','محتاج'],['مستعدة','مستعد'],['عارفة','عارف'],['جاهزة','جاهز'],['حاسّة','حاسس'],['حساسة','حساس'],['مترددة','متردد'],['مسؤولة','مسؤول'],['قادرة','قادر'],['ناجحة','ناجح'],['قوية','قوي'],['ذكية','ذكي'],['عملية','عملي'],['اجتماعية','اجتماعي'],['عاطفية','عاطفي'],['متوازنة','متوازن'],['مبدعة','مبدع'],['منظمة','منظم'],['قيادية','قيادي'],['طموحة','طموح'],['مستقلة','مستقل'],['مخلصة','مخلص'],['حكيمة','حكيم'],['شجاعة','شجاع'],['صريحة','صريح'],['عميقة','عميق'],['صبورة','صبور'],['هادئة','هادئ'],['متميزة','متميز'],['مختلفة','مختلف'],['مولودة','مولود'],['صاحبتها','صاحبه'],['صاحبة','صاحب'],['لديها','لديه'],['عقلها','عقله'],['داخلها','داخله'],['جسدها','جسده'],['ذاتها','ذاته'],['نفسها','نفسه'],['قلبها','قلبه'],['طاقتها','طاقته'],['قدرتها','قدرته'],['لها','له'],['عليها','عليه'],['منها','منه'],['فيها','فيه'],['بها','به'],['إليها','إليه'],['عنها','عنه'],['فهي','فهو'],['تولد','يولد']
  ];
  const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  function replaceWord(text,from,to){
    const re=new RegExp('(^|[^\\u0621-\\u064A])('+escape(from)+')(?=$|[^\\u0621-\\u064A])','g');
    return text.replace(re,(_,prefix)=>prefix+to);
  }
  function transform(text,gender){
    if(!text||!gender)return text;
    if(gender==='female'){for(const [f,m] of PAIRS)text=replaceWord(text,m,f);}
    return text;
  }
  function apply(root,gender){
    if(!root||!gender)return;
    root.dataset.reportGender=gender;
    const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;while((node=walk.nextNode())){if(node.parentElement?.closest('script,style,textarea,input,select'))continue;const next=transform(node.nodeValue,gender);if(next!==node.nodeValue)node.nodeValue=next;}
  }
  function genderFor(root){
    return root?.dataset?.reportGender||root?.closest('[data-report-gender]')?.dataset.reportGender||'male';
  }
  const labels={male:'ذكر',female:'أنثى'};
  function init(){
    const selects=[...document.querySelectorAll('[data-gender-select]')];let saved='';try{saved=localStorage.getItem('aq-gender')||'';}catch(_){}
    selects.filter(s=>s.dataset.genderGroup==='self').forEach(s=>{if(saved)s.value=saved;});
    document.addEventListener('change',event=>{
      const select=event.target.closest('[data-gender-select]');if(!select)return;
      const group=select.dataset.genderGroup;
      if(group==='self'){try{localStorage.setItem('aq-gender',select.value);}catch(_){}selects.filter(s=>s.dataset.genderGroup==='self').forEach(s=>s.value=select.value);}
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.AqeeqGender={apply,transform,genderFor,labels};
})();