import json,hashlib,collections
from pathlib import Path
R=Path(__file__).resolve().parents[1];D=R/'assets/data/matrix';sources={};checks=[]
def read(p):
 b=(D/p).read_bytes();sources['assets/data/matrix/'+p]=hashlib.sha256(b).hexdigest();return json.loads(b)
def check(kind,identity,ok,source,field):checks.append({'kind':kind,'identity':identity,'present':bool(ok),'source':source,'field':field})
for mode,count in [('child',20),('compat',22)]:
 for n in range(1,23):
  p=f'gemini/{mode}-{n:02}.json';d=read(p);slots=[(s,x)for s in d['sections']for x in s['slots']];check('slot_count',f'{mode}/{n}',len(slots)==count,p,'sections[].slots')
  for s,x in slots:
   for f in ['free','paid','reflection_question']:check('current_slot',f'{mode}/{n}/{s["id"]}/{x["key"]}',isinstance(x.get(f),str)and x[f].strip(),p,f)
for n in range(1,23):
 p=f'gemini/pos-{n:02}.json';d=read(p)
 for pos in ['core','money','love','tail_entry','mission']:check('position',f'individual/{n}/{pos}',any(b.get('t','').strip()for b in d.get('positions',{}).get(pos,{}).get('blocks',[])),p,'positions.'+pos+'.blocks')
 check('reference',f'individual/{n}/reference',any(b.get('t','').strip()for b in d.get('reference',{}).get('blocks',[])),p,'reference.blocks')
 p=f'arcana-{n:02}.json';d=read(p)
 for f in ['psychology','gift','shadowTrap','growth']:check('arcana',f'individual/{n}/arcana',d.get('core',{}).get(f),p,'core.'+f)
 for ck in ['sahasrara','ajna','vishuddha','anahata','manipura']:
  for f in ['physicsPsychology','energyPsychology','emotionsPsychology']:check('chakra',f'individual/{n}/{ck}',d.get('chakras',{}).get(ck,{}).get(f),p,'chakras.'+ck+'.'+f)
fields={'center':['identity','behavior','shadow','balanceKey'],'talents':['channel','gift','trap','practice'],'father_line':['theme','potential','challenge','questions','practice'],'mother_line':['theme','potential','challenge','questions','practice'],'ancestral_programs':['roots','fallPatterns','path'],'age_cycles':['stage','light','shadow','practice'],'children_line':['family'],'transformation_rx':['protocol','reflectiveQuestions']}
for section,ff in fields.items():
 p=f'sections/{section}.json';d=read(p);by={e['id']:e for e in d['entries']}
 for n in range(1,23):
  e=by.get(n,{})
  for f in ['summary']+['deep.'+f for f in ff]:
   value=e.get(f)if'.'not in f else e.get('deep',{}).get(f.split('.')[1]);check('section',f'individual/{n}/{section}',value,p,'entries[id='+str(n)+'].'+f)
  if section=='talents':
   for side in ['fromMother','fromFather']:
    for f in ['summary']+['deep.'+f for f in ff]:
     v=e.get(side,{});value=v.get(f)if'.'not in f else v.get('deep',{}).get(f.split('.')[1]);check('talent_parent',f'individual/{n}/{side}',value,p,'entries[id='+str(n)+'].'+side+'.'+f)
p='chakra-lower.json';low=read(p)
for n in range(1,23):
 for f in ['root','care']:check('lower_chakra',f'individual/{n}/lower',low['arcana'].get(str(n),{}).get(f),p,'arcana.'+str(n)+'.'+f)
for k in ['svadhisthana','muladhara']:
 check('lower_chakra_intro',k,low['chakras'].get(k,{}).get('theme'),p,'chakras.'+k+'.theme')
 for a in ['physics','energy','emotions']:check('lower_chakra_intro',k,low['chakras'].get(k,{}).get('lead',{}).get(a),p,'chakras.'+k+'.lead.'+a)
p='sections/composite_programs.json';c=read(p)
for n in range(1,23):
 for f in ['outer','middle','core']:check('composite_role',f'individual/{n}/{f}',c.get('roles',{}).get(str(n),{}).get(f),p,'roles.'+str(n)+'.'+f)
for e in c['entries']:
 for f in ['pattern','daily','remedy']:check('composite_custom',e['code'],e.get('deep',{}).get(f),p,'entries[code='+e['code']+'].deep.'+f)
t=read('gemini/tails.json')
for e in t['tails']:check('custom_tail',e['code'],any(b.get('t','').strip()for b in e.get('blocks',[])),'gemini/tails.json','tails[code='+e['code']+'].blocks')
summary={'functional_field_checks':len(checks),'missing_checks':[x for x in checks if not x['present']],'by_kind':dict(collections.Counter(x['kind']for x in checks)),'custom_composite_reports':len(c['entries']),'custom_composite_codes':[e['code']for e in c['entries']],'composite_role_numbers':len(c['roles']),'custom_tail_reports':len(t['tails']),'custom_tail_codes':[e['code']for e in t['tails']]}
result={'scope':'current source text fields used by the three Matrix reading modes; not editorial approval or proof that all possible combinations have independent reports','base_commit':'7d49e70edc435437d7aec35ffb36218938ce297c','summary':summary,'source_sha256':sources,'checks':checks}
out=R/'docs/matrix-current-functional-coverage.json';out.write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(summary,ensure_ascii=False,indent=2))
