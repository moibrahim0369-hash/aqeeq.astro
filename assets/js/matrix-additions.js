(function(root,factory){'use strict';var api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AqeeqMatrixAdditions=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
var FIELDS=['free','paid','reflection_question'];
var KEYS={child:[['A','E'],['A2','balance'],['F','G','father','mother'],['B','B2'],['C','C2'],['personal','social','spiritual'],['D','D2','D3'],['__year','__age']],compat:[['E','personal'],['A','social'],['money','balance'],['C','I'],['D3','C2'],['D','D2'],['heart','B2'],['H','G'],['F','spiritual'],['personal','earth'],['B','A2']]};
function validate(d,mode,n){
 if(!KEYS[mode]||!Number.isInteger(n)||n<1||n>22||!d||d.schemaVersion!==1||d.mode!==mode||d.arcana!==n||!Array.isArray(d.sections)||d.sections.length!==KEYS[mode].length)return false;
 var prefix=mode==='child'?'child-':'pair-',seen={};
 return d.sections.every(function(s){if(!s)return false;var i=Number(String(s.id).slice(prefix.length));if(s.id!==prefix+i||!KEYS[mode][i]||seen[s.id]||!Array.isArray(s.slots)||s.slots.length!==KEYS[mode][i].length)return false;seen[s.id]=true;var keys={};return s.slots.every(function(sl){if(!sl||KEYS[mode][i].indexOf(sl.key)<0||keys[sl.key]||!sl.addition)return false;keys[sl.key]=true;return FIELDS.every(function(k){return typeof sl.addition[k]==='string'&&sl.addition[k].trim();});});});
}
function get(d,section,key){var s=d&&Array.isArray(d.sections)&&d.sections.find(function(s){return s.id===section;});var sl=s&&s.slots.find(function(sl){return sl.key===key;});return sl&&sl.addition||null;}
return{validate:validate,get:get,fields:FIELDS,keys:KEYS};
});
