(() => {
  'use strict';
  const SIGNS = ['الحمل','الثور','الجوزاء','السرطان','الأسد','العذراء','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'];
  const MASTER = new Set([11,22,33]);
  const ARCANA = [
    ['البداية والإرادة','مبادرة وابتكار','اندفاع أو تشتت'],['المعرفة والحدس','إنصات ووعي داخلي','كتمان أو تردد'],['النمو والرعاية','إبداع واحتواء','إفراط في السيطرة'],['النظام والمسؤولية','ثبات وتنظيم','جمود أو تشدد'],['التعلم والقيم','حكمة ومشاركة خبرة','وعظ أو تعلق بالقواعد'],['الاختيار والانسجام','تقارب ووضوح قيم','إرضاء الآخرين'],['الحركة والتقدم','شجاعة وتوجيه للطاقة','استعجال أو صراع'],['العدل والتوازن','إنصاف واتزان','قسوة في الحكم'],['التأمل والخبرة','صبر واستقلال','عزلة أو انغلاق'],['الدورات والفرص','مرونة واستعداد للتغيير','انتظار الحظ'],['القوة والاتزان','شجاعة هادئة وضبط للنفس','كبت أو إنهاك'],['تغيير المنظور','تأنٍ ورؤية مختلفة','تعليق القرار'],['التحول والتجدد','ترك ما انتهى','مقاومة التغيير'],['الاعتدال والمواءمة','توازن وتدرج','تأجيل الاحتياجات'],['الاختيار الواعي','ملاحظة التعلق واستعادة الحرية','تعلق أو إفراط'],['التحرر من البنى القديمة','كشف ما يحتاج إلى إصلاح','هدم بلا خطة'],['المراجعة وإعادة البناء','تعلم من التغيير','خوف من فقد السيطرة'],['الأمل والإلهام','ثقة هادئة ورؤية بعيدة','مثالية أو تشتت'],['الحدس والمشاعر','خيال وتعاطف مع التحقق','ضبابية أو إسقاط'],['الوضوح والحيوية','تعبير ودفء','استنزاف أو مبالغة'],['المراجعة والنداء الداخلي','تعلم من الماضي','لوم الذات'],['الاكتمال والاندماج','إغلاق مرحلة واتساع الأفق','تشتت قبل الإغلاق'],['البدايات المفتوحة','فضول وتجربة','مخاطرة دون تقدير']
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
  function renderAdvancedSections(chakras,generations,axes) {
    const rows=chakras.rows.map((row,index)=>'<tr><th scope="row"><button type="button" class="aqm-chakra-toggle" data-chakra-toggle="'+row.key+'" aria-expanded="false" aria-controls="aqm-chakra-detail-'+row.key+'"><span class="aqm-chakra-order">'+(index+1)+'</span><span>'+escapeHTML(row.name)+'<small>'+escapeHTML(row.sanskrit)+'</small></span><span aria-hidden="true">＋</span></button></th><td>'+row.physics+'</td><td>'+row.energy+'</td><td>'+row.emotions+'</td></tr><tr id="aqm-chakra-detail-'+row.key+'" class="aqm-chakra-detail" hidden><td colspan="4"><div class="aqm-chakra-copy"><p><b>المعنى الروحي والسلوكي · طاقة '+row.energy+' ('+escapeHTML(ARCANA[row.energy-1][0])+'):</b> '+escapeHTML(row.focus)+'. '+escapeHTML(ARCANA[row.energy-1][1])+'</p><p><b>ارتباط جسدي رمزي:</b> '+escapeHTML(row.area)+'. لا يمكن استنتاج عضو حساس أو مرض من تاريخ الميلاد أو من هذه الأرقام.</p><p><b>مفتاح التوازن:</b> '+escapeHTML(row.balance)+'</p></div></td></tr>').join('');
    const lineCard=(line,kind)=>'<article class="aqm-card aqm-lineage-card '+kind+'"><span class="aqm-kicker">'+escapeHTML(line.name)+'</span><div class="aqm-ancestral-numbers">'+line.points.map((n,i)=>'<span><b>'+n+'</b><small>'+(i===1?'المركز':'زاوية')+'</small></span>').join('<i aria-hidden="true">·</i>')+'</div><p>طاقة طرفَي الخط: <b>'+line.combined+'</b>. هذه مفاتيح رمزية للتأمل في تاريخ الأسرة؛ لا تثبت سلوكاً موروثاً ولا تحدد ما فعله الأسلاف.</p><p>سؤال للتأمل: أي قيمة عائلية أختار أن أستمر فيها، وأيها أريد التعامل معها بطريقة جديدة؟</p></article>';
    const pillars=[['البحث الذاتي · النية',axes.soulSearching,'محصلة خط السماء وخط الأرض.'],['الاندماج الاجتماعي',axes.socialization,'محصلة خط الذكور وخط الإناث في قراءة رمزية للتفاعل المجتمعي.'],['الامتحان الروحي · الطاقة الحاكمة',axes.spiritualExam,'محصلة المسار الشخصي والاجتماعي، لا امتحان حقيقي أو حكم على الإنسان.']];
    return '<section class="aqm-deep-section"><div class="aqm-section-heading"><span class="aqm-kicker">خريطة رمزية للتأمل</span><h3>بطاقة الشاكرات · Physics / Energy / Emotions</h3><p>الأرقام رموز ضمن طريقة المصفوفة، وليست قياسات للجسم أو الحالة النفسية.</p></div><div class="aqm-table-scroll"><table class="aqm-chakra-table"><thead><tr><th scope="col">الشاكرا · Chakra</th><th scope="col">الجسد<br><small>Physics</small></th><th scope="col">الطاقة<br><small>Energy</small></th><th scope="col">المشاعر<br><small>Emotions</small></th></tr></thead><tbody>'+rows+'<tr class="aqm-chakra-total"><th scope="row">الإجمالي · Common Energy-Zone</th><td>'+chakras.total.physics+'</td><td>'+chakras.total.energy+'</td><td>'+chakras.total.emotions+'</td></tr></tbody></table></div><p class="aqm-health-note">'+escapeHTML(chakras.method)+' الارتباطات الجسدية رمزية ولا تتنبأ بالتوتر أو المرض. أي أعراض صحية تُقيّم طبياً.</p></section><section class="aqm-deep-section"><div class="aqm-section-heading"><span class="aqm-kicker">الخطوط الجيلية</span><h3>البصمة الأسلافية</h3><p>ثلاثية كل خط تعرض زاويتيه ومركز المصفوفة المشترك.</p></div><div class="aqm-lineage-grid">'+lineCard(generations.male,'is-male')+lineCard(generations.female,'is-female')+'</div><p class="aqm-health-note">مركز مربع الأسلاف: '+generations.ancestralCenter+' · المركز العام: '+generations.commonCenter+'. لا تكشف هذه الحسابات وقائع عائلية أو جينات.</p></section><section class="aqm-deep-section"><div class="aqm-section-heading"><span class="aqm-kicker">مستويات الغاية</span><h3>محاور المصفوفة الثلاثة</h3></div><div class="aqm-pillars">'+pillars.map(([title,value,description])=>'<article class="aqm-card aqm-pillar"><span class="aqm-pillar-number">'+value+'</span><h4>'+escapeHTML(title)+'</h4><p>'+escapeHTML(description)+'</p></article>').join('')+'</div><div class="aqm-axis-notes"><span>السماء: '+axes.sky[0]+' + '+axes.sky[1]+' = '+axes.sky[2]+'</span><span>الأرض: '+axes.earth[0]+' + '+axes.earth[1]+' = '+axes.earth[2]+'</span><span>ذكور: '+axes.male+' · إناث: '+axes.female+'</span></div></section>';
  }
  function render(host,dateValue) {
    const life=calculateLifePath(dateValue), matrix=calculateDestinyMatrix(dateValue), chakras=calculateChakraHealthCard(dateValue), generations=calculateGenerationalLines(dateValue), axes=calculateDestinyAxes(dateValue), n=life.number, traits=lifeTraits(n), num=matrix.nodes;
    host.innerHTML=`<section class="aqm-shell" dir="rtl" aria-label="مسار الحياة ومصفوفة القدر"><header class="aqm-header"><span class="aqm-kicker">قراءة رقمية رمزية · ${escapeHTML(dateValue)}</span><h2>مسار الحياة ومصفوفة القدر</h2><p>أداة للتأمل واستكشاف المعاني، وليست قياساً علمياً أو تنبؤاً.</p></header><article class="aqm-hero"><div class="aqm-number">${n}</div><div><span class="aqm-kicker">رقم مسار الحياة</span><h3>طريقك يتشكل بخياراتك</h3><div class="aqm-tags">${traits.map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</div></div></article><div class="aqm-grid"><article class="aqm-card aqm-chart-card"><div class="aqm-card-head"><div><span class="aqm-kicker">الأركانا الكبرى · 1–22</span><h3>مصفوفة المحاور الثمانية</h3></div></div><div class="aqm-matrix-wrap">${renderSVG(matrix)}<div class="aqm-tooltip" id="aqm-tooltip" role="status" aria-live="polite">اختار نقطة لعرض معناها.</div></div><div class="aqm-lines"><p><b>خط الوفرة الرمزي:</b> ${num.northEast} ← ${num.center} ← ${num.southWest}</p><p><b>خط العلاقات الرمزي:</b> ${num.northWest} ← ${num.center} ← ${num.southEast}</p></div><p class="aqm-method">${escapeHTML(matrix.formula)} خطوط الوفرة والعلاقات هنا وصلات تركيبية بين النقاط المعروضة، وليست صيغة موحدة متفقاً عليها.</p></article><div class="aqm-interpretations"><article class="aqm-card"><span class="aqm-kicker">معنى الرقم ${n}</span><h3>مسار الحياة</h3><div class="aqm-reading"><b>مساحة القوة</b><p>${escapeHTML(traits.join('، '))}. جرّب تحويل هذه السمات إلى خطوات تختارها بوعي.</p></div><div class="aqm-reading is-shadow"><b>ما يستحق الملاحظة</b><p>قد يظهر ظل الرقم بصورة مبالغ فيها عند الضغط. راقب النمط دون اعتباره حكماً ثابتاً على شخصيتك.</p></div></article><article class="aqm-card"><span class="aqm-kicker">الجوهر والدروس</span><h3>النقطة المركزية</h3><div class="aqm-reading"><b>${num.center} · ${escapeHTML(ARCANA[num.center-1][0])}</b><p>${escapeHTML(ARCANA[num.center-1][1])}</p></div><div class="aqm-reading is-shadow"><b>مساحة التوازن</b><p>${escapeHTML(ARCANA[num.center-1][2])}</p></div></article></div></div><details class="aqm-details"><summary>تفاصيل النقاط ومعانيها</summary><div class="aqm-node-list">${Object.keys(labels).map(key=>`<article><b>${escapeHTML(labels[key])} · ${num[key]}</b><p>${escapeHTML(ARCANA[num[key]-1][1])}</p><small>جانب يستحق الانتباه: ${escapeHTML(ARCANA[num[key]-1][2])}</small></article>`).join('')}</div></details><footer class="aqm-disclaimer">الاختزال الرقمي وصيغ المصفوفة تختلف بين المدارس. هذه الحاسبة تعرض طريقة حساب معلنة وبسيطة لأغراض التأمل، لا حقيقة علمية عن القدر.</footer></section>`;
    host.querySelector('.aqm-details').insertAdjacentHTML('beforebegin',renderAdvancedSections(chakras,generations,axes));
    host.querySelectorAll('[data-chakra-toggle]').forEach(button=>button.addEventListener('click',()=>{const detail=host.querySelector('#'+button.getAttribute('aria-controls')),open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));detail.hidden=!open;button.querySelector('[aria-hidden=\"true\"]').textContent=open?'−':'＋';}));
    const tip=host.querySelector('#aqm-tooltip');
    host.querySelectorAll('.aqm-node').forEach(node=>{
      const show=()=>{const key=node.dataset.node, value=num[key], [positive,shadow]=ARCANA[value-1].slice(1);tip.textContent=`${labels[key]} · ${value}: ${positive}. جانب للتأمل: ${shadow}.`;host.querySelectorAll('.aqm-node').forEach(n=>n.classList.toggle('is-active',n===node));};
      node.addEventListener('mouseenter',show);node.addEventListener('focus',show);node.addEventListener('click',show);node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show();}});
    });
  }
  function initResult(root) {
    if (!root || root.dataset.aqmReady==='true') return;
    const date=document.querySelector('#f-date')?.value;
    if (!date || !root.children.length) return;
    root.dataset.aqmReady='true';
    const original=[...root.childNodes];
    root.replaceChildren();
    const tabs=document.createElement('div');tabs.className='aqm-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','أقسام النتيجة');
    const chartBtn=document.createElement('button'), matrixBtn=document.createElement('button');
    [[chartBtn,'chart','الخريطة والعبور'],[matrixBtn,'numbers','الأرقام ومصفوفة القدر']].forEach(([btn,id,label],i)=>{btn.type='button';btn.id=`aqm-tab-${id}`;btn.setAttribute('role','tab');btn.setAttribute('aria-selected',String(i===0));btn.setAttribute('aria-controls',`aqm-panel-${id}`);btn.tabIndex=i===0?0:-1;btn.textContent=label;tabs.append(btn);});
    const chartPanel=document.createElement('div'),matrixPanel=document.createElement('div');
    chartPanel.id='aqm-panel-chart';matrixPanel.id='aqm-panel-numbers';chartPanel.setAttribute('role','tabpanel');matrixPanel.setAttribute('role','tabpanel');matrixPanel.setAttribute('aria-labelledby','aqm-tab-numbers');chartPanel.setAttribute('aria-labelledby','aqm-tab-chart');chartPanel.className='aqm-tab-panel';matrixPanel.className='aqm-tab-panel';
    original.forEach(node=>chartPanel.append(node));root.append(tabs,chartPanel,matrixPanel);
    const activate=id=>{const isChart=id==='chart';chartPanel.hidden=!isChart;matrixPanel.hidden=isChart;chartBtn.setAttribute('aria-selected',String(isChart));matrixBtn.setAttribute('aria-selected',String(!isChart));chartBtn.tabIndex=isChart?0:-1;matrixBtn.tabIndex=isChart?-1:0;};
    chartBtn.addEventListener('click',()=>activate('chart'));matrixBtn.addEventListener('click',()=>activate('numbers'));
    tabs.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();(e.target===chartBtn?matrixBtn:chartBtn).click();(e.target===chartBtn?matrixBtn:chartBtn).focus();}});
    render(matrixPanel,date);
  }
  const api={calculateLifePath,calculateDestinyMatrix,calculateChakraHealthCard,calculateGenerationalLines,calculateDestinyAxes,reduceArcana,reduceLifePath};
  window.AqeeqNumerology=api;
  const mount=()=>{const root=document.querySelector('#result');if(root)initResult(root);};
  new MutationObserver(()=>{const root=document.querySelector('#result');if(root&&root.dataset.aqmReady==='true'&&!root.querySelector('.aqm-shell'))delete root.dataset.aqmReady;mount();}).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('DOMContentLoaded',mount);mount();
})();






