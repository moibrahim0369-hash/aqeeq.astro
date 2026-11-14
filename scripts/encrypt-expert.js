'use strict';
/* تشفير ملاحظات الخبير الفيدية (لك وحدك). الاستخدام:
   node scripts/encrypt-expert.js notes.json "كلمة-السر"
   يكتب data/expert/vedic-notes.enc.json (AES-GCM + PBKDF2). لا ترفع notes.json الأصلي أبدًا.
   شكل الملف: { "d30": { "mars": { "1": "نص", "6": "نص" } }, "d6": { ... } }  (مفتاح الكوكب بالإنجليزية ثم رقم البيت) */
const fs = require('node:fs'), path = require('node:path'), { webcrypto: c } = require('node:crypto');
(async () => {
  const [src, pass] = process.argv.slice(2);
  if (!src || !pass) { console.error('الاستخدام: node scripts/encrypt-expert.js notes.json "كلمة-السر"'); process.exit(1); }
  const plain = fs.readFileSync(src, 'utf8'); JSON.parse(plain);
  const salt = c.getRandomValues(new Uint8Array(16)), iv = c.getRandomValues(new Uint8Array(12)), enc = new TextEncoder();
  const km = await c.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']);
  const key = await c.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const data = Buffer.from(await c.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plain)));
  const b = x => Buffer.from(x).toString('base64');
  fs.mkdirSync(path.join(__dirname, '../data/expert'), { recursive: true });
  fs.writeFileSync(path.join(__dirname, '../data/expert/vedic-notes.enc.json'), JSON.stringify({ v: 1, salt: b(salt), iv: b(iv), data: b(data) }));
  console.log('تم التشفير: data/expert/vedic-notes.enc.json');
})();
