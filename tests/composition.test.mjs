import test from 'node:test';import assert from 'node:assert/strict';import{musicEvent}from '../dist/composition.js';
test('五段原创乐句保持休止、安全音域与不同的阶段结构',()=>{
 const signatures=[];
 for(let stage=0;stage<5;stage++){
  const phrase=Array.from({length:32},(_,beat)=>musicEvent(stage,beat,false));signatures.push(phrase.map(e=>e.frequency).join(','));
  assert.ok(phrase.filter(e=>e.frequency===null).length>=8);assert.ok(phrase.filter(e=>e.frequency!==null).length>=8);
  for(const e of phrase){assert.ok(e.frequency===null||(e.frequency>=40&&e.frequency<1000));assert.ok(e.interval>=1&&e.interval<=2);assert.ok(Number.isFinite(e.pan)&&Math.abs(e.pan)<=1)}
 }
 assert.equal(new Set(signatures).size,5);
 const chase=Array.from({length:8},(_,beat)=>musicEvent(0,beat,true));assert.equal(chase.filter(e=>e.bass).length,4);assert.ok(chase.every(e=>e.interval===.35&&e.padRoot===null));
});
