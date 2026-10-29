(() => {
  'use strict';
  const SIGNS = ['الحمل','الثور','الجوزاء','السرطان','الأسد','العذراء','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'];
  const MASTER = new Set([11,22,33]);
  const LIFE_PATH_DATA = window.AqeeqLifePathData || {};
  const DESTINY_DATA = window.AqeeqDestinyMatrixData || {};
  const AGE_MAP_API = window.AqeeqAgeMap || {};

  const ARCANA = [
    ['البداية والإرادة','مبادرة وابتكار','اندفاع أو تشتت'],
    ['المعرفة والحدس','إنصات ووعي داخلي','كتمان أو تردد'],
    ['النمو والرعاية','إبداع واحتواء','إفراط في السيطرة'],
    ['النظام والمسؤولية','ثبات وتنظيم','جمود أو تشدد'],
    ['التعلم والقيم','حكمة ومشاركة خبرة','وعظ أو تعلق بالقواعد'],
    ['الاختيار والانسجام','تقارب ووضوح قيم','إرضاء الآخرين'],
    ['الحركة والتقدم','شجاعة وتوجيه للطاقة','استعجال أو صراع'],
    ['العدل والتوازن','إنصاف واتزان','قسوة في الحكم'],
    ['التأمل والخبرة','صبر واستقلال','عزلة أو انغلاق'],
    ['الدورات والفرص','مرونة واستعداد للتغيير','انتظار الحظ'],
    ['القوة والاتزان','شجاعة هادئة وضبط للنفس','كبت أو إنهاك'],
    ['تغيير المنظور','تأنٍ ورؤية مختلفة','تعليق القرار'],
    ['التحول والتجدد','ترك ما انتهى','مقاومة التغيير'],
    ['الاعتدال والمواءمة','توازن وتدرج','تأجيل الاحتياجات'],
    ['الاختيار الواعي','ملاحظة التعلق واستعادة الحرية','تعلق أو إفراط'],
    ['التحرر من البنى القديمة','كشف ما يحتاج إلى إصلاح','هدم بلا خطة'],
    ['المراجعة وإعادة البناء','تعلم من التغيير','خوف من فقد السيطرة'],
    ['الأمل والإلهام','ثقة هادئة ورؤية بعيدة','مثالية أو تشتت'],
    ['الحدس والمشاعر','خيال وتعاطف مع التحقق','ضبابية أو إسقاط'],
    ['الوضوح والحيوية','تعبير ودفء','استنزاف أو مبالغة'],
    ['المراجعة والنداء الداخلي','تعلم من الماضي','لوم الذات'],
    ['الاكتمال والاندماج','إغلاق مرحلة واتساع الأفق','تشتت قبل الإغلاق'],
    ['البدايات المفتوحة','فضول وتجربة','مخاطرة دون تقدير']
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

    // حساب ثلاثية الذيل الكارمي السفلية
    const karmicBase = D;
    const karmicMid = reduceArcana(D + E);
    const karmicInner = reduceArcana(D + karmicMid);
    const karmicTail = {
      base: karmicBase,
      mid: karmicMid,
      inner: karmicInner,
      triplet: [karmicBase, karmicMid, karmicInner],
      code: `${karmicBase}-${karmicMid}-${karmicInner}`
    };

    // حساب قنوات المال والعلاقات
    const moneyEntry = reduceArcana(E + C);
    const loveEntry = reduceArcana(E + karmicInner);
    const balancePoint = reduceArcana(moneyEntry + loveEntry);

    const channels = {
      money: moneyEntry,
      love: loveEntry,
      balance: balancePoint
    };

    const nodes={north:A,east:B,south:C,west:D,northEast:F,southEast:G,southWest:H,northWest:I,center:E};
    return {
      nodes,
      anchors:{A,B,C,D,E},
      generationalCorners:{F,G,H,I},
      ancestralCenter,
      commonCenter,
      karmicTail,
      channels,
      lines:{money:['northEast','center','southWest'],love:['northWest','center','southEast']},
      formula:'A=اليوم، B=الشهر، C=مجموع أرقام السنة؛ D=R(A+B+C)، E=R(A+B+C+D). زوايا مربع الأسلاف F=R(A+B)، G=R(B+C)، H=R(C+D)، I=R(D+A). كل R تختزل بجمع الأرقام عند تجاوز 22.'
    };
  }

  function calculateChakraHealthCard(birthDate) {
    const {A,B,C,D,E}=calculateDestinyMatrix(birthDate).anchors, R=reduceArcana;
    const throatPhysics=R(A+E), throatEnergy=R(B+E);
    const rows=[
      {key:'sahasrara',name:'التاج',sanskrit:'Sahasrara',physics:A,energy:B,focus:'المعنى والرسالة التي يختارها الإنسان لنفسه',area:'الرأس والأعصاب العليا',balance:'الراحة والتأمل الهادئ وربط الفكرة بخطوة واقعية.'},
      {key:'ajna',name:'العين الثالثة',sanskrit:'Ajna',physics:R(A+throatPhysics),energy:R(B+throatEnergy),focus:'الرؤية الفكرية والحدس مع التحقق من الافتراضات',area:'الجبهة والعينان',balance:'كتابة ما تعرفه وما تفترضه ثم التحقق من معلومة.'},
      {key:'vishuddha',name:'الحنجرة',sanskrit:'Vishuddha',physics:throatPhysics,energy:throatEnergy,focus:'التعبير والإبداع والإنصات المتبادل',area:'الحلق والصوت والرقبة',balance:'صياغة الاحتياج بوضوح والاستماع دون استعجال الرد.'},
      {key:'anahata',name:'القلب',sanskrit:'Anahata',physics:R(throatPhysics+E),energy:R(throatEnergy+E),focus:'العلاقات والحدود وصورة العالم',area:'الصدر والتنفس والقلب',balance:'موازنة التعاطف مع حدود واضحة وطلب الدعم عند الحاجة.'},
      {key:'manipura',name:'الضفيرة الشمسية',sanskrit:'Manipura',physics:E,energy:E,focus:'الاختيار والمسؤولية والموارد',area:'أعلى البطن والمعدة',balance:'تقسيم المهمة إلى خطوة يمكن التحكم بها اليوم.'},
      {key:'svadhisthana',name:'العجز',sanskrit:'Svadhisthana',physics:R(C+E),energy:R(D+E),focus:'الشغف والمتعة والإبداع والحميمية',area:'الحوض والأعضاء التناسلية',balance:'إتاحة نشاط ممتع وآمن دون تحويله إلى واجب.'},
      {key:'muladhara',name:'الجذر',sanskrit:'Muladhara',physics:C,energy:D,focus:'الأمان العملي والروتين والدعم والأرض',area:'الساقان والقدمان والعظام',balance:'اختيار ترتيب عملي صغير يمنح اليوم وضوحاً واستقراراً.'}
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

  const escapeHTML = s => String(s == null ? '' : s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  
  const labels={
    north:'الجوهر · يوم الميلاد',
    northEast:'موهبة مركبة · المال',
    east:'الاتصال الروحي · شهر الميلاد',
    southEast:'خط العلاقات',
    south:'الدروس · سنة الميلاد',
    southWest:'مسار الوفرة',
    west:'تكامل المحاور · الكارما',
    northWest:'مساحة العاطفة',
    center:'المحور المركزي · راحة الروح'
  };

  function renderSVG(matrix) {
    const coords={north:[160,31],northEast:[251,69],east:[289,160],southEast:[251,251],south:[160,289],southWest:[69,251],west:[31,160],northWest:[69,69],center:[160,160]};
    const ring=['north','northEast','east','southEast','south','southWest','west','northWest'];
    const point=k=>coords[k].join(',');
    const line=(a,b,cls)=>`<line class="aqm-line ${cls}" x1="${coords[a][0]}" y1="${coords[a][1]}" x2="${coords[b][0]}" y2="${coords[b][1]}"/>`;
    const polygon=ring.map(point).join(' ');
    const nodes=Object.entries(coords).map(([key,[x,y]])=>`<g class="aqm-node ${key==='center'?'is-center':''}" tabindex="0" role="button" data-node="${key}" aria-label="${escapeHTML(labels[key])}: ${matrix.nodes[key]}" aria-describedby="aqm-tooltip"><circle cx="${x}" cy="${y}" r="${key==='center'?22:18}"/><text x="${x}" y="${y+5}">${matrix.nodes[key]}</text><title>${escapeHTML(labels[key])}: ${matrix.nodes[key]}</title></g>`).join('');
    return `<svg class="aqm-svg" viewBox="0 0 320 320" role="group" aria-label="مصفوفة رمزية من ثمانية محاور"> <polygon class="aqm-octagon" points="${polygon}"/> <path class="aqm-star" d="M160 31L251 251L69 69L289 160L31 160L251 69L69 251L160 31M31 160L160 289L289 160M69 69L251 251M251 69L69 251"/>${line('north','south','aqm-axis')}${line('east','west','aqm-axis')}${line('northEast','southWest','aqm-diagonal')}${line('northWest','southEast','aqm-diagonal')}${nodes}</svg>`;
  }

  function renderLifePathProfile(profile) {
    if (!profile) return '';
    const steps = (profile.blueprint || []).map(step =>
      '<li><b>' + escapeHTML(step.challenge) + '</b><span>' + escapeHTML(step.solution) + '</span></li>'
    ).join('');
    const cheatSheet = Array.isArray(profile.cheatSheet) && profile.cheatSheet.length ? (
      '<div class="aqm-cheat-sheet">' +
        '<h4>ملخص المقارنة البصرية السريعة (Cheat Sheet)</h4>' +
        '<div class="aqm-table-scroll"><table class="aqm-cheat-table">' +
          '<thead><tr><th>المجال</th><th>التعبير المتوازن (النور)</th><th>النمط الذي يحتاج مراجعة (الظل)</th></tr></thead>' +
          '<tbody>' + profile.cheatSheet.map(row => '<tr><td><b>' + escapeHTML(row.area) + '</b></td><td>' + escapeHTML(row.balanced) + '</td><td>' + escapeHTML(row.shadow) + '</td></tr>').join('') + '</tbody>' +
        '</table></div>' +
      '</div>'
    ) : '';
    return '<section class="aqm-life-path-profile" aria-label="التفسير التفصيلي لمسار الحياة">' +
      '<div class="aqm-life-path-heading"><span class="aqm-kicker">مسار ' + profile.number + ' · قراءة رمزية</span><h3>' + escapeHTML(profile.title) + '</h3></div>' +
      cheatSheet +
      '<div class="aqm-life-path-columns">' +
        '<article class="aqm-life-path-copy"><h4>الجوهر والبرمجة الأولى</h4><p>' + escapeHTML(profile.core) + '</p></article>' +
        '<article class="aqm-life-path-copy is-light"><h4>مساحة النور</h4><p>' + escapeHTML(profile.light) + '</p></article>' +
        '<article class="aqm-life-path-copy is-shadow"><h4>مساحة الظل</h4><p>' + escapeHTML(profile.shadow) + '</p></article>' +
        '<article class="aqm-life-path-copy is-body"><h4>البصمة النفسية-الجسدية · وصف رمزي</h4><p>' + escapeHTML(profile.psychosomatic) + '</p><small>هذه صياغة رمزية للتأمل وليست تشخيصاً أو علاقة سببية طبية. الأعراض الصحية تُقيّم مع مختص.</small></article>' +
      '</div><div class="aqm-life-path-blueprint"><h4>بروتوكول التحول السلوكي</h4><ol>' + steps + '</ol></div></section>';
  }

  /**
   * بناء الأقسام الـ 14 الشاملة لمصفوفة القدر وفق معمارية matrix-destiny.com وهيكل عقيق أسترو
   */
  function render14DestinySections(matrix, dateValue, chakras, generations, axes) {
    const { A, B, C, D, E } = matrix.anchors;
    const getArc = DESTINY_DATA.getArcana || (n => ({ title: `أركانا ${n}`, archetype: '', light: '', shadow: '', psychosomatics: '', cheatSheet: [], positions: {}, transformationProtocol: [] }));
    const getTail = DESTINY_DATA.getKarmicTail || ((c1, c2, c3) => ({ code: `${c1}-${c2}-${c3}`, title: `الذيل الكارمي (${c1}-${c2}-${c3})`, paradox: '', childhoodRoots: '', tracks: {}, psychosomatics: '', transformationProtocol: [], closingConfrontation: '' }));

    const arcDay = getArc(A);
    const arcMonth = getArc(B);
    const arcYear = getArc(C);
    const arcCenter = getArc(E);
    const tailData = getTail(matrix.karmicTail.base, matrix.karmicTail.mid, matrix.karmicTail.inner);

    // حساب خريطة سنوات العمر
    const ageMap = AGE_MAP_API.calculateAgeMap ? AGE_MAP_API.calculateAgeMap(matrix.anchors, matrix.generationalCorners) : {};
    const ageInfo = AGE_MAP_API.getCurrentAgeEnergy ? AGE_MAP_API.getCurrentAgeEnergy(dateValue) : { exactAge: 0, normalizedAge: 0, milestone: 0, quadrant: '' };
    const currentYearEnergy = ageMap[ageInfo.milestone] || arcDay.number;
    const ageTheme = AGE_MAP_API.getAgeInterpretation ? AGE_MAP_API.getAgeInterpretation(currentYearEnergy) : { title: '', theme: '' };

    // Cheat Sheet للأركانا المركزية
    const centerCheatRows = Array.isArray(arcCenter.cheatSheet) && arcCenter.cheatSheet.length ? (
      '<div class="aqm-cheat-sheet"><h4>المقارنة البصرية السريعة لجوهر مصفوفتك (طاقة ' + E + ')</h4><div class="aqm-table-scroll"><table class="aqm-cheat-table"><thead><tr><th>المجال</th><th>النور (+)</th><th>الظل (-)</th></tr></thead><tbody>' +
      arcCenter.cheatSheet.map(r => '<tr><td><b>' + escapeHTML(r.area) + '</b></td><td>' + escapeHTML(r.balanced) + '</td><td>' + escapeHTML(r.shadow) + '</td></tr>').join('') +
      '</tbody></table></div></div>'
    ) : '';

    // صفوف جدول الشاكرات
    const chakraRows = chakras.rows.map((row, index) =>
      '<tr><th scope="row"><button type="button" class="aqm-chakra-toggle" data-chakra-toggle="' + row.key + '" aria-expanded="false" aria-controls="aqm-chakra-detail-' + row.key + '"><span class="aqm-chakra-order">' + (index + 1) + '</span><span>' + escapeHTML(row.name) + '<small>' + escapeHTML(row.sanskrit) + '</small></span><span aria-hidden="true">＋</span></button></th><td>' + row.physics + '</td><td>' + row.energy + '</td><td>' + row.emotions + '</td></tr><tr id="aqm-chakra-detail-' + row.key + '" class="aqm-chakra-detail" hidden><td colspan="4"><div class="aqm-chakra-copy"><p><b>المعنى الروحي والسلوكي · طاقة ' + row.energy + ' (' + escapeHTML(ARCANA[row.energy - 1]?.[0] || '') + '):</b> ' + escapeHTML(row.focus) + '. ' + escapeHTML(ARCANA[row.energy - 1]?.[1] || '') + '</p><p><b>ارتباط جسدي رمزي:</b> ' + escapeHTML(row.area) + '. صياغة رمزية للتأمل وليست تشخيصاً طبياً.</p><p><b>مفتاح التوازن:</b> ' + escapeHTML(row.balance) + '</p></div></td></tr>'
    ).join('');

    // كروت خطوط الأجداد
    const lineageCard = (line, kind) =>
      '<article class="aqm-card aqm-lineage-card ' + kind + '"><span class="aqm-kicker">' + escapeHTML(line.name) + '</span><div class="aqm-ancestral-numbers">' +
      line.points.map((n, i) => '<span><b>' + n + '</b><small>' + (i === 1 ? 'المركز' : 'زاوية') + '</small></span>').join('<i aria-hidden="true">·</i>') +
      '</div><p>طاقة طرفَي الخط: <b>' + line.combined + '</b>. مفتاح رمزي لتأمل الأنماط الأسرية الموروثة وكسر قيودها بوعي.</p></article>';

    return `
      <!-- شريط التنقل السريع بين الأقسام الـ 14 -->
      <!-- شريط التبويبات الرئيسي للمجموعات الثلاث -->
      <div class="aqm-cat-bar" role="tablist" aria-label="مجموعات مصفوفة القدر">
        <button type="button" class="aqm-cat-tab is-active" data-cat="all" role="tab" aria-selected="true">
          <span class="aqm-cat-icon">📑</span>
          <span class="aqm-cat-text">عرض كل الأقسام <small>14 قسماً بالكامل</small></span>
        </button>
        <button type="button" class="aqm-cat-tab" data-cat="identity" role="tab" aria-selected="false">
          <span class="aqm-cat-icon">✨</span>
          <span class="aqm-cat-text">1. الهوية والروح <small>الشخصية، العمر، المواهب، الكارما، السيناريو</small></span>
        </button>
        <button type="button" class="aqm-cat-tab" data-cat="earth" role="tab" aria-selected="false">
          <span class="aqm-cat-icon">🌍</span>
          <span class="aqm-cat-text">2. مسارات الأرض <small>الرسالة، المال، البرامج، الشريك، الكيمياء</small></span>
        </button>
        <button type="button" class="aqm-cat-tab" data-cat="roots" role="tab" aria-selected="false">
          <span class="aqm-cat-icon">🌱</span>
          <span class="aqm-cat-text">3. الجذور والجسد <small>الأسلاف، الأبناء، البراند، الشاكرات</small></span>
        </button>
      </div>

      <!-- أزرار التنقل السريع بين الأقسام الـ 14 -->
      <nav class="aqm-section-nav" aria-label="أقسام مصفوفة القدر الـ 14">
        <button type="button" class="aqm-nav-pill is-active" data-filter="all" data-cat="all">عرض الكل</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-personal" data-cat="identity">1. الشخصية والجوهر</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-age" data-cat="identity">2. طاقة العمر</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-talents" data-cat="identity">3. المواهب</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-karmic" data-cat="identity">4. الذيل الكارمي</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-scenario" data-cat="identity">5. سيناريو الحياة</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-destiny" data-cat="earth">6. القدر والرسالة</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-money" data-cat="earth">7. المال والمهنة</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-programs" data-cat="earth">8. البرامج الكارمية</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-relationship" data-cat="earth">9. شريك الحياة</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-sexiness" data-cat="earth">10. الكيمياء الحميمية</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-parents" data-cat="roots">11. الأسلاف والوالدين</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-kids" data-cat="roots">12. الأبناء</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-brand" data-cat="roots">13. البراند الشخصي</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-health" data-cat="roots">14. الشاكرات والصحة</button>
      </nav>

      <div class="aqm-matrix-sections">
        <!-- المجموعة الأولى: الهوية والروح (أقسام 1 إلى 5) -->
        <div class="aqm-group-container" data-cat="identity">
          <div class="aqm-group-header">
            <h4><span>✨ المجموعة الأولى: الهوية والروح</span> <small>Identity & Spirit</small></h4>
            <p>بصمة الشخصية، دورات طاقة العمر، المواهب الفطرية الكامنة، الذيل الكارمي ودروس الروح، وسيناريو التطور.</p>
          </div>
          <section id="sec-personal" class="aqm-destiny-section" tabindex="-1">
          <span class="aqm-kicker">القسم 01 · Personal Qualities</span>
          <h3>الشخصية والجوهر (القناع الاجتماعي ونواة الروح) <span class="aqm-destiny-badge">الرقم ${A} و ${E}</span></h3>
          <p>تقوم مصفوفة القدر على التمييز بين <b>القناع الخارجي</b> (طاقة يوم الميلاد ${A}) الذي يراك به الناس في اللقاء الأول، وبين <b>نواة الروح وراحة القلب</b> (طاقة المركز ${E}) حيث يسكن سلامك الداخلي الحقيقي.</p>
          ${centerCheatRows}
          <div class="aqm-pos-grid">
            <article class="aqm-pos-item is-highlight">
              <h5><span>طاقة الانطباع الاجتماعي · رقم ${A}</span><small>يوم الميلاد</small></h5>
              <p><b>${escapeHTML(arcDay.title)}:</b> ${escapeHTML(arcDay.positions?.personality || arcDay.archetype)}</p>
            </article>
            <article class="aqm-pos-item is-highlight">
              <h5><span>طاقة راحة الروح والمركز · رقم ${E}</span><small>نواة المصفوفة</small></h5>
              <p><b>${escapeHTML(arcCenter.title)}:</b> ${escapeHTML(arcCenter.positions?.center || arcCenter.archetype)}</p>
            </article>
          </div>
          <div class="aqm-life-path-columns" style="margin-top: .85rem;">
            <div class="aqm-life-path-copy is-light"><h4>تجلي النواة في النور (+)</h4><p>${escapeHTML(arcCenter.light)}</p></div>
            <div class="aqm-life-path-copy is-shadow"><h4>فخ النواة في الظل (-)</h4><p>${escapeHTML(arcCenter.shadow)}</p></div>
          </div>
        </section>

        <!-- 2. طاقة العمر وخريطة دورات القدر -->
        <section id="sec-age" class="aqm-destiny-section" tabindex="-1">
          <span class="aqm-kicker">القسم 02 · Year's Forecast & Age Map</span>
          <h3>طاقة عمرك الحالي وخريطة دورات القدر <span class="aqm-destiny-badge">عمرك: ${ageInfo.exactAge} سنة</span></h3>
          <div class="aqm-age-badge-group">
            <span class="aqm-age-pill">العمر الحالي: <b>${ageInfo.exactAge} سنة</b></span>
            <span class="aqm-age-pill">الطاقة الحاكمة للمرحلة: <b>أركانا ${currentYearEnergy}</b></span>
            <span class="aqm-age-pill">${escapeHTML(ageInfo.quadrant)}</span>
          </div>
          <article class="aqm-card" style="margin: .8rem 0; padding: .95rem; border-color: rgba(212,175,55,.3);">
            <h4 style="margin:0 0 .4rem; color:#f0dfb3;">${escapeHTML(ageTheme.title)}</h4>
            <p style="margin:0; color:#cfd3dd; font-size:.88rem; line-height:1.8;">${escapeHTML(ageTheme.theme)}</p>
          </article>
          <h5 style="margin:1rem 0 .4rem; color:#e8cf91;">توزيع طاقات محيط الدائرة (من سن 0 إلى 80 سنة):</h5>
          <div class="aqm-age-grid">
            <div class="aqm-age-node ${ageInfo.milestone===0?'is-current':''}"><b>0 / 80 سنة</b><span>طاقة ${ageMap[0]||A}</span><small>اليسار · الولادة</small></div>
            <div class="aqm-age-node ${ageInfo.milestone===10?'is-current':''}"><b>10 سنوات</b><span>طاقة ${ageMap[10]||'-'}</span><small>الركن العلوي الأيسر</small></div>
            <div class="aqm-age-node ${ageInfo.milestone===20?'is-current':''}"><b>20 سنة</b><span>طاقة ${ageMap[20]||B}</span><small>الأعلى · الروح</small></div>
            <div class="aqm-age-node ${ageInfo.milestone===30?'is-current':''}"><b>30 سنة</b><span>طاقة ${ageMap[30]||'-'}</span><small>الركن العلوي الأيمن</small></div>
            <div class="aqm-age-node ${ageInfo.milestone===40?'is-current':''}"><b>40 سنة</b><span>طاقة ${ageMap[40]||C}</span><small>اليمين · المادة</small></div>
            <div class="aqm-age-node ${ageInfo.milestone===50?'is-current':''}"><b>50 سنة</b><span>طاقة ${ageMap[50]||'-'}</span><small>الركن السفلي الأيمن</small></div>
            <div class="aqm-age-node ${ageInfo.milestone===60?'is-current':''}"><b>60 سنة</b><span>طاقة ${ageMap[60]||D}</span><small>الأسفل · الكارما</small></div>
            <div class="aqm-age-node ${ageInfo.milestone===70?'is-current':''}"><b>70 سنة</b><span>طاقة ${ageMap[70]||'-'}</span><small>الركن السفلي الأيسر</small></div>
          </div>
        </section>

        <!-- 3. المواهب والقدرات -->
        <section id="sec-talents" class="aqm-destiny-section" tabindex="-1">
          <span class="aqm-kicker">القسم 03 · Talents & Potentials</span>
          <h3>المواهب والقدرات الكامنة (مثلث الرأس والاتصال الروحي) <span class="aqm-destiny-badge">الرقم ${B}</span></h3>
          <p>طاقة شهر الميلاد ${B} تمثل صلتك بالإلهام وعالم الأفكار. هذه هي الهبة الفطرية التي ولدت بها ولا تحتاج إلى مجهود شاق لتفعيلها، بل تتغذى بالإتقان والتأمل الصامت.</p>
          <article class="aqm-card" style="padding:.95rem;">
            <h4 style="margin:0 0 .45rem; color:#f0dfb3;">${escapeHTML(arcMonth.title)}</h4>
            <p style="margin:0 0 .65rem; color:#cfd3dd; font-size:.88rem; line-height:1.8;">${escapeHTML(arcMonth.positions?.spirit || arcMonth.archetype)}</p>
            <p style="margin:0; color:#ecd497; font-size:.85rem;"><b>طريق تفعيل الموهبة:</b> ${escapeHTML(arcMonth.light)}</p>
          </article>
        </section>

        <!-- 4. الذيل الكارمي والحياة السابقة -->
        <section id="sec-karmic" class="aqm-destiny-section aqm-karmic-card" tabindex="-1">
          <span class="aqm-kicker">القسم 04 · Previous Life & Karmic Tail</span>
          <h3>الذيل الكارمي والحياة السابقة <span class="aqm-karmic-code">كود: ${matrix.karmicTail.code}</span></h3>
          <h4 style="margin:.3rem 0 .8rem; color:#ffb5a7;">${escapeHTML(tailData.title)}</h4>
          <p>هذه الثلاثية السفلية هي "البئر العميق" ونقطة السقوط التلقائي اللاواعية التي تكررها منذ الطفولة. فك شفرتها ينقل كل طاقات مصفوفتك من القاع إلى النور.</p>
          
          <div class="aqm-track-box" style="margin:.8rem 0; border-color:rgba(192,57,43,.4);">
            <h5>الصراع الباطني وجذور الطفولة</h5>
            <p><b>التناقض الأساسي:</b> ${escapeHTML(tailData.paradox)}</p>
            <p style="margin-top:.5rem;"><b>الجذور الأسرية:</b> ${escapeHTML(tailData.childhoodRoots)}</p>
          </div>

          <div class="aqm-karmic-tracks">
            <div class="aqm-track-box">
              <h5>المسار الأول (الهروب / الانجراف)</h5>
              <p>${escapeHTML(tailData.tracks?.trackOne || 'تكرار نفس السلوكيات التعويضية التلقائية التي تجلب الخذلان عند الضغط.')}</p>
            </div>
            <div class="aqm-track-box">
              <h5>المسار الثاني (المواجهة والوعي)</h5>
              <p>${escapeHTML(tailData.tracks?.trackTwo || 'إسقاط الأقنعة وكسر حلقة التخريب الذاتي بالانضباط والنزاهة الصريحة.')}</p>
            </div>
          </div>

          <div class="aqm-life-path-blueprint" style="margin-top:.8rem; border-color:rgba(192,57,43,.3);">
            <h4 style="color:#ffb5a7;">بروتوكول تفكيك العقدة الكارمية</h4>
            <ol>
              ${(tailData.transformationProtocol || []).map(step => '<li><span>' + escapeHTML(step) + '</span></li>').join('')}
            </ol>
          </div>

          <div class="aqm-confrontation">
            <b>المواجهة الصريحة من عقيق:</b> ${escapeHTML(tailData.closingConfrontation || 'كل ما كان يوماً نقطة ضعفك الدفينة سيصبح أعظم مصادر قوتك عندما تفك شفرته بوعي شجاع.')}
          </div>
        </section>

        <!-- 5. سيناريو الحياة وتطور الفصول -->
        <section id="sec-scenario" class="aqm-destiny-section" tabindex="-1">
          <span class="aqm-kicker">القسم 05 · Scenario of Life</span>
          <h3>سيناريو وتطور مراحل الحياة (فصول العمر الأربعة)</h3>
          <p>تتحرك طاقات الإنسان في دورة كبرى حول محاور المربع، لتمر بأربع محطات نضج وجودية:</p>
          <div class="aqm-pos-grid">
            <article class="aqm-pos-item">
              <h5><span>المرحلة الأولى (0 - 20 سنة)</span><small>التكوين واكتشاف الذات</small></h5>
              <p>تنشط بين يوم الميلاد (طاقة ${A}) والروح (طاقة ${B})؛ صياغة الهوية والانفصال التدريجي عن البيئة الأولى وتجربة المهارات الفردية.</p>
            </article>
            <article class="aqm-pos-item">
              <h5><span>المرحلة الثانية (20 - 40 سنة)</span><small>بناء الأثر والمادة</small></h5>
              <p>تنشط بين الروح (طاقة ${B}) وسنة الميلاد (طاقة ${C})؛ ذروة النشاط العملي والاجتماعي، بناء الثروة والمسؤولية، والبحث عن الاستقرار الأسري.</p>
            </article>
            <article class="aqm-pos-item">
              <h5><span>المرحلة الثالثة (40 - 60 سنة)</span><small>الامتحان وسداد الديون</small></h5>
              <p>تنشط نحو الذيل الكارمي (طاقة ${D})؛ مرحلة النضج الحاسم وسداد الالتزامات الكارمية، وإعادة تقييم الإنجازات بما يخدم سلام الروح.</p>
            </article>
            <article class="aqm-pos-item">
              <h5><span>المرحلة الرابعة (60 - 80 سنة)</span><small>الحكمة والاندماج</small></h5>
              <p>العودة لاكتمال الدورة نحو نقطة البداية؛ نقل الخبرة للأجيال القادمة والتصالح التام مع الجذور والكون.</p>
            </article>
          </div>
        </section>

        </div>

        <!-- المجموعة الثانية: مسارات الأرض (أقسام 6 إلى 10) -->
        <div class="aqm-group-container" data-cat="earth">
          <div class="aqm-group-header">
            <h4><span>🌍 المجموعة الثانية: مسارات الأرض</span> <small>Earthly Paths</small></h4>
            <p>رسالة القدر وتكامل المحاور، تدفق خط المال والوفرة، البرامج الكارمية، شريك الحياة، والكيمياء الحميمية.</p>
          </div>

          <!-- 6. القدر والرسالة الروحية -->
        <section id="sec-destiny" class="aqm-destiny-section" tabindex="-1">
          <span class="aqm-kicker">القسم 06 · Destiny & Spiritual Purpose</span>
          <h3>القدر والرسالة الروحية (محاور السماء والأرض) <span class="aqm-destiny-badge">الامتحان الروحي: ${axes.spiritualExam}</span></h3>
          <div class="aqm-pillars">
            <article class="aqm-card aqm-pillar"><span class="aqm-pillar-number">${axes.soulSearching}</span><h4>البحث الذاتي (النية)</h4><p>حاصل دمج السماء والأرض: يحدد بوصلتك الداخلية حتى سن الأربعين.</p></article>
            <article class="aqm-card aqm-pillar"><span class="aqm-pillar-number">${axes.socialization}</span><h4>الاندماج الاجتماعي</h4><p>حاصل دمج خطوط الذكور والإناث: يحدد دورك وأثرك في المجتمع بعد الأربعين.</p></article>
            <article class="aqm-card aqm-pillar"><span class="aqm-pillar-number">${axes.spiritualExam}</span><h4>الطاقة الحاكمة (الامتحان الروحي)</h4><p>محصلة المسار الفردي والمجتمعي معاً: الامتحان الوجودي الذي ينضج وعيك.</p></article>
          </div>
        </section>

        <!-- 7. المال والوفرة والمهنة -->
        <section id="sec-money" class="aqm-destiny-section" tabindex="-1">
          <span class="aqm-kicker">القسم 07 · Money & Career Line</span>
          <h3>خط المال والوفرة والمهنة الأنسب <span class="aqm-destiny-badge">مدخل المال: ${matrix.channels.money}</span></h3>
          <p>في مصفوفة القدر، المال ليس رقماً مجرداً بالبنك، بل هو <b>طاقة تدفق تتغذى بالوضوح</b> وتنسد بالشح أو الخوف من الفقر. طاقة سنة ميلادك (${C}) ومدخل خط المال (${matrix.channels.money}) يحددان طبيعة رزقك.</p>
          <div class="aqm-pos-grid">
            <article class="aqm-pos-item is-highlight">
              <h5><span>بوابة كسب الرزق · طاقة ${C}</span><small>المادة وسنة الميلاد</small></h5>
              <p><b>${escapeHTML(arcYear.title)}:</b> ${escapeHTML(arcYear.positions?.money || arcYear.archetype)}</p>
            </article>
            <article class="aqm-pos-item">
              <h5><span>ما يعطل المال في الظل (-)</span><small>معطلات الرزق</small></h5>
              <p>${escapeHTML(arcYear.shadow)}</p>
            </article>
          </div>
        </section>

        <!-- 8. برامج المصفوفة الكارمية -->
        <section id="sec-programs" class="aqm-destiny-section" tabindex="-1">
          <span class="aqm-kicker">القسم 08 · Programs</span>
          <h3>برامج المصفوفة الكارمية (البرمجيات الحاكمة)</h3>
          <p>تتكون مصفوفتك من برامج طاقية مركبة تتفاعل مع بعضها:</p>
          <div class="aqm-pos-grid">
            <article class="aqm-pos-item">
              <h5><span>برنامج الذيل الأساسي</span><small>${matrix.karmicTail.code}</small></h5>
              <p><b>${escapeHTML(tailData.title)}:</b> البرمجة الدفاعية اللاواعية وطريقة التعامل مع الأزمات.</p>
            </article>
            <article class="aqm-pos-item">
              <h5><span>برنامج السلالة الذكورية</span><small>${generations.male.combined}</small></h5>
              <p>طاقة الفعل، الإنجاز، المسؤولية المالية، والحماية المنقولة عبر خط الآباء.</p>
            </article>
            <article class="aqm-pos-item">
              <h5><span>برنامج السلالة الأنثوية</span><small>${generations.female.combined}</small></h5>
              <p>طاقة الاستحقاق، المشاعر، العلاقات، والخصوبة المنقولة عبر خط الأمهات.</p>
            </article>
          </div>
        </section>

        <!-- 9. العلاقات وشريك الحياة -->
        <section id="sec-relationship" class="aqm-destiny-section" tabindex="-1">
          <span class="aqm-kicker">القسم 09 · Relationship & Love Line</span>
          <h3>العلاقات وشريك الحياة المقدر <span class="aqm-destiny-badge">مدخل الحب: ${matrix.channels.love}</span></h3>
          <p>خط العلاقات في مصفوفة القدر يشرح نوع الشريك الذي تنجذب إليه لاواعياً، وعقدة الصدام المتكررة، وشرط التناغم لاستمرار المودة.</p>
          <article class="aqm-card" style="padding:.95rem; margin:.75rem 0;">
            <h4 style="margin:0 0 .4rem; color:#f0dfb3;">طبيعة الشريك والدرس العاطفي (طاقة ${matrix.channels.love})</h4>
            <p style="margin:0; color:#cfd3dd; font-size:.88rem; line-height:1.8;">${escapeHTML(getArc(matrix.channels.love).positions?.relationship || getArc(matrix.channels.love).archetype)}</p>
          </article>
        </section>

        <!-- 10. الكيمياء الحسية والحميمية -->
        <section id="sec-sexiness" class="aqm-destiny-section" tabindex="-1">
          <span class="aqm-kicker">القسم 10 · Sexiness & Intimacy</span>
          <h3>الكيمياء الحسية والعلاقة الحميمية (شاكرا العجز Svadhisthana)</h3>
          <p>ترتبط كيمياء الفراش والشغف الحسي بطاقة شاكرا العجز ونواة المركز. الوضوح الحميمي وإسقاط الأحكام المسبقة يحرران طاقة الجاذبية المغناطيسية دون ابتزاز أو تملك.</p>
          <div class="aqm-life-path-columns">
            <div class="aqm-life-path-copy is-light"><h4>مفتاح التناغم الحميمي (+)</h4><p>شغف دافئ، تواصل جسدي شفاف، قبول لغة الجسد دون خجل، وفصل الجنس عن المساومة العاطفية.</p></div>
            <div class="aqm-life-path-copy is-shadow"><h4>فخ الظل في الفراش (-)</h4><p>تحويل الحميمية إلى أداة ضغط أو عقاب، الصمت والبرود عند الخلاف، أو البحث عن تعويض خارجي في الظلال.</p></div>
          </div>
        </section>

        </div>

        <!-- المجموعة الثالثة: الجذور والجسد (أقسام 11 إلى 14) -->
        <div class="aqm-group-container" data-cat="roots">
          <div class="aqm-group-header">
            <h4><span>🌱 المجموعة الثالثة: الجذور والجسد</span> <small>Roots & Physicality</small></h4>
            <p>طاقات الأجداد والنسب الأسري، الامتداد العاطفي للأبناء، البراند الشخصي والكاريزما، وخريطة الصحة والشاكرات.</p>
          </div>

          <!-- 11. الوالدين وبصمة الأجداد -->
        <section id="sec-parents" class="aqm-destiny-section" tabindex="-1">
          <span class="aqm-kicker">القسم 11 · Parents & Ancestral Lines</span>
          <h3>الوالدين وبصمة الأجداد (مربع السلالة 45°)</h3>
          <p>يمثل مربع الأجداد الـ DNA الطاقي الممتد عبر 7 أجيال. التأمل في هذه الخطوط يكشف ما يستحق استمراره وما يجب تحريره:</p>
          <div class="aqm-lineage-grid" style="margin-top:.85rem;">
            ${lineageCard(generations.male, 'is-male')}
            ${lineageCard(generations.female, 'is-female')}
          </div>
        </section>

        <!-- 12. الأبناء والجيل القادم -->
        <section id="sec-kids" class="aqm-destiny-section" tabindex="-1">
          <span class="aqm-kicker">القسم 12 · Kids & Legacy</span>
          <h3>الأبناء وتمرير الطاقات (الجيل القادم)</h3>
          <p>الأبناء يلتقطون ظلال الوالدين غير المعالجة؛ عندما تحرر ذيلك الكارمي، تمنح أبناءك حرية أن يعيشوا قدرهم الخاص دون أن يرثوا عقدك القديمة.</p>
          <article class="aqm-card" style="padding:.95rem;">
            <p style="margin:0; color:#cfd3dd; font-size:.88rem; line-height:1.8;"><b>الوصية التربوية لمصفوفتك:</b> لا تفرض مخاوفك من الفقر أو الفشل على أبنائك، وامنحهم أمان التجربة والخطأ دون لوم قاسٍ.</p>
          </article>
        </section>

        <!-- 13. البراند الشخصي والهوية -->
        <section id="sec-brand" class="aqm-destiny-section" tabindex="-1">
          <span class="aqm-kicker">القسم 13 · Personal Brand</span>
          <h3>الهوية والبراند الشخصي (كيف يراك العالم؟)</h3>
          <p>المعادلة الذهبية لكاريزمتك أمام الجمهور هي التناغم التام بين طاقتك الاجتماعية (${A}) ونواتك الصادقة (${E}):</p>
          <div class="aqm-pos-grid">
            <article class="aqm-pos-item">
              <h5><span>طابعك البصري وحضورك</span><small>طاقة ${A}</small></h5>
              <p>${escapeHTML(arcDay.psychosomatics || arcDay.archetype)}</p>
            </article>
            <article class="aqm-pos-item">
              <h5><span>رسالتك ومصداقيتك</span><small>طاقة ${E}</small></h5>
              <p>تزدهر جاذبيتك عندما تتكلم بصوتك الحقيقي وتتحرر من محاولة إرضاء الجميع على حساب مبادئك.</p>
            </article>
          </div>
        </section>

        <!-- 14. خريطة الشاكرات والصحة -->
        <section id="sec-health" class="aqm-destiny-section" tabindex="-1">
          <span class="aqm-kicker">القسم 14 · Health Card & Chakras</span>
          <h3>خريطة الشاكرات والجسد (Physics / Energy / Emotions)</h3>
          <p>خريطة رمزية تكشف كيفية توزيع الطاقات على مراكز الجسم الحيوية السبعة:</p>
          <div class="aqm-table-scroll">
            <table class="aqm-chakra-table">
              <thead><tr><th scope="col">الشاكرا · Chakra</th><th scope="col">الجسد<br><small>Physics</small></th><th scope="col">الطاقة<br><small>Energy</small></th><th scope="col">المشاعر<br><small>Emotions</small></th></tr></thead>
              <tbody>
                ${chakraRows}
                <tr class="aqm-chakra-total"><th scope="row">الإجمالي · Common Energy-Zone</th><td>${chakras.total.physics}</td><td>${chakras.total.energy}</td><td>${chakras.total.emotions}</td></tr>
              </tbody>
            </table>
          </div>
          <p class="aqm-health-note">${escapeHTML(chakras.method)} الارتباطات الجسدية رمزية للتأمل وليست بديلاً عن الاستشارة الطبية المتخصصة.</p>
        </section>
        </div>
      </div>
    `;
  }

  function render(host, dateValue) {
    if (typeof host === 'string' && (typeof dateValue === 'object' || !dateValue)) {
      const t = host;
      host = dateValue || document.createElement('div');
      dateValue = t;
    }
    if (!host) host = document.createElement('div');
    const life=calculateLifePath(dateValue);
    const matrix=calculateDestinyMatrix(dateValue);
    const chakras=calculateChakraHealthCard(dateValue);
    const generations=calculateGenerationalLines(dateValue);
    const axes=calculateDestinyAxes(dateValue);
    const n=life.number;
    const traits=lifeTraits(n);
    const num=matrix.nodes;
    const profile=LIFE_PATH_DATA[n];

    host.innerHTML=`
      <section class="aqm-shell" dir="rtl" aria-label="مسار الحياة ومصفوفة القدر">
        <header class="aqm-header">
          <span class="aqm-kicker">مصفوفة القدر والأركانا الكبرى · ${escapeHTML(dateValue)}</span>
          <h2>مصفوفة القدر والهندسة الطاقية</h2>
          <p>أداة للوعي الذاتي والتأمل النفسي والسلوكي بأسلوب عقيق أسترو.</p>
        </header>

        <!-- النجمة الثمانية البصرية التفاعلية ومحاور القدر -->
        <div class="aqm-grid">
          <article class="aqm-card aqm-chart-card">
            <div class="aqm-card-head">
              <div>
                <span class="aqm-kicker">الأركانا الكبرى · 1–22</span>
                <h3>النجمة الثمانية والمحاور الطاقية</h3>
              </div>
            </div>
            <div class="aqm-matrix-wrap">
              ${renderSVG(matrix)}
              <div class="aqm-tooltip" id="aqm-tooltip" role="status" aria-live="polite">اضغط أو مرر على أي دائرة لاستكشاف معناها المصيري.</div>
            </div>
            <div class="aqm-lines">
              <p><b>خط الوفرة والمال:</b> مدخل ${matrix.channels.money} ← المركز ${num.center} ← المادة ${num.south}</p>
              <p><b>خط الحب والشراكات:</b> مدخل ${matrix.channels.love} ← المركز ${num.center} ← التوازن ${matrix.channels.balance}</p>
            </div>
            <p class="aqm-method">${escapeHTML(matrix.formula)}</p>
          </article>

          <div class="aqm-interpretations">
            <article class="aqm-card">
              <span class="aqm-kicker">القناع الاجتماعي · رقم ${num.day}</span>
              <h3>طاقة يوم الميلاد والانطباع الأول</h3>
              <div class="aqm-reading">
                <b>${num.day} · ${escapeHTML(ARCANA[num.day-1]?.[0] || '')}</b>
                <p>${escapeHTML(ARCANA[num.day-1]?.[1] || '')}</p>
              </div>
              <div class="aqm-reading is-shadow">
                <b>جانب للتأمل الواعي</b>
                <p>${escapeHTML(ARCANA[num.day-1]?.[2] || '')}</p>
              </div>
            </article>

            <article class="aqm-card">
              <span class="aqm-kicker">جوهر الروح · رقم ${num.center}</span>
              <h3>نواة وراحة الروح</h3>
              <div class="aqm-reading">
                <b>${num.center} · ${escapeHTML(ARCANA[num.center-1]?.[0] || '')}</b>
                <p>${escapeHTML(ARCANA[num.center-1]?.[1] || '')}</p>
              </div>
              <div class="aqm-reading is-shadow">
                <b>مساحة التوازن</b>
                <p>${escapeHTML(ARCANA[num.center-1]?.[2] || '')}</p>
              </div>
            </article>
          </div>
        </div>

        <!-- الأقسام الـ 14 الشاملة لمصفوفة القدر وفق معمارية عقيق المعتمدة -->
        ${render14DestinySections(matrix, dateValue, chakras, generations, axes)}

        <!-- 3. كارت مسار الحياة الكوني المعزول والمستقل عن المصفوفة -->
        <section id="aqm-lifepath-island" class="aqm-lifepath-island" aria-label="تحليل مسار الحياة الكوني المستقل">
          <header class="aqm-lifepath-head">
            <div class="aqm-lifepath-badge-row">
              <span class="aqm-kicker">علم الأرقام (Numerology) · قراءة منفصلة ومستقلة</span>
              <span class="aqm-badge-outline">أداة مستقلة</span>
            </div>
            <h3>مسار الحياة الكوني · رقم ${n}</h3>
            <p class="aqm-lifepath-disclaimer">
              <b>تنويه منهجي:</b> مسار الحياة مستخرج وفق علم الأرقام الغربي (مجموع أرقام تاريخ الميلاد الكامل)، وهو يوضح البوصلة العامة للوعي، بينما مصفوفة القدر بالأعلى مبنية على الأركانا الـ 22 وهندسة المربعين. تم فصل هذا التحليل هنا كمرجع إضافي حتى لا يحدث أي خلط بين النظامين.
            </p>
          </header>

          <article class="aqm-hero" style="margin-top: 1rem;">
            <div class="aqm-number">${n}</div>
            <div>
              <span class="aqm-kicker">رقم المسار الكوني</span>
              <h3>${escapeHTML(profile?.title || 'طريقك يتشكل بخياراتك')}</h3>
              <div class="aqm-tags">${traits.map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</div>
            </div>
          </article>

          <details class="aqm-lifepath-drawer" style="margin-top: 1.25rem;">
            <summary class="aqm-drawer-summary">عرض التحليل السيكولوجي والسوماتيكي الكامل لمسار ${n} (مع جدول Cheat Sheet)</summary>
            <div class="aqm-drawer-body">
              ${renderLifePathProfile(profile)}
            </div>
          </details>
        </section>

        

        <footer class="aqm-disclaimer">
          هذه التحليلات مبنية على الهندسة المقدسة ونظام الأركانا الـ 22 لمصفوفة القدر، ومصاغة بأسلوب تحليلي نفسي وسلوكي وسوماتيكي للتأمل العميق، ولا تتضمن ادعاءات غيبية حتمية.
        </footer>
      </section>
    `;

    // تفعيل تفاصيل الشاكرات القابلة للفتح والغلق
    host.querySelectorAll('[data-chakra-toggle]').forEach(button => {
      button.addEventListener('click', () => {
        const detail = host.querySelector('#' + button.getAttribute('aria-controls'));
        const open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        if (detail) detail.hidden = !open;
        button.querySelector('[aria-hidden="true"]').textContent = open ? '−' : '＋';
      });
    });

    // تفعيل التبديل بين مجموعات الأقسام الرئيسية (Categorized Groups)
    const catTabs = host.querySelectorAll('.aqm-cat-tab');
    const groupContainers = host.querySelectorAll('.aqm-group-container');
    const navPills = host.querySelectorAll('.aqm-nav-pill');

    catTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        catTabs.forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        const cat = tab.getAttribute('data-cat');
        groupContainers.forEach(group => {
          if (cat === 'all' || group.getAttribute('data-cat') === cat) {
            group.hidden = false;
          } else {
            group.hidden = true;
          }
        });

        // تصفية أزرار القفز السريع حسب المجموعة المختارة
        navPills.forEach(pill => {
          const pillCat = pill.getAttribute('data-cat');
          if (cat === 'all' || pillCat === 'all' || pillCat === cat) {
            pill.hidden = false;
          } else {
            pill.hidden = true;
          }
        });
      });
    });

    // تفعيل أزرار التنقل السريع بين الأقسام الـ 14
    navPills.forEach(pill => {
      pill.addEventListener('click', () => {
        navPills.forEach(p => p.classList.remove('is-active'));
        pill.classList.add('is-active');

        const target = pill.getAttribute('data-target');
        const filter = pill.getAttribute('data-filter');

        if (filter === 'all') {
          const allTab = host.querySelector('.aqm-cat-tab[data-cat="all"]');
          if (allTab) allTab.click();
          host.querySelectorAll('.aqm-destiny-section').forEach(sec => sec.hidden = false);
        } else if (target) {
          const targetEl = host.querySelector(target);
          if (targetEl) {
            const parentGroup = targetEl.closest('.aqm-group-container');
            if (parentGroup && parentGroup.hidden) {
              const cat = parentGroup.getAttribute('data-cat');
              const matchTab = host.querySelector(`.aqm-cat-tab[data-cat="${cat}"]`);
              if (matchTab) matchTab.click();
            }
            targetEl.hidden = false;
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            targetEl.focus();
          }
        }
      });
    });

    // تفعيل تفاعل النقر والمرور على دوائر النجمة الثمانية
    const tip = host.querySelector('#aqm-tooltip');
    host.querySelectorAll('.aqm-node').forEach(node => {
      const show = () => {
        const key = node.dataset.node;
        const value = num[key];
        const [positive, shadow] = (ARCANA[value - 1] || []).slice(1);
        if (tip) tip.textContent = `${labels[key]} · ${value}: ${positive}. جانب للتأمل: ${shadow}.`;
        host.querySelectorAll('.aqm-node').forEach(n => n.classList.toggle('is-active', n === node));
      };
      node.addEventListener('mouseenter', show);
      node.addEventListener('focus', show);
      node.addEventListener('click', show);
      node.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          show();
        }
      });
    });

    return host;
  }

  function initResult(root) {
    if (!root || root.dataset.aqmReady === 'true') return;
    const date = document.querySelector('#f-date')?.value;
    if (!date || !root.children.length) return;
    root.dataset.aqmReady = 'true';
    const original = [...root.childNodes];
    root.replaceChildren();

    const tabs = document.createElement('div');
    tabs.className = 'aqm-tabs';
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'أقسام النتيجة');

    const chartBtn = document.createElement('button');
    const matrixBtn = document.createElement('button');
    [
      [chartBtn, 'chart', 'الخريطة والعبور'],
      [matrixBtn, 'numbers', 'الأرقام ومصفوفة القدر']
    ].forEach(([btn, id, label], i) => {
      btn.type = 'button';
      btn.id = `aqm-tab-${id}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(i === 0));
      btn.setAttribute('aria-controls', `aqm-panel-${id}`);
      btn.tabIndex = i === 0 ? 0 : -1;
      btn.textContent = label;
      tabs.append(btn);
    });

    const chartPanel = document.createElement('div');
    const matrixPanel = document.createElement('div');
    chartPanel.id = 'aqm-panel-chart';
    matrixPanel.id = 'aqm-panel-numbers';
    chartPanel.setAttribute('role', 'tabpanel');
    matrixPanel.setAttribute('role', 'tabpanel');
    matrixPanel.setAttribute('aria-labelledby', 'aqm-tab-numbers');
    chartPanel.setAttribute('aria-labelledby', 'aqm-tab-chart');
    chartPanel.className = 'aqm-tab-panel';
    matrixPanel.className = 'aqm-tab-panel';

    original.forEach(node => chartPanel.append(node));
    root.append(tabs, chartPanel, matrixPanel);

    const activate = id => {
      const isChart = id === 'chart';
      chartPanel.hidden = !isChart;
      matrixPanel.hidden = isChart;
      chartBtn.setAttribute('aria-selected', String(isChart));
      matrixBtn.setAttribute('aria-selected', String(!isChart));
      chartBtn.tabIndex = isChart ? 0 : -1;
      matrixBtn.tabIndex = isChart ? -1 : 0;
    };

    chartBtn.addEventListener('click', () => activate('chart'));
    matrixBtn.addEventListener('click', () => activate('numbers'));
    tabs.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        (e.target === chartBtn ? matrixBtn : chartBtn).click();
        (e.target === chartBtn ? matrixBtn : chartBtn).focus();
      }
    });

    render(matrixPanel, date);
  }

  const api = {
    calculateLifePath,
    calculateDestinyMatrix,
    calculateChakraHealthCard,
    calculateGenerationalLines,
    calculateDestinyAxes,
    reduceArcana,
    reduceLifePath,
    render,
    initResult
  };

  window.AqeeqNumerology = api;

  const mount = () => {
    const root = document.querySelector('#result');
    if (root) initResult(root);
  };

  new MutationObserver(() => {
    const root = document.querySelector('#result');
    if (root && root.dataset.aqmReady === 'true' && !root.querySelector('.aqm-shell')) delete root.dataset.aqmReady;
    mount();
  }).observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener('DOMContentLoaded', mount);
  mount();
})();




/* Story Share Card: client-side 9:16 PNG generation */
(() => {
  'use strict';
  const W=1080,H=1920,ACCOUNT='@mohamed.ibrahim.astro';
  const query=(root,selector)=>root.querySelector(selector);
  function path(ctx,x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y+h,x,y,r);ctx.closePath();
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
