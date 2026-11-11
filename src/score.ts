import {pluckedString} from './strings';
// Original score: modal plucked strings, low bowed partials, ventilation and pursuit pulse.
// All waveforms and room impulse are synthesized locally; no samples or remote services.
export class Score {
 private strings=new Map<string,AudioBuffer>();
 private analyser:AnalyserNode|null=null;private ctx:AudioContext|null=null;private master:GainNode|null=null;private dry:GainNode|null=null;private wet:ConvolverNode|null=null;private ducking=false;private beat=0;private clock=0;private mode=false;
 start(){if(this.ctx){void this.ctx.resume();return}const c=this.ctx=new AudioContext();const master=this.master=c.createGain();master.gain.value=0;const limiter=c.createDynamicsCompressor();limiter.threshold.value=-18;limiter.knee.value=12;limiter.ratio.value=4;this.analyser=c.createAnalyser();this.analyser.fftSize=2048;master.connect(limiter).connect(this.analyser).connect(c.destination);this.dry=c.createGain();this.dry.gain.value=.7;this.dry.connect(master);const wetGain=c.createGain();wetGain.gain.value=.23;this.wet=c.createConvolver();const impulse=c.createBuffer(2,c.sampleRate*2.6,c.sampleRate);let seed=731;for(let channel=0;channel<2;channel++){const data=impulse.getChannelData(channel);for(let i=0;i<data.length;i++){seed=(seed*1664525+1013904223)>>>0;data[i]=((seed/4294967296)*2-1)*Math.exp(-i/(c.sampleRate*.48))*.3}}this.wet.buffer=impulse;this.wet.connect(wetGain).connect(master);
 for(const [f,amount]of [[55,.025],[82.41,.018],[110.2,.009]]){const o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.value=f;g.gain.value=amount;o.connect(g).connect(this.dry);o.start()}
 const buffer=c.createBuffer(1,c.sampleRate*2,c.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++){seed=(seed*1664525+1013904223)>>>0;data[i]=(seed/4294967296*2-1)*.025}const air=c.createBufferSource(),filter=c.createBiquadFilter();air.buffer=buffer;air.loop=true;filter.type='lowpass';filter.frequency.value=280;air.connect(filter).connect(this.dry);air.start();
 }
 measure(){if(!this.ctx||!this.analyser)return{state:'uninitialized',rms:0,peak:0};const data=new Float32Array(this.analyser.fftSize);this.analyser.getFloatTimeDomainData(data);let sum=0,peak=0;for(const x of data){sum+=x*x;peak=Math.max(peak,Math.abs(x))}return{state:this.ctx.state,ducking:this.ducking,gain:this.master?.gain.value??0,rms:Math.sqrt(sum/data.length),peak}}
 pause(){if(this.ctx)void this.ctx.suspend()}
 private note(f:number,length:number,pan:number,chase:boolean){if(!this.ctx||!this.dry||!this.wet)return;const c=this.ctx,key=`${f.toFixed(3)}/${length}`;
 let buffer=this.strings.get(key);if(!buffer){const samples=pluckedString(f,length,c.sampleRate);buffer=c.createBuffer(1,samples.length,c.sampleRate);buffer.copyToChannel(samples,0);this.strings.set(key,buffer)}
 const source=c.createBufferSource(),gain=c.createGain(),panner=c.createStereoPanner();source.buffer=buffer;gain.gain.value=chase?.5:.72;panner.pan.value=pan;source.connect(gain).connect(panner);panner.connect(this.dry);panner.connect(this.wet);source.start();source.onended=()=>{source.disconnect();gain.disconnect();panner.disconnect()};
 }
 private pad(root:number,length:number){if(!this.ctx||!this.dry||!this.wet)return;const c=this.ctx;
 for(const [ratio,pan,detune]of [[4,-.65,-4],[4,.65,4],[6,0,1]]){const o=c.createOscillator(),g=c.createGain(),filter=c.createBiquadFilter(),p=c.createStereoPanner(),vibrato=c.createOscillator(),depth=c.createGain();
  o.type='triangle';o.frequency.value=root*ratio;o.detune.value=detune;filter.type='lowpass';filter.frequency.value=520;filter.Q.value=.4;p.pan.value=pan;
  vibrato.frequency.value=4.1+pan*.2;depth.gain.value=3;vibrato.connect(depth).connect(o.detune);
  const end=c.currentTime+length;g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.016,c.currentTime+1.4);g.gain.setValueAtTime(.016,end-2);g.gain.exponentialRampToValueAtTime(.0001,end);
  o.connect(filter).connect(g).connect(p);p.connect(this.dry);p.connect(this.wet);o.start();vibrato.start();o.stop(end);vibrato.stop(end);o.onended=()=>{o.disconnect();filter.disconnect();g.disconnect();p.disconnect();vibrato.disconnect();depth.disconnect()};
 }
 }
 update(dt:number,chase:boolean,volume:number,stage=0,dialogue=false){if(!this.ctx||!this.master)return;this.ducking=dialogue;if(volume===0){this.master.gain.cancelScheduledValues(this.ctx.currentTime);this.master.gain.setValueAtTime(0,this.ctx.currentTime)}else this.master.gain.setTargetAtTime(volume*.55*(dialogue?.24:1),this.ctx.currentTime,dialogue?.1:.75);if(chase!==this.mode){this.mode=chase;this.clock=Math.min(this.clock,.2)}this.clock-=dt;if(this.clock>0)return;this.clock=chase?.35:1.65;
 const motif=[220,0,293.66,329.63,0,440,392,0,293.66,0,196,220,0,146.83,0,0,220,293.66,0,392,0,329.63,293.66,0,196,0,146.83,0,110,0,0,0];const chaseLine=[146.83,0,155.56,220,146.83,0,293.66,155.56];const i=this.beat++,f=(chase?chaseLine:motif)[i%(chase?chaseLine.length:motif.length)];const roots=[55,49,65.406,55],root=roots[(Math.floor(i/16)+stage)%roots.length];if(!chase&&i%8===0)this.pad(root,9);if(f&&(chase||i%16<12))this.note(f*(chase?1:root/55),chase?.5:3.3,Math.sin(i*.63)*.45,chase);if(chase&&i%2===0)this.note(55,.19,0,true);
 }
}
