import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import{batchStaticBoxes}from '../dist/batching.js';
test('静态实例化保留矩阵和材质差异，不吞掉活动出口与层级门',()=>{
 const scene=new T.Scene(),make=(color='#456789')=>new T.Mesh(new T.BoxGeometry(1,2,.2),new T.MeshStandardMaterial({color}));const matrices=[];
 for(let i=0;i<3;i++){const mesh=make();mesh.position.set(i*3,1,i);mesh.rotation.y=i*.3;mesh.updateMatrix();matrices.push(mesh.matrix.clone());scene.add(mesh)}
 const gate=make();gate.userData.dynamic=true;scene.add(gate);const other=make('#ffffff');scene.add(other);const door=new T.Group();door.add(make());scene.add(door);
 assert.equal(batchStaticBoxes(scene),2);assert.ok(scene.children.includes(gate)&&scene.children.includes(other)&&scene.children.includes(door));
 const batch=scene.children.find(o=>o.isInstancedMesh);assert.equal(batch.count,3);for(let i=0;i<3;i++){const actual=new T.Matrix4();batch.getMatrixAt(i,actual);actual.elements.forEach((n,j)=>assert.ok(Math.abs(n-matrices[i].elements[j])<1e-6))}
 assert.ok(batch.boundingBox.containsPoint(new T.Vector3(6,1,2)));
});