/* Story Share Card: client-side 9:16 PNG generation */
(() => {
  'use strict';

  const SITE_URL = 'https://moibrahim0369-hash.github.io/aqeeq.astro/';
  const ACCOUNT = '@mohamed.ibrahim.astro';
  const W = 1080;
  const H = 1920;
  const $ = (root, selector) => root.querySelector(selector);

  function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
  }

  function centeredText(ctx, text, y, font, color, maxWidth = 900) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';
    ctx.fillText(String(text), W / 2, y, maxWidth);
  }

  function drawStory(data) {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d', { alpha: false });
    const background = ctx.createLinearGradient(0, 0, W, H);
    background.addColorStop(0, '#080a10');
    background.addColorStop(.52, '#15131b');
    background.addColorStop(1, '#0b1019');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, W, H);

    const glow = (x, y, radius, color) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(10,12,18,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(x-radius, y-radius, radius*2, radius*2);
    };
    glow(120, 410, 500, 'rgba(192,57,43,.24)');
    glow(1000, 1330, 470, 'rgba(212,175,55,.12)');

    // Delicate orbital rings and star points carry the site's night-sky identity.
    ctx.save();
    ctx.strokeStyle = 'rgba(212,175,55,.16)';
    ctx.lineWidth = 2;
    [300, 385, 470].forEach(radius => {
      ctx.beginPath(); ctx.arc(W/2, 590, radius, 0, Math.PI*2); ctx.stroke();
    });
    for (let i=0;i<34;i++) {
      const x = 72 + ((i*193 + 41) % 936);
      const y = 150 + ((i*317 + 89) % 1500);
      ctx.fillStyle = i%5===0 ? 'rgba(212,175,55,.62)' : 'rgba(237,231,218,.32)';
      ctx.beginPath(); ctx.arc(x,y,i%5===0?3:1.8,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();

    // Frosted-glass card.
    roundedRect(ctx, 66, 92, 948, 1736, 44);
    ctx.fillStyle = 'rgba(16,19,29,.78)'; ctx.fill();
    ctx.strokeStyle = 'rgba(226,204,143,.35)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.save(); roundedRect(ctx, 82, 108, 916, 1704, 34); ctx.clip();
    const sheen = ctx.createLinearGradient(90, 110, 900, 1650);
    sheen.addColorStop(0, 'rgba(255,255,255,.045)'); sheen.addColorStop(.5, 'rgba(255,255,255,.008)'); sheen.addColorStop(1, 'rgba(212,175,55,.025)');
    ctx.fillStyle=sheen;ctx.fillRect(82,108,916,1704);ctx.restore();

    centeredText(ctx, 'عقيق أسترو', 210, '700 70px "Reem Kufi", "Noto Naskh Arabic", serif', '#f2dfad');
    centeredText(ctx, 'AKEEK ASTRO  ·  خريطة رمزية للتأمل', 277, '500 25px Arial, sans-serif', '#b9a979');
    ctx.strokeStyle='rgba(212,175,55,.48)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(245,335);ctx.lineTo(835,335);ctx.stroke();
    centeredText(ctx, `تاريخ الميلاد  ·  ${data.date}`, 394, '500 34px "Noto Naskh Arabic", serif', '#d1d3db');

    // Life-path hero capsule.
    roundedRect(ctx, 180, 490, 720, 355, 38);
    const hero=ctx.createLinearGradient(180,490,900,845);hero.addColorStop(0,'rgba(212,175,55,.2)');hero.addColorStop(1,'rgba(192,57,43,.2)');
    ctx.fillStyle=hero;ctx.fill();ctx.strokeStyle='rgba(212,175,55,.64)';ctx.lineWidth=2;ctx.stroke();
    centeredText(ctx, 'مسار الحياة', 558, '600 34px "Noto Naskh Arabic", serif', '#d9c58f');
    centeredText(ctx, data.life.number, 680, '700 118px Arial, sans-serif', '#f5df9a');
    centeredText(ctx, data.traits.slice(0,3).join('  ·  '), 778, '600 29px "Noto Naskh Arabic", serif', '#f3e8ce', 690);

    centeredText(ctx, 'أركان القدر', 965, '700 43px "Noto Naskh Arabic", serif', '#f0dfb3');
    const anchors=[['الجوهر',data.matrix.anchors.A],['طاقة الروح',data.matrix.anchors.B],['الكارما الأساسية',data.matrix.anchors.C]];
    anchors.forEach(([label,value],i)=>{
      const x=170+i*370;
      roundedRect(ctx,x,1030,330,208,28);ctx.fillStyle='rgba(255,255,255,.045)';ctx.fill();ctx.strokeStyle='rgba(212,175,55,.25)';ctx.lineWidth=2;ctx.stroke();
      ctx.textAlign='center';ctx.direction='rtl';ctx.textBaseline='middle';ctx.font='500 27px "Noto Naskh Arabic", serif';ctx.fillStyle='#c9c4b8';ctx.fillText(label,x+165,1090,294);
      ctx.font='700 68px Arial, sans-serif';ctx.fillStyle='#f0d78e';ctx.fillText(String(value),x+165,1170);
    });

    centeredText(ctx, 'محصلة الشاكرات', 1374, '700 43px "Noto Naskh Arabic", serif', '#f0dfb3');
    centeredText(ctx, 'Common Energy-Zone', 1432, '500 24px Arial, sans-serif', '#aeb6ca');
    const totals=[['الجسد',data.chakras.total.physics],['الطاقة',data.chakras.total.energy],['المشاعر',data.chakras.total.emotions]];
    totals.forEach(([label,value],i)=>{
      const x=270+i*270;
      ctx.beginPath();ctx.arc(x,1570,82,0,Math.PI*2);ctx.fillStyle='rgba(192,57,43,.16)';ctx.fill();ctx.strokeStyle='rgba(212,175,55,.46)';ctx.lineWidth=2;ctx.stroke();
      ctx.textAlign='center';ctx.direction='rtl';ctx.textBaseline='middle';ctx.font='700 48px Arial,sans-serif';ctx.fillStyle='#f3dda0';ctx.fillText(String(value),x,1555);
      ctx.font='500 25px "Noto Naskh Arabic",serif';ctx.fillStyle='#d3d0c7';ctx.fillText(label,x,1610);
    });

    ctx.strokeStyle='rgba(212,175,55,.34)';ctx.beginPath();ctx.moveTo(220,1708);ctx.lineTo(860,1708);ctx.stroke();
    centeredText(ctx, 'اكتشف شفراتك أنت أيضاً', 1760, '600 28px "Noto Naskh Arabic", serif', '#eee1c1');
    centeredText(ctx, 'moibrahim0369-hash.github.io/aqeeq.astro', 1807, '500 19px Arial, sans-serif', '#d6bb71', 860);
    return canvas;
  }

  function readResult(shell) {
    const api=window.AqeeqNumerology;
    const match=$ (shell,'.aqm-header .aqm-kicker')?.textContent.match(/\d{4}-\d{2}-\d{2}/);
    if(!api||!match) throw new Error('لا تتوفر بيانات المصفوفة لهذا التاريخ.');
    const date=match[0];
    return {date,life:api.calculateLifePath(date),matrix:api.calculateDestinyMatrix(date),chakras:api.calculateChakraHealthCard(date),traits:(()=>{
      const txt=$ (shell,'.aqm-tags')?.innerText||'';return txt.split(/\s+/).filter(Boolean);
    })()};
  }

  function ensureModal() {
    let dialog=document.getElementById('aqs-story-dialog');
    if(dialog) return dialog;
    dialog=document.createElement('dialog');dialog.id='aqs-story-dialog';dialog.className='aqs-story-dialog';dialog.setAttribute('aria-labelledby','aqs-story-title');
    dialog.innerHTML='<div class="aqs-story-modal"><header><div><p class="aqs-story-kicker">بطاقة جاهزة للمشاركة</p><h2 id="aqs-story-title">قصتك في صورة</h2></div><button class="aqs-story-close" type="button" aria-label="إغلاق المعاينة">×</button></header><div class="aqs-story-preview"><div class="aqs-story-loading" role="status">جارٍ تجهيز البطاقة…</div><img alt="معاينة بطاقة قصة عقيق أسترو" hidden></div><p class="aqs-story-error" role="alert" hidden></p><footer><button class="aqs-story-download" type="button">تحميل الصورة</button><button class="aqs-story-share" type="button">مشاركة</button></footer><p class="aqs-story-private">الصورة تُنشأ على جهازك ولا يتم إرسال بيانات الميلاد إلى خادم.</p></div>';
    document.body.append(dialog);
    dialog.querySelector('.aqs-story-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
    return dialog;
  }

  function savePNG(canvas,date) {
    canvas.toBlob(blob=>{
      if(!blob) return;
      const url=URL.createObjectURL(blob),anchor=document.createElement('a');
      anchor.href=url;anchor.download=`aqeeq-astro-${date}.png`;document.body.append(anchor);anchor.click();anchor.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1500);
    },'image/png');
  }

  function addButton(shell) {
    if(shell.dataset.aqsReady==='true'||!$ (shell,'.aqm-hero')) return;
    shell.dataset.aqsReady='true';
    const button=document.createElement('button');button.className='aqs-story-open';button.type='button';
    button.innerHTML='<span aria-hidden="true">📸</span> استخراج بطاقة القصة <small>Story Card · 9:16</small>';
    const header=$ (shell,'.aqm-header');header?.insertAdjacentElement('afterend',button);
    button.addEventListener('click',async()=>{
      const dialog=ensureModal(),preview=dialog.querySelector('img'),loading=dialog.querySelector('.aqs-story-loading'),error=dialog.querySelector('.aqs-story-error');
      error.hidden=true;preview.hidden=true;loading.hidden=false;
      const open=dialog.showModal?()=>dialog.showModal():()=>dialog.setAttribute('open','');open();
      try{
        await document.fonts?.ready;
        const data=readResult(shell),canvas=drawStory(data),image=canvas.toDataURL('image/png');
        preview.src=image;preview.hidden=false;loading.hidden=true;
        dialog.querySelector('.aqs-story-download').onclick=()=>savePNG(canvas,data.date);
        dialog.querySelector('.aqs-story-share').onclick=async()=>{
          try{
            const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
            const file=new File([blob],`aqeeq-astro-${data.date}.png`,{type:'image/png'});
            if(navigator.share&&navigator.canShare?.({files:[file]})) await navigator.share({files:[file],title:'بطاقة عقيق أسترو',text:'اكتشف شفراتك في عقيق أسترو'});
            else savePNG(canvas,data.date);
          }catch(cause){if(cause?.name!=='AbortError')savePNG(canvas,data.date);}
        };
      }catch(cause){loading.hidden=true;error.textContent='تعذر تجهيز البطاقة الآن. حدّث النتيجة وحاول مرة أخرى.';error.hidden=false;}
    });
  }

  const observe=()=>document.querySelectorAll('.aqm-shell').forEach(addButton);
  new MutationObserver(observe).observe(document.documentElement,{childList:true,subtree:true});
  observe();
})();

