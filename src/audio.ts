import {AudioTransport} from './audio-transport';
import{type Effect,synthesize}from './sfx';
import{connectPresence,silencePresence,updatePresence,type PresenceState}from './presence';
export{updatePresence,type PresenceState};
import{matchVoice,voiceLines,type VoiceId}from './voice-lines';
let transport:AudioTransport|undefined;
let ctx:AudioContext|undefined,master:GainNode,analyser:AnalyserNode,room:ConvolverNode;
const buffers=new Map<Effect,AudioBuffer>();let stepIndex=0;
export let volume=.3;
function context(){
 if(ctx)return ctx;
 const c=ctx=new AudioContext();transport=new AudioTransport(c);master=c.createGain();master.gain.value=volume;
 const limiter=c.createDynamicsCompressor();limiter.threshold.value=-12;limiter.knee.value=10;limiter.ratio.value=6;
 analyser=c.createAnalyser();analyser.fftSize=1024;master.connect(limiter).connect(analyser).connect(c.destination);
 room=c.createConvolver();const impulse=c.createBuffer(2,Math.ceil(c.sampleRate*.85),c.sampleRate);let seed=618;
 for(let channel=0;channel<2;channel++){const samples=impulse.getChannelData(channel);for(let i=0;i<samples.length;i++){seed=(seed*1664525+1013904223)>>>0;samples[i]=(seed/4294967296*2-1)*Math.exp(-i/c.sampleRate*8)*.2}}
 room.buffer=impulse;const wet=c.createGain();wet.gain.value=.13;room.connect(wet).connect(master);connectPresence(c,master);return c;
}
export function setVolume(v:number){volume=Math.max(0,Math.min(1,v));if(ctx)master.gain.setValueAtTime(volume,ctx.currentTime);if(volume===0)stopSpeech();else if(activeClip)activeClip.volume=clipVolume(activeStyle)}
const foleyFiles:Record<Effect,string[]>={
 step:['footstep_concrete_000.ogg','footstep_concrete_001.ogg','footstep_concrete_002.ogg','footstep_concrete_003.ogg','footstep_concrete_004.ogg'],
 door:['doorClose_1.ogg','doorClose_2.ogg','doorOpen_1.ogg','doorOpen_2.ogg'],
 knock:['impactWood_medium_000.ogg','impactWood_medium_001.ogg','impactWood_medium_002.ogg'],
 bell:['impactBell_heavy_000.ogg','impactBell_heavy_001.ogg'],
 radio:[]
};
const foleyExtras=['metalLatch.ogg','creak1.ogg'];
const foley=new Map<string,AudioBuffer>();
let foleyLoading:Promise<void>|null=null;
function loadFoley(){
 if(foleyLoading)return foleyLoading;
 const c=context();
 foleyLoading=Promise.all([...Object.values(foleyFiles).flat(),...foleyExtras].map(async file=>{
  const response=await fetch(new URL('./audio/sfx/'+file,import.meta.url));
  if(!response.ok)throw Error('Missing foley '+file);
  foley.set(file,await c.decodeAudioData(await response.arrayBuffer()));
 })).then(()=>undefined,()=>{foleyLoading=null});
 return foleyLoading;
}
function playBuffer(buffer:AudioBuffer,strength:number,pan:number,muffled:boolean,when=0,rate=1){
 const c=context(),source=c.createBufferSource(),gain=c.createGain(),panner=c.createStereoPanner(),filter=c.createBiquadFilter();
 source.buffer=buffer;source.playbackRate.value=rate;
 gain.gain.value=Math.max(0,Math.min(1,strength));panner.pan.value=Math.max(-1,Math.min(1,pan));
 filter.type='lowpass';filter.frequency.value=muffled?650:10000;
 source.connect(filter).connect(gain).connect(panner);panner.connect(master);panner.connect(room);
 source.start(c.currentTime+Math.max(0,when));
 source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();panner.disconnect()};
}
function playFoley(kind:Effect,strength:number,pan:number,muffled:boolean){
 const files=foleyFiles[kind];if(!files.length||!files.every(file=>foley.has(file)))return false;
 if(kind==='step'){
  const file=files[(stepIndex++)%files.length];
  playBuffer(foley.get(file)!,strength,pan,muffled,0,stepIndex%2?1.03:.97);
  return true;
 }
 if(kind==='door'){
  const file=files[(stepIndex++)%files.length];
  playBuffer(foley.get(file)!,strength,pan,muffled);
  const latch=foley.get('metalLatch.ogg'),creak=foley.get('creak1.ogg');
  if(latch)playBuffer(latch,strength*.55,pan,muffled,.08);
  if(creak)playBuffer(creak,strength*.28,pan,true,.02,.92);
  return true;
 }
 if(kind==='knock'){
  [0,.48,1.1].forEach((delay,i)=>playBuffer(foley.get(files[i%files.length])!,strength,pan,muffled,delay));
  return true;
 }
 if(kind==='bell'){
  playBuffer(foley.get(files[0])!,strength,pan,muffled,0);
  if(files[1]&&foley.has(files[1]))playBuffer(foley.get(files[1])!,strength*.85,pan,muffled,.62);
  return true;
 }
 return false;
}
export function effect(kind:Effect,strength=1,pan=0,muffled=false){
 if(volume===0||strength<=0)return;const c=context();void transport!.setRunning(true);
 void loadFoley();
 if(playFoley(kind,strength,pan,muffled))return;
 let buffer=buffers.get(kind);if(!buffer){const samples=synthesize(kind,c.sampleRate);buffer=c.createBuffer(1,samples.length,c.sampleRate);buffer.copyToChannel(samples,0);buffers.set(kind,buffer)}
 const source=c.createBufferSource(),gain=c.createGain(),panner=c.createStereoPanner(),filter=c.createBiquadFilter();source.buffer=buffer;
 if(kind==='step')source.playbackRate.value=++stepIndex%2?1.04:.97;
 gain.gain.value=Math.max(0,Math.min(1,strength));panner.pan.value=Math.max(-1,Math.min(1,pan));filter.type='lowpass';filter.frequency.value=muffled?650:10000;
 source.connect(filter).connect(gain).connect(panner);panner.connect(master);panner.connect(room);source.start();source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();panner.disconnect()};
}
export function tone(f=220,d=.15){if(volume===0)return;const c=context();void transport!.setRunning(true);const o=c.createOscillator(),g=c.createGain();o.frequency.value=f;g.gain.setValueAtTime(.15,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);o.connect(g).connect(master);o.start();o.stop(c.currentTime+d);o.onended=()=>{o.disconnect();g.disconnect()}}

