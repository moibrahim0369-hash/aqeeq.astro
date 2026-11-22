/* Chiron-only matching. No network, score changes or shared-list mutation.
   Four minor aspects and existing chart points are explicit caller options. */
(function(root,factory){'use strict';var api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AqeeqChironExtensions=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
var PLANETS=['sun','moon','mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto'];
var POINTS=['north_node','south_node','lilith','fortune','asc','dsc','mc','ic'];
var LABELS={sun:'الشمس',moon:'القمر',mercury:'عطارد',venus:'الزهرة',mars:'المريخ',jupiter:'المشتري',saturn:'زحل',uranus:'أورانوس',neptune:'نبتون',pluto:'بلوتو',chiron:'كيرون',north_node:'العقدة الشمالية الحقيقية',south_node:'العقدة الجنوبية الحقيقية',lilith:'ليليث المتوسطة',fortune:'سهم السعادة',asc:'الطالع',dsc:'الهابط',mc:'وسط السماء',ic:'قاع السماء'};
var MAJOR=[{key:'conjunction',angle:0,label:'اقتران',orb:8},{key:'sextile',angle:60,label:'تسديس',orb:4},{key:'square',angle:90,label:'تربيع',orb:6},{key:'trine',angle:120,label:'تثليث',orb:6},{key:'opposition',angle:180,label:'مقابلة',orb:8}];
var MINOR=[{key:'semisextile',angle:30,label:'نصف تسديس',orb:2},{key:'semisquare',angle:45,label:'نصف تربيع',orb:2},{key:'sesquiquadrate',angle:135,label:'تربيع ونصف',orb:2},{key:'quincunx',angle:150,label:'كوينكنكس',orb:2}];
function norm(n){return ((n%360)+360)%360;}
function finite(n){return typeof n==='number'&&Number.isFinite(n);}
function distance(a,b){return Math.abs(((a-b+540)%360+360)%360-180);}
function positions(ch,includePoints){
 var out={};if(!ch||!Array.isArray(ch.bodies))return out;
 var by={};ch.bodies.forEach(function(b){if(b&&finite(b.lon))by[b.key]=b;});
 function add(k,lon,src){if(finite(lon))out[k]={key:k,label:LABELS[k],lon:norm(lon),source:src||k,knownTime:ch.known===true};}
 PLANETS.concat(['chiron']).forEach(function(k){if(by[k]&&!(k==='chiron'&&by[k].approximate===true))add(k,by[k].lon);});
 if(includePoints){
  var nn=by.true_node||by.truenode;
  if(nn){add('north_node',nn.lon,nn.key);add('south_node',nn.lon+180,nn.key+'+180');}
  if(by.lilith)add('lilith',by.lilith.lon,'mean_lilith');
  if(ch.known===true){
   if(by.fortune)add('fortune',by.fortune.lon,'day_night_fortune');
   if(finite(ch.asc)){add('asc',ch.asc);add('dsc',ch.asc+180,'asc+180');}
   if(finite(ch.mc)){add('mc',ch.mc);add('ic',ch.mc+180,'mc+180');}
  }
 }
 return out;
}
function orbLimit(asp,a,b,context){
 if(asp.minor)return asp.orb;
 var lum=a.key==='sun'||a.key==='moon'||b.key==='sun'||b.key==='moon';
 if(context==='transit')return lum?5:3;
 if(context==='synastry')return asp.key==='trine'?7:asp.orb;
 return asp.orb+(lum?1:0);
}
function match(a,b,context,options){
 if(!a||!b)return null;
 var list=MAJOR.map(function(x){return Object.assign({},x);});
 if(options&&options.includeMinor)MINOR.forEach(function(x){list.push(Object.assign({minor:true},x));});
 var angle=distance(a.lon,b.lon),found=null;
 for(var i=0;i<list.length;i++){
  var asp=list[i],orb=Math.abs(angle-asp.angle),limit=orbLimit(asp,a,b,context);
  if(orb<=limit+1e-10){found={type:asp.key,label:asp.label,target:asp.angle,angle:angle,orb:orb,limit:limit,minor:!!asp.minor};break;}
 }
 return found;
}
function row(a,b,context,options){
 var asp=match(a,b,context,options);if(!asp)return null;
 return Object.assign({id:'chiron.'+context+'.'+a.key+'.'+asp.type+'.'+b.key,context:context,first:a.key,second:b.key,firstLabel:a.label,secondLabel:b.label,timedPoint:([a.key,b.key].find(function(k){return ['asc','dsc','mc','ic','fortune'].indexOf(k)>=0;})||null),timedPointOwner:['asc','dsc','mc','ic','fortune'].indexOf(a.key)>=0?'first':['asc','dsc','mc','ic','fortune'].indexOf(b.key)>=0?'second':null,pointApproximate:a.key==='lilith'||b.key==='lilith',linkedAxis:({north_node:'nodes',south_node:'nodes',asc:'horizon',dsc:'horizon',mc:'meridian',ic:'meridian'})[a.key]||({north_node:'nodes',south_node:'nodes',asc:'horizon',dsc:'horizon',mc:'meridian',ic:'meridian'})[b.key]||null,timeUncertain:(a.key==='moon'&&!a.knownTime)||(b.key==='moon'&&!b.knownTime)},asp);
}
function linkedRows(rows){
 var groups={},out=[];
 rows.forEach(function(r){
  if(!r.linkedAxis){out.push(r);return;}
  var side=r.first==='chiron'?'second':'first',key=r.context+'|'+side+'|'+r.linkedAxis,old=groups[key];
  if(!old){r.linkedContacts=[{id:r.id,point:r[side],type:r.type,label:r.label,angle:r.angle,orb:r.orb}];groups[key]=r;out.push(r);return;}
  var contacts=old.linkedContacts.concat({id:r.id,point:r[side],type:r.type,label:r.label,angle:r.angle,orb:r.orb});
  // Use the nearer endpoint as the main reading. Square endpoint orbs tie, so retain the canonical first endpoint.
  if(!(r.type==='square'&&old.type==='square')&&r.angle<old.angle-1e-9){r.linkedContacts=contacts;out[out.indexOf(old)]=r;groups[key]=r;}else old.linkedContacts=contacts;
 });
 return out.sort(function(a,b){return a.orb-b.orb;});
}
function natal(ch,options){
 options=options||{};var p=positions(ch,options.includePoints),out=[];if(!p.chiron)return out;
 PLANETS.concat(options.includePoints?POINTS:[]).forEach(function(k){
  var r=row(p[k],p.chiron,'natal',options);
  // Existing planet-Chiron major readings remain owned by the original natal library.
  if(r&&(r.minor||POINTS.indexOf(k)>=0))out.push(r);
 });
 return linkedRows(out);
}
function transits(natalChart,currentChart,options){
 options=options||{};var n=positions(natalChart,options.includePoints),t=positions(currentChart,false),out=[];
 // A transit chart uses a specified instant even though known=false suppresses its houses.
 Object.keys(t).forEach(function(k){t[k].knownTime=true;});
 if(t.chiron)PLANETS.concat(['chiron'],options.includePoints?POINTS:[]).forEach(function(k){var r=row(t.chiron,n[k],'transit',options);if(r)out.push(r);});
 if(n.chiron)PLANETS.forEach(function(k){var r=row(t[k],n.chiron,'transit',options);if(r)out.push(r);});
 return linkedRows(out);
}
function synastry(firstChart,secondChart,options){
 options=options||{};var a=positions(firstChart,options.includePoints),b=positions(secondChart,options.includePoints),out=[];
 if(a.chiron)PLANETS.concat(['chiron'],options.includePoints?POINTS:[]).forEach(function(k){var r=row(a.chiron,b[k],'synastry',options);if(r)out.push(r);});
 if(b.chiron)PLANETS.concat(options.includePoints?POINTS:[]).forEach(function(k){var r=row(a[k],b.chiron,'synastry',options);if(r)out.push(r);});
 return linkedRows(out);
}
function reading(record,data,allowDraft){
 var e=record&&data&&data[record.id];
 return e&&e.context===record.context&&(e.status==='approved'||(allowDraft&&e.status==='draft'))&&typeof e.text==='string'&&e.text.trim()?e:null;
}
return {PLANETS:PLANETS.slice(),POINTS:POINTS.slice(),LABELS:LABELS,MAJOR:MAJOR,MINOR:MINOR,positions:positions,match:match,natal:natal,transits:transits,synastry:synastry,reading:reading,policy:{minor:'Four common longitude minors, 2 degree fixed orb. Explicit caller option.',natal:'Original major natal planet-Chiron results are not duplicated.',transit:'Existing personal-transit 5 degree luminary / 3 degree other major limits.',synastry:'Separate Chiron-only contacts, no score or composite contribution.',sources:['https://www.skyscript.co.uk/aspects2.html','https://www.astrolearn.com/astrology-articles/aspects2/']}};
});
