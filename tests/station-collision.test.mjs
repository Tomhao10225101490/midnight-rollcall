import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {stationBounds} from '../dist/station-collision.js';import {walls,clear} from '../dist/world.js';import {findPath} from '../dist/navigation.js';
test('交互设备阻挡玩家与敌人，正面保留互动距离，寻路能绕开每种设备',()=>{
 const count=walls.length;
 try{for(let index=0;index<5;index++){
  walls.length=count;const bounds=stationBounds(index,0,0);walls.push(bounds);
  assert.equal(clear(0,0),false);assert.equal(clear(0,0,true),false);assert.equal(clear(0,1.1),true);
  const path=findPath(new T.Vector3(0,1,-2),new T.Vector3(0,1,2));assert.ok(path.length>0);assert.ok(path.at(-1).distanceTo(new T.Vector3(0,1,2))<.01);
  let previous=new T.Vector3(0,1,-2);for(const point of path){for(let step=0;step<=20;step++){const p=previous.clone().lerp(point,step/20);assert.equal(clear(p.x,p.z,true),true)}previous=point}
 }}finally{walls.length=count}
});
