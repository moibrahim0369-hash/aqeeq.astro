(() => {
  'use strict';

  if (typeof SVGElement !== 'undefined' && typeof SVGElement.prototype.click !== 'function') {
    SVGElement.prototype.click = function() {
      this.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    };
  }
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

  /**
   * رسم النجمة الثمانية ومصفوفة القدر (SVG)
   * مطابقة للألوان السبعة ومسارات الحب والمال وطوق العمر 0-80 سنة
   */
  function renderSVG(matrix, dateValue) {
    const num = matrix.nodes;
    const { A, B, C, D, E } = matrix.anchors;
    const channels = matrix.channels || { money: 0, love: 0, balance: 0 };

    // حساب خريطة سنوات العمر وموقع السن الحالي
    const ageApi = window.AqeeqAgeMap || {};
    const ageMap = (typeof ageApi.calculateAgeMap === 'function')
      ? ageApi.calculateAgeMap(matrix.anchors, matrix.generationalCorners)
      : {};
    const ageInfo = (typeof ageApi.getCurrentAgeEnergy === 'function')
      ? ageApi.getCurrentAgeEnergy(dateValue)
      : { exactAge: 0, milestone: 0 };
    const currentMilestone = Number(ageInfo.milestone) || 0;

    // إحداثيات الدائرة والمركز (Center = 260, 260)
    const cx = 260, cy = 260;
    const rMain = 158;
    const rDiag = 112;

    const coords = {
      north: [cx, cy - rMain],           // (260, 102) Sahasrara (Violet) - شهر الميلاد B
      east: [cx + rMain, cy],            // (418, 260) Svadhisthana (Orange) - سنة الميلاد C
      south: [cx, cy + rMain],           // (260, 418) Muladhara (Red) - الذيل الكارمي D
      west: [cx - rMain, cy],            // (102, 260) Vishuddha/Anahata (Blue/Green) - يوم الميلاد A
      northEast: [cx + rDiag, cy - rDiag], // (372, 148) Ajna - G
      southEast: [cx + rDiag, cy + rDiag], // (372, 372) H
      southWest: [cx - rDiag, cy + rDiag], // (148, 372) F
      northWest: [cx - rDiag, cy - rDiag], // (148, 148) I
      center: [cx, cy]                   // (260, 260) Manipura (Yellow) - E
    };

    // إحداثيات خط الحب والمال
    const loveCoord = [298, 332];     // مدخل الحب ❤️
    const balanceCoord = [330, 310];  // نقطة التوازن ⚖️
    const moneyCoord = [348, 276];    // مدخل المال 💰

    // أضلاع المربعين (المستقيم والمائل)
    const personalSquare = `${coords.north[0]},${coords.north[1]} ${coords.east[0]},${coords.east[1]} ${coords.south[0]},${coords.south[1]} ${coords.west[0]},${coords.west[1]}`;
    const ancestralSquare = `${coords.northEast[0]},${coords.northEast[1]} ${coords.southEast[0]},${coords.southEast[1]} ${coords.southWest[0]},${coords.southWest[1]} ${coords.northWest[0]},${coords.northWest[1]}`;

    // حساب نقاط ومحطات العمر على المحيط (0 إلى 80 سنة)
    const rAge = 214;
    const agePoints = [
      { age: 0, angle: 180, label: '0' },
      { age: 5, angle: 202.5, label: '5' },
      { age: 10, angle: 225, label: '10' },
      { age: 15, angle: 247.5, label: '15' },
      { age: 20, angle: 270, label: '20' },
      { age: 25, angle: 292.5, label: '25' },
      { age: 30, angle: 315, label: '30' },
      { age: 35, angle: 337.5, label: '35' },
      { age: 40, angle: 0, label: '40' },
      { age: 45, angle: 22.5, label: '45' },
      { age: 50, angle: 45, label: '50' },
      { age: 55, angle: 67.5, label: '55' },
      { age: 60, angle: 90, label: '60' },
      { age: 65, angle: 112.5, label: '65' },
      { age: 70, angle: 135, label: '70' },
      { age: 75, angle: 157.5, label: '75' }
    ];

    const ageElements = agePoints.map(pt => {
      const rad = (pt.angle * Math.PI) / 180;
      const x = Math.round(cx + rAge * Math.cos(rad));
      const y = Math.round(cy + rAge * Math.sin(rad));
      const energy = ageMap[pt.age] || (pt.age === 0 ? A : pt.age === 20 ? B : pt.age === 40 ? C : pt.age === 60 ? D : 0);
      const isCurrent = Math.abs(currentMilestone - pt.age) < 3.5;
      const isMajor = pt.age % 10 === 0;

      const labelRad = (pt.angle * Math.PI) / 180;
      const lx = Math.round(cx + (rAge + (isMajor ? 20 : 15)) * Math.cos(labelRad));
      const ly = Math.round(cy + (rAge + (isMajor ? 20 : 15)) * Math.sin(labelRad)) + 3;

      return `
        <g class="aqm-age-node-dot ${isCurrent ? 'is-current' : ''}" data-age="${pt.age}" data-target="#sec-age" role="button" tabindex="0" aria-label="سن ${pt.age}: طاقة ${energy}">
          <circle cx="${x}" cy="${y}" r="${isMajor ? 11 : 9}" />
          <text x="${x}" y="${y + 3}">${energy}</text>
          <text class="aqm-age-label-text" x="${lx}" y="${ly}">${pt.label}</text>
          <title>طاقة سن ${pt.age}: أركانا ${energy} (${escapeHTML(ARCANA[energy - 1]?.[0] || '')})</title>
        </g>
      `;
    }).join('');

    // دوائر الشاكرات الأساسية في النجمة
    const nodesConfig = [
      { key: 'north', chakra: 'aqm-chakra-sahasrara', r: 19, val: num.north, label: 'الاتصال الروحي والشهر (Sahasrara)', target: '#sec-core' },
      { key: 'east', chakra: 'aqm-chakra-svadhisthana', r: 19, val: num.east, label: 'المادة وسنة الميلاد (Svadhisthana)', target: '#sec-money' },
      { key: 'south', chakra: 'aqm-chakra-muladhara', r: 19, val: num.south, label: 'الذيل الكارمي والدروس (Muladhara)', target: '#sec-karmic' },
      { key: 'west', chakra: 'aqm-chakra-vishuddha', r: 19, val: num.west, label: 'الجوهر ويوم الميلاد (Vishuddha)', target: '#sec-core' },
      { key: 'northEast', chakra: 'aqm-chakra-ajna', r: 17, val: num.northEast, label: 'مربع الأسلاف · زاوية علوية (G)', target: '#sec-programs' },
      { key: 'southEast', chakra: 'aqm-chakra-muladhara', r: 17, val: num.southEast, label: 'مربع الأسلاف · زاوية مادية (H)', target: '#sec-programs' },
      { key: 'southWest', chakra: 'aqm-chakra-muladhara', r: 17, val: num.southWest, label: 'مربع الأسلاف · زاوية كارمية (F)', target: '#sec-programs' },
      { key: 'northWest', chakra: 'aqm-chakra-ajna', r: 17, val: num.northWest, label: 'مربع الأسلاف · زاوية روحية (I)', target: '#sec-programs' },
      { key: 'center', chakra: 'aqm-chakra-manipura is-center', r: 23, val: num.center, label: 'راحة الروح ونواة المركز (Manipura)', target: '#sec-core' }
    ];

    const nodesSvg = nodesConfig.map(cfg => {
      const [x, y] = coords[cfg.key];
      return `
        <g class="aqm-node ${cfg.chakra}" tabindex="0" role="button" data-node="${cfg.key}" data-target="${cfg.target}" aria-label="${escapeHTML(cfg.label)}: ${cfg.val}" aria-describedby="aqm-tooltip">
          <circle cx="${x}" cy="${y}" r="${cfg.r}" />
          <text x="${x}" y="${y + 5}">${cfg.val}</text>
          <title>${escapeHTML(cfg.label)}: ${cfg.val}</title>
        </g>
      `;
    }).join('');

    // دوائر وأيقونات خط الحب والمال
    const channelsSvg = `
      <!-- خط قناة الحب والمال -->
      <line class="aqm-channel-line" x1="${loveCoord[0]}" y1="${loveCoord[1]}" x2="${moneyCoord[0]}" y2="${moneyCoord[1]}" />

      <!-- مدخل الحب (Heart) -->
      <g class="aqm-node aqm-node-love" tabindex="0" role="button" data-node="love" data-target="#sec-love" aria-label="مدخل الحب والشراكات: ${channels.love}">
        <circle cx="${loveCoord[0]}" cy="${loveCoord[1]}" r="14" />
        <text x="${loveCoord[0]}" y="${loveCoord[1] + 4}">${channels.love}</text>
        <path class="aqm-channel-glyph" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ff4d6d" transform="translate(${loveCoord[0] - 24}, ${loveCoord[1] - 8}) scale(0.4)" />
        <title>خط الحب والشراكات: ${channels.love}</title>
      </g>

      <!-- نقطة التوازن (Balance) -->
      <g class="aqm-node aqm-node-balance" tabindex="0" role="button" data-node="balance" data-target="#sec-love" aria-label="نقطة التوازن والكيمياء: ${channels.balance}">
        <circle cx="${balanceCoord[0]}" cy="${balanceCoord[1]}" r="13" />
        <text x="${balanceCoord[0]}" y="${balanceCoord[1] + 4}">${channels.balance}</text>
        <title>نقطة التوازن: ${channels.balance}</title>
      </g>

      <!-- مدخل المال (Dollar) -->
      <g class="aqm-node aqm-node-money" tabindex="0" role="button" data-node="money" data-target="#sec-money" aria-label="مدخل خط المال والوفرة: ${channels.money}">
        <circle cx="${moneyCoord[0]}" cy="${moneyCoord[1]}" r="14" />
        <text x="${moneyCoord[0]}" y="${moneyCoord[1] + 4}">${channels.money}</text>
        <g class="aqm-channel-glyph" transform="translate(${moneyCoord[0] + 12}, ${moneyCoord[1] - 8})">
          <circle r="7" fill="#2ecc71" opacity="0.3"/>
          <text text-anchor="middle" y="3.5" font-size="10" font-weight="900" fill="#2ecc71">$</text>
        </g>
        <title>خط المال والوفرة: ${channels.money}</title>
      </g>
    `;

    return `
      <svg class="aqm-svg" viewBox="0 0 520 520" role="group" aria-label="مصفوفة القدر الهندسية وأطواق الشاكرات وسنوات العمر">
        <defs>
          <linearGradient id="aqm-grad-channel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff4d6d" />
            <stop offset="50%" stop-color="#f1c40f" />
            <stop offset="100%" stop-color="#2ecc71" />
          </linearGradient>
        </defs>

        <!-- الدائرة المحيطية لسنوات العمر (0 إلى 80 سنة) -->
        <circle class="aqm-age-ring-path" cx="${cx}" cy="${cy}" r="${rAge}" />

        <!-- المربع المستقيم (Personal Square) والمربع المائل (Ancestral Square) -->
        <polygon class="aqm-octagon" points="${personalSquare}" />
        <polygon class="aqm-octagon" points="${ancestralSquare}" stroke-dasharray="3 3" opacity="0.75" />

        <!-- محاور النجمة الثمانية المركزية -->
        <line class="aqm-line aqm-axis-vertical" x1="${coords.north[0]}" y1="${coords.north[1]}" x2="${coords.south[0]}" y2="${coords.south[1]}" />
        <line class="aqm-line aqm-axis-horizontal" x1="${coords.west[0]}" y1="${coords.west[1]}" x2="${coords.east[0]}" y2="${coords.east[1]}" />
        <line class="aqm-diagonal" x1="${coords.northWest[0]}" y1="${coords.northWest[1]}" x2="${coords.southEast[0]}" y2="${coords.southEast[1]}" />
        <line class="aqm-diagonal" x1="${coords.northEast[0]}" y1="${coords.northEast[1]}" x2="${coords.southWest[0]}" y2="${coords.southWest[1]}" />

        <!-- خط قناة المال والحب مع الأيقونات -->
        ${channelsSvg}

        <!-- نقاط ومحطات سنوات العمر على المحيط (0 - 80 سنة) -->
        ${ageElements}

        <!-- دوائر ومراكز الشاكرات في النجمة -->
        ${nodesSvg}
      </svg>
    `;
  }

  /**
   * الأقسام السبعة القياسية لمصفوفة القدر وفق معمارية matrix-destiny.com
   * مهيأة كحاويات بيانات (Data Containers) مستقلة ونظيفة
   */
  function render7DestinySections(matrix, dateValue, chakras, generations, axes) {
    const { A, B, C, D, E } = matrix.anchors;
    const DESTINY_DATA = window.AqeeqDestinyMatrixData || {};
    const AGE_MAP_API = window.AqeeqAgeMap || {};

    const getArc = DESTINY_DATA.getArcana || (n => ({ title: `أركانا ${n}`, archetype: '', light: '', shadow: '', psychosomatics: '', cheatSheet: [], positions: {}, transformationProtocol: [] }));
    const getTail = DESTINY_DATA.getKarmicTail || ((c1, c2, c3) => ({ code: `${c1}-${c2}-${c3}`, title: `الذيل الكارمي (${c1}-${c2}-${c3})`, paradox: '', childhoodRoots: '', tracks: {}, psychosomatics: '', transformationProtocol: [], closingConfrontation: '' }));

    const arcDay = getArc(A);
    const arcMonth = getArc(B);
    const arcYear = getArc(C);
    const arcCenter = getArc(E);
    const arcKarma = getArc(D);
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

    // صفوف جدول الشاكرات السبع
    const chakraRows = chakras.rows.map((row, index) =>
      '<tr><th scope="row"><button type="button" class="aqm-chakra-toggle" data-chakra-toggle="' + row.key + '" aria-expanded="false" aria-controls="aqm-chakra-detail-' + row.key + '"><span class="aqm-chakra-order">' + (index + 1) + '</span><span>' + escapeHTML(row.name) + '<small>' + escapeHTML(row.sanskrit) + '</small></span><span aria-hidden="true">＋</span></button></th><td>' + row.physics + '</td><td>' + row.energy + '</td><td>' + row.emotions + '</td></tr><tr id="aqm-chakra-detail-' + row.key + '" class="aqm-chakra-detail" hidden><td colspan="4"><div class="aqm-chakra-copy"><p><b>المعنى الروحي والسلوكي · طاقة ' + row.energy + ' (' + escapeHTML(ARCANA[row.energy - 1]?.[0] || '') + '):</b> ' + escapeHTML(row.focus) + '. ' + escapeHTML(ARCANA[row.energy - 1]?.[1] || '') + '</p><p><b>ارتباط جسدي رمزي:</b> ' + escapeHTML(row.area) + '. صياغة رمزية للتأمل وليست تشخيصاً طبياً.</p><p><b>مفتاح التوازن:</b> ' + escapeHTML(row.balance) + '</p></div></td></tr>'
    ).join('');

    // كروت خطوط الأجداد
    const lineageCard = (line, kind) =>
      '<article class="aqm-card aqm-lineage-card ' + kind + '"><span class="aqm-kicker">' + escapeHTML(line.name) + '</span><div class="aqm-ancestral-numbers">' +
      line.points.map((n, i) => '<span><b>' + n + '</b><small>' + (i === 1 ? 'المركز' : 'زاوية') + '</small></span>').join('<i aria-hidden="true">·</i>') +
      '</div><p>طاقة طرفَي الخط: <b>' + line.combined + '</b>. مفتاح رمزي لتأمل الأنماط الأسرية الموروثة وكسر قيودها بوعي.</p></article>';

    return `
      <!-- شريط التنقل المرجعي للأقسام السبعة القياسية -->
      <nav class="aqm-section-nav" aria-label="أقسام مصفوفة القدر المرجعية">
        <button type="button" class="aqm-nav-pill is-active" data-target="#sec-core">1. الجوهر والمركز</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-karmic">2. الذيل الكارمي</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-age">3. طاقة العمر والسنوات</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-money">4. خط المال والوظيفة</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-love">5. خط العلاقات والشريك</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-programs">6. البرامج والأسلاف</button>
        <button type="button" class="aqm-nav-pill" data-target="#sec-health">7. خريطة الشاكرات والصحة</button>
      </nav>

      <div class="aqm-matrix-sections">
        <!-- 1. الجوهر والمركز (Core Personality) -->
        <section id="sec-core" class="aqm-destiny-section" tabindex="-1">
          <div class="aqm-sec-header">
            <span class="aqm-kicker">القسم 01 · Core Personality</span>
            <h3>الجوهر والمركز (القناع الاجتماعي ونواة الروح) <span class="aqm-destiny-badge">الرقم ${A} و ${E}</span></h3>
          </div>
          <p>تميّز مصفوفة القدر بين <b>القناع الخارجي</b> (طاقة يوم الميلاد ${A}) الذي يراك به الناس، وبين <b>نواة الروح وراحة القلب</b> (طاقة المركز ${E}) حيث يسكن سلامك الداخلي الحقيقي.</p>
          ${centerCheatRows}
          <div class="aqm-pos-grid">
            <article class="aqm-pos-item is-highlight">
              <h5><span>القناع الاجتماعي والانطباع الأول · رقم ${A}</span><small>يوم الميلاد</small></h5>
              <p><b>${escapeHTML(arcDay.title)}:</b> ${escapeHTML(arcDay.positions?.personality || arcDay.archetype)}</p>
            </article>
            <article class="aqm-pos-item is-highlight">
              <h5><span>نواة الروح وراحة القلب · رقم ${E}</span><small>مركز المصفوفة</small></h5>
              <p><b>${escapeHTML(arcCenter.title)}:</b> ${escapeHTML(arcCenter.positions?.center || arcCenter.archetype)}</p>
            </article>
            <article class="aqm-pos-item">
              <h5><span>الاتصال الروحي ومصدر الإلهام · رقم ${B}</span><small>شهر الميلاد</small></h5>
              <p><b>${escapeHTML(arcMonth.title)}:</b> ${escapeHTML(arcMonth.positions?.spirit || arcMonth.archetype)}</p>
            </article>
            <article class="aqm-pos-item">
              <h5><span>مدخل المادة والمهام الدنيوية · رقم ${C}</span><small>سنة الميلاد</small></h5>
              <p><b>${escapeHTML(arcYear.title)}:</b> ${escapeHTML(arcYear.positions?.money || arcYear.archetype)}</p>
            </article>
          </div>
          <div class="aqm-life-path-columns" style="margin-top: .85rem;">
            <div class="aqm-life-path-copy is-light"><h4>تجلي النواة في النور (+)</h4><p>${escapeHTML(arcCenter.light)}</p></div>
            <div class="aqm-life-path-copy is-shadow"><h4>فخ الظل في المركز (-)</h4><p>${escapeHTML(arcCenter.shadow)}</p></div>
          </div>
        </section>

        <!-- 2. الذيل الكارمي (Karmic Tail) -->
        <section id="sec-karmic" class="aqm-destiny-section aqm-karmic-card" tabindex="-1">
          <div class="aqm-sec-header">
            <span class="aqm-kicker">القسم 02 · Karmic Tail</span>
            <h3>الذيل الكارمي والدروس الروحية <span class="aqm-karmic-code">${tailData.code}</span></h3>
          </div>
          <p>الذيل الكارمي هو الشفرة التأسيسية لتحدياتك غير المحلولة من الماضي؛ يدخل حياتك بنمط لاواعي مكرر حتى تتفكك العقدة وتتحول إلى أعلى درجات الحكمة.</p>
          <div class="aqm-pos-grid">
            <article class="aqm-pos-item">
              <h5><span>قاعدة الذيل الكارمي (Base)</span><small>رقم ${matrix.karmicTail.base}</small></h5>
              <p>${escapeHTML(arcKarma.archetype)}</p>
            </article>
            <article class="aqm-pos-item">
              <h5><span>جذر الطفولة والبرمجة الأولى</span><small>أصل العقدة</small></h5>
              <p>${escapeHTML(tailData.childhoodRoots || 'شعور مبكر بالحاجة لإثبات الذات أو الخوف من الفقدان والرفض.')}</p>
            </article>
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
          <div class="aqm-confrontation">
            <b>المواجهة الصريحة:</b> ${escapeHTML(tailData.closingConfrontation || 'كل ما كان يوماً نقطة ضعفك الدفينة سيصبح أعظم مصادر قوتك عندما تفك شفرته بوعي شجاع.')}
          </div>
        </section>

        <!-- 3. طاقة العمر والسنوات (Age periods) -->
        <section id="sec-age" class="aqm-destiny-section" tabindex="-1">
          <div class="aqm-sec-header">
            <span class="aqm-kicker">القسم 03 · Age periods & Annual Exam</span>
            <h3>طاقة دورات العمر والامتحان السنوي <span class="aqm-destiny-badge">السن الحالي: ${ageInfo.exactAge} سنة</span></h3>
          </div>
          <div class="aqm-age-badge-group">
            <span class="aqm-age-pill">طاقة سنتك الحالية: أركانا ${currentYearEnergy}</span>
            <span class="aqm-age-pill">المحطة الكبرى: سن ${ageInfo.milestone}</span>
          </div>
          <article class="aqm-card" style="padding:.95rem; margin-top:.75rem;">
            <span class="aqm-kicker">عنوان الامتحان الوجودي لسنتك الحالية</span>
            <h4 style="margin:.3rem 0; color:#f5dfa8;">${escapeHTML(ageTheme.title || ('سنة الأركانا ' + currentYearEnergy))}</h4>
            <p style="margin:0; color:#cfd3dd; font-size:.86rem; line-height:1.8;">${escapeHTML(ageTheme.theme || 'سنة تتطلب التركيز على تنظيم الأولويات ومواجهة الاختبارات بالمرونة وضبط النفس.')}</p>
          </article>
          <div class="aqm-age-grid">
            ${Object.entries(ageMap).filter(([a]) => Number(a) % 10 === 0).map(([age, arc]) => `
              <div class="aqm-age-node ${Number(age) === Number(ageInfo.milestone) ? 'is-current' : ''}">
                <small>سن ${age} سنة</small>
                <b>طاقة ${arc}</b>
                <small>${escapeHTML(ARCANA[arc - 1]?.[0] || '')}</small>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- 4. خط المال والوظيفة (Money Line) -->
        <section id="sec-money" class="aqm-destiny-section" tabindex="-1">
          <div class="aqm-sec-header">
            <span class="aqm-kicker">القسم 04 · Money Line & Career</span>
            <h3>خط المال والوفرة وتوجيه المهنة <span class="aqm-destiny-badge">مدخل الوفرة: ${matrix.channels.money}</span></h3>
          </div>
          <p>يتشكل تدفق المال من التوازن بين مدخل المادة (${C}) والمركز (${E}). المال في مصفوفة القدر هو طاقة نتيجة تتبع النزاهة والإتقان.</p>
          <div class="aqm-pos-grid">
            <article class="aqm-pos-item is-highlight">
              <h5><span>مدخل المال والوظيفة</span><small>طاقة ${matrix.channels.money}</small></h5>
              <p>${escapeHTML(getArc(matrix.channels.money).positions?.money || getArc(matrix.channels.money).archetype)}</p>
            </article>
            <article class="aqm-pos-item">
              <h5><span>أكبر عائق أمام تدفق الرزق (-)</span><small>فخ التسريب</small></h5>
              <p>الخوف من الشُح، التردد في تسعير المهارة بقيمتها الحقيقية، أو محاولة جمع المال من مسارات لا تشبه قيمك الصادقة.</p>
            </article>
          </div>
          <div class="aqm-life-path-columns" style="margin-top:.85rem;">
            <div class="aqm-life-path-copy is-light"><h4>مفتاح فتح الوفرة (+)</h4><p>تقديم نفع حقيقي ملموس، الانضباط في إدارة الموارد، والاستثمار في تطوير المهارات النوعية دون استعجال.</p></div>
            <div class="aqm-life-path-copy is-shadow"><h4>فخ الإهدار والتشتت (-)</h4><p>التوسع المالي غير المحسوب، الدخول في صراعات نفوذ، أو استنزاف الدخل في التزامات استعراضية.</p></div>
          </div>
        </section>

        <!-- 5. خط العلاقات والشريك (Love Line) -->
        <section id="sec-love" class="aqm-destiny-section" tabindex="-1">
          <div class="aqm-sec-header">
            <span class="aqm-kicker">القسم 05 · Love Line & Relationships</span>
            <h3>خط العلاقات وشريك الحياة <span class="aqm-destiny-badge">مدخل الحب: ${matrix.channels.love}</span></h3>
          </div>
          <p>يكشف خط الحب عن الصفات النفسية الحقيقية التي يحتاجها قلبك للشعور بالأمان والاكتمال، والتحدي الرئيسي الذي يختبر نضج الشراكة.</p>
          <div class="aqm-pos-grid">
            <article class="aqm-pos-item is-highlight">
              <h5><span>طبيعة شريك الروح المتوافق</span><small>طاقة ${matrix.channels.love}</small></h5>
              <p>${escapeHTML(getArc(matrix.channels.love).positions?.relationship || getArc(matrix.channels.love).archetype)}</p>
            </article>
            <article class="aqm-pos-item">
              <h5><span>نقطة التوازن والكيمياء الحميمية</span><small>طاقة ${matrix.channels.balance}</small></h5>
              <p>تزدهر العلاقة عندما تكون الشراكة قائمة على الصراحة المتبادلة دون ابتزاز عاطفي أو رغبة في السيطرة.</p>
            </article>
          </div>
          <div class="aqm-life-path-columns" style="margin-top:.85rem;">
            <div class="aqm-life-path-copy is-light"><h4>سر استمرار التناغم (+)</h4><p>الاحترام المتبادل للمساحات الفردية، التواصل الهادئ وقت الخلاف، والدعم الصادق لتحقيق أهداف الطرفين.</p></div>
            <div class="aqm-life-path-copy is-shadow"><h4>النمط المهدد للارتباط (-)</h4><p>إسقاط صدمات الماضي على الشريك، الصمت العقابي، أو توقع الكمال المطلق دون قبول الطبيعة البشرية.</p></div>
          </div>
        </section>

        <!-- 6. البرامج الكارمية والآباء والأبناء (Programs & Family) -->
        <section id="sec-programs" class="aqm-destiny-section" tabindex="-1">
          <div class="aqm-sec-header">
            <span class="aqm-kicker">القسم 06 · Programs, Parents & Kids</span>
            <h3>البرامج الكارمية ومربع الأسلاف والأبناء <span class="aqm-destiny-badge">السلالة 45°</span></h3>
          </div>
          <p>يمثل مربع الأجداد الـ DNA الطاقي الممتد عبر الأجيال. التأمل في هذه الخطوط يكشف الأنماط الأسرية الموروثة وما يستحق تحريره لضمان راحة الأبناء:</p>
          <div class="aqm-lineage-grid" style="margin-top:.85rem;">
            ${lineageCard(generations.male, 'is-male')}
            ${lineageCard(generations.female, 'is-female')}
          </div>
          <div class="aqm-pillars" style="margin-top: 1rem;">
            <article class="aqm-card aqm-pillar"><span class="aqm-pillar-number">${axes.soulSearching}</span><h4>البحث الذاتي</h4><p>حاصل دمج السماء والأرض: بوصلتك الداخلية حتى سن الأربعين.</p></article>
            <article class="aqm-card aqm-pillar"><span class="aqm-pillar-number">${axes.socialization}</span><h4>الاندماج الاجتماعي</h4><p>حاصل دمج خطوط الذكور والإناث: أثرك ومكانتك بعد الأربعين.</p></article>
            <article class="aqm-card aqm-pillar"><span class="aqm-pillar-number">${axes.spiritualExam}</span><h4>الامتحان الروحي</h4><p>محصلة المسار الفردي والمجتمعي معاً: نضج الوعي الوجودي.</p></article>
          </div>
          <article class="aqm-card" style="padding:.95rem; margin-top:.85rem;">
            <p style="margin:0; color:#cfd3dd; font-size:.88rem; line-height:1.8;"><b>الوصية التربوية لمصفوفتك:</b> الأبناء يلتقطون ظلال الوالدين غير المعالجة؛ عندما تحرر ذيلك الكارمي، تمنح أبناءك حرية أن يعيشوا قدرهم الخاص دون أن يرثوا عقدك القديمة.</p>
          </article>
        </section>

        <!-- 7. خريطة الشاكرات والصحة (Health Table) -->
        <section id="sec-health" class="aqm-destiny-section" tabindex="-1">
          <div class="aqm-sec-header">
            <span class="aqm-kicker">القسم 07 · Health Table & 7 Chakras</span>
            <h3>خريطة الشاكرات والصحة (Physics / Energy / Emotions)</h3>
          </div>
          <p>توزيع طاقات الأركانا على مراكز الجسم الحيوية السبعة وفق نظام مصفوفة القدر:</p>
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
    `;
  }

  function render(host, dateValue) {
    if (typeof host === 'string' && (typeof dateValue === 'object' || !dateValue)) {
      const t = host;
      host = dateValue || document.createElement('div');
      dateValue = t;
    }
    if (!host) host = document.createElement('div');

    const matrix = calculateDestinyMatrix(dateValue);
    const chakras = calculateChakraHealthCard(dateValue);
    const generations = calculateGenerationalLines(dateValue);
    const axes = calculateDestinyAxes(dateValue);
    const num = matrix.nodes;

    host.innerHTML = `
      <section class="aqm-shell" dir="rtl" aria-label="مصفوفة القدر المرجعية">
        <header class="aqm-header">
          <span class="aqm-kicker">مصفوفة القدر · الهندسة الطاقية · ${escapeHTML(dateValue)}</span>
          <h2>مصفوفة القدر (Destiny Matrix)</h2>
          <p>التقرير القياسي وفق هندسة الأركانا الـ 22 والمحاور المصيرية بنظام matrix-destiny.com المرجعي.</p>
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
              ${renderSVG(matrix, dateValue)}
              <div class="aqm-tooltip" id="aqm-tooltip" role="status" aria-live="polite">اضغط أو مرر على أي دائرة لاستكشاف معناها والانتقال لقسمها.</div>
            </div>
            <div class="aqm-lines">
              <p><b>خط الوفرة والمال:</b> مدخل ${matrix.channels.money} ← المركز ${num.center} ← المادة ${num.south}</p>
              <p><b>خط الحب والشراكات:</b> مدخل ${matrix.channels.love} ← المركز ${num.center} ← التوازن ${matrix.channels.balance}</p>
            </div>
            <p class="aqm-method">${escapeHTML(matrix.formula)}</p>
          </article>

          <div class="aqm-interpretations">
            <article class="aqm-card">
              <span class="aqm-kicker">جوهر الروح · رقم ${num.center}</span>
              <h3>نواة وراحة الروح</h3>
              <div class="aqm-reading">
                <b>${num.center} · ${escapeHTML(ARCANA[num.center-1]?.[0] || '')}</b>
                <p>${escapeHTML(ARCANA[num.center-1]?.[1] || '')}</p>
              </div>
              <div class="aqm-reading is-shadow">
                <b>مساحة التوازن واليقظة</b>
                <p>${escapeHTML(ARCANA[num.center-1]?.[2] || '')}</p>
              </div>
            </article>

            <article class="aqm-card">
              <span class="aqm-kicker">القناع الاجتماعي · رقم ${num.west}</span>
              <h3>طاقة يوم الميلاد والانطباع الأول</h3>
              <div class="aqm-reading">
                <b>${num.west} · ${escapeHTML(ARCANA[num.west-1]?.[0] || '')}</b>
                <p>${escapeHTML(ARCANA[num.west-1]?.[1] || '')}</p>
              </div>
              <div class="aqm-reading is-shadow">
                <b>جانب للتأمل الواعي</b>
                <p>${escapeHTML(ARCANA[num.west-1]?.[2] || '')}</p>
              </div>
            </article>
          </div>
        </div>

        <!-- الأقسام السبعة القياسية لمصفوفة القدر -->
        ${render7DestinySections(matrix, dateValue, chakras, generations, axes)}

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

    // تفعيل أزرار التنقل السريع بين الأقسام السبعة
    const navPills = host.querySelectorAll('.aqm-nav-pill');
    navPills.forEach(pill => {
      pill.addEventListener('click', () => {
        navPills.forEach(p => p.classList.remove('is-active'));
        pill.classList.add('is-active');

        const target = pill.getAttribute('data-target');
        if (target) {
          const targetEl = host.querySelector(target);
          if (targetEl) {
            targetEl.hidden = false;
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            targetEl.focus();
          }
        }
      });
    });

    // تفعيل تفاعل النقر والمرور على دوائر النجمة الثمانية ونقاط العمر مع القفز التلقائي
    const tip = host.querySelector('#aqm-tooltip');
    const allSvgInteractive = host.querySelectorAll('.aqm-node, .aqm-age-node-dot');

    allSvgInteractive.forEach(node => {
      const updateTip = () => {
        const key = node.dataset.node;
        const age = node.dataset.age;
        if (age !== undefined) {
          const energy = node.querySelector('text')?.textContent || '';
          if (tip) tip.textContent = `طاقة سن ${age} سنة · أركانا ${energy}: مرحلة نمو سنوية مهمة في مسار العمر (الامتحان السنوي). اضغط للانتقال للقسم.`;
        } else if (key) {
          const value = num[key] || (key === 'love' ? matrix.channels.love : key === 'money' ? matrix.channels.money : matrix.channels.balance);
          const [positive, shadow] = (ARCANA[value - 1] || []).slice(1);
          const label = labels[key] || (key === 'love' ? 'خط الحب والشراكات' : key === 'money' ? 'خط المال والوفرة' : 'نقطة التوازن');
          if (tip) tip.textContent = `${label} · ${value}: ${positive || ''}. جانب للتأمل: ${shadow || ''}. (اضغط للانتقال للقسم بالتقرير)`;
        }
        allSvgInteractive.forEach(n => n.classList.toggle('is-active', n === node));
      };

      node.addEventListener('mouseenter', updateTip);
      node.addEventListener('focus', updateTip);

      node.addEventListener('click', () => {
        updateTip();
        const targetSel = node.getAttribute('data-target');
        if (!targetSel) return;

        const targetEl = host.querySelector(targetSel);
        if (!targetEl) return;

        targetEl.hidden = false;
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        targetEl.classList.remove('is-highlighted-pulse');
        void targetEl.offsetWidth; // trigger reflow
        targetEl.classList.add('is-highlighted-pulse');
        targetEl.focus();

        const matchPill = host.querySelector(`.aqm-nav-pill[data-target="${targetSel}"]`);
        if (matchPill) {
          host.querySelectorAll('.aqm-nav-pill').forEach(p => p.classList.remove('is-active'));
          matchPill.classList.add('is-active');
        }
      });

      node.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          node.click();
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
      [matrixBtn, 'numbers', 'مصفوفة القدر']
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
