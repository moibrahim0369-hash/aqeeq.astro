# معمارية النظام — عقيق أسترو
**Aqeeq Astro System Architecture**

**التاريخ:** 2026-10-29
**الحالة:** ✅ المرحلة الأولى مكتملة
**الإصدار:** 1.0.0

---

## 📐 الرؤية المعمارية

النظام مقسّم إلى **ثلاث طبقات منفصلة تماماً:**

```
┌─────────────────────────────────────────────┐
│        مصفوفة القدر (22 Arcana)             │
│   Matrix of Destiny — Natalia Ladini        │
└────────────────────┬────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼────────┐      ┌──────▼──────┐
    │ Calculation │      │   Content   │
    │   Engine    │      │   Library   │
    │  (22 ↔ 22)  │      │   (CMS)     │
    └─────────────┘      └─────────────┘

┌─────────────────────────────────────────────┐
│   مسار الحياة (1-9) — منفصل تماماً          │
│   Life Path Numerology — Future Module     │
│   (سيُضاف لاحقاً عند الحاجة)                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         أنظمة فلكية أخرى (Future)           │
│   Transits, Birth Chart, Compatibility... │
└─────────────────────────────────────────────┘
```

---

## 1️⃣ طبقة مصفوفة القدر (Matrix Destiny)

### الملفات الأساسية

```
assets/js/
├── matrix-method-adapter.js          ← 🔴 المصدر الموحد للحسابات
│   ├─ reduceArcana()                 (اختزال إلى 22)
│   ├─ calculateDestinyMatrix()        (9 مواضع)
│   ├─ calculateGenerationalLines()    (الخطوط الجيلية)
│   ├─ calculateDestinyAxes()          (المحاور الأربع)
│   └─ ARCANA_DATA                    (معلومات الـ 22 Arcana)
│
├── numerology-matrix.js              ← الواجهة والعرض
│   ├─ يستدعي matrix-method-adapter.js
│   ├─ renderSVG()                    (عرض المصفوفة)
│   ├─ renderAdvancedSections()       (الشاكرات والخطوط)
│   └─ معالجة الأخطاء
│
├── matrix-loader.js                  ← تحميل النصوص
│   └─ تحميل arcana-*.json عند الطلب
│
└── matrix-complete-system.js         ← 📋 WIP (نظام متقدم)
    └─ سيُدمج بعد اكتمال الأساس

assets/data/
├── matrix/
│   ├── core.json                     ← قائمة الـ 22 Arcana
│   ├── arcana-01.json ... arcana-22.json
│   └── README.md
│
├── matrix-calculations-reference.json ← أمثلة اختبار معيارية
│
└── [matrix-content-library/]         ← 📋 قيد الإعداد
    └─ سيُضاف المحتوى هنا لاحقاً

docs/
├── MATRIX_METHOD_SPECIFICATION.md    ← المواصفات الرسمية
├── MATRIX_SYSTEM_STATUS.md           ← تقرير الحالة
└── ARCHITECTURE.md                   ← هذا الملف
```

### سير العمل الحسابي

```
1. المستخدم يدخل تاريخ الميلاد
   ↓
2. normalizeBirthDate() [matrix-method-adapter.js]
   ↓
3. calculateDestinyMatrix() [matrix-method-adapter.js]
   ├─ reduceArcana(day) → A
   ├─ reduceArcana(month) → B
   ├─ reduceArcana(digitSum(year)) → C
   ├─ reduceArcana(A+B+C) → D
   └─ (وهكذا...)
   ↓
4. النتيجة: {nodes, anchors, lines, ...}
   ↓
5. renderSVG() + renderAdvancedSections() [numerology-matrix.js]
   ↓
6. العرض على الواجهة
```

### قاعدة الاختزال (الموحدة)

```javascript
// المصدر الوحيد: matrix-method-adapter.js
function reduceArcana(value) {
  let n = Math.abs(Math.trunc(value));
  while (n > 22) n = digitSum(n);
  return n || 22;
}
```

**لا تكرار** في أي مكان آخر.

---

## 2️⃣ طبقة المحتوى (Content Layer)

### الهيكل (الحالي)

```
data.json
├── matrix_content_library
│   └── sections:
│       ├── personal_qualities    (مجاني)
│       ├── previous_life          (مجاني)
│       ├── life_scenario          (مدفوع)
│       ├── talents                (مدفوع)
│       ├── destiny                (مدفوع)
│       └── ... (15 قسم إجمالي)

assets/data/matrix/
├── core.json                      ← قائمة الأقسام والأركانا
├── arcana-01.json ... arcana-22.json
│   └─ كل ملف: {id, chakras: {chakra_key: {psychology, shadowTrap, ...}}}
└── README.md
```

### هيكل Placeholder (الحالي)

كل قسم يحتوي على:
```json
{
  "ar": "العنوان بالعربية",
  "en": "English Title",
  "description": "الوصف",
  "is_paid": false,
  "content_placeholder": "PLACEHOLDER: [ready for content]"
}
```

### متى سيُضاف المحتوى

1. **Phase 2A:** بعد اكتمال النظام الحسابي (الآن ✅)
2. **Phase 2B:** كتابة النصوص للـ 15 قسم
3. **Phase 3:** دمج النصوص في arcana-*.json
4. **Phase 4:** CMS متقدم (إذا لزم الأمر)

---

## ❌ طبقة Life Path Numerology (مستقبلية)

### الحالة الحالية

