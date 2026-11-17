# طابور إعادة الكتابة: مسار الحياة (لشات الكتابة)

الأسلوب لكل الدفعات: عامية مصرية دافية ومباشرة، مخاطبة الشخص نفسه، تحليل نفسي سلوكي.
ممنوع: أعراض أو أمراض جسدية، كلمة «مفتاح/مفاتيح/طُعم»، عناوين فصحى جامدة، أقواس إنجليزية، تنبيهات أو «قراءة رمزية» (مكانها صفحة الشروط فقط).
الأطوال بعدد الحروف. كل نص يتسلّم بالمفتاح JSON الحرفي المذكور، دون تلخيص ودون حشو.
خرائط المواضع الكاملة: `docs/LIFEPATH_TEXT_AUDIT.md`. خانات الأرقام الفارغة: `docs/LIFEPATH_CONTENT_SLOTS.md`.

---

## الدفعة 1: بطاقات الاسم الضعيفة + باقي «مفتاح» والأعراض

### 1.1 `name_data.json` ← `groups.expression.numbers[N].cards[i].content`
الأضعف حالياً، مرتبة بالأولوية:

| المفتاح | الحالي | الهدف |
|---|---|---|
| `expression.numbers["4"].cards[2]` (التوازن العملي) | 331 | 950–1,050 |
| `expression.numbers["5"].cards[2]` | 377 | 950–1,050 |
| `expression.numbers["5"].cards[1]` (الظل العملي والرسالة) | 388 | 1,200–1,300 |
| `expression.numbers["6"].cards[2]` | 411 | 950–1,050 |
| `expression.numbers["4"].cards[1]` | 413 | 1,200–1,300 |
| `expression.numbers["6"].cards[1]` | 446 | 1,200–1,300 |
| `expression.numbers["5"].cards[0]` (الجوهر والموهبة) | 681 | 1,100–1,200 |
| `expression.numbers["4"].cards[0]` | 724 | 1,100–1,200 |
| `expression.numbers["6"].cards[0]` | 782 | 1,100–1,200 |

ثم الشخصية: `personality.numbers["7"].cards[1]` (683) و`["4"].cards[1]` (715) و`["5"].cards[1]` (744) و`["6"].cards[1]` (774) و`["1"].cards[1]` (785)، الهدف 900–1,000 لكل بطاقة.

عناوين البطاقة 3 اتغيرت خلاص إلى: «إزاي توازن حياتك العملية؟» (التعبير) و«إزاي توازن نفسك من جوه؟» (الروح) و«إزاي تتعامل مع الناس صح؟» (الشخصية). الجمل اللي كانت بادئة بـ«مفتاحك:» بقت تبدأ مباشرة بالفكرة؛ ممكن تتحسن صياغتها أثناء إعادة الكتابة.

### 1.2 «مفتاح» المتبقية (تحتاج استبدال)
| الملف والموضع | العبارة |
|---|---|
| `page-06.js` `LP_COMPLETE_SOURCE.2.4` وما يشبهها | «ومفتاحها في إيدك» (٤ مواضع في سطر LP_COMPLETE_SOURCE) |
| `page-06.js` L331 (بطاقة «الشيطان»، حقل `real`) | «المفتاح في إيدك مش في إيد حد» |
| `page-06.js` `lpHTML` قوالب الرقم 1 و2 | «مفاتيح النور/الضل» و«مفاتيح للعلاقة» (L3170, L3180, L3211) |
| `page-06.js` L953 | «هو مفتاح التوازن» |
| `page-06.js` L2807 و L2812 | «مفتاح التفريغ السوماتيكي» و«مفتاح التحول» |
| `pinnacles_challenges.js` `PINNACLE_READINGS.8.invest` | «أهم مفتاح للنجاح هنا هو» |
| `name_readings.js` `BIRTHDAY_MATURITY_READINGS.maturity.8.sections[0]` | «مفاتيح القوة والجاه والمكانة» |
| `name_readings.js` `BIRTHDAY_MATURITY_READINGS.maturity.*.sections[3].title` | بقت «تعمل إيه عشان تظبط طاقتك؟» (اتعدلت) |