const clips=new Map<VoiceId,HTMLAudioElement>();
for(const id of Object.keys(voiceLines) as VoiceId[]){
 const clip=new Audio(new URL('./audio/voice/'+voiceLines[id].file,import.meta.url).href);
 clip.preload='auto';
 clips.set(id,clip);
}
let activeClip:HTMLAudioElement|null=null;
let activeStyle:'pa'|'proctor'|'whisper'='pa';
let pendingSpeech:{text:string;expires:number}|null=null;
let localUtterance:SpeechSynthesisUtterance|null=null;
function clipVolume(style:'pa'|'proctor'|'whisper'){
 if(style==='whisper')return volume*.62;
 if(style==='proctor')return volume*.9;
 return volume*.86;
}
function clipReady(clip:HTMLAudioElement){
 return clip.readyState>=2||(Number.isFinite(clip.duration)&&clip.duration>0);
}
function playClip(id:VoiceId){
 const clip=clips.get(id);if(!clip||volume===0)return true;
 if(!clipReady(clip))return false;
 stopSpeech();
 activeStyle=voiceLines[id].style;
 activeClip=clip;
 clip.currentTime=0;
 clip.volume=clipVolume(activeStyle);
 const play=clip.play();
 if(play)void play.catch(()=>{if(activeClip===clip)activeClip=null});
 clip.onended=()=>{if(activeClip===clip)activeClip=null};
 clip.onerror=()=>{if(activeClip===clip)activeClip=null};
 return true;
}
function speakLocal(text:string){
 if(!('speechSynthesis' in window)||volume===0)return true;
 const voices=speechSynthesis.getVoices().filter(v=>v.localService&&v.lang.startsWith('zh'));
 const voice=voices.find(v=>/flo|tingting|ting-ting|meijia|sinji/i.test(v.name))||voices[0];
 if(!voice)return false;
 const u=localUtterance=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=1;u.pitch=1;u.volume=Math.max(.2,volume);u.voice=voice;
 const clear=()=>{if(localUtterance===u)localUtterance=null};u.onend=clear;u.onerror=clear;speechSynthesis.speak(u);return true;
}
export function isSpeaking(){
 if(volume===0)return false;
 if(activeClip&&!activeClip.paused&&!activeClip.ended)return true;
 return !!localUtterance&&'speechSynthesis'in window&&speechSynthesis.speaking;
}
export function broadcast(text:string){
 const id=matchVoice(text);
 if(id&&voiceLines[id].style==='pa')effect('radio');
 else if(!id)effect('radio');
 if(id&&playClip(id)){pendingSpeech=null;return}
 if(id){pendingSpeech={text,expires:performance.now()+4000};return}
 stopSpeech();
 if(!speakLocal(text))pendingSpeech={text,expires:performance.now()+3000};
}
export function stopSpeech(){
 pendingSpeech=null;localUtterance=null;
 if(activeClip){activeClip.onended=null;activeClip.pause();activeClip.currentTime=0;activeClip=null}
 if('speechSynthesis'in window)speechSynthesis.cancel();
}
if('speechSynthesis' in window){
 speechSynthesis.getVoices();speechSynthesis.addEventListener('voiceschanged',()=>{
  const pending=pendingSpeech;if(!pending)return;
  if(performance.now()>pending.expires){pendingSpeech=null;return}
  const id=matchVoice(pending.text);
  if(id&&playClip(id)){pendingSpeech=null;return}
  if(!id&&speakLocal(pending.text))pendingSpeech=null;
 });
}
const retryPending=()=>{
 const pending=pendingSpeech;if(!pending)return;
 if(performance.now()>pending.expires){pendingSpeech=null;return}
 const id=matchVoice(pending.text);
 if(id&&playClip(id))pendingSpeech=null;
};
for(const clip of clips.values()){
 clip.addEventListener('canplaythrough',retryPending);
 clip.addEventListener('loadeddata',retryPending);
}
export function pauseAudio(){void transport?.setRunning(false);stopSpeech();silencePresence()}
export function resumeAudio(){void transport?.setRunning(true)}
export function measureEffects(){if(!ctx)return{state:'uninitialized',rms:0,peak:0};const samples=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(samples);let sum=0,peak=0;for(const value of samples){sum+=value*value;peak=Math.max(peak,Math.abs(value))}return{state:ctx.state,rms:Math.sqrt(sum/samples.length),peak}}
