
(function(){
  var esc=function(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");};
  var words={
    warmth:["بحب","وحشتني","مشتاق","حبيبي","حبيبتي","قلبي","بحبك","اشتقت","اهتمام","مبسوط"],
    conflict:["زعلان","متضايق","خناقة","مش فاهم","مش فاهمة","ليه كده","دايمًا","أبدًا","تعبت","مش قادر","مش قادرة","بتتجاهل","تجاهل"],
    boundary:["سيبني","مساحتي","مش عايز","مش عايزة","كفاية","حدود","ضغط","غصب","لازم","مجبور","مجبورة"],
    uncertainty:["مش عارف","مش عارفة","يمكن","مش متأكد","مش متأكدة","حاسس","حاسه","خايف","خايفة","محتار","محتارة"],
    repair:["آسف","آسفة","حقك عليا","خلينا نتكلم","نفهم بعض","نتفاهم","أصلح","نحل","سامحني","سامحيني"]
  };
  function countWords(t,arr){return arr.reduce(function(n,w){return n+(t.split(w).length-1);},0);}
  function reportCard(title,body,score){return '<div class="aq-report-card"><h4>'+esc(title)+'</h4><p>'+esc(body)+'</p><div class="aq-meter"><span style="--meter:'+Math.max(12,Math.min(92,score*18+18))+'%"></span></div></div>';}
  function localTextReport(text,kind){
    var t=text.toLowerCase(), c={};Object.keys(words).forEach(function(k){c[k]=countWords(t,words[k]);});
    var total=Object.values(c).reduce(function(a,b){return a+b;},0), tone=c.conflict>c.warmth?'في النص إشارات لغوية للخلاف أو الإحباط أكثر من كلمات الود':c.warmth>c.conflict?'في النص كلمات ود أو اهتمام ظاهرة':'الإشارات اللغوية مختلطة أو قليلة، فصعب تحديد نبرة واحدة';
    var items=[];
    items.push(reportCard('نبرة الكلام',tone,c.conflict+c.warmth));
    items.push(reportCard('الاحتياج المحتمل',c.boundary?'فيه إشارات لمساحة شخصية أو حدود؛ الأفضل السؤال عنها مباشرة بدل افتراض معناها':c.uncertainty?'فيه إشارات للحيرة أو عدم وضوح؛ سؤال محدد ممكن يساعد':'النص وحده مش كفاية لمعرفة الاحتياج؛ جرّب سؤالًا مفتوحًا ومحايدًا',c.boundary+c.uncertainty));
    items.push(reportCard('فرصة التفاهم',c.repair?'ظهرت كلمات مرتبطة بالاعتذار أو محاولة الإصلاح؛ تابع هل بيقابلها تغيير عملي':'ممكن تبدأ بجملة تصف إحساسك واحتياجك من غير اتهام، ثم تسمع رد الطرف الآخر',c.repair+1));
    var suggestions=kind==='chat'?[
      'اقرأ الرسائل في سياقها، مش كلمة واحدة بمعزل عن اللي قبلها وبعدها.',
      'فرّق بين اللي اتقال فعلًا وبين تفسيرك لسبب قوله. النوايا لا يمكن إثباتها من النص وحده.',
      'لو هترد، اكتب نقطة واحدة واضحة واسأل سؤالًا محددًا بدل فتح كل الخلافات مرة واحدة.'
    ]:[
      'اكتب الوقائع اللي حصلت فعلًا بعيدًا عن التخمين في نية الطرف الآخر.',
      'حدد احتياجك الأساسي: وضوح، اعتذار، وقت، احترام، أو اتفاق عملي.',
      'اطلب حوارًا هادئًا وحدد حدّك الشخصي لو السلوك المؤذي بيتكرر.'
    ];
    return "<div class=\"msg-card\"><p class=\"msg-txt\"><strong>قراءة أولية للنص، من غير ذكاء اصطناعي</strong><br>دي مؤشرات لغوية بسيطة من الكلمات اللي كتبتها.</p></div><div class=\"aq-report-grid\">"+items.join('')+'</div><h3 class="aq-section-title">خطوات عملية</h3><ul class="insight-list">'+suggestions.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul><p class="aq-note">عدد الإشارات اللغوية المرصودة: '+total+'. النتيجة تتأثر باللهجة والسياق والسخرية والرسائل الناقصة؛ استخدمها كبداية للتفكير فقط.</p>';
  }
  function localForm(id,kind){var f=document.getElementById(id);if(!f)return;f.addEventListener('submit',function(e){e.preventDefault();var ta=f.querySelector('textarea'),err=f.querySelector('.ferr'),out=document.getElementById(id.replace('-form','-out')),text=ta?ta.value.trim():'';if(err)err.hidden=true;if(!text){if(err){err.textContent='اكتب النص الأول.';err.hidden=false;}return;}if(kind==='chat'&&text.length<25){if(err){err.textContent='اكتب جزءًا أطول شوية عشان نقدر نلاحظ نمطًا لغويًا.';err.hidden=false;}return;}if(out){out.innerHTML=localTextReport(text,kind);out.hidden=false;out.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}});}
  localForm('chat-form','chat');
  localForm('ask-form','ask');
  var KEY="aqeeq_wishes", form=document.getElementById("wish-form"), list=document.getElementById("wish-list");
  if(form&&list){
    var read=function(){try{return JSON.parse(localStorage.getItem(KEY)||"[]");}catch(x){return [];}};
    var write=function(a){try{localStorage.setItem(KEY,JSON.stringify(a));return true;}catch(x){return false;}};
    var render=function(){var a=read();list.innerHTML=a.length?a.slice().reverse().map(function(r){return '<li><small>'+esc(r.d)+'</small><p>'+esc(r.t)+(r.s?'<br><span>خطوة: '+esc(r.s)+'</span>':'')+'</p><button type="button" class="btn ghost sm" data-del="'+esc(r.id)+'">امسح</button></li>';}).join(""):"<li>مفيش أمنيات محفوظة لسه.</li>";};
    form.addEventListener("submit",function(e){e.preventDefault();var err=document.getElementById("wish-err"),t=document.getElementById("wish-text").value.trim(),s=document.getElementById("wish-steps").value.trim();err.hidden=true;if(!t){err.textContent="اكتب الأمنية الأول.";err.hidden=false;return;}var a=read();a.push({id:Date.now(),d:new Date().toLocaleDateString("ar-EG"),t:t,s:s});if(!write(a)){err.textContent="المتصفح مش سامح يحفظ هنا. جرب متصفح تاني أو وضع عادي.";err.hidden=false;return;}document.getElementById("wish-text").value="";document.getElementById("wish-steps").value="";render();});
    list.addEventListener("click",function(e){var id=e.target&&e.target.getAttribute&&e.target.getAttribute("data-del");if(!id)return;write(read().filter(function(r){return String(r.id)!==id;}));render();});
    render();
  }
})();
