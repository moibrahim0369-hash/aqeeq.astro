#!/usr/bin/env python3
"""Check final karmic reports for banned content and structure."""
import glob,os,re,sys
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'final')
BAN=[r'\S/ين',r'\S/ة\b',r'[A-Za-z]{3,}',r'اكتئاب',r'إباح',r'زواج',r'تزوج',r'إكزيما',r'خفقان',r'مبايض',r'سرطان',r'ضغط الدم',r'سكر ',r'تشخيص',r'عامية',r'ميتاترون',r'طلاسم',r'سحر الجلب',r'ثروة طائلة',r'[\U0001F300-\U0001FAFF]',r'—']
NEED=['## ما لا يظهر للناس','## قراءة الأرقام الثلاثة','## ثلاثة أصداء للذاكرة القديمة','## في العلاقات','## في القرارات','## في المال والعمل','## كيف تستثمر هذه الشفرة','## ما تتجنبه','## مقياس الوعي','## الميثاق']
bad=0
for f in sorted(glob.glob(os.path.join(D,'karmic-tail-*.md'))):
    t=open(f,encoding='utf-8').read(); n=len(t.split()); name=os.path.basename(f)
    prob=[]
    for b in BAN:
        m=re.search(b,t)
        if m and not (b.startswith('[A-Za-z]') and re.fullmatch(r'[\d\- \[\]]*',m.group(0))): prob.append(f'محظور {b}: ...{t[max(0,m.start()-15):m.end()+15]}...'.replace('\n',' '))
    for h in NEED:
        if h not in t: prob.append('ناقص '+h)
    if n<2250: prob.append(f'قصير {n}')
    print(name,n,'OK' if not prob else 'مشكلة')
    for p in prob: print('   ',p)
    bad+=bool(prob)
print('الإجمالي مشاكل:',bad); sys.exit(1 if bad else 0)
