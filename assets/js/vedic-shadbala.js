/* Shadbala, a declared BPHS/Saravali calculation convention, not a cross-software standard. */
(function () {
  'use strict';
  var K=['sun','moon','mars','mercury','jupiter','venus','saturn'],N=['الشمس','القمر','المريخ','عطارد','المشتري','الزهرة','زحل'];
  var OWN=[2,5,3,1,0,3,5,2,4,6,6,4],EX=[10,33,298,165,95,357,200],MT=[4,1,0,5,8,6,10];
  var FRIEND=[[1,2,4],[0,3],[0,1,4],[0,5],[0,1,2],[3,6],[3,5]],ENEMY=[[5,6],[],[3],[1],[3,5],[0,1],[0,1,2]];
  var MEAN={earth:[100.466457,36000.7698278,0.00030322,0.00000002],mercury:[252.250906,149474.0722491,0.0003035,0.000000018],venus:[181.979801,58519.2130302,0.00031014,0.000000015],mars:[355.433,19141.6964471,0.00031052,0.000000016],jupiter:[34.351519,3036.3027748,0.0002233,0.000000037],saturn:[50.077444,1223.5110686,0.00051908,-0.00000003]};
  var REQ=[390,360,300,420,390,330,300],DAY=864e5;
  function norm(x){return ((x%360)+360)%360;}
  function signed(x){return norm(x+180)-180;}
  function sep(a,b){return Math.abs(signed(a-b));}
  function sum(a){return a.reduce(function(x,y){return x+y;},0);}
  function body(ch,k){return (ch.bodies||[]).filter(function(b){return b.key===k;})[0];}
  function mean(k,jde){var c=MEAN[k],t=(jde-2451545)/36525;return norm(c[0]+t*(c[1]+t*(c[2]+t*c[3])));}
  function chesta(p,jde,trueLon){
    var sun=norm(mean('earth',jde)+180),m=mean(K[p],jde),sighra=sun;
    if(p===3||p===5){sighra=m;m=sun;}
    var average=norm(m+signed(trueLon-m)/2);return sep(sighra,average)/3;
  }
  function aspect(a,p){
    a=norm(a);var v=0,r=a%30;
    if(a>=30&&a<60)v=(a-30)/2;
    else if(a<90&&a>=60)v=a-45;
    else if(a<120&&a>=90)v=(120-a)/2+30;
    else if(a<150&&a>=120)v=150-a;
    else if(a<180&&a>=150)v=(a-150)*2;
    else if(a>=180&&a<300)v=(300-a)/2;
    if(p===6){if(a>=30&&a<60)v=r*2;else if(a>=60&&a<90)v=60-r/2;else if(a>=240&&a<270)v=30+r;else if(a>=270&&a<300)v=(30-r)*2;}
    if(p===2){if((a>=90&&a<120)||(a>=210&&a<240))v=60-r;else if(a>=60&&a<90)v=15+1.5*r;else if(a>=180&&a<210)v=60;}
    if(p===4){if((a>=90&&a<120)||(a>=210&&a<240))v=45+r/2;else if((a>=120&&a<150)||(a>=240&&a<270))v=60-r;}
    return Math.max(0,Math.min(60,v));
  }
  function ayana(p,tropical){
    // BPHS's tabular 45/33/12 method, expressed on a 0..90 arc, then /3.
    var l=norm(tropical),b=Math.min(l%180,180-l%180),f=b<30?b*45/30:b<60?45+(b-30)*33/30:78+(b-60)*12/30;
    var north=l<180,s=(p===1||p===6)?-1:1;if(p===3)s=north?1:-1;
    return (90+(north?1:-1)*s*f)/3;
  }
  function uchcha(p,l){return sep(l,norm(EX[p]+180))/3;}
  function temporal(ms,ch){
    var A=window.Astronomy;if(!A)throw new Error('محرك الشروق غير متاح.');
    var obs=new A.Observer(ch.lat,ch.lon,0),start=new Date(ms-2*DAY),up=A.SearchRiseSet('Sun',obs,1,start,4),rises=[],sets=[];
    // Bounded search over neighbouring solar days, not account/network polling.
    while(up&&up.date.getTime()<=ms+2*DAY&&rises.length<5){rises.push(up.date.getTime());up=A.SearchRiseSet('Sun',obs,1,up.AddDays(0.05),2);}
    var down=A.SearchRiseSet('Sun',obs,-1,start,4);
    while(down&&down.date.getTime()<=ms+2*DAY&&sets.length<5){sets.push(down.date.getTime());down=A.SearchRiseSet('Sun',obs,-1,down.AddDays(0.05),2);}
    var rise=rises.filter(function(t){return t<=ms;}).pop(),next=rises.filter(function(t){return t>ms;})[0];
    if(!Number.isFinite(rise)||!Number.isFinite(next))throw new Error('لا شروق يومي عند هذا المكان والتاريخ؛ لن نخمن قوة الزمن القطبية.');
    var set=sets.filter(function(t){return t>rise&&t<next;})[0];if(!Number.isFinite(set))throw new Error('تعذر تحديد غروب الشمس.');
    var day=ms<set,from=day?rise:set,to=day?set:next,third=Math.min(2,Math.floor((ms-from)/(to-from)*3));
    var solarDate=new Date(rise+ch.lon/360*DAY),year=solarDate.getUTCFullYear(),month=solarDate.getUTCMonth()+1,weekday=solarDate.getUTCDay();
    var horaIndex=(day?0:12)+Math.min(11,Math.floor((ms-from)/(to-from)*12)),order=[6,4,2,0,5,3,1];
    var ha=A.HourAngle('Sun',new Date(ms),obs),noon=60-Math.abs(ha>12?ha-24:ha)*5;
    return {rise:rise,set:set,nextRise:next,day:day,third:third,noon:noon,lords:[((year+3)*3)%7,((12*year+month+6)*2)%7,weekday,order[(order.indexOf(weekday)+horaIndex)%7]],hora:horaIndex+1};
  }
  function positional(p,longs,asc,div){
    var lon=longs[p],sg=Math.floor(lon/30),nav=div(lon,9),vargas=[1,2,3,7,9,12,30],points=[];
    var sv=sum(vargas.map(function(d){
      var signs=longs.map(function(v){return div(v,d);}),s=signs[p],owner=OWN[s];
      if(d===1&&s===MT[p]){points.push(45);return 45;}
      if(owner===p){points.push(30);return 30;}
      // Compound relationship is based on natal Rasi positions, explicitly selected.
      var natural=FRIEND[p].indexOf(owner)>=0?1:ENEMY[p].indexOf(owner)>=0?-1:0;
      var house=(Math.floor(longs[owner]/30)-sg+12)%12+1,temp=[2,3,4,10,11,12].indexOf(house)>=0?1:-1;
      var v=({'2':20,'1':15,'0':10,'-1':4,'-2':2})[natural+temp];points.push(v);return v;
    }));
    var female=p===1||p===5,odd=sg%2===0,oddNav=nav%2===0,oj=(odd!==female?15:0)+(oddNav!==female?15:0);
    var house=(sg-Math.floor(asc/30)+12)%12,ken=[60,30,15][house%3],dec=Math.floor(lon%30/10),want=(p===0||p===2||p===4)?0:female?1:2;
    var parts=[uchcha(p,lon),sv,oj,ken,dec===want?15:0];return {parts:parts,vargaPoints:points,total:sum(parts)};
  }
  function calculate(ch,natal){
    if(!ch||!ch.known||!Number.isFinite(ch.asc)||!Number.isFinite(ch.mc)||!natal||!Number.isFinite(natal.utcMs))throw new Error('وقت ميلاد معلوم ومكانه مطلوبان لحساب القوى الست.');
    if(!Number.isFinite(ch.lat)||!Number.isFinite(ch.lon))throw new Error('إحداثيات الميلاد غير متاحة.');
    var E=window.AqEam,V=window.AqVedic,longs=K.map(function(k){var b=body(ch,k);if(!b||!Number.isFinite(b.lon))throw new Error('مواضع الكواكب غير مكتملة.');return norm(b.lon);});
    var off=E.ayanamsa(ch.jde),t=temporal(natal.utcMs,ch),elong=norm(longs[1]-longs[0]),wax=elong<=180,phase=Math.min(elong,360-elong)/3;
    var mercurySign=Math.floor(longs[3]/30);
    var mercuryBad=longs.some(function(l,p){return ([0,2,6].indexOf(p)>=0||(p===1&&!wax))&&Math.floor(l/30)===mercurySign;});
    var node=body(ch,'node')||body(ch,'truenode');
    if(node&&Number.isFinite(node.lon)&&(Math.floor(norm(node.lon)/30)===mercurySign||Math.floor(norm(node.lon+180)/30)===mercurySign))mercuryBad=true;
    var benefic=K.map(function(_,p){return p===4||p===5||(p===1&&wax)||(p===3&&!mercuryBad);});
    var rows=K.map(function(k,p){
      var st=positional(p,longs,ch.asc,V.div),weak=(p===0||p===2)?norm(ch.mc+180):(p===3||p===4)?norm(ch.asc+180):(p===1||p===5)?ch.mc:ch.asc;
      var dig=sep(longs[p],weak)/3,ay=ayana(p,norm(longs[p]+off)),pak=benefic[p]?phase:60-phase;
      var kalaParts=[p===3?60:([0,4,5].indexOf(p)>=0?t.noon:60-t.noon),pak,(p===4||p===(t.day?[3,0,6]:[1,5,2])[t.third])?60:0];
      [15,30,45,60].forEach(function(v,j){kalaParts.push(t.lords[j]===p?v:0);});kalaParts.push(ay);
      var mot=p===0?ay:p===1?pak:chesta(p,ch.jde,norm(longs[p]+off));
      var contributions=K.map(function(_,q){if(q===p)return 0;var a=aspect(norm(longs[p]-longs[q]),q),c=benefic[q]?0.25:-0.25;if(q===3||q===4)c+=1;return a*c;});
      var drik=sum(contributions),natural=[60,360/7,120/7,180/7,240/7,300/7,60/7][p];
      return {key:k,name:N[p],sthana:st.total,sthanaParts:st.parts,vargaPoints:st.vargaPoints,dig:dig,kala:sum(kalaParts),kalaParts:kalaParts,chesta:mot,naisargika:natural,drik:drik,contributions:contributions};
    });
    var wars=[];for(var i=2;i<7;i++)for(var j=i+1;j<7;j++)if(sep(longs[i],longs[j])<1)wars.push([i,j]);
    // Do not manufacture a total where the war convention has not been verified.
    rows.forEach(function(r,p){r.total=wars.length?null:r.sthana+r.dig+r.kala+r.chesta+r.naisargika+r.drik;r.rupas=r.total===null?null:r.total/60;r.required=REQ[p]/60;r.ratio=r.total===null?null:r.total/REQ[p];});
    return {rows:rows,temporal:t,wars:wars,convention:'BPHS27-explicit-v1',complete:wars.length===0};
  }
  function createCard(){
    var el=document.createElement('div');el.className='vsb vad';var L=window.AqVedic&&window.AqVedic.last,r;
    try{r=calculate(L&&L.ch,L&&L.natal);}catch(e){el.innerHTML='<p class="vad-warning"></p>';el.firstChild.textContent=e.message;return el;}
    var fmt=function(v){return v===null?'غير مكتمل':v.toFixed(2);};
    var h='<p class="vad-lead">تفصيل القوى الست لكل كوكب، بالفيروبا. كل 60 فيروبا = روبا واحدة. هذه نسخة معلنة القواعد، وليست وعدًا بالتطابق مع كل برامج شادبالا.</p>';
    if(r.wars.length)h+='<p class="vad-warning">توجد حرب كوكبية (أقل من درجة): '+r.wars.map(function(w){return N[w[0]]+' / '+N[w[1]];}).join('، ')+'. لا نعرض مجموعًا أو ترتيبًا نهائيًا لأن تصحيح الحرب لم يُعتمد بعد. القيم أدناه قبل هذا التصحيح.</p>';
    h+='<div class="vad-signs">'+r.rows.map(function(v){return '<article><span>'+v.name+'</span><b>'+fmt(v.rupas)+'</b><small>روبا'+(v.ratio===null?'':' · النسبة '+fmt(v.ratio))+'</small></article>';}).join('')+'</div><label>تفاصيل الكوكب<select class="vsb-select">'+N.map(function(n,p){return '<option value="'+p+'">'+n+'</option>';}).join('')+'</select></label><div class="vsb-out"></div>';
    h+='<p class="vad-note">المنهج: BPHS 27، المولاثريكونا في D1 فقط، الصداقة المركبة من D1، نقاط السبعة 45/30/20/15/10/4/2. قوة الاتجاه من الطالع ووسط السماء الفعليين. الشروق والغروب فلكيان، واليوم يبدأ بالشروق، والهورا 12 جزءًا للنهار و12 لليل.</p><p class="vad-note">حاكما السنة والشهر وفق معادلات Saravali المعلنة، وليسا تلقائيًا حاكمي أول يناير وأول الشهر المدني. قوة الحركة من متوسطات مدارية حديثة مع قاعدة منفصلة لعطارد والزهرة؛ أيانا بجدول 45/33/12. درِك حسب زوايا BPHS 26، وقراءة «إضافة تأثير عطارد والمشتري كاملًا» في BPHS 27.19. اختلاف هذه الاختيارات يغيّر المجموع بين المدارس. لا يُستنتج حدث أو احتمال علمي من الرقم.</p>';
    el.innerHTML=h;
    function render(){var v=r.rows[+el.querySelector('select').value],labels=['الموقع · ستانا','الاتجاه · دِغ','الزمن · كالا','الحركة · تشيشتا','الطبيعة · نايسارغيكا','الاتصالات · درِك'],values=[v.sthana,v.dig,v.kala,v.chesta,v.naisargika,v.drik];
      var s='<div class="vsb-parts">'+labels.map(function(n,k){return '<p><span>'+n+'</span><b>'+fmt(values[k])+'</b></p>';}).join('')+'</div><p class="vad-total">المجموع '+fmt(v.total)+' فيروبا · الحد التقليدي '+v.required+' روبا</p><details><summary>تفصيل الحساب</summary><p class="vad-note">الموقع (الشرف، التقسيمات، الفردي/الزوجي، المركز، الدريكانا): '+v.sthanaParts.map(fmt).join(' / ')+'</p><p class="vad-note">نقاط D1/D2/D3/D7/D9/D12/D30: '+v.vargaPoints.map(fmt).join(' / ')+'</p><p class="vad-note">الزمن (نهار/ليل، طور القمر، ثلث اليوم، السنة، الشهر، اليوم، الهورا، أيانا): '+v.kalaParts.map(fmt).join(' / ')+'</p></details>';el.querySelector('.vsb-out').innerHTML=s;}
    el.querySelector('select').addEventListener('change',render);render();return el;
  }
  window.AqShadbala={calculate:calculate,createCard:createCard,math:{norm:norm,sep:sep,mean:mean,chesta:chesta,aspect:aspect,ayana:ayana,uchcha:uchcha,positional:positional,temporal:temporal}};
})();
