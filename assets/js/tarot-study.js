const DATA_URL = "assets/data/tarot/study-cards.json";
const SUPABASE_URL = "https://trcveoewbxqzhhvzawxy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_48pQKHVWg0AXYDRlcNH-HQ_iRyfDMdC";
let supabaseClient = null;
const DRAFT_KEY = "aqeq-tarot-study-local-drafts-v1";
const PROGRESS_KEY = "aqeq-tarot-study-progress-v1";
const catalog = [
 ["major-00-fool",0,"الأحمق","The Fool","major"],["major-01-magician",1,"الساحر","The Magician","major"],
 ["major-02-high-priestess",2,"الكاهنة العليا","The High Priestess","major"],["major-03-empress",3,"الإمبراطورة","The Empress","major"],
 ["major-04-emperor",4,"الإمبراطور","The Emperor","major"],["major-05-hierophant",5,"الكاهن الأعظم","The Hierophant","major"],
 ["major-06-lovers",6,"العشاق","The Lovers","major"],["major-07-chariot",7,"العربة","The Chariot","major"],
 ["major-08-strength",8,"القوة","Strength","major"],["major-09-hermit",9,"الناسك","The Hermit","major"],
 ["major-10-wheel",10,"عجلة الحظ","Wheel of Fortune","major"],["major-11-justice",11,"العدالة","Justice","major"],
 ["major-12-hanged-man",12,"الرجل المعلّق","The Hanged Man","major"],["major-13-death",13,"الموت","Death","major"],
 ["major-14-temperance",14,"الاعتدال","Temperance","major"],["major-15-devil",15,"الشيطان","The Devil","major"],
 ["major-16-tower",16,"البرج","The Tower","major"],["major-17-star",17,"النجمة","The Star","major"],
 ["major-18-moon",18,"القمر","The Moon","major"],["major-19-sun",19,"الشمس","The Sun","major"],
 ["major-20-judgement",20,"الحُكم","Judgement","major"],["major-21-world",21,"العالم","The World","major"]
];
const suits = [["wands","الصولجانات","Wands"],["cups","الكؤوس","Cups"],["swords","السيوف","Swords"],["pentacles","الخماسيات / العملات","Pentacles"]];
const ranks = [["ace","آس","Ace"],["two","اثنان","Two"],["three","ثلاثة","Three"],["four","أربعة","Four"],["five","خمسة","Five"],["six","ستة","Six"],["seven","سبعة","Seven"],["eight","ثمانية","Eight"],["nine","تسعة","Nine"],["ten","عشرة","Ten"],["page","الصفحة","Page"],["knight","الفارس","Knight"],["queen","الملكة","Queen"],["king","الملك","King"]];
for (const [suitId,suitAr,suitEn] of suits) for (const [rankId,rankAr,rankEn] of ranks) {
 const value = rankId === "ace" ? 1 : rankId === "page" ? 11 : rankId === "knight" ? 12 : rankId === "queen" ? 13 : rankId === "king" ? 14 : Number(rankId);
 catalog.push([suitId+"-"+rankId,value,rankAr+" من "+suitAr,rankEn+" of "+suitEn,suitId]);
}
const state = {data:null,selectedId:"major-01-magician",activeSection:"core",filter:"all",query:""};
const $ = (selector) => document.querySelector(selector);
const esc = (value="") => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const getCard = id => state.data?.cards?.find(card => card.id === id);
const getProgress = () => { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)||"[]"); } catch { return []; } };

