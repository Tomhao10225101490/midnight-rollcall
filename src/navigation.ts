import * as T from 'three';import{clear,groundAt}from './world';
/** The continuous player space extends beyond grid centres; route to the nearest safe centre. */
export function findPath(origin:T.Vector3,target:T.Vector3){
 const within=(x:number,z:number)=>x>=-22&&x<=22&&z>=-68&&z<=21;
 const cache=new Map<string,boolean>();const walkable=(x:number,z:number)=>{const key=x+','+z;if(!cache.has(key))cache.set(key,within(x,z)&&clear(x,z,true,groundAt(x,z)));return cache.get(key)!};
 const segment=(a:T.Vector3,b:T.Vector3)=>{const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/.2));for(let i=1;i<=n;i++){const t=i/n;if(!clear(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t,true))return false}return true};
 const candidates:T.Vector3[]=[];for(let x=Math.floor(origin.x)-1;x<=Math.ceil(origin.x)+1;x++)for(let z=Math.floor(origin.z)-1;z<=Math.ceil(origin.z)+1;z++){const point=new T.Vector3(x,1,z);if(walkable(x,z)&&segment(origin,point))candidates.push(point)}
 candidates.sort((a,b)=>a.distanceToSquared(origin)-b.distanceToSquared(origin));const start=candidates[0];if(!start)return[];
 const key=(p:T.Vector3)=>p.x+','+p.z,queue=[start],parents=new Map<string,T.Vector3|null>([[key(start),null]]);
 const end=new T.Vector3(T.MathUtils.clamp(Math.round(target.x),-22,22),1,T.MathUtils.clamp(Math.round(target.z),-68,21));let best=start,bestDistance=start.distanceToSquared(target);
 for(let i=0;i<queue.length;i++){const p=queue[i],distance=p.distanceToSquared(target);if(distance<bestDistance){best=p;bestDistance=distance}if(p.equals(end)){best=p;break}
  for(const[dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const next=new T.Vector3(p.x+dx,1,p.z+dz);if(parents.has(key(next))||!walkable(next.x,next.z)||Math.abs(groundAt(next.x,next.z)-groundAt(p.x,p.z))>.35||!segment(p,next))continue;parents.set(key(next),p);queue.push(next)}
 }
 const path:T.Vector3[]=[];let node:T.Vector3|null=best;while(node){path.unshift(node);node=parents.get(key(node))??null}
 if(origin.distanceTo(path[0])<.12)path.shift();
 // Finish the last fraction of a metre only when it is collision-free. Never teleport.
 const floorTarget=new T.Vector3(target.x,1,target.z);if(best.distanceTo(floorTarget)<1.5&&clear(floorTarget.x,floorTarget.z,true)&&segment(best,floorTarget))path.push(floorTarget);
 return path;
}
