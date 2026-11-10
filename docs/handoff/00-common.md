# عقيق أسترو: قواعد مشتركة لكل الشاتات
الموقع: HTML/CSS/JS عربي RTL بدون إطار عمل، التنقل بـ hash. الريبو moibrahim0369-hash/aqeeq.astro، الموقع https://moibrahim0369-hash.github.io/aqeeq.astro/
المالك: محمد إبراهيم "الغني" (عامية مصرية). أنت المهندس والمصمم والملوّن.

## قواعد ثابتة
- التعديلات المعتمدة تُدمج في main دائمًا (push مباشر). بعد كل دمج يرد: "ثبته" أو "عدل" أو "شيل" (شيل = رجّع الصفحة لما قبل الدمج).
- تغيير واحد في كل مرة.
- لا إيموجي كيبورد في الواجهة، أيقونات SVG فقط.
- الألوان: طوبي، عنابي، عقيق، بيج.
- نسخة واحدة حية من الموقع.
- كل قسم يفتح كصفحة مستقلة.
- لا تنقل نصًا من مواقع أخرى: نفس البنية بصياغتنا.
- ردّ قصير بالعامية، لا تسرد الخطوات.

## التقنية
- التعديلات CSS تُضاف في آخر الملفات مع html body ... و !important. كسر الكاش بـ ?v= في index.html.
- النافذة السفلية: .aqm-sheet (+ -scrim/-panel/-grip/-x/-body/-foot) وكلاس .swp-sheet.
- الاختبار: Playwright في /tmp عند 390x844 على http://localhost:8765 (python3 -m http.server 8765 داخل الريبو). صفحة مسار الحياة تتمرّر داخل section#lifepath وليس window.
- الكوميت ينتهي بـ:
  Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
  Claude-Session: <رابط الجلسة الحالية>

## وقفنا عند (10 نوفمبر 2026)
- اتنشر: صفحات #about #terms #privacy #disclaimer #contact (assets/js/site-pages.js + css/site-pages.css) مربوطة بالقائمة الجانبية والفوتر.
- اتنشر: إضافات الخريطة الفيدية (assets/js/vedic-extras.js) تُستدعى من الوضع النجمي في extended-astro-charts.js.
- اتنشر: توسيع الرفيق (assets/data/companion.json + بحث بأطول كلمة مطابقة في companion.js).
- ملاحظة: نصوص بلوتو اللي بعتها المستخدم هي عينة للصياغة فقط، ما تتحطش حرفيًا.
- أي ميزة جديدة تتسجل في companion.json كمان.