async function init() {
 try {
  const response = await fetch(DATA_URL,{cache:"no-store"});
  if (!response.ok) throw new Error("تعذر تحميل بيانات الموسوعة.");
  state.data = await response.json();
  if (window.supabase?.createClient) supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  bindEvents(); renderCatalog(); renderDetail(); updateProgress();
 } catch(error) {
  $("#tarot-detail").innerHTML = '<div class="tarot-notice" role="alert">'+esc(error.message)+' راجع ملف بيانات التاروت ثم حدّث الصفحة.</div>';
 }
}
function bindEvents() {
 $("#tarot-search").addEventListener("input",event=>{state.query=event.target.value.trim().toLocaleLowerCase("ar");renderCatalog();});
 document.querySelectorAll("[data-filter]").forEach(button=>button.addEventListener("click",()=>{
  state.filter=button.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach(item=>item.setAttribute("aria-pressed",String(item===button)));
  renderCatalog();
 }));
 $("#tarot-catalog").addEventListener("click",event=>{
  const button=event.target.closest("[data-card-id]"); if(!button)return;
  state.selectedId=button.dataset.cardId;state.activeSection="core";renderCatalog();renderDetail();
 });
 $("#tarot-detail").addEventListener("click",event=>{
  const tab=event.target.closest("[data-section-id]");
  if(tab){state.activeSection=tab.dataset.sectionId;renderDetail();return;}
  const save=event.target.closest("[data-save-progress]");
  if(save)toggleProgress(save.dataset.saveProgress);
 });
 $("#tarot-save-note").addEventListener("click",saveLocalDraft);
 $("#tarot-generate-prompt").addEventListener("click",generatePrompt);
}
function renderCatalog() {
 const filtered=catalog.filter(([id,num,ar,en,group])=>{
  const groupMatch=state.filter==="all"||(state.filter==="major"?group==="major":group===state.filter);
  return groupMatch&&(ar+" "+en+" "+num).toLocaleLowerCase("ar").includes(state.query);
 });
 $("#tarot-catalog-count").textContent=filtered.length+" كارت في الفهرس";
 $("#tarot-catalog").innerHTML=filtered.map(([id,num,ar,en])=>{
  const card=getCard(id);
  const status=card?.status==="published"?"منشور":card?.status==="approved"?"معتمد":"قيد المراجعة";
  return '<button type="button" class="tarot-card-item" data-card-id="'+esc(id)+'" aria-current="'+(id===state.selectedId)+'"><span class="tarot-card-number">'+num+'</span><span><span class="tarot-card-title">'+esc(ar)+'</span><span class="tarot-card-subtitle">'+esc(en)+'</span></span><span class="tarot-status">'+status+'</span></button>';
 }).join("")||'<p class="tarot-muted">مفيش نتائج مطابقة للبحث.</p>';
}
function renderDetail() {
 const card=getCard(state.selectedId);
 if(!card) {
  const item=catalog.find(([id])=>id===state.selectedId);
  $("#tarot-detail").innerHTML='<div class="tarot-detail"><div class="tarot-detail-top"><div><span class="tarot-eyebrow">قيد الإعداد</span><h2>'+esc(item?.[2]||"كارت تاروت")+'</h2><div class="tarot-subtitle">'+esc(item?.[3]||"")+'</div></div><span class="tarot-status">لم يُعتمد محتواه بعد</span></div><p class="tarot-muted">الكارت موجود في الفهرس، لكن محتواه الموسوعي لم يُكتب أو يُراجع بعد. لن نعرض معاني مولّدة على أنها مرجع معتمد.</p><div class="tarot-notice">أضف النصوص والمراجع، ثم أنشئ التحليل وراجعه قبل اعتماده.</div></div>';return;
 }
 const sections=card.sections||[];
 const active=sections.find(section=>section.id===state.activeSection)||sections[0];
 const saved=getProgress().includes(card.id);
 const keywords=[...(card.keywords?.upright||[]),...(card.keywords?.reversed||[]).slice(0,3)];
 const tabs=sections.map(section=>'<button type="button" class="tarot-tab" role="tab" aria-selected="'+(state.activeSection===section.id)+'" data-section-id="'+esc(section.id)+'">'+esc(section.title)+'</button>').join("");
 const content=state.activeSection==="quick"?quickSummary(card):(active?'<h3>'+esc(active.title)+'</h3><p>'+esc(active.content)+'</p><span class="tarot-status">'+statusLabel(active.status)+'</span>':"");
 const category=card.arcana==="major"?"الأركانا الكبرى":("الأركانا الصغرى · "+(card.suit||""));
 const reference=card.traditionalReference?.summary||"لم يُضف ملخص مرجعي بعد.";
 const original=card.aqeqInterpretation?.core||"لم تُضف قراءة عقيق الأصلية بعد.";
 $("#tarot-detail").innerHTML='<div class="tarot-detail"><div class="tarot-detail-top"><div><span class="tarot-eyebrow">'+esc(category)+' · '+card.number+'</span><h2>'+esc(card.nameAr)+'</h2><div class="tarot-subtitle">'+esc(card.nameEn)+'</div></div><button type="button" class="tarot-button" data-save-progress="'+esc(card.id)+'">'+(saved?"✓ تمت المذاكرة":"حفظ كتقدم دراسي")+'</button></div><div class="tarot-keywords">'+keywords.map(word=>'<span class="tarot-keyword">'+esc(word)+'</span>').join("")+'</div><div class="tarot-notice"><strong>المعنى المرجعي:</strong> '+esc(reference)+'<br><strong>قراءة عقيق أسترو الأصلية:</strong> '+esc(original)+'<br><strong>الحالة التحريرية:</strong> '+statusLabel(card.status)+'. '+esc(card.editorialNotes||"")+'</div><div class="tarot-tabs" role="tablist" aria-label="أقسام الكارت">'+tabs+'<button type="button" class="tarot-tab" role="tab" aria-selected="'+(state.activeSection==="quick")+'" data-section-id="quick">ملخص القراءة</button></div><section class="tarot-section" aria-live="polite">'+content+'</section></div>';
}
function statusLabel(status){return ({raw:"مادة خام",draft:"مسودة",in_review:"قيد المراجعة",approved:"معتمد",published:"منشور",archived:"مؤرشف"})[status]||"قيد المراجعة";}
function quickSummary(card) {
 return '<div class="tarot-section-card"><h3>المعنى المعتدل</h3><p>'+esc(card.upright?.summary||"لم يُضف بعد.")+'</p></div><div class="tarot-section-card"><h3>المعنى المعكوس</h3><p>'+esc(card.upright?.reversedSummary||"لم يُضف بعد.")+'</p></div>'+Object.entries(card.fields||{}).map(([name,field])=>'<div class="tarot-section-card"><h3>'+esc(({love:"العلاقات",work:"العمل",money:"المال",shadow:"الظل",personalGrowth:"النمو الشخصي"})[name]||name)+'</h3><p><strong>المتوازن:</strong> '+esc(field.upright||"")+'</p><p><strong>الظل:</strong> '+esc(field.reversed||"")+'</p></div>').join("");
}
function toggleProgress(id) {
 const progress=new Set(getProgress());if(progress.has(id))progress.delete(id);else progress.add(id);
 localStorage.setItem(PROGRESS_KEY,JSON.stringify([...progress]));renderCatalog();renderDetail();updateProgress();
}
function updateProgress(){ $("#tarot-progress").textContent="ذاكرت "+getProgress().length+" كارت من "+catalog.length+" كارت في الفهرس"; }
function saveLocalDraft() {
 const title=$("#tarot-draft-title").value.trim(),rawText=$("#tarot-draft-source").value.trim(),source=$("#tarot-draft-source-name").value.trim();
 if(!title||!rawText){$("#tarot-draft-status").textContent="اكتب عنوان المادة والنص الأول.";return;}
 let drafts=[];try{drafts=JSON.parse(localStorage.getItem(DRAFT_KEY)||"[]");}catch{}
 drafts.push({id:"local-"+Date.now(),title,source,rawText,status:"raw-local-draft",createdAt:new Date().toISOString()});
 localStorage.setItem(DRAFT_KEY,JSON.stringify(drafts));
 $("#tarot-draft-status").textContent="اتحفظت المسودة على الجهاز ده فقط. مش مرفوعة للسيرفر ومش متاحة من أجهزة تانية.";
 $("#tarot-draft-title").value="";$("#tarot-draft-source-name").value="";$("#tarot-draft-source").value="";
}
async function generatePrompt() {
 const question=$("#tarot-question").value.trim(),card=getCard(state.selectedId);
 if(!question){$("#tarot-prompt-output").textContent="اكتب سؤالك الأول.";return;}
 if(!supabaseClient){$("#tarot-prompt-status").textContent="تعذر تهيئة عميل Supabase. تأكد من تحميل مكتبة العميل.";return;}
 const button=$("#tarot-generate-prompt");button.disabled=true;button.textContent="جاري استرجاع المعرفة وإنشاء القراءة…";
 $("#tarot-prompt-status").textContent="بنحاول الاتصال بالخدمة الآمنة. لازم تكون مسجل الدخول، ويكون ترحيل الموسوعة وخدمة النموذج منشورين على الخادم.";
 try {
  const {data:sessionData,error:sessionError}=await supabaseClient.auth.getSession();
  if(sessionError||!sessionData?.session?.access_token) throw new Error("سجّل الدخول من الموقع الأول لاستخدام المساعد.");
  const {data,error}=await supabaseClient.functions.invoke("tarot-assistant",{body:{question,gender:$("#tarot-gender")?.value||"neutral",cardIds:card?[card.id]:[]}});
  if(error) throw error;
  if(data?.error) throw new Error(data.error);
  $("#tarot-prompt-output").textContent=data.answer||"الخدمة رجعت من غير إجابة.";
  const sources=(data.sources||[]).map(source=>source.title+(source.author?" · "+source.author:"")).join("، ");
  $("#tarot-prompt-status").textContent="قراءة مولّدة باستخدام "+(data.model||"النموذج")+". "+(sources?"المراجع المسترجعة: "+sources:"لم تُرفق مراجع منشورة بهذه القراءة.")+" تظل القراءة تأملية وليست حقيقة مؤكدة.";
 } catch(error) {
  $("#tarot-prompt-output").textContent="";
  $("#tarot-prompt-status").textContent=error?.message||"الخدمة غير متاحة الآن. تأكد من إعدادات الخادم ثم حاول لاحقًا.";
 } finally {button.disabled=false;button.textContent="اسأل مساعد المكتبة";}
}
init();