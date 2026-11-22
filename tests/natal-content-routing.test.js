'use strict';
const assert = require('node:assert/strict');
const A = require('../assets/js/interpretation-library.js');
function chart(known, chiron) {
  const bodies = A.PLANETS.map((key, i) => ({key,lon:i*30+3,house:i+1,retro:key==='saturn'}));
  bodies.push({key:'truenode',lon:6,house:1},{key:'lilith',lon:39,house:2},{key:'fortune',lon:75,house:3});
  if(chiron)bodies.push({key:'chiron',lon:126,house:5,retro:true});
  return {ch:{known,bodies,cusps:Array.from({length:12},(_,i)=>i*30),asc:0,mc:270}};
}
function ix(entries) { return A.indexOf([entries.map(([id,text])=>({id,status:'approved',summary:text,text}))]); }
const known=A.build(chart(true,true)), unknown=A.build(chart(false,true));
assert.equal(known.items.chiron.house,5);
assert.equal(unknown.items.chiron.house,null);
assert.equal(unknown.items.fortune,undefined);
assert.equal(A.build(chart(true,false)).items.chiron,undefined);
assert.equal(known.items.south_node.house,7);
assert.equal(known.items.south_node.sign,6);
assert(A.files(known).includes('reference'));
const entries=[
 ['natal.core.saturn.house7','SATURN_HOUSE7'],
 ['natal.modifier.saturn.retrograde','SATURN_RETRO_GENERIC'],
 ['natal.modifier.saturn.house7.retrograde','SATURN_RETRO_HOUSE7'],
 ['natal.sign_only.saturn.libra','SATURN_SIGN_LIBRA'],
 ['natal.sign_only.north_node.aries','NORTH_ARIES'],
 ['natal.reference.planet.saturn','SATURN_ESSENCE'],
 ['natal.reference.sign.libra','LIBRA_GENERAL'],
 ['natal.reference.house.house7','HOUSE7_GENERAL'],
 ['natal.reference.asteroid_house.ceres.house1','CERES_REFERENCE'],
 ['natal.reference.aspect.sextile','SEXTILE_GENERAL'],
 ['natal.sign_only.chiron.leo','CHIRON_SIGN_LEO'],
 ['natal.core.chiron.house5','CHIRON_HOUSE5'],
 ['natal.reference.house_position.chiron.house5','CHIRON_REFERENCE_HOUSE5']
];
const S=A.sections(known,ix(entries));
assert(S.planetTpl.saturn.includes('SATURN_RETRO_HOUSE7'));
assert(!S.planetTpl.saturn.includes('SATURN_RETRO_GENERIC'));
assert(S.planetTpl.saturn.includes('SATURN_SIGN_LIBRA'));
assert(S.planetTpl.saturn.includes('SATURN_ESSENCE'));
assert(S.planetTpl.saturn.includes('LIBRA_GENERAL'));
assert(!S.planetTpl.mars.includes('SATURN_RETRO_HOUSE7'));
assert(S.houseTpl[7].includes('HOUSE7_GENERAL'));
assert(!S.houseTpl[6].includes('HOUSE7_GENERAL'));
assert(S.points.includes('CHIRON_HOUSE5'));
assert(S.references.includes('CHIRON_REFERENCE_HOUSE5'));
assert(!S.points.includes('CHIRON_REFERENCE_HOUSE5'));
assert(A.sections(A.build(chart(true,false)),ix(entries)).references.includes('CHIRON_REFERENCE_HOUSE5'));
assert(S.references.includes('CERES_REFERENCE'));
assert(S.references.includes('ليس إثباتًا لوجود هذا الموضع في خريطتك'));
assert(!S.points.includes('CERES_REFERENCE'));
assert(S.aspects.includes('SEXTILE_GENERAL'));
const U=A.sections(unknown,ix(entries));
assert(U.planetTpl.saturn.includes('SATURN_RETRO_GENERIC'));
assert(!U.planetTpl.saturn.includes('SATURN_RETRO_HOUSE7'));
assert(!U.planetTpl.saturn.includes('SATURN_HOUSE7'));
assert(U.points.includes('NORTH_ARIES'));
assert(U.points.includes('CHIRON_SIGN_LEO'));
assert(!U.points.includes('CHIRON_HOUSE5'));
assert.deepEqual(U.houseTpl,{});
assert.equal(U.angles,'');
const escaped=A.renderText('<script>alert(1)</script>');
assert(!escaped.includes('<script>'));
assert(escaped.includes('&lt;script&gt;'));
assert.equal(A.idModifier('saturn','retrograde',7),'natal.modifier.saturn.house7.retrograde');
assert.equal(A.idModifier('saturn','retrograde'),'natal.modifier.saturn.retrograde');
console.log('PASS natal content routing: reference layers, exact house retrograde, sign readings, points, unknown time, escaping, no invented positions');
