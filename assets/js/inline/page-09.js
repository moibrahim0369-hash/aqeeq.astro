
(function(){
  var mform=document.getElementById("mf-form");
  if(mform){
    var KEY="aqeeq_manifest", mlist=document.getElementById("mf-list");
    var mread=function(){try{return JSON.parse(localStorage.getItem(KEY)||"[]");}catch(x){return [];}};
    var mwrite=function(a){try{localStorage.setItem(KEY,JSON.stringify(a));return true;}catch(x){return false;}};
    var mesc=function(x){return String(x).replace(/&/g,"&amp;").replace(/</g,"&lt;");};
    var mrender=function(){
      var a=mread();
      mlist.innerHTML=a.length? a.slice().reverse().map(function(r){return '<li><small>'+mesc(r.d)+'</small><p>'+mesc(r.img)+'</p>'+(r.q?'<p class="sub">'+mesc(r.q)+'</p>':'')+'<button type="button" class="btn ghost sm" data-del="'+mesc(r.id)+'">امسح</button></li>';}).join("") : "";
    };
    mform.addEventListener("submit",function(e){
      e.preventDefault();
      var err=document.getElementById("mf-err"), img=document.getElementById("mf-img").value.trim(), q=document.getElementById("mf-q").value.trim();
      err.hidden=true;
      if(!img){err.textContent="اكتب الصورة اللي في بالك الأول.";err.hidden=false;return;}
      var a=mread(); a.push({id:Date.now(),d:new Date().toLocaleDateString("ar-EG"),img:img,q:q});
      if(!mwrite(a)){err.textContent="المتصفح مش سامح يحفظ هنا. جرب متصفح تاني أو وضع عادي.";err.hidden=false;return;}
      document.getElementById("mf-img").value=""; document.getElementById("mf-q").value=""; mrender();
    });
    mlist.addEventListener("click",function(e){
      var id=e.target && e.target.getAttribute && e.target.getAttribute("data-del");
      if(!id) return;
      mwrite(mread().filter(function(r){return String(r.id)!==id;})); mrender();
    });
    mrender();
  }
})();
