(function(root,factory){
 const api=factory();
 if(typeof module!=="undefined"&&module.exports) module.exports=api;
 if(root) root.AqeqTarotRetrieval=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 function normalize(value){return String(value??"").toLocaleLowerCase("ar").normalize("NFKC").replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/[\u064B-\u065F\u0670\u0640]/g,"").replace(/[^\p{L}\p{N}]+/gu," ").trim();}
 function tokens(value){return normalize(value).split(/\s+/u).filter(token=>token.length>1);}
 function searchable(card){
  return normalize([
   card.nameAr,card.nameEn,card.suit,card.rank,card.arcana,
   ...(card.aliases||[]),...(card.keywords?.upright||[]),...(card.keywords?.reversed||[]),
   card.traditionalReference?.summary,card.aqeqInterpretation?.core,
   ...(card.sections||[]).flatMap(section=>[section.title,section.content]),
   ...Object.values(card.fields||{}).flatMap(field=>[field.upright,field.reversed])
  ].filter(Boolean).join(" "));
 }
 function rankTarotKnowledge(cards,question,{limit=5,cardIds=[]}={}){
  const wanted=new Set(cardIds);
  const queryTokens=[...new Set(tokens(question))];
  return (Array.isArray(cards)?cards:[]).filter(card=>card&&(!wanted.size||wanted.has(card.id))).map(card=>{
   const haystack=searchable(card);
   let score=0;
   for(const token of queryTokens){
    if(!haystack.includes(token)) continue;
    score+=tokens(card.nameAr+" "+card.nameEn+" "+(card.aliases||[]).join(" ")).some(nameToken=>nameToken===token)?5:1;
   }
   if(card.status==="published") score+=1;
   return {card,score};
  }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score||String(a.card.id).localeCompare(String(b.card.id))).slice(0,Math.max(0,limit));
 }
 return {normalize,tokens,rankTarotKnowledge};
});
