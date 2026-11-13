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
