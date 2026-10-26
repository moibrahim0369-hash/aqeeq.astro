(() => {
  'use strict';
  const SIGNS = ['الحمل','الثور','الجوزاء','السرطان','الأسد','العذراء','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'];
  const MASTER = new Set([11,22,33]);
  const LIFE_PATH_DATA = window.AqeeqLifePathData || {};
  const ARCANA = [
    ['البداية والإرادة','مبادرة وابتكار','اندفاع أو تشتت'],['المعرفة والحدس','إنصات ووعي داخلي','كتمان أو تردد'],['النمو والرعاية','إبداع واحتواء','إفراط في السيطرة'],['النظام والمسؤولية','ثبات وتنظيم','جمود أو تشدد'],['التعلم والقيم','حكمة ومشاركة خبرة','وعظ أو تعلق بالقواعد'],['الاختيار والانسجام','تقارب ووضوح قيم','إرضاء الآخرين'],['الحركة والتقدم','شجاعة وتوجيه للطاقة','استعجال أو صراع'],['العدل والتوازن','إنصاف واتزان','قسوة في الحكم'],['التأمل والخبرة','صبر واستقلال','عزلة أو انغلاق'],['الدورات والفرص','مرونة واستعداد للتغيير','انتظار الحظ'],['القوة والاتزان','شجاعة هادئة وضبط للنفس','كبت أو إنهاك'],['تغيير المنظور','تأنٍ ورؤية مختلفة','تعليق القرار'],['التحول والتجدد','ترك ما انتهى','مقاومة التغيير'],['الاعتدال والمواءمة','توازن وتدرج','تأجيل الاحتياجات'],['الاختيار الواعي','ملاحظة التعلق واستعادة الحرية','تعلق أو إفراط'],['التحرر من البنى القديمة','كشف ما يحتاج إلى إصلاح','هدم بلا خطة'],['الأمل والإلهام','ثقة هادئة ورؤية بعيدة','مثالية أو تشتت'],['الحدس والمشاعر','خيال وتعاطف مع التحقق','ضبابية أو إسقاط'],['الوضوح والحيوية','تعبير ودفء','استنزاف أو مبالغة'],['المراجعة والنداء الداخلي','تعلم من الماضي','لوم الذات'],['الاكتمال والاندماج','إغلاق مرحلة واتساع الأفق','تشتت قبل الإغلاق'],['البدايات المفتوحة','فضول وتجربة','مخاطرة دون تقدير']
  ];
  const normDate = value => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return {year:value.getFullYear(),month:value.getMonth()+1,day:value.getDate()};
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
    if (!match) throw new TypeError('تاريخ الميلاد مطلوب بصيغة YYYY-MM-DD');
    const [,y,m,d] = match.map(Number);
    const check = new Date(Date.UTC(y,m-1,d));
    if (check.getUTCFullYear()!==y || check.getUTCMonth()!==m-1 || check.getUTCDate()!==d) throw new RangeError('تاريخ الميلاد غير صالح');
    return {year:y,month:m,day:d};
  };
  function digitSum(value) { return String(Math.abs(Math.trunc(value))).split('').reduce((sum,digit)=>sum+Number(digit),0); }
  function reduceLifePath(value) { let n=Math.abs(Math.trunc(value)); while(n>9&&!MASTER.has(n)) n=digitSum(n); return n; }
  function calculateLifePath(birthDate) {
    const {year,month,day}=normDate(birthDate);
    const components=[reduceLifePath(day),reduceLifePath(month),reduceLifePath(digitSum(year))];
    return {number:reduceLifePath(components.reduce((a,b)=>a+b,0)),components};
  }
  function reduceArcana(value) { let n=Math.abs(Math.trunc(value)); while(n>22) n=digitSum(n); return n || 22; }
  function calculateDestinyMatrix(birthDate) {
    const {year,month,day}=normDate(birthDate);
    // A=day, B=month, C=year; D=A+B+C; E=A+B+C+D. R preserves 1..22.
    const A=reduceArcana(day), B=reduceArcana(month), C=reduceArcana(digitSum(year));
    const D=reduceArcana(A+B+C), E=reduceArcana(A+B+C+D);
    const F=reduceArcana(A+B), G=reduceArcana(B+C), H=reduceArcana(C+D), I=reduceArcana(D+A);
    const ancestralCenter=reduceArcana(F+G+H+I), commonCenter=reduceArcana(E+ancestralCenter);
    const nodes={north:A,east:B,south:C,west:D,northEast:F,southEast:G,southWest:H,northWest:I,center:E};
    return {nodes,anchors:{A,B,C,D,E},generationalCorners:{F,G,H,I},ancestralCenter,commonCenter,
      lines:{money:['northEast','center','southWest'],love:['northWest','center','southEast']},
      formula:'A=اليوم، B=الشهر، C=مجموع أرقام السنة؛ D=R(A+B+C)، E=R(A+B+C+D). زوايا مربع الأسلاف F=R(A+B)، G=R(B+C)، H=R(C+D)، I=R(D+A). كل R تختزل بجمع الأرقام عند تجاوز 22.'};
  }
  function calculateChakraHealthCard(birthDate) {
    const {A,B,C,D,E}=calculateDestinyMatrix(birthDate).anchors, R=reduceArcana;
    const throatPhysics=R(A+E), throatEnergy=R(B+E);
    const rows=[
      {key:'sahasrara',name:'التاج',sanskrit:'Sahasrara',physics:A,energy:B,focus:'المعنى والرسالة التي يختارها الإنسان لنفسه',area:'الرأس (ارتباط رمزي تقليدي)',balance:'الراحة والتأمل الهادئ وربط الفكرة بخطوة واقعية.'},
      {key:'ajna',name:'العين الثالثة',sanskrit:'Ajna',physics:R(A+throatPhysics),energy:R(B+throatEnergy),focus:'الرؤية الفكرية والحدس مع التحقق من الافتراضات',area:'الجبهة والعينان (ارتباط رمزي تقليدي)',balance:'كتابة ما تعرفه وما تفترضه ثم التحقق من معلومة.'},
      {key:'vishuddha',name:'الحنجرة',sanskrit:'Vishuddha',physics:throatPhysics,energy:throatEnergy,focus:'التعبير والإبداع والإنصات المتبادل',area:'الحلق والصوت (ارتباط رمزي تقليدي)',balance:'صياغة الاحتياج بوضوح والاستماع دون استعجال الرد.'},
      {key:'anahata',name:'القلب',sanskrit:'Anahata',physics:R(throatPhysics+E),energy:R(throatEnergy+E),focus:'العلاقات والحدود وصورة العالم',area:'الصدر والتنفس (ارتباط رمزي تقليدي)',balance:'موازنة التعاطف مع حدود واضحة وطلب الدعم عند الحاجة.'},
      {key:'manipura',name:'الضفيرة الشمسية',sanskrit:'Manipura',physics:E,energy:E,focus:'الاختيار والمسؤولية والموارد',area:'أعلى البطن (ارتباط رمزي تقليدي)',balance:'تقسيم المهمة إلى خطوة يمكن التحكم بها اليوم.'},
      {key:'svadhisthana',name:'العجز',sanskrit:'Svadhisthana',physics:R(C+E),energy:R(D+E),focus:'الشغف والمتعة والإبداع',area:'الحوض (ارتباط رمزي تقليدي)',balance:'إتاحة نشاط ممتع وآمن دون تحويله إلى واجب.'},
      {key:'muladhara',name:'الجذر',sanskrit:'Muladhara',physics:C,energy:D,focus:'الأمان العملي والروتين والدعم',area:'الساقان والقدمان (ارتباط رمزي تقليدي)',balance:'اختيار ترتيب عملي صغير يمنح اليوم وضوحاً واستقراراً.'}
    ].map(row=>({...row,emotions:R(row.physics+row.energy)}));
    const total={physics:R(rows.reduce((sum,row)=>sum+row.physics,0)),energy:R(rows.reduce((sum,row)=>sum+row.energy,0)),emotions:R(rows.reduce((sum,row)=>sum+row.emotions,0))};
    return {rows,total,totalLabel:'Common Energy-Zone',anchors:{A,B,C,D,E},method:'حُسبت الحنجرة قبل العين الثالثة والقلب. عمود المشاعر ناتج جمع الجسد والطاقة لكل صف؛ القيم رمزية وليست قياساً حيوياً أو تشخيصاً.'};
  }
  function calculateGenerationalLines(birthDate) {
    const matrix=calculateDestinyMatrix(birthDate), {F,G,H,I}=matrix.generationalCorners, E=matrix.anchors.E, R=reduceArcana;
    return {male:{name:'خط الذكور · الأب',points:[F,E,H],summary:[F,H,R(F+H)],combined:R(F+H)},female:{name:'خط الإناث · الأم',points:[G,E,I],summary:[G,I,R(G+I)],combined:R(G+I)},ancestralCenter:matrix.ancestralCenter,commonCenter:matrix.commonCenter};
  }
  function calculateDestinyAxes(birthDate) {
    const matrix=calculateDestinyMatrix(birthDate), lines=calculateGenerationalLines(birthDate), {A,B,C,D}=matrix.anchors, R=reduceArcana;
    const sky=[B,D,R(B+D)], earth=[A,C,R(A+C)];
    const soulSearching=R(sky[2]+earth[2]), socialization=R(lines.male.combined+lines.female.combined);
    const spiritualExam=R(soulSearching+socialization), planetary=R(socialization+spiritualExam);
    return {sky,earth,soulSearching,male:lines.male.combined,female:lines.female.combined,socialization,spiritualExam,governingEnergy:spiritualExam,planetary};
  }
  const lifeTraits = n => {
    const traits={1:['المبادرة','الاستقلال','القيادة'],2:['التعاون','الإنصات','الحساسية'],3:['التعبير','الإبداع','التواصل'],4:['التنظيم','الثبات','البناء'],5:['المرونة','الفضول','التجربة'],6:['الرعاية','الانسجام','المسؤولية'],7:['التأمل','البحث','التحليل'],8:['الإدارة','الإنجاز','الطموح'],9:['التعاطف','الحكمة','خدمة الآخرين'],11:['الإلهام','الحدس','الرؤية'],22:['البناء الكبير','التخطيط','الأثر العملي'],33:['التعليم','الرعاية','الإلهام']};
    return traits[n] || traits[reduceLifePath(n)] || traits[1];
  };
  const escapeHTML = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const labels={north:'الجوهر · يوم الميلاد',northEast:'موهبة مركبة · المال',east:'الاتصال الروحي · شهر الميلاد',southEast:'خط العلاقات',south:'الدروس · سنة الميلاد',southWest:'مسار الوفرة',west:'تكامل المحاور',northWest:'مساحة العاطفة',center:'المحور المركزي'};
  function renderSVG(matrix) {
    const coords={north:[160,31],northEast:[251,69],east:[289,160],southEast:[251,251],south:[160,289],southWest:[69,251],west:[31,160],northWest:[69,69],center:[160,160]};
    const ring=['north','northEast','east','southEast','south','southWest','west','northWest'];
    const point=k=>coords[k].join(',');
    const line=(a,b,cls)=>`<line class="aqm-line ${cls}" x1="${coords[a][0]}" y1="${coords[a][1]}" x2="${coords[b][0]}" y2="${coords[b][1]}"/>`;
    const polygon=ring.map(point).join(' ');
    const nodes=Object.entries(coords).map(([key,[x,y]])=>`<g class="aqm-node ${key==='center'?'is-center':''}" tabindex="0" role="button" data-node="${key}" aria-label="${escapeHTML(labels[key])}: ${matrix.nodes[key]}" aria-describedby="aqm-tooltip"><circle cx="${x}" cy="${y}" r="${key==='center'?22:18}"/><text x="${x}" y="${y+5}">${matrix.nodes[key]}</text><title>${escapeHTML(labels[key])}: ${matrix.nodes[key]}</title></g>`).join('');
    return `<svg class="aqm-svg" viewBox="0 0 320 320" role="group" aria-label="مصفوفة رمزية من ثمانية محاور"> <polygon class="aqm-octagon" points="${polygon}"/> <path class="aqm-star" d="M160 31L251 251L69 69L289 160L31 160L251 69L69 251L160 31M31 160L160 289L289 160M69 69L251 251M251 69L69 251"/>${line('north','south','aqm-axis')}${line('east','west','aqm-axis')}${line('northEast','southWest','aqm-diagonal')}${line('northWest','southEast','aqm-diagonal')}${nodes}</svg>`;
  }
  const BODY_SYMBOLISM={sahasrara:'الرأس',ajna:'الجبهة والعينان',vishuddha:'الحلق والصوت',anahata:'الصدر والتنفس',manipura:'أعلى البطن',svadhisthana:'الحوض',muladhara:'الساقان والقدمان'};
  const DEEP_LABELS={psychology:'المعنى النفسي',shadowTrap:'فخ الظل',bodySymbol:'أثر جسدي رمزي',practice:'ممارسة'};
  const ASPECTS={physics:'الجسد',energy:'الطاقة',emotions:'المشاعر'};
  function deepSkeleton(){const w=document.createElement('div');w.className='aqm-skel';w.setAttribute('role','status');w.setAttribute('aria-label','جاري تحميل التفسير');for(let i=0;i<3;i++){const l=document.createElement('span');l.className='aqm-skel-line';w.append(l);}return w;}
  function mountChakraDeep(box,row){
    const M=window.AqeeqMatrix;
    if(!box||!M||box.dataset.state==='loading'||box.dataset.state==='done')return;
    box.dataset.state='loading';box.replaceChildren(deepSkeleton());
    M.chakraReading(row.key,{physics:row.physics,energy:row.energy,emotions:row.emotions}).then(items=>{
      const nodes=[];
      items.forEach(item=>{
        if(item.empty)return;
        const sec=document.createElement('section');sec.className='aqm-deep-block';
        const h=document.createElement('h5');h.textContent=ASPECTS[item.aspect]+' · '+item.id+(item.name?' ('+item.name+')':'');sec.append(h);
        M.FIELDS.forEach(f=>{if(!item.fields[f])return;const p=document.createElement('p'),b=document.createElement('b');b.textContent=DEEP_LABELS[f]+': ';p.append(b,document.createTextNode(item.fields[f]));sec.append(p);});
        nodes.push(sec);
      });
      if(!nodes.length){const p=document.createElement('p');p.className='aqm-deep-pending';p.textContent='التفسير التفصيلي لهذه الشاكرة قيد الإعداد.';nodes.push(p);}
      box.replaceChildren(...nodes);box.dataset.state='done';
    }).catch(()=>{
      const p=document.createElement('p'),btn=document.createElement('button');
      p.className='aqm-deep-error';p.textContent='تعذّر تحميل التفسير. تأكد من الاتصال وجرّب تاني. ';
      btn.type='button';btn.className='aqm-deep-retry';btn.textContent='إعادة المحاولة';
      btn.addEventListener('click',()=>{box.dataset.state='';mountChakraDeep(box,row);});
      p.append(btn);box.replaceChildren(p);box.dataset.state='error';
    });
  }
  function renderAdvancedSections(chakras,generations,axes) {
    const rows=chakras.rows.map((row,index)=>'<tr><th scope="row"><button type="button" class="aqm-chakra-toggle" data-chakra-toggle="'+row.key+'" aria-expanded="false" aria-controls="aqm-chakra-detail-'+row.key+'"><span class="aqm-chakra-order">'+(index+1)+'</span><span>'+escapeHTML(row.name)+'<small>'+escapeHTML(row.sanskrit)+'</small></span><span aria-hidden="true">＋</span></button></th><td>'+row.physics+'</td><td>'+row.energy+'</td><td>'+row.emotions+'</td></tr><tr id="aqm-chakra-detail-'+row.key+'" class="aqm-chakra-detail" hidden><td colspan="4"><div class="aqm-chakra-copy"><p><b>المعنى الروحي والسلوكي · طاقة '+row.energy+' ('+escapeHTML(ARCANA[row.energy-1][0])+'):</b> '+escapeHTML(row.focus)+'. '+escapeHTML(ARCANA[row.energy-1][1])+'</p><p><b>ارتباط جسدي رمزي:</b> '+escapeHTML(row.area)+'. لا يمكن استنتاج عضو حساس أو مرض من تاريخ الميلاد أو من هذه الأرقام.</p><p><b>مفتاح التوازن:</b> '+escapeHTML(row.balance)+'</p><div class="aqm-chakra-deep" data-chakra-deep="'+row.key+'" aria-live="polite"></div></div></td></tr>').join('');
    const lineCard=(line,kind)=>'<article class="aqm-card aqm-lineage-card '+kind+'"><span class="aqm-kicker">'+escapeHTML(line.name)+'</span><div class="aqm-ancestral-numbers">'+line.points.map((n,i)=>'<span><b>'+n+'</b><small>'+(i===1?'المركز':'زاوية')+'</small></span>').join('<i aria-hidden="true">·</i>')+'</div><p>طاقة طرفَي الخط: <b>'+line.combined+'</b>. هذه مفاتيح رمزية للتأمل في تاريخ الأسرة؛ لا تثبت سلوكاً موروثاً ولا تحدد ما فعله الأسلاف.</p><p>سؤال للتأمل: أي قيمة عائلية أختار أن أستمر فيها، وأيها أريد التعامل معها بطريقة جديدة؟</p></article>';
    const pillars=[['البحث الذاتي · النية',axes.soulSearching,'محصلة خط السماء وخط الأرض.'],['الاندماج الاجتماعي',axes.socialization,'محصلة خط الذكور وخط الإناث في قراءة رمزية للتفاعل المجتمعي.'],['الامتحان الروحي · الطاقة الحاكمة',axes.spiritualExam,'محصلة المسار الشخصي والاجتماعي، لا امتحان حقيقي أو حكم على الإنسان.']];
    return '<section class="aqm-deep-section"><div class="aqm-section-heading"><span class="aqm-kicker">خريطة رمزية للتأمل</span><h3>بطاقة الشاكرات · Physics / Energy / Emotions</h3><p>الأرقام رموز ضمن طريقة المصفوفة، وليست قياسات للجسم أو الحالة النفسية.</p></div><div class="aqm-table-scroll"><table class="aqm-chakra-table"><thead><tr><th scope="col">الشاكرا · Chakra</th><th scope="col">الجسد<br><small>Physics</small></th><th scope="col">الطاقة<br><small>Energy</small></th><th scope="col">المشاعر<br><small>Emotions</small></th></tr></thead><tbody>'+rows+'<tr class="aqm-chakra-total"><th scope="row">الإجمالي · Common Energy-Zone</th><td>'+chakras.total.physics+'</td><td>'+chakras.total.energy+'</td><td>'+chakras.total.emotions+'</td></tr></tbody></table></div><p class="aqm-health-note">'+escapeHTML(chakras.method)+' الارتباطات الجسدية رمزية ولا تتنبأ بالتوتر أو المرض. أي أعراض صحية تُقيّم طبياً.</p></section><section class="aqm-deep-section"><div class="aqm-section-heading"><span class="aqm-kicker">الخطوط الجيلية</span><h3>البصمة الأسلافية</h3><p>ثلاثية كل خط تعرض زاويتيه ومركز المصفوفة المشترك.</p></div><div class="aqm-lineage-grid">'+lineCard(generations.male,'is-male')+lineCard(generations.female,'is-female')+'</div><p class="aqm-health-note">مركز مربع الأسلاف: '+generations.ancestralCenter+' · المركز العام: '+generations.commonCenter+'. لا تكشف هذه الحسابات وقائع عائلية أو جينات.</p></section><section class="aqm-deep-section"><div class="aqm-section-heading"><span class="aqm-kicker">مستويات الغاية</span><h3>محاور المصفوفة الثلاثة</h3></div><div class="aqm-pillars">'+pillars.map(([title,value,description])=>'<article class="aqm-card aqm-pillar"><span class="aqm-pillar-number">'+value+'</span><h4>'+escapeHTML(title)+'</h4><p>'+escapeHTML(description)+'</p></article>').join('')+'</div><div class="aqm-axis-notes"><span>السماء: '+axes.sky[0]+' + '+axes.sky[1]+' = '+axes.sky[2]+'</span><span>الأرض: '+axes.earth[0]+' + '+axes.earth[1]+' = '+axes.earth[2]+'</span><span>ذكور: '+axes.male+' · إناث: '+axes.female+'</span></div></section>';
  }
  function renderLifePathProfile(profile) {
    if (!profile) return '';
    const steps = profile.blueprint.map(step =>
      '<li><b>' + escapeHTML(step.challenge) + '</b><span>' + escapeHTML(step.solution) + '</span></li>'
    ).join('');
    return '<section class="aqm-life-path-profile" aria-label="التفسير التفصيلي لمسار الحياة">' +
      '<div class="aqm-life-path-heading"><span class="aqm-kicker">مسار ' + profile.number + ' · قراءة رمزية</span><h3>' + escapeHTML(profile.title) + '</h3></div>' +
      '<div class="aqm-life-path-columns">' +
        '<article class="aqm-life-path-copy"><h4>الجوهر والبرمجة الأولى</h4><p>' + escapeHTML(profile.core) + '</p></article>' +
        '<article class="aqm-life-path-copy is-light"><h4>مساحة النور</h4><p>' + escapeHTML(profile.light) + '</p></article>' +
        '<article class="aqm-life-path-copy is-shadow"><h4>مساحة الظل</h4><p>' + escapeHTML(profile.shadow) + '</p></article>' +
        '<article class="aqm-life-path-copy is-body"><h4>البصمة النفسية-الجسدية · وصف رمزي</h4><p>' + escapeHTML(profile.psychosomatic) + '</p><small>هذه صياغة رمزية للتأمل وليست تشخيصاً أو علاقة سببية طبية. الأعراض الصحية تُقيّم مع مختص.</small></article>' +
      '</div><div class="aqm-life-path-blueprint"><h4>بروتوكول التحول السلوكي</h4><ol>' + steps + '</ol></div></section>';
  }
  function render(host,dateValue) {
    const life=calculateLifePath(dateValue), matrix=calculateDestinyMatrix(dateValue), chakras=calculateChakraHealthCard(dateValue), generations=calculateGenerationalLines(dateValue), axes=calculateDestinyAxes(dateValue), n=life.number, traits=lifeTraits(n), num=matrix.nodes, profile=LIFE_PATH_DATA[n];
    host.innerHTML=`<section class="aqm-shell" dir="rtl" aria-label="مصفوفة القدر"><header class="aqm-header"><span class="aqm-kicker">قراءة رقمية رمزية · ${escapeHTML(dateValue)}</span><h2>مصفوفة القدر · الأركانا والمحاور</h2><p>أداة مستقلة للتأمل واستكشاف المعاني، وليست قياساً علمياً أو تنبؤاً.</p></header><div class="aqm-grid"><article class="aqm-card aqm-chart-card"><div class="aqm-card-head"><div><span class="aqm-kicker">الأركانا الكبرى · 1–22</span><h3>مصفوفة المحاور الثمانية</h3></div></div><div class="aqm-matrix-wrap">${renderSVG(matrix)}<div class="aqm-tooltip" id="aqm-tooltip" role="status" aria-live="polite">اختار نقطة لعرض معناها.</div></div><div class="aqm-lines"><p><b>خط الوفرة الرمزي:</b> ${num.northEast} ← ${num.center} ← ${num.southWest}</p><p><b>خط العلاقات الرمزي:</b> ${num.northWest} ← ${num.center} ← ${num.southEast}</p></div><p class="aqm-method">${escapeHTML(matrix.formula)} خطوط الوفرة والعلاقات هنا وصلات تركيبية بين النقاط المعروضة، وليست صيغة موحدة متفقاً عليها.</p></article><div class="aqm-interpretations"><article class="aqm-card"><span class="aqm-kicker">الجوهر والدروس</span><h3>النقطة المركزية</h3><div class="aqm-reading"><b>${num.center} · ${escapeHTML(ARCANA[num.center-1][0])}</b><p>${escapeHTML(ARCANA[num.center-1][1])}</p></div><div class="aqm-reading is-shadow"><b>مساحة التوازن</b><p>${escapeHTML(ARCANA[num.center-1][2])}</p></div></article></div></div><details class="aqm-details"><summary>تفاصيل النقاط ومعانيها</summary><div class="aqm-node-list">${Object.keys(labels).map(key=>`<article><b>${escapeHTML(labels[key])} · ${num[key]}</b><p>${escapeHTML(ARCANA[num[key]-1][1])}</p><small>جانب يستحق الانتباه: ${escapeHTML(ARCANA[num[key]-1][2])}</small></article>`).join('')}</div></details><footer class="aqm-disclaimer">الاختزال الرقمي وصيغ المصفوفة تختلف بين المدارس. هذه الحاسبة تعرض طريقة حساب معلنة وبسيطة لأغراض التأمل، لا حقيقة علمية عن القدر.</footer></section>`;
    host.querySelector('.aqm-details').insertAdjacentHTML('beforebegin',renderAdvancedSections(chakras,generations,axes));
    host.querySelectorAll('[data-chakra-toggle]').forEach(button=>button.addEventListener('click',()=>{const detail=host.querySelector('#'+button.getAttribute('aria-controls')),open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));detail.hidden=!open;button.querySelector('[aria-hidden=\"true\"]').textContent=open?'−':'＋';if(open)mountChakraDeep(detail.querySelector('[data-chakra-deep]'),chakras.rows.find(r=>r.key===button.dataset.chakraToggle));}));
    if(window.AqeeqMatrix)host.querySelectorAll('[data-chakra-toggle]').forEach(button=>{const hint=()=>{const r=chakras.rows.find(x=>x.key===button.dataset.chakraToggle);window.AqeeqMatrix.prefetch([r.physics,r.energy,r.emotions]);};button.addEventListener('pointerenter',hint,{once:true});button.addEventListener('focus',hint,{once:true});});
    const tip=host.querySelector('#aqm-tooltip');
    host.querySelectorAll('.aqm-node').forEach(node=>{
      const show=()=>{const key=node.dataset.node, value=num[key], [positive,shadow]=ARCANA[value-1].slice(1);tip.textContent=`${labels[key]} · ${value}: ${positive}. جانب للتأمل: ${shadow}.`;host.querySelectorAll('.aqm-node').forEach(n=>n.classList.toggle('is-active',n===node));};
      node.addEventListener('mouseenter',show);node.addEventListener('focus',show);node.addEventListener('click',show);node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show();}});
    });
  }
  function initMatrix() {
    const form=document.querySelector('#mform'),host=document.querySelector('#mresult'),dateInput=document.querySelector('#m-date'),genderInput=document.querySelector('#m-gender'),error=document.querySelector('#merr');
    if(!form||!host||!dateInput||!genderInput||form.dataset.aqmBound==='true')return;
    form.dataset.aqmBound='true';
    form.addEventListener('submit',event=>{
      event.preventDefault();
      error.hidden=true;
      if(!genderInput.value){error.textContent='اختار ذكر أو أنثى عشان نضبط صياغة التقرير.';error.hidden=false;genderInput.focus();return;}
      if(!dateInput.value){error.textContent='اكتب تاريخ الميلاد عشان نحسب مصفوفة القدر.';error.hidden=false;dateInput.focus();return;}
      try{render(host,dateInput.value);window.AqeeqGender?.apply(host,genderInput.value);window.AqeeqCopyMap?.attach(host,'مصفوفة القدر');host.hidden=false;host.scrollIntoView({behavior:'smooth',block:'start'});}
      catch(err){error.textContent='تعذر حساب المصفوفة. راجع التاريخ وحاول مرة تانية.';error.hidden=false;}
    });
  }
  const api={calculateLifePath,calculateDestinyMatrix,calculateChakraHealthCard,calculateGenerationalLines,calculateDestinyAxes,reduceArcana,reduceLifePath};
  window.AqeeqNumerology=api;
  window.addEventListener('DOMContentLoaded',initMatrix);initMatrix();
})();






