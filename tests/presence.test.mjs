import test from 'node:test';import assert from 'node:assert/strict';
import{heartbeatInterval,heartbeatGain,HEART_NEAR,HEART_FAR}from '../dist/presence.js';
test('心跳间隔随距离缩短，近处增益更大',()=>{
 const far=heartbeatInterval(HEART_FAR),mid=heartbeatInterval((HEART_NEAR+HEART_FAR)/2),near=heartbeatInterval(HEART_NEAR);
 assert.ok(far>mid&&mid>near);
 assert.ok(Math.abs(far-1)<.02);
 assert.ok(near>.3&&near<.45);
 assert.equal(heartbeatGain(HEART_FAR+1,false),0);
 assert.ok(heartbeatGain(HEART_NEAR,false)>heartbeatGain(8,false));
 assert.ok(heartbeatGain(8,true)>heartbeatGain(8,false));
});
