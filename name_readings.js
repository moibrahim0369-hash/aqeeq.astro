/* Aqeq Astro · Name Reading Cards
   Loads name_data.json, calculates three name numbers, and renders all 9 reading cards.
   GitHub Pages friendly: no server-side code required.
*/
(function (root) {
  "use strict";

  let dataPromise;
  function loadData() {
    if (!dataPromise) {
      dataPromise = fetch(new URL("name_data.json", window.location.href).href, {
        cache: "no-cache"
      }).then(function (response) {
        if (!response.ok) throw new Error("تعذر تحميل name_data.json (" + response.status + ")");
        return response.json();
      }).then(function (json) {
        if (!json || !json.groups) throw new Error("تنسيق ملف قراءات الاسم غير صحيح.");
        return json;
      });
    }
    return dataPromise;
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function contentToHTML(value) {
    const text = String(value || "").replace(/\r\n?/g, "\n").trim();
    if (!text) return "";
    return text.split(/\n{2,}/).map(function (block) {
      const lines = block.split("\n");
      if (lines.every(function (line) { return /^\s*[•●▪◦*-]\s+/.test(line); })) {
        return "<ul>" + lines.map(function (line) {
          return "<li>" + escapeHTML(line.replace(/^\s*[•●▪◦*-]\s+/, "")) + "</li>";
        }).join("") + "</ul>";
      }
      return "<p>" + lines.map(escapeHTML).join("<br>") + "</p>";
    }).join("");
  }

  const GROUPS = [
    { key: "soul_urge", calcKey: "soulUrge", label: "رغبة الروح", sub: "إيه اللي بيحرّكك من جوا" },
    { key: "personality", calcKey: "personality", label: "الشخصية الظاهرة", sub: "الانطباع اللي بتسيبه عند الناس" },
    { key: "expression", calcKey: "expression", label: "التعبير والقدر", sub: "مواهبك وطريقتك في تحويلها لفعل" }
  ];


  // Compact, reflective interpretations for the three complementary numerology outputs.
  const EXTRA_READINGS = Object.freeze({
    personalYear: {
      1: { title: "بداية جديدة", energy: "سنة انطلاقة واستقلال؛ طاقة مناسبة لتحديد اتجاه جديد وبناء هوية أو مشروع.", opportunities: "ابدأ خطوة مؤجلة، بادر، وجرّب طريقًا يناسبك بدل انتظار الإذن.", avoid: "تجنب التسرع والأنانية وفتح جبهات كثيرة في وقت واحد." },
      2: { title: "الصبر والشراكة", energy: "سنة تعاون وحساسية أعلى؛ التقدم فيها غالبًا هادئ ويتكوّن بالتدريج.", opportunities: "قوِّ علاقة مهمة، تفاوض، اسمع جيدًا، واشتغل على التفاصيل التي تحتاج وقتًا.", avoid: "تجنب الاستعجال وقراءة كل تأخير باعتباره رفضًا أو فشلًا." },
      3: { title: "التعبير والانتشار", energy: "سنة إبداع وتواصل وظهور؛ الأفكار تحتاج صوتًا ومساحة للتجربة.", opportunities: "اكتب، اتكلم، تعلّم، انشر، ووسّع دائرة علاقاتك بطريقة أصيلة.", avoid: "تجنب التشتت والوعود الكثيرة وإنفاق الطاقة على الانطباع بدل الإنجاز." },
      4: { title: "البناء والتنظيم", energy: "سنة تأسيس وانضباط؛ المكاسب تأتي من نظام ثابت وخطوات قابلة للقياس.", opportunities: "رتّب المال والوقت، ابنِ مهارة، وثبّت أساس مشروع أو عادة طويلة المدى.", avoid: "تجنب الجمود والإرهاق ومحاولة التحكم في كل تفصيلة." },
      5: { title: "التغيير والمرونة", energy: "سنة حركة وتجارب وتبدّل؛ تحتاج مرونة مع الحفاظ على بوصلة واضحة.", opportunities: "استكشف فرصة جديدة، طوّر مهارة، وسّع خبرتك وجرّب أسلوبًا مختلفًا.", avoid: "تجنب القرارات الاندفاعية والهروب من الالتزامات لمجرد الملل." },
      6: { title: "المسؤولية والانسجام", energy: "سنة اهتمام بالبيت والعلاقات والالتزامات؛ التوازن بين الرعاية والذات أساسي.", opportunities: "أصلح علاقة، حسّن بيئتك، واهتم بما يحتاج رعاية مستمرة.", avoid: "تجنب لعب دور المنقذ وتحمل مسؤوليات الآخرين على حساب نفسك." },
      7: { title: "المراجعة والعمق", energy: "سنة تأمل وتعلّم ومراجعة داخلية؛ ليست كل خطوة مفيدة لازم تكون سريعة أو ظاهرة.", opportunities: "ادرس، ابحث، راجع قراراتك، وامنح نفسك وقتًا لفهم ما تريده فعلًا.", avoid: "تجنب العزلة الكاملة والشك المفرط وتأجيل الحياة انتظارًا لليقين." },
      8: { title: "الإنجاز والإدارة", energy: "سنة طموح ونتائج ومسؤولية مادية؛ تحتاج إدارة عادلة وواقعية للموارد.", opportunities: "فاوض، نظّم ميزانيتك، طوّر مشروعًا، واطلب مقابلًا مناسبًا لعملك.", avoid: "تجنب صراع السيطرة والمخاطرة المالية غير المحسوبة وربط قيمتك بالإنجاز وحده." },
      9: { title: "الإكمال والتحرير", energy: "سنة حصاد وإغلاق دورات قديمة وإفساح مساحة لما هو قادم.", opportunities: "أنهِ مشروعًا، سامح دون إنكار الأذى، وتخلّص من التزامات لم تعد مناسبة.", avoid: "تجنب التعلق بما انتهى أو اتخاذ قرارات مصيرية بدافع لحظة عاطفية." }
    },
    birthday: {
      1: { title: "المبادرة", skill: "موهبتك الفطرية هي بدء الحركة واتخاذ القرار وصناعة طريقك الخاص.", practice: "نمِّ مهارة القيادة مع تعلّم الاستماع وتقبّل المساعدة." },
      2: { title: "الالتقاط والتعاون", skill: "موهبتك هي قراءة الأجواء، ملاحظة الفروق الدقيقة، وبناء الجسور بين الناس.", practice: "حوّل حساسيتك إلى تواصل واضح بدل كتمان احتياجاتك." },
      3: { title: "التعبير والإبداع", skill: "موهبتك هي تحويل الأفكار والمشاعر إلى كلام أو فن أو حضور اجتماعي.", practice: "درّب موهبتك على الاستمرارية، لا على الإلهام وحده." },
      4: { title: "التنظيم والإتقان", skill: "موهبتك هي ترتيب الفوضى، بناء الأنظمة، وملاحظة ما يحتاج إلى إصلاح.", practice: "وازن بين الدقة والمرونة ولا تجعل الكمال يمنع البداية." },
      5: { title: "التكيّف والاستكشاف", skill: "موهبتك هي سرعة التعلّم والتأقلم وربط خبرات وأفكار متنوعة.", practice: "وجّه فضولك إلى مشروع تكمله بدل القفز بين البدايات." },
      6: { title: "الرعاية والذوق", skill: "موهبتك هي دعم الآخرين، خلق الانسجام، والإحساس بما يجعل المكان أو العلاقة أدفأ.", practice: "قدّم الرعاية بحدود واضحة ولا تخلط الحب بالتضحية المستمرة." },
      7: { title: "البحث والتحليل", skill: "موهبتك هي السؤال العميق، اكتشاف الأنماط، والتفكير المستقل.", practice: "شارك ما تتعلمه ولا تنتظر معرفة كاملة قبل التحرك." },
      8: { title: "الإدارة والتنفيذ", skill: "موهبتك هي تنظيم الموارد، تحمّل المسؤولية، وتحويل الهدف إلى نتيجة ملموسة.", practice: "استخدم نفوذك بعدل واعتبر التعاون قوة لا تهديدًا." },
      9: { title: "الرؤية والإنسانية", skill: "موهبتك هي رؤية الصورة الكبيرة والتعاطف وربط التجربة بمعنى أوسع.", practice: "ساعد بوعي، مع التمييز بين التعاطف وتحمل ما ليس مسؤوليتك." },
      11: { title: "الإلهام والحدس", skill: "في القراءة الرمزية للأرقام الرئيسية، يشير 11 إلى التقاط الأفكار والإلهام والحساسية للمعنى.", practice: "حوّل الإلهام إلى خطوات واقعية، وراجع انطباعاتك بدل اعتبارها حقائق مؤكدة." },
      22: { title: "البناء واسع النطاق", skill: "يشير 22 إلى الجمع بين الرؤية العملية والتنظيم والقدرة على تحويل فكرة كبيرة إلى خطة.", practice: "قسّم الهدف الكبير إلى مراحل، واطلب دعمًا مناسبًا بدل حمل كل شيء وحدك." }
    },
    maturity: {
      1: { title: "استقلال وقيادة", mature: "مع النضج، يزيد تركيزك على الاستقلال والمبادرة وصنع قرارك بنفسك.", balance: "القيادة الأثبت تجمع الحسم مع الإصغاء والتعاون." },
      2: { title: "شراكة واتزان", mature: "مع النضج، تتقدم مهارة التعاون والدبلوماسية وبناء علاقات متوازنة.", balance: "لا تجعل السلام الظاهري أهم من التعبير الصريح عن احتياجاتك." },
      3: { title: "صوت وإبداع", mature: "مع النضج، قد يصبح التعبير والإبداع والتعليم أو التواصل مساحة أكبر في حياتك.", balance: "امنح موهبتك نظامًا يساعدها على الاكتمال." },
      4: { title: "أساس واستمرارية", mature: "مع النضج، تبرز قيمة البناء طويل المدى والمسؤولية والمهارة المتقنة.", balance: "اترك مكانًا للتجديد حتى لا يتحول الاستقرار إلى جمود." },
      5: { title: "حرية وتجربة", mature: "مع النضج، تتعلم أن تصنع حرية واعية عبر التجربة والتغيير وتوسيع الخبرة.", balance: "اختر التغيير الذي يخدم اتجاهك، لا التغيير لمجرد الهروب." },
      6: { title: "رعاية ومسؤولية", mature: "مع النضج، قد تتقدم موضوعات الأسرة والخدمة والجمال وبناء بيئة آمنة.", balance: "المسؤولية الصحية لا تعني أن تحمل كل شيء عن الجميع." },
      7: { title: "حكمة وفهم", mature: "مع النضج، يتعمق البحث والتأمل والاستقلال الفكري وفهم دوافعك.", balance: "اجمع بين التفكير والخبرة الحية، وابقَ متصلًا بالناس." },
      8: { title: "إدارة وأثر", mature: "مع النضج، تتقدم الإدارة والإنجاز وتنظيم الموارد وصناعة أثر ملموس.", balance: "قِس النجاح بما تبنيه وبطريقة بنائه، لا بالمكانة وحدها." },
      9: { title: "معنى وخدمة", mature: "مع النضج، تتوسع الرؤية الإنسانية والرغبة في إكمال الدورات ومشاركة الخبرة.", balance: "ساعد من موقع الاختيار والحدود، لا من الشعور بالذنب." },
      11: { title: "إلهام واعٍ", mature: "يشير 11 رمزيًا إلى نضج الحس الإلهامي والقدرة على نقل فكرة ملهمة للآخرين.", balance: "ثبّت رؤيتك بالتعلم والحقائق والعمل اليومي." },
      22: { title: "رؤية تتحول إلى واقع", mature: "يشير 22 رمزيًا إلى نضج القدرة على تحويل رؤية كبيرة إلى بناء عملي يستمر.", balance: "ابدأ بما تقدر عليه، ووزّع المسؤولية على فريق." },
      33: { title: "تعاطف ومسؤولية", mature: "يشير 33 رمزيًا إلى نضج الرعاية والتعليم وخدمة الآخرين بوعي.", balance: "لا تجعل خدمة الناس تلغي احتياجاتك وحدودك الشخصية." }
    }
  });

  function reduceNumber(value, preserveMaster) {
    let n = Math.abs(Math.trunc(Number(value)));
    if (!Number.isFinite(n) || n === 0) return 0;
    while (n > 9) {
      if (preserveMaster && (n === 11 || n === 22 || n === 33)) return n;
      n = String(n).split("").reduce(function (sum, digit) { return sum + Number(digit); }, 0);
    }
    return n;
  }

  function calculatePersonalYear(day, month, year) {
    const targetYear = Number(year == null ? new Date().getFullYear() : year);
    const sum = Number(day) + Number(month) + String(targetYear).split("").reduce(function (a, digit) { return a + Number(digit); }, 0);
    return { value: reduceNumber(sum, false), rawTotal: sum, year: targetYear };
  }

  function calculateBirthdayNumber(day) {
    const raw = Number(day);
    if (!Number.isInteger(raw) || raw < 1 || raw > 31) throw new RangeError("يوم الميلاد لازم يكون من 1 إلى 31.");
    return { value: reduceNumber(raw, true), rawTotal: raw };
  }

  function calculateMaturityNumber(lifePathNumber, expressionNumber) {
    const raw = Number(lifePathNumber) + Number(expressionNumber);
    return { value: reduceNumber(raw, true), rawTotal: raw };
  }

  // Expanded editorial layer: deeper skill and maturity readings, kept separate
  // from the concise labels above so each number can grow without changing calculations.
  const EXTRA_DEEP_READINGS = Object.freeze({
    birthday: {
      1: { essence: "موهبتك الأساسية هي المبادرة: تقدر تلاحظ إن في حاجة لازم تبدأ، وتتحرك قبل ما الطريق يبقى مضمون بالكامل. قوتك مش مجرد حب القيادة، لكن تحويل الفكرة إلى أول خطوة واضحة وتحمل مسؤولية اختيارك.", shadow: "الظل يظهر لما تتحول المبادرة إلى استعجال أو لما تعتبر طلب المساعدة انتقاصًا من استقلالك. ممكن تبدأ بقوة ثم ترفض الملاحظات، أو تدخل في منافسة غير ضرورية عشان تثبت إنك قادر.", growth: "درّب نفسك على قيادة مشروع صغير من البداية للنهاية، مع سؤال شخص تثق فيه عن نقطة واحدة تحتاج تحسينًا. قبل أي قرار مهم، اكتب الهدف والمخاطرة وخطة الرجوع، وميّز بين الجرأة والرغبة في إثبات الذات.", reflection: "إيه الحاجة اللي تقدر تبدأها بإيدك، وإيه الجزء اللي محتاج تتعلم فيه التعاون بدل ما تشيله وحدك؟" },
      2: { essence: "موهبتك هي التقاط الفروق الدقيقة وبناء الجسور بين الناس. تلاحظ النبرة والتوقيت وما لم يُقل، وتقدر تساعد طرفين مختلفين يلاقوا لغة مشتركة من غير ما يتحول الخلاف لمعركة.", shadow: "حساسيتك ممكن تتحول إلى مراقبة زائدة لردود فعل الآخرين، أو إلى تنازل مستمر خوفًا من الرفض. أحيانًا تفهم احتياجات الناس بسرعة لكن تتأخر في قول احتياجاتك أنت.", growth: "مارس الإصغاء ثم لخّص ما فهمته قبل تقديم الحل. وفي المقابل، عبّر عن رأيك بوضوح بجملة تبدأ بـ«أنا محتاج» أو «أنا مش مناسب ليّ». التعاون لا يعني أنك مسؤول عن مشاعر الجميع.", reflection: "فين قدرتك على تهدئة الأمور بتساعدك، وفين بتخليك تخفي رأيك الحقيقي؟" },
      3: { essence: "موهبتك هي تحويل الأفكار والمشاعر إلى كلام وصورة وحضور. عندك قابلية لشرح المعقد بطريقة قريبة، وصناعة معنى يعلق في ذهن الناس، سواء عبر الكتابة أو الحديث أو الفن أو المحتوى.", shadow: "الظل هو الاعتماد على الحماس بدل الاستمرارية، أو استخدام الدعابة والكلام الكثير لتجنب شعور أصعب. ممكن تبدأ مشاريع إبداعية عديدة وتتركها عندما يختفي بريق البداية.", growth: "اختار وسيلة تعبير واحدة لمدة شهر، وحدد مخرجًا أسبوعيًا صغيرًا: نص أو تسجيل أو تصميم. راجع ما يصل للناس فعلًا بدل قياس موهبتك برد فعل لحظي، واسمح لنفسك بالتعبير الصادق لا الأداء المستمر.", reflection: "إيه الفكرة اللي جواك وتستحق تخرج للنور حتى لو مش كل الناس هتفهمها من أول مرة؟" },
      4: { essence: "موهبتك هي تنظيم الفوضى وتحويل النوايا إلى خطوات قابلة للتكرار. تلاحظ الثغرات، وتحب أن يكون للعمل أساس واضح ومعيار جودة، وده يخليك مناسبًا للبناء والتخطيط والمتابعة.", shadow: "لما يزيد القلق، ممكن تتمسك بالطريقة المألوفة حتى لو لم تعد مناسبة، أو تؤجل البداية لأنك تريد نظامًا كاملًا من أول يوم. الدقة تتحول وقتها إلى صرامة مع نفسك والآخرين.", growth: "ابنِ نظامًا بسيطًا يمكن الاستمرار عليه، ثم حسّنه تدريجيًا بدل انتظار الكمال. حدد ما يجب أن يكون دقيقًا فعلًا وما يمكن تجربته، وضع وقتًا للمراجعة ووقتًا للراحة.", reflection: "إيه النظام اللي بيسند حياتك، وإيه النظام اللي بقيت خادمًا له بدل ما يخدمك؟" },
      5: { essence: "موهبتك هي التكيّف والتعلّم من التجربة وربط أفكار من مجالات مختلفة. غالبًا تلتقط الفرص عندما يتغير المشهد، وتعرف تتحرك بين الناس أو المهام من غير ما تفقد فضولك.", shadow: "الظل يظهر في التشتت أو مطاردة التجديد لمجرد الهروب من الملل. قد تخلط بين الحرية وغياب الالتزام، فتترك شيئًا مفيدًا قبل أن تظهر ثماره.", growth: "اختر مجالًا رئيسيًا تتعمق فيه، واترك مساحة محددة للتجارب الجديدة. قبل الانسحاب من التزام، اسأل نفسك: هل انتهى دوره فعلًا أم أنني وصلت فقط إلى الجزء الذي يحتاج صبرًا؟", reflection: "إيه التغيير اللي هيوسع حياتك فعلًا، وإيه التغيير اللي بتستخدمه للهروب من خطوة صعبة؟" },
      6: { essence: "موهبتك هي الرعاية وصناعة الانسجام والانتباه لما يجعل الناس أو المكان يشعرون بالأمان. قد تظهر في التعليم أو التصميم أو الدعم أو تنظيم الحياة اليومية، حيث تجمع بين الذوق والمسؤولية.", shadow: "الرعاية قد تنقلب إلى إنقاذ وسيطرة ناعمة، أو إلى عطاء زائد يجعلك تنتظر التقدير ثم تشعر بالخذلان. ليس كل احتياج حولك مسؤوليتك، وليس كل اختلاف علامة على فشل العلاقة.", growth: "اسأل قبل المساعدة: هل الشخص يريد نصيحة أم حضورًا فقط؟ خصص وقتًا لاحتياجاتك مثلما تخصصه للآخرين، وتعلم تقديم الدعم مع حدود واضحة واتفاقات متبادلة.", reflection: "إزاي تقدر تهتم بحد من غير ما تتحمل عنه مسؤولية اختياراته؟" },
      7: { essence: "موهبتك هي البحث والتحليل وملاحظة الأنماط خلف التفاصيل. تميل إلى السؤال عن السبب، واختبار التفسيرات، والتعلم المستقل، وقد تتألق في البحث أو الاستراتيجية أو الكتابة المتخصصة أو حل المشكلات.", shadow: "قد يتحول التفكير إلى اجترار، والخصوصية إلى عزلة، والمعايير العالية إلى تأجيل دائم للمشاركة. أحيانًا تنتظر يقينًا كاملًا لا يتوفر قبل التجربة.", growth: "حوّل كل سؤال كبير إلى فرضية صغيرة واختبار عملي. شارك ما تعلمته قبل أن تشعر أنك خبير في كل شيء، ووازن وقت التفكير بتجربة واقعية وحديث مع شخص تثق به.", reflection: "إيه السؤال اللي يستحق بحثًا أعمق، وإيه الإجابة اللي لن تظهر إلا لما تجرب؟" },
      8: { essence: "موهبتك هي تنظيم الموارد وتحويل الأهداف إلى نتائج ملموسة. عندك قابلية للتفكير في الأولويات والمسؤولية والميزانية والتأثير، ويمكن أن تظهر الموهبة في الإدارة أو ريادة الأعمال أو قيادة مشروع.", shadow: "قد تربط قيمتك بالإنجاز، أو تحاول التحكم في كل التفاصيل لأنك تخشى أن يفسدها الآخرون. عندها تتحول الكفاءة إلى ضغط، وتصبح الراحة أو طلب الدعم أمرًا تشعر بالذنب تجاهه.", growth: "حدد نتيجة قابلة للقياس، ثم وزّع المسؤوليات بوضوح بدل احتكارها. راجع نجاحك بمعيارين: ما الذي أنجزته، وكيف عاملت نفسك والناس أثناء إنجازه؟", reflection: "إيه النتيجة اللي تريد تحقيقها، وإيه الثمن اللي لم تعد مستعدًا تدفعه من صحتك أو علاقاتك؟" },
      9: { essence: "موهبتك هي رؤية الصورة الكبيرة وربط التجربة بمعنى إنساني أوسع. قد تلتقط ما يجمع الناس رغم اختلافهم، وتترجم الخبرة إلى فن أو تعليم أو خدمة أو رسالة ذات أثر.", shadow: "التعاطف قد يجعلك تحمل آلامًا ليست مسؤوليتك، أو تتمسك بدور المنقذ. وقد ترفع توقعاتك من الناس ثم تصاب بخيبة عندما لا يتصرفون وفق الصورة المثالية التي رسمتها.", growth: "اختر قضية أو مشروعًا تستطيع خدمته بحدود واضحة. تعاطف من غير أن تلغي احتياجاتك، واسمح للآخرين بتحمل مسؤولية قراراتهم حتى لو كنت قادرًا على التدخل.", reflection: "إيه الأثر اللي تريد تركه، وإزاي تحققه من غير ما تفقد نفسك في الطريق؟" },
      11: { essence: "في القراءة الرمزية للرقم الرئيسي 11، ترتبط الموهبة بالإلهام والتقاط الروابط والمعاني التي قد لا يلاحظها الآخرون سريعًا. يمكن أن تظهر في الإبداع أو الإرشاد أو نقل فكرة تفتح زاوية جديدة للتفكير.", shadow: "كثرة الانطباعات قد تتحول إلى توتر أو مبالغة في تفسير المصادفات، أو إلى انتظار لحظة إلهام مثالية. الحدس إحساس يستحق الإصغاء، لكنه ليس دليلًا كافيًا وحده على صحة الاستنتاج.", growth: "دوّن الفكرة ثم اختبرها بالمعلومات والخبرة والحوار. ثبّت الإلهام بروتين عملي، واعتنِ بالنوم والهدوء والحدود الرقمية عندما تشعر بكثرة التحفيز.", reflection: "إيه الإلهام اللي يستحق أن تحوله إلى عمل ملموس، وما الدليل الذي تحتاجه قبل أن تبني عليه قرارًا؟" },
      22: { essence: "يرمز 22 إلى جمع الرؤية الواسعة مع القدرة على البناء العملي. موهبتك المحتملة هي تقسيم فكرة كبيرة إلى مراحل وموارد وأدوار، ثم إنشاء شيء يمكن للآخرين استخدامه والاستمرار فيه.", shadow: "قد يصبح حجم الرؤية عبئًا يجعلك تؤجل البداية، أو تحمل كل المسؤوليات لأنك ترى الصورة كاملة ولا تثق بأن غيرك سيفهمها. الطموح الكبير من غير مراحل واضحة يتحول إلى ضغط دائم.", growth: "قسّم المشروع إلى نسخة أولى صغيرة، واكتب ما يلزم لكل مرحلة ومن المسؤول عنها. قِس التقدم بما اكتمل، لا بحجم الصورة المثالية التي لم تصل إليها بعد، واطلب مساعدة متخصصة عند الحاجة.", reflection: "إيه النسخة الصغيرة الواقعية من رؤيتك الكبيرة التي تستطيع إنجازها خلال الشهر القادم؟" },
      33: { essence: "في القراءة الرمزية للرقم الرئيسي 33، تبرز موهبة الرعاية والتعليم وتحويل الخبرة إلى دعم نافع للآخرين. قد تجمع بين التعاطف والقدرة على شرح ما تعلمته بطريقة تمنح الناس مساحة للنمو.", shadow: "قد تشعر أنك مطالب بإنقاذ الجميع أو أن قيمتك تأتي من التضحية. ومع الوقت، يمكن أن يتحول العطاء إلى إنهاك أو استياء صامت إذا لم تكن هناك حدود وتبادلية.", growth: "ساعد من موقع الاختيار لا الشعور بالواجب الدائم. حدد وقتًا وموارد واضحة للعطاء، واسمح لنفسك بتلقي الدعم، وتذكر أن تمكين الشخص أفضل من اتخاذ حياته نيابة عنه.", reflection: "إزاي تقدر تخدم غيرك بطريقة مستدامة، من غير ما تجعل التضحية شرطًا لقيمتك؟" }
    },
    maturity: {
      1: { essence: "مرحلة النضج هنا ترمز إلى تقوية الاستقلال وصنع القرار وإطلاق مبادرات تحمل بصمتك. يصبح السؤال أقل ارتباطًا بإرضاء التوقعات وأكثر ارتباطًا بما تريد أن تبنيه باسمك.", shadow: "الخطر هو تحويل الاستقلال إلى عزلة، أو اعتبار التراجع عن رأي علامة ضعف. القيادة الناضجة لا تعني أن تفعل كل شيء وحدك.", practice: "اختر قرارًا مؤجلًا، وحدد له معيار نجاح وخطوة أولى وموعد مراجعة. استمع إلى الرأي المخالف قبل الحسم، ثم تحمل مسؤولية اختيارك.", reflection: "ما القرار الذي يحتاج منك شجاعة هادئة لا معركة لإثبات الذات؟" },
      2: { essence: "يميل النضج إلى تعميق مهارة الشراكة والإنصات وبناء علاقات فيها أخذ وعطاء. تتعلم أن التأثير لا يحتاج دائمًا إلى قيادة ظاهرة، وأن التعاون قد يفتح أبوابًا لا يفتحها الجهد الفردي.", shadow: "قد تخلط السلام بالتنازل، أو تجعل قبول الآخرين مقياسًا لقيمتك. العلاقات المتوازنة تحتاج اختلافًا صريحًا، لا موافقة دائمة.", practice: "تدرّب على محادثة صادقة في موضوع تؤجله، وعبّر عن احتياجك وحدودك بوضوح. قيّم العلاقات من خلال التبادل والاحترام، لا من خلال مقدار ما تتحمله وحدك.", reflection: "أي علاقة تحتاج إلى توازن أو وضوح أكثر في هذه المرحلة؟" },
      3: { essence: "قد يتسع دور التعبير والإبداع والتعليم والتواصل. تصبح الخبرة التي جمعتها مادة يمكن مشاركتها، ويكون صوتك أكثر نضجًا عندما يجمع بين الحيوية والصدق والقدرة على الإصغاء.", shadow: "التشتت أو الاعتماد على إعجاب الجمهور قد يحرف التعبير عن معناه. ليس كل ظهور تقدمًا، وليس كل صمت اختفاءً.", practice: "اختر مشروعًا إبداعيًا واحدًا يعبّر عنك، وحدد إيقاعًا واقعيًا لنشره أو تطويره. اطلب ملاحظات محددة، واحتفظ بمساحة خاصة لا تتحول فيها كل تجربة إلى محتوى.", reflection: "ما الرسالة التي تريد أن يصل صوتك من خلالها، حتى لو لم تجذب الجميع؟" },
      4: { essence: "يرمز النضج إلى بناء أساس مستقر ومهارة متقنة ونظام يدوم. تصبح قيمة الصبر والتخطيط أوضح، خصوصًا عندما تحوّل الخبرة إلى عمل منظم أو بيت أو مشروع أو معرفة قابلة للنقل.", shadow: "قد تتحول المسؤولية إلى جمود، وتصبح السلامة ذريعة لرفض كل تجديد. الاستقرار المفيد يوفّر أرضًا للحياة، ولا يحبسها.", practice: "راجع التزاماتك: ما الذي يحتاج استمرارًا، وما الذي يحتاج تبسيطًا أو تفويضًا؟ ضع خطة طويلة المدى مع مساحة للتجربة والراحة.", reflection: "ما الأساس الذي تريد أن يبقى، وما العادة التي حان وقت تحديثها؟" },
      5: { essence: "قد تصبح المرونة وتوسيع الخبرة والتغيير الواعي محاور أكبر. النضج هنا لا يعني الحركة المستمرة، بل اختيار التجارب التي توسع حياتك دون أن تشتت اتجاهك.", shadow: "الخطر هو التغيير لمجرد الهروب من الملل أو الالتزام، أو العكس: التعلق بالحرية لدرجة فقدان أي أساس ثابت.", practice: "قبل تغيير كبير، اكتب ما تريد الاقتراب منه وما تريد الابتعاد عنه، ثم جرّب خطوة محدودة قبل اتخاذ قرار نهائي. احتفظ بعادة واحدة تمنحك الاستقرار.", reflection: "هل التغيير الذي تفكر فيه يقربك من قيمة مهمة أم يبعدك عن شعور لا تريد مواجهته؟" },
      6: { essence: "قد تتقدم موضوعات الرعاية والأسرة والجمال والمسؤولية الاجتماعية. يصبح النضج في القدرة على خلق بيئة آمنة، مع فهم أن الحب ليس إدارة حياة الآخرين ولا حمل كل الأعباء عنهم.", shadow: "المثالية والتدخل الزائد قد يرهقانك ويربكان من تحب. وقد تؤجل احتياجاتك الخاصة لأنك تعتقد أن الجميع يعتمد عليك.", practice: "اتفق مع المقربين على مسؤوليات واضحة، واطلب الدعم كما تقدمه. خصص وقتًا لنفسك لا يحتاج إلى تبرير، وتقبل أن العلاقات الجيدة لا تخلو من النقص والاختلاف.", reflection: "ما المسؤولية التي تخصك فعلًا، وما الذي تستطيع مشاركته أو تركه للآخر؟" },
      7: { essence: "يرمز النضج إلى تعميق الفهم والاستقلال الفكري والقدرة على التمييز بين المعلومة والانطباع. قد تنجذب إلى البحث والتعليم والكتابة أو مجالات تتطلب صبرًا على الأسئلة المركبة.", shadow: "قد تنسحب من الحياة طلبًا لليقين، أو تتحول المراجعة إلى شك لا ينتهي. المعرفة التي لا تُختبر قد تبقى فكرة جميلة بلا أثر.", practice: "خصص وقتًا للدراسة وآخر لتطبيق ما تعلمته. شارك نتائجك مع أشخاص يختلفون معك، وحدد ما تعرفه وما لا تعرفه بوضوح.", reflection: "ما الفكرة التي تحتاج إلى اختبار في الواقع بدل التفكير فيها مرة أخرى؟" },
      8: { essence: "قد يتقدم دور الإدارة والإنجاز وتنظيم الموارد وصناعة أثر ملموس. النضج هنا هو استخدام الخبرة والسلطة بمسؤولية، وبناء أنظمة وفرق قادرة على النجاح من دون اعتماد كامل على شخص واحد.", shadow: "قد يصبح العمل هو الهوية الوحيدة، أو تتحول الرغبة في الأمان إلى سيطرة مفرطة ومخاطرات غير محسوبة. المكانة لا تعوّض الصحة أو العلاقات.", practice: "راجع أهدافك المالية والمهنية بالأرقام الواقعية، وفوّض مهمة واحدة بوضوح. اجعل للراحة والعلاقات مكانًا ثابتًا في جدولك، وقِس نجاحك أيضًا بجودة الطريق لا بحجم النتيجة وحدها.", reflection: "كيف تستخدم خبرتك وقوتك لبناء شيء نافع من غير أن تدفع صحتك أو علاقاتك الثمن؟" },
      9: { essence: "قد تتسع الرؤية الإنسانية والرغبة في إكمال الدورات ومشاركة الخبرة. يصبح المعنى والأثر أكثر أهمية، سواء عبر الإبداع أو التعليم أو خدمة قضية أو إغلاق فصل قديم بوعي.", shadow: "قد تتمسك بالماضي بدافع الذنب، أو تتوقع من نفسك أن تكون متسامحًا دائمًا. إكمال دورة لا يعني إنكار الأذى أو إعادة فتح باب لا يناسبك.", practice: "حدد ما يحتاج إلى إكمال وما يحتاج إلى وداع، واكتب ما تعلمته من كل تجربة. ساعد ضمن حدودك، واترك مساحة لاحتياجاتك وخططك الشخصية.", reflection: "ما الذي يستحق أن تأخذه معك، وما الذي حان وقت تركه خلفك؟" },
      11: { essence: "يرمز 11 إلى نضج الإلهام والقدرة على نقل رؤية أو معنى للآخرين. تصبح الحساسية أكثر فائدة عندما تقترن بالخبرة والوضوح والقدرة على تحويل الفكرة إلى لغة مفهومة.", shadow: "قد تتضخم التوقعات أو تشعر بأن عليك تقديم إجابات استثنائية طوال الوقت. الإلهام لا يلغي الحاجة إلى التحقق والحدود والراحة.", practice: "حوّل فكرة ملهمة إلى مشروع صغير يمكن مراجعته، واطلب ملاحظات من أشخاص صريحين. لا تجعل كل إحساس إشارة مؤكدة، بل امنحه مساحة ثم اختبره.", reflection: "ما الفكرة التي تريد إيصالها، وكيف تجعلها مفيدة وقابلة للفهم؟" },
      22: { essence: "يرمز 22 إلى تحويل الرؤية الكبيرة إلى بنية عملية تستمر. قد يتجه النضج نحو إنشاء مشروع أو نظام أو معرفة تخدم عددًا أكبر من الناس، عبر التخطيط وتوزيع الأدوار وإدارة الموارد.", shadow: "قد يبدو الهدف ضخمًا لدرجة الشلل، أو تحمل كل المسؤولية خوفًا من فقدان الجودة. لا يُبنى الأثر الطويل باندفاع فردي مستمر وحده.", practice: "قسّم الرؤية إلى مراحل ومؤشرات واضحة، وابدأ بأصغر نسخة مفيدة. كوّن فريقًا أو اطلب خبرة عند الحاجة، وراجع الخطة بناءً على النتائج بدل التمسك بالتصور الأول.", reflection: "ما الجزء القابل للتنفيذ الآن من المشروع الأكبر الذي تتخيله؟" },
      33: { essence: "يرمز 33 إلى نضج الرعاية والتعليم وخدمة الآخرين بوعي. قد تكون الخبرة التي جمعتها قادرة على مساعدة غيرك عندما تُقدَّم بتواضع وحدود، لا بوصفك مسؤولًا عن إنقاذ الجميع.", shadow: "قد يتحول العطاء إلى واجب لا ينتهي، أو تتجاهل احتياجاتك حتى تشعر بالاستنزاف. لا تحتاج إلى التضحية المستمرة كي تكون شخصًا ذا قيمة.", practice: "اختر شكلًا مستدامًا للعطاء، وحدد له وقتًا وموارد. اسمح للآخرين بالمبادرة وتحمل مسؤولياتهم، وتعلّم استقبال المساندة دون شعور بالذنب.", reflection: "كيف تترك أثرًا رحيمًا من غير أن تجعل نفسك آخر شخص تهتم به؟" }
    }
  });

  function extraCard(kind, number) {
    const basic = EXTRA_READINGS[kind] && EXTRA_READINGS[kind][number] || null;
    const deep = EXTRA_DEEP_READINGS[kind] && EXTRA_DEEP_READINGS[kind][number] || null;
    return basic && deep ? Object.assign({}, basic, { deep: deep }) : basic;
  }

  function renderExtraReadings(day, month, year, lifePathNumber, expressionNumber, nameData) {
    const personal = calculatePersonalYear(day, month, year);
    const birthday = calculateBirthdayNumber(day);
    const maturity = calculateMaturityNumber(lifePathNumber, expressionNumber);
    const items = [
      { key: "birthday", label: "رقم يوم الميلاد", number: birthday.value, badge: "موهبتك الفطرية", data: extraCard("birthday", birthday.value) },
      { key: "maturity", label: "رقم النضج", number: maturity.value, badge: "بعد سن 35", data: extraCard("maturity", maturity.value) }
    ];
    const personalEntry = nameData && nameData.personal_years &&
      nameData.personal_years.numbers && nameData.personal_years.numbers[String(personal.value)];
    const personalSections = personalEntry && Array.isArray(personalEntry.sections) ? personalEntry.sections : [];
    const personalHTML = '<article class="aqeq-personal-year"><div class="aqeq-extra-card-head"><div><span class="aqeq-extra-eyebrow">' +
      escapeHTML(personal.year) + '</span><h4>السنة الشخصية</h4></div><span class="aqeq-extra-number">' +
      escapeHTML(personal.value) + '</span></div><h5>' + escapeHTML(personalEntry ? personalEntry.title : "قراءة السنة الشخصية") +
      '</h5><div class="aqeq-personal-year-grid">' + personalSections.map(function (part, index) {
        return '<section class="aqeq-personal-year-section"><span class="aqeq-card-index">0' +
          (index + 1) + '</span><h5>' + escapeHTML(part.title) + '</h5><div class="aqeq-extra-copy">' +
          contentToHTML(part.content) + '</div></section>';
      }).join("") + '</div></article>';
    return '<section class="aqeq-extra-numbers"><div class="aqeq-extra-heading"><span class="aqeq-name-kicker">AQEQ ASTRO · THE NEXT LAYER</span><h3>الأرقام المكملة لمسارك</h3><p>ثلاث زوايا رمزية تضيف طبقة جديدة لفهم رحلتك.</p></div>' +
      personalHTML + '<div class="aqeq-extra-grid">' +
      items.map(function (item) {
        if (!item.data) return "";
        const d = item.data;
        let body = "";
        if (item.key === "birthday") {
          body = '<p><strong>الموهبة والمهارة:</strong> ' + escapeHTML(d.skill) + '</p>' +
            '<section class="aqeq-extra-deep-section"><h5>جوهر الموهبة في العمق</h5><p>' + escapeHTML(d.deep.essence) + '</p></section>' +
            '<section class="aqeq-extra-deep-section"><h5>الظل الذي قد يعطّلها</h5><p>' + escapeHTML(d.deep.shadow) + '</p></section>' +
            '<section class="aqeq-extra-deep-section"><h5>كيف تنمّي موهبتك عمليًا</h5><p>' + escapeHTML(d.deep.growth) + '</p></section>' +
            '<p><strong>خطوة البداية:</strong> ' + escapeHTML(d.practice) + '</p>' +
            '<p class="aqeq-extra-reflection"><strong>سؤال للتأمل:</strong> ' + escapeHTML(d.deep.reflection) + '</p>';
        } else {
          body = '<p><strong>طاقة النضج:</strong> ' + escapeHTML(d.mature) + '</p>' +
            '<section class="aqeq-extra-deep-section"><h5>المعنى الأعمق لهذه المرحلة</h5><p>' + escapeHTML(d.deep.essence) + '</p></section>' +
            '<section class="aqeq-extra-deep-section"><h5>الظل والتحدي المحتمل</h5><p>' + escapeHTML(d.deep.shadow) + '</p></section>' +
            '<section class="aqeq-extra-deep-section"><h5>خطوات عملية للنضج المتوازن</h5><p>' + escapeHTML(d.deep.practice) + '</p></section>' +
            '<p><strong>مفتاح الاتزان:</strong> ' + escapeHTML(d.balance) + '</p>' +
            '<p class="aqeq-extra-reflection"><strong>سؤال للتأمل:</strong> ' + escapeHTML(d.deep.reflection) + '</p>';
        }
        return '<article class="aqeq-extra-card aqeq-extra-' + item.key + '"><div class="aqeq-extra-card-head"><div><span class="aqeq-extra-eyebrow">' + escapeHTML(item.badge) + '</span><h4>' + escapeHTML(item.label) + '</h4></div><span class="aqeq-extra-number">' + escapeHTML(item.number) + '</span></div><h5>' + escapeHTML(d.title) + '</h5><div class="aqeq-extra-copy">' + body + '</div></article>';
      }).join("") + '</div><p class="aqeq-extra-note">قراءات علم الأرقام هنا رمزية للتأمل الذاتي وليست حقائق علمية أو تنبؤات مؤكدة.</p></section>';
  }


  function ensurePinnacleStyles() {
    if (document.getElementById("aqeq-pc-styles")) return;
    const style = document.createElement("style");
    style.id = "aqeq-pc-styles";
    style.textContent = `
      .aqeq-extra-deep-section{margin:12px 0;padding-top:10px;border-top:1px solid rgba(210,190,137,.16)}
      .aqeq-extra-deep-section h5{margin:0 0 6px;color:#e6ce92;font-size:.92rem;line-height:1.6}
      .aqeq-extra-deep-section p,.aqeq-extra-reflection{line-height:1.9}
      .aqeq-extra-reflection{padding:10px 12px;border-inline-start:3px solid #c7a96a;background:rgba(205,174,105,.07);border-radius:8px}
      .aqeq-pc-wrap{margin-top:22px;color:var(--text,#f3f0e8)}
      .aqeq-pc-heading{margin:0 0 14px}
      .aqeq-pc-heading h3{margin:5px 0 7px;font-size:1.25rem}
      .aqeq-pc-heading p,.aqeq-pc-note{color:var(--muted,#aeb7c9);font-size:.88rem;line-height:1.8}
      .aqeq-pc-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      .aqeq-pc-card{min-width:0;padding:16px;border:1px solid rgba(210,190,137,.24);border-radius:16px;background:linear-gradient(145deg,rgba(27,35,57,.92),rgba(17,22,39,.94));box-shadow:0 8px 24px rgba(0,0,0,.12)}
      .aqeq-pc-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
      .aqeq-pc-eyebrow{display:block;color:#d6bf86;font-size:.72rem;letter-spacing:.04em;margin-bottom:5px}
      .aqeq-pc-card h4{font-size:1rem;line-height:1.5;margin:0}
      .aqeq-pc-number{flex:0 0 auto;display:grid;place-items:center;min-width:42px;height:42px;padding:0 8px;border-radius:13px;border:1px solid rgba(219,194,133,.42);color:#f4dfaa;font-size:1.25rem;font-weight:800;background:rgba(205,174,105,.09)}
      .aqeq-pc-period{display:inline-block;margin:12px 0 8px;padding:5px 9px;border-radius:999px;background:rgba(255,255,255,.055);color:#d8deeb;font-size:.78rem}
      .aqeq-pc-copy{font-size:.9rem;line-height:1.9;color:#d6dceb;min-width:0;overflow-wrap:anywhere;white-space:normal}
      .aqeq-pc-copy p{margin:9px 0;white-space:normal;overflow-wrap:anywhere}.aqeq-pc-copy h5{font-size:.98rem;line-height:1.6;color:#f0dba8;margin:2px 0 10px}.aqeq-pc-copy strong{color:#f0dba8;font-weight:750}
      .aqeq-pc-debts{margin-top:14px}
      .aqeq-pc-debt{padding:13px 0;border-top:1px solid rgba(255,255,255,.09)}
      .aqeq-pc-debt:first-child{border-top:0}
      .aqeq-pc-empty{padding:15px;border:1px dashed rgba(210,190,137,.3);border-radius:14px;color:#c5ccda;line-height:1.8}
      @media(max-width:600px){.aqeq-pc-grid{grid-template-columns:1fr}.aqeq-pc-card{padding:14px}}
    `;
    document.head.appendChild(style);
  }

  function renderPinnaclesChallenges(day, month, birthYear, lifePathNumber, nameCalculation) {
    if (!root.AqeqPinnaclesChallenges || !Number.isInteger(Number(birthYear))) return "";
    ensurePinnacleStyles();
    const result = root.AqeqPinnaclesChallenges.calculatePinnaclesChallenges(
      Number(day), Number(month), Number(birthYear), Number(lifePathNumber)
    );
    const debts = root.AqeqPinnaclesChallenges.collectKarmicDebts(
      Number(day), Number(month), Number(birthYear), Number(lifePathNumber), nameCalculation
    );
    function card(item, kind) {
      const title = kind === "pinnacle" ? "القمة " + item.index : "التحدي " + item.index;
      const eyebrow = kind === "pinnacle" ? "PINNACLE" : "CHALLENGE";
      const period = item.period ? item.period.label : "";
      const content = kind === "pinnacle"
        ? root.AqeqPinnaclesChallenges.getPinnacleReading(item.value)
        : root.AqeqPinnaclesChallenges.getChallengeReading(item.value);
      const sections = kind === "pinnacle"
        ? [
            ["طاقة القمة والفرص (ماذا يطلب منك الكون؟)", content && content.energy],
            ["النبض النفسي والعاطفي (ماذا يدور بداخلك؟)", content && content.psyche],
            ["طريقة الاستثمار والعمل (كيف تنجح في هذه القمة؟)", content && content.invest],
            ["التحذير والظل الطاقي (فخ المرحلة)", content && content.shadow]
          ]
        : [
            ["جذر التحدي", content && content.root],
            ["الدرس النفسي والروحي", content && content.lesson],
            ["المهارات اللي محتاجة بناء", content && content.skills],
            ["روشتة تجاوز التحدي", content && content.practice]
          ];
      const copy = content
        ? (content.essence ? '<p class="aqeq-pc-essence"><strong>المعنى الجوهري:</strong> ' + escapeHTML(content.essence) + '</p>' : '') +
          sections.map(function (part) {
            return '<section class="aqeq-pc-reading-section"><h5>' + escapeHTML(part[0]) +
              '</h5><p>' + escapeHTML(part[1] || "") + '</p></section>';
          }).join("") +
          (kind === "pinnacle" && content.reflection
            ? '<p class="aqeq-pc-reflection"><strong>سؤال للتأمل:</strong> ' + escapeHTML(content.reflection) + '</p>'
            : '')
        : '<p>القراءة التفصيلية لهذا الرقم قيد الإعداد.</p>';
      return '<article class="aqeq-pc-card"><div class="aqeq-pc-card-head"><div><span class="aqeq-pc-eyebrow">' +
        eyebrow + ' · ' + String(item.index).padStart(2, "0") + '</span><h4>' + escapeHTML(title) +
        '</h4></div><span class="aqeq-pc-number">' + escapeHTML(item.value) +
        '</span></div><span class="aqeq-pc-period">' + escapeHTML(period) +
        '</span><div class="aqeq-pc-copy"><h5>' + escapeHTML(content ? content.title : "") + '</h5>' + copy + '</div></article>';
    }
    const pinnacleCards = result.pinnacles.map(function (item) { return card(item, "pinnacle"); }).join("");
    const challengeCards = result.challenges.map(function (item) { return card(item, "challenge"); }).join("");
    const debtHTML = debts.found
      ? debts.items.map(function (item) {
          const reading = root.AqeqPinnaclesChallenges.getKarmicDebtReading(item.debt);
          const body = reading
            ? (reading.essence ? '<p class="aqeq-pc-essence"><strong>المعنى الجوهري:</strong> ' + escapeHTML(reading.essence) + '</p>' : '') +
              '<section class="aqeq-pc-reading-section"><h5>أصل الدين الكارمي والنمط الخفي</h5><p>' + escapeHTML(reading.origin) + '</p></section>' +
              '<section class="aqeq-pc-reading-section"><h5>نمط التكرار في الواقع (إزاي بيظهر في حياتك؟)</h5><p>' + escapeHTML(reading.pattern) + '</p></section>' +
              '<section class="aqeq-pc-reading-section"><h5>الدرس النفسي والروحي</h5><p>' + escapeHTML(reading.lesson) + '</p></section>' +
              '<section class="aqeq-pc-reading-section"><h5>روشتة فك الارتباط والتحرر</h5><p>' + escapeHTML(reading.release) + '</p></section>'
            : '<p>' + escapeHTML(item.detail) + '</p><p>' + escapeHTML(item.theme) + '</p>';
          return '<div class="aqeq-pc-debt"><div class="aqeq-pc-card-head"><div><span class="aqeq-pc-eyebrow">KARMIC DEBT · ' +
            escapeHTML(item.source.replace(/_/g, " ")) + '</span><h4>' + escapeHTML(item.title) +
            '</h4></div><span class="aqeq-pc-number">' + escapeHTML(item.debt + "/" + item.root) +
            '</span></div><div class="aqeq-pc-copy">' + body + '</div></div>';
        }).join("")
      : '<div class="aqeq-pc-empty">لم يظهر رقم 13 أو 14 أو 16 أو 19 كقيمة مركبة مباشرة قبل الاختزال في المصادر المفحوصة. ده لا يعني وجود أو غياب صفة شخصية؛ هو فقط نتيجة قاعدة الفحص الحسابية.</div>';
    return '<section class="aqeq-pc-wrap"><div class="aqeq-pc-heading"><span class="aqeq-name-kicker">AQEQ ASTRO · LIFE CYCLES</span><h3>القمم والتحديات</h3><p>أربع قمم وأربع تحديات موزعة على مراحل العمر وفق قاعدة 36 − جذر مسار الحياة.</p></div>' +
      '<div class="aqeq-pc-grid">' + pinnacleCards + '</div>' +
      '<div class="aqeq-pc-heading" style="margin-top:22px"><h3>التحديات الأربعة</h3><p>فروق مطلقة بين أرقام الشهر واليوم والسنة المختزلة.</p></div>' +
      '<div class="aqeq-pc-grid">' + challengeCards + '</div>' +
      '<div class="aqeq-pc-heading" style="margin-top:22px"><h3>فحص الديون الكارمية</h3><p>الفحص هنا حسابي ورمزي، ويعتمد على الأرقام المركبة الظاهرة قبل الاختزال فقط.</p></div>' +
      '<article class="aqeq-pc-card aqeq-pc-debts">' + debtHTML + '</article>' +
      '<p class="aqeq-pc-note">ملاحظة منهجية: علم الأعداد إطار رمزي للتأمل وليس أداة علمية مثبتة أو حكمًا على المصير. طريقة الاحتفاظ بالأرقام الرئيسية وفحص الديون محددة داخل محرك عقيق أسترو.</p></section>';
  }

  function numberLabel(result) {
    if (!result || result.value == null) return "غير متاح";
    return String(result.value) + (result.isMaster ? " · رقم رئيسي" : "");
  }

  async function render(name, resultRoot, birthContext) {
    if (!resultRoot) return;
    const old = resultRoot.querySelector(".aqeq-name-readings");
    if (old) old.remove();

    const section = document.createElement("section");
    section.className = "aqeq-name-readings";
    section.setAttribute("aria-live", "polite");
    section.innerHTML = '<div class="aqeq-name-heading"><span class="aqeq-name-kicker">AQEQ ASTRO · NAME NUMBERS</span><h3>بصمة اسمك</h3><p>تلات زوايا بتكمل قراءة مسار حياتك: الدافع الداخلي، صورتك قدام الناس، وطريقة التعبير عن مواهبك.</p></div><p class="aqeq-name-status">جاري تجهيز كروت الاسم…</p>';
    resultRoot.appendChild(section);

    const cleanName = String(name || "").trim();
    if (!cleanName) {
      section.querySelector(".aqeq-name-status").textContent =
        "اكتب اسمك في خانة الاسم عشان تظهر قراءة رغبة الروح والشخصية الظاهرة والتعبير والقدر.";
      section.classList.add("is-empty");
      return;
    }

    try {
      if (!root.AqeqNameEngine || typeof root.AqeqNameEngine.calculateNameNumbers !== "function") {
        throw new Error("محرك حساب الاسم غير محمّل. تأكد من إضافة name_engine.js.");
      }
      const [nameData, calculation] = await Promise.all([
        loadData(),
        Promise.resolve(root.AqeqNameEngine.calculateNameNumbers(cleanName))
      ]);

      // Avoid a stale async response overwriting a newer result.
      if (!section.isConnected) return;

      const groupsHTML = GROUPS.map(function (group) {
        const calculated = calculation[group.calcKey];
        const number = calculated && calculated.value != null ? String(calculated.value) : "";
        const entry = nameData.groups[group.key] &&
          nameData.groups[group.key].numbers &&
          nameData.groups[group.key].numbers[number];

        // Keep the interface usable even if a future data edit accidentally
        // omits a reading. The numeric result remains visible with a neutral
        // fallback instead of exposing a broken-data error to visitors.
        if (!entry || !Array.isArray(entry.cards) || !entry.cards.length) {
          const fallbackNumber = number || "1";
          const fallbackContent = group.key === "soul_urge"
            ? "عشان كتابة الاسم بالعربي غالبًا ما بتظهرش كل حروف العلة القصيرة، بنستخدم الاسم كاملًا كبديل حسابي عند غياب حروف العلة المكتوبة. خُد النتيجة كمدخل رمزي للتأمل، مش كحكم ثابت على شخصيتك."
            : "القراءة التفصيلية للرقم ده قيد المراجعة. الرقم محسوب، ويمكنك استخدامه كمدخل رمزي للتأمل في الدوافع والاختيارات.";
          return '<article class="aqeq-name-group aqeq-name-fallback"><header><div><h4>' +
            escapeHTML(group.label) + '</h4><p>' + escapeHTML(group.sub) +
            '</p></div><span class="aqeq-name-number">' + escapeHTML(fallbackNumber) +
            '</span></header><article class="aqeq-reading-card"><div class="aqeq-reading-card-top"><span class="aqeq-card-index">01</span><h5>قراءة تمهيدية</h5></div><div class="aqeq-reading-content">' +
            contentToHTML(fallbackContent) + '</div></article></article>';
        }

        const cardsHTML = entry.cards.map(function (card, index) {
          return '<article class="aqeq-reading-card"><div class="aqeq-reading-card-top"><span class="aqeq-card-index">0' +
            (index + 1) + '</span><h5>' + escapeHTML(card.title || ("الكارت " + (index + 1))) +
            '</h5></div><div class="aqeq-reading-content">' + contentToHTML(card.content) +
            '</div></article>';
        }).join("");

        return '<article class="aqeq-name-group"><header><div><h4>' +
          escapeHTML(nameData.groups[group.key].label || group.label) +
          '</h4><p>' + escapeHTML(group.sub) + '</p></div><span class="aqeq-name-number">' +
          escapeHTML(numberLabel(calculated)) + '</span></header><div class="aqeq-reading-grid">' +
          cardsHTML + '</div></article>';
      }).join("");

      section.innerHTML = '<div class="aqeq-name-heading"><span class="aqeq-name-kicker">AQEQ ASTRO · NAME NUMBERS</span><h3>بصمة اسم ' +
        escapeHTML(cleanName) + '</h3><p>قراءة رمزية للتأمل وفهم الذات، بتكمل مسار حياتك ولا تستبدله.</p></div>' +
        '<div class="aqeq-name-groups">' + groupsHTML + '</div>';
      if (birthContext && Number.isInteger(Number(birthContext.day)) &&
          Number.isInteger(Number(birthContext.month)) && Number.isInteger(Number(birthContext.year)) &&
          birthContext.day >= 1 && birthContext.day <= 31 && birthContext.month >= 1 && birthContext.month <= 12) {
        const expressionNumber = calculation.expression && calculation.expression.value;
        if (expressionNumber != null && birthContext.lifePath != null) {
          section.insertAdjacentHTML("beforeend", renderExtraReadings(
            Number(birthContext.day), Number(birthContext.month), Number(birthContext.year),
            Number(birthContext.lifePath), Number(expressionNumber), nameData
          ));
          if (birthContext.birthYear != null && root.AqeqPinnaclesChallenges) {
            section.insertAdjacentHTML("beforeend", renderPinnaclesChallenges(
              Number(birthContext.day), Number(birthContext.month), Number(birthContext.birthYear),
              Number(birthContext.lifePath), calculation
            ));
          }
        }
      }
    } catch (error) {
      if (!section.isConnected) return;
      const status = section.querySelector(".aqeq-name-status") || document.createElement("p");
      status.className = "aqeq-name-status aqeq-name-error";
      status.textContent = (error && error.message) ? error.message :
        "حصلت مشكلة أثناء تحميل قراءات الاسم. راجع ملفات الموقع وحاول تاني.";
      if (!status.parentNode) section.appendChild(status);
    }
  }

  root.AqeqNameReadings = Object.freeze({ render: render, loadData: loadData, calculatePersonalYear: calculatePersonalYear, calculateBirthdayNumber: calculateBirthdayNumber, calculateMaturityNumber: calculateMaturityNumber, renderPinnaclesChallenges: renderPinnaclesChallenges, extraReadings: EXTRA_READINGS });
})(window);