/* Story Share Card: client-side 9:16 PNG generation */
(() => {
  'use strict';
  const W=1080,H=1920,ACCOUNT='@mohamed.ibrahim.astro';
  const query=(root,selector)=>root.querySelector(selector);
  function path(ctx,x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
  }
  function text(ctx,value,y,font,color,max=900){
    ctx.font=font;ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.direction='rtl';ctx.fillText(String(value),W/2,y,max);
  }
  function createCanvas(d){
    const c=document.createElement('canvas');c.width=W;c.height=H;
    const x=c.getContext('2d',{alpha:false}),g=x.createLinearGradient(0,0,W,H);
    g.addColorStop(0,'#080a10');g.addColorStop(.52,'#15131b');g.addColorStop(1,'#0b1019');x.fillStyle=g;x.fillRect(0,0,W,H);
    [[130,420,500,'rgba(192,57,43,.25)'],[980,1340,470,'rgba(212,175,55,.13)']].forEach(a=>{const q=x.createRadialGradient(a[0],a[1],0,a[0],a[1],a[2]);q.addColorStop(0,a[3]);q.addColorStop(1,'rgba(10,12,18,0)');x.fillStyle=q;x.fillRect(a[0]-a[2],a[1]-a[2],2*a[2],2*a[2]);});
    path(x,66,92,948,1736,44);x.fillStyle='rgba(16,19,29,.84)';x.fill();x.strokeStyle='rgba(226,204,143,.4)';x.lineWidth=2;x.stroke();
    x.strokeStyle='rgba(212,175,55,.15)';[300,385,470].forEach(r=>{x.beginPath();x.arc(540,590,r,0,Math.PI*2);x.stroke();});
    for(let i=0;i<36;i++){x.fillStyle=i%5?'rgba(237,231,218,.32)':'rgba(212,175,55,.65)';x.beginPath();x.arc(85+(i*193%910),145+(i*317%1480),i%5?2:3,0,Math.PI*2);x.fill();}
    text(x,'عقيق أسترو',210,'700 70px "Reem Kufi", "Noto Naskh Arabic", serif','#f2dfad');
    text(x,'AKEEK ASTRO  ·  خريطة رمزية للتأمل',278,'500 25px Arial,sans-serif','#b9a979');
    x.strokeStyle='rgba(212,175,55,.48)';x.beginPath();x.moveTo(245,335);x.lineTo(835,335);x.stroke();
    text(x,'تاريخ الميلاد  ·  '+d.date,394,'500 34px "Noto Naskh Arabic",serif','#d1d3db');
    path(x,180,490,720,355,38);const h=x.createLinearGradient(180,490,900,845);h.addColorStop(0,'rgba(212,175,55,.2)');h.addColorStop(1,'rgba(192,57,43,.2)');x.fillStyle=h;x.fill();x.strokeStyle='rgba(212,175,55,.64)';x.stroke();
    text(x,'مسار الحياة',558,'600 34px "Noto Naskh Arabic",serif','#d9c58f');text(x,d.life.number,680,'700 118px Arial,sans-serif','#f5df9a');
    text(x,d.traits,778,'600 29px "Noto Naskh Arabic",serif','#f3e8ce',690);
    text(x,'أركان القدر',965,'700 43px "Noto Naskh Arabic",serif','#f0dfb3');
    [['الجوهر',d.matrix.anchors.A],['طاقة الروح',d.matrix.anchors.B],['الكارما الأساسية',d.matrix.anchors.C]].forEach((v,i)=>{const a=170+i*370;path(x,a,1030,330,208,28);x.fillStyle='rgba(255,255,255,.045)';x.fill();x.strokeStyle='rgba(212,175,55,.25)';x.stroke();x.textAlign='center';x.direction='rtl';x.textBaseline='middle';x.font='500 27px "Noto Naskh Arabic",serif';x.fillStyle='#c9c4b8';x.fillText(v[0],a+165,1090,294);x.font='700 68px Arial,sans-serif';x.fillStyle='#f0d78e';x.fillText(String(v[1]),a+165,1170);});
    text(x,'محصلة الشاكرات',1374,'700 43px "Noto Naskh Arabic",serif','#f0dfb3');text(x,'Common Energy-Zone',1432,'500 24px Arial,sans-serif','#aeb6ca');
    [['الجسد',d.chakras.total.physics],['الطاقة',d.chakras.total.energy],['المشاعر',d.chakras.total.emotions]].forEach((v,i)=>{const a=270+i*270;x.beginPath();x.arc(a,1570,82,0,Math.PI*2);x.fillStyle='rgba(192,57,43,.16)';x.fill();x.strokeStyle='rgba(212,175,55,.46)';x.stroke();x.textAlign='center';x.direction='rtl';x.textBaseline='middle';x.font='700 48px Arial,sans-serif';x.fillStyle='#f3dda0';x.fillText(String(v[1]),a,1555);x.font='500 25px "Noto Naskh Arabic",serif';x.fillStyle='#d3d0c7';x.fillText(v[0],a,1610);});
    x.strokeStyle='rgba(212,175,55,.34)';x.beginPath();x.moveTo(220,1680);x.lineTo(860,1680);x.stroke();
    text(x,'اكتشف شفراتك أنت أيضاً',1712,'600 28px "Noto Naskh Arabic",serif','#eee1c1');
    text(x,'moibrahim0369-hash.github.io/aqeeq.astro',1764,'500 19px Arial,sans-serif','#d6bb71',860);
    text(x,ACCOUNT,1804,'500 20px Arial,sans-serif','#c6c9d1');
    return c;
  }
  function read(shell){
    const api=window.AqeeqNumerology,k=query(shell,'.aqm-header .aqm-kicker'),m=k&&k.textContent.match(/\d{4}-\d{2}-\d{2}/);
    if(!api||!m)throw new Error('Missing numerology results');
    const date=m[0],traits=query(shell,'.aqm-tags')?.innerText||'';
    return {date,life:api.calculateLifePath(date),matrix:api.calculateDestinyMatrix(date),chakras:api.calculateChakraHealthCard(date),traits:traits.replace(/\s+/g,' · ').trim()};
  }
  function modal(){
    let d=document.getElementById('aqs-story-dialog');if(d)return d;
    d=document.createElement('dialog');d.id='aqs-story-dialog';d.className='aqs-story-dialog';d.setAttribute('aria-labelledby','aqs-story-title');
    d.innerHTML='<div class="aqs-story-modal"><header><div><p class="aqs-story-kicker">بطاقة جاهزة للمشاركة</p><h2 id="aqs-story-title">قصتك في صورة</h2></div><button class="aqs-story-close" type="button" aria-label="إغلاق المعاينة">×</button></header><div class="aqs-story-preview"><div class="aqs-story-loading" role="status">جارٍ تجهيز البطاقة…</div><img alt="معاينة بطاقة قصة عقيق أسترو" hidden></div><p class="aqs-story-error" role="alert" hidden></p><footer><button class="aqs-story-download" type="button">تحميل الصورة</button><button class="aqs-story-share" type="button">مشاركة</button></footer><p class="aqs-story-private">الصورة تُنشأ على جهازك ولا يتم إرسال بيانات الميلاد إلى خادم.</p></div>';
    document.body.append(d);d.querySelector('.aqs-story-close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d)d.close();});return d;
  }
  function download(canvas,date){canvas.toBlob(b=>{if(!b)return;const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='aqeeq-astro-'+date+'.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);},'image/png');}
  function mount(shell){
    if(shell.dataset.aqsReady==='true'||!query(shell,'.aqm-hero'))return;shell.dataset.aqsReady='true';
    const b=document.createElement('button');b.className='aqs-story-open';b.type='button';b.innerHTML='<span aria-hidden="true">📸</span> استخراج بطاقة القصة <small>Story Card · 9:16</small>';
    query(shell,'.aqm-header')?.insertAdjacentElement('afterend',b);
    b.addEventListener('click',async()=>{
      const d=modal(),img=d.querySelector('img'),loading=d.querySelector('.aqs-story-loading'),err=d.querySelector('.aqs-story-error');err.hidden=true;img.hidden=true;loading.hidden=false;
      d.showModal?d.showModal():d.setAttribute('open','');
      try{
        const data=read(shell);await document.fonts?.ready;const canvas=createCanvas(data),url=canvas.toDataURL('image/png');
        const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('PNG encoding failed');
        const file=new File([blob],'aqeeq-astro-'+data.date+'.png',{type:'image/png'});img.src=url;img.hidden=false;loading.hidden=true;
        d.querySelector('.aqs-story-download').onclick=()=>download(canvas,data.date);
        d.querySelector('.aqs-story-share').onclick=async()=>{try{if(navigator.share&&navigator.canShare?.({files:[file]})){const p=navigator.share({files:[file],title:'بطاقة عقيق أسترو',text:'اكتشف شفراتك في عقيق أسترو'});await p;}else download(canvas,data.date);}catch(e){if(e.name!=='AbortError')download(canvas,data.date);}};
      }catch(e){loading.hidden=true;err.textContent='تعذر تجهيز البطاقة الآن. حدّث النتيجة وحاول مرة أخرى.';err.hidden=false;}
    });
  }
  const scan=()=>document.querySelectorAll('.aqm-shell').forEach(mount);
  new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});scan();
})();