import test from 'node:test';import assert from 'node:assert/strict';import{pluckedString}from '../dist/strings.js';
test('拨弦波导在不同采样率下保持音高、衰减和安全幅度',()=>{
 for(const rate of [44100,48000])for(const f of [110,220,392]){const samples=pluckedString(f,2,rate);let peak=0,first=0,last=0;
  for(let i=0;i<samples.length;i++){assert.ok(Number.isFinite(samples[i]));peak=Math.max(peak,Math.abs(samples[i]));if(i<rate*.2)first+=samples[i]**2;if(i>samples.length-rate*.2)last+=samples[i]**2}
  assert.ok(peak<=.221&&peak>.2);assert.ok(last<first*.1);assert.equal(Math.abs(samples.at(-1)),0);
  // Autocorrelation around the expected fundamental, using the sustained portion.
  let best=-Infinity,period=0;for(let lag=Math.floor(rate/f*.9);lag<=Math.ceil(rate/f*1.1);lag++){let correlation=0;for(let i=Math.floor(rate*.1);i<rate*.2;i++)correlation+=samples[i]*samples[i+lag];if(correlation>best){best=correlation;period=lag}}
  assert.ok(Math.abs(rate/period-f)/f<.025,`${rate} Hz sample rate, ${f} Hz pitch measured ${rate/period}`);
 }
 assert.throws(()=>pluckedString(NaN,2,48000));assert.throws(()=>pluckedString(220,Infinity,48000));
});
