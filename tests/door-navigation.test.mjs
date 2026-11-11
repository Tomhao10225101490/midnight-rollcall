import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>({fillRect(){},fillText(){},strokeRect(){}})})};
const{init,clear}=await import('../dist/world.js'),{Enemy}=await import('../dist/enemy.js'),{initDoors,doors,resetDoors,setDoorOccupants}=await import('../dist/doors.js');init();initDoors();
test('敌人能开八处门并绕过展开门扇，过程中不穿墙或卡住',()=>{
 for(const d of doors){resetDoors();const e=new Enemy(),target=new T.Vector3(Math.sign(d.x)*8,1,d.z+2);e.body.position.set(0,1,d.z);setDoorOccupants(()=>[e.body.position,target]);let caught=false;
 for(let i=0;i<900&&!caught;i++){caught=e.update(.016,target,true,false,0,false);assert.ok(clear(e.body.position.x,e.body.position.z),'移动后不能在实体门扇或墙内')}
 assert.equal(d.open,true);assert.ok(caught,`门 ${d.x},${d.z} 必须能通行`);
 }setDoorOccupants(()=>[]);resetDoors();
});
