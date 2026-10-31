/* Matrix report section inventory.
   Labels are transcribed from the project owner's checklist or current UI.
   No label below is asserted as an exact source heading until the reference is supplied. */
(function (root, factory) {
  'use strict';
  const inventory = factory();
  root.AqeeqMatrixReportMap = inventory;
  if (typeof module !== 'undefined' && module.exports) module.exports = inventory;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  return {
    schemaVersion: 1,
    hierarchyStatus: 'owner-checklist-provisional',
    reference: {
      sourceName: 'Matrix Destiny reference described by project owner',
      sourceUrl: null,
      edition: null,
      excerptsAvailable: false,
      note: 'This file records topics stated by the owner and current project behavior. Exact source headings, section order, formulas, and program combinations are not verified.'
    },
    termsFromBrief: [
      { term: 'Money Line', context: 'Earlier project brief', exactSourceHeadingVerified: false },
      { term: 'Love Line', context: 'Earlier project brief', exactSourceHeadingVerified: false },
      { term: 'Male Generation Lines', context: 'Earlier project brief', exactSourceHeadingVerified: false },
      { term: 'Female Generation Lines', context: 'Earlier project brief', exactSourceHeadingVerified: false },
      { term: 'Physics', context: 'Chakra table brief', exactSourceHeadingVerified: false },
      { term: 'Energy', context: 'Chakra table brief', exactSourceHeadingVerified: false },
      { term: 'Emotions', context: 'Chakra table brief', exactSourceHeadingVerified: false },
      { term: 'Soul Searching', context: 'Earlier axis brief', exactSourceHeadingVerified: false },
      { term: 'Socialization', context: 'Earlier axis brief', exactSourceHeadingVerified: false },
      { term: 'Spiritual Exam', context: 'Earlier axis brief', exactSourceHeadingVerified: false },
      { term: '22 Major Arcana', context: 'Earlier matrix brief', exactSourceHeadingVerified: false }
    ],
    groups: [
      {
        id: 'personality',
        ownerTopicLabel: 'الشخصية والصفات',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; exact source title unavailable',
        implementationStatus: 'partial',
        projectState: 'يعرض المركز وملخصات أركانا عامة من صياغة الموقع؛ هذه النصوص ليست مطابقة لمرجع موثق.',
        calculationRefs: ['calculateDestinyMatrix', 'nodes.center'],
        missingEvidence: 'عنوان القسم الأصلي، مواضع الشخصية الفرعية، وقاعدة كل نتيجة وتفسيرها.'
      },
      {
        id: 'talents',
        ownerTopicLabel: 'المواهب',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; exact source title unavailable',
        implementationStatus: 'partial',
        projectState: 'يوجد وصف محلي للنقطة المركبة، لكن لا توجد منظومة مواهب موثقة أو خريطة مواهب مركبة.',
        calculationRefs: ['nodes.northEast'],
        missingEvidence: 'مواضع المواهب المعتمدة، قواعد تركيبها، والتمييز بين الموهبة الشخصية والمركبة.'
      },
      {
        id: 'destiny-life-stages',
        ownerTopicLabel: 'القدر ومراحل العمر',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; exact source title unavailable',
        implementationStatus: 'partial',
        projectState: 'توجد محاور غاية حالية؛ لا توجد في وحدة المصفوفة مراحل عمر أو حدود زمنية.',
        calculationRefs: ['calculateDestinyAxes'],
        missingEvidence: 'اسم المحور الأصلي، دورات العمر، قواعد البداية والنهاية، وأي نتائج زمنية مشتقة.'
      },
      {
        id: 'money',
        ownerTopicLabel: 'المال والوفرة',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; Money Line phrase supplied in brief, not verified against source',
        implementationStatus: 'partial',
        projectState: 'يعرض الموقع وصلة تركيبية northeast → center → southwest بوصفها قراءة محلية رمزية.',
        calculationRefs: ['matrix.lines.money'],
        missingEvidence: 'تأكيد مواضع الخط ومكوناته وبرامجه قبل عرضها كقاعدة للمدرسة.'
      },
      {
        id: 'relationships',
        ownerTopicLabel: 'العلاقات والشريك المثالي',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; Love Line phrase supplied in brief, not verified against source',
        implementationStatus: 'partial',
        projectState: 'يعرض الموقع وصلة تركيبية northwest → center → southeast؛ لا يوجد تحليل موثق للشريك المثالي داخل وحدة المصفوفة.',
        calculationRefs: ['matrix.lines.love'],
        missingEvidence: 'مواضع الخط، قاعدة الشريك المثالي، برامج العلاقات، والفصل بين قراءة الفرد والتوافق.'
      },
      {
        id: 'karma-programs',
        ownerTopicLabel: 'الكارما والبرامج المركبة',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; exact source titles and program names unavailable',
        implementationStatus: 'missing',
        projectState: 'لا يوجد سجل برامج بأسماء أو معرفات أو تراكيب رقمية موثقة في وحدة المصفوفة.',
        calculationRefs: [],
        missingEvidence: 'أسماء البرامج، المعرفات، التراكيب، مواضعها، قواعد الكشف، والمصدر لكل برنامج.'
      },
      {
        id: 'ancestral-lines',
        ownerTopicLabel: 'خطوط الأب والأم والأسلاف',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; Male/Female Generation Lines phrases supplied in brief, not verified against source',
        implementationStatus: 'partial',
        projectState: 'تعرض الوحدة خطاً أبويًا وخطاً أمويًا من صيغ محلية؛ لا يثبتان وقائع وراثية أو تاريخية.',
        calculationRefs: ['calculateGenerationalLines'],
        missingEvidence: 'التسمية والتركيب الأصليان، النقاط الطرفية/المركزية، وأي برامج جيلية.'
      },
      {
        id: 'children',
        ownerTopicLabel: 'الأطفال والمواهب المرتبطة بهم',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; exact source title unavailable',
        implementationStatus: 'missing',
        projectState: 'لا يوجد قسم أطفال أو نتيجة مخصصة لهم في وحدة المصفوفة.',
        calculationRefs: [],
        missingEvidence: 'مواضع الأطفال وقواعدها وحدود القراءة الرمزية، مع تجنب الأحكام الحتمية.'
      },
      {
        id: 'chakras',
        ownerTopicLabel: 'الشاكرات',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; Physics/Energy/Emotions phrases supplied in brief, not verified against source',
        implementationStatus: 'partial',
        projectState: 'يوجد جدول 7 شاكرات وثلاثة أعمدة وإجماليات محلية. حقول التفسير التفصيلي في ملفات الأركانا الـ22 فارغة.',
        calculationRefs: ['calculateChakraHealthCard', 'AqeeqMatrix.chakraReading'],
        missingEvidence: 'مطابقة ترتيب/صيغ القيم والإجماليات مع المرجع، ثم محتوى أصلي لكل خانة؛ لا دلالة طبية.'
      },
      {
        id: 'purpose',
        ownerTopicLabel: 'الغاية ومحاورها',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; Soul Searching/Socialization/Spiritual Exam phrases supplied in brief, not verified against source',
        implementationStatus: 'partial',
        projectState: 'توجد صيغ محلية لمحوري السماء/الأرض ومحاور شخصية/اجتماعية/روحية/كوكبية؛ مطابقتها غير مثبتة.',
        calculationRefs: ['calculateDestinyAxes'],
        missingEvidence: 'تأكيد أسماء المحاور وترتيبها وطريقة اشتقاق كل محصلة.'
      },
      {
        id: 'life-guidance',
        ownerTopicLabel: 'الإرشادات الحياتية',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; exact source title unavailable',
        implementationStatus: 'partial',
        projectState: 'توجد نصائح توازن عامة في الشاكرات ونصوص أركانا مختصرة من تحرير الموقع؛ لا يوجد دليل إرشادي كامل مرتبط بقواعد مرجعية.',
        calculationRefs: ['calculateChakraHealthCard'],
        missingEvidence: 'موضع الإرشادات في بنية المرجع، ثم كتابة محتوى عقيق الأصلي بعد اعتماد النتائج.'
      },
      {
        id: 'annual-outlook',
        ownerTopicLabel: 'التوقعات السنوية',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; exact Matrix section title unavailable',
        implementationStatus: 'separate',
        projectState: 'توجد أداة فلكية منفصلة للتوجيهات السنوية؛ لم يثبت أنها قسم من تقرير المصفوفة.',
        calculationRefs: [],
        missingEvidence: 'تأكيد أن هذا المفهوم جزء من المصفوفة المرجعية وقاعدته، قبل ربطه هنا.'
      },
      {
        id: 'personal-brand',
        ownerTopicLabel: 'العلامة الشخصية',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; exact source title unavailable',
        implementationStatus: 'missing',
        projectState: 'لا يوجد قسم بهذا المعنى في وحدة المصفوفة الحالية.',
        calculationRefs: [],
        missingEvidence: 'العنوان والمواضع/النتائج المرتبطة به في المرجع، إن كان قسمًا مستقلًا.'
      },
      {
        id: 'matrix-compatibility',
        ownerTopicLabel: 'التوافق بين المصفوفات',
        referenceTerm: null,
        labelEvidence: 'owner-checklist; exact source title unavailable',
        implementationStatus: 'separate',
        projectState: 'لا يوجد ربط موثق لمصفوفتين داخل هذه الوحدة؛ أدوات التوافق الرقمية الأخرى ليست بديلًا عن قاعدة Matrix-to-Matrix.',
        calculationRefs: [],
        missingEvidence: 'طريقة دمج مصفوفتين، المقاييس/الخطوط المستخدمة، وحدود تفسير النتيجة.'
      }
    ],
    contentModel: {
      levels: [
        'عنوان مرجعي: لا يملأ إلا بنص موثق',
        'شرح عربي مساعد: لا يغيّر معنى العنوان',
        'معرف ثابت: منفصل عن النص المعروض',
        'قاعدة ومصدرها وحالة مراجعتها',
        'نتيجة حسابية مرتبطة بالقاعدة',
        'تفسير أصلي لعقيق أسترو: يكتب بعد التحقق، ولا ينسخ محتوى مدفوعًا'
      ]
    }
  };
});
