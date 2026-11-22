(function(root,factory){'use strict';var api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AqeeqMatrixLibraryFormat=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function splitLongHeading(t){
 var out=[];function part(text,heading,kind){if(text.trim())out.push({label:'',text:text.trim(),heading:!!heading,kind:kind||'text'});}
 t.split(/\s+#\s+/).forEach(function(segment,index){
  var list='',at=segment.lastIndexOf(' - ');if(at>=0&&segment.slice(at+3).includes(' :: ')){list=segment.slice(at+3).replace(' :: ',' ');segment=segment.slice(0,at);}
  var head='',body=segment,cut=-1;
  if(index===0){[' رسالة هذه الطاقة ',' الرسالة لا ',' قد لا '].some(function(marker){var i=segment.indexOf(marker);if(i>0){cut=i;return true;}return false;});if(cut<0)cut=segment.indexOf(' يظهر ',6);if(cut>0){head=segment.slice(0,cut);body=segment.slice(cut);}}
  else{var fixed=['أثره على من حوله','ما الذي يحلّ العقدة بهدوء','ما يحل العقدة','كيف تؤدَّى الرسالة في الواقع','كيف تبدو في الواقع','كيف تبدو في الحياة','حين يلتقي الصوت بالناس'];head=fixed.find(function(h){return segment.startsWith(h+' ');})||'';if(!head){[' تتعطل ',' أكثر ما '].some(function(marker){var i=segment.indexOf(marker);if(i>0){head=segment.slice(0,i);return true;}return false;});}if(head)body=segment.slice(head.length);}
  if(head)part(head,true);part(body,false);if(list)part(list,false,'list');
 });
 var clean=function(s){return s.replace(/\s+(?:#|-|::)\s+/g,' ').replace(/\s+/g,' ').trim();};if(clean(out.map(function(p){return p.text;}).join(' '))!==clean(t))throw Error('heading word order changed');return out;
}
return{splitLongHeading:splitLongHeading};});
