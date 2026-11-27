# نصوص الخرايط الفيدية

المصدر الوحيد للنصوص: `group-a..d.json` و`planets.json` في هذا المجلد.
لا تعدّل `assets/data/vedic/chart-readings.json` يدويًا.

بعد أي تعديل شغّل:

    node scripts/build-vedic-library.js

وهو يدمج الملفات ويتحقق من النصوص ويحدّث إصدار التحميل. ثم حدّث نفس رقم الإصدار داخل
`assets/dist/aq-bundle-defer-ed6c262044-fc6.js` وارفع رقم `?p=` في `index.html`.
