export const options={volume:.3,sensitivity:2,quality:1,fov:75,ambientOcclusion:true};
export function validatedSettings(value:unknown){
 const v=value&&typeof value==='object'?value as Record<string,unknown>:{};
 const finite=(key:string,fallback:number)=>typeof v[key]==='number'&&Number.isFinite(v[key])?v[key] as number:fallback;
 return{ambientOcclusion:typeof v.ambientOcclusion==='boolean'?v.ambientOcclusion:true,volume:Math.max(0,Math.min(1,finite('volume',.3))),sensitivity:Math.max(1,Math.min(5,finite('sensitivity',2))),quality:[.75,1,1.5,2].includes(finite('quality',1))?finite('quality',1):1,fov:Math.max(65,Math.min(100,finite('fov',75)))};
}
try{Object.assign(options,validatedSettings(JSON.parse(localStorage.getItem('rollcall-settings')||'null')))}catch{}
export function persist(){try{localStorage.setItem('rollcall-settings',JSON.stringify(options))}catch{}}
