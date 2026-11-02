# قواعد ومعادلات مصفوفة القدر البرمجية بالكامل، مشروحة هندسياً ومكتوبة بكود جاهز للاستخدام المباشر في منصة «عقيق أسترو» (سواء كنت تبنيها بـ React، Node

**Source:** gemini

**Original path:** `المصفوفة جميناي/​محركات-الحسابات/قواعد ومعادلات مصفوفة القدر البرمجية بالكامل، مشروحة هندسياً ومكتوبة بكود جاهز للاستخدام المباشر في منصة «عقيق أسترو» (سواء كنت تبنيها بـ React، Node.docx`

---

قواعد ومعادلات مصفوفة القدر البرمجية بالكامل، مشروحة هندسياً ومكتوبة بكود جاهز للاستخدام المباشر في منصة «عقيق أسترو» (سواء كنت تبنيها بـ React، Node.js، أو JavaScript خام).
أولاً: القاعدة الرياضية الذهبية لمصفوفة القدر
أي جمع في مصفوفة القدر يخضع لقاعدة الاختزال إلى 22 (نظام الأركانا الكبرى):
 * إذا كان الناتج من 1 إلى 22، يُترك كما هو.
 * إذا كان الناتج أكبر من 22، نجمع خانات الرقم (أحاد + عشرات) حتى يصبح الرقم \le 22.
> مثال: 29 \rightarrow 2 + 9 = 11.
> مثال: 23 \rightarrow 2 + 3 = 5.
> مثال: 1999 \rightarrow 1 + 9 + 9 + 9 = 28 \rightarrow 2 + 8 = 10.
> 
ثانياً: النقاط الـ 5 المؤسسة (The Foundation Octagram)
كل الحسابات تبدأ من مدخل واحد: (يوم - شهر - سنة):
 * نقطة اليسار (الذات / الشخصية - الركن الغربي):
   * تُحسب من يوم الميلاد. (إذا ولد يوم 25 \rightarrow 2+5 = 7).
 * نقطة الأعلى (الروح / الاتصال الإلهي - الركن الشمالي):
   * تُحسب من شهر الميلاد. (شهر 9 \rightarrow 9).
 * نقطة اليمين (المادة / السعي الأرضي - الركن الشرقي):
   * تُحسب من مجموع خانات سنة الميلاد. (1999 \rightarrow 1+9+9+9 = 28 \rightarrow 2+8 = 10).
 * نقطة الأسفل (الذيل الكارمي الأساسي - الركن الجنوبي):
   * تُحسب بجمع الأركان الثلاثة: (يسار + أعلى + يمين).
   * في هذا المثال: 7 + 9 + 10 = 26 \rightarrow 2+6 = 8.
 * نقطة المركز (الجوهر / راحة الروح - النواة):
   * تُحسب بجمع الأركان الأربعة معاً: (يسار + أعلى + يمين + أسفل).
   * 7 + 9 + 10 + 8 = 34 \rightarrow 3+4 = 7.
ثالثاً: خط المال والعلاقات والحب (The Diagonal & Channels)
 * الذيل الكارمي المركب (الثلاثية في الأسفل):
   * الرقم الأساسي السفلي: C_1 (نقطة الأسفل).
   * الرقم الوسيط بين الأسفل والمركز: C_2 = \text{reduce}(C_1 + \text{المركز}).
   * الرقم الداخلي بين C_1 و C_2: C_3 = \text{reduce}(C_1 + C_2).
   * الثلاثية الناتجة [C_1, C_2, C_3] هي شفرة الذيل الكارمي (مثلاً: 18-6-5 أو 15-20-5).
 * خط المال والعلاقات (تقاطع المحور السفلي مع الأيمن):
   * نقطة دخول العلاقات (الحب): حاصل جمع (المركز + الرقم الداخلي للذيل).
   * نقطة دخول المال: حاصل جمع (المركز + النقطة الوسيطة لليمين).
   * نقطة التوازن والتقاطع المشترك (المهنة المثالية ومفتاح الزواج): حاصل جمع (نقطة الحب + نقطة المال).
رابعاً: الكود البرمجي الكامل الجاهز (JavaScript / TypeScript)
احفظ هذا الملف عندك باسم: destinyMatrixCalculator.js داخل مجلد الأدوات البرمجية src/utils/ أو المنطق الخلفي للمنصة:
/**
 * محرك حسابات مصفوفة القدر - منصة عقيق أسترو
 * برمجة وهندسة منطق مصفوفة الـ 22 أركانا
 */

// 1. الدالة الأساسية لاختزال الأرقام إلى 22
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

