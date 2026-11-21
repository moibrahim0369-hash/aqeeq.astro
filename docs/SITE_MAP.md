# خريطة موقع عقيق أسترو (المرجع الشامل)

آخر تحديث: 21 نوفمبر 2026. الريبو: `moibrahim0369-hash/aqeeq.astro` (فرع `main`)، والموقع يعمل من GitHub Pages: https://moibrahim0369-hash.github.io/aqeeq.astro/

## 1. كيف يعمل الموقع
- صفحة واحدة `index.html`، HTML/CSS/JS عربي RTL بدون إطار عمل. الأقسام كلها داخلها، لكل قسم `id`، والتنقل بالـ hash مثل `#matrix`.
- الأقسام: home، aqh-articles، quick، matrix، lifepath، lifepath-compat، matrix-compat، matrix-child، chart، astro-maps، for-you، sky، swc، signs، account، invest، year2027، karmic، pay، admin-pay، compat، energy-compatibility، individual، relationships، featured-content، featured-reader.
- الموقع PWA: `manifest.webmanifest` و`sw.js` (تخزين الصفحات للعمل مع ضعف الشبكة).
- لا يوجد سيرفر خاص بنا. الخلفية في Supabase (انظر البند 6).

## 2. أين أعدّل، وكيف أنشر (أهم قاعدة)
- **المصدر الحقيقي:** `index.src.html` + الملفات الأصلية في `assets/css` و`assets/js` (وبعضها في الجذر مثل `engine.js` و`styles.css`).
- **ممنوع** تعديل `index.html` أو `assets/dist` يدويًا، فهما مولّدان.
- بعد أي تعديل شغّل: `node scripts/build-assets.js` (يدمج ويضغط CSS/JS ويضع بصمة تلقائية، فلا حاجة لـ `?v=`).
- `node --test tests/build-sync.test.js` يتأكد أن الناتج متزامن مع المصدر.
- بعدها commit و`git pull --rebase origin main` ثم push إلى `main`. لا يوجد GitHub Action يكتب على main (رفضته).
- الاختبار محليًا: `python3 -m http.server 8765` داخل الريبو، ثم `http://localhost:8765/index.html#home`. اختبار Playwright عند 390×844.
- إذا ظهر قديم على الموبايل بعد النشر، فهو كاش: اقفل التاب أو امسح بيانات الموقع.
- ترتيب الـ CSS مهم: آخر ملف يُربط يفوز. لذلك تعديلاتنا الأخيرة في ملفات جديدة تُربط قبل `</head>` (مثل `sheet-calm.css` و`y27-glass.css`) وبسلاسل `:not(#_a)…` لرفع الأولوية.

## 3. تقسيم الملفات
- `assets/js/inline/page-01..15.js`: سكربتات كانت داخل الصفحة (page-06 فيه الأبراج `#signs` وصفحة السماء).
- `assets/js/*.js` (نحو 84 ملفًا) مقسمة حسب الميزة:
  - **المصفوفة:** numerology-matrix.js، destiny-matrix-data.js، matrix-*.js
  - **مسار الحياة:** life-path-data.js، lifepath-*.js، lp-*.js، pinnacles_challenges.js (جذر)
  - **الخريطة الفلكية:** natal-*.js، astro-wheel.js، chart-*.js، extended-astro-charts.js
  - **الفيدي:** vedic-*.js، year2027.js
  - **السماء والأبراج:** sky-*.js، sign-forecast-sheet.js، sign-live-texts.js
  - **التوافق:** compat-*.js، engine.js (جذر)
  - **الحساب والدفع:** auth-ui.js، account-bar.js، paywall-modal.js، manual-pay.js
  - **المحتوى:** featured-content.js، content-links.js، interpretation-library.js
  - **الواجهة العامة:** home-*.js، nav-unified.js، companion.js، cosmic-background.js
- `assets/css/*.css` (نحو 86 ملفًا). مهمة: `fonts-local.css` و`type-system.css` (الخطوط)، `aq-tokens.css` (الألوان)، `sky-unify.css` و`sky-signs-v2.css` (السماء والأبراج)، `page-art.css` (فن الصفحات والنوافذ).
- `assets/data/*.json`: المقالات `featured-content.json` وبيانات الرفيق `companion.json`.
- `data/interpretations/<كوكب>.json`: مكتبة النصوص (حاليًا الشمس والقمر وزحل وعطارد والزهرة والمريخ). `_manifest.json` فيه المفاتيح، والتحقق: `node scripts/validate-interpretations.js` يجب أن يقول «سليم».
- `docs/`: التوثيق. أهمه `CONTENT_STYLE_GUIDE.md` (دستور المحتوى) و`content/voice-guide.md` و`handoff/00..04` و`OWNER-GUIDE.md`.

