/* AQEQ ASTRO · Pinnacles, Challenges & Karmic Debts v1.0.0
 * Symbolic numerology calculations. CommonJS + browser global.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AqeqPinnaclesChallenges = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MASTER_NUMBERS = new Set([11, 22, 33]);
  const MASTER_ROOTS = Object.freeze({ 11: 2, 22: 4, 33: 6 });

  const KARMIC_DEBTS = Object.freeze({
    13: {
      root: 4,
      title: "13/4 · البناء من خلال الانضباط",
      theme: "الاستمرارية، إتقان التفاصيل، وتحمل نتيجة الاختيارات."
    },
    14: {
      root: 5,
      title: "14/5 · الحرية المسؤولة",
      theme: "موازنة حب التجربة مع الالتزام والاعتدال."
    },
    16: {
      root: 7,
      title: "16/7 · مراجعة الأنا والصورة",
      theme: "التواضع، مراجعة الافتراضات، وبناء فهم أعمق للذات."
    },
    19: {
      root: 1,
      title: "19/1 · الاستقلال المتوازن",
      theme: "المبادرة مع التعاون، وطلب الدعم دون التخلي عن المسؤولية."
    }
  });

  function assertDate(day, month, year) {
    const d = Number(day);
    const m = Number(month);
    const y = Number(year);

    if (
      !Number.isInteger(d) ||
      !Number.isInteger(m) ||
      !Number.isInteger(y) ||
      y < 1 ||
      m < 1 ||
      m > 12 ||
      d < 1 ||
      d > new Date(y, m, 0).getDate()
    ) {
      throw new RangeError("تاريخ الميلاد غير صالح.");
    }

    return { day: d, month: m, year: y };
  }

  function digitSum(value) {
    return String(Math.abs(Math.trunc(Number(value))))
      .split("")
      .reduce(function (sum, digit) {
        return sum + Number(digit);
      }, 0);
  }

  function reduceNumber(value, preserveMaster) {
    let n = Math.abs(Math.trunc(Number(value)));

    if (!Number.isFinite(n)) {
      throw new TypeError("القيمة لازم تكون رقمًا صحيحًا.");
    }

    if (n === 0) {
      return {
        value: 0,
        root: 0,
        isMaster: false,
        rawTotal: Number(value)
      };
    }

    const rawTotal = n;

    while (n > 9) {
      if (preserveMaster && MASTER_NUMBERS.has(n)) {
        return {
          value: n,
          root: MASTER_ROOTS[n],
          isMaster: true,
          rawTotal: rawTotal
        };
      }

      n = digitSum(n);
    }

    return {
      value: n,
      root: n,
      isMaster: false,
      rawTotal: rawTotal
    };
  }

  function calculatePinnaclesChallenges(
    day,
    month,
    year,
    lifePathNumber
  ) {
    const dob = assertDate(day, month, year);

    const monthNumber = reduceNumber(dob.month, false).value;
    const dayNumber = reduceNumber(dob.day, false).value;

    const yearDigitTotal = digitSum(dob.year);
    const yearNumber = reduceNumber(yearDigitTotal, false).value;

    // القمة الأولى: الشهر + اليوم.
    const p1Raw = monthNumber + dayNumber;
    const p1 = reduceNumber(p1Raw, true);

    // القمة الثانية: اليوم + السنة.
    const p2Raw = dayNumber + yearNumber;
    const p2 = reduceNumber(p2Raw, true);

    // القمة الثالثة: القمة الأولى + القمة الثانية.
    const p3Raw = p1.value + p2.value;
    const p3 = reduceNumber(p3Raw, true);

    // القمة الرابعة: الشهر + السنة.
    const p4Raw = monthNumber + yearNumber;
    const p4 = reduceNumber(p4Raw, true);

    // تُحفظ الأرقام الرئيسية للعرض، ويُستخدم جذرها في حساب العمر.
    const suppliedLifePath = Number(lifePathNumber);

    const lifePathRoot = MASTER_NUMBERS.has(suppliedLifePath)
      ? MASTER_ROOTS[suppliedLifePath]
      : reduceNumber(suppliedLifePath, false).value;

    const firstPeakEnd = 36 - lifePathRoot;

    const periods = [
      {
        startAge: 0,
        endAge: firstPeakEnd,
        label: "من الميلاد حتى سن " + firstPeakEnd
      },
      {
        startAge: firstPeakEnd + 1,
        endAge: firstPeakEnd + 9,
        label:
          "من سن " +
          (firstPeakEnd + 1) +
          " إلى " +
          (firstPeakEnd + 9)
      },
      {
        startAge: firstPeakEnd + 10,
        endAge: firstPeakEnd + 18,
        label:
          "من سن " +
          (firstPeakEnd + 10) +
          " إلى " +
          (firstPeakEnd + 18)
      },
      {
        startAge: firstPeakEnd + 19,
        endAge: null,
        label: "من سن " + (firstPeakEnd + 19) + " فصاعدًا"
      }
    ];

    const pinnacleValues = [p1, p2, p3, p4];

    const pinnacles = pinnacleValues.map(function (result, index) {
      return {
        index: index + 1,
        value: result.value,
        root: result.root,
        isMaster: result.isMaster,
        rawTotal: [p1Raw, p2Raw, p3Raw, p4Raw][index],
        period: periods[index]
      };
    });

    // التحديات الأولى والثانية والرابعة.
    const challengeRaw = [
      Math.abs(monthNumber - dayNumber),
      Math.abs(dayNumber - yearNumber),
      null,
      Math.abs(monthNumber - yearNumber)
    ];

    const challengeValues = [
      reduceNumber(challengeRaw[0], false).value,
      reduceNumber(challengeRaw[1], false).value,
      null,
      reduceNumber(challengeRaw[3], false).value
    ];

    // التحدي الثالث: الفرق المطلق بين التحديين الأول والثاني.
    challengeRaw[2] = Math.abs(
      challengeValues[0] - challengeValues[1]
    );

    challengeValues[2] = reduceNumber(
      challengeRaw[2],
      false
    ).value;

    const challenges = challengeValues.map(function (value, index) {
      return {
        index: index + 1,
        value: value,
        rawTotal: challengeRaw[index],
        period: periods[index]
      };
    });

    return {
      birthDate: dob,

      inputs: {
        month: monthNumber,
        day: dayNumber,
        year: yearNumber,
        yearDigitTotal: yearDigitTotal
      },

      lifePath: {
        value: suppliedLifePath,
        root: lifePathRoot,
        firstPinnacleEndAge: firstPeakEnd
      },

      pinnacles: pinnacles,
      challenges: challenges,

      methodNotes: [
        "القيم الشهرية واليومية والسنوية تُختزل أولًا إلى رقم واحد.",
        "تُحفظ الأرقام الرئيسية 11 و22 و33 في عرض القمم، بينما تُستخدم جذورها في حساب العمر 36 − مسار الحياة.",
        "الفترات معروضة بأعمار صحيحة شاملة دون تداخل: القمة الأولى حتى نهاية العمر المحدد، ثم تبدأ القمة التالية في العمر الذي يليه."
      ]
    };
  }

  function collectKarmicDebts(
    day,
    month,
    year,
    lifePathNumber,
    nameCalculation
  ) {
    const dob = assertDate(day, month, year);
    const sources = [];

    const yearDigitTotal = digitSum(dob.year);

    const lifePathRaw =
      digitSum(dob.day) +
      digitSum(dob.month) +
      yearDigitTotal;

    function addIfDebt(rawValue, source, detail) {
      const raw = Number(rawValue);

      if (Number.isInteger(raw) && KARMIC_DEBTS[raw]) {
        const definition = KARMIC_DEBTS[raw];

        sources.push({
          debt: raw,
          root: definition.root,
          title: definition.title,
          theme: definition.theme,
          source: source,
          detail: detail || "",
          rawTotal: raw
        });
      }
    }

    // فحص يوم الميلاد قبل الاختزال.
    addIfDebt(
      dob.day,
      "birthday_day",
      "يوم الميلاد قبل الاختزال"
    );

    // فحص مجموع أرقام تاريخ الميلاد قبل الاختزال.
    addIfDebt(
      lifePathRaw,
      "life_path",
      "مجموع أرقام تاريخ الميلاد قبل الاختزال"
    );

    // فحص مجموعات أرقام الاسم التي يوفرها محرك الاسم.
    ["soulUrge", "personality", "expression"].forEach(
      function (key) {
        const item = nameCalculation && nameCalculation[key];

        // عند استخدام البديل الخاص برغبة الروح في الأسماء العربية،
        // قد يتكرر مجموع الاسم الكامل، لذلك نتجنب احتسابه مرتين.
        if (
          key === "soulUrge" &&
          item &&
          item.status ===
            "fallback_to_full_name_no_written_vowels"
        ) {
          return;
        }

        if (item && item.rawTotal != null) {
          addIfDebt(
            item.rawTotal,
            "name_" + key,
            "مجموع الاسم قبل الاختزال: " + item.rawTotal
          );
        }
      }
    );

    const unique = [];
    const seen = new Set();

    sources.forEach(function (entry) {
      const key = entry.debt + "|" + entry.source;

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(entry);
      }
    });

    return {
      found: unique.length > 0,
      items: unique,

      inspected: {
        birthdayDay: dob.day,
        lifePathRaw: lifePathRaw,
        lifePathDisplayed: Number(lifePathNumber),

        nameRawTotals: {
          soulUrge:
            nameCalculation && nameCalculation.soulUrge
              ? nameCalculation.soulUrge.rawTotal
              : null,

          personality:
            nameCalculation && nameCalculation.personality
              ? nameCalculation.personality.rawTotal
              : null,

          expression:
            nameCalculation && nameCalculation.expression
              ? nameCalculation.expression.rawTotal
              : null
        }
      },

      note:
        "هذا فحص وفق قاعدة عقيق المعلنة: تُسجَّل 13 و14 و16 و19 عندما تظهر كقيمة مركبة مباشرة قبل الاختزال في المصادر المفحوصة. مجرد ظهور الجذر 4 أو 5 أو 7 أو 1 لا يكفي."
    };
  }

  return Object.freeze({
    version: "1.0.0",
    KARMIC_DEBTS: KARMIC_DEBTS,
    reduceNumber: reduceNumber,
    calculatePinnaclesChallenges: calculatePinnaclesChallenges,
    collectKarmicDebts: collectKarmicDebts
  });
});
