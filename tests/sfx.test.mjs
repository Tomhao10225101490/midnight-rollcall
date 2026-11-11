import test from 'node:test';import assert from 'node:assert/strict';import{synthesize}from '../dist/sfx.js';
test('原创音效在两种采样率下有限、无削波、具有不同声学包络',()=>{
 for(const rate of [44100,48000])for(const kind of ['step','door','bell','radio']){
  const samples=synthesize(kind,rate);let peak=0,energy=0;
  for(const sample of samples){assert.ok(Number.isFinite(sample));peak=Math.max(peak,Math.abs(sample));energy+=sample*sample}
  assert.ok(peak>.05&&peak<.8,kind);assert.ok(energy/samples.length>1e-6,kind);assert.ok(Math.abs(samples.at(-1))<.001,kind+' fades out');
 }
 const step=synthesize('step',48000),door=synthesize('door',48000),bell=synthesize('bell',48000);
 assert.ok(step.length<door.length&&door.length<bell.length);
 assert.notDeepEqual(synthesize('step',48000,1),synthesize('step',48000,2));
});
