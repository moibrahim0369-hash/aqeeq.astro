
(function(){
  var links=[].slice.call(document.querySelectorAll(".bnav a"));
  var mark=function(){var h=location.hash||"#home";links.forEach(function(a){a.classList.toggle("on",a.getAttribute("href")===h);});};
  window.addEventListener("hashchange",mark); mark();
})();
