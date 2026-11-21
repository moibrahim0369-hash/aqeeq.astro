const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('assets/js/you-onboard.js','utf8');
for(const known of[false,true]){
 const events={},wevents={},storage={aqeeq_profile_cache_v1:'fixture-must-remain'},timers=[];let created=0,warmed=0;
 const document={querySelector:()=>null,addEventListener:(k,f)=>events[k]=f,createElement:()=>{created++;throw Error('Automatic onboarding tried to create UI')},documentElement:{classList:{remove(){}}}};
 const window={AqSession:{user:{id:'fixture'}},AqeeqChartContext:{getMine:()=>known?{ch:{bodies:[],known:false}}:null},addEventListener:(k,f)=>wevents[k]=f,requestIdleCallback:()=>warmed++};
 const store={getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v,removeItem:k=>delete storage[k]};
 vm.runInNewContext(source,{window,document,localStorage:store,sessionStorage:store,setTimeout:f=>timers.push(f),Date,JSON});
 events['aq:session']();wevents.load();while(timers.length)timers.shift()();
 assert.equal(created,0);assert.equal(storage.aqeeq_profile_cache_v1,'fixture-must-remain');assert.equal(typeof window.AqeeqOnboard.open,'function');assert.equal(warmed,known?2:0);
}
console.log('PASS signed-in with and without saved natal data: no automatic screen; data intact; manual open preserved; known-chart warm preserved.');
