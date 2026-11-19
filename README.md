# aqeeq.astro
## بناء الأصول (مهم)
- **المصدر**: عدّل `index.src.html` والملفات الأصلية في `assets/css` و`assets/js` كالمعتاد. لا تعدّل `index.html` ولا `assets/dist` يدويًا.
- بعد أي تعديل شغّل: `node scripts/build-assets.js` — يدمج CSS/JS بنفس الترتيب ويضع رقم إصدار تلقائيًا من المحتوى (لا حاجة لـ `?v=`)، ثم ارفع التغييرات كلها (بما فيها `index.html` و`assets/dist`).
- `node tests/build-sync.test.js` يتأكد أن الناتج متزامن مع المصدر.
