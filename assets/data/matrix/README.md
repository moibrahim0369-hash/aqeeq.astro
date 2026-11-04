# محتوى مصفوفة القدر

- `core.json`: ملف صغير (الأسماء والعناوين والشاكرات السبع). متحمّل مع أول فتح.
- `arcana-01.json` … `arcana-22.json`: ملف لكل أركانا، بيتحمّل لما المستخدم يفتح شاكرة فيها الرقم ده.
- `schema.json`: شكل الملف.
- `karmic-tails.json`: ملف مجمّع للذيول الكارمية الـ 26 (Schema v2)، وشكله في `karmic-tails.schema.json`. ربطه بنتيجة المحرك لسه مش متحقق منه (`engineMapping: unverified`). الواجهة بتقراه لما أكورديون الذيل يتفتح (`AqeeqMatrix.karmicTail`): الثلاثية بتتعكس (D2-D3-D) عشان تطابق ترتيب الأرشيف، وبعدها التطابق التام أولاً، والمعكوس بس لو الشفرة مش مسجلة.
- `sections/center.json` و`sections/love_line.json` و`sections/money_line.json`: أقسام المركز وخط الحب وخط المال (Schema v2)، 22 أركانا في كل ملف بطبقتين (`summary` و`deep`) و`genderDynamic`. الشكل في `sections/sections.schema.json`. لسه مش مربوطة بالواجهة.

## إزاي تضيف نص
1. افتح ملف الأركانا (مثلًا `arcana-08.json`) واكتب النص داخل `chakras.<الشاكرة>.<الحقل>`.
2. الحقول: `psychology` (المعنى النفسي) و`shadowTrap` (فخ الظل) و`bodySymbol` (أثر جسدي **رمزي**، مش تشخيص) و`practice` (ممارسة).
3. الحقل الفاضي بيتخفي تلقائيًا. اللي مكتوب بس هو اللي بيظهر.
4. نص عادي بس: ممنوع وسوم HTML (`<` و`>`). السطر الجديد مش بيظهر، اكتب فقرة واحدة.
5. غيّر `meta.status` إلى `review` أو `published` لما النص يخلص.
6. شغّل `node tools/validate-matrix.mjs` قبل الرفع.
7. بعد التعديل زوّد `VERSION` في `assets/js/matrix-loader.js` عشان المتصفحات تجيب النسخة الجديدة.

## ملاحظات
- ما فيش حاجة هنا بتتحسب. الأرقام بتتحسب في المتصفح من تاريخ الميلاد، والملفات دي نصوص بس.
- ترتيب الأركانا المعتمد: 17 النجمة، 18 القمر، 19 الشمس، 20 النداء (الحُكم)، 21 العالم، 22 المجنون.
- sections/talents.json (من بيانات الأركانا الموجودة) وsections/father_line.json وsections/mother_line.json (**مسودة مؤلَّفة** source: authored / status: draft، مفيش نص مصدري ليهم في الأرشيف، ولازم تتراجع قبل الاعتماد).
- أقسام مستخرجة حرفياً من الأرشيف/المشروع (من غير تأليف): sections/purposes.json (21، ناقص 17) وsections/children_line.json (19، ناقص 1 و2 و22) وsections/transformation_rx.json (22) وsections/composite_programs.json (6 برامج بس). genderDynamic اختياري فيها وغايب لأن المصدر مفيهوش نص مرتبط بالجنس.
- sections/ancestral_programs.json: من الوحدة 4 في الأرشيف (مدخل الذيل الكارمي: الجذور السلالية)، 22 أركانا (الأركانا 11 و17 نصوص مقدَّمة من المستخدم).
- ربط الواجهة: AqeeqMatrix.section(name) بيحمّل sections/<name>.json لما الأكورديون يتفتح، وSECTION_SPECS في 
umerology-matrix.js بيحدد أي أركانا بتقود كل قسم. لو الملف أو المدخل مش موجود النص القديم بيفضل. genderDynamic بيظهر بس لما المستخدم يختار ذكر/أنثى.
- زر «التفسير الموسع» وزر مكتبة الذيول بيقروا من sections/*.json وkarmic-tails.json المراجَعة (مش من Master V1 الخام). والأقسام بتتحمّل أوتوماتيك بعد رسم التقرير. تاج ?v= على سكريبتات الماتريكس في index.html لازم يتزوّد لما الملفات دي تتغير.
- المصادر الخام (master-v1) وبيانات الأركانا القديمة اتنقلت لـ `_archive_deprecated/` (مش بتتحمّل في الموقع)، وحقول `sources` في الملفات دي بتشاور على مكانها الجديد.

## تفسيرات Gemini (المصدر الوحيد للتفسيرات حاليًا)
- `gemini/pos-NN.json` (22 ملفًا): لكل أركانا وحدات المواضع الخمس (core, money, love, tail_entry, mission) + المرجع التشريحي الكامل + قسم الكود (محفوظ وغير معروض). `gemini/tails.json`: 26 ذيلًا. `gemini/index.json`: التغطية والنواقص.
- تُبنى حرفيًا من `content-sources/gemini/*.md` (النسخ الخام الاحتياطية للملفات الـ64) بـ `python3 tools/build-gemini-content.py`، ثم `python3 tools/gemini-report.py` لتقارير المطابقة (`docs/gemini-*.md`).
- الأكورديون يعرض نص Gemini فقط؛ الأقسام بلا مصدر تعرض «غير متوفر في المصدر». ملفات `sections/*.json` و`karmic-tails.json` القديمة محفوظة للرجوع ولا تُعرض.
- مفتاح الربط = الموضع + الرقم (`data-position` + `data-arcana` على عقد الـ SVG).