### 1.3 أعراض/أمراض جسدية متبقية (تُكتب بدائل نفسية سلوكية بنفس الطول تقريباً)
المصدر الكامل: القسم B في `docs/LIFEPATH_TEXT_AUDIT.md`. أهمها:
- `page-06.js` `LP_COMPLETE_SOURCE.2.1` (تمرض وتكتئب)، `.2.6` (مرض التردد)، `.4.3` (توتر عضلي، أوجاع الظهر، القولون)، `.5.6` (الأرق)، `.6.6` (الصداع النصفي)، `.7.3` (أمراض جسدية)، `.9.4`.
- `LP_MASTER_SOURCE_1_3.11.3` (الصدر والمعدة)، `4_7.11.6` (صداع نصفي، توتر عضلي)، `4_7.22.6` (عضلات الرقبة والضهر والجهاز الهضمي، مساج)، `4_7.33.5` (أمراض نفسية وجسدية).
- `name_data.json` `personal_years.numbers["4"].sections[3].content` (المرض).
- `pinnacles_challenges.js` `PINNACLE_READINGS.2.shadow` (مرض جسدي)، `.11.psyche` (نوبات قلق)، `KARMIC_DEBT_READINGS.14.pattern` (مرض).
- `name_readings.js` `BIRTHDAY_MATURITY_READINGS.birthday.2.sections[1]` (صداع ووجع معدة)، `birthday.11.sections[1]` (نوبات قلق)، `maturity.6.sections[0]` (الرعاية الصحية).

---

## الدفعة 2: القمم والتحديات

### 2.1 `pinnacles_challenges.js` ← `PINNACLE_READINGS[N]` (N = 1–9, 11, 22, 33)
الحقول الحالية: `title, essence, energy, psyche, invest, shadow, reflection`.

| الحقل | الحالي (أدنى/متوسط/أعلى) | الهدف |
|---|---|---|
| `energy` | 361 / 412 / 507 | 450–520 |
| `psyche` | 277 / 348 / 438 | 400–460 |
| `invest` | 265 / 319 / 366 | 320–380 |
| `shadow` | 297 / 328 / 358 | 330–380 |
| `reflection` | 70 / 85 / 104 | 90–130 (سؤال تأمل ذاتي عميق واحد، مش اتنين) |
| **`light` (جديد)** | لا يوجد | 280–340: قطب النور، يعني الشكل الناضج لنفس الطاقة |
| **`reallife` (جديد)** | لا يوجد | 280–340: سلوك حقيقي في الحياة اليومية (موقف شغل أو بيت أو علاقة بتتعرف عليه) |

### 2.2 `CHALLENGE_READINGS[N]` (N = 0–8)
الحقول الحالية: `title, essence, root, lesson, skills, practice`.

| الحقل | الحالي | الهدف |
|---|---|---|
| `root` | 206 / 266 / 328 | 300–350 |
| `lesson` | 175 / 192 / 235 | 250–300 |
| `practice` | 167 / 210 / 260 | 260–320 |
| `skills` | 67 / 88 / 101 | 90–120 |
| **`light` (جديد)** | لا يوجد | 250–300 |
| **`reallife` (جديد)** | لا يوجد | 250–300 |
| **`reflection` (جديد)** | لا يوجد | 90–130 |

### 2.3 `KARMIC_DEBT_READINGS[13|14|16|19]` (اختياري بعد ما يخلص 2.1 و2.2)
`origin` 235، `pattern` 254، `lesson` 169، `release` 236: يتحافظ على نفس الأطوال مع صياغة أدفى.

ملاحظة للكود: الحقول الجديدة (`light`, `reallife`, `reflection` للتحديات) محتاجة سطر عرض في `lifepath-sheet.js` أو `pinnacles_challenges.js`؛ لحد ما تتسلم، تفضل مخفية.

