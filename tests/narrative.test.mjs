import test from 'node:test';import assert from 'node:assert/strict';import{Narrative}from '../dist/narrative.js';
test('叙事按地点/进度触发一次，受冷却/危险抑制，可回看，重开复位',()=>{
 const n=new Narrative();n.reset('开场');assert.equal(n.subtitle,'开场');assert.equal(n.update(0,0,-8,-18,false),null);assert.equal(n.subtitle,'开场');
 assert.equal(n.update(25,0,0,-18,false),null);assert.equal(n.update(0,0,-8,-18,true),null);assert.equal(n.update(0,0,-8,-18,false).id,'empty-class');assert.equal(n.records.length,1);assert.equal(n.records[0].title,'途中记录 1');
 assert.equal(n.update(40,0,-8,-18,false),null);assert.equal(n.update(0,1,8,-18,false).id,'name');assert.equal(n.update(1,2,0,0,false),null);n.defer(50);assert.equal(n.update(40,2,0,0,false),null);assert.equal(n.update(11,2,0,0,false).id,'office');
 assert.equal(n.records.length,3);n.clearSubtitle();assert.equal(n.subtitle,'');assert.equal(n.records.length,3);n.reset('继续');assert.equal(n.records.length,0);assert.equal(n.subtitle,'继续');assert.equal(n.update(26,4,8,18,false).id,'dawn');
});
