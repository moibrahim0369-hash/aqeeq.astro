/**
 * نظام مصفوفة القدر الكامل | Complete Matrix of Destiny System
 * عقيق أسترو | Aqeeq Astro
 *
 * المهمة: بناء نظام متكامل يدعم:
 * - الـ 15 قسم الرئيسية
 * - الخطوط الكاملة (الأب، الأم، المال، الحب، المواهب)
 * - التوافق بين شخصين
 * - الحسابات السنوية
 * - التوقعات والدروس الكارمية
 */

(() => {
  'use strict';

  // ==================== البنية الأساسية ====================

  const ARCANA_COUNT = 22;
  const SECTIONS_ARABIC = {
    personal_qualities: { ar: 'الصفات الشخصية', en: 'Personal Qualities', key: 'personal-qualities' },
    previous_life: { ar: 'الحياة السابقة', en: 'Previous Life', key: 'previous-life' },
    life_scenario: { ar: 'سيناريو الحياة', en: 'Life Scenario', key: 'life-scenario' },
    talents: { ar: 'المواهب', en: 'Talents', key: 'talents' },
    destiny: { ar: 'القدر والغاية', en: 'Destiny & Purpose', key: 'destiny' },
    money: { ar: 'المال والوفرة', en: 'Money & Abundance', key: 'money' },
    programs: { ar: 'البرامج العددية', en: 'Number Programs', key: 'programs' },
    magnetism: { ar: 'الجاذبية الشخصية', en: 'Personal Magnetism', key: 'magnetism' },
    parents: { ar: 'الوالدان والأصول', en: 'Parents & Origins', key: 'parents' },
    children: { ar: 'الأطفال والمستقبل', en: 'Children & Future', key: 'children' },
    relationships: { ar: 'العلاقات والارتباطات', en: 'Relationships', key: 'relationships' },
    life_guidance: { ar: 'إرشادات الحياة', en: 'Life Guidance', key: 'life-guidance' },
    year_forecast: { ar: 'التوقعات السنوية', en: 'Year Forecast', key: 'year-forecast' },
    personal_brand: { ar: 'العلامة الشخصية', en: 'Personal Brand', key: 'personal-brand' },
    health: { ar: 'الصحة والجسد', en: 'Health & Body', key: 'health' }
  };

  const LINES = {
    paternal: { ar: 'خط الأب', en: 'Paternal Line', positions: ['northEast', 'center', 'southWest'] },
    maternal: { ar: 'خط الأم', en: 'Maternal Line', positions: ['northWest', 'center', 'southEast'] },
    money: { ar: 'خط المال', en: 'Money Line', positions: ['northEast', 'center', 'southWest'] },
    love: { ar: 'خط الحب', en: 'Love Line', positions: ['northWest', 'center', 'southEast'] },
    talents: { ar: 'خط المواهب', en: 'Talents Line', positions: ['north', 'center', 'south'] }
  };

  // ==================== قاعدة البيانات ====================

  class MatrixDatabase {
    constructor() {
      this.sections = new Map();
      this.positions = new Map();
      this.combinations = new Map();
      this.yearly_calculations = new Map();
      this.compatibility_data = new Map();
    }

    // تسجيل قسم جديد
    registerSection(sectionKey, data) {
      this.sections.set(sectionKey, {
        ...SECTIONS_ARABIC[sectionKey],
        ...data,
        id: sectionKey,
        isPaid: data.isPaid || false,
        requiresMatrixCalculation: data.requiresMatrixCalculation !== false,
        lines: data.lines || [],
        dependencies: data.dependencies || []
      });
    }

    // الحصول على قسم
    getSection(sectionKey) {
      return this.sections.get(sectionKey);
    }

    // تسجيل موضع (نقطة في المصفوفة)
    registerPosition(positionKey, data) {
      this.positions.set(positionKey, {
        ...data,
        id: positionKey,
        value: null,
        arcana: null,
        interpretation: null
      });
    }

    // تسجيل تركيبة عددية (برنامج)
    registerCombination(combinationKey, data) {
      this.combinations.set(combinationKey, {
        ...data,
        id: combinationKey,
        numbers: data.numbers || [],
        sections: data.sections || [],
        interpretation: null
      });
    }

    // حفظ بيانات التوافق
    saveCompatibilityData(person1Id, person2Id, data) {
      const key = [person1Id, person2Id].sort().join('-');
      this.compatibility_data.set(key, data);
    }

    getCompatibilityData(person1Id, person2Id) {
      const key = [person1Id, person2Id].sort().join('-');
      return this.compatibility_data.get(key);
    }
  }

  // ==================== محرك الحسابات ====================

  class MatrixCalculationEngine {
    constructor() {
      this.db = new MatrixDatabase();
      this.initializeSections();
      this.initializePositions();
    }

    initializeSections() {
      // تسجيل كل الأقسام الـ 15 مع متطلباتها

      this.db.registerSection('personal_qualities', {
        description: 'الصفات والمزايا الطبيعية المرتبطة بيوم الميلاد (الموضع الشمالي)',
        lines: ['paternal', 'talents'],
        dependencies: ['north']
      });

      this.db.registerSection('previous_life', {
        description: 'الدروس والأنماط المتكررة من الحياة السابقة (الذيل الكارمي)',
        lines: ['paternal'],
        dependencies: ['south']
      });

      this.db.registerSection('life_scenario', {
        description: 'السيناريو الحياتي العام - كيفية تطور الحياة',
        lines: ['paternal', 'maternal'],
        dependencies: ['all_nodes']
      });

      this.db.registerSection('talents', {
        description: 'المواهب الفطرية والقدرات الطبيعية',
        lines: ['talents', 'paternal'],
        dependencies: ['north', 'northEast']
      });

      this.db.registerSection('destiny', {
        description: 'الغاية والقدر - الهدف الأسمى للحياة',
        lines: ['paternal', 'maternal'],
        dependencies: ['center', 'west']
      });

      this.db.registerSection('money', {
        description: 'المال والوفرة - العلاقة بالموارد والاستحقاق',
        lines: ['money'],
        dependencies: ['northEast', 'southWest'],
        isPaid: true
      });

      this.db.registerSection('programs', {
        description: 'البرامج العددية والتركيبات - الأنماط المتكررة',
        lines: [],
        dependencies: [],
        isPaid: true
      });

      this.db.registerSection('magnetism', {
        description: 'الجاذبية الشخصية والتأثير على الآخرين',
        lines: ['love'],
        dependencies: ['northWest', 'center'],
        isPaid: true
      });

      this.db.registerSection('parents', {
        description: 'تأثير الوالدين والأصول الجينية والعائلية',
        lines: ['paternal', 'maternal'],
        dependencies: ['all_corners'],
        isPaid: true
      });

      this.db.registerSection('children', {
        description: 'الأطفال والوراثة والمستقبل الجيلي',
        lines: ['paternal', 'maternal'],
        dependencies: ['generational_lines'],
        isPaid: true
      });

      this.db.registerSection('relationships', {
        description: 'العلاقات الرومانسية والارتباطات العاطفية',
        lines: ['love', 'maternal'],
        dependencies: ['southEast', 'northWest'],
        isPaid: true
      });

      this.db.registerSection('life_guidance', {
        description: 'إرشادات الحياة اليومية والقرارات الشخصية',
        lines: ['paternal', 'maternal'],
        dependencies: ['all_nodes'],
        isPaid: true
      });

      this.db.registerSection('year_forecast', {
        description: 'التوقعات السنوية حسب السنة الحالية',
        lines: [],
        dependencies: ['yearly_calculations'],
        isPaid: true
      });

      this.db.registerSection('personal_brand', {
        description: 'العلامة الشخصية - كيفية ظهورك للعالم',
        lines: ['paternal'],
        dependencies: ['north', 'center'],
        isPaid: true
      });

      this.db.registerSection('health', {
        description: 'الصحة والجسد - الارتباطات الرمزية بالشاكرات',
        lines: [],
        dependencies: ['chakras'],
        isPaid: false
      });
    }

    initializePositions() {
      const positions = [
        'north', 'northEast', 'east', 'southEast', 'south', 'southWest', 'west', 'northWest', 'center'
      ];

      positions.forEach(pos => {
        this.db.registerPosition(pos, {
          title: this.getPositionTitle(pos),
          description: this.getPositionDescription(pos)
        });
      });
    }

    getPositionTitle(pos) {
      const titles = {
        north: 'الجوهر · يوم الميلاد',
        northEast: 'الموهبة والمال',
        east: 'الاتصال الروحي',
        southEast: 'خط العلاقات',
        south: 'الذيل الكرمي',
        southWest: 'مسار الوفرة',
        west: 'التكامل',
        northWest: 'العاطفة',
        center: 'المركز · منطقة الراحة'
      };
      return titles[pos] || pos;
    }

    getPositionDescription(pos) {
      const descriptions = {
        north: 'النقطة الأساسية للشخصية والمواهب الفطرية',
        northEast: 'كيف تتحول المواهب إلى قيمة ودخل',
        east: 'علاقتك بالمعنى والحدس والرسالة الروحية',
        southEast: 'نمط التعلّق والشراكة والعلاقات القريبة',
        south: 'الدرس المتكرر من الحياة السابقة والتراكم القديم',
        southWest: 'علاقتك بالموارد والأمان المادي',
        west: 'الربط بين الجانب الشخصي والجانب العملي',
        northWest: 'طريقة التعبير عن المشاعر وتلقيها',
        center: 'منطقة الراحة والطاقة الجوهرية التي تعود إليها'
      };
      return descriptions[pos] || '';
    }

    // حساب مصفوفة شخص واحد
    calculateSingleMatrix(birthDate) {
      // استدعاء الدالة من numerology-matrix.js الموجودة
      if (window.AqeeqMatrix && window.AqeeqMatrix.calculateDestinyMatrix) {
        return window.AqeeqMatrix.calculateDestinyMatrix(birthDate);
      }
      return null;
    }

    // حساب التوافق بين شخصين
    calculateCompatibility(person1Birth, person2Birth) {
      const matrix1 = this.calculateSingleMatrix(person1Birth);
      const matrix2 = this.calculateSingleMatrix(person2Birth);

      if (!matrix1 || !matrix2) return null;

      return {
        person1: matrix1,
        person2: matrix2,
        compatibility: this.analyzeCompatibility(matrix1, matrix2),
        sharedElements: this.findSharedElements(matrix1, matrix2)
      };
    }

    analyzeCompatibility(m1, m2) {
      const elements = {
        matching_cores: this.countMatches(m1.anchors, m2.anchors),
        line_harmony: this.analyzeLineHarmony(m1, m2),
        karmic_lessons: this.compareKarmicLessons(m1, m2),
        overall_score: 0
      };

      // حساب النسبة الإجمالية
      elements.overall_score = Math.round(
        (elements.matching_cores * 20 +
         elements.line_harmony * 30 +
         elements.karmic_lessons * 50) / 100
      );

      return elements;
    }

    countMatches(anchors1, anchors2) {
      let matches = 0;
      Object.keys(anchors1).forEach(key => {
        if (anchors1[key] === anchors2[key]) matches++;
      });
      return matches;
    }

    analyzeLineHarmony(m1, m2) {
      // تحليل توافق الخطوط بين الشخصين
      return 60; // قيمة مؤقتة
    }

    compareKarmicLessons(m1, m2) {
      // مقارنة الدروس الكارمية
      return 70; // قيمة مؤقتة
    }

    findSharedElements(m1, m2) {
      return {
        matching_arcanas: this.findMatchingArcanas(m1, m2),
        shared_life_path: m1.lifePath === m2.lifePath
      };
    }

    findMatchingArcanas(m1, m2) {
      // البحث عن الأرقام المتطابقة
      return [];
    }

    // حساب التوقعات السنوية
    calculateYearlyForecast(birthDate, year) {
      const baseMatrix = this.calculateSingleMatrix(birthDate);
      if (!baseMatrix) return null;

      // حساب رقم السنة
      const yearNumber = this.reduceToArcana(year);

      return {
        year: year,
        personal_year: yearNumber,
        forecast: this.generateYearlyInterpretation(baseMatrix, yearNumber)
      };
    }

    reduceToArcana(value) {
      let n = Math.abs(Math.trunc(value));
      while (n > 22) {
        n = String(n).split('').reduce((sum, d) => sum + Number(d), 0);
      }
      return n || 22;
    }

    generateYearlyInterpretation(matrix, yearNumber) {
      return {
        number: yearNumber,
        theme: `موضوع السنة رقم ${yearNumber}`,
        focus: `التركيز الرئيسي للعام ${yearNumber}`
      };
    }
  }

  // ==================== العرض والتفاعل ====================

  class MatrixUIManager {
    constructor(engine) {
      this.engine = engine;
      this.currentMatrix = null;
      this.containerElement = null;
    }

    // تحميل قسم محدد
    loadSection(sectionKey, birthData) {
      const section = this.engine.db.getSection(sectionKey);
      if (!section) {
        console.error(`القسم ${sectionKey} غير موجود`);
        return null;
      }

      if (section.requiresMatrixCalculation) {
        this.currentMatrix = this.engine.calculateSingleMatrix(birthData);
      }

      return this.renderSection(section);
    }

    renderSection(section) {
      const html = `
        <div class="matrix-section" data-section="${section.id}">
          <div class="section-header">
            <h2>${section.ar}</h2>
            <span class="section-en">${section.en}</span>
            ${section.isPaid ? '<span class="badge-paid">مدفوع</span>' : '<span class="badge-free">مجاني</span>'}
          </div>
          <p class="section-description">${section.description}</p>
          <div class="section-content" data-content-ready="false">
            <!-- المحتوى سيُحمّل من قاعدة البيانات -->
          </div>
        </div>
      `;
      return html;
    }

    // عرض التوافق بين شخصين
    renderCompatibility(compatibility) {
      return `
        <div class="compatibility-view">
          <div class="score">${compatibility.compatibility.overall_score}%</div>
          <div class="analysis">
            ${this.renderCompatibilityAnalysis(compatibility.compatibility)}
          </div>
        </div>
      `;
    }

    renderCompatibilityAnalysis(compat) {
      return `
        <ul>
          <li>المراكز المتطابقة: ${compat.matching_cores}</li>
          <li>توافق الخطوط: ${compat.line_harmony}%</li>
          <li>الدروس الكارمية: ${compat.karmic_lessons}%</li>
        </ul>
      `;
    }
  }

  // ==================== التصدير ====================

  window.AqeeqMatrixComplete = {
    engine: new MatrixCalculationEngine(),
    ui: null,

    init() {
      this.ui = new MatrixUIManager(this.engine);
      console.log('✅ نظام مصفوفة القدر الكامل جاهز');
      return this;
    },

    calculateMatrix(birthDate) {
      return this.engine.calculateSingleMatrix(birthDate);
    },

    calculateCompatibility(birth1, birth2) {
      return this.engine.calculateCompatibility(birth1, birth2);
    },

    loadSection(sectionKey, birthData) {
      return this.ui.loadSection(sectionKey, birthData);
    },

    getDatabase() {
      return this.engine.db;
    },

    getAllSections() {
      return Object.entries(SECTIONS_ARABIC).map(([key, data]) => ({
        key,
        ...data
      }));
    }
  };

  // تهيئة عند التحميل
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.AqeeqMatrixComplete.init();
    });
  } else {
    window.AqeeqMatrixComplete.init();
  }
})();
