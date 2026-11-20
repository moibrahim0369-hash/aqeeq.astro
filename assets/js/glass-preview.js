/* زر معاينة الستايل الزجاجي (تجريبي). الافتراضي: الشكل الأصلي. التفعيل: الزر أو ?glass=1 ، والإلغاء ?glass=0 */
(function(){
  var root=document.documentElement,KEY="aq-glass-preview";
  function get(){try{return localStorage.getItem(KEY)==="1";}catch(e){return false;}}
  function set(v){try{localStorage.setItem(KEY,v?"1":"0");}catch(e){}}
  var q=/[?&]glass=([01])/.exec(location.search);
  if(q)set(q[1]==="1");
  var on=get();
  root.classList.toggle("aq-glass",on);
  var b=document.createElement("button");
  b.type="button";b.className="aq-glass-toggle";
  b.innerHTML='<i></i><span></span>';
  function paint(){b.setAttribute("aria-pressed",String(on));b.lastChild.textContent=on?"المعاينة: زجاجي":"المعاينة: الأصلي";}
  b.addEventListener("click",function(){on=!on;set(on);root.classList.toggle("aq-glass",on);paint();});
  paint();document.body.appendChild(b);
})();
