import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import{HidingSpot}from '../dist/hiding.js';import{Player}from '../dist/player.js';
test('藏身只能从柜前进入，保留目击位置，限制窥视并原地退出',()=>{
 const spot=new HidingSpot(),camera=new T.PerspectiveCamera();camera.rotation.order='YXZ';camera.position.set(8,1.65,-8);assert.equal(spot.enter(camera),false);
 camera.position.set(8,1.65,-5.9);camera.rotation.set(.1,.5,0);const entry=camera.position.clone();assert.equal(spot.enter(camera),true);assert.ok(spot.bounds.containsPoint(camera.position));assert.ok(spot.target(camera).equals(entry));
 camera.rotation.set(2,20,0);spot.constrain(camera);assert.ok(camera.rotation.x<=.14&&camera.rotation.y<=Math.PI+.4);
 new Player(camera,()=>true).update(1,new Set(['KeyW']),true);assert.ok(camera.position.equals(spot.viewpoint));
 spot.leave(camera);assert.ok(camera.position.equals(entry));assert.equal(camera.rotation.y,.5);assert.equal(spot.active,false);
});
test('柜体碰撞不能阻断已目击搜查，未目击不会因柜内视角暴露',async()=>{
 const{walls}=await import('../dist/world.js'),{Enemy}=await import('../dist/enemy.js');const spot=new HidingSpot(),camera=new T.PerspectiveCamera();walls.push(spot.bounds);
 try{camera.position.copy(spot.entrance);const enemy=new Enemy();enemy.body.position.set(8,1,-4.4);enemy.body.rotation.y=Math.PI;enemy.update(.016,camera.position,false,false,0,false);assert.equal(enemy.state,'追逐');assert.ok(spot.enter(camera));
 let caught=false;for(let i=0;i<200&&!caught;i++)caught=enemy.update(.016,spot.target(camera),false,true,0,false);assert.equal(enemy.sawHide,true);assert.ok(caught,'搜查应抵达柜前捕获，而非被实体柜阻挡');
 const unseen=new Enemy();unseen.body.position.set(0,1,15);unseen.update(.016,spot.target(camera),false,true,0,false);assert.equal(unseen.sawHide,false);
 }finally{walls.splice(walls.indexOf(spot.bounds),1)}
});
