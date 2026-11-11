import{doorLeaf}from './door-model';
import * as T from 'three';import{scene,walls,doorBounds}from './world';
export const doors:Door[]=[];
let occupants:()=>readonly T.Vector3[]=()=>[];
export function setDoorOccupants(read:()=>readonly T.Vector3[]){occupants=read}
const overlaps=(bounds:T.Box3,p:T.Vector3)=>!bounds.isEmpty()&&p.x>bounds.min.x-.3&&p.x<bounds.max.x+.3&&p.z>bounds.min.z-.3&&p.z<bounds.max.z+.3;
export class Door{
 open=false;bounds:T.Box3;leaves:T.Group[]=[];leafBounds=[new T.Box3(),new T.Box3()];
 constructor(public x:number,public z:number){this.bounds=this.closedBounds();walls.push(this.bounds,...this.leafBounds);doorBounds.add(this.bounds);for(const side of [-1,1]){const pivot=new T.Group();pivot.position.set(x,0,z+side*1.4);scene.add(pivot);pivot.add(doorLeaf(side));this.leaves.push(pivot)}}
 private closedBounds(){return new T.Box3(new T.Vector3(this.x-.12,0,this.z-1.5),new T.Vector3(this.x+.12,2.7,this.z+1.5))}
 private openedBounds(){const end=this.x+Math.sign(this.x)*1.42;return[-1,1].map(side=>new T.Box3(new T.Vector3(Math.min(this.x,end)-.03,0,this.z+side*1.4-.15),new T.Vector3(Math.max(this.x,end)+.03,2.7,this.z+side*1.4+.15)))}
 set(open:boolean,people:readonly T.Vector3[]=occupants()){
  if(open===this.open)return true;
  const proposed=open?this.openedBounds():[this.closedBounds()];
  // Never place a newly solid door through a player or the patrol character.
  if(people.some(p=>proposed.some(b=>overlaps(b,p))))return false;
  this.open=open;this.leaves.forEach((leaf,i)=>leaf.rotation.y=open?(i===0?1:-1)*(this.x<0?-1:1)*Math.PI/2:0);
  if(open){this.bounds.makeEmpty();this.leafBounds.forEach((b,i)=>b.copy(proposed[i]))}
  else{this.bounds.copy(proposed[0]);this.leafBounds.forEach(b=>b.makeEmpty())}
  return true;
 }
}
export function initDoors(){for(const x of [-4,4])for(const z of [-15,-5,5,15])doors.push(new Door(x,z))}
export function nearestDoor(p:T.Vector3,range=2){return doors.find(d=>Math.hypot(d.x-p.x,d.z-p.z)<range)}
export function resetDoors(){doors.forEach(d=>d.set(false,[]))}
export function openForEnemy(p:T.Vector3){const door=nearestDoor(p,1.35);if(door&&!door.open)door.set(true,[...occupants(),p])}
