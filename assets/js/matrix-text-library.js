(function(root,factory){'use strict';var api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else{root.AqeeqMatrixTextLibrary=api;if(typeof document!=='undefined')api.boot();}})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
var BASE='assets/data/matrix/',VERSION='unified-natal-matrix-20261122-v2';
var natalSource=typeof module==='object'&&module.exports?require('./natal-text-library.js'):globalThis.AqeeqNatalTextLibrary;
var MODES={natal:'الخريطة الفلكية',individual:'الفردية',child:'الطفل',compat:'التوافق'};
var GROUPS={core:'الجوهر والمركز',money:'المال والعمل',love:'العلاقات والحب',tail_entry:'مدخل الذيل الكارمي',mission:'المهمة والغاية',reference:'المرجع التفصيلي',center:'الشخصية',talents:'المواهب',father_line:'خط الأب',mother_line:'خط الأم',ancestral_programs:'الأجداد',age_cycles:'دورات العمر',children_line:'الأبناء',transformation_rx:'روشتة التحول',composite_programs:'البرامج المركبة',tails:'الذيول المخصصة',arcana:'الأركانا الأساسية',chakra:'الشاكرات',lower:'الجذر والعجز'};
var LABELS={summary:'المعنى العام',deep:'التفصيل',genderDynamic:'صيغ مرتبطة بالنوع',male:'صيغة المذكر',female:'صيغة المؤنث',fromMother:'الموهبة من جهة الأم',fromFather:'الموهبة من جهة الأب',psychology:'الدلالة النفسية الرمزية',gift:'قطب النور',shadowTrap:'قطب الظل',growth:'مسار النمو',practice:'الممارسة',shadow:'الظل',behavior:'السلوك',identity:'الصورة الشخصية',balanceKey:'مفتاح التوازن',reflection_question:'سؤال التأمل',theme:'المحور',potential:'الإمكانات',challenge:'التحدي',questions:'أسئلة التأمل',channel:'قناة الاتصال',trap:'الفخ',roots:'الجذور',fallPatterns:'أنماط التكرار',path:'المسار',stage:'المرحلة',light:'النور',family:'الأسرة والتربية',protocol:'الخطوات العملية',reflectiveQuestions:'أسئلة التأمل',pattern:'النمط',daily:'في الحياة اليومية',remedy:'التوصيات',outer:'الطبقة الظاهرة',middle:'الطبقة الوسيطة',core:'القلب',personal:'البرنامج الشخصي',spiritual:'البرنامج الروحي',material:'البرنامج المادي',root:'الجذر النفسي الرمزي',care:'طريق العناية',physics:'الجسد والفيزياء',energy:'الطاقة',emotions:'المشاعر',lead:'المدخل',physicsPsychology:'الجسد والفيزياء',energyPsychology:'الطاقة',emotionsPsychology:'المشاعر',sahasrara:'التاج',ajna:'العين الثالثة',vishuddha:'الحلق',anahata:'القلب',manipura:'الضفيرة الشمسية',svadhisthana:'العجز',muladhara:'الجذر',title:'العنوان',name:'الاسم'};
function pad(n){return String(n).padStart(2,'0');}function label(k){return LABELS[k]||k;}function nonempty(v){return typeof v==='string'&&v.trim();}
function fields(x,prefix){var out=[];if(typeof x==='string'){if(nonempty(x))out.push({label:prefix||'',text:x});}else if(Array.isArray(x)){x.forEach(function(v){out=out.concat(fields(v,prefix));});}else if(x&&typeof x==='object'){Object.keys(x).forEach(function(k){out=out.concat(fields(x[k],prefix?prefix+' · '+label(k):label(k)));});}return out;}
var splitLongHeading=typeof module==='object'&&module.exports?require('./matrix-library-format.js').splitLongHeading:globalThis.AqeeqMatrixLibraryFormat.splitLongHeading;
function blockParts(bs){var out=[],skip=false;(bs||[]).forEach(function(b){if(!b.t)return;if(b.k!=='tr'&&b.t.indexOf('تقييم والتأمل الذاتي')>=0){skip=true;return;}if(skip&&(b.k==='q'||b.k==='tr'))return;skip=false;if(b.k==='h2'&&b.t.split(/\s+/).length>40&&b.t.includes(' # ')){out=out.concat(splitLongHeading(b.t));}else out.push({label:'',text:b.t,heading:b.k==='h1'||b.k==='h2'});});return out;}
var additions=typeof module==='object'&&module.exports?require('./matrix-additions.js'):globalThis.AqeeqMatrixAdditions;
var completion=typeof module==='object'&&module.exports?require('./matrix-authored-completion.js'):globalThis.AqeeqMatrixCompletion;
function sourceFiles(mode){if(mode==='natal')return natalSource.sourceFiles();var r=[],n;for(n=1;n<=22;n++){if(mode!=='individual')r.push('gemini/'+mode+'-'+pad(n)+'.json','additions/'+mode+'-'+pad(n)+'.json');else r.push('gemini/pos-'+pad(n)+'.json','arcana-'+pad(n)+'.json');}if(mode==='individual'){['center','talents','father_line','mother_line','ancestral_programs','age_cycles','children_line','transformation_rx','composite_programs'].forEach(function(s){r.push('sections/'+s+'.json');});r.push('gemini/tails.json','chakra-lower.json','completion/individual.json');}return r;}
function build(mode,sources){if(mode==='natal'){var natalRows=natalSource.build(sources);natalRows.forEach(function(r){r.search=normal([r.id,r.title,r.context,r.groupTitle,(r.bodies||[r.body]).map(function(b){return natalSource.bodies[b]||'';}).join(' '),natalSource.signs[r.sign]||''].concat(r.parts.map(function(p){return p.text;})).join(' '));});return natalRows;}var rows=[];function add(n,group,title,key,path,parts,context){parts=parts.filter(function(p){return nonempty(p.text);});if(!parts.length)return;rows.push({id:mode+'/'+n+'/'+group+'/'+key,mode:mode,number:n,group:group,groupTitle:GROUPS[group]||group,title:title,source:BASE+path,parts:parts,context:context||'',search:''});}
if(mode!=='individual'){for(var n=1;n<=22;n++){var path='gemini/'+mode+'-'+pad(n)+'.json',d=sources[path];if(!d||!Array.isArray(d.sections))throw Error('missing '+path);var extraPath='additions/'+mode+'-'+pad(n)+'.json',extra=sources[extraPath];if(!additions.validate(extra,mode,n))throw Error('incomplete additions '+extraPath);d.sections.forEach(function(s){GROUPS[s.id]=s.title;s.slots.forEach(function(sl){if(!['free','paid','reflection_question'].every(function(f){return nonempty(sl[f]);}))throw Error('incomplete slot '+path+'/'+s.id+'/'+sl.key);var a=additions.get(extra,s.id,sl.key);if(!a)throw Error('missing addition '+extraPath+'/'+s.id+'/'+sl.key);add(d.arcana,s.id,s.title+' · '+sl.label,sl.key,path,[{label:'المجاني المحفوظ',text:sl.free},{label:'تكملة القراءة المحفوظة',text:sl.paid},{label:'سؤال التأمل المحفوظ',text:sl.reflection_question},{label:'الإضافة · المجاني',text:a.free},{label:'الإضافة · التفصيل',text:a.paid},{label:'الإضافة · سؤال التأمل',text:a.reflection_question}],sl.label+' · '+sl.key);rows[rows.length-1].additionSource=BASE+extraPath;});});}}
else{for(var n=1;n<=22;n++){var path='gemini/pos-'+pad(n)+'.json',d=sources[path];if(!d||!d.positions)throw Error('missing '+path);['core','money','love','tail_entry','mission'].forEach(function(k){if(!d.positions[k]||!blockParts(d.positions[k].blocks).length)throw Error('incomplete position '+path+'/'+k);});if(!d.reference||!blockParts(d.reference.blocks).length)throw Error('incomplete reference '+path);Object.keys(d.positions).forEach(function(k){var u=d.positions[k];add(d.number,k,GROUPS[k],k,path,blockParts(u.blocks).concat(u.reflection_question?[{label:'سؤال التأمل',text:u.reflection_question}]:[]));});if(d.reference)add(d.number,'reference',GROUPS.reference,'reference',path,blockParts(d.reference.blocks),'مصدر المرجع الحالي؛ يُدمج بعضه مع الموضع داخل القراءة مع منع التكرار.');
var ap='arcana-'+pad(n)+'.json',a=sources[ap];if(!a||!a.core)throw Error('missing '+ap);add(n,'arcana',a.name&&a.name.ar||'الأركانا '+n,'core',ap,fields(a.core));Object.keys(a.chakras||{}).forEach(function(k){if(k==='muladhara'||k==='svadhisthana')return;var v=a.chakras[k],valid={};['physicsPsychology','energyPsychology','emotionsPsychology'].forEach(function(f){if(v[f])valid[f]=v[f];});add(a.id,'chakra',label(k),k,ap,fields(valid));});}
['center','talents','father_line','mother_line','ancestral_programs','age_cycles','children_line','transformation_rx','composite_programs'].forEach(function(group){var path='sections/'+group+'.json',d=sources[path];if(!d||!Array.isArray(d.entries))throw Error('missing '+path);d.entries.forEach(function(e){var parts=[];['summary','deep','genderDynamic','fromMother','fromFather'].forEach(function(k){if(e[k])parts=parts.concat(fields(e[k],label(k)));});var n=typeof e.id==='number'?e.id:0;add(n,group,e.code?'البرنامج '+e.code:GROUPS[group],String(e.code||e.id),path,parts,d.positionNote||'');});if(d.intro)add(0,group,'مداخل البرامج','intro',path,fields(d.intro));Object.keys(d.roles||{}).forEach(function(n){add(Number(n),group,'أدوار الرقم في تركيب البرنامج','role-'+n,path,fields(d.roles[n]),'مادة يستخدمها القارئ لتركيب بعض الحالات، وليست تقريرًا مستقلاً لشفرة.');});});
var tails=sources['gemini/tails.json'];if(!tails||!Array.isArray(tails.tails))throw Error('missing tails');tails.tails.forEach(function(t){add(0,'tails',t.title,t.code,'gemini/tails.json',blockParts(t.blocks),'تقرير مخصص للشفرة '+t.code+'؛ موقع الأرقام وترتيبها لهما دلالة في المطابقة.');});var low=sources['chakra-lower.json'];if(!low||!low.arcana)throw Error('missing lower');Object.keys(low.arcana).forEach(function(n){add(Number(n),'lower','الجذر والعجز','arcana-'+n,'chakra-lower.json',fields(low.arcana[n]),'تُستخدم مع متن الأركانا الأساسي ومدخل الشاكرا لعرض مستويات الجسد والطاقة والمشاعر.');});Object.keys(low.chakras||{}).forEach(function(k){add(0,'lower',label(k)+' · المدخل العام',k,'chakra-lower.json',fields(low.chakras[k]));});}
if(mode==='individual'){var completionPath='completion/individual.json',cp=sources[completionPath];if(!completion.validate(cp))throw Error('incomplete ordered completion package');['program','tail'].forEach(function(kind){cp[kind==='program'?'programs':'tails'].forEach(function(e){var parts=kind==='program'?fields({summary:e.summary,deep:e.deep}):blockParts(e.blocks);if(e.shared_code_note)parts.unshift({label:'تمييز السياق',text:completion.displaySharedNote(e.shared_code_note)});add(0,kind==='program'?'composite_programs':'tails','إضافة مخصصة · '+e.code+' · '+e.title,e.code,completionPath,parts,kind==='program'?'الترتيب: الظاهر، ثم الوسيط، ثم القلب. تقرير مضاف مستقل؛ المتن وأدوار الأرقام محفوظة.':'الترتيب في القارئ: D2 أعلى، ثم D3 وسط، ثم D أسفل. تقرير مضاف مستقل عن البرنامج المركب الذي قد يحمل الأرقام نفسها.');rows[rows.length-1].id=e.identity;rows[rows.length-1].completion=true;});});}
var order=['core','tail_entry','mission','center','talents','father_line','mother_line','ancestral_programs','love','money','chakra','composite_programs','children_line','age_cycles','transformation_rx','reference','arcana','lower','tails'];rows.sort(function(a,b){var an=a.number||99,bn=b.number||99;if(an!==bn)return an-bn;if(mode==='individual')return order.indexOf(a.group)-order.indexOf(b.group);return Number(a.group.split('-')[1])-Number(b.group.split('-')[1]);});var seen={};rows.forEach(function(r){if(seen[r.id])throw Error('duplicate '+r.id);seen[r.id]=true;r.search=normal([r.title,r.groupTitle,r.context].concat(r.parts.map(function(p){return p.text;})).join(' '));});return rows;}
function normal(s){return String(s||'').toLowerCase().replace(/[\u064b-\u065f\u0670]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي');}
function filter(rows,state){var q=normal(state.query);return rows.filter(function(r){return(!state.number||r.number===state.number)&&(!state.body||(r.bodies?r.bodies.indexOf(state.body)>=0:r.body===state.body))&&(!state.house||r.house===state.house)&&(!state.sign||r.sign===state.sign)&&(!state.section||r.group===state.section)&&(!q||r.search.indexOf(q)>=0);});}
function boot(){
  var $=function(id){return document.getElementById('ml-'+id);},params=new URLSearchParams(location.search);
  var state={mode:MODES[params.get('mode')]?params.get('mode'):'individual',number:Math.max(0,Math.min(22,Number(params.get('number'))||0)),section:params.get('section')||'',query:params.get('q')||'',entry:params.get('entry')||'',body:params.get('body')||'',house:Math.max(0,Math.min(12,Number(params.get('house'))||0)),sign:params.get('sign')||''};
  var cache={},rows=[],matches=[],active=0,listPage=0,token=0;
  var rich=typeof module==='object'&&module.exports?require('./interpretation-library.js').renderText:globalThis.AqeeqInterpretations.renderText;
  function option(parent,value,title){var e=document.createElement('option');e.value=value;e.textContent=title;parent.appendChild(e);}
  function text(tag,value,cls){var e=document.createElement(tag);e.textContent=value;if(cls)e.className=cls;return e;}
  function isolateNewCodes(el,value){el.replaceChildren();var re=/(?:individual\/(?:program|tail)\/)?\b\d{1,2}(?:\s*-\s*\d{1,2}){2}\b/g,last=0,m;while((m=re.exec(value))){el.appendChild(document.createTextNode(value.slice(last,m.index)));var b=document.createElement('bdi');b.dir='ltr';b.className=m[0].indexOf('individual/')===0?'ml-technical-id':'ml-ordered-code';b.textContent=m[0];el.appendChild(b);last=re.lastIndex;}el.appendChild(document.createTextNode(value.slice(last)));}

  for(var n=1;n<=22;n++)option($('number'),n,'الأركانا '+n);
  for(var h=1;h<=12;h++)option($('house'),h,'البيت '+h);
  Object.keys(natalSource.signs).forEach(function(s){option($('sign'),s,natalSource.signs[s]);});
  function linkFor(r){
    var u=new URL(location.href);u.search='';u.searchParams.set('mode',state.mode);
    if(state.mode==='natal'){
      if(state.body)u.searchParams.set('body',state.body);
      if(state.house)u.searchParams.set('house',String(state.house));
      if(state.sign)u.searchParams.set('sign',state.sign);
    }else u.searchParams.set('number',String(state.number));
    if(state.section)u.searchParams.set('section',state.section);
    if(state.query)u.searchParams.set('q',state.query);
    if(r)u.searchParams.set('entry',r.id);return u.href;
  }
  function syncURL(){history.replaceState(null,'',linkFor(matches[active]));}
  function rowMeta(r){return state.mode==='natal'?[(r.bodies||[r.body]).map(function(b){return natalSource.bodies[b]||'';}).join(' · '),r.house?'البيت '+r.house:'',natalSource.signs[r.sign]||''].filter(Boolean).join(' · '):(r.number?'الأركانا '+r.number:'شفرة أو مدخل عام');}
  function renderArticle(){
    var r=matches[active];$('article').hidden=!r;if(!r)return;state.entry=r.id;
    $('breadcrumb').textContent=[MODES[r.mode],rowMeta(r),r.groupTitle].filter(Boolean).join(' / ');
    $('title').textContent=r.title;if(r.completion)isolateNewCodes($('title'),r.title);$('context').textContent=r.context;
    $('source').href=r.source;$('source').textContent='ملف النص: '+r.source.split('/').pop();
    $('addition-source-row').hidden=!r.additionSource;
    if(r.additionSource){$('addition-source').href=r.additionSource;$('addition-source').textContent='ملف الإضافة: '+r.additionSource.split('/').pop();}
    $('body').replaceChildren();r.parts.forEach(function(p){
      if(p.heading){var heading=text('h3',p.text);if(r.completion)isolateNewCodes(heading,p.text);$('body').appendChild(heading);return;}
      if(p.label)$('body').appendChild(text('p',p.label,'ml-part-label'));
      if(p.rich){var content=document.createElement('div');content.className='ml-rich';content.innerHTML=rich(p.text);$('body').appendChild(content);}
      else if(p.kind==='list'){var ul=document.createElement('ul');ul.appendChild(text('li',p.text));$('body').appendChild(ul);}
      else {var paragraph=text('p',p.text);if(r.completion)isolateNewCodes(paragraph,p.text);$('body').appendChild(paragraph);}
    });
    $('prev').disabled=active===0;$('next').disabled=active===matches.length-1;
    $('position').textContent=(active+1)+' من '+matches.length;$('direct').href=linkFor(r);syncURL();
  }
  function renderList(){
    var count=40,start=listPage*count,list=$('list');list.replaceChildren();
    matches.slice(start,start+count).forEach(function(r,i){
      var b=text('button',r.title);if(r.completion)isolateNewCodes(b,r.title);b.type='button';b.setAttribute('aria-pressed',String(start+i===active));b.appendChild(text('small',rowMeta(r)+' · '+r.groupTitle));
      b.addEventListener('click',function(){active=start+i;renderArticle();renderList();$('title').focus({preventScroll:true});$('article').scrollIntoView({behavior:'auto',block:'start'});});list.appendChild(b);
    });
    if(matches.length>count){
      var nav=text('div','','ml-list-page'),prev=text('button','صفحة الفهرس السابقة'),next=text('button','صفحة الفهرس التالية');prev.disabled=listPage===0;next.disabled=start+count>=matches.length;
      prev.onclick=function(){listPage--;renderList();};next.onclick=function(){listPage++;renderList();};nav.append(prev,text('span',(start+1)+'–'+Math.min(start+count,matches.length)+' / '+matches.length),next);list.appendChild(nav);
    }
  }
  function render(){
    matches=filter(rows,state);active=Math.max(0,matches.findIndex(function(r){return r.id===state.entry;}));listPage=Math.floor(active/40);
    $('status').textContent=matches.length+' مادة مطابقة، من '+rows.length+' مادة في مصادر '+MODES[state.mode]+' الحالية. المادة ليست بالضرورة تقريرًا مستقلاً أو قراءة كاملة.';
    $('empty').hidden=matches.length>0;renderList();renderArticle();if(!matches.length)syncURL();
  }
  function controls(){
    document.querySelectorAll('[data-mode]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.mode===state.mode));});
    var isNatal=state.mode==='natal';$('number-label').hidden=isNatal;$('object-label').hidden=!isNatal;$('natal-details').hidden=!isNatal;
    if(!isNatal){state.body='';state.house=0;state.sign='';}else state.number=0;
    $('number').value=state.number;$('search').value=state.query;
    $('object').replaceChildren();option($('object'),'','كل الأجسام والمواد العامة');
    var bodies=new Set();rows.forEach(function(r){(r.bodies||[r.body]).forEach(function(b){bodies.add(b);});});Object.keys(natalSource.bodies).forEach(function(b){if(bodies.has(b))option($('object'),b,natalSource.bodies[b]);});
    if(state.body&&!bodies.has(state.body))state.body='';if(state.sign&&!natalSource.signs[state.sign])state.sign='';
    $('object').value=state.body;$('house').value=state.house;$('sign').value=state.sign;
    var groups=[];rows.forEach(function(r){if(!groups.some(function(g){return g[0]===r.group;}))groups.push([r.group,r.groupTitle]);});
    $('section').replaceChildren();option($('section'),'','كل الأقسام');groups.forEach(function(g){option($('section'),g[0],g[1]);});
    if(!groups.some(function(g){return g[0]===state.section;}))state.section='';$('section').value=state.section;
  }
  function load(){
    var mine=++token;$('status').textContent='جارٍ تحميل المصادر الحالية…';$('error').hidden=true;$('empty').hidden=true;$('article').hidden=true;$('list').replaceChildren();
    var paths=sourceFiles(state.mode),mode=state.mode;
    var job=cache[mode]||Promise.all(paths.map(function(p){
      var url=(mode==='natal'?'':BASE)+p+'?v='+VERSION;
      return fetch(url,{credentials:'same-origin'}).then(function(r){if(!r.ok)throw Error('HTTP '+r.status);return r.json();}).then(function(d){return[p,d];});
    })).then(function(all){var s={};all.forEach(function(x){s[x[0]]=x[1];});return build(mode,s);});cache[mode]=job;
    job.then(function(result){if(mine!==token)return;rows=result;controls();render();}).catch(function(){delete cache[mode];if(mine!==token)return;$('status').textContent='لم يكتمل تحميل مصادر هذا النوع.';$('error').hidden=false;});
  }
  document.querySelectorAll('[data-mode]').forEach(function(b){b.addEventListener('click',function(){state.mode=b.dataset.mode;state.number=0;state.section='';state.query='';state.entry='';state.body='';state.house=0;state.sign='';load();});});
  $('number').onchange=function(){state.number=Number(this.value);state.entry='';render();};
  $('section').onchange=function(){state.section=this.value;state.entry='';render();};
  $('object').onchange=function(){state.body=this.value;state.entry='';render();};
  $('house').onchange=function(){state.house=Number(this.value);state.entry='';render();};
  $('sign').onchange=function(){state.sign=this.value;state.entry='';render();};
  $('search').oninput=function(){state.query=this.value;state.entry='';render();};
  $('reset').onclick=function(){state.number=0;state.section='';state.query='';state.entry='';state.body='';state.house=0;state.sign='';controls();render();};
  $('retry').onclick=load;
  ['prev','next'].forEach(function(k){$(k).onclick=function(){active+=k==='next'?1:-1;active=Math.max(0,Math.min(matches.length-1,active));renderArticle();listPage=Math.floor(active/40);renderList();$('title').focus({preventScroll:true});};});
  load();
}
return{build:build,sourceFiles:sourceFiles,filter:filter,normal:normal,splitLongHeading:splitLongHeading,boot:boot,groups:GROUPS};});
