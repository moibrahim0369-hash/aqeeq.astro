# مكتبة التفسيرات

ملف لكل كوكب: `data/interpretations/<body>.json` (sun.json, moon.json, saturn.json ...).
كل ملف مصفوفة كائنات، كائن لكل (جسم، بيت):

```json
{
  "id": "natal.core.saturn.house1",
  "version": 1,
  "status": "draft",
  "chart_type": "natal",
  "layer": "core",
  "body": "saturn",
  "house": 1,
  "sign": null, "modifier": null, "aspect": null,
  "summary_mode": null,
  "summary": "ملخص متفرع قصير",
  "text": "النص الكامل (حقل واحد محايد)",
  "placeholders": []
}
```

## قواعد الربط
- الاستعلام بالمفتاح: chart_type + layer + body + house (+ sign/modifier/aspect للطبقات الأخرى).
- ترتيب العرض: summary ثم text (core)، ثم sign_tint، ثم modifier، ثم aspect.
- النص يُعرض كما هو: العناوين بين `** **`، والقوائم بشرطة في أول السطر، والفقرات تُفصل بسطر فارغ.
- لا يُعرض نص إلا في سياقه: chart_type = natal لهذه الملفات.
- status = draft لا يُعرض في الإنتاج؛ approved فقط.

## التحقق
`node scripts/validate-interpretations.js` يفحص كل الملفات (الهيكل، تفرّد المفاتيح، اكتمال المعتمد).

## الطبقات والمفاتيح (ما تعرضه الصفحة فعلًا)
| الطبقة | المفتاح (id) | الملف | يظهر في |
|---|---|---|---|
| core | `natal.core.<body>.house<1..12>` | `<body>.json` | الكوكب داخل أكورديون بيته (summary ثم text) |
| sign_tint | `natal.sign_tint.<body>.<sign>` (أو `…<body>.house<n>.<sign>` للتخصيص بالبيت) | `<body>.json` | تحت النص الأساسي: "لون البرج" |
| modifier | `natal.modifier.<planet>.retrograde` | `<planet>.json` | تحت النص إذا الكوكب راجع |
| aspect | `natal.aspect.<أول>.<نوع>.<ثاني>` والحقل `aspect = "<نوع>.<ثاني>"` | ملف الكوكب الأول | أكورديون "الجوانب" تحت كل من الكوكبين |
| angle | `natal.angle.<asc/dsc/mc/ic>.<sign>` | `asc.json` ... | مجموعة "الزوايا" |

| house_cusp | `natal.house_cusp.house<1..12>.<sign>` (144) | `house_cusp.json` (body = `house_cusp`, مع `house` و`sign`) | داخل أكورديون البيت: "برج رأس البيت"، وهو نص البيت الخالي من الكواكب |
| sign_only | `natal.sign_only.<planet>.<sign>` (120: الكواكب العشرة × 12) | `<planet>.json` (مع `sign`) | الميلاد بلا ساعة: الكوكب في برجه بدون بيت. نص مستقل لا يشير إلى بيت |

- bodies: sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto, north_node, south_node, lilith, fortune.
- العقد/ليليث/نقطة الحظ: طبقة core بالبيت، وتظهر في مجموعة "العقد القمرية والنقاط الحساسة".
- الأبراج: aries taurus gemini cancer leo virgo libra scorpio sagittarius capricorn aquarius pisces.
- الجوانب: conjunction sextile square trine opposition، والجسم الأول هو الأسبق في الترتيب (sun, moon, mercury ...).
- `_manifest.json`: قائمة كل المفاتيح المطلوبة (617) وأين تُكتب وأين تظهر وحالتها. أعد توليده بـ `node scripts/gen-interpretation-manifest.js`.
- المكان الفارغ يظهر في الصفحة كخانة منقّطة بمفتاحه ما دام `SHOW_EMPTY_SLOTS = true` في `assets/js/interpretation-library.js`؛ اقلبه إلى false عند الإطلاق.
- وقت الميلاد المجهول: لا بيوت ولا زوايا ولا أي ذكر لبيت. يظهر قسم "الكواكب في أبراجها" بنصوص `sign_only` + الرجعية + الجوانب، وفي آخره جملة واحدة هادئة تدعو لإضافة الساعة.
