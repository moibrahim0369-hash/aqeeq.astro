/* Vedic chart prose: calculated facts and chart-specific content stay separate. */
(function () {
  'use strict';
  var SIGNS = ['الحمل','الثور','الجوزاء','السرطان','الأسد','العذراء','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'];
  var HOUSE_NAMES = ['البداية والحضور','الموارد والكلام','المبادرة والتواصل','الجذور والاستقرار','الإبداع وما ترعاه','الجهد اليومي والالتزامات','الشراكة والتبادل','المشاركة والتحول','المعنى والتعلم','العمل والمسؤولية','الدوائر والمكاسب','الخلوة وما تتركه'];
  var LORDS = ['mars','venus','mercury','moon','sun','mercury','venus','mars','jupiter','saturn','saturn','jupiter'];
  var NAMES = {sun:'الشمس',moon:'القمر',mars:'المريخ',mercury:'عطارد',jupiter:'المشتري',venus:'الزهرة',saturn:'زحل',node:'راهو',ketu:'كيتو'};
  var EXALT = {sun:0,moon:1,mars:9,mercury:5,jupiter:3,venus:11,saturn:6};
  var OWN = {sun:[4],moon:[3],mars:[0,7],mercury:[2,5],jupiter:[8,11],venus:[1,6],saturn:[9,10]};
  var COMB = {moon:12,mars:17,mercury:14,jupiter:11,venus:10,saturn:15};
  var DRISHTI = {mars:[4,7,8],jupiter:[5,7,9],saturn:[3,7,10],node:[5,7,9],ketu:[5,7,9]};
  var KEYS = ['1','moon','sun','2','3','4','5','6','7','8','9','10','11','12','16','20','24','27','30','40','45','60'];
  var VERSION = 'vedic-c9b8e7e57e19';
  var loaded = null, pending = null;
  function norm(x) { return ((x % 360) + 360) % 360; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function paragraphs(xs) { return (xs || []).map(function(t){return '<p>'+esc(t)+'</p>';}).join(''); }
  function separation(a,b) { return Math.abs(norm(a-b+180)-180); }
  function physicalCombustion(map,x) {
    if ([1,'moon','sun'].indexOf(map.n) < 0 || !COMB[x.key]) return false;
    var sun = map.items.filter(function(y){return y.key==='sun';})[0];
    if (!sun || !isFinite(sun.lon) || !isFinite(x.lon)) return false;
    var limit = COMB[x.key] - (x.retro && (x.key==='mercury' || x.key==='venus') ? 2 : 0);
    return separation(sun.lon,x.lon) <= limit;
  }
  function dignity(x) {
    if (EXALT[x.key] == null) return null;
    if (x.sign === EXALT[x.key]) return 'exalted';
    if (x.sign === (EXALT[x.key]+6)%12) return 'debilitated';
    if (OWN[x.key].indexOf(x.sign)>=0) return 'own';
    return null;
  }
  function facts(map) {
    var by = {}, houses = {}, numeric = typeof map.n === 'number';
    map.items.forEach(function(x){by[x.key]=x;(houses[x.house] = houses[x.house] || []).push(x);});
    var basis = map.n==='moon' ? 'moon' : map.n==='sun' ? 'sun' : map.basis;
    var timed = basis==='asc', houseReading = !numeric || timed;
    var groups = Object.keys(houses).map(Number).sort(function(a,b){return a-b;}).map(function(h){
      var sign = (map.lagna+h)%12, ruler = by[LORDS[sign]];
      return {house:h,sign:sign,ruler:ruler || null,items:houses[h]};
    });
    var aspects=[];
    map.items.forEach(function(x){
      var targets=(DRISHTI[x.key] || [7]).map(function(d){return (x.house+d-1)%12;});
      map.items.forEach(function(y){if(x.key!==y.key && targets.indexOf(y.house)>=0)aspects.push({from:x.key,to:y.key,fromHouse:x.house,toHouse:y.house});});
    });
    return {chart:String(map.n),basis:basis,timed:timed,houseReading:houseReading,groups:groups,by:by,aspects:aspects};
  }
  function stability(map,natal,margin,deps) {
    if ([0.5,1,2,5,10].indexOf(Number(margin))<0 || !natal || !isFinite(natal.utcMs)) return {status:'unavailable'};
    deps=deps || {};
    var E=window.AqEam,VC=window.AqVedicChart;
    var chartAt=deps.chartAt || (E && function(ms){return E.siderealChart({ch:E.engineChart(ms,natal)});});
    var build=deps.build || (VC && VC.build);
    if(!chartAt || !build)return {status:'unavailable'};
    function signature(m){return [m.lagna,m.basis].concat(m.items.map(function(x){return x.key+':'+x.sign+':'+x.house;}).sort()).join('|');}
    var expected=signature(map),offsets=[-1,-.5,0,.5,1],changed=[];
    try { offsets.forEach(function(f){var m=build(chartAt(natal.utcMs+Number(margin)*60000*f),map.n);if(signature(m)!==expected)changed.push(f*Number(margin));}); }
    catch(e){return {status:'unavailable'};}
    return {status:changed.length?'changed':'stable',margin:Number(margin),samples:offsets.length,changedOffsets:changed};
  }
  function validate(data) {
    if (!data || data.schemaVersion!==1 || !data.charts || !data.planets) throw new Error('صيغة مكتبة القراءة غير صحيحة.');
    KEYS.forEach(function(k){
      var c=data.charts[k];if(!c || typeof c.intro!=='string' || !c.houseReadings)throw new Error('قراءة خريطة ناقصة: '+k);
      var expected=k==='2' ? [1,2,12] : [1,2,3,4,5,6,7,8,9,10,11,12];
      expected.forEach(function(h){var t=c.houseReadings[h];if(!t || typeof t.lead!=='string' || !Array.isArray(t.paragraphs) || !t.paragraphs.length)throw new Error('قراءة بيت ناقصة: '+k+'/'+h);});
    });
    Object.keys(NAMES).forEach(function(k){
      var p=data.planets[k];if(!p || !p.signs)throw new Error('قراءة كوكب ناقصة: '+k);
      for(var s=0;s<12;s++)if(typeof p.signs[s]!=='string')throw new Error('قراءة برج ناقصة: '+k+'/'+s);
    });
    return data;
  }
  function load() {
    if (loaded) return Promise.resolve(loaded);
    if (pending) return pending;
    pending=fetch('assets/data/vedic/chart-readings.json?v='+VERSION).then(function(r){if(!r.ok)throw new Error('تعذر تحميل مكتبة القراءة.');return r.json();}).then(validate).then(function(d){loaded=d;return d;}).catch(function(e){pending=null;throw e;});
    return pending;
  }
  function conditionText(map,x) {
    var out=[],dg=dignity(x),d1=[1,'moon','sun'].indexOf(map.n)>=0;
    if(dg==='exalted')out.push('يقع '+x.name+' هنا في برج شرفه بحسب القاعدة المعتمدة. هذه ملاءمة لطريقة تعبيره، وليست وعدًا بأن كل ما يخصه سيأتي بلا جهد.');
    if(dg==='debilitated')out.push('يقع '+x.name+' هنا في برج هبوطه بحسب القاعدة المعتمدة. قد تحتاج صفته إلى وعي وتدرّب أكثر؛ لا نحول هذا الموضع وحده إلى حكم على نجاحك أو قيمتك.');
    if(dg==='own')out.push('يقع '+x.name+' في أحد بيوته البرجية، فيكون التعبير عن صفته أوضح في هذه العدسة. وضوح الصفة لا يلغي أثر بقية الخريطة أو اختياراتك.');
    if(x.retro && x.key!=='node' && x.key!=='ketu')out.push('علامة الرجوع تخص حركة '+x.name+' الظاهرية عند الميلاد. نذكرها كجزء من السياق، ولا نعدّها فشلًا أو عطبًا في طريقتك.');
    if(d1 && physicalCombustion(map,x))out.push('المسافة بين '+x.name+' والشمس تقع داخل حد الاحتراق المستخدم هنا. هذا وصف تقليدي للقرب من الشمس، وليس تشخيصًا ولا حكمًا بإلغاء دور الكوكب.');
    return out;
  }
  function planetCard(x,map,data) {
    var p=data.planets[x.key];if(!p)return '';
    var id='vedic.'+String(map.n)+'.planet.'+x.key+'.sign.'+x.sign;
    return '<article class="vn-planet" data-vn-entry="'+id+'"><h6>'+esc(x.name)+' في '+SIGNS[x.sign]+'</h6><small class="vn-context-label">أسلوب الكوكب ضمن موضوع هذه الخريطة، لا وصف للشخص كله</small><p>'+esc(p.signs[x.sign])+'</p>'+paragraphs(conditionText(map,x))+(p.role ? '<details class="vn-role"><summary>دور '+esc(x.name)+' في القراءة</summary><p>'+esc(p.role)+'</p></details>' : '')+'</article>';
  }
  function basisLabel(f) { return f.basis==='asc'?'الطالع المحسوب':f.basis==='sun'?'برج الشمس':'برج القمر'; }
  function render(map,data,options) {
    options=options || {};var f=facts(map),c=data.charts[f.chart];if(!c)return '';
    var h='<header class="vn-head"><span>قراءة عقيق · الخريطة الفيدية</span><h4>'+esc(c.title)+'</h4><p>'+esc(c.intro)+'</p></header>';
    h+='<p class="vn-help">نصوص رمزية للتأمل، لا إثبات لوقائع أو تنبؤ علمي. <a href="vedic-library.html?chart='+f.chart+'">تصفح المكتبة وحدود المنهج</a></p>';
    h+='<div class="vn-basis"><b>مرجع البيوت: '+basisLabel(f)+'</b><p>'+(f.basis==='asc'?'البيوت في هذه القراءة من طالع التقسيم نفسه، بنظام البرج الكامل.':f.chart==='moon'?'الأبراج هي أبراج الميلاد النجمية نفسها، والبيوت تُعدّ من القمر. هذه زاوية النظر للمشاعر والعقل، وليست طالعًا جديدًا.':f.chart==='sun'?'الأبراج هي أبراج الميلاد النجمية نفسها، والبيوت تُعدّ من الشمس. هذه زاوية النظر للمعنى والإرادة، وليست طالعًا جديدًا.':'وقت الميلاد غير معروف. الرسم يستخدم القمر مرجعًا بديلًا، ولا نتعامل معه كطالع مقاس.')+'</p></div>';
    if(c.precisionNote)h+='<p class="vn-precision">'+esc(c.precisionNote)+'</p>';
    if(!f.houseReading){
      h+='<div class="vn-limit"><h5>نقف عند حدود بياناتك</h5><p>لن نضع قراءة شخصية لبيوت هذا التقسيم من دون وقت ميلاد معروف. يمكنك مشاهدة الرسم كمرجع، لكن استبدال الطالع بالقمر لا يعوض الوقت المفقود.</p></div>';
      if(f.chart==='1')h+='<div class="vn-sign-only"><h5>الكواكب في الأبراج على البيانات المدخلة</h5><p class="vn-help">هذه طبقة الأبراج فقط، وليست حكمًا على البيوت. إذا كان الوقت غير معروف، قد يتغير موضع القمر خصوصًا قرب حدود البرج.</p>'+map.items.map(function(x){return planetCard(x,map,data);}).join('')+'</div>';
      return h;
    }
    if((f.chart==='moon'||f.chart==='sun') && options.birthTimeKnown===false)h+='<p class="vn-precision">وقت الميلاد غير معروف. هذه القراءة مشروطة بمواضع الكواكب على البيانات المدخلة؛ القمر سريع الحركة، وقد يتغير مرجعه إذا وقع قريبًا من حد برج.</p>';
    if(['27','30','40','45','60'].indexOf(f.chart)>=0 && !options.precisionAccepted){
      h+='<div class="vn-limit"><h5>قبل القراءة الدقيقة</h5><p>وجود ساعة في النموذج لا يثبت أنها دقيقة. هذا التقسيم حساس لدقائق الميلاد، وخصوصًا طالع D60. اختر هامش الخطأ الذي تثق به فعلًا، لا الهامش الذي يمنحك نتيجة أريح.</p>'+
        (options.precisionResult && options.precisionResult.status==='changed'?'<p class="vn-stability-message">تغيرت مواضع هذه الخريطة في عينات داخل الهامش الذي اخترته؛ لذلك لن نعرض تفسيرًا شخصيًا لبيوتها على أنه ثابت. يمكنك تصفح النصوص العامة في المكتبة، أو الرجوع إلى وقت أوثق إن توفر.</p>':'')+
        (options.precisionResult && options.precisionResult.status==='unavailable'?'<p class="vn-stability-message">لم نستطع إتمام فحص الاستقرار الآن. نُبقي قراءة البيوت الدقيقة محجوبة بدل افتراض ثباتها.</p>':'')+
        '<label class="vn-margin-label">مدى دقة وقت الميلاد<select class="vn-time-margin"><option value="">لا أعرف هامش الخطأ</option><option value="0.5">ضمن نصف دقيقة قبل أو بعد</option><option value="1">ضمن دقيقة قبل أو بعد</option><option value="2">ضمن دقيقتين قبل أو بعد</option><option value="5">ضمن خمس دقائق قبل أو بعد</option><option value="10">ضمن عشر دقائق قبل أو بعد</option></select></label><button type="button" class="vn-precision-accept" disabled>افحص الاستقرار واعرض القراءة إن ثبتت</button><a class="vn-library-link" href="vedic-library.html?chart='+f.chart+'">تصفح نصوص هذه الخريطة دون قراءة شخصية</a></div>';
      return h;
    }
    if(options.precisionResult && options.precisionResult.status==='stable')h+='<p class="vn-precision">بقيت أبراج هذه الخريطة وبيوتها نفسها في خمس عينات ضمن '+options.precisionResult.margin+' دقيقة قبل وقت الميلاد وبعده. هذا فحص للعينة، وليس توثيقًا للوقت أو ضمانًا لدقته.</p>';
    h+='<p class="vn-help">تفتح القراءة للبيوت التي تشغلها كواكب فعلًا. البيت الخالي ليس نقصًا، وكل جزء يُقرأ مع خريطة الميلاد وبقية المواضع، لا بدلًا منها.</p><div class="vn-houses">';
    f.groups.forEach(function(g,i){
      var e=c.houseReadings[String(g.house+1)];if(!e)return;
      var entry='vedic.'+f.chart+'.house.'+(g.house+1),names=g.items.map(function(x){return x.name;}).join('، ');
      h+='<details class="vn-house" data-vn-entry="'+entry+'"'+(i===0?' open':'')+'><summary><span><b>البيت '+(g.house+1)+' · '+HOUSE_NAMES[g.house]+'</b><small>'+esc(names)+'</small></span><i aria-hidden="true">+</i></summary><div class="vn-house-body"><p class="vn-lead">'+esc(e.lead)+'</p>'+paragraphs(e.paragraphs);
      h+='<div class="vn-planets">'+g.items.map(function(x){return planetCard(x,map,data);}).join('')+'</div>';
      h+='<details class="vn-facts"><summary>المواضع التي بُنيت عليها هذه القراءة</summary><ul><li>مرجع البيوت: '+basisLabel(f)+'، والبيت '+(g.house+1)+' في '+SIGNS[g.sign]+'.</li>';
      g.items.forEach(function(x){h+='<li>'+esc(x.name)+' في '+SIGNS[x.sign]+'، البيت '+(x.house+1)+' في هذه الخريطة.</li>';});
      if(g.ruler)h+='<li>حاكم هذا البيت '+esc(g.ruler.name)+'، موجود في البيت '+(g.ruler.house+1)+' من هذه الخريطة.</li>';
      var incoming=f.aspects.filter(function(a){return a.toHouse===g.house;});
      if(incoming.length)h+='<li>النظرات حسب القاعدة المعتمدة هنا: '+incoming.map(function(a){return NAMES[a.from]+' إلى '+NAMES[a.to];}).join('، ')+'.</li>';
      h+='</ul></details></div></details>';
    });
    return h+'</div>';
  }
  function mount(host,map,ch,natal) {
    if(!host)return;
    var accepted=false,result=null;
    host.innerHTML='<p class="vn-loading" role="status">نحضّر القراءة المطابقة لهذه الخريطة…</p>';
    function draw(data){
      host.innerHTML=render(map,data,{precisionAccepted:accepted,precisionResult:result,birthTimeKnown:!!ch.known});
      var accept=host.querySelector('.vn-precision-accept'),select=host.querySelector('.vn-time-margin');
      if(accept && select){
        select.addEventListener('change',function(){accept.disabled=!select.value;});
        accept.addEventListener('click',function(){
          accept.disabled=true;accept.textContent='نفحص مواضع الخريطة حول الوقت المدخل…';
          setTimeout(function(){result=stability(map,natal,Number(select.value));accepted=result.status==='stable';if(host.isConnected!==false)draw(data);},0);
        });
      }
      if(window.AqeeqGender)window.AqeeqGender.apply(host,natal && natal.gender);
    }
    load().then(function(data){if(host.isConnected!==false)draw(data);}).catch(function(){
      if(host.isConnected===false)return;
      host.innerHTML='<p class="vn-load-error">تعذر تحميل القراءة الآن. الحساب والرسم لم يتغيرا.</p><button type="button" class="vn-retry">أعد تحميل النصوص</button>';
      host.querySelector('.vn-retry').addEventListener('click',function(){mount(host,map,ch,natal);});
    });
  }
  window.AqVedicNarratives={load:load,validate:validate,facts:facts,render:render,mount:mount,dignity:dignity,combustion:physicalCombustion,separation:separation,stability:stability,chartKeys:KEYS};
})();
