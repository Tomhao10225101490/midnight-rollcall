import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {Ending} from '../dist/ending.js';import {scene} from '../dist/world.js';
test('逃生镜头到达庭院后重开恢复门与晨光，不重复创建庭院或阴影灯',()=>{
 const ending=new Ending(),camera=new T.PerspectiveCamera();camera.position.set(8,1.65,18);
 const gate=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial());gate.position.set(8,1,21.4);scene.add(gate);
 const count=scene.children.length;const light=scene.children.find(o=>o.isDirectionalLight);
 for(let cycle=0;cycle<4;cycle++) {
  camera.position.set(8,1.65,18);ending.begin(camera);assert.equal(gate.visible,false);assert.equal(light.shadow.autoUpdate,true);
  for(let i=0;i<121;i++)ending.update(.05,camera);
  assert.deepEqual(camera.position.toArray(),[8,1.7,29]);assert.equal(ending.active,false);
  ending.reset();assert.equal(gate.visible,true);assert.equal(light.shadow.autoUpdate,false);assert.equal(light.intensity,0);assert.equal(scene.children.length,count);
 }
});
