/* المخطط الهندي الشمالي (Diamond Chart) بـ SVG + مبدّل التقسيمات D1/D2/D7/D9/D10/D12/D60.
   يقرأ الخريطة النجمية (لاهيري) ويستخدم AqVedic.div لحساب البرج في كل تقسيم. */
(function () {
  'use strict';
  var SG = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  var GOLD = '#C5A059', WINE = '#5A1828', CREAM = '#F7F3EB';
  /* الكواكب: المفتاح، الاسم، الاختصار المعروض داخل المخطط */
  var PL = [['sun', 'الشمس', 'شم'], ['moon', 'القمر', 'قم'], ['mars', 'المريخ', 'مر'], ['mercury', 'عطارد', 'عط'], ['jupiter', 'المشتري', 'مش'], ['venus', 'الزهرة', 'زه'], ['saturn', 'زحل', 'زح'], ['node', 'راهو', 'را'], ['ketu', 'كيتو', 'كي']];
  var VARGAS = [
    ['moon', 'خريطة القمر', 'العقل', 'نفس برجك الفيدي لكن البيوت تُعدّ من القمر: تُظهر مشاعرك وردود فعلك وما يهدّئك.', 'moon'],
    ['sun', 'خريطة الشمس', 'الروح', 'البيوت تُعدّ من الشمس: تُظهر جوهرك وحضورك وما تحتاجه لتشعر بقيمتك.', 'sun'],
    [1, 'D1', 'الميلاد', 'الخريطة الأم: الجسد والشخصية والمسار العام للحياة.', null],
    [2, 'D2', 'المال', 'علاقتك بالمال: ما تجمعه بجهدك وما يأتيك بالدعم.', 'jupiter'],
    [3, 'D3', 'الإخوة', 'علاقتك بإخوتك وبشجاعتك ومبادراتك ومهاراتك العملية.', 'mars'],
    [4, 'D4', 'البيت', 'السكن والعقار وما يمنحك الشعور بالأمان والاستقرار.', 'moon'],
    [5, 'D5', 'النفوذ', 'مكانتك وتأثيرك بين الناس وما تحصل عليه من احترام.', 'sun'],
    [6, 'D6', 'الضغوط', 'ما يرهقك ويشدّ أعصابك في الحياة اليومية وكيف تتعامل معه.', 'mars'],
    [7, 'D7', 'الأبناء', 'علاقتك بالأبناء والإبداع وما تتركه بعدك.', 'jupiter'],
    [8, 'D8', 'التحولات', 'المفاجآت وما يتغير في حياتك دفعة واحدة وكيف تمرّ منه.', 'saturn'],
    [9, 'D9', 'الارتباط والنضج', 'النافامشا عدسة للارتباط والدارما وحال الكواكب بجانب D1. ليست مرحلة تبدأ في عمر ثابت ولا حكمًا على شريك أو زواج.', 'venus'],
    [10, 'D10', 'المهنة', 'طريقك المهني وما تُعرف به وكيف تتعامل مع النجاح.', 'saturn'],
    [11, 'D11', 'المكاسب والدوائر', 'إيكاداشامشا بعدّ رامان العكسي من البرج السابق لبرج المصدر. تُستخدم هنا كعدسة تأملية للمكاسب والدوائر، لا وعدًا بمال أو حماية. ليست من الست عشرة الكلاسيكية، وتختلف عن قواعد D11 الأخرى.', 'jupiter'],
    [12, 'D12', 'الوالدان', 'ما ورثته من والديك وأصلك وأثر البيت الأول.', 'sun'],
    [16, 'D16', 'الراحة', 'المركبات والرفاهية والمتع المادية في حياتك.', 'venus'],
    [20, 'D20', 'الروح', 'نموك الروحي وعلاقتك بالعبادة والتأمل والصفاء الداخلي.', 'jupiter'],
    [24, 'D24', 'التعليم', 'الدراسة والمعرفة والشهادات وكيف تتعلم وتنجح فيها.', 'mercury'],
    [27, 'D27', 'القوة', 'قوتك وتحملك وما يحتاج منك رعاية في طاقتك الجسدية.', 'mars'],
    [30, 'D30', 'التحديات', 'الضغوط والاختبارات الخفية وما يتعبك دون أن يظهر للناس.', 'saturn'],
    [40, 'D40', 'التيسير والتعقيد', 'عدسة تقليدية لجوانب التيسير والتعقيد، مع قراءة تأملية للسياق الموروث. لا تثبت أحداثًا في سيرة الأم أو العائلة.', 'moon'],
    [45, 'D45', 'الطبع والسلوك', 'عدسة واسعة للطبع والسلوك ومجالات الحياة. تُذكر القيم المتعلّمة كسؤال للتأمل، لا كإثبات لسيرة الأب أو إرث محدد.', 'sun'],
    [60, 'D60', 'العدسة الدقيقة', 'تقسيم شديد الحساسية لوقت الميلاد. تُعرض نصوصه كتأمل رمزي بعد فحص عينات ضمن هامش الدقة الذي تحدده، ولا يثبت حياة سابقة أو رصيدًا موروثًا.', 'moon']
  ];
  var ORIG = { moon: 'Chandra', sun: 'Surya', 1: 'Rasi', 2: 'Hora', 5: 'Panchamsa', 6: 'Shashthamsa', 8: 'Ashtamsa', 11: 'Ekadasamsa (Raman)', 3: 'Drekkana', 4: 'Chaturthamsa', 7: 'Saptamsa', 9: 'Navamsa', 10: 'Dasamsa', 12: 'Dwadasamsa', 16: 'Shodasamsa', 20: 'Vimsamsa', 24: 'Siddhamsa', 27: 'Bhamsa', 30: 'Trimsamsa', 40: 'Khavedamsa', 45: 'Akshavedamsa', 60: 'Shashtiamsa' };
  /* الرسم الجنوبي: البروج ثابتة في أماكنها (الحمل ثاني خلية في الصف الأول) ويمضي الترتيب مع عقارب الساعة */
  var SOUTH = { 11: [0, 0], 0: [1, 0], 1: [2, 0], 2: [3, 0], 3: [3, 1], 4: [3, 2], 5: [3, 3], 6: [2, 3], 7: [1, 3], 8: [0, 3], 9: [0, 2], 10: [0, 1] };
  var SPEC = [5, 6, 8, 11];
  var CENTERS = [[200, 92], [100, 40], [40, 100], [92, 200], [40, 300], [100, 360], [200, 308], [300, 360], [360, 300], [308, 200], [360, 100], [300, 40]];
  var NUMPOS = [[200, 150], [100, 20], [18, 98], [150, 200], [18, 306], [100, 392], [200, 252], [300, 392], [382, 306], [250, 200], [382, 98], [300, 20]];
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(x) { return ((x % 360) + 360) % 360; }
  function bodyLon(ch, key) {
    var list = ch.bodies || [], i, k;
    if (key === 'ketu') { var n = bodyLon(ch, 'node'); return n == null ? null : norm(n + 180); }
    for (i = 0; i < list.length; i++) { k = String(list[i].key).toLowerCase(); if (k === key) return list[i].lon; }
    if (key === 'node') for (i = 0; i < list.length; i++) if (String(list[i].key).toLowerCase() === 'truenode') return list[i].lon;
    return null;
  }
  function retroOf(ch, key) {
    var list = ch.bodies || [];
    for (var i = 0; i < list.length; i++) if (String(list[i].key).toLowerCase() === key) return !!list[i].retro;
    return key === 'node' || key === 'ketu';
  }
  /* يبني خريطة التقسيم n: برج الطالع (أو القمر عند غياب الوقت) وكل كوكب مع برجه وبيته */
  function build(ch, n) {
    var D = window.AqVedic.div, known = !!ch.known, lagna, basis = known ? 'asc' : 'moon';
    var moonLon = bodyLon(ch, 'moon');
    if (n === 'moon' || n === 'sun') { /* خريطة القمر/الشمس: نفس أبراج D1 والطالع هو برج القمر/الشمس */
      var bl = bodyLon(ch, n), sg0 = bl == null ? 0 : D(bl, 1); lagna = sg0; basis = n;
      var its = [];
      PL.forEach(function (p) { var lon = bodyLon(ch, p[0]); if (lon == null) return; var sg = D(lon, 1); its.push({ lon: lon, key: p[0], name: p[1], ab: p[2], sign: sg, house: (sg - lagna + 12) % 12, retro: p[0] !== 'node' && p[0] !== 'ketu' && retroOf(ch, p[0]) }); });
      return { n: n, lagna: lagna, basis: basis, items: its };
    }
    lagna = known ? D(ch.asc, n) : (moonLon == null ? 0 : D(moonLon, n));
    var items = [];
    PL.forEach(function (p) {
      var lon = bodyLon(ch, p[0]); if (lon == null) return;
      var sg = D(lon, n);
      items.push({ lon: lon, key: p[0], name: p[1], ab: p[2], sign: sg, house: (sg - lagna + 12) % 12, retro: p[0] !== 'node' && p[0] !== 'ketu' && retroOf(ch, p[0]) });
    });
    return { n: n, lagna: lagna, basis: basis, items: items };
  }
  function lagLbl(m) { return m.n === 'moon' || m.n === 'sun' ? 'ط' : m.basis === 'asc' ? 'ط' : 'ط*'; }
  function lines(arr) {
    var out = [], cur = [];
    arr.forEach(function (a) { cur.push(a); if (cur.length === 2) { out.push(cur); cur = []; } });
    if (cur.length) out.push(cur);
    return out;
  }
  /* لون كل كوكب: نور أخضر، ظل أحمر، شمس ذهبية، الطالع عنابي */
  var TONE = { sun: 'g', moon: 'n', mercury: 'n', venus: 'n', jupiter: 'n', mars: 's', saturn: 's', node: 's', ketu: 's', lagna: 'l' };
  var TCOL = { g: ['#F8EBCB', '#C5A059', '#6E5319'], n: ['#E4F0E1', '#7FA67D', '#2F5A32'], s: ['#F8E2DE', '#C9786E', '#8E2A22'], l: ['#6A2038', '#C5A059', '#FFF3D6'] };
  function pill(x, y, w, label, tone, retro) {
    var c = TCOL[tone] || TCOL.g;
    return '<g><rect x="' + (x - w / 2) + '" y="' + (y - 10) + '" width="' + w + '" height="20" rx="10" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="1.3"/>' +
      '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" font-size="12.5" font-weight="800" fill="' + c[2] + '">' + esc(label) + (retro ? '<tspan font-size="9" dy="-4">℞</tspan>' : '') + '</text></g>';
  }
  /* البيوت ثابتة في الرسم الشمالي، والألوان تتبع عنصر البرج لا ترتيب البيت. */
  var GLYPHS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  var FIELDS = [
    [[200,0],[100,100],[200,200],[300,100]], [[0,0],[200,0],[100,100]],
    [[0,0],[100,100],[0,200]], [[0,200],[100,100],[200,200],[100,300]],
    [[0,200],[100,300],[0,400]], [[0,400],[100,300],[200,400]],
    [[200,200],[100,300],[200,400],[300,300]], [[200,400],[300,300],[400,400]],
    [[400,400],[300,300],[400,200]], [[200,200],[300,100],[400,200],[300,300]],
    [[400,0],[400,200],[300,100]], [[200,0],[400,0],[300,100]]
  ];
  var HEADS = [[200,53],[100,19],[34,88],[100,164],[34,288],[100,341],
    [200,269],[300,341],[366,288],[300,164],[366,88],[300,19]];
  var INKS = ['#784638','#796039','#6A435A','#4C6267'];
  var FILLS = ['#E8CFC1','#EBDFC3','#E5D6DE','#D5E0DD'];
  function inside(poly,x,y) {
    var sign=0;
    for(var j=0;j<poly.length;j++) {var a=poly[j],b=poly[(j+1)%poly.length],v=(b[0]-a[0])*(y-a[1])-(b[1]-a[1])*(x-a[0]);if(Math.abs(v)<.01)continue;var z=v>0?1:-1;if(sign&&z!==sign)return false;sign=z;}
    return true;
  }
  /* تتسع حتى لتجمّع الكواكب التسعة، بلا إخفاء أو عبور لحدود البيوت. */
  function labelAt(i,count) {
    var h=HEADS[i].slice(),compact=count>4&&i%3!==0;
    if(compact&&(i===5||i===7))h[1]=389;
    return {x:h[0],y:h[1],compact:compact};
  }
  function placement(i,count) {
    var poly=FIELDS[i],hd=labelAt(i,count),target=CENTERS[i],found=[],w=32,ht=19;
    for(var attempt=0;attempt<8;attempt++) {
      w=32-attempt*2;ht=19-attempt;found=[];var slots=[];
      for(var y=10+ht/2;y<397-ht/2;y+=ht+2) {
        var xs=[];
        for(var x=2+w/2;x<398-w/2;x++) {
          if(![[x-w/2-1,y-ht/2-1],[x+w/2+1,y-ht/2-1],[x+w/2+1,y+ht/2+1],[x-w/2-1,y+ht/2+1]].every(function(p){return inside(poly,p[0],p[1]);}))continue;
          xs.push(x);
        }
        if(!xs.length)continue;
        var n=Math.floor((xs[xs.length-1]-xs[0])/(w+3))+1,mid=(xs[0]+xs[xs.length-1])/2;
        for(var k=0;k<n;k++) {
          var px=mid+(k-(n-1)/2)*(w+3);
          if(Math.abs(px-hd.x)<w/2+35&&y+ht/2>hd.y-12&&y-ht/2<hd.y+(hd.compact?4:25))continue;
          if(Math.hypot(px-200,y-200)<31+w/2)continue;
          slots.push([px,y]);
        }
      }
      slots.sort(function(a,b){return Math.hypot(a[0]-target[0],a[1]-target[1]-15)-Math.hypot(b[0]-target[0],b[1]-target[1]-15);});
      found=slots.slice(0,count).sort(function(a,b){return a[1]-b[1]||a[0]-b[0];});
      if(found.length===count)break;
    }
    return {points:found,w:w,h:ht};
  }
  function medallion(label,radius) {
    var year=/^\d{4}$/.test(String(label)),arabic=/[\u0600-\u06ff]/.test(String(label)),size=year?19:arabic?13:20;
    return '<g class="vc-medallion" transform="translate(200 200) scale('+(radius/30)+')"><circle cy="1.6" r="30" fill="#A88A54" opacity=".12"/><circle r="30" fill="#FCF7EB" stroke="#BA9D69" stroke-width="1"/><circle r="26.5" fill="none" stroke="#E6D8BA" stroke-width=".6"/><text class="vc-medallion-label" x="0" y="-5" text-anchor="middle" dominant-baseline="middle" font-family="'+(year?'Amiri,serif':'inherit')+'" font-size="'+size+'" font-weight="'+(year?'700':'600')+'" fill="'+WINE+'">'+esc(label)+'</text><path d="M-10 6H10" stroke="#D9C39B" stroke-width=".65"/><text class="vc-medallion-brand" x="0" y="18" text-anchor="middle" font-family="Amiri,serif" font-size="11" fill="#977D57" opacity=".85">عقيق</text></g>';
  }
  function svg(map, title, centerLabel) {
    var label=centerLabel || (map.n==='moon'?'القمر':map.n==='sun'?'الشمس':'D'+map.n);
    var h='<svg class="vc-svg vc-north" viewBox="0 0 424 424" role="img" aria-label="'+esc(title)+'" xmlns="http://www.w3.org/2000/svg">';
    h+='<title>'+esc(title)+'</title><desc>البيت الأول أعلى المعين، ثم البيوت عكس عقارب الساعة. كل خانة تحمل رقم البرج ورمزه واسمه، والألوان حسب عنصر البرج.</desc>';
    h+='<rect x="1" y="1" width="422" height="422" rx="17" fill="#F8F2E7" stroke="#D8C39B"/><rect x="7" y="7" width="410" height="410" rx="12" fill="none" stroke="#E2D3B8"/>';
    h+='<g transform="translate(12 12)">';
    for(var i=0;i<12;i++) {
      var sg=(map.lagna+i)%12,hd=HEADS[i],el=sg%4;
      h+='<g class="vc-house" data-house="'+(i+1)+'" data-sign="'+sg+'"><title>البيت '+(i+1)+' · '+SG[sg]+'</title><polygon points="'+FIELDS[i].map(function(p){return p.join(',');}).join(' ')+'" fill="'+FILLS[el]+'" fill-opacity="'+(i%3===0?'.9':'.38')+'"/>';
      var here=map.items.filter(function(x){return x.house===i;}).map(function(x){return {t:x.ab,name:x.name,tone:TONE[x.key]||'g',r:x.retro,key:x.key};});
      if(i===0)here.unshift({t:lagLbl(map),name:'الطالع',tone:'l',r:false,key:'lagna'});
      var hd0=labelAt(i,here.length);
      if(hd0.compact) {
        h+='<g class="vc-sign-label" fill="'+INKS[el]+'" text-anchor="middle"><text x="'+(hd0.x-30)+'" y="'+hd0.y+'" font-size="10">'+(sg+1)+'</text><text x="'+(hd0.x-15)+'" y="'+hd0.y+'" font-family="Georgia, serif" font-size="13">'+GLYPHS[sg]+'&#xfe0e;</text><text x="'+(hd0.x+13)+'" y="'+hd0.y+'" font-size="10" direction="rtl">'+SG[sg]+'</text></g>';
      } else {
      h+='<g class="vc-sign-label" fill="'+INKS[el]+'" text-anchor="middle"><text x="'+(hd[0]-11)+'" y="'+hd[1]+'" font-size="15" font-weight="600">'+(sg+1)+'</text><text x="'+(hd[0]+12)+'" y="'+hd[1]+'" font-family="Georgia, serif" font-size="19">'+GLYPHS[sg]+'&#xfe0e;</text><text x="'+hd[0]+'" y="'+(hd[1]+19)+'" font-size="13" font-weight="600" direction="rtl">'+SG[sg]+'</text></g>';
      }
      var layout=placement(i,here.length);
      here.forEach(function(it,j){var p=layout.points[j];if(!p)return;var col=TCOL[it.tone],fs=Math.min(12,layout.h*.64);
        h+='<g class="vc-body" data-planet="'+esc(it.key)+'"><title>'+esc(it.name)+(it.r?' · متراجع':'')+'</title><rect x="'+(p[0]-layout.w/2)+'" y="'+(p[1]-layout.h/2)+'" width="'+layout.w+'" height="'+layout.h+'" rx="'+layout.h/2+'" fill="'+(it.tone==='l'?WINE:'#FFFCF5')+'" fill-opacity=".95" stroke="'+(it.tone==='l'?GOLD:col[1])+'" stroke-width=".8"/><text x="'+p[0]+'" y="'+p[1]+'" text-anchor="middle" dominant-baseline="central" font-size="'+fs+'" font-weight="700" fill="'+(it.tone==='l'?'#FFF1D6':col[2])+'">'+esc(it.t)+(it.r?'<tspan font-size="8" baseline-shift="super">℞</tspan>':'')+'</text></g>';
      });
      h+='</g>';
    }
    h+='<g fill="none" stroke="#9B805B" stroke-width="1.05" stroke-linejoin="round"><path d="M0 0H400V400H0ZM0 0L400 400M400 0L0 400M200 0L400 200L200 400L0 200Z"/></g>';
    [[200,0],[0,200],[200,400],[400,200]].forEach(function(p){h+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4.5" fill="#F8F2E7" stroke="#9B805B"/><circle cx="'+p[0]+'" cy="'+p[1]+'" r="1.5" fill="'+WINE+'"/>';});
    h+=medallion(label,29);
    return h+'</g></svg>';
  }
  function svgSouth(map, title) {
    var label=map.n==='moon'?'القمر':map.n==='sun'?'الشمس':'D'+map.n;
    var h='<svg class="vc-svg vc-south" viewBox="0 0 424 424" role="img" aria-label="'+esc(title)+'" xmlns="http://www.w3.org/2000/svg"><title>'+esc(title)+'</title><desc>الأبراج ثابتة في الرسم الجنوبي. الحمل ثاني خانة في الصف الأعلى، ثم مع عقارب الساعة. الخط المائل يحدد الطالع.</desc>';
    h+='<rect x="1" y="1" width="422" height="422" rx="17" fill="#F8F2E7" stroke="#D8C39B"/><rect x="7" y="7" width="410" height="410" rx="12" fill="none" stroke="#E2D3B8"/><g transform="translate(12 12)">';
    h+='<rect x="100" y="100" width="200" height="200" fill="#FCF7EB"/>';
    for(var sg=0;sg<12;sg++) {
      var pos=SOUTH[sg],x=pos[0]*100,y=pos[1]*100,cx=x+50,house=(sg-map.lagna+12)%12,el=sg%4;
      h+='<g class="vc-house" data-house="'+(house+1)+'" data-sign="'+sg+'"><title>البيت '+(house+1)+' · '+SG[sg]+'</title><rect x="'+x+'" y="'+y+'" width="100" height="100" fill="'+FILLS[el]+'" fill-opacity=".55"/>';
      h+='<g class="vc-sign-label" text-anchor="middle" fill="'+INKS[el]+'"><text x="'+(cx-12)+'" y="'+(y+19)+'" font-size="14" font-weight="600">'+(sg+1)+'</text><text x="'+(cx+12)+'" y="'+(y+19)+'" font-size="19" font-family="Georgia,serif">'+GLYPHS[sg]+'&#xfe0e;</text><text x="'+cx+'" y="'+(y+38)+'" font-size="13" font-weight="600" direction="rtl">'+SG[sg]+'</text></g>';
      var here=map.items.filter(function(it){return it.sign===sg;}).map(function(it){return {t:it.ab,key:it.key,name:it.name,tone:TONE[it.key]||'g',r:it.retro};});
      if(house===0){here.unshift({t:lagLbl(map),key:'lagna',name:'الطالع',tone:'l'});h+='<path d="M'+x+' '+(y+20)+'L'+(x+20)+' '+y+'" stroke="'+WINE+'" stroke-width="1.6"/>';}
      var cols=here.length>6?3:here.length>2?2:1,rows=Math.ceil(here.length/cols),ht=rows>2?12:19,gy=ht+3,w=cols===3?27:34;
      here.forEach(function(it,j){var row=Math.floor(j/cols),col=j%cols,n=Math.min(cols,here.length-row*cols),px=cx+(col-(n-1)/2)*(w+3),py=y+52+row*gy,c=TCOL[it.tone];
        h+='<g class="vc-body" data-planet="'+esc(it.key)+'"><title>'+esc(it.name)+(it.r?' · متراجع':'')+'</title><rect x="'+(px-w/2)+'" y="'+(py-ht/2)+'" width="'+w+'" height="'+ht+'" rx="'+ht/2+'" fill="'+(it.tone==='l'?WINE:'#FFFCF5')+'" stroke="'+(it.tone==='l'?GOLD:c[1])+'" stroke-width=".8"/><text x="'+px+'" y="'+py+'" text-anchor="middle" dominant-baseline="central" font-size="'+(rows>2?9:12)+'" font-weight="700" fill="'+(it.tone==='l'?'#FFF1D6':c[2])+'">'+esc(it.t)+(it.r?'<tspan font-size="7" baseline-shift="super">℞</tspan>':'')+'</text></g>';
      });h+='</g>';
    }
    h+='<g fill="none" stroke="#9B805B" stroke-width="1.05"><path d="M0 0H400V400H0ZM100 0V400M300 0V400M200 0V100M200 300V400M0 100H400M0 300H400M0 200H100M300 200H400"/></g>';
    [[100,100],[300,100],[300,300],[100,300]].forEach(function(p){h+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3" fill="#F8F2E7" stroke="#9B805B"/>';});
    h+=medallion(label,39);
    return h+'</g></svg>';
  }
  /* رموز وضع الخبير الصامتة: تظهر للأدمن بعد فتح القفل فقط */
  function codesFor(map, x) {
    var c = [], h = x.house + 1, mal = { mars: 1, saturn: 1, node: 1, ketu: 1 }[x.key];
    if ((map.n === 6 && (h === 6 || h === 8 || h === 12)) || (map.n === 1 && h === 6)) c.push('M-06');
    if (map.n === 30 && (h === 6 || h === 8 || h === 12 || (mal && (h === 1 || h === 4 || h === 7 || h === 10)))) c.push('K-30');
    if (h === 8) c.push('T-08');
    if (h === 12 || (map.n === 2 && h === 6)) c.push('D-12');
    return c;
  }
  var EXA = { sun: 0, moon: 1, mars: 9, mercury: 5, jupiter: 3, venus: 11, saturn: 6, node: 1, ketu: 7 };
  var OWN = { sun: [4], moon: [3], mars: [0, 7], mercury: [2, 5], jupiter: [8, 11], venus: [1, 6], saturn: [9, 10] };
  var COMB = { moon: 12, mars: 17, mercury: 14, jupiter: 11, venus: 10, saturn: 15 };
  var SIGNLORD = ['mars', 'venus', 'mercury', 'moon', 'sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'];
  var ASP = { mars: [4, 7, 8], jupiter: [5, 7, 9], saturn: [3, 7, 10], node: [5, 7, 9], ketu: [5, 7, 9] };
  function dignity(x) {
    if (EXA[x.key] === x.sign) return ['ex', 'مرتفع'];
    if (EXA[x.key] != null && (EXA[x.key] + 6) % 12 === x.sign) return ['db', 'هابط'];
    if (OWN[x.key] && OWN[x.key].indexOf(x.sign) >= 0) return ['ow', 'في برجه'];
    return null;
  }
  function degTxt(lon) { var d = ((lon % 30) + 30) % 30, g = Math.floor(d), m = Math.floor((d - g) * 60); return g + '°' + (m < 10 ? '0' : '') + m + '′'; }
  function detail(map, x) {
    var parts = [], dg = dignity(x), T = window.AqVedic && window.AqVedic.T, d1 = map.n === 1 || map.n === 'moon' || map.n === 'sun';
    if (d1 && x.lon != null) {
      parts.push('<i class="vc-dg">' + degTxt(x.lon) + '</i>');
      var u = 360 / 27, ni = Math.floor(x.lon / u) % 27, pd = Math.floor((x.lon % u) / (u / 4)) + 1;
      if (T && T.NK && T.NK[ni]) parts.push('<i class="vc-nk">' + T.NK[ni][0] + ' · ' + pd + '</i>');
    }
    if (d1 && x.lon != null && COMB[x.key]) {
      var su = map.items.filter(function (y) { return y.key === 'sun'; })[0];
      if (su && su.lon != null) { var df = Math.abs(((x.lon - su.lon + 540) % 360) - 180); var orb = COMB[x.key] - (x.retro && (x.key === 'mercury' || x.key === 'venus') ? 2 : 0); if (df <= orb) parts.push('<i class="vc-dn vc-dn-db">محترق</i>'); }
    }
    if (dg) parts.push('<i class="vc-dn vc-dn-' + dg[0] + '">' + dg[1] + '</i>');
    return parts.length ? '<span class="vc-dt">' + parts.join('') + '</span>' : '';
  }
  function houseRows(map) {
    return map.items.map(function (x) {
      var tn = TONE[x.key] || 'g';
      return '<li class="vc-r vc-t-' + tn + '"><span class="vc-ab">' + esc(x.ab) + '</span><b>' + esc(x.name) + (x.retro ? ' ℞' : '') + '</b><span class="vc-sg">' + SG[x.sign] + ' · البيت ' + (x.house + 1) + '</span>' + detail(map, x) + (window.AqVedicExpert && window.AqVedicExpert.on ? '<span class="vc-codes">' + codesFor(map, x).map(function (k) { return '<em class="vc-code">[' + k + ']</em>'; }).join('') + '</span>' : '') + '</li>';
    }).join('');
  }
  function extras(map) {
    var by = {}, SGn = window.AqVedic && window.AqVedic.T ? window.AqVedic.T.SG : [];
    map.items.forEach(function (x) { by[x.key] = x; });
    var lords = '';
    for (var h = 0; h < 12; h++) {
      var sg = (map.lagna + h) % 12, lk = SIGNLORD[sg], lp = by[lk];
      lords += '<li><b>البيت ' + (h + 1) + '</b><span>' + SG[sg] + '</span><em>' + (lp ? esc(lp.name) + ' في البيت ' + (lp.house + 1) : '') + '</em></li>';
    }
    var asp = map.items.map(function (x) {
      var hs = (ASP[x.key] || [7]).map(function (n) { return (x.house + n - 1) % 12; });
      var tg = map.items.filter(function (y) { return y.key !== x.key && hs.indexOf(y.house) >= 0; }).map(function (y) { return esc(y.name); });
      return '<li><b>' + esc(x.name) + '</b><span>ينظر إلى البيوت ' + hs.map(function (v) { return v + 1; }).sort(function (a, b) { return a - b; }).join('، ') + '</span><em>' + (tg.length ? tg.join('، ') : 'لا كواكب هناك') + '</em></li>';
    }).join('');
    return '<details class="vc-ext"><summary>حكام البيوت</summary><ul class="vc-xl">' + lords + '</ul></details>' +
      '<details class="vc-ext"><summary>النظرات (غراها دريشتي)</summary><ul class="vc-xl">' + asp + '</ul></details>';
  }
  function mount(host, ch, natal, only) {
    if (!host || !window.AqVedic) return;
    var cur = only === undefined ? 1 : only, style = 'n';
    try { style = localStorage.getItem('aq-vedic-style') === 's' ? 's' : 'n'; } catch (e) {}
    function draw() {
      var v = VARGAS.filter(function (x) { return x[0] === cur; })[0], map = build(ch, cur), title = 'مخطط ' + v[1] + ' · ' + v[2];
      var sig = v[4] ? map.items.filter(function (x) { return x.key === v[4]; })[0] : null;
      var chipOf = function (x) { return '<button type="button" class="vc-chip' + (x[0] === cur ? ' on' : '') + '" data-n="' + x[0] + '" aria-pressed="' + (x[0] === cur) + '"><b>' + String(x[1]).replace('خريطة ', '') + '</b><span>' + x[2] + '</span><small>' + (ORIG[x[0]] || '') + '</small></button>'; };
      var GR = [['الأساس', ['1', 'moon', 'sun']], ['الحياة اليومية', ['2', '3', '4', '5', '6', '7']], ['المسار والعمق', ['8', '9', '10', '11', '12']], ['التخصص الدقيق', ['16', '20', '24', '27', '30', '40', '45', '60']]];
      var chipsAll = GR.map(function (g) {
        return '<h5 class="vc-sub">' + g[0] + '</h5><div class="vc-grp' + (g[1].length === 3 ? ' vc-grp3' : '') + '" role="group" aria-label="' + g[0] + '">' + g[1].map(function (k) { var x = VARGAS.filter(function (y) { return String(y[0]) === k; })[0]; return x ? chipOf(x) : ''; }).join('') + '</div>';
      }).join('');
      var note = (cur === 'moon' || cur === 'sun') ? 'البيت الأول هنا هو برج ' + (cur === 'moon' ? 'القمر' : 'الشمس') + ' (' + SG[map.lagna] + ').' : map.basis === 'asc' ? 'الطالع في ' + SG[map.lagna] + '.' : 'وقت الميلاد غير معروف، فالمخطط يبدأ من برج القمر (' + SG[map.lagna] + ') بدل الطالع.';
      host.innerHTML = (only === undefined ? '<h4>المخططات الفيدية · التقسيمات</h4>' + chipsAll : '') +
        '<div class="vc-caption"><span>' + esc(cur === 'moon' || cur === 'sun' ? ORIG[cur] : v[1]) + '</span>' + (cur === 'moon' || cur === 'sun' ? '' : '<small>' + esc(ORIG[cur] || '') + '</small>') + '</div><p class="vc-intro">' + esc(v[3]) + '</p>' +
        '<div class="vc-styles" role="group" aria-label="شكل الرسم"><button type="button" class="vc-st' + (style === 'n' ? ' on' : '') + '" data-s="n">شمالي</button><button type="button" class="vc-st' + (style === 's' ? ' on' : '') + '" data-s="s">جنوبي</button></div>' +
        '<div class="vc-chartwrap">' + (style === 's' ? svgSouth(map, title) : svg(map, title)) + '</div>' +
        '<p class="vc-key"><i class="vc-t-n">نور</i><i class="vc-t-s">ظل</i><i class="vc-t-g">الشمس</i><i class="vc-t-l">الطالع</i></p>' + '<details class="vc-guide"><summary>دليل قراءة الخريطة</summary>' + '<p class="vc-note">' + esc(note) + (style === 's' ? ' في الرسم الجنوبي كل برج له مكان ثابت (الحمل ثاني خانة في الصف الأعلى) ويمضي الترتيب مع عقارب الساعة، والخط المائل يعلّم خانة الطالع. ℞ يعني راجع.' : ' الأرقام داخل الخانات أرقام البروج (1 الحمل ... 12 الحوت)، والبيت 1 في الأعلى ويمضي الترتيب عكس عقارب الساعة. تدرجات الخانات تميّز عناصر الأبراج وليست حكمًا على قوة الكواكب. ℞ يعني راجع.') + '</p>' + '</details><ul class="vc-rows">' + houseRows(map) + '</ul>' + extras(map) +
        (sig ? '<p class="vc-sig">' + esc(sig.name) + ' الدال هنا في ' + SG[sig.sign] + ' (البيت ' + (sig.house + 1) + ').</p>' : '');
      if (window.AqVedicNarratives) { var reading = document.createElement('section'); reading.className = 'vn-reading'; host.appendChild(reading); window.AqVedicNarratives.mount(reading, map, ch, natal); }
      host.querySelectorAll('.vc-st').forEach(function (b) { b.addEventListener('click', function () { style = b.dataset.s; try { localStorage.setItem('aq-vedic-style', style); } catch (e) {} draw(); }); });
      host.querySelectorAll('.vc-chip').forEach(function (b) { b.addEventListener('click', function () { cur = isNaN(+b.dataset.n) ? b.dataset.n : +b.dataset.n; draw(); var on = host.querySelector('.vc-chip.on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest', inline: 'center' }); }); });
    }
    host.__draw = draw;
    draw();
  }
  /* عرض مكبّر متاح بلوحة المفاتيح واللمس، بلا تغيير في بيانات الرسم. */
  var viewer=null,viewerOrigin=null,viewerScale=1;
  function ensureViewer() {
    if(viewer)return;
    viewer=document.createElement('dialog');viewer.className='vc-viewer';viewer.setAttribute('aria-labelledby','vc-viewer-title');
    viewer.innerHTML='<div class="vc-viewer-head"><h2 id="vc-viewer-title">الخريطة المكبّرة</h2><button type="button" data-vc-close aria-label="إغلاق الخريطة المكبّرة">إغلاق</button></div><div class="vc-viewer-tools"><button type="button" data-vc-zoom="-1" aria-label="تصغير">−</button><output aria-live="polite">100%</output><button type="button" data-vc-zoom="1" aria-label="تكبير">+</button><button type="button" data-vc-fit>ملاءمة الشاشة</button></div><p class="vc-viewer-hint">كبّر الخريطة ثم مرّر داخلها لقراءة التفاصيل.</p><div class="vc-viewer-pan" tabindex="0" aria-label="مساحة الخريطة، مرّر لرؤية التفاصيل"><div class="vc-viewer-art"></div></div>';
    document.body.appendChild(viewer);
    viewer.addEventListener('click',function(e){
      if(e.target.closest('[data-vc-close]')||e.target===viewer){viewer.close();return;}
      var z=e.target.closest('[data-vc-zoom]');
      if(z){viewerScale=Math.max(1,Math.min(3,viewerScale+Number(z.dataset.vcZoom)*.5));resizeViewer();}
      if(e.target.closest('[data-vc-fit]')){viewerScale=1;resizeViewer();}
    });
    viewer.addEventListener('close',function(){document.documentElement.classList.remove('vc-viewer-open');if(viewerOrigin&&viewerOrigin.isConnected)viewerOrigin.focus({preventScroll:true});viewer.querySelector('.vc-viewer-art').replaceChildren();});
  }
  function resizeViewer(){
    var pan=viewer.querySelector('.vc-viewer-pan'),art=viewer.querySelector('.vc-viewer-art');
    art.style.width=Math.round(Math.min(820,pan.clientWidth,pan.clientHeight)*viewerScale)+'px';
    viewer.querySelector('output').textContent=Math.round(viewerScale*100)+'%';
    viewer.querySelector('[data-vc-zoom="-1"]').disabled=viewerScale===1;
    viewer.querySelector('[data-vc-zoom="1"]').disabled=viewerScale===3;
  }
  function enhanceCharts(){
    document.querySelectorAll('#astro-maps .vc-chartwrap,#astro-maps .vyr-chart').forEach(function(w){
      if(w.querySelector('.vc-expand'))return;
      var b=document.createElement('button');b.type='button';b.className='vc-expand';b.textContent='تكبير الخريطة';b.setAttribute('aria-haspopup','dialog');w.appendChild(b);
    });
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('.vc-expand');if(!b)return;
    var chart=b.parentElement.querySelector('.vc-svg');if(!chart)return;
    ensureViewer();viewerOrigin=b;viewerScale=1;viewer.querySelector('.vc-viewer-art').replaceChildren(chart.cloneNode(true));
    viewer.querySelector('h2').textContent=chart.getAttribute('aria-label')||'الخريطة المكبّرة';
    viewer.showModal();document.documentElement.classList.add('vc-viewer-open');resizeViewer();viewer.querySelector('[data-vc-close]').focus();
  });
  new MutationObserver(enhanceCharts).observe(document.getElementById('astro-maps')||document.body,{childList:true,subtree:true});
  window.addEventListener('resize',function(){if(viewer&&viewer.open)resizeViewer();});
  enhanceCharts();
  window.AqVedicChart = { mount: mount, build: build, svg: svg, VARGAS: VARGAS, PL: PL, svgSouth: svgSouth, codesFor: codesFor };
})();
