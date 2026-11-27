/* Year-map: a 12-house square chart of the slow planets in 2027 plus a 12-month strip. Display only. */
(function(root){'use strict';
 var SG=['الحمل','الثور','الجوزاء','السرطان','الأسد','العذراء','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'];
 var POS={11:[0,0],0:[0,1],1:[0,2],2:[0,3],10:[1,0],3:[1,3],9:[2,0],4:[2,3],8:[3,0],7:[3,1],6:[3,2],5:[3,3]};
 var AB={saturn:'زح',jupiter:'مش',rahu:'را',ketu:'كي'},NM={saturn:'زحل',jupiter:'المشتري',rahu:'راهو',ketu:'كيتو'};
 var MONTHS=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
 var D=(m,d)=>Date.UTC(2027,m-1,d);
 var MERC=[[D(2,9),D(3,3)],[D(6,10),D(7,4)],[D(10,7),D(10,28)]],ECL=[D(2,6),D(2,20),D(7,18),D(8,2),D(8,17)];
 var TONE={move:'وقت للتحرك',slow:'وقت للتمهل والحذر',mix:'مختلط: تحرك بحذر',calm:'هادئ'};
 function monthTone(i){var a=D(i+1,1),b=i===11?D(12,31)+864e5:D(i+2,1),days=0;MERC.forEach(r=>{var o=Math.min(b,r[1]+864e5)-Math.max(a,r[0]);if(o>0)days+=Math.round(o/864e5);});var ecl=ECL.some(t=>t>=a&&t<b);return ecl||days>=10?'slow':days>0?'mix':'move';}
 var esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 var fmt=t=>new Date(t).toLocaleDateString('ar-EG',{day:'numeric',month:'long',timeZone:'Africa/Cairo'});
 var CSS='.y27m{margin:14px 0;padding:12px;border:1px solid #e2d3b6;border-radius:18px;background:#fbf6ec;color:#3a2a22}.y27m h3{margin:0 0 4px;font-size:17px;color:#6b1a2c}.y27m p.sub{margin:0 0 10px;font-size:13px;line-height:1.7;color:#6c5a4e}.y27m-grid{direction:ltr;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(4,minmax(78px,auto));gap:0;border:1.5px solid #a88a54;border-radius:10px;overflow:hidden}.y27m-c{direction:rtl;position:relative;border:0;border-left:1px solid #c9b48a;border-top:1px solid #c9b48a;padding:6px 3px;text-align:center;font:inherit;color:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;background:#f8f1e4}.y27m-c b{font-size:11px;font-weight:600}.y27m-c small{font-size:10px;color:#6c5a4e}.y27m-c.move{background:#e6ecdf}.y27m-c.slow{background:#f0dcd8}.y27m-c.mix{background:#f1e6c9}.y27m-c.on{outline:2px solid #6b1a2c;outline-offset:-2px}.y27m-c.lag::after{content:"ط";position:absolute;top:3px;left:4px;font-size:10px;font-weight:700;color:#fff;background:#6b1a2c;border-radius:9px;padding:0 5px}.y27m-pl{display:inline-block;padding:1px 7px;border-radius:12px;border:1px solid #a88a54;background:#fff9ef;font-size:12px}.y27m-core{grid-row:2/4;grid-column:2/4;display:flex;align-items:center;justify-content:center;background:#fbf6ec;border-left:1px solid #c9b48a;border-top:1px solid #c9b48a;font-weight:700;color:#6b1a2c;font-size:18px}.y27m-leg{display:flex;flex-wrap:wrap;gap:8px 12px;margin:10px 0;font-size:12px}.y27m-leg i{display:inline-block;width:12px;height:12px;border-radius:3px;border:1px solid #c9b48a;margin-left:5px;vertical-align:-2px}.y27m-mo{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:6px}.y27m-mo button{border:1px solid #d8c7a4;border-radius:12px;padding:9px 2px;font:inherit;font-size:13px;color:inherit;background:#f8f1e4;cursor:pointer}.y27m-mo button.move{background:#e6ecdf}.y27m-mo button.slow{background:#f0dcd8}.y27m-mo button.mix{background:#f1e6c9}.y27m-mo button.on{outline:2px solid #6b1a2c}.y27m-box{margin-top:10px;padding:10px 12px;border-radius:12px;background:#fff9ef;border:1px solid #e2d3b6;font-size:14px;line-height:1.85}.y27m-box[hidden]{display:none}.y27m-box h4{margin:0 0 4px;font-size:15px;color:#6b1a2c}';
 function houseTone(list){var j=list.some(x=>x.p==='jupiter'),s=list.some(x=>x.p!=='jupiter');return j&&s?'mix':j?'move':s?'slow':'calm';}
 function build(report,C){
  var segs=[];['saturn','jupiter','rahu','ketu'].forEach(k=>{var g=(report.groups||[]).find(x=>x.planet===k);(g?g.periods:[]).forEach(p=>segs.push({p:k,sign:p.sign,house:p.house,s:p.s,e:p.e}));});
  if(!segs.length||!Number.isFinite(segs[0].house))return null;
  var lagna=((segs[0].sign-segs[0].house+1)%12+12)%12,whole=s=>s.s<=C.Y0+864e5&&s.e>=C.END-864e5,bySign={};
  segs.forEach(s=>(bySign[s.sign]=bySign[s.sign]||[]).push(s));
  var cells=Object.keys(POS).map(Number).map(sg=>{var list=bySign[sg]||[],h=(sg-lagna+12)%12+1,t=houseTone(list);
   return '<button type="button" class="y27m-c '+t+(sg===lagna?' lag':'')+'" data-sign="'+sg+'" style="grid-row:'+(POS[sg][0]+1)+';grid-column:'+(POS[sg][1]+1)+'"><b>'+h+' · '+SG[sg]+'</b>'+list.map(s=>'<span class="y27m-pl">'+AB[s.p]+'</span>'+(whole(s)?'':'<small>'+(s.s>C.Y0+864e5?'من '+fmt(s.s):'حتى '+fmt(s.e-1))+'</small>')).join('')+'</button>';}).join('');
  var months=MONTHS.map((m,i)=>'<button type="button" class="'+monthTone(i)+'" data-month="'+(i+1)+'">'+m+'</button>').join('');
  var html='<div class="y27m" id="y27-yearmap"><style>'+CSS+'</style><h3>خريطة سنتك ٢٠٢٧</h3><p class="sub">خريطة مربعة بخانات البيوت كما في خريطة الميلاد، عليها مواضع الكواكب البطيئة خلال السنة. اضغط أي خانة أو أي شهر لتقرأ ما يخصه.</p><div class="y27m-grid">'+cells+'<div class="y27m-core" style="grid-row:2/4;grid-column:2/4">٢٠٢٧</div></div><div class="y27m-leg"><span><i style="background:#e6ecdf"></i>المشتري: وقت للتحرك</span><span><i style="background:#f0dcd8"></i>زحل أو راهو أو كيتو: تمهّل</span><span><i style="background:#f1e6c9"></i>مختلط</span></div><div class="y27m-box" data-y27m-box hidden></div><h3 style="margin-top:14px">أشهر السنة</h3><p class="sub">تلوين الشهر مبني على تراجع عطارد والخسوفات فقط: أخضر للتحرك، وردي للتمهل، وذهبي لشهر فيه أيام تراجع قليلة.</p><div class="y27m-mo">'+months+'</div><div class="y27m-box" data-y27m-mbox hidden></div></div>';
  return {html:html,lagna:lagna,segs:segs,tone:monthTone};
 }
 function mount(host,report,C,areas){
  var old=document.getElementById('y27-yearmap');if(old)old.remove();
  var m=build(report,C);if(!m||!host)return;host.insertAdjacentHTML('afterbegin',m.html);
  var el=document.getElementById('y27-yearmap'),box=el.querySelector('[data-y27m-box]'),mbox=el.querySelector('[data-y27m-mbox]');
  var mon=(report.focused||[]).find(s=>s.id==='months');
  el.addEventListener('click',function(ev){
   var c=ev.target.closest('.y27m-c'),b=ev.target.closest('[data-month]');
   if(c){el.querySelectorAll('.y27m-c.on').forEach(x=>x.classList.remove('on'));c.classList.add('on');var sg=+c.dataset.sign,h=(sg-m.lagna+12)%12+1,list=m.segs.filter(s=>s.sign===sg);
    box.hidden=false;box.innerHTML='<h4>البيت '+h+' · '+SG[sg]+'</h4><p>'+esc(areas[h-1])+'</p>'+(list.length?'<p>'+list.map(s=>esc(NM[s.p])+': من '+fmt(s.s)+' إلى '+fmt(s.e-1)).join('<br>')+'</p>':'<p>لا يمر بهذا البيت كوكب بطيء في ٢٠٢٧، فهو بيت هادئ في خريطة السنة.</p>');}
   if(b){el.querySelectorAll('[data-month].on').forEach(x=>x.classList.remove('on'));b.classList.add('on');var i=+b.dataset.month,e=mon&&mon.entries.find(x=>x.key===String(i)),t=e&&e.text;
    mbox.hidden=false;mbox.innerHTML='<h4>'+esc(t?t.title:MONTHS[i-1])+'</h4><p><b>'+TONE[{move:'move',slow:'slow',mix:'mix'}[m.tone(i-1)]]+'</b></p>'+(t?'<p>'+esc(t.free)+'</p>':'');}
  });
 }

 function staticHtml(report,C,areas){
  var m=build(report,C);if(!m)return '';
  var whole=s=>s.s<=C.Y0+864e5&&s.e>=C.END-864e5,bySign={};m.segs.forEach(s=>(bySign[s.sign]=bySign[s.sign]||[]).push(s));
  var BG={move:'#e6ecdf',slow:'#f0dcd8',mix:'#f1e6c9',calm:'#f8f1e4'};
  var cells=Object.keys(POS).map(Number).map(sg=>{var list=bySign[sg]||[],h=(sg-m.lagna+12)%12+1,t=houseTone(list);
   return '<div style="direction:rtl;grid-row:'+(POS[sg][0]+1)+';grid-column:'+(POS[sg][1]+1)+';background:'+BG[t]+';border-left:1px solid #c9b48a;border-top:1px solid #c9b48a;padding:6px 3px;text-align:center;font-size:11px;min-height:78px"><b>'+h+' · '+SG[sg]+(sg===m.lagna?' · الطالع':'')+'</b>'+list.map(s=>'<div><span style="display:inline-block;margin-top:3px;padding:0 7px;border:1px solid #a88a54;border-radius:12px;background:#fff9ef">'+AB[s.p]+'</span>'+(whole(s)?'':'<br><small>'+(s.s>C.Y0+864e5?'من '+fmt(s.s):'حتى '+fmt(s.e-1))+'</small>')+'</div>').join('')+'</div>';}).join('');
  var rows=Object.keys(POS).map(Number).map(sg=>({sg:sg,h:(sg-m.lagna+12)%12+1,list:bySign[sg]||[]})).filter(x=>x.list.length).sort((a,b)=>a.h-b.h).map(x=>'<li><b>البيت '+x.h+' · '+SG[x.sg]+'</b> ('+esc(areas[x.h-1])+'): '+x.list.map(s=>esc(NM[s.p])+' من '+fmt(s.s)+' إلى '+fmt(s.e-1)).join('، ')+'</li>').join('');
  var mon=(report.focused||[]).find(s=>s.id==='months');
  var months=MONTHS.map((n,i)=>{var t=m.tone(i),e=mon&&mon.entries.find(x=>x.key===String(i+1));return '<div style="break-inside:avoid;margin:6px 0;padding:8px 10px;border-radius:10px;background:'+BG[t==='slow'?'slow':t==='mix'?'mix':'move']+'"><b>'+n+' · '+TONE[t]+'</b>'+(e?'<br>'+esc(e.text.free):'')+'</div>';}).join('');
  return '<div style="break-inside:avoid"><div style="direction:ltr;display:grid;grid-template-columns:repeat(4,1fr);border:1.5px solid #a88a54;margin:10px 0">'+cells+'<div style="grid-row:2/4;grid-column:2/4;display:flex;align-items:center;justify-content:center;font-weight:700;color:#6b1a2c;font-size:20px;border-left:1px solid #c9b48a;border-top:1px solid #c9b48a">٢٠٢٧</div></div><p style="font-size:12px">الأخضر: المشتري، وقت للتحرك. الوردي: زحل أو راهو أو كيتو، وقت للتمهل. الذهبي: مختلط. زح: زحل، مش: المشتري، را: راهو، كي: كيتو.</p></div><ul>'+rows+'</ul><h2>أشهر السنة</h2><p style="font-size:12px">تلوين الشهر مبني على تراجع عطارد والخسوفات فقط.</p>'+months;
 }
 root.AqYear2027Map={mount:mount,monthTone:monthTone,staticHtml:staticHtml};
})(window);
