/* Annual report model. All dates and longitudes are derived from the site's Lahiri engine. */
(function(root){
  'use strict';
  var DAY=86400000,START=Date.UTC(2026,10,30,22),SPLIT=Date.UTC(2027,2,31,22),END=Date.UTC(2027,11,31,22),Y0=Date.UTC(2026,11,31,22);
  var KEYS=['saturn','jupiter','rahu','ketu','mars','venus','sun','moon','mercury'];
  var NAMES={saturn:'زحل',jupiter:'المشتري',rahu:'راهو',ketu:'كيتو',mars:'المريخ',venus:'الزهرة',sun:'الشمس',moon:'القمر',mercury:'عطارد',node:'راهو'};
  var AREAS=["نفسك والطريقة اللي بتبدأ بيها","فلوسك واللي بتقدمه والمقابل اللي بتطلبه","كلامك وتعلمك والناس القريبة منك","بيتك وعيلتك واللي بيريحك جوّه المكان","حبك وإبداعك وأولادك لو موجودين في حياتك","شغلك اليومي وعاداتك والطلبات اللي بتشيلها","علاقتك القريبة أو شراكتك في الشغل","الثقة والخصوصية والفلوس المشتركة","تعلمك وسفرك والأفكار اللي بتعيش بيها","شغلك واللي عايز الناس تعرفه عنك","صحابك والناس اللي بتشاركهم هدف","نومك وراحتك والوقت اللي محتاجه لنفسك"];
  var RULES={saturn:[9,10],jupiter:[8,11],mars:[0,7],venus:[1,6],sun:[4],moon:[3],mercury:[2,5]};
  var norm=x=>((x%360)+360)%360,delta=(a,b)=>((a-b+540)%360)-180;
  var body=(ch,k)=>(ch.bodies||[]).find(b=>String(b.key).toLowerCase()===k);
  function point(ch,k){var b=body(ch,k==='rahu'||k==='ketu'?'node':k);if(!b)throw new Error('موضع '+(NAMES[k]||k)+' غير متاح من المحرك.');return norm(b.lon+(k==='ketu'?180:0));}
  function compute(natal,E,V){
    if(!natal||!natal.ch)throw new Error('بيانات الميلاد غير مكتملة.');
    var ch=E.siderealChart(natal),moon=body(ch,'moon');if(!moon)throw new Error('تعذر حساب قمر الميلاد.');
    var known=!!ch.known,lagna=known?Math.floor(ch.asc/30):null;
    var hOf=sg=>known?(sg-lagna+12)%12+1:null,cache=new Map();
    function sky(t){if(cache.has(t))return cache.get(t);var c=E.engineChart(t,natal),ay=E.ayanamsa(c.jde),r={};KEYS.forEach(k=>r[k]=norm(point(c,k)-ay));cache.set(t,r);return r;}
    var samples=[];for(var t=START;t<=END;t+=DAY)samples.push({t:t,p:sky(t)});
    var segs={},stations=[],hits=[];
    KEYS.forEach(k=>{
      var list=[],a=samples[0],sg=Math.floor(a.p[k]/30),s=START;
      for(var i=1;i<samples.length;i++){
        var b=samples[i],next=Math.floor(b.p[k]/30);
        if(next!==sg){var lo=a.t,hi=b.t;while(hi-lo>3600000){var mid=Math.floor((lo+hi)/2);if(Math.floor(sky(mid)[k]/30)===sg)lo=mid;else hi=mid;}
          list.push({planet:k,sign:sg,house:hOf(sg),s:s,e:hi});s=hi;sg=next;}
        if(i>1&&!['rahu','ketu','sun','moon'].includes(k)){
          var v0=delta(a.p[k],samples[i-2].p[k]),v1=delta(b.p[k],a.p[k]);
          if(v0*v1<0){var st=a.t+DAY*(-v0)/(v1-v0)-DAY/2;stations.push({planet:k,t:st,lon:sky(st)[k],direct:v1>0});}
        }
        // An actual conjunction to a natal longitude. A wrap at opposition is never a crossing.
        (ch.bodies||[]).filter(n=>['sun','moon','mercury','venus','mars','jupiter','saturn','node'].includes(n.key)).forEach(n=>{
          var d0=delta(a.p[k],n.lon),d1=delta(b.p[k],n.lon);
          if(d0*d1<=0&&Math.abs(d1-d0)<90&&d0!==d1){
            var at=a.t+(b.t-a.t)*(-d0)/(d1-d0);
            // Two secant corrections, always checked against real angular separation.
            for(var r=0;r<2;r++){var er=delta(sky(at)[k],n.lon),speed=delta(b.p[k],a.p[k])/DAY;if(Math.abs(speed)>1e-10)at=Math.max(a.t,Math.min(b.t,at-er/speed));}
            var orb=Math.abs(delta(sky(at)[k],n.lon));
            if(orb<0.05&&!hits.some(h=>h.planet===k&&h.natal===n.key&&Math.abs(h.t-at)<DAY))hits.push({planet:k,natal:n.key,t:at,lon:sky(at)[k],orb:orb});
          }
        });a=b;
      }
      list.push({planet:k,sign:sg,house:hOf(sg),s:s,e:END});segs[k]=list;
    });
    var birth=Number.isFinite(natal.utcMs)?natal.utcMs:(ch.jde-2440587.5)*DAY,periods=[];
    V.dashas(moon.lon,birth).forEach(m=>V.antars(m).forEach(a=>{if(a.e>Y0&&a.s<END)periods.push({maha:m.lord,lord:a.lord,s:Math.max(a.s,Y0),e:Math.min(a.e,END),actualStart:a.s,actualEnd:a.e});}));
    if(!periods.length)throw new Error('لا توجد فترات محسوبة لهذه السنة.');
    return {known:known,lagna:lagna,moon:moon.lon,periods:periods,segs:segs,stations:stations.sort((a,b)=>a.t-b.t),hits:hits.sort((a,b)=>a.t-b.t),revision:'lahiri-mean-v1',computedAt:Date.now()};
  }
  function periodsAt(R,now){return R.periods.find(p=>p.s<=now&&p.e>now)||R.periods.find(p=>p.s>now)||R.periods[R.periods.length-1];}
  function timeline(R){var out=[];KEYS.forEach(k=>R.segs[k].forEach(s=>{if(s.e>Y0)out.push(Object.assign({},s,{s:Math.max(s.s,Y0),family:'annual'}));}));return out.sort((a,b)=>a.s-b.s||KEYS.indexOf(a.planet)-KEYS.indexOf(b.planet));}
  function lordHouses(k,lagna){return (RULES[k]||[]).map(s=>(s-lagna+12)%12+1);}
  var api={compute:compute,timeline:timeline,periodsAt:periodsAt,lordHouses:lordHouses,KEYS:KEYS,NAMES:NAMES,AREAS:AREAS,START:START,SPLIT:SPLIT,END:END,Y0:Y0,norm:norm,delta:delta};
  root.AqYear2027Core=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