---

## الدفعة 3: النضج وعيد الميلاد

### 3.1 `name_readings.js` ← `BIRTHDAY_MATURITY_READINGS.maturity[N]` و`.birthday[N]`
البنية: `{ number, title, subtitle, sections: [ {title, content}, ... ] }`، الأرقام 1–9, 11, 22.
القسم 1: 400–450، القسم 2: 300–330، القسم 3: 220–250، القسم 4: 150–180 (المجموع 1,100–1,200).
أولوية الإعادة: `birthday.2.sections[1]`، `birthday.11.sections[1]`، `maturity.6.sections[0]`، `maturity.8.sections[0]` (فيها ألفاظ ممنوعة)، ثم كل `title` اللي لسه فصحى جامدة.

### 3.2 `EXTRA_DEEP_READINGS`
| المفتاح | الحالي | الهدف |
|---|---|---|
| `birthday[N].essence` | 154–192 | 260–320 |
| `birthday[N].shadow` | 133–171 | 220–280 |
| `birthday[N].growth` | 136–191 | 220–280 |
| `birthday[N].reflection` | 57–94 | 90–130 |
| `maturity[N].essence` | 146–175 | 260–320 |
| `maturity[N].shadow` | 102–131 | 220–280 |
| `maturity[N].practice` | 108–170 | 220–280 |
| `maturity[N].reflection` | 53–77 | 90–130 |

N = 1–9, 11, 22, 33.

### 3.3 `EXTRA_READINGS` (فصحى جافة تتحول لعامية دافية، بنفس الطول تقريباً أو أطول بقدر بسيط)
`personalYear[1–9]`: `title` 11–19، `energy` 53–76، `opportunities` 53–73، `avoid` 49–74.
`birthday[N]`: `title`، `skill` 57–90، `practice` 48–72.
`maturity[N]`: `title`، `mature` 59–75، `balance` 40–58.

### 3.4 `name_data.json` ← `maturity_extra.numbers["11"|"22"|"33"]` (خانات فارغة)
`{ number, title, subtitle, sections: [{title, content}] }` بـ4 أقسام لكل رقم (400–450 / 300–330 / 220–250 / 150–180).

---

## الدفعة 4: اللمحات المجانية والحلول والفترات الشخصية

### 4.1 `page-06.js` ← `LP_FREE[2..9]` (`t` و`tag` يفضلوا زي ما هم)
| الحقل | الحالي | الهدف |
|---|---|---|
| `essence` | 125–472 | 450–520 |
| `light` | 109–136 | 260–320 |
| `shadow` | 82–189 | 260–320 |

### 4.2 `assets/js/life-path-data.js` ← `blueprint[i].solution` (لكل رقم)
الحالي جملة واحدة جافة (44–90 حرف، المتوسط 69، 36 حل). الهدف: 220–280 حرف لكل `solution`، خطوة عملية محددة بمشهد حياتي، و`challenge` يفضل كما هو.

### 4.3 `name_data.json` ← `personal_years.numbers[1..9].sections[i].content`
الحالي 262–312 للقسم، 4 أقسام (مجموع 1,160–1,500). الهدف: نفس البنية بنفس الأطوال، وتبديل أي عبارة فصحى أو «طاقة» عامة بمشهد يومي.

### 4.4 الخانات الفارغة الجديدة (راجع `LIFEPATH_CONTENT_SLOTS.md` للبنية)
- `personal_months.numbers["1".."9","11","22"]`: 3 أقسام (نبض الشهر / ماذا تفعل / انتبه لـ) 230–300 لكل قسم.
- `personal_days.numbers["1".."9","11","22"]`: قسمان (طاقة اليوم / كيف تتصرف فيه) 170–250 لكل قسم.
- `maturity_extra`: انظر 3.4.

بعد كل دفعة: `node tests/personal-periods.test.js` و`node tests/targeted-fixes.test.js` و`node tests/lifepath-core.test.js`.
