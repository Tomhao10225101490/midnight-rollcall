/** Original procedural foley. No recordings, external samples or network dependencies. */
export type Effect='step'|'door'|'bell'|'radio'|'knock';
export function synthesize(kind:Effect,rate:number,seed=731){
 const length={step:.24,door:.8,bell:3.8,radio:.55,knock:1.8}[kind];
 const output=new Float32Array(Math.ceil(length*rate));let low=0;
 for(let i=0;i<output.length;i++){
  const t=i/rate;seed=(seed*1664525+1013904223)>>>0;const noise=seed/4294967296*2-1;low+=.08*(noise-low);let sample=0;
  if(kind==='step'){
   const heel=Math.sin(2*Math.PI*76*t)*Math.exp(-t*38),sole=(noise-low)*Math.exp(-t*26);
   const toe=Math.max(0,t-.055);sample=(heel*.48+sole*.13)*Math.min(1,t*700)+(t>.055?Math.sin(2*Math.PI*125*toe)*Math.exp(-toe*65)*.15:0);
  }else if(kind==='door'){
   const scrape=Math.sin(2*Math.PI*(175*t+45*t*t))*.11*Math.sin(Math.PI*Math.min(t/.58,1));
   const latch=t>.58?(Math.sin(2*Math.PI*830*(t-.58))*.23+noise*.12)*Math.exp(-(t-.58)*42):0;
   sample=scrape+low*.09*Math.sin(Math.PI*t/length)+latch;
  }else if(kind==='knock'){
   for(const start of [0,.48,1.1]){const u=t-start;if(u>=0)sample+=(Math.sin(2*Math.PI*118*u)*.32+Math.sin(2*Math.PI*287*u)*.13+noise*.05)*Math.exp(-u*23)*Math.min(1,u*900)}
  }else if(kind==='bell'){
   for(const start of [0,.62]){const u=t-start;if(u<0)continue;
    for(const [ratio,amp,decay]of [[1,.22,1.4],[2.71,.08,2.1],[4.08,.035,3.3],[5.43,.016,5]])sample+=Math.sin(2*Math.PI*440*ratio*u)*amp*Math.exp(-u*decay)*Math.min(1,u*1000);
   }
  }else{
   sample=(noise-low)*.09*Math.exp(-t*13);
   for(const [start,f]of [[.08,523.25],[.25,392]]){const u=t-start;if(u>=0)sample+=Math.sin(2*Math.PI*f*u)*.12*Math.exp(-u*14)*Math.min(1,u*600)}
  }
  const fade=Math.min(1,(length-t)*100);output[i]=Math.tanh(sample)*fade;
 }
 return output;
}
