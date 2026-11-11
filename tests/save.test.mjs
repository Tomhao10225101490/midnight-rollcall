import test from 'node:test';import assert from 'node:assert/strict';let value=null;globalThis.localStorage={getItem:()=>value,setItem:(_,v)=>value=v};const {read,save}=await import('../dist/save.js');
test('损坏/未知版本存档安全恢复，旧版迁移，新版线索往返',()=>{
 for(const bad of ['oops','null','{}','{"v":1,"stage":99}','{"v":2,"stage":1}','{"v":3,"stage":1,"notes":[]}','{"v":1,"stage":1.5}','{"v":2,"stage":1,"notes":["bad"]}','{"v":2,"stage":1,"notes":["seating","seating"]}']){value=bad;assert.equal(read(),null)}
 value='{"v":1,"stage":2}';assert.deepEqual(read(),{v:2,stage:2,notes:[]});
 for(let i=0;i<=4;i++){save(i,['seating','channels']);assert.deepEqual(read(),{v:2,stage:i,notes:['seating','channels']})}
});
