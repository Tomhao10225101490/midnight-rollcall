import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import{Player}from '../dist/player.js';
test('对角线不加速，潜行覆盖奔跑，碰墙不制造奔跑声',()=>{const camera=new T.PerspectiveCamera();const player=new Player(camera,()=>true);player.update(1,new Set(['KeyW','KeyD']),false);assert.ok(Math.abs(Math.hypot(camera.position.x,camera.position.z)-2.5)<1e-6);const quiet=player.update(.1,new Set(['KeyW','ShiftLeft','ControlLeft']),false);assert.equal(quiet.noise,false);const blocked=new Player(camera,()=>false);const r=blocked.update(.5,new Set(['KeyW','ShiftLeft']),false);assert.equal(r.moving,false);assert.equal(r.noise,false);const before=camera.position.clone();player.update(1,new Set(['KeyW']),true);assert.equal(camera.position.x,before.x);assert.equal(camera.position.z,before.z)});

test('走路和跑步的镜头抖动与步频对齐，跑步幅度更大',()=>{
 const walkCam=new T.PerspectiveCamera(),runCam=new T.PerspectiveCamera();
 const walk=new Player(walkCam,()=>true),run=new Player(runCam,()=>true);
 walkCam.position.set(0,1.65,0);runCam.position.set(0,1.65,0);
 let walkDip=0,runDip=0,walkSteps=0,runSteps=0,prevW=false,prevR=false;
 for(let i=0;i<120;i++){
  const w=walk.update(1/60,new Set(['KeyW']),false);
  const r=run.update(1/60,new Set(['KeyW','ShiftLeft']),false);
  if(w.footstep&&!prevW){walkSteps++;walkDip=Math.max(walkDip,1.65-walkCam.position.y)}
  if(r.footstep&&!prevR){runSteps++;runDip=Math.max(runDip,1.65-runCam.position.y)}
  prevW=w.footstep;prevR=r.footstep;
 }
 assert.ok(walkSteps>=2&&runSteps>walkSteps,'跑步步频应更快');
 assert.ok(walkDip>.02&&runDip>walkDip*1.4,'跑步晃动应明显大于走路');
 assert.ok(Math.abs(runCam.rotation.z)>Math.abs(walkCam.rotation.z)||Math.abs(runCam.rotation.z)>.005);
 const hiddenCam=new T.PerspectiveCamera();hiddenCam.position.set(7.5,1.59,-6.67);hiddenCam.rotation.z=.2;
 const hidden=new Player(hiddenCam,()=>true);
 const y=hiddenCam.position.y;
 hidden.update(.2,new Set(['KeyW']),true);
 assert.equal(hiddenCam.position.y,y);
 assert.equal(hiddenCam.rotation.z,0);
});
