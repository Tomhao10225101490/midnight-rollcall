import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>({fillRect(){},fillText(){},strokeRect(){}})})};
const {init,clear,visible}=await import('../dist/world.js');const {Enemy}=await import('../dist/enemy.js');init();const {decorate}=await import('../dist/decor.js');decorate();const{props}=await import('../dist/props.js');props();const{architecturalDetails}=await import('../dist/architecture.js');const{scene,walls}=await import('../dist/world.js');architecturalDetails(scene,walls);
test('外墙碰撞与墙体遮挡',()=>{assert.equal(clear(12,0),false);assert.equal(clear(0,-19),true);assert.equal(visible(new T.Vector3(0,1,-19),new T.Vector3(-8,1,-19)),false)});
test('所有任务站点均能通过门口抵达',()=>{const e=new Enemy();e.body.position.set(0,1,-19);for(const [x,z]of [[-8,-19],[-8,-8],[-8,3],[-8,13],[8,18],[8,-7]]){e.route(new T.Vector3(x,1,z));assert.ok(e.path.length>0,`${x},${z} 无可达路径`);for(const p of e.path)assert.ok(clear(p.x,p.z));e.body.position.set(x,1,z)}});
test('墙后目标不能触发视觉追逐',()=>{const e=new Enemy();e.body.position.set(0,1,-19);e.update(.1,new T.Vector3(-8,1,-19),false,false,0,false);assert.equal(e.state,'巡逻')});
test('声音触发追逐、丢失后搜索、最终巡逻',()=>{const e=new Enemy();e.body.position.set(0,1,0);e.update(.1,new T.Vector3(-8,1,0),true,false,0,false);assert.equal(e.state,'追逐');e.update(.1,new T.Vector3(10,1,-20),false,true,0,false);assert.equal(e.state,'搜索');e.update(10,new T.Vector3(10,1,-20),false,true,0,false);assert.equal(e.state,'巡逻')});
test('目击藏入后会搜查，未目击的躲藏不会隔墙暴露',()=>{const e=new Enemy();e.body.position.set(0,1,0);e.body.rotation.y=0;e.update(.01,new T.Vector3(0,1,2),false,false,0,false);e.update(.01,new T.Vector3(0,1,2),false,true,0,false);assert.equal(e.sawHide,true);assert.equal(e.state,'追逐');const other=new Enemy();other.body.position.set(0,1,-19);other.update(.01,new T.Vector3(-8,1,-19),false,true,0,false);assert.equal(other.sawHide,false);assert.equal(other.state,'巡逻')});
test('铃声安全窗口会打断追逐并停步，结束后正常恢复',()=>{const e=new Enemy();e.body.position.set(0,1,0);e.update(.1,new T.Vector3(0,1,3),true,false,50,false);assert.equal(e.state,'追逐');const p=e.body.position.clone();e.update(1,new T.Vector3(0,1,3),true,false,50,true);assert.equal(e.state,'听铃');assert.ok(e.body.position.equals(p));e.update(.1,new T.Vector3(0,1,3),true,false,50,false);assert.equal(e.state,'追逐')});

test('合法的外墙边缘目标可追到，不因网格取整永久停住',()=>{const e=new Enemy();e.body.position.set(8,1,-12);const p=new T.Vector3(11.5,1,-12);assert.ok(clear(p.x,p.z));e.route(p);assert.ok(e.path.length>0);assert.ok(e.path.at(-1).distanceTo(p)<.1);let caught=false;for(let i=0;i<300&&!caught;i++)caught=e.update(.016,p,true,false,0,false);assert.ok(caught,'可见且可达的边缘目标必须能接近捕获');assert.ok(clear(e.body.position.x,e.body.position.z))});
test('铃声期间藏入不会在铃声结束后被追溯误判为刚藏入',()=>{const e=new Enemy();e.body.position.set(0,1,0);const p=new T.Vector3(0,1,2);e.update(.01,p,false,true,0,true);e.update(.01,p,false,true,0,false);assert.equal(e.sawHide,false);assert.equal(e.state,'巡逻')});
test('丢失目标后查最后位置周边，不追踪隐藏玩家的新位置',()=>{
 const left=new Enemy(),right=new Enemy(),evidence=new T.Vector3(0,1,-3);for(const e of [left,right]){e.body.position.set(0,1,-5);e.update(.016,evidence,true,false,0,false)}
 let furthest=-Infinity,sideways=0;
 for(let i=0;i<500;i++){
  left.update(.016,new T.Vector3(10,1,20),false,true,0,false);right.update(.016,new T.Vector3(-10,1,20),false,true,0,false);
  assert.ok(left.body.position.distanceTo(right.body.position)<1e-8,'不同隐藏位置不能改变搜索路线');assert.ok(clear(left.body.position.x,left.body.position.z));assert.ok(left.last.equals(evidence));
  furthest=Math.max(furthest,left.body.position.z);sideways=Math.max(sideways,Math.abs(left.body.position.x));
 }
 assert.ok(furthest>evidence.z+1.5,'到达证据位置后继续检查周边');assert.ok(sideways>.5,'检查不止同一直线');
 left.update(2,new T.Vector3(10,1,20),false,true,0,false);assert.equal(left.state,'巡逻');
});
test('搜索路程消耗记忆后，抵达证据仍留出有限的周边搜查时间',()=>{
 const e=new Enemy();e.body.position.set(0,1,-5);e.update(.016,new T.Vector3(0,1,5),true,false,0,false);
 const hidden=new T.Vector3(10,1,20);for(let i=0;i<625;i++)e.update(.016,hidden,false,true,0,false);
 assert.equal(e.state,'搜索','长路程后仍有检查附近的时间');assert.ok(e.memory<=6,'检查时间有上限');
 for(let i=0;i<400;i++)e.update(.016,hidden,false,true,0,false);assert.equal(e.state,'巡逻','不能无限延长记忆');
});
