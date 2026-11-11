import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import{Door,doors,openForEnemy}from '../dist/doors.js';import{clear,visible}from '../dist/world.js';
test('门开关同步碰撞与遮挡，敌人能开门且寻路可计划通过',()=>{const d=new Door(4,5);doors.push(d);assert.equal(clear(4,5),false);assert.equal(clear(4,5,true),true);assert.equal(visible(new T.Vector3(2,1,5),new T.Vector3(6,1,5)),false);d.set(true);assert.equal(clear(4,5),true);assert.equal(visible(new T.Vector3(2,1,5),new T.Vector3(6,1,5)),true);d.set(false);openForEnemy(new T.Vector3(3,1,5));assert.equal(d.open,true)});

test('打开的门扇仍有碰撞与遮挡，门洞中央可通行；关门不得夹住角色',()=>{
 const d=new Door(-4,-5);assert.equal(d.set(true),true);assert.equal(clear(-4,-5),true);assert.equal(clear(-4.7,-3.6),false);assert.equal(clear(-4.7,-3.6,true),false,'寻路也不能忽略已打开的实体门扇');assert.equal(visible(new T.Vector3(-4.7,1,-4.5),new T.Vector3(-4.7,1,-2.5)),false);
 assert.equal(d.set(false,[new T.Vector3(-4,1,-5)]),false);assert.equal(d.open,true);assert.equal(d.set(false,[]),true);assert.ok(d.leafBounds.every(b=>b.isEmpty()));assert.equal(d.set(true,[new T.Vector3(-4.7,1,-3.6)]),false);assert.equal(d.open,false);
});
