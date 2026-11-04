#!/usr/bin/env python3
"""Generates docs/gemini-report.md (per-interpretation table) and docs/gemini-missing.md from
docs/gemini-inventory.json, docs/gemini-reconciliation.json and docs/gemini-dom-reconciliation.json."""
import json, os, collections
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = lambda n: os.path.join(ROOT, 'docs', n)
inv = json.load(open(D('gemini-inventory.json'), encoding='utf8'))
rec = json.load(open(D('gemini-reconciliation.json'), encoding='utf8'))
dom = json.load(open(D('gemini-dom-reconciliation.json'), encoding='utf8'))
idx = json.load(open(os.path.join(ROOT, 'assets/data/matrix/gemini/index.json'), encoding='utf8'))
man = {m['stored']: m for m in json.load(open(os.path.join(ROOT, 'content-sources/gemini/MANIFEST.json'), encoding='utf8'))}
POS = {'core': 'الجوهر', 'money': 'خط المال', 'love': 'خط الحب', 'tail_entry': 'مدخل الذيل', 'mission': 'الرسالة',
       'reference': 'المرجع التشريحي (كامل)', 'tail': 'ذيل كارمي'}
rows = dom['rows']
ok = sum(1 for r in rows if r['dom_match'])

L = []
L.append('# تقرير المطابقة: مصدر Gemini ← الموقع\n')
L.append(f'- ملفات المصدر: **{len(inv)}** · تفسيرات منقولة ومطابَقة: **{len(rows)}** · نجحت: **{ok}** · فشلت: **{len(rows) - ok}**')
L.append('- طريقة المطابقة: (1) على مستوى البيانات: مقارنة تسلسل الكلمات في ملف المصدر الخام بالكتل المخزَّنة (`tools/build-gemini-content.py`)؛ (2) على مستوى الصفحة: رسم النافذة في متصفح حقيقي وعدّ كلمات النص المعروض (`tools/gemini-dom-reconcile.js`).')
L.append('- الكلمة = أي وحدة نصية تحتوي حرفًا أو رقمًا (تُستبعد علامات الهيكلة `>` `*` `|`).')
L.append('- كلام المحادثة الذي يلف التفسير داخل ملفات Gemini (مثل «احفظ الملف...» و«كمل») ليس تفسيرًا؛ فُصل وعُدّ في جرد الملفات (`docs/gemini-inventory.json`) ولم يُنقل إلى الموقع. الأصل الكامل محفوظ في `content-sources/gemini/`.')
L.append('- قسم «تاسعاً: مصفوفة البناء البرمجي» في ملفات المرجع التشريحي كود TypeScript لقاعدة البيانات؛ نُقل وحُفظ في البيانات (`reference.code`) وطابق المصدر، لكنه غير معروض للمستخدم.\n')
L.append('| المصدر (الملف) | الموضع | الرقم/الشفرة | كلمات المصدر | كلمات بعد النقل (في الصفحة) | العناوين | الفقرات | النتيجة |')
L.append('|---|---|---|---|---|---|---|---|')
for r in rows:
    name = man[r['file']]['original'][:48] if r['file'] in man else r['file']
    kind = r['kind'] if r['kind'] in ('reference', 'tail') else r['key']
    label = POS.get(kind, kind)
    ident = r['key'] if r['kind'] == 'tail' else r['number']
    L.append(f"| {name} | {label} | {ident} | {r['words_source']} | {r['words_after']} | {r['headings']} | {r['paragraphs']} | {'مطابق' if r['dom_match'] else 'غير مطابق'} |")
tot_s = sum(r['words_source'] for r in rows); tot_a = sum(r['words_after'] for r in rows)
L.append(f"\n**المجموع:** كلمات المصدر {tot_s} · بعد النقل {tot_a}\n")
L.append('## ربط العقد (الموضع + الرقم)')
w = dom['wiring']
L.append(f"- العقد المفحوصة على خريطة 11/11/1998: {len(w)} · الفاتحة لموضعها ورقمها الصحيحين: {sum(1 for x in w if x['ok'])}")
L.append('| العقدة (position) | الرقم | يفتح تفسيرًا من المصدر؟ |')
L.append('|---|---|---|')
for x in w:
    L.append(f"| {x['node']['pos']} | {x['node']['arc']} | {'لا — «غير متوفر في المصدر»' if x['opened']['missing'] else 'نعم'} |")
open(D('gemini-report.md'), 'w', encoding='utf8').write('\n'.join(L) + '\n')

M = ['# قائمة النواقص والمكررات في مصدر Gemini (لم يُعوَّض شيء منها بنص مولَّد)\n']
M.append('## نواقص داخل ملفات موجودة')
for m in idx['missing']:
    M.append(f"- الرقم {m['number']} — {m['item']}: {m['reason']}")
M.append('\n## مواضع في الموقع بلا مصدر Gemini (تعرض «غير متوفر في المصدر»)')
for x in idx['positionsWithoutSource']:
    M.append(f'- {x}')
M.append('\n## ذيول الموقع غير الموجودة في Gemini')
have = {t['code'] for t in json.load(open(os.path.join(ROOT, 'assets/data/matrix/gemini/tails.json'), encoding='utf8'))['tails']}
site = json.load(open(os.path.join(ROOT, 'assets/data/matrix/karmic-tails.json'), encoding='utf8'))['tails']
for t in site:
    rev = '-'.join(reversed(t['code'].split('-')))
    if t['code'] not in have and rev not in have:
        M.append(f"- {t['code']} ({t['title'].get('ar')}) — لا يوجد ملف Gemini")
M.append('\n## ملفات مكررة (حرفيًا) لم تُنقل مرتين')
for r in inv:
    if r.get('duplicate_of'):
        M.append(f"- {r['original'][:70]} ← نسخة من {man[r['duplicate_of']]['original'][:60]}")
M.append('\n## ملفات خارج النطاق (ليست تفسير مواضع)')
for r in inv:
    if r['type'] in ('foundation', 'engine-or-instructions'):
        M.append(f"- {r['original'][:70]} — {r['note']}")
open(D('gemini-missing.md'), 'w', encoding='utf8').write('\n'.join(M) + '\n')
print('report rows', len(rows), 'ok', ok)
