import test from 'node:test';import assert from 'node:assert/strict';
import {station} from '../dist/stations.js';
test('设备状态随检查点恢复和重开还原，出口同时遵守授权与铃声；稳定状态不重复上传纹理',()=>{
 const old=globalThis.document;
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>({fillRect(){},strokeRect(){},fillText(){}})})};
 try{
  const radio=station(2,0,0),power=station(3,0,0),gate=station(4,0,0);
  const maps=[];for(const s of [radio,power,gate])s.group.traverse(o=>{if(o.material?.emissiveMap)maps.push(o.material.emissiveMap)});
  for(let n=0;n<4;n++){
   for(const s of [radio,power,gate])s.update(4,false);
   assert.deepEqual(radio.snapshot().displays,['空白名单已接收']);assert.deepEqual(power.snapshot().powered,[true,false,true,false]);assert.deepEqual(gate.snapshot().displays,['请等铃声']);
   gate.update(4,true);assert.deepEqual(gate.snapshot().displays,['铃响可通行']);
   const versions=maps.map(t=>t.version);for(let i=0;i<100;i++){radio.update(4,false);power.update(4,false);gate.update(4,true)}assert.deepEqual(maps.map(t=>t.version),versions);
   for(const s of [radio,power,gate])s.update(0,true);
   assert.deepEqual(radio.snapshot().displays,['频率待校准']);assert.deepEqual(power.snapshot().powered,[false,false,false,false]);assert.deepEqual(gate.snapshot().displays,['尚未授权']);
  }
 }finally{globalThis.document=old}
});