// 2. المحرك الرئيسي لحساب جميع إحداثيات ومواضع الخريطة
export function calculateDestinyMatrix(day, month, year) {
  // أ. النقاط الأربع الرئيسية والمركز
  const left = reduceTo22(day); // الشخصية والوعي الظاهر (اليسار)
  const top = reduceTo22(month); // الطاقة الروحية والأب الروحي (الأعلى)
  
  // اختزال سنة الميلاد
  const yearSum = year
    .toString()
    .split('')
    .map(Number)
    .reduce((a, b) => a + b, 0);
  const right = reduceTo22(yearSum); // المادة والمال والجسد (اليمين)

  // النقطة السفلية (قاعدة الكارما)
  const bottom = reduceTo22(left + top + right);

  // نقطة المركز (جوهر الروح وراحة القلب)
  const center = reduceTo22(left + top + right + bottom);

  // ب. حساب الذيل الكارمي المركب (Karmic Tail 3-Points)
  const karmicMiddle = reduceTo22(bottom + center);
  const karmicSub = reduceTo22(bottom + karmicMiddle);
  const karmicTailNumbers = [bottom, karmicMiddle, karmicSub];
  const karmicTailCode = `${bottom}-${karmicMiddle}-${karmicSub}`;

  // ج. خط العلاقات وخط المال
  // النقطة الوسيطة لخط اليمين المادي
  const rightMiddle = reduceTo22(right + center);

  // نقطة دخول الحب والزواج (Love Gateway)
  const lovePoint = reduceTo22(karmicMiddle + center);

  // نقطة دخول الوفرة والمال (Money Gateway)
  const moneyPoint = reduceTo22(rightMiddle + center);

  // نقطة الاتزان المشترك (التقاطع: البيزنس والعلاقة)
  const balancePoint = reduceTo22(lovePoint + moneyPoint);

  // د. خط السلالة (مربع الأجداد المائل - Ancestral Cross)
  const topLeftAncestral = reduceTo22(left + top); // خط الأب الروحي
  const topRightAncestral = reduceTo22(top + right); // خط الأم الروحي
  const bottomLeftAncestral = reduceTo22(left + bottom); // خط الأب المادي
  const bottomRightAncestral = reduceTo22(bottom + right); // خط الأم المادي

  // هـ. طاقات الغاية والقدر (Destiny Purposes)
  // 1. الغاية الشخصية (حتى عمر الأربعين): حاصل دمج السماء والأرض
  const heavenSky = reduceTo22(top + bottom);
  const earthGround = reduceTo22(left + right);
  const personalDestiny = reduceTo22(heavenSky + earthGround);

  // 2. الغاية الاجتماعية (للعالم والناس من 40 لـ 60): دمج خطوط الأجداد
  const maleLine = reduceTo22(topLeftAncestral + bottomRightAncestral);
  const femaleLine = reduceTo22(topRightAncestral + bottomLeftAncestral);
  const socialDestiny = reduceTo22(maleLine + femaleLine);

  // 3. الغاية الكونية العامة (الرسالة الكبرى في الحياة):
  const spiritualDestiny = reduceTo22(personalDestiny + socialDestiny);

  return {
    birthDate: `${day}/${month}/${year}`,
    corePoints: {
      left, // طاقة الشخصية واليوم
      top, // طاقة الروح والشهر
      right, // طاقة المادة وسنة الميلاد
      bottom, // النقطة الكارمية السفلية
      center // جوهر الروح
    },
    karmicTail: {
      code: karmicTailCode,
      numbers: karmicTailNumbers,
      lookupKey: `tail-${karmicTailCode}` // مطابق لأسماء الملفات الـ 26
    },
    channels: {
      love: lovePoint,
      money: moneyPoint,
      balance: balancePoint
    },
    ancestralSquare: {
      fatherSpiritual: topLeftAncestral,
      motherSpiritual: topRightAncestral,
      fatherMaterial: bottomLeftAncestral,
      motherMaterial: bottomRightAncestral
    },
    purposes: {
      personal: personalDestiny, // الغاية الذاتية
      social: socialDestiny, // الغاية الاجتماعية
      spiritual: spiritualDestiny // الرسالة العامة
    }
  };
}

خامساً: طريقة ربط الكود بالملفات الـ 26 تلقائياً
في ملف الحسابات تلاحظ وجود المتغير:
lookupKey: tail-${karmicTailCode}
في الواجهة البرمجية (Frontend أو API)، عندما يقوم المستخدم بإدخال تاريخ ميلاده، تستدعي الدالة:
const result = calculateDestinyMatrix(25, 9, 1999);

الناتج سيرجع لك مباشرة كود الذيل (مثلاً: tail-18-6-5 أو ما يطابقه)، ومن خلاله يقوم محرك الموقع بجلب ملف الـ Markdown المقابل له من مجلد destiny-matrix-karmic-tails/ وعرضه في تقرير المستخدم تلقائياً وبأعلى سرعة.
