/* Select complete, already-calculated readings. This layer never computes a chart. */
(function(root){'use strict';
 const recapIntro="قراءة سنة ٢٠٢٦ كاملة، من يناير إلى ديسمبر.";
 const ids=['dasha','sadeSati','nodes','caution','opportunity','months','covenant'];
 const titles=['الفترة التي تحكم سنتك','ثقل زحل على قمرك (ساديه ساتي)','علاقاتك الكارمية','نقاط الحذر وكيف تتجاوزها','أفضل مسار للعمل والمال','أشهر سنتك: متى تتحرك ومتى تتمهل','ميثاقك لعام 2027: ما تلتزم به وما تتجنبه'];
 const phaseNotes={outside:'زحل خارج نطاق البرج السابق لبرج قمر الميلاد، وبرج القمر نفسه، والبرج التالي. العدّ بالأبراج؛ والخروج لا يحكم على سهولة التجربة.',rising:'زحل في البرج السابق لبرج قمر الميلاد، وهي المرحلة الأولى. العدّ هنا بالأبراج، وليس بدرجة اقتران دقيقة.',peak:'زحل في برج قمر الميلاد نفسه، وهي المرحلة الوسطى. العدّ هنا بالأبراج، وليس بدرجة اقتران دقيقة.',setting:'زحل في البرج التالي لبرج قمر الميلاد، وهي المرحلة الأخيرة، لا الخروج النهائي. العدّ بالأبراج؛ وقد يعيد التراجع مرحلة سابقة.'};

 function transitEntries(report,planets){
  const entries=[],map=new Map();for(const g of report.groups||[]){if(!planets.includes(g.planet))continue;for(const p of g.periods){const key=g.planet+'|'+p.house+'|'+JSON.stringify(p.text);let e=map.get(key);if(!e){e={kind:'long',sourceRef:'transit-'+g.planet+'-'+p.house,planet:g.planet,house:p.house,text:p.text,visits:[],contacts:[],lord:p.lord,topics:p.topics};map.set(key,e);entries.push(e);}e.visits.push({s:p.s,e:p.e});e.contacts.push(...(p.contacts||[]));}}return entries;
 }
 function periodEntries(report){const entries=[],map=new Map();for(const p of report.periods||[]){const key=p.lord+'|'+p.maha+'|'+JSON.stringify(p.text);let e=map.get(key);if(!e){e={kind:'long',sourceRef:'dasha-'+p.lord+'-'+p.maha,text:p.text,visits:[],maha:p.maha,lord:p.lord};map.set(key,e);entries.push(e);}e.visits.push({s:p.s,e:p.e});}return entries;}

 function assemble(report){
  if(!report?.focused||!report?.groups||!report?.periods)throw Error('Complete annual sources required.');
  const phase=report.focused.find(s=>s.id==='sadeSati');if(!phase)throw Error('Moon-relative Saturn phases missing.');
  const phaseEntries=phase.entries.map(e=>({kind:'phase',sourceRef:e.ref,text:e.text,visits:e.visits,metadata:e.metadata,phase:e.key,note:phaseNotes[e.key]}));
  const covenant=report.focused.find(s=>s.id==='covenant');if(!covenant)throw Error('Reviewed covenant copy missing.');
  const covEntries=covenant.entries.map(e=>({kind:'covenant',sourceRef:e.ref,text:e.text,visits:e.visits,metadata:e.metadata,maha:e.metadata.maha,lord:e.metadata.lord}));
  const months=report.focused.find(s=>s.id==='months');if(!months)throw Error('Reviewed months copy missing.');
  const monthEntries=months.entries.map(e=>({kind:'months',sourceRef:e.ref,text:e.text,visits:e.visits,metadata:e.metadata}));
  const entries=[periodEntries(report),phaseEntries,transitEntries(report,['rahu','ketu']),transitEntries(report,['saturn']),transitEntries(report,['jupiter']),monthEntries,covEntries];
  return ids.map((id,i)=>({id,title:titles[i],entries:entries[i]}));
 }
 root.AqYear2027ReadingModel={assemble,transitEntries,periodEntries,phaseNotes,recapIntro};
 if(typeof module==='object'&&module.exports)module.exports=root.AqYear2027ReadingModel;
})(typeof window==='object'?window:globalThis);
