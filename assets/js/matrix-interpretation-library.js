/* Data-only validator and selector for the Matrix interpretation library.
   It does not import or call the calculation engine and is not loaded by the UI. */
(function(root,factory){
  'use strict';
  const api=factory();
  root.AqeeqMatrixInterpretationLibrary=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const COMPLETION=new Set(['empty','partial','complete']);
  const REVIEW=new Set(['not-started','draft','in-review','approved']);
  const TEXT_KEYS=['meaning','strengths','challenges','innerTensions','examples','reflectionQuestions','developmentSteps'];
  const hasText=value=>typeof value==='string'&&value.trim().length>0;
  const unique=values=>new Set(values).size===values.length;
  const clone=value=>JSON.parse(JSON.stringify(value));
  const getPath=(object,path)=>String(path).split('.').reduce((value,key)=>value==null?undefined:value[key],object);
  const expectedPositionIds=['north','northEast','east','southEast','south','southWest','west','northWest','center'];

  function validSource(source){
    return !!source&&source.verificationStatus==='verified'&&hasText(source.title)&&typeof source.url==='string'&&/^https:\/\//.test(source.url)&&hasText(source.edition)&&hasText(source.locator);
  }
  function contentHasAnyText(content){
    return !!content&&TEXT_KEYS.some(key=>Array.isArray(content[key])?content[key].length>0:hasText(content[key]));
  }
  function validateContentRecord(record,scope,positionIds,sources,errors){
    if(!record||!record.id||!Number.isInteger(record.arcanaNumber)||record.arcanaNumber<1||record.arcanaNumber>22){errors.push('record identity is invalid');return;}
    if(scope==='core'&&record.positionId!==null)errors.push(record.id+' core positionId must be null');
    if(scope==='position'&&!positionIds.has(record.positionId))errors.push(record.id+' references unknown position '+record.positionId);
    if(scope==='position'&&record.id!=='arcana-'+String(record.arcanaNumber).padStart(2,'0')+'.position.'+record.positionId)errors.push(record.id+' does not match its arcana/position identity');
    if(scope==='core'&&record.id!=='arcana-'+String(record.arcanaNumber).padStart(2,'0')+'.core')errors.push(record.id+' core identity is unstable');
    if(!REVIEW.has(record.reviewStatus)||!COMPLETION.has(record.completeness))errors.push(record.id+' has invalid review/completeness status');
    if(!record.content||TEXT_KEYS.some(key=>!(key in record.content)))errors.push(record.id+' content shape is incomplete');
    if(record.completeness==='empty'&&contentHasAnyText(record.content))errors.push(record.id+' is marked empty but contains text');
    if(record.reviewStatus==='approved'&&(record.completeness!=='complete'||!contentHasAnyText(record.content)))errors.push(record.id+' approved content must be complete and non-empty');
    if(!Array.isArray(record.sourceIds))errors.push(record.id+' sourceIds must be an array');
    else for(const sourceId of record.sourceIds)if(!sources.has(sourceId))errors.push(record.id+' references unknown source id '+sourceId);
  }
  function ruleReady(rule,sources){
    const source=sources.get(rule.sourceId);
    return !!rule&&rule.active===true&&rule.ruleStatus==='verified'&&rule.relationshipStatus==='verified'&&rule.reviewStatus==='approved'&&rule.completeness==='complete'&&validSource(source);
  }
  function validateRule(rule,kind,positions,sources,errors){
    const id=rule&&rule.id||kind+'-unknown';
    if(!rule||!id){errors.push(kind+' identity is missing');return;}
    if(kind==='combination'){
      if(!Array.isArray(rule.arcanaNumbers)||rule.arcanaNumbers.length<2||!unique(rule.arcanaNumbers)||rule.arcanaNumbers.some(n=>!Number.isInteger(n)||n<1||n>22))errors.push(id+' has invalid Arcana numbers');
      if(!Array.isArray(rule.positionIds)||rule.positionIds.length<1||rule.positionIds.some(p=>!positions.has(p)))errors.push(id+' references invalid positions');
    }else if(!rule.fromSectionId||!rule.toSectionId||rule.fromSectionId===rule.toSectionId){
      errors.push(id+' has invalid section endpoints');
    }
    if(!['unverified','verified'].includes(rule.ruleStatus)||!['unverified','verified'].includes(rule.relationshipStatus)||!['draft','in-review','approved'].includes(rule.reviewStatus)||!COMPLETION.has(rule.completeness))errors.push(id+' has invalid verification/review status');
    if(!Array.isArray(rule.conditions)||rule.conditions.length===0)errors.push(id+' must declare matching conditions');
    if(!rule.content||TEXT_KEYS.some(key=>!(key in rule.content)))errors.push(id+' content shape is incomplete');
    if(rule.active&&!ruleReady(rule,sources))errors.push(id+' is active without a verified relationship, approved complete content, and cited source');
    if(rule.sourceId&&!sources.has(rule.sourceId))errors.push(id+' references unknown source '+rule.sourceId);
  }
  function validateLibrary(library){
    const errors=[];
    if(!library||library.schemaVersion!==1)errors.push('schemaVersion must be 1');
    if(!library||!Array.isArray(library.positions)||!Array.isArray(library.sources)||!Array.isArray(library.arcana)||!Array.isArray(library.combinationRules)||!Array.isArray(library.sectionLinks)){errors.push('library arrays are missing');return errors;}
    const positionIds=library.positions.map(x=>x.id);
    const positions=new Set(positionIds);
    const sourceMap=new Map(library.sources.map(x=>[x.id,x]));
    if(positions.size!==library.positions.length)errors.push('position IDs must be unique');
    if(!unique(positionIds)||positionIds.length!==expectedPositionIds.length||expectedPositionIds.some((id,i)=>positionIds[i]!==id))errors.push('position registry must match the current nine matrix node IDs in their stable order');
    if(sourceMap.size!==library.sources.length)errors.push('source IDs must be unique');
    for(const source of library.sources)if(source.verificationStatus==='verified'&&!validSource(source))errors.push(source.id+' is verified but lacks a complete citation');
    if(library.arcana.length!==22)errors.push('library must contain exactly 22 Arcana records');
    const numbers=library.arcana.map(x=>x.arcanaNumber);
    if(!unique(numbers)||numbers.some((n,i)=>n!==i+1))errors.push('Arcana records must cover each number 1..22 exactly once and in order');
    const arcanaIds=new Set(library.arcana.map(x=>x.id));
    if(arcanaIds.size!==library.arcana.length)errors.push('Arcana record IDs must be unique');
    for(const arcana of library.arcana){
      const expected='arcana-'+String(arcana.arcanaNumber).padStart(2,'0');
      if(arcana.id!==expected)errors.push(expected+' has an unstable Arcana ID');
      if(!hasText(arcana.catalogRef))errors.push(expected+' must point to the existing Arcana catalog');
      if(!arcana.coreInterpretation||arcana.coreInterpretation.arcanaNumber!==arcana.arcanaNumber)errors.push(expected+' core record must match its Arcana number');
      validateContentRecord(arcana.coreInterpretation,'core',positions,sourceMap,errors);
      if(!Array.isArray(arcana.positionInterpretations))errors.push(expected+' positionInterpretations must be an array');
      else{
        const posIds=arcana.positionInterpretations.map(x=>x.positionId);
        if(!unique(posIds))errors.push(expected+' has duplicate interpretations for one position');
        for(const record of arcana.positionInterpretations){
          if(record.arcanaNumber!==arcana.arcanaNumber)errors.push(record.id+' Arcana number differs from its parent record');
          validateContentRecord(record,'position',positions,sourceMap,errors);
        }
      }
    }
    const combinationIds=new Set();
    for(const rule of library.combinationRules){if(combinationIds.has(rule.id))errors.push(rule.id+' duplicate rule id');combinationIds.add(rule.id);validateRule(rule,'combination',positions,sourceMap,errors);}
    const linkIds=new Set();
    for(const rule of library.sectionLinks){if(linkIds.has(rule.id))errors.push(rule.id+' duplicate link id');linkIds.add(rule.id);validateRule(rule,'section-link',positions,sourceMap,errors);}
    return errors;
  }
  function matchesAll(facts,conditions){
    return Array.isArray(conditions)&&conditions.length>0&&conditions.every(condition=>{
      const value=getPath(facts,condition.path);
      if(condition.operator==='equals')return value===condition.value;
      if(condition.operator==='oneOf')return Array.isArray(condition.values)&&condition.values.includes(value);
      if(condition.operator==='exists')return value!==undefined&&value!==null;
      return false;
    });
  }
  function getApplicableRules(library,facts,kind){
    if(validateLibrary(library).length)return [];
    const list=kind==='combination'?library.combinationRules:kind==='section-link'?library.sectionLinks:[];
    const sources=new Map(library.sources.map(x=>[x.id,x]));
    return list.filter(rule=>ruleReady(rule,sources)&&matchesAll(facts,rule.conditions)).map(clone);
  }
  function selectApprovedInterpretation(library,arcanaNumber,positionId){
    if(validateLibrary(library).length)return null;
    const arcana=library.arcana.find(item=>item.arcanaNumber===arcanaNumber);
    if(!arcana)return null;
    const record=arcana.positionInterpretations.find(item=>item.positionId===positionId);
    if(!record||record.reviewStatus!=='approved'||record.completeness!=='complete')return null;
    return clone(record);
  }
  return Object.freeze({validSource,validateLibrary,matchesAll,getApplicableRules,selectApprovedInterpretation});
});
