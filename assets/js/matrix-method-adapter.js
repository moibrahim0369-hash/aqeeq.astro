/**
 * Aqeeq Matrix Method Adapter
 * Bridges Destiny Matrix calculations, 22 Arcana canonical interpretations,
 * 7-Chakra energy systems, and Slavic Octagram SVG / Accordion outputs.
 */
(function (root, factory) {
  'use strict';
  const adapter = factory();
  root.AqeeqMatrixMethodAdapter = adapter;
  root.MatrixMethodAdapter = adapter;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = adapter;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // Helper reduction functions
  function reduceArcana(num) {
    let n = Math.abs(parseInt(num, 10)) || 0;
    while (n > 22) {
      n = String(n).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
    }
    return n || 22;
  }

  function reduceLifePath(num) {
    let n = Math.abs(parseInt(num, 10)) || 0;
    while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
      n = String(n).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
    }
    return n;
  }

  function parseDate(dateValue) {
    if (!dateValue) return { day: 1, month: 1, year: 2000, iso: '2000-01-01' };
    if (typeof dateValue === 'object' && dateValue.d && dateValue.m && dateValue.y) {
      return {
        day: dateValue.d,
        month: dateValue.m,
        year: dateValue.y,
        iso: `${dateValue.y}-${String(dateValue.m).padStart(2, '0')}-${String(dateValue.d).padStart(2, '0')}`
      };
    }
    const str = String(dateValue).trim();
    const parts = str.includes('-') ? str.split('-').map(Number) : str.split('/').map(Number);
    if (parts[0] > 1000) {
      return { day: parts[2] || 1, month: parts[1] || 1, year: parts[0], iso: `${parts[0]}-${String(parts[1]||1).padStart(2,'0')}-${String(parts[2]||1).padStart(2,'0')}` };
    }
    return { day: parts[0] || 1, month: parts[1] || 1, year: parts[2] || 2000, iso: `${parts[2]||2000}-${String(parts[1]||1).padStart(2,'0')}-${String(parts[0]||1).padStart(2,'0')}` };
  }

  // Master calculation adapter
  function calculate(dateValue) {
    const numerology = (typeof window !== 'undefined' && window.AqeeqNumerology) || {};
    const parsed = parseDate(dateValue);

    // If AqeeqNumerology is loaded, use its verified engine
    if (typeof numerology.calculateDestinyMatrix === 'function') {
      const matrix = numerology.calculateDestinyMatrix(parsed.iso);
      const chakras = typeof numerology.calculateChakraHealthCard === 'function' ? numerology.calculateChakraHealthCard(parsed.iso) : null;
      const generations = typeof numerology.calculateGenerationalLines === 'function' ? numerology.calculateGenerationalLines(parsed.iso) : null;
      const axes = typeof numerology.calculateDestinyAxes === 'function' ? numerology.calculateDestinyAxes(parsed.iso) : null;
      const lifePath = typeof numerology.calculateLifePath === 'function' ? numerology.calculateLifePath(parsed.iso) : { number: reduceLifePath(parsed.day + parsed.month + parsed.year) };

      return {
        date: parsed.iso,
        day: parsed.day,
        month: parsed.month,
        year: parsed.year,
        matrix,
        nodes: matrix.nodes,
        chakras,
        generations,
        axes,
        lifePath,
        channels: matrix.channels,
        karmicTail: matrix.karmicTail,
        formula: matrix.formula
      };
    }

    // Direct standalone fallback calculations
    const d = parsed.day, m = parsed.month, y = parsed.year;
    const west = reduceArcana(d);
    const north = reduceArcana(m);
    const east = reduceArcana(y);
    const south = reduceArcana(west + north + east);
    const center = reduceArcana(west + north + east + south);

    const northEast = reduceArcana(west + north);
    const southEast = reduceArcana(north + east);
    const southWest = reduceArcana(east + south);
    const northWest = reduceArcana(south + west);

    const nodes = { north, east, south, west, northEast, southEast, southWest, northWest, center };
    const karmicTail = {
      base: south,
      mid: reduceArcana(south + center),
      inner: reduceArcana(reduceArcana(south + center) + south)
    };

    return {
      date: parsed.iso,
      day: d,
      month: m,
      year: y,
      nodes,
      karmicTail,
      channels: {
        money: reduceArcana(east + center),
        love: reduceArcana(south + center),
        balance: reduceArcana(reduceArcana(east + center) + reduceArcana(south + center))
      },
      lifePath: { number: reduceLifePath(d + m + y) }
    };
  }

  // 22 Arcana Quick Reference Dictionary
  const ARCANA_DESCRIPTIONS = {
    1: { name: 'الساحر (The Magician)', element: 'أثير / هواء', energy: 'الإرادة، الابتكار، والقدرة على تحويل الفكرة إلى واقع ملموس.', shadow: 'التلاعب، التردد، وتشتيت الطاقات في مشاريع غير مكتملة.' },
    2: { name: 'الكاهنة العظمى (The High Priestess)', element: 'ماء', energy: 'الحدس العميق، الحكمة الخفية، والتأمل الواعي.', shadow: 'الانعزال، كتمان الأسرار السلبي، والغموض المعطل للعلاقات.' },
    3: { name: 'الإمبراطورة (The Empress)', element: 'أرض', energy: 'الخصوبة، الوفرة الحسية، الرعاية، والجمال الإبداعي.', shadow: 'حب التملك، التبعية المادية، وإهمال الذات في سبيل الآخرين.' },
    4: { name: 'الإمبراطور (The Emperor)', element: 'نار', energy: 'الاستقرار، القيادة المنضبطة، الحماية، وهندسة النجاح.', shadow: 'الاستبداد، التحجر في الرأي، والخوف من فقدان السيطرة.' },
    5: { name: 'الحكيم / الكاهن (The Hierophant)', element: 'أرض', energy: 'التعليم، نقل المعرفة، الاتصال بالتقاليد، والصدق الروحي.', shadow: 'التعصب، رفض التطوير، والتبشير الزائف.' },
    6: { name: 'العشاق (The Lovers)', element: 'هواء', energy: 'الاختيار من القلب، التناغم العاطفي، والجاذبية الاجتماعية.', shadow: 'التردد الحرج، المثالية المفرطة، والخوف من التورط العاطفي.' },
    7: { name: 'العربة (The Chariot)', element: 'ماء / نار', energy: 'الانتصار، التقدم السريع، السيطرة على المتناقضات، ووضوح الوجهة.', shadow: 'التهور، العدوانية، والركض خلف الأهداف دون وعي داخلي.' },
    8: { name: 'العدالة (Justice)', element: 'هواء', energy: 'التوازن الكارمي، النزاهة الفكرية، وفهم قانون السبب والنتيجة.', shadow: 'إطلاق الأحكام القاسية، الشكوى الدائمة، والمطالبة بالكمال.' },
    9: { name: 'الناسك (The Hermit)', element: 'أرض', energy: 'الحكمة الباطنية، البحث عن الحقيقة، والاكتفاء الذاتي الهادئ.', shadow: 'الانقطاع المرضي، التعالي الفكري، والهروب من العالم.' },
    10: { name: 'عجلة الحظ (Wheel of Fortune)', element: 'نار / ماء', energy: 'ركوب أمواج التغيير، الفرص الذهبية، وسلاسة التحول.', shadow: 'الكسل، لوم الظروف والقدر، والتواكل دون سعي.' },
    11: { name: 'القوة (Strength)', element: 'نار', energy: 'الشغف المتزن، ترويض الغرائز باللطف، والقدرة على التحمل.', shadow: 'الاستنزاف الجسدي، العنف المكتوم، والشك في القدرات.' },
    12: { name: 'المعلق (The Hanged Man)', element: 'ماء', energy: 'الرؤية من زاوية جديدة، التضحية الواعية، والإيثار الروحي.', shadow: 'لعب دور الضحية، العجز الوهمي، والتعلق بما لا يفيد.' },
    13: { name: 'التحول (Death / Transformation)', element: 'ماء', energy: 'الموت الرمزي، التخلي الحاسم، والتجدد المستمر للروح.', shadow: 'الخوف من الفراق، التشبث بالماضي المهترئ، والمقاومة العبثية.' },
    14: { name: 'الاعتدال (Temperance)', element: 'نار / ماء', energy: 'الشفاء الداخلي، المزج الخيميائي للمشاعر، والصبر العميق.', shadow: 'التطرف، فقدان الحماس، والملل من الروتين اليومي.' },
    15: { name: 'الظل والجاذبية (The Devil)', element: 'أرض', energy: 'الكاريزما المغناطيسية، كشف الأوهام، والذكاء المالي الخارق.', shadow: 'الإدمان، الهوس بالمادة، والوقوع في فخ التلاعب.' },
    16: { name: 'البرج (The Tower)', element: 'نار', energy: 'تطهير البنى الهشة، الاستيقاظ المفاجئ، وإعادة البناء على الصخر.', shadow: 'الصدمات غير المعالجة، تدمير العلاقات، ومقاومة الزلازل التطورية.' },
    17: { name: 'النجمة (The Star)', element: 'هواء / ماء', energy: 'الأمل العالي، الإلهام الفني، والتواصل مع رسالة الروح السامية.', shadow: 'الانفصال عن الواقع، العيش في الأحلام دون عمل، واليأس المفاجئ.' },
    18: { name: 'القمر (The Moon)', element: 'ماء', energy: 'الحدس الخارق، الغوص في اللاوعي، والموهبة السيكولوجية.', shadow: 'المخاوف والأوهام، الوسواس، والضياع في الضباب العاطفي.' },
    19: { name: 'الشمس (The Sun)', element: 'نار', energy: 'الفرح الطفولي، الإشعاع الإيجابي، القيادة الملهمة، والنجاح.', shadow: 'الأنانية، الغرور الأجوف، والحرق النفسي للذات والآخرين.' },
    20: { name: 'النداء / الحساب (Judgement)', element: 'نار / ماء', energy: 'الصحوة الروحية، شفاء شجرة العائلة والكارما السلالية.', shadow: 'التمسك بالخلافات العائلية، الخوف من الخطوة التالية، والجمود.' },
    21: { name: 'العالم (The World)', element: 'أثير / أرض', energy: 'الاكتمال، التحرر الكوني، الانفتاح العالمي، والاحتفال بالرحلة.', shadow: 'الحدود المصطنعة، الخوف من السفر أو التوسع، والنقص الوهمي.' },
    22: { name: 'الأحمق / الروح الحرة (The Fool)', element: 'أثير / هواء', energy: 'البدايات النقية، الحرية المطلقة، والثقة التامة في مسار الكون.', shadow: 'الطيش، الهروب من المسؤولية، وتكرار نفس الأخطاء بسذاجة.' }
  };

  function getArcana(num) {
    const n = reduceArcana(num);
    return ARCANA_DESCRIPTIONS[n] || { name: 'أركانا ' + n, energy: 'طاقة فلكية ورمزية', shadow: 'مساحة للتوازن' };
  }

  // UI Bridge & Accordion Output Resolver
  function renderAccordionSection(sectionId, data, targetContainer) {
    if (!targetContainer) return '';
    const sectionData = data || {};
    const html = `
      <div class="aqm-accordion-item" id="${sectionId}">
        <button type="button" class="aqm-accordion-header" aria-expanded="true">
          <span>${sectionData.title || 'قسم تحليلي'}</span>
          <span class="aqm-accordion-icon">−</span>
        </button>
        <div class="aqm-accordion-body">
          <p>${sectionData.content || ''}</p>
        </div>
      </div>
    `;
    targetContainer.innerHTML += html;
    return html;
  }

  const adapterApi = {
    calculate,
    reduceArcana,
    reduceLifePath,
    parseDate,
    getArcana,
    renderAccordionSection,
    isLoaded: true
  };

  return adapterApi;
});
