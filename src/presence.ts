/** Original procedural body sounds: running breath and a proximity heartbeat. */
export const HEART_NEAR=1.15;export const HEART_FAR=15;
export function clamp(value:number,min:number,max:number){return Math.max(min,Math.min(max,value))}
export function heartbeatInterval(distance:number){
 const t=clamp((distance-HEART_NEAR)/(HEART_FAR-HEART_NEAR),0,1);
 return .36+t*.64;
}
export function heartbeatGain(distance:number,chasing:boolean){
 if(distance>HEART_FAR&&!chasing)return 0;
 const proximity=1-clamp((distance-HEART_NEAR)/(HEART_FAR-HEART_NEAR),0,1);
 return (.07+proximity*proximity*.52)*(chasing?1.15:1);
}
export type PresenceState={running:boolean;moving:boolean;distance:number;chasing:boolean;hidden:boolean;active:boolean;speaking:boolean;volume:number};

type Graph={ctx:AudioContext;master:GainNode};
let graph:Graph|undefined;
let bus:GainNode|undefined;
let nextBeat=0,nextBreath=0,inhale=true,effort=0;

export function connectPresence(ctx:AudioContext,master:GainNode){
 graph={ctx,master};
 if(!bus||bus.context!==ctx){bus=ctx.createGain();bus.gain.value=0;bus.connect(master)}
}

export function silencePresence(){
 effort=0;nextBeat=0;nextBreath=0;inhale=true;
 if(bus&&graph)bus.gain.cancelScheduledValues(graph.ctx.currentTime),bus.gain.setValueAtTime(0,graph.ctx.currentTime);
}

function thump(when:number,freq:number,amp:number,duration:number){
 if(!graph||!bus)return;
 const {ctx}=graph,osc=ctx.createOscillator(),tone=ctx.createOscillator(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();
 osc.type='sine';osc.frequency.setValueAtTime(freq,when);osc.frequency.exponentialRampToValueAtTime(freq*.55,when+duration);
 tone.type='triangle';tone.frequency.setValueAtTime(freq*2.1,when);
 filter.type='lowpass';filter.frequency.value=220;
 gain.gain.setValueAtTime(0.0001,when);
 gain.gain.exponentialRampToValueAtTime(Math.max(.0002,amp),when+.018);
 gain.gain.exponentialRampToValueAtTime(.0001,when+duration);
 osc.connect(filter);tone.connect(filter);filter.connect(gain).connect(bus);
 osc.start(when);tone.start(when);osc.stop(when+duration);tone.stop(when+duration);
 osc.onended=()=>{osc.disconnect();tone.disconnect();filter.disconnect();gain.disconnect()};
}

function breath(when:number,amp:number,inhaleNow:boolean){
 if(!graph||!bus)return;
 const {ctx}=graph,duration=inhaleNow?.22:.38,len=Math.ceil(duration*ctx.sampleRate);
 const buffer=ctx.createBuffer(1,len,ctx.sampleRate),data=buffer.getChannelData(0);
 let seed=2000+Math.floor(when*1000),low=0;
 for(let i=0;i<len;i++){
  seed=(seed*1664525+1013904223)>>>0;
  const n=seed/4294967296*2-1;low+=.12*(n-low);
  const t=i/len,env=Math.sin(Math.PI*t)**(inhaleNow?1.1:1.6);
  data[i]=(n*.65+low*.35)*env;
 }
 const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
 source.buffer=buffer;filter.type='bandpass';filter.frequency.value=inhaleNow?1150:750;filter.Q.value=inhaleNow?.85:.7;
 gain.gain.setValueAtTime(amp*(inhaleNow?.55:.85),when);
 source.connect(filter).connect(gain).connect(bus);
 source.start(when);source.stop(when+duration+.01);
 source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect()};
}

export function updatePresence(dt:number,state:PresenceState){
 if(!graph||!bus)return;
 const {ctx}=graph,now=ctx.currentTime;
 if(!state.active||state.volume<=0){silencePresence();return}
 const want=state.hidden?.04:1;
 bus.gain.cancelScheduledValues(now);
 bus.gain.setTargetAtTime(want*(state.speaking?.45:1),now,.05);
 effort=clamp(effort+(state.running&&state.moving?1.6:-.7)*dt,0,1);
 const beatAmp=heartbeatGain(state.distance,state.chasing)*state.volume*1.15;
 if(beatAmp>0.01){
  if(nextBeat<now-.5)nextBeat=now;
  if(now>=nextBeat){
   const interval=heartbeatInterval(state.distance);
   const tight=1-clamp((state.distance-HEART_NEAR)/(HEART_FAR-HEART_NEAR),0,1);
   thump(nextBeat,52+tight*10,beatAmp,.16);
   thump(nextBeat+.09-.03*tight,68+tight*14,beatAmp*.72,.13);
   nextBeat+=interval;
  }
 }
 const pant=effort*(state.hidden?0:1)*state.volume;
 if(pant>.12){
  if(nextBreath<now-.6)nextBreath=now;
  if(now>=nextBreath){
   breath(nextBreath,pant*.42,inhale);
   nextBreath+=inhale?(.26-.06*effort):(.4-.1*effort);
   inhale=!inhale;
  }
 }else inhale=true;
}
