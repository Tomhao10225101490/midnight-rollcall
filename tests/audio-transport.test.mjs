import test from 'node:test';import assert from 'node:assert/strict';import {AudioTransport} from '../dist/audio-transport.js';
test('慢速resume未结束时串行执行暂停，后来的指令决定最终状态',async()=>{
 let resolveResume;const calls=[];const context={state:'suspended',resume(){calls.push('resume');return new Promise(resolve=>{resolveResume=()=>{context.state='running';resolve()}})},async suspend(){calls.push('suspend');context.state='suspended'}};
 const transport=new AudioTransport(context);transport.setRunning(true);await Promise.resolve();const paused=transport.setRunning(false);assert.deepEqual(calls,['resume']);resolveResume();await paused;assert.deepEqual(calls,['resume','suspend']);assert.equal(context.state,'suspended');
 const first=transport.setRunning(true);const last=transport.setRunning(false);await Promise.all([first,last]);assert.equal(context.state,'suspended');assert.equal(calls.filter(x=>x==='resume').length,1,'superseded resume is never submitted');
});
test('慢速suspend期间点击恢复，完成暂停后才恢复；设备拒绝后可再次操作',async()=>{
 let resolveSuspend;const calls=[];const context={state:'running',async resume(){calls.push('resume');context.state='running'},suspend(){calls.push('suspend');return new Promise(resolve=>{resolveSuspend=()=>{context.state='suspended';resolve()}})}};
 const transport=new AudioTransport(context);transport.setRunning(false);await Promise.resolve();const resumed=transport.setRunning(true);assert.deepEqual(calls,['suspend']);resolveSuspend();await resumed;assert.equal(context.state,'running');assert.deepEqual(calls,['suspend','resume']);
 context.suspend=async()=>{throw Error('device unavailable')};await transport.setRunning(false);await transport.setRunning(true);assert.equal(context.state,'running');
});
