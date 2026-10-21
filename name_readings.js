/* Aqeq Astro · Name Reading Cards
   Loads name_data.json, calculates three name numbers, and renders all 9 reading cards.
   GitHub Pages friendly: no server-side code required.
*/
(function (root) {
  "use strict";

  let dataPromise;

  function loadData() {
    if (!dataPromise) {
      dataPromise = fetch(
        new URL("name_data.json", window.location.href).href,
        {
          cache: "no-cache"
        }
      )
        .then(function (response) {
          if (!response.ok) {
            throw new Error(
              "تعذر تحميل name_data.json (" + response.status + ")"
            );
          }

          return response.json();
        })
        .then(function (json) {
          if (!json || !json.groups) {
            throw new Error("تنسيق ملف قراءات الاسم غير صحيح.");
          }

          return json;
        });
    }

    return dataPromise;
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function contentToHTML(value) {
    const text = String(value || "")
      .replace(/\r\n?/g, "\n")
      .trim();

    if (!text) return "";

    return text
      .split(/\n{2,}/)
      .map(function (block) {
        const lines = block.split("\n");

        if (
          lines.every(function (line) {
            return /^\s*[•●▪◦*-]\s+/.test(line);
          })
        ) {
          return (
            "<ul>" +
            lines
              .map(function (line) {
                return (
                  "<li>" +
                  escapeHTML(
                    line.replace(/^\s*[•●▪◦*-]\s+/, "")
                  ) +
                  "</li>"
                );
              })
              .join("") +
            "</ul>"
          );
        }

        return (
          "<p>" +
          lines.map(escapeHTML).join("<br>") +
          "</p>"
        );
      })
      .join("");
  }

  const GROUPS = [
    {
      key: "soul_urge",
      calcKey: "soulUrge",
      label: "رغبة الروح",
      sub: "إيه اللي بيحرّكك من جوا"
    },
    {
      key: "personality",
      calcKey: "personality",
      label: "الشخصية الظاهرة",
      sub: "الانطباع اللي بتسيبه عند الناس"
    },
    {
      key: "expression",
      calcKey: "expression",
      label: "التعبير والقدر",
      sub: "مواهبك وطريقتك في تحويلها لفعل"
    }
  ];

  // Compact, reflective interpretations for complementary numerology outputs.
  const EXTRA_READINGS = Object.freeze({
    personalYear: {
      1: {
        title: "بداية جديدة",
        energy: "سنة انطلاقة واستقلال؛ طاقة مناسبة لتحديد اتجاه جديد وبناء هوية أو مشروع.",
        opportunities: "ابدأ خطوة مؤجلة، بادر، وجرّب طريقًا يناسبك بدل انتظار الإذن.",
        avoid: "تجنب التسرع والأنانية وفتح جبهات كثيرة في وقت واحد."
      },
      2: {
        title: "الصبر والشراكة",
        energy: "سنة تعاون وحساسية أعلى؛ التقدم فيها غالبًا هادئ ويتكوّن بالتدريج.",
        opportunities: "قوِّ علاقة مهمة، تفاوض، اسمع جيدًا، واشتغل على التفاصيل التي تحتاج وقتًا.",
        avoid: "تجنب الاستعجال وقراءة كل تأخير باعتباره رفضًا أو فشلًا."
      },
      3: {
        title: "التعبير والانتشار",
        energy: "سنة إبداع وتواصل وظهور؛ الأفكار تحتاج صوتًا ومساحة للتجربة.",
        opportunities: "اكتب، اتكلم، تعلّم، انشر، ووسّع دائرة علاقاتك بطريقة أصيلة.",
        avoid: "تجنب التشتت والوعود الكثيرة وإنفاق الطاقة على الانطباع بدل الإنجاز."
      },
      4: {
        title: "البناء والتنظيم",
        energy: "سنة تأسيس وانضباط؛ المكاسب تأتي من نظام ثابت وخطوات قابلة للقياس.",
        opportunities: "رتّب المال والوقت، ابنِ مهارة، وثبّت أساس مشروع أو عادة طويلة المدى.",
        avoid: "تجنب الجمود والإرهاق ومحاولة التحكم في كل تفصيلة."
      },
      5: {
        title: "التغيير والمرونة",
        energy: "سنة حركة وتجارب وتبدّل؛ تحتاج مرونة مع الحفاظ على بوصلة واضحة.",
        opportunities: "استكشف فرصة جديدة، طوّر مهارة، وسّع خبرتك وجرّب أسلوبًا مختلفًا.",
        avoid: "تجنب القرارات الاندفاعية والهروب من الالتزامات لمجرد الملل."
      },
      6: {
        title: "المسؤولية والانسجام",
        energy: "سنة اهتمام بالبيت والعلاقات والالتزامات؛ التوازن بين الرعاية والذات أساسي.",
        opportunities: "أصلح علاقة، حسّن بيئتك، واهتم بما يحتاج رعاية مستمرة.",
        avoid: "تجنب لعب دور المنقذ وتحمل مسؤوليات الآخرين على حساب نفسك."
      },
      7: {
        title: "المراجعة والعمق",
        energy: "سنة تأمل وتعلّم ومراجعة داخلية؛ ليست كل خطوة مفيدة لازم تكون سريعة أو ظاهرة.",
        opportunities: "ادرس، ابحث، راجع قراراتك، وامنح نفسك وقتًا لفهم ما تريده فعلًا.",
        avoid: "تجنب العزلة الكاملة والشك المفرط وتأجيل الحياة انتظارًا لليقين."
      },
      8: {
        title: "الإنجاز والإدارة",
        energy: "سنة طموح ونتائج ومسؤولية مادية؛ تحتاج إدارة عادلة وواقعية للموارد.",
        opportunities: "فاوض، نظّم ميزانيتك، طوّر مشروعًا، واطلب مقابلًا مناسبًا لعملك.",
        avoid: "تجنب صراع السيطرة والمخاطرة المالية غير المحسوبة وربط قيمتك بالإنجاز وحده."
      },
      9: {
        title: "الإكمال والتحرير",
        energy: "سنة حصاد وإغلاق دورات قديمة وإفساح مساحة لما هو قادم.",
        opportunities: "أنهِ مشروعًا، سامح دون إنكار الأذى، وتخلّص من التزامات لم تعد مناسبة.",
        avoid: "تجنب التعلق بما انتهى أو اتخاذ قرارات مصيرية بدافع لحظة عاطفية."
      }
    },

    birthday: {
      1: {
        title: "المبادرة",
        skill: "موهبتك الفطرية هي بدء الحركة واتخاذ القرار وصناعة طريقك الخاص.",
        practice: "نمِّ مهارة القيادة مع تعلّم الاستماع وتقبّل المساعدة."
      },
      2: {
        title: "الالتقاط والتعاون",
        skill: "موهبتك هي قراءة الأجواء، ملاحظة الفروق الدقيقة، وبناء الجسور بين الناس.",
        practice: "حوّل حساسيتك إلى تواصل واضح بدل كتمان احتياجاتك."
      },
      3: {
        title: "التعبير والإبداع",
        skill: "موهبتك هي تحويل الأفكار والمشاعر إلى كلام أو فن أو حضور اجتماعي.",
        practice: "درّب موهبتك على الاستمرارية، لا على الإلهام وحده."
      },
      4: {
        title: "التنظيم والإتقان",
        skill: "موهبتك هي ترتيب الفوضى، بناء الأنظمة، وملاحظة ما يحتاج إلى إصلاح.",
        practice: "وازن بين الدقة والمرونة ولا تجعل الكمال يمنع البداية."
      },
      5: {
        title: "التكيّف والاستكشاف",
        skill: "موهبتك هي سرعة التعلّم والتأقلم وربط خبرات وأفكار متنوعة.",
        practice: "وجّه فضولك إلى مشروع تكمله بدل القفز بين البدايات."
      },
      6: {
        title: "الرعاية والذوق",
        skill: "موهبتك هي دعم الآخرين، خلق الانسجام، والإحساس بما يجعل المكان أو العلاقة أدفأ.",
        practice: "قدّم الرعاية بحدود واضحة ولا تخلط الحب بالتضحية المستمرة."
      },
      7: {
        title: "البحث والتحليل",
        skill: "موهبتك هي السؤال العميق، اكتشاف الأنماط، والتفكير المستقل.",
        practice: "شارك ما تتعلمه ولا تنتظر معرفة كاملة قبل التحرك."
      },
      8: {
        title: "الإدارة والتنفيذ",
        skill: "موهبتك هي تنظيم الموارد، تحمّل المسؤولية، وتحويل الهدف إلى نتيجة ملموسة.",
        practice: "استخدم نفوذك بعدل واعتبر التعاون قوة لا تهديدًا."
      },
      9: {
        title: "الرؤية والإنسانية",
        skill: "موهبتك هي رؤية الصورة الكبيرة والتعاطف وربط التجربة بمعنى أوسع.",
        practice: "ساعد بوعي، مع التمييز بين التعاطف وتحمل ما ليس مسؤوليتك."
      },
      11: {
        title: "الإلهام والحدس",
        skill: "في القراءة الرمزية للأرقام الرئيسية، يشير 11 إلى التقاط الأفكار والإلهام والحساسية للمعنى.",
        practice: "حوّل الإلهام إلى خطوات واقعية، وراجع انطباعاتك بدل اعتبارها حقائق مؤكدة."
      },
      22: {
        title: "البناء واسع النطاق",
        skill: "يشير 22 إلى الجمع بين الرؤية العملية والتنظيم والقدرة على تحويل فكرة كبيرة إلى خطة.",
        practice: "قسّم الهدف الكبير إلى مراحل، واطلب دعمًا مناسبًا بدل حمل كل شيء وحدك."
      }
    },

    maturity: {
      1: {
        title: "استقلال وقيادة",
        mature: "مع النضج، يزيد تركيزك على الاستقلال والمبادرة وصنع قرارك بنفسك.",
        balance: "القيادة الأثبت تجمع الحسم مع الإصغاء والتعاون."
      },
      2: {
        title: "شراكة واتزان",
        mature: "مع النضج، تتقدم مهارة التعاون والدبلوماسية وبناء علاقات متوازنة.",
        balance: "لا تجعل السلام الظاهري أهم من التعبير الصريح عن احتياجاتك."
      },
      3: {
        title: "صوت وإبداع",
        mature: "مع النضج، قد يصبح التعبير والإبداع والتعليم أو التواصل مساحة أكبر في حياتك.",
        balance: "امنح موهبتك نظامًا يساعدها على الاكتمال."
      },
      4: {
        title: "أساس واستمرارية",
        mature: "مع النضج، تبرز قيمة البناء طويل المدى والمسؤولية والمهارة المتقنة.",
        balance: "اترك مكانًا للتجديد حتى لا يتحول الاستقرار إلى جمود."
      },
      5: {
        title: "حرية وتجربة",
        mature: "مع النضج، تتعلم أن تصنع حرية واعية عبر التجربة والتغيير وتوسيع الخبرة.",
        balance: "اختر التغيير الذي يخدم اتجاهك، لا التغيير لمجرد الهروب."
      },
      6: {
        title: "رعاية ومسؤولية",
        mature: "مع النضج، قد تتقدم موضوعات الأسرة والخدمة والجمال وبناء بيئة آمنة.",
        balance: "المسؤولية الصحية لا تعني أن تحمل كل شيء عن الجميع."
      },
      7: {
        title: "حكمة وفهم",
        mature: "مع النضج، يتعمق البحث والتأمل والاستقلال الفكري وفهم دوافعك.",
        balance: "اجمع بين التفكير والخبرة الحية، وابقَ متصلًا بالناس."
      },
      8: {
        title: "إدارة وأثر",
        mature: "مع النضج، تتقدم الإدارة والإنجاز وتنظيم الموارد وصناعة أثر ملموس.",
        balance: "قِس النجاح بما تبنيه وبطريقة بنائه، لا بالمكانة وحدها."
      },
      9: {
        title: "معنى وخدمة",
        mature: "مع النضج، تتوسع الرؤية الإنسانية والرغبة في إكمال الدورات ومشاركة الخبرة.",
        balance: "ساعد من موقع الاختيار والحدود، لا من الشعور بالذنب."
      },
      11: {
        title: "إلهام واعٍ",
        mature: "يشير 11 رمزيًا إلى نضج الحس الإلهامي والقدرة على نقل فكرة ملهمة للآخرين.",
        balance: "ثبّت رؤيتك بالتعلم والحقائق والعمل اليومي."
      },
      22: {
        title: "رؤية تتحول إلى واقع",
        mature: "يشير 22 رمزيًا إلى نضج القدرة على تحويل رؤية كبيرة إلى بناء عملي يستمر.",
        balance: "ابدأ بما تقدر عليه، ووزّع المسؤولية على فريق."
      },
      33: {
        title: "تعاطف ومسؤولية",
        mature: "يشير 33 رمزيًا إلى نضج الرعاية والتعليم وخدمة الآخرين بوعي.",
        balance: "لا تجعل خدمة الناس تلغي احتياجاتك وحدودك الشخصية."
      }
    }
  });

  function reduceNumber(value, preserveMaster) {
    let n = Math.abs(Math.trunc(Number(value)));

    if (!Number.isFinite(n) || n === 0) return 0;

    while (n > 9) {
      if (
        preserveMaster &&
        (n === 11 || n === 22 || n === 33)
      ) {
        return n;
      }

      n = String(n)
        .split("")
        .reduce(function (sum, digit) {
          return sum + Number(digit);
        }, 0);
    }

    return n;
  }

  function calculatePersonalYear(day, month, year) {
    const targetYear = Number(
      year == null ? new Date().getFullYear() : year
    );

    const sum =
      Number(day) +
      Number(month) +
      String(targetYear)
        .split("")
        .reduce(function (a, digit) {
          return a + Number(digit);
        }, 0);

    return {
      value: reduceNumber(sum, false),
      rawTotal: sum,
      year: targetYear
    };
  }

  function calculateBirthdayNumber(day) {
    const raw = Number(day);

    if (
      !Number.isInteger(raw) ||
      raw < 1 ||
      raw > 31
    ) {
      throw new RangeError(
        "يوم الميلاد لازم يكون من 1 إلى 31."
      );
    }

    return {
      value: reduceNumber(raw, true),
      rawTotal: raw
    };
  }

  function calculateMaturityNumber(
    lifePathNumber,
    expressionNumber
  ) {
    const raw =
      Number(lifePathNumber) +
      Number(expressionNumber);

    return {
      value: reduceNumber(raw, true),
      rawTotal: raw
    };
  }

  function extraCard(kind, number) {
    return (
      EXTRA_READINGS[kind] &&
      EXTRA_READINGS[kind][number]
    ) || null;
  }

  function renderExtraReadings(
    day,
    month,
    year,
    lifePathNumber,
    expressionNumber,
    nameData
  ) {
    const personal = calculatePersonalYear(
      day,
      month,
      year
    );

    const birthday = calculateBirthdayNumber(day);

    const maturity = calculateMaturityNumber(
      lifePathNumber,
      expressionNumber
    );

    const items = [
      {
        key: "birthday",
        label: "رقم يوم الميلاد",
        number: birthday.value,
        badge: "موهبتك الفطرية",
        data: extraCard("birthday", birthday.value)
      },
      {
        key: "maturity",
        label: "رقم النضج",
        number: maturity.value,
        badge: "بعد سن 35",
        data: extraCard("maturity", maturity.value)
      }
    ];

    const personalEntry =
      nameData &&
      nameData.personal_years &&
      nameData.personal_years.numbers &&
      nameData.personal_years.numbers[
        String(personal.value)
      ];

    const personalSections =
      personalEntry &&
      Array.isArray(personalEntry.sections)
        ? personalEntry.sections
        : [];

    const personalHTML =
      '<article class="aqeq-personal-year">' +
        '<div class="aqeq-extra-card-head">' +
          '<div>' +
            '<span class="aqeq-extra-eyebrow">' +
              escapeHTML(personal.year) +
            '</span>' +
            '<h4>السنة الشخصية</h4>' +
          '</div>' +
          '<span class="aqeq-extra-number">' +
            escapeHTML(personal.value) +
          '</span>' +
        '</div>' +
        '<h5>' +
          escapeHTML(
            personalEntry
              ? personalEntry.title
              : "قراءة السنة الشخصية"
          ) +
        '</h5>' +
        '<div class="aqeq-personal-year-grid">' +
          personalSections
            .map(function (part, index) {
              return (
                '<section class="aqeq-personal-year-section">' +
                  '<span class="aqeq-card-index">0' +
                    (index + 1) +
                  '</span>' +
                  '<h5>' +
                    escapeHTML(part.title) +
                  '</h5>' +
                  '<div class="aqeq-extra-copy">' +
                    contentToHTML(part.content) +
                  '</div>' +
                '</section>'
              );
            })
            .join("") +
        '</div>' +
      '</article>';

    return (
      '<section class="aqeq-extra-numbers">' +
        '<div class="aqeq-extra-heading">' +
          '<span class="aqeq-name-kicker">' +
            'AQEQ ASTRO · THE NEXT LAYER' +
          '</span>' +
          '<h3>الأرقام المكملة لمسارك</h3>' +
          '<p>ثلاث زوايا رمزية تضيف طبقة جديدة لفهم رحلتك.</p>' +
        '</div>' +
        personalHTML +
        '<div class="aqeq-extra-grid">' +
          items.map(function (item) {
            if (!item.data) return "";

            const d = item.data;
            let body = "";

            if (item.key === "birthday") {
              body =
                '<p><strong>الموهبة والمهارة:</strong> ' +
                  escapeHTML(d.skill) +
                '</p>' +
                '<p><strong>طريقة تنميتها:</strong> ' +
                  escapeHTML(d.practice) +
                '</p>';
            } else {
              body =
                '<p><strong>طاقة النضج:</strong> ' +
                  escapeHTML(d.mature) +
                '</p>' +
                '<p><strong>مفتاح الاتزان:</strong> ' +
                  escapeHTML(d.balance) +
                '</p>';
            }

            return (
              '<article class="aqeq-extra-card aqeq-extra-' +
                item.key +
              '">' +
                '<div class="aqeq-extra-card-head">' +
                  '<div>' +
                    '<span class="aqeq-extra-eyebrow">' +
                      escapeHTML(item.badge) +
                    '</span>' +
                    '<h4>' +
                      escapeHTML(item.label) +
                    '</h4>' +
                  '</div>' +
                  '<span class="aqeq-extra-number">' +
                    escapeHTML(item.number) +
                  '</span>' +
                '</div>' +
                '<h5>' +
                  escapeHTML(d.title) +
                '</h5>' +
                '<div class="aqeq-extra-copy">' +
                  body +
                '</div>' +
              '</article>'
            );
          }).join("") +
        '</div>' +
        '<p class="aqeq-extra-note">' +
          'قراءات علم الأرقام هنا رمزية للتأمل الذاتي وليست حقائق علمية أو تنبؤات مؤكدة.' +
        '</p>' +
      '</section>'
    );
  }

  function ensurePinnacleStyles() {
    if (document.getElementById("aqeq-pc-styles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "aqeq-pc-styles";

    style.textContent = `
      .aqeq-pc-wrap{
        margin-top:22px;
        color:var(--text,#f3f0e8)
      }

      .aqeq-pc-heading{
        margin:0 0 14px
      }

      .aqeq-pc-heading h3{
        margin:5px 0 7px;
        font-size:1.25rem
      }

      .aqeq-pc-heading p,
      .aqeq-pc-note{
        color:var(--muted,#aeb7c9);
        font-size:.88rem;
        line-height:1.8
      }

      .aqeq-pc-grid{
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:12px
      }

      .aqeq-pc-card{
        min-width:0;
        padding:16px;
        border:1px solid rgba(210,190,137,.24);
        border-radius:16px;
        background:linear-gradient(
          145deg,
          rgba(27,35,57,.92),
          rgba(17,22,39,.94)
        );
        box-shadow:0 8px 24px rgba(0,0,0,.12)
      }

      .aqeq-pc-card-head{
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px
      }

      .aqeq-pc-eyebrow{
        display:block;
        color:#d6bf86;
        font-size:.72rem;
        letter-spacing:.04em;
        margin-bottom:5px
      }

      .aqeq-pc-card h4{
        font-size:1rem;
        line-height:1.5;
        margin:0
      }

      .aqeq-pc-number{
        flex:0 0 auto;
        display:grid;
        place-items:center;
        min-width:42px;
        height:42px;
        padding:0 8px;
        border-radius:13px;
        border:1px solid rgba(219,194,133,.42);
        color:#f4dfaa;
        font-size:1.25rem;
        font-weight:800;
        background:rgba(205,174,105,.09)
      }

      .aqeq-pc-period{
        display:inline-block;
        margin:12px 0 8px;
        padding:5px 9px;
        border-radius:999px;
        background:rgba(255,255,255,.055);
        color:#d8deeb;
        font-size:.78rem
      }

      .aqeq-pc-copy{
        font-size:.9rem;
        line-height:1.8;
        color:#d6dceb
      }

      .aqeq-pc-copy p{
        margin:6px 0
      }

      .aqeq-pc-debts{
        margin-top:14px
      }

      .aqeq-pc-debt{
        padding:13px 0;
        border-top:1px solid rgba(255,255,255,.09)
      }

      .aqeq-pc-debt:first-child{
        border-top:0
      }

      .aqeq-pc-empty{
        padding:15px;
        border:1px dashed rgba(210,190,137,.3);
        border-radius:14px;
        color:#c5ccda;
        line-height:1.8
      }

      @media(max-width:600px){
        .aqeq-pc-grid{
          grid-template-columns:1fr
        }

        .aqeq-pc-card{
          padding:14px
        }
      }
    `;

    document.head.appendChild(style);
  }

  function renderPinnaclesChallenges(
    day,
    month,
    birthYear,
    lifePathNumber,
    nameCalculation
  ) {
    if (
      !root.AqeqPinnaclesChallenges ||
      !Number.isInteger(Number(birthYear))
    ) {
      return "";
    }

    ensurePinnacleStyles();

    const result =
      root.AqeqPinnaclesChallenges.calculatePinnaclesChallenges(
        Number(day),
        Number(month),
        Number(birthYear),
        Number(lifePathNumber)
      );

    const debts =
      root.AqeqPinnaclesChallenges.collectKarmicDebts(
        Number(day),
        Number(month),
        Number(birthYear),
        Number(lifePathNumber),
        nameCalculation
      );

    function card(item, kind) {
      const title =
        kind === "pinnacle"
          ? "القمة " + item.index
          : "التحدي " + item.index;

      const eyebrow =
        kind === "pinnacle"
          ? "PINNACLE"
          : "CHALLENGE";

      const period = item.period
        ? item.period.label
        : "";

      const desc =
        kind === "pinnacle"
          ? "رقم القمة " +
            item.value +
            (item.isMaster ? " رقم رئيسي" : "") +
            ". تُقرأ هذه المرحلة رمزيًا من خلال موضوعات الرقم، لا باعتبارها تنبؤًا حتميًا."
          : "رقم التحدي " +
            item.value +
            ". يمكن استخدامه كسؤال للتأمل في المهارات التي تحتاج وعيًا وتدريبًا خلال هذه المرحلة.";

      return (
        '<article class="aqeq-pc-card">' +
          '<div class="aqeq-pc-card-head">' +
            '<div>' +
              '<span class="aqeq-pc-eyebrow">' +
                eyebrow +
                ' · ' +
                String(item.index).padStart(2, "0") +
              '</span>' +
              '<h4>' +
                escapeHTML(title) +
              '</h4>' +
            '</div>' +
            '<span class="aqeq-pc-number">' +
              escapeHTML(item.value) +
            '</span>' +
          '</div>' +
          '<span class="aqeq-pc-period">' +
            escapeHTML(period) +
          '</span>' +
          '<div class="aqeq-pc-copy"><p>' +
            escapeHTML(desc) +
          '</p></div>' +
        '</article>'
      );
    }

    const pinnacleCards = result.pinnacles
      .map(function (item) {
        return card(item, "pinnacle");
      })
      .join("");

    const challengeCards = result.challenges
      .map(function (item) {
        return card(item, "challenge");
      })
      .join("");

    const debtHTML = debts.found
      ? debts.items
          .map(function (item) {
            return (
              '<div class="aqeq-pc-debt">' +
                '<div class="aqeq-pc-card-head">' +
                  '<div>' +
                    '<span class="aqeq-pc-eyebrow">' +
                      'KARMIC DEBT · ' +
                      escapeHTML(
                        item.source.replace(/_/g, " ")
                      ) +
                    '</span>' +
                    '<h4>' +
                      escapeHTML(item.title) +
                    '</h4>' +
                  '</div>' +
                  '<span class="aqeq-pc-number">' +
                    escapeHTML(
                      item.debt + "/" + item.root
                    ) +
                  '</span>' +
                '</div>' +
                '<div class="aqeq-pc-copy">' +
                  '<p>' +
                    escapeHTML(item.detail) +
                  '</p>' +
                  '<p>' +
                    escapeHTML(item.theme) +
                  '</p>' +
                '</div>' +
              '</div>'
            );
          })
          .join("")
      : '<div class="aqeq-pc-empty">لم يظهر رقم 13 أو 14 أو 16 أو 19 كقيمة مركبة مباشرة قبل الاختزال في المصادر المفحوصة. ده لا يعني وجود أو غياب صفة شخصية؛ هو فقط نتيجة قاعدة الفحص الحسابية.</div>';

    return (
      '<section class="aqeq-pc-wrap">' +
        '<div class="aqeq-pc-heading">' +
          '<span class="aqeq-name-kicker">' +
            'AQEQ ASTRO · LIFE CYCLES' +
          '</span>' +
          '<h3>القمم والتحديات</h3>' +
          '<p>أربع قمم وأربع تحديات موزعة على مراحل العمر وفق قاعدة 36 − جذر مسار الحياة.</p>' +
        '</div>' +

        '<div class="aqeq-pc-grid">' +
          pinnacleCards +
        '</div>' +

        '<div class="aqeq-pc-heading" style="margin-top:22px">' +
          '<h3>التحديات الأربعة</h3>' +
          '<p>فروق مطلقة بين أرقام الشهر واليوم والسنة المختزلة.</p>' +
        '</div>' +

        '<div class="aqeq-pc-grid">' +
          challengeCards +
        '</div>' +

        '<div class="aqeq-pc-heading" style="margin-top:22px">' +
          '<h3>فحص الديون الكارمية</h3>' +
          '<p>الفحص هنا حسابي ورمزي، ويعتمد على الأرقام المركبة الظاهرة قبل الاختزال فقط.</p>' +
        '</div>' +

        '<article class="aqeq-pc-card aqeq-pc-debts">' +
          debtHTML +
        '</article>' +

        '<p class="aqeq-pc-note">' +
          'ملاحظة منهجية: علم الأعداد إطار رمزي للتأمل وليس أداة علمية مثبتة أو حكمًا على المصير. طريقة الاحتفاظ بالأرقام الرئيسية وفحص الديون محددة داخل محرك عقيق أسترو.' +
        '</p>' +
      '</section>'
    );
  }

  function numberLabel(result) {
    if (!result || result.value == null) {
      return "غير متاح";
    }

    return (
      String(result.value) +
      (result.isMaster ? " · رقم رئيسي" : "")
    );
  }

  async function render(name, resultRoot, birthContext) {
    if (!resultRoot) return;

    const old = resultRoot.querySelector(
      ".aqeq-name-readings"
    );

    if (old) old.remove();

    const section = document.createElement("section");

    section.className = "aqeq-name-readings";
    section.setAttribute("aria-live", "polite");

    section.innerHTML =
      '<div class="aqeq-name-heading">' +
        '<span class="aqeq-name-kicker">' +
          'AQEQ ASTRO · NAME NUMBERS' +
        '</span>' +
        '<h3>بصمة اسمك</h3>' +
        '<p>تلات زوايا بتكمل قراءة مسار حياتك: الدافع الداخلي، صورتك قدام الناس، وطريقة التعبير عن مواهبك.</p>' +
      '</div>' +
      '<p class="aqeq-name-status">جاري تجهيز كروت الاسم…</p>';

    resultRoot.appendChild(section);

    const cleanName = String(name || "").trim();

    if (!cleanName) {
      section.querySelector(
        ".aqeq-name-status"
      ).textContent =
        "اكتب اسمك في خانة الاسم عشان تظهر قراءة رغبة الروح والشخصية الظاهرة والتعبير والقدر.";

      section.classList.add("is-empty");
      return;
    }

    try {
      if (
        !root.AqeqNameEngine ||
        typeof root.AqeqNameEngine.calculateNameNumbers !==
          "function"
      ) {
        throw new Error(
          "محرك حساب الاسم غير محمّل. تأكد من إضافة name_engine.js."
        );
      }

      const [nameData, calculation] = await Promise.all([
        loadData(),
        Promise.resolve(
          root.AqeqNameEngine.calculateNameNumbers(cleanName)
        )
      ]);

      // Avoid a stale async response overwriting a newer result.
      if (!section.isConnected) return;

      const groupsHTML = GROUPS.map(function (group) {
        const calculated = calculation[group.calcKey];

        const number =
          calculated && calculated.value != null
            ? String(calculated.value)
            : "";

        const entry =
          nameData.groups[group.key] &&
          nameData.groups[group.key].numbers &&
          nameData.groups[group.key].numbers[number];

        // Keep the interface usable if a reading is missing.
        if (
          !entry ||
          !Array.isArray(entry.cards) ||
          !entry.cards.length
        ) {
          const fallbackNumber = number || "1";

          const fallbackContent =
            group.key === "soul_urge"
              ? "عشان كتابة الاسم بالعربي غالبًا ما بتظهرش كل حروف العلة القصيرة، بنستخدم الاسم كاملًا كبديل حسابي عند غياب حروف العلة المكتوبة. خُد النتيجة كمدخل رمزي للتأمل، مش كحكم ثابت على شخصيتك."
              : "القراءة التفصيلية للرقم ده قيد المراجعة. الرقم محسوب، ويمكنك استخدامه كمدخل رمزي للتأمل في الدوافع والاختيارات.";

          return (
            '<article class="aqeq-name-group aqeq-name-fallback">' +
              '<header>' +
                '<div>' +
                  '<h4>' +
                    escapeHTML(group.label) +
                  '</h4>' +
                  '<p>' +
                    escapeHTML(group.sub) +
                  '</p>' +
                '</div>' +
                '<span class="aqeq-name-number">' +
                  escapeHTML(fallbackNumber) +
                '</span>' +
              '</header>' +
              '<article class="aqeq-reading-card">' +
                '<div class="aqeq-reading-card-top">' +
                  '<span class="aqeq-card-index">01</span>' +
                  '<h5>قراءة تمهيدية</h5>' +
                '</div>' +
                '<div class="aqeq-reading-content">' +
                  contentToHTML(fallbackContent) +
                '</div>' +
              '</article>' +
            '</article>'
          );
        }

        const cardsHTML = entry.cards
          .map(function (card, index) {
            return (
              '<article class="aqeq-reading-card">' +
                '<div class="aqeq-reading-card-top">' +
                  '<span class="aqeq-card-index">0' +
                    (index + 1) +
                  '</span>' +
                  '<h5>' +
                    escapeHTML(
                      card.title || ("الكارت " + (index + 1))
                    ) +
                  '</h5>' +
                '</div>' +
                '<div class="aqeq-reading-content">' +
                  contentToHTML(card.content) +
                '</div>' +
              '</article>'
            );
          })
          .join("");

        return (
          '<article class="aqeq-name-group">' +
            '<header>' +
              '<div>' +
                '<h4>' +
                  escapeHTML(
                    nameData.groups[group.key].label ||
                    group.label
                  ) +
                '</h4>' +
                '<p>' +
                  escapeHTML(group.sub) +
                '</p>' +
              '</div>' +
              '<span class="aqeq-name-number">' +
                escapeHTML(numberLabel(calculated)) +
              '</span>' +
            '</header>' +
            '<div class="aqeq-reading-grid">' +
              cardsHTML +
            '</div>' +
          '</article>'
        );
      }).join("");

      section.innerHTML =
        '<div class="aqeq-name-heading">' +
          '<span class="aqeq-name-kicker">' +
            'AQEQ ASTRO · NAME NUMBERS' +
          '</span>' +
          '<h3>بصمة اسم ' +
            escapeHTML(cleanName) +
          '</h3>' +
          '<p>قراءة رمزية للتأمل وفهم الذات، بتكمل مسار حياتك ولا تستبدله.</p>' +
        '</div>' +
        '<div class="aqeq-name-groups">' +
          groupsHTML +
        '</div>';

      if (
        birthContext &&
        Number.isInteger(Number(birthContext.day)) &&
        Number.isInteger(Number(birthContext.month)) &&
        Number.isInteger(Number(birthContext.year)) &&
        birthContext.day >= 1 &&
        birthContext.day <= 31 &&
        birthContext.month >= 1 &&
        birthContext.month <= 12
      ) {
        const expressionNumber =
          calculation.expression &&
          calculation.expression.value;

        if (
          expressionNumber != null &&
          birthContext.lifePath != null
        ) {
          section.insertAdjacentHTML(
            "beforeend",
            renderExtraReadings(
              Number(birthContext.day),
              Number(birthContext.month),
              Number(birthContext.year),
              Number(birthContext.lifePath),
              Number(expressionNumber),
              nameData
            )
          );

          if (
            birthContext.birthYear != null &&
            root.AqeqPinnaclesChallenges
          ) {
            section.insertAdjacentHTML(
              "beforeend",
              renderPinnaclesChallenges(
                Number(birthContext.day),
                Number(birthContext.month),
                Number(birthContext.birthYear),
                Number(birthContext.lifePath),
                calculation
              )
            );
          }
        }
      }
    } catch (error) {
      if (!section.isConnected) return;

      const status =
        section.querySelector(".aqeq-name-status") ||
        document.createElement("p");

      status.className =
        "aqeq-name-status aqeq-name-error";

      status.textContent =
        error && error.message
          ? error.message
          : "حصلت مشكلة أثناء تحميل قراءات الاسم. راجع ملفات الموقع وحاول تاني.";

      if (!status.parentNode) {
        section.appendChild(status);
      }
    }
  }

  root.AqeqNameReadings = Object.freeze({
    render: render,
    loadData: loadData,
    calculatePersonalYear: calculatePersonalYear,
    calculateBirthdayNumber: calculateBirthdayNumber,
    calculateMaturityNumber: calculateMaturityNumber,
    renderPinnaclesChallenges: renderPinnaclesChallenges,
    extraReadings: EXTRA_READINGS
  });
})(window);
