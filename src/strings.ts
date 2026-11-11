/** Original damped string waveguide. No recordings, soundfonts or network assets. */
export function pluckedString(frequency:number,seconds:number,sampleRate:number){
 if(!Number.isFinite(frequency)||frequency<40||frequency>2000||!Number.isFinite(seconds)||seconds<=0||seconds>12||!Number.isFinite(sampleRate)||sampleRate<8000||sampleRate>192000)throw Error('Invalid string synthesis parameters');
 const count=Math.ceil(seconds*sampleRate),output=new Float32Array(count);
 // The averaging filter contributes half a sample of phase delay.
 const delay=sampleRate/frequency-.5,size=Math.ceil(delay)+2,ring=new Float32Array(size);let seed=731;
 for(let i=0;i<size;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;ring[i]=(seed/4294967296*2-1)*.7}
 let previous=0,dcInput=0,dcOutput=0,peak=0;
 const damping=Math.exp(-3/(seconds*frequency));
 for(let i=0;i<count;i++){
  const write=i%size,read=(write-delay+size)%size,lo=Math.floor(read),fraction=read-lo;
  const current=ring[lo]*(1-fraction)+ring[(lo+1)%size]*fraction;
  ring[write]=(current+previous)*.5*damping;previous=current;
  const filtered=current-dcInput+.995*dcOutput;dcInput=current;dcOutput=filtered;
  const attack=Math.min(1,i/(sampleRate*.004)),release=Math.min(1,(count-1-i)/(sampleRate*.06));
  output[i]=filtered*attack*release;peak=Math.max(peak,Math.abs(output[i]));
 }
 if(peak>0)for(let i=0;i<count;i++)output[i]*=.22/peak;
 return output;
}
