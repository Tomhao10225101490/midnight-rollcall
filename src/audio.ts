import{type Effect,synthesize}from './sfx';
let ctx:AudioContext|undefined,master:GainNode,analyser:AnalyserNode,room:ConvolverNode;
const buffers=new Map<Effect,AudioBuffer>();let stepIndex=0;
export let volume=.3;
function context(){
 if(ctx)return ctx;
 const c=ctx=new AudioContext();master=c.createGain();master.gain.value=volume;
 const limiter=c.createDynamicsCompressor();limiter.threshold.value=-12;limiter.knee.value=10;limiter.ratio.value=6;
 analyser=c.createAnalyser();analyser.fftSize=1024;master.connect(limiter).connect(analyser).connect(c.destination);
 room=c.createConvolver();const impulse=c.createBuffer(2,Math.ceil(c.sampleRate*.85),c.sampleRate);let seed=618;
 for(let channel=0;channel<2;channel++){const samples=impulse.getChannelData(channel);for(let i=0;i<samples.length;i++){seed=(seed*1664525+1013904223)>>>0;samples[i]=(seed/4294967296*2-1)*Math.exp(-i/c.sampleRate*8)*.2}}
 room.buffer=impulse;const wet=c.createGain();wet.gain.value=.13;room.connect(wet).connect(master);return c;
}
export function setVolume(v:number){volume=Math.max(0,Math.min(1,v));if(ctx)master.gain.setValueAtTime(volume,ctx.currentTime);if(volume===0)stopSpeech()}
export function effect(kind:Effect,strength=1,pan=0,muffled=false){
 if(volume===0||strength<=0)return;const c=context();void c.resume();
 let buffer=buffers.get(kind);if(!buffer){const samples=synthesize(kind,c.sampleRate);buffer=c.createBuffer(1,samples.length,c.sampleRate);buffer.copyToChannel(samples,0);buffers.set(kind,buffer)}
 const source=c.createBufferSource(),gain=c.createGain(),panner=c.createStereoPanner(),filter=c.createBiquadFilter();source.buffer=buffer;
 if(kind==='step')source.playbackRate.value=++stepIndex%2?1.04:.97;
 gain.gain.value=Math.max(0,Math.min(1,strength));panner.pan.value=Math.max(-1,Math.min(1,pan));filter.type='lowpass';filter.frequency.value=muffled?650:10000;
 source.connect(filter).connect(gain).connect(panner);panner.connect(master);panner.connect(room);source.start();source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();panner.disconnect()};
}
export function tone(f=220,d=.15){if(volume===0)return;const c=context();void c.resume();const o=c.createOscillator(),g=c.createGain();o.frequency.value=f;g.gain.setValueAtTime(.15,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);o.connect(g).connect(master);o.start();o.stop(c.currentTime+d);o.onended=()=>{o.disconnect();g.disconnect()}}
export function broadcast(text:string){effect('radio');if('speechSynthesis'in window){speechSynthesis.cancel();const voice=speechSynthesis.getVoices().find(v=>v.lang.startsWith('zh')&&v.localService);if(voice&&volume>0){const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=.82;u.pitch=.75;u.volume=volume;u.voice=voice;speechSynthesis.speak(u)}}}
export function stopSpeech(){if('speechSynthesis'in window)speechSynthesis.cancel()}
export function pauseAudio(){if(ctx)void ctx.suspend();stopSpeech()}
export function resumeAudio(){if(ctx)void ctx.resume()}
export function measureEffects(){if(!ctx)return{state:'uninitialized',rms:0,peak:0};const samples=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(samples);let sum=0,peak=0;for(const value of samples){sum+=value*value;peak=Math.max(peak,Math.abs(value))}return{state:ctx.state,rms:Math.sqrt(sum/samples.length),peak}}