## 4. الأنظمة والحسابات
- **المحرك الفلكي:** `astronomy.min.js` + منطق الخرائط. دُقّق على Swiss Ephemeris 2.10.03: الكواكب ضمن 12 ثانية قوسية، والطالع ووسط السماء ضمن 7 ثوانٍ. تحويل التوقيت المحلي سليم. اختبار `tests/vedic-reference.test.js`.
- **الفيدي:** أيانامشا لاهيري حقيقية، داشا فيمشوتاري تبدأ من لحظة الميلاد UT، سنة 365.25 يوم، راهو وكيتو بالعقدة المتوسطة، وساديه ساتي، وD9/D10/D7. `year2027.js` يحسب قراءة 2027 (الفترة الحاكمة، ثقل زحل، الفرصة، الحذر).
- **المصفوفة (ناتاليا لاديني):** `numerology-matrix.js` للحساب و`destiny-matrix-data.js` للنصوص. توافق المصفوفة: تُجمع الأركان A B C D ثم يُعاد توليد E وF G H I. طاقة السنة من عيد الميلاد إلى التالي.
- **مسار الحياة:** `life-path-data.js` وأعمدة القمم والتحديات `pinnacles_challenges.js`. بصمة الاسم في `name_engine.js`.
- **السماء:** `window.AqSky` يعرض بيانات السماء للواجهات. حساب البيت: `((sign - i + 12) % 12) + 1`. المصادر: sky-readings وsky-aspect-library وsky-sign-reads.
- **التوافق:** `engine.js` بقواعد aqeq_rules_v1، وبيانات `synastry_data_completed.json`.
- ملف الحسابات مقفول: لا تغيّر حسابًا بدون اختبار بقيم معروفة.
- لسه مؤجل: منازل القمر، خريطة الطفل بالكامل، الأشتاكافارجا، الفارشافالا، عبور جوتشارا.

## 5. التصميم المعتمد
- الألوان: طوبي، عنابي، عقيق، بيج/كريمي. الخطوط: Amiri/El Messiri للعناوين وIBM Plex Sans Arabic وCairo للنصوص، من `assets/fonts` محليًا.
- بدون إيموجي كيبورد، أيقونات SVG فقط.
- الصفحات الداخلية: خلفية كريمية بسيطة، فن خفيف جدًا في الأركان، شريط علوي فيه «رجوع» و«الرئيسية» فقط.
- **النوافذ السفلية (`.aqm-sheet`)**: panel وbody وfoot. ثلاثة أنواع: السماء `.swp-sheet/.mns-sheet`، الأبراج `#sgs-sheet`، توقعات الأبراج `.fc-sheet`. موحدة من `sheet-calm.css`: خلفية كريمية ساذجة، أيقونات هيدر صغيرة (42–44px)، وكارت السؤال زجاجي كريمي بنجمة عنابية، وزر «تعمّق» ينزل النص تحته ويتحول إلى «إخفاء التفاصيل».
- **الفلك الفيدي 2027:** `y27-glass.css`: أربع بطاقات لكل منها أيقونة ولون، وأكورديون زجاجي بظل. البانر الأحمر اتشال وبقي الأصلي.
- الصفحات المعتمدة ولا تُعدّل بدون طلب صريح: المصفوفة، مسار الحياة، الخريطة الفلكية، `#signs`.

## 6. الحسابات والدفع (الخلفية)
- **Supabase** (`supabase-client.js`، المشروع trcveoewbxqzhhvzawxy). المهاجرات في `supabase/migrations`: حالة تسليم التقرير، صلاحيات تسجيل الدخول اليومي، اكتمال الملف الشخصي، مشتركو النشرة، المدفوعات اليدوية.
- دوال Edge في `supabase/functions`: `generate-astro-report` و`paymob-webhook`.
- **Paymob غير مفعّل الآن.** زر `#acct-buy` يحوّل إلى صفحة الدفع اليدوي `#pay` (`manual-pay.js`)، ولوحة المراجعة `#admin-pay`. تفعيل Paymob يكون بضبط `window.AQEEQ_PAYMOB_ENABLED`.
- زر «شراء التوقع كامل» في 2027 يوجه إلى `#pay`.
- تفاصيل الدفع كمالك في مصر موثقة في ملاحظات المشروع.

## 7. المحتوى والنصوص
- المرجع: `docs/CONTENT_STYLE_GUIDE.md`. قول «ارجع لدستور المحتوى» وأي شات يقرأه.
- الصوت: عربية بيضاء قريبة من القلب، نص واحد محايد الجنس، عمق نفسي دقيق، بدون ألفاظ «طعم/مفتاح» ولا أمراض ولا تشخيصات. مسار الحياة والتوافق بالعامية المصرية وينتهي كل نص بسؤال عميق.
- المقالات: `assets/data/featured-content.json` (قاعدة: لا تكرار موضوع، ولا تكرار صورة غلاف).
- تنبيه «للتأمل وليس بديلًا عن المشورة» يظهر في الشروط والأحكام فقط.
- ما فيه اسم شخصي في الموقع. الحقوق: «© 2026 عقيق أسترو (Aqeq Astro)». التواصل واتساب فقط.

## 8. الاختبارات
- `tests/*.test.js` (وحدات) و`tests/*.e2e.js` (Playwright). المهم: `build-sync.test.js` و`sky-zodiac-package.e2e.js`.
- اختبارات قديمة فاشلة قبل عملنا ولم تُصلح: auth-modal وbuy-button وcosmic-contact وextended-wheels.

## 9. تقسيم الشغل بين الشاتات
- شات الواجهة، شات النصوص، شات الحسابات، شات الميزات الجديدة. كل شات يبدأ بقراءة `docs/handoff/00-common.md` ثم ملفه.
- ملاحظة: بعض ما في `docs/handoff/00-common.md` قديم (مثل كسر الكاش بـ `?v=`). المرجع الأحدث هو هذا الملف.

## 10. قواعد العمل مع المالك (الغني)
- ردود قصيرة، تغيير واحد في كل مرة، كل تغيير يُرفع على main منفصلًا.
- بدون سكرين قبل/بعد، يراجع على الموقع الحي ويرد: «ثبته» أو «عدل» أو «شيل».
- الصفحة المعتمدة لا تُعاد صياغتها. من يقول «طبّقه على الكل» فالتطبيق من مكان مشترك على الشكل فقط، دون المساس بالمحتوى أو المنطق.
