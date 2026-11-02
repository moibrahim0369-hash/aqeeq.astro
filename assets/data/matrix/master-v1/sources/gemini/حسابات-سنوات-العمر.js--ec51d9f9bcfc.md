# حسابات-سنوات-العمر.js

**Source:** gemini

**Original path:** `المصفوفة جميناي/​محركات-الحسابات/حسابات-سنوات-العمر.js.docx`

---

مشروع-عقيق-أسترو/
└── محركات-الحسابات/
    ├── حسابات-مصفوفة-القدر.js       <-- حسابات الأركان والنواة والخطوط
    ├── محرك-توليد-التقرير.js        <-- سحب نصوص التقرير آلياً
    ├── رسم-مصفوفة-القدر.js          <-- رسم الـ SVG التفاعلي
    └── حسابات-سنوات-العمر.js        <-- حسابات دورات وسنوات العمر
/**
 * محرك حساب دورات وسنوات العمر في مصفوفة القدر - عقيق أسترو
 * يوزع طاقات العمر على محيط الدائرة من سن 0 إلى 80 سنة
 */

// دالة الاختزال إلى 22
function reduceTo22(num) {
  let val = num;
  while (val > 22) {
    val = val
      .toString()
      .split('')
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }
  return val;
}

/**
 * حساب طاقات محيط الدائرة لكل فترات العمر (العقدية والفرعية)
 */
export function calculateAgeMap(matrixCorePoints, ancestralSquare) {
  const { left, top, right, bottom } = matrixCorePoints;
  const { fatherSpiritual, motherSpiritual, fatherMaterial, motherMaterial } = ancestralSquare;

  // 1. النقاط الرئيسية لكل 10 و 20 سنة
  const age0 = left;              // نقطة اليسار
  const age10 = fatherSpiritual;  // الركن العلوي الأيسر
  const age20 = top;              // نقطة الأعلى
  const age30 = motherSpiritual;  // الركن العلوي الأيمن
  const age40 = right;            // نقطة اليمين
  const age50 = motherMaterial;   // الركن السفلي الأيمن
  const age60 = bottom;           // نقطة الأسفل
  const age70 = fatherMaterial;   // الركن السفلي الأيسر

  // 2. النقاط الوسيطة (السنوات بين كل عقد)
  const ageMap = {
    0: age0,
    10: age10,
    20: age20,
    30: age30,
    40: age40,
    50: age50,
    60: age60,
    70: age70,
    // فترات منتصف العقود (كل 5 سنوات)
    5: reduceTo22(age0 + age10),
    15: reduceTo22(age10 + age20),
    25: reduceTo22(age20 + age30),
    35: reduceTo22(age30 + age40),
    45: reduceTo22(age40 + age50),
    55: reduceTo22(age50 + age60),
    65: reduceTo22(age60 + age70),
    75: reduceTo22(age70 + age0)
  };

  return ageMap;
}

/**
 * دالة استخراج طاقة العمر الحالي للعميل
 */
export function getCurrentAgeEnergy(birthYear, birthMonth, birthDay, ageMap) {
  const today = new Date();
  let age = today.getFullYear() - birthYear;
  
  // ضبط دقيق للعمر بناءً على تاريخ اليوم
  const monthDiff = today.getMonth() + 1 - birthMonth;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay)) {
    age--;
  }

  // مصفوفة الأعوام المتاحة في الخريطة للبحث عن الأقرب
  const milestoneAges = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
  
  // البحث عن النطاق العمري المناسب
  let closestAgeMilestone = 0;
  for (let i = 0; i < milestoneAges.length - 1; i++) {
    if (age >= milestoneAges[i] && age < milestoneAges[i + 1]) {
      closestAgeMilestone = milestoneAges[i];
      break;
    }
  }

  return {
    exactAge: age,
    activeEnergy: ageMap[closestAgeMilestone] || ageMap[0],
    milestone: closestAgeMilestone
  };
}