```
❌ غير موجودة
⏸️ منفصلة تماماً عن Matrix
📋 سيُضاف في ملف منفصل لاحقاً
```

### عند الإضافة (في المستقبل)

```
assets/js/
└── life-path-numerology.js          ← ملف منفصل تماماً
    ├─ reduceLifePath()              (اختزال إلى 1-9)
    ├─ calculateLifePath()
    ├─ MASTER_NUMBERS (11, 22, 33)
    └─ لا علاقة به مع Matrix
```

**قاعدة ذهبية:**
```
Life Path (1-9) ≠ Matrix (22)
لا يختلطان أبداً
```

---

## 🔄 مسار النقل والتطور

### الآن ✅ (Phase 1-2 مكتملة)

```
✅ Natalia Ladini (22 Arcana) = المعيار الرسمي
✅ matrix-method-adapter.js = المصدر الموحد
✅ data.json = مُنظّف من الخلط الفيثاغوري
✅ Placeholder Keys = جاهزة للمحتوى
✅ ARCHITECTURE.md = موثقة
```

### الخطوة التالية (Phase 3)

```
[ ] 1. كتابة المحتوى (النصوص الـ 15 قسم)
[ ] 2. دمج في arcana-*.json
[ ] 3. اختبار شامل
[ ] 4. تفعيل Paywall
```

### المستقبل (Phase 4+)

```
[ ] Life Path Numerology (ملف منفصل)
[ ] نظام التوافق (Compatibility)
[ ] الخريطة الفلكية الكاملة
[ ] Transits والتنبؤات
```

---

## 🛠️ قواعد التطوير

### ✅ افعل

- ✅ **أضف حسابات جديدة إلى `matrix-method-adapter.js`**
- ✅ **استدعِ الـ Adapter من `numerology-matrix.js`**
- ✅ **فصل الأنظمة في ملفات منفصلة**
- ✅ **وثّق التغييرات في MATRIX_METHOD_SPECIFICATION.md**
- ✅ **أضف اختبارات في matrix-calculations-reference.json**

### ❌ لا تفعل

- ❌ **لا تكرر معادلات الاختزال في أماكن متعددة**
- ❌ **لا تخلط Matrix (22) مع Life Path (1-9)**
- ❌ **لا تعدّل قاعدة الاختزال بدون توثيق**
- ❌ **لا تضع Life Path في نفس الملف مع Matrix**
- ❌ **لا تستخدم `master_numbers_policy` من الفيثاغوري**

---

## 📊 خريطة التبعيات

```
index.html
├─ matrix-method-adapter.js     (يحمّل أولاً)
│  └─ يصدّر: AqeeqMatrixMethodAdapter
│
├─ numerology-matrix.js         (يحمّل ثانياً)
│  ├─ يستدعي: AqeeqMatrixMethodAdapter
│  └─ يصدّر: AqeeqNumerology
│
├─ matrix-loader.js             (يستقل)
│  └─ يصدّر: AqeeqMatrix
│
└─ [life-path-numerology.js]    (مستقبلياً)
   ├─ منفصل تماماً
   └─ لا يعتمد على Matrix
```

---

## 🚀 كيفية إضافة نظام جديد (مثال)

### إذا أردت إضافة Life Path Numerology

**1. أنشئ ملف منفصل:**
```javascript
// assets/js/life-path-numerology.js
(() => {
  'use strict';
  
  function reduceLifePath(value) {
    let n = Math.abs(Math.trunc(value));
    while (n > 9 && ![11,22,33].includes(n)) {
      n = String(n).split('').reduce((s,d) => s+Number(d), 0);
    }
    return n;
  }
  
  window.AqeeqLifePath = {
    reduceLifePath,
    calculateLifePath: (birthDate) => { /* ... */ }
  };
})();
```

**2. أضفه في `index.html`:**
```html
<!-- منفصل تماماً عن Matrix -->
<script src="assets/js/life-path-numerology.js"></script>
```

**3. توثّق في `data.json`:**
```json
{
  "life_path_numerology": {
    "status": "✅ فعّال",
    "file": "./assets/js/life-path-numerology.js",
    "reduction_rule": "1-9 مع Master Numbers",
    "separation": "منفصل تماماً عن Matrix"
  }
}
```

---

## 📝 الملفات المرجعية

| الملف | الغرض | القارئ |
|------|--------|--------|
| **MATRIX_METHOD_SPECIFICATION.md** | المواصفات الكاملة | المطورون، المراجعون |
| **MATRIX_SYSTEM_STATUS.md** | تقرير الحالة والخطوات | فريق المشروع |
| **ARCHITECTURE.md** | هذا الملف — المعمارية | فريق العمل، المساهمون الجدد |
| **matrix-calculations-reference.json** | أمثلة اختبار | المختبرون، المطورون |

---

## ✅ المرحلة الأولى: مكتملة

```
🎯 المعايير الموضوعة:
✅ Natalia Ladini (22 Arcana) = المعيار الرسمي
✅ matrix-method-adapter.js = المصدر الوحيد
✅ data.json = مُنظّف وجاهز
✅ numerology-matrix.js = متكامل مع Adapter
✅ index.html = ترتيب الحمل صحيح
✅ ARCHITECTURE.md = موثقة

🚀 جاهز للمرحلة الثانية:
   - كتابة المحتوى
   - اختبار شامل
   - تفعيل الـ Paywall
```

---

**آخر تحديث:** 2026-10-29
**الحالة:** معمارية موثقة وجاهزة للتطوير
